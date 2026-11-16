from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "plant-kingdom", "subject": "Biology",
"chapters": {"NEET": "Plant Kingdom"},
"title": "Plant Kingdom", "readMinutes": 13,
"summary": [
"Plantae includes algae, bryophytes, pteridophytes, gymnosperms and angiosperms. Classification moved from artificial systems (few morphological characters) to natural systems (many characters) to phylogenetic systems (evolutionary relationships).",
"Algae are simple, thalloid, mostly aquatic; they are grouped by pigments and stored food into green (Chlorophyceae), brown (Phaeophyceae) and red (Rhodophyceae) algae.",
"Bryophytes (amphibians of the plant kingdom) have a dominant gametophyte. Pteridophytes are the first vascular plants with a dominant sporophyte. Gymnosperms have naked seeds; angiosperms have seeds inside fruits.",
"Plant life cycles show alternation of generations — haplontic, diplontic or haplo-diplontic.",
],
"formulas": [
F("Algal classes", "Chlorophyceae: chlorophyll a, b; starch; cellulose wall (Chlamydomonas, Volvox, Ulothrix, Spirogyra, Chara);  Phaeophyceae: chlorophyll a, c, fucoxanthin; laminarin, mannitol; algin (Ectocarpus, Dictyota, Laminaria, Sargassum, Fucus);  Rhodophyceae: chlorophyll a, d, r-phycoerythrin; floridean starch (Polysiphonia, Porphyra, Gracilaria, Gelidium)", "Comparing algal groups.", None, tag="PYQ favourite"),
F("Algal reproduction", "isogamous (similar gametes — Ulothrix, Spirogyra);  anisogamous (dissimilar size — Eudorina);  oogamous (large egg + small sperm — Volvox, Fucus)", "Types of sexual reproduction."),
F("Useful algae", "agar (Gelidium, Gracilaria);  carrageen (red algae);  algin (brown algae);  Chlorella — protein-rich food supplement used by space travellers", "Economic importance."),
F("Bryophytes", "gametophyte dominant; rhizoids; sporophyte (foot, seta, capsule) depends on gametophyte; water needed for fertilisation", "Liverworts (Marchantia) and mosses (Funaria, Polytrichum, Sphagnum).", "Sphagnum gives peat, used as fuel and as packing material because it holds water."),
F("Moss life cycle", "spore → protonema (creeping, green, filamentous) → leafy stage (bears sex organs) → zygote → sporophyte", "Stages of mosses."),
F("Pteridophytes", "sporophyte dominant with true roots, stems, leaves and vascular tissue; spores in sporangia on sporophylls; gametophyte = prothallus; water needed for fertilisation", "Selaginella, Equisetum, Dryopteris, Pteris, Adiantum."),
F("Heterospory", "megaspores (female gametophyte) + microspores (male gametophyte) — Selaginella, Salvinia", "A step towards the seed habit.", None, tag="PYQ favourite"),
F("Pteridophyte classes", "Psilopsida (Psilotum), Lycopsida (Selaginella, Lycopodium), Sphenopsida (Equisetum), Pteropsida (Dryopteris, Pteris, Adiantum)", "Classification of pteridophytes."),
F("Gymnosperms", "ovules not enclosed (naked seeds); microsporophylls and megasporophylls in cones (strobili); pollen grains carried by wind; no water needed for fertilisation", "Cycas, Pinus, Ginkgo.", "Coralloid roots of Cycas have N₂-fixing cyanobacteria; Pinus roots have mycorrhiza."),
F("Angiosperm double fertilisation", "male gamete 1 + egg → zygote (2n);  male gamete 2 + secondary nucleus (2 polar nuclei) → primary endosperm nucleus (3n)", "Unique to angiosperms.", None, tag="PYQ favourite"),
F("Ploidy in seeds", "gymnosperm endosperm = n (female gametophyte);  angiosperm endosperm = 3n", "Ploidy questions."),
F("Life cycle patterns", "haplontic: dominant gametophyte, zygote only diploid stage (Volvox, Spirogyra, Chlamydomonas);  diplontic: dominant sporophyte, gametes only haploid stage (seed plants, Fucus);  haplo-diplontic: both multicellular (bryophytes, pteridophytes; Ectocarpus, Polysiphonia, kelps)", "Classifying life cycles.", None, tag="PYQ favourite"),
],
"examples": [
X("Amphibians of plants", "Why are bryophytes called the amphibians of the plant kingdom?",
  "They live on land but need water for sexual reproduction (sperm swim to the egg).", []),
X("First vascular plants", "Which group first had xylem and phloem, and which generation is dominant there?",
  "Pteridophytes; the sporophyte is the dominant, independent generation.", []),
X("Ploidy count", "In a moss, state the ploidy of protonema, leafy stage, capsule and spores.",
  "Protonema n, leafy stage n, capsule (sporophyte) 2n, spores n (formed by meiosis).", []),
X("Life cycle type", "Fucus has which life-cycle pattern?",
  "Diplontic — the sporophyte is dominant and the gametes are the only haploid stage.", []),
X("Agar source", "Agar used in microbiology comes from which algae?",
  "Red algae — Gelidium and Gracilaria (Rhodophyceae).", []),
X("Giant trees", "Name the tallest gymnosperm.",
  "Sequoia (giant redwood) — one of the tallest tree species.", []),
],
"topics": [
T("Systems of classification", "Artificial (Linnaeus; mainly vegetative characters or androecium), natural (Bentham and Hooker; internal and external features) and phylogenetic (evolutionary). Numerical taxonomy uses computers and gives equal weight to all characters; cytotaxonomy uses chromosome number and structure; chemotaxonomy uses chemical constituents."),
T("Algae general features", "Chlorophyll-bearing, simple, thalloid, autotrophic, largely aquatic. Forms range from unicellular (Chlamydomonas) and colonial (Volvox) to filamentous (Ulothrix, Spirogyra) and large marine kelps. They fix about half of all CO₂ on Earth."),
T("Liverworts", "Thalloid (Marchantia), dorsiventral. Asexual reproduction by fragmentation and gemmae (green, multicellular buds in gemma cups). Sporophyte has foot, seta and capsule."),
T("Gymnosperm details", "Roots are generally tap roots; stems can be unbranched (Cycas) or branched (Pinus); leaves are needle-like in conifers (thick cuticle, sunken stomata reduce water loss). Male cone has microsporophylls; female cone has megasporophylls with ovules; the female gametophyte has archegonia."),
T("Angiosperms", "Flowering plants: dicots and monocots. Size ranges from tiny Wolffia to tall Eucalyptus (over 100 m). Flower has stamens (anthers → pollen) and pistil (ovary with ovules); the embryo sac has 7 cells and 8 nuclei."),
T("Ecological importance", "Bryophytes and lichens are pioneers on rocks and help form soil; mosses prevent soil erosion. Pteridophytes are used medicinally and as soil binders and ornamentals."),
],
"ratta": [
"Green: a, b, starch;  brown: a, c, fucoxanthin, laminarin;  red: a, d, phycoerythrin, floridean starch.",
"Bryophyte: gametophyte dominant;  pteridophyte onwards: sporophyte dominant.",
"Heterospory: Selaginella, Salvinia.",
"Gymnosperm endosperm n;  angiosperm 3n.",
"Haplontic: Volvox, Spirogyra;  diplontic: seed plants, Fucus;  haplo-diplontic: bryophytes, pteridophytes, Ectocarpus.",
"Agar: Gelidium, Gracilaria;  Chlorella for space travellers.",
],
}

