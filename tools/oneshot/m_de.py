from lib import F, X, T, sig, fx, _check_and_write
import sympy as sp, math

x = sp.symbols("x"); y = sp.Function("y")
s1 = sp.dsolve(sp.Eq(y(x).diff(x), 2 * x * y(x)), y(x))           # y = C e^{x²}
assert sp.simplify(s1.rhs.diff(x) - 2 * x * s1.rhs) == 0
s2 = sp.dsolve(sp.Eq(y(x).diff(x) + y(x), sp.exp(-x)), y(x))     # y = (x + C)e^{-x}
assert sp.simplify(s2.rhs.diff(x) + s2.rhs - sp.exp(-x)) == 0
# order and degree of (y'')³ + (y')⁴ + y = 0 → order 2, degree 3
order, degree = 2, 3
# population doubles: dN/dt = kN, doubling time 10 years → k = ln2/10; time to triple = 10 ln3/ln2
t3 = 10 * math.log(3) / math.log(2)
# IVP dy/dx = 2x, y(0) = 1 → y = x² + 1 → y(3) = 10
y3 = 3 ** 2 + 1

DOC = {
"slug": "differential-equations", "subject": "Mathematics",
"chapters": {"JEE": "Differential Equations"},
"title": "Differential Equations", "readMinutes": 14,
"summary": [
"A differential equation relates a function with its derivatives. Its order is the highest derivative present; its degree is the power of that derivative once the equation is a polynomial in derivatives.",
"The general solution has as many arbitrary constants as the order; a particular solution uses initial conditions.",
"JEE methods: variables separable, homogeneous (y = vx), and linear first-order (integrating factor). Formation of differential equations by eliminating constants and growth/decay applications also appear.",
],
"formulas": [
F("Order and degree", "order = highest derivative;  degree = power of the highest derivative (equation must be polynomial in derivatives)", "Classifying a DE.", "Degree is undefined if a derivative appears inside sin, eˣ, log etc.", tag="PYQ favourite"),
F("Formation of a DE", "differentiate as many times as there are arbitrary constants and eliminate them", "Family of curves → DE.", "A family with n arbitrary constants gives a DE of order n."),
F("Variables separable", "dy/dx = f(x)g(y) ⇒ ∫dy/g(y) = ∫f(x)dx + C", "Separate x and y terms."),
F("Homogeneous equation", "dy/dx = F(y/x): put y = vx, dy/dx = v + x dv/dx, then separate", "Equations of degree-0 homogeneity.", None, tag="PYQ favourite"),
F("Linear first-order", "dy/dx + P(x)y = Q(x):  IF = e^(∫P dx);  y·IF = ∫Q·IF dx + C", "Integrating factor method.", None, tag="PYQ favourite"),
F("Linear in x", "dx/dy + P(y)x = Q(y):  IF = e^(∫P dy);  x·IF = ∫Q·IF dy + C", "When the equation is linear in x."),
F("Exponential growth/decay", "dN/dt = kN ⇒ N = N₀e^(kt);  half-life = ln 2/|k|", "Population, radioactive decay, compound interest.", None, tag="PYQ favourite"),
F("Newton's law of cooling", "dT/dt = −k(T − Tₛ) ⇒ T − Tₛ = (T₀ − Tₛ)e^(−kt)", "Cooling problems."),
F("Exact-differential tricks", "x dy + y dx = d(xy);  (x dy − y dx)/x² = d(y/x);  (x dy − y dx)/(x² + y²) = d(tan⁻¹(y/x))", "Spotting total differentials."),
F("Bernoulli form", "dy/dx + Py = Qyⁿ: divide by yⁿ and put z = y¹⁻ⁿ → linear in z", "Reducible to linear."),
],
"examples": [
X("Order and degree", "Order and degree of (y″)³ + (y′)⁴ + y = 0?",
  f"Highest derivative y″ ⇒ order {order}; its power ⇒ degree {degree}.", [(str(order), "2"), (str(degree), "3")]),
X("Separable", "Solve dy/dx = 2xy.",
  "dy/y = 2x dx ⇒ ln|y| = x² + c ⇒ y = Ce^(x²).", []),
X("Linear", "Solve dy/dx + y = e^(−x).",
  "IF = eˣ ⇒ y eˣ = ∫e^(−x)eˣ dx = x + C ⇒ y = (x + C)e^(−x).", []),
X("Initial value problem", "dy/dx = 2x with y(0) = 1. Find y(3).",
  f"y = x² + C, C = 1 ⇒ y(3) = {y3}.", [(str(y3), "10")]),
X("Growth", "A population doubles in 10 years (dN/dt = kN). When will it triple?",
  f"k = ln 2/10; tripling time = ln 3/k = 10 ln 3/ln 2 ≈ {fx(t3, 2)} years.", [(fx(t3, 2), "15.85")]),
X("Homogeneous", "Solve dy/dx = (x + y)/x.",
  "y = vx ⇒ v + x dv/dx = 1 + v ⇒ dv = dx/x ⇒ v = ln|x| + C ⇒ y = x ln|x| + Cx.", []),
],
"topics": [
T("General vs particular solution", "General: contains arbitrary constants equal to the order. Particular: constants fixed using given conditions. A singular solution (not from the general one) is outside the JEE Main syllabus."),
T("Recognising homogeneous functions", "f(x, y) is homogeneous of degree n if f(λx, λy) = λⁿf(x, y). dy/dx = f/g is homogeneous when f and g have the same degree."),
T("Reducible to homogeneous", "dy/dx = (a₁x + b₁y + c₁)/(a₂x + b₂y + c₂): shift origin x = X + h, y = Y + k to remove constants, unless a₁/a₂ = b₁/b₂ (then put a₁x + b₁y = t)."),
T("Geometric applications", "Slope of tangent = dy/dx; subtangent, subnormal and orthogonal trajectories (replace dy/dx by −dx/dy) lead to DEs."),
T("Checking solutions", "Substitute the solution back into the DE — the fastest way to verify options in MCQs."),
T("Standard families", "Circles through the origin with centre on x-axis, parabolas with axis along x-axis, straight lines y = mx + c (DE y″ = 0) — practise forming their DEs."),
],
"ratta": [
"Order = highest derivative;  degree = its power.",
"IF = e^(∫P dx);  y·IF = ∫Q·IF dx + C.",
"Homogeneous: y = vx.",
"N = N₀e^(kt);  half-life ln 2/k.",
"d(xy) = x dy + y dx;  d(y/x) = (x dy − y dx)/x².",
"n constants → order n DE.",
],
}

