from lib import F, X, T, sig, fx, _check_and_write

ox_mol = 25e-3 * 0.05                 # oxalic acid moles
v_kmno4 = ox_mol * 2 / 5 / 0.02 * 1000  # mL of 0.02 M KMnO4
mohr_mol = 20e-3 * 0.1                # Fe2+ moles
v_kmno4b = mohr_mol / 5 / 0.02 * 1000   # mL of 0.02 M KMnO4

DOC = {
"slug": "practical-chemistry", "subject": "Chemistry",
"chapters": {"NEET": "Practical Chemistry", "JEE": "Practical Chemistry"},
"title": "Practical Chemistry", "readMinutes": 12,
"summary": [
"Detection of extra elements (N, S, halogens) in organic compounds uses Lassaigne's sodium fusion extract; functional groups are identified by simple colour or precipitate tests.",
"Inorganic salt analysis finds one cation and one anion: dilute and concentrated H₂SO₄ tests for anions, then group reagents separate cations into groups 0 to VI.",
"Redox titrations of KMnO₄ against oxalic acid and Mohr's salt need no indicator — KMnO₄ is its own indicator (colourless to permanent light pink).",
"Lab preparations (Mohr's salt, potash alum, acetanilide, p-nitroacetanilide, aniline yellow, iodoform) and the chemistry behind each step are common NEET and JEE Main questions.",
],
"formulas": [
F("KMnO₄ vs oxalic acid", "2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O", "Standardising KMnO₄.", "Warm the oxalic acid to 60–70 °C; the reaction is slow at room temperature (Mn²⁺ formed then catalyses it — autocatalysis).", tag="PYQ favourite"),
F("KMnO₄ vs Mohr's salt", "MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O", "Fe²⁺ estimation.", "Done cold — heating would oxidise Fe²⁺ by air."),
F("Molarity equation for titration", "M₁V₁/n₁ = M₂V₂/n₂ (n = stoichiometric coefficient)  or  N₁V₁ = N₂V₂", "Titration calculations."),
F("Equivalent weight in acid medium", "KMnO₄: n-factor 5 (Mn⁺⁷ → Mn²⁺);  oxalic acid: 2;  Mohr's salt (Fe²⁺): 1", "Normality-based calculations."),
F("Dilute H₂SO₄ group (anions)", "CO₃²⁻ → CO₂ (lime water milky);  S²⁻ → H₂S (lead acetate paper black);  SO₃²⁻ → SO₂ (acidified K₂Cr₂O₇ green);  NO₂⁻ → brown NO₂", "Preliminary anion tests."),
F("Conc. H₂SO₄ group (anions)", "Cl⁻ → HCl (white fumes with NH₃);  Br⁻ → reddish-brown Br₂;  I⁻ → violet I₂;  NO₃⁻ → brown ring test;  CH₃COO⁻ → vinegar smell", "Second set of anion tests.", "Brown ring is [Fe(H₂O)₅NO]²⁺ at the junction of conc. H₂SO₄."),
F("SO₄²⁻ and PO₄³⁻", "SO₄²⁻ + BaCl₂ → white BaSO₄ (insoluble in HCl);  PO₄³⁻ + ammonium molybdate (HNO₃) → canary-yellow precipitate", "Independent anion tests."),
F("Cation groups", "0: NH₄⁺ (NaOH, heat → NH₃);  I: Pb²⁺ (dil. HCl);  II: Pb²⁺, Cu²⁺, As³⁺ (H₂S in acid);  III: Fe³⁺, Al³⁺ (NH₄OH + NH₄Cl);  IV: Co²⁺, Ni²⁺, Mn²⁺, Zn²⁺ (H₂S in basic);  V: Ba²⁺, Sr²⁺, Ca²⁺ ((NH₄)₂CO₃);  VI: Mg²⁺", "Systematic cation analysis.", "Group II uses H₂S in acid (low S²⁻); group IV uses H₂S in ammoniacal medium (high S²⁻) — common ion effect.", tag="PYQ favourite"),
F("Flame colours", "Ca brick-red;  Sr crimson;  Ba apple-green;  Cu blue-green;  Na golden-yellow;  K lilac", "Confirming cations."),
F("Functional group tests", "unsaturation: Br₂ water / Baeyer's reagent decolourised;  alcohol: ceric ammonium nitrate (red);  phenol: neutral FeCl₃ (violet);  aldehyde: Tollens', Fehling's;  carbonyl: 2,4-DNP (orange ppt);  carboxyl –COOH: NaHCO₃ (CO₂);  1° amine: carbylamine", "Identifying functional groups."),
F("Ni²⁺ and Fe³⁺ confirmations", "Ni²⁺ + dimethylglyoxime (NH₄OH) → red precipitate;  Fe³⁺ + K₄[Fe(CN)₆] → Prussian blue;  Fe³⁺ + KSCN → blood red", "Confirmatory tests."),
],
"examples": [
X("Oxalic acid titration", "25 mL of 0.05 M oxalic acid is titrated with 0.02 M KMnO₄ in acid. Volume of KMnO₄?",
  f"Moles of oxalic acid = 0.025 × 0.05 = 1.25 × 10⁻³. MnO₄⁻ needed = (2/5) × 1.25 × 10⁻³ = 5 × 10⁻⁴ mol. Volume = 5 × 10⁻⁴/0.02 L = {fx(v_kmno4)} mL.", [(fx(v_kmno4), "25")]),
X("Mohr's salt titration", "20 mL of 0.1 M Mohr's salt solution is titrated with 0.02 M KMnO₄. Volume of KMnO₄?",
  f"Moles of Fe²⁺ = 0.02 × 0.1 = 2 × 10⁻³. MnO₄⁻ = 2 × 10⁻³/5 = 4 × 10⁻⁴ mol. Volume = 4 × 10⁻⁴/0.02 L = {fx(v_kmno4b)} mL.", [(fx(v_kmno4b), "20")]),
X("Why dilute H₂SO₄?", "Why is the KMnO₄ titration done in dilute H₂SO₄ and not HCl or HNO₃?",
  "HCl is oxidised by KMnO₄ to Cl₂, using up extra KMnO₄. HNO₃ is itself an oxidising agent. Dilute H₂SO₄ is neither oxidised nor oxidising.", []),
X("Group reagent logic", "Why is NH₄Cl added before NH₄OH in group III?",
  "The common ion NH₄⁺ suppresses ionisation of NH₄OH, keeping OH⁻ low enough that only the group III hydroxides (Fe³⁺, Al³⁺) precipitate, not those of groups IV–VI (e.g. Mg(OH)₂).", []),
X("Brown ring test", "What forms the brown ring and where?",
  "Nitrate solution + freshly made FeSO₄, then conc. H₂SO₄ poured down the side. A brown ring of [Fe(H₂O)₅NO]²⁺ forms where the two layers meet.", []),
X("Preparation of Mohr's salt", "Why is a little dilute H₂SO₄ added while preparing Mohr's salt?",
  "To prevent hydrolysis of FeSO₄ (and of the Fe²⁺ ion), which would make the solution turbid. Fe²⁺ is also kept from oxidising by not heating for long.", []),
],
"topics": [
T("Detection of extra elements", "Sodium fusion converts covalent N, S and X to ionic NaCN, Na₂S and NaX. N: Prussian blue; S: violet with sodium nitroprusside or black PbS; N and S together: blood red with FeCl₃; halogens: AgNO₃ (after boiling off CN⁻ and S²⁻ with HNO₃)."),
T("Preparation of inorganic compounds", "Mohr's salt FeSO₄·(NH₄)₂SO₄·6H₂O and potash alum K₂SO₄·Al₂(SO₄)₃·24H₂O are double salts made by crystallising equimolar solutions; they give the tests of all their ions in water."),
T("Preparation of organic compounds", "Acetanilide (aniline + acetic anhydride), p-nitroacetanilide (nitration of acetanilide at low temperature), aniline yellow (p-aminoazobenzene, coupling of benzenediazonium chloride with aniline), iodoform (ethanol or acetone + I₂ + alkali, yellow crystals)."),
T("Chemistry of titrimetric exercises", "Burette readings at the lower meniscus (upper for coloured KMnO₄). KMnO₄ is not a primary standard; it is standardised against oxalic acid. The end point is the first permanent pale pink colour."),
T("Tests for proteins and carbohydrates", "Biuret test (violet) for proteins; Molisch's test (violet ring) for all carbohydrates; iodine test (blue) for starch; Fehling's and Benedict's for reducing sugars."),
T("Physical chemistry experiments (JEE)", "Enthalpy of solution of CuSO₄ and enthalpy of neutralisation of a strong acid with a strong base (≈ −57 kJ/mol) are measured in a calorimeter from q = mcΔT. Lyophilic sols (starch, egg albumin, gum) form simply by warming with water; lyophobic sols (Fe(OH)₃, As₂S₃) need special methods such as hydrolysis or double decomposition. The rate of reaction of iodide ions with H₂O₂ is followed at room temperature (the iodine liberated turns starch blue)."),
T("Tests for fats and oils", "Fats leave a translucent spot on paper; the acrolein test (pungent smell on heating with KHSO₄) shows glycerol."),
],
"ratta": [
"KMnO₄: self-indicator, colourless → pink; dil. H₂SO₄ only.",
"Oxalic acid titration: warm 60–70 °C; Mohr's salt: cold.",
"n-factors: KMnO₄ 5, oxalic acid 2, Fe²⁺ 1.",
"Group II: H₂S acidic;  group IV: H₂S basic.",
"Ni²⁺ + DMG → red;  Fe³⁺ + KSCN → blood red.",
"Brown ring = NO₃⁻;  canary yellow = PO₄³⁻.",
"Ca brick-red, Sr crimson, Ba apple-green.",
],
}

