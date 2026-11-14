"""Batch 3 — JEE Mathematics. Each answer is checked with sympy (V(...) asserts) where it can be."""
import itertools
import sympy as sp
from qlib import mcq

S = "Mathematics"
x, y, t, n = sp.symbols("x y t n", real=True)
def M(chap, cat, diff, text, correct, wrongs, expl):
    mcq("JEE", S, chap, cat, diff, text, correct, wrongs, expl)
def V(a, b):
    d = sp.simplify(sp.nsimplify(a) - sp.nsimplify(b))
    assert d == 0 or abs(sp.N(d, 30)) < 1e-20, (a, b)
pi, sqrt, Rt = sp.pi, sp.sqrt, sp.Rational

# ---------------- Sets, Relations and Functions ----------------
V(2 ** (4 * 4 - 4), 4096)
M("Sets, Relations and Functions", "tough", "tough", "The number of reflexive relations on a set with 4 elements is",
  "4096", ["65536", "1024", "256"], "A reflexive relation must contain all 4 pairs (a, a); each of the other 16 − 4 = 12 pairs may or may not be included: 2¹² = 4096.")
V(2 ** 6, 64)
M("Sets, Relations and Functions", "tough", "tough", "The number of symmetric relations on a set with 3 elements is",
  "64", ["512", "8", "27"], "Choose freely the 3 diagonal pairs and the 3 unordered pairs {a, b}: 2^(3 + 3) = 64.")
V(3 ** 4 - 3 * 2 ** 4 + 3, 36)
M("Sets, Relations and Functions", "tough", "tough", "The number of onto functions from a set of 4 elements to a set of 3 elements is",
  "36", ["81", "24", "64"], "By inclusion–exclusion: 3⁴ − C(3,1)2⁴ + C(3,2)1⁴ = 81 − 48 + 3 = 36.")
M("Sets, Relations and Functions", "tough", "tough", "The domain of f(x) = 1/√(x² − 5x + 6) is",
  "(−∞, 2) ∪ (3, ∞)", ["[2, 3]", "(2, 3)", "(−∞, 2] ∪ [3, ∞)"], "Need x² − 5x + 6 > 0, i.e. (x − 2)(x − 3) > 0, so x < 2 or x > 3 (strict, since it is under a root in the denominator).")
f = (x**2 + x + 1) / (x**2 - x + 1)
crit = sp.solve(sp.diff(f, x), x); V(min(f.subs(x, c) for c in crit), Rt(1, 3)); V(max(f.subs(x, c) for c in crit), 3)
M("Sets, Relations and Functions", "tough", "tough", "The range of f(x) = (x² + x + 1)/(x² − x + 1), x ∈ ℝ, is",
  "[1/3, 3]", ["(1/3, 3)", "[1, 3]", "ℝ"], "Put y = f(x): (y − 1)x² − (y + 1)x + (y − 1) = 0 must have real x, so (y + 1)² ≥ 4(y − 1)², giving 1/3 ≤ y ≤ 3 (both values are attained at x = −1 and x = 1).")
g = (2 * x + 1) / (3 * x - 2); V(g.subs(x, g), x)
M("Sets, Relations and Functions", "tough", "tough", "For f(x) = (2x + 1)/(3x − 2), x ≠ 2/3, the inverse function f⁻¹(x) is",
  "(2x + 1)/(3x − 2)", ["(2x − 1)/(3x + 2)", "(3x − 2)/(2x + 1)", "(2x + 1)/(2 − 3x)"], "Solving y = (2x + 1)/(3x − 2) for x gives x = (2y + 1)/(3y − 2): the function is its own inverse (f(f(x)) = x).")
M("Sets, Relations and Functions", "concept", "moderate", "On ℤ, define aRb if a − b is divisible by 5. Then R is",
  "an equivalence relation with 5 equivalence classes", ["reflexive and symmetric but not transitive", "an equivalence relation with infinitely many classes", "a partial order"],
  "R is reflexive, symmetric and transitive; the classes are the residues 0, 1, 2, 3, 4 mod 5.")
M("Sets, Relations and Functions", "formula", "moderate", "If n(A) = 3 and n(B) = 5, the number of one-one functions from A to B is",
  "60", ["125", "15", "243"], "⁵P₃ = 5 × 4 × 3 = 60.")

# ---------------- Complex Numbers and Quadratic Equations ----------------
z = (1 + sp.I) / (1 - sp.I); V(sp.simplify(z**100), 1)
M("Complex Numbers and Quadratic Equations", "formula", "moderate", "If z = (1 + i)/(1 − i), then z¹⁰⁰ equals",
  "1", ["−1", "i", "−i"], "z = (1 + i)²/2 = i, and i¹⁰⁰ = (i⁴)²⁵ = 1.")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "The principal argument of (1 + i√3)/(1 − i) is",
  "7π/12", ["π/12", "−π/12", "5π/12"], "arg(1 + i√3) = π/3, arg(1 − i) = −π/4. Difference = π/3 + π/4 = 7π/12, which lies in (−π, π].")
w = sp.Rational(-1, 2) + sp.sqrt(3) * sp.I / 2
V(sp.expand((1 + w - w**2)**3 + (1 - w + w**2)**3), -16)
M("Complex Numbers and Quadratic Equations", "tough", "tough", "If ω is a non-real cube root of unity, then (1 + ω − ω²)³ + (1 − ω + ω²)³ equals",
  "−16", ["16", "0", "−8"], "1 + ω = −ω², so 1 + ω − ω² = −2ω²; similarly 1 − ω + ω² = −2ω. Sum = −8ω⁶ − 8ω³ = −8 − 8 = −16.")
V(sp.expand(((1 + w) * (1 + w**2) * (1 + w**4) * (1 + w**8))), 1)
M("Complex Numbers and Quadratic Equations", "tough", "tough", "If ω is a non-real cube root of unity, then (1 + ω)(1 + ω²)(1 + ω⁴)(1 + ω⁸) equals",
  "1", ["0", "−1", "2"], "ω⁴ = ω and ω⁸ = ω², so the product is [(1 + ω)(1 + ω²)]² = (1 + ω + ω² + 1)² = 1² = 1.")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "If α and β are roots of x² − 6x + 4 = 0, then α/β + β/α equals",
  "7", ["9", "11", "8"], "α + β = 6, αβ = 4. α² + β² = 36 − 8 = 28. α/β + β/α = 28/4 = 7.")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "If α and β are roots of x² − 6x + 4 = 0, then α³ + β³ equals",
  "144", ["216", "72", "168"], "α³ + β³ = (α + β)³ − 3αβ(α + β) = 216 − 72 = 144.")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "The number of real roots of x² − 3|x| + 2 = 0 is",
  "4", ["2", "3", "1"], "Put |x| = t ≥ 0: t² − 3t + 2 = 0 → t = 1 or 2 → x = ±1, ±2.")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "The locus of z satisfying |z − 2| = |z + 2i| is the line",
  "x + y = 0", ["x − y = 0", "x + y = 2", "x = 2"], "(x − 2)² + y² = x² + (y + 2)² → −4x + 4 = 4y + 4 → y = −x (perpendicular bisector of 2 and −2i).")
