from lib import F, X, T, sig, fx, _check_and_write

total_bones = 80 + 126
axial = 22 + 1 + 6 + 26 + 1 + 24
DOC = {
"slug": "locomotion-and-movement", "subject": "Biology",
"chapters": {"NEET": "Locomotion and Movement"},
"title": "Locomotion and Movement", "readMinutes": 13,
"summary": [
"Cells show three types of movement: amoeboid (pseudopodia — macrophages, leucocytes), ciliary (trachea, fallopian tubes) and muscular (limbs, jaws, tongue). Locomotion is a voluntary movement that changes location.",
"Skeletal muscle is made of fibres with repeating sarcomeres (actin thin filaments and myosin thick filaments). The sliding filament theory explains contraction, triggered by Ca²⁺ and powered by ATP.",
"The human skeleton has 206 bones: axial (80) and appendicular (126). Joints are fibrous, cartilaginous or synovial.",
"Disorders of muscles and bones include myasthenia gravis, muscular dystrophy, tetany, arthritis, osteoporosis and gout.",
],
"formulas": [
F("Sarcomere", "functional unit of contraction = between two successive Z lines;  I band (light, actin only) and A band (dark, myosin);  H zone (centre of A band, no overlap);  M line holds thick filaments", "Muscle fibre structure.", None, tag="PYQ favourite"),
F("Changes during contraction", "I band shortens, H zone shortens/disappears, A band length stays the same, sarcomere shortens", "Sliding filament theory.", "The filaments don't shorten — they slide over each other.", tag="PYQ favourite"),
F("Contractile proteins", "actin (thin filament) + tropomyosin + troponin;  myosin (thick filament — meromyosin: heavy (head, with ATPase, actin binding site) and light (tail))", "Proteins of myofilaments."),
F("Excitation–contraction", "motor neuron releases acetylcholine at the neuromuscular junction → action potential → Ca²⁺ released from sarcoplasmic reticulum → Ca²⁺ binds troponin → myosin binding sites on actin exposed → cross-bridge → power stroke (ATP hydrolysis)", "Steps of muscle contraction."),
F("Red vs white fibres", "red: much myoglobin and mitochondria, aerobic;  white: little myoglobin, fewer mitochondria, many sarcoplasmic reticulum, anaerobic", "Types of muscle fibres."),
F("Skeleton count", "total 206 = axial 80 + appendicular 126", "Bone counts.", None, tag="PYQ favourite"),
F("Axial skeleton", "skull 22 (cranial 8 + facial 14) + hyoid 1 + ear ossicles 6 + vertebral column 26 + sternum 1 + ribs 24 (12 pairs)", "Axial bone counts."),
F("Vertebral column", "cervical 7 + thoracic 12 + lumbar 5 + sacral 1 (fused) + coccygeal 1 (fused) = 26", "Vertebral counts.", "Almost all mammals, including giraffes and humans, have 7 cervical vertebrae."),
F("Ribs", "true ribs: pairs 1–7 (attached to sternum directly);  false ribs (vertebrochondral): pairs 8–10 (joined to the 7th rib's cartilage);  floating ribs: pairs 11–12", "Rib classification."),
F("Appendicular skeleton", "each limb 30 bones;  forelimb: humerus, radius, ulna, 8 carpals, 5 metacarpals, 14 phalanges;  hind limb: femur (longest), tibia, fibula, 7 tarsals, 5 metatarsals, 14 phalanges, patella;  pectoral girdle: clavicle + scapula;  pelvic girdle: coxal bones (ilium, ischium, pubis)", "Limb and girdle bones."),
F("Joints", "fibrous (immovable — skull sutures);  cartilaginous (limited movement — between vertebrae);  synovial (free movement): ball and socket (humerus–pectoral girdle), hinge (knee), pivot (atlas–axis), gliding (carpals), saddle (carpal–metacarpal of thumb)", "Classifying joints.", None, tag="PYQ favourite"),
F("Muscle and bone disorders", "myasthenia gravis (autoimmune, affects neuromuscular junction);  muscular dystrophy (genetic degeneration);  tetany (low Ca²⁺ → rapid spasms);  arthritis (joint inflammation);  osteoporosis (age, low oestrogen — bone mass falls);  gout (uric acid crystals in joints)", "Disorders."),
],
"examples": [
X("Total bones", "Axial skeleton has 80 bones and appendicular 126. Total?",
  f"80 + 126 = {total_bones}.", [(str(total_bones), "206")]),
X("Axial count check", "Add skull (22), hyoid (1), ear ossicles (6), vertebrae (26), sternum (1) and ribs (24).",
  f"22 + 1 + 6 + 26 + 1 + 24 = {axial} — the axial skeleton.", [(str(axial), "80")]),
X("Band changes", "During contraction, which band stays the same length?",
  "The A band (length of thick myosin filaments). I band and H zone shorten as actin slides inwards.", []),
X("Role of calcium", "What does Ca²⁺ do in muscle contraction?",
  "It binds troponin, which shifts tropomyosin and uncovers the myosin-binding sites on actin, allowing cross-bridges to form.", []),
X("Fatigue", "Why do muscles get fatigued after repeated contraction?",
  "Anaerobic breakdown of glycogen accumulates lactic acid in the muscle.", []),
X("Joint type", "Which joint is between atlas and axis, and what movement does it allow?",
  "A pivot joint — it allows rotation of the head (saying 'no').", []),
],
"topics": [
T("Types of muscle", "Skeletal (striated, voluntary — locomotion and posture), visceral/smooth (non-striated, involuntary — in walls of gut, reproductive tract), cardiac (striated, involuntary, branched)."),
T("Structure of skeletal muscle", "Muscle bundles (fascicles) held by fascia; each muscle fibre is a syncytium with sarcolemma, sarcoplasm and sarcoplasmic reticulum (Ca²⁺ store). Myofibrils show alternate dark (anisotropic, A) and light (isotropic, I) bands."),
T("Cross-bridge cycle", "The myosin head with ADP + Pi binds actin, releases them in a power stroke pulling actin towards the centre; a new ATP releases the head, ATP is hydrolysed and the head is re-cocked. When Ca²⁺ is pumped back, the sites are masked again and the muscle relaxes."),
T("Skull", "Cranium has 8 bones (protects the brain); face has 14 bones. Hyoid is U-shaped at the base of the buccal cavity. The skull joins the vertebral column through two occipital condyles (dicondylic skull)."),
T("Vertebral column and sternum", "The first vertebra is the atlas, which articulates with the occipital condyles. The column protects the spinal cord, supports the head and attaches ribs and back muscles. The sternum is a flat bone on the ventral midline of the thorax."),
T("Girdles", "Pectoral girdle: clavicle (collar bone) and scapula (with glenoid cavity for the head of the humerus, acromion process). Pelvic girdle: two coxal bones, each formed by fusion of ilium, ischium and pubis; the acetabulum receives the thigh bone; the two halves meet at the pubic symphysis."),
],
"ratta": [
"A band constant; I band & H zone shorten.",
"Ca²⁺ binds troponin;  ACh at neuromuscular junction.",
"206 = 80 axial + 126 appendicular.",
"Vertebrae 7-12-5-1-1 = 26.",
"True ribs 7, false 3, floating 2 pairs.",
"Pivot: atlas–axis;  hinge: knee;  saddle: thumb;  ball-socket: shoulder.",
"Gout = uric acid;  tetany = low Ca²⁺;  myasthenia = autoimmune.",
],
}

SYLLABUS = [
("Types of movement — ciliary, flagellar, muscular", ["amoeboid", "ciliary", "muscular"]),
("Skeletal muscle — contractile proteins and muscle contraction", ["actin", "myosin", "sliding filament"]),
("Skeletal system and its functions; joints", ["skeleton", "joint"]),
("Disorders of muscular and skeletal system — myasthenia gravis, tetany, muscular dystrophy, arthritis, osteoporosis, gout", ["myasthenia gravis", "tetany", "muscular dystrophy", "arthritis", "osteoporosis", "gout"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
