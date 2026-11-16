from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "chemical-coordination-and-integration", "subject": "Biology",
"chapters": {"NEET": "Chemical Coordination and Integration"},
"title": "Chemical Coordination and Integration", "readMinutes": 14,
"summary": [
"Hormones are non-nutrient chemicals that act as intercellular messengers and are produced in trace amounts. Endocrine glands are ductless and release hormones into blood.",
"The hypothalamus controls the pituitary through releasing and inhibiting hormones (adenohypophysis) and by sending oxytocin and vasopressin down axons to the neurohypophysis.",
"Other glands: pineal, thyroid, parathyroid, thymus, adrenal, pancreas (islets of Langerhans), testes and ovaries. The heart, kidney and gut also make hormones.",
"Hormones act through receptors: protein hormones bind membrane receptors and use second messengers (cAMP, IP₃, Ca²⁺); steroid and iodothyronine hormones enter the cell and bind intracellular receptors to regulate genes.",
],
"formulas": [
F("Hypothalamic hormones", "GnRH → pituitary makes gonadotrophins;  somatostatin inhibits growth hormone release", "Releasing vs inhibiting hormones."),
F("Adenohypophysis (pars distalis)", "GH, PRL, TSH, ACTH, LH, FSH;  pars intermedia: MSH", "Anterior pituitary hormones.", None, tag="PYQ favourite"),
F("Growth hormone disorders", "excess in childhood → gigantism;  deficiency → pituitary dwarfism;  excess in adults → acromegaly (especially of face)", "GH problems."),
F("Neurohypophysis", "stores and releases oxytocin (uterine contraction at childbirth, milk ejection) and vasopressin/ADH (water reabsorption in distal tubules; deficiency → diabetes insipidus)", "Posterior pituitary.", "These hormones are made in the hypothalamus, not in the posterior pituitary."),
F("Pineal gland", "melatonin → diurnal (24-hour) rhythm of sleep–wake, body temperature; also affects metabolism, pigmentation, menstrual cycle, defence", "Pineal functions."),
F("Thyroid", "T₄ (thyroxine) and T₃ (triiodothyronine) — basal metabolic rate, RBC formation, metabolism of carbohydrates, proteins and fats, water and electrolyte balance;  thyrocalcitonin (TCT) lowers blood Ca²⁺", "Thyroid hormones.", None, tag="PYQ favourite"),
F("Thyroid disorders", "iodine deficiency → hypothyroidism and goitre;  in pregnancy → cretinism in the baby (stunted growth, mental retardation, deaf-mutism);  hyperthyroidism → exophthalmic goitre (Graves' disease: enlarged thyroid, protruding eyes, weight loss)", "Hypo- and hyperthyroidism."),
F("Parathyroid hormone (PTH)", "raises blood Ca²⁺: bone resorption (demineralisation), Ca²⁺ reabsorption from renal tubules and absorption from digested food;  with TCT maintains Ca²⁺ balance", "Calcium regulation.", None, tag="PYQ favourite"),
F("Thymus", "thymosins → differentiation of T-lymphocytes (cell-mediated immunity) and antibody production (humoral immunity); degenerates with age", "Thymus functions."),
F("Adrenal medulla", "adrenaline (epinephrine) and noradrenaline — emergency hormones (fight or flight): alertness, pupil dilation, piloerection, sweating, increased heart rate, breathing rate, glycogenolysis", "Catecholamines."),
F("Adrenal cortex", "zona glomerulosa → mineralocorticoids (aldosterone: Na⁺, water reabsorption, K⁺ and phosphate excretion);  zona fasciculata → glucocorticoids (cortisol: gluconeogenesis, anti-inflammatory, immunosuppression);  zona reticularis → androgens", "Corticoids.", "Underproduction of adrenal cortex hormones causes Addison's disease."),
F("Pancreatic islets", "α-cells → glucagon (hyperglycaemic: glycogenolysis, gluconeogenesis);  β-cells → insulin (hypoglycaemic: glucose uptake by cells, glycogenesis);  prolonged hyperglycaemia → diabetes mellitus", "Blood sugar control.", None, tag="PYQ favourite"),
F("Gonads", "testes (Leydig cells) → androgens, mainly testosterone;  ovary → oestrogen (growth of female sex organs, secondary sexual characters) and progesterone (from corpus luteum; supports pregnancy, alveoli of mammary glands)", "Sex hormones."),
F("Hormones of heart, kidney, gut", "heart: ANF (lowers BP);  kidney: erythropoietin (RBC formation);  gut: gastrin, secretin, cholecystokinin (CCK), gastric inhibitory peptide (GIP)", "Hormones from non-endocrine tissues."),
],
"examples": [
X("Same gland, opposite actions", "Which two hormones keep blood calcium constant, and how?",
  "PTH (parathyroid) raises blood Ca²⁺; thyrocalcitonin (thyroid) lowers it. Together they maintain balance.", []),
X("Emergency hormone", "Why are adrenaline and noradrenaline called the 3F hormones?",
  "They are released quickly in emergencies — fight, flight or fright — raising heart rate, alertness and blood glucose.", []),
X("Cretinism", "A baby shows stunted growth and mental retardation; the mother had iodine deficiency during pregnancy. Diagnosis?",
  "Cretinism — hypothyroidism during pregnancy affects the development of the foetus.", []),
X("Steroid hormone mechanism", "How does cortisol act on a target cell?",
  "Being lipid-soluble, it crosses the membrane, binds an intracellular receptor and the hormone–receptor complex regulates gene expression in the nucleus.", []),
X("Second messenger", "Name second messengers used by protein hormones.",
  "cAMP, IP₃ and Ca²⁺. The hormone binds a membrane receptor and the second messenger carries the signal inside the cell.", []),
X("Gastrointestinal hormones", "Which hormone stimulates pancreatic juice and bile release?",
  "Cholecystokinin (CCK) acts on both pancreas and gall bladder; secretin acts on exocrine pancreas (water and bicarbonate). Gastrin stimulates gastric glands.", []),
],
"topics": [
T("Endocrine glands and hormones", "Classical definition: chemicals made by endocrine glands, released into blood and carried to a distant target organ. Current definition: non-nutrient chemicals that act as intercellular messengers, in trace amounts."),
T("Human endocrine system", "Pituitary, pineal, thyroid, adrenal, pancreas, parathyroid, thymus and gonads, plus hormone-producing tissues in the gastrointestinal tract, liver, kidney and heart."),
T("Hypothalamus", "The basal part of the diencephalon; has several groups of neurosecretory cells (nuclei) making hormones that regulate the synthesis and secretion of pituitary hormones. Hormones reach the anterior pituitary through a portal circulatory system."),
T("Pituitary gland", "Located in the sella turcica (bony cavity), attached to the hypothalamus by a stalk. Anatomically adenohypophysis (pars distalis, pars intermedia) and neurohypophysis (pars nervosa)."),
T("Chemical nature of hormones", "Peptide/polypeptide/protein (insulin, glucagon, pituitary and hypothalamic hormones), steroids (cortisol, testosterone, oestradiol, progesterone), iodothyronines (thyroid hormones), amino acid derivatives (adrenaline, noradrenaline, epinephrine)."),
T("Mechanism of hormone action", "Hormones bind specific receptors on target tissues only. Membrane-bound receptors (for those that can't enter) form a hormone–receptor complex that generates second messengers; intracellular receptors (mostly nuclear) regulate gene expression or chromosome function."),
],
"ratta": [
"Anterior pituitary: GH, PRL, TSH, ACTH, LH, FSH;  intermediate: MSH.",
"Oxytocin & ADH made in hypothalamus, released from posterior pituitary.",
"GH excess: child gigantism, adult acromegaly.",
"PTH ↑ Ca²⁺;  TCT ↓ Ca²⁺.",
"Glomerulosa → aldosterone;  fasciculata → cortisol;  reticularis → androgens.",
"α → glucagon;  β → insulin.",
"Heart → ANF;  kidney → erythropoietin.",
"Graves = hyperthyroid;  cretinism = hypothyroid in pregnancy;  Addison = low corticoids.",
],
}

