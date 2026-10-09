# TreLif website map and development roadmap

Approved checkpoint: 8 October 2026, before Lifee Awakening animation.

Current portrait: the newly approved Lifee 2.0 asset `assets/images/lifee-portrait-v2.png`. The implementation sections below preserve the history of the earlier portrait/effects; the latest Lifee 2.0 section supersedes their visual attachment details.

## Project and preview

- Project: `/Users/katrina/Documents/trelif-site`
- Website/domain: TreLif / `trelif.app`
- Local preview: `http://127.0.0.1:8000/`
- Static HTML/CSS website with local Canvas 2D JavaScript for Lifee Awakening and local multilingual introduction playback; no build step or external runtime dependencies.
- Preview command from this directory: `python3 -m http.server 8000 --bind 127.0.0.1`
- This checkpoint is local only. Domain publication and deployment are not verified here.

## Current approved design

- Home hero, TreLif logo and navigation are approved.
- Meet Lifee has a rounded outer container and a continuous soft lavender/pink gradient.
- Left-side content: MEET LIFEE, heading, description, and Morning, Your day, Training and Progress cards.
- Right-side visual: `assets/images/lifee-portrait-v2.png`, a 1302 × 1208 transparent PNG. The former `lifee-web-clean.png` is retained unchanged as the earlier approved asset.
- Full rounded head, neck and shoulders are visible, centered and displayed proportionally with the approved `brightness(0.8) saturate(0.88)` CSS adjustment on the portrait and particles; original PNG bytes remain unchanged.
- No decorative circles, ovals, orbital lines or rectangular image background behind Lifee.
- Caption must remain exactly: `Lifee · Your TreLif companion`.
- Desktop layout uses two columns. At 900px and below the Lifee panel stacks; at 640px and below its feature cards stack.

## File map

| Path | Purpose |
| --- | --- |
| `index.html` | Home hero, Meet Lifee markup, feature sections, navigation and footer |
| `assets/css/style.css` | Shared styling, scoped `.lifee-*` styles and responsive breakpoints |
| `assets/js/lifee-awakening.js` | Lifee particle network, approved-image sampling, awakening, Replay, accessibility and fallback behavior |
| `assets/js/lifee-voice.js` | EN/LV/RU introductions, gesture-unlocked playback, analyser signal, mute and recovery controls |
| `assets/js/lifee-alive.js` | Post-awakening breathing, sampled silhouette pulses and amplitude-driven neural lights |
| `assets/audio/lifee-intro-{en,lv,ru}.mp3` | Existing approved introduction recordings; preserve original bytes |
| `assets/images/lifee-portrait-v2.png` | Current approved Lifee 2.0 transparent portrait; preserve original bytes |
| `assets/images/lifee-web-clean.png` | Earlier approved portrait retained unchanged |
| `assets/images/trelif-logo-web-new.png` | Approved Home hero logo |
| `assets/images/trelif-logo.png` | Existing logo used by Privacy, Support and 404 headers |
| `privacy/index.html` | Existing Privacy page |
| `support/index.html` | Existing Support page |
| `404.html` | Existing missing-page view |
| `README.md` | General project/hosting notes; some logo and verification descriptions predate this checkpoint |
| `assets/images/README.md` | Original logo notes; Home now uses the hero logo path above |
| `MAP.md` | Current approved state and future development roadmap |

Unused local image variants are not part of this checkpoint. The three introduction recordings are now available within this project and integrated below. No other project was accessed.

## Completed

- Approved static Home hero and Meet Lifee design.
- Approved transparent image integrated with correct intrinsic dimensions and proportional sizing.
- Caption and four Lifee cards preserved.
- Desktop (1440px) and mobile (390px) appearance visually checked in local Firefox preview.
- Homepage and approved image returned HTTP 200 at the local preview.
- Privacy, Support and 404 pages exist; their pending changes included in this checkpoint are earlier logo-header updates.

## Implemented: Lifee Awakening Variant 1

