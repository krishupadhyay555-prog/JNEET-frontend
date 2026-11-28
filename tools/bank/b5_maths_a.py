"""Batch 5 — JEE Mathematics A: Application of Integrals, Inverse Trig, Binomial, Conics,
Trigonometry, Differentiation, Circles, Straight Lines, Definite Integrals.
Original questions; answers checked with sympy (V) wherever they can be. 28 Nov 2026."""
import sympy as sp
from qlib import mcq

S = "Mathematics"
x, y, t, a, b, n, k = sp.symbols("x y t a b n k", real=True)
pi, sqrt, Rt, I_ = sp.pi, sp.sqrt, sp.Rational, sp.integrate
def M(chap, cat, diff, text, correct, wrongs, expl):
    mcq("JEE", S, chap, cat, diff, text, correct, wrongs, expl)
def V(expr, val):
    d = sp.simplify(sp.nsimplify(expr) - sp.nsimplify(val))
    assert d == 0 or abs(sp.N(d, 30)) < 1e-18, (expr, val)

# ═════════════════════════ Application of Integrals ═════════════════════════
AI = "Application of Integrals"
V(I_(4 * x - x**2, (x, 0, 4)), Rt(32, 3))
M(AI, "formula", "moderate", "The area bounded by the curve y = 4x − x² and the x-axis is",
  "32/3", ["16/3", "64/3", "8"], "Roots 0 and 4: ∫₀⁴ (4x − x²) dx = 32 − 64/3 = 32/3.")
V(I_(sqrt(x) - x, (x, 0, 1)), Rt(1, 6))
M(AI, "tough", "moderate", "The area enclosed between y = √x and y = x is",
  "1/6", ["1/3", "1/2", "2/3"], "They meet at x = 0, 1: ∫₀¹ (√x − x) dx = 2/3 − 1/2 = 1/6.")
V(I_(2 * x - x**2, (x, 0, 2)), Rt(4, 3))
M(AI, "tough", "moderate", "The area of the region between the line y = x and the parabola y = 3x − x² is",
  "4/3", ["2/3", "8/3", "9/2"], "3x − x² = x at x = 0, 2: ∫₀² (2x − x²) dx = 4 − 8/3 = 4/3.")
V(4 * I_(sqrt(4 - x**2), (x, 0, 2)), 4 * pi)
M(AI, "formula", "easy", "The area enclosed by the circle x² + y² = 4 is found by integration as 4∫₀² √(4 − x²) dx. Its value is",
  "4π", ["2π", "8π", "16π"], "Each quarter is ∫₀² √(4 − x²) dx = π; total 4π (= πr²).")
V(pi * 3 * 2, 6 * pi)
M(AI, "formula", "moderate", "The area enclosed by the ellipse x²/9 + y²/4 = 1 is",
  "6π", ["9π", "4π", "13π"], "Area = πab = π × 3 × 2.")
V(I_(sp.exp(x), (x, 0, sp.log(3))), 2)
M(AI, "formula", "moderate", "The area bounded by y = eˣ, the x-axis and the lines x = 0, x = ln 3 is",
  "2", ["3", "ln 3", "e³ − 1"], "∫₀^{ln 3} eˣ dx = 3 − 1 = 2.")
V(I_(sp.sin(x), (x, 0, 2 * pi)).rewrite(sp.sin), 0); V(2 * I_(sp.sin(x), (x, 0, pi)), 4)
M(AI, "tough", "tough", "The area bounded by y = sin x and the x-axis for 0 ≤ x ≤ 2π is",
  "4", ["0", "2", "2π"], "The signed integral is 0, but area counts both arches: 2∫₀^π sin x dx = 2 × 2 = 4.")
V(I_(sp.Abs(x - 1), (x, 0, 3)), Rt(5, 2))
M(AI, "tough", "moderate", "The area bounded by y = |x − 1|, the x-axis and the lines x = 0, x = 3 is",
  "5/2", ["2", "3", "9/2"], "Two triangles: ½ × 1 × 1 + ½ × 2 × 2 = 1/2 + 2 = 5/2.")
V(I_(4 - x**2, (x, -2, 2)), Rt(32, 3))
M(AI, "formula", "moderate", "The area bounded by y = 4 − x² and the x-axis is",
  "32/3", ["16/3", "8", "64/3"], "∫₋₂² (4 − x²) dx = 16 − 16/3 = 32/3. (Same value as for y = 4x − x², a shifted copy.)")
V(I_(sp.log(x), (x, 1, sp.E)), 1)
M(AI, "tough", "tough", "The area bounded by y = ln x, the x-axis and the line x = e is",
  "1", ["e", "e − 1", "1/e"], "∫₁^e ln x dx = [x ln x − x]₁^e = (e − e) − (0 − 1) = 1.")
