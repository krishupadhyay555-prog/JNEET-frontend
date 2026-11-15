from lib import F, X, T, sig, fx, _check_and_write

frag = 3 + 1
DOC = {
"slug": "biotechnology-principles-and-processes", "subject": "Biology",
"chapters": {"NEET": "Biotechnology: Principles and Processes"},
"title": "Biotechnology: Principles and Processes", "readMinutes": 15,
"summary": [
"Modern biotechnology rests on genetic engineering (changing DNA/RNA, introducing it into hosts) and bioprocess engineering (sterile large-scale culture). The first recombinant DNA was made by Stanley Cohen and Herbert Boyer (1972) by linking an antibiotic-resistance gene to a native plasmid of Salmonella typhimurium.",
"Tools: restriction enzymes (molecular scissors), DNA ligase (glue), cloning vectors (plasmids, phages), competent hosts and gel electrophoresis.",
"Process: isolate DNA → cut with restriction enzyme → amplify with PCR → ligate into vector → transform host → select recombinants → grow in bioreactors → downstream processing.",
],
"formulas": [
F("Restriction enzymes", "first discovered: Hind II (cuts at a specific 6-bp sequence);  exonucleases remove nucleotides from ends; endonucleases cut inside;  recognise palindromic sequences", "Molecular scissors.", None, tag="PYQ favourite"),
F("Naming EcoRI", "E = Escherichia (genus), co = coli (species), R = RY13 (strain), I = first enzyme isolated from that strain", "Restriction enzyme nomenclature.", None, tag="PYQ favourite"),
F("Palindrome and sticky ends", "5′-GAATTC-3′ / 3′-CTTAAG-5′ reads the same 5′→3′ on both strands;  EcoRI cuts between G and A → sticky ends that pair with complementary ends", "How cut DNA joins."),
F("Gel electrophoresis", "DNA (negatively charged) moves towards the anode through agarose gel (from seaweed);  smaller fragments move farther;  stained with ethidium bromide, seen as orange bands under UV;  bands cut out and purified (elution)", "Separating DNA fragments.", None, tag="PYQ favourite"),
F("Cloning vector features", "origin of replication (ori — controls copy number);  selectable marker (ampicillin, chloramphenicol, tetracycline or kanamycin resistance);  cloning (recognition) sites, preferably single;  small size", "What makes a good vector."),
F("pBR322", "ori + rop (proteins for replication) + amp^R + tet^R;  BamHI site in tet^R; PstI and PvuI in amp^R", "Standard E. coli vector."),
F("Insertional inactivation", "insert in tet^R gene → recombinants lose tetracycline resistance;  β-galactosidase (lacZ) insertion → recombinants give colourless colonies, non-recombinants blue (with chromogenic substrate)", "Selecting recombinants (blue–white screening).", None, tag="PYQ favourite"),
F("Vectors for plants and animals", "Agrobacterium tumefaciens — Ti plasmid (tumour-inducing; disarmed for gene transfer);  retroviruses disarmed for animal cells", "Natural genetic engineers."),
F("Making cells competent", "divalent cations (Ca²⁺) → heat shock (ice, 42 °C, ice) → plasmid enters;  other methods: microinjection (animal nucleus), biolistics/gene gun (plant cells, gold or tungsten particles), disarmed pathogen vectors", "Introducing DNA into hosts."),
F("PCR steps", "denaturation (~94 °C) → annealing of primers → extension by Taq polymerase (from Thermus aquaticus, thermostable);  copies double each cycle (2ⁿ)", "Polymerase chain reaction.", None, tag="PYQ favourite"),
F("Isolating DNA", "lyse cells with lysozyme (bacteria), cellulase (plants), chitinase (fungi);  remove RNA with ribonuclease, proteins with protease;  chilled ethanol precipitates DNA (fine threads)", "Getting pure DNA."),
F("Bioreactors", "large vessels (100–1000 L) giving optimum temperature, pH, O₂, substrate;  stirred-tank (agitator, oxygen delivery, foam control, temperature and pH control, sampling ports)", "Scaling up production."),
F("Downstream processing", "separation and purification of the product, formulation with preservatives, clinical trials for drugs, quality control", "After biosynthesis."),
],
"examples": [
X("Fragments from a circular plasmid", "A circular plasmid has four EcoRI sites. How many fragments form after complete digestion?",
  f"In a circular DNA, n cuts give n fragments: {frag} fragments. (A linear DNA with n cuts gives n + 1.)", [(str(frag), "4")]),
X("Blue–white screening", "On a plate with X-gal, which colonies carry recombinant plasmids?",
  "Colourless (white) colonies — the insert disrupts lacZ (insertional inactivation), so no β-galactosidase forms to give the blue colour.", []),
X("Why one recognition site?", "Why should a vector have only one site for the chosen restriction enzyme?",
  "More than one site would cut the vector into several pieces, complicating gene cloning.", []),
X("Taq polymerase", "Why is Taq polymerase used in PCR?",
  "It comes from the thermophilic bacterium Thermus aquaticus and stays active during the high-temperature denaturation step, so fresh enzyme isn't needed each cycle.", []),
X("Agrobacterium", "Why is Agrobacterium called a natural genetic engineer of plants?",
  "It naturally transfers a piece of its Ti plasmid DNA (T-DNA) into plant cells, transforming them into tumour cells; a disarmed Ti plasmid can deliver useful genes instead.", []),
X("Copies after PCR cycles", "Starting with one DNA molecule, how many copies after 10 PCR cycles?",
  f"2¹⁰ = {2**10} copies.", [(str(2**10), "1024")]),
],
"topics": [
T("Definition of biotechnology", "The European Federation of Biotechnology (EFB) defines it as the integration of natural science and organisms, cells, parts thereof and molecular analogues for products and services."),
T("Basic steps in genetic engineering", "Identify DNA with desirable genes; introduce it into the host; maintain the introduced DNA in the host and transfer it to progeny. Plasmid DNA acts as a vector to carry the foreign DNA."),
T("DNA ligase", "Joins cut DNA fragments having the same kind of sticky ends; the same restriction enzyme must be used to cut both the vector and the source DNA."),
T("Recombinant DNA expression", "The cloned gene is expressed under suitable conditions to make recombinant protein in a host. Small-volume cultures can't make large quantities, so continuous culture systems keep cells in their physiologically most active log/exponential phase."),
T("Selection with antibiotics", "Transformants are grown on media with antibiotics; only cells carrying the plasmid (with resistance gene) survive. Replica plating on a second antibiotic reveals insertional inactivation."),
T("Alternative selectable markers", "Selection with two antibiotics is cumbersome, so chromogenic substrates (blue–white) are used as an easier method."),
],
"ratta": [
"EcoRI: E. coli RY13, first enzyme.",
"Palindrome GAATTC → sticky ends.",
"DNA → anode;  smaller moves farther;  EtBr orange under UV.",
"pBR322: ori, rop, amp^R, tet^R;  BamHI in tet^R.",
"White colonies = recombinant (lacZ inactivated).",
"PCR: denature, anneal, extend;  Taq from Thermus aquaticus.",
"Ti plasmid — Agrobacterium;  Cohen & Boyer 1972.",
],
}

SYLLABUS = [
("Genetic engineering (recombinant DNA technology)", ["genetic engineering", "recombinant"]),
("Tools — restriction enzymes, cloning vectors, competent host, gel electrophoresis", ["restriction", "vector", "competent", "electrophoresis"]),
("Processes — isolation of DNA, PCR, insertion, obtaining product, downstream processing", ["PCR", "bioreactor", "downstream processing"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
