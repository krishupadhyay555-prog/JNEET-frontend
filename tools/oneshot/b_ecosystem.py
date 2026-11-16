from lib import F, X, T, sig, fx, _check_and_write

npp = 100 - 20
e_tert = 10000 * 0.1 ** 3
DOC = {
"slug": "ecosystem", "subject": "Biology",
"chapters": {"NEET": "Ecosystem"},
"title": "Ecosystem", "readMinutes": 12,
"summary": [
"An ecosystem is a functional unit of nature where living organisms interact among themselves and with the physical environment. Its structure includes species composition and stratification.",
"Its functions: productivity, decomposition, energy flow and nutrient cycling. Energy flow is unidirectional, from the sun through producers to consumers; only about 10% passes to each next trophic level (Lindeman's 10% law).",
"Ecological pyramids (number, biomass, energy) show trophic structure; the energy pyramid is always upright.",
"Ecological succession turns bare areas (primary) or disturbed areas (secondary) into climax communities through seral stages.",
],
"formulas": [
F("Productivity", "NPP = GPP − R  (R = respiration losses);  secondary productivity = rate of new organic matter formed by consumers", "Primary productivity calculations.", None, tag="PYQ favourite"),
F("World productivity", "annual NPP of biosphere ≈ 170 billion tons (dry weight);  oceans (70% of surface) ≈ 55 billion tons", "Global productivity facts."),
F("PAR", "plants capture only 2–10% of photosynthetically active radiation (PAR), which is less than 50% of incident solar radiation", "Energy capture efficiency.", None, tag="PYQ favourite"),
F("Ten per cent law", "only about 10% of energy passes from one trophic level to the next (Lindeman, 1942)", "Energy flow calculations.", None, tag="PYQ favourite"),
F("Decomposition steps", "fragmentation (detritivores, earthworm) → leaching (water-soluble nutrients into soil) → catabolism (enzymes of bacteria and fungi) → humification (humus — dark, amorphous, resistant, colloidal) → mineralisation (release of inorganic nutrients)", "Breaking down detritus."),
F("Factors affecting decomposition", "faster when detritus is rich in nitrogen and water-soluble sugars, in warm and moist conditions;  slower with lignin and chitin, low temperature, anaerobiosis", "Decomposition rate."),
F("Food chains", "grazing food chain (GFC): grass → goat → man;  detritus food chain (DFC): begins with dead organic matter — decomposers (saprotrophs)", "Food chain types.", "In aquatic ecosystems GFC is the major conduit for energy; in terrestrial ecosystems far more energy flows through DFC."),
F("Trophic levels", "producers (1st) → primary consumers/herbivores (2nd) → secondary consumers (3rd) → tertiary consumers (4th)", "Positions in a food chain."),
F("Ecological pyramids", "number: upright in grassland, inverted for a tree;  biomass: upright on land, inverted in sea (phytoplankton less than fish);  energy: always upright", "Pyramid shapes.", None, tag="PYQ favourite"),
F("Standing crop and state", "standing crop = mass of living material at a trophic level at a particular time;  standing state = amount of nutrients present in the soil at any given time", "Ecosystem terms."),
F("Succession", "pioneer species → seral communities (seres) → climax community;  hydrarch (in water): phytoplankton → submerged plants → floating → reed swamp → marsh-meadow → scrub → forest;  xerarch (dry): lichens → mosses → herbs → shrubs → trees", "Ecological succession.", None, tag="PYQ favourite"),
F("Primary vs secondary succession", "primary: bare area with no soil (newly cooled lava, bare rock) — slow, hundreds to thousands of years;  secondary: after natural vegetation is lost (abandoned farmland, burned or cut forests) — faster because soil is present", "Types of succession."),
F("Nutrient cycles", "gaseous (reservoir in atmosphere — nitrogen, carbon);  sedimentary (reservoir in Earth's crust — phosphorus, sulphur)", "Biogeochemical cycles."),
],
"examples": [
X("NPP", "GPP of an ecosystem is 100 kcal/m²/yr and respiration losses are 20 kcal/m²/yr. NPP?",
  f"NPP = 100 − 20 = {fx(npp)} kcal/m²/yr.", [(fx(npp), "80")]),
X("Energy to tertiary consumers", "Producers fix 10,000 J. How much reaches tertiary consumers by the 10% law?",
  f"10,000 → 1000 (primary) → 100 (secondary) → {fx(e_tert)} J (tertiary).", [(fx(e_tert), "10")]),
X("Inverted pyramid of biomass", "Why is the pyramid of biomass inverted in the sea?",
  "Phytoplankton have a small standing biomass at any moment but reproduce very fast; the fish that eat them have a larger biomass.", []),
X("Pioneers on rock", "Why are lichens the pioneers on bare rock?",
  "They secrete acids that dissolve rock, helping weathering and soil formation, which later allows mosses and other plants to grow.", []),
X("Carbon cycle fact", "What fraction of the dry weight of organisms is carbon, and where is most carbon stored?",
  "About 49% of the dry weight of organisms is carbon. Oceans hold about 71% of global carbon as dissolved carbon.", []),
],
"topics": [
T("Ecosystem structure", "Biotic components: producers, consumers, decomposers. Abiotic: light, temperature, water, soil. Vertical distribution of species at different levels is called stratification (trees top, shrubs, herbs and grasses bottom in forests)."),
T("Phosphorus cycle", "Rocks are the main reservoir of phosphorus as phosphates; weathering releases them into soil, plants absorb them, and decomposers return phosphorus to the soil. There is no significant respiratory release of phosphorus into the atmosphere, unlike carbon."),
T("Carbon cycle", "Producers fix about 4 × 10¹³ kg of carbon annually through photosynthesis. Carbon returns to the atmosphere through respiration, decomposition, burning of fossil fuels and wood, forest fires and volcanic activity. Human activity has increased atmospheric CO₂."),
T("Ecosystem services", "Healthy ecosystems purify air and water, mitigate floods and droughts, cycle nutrients, generate fertile soils, provide habitat, pollinate flowers and store carbon. Robert Constanza estimated nature's services at about US $33 trillion per year — nearly twice the global gross national product."),
T("Limitations of ecological pyramids", "They don't consider the same species belonging to two or more trophic levels, they assume a simple food chain (not a food web) and saprophytes are not given any place in them even though they play a vital role."),
T("Climax community", "The final, stable community in equilibrium with the environment. All succession — in water or on land — tends towards a medium-water (mesic) climax."),
],
"ratta": [
"NPP = GPP − R.",
"Plants capture 2–10% of PAR;  10% law (Lindeman).",
"Energy pyramid always upright;  biomass inverted in sea;  number inverted for a tree.",
"Fragmentation → leaching → catabolism → humification → mineralisation.",
"Hydrarch: phytoplankton → … → forest;  xerarch: lichens first.",
"P cycle: sedimentary (rocks);  C cycle: gaseous.",
"Biosphere NPP 170 billion tons; oceans 55.",
],
}

