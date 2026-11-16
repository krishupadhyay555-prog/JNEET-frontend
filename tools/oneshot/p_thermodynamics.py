from lib import F, X, T, sig, fx, _check_and_write
import math

R = 8.314
W1 = 2 * R * 300 * math.log(2)                          # isothermal 2 mol, V doubles, 300 K
T2 = 300 * 8 ** (2 / 3)                                 # monoatomic adiabatic V → V/8
Q3 = 2 * 3.5 * R * 50; W3 = 2 * R * 50; U3 = Q3 - W3    # diatomic, isobaric, ΔT 50
W4 = 1e5 * (3e-3 - 1e-3)                                # isobaric work 1 atm, 1→3 L
P5 = 2 ** 1.4                                           # adiabatic diatomic V halves
U6 = 500 - 200                                          # first law
W7 = 0.5 * 1e5 * 1e-3                                   # triangle cycle P0V0/2 with P0=1e5, V0=1e-3
g8 = 1.5                                                # mixture 1 mol mono + 1 mol rigid diatomic

DOC = {
"slug": "thermodynamics", "subject": "Physics",
"chapters": {"NEET": "Thermodynamics", "JEE": "Thermodynamics"},
"title": "Thermodynamics", "readMinutes": 13,
"summary": [
"Zeroth law: two systems in thermal equilibrium with a third are in equilibrium with each other — this is what makes temperature meaningful.",
"First law: ΔQ = ΔU + ΔW (heat given = rise in internal energy + work done BY the gas). For an ideal gas U depends only on temperature.",
"Work done by a gas = area under the P–V curve. Isothermal, adiabatic, isobaric and isochoric processes each have their own simple formulas.",
"Second law: heat does not flow by itself from cold to hot, and no cyclic process can turn heat completely into work. Real processes are irreversible.",
],
"formulas": [
F("First law of thermodynamics", "ΔQ = ΔU + ΔW", "Every energy-balance question.", "Sign convention: heat given TO the gas +, work done BY the gas +. Don't mix conventions."),
F("Work done by a gas", "W = ∫ P dV = area under the P–V curve", "Any process drawn on a P–V diagram.", "In a cycle, work = area enclosed (clockwise on P–V → positive work)."),
F("Internal energy of an ideal gas", "ΔU = n Cv ΔT  (for ANY process)", "Change in internal energy.", "ΔU depends only on ΔT — use nCvΔT even for non-isochoric processes.", tag="PYQ favourite"),
F("Isothermal process (T constant)", "PV = constant;  ΔU = 0;  W = Q = nRT ln(V₂/V₁) = 2.303 nRT log(V₂/V₁)", "Slow processes in contact with a reservoir."),
F("Adiabatic process (Q = 0)", "PVᵞ = constant;  TVᵞ⁻¹ = constant;  W = (P₁V₁ − P₂V₂)/(γ − 1) = nR(T₁ − T₂)/(γ − 1)", "Fast processes or insulated containers.", "The adiabatic curve is steeper (slope −γP/V) than the isothermal one (−P/V).", tag="PYQ favourite"),
F("Isobaric process (P constant)", "W = PΔV = nRΔT;  Q = nCpΔT", "Heating at constant pressure."),
F("Isochoric process (V constant)", "W = 0;  Q = ΔU = nCvΔT", "Heating in a rigid container."),
F("Mayer's relation and γ", "Cp − Cv = R;   γ = Cp/Cv", "Linking the two molar heat capacities."),
F("Values of Cv and γ", "monoatomic: Cv = 3R/2, γ = 5/3;  diatomic (rigid): Cv = 5R/2, γ = 7/5;  polyatomic (non-linear, rigid): Cv = 3R, γ = 4/3", "Choosing γ in a problem."),
F("γ of a mixture", "Cv(mix) = (n₁Cv₁ + n₂Cv₂)/(n₁ + n₂);  γ = (Cv + R)/Cv", "Mixtures of gases."),
F("Fraction of heat turned into work (isobaric)", "W/Q = nRΔT/(nCpΔT) = R/Cp = 1 − 1/γ", "Diatomic gas: 2/7 of the heat becomes work.", None),
F("Cyclic process", "ΔU = 0 over a cycle ⇒ Q_net = W_net = area of the loop", "Cycles drawn on P–V diagrams."),
],
"examples": [
X("Isothermal expansion", "2 mol of an ideal gas expand isothermally at 300 K to double the volume. Work done (ln 2 = 0.693)?",
  f"W = nRT ln 2 = 2 × 8.314 × 300 × 0.693 ≈ {fx(W1,0)} J (= heat absorbed, since ΔU = 0).", [(fx(W1,0), "3458")]),
X("Adiabatic compression", "A monoatomic gas at 300 K is compressed adiabatically to one-eighth of its volume. Final temperature?",
  f"TVᵞ⁻¹ = constant, γ − 1 = 2/3: T₂ = 300 × 8^(2/3) = 300 × 4 = {fx(T2,0)} K.", [(fx(T2,0), "1200")]),
X("Isobaric heating of a diatomic gas", "2 mol of a diatomic gas are heated by 50 K at constant pressure. Q, W and ΔU?",
  f"Q = nCpΔT = 2 × 3.5 × 8.314 × 50 ≈ {fx(Q3,0)} J; W = nRΔT ≈ {fx(W3,0)} J; ΔU = Q − W ≈ {fx(U3,0)} J.", [(fx(Q3,0), "2910"), (fx(W3,0), "831"), (fx(U3,0), "2078")]),
X("Work at constant pressure", "A gas expands from 1 L to 3 L at 10⁵ Pa. Work done?",
  f"W = PΔV = 10⁵ × 2 × 10⁻³ = {fx(W4)} J.", [(fx(W4), "200")]),
X("Adiabatic pressure change", "A diatomic gas (γ = 1.4) is compressed adiabatically to half its volume. By what factor does the pressure rise?",
  f"P₂/P₁ = 2^1.4 ≈ {fx(P5,2)} (more than the isothermal factor 2).", [(fx(P5,2), "2.64")]),
X("First law in one line", "A gas absorbs 500 J of heat and does 200 J of work. Change in internal energy?",
  f"ΔU = Q − W = 500 − 200 = {fx(U6)} J (temperature rises).", [(fx(U6), "300")]),
X("Work in a triangular cycle", "A gas goes A(P₀, V₀) → B(2P₀, V₀) → C(2P₀, 2V₀) → back to A along a straight line, with P₀ = 10⁵ Pa and V₀ = 1 L. Net work?",
  f"Work = area of the triangle = ½ × V₀ × P₀ = ½ × 10⁻³ × 10⁵ = {fx(W7)} J.", [(fx(W7), "50")]),
X("γ of a mixture", "1 mol of a monoatomic gas is mixed with 1 mol of a rigid diatomic gas. γ of the mixture?",
  f"Cv = (3R/2 + 5R/2)/2 = 2R, Cp = 3R, γ = 3/2 = {fx(g8,1)}.", [(fx(g8,1), "1.5")]),
],
"topics": [
T("System, surroundings and state", "A system is the part we study; everything else is the surroundings. State variables (P, V, T, U) describe equilibrium states. Extensive variables depend on size (V, U, mass); intensive ones don't (P, T, density)."),
T("Thermal equilibrium and the zeroth law", "If A is in equilibrium with C and B is in equilibrium with C, then A and B are in equilibrium. A thermometer works because of this law."),
T("Heat, work and internal energy", "Heat and work are energy in transit and depend on the path. Internal energy is a state function: in an ideal gas it is purely the kinetic energy of molecules and depends only on T."),
T("Reading P–V diagrams", "Isobaric: horizontal line; isochoric: vertical line; isothermal: hyperbola; adiabatic: steeper curve. Expansion (V increasing) → W positive; compression → W negative."),
T("Quasi-static processes", "A process done infinitely slowly so the system is always in equilibrium. Only quasi-static processes can be drawn as curves on a P–V diagram and can be reversible."),
T("Reversible and irreversible processes", "A reversible process can be run backwards so that both system and surroundings return exactly to the start. Friction, free expansion, heat flow across a finite temperature difference and mixing make processes irreversible. All natural processes are irreversible."),
T("Second law of thermodynamics", "Kelvin–Planck: no process whose only result is converting heat completely into work. Clausius: no process whose only result is transferring heat from a colder to a hotter body. Both statements are equivalent."),
T("Syllabus note", "The current NTA syllabus lists the zeroth, first and second laws, processes and reversible/irreversible processes. Heat-engine/refrigerator details and the Carnot cycle are not listed separately, so practise the first law and P–V work most."),
],
"ratta": [
"ΔQ = ΔU + ΔW;  ΔU = nCvΔT always.",
"Isothermal: W = nRT ln(V₂/V₁);  adiabatic: PVᵞ = const, W = nRΔT/(γ − 1).",
"Isobaric: W = nRΔT;  isochoric: W = 0.",
"Cp − Cv = R;  γ = 5/3, 7/5, 4/3.",
"Work = area under P–V;  cycle → area enclosed.",
"Adiabatic slope = γ × isothermal slope.",
"Natural processes are irreversible.",
],
}

