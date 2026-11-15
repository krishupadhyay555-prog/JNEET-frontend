from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "the-living-world", "subject": "Biology",
"chapters": {"NEET": "The Living World"},
"title": "The Living World", "readMinutes": 9,
"summary": [
"Living organisms grow, reproduce, metabolise, respond to their surroundings and are made of cells. Metabolism, cellular organisation and consciousness are the defining features; growth and reproduction alone are not.",
"Over 1.7–1.8 million species have been described. To study them, biologists name (nomenclature), identify, classify and arrange them in a hierarchy — this is taxonomy; systematics adds evolutionary relationships.",
"Binomial nomenclature (Carolus Linnaeus) gives each organism a two-part scientific name: generic name + specific epithet, e.g. Mangifera indica.",
"Taxonomic categories run from kingdom down to species; each step down groups organisms that share more characters.",
],
"formulas": [
F("Defining features of life", "metabolism + cellular organisation + consciousness (response to stimuli)", "Deciding whether something is living.", "Growth and reproduction are not defining: crystals grow, and mules or worker bees don't reproduce."),
F("Binomial nomenclature", "Genus (capital first letter) + species (small letter), italicised in print or underlined separately when handwritten, followed by the author's name (abbreviated)", "Writing scientific names.", "Mangifera indica Linn. — the author's name is written in roman (not italics).", tag="PYQ favourite"),
F("Taxonomic hierarchy", "Kingdom → Phylum (animals) / Division (plants) → Class → Order → Family → Genus → Species", "Ranking categories.", "Going up the hierarchy, the number of shared characters decreases.", tag="PYQ favourite"),
F("Species", "a group of individuals with fundamental similarities that can interbreed and produce fertile offspring", "Basic unit of classification."),
F("Mango classification", "Plantae → Angiospermae → Dicotyledonae → Sapindales → Anacardiaceae → Mangifera → indica", "Example hierarchy for a plant."),
F("Human classification", "Animalia → Chordata → Mammalia → Primata → Hominidae → Homo → sapiens", "Example hierarchy for an animal."),
F("Housefly and wheat", "housefly: Insecta → Diptera → Muscidae → Musca domestica;  wheat: Monocotyledonae → Poales → Poaceae → Triticum aestivum", "Common PYQ examples."),
F("Taxonomic aids", "herbarium (dried, pressed plant specimens);  botanical garden (living plants);  museum (preserved specimens);  zoological park (live animals);  key (identification by contrasting couplets)", "Tools for identification.", None, tag="PYQ favourite"),
F("Taxonomic key", "based on couplets of contrasting characters (lead); separate keys for each category", "Identifying unknown organisms."),
F("Famous gardens", "Royal Botanical Gardens, Kew (England);  Indian Botanical Garden, Howrah;  National Botanical Research Institute, Lucknow", "Botanical garden facts."),
],
"examples": [
X("Living or not?", "Why is reproduction not considered a defining property of life?",
  "Many living organisms cannot reproduce (mules, sterile worker bees, infertile humans), yet they are alive. Metabolism and cellular organisation are present in every living organism.", []),
X("Correct scientific name", "Which is written correctly: Mangifera Indica, mangifera indica, Mangifera indica?",
  "Mangifera indica — genus starts with a capital letter, the specific epithet with a small letter, both italicised.", []),
X("Shared characters", "Which has more characters in common: members of a genus or members of a family?",
  "Members of a genus. Lower categories group organisms that are more closely related, so they share more characters.", []),
X("Herbarium sheet", "What information does a herbarium sheet carry?",
  "The plant's scientific name, family, collector's name, date and place of collection, local name and field notes, along with the pressed specimen.", []),
X("Order vs family", "Arrange family, order, genus and class from highest to lowest.",
  "Class → Order → Family → Genus.", []),
],
"topics": [
T("Diversity in the living world", "Biodiversity is the number and types of organisms on Earth. Local names differ from place to place, so scientific names are needed that are unique and accepted worldwide. At the highest level, life is grouped into three domains (Carl Woese): Bacteria, Archaea and Eukarya."),
T("Nomenclature codes", "Plant names follow the International Code of Botanical Nomenclature (ICBN); animal names follow the International Code of Zoological Nomenclature (ICZN). Scientific names are Latin or Latinised."),
T("Growth and metabolism", "In living organisms growth is from inside (increase in mass and number of cells). Metabolism is the sum of all chemical reactions in the body; isolated metabolic reactions in a test tube are not living."),
T("Taxonomy and systematics", "Taxonomy: characterisation, identification, nomenclature and classification. Systematics (Linnaeus, Systema Naturae) also considers evolutionary relationships."),
T("Taxonomic categories", "Each category (rank) is called a taxon. The hierarchy has seven obligate categories; intermediate ranks like sub-species or super-family are sometimes used."),
T("Museums, zoos and keys", "Museums keep animals in preservative solutions and as skins or skeletons; insects are pinned in boxes. Zoological parks keep wild animals in protected surroundings like their natural habitats. Flora, manuals, monographs and catalogues also help identification."),
],
"ratta": [
"Defining: metabolism, cellular organisation, consciousness.",
"Binomial: Genus capital, species small, italics.",
"K → P → C → O → F → G → S.",
"Herbarium = dried plants;  key = contrasting couplets.",
"Mango: Anacardiaceae, Sapindales;  human: Hominidae, Primata.",
"ICBN plants, ICZN animals.",
],
}

SYLLABUS = [
("What is living? Biodiversity; need for classification", ["living", "biodiversity", "classification"]),
("Three domains of life; taxonomy and systematics; concept of species and taxonomical hierarchy", ["three domains", "taxonomy", "systematics", "species", "hierarchy"]),
("Binomial nomenclature", ["binomial"]),
("Tools for study of taxonomy — museums, zoos, herbaria, botanical gardens", ["museum", "zoo", "herbarium", "botanical garden"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
