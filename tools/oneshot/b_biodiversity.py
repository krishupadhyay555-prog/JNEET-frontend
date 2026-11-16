from lib import F, X, T, sig, fx, _check_and_write
import math

# species–area: log S = log C + Z log A ; doubling area with Z = 0.2
ratio = 2 ** 0.2
DOC = {
"slug": "biodiversity-and-conservation", "subject": "Biology",
"chapters": {"NEET": "Biodiversity and Conservation"},
"title": "Biodiversity and Conservation", "readMinutes": 13,
"summary": [
"Biodiversity (a term popularised by Edward Wilson) exists at three levels: genetic, species and ecological diversity. About 1.5 million species have been described; estimates of the total range up to about 7 million (Robert May).",
"India has only 2.4% of the world's land area but 8.1% of its species diversity — one of 12 mega-diversity countries. Diversity is highest in the tropics and falls towards the poles.",
"Alexander von Humboldt's species–area relationship: species richness rises with area, up to a limit. Loss of biodiversity is driven by the 'Evil Quartet': habitat loss and fragmentation, over-exploitation, alien species invasions and co-extinctions.",
"Conservation is in situ (hotspots, protected areas, sacred groves) or ex situ (zoos, botanical gardens, seed banks, cryopreservation).",
],
"formulas": [
F("Levels of biodiversity", "genetic (Rauwolfia vomitoria — reserpine variation; India has 50,000+ strains of rice and 1000 varieties of mango);  species (Western Ghats have more amphibian species than Eastern Ghats);  ecological (India's deserts, rain forests, mangroves, coral reefs, wetlands, estuaries and alpine meadows)", "Three levels.", None, tag="PYQ favourite"),
F("Global species proportions", "more than 70% of recorded species are animals; plants (including algae, fungi, bryophytes, gymnosperms, angiosperms) are about 22%;  among animals insects are 70% (7 of every 10 animals)", "Species composition."),
F("Species–area relationship", "log S = log C + Z log A  (S = species richness, A = area, Z = slope, C = Y-intercept)", "Von Humboldt's relationship.", "For very large areas like whole continents, Z is much steeper (0.6–1.2).", tag="PYQ favourite"),
F("Z values", "Z ≈ 0.1–0.2 for small areas regardless of taxonomic group or region;  frugivorous birds and mammals in tropical forests across continents: Z ≈ 1.15", "Slope of the species–area line."),
F("Why tropics are richer", "long evolutionary time (undisturbed for millions of years);  less seasonal, more constant environment (niche specialisation);  more solar energy → higher productivity", "Latitudinal gradient.", None, tag="PYQ favourite"),
F("Evil Quartet", "habitat loss and fragmentation (Amazon rain forest — 'lungs of the planet');  over-exploitation (Steller's sea cow, passenger pigeon);  alien species invasions (Nile perch in Lake Victoria; Parthenium, Lantana, Eichhornia; African catfish Clarias gariepinus);  co-extinctions (host fish and its parasites; plant–pollinator)", "Causes of biodiversity loss.", None, tag="PYQ favourite"),
F("Recent extinctions", "dodo (Mauritius), quagga (Africa), thylacine (Australia), Steller's sea cow (Russia);  three subspecies of tiger: Bali, Javan, Caspian;  last 500 years: 784 extinctions (IUCN 2004)", "Extinction examples.", "The IUCN Red List (Red Data Book) records threatened species in categories such as critically endangered, endangered and vulnerable."),
F("Rivet popper hypothesis", "Paul Ehrlich: the ecosystem is an aeroplane and species are rivets — losing a few may not matter, but losing key ones (on the wings) threatens the whole system", "Why species loss matters."),
F("Biodiversity hotspots", "high species richness + high endemism;  34 hotspots worldwide (less than 2% of land area);  India: Western Ghats and Sri Lanka, Indo-Burma, Himalaya", "In situ conservation priority.", None, tag="PYQ favourite"),
F("Protected areas in India", "14 biosphere reserves, 90 national parks, 448 wildlife sanctuaries;  Ramsar sites protect wetlands of international importance", "In situ conservation numbers."),
F("Sacred groves", "Khasi and Jaintia Hills (Meghalaya), Aravalli Hills (Rajasthan), Western Ghats (Karnataka, Maharashtra), Sarguja, Chanda and Bastar (Madhya Pradesh)", "Traditional conservation."),
F("Ex situ conservation", "zoos, botanical gardens, wildlife safari parks;  cryopreservation of gametes (−196 °C);  in vitro fertilisation;  tissue culture propagation;  seed banks", "Conservation outside the natural habitat."),
F("International efforts", "Earth Summit, Rio de Janeiro (1992) — Convention on Biological Diversity;  World Summit on Sustainable Development, Johannesburg (2002) — reduce biodiversity loss by 2010", "Global conventions."),
],
"examples": [
X("Doubling the area", "With Z = 0.2, by what factor does species richness rise if the area doubles?",
  f"S ∝ A^Z, so the ratio = 2^0.2 = {fx(ratio, 2)}.", [(fx(ratio, 2), "1.15")]),
X("India's share", "What share of world land area and species does India have?",
  "2.4% of the land area and 8.1% of the species diversity — a mega-diversity country with over 45,000 plant and twice as many animal species recorded.", []),
X("Lake Victoria", "How did the Nile perch affect Lake Victoria?",
  "Introduced into the lake, it led to the extinction of more than 200 species of native cichlid fish — an alien species invasion.", []),
X("Co-extinction", "Give an example of co-extinction.",
  "When a host fish species becomes extinct, its unique parasites also become extinct. Similarly, a plant and its obligate pollinator depend on each other.", []),
X("Why conserve biodiversity?", "Give the three types of arguments for conservation.",
  "Narrowly utilitarian (food, fibre, medicines — over 25% of drugs come from plants), broadly utilitarian (ecosystem services; the Amazon forest produces about 20% of total O₂ by photosynthesis) and ethical (every species has intrinsic value).", []),
],
"topics": [
T("Number of species", "IUCN (2004) put described plants and animals at slightly more than 1.5 million. Robert May estimated about 7 million species globally. Many more species remain undiscovered, especially among prokaryotes, insects and tropical species."),
T("Importance of species diversity", "Communities with more species tend to be more stable — David Tilman's long-term plot experiments showed that plots with more species had less year-to-year variation in biomass and higher productivity."),
T("Amazon rain forest", "It harbours probably millions of species, including more than 40,000 plants, 3000 fish, 1300 birds, 427 mammals, 427 amphibians, 378 reptiles and more than 1,25,000 invertebrates."),
T("Biopiracy and bioprospecting", "Bioprospecting is exploring molecular, genetic and species-level diversity for products of economic importance. Nations rich in biodiversity can benefit by bioprospecting."),
T("Loss rate", "Current species extinction rates are estimated to be 100 to 1000 times faster than in pre-human times; 12% of birds, 23% of mammals, 32% of amphibians and 31% of gymnosperms are facing the threat of extinction. Ecologists warn of a sixth mass extinction."),
T("Effects of biodiversity loss", "Decline in plant production, lower resistance to environmental perturbations such as drought, and increased variability in ecosystem processes such as plant productivity, water use, and pest and disease cycles."),
],
"ratta": [
"India: 2.4% land, 8.1% species, mega-diversity.",
"log S = log C + Z log A;  Z 0.1–0.2 (small areas), 0.6–1.2 (continents).",
"Evil Quartet: habitat loss, over-exploitation, alien invasions, co-extinction.",
"Nile perch → 200+ cichlids extinct.",
"34 hotspots;  India: Western Ghats–Sri Lanka, Indo-Burma, Himalaya.",
"14 biosphere reserves, 90 national parks, 448 sanctuaries.",
"Rivet popper — Paul Ehrlich.",
"Rio 1992 (CBD);  Johannesburg 2002.",
],
}

