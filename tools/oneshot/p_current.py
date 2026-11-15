from lib import F, X, T, sig, fx, build

vd1 = 1.5 / (8.5e28 * 1.6e-19 * 1e-6)
R2 = 10 * 2 ** 2
R3 = 10 * (1 + 0.004 * 50)
Rp4 = 1 / (1 / 2 + 1 / 3 + 1 / 6); Rt4 = Rp4 + 4; I4 = 10 / Rt4
I5 = 12 / (5.5 + 0.5); V5 = 12 - I5 * 0.5
P6 = 12 ** 2 / (4 * 2)
I7 = 4 * 1.5 / (4 + 4 * 0.5)
V8 = 3.0; IL8 = V8 / 2; I18 = (6 - V8) / 2; I28 = (3 - V8) / 1
X9 = 30 * 40 / 60
R10 = 220 ** 2 / 100; P10 = 110 ** 2 / R10
R11 = 10 * 10 ** 2

DOC = {
"slug": "current-electricity", "subject": "Physics", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Current Electricity", "JEE": "Current Electricity"},
"title": "Current Electricity", "readMinutes": 20,
"summary": [
"Current = charge flow ki rate, I = dq/dt. Conductor mein electrons random ghoomte hain; field lagne par unhe ek chhoti average drift velocity milti hai (~10⁻⁴ m/s) — I = neAv_d. Bulb turant isliye jalta hai kyunki field poori wire mein lagbhag light ki speed se failta hai.",
"Ohm's law V = IR (constant temperature par). Resistance material (ρ), lambai aur area par depend karta hai: R = ρl/A. Metals ka resistance temperature ke saath badhta hai, semiconductors ka ghatta hai.",
"Real cell ka emf E aur internal resistance r: terminal voltage V = E − Ir (discharge). Series mein R jodte hain, parallel mein 1/R. Power P = VI = I²R = V²/R; max power tab jab load R = r.",
"Kirchhoff ke do niyam (junction: ΣI = 0 — charge conservation; loop: ΣV = 0 — energy conservation) se koi bhi circuit hal hota hai. Wheatstone bridge balance P/Q = R/S; meter bridge isi se unknown resistance naapta hai.",
],
"formulas": [
F("Electric current", "I = dq/dt;   average I = Δq/Δt;   1 A = 1 C/s", "Current ki definition.", "Current scalar hai — direction hote hue bhi vector ki tarah nahi judta."),
F("Drift velocity and mobility", "I = neAv_d;   v_d = eEτ/m;   mobility μ = v_d/E = eτ/m", "Electrons ki average speed.", "v_d bahut chhoti (~mm/s) hai; electrons ki thermal speed ~10⁵ m/s alag cheez hai.", None, "PYQ favourite"),
F("Current density and microscopic Ohm's law", "J = I/A = nev_d;   J = σE;   σ = 1/ρ = ne²τ/m", "Field aur current ka local relation.", "J vector hai, I scalar."),
F("Ohm's law and resistance", "V = IR;   R = ρl/A;   unit ohm (Ω)", "Conductor ka resistance.", "Ohm's law sabhi devices par nahi lagta — diode, thermistor non-ohmic hain."),
F("Stretching a wire", "Volume same: l → nl ⇒ R → n²R;   radius → r/n ⇒ R → n⁴R", "Wire kheenchne ke sawal.", "Lambai double karne par area aadha bhi hota hai — isliye 4 guna, 2 guna nahi.", None, "PYQ favourite"),
F("Temperature dependence", "ρ_T = ρ₀[1 + α(T − T₀)];   R_T = R₀[1 + α(T − T₀)]", "Garam hone par resistance.", "Metals ka α positive, semiconductors ka negative; alloys (manganin, constantan) ka bahut kam."),
F("Colour code", "B B R O Y G B V G W = 0–9 (Black Brown Red Orange Yellow Green Blue Violet Grey White);  pehle do band digits, teesra multiplier (10ⁿ), chautha tolerance (gold 5%, silver 10%, none 20%)", "Carbon resistor padhna.", None, None, "Ratta"),
F("Series and parallel resistors", "Series: R = R₁ + R₂ + … (same I);   parallel: 1/R = 1/R₁ + 1/R₂ + … (same V)", "Network simplify karna.", "Parallel ka equivalent sabse chhote resistor se bhi chhota."),
F("EMF, internal resistance, terminal voltage", "I = E/(R + r);   discharge V = E − Ir;   charging V = E + Ir;   open circuit V = E", "Real cell.", "Terminal voltage emf se zyada sirf charging ke waqt."),
F("Cells in series and parallel", "n series: E_eq = nE, r_eq = nr;   m parallel (identical): E_eq = E, r_eq = r/m;   mixed: I = nE/(R + nr/m)", "Battery combination.", "Ulta joda hua cell (reverse) emf ghatata hai, r phir bhi judta hai."),
F("Electric power and energy", "P = VI = I²R = V²/R;   energy = Pt;   1 kWh = 3.6 × 10⁶ J", "Bulb, heater, bill.", "Series mein I same ⇒ zyada R zyada jalta; parallel mein V same ⇒ kam R zyada jalta."),
F("Maximum power transfer", "R = r par P_max = E²/4r (efficiency 50%)", "Load se max power.", "Max power par efficiency sirf 50% hoti hai."),
F("Kirchhoff's rules", "Junction: ΣI_in = ΣI_out (charge conservation);   loop: ΣΔV = 0 (energy conservation)", "Complex circuits.", "Loop mein battery − se + jaate waqt +E, resistor mein current ki direction mein −IR."),
F("Wheatstone bridge", "Balanced: P/Q = R/S ⇒ galvanometer mein current zero", "Bridge circuit.", "Balance par galvanometer wali branch hata do — circuit simple ho jaata hai.", None, "PYQ favourite"),
F("Meter bridge", "X/R = l/(100 − l)   (l cm, unknown X ki taraf)", "Unknown resistance naapna.", "Balance point beech mein ho to error kam (end correction)."),
],
"examples": [
X("Drift velocity", "1 mm² area ki copper wire mein 1.5 A, n = 8.5 × 10²⁸ m⁻³. v_d?",
  f"v_d = I/(neA) = 1.5/(8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × 10⁻⁶) ≈ {sig(vd1)} m/s — bahut dheemi.", [(sig(vd1), "1.1 × 10⁻⁴")]),
X("Wire kheenchi", "10 Ω wire ko double lambai tak kheencha (volume same). Naya R?",
  f"R → n²R = 4 × 10 = {fx(R2)} Ω.", [(fx(R2), "40")]),
X("Temperature se R", "20 °C par 10 Ω, α = 0.004 /°C. 70 °C par R?",
  f"R = 10[1 + 0.004 × 50] = {fx(R3)} Ω.", [(fx(R3), "12")]),
X("Network", "2, 3, 6 Ω parallel mein, phir 4 Ω series mein; 10 V battery. Total R aur current?",
  f"1/R = 1/2 + 1/3 + 1/6 = 1 ⇒ {fx(Rp4)} Ω. Total = {fx(Rt4)} Ω. I = 10/5 = {fx(I4)} A.", [(fx(Rp4), "1"), (fx(Rt4), "5"), (fx(I4), "2")]),
X("Real cell", "E = 12 V, r = 0.5 Ω, R = 5.5 Ω. Current aur terminal voltage?",
  f"I = 12/6 = {fx(I5)} A. V = 12 − 2 × 0.5 = {fx(V5)} V.", [(fx(I5), "2"), (fx(V5), "11")]),
X("Max power", "E = 12 V, r = 2 Ω. Load se max power?",
  f"R = r = 2 Ω par P = E²/4r = 144/8 = {fx(P6)} W.", [(fx(P6), "18")]),
X("Cells in series", "4 cells (1.5 V, 0.5 Ω each) series mein, R = 4 Ω. Current?",
  f"I = nE/(R + nr) = 6/(4 + 2) = {fx(I7)} A.", [(fx(I7), "1")]),
X("Kirchhoff: do battery", "6 V (2 Ω branch) aur 3 V (1 Ω branch) parallel mein, dono 2 Ω load ko feed karte hain. Load current aur branch currents?",
  f"Top node voltage V: (6 − V)/2 + (3 − V)/1 = V/2 ⇒ V = {fx(V8)} V. Load = {fx(IL8)} A; 6 V branch = {fx(I18)} A; 3 V branch = {fx(I28)} A (3 V cell na charge ho raha na discharge).",
  [(fx(V8), "3"), (fx(IL8), "1.5"), (fx(I18), "1.5"), (fx(I28), "0")]),
X("Meter bridge", "Right gap mein 30 Ω, balance left end se 40 cm par. Unknown X?",
  f"X/30 = 40/60 ⇒ X = {fx(X9)} Ω.", [(fx(X9), "20")]),
X("Bulb aadhe voltage par", "100 W, 220 V bulb ko 110 V par chalaya. R aur power?",
  f"R = V²/P = {fx(R10)} Ω. P = 110²/484 = {fx(P10)} W (chautha hissa).", [(fx(R10), "484"), (fx(P10), "25")]),
X("Colour code", "Brown, black, red, gold bands. Resistance?",
  f"1, 0, × 10² ⇒ {fx(R11)} Ω = 1 kΩ, ± 5%.", [(fx(R11), "1000")]),
],
"topics": [
T("Electric current aur drift", "Wire mein free electrons ~10⁵ m/s se random ghoomte hain, net flow zero. Field lagne par unhe drift milta hai. Relaxation time τ do collisions ke beech ka average time; temperature badhne par τ ghatta hai, isliye metal ka ρ badhta hai."),
T("Ohmic aur non-ohmic", "Ohmic: V–I graph seedhi line origin se (metals, constant T par). Non-ohmic: diode (ek direction), thermistor, GaAs (negative resistance region), electrolytes."),
T("Resistivity ka comparison", "Metals ~10⁻⁸ Ω·m, semiconductors beech mein, insulators ~10¹⁴ Ω·m se zyada. Nichrome heater element (high ρ, high melting point); manganin/constantan standard resistors (α bahut kam); copper connecting wires (kam ρ)."),
T("Cells: emf aur terminal voltage", "Emf cell ki electric energy per unit charge dene ki capacity hai, potential difference nahi. Current lene par internal resistance mein voltage drop hota hai. Lambi chalne wali battery ka r badh jaata hai."),
T("Kirchhoff se hal karne ka tarika", "Har branch ka current maan lo (direction galat ho to answer negative aayega). Junction rule independent junctions par, loop rule independent loops par. Equations solve karo. Symmetric circuits mein same potential wale points jodkar ya todkar simplify karo."),
T("Wheatstone bridge aur meter bridge", "Bridge balance par galvanometer ke dono end same potential par. Meter bridge mein 1 m uniform wire (manganin/constantan) par jockey khiska kar balance dhoondhte hain. Sensitivity zyada jab chaaron resistance lagbhag barabar."),
T("Heating effect", "Joule heating H = I²Rt. Fuse wire ka melting point kam aur resistance zyada — zyada current par pighal kar circuit tod deta hai. Electric power transmission high voltage par taaki I²R loss kam ho."),
],
"ratta": [
"I = neAv_d;  v_d ~10⁻⁴ m/s;  μ = v_d/E.",
"R = ρl/A;  stretch n times ⇒ n²R.",
"R_T = R₀(1 + αΔT);  metal α > 0, semiconductor α < 0.",
"Colour: BB ROY Great Britain Very Good Wife (0–9); gold 5%, silver 10%.",
"V = E − Ir;  P_max = E²/4r at R = r.",
"Series cells nE, nr;  parallel E, r/m.",
"Wheatstone P/Q = R/S;  meter bridge X/R = l/(100 − l).",
"1 kWh = 3.6 × 10⁶ J.",
],
}

