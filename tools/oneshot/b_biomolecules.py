from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "biomolecules-biology", "subject": "Biology",
"chapters": {"NEET": "Biomolecules"},
"title": "Biomolecules (Biology)", "readMinutes": 13,
"summary": [
"Chemical analysis of living tissue gives an acid-soluble pool (micromolecules, molecular weight below ~1000 Da) and an acid-insoluble fraction (macromolecules — proteins, nucleic acids, polysaccharides; lipids appear here because membranes break into vesicles).",
"Proteins are polymers of amino acids (heteropolymers); polysaccharides are polymers of sugars; nucleic acids are polymers of nucleotides.",
"Enzymes are mostly proteins that speed up reactions by lowering activation energy. Their activity depends on temperature, pH and substrate concentration, and can be inhibited.",
"Enzymes are classified into six classes, and many need cofactors: prosthetic groups, coenzymes or metal ions.",
],
"formulas": [
F("Most abundant", "most abundant chemical in living organisms: water (70–90%);  most abundant protein in the animal world: collagen;  in the whole biosphere: RuBisCO", "Abundance facts.", None, tag="PYQ favourite"),
F("Amino acid", "α-carbon bonded to H, –NH₂, –COOH and an R group;  20 types;  zwitterion form at isoelectric pH", "Structure of amino acids."),
F("Lipids", "fatty acid + glycerol → mono-, di-, triglycerides;  saturated (no C=C) or unsaturated (one or more C=C);  phospholipids (lecithin) in membranes", "Lipid structure.", "Palmitic acid has 16 carbons (including the carboxyl carbon); arachidonic acid has 20."),
F("Nucleotide", "nitrogen base + pentose sugar (nucleoside) + phosphate;  adenine, guanine (purines);  cytosine, uracil, thymine (pyrimidines)", "Nucleic acid building blocks."),
F("Protein structure levels", "primary (sequence; N-terminal to C-terminal);  secondary (α-helix — right-handed);  tertiary (3-D folding);  quaternary (subunits — haemoglobin: 2α + 2β)", "Protein structure.", None, tag="PYQ favourite"),
F("Bonds in polymers", "peptide bond (amino acids);  glycosidic bond (monosaccharides);  phosphodiester bond (nucleotides);  ester bond (fatty acid + glycerol)", "Linkages."),
F("Polysaccharides", "starch (helical, holds I₂ → blue);  cellulose (no complex helix, doesn't hold I₂);  glycogen (animal storage);  inulin (fructose polymer);  chitin (complex polysaccharide in exoskeletons and fungal walls)", "Carbohydrate polymers (polysaccharides)."),
F("Enzyme classes", "1 oxidoreductases/dehydrogenases;  2 transferases;  3 hydrolases;  4 lyases;  5 isomerases;  6 ligases", "Classifying enzymes.", None, tag="PYQ favourite"),
F("Michaelis constant and inhibition", "Km = substrate concentration at ½Vmax;  competitive inhibitor resembles substrate — malonate inhibits succinic dehydrogenase", "Enzyme kinetics.", "A competitive inhibitor raises Km but Vmax stays the same."),
F("Cofactors", "prosthetic group (tightly bound — haem in peroxidase, catalase);  coenzyme (loosely bound, often vitamin-derived — NAD, NADP from niacin);  metal ion (Zn²⁺ for carboxypeptidase)", "Holoenzyme = apoenzyme + cofactor."),
F("Fastest enzyme", "carbonic anhydrase: CO₂ + H₂O ⇌ H₂CO₃, about 600,000 reactions per second (≈ 10⁷ times faster than uncatalysed)", "Enzyme speed fact."),
F("Effect of temperature and pH", "activity rises to an optimum, then falls; low temperature inactivates reversibly, high temperature denatures", "Factors affecting enzymes."),
],
"examples": [
X("Lipids in the acid-insoluble fraction", "Lipids have small molecular weights, so why do they appear in the acid-insoluble pool?",
  "When tissue is ground, cell membranes break into vesicles that are insoluble in acid, so the lipids come down with the macromolecules.", []),
X("Enzyme class", "An enzyme removes groups from a substrate without hydrolysis, leaving a double bond. Which class?",
  "Lyases (class 4).", []),
X("Competitive inhibition", "Why does malonate inhibit succinic dehydrogenase?",
  "Malonate closely resembles succinate, binds the active site and blocks it — competitive inhibition.", []),
X("Starch vs cellulose", "Why does starch turn blue with iodine but cellulose doesn't?",
  "Starch forms helical secondary structures that can hold I₂ molecules; cellulose has no such complex helices.", []),
X("Haemoglobin structure", "What is the quaternary structure of adult haemoglobin?",
  "Four subunits — two α and two β chains — each holding a haem group.", []),
X("Holoenzyme", "An enzyme loses activity when its cofactor is removed. What does this show?",
  "The protein part (apoenzyme) alone is inactive; the cofactor is essential, together forming the active holoenzyme.", []),
],
"topics": [
T("Primary and secondary metabolites", "Primary metabolites (amino acids, sugars) have known roles in normal physiology. Secondary metabolites in plants, fungi and microbes include pigments (carotenoids, anthocyanins), alkaloids (morphine, codeine), terpenoids (monoterpenes, diterpenes), essential oils (lemongrass oil), toxins (abrin, ricin), lectins (concanavalin A), drugs (vinblastine, curcumin), polymeric substances (rubber, gums, cellulose)."),
T("Metabolic basis for living", "Metabolites are converted into each other by metabolic pathways — anabolic (biosynthetic, consume energy) and catabolic (degradation, release energy). ATP is the energy currency. The living state is a non-equilibrium steady state that can do work."),
T("Nature of enzyme action", "Substrate binds the active site to form an enzyme–substrate complex (ES), the transition state forms, products are released and the enzyme is free to act again. Enzymes lower the activation energy; ribozymes are nucleic acids that act as enzymes."),
T("Proteins and their roles", "Collagen (intercellular ground substance), trypsin (enzyme), insulin (hormone), antibodies (fight infection), receptors (sensory reception, e.g. smell), GLUT-4 (glucose transport into cells)."),
T("Effect of substrate concentration", "Velocity rises with substrate concentration and then reaches a maximum (Vmax) when all active sites are filled."),
T("Nucleic acid structure basics", "In nucleic acids, the phosphate links the 3′ carbon of one sugar to the 5′ carbon of the next. B-DNA (Watson–Crick model) has 10 base pairs per turn, 3.4 nm pitch and 0.34 nm between base pairs."),
],
"ratta": [
"Collagen — most abundant animal protein;  RuBisCO — biosphere.",
"Six classes: Oxido, Trans, Hydro, Lyase, Iso, Ligase.",
"Malonate inhibits succinic dehydrogenase.",
"Carbonic anhydrase fastest.",
"Haemoglobin: 2α + 2β.",
"Haem — prosthetic;  NAD (niacin) — coenzyme;  Zn²⁺ — carboxypeptidase.",
"Starch holds I₂ (blue); cellulose doesn't.",
],
}

SYLLABUS = [
("Chemical constituents of living cells: biomolecules — structure and function of proteins, carbohydrates, lipids, nucleic acids", ["protein", "carbohydrate", "lipid", "nucleic acid"]),
("Enzymes — types, properties, enzyme action", ["enzyme", "active site"]),
("Classification and nomenclature of enzymes", ["oxidoreductase", "hydrolase", "ligase"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
