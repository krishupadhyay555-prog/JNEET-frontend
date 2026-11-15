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
F("Oogenesis", "oogonia form in foetal life → primary oocyte (arrested in prophase I) in primary follicle → at puberty → secondary oocyte (n) + first polar body (Graafian follicle) → ovulation → meiosis II completes only after sperm entry → ovum + second polar body", "Egg formation.", "At birth ovaries have about 60,000–80,000 primary follicles; no new oogonia form after birth."),
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

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
