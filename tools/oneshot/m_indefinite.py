from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp

x = sp.symbols("x", positive=True)
def ok(expr, ans):
    assert sp.simplify(sp.diff(ans, x) - expr) == 0
ok(x * sp.exp(x), (x - 1) * sp.exp(x))
ok(1 / (x ** 2 + 4), sp.atan(x / 2) / 2)
ok(sp.log(x), x * sp.log(x) - x)
ok(1 / (x * (x + 1)), sp.log(x) - sp.log(x + 1))
ok(sp.sin(x) ** 2, x / 2 - sp.sin(2 * x) / 4)
ok(sp.exp(x) * (sp.sin(x) + sp.cos(x)), sp.exp(x) * sp.sin(x))
ok(2 * x / (x ** 2 + 1), sp.log(x ** 2 + 1))

DOC = {
"slug": "indefinite-integrals", "subject": "Mathematics",
"chapters": {"JEE": "Indefinite Integrals"},
"title": "Indefinite Integrals", "readMinutes": 16,
"summary": [
"Integration is the reverse of differentiation (antiderivatives of algebraic, trigonometric, exponential and logarithmic functions): ∫f(x)dx = F(x) + C where F′(x) = f(x). Every answer can be checked by differentiating.",
"Main methods: standard formulas, substitution, integration by parts (ILATE), partial fractions and special standard forms (1/(x² ± a²), √(a² − x²) etc.).",
"JEE shortcuts: ∫eˣ(f + f′)dx = eˣf + C, and integrals of the form ∫f′(x)/f(x) dx = ln|f(x)| + C.",
],
"formulas": [
F("Basic integrals", "∫xⁿdx = xⁿ⁺¹/(n + 1) (n ≠ −1);  ∫dx/x = ln|x|;  ∫eˣdx = eˣ;  ∫aˣdx = aˣ/ln a", "Standard results."),
F("Trigonometric integrals", "∫sin x = −cos x;  ∫cos x = sin x;  ∫sec²x = tan x;  ∫tan x = ln|sec x|;  ∫sec x = ln|sec x + tan x|;  ∫cosec x = ln|cosec x − cot x|", "Trig antiderivatives.", None, tag="PYQ favourite"),
F("Standard forms I", "∫dx/(x² + a²) = (1/a)tan⁻¹(x/a);  ∫dx/(x² − a²) = (1/2a)ln|(x − a)/(x + a)|;  ∫dx/(a² − x²) = (1/2a)ln|(a + x)/(a − x)|", "Quadratic denominators."),
F("Standard forms II", "∫dx/√(a² − x²) = sin⁻¹(x/a);  ∫dx/√(x² ± a²) = ln|x + √(x² ± a²)|", "Square-root denominators."),
F("Standard forms III", "∫√(a² − x²)dx = (x/2)√(a² − x²) + (a²/2)sin⁻¹(x/a);  ∫√(x² ± a²)dx = (x/2)√(x² ± a²) ± (a²/2)ln|x + √(x² ± a²)|", "Square roots in numerator."),
F("Substitution", "∫f(g(x))g′(x)dx = ∫f(t)dt with t = g(x);  ∫f′(x)/f(x)dx = ln|f(x)|", "Spotting an inner function and its derivative.", None, tag="PYQ favourite"),
F("Integration by parts", "∫u v dx = u∫v dx − ∫(u′∫v dx)dx;  choose u by ILATE (Inverse trig, Log, Algebraic, Trig, Exponential)", "Products of different function types.", None, tag="PYQ favourite"),
F("eˣ shortcut", "∫eˣ[f(x) + f′(x)]dx = eˣf(x) + C", "Integrals with eˣ times a function plus its derivative."),
F("Partial fractions", "(px + q)/((x − a)(x − b)) = A/(x − a) + B/(x − b);  repeated factor (x − a)²: A/(x − a) + B/(x − a)²;  quadratic factor: (Bx + C)/(x² + bx + c)", "Rational functions.", "If degree of numerator ≥ denominator, divide first."),
F("Linear over quadratic", "∫(px + q)/(ax² + bx + c)dx: write px + q = A(2ax + b) + B, then split", "Mixed rational forms."),
F("Trig powers", "sin²x = (1 − cos 2x)/2;  cos²x = (1 + cos 2x)/2;  odd power: save one factor and substitute", "Powers of sin and cos."),
F("a sin x + b cos x forms", "∫dx/(a + b cos x): use t = tan(x/2), cos x = (1 − t²)/(1 + t²), dx = 2dt/(1 + t²)", "Weierstrass substitution."),
],
"examples": [
X("By parts", "∫x eˣ dx?",
  "u = x, v = eˣ: x eˣ − ∫eˣ dx = (x − 1)eˣ + C.", []),
X("Standard form", "∫dx/(x² + 4)?",
  "(1/2)tan⁻¹(x/2) + C.", []),
X("Log integral", "∫ln x dx?",
  "By parts with u = ln x, v = 1: x ln x − x + C.", []),
X("Partial fractions", "∫dx/(x(x + 1))?",
  "1/(x(x + 1)) = 1/x − 1/(x + 1) ⇒ ln|x| − ln|x + 1| + C = ln|x/(x + 1)| + C.", []),
X("Trig power", "∫sin²x dx?",
  "∫(1 − cos 2x)/2 dx = x/2 − sin 2x/4 + C.", []),
X("eˣ shortcut", "∫eˣ(sin x + cos x)dx?",
  "f = sin x, f′ = cos x ⇒ eˣ sin x + C.", []),
],
"topics": [
T("Checking answers", "Differentiate the result; you should get the integrand back. Constants of integration can make two correct answers look different (e.g. sin²x vs −cos²x/2 forms)."),
T("Choosing a substitution", "Look for a function and its derivative: ∫2x/(x² + 1)dx → t = x² + 1 gives ln(x² + 1). For √(ax + b), put t² = ax + b."),
T("Trig substitutions", "√(a² − x²): x = a sin θ;  √(a² + x²): x = a tan θ;  √(x² − a²): x = a sec θ."),
T("Integrals of rational functions of sin and cos", "Divide numerator and denominator by cos²x to get sec²x dx and substitute t = tan x, especially for ∫dx/(a sin²x + b cos²x)."),
T("Reduction formulas", "∫sinⁿx dx = −sinⁿ⁻¹x cos x/n + ((n − 1)/n)∫sinⁿ⁻²x dx — leads to Wallis' formula for definite integrals."),
T("Special trick for ∫(x² + 1)/(x⁴ + 1)", "Divide by x²: ∫(1 + 1/x²)/(x² + 1/x²) dx, then put t = x − 1/x. For (x² − 1)/(x⁴ + 1) use t = x + 1/x."),
],
"ratta": [
"∫tan x = ln|sec x|;  ∫sec x = ln|sec x + tan x|.",
"∫dx/(x² + a²) = (1/a)tan⁻¹(x/a).",
"∫dx/√(a² − x²) = sin⁻¹(x/a).",
"ILATE for u in by parts.",
"∫eˣ(f + f′) = eˣf.",
"∫f′/f = ln|f|.",
],
}

SYLLABUS = [
("Integral as an anti-derivative; fundamental integrals involving algebraic, trigonometric, exponential and logarithmic functions", ["anti", "trigonometric", "exponential", "logarithmic"]),
("Integration by substitution, by parts and by partial fractions; integration using trigonometric identities", ["substitution", "by parts", "partial fractions"]),
("Evaluation of simple integrals of standard types", ["standard forms"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
