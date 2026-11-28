"""Batch 5 — JEE Mathematics B: Probability, Statistics, Application of Derivatives, Vectors,
Differential Equations, Limits, 3D, P&C, Indefinite Integrals, Sequences, Matrices, Complex, Sets.
Original questions; answers checked with sympy / exact arithmetic (V) wherever possible. 28 Nov 2026."""
import itertools
from fractions import Fraction as Fr
import sympy as sp
from qlib import mcq

S = "Mathematics"
x, y, t, n = sp.symbols("x y t n", real=True)
pi, sqrt, Rt, I_ = sp.pi, sp.sqrt, sp.Rational, sp.integrate
def M(chap, cat, diff, text, correct, wrongs, expl):
    mcq("JEE", S, chap, cat, diff, text, correct, wrongs, expl)
def V(expr, val):
    d = sp.simplify(sp.nsimplify(expr) - sp.nsimplify(val))
    assert d == 0 or abs(sp.N(d, 30)) < 1e-18, (expr, val)

# ═════════════════════════ Probability ═════════════════════════
PR = "Probability"
dice = list(itertools.product(range(1, 7), repeat=2))
V(Rt(sum(1 for a, b in dice if a + b == 7), 36), Rt(1, 6))
M(PR, "formula", "easy", "Two fair dice are thrown. The probability that the sum is 7 is",
  "1/6", ["1/12", "7/36", "5/36"], "6 favourable pairs out of 36.")
V(Rt(sum(1 for a, b in dice if a + b >= 10), 36), Rt(1, 6))
M(PR, "formula", "moderate", "Two fair dice are thrown. The probability that the sum is at least 10 is",
  "1/6", ["1/4", "1/9", "5/36"], "Sums 10, 11, 12: 3 + 2 + 1 = 6 outcomes.")
V(1 - Rt(5, 6)**4, Rt(671, 1296))
M(PR, "tough", "tough", "A fair die is thrown 4 times. The probability of getting at least one six is",
  "671/1296", ["2/3", "625/1296", "1/1296"], "1 − (5/6)⁴ = 1 − 625/1296.")
V(Rt(sp.binomial(4, 2) * sp.binomial(6, 1), sp.binomial(10, 3)), Rt(3, 10))
M(PR, "tough", "tough", "A bag has 4 red and 6 black balls. Three are drawn at random. The probability of exactly 2 red is",
  "3/10", ["1/5", "2/5", "1/2"], "C(4,2)C(6,1)/C(10,3) = 36/120.")
V(Rt(1, 2) * Rt(2, 5) / (Rt(1, 2) * Rt(2, 5) + Rt(1, 2) * Rt(3, 7)), Rt(14, 29))
M(PR, "tough", "tough", "Bag A has 2 red, 3 white balls; bag B has 3 red, 4 white. A bag is chosen at random and a ball drawn is red. The probability that it came from A is",
  "14/29", ["15/29", "2/5", "1/2"], "Bayes: (½ × 2/5)/(½ × 2/5 + ½ × 3/7) = (1/5)/(1/5 + 3/14) = 14/29.")
V(sp.binomial(5, 3) * Rt(1, 2)**5, Rt(5, 16))
M(PR, "formula", "moderate", "A fair coin is tossed 5 times. The probability of exactly 3 heads is",
  "5/16", ["3/5", "1/2", "5/32"], "C(5, 3)/2⁵ = 10/32.")
M(PR, "formula", "moderate", "If P(A) = 0.4, P(B) = 0.5 and A, B are independent, then P(A ∪ B) is",
  "0.7", ["0.9", "0.2", "0.1"], "0.4 + 0.5 − 0.2.")
M(PR, "tough", "tough", "If P(A) = 0.6, P(B) = 0.5 and P(A ∩ B) = 0.3, then P(A | B′) is",
  "0.6", ["0.3", "0.5", "0.4"], "P(A ∩ B′) = 0.6 − 0.3 = 0.3; P(B′) = 0.5; ratio 0.6. (A and B are independent here.)")
V(Rt(sum(range(1, 7)), 6), Rt(7, 2))
M(PR, "formula", "moderate", "The mean (expected value) of the number shown on a fair die is",
  "7/2", ["3", "4", "6"], "(1 + 2 + … + 6)/6 = 21/6.")
X = [0, 1, 2]; Px = [Rt(1, 4), Rt(1, 2), Rt(1, 4)]
mu = sum(a * p for a, p in zip(X, Px)); var = sum(a * a * p for a, p in zip(X, Px)) - mu**2
V(var, Rt(1, 2))
M(PR, "tough", "tough", "X is the number of heads when 2 fair coins are tossed. The variance of X is",
  "1/2", ["1", "1/4", "3/2"], "E(X) = 1, E(X²) = 0·¼ + 1·½ + 4·¼ = 3/2; Var = 3/2 − 1.")
M(PR, "tough", "tough", "Three persons hit a target with probabilities 1/2, 1/3 and 1/4 independently. The probability that the target is hit at least once is",
  "3/4", ["1/24", "13/12", "1/4"], "1 − (1/2)(2/3)(3/4) = 1 − 1/4.")
