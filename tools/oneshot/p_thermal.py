from lib import F, X, T, sig, fx, _check_and_write

F1 = 98.6; C1 = (F1 - 32) * 5 / 9                     # body temperature °F → °C
dL2 = 10 * 1.2e-5 * 50 * 1000                          # rail gap mm
Q3 = 0.5 * 4200 * 80                                   # heat 0.5 kg water 20→100
# 4 mixture: 0.2 kg water at 80 + 0.3 kg water at 20
T4 = (0.2 * 80 + 0.3 * 20) / 0.5
# 5 ice + steam: 100 g ice at 0 + 20 g steam at 100 (cal)
heat_steam = 20 * 540 + 20 * 100; melt = 100 * 80; T5 = (heat_steam - melt) / 120
# 6 conduction rate through a copper rod
H6 = 400 * 1e-4 * (100 - 0) / 0.5
# 7 two slabs in series, equal thickness, K1 = 2K2
T7 = (2 * 100 + 1 * 0) / 3
# 8 Stefan: radius ×2, T ÷ 2
P8 = 2 ** 2 * (0.5) ** 4
# 9 Wien
lam9 = 2.9e-3 / 6000 * 1e9

DOC = {
"slug": "thermal-properties-of-matter", "subject": "Physics",
"chapters": {"NEET": "Thermal Properties of Matter", "JEE": "Thermal Properties of Matter"},
"title": "Thermal Properties of Matter", "readMinutes": 13,
"summary": [
"Temperature tells us which way heat will flow; heat is energy in transit because of a temperature difference. Celsius, Fahrenheit and Kelvin scales are linked linearly.",
"Most bodies expand on heating: linear (α), area (β = 2α) and volume (γ = 3α) expansion. Water is special — it contracts from 0 °C to 4 °C, so it is densest at 4 °C.",
"Heat needed to change temperature is Q = mcΔT; to change state at constant temperature it is Q = mL. Calorimetry is just 'heat lost = heat gained'.",
"Heat moves by conduction (H = KAΔT/L), convection (bulk motion of fluid) and radiation (Stefan–Boltzmann, Wien's law). Newton's law of cooling says the rate of cooling ∝ temperature difference with surroundings.",
],
"formulas": [
F("Temperature scales", "(C − 0)/100 = (F − 32)/180 = (K − 273.15)/100", "Converting between °C, °F and K.", "A change of 1 °C = 1 K = 1.8 °F — don't add 32 to a temperature DIFFERENCE."),
F("Linear expansion", "ΔL = L α ΔT", "Rails, bridges, metal rods, pendulum clocks.", None, tag="PYQ favourite"),
F("Area and volume expansion", "ΔA = A β ΔT,  ΔV = V γ ΔT;   β = 2α,  γ = 3α (isotropic solids)", "Holes in plates, liquids in containers.", "A hole in a plate EXPANDS on heating, like the material around it."),
F("Thermal stress", "stress = Y α ΔT  (rod fixed at both ends)", "Force on clamps when a rod is heated.", None),
F("Specific heat capacity", "Q = m c ΔT;  water c = 4200 J kg⁻¹ K⁻¹ = 1 cal g⁻¹ °C⁻¹", "Heating without change of state."),
F("Heat capacity and molar heat capacity", "C = Q/ΔT = mc;  molar C = Q/(n ΔT)", "Comparing bodies, gases."),
F("Latent heat", "Q = m L;  ice L_f = 80 cal/g = 3.36 × 10⁵ J/kg;  steam L_v = 540 cal/g = 2.26 × 10⁶ J/kg", "Melting, boiling, condensation.", "Temperature stays constant during a change of state — don't use mcΔT there."),
F("Principle of calorimetry", "Heat lost by hot bodies = heat gained by cold bodies", "Mixing problems.", "With ice, first check whether ALL the ice can melt before assuming a final temperature above 0 °C.", tag="PYQ favourite"),
F("Conduction (Fourier's law)", "H = dQ/dt = K A (T₁ − T₂)/L;  thermal resistance R = L/(KA)", "Heat flow through rods and walls.", None),
F("Slabs in series and parallel", "series: R = R₁ + R₂ (same H);  parallel: 1/R = 1/R₁ + 1/R₂ (same ΔT)", "Composite walls, junction temperature."),
F("Stefan–Boltzmann law", "P = e σ A T⁴;  σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴;  net loss = eσA(T⁴ − T₀⁴)", "Power radiated by hot bodies.", "T must be in kelvin."),
F("Wien's displacement law", "λ_max T = b ≈ 2.9 × 10⁻³ m K", "Colour of hot bodies, temperature of stars."),
F("Newton's law of cooling", "dT/dt = −k(T − T₀);  average form (T₁ − T₂)/t = k[(T₁ + T₂)/2 − T₀]", "Time taken for a body to cool.", "Valid only for small temperature differences."),
],
"examples": [
X("Fever on two scales", "Normal body temperature is 98.6 °F. In °C?",
  f"C = (98.6 − 32) × 5/9 = {fx(C1,0)} °C.", [(fx(C1,0), "37")]),
X("Gap between rails", "10 m steel rails (α = 1.2 × 10⁻⁵ /°C) must allow a 50 °C rise. Gap needed?",
  f"ΔL = 10 × 1.2 × 10⁻⁵ × 50 = 6 × 10⁻³ m = {fx(dL2)} mm.", [(fx(dL2), "6")]),
X("Heating water", "Heat to warm 0.5 kg of water from 20 °C to 100 °C (c = 4200 J/kg K)?",
  f"Q = 0.5 × 4200 × 80 = {sig(Q3,3)} J.", [(sig(Q3,3), "1.68 × 10⁵")]),
X("Mixing hot and cold water", "0.2 kg of water at 80 °C is mixed with 0.3 kg at 20 °C. Final temperature?",
  f"0.2 × (80 − T) = 0.3 × (T − 20) → T = {fx(T4)} °C.", [(fx(T4), "44")]),
X("Steam into ice", "20 g of steam at 100 °C is passed into 100 g of ice at 0 °C. Final temperature? (L_v = 540, L_f = 80 cal/g)",
  f"Steam giving heat down to 0 °C: 20(540 + 100) = {fx(heat_steam)} cal. Melting all ice needs {fx(melt)} cal, so all ice melts. Remaining 4800 cal heats 120 g: T = 4800/120 = {fx(T5)} °C.",
  [(fx(heat_steam), "12800"), (fx(melt), "8000"), (fx(T5), "40")]),
X("Heat through a copper rod", "Copper rod: K = 400 W/m K, area 1 cm², length 0.5 m, ends at 100 °C and 0 °C. Heat current?",
  f"H = 400 × 10⁻⁴ × 100/0.5 = {fx(H6)} W.", [(fx(H6), "8")]),
X("Junction of two slabs", "Two slabs of equal thickness, K₁ = 2K₂, outer faces at 100 °C (slab 1) and 0 °C. Junction temperature?",
  f"2K(100 − T) = K(T − 0) → T = 200/3 ≈ {fx(T7,1)} °C.", [(fx(T7,1), "66.7")]),
X("Radiated power", "A sphere's radius is doubled and its kelvin temperature halved. Radiated power becomes?",
  f"P ∝ r²T⁴ = 4 × (1/16) = {fx(P8,2)} times the original.", [(fx(P8,2), "0.25")]),
X("Colour of the Sun", "The Sun's surface is at about 6000 K. λ_max?",
  f"λ = 2.9 × 10⁻³/6000 ≈ {fx(lam9,0)} nm — in the visible (green-blue) region.", [(fx(lam9,0), "483")]),
],
"topics": [
T("Heat and temperature", "Bodies in thermal contact exchange heat until their temperatures are equal (thermal equilibrium). Heat is measured in joules (1 cal = 4.186 J). Absolute zero (0 K = −273.15 °C) is the lowest possible temperature."),
T("Anomalous expansion of water", "Water contracts when heated from 0 °C to 4 °C and expands above 4 °C. Ponds freeze from the top: the densest water (4 °C) sinks, ice floats and insulates the water below, so aquatic life survives."),
T("Applications of expansion", "Gaps in rails and bridges, loose fitting of telephone wires in summer, bimetallic strips in thermostats (they bend towards the metal with smaller α), and pendulum clocks that lose time in summer."),
T("Specific heat facts", "Water has a very high specific heat, so it is used in radiators and hot-water bags and it keeps coastal climates mild. For gases, Cp > Cv because at constant pressure some heat does work."),
T("Change of state", "Melting point falls with pressure for substances that contract on melting (ice) — the idea behind regelation. Boiling point rises with pressure (pressure cooker) and falls at high altitude. Sublimation: solid → vapour directly (dry ice, naphthalene)."),
T("Convection", "Bulk movement of a fluid because hot, less dense fluid rises. Natural convection: sea and land breezes, trade winds, room heaters. Forced convection: fans, blood circulation, car radiators."),
T("Radiation and black bodies", "Radiation needs no medium and travels at c. A perfect black body absorbs all radiation and is the best emitter (Kirchhoff: good absorbers are good emitters). Hotter bodies peak at shorter wavelengths (Wien) and radiate much more power (T⁴)."),
T("Newton's law of cooling", "A body cools fastest when it is much hotter than the surroundings; the cooling curve is exponential. In exam problems use the average-temperature form unless told to use logarithms."),
],
"ratta": [
"C/100 = (F − 32)/180 = (K − 273)/100.",
"β = 2α, γ = 3α;  a hole expands too.",
"Q = mcΔT;  Q = mL (no ΔT during change of state).",
"Ice 80 cal/g, steam 540 cal/g, water 1 cal/g°C.",
"H = KAΔT/L;  series → resistances add.",
"P = eσAT⁴;  λ_max T = 2.9 × 10⁻³ m K.",
"Water is densest at 4 °C.",
],
}

SYLLABUS = [
("Heat, temperature, thermal expansion", ["temperature", "expansion", "α"]),
("Specific heat capacity, calorimetry", ["specific heat", "calorimetry"]),
("Change of state, latent heat", ["change of state", "latent heat"]),
("Heat transfer: conduction, convection and radiation", ["conduction", "convection", "radiation"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
