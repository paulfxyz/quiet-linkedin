# Validation Evidence and Test Procedures

This document details the automated tests and manual inspection procedures used to verify Quiet, LinkedIn! across development cycles.

## Automated regression suite

The automated test suite runs via Node.js native test runner and Playwright (`tests/extension.test.mjs`). On October 26, 2026, all 13 top-level tests passed, including profile and Messaging navigation captures and installed-extension route-change coverage.

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
11. **Root-link variants:** Covers relative and absolute roots, with or without trailing slashes, queries, tracking parameters, and fragments.
12. **Alternative icon hooks:** Covers active icons, SVGs with only `data-test-icon`, `href` / namespaced sprite references, and legacy Home / bell `li-icon` types.
13. **Messaging layout and later styles:** Uses the sanitized Messaging navigation, inserts a Notifications badge after page load, and adds a later `!important` badge rule to verify that both target badges stay hidden while icons and text remain visible.

The installed-extension test covers direct page loads and reloads across `/feed/`, `/in/`, `/messaging/thread/`, `/notifications/`, `/mynetwork/`, `/jobs/`, `/search/results/all/`, and `/company/`. It then changes routes with `history.pushState` and replaces the navigation markup between the two layouts; the manifest stylesheet continues to apply without reinjection. Synthetic paths are used, never a real conversation identifier.

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

## Site-wide navigation check

- **Date:** October 26, 2026.
- **Reported issue:** Home, and possibly Notifications, reappearing after visiting a messaging thread.
- **Initial observation:** The Messaging page used the legacy `#global-nav` / `li-icon` layout. Its Home badge already had computed `display: none` in the fresh tab before applying the new stylesheet, so the reported intermittent failure was not reproduced.
- **v1.1.2 live check:** Applied the exact repository stylesheet on the profile and Messaging layouts. Home remained hidden and its icon remained visible; Notifications had no active badge during this check.
- **Captured evidence:** `tests/fixtures/linkedin-messaging-nav.html` contains only the Home and Notifications controls, with volatile classes removed. No message text, participant details, or thread URL is included.
- **Fixture coverage:** Late Notifications counters and both badges across page/route changes are verified using an actual unpacked Chromium extension.
- **Boundary:** These are stylesheet checks in Comet, not installation or restart-persistence acceptance tests. The previous report of browser removal remains a separate, undiagnosed issue; future LinkedIn markup changes may require additional selectors.
