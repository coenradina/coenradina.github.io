<?php
// Copy this file to /home/YOUR_HOSTINGER_USER/contact-config.php.
// It must sit one directory ABOVE public_html so visitors cannot download it.
return [
    'turnstile_secret' => 'PASTE_YOUR_CLOUDFLARE_TURNSTILE_SECRET_KEY_HERE',
    'allowed_origins' => [
        'https://aastr.id',
        'https://www.aastr.id',
    ],
    'turnstile_hostnames' => [
        'aastr.id',
        'www.aastr.id',
    ],
    'from_address' => 'contact-form@aastr.id',
    'rate_limit' => 5,
];