V(I_(4 * x - x**2 - x**2, (x, 0, 2)), Rt(8, 3))
M(AI, "tough", "tough", "The area enclosed between the parabolas y = x² and y = 4x − x² is",
  "8/3", ["4/3", "16/3", "32/3"], "They meet at x = 0, 2: ∫₀² (4x − 2x²) dx = 8 − 16/3 = 8/3.")
V(I_(sqrt(4 * x), (x, 0, 1)) * 2, Rt(8, 3))
M(AI, "tough", "tough", "The area bounded by the parabola y² = 4x and its latus rectum is",
  "8/3", ["4/3", "2", "16/3"], "Latus rectum x = 1: 2∫₀¹ 2√x dx = 4 × 2/3 = 8/3.")
V(I_(x**3, (x, -1, 1)), 0); V(2 * I_(x**3, (x, 0, 1)), Rt(1, 2))
M(AI, "tough", "moderate", "The area bounded by y = x³, the x-axis and the lines x = −1, x = 1 is",
  "1/2", ["0", "1/4", "1"], "By symmetry 2∫₀¹ x³ dx = 1/2 (the signed integral is 0).")

# ═════════════════════════ Inverse Trigonometric Functions ═════════════════════════
IT = "Inverse Trigonometric Functions"
V(sp.asin(sp.sin(2 * pi / 3)), pi / 3)
M(IT, "tough", "tough", "The value of sin⁻¹(sin(2π/3)) is",
  "π/3", ["2π/3", "−π/3", "π/6"], "sin(2π/3) = √3/2, and the principal value of sin⁻¹(√3/2) in [−π/2, π/2] is π/3.")
V(sp.acos(sp.cos(7 * pi / 6)), 5 * pi / 6)
M(IT, "tough", "tough", "The value of cos⁻¹(cos(7π/6)) is",
  "5π/6", ["7π/6", "π/6", "−5π/6"], "cos(7π/6) = −√3/2; the principal value of cos⁻¹ in [0, π] is 5π/6.")
V(sp.atan(Rt(1, 2)) + sp.atan(Rt(1, 3)), pi / 4)
M(IT, "formula", "moderate", "tan⁻¹(1/2) + tan⁻¹(1/3) equals",
  "π/4", ["π/3", "π/6", "π/2"], "tan⁻¹a + tan⁻¹b = tan⁻¹((a + b)/(1 − ab)) = tan⁻¹((5/6)/(5/6)) = tan⁻¹ 1.")
V(sp.atan(2) + sp.atan(3), 3 * pi / 4)
M(IT, "tough", "tough", "tan⁻¹ 2 + tan⁻¹ 3 equals",
  "3π/4", ["π/4", "−π/4", "π/2"], "Here ab = 6 > 1 and both are positive, so the sum = π + tan⁻¹((2 + 3)/(1 − 6)) = π − π/4 = 3π/4.")
V(sp.sin(sp.acos(Rt(3, 5))), Rt(4, 5))
M(IT, "formula", "easy", "sin(cos⁻¹(3/5)) equals",
  "4/5", ["3/5", "3/4", "5/4"], "If cos θ = 3/5 with θ ∈ [0, π], sin θ = 4/5 (positive).")
V(sp.tan(2 * sp.atan(Rt(1, 3))), Rt(3, 4))
M(IT, "tough", "moderate", "tan(2 tan⁻¹(1/3)) equals",
  "3/4", ["2/3", "1/3", "4/3"], "tan 2θ = 2(1/3)/(1 − 1/9) = (2/3)/(8/9) = 3/4.")
M(IT, "concept", "moderate", "The domain of f(x) = sin⁻¹(2x − 1) is",
  "[0, 1]", ["[−1, 1]", "[−1/2, 1/2]", "(0, 1)"], "Need −1 ≤ 2x − 1 ≤ 1 ⇒ 0 ≤ x ≤ 1.")
V(sp.asin(Rt(3, 5)) + sp.acos(Rt(3, 5)), pi / 2)
M(IT, "formula", "easy", "sin⁻¹(3/5) + cos⁻¹(3/5) equals",
  "π/2", ["π", "π/4", "0"], "sin⁻¹x + cos⁻¹x = π/2 for every x in [−1, 1].")
M(IT, "tough", "tough", "The number of real solutions of tan⁻¹x + tan⁻¹(2x) = π/4 is",
  "1", ["0", "2", "infinitely many"], "(3x)/(1 − 2x²) = 1 ⇒ 2x² + 3x − 1 = 0 ⇒ x = (−3 ± √17)/4. The negative root makes both terms negative (sum < 0), so only x = (√17 − 3)/4 works.")
