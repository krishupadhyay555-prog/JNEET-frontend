from lib import F, X, T, sig, fx, _check_and_write
import numpy as np, math

d_pp = abs(2 * 1 + 3 * 2 + 6 * 3 - 5) / math.sqrt(4 + 9 + 36)          # (1,2,3) to 2x+3y+6z−5=0 → 21/7 = 3
# angle between lines with direction (1,1,0) and (0,1,1)
u, v = np.array([1, 1, 0]), np.array([0, 1, 1])
ang = math.degrees(math.acos(u @ v / (np.linalg.norm(u) * np.linalg.norm(v))))
# shortest distance between skew lines r = (0,0,0) + t(1,0,0) and r = (0,1,1)? use (0,0,1)+s(0,1,0)
a1, b1 = np.array([0, 0, 0]), np.array([1, 0, 0])
a2, b2 = np.array([0, 0, 2]), np.array([0, 1, 0])
cr = np.cross(b1, b2)
sd = abs((a2 - a1) @ cr) / np.linalg.norm(cr)
# direction cosines of (2, 3, 6)
dc = 1 / 7
# parallel planes distance 2x−y+2z+3=0, 4x−2y+4z+5=0 → divide by 2: |3 − 2.5|/3
dpl = abs(3 - 2.5) / 3

