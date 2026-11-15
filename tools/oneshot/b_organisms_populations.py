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

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