V(Rt(sp.factorial(4) * sp.factorial(2), sp.factorial(5)), Rt(2, 5))
M(PR, "tough", "tough", "Five people sit in a row at random. The probability that two particular persons sit together is",
  "2/5", ["1/5", "1/10", "3/5"], "Treat the two as one block: 4!·2!/5! = 48/120.")
M(PR, "concept", "moderate", "If A and B are mutually exclusive with P(A) = 0.3 and P(B) = 0.4, then P(A ∩ B) and P(A ∪ B) are",
  "0 and 0.7", ["0.12 and 0.58", "0.12 and 0.7", "0 and 0.58"], "Mutually exclusive means they cannot happen together.")
V(1 - Rt(sp.binomial(48, 2), sp.binomial(52, 2)), Rt(33, 221))
M(PR, "tough", "tough", "Two cards are drawn from a well-shuffled pack of 52. The probability that at least one is an ace is",
  "33/221", ["1/13", "2/13", "188/221"], "1 − C(48,2)/C(52,2) = 1 − 188/221.")

# ═════════════════════════ Statistics ═════════════════════════
ST = "Statistics"
d = [2, 4, 4, 4, 5, 5, 7, 9]
m_ = Fr(sum(d), len(d)); v_ = sum((Fr(a) - m_)**2 for a in d) / len(d)
assert m_ == 5 and v_ == 4
M(ST, "formula", "moderate", "The standard deviation of 2, 4, 4, 4, 5, 5, 7, 9 is",
  "2", ["4", "5", "√5"], "Mean 5; squared deviations 9,1,1,1,0,0,4,16 sum to 32; variance 32/8 = 4.")
M(ST, "formula", "easy", "The variance of the first 10 natural numbers is",
  "8.25", ["9.17", "5.5", "2.87"], "(n² − 1)/12 = 99/12.")
M(ST, "tough", "tough", "Each observation of a data set with mean 20 and variance 9 is multiplied by 2 and then 5 is added. The new mean and variance are",
  "45 and 36", ["45 and 18", "40 and 36", "45 and 23"], "Mean → 2(20) + 5; variance → 2² × 9 (adding a constant does not change it).")
d2 = [3, 7, 8, 10, 12]
md = Fr(sum(d2), 5); mad = sum(abs(Fr(a) - md) for a in d2) / 5
assert md == 8 and mad == Fr(12, 5)
M(ST, "formula", "moderate", "The mean deviation about the mean of 3, 7, 8, 10, 12 is",
  "2.4", ["2", "3", "8"], "Mean 8; deviations 5, 1, 0, 2, 4 sum to 12; 12/5.")
M(ST, "tough", "tough", "The mean of 5 observations is 4 and their variance is 5.2. If three of them are 1, 2 and 6, the other two are",
  "4 and 7", ["3 and 8", "5 and 6", "2 and 9"], "Sum = 20 ⇒ a + b = 11. Σx² = 5(5.2 + 16) = 106 ⇒ a² + b² = 106 − 41 = 65 ⇒ {4, 7}.")
assert 4 + 7 == 11 and 16 + 49 == 65
M(ST, "tough", "tough", "The mean of 10 numbers is 15. One number 24 was wrongly read as 42. The correct mean is",
  "13.2", ["16.8", "15", "12.6"], "Correct sum = 150 − 42 + 24 = 132.")
M(ST, "formula", "moderate", "The median of 12, 5, 9, 15, 7, 10 is",
  "9.5", ["9", "10", "9.67"], "Sorted: 5, 7, 9, 10, 12, 15; median = (9 + 10)/2.")
M(ST, "concept", "moderate", "The coefficient of variation of a data set with mean 40 and standard deviation 10 is",
  "25%", ["4%", "40%", "10%"], "CV = (σ/x̄) × 100.")
M(ST, "tough", "tough", "Two groups of 20 and 30 students have mean marks 60 and 70. The combined mean is",
  "66", ["65", "64", "68"], "(1200 + 2100)/50.")
M(ST, "concept", "moderate", "If every observation is increased by 10, the standard deviation",
  "stays the same", ["increases by 10", "increases 10 times", "decreases by 10"], "Shifting all data does not change spread.")

# ═════════════════════════ Application of Derivatives ═════════════════════════
AD = "Application of Derivatives"
f = x**3 - 6 * x**2 + 9 * x + 1
cr = sp.solve(sp.diff(f, x), x); V(f.subs(x, 1), 5); V(f.subs(x, 3), 1)
M(AD, "tough", "moderate", "The local maximum value of f(x) = x³ − 6x² + 9x + 1 is",
  "5", ["1", "3", "9"], "f′ = 3(x − 1)(x − 3); f″(1) < 0 ⇒ local max f(1) = 5 (local min f(3) = 1).")
M(AD, "formula", "moderate", "f(x) = x³ − 3x is decreasing on",
  "(−1, 1)", ["(−∞, −1)", "(1, ∞)", "(−∞, ∞)"], "f′ = 3(x² − 1) < 0 for |x| < 1.")
