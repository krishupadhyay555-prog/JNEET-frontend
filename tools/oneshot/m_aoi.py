from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp, math

x = sp.symbols("x", real=True)
a1 = sp.integrate(x ** 2, (x, 0, 3)); assert a1 == 9
a2 = sp.integrate(x - x ** 2, (x, 0, 1)); assert a2 == sp.Rational(1, 6)
a3 = sp.integrate(4 * x - x ** 2, (x, 0, 4)); assert a3 == sp.Rational(32, 3)
a4 = math.pi * 3 * 2     # ellipse x²/9 + y²/4 = 1
a5 = sp.integrate(sp.sin(x), (x, 0, sp.pi)); assert a5 == 2
# parabola y² = 4ax and latus rectum x = a: area = 8a²/3 for a = 3 → 24
a6 = sp.Rational(8, 3) * 9; assert a6 == 24

DOC = {
"slug": "application-of-integrals", "subject": "Mathematics",
"chapters": {"JEE": "Application of Integrals"},
"title": "Application of Integrals", "readMinutes": 11,
"summary": [
"A definite integral gives area under a curve: area between y = f(x), the x-axis and x = a, b is ∫ₐᵇ |f(x)| dx.",
"Area between two curves is ∫ (upper − lower) dx between their intersection points; sometimes integrating with respect to y (right − left) is easier.",
"Sketch first: find intersection points, see which curve is on top, and split the interval wherever the curves cross or the function changes sign.",
],
"formulas": [
F("Area under a curve", "A = ∫ₐᵇ |f(x)| dx", "Area between a curve and the x-axis.", "If f changes sign, split at its zeros — otherwise areas cancel.", tag="PYQ favourite"),
F("Area with respect to y", "A = ∫_c^d |g(y)| dy", "Curves given as x = g(y)."),
F("Area between curves", "A = ∫ₐᵇ [f(x) − g(x)] dx  with f ≥ g on [a, b]", "Region enclosed by two curves.", None, tag="PYQ favourite"),
F("Circle", "area of x² + y² = a² = πa²", "Standard area."),
F("Ellipse", "area of x²/a² + y²/b² = 1 = πab", "Standard area.", None, tag="PYQ favourite"),
F("Parabola and its latus rectum", "area bounded by y² = 4ax and x = a = 8a²/3", "Standard area."),
F("Two parabolas", "area between y² = 4ax and x² = 4ay = 16a²/3", "Standard area.", None, tag="PYQ favourite"),
F("Parabola and line", "area between y = x² and y = x = 1/6;  between y² = 4ax and y = mx = 8a²/(3m³)", "Standard areas."),
F("Symmetry", "use symmetry about the axes to compute one part and multiply", "Saving work for circles, ellipses, parabolas."),
F("One arch of sine", "∫₀^π sin x dx = 2", "Area of one arch of y = sin x."),
],
"examples": [
X("Under a parabola", "Area under y = x² from x = 0 to 3?",
  f"∫₀³ x² dx = 27/3 = {a1}.", [(str(a1), "9")]),
X("Between y = x and y = x²", "Area enclosed by y = x and y = x²?",
  f"They meet at x = 0, 1; ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6 ≈ {fx(float(a2), 3)}.", [(fx(float(a2), 3), "0.167")]),
X("Parabola and x-axis", "Area between y = 4x − x² and the x-axis?",
  f"Roots x = 0, 4; ∫₀⁴ (4x − x²) dx = 32 − 64/3 = 32/3 ≈ {fx(float(a3), 2)}.", [(fx(float(a3), 2), "10.67")]),
X("Ellipse", "Area of x²/9 + y²/4 = 1?",
  f"πab = 6π ≈ {fx(a4, 2)}.", [(fx(a4, 2), "18.85")]),
X("Sine arch", "Area under y = sin x from 0 to π?",
  f"[−cos x]₀^π = 1 + 1 = {a5}.", [(str(a5), "2")]),
X("Latus rectum area", "Area bounded by y² = 12x and its latus rectum?",
  f"a = 3: 8a²/3 = 8 × 9/3 = {a6}.", [(str(a6), "24")]),
],
"topics": [
T("Sketching tips", "Mark intercepts, intersection points and symmetry. Shade the region asked; decide vertical strips (dx) or horizontal strips (dy) — choose the one needing fewer pieces."),
T("Curves crossing the axis", "For y = sin x on [0, 2π], the signed integral is 0 but the area is 4. Always use |f(x)| or split at zeros."),
T("Modulus and greatest integer curves", "Areas with |x| or [x] are found by splitting at break points, often giving triangles and rectangles that can be computed geometrically."),
T("Inequality regions", "Regions like {(x, y): x² ≤ y ≤ |x|} are found by identifying boundary curves and their intersections, then integrating upper minus lower."),
T("Area via definite integral properties", "King's property and symmetry from definite integrals can simplify area calculations."),
T("Area between a curve and the y-axis", "For x = g(y) between y = c and y = d, integrate g(y) dy. Example: area between x = y² and the y-axis from y = 0 to 2 is 8/3."),
],
"ratta": [
"Area = ∫|f(x)|dx (split at zeros).",
"Between curves: ∫(upper − lower)dx.",
"Ellipse πab;  circle πa².",
"y² = 4ax & latus rectum: 8a²/3.",
"y² = 4ax & x² = 4ay: 16a²/3.",
"y = x & y = x²: 1/6.",
],
}

