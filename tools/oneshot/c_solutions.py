from lib import F, X, T, sig, fx, _check_and_write

p1 = 0.5 * 75 + 0.5 * 22; y1 = 37.5 / p1                     # benzene–toluene
dp2 = 0.02 * 23.8                                             # RLVP, x2 = 0.02
dTb3 = 0.52 * 0.2 * 2                                         # NaCl 0.2 m, i = 2
dTf4 = 2.5 * 1.86 * 0.01                                      # K2SO4 75% dissociated
pi5 = 0.1 * 0.0821 * 300
M6 = (1.8 / 0.25) * 0.0821 * 300 / 0.738                    # π = 0.738 atm → M
a7 = 2 * (1 - 60 / 100)                                       # association of acetic acid

DOC = {
"slug": "solutions", "subject": "Chemistry",
"chapters": {"NEET": "Solutions", "JEE": "Solutions"},
"title": "Solutions", "readMinutes": 13,
"summary": [
"A solution is a homogeneous mixture. Its concentration can be written as mass %, ppm, mole fraction, molarity or molality.",
"Gases dissolve more at higher pressure (Henry's law) and usually less at higher temperature. For volatile liquids, Raoult's law says each component's vapour pressure = its mole fraction × its pure vapour pressure.",
"Ideal solutions obey Raoult's law exactly; real ones show positive deviation (weaker A–B attractions) or negative deviation (stronger A–B attractions) and may form azeotropes.",
"Colligative properties depend only on the number of solute particles: relative lowering of vapour pressure, boiling-point elevation, freezing-point depression and osmotic pressure. The van't Hoff factor i corrects for dissociation or association.",
],
"formulas": [
F("Henry's law", "p = K_H x  (partial pressure ∝ mole fraction of gas in solution)", "Solubility of gases.", "A larger K_H means LOWER solubility at the same pressure."),
F("Raoult's law (volatile components)", "p_A = x_A p°_A;  p_total = x_A p°_A + x_B p°_B", "Vapour pressure of liquid mixtures.", None, tag="PYQ favourite"),
F("Vapour composition", "y_A = p_A/p_total", "Mole fraction of a component in the vapour.", "The vapour is richer in the MORE volatile component."),
F("Relative lowering of vapour pressure", "(p° − p)/p° = x_solute = i × n₂/(n₁ + n₂)", "Non-volatile solute in a solvent."),
F("Boiling-point elevation", "ΔT_b = i K_b m", "Higher boiling point of solutions.", "m is molality (per kg solvent), not molarity."),
F("Freezing-point depression", "ΔT_f = i K_f m;  water K_f = 1.86, K_b = 0.52 K kg mol⁻¹", "Antifreeze, molar mass by cryoscopy.", None, tag="PYQ favourite"),
F("Osmotic pressure", "π = i C R T  (C in mol/L, R = 0.0821 L atm mol⁻¹ K⁻¹)", "Osmosis, molar mass of polymers and proteins.", "Use molarity and kelvin here."),
F("Molar mass from colligative data", "M₂ = (K_b × w₂ × 1000)/(ΔT_b × w₁)  (similarly with K_f);  M₂ = w₂RT/(πV)", "Finding the molar mass of a solute."),
F("van't Hoff factor", "i = observed colligative property / normal value = normal molar mass / observed molar mass", "Electrolytes and associating solutes."),
F("i from dissociation or association", "dissociation into n ions: i = 1 + (n − 1)α;  association into n-mers: i = 1 − (1 − 1/n)α", "Degree of dissociation/association.", "For dimerisation, i = 1 − α/2."),
],
"examples": [
X("Ideal mixture", "Benzene (p° = 75 torr) and toluene (p° = 22 torr), x = 0.5 each. Total vapour pressure and mole fraction of benzene in the vapour?",
  f"p = 37.5 + 11 = {fx(p1,1)} torr; y(benzene) = 37.5/48.5 ≈ {fx(y1,2)}.", [(fx(p1,1), "48.5"), (fx(y1,2), "0.77")]),
X("Lowering of vapour pressure", "Pure water p° = 23.8 mm Hg. Solute mole fraction 0.02 (non-volatile, non-electrolyte). Lowering?",
  f"Δp = x₂ p° = 0.02 × 23.8 ≈ {fx(dp2,3)} mm Hg.", [(fx(dp2,3), "0.476")]),
X("Boiling point of salt water", "0.2 m NaCl (i = 2), K_b = 0.52. Elevation?",
  f"ΔT_b = 2 × 0.52 × 0.2 = {fx(dTb3,3)} K.", [(fx(dTb3,3), "0.208")]),
X("Partly dissociated electrolyte", "0.01 m K₂SO₄ is 75% dissociated. ΔT_f (K_f = 1.86)?",
  f"i = 1 + 2(0.75) = 2.5; ΔT_f = 2.5 × 1.86 × 0.01 = {fx(dTf4,4)} K.", [(fx(dTf4,4), "0.0465")]),
X("Osmotic pressure", "0.1 M glucose at 300 K?",
  f"π = CRT = 0.1 × 0.0821 × 300 ≈ {fx(pi5,2)} atm.", [(fx(pi5,2), "2.46")]),
X("Molar mass from osmotic pressure", "1.8 g of a solute in 250 mL of solution gives π = 0.738 atm at 300 K. Molar mass?",
  f"M = wRT/(πV) = 1.8 × 0.0821 × 300/(0.738 × 0.25) ≈ {fx(M6,0)} g/mol.", [(fx(M6,0), "240")]),
X("Association of acetic acid", "Acetic acid (M = 60) shows an apparent molar mass of 100 in benzene. Degree of association?",
  f"i = 60/100 = 0.6 = 1 − α/2 → α = {fx(a7,1)} (80%).", [(fx(a7,1), "0.8")]),
],
"topics": [
T("Types of solutions", "Solvent and solute can be any phase: gas in liquid (soda), solid in liquid (sugar), liquid in liquid (alcohol in water), solid in solid (alloys), gas in solid (H₂ in palladium)."),
T("Solubility of solids and gases", "Solids: 'like dissolves like'; solubility usually rises with temperature if dissolution is endothermic. Gases: solubility rises with pressure (Henry's law) and falls with temperature — fish need cold water, and divers get the bends when dissolved N₂ bubbles out."),
T("Ideal and non-ideal solutions", "Ideal (benzene + toluene): ΔmixH = 0, ΔmixV = 0. Positive deviation (ethanol + acetone, CS₂ + acetone): weaker A–B forces, ΔmixH > 0, ΔmixV > 0, minimum-boiling azeotrope. Negative deviation (chloroform + acetone, HNO₃ + water): stronger A–B forces, ΔmixH < 0, ΔmixV < 0, maximum-boiling azeotrope."),
T("Azeotropes", "Constant-boiling mixtures that cannot be separated by simple distillation, e.g. 95% ethanol–water (minimum boiling) and 68% HNO₃–water (maximum boiling)."),
T("Osmosis and reverse osmosis", "Solvent moves through a semipermeable membrane from dilute to concentrated solution. Isotonic solutions have the same π (0.9% NaCl is isotonic with blood); RBCs swell in hypotonic and shrink in hypertonic solutions. Applying pressure greater than π reverses the flow — used to desalinate sea water."),
T("Abnormal molar masses", "Electrolytes dissociate (i > 1) and give lower apparent molar mass; solutes like acetic acid in benzene associate (i < 1) and give higher apparent molar mass."),
],
"ratta": [
"Henry: p = K_H x (higher K_H → less soluble).",
"Raoult: p_A = x_A p°_A;  vapour richer in volatile one.",
"Δp/p° = x₂;  ΔT_b = iK_b m;  ΔT_f = iK_f m;  π = iCRT.",
"Water: K_b 0.52, K_f 1.86.",
"i = 1 + (n − 1)α;  dimer: i = 1 − α/2.",
"+ve deviation → min-boiling azeotrope;  −ve → max-boiling.",
"0.9% NaCl isotonic with blood.",
],
}

SYLLABUS = [
("Different methods of expressing concentration of solutions", ["concentration", "mole fraction", "molality"]),
("Vapour pressure of solutions and Raoult's law", ["vapour pressure", "Raoult"]),
("Ideal and non-ideal solutions, vapour pressure-composition plots, azeotropes", ["ideal", "non-ideal", "azeotrope"]),
("Colligative properties: relative lowering of vapour pressure, depression of freezing point, elevation of boiling point and osmotic pressure", ["colligative", "lowering of vapour pressure", "freezing", "boiling", "osmotic pressure"]),
("Determination of molecular mass using colligative properties", ["molar mass"]),
("Abnormal value of molar mass, van't Hoff factor and its significance", ["abnormal", "van't Hoff"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