V(sp.diff(x**2, x).subs(x, 2), 4)
M(AD, "formula", "easy", "The equation of the tangent to y = x² at (2, 4) is",
  "y = 4x − 4", ["y = 2x", "y = 4x + 4", "y = x + 2"], "Slope 2x = 4: y − 4 = 4(x − 2).")
M(AD, "tough", "tough", "Of all rectangles with perimeter 40 cm, the maximum possible area is",
  "100 cm²", ["400 cm²", "96 cm²", "200 cm²"], "A = x(20 − x) is largest at x = 10: a square.")
Vbox = x * (12 - 2 * x)**2; best = [c for c in sp.solve(sp.diff(Vbox, x), x) if 0 < c < 6][0]; V(best, 2); V(Vbox.subs(x, 2), 128)
M(AD, "tough", "tough", "Equal squares are cut from the corners of a 12 cm × 12 cm sheet to make an open box. The maximum volume is",
  "128 cm³", ["144 cm³", "100 cm³", "216 cm³"], "V = x(12 − 2x)²; V′ = 0 at x = 2 (x = 6 gives zero volume); V(2) = 2 × 64.")
M(AD, "formula", "moderate", "The radius of a circle increases at 2 cm/s. The rate of increase of its area when r = 5 cm is",
  "20π cm²/s", ["10π cm²/s", "25π cm²/s", "4π cm²/s"], "dA/dt = 2πr dr/dt = 2π × 5 × 2.")
M(AD, "tough", "tough", "A spherical balloon is inflated at 100 cm³/s. The rate at which its radius grows when r = 5 cm is",
  "1/π cm/s", ["4π cm/s", "1/(4π) cm/s", "π cm/s"], "dV/dt = 4πr² dr/dt ⇒ dr/dt = 100/(100π).")
M(AD, "tough", "tough", "The minimum value of f(x) = x + 1/x for x > 0 is",
  "2", ["1", "0", "1/2"], "AM ≥ GM, or f′ = 1 − 1/x² = 0 at x = 1.")
M(AD, "concept", "moderate", "The function f(x) = eˣ + e^{−x} is",
  "decreasing for x < 0 and increasing for x > 0", ["increasing for all x", "decreasing for all x", "constant"], "f′ = eˣ − e^{−x} has the sign of x.")
f2 = 2 * x**3 - 3 * x**2 - 12 * x + 5
vals = [f2.subs(x, c) for c in (-2, -1, 2, 3)]; V(max(vals), 12); V(min(vals), -15)
M(AD, "tough", "tough", "The absolute maximum and minimum of f(x) = 2x³ − 3x² − 12x + 5 on [−2, 3] are",
  "12 and −15", ["12 and 1", "5 and −15", "−4 and −15"], "Critical points x = −1, 2: f(−2) = 1, f(−1) = 12, f(2) = −15, f(3) = −4.")
M(AD, "tough", "tough", "The normal to y = x³ at (1, 1) meets the x-axis at",
  "(4, 0)", ["(2/3, 0)", "(−2, 0)", "(3, 0)"], "Slope of tangent 3 ⇒ normal y − 1 = −(x − 1)/3; y = 0 ⇒ x = 4.")
M(AD, "concept", "moderate", "Rolle's theorem applied to f(x) = x² − 4x on [0, 4] gives c equal to",
  "2", ["1", "3", "4"], "f(0) = f(4) = 0 and f′(c) = 2c − 4 = 0.")

# ═════════════════════════ Vector Algebra ═════════════════════════
VA = "Vector Algebra"
a_ = sp.Matrix([1, 2, 2]); b_ = sp.Matrix([2, -1, 2])
V(a_.dot(b_), 4)
M(VA, "formula", "moderate", "The angle θ between a = i + 2j + 2k and b = 2i − j + 2k satisfies",
  "cos θ = 4/9", ["cos θ = 4/3", "cos θ = 2/9", "θ = 90°"], "a·b = 2 − 2 + 4 = 4; |a| = |b| = 3.")
cr_ = sp.Matrix([1, 1, 0]).cross(sp.Matrix([0, 1, 1])); V(cr_.norm(), sqrt(3))
M(VA, "tough", "tough", "The area of the parallelogram with adjacent sides i + j and j + k is",
  "√3", ["1", "√2", "3"], "(i + j) × (j + k) = i − j + k, magnitude √3.")
tri = sp.Matrix([[1, 2, 3], [0, 1, 2], [1, 0, 1]]).det(); V(tri, 2)
M(VA, "tough", "tough", "The scalar triple product [a b c] for a = i + 2j + 3k, b = j + 2k, c = i + k is",
  "2", ["0", "−2", "4"], "Determinant of the components: 1(1 − 0) − 2(0 − 2) + 3(0 − 1) = 1 + 4 − 3.")
M(VA, "tough", "tough", "The vectors 2i − j + k, i + 2j − 3k and 3i + λj + 5k are coplanar when λ equals",
  "−4", ["4", "−2", "2"], "Determinant = 0: 2(10 + 3λ) + 1(5 + 9) + 1(λ − 6) = 7λ + 28 = 0.")
