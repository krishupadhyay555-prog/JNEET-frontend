from lib import F, X, T, sig, fx, build
import sympy as sp

I = sp.I
assert I ** 2026 == -1
z2 = 1 + sp.sqrt(3) * I; assert sp.Abs(z2) == 2 and sp.arg(z2) == sp.pi / 3
assert sp.simplify((1 + I) / (1 - I)) == I
assert sp.expand((3 + 2 * I) ** 2) == 5 + 12 * I
w = sp.Rational(-1, 2) + sp.sqrt(3) / 2 * I
assert sp.simplify(1 + w + w ** 2) == 0 and sp.simplify((1 + w - w ** 2) ** 3) == -8
x = sp.symbols("x")
r = sp.solve(x ** 2 - 5 * x + 6, x); s2 = sum(v ** 2 for v in r); assert s2 == 13
assert sp.expand((x - (2 + sp.sqrt(3))) * (x - (2 - sp.sqrt(3)))) == x ** 2 - 4 * x + 1
k = sp.symbols("k"); assert set(sp.solve(k ** 2 - 36, k)) == {-6, 6}
mn = (x ** 2 - 4 * x + 7).subs(x, 2); assert mn == 3

DOC = {
"slug": "complex-numbers-and-quadratic-equations", "subject": "Mathematics", "verifiedOn": "2026-11-15",
"chapters": {"JEE": "Complex Numbers and Quadratic Equations"},
"title": "Complex Numbers and Quadratic Equations", "readMinutes": 18,
"summary": [
"Complex number z = x + iy (i² = −1) ek point (x, y) hai Argand plane mein. Modulus |z| = origin se doori, argument arg z = positive x-axis se angle. Polar form z = r(cosθ + i sinθ) = re^{iθ} multiplication aur powers ko aasaan banata hai.",
"Conjugate z̄ = x − iy reflection hai real axis mein. z z̄ = |z|², |z₁z₂| = |z₁||z₂|, arg(z₁z₂) = arg z₁ + arg z₂ — JEE ke saare simplifications inhi par.",
"Cube roots of unity 1, ω, ω² (1 + ω + ω² = 0, ω³ = 1) ek alag favourite topic hai. Locus sawal |z − z₁| = r (circle) aur |z − z₁| = |z − z₂| (perpendicular bisector) se hal hote hain.",
"Quadratic ax² + bx + c = 0 ke roots (−b ± √D)/2a; D = b² − 4ac nature batata hai. Sum = −b/a, product = c/a — inse bina roots nikaale symmetric expressions aur naye equations ban jaate hain.",
],
"formulas": [
F("Powers of i", "i² = −1, i³ = −i, i⁴ = 1;  iⁿ = i^{n mod 4};  i + i² + i³ + i⁴ = 0", "Bade powers.", "√a √b = √(ab) sirf jab dono non-negative ho; √(−4)√(−9) = −6, +6 nahi."),
F("Algebra of complex numbers", "(a + ib) ± (c + id) = (a ± c) + i(b ± d);  (a + ib)(c + id) = (ac − bd) + i(ad + bc);  division: numerator aur denominator ko denominator ke conjugate se multiply karo", "Basic operations."),
F("Conjugate properties", "z + z̄ = 2 Re z;  z − z̄ = 2i Im z;  z z̄ = |z|²;  conj(z₁ ± z₂) = z̄₁ ± z̄₂;  conj(z₁z₂) = z̄₁z̄₂;  z real ⇔ z = z̄;  purely imaginary ⇔ z = −z̄", "Simplification.", None, None, "PYQ favourite"),
F("Modulus properties", "|z| = √(x² + y²);  |z₁z₂| = |z₁||z₂|;  |z₁/z₂| = |z₁|/|z₂|;  |zⁿ| = |z|ⁿ;  |z₁ + z₂|² = |z₁|² + |z₂|² + 2Re(z₁z̄₂)", "Modulus nikaalna.", "|z₁ + z₂| ≠ |z₁| + |z₂| aam taur par."),
F("Triangle inequality", "||z₁| − |z₂|| ≤ |z₁ + z₂| ≤ |z₁| + |z₂|", "Max/min of |z| type sawal.", "Equality tab jab z₁, z₂ same direction (ya ulti) mein hon."),
F("Argument", "tanα = |y/x|;  principal arg θ ∈ (−π, π]:  Q1 α,  Q2 π − α,  Q3 −(π − α),  Q4 −α;  arg(z₁z₂) = arg z₁ + arg z₂;  arg(z₁/z₂) = arg z₁ − arg z₂", "Angle nikaalna.", "Quadrant dekh kar θ lo — sirf tan⁻¹(y/x) galat ho sakta hai.", None, "PYQ favourite"),
F("Polar and Euler form", "z = r(cosθ + i sinθ) = re^{iθ};  z₁z₂ = r₁r₂ e^{i(θ₁ + θ₂)}", "Multiplication, powers, rotation."),
F("De Moivre's theorem", "(cosθ + i sinθ)ⁿ = cos nθ + i sin nθ", "Bade powers jaise (1 + i)¹⁰."),
F("Square root of a + ib", "√(a + ib) = ±[√((|z| + a)/2) + i (sign of b) √((|z| − a)/2)]", "Complex ka square root.", "b negative ho to imaginary part ka sign negative."),
F("Cube roots of unity", "1, ω, ω²;  ω = (−1 + i√3)/2;  1 + ω + ω² = 0;  ω³ = 1;  ω̄ = ω²", "ω wale simplification.", None, None, "PYQ favourite"),
F("Locus in Argand plane", "|z − z₀| = r: circle;  |z − z₁| = |z − z₂|: perpendicular bisector;  |z − z₁| + |z − z₂| = 2a (> |z₁ − z₂|): ellipse;  arg((z − z₁)/(z − z₂)) = constant: circle ka arc", "Locus wale sawal."),
F("Quadratic formula and discriminant", "x = (−b ± √D)/2a,  D = b² − 4ac;  D > 0 real distinct,  D = 0 real equal,  D < 0 complex conjugate pair;  D perfect square (rational coefficients) ⇒ rational roots", "Roots aur unki nature.", "Complex roots hamesha conjugate pair mein (real coefficients ke saath).", None, "PYQ favourite"),
F("Sum and product of roots", "α + β = −b/a;  αβ = c/a;  α² + β² = (α + β)² − 2αβ;  |α − β| = √D/|a|", "Bina roots nikaale symmetric expressions."),
F("Equation from roots", "x² − (α + β)x + αβ = 0", "Diye roots se equation banana."),
F("Common root", "a₁x² + b₁x + c₁ = 0 aur a₂x² + b₂x + c₂ = 0 ka ek common root: (c₁a₂ − c₂a₁)² = (a₁b₂ − a₂b₁)(b₁c₂ − b₂c₁);  dono roots common: a₁/a₂ = b₁/b₂ = c₁/c₂", "Common root ke sawal."),
F("Extreme value of a quadratic", "ax² + bx + c ka vertex x = −b/2a par;  value = −D/4a;  a > 0 ⇒ minimum, a < 0 ⇒ maximum", "Range/min/max.", None),
],
"examples": [
X("i ka bada power", "i²⁰²⁶ = ?",
  "2026 = 4 × 506 + 2 ⇒ i²⁰²⁶ = i² = −1.", []),
X("Modulus aur argument", "z = 1 + i√3 ka modulus aur principal argument?",
  "|z| = √(1 + 3) = 2. Q1 mein, tanα = √3 ⇒ arg z = π/3. Polar: 2(cos π/3 + i sin π/3).", []),
X("Division", "(1 + i)/(1 − i) = ?",
  "Conjugate (1 + i) se multiply: (1 + i)²/(1 + 1) = 2i/2 = i.", []),
X("Square root", "√(5 + 12i) = ?",
  "|z| = 13. √((13 + 5)/2) = 3, √((13 − 5)/2) = 2, b > 0 ⇒ ±(3 + 2i). Check: (3 + 2i)² = 9 − 4 + 12i ✓.", []),
X("ω wala simplification", "(1 + ω − ω²)³ = ?",
  "1 + ω = −ω² ⇒ 1 + ω − ω² = −2ω² ⇒ (−2ω²)³ = −8ω⁶ = −8.", []),
X("Sum of squares of roots", "x² − 5x + 6 = 0 ke roots ka α² + β²?",
  "α + β = 5, αβ = 6 ⇒ 25 − 12 = 13.", []),
X("Roots se equation", "Roots 2 + √3 aur 2 − √3 wali quadratic?",
  "Sum 4, product 4 − 3 = 1 ⇒ x² − 4x + 1 = 0.", []),
X("Equal roots", "x² + kx + 9 = 0 ke roots barabar hon to k?",
  "D = k² − 36 = 0 ⇒ k = ±6.", []),
X("Minimum value", "x² − 4x + 7 ki minimum value?",
  "Vertex x = 2 par, value 4 − 8 + 7 = 3 (= −D/4a = 12/4).", []),
X("Locus", "|z − 1| = |z + 1| ka locus?",
  "z ki (1, 0) aur (−1, 0) se barabar doori ⇒ perpendicular bisector x = 0, yaani imaginary axis.", []),
],
"topics": [
T("Argand plane", "x-axis real axis, y-axis imaginary axis. z = x + iy ka point (x, y). |z₁ − z₂| = do points ki doori. iz = z ko 90° anticlockwise ghumana."),
T("Rotation", "z₂ − z₀ = (z₁ − z₀)(r₂/r₁)e^{iθ}: point z₁ ko z₀ ke around θ se ghumaaya. Equilateral triangle: z₁² + z₂² + z₃² = z₁z₂ + z₂z₃ + z₃z₁."),
T("ω ke uses", "x³ = 1 ke roots. x² + x + 1 = 0 ke roots ω, ω². 1, ω, ω² Argand plane mein equilateral triangle ke vertices (unit circle par). a + bω + cω² type expressions ka modulus."),
T("Nature of roots aur graph", "y = ax² + bx + c parabola: a > 0 upar khula. D > 0 ⇒ x-axis ko do jagah kaatta; D = 0 ⇒ chhoota; D < 0 ⇒ nahi kaatta (a > 0 par hamesha positive)."),
T("Sign scheme aur location of roots", "Dono roots k se bade: D ≥ 0, af(k) > 0, −b/2a > k. Ek root k se chhota ek bada: af(k) < 0. Inequalities ax² + bx + c > 0 roots ke bahar (a > 0)."),
T("Symmetric functions", "α³ + β³ = (α + β)³ − 3αβ(α + β). 1/α + 1/β = (α + β)/αβ. Roots ko badal kar (jaise 1/α, α + 1) nayi equation: x ko us transformation ke ulte se badlo."),
],
"ratta": [
"iⁿ: cycle i, −1, −i, 1.",
"z z̄ = |z|²;  |z₁z₂| = |z₁||z₂|;  arg(z₁z₂) = arg z₁ + arg z₂.",
"Principal arg (−π, π]; quadrant dekho.",
"1 + ω + ω² = 0;  ω³ = 1;  ω = (−1 + i√3)/2.",
"√(5 + 12i) = ±(3 + 2i).",
"D = b² − 4ac;  α + β = −b/a;  αβ = c/a.",
"Equation: x² − (sum)x + product = 0.",
"Extreme value −D/4a at x = −b/2a.",
],
}

