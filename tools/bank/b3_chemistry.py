"""Batch 3 — Chemistry (NEET + JEE). Numericals are computed in code."""
from math import sqrt, log10, pi
from qlib import mcq, blank, sig, u

S = "Chemistry"
def C(exam, chap, cat, diff, text, correct, wrongs, expl):
    mcq(exam, S, chap, cat, diff, text, correct, wrongs, expl)
R = 8.314

# ---------------- Some Basic Concepts ----------------
C("NEET", "Some Basic Concepts of Chemistry", "tough", "tough",
  "10 g of H₂ is mixed with 64 g of O₂ and the mixture is exploded. The mass of water formed and the reactant left over are",
  "72 g water; 2 g H₂ left", ["74 g water; nothing left", "90 g water; nothing left", "72 g water; 8 g O₂ left"],
  "2H₂ + O₂ → 2H₂O. H₂ = 5 mol, O₂ = 2 mol. O₂ is limiting and uses 4 mol H₂. Water = 4 mol = 72 g; H₂ left = 1 mol = 2 g.")
C("JEE", "Some Basic Concepts of Chemistry", "tough", "tough",
  "0.30 g of an organic compound (C, H, O only) on complete combustion gives 0.44 g CO₂ and 0.18 g H₂O. Its molar mass is 180 g/mol. Its molecular formula is",
  "C₆H₁₂O₆", ["C₃H₆O₃", "C₆H₆O₆", "C₅H₁₀O₅"],
  "C = 0.44 × 12/44 = 0.12 g, H = 0.18 × 2/18 = 0.02 g, O = 0.30 − 0.14 = 0.16 g. Mole ratio C : H : O = 0.01 : 0.02 : 0.01 → CH₂O (30 g/mol). 180/30 = 6 → C₆H₁₂O₆.")
C("NEET", "Some Basic Concepts of Chemistry", "tough", "tough",
  "A solution contains 20% NaOH by mass. Its molality is (NaOH = 40 g/mol)",
  "6.25 m", ["5.0 m", "0.5 m", "2.5 m"], "100 g solution: 20 g NaOH = 0.5 mol in 80 g water. m = 0.5/0.080 = 6.25 mol/kg.")
m = 3 / ((1.25 * 1000 - 3 * 58.5) / 1000)
C("JEE", "Some Basic Concepts of Chemistry", "tough", "tough",
  "A 3.0 M aqueous NaCl solution has density 1.25 g/mL. Its molality is about (NaCl = 58.5 g/mol)",
  u(m, "m"), ["3.00 m", u(3 / 1.25, "m"), u(3 / ((1250 - 58.5) / 1000), "m")],
  f"1 L solution = 1250 g, containing 3 × 58.5 = 175.5 g NaCl. Water = 1074.5 g. Molality = 3/1.0745 ≈ {m:.2f} m.")
C("NEET", "Some Basic Concepts of Chemistry", "formula", "moderate",
  "The number of oxygen atoms in 4.4 g of CO₂ is (Nₐ = 6.022 × 10²³)",
  "1.2044 × 10²³", ["6.022 × 10²²", "6.022 × 10²³", "3.011 × 10²³"], "4.4 g CO₂ = 0.1 mol; each has 2 O atoms → 0.2 × 6.022 × 10²³ = 1.2044 × 10²³.")
C("JEE", "Some Basic Concepts of Chemistry", "formula", "moderate",
  "What volume of 0.1 M H₂SO₄ is needed to neutralise 50 mL of 0.2 M NaOH?",
  "50 mL", ["100 mL", "25 mL", "200 mL"], "Moles NaOH = 0.01; H₂SO₄ gives 2H⁺, so 0.005 mol needed = 0.005/0.1 L = 50 mL.")

# ---------------- Atomic Structure ----------------
dv = 6.626e-34 / (4 * pi * 9.1e-31 * 1e-10)
C("JEE", "Atomic Structure", "tough", "tough",
  "The uncertainty in the position of an electron is 0.1 nm. The minimum uncertainty in its velocity is about (h = 6.626 × 10⁻³⁴ J s, mₑ = 9.1 × 10⁻³¹ kg)",
  f"{sig(dv)} m/s", [f"{sig(dv*4*pi)} m/s", f"{sig(dv/10)} m/s", f"{sig(dv*10)} m/s"],
  f"Δv = h/(4πmΔx) = 6.626 × 10⁻³⁴/(4π × 9.1 × 10⁻³¹ × 10⁻¹⁰) ≈ {sig(dv)} m/s.")
lam = 6.626e-34 / (9.1e-31 * 1e6)
C("NEET", "Atomic Structure", "tough", "tough",
  "The de Broglie wavelength of an electron moving at 1.0 × 10⁶ m/s is about (h = 6.626 × 10⁻³⁴ J s, mₑ = 9.1 × 10⁻³¹ kg)",
  f"{sig(lam*1e9)} nm", [f"{sig(lam*1e10)} nm", f"{sig(lam*1e8)} nm", f"{sig(lam*1e9/2)} nm"],
  f"λ = h/mv = 6.626 × 10⁻³⁴/(9.1 × 10⁻³¹ × 10⁶) ≈ {sig(lam)} m ≈ {sig(lam*1e9)} nm.")
C("NEET", "Atomic Structure", "tough", "tough",
  "The energy of the photon emitted when the electron of He⁺ falls from n = 2 to n = 1 is (energy of H atom ground state = −13.6 eV)",
  "40.8 eV", ["10.2 eV", "54.4 eV", "20.4 eV"], "E = 13.6Z²(1/1² − 1/2²) = 13.6 × 4 × 3/4 = 40.8 eV.")
C("JEE", "Atomic Structure", "tough", "tough",
  "The radius of the first Bohr orbit of hydrogen is 52.9 pm. The radius of the second orbit of Li²⁺ is",
  "70.5 pm", ["211.6 pm", "52.9 pm", "17.6 pm"], "rₙ = 52.9 n²/Z pm = 52.9 × 4/3 ≈ 70.5 pm.")
C("NEET", "Atomic Structure", "tough", "tough",
  "How many electrons in an atom can have n = 3 and m_l = −1?",
  "4", ["2", "6", "8"], "With n = 3, m_l = −1 is possible for l = 1 (3p) and l = 2 (3d) — two orbitals, each holding 2 electrons: 4.")
C("JEE", "Atomic Structure", "tough", "tough",
  "The total number of nodes and the number of angular nodes for a 4d orbital are, respectively,",
  "3 and 2", ["4 and 2", "3 and 1", "2 and 2"], "Total nodes = n − 1 = 3; angular nodes = l = 2; radial nodes = n − l − 1 = 1.")
C("NEET", "Atomic Structure", "formula", "moderate",
  "The number of radial nodes in a 3p orbital is",
  "1", ["0", "2", "3"], "Radial nodes = n − l − 1 = 3 − 1 − 1 = 1.")

# ---------------- Thermodynamics ----------------
C("NEET", "Thermodynamics", "tough", "tough",
  "Bond enthalpies (kJ/mol): H–H 436, Cl–Cl 242, H–Cl 431. ΔH for H₂(g) + Cl₂(g) → 2HCl(g) is",
  "−184 kJ", ["+184 kJ", "−247 kJ", "−92 kJ"], "ΔH = Σ(bonds broken) − Σ(bonds formed) = (436 + 242) − 2(431) = 678 − 862 = −184 kJ.")
dfh = -393.5 + 2 * (-285.8) + 890.3
C("JEE", "Thermodynamics", "tough", "tough",
  "ΔcH°(CH₄) = −890.3 kJ/mol, ΔfH°(CO₂) = −393.5 kJ/mol and ΔfH°(H₂O, l) = −285.8 kJ/mol. ΔfH° of CH₄ is",
  f"{dfh:.1f} kJ/mol".replace("-", "−"), [f"{-dfh:.1f} kJ/mol", f"{-393.5-285.8+890.3:.1f} kJ/mol", f"{-393.5 - 571.6 - 890.3:.1f} kJ/mol".replace("-", "−")],
  f"CH₄ + 2O₂ → CO₂ + 2H₂O: −890.3 = [−393.5 + 2(−285.8)] − ΔfH(CH₄) → ΔfH(CH₄) = {dfh:.1f} kJ/mol.".replace("-", "−"))
dG = -2.303 * R * 300 * 1 / 1000
C("NEET", "Thermodynamics", "tough", "tough",
  "For a reaction at 300 K, the equilibrium constant is 10. ΔG° for the reaction is about (R = 8.314 J/mol K)",
  f"{dG:.2f} kJ/mol".replace("-", "−"), [f"{-dG:.2f} kJ/mol", "0 kJ/mol", f"{dG*10:.1f} kJ/mol".replace("-", "−")],
  f"ΔG° = −2.303RT log K = −2.303 × 8.314 × 300 × 1 J ≈ {dG:.2f} kJ/mol.".replace("-", "−"))
