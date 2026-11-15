from lib import F, X, T, sig, fx, _check_and_write

ox_mol = 25e-3 * 0.05                 # oxalic acid moles
v_kmno4 = ox_mol * 2 / 5 / 0.02 * 1000  # mL of 0.02 M KMnO4
mohr_mol = 20e-3 * 0.1                # Fe2+ moles
v_kmno4b = mohr_mol / 5 / 0.02 * 1000   # mL of 0.02 M KMnO4

DOC = {
"slug": "practical-chemistry", "subject": "Chemistry",
"chapters": {"NEET": "Practical Chemistry"},
"title": "Practical Chemistry", "readMinutes": 12,
"summary": [
"Detection of extra elements (N, S, halogens) in organic compounds uses Lassaigne's sodium fusion extract; functional groups are identified by simple colour or precipitate tests.",
"Inorganic salt analysis finds one cation and one anion: dilute and concentrated H₂SO₄ tests for anions, then group reagents separate cations into groups 0 to VI.",
"Redox titrations of KMnO₄ against oxalic acid and Mohr's salt need no indicator — KMnO₄ is its own indicator (colourless to permanent light pink).",
"Lab preparations (Mohr's salt, potash alum, acetanilide, p-nitroacetanilide, aniline yellow, iodoform) and the chemistry behind each step are common NEET questions.",
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
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
