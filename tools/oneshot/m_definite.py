from lib import F, X, T, sig, fx, build
import sympy as sp
import mpmath as mp

x, t, n = sp.symbols("x t n", positive=True)
I = sp.integrate
pi = sp.pi

# ── every example verified (symbolic where possible, numeric otherwise) ──
ex1 = mp.quad(lambda u: mp.sin(u) / (mp.sin(u) + mp.cos(u)), [0, mp.pi / 2]); assert abs(ex1 - mp.pi / 4) < 1e-12
ex2 = I(x**3 * sp.cos(x), (x, -1, 1)); assert sp.simplify(ex2) == 0
ex3 = mp.quad(lambda u: u * mp.sin(u) / (1 + mp.cos(u) ** 2), [0, mp.pi]); assert abs(ex3 - mp.pi**2 / 4) < 1e-10
ex4 = sum(k for k in range(3)); assert ex4 == 3  # ∫0^3 [x] dx
ex5 = mp.quad(lambda u: abs(u), [-1, 0, 2]); assert abs(ex5 - 2.5) < 1e-12
ex6 = sp.diff(sp.Integral(sp.cos(t), (t, 0, x**2)).doit(), x); assert sp.simplify(ex6 - 2 * x * sp.cos(x**2)) == 0
ex7a = I(sp.sin(x) ** 5, (x, 0, pi / 2)); ex7b = I(sp.sin(x) ** 6, (x, 0, pi / 2))
assert ex7a == sp.Rational(8, 15) and sp.simplify(ex7b - 5 * pi / 32) == 0
r = sp.symbols("r", integer=True, positive=True)
ex8 = sp.limit(sp.summation(r**2, (r, 1, n)) / n**3, n, sp.oo); assert ex8 == sp.Rational(1, 3)
ex8b = mp.nsum(lambda k: 1000 / (1000**2 + k**2), [1, 1000]); assert abs(ex8b - mp.pi / 4) < 1e-3
ex9 = mp.quad(lambda u: mp.log(mp.sin(u)), [0, mp.pi / 2]); assert abs(ex9 + mp.pi / 2 * mp.log(2)) < 1e-10
ex10 = I(x * sp.exp(x), (x, 0, 1)); assert ex10 == 1

