from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp

x = sp.symbols("x")
l1 = sp.limit(sp.sin(3 * x) / x, x, 0); assert l1 == 3
l2 = sp.limit((1 + 2 / x) ** x, x, sp.oo); assert l2 == sp.exp(2)
l3 = sp.limit((x ** 2 - 4) / (x - 2), x, 2); assert l3 == 4
l4 = sp.limit((1 - sp.cos(x)) / x ** 2, x, 0); assert l4 == sp.Rational(1, 2)
l5 = sp.limit((sp.exp(x) - 1 - x) / x ** 2, x, 0); assert l5 == sp.Rational(1, 2)
l6 = sp.limit((x ** 3 - 1) / (x - 1), x, 1); assert l6 == 3

DOC = {
"slug": "limits-continuity-and-differentiability", "subject": "Mathematics",
"chapters": {"JEE": "Limits, Continuity and Differentiability"},
"title": "Limits, Continuity and Differentiability", "readMinutes": 16,
"summary": [
"A limit describes the value f(x) approaches as x approaches a; it exists when the left-hand and right-hand limits are equal and finite.",
"Indeterminate forms (0/0, ∞/∞, 1^∞, 0 × ∞, ∞ − ∞) are handled by factorisation, rationalisation, standard limits, series expansion or L'Hôpital's rule.",
"f is continuous at a if lim f(x) = f(a). f is differentiable at a if the left and right derivatives are equal; differentiability implies continuity, but not conversely (|x| at 0).",
],
"formulas": [
F("Existence of a limit", "lim (x→a) f(x) exists ⇔ LHL = RHL (finite)", "Checking limits at break points."),
F("Algebraic limit", "lim (x→a) (xⁿ − aⁿ)/(x − a) = naⁿ⁻¹", "Polynomial 0/0 forms.", None, tag="PYQ favourite"),
F("Trigonometric limits", "lim sin x/x = 1;  lim tan x/x = 1;  lim (1 − cos x)/x² = 1/2  (x → 0, radians)", "Trig 0/0 forms.", "x must be in radians."),
F("Exponential and log limits", "lim (eˣ − 1)/x = 1;  lim (aˣ − 1)/x = ln a;  lim ln(1 + x)/x = 1  (x → 0)", "Exponential 0/0 forms."),
F("1^∞ form", "lim f^g = e^(lim g(f − 1)) when f → 1, g → ∞;  lim (1 + 1/x)ˣ = e;  lim (1 + x)^(1/x) = e", "Powers tending to 1.", None, tag="PYQ favourite"),
F("L'Hôpital's rule", "for 0/0 or ∞/∞: lim f/g = lim f′/g′", "When standard limits don't fit.", "Differentiate numerator and denominator separately — not the quotient."),
F("Series expansions", "eˣ = 1 + x + x²/2! + …;  sin x = x − x³/3! + …;  cos x = 1 − x²/2! + …;  ln(1 + x) = x − x²/2 + …;  tan x = x + x³/3 + …", "Higher-order 0/0 limits."),
F("Rational functions at infinity", "degree num < den → 0;  equal → ratio of leading coefficients;  num > den → ±∞", "Limits as x → ∞."),
F("Continuity", "f continuous at a ⇔ lim (x→a) f(x) = f(a)", "Checking continuity.", None, tag="PYQ favourite"),
F("Differentiability", "Lf′(a) = lim (h→0⁻) (f(a + h) − f(a))/h;  Rf′(a) similarly;  differentiable ⇔ Lf′(a) = Rf′(a)", "Checking differentiability.", "Differentiable ⇒ continuous, but continuous ⇏ differentiable (|x| at 0)."),
F("Sandwich theorem", "g(x) ≤ f(x) ≤ h(x) and lim g = lim h = L ⇒ lim f = L", "Limits like x² sin(1/x)."),
F("Greatest integer limits", "lim (x→n⁻)[x] = n − 1;  lim (x→n⁺)[x] = n", "Step-function limits."),
],
"examples": [
X("Trig limit", "lim (x→0) sin 3x/x?",
  f"3 × (sin 3x/3x) → {l1}.", [(str(l1), "3")]),
X("1^∞ form", "lim (x→∞) (1 + 2/x)ˣ?",
  "e^(lim x × 2/x) = e².", []),
X("Factorisation", "lim (x→2) (x² − 4)/(x − 2)?",
  f"(x + 2) → {l3}.", [(str(l3), "4")]),
X("Standard limit", "lim (x→0) (1 − cos x)/x²?",
  f"2sin²(x/2)/x² → 1/2 = {fx(float(l4), 1)}.", [(fx(float(l4), 1), "0.5")]),
X("Series", "lim (x→0) (eˣ − 1 − x)/x²?",
  f"(x²/2 + …)/x² → 1/2 = {fx(float(l5), 1)}.", [(fx(float(l5), 1), "0.5")]),
X("Continuity condition", "f(x) = (x³ − 1)/(x − 1) for x ≠ 1 and f(1) = k. Find k for continuity.",
  f"lim (x→1) = 3 × 1² = {l6} ⇒ k = 3.", [(str(l6), "3")]),
],
"topics": [
T("Rationalisation", "For limits with square roots like (√(x + 1) − 1)/x, multiply by the conjugate to remove the 0/0 form."),
T("Limits at infinity with roots", "For √(x² + x) − x as x → ∞, rationalise to get x/(√(x² + x) + x) → 1/2."),
T("Continuity of standard functions", "Polynomials, sin, cos, eˣ are continuous everywhere; rational functions except where the denominator is 0; log x for x > 0; [x] is discontinuous at integers."),
T("Algebra of continuous functions", "Sum, difference, product and composition of continuous functions are continuous; quotient too, where the denominator isn't zero."),
T("Intermediate value theorem", "If f is continuous on [a, b] and k lies between f(a) and f(b), then f(c) = k for some c in (a, b) — used to show an equation has a root."),
T("Non-differentiable points", "Corners (|x − a|), cusps, vertical tangents (x^(1/3) at 0) and discontinuities. |f(x)| may fail to be differentiable where f(x) = 0 and changes sign."),
T("Real functions and their graphs", "Syllabus starts this unit with real-valued functions: algebra of functions (f ± g, fg, f/g where g ≠ 0, f∘g), polynomial, rational, trigonometric, exponential (aˣ) and logarithmic (logₐx, domain x > 0) functions, and inverse functions (exist only for one-one onto f; graph of f⁻¹ is the mirror image of f in y = x). Know the graphs of |x|, [x], {x}, sgn x, eˣ, ln x, sin x, cos x, tan x and 1/x — their domain, range and the points where they break or have corners give most continuity and differentiability answers."),
],
"ratta": [
"(xⁿ − aⁿ)/(x − a) → naⁿ⁻¹.",
"sin x/x → 1;  (1 − cos x)/x² → 1/2.",
"(eˣ − 1)/x → 1;  (aˣ − 1)/x → ln a.",
"1^∞: e^(lim g(f − 1)).",
"Differentiable ⇒ continuous (not conversely).",
"LHL = RHL = f(a) ⇒ continuous.",
],
}

