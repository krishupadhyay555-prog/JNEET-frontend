from lib import F, X, T, sig, fx, _check_and_write

sperm_from_one = 4
ova_from_one = 1
n_chrom = 46 // 2

DOC = {
"slug": "human-reproduction", "subject": "Biology",
"chapters": {"NEET": "Human Reproduction"},
"title": "Human Reproduction", "readMinutes": 15,
"summary": [
"Humans are sexually reproducing and viviparous. Events: gametogenesis, insemination, fertilisation, cleavage, blastocyst formation, implantation, gestation and parturition.",
"The male system has testes (seminiferous tubules make sperm; Leydig cells make androgens), ducts, accessory glands and the penis. The female system has ovaries, oviducts, uterus, cervix, vagina and mammary glands.",
"Spermatogenesis starts at puberty and gives four sperm per primary spermatocyte; oogenesis starts before birth and gives one ovum per primary oocyte. The menstrual cycle (~28 days) is controlled by FSH, LH, oestrogen and progesterone.",
"Fertilisation happens in the ampullary region of the oviduct; the blastocyst implants in the endometrium; the placenta supports the foetus and makes hormones. Birth is triggered by the foetal ejection reflex and oxytocin.",
],
"formulas": [
F("Testis structure", "each testis ~250 testicular lobules, each with 1–3 seminiferous tubules;  lined by spermatogonia and Sertoli cells (nourish sperm);  Leydig (interstitial) cells outside tubules secrete androgens", "Male gonad.", None, tag="PYQ favourite"),
F("Male duct path", "seminiferous tubules → rete testis → vasa efferentia → epididymis → vas deferens → ejaculatory duct → urethra", "Sperm transport.", None, tag="PYQ favourite"),
F("Male accessory glands", "paired seminal vesicles + prostate + paired bulbourethral glands → seminal plasma (fructose, Ca²⁺, enzymes); bulbourethral secretion lubricates the penis", "Semen composition."),
F("Spermatogenesis", "spermatogonium (2n, 46) → primary spermatocyte (2n) → meiosis I → 2 secondary spermatocytes (n, 23) → meiosis II → 4 spermatids (n) → spermiogenesis → sperm;  release = spermiation", "Sperm formation.", None, tag="PYQ favourite"),
F("Hormonal control (male)", "GnRH → LH acts on Leydig cells (androgens);  FSH acts on Sertoli cells (factors helping spermiogenesis)", "Male hormones."),
F("Sperm structure", "head (haploid nucleus + acrosome with enzymes for fertilisation) + neck + middle piece (mitochondria — energy) + tail;  ~200–300 million sperm per ejaculate; ≥ 60% normal shape and ≥ 40% vigorous motility needed for normal fertility", "Sperm details."),
F("Oogenesis", "oogonia form in foetal life → primary oocyte (arrested in prophase I) in primary follicle → at puberty → secondary oocyte (n) + first polar body (Graafian follicle) → ovulation → meiosis II completes only after sperm entry → ovum + second polar body", "Egg formation.", "No new oogonia form after birth; many follicles degenerate, so at puberty only about 60,000–80,000 primary follicles are left in each ovary."),
F("Menstrual cycle phases", "menstrual (days 1–5: endometrium breaks down);  follicular/proliferative (FSH, LH ↑; follicle grows, oestrogen rebuilds endometrium);  ovulation (~day 14: LH surge);  luteal/secretory (corpus luteum makes progesterone)", "Phases of the ~28-day cycle.", None, tag="PYQ favourite"),
F("LH surge", "peak LH (and FSH) in mid-cycle → rupture of Graafian follicle → ovulation", "Trigger of ovulation."),
F("Fertilisation", "in the ampullary region of the fallopian tube;  sperm contact zona pellucida → blocks entry of other sperm;  completes meiosis II of the secondary oocyte", "Site and events of fertilisation."),
F("Sex determination", "ovum always X;  sperm X or Y (50:50);  XX → female, XY → male", "Which parent decides sex.", "The father's sperm decides the sex of the baby."),
F("Early development", "zygote → cleavage → morula (8–16 cells) → blastocyst (trophoblast outside, inner cell mass inside) → implantation in endometrium", "Embryonic stages."),
F("Pregnancy hormones", "placenta: hCG, hPL, oestrogens, progestogens;  ovary in late pregnancy: relaxin", "Hormones only made during pregnancy."),
F("Parturition and lactation", "foetal ejection reflex → oxytocin from posterior pituitary → strong uterine contractions;  colostrum (first milk) has IgA antibodies", "Birth and milk."),
],
"examples": [
X("Gamete output", "How many sperm and ova form from one primary spermatocyte and one primary oocyte?",
  f"{sperm_from_one} sperm from one primary spermatocyte; {ova_from_one} ovum (plus polar bodies) from one primary oocyte.", [(str(sperm_from_one), "4"), (str(ova_from_one), "1")]),
X("Chromosomes in a spermatid", "A human spermatogonium has 46 chromosomes. How many does a spermatid have?",
  f"46/2 = {n_chrom} (haploid).", [(str(n_chrom), "23")]),
X("Corpus luteum", "What happens to the corpus luteum if fertilisation does not occur?",
  "It degenerates, progesterone falls, the endometrium breaks down and menstruation starts.", []),
X("Pregnancy test", "Which hormone is detected in a pregnancy test kit?",
  "Human chorionic gonadotropin (hCG), made by the placenta (trophoblast) — present only during pregnancy.", []),
X("Organ development timeline", "When does the foetal heartbeat start and when are limbs formed?",
  "Heart forms after one month of pregnancy; by the end of the second month limbs and digits develop; by the end of 12 weeks (first trimester) most major organs have formed.", []),
X("Identical twins", "How do identical twins form?",
  "A single zygote (or early embryo) splits into two, so both twins have the same genetic makeup. Fraternal twins come from two different eggs fertilised by two sperm.", []),
],
"topics": [
T("Female reproductive system", "Ovaries (2–4 cm long) with stroma; oviducts with infundibulum (fimbriae collect the ovum), ampulla and isthmus; uterus with perimetrium, myometrium (smooth muscle; strong contractions at birth) and endometrium (glandular; cyclic changes); cervix and vagina. External genitalia: mons pubis, labia majora and minora, hymen, clitoris."),
T("Mammary glands", "Paired, containing glandular tissue and fat. Each breast has 15–20 mammary lobes with alveoli that secrete milk; milk passes through tubules, ducts, ampulla and lactiferous duct to the nipple."),
T("Placenta", "Formed by chorionic villi (from trophoblast) and uterine tissue, it supplies O₂ and nutrients to the embryo and removes CO₂ and wastes. It connects to the embryo by the umbilical cord and acts as an endocrine tissue."),
T("Germ layers", "The inner cell mass forms ectoderm, mesoderm and endoderm, which give rise to all tissues and organs. The inner cell mass contains stem cells that can form all tissues."),
T("Menarche and menopause", "The first menstruation at puberty is menarche; cycles stop around 50 years of age (menopause). Cycles stop during pregnancy and can be irregular due to stress or poor health."),
T("Gestation", "Human pregnancy lasts about 9 months. By the end of the second trimester the foetus has fine hair, eyelids separate and eyelashes form."),
],
"ratta": [
"Seminiferous tubules → rete testis → vasa efferentia → epididymis → vas deferens.",
"Leydig → androgens (LH);  Sertoli → nourish (FSH).",
"1 primary spermatocyte → 4 sperm;  1 primary oocyte → 1 ovum.",
"Ovulation ~day 14 (LH surge);  corpus luteum → progesterone.",
"Fertilisation in ampulla;  implantation as blastocyst.",
"hCG, hPL, relaxin — only in pregnancy.",
"Oxytocin → parturition;  colostrum → IgA.",
],
}

