from lib import F, X, T, sig, fx, _check_and_write
import math

# parabola y² = 12x → a = 3, focus (3,0), latus rectum 12
a_p = 12 / 4; lr_p = 4 * a_p
# ellipse x²/25 + y²/16 = 1
a, b = 5, 4
e_el = math.sqrt(1 - b * b / (a * a)); lr_el = 2 * b * b / a; c_el = a * e_el
# hyperbola x²/16 − y²/9 = 1
A, B = 4, 3
e_hy = math.sqrt(1 + B * B / (A * A)); lr_hy = 2 * B * B / A
# focal distance on ellipse: point at x = 3 → r1 + r2 = 2a
sum_fd = 2 * a

DOC = {
"slug": "conic-sections", "subject": "Mathematics",
"chapters": {"JEE": "Conic Sections"},
"title": "Conic Sections", "readMinutes": 17,
"summary": [
"A conic is the locus of a point whose distance from a fixed point (focus) is e times its distance from a fixed line (directrix): e = 1 parabola, e < 1 ellipse, e > 1 hyperbola.",
"Standard forms: parabola y² = 4ax; ellipse x²/a² + y²/b² = 1 (b² = a²(1 − e²)); hyperbola x²/a² − y²/b² = 1 (b² = a²(e² − 1)).",
"For each conic know the focus, directrix, latus rectum, eccentricity, parametric point, tangent and normal equations and the tangent condition.",
],
"formulas": [
F("Parabola y² = 4ax", "focus (a, 0);  directrix x = −a;  axis y = 0;  latus rectum 4a;  parametric (at², 2at);  focal distance of (x, y) = x + a", "Standard parabola.", None, tag="PYQ favourite"),
F("Parabola tangents", "at (x₁, y₁): yy₁ = 2a(x + x₁);  slope form y = mx + a/m (condition c = a/m);  at t: ty = x + at²", "Tangents to a parabola."),
F("Parabola normal", "y = mx − 2am − am³;  at t: y + tx = 2at + at³", "Normals to a parabola.", "Three normals can be drawn from a point to a parabola (a cubic in m)."),
F("Focal chord", "for focal chord through t₁ and t₂: t₁t₂ = −1;  harmonic mean of focal segments = semi-latus rectum 2a", "Focal chord properties."),
F("Ellipse x²/a² + y²/b² = 1 (a > b)", "b² = a²(1 − e²);  foci (±ae, 0);  directrices x = ±a/e;  latus rectum 2b²/a;  parametric (a cos θ, b sin θ)", "Standard ellipse.", None, tag="PYQ favourite"),
F("Ellipse focal property", "SP + S′P = 2a for any point P", "Sum of focal distances."),
F("Ellipse tangent", "at (x₁, y₁): xx₁/a² + yy₁/b² = 1;  y = mx ± √(a²m² + b²)", "Tangents to an ellipse."),
F("Hyperbola x²/a² − y²/b² = 1", "b² = a²(e² − 1);  foci (±ae, 0);  directrices x = ±a/e;  latus rectum 2b²/a;  asymptotes y = ±(b/a)x;  parametric (a sec θ, b tan θ)", "Standard hyperbola.", None, tag="PYQ favourite"),
F("Hyperbola focal property", "|SP − S′P| = 2a", "Difference of focal distances."),
F("Hyperbola tangent", "at (x₁, y₁): xx₁/a² − yy₁/b² = 1;  y = mx ± √(a²m² − b²)", "Tangents to a hyperbola."),
F("Rectangular hyperbola", "x² − y² = a² (e = √2);  xy = c² with parametric (ct, c/t)", "Special hyperbola."),
F("Conjugate hyperbola", "−x²/a² + y²/b² = 1;  1/e₁² + 1/e₂² = 1", "Hyperbola and its conjugate."),
F("Director circle", "ellipse: x² + y² = a² + b²;  hyperbola: x² + y² = a² − b²;  parabola: directrix", "Locus of perpendicular tangents."),
],
"examples": [
X("Parabola", "For y² = 12x, find a, the focus and the length of the latus rectum.",
  f"4a = 12 ⇒ a = {fx(a_p)}; focus (3, 0); latus rectum = {fx(lr_p)}.", [(fx(a_p), "3"), (fx(lr_p), "12")]),
X("Ellipse", "For x²/25 + y²/16 = 1, find e, foci and latus rectum.",
  f"e = √(1 − 16/25) = {fx(e_el, 1)}; foci (±{fx(c_el)}, 0); latus rectum = 2 × 16/5 = {fx(lr_el, 1)}.", [(fx(e_el, 1), "0.6"), (fx(c_el), "3"), (fx(lr_el, 1), "6.4")]),
X("Hyperbola", "For x²/16 − y²/9 = 1, find e and latus rectum.",
  f"e = √(1 + 9/16) = 5/4 = {fx(e_hy, 2)}; latus rectum = 2 × 9/4 = {fx(lr_hy, 1)}; asymptotes y = ±(3/4)x.", [(fx(e_hy, 2), "1.25"), (fx(lr_hy, 1), "4.5")]),
X("Sum of focal distances", "For the ellipse x²/25 + y²/16 = 1, find SP + S′P for any point P.",
  f"2a = {sum_fd}.", [(str(sum_fd), "10")]),
X("Tangent condition", "For what c does y = 2x + c touch y² = 8x?",
  "a = 2, m = 2 ⇒ c = a/m = 1.", []),
X("Identify the conic", "Identify 9x² + 4y² = 36.",
  "Divide by 36: x²/4 + y²/9 = 1 — an ellipse with major axis along the y-axis (a = 3, b = 2), e = √5/3.", []),
],
"topics": [
T("Other forms of the parabola", "x² = 4ay (opens up), y² = −4ax (opens left), x² = −4ay (opens down). Shifted: (y − k)² = 4a(x − h) has vertex (h, k)."),
T("Ellipse with vertical major axis", "If b > a in x²/a² + y²/b² = 1, then a² = b²(1 − e²), foci are (0, ±be) and directrices y = ±b/e."),
T("Auxiliary circle and eccentric angle", "The circle on the major axis as diameter is the auxiliary circle x² + y² = a²; the point (a cos θ, b sin θ) has eccentric angle θ."),
T("Reflection property", "Rays parallel to the axis of a parabola reflect through the focus (dish antennas, headlights). Rays from one focus of an ellipse reflect through the other focus."),
T("Chord of contact and midpoint chord", "Same notation as for circles: chord of contact T = 0; chord with given midpoint T = S₁."),
T("Identifying a general conic", "For ax² + 2hxy + by² + 2gx + 2fy + c = 0 (non-degenerate): h² = ab parabola, h² < ab ellipse, h² > ab hyperbola; a + b = 0 rectangular hyperbola."),
],
"ratta": [
"e = 1 parabola, < 1 ellipse, > 1 hyperbola.",
"y² = 4ax: focus (a, 0), LR 4a, focal distance x + a.",
"Tangent conditions: parabola c = a/m;  ellipse c² = a²m² + b²;  hyperbola c² = a²m² − b².",
"Ellipse b² = a²(1 − e²);  hyperbola b² = a²(e² − 1).",
"LR of ellipse and hyperbola = 2b²/a.",
"SP + S′P = 2a (ellipse);  |SP − S′P| = 2a (hyperbola).",
"Focal chord: t₁t₂ = −1.",
],
}

SYLLABUS = [
("Sections of a cone; equations of conic sections (parabola, ellipse and hyperbola) in standard forms", ["parabola", "ellipse", "hyperbola"]),
("Condition for y = mx + c to be a tangent and point(s) of tangency", ["tangent", "condition"]),
("Focus, directrix, eccentricity, latus rectum", ["focus", "directrix", "eccentricity", "latus rectum"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