Implemented on `feature/lifee-awakening`, without a new commit or push. `main` retains the approved checkpoint `5f7fa1a00cf0d33440cd37c4093baa7eee46e525`.

- Initial state: the face is hidden after successful initialization; 95 delicate floating luminous particles form an airy network with subtle nearby connections, in lavender, pink, violet and cyan. The prompt reads “Tap to awaken Lifee”.
- A native button supports mouse, touch, Enter and Space. On activation, up to 1,100 sampled visible pixels from the actual approved PNG provide particle targets. An eased convergence lasts 2.5 seconds; the unchanged original image fades in during the final portion and stays visible.
- Replay immediately restarts the 2.5-second assembly from the floating network, followed by the selected introduction. Native controls and live status support assistive technology, with focus transferred between awakening and Replay. Focus uses underlined text rather than decorative rectangular frames.
- Reduced-motion users see a still network and an instant reveal. Changing to reduced motion during assembly completes the reveal immediately.
- The original image is the static fallback when JavaScript or Canvas is unavailable or image sampling fails. Rendering is capped at 2× pixel density, paused offscreen/in hidden tabs, and resized with the existing layout.
- All new visual layers and controls are transparent. Home hero/logo/navigation, left-side text/cards, Lifee caption, lavender/pink background and original images are preserved. No external runtime libraries were added. Voice playback is integrated as documented below.

## Implementation validation

- JavaScript syntax and `git diff --check` passed. Comparison against `main` confirmed unchanged Home header/hero, Lifee copy/cards, caption and referenced image bytes.
- Firefox: floating particles, native mouse click, face assembly/reveal (approximately 2.6 seconds including automation overhead), Replay, Enter/Space and focus transfer passed with no browser JavaScript errors.
- Firefox: native touch activation at 390px and overflow checks at 320, 390, 768, 1024 and 1440px passed. Desktop and mobile-size screenshots were visually reviewed.
- Firefox with a simulated reduced-motion media preference: still network, instant reveal, Replay, resize and enabling reduced motion during assembly passed. Simulated image-sampling failure retained the static image.
- Chromium: JavaScript-disabled and Canvas-unavailable fallback checks passed. Full animation validation in downloaded headless Chromium was blocked by a stalled image decode/readback. Physical iPhone and Safari validation remains a manual review step.
- Temporary browser tooling and screenshots were used only for validation and removed afterwards; none are shipped with the website.

To test, run `python3 -m http.server 8765 --bind 127.0.0.1` from this project and open `http://localhost:8765/`. Scroll to Meet Lifee, observe the network, activate “Tap to awaken Lifee”, wait about 2.5 seconds, then select Replay. Repeat with Tab and Enter/Space, at mobile and desktop widths, with reduced motion enabled, and with JavaScript disabled for the static fallback.

## Implemented: multilingual Lifee introduction — 9 October 2026

- Verified the existing recordings: `lifee-intro-en.mp3` (577,245 bytes, Valentyna English), `lifee-intro-lv.mp3` (685,915 bytes, Ilze Latvian), and `lifee-intro-ru.mp3` (586,022 bytes, ALISA RU). All three MP3 files were readable with macOS `afinfo`; audio files were not edited.
- Compact transparent EN / LV / RU controls appear near Lifee, with English selected by default. Native buttons have language labels, pressed states, keyboard focus indicators and at least 44 × 44px touch targets. Mute/unmute and playback status are accessible; the original caption is preserved.
- Clicking/tapping Lifee unlocks/resumes Web Audio synchronously within the user gesture, loads/decodes the selected local recording, preserves the existing animation, and starts the introduction once the original face is fully revealed. Recordings play once, without looping. No audio is requested before an awakening or explicit playback interaction.
- Replay and clicking the completed face restart both the awakening and selected introduction. Replay/language switching/muting stop the previous source and reset HTML audio; generation checks discard stale asynchronous completions. Switching languages during assembly uses the new selection at reveal; switching after reveal stops playback and offers deliberate Play introduction or Replay.
- Mute remains selected across Replay. Unmute after reveal restarts the selected introduction; unmute during assembly prepares it for the reveal. Leaving the page or hiding its tab stops playback.
- Safari compatibility uses gesture-created/resumed `AudioContext` (including the `webkitAudioContext` alias). If audio is blocked, unavailable or interrupted, the animation still completes and a discreet Play introduction button retries HTML audio directly within a fresh user gesture. No external player/library or generated voice was added.
- Static Canvas fallback retains the approved portrait and offers explicit introduction playback. Reduced motion preserves instant reveal and the same audio lifecycle.

