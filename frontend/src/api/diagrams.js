// Diagram library index (frontend/public/diagrams/index.json, built from the
// founder's checked diagram collection). Fetched once, cached in memory.
let cache = null;

export function loadDiagrams() {
  if (!cache) {
    cache = fetch("/diagrams/index.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => { cache = null; return []; });
  }
  return cache;
}

export async function diagramsFor(chapterSlug, subject) {
  const all = await loadDiagrams();
  return all.filter((d) => d.c === chapterSlug && (!subject || d.s === subject));
}
