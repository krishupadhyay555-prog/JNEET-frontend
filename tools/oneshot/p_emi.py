from lib import F, X, T, sig, fx, build
import math

mu0 = 4 * math.pi * 1e-7
e1 = 100 * (0.02 - 0.005) / 0.1
e2 = 0.3 * 0.5 * 4; I2 = e2 / 2; F2 = 0.3 * I2 * 0.5; P2 = F2 * 4
e3 = 0.5 * 0.5 * 20 * 1 ** 2
L4 = mu0 * 500 ** 2 * 1e-3 / 0.5
e5 = 0.2 * 5 / 0.01; U5 = 0.5 * 0.2 * 25
e6 = 0.05 * 40
e7 = 100 * 0.01 * 0.5 * (2 * math.pi * 50)
Q8 = 10 * 0.02 / 5
tau9 = 2 / 4; I9 = 12 / 4; It9 = I9 * (1 - math.exp(-1))
M10 = mu0 * 1000 * 100 * 2e-4  # n1 = 1000/m, N2 = 100 turns, A = 2e-4 m^2

DOC = {
"slug": "electromagnetic-induction", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Electromagnetic Induction", "JEE": "Electromagnetic Induction"},
"title": "Electromagnetic Induction", "readMinutes": 18,
"summary": [
"Jab bhi kisi coil se guzarne wala magnetic flux Φ = B·A badalta hai, coil mein emf induce hota hai (Faraday). Flux teen tarah badal sakta hai: B badle, area badle (rod khiske), ya angle badle (coil ghoome — generator).",
"Induced current ki direction hamesha aisi hoti hai ki woh flux ke BADLAAV ka virodh kare (Lenz's law) — yeh energy conservation ka seedha nateeja hai. Isliye formula mein minus sign: ε = −N dΦ/dt.",
"Coil apne hi current ke badlaav ka virodh karti hai — self inductance L (ε = −L dI/dt), aur paas wali coil mein emf jagaati hai — mutual inductance M. Inductor energy ½LI² magnetic field mein store karta hai.",
"Metal ke tukde mein badalta flux gol-gol currents (eddy currents) banata hai — braking, induction furnace mein kaam ke, transformer core mein nuksaan (isliye laminated core)."
],
"formulas": [
F("Magnetic flux", "Φ = B·A = BA cosθ;   N turns: NΦ (flux linkage);   unit weber (T·m²)", "Coil se kitna field guzar raha hai.", "θ B aur area ke NORMAL ke beech, coil ke plane ke beech nahi."),
F("Faraday's law", "ε = −N dΦ/dt;   average ε = −N ΔΦ/Δt", "Badalte flux se emf.", "Flux zyada hona emf nahi deta — flux ka BADALNA deta hai.", None, "PYQ favourite"),
F("Lenz's law", "Induced current flux ke badlaav ka virodh karta hai (minus sign)", "Direction nikalna.", "Current flux ka virodh nahi, flux ke CHANGE ka virodh karta hai — flux badh raha ho to ulta field, ghat raha ho to same direction."),
F("Charge through the coil", "Q = N ΔΦ / R", "Kitna charge baha (time ka sawal nahi).", "Yeh kitni tezi se flux badla, us par depend nahi karta."),
F("Motional emf (rod)", "ε = Blv  (B, l, v teeno perpendicular);   general: ε = (v × B)·l", "Rod rails par khisak rahi hai.", "Teeno perpendicular na hon to sirf perpendicular components lo."),
F("Rod on rails with resistance", "I = Blv/R;   magnetic drag F = B²l²v/R;   power = F v = B²l²v²/R", "Constant speed ke liye kitna force.", "Drag force velocity ke proportional — isliye terminal velocity aati hai."),
F("Rotating rod", "ε = ½Bωl²  (ek end par ghoomti rod)", "Pankhe ki blade, ghoomti rod/disc.", "Do ends ke beech emf; beech mein pivot ho to dono halves ka emf cancel."),
F("AC generator emf", "ε = NBAω sinωt;   peak ε₀ = NBAω", "Coil uniform B mein ghoom rahi hai.", "ω = 2πf radian/sec mein; rpm ko pehle convert karo."),
F("Self inductance", "NΦ = LI;   ε = −L dI/dt;   unit henry", "Coil apne current ka virodh.", "L coil ki geometry se aata hai, current par depend nahi karta."),
F("Inductance of a solenoid", "L = μ₀μ_r N²A / l = μ₀μ_r n² A l", "Solenoid ka L.", "N² — turns double to L chaar guna."),
F("Mutual inductance", "N₂Φ₂ = M I₁;   ε₂ = −M dI₁/dt;   co-axial solenoids: M = μ₀ n₁ N₂ A;   M ≤ √(L₁L₂)", "Do paas ki coils.", "M dono coils ke liye same hota hai (M₁₂ = M₂₁)."),
F("Energy stored in an inductor", "U = ½LI²;   energy density u = B²/2μ₀", "Inductor mein energy.", "Current ka square — voltage se seedha mat nikalo."),
F("LR circuit (growth and decay)", "Growth: I = (E/R)(1 − e^{−t/τ});  decay: I = I₀e^{−t/τ};  τ = L/R", "Switch on/off ke baad current.", "t = τ par current final ka 63% hota hai, 50% nahi."),
F("Inductors in series/parallel (no coupling)", "Series: L = L₁ + L₂;   parallel: 1/L = 1/L₁ + 1/L₂", "Inductor combination.", "Resistors jaisa hi, capacitors jaisa nahi."),
],
"examples": [
X("Faraday: average emf", "100 turns ki coil se per-turn flux 0.02 Wb se 0.005 Wb tak 0.1 s mein ghatta hai. Emf?",
  f"ε = NΔΦ/Δt = 100 × 0.015/0.1 = {fx(e1)} V. Flux ghat raha hai ⇒ induced current wahi direction ka field banayega (Lenz).",
  [(fx(e1), "15")]),
X("Rails par rod", "0.5 m rod 4 m/s se B = 0.3 T mein khisakti hai, circuit R = 2 Ω. Emf, current, drag force, power?",
  f"ε = Blv = 0.3 × 0.5 × 4 = {fx(e2)} V. I = {fx(I2)} A. F = BIl = {fx(F2,3)} N. P = Fv = {fx(P2)} W = I²R ✓.",
  [(fx(e2), "0.6"), (fx(I2), "0.3"), (fx(F2,3), "0.045"), (fx(P2), "0.18")]),
X("Ghoomti rod", "1 m rod ek end par 20 rad/s se B = 0.5 T (axis ke parallel) mein ghoom rahi hai. Emf?",
  f"ε = ½Bωl² = ½ × 0.5 × 20 × 1 = {fx(e3)} V.", [(fx(e3), "5")]),
X("Solenoid ka L", "500 turns, lambai 0.5 m, area 10⁻³ m² (hawa core). L?",
  f"L = μ₀N²A/l = 4π × 10⁻⁷ × 2.5 × 10⁵ × 10⁻³ / 0.5 = {sig(L4)} H.",
  [(sig(L4), "6.3 × 10⁻⁴")]),
X("Self-induced emf aur energy", "L = 0.2 H mein current 5 A se 0 tak 0.01 s mein. Emf? 5 A par energy?",
  f"ε = L ΔI/Δt = 0.2 × 5/0.01 = {fx(e5)} V (isliye switch par spark). U = ½LI² = ½ × 0.2 × 25 = {fx(U5)} J.",
  [(fx(e5), "100"), (fx(U5), "2.5")]),
X("Mutual induction", "M = 0.05 H; primary ka current 40 A/s se badal raha hai. Secondary mein emf?",
  f"ε = M dI/dt = 0.05 × 40 = {fx(e6)} V.", [(fx(e6), "2")]),
X("Generator ka peak emf", "100 turns, area 0.01 m², B = 0.5 T, coil 50 rev/s se ghoomti hai. Peak emf?",
  f"ω = 2π × 50 = 100π rad/s. ε₀ = NBAω = 100 × 0.5 × 0.01 × 314.16 ≈ {fx(e7,0)} V.",
  [(fx(e7,0), "157")]),
X("Kitna charge baha", "10 turns, R = 5 Ω coil se per-turn flux 0.02 Wb poora hata diya. Kitna charge baha?",
  f"Q = NΔΦ/R = 10 × 0.02/5 = {fx(Q8)} C — chaahe jaldi hatao ya dheere.", [(fx(Q8), "0.04")]),
X("LR circuit", "L = 2 H, R = 4 Ω, battery 12 V. Time constant, final current, aur t = τ par current?",
  f"τ = L/R = {fx(tau9)} s. I₀ = 12/4 = {fx(I9)} A. t = τ par I = 3(1 − 1/e) ≈ {fx(It9,1)} A (63%).",
  [(fx(tau9), "0.5"), (fx(I9), "3"), (fx(It9,1), "1.9")]),
X("Do solenoids ka M", "Lamba solenoid 1000 turns/m; uske andar 100 turns ki chhoti coil, area 2 × 10⁻⁴ m². M?",
  f"M = μ₀ n₁ N₂ A = 4π × 10⁻⁷ × 1000 × 100 × 2 × 10⁻⁴ ≈ {sig(M10)} H.",
  [(sig(M10), "2.5 × 10⁻⁵")]),
],
"topics": [
T("Faraday aur Henry ke experiments", "(1) Magnet ko coil ke paas laao/hatao — galvanometer hilta hai; magnet ruka to zero. (2) Paas wali coil mein current on/off karo — doosri coil mein current. (3) Coil ko field mein ghumao. Teeno mein ek hi baat: flux badla to emf."),
T("Lenz's law aur energy", "Magnet ka north coil ki taraf laao to coil ka saamne wala face north ban jaata hai aur magnet ko dhakelta hai — paas laane mein kaam lagta hai, wahi kaam electrical energy banta hai. Agar current madad karta to free energy milti — impossible."),
T("Motional emf ki soch", "Rod ke electrons par qvB force lagta hai jo unhe ek end par dhakel deta hai — rod ek battery ban jaati hai. Circuit band ho to current, aur current par BIl drag force jo motion ka virodh karta hai."),
T("Eddy currents", "Badalte flux se metal plate/core mein gol-gol currents. Fayde: electromagnetic brake (trains), induction furnace, induction cooktop, galvanometer ki damping, speedometer. Nuksaan: heating aur energy loss — isliye transformer aur motor ke core laminated (patli insulated sheets) hote hain."),
T("Self induction", "Coil electrical inertia jaisi hai: current badhne ya ghatne nahi deti. Switch kholne par current achanak girta hai ⇒ bada emf ⇒ spark. Choke coil AC mein bina energy waste kiye current kam karti hai."),
T("Mutual induction", "Ek coil ka badalta current doosri coil mein emf. M coils ki doori, orientation aur core par depend karta hai; paas aur same axis = zyada M. Transformer, wireless charger isi par chalte hain."),
T("AC generator", "Coil uniform B mein ghoomti hai, Φ = NBA cosωt ⇒ ε = NBAω sinωt. Slip rings + brushes se AC bahar aata hai. Mechanical energy (turbine) → electrical energy."),
],
"ratta": [
"ε = −N dΦ/dt;  Φ = BA cosθ.",
"Rod: ε = Blv;  rotating rod: ½Bωl².",
"Q = NΔΦ/R (time independent).",
"L_solenoid = μ₀N²A/l;  U = ½LI².",
"τ = L/R;  63% at t = τ.",
"Generator ε₀ = NBAω.",
"Eddy currents kam karne ke liye laminated core.",
"M ≤ √(L₁L₂).",
],
}

SYLLABUS = [
("Electromagnetic induction, Faraday's law", ["Faraday"]),
("Induced emf and current", ["Induced", "emf"]),
("Lenz's law", ["Lenz's law"]),
("Eddy currents", ["Eddy currents"]),
("Self and mutual inductance", ["Self inductance", "Mutual inductance"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