DOC_EN = {
"slug": "current-electricity", "subject": "Physics", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Current Electricity", "JEE": "Current Electricity"},
"title": "Current Electricity", "readMinutes": 20,
"summary": [
"Current is the rate of flow of charge, I = dq/dt. Electrons in a conductor move randomly; an applied field gives them a small average drift velocity (~10⁻⁴ m/s) — I = neAv_d. A bulb lights at once because the field spreads through the wire at nearly the speed of light.",
"Ohm's law V = IR (at constant temperature). Resistance depends on material (ρ), length and area: R = ρl/A. Resistance of metals rises with temperature; that of semiconductors falls.",
"A real cell has emf E and internal resistance r: terminal voltage V = E − Ir (discharging). Resistances add in series and their reciprocals add in parallel. Power P = VI = I²R = V²/R; maximum power is delivered when the load R = r.",
"Kirchhoff's two rules (junction: ΣI = 0 — charge conservation; loop: ΣV = 0 — energy conservation) solve any circuit. A Wheatstone bridge balances when P/Q = R/S; the meter bridge uses this to measure an unknown resistance.",
],
"formulas": [
F("Electric current", "I = dq/dt;   average I = Δq/Δt;   1 A = 1 C/s", "Definition of current.", "Current is a scalar — although it has a direction, it doesn't add like a vector."),
F("Drift velocity and mobility", "I = neAv_d;   v_d = eEτ/m;   mobility μ = v_d/E = eτ/m", "Average speed of electrons.", "v_d is tiny (~mm/s); the thermal speed of electrons (~10⁵ m/s) is a different thing.", None, "PYQ favourite"),
F("Current density and microscopic Ohm's law", "J = I/A = nev_d;   J = σE;   σ = 1/ρ = ne²τ/m", "Local relation between field and current.", "J is a vector, I a scalar."),
F("Ohm's law and resistance", "V = IR;   R = ρl/A;   unit ohm (Ω)", "Resistance of a conductor (ρ = resistivity).", "Ohm's law doesn't hold for all devices — diodes and thermistors are non-ohmic."),
F("Stretching a wire", "Same volume: l → nl ⇒ R → n²R;   radius → r/n ⇒ R → n⁴R", "Stretched-wire problems.", "Doubling the length also halves the area — so 4 times, not 2 times.", None, "PYQ favourite"),
F("Temperature dependence", "ρ_T = ρ₀[1 + α(T − T₀)];   R_T = R₀[1 + α(T − T₀)]", "Resistance on heating.", "α is positive for metals, negative for semiconductors, very small for alloys (manganin, constantan)."),
F("Colour code", "B B R O Y G B V G W = 0–9 (Black Brown Red Orange Yellow Green Blue Violet Grey White);  first two bands digits, third multiplier (10ⁿ), fourth tolerance (gold 5%, silver 10%, none 20%)", "Reading a carbon resistor.", None, None, "Ratta"),
F("Series and parallel resistors", "Series: R = R₁ + R₂ + … (same I);   parallel: 1/R = 1/R₁ + 1/R₂ + … (same V)", "Simplifying networks.", "The parallel equivalent is smaller than the smallest resistor."),
F("EMF, internal resistance, terminal voltage", "I = E/(R + r);   discharging V = E − Ir;   charging V = E + Ir;   open circuit V = E", "Real cell.", "Terminal voltage exceeds the emf only while charging."),
F("Cells in series and parallel", "n in series: E_eq = nE, r_eq = nr;   m in parallel (identical): E_eq = E, r_eq = r/m;   mixed: I = nE/(R + nr/m)", "Combining cells.", "A cell connected the wrong way reduces the emf, but its r still adds."),
F("Electric power and energy", "P = VI = I²R = V²/R;   energy = Pt;   1 kWh = 3.6 × 10⁶ J", "Bulbs, heaters, electricity bills.", "In series (same I) the larger R glows more; in parallel (same V) the smaller R glows more."),
F("Maximum power transfer", "At R = r: P_max = E²/4r (efficiency 50%)", "Maximum power to a load.", "At maximum power the efficiency is only 50%."),
F("Kirchhoff's rules", "Junction: ΣI_in = ΣI_out (charge conservation);   loop: ΣΔV = 0 (energy conservation)", "Complex circuits.", "In a loop, going through a battery from − to + counts +E; through a resistor along the current counts −IR."),
F("Wheatstone bridge", "Balanced: P/Q = R/S ⇒ no current in the galvanometer", "Bridge circuits.", "At balance remove the galvanometer branch — the circuit becomes simple.", None, "PYQ favourite"),
F("Meter bridge", "X/R = l/(100 − l)   (l in cm, on the side of unknown X)", "Measuring an unknown resistance.", "Errors are smallest with the balance point near the middle (end correction)."),
],
"examples": [
X("Drift velocity", "A copper wire of area 1 mm² carries 1.5 A, n = 8.5 × 10²⁸ m⁻³. v_d?",
  f"v_d = I/(neA) = 1.5/(8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × 10⁻⁶) ≈ {sig(vd1)} m/s — very slow.", [(sig(vd1), "1.1 × 10⁻⁴")]),
X("Stretched wire", "A 10 Ω wire is stretched to double its length (same volume). New R?",
  f"R → n²R = 4 × 10 = {fx(R2)} Ω.", [(fx(R2), "40")]),
X("R with temperature", "10 Ω at 20 °C, α = 0.004 /°C. R at 70 °C?",
  f"R = 10[1 + 0.004 × 50] = {fx(R3)} Ω.", [(fx(R3), "12")]),
X("Network", "2, 3 and 6 Ω in parallel, then 4 Ω in series; 10 V battery. Total R and current?",
  f"1/R = 1/2 + 1/3 + 1/6 = 1 ⇒ {fx(Rp4)} Ω. Total = {fx(Rt4)} Ω. I = 10/5 = {fx(I4)} A.", [(fx(Rp4), "1"), (fx(Rt4), "5"), (fx(I4), "2")]),
X("Real cell", "E = 12 V, r = 0.5 Ω, R = 5.5 Ω. Current and terminal voltage?",
  f"I = 12/6 = {fx(I5)} A. V = 12 − 2 × 0.5 = {fx(V5)} V.", [(fx(I5), "2"), (fx(V5), "11")]),
X("Maximum power", "E = 12 V, r = 2 Ω. Maximum power to the load?",
  f"At R = r = 2 Ω, P = E²/4r = 144/8 = {fx(P6)} W.", [(fx(P6), "18")]),
X("Cells in series", "4 cells (1.5 V, 0.5 Ω each) in series with R = 4 Ω. Current?",
  f"I = nE/(R + nr) = 6/(4 + 2) = {fx(I7)} A.", [(fx(I7), "1")]),
X("Kirchhoff: two batteries", "A 6 V cell (branch resistance 2 Ω) and a 3 V cell (branch 1 Ω) in parallel both feed a 2 Ω load. Load and branch currents?",
  f"Top-node voltage V: (6 − V)/2 + (3 − V)/1 = V/2 ⇒ V = {fx(V8)} V. Load = {fx(IL8)} A; 6 V branch = {fx(I18)} A; 3 V branch = {fx(I28)} A (the 3 V cell is neither charging nor discharging).",
  [(fx(V8), "3"), (fx(IL8), "1.5"), (fx(I18), "1.5"), (fx(I28), "0")]),
X("Meter bridge", "30 Ω in the right gap; balance at 40 cm from the left end. Unknown X?",
  f"X/30 = 40/60 ⇒ X = {fx(X9)} Ω.", [(fx(X9), "20")]),
X("Bulb at half voltage", "A 100 W, 220 V bulb runs on 110 V. R and power?",
  f"R = V²/P = {fx(R10)} Ω. P = 110²/484 = {fx(P10)} W (one quarter).", [(fx(R10), "484"), (fx(P10), "25")]),
X("Colour code", "Bands brown, black, red, gold. Resistance?",
  f"1, 0, × 10² ⇒ {fx(R11)} Ω = 1 kΩ, ± 5%.", [(fx(R11), "1000")]),
],
"topics": [
T("Electric current and drift", "Free electrons in a wire move randomly at ~10⁵ m/s with zero net flow. An applied field gives them a drift. The relaxation time τ is the average time between collisions; it falls as temperature rises, so ρ of a metal increases."),
T("Ohmic and non-ohmic devices", "Ohmic: V–I graph a straight line through the origin (metals at constant T). Non-ohmic: diodes (one direction), thermistors, GaAs (negative resistance region), electrolytes."),
T("Comparing resistivities", "Metals ~10⁻⁸ Ω·m, semiconductors in between, insulators above ~10¹⁴ Ω·m. Nichrome for heater elements (high ρ, high melting point); manganin/constantan for standard resistors (very small α); copper for connecting wires (low ρ)."),
T("Cells: emf and terminal voltage", "Emf is the energy a cell gives per unit charge, not a potential difference across a resistor. Drawing current causes a voltage drop across the internal resistance. An old battery has a larger r."),
T("Solving with Kirchhoff's rules", "Assume a current in each branch (a wrong direction just gives a negative answer). Apply the junction rule at independent junctions and the loop rule around independent loops, then solve. In symmetric circuits join or split points at equal potential to simplify."),
T("Wheatstone bridge and meter bridge", "At balance both ends of the galvanometer are at the same potential. In a meter bridge a jockey slides along a 1 m uniform wire (manganin/constantan) to find balance. Sensitivity is highest when all four resistances are nearly equal."),
T("Heating effect", "Joule heating H = I²Rt. A fuse wire has a low melting point and high resistance — it melts at large current and breaks the circuit. Power is transmitted at high voltage so that I²R loss is small."),
],
"ratta": [
"I = neAv_d;  v_d ~10⁻⁴ m/s;  μ = v_d/E.",
"R = ρl/A;  stretched n times ⇒ n²R.",
"R_T = R₀(1 + αΔT);  metal α > 0, semiconductor α < 0.",
"Colour: BB ROY Great Britain Very Good Wife (0–9); gold 5%, silver 10%.",
"V = E − Ir;  P_max = E²/4r at R = r.",
"Series cells nE, nr;  parallel E, r/m.",
"Wheatstone P/Q = R/S;  meter bridge X/R = l/(100 − l).",
"1 kWh = 3.6 × 10⁶ J.",
],
}

SYLLABUS = [
("Electric current, drift velocity, mobility and their relation with electric current", ["drift velocity", "mobility"]),
("Ohm's law, electrical resistance, V-I characteristics, electrical energy and power, resistivity and conductivity", ["Ohm's law", "resistivity", "power", "non-ohmic"]),
("Series and parallel combinations of resistors; temperature dependence of resistance", ["Series and parallel", "Temperature dependence"]),
("Internal resistance, potential difference and emf of a cell, combination of cells in series and parallel", ["internal resistance", "emf", "Cells in series and parallel"]),
("Kirchhoff's laws and their applications; Wheatstone bridge; metre bridge", ["Kirchhoff", "Wheatstone", "Meter bridge"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