### Voice implementation test status

- JavaScript syntax checks and whitespace validation passed.
- Firefox browser automation exercised actual MP3 decode/playback after the completed reveal for EN, LV and RU; Replay, language switching during assembly, mute/unmute, HTML audio playback, Enter activation, focus transfer and native mobile touch passed without JavaScript errors.
- Responsive overflow checks passed at 320, 390, 768, 1024 and 1440px. All language/mute touch targets meet 44px. Desktop (1440px) and mobile (390px) screenshots were visually reviewed.
- Simulated rejected AudioContext resume retained the animation and exposed Play introduction; explicit HTML playback recovered successfully. Rejecting both Web Audio and HTML playback preserved the face and retry control without unhandled JavaScript errors. Reduced-motion and Canvas-unavailable fallback checks passed.
- Hash comparisons confirm unchanged approved PNG, all three MP3 recordings, Privacy and Support pages. Header/hero, Lifee left-side copy/cards and caption comparisons passed; the reduced-brightness CSS filter remains unchanged.
- Safari desktop automation could not create a session because Allow remote automation is disabled in Safari settings. No Safari preferences were changed. Actual macOS Safari and physical iPhone playback remain manual verification steps; Safari compatibility is implemented but not claimed as device-tested.
- Temporary browser scripts/profile/screenshots are removed after validation and are not shipped.

### How to test

Run `python3 -m http.server 8765 --bind 127.0.0.1` inside this project and visit `http://localhost:8765/`. Scroll to Meet Lifee. With EN selected, tap Lifee and confirm the English greeting starts only after the face appears. Select LV or RU, confirm previous audio stops, then choose Replay and listen to the corresponding recording. Repeat with mute/unmute, switching languages during assembly, keyboard Tab/Enter/Space, mobile widths and reduced motion. In macOS Safari and on iPhone, perform the same user interactions; if playback is restricted, use Play introduction and confirm recovery. With Canvas unavailable, confirm the static portrait and explicit audio button still work.

No commit or push was made. Release/device review and any later publication require a separate request.

## Implemented for preview: Lifee Alive — 9 October 2026

This enhancement is awaiting visual approval; no Git checkpoint or push was made.

- After Awakening completes, Lifee and the aligned light layer breathe together using vertical translation only: ±1px (2px peak-to-peak) over approximately seven seconds. No scaling, artificial mouth movement or facial deformation.
- Sparse lavender, violet and cyan lights follow edges sampled from the actual approved transparent portrait. Their slow, low-opacity pulses are decorative, with approximately ten-second cycles. There are no enclosing circles, frames or opaque backgrounds.
- During ordinary Web Audio introduction playback, the buffer source passes through an `AnalyserNode` to the destination. Alive reads 256 time-domain samples and computes RMS amplitude. The intensity of travelling neural bands over sampled forehead/shoulder dots responds to that actual signal, with a 180ms attack and 650ms release to avoid flashes. The travelling wave phase is decorative; the wave intensity is genuinely audio-reactive. Eyes, lips and central facial details are kept clear.
- Stop, mute, language switch and natural recording completion remove the analyser signal; reactive lights fade smoothly back to quiet breathing/silhouette pulses. Replay hides/reset the Alive layer until the next completed reveal. The existing Awakening script is unchanged.
- HTML audio retry/fallback is intentionally independent of Web Audio routing: voice playback remains functional, while Alive uses decorative idle effects only. An unavailable analyser similarly retains playback without simulated speech reactivity.
- Canvas rendering is limited to about 30fps, a maximum 1.5× pixel density and no more than 185 sampled points. The animation clock and drawing pause in hidden pages and offscreen; reduced-motion preference disables breathing and the light canvas, including preference changes during playback. Canvas/image-sampling failure leaves the original portrait and existing voice controls available.
- The original portrait/recordings, approved brightness/saturation filters, image dimensions, section layout/background, hero, left-side cards/copy, caption, Privacy and Support remain unchanged. Only transparent, pointer-independent light effects and a small translation were added.

