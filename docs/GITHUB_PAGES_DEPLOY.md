# GitHub Pages Deployment

This repository is ready to publish as a static GitHub Pages site.

## What Gets Published

The GitHub Actions workflow at `.github/workflows/pages.yml` publishes:

- `index.html`
- `reports.json`
- `.nojekyll`
- `assets/`
- `reports/`

The published site is a static report workbench. It fetches `reports.json`, renders the Markdown files under `reports/`, and runs search/filter interactions in the browser.

## First-Time Setup

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to **Settings -> Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**.
5. Go to **Actions** and run **Deploy GitHub Pages**, or push to `main` / `master`.

For `https://github.com/hxy1997/moneymoney`, the default Pages URL should be:

```text
https://hxy1997.github.io/moneymoney/
```

## Updating Reports

When adding a new report:

1. Add the Markdown report under `reports/`.
2. Add or update its entry in `reports.json`.
3. Push to `main` or `master`.

The workflow will publish the new version automatically.

## Local Preview

Run from the repository root:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open:

```text
http://127.0.0.1:8765/
```

If a proxy is enabled, bypass `localhost`, `127.0.0.1`, and `::1`.

## Notes

- There is no build step.
- Relative paths are used so the site works from a GitHub Pages project URL such as `/moneymoney/`.
- External browser libraries are loaded from CDN in `index.html`.
