# Installing Quiet, LinkedIn! (v1.1.2)

Quiet, LinkedIn! is a CSS-only extension that cosmetically hides Home and Notifications navigation badges on desktop LinkedIn. It makes no changes to notification read states, messaging counters, or personal data.

Version 1.1.2 expands coverage across LinkedIn's navigation layouts, including messaging threads. After updating, reload the extension and all open LinkedIn tabs; merely copying the files does not update an already-open page.

Project source: https://github.com/paulfxyz/quiet-linkedin

## Installation steps (Chrome and Comet)

1. Extract this zip archive into a permanent folder on your computer. Do not move or delete this folder after installing, as the browser loads the files directly from it.
2. Open your browser extension manager: enter chrome://extensions in the address bar (or navigate to Extensions in Comet).
3. Turn on the Developer mode toggle switch.
4. Click Load unpacked.
5. Select the extracted folder containing manifest.json.
6. Reload your active LinkedIn tabs (https://www.linkedin.com) to apply the stylesheet.

No terminal, Node.js build step, user account, or API key is required.

## Site access and permissions

The extension requests zero extra Chrome API permissions. To inject the stylesheet, it declares site access strictly scoped to www.linkedin.com. You can inspect permissions at any time on the extension details card.

## Updating, disabling, and removing

- To update: Extract new release files over your permanent folder, click the refresh button on the Quiet, LinkedIn! card in chrome://extensions, and reload your LinkedIn tabs.
- To disable: Turn off the toggle switch on the extension card and reload LinkedIn.
- To remove: Click Remove on the extension card and reload LinkedIn. Default badge displays return immediately upon refresh.

For privacy details, view PRIVACY.md in this folder or https://github.com/paulfxyz/quiet-linkedin/blob/main/PRIVACY.md