lam = sp.symbols("lam"); V(sp.solve(sp.Matrix([[2, -1, 1], [1, 2, -3], [3, lam, 5]]).det(), lam)[0], -4)
M(VA, "formula", "moderate", "The projection of a = 2i + 3j + 6k on b = i + 2j + 2k is",
  "20/3", ["20/7", "20", "6"], "a·b/|b| = (2 + 6 + 12)/3.")
M(VA, "concept", "moderate", "If |a + b| = |a − b|, then a and b are",
  "perpendicular", ["parallel", "equal", "of equal length"], "Squaring: a·b = −a·b ⇒ a·b = 0.")
M(VA, "formula", "moderate", "The unit vector along 3i − 4k is",
  "(3i − 4k)/5", ["(3i − 4k)/7", "(3i − 4k)/√7", "3i − 4k"], "|3i − 4k| = 5.")
M(VA, "tough", "tough", "If |a| = 3, |b| = 4 and |a + b| = 5, then |a − b| equals",
  "5", ["1", "7", "√7"], "5² = 9 + 16 + 2a·b ⇒ a·b = 0, so |a − b|² = 25 too.")
M(VA, "tough", "tough", "The value of λ for which 2i + λj + k and i − 2j + 3k are perpendicular is",
  "5/2", ["−5/2", "1/2", "3"], "2 − 2λ + 3 = 0.")
M(VA, "formula", "moderate", "The work done by force F = 2i + 3j + k in moving a particle from (1, 1, 1) to (3, 2, 4) is",
  "10 units", ["7 units", "13 units", "6 units"], "d = 2i + j + 3k; F·d = 4 + 3 + 3.")

# ═════════════════════════ Differential Equations ═════════════════════════
DE = "Differential Equations"
M(DE, "concept", "moderate", "The order and degree of (d²y/dx²)³ + (dy/dx)⁴ + y = 0 are",
  "2 and 3", ["2 and 4", "3 and 2", "4 and 2"], "Highest derivative is second order; its power is 3.")
sol = sp.dsolve(sp.Eq(sp.Function("Y")(x).diff(x), 2 * x * sp.Function("Y")(x)), ics={sp.Function("Y")(0): 1})
V(sol.rhs.subs(x, 1), sp.E)
M(DE, "tough", "moderate", "If dy/dx = 2xy and y(0) = 1, then y(1) equals",
  "e", ["e²", "2", "1"], "Separable: ln y = x² ⇒ y = e^{x²}.")
Yf = sp.Function("Y")
sol2 = sp.dsolve(sp.Eq(Yf(x).diff(x) + Yf(x), sp.exp(-x)), ics={Yf(0): 0}); V(sol2.rhs.subs(x, 1), 1 / sp.E)
M(DE, "tough", "tough", "The solution of dy/dx + y = e^{−x} with y(0) = 0 gives y(1) equal to",
  "1/e", ["e", "0", "2/e"], "IF = eˣ: (yeˣ)′ = 1 ⇒ yeˣ = x ⇒ y = xe^{−x}.")
M(DE, "formula", "moderate", "The integrating factor of dy/dx + (2/x)y = x is",
  "x²", ["e^{2x}", "2 ln x", "1/x²"], "e^{∫2/x dx} = e^{2 ln x}.")
M(DE, "tough", "tough", "The differential equation of all straight lines y = mx (through the origin) is",
  "x dy/dx = y", ["dy/dx = m", "y dy/dx = x", "d²y/dx² = 1"], "Eliminate m: m = dy/dx = y/x.")
M(DE, "tough", "tough", "The general solution of dy/dx = (x + y)/x (homogeneous) is",
  "y = x ln|x| + Cx", ["y = ln|x| + C", "y = x + C", "y = Cx²"], "Put y = vx: v + xv′ = 1 + v ⇒ v = ln|x| + C.")
sol3 = sp.dsolve(sp.Eq(Yf(x).diff(x), (1 + Yf(x)**2)), ics={Yf(0): 0}); V(sol3.rhs.subs(x, pi / 4), 1)
M(DE, "tough", "tough", "If dy/dx = 1 + y² and y(0) = 0, then y(π/4) equals",
  "1", ["0", "π/4", "√3"], "tan⁻¹y = x ⇒ y = tan x.")
M(DE, "concept", "moderate", "The number of arbitrary constants in the general solution of a differential equation of order 3 is",
  "3", ["1", "2", "0"], "It equals the order.")
M(DE, "tough", "tough", "The population of a town grows at a rate proportional to its size and doubles in 20 years. It will triple in about",
  "31.7 years", ["30 years", "40 years", "60 years"], "P = P₀e^{kt}: k = ln 2/20; t = ln 3/k = 20 × 1.585.")
assert abs(20 * 1.5849625 - 31.7) < 0.05