SYLLABUS = [
("Thermal equilibrium, zeroth law, concept of temperature", ["zeroth", "equilibrium"]),
("Heat, work and internal energy; first law", ["first law", "internal energy", "work"]),
("Isothermal and adiabatic processes", ["isothermal", "adiabatic"]),
("Second law: reversible and irreversible processes", ["second law", "reversible", "irreversible"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Zeroth law: do systems agar teesre ke saath thermal equilibrium mein hain to aapas mein bhi equilibrium mein hain — isi se temperature ka matlab banta hai.",
"First law: ΔQ = ΔU + ΔW (di gayi heat = internal energy mein badhat + gas dwara kiya work). Ideal gas ka U sirf temperature par depend karta hai.",
"Gas ka work = P–V curve ke neeche ka area. Isothermal, adiabatic, isobaric aur isochoric processes ke apne seedhe formulas hain.",
"Second law: heat apne aap thande se garam ki taraf nahi behti, aur koi cyclic process heat ko poori tarah work mein nahi badal sakta. Asli processes irreversible hote hain.",
],
when=[
("Har energy-balance sawal.", "Sign convention: gas ko di heat +, gas dwara work +. Conventions mix mat karo."),
("P–V diagram par koi bhi process.", "Cycle mein work = enclosed area (P–V par clockwise → positive work) — direction check karo."),
("Internal energy ka change.", "ΔU sirf ΔT par depend — non-isochoric process mein bhi nCvΔT hi lagao."),
("Reservoir ke contact mein dheemi processes.", None),
("Tez processes ya insulated container.", "Adiabatic curve (slope −γP/V) isothermal (−P/V) se zyada steep — confuse mat karo."),
("Constant pressure par garam karna.", None),
("Rigid container mein garam karna.", None),
("Dono molar heat capacities ko jodna.", None),
("Problem mein γ chunna.", None),
("Gases ka mixture.", None),
("Diatomic gas: heat ka 2/7 work banta hai.", None),
("P–V diagram par cycles.", None),
],
examples=[
("Isothermal expansion", "2 mol ideal gas 300 K par isothermally double volume tak failti hai. Work (ln 2 = 0.693)?",
 "W = nRT ln 2 = 2 × 8.314 × 300 × 0.693 ≈ ⟨0⟩ J (= absorbed heat, kyunki ΔU = 0)."),
("Adiabatic compression", "300 K ki monoatomic gas adiabatically 1/8 volume tak dabaayi. Final temperature?",
 "TVᵞ⁻¹ = constant, γ − 1 = 2/3: T₂ = 300 × 8^(2/3) = 300 × 4 = ⟨0⟩ K."),
("Diatomic gas ka isobaric heating", "2 mol diatomic gas constant pressure par 50 K garam. Q, W aur ΔU?",
 "Q = nCpΔT = 2 × 3.5 × 8.314 × 50 ≈ ⟨0⟩ J; W = nRΔT ≈ ⟨1⟩ J; ΔU = Q − W ≈ ⟨2⟩ J."),
("Constant pressure par work", "Gas 10⁵ Pa par 1 L se 3 L tak failti hai. Work?",
 "W = PΔV = 10⁵ × 2 × 10⁻³ = ⟨0⟩ J."),
("Adiabatic pressure change", "Diatomic gas (γ = 1.4) adiabatically aadhe volume tak. Pressure kitna guna?",
 "P₂/P₁ = 2^1.4 ≈ ⟨0⟩ (isothermal ke factor 2 se zyada)."),
("Ek line mein first law", "Gas 500 J heat leti hai aur 200 J work karti hai. Internal energy ka change?",
 "ΔU = Q − W = 500 − 200 = ⟨0⟩ J (temperature badhta hai)."),
("Triangular cycle ka work", "Gas A(P₀, V₀) → B(2P₀, V₀) → C(2P₀, 2V₀) → seedhi line se wapas A; P₀ = 10⁵ Pa, V₀ = 1 L. Net work?",
 "Work = triangle ka area = ½ × V₀ × P₀ = ½ × 10⁻³ × 10⁵ = ⟨0⟩ J."),
("Mixture ka γ", "1 mol monoatomic + 1 mol rigid diatomic gas. Mixture ka γ?",
 "Cv = (3R/2 + 5R/2)/2 = 2R, Cp = 3R, γ = 3/2 = ⟨0⟩."),
],
topics=[
("System, surroundings and state", "System woh hissa jise hum padhte hain; baaki sab surroundings. State variables (P, V, T, U) equilibrium states batate hain. Extensive variables size par depend (V, U, mass); intensive nahi (P, T, density)."),
("Thermal equilibrium and the zeroth law", "A agar C ke saath equilibrium mein hai aur B bhi C ke saath, to A aur B bhi equilibrium mein. Thermometer isi law se kaam karta hai."),
("Heat, work and internal energy", "Heat aur work transit mein energy hain aur path par depend karte hain. Internal energy state function hai: ideal gas mein sirf molecules ki kinetic energy, sirf T par depend."),
("Reading P–V diagrams", "Isobaric: horizontal line; isochoric: vertical line; isothermal: hyperbola; adiabatic: zyada steep curve. Expansion (V badhe) → W positive; compression → W negative."),
("Quasi-static processes", "Itni dheemi process ki system hamesha equilibrium mein rahe. Sirf quasi-static processes P–V par curve ki tarah ban sakte hain aur reversible ho sakte hain."),
("Reversible and irreversible processes", "Reversible process ulti chal sakti hai aur system aur surroundings dono bilkul shuru ki haalat mein laut aate hain. Friction, free expansion, finite temperature difference par heat flow aur mixing processes ko irreversible banate hain. Saari natural processes irreversible hain."),
("Second law of thermodynamics", "Kelvin–Planck: aisi koi process nahi jiska ek-maatra result heat ko poora work mein badalna ho. Clausius: aisi koi process nahi jiska ek-maatra result thande se garam body tak heat bhejna ho. Dono statements equivalent hain."),
("Syllabus note", "Current NTA syllabus mein zeroth, first, second law, processes aur reversible/irreversible processes hain. Heat engine/refrigerator details aur Carnot cycle alag se nahi likhe, isliye first law aur P–V work sabse zyada practise karo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
