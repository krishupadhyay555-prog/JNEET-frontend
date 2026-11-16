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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"R.H. Whittaker (1969) ne five kingdom diye — Monera, Protista, Fungi, Plantae aur Animalia — cell structure, body organisation, nutrition ka tarika, reproduction aur phylogenetic relationships ke base par.",
"Monera prokaryotes hain (bacteria, cyanobacteria, archaebacteria, mycoplasma). Protista unicellular eukaryotes (chrysophytes, dinoflagellates, euglenoids, slime moulds, protozoans).",
"Fungi heterotrophic hain, chitin wali cell walls aur hyphae ke saath; spores aur fruiting bodies se Phycomycetes, Ascomycetes, Basidiomycetes aur Deuteromycetes mein classify hote hain.",
"Virus, viroid, prions aur lichen five-kingdom scheme mein fit nahi hote: virus nucleoprotein particles hain jo host cell ke bahar inert rehte hain.",
],
when=[
("Classification ka itihaas.", "Two-kingdom grouping ne prokaryotes ko eukaryotes ke saath aur unicellular ko multicellular ke saath rakh diya tha — isliye galat tha."),
("Bacteria pehchaanna.", None),
("Extreme habitat wale bacteria.", "Inki cell wall structure doosre bacteria se alag hai — isi se extreme conditions jhel paate hain."),
("Blue-green algae ke facts.", None),
("Alag type ke monerans.", None),
("Kingdom Protista.", None),
("Protozoan diseases.", None),
("Fungi classify karna.", None),
("Fungi ka sexual cycle.", None),
("Virus ki structure.", "D.J. Ivanowsky (1892) ne TMV dhoondha; M.W. Beijerinck ne fluid ko contagium vivum fluidum kaha; W.M. Stanley ne viruses ko crystallise kiya."),
("Sub-viral agents.", None),
("Mutualism ka example.", None),
],
examples=[
("Kaunsa kingdom?", "Euglena mein chlorophyll hai par andhere mein heterotroph ki tarah rehta hai. Kaunsa kingdom?",
 "Protista (euglenoids). Cell wall ki jagah pellicle hai aur mixotrophic hai, isliye na plants mein fit na animals mein."),
("Jiska sexual stage pata nahi", "Alternaria aur Trichoderma kis class mein, aur kyun?",
 "Deuteromycetes (imperfect fungi): sirf asexual (conidial) stage pata hai. Sexual stage milne par Ascomycetes ya Basidiomycetes mein shift ho jaate hain."),
("Red tide", "Red tides kyun hote hain?",
 "Gonyaulax jaise laal dinoflagellates ke tezi se badhne se; inke toxins machhliyon aur doosre marine animals ko maar sakte hain."),
("Biogas bacteria", "Kaunse bacteria biogas banate hain, aur kahan rehte hain?",
 "Methanogens (archaebacteria) — cattle ke rumen aur marshy areas mein; cellulose-rich material se methane banate hain."),
("Virus vs living", "Viruses ko obligate parasites kyun kehte hain?",
 "Host cell ke bahar ye inert, crystallise hone wale particles hain. Host ke andar uski machinery lekar replicate karte hain, aksar host cell ko maar dete hain."),
("Rust aur smut", "Wheat rust aur smut kaunsi fungi se? Class?",
 "Rust: Puccinia; smut: Ustilago. Dono Basidiomycetes."),
],
topics=[
("Eubacteria nutrition", "Zyadatar bacteria heterotrophs hain (decomposers, nitrogen fixers, pathogens). Kuch autotrophs: photosynthetic (cyanobacteria) ya chemosynthetic (nitrates aur ammonia jaise inorganic substances ko oxidise karte, nutrient recycling mein madad). Bacteria mainly fission se reproduce karte hain; DNA bhi exchange karte hain (conjugation, transformation, transduction)."),
("Diseases caused by bacteria", "Cholera, typhoid, tetanus, citrus canker. Bacteria dahi, antibiotics aur nitrogen fixation (Rhizobium) mein bhi use hote hain."),
("Slime moulds", "Saprophytic protists jo achhi conditions mein plasmodium naam ka aggregate banate hain jo kai feet tak fail sakta hai. Buri conditions mein spores wale fruiting bodies banate hain; spores ki asli walls hoti hain aur saalon tak bache rehte hain."),
("Kingdom Fungi general features", "Heterotrophic: saprophytic, parasitic ya symbiotic (lichen, mycorrhiza). Hyphae milkar mycelium; cell walls chitin aur polysaccharides ki. Yeast unicellular. Asexual spores: conidia, sporangiospores, zoospores; sexual spores: oospores, ascospores, basidiospores."),
("Kingdom Plantae and Animalia in the five-kingdom scheme", "Plantae: eukaryotic, chlorophyll wale, zyadatar autotrophic, cellulose walls (kuch partially heterotrophic: insectivorous plants aur Cuscuta jaise parasites). Animalia: heterotrophic, multicellular, cell walls nahi, food glycogen ya fat ki tarah store."),
("Three-domain system", "Carl Woese ne Monera ko Archaebacteria aur Eubacteria mein baanta — teen domains (Archaea, Bacteria, Eukarya) ke andar chhe kingdoms."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
