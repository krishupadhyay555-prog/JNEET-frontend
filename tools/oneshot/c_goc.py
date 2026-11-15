from lib import F, X, T, sig, fx, _check_and_write

pN1 = 0.28 / 0.5 * 100                         # Kjeldahl
pCl2 = 0.287 * 35.5 / 143.5 / 0.2 * 100       # Carius
pC3 = 0.44 * 12 / 44 / 0.3 * 100              # Liebig C
dbe4 = 6 - 6 / 2 + 1                           # benzene C6H6 DBE

DOC = {
"slug": "organic-chemistry-basic-principles", "subject": "Chemistry",
"chapters": {"NEET": "Organic Chemistry Basic Principles", "JEE": "Organic Chemistry Basic Principles"},
"title": "Organic Chemistry: Some Basic Principles and Techniques", "readMinutes": 15,
"summary": [
"Carbon forms four bonds (tetravalency), long chains (catenation) and multiple bonds. Hybridisation (sp³, sp², sp) decides shape and bond angles.",
"Electron displacement effects — inductive (σ bonds), resonance/mesomeric (π systems), hyperconjugation and electromeric effect — explain the stability of carbocations, carbanions and free radicals and the strength of acids and bases.",
"Reactions happen when nucleophiles (electron-rich) attack electrophiles (electron-poor). Bonds break homolytically (free radicals) or heterolytically (ions).",
"Purification (crystallisation, distillation, chromatography), qualitative tests (Lassaigne's test) and quantitative estimation (Dumas, Kjeldahl, Carius, Liebig) are the practical side of the chapter.",
],
"formulas": [
F("Hybridisation from bonds", "4 σ → sp³ (109.5°);  3 σ + 1 π → sp² (120°);  2 σ + 2 π → sp (180°)", "Shape and bond angle at a carbon.", "Count σ bonds (and lone pairs) around the atom, not the total number of bonds."),
F("Degree of unsaturation (DBE)", "DBE = C − H/2 − X/2 + N/2 + 1", "Rings + π bonds from a molecular formula.", "Ignore O and S; treat halogens like H."),
F("Inductive effect", "−I: NO₂ > CN > F > Cl > Br > I > OH;  +I: (CH₃)₃C > (CH₃)₂CH > CH₃CH₂ > CH₃", "Acid strength, carbocation stability.", "The inductive effect fades quickly with distance (beyond ~3 carbons it is negligible)."),
F("Resonance (mesomeric) effect", "+R: −OH, −OR, −NH₂, −X (donate lone pair);  −R: −NO₂, −CHO, −COOH, −CN (withdraw π electrons)", "Stability of conjugated species, directing effects."),
F("Carbocation stability", "benzylic ≈ allylic > 3° > 2° > 1° > CH₃⁺", "Predicting rearrangements and SN1/E1 rates.", None, tag="PYQ favourite"),
F("Free radical stability", "benzylic > allylic > 3° > 2° > 1° > CH₃•", "Halogenation, peroxide effect."),
F("Carbanion stability", "CH₃⁻ > 1° > 2° > 3° (opposite of carbocations); stabilised by −I/−R groups and sp character", "Acidic C–H, carbanion reactions."),
F("Hyperconjugation", "more α-hydrogens → more hyperconjugation → greater stability", "Carbocations and alkenes.", "It explains why 3° carbocations and more substituted alkenes are more stable."),
F("Kjeldahl's method", "% N = (1.4 × N_acid × V_acid used)/mass of compound", "Nitrogen estimation.", "Not for nitro, azo compounds or N in a ring (pyridine)."),
F("Dumas method", "% N = (28 × V_N₂ at STP)/(22400 × mass) × 100", "Nitrogen estimation for all compounds."),
F("Carius method", "% X = (atomic mass of X × mass of AgX)/(molar mass of AgX × mass of compound) × 100;  % S via BaSO₄", "Halogen and sulphur estimation."),
F("Liebig's method (C and H)", "% C = (12/44) × (mass CO₂/mass compound) × 100;  % H = (2/18) × (mass H₂O/mass compound) × 100", "Carbon and hydrogen estimation."),
],
"examples": [
X("Kjeldahl", "0.5 g of a compound gives NH₃ that neutralises 10 mL of 1 M H₂SO₄. % N?",
  f"10 mL of 1 M H₂SO₄ neutralises 0.02 mol NH₃ = 0.28 g N. % N = {fx(pN1)}%.", [(fx(pN1), "56")]),
X("Carius", "0.20 g of a compound gives 0.287 g AgCl. % Cl?",
  f"Cl = 0.287 × 35.5/143.5 = 0.071 g → {fx(pCl2,1)}%.", [(fx(pCl2,1), "35.5")]),
X("Liebig", "0.30 g of a compound gives 0.44 g CO₂. % C?",
  f"C = 0.44 × 12/44 = 0.12 g → {fx(pC3)}%.", [(fx(pC3), "40")]),
X("Degree of unsaturation", "DBE of benzene, C₆H₆?",
  f"DBE = 6 − 6/2 + 1 = {fx(dbe4)} (one ring + three C=C).", [(fx(dbe4), "4")]),
X("Most stable carbocation", "Order: CH₃⁺, (CH₃)₃C⁺, C₆H₅CH₂⁺, (CH₃)₂CH⁺.",
  "C₆H₅CH₂⁺ (resonance) > (CH₃)₃C⁺ > (CH₃)₂CH⁺ > CH₃⁺ (hyperconjugation and +I).", []),
X("Acid strength", "Order: CH₃COOH, ClCH₂COOH, Cl₂CHCOOH, FCH₂COOH.",
  "Cl₂CHCOOH > FCH₂COOH > ClCH₂COOH > CH₃COOH — more and stronger −I groups stabilise the carboxylate ion.", []),
X("Lassaigne's test", "A sodium fusion extract gives a blood-red colour with FeCl₃. Which elements are present?",
  "Both N and S: they form NaSCN, which gives blood-red [Fe(SCN)]²⁺. N alone gives Prussian blue; S alone gives violet with sodium nitroprusside.", []),
],
"topics": [
T("IUPAC nomenclature", "Find the longest chain containing the principal functional group, number it to give that group the lowest locant, name substituents alphabetically. Priority of suffixes: –COOH > –SO₃H > –COOR > –COCl > –CONH₂ > –CN > –CHO > >C=O > –OH > –NH₂ > C=C > C≡C."),
T("Isomerism", "Structural: chain, position, functional group, metamerism, tautomerism (keto–enol). Stereoisomerism: geometrical (cis/trans across C=C or in rings) and optical (chiral carbon, non-superimposable mirror images)."),
T("Bond fission and reactive intermediates", "Homolytic fission gives free radicals (in light/peroxides); heterolytic fission gives carbocations and carbanions. Carbocations are planar (sp²), carbanions pyramidal (sp³), free radicals planar."),
T("Nucleophiles and electrophiles", "Nucleophiles: OH⁻, CN⁻, NH₃, H₂O, ROH (lone pairs or negative charge). Electrophiles: H⁺, NO₂⁺, carbocations, BF₃, AlCl₃ (electron-deficient). Reactions: substitution, addition, elimination, rearrangement."),
T("Electromeric effect", "A temporary, complete shift of π electrons to one atom when a reagent approaches — operates only in the presence of the reagent (unlike the permanent inductive and resonance effects)."),
T("Purification methods", "Crystallisation (solubility difference), sublimation (camphor, naphthalene), simple distillation (large bp difference), fractional distillation (close bp), distillation under reduced pressure (decomposes at bp), steam distillation (steam-volatile, immiscible — aniline), differential extraction, and chromatography (adsorption or partition; Rf = distance by compound/distance by solvent)."),
T("Qualitative analysis", "Sodium fusion (Lassaigne) converts N, S, X to NaCN, Na₂S, NaX. N: Prussian blue with FeSO₄ + FeCl₃. S: black PbS with lead acetate, violet with nitroprusside. Halogens: AgNO₃ after boiling with HNO₃ (white AgCl soluble in NH₃, pale-yellow AgBr, yellow AgI)."),
],
"ratta": [
"sp³ 109.5°, sp² 120°, sp 180°.",
"DBE = C − H/2 − X/2 + N/2 + 1.",
"Carbocation: benzyl ≈ allyl > 3° > 2° > 1° > methyl.",
"Carbanion: methyl > 1° > 2° > 3°.",
"−I: NO₂ > CN > F > Cl > Br > I;  +I: tert-butyl > isopropyl > ethyl > methyl.",
"Kjeldahl % N = 1.4 NV/w (not for nitro/azo/ring N).",
"N + S → blood red;  N → Prussian blue.",
],
}

SYLLABUS = [
("Tetravalency of carbon, shapes of simple molecules — hybridisation", ["tetravalency", "hybridisation"]),
("Classification and IUPAC nomenclature", ["IUPAC"]),
("Isomerism — structural and stereoisomerism", ["isomerism", "structural", "stereoisomerism"]),
("Purification — crystallisation, sublimation, distillation, differential extraction, chromatography", ["crystallisation", "sublimation", "distillation", "extraction", "chromatography"]),
("Qualitative analysis (N, S, P, halogens) and quantitative analysis (C, H, N, halogens, S)", ["Lassaigne", "Kjeldahl", "Dumas", "Carius", "Liebig"]),
("Covalent bond fission, free radicals, carbocations, carbanions, electrophiles and nucleophiles", ["homolytic", "heterolytic", "free radical", "carbocation", "carbanion", "electrophile", "nucleophile"]),
("Electronic displacement: inductive, electromeric, resonance, hyperconjugation", ["inductive", "electromeric", "resonance", "hyperconjugation"]),
("Common types of organic reactions — substitution, addition, elimination, rearrangement", ["substitution", "addition", "elimination", "rearrangement"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