V(sp.atan(1) + sp.atan(2) + sp.atan(3), pi)
M(IT, "tough", "tough", "tan⁻¹ 1 + tan⁻¹ 2 + tan⁻¹ 3 equals",
  "π", ["π/2", "3π/4", "2π"], "tan⁻¹ 2 + tan⁻¹ 3 = 3π/4, plus π/4.")
V(sp.cos(sp.asin(Rt(1, 3)) + sp.acos(Rt(1, 3))), 0)
M(IT, "formula", "moderate", "cos(sin⁻¹(1/3) + cos⁻¹(1/3)) equals",
  "0", ["1", "1/3", "2√2/3"], "The angle inside is π/2.")
M(IT, "concept", "moderate", "The range of f(x) = cot⁻¹x (principal value) is",
  "(0, π)", ["[0, π]", "(−π/2, π/2)", "[−π/2, π/2]"], "cot⁻¹ takes values strictly between 0 and π.")
V(sp.asin(-Rt(1, 2)) + sp.acos(-Rt(1, 2)), pi / 2); V(sp.acos(-Rt(1, 2)), 2 * pi / 3)
M(IT, "formula", "moderate", "The principal value of cos⁻¹(−1/2) is",
  "2π/3", ["−π/3", "π/3", "4π/3"], "cos⁻¹(−x) = π − cos⁻¹x = π − π/3.")
M(IT, "tough", "tough", "If sin⁻¹x + sin⁻¹y = 2π/3, then cos⁻¹x + cos⁻¹y equals",
  "π/3", ["2π/3", "π/6", "4π/3"], "cos⁻¹x + cos⁻¹y = (π/2 − sin⁻¹x) + (π/2 − sin⁻¹y) = π − 2π/3.")

# ═════════════════════════ Binomial Theorem ═════════════════════════
BT = "Binomial Theorem"
term = sp.expand((x**2 + 2 / x)**6); c0 = term.coeff(x, 0)
V(c0, 240)
M(BT, "tough", "tough", "The term independent of x in (x² + 2/x)⁶ is",
  "240", ["160", "60", "480"], "T_{r+1} = C(6, r)x^{12−2r}(2/x)^r = C(6, r)2^r x^{12−3r}. r = 4: 15 × 16 = 240.")
V(sp.expand((1 + x)**10).coeff(x, 5), 252)
M(BT, "formula", "easy", "The middle term coefficient of (1 + x)¹⁰ is",
  "252", ["210", "120", "462"], "The 6th term: C(10, 5) = 252.")
V(sp.expand((2 * x - 3)**5).coeff(x, 3), 720)
M(BT, "formula", "moderate", "The coefficient of x³ in (2x − 3)⁵ is",
  "720", ["−720", "1080", "240"], "The x³ term is C(5, 3)(2x)³(−3)² = 10 × 8 × 9 x³ = 720x³ (the even power of −3 makes it positive).")
V(sum(sp.binomial(8, r) for r in range(0, 9, 2)), 128)
M(BT, "formula", "easy", "C(8, 0) + C(8, 2) + C(8, 4) + C(8, 6) + C(8, 8) equals",
  "128", ["256", "64", "70"], "The sum of even-indexed coefficients is 2^{n−1} = 2⁷.")
V(sum(r * sp.binomial(10, r) for r in range(11)), 10 * 2**9)
M(BT, "tough", "tough", "Σ_{r=0}^{10} r·C(10, r) equals",
  "5120", ["1024", "10240", "2560"], "Σ r C(n, r) = n·2^{n−1} = 10 × 512.")
V(sp.Mod(7**103, 25), 18)
M(BT, "tough", "tough", "The remainder when 7¹⁰³ is divided by 25 is",
  "18", ["7", "13", "24"], "7² = 49 ≡ −1 (mod 25), so 7¹⁰² = (7²)⁵¹ ≡ −1 and 7¹⁰³ ≡ −7 ≡ 18.")
V(sp.expand((1 + x)**5 * (1 - x)**5).coeff(x, 4), 10)
M(BT, "tough", "tough", "The coefficient of x⁴ in (1 + x)⁵(1 − x)⁵ is",
  "10", ["−10", "5", "0"], "(1 − x²)⁵: the x⁴ term is C(5, 2)(−x²)² = 10x⁴.")
M(BT, "concept", "moderate", "The number of terms in the expansion of (a + b)²⁰ is",
  "21", ["20", "40", "22"], "(a + b)ⁿ has n + 1 terms.")
V(sp.expand((1 + x + x**2)**3).coeff(x, 3), 7)
M(BT, "tough", "tough", "The coefficient of x³ in (1 + x + x²)³ is",
  "7", ["6", "10", "3"], "Pick exponents (from each bracket, 0–2) summing to 3: (1,1,1) once, (0,1,2) in 3! = 6 ways ⇒ 7.")
