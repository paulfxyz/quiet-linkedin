# Validation Evidence and Test Procedures

This document details the automated tests and manual inspection procedures used to verify Quiet, LinkedIn! across development cycles.

## Automated regression suite

The automated test suite runs via Node.js native test runner and Playwright (`tests/extension.test.mjs`). On October 24, 2026, all 9 top-level tests passed successfully in an automated test run.

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

Note: The installed unpacked test uses synthetic HTML mockups intercepted at LinkedIn URLs in Chromium, not production LinkedIn page data. Refer to the dynamic GitHub Actions badge for current remote CI status.

## Manual verification record

- **Date:** October 24, 2026
- **Target:** Desktop LinkedIn profile page (Comet layout)
- **Method:** Live Comet CSS injection (v1.0)
- **Observed state:** The Home navigation item showed an active red dot; the Notifications bell icon had zero active unread items.
- **Result:** Injected stylesheet rules successfully removed the active Home notification dot without affecting surrounding navigation controls.
- **Limitation:** Verification of simultaneous live badges across both Home and Notifications items remains pending an account state with both badges active at once. Chrome live testing was not conducted in this run.