SYLLABUS = [
("Classification of plants into major groups — algae, bryophytes, pteridophytes, gymnosperms (topics excluded: angiosperms)", ["algae", "bryophyte", "pteridophyte", "gymnosperm"]),
("Salient and distinguishing features and a few examples of each category", ["Spirogyra", "Funaria", "Selaginella", "Pinus"]),
("Plant life cycles and alternation of generations", ["haplontic", "diplontic", "alternation of generations"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Plantae mein algae, bryophyte, pteridophyte, gymnosperm aur angiosperms aate hain. Classification artificial systems (kuch morphological characters) se natural systems (kai characters) aur phir phylogenetic systems (evolutionary relationships) tak aaya.",
"Algae simple, thalloid, zyadatar aquatic hain; pigments aur stored food ke hisaab se green (Chlorophyceae), brown (Phaeophyceae) aur red (Rhodophyceae) algae mein baante jaate hain.",
"Bryophytes (plant kingdom ke amphibians) mein gametophyte dominant. Pteridophytes pehle vascular plants, sporophyte dominant. Gymnosperms ke seeds naked; angiosperms ke seeds fruits ke andar.",
"Plant life cycles alternation of generations dikhate hain — haplontic, diplontic ya haplo-diplontic.",
],
when=[
("Algal groups compare karna (Spirogyra, Fucus, Polysiphonia).", None),
("Sexual reproduction ke types.", None),
("Economic importance.", None),
("Liverworts (Marchantia) aur mosses (Funaria, Polytrichum, Sphagnum).", "Sphagnum se peat milta hai jo fuel aur packing material ki tarah use hota hai kyunki paani rok kar rakhta hai."),
("Mosses ke stages.", None),
("Selaginella, Equisetum, Dryopteris, Pteris, Adiantum.", None),
("Seed habit ki taraf ek kadam.", None),
("Pteridophytes ka classification.", None),
("Cycas, Pinus, Ginkgo.", "Cycas ki coralloid roots mein N₂-fixing cyanobacteria; Pinus ki roots mein mycorrhiza."),
("Sirf angiosperms mein.", None),
("Ploidy ke sawal.", None),
("Life cycles classify karna.", None),
],
examples=[
("Plants ke amphibians", "Bryophytes ko plant kingdom ke amphibians kyun kehte hain?",
 "Ye zameen par rehte hain par sexual reproduction ke liye paani chahiye (sperm tair kar egg tak jaata hai)."),
("Pehle vascular plants", "Kis group mein pehle xylem aur phloem aaye, aur wahan kaunsi generation dominant?",
 "Pteridophytes; sporophyte dominant, independent generation hai."),
("Ploidy ginti", "Moss mein protonema, leafy stage, capsule aur spores ki ploidy?",
 "Protonema n, leafy stage n, capsule (sporophyte) 2n, spores n (meiosis se)."),
("Life cycle type", "Fucus ka life-cycle pattern?",
 "Diplontic — sporophyte dominant aur gametes hi akela haploid stage."),
("Agar ka source", "Microbiology mein use hone wala agar kaunsi algae se?",
 "Red algae — Gelidium aur Gracilaria (Rhodophyceae)."),
("Vishaal ped", "Sabse lamba gymnosperm?",
 "Sequoia (giant redwood) — sabse lambi tree species mein se ek."),
],
topics=[
("Systems of classification", "Artificial (Linnaeus; mainly vegetative characters ya androecium), natural (Bentham aur Hooker; andar-bahar ke features) aur phylogenetic (evolutionary). Numerical taxonomy computers se, sabhi characters ko barabar weight; cytotaxonomy chromosome number aur structure se; chemotaxonomy chemical constituents se."),
("Algae general features", "Chlorophyll wale, simple, thalloid, autotrophic, zyadatar aquatic. Forms unicellular (Chlamydomonas) aur colonial (Volvox) se filamentous (Ulothrix, Spirogyra) aur bade marine kelps tak. Earth par lagbhag aadha CO₂ fix karte hain."),
("Liverworts", "Thalloid (Marchantia), dorsiventral. Asexual reproduction fragmentation aur gemmae se (gemma cups mein hare, multicellular buds). Sporophyte mein foot, seta aur capsule."),
("Gymnosperm details", "Roots aam taur par tap roots; stems unbranched (Cycas) ya branched (Pinus); conifers mein patte suiyon jaise (moti cuticle, dhanse stomata paani bachaate hain). Male cone mein microsporophylls; female cone mein ovules wale megasporophylls; female gametophyte mein archegonia."),
("Angiosperms", "Flowering plants: dicots aur monocots. Size chhote Wolffia se lambe Eucalyptus (100 m se zyada) tak. Flower mein stamens (anthers → pollen) aur pistil (ovules wali ovary); embryo sac mein 7 cells aur 8 nuclei."),
("Ecological importance", "Bryophytes aur lichens chattanon par pioneers hain aur mitti banaane mein madad karte hain; mosses soil erosion rokte hain. Pteridophytes medicine, soil binders aur ornamentals ki tarah use hote hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
