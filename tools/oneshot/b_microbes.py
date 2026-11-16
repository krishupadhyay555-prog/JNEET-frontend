from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "microbes-in-human-welfare", "subject": "Biology",
"chapters": {"NEET": "Microbes in Human Welfare"},
"title": "Microbes in Human Welfare", "readMinutes": 11,
"summary": [
"Microbes are used at home (curd, bread, idli, dosa), in industry (beverages, antibiotics, organic acids, enzymes, bioactive molecules), in sewage treatment, biogas production, biocontrol and as biofertilisers.",
"Sewage is treated in two stages: primary (physical removal of solids) and secondary/biological (aerobic microbes form flocs in aeration tanks; anaerobic digestion of activated sludge gives biogas).",
"Biocontrol uses natural predators and pathogens instead of chemical pesticides; biofertilisers (Rhizobium, Azotobacter, cyanobacteria, mycorrhiza) enrich soil nutrients.",
],
"formulas": [
F("Household products", "curd — Lactobacillus (LAB) converts milk to curd and adds vitamin B₁₂;  bread dough — Saccharomyces cerevisiae (baker's yeast, CO₂);  Swiss cheese — Propionibacterium sharmanii (large holes from CO₂);  Roquefort cheese — fungi for flavour", "Microbes at home.", None, tag="PYQ favourite"),
F("Beverages", "Saccharomyces cerevisiae (brewer's yeast) ferments malted cereals and fruit juices → ethanol;  wine and beer without distillation;  whisky, brandy, rum by distillation", "Alcoholic drinks."),
F("Antibiotics", "penicillin — Penicillium notatum (Alexander Fleming, while working on Staphylococci; full potential shown by Chain and Florey)", "First antibiotic.", None, tag="PYQ favourite"),
F("Organic acids and alcohol", "citric acid — Aspergillus niger;  acetic acid — Acetobacter aceti;  butyric acid — Clostridium butylicum;  lactic acid — Lactobacillus;  ethanol — Saccharomyces cerevisiae", "Industrial chemicals.", None, tag="PYQ favourite"),
F("Enzymes and bioactive molecules", "lipases (detergents, remove oily stains);  pectinases and proteases (clarify fruit juices);  streptokinase — Streptococcus (clot buster for myocardial infarction);  cyclosporin A — Trichoderma polysporum (immunosuppressant in transplants);  statins — Monascus purpureus (lower blood cholesterol; competitive inhibitors of cholesterol synthesis)", "Medical and industrial products.", None, tag="PYQ favourite"),
F("Sewage treatment", "primary: filtration and sedimentation (primary sludge, effluent);  secondary: aeration tank with flocs (bacteria + fungal filaments) → BOD falls → settling tank (activated sludge) → part returned as inoculum, rest to anaerobic sludge digesters (biogas)", "Steps of sewage treatment."),
F("BOD", "biochemical oxygen demand = O₂ consumed if all organic matter in 1 L water were oxidised by bacteria;  higher BOD = more polluted", "Measuring organic pollution."),
F("Biogas", "mainly methane + CO₂ + H₂;  methanogens (Methanobacterium) in cattle dung (gobar) under anaerobic conditions;  slurry used as fertiliser;  technology developed by IARI and KVIC", "Biogas production."),
F("Biocontrol agents", "ladybird and dragonflies (aphids and mosquitoes);  Bacillus thuringiensis (Bt — butterfly caterpillars);  Trichoderma (fungal plant pathogens);  baculoviruses, genus Nucleopolyhedrovirus (species-specific, narrow spectrum insecticide)", "Pest control without chemicals.", None, tag="PYQ favourite"),
F("Biofertilisers", "Rhizobium (root nodules of legumes);  Azospirillum, Azotobacter (free-living, fix N₂);  mycorrhiza — Glomus (phosphorus absorption, drought and pathogen resistance);  cyanobacteria — Anabaena, Nostoc, Oscillatoria (paddy fields; also add organic matter)", "Enriching soil naturally."),
],
"examples": [
X("Curd from milk", "How does a small amount of curd turn milk into curd?",
  "The curd contains Lactobacillus (lactic acid bacteria) that multiply, produce acids that coagulate and partially digest milk proteins, and raise the vitamin B₁₂ content.", []),
X("Heart attack drug", "Which microbial product dissolves blood clots in patients with myocardial infarction?",
  "Streptokinase, from the bacterium Streptococcus (modified by genetic engineering).", []),
X("Why is high BOD bad?", "Untreated sewage has high BOD. What does that mean?",
  "It contains a lot of biodegradable organic matter; microbes use much dissolved oxygen to break it down, so fish and other aquatic life suffocate.", []),
X("Bt as insecticide", "How is Bacillus thuringiensis used against caterpillars?",
  "Dried spores are mixed with water and sprayed on plants; caterpillars eat them, the toxin is released in their gut and kills them, while other insects are unharmed.", []),
X("Organic farming", "Why are broad-spectrum pesticides avoided in organic farming?",
  "They kill useful insects and other organisms too; organic farmers want a balanced ecosystem with natural predators that keep pests at manageable levels.", []),
],
"topics": [
T("Fermented foods", "Dough for dosa and idli is fermented by bacteria (puffed-up appearance due to CO₂). Toddy, a traditional drink of southern India, is made by fermenting sap from palms. Fish, soybean and bamboo shoots are fermented too."),
T("Microbes in industry", "Large vessels called fermentors are used to grow microbes on an industrial scale for beverages, antibiotics and enzymes."),
T("Ganga and Yamuna Action Plans", "The Ministry of Environment and Forests started Ganga Action Plan and Yamuna Action Plan to save major rivers from pollution, building sewage treatment plants so only treated sewage enters rivers."),
T("Integrated pest management", "Recognise beneficial organisms (predators and parasites) and pests, understand their life cycles and interactions, and rely as far as possible on natural predation instead of chemicals."),
T("Biofertilisers vs chemical fertilisers", "Over-use of chemical fertilisers pollutes soil and water; biofertilisers are living organisms that enrich nutrient quality of soil and support organic farming. Many biofertilisers are now commercially available in India."),
T("Antibiotics' role", "Antibiotics have greatly improved our ability to treat deadly diseases such as plague, whooping cough (kali khansi), diphtheria (gal ghotu) and leprosy (kusht rog)."),
],
"ratta": [
"Curd — Lactobacillus (B₁₂);  Swiss cheese — Propionibacterium sharmanii.",
"Citric — Aspergillus niger;  acetic — Acetobacter aceti;  butyric — Clostridium butylicum.",
"Streptokinase — clot buster;  cyclosporin A — Trichoderma polysporum;  statins — Monascus purpureus.",
"Penicillin — Fleming;  Chain & Florey proved its use.",
"Biogas: methanogens (Methanobacterium); IARI + KVIC.",
"Bt, Trichoderma, Nucleopolyhedrovirus — biocontrol.",
"Glomus — mycorrhiza;  Anabaena, Nostoc — paddy.",
],
}

