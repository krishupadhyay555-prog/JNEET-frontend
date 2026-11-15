from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "reproductive-health", "subject": "Biology",
"chapters": {"NEET": "Reproductive Health"},
"title": "Reproductive Health", "readMinutes": 11,
"summary": [
"Reproductive health (WHO) means total well-being in all aspects of reproduction — physical, emotional, behavioural and social. India was among the first countries to start national family planning (1951), later broadened into RCH (Reproductive and Child Health Care) programmes.",
"Contraceptive methods are natural, barrier, IUDs, oral pills, injectables/implants and surgical (sterilisation). An ideal contraceptive is user-friendly, easily available, effective, reversible and has few side effects.",
"Medical termination of pregnancy (MTP) is legal in India under specified conditions (MTP Amendment Act, 2017).",
"Sexually transmitted infections (STIs) and infertility are major concerns; assisted reproductive technologies (ART) such as IVF, ZIFT, GIFT, ICSI, AI and IUI help infertile couples.",
],
"formulas": [
F("Natural methods", "periodic abstinence (days 10–17 of cycle);  withdrawal (coitus interruptus);  lactational amenorrhea (up to 6 months after parturition with full breastfeeding)", "No devices or drugs.", "These have high failure rates."),
F("Barrier methods", "condoms (male — 'Nirodh'; female), diaphragms, cervical caps, vaults (reusable) + spermicidal creams/jellies", "Prevent sperm and ovum meeting.", "Condoms also protect against STIs and AIDS."),
F("IUD types", "non-medicated (Lippes loop);  copper-releasing (CuT, Cu7, Multiload 375);  hormone-releasing (Progestasert, LNG-20)", "Intra-uterine devices.", None, tag="PYQ favourite"),
F("How IUDs work", "increase phagocytosis of sperm in the uterus;  Cu ions suppress sperm motility and fertilising capacity;  hormone IUDs make the uterus unsuitable for implantation and the cervix hostile to sperm", "IUD mechanism."),
F("Oral pills", "progestogens or progestogen–oestrogen combinations; taken daily for 21 days starting within the first 5 days of the cycle;  inhibit ovulation and implantation, alter cervical mucus;  Saheli (non-steroidal, once a week, CDRI Lucknow)", "Hormonal contraception.", None, tag="PYQ favourite"),
F("Emergency contraception", "progestogens or progestogen–oestrogen combinations, or IUDs, within 72 hours of coitus", "After unprotected intercourse."),
F("Surgical methods", "vasectomy (part of vas deferens removed/tied);  tubectomy (part of fallopian tube removed/tied)", "Terminal (sterilisation) methods.", "They are very effective but reversibility is poor."),
F("MTP", "safe in the first trimester (up to 12 weeks);  MTP Amendment Act 2017: up to 12 weeks with one registered medical practitioner's opinion, 12–24 weeks with two", "Medical termination of pregnancy."),
F("STIs", "gonorrhoea, syphilis, genital herpes, chlamydiasis, genital warts, trichomoniasis, hepatitis B, HIV/AIDS;  hepatitis B, genital herpes and HIV are not completely curable", "Sexually transmitted infections.", None, tag="PYQ favourite"),
F("ART methods", "IVF + ET (test-tube baby): ZIFT — zygote or early embryo (up to 8 blastomeres) into fallopian tube;  IUT — embryo with more than 8 blastomeres into uterus;  GIFT — ovum from donor into fallopian tube;  ICSI — sperm injected into ovum;  AI/IUI — semen into vagina or uterus", "Assisted reproductive technologies.", None, tag="PYQ favourite"),
F("Amniocentesis", "testing cells in amniotic fluid for genetic disorders; misused for foetal sex determination — legally banned in India", "Prenatal diagnosis."),
],
"examples": [
X("Which ART?", "A woman cannot produce ova but can provide a suitable environment for fertilisation. Which method?",
  "GIFT — an ovum from a donor is transferred into her fallopian tube.", []),
X("Low sperm count", "The husband has a very low sperm count. Which ART suits best?",
  "Artificial insemination (AI) or intra-uterine insemination (IUI) with the husband's or donor's semen; ICSI if sperm can't fertilise on their own.", []),
X("ZIFT vs IUT", "What is the difference between ZIFT and IUT?",
  "ZIFT: zygote or embryo with up to 8 blastomeres goes into the fallopian tube. IUT: embryo with more than 8 blastomeres goes into the uterus.", []),
X("Why lactational amenorrhea works", "Why is there no ovulation during intense breastfeeding?",
  "Ovulation and menstrual cycles don't occur during intense lactation after parturition; this is effective only up to about six months after birth.", []),
X("Saheli", "What is special about Saheli?",
  "It is a non-steroidal oral contraceptive taken once a week, developed at the Central Drug Research Institute (CDRI), Lucknow.", []),
X("Preventing STIs", "List simple ways to prevent STIs.",
  "Avoid sex with unknown or multiple partners; always use condoms; seek a doctor early in case of doubt for early detection and complete cure.", []),
],
"topics": [
T("Reproductive health problems and strategies", "Programmes create awareness about reproduction-related aspects, sex education in schools, birth control, care of pregnant mothers, post-natal care, importance of breastfeeding, equal opportunities for male and female children. Successful steps include lower maternal and infant mortality, smaller families, better detection and cure of STDs."),
T("Population explosion", "World population was about 2 billion in 1900 and over 7.2 billion around 2011. India's population was about 350 million at independence and over 1.2 billion by 2011. Reasons: declining death rate, maternal mortality rate (MMR) and infant mortality rate (IMR), and more people in reproducible age. Statutory raising of marriageable age — 18 years for females and 21 for males."),
T("Contraceptives and side effects", "Possible side effects include nausea, abdominal pain, breakthrough bleeding, irregular menstrual bleeding and even breast cancer — so they must be used under medical advice."),
T("Why MTP is needed", "To avoid unwanted pregnancies due to casual intercourse or contraceptive failure, or when continuing the pregnancy could harm the mother or foetus. Misuse includes illegal female foeticide; unqualified quacks make illegal MTPs unsafe."),
T("Infertility", "Inability to conceive despite unprotected sexual cohabitation; causes can be physical, congenital, diseases, drugs, immunological or psychological, and can be in either partner. Specialised health clinics help diagnose and correct some disorders."),
T("Complications of untreated STIs", "Pelvic inflammatory diseases (PID), abortions, still births, ectopic pregnancies, infertility and even cancer of the reproductive tract."),
],
"ratta": [
"Family planning in India: 1951 → RCH.",
"Copper IUDs: CuT, Cu7, Multiload 375;  hormonal: Progestasert, LNG-20.",
"Pills: 21 days, start in first 5 days;  Saheli weekly (CDRI).",
"Emergency contraception within 72 h.",
"MTP safe in first trimester (12 weeks).",
"ZIFT ≤ 8 blastomeres → tube;  IUT > 8 → uterus;  GIFT donor ovum → tube.",
"Hep B, herpes, HIV not fully curable.",
],
}

SYLLABUS = [
("Need for reproductive health and prevention of STDs", ["reproductive health", "STI"]),
("Birth control — need and methods, contraception", ["contraceptive", "IUD", "barrier"]),
("Medical termination of pregnancy (MTP)", ["MTP"]),
("Amniocentesis", ["amniocentesis"]),
("Infertility and assisted reproductive technologies — IVF, ZIFT, GIFT", ["infertility", "IVF", "ZIFT", "GIFT"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