dH = -3267.0 + (-1.5) * R * 298 / 1000
C("JEE", "Thermodynamics", "tough", "tough",
  "For C₆H₆(l) + 15/2 O₂(g) → 6CO₂(g) + 3H₂O(l), ΔU = −3267.0 kJ/mol at 298 K. ΔH is about",
  f"{dH:.1f} kJ/mol".replace("-", "−"), [f"{-3267.0 + 1.5*R*298/1000:.1f} kJ/mol".replace("-", "−"), "−3267.0 kJ/mol", f"{-3267.0 - 4.5*R*298/1000:.1f} kJ/mol".replace("-", "−")],
  f"Δn_g = 6 − 7.5 = −1.5. ΔH = ΔU + Δn_gRT = −3267.0 − 1.5 × 8.314 × 298/1000 ≈ {dH:.1f} kJ/mol.".replace("-", "−"))
C("NEET", "Thermodynamics", "tough", "tough",
  "Which process has ΔS > 0?",
  "Dissolving solid NH₄Cl in water", ["Freezing of water", "N₂(g) + 3H₂(g) → 2NH₃(g)", "Condensation of steam"],
  "Dissolution spreads ions through the solution, increasing disorder. The other three decrease the number of gas molecules or freeze/condense the substance.")
C("JEE", "Thermodynamics", "tough", "tough",
  "A reaction has ΔH < 0 and ΔS < 0. It is",
  "spontaneous only at low temperatures", ["spontaneous at all temperatures", "non-spontaneous at all temperatures", "spontaneous only at high temperatures"],
  "ΔG = ΔH − TΔS. With both negative, ΔG < 0 only when T is small enough that |ΔH| > T|ΔS|.")
C("NEET", "Thermodynamics", "formula", "moderate",
  "For which reaction is ΔH = ΔU?",
  "H₂(g) + I₂(g) → 2HI(g)", ["N₂(g) + 3H₂(g) → 2NH₃(g)", "PCl₅(g) → PCl₃(g) + Cl₂(g)", "2SO₂(g) + O₂(g) → 2SO₃(g)"], "ΔH = ΔU + Δn_gRT; only for H₂ + I₂ → 2HI is Δn_g = 0.")

# ---------------- Equilibrium ----------------
C("NEET", "Equilibrium", "tough", "tough",
  "A buffer contains 0.1 M CH₃COOH and 0.2 M CH₃COONa. The pKa of acetic acid is 4.74. The pH of the buffer is (log 2 = 0.30)",
  "5.04", ["4.44", "4.74", "5.34"], "pH = pKa + log([salt]/[acid]) = 4.74 + log 2 = 5.04.")
h = sqrt(1e-14 / 1.8e-5 * 0.1); pH = -log10(h)
C("JEE", "Equilibrium", "tough", "tough",
  "The pH of 0.1 M NH₄Cl solution is about (Kb of NH₃ = 1.8 × 10⁻⁵)",
  f"{pH:.2f}", [f"{14-pH:.2f}", "7.00", f"{-log10(sqrt(1.8e-5*0.1)):.2f}"],
  f"Kh = Kw/Kb = 5.56 × 10⁻¹⁰. [H⁺] = √(Kh × C) = √(5.56 × 10⁻¹¹) ≈ {sig(h)} M, so pH ≈ {pH:.2f}.")
C("NEET", "Equilibrium", "tough", "tough",
  "The solubility of AgCl in 0.01 M NaCl solution is (Ksp of AgCl = 1.8 × 10⁻¹⁰)",
  "1.8 × 10⁻⁸ M", ["1.34 × 10⁻⁵ M", "1.8 × 10⁻¹⁰ M", "1.8 × 10⁻¹² M"], "Common ion: s × 0.01 = 1.8 × 10⁻¹⁰ → s = 1.8 × 10⁻⁸ M.")
s_ = (1.2e-11 / 4) ** (1 / 3); pOH = -log10(2 * s_)
C("JEE", "Equilibrium", "tough", "tough",
  "Ksp of Mg(OH)₂ is 1.2 × 10⁻¹¹. The pH of its saturated solution is about",
  f"{14-pOH:.2f}", [f"{pOH:.2f}", f"{14 + log10(s_):.2f}", "7.00"],
  f"4s³ = 1.2 × 10⁻¹¹ → s ≈ {sig(s_)} M; [OH⁻] = 2s ≈ {sig(2*s_)} M; pOH ≈ {pOH:.2f}, pH ≈ {14-pOH:.2f}.")
kp = 4 * 0.2 ** 2 * 1 / (1 - 0.2 ** 2)
C("NEET", "Equilibrium", "tough", "tough",
  "N₂O₄(g) ⇌ 2NO₂(g) is 20% dissociated at equilibrium at a total pressure of 1 atm. Kp is about",
  f"{kp:.3f} atm", ["0.160 atm", "0.200 atm", f"{0.04/0.8:.3f} atm"],
  f"Kp = 4α²P/(1 − α²) = 4 × 0.04 × 1/0.96 ≈ {kp:.3f} atm.")
C("JEE", "Equilibrium", "tough", "tough",
  "For N₂(g) + 3H₂(g) ⇌ 2NH₃(g), the relation between Kp and Kc is",
  "Kp = Kc(RT)⁻²", ["Kp = Kc(RT)²", "Kp = Kc", "Kp = Kc(RT)⁻¹"], "Kp = Kc(RT)^Δn with Δn = 2 − 4 = −2.")
C("NEET", "Equilibrium", "tough", "tough",
  "For the exothermic reaction 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), the yield of SO₃ is increased by",
  "increasing pressure and lowering temperature", ["lowering pressure and raising temperature", "adding a catalyst", "removing O₂"],
  "Le Chatelier: fewer gas moles on the right favour high pressure; an exothermic forward reaction is favoured by lower temperature. A catalyst does not shift equilibrium.")
C("JEE", "Equilibrium", "formula", "moderate",
  "The pH of a 10⁻⁸ M HCl solution at 25 °C is",
  "slightly less than 7 (about 6.98)", ["8", "6", "exactly 7"],
  "[H⁺] from water (≈10⁻⁷ M) cannot be ignored: [H⁺] ≈ 1.05 × 10⁻⁷ M → pH ≈ 6.98, slightly below 7 (acidic, never 8).")
C("NEET", "Equilibrium", "formula", "moderate",
  "The conjugate base of HPO₄²⁻ is",
  "PO₄³⁻", ["H₂PO₄⁻", "H₃PO₄", "HPO₄⁻"], "A conjugate base has one H⁺ fewer: HPO₄²⁻ → PO₄³⁻ + H⁺.")

# ---------------- Redox + Electrochemistry ----------------
E = 1.10 - 0.0591 / 2 * 2
C("NEET", "Redox Reactions and Electrochemistry", "tough", "tough",
  "For the Daniell cell Zn | Zn²⁺(0.1 M) || Cu²⁺(0.001 M) | Cu, E°cell = 1.10 V. The cell emf at 298 K is",
  f"{E:.3f} V", ["1.159 V", "1.100 V", f"{1.10 - 0.0591*2:.3f} V"],
  f"E = E° − (0.0591/2) log([Zn²⁺]/[Cu²⁺]) = 1.10 − 0.02955 × log 100 = 1.10 − 0.0591 ≈ {E:.3f} V.")
C("JEE", "Redox Reactions and Electrochemistry", "tough", "tough",
  "The potential of a hydrogen electrode (p(H₂) = 1 bar) dipped in a solution of pH 3 at 298 K is",
  "−0.177 V", ["+0.177 V", "−0.059 V", "0 V"], "E = −0.0591 × pH = −0.0591 × 3 ≈ −0.177 V.")
C("NEET", "Redox Reactions and Electrochemistry", "tough", "tough",
  "The charge needed to obtain 27 g of aluminium from molten Al₂O₃ is (F = 96500 C/mol)",
  "289500 C", ["96500 C", "193000 C", "386000 C"], "Al³⁺ + 3e⁻ → Al. 27 g = 1 mol Al needs 3 mol e⁻ = 3 × 96500 = 289500 C.")
C("JEE", "Redox Reactions and Electrochemistry", "tough", "tough",
  "Λ°m (S cm²/mol) of HCl, CH₃COONa and NaCl are 426.2, 91.0 and 126.4. For 0.001 M acetic acid, Λm = 39.1 S cm²/mol. Its degree of dissociation is about",
  "0.10", ["0.39", "0.05", "0.20"],
  "Λ°(CH₃COOH) = 426.2 + 91.0 − 126.4 = 390.8. α = Λm/Λ° = 39.1/390.8 ≈ 0.10 (Kohlrausch's law).")
C("JEE", "Redox Reactions and Electrochemistry", "tough", "tough",
  "What volume of 0.02 M KMnO₄ is needed to oxidise 25 mL of 0.1 M oxalic acid in acidic medium?",
  "50 mL", ["25 mL", "125 mL", "20 mL"],
  "2MnO₄⁻ + 5C₂O₄²⁻ + 16H⁺ → 2Mn²⁺ + 10CO₂ + 8H₂O. Oxalate = 2.5 mmol needs 1.0 mmol MnO₄⁻ = 1.0/0.02 = 50 mL.")
