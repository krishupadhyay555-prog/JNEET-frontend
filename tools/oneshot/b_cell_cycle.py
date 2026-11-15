from lib import F, X, T, sig, fx, build

cells7 = 2 ** 7; div128 = 128 - 1
pollen = 400 // 4
tetrads = 16
eggs = 100  # each meiosis gives 1 egg
DOC = {
"slug": "cell-cycle-and-cell-division", "subject": "Biology", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Cell Cycle and Cell Division"},
"title": "Cell Cycle and Cell Division", "readMinutes": 14,
"summary": [
"Cell cycle = ek cell ka bada hona, DNA copy karna aur do mein batna. Interphase (G₁ → S → G₂) poore cycle ka 95% se zyada time leta hai; asli division (M phase) chhota hota hai (human cell mein ~1 ghanta, poora cycle ~24 ghante).",
"S phase mein DNA double hota hai (2C → 4C), lekin chromosome number same rehta hai, kyunki har chromosome mein ab do sister chromatids hain.",
"Mitosis (equational division): 2n → 2n, do identical cells — growth, repair. Meiosis (reductional division): 2n → n, chaar cells — gametes, aur crossing over se variation.",
"Exam ka core: mitosis ke har stage ke markers, prophase I ke 5 sub-stages (leptotene, zygotene, pachytene, diplotene, diakinesis), aur har stage par chromosome number aur DNA content.",
],
"formulas": [
F("Phases of the cell cycle", "Interphase = G₁ (growth) → S (DNA synthesis) → G₂ (proteins for mitosis);  M phase = karyokinesis + cytokinesis;  G₀ = quiescent stage", "Cycle ka order.", "G₀ cells metabolically active hote hain, sirf divide nahi karte (jab tak zaroorat na ho)."),
F("Duration", "human cell in culture ~24 h (M phase ~1 h);  yeast ~90 min", "Time ke sawal.", None),
F("Mitosis output", "1 cell (2n) → 2 cells (2n), genetically identical", "Somatic cells, growth, repair."),
F("Meiosis output", "1 cell (2n) → 4 cells (n);  meiosis I reductional, meiosis II equational (mitosis jaisa)", "Gamete formation.", None, None, "PYQ favourite"),
F("DNA content and chromosome number", "G₁: 2n, 2C → S/G₂: 2n, 4C → after meiosis I: n, 2C → after meiosis II: n, C", "Kisi bhi stage ka DNA/chromosome.", "Chromosome number sirf meiosis I (anaphase I) mein aadha hota hai, S phase mein nahi badalta.", None, "PYQ favourite"),
F("Cells and divisions", "k rounds ke baad cells = 2ᵏ;   N cells banane ke liye mitotic divisions = N − 1", "Ginti wale sawal.", "128 cells ke liye 7 generations, par divisions 127."),
F("Meiosis counts", "1 meiosis → 4 pollen grains (ya 4 microspores) → par sirf 1 egg (3 polar bodies/megaspores degenerate);  N pollen ke liye N/4 meiosis;  N eggs ke liye N meiosis", "Gamete ginti.", None, None, "PYQ favourite"),
F("Prophase markers", "chromatin condense hokar chromosomes;  centrosomes opposite poles ki taraf;  end mein nucleolus, Golgi, ER aur nuclear envelope gayab", "Prophase pehchaanna."),
F("Metaphase markers", "chromosomes equatorial (metaphase) plate par;  spindle fibres kinetochores se jude;  morphology study ke liye best stage", "Metaphase pehchaanna."),
F("Anaphase markers", "centromere split, sister chromatids (ab daughter chromosomes) opposite poles ki taraf;  centromere aage, arms peeche", "Anaphase pehchaanna."),
F("Telophase markers", "chromosomes poles par decondense;  nuclear envelope, nucleolus, Golgi, ER dobara banate hain", "Telophase pehchaanna."),
F("Cytokinesis", "animal: cell membrane mein furrow, beech se do;  plant: cell plate (middle lamella) centre se bahar ki taraf;  karyokinesis ke baad cytokinesis na ho ⇒ syncytium (coconut ka liquid endosperm)", "Cytoplasm ka bantwaara."),
F("Prophase I sub-stages", "Leptotene (chromosomes dikhte hain) → Zygotene (synapsis, synaptonemal complex, bivalent/tetrad) → Pachytene (crossing over, recombination nodules, recombinase) → Diplotene (synaptonemal complex ghulta, chiasmata dikhte hain) → Diakinesis (chiasmata terminalisation, nucleolus aur nuclear envelope gayab)", "Meiosis ka sabse lamba stage.", "Crossing over pachytene mein, chiasmata diplotene mein dikhte hain — dono alag.", None, "PYQ favourite"),
F("Meiosis I vs II key events", "Anaphase I: homologous chromosomes alag (sister chromatids saath);  interkinesis: DNA replication nahi;  anaphase II: centromere split, sister chromatids alag", "Meiosis ke stages compare karna."),
],
"examples": [
X("Har stage ki ginti", "Ek cell mein 2n = 16, G₁ mein DNA = 2C. G₂, meiosis I ke baad aur meiosis II ke baad chromosomes aur DNA?",
  "G₂: 16 chromosomes, 4C. Meiosis I ke baad (har cell): 8 chromosomes (har ek mein 2 chromatids), 2C. Meiosis II ke baad: 8 chromosomes, C.", []),
X("Divisions vs generations", "Ek cell se 128 cells banane ke liye kitne mitotic generations aur kitne divisions?",
  f"2⁷ = {cells7} ⇒ 7 generations. Divisions = 128 − 1 = {div128}.", [(str(cells7), "128"), (str(div128), "127")]),
X("Pollen ke liye meiosis", "400 pollen grains banane ke liye kitne meiotic divisions?",
  f"1 meiosis → 4 pollen ⇒ 400/4 = {pollen}.", [(str(pollen), "100")]),
X("Bivalents", "2n = 32 wale cell ke prophase I mein kitne bivalents (tetrads)?",
  f"Bivalent = homologous pair ⇒ 32/2 = {tetrads}.", [(str(tetrads), "16")]),
X("Eggs ke liye meiosis", "100 eggs ke liye kitne meiotic divisions (female)?",
  f"Har meiosis se sirf 1 functional egg ⇒ {eggs}.", [(str(eggs), "100")]),
X("Significance of mitosis", "Mitosis ka mahatva?",
  "Growth (multicellular organisms), cell repair (gut lining, skin, RBCs ka replacement), nucleo-cytoplasmic ratio bahaal rakhna, aur plants mein apical aur lateral cambium se lagataar growth.", []),
],
"topics": [
T("Interphase", "G₁: cell metabolically active, badhta hai, DNA replicate nahi hota. S: DNA replication; animal cells mein centriole bhi duplicate (cytoplasm mein). G₂: proteins ban-te hain, mitosis ki taiyari. Divide na karne wale cells G₀ (quiescent) mein chale jaate hain — jaise heart cells."),
T("Mitosis kahan hota hai", "Animals mein mitosis sirf diploid somatic cells mein; plants mein haploid aur diploid dono cells mein ho sakta hai (gametophyte bhi mitosis se banta hai)."),
T("Significance of meiosis", "Sexual reproduction mein har species ka chromosome number generation dar generation same rakhta hai (gametes n, fertilisation se 2n). Crossing over aur independent assortment se genetic variation — evolution ke liye zaroori."),
T("Synaptonemal complex aur crossing over", "Zygotene mein homologous chromosomes paas aakar synaptonemal complex se jud jaate hain (synapsis). Pachytene mein non-sister chromatids ke beech segments exchange hote hain (crossing over), recombinase enzyme se. Diplotene mein jahan cross hua wahan X-shaped chiasmata dikhte hain."),
T("Diplotene ka lamba time", "Kuch vertebrates ke oocytes mein diplotene mahino ya saalon tak chal sakta hai."),
T("Meiosis II", "Interkinesis ke baad bina DNA replication ke meiosis II shuru — yeh mitosis jaisi hai. Anaphase II mein centromere split hota hai aur sister chromatids alag hote hain. End mein chaar haploid cells."),
],
"ratta": [
"G₁ → S → G₂ → M;  G₀ quiescent.",
"S phase: DNA 2C → 4C, chromosome number same.",
"Human cycle ~24 h, M phase ~1 h;  yeast ~90 min.",
"Mitosis 2n → 2n (2 cells);  meiosis 2n → n (4 cells).",
"Prophase I: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.",
"Synapsis — zygotene;  crossing over — pachytene;  chiasmata — diplotene.",
"Anaphase I: homologues alag;  anaphase II: sister chromatids alag.",
"N cells ke liye N − 1 divisions;  N pollen ke liye N/4 meiosis.",
],
}