V(sp.binomial(9, 3) * 2**3, 672)
M(BT, "formula", "moderate", "The coefficient of x⁶ in (1 + 2x²)⁹ is",
  "672", ["84", "336", "1344"], "x⁶ needs (2x²)³: C(9, 3) × 8 = 84 × 8 = 672.")
V(sp.binomial(12, 4) * sp.Rational(1, 1), 495)
M(BT, "tough", "moderate", "In the expansion of (x + 1/x)¹², the coefficient of x⁴ is",
  "495", ["220", "792", "924"], "T_{r+1} = C(12, r)x^{12−2r}; 12 − 2r = 4 ⇒ r = 4: C(12, 4) = 495.")
assert Rt(101, 100)**10 > Rt(11, 10)
M(BT, "concept", "moderate", "Using the binomial theorem, which is larger: (1.01)¹⁰ or 1.1?",
  "(1.01)¹⁰", ["1.1", "they are equal", "cannot be decided without a calculator"], "(1 + 0.01)¹⁰ = 1 + 10(0.01) + 45(0.0001) + … = 1.1 + positive terms.")

# ═════════════════════════ Conic Sections ═════════════════════════
CS = "Conic Sections"
M(CS, "formula", "easy", "The focus and directrix of the parabola y² = 12x are",
  "(3, 0) and x = −3", ["(−3, 0) and x = 3", "(0, 3) and y = −3", "(12, 0) and x = −12"], "y² = 4ax with a = 3.")
M(CS, "formula", "moderate", "The length of the latus rectum of the ellipse x²/25 + y²/16 = 1 is",
  "32/5", ["16/5", "8", "25/4"], "2b²/a = 2 × 16/5.")
M(CS, "formula", "moderate", "The eccentricity of the ellipse 9x² + 25y² = 225 is",
  "4/5", ["3/5", "5/4", "√34/5"], "x²/25 + y²/9 = 1: e = √(1 − 9/25) = 4/5.")
M(CS, "formula", "moderate", "The eccentricity of the hyperbola x²/16 − y²/9 = 1 is",
  "5/4", ["4/5", "3/4", "√7/4"], "e = √(1 + 9/16) = 5/4.")
M(CS, "tough", "tough", "The equation of the tangent to the parabola y² = 8x at the point (2, 4) is",
  "y = x + 2", ["y = 2x", "y = x − 2", "x + y = 6"], "yy₁ = 2a(x + x₁) with a = 2: 4y = 4(x + 2).")
M(CS, "tough", "tough", "The line y = mx + 1 touches the parabola y² = 4x. Then m is",
  "1", ["2", "1/2", "−1"], "Condition c = a/m with a = 1, c = 1 ⇒ m = 1.")
M(CS, "tough", "tough", "The foci of the ellipse x²/16 + y²/25 = 1 are",
  "(0, ±3)", ["(±3, 0)", "(0, ±4)", "(±4, 0)"], "Major axis along y (25 > 16): c = √(25 − 16) = 3.")
M(CS, "formula", "moderate", "The asymptotes of the hyperbola x²/9 − y²/4 = 1 are",
  "y = ±(2/3)x", ["y = ±(3/2)x", "y = ±(4/9)x", "y = ±x"], "y = ±(b/a)x.")
M(CS, "concept", "moderate", "The conic x²/a² − y²/b² = 1 is a rectangular hyperbola when",
  "a = b, and then e = √2", ["a = 2b", "b = 0", "a = b, and then e = 1"], "Equal axes give perpendicular asymptotes and e = √(1 + 1).")
M(CS, "tough", "tough", "The sum of the distances of any point on the ellipse x²/36 + y²/20 = 1 from its two foci is",
  "12", ["6", "2√20", "16"], "Focal distances add up to the major axis 2a = 12.")
M(CS, "tough", "tough", "For the hyperbola x²/25 − y²/11 = 1, the absolute difference of focal distances of any point on it is",
  "10", ["12", "2√11", "6"], "|PS − PS′| = 2a = 10.")
M(CS, "formula", "moderate", "The vertex of the parabola y² − 4y − 8x + 20 = 0 is",
  "(2, 2)", ["(−2, 2)", "(2, −2)", "(0, 2)"], "(y − 2)² = 8x − 16 = 8(x − 2).")
M(CS, "tough", "tough", "The point on the parabola y² = 16x whose focal distance is 8 is",
  "(4, ±8)", ["(8, ±8√2)", "(2, ±4√2)", "(4, ±4)"], "Focal distance = x + a = x + 4 = 8 ⇒ x = 4, y² = 64.")
M(CS, "formula", "moderate", "The parametric point (a cos θ, b sin θ) lies on",
  "the ellipse x²/a² + y²/b² = 1", ["the circle x² + y² = a²", "the hyperbola x²/a² − y²/b² = 1", "the parabola y² = 4ax"], "cos²θ + sin²θ = 1.")

