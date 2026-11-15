from lib import F, X, T, sig, fx, _check_and_write
import math

r1 = 0.5 * 2.8e-3                                         # 2N2O5 → 4NO2 + O2
k2 = 0.693 / 30                                           # t½ = 30 min
t3 = 2.303 / k2 * math.log10(100 / 10)                    # 90% completion
f4 = 2 ** 2                                               # rate ∝ [A]²: doubling → 4×
Ea5 = 2.303 * 8.314 * math.log10(2) * (300 * 310 / 10) / 1000
t6 = 6.909 / 0.693                                        # 99.9% vs t½
th7 = 0.5 / (2 * 0.01)                                    # zero order t½ = [A]0/2k
ord8 = 2                                                  # rate ×4 when [A] ×2 → order 2

DOC = {
"slug": "chemical-kinetics", "subject": "Chemistry",
"chapters": {"NEET": "Chemical Kinetics", "JEE": "Chemical Kinetics"},
"title": "Chemical Kinetics", "readMinutes": 13,
"summary": [
"Chemical kinetics is about how fast reactions go. Rate = change in concentration per unit time, divided by the stoichiometric coefficient so that it is the same for every species.",
"The rate law (rate = k[A]ˣ[B]ʸ) is found by experiment. The order (x + y) can be 0, fractional or whole; molecularity applies only to elementary steps and is always a whole number.",
"Integrated rate laws: zero order [A] = [A]₀ − kt (t½ ∝ [A]₀); first order ln([A]₀/[A]) = kt (t½ = 0.693/k, independent of concentration).",
"Rates rise sharply with temperature (Arrhenius: k = Ae^(−Ea/RT)) because more molecules have energy above Ea. Catalysts lower Ea without changing ΔH or equilibrium.",
],
"formulas": [
F("Rate of reaction", "for aA + bB → cC + dD:  rate = −(1/a)d[A]/dt = −(1/b)d[B]/dt = (1/c)d[C]/dt", "Relating rates of different species.", "Divide by the coefficient — the rate of disappearance of A is a × rate.", tag="PYQ favourite"),
F("Rate law", "rate = k[A]ˣ[B]ʸ;  order = x + y", "Effect of concentration on rate.", "x and y come from experiment, not from the balanced equation."),
F("Units of k", "(mol L⁻¹)¹⁻ⁿ s⁻¹:  zero order mol L⁻¹ s⁻¹;  first s⁻¹;  second L mol⁻¹ s⁻¹", "Identifying order from units."),
F("Zero-order reaction", "[A] = [A]₀ − kt;  t½ = [A]₀/2k", "Reactions on saturated catalyst surfaces, photochemical reactions.", "t½ increases with initial concentration for zero order."),
F("First-order reaction", "k = (2.303/t) log([A]₀/[A]);  t½ = 0.693/k", "Most decompositions, radioactive-type kinetics.", "t½ of a first-order reaction does not depend on initial concentration.", tag="PYQ favourite"),
F("First-order shortcuts", "t₇₅% = 2 t½;  t₈₇.₅% = 3 t½;  t₉₉.₉% ≈ 10 t½;  t₉₉% = 2 t₉₀%", "Quick timing questions."),
F("Pseudo-first-order", "a second-order reaction with one reactant in large excess behaves as first order", "Acid hydrolysis of esters, inversion of cane sugar."),
F("Arrhenius equation", "k = A e^(−Ea/RT);  log(k₂/k₁) = (Ea/2.303R)(1/T₁ − 1/T₂)", "Effect of temperature, finding Ea.", "Use kelvin, and R = 8.314 J mol⁻¹ K⁻¹ with Ea in joules."),
F("Temperature coefficient", "k(T + 10)/k(T) ≈ 2–3", "Rough rule of thumb."),
F("Collision theory", "rate = Z_AB e^(−Ea/RT) × P  (P = steric/orientation factor)", "Why only some collisions react."),
],
"examples": [
X("Relating rates", "2N₂O₅ → 4NO₂ + O₂. NO₂ forms at 2.8 × 10⁻³ mol L⁻¹ s⁻¹. Rate of disappearance of N₂O₅?",
  f"−d[N₂O₅]/dt = (2/4) × 2.8 × 10⁻³ = {sig(r1,2)} mol L⁻¹ s⁻¹.", [(sig(r1,2), "1.4 × 10⁻³")]),
X("Rate constant from half-life", "First-order t½ = 30 min. k?",
  f"k = 0.693/30 ≈ {fx(k2,4)} min⁻¹.", [(fx(k2,4), "0.0231")]),
X("Time for 90% completion", "Same reaction: time for 90% completion?",
  f"t = (2.303/k) log 10 = 2.303/0.0231 ≈ {fx(t3,1)} min.", [(fx(t3,1), "99.7")]),
X("Order from data", "Doubling [A] makes the rate four times. Order in A?",
  f"2ⁿ = {f4} → n = {ord8}.", [(str(ord8), "2")]),
X("Activation energy", "Rate doubles from 300 K to 310 K. Ea?",
  f"log 2 = (Ea/2.303R)(10/(300 × 310)) → Ea ≈ {fx(Ea5,1)} kJ/mol.", [(fx(Ea5,1), "53.6")]),
X("99.9% completion", "How many half-lives for 99.9% completion of a first-order reaction?",
  f"t₉₉.₉/t½ = (2.303 × 3)/0.693 ≈ {fx(t6,1)} ≈ 10.", [(fx(t6,1), "10")]),
X("Zero-order half-life", "Zero order, [A]₀ = 0.5 M, k = 0.01 mol L⁻¹ s⁻¹. t½?",
  f"t½ = [A]₀/2k = 0.5/0.02 = {fx(th7)} s.", [(fx(th7), "25")]),
],
"topics": [
T("Average and instantaneous rate", "Average rate = Δ[R]/Δt over an interval; instantaneous rate = slope of the concentration–time curve at a point. Rate usually decreases as reactants are used up."),
T("Factors affecting rate", "Concentration (or pressure), temperature, catalyst, surface area of solids, and light for photochemical reactions."),
T("Order vs molecularity", "Order is experimental, can be zero or fractional, and refers to the overall reaction. Molecularity is theoretical, a whole number (1, 2, rarely 3) and defined only for elementary steps. For complex reactions the slowest step decides the rate law."),
T("Graphs to identify order", "Zero order: [A] vs t is a straight line (slope −k). First order: ln[A] (or log[A]) vs t is a straight line (slope −k or −k/2.303). Rate vs [A] is flat for zero order and a straight line through the origin for first order."),
T("Activation energy and catalysts", "Only colliding molecules with energy ≥ Ea and the right orientation react. A catalyst provides a new path with lower Ea, speeds up forward and backward reactions equally, is not used up, and does not change ΔH, ΔG or K."),
T("Effect of temperature (Maxwell distribution)", "Raising T shifts the energy distribution so the fraction of molecules above Ea (the area beyond Ea) roughly doubles for every 10 K. ln k vs 1/T is a straight line with slope −Ea/R and intercept ln A."),
],
"ratta": [
"Rate = −(1/a)d[A]/dt;  order is experimental.",
"Units of k: (mol L⁻¹)¹⁻ⁿ s⁻¹.",
"Zero: t½ = [A]₀/2k;  first: t½ = 0.693/k (no [A]₀).",
"k = (2.303/t) log([A]₀/[A]).",
"t₉₉.₉ ≈ 10 t½;  t₇₅ = 2t½.",
"k = Ae^(−Ea/RT);  slope of ln k vs 1/T = −Ea/R.",
"Catalyst lowers Ea; no change in ΔH or K.",
],
}

SYLLABUS = [
("Rate of a chemical reaction, factors affecting the rate (concentration, temperature, pressure, catalyst)", ["rate", "factors", "catalyst"]),
("Elementary and complex reactions, order and molecularity, rate law, rate constant and its units", ["elementary", "order", "molecularity", "rate law", "units"]),
("Differential and integral forms of zero and first-order reactions, characteristics, half-lives", ["zero order", "first order", "half-life"]),
("Effect of temperature on the rate of reactions — Arrhenius theory, activation energy and its calculation", ["Arrhenius", "activation energy"]),
("Collision theory of bimolecular gaseous reactions (no derivation)", ["collision"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