M("Complex Numbers and Quadratic Equations", "tough", "tough", "Both roots of x² − 2kx + k² + k − 5 = 0 are real and greater than 1 exactly when",
  "(1 + √17)/2 < k ≤ 5", ["1 < k ≤ 5", "k ≤ 5", "k > (1 + √17)/2"],
  "Need D ≥ 0: 20 − 4k ≥ 0 → k ≤ 5; vertex k > 1; f(1) = k² − k − 4 > 0 → k > (1 + √17)/2 (≈ 2.56). Together: (1 + √17)/2 < k ≤ 5.")
M("Complex Numbers and Quadratic Equations", "concept", "moderate", "For the quadratic ax² + bx + c = 0 with real coefficients, if one root is 2 + 3i, the other root is",
  "2 − 3i", ["−2 + 3i", "3 + 2i", "−2 − 3i"], "Non-real roots of a real-coefficient polynomial occur in conjugate pairs.")
M("Complex Numbers and Quadratic Equations", "formula", "moderate", "The modulus of (3 + 4i)(1 − i) is",
  "5√2", ["7", "10", "5"], "|z₁z₂| = |z₁||z₂| = 5 × √2.")

# ---------------- Matrices and Determinants ----------------
M("Matrices and Determinants", "tough", "tough", "If A is a 3 × 3 matrix with |A| = 2, then |adj(adj A)| equals",
  "16", ["4", "8", "256"], "|adj A| = |A|^(n−1) = 4. |adj(adj A)| = |adj A|^(n−1) = 4² = 16 (= |A|^((n−1)²)).")
A = sp.Matrix([[3, 1], [-1, 2]]); V((A**2 - 5 * A + 7 * sp.eye(2)).norm(), 0)
assert A.inv() == (5 * sp.eye(2) - A) / 7
M("Matrices and Determinants", "tough", "tough", "For A = [[3, 1], [−1, 2]] (rows written in brackets), A² − 5A + 7I = O. Hence A⁻¹ equals",
  "(1/7)[[2, −1], [1, 3]]", ["(1/7)[[3, 1], [−1, 2]]", "(1/7)[[−2, 1], [−1, −3]]", "[[2, −1], [1, 3]]"],
  "Multiply A² − 5A + 7I = O by A⁻¹: A − 5I + 7A⁻¹ = O → A⁻¹ = (5I − A)/7 = (1/7)[[2, −1], [1, 3]].")
M("Matrices and Determinants", "tough", "tough", "The system x + y + z = 6, x + 2y + 3z = 10, x + 2y + λz = μ has infinitely many solutions when",
  "λ = 3 and μ = 10", ["λ = 3 and μ ≠ 10", "λ ≠ 3", "λ = 10 and μ = 3"],
  "Subtracting the second equation from the third: (λ − 3)z = μ − 10. Infinitely many solutions need 0 = 0, i.e. λ = 3, μ = 10.")
mats = [sp.Matrix(2, 2, e) for e in itertools.product([0, 1], repeat=4)]
assert sum(1 for m_ in mats if m_.det() != 0) == 6
M("Matrices and Determinants", "tough", "tough", "How many 2 × 2 matrices with every entry 0 or 1 are invertible?",
  "6", ["8", "10", "4"], "det = ad − bc ≠ 0 needs exactly one of ad, bc to be 1: (ad = 1, bc = 0) gives 3 choices, and (bc = 1, ad = 0) gives 3. Total 6 of the 16.")
a, b, c = sp.symbols("a b c")
V(sp.Matrix([[1, a, a**2], [1, b, b**2], [1, c, c**2]]).det(), (a - b) * (b - c) * (c - a))
M("Matrices and Determinants", "tough", "tough", "The determinant with rows (1, a, a²), (1, b, b²), (1, c, c²) equals",
  "(a − b)(b − c)(c − a)", ["(a + b)(b + c)(c + a)", "abc", "(a − b)(b − c)(a − c)"], "Subtract rows to take out (b − a) and (c − a), then expand: the Vandermonde determinant (a − b)(b − c)(c − a).")
B2 = sp.Matrix([[2, 3], [1, 4]]); V((B2**2 - 6 * B2).det(), 25)
M("Matrices and Determinants", "tough", "tough", "For A = [[2, 3], [1, 4]], the value of det(A² − 6A) is",
  "25", ["−25", "5", "0"], "By Cayley–Hamilton, A² − 6A + 5I = O (trace 6, det 5), so A² − 6A = −5I and det(−5I) = 25.")
M("Matrices and Determinants", "concept", "moderate", "The determinant of every 3 × 3 skew-symmetric matrix is",
  "0", ["1", "−1", "the product of its diagonal entries squared"], "|A| = |Aᵀ| = |−A| = (−1)³|A| → |A| = 0.")
M("Matrices and Determinants", "formula", "moderate", "If A is a 3 × 3 matrix and |A| = 4, then |3A| equals",
  "108", ["12", "36", "64"], "|kA| = kⁿ|A| = 27 × 4 = 108.")

# ---------------- Permutations and Combinations ----------------
M("Permutations and Combinations", "tough", "tough", "The number of arrangements of the letters of ASSASSIN in which no two S's are together is",
  "60", ["120", "24", "360"], "Arrange A, A, I, N: 4!/2! = 12 ways. Choose 4 of the 5 gaps for the identical S's: C(5, 4) = 5. Total 60.")
V(sp.factorial(11) / (sp.factorial(4)**2 * sp.factorial(2)), 34650)
M("Permutations and Combinations", "formula", "moderate", "The number of distinct arrangements of the letters of MISSISSIPPI is",
  "34650", ["39916800", "69300", "1663200"], "11!/(4! 4! 2!) = 34650 (I and S four times each, P twice).")
V(sp.binomial(10, 5) - sp.binomial(6, 5) - 4 * sp.binomial(6, 4), 186)
M("Permutations and Combinations", "tough", "tough", "A committee of 5 is chosen from 6 men and 4 women. The number of committees with at least 2 women is",
  "186", ["192", "252", "180"], "Total C(10,5) = 252. Subtract all-men C(6,5) = 6 and one-woman C(4,1)C(6,4) = 60: 252 − 66 = 186.")
