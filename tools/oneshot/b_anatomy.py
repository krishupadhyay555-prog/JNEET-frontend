from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "anatomy-of-flowering-plants", "subject": "Biology",
"chapters": {"NEET": "Anatomy of Flowering Plants"},
"title": "Anatomy of Flowering Plants", "readMinutes": 13,
"summary": [
"Plant tissues are meristematic (dividing) or permanent (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem and phloem).",
"Tissues are organised into three tissue systems: epidermal, ground (fundamental) and vascular.",
"Internal structure differs between dicot and monocot roots, stems and leaves — the number and arrangement of vascular bundles is the key.",
"Secondary growth (vascular cambium and cork cambium) increases girth in dicots and gymnosperms, giving annual rings, heartwood, sapwood and bark.",
],
"formulas": [
F("Meristems", "apical (root and shoot tips — length);  intercalary (base of internodes in grasses — regrowth after grazing);  lateral (vascular cambium, cork cambium — girth)", "Types of meristem."),
F("Simple permanent tissues", "parenchyma (thin walls, storage, photosynthesis);  collenchyma (corners thickened with cellulose, hemicellulose, pectin — mechanical support in young dicot stems);  sclerenchyma (lignified, dead — fibres and sclereids)", "Comparing simple tissues."),
F("Xylem elements", "tracheids, vessels, xylem fibres (dead);  xylem parenchyma (only living part)", "Water conduction.", "Gymnosperms lack vessels (except Gnetum); angiosperms have vessels.", tag="PYQ favourite"),
F("Phloem elements", "sieve tubes + companion cells (angiosperms), phloem parenchyma, phloem fibres (only dead part)", "Food conduction.", "Gymnosperms have albuminous cells and sieve cells instead of sieve tubes and companion cells."),
F("Protoxylem position", "exarch (protoxylem towards periphery — roots);  endarch (protoxylem towards centre — stems)", "Root vs stem.", None, tag="PYQ favourite"),
F("Vascular bundles", "radial (xylem and phloem on different radii — roots);  conjoint collateral open (with cambium — dicot stem);  conjoint closed (no cambium — monocot stem and leaves)", "Types of vascular bundle."),
F("Dicot vs monocot root", "dicot: 2–4 xylem bundles (diarch–tetrarch), small pith, secondary growth;  monocot: more than 6 (polyarch), large pith, no secondary growth", "Root anatomy.", None, tag="PYQ favourite"),
F("Dicot vs monocot stem", "dicot: vascular bundles in a ring, open, endodermis (starch sheath), hypodermis collenchyma;  monocot: scattered bundles, closed, sclerenchymatous bundle sheath, water-containing cavities, hypodermis sclerenchyma, no pith/cortex distinction", "Stem anatomy."),
F("Dorsiventral vs isobilateral leaf", "dicot: palisade + spongy mesophyll, more stomata on lower surface;  monocot: undifferentiated mesophyll, stomata equal on both surfaces, bulliform cells", "Leaf anatomy.", "Bulliform cells lose water and make grass leaves curl to reduce water loss."),
F("Stomata", "dicot: bean-shaped guard cells;  grasses: dumb-bell-shaped guard cells;  stomatal apparatus = pore + guard cells + subsidiary cells", "Epidermal tissue system."),
F("Secondary growth outputs", "vascular cambium → secondary xylem (inside) + secondary phloem (outside);  cork cambium (phellogen) → cork (phellem, outside) + secondary cortex (phelloderm, inside)", "Increase in girth."),
F("Periderm and bark", "periderm = phellem + phellogen + phelloderm;  bark = all tissues outside the vascular cambium (including secondary phloem)", "Bark questions.", None, tag="PYQ favourite"),
F("Annual rings", "spring/early wood: lighter, wide vessels;  autumn/late wood: darker, narrow vessels;  one light + one dark band = one year", "Dendrochronology (estimating the age of a tree)."),
],
"examples": [
X("Root or stem section?", "A section shows radial bundles with exarch xylem and a pericycle. Root or stem?",
  "Root — radial bundles and exarch protoxylem are root features (stems have conjoint bundles with endarch protoxylem).", []),
X("Monocot stem", "List three features that identify a monocot stem in a T.S.",
  "Scattered vascular bundles, each with a sclerenchymatous bundle sheath; bundles conjoint and closed; peripheral bundles smaller than central ones; water-containing cavities; no clear pith.", []),
X("Heartwood vs sapwood", "Which part of an old trunk conducts water?",
  "Sapwood (alburnum) — the outer, light-coloured secondary xylem. Heartwood (duramen) is dark, filled with tannins, resins, oils and gums, and is non-conducting but strong.", []),
X("Living cells in xylem", "Which element of xylem is alive?",
  "Xylem parenchyma. Tracheids, vessels and xylem fibres are dead at maturity.", []),
X("Bark components", "Is secondary phloem a part of the bark?",
  "Yes. Bark includes every tissue outside the vascular cambium: secondary phloem, phelloderm, phellogen and phellem.", []),
X("Grass leaf curling", "Why do grass leaves roll up on a hot dry day?",
  "Bulliform cells on the upper epidermis lose turgor and shrink, making the leaf roll inwards and reducing exposed surface and water loss.", []),
],
"topics": [
T("Epidermal tissue system", "Epidermis (usually single layer, covered by a waxy cuticle — absent in roots), stomata, and appendages: root hairs (unicellular extensions of epidermal cells) and trichomes on stems (usually multicellular, branched or unbranched, may be secretory)."),
T("Ground tissue system", "All tissues except epidermis and vascular bundles: cortex, pericycle, pith and medullary rays in stems and roots; mesophyll in leaves."),
T("Endodermis and Casparian strips", "The innermost cortical layer of roots; its cells have Casparian strips of water-impermeable suberin on radial and inner tangential walls, forcing water to pass through living cells."),
T("Formation of the cambial ring", "In dicot stems, intrafascicular cambium (within bundles) joins with interfascicular cambium (from medullary ray cells) to form a complete ring. Cambium is more active on the inner side, so more secondary xylem than phloem forms."),
T("Lenticels", "Lens-shaped openings in the bark where phellogen forms loosely packed complementary cells instead of cork; they permit gas exchange between the outer atmosphere and inner tissues."),
T("Secondary growth in roots", "The vascular cambium in dicot roots arises partly from conjunctive tissue below the phloem and partly from the pericycle opposite the protoxylem, forming a wavy ring that later becomes circular."),
],
"ratta": [
"Xylem: only parenchyma living;  phloem: only fibres dead.",
"Root: radial, exarch;  stem: conjoint, endarch.",
"Dicot root 2–4 bundles; monocot root more than 6.",
"Dicot stem: ring, open;  monocot stem: scattered, closed.",
"Bulliform cells — grasses curl.",
"Bark = everything outside vascular cambium.",
"Heartwood non-conducting;  sapwood conducts.",
],
}

