# BLN Security Solutions Website

This project now includes a Node.js and Express backend for the contact form.

## Install

```bash
npm install
```

## Configure `.env`

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Then update these values:

- `FRONTEND_ORIGIN`: the exact URL of your website, for example `http://localhost:3000` locally or your live domain in production.
- `CONTACT_TO`: your business email address that should receive form messages.
- `CONTACT_FROM`: a verified sender email address from your email provider.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`: SMTP credentials from your email provider.

Do not put real passwords or API keys in `.env.example`, GitHub, or frontend JavaScript.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The Express server serves the existing frontend and handles:

```text
POST /api/contact
```

## Production Start

```bash
npm start
```

## Deploy

1. Upload the project to a Node.js hosting provider such as Render, Railway, Fly.io, DigitalOcean, or a VPS.
2. Set the same environment variables from `.env.example` in your hosting dashboard.
3. Set `NODE_ENV=production`.
4. Set `FRONTEND_ORIGIN` to your real website URL, for example `https://your-domain.de`.
5. Use `npm install` as the build/install command.
6. Use `npm start` as the start command.
7. Make sure your email provider allows SMTP sending from the host.

## Contact Form Behavior

The backend validates `name`, `email`, `phone`, `service`, and `message`. Empty messages are rejected, repeated submissions are rate limited, and successful submissions are sent with Nodemailer.
