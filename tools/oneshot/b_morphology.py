from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "morphology-of-flowering-plants", "subject": "Biology",
"chapters": {"NEET": "Morphology of Flowering Plants"},
"title": "Morphology of Flowering Plants", "readMinutes": 14,
"summary": [
"Morphology is the study of external form: root, stem, leaf, inflorescence, flower, fruit and seed. Each part is modified in many plants for storage, support, protection or reproduction.",
"Dicots usually have tap roots and reticulate venation; monocots have fibrous roots and parallel venation.",
"A flower is a modified shoot. Its parts (calyx, corolla, androecium, gynoecium) are described by symmetry, aestivation, ovary position and placentation, and summarised in a floral formula and floral diagram.",
"Three families are studied in detail: Fabaceae (pea), Solanaceae (potato) and Liliaceae (lily).",
],
"formulas": [
F("Root types", "tap root (from radicle — mustard);  fibrous root (wheat);  adventitious (from other parts — grass, Monstera, banyan)", "Root systems."),
F("Root modifications", "storage — carrot, turnip (tap), sweet potato (adventitious);  prop roots — banyan;  stilt roots — maize, sugarcane;  pneumatophores — Rhizophora (mangroves)", "Modified roots.", None, tag="PYQ favourite"),
F("Stem modifications", "underground storage — potato (tuber), ginger, turmeric (rhizome), Colocasia (corm), onion (bulb);  tendrils — cucumber, grapes;  thorns — Bougainvillea, Citrus;  phylloclade — Opuntia, Euphorbia;  runner — grass;  stolon — mint, jasmine;  offset — Pistia, Eichhornia;  sucker — banana, pineapple, Chrysanthemum", "Modified stems.", "Potato is a stem (has nodes and eyes), sweet potato is a root.", tag="PYQ favourite"),
F("Leaf modifications", "tendrils — peas;  spines — cacti;  fleshy storage — onion, garlic;  phyllode (flattened petiole) — Australian Acacia;  pitcher — Nepenthes;  bladder — Utricularia", "Modified leaves."),
F("Phyllotaxy", "alternate — China rose, mustard, sunflower;  opposite — Calotropis, guava;  whorled — Alstonia", "Arrangement of leaves."),
F("Inflorescence", "racemose: main axis keeps growing, flowers acropetal (older below);  cymose: main axis ends in a flower, flowers basipetal", "Types of inflorescence."),
F("Flower symmetry and ovary position", "actinomorphic (radial — mustard, Datura, chilli);  zygomorphic (one plane — pea, gulmohur, Cassia);  hypogynous (superior — mustard, China rose, brinjal);  perigynous (half-inferior — plum, rose, peach);  epigynous (inferior — guava, cucumber, sunflower ray florets)", "Describing flowers."),
F("Aestivation", "valvate (Calotropis);  twisted (China rose, lady's finger, cotton);  imbricate (Cassia, gulmohur);  vexillary/papilionaceous (pea, bean)", "Arrangement of petals in the bud.", None, tag="PYQ favourite"),
F("Placentation", "marginal (pea);  axile (China rose, tomato, lemon);  parietal (mustard, Argemone);  free central (Dianthus, Primrose);  basal (sunflower, marigold)", "Ovule arrangement in the ovary.", None, tag="PYQ favourite"),
F("Stamen terms", "epipetalous (attached to petals — brinjal);  epiphyllous (attached to perianth — lily);  monoadelphous (China rose), diadelphous (pea), polyadelphous (citrus)", "Androecium questions."),
F("Floral formula symbols", "Br bracteate, ⊕ actinomorphic, % zygomorphic, ⚥ bisexual, K calyx, C corolla, P perianth, A androecium, G gynoecium; G with a line below = superior ovary, line above = inferior", "Reading a floral formula."),
F("Fabaceae formula", "% ⚥ K₍₅₎ C₁₊₂₊₍₂₎ A₍₉₎₊₁ G₁", "Pea family.", None, tag="PYQ favourite"),
F("Solanaceae formula", "⊕ ⚥ K₍₅₎ C₍₅₎ A₅ (epipetalous) G₍₂₎, superior, swollen placenta with axile placentation", "Potato family."),
F("Liliaceae formula", "Br ⊕ ⚥ P₍₃₊₃₎ A₃₊₃ G₍₃₎, superior, trilocular, axile", "Lily family."),
],
"examples": [
X("Root or stem?", "Ginger grows underground. Is it a root or a stem?",
  "A stem (rhizome): it has nodes, internodes, scale leaves and buds. Roots never bear nodes or buds.", []),
X("Fruit type", "What is the edible part of mango and coconut?",
  "Both are drupes. Mango: the fleshy mesocarp. Coconut: the endosperm (and the fibrous mesocarp is coir).", []),
X("Pea flower", "Describe the corolla of a pea flower.",
  "Papilionaceous: one large standard (vexillum), two lateral wings (alae) and two fused keel petals; vexillary aestivation.", []),
X("Placentation identification", "Ovules on the central axis of a multilocular ovary — which placentation, and one example?",
  "Axile placentation — China rose, tomato or lemon.", []),
X("Economic families", "Name one food plant each from Fabaceae, Solanaceae and Liliaceae.",
  "Fabaceae: gram, arhar, soybean (pulses). Solanaceae: potato, tomato, brinjal. Liliaceae: Asparagus (vegetable); aloe and Colchicum are medicinal, tulip and Gloriosa ornamental.", []),
X("Pneumatophores", "Why do mangroves like Rhizophora have pneumatophores?",
  "They grow in waterlogged, oxygen-poor soil; pneumatophores grow upwards out of the soil to take in oxygen for respiration.", []),
],
"topics": [
T("Regions of the root", "Root cap at the tip protects the apex; region of meristematic activity (cells divide); region of elongation (cells grow); region of maturation (root hairs absorb water and minerals)."),
T("The leaf", "Parts: leaf base (pulvinus in legumes; sheath in monocots), petiole and lamina. Venation is reticulate in dicots and parallel in monocots. Simple leaves have an undivided lamina; compound leaves are pinnate (neem) or palmate (silk cotton). A bud is present in the axil of a leaf but not of a leaflet."),
T("Parts of a flower", "Calyx (sepals), corolla (petals), androecium (stamens) and gynoecium (carpels). When calyx and corolla are not distinct, they form a perianth (lily). Apocarpous carpels are free (lotus, rose); syncarpous are fused (mustard, tomato)."),
T("Fruit", "A fruit is a mature ovary formed after fertilisation; one formed without fertilisation is parthenocarpic. Fruit wall (pericarp) = epicarp, mesocarp, endocarp."),
T("Seed", "Dicot seed (bean, gram, pea): seed coat (testa and tegmen), hilum, micropyle, embryo with two cotyledons, radicle and plumule. Monocot seed (maize): endospermic, single cotyledon (scutellum), aleurone layer, coleoptile and coleorhiza."),
T("Family features", "Fabaceae: tap root with root nodules, pinnately compound leaves with pulvinus, legume fruit. Solanaceae: often hairy stems, berry or capsule fruits, many endospermous seeds. Liliaceae: monocot herbs with bulbs, corms or rhizomes; perianth tepals; capsule or berry fruits."),
],
"ratta": [
"Potato = stem tuber;  sweet potato = root.",
"Pneumatophores — Rhizophora;  stilt — maize;  prop — banyan.",
"Twisted: China rose, cotton;  vexillary: pea;  valvate: Calotropis.",
"Marginal pea, axile China rose/tomato, parietal mustard, free central Dianthus, basal sunflower.",
"Fabaceae: A₍₉₎₊₁ diadelphous;  Solanaceae: epipetalous, swollen placenta;  Liliaceae: P₍₃₊₃₎.",
"Mango & coconut = drupe.",
],
}

