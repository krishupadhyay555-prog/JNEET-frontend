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

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
