from lib import F, X, T, sig, fx, build
import math
import sympy as sp

g = 10
W1 = 3 * 2 + 4 * 1
x = sp.symbols("x"); W2 = float(sp.integrate(3 * x ** 2, (x, 0, 2)))
U3 = 0.5 * 200 * 0.1 ** 2; v3 = math.sqrt(2 * U3 / 0.5)
P4 = 100 * g * 2
vb5 = math.sqrt(5 * g * 1); vt5 = math.sqrt(g * 1); dT5 = 6 * 0.5 * g
v1_6 = (2 - 1) / (2 + 1) * 3; v2_6 = 2 * 2 / (2 + 1) * 3
v7 = 2 * 3 / 3; loss7 = 0.5 * 2 * 9 - 0.5 * 3 * v7 ** 2
h8 = 0.6 ** 2 * 5
s9 = 10 ** 2 / (2 * 0.25 * g)
px, py = 2 * 3, 3 * 2; v10 = math.hypot(px, py) / 5; ang10 = math.degrees(math.atan2(py, px))
W11 = 2 * g * 5; Wf11 = 0.5 * 2 * 8 ** 2 - W11  # 2 kg falls 5 m, lands at 8 m/s -> work by air

DOC = {
"slug": "work-energy-and-power", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Work, Energy and Power", "JEE": "Work, Energy and Power"},
"title": "Work, Energy and Power", "readMinutes": 20,
"summary": [
"Kaam (work) tab hota hai jab force ke direction mein displacement ho: W = F·s = Fs cosθ. Force perpendicular ho (circular motion mein centripetal, normal force) to kaam zero. Kaam negative bhi ho sakta hai (friction).",
"Work–energy theorem sabse bada shortcut hai: SAARE forces ka kaam = KE ka badlaav. Isse force ke time-dependence mein jaaye bina speed nikal jaati hai.",
"Conservative force (gravity, spring, electric) ka kaam path par depend nahi karta aur iske liye potential energy U define hoti hai: F = −dU/dx. Sirf conservative forces kaam karein to mechanical energy (KE + PE) constant rehti hai. Friction non-conservative hai — energy heat ban jaati hai.",
"Power = kaam karne ki rate, P = dW/dt = F·v. Collision mein momentum hamesha conserve (agar external force nahi), lekin KE sirf elastic collision mein; coefficient of restitution e batata hai takkar kitni elastic thi."
],
"formulas": [
F("Work by a constant force", "W = F·s = Fs cosθ = F_x s_x + F_y s_y + F_z s_z", "Constant force, seedha displacement.", "θ force aur DISPLACEMENT ke beech ka angle hai, force aur surface ke beech ka nahi."),
F("Work by a variable force", "W = ∫F dx = F–x graph ke neeche ka area", "Force position ke saath badle (spring, F = kx²).", "Graph mein x-axis ke neeche ka area negative kaam hai."),
F("Kinetic energy", "K = ½mv² = p²/2m", "Speed ya momentum se energy.", "Same momentum par halki body ki KE zyada hoti hai — ulta mat socho."),
F("Work–energy theorem", "W_all forces = ΔK = K_f − K_i", "Friction, air resistance, variable force ke saath speed.", "SAARE forces ka kaam jodo (gravity, friction, normal, applied), sirf ek ka nahi.", None, "PYQ favourite"),
F("Gravitational potential energy (near earth)", "U = mgh  (h reference level se)", "Height badalne par energy.", "Reference level kahin bhi lo, ΔU same aata hai — absolute U ka matlab nahi."),
F("Spring potential energy", "F = −kx;   U = ½kx²;   x₁ se x₂ tak spring ka kaam = ½k(x₁² − x₂²)", "Spring compress/stretch.", "x natural length se naapo, poori lambai nahi."),
F("Force from potential energy", "F = −dU/dx;   equilibrium: dU/dx = 0;   stable: d²U/dx² > 0, unstable: < 0", "U(x) graph/function diya ho.", "Minus sign bhool jaate hain: force U ghatne ki direction mein lagta hai."),
F("Conservation of mechanical energy", "K_i + U_i = K_f + U_f  (sirf conservative forces kaam karein)", "Pendulum, roller coaster, spring–block.", "Friction ho to yeh seedha nahi lagta — W_friction ko jodo."),
F("Power", "P_avg = W/t;   P = dW/dt = F·v = Fv cosθ;   1 hp = 746 W", "Motor, engine, pump.", "kWh energy ki unit hai, power ki nahi (1 kWh = 3.6 × 10⁶ J)."),
F("Vertical circle (string)", "Bottom par min speed √(5gl);  top par min √(gl);  T_bottom − T_top = 6mg", "String se bandhi ball ka poora chakkar.", "Rod (string nahi) ho to top par min speed 0 aur bottom par √(4gl).", None, "PYQ favourite"),
F("Elastic collision in 1-D", "v₁ = [(m₁ − m₂)u₁ + 2m₂u₂]/(m₁ + m₂);   v₂ = [(m₂ − m₁)u₂ + 2m₁u₁]/(m₁ + m₂)", "Momentum + KE dono conserve.", "Equal masses mein velocities exchange ho jaati hain — formula lagaane ki zaroorat nahi."),
F("Perfectly inelastic collision", "v = (m₁u₁ + m₂u₂)/(m₁ + m₂);   KE loss = m₁m₂(u₁ − u₂)² / [2(m₁ + m₂)]", "Takkar ke baad chipak jaayein.", "KE conserve maan lena galat — momentum hi conserve hai."),
F("Coefficient of restitution", "e = (separation speed)/(approach speed) = (v₂ − v₁)/(u₁ − u₂);   e = 1 elastic, e = 0 perfectly inelastic", "Partial elastic collision, bouncing ball.", "Velocities ke sign dhyan se — approach aur separation dono positive lo."),
F("Bouncing ball", "Rebound height h₁ = e²h;   nth rebound hₙ = e²ⁿh", "Ball giraake uchhalna.", "Speed e guna hoti hai, height e² guna — dono mix mat karo."),
F("Collision in 2-D", "Har direction mein alag: Σp_x conserve, Σp_y conserve.  Equal masses, elastic, ek rest par ⇒ baad mein 90° par alag", "Oblique takkar.", "Speed ko seedha jodna galat — vector (components) mein jodo."),
],
"examples": [
X("Dot product se kaam", "F = (3î + 4ĵ) N, displacement s = (2î + ĵ) m. Kaam?",
  f"W = F·s = 3 × 2 + 4 × 1 = {fx(W1)} J.", [(fx(W1), "10")]),
X("Variable force", "F = 3x² N (x metre mein). x = 0 se 2 m tak kaam?",
  f"W = ∫₀² 3x² dx = [x³]₀² = {fx(W2)} J.", [(fx(W2), "8")]),
X("Spring se block", "k = 200 N/m wala spring 0.1 m compress karke 0.5 kg block chhoda (smooth floor). Spring energy aur block ki speed?",
  f"U = ½kx² = ½ × 200 × 0.01 = {fx(U3)} J. ½mv² = 1 ⇒ v = √(2/0.5) = {fx(v3)} m/s.",
  [(fx(U3), "1"), (fx(v3), "2")]),
X("Motor ki power", "Motor 100 kg ko 2 m/s ki constant speed se upar uthata hai (g = 10). Power?",
  f"Constant speed ⇒ F = mg = 1000 N. P = Fv = 1000 × 2 = {fx(P4)} W (≈ 2.7 hp).",
  [(fx(P4), "2000")]),
X("Vertical circle", "1 m lambi string se bandhi 0.5 kg ball ko vertical circle poora karna hai (g = 10). Bottom aur top par min speed, aur tension ka fark?",
  f"Bottom: √(5gl) = √50 ≈ {fx(vb5)} m/s. Top: √(gl) = √10 ≈ {fx(vt5)} m/s. T_bottom − T_top = 6mg = {fx(dT5)} N.",
  [(fx(vb5), "7.07"), (fx(vt5), "3.16"), (fx(dT5), "30")]),
X("Elastic takkar", "2 kg block 3 m/s se rest par rakhe 1 kg block se elastic takkar karta hai. Dono ki final velocity?",
  f"v₁ = (2 − 1)/(3) × 3 = {fx(v1_6)} m/s,  v₂ = 2 × 2/3 × 3 = {fx(v2_6)} m/s (aage). Check: p = 2 + 4 = 6 ✓, KE = 1 + 8 = 9 J ✓.",
  [(fx(v1_6), "1"), (fx(v2_6), "4")]),
X("Chipakne wali takkar", "2 kg block 3 m/s se rest par rakhe 1 kg se takrakar chipak jaata hai. Common velocity aur KE loss?",
  f"v = 6/3 = {fx(v7)} m/s. KE pehle 9 J, baad mein ½ × 3 × 4 = 6 J ⇒ loss = {fx(loss7)} J (heat/sound).",
  [(fx(v7), "2"), (fx(loss7), "3")]),
X("Uchhalti ball", "Ball 5 m se giri, e = 0.6. Pehli rebound height?",
  f"h₁ = e²h = 0.36 × 5 = {fx(h8)} m.", [(fx(h8), "1.8")]),
X("Friction se rukna", "2 kg block 10 m/s se rough floor (μ_k = 0.25) par phisalta hai. Kitni door jaake rukega?",
  f"Work–energy: μmg·s = ½mv² ⇒ s = v²/(2μg) = 100/5 = {fx(s9)} m. (Mass cancel.)",
  [(fx(s9), "20")]),
X("2-D chipakne wali takkar", "2 kg body 3 m/s se east aur 3 kg body 2 m/s se north mein takrakar chipak jaati hain. Final velocity?",
  f"p_x = 6, p_y = 6 kg·m/s ⇒ v = √(36 + 36)/5 ≈ {fx(v10,1)} m/s, direction east se {fx(ang10)}° north ki taraf.",
  [(fx(v10,1), "1.7"), (fx(ang10), "45")]),
X("Air resistance ka kaam", "2 kg patthar 5 m upar se gira aur zameen par 8 m/s se pahuncha (g = 10). Air resistance ne kitna kaam kiya?",
  f"W_gravity = mgh = {fx(W11)} J. ΔK = ½ × 2 × 64 = 64 J. W_air = 64 − 100 = {fx(Wf11)} J (negative — energy cheeni).",
  [(fx(W11), "100"), (fx(Wf11), "−36")]),
],
"topics": [
T("Kaam kab zero, positive, negative", "θ < 90° positive (force motion mein madad), θ = 90° zero (normal force, centripetal force, coolie sir par bojh lekar horizontal chale to gravity ka kaam), θ > 90° negative (friction, upar phenki ball par gravity)."),
T("Kinetic aur potential energy", "KE motion ki energy, hamesha ≥ 0. PE position/configuration ki energy (height, spring ka khinchav) — sirf conservative force ke liye define hoti hai. Unit joule; 1 eV = 1.6 × 10⁻¹⁹ J."),
T("Work–energy theorem", "Net kaam = ΔKE. Yeh Newton ke doosre niyam ka integral roop hai. Variable force, curved path, friction — sab mein speed nikalne ka sabse fast tarika."),
T("Conservative vs non-conservative forces", "Conservative: kaam path-independent, closed loop mein kaam zero, PE define hoti hai (gravity, spring, electrostatic). Non-conservative: kaam path par depend, energy heat mein jaati hai (friction, air drag, viscous force)."),
T("Potential energy of a spring", "Spring ko x khinchne mein kaam ½kx² lagta hai jo PE ban kar store hota hai. Spring force restoring hai (F = −kx). Do springs: series mein 1/k = 1/k₁ + 1/k₂, parallel mein k = k₁ + k₂."),
T("Motion in a vertical circle", "Upar jaate hue speed ghatti hai (KE → PE). String slack na ho iske liye top par T ≥ 0 ⇒ v_top ≥ √(gl), aur energy se v_bottom ≥ √(5gl). Horizontal position par tension = mv²/l."),
T("Collisions: elastic aur inelastic", "Har collision mein (external force na ho to) momentum conserve. Elastic mein KE bhi conserve (e = 1) — atomic/ideal billiard. Inelastic mein KE ka kuch hissa heat/sound/deformation. Perfectly inelastic mein bodies chipak jaati hain aur max KE loss hota hai."),
T("Collisions in two dimensions", "x aur y momentum alag-alag conserve karo. Equal masses ka elastic oblique collision (ek rest par) — dono 90° par alag hote hain (billiards). Head-on (1-D) mein sab ek line par."),
],
"ratta": [
"W = Fs cosθ;  W_net = ΔK.",
"F = −dU/dx;  spring U = ½kx².",
"P = F·v;  1 hp = 746 W;  1 kWh = 3.6 × 10⁶ J.",
"Vertical circle (string): √(5gl) bottom, √(gl) top, ΔT = 6mg.",
"Equal mass elastic 1-D: velocities exchange.",
"Perfectly inelastic: max KE loss, e = 0.",
"Bounce: h₁ = e²h.",
"K = p²/2m.",
],
}

SYLLABUS = [
("Work done by a constant force and a variable force", ["constant force", "variable force"]),
("Kinetic and potential energies", ["Kinetic energy", "potential energy"]),
("Work-energy theorem", ["Work–energy theorem"]),
("Power", ["Power"]),
("Potential energy of a spring", ["Spring potential energy"]),
("Conservation of mechanical energy", ["Conservation of mechanical energy"]),
("Conservative and non-conservative forces", ["Conservative", "non-conservative"]),
("Motion in a vertical circle", ["vertical circle"]),
("Elastic and inelastic collisions in one and two dimensions", ["Elastic collision", "inelastic", "2-D"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
