from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "haloalkanes-and-haloarenes", "subject": "Chemistry",
"chapters": {"NEET": "Haloalkanes and Haloarenes", "JEE": "Haloalkanes and Haloarenes"},
"title": "Haloalkanes and Haloarenes", "readMinutes": 14,
"summary": [
"In haloalkanes the C–X bond is polar (Cδ⁺–Xδ⁻), so the carbon is attacked by nucleophiles. Reactivity of R–X: R–I > R–Br > R–Cl > R–F (weaker bond, better leaving group).",
"Nucleophilic substitution goes by SN2 (one step, backside attack, inversion, favoured by 1° halides) or SN1 (carbocation, racemisation, favoured by 3° halides and polar protic solvents).",
"With alcoholic KOH, haloalkanes undergo elimination (dehydrohalogenation) to alkenes; the more substituted alkene is the major product (Saytzeff rule).",
"Haloarenes are much less reactive to nucleophiles (partial C=X double bond from resonance, sp² carbon). They undergo electrophilic substitution at ortho/para positions.",
],
"formulas": [
F("From alcohols", "ROH + HX (ZnCl₂ for HCl) → RX;  ROH + PCl₅/PCl₃/SOCl₂ → RCl", "Preparation of alkyl halides.", "SOCl₂ is best: by-products SO₂ and HCl are gases, leaving pure RCl."),
F("Finkelstein reaction", "R–Cl/Br + NaI (dry acetone) → R–I + NaCl/NaBr", "Making alkyl iodides."),
F("Swarts reaction", "R–Br + AgF/Hg₂F₂/CoF₂/SbF₃ → R–F", "Making alkyl fluorides."),
F("Sandmeyer reaction", "C₆H₅N₂⁺Cl⁻ + CuCl/HCl → C₆H₅Cl + N₂  (CuBr/HBr → C₆H₅Br)", "Haloarenes from diazonium salts.", None, tag="PYQ favourite"),
F("SN2 mechanism", "rate = k[RX][Nu⁻];  one step;  inversion (Walden);  CH₃X > 1° > 2° > 3°", "Primary halides with strong nucleophiles in aprotic solvents.", "Steric hindrance stops SN2 at 3° carbons.", tag="PYQ favourite"),
F("SN1 mechanism", "rate = k[RX];  carbocation intermediate;  racemisation;  3° > 2° > 1° > CH₃X", "Tertiary/benzylic/allylic halides in polar protic solvents."),
F("Elimination (dehydrohalogenation)", "R–CH₂–CH₂X + alc. KOH → R–CH=CH₂ + KX + H₂O", "Making alkenes.", "Aqueous KOH → substitution (alcohol); alcoholic KOH → elimination (alkene)."),
F("Saytzeff (Zaitsev) rule", "the more substituted alkene is the major product of elimination", "Predicting the major alkene."),
F("Ambident nucleophiles", "KCN → R–CN (alkyl cyanide);  AgCN → R–NC (isocyanide);  KNO₂ → R–ONO;  AgNO₂ → R–NO₂", "Products with cyanide/nitrite salts."),
F("Wurtz–Fittig and Fittig", "ArX + RX + 2Na → Ar–R;  2ArX + 2Na → Ar–Ar", "Coupling with sodium."),
F("Grignard reagent", "R–X + Mg (dry ether) → RMgX;  RMgX + H₂O → R–H", "Making alkanes and C–C bonds.", "Must be kept dry — any water (or –OH, –NH) destroys it."),
F("Nucleophilic substitution in haloarenes", "needs drastic conditions (Dow's process: 623 K, 300 atm) unless –NO₂ groups are at ortho/para", "Phenol from chlorobenzene.", "o/p-NO₂ groups make it much easier; meta-NO₂ has little effect."),
],
"examples": [
X("SN1 or SN2?", "Which reacts faster with OH⁻ by SN2: CH₃Br or (CH₃)₃CBr?",
  "CH₃Br — no steric hindrance for the backside attack. (CH₃)₃CBr reacts by SN1 instead, through a stable 3° carbocation.", []),
X("Stereochemistry", "(R)-2-bromobutane reacts with OH⁻ by SN2. Product?",
  "(S)-butan-2-ol: SN2 inverts the configuration. By SN1 a nearly racemic mixture would form.", []),
X("Major alkene", "2-Bromobutane with alcoholic KOH. Major product?",
  "But-2-ene (more substituted) is major (Saytzeff); but-1-ene is minor.", []),
X("KCN vs AgCN", "CH₃CH₂Br with KCN and with AgCN?",
  "KCN (ionic, C attacks) → CH₃CH₂CN; AgCN (covalent, N attacks) → CH₃CH₂NC.", []),
X("Why is chlorobenzene unreactive?", "Explain why chlorobenzene resists nucleophilic substitution.",
  "Resonance gives the C–Cl bond partial double-bond character, the carbon is sp² (holds electrons tightly), the phenyl cation is unstable, and the electron-rich ring repels nucleophiles.", []),
X("Finkelstein", "Convert ethyl chloride to ethyl iodide.",
  "Heat with NaI in dry acetone: C₂H₅Cl + NaI → C₂H₅I + NaCl (NaCl precipitates, driving the reaction).", []),
],
"topics": [
T("Classification and nomenclature", "Mono-, di-, polyhalo compounds; alkyl (1°, 2°, 3°), allylic, benzylic, vinylic and aryl halides. Vinylic and aryl halides have X on an sp² carbon and are unreactive in SN reactions."),
T("Physical properties", "Boiling points rise with size of halogen (RI > RBr > RCl > RF) and chain length, and fall with branching. Haloalkanes are only slightly soluble in water. p-Dichlorobenzene melts higher than the o- and m-isomers (symmetrical, packs better)."),
T("Factors deciding SN1 vs SN2", "Substrate: 1° → SN2, 3° → SN1, 2° → both. Strong nucleophiles and aprotic solvents favour SN2; weak nucleophiles and polar protic solvents (water, alcohols) favour SN1. Benzylic and allylic halides react fast by SN1 (resonance-stabilised carbocations)."),
T("Optical activity basics", "A chiral molecule (carbon with four different groups) is non-superimposable on its mirror image and rotates plane-polarised light. Enantiomers rotate equally in opposite directions; a 50:50 mixture (racemic) is optically inactive."),
T("Electrophilic substitution in haloarenes", "Halogen is deactivating but o/p-directing: chlorobenzene gives o- and p-products in halogenation, nitration, sulphonation and Friedel–Crafts reactions (p major)."),
T("Polyhalogen compounds and environment", "CH₂Cl₂ (solvent), CHCl₃ (chloroform, once an anaesthetic; stored in dark bottles because it forms poisonous phosgene in light), CHI₃ (iodoform, antiseptic), CCl₄ (solvent, harms the ozone layer), freons (CFCs, refrigerants, ozone depletion) and DDT (insecticide, persists in food chains)."),
],
"ratta": [
"Reactivity: RI > RBr > RCl > RF.",
"SN2: 1°, inversion, one step;  SN1: 3°, racemisation, carbocation.",
"Aq. KOH → alcohol;  alc. KOH → alkene (Saytzeff).",
"KCN → RCN;  AgCN → RNC;  KNO₂ → RONO;  AgNO₂ → RNO₂.",
"Finkelstein (NaI/acetone);  Swarts (AgF);  Sandmeyer (CuX).",
"Haloarenes: o/p-directing, deactivating.",
"CHCl₃ in light → phosgene.",
],
}