M("Permutations and Combinations", "formula", "moderate", "The number of diagonals of a 12-sided polygon is",
  "54", ["66", "132", "48"], "C(12,2) − 12 = 66 − 12 = 54.")
V(sp.factorial(5) * sp.binomial(6, 3) * sp.factorial(3), 14400)
M("Permutations and Combinations", "tough", "tough", "5 boys and 3 girls stand in a row so that no two girls are together. The number of arrangements is",
  "14400", ["2880", "40320", "7200"], "Arrange boys: 5! = 120; choose 3 of 6 gaps and arrange girls: ⁶P₃ = 120. Total 14400.")
V(sp.binomial(12, 3) - sp.binomial(5, 3), 210)
M("Permutations and Combinations", "tough", "tough", "There are 12 points in a plane, of which exactly 5 are collinear. The number of triangles that can be formed is",
  "210", ["220", "200", "215"], "C(12,3) − C(5,3) = 220 − 10 = 210.")
M("Permutations and Combinations", "tough", "tough", "The number of non-negative integer solutions of x + y + z = 10 is",
  "66", ["55", "36", "120"], "Stars and bars: C(10 + 2, 2) = 66.")
M("Permutations and Combinations", "concept", "moderate", "The value of ⁿCᵣ + ⁿCᵣ₋₁ equals",
  "ⁿ⁺¹Cᵣ", ["ⁿ⁺¹Cᵣ₊₁", "ⁿCᵣ₊₁", "²ⁿCᵣ"], "Pascal's rule.")

# ---------------- Binomial Theorem ----------------
V(sp.expand((1 + 2 * x)**8).coeff(x, 5), 1792)
M("Binomial Theorem", "formula", "moderate", "The coefficient of x⁵ in (1 + 2x)⁸ is",
  "1792", ["56", "448", "3584"], "C(8,5) × 2⁵ = 56 × 32 = 1792.")
V(sp.expand((x**2 - 2 / x)**9 * x**0).as_coefficients_dict()[1], 5376)
M("Binomial Theorem", "tough", "tough", "The term independent of x in (x² − 2/x)⁹ is",
  "5376", ["−5376", "672", "−672"], "T(r+1) = C(9,r)(x²)^(9−r)(−2/x)^r; power 18 − 3r = 0 → r = 6. Term = C(9,6)(−2)⁶ = 84 × 64 = 5376.")
V(sp.expand((x / 2 + 2 / x)**8).as_coefficients_dict()[1], 70)
M("Binomial Theorem", "tough", "tough", "The middle term of (x/2 + 2/x)⁸ is",
  "70", ["70x", "35", "140"], "Middle term T₅ = C(8,4)(x/2)⁴(2/x)⁴ = 70.")
V(sp.Mod(7**103, 25), 18)
M("Binomial Theorem", "tough", "tough", "The remainder when 7¹⁰³ is divided by 25 is",
  "18", ["7", "24", "1"], "7² = 49 = 50 − 1. 7¹⁰³ = 7(50 − 1)⁵¹ ≡ 7(−1)⁵¹ = −7 ≡ 18 (mod 25).")
M("Binomial Theorem", "formula", "moderate", "The sum of the coefficients in the expansion of (3x − 2)¹⁰ is",
  "1", ["2¹⁰", "5¹⁰", "0"], "Put x = 1: (3 − 2)¹⁰ = 1.")
M("Binomial Theorem", "tough", "tough", "The number of terms in the expansion of (1 + 2x + x²)¹⁰ is",
  "21", ["11", "30", "20"], "(1 + 2x + x²)¹⁰ = (1 + x)²⁰, which has 21 terms.")

# ---------------- Sequences and Series ----------------
M("Sequences and Series", "tough", "tough", "The sum of the first n terms of an AP is 3n² + 5n. Its 20th term is",
  "122", ["1300", "125", "117"], "aₙ = Sₙ − Sₙ₋₁ = 6n + 2; a₂₀ = 122.")
M("Sequences and Series", "tough", "tough", "The minimum value of 4ˣ + 4¹⁻ˣ for real x is",
  "4", ["2", "5", "8"], "AM ≥ GM: 4ˣ + 4¹⁻ˣ ≥ 2√(4ˣ × 4¹⁻ˣ) = 2√4 = 4, with equality at x = 1/2.")
V(sp.summation(t * (t + 1), (t, 1, 20)), 3080)
M("Sequences and Series", "tough", "tough", "The sum 1·2 + 2·3 + 3·4 + … + 20·21 equals",
  "3080", ["2870", "3090", "4620"], "Σk(k + 1) = n(n + 1)(n + 2)/3 = 20 × 21 × 22/3 = 3080.")
M("Sequences and Series", "tough", "tough", "Three positive numbers in GP have product 1000 and sum 35. The largest of them is",
  "20", ["25", "10", "15"], "Middle term = ∛1000 = 10. The others satisfy p + q = 25, pq = 100 → 5 and 20.")
M("Sequences and Series", "formula", "moderate", "The sum of the infinite GP 3 + 1 + 1/3 + 1/9 + … is",
  "9/2", ["4", "3", "6"], "S = a/(1 − r) = 3/(2/3) = 9/2.")
M("Sequences and Series", "formula", "moderate", "Three arithmetic means are inserted between 3 and 19. They are",
  "7, 11, 15", ["5, 9, 13", "6, 10, 14", "4, 8, 12"], "19 = 3 + 4d → d = 4.")
V(sp.summation(t**2, (t, 1, 10)), 385)
M("Sequences and Series", "tough", "tough", "If the sum of the squares of the first n natural numbers is 385, then n is",
  "10", ["11", "9", "12"], "n(n + 1)(2n + 1)/6 = 385 → n = 10 (10 × 11 × 21/6 = 385).")