C("NEET", "Redox Reactions and Electrochemistry", "tough", "tough",
  "In acidic medium, one mole of KMnO₄ can oxidise how many moles of FeSO₄ (Fe²⁺ → Fe³⁺)?",
  "5", ["1", "3", "2"], "MnO₄⁻ gains 5 electrons (Mn +7 → +2); each Fe²⁺ loses 1 electron, so 5 mol Fe²⁺.")
C("NEET", "Redox Reactions and Electrochemistry", "tough", "tough",
  "In the reaction 3Cl₂ + 6OH⁻ → 5Cl⁻ + ClO₃⁻ + 3H₂O, chlorine is",
  "both oxidised and reduced (disproportionation)", ["only oxidised", "only reduced", "neither oxidised nor reduced"],
  "Cl goes from 0 to −1 (in Cl⁻) and from 0 to +5 (in ClO₃⁻).")
C("JEE", "Redox Reactions and Electrochemistry", "formula", "moderate",
  "A current of 0.5 A is passed through AgNO₃ solution. The time needed to deposit 1.08 g of silver is (Ag = 108, F = 96500 C/mol)",
  "1930 s", ["965 s", "3860 s", "193 s"], "1.08 g = 0.01 mol Ag needs 965 C. t = 965/0.5 = 1930 s.")
C("NEET", "Redox Reactions and Electrochemistry", "formula", "moderate",
  "The oxidation number of Cr in K₂Cr₂O₇ is",
  "+6", ["+7", "+3", "+12"], "2(+1) + 2x + 7(−2) = 0 → x = +6.")

# ---------------- Solutions ----------------
C("NEET", "Solutions", "tough", "tough",
  "The osmotic pressure of 0.1 M glucose solution at 300 K is about (R = 0.0821 L atm/mol K)",
  "2.46 atm", ["24.6 atm", "0.246 atm", "4.92 atm"], "π = CRT = 0.1 × 0.0821 × 300 ≈ 2.46 atm.")
C("JEE", "Solutions", "tough", "tough",
  "A 0.01 molal aqueous K₂SO₄ solution is 75% dissociated. Its freezing-point depression is (Kf = 1.86 K kg/mol)",
  "0.0465 K", ["0.0558 K", "0.0186 K", "0.0372 K"], "i = 1 + 2α = 2.5. ΔTf = iKf m = 2.5 × 1.86 × 0.01 = 0.0465 K.")
C("NEET", "Solutions", "tough", "tough",
  "Benzene (P° = 75 torr) and toluene (P° = 22 torr) form an ideal solution with mole fraction 0.5 each. The mole fraction of benzene in the vapour is about",
  "0.77", ["0.50", "0.23", "0.65"], "p(benzene) = 37.5, p(toluene) = 11; total 48.5 torr. y = 37.5/48.5 ≈ 0.77.")
C("JEE", "Solutions", "tough", "tough",
  "In benzene, acetic acid (M = 60) partly dimerises and shows an apparent molar mass of 100. The degree of association is",
  "80%", ["40%", "60%", "100%"], "i = 60/100 = 0.6. For dimerisation, i = 1 − α/2 → α = 2(1 − 0.6) = 0.8 = 80%.")
C("NEET", "Solutions", "tough", "tough",
  "Which of these aqueous solutions has the highest boiling point?",
  "0.1 M Al₂(SO₄)₃", ["0.1 M NaCl", "0.1 M glucose", "0.1 M BaCl₂"], "Boiling-point elevation ∝ i × m. Al₂(SO₄)₃ gives i ≈ 5, the largest.")
C("JEE", "Solutions", "tough", "tough",
  "A mixture of ethanol and acetone shows positive deviation from Raoult's law. Which statement is correct?",
  "ΔmixH > 0 and the vapour pressure is higher than predicted", ["ΔmixH < 0 and it forms a maximum-boiling azeotrope", "ΔmixV < 0", "A–B attractions are stronger than A–A and B–B"],
  "Acetone breaks some hydrogen bonds of ethanol, so A–B attraction is weaker: endothermic mixing, volume increases, higher vapour pressure (minimum-boiling azeotrope).")
C("NEET", "Solutions", "formula", "moderate",
  "According to Henry's law, the solubility of a gas in a liquid",
  "is proportional to its partial pressure above the liquid", ["increases with temperature", "is independent of pressure", "is inversely proportional to pressure"],
  "p = K_H x; higher pressure dissolves more gas (used in soda bottles).")

# ---------------- Chemical Kinetics ----------------
Ea = 2.303 * R * log10(2) * (300 * 310 / 10) / 1000
C("JEE", "Chemical Kinetics", "tough", "tough",
  "The rate of a reaction doubles when the temperature rises from 300 K to 310 K. Its activation energy is about (R = 8.314 J/mol K, log 2 = 0.301)",
  f"{Ea:.1f} kJ/mol", [f"{Ea/2:.1f} kJ/mol", f"{Ea*2.303:.1f} kJ/mol", f"{Ea/2.303:.1f} kJ/mol"],
  f"log(k₂/k₁) = Ea/(2.303R) × (T₂ − T₁)/(T₁T₂) → Ea = 2.303 × 8.314 × 0.301 × (300 × 310/10) ≈ {Ea:.1f} kJ/mol.")
C("NEET", "Chemical Kinetics", "tough", "tough",
  "For a first-order reaction, the time required for 99.9% completion is about how many times its half-life?",
  "10", ["3", "100", "6.9"], "t = (2.303/k) log 1000 = 6.909/k, and t½ = 0.693/k. Ratio ≈ 9.97 ≈ 10.")
C("JEE", "Chemical Kinetics", "tough", "tough",
  "For a zero-order reaction with initial concentration [A]₀ and rate constant k, the half-life is",
  "[A]₀/2k", ["0.693/k", "1/(k[A]₀)", "2[A]₀/k"], "[A] = [A]₀ − kt. At t½, [A]₀/2 = kt½ → t½ = [A]₀/2k (it grows with [A]₀).")
C("NEET", "Chemical Kinetics", "tough", "tough",
  "For the reaction 2N₂O₅ → 4NO₂ + O₂, the rate of formation of NO₂ is 2.8 × 10⁻³ mol L⁻¹ s⁻¹. The rate of disappearance of N₂O₅ is",
  "1.4 × 10⁻³ mol L⁻¹ s⁻¹", ["2.8 × 10⁻³ mol L⁻¹ s⁻¹", "5.6 × 10⁻³ mol L⁻¹ s⁻¹", "0.7 × 10⁻³ mol L⁻¹ s⁻¹"],
  "−½ d[N₂O₅]/dt = ¼ d[NO₂]/dt → −d[N₂O₅]/dt = ½ × 2.8 × 10⁻³ = 1.4 × 10⁻³.")
C("JEE", "Chemical Kinetics", "formula", "moderate",
  "The unit of the rate constant of a second-order reaction is",
  "L mol⁻¹ s⁻¹", ["s⁻¹", "mol L⁻¹ s⁻¹", "L² mol⁻² s⁻¹"], "k = rate/[A]² → (mol L⁻¹ s⁻¹)/(mol L⁻¹)² = L mol⁻¹ s⁻¹.")
C("NEET", "Chemical Kinetics", "formula", "moderate",
  "A catalyst increases the rate of a reaction by",
  "lowering its activation energy", ["increasing ΔH", "shifting the equilibrium to the right", "increasing the activation energy"],
  "It provides an alternate path of lower Ea; ΔH, ΔG and the equilibrium constant are unchanged.")

# ---------------- Coordination + d-block ----------------
C("NEET", "Coordination Compounds", "tough", "tough",
  "The spin-only magnetic moment of [MnCl₄]²⁻ is about",
  "5.92 BM", ["1.73 BM", "3.87 BM", "0 BM"], "Mn²⁺ is d⁵; Cl⁻ is weak field and the complex is tetrahedral → 5 unpaired electrons: √(5 × 7) ≈ 5.92 BM.")
C("JEE", "Coordination Compounds", "tough", "tough",
  "The spin-only magnetic moment of [Fe(CN)₆]³⁻ is about",
  "1.73 BM", ["5.92 BM", "0 BM", "2.83 BM"], "Fe³⁺ is d⁵; CN⁻ is strong field → low spin t₂g⁵ with 1 unpaired electron: √3 ≈ 1.73 BM.")
C("JEE", "Coordination Compounds", "tough", "tough",
  "The crystal field stabilisation energy of the low-spin octahedral complex [Co(NH₃)₆]³⁺ is",
  "−2.4Δₒ", ["−0.4Δₒ", "−1.2Δₒ", "−2.0Δₒ"], "Co³⁺ d⁶ low spin: t₂g⁶ e_g⁰. CFSE = 6 × (−0.4Δₒ) = −2.4Δₒ (pairing energy ignored).")
