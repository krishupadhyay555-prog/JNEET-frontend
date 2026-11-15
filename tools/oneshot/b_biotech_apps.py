from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "biotechnology-and-its-applications", "subject": "Biology",
"chapters": {"NEET": "Biotechnology and its Applications"},
"title": "Biotechnology and its Applications", "readMinutes": 12,
"summary": [
"Biotechnology is applied in agriculture (GM crops — Bt cotton, pest-resistant tobacco via RNAi), medicine (human insulin, gene therapy, molecular diagnosis), transgenic animals, and in industry.",
"Bt toxin from Bacillus thuringiensis kills specific insects; cry genes are put into crops. RNA interference silences parasite genes in plants.",
"Recombinant human insulin (Eli Lilly, 1983) is made by producing chains A and B separately in E. coli and joining them. The first gene therapy (1990) treated ADA deficiency.",
"Ethical issues — GEAC oversight, biopiracy and patents (basmati rice, turmeric, neem) — are also part of the chapter.",
],
"formulas": [
F("Bt toxin", "Bacillus thuringiensis makes inactive protoxin crystals → alkaline pH of insect gut activates them → toxin binds midgut epithelial cells, creates pores → swelling, lysis, death", "How Bt crops kill pests.", "The toxin doesn't harm the bacterium itself because it is stored as an inactive protoxin.", tag="PYQ favourite"),
F("cry genes", "cryIAc and cryIIAb → cotton bollworms;  cryIAb → corn borer", "Which gene for which pest.", None, tag="PYQ favourite"),
F("RNA interference (RNAi)", "nematode Meloidogyne incognita infects tobacco roots;  nematode-specific genes introduced via Agrobacterium make sense + antisense RNA → dsRNA → silences parasite mRNA → parasite dies", "Pest-resistant plants.", None, tag="PYQ favourite"),
F("GM crop benefits", "tolerance to abiotic stress (cold, drought, salt, heat);  less reliance on chemical pesticides;  reduced post-harvest losses;  better mineral use;  enhanced nutrition (Golden rice — vitamin A)", "Advantages of genetically modified plants."),
F("Human insulin", "insulin = chains A and B joined by disulphide bonds;  pro-insulin has an extra C-peptide removed during maturation;  Eli Lilly (1983) made A and B chains separately in E. coli and joined them", "Recombinant insulin.", None, tag="PYQ favourite"),
F("Gene therapy for ADA deficiency", "1990, a 4-year-old girl;  lymphocytes grown in culture, functional ADA cDNA introduced using a retroviral vector, cells returned;  periodic infusions needed;  a permanent cure would need the gene in early embryonic cells", "First clinical gene therapy.", "ADA = adenosine deaminase; its deficiency affects the immune system."),
F("Molecular diagnosis", "PCR (detects very low amounts of DNA — HIV in suspected AIDS patients, mutations in cancer);  ELISA (antigen–antibody interaction);  probes with radioactive labels and autoradiography", "Early detection methods."),
F("Transgenic animals uses", "study of normal physiology and development;  disease models (cancer, cystic fibrosis, rheumatoid arthritis, Alzheimer's);  biological products (α-1-antitrypsin for emphysema);  vaccine safety testing (polio on transgenic mice);  chemical safety (toxicity testing)", "Why transgenic animals are made."),
F("Rosie the cow", "first transgenic cow (1997) — milk with human α-lactalbumin (2.4 g/L), nutritionally more balanced for human babies", "Transgenic animal example.", None, tag="PYQ favourite"),
F("Ethics and patents", "GEAC (Genetic Engineering Appraisal Committee) checks GM research validity and safety of GM organisms for public use;  biopiracy: use of bio-resources without authorisation or payment;  basmati patented in the USA (1997) — India has 27 documented basmati varieties", "Ethical and legal issues."),
],
"examples": [
X("Why isn't Bt toxic to the bacterium?", "Bacillus thuringiensis makes a lethal toxin. Why doesn't it die?",
  "The toxin is stored as an inactive protoxin crystal; it becomes active only in the alkaline gut of insects.", []),
X("C-peptide", "Why was pro-insulin a problem for recombinant production?",
  "Insulin is made as pro-insulin with an extra C-peptide that must be removed; Eli Lilly avoided this by making A and B chains separately and joining them with disulphide bonds.", []),
X("Detecting HIV early", "Which technique detects HIV before symptoms appear?",
  "PCR — it amplifies very small amounts of viral nucleic acid. ELISA is also used to detect HIV antibodies.", []),
X("RNAi target", "In pest-resistant tobacco, which organism's mRNA is silenced?",
  "The mRNA of the nematode Meloidogyne incognita — the dsRNA made by the plant silences a specific nematode gene, so it cannot survive.", []),
X("Golden rice", "What is Golden rice?",
  "Rice genetically modified to make β-carotene (provitamin A), to fight vitamin A deficiency.", []),
],
"topics": [
T("Three critical research areas", "Providing the best catalyst (improved organism, usually a microbe or pure enzyme); creating optimal conditions through engineering for the catalyst to act; and downstream processing to purify the product."),
T("Green revolution and GM crops", "The green revolution tripled food supply with improved varieties, better management and agrochemicals, but agrochemicals were costly and harmful. GM crops offer an alternative path to increase yields with fewer chemicals."),
T("Genetically engineered insulin", "Before recombinant insulin, insulin from slaughtered cattle and pigs caused allergies in some patients. Recombinant insulin is made in bacteria and is identical to human insulin."),
T("Recombinant therapeutics", "About 30 recombinant therapeutics are approved worldwide (12 marketed in India). They are safer and more effective because they don't induce unwanted immunological responses."),
T("Transgenic animals", "Animals whose DNA has been manipulated to carry and express an extra (foreign) gene. Over 95% of existing transgenic animals are mice; others include rats, rabbits, pigs, sheep, cows and fish."),
T("Biopiracy and India", "Industrialised nations are rich in finance but poor in biodiversity; developing nations are the opposite. The Indian Parliament amended the Indian Patents Bill to address patent terms, emergency provisions and research and development initiatives."),
],
"ratta": [
"cryIAc, cryIIAb → cotton bollworm;  cryIAb → corn borer.",
"RNAi: Meloidogyne incognita, tobacco.",
"Insulin: A + B chains, disulphide bonds; Eli Lilly 1983.",
"Gene therapy 1990: ADA deficiency, retroviral vector.",
"Rosie 1997: human α-lactalbumin, 2.4 g/L.",
"GEAC approves GM organisms.",
"Basmati, turmeric, neem — biopiracy cases.",
],
}

SYLLABUS = [
("Applications in health and agriculture — human insulin and vaccine production, stem cell technology, gene therapy", ["insulin", "gene therapy"]),
("Genetically modified organisms — Bt crops", ["Bt", "cry", "RNA interference"]),
("Transgenic animals", ["transgenic animals"]),
("Biosafety issues, biopiracy and patents", ["GEAC", "biopiracy", "patent"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
