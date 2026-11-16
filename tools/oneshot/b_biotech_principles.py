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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Modern biotechnology genetic engineering (DNA/RNA badalna, use hosts mein daalna) aur bioprocess engineering (sterile large-scale culture) par tiki hai. Pehla recombinant DNA Stanley Cohen aur Herbert Boyer (1972) ne antibiotic-resistance gene ko Salmonella typhimurium ke native plasmid se jod kar banaya.",
"Tools: restriction enzymes (molecular scissors), DNA ligase (glue), cloning vector (plasmids, phages), competent hosts aur gel electrophoresis.",
"Process: DNA isolate karo → restriction enzyme se kaato → PCR se amplify karo → vector mein ligate karo → host transform karo → recombinants select karo → bioreactor mein ugaao → downstream processing.",
],
when=[
("Molecular scissors.", None),
("Restriction enzyme ka naamkaran.", None),
("Kata hua DNA kaise judta hai.", None),
("DNA fragments alag karna.", None),
("Achhe vector ki pehchaan.", None),
("Standard E. coli vector.", None),
("Recombinants select karna (blue–white screening).", None),
("Natural genetic engineers.", None),
("Hosts mein DNA daalna.", None),
("Polymerase chain reaction.", None),
("Shuddh DNA paana.", None),
("Production badhaana.", None),
("Biosynthesis ke baad.", None),
],
examples=[
("Circular plasmid ke fragments", "Ek circular plasmid mein chaar EcoRI sites hain. Poore digestion ke baad kitne fragments?",
 "Circular DNA mein n cuts se n fragments: ⟨0⟩ fragments. (Linear DNA mein n cuts se n + 1.)"),
("Blue–white screening", "X-gal wali plate par kaunsi colonies mein recombinant plasmids hain?",
 "Rang-heen (white) colonies — insert lacZ ko tod deta hai (insertional inactivation), isliye neela rang dene wala β-galactosidase nahi banta."),
("Ek hi recognition site kyun?", "Vector mein chune gaye restriction enzyme ki sirf ek site kyun honi chahiye?",
 "Ek se zyada site vector ko kai tukdon mein kaat degi, jisse gene cloning mushkil ho jaayegi."),
("Taq polymerase", "PCR mein Taq polymerase kyun use hota hai?",
 "Ye thermophilic bacterium Thermus aquaticus se aata hai aur high-temperature denaturation step mein bhi active rehta hai, isliye har cycle mein naya enzyme nahi chahiye."),
("Agrobacterium", "Agrobacterium ko plants ka natural genetic engineer kyun kehte hain?",
 "Ye apne Ti plasmid DNA (T-DNA) ka ek tukda naturally plant cells mein daal kar unhe tumour cells bana deta hai; disarmed Ti plasmid iski jagah useful genes pahuncha sakta hai."),
("PCR cycles ke baad copies", "Ek DNA molecule se shuru karke 10 PCR cycles ke baad kitni copies?",
 "2¹⁰ = ⟨0⟩ copies."),
],
topics=[
("Definition of biotechnology", "European Federation of Biotechnology (EFB) ise natural science aur organisms, cells, unke hisson aur molecular analogues ka products aur services ke liye integration kehta hai."),
("Basic steps in genetic engineering", "Desirable genes wala DNA pehchaano; use host mein daalo; daale gaye DNA ko host mein banaye rakho aur progeny tak pahunchao. Plasmid DNA foreign DNA le jaane wale vector ka kaam karta hai."),
("DNA ligase", "Same type ke sticky ends wale kate DNA fragments ko jodta hai; vector aur source DNA dono ko same restriction enzyme se kaatna zaroori hai."),
("Recombinant DNA expression", "Cloned gene sahi conditions mein express hokar host mein recombinant protein banata hai. Chhote volume ke cultures zyada maatra nahi bana sakte, isliye continuous culture systems cells ko physiologically sabse active log/exponential phase mein rakhte hain."),
("Selection with antibiotics", "Transformants ko antibiotics wale media par ugaate hain; sirf plasmid (resistance gene ke saath) wale cells bachte hain. Doosre antibiotic par replica plating se insertional inactivation pata chalta hai."),
("Alternative selectable markers", "Do antibiotics se selection jhanjhat wala hai, isliye chromogenic substrates (blue–white) aasaan tareeke ki tarah use hote hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