# ═════════════════════════ Limits, Continuity and Differentiability ═════════════════════════
LC = "Limits, Continuity and Differentiability"
V(sp.limit((sp.tan(x) - sp.sin(x)) / x**3, x, 0), Rt(1, 2))
M(LC, "tough", "tough", "lim_{x→0} (tan x − sin x)/x³ equals",
  "1/2", ["1", "0", "1/6"], "tan x − sin x = tan x(1 − cos x) ≈ x · x²/2.")
V(sp.limit((1 + 3 / x)**x, x, sp.oo), sp.exp(3))
M(LC, "formula", "moderate", "lim_{x→∞} (1 + 3/x)ˣ equals",
  "e³", ["3", "e", "1"], "1^∞ form: e^{lim x(3/x)}.")
V(sp.limit((sp.exp(2 * x) - 1) / sp.sin(3 * x), x, 0), Rt(2, 3))
M(LC, "formula", "moderate", "lim_{x→0} (e^{2x} − 1)/sin 3x equals",
  "2/3", ["3/2", "1", "2"], "≈ 2x/3x.")
V(sp.limit((x**5 - 32) / (x - 2), x, 2), 80)
M(LC, "formula", "easy", "lim_{x→2} (x⁵ − 32)/(x − 2) equals",
  "80", ["32", "16", "40"], "naⁿ⁻¹ = 5 × 2⁴.")
V(sp.limit((sp.sqrt(1 + x) - sp.sqrt(1 - x)) / x, x, 0), 1)
M(LC, "formula", "moderate", "lim_{x→0} (√(1 + x) − √(1 − x))/x equals",
  "1", ["1/2", "2", "0"], "Rationalise: 2x/(x(√(1 + x) + √(1 − x))) → 2/2.")
V(sp.limit(sp.log(1 + 2 * x) / x, x, 0), 2)
M(LC, "formula", "easy", "lim_{x→0} ln(1 + 2x)/x equals",
  "2", ["1", "1/2", "0"], "ln(1 + u)/u → 1 with u = 2x.")
M(LC, "tough", "tough", "f(x) = (sin 2x)/x for x ≠ 0 and f(0) = k is continuous at x = 0 when k equals",
  "2", ["1", "0", "1/2"], "lim sin 2x/x = 2.")
M(LC, "tough", "tough", "The number of points in (0, 3) where f(x) = [x] (greatest integer) is discontinuous is",
  "2", ["3", "1", "0"], "Jumps at x = 1 and x = 2 only.")
M(LC, "tough", "tough", "f(x) = |x − 1| + |x − 2| is not differentiable at",
  "x = 1 and x = 2", ["x = 1 only", "x = 1.5", "nowhere"], "Each modulus has a corner where its argument is zero.")
V(sp.limit((1 - sp.cos(4 * x)) / x**2, x, 0), 8)
M(LC, "formula", "moderate", "lim_{x→0} (1 − cos 4x)/x² equals",
  "8", ["4", "16", "2"], "1 − cos 4x = 2 sin²2x ≈ 8x².")
V(sp.limit(sp.sqrt(x**2 + 4 * x) - x, x, sp.oo), 2)
M(LC, "tough", "tough", "lim_{x→∞} (√(x² + 4x) − x) equals",
  "2", ["4", "0", "∞"], "Rationalise: 4x/(√(x² + 4x) + x) → 4/2.")
M(LC, "concept", "moderate", "f(x) = x|x| at x = 0 is",
  "differentiable, with f′(0) = 0", ["continuous but not differentiable", "discontinuous", "differentiable, with f′(0) = 1"], "(h|h|)/h = |h| → 0 from both sides.")

# ═════════════════════════ Three Dimensional Geometry ═════════════════════════
TD = "Three Dimensional Geometry"
M(TD, "formula", "easy", "The distance between (1, 2, 3) and (4, 6, 15) is",
  "13", ["12", "√13", "169"], "√(9 + 16 + 144).")
M(TD, "formula", "moderate", "The direction cosines of the line joining (1, 2, 3) and (3, 3, 5) are",
  "2/3, 1/3, 2/3", ["2, 1, 2", "1/3, 2/3, 2/3", "2/9, 1/9, 2/9"], "Direction ratios 2, 1, 2 with magnitude 3.")
M(TD, "tough", "tough", "The angle between the lines with direction ratios 1, 1, 0 and 0, 1, 1 is",
  "60°", ["90°", "45°", "30°"], "cos θ = 1/(√2·√2) = 1/2.")
M(TD, "formula", "moderate", "The point dividing the join of (2, 3, 4) and (5, 6, 7) internally in the ratio 2 : 1 is",
  "(4, 5, 6)", ["(3, 4, 5)", "(7/2, 9/2, 11/2)", "(8, 9, 10)"], "((2·5 + 1·2)/3, …).")
p1 = sp.Matrix([1, 2, 3]); d1 = sp.Matrix([1, 0, 0]); p2 = sp.Matrix([0, 0, 0]); d2_ = sp.Matrix([0, 1, 0])
sd = abs((p1 - p2).dot(d1.cross(d2_))) / d1.cross(d2_).norm(); V(sd, 3)
M(TD, "tough", "tough", "The shortest distance between the line through (1, 2, 3) along i and the line through the origin along j is",
  "3", ["1", "2", "√14"], "SD = |(p₁ − p₂)·(d₁ × d₂)|/|d₁ × d₂| = |(1, 2, 3)·(0, 0, 1)| = 3.")
