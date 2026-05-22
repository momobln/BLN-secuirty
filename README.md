# BLN Security Solutions Website

Static HTML, CSS, and JavaScript website for BLN Security Solutions.

## Project Structure

- `index.html` is the production entry point.
- `styles.css` contains the site styling.
- `script.js` handles navigation, scroll effects, and the static contact form handoff.
- `assets/` contains static images and icons.
- `scripts/build-static.js` copies the production files into `dist/`.
- `scripts/serve-static.js` serves the built `dist/` folder for local checks.
- `vercel.json` tells Vercel to run the static build and serve `dist/`.

## Run Locally

```bash
npm test
npm run preview
```

Then open:

```text
http://127.0.0.1:4173
```

## Contact Form

The contact form opens the visitor's email client with a prepared message to:

```text
info@bln-security-solutions.de
```

## Deploy

Deploy the repository to Vercel as a static site. The build command is `npm run build` and the output directory is `dist`.

No server command, environment variables, API keys, or backend runtime are required.