SYLLABUS = [
("Limits of functions; continuity and differentiability", ["limit", "continuous", "differentiab"]),
("Standard limits, L'Hôpital's rule and indeterminate forms", ["L'Hôpital", "indeterminate"]),
("Real-valued functions, algebra of functions, polynomial, rational, trigonometric, logarithmic, exponential and inverse functions; graphs of simple functions", ["algebra of functions", "rational", "logarithmic", "exponential", "inverse functions", "graph"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Limit batata hai ki x ke a ke paas jaane par f(x) kis value ke paas jaata hai; ye tab exist karta hai jab left-hand aur right-hand limits barabar aur finite hon.",
"Indeterminate forms (0/0, ∞/∞, 1^∞, 0 × ∞, ∞ − ∞) factorisation, rationalisation, standard limits, series expansion ya L'Hôpital's rule se solve hote hain.",
"f, a par continuous hai agar lim f(x) = f(a). f, a par differentiable hai agar left aur right derivatives barabar hon; differentiability se continuity milti hai, par ulta nahi (|x| at 0).",
],
when=[
("Break points par limits check karna.", None),
("Polynomial 0/0 forms.", None),
("Trig 0/0 forms.", "x radians mein hona chahiye — degrees mein mat lagaana."),
("Exponential 0/0 forms.", None),
("1 ki taraf jaati powers.", None),
("Jab standard limits fit na hon.", "Numerator aur denominator alag-alag differentiate karo — quotient ko nahi."),
("Higher-order 0/0 limits.", None),
("x → ∞ par limits.", None),
("Continuity check karna.", None),
("Differentiability check karna.", "Differentiable ⇒ continuous, par continuous ⇏ differentiable (|x| at 0) — ulta mat lagaana."),
("x² sin(1/x) jaise limits.", None),
("Step-function limits.", None),
],
examples=[
("Trig limit", "lim (x→0) sin 3x/x?",
 "3 × (sin 3x/3x) → ⟨0⟩."),
("1^∞ form", "lim (x→∞) (1 + 2/x)ˣ?",
 "e^(lim x × 2/x) = e²."),
("Factorisation", "lim (x→2) (x² − 4)/(x − 2)?",
 "(x + 2) → ⟨0⟩."),
("Standard limit", "lim (x→0) (1 − cos x)/x²?",
 "2sin²(x/2)/x² → 1/2 = ⟨0⟩."),
("Series", "lim (x→0) (eˣ − 1 − x)/x²?",
 "(x²/2 + …)/x² → 1/2 = ⟨0⟩."),
("Continuity condition", "x ≠ 1 ke liye f(x) = (x³ − 1)/(x − 1) aur f(1) = k. Continuity ke liye k nikalo.",
 "lim (x→1) = 3 × 1² = 3 ⇒ k = ⟨0⟩."),
],
topics=[
("Rationalisation", "(√(x + 1) − 1)/x jaise square root wale limits mein conjugate se multiply karke 0/0 form hatao."),
("Limits at infinity with roots", "x → ∞ par √(x² + x) − x ke liye rationalise karke x/(√(x² + x) + x) → 1/2 milta hai."),
("Continuity of standard functions", "Polynomials, sin, cos, eˣ har jagah continuous; rational functions jahan denominator 0 na ho; log x, x > 0 ke liye; [x] integers par discontinuous."),
("Algebra of continuous functions", "Continuous functions ka sum, difference, product aur composition continuous hai; quotient bhi, jahan denominator zero na ho."),
("Intermediate value theorem", "Agar f, [a, b] par continuous hai aur k, f(a) aur f(b) ke beech hai, to (a, b) mein kisi c ke liye f(c) = k — equation ka root dikhaane mein use hota hai."),
("Non-differentiable points", "Corners (|x − a|), cusps, vertical tangents (0 par x^(1/3)) aur discontinuities. |f(x)| wahan differentiable nahi ho sakta jahan f(x) = 0 ho aur sign badle."),
("Real functions and their graphs", "Syllabus yeh unit real-valued functions se shuru karta hai: algebra of functions (f ± g, fg, f/g jahan g ≠ 0, f∘g), polynomial, rational, trigonometric, exponential (aˣ) aur logarithmic (logₐx, domain x > 0) functions, aur inverse functions (sirf one-one onto f ke liye; f⁻¹ ka graph y = x line mein f ka mirror image). |x|, [x], {x}, sgn x, eˣ, ln x, sin x, cos x, tan x aur 1/x ke graph yaad rakho — inka domain, range aur jahan ye toot-te hain ya corner banate hain, wahi continuity aur differentiability ke zyaadatar answer dete hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
