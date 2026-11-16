from lib import F, X, T, sig, fx, _check_and_write

z1 = 11 - (2 * 1.0 + 8 * 0.85)                      # Slater-type Zeff for Na 3s (simple)
g2 = 4                                               # group of [Ar]3d²4s² → group 4
p3, b3 = 4, "p"                                      # Z = 33 As: period 4, p-block
DOC = {
"slug": "classification-of-elements-and-periodicity", "subject": "Chemistry",
"chapters": {"NEET": "Classification of Elements and Periodicity", "JEE": "Classification of Elements and Periodicity"},
"title": "Classification of Elements and Periodicity", "readMinutes": 11,
"summary": [
"Mendeleev arranged elements by atomic mass and left gaps for undiscovered ones. Moseley showed atomic number is more fundamental, giving the modern periodic law: properties are periodic functions of atomic number.",
"The long form table has 18 groups and 7 periods, divided into s-, p-, d- and f-blocks by the subshell receiving the last electron.",
"Periodic trends come from effective nuclear charge and shielding: across a period atoms shrink and hold electrons more tightly; down a group they grow and hold electrons less tightly.",
"Key trends: atomic/ionic radius, ionisation enthalpy, electron gain enthalpy, electronegativity and valence. Exceptions (N vs O, Be vs B, F vs Cl) are exam favourites.",
],
"formulas": [
F("Modern periodic law", "properties of elements are periodic functions of their atomic numbers", "Basis of the modern table."),
F("Position from configuration", "period = highest n;  s-block group = valence e⁻;  p-block group = 10 + valence e⁻ (ns + np);  d-block group = ns + (n − 1)d electrons", "Finding period, group and block from Z.", None, tag="PYQ favourite"),
F("Effective nuclear charge", "Z_eff = Z − σ (σ = shielding constant)", "Explaining all size and energy trends."),
F("Atomic radius trend", "decreases across a period, increases down a group;  noble gases quoted as van der Waals radii", "Comparing sizes.", "Don't compare a noble gas's van der Waals radius with covalent radii of other elements."),
F("Ionic radius", "cation < parent atom < anion;  isoelectronic species: higher Z → smaller", "N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺.", tag="PYQ favourite"),
F("Ionisation enthalpy", "IE₁ < IE₂ < IE₃ …;  increases across a period, decreases down a group", "Energy to remove an electron.", "Exceptions: B < Be and O < N (stable 2s² and half-filled 2p³)."),
F("Electron gain enthalpy", "more negative across a period, less negative down a group;  Cl has the most negative value", "Energy change on adding an electron.", "F is less negative than Cl — its small 2p shell repels the incoming electron."),
F("Electronegativity (Pauling)", "increases across, decreases down;  F = 4.0 (highest), then O, N, Cl", "Bond polarity and character."),
F("Metallic and non-metallic character", "metallic character decreases across, increases down", "Nature of oxides: basic → amphoteric → acidic across a period."),
F("Valence", "s/p-block: valence = group electrons or 8 − group electrons", "Writing formulas of compounds (e.g. Al₂O₃) and predicting common oxidation states."),
],
"examples": [
X("Position of Z = 33", "Element with Z = 33: period and block?",
  f"[Ar]3d¹⁰4s²4p³ → period {p3}, {b3}-block, group 15 (arsenic).", [(str(p3), "4"), (b3, "p")]),
X("Group of a d-block element", "Configuration [Ar]3d²4s². Group?",
  f"ns + (n − 1)d = 2 + 2 = {g2} → group 4 (titanium).", [(str(g2), "4")]),
X("Shielding estimate", "Using simple shielding (inner shell 1s² = 1.0 each, 2s²2p⁶ = 0.85 each), estimate Z_eff for the 3s electron of Na.",
  f"Z_eff = 11 − (2 × 1.0 + 8 × 0.85) = {fx(z1,1)} — so the outer electron is held weakly and Na loses it easily.", [(fx(z1,1), "2.2")]),
X("Ordering ionic radii", "Arrange Na⁺, F⁻, Mg²⁺, O²⁻ by size.",
  "All have 10 electrons; more protons pull harder: O²⁻ > F⁻ > Na⁺ > Mg²⁺.", []),
X("Ionisation enthalpy order", "Arrange B, C, N, O by first ionisation enthalpy.",
  "B < C < O < N. N (2p³, half-filled) is extra stable; O loses a paired 2p electron more easily.", []),
X("Most negative electron gain enthalpy", "Which has the most negative electron gain enthalpy: F, Cl, Br, O?",
  "Cl. F is smaller, so electron–electron repulsion in its compact 2p shell makes its value less negative than Cl's.", []),
],
"topics": [
T("History of classification", "Döbereiner's triads (Li, Na, K), Newlands' law of octaves, Lothar Meyer's volume curves, and Mendeleev's periodic table (1869), which predicted eka-aluminium (Ga) and eka-silicon (Ge). Moseley (1913) showed that atomic number orders elements correctly."),
T("Blocks of the table", "s-block (groups 1, 2): reactive metals, low IE. p-block (13–18): metals, metalloids and non-metals, including halogens and noble gases. d-block (3–12): transition metals, variable valency, coloured ions. f-block: lanthanoids and actinoids at the bottom."),
T("Nomenclature of new elements", "Elements with Z > 100 get temporary IUPAC names from digit roots: 0 nil, 1 un, 2 bi, 3 tri, 4 quad, 5 pent, 6 hex, 7 sept, 8 oct, 9 enn + 'ium'. Z = 120 is unbinilium (Ubn)."),
T("Why trends happen", "Across a period electrons enter the same shell while nuclear charge rises, so Z_eff increases: smaller radius, higher IE, more negative electron gain enthalpy, higher electronegativity. Down a group a new shell is added and shielding grows, so the trends reverse."),
T("Anomalous behaviour of the first element", "The first element of each group (Li, Be, B, C, N, O, F) differs from the rest: small size, high electronegativity, no d orbitals (maximum covalency 4). Diagonal relationship: Li–Mg, Be–Al, B–Si show similar properties."),
T("Chemical reactivity and oxides", "Reactivity is highest at the two ends of a period (alkali metals, halogens). Oxides change from strongly basic (Na₂O) through amphoteric (Al₂O₃) to strongly acidic (Cl₂O₇) across period 3."),
],
"ratta": [
"Modern law: periodic in atomic number (Moseley).",
"Period = highest n;  p-block group = 10 + ns + np electrons.",
"Radius ↓ across, ↑ down;  isoelectronic: more Z → smaller.",
"IE: Be > B, N > O (exceptions).",
"Most negative electron gain enthalpy: Cl (not F).",
"Electronegativity: F 4.0 > O > N ≈ Cl.",
"Oxides across period 3: basic → amphoteric → acidic.",
],
}

