from lib import F, X, T, sig, fx, _check_and_write

gfr_day = 125 * 60 * 24 / 1000
reab = (gfr_day - 1.5) / gfr_day * 100

DOC = {
"slug": "excretory-products-and-their-elimination", "subject": "Biology",
"chapters": {"NEET": "Excretory Products and Their Elimination"},
"title": "Excretory Products and Their Elimination", "readMinutes": 14,
"summary": [
"Animals excrete nitrogenous waste as ammonia (ammonotelic — most toxic, needs much water), urea (ureotelic) or uric acid (uricotelic — least toxic, little water).",
"Humans have a pair of kidneys, each with about one million nephrons. A nephron has a glomerulus and Bowman's capsule (Malpighian body) and a tubule: PCT, loop of Henle, DCT, collecting duct.",
"Urine forms by glomerular filtration, tubular reabsorption and secretion. The counter-current mechanism (loop of Henle + vasa recta) concentrates urine.",
"Kidney function is regulated by ADH, the renin–angiotensin–aldosterone system and ANF. Lungs, liver and skin also help excretion.",
],
"formulas": [
F("Modes of excretion", "ammonotelic: bony fish, aquatic amphibians, aquatic insects;  ureotelic: mammals, many terrestrial amphibians, marine fish;  uricotelic: reptiles, birds, land snails, insects", "Matching animals to waste type.", None, tag="PYQ favourite"),
F("Excretory structures", "protonephridia/flame cells (Platyhelminthes, Amphioxus);  nephridia (annelids);  Malpighian tubules (insects);  antennal/green glands (prawns);  kidneys (vertebrates)", "Excretory organs across animals."),
F("Glomerular filtration rate", "GFR ≈ 125 mL/min ≈ 180 L/day;  urine ≈ 1–1.5 L/day → ~99% of filtrate is reabsorbed", "Filtration calculations.", None, tag="PYQ favourite"),
F("Filtration membrane", "endothelium of glomerular blood vessels + basement membrane + epithelium of Bowman's capsule (podocytes with filtration slits)", "Ultrafiltration — everything except proteins and cells passes."),
F("Tubule functions", "PCT: reabsorbs 70–80% of electrolytes and water, all glucose and amino acids; secretes H⁺, NH₃, K⁺ (pH balance);  descending limb: permeable to water, not electrolytes;  ascending limb: impermeable to water, transports electrolytes;  DCT: conditional reabsorption of Na⁺ and water, HCO₃⁻ reabsorption;  collecting duct: large water reabsorption, allows some urea to pass into the medulla", "Which part does what.", None, tag="PYQ favourite"),
F("Counter-current mechanism", "opposite flow in limbs of Henle's loop and vasa recta → medullary osmolarity rises from 300 to about 1200 mOsmolL⁻¹ (NaCl + urea)", "Concentrating urine.", "Human urine can be nearly four times more concentrated than the filtrate."),
F("ADH (vasopressin)", "released from neurohypophysis when body fluid volume falls → more water reabsorbed from DCT and collecting duct;  deficiency → diabetes insipidus", "Hormonal control of water."),
F("RAAS", "low GFR/BP → JGA releases renin → angiotensinogen → angiotensin I → (ACE) angiotensin II (vasoconstrictor) → aldosterone from adrenal cortex → Na⁺ and water reabsorption → BP and GFR rise", "Renin–angiotensin mechanism.", None, tag="PYQ favourite"),
F("ANF (atrial natriuretic factor)", "released when blood pressure/volume rises → vasodilation → lowers BP;  acts as a check on RAAS", "Opposite of RAAS."),
F("Micturition", "urinary bladder stretches → stretch receptors → CNS → contraction of bladder smooth muscle and relaxation of urethral sphincter (micturition reflex)", "Release of urine."),
F("Abnormal urine tests", "glycosuria (glucose) and ketonuria (ketone bodies) indicate diabetes mellitus", "Clinical urine analysis."),
F("Disorders", "uremia (urea builds up — treated by haemodialysis);  renal calculi (kidney stones — crystallised salts, oxalates);  glomerulonephritis (inflammation of glomeruli)", "Kidney disorders."),
],
"examples": [
X("Filtrate per day", "GFR is 125 mL/min. How much filtrate forms per day?",
  f"125 mL × 60 × 24 = 180,000 mL = {fx(gfr_day)} L/day.", [(fx(gfr_day), "180")]),
X("Percentage reabsorbed", "If 1.5 L urine is made from 180 L filtrate, what percentage is reabsorbed?",
  f"(180 − 1.5)/180 × 100 = {fx(reab, 1)}%.", [(fx(reab, 1), "99.2")]),
X("Birds and uric acid", "Why do birds excrete uric acid?",
  "Uric acid is the least toxic and can be excreted as a paste with very little water, saving water and weight — useful for flying animals and for embryos inside shelled eggs.", []),
X("Diabetes insipidus", "A person passes very large amounts of dilute urine with no glucose in it. Likely cause?",
  "Lack of ADH (diabetes insipidus): without ADH, water is not reabsorbed from DCT and collecting ducts.", []),
X("Juxta medullary nephrons", "Which nephrons have a long loop of Henle, and why does it matter?",
  "Juxta medullary nephrons — their long loops run deep into the medulla and, with the vasa recta, build the medullary gradient needed for concentrated urine. Cortical nephrons have short loops.", []),
X("Haemodialysis", "How does an artificial kidney work?",
  "Blood from an artery is cooled, mixed with heparin (anticoagulant) and passed through a dialyser with cellophane tubes in a dialysing fluid like plasma but without nitrogenous wastes; wastes diffuse out and clean blood returns via a vein, with anti-heparin added.", []),
],
"topics": [
T("Human excretory system", "Two kidneys, two ureters, a urinary bladder and a urethra. Kidneys are reddish-brown, bean-shaped, about 10–12 cm long, 5–7 cm wide, 2–3 cm thick, 120–170 g; at the hilum the ureter, blood vessels and nerves enter or leave. Outer cortex, inner medulla with medullary pyramids; renal columns (columns of Bertini) are cortical extensions."),
T("Nephron structure", "Glomerulus: tuft of capillaries formed by the afferent arteriole and drained by the efferent arteriole. Efferent arteriole forms the peritubular capillaries; a minute vessel running parallel to Henle's loop is the vasa recta (reduced or absent in cortical nephrons)."),
T("Juxta glomerular apparatus (JGA)", "A special sensitive region formed by cellular modification in the DCT and afferent arteriole where they contact. It senses a fall in GFR and releases renin."),
T("Role of other organs", "Lungs remove about 200 mL CO₂ per minute and water. Liver secretes bilirubin, biliverdin, cholesterol, degraded steroid hormones, vitamins and drugs in bile. Skin: sweat glands remove NaCl, small amounts of urea and lactic acid (mainly for cooling); sebaceous glands remove sterols, hydrocarbons and waxes."),
T("Kidney transplantation", "The ultimate treatment for acute renal failure; a functioning kidney is taken from a donor, preferably a close relative, to reduce rejection by the immune system."),
T("Urine characteristics", "Light yellow, watery, slightly acidic (pH 6.0); about 25–30 g urea excreted per day on average."),
],
"ratta": [
"Ammonia: bony fish;  urea: mammals;  uric acid: birds, reptiles, insects.",
"GFR 125 mL/min = 180 L/day; ~99% reabsorbed.",
"PCT: all glucose & amino acids;  ascending limb impermeable to water.",
"Medulla gradient: 300 → 1200 mOsmolL⁻¹.",
"ADH ↑ water reabsorption; lack → diabetes insipidus.",
"JGA → renin → angiotensin II → aldosterone.",
"ANF lowers BP (check on RAAS).",
],
}

SYLLABUS = [
("Modes of excretion — ammonotelism, ureotelism, uricotelism", ["ammonotelic", "ureotelic", "uricotelic"]),
("Human excretory system — structure and function; urine formation; osmoregulation", ["kidney", "nephron", "filtration", "reabsorption", "secretion"]),
("Regulation of kidney function — renin–angiotensin, atrial natriuretic factor, ADH and diabetes insipidus", ["renin", "angiotensin", "natriuretic", "ADH", "diabetes insipidus"]),
("Role of other organs in excretion", ["lungs", "liver", "skin"]),
("Disorders — uremia, renal failure, renal calculi, glomerulonephritis; dialysis and artificial kidney, kidney transplant", ["uremia", "renal calculi", "glomerulonephritis", "dialysis", "transplant"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
