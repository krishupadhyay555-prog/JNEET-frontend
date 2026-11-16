from lib import F, X, T, sig, fx, _check_and_write
import math

k = 1.38e-23; R = 8.314; NA = 6.022e23
E1 = 1.5 * k * 300                                     # avg KE per molecule at 300 K
v2 = math.sqrt(3 * R * 300 / 0.032)                    # rms O2 at 300 K
T3 = 300 * 32 / 2                                      # O2 rms = H2 rms at 300 K
r4 = math.sqrt(4)                                      # rms ratio when T ×4
n5 = 1.013e5 * 1e-6 / (k * 273)                        # molecules in 1 cm³ at STP
lam6 = k * 300 / (math.sqrt(2) * math.pi * (3e-10) ** 2 * 1.013e5) * 1e9   # nm
P7 = (1 / 3) * 1.29 * 485 ** 2                         # P = ρv²/3 for air with v_rms 485
U8 = 2.5 * R * 300                                      # internal energy of 1 mol diatomic

DOC = {
"slug": "kinetic-theory", "subject": "Physics",
"chapters": {"NEET": "Kinetic Theory", "JEE": "Kinetic Theory"},
"title": "Kinetic Theory", "readMinutes": 11,
"summary": [
"A gas is a huge number of tiny molecules in random motion. Their collisions with the walls produce pressure: P = ⅓ρv²_rms.",
"Temperature is a measure of the average kinetic energy of the molecules: average translational KE per molecule = (3/2)kT, independent of the gas.",
"Equipartition: every degree of freedom gets ½kT per molecule. Counting degrees of freedom gives Cv, Cp and γ of monoatomic, diatomic and polyatomic gases.",
"Mean free path — the average distance between collisions — is λ = kT/(√2 π d² P): it grows as the gas gets hotter or thinner.",
],
"formulas": [
F("Ideal gas equation", "PV = nRT = N k T;  R = 8.314 J mol⁻¹ K⁻¹,  k = R/Nₐ = 1.38 × 10⁻²³ J/K", "Any problem connecting P, V, T and amount of gas.", "Use kelvin, and SI units for P and V (1 L = 10⁻³ m³)."),
F("Pressure of an ideal gas", "P = ⅓ (N m/V) v²_rms = ⅓ ρ v²_rms", "Linking pressure to molecular speed.", None, tag="PYQ favourite"),
F("Kinetic energy and temperature", "average translational KE per molecule = (3/2) k T;   per mole = (3/2) R T", "Meaning of temperature.", "It depends only on T — every gas at the same T has the same average translational KE."),
F("RMS speed", "v_rms = √(3RT/M) = √(3kT/m)", "Speed of molecules.", "M in kg/mol (0.032 for O₂), not g/mol.", tag="PYQ favourite"),
F("Average and most probable speeds", "v_avg = √(8RT/πM);   v_mp = √(2RT/M);   v_rms > v_avg > v_mp", "Comparing speed definitions."),
F("Degrees of freedom", "monoatomic f = 3;  diatomic f = 5 (rigid) or 7 (with vibration);  non-linear polyatomic f = 6 (rigid)", "Counting energy modes."),
F("Law of equipartition", "energy per degree of freedom = ½ k T per molecule;  U = (f/2) n R T", "Internal energy of a gas."),
F("Specific heats from f", "Cv = (f/2) R;   Cp = (f/2 + 1) R;   γ = 1 + 2/f", "Finding γ and molar heat capacities."),
F("Mean free path", "λ = k T / (√2 π d² P) = 1/(√2 n π d²)", "Average distance between collisions.", "λ ∝ T/P — doubling pressure halves λ."),
F("Avogadro's number", "Nₐ = 6.022 × 10²³ mol⁻¹;  molar volume at STP ≈ 22.4 L", "Counting molecules."),
F("Gas laws (special cases)", "Boyle: PV = const (T fixed);  Charles: V/T = const (P fixed);  Gay-Lussac: P/T = const (V fixed);  Dalton: P = P₁ + P₂ + …", "Quick ratio problems."),
],
"examples": [
X("KE of a molecule at room temperature", "Average translational KE of a gas molecule at 300 K?",
  f"E = (3/2) × 1.38 × 10⁻²³ × 300 ≈ {sig(E1,3)} J.", [(sig(E1,3), "6.21 × 10⁻²¹")]),
X("RMS speed of oxygen", "v_rms of O₂ molecules at 300 K (M = 0.032 kg/mol)?",
  f"v = √(3 × 8.314 × 300/0.032) ≈ {fx(v2,0)} m/s.", [(fx(v2,0), "484")]),
X("Matching rms speeds", "At what temperature will O₂ have the same rms speed as H₂ at 300 K?",
  f"T/M must be equal: T = 300 × 32/2 = {fx(T3,0)} K.", [(fx(T3,0), "4800")]),
X("Temperature made 4 times", "If the kelvin temperature of a gas is made four times, the rms speed becomes?",
  f"v ∝ √T → √4 = {fx(r4,0)} times.", [(fx(r4,0), "2")]),
X("Molecules in 1 cm³ of air", "Number of molecules in 1 cm³ of gas at STP (P = 1.013 × 10⁵ Pa, T = 273 K)?",
  f"N = PV/kT = 1.013 × 10⁵ × 10⁻⁶/(1.38 × 10⁻²³ × 273) ≈ {sig(n5,3)} (Loschmidt number).", [(sig(n5,3), "2.69 × 10¹⁹")]),
X("Mean free path in air", "Molecular diameter 3 × 10⁻¹⁰ m, T = 300 K, P = 1.013 × 10⁵ Pa. Mean free path?",
  f"λ = kT/(√2 π d² P) ≈ {fx(lam6,0)} nm — about 300 times the size of a molecule.", [(fx(lam6,0), "102")]),
X("Pressure from molecular speed", "Air has density 1.29 kg/m³ and v_rms = 485 m/s. Pressure?",
  f"P = ⅓ρv² = ⅓ × 1.29 × 485² ≈ {sig(P7,3)} Pa ≈ 1 atm.", [(sig(P7,3), "1.01 × 10⁵")]),
X("Internal energy of a diatomic gas", "Internal energy of 1 mol of a rigid diatomic gas at 300 K?",
  f"U = (5/2)RT = 2.5 × 8.314 × 300 ≈ {fx(U8,0)} J.", [(fx(U8,0), "6236")]),
],
"topics": [
T("Assumptions of kinetic theory", "Molecules are point-like, move randomly, collide elastically with each other and the walls, exert no force except during collisions, and the time of a collision is negligible. Real gases follow this at low pressure and high temperature."),
T("Molecular nature of matter", "Matter is made of atoms and molecules (Dalton's atomic theory). Avogadro's hypothesis: equal volumes of all gases at the same temperature and pressure contain equal numbers of molecules."),
T("Meaning of temperature", "Temperature is proportional to the average translational KE of molecules. At absolute zero this motion (classically) stops."),
T("Degrees of freedom in detail", "A monoatomic gas (He, Ar) has 3 translational. A diatomic gas (O₂, N₂) adds 2 rotational = 5; at high temperature vibration adds 2 more = 7. A non-linear molecule (H₂O, CH₄) has 3 translational + 3 rotational = 6."),
T("Specific heat of solids", "By equipartition each atom of a solid has 6 quadratic terms (3 KE + 3 PE), giving molar heat capacity ≈ 3R (Dulong–Petit law), true at high temperature."),
T("Mean free path and diffusion", "Molecules travel fast (~500 m/s) but collide so often that a smell takes a long time to spread across a room. λ increases at low pressure — the basis of vacuum technology."),
T("Real vs ideal gas", "Real gases deviate because molecules have finite size and attract each other — most at high pressure and low temperature."),
],
"ratta": [
"PV = nRT = NkT;  k = 1.38 × 10⁻²³ J/K.",
"P = ⅓ρv²_rms;  KE per molecule = (3/2)kT.",
"v_rms = √(3RT/M) > v_avg > v_mp.",
"f: 3 (mono), 5 (di), 6 (poly);  ½kT per f.",
"Cv = fR/2, Cp = Cv + R, γ = 1 + 2/f.",
"λ = kT/(√2πd²P).",
"Nₐ = 6.022 × 10²³;  22.4 L at STP.",
],
}

