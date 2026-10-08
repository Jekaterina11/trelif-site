# TreLif website — approved checkpoint

Approved state recorded on 8 October 2026. Preserve the current website design exactly.

## Approved Lifee

- Approved image: `assets/images/lifee-web-clean.png` (1278 × 1230 PNG).
- `index.html` uses this image in the “Meet Lifee” section, with the caption “Lifee · Your TreLif companion”.
- The owner confirms Lifee displays successfully on the local website. This checkpoint records that approval; it does not introduce a new visual review.
- Keep the image, proportions, placement, colours, typography, spacing and responsive layout unchanged.

## Current website map

- `index.html`: home navigation, TreLif hero, “Meet Lifee” panel with Morning / Your day / Training / Progress cards, six product feature cards, privacy and wellness notes, and footer.
- `assets/css/style.css`: shared styles, responsive layouts, Lifee section styling and reduced-motion support. The Lifee panel stacks below 900px; its feature cards stack below 640px.
- `assets/images/trelif-logo-web-new.png`: current home hero logo.
- `assets/images/trelif-logo.png`: current Privacy, Support and 404 header logo.
- `privacy/index.html`: existing 18-section privacy policy.
- `support/index.html`: support contact and FAQ.
- `404.html`: missing-page view and GitHub Pages base-path handling.
- `README.md` and `assets/images/README.md`: existing project and logo notes. Their statement that every header contains a logo predates the approved home layout; the home logo currently appears in the hero.

The website is static HTML/CSS with relative asset paths, system fonts and no build step or backend. The home page retains its “Coming to the App Store” notice. The approved Lifee is currently a static image; no particle animation or voice playback is integrated.

## Next phase

Implement the Lifee Awakening particle animation and integrate the existing recorded voice greetings while preserving the approved design. Recorded greeting files are not present in this repository at this checkpoint; locate or obtain the existing recordings within the authorised scope before integration. Do not substitute newly generated recordings.

## Checkpoint scope

Commit message: `checkpoint: approved Lifee design before animation`.

Include the existing website changes, this map and the three images actually referenced by the pages. Other Lifee/logo variants and `assets/.DS_Store` remain untouched and untracked; they are not approved replacements or required runtime assets.

Before committing, review tracked changes and untracked files, confirm the approved Lifee reference and check repository content for secret indicators. Secret scanning is a best-effort check, not proof that every possible secret is absent. Preserve all pre-existing website and image bytes. Create the checkpoint locally only; do not push to GitHub or access BikiniFit.