SYLLABUS = [
("General methods of preparation, properties and reactions", ["preparation"]),
("Nature of C–X bond", ["C–X"]),
("Mechanisms of substitution reactions (SN1 and SN2)", ["SN1", "SN2"]),
("Uses; environmental effects of chloroform, iodoform, freons and DDT", ["chloroform", "iodoform", "freon", "DDT"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Haloalkanes mein C–X bond polar hai (Cδ⁺–Xδ⁻), isliye carbon par nucleophiles attack karte hain. R–X ki reactivity: R–I > R–Br > R–Cl > R–F (kamzor bond, achha leaving group).",
"Nucleophilic substitution SN2 (ek step, peeche se attack, inversion, 1° halides pasand) ya SN1 (carbocation, racemisation, 3° halides aur polar protic solvents pasand) se hota hai.",
"Alcoholic KOH ke saath haloalkanes elimination (dehydrohalogenation) karke alkenes banate hain; zyada substituted alkene major hota hai (Saytzeff rule).",
"Haloarenes nucleophiles ke prati bahut kam reactive hain (resonance se C=X par partial double bond, sp² carbon). Ye ortho/para par electrophilic substitution karte hain.",
],
when=[
("Alkyl halides ki preparation.", "SOCl₂ sabse achha: by-products SO₂ aur HCl gases hain, pure RCl bachta hai — yaad rakho."),
("Alkyl iodides banana.", None),
("Alkyl fluorides banana.", None),
("Diazonium salts se haloarenes.", None),
("Strong nucleophile aur aprotic solvent ke saath primary halides.", "Steric hindrance 3° carbon par SN2 rok deta hai — wahan SN2 mat lagao."),
("Polar protic solvents mein tertiary/benzylic/allylic halides.", None),
("Alkenes banana.", "Aqueous KOH → substitution (alcohol); alcoholic KOH → elimination (alkene) — confuse mat karo."),
("Major alkene predict karna.", None),
("Cyanide/nitrite salts ke products.", None),
("Sodium ke saath coupling.", None),
("Alkanes aur C–C bonds banana.", "Bilkul dry rakhna zaroori — thoda bhi paani (ya –OH, –NH) ise nasht kar deta hai."),
("Chlorobenzene se phenol.", "o/p-NO₂ groups ise bahut aasaan banate hain; meta-NO₂ ka kam asar — position check karo."),
],
examples=[
("SN1 ya SN2?", "OH⁻ ke saath SN2 se kaun tez react karega: CH₃Br ya (CH₃)₃CBr?",
 "CH₃Br — peeche se attack ke liye koi steric hindrance nahi. (CH₃)₃CBr stable 3° carbocation se SN1 karta hai."),
("Stereochemistry", "(R)-2-bromobutane OH⁻ ke saath SN2. Product?",
 "(S)-butan-2-ol: SN2 configuration ulta kar deta hai. SN1 se lagbhag racemic mixture banta."),
("Major alkene", "2-Bromobutane + alcoholic KOH. Major product?",
 "But-2-ene (zyada substituted) major (Saytzeff); but-1-ene minor."),
("KCN vs AgCN", "CH₃CH₂Br KCN ke saath aur AgCN ke saath?",
 "KCN (ionic, C attack karta hai) → CH₃CH₂CN; AgCN (covalent, N attack karta hai) → CH₃CH₂NC."),
("Chlorobenzene unreactive kyun?", "Chlorobenzene nucleophilic substitution se kyun bachta hai?",
 "Resonance se C–Cl bond partial double bond jaisa, carbon sp² (electrons kas kar pakadta hai), phenyl cation unstable, aur electron-rich ring nucleophiles ko repel karti hai."),
("Finkelstein", "Ethyl chloride ko ethyl iodide mein badlo.",
 "Dry acetone mein NaI ke saath garam karo: C₂H₅Cl + NaI → C₂H₅I + NaCl (NaCl precipitate hokar reaction aage badhata hai)."),
],
topics=[
("Classification and nomenclature", "Mono-, di-, polyhalo compounds; alkyl (1°, 2°, 3°), allylic, benzylic, vinylic aur aryl halides. Vinylic aur aryl halides mein X sp² carbon par hai aur SN reactions mein unreactive hain."),
("Physical properties", "Boiling points halogen ke size (RI > RBr > RCl > RF) aur chain length ke saath badhte hain, branching se ghat-te hain. Haloalkanes paani mein bahut kam ghulte hain. p-Dichlorobenzene ka melting point o- aur m-isomers se zyada (symmetrical, achha pack)."),
("Factors deciding SN1 vs SN2", "Substrate: 1° → SN2, 3° → SN1, 2° → dono. Strong nucleophile aur aprotic solvent SN2; weak nucleophile aur polar protic solvent (paani, alcohols) SN1. Benzylic aur allylic halides SN1 se tez (resonance-stabilised carbocations)."),
("Optical activity basics", "Chiral molecule (chaar alag groups wala carbon) apni mirror image par superimpose nahi hota aur plane-polarised light ghumaata hai. Enantiomers barabar par ulti direction mein ghumaate hain; 50:50 mixture (racemic) optically inactive."),
("Electrophilic substitution in haloarenes", "Halogen deactivating par o/p-directing: chlorobenzene halogenation, nitration, sulphonation aur Friedel–Crafts mein o- aur p-products deta hai (p major)."),
("Polyhalogen compounds and environment", "CH₂Cl₂ (solvent), CHCl₃ (chloroform, pehle anaesthetic; dark bottles mein rakhte hain kyunki light mein zehreela phosgene banta hai), CHI₃ (iodoform, antiseptic), CCl₄ (solvent, ozone layer ko nuksaan), freon (CFCs, refrigerants, ozone depletion) aur DDT (insecticide, food chains mein tikta hai)."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
