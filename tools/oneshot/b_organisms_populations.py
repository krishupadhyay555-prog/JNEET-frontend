from lib import F, X, T, sig, fx, _check_and_write

br = 8 / 20
dr = 4 / 40
r = 0.1; N = 200; K = 1000
dndt = r * N * (K - N) / K
dndt_exp = r * N

DOC = {
"slug": "organisms-and-populations", "subject": "Biology",
"chapters": {"NEET": "Organisms and Populations"},
"title": "Organisms and Populations", "readMinutes": 14,
"summary": [
"Ecology studies interactions of organisms with each other and with their physical environment, at four levels: organisms, populations, communities and biomes.",
"Populations have attributes — birth rate (natality), death rate (mortality), sex ratio and age distribution (age pyramids). Population size changes with births, immigration, deaths and emigration.",
"Growth is exponential (J-shaped) when resources are unlimited and logistic (S-shaped, Verhulst–Pearl) when the carrying capacity K limits it.",
"Population interactions: mutualism (+/+), competition (−/−), predation and parasitism (+/−), commensalism (+/0) and amensalism (−/0).",
],
"formulas": [
F("Population density change", "Nₜ₊₁ = Nₜ + [(B + I) − (D + E)]", "Natality, immigration, mortality, emigration.", None, tag="PYQ favourite"),
F("Birth and death rates", "birth rate = new individuals / initial population (per unit time);  death rate = deaths / initial population", "Per capita rates."),
F("Exponential growth", "dN/dt = rN;  Nₜ = N₀eʳᵗ  (r = intrinsic rate of natural increase)", "Unlimited resources — J-shaped curve.", "r for Norway rat is 0.015; for flour beetle 0.12; human population of India in 1981 had r = 0.0205."),
F("Logistic growth", "dN/dt = rN (K − N)/K", "Limited resources — S-shaped (sigmoid) curve with carrying capacity K.", "Growth is fastest at N = K/2; it stops when N = K.", tag="PYQ favourite"),
F("Age pyramids", "triangular (expanding — many young);  bell-shaped (stable);  urn-shaped (declining — fewer young)", "Predicting population trends.", None, tag="PYQ favourite"),
F("Population interactions", "mutualism +/+;  competition −/−;  predation +/−;  parasitism +/−;  commensalism +/0;  amensalism −/0", "Classifying interactions.", None, tag="PYQ favourite"),
F("Mutualism examples", "lichens (fungus + alga);  mycorrhiza (fungus + roots);  fig and wasp (pollination + egg laying);  Ophrys orchid and bee (sexual deceit, pseudocopulation)", "+/+ interactions."),
F("Commensalism examples", "orchid on mango branch (epiphyte);  barnacles on whale;  cattle egret and grazing cattle;  sea anemone and clown fish", "+/0 interactions."),
F("Competition", "Gause's competitive exclusion principle: two closely related species competing for the same resources can't coexist indefinitely;  resource partitioning (MacArthur's warblers) lets them coexist", "−/− interactions."),
F("Parasitism", "host-specific; ectoparasites (lice, ticks, Cuscuta);  endoparasites (tapeworm, liver fluke — complex life cycles with intermediate hosts);  brood parasitism (cuckoo lays eggs in crow's nest)", "+/− interactions."),
F("Predator roles and defences", "predators transfer energy, control prey (prickly pear in Australia controlled by a cactus-feeding moth), maintain diversity;  prey defences: camouflage, poison (monarch butterfly from milkweed), chemical defences in plants (nicotine, caffeine, quinine, strychnine, opium; Calotropis cardiac glycosides)", "Predation."),
F("Responses to abiotic stress", "regulate (homeostasis — birds, mammals);  conform (most animals, all plants);  migrate (Siberian cranes to Keoladeo National Park, Bharatpur);  suspend (spores, hibernation, aestivation, diapause in zooplankton)", "Coping with changing conditions."),
F("Allen's rule", "mammals from colder climates have shorter ears and limbs to reduce heat loss", "Adaptations to cold."),
],
"examples": [
X("Birth rate", "A pond has 20 lotus plants last year; 8 new plants form through reproduction this year. Birth rate?",
  f"8/20 = {fx(br, 1)} offspring per lotus per year.", [(fx(br, 1), "0.4")]),
X("Death rate", "4 of 40 fruit flies die in a week. Death rate?",
  f"4/40 = {fx(dr, 1)} individuals per fruit fly per week.", [(fx(dr, 1), "0.1")]),
X("Logistic growth rate", "r = 0.1, N = 200, K = 1000. Find dN/dt.",
  f"dN/dt = 0.1 × 200 × (1000 − 200)/1000 = {fx(dndt)} individuals per unit time (exponential growth would give {fx(dndt_exp)}).", [(fx(dndt), "16"), (fx(dndt_exp), "20")]),
X("Brood parasitism", "How does the cuckoo's egg escape detection in a crow's nest?",
  "The cuckoo's eggs resemble the host's eggs in size and colour — an evolved adaptation that reduces the chance of the host ejecting them.", []),
X("Altitude sickness", "Why do people get altitude sickness at high places, and how does the body adjust?",
  "Low atmospheric pressure means less O₂ in the body (nausea, fatigue, heart palpitations). Gradually the body makes more RBCs, lowers haemoglobin's binding affinity and breathes faster.", []),
X("Prickly pear control", "How was prickly pear cactus controlled in Australia?",
  "By introducing a cactus-feeding predator moth from its natural habitat — biological control.", []),
],
"topics": [
T("Major abiotic factors", "Temperature (eurythermal vs stenothermal organisms), water (euryhaline vs stenohaline — salinity: inland waters < 5, sea 30–35, hypersaline lagoons > 100 parts per thousand), light (photoperiod affects flowering; deep-sea organisms live in darkness) and soil (composition, grain size, aggregation, percolation)."),
T("Adaptations", "Kangaroo rat meets its water needs by internal fat oxidation and concentrated urine. Desert plants have thick cuticles, sunken stomata and CAM photosynthesis (stomata open at night); Opuntia's leaves are reduced to spines with photosynthetic flattened stems. Polar seals have thick blubber."),
T("Population attributes", "Only populations (not individuals) have birth rates, death rates, sex ratio and age distribution. Population density can be measured by counting, percent cover or indirect methods (pug marks, faecal pellets)."),
T("Life history variation", "Populations evolve to maximise reproductive fitness (Darwinian fitness): some breed once in their lifetime (Pacific salmon, bamboo), others many times (most birds and mammals); some make many small offspring (oysters, pelagic fish), others few large ones (birds, mammals)."),
T("Amensalism and coexistence", "In amensalism one species is harmed and the other is unaffected (Penicillium secretes penicillin that kills bacteria). Competition is strongest between closely related species but can occur between unrelated ones (flamingos and fish compete for zooplankton in South American lakes)."),
T("Ecological effects of predators", "If predators over-exploit prey, prey may become extinct and predators follow. Removing a keystone predator (starfish Pisaster in the rocky intertidal) caused more than 10 invertebrate species to become extinct within a year."),
],
"ratta": [
"Nₜ₊₁ = Nₜ + (B + I) − (D + E).",
"Exponential dN/dt = rN (J);  logistic dN/dt = rN(K − N)/K (S).",
"Age pyramids: triangle growing, bell stable, urn declining.",
"Mutualism +/+;  commensalism +/0;  amensalism −/0;  predation/parasitism +/−;  competition −/−.",
"Ophrys — sexual deceit;  fig–wasp;  cuckoo — brood parasite.",
"Gause: competitive exclusion;  MacArthur: warblers.",
"Allen's rule: short ears and limbs in cold.",
],
}

