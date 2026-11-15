from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "amines", "subject": "Chemistry",
"chapters": {"NEET": "Amines", "JEE": "Amines"},
"title": "Amines and Diazonium Salts", "readMinutes": 13,
"summary": [
"Amines are derivatives of ammonia: primary (RNH₂), secondary (R₂NH) and tertiary (R₃N). The nitrogen lone pair makes them bases and nucleophiles; nitrogen is sp³ and the molecule is pyramidal.",
"Aliphatic amines are stronger bases than ammonia (+I effect of alkyl groups); aromatic amines like aniline are much weaker (lone pair delocalised into the ring). In water the order is set by +I effect, solvation and steric hindrance together.",
"Primary, secondary and tertiary amines are told apart by the Hinsberg test, the carbylamine test (primary only) and their reactions with nitrous acid.",
"Aniline with NaNO₂/HCl at 0–5 °C gives benzenediazonium chloride, a versatile intermediate: Sandmeyer, Gattermann, coupling (azo dyes) and replacement by –OH, –I, –F, –H.",
],
"formulas": [
F("Reduction of nitro compounds", "ArNO₂ + Fe/HCl (or Sn/HCl, H₂/Pd) → ArNH₂", "Making aniline.", "Fe/HCl is preferred: the FeCl₂ formed is hydrolysed, releasing HCl, so only a little acid is needed."),
F("Gabriel phthalimide synthesis", "phthalimide + KOH → potassium phthalimide;  + RX → N-alkylphthalimide;  hydrolysis → RNH₂", "Pure primary aliphatic amines.", "Can't make aromatic amines (aryl halides don't undergo SN with phthalimide anion).", tag="PYQ favourite"),
F("Hoffmann bromamide degradation", "RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O", "Amine with one carbon less than the amide.", None, tag="PYQ favourite"),
F("Reduction of nitriles and amides", "RCN + LiAlH₄ (or H₂/Ni) → RCH₂NH₂ (one carbon more);  RCONH₂ + LiAlH₄ → RCH₂NH₂", "Ascending/same-carbon amines."),
F("Ammonolysis of alkyl halides", "RX + NH₃ → RNH₂ → R₂NH → R₃N → R₄N⁺X⁻", "Mixture of amines.", "Gives a mixture; a large excess of NH₃ favours the primary amine."),
F("Basicity in water (methyl)", "(CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃ > C₆H₅NH₂", "Comparing base strengths.", "In the gas phase the order is 3° > 2° > 1° > NH₃; in water solvation changes it."),
F("Basicity in water (ethyl)", "(C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃", "Comparing ethylamines."),
F("Basicity of anilines", "p-toluidine > aniline > p-nitroaniline;  pKb larger = weaker base", "Substituent effects.", "Electron-donating groups increase basicity; −R/−I groups decrease it."),
F("Carbylamine test", "RNH₂ + CHCl₃ + 3KOH (alc.) → RNC (foul smell) + 3KCl + 3H₂O", "Test for primary amines only."),
F("Hinsberg test", "C₆H₅SO₂Cl:  1° → sulphonamide soluble in KOH;  2° → sulphonamide insoluble in KOH;  3° → no reaction", "Distinguishing 1°, 2°, 3° amines.", None, tag="PYQ favourite"),
F("Reaction with nitrous acid", "aliphatic 1° amine + HNO₂ → alcohol + N₂↑;  aniline + NaNO₂/HCl (273–278 K) → C₆H₅N₂⁺Cl⁻", "Making diazonium salts."),
F("Diazonium replacements", "CuCl/HCl → ArCl;  CuBr/HBr → ArBr;  CuCN/KCN → ArCN (Sandmeyer);  Cu/HX → ArX (Gattermann);  KI → ArI;  HBF₄, heat → ArF;  H₃PO₂ or ethanol → ArH;  warm water → ArOH", "Converting –NH₂ into other groups."),
F("Coupling reaction", "C₆H₅N₂⁺Cl⁻ + phenol (OH⁻) → p-hydroxyazobenzene (orange);  + aniline (H⁺) → p-aminoazobenzene (yellow)", "Azo dyes.", "Here the N≡N group is retained — unlike replacement reactions."),
],
"examples": [
X("Hoffmann product", "Propanamide is treated with Br₂ and NaOH. Product?",
  "Ethanamine, CH₃CH₂NH₂ — one carbon less than the amide (CH₃CH₂CONH₂).", []),
X("Distinguish 1°, 2°, 3°", "How do you tell ethylamine, diethylamine and triethylamine apart?",
  "Hinsberg reagent: ethylamine gives a KOH-soluble sulphonamide; diethylamine gives an insoluble one; triethylamine does not react. Only ethylamine gives the carbylamine (foul smell) test.", []),
X("Why is aniline a weak base?", "Explain why aniline is weaker than methylamine.",
  "In aniline the lone pair on N is delocalised into the benzene ring (resonance), so it is less available for H⁺. In methylamine the +I effect of CH₃ makes the lone pair more available.", []),
X("Bromination of aniline", "Aniline + bromine water? How to get only p-bromoaniline?",
  "Bromine water gives 2,4,6-tribromoaniline (white ppt) because –NH₂ strongly activates the ring. Protect –NH₂ by acetylation (acetanilide), brominate (p-product), then hydrolyse.", []),
X("Nitration of aniline", "Why does direct nitration of aniline give a large amount of m-nitroaniline?",
  "In strongly acidic medium aniline is protonated to the anilinium ion (–NH₃⁺), which is meta-directing. About 47% meta product forms with para and some ortho, plus oxidation products.", []),
X("Diazonium route", "Convert aniline to benzonitrile.",
  "Aniline + NaNO₂/HCl at 0–5 °C → benzenediazonium chloride; then CuCN/KCN (Sandmeyer) → C₆H₅CN.", []),
],
"topics": [
T("Structure and nomenclature", "Nitrogen in amines is sp³ with a lone pair; C–N–C angle about 108°. Common names: methylamine, aniline (benzenamine), N,N-dimethylaniline. IUPAC: alkanamine (ethanamine), N-methylethanamine."),
T("Physical properties", "Lower aliphatic amines are gases with a fishy smell. Primary and secondary amines form intermolecular hydrogen bonds; boiling points: 1° > 2° > 3° for isomeric amines. Tertiary amines have no N–H, so they cannot H-bond with each other."),
T("Acylation", "Primary and secondary amines react with acid chlorides or anhydrides (nucleophilic substitution) to give amides; pyridine removes HCl. Benzoylation uses benzoyl chloride. Acetylation reduces the activating effect of –NH₂."),
T("Electrophilic substitution of aniline", "–NH₂ is strongly activating and o/p-directing. Sulphonation gives sulphanilic acid, which exists as a zwitterion. Aniline does not undergo Friedel–Crafts reactions: it forms a salt with AlCl₃ (a Lewis acid), which deactivates the ring."),
T("Diazonium salts", "ArN₂⁺X⁻; stable only at 273–278 K because the positive charge is delocalised over the benzene ring (aliphatic diazonium salts are unstable). They are used straight away in solution and are important for making aromatic compounds and dyes."),
T("Importance in daily life", "Amines are found in proteins, vitamins, alkaloids and hormones; synthetic examples include drugs and dyes. Quaternary ammonium salts are used as detergents."),
],
"ratta": [
"Gabriel: only 1° aliphatic amines.",
"Hoffmann bromamide: one carbon less.",
"Water: 2° > 1° > 3° > NH₃ (methyl);  aniline weakest.",
"Carbylamine: only 1° amines (foul smell).",
"Hinsberg: 1° soluble in KOH, 2° insoluble, 3° no reaction.",
"Diazotisation at 0–5 °C (273–278 K).",
"Sandmeyer CuX;  Gattermann Cu/HX;  H₃PO₂ → ArH.",
"Aniline: no Friedel–Crafts; nitration gives ~47% meta.",
],
}

SYLLABUS = [
("Amines: nomenclature, classification, structure, basic character and identification of primary, secondary and tertiary amines and their basic character", ["nomenclature", "basic", "primary", "secondary", "tertiary"]),
("Preparation and properties of amines", ["Gabriel", "Hoffmann"]),
("Diazonium salts: importance in synthetic organic chemistry", ["diazonium", "Sandmeyer", "coupling"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
