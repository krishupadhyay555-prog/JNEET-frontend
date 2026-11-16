from lib import F, X, T, sig, fx, _check_and_write

NA = 6.022e23
n1 = 4.4 / 44; N1 = n1 * 3 * NA                       # atoms in 4.4 g CO2
w2 = 4 * 18                                           # 10 g H2 + 64 g O2 → water
M3 = 0.5 / 0.25                                       # 0.5 mol in 250 mL
m4 = 0.5 / 0.08                                       # 20% w/w NaOH molality
x5 = (46 / 46) / ((46 / 46) + (54 / 18))             # mole fraction ethanol 46 g in 54 g water
pc6 = 12 * 6 / 180 * 100                              # % C in glucose
V7 = 0.01 / 0.1 * 1000 / 2                           # mL of 0.1 M H2SO4 for 50 mL 0.2 M NaOH
M8 = 7.5                                              # 49% H2SO4, d 1.5

DOC = {
"slug": "some-basic-concepts-of-chemistry", "subject": "Chemistry",
"chapters": {"NEET": "Some Basic Concepts of Chemistry", "JEE": "Some Basic Concepts of Chemistry"},
"title": "Some Basic Concepts of Chemistry", "readMinutes": 12,
"summary": [
"Chemistry counts particles in moles: 1 mol = 6.022 × 10²³ particles (Avogadro's number), and its mass in grams equals the molar mass.",
"Laws of chemical combination (conservation of mass, definite proportions, multiple proportions, Gay-Lussac's law, Avogadro's law) led to Dalton's atomic theory.",
"A balanced equation is a recipe in moles. The reactant that runs out first is the limiting reagent and decides how much product forms.",
"Concentration can be expressed as mass %, mole fraction, molarity (mol/L, changes with temperature) or molality (mol/kg of solvent, temperature-independent).",
],
"formulas": [
F("Mole concept", "n = mass/M = N/Nₐ = V(gas at STP)/22.4 L", "Converting between mass, particles and gas volume.", "22.4 L is only for a gas at STP (273 K, 1 atm) — never for liquids or solids.", tag="PYQ favourite"),
F("Avogadro's number", "Nₐ = 6.022 × 10²³ mol⁻¹", "Counting atoms, molecules or ions."),
F("Atomic mass unit", "1 amu (u) = 1/12 × mass of one ¹²C atom = 1.66 × 10⁻²⁴ g", "Atomic and molecular masses."),
F("Average atomic mass", "A = Σ(isotopic mass × fractional abundance)", "Elements with isotopes, e.g. chlorine 35.5."),
F("Percentage composition", "% of element = (mass of element in 1 mol / molar mass) × 100", "Composition of a compound."),
F("Empirical and molecular formula", "molecular formula = n × empirical formula;  n = molar mass / empirical formula mass", "Finding formulas from % composition.", "Convert % to moles, divide by the smallest, then round to whole numbers (multiply if you get .5 or .33)."),
F("Limiting reagent", "compare (moles available ÷ coefficient) for each reactant — the smallest is limiting", "Product amount when reactants are not in the exact ratio.", "Don't compare masses — compare moles divided by stoichiometric coefficients.", tag="PYQ favourite"),
F("Mass percent", "w/w % = (mass of solute / mass of solution) × 100;   ppm = (mass of solute / mass of solution) × 10⁶", "Concentration by mass; ppm for very dilute solutions (pollutants in water, air)."),
F("Mole fraction", "x_A = n_A / (n_A + n_B);  x_A + x_B = 1", "Gas mixtures, Raoult's law."),
F("Molarity", "M = moles of solute / volume of solution (L)", "Titrations, dilutions.", "Molarity changes with temperature because volume does."),
F("Molality", "m = moles of solute / mass of solvent (kg)", "Colligative properties.", "Use the mass of SOLVENT, not of solution."),
F("Dilution and mixing", "M₁V₁ = M₂V₂;  mixing: M = (M₁V₁ + M₂V₂)/(V₁ + V₂)", "Preparing solutions."),
F("Molarity from mass % and density", "M = (10 × d × w%)/M_solute   (d in g/mL)", "Commercial acids."),
F("Neutralisation (acid–base)", "n₁ × M₁ × V₁ (acid, n = basicity) = n₂ × M₂ × V₂ (base, n = acidity)", "Titration volumes."),
],
"examples": [
X("Counting atoms", "How many atoms are present in 4.4 g of CO₂?",
  f"n = 4.4/44 = {fx(n1,1)} mol; each molecule has 3 atoms → 0.3 × 6.022 × 10²³ ≈ {sig(N1,3)} atoms.", [(fx(n1,1), "0.1"), (sig(N1,3), "1.81 × 10²³")]),
X("Limiting reagent", "10 g of H₂ reacts with 64 g of O₂. Mass of water formed?",
  f"H₂ = 5 mol, O₂ = 2 mol. 2H₂ + O₂ → 2H₂O: O₂ needs 4 mol H₂, so O₂ is limiting → 4 mol H₂O = {fx(w2)} g (1 mol H₂ left).", [(fx(w2), "72")]),
X("Molarity", "0.5 mol of NaCl is dissolved to make 250 mL of solution. Molarity?",
  f"M = 0.5/0.250 = {fx(M3)} M.", [(fx(M3), "2")]),
X("Molality from mass %", "A solution is 20% NaOH by mass. Molality?",
  f"100 g solution: 20 g NaOH = 0.5 mol in 80 g water. m = 0.5/0.080 = {fx(m4,2)} m.", [(fx(m4,2), "6.25")]),
X("Mole fraction", "46 g of ethanol is mixed with 54 g of water. Mole fraction of ethanol?",
  f"Ethanol 1 mol, water 3 mol → x = 1/4 = {fx(x5,2)}.", [(fx(x5,2), "0.25")]),
X("Percentage of carbon in glucose", "% of C in C₆H₁₂O₆?",
  f"72/180 × 100 = {fx(pc6)}%.", [(fx(pc6), "40")]),
X("Titration volume", "Volume of 0.1 M H₂SO₄ to neutralise 50 mL of 0.2 M NaOH?",
  f"2 × 0.1 × V = 1 × 0.2 × 50 → V = {fx(V7)} mL.", [(fx(V7), "50")]),
X("Molarity of commercial acid", "H₂SO₄ is 49% by mass with density 1.5 g/mL. Molarity?",
  f"M = 10 × 1.5 × 49/98 = {fx(M8,1)} M.", [(fx(M8,1), "7.5")]),
],
"topics": [
T("Matter and its classification", "Matter is a pure substance (element or compound) or a mixture (homogeneous like air or salt solution; heterogeneous like sand in water). Compounds have fixed composition; mixtures don't."),
T("Laws of chemical combination", "Conservation of mass (Lavoisier); definite proportions (Proust) — a compound always has the same elements in the same mass ratio; multiple proportions (Dalton) — masses of one element combining with a fixed mass of another are in small whole-number ratios (e.g. CO and CO₂); Gay-Lussac — gases combine in simple volume ratios; Avogadro — equal volumes of gases at the same T and P contain equal numbers of molecules."),
T("Dalton's atomic theory", "Matter is made of indivisible atoms; atoms of one element are identical; compounds form by atoms combining in fixed ratios; reactions rearrange atoms. Later work showed atoms are divisible and isotopes exist."),
T("Measurement and significant figures", "Use SI units. Keep answers to the right number of significant figures: × ÷ → fewest significant figures; + − → fewest decimal places. Scientific notation (N × 10ⁿ) makes this clear."),
T("Stoichiometry in practice", "Balance the equation first. Convert everything to moles, use the mole ratio from the equation, then convert back to mass or volume. Percentage yield = (actual/theoretical) × 100."),
T("Choosing a concentration unit", "Molarity is easy to use in the lab but changes with temperature; molality and mole fraction don't, so they are used for colligative properties. ppm = (mass of solute/mass of solution) × 10⁶ for very dilute solutions."),
],
"ratta": [
"1 mol = 6.022 × 10²³;  22.4 L at STP (gases only).",
"1 u = 1.66 × 10⁻²⁴ g.",
"Limiting reagent: smallest moles ÷ coefficient.",
"M = mol/L;  m = mol/kg solvent;  x_A + x_B = 1.",
"M₁V₁ = M₂V₂;  M = 10dw/M_solute.",
"Molality and mole fraction don't change with T.",
"Laws: Lavoisier, Proust, Dalton, Gay-Lussac, Avogadro.",
],
}

