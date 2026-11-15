from lib import F, X, T, sig, fx, _check_and_write

q = 0.3; p = 1 - q
het = 2 * p * q
DOC = {
"slug": "evolution", "subject": "Biology",
"chapters": {"NEET": "Evolution"},
"title": "Evolution", "readMinutes": 14,
"summary": [
"Life probably arose about 4 billion years ago from non-living organic molecules (chemical evolution — Oparin and Haldane; Miller's experiment). The universe is about 20 billion years old; Earth about 4.5 billion years.",
"Evidence for evolution: palaeontology (fossils), comparative anatomy (homologous and analogous organs), molecular similarities and observed natural selection (industrial melanism, antibiotic resistance).",
"Darwin's theory: variation, overproduction, struggle for existence, natural selection (survival of the fittest — fitness means reproductive fitness). De Vries added mutation (saltation). The Hardy–Weinberg principle describes a population that is not evolving.",
"Adaptive radiation (Darwin's finches, Australian marsupials) and human evolution from Dryopithecus to Homo sapiens complete the chapter.",
],
"formulas": [
F("Hardy–Weinberg equilibrium", "p + q = 1;  p² + 2pq + q² = 1  (p, q = allele frequencies; p² and q² homozygotes, 2pq heterozygotes)", "Testing whether a population is evolving.", None, tag="PYQ favourite"),
F("Factors disturbing H–W equilibrium", "gene migration (gene flow), genetic drift (founder effect), mutation, genetic recombination, natural selection", "Causes of evolution."),
F("Types of natural selection", "stabilising (average favoured, peak gets taller);  directional (one extreme favoured, peak shifts);  disruptive (both extremes favoured, two peaks)", "Selection patterns.", None, tag="PYQ favourite"),
F("Miller's experiment (1953)", "CH₄ + NH₃ + H₂ + water vapour, electric discharge at 800 °C → amino acids", "Evidence for chemical evolution."),
F("Homologous organs", "same structure/origin, different functions → divergent evolution;  forelimbs of whale, bat, cheetah, human;  heart and brain of vertebrates;  thorn of Bougainvillea and tendril of Cucurbita", "Common ancestry.", None, tag="PYQ favourite"),
F("Analogous organs", "different structure, same function → convergent evolution;  wings of butterfly and bird;  eyes of Octopus and mammals;  flippers of penguins and dolphins;  sweet potato (root) and potato (stem)", "Similar habitat, different ancestry."),
F("Industrial melanism", "England, peppered moth (Biston betularia): before industrialisation more white moths; after (soot-darkened trees, no lichens) more dark moths", "Natural selection in action."),
F("Adaptive radiation", "Darwin's finches (Galapagos — different beaks for diet);  Australian marsupials radiating from one ancestor;  placental mammals parallel them (convergent evolution)", "Many forms from one ancestor in an area."),
F("Lamarck vs Darwin", "Lamarck: use and disuse of organs, inheritance of acquired characters (giraffe neck);  Darwin: branching descent and natural selection;  de Vries: mutations, saltation (single-step large mutation) in Oenothera", "Theories of evolution."),
F("Geological timeline (plants)", "seaweeds and a few plants ~320 mya (mya = million years ago);  seed ferns → gymnosperms → angiosperms", "Plant evolution."),
F("Animal timeline", "jawless fish ~350 mya;  lobefins (coelacanth) → first amphibians;  fish-like reptiles (Ichthyosaurs) ~200 mya;  dinosaurs disappeared ~65 mya;  first mammals shrew-like", "Animal evolution.", None, tag="PYQ favourite"),
F("Human evolution", "Dryopithecus and Ramapithecus (~15 mya) → Australopithecines (~2 mya, East Africa) → Homo habilis (650–800 cc, no meat) → Homo erectus (~1.5 mya, 900 cc, ate meat) → Neanderthal man (1400 cc, buried dead, 1,00,000–40,000 years ago) → Homo sapiens (arose in Africa; ice age 75,000–10,000 years ago)", "Human ancestors.", None, tag="PYQ favourite"),
],
"examples": [
X("Heterozygote frequency", "In a population, the recessive allele frequency q = 0.3. Frequency of heterozygotes?",
  f"p = 0.7, so 2pq = 2 × 0.7 × 0.3 = {fx(het, 2)}.", [(fx(het, 2), "0.42")]),
X("Homologous or analogous?", "Bougainvillea thorns and Cucurbita tendrils — homologous or analogous?",
  "Homologous: both are modified stems (axillary structures), showing divergent evolution.", []),
X("Antibiotic resistance", "How is antibiotic resistance an example of evolution?",
  "Bacteria with resistance-giving mutations survive antibiotic treatment and multiply; the population changes over a short time scale — natural selection.", []),
X("Founder effect", "What is the founder effect?",
  "When a small group separates and founds a new population, its allele frequencies may differ greatly by chance (genetic drift); the original drifted population becomes the founders.", []),
X("Brain capacity", "Arrange by brain capacity: Homo erectus, Homo habilis, Neanderthal man.",
  "Homo habilis (650–800 cc) < Homo erectus (~900 cc) < Neanderthal man (~1400 cc).", []),
X("Fitness in Darwin's sense", "What does 'fitness' mean in natural selection?",
  "Reproductive fitness — those better fit in an environment leave more progeny; it is not about physical strength.", []),
],
"topics": [
T("Origin of life", "The Big Bang theory explains the origin of the universe. Early Earth had no atmosphere; water vapour, methane, CO₂ and ammonia were released from molten mass; UV rays split water. Life appeared about 500 million years after Earth formed. Spontaneous generation was disproved by Louis Pasteur; panspermia proposes spores came from outer space."),
T("Theory of special creation vs evolution", "Special creation held that all species were created as they are, Earth is about 4000 years old and diversity has always been the same — challenged by fossils and studies showing Earth is about 4.5 billion years old."),
T("Fossils and dating", "Fossils are remains of hard parts of life forms in rocks; different-aged rock layers show different life forms. Their age is found by radioactive dating."),
T("Embryological evidence", "Proposed by Ernst Haeckel: all vertebrate embryos have a row of vestigial gill slits behind the head. Karl Ernst von Baer disproved the idea that embryos pass through adult stages of other animals."),
T("Mechanism of evolution", "Variation arises from mutation, recombination during gametogenesis, and gene flow or genetic drift. Natural selection acts on this variation; over generations, new species can arise (speciation)."),
T("Brief account of evolution", "Around 2000 mya the first cellular forms appeared; single cells became multicellular; invertebrates formed and became active by 500 mya. Fish with stout fins could move onto land (coelacanth, 1938 South Africa). Amphibians evolved into reptiles with thick-shelled eggs."),
],
"ratta": [
"p + q = 1;  p² + 2pq + q² = 1.",
"H–W disturbed by migration, drift, mutation, recombination, selection.",
"Homologous → divergent;  analogous → convergent.",
"Miller 1953: CH₄, NH₃, H₂, H₂O at 800 °C.",
"Biston betularia — industrial melanism.",
"Darwin's finches, Australian marsupials — adaptive radiation.",
"Habilis 650–800 cc;  erectus 900 cc;  Neanderthal 1400 cc.",
"Dinosaurs gone ~65 mya.",
],
}

SYLLABUS = [
("Origin of life; biological evolution and evidences for biological evolution (palaeontology, comparative anatomy, embryology and molecular evidence)", ["origin of life", "fossil", "homologous", "analogous", "embryo"]),
("Darwin's contribution; modern synthetic theory of evolution; mechanism of evolution — variation (mutation and recombination) and natural selection with examples, types of natural selection", ["Darwin", "natural selection", "mutation", "recombination", "stabilising", "directional", "disruptive"]),
("Gene flow and genetic drift; Hardy–Weinberg's principle", ["gene flow", "genetic drift", "Hardy–Weinberg"]),
("Adaptive radiation; human evolution", ["adaptive radiation", "human evolution"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