SYLLABUS = [
("Morphology of different parts of flowering plants: root, stem, leaf, inflorescence, flower, fruit and seed", ["root", "stem", "leaf", "inflorescence", "flower", "fruit", "seed"]),
("Description of families: Fabaceae, Solanaceae and Liliaceae", ["Fabaceae", "Solanaceae", "Liliaceae"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Morphology bahari roop ki study hai: root, stem, leaf, inflorescence, flower, fruit aur seed. Kai plants mein har part storage, support, protection ya reproduction ke liye modify hota hai.",
"Dicots mein aam taur par tap roots aur reticulate venation; monocots mein fibrous roots aur parallel venation.",
"Flower ek modified shoot hai. Iske parts (calyx, corolla, androecium, gynoecium) ko symmetry, aestivation, ovary position aur placentation se describe karte hain, aur floral formula aur floral diagram mein likhte hain.",
"Teen families detail mein padhte hain: Fabaceae (pea), Solanaceae (potato) aur Liliaceae (lily).",
],
when=[
("Root systems.", None),
("Modified roots.", None),
("Modified stems.", "Potato stem hai (nodes aur eyes hain), sweet potato root hai — ulta mat likhna."),
("Modified leaves.", None),
("Leaves ki arrangement.", None),
("Inflorescence ke types.", None),
("Flowers describe karna.", None),
("Bud mein petals ki arrangement.", None),
("Ovary mein ovules ki arrangement.", None),
("Androecium ke sawal.", None),
("Floral formula padhna.", None),
("Pea family.", None),
("Potato family.", None),
("Lily family.", None),
],
examples=[
("Root ya stem?", "Ginger zameen ke neeche ugta hai. Root hai ya stem?",
 "Stem (rhizome): isme nodes, internodes, scale leaves aur buds hain. Roots par kabhi nodes ya buds nahi hote."),
("Fruit type", "Mango aur coconut ka khaane wala part kaunsa hai?",
 "Dono drupes hain. Mango: fleshy mesocarp. Coconut: endosperm (aur fibrous mesocarp se coir milta hai)."),
("Pea ka flower", "Pea flower ki corolla describe karo.",
 "Papilionaceous: ek bada standard (vexillum), do side wale wings (alae) aur do jude hue keel petals; vexillary aestivation."),
("Placentation pehchaano", "Multilocular ovary mein ovules central axis par — kaunsi placentation, aur ek example?",
 "Axile placentation — China rose, tomato ya lemon."),
("Economic families", "Fabaceae, Solanaceae aur Liliaceae se ek-ek food plant batao.",
 "Fabaceae: gram, arhar, soybean (pulses). Solanaceae: potato, tomato, brinjal. Liliaceae: Asparagus (sabzi); aloe aur Colchicum medicinal, tulip aur Gloriosa ornamental."),
("Pneumatophores", "Rhizophora jaise mangroves mein pneumatophores kyun hote hain?",
 "Ye paani bhari, oxygen ki kami wali mitti mein ugte hain; pneumatophores mitti se upar ki taraf badh kar respiration ke liye oxygen lete hain."),
],
topics=[
("Regions of the root", "Tip par root cap apex ko bachaata hai; region of meristematic activity (cells divide hote hain); region of elongation (cells lambe hote hain); region of maturation (root hairs paani aur minerals absorb karte hain)."),
("The leaf", "Parts: leaf base (legumes mein pulvinus; monocots mein sheath), petiole aur lamina. Venation dicots mein reticulate, monocots mein parallel. Simple leaf ki lamina bina kati; compound leaves pinnate (neem) ya palmate (silk cotton). Leaf ke axil mein bud hota hai par leaflet ke axil mein nahi."),
("Parts of a flower", "Calyx (sepals), corolla (petals), androecium (stamens) aur gynoecium (carpels). Calyx aur corolla alag na dikhein to perianth banta hai (lily). Apocarpous carpels free (lotus, rose); syncarpous jude hue (mustard, tomato)."),
("Fruit", "Fruit fertilisation ke baad bani paki hui ovary hai; bina fertilisation bana fruit parthenocarpic. Fruit wall (pericarp) = epicarp, mesocarp, endocarp."),
("Seed", "Dicot seed (bean, gram, pea): seed coat (testa aur tegmen), hilum, micropyle, do cotyledons wala embryo, radicle aur plumule. Monocot seed (maize): endospermic, ek cotyledon (scutellum), aleurone layer, coleoptile aur coleorhiza."),
("Family features", "Fabaceae: root nodules wali tap root, pulvinus wale pinnately compound leaves, legume fruit. Solanaceae: aksar baal wale stems, berry ya capsule fruits, kai endospermous seeds. Liliaceae: bulbs, corms ya rhizomes wale monocot herbs; perianth tepals; capsule ya berry fruits."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