# ---------------- Limits, Continuity and Differentiability ----------------
lims = [
 ((1 - sp.cos(2 * x)) / x**2, 0, "2", ["1", "1/2", "4"], "lim (x→0) (1 − cos 2x)/x² is", "1 − cos 2x = 2 sin²x, so the limit is 2 × 1 = 2.", "formula"),
 ((1 + 3 / x)**(2 * x), sp.oo, "e⁶", ["e³", "e^(3/2)", "e²"], "lim (x→∞) (1 + 3/x)^(2x) is", "Form 1^∞: limit = e^(lim 2x × 3/x) = e⁶.", "tough"),
 ((sp.exp(3 * x) - 1) / sp.sin(2 * x), 0, "3/2", ["2/3", "3", "1"], "lim (x→0) (e^(3x) − 1)/sin 2x is", "≈ 3x/2x = 3/2.", "tough"),
 ((sp.tan(x) - sp.sin(x)) / x**3, 0, "1/2", ["0", "1", "1/3"], "lim (x→0) (tan x − sin x)/x³ is", "tan x − sin x = tan x(1 − cos x) ≈ x × x²/2, so the limit is 1/2.", "tough"),
 ((x**7 - 1) / (x - 1), 1, "7", ["6", "1", "0"], "lim (x→1) (x⁷ − 1)/(x − 1) is", "Standard limit nx^(n−1) at x = 1: 7.", "formula"),
 ((sp.sqrt(1 + x) - sp.sqrt(1 - x)) / x, 0, "1", ["0", "1/2", "2"], "lim (x→0) [√(1 + x) − √(1 − x)]/x is", "Rationalise: 2x/[x(√(1 + x) + √(1 − x))] → 2/2 = 1.", "tough"),
 ((x - sp.sin(x)) / x**3, 0, "1/6", ["1/3", "0", "1/2"], "lim (x→0) (x − sin x)/x³ is", "sin x = x − x³/6 + …, so x − sin x ≈ x³/6.", "tough"),
]
for expr, pt, ans, wr, q, ex, cat in lims:
    V(sp.limit(expr, x, pt), sp.sympify(ans.replace("e⁶", "exp(6)").replace("²", "**2")))
    M("Limits, Continuity and Differentiability", cat, "tough" if cat == "tough" else "moderate", q, ans, wr, ex)
M("Limits, Continuity and Differentiability", "tough", "tough", "f(x) = (sin 3x)/x for x ≠ 0 and f(0) = k. For f to be continuous at x = 0, k must be",
  "3", ["1", "1/3", "0"], "lim (x→0) sin 3x/x = 3, so k = 3.")
M("Limits, Continuity and Differentiability", "concept", "moderate", "The function f(x) = x|x| is",
  "differentiable everywhere, including at x = 0", ["continuous but not differentiable at x = 0", "discontinuous at x = 0", "not continuous anywhere"],
  "f(x) = x² for x ≥ 0 and −x² for x < 0; both one-sided derivatives at 0 are 0.")
M("Limits, Continuity and Differentiability", "concept", "moderate", "Which statement is true?",
  "Every differentiable function is continuous, but a continuous function need not be differentiable", ["Every continuous function is differentiable", "A discontinuous function can be differentiable", "|x| is differentiable at 0"],
  "|x| is continuous at 0 but has a corner there.")

# ---------------- Differentiation ----------------
V(sp.diff(x**x, x).subs(x, 1), 1)
M("Differentiation", "tough", "tough", "The derivative of xˣ at x = 1 is", "1", ["0", "e", "2"], "d/dx xˣ = xˣ(ln x + 1); at x = 1 this is 1 × (0 + 1) = 1.")
M("Differentiation", "tough", "tough", "If x = a cos³t and y = a sin³t, then dy/dx equals",
  "−tan t", ["tan t", "−cot t", "−tan²t"], "dy/dt = 3a sin²t cos t, dx/dt = −3a cos²t sin t; ratio = −tan t.")
M("Differentiation", "tough", "tough", "For |x| < 1, the derivative of sin⁻¹(2x/(1 + x²)) is",
  "2/(1 + x²)", ["1/(1 + x²)", "−2/(1 + x²)", "2/√(1 − x²)"], "With x = tan θ, the function is 2θ = 2tan⁻¹x for |x| < 1; derivative 2/(1 + x²).")
V(sp.diff(sp.log(1 / sp.cos(x) + sp.tan(x)), x) - 1 / sp.cos(x), 0)
M("Differentiation", "formula", "moderate", "The derivative of log(sec x + tan x) is", "sec x", ["tan x", "sec x tan x", "sec²x"], "(sec x tan x + sec²x)/(sec x + tan x) = sec x.")
V(sp.diff(x**3 * sp.log(x), x, 2).subs(x, 1), 5)
M("Differentiation", "tough", "tough", "If y = x³ ln x, then d²y/dx² at x = 1 equals", "5", ["3", "6", "1"], "y′ = 3x² ln x + x², y″ = 6x ln x + 5x; at x = 1: 5.")
M("Differentiation", "tough", "tough", "If x² + xy + y² = 7, then dy/dx at (1, 2) is",
  "−4/5", ["4/5", "−5/4", "−1"], "2x + y + xy′ + 2yy′ = 0 → 4 + 5y′ = 0 → y′ = −4/5.")

# ---------------- Application of Derivatives ----------------
M("Application of Derivatives", "tough", "tough", "The tangent to y = x³ − 3x + 2 at x = 2 is",
  "y = 9x − 14", ["y = 9x − 4", "y = 3x − 2", "y = 9x + 4"], "y(2) = 4, y′ = 3x² − 3 = 9. Tangent: y − 4 = 9(x − 2).")
M("Application of Derivatives", "formula", "moderate", "The radius of a spherical balloon increases at 2 cm/s. When r = 5 cm, the volume increases at",
  "200π cm³/s", ["100π cm³/s", "50π cm³/s", "40π cm³/s"], "dV/dt = 4πr² dr/dt = 4π × 25 × 2 = 200π.")
M("Application of Derivatives", "tough", "tough", "f(x) = x³ − 6x² + 9x + 1 is strictly decreasing on",
  "(1, 3)", ["(−∞, 1)", "(3, ∞)", "(0, 2)"], "f′ = 3(x − 1)(x − 3) < 0 for 1 < x < 3.")
M("Application of Derivatives", "tough", "tough", "The maximum area of a rectangle inscribed in a circle of radius r is",
  "2r²", ["r²", "πr²/2", "4r²"], "Sides 2r cos θ, 2r sin θ: area 2r² sin 2θ, maximum 2r² (a square).")
M("Application of Derivatives", "tough", "tough", "The minimum value of x² + 16/x² (x ≠ 0) is",
  "8", ["4", "16", "10"], "AM ≥ GM: x² + 16/x² ≥ 2 × 4 = 8, at x² = 4.")
M("Application of Derivatives", "tough", "tough", "The equation of the normal to y = x² at (1, 1) is",
  "x + 2y = 3", ["2x + y = 3", "x − 2y + 1 = 0", "y = 2x − 1"], "Slope of tangent 2, normal −1/2: y − 1 = −(x − 1)/2 → x + 2y = 3.")
M("Application of Derivatives", "formula", "moderate", "The maximum value of 3 sin x + 4 cos x is",
  "5", ["7", "4", "√7"], "a sin x + b cos x has maximum √(a² + b²) = 5.")
V(sp.Matrix([sp.diff(x**3 - 3 * x, x)]).subs(x, -1)[0], 0)
M("Application of Derivatives", "tough", "tough", "The local maximum value of f(x) = x³ − 3x is",
  "2", ["−2", "0", "1"], "f′ = 3(x² − 1) = 0 at x = ±1; f″(−1) = −6 < 0, so local max f(−1) = −1 + 3 = 2.")

