from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "cell-the-unit-of-life", "subject": "Biology",
"chapters": {"NEET": "Cell: The Unit of Life"},
"title": "Cell: The Unit of Life", "readMinutes": 14,
"summary": [
"Cell theory (Schleiden and Schwann; modified by Rudolf Virchow — omnis cellula e cellula) says all living organisms are made of cells, and all cells arise from pre-existing cells.",
"Prokaryotic cells (bacteria, cyanobacteria, mycoplasma) lack a nuclear membrane and membrane-bound organelles; eukaryotic cells have both.",
"The plasma membrane follows the fluid mosaic model (Singer and Nicolson, 1972). The endomembrane system — ER, Golgi, lysosomes, vacuoles — works together; mitochondria and plastids are semi-autonomous with their own DNA and 70S ribosomes.",
"The nucleus controls the cell; chromosomes are classified by centromere position.",
],
"formulas": [
F("Cell theory", "Schleiden (1838, plants) + Schwann (1839, animals);  Virchow (1855): omnis cellula e cellula", "History of the cell theory.", None, tag="PYQ favourite"),
F("Cell size extremes", "smallest: mycoplasma (~0.3 μm);  bacteria 3–5 μm;  largest single cell: ostrich egg;  human RBC ~7 μm;  longest: nerve cells", "Size comparisons."),
F("Ribosomes", "prokaryotes: 70S (50S + 30S);  eukaryotic cytoplasm: 80S (60S + 40S);  mitochondria and chloroplasts: 70S", "Ribosome types.", "S (Svedberg unit) measures sedimentation rate, so subunit values don't add up arithmetically.", tag="PYQ favourite"),
F("Fluid mosaic model", "quasi-fluid lipid bilayer with proteins (peripheral and integral);  human RBC membrane ~52% protein, 40% lipid", "Membrane structure."),
F("Membrane transport", "passive (along concentration gradient, no energy — diffusion, osmosis);  active (against gradient, uses ATP — Na⁺/K⁺ pump)", "Transport across membranes."),
F("Endomembrane system", "ER + Golgi complex + lysosomes + vacuoles (functions coordinated);  mitochondria, chloroplasts and peroxisomes are NOT part of it", "Organelle grouping.", None, tag="PYQ favourite"),
F("ER functions", "RER (with ribosomes): protein synthesis and secretion;  SER: lipid synthesis; in animals lipid-like steroid hormones are made in SER", "Rough vs smooth ER."),
F("Golgi apparatus", "cis (forming) face → trans (maturing) face;  packaging of materials, site of formation of glycoproteins and glycolipids", "Golgi functions (Camillo Golgi, 1898)."),
F("Mitochondria", "double membrane, inner folded into cristae; matrix has circular DNA, RNA, 70S ribosomes; site of aerobic respiration (powerhouse); divide by fission", "Mitochondrial structure."),
F("Plastids", "chloroplasts (chlorophyll, carotenoids);  chromoplasts (fat-soluble carotenoids — yellow, orange, red);  leucoplasts: amyloplasts (starch), elaioplasts (oils, fats), aleuroplasts (proteins)", "Types of plastids.", None, tag="PYQ favourite"),
F("Chloroplast structure", "double membrane; stroma (enzymes, circular DNA, 70S ribosomes); thylakoids stacked as grana; stroma lamellae connect grana", "Chloroplast anatomy."),
F("Cilia and flagella", "axoneme with 9 + 2 microtubule arrangement;  centriole and basal body: 9 + 0 (nine triplets, cartwheel)", "Microtubule arrangements.", None, tag="PYQ favourite"),
F("Chromosome types (by centromere)", "metacentric (middle, equal arms);  sub-metacentric (slightly away);  acrocentric (near end, very short arm);  telocentric (terminal)", "Classifying chromosomes."),
F("Nucleus", "double nuclear envelope with pores; nucleoplasm, nucleolus (site of rRNA synthesis) and chromatin (DNA + histones);  interphase nucleus shows chromatin, not chromosomes", "Nuclear structure (Robert Brown, 1831)."),
],
"examples": [
X("Semi-autonomous organelles", "Which organelles are called semi-autonomous, and why?",
  "Mitochondria and chloroplasts: they have their own circular DNA, RNA and 70S ribosomes, and can make some of their own proteins and divide by fission.", []),
X("Plant vs animal cell", "List features present in plant cells but absent in animal cells.",
  "Cell wall, plastids and a large central vacuole. Animal cells have centrioles, which most plant cells lack.", []),
X("Mesosome", "What is a mesosome and what does it do?",
  "An infolding of the plasma membrane in bacteria; it helps in cell wall formation, DNA replication and distribution to daughter cells, respiration and secretion, and increases the membrane surface area.", []),
X("Suicidal bags", "Why are lysosomes called suicidal bags?",
  "They are filled with hydrolytic enzymes (lipases, proteases, carbohydrases) active at acidic pH; if the membrane bursts the enzymes digest the cell itself.", []),
X("Satellite chromosome", "What is a satellite on a chromosome?",
  "A small fragment beyond a secondary constriction — the region that does not stain as darkly; chromosomes with it are called satellite chromosomes.", []),
X("Gram staining", "How do Gram-positive and Gram-negative bacteria differ in staining?",
  "Gram-positive bacteria keep the Gram stain (thick peptidoglycan wall); Gram-negative bacteria do not (thin wall with an outer membrane).", []),
],
"topics": [
T("Prokaryotic cell envelope", "Glycocalyx (slime layer or capsule), cell wall and plasma membrane. Prokaryotes have a nucleoid (naked circular DNA) and often plasmids (small circular DNA giving traits like antibiotic resistance). Inclusion bodies store reserve material: phosphate granules, cyanophycean granules, glycogen; gas vacuoles in some."),
T("Bacterial appendages", "Flagella (filament, hook, basal body) for movement; pili (elongated tubes) and fimbriae (small bristles, help attachment to rocks or host tissue)."),
T("Cell wall in plants", "Algae: cellulose, galactans, mannans and calcium carbonate. Plants: primary wall (growing cells), secondary wall (inside primary); middle lamella of calcium pectate holds neighbouring cells together; plasmodesmata connect cytoplasm."),
T("Vacuoles", "Bounded by the tonoplast; in plants can occupy up to 90% of the cell volume and concentrate ions much above the cytoplasm. Contractile vacuoles help osmoregulation in Amoeba; food vacuoles form by engulfing food."),
T("Cytoskeleton", "Microtubules, microfilaments and intermediate filaments give mechanical support, motility and help maintain cell shape."),
T("Centrosome", "Usually two cylindrical centrioles at right angles; centrioles form the basal bodies of cilia and flagella and the spindle fibres of the spindle apparatus in animal cell division."),
T("Microbodies", "Small membrane-bound vesicles containing enzymes, found in both plant and animal cells (peroxisomes, glyoxysomes)."),
],
"ratta": [
"Virchow: omnis cellula e cellula.",
"70S prokaryote, mito, chloroplast;  80S eukaryotic cytoplasm.",
"Endomembrane: ER, Golgi, lysosome, vacuole (not mito/plastid).",
"Cilia 9+2;  centriole 9+0 triplets.",
"Amyloplast starch, elaioplast oil, aleuroplast protein.",
"Metacentric middle, acrocentric near end, telocentric tip.",
"Nucleolus → rRNA.",
],
}

SYLLABUS = [
("Cell theory and cell as the basic unit of life", ["cell theory"]),
("Structure of prokaryotic and eukaryotic cells; plant cell and animal cell", ["prokaryotic", "eukaryotic", "plant cell", "animal cell"]),
("Cell envelope, cell membrane, cell wall", ["cell envelope", "membrane", "cell wall"]),
("Cell organelles — endomembrane system, ER, Golgi, lysosomes, vacuoles, mitochondria, ribosomes, plastids, microbodies; cytoskeleton, cilia, flagella, centrioles; nucleus", ["endomembrane", "Golgi", "lysosome", "vacuole", "mitochondria", "ribosome", "plastid", "microbodies", "cytoskeleton", "cilia", "flagella", "centriole", "nucleus"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
