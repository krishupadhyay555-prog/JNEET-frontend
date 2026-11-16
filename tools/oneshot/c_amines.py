from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "amines", "subject": "Chemistry",
"chapters": {"NEET": "Amines", "JEE": "Amines"},
"title": "Amines and Diazonium Salts", "readMinutes": 13,
"summary": [
"Amines are derivatives of ammonia: primary (RNH₂), secondary (R₂NH) and tertiary (R₃N). The nitrogen lone pair makes them bases and nucleophiles; nitrogen is sp³ and the molecule is pyramidal.",
"Aliphatic amines are stronger bases than ammonia (+I effect of alkyl groups); aromatic amines like aniline are much weaker (lone pair delocalised into the ring). In water the order is set by +I effect, solvation and steric hindrance together.",
"Primary, secondary and tertiary amines are told apart by the Hinsberg test, the carbylamine test (primary only) and their reactions with nitrous acid.",
"Aniline with NaNO₂/HCl at 0–5 °C gives benzenediazonium chloride, a versatile intermediate: Sandmeyer, Gattermann, coupling (azo dyes) and replacement by –OH, –I, –F, –H.",
],
"formulas": [
F("Reduction of nitro compounds", "ArNO₂ + Fe/HCl (or Sn/HCl, H₂/Pd) → ArNH₂", "Making aniline.", "Fe/HCl is preferred: the FeCl₂ formed is hydrolysed, releasing HCl, so only a little acid is needed."),
F("Gabriel phthalimide synthesis", "phthalimide + KOH → potassium phthalimide;  + RX → N-alkylphthalimide;  hydrolysis → RNH₂", "Pure primary aliphatic amines.", "Can't make aromatic amines (aryl halides don't undergo SN with phthalimide anion).", tag="PYQ favourite"),
F("Hoffmann bromamide degradation", "RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O", "Amine with one carbon less than the amide.", None, tag="PYQ favourite"),
F("Reduction of nitriles and amides", "RCN + LiAlH₄ (or H₂/Ni) → RCH₂NH₂ (one carbon more);  RCONH₂ + LiAlH₄ → RCH₂NH₂", "Ascending/same-carbon amines."),
F("Ammonolysis of alkyl halides", "RX + NH₃ → RNH₂ → R₂NH → R₃N → R₄N⁺X⁻", "Mixture of amines.", "Gives a mixture; a large excess of NH₃ favours the primary amine."),
F("Basicity in water (methyl)", "(CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃ > C₆H₅NH₂", "Comparing base strengths.", "In the gas phase the order is 3° > 2° > 1° > NH₃; in water solvation changes it."),
F("Basicity in water (ethyl)", "(C₂H₅)₂NH > (C₂H₅)₃N > C₂H₅NH₂ > NH₃", "Comparing ethylamines."),
F("Basicity of anilines", "p-toluidine > aniline > p-nitroaniline;  pKb larger = weaker base", "Substituent effects.", "Electron-donating groups increase basicity; −R/−I groups decrease it."),
F("Carbylamine test", "RNH₂ + CHCl₃ + 3KOH (alc.) → RNC (foul smell) + 3KCl + 3H₂O", "Test for primary amines only."),
F("Hinsberg test", "C₆H₅SO₂Cl:  1° → sulphonamide soluble in KOH;  2° → sulphonamide insoluble in KOH;  3° → no reaction", "Distinguishing 1°, 2°, 3° amines.", None, tag="PYQ favourite"),
F("Reaction with nitrous acid", "aliphatic 1° amine + HNO₂ → alcohol + N₂↑;  aniline + NaNO₂/HCl (273–278 K) → C₆H₅N₂⁺Cl⁻", "Making diazonium salts."),
F("Diazonium replacements", "CuCl/HCl → ArCl;  CuBr/HBr → ArBr;  CuCN/KCN → ArCN (Sandmeyer);  Cu/HX → ArX (Gattermann);  KI → ArI;  HBF₄, heat → ArF;  H₃PO₂ or ethanol → ArH;  warm water → ArOH", "Converting –NH₂ into other groups."),
F("Coupling reaction", "C₆H₅N₂⁺Cl⁻ + phenol (OH⁻) → p-hydroxyazobenzene (orange);  + aniline (H⁺) → p-aminoazobenzene (yellow)", "Azo dyes.", "Here the N≡N group is retained — unlike replacement reactions."),
],
"examples": [
X("Hoffmann product", "Propanamide is treated with Br₂ and NaOH. Product?",
  "Ethanamine, CH₃CH₂NH₂ — one carbon less than the amide (CH₃CH₂CONH₂).", []),
X("Distinguish 1°, 2°, 3°", "How do you tell ethylamine, diethylamine and triethylamine apart?",
  "Hinsberg reagent: ethylamine gives a KOH-soluble sulphonamide; diethylamine gives an insoluble one; triethylamine does not react. Only ethylamine gives the carbylamine (foul smell) test.", []),
X("Why is aniline a weak base?", "Explain why aniline is weaker than methylamine.",
  "In aniline the lone pair on N is delocalised into the benzene ring (resonance), so it is less available for H⁺. In methylamine the +I effect of CH₃ makes the lone pair more available.", []),
X("Bromination of aniline", "Aniline + bromine water? How to get only p-bromoaniline?",
  "Bromine water gives 2,4,6-tribromoaniline (white ppt) because –NH₂ strongly activates the ring. Protect –NH₂ by acetylation (acetanilide), brominate (p-product), then hydrolyse.", []),
X("Nitration of aniline", "Why does direct nitration of aniline give a large amount of m-nitroaniline?",
  "In strongly acidic medium aniline is protonated to the anilinium ion (–NH₃⁺), which is meta-directing. About 47% meta product forms with para and some ortho, plus oxidation products.", []),
X("Diazonium route", "Convert aniline to benzonitrile.",
  "Aniline + NaNO₂/HCl at 0–5 °C → benzenediazonium chloride; then CuCN/KCN (Sandmeyer) → C₆H₅CN.", []),
],
"topics": [
T("Structure and nomenclature", "Nitrogen in amines is sp³ with a lone pair; C–N–C angle about 108°. Common names: methylamine, aniline (benzenamine), N,N-dimethylaniline. IUPAC: alkanamine (ethanamine), N-methylethanamine."),
T("Physical properties", "Lower aliphatic amines are gases with a fishy smell. Primary and secondary amines form intermolecular hydrogen bonds; boiling points: 1° > 2° > 3° for isomeric amines. Tertiary amines have no N–H, so they cannot H-bond with each other."),
T("Acylation", "Primary and secondary amines react with acid chlorides or anhydrides (nucleophilic substitution) to give amides; pyridine removes HCl. Benzoylation uses benzoyl chloride. Acetylation reduces the activating effect of –NH₂."),
T("Electrophilic substitution of aniline", "–NH₂ is strongly activating and o/p-directing. Sulphonation gives sulphanilic acid, which exists as a zwitterion. Aniline does not undergo Friedel–Crafts reactions: it forms a salt with AlCl₃ (a Lewis acid), which deactivates the ring."),
T("Diazonium salts", "ArN₂⁺X⁻; stable only at 273–278 K because the positive charge is delocalised over the benzene ring (aliphatic diazonium salts are unstable). They are used straight away in solution and are important for making aromatic compounds and dyes."),
T("Importance in daily life", "Amines are found in proteins, vitamins, alkaloids and hormones; synthetic examples include drugs and dyes. Quaternary ammonium salts are used as detergents."),
],
"ratta": [
"Gabriel: only 1° aliphatic amines.",
"Hoffmann bromamide: one carbon less.",
"Water: 2° > 1° > 3° > NH₃ (methyl);  aniline weakest.",
"Carbylamine: only 1° amines (foul smell).",
"Hinsberg: 1° soluble in KOH, 2° insoluble, 3° no reaction.",
"Diazotisation at 0–5 °C (273–278 K).",
"Sandmeyer CuX;  Gattermann Cu/HX;  H₃PO₂ → ArH.",
"Aniline: no Friedel–Crafts; nitration gives ~47% meta.",
],
}

