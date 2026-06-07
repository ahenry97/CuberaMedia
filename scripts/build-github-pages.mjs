import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const apiPath = path.join(repoRoot, "src", "app", "api");
const disabledApiPath = path.join(repoRoot, "src", "app", "_api.disabled-for-github-pages");
const outPath = path.join(repoRoot, "out");

function moveIfExists(from, to) {
  if (!fs.existsSync(from)) return false;
  if (fs.existsSync(to)) {
    fs.rmSync(to, { recursive: true, force: true });
  }
  fs.renameSync(from, to);
  return true;
}

const movedApi = moveIfExists(apiPath, disabledApiPath);

try {
  const result = spawnSync("npx", ["next", "build"], {
    cwd: repoRoot,
    env: {
      ...process.env,
      GITHUB_PAGES: "true"
    },
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else {
    fs.writeFileSync(path.join(outPath, ".nojekyll"), "");
  }
} finally {
  if (movedApi) {
    moveIfExists(disabledApiPath, apiPath);
  }
}
