from lib import F, X, T, sig, fx, build

TV, IRV, ERV, RV = 500, 3000, 1100, 1200
IC = TV + IRV; EC = TV + ERV; FRC = ERV + RV; VC = TV + IRV + ERV; TLC = VC + RV
PV = TV * 12
O2_del = 5 * 50   # 5 mL per 100 mL × 5000 mL/min cardiac output → 250 mL/min

DOC = {
"slug": "breathing-and-exchange-of-gases", "subject": "Biology", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Breathing and Exchange of Gases"},
"title": "Breathing and Exchange of Gases", "readMinutes": 14,
"summary": [
"Breathing (ventilation) mein atmospheric air andar lete hain aur CO₂-rich hawa bahar chhodte hain. Respiration mein iske baad alveoli mein gas exchange, blood se gas transport, tissues mein exchange aur cells mein O₂ ka use aata hai.",
"Inspiration active process hai — diaphragm aur external intercostal muscles contract karke thoracic volume badhaate hain, pressure atmosphere se kam hota hai aur hawa andar aati hai. Normal expiration passive hai.",
"Gas exchange simple diffusion se hota hai — partial pressure gradient, solubility aur membrane ki motai par depend karta hai. CO₂ ki solubility O₂ se 20–25 guna zyada hai.",
"Lagbhag 97% O₂ haemoglobin se (oxyhaemoglobin) aur 3% plasma mein ghul kar jaata hai. CO₂ ka 20–25% carbamino-haemoglobin, ~70% bicarbonate aur ~7% plasma mein dissolved. Breathing ka rhythm medulla ka respiratory rhythm centre banata hai.",
],
"formulas": [
F("Respiratory volumes", "TV ≈ 500 mL;  IRV 2500–3000 mL;  ERV 1000–1100 mL;  RV 1100–1200 mL", "Spirometer wale sawal.", "RV kabhi bahar nahi nikalta — isliye spirometer RV aur TLC seedha nahi naap sakta.", None, "PYQ favourite"),
F("Inspiratory capacity", "IC = TV + IRV", "Normal expiration ke baad kitni hawa andar ja sakti hai."),
F("Expiratory capacity", "EC = TV + ERV", "Normal inspiration ke baad kitni hawa bahar nikal sakti hai."),
F("Functional residual capacity", "FRC = ERV + RV", "Normal expiration ke baad lungs mein bachi hawa."),
F("Vital capacity", "VC = ERV + TV + IRV", "Forced inspiration ke baad max kitni hawa nikal sakti hai.", "VC mein RV shaamil nahi.", None, "PYQ favourite"),
F("Total lung capacity", "TLC = RV + ERV + TV + IRV = VC + RV", "Forced inspiration ke baad lungs mein total hawa."),
F("Pulmonary ventilation", "minute volume = TV × breathing rate ≈ 500 × 12–16 = 6000–8000 mL/min", "Ek minute mein kitni hawa.", "Healthy adult 12–16 baar per minute saans leta hai."),
F("Partial pressures (mm Hg)", "pO₂ / pCO₂:  atmosphere 159 / 0.3;  alveoli 104 / 40;  deoxygenated blood 40 / 45;  oxygenated blood 95 / 40;  tissues 40 / 45", "Diffusion ki direction.", "Gas hamesha zyada partial pressure se kam ki taraf jaati hai.", None, "PYQ favourite"),
F("Diffusion membrane", "alveolar squamous epithelium + basement substance + capillary endothelium (total < 1 mm)", "Exchange kahan hota hai.", None),
F("Oxygen transport", "97% Hb (oxyhaemoglobin, har Hb max 4 O₂);  3% plasma;  100 mL oxygenated blood tissues ko ~5 mL O₂ deta hai", "O₂ kaise jaati hai.", None, None, "PYQ favourite"),
F("Oxygen dissociation curve", "% saturation vs pO₂ — sigmoid curve;  alveoli mein high pO₂, low pCO₂, low H⁺, low T ⇒ oxyhaemoglobin banta hai;  tissues mein ulta ⇒ O₂ chhoot-ta hai", "Hb kab O₂ leta/chhodta hai.", "Curve right shift (Bohr effect) = O₂ aasaani se chhodta hai."),
F("CO₂ transport", "20–25% carbamino-haemoglobin;  ~70% bicarbonate (HCO₃⁻);  ~7% dissolved in plasma;  100 mL deoxygenated blood alveoli ko ~4 mL CO₂ deta hai", "CO₂ kaise jaati hai."),
F("Carbonic anhydrase reaction", "CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺   (RBCs mein carbonic anhydrase, kuch plasma mein bhi)", "Bicarbonate ka banna.", "Tissues mein reaction aage, alveoli mein peeche jaati hai."),
F("Regulation of respiration", "respiratory rhythm centre (medulla);  pneumotaxic centre (pons) — inspiration ki duration kam karke rate badhata hai;  chemosensitive area (medulla) — CO₂ aur H⁺ ke prati;  aortic arch aur carotid artery receptors", "Breathing ka control.", "O₂ ka role rhythm mein bahut kam hai; CO₂/H⁺ main signal hain."),
],
"examples": [
X("Capacities nikaalo", "TV 500, IRV 3000, ERV 1100, RV 1200 mL. IC, EC, FRC?",
  f"IC = 500 + 3000 = {IC} mL. EC = 500 + 1100 = {EC} mL. FRC = 1100 + 1200 = {FRC} mL.", [(str(IC), "3500"), (str(EC), "1600"), (str(FRC), "2300")]),
X("Vital capacity aur TLC", "Upar ke values se VC aur TLC?",
  f"VC = 1100 + 500 + 3000 = {VC} mL. TLC = VC + RV = {TLC} mL.", [(str(VC), "4600"), (str(TLC), "5800")]),
X("Minute ventilation", "TV 500 mL, rate 12 per minute. Pulmonary ventilation?",
  f"500 × 12 = {PV} mL/min.", [(str(PV), "6000")]),
X("O₂ delivery", "Cardiac output 5 L/min; har 100 mL blood ~5 mL O₂ deta hai. Tissues ko per minute kitni O₂?",
  f"5000/100 × 5 = {O2_del} mL O₂ per minute.", [(str(O2_del), "250")]),
X("Diffusion ki direction", "Alveoli (pO₂ 104, pCO₂ 40) aur deoxygenated blood (pO₂ 40, pCO₂ 45) ke beech gas kis taraf jaayegi?",
  "O₂ alveoli se blood mein (104 → 40), CO₂ blood se alveoli mein (45 → 40). CO₂ ka gradient chhota hai par solubility 20–25 guna zyada hone se kaafi CO₂ diffuse ho jaata hai.", []),
X("Emphysema", "Emphysema mein saans lene mein dikkat kyun?",
  "Alveolar walls damage ho jaati hain, respiratory surface kam ho jaata hai — cigarette smoking iska main kaaran hai.", []),
],
"topics": [
T("Respiratory organs in animals", "Lower invertebrates (sponges, coelenterates, flatworms) — body surface se simple diffusion. Earthworm — moist cuticle. Insects — tracheal tubes. Aquatic arthropods aur molluscs — gills (branchial respiration). Fish — gills. Amphibians — skin (cutaneous) aur lungs. Reptiles, birds, mammals — lungs (pulmonary respiration)."),
T("Human respiratory system", "External nostrils → nasal chamber → pharynx → larynx (sound box; epiglottis khana andar jaane se rokta hai) → trachea → primary, secondary, tertiary bronchi → bronchioles → alveoli. Trachea se initial bronchioles tak incomplete cartilaginous rings support dete hain. Lungs double-layered pleura se dhake; pleural fluid friction kam karta hai. Conducting part hawa ko filter, garam aur nam karta hai; exchange part alveoli hai."),
T("Mechanism of breathing", "Inspiration: diaphragm contract (neeche) aur external intercostal muscles contract (ribs aur sternum upar) ⇒ thoracic aur pulmonary volume badhe ⇒ intra-pulmonary pressure atmosphere se kam ⇒ hawa andar. Expiration: muscles relax ⇒ volume ghate ⇒ pressure zyada ⇒ hawa bahar. Abdominal muscles se forced breathing hoti hai."),
T("Exchange of gases", "Alveoli primary site, tissues secondary. Diffusion ko partial pressure gradient, gas ki solubility aur membrane ki thickness affect karti hai. Diffusion membrane bahut patli (< 1 mm) hai."),
T("Transport of gases", "Haemoglobin (RBCs ka red iron pigment) O₂ ko reversibly bind karta hai. CO₂ zyada pCO₂ par Hb se carbamino-haemoglobin banata hai aur alveoli mein chhod deta hai. RBCs mein carbonic anhydrase bicarbonate banata hai."),
T("Disorders of respiratory system", "Asthma: bronchi aur bronchioles mein inflammation se wheezing aur saans lene mein dikkat. Emphysema: chronic disorder, alveolar walls damage, respiratory surface kam — main kaaran smoking. Occupational respiratory disorders: dhool (stone breaking, grinding) se lung fibrosis — protective masks pehenne chahiye."),
],
"ratta": [
"TV 500, IRV 2500–3000, ERV 1000–1100, RV 1100–1200 mL.",
"IC = TV + IRV;  EC = TV + ERV;  FRC = ERV + RV;  VC = ERV + TV + IRV;  TLC = VC + RV.",
"Alveoli pO₂ 104, pCO₂ 40;  tissues pO₂ 40, pCO₂ 45.",
"CO₂ solubility 20–25 × O₂.",
"O₂: 97% Hb, 3% plasma;  100 mL blood → 5 mL O₂.",
"CO₂: 20–25% carbamino, 70% HCO₃⁻, 7% plasma;  4 mL per 100 mL.",
"Rhythm centre medulla;  pneumotaxic centre pons.",
"Emphysema — smoking;  asthma — inflammation of bronchi.",
],
}

