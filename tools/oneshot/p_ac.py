from lib import F, X, T, sig, fx, build
import math

Vr1 = 311 / math.sqrt(2); f1 = 314 / (2 * math.pi)
XL2 = 2 * math.pi * 50 * 0.1; XC2 = 1 / (2 * math.pi * 50 * 100e-6)
Z3 = math.sqrt(30 ** 2 + (80 - 40) ** 2); I3 = 200 / Z3; pf3 = 30 / Z3; P3 = 200 * I3 * pf3; ph3 = math.degrees(math.atan(40 / 30))
w4 = 1 / math.sqrt(0.5 * 8e-6); f4 = w4 / (2 * math.pi); Q4 = w4 * 0.5 / 10
Vs5 = 220 * 4000 / 200; Ip5 = 0.5 * Vs5 / 220
Iw6 = 5 * math.sin(math.radians(60)); pf6 = math.cos(math.radians(60))
I7 = 50 / 100; R7 = 100 / I7; Z7 = 200 / I7; XL7 = math.sqrt(Z7 ** 2 - R7 ** 2); L7 = XL7 / (2 * math.pi * 50)
f8 = 1 / (2 * math.pi * math.sqrt(10e-3 * 1e-6))
eta9 = 0.9; Pin9 = 4400 * 0.5 / eta9  # output 4400 V × 0.5 A

