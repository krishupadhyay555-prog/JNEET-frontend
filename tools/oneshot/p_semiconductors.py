from lib import F, X, T, sig, fx, _check_and_write

ni = 1.5e16; ND = 1e22
n1 = ND; p1 = ni ** 2 / ND                     # doped Si
Iz2 = (12 - 6) / 500 * 1000 - 6 / 2000 * 1000  # mA
Il2 = 6 / 2000 * 1000
f3h, f3f = 50, 100                             # rectifier output ripple frequency
I4 = (5 - 0.7) / 1000 * 1000                   # LED series circuit, mA
lam5 = 1240 / 1.9                              # LED with Eg = 1.9 eV (nm)

DOC = {
"slug": "semiconductor-electronics", "subject": "Physics",
"chapters": {"NEET": "Semiconductor Electronics", "JEE": "Semiconductor Electronics"},
"title": "Semiconductor Electronics", "readMinutes": 12,
"summary": [
"Energy bands decide whether a solid conducts: conductors have overlapping bands, insulators a large gap (> 3 eV), and semiconductors a small gap (Si 1.1 eV, Ge 0.7 eV) that heat or light can cross.",
"Pure (intrinsic) semiconductors have equal electrons and holes. Doping with pentavalent atoms gives n-type (electrons majority); trivalent atoms give p-type (holes majority).",
"A p-n junction forms a depletion layer and a barrier potential. Forward bias lowers the barrier and current flows; reverse bias raises it and only a tiny current flows — so a diode rectifies AC.",
"Special diodes: LED (light from recombination), photodiode (light makes current in reverse bias), solar cell (light makes emf, no bias), Zener diode (constant voltage in reverse breakdown). Logic gates (OR, AND, NOT, NAND, NOR) process binary signals.",
],
"formulas": [
F("Band gaps", "conductor: overlap;  semiconductor: Eg ~ 1 eV (Si 1.1, Ge 0.7);  insulator: Eg > 3 eV (diamond ~5.5)", "Classifying solids."),
F("Intrinsic semiconductor", "nₑ = n_h = nᵢ", "Pure Si or Ge."),
F("Mass-action law", "nₑ n_h = nᵢ²", "Minority-carrier density in a doped semiconductor.", "Doping raises one carrier and LOWERS the other — the product stays nᵢ².", tag="PYQ favourite"),
F("n-type and p-type", "n-type: pentavalent donors (P, As, Sb), nₑ ≫ n_h;  p-type: trivalent acceptors (B, Al, In, Ga), n_h ≫ nₑ", "Identifying doping.", "Both n-type and p-type crystals are electrically neutral overall."),
F("Conductivity", "σ = e(nₑμₑ + n_hμ_h)", "How carriers and mobilities set conductivity."),
F("Diode in forward and reverse bias", "forward: current rises sharply after the knee (≈0.7 V Si, 0.3 V Ge);  reverse: tiny saturation current (µA) until breakdown", "Reading I–V characteristics."),
F("Half-wave and full-wave rectifier", "half-wave output frequency = f;  full-wave output frequency = 2f", "Ripple frequency of rectified AC.", "A full-wave rectifier on 50 Hz mains gives a 100 Hz ripple.", tag="PYQ favourite"),
F("Zener regulator", "I_series = (V_in − V_Z)/R_s;  I_Z = I_series − I_load", "Zener current in a regulator circuit.", "The load voltage stays at V_Z only while I_Z > 0 (Zener in breakdown)."),
F("LED and photon energy", "E_photon ≈ E_g;  λ (nm) ≈ 1240/E_g (eV)", "Colour of an LED, cut-off wavelength of a photodiode."),
F("Logic gates", "OR: Y = A + B;  AND: Y = A·B;  NOT: Y = Ā;  NAND: Y = (A·B)‾;  NOR: Y = (A + B)‾", "Truth-table questions.", "NAND and NOR are universal gates — any gate can be built from them."),
],
"examples": [
X("Minority carriers", "Si has nᵢ = 1.5 × 10¹⁶ m⁻³. It is doped with 10²² donors/m³. Electron and hole densities?",
  f"nₑ ≈ N_D = {sig(n1,1)} m⁻³; n_h = nᵢ²/nₑ = 2.25 × 10³²/10²² ≈ {sig(p1,3)} m⁻³.", [(sig(n1,1), "1 × 10²²"), (sig(p1,3), "2.25 × 10¹⁰")]),
X("Zener regulator", "A 6 V Zener with a 500 Ω series resistor is fed from 12 V; the load is 2 kΩ. Load and Zener currents?",
  f"I_series = (12 − 6)/500 = 12 mA; I_load = 6/2000 = {fx(Il2)} mA; I_Z = 12 − 3 = {fx(Iz2)} mA.", [(fx(Il2), "3"), (fx(Iz2), "9")]),
X("Ripple frequency", "50 Hz AC is rectified. Output ripple frequency for half-wave and full-wave rectifiers?",
  f"Half-wave: {f3h} Hz; full-wave: {f3f} Hz.", [(str(f3h), "50"), (str(f3f), "100")]),
X("Current through a diode", "A forward-biased silicon diode (drop 0.7 V) in series with 1 kΩ across 5 V. Current?",
  f"I = (5 − 0.7)/1000 A = {fx(I4,1)} mA.", [(fx(I4,1), "4.3")]),
X("Colour of an LED", "An LED has band gap 1.9 eV. Wavelength of its light?",
  f"λ ≈ 1240/1.9 ≈ {fx(lam5,0)} nm — red light.", [(fx(lam5,0), "653")]),
X("Truth table of a combination", "Output of a NOR gate whose two inputs are both A?",
  "Y = (A + A)‾ = Ā — a NOR gate with joined inputs works as a NOT gate. (Similarly a NAND with joined inputs is a NOT.)", []),
],
"topics": [
T("Energy bands", "In a solid, atomic levels spread into bands. The valence band holds bonding electrons; the conduction band holds free electrons. At 0 K a semiconductor is an insulator; at room temperature some electrons jump the gap, leaving holes behind."),
T("Holes", "A hole is a missing electron in the valence band that behaves like a positive charge. Holes move when neighbouring electrons fill them; hole mobility is lower than electron mobility."),
T("Effect of temperature", "Resistance of a semiconductor decreases with temperature (more carriers) — a negative temperature coefficient, opposite to metals."),
T("Formation of a p-n junction", "Electrons diffuse from n to p and holes from p to n; they recombine near the junction, leaving fixed ions — the depletion layer with an electric field and barrier potential (~0.7 V for Si). Diffusion current and drift current balance at equilibrium."),
T("Biasing", "Forward bias (p to +) narrows the depletion layer; reverse bias widens it. In reverse bias the small current is due to minority carriers and is almost independent of voltage until breakdown."),
T("Rectifiers and filters", "Half-wave uses one diode and passes one half-cycle. Full-wave uses two diodes with a centre-tap transformer (or four in a bridge) and passes both halves. A capacitor across the load smooths the pulsating DC."),
T("Optoelectronic devices", "LED: forward-biased, light from recombination, colour set by band gap (GaAsP etc.); efficient and long-lasting. Photodiode: reverse-biased, current rises with light intensity — used in detectors. Solar cell: no external bias; light creates electron-hole pairs and an emf (open-circuit voltage) — Si and GaAs are common."),
T("Zener diode", "A heavily doped diode designed to work in reverse breakdown, where the voltage stays almost constant over a wide current range — used as a voltage regulator."),
],
"ratta": [
"Si 1.1 eV, Ge 0.7 eV;  insulator > 3 eV.",
"nₑn_h = nᵢ²;  doped crystals are neutral.",
"n-type: P, As, Sb;  p-type: B, Al, In, Ga.",
"Knee voltage: Si ≈ 0.7 V, Ge ≈ 0.3 V.",
"Half-wave ripple f, full-wave 2f.",
"I_Z = (V_in − V_Z)/R − I_load.",
"NAND, NOR = universal gates.",
],
}