SYLLABUS = [
("Male and female reproductive systems; microscopic anatomy of testis and ovary", ["testis", "ovary", "seminiferous"]),
("Gametogenesis — spermatogenesis and oogenesis", ["spermatogenesis", "oogenesis"]),
("Menstrual cycle", ["menstrual cycle"]),
("Fertilisation, embryo development up to blastocyst formation, implantation", ["fertilisation", "blastocyst", "implantation"]),
("Pregnancy and placenta formation; parturition; lactation", ["pregnancy", "placenta", "parturition", "lactation"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Insaan sexually reproduce karte hain aur viviparous hain. Events: gametogenesis, insemination, fertilisation, cleavage, blastocyst ka banna, implantation, gestation aur parturition.",
"Male system mein testis (seminiferous tubules sperm banate hain; Leydig cells androgens), ducts, accessory glands aur penis. Female system mein ovary, oviducts, uterus, cervix, vagina aur mammary glands.",
"Spermatogenesis puberty par shuru hota hai aur har primary spermatocyte se chaar sperm deta hai; oogenesis janm se pehle shuru hota hai aur har primary oocyte se ek ovum. Menstrual cycle (~28 din) FSH, LH, oestrogen aur progesterone control karte hain.",
"Fertilisation oviduct ke ampullary region mein hota hai; blastocyst endometrium mein implantation karta hai; pregnancy mein placenta foetus ko sahara deta aur hormones banata hai. Parturition foetal ejection reflex aur oxytocin se; uske baad lactation.",
],
when=[
("Male gonad.", None),
("Sperm ka transport.", None),
("Semen ka composition.", None),
("Sperm ka banna.", None),
("Male hormones.", None),
("Sperm ki details.", None),
("Egg ka banna.", "Janm ke baad naye oogonia nahi bante; kai follicles khatam ho jaate hain, isliye puberty par har ovary mein sirf lagbhag 60,000–80,000 primary follicles bachte hain — dhyan rakho."),
("~28 din ke cycle ke phases.", None),
("Ovulation ka trigger.", None),
("Fertilisation ki jagah aur events.", None),
("Sex kaun tay karta hai.", "Baby ka sex pita ka sperm tay karta hai, maa nahi — galat mat likhna."),
("Embryonic stages.", None),
("Sirf pregnancy mein bane hormones.", None),
("Birth aur doodh.", None),
],
examples=[
("Gametes ki sankhya", "Ek primary spermatocyte aur ek primary oocyte se kitne sperm aur ova bante hain?",
 "Ek primary spermatocyte se ⟨0⟩ sperm; ek primary oocyte se ⟨1⟩ ovum (aur polar bodies)."),
("Spermatid mein chromosomes", "Human spermatogonium mein 46 chromosomes hain. Spermatid mein kitne?",
 "46/2 = ⟨0⟩ (haploid)."),
("Corpus luteum", "Fertilisation na ho to corpus luteum ka kya hota hai?",
 "Ye khatam (degenerate) ho jaata hai, progesterone girta hai, endometrium tootta hai aur menstruation shuru hota hai."),
("Pregnancy test", "Pregnancy test kit mein kaunsa hormone detect hota hai?",
 "Human chorionic gonadotropin (hCG), placenta (trophoblast) banata hai — sirf pregnancy mein hota hai."),
("Organs banne ki timeline", "Foetus ki heartbeat kab shuru hoti hai aur limbs kab bante hain?",
 "Pregnancy ke ek mahine baad heart banta hai; doosre mahine ke end tak limbs aur digits; 12 hafte (first trimester) ke end tak zyadatar bade organs ban chuke hote hain."),
("Identical twins", "Identical twins kaise bante hain?",
 "Ek hi zygote (ya shuruaati embryo) do mein bat jaata hai, isliye dono ka genetic makeup same. Fraternal twins do alag eggs ke do sperm se fertilise hone se bante hain."),
],
topics=[
("Female reproductive system", "Ovaries (2–4 cm lambi) stroma ke saath; oviducts mein infundibulum (fimbriae ovum pakadti hain), ampulla aur isthmus; uterus mein perimetrium, myometrium (smooth muscle; birth par tez contractions) aur endometrium (glandular; cyclic badlaav); cervix aur vagina. External genitalia: mons pubis, labia majora aur minora, hymen, clitoris."),
("Mammary glands", "Jodi mein, glandular tissue aur fat ke saath. Har breast mein 15–20 mammary lobes jinke alveoli doodh banate hain; doodh tubules, ducts, ampulla aur lactiferous duct se nipple tak jaata hai."),
("Placenta", "Chorionic villi (trophoblast se) aur uterine tissue se banta hai; embryo ko O₂ aur nutrients deta hai aur CO₂ aur waste hataata hai. Umbilical cord se embryo se juda aur endocrine tissue ki tarah kaam karta hai."),
("Germ layers", "Inner cell mass se ectoderm, mesoderm aur endoderm bante hain, jinse saare tissues aur organs. Inner cell mass mein stem cells hote hain jo har tissue bana sakte hain."),
("Menarche and menopause", "Puberty par pehli menstruation menarche hai; lagbhag 50 saal ki umar mein cycles ruk jaate hain (menopause). Pregnancy mein cycles ruk jaate hain aur stress ya kharab sehat se irregular ho sakte hain."),
("Gestation", "Human pregnancy lagbhag 9 mahine ki hoti hai. Second trimester ke end tak foetus par baarik baal, eyelids alag aur eyelashes ban jaati hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