# ---------------- Integrals ----------------
ints = [
 (1 / (x**2 + 4 * x + 13), "(1/3) tan⁻¹((x + 2)/3) + C", sp.atan((x + 2) / 3) / 3, ["tan⁻¹((x + 2)/3) + C", "(1/3) tan⁻¹(x + 2) + C", "(1/9) tan⁻¹((x + 2)/3) + C"], "∫ dx/(x² + 4x + 13) equals", "Complete the square: (x + 2)² + 9, then ∫dx/(u² + a²) = (1/a)tan⁻¹(u/a)."),
 (sp.exp(x) * (sp.sin(x) + sp.cos(x)), "eˣ sin x + C", sp.exp(x) * sp.sin(x), ["eˣ cos x + C", "eˣ(sin x − cos x) + C", "−eˣ sin x + C"], "∫ eˣ(sin x + cos x) dx equals", "∫eˣ[f(x) + f′(x)]dx = eˣf(x) + C with f = sin x."),
 (x * sp.exp(x), "eˣ(x − 1) + C", sp.exp(x) * (x - 1), ["eˣ(x + 1) + C", "xeˣ + C", "x²eˣ/2 + C"], "∫ x eˣ dx equals", "By parts: xeˣ − ∫eˣdx."),
 (sp.log(x), "x ln x − x + C", x * sp.log(x) - x, ["1/x + C", "x ln x + C", "ln x − x + C"], "∫ ln x dx equals", "By parts with u = ln x, dv = dx."),
 (1 / sp.sqrt(9 - x**2), "sin⁻¹(x/3) + C", sp.asin(x / 3), ["(1/3) sin⁻¹(x/3) + C", "sin⁻¹(3x) + C", "cos⁻¹(x/3) + C"], "∫ dx/√(9 − x²) equals", "Standard form ∫dx/√(a² − x²) = sin⁻¹(x/a)."),
]
for f_, ans, prim, wr, q, ex in ints:
    V(sp.simplify(sp.diff(prim, x) - f_), 0)
    M("Indefinite Integrals", "formula" if "ln x" in ans or "sin⁻¹" in ans else "tough", "moderate" if ("ln x" in ans or "sin⁻¹" in ans) else "tough", q, ans, wr, ex)
M("Indefinite Integrals", "tough", "tough", "∫ dx/[x(x + 1)] equals",
  "ln|x/(x + 1)| + C", ["ln|x(x + 1)| + C", "ln|(x + 1)/x| + C", "1/(x + 1) + C"], "Partial fractions: 1/x − 1/(x + 1).")
M("Indefinite Integrals", "tough", "tough", "∫ sec²x/(1 + tan x) dx equals",
  "ln|1 + tan x| + C", ["tan x + C", "1/(1 + tan x) + C", "ln|sec x| + C"], "Put u = 1 + tan x, du = sec²x dx.")
defs = [
 (sp.sin(x)**2, 0, pi / 2, "π/4", ["π/2", "1/2", "π"], "∫₀^(π/2) sin²x dx equals", "Use sin²x = (1 − cos 2x)/2.", "formula"),
 (x**3 * sp.cos(x), -1, 1, "0", ["2 sin 1", "1", "2"], "∫₋₁¹ x³ cos x dx equals", "The integrand is odd, so the integral over [−1, 1] is 0.", "tough"),
 (x * sp.sin(x)**2, 0, pi, "π²/4", ["π²/2", "π/2", "π²"], "∫₀^π x sin²x dx equals", "Use I = ∫(π − x)sin²x dx → 2I = π∫₀^π sin²x dx = π²/2.", "tough"),
 (sp.Abs(x - 1), 0, 2, "1", ["0", "2", "1/2"], "∫₀² |x − 1| dx equals", "Two triangles each of area 1/2.", "tough"),
 (x * (1 - x)**9, 0, 1, "1/110", ["1/90", "1/10", "1/100"], "∫₀¹ x(1 − x)⁹ dx equals", "Use ∫₀¹f(x)dx = ∫₀¹f(1 − x)dx: ∫(1 − x)x⁹dx = 1/10 − 1/11 = 1/110.", "tough"),
 (sp.log(x), 1, sp.E, "1", ["e", "e − 1", "0"], "∫₁^e ln x dx equals", "[x ln x − x] from 1 to e = (e − e) − (0 − 1) = 1.", "formula"),
]
for f_, lo, hi, ans, wr, q, ex, cat in defs:
    V(sp.integrate(f_, (x, lo, hi)), sp.sympify(ans.replace("π", "pi").replace("²", "**2")))
    M("Definite Integrals", cat, "tough" if cat == "tough" else "moderate", q, ans, wr, ex)
M("Definite Integrals", "tough", "tough", "∫₀^(π/2) √(sin x)/(√(sin x) + √(cos x)) dx equals",
  "π/4", ["π/2", "1", "0"], "Using x → π/2 − x and adding: 2I = ∫₀^(π/2) dx = π/2.")
M("Definite Integrals", "tough", "tough", "∫₀³ [x] dx, where [x] is the greatest integer function, equals",
  "3", ["6", "4.5", "2"], "0 on [0,1), 1 on [1,2), 2 on [2,3): 0 + 1 + 2 = 3.")

# ---------------- Area ----------------
V(sp.integrate(2 * sp.sqrt(x) - x**2 / 4, (x, 0, 4)), Rt(16, 3))
M("Application of Integrals", "tough", "tough", "The area enclosed between the parabolas y² = 4x and x² = 4y is",
  "16/3", ["8/3", "32/3", "4"], "They meet at (0,0) and (4,4). Area = ∫₀⁴(2√x − x²/4)dx = 32/3 − 16/3 = 16/3.")
V(2 * sp.integrate(4 - x**2, (x, 0, 2)), Rt(32, 3))
M("Application of Integrals", "tough", "tough", "The area bounded by y = x² and the line y = 4 is",
  "32/3", ["16/3", "8", "64/3"], "2∫₀²(4 − x²)dx = 2(8 − 8/3) = 32/3.")
M("Application of Integrals", "formula", "moderate", "The area enclosed by the ellipse x²/9 + y²/4 = 1 is",
  "6π", ["9π", "4π", "36π"], "Area = πab = π × 3 × 2.")
M("Application of Integrals", "tough", "tough", "The area between y = sin x and the x-axis for 0 ≤ x ≤ 2π is",
  "4", ["0", "2", "2π"], "Each arch has area 2; the signed integral is 0, but area counts both arches.")

# ---------------- Differential Equations ----------------
M("Differential Equations", "formula", "moderate", "The order and degree of (d²y/dx²)³ + (dy/dx)⁴ + y = 0 are",
  "2 and 3", ["2 and 4", "3 and 2", "4 and 2"], "Highest derivative d²y/dx² (order 2) appears with power 3 (degree).")