M(TD, "concept", "moderate", "Two lines in space that are neither parallel nor intersecting are called",
  "skew lines", ["coplanar lines", "concurrent lines", "coincident lines"], "Skew lines do not lie in one plane.")
M(TD, "tough", "tough", "The line (x − 1)/2 = (y + 1)/3 = (z − 2)/4 passes through which point?",
  "(3, 2, 6)", ["(2, 3, 4)", "(1, 1, 2)", "(3, 2, 4)"], "Parameter 1: (1 + 2, −1 + 3, 2 + 4).")
M(TD, "formula", "moderate", "If a line makes angles α, β, γ with the axes, then cos²α + cos²β + cos²γ equals",
  "1", ["2", "0", "3"], "Direction cosines satisfy l² + m² + n² = 1 (so sin² terms sum to 2).")
s_, t_ = sp.symbols("s_ t_")
L1 = sp.Matrix([1 + 2 * s_, 2 + 3 * s_, 3 + 4 * s_]); L2 = sp.Matrix([4 + t_, 6 + t_, 8 + t_])
sl = sp.solve(list(L1 - L2), [s_, t_], dict=True); assert len(sl) == 1 and list(L1.subs(sl[0])) == [3, 5, 7]
M(TD, "tough", "tough", "The lines (x − 1)/2 = (y − 2)/3 = (z − 3)/4 and (x − 4)/1 = (y − 6)/1 = (z − 8)/1 intersect at",
  "(3, 5, 7)", ["(1, 2, 3)", "(4, 6, 8)", "(5, 8, 11)"], "(1 + 2s, 2 + 3s, 3 + 4s) = (4 + t, 6 + t, 8 + t): the first two give s = 1, t = −1, which also satisfies the third ⇒ (3, 5, 7).")
M(TD, "concept", "moderate", "The angle between two lines with direction ratios a₁, b₁, c₁ and a₂, b₂, c₂ is 90° exactly when",
  "a₁a₂ + b₁b₂ + c₁c₂ = 0", ["a₁/a₂ = b₁/b₂ = c₁/c₂", "a₁ + a₂ = 0", "a₁b₂ = a₂b₁"], "Their dot product must vanish (the second option is the condition for parallel lines).")

# ═════════════════════════ Permutations and Combinations ═════════════════════════
PC = "Permutations and Combinations"
V(sp.factorial(7) / (sp.factorial(2) * sp.factorial(2)), 1260)
M(PC, "formula", "moderate", "The number of arrangements of the letters of BALLOON is",
  "1260", ["5040", "2520", "630"], "7!/(2!·2!) — two L's and two O's.")
M(PC, "tough", "tough", "The number of ways 5 boys and 3 girls can sit in a row so that no two girls are together is",
  "14400", ["40320", "2880", "720"], "Arrange boys: 5!; choose and arrange girls in 6 gaps: ⁶P₃ = 120 ⇒ 120 × 120.")
V(sp.factorial(5) * sp.ff(6, 3), 14400)
M(PC, "formula", "moderate", "The number of diagonals of a decagon is",
  "35", ["45", "10", "90"], "C(10, 2) − 10.")
M(PC, "tough", "tough", "A committee of 5 is chosen from 6 men and 4 women with at least 2 women. The number of ways is",
  "186", ["252", "120", "66"], "C(4,2)C(6,3) + C(4,3)C(6,2) + C(4,4)C(6,1) = 120 + 60 + 6.")
V(sp.binomial(4, 2) * sp.binomial(6, 3) + sp.binomial(4, 3) * sp.binomial(6, 2) + sp.binomial(6, 1), 186)
M(PC, "formula", "moderate", "The number of ways 6 people can sit around a round table is",
  "120", ["720", "60", "360"], "(n − 1)! = 5!.")
M(PC, "tough", "tough", "The number of 4-digit numbers with distinct digits that can be formed from 0, 1, 2, 3, 4, 5 is",
  "300", ["360", "240", "1080"], "First digit 5 choices (not 0), then ⁵P₃ = 60.")
M(PC, "tough", "tough", "The number of non-negative integer solutions of a + b + c = 10 is",
  "66", ["55", "45", "120"], "Stars and bars: C(12, 2).")
V(sp.binomial(12, 2), 66)
M(PC, "formula", "moderate", "The number of triangles that can be formed from 12 points in a plane of which 5 are collinear is",
  "210", ["220", "200", "215"], "C(12, 3) − C(5, 3) = 220 − 10.")
M(PC, "tough", "tough", "In how many ways can 8 identical balls be put into 3 distinct boxes so that no box is empty?",
  "21", ["45", "28", "56"], "Positive solutions of a + b + c = 8: C(7, 2).")
