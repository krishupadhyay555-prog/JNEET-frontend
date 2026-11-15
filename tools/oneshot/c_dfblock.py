from lib import F, X, T, sig, fx, _check_and_write
import math

mu1 = math.sqrt(5 * 7)                    # Mn2+ d5
mu2 = math.sqrt(3 * 5)                    # Cr3+ d3
mu3 = math.sqrt(1 * 3)                    # Ti3+ d1
n4 = 5                                    # MnO4- → Mn2+ electrons
n5 = 6                                    # Cr2O7 2- → 2Cr3+

DOC = {
"slug": "d-and-f-block-elements", "subject": "Chemistry",
"chapters": {"NEET": "d- and f-Block Elements", "JEE": "d- and f-Block Elements"},
"title": "d- and f-Block Elements", "readMinutes": 14,
"summary": [
"Transition (d-block) elements have partly filled d orbitals in the atom or a common ion: configuration (n − 1)d¹⁻¹⁰ ns¹⁻². Zn, Cd and Hg (d¹⁰ in all states) are not counted as true transition elements.",
"Typical properties: high melting points (strong metallic bonding from d electrons), variable oxidation states, coloured ions (d–d transitions), paramagnetism (unpaired electrons), catalytic activity, complex formation, interstitial compounds and alloys.",
"KMnO₄ and K₂Cr₂O₇ are the two key compounds: strong oxidising agents whose preparation, structure and reactions are frequently asked.",
"Lanthanoids (4f) mostly show +3; lanthanoid contraction makes 4d and 5d elements of a group (Zr–Hf) almost the same size. Actinoids (5f) are radioactive and show more oxidation states.",
],
"formulas": [
F("General configuration", "d-block: (n − 1)d¹⁻¹⁰ ns¹⁻²;  f-block: (n − 2)f¹⁻¹⁴ (n − 1)d⁰⁻¹ ns²", "Writing configurations.", "Cr = [Ar]3d⁵4s¹ and Cu = [Ar]3d¹⁰4s¹ (extra stability of half/fully filled d)."),
F("Spin-only magnetic moment", "μ = √(n(n + 2)) BM  (n = unpaired electrons)", "Magnetic moments of ions.", "Count unpaired d electrons of the ION, after removing 4s electrons first.", tag="PYQ favourite"),
F("Oxidation states", "maximum = (n − 1)d + ns electrons up to Mn (+7);  Sc only +3;  Zn only +2;  common for many: +2 and +3", "Predicting possible states.", None),
F("Colour", "arises from d–d transitions; d⁰ (Sc³⁺, Ti⁴⁺) and d¹⁰ (Zn²⁺, Cu⁺) ions are colourless", "Predicting colour."),
F("E° and stability", "E°(M²⁺/M) mostly negative;  Cu has positive E° (+0.34 V) — doesn't liberate H₂ from acids;  Mn²⁺ (d⁵) and Zn²⁺ (d¹⁰) are especially stable", "Redox behaviour of 3d ions."),
F("KMnO₄ in acid", "MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O", "Titrations with Fe²⁺, oxalate.", "In neutral/weakly alkaline medium MnO₄⁻ → MnO₂ (3e⁻); in strongly alkaline → MnO₄²⁻ (1e⁻).", tag="PYQ favourite"),
F("K₂Cr₂O₇ in acid", "Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O", "Oxidising agent in volumetric analysis."),
F("Chromate–dichromate equilibrium", "2CrO₄²⁻ (yellow) + 2H⁺ ⇌ Cr₂O₇²⁻ (orange) + H₂O", "Effect of pH on colour.", "Cr stays +6 — it is an acid–base change, not redox."),
F("Preparation of KMnO₄", "MnO₂ fused with KOH + O₂ → K₂MnO₄ (green manganate) → disproportionation/electrolytic oxidation → KMnO₄ (purple)", "Industrial preparation."),
F("Preparation of K₂Cr₂O₇", "chromite ore FeCr₂O₄ + Na₂CO₃ + O₂ → Na₂CrO₄ → (H⁺) Na₂Cr₂O₇ → (KCl) K₂Cr₂O₇", "From ore to dichromate."),
F("Lanthanoid contraction", "steady decrease in size from La to Lu due to poor shielding by 4f electrons", "Why Zr and Hf have nearly equal radii and similar chemistry.", "Basicity of Ln(OH)₃ decreases from La(OH)₃ to Lu(OH)₃."),
F("Lanthanoid oxidation states", "+3 common;  Ce⁴⁺ strong oxidant (→ Ce³⁺);  Eu²⁺, Yb²⁺ reductants (→ +3)", "Stability of unusual states."),
],
"examples": [
X("Magnetic moment of Mn²⁺", "Spin-only moment of Mn²⁺?",
  f"Mn²⁺ is 3d⁵ → 5 unpaired: μ = √35 ≈ {fx(mu1,2)} BM.", [(fx(mu1,2), "5.92")]),
X("Magnetic moment of Cr³⁺", "Spin-only moment of Cr³⁺?",
  f"3d³ → 3 unpaired: μ = √15 ≈ {fx(mu2,2)} BM.", [(fx(mu2,2), "3.87")]),
X("Magnetic moment of Ti³⁺", "Spin-only moment of Ti³⁺?",
  f"3d¹ → μ = √3 ≈ {fx(mu3,2)} BM.", [(fx(mu3,2), "1.73")]),
X("Electrons in KMnO₄ reduction", "How many moles of Fe²⁺ does 1 mol of KMnO₄ oxidise in acid?",
  f"MnO₄⁻ gains {n4} electrons (+7 → +2); each Fe²⁺ loses 1 → 5 mol Fe²⁺.", [(str(n4), "5")]),
X("Electrons for dichromate", "Electrons needed to reduce one Cr₂O₇²⁻ to Cr³⁺?",
  f"Each Cr: +6 → +3 (3e⁻); two Cr → {n5} electrons.", [(str(n5), "6")]),
X("Colourless ions", "Which is colourless: Sc³⁺, Ti³⁺, Cu²⁺, Mn²⁺?",
  "Sc³⁺ — it is 3d⁰, so no d–d transition is possible.", []),
X("Copper and acids", "Why doesn't copper liberate hydrogen from dilute HCl?",
  "E°(Cu²⁺/Cu) = +0.34 V is positive, so Cu cannot reduce H⁺ to H₂. Copper dissolves only in oxidising acids like HNO₃.", []),
],
"topics": [
T("Position and classification", "d-block: groups 3–12 in periods 4–7 (3d, 4d, 5d, 6d series). f-block: lanthanoids (Ce–Lu, 4f) and actinoids (Th–Lr, 5f), placed separately below the table."),
T("Physical properties", "Hard, high melting and boiling points, good conductors. Melting point peaks in the middle of the series (more unpaired d electrons, stronger bonding); Mn and Zn are anomalously low. Atomic radii change little across the series."),
T("Ionisation enthalpies and oxidation states", "IE rises slowly across the series. The number of oxidation states rises up to Mn (+2 to +7) then falls. Higher states are stabilised by O and F (MnO₄⁻, CrO₃, VF₅)."),
T("Catalytic properties", "Variable oxidation states and the ability to adsorb reactants make transition metals good catalysts: V₂O₅ (contact process), Fe (Haber process), Ni (hydrogenation), MnO₂ (decomposition of KClO₃)."),
T("Interstitial compounds and alloys", "Small atoms (H, C, N) fit in metal lattices, making them hard and high-melting (steel, TiC). Similar atomic sizes let transition metals form alloys like brass (Cu–Zn) and bronze (Cu–Sn)."),
T("Lanthanoids", "Show mainly +3, form coloured ions (except La³⁺, Lu³⁺), are reactive metals, and their hydroxides become less basic across the series. Mischmetal (a lanthanoid alloy) is used in lighter flints."),
T("Actinoids and comparison", "All actinoids are radioactive. They show a wider range of oxidation states (up to +7) because 5f, 6d and 7s energies are close. Actinoid contraction is greater than lanthanoid contraction because 5f electrons shield even more poorly."),
],
"ratta": [
"μ = √(n(n + 2)) BM:  d¹ 1.73, d³ 3.87, d⁵ 5.92.",
"Cr 3d⁵4s¹, Cu 3d¹⁰4s¹.",
"Mn shows max +7;  Sc only +3;  Zn only +2.",
"MnO₄⁻ → Mn²⁺ (5e⁻, acid);  Cr₂O₇²⁻ → 2Cr³⁺ (6e⁻).",
"CrO₄²⁻ yellow ⇌ Cr₂O₇²⁻ orange (pH, not redox).",
"Lanthanoid contraction → Zr ≈ Hf.",
"Ce⁴⁺ oxidant;  Eu²⁺ reductant.",
],
}

SYLLABUS = [
("Transition elements: general introduction, electronic configuration, occurrence and characteristics", ["transition", "configuration"]),
("General trends: metallic character, ionisation enthalpy, oxidation states, atomic radii, colour, catalytic behaviour, magnetic properties, complex formation, interstitial compounds, alloy formation", ["ionisation", "oxidation states", "colour", "catalyst", "magnetic", "complex", "interstitial", "alloy"]),
("Preparation, properties and uses of K₂Cr₂O₇ and KMnO₄", ["K₂Cr₂O₇", "KMnO₄"]),
("Lanthanoids: configuration, oxidation states, lanthanoid contraction", ["lanthanoid", "lanthanoid contraction"]),
("Actinoids: configuration and oxidation states", ["actinoid"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