M("Differential Equations", "tough", "tough", "The general solution of dy/dx = e^(x − y) is",
  "eʸ = eˣ + C", ["e⁻ʸ = eˣ + C", "y = x + C", "eˣ⁺ʸ = C"], "eʸ dy = eˣ dx → eʸ = eˣ + C.")
M("Differential Equations", "formula", "moderate", "The integrating factor of dy/dx + y tan x = sec x is",
  "sec x", ["cos x", "tan x", "e^(tan x)"], "IF = e^∫tan x dx = e^(ln sec x) = sec x.")
sol = sp.dsolve(sp.Eq(x * sp.Function("Y")(x).diff(x) - sp.Function("Y")(x), x**2), ics={sp.Function("Y")(1): 2})
V(sol.rhs, x**2 + x)
M("Differential Equations", "tough", "tough", "The solution of x dy/dx − y = x² with y(1) = 2 is",
  "y = x² + x", ["y = x² + 1", "y = 2x²", "y = x² + 2x − 1"], "dy/dx − y/x = x; IF = 1/x: d(y/x)/dx = 1 → y = x² + Cx; y(1) = 2 gives C = 1.")
tt = 5 * sp.log(3) / sp.log(2)
M("Differential Equations", "tough", "tough", "A population grows at a rate proportional to its size and doubles in 5 years. The time taken to triple is about",
  f"{float(tt):.2f} years", ["7.50 years", "10.00 years", "15.00 years"], f"P = P₀e^(kt), e^(5k) = 2. Tripling: t = ln3/k = 5 ln3/ln2 ≈ {float(tt):.2f} years.")

# ---------------- Coordinate geometry ----------------
M("Straight Lines", "tough", "tough", "The distance between the parallel lines 6x + 8y − 5 = 0 and 3x + 4y + 5 = 0 is",
  "3/2", ["1", "2", "1/2"], "Write the second as 6x + 8y + 10 = 0. Distance = |10 − (−5)|/√(36 + 64) = 15/10 = 3/2.")
M("Straight Lines", "tough", "tough", "The foot of the perpendicular from (1, 2) to the line x + y − 7 = 0 is",
  "(3, 4)", ["(4, 3)", "(2, 5)", "(3.5, 3.5)"], "Foot = (1, 2) − [(1 + 2 − 7)/2](1, 1) = (1, 2) + (2, 2) = (3, 4).")
M("Straight Lines", "tough", "tough", "The acute angle between the lines y = 3x + 1 and 2y + x = 4 is",
  "tan⁻¹ 7", ["tan⁻¹(1/7)", "45°", "tan⁻¹(7/5)"], "m₁ = 3, m₂ = −1/2: tanθ = |(3 + 1/2)/(1 − 3/2)| = 7.")
M("Straight Lines", "formula", "moderate", "The area of the triangle with vertices (1, 2), (4, 6) and (−2, 3) is",
  "15/2", ["15", "7", "13/2"], "½|1(6 − 3) + 4(3 − 2) − 2(2 − 6)| = ½|3 + 4 + 8| = 15/2.")
M("Straight Lines", "tough", "tough", "The line through the intersection of 2x + 3y = 5 and x − y = 0, perpendicular to 3x + 4y = 1, is",
  "4x − 3y = 1", ["3x + 4y = 7", "4x + 3y = 7", "3x − 4y + 1 = 0"], "Intersection (1, 1); required slope 4/3: y − 1 = (4/3)(x − 1) → 4x − 3y = 1.")
M("Straight Lines", "tough", "tough", "The image of the point (1, 2) in the line x + y = 5 is",
  "(3, 4)", ["(4, 3)", "(2, 1)", "(−1, −2)"], "Image = (1, 2) − 2[(1 + 2 − 5)/2](1, 1) = (1, 2) + (2, 2) = (3, 4).")
M("Circles", "formula", "moderate", "The centre and radius of x² + y² − 6x + 4y − 12 = 0 are",
  "(3, −2) and 5", ["(−3, 2) and 5", "(3, −2) and √12", "(6, −4) and 5"], "Centre (3, −2); r = √(9 + 4 + 12) = 5.")
M("Circles", "tough", "tough", "The length of the tangent from (5, 1) to the circle x² + y² − 2x + 4y − 4 = 0 is",
  "4", ["16", "2", "√26"], "√S₁ = √(25 + 1 − 10 + 4 − 4) = √16 = 4.")
M("Circles", "tough", "tough", "The number of common tangents to x² + y² = 9 and x² + y² − 8x + 12 = 0 is",
  "2", ["1", "3", "4"], "Centres (0,0), (4,0); radii 3, 2. |r₁ − r₂| = 1 < d = 4 < r₁ + r₂ = 5, so they intersect: 2 common tangents.")
M("Circles", "tough", "tough", "The circle with (1, 2) and (5, 6) as ends of a diameter is",
  "x² + y² − 6x − 8y + 17 = 0", ["x² + y² + 6x + 8y + 17 = 0", "x² + y² − 6x − 8y − 17 = 0", "x² + y² − 3x − 4y + 17 = 0"], "(x − 1)(x − 5) + (y − 2)(y − 6) = 0.")
M("Circles", "tough", "tough", "The length of the chord cut by the line x + y = 1 on the circle x² + y² = 9 is",
  "√34", ["√17", "6", "2√8"], "Distance from centre = 1/√2. Chord = 2√(9 − 1/2) = 2√(17/2) = √34.")
M("Conic Sections", "formula", "moderate", "The focus and directrix of the parabola y² = 12x are",
  "(3, 0) and x = −3", ["(0, 3) and y = −3", "(−3, 0) and x = 3", "(12, 0) and x = −12"], "y² = 4ax with a = 3.")
M("Conic Sections", "formula", "moderate", "The length of the latus rectum of x²/25 + y²/16 = 1 is",
  "32/5", ["8", "25/2", "16/5"], "2b²/a = 32/5.")
M("Conic Sections", "tough", "tough", "A hyperbola has its conjugate axis equal to half its transverse axis. Its eccentricity is",
  "√5/2", ["√5", "3/2", "√3/2"], "2b = a, so b²/a² = 1/4 and e = √(1 + 1/4) = √5/2.")
M("Conic Sections", "tough", "tough", "The tangent to the parabola y² = 8x at (2, 4) is",
  "y = x + 2", ["y = 2x", "y = x + 4", "x + y = 6"], "yy₁ = 2a(x + x₁) with a = 2: 4y = 4(x + 2).")
