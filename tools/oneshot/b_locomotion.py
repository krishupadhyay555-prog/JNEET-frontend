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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Cells teen tarah ki movement dikhate hain: amoeboid (pseudopodia — macrophages, leucocytes), ciliary (trachea, fallopian tubes) aur muscular (limbs, jaws, tongue). Locomotion voluntary movement hai jo jagah badalti hai.",
"Skeletal muscle fibres se bani hai jinmein repeat hone wale sarcomeres hain (actin thin filaments aur myosin thick filaments). Sliding filament theory contraction samjhaati hai, jo Ca²⁺ se trigger aur ATP se powered hai.",
"Human skeleton mein 206 bones: axial (80) aur appendicular (126). Joint fibrous, cartilaginous ya synovial hote hain.",
"Muscles aur bones ke disorders: myasthenia gravis, muscular dystrophy, tetany, arthritis, osteoporosis aur gout.",
],
when=[
("Muscle fibre ki structure.", None),
("Sliding filament theory.", "Filaments chhote nahi hote — ek doosre par slide karte hain; galat mat likhna."),
("Myofilaments ke proteins.", None),
("Muscle contraction ke steps.", None),
("Muscle fibres ke types.", None),
("Bones ki ginti.", None),
("Axial bones ki ginti.", None),
("Vertebrae ki ginti.", "Lagbhag saare mammals, giraffe aur insaan samet, mein 7 cervical vertebrae hote hain."),
("Ribs ka classification.", None),
("Limb aur girdle bones.", None),
("Joints classify karna.", None),
("Disorders.", None),
],
examples=[
("Kul bones", "Axial skeleton mein 80 bones aur appendicular mein 126. Kul?",
 "80 + 126 = ⟨0⟩."),
("Axial ginti check", "Skull (22), hyoid (1), ear ossicles (6), vertebrae (26), sternum (1) aur ribs (24) jodo.",
 "22 + 1 + 6 + 26 + 1 + 24 = ⟨0⟩ — axial skeleton."),
("Bands mein badlaav", "Contraction mein kaunsa band utna hi lamba rehta hai?",
 "A band (moti myosin filaments ki lambai). Actin andar slide hone se I band aur H zone chhote hote hain."),
("Calcium ka role", "Muscle contraction mein Ca²⁺ kya karta hai?",
 "Troponin se judta hai, jo tropomyosin ko khiskaata hai aur actin par myosin-binding sites khol deta hai, jisse cross-bridges ban paate hain."),
("Thakaan", "Baar-baar contraction ke baad muscles thak kyun jaati hain?",
 "Glycogen ke anaerobic breakdown se muscle mein lactic acid jama hota hai."),
("Joint ka type", "Atlas aur axis ke beech kaunsa joint hai, aur kaunsi movement deta hai?",
 "Pivot joint — sir ghumaana (‘na’ kehna)."),
],
topics=[
("Types of muscle", "Skeletal (striated, voluntary — locomotion aur posture), visceral/smooth (non-striated, involuntary — gut, reproductive tract ki walls mein), cardiac (striated, involuntary, branched)."),
("Structure of skeletal muscle", "Muscle bundles (fascicles) fascia se bandhe; har muscle fibre ek syncytium hai jisme sarcolemma, sarcoplasm aur sarcoplasmic reticulum (Ca²⁺ store). Myofibrils mein baari-baari dark (anisotropic, A) aur light (isotropic, I) bands."),
("Cross-bridge cycle", "ADP + Pi wala myosin head actin se judta hai, unhe chhodkar power stroke mein actin ko centre ki taraf kheenchta hai; naya ATP head ko chhudaata hai, ATP hydrolyse hota hai aur head phir taiyaar. Ca²⁺ waapas pump hone par sites phir dhak jaati hain aur muscle relax."),
("Skull", "Cranium mein 8 bones (brain ki raksha); face mein 14 bones. Hyoid U-shaped, buccal cavity ke base par. Skull do occipital condyles se vertebral column se judta hai (dicondylic skull)."),
("Vertebral column and sternum", "Pehla vertebra atlas hai, jo occipital condyles se judta hai. Column spinal cord ki raksha karta, sir ko sahara deta aur ribs aur peeth ki muscles jodta hai. Sternum thorax ki ventral midline par flat bone hai."),
("Girdles", "Pectoral girdle: clavicle (collar bone) aur scapula (humerus ke head ke liye glenoid cavity, acromion process). Pelvic girdle: do coxal bones, har ek ilium, ischium aur pubis ke judne se; acetabulum mein thigh bone fit hoti hai; dono aadhe pubic symphysis par milte hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
