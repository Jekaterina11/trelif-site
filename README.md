# TreLif official website

A calm, responsive static website for the TreLif iOS/watchOS wellness app, with its Privacy Policy and Support page. This repository contains only the public website.

## Pages

- `index.html`: product introduction; Coming to the App Store notice.
- `privacy/index.html`: supplied 18-section privacy policy, effective and last updated 7 October 2026.
- `support/index.html`: support email and FAQ.
- `404.html`: custom page-not-found page.
- `assets/css/style.css`: shared responsive styles, using system fonts.
- `assets/images/README.md`: official logo handoff instructions.

## Logo pending

The official logo is not in this repository. Supply it at **`assets/images/trelif-logo.png`**. No substitute logo was generated. The current header uses the plain product name, with no missing-image request.

## Hosting and local review

GitHub Pages can serve these files directly from **main / (root)**. There is no build step, package manager, framework or backend. Expected project URL: https://jekaterina11.github.io/trelif-site/

For local preview, run `python3 -m http.server 8000` in this directory, then open http://localhost:8000/. Python is only a preview convenience and is not required for hosting.

Navigation and asset references are relative, supporting both the GitHub Pages project path and a future root domain. The 404 page uses a small inline script solely to resolve navigation and CSS for nested missing URLs on GitHub Pages; the normal pages require no JavaScript.

No CNAME or DNS configuration is included. Connect trelif.app only after visual review of the GitHub Pages version.

## Privacy and accessibility

No analytics, tracking, cookies, advertising, remote fonts or external runtime dependencies are added. The site's hosting provider may process ordinary HTTP request information under its own policies.

Semantic landmarks, labelled navigation, one main heading per page, a skip link, visible keyboard focus, responsive layouts and reduced-motion support are included. Privacy and support are linked from every page. All 18 supplied policy sections are retained; the instruction to prominently display the last-updated date is implemented in the policy header.

Before release, visually review the site on iPhone, iPad and desktop and confirm that policy disclosures continue to match the released app. No App Store badge is included because the app is not published.

## Validation

Static checks verified all four HTML pages have a title, viewport metadata, one main heading and one main landmark; IDs are unique; local links and fragment targets resolve; and all 18 privacy policy section anchors are present. `git diff --check` passed.

HTTP preview validation could not run because this environment blocks binding a local server port. Browser rendering and device appearance have not been verified.
