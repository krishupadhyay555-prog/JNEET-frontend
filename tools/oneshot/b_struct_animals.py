from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "structural-organisation-in-animals", "subject": "Biology",
"chapters": {"NEET": "Structural Organisation in Animals"},
"title": "Structural Organisation in Animals", "readMinutes": 13,
"summary": [
"Animal tissues are of four types: epithelial (covering), connective (support and binding), muscular (movement) and neural (control).",
"Epithelia are simple or compound and may be squamous, cuboidal, columnar or ciliated; glands are epithelial cells specialised for secretion. Cell junctions (tight, adhering, gap) join cells.",
"Connective tissue includes loose and dense connective tissue, cartilage, bone, blood and adipose tissue. Muscles are skeletal, smooth or cardiac.",
"The frog (Rana tigrina) is studied as a model vertebrate: its morphology, digestive, respiratory, circulatory, excretory, nervous and reproductive systems.",
],
"formulas": [
F("Simple epithelium", "squamous — blood vessel walls, air sacs of lungs;  cuboidal — ducts of glands, PCT of nephron (brush border);  columnar — stomach and intestine lining (microvilli);  ciliated — bronchioles, fallopian tubes", "Matching epithelium to location.", None, tag="PYQ favourite"),
F("Compound epithelium", "multi-layered; protective (skin, buccal cavity, pharynx, ducts of salivary and pancreatic glands)", "Where protection from chemical and mechanical stress is needed."),
F("Glands", "exocrine (with ducts — saliva, mucus, milk, earwax, digestive enzymes);  endocrine (ductless — hormones into blood)", "Glandular epithelium."),
F("Cell junctions", "tight junctions stop leakage;  adhering junctions cement cells together;  gap junctions connect cytoplasm for rapid transfer of ions and small molecules", "Junction functions.", None, tag="PYQ favourite"),
F("Connective tissue types", "loose: areolar (under skin), adipose (fat);  dense regular: tendons (muscle → bone), ligaments (bone → bone);  dense irregular: skin;  specialised: cartilage, bone, blood", "Classifying connective tissue.", "Blood is a fluid connective tissue."),
F("Cartilage and bone", "cartilage: chondrocytes in lacunae, pliable matrix (nose tip, outer ear, between vertebrae);  bone: osteocytes in lacunae, hard matrix of calcium salts and collagen; bone marrow makes blood cells", "Skeletal connective tissue."),
F("Muscle types", "skeletal: striated, voluntary, multinucleate;  smooth: non-striated, involuntary, spindle-shaped (gut, blood vessels);  cardiac: striated, involuntary, branched, intercalated discs", "Comparing muscles.", None, tag="PYQ favourite"),
F("Neural tissue", "neurons (excitable) + neuroglia (support and protect; more than half the volume of neural tissue)", "Nervous tissue."),
F("Frog heart and blood", "3 chambers (2 atria + 1 ventricle) + sinus venosus + conus arteriosus;  RBCs nucleated;  hepatic portal and renal portal systems", "Frog circulation.", None, tag="PYQ favourite"),
F("Frog respiration", "skin (cutaneous) in water and during hibernation/aestivation;  buccal cavity and lungs on land", "Frog breathing."),
F("Frog excretion", "ureotelic;  kidneys → ureters → cloaca;  in males the ureter is a urinogenital duct; in females ureters and oviducts open separately into the cloaca", "Frog excretory system."),
F("Frog nervous system", "10 pairs of cranial nerves;  brain = forebrain (olfactory lobes, cerebral hemispheres, diencephalon), midbrain (optic lobes), hindbrain (cerebellum, medulla oblongata)", "Frog CNS."),
F("Frog reproduction", "external fertilisation in water;  development via tadpole larva (metamorphosis);  female lays 2500–3000 ova at a time", "Frog life cycle."),
],
"examples": [
X("Tendon vs ligament", "What does a tendon connect, and what does a ligament connect?",
  "Tendon: skeletal muscle to bone. Ligament: bone to bone. Both are dense regular connective tissue.", []),
X("Which muscle?", "A muscle is striated, branched and involuntary, with intercalated discs. Which type?",
  "Cardiac muscle — the intercalated discs (fused plasma membranes with gap junctions) let the cells contract as a unit.", []),
X("Brush border", "Where is cuboidal epithelium with a brush border found?",
  "In the proximal convoluted tubule (PCT) of the nephron; microvilli increase the surface for reabsorption.", []),
X("Frog skin", "Why is frog skin always moist?",
  "Mucous glands keep it moist, and it must stay moist for cutaneous respiration (gas exchange through the skin) in water and during hibernation and aestivation.", []),
X("Male or female frog?", "How do you tell a male frog from a female?",
  "Males have vocal sacs and a copulatory pad on the first digit of each forelimb; females lack both.", []),
X("Areolar tissue", "What cells does areolar tissue contain?",
  "Fibroblasts (make fibres), macrophages and mast cells, in a semi-fluid ground substance with collagen and elastic fibres.", []),
],
"topics": [
T("Organ and organ system", "Tissues form organs (stomach, lung, heart, kidney); organs form organ systems (digestive, respiratory). Complexity in organ and organ systems displays a recognisable trend through evolution."),
T("Blood", "A fluid connective tissue: plasma + formed elements (RBCs, WBCs, platelets). It is the main circulating fluid that transports substances."),
T("Frog morphology", "Body divisible into head and trunk; no neck or tail. Skin smooth and slippery; dorsal side olive green with dark spots, ventral side pale yellow. Frogs don't drink water but absorb it through the skin. They show camouflage (mimicry) and are cold-blooded (poikilothermous)."),
T("Frog digestive system", "Short alimentary canal (frogs are carnivores). Bilobed tongue catches insects. Liver secretes bile (stored in gall bladder); pancreas secretes pancreatic juice. Digestion completes in the intestine; food is absorbed by villi and microvilli. Undigested waste leaves through the cloaca."),
T("Frog sense organs", "Sense organs: touch (sensory papillae), taste (taste buds), smell (nasal epithelium), vision (eyes) and hearing (tympanum with internal ear). Eyes and internal ears are well organised; the rest are cellular aggregations around nerve endings."),
T("Endocrine glands in frog", "Pituitary, thyroid, parathyroid, thymus, pineal body, pancreatic islets, adrenals and gonads."),
],
"ratta": [
"Squamous — air sacs;  cuboidal — PCT;  columnar — gut;  ciliated — bronchioles, fallopian tube.",
"Tight stops leakage;  adhering cements;  gap connects cytoplasm.",
"Tendon: muscle-bone;  ligament: bone-bone.",
"Cardiac: striated, involuntary, intercalated discs.",
"Frog: 3-chambered heart, nucleated RBCs, 10 cranial nerves, ureotelic.",
"Male frog: vocal sacs + copulatory pad.",
],
}

SYLLABUS = [
("Animal tissues — epithelial, connective, muscular and neural", ["epithelial", "connective", "muscular", "neural"]),
("Morphology, anatomy and functions of digestive, circulatory, respiratory, nervous and reproductive systems of frog", ["frog", "digestive", "circulat", "respiration", "nervous", "reproduction"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
