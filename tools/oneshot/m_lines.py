from lib import F, X, T, sig, fx, _check_and_write
import math

d1 = abs(3 * 1 + 4 * 2 - 5) / 5                # distance of (1,2) from 3x + 4y − 5 = 0
d2 = abs(-5 - 10) / 5                           # 3x+4y−5=0 and 3x+4y+10=0
area = abs(0 * (4 - 0) + 3 * (0 - 0) + 0 * (0 - 4)) / 2
area = 0.5 * abs(0 * (0 - 4) + 3 * (4 - 0) + 0 * (0 - 0))   # (0,0),(3,0),(0,4)
th = math.degrees(math.atan(abs((3 - 1) / (1 + 3 * 1))))
cx, cy = (0 + 3 + 0) / 3, (0 + 0 + 4) / 3
sx, sy = (2 * 7 + 1 * 1) / 3, (2 * 8 + 1 * 2) / 3   # dividing (1,2)-(7,8) in 2:1

DOC = {
"slug": "straight-lines", "subject": "Mathematics",
"chapters": {"JEE": "Straight Lines"},
"title": "Straight Lines", "readMinutes": 15,
"summary": [
"Coordinate geometry starts with the distance and section formulas, the area of a triangle and the centres of a triangle (centroid, incentre, circumcentre, orthocentre).",
"A line can be written in slope–intercept, point–slope, two-point, intercept, normal or general form. Slopes decide parallel (m₁ = m₂) and perpendicular (m₁m₂ = −1) lines.",
"Distance of a point from a line, distance between parallel lines, angle between lines, family of lines through an intersection and angle bisectors are the core JEE tools.",
],
"formulas": [
F("Distance and section", "d = √((x₂ − x₁)² + (y₂ − y₁)²);  internal division m:n → ((mx₂ + nx₁)/(m + n), (my₂ + ny₁)/(m + n))", "Basic coordinate formulas."),
F("Area of triangle", "Δ = ½|x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|;  area 0 ⇔ collinear", "Area and collinearity.", None, tag="PYQ favourite"),
F("Centres of a triangle", "centroid G = ((x₁ + x₂ + x₃)/3, (y₁ + y₂ + y₃)/3);  incentre I = ((ax₁ + bx₂ + cx₃)/(a + b + c), …);  G divides OH (circumcentre O to orthocentre H) in 1:2", "Triangle centres."),
F("Slope", "m = tan θ = (y₂ − y₁)/(x₂ − x₁);  parallel m₁ = m₂;  perpendicular m₁m₂ = −1", "Direction of a line."),
F("Forms of a line", "y = mx + c;  y − y₁ = m(x − x₁);  x/a + y/b = 1;  x cos α + y sin α = p;  ax + by + c = 0 (slope −a/b)", "Writing equations of lines.", None, tag="PYQ favourite"),
F("Angle between lines", "tan θ = |(m₁ − m₂)/(1 + m₁m₂)|", "Acute angle between two lines."),
F("Distance from a point", "d = |ax₁ + by₁ + c|/√(a² + b²)", "Perpendicular distance.", None, tag="PYQ favourite"),
F("Distance between parallel lines", "d = |c₁ − c₂|/√(a² + b²)  for ax + by + c₁ = 0 and ax + by + c₂ = 0", "Parallel lines.", "Make the x and y coefficients identical first."),
F("Foot of perpendicular and image", "foot: (x − x₁)/a = (y − y₁)/b = −(ax₁ + by₁ + c)/(a² + b²);  image: same with −2(ax₁ + by₁ + c)/(a² + b²)", "Reflections in a line."),
F("Family of lines", "L₁ + λL₂ = 0 passes through the intersection of L₁ = 0 and L₂ = 0", "Lines through an intersection point."),
F("Concurrency", "three lines concur if the determinant |a₁ b₁ c₁; a₂ b₂ c₂; a₃ b₃ c₃| = 0", "Checking concurrent lines."),
F("Angle bisectors", "(a₁x + b₁y + c₁)/√(a₁² + b₁²) = ±(a₂x + b₂y + c₂)/√(a₂² + b₂²)", "Bisectors of angles between two lines."),
F("Position of a point", "points (x₁, y₁), (x₂, y₂) are on the same side of ax + by + c = 0 if ax₁ + by₁ + c and ax₂ + by₂ + c have the same sign", "Same side or opposite sides."),
],
"examples": [
X("Distance from a line", "Distance of (1, 2) from 3x + 4y − 5 = 0?",
  f"|3 + 8 − 5|/5 = 6/5 = {fx(d1, 1)}.", [(fx(d1, 1), "1.2")]),
X("Parallel lines", "Distance between 3x + 4y − 5 = 0 and 3x + 4y + 10 = 0?",
  f"|−5 − 10|/5 = {fx(d2)}.", [(fx(d2), "3")]),
X("Area", "Area of the triangle with vertices (0, 0), (3, 0), (0, 4)?",
  f"½ × 3 × 4 = {fx(area)}.", [(fx(area), "6")]),
X("Angle between lines", "Acute angle between y = 3x + 1 and y = x?",
  f"tan θ = |(3 − 1)/(1 + 3)| = 1/2 ⇒ θ ≈ {fx(th, 2)}°.", [(fx(th, 2), "26.57")]),
X("Section formula", "Point dividing the join of (1, 2) and (7, 8) internally in 2:1?",
  f"((2 × 7 + 1 × 1)/3, (2 × 8 + 1 × 2)/3) = ({fx(sx)}, {fx(sy)}).", [(fx(sx), "5"), (fx(sy), "6")]),
X("Family of lines", "Find the line through the intersection of x + y = 5 and x − y = 1 that passes through the origin.",
  "(x + y − 5) + λ(x − y − 1) = 0. Origin: −5 − λ = 0 ⇒ λ = −5 ⇒ x + y − 5 − 5x + 5y + 5 = 0 ⇒ −4x + 6y = 0 ⇒ 2x = 3y.", []),
],
"topics": [
T("Locus", "To find a locus, let the moving point be (h, k), write the given condition as an equation in h and k, then replace h, k by x, y."),
T("Shifting the origin", "If the origin moves to (h, k) without rotation, new coordinates are X = x − h, Y = y − k. Rotation of axes by θ: x = X cos θ − Y sin θ, y = X sin θ + Y cos θ."),
T("Lines making a given angle", "Lines through (x₁, y₁) making angle α with y = mx + c: slopes are (m ± tan α)/(1 ∓ m tan α)."),
T("Pair of straight lines", "ax² + 2hxy + by² = 0 represents two lines through the origin; angle tan θ = 2√(h² − ab)/|a + b|. They are perpendicular if a + b = 0 and coincident if h² = ab."),
T("Orthocentre shortcut", "For a right-angled triangle, the orthocentre is the right-angle vertex and the circumcentre is the midpoint of the hypotenuse."),
T("Parametric form", "A point at distance r from (x₁, y₁) along a line with inclination θ is (x₁ + r cos θ, y₁ + r sin θ) — handy for distances along a line."),
],
"ratta": [
"Area ½|x₁(y₂ − y₃) + …|;  0 ⇒ collinear.",
"Perpendicular: m₁m₂ = −1.",
"tan θ = |(m₁ − m₂)/(1 + m₁m₂)|.",
"Distance |ax₁ + by₁ + c|/√(a² + b²).",
"Parallel lines: |c₁ − c₂|/√(a² + b²).",
"L₁ + λL₂ = 0 through intersection.",
"G divides OH in 1:2.",
],
}

SYLLABUS = [
("Cartesian system, distance formula, section formula, locus", ["distance", "section", "locus"]),
("Slope of a line, parallel and perpendicular lines, intercepts", ["slope", "parallel", "perpendicular", "intercept"]),
("Various forms of equations of a line; intersection of lines, angles between two lines, conditions for concurrence", ["angle between", "concur"]),
("Distance of a point from a line; centroid, orthocentre and circumcentre of a triangle", ["centroid", "orthocentre", "circumcentre"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
