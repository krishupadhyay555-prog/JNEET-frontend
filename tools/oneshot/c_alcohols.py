from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "alcohols-phenols-and-ethers", "subject": "Chemistry",
"chapters": {"NEET": "Alcohols, Phenols and Ethers", "JEE": "Alcohols, Phenols and Ethers"},
"title": "Alcohols, Phenols and Ethers", "readMinutes": 15,
"summary": [
"Alcohols (R–OH) and phenols (Ar–OH) have an –OH group; ethers (R–O–R′) have oxygen between two carbons. Hydrogen bonding gives alcohols and phenols high boiling points and some water solubility.",
"Phenols are much more acidic than alcohols because the phenoxide ion is resonance-stabilised; electron-withdrawing groups (–NO₂) at ortho/para make phenol even more acidic.",
"Alcohols react by breaking O–H (acidity, esterification) or C–O (substitution, dehydration). The Lucas test distinguishes primary, secondary and tertiary alcohols.",
"The –OH group strongly activates the benzene ring of phenol towards electrophilic substitution (bromine water gives 2,4,6-tribromophenol). Named reactions: Kolbe, Reimer–Tiemann, Williamson synthesis.",
],
"formulas": [
F("Alcohols from alkenes", "acid-catalysed hydration (Markovnikov);  hydroboration–oxidation (B₂H₆ then H₂O₂/OH⁻) gives anti-Markovnikov alcohols", "Preparation of alcohols."),
F("Alcohols from carbonyls", "RCHO + H₂/Ni or NaBH₄/LiAlH₄ → 1° alcohol;  R₂CO → 2° alcohol;  RCOOH + LiAlH₄ → 1° alcohol", "Reduction routes."),
F("Grignard route", "HCHO + RMgX → 1° alcohol;  other aldehydes → 2°;  ketones → 3° (after hydrolysis)", "Building alcohols with new C–C bonds.", None, tag="PYQ favourite"),
F("Acidity order", "p-nitrophenol > phenol > water > ethanol (1° > 2° > 3° alcohol)", "Comparing acid strengths.", "Electron-donating groups (–CH₃) decrease phenol's acidity; electron-withdrawing groups (–NO₂) increase it."),
F("Lucas test", "conc. HCl + anhydrous ZnCl₂:  3° turbidity immediately;  2° within ~5 min;  1° only on heating", "Distinguishing 1°, 2°, 3° alcohols.", None, tag="PYQ favourite"),
F("Dehydration of alcohols", "conc. H₂SO₄ heat: ethanol → ethene (443 K) or diethyl ether (413 K);  ease 3° > 2° > 1°", "Alkenes and ethers from alcohols.", "Temperature decides the product: higher gives the alkene, lower gives the ether."),
F("Oxidation of alcohols", "1° → aldehyde (PCC) → acid (KMnO₄);  2° → ketone;  3° resist oxidation;  Cu at 573 K: 1° → aldehyde, 2° → ketone, 3° → alkene", "Identifying the alcohol type from products."),
F("Phenol preparation", "cumene process (cumene → cumene hydroperoxide → phenol + acetone);  from diazonium salts (warm water);  from chlorobenzene (Dow's process)", "Making phenol."),
F("Kolbe's reaction", "sodium phenoxide + CO₂ (4–7 atm, 400 K), then H⁺ → salicylic acid", "Carboxylation of phenol."),
F("Reimer–Tiemann reaction", "phenol + CHCl₃ + aq. NaOH, then H⁺ → salicylaldehyde", "Introducing –CHO at the ortho position.", None, tag="PYQ favourite"),
F("Bromination of phenol", "bromine water → 2,4,6-tribromophenol (white ppt);  Br₂ in CS₂ (low temperature) → o- and p-bromophenol", "Effect of solvent on halogenation."),
F("Williamson synthesis", "R–X + R′ONa → R–O–R′ + NaX", "Making ethers.", "Use a 1° alkyl halide — with 3° halides elimination (alkene) dominates."),
F("Cleavage of ethers by HI", "R–O–CH₃ + HI → R–OH + CH₃I (I⁻ attacks the less hindered carbon);  anisole + HI → phenol + CH₃I", "Products of ether cleavage.", "The aryl–O bond never breaks: anisole gives phenol, not iodobenzene."),
],
"examples": [
X("Grignard synthesis", "Which carbonyl compound and Grignard reagent give 2-methylpropan-2-ol?",
  "Acetone + CH₃MgBr, then hydrolysis → (CH₃)₃COH (a ketone gives a 3° alcohol).", []),
X("Acidity", "Arrange: ethanol, phenol, p-nitrophenol, p-cresol.",
  "p-Nitrophenol > phenol > p-cresol > ethanol (–NO₂ stabilises phenoxide; –CH₃ destabilises it; ethoxide has no resonance).", []),
X("Lucas test", "Three alcohols give turbidity: one at once, one after 5 minutes, one only on heating. Identify their types.",
  "Immediate: tertiary (2-methylpropan-2-ol); about 5 min: secondary (butan-2-ol); on heating: primary (butan-1-ol).", []),
X("Steam volatility", "Why is o-nitrophenol steam volatile but p-nitrophenol not?",
  "o-Nitrophenol has intramolecular hydrogen bonding, so its molecules don't associate. p-Nitrophenol forms intermolecular H-bonds, which raise its boiling point.", []),
X("Ether cleavage", "Products of anisole + HI?",
  "Phenol + methyl iodide. The O–aryl bond has partial double-bond character, so I⁻ attacks the methyl carbon.", []),
X("Williamson choice", "To make tert-butyl methyl ether, which pair: (CH₃)₃CBr + CH₃ONa or CH₃Br + (CH₃)₃CONa?",
  "CH₃Br + (CH₃)₃CONa. A 3° halide with a strong base would undergo elimination to isobutylene.", []),
],
"topics": [
T("Classification and structure", "Alcohols: monohydric, dihydric, trihydric; primary, secondary, tertiary; allylic and benzylic. In alcohols O is sp³ with the C–O–H angle slightly less than tetrahedral; in phenols the C–O bond is shorter (partial double-bond character)."),
T("Physical properties", "Boiling points of alcohols are much higher than those of hydrocarbons and ethers of similar mass (hydrogen bonding); they fall with branching. Lower alcohols mix with water; solubility falls as the alkyl part grows."),
T("Reactions of the O–H bond", "Alcohols react with active metals (Na) to give H₂ and alkoxides, and with acids, anhydrides or acid chlorides to form esters (esterification). Phenol also reacts with NaOH (alcohols don't), showing its acidic nature is stronger."),
T("Electrophilic substitution of phenol", "–OH activates the ring at ortho/para. Nitration with dilute HNO₃ gives o- and p-nitrophenol; concentrated HNO₃ gives picric acid (2,4,6-trinitrophenol). Sulphonation with conc. H₂SO₄ gives o-phenolsulphonic acid at low temperature and the p-isomer at higher temperature. Oxidation with chromic acid gives benzoquinone."),
T("Mechanism of dehydration", "Protonation of –OH, loss of water to form a carbocation (slow step), then loss of H⁺ to form the alkene. Because a carbocation forms, the ease is tertiary > secondary > primary and rearrangements can occur."),
T("Commercially important alcohols", "Methanol (wood spirit) is poisonous: it causes blindness and death. Ethanol is made by fermentation of sugars (invertase, zymase); denatured alcohol is made unfit to drink with CuSO₄ and pyridine."),
T("Ethers", "Prepared by Williamson synthesis or dehydration of alcohols. Less polar, with lower boiling points than isomeric alcohols. –OR activates the ring in anisole (o/p-directing) for halogenation, nitration and Friedel–Crafts reactions."),
],
"ratta": [
"Acidity: p-nitrophenol > phenol > water > ethanol.",
"Lucas: 3° immediate, 2° ~5 min, 1° on heating.",
"HCHO → 1°, RCHO → 2°, ketone → 3° (Grignard).",
"Ethanol + H₂SO₄: 443 K ethene, 413 K ether.",
"Kolbe → salicylic acid;  Reimer–Tiemann → salicylaldehyde.",
"Br₂ water + phenol → 2,4,6-tribromophenol (white).",
"Williamson: 1° halide + alkoxide;  anisole + HI → phenol + CH₃I.",
],
}

