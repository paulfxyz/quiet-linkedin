# Validation Evidence and Test Procedures

This document details the automated tests and manual inspection procedures used to verify Quiet, LinkedIn! across development cycles.

## Automated regression suite

The automated test suite runs via Node.js native test runner and Playwright (`tests/extension.test.mjs`). On October 25, 2026, all 10 top-level tests passed, including the navigation markup captured from the live Comet page.

Measured test environment:
- Engine: Playwright's Chrome for Testing 156.0.8078.4
- Node runtime: v20.20.2
- Test framework: Playwright 1.64.1
- Platform: Linux sandbox
- Origin isolation: Route-intercepted HTTPS fixtures with zero external live network requests.

An earlier local pass also succeeded with Chromium 156.0.8078.48. These engine versions describe the test environment, not guaranteed compatibility with every browser release.

### Covered test scenarios

1. **Manifest compliance:** Confirms Manifest V3 structure, document start execution, zero extra permissions, zero background workers, and local icon references.
2. **Simultaneous suppression:** Verifies that Home and Notifications badges hide concurrently while keeping SVGs, labels, and button click listeners fully interactive.
3. **Variant coverage:** Asserts hiding across dot badges, count badges, small icons, medium icons, filled variants, and div/span wrappers without language-dependent text matching.
4. **Legacy navigation roots:** Ensures `/feed` and `/notifications` root links hide badges without targeting unrelated link formats.
5. **Preservation of unrelated badges:** Verifies that Messaging, My Network, Jobs, feed item counts, and external links remain visible.
6. **Label safety:** Asserts that text labels beside standalone icons without badges are not hidden.
7. **Dynamic updates:** Tests dynamic HTML insertion and counter mutations (`99+`) to confirm CSS rerenders without DOM observers.
8. **Theme consistency:** Validates badge suppression under both light and dark system color schemes.
9. **Origin isolation:** Launches an unpacked browser context with route interception to verify that CSS applies only to `https://www.linkedin.com/*` and does not inject into alternative origins.
10. **Captured production layout:** Tests the sanitized Home button and Notifications anchor captured with both badges active on October 25. Verifies that icons, text labels, unread accessibility labels, and later unrelated siblings remain intact; the installed-extension test also uses this markup.

The installed unpacked test uses intercepted pages in Chromium, including both synthetic fixtures and a sanitized capture of the live navigation structure. It does not open a logged-in LinkedIn account or install the extension in Comet; refer to the separate live record below and the workflow badge for current remote CI status.

## Manual verification record

- **Date:** October 25, 2026
- **Target:** Desktop LinkedIn profile page (Comet layout)
- **Method:** Live Comet stylesheet injection using the exact v1.1.1 CSS from the repository.
- **Observed state:** Home showed an active dot and Notifications showed the count `1`; each control's accessibility label reported `1 new notification`.
- **Result:** Both badges changed from computed `display: flex` to `display: none`. Both SVG icons remained `display: block`, both text-label wrappers remained `display: flex`, and the unread labels still reported `1 new notification`.
- **Visual evidence:** `screenshots/reference/before.png`, `screenshots/reference/after.png`, and `screenshots/screenshot.png` contain only the relevant navigation strip, without profile or message content.
- **Regression fixture:** `tests/fixtures/linkedin-nav.html` preserves the two controls and their icon-wrapper structure, with volatile classes removed.
- **Limitation:** This verifies the stylesheet on the live page, not installation in Comet. Installation is tested separately in Chromium, including against the captured markup.

The earlier October 24 check covered the Home dot only because Notifications had no active badge. That limitation is superseded by the simultaneous live stylesheet check above; it was never evidence of an installed Comet extension.