### Lifee Alive validation

- Syntax checks and `git diff --check` passed.
- Firefox: actual MP3 analyser readings varied with the recording amplitude. Controlled silence and nonzero waveform tests confirmed a corresponding change in neural light intensity; mute stopped analyser reads and reactive lights decayed to zero while idle effects continued.
- Firefox: EN/LV/RU, Replay, language switching during assembly, mute/unmute, native touch, keyboard Space/focus transfer and natural source completion (accelerated test playback) passed. Replay after recording completion passed. No JavaScript errors occurred.
- Firefox: hidden-page drawing stopped and resumed; initial and live reduced-motion preferences disabled Alive while preserving introduction playback. Canvas-unavailable and analyser-unavailable fallbacks retained the static portrait/audio or quiet decorative effects as appropriate.
- Overflow checks passed at 320, 390, 768, 1024 and 1440px. Desktop/mobile screenshots were visually reviewed; the breathing offset remained within ±1px.
- Hash/source comparisons confirmed unchanged PNG/audio files, Awakening script, Privacy/Support, header/hero, Lifee copy/cards and caption.
- Safari remote automation remains disabled, so actual macOS Safari/iPhone testing remains manual. Gesture-unlocked voice playback and its direct HTML retry path are preserved. Temporary testing tools/profile/screenshots are removed after validation.
- Waveform sampling reference: [MDN getByteTimeDomainData](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteTimeDomainData).

Preview at `http://localhost:8765/` with the project-local Python server. Awaken Lifee, observe the very small breathing motion and silhouette glow, then listen for neural light intensity changes during speech. Mute to compare quiet idle, change EN/LV/RU and Replay, and repeat on mobile/reduced motion. Approve the visual result before requesting any later Git checkpoint.

## Lifee Alive visibility revision — 9 October 2026

This revision supersedes the earlier ±1px/low-opacity tuning and remains uncommitted for visual approval.

### Diagnosis

Browser inspection confirmed that Alive was running: the visible portrait and light canvas shared changing transforms, the canvas was displayed with opacity 1, stage overflow was visible, and reduced motion was false. The earlier effect was difficult to perceive because it used only ±1px movement, silhouette opacity of 0.035–0.09, neural opacity capped at 0.18 before amplitude attenuation, an additional brightness/saturation filter on the effect canvas, sparse edge samples, and point-dependent wave phases that obscured a coherent travelling band. No layer-hiding or cache failure was observed in the tested browser.

### Changes

- Breathing: ±3px (6px peak-to-peak), approximately 7.85 seconds per cycle, with a soft entrance. Idle breathing continues after the introduction ends; no scale or mouth animation.
- Silhouette: increased edge sampling from at most 85 to 180 points and glow radius from 3.8 to 6px. Lavender/pink/cyan lights use a coherent soft upward band, completing a pass in 5.2 seconds during analysed voice playback. The band follows sampled portrait edges rather than filling a rectangle or enclosing halo.
- Shimmer: neural samples increased from at most 100 to 140; radius 2.6 → 3.8px. Actual RMS amplitude gain increased from 3.5 to 6, with the existing 180ms attack/650ms release. Audio amplitude controls shimmer intensity and augments the silhouette wave; travelling position/shimmer phase remain decorative. A separate speech envelope makes the contour wave readable between words and fades it out smoothly when playback stops.
- CSS: removed the dimming filter from `.lifee-alive` only and gave it explicit `z-index:1`; `.lifee-awaken` uses `z-index:2` so interaction/focus remain above the pointer-independent effect. The original `.lifee-image,.lifee-particles` filter remains exactly `brightness(0.8) saturate(0.88)`.
- Cache refresh: Home stylesheet and Alive script URLs now include `?v=lifee-alive-2`. Browser inspection confirmed these URLs and the revised rendered movement. No cache or browser preferences were cleared.
- Awakening and voice JavaScript, PNG, all three MP3 files, Privacy, Support, hero, cards/copy and caption are unchanged. HTML audio fallback still uses quiet decorative effects rather than fake audio reactivity. Reduced motion intentionally disables Alive; hidden/offscreen pausing remains intact.

