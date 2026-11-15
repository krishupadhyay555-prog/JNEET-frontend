from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "human-health-and-disease", "subject": "Biology",
"chapters": {"NEET": "Human Health and Disease"},
"title": "Human Health and Disease", "readMinutes": 15,
"summary": [
"Health is a state of complete physical, mental and social well-being. Diseases are infectious (caused by pathogens — bacteria, viruses, fungi, protozoans, helminths) or non-infectious (cancer).",
"Immunity is innate (non-specific barriers present at birth) or acquired (specific, with memory — B cells make antibodies, T cells give cell-mediated immunity). Vaccination uses this memory.",
"Allergies, autoimmunity (rheumatoid arthritis) and AIDS (HIV attacks helper T cells) are failures or attacks of the immune system. Cancer is uncontrolled cell division (loss of contact inhibition).",
"Drug and alcohol abuse (opioids, cannabinoids, coca alkaloids) damage health; adolescence is the most vulnerable period, and prevention is better than cure.",
],
"formulas": [
F("Bacterial diseases", "typhoid — Salmonella typhi (Widal test, intestinal perforation);  pneumonia — Streptococcus pneumoniae, Haemophilus influenzae (alveoli fill with fluid; lips and nails grey to bluish)", "Bacterial infections.", None, tag="PYQ favourite"),
F("Viral and fungal diseases", "common cold — rhinoviruses (nose and respiratory passage, not lungs);  ringworm — Microsporum, Trichophyton, Epidermophyton (dry scaly skin lesions; heat and moisture help growth)", "Other infections."),
F("Protozoan diseases", "malaria — Plasmodium vivax, P. malariae, P. falciparum (most serious, cerebral malaria);  amoebiasis — Entamoeba histolytica (houseflies carry cysts; mucus and blood clots in stool)", "Protozoan infections.", None, tag="PYQ favourite"),
F("Plasmodium life cycle", "sporozoites (infective stage) enter via female Anopheles bite → liver (asexual multiplication) → RBCs (burst, release haemozoin → chills and high fever every 3–4 days) → gametocytes → mosquito gut (fertilisation) → sporozoites in salivary glands", "Malaria parasite.", "Sexual reproduction happens in the mosquito; humans are the intermediate host."),
F("Helminth diseases", "ascariasis — Ascaris (eggs in contaminated soil, water, vegetables; internal bleeding, muscular pain, intestinal blockage);  filariasis/elephantiasis — Wuchereria bancrofti, W. malayi (female Culex mosquito; lymphatic vessels of lower limbs)", "Worm infections."),
F("Innate immunity barriers", "physical (skin, mucus);  physiological (stomach acid, saliva, tears);  cellular (neutrophils, monocytes, NK cells, macrophages);  cytokine (interferons from virus-infected cells)", "Non-specific defence."),
F("Antibody structure", "4 polypeptide chains: 2 heavy + 2 light (H₂L₂);  types IgA, IgM, IgE, IgG (IgG crosses placenta; IgA in colostrum)", "Humoral immunity.", None, tag="PYQ favourite"),
F("Active vs passive immunity", "active: body makes antibodies (infection or vaccination) — slow, long-lasting;  passive: ready-made antibodies given (mother's milk, placenta, anti-tetanus serum, snake antivenom) — quick, short-lived", "Types of acquired immunity."),
F("Lymphoid organs", "primary: bone marrow (all blood cells, B cells mature) and thymus (T cells mature);  secondary: spleen, lymph nodes, tonsils, Peyer's patches, appendix, MALT (~50% of lymphoid tissue)", "Immune organs."),
F("HIV/AIDS", "retrovirus (RNA → reverse transcriptase → DNA);  enters macrophages (HIV factory) and helper T cells (T_H) → T_H count falls → opportunistic infections;  diagnosis by ELISA;  treated (not cured) with anti-retroviral drugs", "AIDS biology.", None, tag="PYQ favourite"),
F("Cancer basics", "loss of contact inhibition;  benign tumour (stays in place) vs malignant (spreads — metastasis);  carcinogens: ionising radiation (X-rays, gamma), non-ionising UV, chemicals (tobacco smoke), oncogenic viruses (proto-oncogenes → oncogenes)", "Cancer biology."),
F("Cancer detection and treatment", "detection: biopsy, histopathology, blood/bone marrow tests, X-ray, CT, MRI, antibodies, molecular biology;  treatment: surgery, radiation, chemotherapy, immunotherapy (α-interferon)", "Managing cancer."),
F("Drugs of abuse", "opioids: morphine (sedative, painkiller), heroin/smack (diacetylmorphine — depressant) from Papaver somniferum;  cannabinoids from Cannabis sativa (marijuana, hashish, charas, ganja) — cardiovascular effects;  coca alkaloid (cocaine/coke/crack) from Erythroxylum coca — interferes with dopamine transport, euphoria;  Atropa belladonna and Datura are hallucinogenic", "Drug sources and effects.", None, tag="PYQ favourite"),
F("Allergy", "exaggerated response to allergens (pollen, mites); IgE antibodies; mast cells release histamine and serotonin;  treated with anti-histamines, adrenaline, steroids", "Allergic reactions."),
],
"examples": [
X("Chills in malaria", "What causes the chills and high fever in malaria?",
  "Rupture of RBCs releases a toxic substance, haemozoin, which causes chills and high fever recurring every three to four days.", []),
X("Test for typhoid", "Which test confirms typhoid fever?",
  "The Widal test.", []),
X("Colostrum", "Why is colostrum important for a newborn?",
  "It contains abundant IgA antibodies that give the baby passive immunity.", []),
X("Snakebite treatment", "What is given after a snake bite, and what type of immunity is it?",
  "Antivenom — preformed antibodies against the snake venom; this is passive immunisation.", []),
X("Why AIDS weakens immunity", "Why do AIDS patients suffer infections that healthy people resist?",
  "HIV destroys helper T lymphocytes, which coordinate both antibody and cell-mediated responses; immunity collapses and opportunistic infections (Mycobacterium, Toxoplasma, fungi, viruses) take hold.", []),
X("Organ rejection", "Which immunity rejects transplanted organs?",
  "Cell-mediated immunity (T lymphocytes). Tissue and blood group matching and lifelong immunosuppressants reduce rejection.", []),
],
"topics": [
T("Maintaining health", "Balanced diet, personal hygiene, regular exercise, yoga, awareness about diseases, vaccination, proper disposal of waste, control of vectors and safe food and water."),
T("Prevention and control of infectious diseases", "Personal hygiene and public hygiene: proper disposal of waste and excreta, periodic cleaning and disinfection of water reservoirs. For vector-borne diseases (malaria, filariasis, dengue, chikungunya), control mosquitoes: avoid stagnant water, use mosquito nets, introduce Gambusia fish in ponds (feeds on larvae), spray insecticides."),
T("Vaccination and immunisation", "A vaccine contains inactivated or weakened pathogens or antigenic proteins; it generates memory B and T cells. Recombinant DNA technology allows antigenic polypeptides to be made in bacteria or yeast (hepatitis B vaccine from yeast)."),
T("Autoimmunity", "Due to genetic and unknown reasons, the body attacks self-cells — e.g. rheumatoid arthritis."),
T("Adolescence and drug abuse", "Adolescence (12–18 years) is a vulnerable period. Causes: curiosity, adventure, excitement, peer pressure, academic stress, unstable family. Effects: reckless behaviour, vandalism, violence; heavy drinking damages the liver (cirrhosis) and nervous system; drug users injecting intravenously risk AIDS and hepatitis B. Anabolic steroids cause masculinisation in females and reduced sperm count in males."),
T("Prevention of drug and alcohol abuse", "Avoid undue peer pressure, education and counselling, seeking help from parents and peers, looking for danger signs (drop in academic performance, isolation, aggressive behaviour) and seeking professional and medical help."),
],
"ratta": [
"Typhoid — Salmonella typhi (Widal);  pneumonia — Streptococcus, Haemophilus.",
"Common cold — rhinoviruses;  ringworm — Microsporum, Trichophyton, Epidermophyton.",
"Malaria: female Anopheles, haemozoin;  P. falciparum most serious.",
"Filariasis — Wuchereria, Culex.",
"Antibody H₂L₂;  IgA colostrum.",
"HIV: retrovirus, reverse transcriptase, kills T_H; ELISA.",
"Morphine/heroin — poppy;  cocaine — Erythroxylum coca (dopamine).",
"Gambusia eats mosquito larvae.",
],
}

SYLLABUS = [
("Pathogens; parasites causing human diseases — malaria, dengue, chikungunya, filariasis, ascariasis, typhoid, pneumonia, common cold, amoebiasis, ringworm and their control", ["malaria", "dengue", "chikungunya", "filariasis", "ascariasis", "typhoid", "pneumonia", "common cold", "amoebiasis", "ringworm"]),
("Basic concepts of immunology — vaccines", ["innate", "acquired", "antibod", "vaccine"]),
("Cancer, HIV and AIDS", ["cancer", "HIV", "AIDS"]),
("Adolescence — drug and alcohol abuse", ["adolescence", "drug", "alcohol"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
