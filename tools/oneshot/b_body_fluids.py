from lib import F, X, T, sig, fx, _check_and_write

sv = 70; hr = 72
co = sv * hr / 1000
cycle = 60 / hr

DOC = {
"slug": "body-fluids-and-circulation", "subject": "Biology",
"chapters": {"NEET": "Body Fluids and Circulation"},
"title": "Body Fluids and Circulation", "readMinutes": 14,
"summary": [
"Blood is a fluid connective tissue: plasma (55%) and formed elements (45%) — RBCs, WBCs and platelets. Lymph is a colourless fluid that drains tissue fluid back into blood and carries fats.",
"ABO and Rh blood groups depend on antigens on RBCs; mismatched transfusion or Rh incompatibility in pregnancy can be dangerous.",
"The human heart has four chambers and double circulation. Its beat is myogenic, started by the SA node (pacemaker), and the cardiac cycle takes about 0.8 s.",
"The ECG records the heart's electrical activity (P, QRS, T). Disorders include hypertension, coronary artery disease, angina and heart failure.",
],
"formulas": [
F("Plasma composition", "90–92% water, 6–8% proteins (fibrinogen — clotting; globulins — defence; albumins — osmotic balance)", "What plasma contains."),
F("Formed elements counts", "RBC 5–5.5 million/mm³;  WBC 6000–8000/mm³;  platelets 1.5–3.5 lakh/mm³;  haemoglobin 12–16 g/100 mL", "Blood counts.", None, tag="PYQ favourite"),
F("RBC facts", "made in red bone marrow; biconcave, no nucleus in most mammals; life span 120 days; destroyed in spleen (graveyard of RBCs)", "Erythrocytes."),
F("WBC percentages", "neutrophils 60–65% (phagocytes);  lymphocytes 20–25% (B, T — immunity);  monocytes 6–8% (phagocytes);  eosinophils 2–3% (allergy, infections);  basophils 0.5–1% (histamine, serotonin, heparin)", "Differential leucocyte count.", None, tag="PYQ favourite"),
F("ABO groups", "A: antigen A, anti-B;  B: antigen B, anti-A;  AB: both antigens, no antibodies (universal recipient);  O: no antigens, both antibodies (universal donor)", "Blood transfusion compatibility."),
F("Rh incompatibility", "Rh⁻ mother + Rh⁺ foetus → mother makes anti-Rh antibodies → affects the next Rh⁺ foetus (erythroblastosis foetalis);  prevented by anti-Rh antibodies to the mother right after the first delivery", "Pregnancy complication.", None, tag="PYQ favourite"),
F("Clotting cascade", "injury → thrombokinase → prothrombin → thrombin (needs Ca²⁺) → fibrinogen → fibrin threads trap blood cells → clot", "Coagulation of blood."),
F("Double circulation", "pulmonary: right ventricle → pulmonary artery → lungs → pulmonary veins → left atrium;  systemic: left ventricle → aorta → body → venae cavae → right atrium", "Human circulation."),
F("Conducting system", "SA node (right upper atrium, 70–75 impulses/min, pacemaker) → AV node → bundle of His → right and left bundle branches → Purkinje fibres", "Origin and spread of heartbeat.", "The heart is myogenic: the impulse starts in the heart muscle itself."),
F("Cardiac cycle", "duration = 60/heart rate ≈ 0.8 s at 72 beats/min;  atrial systole 0.1 s, ventricular systole 0.3 s, joint diastole 0.4 s", "Timing of the heartbeat."),
F("Cardiac output", "cardiac output = stroke volume × heart rate ≈ 70 mL × 72 ≈ 5 L/min", "Blood pumped per minute.", None, tag="PYQ favourite"),
F("Heart sounds", "lub (first): closure of tricuspid and bicuspid (AV) valves;  dub (second): closure of semilunar valves", "Auscultation."),
F("ECG waves", "P: atrial depolarisation;  QRS: ventricular depolarisation (start of ventricular contraction);  T: ventricular repolarisation (end of systole)", "Reading an ECG.", "Heart rate = number of QRS complexes per minute."),
F("Normal blood pressure", "120/80 mm Hg (systolic/diastolic);  hypertension ≥ 140/90", "Blood pressure."),
],
"examples": [
X("Cardiac output", "Stroke volume is 70 mL and heart rate 72 beats/min. Cardiac output?",
  f"70 × 72 = 5040 mL/min ≈ {fx(co, 2)} L/min.", [(fx(co, 2), "5.04")]),
X("Duration of one cycle", "Heart rate is 72 beats/min. How long is one cardiac cycle?",
  f"60/72 = {fx(cycle, 2)} s (about 0.8 s).", [(fx(cycle, 2), "0.83")]),
X("Universal donor", "Why is group O called the universal donor?",
  "O RBCs carry no A or B antigens, so the recipient's antibodies don't agglutinate them.", []),
X("Erythroblastosis foetalis", "An Rh⁻ woman carries her second Rh⁺ child. What is the risk?",
  "Anti-Rh antibodies made after the first delivery cross the placenta and destroy the foetal RBCs — fatal anaemia and jaundice (erythroblastosis foetalis).", []),
X("Lymph and fat", "Which vessels absorb fats from the intestine?",
  "Lacteals (lymph vessels in the villi). Lymph carries the fat and drains into veins via the thoracic duct.", []),
X("Heart blocked at AV node", "What happens if the AV node fails?",
  "Impulses from the SA node can't reach the ventricles normally; ventricles beat at their own slower rate (heart block), needing an artificial pacemaker.", []),
],
"topics": [
T("Blood platelets and WBCs", "Platelets (thrombocytes) are cell fragments from megakaryocytes in bone marrow and release clotting factors. A fall in their number causes clotting disorders and excessive blood loss."),
T("Lymph (tissue fluid)", "As blood passes through capillaries, some water and small solutes move into tissue spaces, forming interstitial fluid; it has the same mineral distribution as plasma. Lymphatic vessels collect it and return it to major veins. Lymph contains lymphocytes."),
T("Open and closed circulation", "Open: blood pumped into open spaces (arthropods, molluscs). Closed: blood always flows in vessels (annelids, chordates) — more precise regulation."),
T("Human heart structure", "Mesodermal origin, in the thoracic cavity, slightly tilted left, enclosed in double-walled pericardium. Interatrial and interventricular septa; tricuspid (right) and bicuspid/mitral (left) AV valves; semilunar valves at the pulmonary artery and aorta openings."),
T("Regulation of cardiac activity", "Heart activity is auto-regulated by nodal tissue but moderated by the medulla oblongata: sympathetic nerves increase rate and strength; parasympathetic (vagus) decreases them. Adrenal medulla hormones increase cardiac output."),
T("Disorders", "Hypertension (high blood pressure — damages heart, brain, kidneys); coronary artery disease or atherosclerosis (deposits of calcium, fat and cholesterol narrow coronary arteries); angina pectoris (chest pain from insufficient O₂ to heart muscle); heart failure (heart can't pump enough blood — congestion of lungs). Cardiac arrest is when the heart stops beating; heart attack is when heart muscle is damaged by sudden lack of blood."),
T("Hepatic portal system", "The hepatic portal vein carries blood from the intestine to the liver before it reaches the systemic circulation. Coronary circulation supplies the heart muscle itself."),
],
"ratta": [
"Plasma 55%: water 90–92%, proteins 6–8%.",
"Neutrophils most (60–65%); basophils least.",
"RBC 120 days; spleen = graveyard.",
"AB universal recipient;  O universal donor.",
"SA node = pacemaker;  cycle 0.8 s.",
"Cardiac output ≈ 5 L/min.",
"P atrial depol.;  QRS ventricular depol.;  T ventricular repol.",
"Lub = AV valves close;  dub = semilunar valves close.",
],
}

SYLLABUS = [
("Composition of blood, blood groups, coagulation of blood", ["plasma", "blood group", "coagulation"]),
("Composition of lymph and its function", ["lymph"]),
("Human circulatory system — structure of human heart and blood vessels; cardiac cycle, cardiac output, ECG; double circulation; regulation of cardiac activity", ["heart", "cardiac cycle", "cardiac output", "ECG", "double circulation", "regulation"]),
("Disorders of circulatory system — hypertension, coronary artery disease, angina pectoris, heart failure", ["hypertension", "coronary artery disease", "angina", "heart failure"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