C("NEET", "Coordination Compounds", "tough", "tough",
  "How many stereoisomers does [Co(en)₂Cl₂]⁺ have in total?",
  "3", ["2", "4", "1"], "trans (optically inactive) + cis, which exists as a pair of enantiomers: 3 in total.")
C("NEET", "Coordination Compounds", "tough", "tough",
  "1 mol of CoCl₃·6NH₃ gives 3 mol of AgCl with excess AgNO₃. Its correct formula is",
  "[Co(NH₃)₆]Cl₃", ["[Co(NH₃)₅Cl]Cl₂·NH₃", "[Co(NH₃)₄Cl₂]Cl·2NH₃", "[Co(NH₃)₃Cl₃]·3NH₃"], "All three Cl⁻ are ionisable, so none is in the coordination sphere.")
C("JEE", "Coordination Compounds", "tough", "tough",
  "The IUPAC name of K₃[Fe(C₂O₄)₃] is",
  "potassium trioxalatoferrate(III)", ["potassium trioxalatoiron(III)", "potassium ferric oxalate", "tripotassium oxalatoferrate(II)"],
  "In an anionic complex the metal name ends in -ate (ferrate); oxalate ligand is 'oxalato'; Fe is +3.")
C("NEET", "Coordination Compounds", "formula", "moderate",
  "The coordination number and oxidation state of Pt in [Pt(en)₂Cl₂]²⁺ are",
  "6 and +4", ["4 and +2", "6 and +2", "4 and +4"], "Two bidentate en (4) + two Cl⁻ (2) = 6. x + 0 − 2 = +2 → x = +4.")
C("NEET", "d- and f-Block Elements", "tough", "tough",
  "Zr and Hf have almost identical atomic radii because of",
  "lanthanoid contraction", ["actinoid contraction", "inert pair effect", "diagonal relationship"],
  "Poor shielding by 4f electrons reduces the size of Hf, so it nearly equals Zr (one period above).")
C("JEE", "d- and f-Block Elements", "tough", "tough",
  "On adding an alkali to an orange solution of K₂Cr₂O₇, the colour changes to yellow because",
  "dichromate changes to chromate (Cr stays +6)", ["Cr is reduced from +6 to +3", "Cr is oxidised to +7", "a chromium(III) hydroxide forms"],
  "Cr₂O₇²⁻ + 2OH⁻ ⇌ 2CrO₄²⁻ + H₂O; it is an acid–base change, not redox.")
C("NEET", "d- and f-Block Elements", "tough", "tough",
  "Among the following, which ion is colourless in aqueous solution?",
  "Sc³⁺", ["Ti³⁺", "Cr³⁺", "Mn²⁺"], "Sc³⁺ is 3d⁰ — no d–d transition possible. Ti³⁺ (d¹), Cr³⁺ (d³) and Mn²⁺ (d⁵) are coloured.")
C("JEE", "d- and f-Block Elements", "tough", "tough",
  "Which statement about the lanthanoids is correct?",
  "Ce⁴⁺ is a good oxidising agent and Eu²⁺ a good reducing agent", ["All lanthanoids show only the +2 state", "Their ionic radii increase from La³⁺ to Lu³⁺", "Eu²⁺ is a strong oxidising agent"],
  "+3 is the common state. Ce⁴⁺ tends to gain an electron (oxidant); Eu²⁺ tends to lose one (reductant). Radii decrease across the series.")
C("NEET", "d- and f-Block Elements", "formula", "moderate",
  "The highest oxidation state shown by manganese is",
  "+7", ["+6", "+4", "+8"], "Mn (3d⁵4s²) can use all seven electrons, e.g. in KMnO₄.")

# ---------------- Organic: quantitative ----------------
C("NEET", "Organic Chemistry Basic Principles", "tough", "tough",
  "In Kjeldahl's method, the ammonia from 0.5 g of an organic compound neutralised 10 mL of 1 M H₂SO₄. The percentage of nitrogen is",
  "56%", ["28%", "14%", "42%"], "10 mL 1 M H₂SO₄ = 0.01 mol, neutralises 0.02 mol NH₃ → 0.28 g N. % N = 0.28/0.5 × 100 = 56%.")
C("JEE", "Organic Chemistry Basic Principles", "tough", "tough",
  "In a Carius estimation, 0.20 g of an organic compound gave 0.287 g of AgCl. The percentage of chlorine is (AgCl = 143.5)",
  "35.5%", ["71%", "17.75%", "28.7%"], "Cl = 0.287 × 35.5/143.5 = 0.071 g. % = 0.071/0.20 × 100 = 35.5%.")
C("JEE", "Organic Chemistry Basic Principles", "tough", "tough",
  "The degree of unsaturation (double-bond equivalent) of nitrobenzene, C₆H₅NO₂, calculated from its molecular formula is",
  "5", ["4", "6", "3"], "DBE = C − H/2 + N/2 + 1 = 6 − 2.5 + 0.5 + 1 = 5 (benzene ring 4 + N=O 1).")

