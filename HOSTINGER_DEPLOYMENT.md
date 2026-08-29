# Contact form deployment on Hostinger

The form posts to `/api/contact.php`, which sends messages only to
`hello@aastr.id`. The endpoint must be hosted by a Hostinger plan with PHP and
outbound mail enabled.

## 1. Create the domain mailboxes

In Hostinger hPanel, configure `hello@aastr.id`. Also create
`contact-form@aastr.id`, which the endpoint uses as its sender. Confirm that the
domain's SPF and DKIM records are enabled in hPanel; these affect deliverability.

## 2. Create a Cloudflare Turnstile widget

Create a Turnstile widget for both `aastr.id` and `www.aastr.id`. It provides a
public site key and a private secret key.

Set the site key when building the Vite app:

```sh
VITE_TURNSTILE_SITE_KEY="YOUR_PUBLIC_SITE_KEY" npm run build
```

Never put the Turnstile secret in `VITE_*`, source control, or `public_html`.
Vite exposes all `VITE_*` values to browsers.

## 3. Install the private server configuration

Copy `hostinger/contact-config.example.php` to:

```text
/home/YOUR_HOSTINGER_USER/contact-config.php
```

Replace the placeholder with the private Turnstile secret. The default endpoint
looks for this file one directory above Hostinger's `public_html` directory.

## 4. Upload the production build

Upload the *contents* of `dist/` into `public_html`. Vite copies the PHP endpoint
to `dist/api/contact.php` during the build.

Test a real submission after the site's HTTPS certificate is active. If the UI
reports that mail could not be sent, inspect Hostinger's PHP error log and verify
that PHP `mail()` is enabled for the plan.

## 5. DDoS and abuse protection

The endpoint validates Turnstile on the server, rejects cross-origin requests,
limits payload and field sizes, uses a honeypot and timing check, prevents mail
header injection, and permits five attempts per IP per hour.

Application throttling does not stop a network-level DDoS attack. Put the domain
behind Cloudflare's proxy (or enable Hostinger's equivalent CDN/WAF and DDoS
protection), keep HTTPS enforced, and enable managed WAF rules. When proxying the
site, configure Hostinger to restore the real visitor IP before relying on the
per-IP limit; the endpoint intentionally does not trust arbitrary forwarded-IP
headers.