SYLLABUS = [
("Detection of extra elements (N, S, halogens) in organic compounds", ["Lassaigne", "nitroprusside"]),
("Detection of functional groups: hydroxyl (alcoholic and phenolic), carbonyl (aldehyde and ketones), carboxyl and amino groups", ["alcohol", "phenol", "aldehyde", "carboxyl", "amine"]),
("Chemistry involved in the preparation of inorganic and organic compounds: Mohr's salt, potash alum, acetanilide, p-nitroacetanilide, aniline yellow, iodoform", ["Mohr's salt", "potash alum", "acetanilide", "aniline yellow", "iodoform"]),
("Chemistry involved in titrimetric exercises — acids, bases and indicators, oxalic acid vs KMnO₄, Mohr's salt vs KMnO₄", ["titration", "oxalic acid", "indicator"]),
("Chemical principles involved in qualitative salt analysis — cations and anions", ["cation", "anion", "group"]),
("Enthalpy of solution and neutralisation, lyophilic and lyophobic sols, kinetics of iodide with H₂O₂ (JEE)", ["enthalpy of solution", "neutralisation", "lyophilic", "lyophobic", "H₂O₂"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Organic compounds mein extra elements (N, S, halogens) Lassaigne ke sodium fusion extract se detect hote hain; functional groups (alcohol, phenol, aldehyde, carboxyl, amine) simple colour ya precipitate tests se pehchaante hain.",
"Inorganic salt analysis mein ek cation aur ek anion dhoondhte hain: anions ke liye dilute aur concentrated H₂SO₄ tests, phir group reagents cations ko group 0 se VI mein baant-te hain.",
"KMnO₄ ki oxalic acid aur Mohr's salt ke saath redox titration mein indicator nahi chahiye — KMnO₄ khud indicator hai (colourless se permanent halka gulabi).",
"Lab preparations (Mohr's salt, potash alum, acetanilide, p-nitroacetanilide, aniline yellow, iodoform) aur har step ki chemistry NEET aur JEE Main dono ke common sawal hain.",
],
when=[
("KMnO₄ standardise karna.", "Oxalic acid ko 60–70 °C tak garam karo; room temperature par reaction dheemi hai (bana Mn²⁺ phir use catalyse karta hai — autocatalysis) — thanda mat chalao."),
("Fe²⁺ estimation.", "Thande mein karo — garam karne se hawa Fe²⁺ ko oxidise kar degi, galat answer aayega."),
("Titration calculations.", None),
("Normality-based calculations.", None),
("Anions ke preliminary tests.", None),
("Anion tests ka doosra set.", "Brown ring [Fe(H₂O)₅NO]²⁺ hai, conc. H₂SO₄ ke junction par."),
("Independent anion tests.", None),
("Systematic cation analysis.", "Group II mein acid mein H₂S (kam S²⁻); group IV mein ammoniacal medium mein H₂S (zyada S²⁻) — common ion effect, ulta mat lo."),
("Cations confirm karna.", None),
("Functional groups pehchaanna.", None),
("Confirmatory tests.", None),
],
examples=[
("Oxalic acid titration", "25 mL 0.05 M oxalic acid ko acid mein 0.02 M KMnO₄ se titrate kiya. KMnO₄ ka volume?",
 "Oxalic acid ke moles = 0.025 × 0.05 = 1.25 × 10⁻³. MnO₄⁻ chahiye = (2/5) × 1.25 × 10⁻³ = 5 × 10⁻⁴ mol. Volume = 5 × 10⁻⁴/0.02 L = ⟨0⟩ mL."),
("Mohr's salt titration", "20 mL 0.1 M Mohr's salt solution ko 0.02 M KMnO₄ se titrate kiya. KMnO₄ ka volume?",
 "Fe²⁺ ke moles = 0.02 × 0.1 = 2 × 10⁻³. MnO₄⁻ = 2 × 10⁻³/5 = 4 × 10⁻⁴ mol. Volume = 4 × 10⁻⁴/0.02 L = ⟨0⟩ mL."),
("Dilute H₂SO₄ kyun?", "KMnO₄ titration dilute H₂SO₄ mein kyun, HCl ya HNO₃ mein kyun nahi?",
 "HCl ko KMnO₄ Cl₂ mein oxidise kar deta hai, extra KMnO₄ kharch hota hai. HNO₃ khud oxidising agent hai. Dilute H₂SO₄ na oxidise hota hai na oxidise karta hai."),
("Group reagent logic", "Group III mein NH₄OH se pehle NH₄Cl kyun daalte hain?",
 "Common ion NH₄⁺ NH₄OH ka ionisation dabaata hai, OH⁻ itna kam rehta hai ki sirf group III ke hydroxides (Fe³⁺, Al³⁺) precipitate hon, group IV–VI ke (jaise Mg(OH)₂) nahi."),
("Brown ring test", "Brown ring kya hai aur kahan banta hai?",
 "Nitrate solution + taaza FeSO₄, phir conc. H₂SO₄ kinaare se daalo. Dono layers ke milne ki jagah [Fe(H₂O)₅NO]²⁺ ka brown ring banta hai."),
("Mohr's salt ki preparation", "Mohr's salt banate waqt thoda dilute H₂SO₄ kyun daalte hain?",
 "FeSO₄ (aur Fe²⁺) ka hydrolysis rokne ke liye, warna solution dhundhla ho jaata hai. Zyada der garam na karke Fe²⁺ ko oxidise hone se bhi bachaate hain."),
],
topics=[
("Detection of extra elements", "Sodium fusion covalent N, S aur X ko ionic NaCN, Na₂S aur NaX mein badalta hai. N: Prussian blue; S: sodium nitroprusside se violet ya kaala PbS; N aur S dono: FeCl₃ se blood red; halogens: AgNO₃ (pehle HNO₃ se CN⁻ aur S²⁻ ubaal kar hatao)."),
("Preparation of inorganic compounds", "Mohr's salt FeSO₄·(NH₄)₂SO₄·6H₂O aur potash alum K₂SO₄·Al₂(SO₄)₃·24H₂O double salts hain jo equimolar solutions ko crystallise karke bante hain; paani mein apne saare ions ke tests dete hain."),
("Preparation of organic compounds", "Acetanilide (aniline + acetic anhydride), p-nitroacetanilide (kam temperature par acetanilide ka nitration), aniline yellow (p-aminoazobenzene, benzenediazonium chloride ka aniline se coupling), iodoform (ethanol ya acetone + I₂ + alkali, peele crystals)."),
("Chemistry of titrimetric exercises", "Burette reading neeche wale meniscus par (rangeen KMnO₄ ke liye upar wala). KMnO₄ primary standard nahi; oxalic acid se standardise karte hain. End point = pehla permanent halka gulabi rang. Acid–base titrations mein indicator chahiye; KMnO₄ titration (titration) mein nahi."),
("Tests for proteins and carbohydrates", "Proteins ke liye Biuret test (violet); saare carbohydrates ke liye Molisch's test (violet ring); starch ke liye iodine test (neela); reducing sugars ke liye Fehling's aur Benedict's."),
("Physical chemistry experiments (JEE)", "CuSO₄ ki enthalpy of solution aur strong acid–strong base ki enthalpy of neutralisation (≈ −57 kJ/mol) calorimeter mein q = mcΔT se naapte hain. Lyophilic sols (starch, egg albumin, gum) sirf paani mein garam karke bante hain; lyophobic sols (Fe(OH)₃, As₂S₃) ke liye hydrolysis ya double decomposition jaise khaas tareeke. Iodide ions ki H₂O₂ ke saath reaction ki rate room temperature par follow karte hain (nikli iodine starch ko neela karti hai)."),
("Tests for fats and oils", "Fats kaagaz par translucent daag chhodte hain; acrolein test (KHSO₄ ke saath garam karne par teekhi gandh) glycerol dikhata hai."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
