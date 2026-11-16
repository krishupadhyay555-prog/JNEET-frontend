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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Blood ek fluid connective tissue hai: plasma (55%) aur formed elements (45%) — RBCs, WBCs aur platelets. Lymph rang-heen fluid hai jo tissue fluid ko waapas blood mein laata hai aur fats le jaata hai.",
"ABO aur Rh blood group RBCs par antigens se tay hote hain; galat transfusion ya pregnancy mein Rh incompatibility khatarnaak ho sakti hai. Coagulation (clotting) cascade se khoon jamta hai.",
"Human heart mein chaar chambers aur double circulation hai. Iski dhadkan myogenic hai, SA node (pacemaker) se shuru hoti hai, aur cardiac cycle lagbhag 0.8 s ka hai; cardiac output = stroke volume × heart rate. Iski regulation nodal tissue aur medulla karte hain.",
"ECG heart ki electrical activity record karta hai (P, QRS, T). Disorders: hypertension, coronary artery disease, angina aur heart failure.",
],
when=[
("Plasma mein kya hota hai.", None),
("Blood counts.", None),
("Erythrocytes.", None),
("Differential leucocyte count.", None),
("Blood transfusion compatibility.", None),
("Pregnancy ki complication.", None),
("Blood ka coagulation.", None),
("Human circulation.", None),
("Heartbeat ki shuruaat aur failaav.", "Heart myogenic hai: impulse heart muscle mein hi shuru hota hai, nerve se nahi — galat mat likhna."),
("Heartbeat ki timing.", None),
("Har minute pump hua blood.", None),
("Auscultation.", None),
("ECG padhna.", "Heart rate = har minute QRS complexes ki sankhya."),
("Blood pressure.", None),
],
examples=[
("Cardiac output", "Stroke volume 70 mL aur heart rate 72 beats/min. Cardiac output?",
 "70 × 72 = 5040 mL/min ≈ ⟨0⟩ L/min."),
("Ek cycle ki duration", "Heart rate 72 beats/min hai. Ek cardiac cycle kitni der ka?",
 "60/72 = ⟨0⟩ s (lagbhag 0.8 s)."),
("Universal donor", "Group O ko universal donor kyun kehte hain?",
 "O ke RBCs par A ya B antigens nahi hote, isliye recipient ki antibodies unhe agglutinate nahi karti."),
("Erythroblastosis foetalis", "Rh⁻ mahila ka doosra bachcha Rh⁺ hai. Khatra kya hai?",
 "Pehli delivery ke baad bani anti-Rh antibodies placenta paar karke foetus ke RBCs tod deti hain — jaanleva anaemia aur jaundice (erythroblastosis foetalis)."),
("Lymph aur fat", "Intestine se fats kaunsi vessels absorb karti hain?",
 "Lacteals (villi mein lymph vessels). Lymph fat le jaata hai aur thoracic duct se veins mein khaali hota hai."),
("AV node par heart block", "AV node fail ho jaaye to kya hoga?",
 "SA node ke impulses ventricles tak normal tarike se nahi pahunchte; ventricles apni dheemi rate se dhadakte hain (heart block), artificial pacemaker chahiye."),
],
topics=[
("Blood platelets and WBCs", "Platelets (thrombocytes) bone marrow ke megakaryocytes ke tukde hain aur clotting factors chhodte hain. Inki sankhya ghatne par clotting disorders aur zyada khoon behta hai."),
("Lymph (tissue fluid)", "Capillaries se guzarte waqt kuch paani aur chhote solutes tissue spaces mein jaakar interstitial fluid banate hain; isme plasma jaisa hi mineral distribution hota hai. Lymphatic vessels ise ikattha karke badi veins mein waapas laati hain. Lymph mein lymphocytes hote hain."),
("Open and closed circulation", "Open: blood khuli jagahon mein pump hota hai (arthropods, molluscs). Closed: blood hamesha vessels mein behta hai (annelids, chordates) — zyada sateek control."),
("Human heart structure", "Mesodermal origin, thoracic cavity mein, thoda left jhuka, double-walled pericardium mein band. Interatrial aur interventricular septa; tricuspid (right) aur bicuspid/mitral (left) AV valves; pulmonary artery aur aorta ke openings par semilunar valves."),
("Regulation of cardiac activity", "Heart ki activity nodal tissue se auto-regulated hai par medulla oblongata ise modify karta hai: sympathetic nerves rate aur taakat badhaati hain; parasympathetic (vagus) ghataati hain. Adrenal medulla ke hormones cardiac output badhaate hain."),
("Disorders", "Hypertension (high blood pressure — heart, brain, kidneys ko nuksaan); coronary artery disease ya atherosclerosis (calcium, fat aur cholesterol jama hokar coronary arteries sankri); angina pectoris (heart muscle ko O₂ kam milne se seene mein dard); heart failure (heart kaafi blood pump nahi kar paata — lungs mein congestion). Cardiac arrest = heart ruk jaana; heart attack = achanak blood ki kami se heart muscle ko nuksaan."),
("Hepatic portal system", "Hepatic portal vein intestine ka blood systemic circulation se pehle liver tak le jaati hai. Coronary circulation khud heart muscle ko blood deti hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
