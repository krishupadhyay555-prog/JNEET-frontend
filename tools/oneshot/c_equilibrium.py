from lib import F, X, T, sig, fx, build
import math

kp1 = 0.06 / (0.0821 * 500) ** 2
x2 = 2 / 3
h3 = math.sqrt(1.8e-5 * 0.1); pH3 = -math.log10(h3); a3 = h3 / 0.1 * 100
pH5 = 4.74 + math.log10(0.2 / 0.1)
s6 = math.sqrt(1.8e-10); s6b = 1.8e-10 / 0.1
ksp7 = 4 * (2e-4) ** 3
pH8 = 7 + 4.74 / 2 + 0.5 * math.log10(0.1)
x9 = (1e-8 + math.sqrt(1e-16 + 4e-14)) / 2; pH9 = -math.log10(x9)

DOC = {
"slug": "equilibrium", "subject": "Chemistry",
"chapters": {"NEET": "Equilibrium", "JEE": "Equilibrium"},
"title": "Equilibrium", "readMinutes": 24,
"summary": [
"Equilibrium dynamic hota hai: forward aur backward reaction dono chal rahi hoti hain, bas barabar speed se — isliye concentrations constant dikhte hain. Band system mein hi equilibrium banta hai.",
"Har reaction ka ek equilibrium constant hai (Kc, Kp) jo sirf temperature par depend karta hai. K bada ⇒ products zyada; Q ko K se compare karke pata chalta hai reaction kis taraf chalegi.",
"Le Chatelier: equilibrium ko chhedo (concentration, pressure, temperature badlo) to system us badlaav ko kam karne ki taraf khisakta hai. Catalyst sirf jaldi pahunchaata hai, equilibrium nahi badalta.",
"Ionic equilibrium: strong electrolytes poore ionise, weak thode. Weak acid/base ki ionisation Ka/Kb se, paani ki Kw se. pH = −log[H⁺].",
"Teen bade application: buffer (pH ko stable rakhna — Henderson equation), salt hydrolysis (salt ka pH), aur solubility product Ksp (kam ghulne wale salt kitna ghulenge, kab precipitate banega)."
],
"formulas": [
F("Law of chemical equilibrium", "aA + bB ⇌ cC + dD:   Kc = [C]^c[D]^d / ([A]^a[B]^b)", "Kisi bhi reversible reaction ka K likhna.", "Pure solids aur pure liquids (aur dilute solution mein solvent) K mein nahi aate."),
F("Kp and Kc", "Kp = Kc (RT)^{Δn_g}   (R = 0.0821 L·atm/(K·mol), p atm mein)", "Gaseous equilibrium mein badalna.", "Δn_g = gaseous products ke moles − reactants ke moles; Δn_g = 0 ⇒ Kp = Kc.", None, "PYQ favourite"),
F("Manipulating K", "Ulti reaction: K' = 1/K.   Reaction × n: K' = Kⁿ.   Do reactions jodo: K = K₁ × K₂", "Di hui reactions se nayi ka K."),
F("Reaction quotient", "Q (same expression, kisi bhi pal ke concentrations):  Q < K → forward,  Q > K → backward,  Q = K → equilibrium", "Reaction kis taraf chalegi."),
F("Degree of dissociation (example PCl₅)", "PCl₅ ⇌ PCl₃ + Cl₂:   Kp = α² P / (1 − α²)", "Dissociation wale gas sawal; α = ditna hissa toota.", "Total moles = 1 + α (1 mol PCl₅ se shuru)."),
F("ΔG and K", "ΔG° = −RT ln K;   ΔG = ΔG° + RT ln Q;   equilibrium par ΔG = 0", "K ka thermodynamic matlab.", "ΔG° < 0 ⇒ K > 1."),
F("Temperature dependence (van 't Hoff)", "log(K₂/K₁) = (ΔH°/2.303R) (1/T₁ − 1/T₂)", "Temperature badalne par K.", "Endothermic: T badhe → K badhe. Exothermic: T badhe → K ghate."),
F("Le Chatelier — quick table", "Reactant badhao → forward.  Pressure badhao → kam gas moles wali side.  T badhao → endothermic side.  Catalyst → koi shift nahi.  Inert gas (V const) → koi shift nahi;  (p const) → zyada moles wali side", "Shift predict karna.", "Sirf temperature K ko badalta hai; baaki sab sirf position badalte hain.", None, "PYQ favourite"),
F("Henry's law", "p = K_H x   (gas ka partial pressure ∝ solution mein uska mole fraction)", "Gas ka liquid mein ghulna (soda, scuba diving).", "Temperature badhe to gas ki solubility ghatti hai."),
F("Ionic product of water", "Kw = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (298 K);   pH + pOH = 14;   pH = −log[H⁺]", "Har aqueous pH sawal.", "Kw temperature ke saath badhta hai — garam paani ka neutral pH 7 se kam hota hai (phir bhi neutral)."),
F("Weak acid (Ostwald dilution law)", "α = √(Ka/C);   [H⁺] = √(Ka C);   pH = ½(pKa − log C)", "Weak acid ka pH aur α.", "Tabhi valid jab α < 5% ho (1 − α ≈ 1).", None, "PYQ favourite"),
F("Weak base", "[OH⁻] = √(Kb C);   pOH = ½(pKb − log C)", "NH₃ jaise weak base ka pH."),
F("Conjugate pair", "Ka × Kb = Kw;   pKa + pKb = 14", "Acid ke conjugate base ka Kb (ya ulta).", "Strong acid ka conjugate base bahut weak hota hai."),
F("Polyprotic acids", "H₂A: Ka₁ ≫ Ka₂;   pH lagbhag sirf Ka₁ se;  [A²⁻] ≈ Ka₂", "H₂S, H₂CO₃, H₃PO₄ jaise acids.", "Doosra proton nikalna mushkil (negative ion se)."),
F("Common ion effect", "Weak acid HA + uska salt (A⁻, conc C'):  α ≈ Ka / C'", "Common ion ionisation ko dabata hai.", "Common ion se weak electrolyte ka α ghatta hai."),
F("Salt hydrolysis", "SA + SB: pH = 7.   WA + SB (CH₃COONa): pH = 7 + ½pKa + ½log C.   SA + WB (NH₄Cl): pH = 7 − ½pKb − ½log C.   WA + WB: pH = 7 + ½(pKa − pKb)  (C se independent)", "Salt ke solution ka pH.", "Kh = Kw/Ka (ya Kw/Kb); h = √(Kh/C).", None, "PYQ favourite"),
F("Buffer (Henderson–Hasselbalch)", "Acidic: pH = pKa + log([salt]/[acid]).   Basic: pOH = pKb + log([salt]/[base])", "Buffer ka pH.", "[salt] = [acid] ⇒ pH = pKa (best buffer capacity).", None, "PYQ favourite"),
F("Solubility product", "AₓB_y: Ksp = (xs)^x (ys)^y.   AB: s²,  AB₂/A₂B: 4s³,  AB₃/A₃B: 27s⁴,  A₂B₃: 108s⁵", "Solubility s (mol/L) aur Ksp ka relation.", "Alag type ke salts ki solubility sirf Ksp dekh kar compare mat karo — s nikaal ke karo."),
F("Precipitation and common ion", "Ionic product Q_sp > Ksp ⇒ precipitate.   AB in C M common ion: s ≈ Ksp / C", "Precipitate banega ya nahi; common ion mein solubility.", "Mixing ke baad naye (dilute) concentrations lo."),
],
"examples": [
X("Kc se Kp", "N₂ + 3H₂ ⇌ 2NH₃, 500 K par Kc = 6.0 × 10⁻² (mol/L)⁻². Kp?",
  f"Δn_g = 2 − 4 = −2. Kp = Kc(RT)⁻² = 0.06/(0.0821 × 500)² ≈ {sig(kp1)} atm⁻².",
  [(sig(kp1), "3.6 × 10⁻⁵")]),
X("Equilibrium concentration", "A + B ⇌ C + D, Kc = 4. Shuru mein [A] = [B] = 1 M. Equilibrium par [C]?",
  f"x²/(1 − x)² = 4 ⇒ x/(1 − x) = 2 ⇒ x = 2/3 ≈ {fx(x2)} M.",
  [(fx(x2), "0.67")]),
X("Weak acid ka pH", "0.1 M CH₃COOH, Ka = 1.8 × 10⁻⁵. [H⁺], pH aur % ionisation?",
  f"[H⁺] = √(1.8 × 10⁻⁵ × 0.1) = {sig(h3,3)} M. pH = {fx(pH3)}. α = {fx(a3)}% (< 5%, approximation theek).",
  [(sig(h3,3), "1.34 × 10⁻³"), (fx(pH3), "2.87"), (fx(a3), "1.34")]),
X("Strong base ka pH", "0.01 M NaOH ka pH?",
  "[OH⁻] = 10⁻² ⇒ pOH = 2 ⇒ pH = 14 − 2 = 12.", []),
X("Buffer ka pH", "0.1 M CH₃COOH + 0.2 M CH₃COONa, pKa = 4.74. pH?",
  f"pH = 4.74 + log(0.2/0.1) = 4.74 + 0.30 = {fx(pH5)}.",
  [(fx(pH5), "5.04")]),
X("Ksp aur common ion", "AgCl ka Ksp = 1.8 × 10⁻¹⁰. Paani mein solubility? 0.1 M NaCl mein?",
  f"Paani: s = √Ksp = {sig(s6,3)} M. 0.1 M Cl⁻ mein: s = Ksp/0.1 = {sig(s6b)} M — ~7500 guna kam (common ion effect).",
  [(sig(s6,3), "1.34 × 10⁻⁵"), (sig(s6b), "1.8 × 10⁻⁹")]),
X("Solubility se Ksp (AB₂)", "CaF₂ ki solubility 2 × 10⁻⁴ mol/L. Ksp?",
  f"CaF₂ → Ca²⁺ (s) + 2F⁻ (2s). Ksp = s(2s)² = 4s³ = 4 × (2 × 10⁻⁴)³ = {sig(ksp7)}.",
  [(sig(ksp7), "3.2 × 10⁻¹¹")]),
X("Salt ka pH", "0.1 M CH₃COONa (pKa of CH₃COOH = 4.74). pH?",
  f"WA + SB salt: pH = 7 + ½(4.74) + ½ log 0.1 = 7 + 2.37 − 0.5 = {fx(pH8)} (basic).",
  [(fx(pH8), "8.87")]),
X("Bahut dilute strong acid", "10⁻⁸ M HCl ka pH? (8 nahi!)",
  f"Paani ka H⁺ bhi gino: [H⁺] = x, [OH⁻] = x − 10⁻⁸, x(x − 10⁻⁸) = 10⁻¹⁴ ⇒ x ≈ {sig(x9,3)} M ⇒ pH ≈ {fx(pH9)} — thoda acidic, 7 se kam.",
  [(sig(x9,3), "1.05 × 10⁻⁷"), (fx(pH9), "6.98")]),
],
"topics": [
T("Dynamic equilibrium", "Band bottle mein paani: evaporation aur condensation dono chalte rehte hain, rate barabar ⇒ vapour pressure constant. Chemical equilibrium bhi aisa hi — dono taraf se pahuncha ja sakta hai."),
T("Physical equilibria", "Solid ⇌ liquid (barf-paani, 0°C, 1 atm par), liquid ⇌ vapour (band bartan mein vapour pressure), solid ⇌ vapour (camphor, iodine — sublimation), gas ⇌ solution (soda mein CO₂ — Henry's law). Har ek ki pehchaan: koi ek property constant ho jaati hai, aur ye fixed T par hi hota hai."),
T("K ka matlab", "K > 10³: lagbhag poori forward. K < 10⁻³: bahut kam forward. Beech mein: dono kaafi. K sirf temperature se badalta hai, concentration ya catalyst se nahi. K ki units Δn par depend karti hain."),
T("Le Chatelier ke classic examples", "Haber process (N₂ + 3H₂ ⇌ 2NH₃, exothermic): high pressure aur NH₃ hataate rehna forward le jaate hain; low T se yield zyada lekin speed kam — isliye ~700 K aur Fe catalyst. N₂O₄ ⇌ 2NO₂ (endothermic): garam karo to bhoora rang badhta hai."),
T("Strong vs weak electrolytes", "Strong (NaCl, HCl, NaOH): paani mein lagbhag 100% ions. Weak (CH₃COOH, NH₃): thoda sa ionise, baaki molecule. Dilution par weak electrolyte ka α badhta hai (Ostwald)."),
T("Acid–base ke teen concepts", "Arrhenius: paani mein H⁺ de = acid, OH⁻ de = base (sirf aqueous). Brønsted–Lowry: proton donor = acid, acceptor = base; conjugate pairs (HCl/Cl⁻, NH₄⁺/NH₃). Lewis: electron pair acceptor = acid (BF₃, AlCl₃, H⁺, metal ions), donor = base (NH₃, H₂O, OH⁻)."),
T("Acid strength ka trend", "Ka bada (pKa chhota) = strong acid. Same group mein neeche jaate bond kamzor ⇒ HF < HCl < HBr < HI. Same period mein electronegativity badhe ⇒ CH₄ < NH₃ < H₂O < HF acidity."),
T("pH scale", "pH 7 neutral (25°C), < 7 acidic, > 7 basic. pH 1 ka farak = [H⁺] mein 10 guna. Do strong acids mix: moles jodo, total volume se divide."),
T("Buffer kaise kaam karta hai", "Acidic buffer (CH₃COOH + CH₃COONa): daala gaya H⁺ CH₃COO⁻ se jud jaata hai, OH⁻ CH₃COOH se neutralise. Basic buffer: NH₃ + NH₄Cl. Blood ka buffer H₂CO₃/HCO₃⁻ (pH ≈ 7.4)."),
T("Salt hydrolysis ka logic", "Weak acid ka anion (CH₃COO⁻) paani se H⁺ leke OH⁻ chhodta hai ⇒ basic. Weak base ka cation (NH₄⁺) H⁺ deta hai ⇒ acidic. Strong ke ions hydrolyse nahi hote (NaCl neutral)."),
T("Ksp ke uses", "Precipitate banega jab Q_sp > Ksp. Selective precipitation: jiska Ksp chhota pehle girega. Common ion solubility ghataata hai; jo ions complex bana lein (AgCl + NH₃) wo solubility badha dete hain."),
],
"ratta": [
"Kp = Kc(RT)^{Δn_g};  ulti reaction 1/K;  ×n → Kⁿ;  jodo → multiply.",
"Q < K forward, Q > K backward.",
"Sirf T se K badalta hai; catalyst K nahi badalta.",
"Kw = 10⁻¹⁴ (25°C);  pH + pOH = 14;  pKa + pKb = 14.",
"Weak acid: [H⁺] = √(KaC),  α = √(Ka/C).",
"Buffer: pH = pKa + log(salt/acid).",
"Hydrolysis: WA+SB pH = 7 + ½pKa + ½logC;  SA+WB pH = 7 − ½pKb − ½logC;  WA+WB pH = 7 + ½(pKa − pKb).",
"Ksp: AB s²,  AB₂ 4s³,  AB₃ 27s⁴,  A₂B₃ 108s⁵.",
"10⁻⁸ M HCl ka pH ≈ 6.98 (paani ka H⁺ jodo).",
"Lewis acid = e⁻ pair acceptor (BF₃, AlCl₃);  Lewis base = donor (NH₃).",
],
}

