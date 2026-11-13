# OneShot generator

Each `p_*.py` (Physics), `c_*.py` (Chemistry), `m_*.py` (Maths) file holds one chapter.
`lib.build()` writes `backend/content/oneshot/<slug>.json` **only if**:

- every worked-example number recomputed in Python/sympy matches the number printed in the solution,
- every point of the current NTA syllabus for that chapter (the `SYLLABUS` list) appears on the page,
- the page has enough formulas, examples and topics, and no leftover junk.

Run all: `python3 tools/oneshot/build_all.py` (needs `sympy`, `mpmath`).
Text uses `^{…}` / `^x` for superscripts and `_{…}` / `_word` for subscripts — the app renders them (`MathText.jsx`).
