# Quiet, LinkedIn! 1.1.0 Release Notes

Quiet, LinkedIn! 1.1.0 refines badge hiding rules for desktop navigation, introduces a full automated regression suite, and tightens selector scoping.

## What's new in version 1.1.0

- **Strict selector scoping:** Replaced general class selectors with tightly anchored navigation rules. Hiding rules now target exact icon wrappers and root navigation anchors, avoiding conflicts with Messaging, My Network, or in-feed elements.
- **Support for icon variants:** Added rules matching small and filled SVG icon variants used across desktop navigation bar updates.
- **Automated test suite:** Added Playwright regression tests covering dynamic updates, color schemes, link preservation, and unpacked extension isolation.
- **Minimal-package tooling:** Added an allowlisted packaging workflow for runtime files (manifest, quiet.css, icons) alongside LICENSE, PRIVACY.md, and INSTALL.md. The public source archive also includes the rest of the repository.
- **No data migration:** This release requires no settings or data migrations. When updating, extract the archive over your existing active folder, click refresh in your extension manager, and reload LinkedIn tabs.

## Scope and behavior

Quiet, LinkedIn! is completely declarative and contains no background JavaScript. It hides Home and Notifications navigation badges without modifying account read states, tab titles, or mobile application settings.

Note on verification: The test suite passed completely against synthetic fixtures in Chromium on October 24, 2026. Live verification on LinkedIn confirmed Home badge suppression via injected CSS; manual confirmation of an installed unpacked extension with active badges on both Home and Notifications simultaneously is pending.

## Installation

[Download the v1.1.0 source ZIP](https://github.com/paulfxyz/quiet-linkedin/archive/refs/tags/v1.1.0.zip), extract it, and load the folder containing `manifest.json` via **Load unpacked** in Developer mode. No build, dependency installation, account, or API key is required.

GitHub's asset-upload endpoint rejected the minimal ZIP during publication, so the source archive is the public download for this release. Developers can create the minimal ZIP with `npm ci` and `npm run package`; that ZIP was separately tested as an installed extension against synthetic fixtures.