DOC_EN = {
"slug": "breathing-and-exchange-of-gases", "subject": "Biology", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Breathing and Exchange of Gases"},
"title": "Breathing and Exchange of Gases", "readMinutes": 14,
"summary": [
"Breathing (ventilation) draws in atmospheric air and releases CO₂-rich air. Respiration then includes gas exchange in the alveoli, transport of gases by blood, exchange at the tissues and use of O₂ by cells.",
"Inspiration is active — contraction of the diaphragm and external intercostal muscles increases thoracic volume, pressure drops below atmospheric and air flows in. Normal expiration is passive.",
"Gas exchange is by simple diffusion and depends on the partial pressure gradient, solubility and membrane thickness. CO₂ is 20–25 times more soluble than O₂.",
"About 97% of O₂ travels bound to haemoglobin (oxyhaemoglobin) and 3% dissolved in plasma. Of CO₂, 20–25% goes as carbamino-haemoglobin, ~70% as bicarbonate and ~7% dissolved in plasma. The respiratory rhythm centre in the medulla sets the rhythm of breathing.",
],
"formulas": [
F("Respiratory volumes", "TV ≈ 500 mL;  IRV 2500–3000 mL;  ERV 1000–1100 mL;  RV 1100–1200 mL", "Spirometer questions.", "RV can never be breathed out — so a spirometer cannot measure RV or TLC directly.", None, "PYQ favourite"),
F("Inspiratory capacity", "IC = TV + IRV", "Air that can be inhaled after a normal expiration."),
F("Expiratory capacity", "EC = TV + ERV", "Air that can be exhaled after a normal inspiration."),
F("Functional residual capacity", "FRC = ERV + RV", "Air left in the lungs after a normal expiration."),
F("Vital capacity", "VC = ERV + TV + IRV", "Maximum air breathed out after a forced inspiration.", "VC does not include RV.", None, "PYQ favourite"),
F("Total lung capacity", "TLC = RV + ERV + TV + IRV = VC + RV", "Total air in the lungs after a forced inspiration."),
F("Pulmonary ventilation", "minute volume = TV × breathing rate ≈ 500 × 12–16 = 6000–8000 mL/min", "Air breathed per minute.", "A healthy adult breathes 12–16 times a minute."),
F("Partial pressures (mm Hg)", "pO₂ / pCO₂:  atmosphere 159 / 0.3;  alveoli 104 / 40;  deoxygenated blood 40 / 45;  oxygenated blood 95 / 40;  tissues 40 / 45", "Direction of diffusion.", "A gas always moves from higher to lower partial pressure.", None, "PYQ favourite"),
F("Diffusion membrane", "alveolar squamous epithelium + basement substance + capillary endothelium (total < 1 mm)", "Where exchange takes place.", None),
F("Oxygen transport", "97% by Hb (oxyhaemoglobin, each Hb up to 4 O₂);  3% in plasma;  100 mL of oxygenated blood delivers ~5 mL O₂ to tissues", "How O₂ is carried.", None, None, "PYQ favourite"),
F("Oxygen dissociation curve", "% saturation vs pO₂ — sigmoid curve;  in alveoli high pO₂, low pCO₂, low H⁺, low T ⇒ oxyhaemoglobin forms;  in tissues the reverse ⇒ O₂ is released", "When Hb takes up or releases O₂.", "A right shift (Bohr effect) means O₂ is released more easily."),
F("CO₂ transport", "20–25% carbamino-haemoglobin;  ~70% bicarbonate (HCO₃⁻);  ~7% dissolved in plasma;  100 mL of deoxygenated blood delivers ~4 mL CO₂ to the alveoli", "How CO₂ is carried."),
F("Carbonic anhydrase reaction", "CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺   (carbonic anhydrase in RBCs, a little in plasma)", "Formation of bicarbonate.", "The reaction goes forward in tissues and backward in the alveoli."),
F("Regulation of respiration", "respiratory rhythm centre (medulla);  pneumotaxic centre (pons) — shortens inspiration and so raises the rate;  chemosensitive area (medulla) — sensitive to CO₂ and H⁺;  receptors in the aortic arch and carotid artery", "Control of breathing.", "O₂ plays only a small role in the rhythm; CO₂/H⁺ are the main signals."),
],
"examples": [
X("Finding capacities", "TV 500, IRV 3000, ERV 1100, RV 1200 mL. IC, EC, FRC?",
  f"IC = 500 + 3000 = {IC} mL. EC = 500 + 1100 = {EC} mL. FRC = 1100 + 1200 = {FRC} mL.", [(str(IC), "3500"), (str(EC), "1600"), (str(FRC), "2300")]),
X("Vital capacity and TLC", "From the values above, VC and TLC?",
  f"VC = 1100 + 500 + 3000 = {VC} mL. TLC = VC + RV = {TLC} mL.", [(str(VC), "4600"), (str(TLC), "5800")]),
X("Minute ventilation", "TV 500 mL, rate 12 per minute. Pulmonary ventilation?",
  f"500 × 12 = {PV} mL/min.", [(str(PV), "6000")]),
X("O₂ delivery", "Cardiac output is 5 L/min and each 100 mL of blood delivers ~5 mL O₂. O₂ delivered to tissues per minute?",
  f"5000/100 × 5 = {O2_del} mL O₂ per minute.", [(str(O2_del), "250")]),
X("Direction of diffusion", "Between alveoli (pO₂ 104, pCO₂ 40) and deoxygenated blood (pO₂ 40, pCO₂ 45), which way do the gases move?",
  "O₂ moves from alveoli to blood (104 → 40), CO₂ from blood to alveoli (45 → 40). The CO₂ gradient is small, but its 20–25 times higher solubility lets plenty of CO₂ diffuse.", []),
X("Emphysema", "Why is breathing difficult in emphysema?",
  "Alveolar walls are damaged and the respiratory surface decreases — cigarette smoking is the main cause.", []),
],
"topics": [
T("Respiratory organs in animals", "Lower invertebrates (sponges, coelenterates, flatworms) — simple diffusion over the body surface. Earthworm — moist cuticle. Insects — tracheal tubes. Aquatic arthropods and molluscs — gills (branchial respiration). Fish — gills. Amphibians — skin (cutaneous) and lungs. Reptiles, birds, mammals — lungs (pulmonary respiration)."),
T("Human respiratory system", "External nostrils → nasal chamber → pharynx → larynx (sound box; the epiglottis stops food entering) → trachea → primary, secondary, tertiary bronchi → bronchioles → alveoli. Incomplete cartilaginous rings support the trachea to the initial bronchioles. Lungs are covered by double-layered pleura; pleural fluid reduces friction. The conducting part filters, warms and moistens air; the exchange part is the alveoli."),
T("Mechanism of breathing", "Inspiration: the diaphragm contracts (moves down) and external intercostal muscles contract (lifting ribs and sternum) ⇒ thoracic and pulmonary volume increase ⇒ intra-pulmonary pressure falls below atmospheric ⇒ air flows in. Expiration: muscles relax ⇒ volume falls ⇒ pressure rises ⇒ air flows out. Abdominal muscles help in forced breathing."),
T("Exchange of gases", "Alveoli are the primary site, tissues the secondary site. Diffusion depends on the partial pressure gradient, gas solubility and membrane thickness. The diffusion membrane is very thin (< 1 mm)."),
T("Transport of gases", "Haemoglobin (the red iron pigment of RBCs) binds O₂ reversibly. At high pCO₂, CO₂ binds Hb as carbamino-haemoglobin and is released in the alveoli. Carbonic anhydrase in RBCs forms bicarbonate."),
T("Disorders of respiratory system", "Asthma: inflammation of bronchi and bronchioles causes wheezing and difficulty in breathing. Emphysema: a chronic disorder in which alveolar walls are damaged and respiratory surface decreases — mainly caused by smoking. Occupational respiratory disorders: dust (stone breaking, grinding) causes fibrosis of the lungs — protective masks should be worn."),
],
"ratta": [
"TV 500, IRV 2500–3000, ERV 1000–1100, RV 1100–1200 mL.",
"IC = TV + IRV;  EC = TV + ERV;  FRC = ERV + RV;  VC = ERV + TV + IRV;  TLC = VC + RV.",
"Alveoli pO₂ 104, pCO₂ 40;  tissues pO₂ 40, pCO₂ 45.",
"CO₂ solubility 20–25 × O₂.",
"O₂: 97% Hb, 3% plasma;  100 mL blood → 5 mL O₂.",
"CO₂: 20–25% carbamino, 70% HCO₃⁻, 7% plasma;  4 mL per 100 mL.",
"Rhythm centre in medulla;  pneumotaxic centre in pons.",
"Emphysema — smoking;  asthma — inflammation of bronchi.",
],
}

SYLLABUS = [
("Respiratory organs in animals; respiratory system in humans", ["tracheal", "gills", "alveoli", "trachea"]),
("Mechanism of breathing and its regulation in humans", ["Inspiration", "diaphragm", "intercostal", "Regulation of respiration"]),
("Exchange of gases, transport of gases", ["Exchange of gases", "Oxygen transport", "CO₂ transport"]),
("Respiratory volumes", ["Respiratory volumes", "Vital capacity"]),
("Disorders related to respiration — asthma, emphysema, occupational respiratory disorders", ["Asthma", "Emphysema", "Occupational"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