# ═════════════════════════ Trigonometric Functions and Equations ═════════════════════════
TR = "Trigonometric Functions and Equations"
V(sp.sin(pi / 12), (sqrt(6) - sqrt(2)) / 4)
M(TR, "formula", "moderate", "sin 15° equals",
  "(√6 − √2)/4", ["(√6 + √2)/4", "(√3 − 1)/2", "√3/4"], "sin(45° − 30°) = (√2/2)(√3/2) − (√2/2)(1/2).")
V(sp.cos(pi / 5) * sp.cos(2 * pi / 5), Rt(1, 4))
M(TR, "tough", "tough", "cos 36° · cos 72° equals",
  "1/4", ["1/2", "1/8", "√5/4"], "cos 36° = (√5 + 1)/4, cos 72° = (√5 − 1)/4; product = 4/16.")
V(sp.sin(pi / 18) * sp.sin(5 * pi / 18) * sp.sin(7 * pi / 18), Rt(1, 8))
M(TR, "tough", "tough", "sin 10° · sin 50° · sin 70° equals",
  "1/8", ["1/4", "√3/8", "1/16"], "sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ = ¼ sin 30°.")
M(TR, "tough", "tough", "The maximum value of 3 sin x + 4 cos x + 2 is",
  "7", ["9", "5", "6"], "a sin x + b cos x ranges over [−√(a² + b²), √(a² + b²)] = [−5, 5].")
M(TR, "tough", "tough", "The number of solutions of sin 2x = sin x in [0, 2π] is",
  "5", ["3", "4", "6"], "sin x(2 cos x − 1) = 0: x = 0, π, 2π and x = π/3, 5π/3.")
M(TR, "formula", "moderate", "The general solution of tan x = √3 is",
  "x = nπ + π/3, n ∈ ℤ", ["x = 2nπ + π/3", "x = nπ ± π/3", "x = nπ/3"], "tan has period π.")
M(TR, "formula", "moderate", "The general solution of cos x = 1/2 is",
  "x = 2nπ ± π/3, n ∈ ℤ", ["x = nπ + π/3", "x = nπ ± π/6", "x = 2nπ + π/3 only"], "cos θ = cos α ⇒ θ = 2nπ ± α.")
V(sp.tan(pi / 8), sqrt(2) - 1)
M(TR, "formula", "moderate", "tan 22.5° equals",
  "√2 − 1", ["√2 + 1", "1/√2", "2 − √3"], "tan(θ/2) = (1 − cos θ)/sin θ with θ = 45°.")
M(TR, "tough", "tough", "If tan A = 1/2 and tan B = 1/3 (A, B acute), then A + B equals",
  "π/4", ["π/3", "π/6", "π/2"], "tan(A + B) = (5/6)/(1 − 1/6) = 1.")
M(TR, "tough", "tough", "The minimum value of sin⁴x + cos⁴x is",
  "1/2", ["0", "1/4", "1"], "sin⁴ + cos⁴ = 1 − ½ sin²2x ≥ 1/2.")
V(sp.simplify(sp.cos(x)**2 + sp.cos(x + 2 * pi / 3)**2 + sp.cos(x - 2 * pi / 3)**2), Rt(3, 2))
M(TR, "tough", "tough", "cos²x + cos²(x + 120°) + cos²(x − 120°) equals",
  "3/2", ["1", "3/4", "0"], "Using cos² = (1 + cos 2θ)/2 and the three cos 2θ terms summing to 0.")
M(TR, "concept", "moderate", "The period of f(x) = |sin x| + |cos x| is",
  "π/2", ["π", "2π", "π/4"], "Both |sin x| and |cos x| have period π, and f(x + π/2) = |cos x| + |sin x| = f(x).")
M(TR, "formula", "easy", "In a triangle, a = 7, b = 5, c = 3. The angle A is",
  "120°", ["90°", "60°", "150°"], "cos A = (25 + 9 − 49)/(2 × 15) = −1/2.")
V(sp.sin(3 * pi / 10) - sp.sin(pi / 10), Rt(1, 2))
M(TR, "tough", "tough", "sin 54° − sin 18° equals",
  "1/2", ["√5/4", "1/4", "(√5 − 1)/4"], "(√5 + 1)/4 − (√5 − 1)/4 = 1/2.")

# ═════════════════════════ Differentiation ═════════════════════════
DF = "Differentiation"
V(sp.diff(x**x, x).subs(x, 1), 1)
M(DF, "tough", "moderate", "If y = xˣ, then dy/dx at x = 1 is",
  "1", ["0", "e", "2"], "ln y = x ln x ⇒ y′ = xˣ(1 + ln x) = 1 at x = 1.")
