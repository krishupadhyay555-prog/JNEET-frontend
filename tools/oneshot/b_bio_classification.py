from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "biological-classification", "subject": "Biology",
"chapters": {"NEET": "Biological Classification"},
"title": "Biological Classification", "readMinutes": 13,
"summary": [
"R.H. Whittaker (1969) proposed five kingdoms — Monera, Protista, Fungi, Plantae and Animalia — based on cell structure, body organisation, mode of nutrition, reproduction and phylogenetic relationships.",
"Monera are prokaryotes (bacteria, cyanobacteria, archaebacteria, mycoplasma). Protista are unicellular eukaryotes (chrysophytes, dinoflagellates, euglenoids, slime moulds, protozoans).",
"Fungi are heterotrophic, with chitin cell walls and hyphae; they are classified by spores and fruiting bodies into Phycomycetes, Ascomycetes, Basidiomycetes and Deuteromycetes.",
"Viruses, viroids, prions and lichens do not fit the five-kingdom scheme: viruses are nucleoprotein particles that are inert outside a host cell.",
],
"formulas": [
F("Two-kingdom vs five-kingdom", "Linnaeus: Plantae + Animalia;  Whittaker (1969): Monera, Protista, Fungi, Plantae, Animalia", "History of classification.", "Two-kingdom grouping put prokaryotes with eukaryotes and unicellular with multicellular organisms."),
F("Bacterial shapes", "coccus (spherical), bacillus (rod), vibrium (comma), spirillum (spiral)", "Identifying bacteria."),
F("Archaebacteria", "halophiles (salty areas), thermoacidophiles (hot springs), methanogens (marshes, cattle gut → methane/biogas)", "Extreme-habitat bacteria.", "Their cell wall structure is different from other bacteria — this lets them survive extreme conditions.", tag="PYQ favourite"),
F("Cyanobacteria", "photosynthetic autotrophs with chlorophyll a; many fix nitrogen in heterocysts (Nostoc, Anabaena); form blooms in polluted water", "Blue-green algae facts."),
F("Mycoplasma", "no cell wall, smallest living cells, can survive without oxygen, many are pathogenic", "Unusual monerans."),
F("Protist groups", "chrysophytes (diatoms, desmids — silica walls, diatomaceous earth);  dinoflagellates (red tides, Gonyaulax);  euglenoids (pellicle, mixotrophic);  slime moulds (saprophytic, plasmodium, spores);  protozoans (amoeboid, flagellated, ciliated, sporozoans)", "Kingdom Protista.", None, tag="PYQ favourite"),
F("Protozoan examples", "amoeboid — Amoeba, Entamoeba;  flagellated — Trypanosoma (sleeping sickness);  ciliated — Paramoecium;  sporozoans — Plasmodium (malaria)", "Protozoan diseases."),
F("Fungal classes", "Phycomycetes: aseptate coenocytic, zoospores/aplanospores, oospores/zygospores (Mucor, Rhizopus, Albugo);  Ascomycetes: septate, conidia, ascospores in asci (Penicillium, yeast, Neurospora, morels, truffles);  Basidiomycetes: basidiospores, no asexual spores (Agaricus, Ustilago, Puccinia);  Deuteromycetes: only asexual stage known (Alternaria, Colletotrichum, Trichoderma)", "Classifying fungi.", None, tag="PYQ favourite"),
F("Fungal reproduction", "plasmogamy → karyogamy → meiosis;  dikaryon (n + n) stage in ascomycetes and basidiomycetes", "Sexual cycle of fungi."),
F("Viruses", "nucleoprotein: DNA or RNA + protein coat (capsid made of capsomeres);  plant viruses usually ssRNA, animal viruses ssRNA/dsRNA/dsDNA, bacteriophages usually dsDNA", "Virus structure.", "D.J. Ivanowsky (1892) found TMV; M.W. Beijerinck called the fluid contagium vivum fluidum; W.M. Stanley crystallised viruses."),
F("Viroids and prions", "viroid: free RNA without protein coat (T.O. Diener, 1971, potato spindle tuber);  prion: abnormally folded protein (BSE/mad cow disease, CJD)", "Sub-viral agents."),
F("Lichens", "symbiotic association of algae (phycobiont, food) and fungi (mycobiont, shelter, water); good pollution indicators — do not grow in polluted areas", "Mutualism example."),
],
"examples": [
X("Which kingdom?", "Euglena has chlorophyll but behaves like a heterotroph in the dark. Which kingdom?",
  "Protista (euglenoids). It has a pellicle instead of a cell wall and is mixotrophic, so it fits neither plants nor animals.", []),
X("Fungus with no sexual stage known", "Alternaria and Trichoderma are placed in which class, and why?",
  "Deuteromycetes (imperfect fungi): only their asexual (conidial) stage is known. When the sexual stage is found, they are moved to Ascomycetes or Basidiomycetes.", []),
X("Red tide", "What causes red tides?",
  "Rapid multiplication of red dinoflagellates such as Gonyaulax; their toxins can kill fish and other marine animals.", []),
X("Biogas bacteria", "Which bacteria produce biogas, and where do they live?",
  "Methanogens (archaebacteria) — found in the rumen of cattle and in marshy areas; they make methane from cellulose-rich material.", []),
X("Virus vs living", "Why are viruses called obligate parasites?",
  "Outside a host cell they are inert, crystallisable particles. Inside the host they take over its machinery to replicate, often killing the host cell.", []),
X("Rust and smut", "Name the fungi causing wheat rust and smut. Class?",
  "Rust: Puccinia; smut: Ustilago. Both are Basidiomycetes.", []),
],
"topics": [
T("Eubacteria nutrition", "Most bacteria are heterotrophs (decomposers, nitrogen fixers, pathogens). Some are autotrophs: photosynthetic (cyanobacteria) or chemosynthetic (oxidise inorganic substances like nitrates and ammonia, help recycle nutrients). Bacteria reproduce mainly by fission; they also exchange DNA (conjugation, transformation, transduction)."),
T("Diseases caused by bacteria", "Cholera, typhoid, tetanus, citrus canker. Bacteria are also used in curd, antibiotics and nitrogen fixation (Rhizobium)."),
T("Slime moulds", "Saprophytic protists that form an aggregate called a plasmodium under suitable conditions, which can grow and spread over several feet. Under bad conditions they form fruiting bodies with spores that have true walls and survive for years."),
T("Kingdom Fungi general features", "Heterotrophic: saprophytic, parasitic or symbiotic (lichens, mycorrhiza). Hyphae form mycelium; cell walls of chitin and polysaccharides. Yeast is unicellular. Asexual spores: conidia, sporangiospores, zoospores; sexual spores: oospores, ascospores, basidiospores."),
T("Kingdom Plantae and Animalia in the five-kingdom scheme", "Plantae: eukaryotic, chlorophyll-containing, mostly autotrophic, cellulose walls (also partially heterotrophic: insectivorous plants and parasites like Cuscuta). Animalia: heterotrophic, multicellular, no cell walls, store food as glycogen or fat."),
T("Three-domain system", "Carl Woese divided Monera into Archaebacteria and Eubacteria — giving six kingdoms within three domains (Archaea, Bacteria, Eukarya)."),
],
"ratta": [
"Whittaker 1969: Monera, Protista, Fungi, Plantae, Animalia.",
"Methanogens → biogas;  halophiles → salt;  thermoacidophiles → hot springs.",
"Mycoplasma: no cell wall, smallest cell.",
"Diatoms → diatomaceous earth;  Gonyaulax → red tide.",
"Phyco: aseptate;  Asco: ascus;  Basidio: no asexual spores;  Deutero: only asexual.",
"TMV: Ivanowsky;  viroid: Diener 1971;  prion → mad cow.",
"Lichen = alga + fungus; pollution indicator.",
],
}

SYLLABUS = [
("Five kingdom classification; salient features and classification of Monera, Protista and Fungi into major groups", ["five kingdom", "Monera", "Protista", "Fungi"]),
("Lichens", ["lichen"]),
("Viruses and viroids", ["virus", "viroid"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
