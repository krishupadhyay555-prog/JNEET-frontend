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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Living tissue ke chemical analysis se acid-soluble pool (micromolecules, molecular weight ~1000 Da se kam) aur acid-insoluble fraction (macromolecules — protein, nucleic acid, polysaccharides) milte hain; lipid bhi isme aate hain kyunki membranes vesicles mein toot jaati hain.",
"Proteins amino acids ke polymers (heteropolymers) hain; polysaccharides (carbohydrate) sugars ke polymers; nucleic acids nucleotides ke polymers.",
"Enzyme zyadatar proteins hain jo activation energy ghata kar reactions tez karte hain. Inki activity temperature, pH aur substrate concentration par depend karti hai, aur inhibit bhi ho sakti hai.",
"Enzymes chhe classes mein classify hote hain (jaise oxidoreductase, hydrolase, ligase), aur kai ko cofactors chahiye: prosthetic groups, coenzymes ya metal ions.",
],
when=[
("Abundance ke facts.", None),
("Amino acids ki structure.", None),
("Lipid ki structure.", "Palmitic acid mein 16 carbons (carboxyl carbon milakar); arachidonic acid mein 20 — galat count mat karna."),
("Nucleic acid ke building blocks.", None),
("Protein structure.", None),
("Linkages.", None),
("Carbohydrate polymers (polysaccharides).", None),
("Enzymes classify karna.", None),
("Enzyme kinetics.", "Competitive inhibitor Km badhaata hai par Vmax same rehta hai — confuse mat karna."),
("Holoenzyme = apoenzyme + cofactor.", None),
("Enzyme ki speed ka fact.", None),
("Enzymes ko affect karne wale factors.", None),
],
examples=[
("Acid-insoluble fraction mein lipids", "Lipids ka molecular weight chhota hai, phir acid-insoluble pool mein kyun aate hain?",
 "Tissue peesne par cell membranes toot kar acid mein insoluble vesicles ban jaati hain, isliye lipids macromolecules ke saath neeche aa jaate hain."),
("Enzyme class", "Ek enzyme substrate se bina hydrolysis groups hata kar double bond chhodta hai. Kaunsi class?",
 "Lyases (class 4)."),
("Competitive inhibition", "Malonate succinic dehydrogenase ko kyun inhibit karta hai?",
 "Malonate succinate jaisa dikhta hai, active site se judkar use block kar deta hai — competitive inhibition."),
("Starch vs cellulose", "Starch iodine se neela kyun hota hai par cellulose nahi?",
 "Starch helical secondary structures banata hai jo I₂ molecules pakad sakti hain; cellulose mein aisi complex helices nahi."),
("Haemoglobin structure", "Adult haemoglobin ki quaternary structure kya hai?",
 "Chaar subunits — do α aur do β chains — har ek mein ek haem group."),
("Holoenzyme", "Cofactor hatane par enzyme ki activity khatam ho jaati hai. Isse kya pata chalta hai?",
 "Akela protein part (apoenzyme) inactive hai; cofactor zaroori hai, dono milkar active holoenzyme banate hain."),
],
topics=[
("Primary and secondary metabolites", "Primary metabolites (amino acids, sugars) ka normal physiology mein pata role hai. Plants, fungi aur microbes ke secondary metabolites: pigments (carotenoids, anthocyanins), alkaloids (morphine, codeine), terpenoids (monoterpenes, diterpenes), essential oils (lemongrass oil), toxins (abrin, ricin), lectins (concanavalin A), drugs (vinblastine, curcumin), polymeric substances (rubber, gums, cellulose)."),
("Metabolic basis for living", "Metabolites metabolic pathways se ek doosre mein badalte hain — anabolic (biosynthetic, energy lete) aur catabolic (degradation, energy chhodte). ATP energy currency hai. Living state ek non-equilibrium steady state hai jo kaam kar sakta hai."),
("Nature of enzyme action", "Substrate active site se judkar enzyme–substrate complex (ES) banata hai, transition state banti hai, products nikalte hain aur enzyme phir kaam ke liye free. Enzymes activation energy ghataate hain; ribozymes nucleic acids hain jo enzyme ki tarah kaam karte hain."),
("Proteins and their roles", "Collagen (intercellular ground substance), trypsin (enzyme), insulin (hormone), antibodies (infection se ladte), receptors (sensory reception, jaise smell), GLUT-4 (glucose ko cells mein le jaata)."),
("Effect of substrate concentration", "Substrate concentration badhne par velocity badhti hai aur phir maximum (Vmax) par ruk jaati hai jab saari active sites bhar jaati hain."),
("Nucleic acid structure basics", "Nucleic acids mein phosphate ek sugar ke 3′ carbon ko agle ke 5′ carbon se jodta hai. B-DNA (Watson–Crick model) mein har turn mein 10 base pairs, 3.4 nm pitch aur base pairs ke beech 0.34 nm."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
