from lib import F, X, T, sig, fx, build
import math

R = 8.314
w1 = -1 * (10 - 2) * 101.3
w2 = -2.303 * 1 * R * 300 * math.log10(2)
dU3 = -92.4 - (-2) * R * 298 / 1000
h4 = -393.5 - (-283.0)
h5 = -393.5 + 2 * (-285.8) - (-74.8)
h6 = (436 + 242) - 2 * 431
s7 = 40.7e3 / 373
T8 = 179e3 / 160
logK9 = 11.41e3 / (2.303 * R * 298)

DOC = {
"slug": "chemical-thermodynamics", "subject": "Chemistry",
"chapters": {"NEET": "Thermodynamics", "JEE": "Thermodynamics"},
"title": "Chemical Thermodynamics", "readMinutes": 20,
"summary": [
"System = jo hum study kar rahe hain, surroundings = baaki sab. Open system energy aur matter dono exchange karta hai, closed sirf energy, isolated kuch nahi. State functions (U, H, S, G, p, V, T) sirf shuruaat aur ant par depend karte hain; heat aur work path functions hain.",
"First law energy conservation hai: ΔU = q + w (chemistry sign convention: system PAR kiya gaya kaam aur system KO di gayi heat positive). Constant volume par heat = ΔU, constant pressure par heat = ΔH.",
"Enthalpy additive hai: Hess's law se kisi bhi reaction ka ΔH doosri reactions jod-ghata ke nikal sakte hain. Formation, combustion, bond, atomisation, phase change — sab enthalpies isi logic se judti hain.",
"Second law: koi bhi spontaneous process universe ki entropy badhata hai (ΔS_total > 0). System ke liye ek hi number kaafi hai — Gibbs energy: constant T, p par ΔG < 0 matlab spontaneous.",
"ΔG° = −RT ln K: standard Gibbs energy aur equilibrium constant ek doosre se jude hain. ΔG° negative ⇒ K > 1 (products favoured)."
],
"formulas": [
F("First law", "ΔU = q + w", "Har energy hisaab ka base.", "Chemistry: system par kaam (+w), system dwara kaam (−w). Physics books mein ulta convention hota hai."),
F("Work of expansion (irreversible)", "w = −p_ext ΔV;   free expansion (p_ext = 0): w = 0", "Constant bahari pressure ke against phailna.", "1 L·atm = 101.3 J.", "J"),
F("Reversible isothermal work (ideal gas)", "w_rev = −2.303 nRT log(V₂/V₁) = −2.303 nRT log(p₁/p₂)", "Reversible, constant T.", "Ideal gas isothermal: ΔU = 0 ⇒ q = −w.", None, "PYQ favourite"),
F("Enthalpy", "H = U + pV;   ΔH = ΔU + Δn_g RT", "ΔH aur ΔU mein badalna.", "Δn_g = gaseous products ke moles − gaseous reactants ke moles; solids/liquids mat gino.", None, "PYQ favourite"),
F("Heat at constant V and p", "q_V = ΔU,   q_p = ΔH", "Bomb calorimeter (V const) ΔU deta hai; coffee-cup (p const) ΔH."),
F("Heat capacity", "q = C ΔT = n C_m ΔT;   C_p − C_V = R (ideal gas, molar);   monoatomic: C_V = 3R/2, C_p = 5R/2", "Garam karne mein kitni heat.", "Specific heat (per gram) aur molar heat capacity (per mole) alag hain."),
F("Adiabatic process", "q = 0 ⇒ ΔU = w;   reversible ideal gas: TV^{γ−1} = constant,  pV^γ = constant", "Bina heat exchange ke expansion/compression.", "Reversible adiabatic expansion mein gas thandi hoti hai (kaam apni internal energy se karti hai). Ideal gas ka free expansion: ΔT = 0."),
F("Hess's law", "ΔH (overall) = ΔH₁ + ΔH₂ + …   (reaction ulti → ΔH ka sign ulta;  ×n → ΔH × n)", "Seedhe naap na sakne wali reaction ka ΔH.", None, None, "PYQ favourite"),
F("From enthalpies of formation", "Δ_rH° = Σ Δ_fH°(products) − Σ Δ_fH°(reactants);   element ki standard state ka Δ_fH° = 0", "Table se reaction enthalpy.", "Coefficient se multiply karna mat bhoolo."),
F("From bond enthalpies", "Δ_rH = Σ BE(reactants, bonds toote) − Σ BE(products, bonds bane)", "Gaseous reactions ka approximate ΔH.", "Yahan reactants − products (formation wale ka ulta)."),
F("Types of enthalpy", "Combustion (1 mol + O₂), atomisation (1 mol → gaseous atoms), sublimation = fusion + vaporisation, ionisation, hydration (gaseous ion → aq), solution = lattice + hydration, neutralisation (strong acid + strong base ≈ −57.1 kJ/mol)", "Definition wale sawal.", "Weak acid/base ke saath neutralisation kam exothermic (ionisation mein energy lagti hai)."),
F("Entropy change", "ΔS = q_rev / T;   phase change: ΔS = ΔH_trans / T_trans;   ideal gas isothermal: ΔS = 2.303 nR log(V₂/V₁)", "Disorder ka naap.", None, "J/(K·mol)"),
F("Total entropy criterion", "ΔS_total = ΔS_sys + ΔS_surr > 0 (spontaneous);   ΔS_surr = −ΔH_sys / T", "Spontaneity ka asli criterion (isolated/universe).", "Equilibrium par ΔS_total = 0."),
F("Gibbs energy", "G = H − TS;   ΔG = ΔH − TΔS;   ΔG = −T ΔS_total", "Constant T, p par spontaneity.", "ΔG < 0 spontaneous, = 0 equilibrium, > 0 non-spontaneous.", "kJ/mol", "PYQ favourite"),
F("Sign table (ΔH, ΔS)", "(−, +): hamesha spontaneous.  (+, −): kabhi nahi.  (−, −): low T par.  (+, +): high T par.   Switch temperature T = ΔH/ΔS", "Kis temperature par reaction chalegi.", "ΔS ko J se kJ mein badal kar hi ΔH ke saath jodo."),
F("ΔG° and equilibrium constant", "ΔG° = −RT ln K = −2.303 RT log K;   ΔG = ΔG° + RT ln Q", "K nikalna ya ΔG° nikalna.", "R = 8.314 J/(K·mol) — ΔG° ko J mein rakho.", None, "PYQ favourite"),
F("Gibbs energy and useful work", "ΔG = w_max (non-expansion);   cell: ΔG° = −nFE°", "Electrochemistry se link."),
],
"examples": [
X("Bahari pressure ke against kaam", "Gas 1 atm constant bahari pressure ke against 2 L se 10 L phailti hai. Work?",
  f"w = −p_ext ΔV = −1 × 8 = −8 L·atm = −8 × 101.3 J ≈ {fx(w1,0)} J. Negative: system ne kaam kiya.",
  [(fx(w1,0), "−810")]),
X("Reversible isothermal expansion", "1 mol ideal gas 300 K par reversibly 10 L se 20 L. w, q, ΔU?",
  f"w = −2.303 × 1 × 8.314 × 300 × log 2 = {fx(w2,0)} J ≈ −1.73 kJ. Isothermal ⇒ ΔU = 0, q = +1.73 kJ.",
  [(fx(w2,0), "−1729")]),
X("ΔH se ΔU", "N₂(g) + 3H₂(g) → 2NH₃(g), ΔH = −92.4 kJ at 298 K. ΔU?",
  f"Δn_g = 2 − 4 = −2. ΔU = ΔH − Δn_g RT = −92.4 − (−2)(8.314 × 298/1000) = {fx(dU3,1)} kJ.",
  [(fx(dU3,1), "−87.4")]),
X("Hess's law: CO ka formation", "C + O₂ → CO₂, ΔH = −393.5 kJ;  CO + ½O₂ → CO₂, ΔH = −283.0 kJ. C + ½O₂ → CO ka ΔH?",
  f"Pehli reaction − doosri: ΔH = −393.5 − (−283.0) = {fx(h4,1)} kJ/mol.",
  [(fx(h4,1), "−110.5")]),
X("Formation enthalpies se combustion", "Δ_fH°: CH₄ −74.8, CO₂ −393.5, H₂O(l) −285.8 kJ/mol. CH₄ + 2O₂ → CO₂ + 2H₂O(l) ka Δ_cH°?",
  f"Δ_cH° = [−393.5 + 2(−285.8)] − [−74.8 + 0] = {fx(h5,1)} kJ/mol.",
  [(fx(h5,1), "−890.3")]),
X("Bond enthalpy se ΔH", "H–H 436, Cl–Cl 242, H–Cl 431 kJ/mol. H₂ + Cl₂ → 2HCl ka ΔH?",
  f"ΔH = (436 + 242) − 2 × 431 = {fx(h6)} kJ.",
  [(fx(h6), "−184")]),
X("Paani ke ubalne ki entropy", "Δ_vapH = 40.7 kJ/mol at 373 K. Δ_vapS?",
  f"ΔS = ΔH/T = 40700/373 ≈ {fx(s7,1)} J/(K·mol).",
  [(fx(s7,1), "109.1")]),
X("Kis temperature par spontaneous?", "CaCO₃ → CaO + CO₂: ΔH = +179 kJ/mol, ΔS = +160 J/(K·mol). Kab spontaneous?",
  f"(+, +) ⇒ high T par. T = ΔH/ΔS = 179000/160 ≈ {fx(T8,0)} K se upar.",
  [(fx(T8,0), "1119")]),
X("ΔG° se K", "298 K par ΔG° = −11.41 kJ/mol. K?",
  f"log K = −ΔG°/(2.303RT) = 11410/(2.303 × 8.314 × 298) ≈ {fx(logK9,1)} ⇒ K ≈ 100.",
  [(fx(logK9,1), "2")]),
],
"topics": [
T("System, surroundings aur boundary", "Open (khula ubalta kettle): matter + energy exchange. Closed (band bartan): sirf energy. Isolated (ideal thermos): kuch nahi. Universe = system + surroundings."),
T("Extensive vs intensive properties", "Extensive amount par depend karti hain: mass, volume, U, H, S, G, heat capacity. Intensive nahi: T, p, density, molar quantities, specific heat. Do extensive ka ratio intensive hota hai (density = m/V)."),
T("State functions vs path functions", "State function: sirf initial aur final state se (U, H, S, G, p, V, T) — cycle mein change zero. Path function: raaste par depend (q, w). Lekin q + w = ΔU state function hai."),
T("Processes", "Isothermal (T const), isobaric (p const), isochoric (V const), adiabatic (q = 0), cyclic (wapas shuruaat par: ΔU = 0). Reversible: har kadam par equilibrium, infinitely slow; irreversible: asli, tez processes."),
T("Internal energy aur enthalpy ka farak", "U = molecules ki saari energy. H = U + pV, constant pressure par di gayi heat. Solids/liquids ke liye ΔH ≈ ΔU; gases mein Δn_g RT ka farak."),
T("Calorimetry", "Bomb calorimeter (sealed, constant V) ΔU naapta hai — combustion ke liye. Coffee-cup calorimeter (khula, constant p) ΔH naapta hai."),
T("Standard state aur formation", "Standard state: 1 bar, diya hua T (aksar 298 K), sabse stable form (C graphite, O₂ gas, Br₂ liquid). Element ki standard state ka Δ_fH° = 0. Diamond, O₃ ka Δ_fH° zero nahi."),
T("Lattice aur hydration enthalpy", "Ionic solid ka ghulna = lattice todna (+, endothermic) + ions ka hydration (−, exothermic). Δ_solH = lattice + hydration. Hydration zyada ho to ghulna exothermic."),
T("Spontaneity ka matlab", "Spontaneous = bina bahari madad ke apne aap ho sakta hai (tezi se ho, zaroori nahi — jaise diamond → graphite). Sirf ΔH se faisla nahi hota (barf ka pighalna endothermic hai phir bhi 0°C se upar spontaneous); entropy bhi dekhni padti hai."),
T("Entropy ka feel", "Gas > liquid > solid. Temperature badhe, moles of gas badhein, ghulna, phailna — sab entropy badhate hain. Third law: perfect crystal ki 0 K par entropy zero."),
T("ΔG, K aur Q", "ΔG° < 0 ⇒ K > 1; ΔG° > 0 ⇒ K < 1. Reaction kisi bhi pal ΔG = ΔG° + RT ln Q se aage/peeche jaati hai; equilibrium par ΔG = 0 aur Q = K."),
],
"ratta": [
"ΔU = q + w (chemistry convention).  q_V = ΔU,  q_p = ΔH.",
"ΔH = ΔU + Δn_g RT (sirf gases gino).",
"w_rev,iso = −2.303 nRT log(V₂/V₁);  1 L·atm = 101.3 J.",
"Δ_rH = ΣΔ_fH(P) − ΣΔ_fH(R);  bond enthalpy se: ΣBE(R) − ΣBE(P).",
"Strong acid + strong base neutralisation ≈ −57.1 kJ/mol.",
"ΔG = ΔH − TΔS;  T_switch = ΔH/ΔS.",
"ΔG° = −2.303 RT log K;  ΔG° = −nFE°.",
"R = 8.314 J/(K·mol) = 0.0821 L·atm/(K·mol).",
"Extensive: m, V, U, H, S, G.  Intensive: T, p, ρ, molar values.",
],
}

SYLLABUS = [
("System and surroundings", ["System", "surroundings"]),
("Extensive and intensive properties", ["Extensive", "intensive"]),
("State functions", ["State function"]),
("Types of processes", ["Isothermal", "isobaric", "isochoric", "adiabatic", "cyclic"]),
("First law: work, heat, internal energy, enthalpy", ["First law", "Internal energy", "Enthalpy"]),
("Heat capacity and molar heat capacity", ["Heat capacity", "molar heat capacity"]),
("Hess's law of constant heat summation", ["Hess's law"]),
("Enthalpies of bond dissociation, combustion, formation, atomisation, sublimation, phase transition, hydration, ionisation, solution",
 ["bond enthalp", "Combustion", "formation", "atomisation", "sublimation", "phase change", "hydration", "ionisation", "solution"]),
("Second law: spontaneity", ["Second law", "Spontaneous"]),
("ΔS of universe and ΔG of system as criteria", ["ΔS_total", "ΔG < 0"]),
("Standard Gibbs energy change and equilibrium constant", ["ΔG° = −RT ln K"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
