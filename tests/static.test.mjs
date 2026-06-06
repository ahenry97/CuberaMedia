import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

test("translation file includes English and Spanish dictionaries", () => {
  const source = fs.readFileSync("src/lib/i18n.ts", "utf8");
  assert.match(source, /en:\s*{/);
  assert.match(source, /es:\s*{/);
  assert.match(source, /Cubera Digital Solutions/);
});

test("public users cannot choose developer role during registration", () => {
  const source = fs.readFileSync("src/lib/db/store.ts", "utf8");
  assert.match(source, /role:\s*"customer"/);
  assert.doesNotMatch(fs.readFileSync("src/components/auth/AuthForms.tsx", "utf8"), /name="role"/);
});

test("production workflow uses environment approval gate", () => {
  const source = fs.readFileSync(".github/workflows/production-migration.yml", "utf8");
  assert.match(source, /environment:\s*\n\s*name:\s*production/);
  assert.match(source, /aaronhenry0512@gmail.com/);
});

test("local developer notes capture workflow is present", () => {
  const layout = fs.readFileSync("src/app/layout.tsx", "utf8");
  const route = fs.readFileSync("src/app/api/developer-notes/route.ts", "utf8");
  const docs = fs.readFileSync("docs/developer-notes.md", "utf8");

  assert.match(layout, /DevelopmentIssueBar/);
  assert.match(route, /developer-notes/);
  assert.match(route, /NODE_ENV !== "development"/);
  assert.match(docs, /review developer notes/i);
});