# ======= Hand-written: shared NEET + JEE =======
B = "BOTH"
tough = [
 ("Organic Chemistry Basic Principles", "The correct order of stability of these carbocations is",
  "(CH₃)₃C⁺ > (CH₃)₂CH⁺ > CH₃CH₂⁺ > CH₃⁺", ["CH₃⁺ > CH₃CH₂⁺ > (CH₃)₂CH⁺ > (CH₃)₃C⁺", "(CH₃)₂CH⁺ > (CH₃)₃C⁺ > CH₃CH₂⁺ > CH₃⁺", "CH₃CH₂⁺ > CH₃⁺ > (CH₃)₂CH⁺ > (CH₃)₃C⁺"],
  "More alkyl groups → more hyperconjugation and +I effect → more stable carbocation."),
 ("Organic Chemistry Basic Principles", "In Lassaigne's test, a blood-red colour with FeCl₃ indicates the presence of",
  "both nitrogen and sulphur", ["nitrogen only", "sulphur only", "a halogen"], "N and S together give NaSCN, which forms blood-red [Fe(SCN)]²⁺ with Fe³⁺."),
 ("Organic Chemistry Basic Principles", "Which species is an electrophile?",
  "NO₂⁺", ["NH₃", "OH⁻", "CN⁻"], "The nitronium ion is electron-deficient and attacks electron-rich centres; the others have lone pairs to donate (nucleophiles)."),
 ("Hydrocarbons", "Ozonolysis of but-2-ene followed by Zn/H₂O gives",
  "two molecules of ethanal", ["one molecule of propanal and one of methanal", "two molecules of propanone", "butanal"],
  "CH₃CH=CHCH₃ is cleaved at the double bond into 2 CH₃CHO."),
 ("Hydrocarbons", "Ethyne is more acidic than ethene and ethane because",
  "its sp carbon (50% s-character) holds the C–H electron pair more tightly", ["it has more hydrogen atoms", "it is a gas", "its carbon is sp³ hybridised"],
  "Higher s-character means higher electronegativity of carbon, so the conjugate base (acetylide) is more stable."),
 ("Hydrocarbons", "Hydrogenation of but-2-yne with H₂ over Lindlar's catalyst gives",
  "cis-but-2-ene", ["trans-but-2-ene", "butane", "but-1-ene"], "Lindlar's catalyst (Pd on CaCO₃ poisoned with quinoline) stops at the alkene and gives syn (cis) addition; Na/liquid NH₃ gives trans."),
 ("Hydrocarbons", "Addition of HBr to propene in the presence of benzoyl peroxide gives mainly",
  "1-bromopropane", ["2-bromopropane", "1,2-dibromopropane", "propane"], "Peroxide effect (Kharasch): free-radical addition gives the anti-Markovnikov product."),
 ("Hydrocarbons", "Among the cyclopentadienyl anion, cyclopentadienyl cation, cyclobutadiene and cyclooctatetraene, the aromatic species is",
  "Cyclopentadienyl anion", ["Cyclooctatetraene", "Cyclopentadienyl cation", "Cyclobutadiene"],
  "The anion is planar, cyclic and has 6 π electrons (4n + 2 with n = 1). The others have 8, 4 or 4 π electrons."),
 ("Hydrocarbons", "Which group is ortho/para-directing but deactivating in electrophilic substitution on benzene?",
  "–Cl", ["–OH", "–NO₂", "–CH₃"], "Halogens withdraw electrons by −I (deactivating) but donate by +R to ortho/para positions."),
 ("Haloalkanes and Haloarenes", "SN2 reaction of (R)-2-bromobutane with OH⁻ gives",
  "(S)-butan-2-ol with inversion of configuration", ["a racemic mixture", "(R)-butan-2-ol with retention", "but-2-ene only"],
  "SN2 is a one-step backside attack, so configuration is inverted (Walden inversion)."),
 ("Haloalkanes and Haloarenes", "The order of reactivity towards SN2 reaction is",
  "CH₃Br > CH₃CH₂Br > (CH₃)₂CHBr > (CH₃)₃CBr", ["(CH₃)₃CBr > (CH₃)₂CHBr > CH₃CH₂Br > CH₃Br", "(CH₃)₂CHBr > CH₃Br > (CH₃)₃CBr > CH₃CH₂Br", "All react at the same rate"],
  "SN2 needs backside attack; bulky groups hinder it, so methyl > 1° > 2° > 3°."),
 ("Haloalkanes and Haloarenes", "Chlorobenzene is much less reactive towards nucleophilic substitution than chloroethane because",
  "the C–Cl bond has partial double-bond character due to resonance", ["chlorine is more electronegative in chlorobenzene", "chlorobenzene is a gas", "the C–Cl bond is longer in chlorobenzene"],
  "Lone pairs of Cl conjugate with the ring, making C–Cl shorter and stronger; also sp² carbon holds the electrons more tightly."),
 ("Alcohols, Phenols and Ethers", "o-Nitrophenol is steam volatile while p-nitrophenol is not, because",
  "o-nitrophenol has intramolecular hydrogen bonding", ["p-nitrophenol is less polar", "o-nitrophenol has intermolecular hydrogen bonding", "p-nitrophenol is a gas"],
  "Intramolecular H-bonding in the ortho isomer prevents association between molecules; the para isomer is held by intermolecular H-bonds."),
 ("Alcohols, Phenols and Ethers", "The correct order of acidity is",
  "p-nitrophenol > phenol > ethanol", ["ethanol > phenol > p-nitrophenol", "phenol > p-nitrophenol > ethanol", "phenol > ethanol > p-nitrophenol"],
  "Phenoxide is resonance-stabilised; −NO₂ at para stabilises it further. Ethoxide has no resonance."),
 ("Alcohols, Phenols and Ethers", "Anisole on heating with HI gives",
  "phenol and methyl iodide", ["iodobenzene and methanol", "benzene and methanol", "iodobenzene and methyl iodide"],
  "The O–C(aryl) bond has partial double-bond character, so I⁻ attacks the methyl carbon: C₆H₅OH + CH₃I."),
 ("Alcohols, Phenols and Ethers", "With the Lucas reagent, which alcohol gives turbidity immediately at room temperature?",
  "2-methylpropan-2-ol", ["butan-1-ol", "butan-2-ol", "methanol"], "Lucas test speed depends on carbocation stability: 3° immediate, 2° within minutes, 1° only on heating."),
 ("Aldehydes, Ketones and Carboxylic Acids", "The correct order of reactivity towards nucleophilic addition is",
  "HCHO > CH₃CHO > CH₃COCH₃", ["CH₃COCH₃ > CH₃CHO > HCHO", "CH₃CHO > HCHO > CH₃COCH₃", "All are equally reactive"],
  "Alkyl groups reduce the positive charge on the carbonyl carbon and add steric hindrance."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Among propan-2-ol, propan-1-ol, methanol and benzaldehyde, the one that gives a positive iodoform test is",
  "Propan-2-ol", ["Propan-1-ol", "Methanol", "Benzaldehyde"], "Iodoform test needs CH₃CO– or CH₃CH(OH)–; propan-2-ol is oxidised to propanone."),
 ("Aldehydes, Ketones and Carboxylic Acids", "The correct order of acid strength of fluoroacetic, chloroacetic and acetic acids is",
  "FCH₂COOH > ClCH₂COOH > CH₃COOH", ["CH₃COOH > ClCH₂COOH > FCH₂COOH", "ClCH₂COOH > FCH₂COOH > CH₃COOH", "All are equally acidic"],
  "Electron-withdrawing halogens stabilise the carboxylate; F has the strongest −I effect."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Among benzaldehyde, acetaldehyde, propanone and propanal, the one that undergoes the Cannizzaro reaction is",
  "Benzaldehyde", ["Acetaldehyde", "Propanone", "Propanal"], "Cannizzaro needs an aldehyde with no α-hydrogen, such as HCHO or C₆H₅CHO."),
 ("Amines", "The correct order of basic strength of the methylamines and ammonia in aqueous solution is",
  "(CH₃)₂NH > CH₃NH₂ > (CH₃)₃N > NH₃", ["(CH₃)₃N > (CH₃)₂NH > CH₃NH₂ > NH₃", "NH₃ > CH₃NH₂ > (CH₃)₂NH > (CH₃)₃N", "CH₃NH₂ > NH₃ > (CH₃)₂NH > (CH₃)₃N"],
  "In water, inductive effect, solvation (H-bonding) and steric factors together give 2° > 1° > 3° > NH₃ for methyl amines."),
 ("Amines", "Aniline is a weaker base than ammonia because",
  "its nitrogen lone pair is delocalised into the benzene ring", ["it has a higher molar mass", "it is insoluble in water", "nitrogen in aniline is sp³ and more electronegative"],
  "Resonance makes the lone pair less available for protonation; the anilinium ion has no such resonance."),
 ("Amines", "Direct nitration of aniline with a nitrating mixture gives a substantial amount of the meta product because",
  "in strongly acidic medium aniline is protonated to the anilinium ion, a meta-director", ["–NH₂ is a meta-directing group", "nitration does not occur at ortho", "aniline is oxidised to nitrobenzene"],
  "C₆H₅NH₃⁺ is deactivating and meta-directing; that is why the amino group is first protected by acetylation."),
 ("Amines", "Benzenediazonium chloride is prepared from aniline at 273–278 K because",
  "the diazonium salt is unstable at higher temperatures", ["the reaction is endothermic", "nitrous acid is stable only when hot", "aniline freezes above 278 K"],
  "Arenediazonium salts decompose (giving phenol and N₂) when warmed, so they are made and used cold."),
 ("Biomolecules", "Glucose does not give the 2,4-DNP test or Schiff's test. This shows that",
  "its aldehyde group mostly exists in a cyclic (hemiacetal) form", ["it has no carbonyl group at all", "it is a ketose", "it is not a reducing sugar"],
  "Glucose exists mainly as the six-membered pyranose ring; only a little open chain is present, so these tests fail."),
 ("Biomolecules", "Sucrose is called invert sugar after hydrolysis because",
  "the sign of optical rotation changes from dextro to laevo", ["it forms only glucose", "it becomes a reducing polymer", "its molar mass doubles"],
  "Sucrose (+66.5°) gives glucose (+52.5°) and fructose (−92.4°); the mixture is laevorotatory."),
 ("Biomolecules", "Which pair of bases is joined by three hydrogen bonds in DNA?",
  "Guanine–cytosine", ["Adenine–thymine", "Adenine–uracil", "Guanine–thymine"], "G≡C has three H-bonds and A=T two."),
 ("Biomolecules", "Denaturation of a protein, for example on boiling an egg, affects",
  "its secondary and tertiary structure but not the primary structure", ["only the primary structure", "the peptide bonds", "the amino acid sequence"],
  "Heat breaks H-bonds and other weak interactions; the peptide bonds (primary structure) stay intact."),
 ("p-Block Elements", "According to VSEPR theory, the shape of chlorine trifluoride (ClF₃) is",
  "T-shaped", ["trigonal planar", "trigonal pyramidal", "see-saw"], "Cl has 3 bond pairs + 2 lone pairs (trigonal bipyramidal arrangement); lone pairs in equatorial positions give a T shape."),
 ("p-Block Elements", "The geometry of XeF₄ is",
  "square planar", ["tetrahedral", "see-saw", "square pyramidal"], "Xe has 4 bond pairs + 2 lone pairs (octahedral arrangement); lone pairs opposite each other give a square planar shape."),
 ("p-Block Elements", "H₃PO₂ is",
  "monobasic and a good reducing agent", ["tribasic and an oxidising agent", "dibasic and non-reducing", "tribasic and a reducing agent"],
  "It has one P–OH (ionisable) and two P–H bonds; P–H bonds make it reducing."),
 ("p-Block Elements", "Among the hydrogen halides in water, the weakest acid is",
  "HF", ["HCl", "HBr", "HI"], "The H–F bond is very strong, so HF ionises least; acid strength increases HF < HCl < HBr < HI."),
 ("p-Block Elements", "The bond angle in PH₃ is smaller than in NH₃ mainly because",
  "phosphorus is larger and less electronegative, so bond pairs are farther apart and repel less", ["PH₃ has two lone pairs", "PH₃ is planar", "P uses sp² hybrid orbitals"],
  "Bond-pair repulsion falls as the central atom gets bigger and less electronegative: NH₃ ≈ 107°, PH₃ ≈ 93.6°."),
 ("p-Block Elements", "In the brown ring test for nitrate, the brown ring is due to",
  "[Fe(H₂O)₅NO]²⁺", ["Fe₂O₃", "[Fe(CN)₆]⁴⁻", "NO₂ gas"], "Fe²⁺ reduces nitrate to NO, which binds to [Fe(H₂O)₆]²⁺ forming the brown nitrosyl complex at the acid interface."),
 ("p-Block Elements", "Solid PCl₅ exists as",
  "[PCl₄]⁺[PCl₆]⁻", ["PCl₅ molecules only", "[PCl₆]⁺[PCl₄]⁻", "PCl₃ and Cl₂"], "In the solid, PCl₅ ionises into tetrahedral [PCl₄]⁺ and octahedral [PCl₆]⁻."),
 ("Chemical Bonding and Molecular Structure", "According to molecular orbital theory, which species is paramagnetic?",
  "O₂", ["N₂", "F₂", "C₂²⁻"], "O₂ has two unpaired electrons in π* orbitals; N₂, F₂ and C₂²⁻ have all electrons paired."),
 ("Chemical Bonding and Molecular Structure", "The bond orders of O₂⁺, O₂ and O₂⁻ are, respectively,",
  "2.5, 2 and 1.5", ["2, 2.5 and 1.5", "1.5, 2 and 2.5", "2.5, 1.5 and 2"], "Removing a π* electron raises bond order by 0.5; adding one lowers it by 0.5."),
 ("Chemical Bonding and Molecular Structure", "Among BF₃, NH₃, H₂O and NF₃, the molecule with zero dipole moment is",
  "BF₃", ["NH₃", "H₂O", "NF₃"], "BF₃ is trigonal planar; the three B–F dipoles cancel."),
 ("Chemical Bonding and Molecular Structure", "The hybridisation of the central atom in SF₆ and in PCl₅ is, respectively,",
  "sp³d² and sp³d", ["sp³d and sp³d²", "sp³ and sp³d", "d²sp³ and sp³"], "SF₆: 6 bond pairs (octahedral, sp³d²). PCl₅: 5 bond pairs (trigonal bipyramidal, sp³d)."),
 ("Classification of Elements and Periodicity", "The correct order of first ionisation enthalpy of B, C, N and O is",
  "B < C < O < N", ["B < C < N < O", "C < B < N < O", "O < N < C < B"], "N has a stable half-filled 2p³ configuration, so its IE is higher than O's. B (2p¹) is lowest."),
 ("Classification of Elements and Periodicity", "Which element has the most negative electron gain enthalpy?",
  "Chlorine", ["Fluorine", "Oxygen", "Bromine"], "F is small, so electron–electron repulsion in its compact 2p shell makes its value less negative than Cl's."),
 ("Classification of Elements and Periodicity", "The correct order of ionic radii is",
  "N³⁻ > O²⁻ > F⁻ > Na⁺ > Mg²⁺", ["Mg²⁺ > Na⁺ > F⁻ > O²⁻ > N³⁻", "F⁻ > O²⁻ > N³⁻ > Na⁺ > Mg²⁺", "Na⁺ > Mg²⁺ > N³⁻ > O²⁻ > F⁻"],
  "These are isoelectronic (10 electrons). Larger nuclear charge pulls the electrons closer, so radius falls as Z rises."),
]
for chap, q, c, w, e in tough:
    C(B, chap, "tough", "tough", q, c, w, e)