SYLLABUS = [
("Alcohols: identification of primary, secondary and tertiary alcohols; mechanism of dehydration", ["primary", "secondary", "tertiary", "dehydration"]),
("Phenols: acidic nature, electrophilic substitution reactions: halogenation, nitration and sulphonation; Reimer–Tiemann reaction", ["acidic", "halogenation", "nitration", "sulphonation", "Reimer"]),
("Ethers: structure", ["ether"]),
("Preparation, properties and reactions of alcohols, phenols and ethers", ["preparation", "Williamson", "Kolbe"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Alcohols (R–OH) aur phenols (Ar–OH) mein –OH group hai; ether (R–O–R′) mein oxygen do carbons ke beech. Hydrogen bonding alcohols aur phenols ko high boiling point aur thodi water solubility deti hai.",
"Phenols alcohols se kaafi zyada acidic hain kyunki phenoxide ion resonance se stable hai; ortho/para par electron-withdrawing groups (–NO₂) phenol ko aur acidic banate hain.",
"Alcohols O–H todkar (acidic nature, esterification) ya C–O todkar (substitution, dehydration) react karte hain. Lucas test primary, secondary aur tertiary alcohols ko alag karta hai.",
"–OH group phenol ki benzene ring ko electrophilic substitution ke liye bahut activate karta hai (bromine water se 2,4,6-tribromophenol). Named reactions: Kolbe, Reimer–Tiemann, Williamson synthesis.",
],
when=[
("Alcohols ki preparation.", None),
("Reduction routes.", None),
("Naye C–C bonds ke saath alcohols banana.", None),
("Acid strengths compare karna.", "Electron-donating groups (–CH₃) phenol ki acidity GHATAATE hain; electron-withdrawing (–NO₂) badhaate hain — ulta mat lo."),
("1°, 2°, 3° alcohols alag karna.", None),
("Alcohols se alkenes aur ethers.", "Temperature product tay karta hai: zyada par alkene, kam par ether — mix mat karo."),
("Products se alcohol ka type pehchaanna.", None),
("Phenol banana.", None),
("Phenol ka carboxylation.", None),
("Ortho position par –CHO laana.", None),
("Halogenation par solvent ka effect.", None),
("Ethers banana.", "1° alkyl halide lo — 3° halides ke saath elimination (alkene) haavi hota hai, ether nahi banta."),
("Ether cleavage ke products.", "Aryl–O bond kabhi nahi toot-ta: anisole se phenol banta hai, iodobenzene nahi."),
],
examples=[
("Grignard synthesis", "Kaunsa carbonyl compound aur Grignard reagent 2-methylpropan-2-ol dega?",
 "Acetone + CH₃MgBr, phir hydrolysis → (CH₃)₃COH (ketone se 3° alcohol)."),
("Acidity", "Order: ethanol, phenol, p-nitrophenol, p-cresol.",
 "p-Nitrophenol > phenol > p-cresol > ethanol (–NO₂ phenoxide ko stable karta hai; –CH₃ destabilise; ethoxide mein resonance nahi)."),
("Lucas test", "Teen alcohols turbidity dete hain: ek turant, ek 5 minute baad, ek sirf garam karne par. Types?",
 "Turant: tertiary (2-methylpropan-2-ol); ~5 min: secondary (butan-2-ol); garam karne par: primary (butan-1-ol)."),
("Steam volatility", "o-Nitrophenol steam volatile kyun hai par p-nitrophenol nahi?",
 "o-Nitrophenol mein intramolecular hydrogen bonding hai, isliye molecules aapas mein nahi judte. p-Nitrophenol intermolecular H-bonds banata hai jo boiling point badhaate hain."),
("Ether cleavage", "Anisole + HI ke products?",
 "Phenol + methyl iodide. O–aryl bond partial double bond jaisa hai, isliye I⁻ methyl carbon par attack karta hai."),
("Williamson choice", "tert-Butyl methyl ether banane ke liye kaunsa pair: (CH₃)₃CBr + CH₃ONa ya CH₃Br + (CH₃)₃CONa?",
 "CH₃Br + (CH₃)₃CONa. Strong base ke saath 3° halide elimination karke isobutylene dega."),
],
topics=[
("Classification and structure", "Alcohols: monohydric, dihydric, trihydric; primary, secondary, tertiary; allylic aur benzylic. Alcohols mein O sp³, C–O–H angle tetrahedral se thoda kam; phenols mein C–O bond chhota (partial double-bond character)."),
("Physical properties", "Alcohols ke boiling points same mass ke hydrocarbons aur ethers se kaafi zyada (hydrogen bonding); branching se ghat-te hain. Chhote alcohols paani mein mil jaate hain; alkyl hissa badhne par solubility ghatti hai."),
("Reactions of the O–H bond", "Alcohols active metals (Na) se H₂ aur alkoxides dete hain, aur acids, anhydrides ya acid chlorides se esters (esterification). Phenol NaOH se bhi react karta hai (alcohols nahi), yaani uski acidic nature zyada strong hai."),
("Electrophilic substitution of phenol", "–OH ring ko ortho/para par activate karta hai. Dilute HNO₃ se nitration → o- aur p-nitrophenol; concentrated HNO₃ → picric acid (2,4,6-trinitrophenol). Conc. H₂SO₄ se sulphonation kam temperature par o-phenolsulphonic acid aur zyada par p-isomer. Chromic acid se oxidation → benzoquinone."),
("Mechanism of dehydration", "–OH ka protonation, paani nikal kar carbocation (slow step), phir H⁺ nikal kar alkene. Carbocation banne ki wajah se aasaani tertiary > secondary > primary aur rearrangements ho sakte hain."),
("Commercially important alcohols", "Methanol (wood spirit) zehreela: andhapan aur maut. Ethanol cheeni ke fermentation (invertase, zymase) se; denatured alcohol CuSO₄ aur pyridine milakar peene layak nahi rakhte."),
("Ethers", "Williamson synthesis ya alcohols ke dehydration se. Kam polar, isomeric alcohols se kam boiling point. Anisole mein –OR ring ko activate karta hai (o/p-directing) halogenation, nitration aur Friedel–Crafts ke liye."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
