from lib import F, X, T, sig, fx, _check_and_write
import numpy as np, math

a = np.array([1, 2, 2]); b = np.array([2, -1, 2])
dot = int(a @ b)
mag_a = float(np.linalg.norm(a))
cosang = dot / (np.linalg.norm(a) * np.linalg.norm(b))
proj = dot / float(np.linalg.norm(b))
c = np.cross(a, b)
area_par = float(np.linalg.norm(c))
stp = int(round(np.linalg.det(np.array([[1, 0, 0], [0, 2, 0], [1, 1, 3]]))))
area_tri = area_par / 2
# coplanarity: (1,2,3),(2,3,4),(3,4,5)
cop = int(round(np.linalg.det(np.array([[1, 2, 3], [2, 3, 4], [3, 4, 5]]))))

DOC = {
"slug": "vector-algebra", "subject": "Mathematics",
"chapters": {"JEE": "Vector Algebra"},
"title": "Vector Algebra", "readMinutes": 14,
"summary": [
"Vectors have magnitude and direction; a = a₁î + a₂ĵ + a₃k̂. They add by the triangle/parallelogram law, and any vector can be written in terms of three non-coplanar vectors.",
"The dot product a · b = |a||b| cos θ gives angles, projections and perpendicularity. The cross product a × b = |a||b| sin θ n̂ gives areas and a vector perpendicular to both.",
"The scalar triple product [a b c] gives the volume of a parallelepiped and tests coplanarity; the vector triple product expands as a × (b × c) = (a · c)b − (a · b)c.",
],
"formulas": [
F("Magnitude and unit vector", "|a| = √(a₁² + a₂² + a₃²);  â = a/|a|", "Basic vector facts."),
F("Section formula (vectors)", "internal m:n → (mb + na)/(m + n);  midpoint (a + b)/2", "Position vectors of dividing points."),
F("Dot product", "a · b = |a||b| cos θ = a₁b₁ + a₂b₂ + a₃b₃;  a ⊥ b ⇔ a · b = 0", "Angles and perpendicularity.", None, tag="PYQ favourite"),
F("Projection", "projection of a on b = (a · b)/|b|;  vector projection = ((a · b)/|b|²) b", "Component of one vector along another."),
F("Cross product", "a × b = |a||b| sin θ n̂ = determinant |î ĵ k̂; a₁ a₂ a₃; b₁ b₂ b₃|;  a × b = −b × a;  a ∥ b ⇔ a × b = 0", "Perpendicular vector and areas.", None, tag="PYQ favourite"),
F("Areas", "parallelogram with sides a, b: |a × b|;  with diagonals d₁, d₂: ½|d₁ × d₂|;  triangle: ½|a × b|", "Area using vectors."),
F("Scalar triple product", "[a b c] = a · (b × c) = determinant of components;  volume of parallelepiped = |[a b c]|;  tetrahedron = |[a b c]|/6", "Volumes.", None, tag="PYQ favourite"),
F("Coplanarity", "a, b, c coplanar ⇔ [a b c] = 0", "Testing whether vectors lie in a plane."),
F("Vector triple product", "a × (b × c) = (a · c)b − (a · b)c", "Expanding triple cross products.", "a × (b × c) ≠ (a × b) × c in general."),
F("Properties of [a b c]", "[a b c] = [b c a] = [c a b] = −[b a c];  [a a b] = 0;  [a × b  b × c  c × a] = [a b c]²", "Manipulating triple products."),
F("Collinearity", "points A, B, C collinear ⇔ AB = λ AC (or AB × AC = 0)", "Points on a line."),
F("Lagrange identity", "|a × b|² + (a · b)² = |a|²|b|²", "Linking dot and cross products."),
],
"examples": [
X("Dot product and angle", "a = î + 2ĵ + 2k̂, b = 2î − ĵ + 2k̂. Find a · b and the angle between them.",
  f"a · b = 2 − 2 + 4 = {dot}; |a| = |b| = {fx(mag_a)}; cos θ = 4/9 ≈ {fx(cosang, 3)}.", [(str(dot), "4"), (fx(mag_a), "3"), (fx(cosang, 3), "0.444")]),
X("Projection", "Projection of a on b for the vectors above?",
  f"(a · b)/|b| = 4/3 ≈ {fx(proj, 3)}.", [(fx(proj, 3), "1.333")]),
X("Area of parallelogram", "Area of the parallelogram with sides a and b above?",
  f"a × b = (6, 2, −5) ⇒ |a × b| = √65 ≈ {fx(area_par, 2)}; triangle area ≈ {fx(area_tri, 2)}.", [(fx(area_par, 2), "8.06"), (fx(area_tri, 2), "4.03")]),
X("Volume", "Volume of the parallelepiped with edges î, 2ĵ and î + ĵ + 3k̂?",
  f"Determinant |1 0 0; 0 2 0; 1 1 3| = {stp}.", [(str(stp), "6")]),
X("Coplanarity", "Are (1, 2, 3), (2, 3, 4), (3, 4, 5) coplanar?",
  f"Determinant = {cop} ⇒ yes, coplanar (the third is 2 × second − first).", [(str(cop), "0")]),
X("Perpendicular unit vector", "Unit vector perpendicular to both î + ĵ and ĵ + k̂?",
  "(î + ĵ) × (ĵ + k̂) = î − ĵ + k̂; divide by √3 ⇒ ±(î − ĵ + k̂)/√3.", []),
],
"topics": [
T("Types of vectors", "Zero vector, unit vector, equal vectors, collinear (parallel) vectors, coinitial vectors, coplanar vectors, position vector OP of a point P."),
T("Linear combinations", "Two non-collinear vectors span a plane; three non-coplanar vectors span space. Vectors are linearly dependent if one is a combination of the others."),
T("Angle bisectors with vectors", "The internal bisector of the angle between a and b is along â + b̂; the external bisector along â − b̂."),
T("Work and moment", "Work done by force F through displacement d is F · d. Moment (torque) of F about a point is r × F."),
T("Direction cosines with vectors", "For r = xî + yĵ + zk̂, the direction cosines are x/|r|, y/|r|, z/|r|. A unit vector making equal angles with the axes is (î + ĵ + k̂)/√3."),
T("Common mistakes", "Dot product gives a scalar, cross product a vector. a · b = a · c does not imply b = c. Cross product is not associative and not commutative."),
],
"ratta": [
"a · b = |a||b| cos θ;  ⊥ ⇔ a · b = 0.",
"|a × b| = area of parallelogram;  ½ for triangle.",
"Projection = (a · b)/|b|.",
"[a b c] = volume;  0 ⇒ coplanar.",
"a × (b × c) = (a · c)b − (a · b)c.",
"|a × b|² + (a · b)² = |a|²|b|².",
],
}

SYLLABUS = [
("Vectors and scalars, addition of vectors, components of a vector in two and three dimensions", ["components", "unit vector"]),
("Scalar and vector products", ["dot product", "cross product"]),
("Scalar triple product (and vector triple product)", ["scalar triple product", "vector triple product"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