SYLLABUS = [
("Population interactions — mutualism, competition, predation, parasitism", ["mutualism", "competition", "predation", "parasitism", "commensalism", "amensalism"]),
("Population attributes — growth, birth rate and death rate, age distribution", ["birth rate", "death rate", "age pyramid", "exponential", "logistic"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Ecology organisms ke aapas mein aur physical environment ke saath interactions padhti hai, chaar levels par: organisms, populations, communities aur biomes.",
"Populations ke attributes hain — birth rate (natality), death rate (mortality), sex ratio aur age distribution (age pyramid). Population size births, immigration, deaths aur emigration se badalta hai.",
"Resources unlimited hon to growth exponential (J-shaped) aur carrying capacity K limit kare to logistic (S-shaped, Verhulst–Pearl) hoti hai.",
"Population interactions: mutualism (+/+), competition (−/−), predation aur parasitism (+/−), commensalism (+/0) aur amensalism (−/0).",
],
when=[
("Natality, immigration, mortality, emigration.", None),
("Per capita rates.", None),
("Unlimited resources — J-shaped curve.", "Norway rat ka r 0.015; flour beetle ka 0.12; 1981 mein India ki human population ka r = 0.0205."),
("Limited resources — carrying capacity K ke saath S-shaped (sigmoid) curve.", "Growth N = K/2 par sabse tez; N = K par ruk jaati hai — K par sabse tez mat samjho."),
("Population trends ka andaza.", None),
("Interactions classify karna.", None),
("+/+ interactions.", None),
("+/0 interactions.", None),
("−/− interactions.", None),
("+/− interactions.", None),
("Predation.", None),
("Badalti conditions se nipatna.", None),
("Thand ke adaptations.", None),
],
examples=[
("Birth rate", "Ek talaab mein pichle saal 20 lotus plants the; is saal reproduction se 8 naye bane. Birth rate?",
 "8/20 = ⟨0⟩ offspring per lotus per year."),
("Death rate", "40 mein se 4 fruit flies ek hafte mein marti hain. Death rate?",
 "4/40 = ⟨0⟩ individuals per fruit fly per week."),
("Logistic growth rate", "r = 0.1, N = 200, K = 1000. dN/dt nikalo.",
 "dN/dt = 0.1 × 200 × (1000 − 200)/1000 = ⟨0⟩ individuals per unit time (exponential growth ⟨1⟩ deti)."),
("Brood parasitism", "Cuckoo ka anda crow ke ghonsle mein pakda kyun nahi jaata?",
 "Cuckoo ke ande size aur rang mein host ke andon jaise hote hain — evolve hua adaptation jo host ke unhe bahar phenkne ka chance ghataata hai."),
("Altitude sickness", "Oonchi jagahon par altitude sickness kyun hoti hai, aur body kaise adjust karti hai?",
 "Kam atmospheric pressure se body mein O₂ kam (nausea, thakaan, dil ki dhadkan tez). Dheere-dheere body zyada RBCs banati hai, haemoglobin ki binding affinity ghataati hai aur tez saans leti hai."),
("Prickly pear control", "Australia mein prickly pear cactus kaise control hua?",
 "Uske natural habitat se cactus khaane wala predator moth laakar — biological control."),
],
topics=[
("Major abiotic factors", "Temperature (eurythermal vs stenothermal organisms), paani (euryhaline vs stenohaline — salinity: inland waters < 5, sea 30–35, hypersaline lagoons > 100 parts per thousand), light (photoperiod flowering ko affect karta; deep-sea organisms andhere mein rehte) aur soil (composition, grain size, aggregation, percolation)."),
("Adaptations", "Kangaroo rat paani ki zaroorat internal fat oxidation aur concentrated urine se poori karta hai. Desert plants mein moti cuticle, dhanse stomata aur CAM photosynthesis (stomata raat mein khulte); Opuntia ki leaves spines ban gayi aur flat stems photosynthesis karte hain. Polar seals mein moti blubber."),
("Population attributes", "Sirf populations (individuals nahi) ke birth rates, death rates, sex ratio aur age distribution hote hain. Population density counting, percent cover ya indirect methods (pug marks, faecal pellets) se naapi jaati hai."),
("Life history variation", "Populations reproductive fitness (Darwinian fitness) maximise karne ke liye evolve hoti hain: kuch zindagi mein ek baar breed karti hain (Pacific salmon, bamboo), kuch kai baar (zyadatar birds aur mammals); kuch bahut chhote offspring (oysters, pelagic fish), kuch kam bade (birds, mammals)."),
("Amensalism and coexistence", "Amensalism mein ek species ko nuksaan aur doosri par koi asar nahi (Penicillium penicillin nikaal kar bacteria maarta hai). Competition kareebi species mein sabse zyada par anjaan species mein bhi ho sakti hai (South American lakes mein flamingos aur fish zooplankton ke liye competition karte hain)."),
("Ecological effects of predators", "Predators prey ka zyada shoshan karein to prey extinct ho sakta hai aur phir predators bhi. Keystone predator (rocky intertidal mein starfish Pisaster) hataane se ek saal mein 10 se zyada invertebrate species extinct ho gayi."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