SYLLABUS = [
("Anatomy and functions of tissues and tissue systems in dicots and monocots", ["tissue system", "dicot", "monocot"]),
("Meristematic and permanent tissues", ["meristem", "permanent"]),
("Secondary growth", ["secondary growth", "cork cambium", "annual rings"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Plant tissues meristematic (meristem — divide hone wale) ya permanent hote hain (simple: parenchyma, collenchyma, sclerenchyma; complex: xylem aur phloem).",
"Tissues teen tissue system mein organised hain: epidermal, ground (fundamental) aur vascular.",
"Dicot aur monocot ki roots, stems aur leaves ki andar ki structure alag hai — vascular bundles ki sankhya aur arrangement hi key hai.",
"Secondary growth (vascular cambium aur cork cambium) dicots aur gymnosperms mein girth badhaati hai, jisse annual rings, heartwood, sapwood aur bark bante hain.",
],
when=[
("Meristem ke types.", None),
("Simple tissues compare karna.", None),
("Paani ka conduction.", "Gymnosperms mein vessels nahi hote (Gnetum ke alawa); angiosperms mein hote hain — confuse mat karna."),
("Food ka conduction.", "Gymnosperms mein sieve tubes aur companion cells ki jagah albuminous cells aur sieve cells hote hain — dhyan rakho."),
("Root vs stem.", None),
("Vascular bundle ke types.", None),
("Root anatomy.", None),
("Stem anatomy.", None),
("Leaf anatomy.", "Bulliform cells paani kho kar grass leaves ko mod dete hain, jisse paani ka nuksaan kam hota hai."),
("Epidermal tissue system.", None),
("Girth ka badhna.", None),
("Bark ke sawal.", None),
("Dendrochronology (ped ki umar ka andaza).", None),
],
examples=[
("Root ya stem ka section?", "Section mein radial bundles, exarch xylem aur pericycle dikh rahe hain. Root hai ya stem?",
 "Root — radial bundles aur exarch protoxylem root ke features hain (stems mein conjoint bundles aur endarch protoxylem)."),
("Monocot stem", "T.S. mein monocot stem pehchaanne ke teen features batao.",
 "Bikhre hue vascular bundles, har ek ke saath sclerenchymatous bundle sheath; bundles conjoint aur closed; kinaare wale bundles beech walon se chhote; paani wali cavities; saaf pith nahi."),
("Heartwood vs sapwood", "Purane tane ka kaunsa hissa paani le jaata hai?",
 "Sapwood (alburnum) — bahar ka halke rang ka secondary xylem. Heartwood (duramen) gaadha hai, tannins, resins, oils aur gums se bhara, conducting nahi par mazboot."),
("Xylem mein living cells", "Xylem ka kaunsa element zinda hai?",
 "Xylem parenchyma. Tracheids, vessels aur xylem fibres maturity par dead hote hain."),
("Bark ke components", "Kya secondary phloem bark ka hissa hai?",
 "Haan. Bark mein vascular cambium ke bahar ke saare tissues aate hain: secondary phloem, phelloderm, phellogen aur phellem."),
("Grass leaf ka mudna", "Garam sookhe din grass ki leaves kyun lipat jaati hain?",
 "Upper epidermis ke bulliform cells turgor kho kar sikud jaate hain, leaf andar ki taraf lipat jaati hai aur khula surface aur paani ka nuksaan kam hota hai."),
],
topics=[
("Epidermal tissue system", "Epidermis (aam taur par ek layer, waxy cuticle se dhaki — roots mein cuticle nahi), stomata, aur appendages: root hairs (epidermal cells ke unicellular extensions) aur stems par trichomes (aam taur par multicellular, branched ya unbranched, secretory bhi ho sakte)."),
("Ground tissue system", "Epidermis aur vascular bundles ke alawa saare tissues: stems aur roots mein cortex, pericycle, pith aur medullary rays; leaves mein mesophyll."),
("Endodermis and Casparian strips", "Roots ki sabse andar wali cortical layer; iske cells ki radial aur inner tangential walls par paani na jaane dene wale suberin ki Casparian strips hoti hain, jisse paani ko living cells se hi guzarna padta hai."),
("Formation of the cambial ring", "Dicot stems mein intrafascicular cambium (bundles ke andar) interfascicular cambium (medullary ray cells se) ke saath judkar poora ring banata hai. Cambium andar ki taraf zyada active hai, isliye phloem se zyada secondary xylem banta hai."),
("Lenticels", "Bark mein lens jaise openings jahan phellogen cork ki jagah dheele packed complementary cells banata hai; inse bahar ki hawa aur andar ke tissues ke beech gas exchange hota hai."),
("Secondary growth in roots", "Dicot roots mein vascular cambium kuch phloem ke neeche ke conjunctive tissue se aur kuch protoxylem ke saamne wale pericycle se banta hai; pehle lehardaar ring banti hai jo baad mein gol ho jaati hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