M("Conic Sections", "tough", "tough", "The ellipse with foci (±3, 0) and eccentricity 1/2 is",
  "x²/36 + y²/27 = 1", ["x²/36 + y²/9 = 1", "x²/9 + y²/27 = 1", "x²/12 + y²/3 = 1"], "ae = 3 → a = 6; b² = a² − a²e² = 36 − 9 = 27.")
M("Conic Sections", "tough", "tough", "A point on y² = 16x has focal distance 8. Its coordinates are",
  "(4, ±8)", ["(8, ±8√2)", "(2, ±4√2)", "(4, ±4)"], "Focal distance = x + a = x + 4 = 8 → x = 4, y² = 64.")

# ---------------- Vectors and 3D ----------------
M("Vector Algebra", "formula", "moderate", "The projection of a = i + 2j + 3k on b = 2i − j + 2k is",
  "2", ["6", "6/√14", "3"], "a·b/|b| = (2 − 2 + 6)/3 = 2.")
d1, d2 = sp.Matrix([3, 1, -2]), sp.Matrix([1, -3, 4]); ar = d1.cross(d2).norm() / 2; V(ar, 5 * sqrt(3))
M("Vector Algebra", "tough", "tough", "The diagonals of a parallelogram are 3i + j − 2k and i − 3j + 4k. Its area is",
  "5√3", ["10√3", "√75/4", "15"], "Area = ½|d₁ × d₂|; d₁ × d₂ = (−2, −14, −10) with magnitude 10√3, so area 5√3.")
M("Vector Algebra", "formula", "moderate", "If a = 2i + λj + k and b = i − 2j + 3k are perpendicular, λ equals",
  "5/2", ["−5/2", "2", "3/2"], "a·b = 2 − 2λ + 3 = 0.")
M("Vector Algebra", "tough", "tough", "A unit vector perpendicular to both i + j + k and i − j + k is",
  "(i − k)/√2", ["(i + k)/√2", "(i − j)/√2", "(j − k)/√2"], "(i + j + k) × (i − j + k) = 2i − 2k; normalised: (i − k)/√2.")
lam = sp.symbols("lam")
lv = sp.solve(sp.Matrix([[1, 2, 3], [2, -1, lam], [3, 1, 1]]).det(), lam)[0]
M("Vector Algebra", "tough", "tough", "The vectors i + 2j + 3k, 2i − j + λk and 3i + j + k are coplanar when λ equals",
  str(lv).replace("-", "−"), [str(-lv).replace("-", "−"), "4", str(lv * 2).replace("-", "−")],
  f"Coplanar ⇔ scalar triple product = 0: 1(−1 − λ) − 2(2 − 3λ) + 3(2 + 3) = 10 + 5λ = 0, so λ = {lv}.".replace("-", "−"))
M("Three Dimensional Geometry", "tough", "tough", "The angle between the planes 2x − y + z = 6 and x + y + 2z = 7 is",
  "60°", ["30°", "45°", "90°"], "cos θ = |2 − 1 + 2|/(√6 √6) = 1/2.")
M("Three Dimensional Geometry", "tough", "tough", "The distance between the planes 2x − 2y + z + 3 = 0 and 4x − 4y + 2z + 5 = 0 is",
  "1/6", ["1/3", "2/3", "8/3"], "Write the second as 2x − 2y + z + 5/2 = 0: |3 − 5/2|/3 = 1/6.")
P0 = sp.Matrix([1, 2, 3]); nrm = sp.Matrix([1, 2, 2]); dd = (P0.dot(nrm) - 3) / nrm.dot(nrm); img = P0 - 2 * dd * nrm
assert list(img) == [Rt(-7, 9), Rt(-14, 9), Rt(-5, 9)]
M("Three Dimensional Geometry", "tough", "tough", "The image of the point (1, 2, 3) in the plane x + 2y + 2z = 3 is",
  "(−7/9, −14/9, −5/9)", ["(7/9, 14/9, 5/9)", "(1/9, 2/9, 11/9)", "(−1, −2, −3)"], "Image = P − 2[(1 + 4 + 6 − 3)/9](1, 2, 2) = (1, 2, 3) − (16/9)(1, 2, 2).")
M("Three Dimensional Geometry", "tough", "tough", "The line (x − 2)/1 = (y − 1)/2 = (z + 1)/3 meets the plane x + y + z = 8 at",
  "(3, 3, 2)", ["(2, 1, −1)", "(4, 5, 5)", "(3, 2, 3)"], "Point (2 + t, 1 + 2t, −1 + 3t): 2 + 6t = 8 → t = 1.")
a_, b_ = sp.Matrix([1, 2, 3]), sp.Matrix([2, 4, 5]); u1, u2 = sp.Matrix([1, -1, 1]), sp.Matrix([2, 1, 2])
sd = abs((b_ - a_).dot(u1.cross(u2))) / u1.cross(u2).norm(); V(sd, 1 / sqrt(2))
M("Three Dimensional Geometry", "tough", "tough", "The shortest distance between the lines r = (i + 2j + 3k) + λ(i − j + k) and r = (2i + 4j + 5k) + μ(2i + j + 2k) is",
  "1/√2", ["3/√2", "√2", "3"], "u₁ × u₂ = (−3, 0, 3), |u₁ × u₂| = 3√2. b − a = (1, 2, 2), so (b − a)·(u₁ × u₂) = −3 + 6 = 3. d = 3/(3√2) = 1/√2.")

# ---------------- Statistics ----------------
import statistics as st
V(st.pvariance(range(1, 11)), Rt(33, 4))
M("Statistics", "tough", "tough", "The variance of the first 10 natural numbers is",
  "8.25", ["9.17", "5.5", "2.87"], "Variance of 1, …, n is (n² − 1)/12 = 99/12 = 8.25.")
M("Statistics", "tough", "tough", "A data set has standard deviation 4. Each observation is multiplied by 3 and then 2 is added. The new variance is",
  "144", ["36", "146", "12"], "Adding a constant does not change spread; multiplying by 3 makes SD 12, variance 144.")
V(st.pvariance([2, 4, 6, 8, 10]), 8)
M("Statistics", "formula", "moderate", "The variance of 2, 4, 6, 8, 10 is",
  "8", ["6", "10", "2√2"], "Mean 6; squared deviations 16, 4, 0, 4, 16; sum 40; 40/5 = 8.")
M("Statistics", "tough", "tough", "The mean deviation about the mean of 3, 7, 8, 10, 12 is",
  "2.4", ["2", "3", "8"], "Mean = 8; |deviations| = 5, 1, 0, 2, 4; sum 12; 12/5 = 2.4.")
M("Statistics", "tough", "tough", "The mean of 20 observations was found to be 15. Later it was found that one value 25 was wrongly read as 35. The correct mean is",
  "14.5", ["15.5", "14", "13.5"], "Correct sum = 300 − 35 + 25 = 290; mean = 290/20 = 14.5.")

