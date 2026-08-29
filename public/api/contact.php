<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');

function respond(int $status, string $message, bool $ok = false): never
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength < 1 || $contentLength > 20000) {
    respond(413, 'Request is too large.');
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, 'Unsupported request format.');
}

// Keep the real file one directory above public_html, never in the web root.
$configPath = getenv('CONTACT_CONFIG_PATH');
if (!is_string($configPath) || $configPath === '') {
    $documentRoot = rtrim((string) ($_SERVER['DOCUMENT_ROOT'] ?? ''), DIRECTORY_SEPARATOR);
    $configPath = dirname($documentRoot) . DIRECTORY_SEPARATOR . 'contact-config.php';
}

if (!is_file($configPath)) {
    error_log('Contact form configuration file was not found.');
    respond(503, 'The contact form is temporarily unavailable.');
}

$config = require $configPath;
if (!is_array($config) || empty($config['turnstile_secret'])) {
    error_log('Contact form configuration is invalid.');
    respond(503, 'The contact form is temporarily unavailable.');
}

$allowedOrigins = $config['allowed_origins'] ?? ['https://aastr.id', 'https://www.aastr.id'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!is_string($origin) || !in_array($origin, $allowedOrigins, true)) {
    respond(403, 'Request rejected.');
}

$rawBody = file_get_contents('php://input');
$data = json_decode(is_string($rawBody) ? $rawBody : '', true);
if (!is_array($data)) {
    respond(400, 'Invalid request.');
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));
$category = trim((string) ($data['category'] ?? ''));
$honeypot = trim((string) ($data['website'] ?? ''));
$turnstileToken = trim((string) ($data['turnstileToken'] ?? ''));
$startedAt = filter_var($data['startedAt'] ?? null, FILTER_VALIDATE_INT);

// Silently accept obvious bot submissions so bots get no useful feedback.
if ($honeypot !== '') {
    respond(202, 'Thanks—your note has been sent.', true);
}

$nowMs = (int) floor(microtime(true) * 1000);
if ($startedAt === false || $startedAt > $nowMs || ($nowMs - $startedAt) < 2500 || ($nowMs - $startedAt) > 7200000) {
    respond(400, 'Please refresh the page and try again.');
}

if (
    $name === '' || mb_strlen($name) > 100 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 254 ||
    mb_strlen($message) < 8 || mb_strlen($message) > 5000 ||
    $category === '' || mb_strlen($category) > 80 ||
    $turnstileToken === '' || strlen($turnstileToken) > 2048
) {
    respond(422, 'Please check the form fields and try again.');
}

if (preg_match('/[\r\n]/', $name . $email . $category)) {
    respond(422, 'Please check the form fields and try again.');
}

function clientIp(): string
{
    // REMOTE_ADDR is authoritative unless the origin server is explicitly configured
    // to trust a reverse proxy. Trusting arbitrary forwarded headers enables bypasses.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

function enforceRateLimit(string $ip, int $maxAttempts, int $windowSeconds): void
{
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'aastr-contact-limits';
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        error_log('Contact rate-limit directory could not be created.');
        respond(503, 'The contact form is temporarily unavailable.');
    }

    $path = $directory . DIRECTORY_SEPARATOR . hash('sha256', $ip) . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        error_log('Contact rate-limit file could not be locked.');
        respond(503, 'The contact form is temporarily unavailable.');
    }

    $contents = stream_get_contents($handle);
    $attempts = json_decode(is_string($contents) ? $contents : '[]', true);
    if (!is_array($attempts)) $attempts = [];

    $cutoff = time() - $windowSeconds;
    $attempts = array_values(array_filter($attempts, static fn ($time): bool => is_int($time) && $time >= $cutoff));

    if (count($attempts) >= $maxAttempts) {
        flock($handle, LOCK_UN);
        fclose($handle);
        header('Retry-After: ' . $windowSeconds);
        respond(429, 'Too many attempts. Please try again later.');
    }

    $attempts[] = time();
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($attempts));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

enforceRateLimit(clientIp(), (int) ($config['rate_limit'] ?? 5), 3600);

$verificationPayload = http_build_query([
    'secret' => (string) $config['turnstile_secret'],
    'response' => $turnstileToken,
    'remoteip' => clientIp(),
]);

$verificationContext = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n" .
                    'Content-Length: ' . strlen($verificationPayload) . "\r\n",
        'content' => $verificationPayload,
        'timeout' => 8,
        'ignore_errors' => true,
    ],
]);

$verificationResponse = file_get_contents(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    false,
    $verificationContext,
);
$verification = json_decode(is_string($verificationResponse) ? $verificationResponse : '', true);

if (!is_array($verification) || ($verification['success'] ?? false) !== true) {
    respond(403, 'Anti-spam verification failed. Please try again.');
}

$expectedHostnames = $config['turnstile_hostnames'] ?? ['aastr.id', 'www.aastr.id'];
if (!in_array((string) ($verification['hostname'] ?? ''), $expectedHostnames, true)) {
    error_log('Turnstile returned an unexpected hostname.');
    respond(403, 'Anti-spam verification failed. Please try again.');
}

$recipient = 'hello@aastr.id';
$from = (string) ($config['from_address'] ?? 'contact-form@aastr.id');
$safeName = preg_replace('/[\x00-\x1F\x7F]/u', '', $name) ?: 'Website visitor';
$subject = 'Portfolio contact: ' . $category;
$body = "New portfolio contact\n\n" .
        "Name: {$safeName}\n" .
        "Email: {$email}\n" .
        "Category: {$category}\n\n" .
        "Message:\n{$message}\n";
$headers = [
    'From: Aastr.id contact form <' . $from . '>',
    'Reply-To: ' . $safeName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Auto-Response-Suppress: All',
];

if (!mail($recipient, $subject, $body, implode("\r\n", $headers))) {
    error_log('Contact form mail() call failed.');
    respond(503, 'Your note could not be sent right now. Please try again later.');
}

respond(202, 'Thanks—your note has been sent.', true);
