import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { wantsDiagram, findDiagram, diagramMarkdown } from "../services/diagrams.js";

const lib = JSON.parse(readFileSync(new URL("../content/diagrams.json", import.meta.url), "utf8"));

describe("diagram library", () => {
  it("every entry points to a real file in frontend/public", () => {
    expect(lib.length).toBeGreaterThan(900);
    for (const d of lib) {
      expect(d.f).toMatch(/^\/diagrams\/[a-z]+\/[a-z0-9-]+\/[a-z0-9.-]+\.webp$/);
      expect(existsSync(new URL(`../../frontend/public${d.f}`, import.meta.url))).toBe(true);
    }
  });
  it("ids are unique", () => {
    expect(new Set(lib.map((d) => d.id)).size).toBe(lib.length);
  });
});

describe("chat diagram matching", () => {
  it("detects diagram requests (English + Hinglish)", () => {
    expect(wantsDiagram("nephron ka diagram se samjhao")).toBe(true);
    expect(wantsDiagram("draw a labelled heart")).toBe(true);
    expect(wantsDiagram("what is entropy")).toBe(false);
  });
  it("finds the right diagram", () => {
    expect(findDiagram("nephron ka diagram se samjhao", "NEET")?.t).toBe("Nephron");
    expect(findDiagram("diagram of dicot root", "NEET")?.t).toMatch(/Dicot Root/);
    expect(findDiagram("YDSE diagram dikhao", "JEE")?.t).toMatch(/YDSE/);
  });
  it("returns nothing for unrelated asks and respects exam subjects", () => {
    expect(findDiagram("diagram of my room", "NEET")).toBeNull();
    expect(findDiagram("ellipse foci diagram", "NEET")?.s).not.toBe("Mathematics");
  });
  it("renders a same-origin markdown image", () => {
    expect(diagramMarkdown({ t: "Nephron", f: "/diagrams/biology/x/nephron.webp" })).toBe("\n\n![Nephron](/diagrams/biology/x/nephron.webp)");
  });
});