SYLLABUS = [
("Concept of biodiversity; patterns of biodiversity; importance of biodiversity", ["genetic", "species", "ecological diversity", "latitudinal"]),
("Loss of biodiversity; threatened organisms, extinction, Red Data Book", ["loss", "extinction", "IUCN", "Red Data Book"]),
("Biodiversity conservation; hotspots, endangered organisms, sacred groves, biosphere reserves, national parks, wildlife sanctuaries and Ramsar sites", ["hotspot", "sacred groves", "biosphere reserve", "national park", "sanctuar", "Ramsar"]),
("In situ and ex situ conservation", ["in situ", "ex situ"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Biodiversity (Edward Wilson ne term popular kiya) teen levels par hai: genetic, species aur ecological diversity. Lagbhag 1.5 million species describe hui hain; kul ka andaza lagbhag 7 million tak (Robert May).",
"India ke paas duniya ka sirf 2.4% land area par 8.1% species diversity hai — 12 mega-diversity deshon mein se ek. Diversity tropics mein sabse zyada aur poles ki taraf kam hoti hai (latitudinal gradient).",
"Alexander von Humboldt ka species–area relationship: area ke saath species richness ek had tak badhti hai. Biodiversity ka loss aur extinction 'Evil Quartet' se hota hai: habitat loss aur fragmentation, over-exploitation, alien species invasions aur co-extinctions. IUCN ki Red Data Book threatened species record karti hai.",
"Conservation in situ (hotspot, protected areas — national park, sanctuary, biosphere reserve — sacred groves, Ramsar wetlands) ya ex situ (zoos, botanical gardens, seed banks, cryopreservation) hota hai.",
],
when=[
("Teen levels.", None),
("Species composition.", None),
("Von Humboldt ka relationship.", "Poore continents jaise bahut bade areas ke liye Z kahin zyada steep (0.6–1.2) hota hai."),
("Species–area line ka slope.", None),
("Latitudinal gradient.", None),
("Biodiversity loss ke kaaran.", None),
("Extinction ke examples.", "IUCN Red List (Red Data Book) threatened species ko critically endangered, endangered aur vulnerable jaisi categories mein record karti hai."),
("Species ka khona kyun maayne rakhta hai.", None),
("In situ conservation priority.", None),
("In situ conservation ke numbers.", None),
("Paaramparik conservation.", None),
("Natural habitat ke bahar conservation.", None),
("Global conventions.", None),
],
examples=[
("Area dugna karna", "Z = 0.2 ho to area dugna hone par species richness kitne guna badhti hai?",
 "S ∝ A^Z, isliye ratio = 2^0.2 = ⟨0⟩."),
("India ka hissa", "Duniya ke land area aur species mein India ka kitna hissa hai?",
 "2.4% land area aur 8.1% species diversity — mega-diversity desh jahan 45,000 se zyada plant aur unse dugni animal species record hain."),
("Lake Victoria", "Nile perch ne Lake Victoria par kya asar daala?",
 "Lake mein laaye jaane ke baad isne 200 se zyada native cichlid fish species ko extinct kar diya — alien species invasion."),
("Co-extinction", "Co-extinction ka example do.",
 "Jab host fish species extinct hoti hai, uske unique parasites bhi extinct ho jaate hain. Waise hi plant aur uska obligate pollinator ek doosre par nirbhar hain."),
("Biodiversity kyun bachaayein?", "Conservation ke teen tarah ke arguments batao.",
 "Narrowly utilitarian (khaana, fibre, dawaayein — 25% se zyada drugs plants se), broadly utilitarian (ecosystem services; Amazon forest photosynthesis se kul O₂ ka lagbhag 20% banata hai) aur ethical (har species ki apni keemat hai)."),
],
topics=[
("Number of species", "IUCN (2004) ke hisaab se describe kiye gaye plants aur animals 1.5 million se thode zyada hain. Robert May ne duniya mein lagbhag 7 million species ka andaza lagaya. Bahut si species abhi khoji nahi gayi, khaaskar prokaryotes, insects aur tropical species mein."),
("Importance of species diversity", "Zyada species wali communities zyada stable hoti hain — David Tilman ke lambe plot experiments ne dikhaya ki zyada species wale plots mein saal-dar-saal biomass ka utaar-chadhaav kam aur productivity zyada thi."),
("Amazon rain forest", "Isme shayad millions species hain, jisme 40,000 se zyada plants, 3000 fish, 1300 birds, 427 mammals, 427 amphibians, 378 reptiles aur 1,25,000 se zyada invertebrates."),
("Biopiracy and bioprospecting", "Bioprospecting economic importance ke products ke liye molecular, genetic aur species-level diversity ki khoj hai. Biodiversity mein ameer desh bioprospecting se faayda utha sakte hain."),
("Loss rate", "Abhi species extinction rates insaan se pehle ke samay se 100 se 1000 guna tez maane jaate hain; 12% birds, 23% mammals, 32% amphibians aur 31% gymnosperms par extinction ka khatra. Ecologists sixth mass extinction ki chetaavni dete hain."),
("Effects of biodiversity loss", "Plant production mein girawat, drought jaise environmental jhatkon ke prati kam resistance, aur plant productivity, water use, aur pest aur disease cycles jaise ecosystem processes mein zyada utaar-chadhaav."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
