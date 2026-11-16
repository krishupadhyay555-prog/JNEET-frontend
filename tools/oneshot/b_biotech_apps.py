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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Biotechnology agriculture (GM crops — Bt cotton, RNAi se pest-resistant tobacco), medicine (human insulin, gene therapy, molecular diagnosis), transgenic animals aur industry mein use hoti hai.",
"Bacillus thuringiensis ka Bt toxin khaas insects ko maarta hai; cry genes crops mein daale jaate hain. RNA interference plants mein parasite ke genes ko silence karta hai.",
"Recombinant human insulin (Eli Lilly, 1983) E. coli mein chains A aur B alag banakar unhe jod kar banta hai. Pehli gene therapy (1990) ne ADA deficiency ka ilaaj kiya.",
"Ethical issues — GEAC ki nigraani, biopiracy aur patent (basmati rice, turmeric, neem) — bhi chapter ka hissa hain.",
],
when=[
("Bt crops pests ko kaise maarte hain.", "Toxin khud bacterium ko nuksaan nahi karta kyunki wo inactive protoxin ki tarah store hota hai."),
("Kaunsa gene kis pest ke liye.", None),
("Pest-resistant plants.", None),
("Genetically modified plants ke faayde.", None),
("Recombinant insulin.", None),
("Pehli clinical gene therapy.", "ADA = adenosine deaminase; iski kami immune system ko affect karti hai."),
("Jaldi pata lagaane ke tareeke.", None),
("Transgenic animals kyun banaye jaate hain.", None),
("Transgenic animal ka example.", None),
("Ethical aur legal issues.", None),
],
examples=[
("Bt toxin bacterium ke liye zehreela kyun nahi?", "Bacillus thuringiensis jaanleva toxin banata hai. Ye khud kyun nahi marta?",
 "Toxin inactive protoxin crystal ki tarah store hota hai; ye sirf insects ke alkaline gut mein active hota hai."),
("C-peptide", "Recombinant production mein pro-insulin problem kyun tha?",
 "Insulin pro-insulin ki tarah banta hai jisme extra C-peptide hota hai jo hataana padta hai; Eli Lilly ne A aur B chains alag banakar disulphide bonds se jod kar ise taala."),
("HIV jaldi pakadna", "Kaunsi technique symptoms aane se pehle HIV detect karti hai?",
 "PCR — ye viral nucleic acid ki bahut kam maatra ko amplify karta hai. HIV antibodies detect karne ke liye ELISA bhi use hota hai."),
("RNAi ka target", "Pest-resistant tobacco mein kis organism ka mRNA silence hota hai?",
 "Nematode Meloidogyne incognita ka mRNA — plant ka banaya dsRNA nematode ke ek khaas gene ko silence karta hai, isliye wo bach nahi paata."),
("Golden rice", "Golden rice kya hai?",
 "Genetically modified rice jo β-carotene (provitamin A) banata hai, vitamin A ki kami se ladne ke liye."),
],
topics=[
("Three critical research areas", "Sabse achha catalyst dena (behtar organism, aam taur par microbe ya pure enzyme); engineering se catalyst ke kaam ke liye best conditions banana; aur product shuddh karne ke liye downstream processing."),
("Green revolution and GM crops", "Green revolution ne behtar varieties, achhe management aur agrochemicals se food supply teen guna ki, par agrochemicals mehenge aur nuksaandeh the. GM crops kam chemicals ke saath yield badhaane ka doosra raasta dete hain."),
("Genetically engineered insulin", "Recombinant insulin se pehle kaate gaye cattle aur pigs ka insulin kuch patients mein allergy karta tha. Recombinant insulin bacteria mein banta hai aur human insulin jaisa hi hai."),
("Recombinant therapeutics", "Duniya mein lagbhag 30 recombinant therapeutics approved hain (India mein 12 market mein). Ye zyada surakshit aur effective hain kyunki anchaahe immunological responses nahi karte."),
("Transgenic animals", "Aise animals jinke DNA ko badal kar ek extra (foreign) gene daala aur express karaya gaya ho. Maujooda transgenic animals mein 95% se zyada mice hain; baaki rats, rabbits, pigs, sheep, cows aur fish."),
("Biopiracy and India", "Industrialised desh paise mein ameer par biodiversity mein gareeb; developing desh ulta. Indian Parliament ne patent terms, emergency provisions aur research aur development pahal ke liye Indian Patents Bill mein sanshodhan kiya."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