DOC = {
"slug": "three-dimensional-geometry", "subject": "Mathematics",
"chapters": {"JEE": "Three Dimensional Geometry"},
"title": "Three Dimensional Geometry", "readMinutes": 16,
"summary": [
"Points in space have coordinates (x, y, z). Direction cosines (l, m, n) satisfy l² + m² + n² = 1; direction ratios are any numbers proportional to them.",
"A line is written in vector form r = a + λb or Cartesian form (x − x₁)/a = (y − y₁)/b = (z − z₁)/c. Skew lines neither meet nor are parallel; their shortest distance is a JEE favourite.",
"A plane is r · n = d or ax + by + cz + d = 0. Know angle between planes and lines, distance of a point from a plane, foot of perpendicular, image, and coplanarity of lines.",
],
"formulas": [
F("Distance and section", "d = √((x₂ − x₁)² + (y₂ − y₁)² + (z₂ − z₁)²);  internal division m:n as in 2D with z included", "Basic 3D formulas."),
F("Direction cosines", "l = cos α, m = cos β, n = cos γ;  l² + m² + n² = 1;  from ratios (a, b, c): l = a/√(a² + b² + c²), …", "Direction of a line.", None, tag="PYQ favourite"),
F("Line through two points", "(x − x₁)/(x₂ − x₁) = (y − y₁)/(y₂ − y₁) = (z − z₁)/(z₂ − z₁)", "Equation of a line."),
F("Angle between lines", "cos θ = |a₁a₂ + b₁b₂ + c₁c₂|/(√(a₁² + b₁² + c₁²)√(a₂² + b₂² + c₂²));  perpendicular: a₁a₂ + b₁b₂ + c₁c₂ = 0;  parallel: a₁/a₂ = b₁/b₂ = c₁/c₂", "Angle between direction ratios."),
F("Shortest distance (skew lines)", "SD = |(a₂ − a₁) · (b₁ × b₂)|/|b₁ × b₂|", "Distance between skew lines r = a₁ + λb₁ and r = a₂ + μb₂.", "If SD = 0 the lines intersect.", tag="PYQ favourite"),
F("Distance between parallel lines", "d = |(a₂ − a₁) × b|/|b|", "Parallel lines in space."),
F("Plane forms", "r · n = d;  ax + by + cz + d = 0 (normal (a, b, c));  intercept x/a + y/b + z/c = 1;  through 3 points: determinant = 0", "Equation of a plane."),
F("Distance from a plane", "|ax₁ + by₁ + cz₁ + d|/√(a² + b² + c²)", "Point to plane.", None, tag="PYQ favourite"),
F("Angle between planes / line and plane", "planes: cos θ = |n₁ · n₂|/(|n₁||n₂|);  line and plane: sin φ = |b · n|/(|b||n|)", "Angles in 3D."),
F("Plane through intersection", "P₁ + λP₂ = 0", "Family of planes."),
F("Coplanarity of two lines", "(a₂ − a₁) · (b₁ × b₂) = 0", "Do two lines lie in one plane?"),
F("Foot of perpendicular and image in a plane", "(x − x₁)/a = (y − y₁)/b = (z − z₁)/c = −(ax₁ + by₁ + cz₁ + d)/(a² + b² + c²);  image: multiply the right side by 2", "Projection and reflection."),
],
"examples": [
X("Point to plane", "Distance of (1, 2, 3) from 2x + 3y + 6z − 5 = 0?",
  f"|2 + 6 + 18 − 5|/√49 = 21/7 = {fx(d_pp)}.", [(fx(d_pp), "3")]),
X("Angle between lines", "Angle between lines with direction ratios (1, 1, 0) and (0, 1, 1)?",
  f"cos θ = 1/(√2 × √2) = 1/2 ⇒ θ = {fx(ang)}°.", [(fx(ang), "60")]),
X("Shortest distance", "Lines r = λî and r = 2k̂ + μĵ. Shortest distance?",
  f"b₁ × b₂ = î × ĵ = k̂; (a₂ − a₁) · k̂ = 2 ⇒ SD = {fx(sd)}.", [(fx(sd), "2")]),
X("Direction cosines", "Direction cosines of the line with ratios (2, 3, 6)?",
  "√(4 + 9 + 36) = 7 ⇒ (2/7, 3/7, 6/7).", []),
X("Parallel planes", "Distance between 2x − y + 2z + 3 = 0 and 4x − 2y + 4z + 5 = 0?",
  f"Write the second as 2x − y + 2z + 2.5 = 0: |3 − 2.5|/3 = 1/6 ≈ {fx(dpl, 3)}.", [(fx(dpl, 3), "0.167")]),
X("Plane through three points", "Find the plane through (1, 0, 0), (0, 2, 0) and (0, 0, 3).",
  "Intercept form: x/1 + y/2 + z/3 = 1 ⇒ 6x + 3y + 2z = 6.", []),
],
"topics": [
T("Projection", "Projection of a segment PQ on a line with direction cosines (l, m, n) is |l(x₂ − x₁) + m(y₂ − y₁) + n(z₂ − z₁)|."),
T("Intersection of two lines", "Write general points of both lines with parameters λ and μ, equate coordinates and solve two equations; check the third. If it holds, the lines intersect."),
T("Line and plane relations", "A line lies in a plane if a point of the line is on the plane and b · n = 0. A line is parallel to a plane if b · n = 0 but no point of the line lies on it."),
T("Symmetric form from two planes", "The line of intersection of two planes has direction n₁ × n₂; find one point on both planes (e.g. put z = 0) to write the line."),
T("Angle bisector planes", "Planes bisecting angles between a₁x + b₁y + c₁z + d₁ = 0 and a₂x + … = 0 are found by equating normalised distances, as in 2D."),
T("Vector vs Cartesian", "Switch freely: r = a + λb ⇔ (x − a₁)/b₁ = (y − a₂)/b₂ = (z − a₃)/b₃. Vector forms make cross and dot products direct."),
],
"ratta": [
"l² + m² + n² = 1.",
"Perpendicular lines: a₁a₂ + b₁b₂ + c₁c₂ = 0.",
"SD = |(a₂ − a₁)·(b₁ × b₂)|/|b₁ × b₂|.",
"Point–plane distance |ax₁ + by₁ + cz₁ + d|/√(a² + b² + c²).",
"Line–plane: sin φ = |b·n|/(|b||n|).",
"Coplanar lines: (a₂ − a₁)·(b₁ × b₂) = 0.",
],
}

SYLLABUS = [
("Coordinates of a point in space, distance between two points, section formula, direction ratios and direction cosines", ["direction cosines", "direction ratios", "section"]),
("Angle between two intersecting lines; skew lines, the shortest distance between them and its equation", ["skew", "shortest distance"]),
("Equations of a line and a plane in different forms", ["plane", "line"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
