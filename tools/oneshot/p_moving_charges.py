from lib import F, X, T, sig, fx, build
import math

mu0 = 4 * math.pi * 1e-7; e = 1.6e-19; me = 9.11e-31; mp = 1.67e-27
F1 = e * 2e6 * 0.5; r1 = me * 2e6 / (e * 0.5)
f2 = e * 1 / (2 * math.pi * mp)
B3 = mu0 * 10 * 2 / (2 * 0.1)
B4 = mu0 * 10 / (2 * math.pi * 0.05)
B5 = mu0 * 1000 * 2
f6 = mu0 * 5 * 10 / (2 * math.pi * 0.1)
m7 = 50 * 1 * 0.02; t7 = m7 * 0.2 * math.sin(math.radians(30))
S8 = 0.005 * 50 / (5 - 0.005); R8 = 10 / 0.005 - 50
v9 = 1e4 / 0.02
F10 = 3 * 0.5 * 0.4
pitch11 = 2 * math.pi * me * (2e6 * math.cos(math.radians(60))) / (e * 0.01)
Bax12 = mu0 * 1 * 0.1 ** 2 / (2 * (0.1 ** 2 + 0.1 ** 2) ** 1.5)

DOC = {
"slug": "moving-charges-and-magnetism", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Moving Charges and Magnetism", "JEE": "Moving Charges and Magnetism"},
"title": "Moving Charges and Magnetism", "readMinutes": 22,
"summary": [
"Chalta charge (current) apne aas-paas magnetic field B banata hai (Oersted). Ek current element ka field Biot–Savart law deta hai; symmetric cases (lambi wire, solenoid, toroid) mein Ampere's circuital law se jaldi nikalta hai.",
"Magnetic field chalte charge par force lagata hai: F = q(v × B). Yeh force hamesha velocity ke perpendicular hai, isliye speed nahi badalti, kaam zero — sirf direction mudti hai (circle ya helix). E aur B dono hon to Lorentz force F = q(E + v × B).",
"Current wali wire par F = I(L × B). Do parallel wires: same direction current — attract, ulta — repel; isi se ampere ki definition aati hai.",
"Current loop ek magnetic dipole hai (m = NIA); uniform field mein net force zero par torque τ = m × B lagta hai. Yahi moving coil galvanometer ka principle hai, jise shunt (chhota R parallel) se ammeter aur bada R series mein lagaakar voltmeter banate hain."
],
"formulas": [
F("Biot–Savart law", "dB = (μ₀/4π) I dl × r̂ / r² = (μ₀/4π) I dl sinθ / r²", "Kisi bhi shape ki wire ka field (chhote tukdon ko jodkar).", "r element se point ki taraf hai; θ dl aur r ke beech — dl ki direction current wali."),
F("Field at centre of circular loop", "B = μ₀NI / 2R;   arc (angle φ radian): B = μ₀Iφ / 4πR", "Gol coil ya arc ka centre.", "Arc mein φ radian mein daalo, degree mein nahi.", None, "PYQ favourite"),
F("Field on axis of circular loop", "B = μ₀NIR² / [2(R² + x²)^{3/2}];   x ≫ R: B ≈ μ₀m / 2πx³", "Coil ke axis par kisi point par.", "x = 0 rakhne par centre wala formula aana chahiye — check kar lo."),
F("Straight wire", "Finite: B = (μ₀I/4πd)(sinφ₁ + sinφ₂);   infinite: B = μ₀I / 2πd;   semi-infinite end ke saamne: μ₀I/4πd", "Seedhi wire se d doori par.", "Angles perpendicular se naapne hain (wire ke saath nahi)."),
F("Ampere's circuital law", "∮B·dl = μ₀ I_enclosed", "Symmetry wale cases: lambi wire, solenoid, toroid, thick wire.", "Loop ke bahar ka current I_enclosed mein mat gino."),
F("Thick (solid) wire, radius R", "Andar (r < R): B = μ₀Ir / 2πR²;   bahar: B = μ₀I / 2πr", "Uniform current wali moti wire.", "Andar field r ke saath BADHTA hai, surface par max."),
F("Solenoid and toroid", "Lamba solenoid andar: B = μ₀nI (n = turns per metre), end par μ₀nI/2;   toroid: B = μ₀NI / 2πr", "Coil ke andar uniform field.", "n turns per METRE hai, total turns nahi."),
F("Force on moving charge (Lorentz)", "F = q(v × B);   |F| = qvB sinθ;   E bhi ho: F = q(E + v × B)", "Charge magnetic/electric field mein.", "Electron (negative) par direction ulti — Fleming/right-hand ke baad flip karo."),
F("Circular path in uniform B", "r = mv/qB = p/qB = √(2mK)/qB;   T = 2πm/qB;   f = qB/2πm", "v ⊥ B.", "Time period speed par depend NAHI karta (cyclotron isi par chalta hai).", None, "PYQ favourite"),
F("Helical path", "v at angle θ to B: radius = mv sinθ / qB;   pitch = 2πm v cosθ / qB", "Velocity B se tircha.", "Pitch mein cosθ, radius mein sinθ — ulta mat karo."),
F("Velocity selector", "E aur B perpendicular: undeflected tab jab v = E/B", "Crossed fields.", "Sirf us speed ke liye; mass/charge kuch bhi ho."),
F("Force on current-carrying wire", "F = I(L × B);   |F| = BIL sinθ;   koi bhi closed loop uniform B mein: F_net = 0", "Wire magnetic field mein.", "Curved wire ka force uske seedhe end-to-end tukde jitna hota hai."),
F("Force between parallel wires", "F/L = μ₀I₁I₂ / 2πd;   same direction attract, opposite repel", "Do lambi parallel wires.", "Electric charges ka ulta: yahan 'like' currents attract karte hain."),
F("Magnetic dipole moment and torque", "m = NIA (direction right-hand se);   τ = m × B, |τ| = NIAB sinθ;   U = −m·B", "Current loop field mein.", "θ loop ke PLANE se nahi, normal (m) se naapo."),
F("Moving coil galvanometer", "NIAB = kφ ⇒ φ = (NAB/k) I;   current sensitivity φ/I = NAB/k;   voltage sensitivity φ/V = NAB/(kR_G)", "Galvanometer ki working.", "Turns badhane se current sensitivity badhti hai, voltage sensitivity zaroori nahi (R bhi badhta hai)."),
F("Galvanometer → ammeter / voltmeter", "Ammeter: shunt S = I_g G / (I − I_g) parallel mein.   Voltmeter: R = V/I_g − G series mein", "Range badalna.", "Ammeter ka resistance bahut kam, voltmeter ka bahut zyada — ulta jodne par meter jal sakta hai."),
],
"examples": [
X("Electron par force aur radius", "Electron 2 × 10⁶ m/s se B = 0.5 T ke perpendicular chal raha hai. Force aur circle ka radius? (m_e = 9.11 × 10⁻³¹ kg)",
  f"F = qvB = 1.6 × 10⁻¹⁹ × 2 × 10⁶ × 0.5 = {sig(F1)} N. r = mv/qB = 9.11 × 10⁻³¹ × 2 × 10⁶ / (1.6 × 10⁻¹⁹ × 0.5) = {sig(r1,3)} m.",
  [(sig(F1), "1.6 × 10⁻¹³"), (sig(r1,3), "2.28 × 10⁻⁵")]),
X("Cyclotron frequency", "Proton B = 1 T mein ghoom raha hai. Frequency? (m_p = 1.67 × 10⁻²⁷ kg)",
  f"f = qB/2πm = 1.6 × 10⁻¹⁹ / (2π × 1.67 × 10⁻²⁷) ≈ {sig(f2,3)} Hz — speed par depend nahi.",
  [(sig(f2,3), "1.52 × 10⁷")]),
X("Coil ke centre par field", "10 turns, radius 10 cm, current 2 A. Centre par B?",
  f"B = μ₀NI/2R = 4π × 10⁻⁷ × 10 × 2 / 0.2 = {sig(B3,3)} T.",
  [(sig(B3,3), "1.26 × 10⁻⁴")]),
X("Lambi wire", "Lambi seedhi wire mein 10 A. 5 cm door B?",
  f"B = μ₀I/2πd = 2 × 10⁻⁷ × 10/0.05 = {sig(B4)} T.",
  [(sig(B4), "4.0 × 10⁻⁵")]),
X("Solenoid", "Solenoid mein 1000 turns per metre, current 2 A. Andar B?",
  f"B = μ₀nI = 4π × 10⁻⁷ × 1000 × 2 = {sig(B5,3)} T.",
  [(sig(B5,3), "2.51 × 10⁻³")]),
X("Parallel wires ka force", "Do lambi parallel wires 10 cm door, currents 5 A aur 10 A same direction. Force per metre?",
  f"F/L = μ₀I₁I₂/2πd = 2 × 10⁻⁷ × 50/0.1 = {sig(f6)} N/m, attraction.",
  [(sig(f6), "1.0 × 10⁻⁴")]),
X("Coil par torque", "50 turns, area 0.02 m², current 1 A, B = 0.2 T; coil ka normal B se 30° par. Magnetic moment aur torque?",
  f"m = NIA = {fx(m7)} A·m². τ = mB sin30° = 1 × 0.2 × 0.5 = {fx(t7)} N·m.",
  [(fx(m7), "1"), (fx(t7), "0.1")]),
X("Galvanometer ko ammeter aur voltmeter", "G = 50 Ω, full-scale I_g = 5 mA. (a) 0–5 A ammeter (b) 0–10 V voltmeter?",
  f"(a) S = I_g G/(I − I_g) = 0.005 × 50/4.995 ≈ {fx(S8,3)} Ω parallel mein. (b) R = V/I_g − G = 2000 − 50 = {fx(R8)} Ω series mein.",
  [(fx(S8,3), "0.05"), (fx(R8), "1950")]),
X("Velocity selector", "E = 10⁴ V/m aur B = 0.02 T crossed hain. Kis speed ke charges seedhe nikal jaayenge?",
  f"v = E/B = 10⁴/0.02 = {sig(v9)} m/s.",
  [(sig(v9), "5.0 × 10⁵")]),
X("Wire par force", "0.5 m wire mein 3 A, B = 0.4 T ke perpendicular. Force?",
  f"F = BIL = 0.4 × 3 × 0.5 = {fx(F10)} N.", [(fx(F10), "0.6")]),
X("Helix ki pitch", "Electron 2 × 10⁶ m/s se B = 0.01 T ke saath 60° angle par ghusta hai. Pitch?",
  f"Pitch = 2πm v cos60° / qB = 2π × 9.11 × 10⁻³¹ × 10⁶ / (1.6 × 10⁻¹⁹ × 0.01) ≈ {sig(pitch11)} m.",
  [(sig(pitch11), "3.6 × 10⁻³")]),
X("Axis par field", "1 turn, R = 10 cm, I = 1 A. Axis par centre se 10 cm door B?",
  f"B = μ₀IR²/[2(R² + x²)^{{3/2}}] = 4π × 10⁻⁷ × 0.01 / [2 × (0.02)^{{3/2}}] ≈ {sig(Bax12)} T (centre ke 6.3 × 10⁻⁶ T ka lagbhag 35%).",
  [(sig(Bax12), "2.2 × 10⁻⁶")]),
],
"topics": [
T("Oersted ka experiment", "Current wali wire ke paas compass ki needle mud jaati hai — matlab current magnetic field banata hai. Current ulta karo to needle ulti mudti hai. Field lines wire ke chaaron taraf gol (concentric) hoti hain."),
T("Direction ke rules", "Right-hand thumb rule: angootha current ki direction, ungliyan B ki direction (lambi wire). Loop/solenoid mein ungliyan current ke saath mudao, angootha B (north) dikhata hai. Force ke liye F = q(v × B) ka cross product ya Fleming's left-hand rule."),
T("Biot–Savart ke applications", "Circular loop ke centre aur axis par field, arc ka field, finite wire. Field current ke proportional aur doori ke square ke ulta (element ke liye)."),
T("Ampere's law ke applications", "Infinite wire (B ∝ 1/r), solid wire ke andar (B ∝ r), solenoid (andar uniform μ₀nI, bahar ≈ 0), toroid (andar μ₀NI/2πr, bahar zero). Amperian loop aisa chuno jahan B constant aur dl ke parallel ho."),
T("Charge ki motion E aur B mein", "Sirf B: circle (v ⊥ B), helix (tircha), seedha (v ∥ B, force zero). Magnetic force kaam nahi karta ⇒ KE constant. E aur B crossed: velocity selector. Cyclotron: f = qB/2πm se charges ko baar-baar accelerate karta hai."),
T("Definition of ampere", "Do anant lambi parallel wires 1 m door hon aur har mein itna current ho ki unke beech 2 × 10⁻⁷ N per metre force lage — woh current 1 ampere. (2019 se SI mein ampere elementary charge e se define hota hai, lekin yeh relation sach hai.)"),
T("Current loop as a magnetic dipole", "Loop ek chhote bar magnet jaisa behave karta hai: m = NIA, ek face north ek south. Door se iska field dipole jaisa (1/r³). Uniform field mein net force zero, torque m × B — loop m ko B ke saath align karna chahta hai."),
T("Moving coil galvanometer", "Coil radial magnetic field mein (concave poles + soft iron core) ⇒ har position par sinθ = 1, deflection current ke proportional (linear scale). Spring ka restoring torque kφ. Sensitivity badhaane ke liye N, B, A badhao ya k ghatao."),
],
"ratta": [
"μ₀/4π = 10⁻⁷ T·m/A;  μ₀/2π = 2 × 10⁻⁷.",
"Loop centre μ₀NI/2R;  wire μ₀I/2πd;  solenoid μ₀nI.",
"r = mv/qB;  T = 2πm/qB (speed independent).",
"v = E/B (velocity selector).",
"F/L = μ₀I₁I₂/2πd — same direction attract.",
"m = NIA;  τ = mB sinθ;  U = −mB cosθ.",
"Shunt S = I_g G/(I − I_g);  series R = V/I_g − G.",
"Magnetic force kabhi kaam nahi karta.",
],
}

SYLLABUS = [
("Concept of magnetic field, Oersted's experiment", ["magnetic field", "Oersted"]),
("Biot-Savart law and its application to current carrying circular loop", ["Biot–Savart", "circular loop"]),
("Ampere's law and its applications to infinitely long straight wire and solenoid", ["Ampere's circuital law", "infinite", "solenoid"]),
("Force on a moving charge in uniform magnetic and electric fields", ["Lorentz", "q(E + v × B)"]),
("Force on a current-carrying conductor in a uniform magnetic field", ["Force on current-carrying wire"]),
("Force between two parallel current-carrying conductors, definition of ampere", ["parallel wires", "Definition of ampere"]),
("Torque on a current loop in a uniform magnetic field", ["τ = m × B"]),
("Moving coil galvanometer, its sensitivity, conversion to ammeter and voltmeter", ["galvanometer", "sensitivity", "ammeter", "voltmeter"]),
("Current loop as a magnetic dipole and its magnetic dipole moment", ["magnetic dipole", "m = NIA"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