SYLLABUS = [
("Ecosystem — patterns, components; productivity and decomposition", ["productivity", "decomposition", "stratification"]),
("Energy flow; pyramids of number, biomass and energy", ["energy flow", "pyramid"]),
("Nutrient cycles (carbon and phosphorus); ecological succession; ecological services", ["carbon cycle", "phosphorus cycle", "succession", "ecosystem services"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Ecosystem nature ki functional unit hai jahan living organisms aapas mein aur physical environment se interact karte hain. Iski structure mein species composition aur stratification aate hain.",
"Iske functions: productivity, decomposition, energy flow aur nutrient cycling. Energy flow ek-disha hai, sun se producers aur phir consumers tak; har agle trophic level tak sirf lagbhag 10% jaata hai (Lindeman ka 10% law).",
"Ecological pyramid (number, biomass, energy) trophic structure dikhate hain; energy pyramid hamesha seedha (upright) hota hai.",
"Ecological succession khaali areas (primary) ya disturb hue areas (secondary) ko seral stages se climax communities mein badalta hai. Carbon cycle aur phosphorus cycle nutrient cycling ke examples hain; ecosystem services insaan ke liye anmol hain.",
],
when=[
("Primary productivity ki calculations.", None),
("Global productivity facts.", None),
("Energy pakadne ki efficiency.", None),
("Energy flow ki calculations.", None),
("Detritus todna.", None),
("Decomposition ki rate.", None),
("Food chain ke types.", "Aquatic ecosystems mein GFC energy ka main raasta hai; terrestrial ecosystems mein kahin zyada energy DFC se behti hai — ulta mat likhna."),
("Food chain mein positions.", None),
("Pyramid ke shapes.", None),
("Ecosystem ke terms.", None),
("Ecological succession.", None),
("Succession ke types.", None),
("Biogeochemical cycles.", None),
],
examples=[
("NPP", "Ek ecosystem ka GPP 100 kcal/m²/yr hai aur respiration losses 20 kcal/m²/yr. NPP?",
 "NPP = 100 − 20 = ⟨0⟩ kcal/m²/yr."),
("Tertiary consumers tak energy", "Producers 10,000 J fix karte hain. 10% law se tertiary consumers tak kitna pahunchta hai?",
 "10,000 → 1000 (primary) → 100 (secondary) → ⟨0⟩ J (tertiary)."),
("Ulta pyramid of biomass", "Samudra mein pyramid of biomass ulta kyun hota hai?",
 "Phytoplankton ka kisi bhi pal standing biomass kam hota hai par wo bahut tezi se reproduce karte hain; unhe khaane wali fish ka biomass zyada hota hai."),
("Chattan par pioneers", "Nangi chattan par lichens pioneers kyun hote hain?",
 "Ye acids nikaal kar chattan ghulaate hain, weathering aur soil banne mein madad karte hain, jisse baad mein mosses aur doosre plants ug paate hain."),
("Carbon cycle ka fact", "Organisms ke dry weight ka kitna hissa carbon hai, aur zyadatar carbon kahan store hai?",
 "Organisms ke dry weight ka lagbhag 49% carbon hai. Oceans global carbon ka lagbhag 71% dissolved carbon ki tarah rakhte hain."),
],
topics=[
("Ecosystem structure", "Biotic components: producers, consumers, decomposers. Abiotic: light, temperature, paani, soil. Alag levels par species ka vertical distribution stratification kehlata hai (forests mein upar trees, phir shrubs, neeche herbs aur grasses)."),
("Phosphorus cycle", "Rocks phosphates ki tarah phosphorus ka main reservoir hain; weathering unhe mitti mein chhodti hai, plants absorb karte hain, aur decomposers phosphorus waapas mitti mein laate hain. Carbon ke ulat, phosphorus ka atmosphere mein koi khaas respiratory release nahi."),
("Carbon cycle", "Producers har saal photosynthesis se lagbhag 4 × 10¹³ kg carbon fix karte hain. Carbon respiration, decomposition, fossil fuels aur lakdi jalaane, forest fires aur volcanic activity se atmosphere mein lautta hai. Insaani activity ne atmospheric CO₂ badha diya hai."),
("Ecosystem services", "Swasth ecosystems hawa aur paani saaf karte, baadh aur sookha kam karte, nutrients cycle karte, upjaau mitti banate, habitat dete, flowers pollinate karte aur carbon store karte hain. Robert Constanza ne nature ki services ki keemat lagbhag US $33 trillion per year aanki — global gross national product ka lagbhag dugna."),
("Limitations of ecological pyramids", "Ye ek hi species ke do ya zyada trophic levels mein hone ko nahi maante, simple food chain maante hain (food web nahi) aur saprophytes ko koi jagah nahi dete jabki unka role bahut zaroori hai."),
("Climax community", "Environment ke saath equilibrium mein aakhri, stable community. Saari succession — paani mein ho ya zameen par — medium-water (mesic) climax ki taraf jaati hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