SYLLABUS = [
("Equation of state of a perfect gas, work done on compressing a gas", ["PV = nRT"]),
("Kinetic theory of gases — assumptions, concept of pressure", ["assumptions", "pressure"]),
("Kinetic interpretation of temperature; rms speed of gas molecules", ["temperature", "rms"]),
("Degrees of freedom, law of equipartition of energy, specific heats of gases", ["degrees of freedom", "equipartition", "specific heat"]),
("Mean free path, Avogadro's number", ["mean free path", "Avogadro"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Gas bahut saare chhote molecules hain jo random motion mein hain. Deewaron se unki takkar pressure banati hai: P = ⅓ρv²_rms.",
"Temperature molecules ki average kinetic energy ka maap hai: har molecule ki average translational KE = (3/2)kT, gas koi bhi ho.",
"Equipartition: har degree of freedom ko har molecule mein ½kT milta hai. Degrees of freedom gin kar monoatomic, diatomic, polyatomic gases ke Cv, Cp aur γ milte hain.",
"Mean free path — do takkaron ke beech ki average doori — λ = kT/(√2 π d² P) hai: gas garam ya patli ho to badhta hai.",
],
when=[
("P, V, T aur gas ki maatra jodne wala koi bhi sawal.", "Kelvin lo, aur P, V ke SI units (1 L = 10⁻³ m³) — bhoolo mat."),
("Pressure ko molecular speed se jodna.", None),
("Temperature ka matlab.", "Ye sirf T par depend — same T par har gas ki average translational KE same, mass se alag nahi."),
("Molecules ki speed.", "M kg/mol mein (O₂ ke liye 0.032), g/mol nahi."),
("Speed ki definitions compare karna.", None),
("Energy modes ginna.", None),
("Gas ki internal energy.", None),
("γ aur molar heat capacities nikaalna.", None),
("Takkaron ke beech average doori.", "λ ∝ T/P — pressure double karo to λ aadha, ulta mat lo."),
("Molecules ginna.", None),
("Quick ratio problems.", None),
],
examples=[
("Room temperature par molecule ki KE", "300 K par gas molecule ki average translational KE?",
 "E = (3/2) × 1.38 × 10⁻²³ × 300 ≈ ⟨0⟩ J."),
("Oxygen ki RMS speed", "300 K par O₂ ka v_rms (M = 0.032 kg/mol)?",
 "v = √(3 × 8.314 × 300/0.032) ≈ ⟨0⟩ m/s."),
("RMS speeds barabar karna", "Kis temperature par O₂ ki rms speed 300 K wali H₂ jitni hogi?",
 "T/M barabar hona chahiye: T = 300 × 32/2 = ⟨0⟩ K."),
("Temperature 4 guna", "Gas ka kelvin temperature 4 guna karein to rms speed?",
 "v ∝ √T → √4 = ⟨0⟩ guna."),
("1 cm³ hawa mein molecules", "STP (P = 1.013 × 10⁵ Pa, T = 273 K) par 1 cm³ gas mein molecules?",
 "N = PV/kT = 1.013 × 10⁵ × 10⁻⁶/(1.38 × 10⁻²³ × 273) ≈ ⟨0⟩ (Loschmidt number)."),
("Hawa mein mean free path", "Molecular diameter 3 × 10⁻¹⁰ m, T = 300 K, P = 1.013 × 10⁵ Pa. Mean free path?",
 "λ = kT/(√2 π d² P) ≈ ⟨0⟩ nm — molecule ke size ka lagbhag 300 guna."),
("Molecular speed se pressure", "Hawa ki density 1.29 kg/m³, v_rms = 485 m/s. Pressure?",
 "P = ⅓ρv² = ⅓ × 1.29 × 485² ≈ ⟨0⟩ Pa ≈ 1 atm."),
("Diatomic gas ki internal energy", "300 K par 1 mol rigid diatomic gas ki internal energy?",
 "U = (5/2)RT = 2.5 × 8.314 × 300 ≈ ⟨0⟩ J."),
],
topics=[
("Assumptions of kinetic theory", "Molecules point jaise, random motion, aapas mein aur deewaron se elastic takkar, takkar ke alawa koi force nahi, aur takkar ka time negligible. Real gases low pressure aur high temperature par isse follow karti hain."),
("Molecular nature of matter", "Matter atoms aur molecules se bana hai (Dalton's atomic theory). Avogadro's hypothesis: same temperature aur pressure par sabhi gases ke barabar volume mein barabar molecules."),
("Meaning of temperature", "Temperature molecules ki average translational KE ke proportional hai. Absolute zero par ye motion (classically) ruk jaata hai."),
("Degrees of freedom in detail", "Monoatomic gas (He, Ar): 3 translational. Diatomic (O₂, N₂): 2 rotational aur = 5; high temperature par vibration 2 aur = 7. Non-linear molecule (H₂O, CH₄): 3 translational + 3 rotational = 6."),
("Specific heat of solids", "Equipartition se solid ke har atom ke 6 quadratic terms (3 KE + 3 PE), molar heat capacity ≈ 3R (Dulong–Petit law), high temperature par sahi."),
("Mean free path and diffusion", "Molecules tez (~500 m/s) chalte hain par itni baar takraate hain ki khushboo kamre mein failne mein time lagta hai. Low pressure par λ badhta hai — vacuum technology ka base."),
("Real vs ideal gas", "Real gases deviate karti hain kyunki molecules ka size hota hai aur woh ek-doosre ko kheenchte hain — sabse zyada high pressure aur low temperature par."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