DOC_EN = {
"slug": "cell-cycle-and-cell-division", "subject": "Biology", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Cell Cycle and Cell Division"},
"title": "Cell Cycle and Cell Division", "readMinutes": 14,
"summary": [
"The cell cycle is a cell growing, copying its DNA and dividing into two. Interphase (G₁ → S → G₂) takes over 95% of the cycle; the actual division (M phase) is short (about 1 hour in a human cell, out of a ~24-hour cycle).",
"In S phase DNA doubles (2C → 4C) but the chromosome number stays the same, because each chromosome now has two sister chromatids.",
"Mitosis (equational division): 2n → 2n, two identical cells — growth and repair. Meiosis (reductional division): 2n → n, four cells — gametes, with variation from crossing over.",
"Exam core: markers of each mitotic stage, the 5 sub-stages of prophase I (leptotene, zygotene, pachytene, diplotene, diakinesis), and chromosome number and DNA content at each stage.",
],
"formulas": [
F("Phases of the cell cycle", "Interphase = G₁ (growth) → S (DNA synthesis) → G₂ (proteins for mitosis);  M phase = karyokinesis + cytokinesis;  G₀ = quiescent stage", "Order of the cycle.", "G₀ cells are metabolically active; they just don't divide (unless needed)."),
F("Duration", "human cell in culture ~24 h (M phase ~1 h);  yeast ~90 min", "Timing questions.", None),
F("Mitosis output", "1 cell (2n) → 2 cells (2n), genetically identical", "Somatic cells, growth, repair."),
F("Meiosis output", "1 cell (2n) → 4 cells (n);  meiosis I reductional, meiosis II equational (like mitosis)", "Gamete formation.", None, None, "PYQ favourite"),
F("DNA content and chromosome number", "G₁: 2n, 2C → S/G₂: 2n, 4C → after meiosis I: n, 2C → after meiosis II: n, C", "DNA/chromosomes at any stage.", "Chromosome number halves only in meiosis I (anaphase I); it doesn't change in S phase.", None, "PYQ favourite"),
F("Cells and divisions", "cells after k rounds = 2ᵏ;   mitotic divisions needed for N cells = N − 1", "Counting questions.", "128 cells need 7 generations but 127 divisions."),
F("Meiosis counts", "1 meiosis → 4 pollen grains (or 4 microspores) → but only 1 egg (3 polar bodies/megaspores degenerate);  N pollen need N/4 meioses;  N eggs need N meioses", "Counting gametes.", None, None, "PYQ favourite"),
F("Prophase markers", "chromatin condenses into chromosomes;  centrosomes move to opposite poles;  by the end nucleolus, Golgi, ER and nuclear envelope disappear", "Identifying prophase."),
F("Metaphase markers", "chromosomes on the equatorial (metaphase) plate;  spindle fibres attached to kinetochores;  best stage to study chromosome morphology", "Identifying metaphase."),
F("Anaphase markers", "centromeres split, sister chromatids (now daughter chromosomes) move to opposite poles;  centromere leads, arms trail", "Identifying anaphase."),
F("Telophase markers", "chromosomes decondense at the poles;  nuclear envelope, nucleolus, Golgi and ER re-form", "Identifying telophase."),
F("Cytokinesis", "animal: a furrow in the cell membrane splits the cell in two;  plant: cell plate (middle lamella) grows from the centre outward;  karyokinesis without cytokinesis ⇒ syncytium (liquid endosperm of coconut)", "Division of cytoplasm."),
F("Prophase I sub-stages", "Leptotene (chromosomes become visible) → Zygotene (synapsis, synaptonemal complex, bivalent/tetrad) → Pachytene (crossing over, recombination nodules, recombinase) → Diplotene (synaptonemal complex dissolves, chiasmata visible) → Diakinesis (terminalisation of chiasmata, nucleolus and nuclear envelope disappear)", "Longest stage of meiosis.", "Crossing over happens in pachytene; chiasmata become visible in diplotene — two different things.", None, "PYQ favourite"),
F("Meiosis I vs II key events", "Anaphase I: homologous chromosomes separate (sister chromatids stay together);  interkinesis: no DNA replication;  anaphase II: centromeres split, sister chromatids separate", "Comparing stages of meiosis."),
],
"examples": [
X("Counts at each stage", "A cell has 2n = 16 and 2C DNA in G₁. Chromosomes and DNA in G₂, after meiosis I and after meiosis II?",
  "G₂: 16 chromosomes, 4C. After meiosis I (each cell): 8 chromosomes (each with 2 chromatids), 2C. After meiosis II: 8 chromosomes, C.", []),
X("Divisions vs generations", "How many mitotic generations and how many divisions make 128 cells from one?",
  f"2⁷ = {cells7} ⇒ 7 generations. Divisions = 128 − 1 = {div128}.", [(str(cells7), "128"), (str(div128), "127")]),
X("Meioses for pollen", "How many meiotic divisions produce 400 pollen grains?",
  f"1 meiosis → 4 pollen ⇒ 400/4 = {pollen}.", [(str(pollen), "100")]),
X("Bivalents", "How many bivalents (tetrads) are there in prophase I of a cell with 2n = 32?",
  f"A bivalent is a homologous pair ⇒ 32/2 = {tetrads}.", [(str(tetrads), "16")]),
X("Meioses for eggs", "How many meiotic divisions are needed for 100 eggs (female)?",
  f"Each meiosis gives only 1 functional egg ⇒ {eggs}.", [(str(eggs), "100")]),
X("Significance of mitosis", "Why is mitosis important?",
  "Growth of multicellular organisms, cell repair (replacing gut lining, skin and RBCs), restoring the nucleo-cytoplasmic ratio, and continuous growth in plants from apical and lateral cambium.", []),
],
"topics": [
T("Interphase", "G₁: the cell is metabolically active and grows, without replicating DNA. S: DNA replication; in animal cells the centriole also duplicates (in the cytoplasm). G₂: proteins are made in preparation for mitosis. Cells that stop dividing enter G₀ (quiescent) — e.g. heart cells."),
T("Where mitosis occurs", "In animals mitosis occurs only in diploid somatic cells; in plants it can occur in both haploid and diploid cells (the gametophyte also grows by mitosis)."),
T("Significance of meiosis", "It keeps the chromosome number of a species constant across generations in sexual reproduction (gametes n, fertilisation restores 2n). Crossing over and independent assortment produce genetic variation — essential for evolution."),
T("Synaptonemal complex and crossing over", "In zygotene homologous chromosomes pair and are joined by the synaptonemal complex (synapsis). In pachytene non-sister chromatids exchange segments (crossing over) with the enzyme recombinase. In diplotene the X-shaped chiasmata are seen where crossing over happened."),
T("Long diplotene", "In oocytes of some vertebrates diplotene can last for months or years."),
T("Meiosis II", "After interkinesis, meiosis II begins without DNA replication — it resembles mitosis. In anaphase II the centromeres split and sister chromatids separate. The result is four haploid cells."),
],
"ratta": [
"G₁ → S → G₂ → M;  G₀ quiescent.",
"S phase: DNA 2C → 4C, chromosome number unchanged.",
"Human cycle ~24 h, M phase ~1 h;  yeast ~90 min.",
"Mitosis 2n → 2n (2 cells);  meiosis 2n → n (4 cells).",
"Prophase I: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis.",
"Synapsis — zygotene;  crossing over — pachytene;  chiasmata — diplotene.",
"Anaphase I: homologues separate;  anaphase II: sister chromatids separate.",
"N cells need N − 1 divisions;  N pollen need N/4 meioses.",
],
}

SYLLABUS = [
("Cell cycle", ["G₁", "S phase", "G₂", "G₀"]),
("Mitosis", ["Prophase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis"]),
("Meiosis and their significance", ["Leptotene", "Zygotene", "Pachytene", "Diplotene", "Diakinesis", "significance"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
