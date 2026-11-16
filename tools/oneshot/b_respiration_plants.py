from lib import F, X, T, sig, fx, _check_and_write

rq_fat = 102 / 145
rq_malic = 4 / 3
atp_total = 2 + 2 * 3 + 2 * 3 + 6 * 3 + 2 * 2 + 2  # glycolysis ATP + glycolysis NADH + link NADH + Krebs NADH + FADH2 + Krebs ATP

DOC = {
"slug": "respiration-in-plants", "subject": "Biology",
"chapters": {"NEET": "Respiration in Plants"},
"title": "Respiration in Plants", "readMinutes": 14,
"summary": [
"Cellular respiration breaks down food (mainly glucose) to release energy, trapped as ATP. Plants have no special respiratory organs; each part exchanges gases by diffusion through stomata and lenticels.",
"Glycolysis (EMP pathway) in the cytoplasm splits glucose into two pyruvate. Without O₂, pyruvate is fermented to ethanol (yeast) or lactic acid (muscle, bacteria).",
"With O₂, pyruvate enters mitochondria: link reaction → Krebs cycle (matrix) → electron transport system and oxidative phosphorylation (inner membrane). O₂ is the final electron acceptor.",
"Respiration is amphibolic — it both breaks down and builds molecules. The respiratory quotient (RQ) depends on the substrate.",
],
"formulas": [
F("Overall aerobic respiration", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + energy", "Summary equation."),
F("Glycolysis", "glucose → 2 pyruvate;  net gain 2 ATP + 2 NADH;  uses 2 ATP (hexokinase, phosphofructokinase), makes 4 ATP", "First stage (Embden, Meyerhof, Parnas).", "Glycolysis is the only process common to aerobic and anaerobic respiration.", tag="PYQ favourite"),
F("Fermentation", "yeast: pyruvate → acetaldehyde + CO₂ → ethanol (pyruvic acid decarboxylase, alcohol dehydrogenase);  muscle/bacteria: pyruvate → lactic acid (lactate dehydrogenase)", "Anaerobic respiration.", "Yeasts poison themselves when ethanol reaches about 13%."),
F("Link reaction", "pyruvate + CoA + NAD⁺ → acetyl CoA + CO₂ + NADH (pyruvate dehydrogenase, in mitochondrial matrix)", "Joining glycolysis and Krebs cycle."),
F("Krebs (TCA) cycle per acetyl CoA", "acetyl CoA (2C) + OAA (4C) → citric acid (6C) … → OAA;  gives 2 CO₂ + 3 NADH + 1 FADH₂ + 1 ATP (GTP)", "Second stage, in the matrix.", None, tag="PYQ favourite"),
F("ETS sequence", "NADH → complex I (NADH dehydrogenase) → ubiquinone → complex III (cyt bc₁) → cytochrome c → complex IV (cyt a–a₃, Cu centres) → O₂;  FADH₂ enters at complex II", "Electron transport system."),
F("ATP yield per carrier", "1 NADH → 3 ATP;  1 FADH₂ → 2 ATP (complex V — ATP synthase F₀–F₁)", "Counting ATP."),
F("Net ATP from one glucose", "38 ATP (theoretical, aerobic);  2 ATP (fermentation)", "Energy comparison.", "Real yields are lower; 38 is a theoretical value assuming a sequential pathway.", tag="PYQ favourite"),
F("Respiratory quotient", "RQ = volume of CO₂ evolved / volume of O₂ consumed", "Identifying the respiratory substrate."),
F("RQ values", "carbohydrates = 1;  fats ≈ 0.7;  proteins ≈ 0.9;  organic acids (malic) > 1;  anaerobic = ∞ (CO₂ but no O₂)", "RQ comparisons.", None, tag="PYQ favourite"),
F("Amphibolic pathway", "fats → glycerol (→ PGAL) + fatty acids (→ acetyl CoA);  proteins → amino acids → pyruvate/acetyl CoA/Krebs intermediates", "Other substrates entering respiration."),
],
"examples": [
X("ATP from one glucose", "Count the theoretical ATP from one glucose in aerobic respiration.",
  f"Glycolysis 2 ATP + 2 NADH (6 ATP); link reaction 2 NADH (6 ATP); Krebs cycle 6 NADH (18 ATP) + 2 FADH₂ (4 ATP) + 2 ATP. Total = {atp_total} ATP.", [(str(atp_total), "38")]),
X("RQ of a fat", "2C₅₁H₉₈O₆ + 145O₂ → 102CO₂ + 98H₂O. Find the RQ.",
  f"RQ = 102/145 = {fx(rq_fat, 2)}.", [(fx(rq_fat, 2), "0.7")]),
X("RQ of malic acid", "C₄H₆O₅ + 3O₂ → 4CO₂ + 3H₂O. RQ?",
  f"RQ = 4/3 = {fx(rq_malic, 2)} — more than 1, as for organic acids.", [(fx(rq_malic, 2), "1.33")]),
X("Muscle cramps", "Why do muscles feel tired after heavy exercise?",
  "When O₂ is insufficient, muscle cells reduce pyruvate to lactic acid (anaerobic), which accumulates and causes fatigue.", []),
X("Final electron acceptor", "What is the role of oxygen in aerobic respiration?",
  "Oxygen is the final acceptor of electrons at the end of the ETS; it combines with protons to form water. Without it, the chain stops and ATP production by oxidative phosphorylation ceases.", []),
X("Respiration is amphibolic", "Why is respiration called an amphibolic pathway?",
  "Its intermediates are used both in breakdown (catabolism) and in synthesis (anabolism) — e.g. acetyl CoA is used for fatty acid synthesis and Krebs intermediates for amino acids.", []),
],
"topics": [
T("Gas exchange in plants", "Plants get O₂ through stomata and lenticels; living cells of stems and roots lie close to the surface, and most cells have at least part of their surface in contact with air. Gas exchange needs are low compared with animals."),
T("Steps of glycolysis", "Glucose → glucose-6-phosphate (ATP used) → fructose-6-phosphate → fructose-1,6-bisphosphate (ATP used) → DHAP + 3-PGAL → 1,3-bisphosphoglycerate (NADH formed) → 3-PGA (ATP) → 2-PGA → PEP → pyruvate (ATP)."),
T("Krebs cycle details", "Discovered by Hans Krebs. Citrate → isocitrate → α-ketoglutarate (CO₂, NADH) → succinyl CoA (CO₂, NADH) → succinate (GTP/ATP — substrate-level phosphorylation) → fumarate (FADH₂) → malate → OAA (NADH)."),
T("Oxidative phosphorylation", "Energy from electron transport pumps protons into the intermembrane space; the gradient drives ATP synthesis as protons flow back through F₀ (channel) to F₁ (headpiece, catalytic site) of ATP synthase."),
T("Assumptions of the 38 ATP count", "A sequential, orderly pathway; NADH from glycolysis enters mitochondria and is fully oxidised; no intermediates are used for other compounds; only glucose is respired. In reality none of these fully hold."),
T("Fermentation vs aerobic respiration", "Fermentation partially breaks down glucose, gives net 2 ATP and NADH is re-oxidised to NAD⁺ slowly; aerobic respiration fully oxidises glucose to CO₂ and water, yielding far more ATP."),
],
"ratta": [
"Glycolysis: cytoplasm, net 2 ATP + 2 NADH.",
"Krebs per acetyl CoA: 2 CO₂, 3 NADH, 1 FADH₂, 1 GTP.",
"NADH = 3 ATP;  FADH₂ = 2 ATP;  total 38.",
"Complex IV: cyt a–a₃ + Cu;  complex V: ATP synthase.",
"RQ: carb 1, fat 0.7, protein 0.9, malic acid 1.33.",
"Yeast → ethanol + CO₂;  muscle → lactic acid.",
],
}

SYLLABUS = [
("Exchange of gases", ["stomata", "lenticel"]),
("Cellular respiration — glycolysis, fermentation (anaerobic), TCA cycle and electron transport system (aerobic)", ["glycolysis", "fermentation", "Krebs", "electron transport"]),
("Energy relations — number of ATP molecules generated", ["38 ATP"]),
("Amphibolic pathways; respiratory quotient", ["amphibolic", "respiratory quotient"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Cellular respiration khaane (mainly glucose) ko todkar energy nikaalti hai, jo ATP mein pakdi jaati hai. Plants mein khaas respiratory organs nahi; har part stomata aur lenticel se diffusion dwara gases exchange karta hai.",
"Glycolysis (EMP pathway) cytoplasm mein glucose ko do pyruvate mein todta hai. O₂ na ho to pyruvate ka fermentation ethanol (yeast) ya lactic acid (muscle, bacteria) mein hota hai.",
"O₂ ho to pyruvate mitochondria mein jaata hai: link reaction → Krebs cycle (matrix) → electron transport system aur oxidative phosphorylation (inner membrane). O₂ final electron acceptor hai. Theory mein ek glucose se 38 ATP.",
"Respiration amphibolic hai — molecules todta bhi hai aur banata bhi. Respiratory quotient (RQ) substrate par depend karta hai.",
],
when=[
("Summary equation.", None),
("Pehla stage (Embden, Meyerhof, Parnas).", "Glycolysis hi akela process hai jo aerobic aur anaerobic respiration dono mein common hai — yaad rakho."),
("Anaerobic respiration.", "Ethanol lagbhag 13% pahunchne par yeasts khud ko zeher de dete hain."),
("Glycolysis aur Krebs cycle ko jodna.", None),
("Doosra stage, matrix mein.", None),
("Electron transport system.", None),
("ATP ginna.", None),
("Energy ki tulna.", "Asli yield kam hoti hai; 38 sequential pathway maan kar theoretical value hai — exact mat samjho."),
("Respiratory substrate pehchaanna.", None),
("RQ ki tulna.", None),
("Doosre substrates ka respiration mein aana.", None),
],
examples=[
("Ek glucose se ATP", "Aerobic respiration mein ek glucose se theoretical ATP gino.",
 "Glycolysis 2 ATP + 2 NADH (6 ATP); link reaction 2 NADH (6 ATP); Krebs cycle 6 NADH (18 ATP) + 2 FADH₂ (4 ATP) + 2 ATP. Total = ⟨0⟩ ATP."),
("Fat ka RQ", "2C₅₁H₉₈O₆ + 145O₂ → 102CO₂ + 98H₂O. RQ nikalo.",
 "RQ = 102/145 = ⟨0⟩."),
("Malic acid ka RQ", "C₄H₆O₅ + 3O₂ → 4CO₂ + 3H₂O. RQ?",
 "RQ = 4/3 = ⟨0⟩ — 1 se zyada, jaisa organic acids mein hota hai."),
("Muscle cramps", "Bhaari exercise ke baad muscles thaki kyun lagti hain?",
 "O₂ kam padne par muscle cells pyruvate ko lactic acid mein reduce karti hain (anaerobic), jo jama hokar thakaan deta hai."),
("Final electron acceptor", "Aerobic respiration mein oxygen ka role kya hai?",
 "Oxygen ETS ke end mein electrons ka final acceptor hai; protons ke saath judkar paani banata hai. Iske bina chain ruk jaati hai aur oxidative phosphorylation se ATP banna band."),
("Respiration amphibolic hai", "Respiration ko amphibolic pathway kyun kehte hain?",
 "Iske intermediates todne (catabolism) aur banane (anabolism) dono mein use hote hain — jaise acetyl CoA fatty acid synthesis mein aur Krebs intermediates amino acids ke liye."),
],
topics=[
("Gas exchange in plants", "Plants stomata aur lenticels se O₂ lete hain; stems aur roots ke living cells surface ke paas hote hain, aur zyadatar cells ka kuch surface hawa ke sampark mein rehta hai. Animals ke mukable gas exchange ki zaroorat kam hai."),
("Steps of glycolysis", "Glucose → glucose-6-phosphate (ATP use) → fructose-6-phosphate → fructose-1,6-bisphosphate (ATP use) → DHAP + 3-PGAL → 1,3-bisphosphoglycerate (NADH bana) → 3-PGA (ATP) → 2-PGA → PEP → pyruvate (ATP)."),
("Krebs cycle details", "Hans Krebs ne dhoondha. Citrate → isocitrate → α-ketoglutarate (CO₂, NADH) → succinyl CoA (CO₂, NADH) → succinate (GTP/ATP — substrate-level phosphorylation) → fumarate (FADH₂) → malate → OAA (NADH)."),
("Oxidative phosphorylation", "Electron transport ki energy protons ko intermembrane space mein pump karti hai; protons ATP synthase ke F₀ (channel) se F₁ (headpiece, catalytic site) ki taraf waapas behte hain aur gradient ATP banwaata hai."),
("Assumptions of the 38 ATP count", "Sequential, vyavasthit pathway; glycolysis ka NADH mitochondria mein jaakar poora oxidise hota hai; koi intermediate doosre compounds ke liye use nahi hota; sirf glucose respire hota hai. Asal mein inme se koi poori tarah sach nahi."),
("Fermentation vs aerobic respiration", "Fermentation glucose ko aadha-adhoora todta hai, net 2 ATP deta hai aur NADH dheere se NAD⁺ mein re-oxidise hota hai; aerobic respiration glucose ko poora CO₂ aur paani mein oxidise karke kahin zyada ATP deta hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
