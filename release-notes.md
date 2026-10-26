# Quiet, LinkedIn! 1.1.2 Release Notes

This patch expands Home and Notifications badge coverage across LinkedIn's profile and Messaging navigation layouts. It remains CSS-only and applies to every path under `https://www.linkedin.com/*`, without hiding Messaging counters or changing unread state.

## Changes

- **Icon coverage:** Added active icon variants, ID-free SVG attributes, sprite references, and legacy Home / bell `li-icon` hooks.
- **Link coverage:** Added slashless, query, tracking, and fragment variants of Home and Notifications navigation roots.
- **Style resilience:** Increased rule specificity to resist later LinkedIn badge styles.
- **Regression coverage:** All 13 local tests passed, including an actual unpacked Chromium extension across direct loads, reloads, and in-page route/layout changes on eight LinkedIn page categories.

The reported intermittent reappearance was not reproduced in a fresh messaging tab: Home was already hidden. Live checks with the v1.1.2 stylesheet confirmed Home stayed hidden in profile and Messaging layouts; Notifications had no active badge, so its new-layout insertion is verified in fixtures rather than claimed as a simultaneous live check.

## Installation and update

[Download the v1.1.2 source ZIP](https://github.com/paulfxyz/quiet-linkedin/archive/refs/tags/v1.1.2.zip), extract it into a permanent folder, and load the directory containing `manifest.json` using **Load unpacked**. No build or dependency installation is required.

For an existing installation, replace the files in its permanent folder, click **Reload** on the extension card in `chrome://extensions`, then reload all open LinkedIn tabs. If loading a separate folder, disable or remove the older copy.

This is a page-coverage update, not a fix for a browser that removes or disables the extension after restarting. No browser security settings or policies are changed; the extension must remain installed and enabled.

The project remains MIT-licensed. Developers can generate the minimal package with `npm ci` and `npm run package`.