M(PC, "concept", "moderate", "If ⁿC₈ = ⁿC₁₂, then n equals",
  "20", ["4", "96", "10"], "ⁿCᵣ = ⁿC_{n−r} ⇒ 8 + 12 = n.")

# ═════════════════════════ Indefinite Integrals ═════════════════════════
IN = "Indefinite Integrals"
def chk(F, f):
    assert sp.simplify(sp.diff(F, x) - f) == 0, (F, f)
chk(sp.tan(x) - x, sp.tan(x)**2)
M(IN, "formula", "moderate", "∫ tan²x dx equals",
  "tan x − x + C", ["sec²x + C", "tan x + x + C", "(tan³x)/3 + C"], "tan²x = sec²x − 1.")
chk(x * sp.log(x) - x, sp.log(x))
M(IN, "formula", "moderate", "∫ ln x dx equals",
  "x ln x − x + C", ["1/x + C", "x ln x + C", "(ln x)²/2 + C"], "By parts with u = ln x, dv = dx.")
chk(sp.exp(x) * sp.sin(x), sp.exp(x) * (sp.sin(x) + sp.cos(x)))
M(IN, "tough", "tough", "∫ eˣ(sin x + cos x) dx equals",
  "eˣ sin x + C", ["eˣ cos x + C", "eˣ(sin x − cos x) + C", "−eˣ cos x + C"], "∫eˣ(f + f′) dx = eˣf with f = sin x.")
chk(sp.Rational(1, 2) * sp.log((x - 1) / (x + 1)), 1 / (x**2 - 1))
M(IN, "formula", "moderate", "∫ dx/(x² − 1) equals",
  "½ ln|(x − 1)/(x + 1)| + C", ["½ ln|(x + 1)/(x − 1)| + C", "tan⁻¹x + C", "ln|x² − 1| + C"], "Partial fractions ½[1/(x − 1) − 1/(x + 1)].")
chk(sp.Rational(1, 2) * sp.atan(x / 2), 1 / (x**2 + 4))
M(IN, "formula", "easy", "∫ dx/(x² + 4) equals",
  "½ tan⁻¹(x/2) + C", ["tan⁻¹(x/2) + C", "2 tan⁻¹(x/2) + C", "½ ln(x² + 4) + C"], "∫dx/(x² + a²) = (1/a)tan⁻¹(x/a).")
chk(sp.Rational(1, 2) * sp.log(x**2 + 1), x / (x**2 + 1))
M(IN, "formula", "easy", "∫ x/(x² + 1) dx equals",
  "½ ln(x² + 1) + C", ["tan⁻¹x + C", "ln(x² + 1) + C", "x tan⁻¹x + C"], "Substitute u = x² + 1.")
chk(-sp.cos(x) + sp.cos(x)**3 / 3, sp.sin(x)**3)
M(IN, "tough", "tough", "∫ sin³x dx equals",
  "−cos x + (cos³x)/3 + C", ["(sin⁴x)/4 + C", "cos x − (cos³x)/3 + C", "−(cos⁴x)/4 + C"], "sin³x = sin x(1 − cos²x); put u = cos x.")
chk(x * sp.exp(x) - sp.exp(x), x * sp.exp(x))
M(IN, "formula", "moderate", "∫ x eˣ dx equals",
  "(x − 1)eˣ + C", ["xeˣ + C", "(x + 1)eˣ + C", "x²eˣ/2 + C"], "By parts.")
chk(sp.log(sp.log(x)), 1 / (x * sp.log(x)))
M(IN, "tough", "tough", "∫ dx/(x ln x) equals",
  "ln|ln x| + C", ["(ln x)²/2 + C", "1/ln x + C", "ln x + C"], "u = ln x, du = dx/x.")
chk(sp.asin(x / 3), 1 / sp.sqrt(9 - x**2))
M(IN, "formula", "easy", "∫ dx/√(9 − x²) equals",
  "sin⁻¹(x/3) + C", ["(1/3)sin⁻¹(x/3) + C", "3 sin⁻¹(x/3) + C", "ln|x + √(9 − x²)| + C"], "Standard form ∫dx/√(a² − x²).")

# ═════════════════════════ Sequences and Series ═════════════════════════
SS = "Sequences and Series"
M(SS, "formula", "easy", "The 20th term of the AP 3, 7, 11, … is",
  "79", ["83", "80", "76"], "a + 19d = 3 + 76.")
M(SS, "tough", "tough", "The sum of all two-digit numbers divisible by 3 is",
  "1665", ["1683", "1584", "1500"], "12, 15, …, 99: 30 terms, sum = 30(12 + 99)/2.")
assert sum(range(12, 100, 3)) == 1665
M(SS, "formula", "moderate", "The sum to infinity of 1 + 1/3 + 1/9 + … is",
  "3/2", ["3", "4/3", "2"], "a/(1 − r) = 1/(2/3).")
M(SS, "tough", "tough", "The AM and GM of two positive numbers are 10 and 8. The numbers are",
  "16 and 4", ["12 and 8", "18 and 2", "14 and 6"], "a + b = 20, ab = 64.")