### Rendered validation and review artifacts

- Firefox desktop: measured portrait offsets from approximately −2.70px to +2.98px across the captured interval; the portrait and effect transforms matched. Effect canvas contained 2,759 pixels with alpha above 20 in one sampled frame, while corner pixels were fully transparent. Portrait filter stayed unchanged; effect was above the portrait and unclipped.
- Actual MP3 waveform readings were nonzero and varied. Controlled silence/nonzero sample tests changed rendered forehead shimmer pixel opacity; mute decayed reactive pixels back to idle. Natural source completion (accelerated test playback) retained idle breathing.
- Replay, EN/LV/RU, language switching during assembly, mute/unmute, mobile touch, responsive widths 320–1440px, reduced-motion enable/disable and hidden-page freezing passed. No JavaScript errors occurred. Syntax and whitespace checks passed.
- Desktop and mobile screenshots were inspected. Review artifacts retained in `previews/lifee-alive-v2/`: `before.png`, `after.png`, `mobile.png`, and `animation.gif` (a silent sequence of actual rendered browser frames). They are review files and are not referenced by the live website. Temporary testing scripts/profile are removed.
- Actual macOS Safari/iPhone testing remains manual because Safari remote automation is disabled. No Safari settings were changed.

Preview: `http://localhost:8765/`. Reload the Home page to load the versioned assets, awaken Lifee and listen; compare the upward contour wave during speech with the continuing quiet breathing after mute/end. Review before requesting a Git checkpoint. No commit or push was made.

## Lifee Alive lifecycle diagnosis and repair — revision 3

### Confirmed defects and limits of the diagnosis

The exact visible portrait is the single `.lifee-stage > img.lifee-image`, referencing `assets/images/lifee-web-clean.png`. Normal local Firefox rendering was already moving in previous tests; the user's total invisibility could not be reproduced under normal browser settings. It is not established that their browser experienced Canvas failure, reduced motion or stale assets. The following concrete implementation defects were reproduced/fixed rather than inferred as their exact environment cause:

1. Alive previously made its entire animation conditional on successful optional Canvas sampling: `ready` stayed false after a sampler/readback exception and the catch hid the canvas and removed breathing. Injecting an exception only for Alive's 160px sampler (leaving Awakening intact) reproduced a visible completed portrait with exactly 0px movement. Breathing is now independent of Canvas readback, and the same failure retains visible motion while reporting a breathing-only fallback.
2. The contour wave's speech envelope previously depended on an attached analyser, so successful HTML audio recovery had no travelling wave. It now follows the actual playback state; amplitude shimmer still requires real analyser samples. HTML fallback therefore has a timed contour wave, explicitly not amplitude-reactive shimmer.
3. Failure/pause states were silent. The opt-in diagnostic indicator now identifies initialization, waiting for reveal, running, reduced-motion pause, hidden-page pause, offscreen pause, Canvas failure, audio state and analyser attachment.

### Lifecycle and attachment