DOC_EN = {
"slug": "complex-numbers-and-quadratic-equations", "subject": "Mathematics", "verifiedOn": "2026-11-15",
"chapters": {"JEE": "Complex Numbers and Quadratic Equations"},
"title": "Complex Numbers and Quadratic Equations", "readMinutes": 18,
"summary": [
"A complex number z = x + iy (i² = −1) is a point (x, y) in the Argand plane. Modulus |z| = distance from the origin; argument arg z = angle from the positive x-axis. The polar form z = r(cos θ + i sin θ) = re^{iθ} makes multiplication and powers easy.",
"The conjugate z̄ = x − iy is the reflection in the real axis. z z̄ = |z|², |z₁z₂| = |z₁||z₂|, arg(z₁z₂) = arg z₁ + arg z₂ — almost every JEE simplification uses these.",
"Cube roots of unity 1, ω, ω² (1 + ω + ω² = 0, ω³ = 1) are a separate favourite. Locus questions use |z − z₁| = r (circle) and |z − z₁| = |z − z₂| (perpendicular bisector).",
"The roots of ax² + bx + c = 0 are (−b ± √D)/2a; D = b² − 4ac decides their nature. Sum = −b/a, product = c/a — these give symmetric expressions and new equations without finding the roots.",
],
"formulas": [
F("Powers of i", "i² = −1, i³ = −i, i⁴ = 1;  iⁿ = i^{n mod 4};  i + i² + i³ + i⁴ = 0", "Large powers.", "√a √b = √(ab) only when both are non-negative; √(−4)√(−9) = −6, not +6."),
F("Algebra of complex numbers", "(a + ib) ± (c + id) = (a ± c) + i(b ± d);  (a + ib)(c + id) = (ac − bd) + i(ad + bc);  division: multiply numerator and denominator by the conjugate of the denominator", "Basic operations."),
F("Conjugate properties", "z + z̄ = 2 Re z;  z − z̄ = 2i Im z;  z z̄ = |z|²;  conj(z₁ ± z₂) = z̄₁ ± z̄₂;  conj(z₁z₂) = z̄₁z̄₂;  z real ⇔ z = z̄;  purely imaginary ⇔ z = −z̄", "Simplification.", None, None, "PYQ favourite"),
F("Modulus properties", "|z| = √(x² + y²);  |z₁z₂| = |z₁||z₂|;  |z₁/z₂| = |z₁|/|z₂|;  |zⁿ| = |z|ⁿ;  |z₁ + z₂|² = |z₁|² + |z₂|² + 2Re(z₁z̄₂)", "Finding moduli.", "|z₁ + z₂| ≠ |z₁| + |z₂| in general."),
F("Triangle inequality", "||z₁| − |z₂|| ≤ |z₁ + z₂| ≤ |z₁| + |z₂|", "Max/min of |z| questions.", "Equality holds when z₁ and z₂ point in the same (or opposite) direction."),
F("Argument", "tan α = |y/x|;  principal arg θ ∈ (−π, π]:  Q1 α,  Q2 π − α,  Q3 −(π − α),  Q4 −α;  arg(z₁z₂) = arg z₁ + arg z₂;  arg(z₁/z₂) = arg z₁ − arg z₂", "Finding the angle.", "Pick θ by quadrant — tan⁻¹(y/x) alone can be wrong.", None, "PYQ favourite"),
F("Polar and Euler form", "z = r(cos θ + i sin θ) = re^{iθ};  z₁z₂ = r₁r₂ e^{i(θ₁ + θ₂)}", "Multiplication, powers, rotation."),
F("De Moivre's theorem", "(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ", "Large powers like (1 + i)¹⁰."),
F("Square root of a + ib", "√(a + ib) = ±[√((|z| + a)/2) + i (sign of b) √((|z| − a)/2)]", "Square root of a complex number.", "If b is negative the imaginary part is negative."),
F("Cube roots of unity", "1, ω, ω²;  ω = (−1 + i√3)/2;  1 + ω + ω² = 0;  ω³ = 1;  ω̄ = ω²", "Simplifying with ω.", None, None, "PYQ favourite"),
F("Locus in Argand plane", "|z − z₀| = r: circle;  |z − z₁| = |z − z₂|: perpendicular bisector;  |z − z₁| + |z − z₂| = 2a (> |z₁ − z₂|): ellipse;  arg((z − z₁)/(z − z₂)) = constant: arc of a circle", "Locus questions."),
F("Quadratic formula and discriminant", "x = (−b ± √D)/2a,  D = b² − 4ac;  D > 0 real distinct,  D = 0 real equal,  D < 0 complex conjugate pair;  D a perfect square (rational coefficients) ⇒ rational roots", "Roots and their nature.", "With real coefficients, complex roots always come in conjugate pairs.", None, "PYQ favourite"),
F("Sum and product of roots", "α + β = −b/a;  αβ = c/a;  α² + β² = (α + β)² − 2αβ;  |α − β| = √D/|a|", "Symmetric expressions without solving."),
F("Equation from roots", "x² − (α + β)x + αβ = 0", "Forming an equation from given roots."),
F("Common root", "One common root of a₁x² + b₁x + c₁ = 0 and a₂x² + b₂x + c₂ = 0: (c₁a₂ − c₂a₁)² = (a₁b₂ − a₂b₁)(b₁c₂ − b₂c₁);  both roots common: a₁/a₂ = b₁/b₂ = c₁/c₂", "Common-root questions."),
F("Extreme value of a quadratic", "vertex of ax² + bx + c at x = −b/2a;  value = −D/4a;  a > 0 ⇒ minimum, a < 0 ⇒ maximum", "Range/min/max.", None),
],
"examples": [
X("Large power of i", "i²⁰²⁶ = ?",
  "2026 = 4 × 506 + 2 ⇒ i²⁰²⁶ = i² = −1.", []),
X("Modulus and argument", "Modulus and principal argument of z = 1 + i√3?",
  "|z| = √(1 + 3) = 2. In Q1, tan α = √3 ⇒ arg z = π/3. Polar: 2(cos π/3 + i sin π/3).", []),
X("Division", "(1 + i)/(1 − i) = ?",
  "Multiply by the conjugate (1 + i): (1 + i)²/(1 + 1) = 2i/2 = i.", []),
X("Square root", "√(5 + 12i) = ?",
  "|z| = 13. √((13 + 5)/2) = 3, √((13 − 5)/2) = 2, b > 0 ⇒ ±(3 + 2i). Check: (3 + 2i)² = 9 − 4 + 12i ✓.", []),
X("Simplifying with ω", "(1 + ω − ω²)³ = ?",
  "1 + ω = −ω² ⇒ 1 + ω − ω² = −2ω² ⇒ (−2ω²)³ = −8ω⁶ = −8.", []),
X("Sum of squares of roots", "α² + β² for the roots of x² − 5x + 6 = 0?",
  "α + β = 5, αβ = 6 ⇒ 25 − 12 = 13.", []),
X("Equation from roots", "Quadratic with roots 2 + √3 and 2 − √3?",
  "Sum 4, product 4 − 3 = 1 ⇒ x² − 4x + 1 = 0.", []),
X("Equal roots", "For what k does x² + kx + 9 = 0 have equal roots?",
  "D = k² − 36 = 0 ⇒ k = ±6.", []),
X("Minimum value", "Minimum value of x² − 4x + 7?",
  "At the vertex x = 2 the value is 4 − 8 + 7 = 3 (= −D/4a = 12/4).", []),
X("Locus", "Locus of |z − 1| = |z + 1|?",
  "z is equidistant from (1, 0) and (−1, 0) ⇒ perpendicular bisector x = 0, i.e. the imaginary axis.", []),
],
"topics": [
T("Argand plane", "The x-axis is the real axis, the y-axis the imaginary axis. z = x + iy is the point (x, y). |z₁ − z₂| is the distance between two points. Multiplying by i rotates z by 90° anticlockwise."),
T("Rotation", "z₂ − z₀ = (z₁ − z₀)(r₂/r₁)e^{iθ}: z₁ rotated about z₀ by θ. Equilateral triangle: z₁² + z₂² + z₃² = z₁z₂ + z₂z₃ + z₃z₁."),
T("Uses of ω", "Roots of x³ = 1. Roots of x² + x + 1 = 0 are ω and ω². 1, ω, ω² are vertices of an equilateral triangle on the unit circle. Moduli of expressions like a + bω + cω²."),
T("Nature of roots and the graph", "y = ax² + bx + c is a parabola opening upward if a > 0. D > 0 ⇒ it cuts the x-axis twice; D = 0 ⇒ it touches; D < 0 ⇒ it doesn't cut (always positive when a > 0)."),
T("Sign scheme and location of roots", "Both roots greater than k: D ≥ 0, af(k) > 0, −b/2a > k. One root less than k and one greater: af(k) < 0. For a > 0, ax² + bx + c > 0 outside the roots."),
T("Symmetric functions", "α³ + β³ = (α + β)³ − 3αβ(α + β). 1/α + 1/β = (α + β)/αβ. For an equation with transformed roots (like 1/α, α + 1), replace x by the inverse of that transformation."),
],
"ratta": [
"iⁿ: cycle i, −1, −i, 1.",
"z z̄ = |z|²;  |z₁z₂| = |z₁||z₂|;  arg(z₁z₂) = arg z₁ + arg z₂.",
"Principal arg in (−π, π]; check the quadrant.",
"1 + ω + ω² = 0;  ω³ = 1;  ω = (−1 + i√3)/2.",
"√(5 + 12i) = ±(3 + 2i).",
"D = b² − 4ac;  α + β = −b/a;  αβ = c/a.",
"Equation: x² − (sum)x + product = 0.",
"Extreme value −D/4a at x = −b/2a.",
],
}

SYLLABUS = [
("Complex numbers as ordered pairs of reals; representation in the form a + ib and in a plane (Argand diagram); algebra of complex numbers", ["Argand", "Algebra of complex numbers"]),
("Modulus and argument (amplitude) of a complex number", ["Modulus", "Argument"]),
("Quadratic equations in real and complex number systems and their solutions; relations between roots and coefficients; nature of roots; formation of quadratic equations with given roots", ["Quadratic formula", "Sum and product of roots", "discriminant", "Equation from roots"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
