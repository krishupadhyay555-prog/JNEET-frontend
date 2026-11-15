from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "p-block-elements", "subject": "Chemistry",
"chapters": {"NEET": "p-Block Elements", "JEE": "p-Block Elements"},
"title": "p-Block Elements (Groups 13–18)", "readMinutes": 16,
"summary": [
"p-block elements fill the np subshell (ns²np¹⁻⁶). Across a group, non-metallic character falls and metallic character rises as size increases.",
"The inert pair effect makes the lower oxidation state more stable for heavy elements: Tl⁺ over Tl³⁺, Pb²⁺ over Pb⁴⁺, Bi³⁺ over Bi⁵⁺.",
"The first member of each group is anomalous: small size, high electronegativity, no d orbitals (maximum covalency 4) and strong pπ–pπ multiple bonding (N≡N, O=O, C=O).",
"Exams focus on structures and shapes (VSEPR), acid strength and thermal stability trends of hydrides and oxoacids, and important compounds (NH₃, HNO₃, H₂SO₄, ozone, interhalogens, xenon fluorides).",
],
"formulas": [
F("General configuration", "ns² np¹⁻⁶;  group number = 10 + valence electrons", "Placing elements and predicting valence."),
F("Inert pair effect", "stability of the lower state (group oxidation state − 2) increases down the group", "Tl⁺ > Tl³⁺, Pb²⁺ > Pb⁴⁺, Bi³⁺ > Bi⁵⁺.", "PbO₂ and Bi(V) compounds are therefore strong oxidising agents.", tag="PYQ favourite"),
F("Hydrides of group 15", "NH₃ > PH₃ > AsH₃ > SbH₃ > BiH₃: basicity and thermal stability decrease; reducing character increases;  bond angle NH₃ 107° > PH₃ 93.6°", "Comparing hydrides.", "Boiling point: PH₃ < AsH₃ < NH₃ < SbH₃ < BiH₃ — NH₃ is anomalously high (hydrogen bonding), not the lowest."),
F("Hydrides of group 16", "H₂O < H₂S < H₂Se < H₂Te: acidity increases;  thermal stability decreases down the group", "Acid strength of hydrides.", "Water has an anomalously high boiling point because of hydrogen bonding."),
F("Hydrogen halides", "acid strength: HF < HCl < HBr < HI;  bond strength and thermal stability: HF > HCl > HBr > HI", "Comparing HX.", "HF is the WEAKEST acid in water despite F being most electronegative — the H–F bond is very strong.", tag="PYQ favourite"),
F("Oxoacids of chlorine", "acid strength: HOCl < HClO₂ < HClO₃ < HClO₄;  oxidising power: the reverse", "Oxoacid trends.", None),
F("Phosphorus oxoacids (basicity = P–OH bonds)", "H₃PO₂ monobasic (2 P–H, reducing);  H₃PO₃ dibasic (1 P–H, reducing);  H₃PO₄ tribasic (no P–H)", "Basicity and reducing nature.", "Count only O–H bonds attached to P for basicity — P–H hydrogens are not acidic."),
F("Shapes of interhalogens", "XX′ linear;  XX′₃ (ClF₃) T-shaped;  XX′₅ (BrF₅) square pyramidal;  XX′₇ (IF₇) pentagonal bipyramidal", "VSEPR questions."),
F("Xenon fluorides", "XeF₂ linear (sp³d);  XeF₄ square planar (sp³d²);  XeF₆ distorted octahedral (sp³d³);  XeO₃ pyramidal", "Noble-gas compound structures.", None, tag="PYQ favourite"),
F("Key preparations", "NH₃: Haber process (Fe catalyst, ~200 atm, ~700 K);  HNO₃: Ostwald process (Pt/Rh, NH₃ oxidation);  H₂SO₄: contact process (V₂O₅ catalyst, SO₂ → SO₃)", "Industrial processes."),
F("Structures of sulphur and phosphorus", "white P: P₄ tetrahedral, reactive, glows;  red P: polymeric, less reactive;  rhombic S (S₈ crowns) stable below 369 K;  monoclinic above", "Allotropes."),
F("Group 13 & 14 highlights", "boric acid H₃BO₃ is a weak monobasic Lewis acid (accepts OH⁻);  diborane B₂H₆ has two 3-centre-2-electron (banana) bonds;  CO is a neutral oxide and good ligand; CO₂ acidic; SiO₂ covalent network", "Questions on B, Al, C, Si compounds."),
],
"examples": [
X("Why is HF weak?", "Explain why HF is a weaker acid than HCl in water.",
  "The H–F bond is very strong and F⁻ is small and strongly hydrated, so HF ionises only slightly; acid strength rises down the group as the H–X bond weakens.", []),
X("Basicity of H₃PO₃", "How many replaceable hydrogens does H₃PO₃ have?",
  "Structure HP(O)(OH)₂: two P–OH bonds → dibasic; the P–H hydrogen is not acidic but makes H₃PO₃ a reducing agent.", []),
X("Shape of XeF₄", "Predict the shape of XeF₄.",
  "Xe has 8 valence electrons: 4 bond pairs + 2 lone pairs = 6 pairs (octahedral arrangement, sp³d²). The lone pairs sit opposite each other, so the molecule is square planar.", []),
X("Shape of ClF₃", "Predict the shape of ClF₃.",
  "Cl: 3 bond pairs + 2 lone pairs = 5 pairs (trigonal bipyramidal). Lone pairs take equatorial positions, leaving a T-shaped molecule.", []),
X("Brown ring test", "What forms the brown ring in the test for nitrate?",
  "Fe²⁺ reduces NO₃⁻ to NO in conc. H₂SO₄; NO binds to iron forming [Fe(H₂O)₅NO]²⁺, seen as a brown ring at the interface.", []),
X("Inert pair effect", "Why is PbO₂ a strong oxidising agent?",
  "Down group 14, the 6s² pair resists bonding (inert pair effect), so Pb²⁺ is more stable than Pb⁴⁺. PbO₂ (Pb⁴⁺) readily gains electrons to become Pb²⁺.", []),
],
"topics": [
T("Group 13 (B, Al, Ga, In, Tl)", "B is a non-metal and forms covalent compounds; Al is amphoteric. Boron halides are Lewis acids (BF₃ < BCl₃ < BBr₃ in acid strength due to back-bonding). AlCl₃ exists as a dimer Al₂Cl₆. Borax and boric acid are important boron compounds."),
T("Group 14 (C, Si, Ge, Sn, Pb)", "Carbon shows catenation (strongest C–C bonds) and allotropes: diamond (sp³, hardest), graphite (sp², conducts electricity, lubricant), fullerenes (C₆₀). Silicones and silicates contain Si–O chains; zeolites are aluminosilicates used as catalysts."),
T("Group 15 (N, P, As, Sb, Bi)", "N₂ is inert because of the strong triple bond (941 kJ/mol). Nitrogen oxides: N₂O, NO (paramagnetic, odd electron), N₂O₃, NO₂ (paramagnetic, dimerises to N₂O₄), N₂O₅. PCl₅ is trigonal bipyramidal in gas and [PCl₄]⁺[PCl₆]⁻ in the solid."),
T("Group 16 (O, S, Se, Te, Po)", "O₂ is paramagnetic. Ozone (O₃) is bent, a strong oxidising agent, and protects us from UV. Oxides can be acidic (SO₂), basic (CaO), amphoteric (Al₂O₃) or neutral (CO). H₂SO₄ is a dehydrating agent (chars sugar) and an oxidising agent when hot and concentrated."),
T("Group 17 (F, Cl, Br, I)", "Halogens are coloured, strong oxidising agents (F₂ strongest) with the most negative electron gain enthalpies (Cl most negative). F shows only −1. Cl₂ bleaches by oxidation (moist), and reacts with cold dilute NaOH to give NaCl + NaOCl and with hot concentrated NaOH to give NaCl + NaClO₃ (disproportionation)."),
T("Group 18 (noble gases)", "Full ns²np⁶ shells, very high ionisation enthalpies. Xenon forms compounds with F and O because its IE is close to that of O₂ (Bartlett made O₂⁺PtF₆⁻, then Xe⁺PtF₆⁻). Uses: He in balloons and diving gas, Ne in signs, Ar as an inert atmosphere in welding and bulbs."),
T("Anomalous behaviour summary", "The first members (B, C, N, O, F) are small, very electronegative, lack d orbitals (covalency ≤ 4) and form strong pπ–pπ multiple bonds. Heavier members use d orbitals to expand the octet (PCl₅, SF₆) and form dπ–pπ bonds."),
],
"ratta": [
"Inert pair: Tl⁺, Pb²⁺, Bi³⁺ more stable.",
"HF weakest HX acid;  HI strongest.",
"NH₃ 107° > PH₃ 93.6°;  basicity NH₃ > PH₃.",
"H₃PO₂ mono, H₃PO₃ di, H₃PO₄ tribasic.",
"HClO₄ strongest oxoacid of Cl;  HOCl best oxidiser.",
"XeF₂ linear, XeF₄ square planar, XeF₆ distorted octahedral.",
"ClF₃ T-shaped;  BrF₅ square pyramidal;  IF₇ pentagonal bipyramidal.",
"Haber (Fe), Ostwald (Pt/Rh), contact (V₂O₅).",
],
}

SYLLABUS = [
("Group 13 to 18 elements: general introduction, electronic configuration, trends in properties", ["Group 13", "Group 14", "Group 15", "Group 16", "Group 17", "Group 18", "configuration"]),
("Unique behaviour of the first element in each group", ["anomalous", "first"]),
("Inert pair effect, oxidation states", ["inert pair"]),
("Important compounds: hydrides, oxides, oxoacids, halides, interhalogens, xenon compounds", ["hydride", "oxide", "oxoacid", "interhalogen", "xenon"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
