import { mkdir, readFile, copyFile, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(resolve(root, "manifest.json"), "utf8"));
const name = `quiet-linkedin-v${manifest.version}`;
const staging = resolve(root, "dist", name);
const zip = resolve(root, "dist", `${name}.zip`);
const files = [
  "manifest.json",
  "src/quiet.css",
  ...Object.values(manifest.icons),
  "LICENSE",
  "INSTALL.md",
  "PRIVACY.md"
];

await rm(staging, { recursive: true, force: true });
await rm(zip, { force: true });
for (const file of files) {
  const dest = resolve(staging, file);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(resolve(root, file), dest);
}
// -X excludes platform-specific metadata; only the explicit allowlist ships.
execFileSync("zip", ["-X", "-q", zip, ...files], { cwd: staging });
console.log(`Ready: ${zip}`);
console.log(`${files.length} allowlisted files; no tests, npm packages, or screenshots.`);