yx = sp.sqrt(x + sp.sqrt(x)); V(sp.diff(yx, x).subs(x, 4), sp.Rational(5, 4) / (2 * sp.sqrt(6)))
M(DF, "tough", "tough", "If y = √(x + √x), then dy/dx at x = 4 is",
  "5/(8√6)", ["1/(2√6)", "5/(4√6)", "1/(4√6)"], "y′ = (1 + 1/(2√x))/(2√(x + √x)) = (5/4)/(2√6).")
V(sp.diff(sp.atan((2 * x) / (1 - x**2)), x).subs(x, Rt(1, 2)), Rt(8, 5))
M(DF, "tough", "tough", "For |x| < 1, d/dx[tan⁻¹(2x/(1 − x²))] at x = 1/2 equals",
  "8/5", ["4/5", "2/5", "16/5"], "tan⁻¹(2x/(1 − x²)) = 2 tan⁻¹x for |x| < 1, derivative 2/(1 + x²) = 2/(5/4).")
M(DF, "tough", "tough", "If x = a cos³t and y = a sin³t, then dy/dx equals",
  "−tan t", ["tan t", "−cot t", "−tan² t"], "dy/dt = 3a sin²t cos t, dx/dt = −3a cos²t sin t.")
M(DF, "tough", "tough", "If x² + y² = 25, then d²y/dx² at (3, 4) is",
  "−25/64", ["−3/4", "25/64", "−5/16"], "y′ = −x/y = −3/4; y″ = −(y − xy′)/y² = −(4 + 9/4)/16 = −25/64.")
V(sp.diff(sp.log(sp.sin(x)), x).subs(x, pi / 4), 1)
M(DF, "formula", "easy", "d/dx[ln(sin x)] at x = π/4 is",
  "1", ["0", "√2", "1/√2"], "cot(π/4) = 1.")
V(sp.diff(sp.exp(2 * x) * sp.sin(x), x).subs(x, 0), 1)
M(DF, "formula", "moderate", "d/dx[e^{2x} sin x] at x = 0 is",
  "1", ["2", "0", "3"], "e^{2x}(2 sin x + cos x) at 0 = 1.")
M(DF, "tough", "tough", "If y = sin⁻¹x, then (1 − x²)y″ − xy′ equals",
  "0", ["1", "y", "−1"], "y′ = 1/√(1 − x²) ⇒ √(1 − x²)y′ = 1; differentiate: (1 − x²)y″ − xy′ = 0.")
yy = sp.exp(3 * x); V(sp.diff(yy, x, 2) - 9 * yy, 0)
M(DF, "formula", "moderate", "If y = A e^{3x} + B e^{−3x}, then d²y/dx² equals",
  "9y", ["3y", "−9y", "y"], "Each term differentiates twice to 9 times itself.")
M(DF, "tough", "tough", "The derivative of sin x with respect to cos x at x = π/3 is",
  "−1/√3", ["√3", "−√3", "1/√3"], "d(sin x)/d(cos x) = cos x/(−sin x) = −cot(π/3).")
V(sp.diff(sp.log(x + sp.sqrt(x**2 + 1)), x).subs(x, 0), 1)
M(DF, "tough", "moderate", "d/dx[ln(x + √(x² + 1))] equals",
  "1/√(x² + 1)", ["1/(x + √(x² + 1))", "x/√(x² + 1)", "√(x² + 1)"], "(1 + x/√(x² + 1))/(x + √(x² + 1)) = 1/√(x² + 1).")

# ═════════════════════════ Circles ═════════════════════════
CI = "Circles"
M(CI, "formula", "easy", "The centre and radius of x² + y² − 6x + 8y − 11 = 0 are",
  "(3, −4) and 6", ["(−3, 4) and 6", "(3, −4) and √11", "(6, −8) and 6"], "r = √(9 + 16 + 11) = 6.")
M(CI, "tough", "tough", "The length of the tangent from (5, 3) to the circle x² + y² − 4x − 2y + 1 = 0 is",
  "3", ["√15", "5", "√17"], "Length = √S₁ = √(25 + 9 − 20 − 6 + 1) = √9 = 3.")
M(CI, "formula", "moderate", "The equation of the circle with (1, 2) and (5, 6) as ends of a diameter is",
  "x² + y² − 6x − 8y + 17 = 0", ["x² + y² + 6x + 8y + 17 = 0", "x² + y² − 6x − 8y − 17 = 0", "x² + y² − 3x − 4y + 17 = 0"], "(x − 1)(x − 5) + (y − 2)(y − 6) = 0.")
M(CI, "tough", "tough", "The line 3x + 4y = k touches the circle x² + y² = 25 when k equals",
  "±25", ["±5", "±20", "±125"], "Distance from origin = |k|/5 = 5.")