SYLLABUS = [
("Energy bands in conductors, semiconductors and insulators", ["band", "conductor", "insulator"]),
("Semiconductor diode: I-V characteristics in forward and reverse bias, diode as a rectifier", ["forward", "reverse", "rectifier"]),
("Special purpose p-n junction diodes: LED, photodiode, solar cell and Zener diode; Zener diode as a voltage regulator", ["LED", "photodiode", "solar cell", "Zener", "regulator"]),
("Logic gates (OR, AND, NOT, NAND and NOR)", ["OR", "AND", "NOT", "NAND", "NOR"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Energy bands batate hain solid conduct karega ya nahi: conductor mein bands overlap, insulator mein bada gap (> 3 eV), semiconductor mein chhota gap (Si 1.1 eV, Ge 0.7 eV) jo heat ya light paar kara sakti hai.",
"Pure (intrinsic) semiconductor mein electrons aur holes barabar. Pentavalent atoms ki doping se n-type (electrons majority); trivalent se p-type (holes majority).",
"p-n junction depletion layer aur barrier potential banata hai. Forward bias barrier ghataata hai aur current behta hai; reverse bias barrier badhata hai aur bahut chhota current — isliye diode AC ko rectify karta hai.",
"Special diodes: LED (recombination se light), photodiode (reverse bias mein light se current), solar cell (light se emf, bias nahi), Zener diode (reverse breakdown mein constant voltage). Logic gates (OR, AND, NOT, NAND, NOR) binary signals process karte hain.",
],
when=[
("Solids classify karna (conductor, insulator, semiconductor).", None),
("Pure Si ya Ge.", None),
("Doped semiconductor mein minority-carrier density.", "Doping ek carrier badhaati hai aur doosra GHATAATI hai — product nᵢ² hi rehta hai, bhoolo mat."),
("Doping pehchaanna.", "n-type aur p-type dono crystals overall electrically neutral hain — charged mat samjho."),
("Carriers aur mobilities se conductivity.", None),
("I–V characteristics padhna.", None),
("Rectified AC ki ripple frequency.", "50 Hz mains par full-wave rectifier 100 Hz ripple deta hai, 50 nahi."),
("Regulator circuit mein Zener current.", "Load voltage V_Z par tabhi rehta hai jab I_Z > 0 (Zener breakdown mein) — check karo."),
("LED ka rang, photodiode ki cut-off wavelength.", None),
("Truth-table ke sawal.", "NAND aur NOR universal gates hain — inse koi bhi gate ban sakta hai, yaad rakho."),
],
examples=[
("Minority carriers", "Si ka nᵢ = 1.5 × 10¹⁶ m⁻³. 10²² donors/m³ se dope kiya. Electron aur hole densities?",
 "nₑ ≈ N_D = ⟨0⟩ m⁻³; n_h = nᵢ²/nₑ = 2.25 × 10³²/10²² ≈ ⟨1⟩ m⁻³."),
("Zener regulator", "6 V Zener, 500 Ω series resistor, 12 V supply; load 2 kΩ. Load aur Zener currents?",
 "I_series = (12 − 6)/500 = 12 mA; I_load = 6/2000 = ⟨0⟩ mA; I_Z = 12 − 3 = ⟨1⟩ mA."),
("Ripple frequency", "50 Hz AC rectify kiya. Half-wave aur full-wave ki output ripple frequency?",
 "Half-wave: ⟨0⟩ Hz; full-wave: ⟨1⟩ Hz."),
("Diode se current", "Forward-biased silicon diode (drop 0.7 V), 1 kΩ ke saath 5 V par. Current?",
 "I = (5 − 0.7)/1000 A = ⟨0⟩ mA."),
("LED ka rang", "LED ka band gap 1.9 eV. Light ki wavelength?",
 "λ ≈ 1240/1.9 ≈ ⟨0⟩ nm — red light."),
("Combination ki truth table", "NOR gate jiske dono inputs A hon, uska output?",
 "Y = (A + A)‾ = Ā — inputs jod diye NOR gate NOT gate ki tarah kaam karta hai. (Waise hi jude inputs wala NAND bhi NOT hai.)"),
],
topics=[
("Energy bands", "Solid mein atomic levels fail kar bands bante hain. Valence band mein bonding electrons; conduction band mein free electrons. 0 K par semiconductor insulator hai; room temperature par kuch electrons gap paar karke holes chhod dete hain."),
("Holes", "Hole valence band mein ek gayab electron hai jo positive charge ki tarah behave karta hai. Paas ke electrons use bharte hain to hole chalta hai; hole mobility electron se kam."),
("Effect of temperature", "Semiconductor ka resistance temperature badhne par ghatta hai (zyada carriers) — negative temperature coefficient, metals ke ulta."),
("Formation of a p-n junction", "Electrons n se p aur holes p se n diffuse karte hain; junction ke paas recombine hokar fixed ions chhodte hain — depletion layer jismein electric field aur barrier potential (Si ke liye ~0.7 V). Equilibrium par diffusion aur drift current balance."),
("Biasing", "Forward bias (p ko +) depletion layer patli karta hai; reverse bias choudi. Reverse bias ka chhota current minority carriers se aur breakdown tak lagbhag voltage se independent."),
("Rectifiers and filters", "Half-wave ek diode, ek half-cycle paas karta hai. Full-wave do diodes centre-tap transformer ke saath (ya bridge mein chaar), dono halves paas. Load ke across capacitor pulsating DC ko smooth karta hai."),
("Optoelectronic devices", "LED: forward-biased, recombination se light, rang band gap se (GaAsP wagera); efficient aur lambi chalne wali. Photodiode: reverse-biased, light intensity ke saath current badhta hai — detectors mein. Solar cell: external bias nahi; light electron-hole pairs aur emf banati hai — Si aur GaAs common."),
("Zener diode", "Heavily doped diode jo reverse breakdown mein kaam ke liye bana hai, jahan bade current range mein voltage lagbhag constant rehta hai — voltage regulator ki tarah use."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
