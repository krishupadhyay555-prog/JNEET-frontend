from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "hydrocarbons", "subject": "Chemistry",
"chapters": {"NEET": "Hydrocarbons", "JEE": "Hydrocarbons"},
"title": "Hydrocarbons", "readMinutes": 15,
"summary": [
"Alkanes (CₙH₂ₙ₊₂, sp³) are fairly unreactive and undergo free-radical substitution. Their conformations (staggered vs eclipsed ethane) differ in energy.",
"Alkenes (CₙH₂ₙ, C=C) and alkynes (CₙH₂ₙ₋₂, C≡C) undergo electrophilic addition. HX adds by Markovnikov's rule, except HBr with peroxide (anti-Markovnikov). Alkenes show geometrical isomerism.",
"Terminal alkynes are weakly acidic (sp carbon) and form acetylides. Ozonolysis tells where the double bond was.",
"Benzene is aromatic (planar, cyclic, 6 π electrons — Hückel 4n + 2). It prefers electrophilic substitution, and substituents direct incoming groups to ortho/para or meta positions.",
],
"formulas": [
F("Wurtz reaction", "2R–X + 2Na → R–R + 2NaX (dry ether)", "Making symmetrical higher alkanes.", "Gives mixtures with two different alkyl halides; can't make methane."),
F("Kolbe's electrolysis", "2RCOONa + 2H₂O → R–R + 2CO₂ + 2NaOH + H₂ (electrolysis)", "Alkanes with an even number of carbons."),
F("Decarboxylation", "RCOONa + NaOH (CaO) → R–H + Na₂CO₃", "Alkane with one carbon less."),
F("Free-radical halogenation", "CH₄ + Cl₂ (hν) → CH₃Cl + HCl (initiation, propagation, termination)", "Halogenation of alkanes.", "Reactivity of halogens: F₂ > Cl₂ > Br₂ > I₂; 3° H is replaced fastest."),
F("Markovnikov addition", "CH₃CH=CH₂ + HBr → CH₃CHBrCH₃", "Adding HX to unsymmetrical alkenes.", "H goes to the carbon that already has more H (more stable carbocation forms).", tag="PYQ favourite"),
F("Peroxide (Kharasch) effect", "CH₃CH=CH₂ + HBr (peroxide) → CH₃CH₂CH₂Br", "Anti-Markovnikov addition.", "Works only with HBr — not with HCl or HI."),
F("Ozonolysis", "R₂C=CR′₂ + O₃ then Zn/H₂O → R₂C=O + O=CR′₂", "Locating the double bond.", None, tag="PYQ favourite"),
F("Hydrogenation of alkynes", "Lindlar's catalyst (Pd/CaCO₃, quinoline) → cis-alkene;  Na in liquid NH₃ → trans-alkene", "Controlled reduction."),
F("Hydration of alkynes", "HC≡CH + H₂O (HgSO₄, dil. H₂SO₄) → CH₃CHO;  other alkynes → ketones", "Making aldehydes/ketones from alkynes."),
F("Acidity of hydrocarbons", "HC≡CH > CH₂=CH₂ > CH₃–CH₃ (s-character 50% > 33% > 25%)", "Why terminal alkynes react with Na, NaNH₂ and ammoniacal AgNO₃."),
F("Aromaticity (Hückel rule)", "planar + cyclic + fully conjugated + (4n + 2) π electrons", "Identifying aromatic compounds.", "Cyclopentadienyl anion (6π) is aromatic; the cation (4π) is not."),
F("Electrophilic substitution of benzene", "nitration (HNO₃/H₂SO₄, NO₂⁺);  halogenation (X₂/FeX₃);  sulphonation (fuming H₂SO₄);  Friedel–Crafts alkylation (RX/AlCl₃) and acylation (RCOCl/AlCl₃)", "Reactions of benzene."),
F("Directive influence", "o/p-directing activating: –OH, –NH₂, –OR, –CH₃;  o/p-directing deactivating: halogens;  m-directing deactivating: –NO₂, –CN, –CHO, –COOH, –SO₃H", "Predicting where the next group goes.", "Halogens are the odd case: deactivating (−I) yet ortho/para-directing (+R).", tag="PYQ favourite"),
],
"examples": [
X("Ozonolysis product", "But-2-ene is ozonolysed (Zn/H₂O). Products?",
  "CH₃CH=CHCH₃ splits at the double bond → 2 CH₃CHO (ethanal).", []),
X("Markovnikov vs peroxide", "Propene + HBr, with and without benzoyl peroxide?",
  "Without peroxide: 2-bromopropane (Markovnikov, via 2° carbocation). With peroxide: 1-bromopropane (free-radical, anti-Markovnikov).", []),
X("cis or trans", "But-2-yne is reduced with H₂/Lindlar's catalyst and separately with Na/liq. NH₃. Products?",
  "Lindlar → cis-but-2-ene (syn addition). Na/NH₃ → trans-but-2-ene.", []),
X("Is it aromatic?", "Which are aromatic: benzene, cyclooctatetraene, cyclopentadienyl anion, cyclobutadiene?",
  "Benzene (6π) and cyclopentadienyl anion (6π) obey 4n + 2. Cyclooctatetraene (8π, non-planar) and cyclobutadiene (4π, antiaromatic) are not.", []),
X("Nitration of toluene", "Main products of nitrating toluene?",
  "–CH₃ is activating and o/p-directing → o-nitrotoluene and p-nitrotoluene (p major due to less crowding).", []),
X("Friedel–Crafts acylation", "Benzene + CH₃COCl with anhydrous AlCl₃?",
  "Acetophenone (C₆H₅COCH₃). The acylium ion CH₃C≡O⁺ is the electrophile; unlike alkylation there is no rearrangement and no polysubstitution.", []),
],
"topics": [
T("Conformations of ethane", "Rotation about the C–C single bond gives staggered (most stable, minimum torsional strain) and eclipsed (least stable) conformations; the energy difference is only ~12.5 kJ/mol, so they interconvert rapidly. Shown with Newman and sawhorse projections."),
T("Geometrical isomerism", "Restricted rotation about C=C allows cis and trans isomers when each double-bonded carbon has two different groups. cis-But-2-ene has a higher boiling point (polar); trans has a higher melting point (packs better)."),
T("Preparation of alkenes", "Dehydration of alcohols (conc. H₂SO₄, heat), dehydrohalogenation of alkyl halides (alcoholic KOH — Saytzeff product, the more substituted alkene, is major), and partial reduction of alkynes."),
T("Reactions of alkenes", "Addition of H₂, X₂ (Br₂ water decolourises — test for unsaturation), HX, H₂O (acid-catalysed); oxidation with cold dilute alkaline KMnO₄ (Baeyer's reagent, diol; purple colour lost); ozonolysis; polymerisation (polythene)."),
T("Alkynes", "Prepared from calcium carbide (CaC₂ + 2H₂O → C₂H₂ + Ca(OH)₂) or by double dehydrohalogenation. Terminal alkynes give white precipitates with ammoniacal AgNO₃ — a test distinguishing them from alkenes. Ethyne polymerises to benzene in a red-hot iron tube."),
T("Benzene structure", "Kekulé structures are resonance forms; all C–C bonds are equal (139 pm, between single and double). Benzene resists addition because it would lose aromatic stabilisation."),
T("Carcinogenicity and toxicity", "Many polynuclear aromatic hydrocarbons (from incomplete combustion of coal, tobacco) are carcinogenic, e.g. 1,2-benzanthracene."),
],
"ratta": [
"Wurtz: 2RX + 2Na → R–R;  Kolbe: even carbons.",
"Markovnikov: H to carbon with more H;  peroxide effect only with HBr.",
"Ozonolysis tells position of C=C.",
"Lindlar → cis;  Na/NH₃ → trans.",
"Acidity: ethyne > ethene > ethane.",
"Hückel: 4n + 2 π electrons, planar, cyclic.",
"o/p: –OH, –NH₂, –CH₃, –X;  m: –NO₂, –CN, –CHO, –COOH.",
"Saytzeff: more substituted alkene major.",
],
}

SYLLABUS = [
("Classification, isomerism, IUPAC nomenclature, general methods of preparation, properties and reactions", ["isomerism", "preparation"]),
("Alkanes — conformations: Sawhorse and Newman projections (of ethane); mechanism of halogenation", ["conformation", "Newman", "sawhorse", "halogenation"]),
("Alkenes — geometrical isomerism; electrophilic addition: Markownikoff's and peroxide effect; ozonolysis and polymerisation", ["geometrical", "Markovnikov", "peroxide", "ozonolysis", "polymerisation"]),
("Alkynes — acidic character; addition of hydrogen, halogens, water and hydrogen halides; polymerisation", ["acidic", "Lindlar", "hydration"]),
("Aromatic hydrocarbons — nomenclature, benzene structure and aromaticity; electrophilic substitution: halogenation, nitration, Friedel–Crafts alkylation and acylation; directive influence of functional group in monosubstituted benzene", ["aromatic", "Hückel", "nitration", "Friedel", "directive"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