M(CI, "tough", "tough", "The circles x² + y² = 9 and x² + y² − 8x + 7 = 0 (centre (4, 0), radius 3) are such that",
  "they intersect at two points", ["they touch externally", "one lies inside the other", "they do not meet"], "Distance of centres 4 lies between |3 − 3| = 0 and 3 + 3 = 6.")
M(CI, "formula", "moderate", "The equation of the tangent to x² + y² = 25 at (3, 4) is",
  "3x + 4y = 25", ["4x + 3y = 25", "3x − 4y = 25", "3x + 4y = 5"], "xx₁ + yy₁ = r².")
M(CI, "tough", "tough", "The radius of the circle passing through (0, 0), (4, 0) and (0, 3) is",
  "5/2", ["5", "7/2", "3"], "The right angle at the origin means (4, 0)–(0, 3) is a diameter of length 5.")
M(CI, "tough", "tough", "The length of the chord cut by the line x + y = 2 on the circle x² + y² = 4 is",
  "2√2", ["4", "√2", "2"], "Distance from centre = 2/√2 = √2; chord = 2√(4 − 2) = 2√2.")
M(CI, "concept", "moderate", "The equation x² + y² + 2gx + 2fy + c = 0 represents a real circle only when",
  "g² + f² − c > 0", ["g² + f² + c > 0", "c > 0", "g = f"], "Radius² = g² + f² − c must be positive.")
M(CI, "tough", "tough", "The parametric equations x = 2 + 3 cos θ, y = −1 + 3 sin θ represent a circle with",
  "centre (2, −1) and radius 3", ["centre (3, 3) and radius 2", "centre (−2, 1) and radius 3", "centre (2, −1) and radius 9"], "(x − 2)² + (y + 1)² = 9.")
M(CI, "tough", "tough", "The equation of the circle with centre (2, 3) touching the x-axis is",
  "x² + y² − 4x − 6y + 4 = 0", ["x² + y² − 4x − 6y + 9 = 0", "x² + y² − 4x − 6y + 13 = 0", "x² + y² + 4x + 6y + 4 = 0"], "Radius = |k| = 3: (x − 2)² + (y − 3)² = 9 ⇒ x² + y² − 4x − 6y + 4 = 0.")

# ═════════════════════════ Straight Lines ═════════════════════════
SL = "Straight Lines"
M(SL, "formula", "easy", "The distance of the point (3, 4) from the line 3x + 4y − 5 = 0 is",
  "4", ["5", "20", "3"], "|9 + 16 − 5|/5 = 20/5.")
M(SL, "formula", "moderate", "The distance between the parallel lines 3x + 4y = 7 and 6x + 8y = 9 is",
  "1/2", ["2/5", "1", "5/2"], "Write the second as 3x + 4y = 4.5: |7 − 4.5|/5 = 1/2.")
M(SL, "tough", "tough", "The acute angle between the lines y = 2x + 1 and y = −3x + 4 is",
  "45°", ["60°", "30°", "90°"], "tan θ = |(2 − (−3))/(1 + 2(−3))| = |5/(−5)| = 1.")
M(SL, "tough", "tough", "The foot of the perpendicular from (1, 2) to the line x + y = 5 is",
  "(2, 3)", ["(3, 2)", "(1, 4)", "(5/2, 5/2)"], "Moving along (1, 1): (1 + t, 2 + t) with 3 + 2t = 5 ⇒ t = 1.")
M(SL, "tough", "tough", "The image (reflection) of the point (1, 2) in the line x + y = 5 is",
  "(3, 4)", ["(2, 3)", "(4, 3)", "(−1, −2)"], "Foot (2, 3) is the midpoint of the point and its image.")
M(SL, "formula", "moderate", "The point dividing the join of (2, 3) and (8, 9) internally in the ratio 1 : 2 is",
  "(4, 5)", ["(6, 7)", "(5, 6)", "(3, 4)"], "((1·8 + 2·2)/3, (1·9 + 2·3)/3).")
M(SL, "tough", "tough", "The lines x + y = 3, 2x − y = 0 and kx + 3y = 9 are concurrent when k equals",
  "3", ["6", "9", "−3"], "The first two meet at (1, 2); it must lie on the third: k + 6 = 9 ⇒ k = 3.")
M(SL, "formula", "moderate", "The line through (2, −3) perpendicular to 2x − 3y + 5 = 0 is",
  "3x + 2y = 0", ["2x − 3y = 13", "3x − 2y = 12", "3x + 2y = 12"], "Slope of given line 2/3 ⇒ required slope −3/2: y + 3 = −(3/2)(x − 2) ⇒ 3x + 2y = 0.")
