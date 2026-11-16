from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "animal-kingdom", "subject": "Biology",
"chapters": {"NEET": "Animal Kingdom"},
"title": "Animal Kingdom", "readMinutes": 15,
"summary": [
"Animals are classified on basic features: level of organisation, symmetry, germ layers, coelom, segmentation and notochord.",
"Non-chordates run from Porifera (cellular level) and Cnidaria (tissue level, radial, diploblastic) through flatworms, roundworms and annelids to arthropods (the largest phylum), molluscs, echinoderms and hemichordates.",
"Chordates have a notochord, a dorsal hollow nerve cord and pharyngeal gill slits at some stage. Vertebrates replace the notochord with a vertebral column.",
"Vertebrate classes — cyclostomes, cartilaginous and bony fish, amphibians, reptiles, birds and mammals — differ in skin, heart, respiration, temperature regulation and reproduction.",
],
"formulas": [
F("Levels of organisation", "cellular (Porifera) → tissue (Cnidaria, Ctenophora) → organ (Platyhelminthes) → organ system (Aschelminthes onwards)", "Comparing body organisation."),
F("Symmetry", "asymmetrical (most sponges);  radial (Cnidaria, Ctenophora, adult Echinodermata);  bilateral (Platyhelminthes onwards)", "Classifying by symmetry.", "Echinoderm larvae are bilateral; adults are radial."),
F("Germ layers", "diploblastic: ectoderm + endoderm with mesoglea (Cnidaria, Ctenophora);  triploblastic: + mesoderm (Platyhelminthes to Chordata)", "Embryonic layers."),
F("Coelom", "acoelomate: Platyhelminthes;  pseudocoelomate: Aschelminthes;  coelomate: Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata, Chordata", "Body cavity questions.", None, tag="PYQ favourite"),
F("Porifera", "canal system (ostia → spongocoel → osculum), choanocytes (collar cells), spicules/spongin fibres; hermaphrodite; internal fertilisation; indirect development", "Sycon, Spongilla, Euspongia."),
F("Cnidaria and Ctenophora", "Cnidaria: cnidoblasts (stinging cells), polyp and medusa forms, metagenesis (Obelia) — Hydra, Physalia, Adamsia, Pennatula, Meandrina;  Ctenophora: comb plates, bioluminescence — Pleurobrachia, Ctenoplana", "Diploblastic phyla.", None, tag="PYQ favourite"),
F("Worms", "Platyhelminthes: flattened, flame cells, hooks/suckers (Taenia, Fasciola, Planaria regenerates);  Aschelminthes: round, separate sexes, female larger (Ascaris, Wuchereria, Ancylostoma);  Annelida: metameric segmentation, nephridia, closed circulation (Nereis, Pheretima, Hirudinaria)", "Worm phyla."),
F("Arthropoda", "jointed appendages, chitinous exoskeleton, open circulation; respiration by gills, book gills, book lungs or tracheae; Malpighian tubules; compound eyes, statocysts", "Largest phylum (over two-thirds of animal species).", "Living fossil: Limulus (king crab)."),
F("Mollusca and Echinodermata", "Mollusca: soft body, mantle, calcareous shell, radula, ctenidia (Pila, Pinctada, Sepia, Loligo, Octopus);  Echinodermata: spiny calcareous ossicles, water vascular system (tube feet), all marine (Asterias, Echinus, Antedon, Cucumaria, Ophiura)", "Molluscs and echinoderms.", "Sepia (cuttlefish), Loligo (squid) and Octopus (devil fish) are molluscs, not fish."),
F("Chordate features", "notochord + dorsal hollow nerve cord + paired pharyngeal gill slits + post-anal tail", "Chordates vs non-chordates.", None, tag="PYQ favourite"),
F("Chordate subphyla", "Urochordata: notochord only in larval tail (Ascidia, Salpa, Doliolum);  Cephalochordata: notochord from head to tail throughout life (Branchiostoma/Amphioxus);  Vertebrata: vertebral column", "Protochordates vs vertebrates."),
F("Heart chambers", "fish 2;  amphibians and reptiles 3 (crocodile 4);  birds and mammals 4", "Circulation questions.", None, tag="PYQ favourite"),
F("Vertebrate classes", "Cyclostomata (jawless, suctorial mouth — Petromyzon, Myxine);  Chondrichthyes (cartilage, placoid scales, no air bladder — Scoliodon, Pristis, Trygon, Torpedo);  Osteichthyes (bone, operculum, air bladder — Labeo, Catla, Hippocampus, Exocoetus);  Amphibia (moist skin, cloaca — Rana, Bufo, Salamandra, Ichthyophis);  Reptilia (dry scaly skin — Chelone, Chameleon, Naja, Vipera);  Aves (feathers, pneumatic bones — Corvus, Columba, Struthio, Pavo);  Mammalia (hair, mammary glands, external ears — Ornithorhynchus oviparous, Macropus, Pteropus, Balaenoptera)", "Examples by class."),
F("Cold vs warm blooded", "poikilothermous: fish, amphibians, reptiles;  homoiothermous: birds and mammals", "Temperature regulation."),
],
"examples": [
X("Metagenesis", "What is metagenesis? Give an example.",
  "Alternation of polyp (asexual) and medusa (sexual) generations in some cnidarians — Obelia: polyps produce medusae asexually; medusae form polyps sexually.", []),
X("Pseudocoelom", "Which phylum has a pseudocoelom, and what does that mean?",
  "Aschelminthes (roundworms). The body cavity is not lined fully by mesoderm; mesoderm appears as scattered pouches between ectoderm and endoderm.", []),
X("Not a fish", "Which of these is a true fish: jellyfish, starfish, cuttlefish, flying fish, silverfish?",
  "Only the flying fish (Exocoetus, Osteichthyes). Jellyfish — Cnidaria; starfish — Echinodermata; cuttlefish — Mollusca; silverfish — insect (Arthropoda).", []),
X("Egg-laying mammal", "Name an oviparous mammal.",
  "Ornithorhynchus (platypus). Most mammals are viviparous.", []),
X("Electric organ and poison sting", "Which cartilaginous fish has an electric organ and which has a poison sting?",
  "Torpedo has electric organs; Trygon (sting ray) has a poison sting.", []),
X("Excretory structures", "Match: flame cells, nephridia, Malpighian tubules, green glands.",
  "Flame cells — Platyhelminthes; nephridia — Annelida; Malpighian tubules — most insects (Arthropoda); green glands — crustaceans like prawn.", []),
],
"topics": [
T("Segmentation", "Metameric segmentation — the body is divided externally and internally into repeated segments with serial repetition of some organs — appears in Annelida (earthworm), Arthropoda and Chordata."),
T("Hemichordata", "Worm-like marine animals with a proboscis, collar and trunk; earlier placed under Chordata but they have a stomochord (not a true notochord) and are now a separate non-chordate phylum: Balanoglossus, Saccoglossus."),
T("Arthropod examples", "Economically important: Apis (honey bee), Bombyx (silkworm), Laccifer (lac insect). Vectors: Anopheles, Culex, Aedes (mosquitoes). Gregarious pest: Locusta. Others: Limulus, butterfly, scorpion, prawn."),
T("Amphibians and reptiles", "Amphibians: two pairs of limbs, moist skin without scales, eyes with eyelids, tympanum, cloaca, external fertilisation, respiration by gills, lungs and skin. Reptiles: dry cornified skin with scales or scutes, no external ear opening, internal fertilisation, eggs with shells, snakes and lizards shed skin as cast."),
T("Birds", "Feathers, beak, forelimbs modified into wings, hind limbs with scales, pneumatic bones, crop and gizzard, air sacs connected to lungs, four-chambered heart, oviparous with direct development. Flightless birds include Struthio (ostrich), Aptenodytes (penguin)."),
T("Mammals", "Mammary glands, hair, external pinnae, different types of teeth, four-chambered heart, mostly viviparous. Pteropus (flying fox) flies; Balaenoptera (blue whale), Delphinus (dolphin) live in water; Macropus (kangaroo) is a marsupial."),
],
"ratta": [
"Coelom: acoelomate flatworms, pseudocoelomate roundworms, rest coelomate.",
"Cnidoblasts → Cnidaria;  comb plates → Ctenophora.",
"Flame cells, nephridia, Malpighian tubules.",
"Arthropoda largest phylum;  Limulus = living fossil.",
"Water vascular system → Echinodermata.",
"Notochord: larval tail (Uro), head to tail (Cephalo).",
"Heart: fish 2, amphibia/reptile 3 (crocodile 4), birds/mammals 4.",
"Platypus lays eggs;  Torpedo electric;  Trygon sting.",
],
}

