from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp, math

x = sp.symbols("x", real=True)
f = x ** 3 - 3 * x ** 2 - 9 * x + 5
crit = sorted(sp.solve(sp.diff(f, x), x)); assert crit == [-1, 3]
fmax = f.subs(x, -1); fmin = f.subs(x, 3)
assert fmax == 10 and fmin == -22
# tangent to y = x² at (1,1): slope 2
slope = sp.diff(x ** 2, x).subs(x, 1)
# rate: sphere radius increases 0.1 cm/s, r = 5, dV/dt = 4πr² dr/dt = 10π
dV = 4 * math.pi * 25 * 0.1
# max area rectangle with perimeter 20 → square side 5 → area 25
area = 25
# LMVT for x² on [1,3]: c = 2
c = (9 - 1) / (3 - 1) / 2

DOC = {
"slug": "application-of-derivatives", "subject": "Mathematics",
"chapters": {"JEE": "Application of Derivatives"},
"title": "Application of Derivatives", "readMinutes": 15,
"summary": [
"Derivatives give rates of change, slopes of tangents and normals, and tell where a function increases, decreases, or has maxima and minima.",
"First-derivative test (sign change of f′) and second-derivative test (sign of f″) locate local extrema; absolute extrema on [a, b] are among critical points and end points.",
"Rolle's theorem and the mean value theorem link average and instantaneous rates. Optimisation word problems — areas, volumes, distances — are standard JEE questions.",
],
"formulas": [
F("Rate of change", "dy/dt = (dy/dx)(dx/dt)", "Related rates (area, volume changing with time).", None, tag="PYQ favourite"),
F("Tangent and normal", "tangent: y − y₁ = m(x − x₁), m = f′(x₁);  normal: y − y₁ = −(1/m)(x − x₁)", "Equations at a point."),
F("Increasing / decreasing", "f′(x) > 0 ⇒ strictly increasing;  f′(x) < 0 ⇒ strictly decreasing", "Monotonicity on intervals.", "f′ can be 0 at isolated points and f still increasing (x³ at 0)."),
F("Critical points", "f′(c) = 0 or f′(c) does not exist", "Candidates for extrema."),
F("First-derivative test", "f′ changes + to − ⇒ local maximum;  − to + ⇒ local minimum;  no change ⇒ neither (point of inflection)", "Classifying critical points."),
F("Second-derivative test", "f′(c) = 0 and f″(c) < 0 ⇒ local max;  f″(c) > 0 ⇒ local min;  f″(c) = 0 ⇒ test fails", "Quick classification.", None, tag="PYQ favourite"),
F("Absolute extrema on [a, b]", "compare f at all critical points in (a, b) and at a, b", "Global max/min on a closed interval."),
F("Rolle's theorem", "f continuous on [a, b], differentiable on (a, b), f(a) = f(b) ⇒ ∃ c ∈ (a, b): f′(c) = 0", "Existence of horizontal tangent."),
F("Lagrange's mean value theorem", "f′(c) = (f(b) − f(a))/(b − a) for some c ∈ (a, b)", "Average rate = instantaneous rate somewhere.", None, tag="PYQ favourite"),
F("Approximation", "f(x + Δx) ≈ f(x) + f′(x)Δx", "Approximate values (√25.3 etc.)."),
F("Standard optimisation results", "fixed perimeter → square has max area;  fixed surface area → cube (or sphere) has max volume;  cylinder of max volume in a sphere: h = 2R/√3", "Common optimisation answers."),
F("Angle between curves", "tan θ = |(m₁ − m₂)/(1 + m₁m₂)| using slopes of tangents at the intersection;  orthogonal if m₁m₂ = −1", "Curves cutting each other."),
],
"examples": [
X("Local extrema", "Find the local maximum and minimum values of f(x) = x³ − 3x² − 9x + 5.",
  f"f′ = 3x² − 6x − 9 = 3(x − 3)(x + 1) ⇒ x = −1, 3. f″(−1) = −12 < 0 ⇒ max f(−1) = {fmax}; f″(3) = 12 > 0 ⇒ min f(3) = {fx(float(fmin))}.", [(str(fmax), "10"), (fx(float(fmin)), "−22")]),
X("Tangent", "Tangent to y = x² at (1, 1)?",
  f"slope = 2x = {slope} ⇒ y − 1 = 2(x − 1) ⇒ y = 2x − 1.", [(str(slope), "2")]),
X("Related rates", "A sphere's radius grows at 0.1 cm/s. How fast is the volume growing when r = 5 cm?",
  f"dV/dt = 4πr² dr/dt = 4π × 25 × 0.1 = 10π ≈ {fx(dV, 2)} cm³/s.", [(fx(dV, 2), "31.42")]),
X("Maximum area", "Maximum area of a rectangle with perimeter 20?",
  f"x + y = 10, A = x(10 − x) ⇒ A′ = 10 − 2x = 0 ⇒ x = 5 ⇒ A = {area} (a square).", [(str(area), "25")]),
X("Mean value theorem", "Find c for f(x) = x² on [1, 3].",
  f"f′(c) = 2c = (9 − 1)/2 = 4 ⇒ c = {fx(c)}.", [(fx(c), "2")]),
X("Increasing interval", "Where is f(x) = x³ − 3x increasing?",
  "f′ = 3(x² − 1) > 0 ⇒ x < −1 or x > 1: increasing on (−∞, −1) ∪ (1, ∞).", []),
],
"topics": [
T("Monotonicity and inequalities", "To prove f(x) > g(x) for x > 0, show h = f − g has h(0) = 0 and h′ > 0. Example: eˣ > 1 + x for x ≠ 0."),
T("Points of inflection", "Where f″ changes sign (concavity changes). f is concave up where f″ > 0 and concave down where f″ < 0."),
T("Optimisation steps", "Write the quantity to optimise in one variable using the constraint, find critical points, test them, and check endpoints/domain restrictions."),
T("Shortest distance problems", "Minimise the square of the distance instead of the distance — same minimiser, easier algebra."),
T("Approximation example", "√25.3 ≈ 5 + 0.3/(2 × 5) = 5.03 using f(x) = √x at x = 25."),
T("Tangents from an external point", "Write the tangent at a general point (t, f(t)) and make it pass through the given point; solve for t."),
],
"ratta": [
"f′ > 0 increasing;  f′ < 0 decreasing.",
"f″(c) < 0 max;  f″(c) > 0 min.",
"Normal slope = −1/f′.",
"LMVT: f′(c) = (f(b) − f(a))/(b − a).",
"Fixed perimeter → square;  fixed surface → cube.",
"dV/dt = 4πr² dr/dt.",
],
}

SYLLABUS = [
("Rate of change of quantities, monotonic (increasing and decreasing) functions", ["rate of change", "increasing", "decreasing"]),
("Maxima and minima of functions of one variable", ["maxim", "minim"]),
("Rolle's and Lagrange's mean value theorems; tangents and normals", ["Rolle", "mean value", "tangent", "normal"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