M(SS, "formula", "moderate", "1² + 2² + … + 10² equals",
  "385", ["355", "505", "100"], "n(n + 1)(2n + 1)/6 = 10·11·21/6.")
M(SS, "formula", "moderate", "1³ + 2³ + … + 10³ equals",
  "3025", ["2025", "385", "1000"], "(n(n + 1)/2)² = 55².")
V(sp.summation(1 / (n * (n + 1)), (n, 1, 20)), Rt(20, 21))
M(SS, "tough", "tough", "1/(1·2) + 1/(2·3) + … + 1/(20·21) equals",
  "20/21", ["1/21", "21/20", "19/20"], "Telescoping: 1 − 1/21.")
M(SS, "tough", "tough", "If the pth, qth and rth terms of a GP are a, b, c, then a^{q−r} b^{r−p} c^{p−q} equals",
  "1", ["0", "abc", "pqr"], "Write each as AR^{k−1}; the powers of A and R both cancel.")
M(SS, "tough", "tough", "Three numbers in AP have sum 15 and product 80. The numbers are",
  "2, 5, 8", ["3, 5, 7", "1, 5, 9", "4, 5, 6"], "a − d, a, a + d: a = 5, (25 − d²)5 = 80 ⇒ d = ±3.")
M(SS, "formula", "moderate", "The number of terms of the AP 5, 8, 11, … needed for a sum of 98 is",
  "7", ["8", "6", "14"], "n/2[10 + 3(n − 1)] = 98 ⇒ 3n² + 7n − 196 = 0 ⇒ n = 7.")

# ═════════════════════════ Matrices, Complex, Sets (top-up) ═════════════════════════
MD = "Matrices and Determinants"
A2 = sp.Matrix([[2, 1], [1, 1]]); V(A2.inv()[0, 0], 1)
M(MD, "formula", "moderate", "The inverse of [[2, 1], [1, 1]] is",
  "[[1, −1], [−1, 2]]", ["[[1, 1], [1, 2]]", "[[−1, 1], [1, −2]]", "[[2, −1], [−1, 1]]"], "det = 1; swap the diagonal, negate the off-diagonal.")
M(MD, "tough", "tough", "If A is a 3 × 3 matrix with |A| = 4, then |adj A| equals",
  "16", ["4", "64", "12"], "|adj A| = |A|^{n−1} = 4².")
M(MD, "tough", "tough", "If A is 3 × 3 with |A| = 2, then |3A| equals",
  "54", ["6", "18", "8"], "|kA| = kⁿ|A| = 27 × 2.")
V(sp.Matrix([[1, 1, 1], [1, 2, 3], [1, 4, 9]]).det(), 2)
M(MD, "formula", "moderate", "The value of the determinant |1 1 1; 1 2 3; 1 4 9| is",
  "2", ["0", "6", "4"], "Vandermonde (b − a)(c − a)(c − b) with a, b, c = 1, 2, 3.")
M(MD, "tough", "tough", "The system x + y + z = 3, x + 2y + 3z = 6, x + 4y + kz = 9 has a unique solution when",
  "k ≠ 7", ["k = 7", "k ≠ 9", "for all k"], "det = k − 7 (from |1 1 1; 1 2 3; 1 4 k|) must be non-zero.")
kk = sp.symbols("kk"); V(sp.solve(sp.Matrix([[1, 1, 1], [1, 2, 3], [1, 4, kk]]).det(), kk)[0], 7)
CN = "Complex Numbers and Quadratic Equations"
M(CN, "formula", "moderate", "The modulus of (3 + 4i)/(1 − i) is",
  "5/√2", ["5", "5√2", "7/√2"], "|z₁/z₂| = 5/√2.")
M(CN, "tough", "tough", "If one root of x² − 6x + k = 0 is 3 + 2i (k real), then k equals",
  "13", ["9", "5", "−13"], "The other root is 3 − 2i; product = 9 + 4.")
M(CN, "tough", "tough", "The values of k for which x² + kx + 9 = 0 has equal roots are",
  "±6", ["±3", "±9", "6 only"], "k² = 36.")
M(CN, "tough", "tough", "The roots of x² − (k + 1)x + k = 0 are both positive. The condition on k is",
  "k > 0", ["k < 0", "k > 1", "−1 < k < 0"], "Roots are 1 and k.")
SR = "Sets, Relations and Functions"
M(SR, "formula", "easy", "If n(A) = 40, n(B) = 30 and n(A ∩ B) = 10, then n(A ∪ B) is",
  "60", ["70", "80", "50"], "40 + 30 − 10.")
M(SR, "tough", "tough", "The number of functions from a set with 3 elements to a set with 2 elements that are NOT onto is",
  "2", ["6", "8", "0"], "Total 2³ = 8; onto ones = 8 − 2 = 6; the 2 constant maps are not onto.")
M(SR, "tough", "tough", "If f(x) = 2x + 3 and g(x) = x², then (f ∘ g)(2) − (g ∘ f)(2) equals",
  "−38", ["38", "0", "−11"], "f(g(2)) = 11; g(f(2)) = 49.")
