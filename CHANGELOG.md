# Changelog

All notable changes to Quiet, LinkedIn! are documented in this file.

## [1.1.1] - 2026-10-25

### Changed
- Limited the modern icon-wrapper rule to the badge immediately after the SVG, leaving later siblings untouched.
- Updated the README and comparison screenshot after verifying both active badges on the live Comet page.

### Added
- Sanitized navigation markup captured with the Home dot and Notifications counter both active.
- A tenth regression test for that markup, preserved icons and labels, unchanged unread labels, and unrelated siblings.
- Captured-markup coverage in the installed-extension test, including the packaged distribution.

### Verification
- The v1.1.1 stylesheet hid both badges in live Comet without changing either control's unread label.
- All 10 local regression tests passed; installed-package checks use Chromium with intercepted pages, not an installed Comet extension.

## [1.1.0] - 2026-10-24

### Changed
- Scoped badge selectors tightly to navigation containers (`ul`, `nav`, `header`, `.global-nav`) and specific icon IDs to prevent accidental styling of unrelated page content.
- Constrained legacy link selectors to exact root navigation URLs (`/feed` and `/notifications`).
- Removed legacy broad rules that targeted general `.notification-badge` classes and loose anchor descendants.

### Added
- Support for filled and small SVG navigation variants (`#home-small`, `#home-fill-medium`, `#bell-small`, etc.).
- Playwright and Node test suite with nine regression scenarios covering badge suppression, label preservation, click handling, dynamic reinsertion, and dark theme support.
- Clean packaging script enforcing an allowlist of distribution files without build artifacts.
- Project hero graphic (`docs/hero.svg`) and validation documentation (`docs/VALIDATION.md`).

### Security and Privacy
- Clarified site access documentation regarding declarative content script matches on `https://www.linkedin.com/*`.

## [1.0.0] - 2026-10-24

### Added
- Initial release with `src/quiet.css` providing basic Home and Notifications badge hiding.
- Extension icons and Manifest V3 configuration.
- Initial visual check on desktop logged-in LinkedIn profile verifying suppression of the Home notification dot.
