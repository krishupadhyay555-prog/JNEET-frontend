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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Temperature batata hai heat kis taraf behegi; heat temperature difference ki wajah se transit mein energy hai. Celsius, Fahrenheit aur Kelvin scales linearly jude hain.",
"Zyadatar cheezein garam hone par failti hain: linear (α), area (β = 2α), volume (γ = 3α) expansion. Paani alag hai — 0 °C se 4 °C tak sikudta hai, isliye 4 °C par sabse dense.",
"Temperature badalne ki heat Q = mcΔT; constant temperature par state badalne ki Q = mL. Calorimetry bas 'heat lost = heat gained' hai.",
"Heat conduction (H = KAΔT/L), convection (fluid ki bulk motion) aur radiation (Stefan–Boltzmann, Wien's law) se behti hai. Newton's law of cooling: cooling ki rate ∝ surroundings se temperature difference.",
],
when=[
("°C, °F aur K mein convert karna.", "1 °C change = 1 K = 1.8 °F — temperature DIFFERENCE mein 32 mat jodo."),
("Rails, bridges, metal rods, pendulum clocks.", None),
("Plate mein chhed, bartan mein liquid.", "Plate ka chhed garam hone par BADHTA hai, ghatta nahi."),
("Garam rod ke clamps par force.", None),
("State badle bina garam karna.", None),
("Bodies, gases compare karna.", None),
("Pighalna, ubalna, condensation.", "State change ke dauraan temperature constant rehta hai — wahan mcΔT mat lagao."),
("Mixing problems.", "Ice ho to pehle check karo SAARI ice pighal sakti hai ya nahi, tabhi 0 °C se upar final temperature maano."),
("Rods aur deewaron se heat flow.", None),
("Composite walls, junction temperature.", None),
("Garam bodies ki radiated power.", "T kelvin mein hi lo, °C mein nahi."),
("Garam bodies ka rang, stars ka temperature.", None),
("Body ke thanda hone ka time.", "Sirf chhote temperature difference ke liye valid."),
],
examples=[
("Bukhaar do scales par", "Normal body temperature 98.6 °F. °C mein?",
 "C = (98.6 − 32) × 5/9 = ⟨0⟩ °C."),
("Rails ke beech gap", "10 m steel rails (α = 1.2 × 10⁻⁵ /°C), 50 °C rise ke liye gap?",
 "ΔL = 10 × 1.2 × 10⁻⁵ × 50 = 6 × 10⁻³ m = ⟨0⟩ mm."),
("Paani garam karna", "0.5 kg paani 20 °C se 100 °C (c = 4200 J/kg K)?",
 "Q = 0.5 × 4200 × 80 = ⟨0⟩ J."),
("Garam aur thanda paani milaana", "80 °C ka 0.2 kg paani 20 °C ke 0.3 kg mein. Final temperature?",
 "0.2 × (80 − T) = 0.3 × (T − 20) → T = ⟨0⟩ °C."),
("Ice mein steam", "100 °C ki 20 g steam 0 °C ki 100 g ice mein. Final temperature? (L_v = 540, L_f = 80 cal/g)",
 "Steam 0 °C tak heat degi: 20(540 + 100) = ⟨0⟩ cal. Saari ice pighalne ko ⟨1⟩ cal chahiye, toh saari ice pighlegi. Bachi 4800 cal 120 g ko garam karegi: T = 4800/120 = ⟨2⟩ °C."),
("Copper rod se heat", "Copper rod: K = 400 W/m K, area 1 cm², length 0.5 m, ends 100 °C aur 0 °C. Heat current?",
 "H = 400 × 10⁻⁴ × 100/0.5 = ⟨0⟩ W."),
("Do slabs ka junction", "Barabar motai ke do slabs, K₁ = 2K₂, bahar ki faces 100 °C (slab 1) aur 0 °C. Junction temperature?",
 "2K(100 − T) = K(T − 0) → T = 200/3 ≈ ⟨0⟩ °C."),
("Radiated power", "Sphere ka radius double aur kelvin temperature aadha. Radiated power?",
 "P ∝ r²T⁴ = 4 × (1/16) = original ka ⟨0⟩ guna."),
("Suraj ka rang", "Suraj ki surface ~6000 K. λ_max?",
 "λ = 2.9 × 10⁻³/6000 ≈ ⟨0⟩ nm — visible (green-blue) region."),
],
topics=[
("Heat and temperature", "Thermal contact mein bodies tab tak heat lete-dete hain jab tak temperature barabar na ho (thermal equilibrium). Heat joules mein (1 cal = 4.186 J). Absolute zero (0 K = −273.15 °C) sabse kam possible temperature."),
("Anomalous expansion of water", "Paani 0 °C se 4 °C garam karne par sikudta hai aur 4 °C se upar failta hai. Talaab upar se jamte hain: sabse dense paani (4 °C) neeche, ice upar tairti hai aur neeche ke paani ko insulate karti hai, isliye jal-jeevan bachta hai."),
("Applications of expansion", "Rails aur bridges mein gaps, garmi mein telephone wires dheeli, thermostats mein bimetallic strip (kam α wali metal ki taraf mudti hai), garmi mein pendulum clocks dheemi."),
("Specific heat facts", "Paani ki specific heat bahut zyada hai, isliye radiators aur hot-water bags mein use hota hai aur coastal climate narm rakhta hai. Gases mein Cp > Cv kyunki constant pressure par kuch heat work karti hai."),
("Change of state", "Jo cheezein pighalne par sikudti hain (ice) unka melting point pressure se ghatta hai — regelation. Boiling point pressure se badhta hai (pressure cooker) aur pahaadon par ghatta hai. Sublimation: solid → vapour seedha (dry ice, naphthalene)."),
("Convection", "Fluid ki bulk movement kyunki garam, kam dense fluid upar uthta hai. Natural convection: sea aur land breeze, trade winds, room heaters. Forced convection: pankhe, blood circulation, car radiators."),
("Radiation and black bodies", "Radiation ko medium nahi chahiye, speed c. Perfect black body saari radiation absorb karti hai aur best emitter hai (Kirchhoff: achhe absorber achhe emitter). Garam bodies chhoti wavelength par peak karti hain (Wien) aur bahut zyada power deti hain (T⁴)."),
("Newton's law of cooling", "Body surroundings se bahut garam ho to sabse tez thandi hoti hai; cooling curve exponential hai. Exam mein average-temperature form lagao jab tak log wala form na maanga ho."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
