from lib import F, X, T, sig, fx, build
import math

lam = 600e-9
b1 = lam * 1 / 0.5e-3; y3b = 3 * b1; y3d = 2.5 * b1
b2 = b1 / (4 / 3)
r3 = ((1 + 2) / (2 - 1)) ** 2  # sqrt(I)=1, sqrt(4I)=2
ph4 = 2 * math.pi * 150 / 600; I4 = 4 * math.cos(ph4 / 2) ** 2  # in units of I0
w5 = 2 * 500e-9 * 2 / 0.2e-3; th5 = 500e-9 / 0.2e-3
tb6 = math.degrees(math.atan(math.sqrt(3))); r6 = 90 - tb6
I7 = 0.5 * math.cos(math.radians(60)) ** 2
N8 = (1.5 - 1) * 6e-6 / lam
v9 = 3e8 / 1.5; l9 = 600 / 1.5; f9 = 3e8 / 600e-9

DOC = {
"slug": "wave-optics", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Wave Optics", "JEE": "Wave Optics"},
"title": "Wave Optics", "readMinutes": 18,
"summary": [
"Wave optics light ko wave maan kar woh baatein samjhaata hai jo ray optics nahi kar sakta: interference, diffraction aur polarisation. Huygens ke anusaar wavefront ka har point ek naya source hai; inke secondary wavelets milkar agla wavefront banate hain — isi se reflection aur refraction ke niyam bhi nikalte hain.",
"Do coherent sources (same frequency, constant phase difference) ki waves milein to kahin bright (constructive) aur kahin dark (destructive) fringes — interference. Young's double slit mein fringe width β = λD/d.",
"Ek hi slit se bhi light thoda mudti hai aur pattern banta hai — diffraction. Central bright fringe sabse chaudi aur chamakdaar (width 2λD/a); pehla dark fringe a sinθ = λ par.",
"Light transverse wave hai, isliye polarise ho sakti hai. Polaroid sirf ek direction ka vibration jaane deta hai; do polaroids ke beech Malus' law I = I₀cos²θ. Reflection se bhi polarisation hota hai — Brewster angle par reflected light poori polarised."
],
"formulas": [
F("Path difference and phase difference", "Δφ = (2π/λ) Δx", "Interference mein point par condition.", "λ us medium ki wavelength lo jisme path hai (λ/n)."),
F("Resultant intensity of two waves", "I = I₁ + I₂ + 2√(I₁I₂) cosφ;   equal: I = 4I₀ cos²(φ/2)", "Do coherent waves ka jod.", "Incoherent sources mein sirf I₁ + I₂ — cos wala term nahi."),
F("Maxima and minima intensities", "I_max = (√I₁ + √I₂)²;   I_min = (√I₁ − √I₂)²;   I ∝ (amplitude)²", "Intensity ratio ke sawal.", "Amplitude ratio diya ho to pehle square karo — intensity ratio nahi hai."),
F("Constructive and destructive conditions", "Bright: Δx = nλ (φ = 2nπ);   dark: Δx = (2n − 1)λ/2", "Kis point par bright/dark.", "Dark ke liye (2n − 1)λ/2 hai, nλ/2 nahi."),
F("YDSE fringe width and positions", "β = λD/d;   nth bright: y = nλD/d;   nth dark: y = (2n − 1)λD/2d;   angular width = λ/d", "Young's double slit.", "D aur d mix mat karo: D screen ki doori (badi), d slits ki doori (chhoti).", None, "PYQ favourite"),
F("YDSE in a medium", "β' = β/n", "Poora setup paani/liquid mein.", "Fringe width ghatti hai, badhti nahi."),
F("Thin film in front of one slit", "Fringe shift = (n − 1)t D/d;   fringes shifted = (n − 1)t/λ", "Ek slit ke aage glass sheet.", "Pattern us slit ki taraf khisakta hai jahan sheet lagi hai; fringe width nahi badalti."),
F("Single-slit diffraction", "Minima: a sinθ = nλ;   central max angular width = 2λ/a;   linear width = 2λD/a", "Ek slit se diffraction.", "YDSE ka ulta: yahan a sinθ = nλ DARK deta hai, bright nahi.", None, "PYQ favourite"),
F("Huygens: refraction", "sin i / sin r = v₁/v₂ = n₂/n₁;   λ₂ = λ₁ v₂/v₁;   f same", "Wavefront se Snell's law.", "Medium badalne par frequency kabhi nahi badalti."),
F("Brewster's law", "tan θ_B = n;   θ_B + r = 90° (reflected ⊥ refracted)", "Reflection se polarisation.", "Brewster par reflected light poori polarised, refracted sirf partly."),
F("Malus' law", "I = I₀ cos²θ;   unpolarised light polaroid se: I₀/2", "Polaroids ke beech intensity.", "Pehle polaroid par unpolarised light aadhi hoti hai — cos² baad mein lagao."),
F("Coherent sources", "Same frequency + constant phase difference;   YDSE/Lloyd's mirror/biprism ek hi source se do banate hain", "Sustained interference ki shart.", "Do alag bulb kabhi coherent nahi hote — pattern turant badal jaata hai."),
],
"examples": [
X("YDSE ke numbers", "λ = 600 nm, d = 0.5 mm, D = 1 m. Fringe width, teesra bright aur teesra dark?",
  f"β = λD/d = 600 × 10⁻⁹ × 1 / 0.5 × 10⁻³ = {fx(b1*1e3)} mm. 3rd bright = 3β = {fx(y3b*1e3)} mm. 3rd dark = 2.5β = {fx(y3d*1e3)} mm.",
  [(fx(b1*1e3), "1.2"), (fx(y3b*1e3), "3.6"), (fx(y3d*1e3), "3")]),
X("Setup paani mein", "Upar wala setup paani (n = 4/3) mein daal diya. Naya fringe width?",
  f"β' = β/n = 1.2 × 3/4 = {fx(b2*1e3)} mm.", [(fx(b2*1e3), "0.9")]),
X("Intensity ratio", "Do coherent sources ki intensities I aur 4I. I_max : I_min?",
  f"Amplitudes 1 : 2. I_max = (1 + 2)² = 9I, I_min = (2 − 1)² = I ⇒ ratio = {fx(r3)} : 1.",
  [(fx(r3), "9")]),
X("Path difference se intensity", "Do barabar sources (I₀ each), λ = 600 nm, kisi point par path difference 150 nm. Intensity?",
  f"φ = 2π × 150/600 = π/2. I = 4I₀ cos²(π/4) = {fx(I4)}I₀ (max ka aadha).",
  [(fx(I4), "2")]),
X("Single slit", "a = 0.2 mm, λ = 500 nm, screen D = 2 m. Pehle minimum ka angle aur central max ki width?",
  f"sinθ ≈ θ = λ/a = {sig(th5)} rad. Width = 2λD/a = 2 × 500 × 10⁻⁹ × 2 / 0.2 × 10⁻³ = {fx(w5*1e3)} mm.",
  [(sig(th5), "2.5 × 10⁻³"), (fx(w5*1e3), "10")]),
X("Brewster angle", "n = √3 wali glass ka Brewster angle aur us waqt refraction angle?",
  f"tanθ_B = √3 ⇒ θ_B = {fx(tb6)}°. r = 90° − 60° = {fx(r6)}°.",
  [(fx(tb6), "60"), (fx(r6), "30")]),
X("Do polaroids", "Unpolarised light I₀ do polaroids se guzarti hai jinke axes ke beech 60°. Final intensity?",
  f"Pehle ke baad I₀/2. Doosre ke baad (I₀/2)cos²60° = (I₀/2)(1/4) = {fx(I7,3)}I₀ (12.5%).",
  [(fx(I7,3), "0.125")]),
X("Glass sheet se fringe shift", "YDSE mein ek slit ke aage 6 μm moti glass sheet (n = 1.5), λ = 600 nm. Kitne fringes khiskenge?",
  f"N = (n − 1)t/λ = 0.5 × 6 × 10⁻⁶ / 600 × 10⁻⁹ = {fx(N8)} fringes, sheet wali slit ki taraf.",
  [(fx(N8), "5")]),
X("Glass mein light", "600 nm (hawa) light glass (n = 1.5) mein jaati hai. Speed, wavelength, frequency?",
  f"v = c/n = {sig(v9)} m/s. λ = 600/1.5 = {fx(l9)} nm. f = c/λ_air = {sig(f9)} Hz — dono media mein same.",
  [(sig(v9), "2.0 × 10⁸"), (fx(l9), "400"), (sig(f9), "5.0 × 10¹⁴")]),
],
"topics": [
T("Wavefront and Huygens' principle", "Wavefront = same phase wale points ki surface (point source se spherical, door se plane). Huygens: wavefront ka har point secondary wavelet chhodta hai; un sabko chhoone wali surface naya wavefront. Ray hamesha wavefront ke perpendicular."),
T("Huygens se reflection aur refraction", "Plane wavefront surface par tircha pahunche to har point par wavelet banta hai. Same medium mein wavelets same speed se ⇒ i = r (reflection). Doosre medium mein speed v₂ ⇒ sin i/sin r = v₁/v₂ (Snell's law). Isse pata chala ki ghane medium mein light dheemi hai (Newton ki corpuscular theory ulta kehti thi)."),
T("Coherent sources and sustained interference", "Stable pattern ke liye sources coherent hon (same f, constant phase), amplitudes lagbhag barabar, slits patli aur paas. Do alag bulb coherent nahi — unka phase har 10⁻⁸ s mein random badalta hai."),
T("Young's double slit experiment", "Ek source ki light do patli slits se do coherent sources banati hai. Screen par barabar chaudai ke bright-dark fringes; centre bright. White light se centre white aur baaki coloured fringes. Energy nashat nahi hoti — sirf redistribute hoti hai."),
T("Diffraction due to a single slit", "Slit ka har hissa wavelet bhejta hai; θ par jab slit ke do aadhe hisson ka path difference λ/2 ho, sab cancel ⇒ a sinθ = λ par pehla dark. Central max baaki sabse do guna chauda. Slit patli karo to pattern failta hai."),
T("Interference vs diffraction", "Interference: do (ya zyada) alag wavefronts, sab fringes barabar chaudi aur lagbhag barabar bright. Diffraction: ek hi wavefront ke hisse, central fringe chaudi aur sabse bright, baaki dheere-dheere fade."),
T("Polarisation and its uses", "Light transverse hai — vibrations ek plane mein seemit kiye ja sakte hain. Polaroid, reflection (Brewster), scattering (aasmaan ki light partly polarised) se polarisation. Uses: sunglasses (glare kam), 3D movie glasses, LCD screens, stress analysis, camera filters."),
],
"ratta": [
"β = λD/d;  bright nλD/d, dark (2n − 1)λD/2d.",
"I = 4I₀cos²(φ/2);  I_max/I_min = [(√I₁ + √I₂)/(√I₁ − √I₂)]².",
"Medium mein β' = β/n.",
"Film shift: N = (n − 1)t/λ.",
"Single slit dark: a sinθ = nλ;  central width 2λD/a.",
"Brewster tanθ_B = n;  θ_B + r = 90°.",
"Malus I = I₀cos²θ;  unpolarised → I₀/2.",
"Medium badle: f same, v aur λ ghatte hain.",
],
}

SYLLABUS = [
("Wavefront and Huygens' principle", ["Wavefront", "Huygens"]),
("Laws of reflection and refraction using Huygens' principle", ["Huygens se reflection aur refraction"]),
("Interference", ["interference"]),
("Young's double-slit experiment and expression for fringe width", ["Young's double slit", "β = λD/d"]),
("Coherent sources and sustained interference of light", ["Coherent sources", "sustained interference"]),
("Diffraction due to a single slit, width of central maximum", ["Single-slit diffraction", "central max"]),
("Polarization, plane-polarized light, Brewster's law, uses, Polaroid", ["Polarisation", "Brewster's law", "Polaroid", "Uses"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
