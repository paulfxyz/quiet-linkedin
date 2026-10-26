import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { readFile, access, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(resolve(root, "src/quiet.css"), "utf8");
const manifest = JSON.parse(await readFile(resolve(root, "manifest.json"), "utf8"));
const executablePath = process.env.CHROMIUM_PATH;
const browserOptions = {
  ...(executablePath ? { executablePath } : {}),
  args: ["--no-sandbox"]
};
let browser;

before(async () => {
  browser = await chromium.launch(browserOptions);
});
after(async () => {
  await browser?.close();
});

const icon = (id) => `<svg id="${id}" width="24" height="24"><rect width="24" height="24"/></svg>`;
const current = (kind, id, badge = '<span class="bubble">9</span>', wrapper = "span") =>
  `<button data-control="${kind}"><${wrapper}>${icon(id)}${badge}</${wrapper}><span class="label">${kind}</span></button>`;
const legacy = (href, label) =>
  `<a href="${href}">${icon("generic")}<span class="notification-badge"><span class="notification-badge__count">9</span></span><span class="label">${label}</span></a>`;

async function fixture(html, fn) {
  const page = await browser.newPage();
  try {
    await page.setContent(html);
    await page.addStyleTag({ content: css });
    await fn(page);
  } finally {
    await page.close();
  }
}

test("manifest is CSS-only, top-frame, LinkedIn-only, and versioned consistently", async () => {
  const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
  assert.equal(manifest.manifest_version, 3);
  assert.equal(manifest.version, pkg.version);
  assert.equal(manifest.background, undefined);
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.action, undefined);
  assert.deepEqual(manifest.content_scripts, [{
    matches: ["https://www.linkedin.com/*"],
    css: ["src/quiet.css"],
    run_at: "document_start",
    all_frames: false
  }]);
  for (const file of Object.values(manifest.icons)) await access(resolve(root, file));
  assert.doesNotMatch(css, /@import|url\s*\(/i);
});

test("hides Home and Notifications together, preserving icons, text, and controls", async () => {
  await fixture(`<ul><li>${current("Home", "home-medium")}</li><li>${current("Notifications", "bell-fill-medium")}</li></ul>`, async (page) => {
    assert.equal(await page.locator(".bubble:visible").count(), 0);
    assert.equal(await page.locator("svg:visible").count(), 2);
    assert.equal(await page.locator(".label:visible").count(), 2);
    assert.equal(await page.locator("button:visible").count(), 2);
    await page.locator('button[data-control="Home"]').evaluate((e) => {
      e.addEventListener("click", () => e.dataset.clicked = "yes");
    });
    await page.locator('button[data-control="Home"]').click();
    assert.equal(await page.locator('button[data-control="Home"]').getAttribute("data-clicked"), "yes");
  });
});

test("matches the sanitized live Comet layout captured with both badges active", async () => {
  const live = await readFile(resolve(root, "tests/fixtures/linkedin-nav.html"), "utf8");
  await fixture(live, async (page) => {
    for (const id of ["home-medium", "bell-fill-medium"]) {
      const iconNode = page.locator(`svg#${id}`);
      assert.equal(await iconNode.evaluate((e) => getComputedStyle(e.nextElementSibling).display), "none");
      assert.equal(await iconNode.isVisible(), true);
      const control = iconNode.locator("xpath=../..");
      assert.equal(await control.isVisible(), true);
      assert.equal(await control.locator(":scope > span:last-child").isVisible(), true);
      assert.match(await control.getAttribute("aria-label"), /1 new notification/);
    }
    // Do not hide additional siblings in the icon wrapper.
    await page.locator("#home-medium").evaluate((e) => {
      const helper = document.createElement("span");
      helper.id = "unrelated-helper";
      helper.textContent = "Still visible";
      e.parentElement.appendChild(helper);
    });
    assert.equal(await page.locator("#unrelated-helper").isVisible(), true);
  });
});

test("supports dot, numerical, filled, small, span, and div variants without language matching", async () => {
  for (const id of ["home-medium", "home-small", "home-fill-medium", "home-fill-small", "bell-medium", "bell-small", "bell-fill-medium", "bell-fill-small"]) {
    await fixture(`<nav>${current("Accueil", id, '<div class="bubble"></div>', "div")}</nav>`, async (page) => {
      assert.equal(await page.locator(".bubble").evaluate((e) => getComputedStyle(e).display), "none", id);
      assert.equal(await page.locator(".label:visible").count(), 1, id);
    });
  }
});

test("legacy selectors hide only root Home and Notifications badges", async () => {
  const roots = ["/feed", "/feed/", "/feed/?trk=nav", "https://www.linkedin.com/feed/",
    "/notifications", "/notifications/", "/notifications/?filter=all", "https://www.linkedin.com/notifications/"];
  await fixture(`<header>${roots.map((href) => legacy(href, href)).join("")}</header>`, async (page) => {
    assert.equal(await page.locator(".notification-badge:visible").count(), 0);
    assert.equal(await page.locator(".label:visible").count(), roots.length);
  });
});

test("root links cover relative, absolute, slashless, query, fragment, and tracking variants", async () => {
  const roots = ["feed", "notifications"].flatMap((name) =>
    ["", "https://www.linkedin.com"].flatMap((origin) =>
      ["", "/", "?trk=nav", "/?nis=true&", "#all", "/#all"].map((suffix) =>
        `${origin}/${name}${suffix}`)));
  await fixture(`<header>${roots.map((href) => legacy(href, href)).join("")}</header>`, async (page) => {
    assert.equal(await page.locator(".notification-badge:visible").count(), 0);
    assert.equal(await page.locator(".label:visible").count(), roots.length);
  });
});

test("supports ID-free SVGs, active icons, sprite references, and legacy li-icon badges", async () => {
  const hooks = [
    '<svg id="home-active-medium" width="24" height="24"></svg>',
    '<svg id="bell-fill-active-small" width="24" height="24"></svg>',
    '<svg data-test-icon="home-fill-medium" width="24" height="24"></svg>',
    '<svg data-test-icon="bell-fill-medium" width="24" height="24"></svg>',
    '<svg width="24" height="24"><use href="#home-medium"></use></svg>',
    '<svg width="24" height="24"><use href="#bell-fill-medium"></use></svg>',
    '<svg width="24" height="24"><use xlink:href="#home-medium"></use></svg>'
  ];
  for (const hook of hooks) {
    await fixture(`<nav><button><span>${hook}<span class="bubble">1</span></span><span class="label">Navigation</span></button></nav>`, async (page) => {
      assert.equal(await page.locator(".bubble:visible").count(), 0, hook);
      assert.equal(await page.locator("svg:visible").count(), 1, hook);
      assert.equal(await page.locator(".label:visible").count(), 1, hook);
    });
  }
  for (const type of ["home", "home-active", "bell", "bell-fill", "bell-fill-active"]) {
    await fixture(`<nav><button><div><span class="notification-badge">1</span><li-icon type="${type}">${icon("generic")}</li-icon></div><span class="label">Navigation</span></button></nav>`, async (page) => {
      assert.equal(await page.locator(".notification-badge:visible").count(), 0, type);
      assert.equal(await page.locator("svg:visible").count(), 1, type);
      assert.equal(await page.locator(".label:visible").count(), 1, type);
    });
  }
});

test("captured messaging navigation stays quiet and tolerates later LinkedIn badge styling", async () => {
  const captured = await readFile(resolve(root, "tests/fixtures/linkedin-messaging-nav.html"), "utf8");
  await fixture(captured, async (page) => {
    const home = page.locator('a[href*="/feed"]');
    const notifications = page.locator('a[href*="/notifications"]');
    assert.equal(await home.locator(".notification-badge").evaluate((e) => getComputedStyle(e).display), "none");
    // No Notifications badge was active during capture; test late insertion.
    await notifications.evaluate((e) => {
      const badge = document.createElement("span");
      badge.className = "notification-badge notification-badge--show";
      badge.textContent = "99+";
      e.prepend(badge);
    });
    await page.addStyleTag({ content: ".global-nav .notification-badge.notification-badge--show { display: inline-flex !important; }" });
    assert.equal(await page.locator(".notification-badge:visible").count(), 0);
    assert.equal(await page.locator("li-icon svg:visible").count(), 2);
    assert.equal(await page.locator(".global-nav__primary-link-text:visible").count(), 2);
  });
});

test("leaves Messaging, My Network, Jobs, feed posts, content badges, and external links alone", async () => {
  const links = ["/messaging/", "/mynetwork/", "/jobs/", "/feed/update/example", "/notifications/detail/123", "https://example.com/notifications/"];
  await fixture(`<ul>${links.map((href) => `<li>${legacy(href, href)}</li>`).join("")}<li>${current("Messaging", "messages-medium")}</li></ul><main><span class="notification-badge">content</span>${current("Article", "home-medium")}</main>`, async (page) => {
    assert.equal(await page.locator(".notification-badge:visible").count(), links.length + 1);
    assert.equal(await page.locator(".bubble:visible").count(), 2);
  });
});

test("does not hide text labels next to a standalone icon or an icon without a badge", async () => {
  await fixture(`<nav><button>${icon("home-medium")}<span class="label">Home</span></button>${current("Notifications", "bell-fill-medium", "")}</nav>`, async (page) => {
    assert.equal(await page.locator(".label:visible").count(), 2);
    assert.equal(await page.locator("svg:visible").count(), 2);
  });
});

test("covers late insertion, counter updates, and navigation rerenders without observers", async () => {
  await fixture("<nav></nav>", async (page) => {
    await page.locator("nav").evaluate((e, html) => e.innerHTML = html, current("Home", "home-medium"));
    assert.equal(await page.locator(".bubble:visible").count(), 0);
    await page.locator(".bubble").evaluate((e) => e.textContent = "99+");
    assert.equal(await page.locator(".bubble:visible").count(), 0);
    await page.locator("nav").evaluate((e, html) => e.innerHTML = html, current("Notifications", "bell-fill-medium"));
    assert.equal(await page.locator(".bubble:visible").count(), 0);
    assert.equal(await page.locator(".label:visible").count(), 1);
  });
});

test("computed hiding works in both light and dark color schemes", async () => {
  await fixture(`<nav>${current("Home", "home-medium")}${current("Notifications", "bell-medium")}</nav>`, async (page) => {
    for (const colorScheme of ["light", "dark"]) {
      await page.emulateMedia({ colorScheme });
      assert.equal(await page.locator(".bubble:visible").count(), 0);
      assert.equal(await page.locator("svg:visible").count(), 2);
    }
  });
});

test("real installed extension injects CSS only on the matched HTTPS LinkedIn origin", async () => {
  const extensionRoot = process.env.QUIET_EXTENSION_DIR
    ? resolve(process.env.QUIET_EXTENSION_DIR) : root;
  const profile = await mkdtemp(resolve(tmpdir(), "quiet-linkedin-"));
  let context;
  try {
    context = await chromium.launchPersistentContext(profile, {
      ...browserOptions,
      ...(!executablePath ? { channel: "chromium" } : {}),
      headless: true,
      args: [
        ...browserOptions.args,
        `--disable-extensions-except=${extensionRoot}`,
        `--load-extension=${extensionRoot}`
      ]
    });
    const html = `<nav>${current("Home", "home-medium")}${current("Notifications", "bell-fill-medium")}${legacy("/messaging/", "Messaging")}</nav>`;
    await context.route("**/*", (route) => route.fulfill({ status: 200, contentType: "text/html", body: html }));
    const page = await context.newPage();
    for (const [url, hidden] of [
      ["https://www.linkedin.com/in/test-fixture/", true],
      ["https://www.linkedin.com/feed/", true],
      ["https://www.linkedin.com/notifications/", true],
      ["https://www.linkedin.com/messaging/", true],
      ["https://www.linkedin.com/messaging/thread/test-fixture/", true],
      ["https://www.linkedin.com/mynetwork/", true],
      ["https://www.linkedin.com/jobs/", true],
      ["https://www.linkedin.com/search/results/all/?keywords=test", true],
      ["https://www.linkedin.com/company/test-fixture/", true],
      ["https://example.com/", false],
      ["http://www.linkedin.com/feed/", false],
      ["https://sub.linkedin.com/feed/", false]
    ]) {
      await page.goto(url);
      await page.waitForFunction(({ hidden }) => {
        const e = document.querySelector(".bubble");
        return e && (getComputedStyle(e).display === "none") === hidden;
      }, { hidden }, { timeout: 5000 });
      assert.equal(await page.locator(".bubble:visible").count(), hidden ? 0 : 2, url);
      assert.equal(await page.locator(".notification-badge:visible").count(), 1, url);
    }
    // Load the captured production structure with the actual unpacked package.
    const live = await readFile(resolve(root, "tests/fixtures/linkedin-nav.html"), "utf8");
    await context.unroute("**/*");
    await context.route("**/*", (route) => route.fulfill({
      status: 200, contentType: "text/html", body: live
    }));
    await page.goto("https://www.linkedin.com/in/live-markup-fixture/");
    for (const id of ["home-medium", "bell-fill-medium"]) {
      await page.waitForFunction((id) =>
        getComputedStyle(document.getElementById(id).nextElementSibling).display === "none", id);
      assert.equal(await page.locator(`#${id}`).isVisible(), true);
    }
    // Full loads, reloads, SPA route changes, and nav-layout swaps all keep
    // the manifest stylesheet, without a runtime script or mutation observer.
    const messaging = await readFile(resolve(root, "tests/fixtures/linkedin-messaging-nav.html"), "utf8");
    await context.unroute("**/*");
    await context.route("**/*", (route) => route.fulfill({
      status: 200, contentType: "text/html", body: messaging
    }));
    const routes = [
      "/feed/", "/in/test-fixture/", "/messaging/thread/test-fixture/",
      "/notifications/", "/mynetwork/", "/jobs/", "/search/results/all/",
      "/company/test-fixture/"
    ];
    for (const route of routes) {
      await page.goto(`https://www.linkedin.com${route}`);
      await page.waitForFunction(() =>
        getComputedStyle(document.querySelector(".notification-badge")).display === "none");
      await page.reload();
      await page.waitForFunction(() =>
        getComputedStyle(document.querySelector(".notification-badge")).display === "none");
    }
    for (let i = 0; i < routes.length; i++) {
      await page.evaluate(({ route, markup }) => {
        history.pushState({}, "", route);
        document.body.innerHTML = new DOMParser().parseFromString(markup, "text/html").body.innerHTML;
      }, { route: routes[i], markup: i % 2 ? live : messaging });
      if (i % 2) {
        assert.equal(await page.locator("#home-medium").evaluate((e) =>
          getComputedStyle(e.nextElementSibling).display), "none");
      } else {
        assert.equal(await page.locator(".notification-badge").first().evaluate((e) =>
          getComputedStyle(e).display), "none");
      }
    }
  } finally {
    await context?.close();
    await rm(profile, { recursive: true, force: true });
  }
});
