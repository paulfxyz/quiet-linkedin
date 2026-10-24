# Contributing to Quiet, LinkedIn!

Thank you for taking the time to contribute. Quiet, LinkedIn! is intentionally minimal, and we prioritize stability, simplicity, and strict selector scoping.

## Guiding principles

1. **CSS only at runtime:** The extension must never require background service workers, popups, or runtime JavaScript. Everything must remain declarative.
2. **Scoped selectors:** Avoid generic class names or loose descendant rules. Selectors must target only Home and Notifications elements within desktop navigation.
3. **Fail quietly:** If LinkedIn alters markup, it is preferable for a badge to remain visible than for a broad rule to hide user buttons, messages, or text labels.
4. **No tracking or telemetry:** The extension does not record metrics, issue network requests, or query third-party endpoints.

## Development workflow

Ensure you have Node.js 20 or newer installed.

```sh
# Clone the repository
git clone https://github.com/paulfxyz/quiet-linkedin.git
cd quiet-linkedin

# Install test dependencies
npm ci

# Install Playwright browser binaries (on Linux, append --with-deps if needed)
npx playwright install chromium

# Run the test suite
npm test
```

If you have a local Chromium binary, you can run tests with your existing engine:

```sh
CHROMIUM_PATH=/path/to/chromium npm test
```

## Submitting pull requests

- Write clear, concise commit messages.
- Ensure all test assertions pass before opening your pull request.
- Add synthetic test fixtures in `tests/extension.test.mjs` for any new selector patterns or edge cases.
- Do not include real account screenshots, personal profile URLs, or sensitive user data in issues or PR descriptions.

Thank you for helping keep desktop navigation quiet.