- Click Lifee: Awakening synchronously dispatches `lifee:awaken`, voice resumes its AudioContext in that user gesture, and the existing 2.5-second convergence runs.
- Completion: Awakening sets `data-state="complete"`, reveals the PNG and dispatches `lifee:revealed`. Alive observes that state as well as the reveal event; it starts its frame loop, translating the exact visible image and aligned canvas directly via inline `transform`. This avoids relying on a cached CSS custom-property selector to attach motion.
- Voice: after reveal the selected source starts; `lifee:audio` attaches the analyser to Alive. Voice also retains the current analyser on the stage for a late-starting listener. No waveform or substitute amplitude is generated.
- End/stop/mute: voice disconnects the source and announces no analyser; reactive light intensity decays smoothly. Breathing continues in complete state. Replay resets transforms and hides the effect before restarting Awakening.
- Image and canvas transforms match; the transparent canvas has z-index 1, the native activation button z-index 2, and the stage's overflow remains visible. PNG opacity is 1 after reveal and its approved brightness filter remains unchanged outside diagnostics.
- CSS/Alive/Awakening/voice URLs use `?v=lifee-alive-3` together, avoiding mixed cached generations after reload. No browser preferences or caches were cleared. An already open page must be reloaded to receive the revision.

### Opt-in diagnostic mode

Open `http://localhost:8765/?lifeeDebug=1`, scroll to Meet Lifee and awaken. Only this mode adds approximately 20px peak-to-peak vertical movement, a strong pulsing magenta drop-shadow following the actual transparent PNG silhouette, and a small animation/audio status indicator. Normal mode retains ±3px breathing and existing contour lights; it has no magenta glow or status badge. Reduced motion remains respected and is visibly reported by the badge. To return to normal, remove the query parameter and reload.

### Visual verification

- Firefox automated computed-style and bounding-box measurements: diagnostic rendered portrait range 18.95px; normal range 5.68px. Coordinates were measured relative to the unmoving stage, so scroll/layout shifts do not count as portrait movement. Image/overlay transforms matched, the visible image opacity was 1, and its source was the approved PNG.
- Regression reproduction: original Alive sampler failure produced 0px movement; fixed code under the same injected failure produced 18.92px in diagnostic mode.
- Actual rendered screenshots reviewed: debug mode clearly shows the magenta silhouette pulse and attached-analyser status; normal mode has no debug badge/glow. Files retained under `previews/lifee-debug/`: `debug.png`, `normal.png`, `mobile.png`, `html-audio-wave.png`, and `debug-coordinates.json`.
- Click/assembly/reveal/voice playback/natural source end (accelerated test playback) passed; idle breathing remains after end. EN/LV/RU switching, Replay, mute/unmute and mobile overflow checks passed without JavaScript errors.
- HTML audio fallback contour wave was validated through rendered Canvas alpha pixels while the diagnostic indicator correctly reported no analyser. Simulated reduced motion produced stationary coordinates and a pause explanation; turning that preference off restored visible movement.
- Syntax/whitespace checks passed. Hashes confirm unchanged Awakening JavaScript, approved PNG, all recordings, Privacy and Support. Website layout/copy remain unchanged. Voice code changes only retain the existing analyser reference; no recording/playback logic was replaced.
- Safari remote automation remains disabled; physical Safari/iPhone and the user's specific browser conditions are not verified. The debug URL is intended to expose those conditions rather than claim an unobserved cause.

No commit, push or access to other projects. Review the normal and diagnostic previews before requesting a checkpoint. Temporary test scripts/profile are removed; diagnostic mode remains available but inactive by default.

## Integrated: approved Lifee 2.0 portrait