DOC = {
"slug": "alternating-current", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Alternating Current", "JEE": "Alternating Current"},
"title": "Alternating Current", "readMinutes": 18,
"summary": [
"AC mein voltage aur current sinusoidal badalte hain: v = V₀ sinωt. Ghar ki supply 220 V, 50 Hz — yeh 220 V RMS value hai, peak ≈ 311 V. Ek cycle ka average zero hota hai, isliye heating ke liye RMS use karte hain.",
"Resistor mein V aur I same phase mein. Inductor current ko 90° peeche rakhta hai (X_L = ωL, frequency badhe to rokna badhe), capacitor 90° aage (X_C = 1/ωC, DC ko poora rokta hai).",
"Series LCR mein total rukawat impedance Z = √(R² + (X_L − X_C)²). Jab X_L = X_C, Z = R minimum aur current maximum — resonance (ω₀ = 1/√LC). Radio tuning isi par hoti hai.",
"Power sirf resistor khaata hai: P = V_rms I_rms cosφ. Pure L ya C mein average power zero (wattless current). Transformer voltage badal ke bijli door tak kam loss mein bhejta hai."
],
"formulas": [
F("Instantaneous AC", "v = V₀ sin ωt;   i = I₀ sin(ωt ± φ);   ω = 2πf", "AC ka equation padhna.", "ω ko f mat samjho — 314 rad/s matlab 50 Hz."),
F("RMS and average values", "V_rms = V₀/√2 ≈ 0.707V₀;   I_rms = I₀/√2;   half-cycle average = 2V₀/π ≈ 0.637V₀;   full cycle average = 0", "Meter reading, heating.", "AC voltmeter/ammeter RMS padhte hain; 220 V supply ka peak 311 V hai, 220 nahi.", None, "PYQ favourite"),
F("Inductive reactance", "X_L = ωL = 2πfL;   current V se 90° peeche", "Pure inductor.", "DC (f = 0) par X_L = 0 — inductor DC ko nahi rokta."),
F("Capacitive reactance", "X_C = 1/(ωC) = 1/(2πfC);   current V se 90° aage", "Pure capacitor.", "DC par X_C = ∞ — capacitor DC ko poora rok deta hai."),
F("Series LCR impedance", "Z = √(R² + (X_L − X_C)²);   I_rms = V_rms/Z", "R, L, C series mein.", "Voltages seedhe nahi judte: V = √(V_R² + (V_L − V_C)²); V_L aur V_C alag-alag supply se bade ho sakte hain."),
F("Phase angle", "tanφ = (X_L − X_C)/R;   X_L > X_C: current peeche (inductive), X_L < X_C: aage (capacitive)", "Phase difference.", "φ voltage aur CURRENT ke beech hai, do voltages ke beech nahi."),
F("Resonance", "X_L = X_C ⇒ ω₀ = 1/√(LC), f₀ = 1/(2π√(LC));   Z = R, current max, φ = 0", "Tuning, max current.", "Resonance R par depend nahi karta; R sirf peak ki height/sharpness badalta hai."),
F("Quality factor and bandwidth", "Q = ω₀L/R = (1/R)√(L/C);   bandwidth Δω = R/L = ω₀/Q", "Resonance kitni sharp.", "Q zyada = sharp peak = kam R."),
F("Power in AC", "P_avg = V_rms I_rms cosφ = I_rms² R;   power factor cosφ = R/Z", "Asli kharch hone wali power.", "V_rms × I_rms 'apparent power' hai, asli power nahi (cosφ chhoot gaya)."),
F("Wattless current", "Power deta component: I_rms cosφ;   wattless component: I_rms sinφ", "Pure L/C ya power factor ka sawal.", "Pure L ya C mein current behta hai par average power zero."),
F("LC oscillations", "ω = 1/√(LC);   energy C ke electric field aur L ke magnetic field ke beech aati-jaati;   q = q₀ cosωt", "Bina R ka LC circuit.", "Resistance ho to oscillations dheere-dheere khatam (damped)."),
F("Transformer", "V_s/V_p = N_s/N_p = I_p/I_s  (ideal);   efficiency η = P_out/P_in", "Step-up/step-down.", "Transformer sirf AC par chalta hai; DC par sirf heating hogi."),
F("AC generator", "ε = NBAω sinωt;   ε₀ = NBAω", "AC banana.", "Coil ka plane B ke parallel ho tab emf max hota hai (flux zero par, badlaav sabse tez)."),
],
"examples": [
X("RMS aur frequency", "v = 311 sin(314t) volt. RMS voltage aur frequency?",
  f"V_rms = 311/√2 ≈ {fx(Vr1,0)} V. f = 314/2π ≈ {fx(f1,0)} Hz — yahi ghar ki supply hai.",
  [(fx(Vr1,0), "220"), (fx(f1,0), "50")]),
X("Reactances 50 Hz par", "L = 0.1 H aur C = 100 μF ka 50 Hz par reactance?",
  f"X_L = 2π × 50 × 0.1 = {fx(XL2,1)} Ω. X_C = 1/(2π × 50 × 10⁻⁴) = {fx(XC2,1)} Ω.",
  [(fx(XL2,1), "31.4"), (fx(XC2,1), "31.8")]),
X("Series LCR poora", "R = 30 Ω, X_L = 80 Ω, X_C = 40 Ω, V_rms = 200 V. Z, current, power factor, power, phase?",
  f"Z = √(900 + 1600) = {fx(Z3)} Ω. I = 200/50 = {fx(I3)} A. cosφ = 30/50 = {fx(pf3)}. P = 200 × 4 × 0.6 = {fx(P3)} W (= I²R = 16 × 30 ✓). tanφ = 40/30 ⇒ φ ≈ {fx(ph3,1)}°, current peeche (inductive).",
  [(fx(Z3), "50"), (fx(I3), "4"), (fx(pf3), "0.6"), (fx(P3), "480"), (fx(ph3,1), "53.1")]),
X("Resonance", "L = 0.5 H, C = 8 μF, R = 10 Ω. Resonant ω, f aur Q?",
  f"ω₀ = 1/√(0.5 × 8 × 10⁻⁶) = 1/(2 × 10⁻³) = {fx(w4)} rad/s. f₀ = 500/2π ≈ {fx(f4,1)} Hz. Q = ω₀L/R = 250/10 = {fx(Q4)}.",
  [(fx(w4), "500"), (fx(f4,1), "79.6"), (fx(Q4), "25")]),
X("Step-up transformer", "N_p = 200, N_s = 4000, V_p = 220 V. V_s? Secondary mein 0.5 A ho to primary current (ideal)?",
  f"V_s = 220 × 4000/200 = {fx(Vs5)} V. I_p = I_s × V_s/V_p = 0.5 × 20 = {fx(Ip5)} A.",
  [(fx(Vs5), "4400"), (fx(Ip5), "10")]),
X("Wattless current", "I_rms = 5 A, current voltage se 60° peeche. Wattless component aur power factor?",
  f"Wattless = I sinφ = 5 × 0.866 = {fx(Iw6)} A. Power factor = cos60° = {fx(pf6)}.",
  [(fx(Iw6), "4.33"), (fx(pf6), "0.5")]),
X("Bulb ke saath choke", "100 V, 50 W ka bulb 200 V, 50 Hz supply par chalana hai, series mein inductor lagaakar. L kitna?",
  f"Bulb: I = 50/100 = {fx(I7)} A, R = 100/0.5 = {fx(R7)} Ω. Z = 200/0.5 = {fx(Z7)} Ω. X_L = √(400² − 200²) ≈ {fx(XL7,1)} Ω. L = X_L/(2π × 50) ≈ {fx(L7)} H. (Resistor lagaate to usme bhi 50 W jalta — choke mein lagbhag zero.)",
  [(fx(I7), "0.5"), (fx(R7), "200"), (fx(Z7), "400"), (fx(XL7,1), "346.4"), (fx(L7), "1.1")]),
X("LC circuit ki frequency", "L = 10 mH, C = 1 μF. Oscillation frequency?",
  f"f = 1/(2π√(10⁻² × 10⁻⁶)) = 1/(2π × 10⁻⁴) ≈ {fx(f8,0)} Hz.",
  [(fx(f8,0), "1592")]),
X("Transformer efficiency", "Upar wala transformer 90% efficient ho aur output 4400 V × 0.5 A ho. Input power?",
  f"P_out = 2200 W. P_in = 2200/0.9 ≈ {fx(Pin9,0)} W. Baaki ~244 W heat mein (copper, eddy, hysteresis losses).",
  [(fx(Pin9,0), "2444")]),
],
"topics": [
T("Peak aur RMS kyun", "RMS value woh DC value hai jo resistor mein utni hi heat de. Sine wave ka RMS = peak/√2. Meters RMS dikhaate hain; insulation aur capacitor rating peak ke liye chahiye."),
T("Phasors", "AC quantities ko ghoomte arrows (phasors) se dikhaate hain jo ω se ghoomte hain. R mein V aur I ek line mein; L mein V, I se 90° aage; C mein V, I se 90° peeche. LCR mein V_L aur V_C ulte, isliye ek doosre ko kaatte hain."),
T("Reactance aur impedance", "Reactance (X_L, X_C) bhi ohm mein hai lekin energy kharch nahi karta — sirf store karke wapas deta hai. Impedance Z poori rukawat hai (R + reactance, vector ki tarah judte hain)."),
T("Resonance ke facts", "Resonance par V_L = V_C (ek doosre ko cancel), circuit pure resistive, current max, power max. f < f₀ par circuit capacitive, f > f₀ par inductive. Radio/TV tuning mein C badalkar f₀ station ki frequency par laate hain."),
T("Power in AC circuits", "Average power = V_rms I_rms cosφ. Pure R: cosφ = 1. Pure L/C: cosφ = 0 (wattless). Factories mein low power factor = zyada current = zyada line loss, isliye capacitors lagaakar power factor sudhaarte hain."),
T("Transformer ki working aur losses", "Primary ka AC core mein badalta flux banata hai, jo secondary mein emf jagaata hai (mutual induction). Losses: copper (I²R, moti wire), eddy current (laminated core), hysteresis (soft iron), flux leakage. Bijli high voltage par bhejte hain taaki current kam ho aur I²R loss kam."),
T("AC generator", "Coil ghoomne se flux NBA cosωt badalta hai ⇒ emf NBAω sinωt. Slip rings se AC milta hai. India mein f = 50 Hz."),
],
"ratta": [
"V_rms = V₀/√2;  220 V ⇒ peak 311 V;  half-cycle average 2V₀/π.",
"X_L = ωL (I peeche),  X_C = 1/ωC (I aage).",
"Z = √(R² + (X_L − X_C)²);  tanφ = (X_L − X_C)/R.",
"f₀ = 1/(2π√LC);  Q = ω₀L/R.",
"P = V_rms I_rms cosφ;  cosφ = R/Z.",
"Wattless: I sinφ.",
"V_s/V_p = N_s/N_p = I_p/I_s.",
"Transformer losses: copper, eddy, hysteresis, leakage.",
],
}

SYLLABUS = [
("Alternating currents, peak and RMS value of alternating current/voltage", ["peak", "RMS"]),
("Reactance and impedance", ["reactance", "impedance"]),
("LCR series circuit, resonance", ["Series LCR", "Resonance"]),
("Power in AC circuits, wattless current", ["Power in AC", "Wattless current"]),
("LC oscillations", ["LC oscillations"]),
("AC generator and transformer", ["AC generator", "Transformer"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
