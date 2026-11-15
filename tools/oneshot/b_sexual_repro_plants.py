from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "sexual-reproduction-in-flowering-plants", "subject": "Biology",
"chapters": {"NEET": "Sexual Reproduction in Flowering Plants"},
"title": "Sexual Reproduction in Flowering Plants", "readMinutes": 15,
"summary": [
"The flower is the site of sexual reproduction. The stamen's anther makes pollen grains (male gametophytes) by microsporogenesis; the ovule makes the embryo sac (female gametophyte) by megasporogenesis.",
"Pollination brings pollen to the stigma — by wind, water or animals. Plants have outbreeding devices to avoid self-pollination; pollen–pistil interaction decides compatibility.",
"Angiosperms show double fertilisation: one male gamete fuses with the egg (syngamy → zygote) and the other with the two polar nuclei (triple fusion → primary endosperm nucleus, 3n).",
"After fertilisation the ovule becomes the seed and the ovary the fruit. Special cases: apomixis, polyembryony and parthenocarpy.",
],
"formulas": [
F("Anther structure", "bilobed, dithecous, tetrasporangiate;  wall layers: epidermis, endothecium, middle layers, tapetum (nourishes pollen; dense cytoplasm, often more than one nucleus)", "Microsporangium structure.", None, tag="PYQ favourite"),
F("Microsporogenesis", "microspore mother cell (2n) → meiosis → microspore tetrad (n) → pollen grains", "Pollen formation."),
F("Pollen grain", "exine of sporopollenin (most resistant organic material known; germ pores where absent) + intine (cellulose, pectin);  mature pollen: vegetative cell (large) + generative cell (small, divides into 2 male gametes)", "Pollen structure.", "In over 60% of angiosperms pollen is shed at the 2-celled stage."),
F("Ovule parts", "funicle, hilum, integuments, micropyle, chalaza, nucellus, embryo sac", "Megasporangium structure."),
F("Megasporogenesis and embryo sac", "megaspore mother cell → meiosis → 4 megaspores (one functional) → 3 mitotic divisions → 7-celled, 8-nucleate embryo sac (monosporic, Polygonum type)", "Female gametophyte development.", None, tag="PYQ favourite"),
F("Embryo sac cells", "micropylar: egg apparatus (egg + 2 synergids with filiform apparatus);  centre: central cell with 2 polar nuclei;  chalazal: 3 antipodals", "Organisation of the embryo sac."),
F("Types of pollination", "autogamy (same flower);  geitonogamy (another flower, same plant — genetically like autogamy);  xenogamy (different plant — genetically different pollen)", "Pollination types.", "Geitonogamy is functionally cross-pollination (needs an agent) but genetically self-pollination."),
F("Chasmogamous vs cleistogamous", "chasmogamous: open flowers;  cleistogamous: never open, assured seed-set without pollinators (Viola, Oxalis, Commelina)", "Flower types and selfing."),
F("Pollinating agents", "wind (light non-sticky pollen, feathery stigma, one ovule — grasses, maize tassels);  water (Vallisneria, Hydrilla, Zostera — water hyacinth and water lily are insect/wind pollinated);  insects (large colourful, fragrant flowers, nectar)", "Pollination adaptations."),
F("Outbreeding devices", "pollen release and stigma receptivity not synchronised;  anther and stigma at different positions;  self-incompatibility;  unisexual flowers (castor, maize — prevents autogamy; papaya dioecious — prevents both autogamy and geitonogamy)", "Avoiding inbreeding.", None, tag="PYQ favourite"),
F("Double fertilisation", "syngamy: male gamete + egg → zygote (2n);  triple fusion: male gamete + 2 polar nuclei → PEN (3n)", "Unique to angiosperms.", None, tag="PYQ favourite"),
F("Post-fertilisation changes", "ovule → seed;  integuments → seed coat;  ovary → fruit;  ovary wall → pericarp;  zygote → embryo;  PEN → endosperm", "Fate of floral parts."),
F("Endosperm types", "free-nuclear (coconut water: thousands of free nuclei);  cellular (white kernel of coconut);  albuminous seeds keep endosperm (wheat, maize, castor);  non-albuminous use it up (pea, groundnut, bean)", "Endosperm and seeds."),
F("Apomixis and polyembryony", "apomixis: seed without fertilisation (Asteraceae, grasses) — preserves hybrid characters;  polyembryony: more than one embryo (citrus, mango) from nucellar cells", "Special mechanisms."),
],
"examples": [
X("Ploidy table", "Give the ploidy of: nucellus, megaspore mother cell, functional megaspore, egg, endosperm, embryo.",
  "Nucellus 2n, MMC 2n, megaspore n, egg n, endosperm 3n, embryo 2n.", []),
X("Embryo sac numbers", "How many cells and nuclei are there in a typical embryo sac?",
  "7 cells (3 antipodals, 2 synergids, 1 egg, 1 central cell) and 8 nuclei (the central cell has 2 polar nuclei).", []),
X("Which prevents both?", "Which device prevents both autogamy and geitonogamy?",
  "Dioecy (separate male and female plants), as in papaya.", []),
X("Fruit without seed", "Banana fruits form without fertilisation. What is this called?",
  "Parthenocarpy — fruit development without fertilisation (it can be induced with growth hormones).", []),
X("Pollen storage", "How are pollen grains stored for crop breeding?",
  "In liquid nitrogen at −196 °C (pollen banks), which keeps them viable for years.", []),
X("Synergid role", "What is the function of the filiform apparatus?",
  "It is a cellular thickening at the micropylar tip of synergids that guides the pollen tube into the synergid.", []),
],
"topics": [
T("Pre-fertilisation events", "Hormonal and structural changes lead to differentiation of a floral primordium. An inflorescence bears floral buds; androecium and gynoecium differentiate."),
T("Pollen viability and allergy", "Pollen of rice and wheat lose viability within 30 minutes; some members of Rosaceae, Leguminoseae and Solanaceae keep it for months. Pollen of Parthenium (carrot grass) causes allergies and bronchial afflictions. Pollen tablets are used as food supplements."),
T("Pollen–pistil interaction", "The pistil recognises compatible pollen and promotes germination; the pollen tube grows through the style and enters the ovule through the micropyle, then a synergid, releasing two male gametes. Artificial hybridisation uses emasculation (removing anthers) and bagging."),
T("Embryo development", "The zygote divides after some endosperm forms. Dicot embryo: embryonal axis with two cotyledons, epicotyl (plumule) and hypocotyl (radicle). Monocot embryo: one cotyledon (scutellum), coleoptile around the shoot apex and coleorrhiza around the radicle."),
T("Seeds", "Seeds are the final product of sexual reproduction; dormancy lets them survive bad conditions. Residual persistent nucellus is perisperm (black pepper, beet). Old seeds remain viable — lupine (~10,000 years), date palm (~2000 years)."),
T("False fruits", "In apple, strawberry and cashew the thalamus also contributes to fruit formation — these are false fruits. True fruits develop only from the ovary."),
],
"ratta": [
"Anther: dithecous, tetrasporangiate;  tapetum nourishes.",
"Exine = sporopollenin.",
"Embryo sac: 7 cells, 8 nuclei (monosporic).",
"Geitonogamy: genetically selfing.",
"Cleistogamous: Viola, Oxalis, Commelina.",
"Vallisneria, Hydrilla, Zostera — water.",
"Papaya (dioecious) prevents autogamy + geitonogamy.",
"Coconut water = free-nuclear endosperm.",
"Apomixis: seed without fertilisation;  polyembryony: citrus, mango.",
],
}

SYLLABUS = [
("Flower structure; development of male and female gametophytes", ["anther", "microsporogenesis", "megasporogenesis", "embryo sac"]),
("Pollination — types, agencies and examples; outbreeding devices; pollen–pistil interaction", ["autogamy", "geitonogamy", "xenogamy", "outbreeding", "pollen–pistil"]),
("Double fertilisation; post-fertilisation events — development of endosperm and embryo, development of seed and formation of fruit", ["double fertilisation", "endosperm", "embryo", "seed", "fruit"]),
("Special modes — apomixis, parthenocarpy, polyembryony; significance of seed dispersal and fruit formation", ["apomixis", "parthenocarpy", "polyembryony"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
