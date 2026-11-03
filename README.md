# Sheak Mahfujur Rahman — digital heritage portfolio

A static, responsive research portfolio built for GitHub Pages. No build step or external JavaScript framework is required.

## Review locally

Open `index.html` in a browser. All images are stored under `assets/images/`. Sketchfab 3D previews require an internet connection and load only when a visitor requests them. Alternatively open the self-contained preview supplied separately.

## Publish after review

Upload all site contents (not the enclosing folder) to the root of the `sunnymahfuj7t.github.io` GitHub repository. In **Settings → Pages**, set **Deploy from a branch**, select `main`, folder `/(root)`.

## Edit

- Main homepage and About wording: `index.html`
- Project names, descriptions, ordering, links and images: `data/portfolio-data.js`
- Styling and mobile layout: `assets/css/styles.css`
- Viewer/filter interaction: `assets/js/app.js`

Keep MAHS and other rights-holder credit and verify any unconfirmed project metadata before publishing.


### Publish to your existing GitHub Pages site

Unzip this package. Upload the three updated files to your existing repository, preserving their relative paths and overwriting the old versions:

- `index.html`
- `data/portfolio-data.js`
- `assets/js/app.js`

You do not need to re-upload unchanged image assets. If you prefer to upload the entire ZIP contents instead, **extract the ZIP first** and upload the contents, not the ZIP itself. Make sure `index.html` stays at the repository root. Commit the changes to `main`. Your existing GitHub Pages configuration (`main` and `/(root)`) will redeploy the site. Refresh with Ctrl+Shift+R if you see the older page.