SYLLABUS = [
("Meaning of equilibrium, dynamic equilibrium", ["dynamic"]),
("Physical processes: solid-liquid, liquid-gas, gas-gas, solid-gas equilibria", ["Solid ⇌ liquid", "liquid ⇌ vapour", "solid ⇌ vapour", "gas ⇌ solution"]),
("Henry's law", ["Henry's law"]),
("Law of chemical equilibrium, Kp and Kc and significance", ["Law of chemical equilibrium", "Kp", "Kc", "K ka matlab"]),
("Significance of ΔG and ΔG° in equilibrium", ["ΔG° = −RT ln K"]),
("Factors affecting equilibrium; catalyst; Le Chatelier", ["Le Chatelier", "Catalyst", "pressure", "temperature"]),
("Weak and strong electrolytes, ionisation", ["Strong vs weak electrolytes"]),
("Arrhenius, Brønsted–Lowry and Lewis concepts", ["Arrhenius", "Brønsted", "Lewis"]),
("Acid-base equilibria incl. multistage ionisation and ionisation constants", ["Polyprotic", "Ka", "Kb"]),
("Ionisation of water, pH scale", ["Kw", "pH scale"]),
("Common ion effect", ["Common ion effect"]),
("Hydrolysis of salts and pH", ["hydrolysis"]),
("Solubility of sparingly soluble salts, solubility product", ["Solubility product", "Ksp"]),
("Buffer solutions", ["Buffer"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
