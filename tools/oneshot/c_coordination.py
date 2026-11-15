from lib import F, X, T, sig, fx, _check_and_write
import math

ox1 = 3                                            # Co in [Co(NH3)5Cl]Cl2
mu2 = math.sqrt(1 * 3)                             # [Fe(CN)6]3- low spin d5
mu3 = math.sqrt(5 * 7)                             # [FeF6]3- high spin d5
cfse4 = -0.4 * 6                                   # low-spin d6 octahedral (Δo units)
cfse5 = -0.4 * 3                                   # d3
iso6 = 3                                           # [Co(en)2Cl2]+ stereoisomers
n7 = 3                                             # AgCl per CoCl3·6NH3

DOC = {
"slug": "coordination-compounds", "subject": "Chemistry",
"chapters": {"NEET": "Coordination Compounds", "JEE": "Coordination Compounds"},
"title": "Coordination Compounds", "readMinutes": 15,
"summary": [
"A coordination compound has a central metal atom/ion bonded to ligands (Lewis bases) through coordinate bonds, e.g. [Co(NH₃)₆]Cl₃. The number of donor atoms bonded is the coordination number.",
"Werner's theory: metals have primary valence (oxidation state, ionisable) and secondary valence (coordination number, directional, non-ionisable).",
"Valence bond theory explains geometry and magnetism by hybridisation; crystal field theory explains colour and magnetism by splitting of d orbitals (Δₒ) — strong-field ligands cause pairing (low spin).",
"Isomerism (structural: ionisation, linkage, coordination, hydrate; stereo: geometrical, optical) and IUPAC naming are the most-asked parts.",
],
"formulas": [
F("Oxidation state of the metal", "charge of complex = metal oxidation state + Σ ligand charges", "Finding the metal's oxidation number.", "Neutral ligands (NH₃, H₂O, CO, en) contribute 0."),
F("Coordination number", "CN = number of donor atoms attached (bidentate en counts 2, EDTA⁴⁻ counts 6)", "Counting CN.", "Count donor atoms, not ligands."),
F("Spectrochemical series", "I⁻ < Br⁻ < SCN⁻ < Cl⁻ < S²⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < EDTA⁴⁻ < NH₃ < en < CN⁻ < CO", "Deciding weak-field vs strong-field.", "CN⁻ and CO are strong-field (cause pairing); halides are weak-field.", tag="PYQ favourite"),
F("CFT splitting (octahedral)", "t₂g (3 orbitals, −0.4Δₒ each) and e_g (2 orbitals, +0.6Δₒ each)", "Electron arrangement and CFSE."),
F("CFSE", "CFSE = (−0.4 x + 0.6 y) Δₒ (+ pairing energies);  x = t₂g, y = e_g electrons", "Stabilisation energy of complexes."),
F("High spin vs low spin", "Δₒ < P → high spin (weak field);  Δₒ > P → low spin (strong field)", "Magnetic moment of d⁴–d⁷ ions."),
F("Tetrahedral splitting", "Δₜ = (4/9) Δₒ;  almost always high spin", "Tetrahedral complexes like [NiCl₄]²⁻, [CoCl₄]²⁻."),
F("Spin-only magnetic moment", "μ = √(n(n + 2)) BM", "Comparing complexes.", None, tag="PYQ favourite"),
F("VBT hybridisation and geometry", "sp³ tetrahedral;  dsp² square planar;  sp³d² octahedral (outer orbital, high spin);  d²sp³ octahedral (inner orbital, low spin)", "Predicting geometry and magnetism."),
F("Geometrical isomers", "MA₄B₂ (octahedral): 2 (cis, trans);  MA₃B₃: 2 (fac, mer);  MA₂B₂ square planar: 2;  tetrahedral: none", "Counting cis/trans isomers."),
F("Optical isomers", "[M(AA)₃] (e.g. [Co(en)₃]³⁺): 2 enantiomers;  cis-[M(AA)₂B₂] is optically active, trans is not", "Chirality in complexes."),
F("Werner's theory", "primary valence = oxidation state (satisfied by anions, ionisable);  secondary valence = CN (fixed geometry)", "Interpreting AgCl precipitation and conductance data."),
],
"examples": [
X("Oxidation state", "Oxidation state of Co in [Co(NH₃)₅Cl]Cl₂?",
  f"Complex ion charge = +2: x + 0 − 1 = +2 → x = +{ox1}.", [(str(ox1), "3")]),
X("Low-spin iron(III)", "Magnetic moment of [Fe(CN)₆]³⁻?",
  f"Fe³⁺ d⁵, CN⁻ strong field → t₂g⁵ (1 unpaired) → μ = √3 ≈ {fx(mu2,2)} BM (d²sp³).", [(fx(mu2,2), "1.73")]),
X("High-spin iron(III)", "Magnetic moment of [FeF₆]³⁻?",
  f"F⁻ weak field → t₂g³e_g² (5 unpaired) → μ = √35 ≈ {fx(mu3,2)} BM (sp³d²).", [(fx(mu3,2), "5.92")]),
X("CFSE of [Co(NH₃)₆]³⁺", "Co³⁺ is d⁶; NH₃ makes it low spin. CFSE (ignore pairing energy)?",
  f"t₂g⁶e_g⁰: 6 × (−0.4Δₒ) = {fx(cfse4,1)}Δₒ; diamagnetic.", [(fx(cfse4,1), "−2.4")]),
X("CFSE of a d³ ion", "CFSE of [Cr(H₂O)₆]³⁺ (d³)?",
  f"t₂g³: 3 × (−0.4Δₒ) = {fx(cfse5,1)}Δₒ.", [(fx(cfse5,1), "−1.2")]),
X("Counting stereoisomers", "How many stereoisomers does [Co(en)₂Cl₂]⁺ have?",
  f"trans (optically inactive) + cis (a pair of enantiomers) = {iso6}.", [(str(iso6), "3")]),
X("Werner's data", "1 mol of CoCl₃·6NH₃ gives 3 mol AgCl with excess AgNO₃. Formula?",
  f"All {n7} Cl⁻ are ionisable → [Co(NH₃)₆]Cl₃.", [(str(n7), "3")]),
X("IUPAC name", "Name K₃[Fe(C₂O₄)₃].",
  "Potassium trioxalatoferrate(III): ligands alphabetically with prefixes, anionic complex ends in -ate (ferrate), oxidation state in Roman numerals.", []),
],
"topics": [
T("Key terms", "Ligand: ion or molecule donating an electron pair (monodentate NH₃, Cl⁻; bidentate en, C₂O₄²⁻; polydentate EDTA⁴⁻). Ambidentate ligands bind through two different atoms (NO₂⁻/ONO⁻, SCN⁻/NCS⁻). Chelate: ring formed by a polydentate ligand — extra stable (chelate effect)."),
T("IUPAC naming rules", "Cation before anion. Inside the bracket: ligands in alphabetical order (ignoring di/tri prefixes), then metal with oxidation state in Roman numerals. Anionic ligands end in -o (chlorido, cyanido, oxalato); neutral: aqua, ammine, carbonyl. Anionic complexes use -ate names (ferrate, cuprate, argentate, aurate, plumbate)."),
T("Structural isomerism", "Ionisation: [Co(NH₃)₅Br]SO₄ vs [Co(NH₃)₅SO₄]Br. Linkage: M–NO₂ vs M–ONO. Coordination: exchange of ligands between cationic and anionic complexes. Hydrate (solvate): [Cr(H₂O)₆]Cl₃ (violet) vs [Cr(H₂O)₅Cl]Cl₂·H₂O (green)."),
T("Colour of complexes", "Light of a certain energy (= Δ) excites an electron from t₂g to e_g; we see the complementary colour. [Ti(H₂O)₆]³⁺ is violet. Without ligands (anhydrous CuSO₄) there is no splitting, so it is white."),
T("Limitations of VBT and CFT", "VBT doesn't explain colour or the strength of ligands. CFT treats ligands as point charges and cannot explain why neutral CO is a strong ligand — that needs metal–ligand π back-bonding (as in metal carbonyls like Ni(CO)₄, Fe(CO)₅)."),
T("Importance and applications", "Haemoglobin (Fe), chlorophyll (Mg), vitamin B₁₂ (Co) are coordination compounds. EDTA is used to measure water hardness and treat lead poisoning; cis-platin is an anticancer drug; complexes are used in metallurgy (gold extraction with CN⁻) and analysis (Ni²⁺ with dimethylglyoxime)."),
],
"ratta": [
"Oxidation state from charge balance; CN = donor atoms.",
"Strong field: CN⁻, CO, en, NH₃;  weak: I⁻, Br⁻, Cl⁻, F⁻.",
"t₂g −0.4Δₒ, e_g +0.6Δₒ;  Δₜ = 4/9 Δₒ.",
"d²sp³ inner, low spin;  sp³d² outer, high spin;  dsp² square planar.",
"MA₄B₂: cis/trans;  MA₃B₃: fac/mer;  [M(AA)₃]: optical.",
"Anionic complex → -ate name.",
"Cis-platin anticancer;  EDTA hexadentate.",
],
}

SYLLABUS = [
("Introduction to coordination compounds, Werner's theory", ["Werner"]),
("Ligands, coordination number, denticity, chelation", ["ligand", "coordination number", "bidentate", "chelate"]),
("IUPAC nomenclature of mononuclear coordination compounds", ["IUPAC"]),
("Isomerism", ["isomer", "geometrical", "optical", "linkage", "ionisation"]),
("Bonding: valence bond approach and basic ideas of crystal field theory, colour and magnetic properties", ["valence bond", "crystal field", "colour", "magnetic"]),
("Importance of coordination compounds (qualitative analysis, extraction of metals and biological systems)", ["haemoglobin", "EDTA", "extraction"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