DOC = {
"slug": "definite-integrals", "subject": "Mathematics",
"chapters": {"JEE": "Definite Integrals"},
"title": "Definite Integrals", "readMinutes": 18,
"summary": [
"Definite integral ∫ₐᵇ f(x) dx ek number hai — graph ke neeche ka signed area (x-axis ke upar +, neeche −). Fundamental theorem: antiderivative F nikaalo, phir F(b) − F(a).",
"JEE mein zyaadatar sawal seedhe integrate karne ke bajaye PROPERTIES se hote hain: King's property (x → a + b − x), odd/even, periodic, aur break-points par todna (|x|, [x]).",
"Integral ke andar upper limit variable ho to Leibniz rule se differentiate karo. 'Limit of a sum' wale sawal ko ∫₀¹ f(x) dx mein badlo.",
"Kuch standard results ratta maar lo: Wallis formula (sinⁿ, cosⁿ), ∫₀^{π/2} log sin x dx = −(π/2) log 2, aur ∫₀^{π/2} sinⁿx/(sinⁿx + cosⁿx) dx = π/4."
],
"formulas": [
F("Fundamental theorem of calculus", "∫ₐᵇ f(x) dx = F(b) − F(a),   jahaan F′(x) = f(x)", "Har definite integral ka base.", "Constant C cancel ho jaata hai — likhne ki zaroorat nahi."),
F("Leibniz rule", "d/dx ∫_{g(x)}^{h(x)} f(t) dt = f(h(x)) h′(x) − f(g(x)) g′(x)", "Limits mein x ho to derivative.", "Andar ka x nahi, sirf limits par chain rule.", None, "PYQ favourite"),
F("Dummy variable and reversing limits", "∫ₐᵇ f(x) dx = ∫ₐᵇ f(t) dt;   ∫ₐᵇ f = −∫_b^a f;   ∫ₐᵃ f = 0", "Basic manipulations."),
F("Splitting the interval", "∫ₐᵇ f = ∫_a^c f + ∫_c^b f", "|x|, [x], max/min, piecewise functions.", "Break-points (jahaan andar ka sign/value badle) par hi todo."),
F("King's property", "∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx;   ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a − x) dx", "Jab x → (a + b − x) karne se expression 'pair' ban jaaye — I + I = 2I.", "Original aur naya integral JODO, phir 2 se divide.", None, "PYQ favourite"),
F("Even and odd functions", "∫₋ₐᵃ f = 2∫₀ᵃ f  (f even);   ∫₋ₐᵃ f = 0  (f odd)", "Symmetric limits.", "Pehle check: f(−x) = f(x) ya −f(x)?", None, "PYQ favourite"),
F("Property for 0 to 2a", "∫₀^{2a} f = 2∫₀ᵃ f  agar f(2a − x) = f(x);   = 0  agar f(2a − x) = −f(x)", "0 se π ya 0 se 2π wale trig integrals."),
F("Periodic functions", "f period T: ∫₀^{nT} f = n ∫₀ᵀ f;   ∫ₐ^{a+T} f = ∫₀ᵀ f", "|sin x|, {x}, sin²x jaise periodic functions.", "|sin x| ka period π hai, 2π nahi."),
F("Wallis formula", "∫₀^{π/2} sinⁿx dx = ∫₀^{π/2} cosⁿx dx = [(n−1)(n−3)…]/[n(n−2)…] × (π/2 agar n even, 1 agar n odd)", "sinⁿ ya cosⁿ, 0 se π/2.", None, None, "Ratta"),
F("Standard results", "∫₀^{π/2} log sin x dx = ∫₀^{π/2} log cos x dx = −(π/2) log 2;   ∫₀^{π/2} sinⁿx/(sinⁿx + cosⁿx) dx = π/4", "Seedhe use hote hain.", None, None, "Ratta"),
F("Limit as a sum", "lim_{n→∞} (1/n) Σ_{r=1}^{n} f(r/n) = ∫₀¹ f(x) dx;   general: ∫ₐᵇ f = lim h Σ f(a + rh),  h = (b − a)/n", "Lambi summation ki limit.", "r/n → x, 1/n → dx. Agar r 0 se n tak ya 1 se 2n tak ho to limits badal jaati hain (2n tak → 0 se 2)."),
F("Substitution in definite integrals", "x = g(t) ⇒ dx = g′(t) dt aur limits bhi badlo: a → g⁻¹(a), b → g⁻¹(b)", "Definite integral mein substitution.", "Limits badal li to wapas x mein jaane ki zaroorat nahi."),
F("Integration by parts (definite)", "∫ₐᵇ u v′ dx = [u v]ₐᵇ − ∫ₐᵇ u′ v dx", "Product wale integrals (x eˣ, x sin x, log x).", "ILATE se u chuno."),
F("Greatest integer and fractional part", "∫₀ⁿ [x] dx = 0 + 1 + … + (n − 1) = n(n − 1)/2;   ∫₀ⁿ {x} dx = n/2", "[x] aur {x} wale integrals.", "Har integer par todo."),
F("Bounds (estimation)", "m ≤ f ≤ M on [a, b] ⇒ m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a);   |∫ f| ≤ ∫ |f|", "'Integral kis range mein hai' wale sawal."),
],
"examples": [
X("King's property (pair)", "∫₀^{π/2} sin x / (sin x + cos x) dx = ?",
  "I = ∫ sin x/(sin x + cos x). x → π/2 − x: I = ∫ cos x/(cos x + sin x). Jodo: 2I = ∫₀^{π/2} 1 dx = π/2 ⇒ I = π/4.", []),
X("Odd function", "∫₋₁¹ x³ cos x dx = ?",
  "f(−x) = (−x)³ cos(−x) = −x³ cos x ⇒ odd ⇒ integral = 0. Bina integrate kiye.", []),
X("King + odd-even mix", "∫₀^π x sin x / (1 + cos²x) dx = ?",
  "x → π − x: I = ∫ (π − x) sin x/(1 + cos²x). Jodo: 2I = π ∫₀^π sin x/(1 + cos²x) dx. t = cos x: = π ∫₋₁¹ dt/(1 + t²) = π × π/2 ⇒ I = π²/4.", []),
X("Greatest integer", "∫₀³ [x] dx = ?",
  "[0, 1) par 0, [1, 2) par 1, [2, 3) par 2 ⇒ 0 + 1 + 2 = 3.", []),
X("Modulus todna", "∫₋₁² |x| dx = ?",
  "∫₋₁⁰ (−x) dx + ∫₀² x dx = 1/2 + 2 = 5/2.", []),
X("Leibniz rule", "d/dx ∫₀^{x²} cos t dt = ?",
  "f(h(x)) h′(x) = cos(x²) × 2x = 2x cos(x²).", []),
X("Wallis formula", "∫₀^{π/2} sin⁵x dx aur ∫₀^{π/2} sin⁶x dx?",
  "n = 5 (odd): (4/5)(2/3) × 1 = 8/15.   n = 6 (even): (5/6)(3/4)(1/2) × π/2 = 5π/32.", []),
X("Limit as sum", "lim_{n→∞} (1² + 2² + … + n²)/n³ aur lim_{n→∞} Σ_{r=1}^{n} n/(n² + r²) = ?",
  "Pehla: (1/n) Σ (r/n)² → ∫₀¹ x² dx = 1/3.  Doosra: (1/n) Σ 1/(1 + (r/n)²) → ∫₀¹ dx/(1 + x²) = π/4.", []),
X("Log-sine standard result", "∫₀^{π/2} log sin x dx = ?",
  "I = ∫ log sin x = ∫ log cos x (King). 2I = ∫₀^{π/2} log(sin 2x / 2) dx = ∫ log sin 2x − (π/2) log 2. 2x = t se pehla hissa I ban jaata hai ⇒ 2I = I − (π/2) log 2 ⇒ I = −(π/2) log 2.", []),
X("By parts", "∫₀¹ x eˣ dx = ?",
  "u = x, v′ = eˣ: [x eˣ]₀¹ − ∫₀¹ eˣ dx = e − (e − 1) = 1.", []),
],
"topics": [
T("Definite integral ka matlab", "Area under curve: chhote-chhote rectangles (width h, height f) ka sum, h → 0. Isliye 'limit of sum' aur integral ek hi cheez hain. x-axis ke neeche wala hissa negative gina jaata hai — asli area chahiye to |f| integrate karo."),
T("Property kab lagaye — quick checklist", "1) Limits −a se a? → odd/even check. 2) Limits 0 se a ya a se b, aur andar sin/cos ya x/(a+b−x) jaisa pair? → King. 3) Andar |…|, [x], {x}, max/min? → break-points par todo. 4) Periodic function aur bada interval? → period mein todo. 5) Limit of sum? → (1/n)Σ f(r/n)."),
T("King's property ka asli use", "Jab f(x) aur f(a + b − x) jod-ne par kuch simple bachta ho (jaise sin + cos, ya x + (π − x) = π). x wale factor ko hataane ke liye bhi (∫₀^π x f(sin x) dx = (π/2)∫₀^π f(sin x) dx)."),
T("Leibniz rule ke uses", "Limits mein x wale function ka derivative, maxima-minima, aur 'lim x→0 (∫₀ˣ …)/xⁿ' jaise 0/0 forms — L'Hospital + Leibniz saath mein."),
T("Limit as sum ko pehchaanna", "Summation ko (1/n) × f(r/n) ki shakal mein likho: n bahar nikaalo. r ki range 1 se n ⇒ 0 se 1; 1 se 2n ⇒ 0 se 2; n+1 se 2n ⇒ 1 se 2."),
T("Substitution mein limits", "Definite integral mein substitution karo to limits bhi naye variable mein badlo. Agar substitution one-one nahi (jaise t = sin x, 0 se π), to interval todna pad sakta hai."),
T("Area se connection", "Do curves ke beech area = ∫ (upar wala − neeche wala) dx, intersection points ke beech. Ye agle chapter (Application of Integrals) ka base hai."),
],
"ratta": [
"King: ∫ₐᵇ f(x) = ∫ₐᵇ f(a + b − x).",
"Odd → 0;  even → 2∫₀ᵃ.",
"∫₀^{π/2} sinⁿ/(sinⁿ + cosⁿ) = π/4.",
"∫₀^{π/2} log sin x = −(π/2) log 2.",
"Wallis: (n−1)(n−3)…/[n(n−2)…] × (π/2 if even).",
"∫₀^π x f(sin x) dx = (π/2) ∫₀^π f(sin x) dx.",
"∫₀ⁿ [x] dx = n(n − 1)/2;  ∫₀ⁿ {x} dx = n/2.",
"lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx.",
"Leibniz: f(h)h′ − f(g)g′.",
],
}