SYLLABUS = [
("Amines: nomenclature, classification, structure, basic character and identification of primary, secondary and tertiary amines and their basic character", ["nomenclature", "basic", "primary", "secondary", "tertiary"]),
("Preparation and properties of amines", ["Gabriel", "Hoffmann"]),
("Diazonium salts: importance in synthetic organic chemistry", ["diazonium", "Sandmeyer", "coupling"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Amines ammonia ke derivatives hain: primary (RNH₂), secondary (R₂NH) aur tertiary (R₃N) — inki nomenclature aur classification isi par. Nitrogen ka lone pair inhe bases (basic nature) aur nucleophiles banata hai; nitrogen sp³ aur molecule pyramidal.",
"Aliphatic amines ammonia se strong bases hain (alkyl groups ka +I effect); aniline jaise aromatic amines bahut kamzor (lone pair ring mein delocalised). Paani mein order +I effect, solvation aur steric hindrance milkar tay karte hain.",
"Primary, secondary aur tertiary amines ko Hinsberg test, carbylamine test (sirf primary) aur nitrous acid ke saath reactions se alag karte hain.",
"0–5 °C par aniline NaNO₂/HCl se benzenediazonium chloride banata hai, ek bahut kaam ka intermediate: Sandmeyer, Gattermann, coupling (azo dyes) aur –OH, –I, –F, –H se replacement.",
],
when=[
("Aniline banana.", "Fe/HCl pasand kiya jaata hai: bana FeCl₂ hydrolyse hokar HCl deta hai, isliye thoda hi acid chahiye — yaad rakho."),
("Pure primary aliphatic amines.", "Aromatic amines nahi ban sakte (aryl halides phthalimide anion ke saath SN nahi karte) — galat mat lo."),
("Amide se ek carbon kam wala amine.", None),
("Ascending/same-carbon amines.", None),
("Amines ka mixture.", "Mixture banta hai; NH₃ ki bahut zyada maatra primary amine ko badhaati hai — dhyan rakho."),
("Base strengths compare karna.", "Gas phase mein order 3° > 2° > 1° > NH₃; paani mein solvation ise badal deta hai — dono mix mat karo."),
("Ethylamines compare karna.", None),
("Substituent effects.", "Electron-donating groups basicity badhaate hain; −R/−I groups ghataate hain — ulta mat lo."),
("Sirf primary amines ka test.", None),
("1°, 2°, 3° amines alag karna.", None),
("Diazonium salts banana.", None),
("–NH₂ ko doosre groups mein badalna.", None),
("Azo dyes.", "Yahan N≡N group bacha rehta hai — replacement reactions ke ulta, confuse mat karo."),
],
examples=[
("Hoffmann product", "Propanamide ko Br₂ aur NaOH ke saath. Product?",
 "Ethanamine, CH₃CH₂NH₂ — amide (CH₃CH₂CONH₂) se ek carbon kam."),
("1°, 2°, 3° alag karo", "Ethylamine, diethylamine aur triethylamine ko kaise alag karoge?",
 "Hinsberg reagent: ethylamine KOH mein ghulne wala sulphonamide; diethylamine na ghulne wala; triethylamine react nahi karta. Sirf ethylamine carbylamine (badboo) test deta hai."),
("Aniline kamzor base kyun?", "Aniline methylamine se kamzor kyun hai?",
 "Aniline mein N ka lone pair benzene ring mein delocalised hai (resonance), isliye H⁺ ke liye kam available. Methylamine mein CH₃ ka +I effect lone pair ko zyada available banata hai."),
("Aniline ka bromination", "Aniline + bromine water? Sirf p-bromoaniline kaise banaoge?",
 "Bromine water 2,4,6-tribromoaniline (safed ppt) deta hai kyunki –NH₂ ring ko bahut activate karta hai. –NH₂ ko acetylation se bachao (acetanilide), brominate karo (p-product), phir hydrolyse karo."),
("Aniline ka nitration", "Seedhe nitration mein bahut saara m-nitroaniline kyun banta hai?",
 "Strong acidic medium mein aniline protonate hokar anilinium ion (–NH₃⁺) banta hai jo meta-directing hai. Lagbhag 47% meta product, para aur thoda ortho ke saath, plus oxidation products."),
("Diazonium route", "Aniline ko benzonitrile mein badlo.",
 "Aniline + NaNO₂/HCl 0–5 °C par → benzenediazonium chloride; phir CuCN/KCN (Sandmeyer) → C₆H₅CN."),
],
topics=[
("Structure and nomenclature", "Amines mein nitrogen sp³ aur lone pair ke saath; C–N–C angle ~108°. Common names: methylamine, aniline (benzenamine), N,N-dimethylaniline. IUPAC: alkanamine (ethanamine), N-methylethanamine."),
("Physical properties", "Chhote aliphatic amines machhli jaisi gandh wali gases. Primary aur secondary amines intermolecular hydrogen bonds banate hain; isomeric amines ke boiling points: 1° > 2° > 3°. Tertiary amines mein N–H nahi, isliye aapas mein H-bond nahi."),
("Acylation", "Primary aur secondary amines acid chlorides ya anhydrides ke saath (nucleophilic substitution) amides banate hain; pyridine HCl hataata hai. Benzoylation benzoyl chloride se. Acetylation –NH₂ ka activating effect kam karta hai."),
("Electrophilic substitution of aniline", "–NH₂ strongly activating aur o/p-directing. Sulphonation se sulphanilic acid jo zwitterion ki tarah rehta hai. Aniline Friedel–Crafts nahi karta: AlCl₃ (Lewis acid) ke saath salt banata hai jo ring ko deactivate karta hai."),
("Diazonium salts", "ArN₂⁺X⁻; sirf 273–278 K par stable kyunki positive charge benzene ring par delocalised (aliphatic diazonium salts unstable). Solution mein turant use hote hain aur aromatic compounds aur dyes banane mein bahut important."),
("Importance in daily life", "Amines proteins, vitamins, alkaloids aur hormones mein milte hain; synthetic examples mein drugs aur dyes. Quaternary ammonium salts detergents ki tarah use hote hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