- Confirmed the source exists before edits: `assets/images/lifee-portrait-v2.png`, 1,613,025 bytes, 1302 × 1208, with transparency. Both portrait PNGs retain their original bytes.
- Home's visible `.lifee-image` now uses the new portrait with its correct intrinsic dimensions, proportional width/automatic height and the existing `brightness(0.8) saturate(0.88)` adjustment. Blue eyes, face proportions and pink/violet neural appearance remain from the approved source. No image was regenerated or edited.
- Awakening samples whichever image is displayed, so its existing 2.5-second particle convergence automatically targets Lifee 2.0. Its Canvas selector is now explicitly `.lifee-particles`, independent of the added facial/body layers; convergence math and controls remain unchanged.
- Normal breathing no longer translates the whole head. A separate transparent `.lifee-body` Canvas redraws only the lower 23% (neck/shoulders), anchored at the neck seam, with at most ±3px shoulder-edge movement over approximately 7.85 seconds. The stationary base PNG is clipped only below that seam while the body layer is ready and active. A single image-region draw prevents horizontal resampling seams. The face and blue eyes are not scaled or warped.
- `.lifee-face` provides real, occasional procedural blinks: localized, portrait-calibrated eyelid shapes cover only the eyes, using a small sampled skin/neurals patch from the unchanged portrait and a lash-line stroke. Blinks last approximately 320ms, start after 3.5–6 seconds, then recur at irregular 4.2–8.2-second intervals. The layer clears between blinks, leaving the original eyes completely visible. No mouth/lip-sync animation is added.
- Neural samples now include the forehead, cheeks and temples, excluding the eyes, nose and lips. Soft lavender/pink/cyan traveling light bands have a quiet decorative idle component; real Web Audio RMS amplitude modulates facial shimmer during EN/LV/RU introductions. The wave's travel timing is decorative, while its added intensity is genuinely measured from playback. HTML audio fallback has a timed wave without simulated amplitude.
- Replay resets blink timing, facial/body/light layers and the existing voice lifecycle. Languages, mute/unmute and HTML playback recovery remain intact; voice JavaScript and recordings were not edited.
- Reduced motion restores the complete static PNG and hides all added motion layers. Hidden/offscreen frame clocks pause. Missing Canvas leaves a static portrait; optional light-sampling failure preserves whichever facial/body contexts are available. No external libraries added. Canvas is capped at 30fps and 1.5× pixel density.
- The existing `?lifeeDebug=1` remains opt-in; normal mode keeps the head stationary. All related Home asset URLs use `?v=lifee-portrait-v2-1` so the updated portrait layers/styles are loaded together after reload.

### Assets and realism limits

Implemented effects are visible procedural eyelid closure/reopening, local neck/shoulder breathing, sampled facial neural waves and actual amplitude-driven shimmer. Blinking uses approximate skin/eyelid reconstruction from a single open-eye PNG, not a photographic closed-eye asset or facial rig. Approved closed-eye/lash textures (or a small blink sprite sequence) would be required for fully faithful, photorealistic eyelid detail. A layered facial rig/additional expressions or animation assets would be required for gaze changes, expression changes or convincing lip sync; none are claimed here.

### Lifee 2.0 browser validation

- Firefox verified the actual displayed image source and 1302 × 1208 natural dimensions; the new portrait was revealed by Awakening and audio began after reveal. Actual analyser reads continued during playback.
- Rendered open-eye and near-closed-eye screenshots were captured and reviewed at desktop 1440px and mobile 390px. The eyelid overlay appears only around the eyes. The head's rendered Y coordinate stayed fixed across sampled frames while body-canvas pixels changed over time. An early strip-rendering seam was removed and the final body image region was visually reviewed.
- EN/LV/RU switching, Replay hiding/restarting facial/body layers, mute/unmute, native mobile touch and responsive overflow checks at 320/390/768/1024/1440px passed with no JavaScript errors. Simulated reduced motion retained static Lifee 2.0 and audio.
- Final eyelid-texture screenshots were rechecked after refining the overlay. Review files: `previews/lifee-portrait-v2/desktop-open.png`, `desktop-blink.png`, `mobile-open.png`, `mobile-blink.png`.
- Syntax/whitespace checks passed. Hash comparison confirmed unchanged new/old PNGs, audio assets, voice script, Privacy and Support. Existing section layout rules, hero, left-side copy/cards and site colors are unchanged.
- Safari/iPhone playback/rendering remain a manual review step: Safari remote automation is disabled. Safari-compatible local Canvas, native controls and the existing user-gesture AudioContext/HTML audio fallback are retained; physical-device validation is not claimed.

