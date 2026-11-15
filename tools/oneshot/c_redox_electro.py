from lib import F, X, T, sig, fx, _check_and_write
import math

ox1 = 6                                                   # Cr in K2Cr2O7
E2 = 0.34 - (-0.76)                                       # Daniell E°
E3 = 1.10 - 0.0591 / 2 * math.log10(0.1 / 0.001)          # Nernst
dG4 = -2 * 96500 * 1.10 / 1000                            # kJ
logK5 = 2 * 1.10 / 0.0591
m6 = 2 * 3600 * 63.5 / (2 * 96500)                        # Cu deposited 2 A, 1 h
Lm7 = 0.0248 * 1000 / 0.2                                 # Λm from κ (S/cm) and C (M)
a8 = 39.1 / (426.2 + 91.0 - 126.4)
E9 = -0.0591 * 3

DOC = {
"slug": "redox-reactions-and-electrochemistry", "subject": "Chemistry",
"chapters": {"NEET": "Redox Reactions and Electrochemistry", "JEE": "Redox Reactions and Electrochemistry"},
"title": "Redox Reactions and Electrochemistry", "readMinutes": 15,
"summary": [
"Oxidation is loss of electrons (oxidation number rises); reduction is gain of electrons (oxidation number falls). They always happen together — a redox reaction.",
"A galvanic cell turns a spontaneous redox reaction into electricity: oxidation at the anode, reduction at the cathode. Its emf E°cell = E°cathode − E°anode, and ΔG° = −nFE°cell.",
"The Nernst equation gives cell or electrode potential at any concentration; at equilibrium Ecell = 0, which links E° to the equilibrium constant.",
"Electrolytic cells use electricity to drive reactions (Faraday's laws). Conductance of solutions (κ, Λm) and Kohlrausch's law connect electrochemistry to ion mobility and degree of dissociation.",
],
"formulas": [
F("Oxidation number rules", "free element 0;  F −1;  O −2 (peroxide −1, OF₂ +2);  H +1 (metal hydride −1);  sum = charge of species", "Finding oxidation states.", "Peroxides (H₂O₂, Na₂O₂) have O at −1 — don't use −2 there."),
F("Balancing redox (ion–electron method)", "split into half-reactions → balance atoms other than O, H → O with H₂O → H with H⁺ (OH⁻ in base) → charge with e⁻ → add", "Balancing any redox equation."),
F("Standard cell emf", "E°cell = E°cathode − E°anode (reduction potentials)", "Daniell cell and other cells.", "Use reduction potentials for both — don't flip signs and then subtract again.", tag="PYQ favourite"),
F("Gibbs energy and emf", "ΔG° = −n F E°cell;  ΔG = −nFEcell", "Spontaneity of a cell reaction.", "Positive E°cell ⇒ negative ΔG° ⇒ spontaneous."),
F("Nernst equation", "E = E° − (0.0591/n) log Q  at 298 K", "Cell emf at non-standard concentrations.", "Q uses product/reactant concentrations; pure solids and liquids are left out.", tag="PYQ favourite"),
F("E° and equilibrium constant", "log K = n E°cell / 0.0591;  ΔG° = −2.303 RT log K", "How far a cell reaction goes."),
F("Hydrogen electrode", "E = −0.0591 × pH  (p(H₂) = 1 bar, 298 K)", "pH from electrode potential."),
F("Faraday's first law", "m = Z I t = (M/nF) × I t", "Mass deposited in electrolysis.", "1 F = 96500 C = charge of 1 mol of electrons."),
F("Faraday's second law", "m₁/m₂ = E₁/E₂ (equivalent masses) for the same charge", "Cells in series."),
F("Conductivity and molar conductivity", "κ = 1/ρ = G × (l/A);  Λm = κ × 1000 / C  (κ in S cm⁻¹, C in mol L⁻¹, Λm in S cm² mol⁻¹)", "From measured conductance to Λm."),
F("Variation with concentration", "strong electrolyte: Λm = Λ°m − A√C;  weak electrolyte: Λm rises steeply on dilution", "Reading Λm vs √C graphs."),
F("Kohlrausch's law", "Λ°m = ν₊λ°₊ + ν₋λ°₋;  Λ°(CH₃COOH) = Λ°(HCl) + Λ°(CH₃COONa) − Λ°(NaCl)", "Limiting molar conductivity of weak electrolytes."),
F("Degree of dissociation", "α = Λm/Λ°m;  Kₐ = Cα²/(1 − α)", "Weak electrolytes from conductance data."),
],
"examples": [
X("Oxidation number", "Oxidation number of Cr in K₂Cr₂O₇?",
  f"2(+1) + 2x + 7(−2) = 0 → x = +{ox1}.", [(str(ox1), "6")]),
X("Daniell cell", "E°(Cu²⁺/Cu) = +0.34 V, E°(Zn²⁺/Zn) = −0.76 V. E°cell?",
  f"E° = 0.34 − (−0.76) = {fx(E2,2)} V.", [(fx(E2,2), "1.1")]),
X("Nernst equation", "Zn | Zn²⁺(0.1 M) || Cu²⁺(0.001 M) | Cu, E° = 1.10 V. Ecell at 298 K?",
  f"E = 1.10 − (0.0591/2) log(0.1/0.001) = 1.10 − 0.0591 ≈ {fx(E3,3)} V.", [(fx(E3,3), "1.041")]),
X("ΔG° of the Daniell cell", "n = 2, E° = 1.10 V. ΔG°?",
  f"ΔG° = −2 × 96500 × 1.10 J = {fx(dG4,1)} kJ/mol.", [(fx(dG4,1), "−212.3")]),
X("Equilibrium constant", "log K for the Daniell cell (n = 2, E° = 1.10 V)?",
  f"log K = 2 × 1.10/0.0591 ≈ {fx(logK5,1)} → K ≈ 10³⁷ (reaction goes to completion).", [(fx(logK5,1), "37.2")]),
X("Electrolysis of CuSO₄", "2 A is passed for 1 hour through CuSO₄. Mass of copper deposited (Cu = 63.5)?",
  f"Q = 7200 C; m = (63.5/2 × 96500) × 7200 ≈ {fx(m6,2)} g.", [(fx(m6,2), "2.37")]),
X("Molar conductivity", "κ of 0.2 M KCl = 0.0248 S cm⁻¹. Λm?",
  f"Λm = 0.0248 × 1000/0.2 = {fx(Lm7)} S cm² mol⁻¹.", [(fx(Lm7), "124")]),
X("Degree of dissociation of acetic acid", "Λ°(HCl) = 426.2, Λ°(CH₃COONa) = 91.0, Λ°(NaCl) = 126.4 S cm² mol⁻¹. For dilute acetic acid Λm = 39.1. α?",
  f"Λ° = 426.2 + 91.0 − 126.4 = 390.8. α = 39.1/390.8 ≈ {fx(a8,2)}.", [(fx(a8,2), "0.1")]),
X("Hydrogen electrode at pH 3", "Potential of a hydrogen electrode in a solution of pH 3?",
  f"E = −0.0591 × 3 ≈ {fx(E9,3)} V.", [(fx(E9,3), "−0.177")]),
],
"topics": [
T("Types of redox reactions", "Combination, decomposition, displacement (metal and non-metal) and disproportionation, where one element is both oxidised and reduced: 3Cl₂ + 6OH⁻ → 5Cl⁻ + ClO₃⁻ + 3H₂O; 2H₂O₂ → 2H₂O + O₂."),
T("Redox titrations", "KMnO₄ in acid (MnO₄⁻ → Mn²⁺, 5e⁻) is a self-indicator; K₂Cr₂O₇ (Cr₂O₇²⁻ → 2Cr³⁺, 6e⁻) needs an indicator. n-factor = electrons exchanged per formula unit."),
T("Electrochemical series", "Metals with more negative E° are stronger reducing agents and displace metals below them (Zn displaces Cu). F₂ is the strongest oxidising agent, Li the strongest reducing agent in water."),
T("Galvanic cell anatomy", "Anode: oxidation, negative terminal. Cathode: reduction, positive terminal. The salt bridge (KCl/KNO₃ in agar) completes the circuit and keeps the solutions neutral. Electrons flow anode → cathode through the wire."),
T("Products of electrolysis", "At the cathode the species with higher reduction potential is reduced; at the anode the one easiest to oxidise. Aqueous NaCl gives H₂ at the cathode and Cl₂ at the anode (overpotential). Molten NaCl gives Na and Cl₂. Inert (Pt) vs active (Cu) electrodes change the anode reaction."),
T("Batteries", "Primary (not rechargeable): dry cell (Zn anode, MnO₂ cathode), mercury cell (constant 1.35 V). Secondary (rechargeable): lead storage battery (Pb anode, PbO₂ cathode, H₂SO₄), Ni–Cd. Fuel cells (H₂–O₂) convert fuel energy directly with high efficiency."),
T("Corrosion", "Rusting is electrochemical: iron is oxidised at anodic spots, oxygen reduced at cathodic spots, forming Fe₂O₃·xH₂O. Prevent it by painting, galvanising (zinc coating — sacrificial protection) or connecting to a more active metal."),
T("Conductance basics", "Metallic conduction is by electrons and falls with temperature; electrolytic conduction is by ions and rises with temperature. Cell constant = l/A, found using KCl of known conductivity."),
],
"ratta": [
"OIL RIG: oxidation is loss, reduction is gain of e⁻.",
"E°cell = E°cathode − E°anode;  ΔG° = −nFE°.",
"E = E° − (0.0591/n) log Q;  log K = nE°/0.0591.",
"m = MIt/(nF);  1 F = 96500 C.",
"Λm = 1000κ/C;  α = Λm/Λ°m.",
"Kohlrausch: Λ°(weak) from strong electrolytes.",
"Anode: oxidation (− in galvanic, + in electrolytic).",
],
}

SYLLABUS = [
("Electronic concepts of oxidation and reduction, redox reactions, oxidation number", ["oxidation", "reduction", "oxidation number"]),
("Rules for assigning oxidation number and balancing redox reactions", ["rules", "balancing"]),
("Electrolytic and metallic conduction, conductance, specific and molar conductivity and their variation with concentration", ["conductance", "conductivity", "molar conductivity", "concentration"]),
("Kohlrausch's law and its applications", ["Kohlrausch"]),
("Electrochemical cells — electrolytic and galvanic, electrode potentials, standard hydrogen electrode", ["galvanic", "electrolytic", "electrode", "hydrogen electrode"]),
("Nernst equation and its application, relationship between cell potential and Gibbs energy change", ["Nernst", "Gibbs"]),
("Dry cell and lead accumulator; fuel cells", ["dry cell", "lead", "fuel cell"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
