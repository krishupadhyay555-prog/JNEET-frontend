// Keeps the frontend's offline copy of the exam dates identical to the
// backend list (the countdown must work offline, so it can't be fetched).
import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getTargetExamOptions } from "../config/targetExams.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = fs.readFileSync(path.join(here, "../../frontend/src/config/targetExams.js"), "utf8");

const frontendRows = [...frontend.matchAll(/\{ key: "(\w+)", label: "([^"]+)", date: "([^"]+)", tentative: (true|false), examMode: "(\w+)" \}/g)]
  .map(([, key, label, date, tentative, examMode]) => ({ key, label, date, tentative: tentative === "true", examMode }));

describe("target exams", () => {
  it("frontend and backend lists match exactly", () => {
    const backend = getTargetExamOptions().filter((o) => o.key !== "RE_NEET");
    expect(frontendRows.length).toBeGreaterThan(0);
    expect(frontendRows).toEqual(backend);
  });

  it("offers JEE Main only — no JEE Advanced", () => {
    expect(getTargetExamOptions().some((o) => /ADV|Advanced/i.test(o.key + o.label))).toBe(false);
  });
});