SYLLABUS = [
("Salient features and classification of animals — non-chordates up to phyla level and chordates up to class level", ["non-chordate", "chordate", "class"]),
("Basis of classification: levels of organisation, symmetry, diploblastic and triploblastic, coelom, segmentation, notochord", ["symmetry", "diploblastic", "triploblastic", "coelom", "segmentation", "notochord"]),
("Porifera, Cnidaria, Ctenophora, Platyhelminthes, Aschelminthes, Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata", ["Porifera", "Cnidaria", "Ctenophora", "Platyhelminthes", "Aschelminthes", "Annelida", "Arthropoda", "Mollusca", "Echinodermata", "Hemichordata"]),
("Vertebrate classes — Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves, Mammalia", ["Cyclostomata", "Chondrichthyes", "Osteichthyes", "Amphibia", "Reptilia", "Aves", "Mammalia"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Animals ko basic features par classify karte hain: level of organisation, symmetry, germ layers (diploblastic ya triploblastic), coelom, segmentation aur notochord.",
"Non-chordate phyla Porifera (cellular level) aur Cnidaria (tissue level, radial, diploblastic) se shuru hoke Ctenophora, flatworms (Platyhelminthes), roundworms (Aschelminthes) aur Annelida se Arthropoda (sabse bada phylum), Mollusca, Echinodermata aur Hemichordata tak jaate hain.",
"Chordate mein kisi na kisi stage par notochord, dorsal hollow nerve cord aur pharyngeal gill slits hote hain. Vertebrates mein notochord ki jagah vertebral column aa jaata hai.",
"Vertebrate ki har class — Cyclostomata, Chondrichthyes, Osteichthyes, Amphibia, Reptilia, Aves aur Mammalia — skin, heart, respiration, temperature regulation aur reproduction mein alag hai.",
],
when=[
("Body organisation compare karna.", None),
("Symmetry se classify karna.", "Echinoderm ke larvae bilateral hote hain; adults radial — dono ko ek mat samjho."),
("Embryo ki layers.", None),
("Body cavity ke sawal.", None),
("Sycon, Spongilla, Euspongia.", None),
("Diploblastic phyla.", None),
("Worms ke phyla.", None),
("Sabse bada phylum (animal species ka do-tihaai se zyada).", "Living fossil: Limulus (king crab)."),
("Molluscs aur echinoderms.", "Sepia (cuttlefish), Loligo (squid) aur Octopus (devil fish) molluscs hain, fish nahi."),
("Chordates vs non-chordates.", None),
("Protochordates vs vertebrates.", None),
("Circulation ke sawal.", None),
("Class ke hisaab se examples.", None),
("Temperature regulation.", None),
],
examples=[
("Metagenesis", "Metagenesis kya hai? Example do.",
 "Kuch cnidarians mein polyp (asexual) aur medusa (sexual) generations ka baari-baari aana — Obelia: polyps asexually medusae banate hain; medusae sexually polyps banate hain."),
("Pseudocoelom", "Kis phylum mein pseudocoelom hai, aur iska matlab kya?",
 "Aschelminthes (roundworms). Body cavity poori tarah mesoderm se lined nahi hoti; mesoderm ectoderm aur endoderm ke beech bikhre pouches ki tarah hota hai."),
("Fish nahi hai", "Inme se asli fish kaun hai: jellyfish, starfish, cuttlefish, flying fish, silverfish?",
 "Sirf flying fish (Exocoetus, Osteichthyes). Jellyfish — Cnidaria; starfish — Echinodermata; cuttlefish — Mollusca; silverfish — insect (Arthropoda)."),
("Ande dene wala mammal", "Ek oviparous mammal ka naam batao.",
 "Ornithorhynchus (platypus). Zyadatar mammals viviparous hain."),
("Electric organ aur poison sting", "Kaunsi cartilaginous fish mein electric organ hai aur kisme poison sting?",
 "Torpedo mein electric organs; Trygon (sting ray) mein poison sting."),
("Excretory structures", "Match karo: flame cells, nephridia, Malpighian tubules, green glands.",
 "Flame cells — Platyhelminthes; nephridia — Annelida; Malpighian tubules — zyadatar insects (Arthropoda); green glands — prawn jaise crustaceans."),
],
topics=[
("Segmentation", "Metameric segmentation — body bahar aur andar se repeated segments mein bati hoti hai aur kuch organs serially repeat hote hain — Annelida (earthworm), Arthropoda aur Chordata mein."),
("Hemichordata", "Worm jaise marine animals jinmein proboscis, collar aur trunk hote hain; pehle Chordata mein rakhe gaye the par inmein stomochord hai (asli notochord nahi), isliye ab alag non-chordate phylum: Balanoglossus, Saccoglossus."),
("Arthropod examples", "Economically important: Apis (honey bee), Bombyx (silkworm), Laccifer (lac insect). Vectors: Anopheles, Culex, Aedes (mosquitoes). Jhund mein rehne wala pest: Locusta. Aur: Limulus, butterfly, scorpion, prawn."),
("Amphibians and reptiles", "Amphibians: do jode limbs, bina scales ki geeli skin, eyelids wali aankhein, tympanum, cloaca, external fertilisation, gills, lungs aur skin se respiration. Reptiles: sookhi cornified skin scales ya scutes ke saath, external ear opening nahi, internal fertilisation, shell wale ande; snakes aur lizards skin ko cast ki tarah utaarte hain."),
("Birds", "Feathers, beak, forelimbs wings mein badle, hind limbs par scales, pneumatic (hawa bhari) bones, crop aur gizzard, lungs se jude air sacs, four-chambered heart, oviparous aur direct development. Flightless birds: Struthio (ostrich), Aptenodytes (penguin)."),
("Mammals", "Mammary glands, hair, external pinnae, alag-alag type ke daant, four-chambered heart, zyadatar viviparous. Pteropus (flying fox) udta hai; Balaenoptera (blue whale), Delphinus (dolphin) paani mein rehte hain; Macropus (kangaroo) marsupial hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
