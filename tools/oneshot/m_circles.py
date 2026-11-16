from lib import F, X, T, sig, fx, _check_and_write
import math

# x² + y² − 4x + 6y − 12 = 0 → centre (2, −3), r = √(4 + 9 + 12) = 5
r1 = math.sqrt(4 + 9 + 12)
# tangent length from (7, 2)? S1 = 49 + 4 − 28 + 12 − 12 = 25 → 5
S1 = 7 ** 2 + 2 ** 2 - 4 * 7 + 6 * 2 - 12
tl = math.sqrt(S1)
# chord length: circle x²+y²=25, line distance 3 → 2√(25 − 9) = 8
chord = 2 * math.sqrt(25 - 9)
# common tangents: C1 (0,0) r=3, C2 (10,0) r=4 → d = 10 > 7 → 4 tangents
d = 10; tangents = 4 if d > 3 + 4 else None
# orthogonality: 2g1g2 + 2f1f2 = c1 + c2 check for x²+y²+2x=... skip

DOC = {
"slug": "circles", "subject": "Mathematics",
"chapters": {"JEE": "Circles"},
"title": "Circles", "readMinutes": 14,
"summary": [
"A circle is the locus of points at a fixed distance (radius) from a fixed point (centre). The general equation x² + y² + 2gx + 2fy + c = 0 has centre (−g, −f) and radius √(g² + f² − c).",
"The position of a point or line relative to a circle is decided by S₁ = x₁² + y₁² + 2gx₁ + 2fy₁ + c and by comparing distance from the centre with the radius.",
"Tangent, normal, chord of contact, length of tangent, common tangents, family of circles and orthogonal circles are the main JEE tools.",
],
"formulas": [
F("Standard and general form", "(x − h)² + (y − k)² = r²;  x² + y² + 2gx + 2fy + c = 0 → centre (−g, −f), r = √(g² + f² − c)", "Equation of a circle.", "A real circle needs g² + f² − c ≥ 0.", tag="PYQ favourite"),
F("Diameter form", "(x − x₁)(x − x₂) + (y − y₁)(y − y₂) = 0", "Circle on the join of two points as diameter."),
F("Parametric form", "x = h + r cos θ, y = k + r sin θ", "Points on a circle."),
F("Position of a point", "S₁ > 0 outside;  S₁ = 0 on;  S₁ < 0 inside", "Where a point lies."),
F("Line and circle", "distance p of centre from line: p > r no intersection;  p = r tangent;  p < r secant;  chord length = 2√(r² − p²)", "Line–circle position.", None, tag="PYQ favourite"),
F("Tangent condition", "y = mx + c touches x² + y² = a² iff c² = a²(1 + m²);  tangent: y = mx ± a√(1 + m²)", "Slope form of tangent."),
F("Tangent at a point", "T = 0: xx₁ + yy₁ + g(x + x₁) + f(y + y₁) + c = 0", "Tangent at (x₁, y₁) on the circle."),
F("Length of tangent", "√S₁ from an external point (x₁, y₁)", "Tangent length.", None, tag="PYQ favourite"),
F("Chord of contact and midpoint chord", "chord of contact from (x₁, y₁): T = 0;  chord with midpoint (x₁, y₁): T = S₁", "Chords from external or midpoints."),
F("Two circles", "d > r₁ + r₂: 4 common tangents;  d = r₁ + r₂: 3;  |r₁ − r₂| < d < r₁ + r₂: 2;  d = |r₁ − r₂|: 1;  d < |r₁ − r₂|: 0", "Number of common tangents.", None, tag="PYQ favourite"),
F("Orthogonal circles", "2g₁g₂ + 2f₁f₂ = c₁ + c₂", "Circles cutting at right angles."),
F("Family of circles", "S + λL = 0 (circle and line);  S₁ + λS₂ = 0 (two circles);  radical axis S₁ − S₂ = 0", "Circles through intersection points."),
],
"examples": [
X("Centre and radius", "Find the centre and radius of x² + y² − 4x + 6y − 12 = 0.",
  f"g = −2, f = 3 ⇒ centre (2, −3); r = √(4 + 9 + 12) = {fx(r1)}.", [(fx(r1), "5")]),
X("Length of tangent", "Length of the tangent from (7, 2) to the circle above?",
  f"S₁ = 49 + 4 − 28 + 12 − 12 = {S1} ⇒ length = √25 = {fx(tl)}.", [(str(S1), "25"), (fx(tl), "5")]),
X("Chord length", "A line is at distance 3 from the centre of x² + y² = 25. Chord length?",
  f"2√(25 − 9) = {fx(chord)}.", [(fx(chord), "8")]),
X("Common tangents", "Circles of radii 3 and 4 have centres 10 apart. Number of common tangents?",
  f"d = 10 > 3 + 4 = 7 ⇒ {tangents} common tangents.", [(str(tangents), "4")]),
X("Tangent with given slope", "Tangents to x² + y² = 9 with slope 1?",
  "y = x ± 3√2 (using c = ±a√(1 + m²)).", []),
X("Circle through three points", "Find the circle through (0, 0), (2, 0) and (0, 4).",
  "c = 0; through (2, 0): 4 + 4g = 0 ⇒ g = −1; through (0, 4): 16 + 8f = 0 ⇒ f = −2. Equation: x² + y² − 2x − 4y = 0 (centre (1, 2), radius √5).", []),
],
"topics": [
T("Conditions for a general second-degree equation to be a circle", "ax² + 2hxy + by² + 2gx + 2fy + c = 0 is a circle if a = b ≠ 0 and h = 0 (and the radius is real)."),
T("Normal to a circle", "Every normal passes through the centre. The normal at (x₁, y₁) is the line joining (x₁, y₁) and the centre."),
T("Director circle", "The locus of points from which perpendicular tangents are drawn to x² + y² = a² is x² + y² = 2a²."),
T("Radical axis and centre", "The radical axis is the locus of points with equal tangent lengths to two circles: S₁ − S₂ = 0, perpendicular to the line of centres. Three circles' radical axes meet at the radical centre."),
T("Angle between circles", "cos θ = (r₁² + r₂² − d²)/(2r₁r₂), where θ is the angle between radii at a point of intersection; θ = 90° gives the orthogonality condition."),
T("Common chord", "The common chord of two intersecting circles is S₁ − S₂ = 0; its length uses the distance from either centre."),
],
"ratta": [
"Centre (−g, −f), r = √(g² + f² − c).",
"Tangent length √S₁.",
"Chord length 2√(r² − p²).",
"y = mx ± a√(1 + m²) tangent to x² + y² = a².",
"Common tangents: 4, 3, 2, 1, 0 as circles move closer.",
"Orthogonal: 2g₁g₂ + 2f₁f₂ = c₁ + c₂.",
"Director circle x² + y² = 2a².",
],
}