SYLLABUS = [
("Fundamental theorem of calculus", ["Fundamental theorem"]),
("Properties of definite integrals", ["King", "Even and odd", "Periodic", "Splitting"]),
("Evaluation of definite integrals", ["Substitution in definite", "by parts"]),
("Definite integral as limit of a sum", ["Limit as a sum"]),
("Link to areas bounded by simple curves", ["Area"]),
]

DOC_EN = {
"slug": "definite-integrals", "subject": "Mathematics",
"chapters": {"JEE": "Definite Integrals"},
"title": "Definite Integrals", "readMinutes": 18,
"summary": [
"A definite integral ∫ₐᵇ f(x) dx is a number — the signed area under the graph (positive above the x-axis, negative below). Fundamental theorem: find an antiderivative F, then F(b) − F(a).",
"Most JEE questions are solved with PROPERTIES rather than direct integration: King's property (x → a + b − x), odd/even, periodicity, and splitting at break points (|x|, [x]).",
"When the upper limit is a function of x, differentiate with the Leibniz rule. Turn 'limit of a sum' questions into ∫₀¹ f(x) dx.",
"Memorise a few standard results: Wallis' formula (sinⁿ, cosⁿ), ∫₀^{π/2} log sin x dx = −(π/2) log 2, and ∫₀^{π/2} sinⁿx/(sinⁿx + cosⁿx) dx = π/4.",
],
"formulas": [
F("Fundamental theorem of calculus", "∫ₐᵇ f(x) dx = F(b) − F(a),   where F′(x) = f(x)", "Basis of every definite integral.", "The constant C cancels — no need to write it."),
F("Leibniz rule", "d/dx ∫_{g(x)}^{h(x)} f(t) dt = f(h(x)) h′(x) − f(g(x)) g′(x)", "Derivative when the limits contain x.", "Apply the chain rule only to the limits, not to the variable inside.", None, "PYQ favourite"),
F("Dummy variable and reversing limits", "∫ₐᵇ f(x) dx = ∫ₐᵇ f(t) dt;   ∫ₐᵇ f = −∫_b^a f;   ∫ₐᵃ f = 0", "Basic manipulations."),
F("Splitting the interval", "∫ₐᵇ f = ∫_a^c f + ∫_c^b f", "|x|, [x], max/min, piecewise functions.", "Split only at break points (where the sign/value inside changes)."),
F("King's property", "∫ₐᵇ f(x) dx = ∫ₐᵇ f(a + b − x) dx;   ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a − x) dx", "When x → (a + b − x) makes a 'pair' — I + I = 2I.", "ADD the original and the new integral, then divide by 2.", None, "PYQ favourite"),
F("Even and odd functions", "∫₋ₐᵃ f = 2∫₀ᵃ f  (f even);   ∫₋ₐᵃ f = 0  (f odd)", "Symmetric limits.", "First check whether f(−x) = f(x) or −f(x).", None, "PYQ favourite"),
F("Property for 0 to 2a", "∫₀^{2a} f = 2∫₀ᵃ f  if f(2a − x) = f(x);   = 0  if f(2a − x) = −f(x)", "Trig integrals from 0 to π or 0 to 2π."),
F("Periodic functions", "f with period T: ∫₀^{nT} f = n ∫₀ᵀ f;   ∫ₐ^{a+T} f = ∫₀ᵀ f", "Periodic functions like |sin x|, {x}, sin²x.", "|sin x| has period π, not 2π."),
F("Wallis formula", "∫₀^{π/2} sinⁿx dx = ∫₀^{π/2} cosⁿx dx = [(n−1)(n−3)…]/[n(n−2)…] × (π/2 if n even, 1 if n odd)", "sinⁿ or cosⁿ from 0 to π/2.", None, None, "Ratta"),
F("Standard results", "∫₀^{π/2} log sin x dx = ∫₀^{π/2} log cos x dx = −(π/2) log 2;   ∫₀^{π/2} sinⁿx/(sinⁿx + cosⁿx) dx = π/4", "Used directly.", None, None, "Ratta"),
F("Limit as a sum", "lim_{n→∞} (1/n) Σ_{r=1}^{n} f(r/n) = ∫₀¹ f(x) dx;   general: ∫ₐᵇ f = lim h Σ f(a + rh),  h = (b − a)/n", "Limit of a long summation.", "r/n → x, 1/n → dx. If r runs from 0 to n or 1 to 2n, the limits change (up to 2n → 0 to 2)."),
F("Substitution in definite integrals", "x = g(t) ⇒ dx = g′(t) dt and change the limits too: a → g⁻¹(a), b → g⁻¹(b)", "Substitution in a definite integral.", "Once the limits are changed there's no need to return to x."),
F("Integration by parts (definite)", "∫ₐᵇ u v′ dx = [u v]ₐᵇ − ∫ₐᵇ u′ v dx", "Products (x eˣ, x sin x, log x).", "Choose u by ILATE."),
F("Greatest integer and fractional part", "∫₀ⁿ [x] dx = 0 + 1 + … + (n − 1) = n(n − 1)/2;   ∫₀ⁿ {x} dx = n/2", "Integrals of [x] and {x}.", "Split at every integer."),
F("Bounds (estimation)", "m ≤ f ≤ M on [a, b] ⇒ m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a);   |∫ f| ≤ ∫ |f|", "'In what range does the integral lie' questions."),
],
"examples": [
X("King's property (pair)", "∫₀^{π/2} sin x / (sin x + cos x) dx = ?",
  "I = ∫ sin x/(sin x + cos x). With x → π/2 − x: I = ∫ cos x/(cos x + sin x). Adding: 2I = ∫₀^{π/2} 1 dx = π/2 ⇒ I = π/4.", []),
X("Odd function", "∫₋₁¹ x³ cos x dx = ?",
  "f(−x) = (−x)³ cos(−x) = −x³ cos x ⇒ odd ⇒ integral = 0, without integrating.", []),
X("King + odd-even mix", "∫₀^π x sin x / (1 + cos²x) dx = ?",
  "x → π − x: I = ∫ (π − x) sin x/(1 + cos²x). Adding: 2I = π ∫₀^π sin x/(1 + cos²x) dx. With t = cos x: = π ∫₋₁¹ dt/(1 + t²) = π × π/2 ⇒ I = π²/4.", []),
X("Greatest integer", "∫₀³ [x] dx = ?",
  "On [0, 1) it is 0, on [1, 2) it is 1, on [2, 3) it is 2 ⇒ 0 + 1 + 2 = 3.", []),
X("Splitting a modulus", "∫₋₁² |x| dx = ?",
  "∫₋₁⁰ (−x) dx + ∫₀² x dx = 1/2 + 2 = 5/2.", []),
X("Leibniz rule", "d/dx ∫₀^{x²} cos t dt = ?",
  "f(h(x)) h′(x) = cos(x²) × 2x = 2x cos(x²).", []),
X("Wallis formula", "∫₀^{π/2} sin⁵x dx and ∫₀^{π/2} sin⁶x dx?",
  "n = 5 (odd): (4/5)(2/3) × 1 = 8/15.   n = 6 (even): (5/6)(3/4)(1/2) × π/2 = 5π/32.", []),
X("Limit as sum", "lim_{n→∞} (1² + 2² + … + n²)/n³ and lim_{n→∞} Σ_{r=1}^{n} n/(n² + r²) = ?",
  "First: (1/n) Σ (r/n)² → ∫₀¹ x² dx = 1/3.  Second: (1/n) Σ 1/(1 + (r/n)²) → ∫₀¹ dx/(1 + x²) = π/4.", []),
X("Log-sine standard result", "∫₀^{π/2} log sin x dx = ?",
  "I = ∫ log sin x = ∫ log cos x (King). 2I = ∫₀^{π/2} log(sin 2x / 2) dx = ∫ log sin 2x − (π/2) log 2. With 2x = t the first part becomes I ⇒ 2I = I − (π/2) log 2 ⇒ I = −(π/2) log 2.", []),
X("By parts", "∫₀¹ x eˣ dx = ?",
  "u = x, v′ = eˣ: [x eˣ]₀¹ − ∫₀¹ eˣ dx = e − (e − 1) = 1.", []),
],
"topics": [
T("Meaning of a definite integral", "Area under a curve: the sum of thin rectangles (width h, height f) as h → 0. So 'limit of a sum' and the integral are the same thing. The part below the x-axis counts negative — for actual area integrate |f|."),
T("When to use which property — quick checklist", "1) Limits from −a to a? → check odd/even. 2) Limits 0 to a or a to b with a sin/cos or x/(a+b−x) type pair? → King. 3) |…|, [x], {x}, max/min inside? → split at break points. 4) Periodic function over a long interval? → split into periods. 5) Limit of a sum? → (1/n)Σ f(r/n)."),
T("Real use of King's property", "When f(x) + f(a + b − x) simplifies (like sin + cos, or x + (π − x) = π). Also to remove a factor of x: ∫₀^π x f(sin x) dx = (π/2)∫₀^π f(sin x) dx."),
T("Uses of the Leibniz rule", "Derivatives of functions defined by integrals with x in the limits, maxima–minima, and 0/0 forms like lim x→0 (∫₀ˣ …)/xⁿ — L'Hôpital and Leibniz together."),
T("Recognising a limit of a sum", "Write the summation as (1/n) × f(r/n) by taking n outside. r from 1 to n ⇒ 0 to 1; 1 to 2n ⇒ 0 to 2; n+1 to 2n ⇒ 1 to 2."),
T("Limits under substitution", "When substituting in a definite integral, change the limits to the new variable. If the substitution isn't one-one (e.g. t = sin x on 0 to π), you may need to split the interval."),
T("Connection to area", "Area between two curves = ∫ (upper − lower) dx between the intersection points. This is the base of the next chapter (Application of Integrals)."),
],
"ratta": [
"King: ∫ₐᵇ f(x) = ∫ₐᵇ f(a + b − x).",
"Odd → 0;  even → 2∫₀ᵃ.",
"∫₀^{π/2} sinⁿ/(sinⁿ + cosⁿ) = π/4.",
"∫₀^{π/2} log sin x = −(π/2) log 2.",
"Wallis: (n−1)(n−3)…/[n(n−2)…] × (π/2 if even).",
"∫₀^π x f(sin x) dx = (π/2) ∫₀^π f(sin x) dx.",
"∫₀ⁿ [x] dx = n(n − 1)/2;  ∫₀ⁿ {x} dx = n/2.",
"lim (1/n) Σ f(r/n) = ∫₀¹ f(x) dx.",
"Leibniz: f(h)h′ − f(g)g′.",
],
}

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