named = [
 ("Alcohols, Phenols and Ethers", "Phenol treated with chloroform and aqueous NaOH, followed by acid, gives salicylaldehyde. This is the",
  "Reimer–Tiemann reaction", ["Kolbe reaction", "Williamson synthesis", "Friedel–Crafts reaction"], "CHCl₃/NaOH introduces a –CHO group at the ortho position of phenol."),
 ("Alcohols, Phenols and Ethers", "Sodium phenoxide heated with CO₂ under pressure, followed by acidification, gives salicylic acid. This is the",
  "Kolbe reaction", ["Reimer–Tiemann reaction", "Cannizzaro reaction", "Etard reaction"], "Phenoxide is attacked by the weak electrophile CO₂ at the ortho position."),
 ("Alcohols, Phenols and Ethers", "Ethers are prepared from an alkyl halide and a sodium alkoxide in the",
  "Williamson synthesis", ["Wurtz reaction", "Swarts reaction", "Hoffmann bromamide reaction"], "RX + R′ONa → R–O–R′ + NaX (SN2; works best with primary halides)."),
 ("Haloalkanes and Haloarenes", "Two molecules of an alkyl halide react with sodium in dry ether to form a higher alkane in the",
  "Wurtz reaction", ["Fittig reaction", "Finkelstein reaction", "Sandmeyer reaction"], "2RX + 2Na → R–R + 2NaX."),
 ("Haloalkanes and Haloarenes", "An aryl halide and an alkyl halide react with sodium in dry ether to give an alkylarene. This is the",
  "Wurtz–Fittig reaction", ["Wurtz reaction", "Friedel–Crafts alkylation", "Gattermann reaction"], "ArX + RX + 2Na → Ar–R + 2NaX."),
 ("Haloalkanes and Haloarenes", "Alkyl iodides are made by heating alkyl chlorides or bromides with NaI in dry acetone. This is the",
  "Finkelstein reaction", ["Swarts reaction", "Sandmeyer reaction", "Hunsdiecker reaction"], "NaCl/NaBr formed is insoluble in acetone, pushing the equilibrium forward."),
 ("Haloalkanes and Haloarenes", "Alkyl fluorides are prepared by heating alkyl bromides with AgF, Hg₂F₂ or SbF₃. This is the",
  "Swarts reaction", ["Finkelstein reaction", "Wurtz reaction", "Kolbe reaction"], "Halogen exchange with metallic fluorides gives alkyl fluorides."),
 ("Haloalkanes and Haloarenes", "Benzenediazonium chloride with CuCl/HCl gives chlorobenzene. This is the",
  "Sandmeyer reaction", ["Gattermann–Koch reaction", "Etard reaction", "Rosenmund reduction"], "Cu(I) salts replace –N₂⁺ by Cl, Br or CN (Sandmeyer); Cu powder with HX is the Gattermann reaction."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Acyl chlorides are reduced to aldehydes by H₂ over Pd on BaSO₄. This is the",
  "Rosenmund reduction", ["Stephen reaction", "Clemmensen reduction", "Wolff–Kishner reduction"], "The poisoned catalyst stops the reduction at the aldehyde stage."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Nitriles are reduced by SnCl₂/HCl to imines, which on hydrolysis give aldehydes. This is the",
  "Stephen reaction", ["Rosenmund reduction", "Etard reaction", "Hoffmann bromamide degradation"], "RCN → RCH=NH → RCHO."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Toluene is oxidised to benzaldehyde by chromyl chloride (CrO₂Cl₂). This is the",
  "Etard reaction", ["Gattermann–Koch reaction", "Cannizzaro reaction", "Kolbe reaction"], "CrO₂Cl₂ forms a chromium complex that hydrolyses to benzaldehyde."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Benzene treated with CO and HCl in the presence of anhydrous AlCl₃ (or CuCl) gives benzaldehyde. This is the",
  "Gattermann–Koch reaction", ["Etard reaction", "Friedel–Crafts acylation", "Reimer–Tiemann reaction"], "CO + HCl generate a formyl electrophile."),
 ("Aldehydes, Ketones and Carboxylic Acids", "The carbonyl group is reduced to CH₂ by zinc amalgam and concentrated HCl in the",
  "Clemmensen reduction", ["Wolff–Kishner reduction", "Rosenmund reduction", "Stephen reaction"], "Clemmensen works in acid; Wolff–Kishner (hydrazine + KOH in ethylene glycol) works in base."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Carboxylic acids with an α-hydrogen react with Cl₂ or Br₂ in the presence of red phosphorus to give α-halo acids. This is the",
  "Hell–Volhard–Zelinsky reaction", ["Hoffmann bromamide reaction", "Cannizzaro reaction", "Kolbe electrolysis"], "Red P converts the acid to the acyl halide, which halogenates at the α-carbon."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Two molecules of ethanal combine in dilute NaOH to give 3-hydroxybutanal. This is the",
  "aldol reaction", ["Cannizzaro reaction", "Etard reaction", "Wurtz reaction"], "Aldehydes/ketones with α-hydrogen form β-hydroxy carbonyl compounds (aldols)."),
 ("Amines", "An amide treated with Br₂ and aqueous NaOH gives a primary amine with one carbon atom fewer. This is the",
  "Hoffmann bromamide degradation", ["Gabriel phthalimide synthesis", "carbylamine reaction", "Stephen reaction"], "RCONH₂ + Br₂ + 4NaOH → RNH₂ + Na₂CO₃ + 2NaBr + 2H₂O."),
 ("Amines", "Pure primary aliphatic amines are prepared from phthalimide, KOH and an alkyl halide in the",
  "Gabriel phthalimide synthesis", ["Hoffmann bromamide degradation", "Sandmeyer reaction", "Hinsberg test"], "Aromatic primary amines cannot be made this way, as aryl halides do not undergo SN2 with the phthalimide anion."),
 ("Amines", "Primary amines on warming with chloroform and alcoholic KOH give foul-smelling isocyanides. This test is the",
  "carbylamine reaction", ["Hinsberg test", "Lucas test", "iodoform test"], "Only primary amines (aliphatic or aromatic) give it; secondary and tertiary amines do not."),
 ("Amines", "Hinsberg's reagent, used to distinguish primary, secondary and tertiary amines, is",
  "benzenesulphonyl chloride", ["acetyl chloride", "chloroform + KOH", "nitrous acid"], "1° amines give an alkali-soluble sulphonamide, 2° give an insoluble one, 3° do not react."),
 ("Hydrocarbons", "Electrolysis of an aqueous solution of sodium or potassium salt of a carboxylic acid gives an alkane at the anode. This is",
  "Kolbe's electrolytic method", ["the Wurtz reaction", "the Clemmensen reduction", "decarboxylation with soda lime"], "2RCOO⁻ → R–R + 2CO₂ + 2e⁻ at the anode."),
 ("Hydrocarbons", "Benzene reacts with an alkyl halide in the presence of anhydrous AlCl₃ to give an alkylbenzene. This is",
  "Friedel–Crafts alkylation", ["Wurtz–Fittig reaction", "Gattermann–Koch reaction", "Kolbe reaction"], "AlCl₃ generates the carbocation electrophile from RX."),
]
for chap, q, c, w, e in named:
    C(B, chap, "discovery", "moderate", q, c, w, e)

