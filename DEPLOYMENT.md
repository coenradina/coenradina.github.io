# Deployment

The site and the contact form are deployed separately.

## Website: GitHub Pages

Every push to `main` runs `.github/workflows/deploy-pages.yml`, which builds the Vite app and publishes `dist/` to GitHub Pages. The custom domain is `aastr.id`.

GitHub Pages can't send custom HTTP headers, so the production build adds a Content Security Policy as a `<meta>` tag (see `productionSecurityHeaders` in `vite.config.ts`). If you add a script, font, image host or API, add its origin to that policy or the browser will block it.

## Contact form: Firebase (project `aastr-portfolio`, Blaze plan)

The form posts to the `contact` Cloud Function in `functions/index.js` (region `us-central1`). For each request the function:

1. Rejects any `Origin` other than `https://aastr.id` and `https://www.aastr.id`.
2. Accepts only JSON POST bodies up to 20 KB with exactly the expected fields (`functions/validate.js`).
3. Rejects line breaks and control characters in the name and email, so they can't inject email headers.
4. Limits each IP to 5 attempts an hour. IPs are stored only as salted SHA-256 hashes.
5. Verifies the Cloudflare Turnstile token with Cloudflare and checks that the hostname is aastr.id.
6. Caps delivered messages at 50 a day across all senders. This count only goes up after Turnstile passes, so fake requests can't use it up.
7. Saves the message to Firestore `messages`, then emails it to hello@aastr.id through Hostinger SMTP.

Firestore rules deny all browser access (`firestore.rules`), so only the function can read or write data. `maxInstances: 2` limits how far a flood can scale the function, which also limits cost.

### Secrets

Secrets live in Google Secret Manager and never go in the repo. Set them from a terminal:

```bash
firebase functions:secrets:set TURNSTILE_SECRET
firebase functions:secrets:set SMTP_PASSWORD
openssl rand -hex 32 | firebase functions:secrets:set IP_HASH_SALT --data-file=-
```

### Deploying the function

```bash
cd functions && npm install && npm test && cd ..
firebase deploy --only functions,firestore:rules
```

### Reading messages

Every message is in the Firebase console, under Firestore Database, in the `messages` collection, even if the email failed to send (`emailed: false`).
