# Privacy Policy for Quiet, LinkedIn!

Quiet, LinkedIn! is a lightweight, CSS-only browser extension. It contains no runtime JavaScript, collects no personal data, and communicates with no remote servers.

## Extension runtime

The extension runs entirely within your browser using declarative styling. It does not perform any of the following operations:

- **No tracking or telemetry:** The extension does not record user actions, track browsing history, or monitor site usage.
- **No data storage:** The extension uses no local storage, indexed databases, cookies, or browser synchronization APIs.
- **No network requests:** The extension contains no code capable of issuing HTTP requests, background fetches, or remote reporting.
- **No authentication:** You do not need an account, email address, API token, or registration to install or use the project.

## Browser permissions and site access

Quiet, LinkedIn! requests zero Chrome API permissions and declares no `host_permissions` array. Its manifest specifies only a declarative content script:

```json
"content_scripts": [
  {
    "matches": ["https://www.linkedin.com/*"],
    "css": ["src/quiet.css"],
    "run_at": "document_start",
    "all_frames": false
  }
]
```

Because the content script matches `https://www.linkedin.com/*`, your browser engine may present a standard prompt stating that the extension can read and change data on that website. The shipped extension code does not read form inputs, read messages, or transmit page contents off your machine. The exact site scope is www.linkedin.com, and the extension requests zero Chrome API permissions.

## External resources and third parties

The bundled extension files contain all assets necessary to function. It references no third-party CDNs, external scripts, or remote fonts.

External badges displayed in the GitHub project documentation are loaded from Shields.io solely when viewing the repository in a web browser. Those requests are standard web traffic between your browser and the image host and are entirely separate from extension execution.

This extension is an independent project and is not affiliated with LinkedIn Corporation.