SYLLABUS = [
("Microbes in household food processing", ["Lactobacillus", "bread"]),
("Industrial production", ["antibiotic", "citric acid", "streptokinase"]),
("Sewage treatment, energy generation (biogas)", ["sewage", "biogas"]),
("Microbes as biocontrol agents and biofertilisers", ["biocontrol", "biofertiliser"]),
("Antibiotics; production and judicious use", ["penicillin"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Microbes ghar mein (curd — Lactobacillus, bread, idli, dosa), industry mein (beverages, antibiotic jaise penicillin, organic acids jaise citric acid, enzymes, streptokinase jaise bioactive molecules), sewage treatment, biogas banane, biocontrol aur biofertiliser ki tarah use hote hain.",
"Sewage do stages mein treat hota hai: primary (solids ko physically hataana) aur secondary/biological (aeration tanks mein aerobic microbes flocs banate hain; activated sludge ke anaerobic digestion se biogas milti hai).",
"Biocontrol chemical pesticides ki jagah natural predators aur pathogens use karta hai; biofertilisers (Rhizobium, Azotobacter, cyanobacteria, mycorrhiza) mitti ke nutrients badhaate hain.",
],
when=[
("Ghar mein microbes.", None),
("Alcoholic drinks.", None),
("Pehla antibiotic.", None),
("Industrial chemicals.", None),
("Medical aur industrial products.", None),
("Sewage treatment ke steps.", None),
("Organic pollution naapna.", None),
("Biogas production.", None),
("Bina chemicals pest control.", None),
("Mitti ko natural tarike se samriddh karna.", None),
],
examples=[
("Doodh se dahi", "Thoda sa dahi doodh ko dahi kaise bana deta hai?",
 "Dahi mein Lactobacillus (lactic acid bacteria) hote hain jo badhkar acids banate hain, jo milk proteins ko jamaate aur aanshik pachaate hain, aur vitamin B₁₂ badhaate hain."),
("Heart attack ki dawa", "Myocardial infarction ke patients mein blood clots ghulaane wala microbial product kaunsa hai?",
 "Streptokinase, bacterium Streptococcus se (genetic engineering se modify kiya)."),
("High BOD bura kyun?", "Bina treat kiye sewage ka BOD zyada hota hai. Iska matlab?",
 "Isme bahut saara biodegradable organic matter hai; microbes ise todne mein bahut dissolved oxygen use karte hain, isliye fish aur doosre aquatic jeev dum ghut kar marte hain."),
("Insecticide ki tarah Bt", "Bacillus thuringiensis caterpillars ke khilaaf kaise use hota hai?",
 "Sookhe spores paani mein milakar plants par spray karte hain; caterpillars unhe khaate hain, unke gut mein toxin nikal kar unhe maarta hai, jabki doosre insects ko nuksaan nahi."),
("Organic farming", "Organic farming mein broad-spectrum pesticides kyun nahi use karte?",
 "Ye useful insects aur doosre organisms ko bhi maar dete hain; organic farmers balanced ecosystem chahte hain jisme natural predators pests ko control mein rakhein."),
],
topics=[
("Fermented foods", "Dosa aur idli ka dough bacteria se ferment hota hai (CO₂ se phoola dikhta hai). Toddy, south India ka paaramparik drink, palms ke ras ko ferment karke banta hai. Fish, soybean aur bamboo shoots bhi ferment kiye jaate hain."),
("Microbes in industry", "Industrial scale par beverages, antibiotics aur enzymes ke liye microbes ugaane ko bade vessels jinhe fermentors kehte hain, use hote hain."),
("Ganga and Yamuna Action Plans", "Ministry of Environment and Forests ne badi nadiyon ko pollution se bachaane ke liye Ganga Action Plan aur Yamuna Action Plan shuru kiye, sewage treatment plants banaye taaki sirf treated sewage nadiyon mein jaaye."),
("Integrated pest management", "Faaydemand organisms (predators aur parasites) aur pests ko pehchaano, unke life cycles aur interactions samjho, aur jitna ho sake chemicals ki jagah natural predation par bharosa karo."),
("Biofertilisers vs chemical fertilisers", "Chemical fertilisers ka zyada use mitti aur paani ko pollute karta hai; biofertilisers living organisms hain jo mitti ki nutrient quality badhaate aur organic farming ko sahara dete hain. India mein ab kai biofertilisers commercially milte hain."),
("Antibiotics' role", "Antibiotics ne plague, whooping cough (kali khansi), diphtheria (gal ghotu) aur leprosy (kusht rog) jaisi jaanleva bimaariyon ka ilaaj bahut behtar kar diya."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