scientists = [
 ("Atomic Structure", "The electron was discovered through cathode-ray experiments, including measurement of its charge-to-mass ratio, by",
  "J.J. Thomson", ["Ernest Rutherford", "James Chadwick", "R.A. Millikan"], "Thomson (1897) measured e/m of cathode-ray particles."),
 ("Atomic Structure", "The charge on the electron was determined by the oil-drop experiment of",
  "R.A. Millikan", ["J.J. Thomson", "Niels Bohr", "Eugen Goldstein"], "Millikan (1909) found e ≈ 1.6 × 10⁻¹⁹ C."),
 ("Atomic Structure", "The principle that no two electrons in an atom can have the same set of four quantum numbers was given by",
  "Wolfgang Pauli", ["Friedrich Hund", "Werner Heisenberg", "Erwin Schrödinger"], "Pauli exclusion principle (1926)."),
 ("Atomic Structure", "The uncertainty principle (Δx·Δp ≥ h/4π) was stated by",
  "Werner Heisenberg", ["Louis de Broglie", "Max Planck", "Erwin Schrödinger"], "Heisenberg (1927)."),
 ("Atomic Structure", "The quantum theory of radiation (energy emitted in packets E = hν) was proposed in 1900 by",
  "Max Planck", ["Albert Einstein", "Niels Bohr", "J.J. Thomson"], "Planck's quantum theory explained black-body radiation."),
 ("Classification of Elements and Periodicity", "The modern periodic law, based on atomic number, followed the X-ray work of",
  "Henry Moseley", ["Dmitri Mendeleev", "Lothar Meyer", "John Newlands"], "Moseley (1913) showed that √ν of X-rays varies linearly with atomic number."),
 ("Classification of Elements and Periodicity", "The 'law of octaves' for arranging elements was proposed by",
  "John Newlands", ["Johann Döbereiner", "Dmitri Mendeleev", "Henry Moseley"], "Newlands (1865) noticed every eighth element had similar properties."),
 ("Classification of Elements and Periodicity", "Groups of three elements with similar properties (triads) were noted by",
  "Johann Döbereiner", ["John Newlands", "Lothar Meyer", "Antoine Lavoisier"], "Döbereiner's triads, e.g. Li, Na, K (1829)."),
 ("Coordination Compounds", "The theory of primary and secondary valences of metals in complexes was proposed in 1898 by",
  "Alfred Werner", ["Linus Pauling", "G.N. Lewis", "Svante Arrhenius"], "Werner's coordination theory; Nobel Prize 1913."),
 ("Organic Chemistry Basic Principles", "Urea was first synthesised in the laboratory from ammonium cyanate (1828) by",
  "Friedrich Wöhler", ["Hermann Kolbe", "Marcellin Berthelot", "Jöns Berzelius"], "This disproved the vital-force theory."),
 ("Chemical Bonding and Molecular Structure", "The VSEPR theory was first put forward by",
  "Sidgwick and Powell", ["Heitler and London", "Lewis and Kossel", "Mulliken and Hund"], "Sidgwick and Powell (1940); improved by Nyholm and Gillespie (1957)."),
 ("Chemical Bonding and Molecular Structure", "The electronegativity scale most widely used in chemistry was developed by",
  "Linus Pauling", ["Robert Mulliken", "G.N. Lewis", "Fritz Haber"], "Pauling's scale assigns fluorine a value of about 4.0."),
 ("Some Basic Concepts of Chemistry", "The law of conservation of mass was put forward in 1789 by",
  "Antoine Lavoisier", ["Joseph Proust", "John Dalton", "Amedeo Avogadro"], "Lavoisier showed that mass is neither created nor destroyed in a reaction."),
 ("Some Basic Concepts of Chemistry", "The law of definite proportions was given by",
  "Joseph Proust", ["Antoine Lavoisier", "Gay-Lussac", "John Dalton"], "A compound always contains the same elements in the same proportion by mass."),
 ("Some Basic Concepts of Chemistry", "The hypothesis that equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules was proposed by",
  "Amedeo Avogadro", ["Joseph Gay-Lussac", "John Dalton", "Robert Boyle"], "Avogadro's hypothesis (1811)."),
 ("Redox Reactions and Electrochemistry", "The law stating that the limiting molar conductivity of an electrolyte is the sum of contributions of its ions was given by",
  "Friedrich Kohlrausch", ["Michael Faraday", "Walther Nernst", "Svante Arrhenius"], "Kohlrausch's law of independent migration of ions."),
]
for chap, q, c, w, e in scientists:
    C(B, chap, "discovery", "moderate", q, c, w, e)

concept = [
 ("Some Basic Concepts of Chemistry", "Molality is preferred over molarity for colligative-property work because molality",
  "does not change with temperature", ["is easier to measure", "depends on the volume of solution", "is always numerically larger"], "Molality uses mass of solvent; molarity uses volume, which changes with temperature."),
 ("Atomic Structure", "Which set of quantum numbers is NOT allowed?",
  "n = 2, l = 2, m_l = 0", ["n = 3, l = 2, m_l = −2", "n = 2, l = 1, m_l = 0", "n = 4, l = 0, m_l = 0"], "l can only go up to n − 1; for n = 2, l = 2 is impossible."),
 ("Equilibrium", "Adding a catalyst to a system at equilibrium",
  "makes it reach equilibrium faster but does not change the equilibrium composition", ["shifts equilibrium towards products", "increases the equilibrium constant", "shifts equilibrium towards reactants"],
  "A catalyst speeds up forward and backward reactions equally."),
 ("Equilibrium", "A Lewis acid is a substance that",
  "accepts an electron pair", ["donates a proton", "donates an electron pair", "accepts a proton"], "Examples: BF₃, AlCl₃, Fe³⁺."),
 ("Solutions", "Reverse osmosis is used for",
  "desalination of sea water", ["making ice cream", "separating gases", "measuring molar mass of polymers only"], "Pressure above the osmotic pressure forces water out through a semipermeable membrane, leaving salts behind."),
 ("Chemical Kinetics", "The order of a reaction",
  "is found experimentally and can be zero or fractional", ["is always equal to the molecularity", "is always a whole number", "can be found from the balanced equation alone"],
  "Order comes from the experimental rate law; molecularity applies to elementary steps and is always a whole number."),
 ("Hydrocarbons", "Which reagent is used to test for unsaturation in an alkene in the laboratory?",
  "Cold dilute alkaline KMnO₄ (Baeyer's reagent)", ["Tollens' reagent", "Fehling's solution", "Lucas reagent"], "The purple colour is discharged as the alkene is oxidised to a diol."),
 ("Haloalkanes and Haloarenes", "Optically active 2-bromobutane on SN1 hydrolysis gives mainly",
  "a (nearly) racemic mixture of butan-2-ol", ["pure (R)-butan-2-ol", "pure (S)-butan-2-ol", "butan-1-ol"], "The planar carbocation is attacked from both faces."),
 ("Alcohols, Phenols and Ethers", "Phenol reacts with bromine water to give",
  "a white precipitate of 2,4,6-tribromophenol", ["o-bromophenol only", "p-bromophenol only", "no reaction"], "–OH strongly activates the ring; in water all three ortho/para positions are brominated."),
 ("Aldehydes, Ketones and Carboxylic Acids", "Tollens' reagent can distinguish",
  "ethanal from propanone", ["propanone from butanone", "methanol from ethanol", "benzene from toluene"], "Aldehydes reduce Tollens' reagent to a silver mirror; ketones do not."),
 ("Amines", "Aniline reacts with bromine water at room temperature to give",
  "2,4,6-tribromoaniline", ["p-bromoaniline only", "m-bromoaniline", "no reaction"], "–NH₂ is strongly activating; to get the mono product the amino group is first acetylated."),
 ("Biomolecules", "Deficiency of vitamin C causes",
  "scurvy", ["rickets", "beriberi", "night blindness"], "Vitamin C (ascorbic acid) is needed for collagen formation; lack of it causes bleeding gums (scurvy)."),
 ("Biomolecules", "Which base is present in RNA but not in DNA?",
  "Uracil", ["Thymine", "Adenine", "Cytosine"], "RNA has A, G, C and U; DNA has A, G, C and T."),
 ("p-Block Elements", "Nitrogen is chemically inert at room temperature mainly because",
  "the N≡N triple bond has a very high bond enthalpy", ["nitrogen has no lone pairs", "nitrogen is a metal", "N₂ is ionic"], "N≡N bond enthalpy ≈ 941 kJ/mol."),
 ("d- and f-Block Elements", "Transition metals and their compounds are good catalysts mainly because they",
  "show variable oxidation states and can form complexes", ["are always diamagnetic", "have very low melting points", "have completely filled d-orbitals"], "E.g. V₂O₅ in the contact process, Fe in the Haber process."),
 ("Coordination Compounds", "Which ligand can show linkage isomerism?",
  "NO₂⁻", ["NH₃", "H₂O", "en"], "NO₂⁻ can bind through N (nitro) or through O (nitrito)."),
]
for chap, q, c, w, e in concept:
    C(B, chap, "concept", "moderate", q, c, w, e)