SYLLABUS = [
("Standard form of equation of a circle, general form, radius and centre", ["centre", "radius", "general"]),
("Equation of a circle when the end points of a diameter are given", ["diameter"]),
("Points of intersection of a line and a circle; equation of the tangent to a circle", ["tangent", "chord"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Circle un points ka locus hai jo ek fixed point (centre) se fixed doori (radius) par hain. General equation x² + y² + 2gx + 2fy + c = 0 ka centre (−g, −f) aur radius √(g² + f² − c) hai.",
"Point ya line ki circle ke relative position S₁ = x₁² + y₁² + 2gx₁ + 2fy₁ + c se, aur centre se distance ko radius se compare karke tay hoti hai.",
"Tangent, normal, chord of contact, tangent ki length, common tangents, family of circles aur orthogonal circles JEE ke main tools hain. Diameter form aur chord length bhi aksar poochhe jaate hain.",
],
when=[
("Circle ki equation.", "Real circle ke liye g² + f² − c ≥ 0 zaroori hai — check karna mat bhoolna."),
("Do points ko jodne wali line diameter ho to circle.", None),
("Circle par points.", None),
("Point kahan hai.", None),
("Line–circle position.", None),
("Tangent ka slope form.", None),
("Circle par (x₁, y₁) par tangent.", None),
("Tangent ki length.", None),
("Bahar ke point ya midpoint se chords.", None),
("Common tangents ki sankhya.", None),
("Right angle par katne wale circles.", None),
("Intersection points se guzarne wale circles.", None),
],
examples=[
("Centre aur radius", "x² + y² − 4x + 6y − 12 = 0 ka centre aur radius nikalo.",
 "g = −2, f = 3 ⇒ centre (2, −3); r = √(4 + 9 + 12) = ⟨0⟩."),
("Tangent ki length", "(7, 2) se upar wale circle tak tangent ki length?",
 "S₁ = 49 + 4 − 28 + 12 − 12 = ⟨0⟩ ⇒ length = √25 = ⟨1⟩."),
("Chord ki length", "Ek line x² + y² = 25 ke centre se 3 doori par hai. Chord length?",
 "2√(25 − 9) = ⟨0⟩."),
("Common tangents", "Radii 3 aur 4 wale circles ke centres 10 door hain. Common tangents kitne?",
 "d = 10 > 3 + 4 = 7 ⇒ ⟨0⟩ common tangents."),
("Diye slope ka tangent", "x² + y² = 9 ke slope 1 wale tangents?",
 "y = x ± 3√2 (c = ±a√(1 + m²) se)."),
("Teen points se circle", "(0, 0), (2, 0) aur (0, 4) se guzarne wala circle nikalo.",
 "c = 0; (2, 0) se: 4 + 4g = 0 ⇒ g = −1; (0, 4) se: 16 + 8f = 0 ⇒ f = −2. Equation: x² + y² − 2x − 4y = 0 (centre (1, 2), radius √5)."),
],
topics=[
("Conditions for a general second-degree equation to be a circle", "ax² + 2hxy + by² + 2gx + 2fy + c = 0 circle hai agar a = b ≠ 0 aur h = 0 (aur radius real ho)."),
("Normal to a circle", "Har normal centre se guzarta hai. (x₁, y₁) par normal wo line hai jo (x₁, y₁) ko centre se jodti hai."),
("Director circle", "Jin points se x² + y² = a² par perpendicular tangents khinchte hain unka locus x² + y² = 2a² hai."),
("Radical axis and centre", "Radical axis un points ka locus hai jinki do circles tak tangent lengths barabar hain: S₁ − S₂ = 0, line of centres ke perpendicular. Teen circles ke radical axes radical centre par milte hain."),
("Angle between circles", "cos θ = (r₁² + r₂² − d²)/(2r₁r₂), jahan θ intersection point par radii ke beech angle hai; θ = 90° orthogonality condition deta hai."),
("Common chord", "Do katne wale circles ki common chord S₁ − S₂ = 0 hai; iski length kisi bhi centre se distance lekar nikaalte hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