SYLLABUS = [
("Endocrine glands and hormones; human endocrine system — hypothalamus, pituitary, pineal, thyroid, parathyroid, adrenal, pancreas, gonads", ["endocrine", "hypothalamus", "pituitary", "pineal", "thyroid", "parathyroid", "adrenal", "pancreas", "gonad"]),
("Mechanism of hormone action (elementary idea)", ["receptor", "second messenger"]),
("Role of hormones as messengers and regulators; hypo- and hyperactivity and related disorders — dwarfism, acromegaly, cretinism, goitre, exophthalmic goitre, diabetes, Addison's disease", ["dwarfism", "acromegaly", "cretinism", "goitre", "diabetes", "Addison"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Hormones non-nutrient chemicals hain jo intercellular messengers ki tarah kaam karte hain aur trace amounts mein bante hain. Endocrine glands ductless hoti hain aur hormones seedhe blood mein chhodti hain.",
"Hypothalamus pituitary ko releasing aur inhibiting hormones (adenohypophysis) se control karta hai, aur oxytocin aur vasopressin ko axons se neurohypophysis tak bhejta hai.",
"Doosri glands: pineal, thyroid, parathyroid, thymus, adrenal, pancreas (islets of Langerhans), testes aur ovaries (gonad). Heart, kidney aur gut bhi hormones banate hain.",
"Hormones receptor se kaam karte hain: protein hormones membrane receptors se judkar second messenger (cAMP, IP₃, Ca²⁺) use karte hain; steroid aur iodothyronine hormones cell mein jaakar intracellular receptors se judte hain aur genes control karte hain. Disorders: dwarfism, acromegaly, cretinism, goitre, diabetes, Addison's disease.",
],
when=[
("Releasing vs inhibiting hormones.", None),
("Anterior pituitary ke hormones.", None),
("GH ki problems.", None),
("Posterior pituitary.", "Ye hormones hypothalamus mein bante hain, posterior pituitary mein nahi — wo sirf store karke chhodta hai."),
("Pineal ke kaam.", None),
("Thyroid hormones.", None),
("Hypo- aur hyperthyroidism.", None),
("Calcium ka control.", None),
("Thymus ke kaam.", None),
("Catecholamines.", None),
("Corticoids.", "Adrenal cortex hormones kam banne se Addison's disease hota hai."),
("Blood sugar ka control.", None),
("Sex hormones.", None),
("Non-endocrine tissues ke hormones.", None),
],
examples=[
("Do hormones, ulta kaam", "Kaunse do hormones blood calcium constant rakhte hain, aur kaise?",
 "PTH (parathyroid) blood Ca²⁺ badhaata hai; thyrocalcitonin (thyroid) ghataata hai. Dono milkar balance rakhte hain."),
("Emergency hormone", "Adrenaline aur noradrenaline ko 3F hormones kyun kehte hain?",
 "Emergency mein tezi se nikalte hain — fight, flight ya fright — heart rate, alertness aur blood glucose badhaate hain."),
("Cretinism", "Ek bachche mein ruki hui growth aur mental retardation hai; maa ko pregnancy mein iodine ki kami thi. Diagnosis?",
 "Cretinism — pregnancy mein hypothyroidism foetus ke development ko affect karta hai."),
("Steroid hormone ka mechanism", "Cortisol target cell par kaise kaam karta hai?",
 "Lipid-soluble hone se membrane paar karta hai, intracellular receptor se judta hai aur hormone–receptor complex nucleus mein gene expression control karta hai."),
("Second messenger", "Protein hormones kaunse second messengers use karte hain?",
 "cAMP, IP₃ aur Ca²⁺. Hormone membrane receptor se judta hai aur second messenger signal cell ke andar le jaata hai."),
("Gastrointestinal hormones", "Pancreatic juice aur bile nikalne ko kaunsa hormone uksaata hai?",
 "Cholecystokinin (CCK) pancreas aur gall bladder dono par kaam karta hai; secretin exocrine pancreas par (paani aur bicarbonate). Gastrin gastric glands ko uksaata hai."),
],
topics=[
("Endocrine glands and hormones", "Classical definition: endocrine glands ke banaye chemicals jo blood mein chhode jaakar door ke target organ tak jaate hain. Current definition: non-nutrient chemicals jo trace amounts mein intercellular messengers ka kaam karte hain."),
("Human endocrine system", "Pituitary, pineal, thyroid, adrenal, pancreas, parathyroid, thymus aur gonads, saath mein gastrointestinal tract, liver, kidney aur heart ke hormone banane wale tissues."),
("Hypothalamus", "Diencephalon ka basal hissa; isme neurosecretory cells ke kai groups (nuclei) hain jo pituitary hormones ke banne aur nikalne ko control karne wale hormones banate hain. Hormones portal circulatory system se anterior pituitary tak pahunchte hain."),
("Pituitary gland", "Sella turcica (haddi ki cavity) mein, stalk se hypothalamus se juda. Anatomically adenohypophysis (pars distalis, pars intermedia) aur neurohypophysis (pars nervosa)."),
("Chemical nature of hormones", "Peptide/polypeptide/protein (insulin, glucagon, pituitary aur hypothalamic hormones), steroids (cortisol, testosterone, oestradiol, progesterone), iodothyronines (thyroid hormones), amino acid derivatives (adrenaline, noradrenaline, epinephrine)."),
("Mechanism of hormone action", "Hormones sirf target tissues ke specific receptors se judte hain. Membrane-bound receptors (jo hormones andar nahi ja sakte unke liye) hormone–receptor complex banakar second messengers banate hain; intracellular receptors (zyadatar nuclear) gene expression ya chromosome function control karte hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
