<p align="center">
  <img src="icons/icon128.png" width="96" alt="Quiet, LinkedIn! icon">
</p>

<h1 align="center">Quiet, LinkedIn!</h1>

<p align="center">A tiny Chrome / Comet extension that hides the red badges on LinkedIn's Home and Notifications icons.</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg">
  <img alt="Manifest V3" src="https://img.shields.io/badge/manifest-v3-0a66c2">
  <img alt="Chrome" src="https://img.shields.io/badge/Chrome-supported-4285F4?logo=googlechrome&logoColor=white">
  <img alt="Comet" src="https://img.shields.io/badge/Comet-supported-1fb8cd">
  <img alt="No tracking" src="https://img.shields.io/badge/tracking-none-brightgreen">
  <img alt="Permissions: none" src="https://img.shields.io/badge/permissions-none-brightgreen">
</p>

<p align="center"><img src="screenshots/screenshot.png" alt="Before and after: LinkedIn nav bar with and without the Home badge"></p>

## What it does

On `https://www.linkedin.com/*` it hides the notification badge / counter on:

- Home
- Notifications

That is all. No data collected, no network requests, no permissions, no JavaScript: just one CSS file.

## Install (unpacked)

1. Clone or download this repo:
   ```sh
   git clone https://github.com/paulfxyz/quiet-linkedin.git
   ```
2. Open `chrome://extensions` (or `comet://extensions`).
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `quiet-linkedin` folder.
5. Reload LinkedIn.

## How it works

LinkedIn's class names are hashed and change often, so [`src/quiet.css`](src/quiet.css) targets stable hooks instead: the nav icon ids (`home-medium`, `bell-fill-medium`), the `/notifications` link, and the legacy `.notification-badge` class.

If LinkedIn changes its markup and a badge comes back, open an issue.

## Roadmap

More small "quiet" cleanups will be added over time.

## License

[MIT](LICENSE) © Paul Fleury