ncert_blanks = [
 ("Some Basic Concepts of Chemistry", "The number of significant figures in 2.0500 is ____.", ["5", "five"], "All non-zero digits, zeros between them and trailing zeros after a decimal point count: 2, 0, 5, 0, 0."),
 ("Atomic Structure", "The maximum number of electrons that can be accommodated in an f subshell is ____.", ["14", "fourteen"], "f subshell has 7 orbitals × 2 = 14."),
 ("Chemical Bonding and Molecular Structure", "The bond angle in a perfectly tetrahedral molecule such as CH₄ is about ____ degrees.", ["109.5", "109°28′", "109.47", "109.5°"], "Four bond pairs, no lone pairs: 109.5°."),
 ("Thermodynamics", "A function whose value depends only on the state of the system and not on the path is called a ____ function.", ["state"], "Examples: U, H, S, G."),
 ("Equilibrium", "The ionic product of water at 298 K is ____.", ["1 × 10^-14", "10^-14", "1×10^-14", "1.0 × 10^-14", "1e-14"], "Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ at 298 K."),
 ("Redox Reactions and Electrochemistry", "The standard electrode potential of the standard hydrogen electrode is taken as ____ volt.", ["0", "zero", "0.00"], "SHE is the reference with E° = 0 V at all temperatures."),
 ("Solutions", "A solution that obeys Raoult's law over the entire range of concentration is called an ____ solution.", ["ideal"], "For ideal solutions ΔmixH = 0 and ΔmixV = 0."),
 ("Chemical Kinetics", "The minimum extra energy that reacting molecules must have to form products is called ____ energy.", ["activation"], "Ea; given by the Arrhenius equation k = Ae^(−Ea/RT)."),
 ("Coordination Compounds", "Ligands such as ethane-1,2-diamine that bind through two donor atoms are called ____ ligands.", ["bidentate", "didentate"], "en has two N donor atoms."),
 ("Biomolecules", "The linkage that joins two monosaccharide units in a disaccharide is called a ____ linkage.", ["glycosidic"], "Formed between the anomeric –OH of one sugar and an –OH of another."),
 ("Amines", "Benzenediazonium chloride couples with phenol in alkaline medium to give an ____-coloured dye (p-hydroxyazobenzene).", ["orange"], "Azo coupling gives the orange p-hydroxyazobenzene."),
 ("p-Block Elements", "The noble gas that forms the largest number of compounds (e.g. its fluorides and oxides) is ____.", ["xenon", "Xe"], "XeF₂, XeF₄, XeF₆, XeO₃, XeOF₄ are well known."),
]
for chap, q, a, e in ncert_blanks:
    blank(B, S, chap, "ncert", "easy", q, a, e)

# Practical chemistry (NEET syllabus only)
practical = [
 ("A salt solution gives a deep blue colour when excess ammonia solution is added. The cation is",
  "Cu²⁺", ["Fe³⁺", "Zn²⁺", "Pb²⁺"], "Cu²⁺ forms the deep blue complex [Cu(NH₃)₄]²⁺."),
 ("A salt gives a red (rosy) precipitate with dimethylglyoxime in ammoniacal medium. The cation is",
  "Ni²⁺", ["Co²⁺", "Mn²⁺", "Ca²⁺"], "Nickel dimethylglyoximate is bright red."),
 ("With Nessler's reagent, a solution gives a brown precipitate. This confirms",
  "NH₄⁺", ["Cl⁻", "Fe³⁺", "Ba²⁺"], "Nessler's reagent (K₂HgI₄ in KOH) gives a brown precipitate with ammonium ions."),
 ("A solution of a salt gives a Prussian-blue colour with potassium ferrocyanide. The cation is",
  "Fe³⁺", ["Fe²⁺ only", "Cu²⁺", "Al³⁺"], "Fe³⁺ + [Fe(CN)₆]⁴⁻ → Fe₄[Fe(CN)₆]₃ (Prussian blue)."),
 ("A salt solution gives a white precipitate with BaCl₂ that does NOT dissolve in dilute HCl. The anion is",
  "SO₄²⁻", ["CO₃²⁻", "Cl⁻", "NO₃⁻"], "BaSO₄ is insoluble in acids; BaCO₃ would dissolve with effervescence."),
 ("A salt solution gives a yellow precipitate with KI that dissolves in hot water and reappears as golden spangles on cooling. The cation is",
  "Pb²⁺", ["Ag⁺", "Hg²⁺", "Cu²⁺"], "PbI₂ is yellow and recrystallises as shiny golden spangles ('golden rain')."),
 ("A white precipitate with AgNO₃ dissolves readily in ammonia solution. The anion is",
  "Cl⁻", ["I⁻", "Br⁻", "SO₄²⁻"], "AgCl dissolves in NH₃ forming [Ag(NH₃)₂]⁺; AgI is yellow and insoluble."),
 ("In the titration of oxalic acid with KMnO₄, no external indicator is needed because",
  "KMnO₄ acts as a self-indicator", ["the solution is colourless throughout", "oxalic acid is coloured", "phenolphthalein is formed"],
  "The first excess drop of MnO₄⁻ gives a permanent light pink colour at the end point."),
]
for q, c, w, e in practical:
    C("NEET", "Practical Chemistry", "ncert", "moderate", q, c, w, e)

# extra numericals
C("JEE", "Some Basic Concepts of Chemistry", "formula", "moderate",
  "A sulphuric acid solution is 49% H₂SO₄ by mass and has density 1.5 g/mL. Its molarity is (H₂SO₄ = 98 g/mol)",
  "7.5 M", ["5.0 M", "10 M", "0.75 M"], "1 L = 1500 g solution containing 735 g H₂SO₄ = 7.5 mol → 7.5 M.")
C("JEE", "Equilibrium", "formula", "moderate",
  "The pH of a 0.005 M Ba(OH)₂ solution at 25 °C is",
  "12", ["11.7", "2", "2.3"], "Ba(OH)₂ gives 2OH⁻: [OH⁻] = 0.01 M, pOH = 2, pH = 12.")
C("JEE", "Chemical Kinetics", "formula", "moderate",
  "A first-order reaction has a half-life of 20 min. The time for 75% completion is",
  "40 min", ["30 min", "60 min", "15 min"], "75% completion leaves 1/4 = two half-lives.")
lam_b = 1 / (1.097e7 * 5 / 36)
C("JEE", "Atomic Structure", "formula", "moderate",
  "The wavelength of the first line of the Balmer series of hydrogen is about (R = 1.097 × 10⁷ m⁻¹)",
  f"{lam_b*1e9:.0f} nm", [f"{1/(1.097e7*3/4)*1e9:.0f} nm", f"{1/(1.097e7/4)*1e9:.0f} nm", f"{1/(1.097e7*3/16)*1e9:.0f} nm"],
  f"1/λ = R(1/2² − 1/3²) = 5R/36 → λ ≈ {lam_b*1e9:.0f} nm (red H-α line).")
C("JEE", "Redox Reactions and Electrochemistry", "formula", "moderate",
  "The number of moles of electrons needed to reduce one mole of Cr₂O₇²⁻ to Cr³⁺ is",
  "6", ["3", "2", "5"], "Each Cr goes from +6 to +3 (3 e⁻); two Cr atoms need 6 e⁻.")
C("NEET", "Some Basic Concepts of Chemistry", "formula", "moderate",
  "The mass of a single water molecule is about (Nₐ = 6.022 × 10²³)",
  "2.99 × 10⁻²³ g", ["1.8 × 10⁻²² g", "18 g", "3.0 × 10⁻²⁶ g"], "18 g/6.022 × 10²³ ≈ 2.99 × 10⁻²³ g.")
