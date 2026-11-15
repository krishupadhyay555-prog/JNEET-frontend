from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp

x, t = sp.symbols("x t", positive=True)
d1 = sp.diff(sp.sin(x ** 2), x); assert sp.simplify(d1 - 2 * x * sp.cos(x ** 2)) == 0
d2 = sp.diff(x ** x, x); assert sp.simplify(d2 - x ** x * (sp.log(x) + 1)) == 0
# parametric x = t², y = 2t → dy/dx = 1/t, at t = 2 → 0.5
dydx = sp.diff(2 * t, t) / sp.diff(t ** 2, t); val_p = dydx.subs(t, 2); assert val_p == sp.Rational(1, 2)
# implicit x² + y² = 25 at (3,4) → −x/y = −0.75
val_i = -sp.Rational(3, 4)
# second derivative of x³ at x = 2 → 12
d2nd = sp.diff(x ** 3, x, 2).subs(x, 2); assert d2nd == 12
# derivative of tan⁻¹(2x/(1 − x²)) = 2/(1 + x²) for |x|<1; at x = 0 → 2
der_inv = sp.diff(2 * sp.atan(x), x).subs(x, 0); assert der_inv == 2

DOC = {
"slug": "differentiation", "subject": "Mathematics",
"chapters": {"JEE": "Differentiation"},
"title": "Differentiation", "readMinutes": 14,
"summary": [
"The derivative f′(x) = lim (h→0) (f(x + h) − f(x))/h measures the instantaneous rate of change and the slope of the tangent.",
"Learn the standard derivatives and the rules: sum, product, quotient and chain rule. Special techniques: implicit, logarithmic, parametric differentiation, and derivatives of inverse trigonometric functions using substitution.",
"Higher-order derivatives and the derivative of one function with respect to another complete the chapter.",
],
"formulas": [
F("First principles", "f′(x) = lim (h→0) (f(x + h) − f(x))/h", "Definition of derivative."),
F("Power, exponential, log", "d(xⁿ)/dx = nxⁿ⁻¹;  d(eˣ)/dx = eˣ;  d(aˣ)/dx = aˣ ln a;  d(ln x)/dx = 1/x;  d(logₐx)/dx = 1/(x ln a)", "Standard derivatives."),
F("Trigonometric", "(sin x)′ = cos x;  (cos x)′ = −sin x;  (tan x)′ = sec²x;  (cot x)′ = −cosec²x;  (sec x)′ = sec x tan x;  (cosec x)′ = −cosec x cot x", "Trig derivatives.", None, tag="PYQ favourite"),
F("Inverse trigonometric", "(sin⁻¹x)′ = 1/√(1 − x²);  (cos⁻¹x)′ = −1/√(1 − x²);  (tan⁻¹x)′ = 1/(1 + x²);  (cot⁻¹x)′ = −1/(1 + x²);  (sec⁻¹x)′ = 1/(|x|√(x² − 1))", "Inverse-trig derivatives."),
F("Product and quotient rules", "(uv)′ = u′v + uv′;  (u/v)′ = (u′v − uv′)/v²", "Combining functions."),
F("Chain rule", "dy/dx = (dy/du)(du/dx)", "Composite functions.", "Differentiate outer, keep inner, then multiply by the inner derivative.", tag="PYQ favourite"),
F("Implicit differentiation", "differentiate both sides w.r.t. x, treating y as a function of x;  then solve for dy/dx", "Equations not solved for y."),
F("Logarithmic differentiation", "y = u^v ⇒ ln y = v ln u ⇒ y′/y = v′ ln u + v u′/u", "Variable powers and long products.", None, tag="PYQ favourite"),
F("Parametric differentiation", "dy/dx = (dy/dt)/(dx/dt);  d²y/dx² = d/dt(dy/dx) ÷ (dx/dt)", "Curves given by x(t), y(t).", "d²y/dx² is not (d²y/dt²)/(d²x/dt²)."),
F("Derivative of one function w.r.t. another", "du/dv = (du/dx)/(dv/dx)", "Differentiating f w.r.t. g."),
F("Substitution for inverse trig", "√(1 − x²) → x = sin θ;  (1 − x²)/(1 + x²) → x = tan θ;  2x/(1 − x²) → x = tan θ", "Simplify before differentiating."),
F("Second derivative", "d²y/dx² = d/dx(dy/dx)", "Concavity, acceleration, differential equations."),
],
"examples": [
X("Chain rule", "d/dx sin(x²)?",
  "cos(x²) × 2x = 2x cos(x²).", []),
X("Logarithmic differentiation", "d/dx (xˣ)?",
  "ln y = x ln x ⇒ y′/y = ln x + 1 ⇒ y′ = xˣ(1 + ln x).", []),
X("Parametric", "x = t², y = 2t. Find dy/dx at t = 2.",
  f"dy/dx = 2/(2t) = 1/t ⇒ {fx(float(val_p), 1)} at t = 2.", [(fx(float(val_p), 1), "0.5")]),
X("Implicit", "x² + y² = 25. dy/dx at (3, 4)?",
  f"2x + 2y y′ = 0 ⇒ y′ = −x/y = −3/4 = {fx(float(val_i), 2)}.", [(fx(float(val_i), 2), "−0.75")]),
X("Second derivative", "y = x³. Find y″ at x = 2.",
  f"y″ = 6x ⇒ {d2nd}.", [(str(d2nd), "12")]),
X("Inverse-trig substitution", "d/dx tan⁻¹(2x/(1 − x²)) for |x| < 1, at x = 0?",
  f"With x = tan θ the function is 2θ = 2tan⁻¹x, so the derivative is 2/(1 + x²) = {der_inv} at x = 0.", [(str(der_inv), "2")]),
],
"topics": [
T("Derivative as rate", "If s(t) is position, s′(t) is velocity and s″(t) acceleration. dy/dx at a point is the slope of the tangent there."),
T("Derivatives of modulus and greatest integer", "d|x|/dx = x/|x| (x ≠ 0). [x] has derivative 0 between integers and is not differentiable at integers."),
T("Derivative of determinants", "Differentiate one row at a time and add the resulting determinants."),
T("Rolle's and mean value theorems", "Rolle's: f continuous on [a, b], differentiable on (a, b), f(a) = f(b) ⇒ f′(c) = 0 for some c. LMVT: f′(c) = (f(b) − f(a))/(b − a)."),
T("Even/odd and derivatives", "The derivative of an even function is odd and that of an odd function is even. Derivatives of periodic functions are periodic with the same period."),
T("Leibniz rule for nth derivatives", "(uv)⁽ⁿ⁾ = Σ C(n, r) u⁽ⁿ⁻ʳ⁾ v⁽ʳ⁾. Useful for xⁿeˣ-type products."),
],
"ratta": [
"(tan x)′ = sec²x;  (sec x)′ = sec x tan x.",
"(sin⁻¹x)′ = 1/√(1 − x²);  (tan⁻¹x)′ = 1/(1 + x²).",
"Chain: outer × inner′.",
"xˣ → xˣ(1 + ln x).",
"Parametric: (dy/dt)/(dx/dt).",
"Rolle: f(a) = f(b) ⇒ f′(c) = 0.",
],
}

SYLLABUS = [
("Differentiation of the sum, difference, product and quotient of two functions; trigonometric, inverse trigonometric, logarithmic and exponential functions", ["product", "quotient", "inverse trigonometric", "logarithmic"]),
("Composite and implicit functions; derivatives of order up to two", ["chain rule", "implicit", "second derivative"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
