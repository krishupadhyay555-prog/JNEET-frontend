from lib import F, X, T, sig, fx, _check_and_write

aa1 = 5            # peptide bonds in a hexapeptide = n − 1
tri2 = 3 * 3 * 3   # tripeptides from 3 different amino acids (repetition allowed)

DOC = {
"slug": "biomolecules-chemistry", "subject": "Chemistry",
"chapters": {"NEET": "Biomolecules", "JEE": "Biomolecules"},
"title": "Biomolecules (Chemistry)", "readMinutes": 13,
"summary": [
"Carbohydrates are polyhydroxy aldehydes or ketones: monosaccharides (glucose, fructose), disaccharides (sucrose, maltose, lactose) and polysaccharides (starch, cellulose, glycogen).",
"Glucose exists mainly in a six-membered ring (pyranose) form with α and β anomers. Sugars with a free aldehyde or ketone group are reducing sugars; sucrose is non-reducing.",
"Proteins are polymers of α-amino acids joined by peptide bonds. Their structure has four levels (primary to quaternary); denaturation destroys the higher levels but not the primary structure.",
"Nucleic acids (DNA, RNA) are polymers of nucleotides — sugar + base + phosphate. Vitamins and hormones are small molecules with big biological roles.",
],
"formulas": [
F("Glucose structure evidence", "HI → n-hexane (straight chain);  acetylation → pentaacetate (5 –OH);  HCN → cyanohydrin and NH₂OH → oxime (C=O);  Br₂ water → gluconic acid (–CHO);  HNO₃ → saccharic acid (–CHO and 1° –OH)", "Open-chain structure of glucose.", None, tag="PYQ favourite"),
F("Evidence against open chain", "no Schiff's test and no reaction with NaHSO₃;  pentaacetate does not react with NH₂OH;  two anomers (α, β)", "Why glucose has a ring structure."),
F("Anomers and mutarotation", "α-D-glucose (+111°) ⇌ open chain ⇌ β-D-glucose (+19°);  equilibrium +52.5°", "Change of specific rotation in solution.", "Anomers differ only at C1; they are not mirror images."),
F("Disaccharides and their links", "sucrose = α-glucose (C1) + β-fructose (C2), non-reducing;  maltose = α-glucose C1–C4, reducing;  lactose = β-galactose C1–C4 glucose, reducing", "Glycosidic linkages.", None, tag="PYQ favourite"),
F("Invert sugar", "sucrose (+66.5°) + H₂O → glucose (+52.5°) + fructose (−92.4°) → mixture is laevorotatory", "Why hydrolysed sucrose is called invert sugar."),
F("Polysaccharides", "starch = amylose (15–20%, unbranched, α-1,4) + amylopectin (80–85%, branched, α-1,6 at branches);  cellulose = β-1,4 glucose;  glycogen = highly branched, like amylopectin", "Structure of storage and structural carbohydrates."),
F("Peptide bond", "–CO–NH–, formed by condensation of –COOH of one amino acid and –NH₂ of the next; n amino acids → n − 1 peptide bonds", "Counting peptide bonds."),
F("Zwitterion", "H₃N⁺–CHR–COO⁻; at the isoelectric point the net charge is zero", "Why amino acids have high melting points and are water-soluble."),
F("Levels of protein structure", "primary (sequence) → secondary (α-helix, β-pleated sheet; H-bonds) → tertiary (overall folding: H-bonds, disulphide, ionic, van der Waals) → quaternary (subunits)", "Describing protein structure."),
F("Nucleotide", "nucleoside (base + pentose sugar) + phosphate;  nucleotides joined by 3′–5′ phosphodiester bonds", "Structure of nucleic acids."),
F("Bases", "DNA: A, G, C, T;  RNA: A, G, C, U;  purines A, G;  pyrimidines C, T, U;  pairs A=T (2 H-bonds), G≡C (3 H-bonds)", "Base pairing."),
F("Vitamins and deficiencies", "fat-soluble A, D, E, K;  water-soluble B group and C.  A → night blindness;  B₁ → beri-beri;  B₁₂ → pernicious anaemia;  C → scurvy;  D → rickets;  K → delayed blood clotting", "Matching vitamins to diseases.", "B₁₂ is water-soluble but can be stored in the liver.", tag="PYQ favourite"),
],
"examples": [
X("Peptide bonds", "How many peptide bonds are in a hexapeptide?",
  f"n − 1 = 6 − 1 = {aa1}.", [(str(aa1), "5")]),
X("Number of tripeptides", "How many different tripeptides can be made from glycine, alanine and valine if each may be used more than once?",
  f"3 choices for each of 3 positions: 3 × 3 × 3 = {tri2}.", [(str(tri2), "27")]),
X("Reducing sugar?", "Which are reducing: glucose, fructose, sucrose, maltose, lactose?",
  "All except sucrose. In sucrose both anomeric carbons (C1 of glucose and C2 of fructose) are used in the glycosidic bond, so there is no free hemiacetal group.", []),
X("Denaturation", "What happens when an egg is boiled?",
  "Heat denatures albumin: the secondary and tertiary structures unfold and the globular protein coagulates. The primary structure (amino acid sequence) is unchanged.", []),
X("Essential amino acids", "Name the difference between essential and non-essential amino acids.",
  "Essential ones (valine, leucine, isoleucine, lysine, threonine, methionine, phenylalanine, tryptophan, histidine, arginine) must come from food; non-essential ones (glycine, alanine, glutamic acid) are made in the body.", []),
X("DNA vs RNA", "Give three differences between DNA and RNA.",
  "DNA has deoxyribose, thymine and a double helix; RNA has ribose, uracil and is usually single-stranded. DNA carries genetic information; RNA (m, t, r) helps make proteins.", []),
],
"topics": [
T("Classification of carbohydrates", "Reducing vs non-reducing; aldoses vs ketoses; monosaccharides (cannot be hydrolysed), oligosaccharides (2–10 units) and polysaccharides. D/L refers to the configuration at the last chiral carbon relative to glyceraldehyde, not the direction of rotation."),
T("Fructose", "A ketohexose, laevorotatory; it forms a five-membered (furanose) ring. It reduces Tollens' and Fehling's reagents because in alkaline medium it isomerises to an aldose."),
T("Amino acids", "α-Amino acids have –NH₂ and –COOH on the same carbon. Acidic (aspartic, glutamic), basic (lysine, arginine) and neutral types. All except glycine are optically active and mostly have the L-configuration."),
T("Fibrous and globular proteins", "Fibrous proteins (keratin, myosin) are long, thread-like and insoluble; globular proteins (insulin, albumin) are spherical and water-soluble."),
T("Enzymes", "Biological catalysts, mostly globular proteins, highly specific; they lower activation energy. Example: maltase converts maltose to glucose."),
T("Hormones", "Chemical messengers from endocrine glands: steroid (oestrogen, testosterone), polypeptide (insulin, glucagon) and amino-acid derivatives (thyroxine, adrenaline). Insulin lowers and glucagon raises blood glucose."),
T("Biological functions of nucleic acids", "DNA replicates itself and carries heredity; transcription makes mRNA, and translation on ribosomes (with tRNA carrying amino acids) makes proteins."),
],
"ratta": [
"Sucrose: non-reducing; invert sugar is laevorotatory.",
"Maltose α-1,4;  lactose β-1,4;  cellulose β-1,4;  amylopectin α-1,6 branches.",
"Glucose pentaacetate: 5 –OH;  HI → n-hexane.",
"n amino acids → n − 1 peptide bonds.",
"A=T (2 H-bonds), G≡C (3);  RNA has U.",
"A, D, E, K fat-soluble;  B, C water-soluble.",
"C → scurvy;  D → rickets;  B₁ → beri-beri;  A → night blindness.",
],
}

SYLLABUS = [
("Carbohydrates — classification: aldoses and ketoses; monosaccharides (glucose and fructose) and constituent monosaccharides of oligosaccharides (sucrose, lactose and maltose)", ["aldose", "ketose", "glucose", "fructose", "sucrose", "lactose", "maltose"]),
("Proteins — elementary idea of α-amino acids, peptide bond, polypeptides; primary, secondary, tertiary and quaternary structure; denaturation of proteins, enzymes", ["amino acid", "peptide", "primary", "quaternary", "denaturation", "enzyme"]),
("Vitamins — classification and functions", ["vitamin", "fat-soluble"]),
("Nucleic acids — chemical constitution of DNA and RNA; biological functions", ["DNA", "RNA", "nucleotide"]),
("Hormones — general introduction", ["hormone"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