Preview at `http://localhost:8765/`, reload, then awaken Lifee. Observe the stationary face, occasional blinks and quiet neck/shoulder breathing; select EN/LV/RU and Replay to compare amplitude-reactive facial light. No commit or push. Temporary test scripts/profile are removed; review screenshots are retained outside the live page.

## Boundaries for the next phase

- Restrict implementation to the Meet Lifee right-hand experience and its required scoped assets/styles/scripts.
- Preserve the approved Home hero, logo, navigation, left-side Lifee content, caption, rounded section container and lavender/pink background.
- Do not modify original images, Privacy or Support as part of animation work.
- Do not access BikiniFit or other projects.
- Do not push or deploy without a subsequent explicit request.

## Checkpoint scope

Commit message: `checkpoint: approved Lifee design before animation`.

Include the existing changed website HTML/CSS and documentation, the three referenced image assets above, and this map. Leave unused image variants and operating-system metadata untracked. No website appearance, functionality or image bytes are changed while creating this checkpoint.

## APPROVED CHECKPOINT — Lifee 2.0 Animated Portrait

User-approved local checkpoint on `feature/lifee-awakening`. Commit message: `checkpoint: approved Lifee 2.0 animated portrait`. Annotated tag: `lifee-v2-approved`. No push or deployment is authorized or performed.

Working features: approved proportional Lifee 2.0 portrait, image-targeted Awakening convergence, occasional local eyelid blinks, neck/shoulder breathing with a stationary head, forehead/cheek/temple neural waves, actual Web Audio amplitude-reactive shimmer, EN/LV/RU ElevenLabs introductions (English default), Replay, mute/unmute and explicit HTML audio recovery. The approved TreLif hero, copy/cards, layout, colors, caption, Privacy and Support are preserved. Reduced-motion/static fallbacks and hidden/offscreen pausing remain enabled.

Required files: `index.html`, `assets/css/style.css`, `assets/js/lifee-awakening.js`, `assets/js/lifee-alive.js`, `assets/js/lifee-voice.js`, `assets/images/lifee-portrait-v2.png`, and `assets/audio/lifee-intro-en.mp3`, `lifee-intro-lv.mp3`, `lifee-intro-ru.mp3`. Existing tracked logo assets and the earlier approved portrait remain included. Dependencies are native browser HTML/CSS, Canvas 2D, Web Audio and HTML audio only; no external libraries/build step. Serve over HTTP, e.g. `python3 -m http.server 8765 --bind 127.0.0.1`.

Checkpoint checks: required files exist and are nonempty; all three JavaScript syntax checks, MP3 readability via macOS afinfo, local HTML asset-reference checks, credential-pattern scan and Git whitespace checks passed. No package/test runner is configured. Earlier rendered Firefox desktop/mobile tests, blinks, stationary-head/body movement, actual analyser readings, Replay/languages/mute, responsive widths and simulated reduced motion passed as detailed above. No new browser/device validation is implied by this checkpoint.

Known limitations: eyelids are procedural approximations from a single open-eye portrait, not fully photorealistic closed-eye artwork. HTML audio fallback retains timed light waves but cannot provide amplitude-reactive shimmer without an analyser. Safari/macOS and physical iPhone end-to-end verification remains pending; opening Safari alone did not constitute validation. Opt-in `?lifeeDebug=1` diagnostics remain in the runtime but are inactive by default. Temporary browser tooling, diagnostic screenshots/review captures, operating-system metadata, unused image variants and credential files are excluded via `.gitignore`; existing local review files are preserved on disk.

Future Lip Sync: NOT implemented. A later separately authorized phase needs approved mouth/viseme animation assets or a facial rig and timing integration; this checkpoint adds no mouth animation or lip-sync dependency.

The stable reference is the annotated tag. Working tree cleanliness is verified after commit/tag creation; local ignored review assets are not checkpoint dependencies.