SYLLABUS = [
("Applications of integrals in finding the area under simple curves, especially lines, circles, parabolas and ellipses (in standard form only)", ["area", "circle", "parabola", "ellipse"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Definite integral curve ke neeche area deta hai: y = f(x), x-axis aur x = a, b ke beech area ∫ₐᵇ |f(x)| dx hai.",
"Do curves ke beech area unke intersection points ke beech ∫ (upper − lower) dx hai; kabhi-kabhi y ke respect mein integrate karna (right − left) aasaan hota hai. Circle, parabola aur ellipse ke standard areas yaad rakho.",
"Pehle sketch banao: intersection points nikalo, dekho kaunsi curve upar hai, aur jahan curves cross karein ya function sign badle wahan interval tod do.",
],
when=[
("Curve aur x-axis ke beech area.", "Agar f sign badalta hai to uske zeros par todo — warna areas cancel ho jaayenge, galat answer aayega."),
("x = g(y) se di gayi curves.", None),
("Do curves se ghira region.", None),
("Standard area.", None),
("Standard area.", None),
("Standard area.", None),
("Standard area.", None),
("Standard areas.", None),
("Circles, ellipses, parabolas mein kaam bachaana.", None),
("y = sin x ke ek arch ka area.", None),
],
examples=[
("Parabola ke neeche", "y = x² ke neeche x = 0 se 3 tak area?",
 "∫₀³ x² dx = 27/3 = ⟨0⟩."),
("y = x aur y = x² ke beech", "y = x aur y = x² se ghira area?",
 "Ye x = 0, 1 par milte hain; ∫₀¹ (x − x²) dx = 1/2 − 1/3 = 1/6 ≈ ⟨0⟩."),
("Parabola aur x-axis", "y = 4x − x² aur x-axis ke beech area?",
 "Roots x = 0, 4; ∫₀⁴ (4x − x²) dx = 32 − 64/3 = 32/3 ≈ ⟨0⟩."),
("Ellipse", "x²/9 + y²/4 = 1 ka area?",
 "πab = 6π ≈ ⟨0⟩."),
("Sine arch", "0 se π tak y = sin x ke neeche area?",
 "[−cos x]₀^π = 1 + 1 = ⟨0⟩."),
("Latus rectum area", "y² = 12x aur uske latus rectum se ghira area?",
 "a = 3: 8a²/3 = 8 × 9/3 = ⟨0⟩."),
],
topics=[
("Sketching tips", "Intercepts, intersection points aur symmetry mark karo. Poochha gaya region shade karo; vertical strips (dx) ya horizontal strips (dy) chuno — jisme kam tukde lagein wo lo."),
("Curves crossing the axis", "[0, 2π] par y = sin x ka signed integral 0 hai par area 4. Hamesha |f(x)| use karo ya zeros par todo."),
("Modulus and greatest integer curves", "|x| ya [x] wale areas break points par tod kar nikaalte hain, aksar triangles aur rectangles bante hain jo geometry se nikal jaate hain."),
("Inequality regions", "{(x, y): x² ≤ y ≤ |x|} jaise regions ke liye boundary curves aur unke intersections pehchaano, phir upper minus lower integrate karo."),
("Area via definite integral properties", "Definite integrals ki King's property aur symmetry area calculations aasaan kar sakti hain."),
("Area between a curve and the y-axis", "y = c se y = d tak x = g(y) ke liye g(y) dy integrate karo. Example: y = 0 se 2 tak x = y² aur y-axis ke beech area 8/3 hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