# ---------------- Probability ----------------
V(Rt(1, 2) * Rt(3, 7) / (Rt(1, 2) * Rt(3, 7) + Rt(1, 2) * Rt(5, 11)), Rt(33, 68))
M("Probability", "tough", "tough", "Bag I has 3 red and 4 black balls; Bag II has 5 red and 6 black balls. A bag is chosen at random and a ball drawn from it is red. The probability that it came from Bag I is",
  "33/68", ["35/68", "3/7", "1/2"], "Bayes: (½ × 3/7)/(½ × 3/7 + ½ × 5/11) = (33/77)/(68/77) = 33/68.")
M("Probability", "tough", "tough", "A and B are independent with P(A) = 0.4 and P(B) = 0.5. The probability that neither occurs is",
  "0.3", ["0.1", "0.2", "0.7"], "P(A′ ∩ B′) = 0.6 × 0.5 = 0.3.")
M("Probability", "tough", "tough", "Two dice are thrown. Given that at least one die shows 3, the probability that the sum is 7 is",
  "2/11", ["1/6", "1/18", "2/36"], "Outcomes with at least one 3: 11. Of these, (3,4) and (4,3) give 7.")
M("Probability", "tough", "tough", "The probability that a randomly chosen leap year has 53 Sundays is",
  "2/7", ["1/7", "53/366", "3/7"], "366 days = 52 weeks + 2 days; the 2 extra days are one of 7 equally likely pairs, 2 of which contain a Sunday.")
M("Probability", "formula", "moderate", "Two cards are drawn without replacement from a pack of 52. The probability that both are kings is",
  "1/221", ["1/169", "1/13", "4/663"], "(4/52)(3/51) = 12/2652 = 1/221.")
M("Probability", "formula", "moderate", "Three fair coins are tossed. The probability of getting at least two heads is",
  "1/2", ["3/8", "1/4", "7/8"], "Favourable: HHT, HTH, THH, HHH = 4 of 8.")
M("Probability", "tough", "tough", "A and B are independent events with P(A) = 1/2 and P(B) = 1/3. The probability that exactly one of them occurs is",
  "1/2", ["1/6", "1/3", "5/6"], "P(A)P(B′) + P(A′)P(B) = 1/2 × 2/3 + 1/2 × 1/3 = 1/3 + 1/6 = 1/2.")

# ---------------- Trigonometry ----------------
sols = sp.solveset(sp.sin(2 * x) - sp.cos(x), x, sp.Interval(0, 2 * pi)); assert len(sols) == 4
M("Trigonometric Functions and Equations", "tough", "tough", "The number of solutions of sin 2x = cos x in [0, 2π] is",
  "4", ["2", "3", "6"], "cos x(2 sin x − 1) = 0: cos x = 0 gives π/2, 3π/2; sin x = 1/2 gives π/6, 5π/6.")
V(sp.tan(5 * pi / 12) - sp.tan(pi / 12), 2 * sqrt(3))
M("Trigonometric Functions and Equations", "tough", "tough", "The value of tan 75° − tan 15° is",
  "2√3", ["√3", "1", "4"], "tan 75° = 2 + √3, tan 15° = 2 − √3; difference = 2√3.")
V(sp.cos(pi / 9) * sp.cos(2 * pi / 9) * sp.cos(4 * pi / 9), Rt(1, 8))
M("Trigonometric Functions and Equations", "tough", "tough", "The value of cos 20° cos 40° cos 80° is",
  "1/8", ["1/4", "1/16", "√3/8"], "Multiply and divide by 2 sin 20° and use sin 2θ = 2 sin θ cos θ three times: sin 160°/(8 sin 20°) = 1/8.")
V(sp.sin(pi / 10), (sqrt(5) - 1) / 4)
M("Trigonometric Functions and Equations", "formula", "moderate", "The value of sin 18° is",
  "(√5 − 1)/4", ["(√5 + 1)/4", "(√3 − 1)/2", "√(10 − 2√5)/4"], "Standard value; cos 36° = (√5 + 1)/4.")
M("Trigonometric Functions and Equations", "formula", "moderate", "The general solution of tan x = √3 is",
  "x = nπ + π/3, n ∈ ℤ", ["x = 2nπ + π/3", "x = nπ ± π/3", "x = nπ + π/6"], "tan has period π.")
M("Trigonometric Functions and Equations", "tough", "tough", "If sin x + sin²x = 1, then cos²x + cos⁴x equals",
  "1", ["0", "2", "−1"], "sin x = 1 − sin²x = cos²x, so cos²x + cos⁴x = sin x + sin²x = 1.")

# ---------------- Inverse trigonometric functions ----------------
V(sp.asin(sp.sin(3 * pi / 4)), pi / 4)
M("Inverse Trigonometric Functions", "tough", "tough", "The value of sin⁻¹(sin 3π/4) is",
  "π/4", ["3π/4", "−π/4", "π/2"], "Principal range of sin⁻¹ is [−π/2, π/2]; sin 3π/4 = sin π/4.")
V(sp.acos(sp.cos(7 * pi / 6)), 5 * pi / 6)
M("Inverse Trigonometric Functions", "tough", "tough", "The value of cos⁻¹(cos 7π/6) is",
  "5π/6", ["7π/6", "π/6", "−5π/6"], "Principal range [0, π]; cos 7π/6 = cos(2π − 7π/6) = cos 5π/6.")
V(sp.atan(1) + sp.atan(2) + sp.atan(3), pi)
M("Inverse Trigonometric Functions", "tough", "tough", "The value of tan⁻¹1 + tan⁻¹2 + tan⁻¹3 is",
  "π", ["π/2", "3π/4", "0"], "tan⁻¹2 + tan⁻¹3 = π + tan⁻¹(5/(1 − 6)) = 3π/4; adding π/4 gives π.")
M("Inverse Trigonometric Functions", "formula", "moderate", "The value of sin(cos⁻¹(3/5)) is",
  "4/5", ["3/5", "3/4", "5/4"], "If cos θ = 3/5 with θ in [0, π], sin θ = 4/5.")
M("Inverse Trigonometric Functions", "formula", "moderate", "The principal value of sec⁻¹(−2) is",
  "2π/3", ["−π/3", "π/3", "4π/3"], "sec⁻¹x = cos⁻¹(1/x) = cos⁻¹(−1/2) = 2π/3.")
M("Inverse Trigonometric Functions", "concept", "moderate", "The domain of sin⁻¹(2x − 1) is",
  "[0, 1]", ["[−1, 1]", "[−1, 0]", "[0, 2]"], "−1 ≤ 2x − 1 ≤ 1 → 0 ≤ x ≤ 1.")