SYLLABUS = [
("Matter and its nature, Dalton's atomic theory", ["matter", "Dalton"]),
("Laws of chemical combination", ["conservation of mass", "definite proportions", "multiple proportions"]),
("Atomic and molecular masses, mole concept, molar mass", ["atomic mass", "mole", "molar mass"]),
("Percentage composition, empirical and molecular formula", ["percentage composition", "empirical", "molecular formula"]),
("Chemical equations and stoichiometry, limiting reagent", ["stoichiometry", "limiting reagent"]),
("Concentration: mass percent, mole fraction, molarity, molality", ["mass percent", "mole fraction", "molarity", "molality"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Chemistry particles ko moles mein ginti hai: 1 mol = 6.022 × 10²³ particles (Avogadro's number), aur uska mass grams mein molar mass ke barabar.",
"Laws of chemical combination (conservation of mass, definite proportions, multiple proportions, Gay-Lussac's law, Avogadro's law) se Dalton's atomic theory bani.",
"Balanced equation moles mein ek recipe hai. Jo reactant pehle khatam ho wo limiting reagent hai aur wahi product ki maatra tay karta hai.",
"Concentration mass %, mole fraction, molarity (mol/L, temperature se badalti hai) ya molality (mol/kg solvent, temperature-independent) mein likhte hain.",
],
when=[
("Mass, particles aur gas volume ke beech convert karna.", "22.4 L sirf STP (273 K, 1 atm) par gas ke liye — liquids ya solids ke liye kabhi nahi."),
("Atoms, molecules ya ions ginna.", None),
("Atomic aur molecular masses.", None),
("Isotopes wale elements, jaise chlorine 35.5.", None),
("Compound ki composition.", None),
("% composition se formula nikaalna.", "% ko moles mein badlo, sabse chhote se divide karo, phir whole numbers banao (.5 ya .33 aaye to multiply karo) — seedha round mat karo."),
("Reactants exact ratio mein na hon tab product ki maatra.", "Masses compare mat karo — moles ko stoichiometric coefficients se divide karke compare karo."),
("Mass se concentration; bahut dilute solutions (paani, hawa mein pollutants) ke liye ppm.", None),
("Gas mixtures, Raoult's law.", None),
("Titrations, dilutions.", "Molarity temperature se badalti hai kyunki volume badalta hai — dhyan rakho."),
("Colligative properties.", "SOLVENT ka mass lo, solution ka nahi."),
("Solutions banana.", None),
("Commercial acids.", None),
("Titration volumes.", None),
],
examples=[
("Atoms ginna", "4.4 g CO₂ mein kitne atoms?",
 "n = 4.4/44 = ⟨0⟩ mol; har molecule mein 3 atoms → 0.3 × 6.022 × 10²³ ≈ ⟨1⟩ atoms."),
("Limiting reagent", "10 g H₂ 64 g O₂ se react karta hai. Kitna paani banega?",
 "H₂ = 5 mol, O₂ = 2 mol. 2H₂ + O₂ → 2H₂O: O₂ ko 4 mol H₂ chahiye, isliye O₂ limiting → 4 mol H₂O = ⟨0⟩ g (1 mol H₂ bachta hai)."),
("Molarity", "0.5 mol NaCl ghol kar 250 mL solution. Molarity?",
 "M = 0.5/0.250 = ⟨0⟩ M."),
("Mass % se molality", "Solution 20% NaOH by mass. Molality?",
 "100 g solution: 20 g NaOH = 0.5 mol, 80 g paani mein. m = 0.5/0.080 = ⟨0⟩ m."),
("Mole fraction", "46 g ethanol 54 g paani mein. Ethanol ka mole fraction?",
 "Ethanol 1 mol, paani 3 mol → x = 1/4 = ⟨0⟩."),
("Glucose mein carbon %", "C₆H₁₂O₆ mein C ka %?",
 "72/180 × 100 = ⟨0⟩%."),
("Titration volume", "50 mL 0.2 M NaOH ko neutralise karne ke liye 0.1 M H₂SO₄ ka volume?",
 "2 × 0.1 × V = 1 × 0.2 × 50 → V = ⟨0⟩ mL."),
("Commercial acid ki molarity", "H₂SO₄ 49% by mass, density 1.5 g/mL. Molarity?",
 "M = 10 × 1.5 × 49/98 = ⟨0⟩ M."),
],
topics=[
("Matter and its classification", "Matter ya to pure substance (element ya compound) hai ya mixture (homogeneous jaise hawa ya namak ka ghol; heterogeneous jaise paani mein ret). Compounds ki composition fixed; mixtures ki nahi."),
("Laws of chemical combination", "Conservation of mass (Lavoisier); definite proportions (Proust) — compound mein hamesha same elements same mass ratio mein; multiple proportions (Dalton) — ek element ke masses jo doosre ke fixed mass se milte hain chhote whole-number ratio mein (CO aur CO₂); Gay-Lussac — gases simple volume ratios mein milti hain; Avogadro — same T aur P par barabar volume mein barabar molecules."),
("Dalton's atomic theory", "Matter indivisible atoms se bana; ek element ke atoms identical; compounds atoms ke fixed ratio mein milne se; reactions atoms ko rearrange karti hain. Baad mein pata chala atoms divisible hain aur isotopes hote hain."),
("Measurement and significant figures", "SI units use karo. Answer sahi significant figures mein: × ÷ → sabse kam significant figures; + − → sabse kam decimal places. Scientific notation (N × 10ⁿ) isse saaf karta hai."),
("Stoichiometry in practice", "Pehle equation balance karo. Sab kuch moles mein badlo, equation ka mole ratio lagao, phir wapas mass ya volume mein. Percentage yield = (actual/theoretical) × 100."),
("Choosing a concentration unit", "Molarity lab mein aasaan par temperature se badalti hai; molality aur mole fraction nahi badalte, isliye colligative properties mein use hote hain. Bahut dilute solutions ke liye ppm = (solute ka mass/solution ka mass) × 10⁶."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