M(SL, "formula", "moderate", "The area of the triangle formed by the line 3x + 4y = 12 with the coordinate axes is",
  "6", ["12", "7", "24"], "Intercepts 4 and 3: ½ × 4 × 3.")
M(SL, "tough", "tough", "The locus of a point equidistant from (1, 2) and (3, 4) is",
  "x + y = 5", ["x − y = 1", "x + y = 3", "x − y + 1 = 0"], "Perpendicular bisector: midpoint (2, 3), slope −1.")
M(SL, "concept", "moderate", "The lines 2x + 3y = 5 and 4x + 6y = 7 are",
  "parallel and distinct", ["perpendicular", "coincident", "intersecting at one point"], "Same slope −2/3, different constants (2.5 vs 3.5 after scaling).")
M(SL, "tough", "tough", "The centroid of the triangle with vertices (1, 2), (3, −4) and (5, 8) is",
  "(3, 2)", ["(3, 6)", "(9, 6)", "(2, 3)"], "((1 + 3 + 5)/3, (2 − 4 + 8)/3).")

# ═════════════════════════ Definite Integrals ═════════════════════════
DI = "Definite Integrals"
V(I_(sp.sin(x)**2, (x, 0, pi / 2)), pi / 4)
M(DI, "formula", "moderate", "∫₀^{π/2} sin²x dx equals",
  "π/4", ["π/2", "1/2", "π"], "By the property ∫₀^a f(x) = ∫₀^a f(a − x), it equals ∫cos²x; their sum is π/2.")
M(DI, "tough", "tough", "∫₀^{π/2} √(sin x)/(√(sin x) + √(cos x)) dx equals",
  "π/4", ["π/2", "1", "0"], "Adding the integral to itself with x → π/2 − x gives ∫₀^{π/2} 1 dx = π/2.")
V(I_(x * sp.sin(x), (x, 0, pi)), pi)
M(DI, "tough", "tough", "∫₀^π x sin x dx equals",
  "π", ["2", "π/2", "2π"], "By parts: [−x cos x]₀^π + ∫cos x = π + 0.")
V(I_(sp.Abs(x**2 - 1), (x, 0, 2)), 2)
M(DI, "tough", "tough", "∫₀² |x² − 1| dx equals",
  "2", ["2/3", "4/3", "8/3"], "∫₀¹(1 − x²) + ∫₁²(x² − 1) = 2/3 + 4/3.")
V(sum(I_(sp.Integer(j), (x, j, j + 1)) for j in range(3)), 3)
M(DI, "tough", "moderate", "∫₀³ [x] dx, where [·] is the greatest integer function, equals",
  "3", ["6", "9/2", "2"], "0 + 1 + 2 over the unit intervals.")
V(I_(x**3 * sp.cos(x), (x, -1, 1)), 0)
M(DI, "concept", "moderate", "∫₋₁¹ x³ cos x dx equals",
  "0", ["2 sin 1", "1", "−2"], "x³ cos x is odd, so the integral over a symmetric interval is 0.")
V(I_(1 / (1 + x**2), (x, 0, 1)), pi / 4)
M(DI, "formula", "easy", "∫₀¹ dx/(1 + x²) equals",
  "π/4", ["π/2", "1", "ln 2"], "tan⁻¹1 − tan⁻¹0.")
V(I_(x * sp.exp(x), (x, 0, 1)), 1)
M(DI, "formula", "moderate", "∫₀¹ x eˣ dx equals",
  "1", ["e", "e − 1", "1/e"], "[(x − 1)eˣ]₀¹ = 0 − (−1).")
V(I_(x**2, (x, 0, 1)), Rt(1, 3)); V(sp.limit(n * (n + 1) * (2 * n + 1) / 6 / n**3, n, sp.oo), Rt(1, 3))
M(DI, "tough", "tough", "lim_{n→∞} (1² + 2² + … + n²)/n³ equals",
  "1/3", ["1/2", "1", "1/6"], "As a Riemann sum this is ∫₀¹ x² dx.")
M(DI, "tough", "tough", "∫_{π/8}^{3π/8} ln(tan x) dx equals",
  "0", ["π/4", "ln 2", "−π/8"], "x → π/2 − x turns ln tan x into −ln tan x over the same interval, so I = −I.")
V(I_(sp.exp(-x), (x, 0, sp.oo)), 1)
M(DI, "formula", "moderate", "∫₀^∞ e^{−x} dx equals",
  "1", ["0", "∞", "e"], "[−e^{−x}]₀^∞ = 0 + 1.")
V(I_(1 / sp.sqrt(4 - x**2), (x, 0, 1)), pi / 6)
M(DI, "formula", "moderate", "∫₀¹ dx/√(4 − x²) equals",
  "π/6", ["π/3", "π/4", "π/2"], "sin⁻¹(x/2) from 0 to 1.")