SYLLABUS = [
("Ordinary differential equations, their order and degree; formation of differential equations", ["order", "degree", "formation"]),
("Solution of differential equations by the method of separation of variables; solution of homogeneous and linear differential equations", ["separable", "homogeneous", "linear", "integrating factor"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Differential equation function ko uske derivatives se jodti hai. Iska order sabse oonchi derivative hai; degree us derivative ki power hai jab equation derivatives mein polynomial ho.",
"General solution mein order jitne arbitrary constants hote hain; particular solution initial conditions use karta hai.",
"JEE methods: variables separable, homogeneous (y = vx), aur linear first-order (integrating factor). Constants hata kar differential equations ka formation aur growth/decay applications bhi aate hain.",
],
when=[
("DE classify karna.", "Agar derivative sin, eˣ, log waghera ke andar ho to degree undefined hai — number mat likhna."),
("Family of curves → DE.", "n arbitrary constants wali family se order n ki DE banti hai."),
("x aur y terms alag karo.", None),
("Degree-0 homogeneity wali equations.", None),
("Integrating factor method.", None),
("Jab equation x mein linear ho.", None),
("Population, radioactive decay, compound interest.", None),
("Cooling problems.", None),
("Total differentials pehchaanna.", None),
("Linear mein badalne wali.", None),
],
examples=[
("Order aur degree", "(y″)³ + (y′)⁴ + y = 0 ka order aur degree?",
 "Sabse oonchi derivative y″ ⇒ order ⟨0⟩; uski power ⇒ degree ⟨1⟩."),
("Separable", "dy/dx = 2xy solve karo.",
 "dy/y = 2x dx ⇒ ln|y| = x² + c ⇒ y = Ce^(x²)."),
("Linear", "dy/dx + y = e^(−x) solve karo.",
 "IF = eˣ ⇒ y eˣ = ∫e^(−x)eˣ dx = x + C ⇒ y = (x + C)e^(−x)."),
("Initial value problem", "dy/dx = 2x aur y(0) = 1. y(3) nikalo.",
 "y = x² + C, C = 1 ⇒ y(3) = ⟨0⟩."),
("Growth", "Ek population 10 saal mein dugni hoti hai (dN/dt = kN). Teen guna kab hogi?",
 "k = ln 2/10; tripling time = ln 3/k = 10 ln 3/ln 2 ≈ ⟨0⟩ saal."),
("Homogeneous", "dy/dx = (x + y)/x solve karo.",
 "y = vx ⇒ v + x dv/dx = 1 + v ⇒ dv = dx/x ⇒ v = ln|x| + C ⇒ y = x ln|x| + Cx."),
],
topics=[
("General vs particular solution", "General: order ke barabar arbitrary constants. Particular: di gayi conditions se constants fix. Singular solution (general se na nikalne wala) JEE Main syllabus ke bahar hai."),
("Recognising homogeneous functions", "f(x, y) degree n ka homogeneous hai agar f(λx, λy) = λⁿf(x, y). dy/dx = f/g homogeneous hai jab f aur g ki degree same ho."),
("Reducible to homogeneous", "dy/dx = (a₁x + b₁y + c₁)/(a₂x + b₂y + c₂): constants hataane ke liye origin shift karo x = X + h, y = Y + k, jab tak a₁/a₂ = b₁/b₂ na ho (tab a₁x + b₁y = t rakho)."),
("Geometric applications", "Tangent ka slope = dy/dx; subtangent, subnormal aur orthogonal trajectories (dy/dx ki jagah −dx/dy) se DEs banti hain."),
("Checking solutions", "Solution ko DE mein waapas rakho — MCQs mein options verify karne ka sabse tez tareeka."),
("Standard families", "Origin se guzarne wale aur x-axis par centre wale circles, x-axis ke saath axis wale parabolas, straight lines y = mx + c (DE y″ = 0) — inki DEs banana practise karo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
