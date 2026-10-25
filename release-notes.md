# Quiet, LinkedIn! 1.1.1 Release Notes

This patch verifies both active badges on the live desktop LinkedIn page in Comet and narrows the modern selector to the badge immediately after its icon. The extension remains CSS-only, with no tracking, runtime JavaScript, or changes to unread state.

## Changes

- **Live verification:** Home and Notifications each reported one new notification. Applying the v1.1.1 stylesheet hid both badges while preserving the icons, labels, and unread accessibility labels.
- **Selector safety:** Later siblings in an icon wrapper are no longer hidden by the modern rule.
- **Regression coverage:** Added sanitized markup from the live page and a tenth regression test. The installed Chromium test also checks the captured layout.
- **Documentation:** Replaced the Home-only comparison with a real before/after showing both badges and updated the validation record.

The live Comet check used stylesheet injection, not an installed extension. The unpacked package is tested separately in Chromium against intercepted pages, including the captured navigation structure.

## Installation and update

[Download the v1.1.1 source ZIP](https://github.com/paulfxyz/quiet-linkedin/archive/refs/tags/v1.1.1.zip), extract it into a permanent folder, and select the directory containing `manifest.json` using **Load unpacked** in your browser's extensions manager. No build, account, or API key is required.

To update an existing unpacked installation, replace its files with v1.1.1, click **Reload** on the extension card, then reload LinkedIn. If you load the new folder as a separate extension, disable or remove the old copy so only one version is active.

Developers can create the minimal package using `npm ci` and `npm run package`. This project is MIT-licensed, and no settings or data migration is required.
