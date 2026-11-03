# Screenshot intake and attribution checklist

The latest chat screenshots describe the following workflows. Their captions are incorporated into the editorial workflow cards, but the images themselves were **not available as mounted file bytes when this package was built**. Do not label them as included in the gallery until image files are accessible and linked in `data/portfolio-data.js`.

- [ ] Kobe Mosque reconstruction process screenshots (additional to the two rendered views already in `kobe-mosque-new`).
- [ ] Other site point-cloud screenshots and reconstruction inspection stages.
- [ ] Sketchfab online model gallery/screenshots.
- [ ] Agisoft Metashape workflow combining LiDAR products and satellite imagery.
- [ ] MAHS Unity VR Gallery screenshots.
- [ ] DJI Terra aerial LiDAR processing screenshots.

### Adding files later
Place a verified image in `assets/images/<project-id>/`, add its relative path to the matching project's `images` array inside `data/portfolio-data.js`, and add a clear, non-sensitive image caption in `alt`. Record project contribution and image permissions accurately. The current technical-workflow cards can be edited via `workflows` in the same JavaScript data file.