SYLLABUS = [
("Modern periodic law and present form of the periodic table", ["periodic law", "periodic table"]),
("s, p, d and f block elements", ["s-block", "p-block", "d-block", "f-block"]),
("Periodic trends: atomic and ionic radii", ["atomic radius", "ionic radius"]),
("Ionisation enthalpy, electron gain enthalpy, valence", ["ionisation enthalpy", "electron gain enthalpy", "valence"]),
("Oxidation states and chemical reactivity", ["reactivity", "oxides"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Mendeleev ne elements ko atomic mass se lagaya aur na mile elements ke liye gaps chhode. Moseley ne dikhaya ki atomic number zyada basic hai — modern periodic law: properties atomic number ke periodic functions hain.",
"Long form periodic table mein 18 groups aur 7 periods hain, aur last electron jis subshell mein jaata hai uske hisaab se s-, p-, d-, f-blocks.",
"Periodic trends effective nuclear charge aur shielding se aate hain: period mein aage atoms chhote aur electrons zyada kas kar pakadte hain; group mein neeche bade aur dheela pakadte hain.",
"Key trends: atomic/ionic radius, ionisation enthalpy, electron gain enthalpy, electronegativity aur valence. Exceptions (N vs O, Be vs B, F vs Cl) exam ke favourite hain.",
],
when=[
("Modern table ka base.", None),
("Z se period, group aur block nikaalna.", None),
("Saare size aur energy trends samjhaana.", None),
("Sizes compare karna.", "Noble gas ka van der Waals radius doosre elements ke covalent radius se compare mat karo."),
("N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺ > Al³⁺.", None),
("Electron nikaalne ki energy.", "Exceptions: B < Be aur O < N (stable 2s² aur half-filled 2p³) — bhoolo mat."),
("Electron jodne par energy change.", "F, Cl se kam negative hai — chhoti 2p shell aane wale electron ko repel karti hai, ulta mat samjho."),
("Bond polarity aur character.", None),
("Oxides ki nature: period mein basic → amphoteric → acidic.", None),
("Compounds ke formula likhna (jaise Al₂O₃) aur common oxidation states.", None),
],
examples=[
("Z = 33 ki position", "Z = 33 wala element: period aur block?",
 "[Ar]3d¹⁰4s²4p³ → period ⟨0⟩, ⟨1⟩-block, group 15 (arsenic)."),
("d-block element ka group", "Configuration [Ar]3d²4s². Group?",
 "ns + (n − 1)d = 2 + 2 = 4 → group ⟨0⟩ (titanium)."),
("Shielding estimate", "Simple shielding (andar ki 1s² = 1.0 each, 2s²2p⁶ = 0.85 each) se Na ke 3s electron ka Z_eff?",
 "Z_eff = 11 − (2 × 1.0 + 8 × 0.85) = ⟨0⟩ — bahar ka electron dheela pakda hai, Na use aasaani se kho deta hai."),
("Ionic radii ka order", "Na⁺, F⁻, Mg²⁺, O²⁻ size ke order mein.",
 "Sab mein 10 electrons; zyada protons zyada kheenchte hain: O²⁻ > F⁻ > Na⁺ > Mg²⁺."),
("Ionisation enthalpy ka order", "B, C, N, O first ionisation enthalpy ke order mein.",
 "B < C < O < N. N (2p³, half-filled) extra stable; O paired 2p electron aasaani se khota hai."),
("Sabse negative electron gain enthalpy", "F, Cl, Br, O mein sabse negative electron gain enthalpy kiski?",
 "Cl. F chhota hai, isliye uski compact 2p shell mein electron–electron repulsion uski value ko Cl se kam negative bana deta hai."),
],
topics=[
("History of classification", "Döbereiner ke triads (Li, Na, K), Newlands ka law of octaves, Lothar Meyer ke volume curves, aur Mendeleev ka periodic table (1869) jisne eka-aluminium (Ga) aur eka-silicon (Ge) predict kiye. Moseley (1913) ne dikhaya ki atomic number se order sahi aata hai."),
("Blocks of the table", "s-block (groups 1, 2): reactive metals, kam IE. p-block (13–18): metals, metalloids aur non-metals, halogens aur noble gases bhi. d-block (3–12): transition metals, variable valency, rangeen ions. f-block: lanthanoids aur actinoids neeche."),
("Nomenclature of new elements", "Z > 100 wale elements ko digits ke roots se temporary IUPAC naam: 0 nil, 1 un, 2 bi, 3 tri, 4 quad, 5 pent, 6 hex, 7 sept, 8 oct, 9 enn + 'ium'. Z = 120 unbinilium (Ubn)."),
("Why trends happen", "Period mein electrons same shell mein aate hain aur nuclear charge badhta hai, isliye Z_eff badhta hai: chhota radius, zyada IE, zyada negative electron gain enthalpy, zyada electronegativity. Group mein neeche nayi shell aur zyada shielding, isliye trends ulte."),
("Anomalous behaviour of the first element", "Har group ka pehla element (Li, Be, B, C, N, O, F) baaki se alag: chhota size, zyada electronegativity, d orbitals nahi (maximum covalency 4). Diagonal relationship: Li–Mg, Be–Al, B–Si milti-julti properties."),
("Chemical reactivity and oxides", "Reactivity period ke dono siron par sabse zyada (alkali metals, halogens). Period 3 mein oxides strongly basic (Na₂O) se amphoteric (Al₂O₃) hote hue strongly acidic (Cl₂O₇) tak badalte hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
