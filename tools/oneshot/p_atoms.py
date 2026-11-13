from lib import F, X, T, sig, fx, build
import math

K9 = 9e9; e = 1.6e-19; R = 1.097e7

r1 = K9 * (2 * e) * (79 * e) / (7.7e6 * e)
E2 = -13.6 / 4; r2 = 0.529 * 4
l3 = 1 / (R * (1/4 - 1/9)) * 1e9
l4 = 1 / R * 1e9
n5 = 5 * 4 // 2
IE6 = 13.6 * 4
dE7 = 13.6 * (1 - 1/9); l7 = 1240 / dE7
rat8 = (1/4 - 1/9) / (1 - 1/4)

DOC = {
"slug": "atoms", "subject": "Physics",
"chapters": {"NEET": "Atoms", "JEE": "Atoms"},
"title": "Atoms", "readMinutes": 14,
"summary": [
"Rutherford ke alpha-scattering experiment se pata chala ki atom ka saara positive charge aur lagbhag saara mass ek bahut chhote nucleus (~10⁻¹⁵ m) mein hai; baaki atom zyaadatar khaali hai.",
"Rutherford model ki problem: ghoomta electron radiation karke nucleus mein gir jaana chahiye, aur spectrum continuous hona chahiye. Asal mein atom stable hai aur spectrum lines wala hai.",
"Bohr ne kaha: electron sirf kuch khaas orbits mein ghoom sakta hai jahaan L = nh/2π; un orbits mein wo radiate nahi karta. Ek orbit se doosre mein koodne par hi photon nikalta/absorb hota hai: hν = E_upper − E_lower.",
"Hydrogen-like atom (H, He⁺, Li²⁺) ke liye: r ∝ n²/Z, v ∝ Z/n, E ∝ −Z²/n². Inhi se poora hydrogen spectrum (Lyman, Balmer, Paschen…) nikal aata hai."
],
"formulas": [
F("Distance of closest approach", "r₀ = k (2e)(Ze) / K   (alpha ki KE = K, head-on)", "Alpha particle nucleus ke kitna paas aa sakta hai — nucleus ke size ki upper limit.", "Alpha ka charge 2e hai, e nahi."),
F("Impact parameter", "b = k Z e² cot(θ/2) / K   (alpha, KE = K);   b = 0 ⇒ θ = 180° (seedha wapas)", "Scattering angle aur impact parameter ka relation.", "Chhota b ⇒ bada θ."),
F("Rutherford scattering", "N(θ) ∝ 1 / sin⁴(θ/2)", "Kis angle par kitne alpha particles mudte hain.", "Bahut kam particles bade angle par mudte hain."),
F("Bohr's quantisation", "L = m v r = n h / 2π   (n = 1, 2, 3…)", "Allowed orbits ki shart."),
F("Radius of nth orbit", "rₙ = 0.529 n²/Z Å   (a₀ = 0.529 Å = 5.29 × 10⁻¹¹ m)", "Orbit ka size.", "r ∝ n²: n = 2 par 4 guna, n = 3 par 9 guna.", None, "PYQ favourite"),
F("Speed in nth orbit", "vₙ = 2.18 × 10⁶ Z/n m/s  (= cZ/(137n))", "Electron ki speed.", "v ∝ 1/n: upar ke orbit mein dheema."),
F("Energy of nth orbit", "Eₙ = −13.6 Z²/n² eV", "Kisi orbit ki total energy.", "Negative = bound. n = ∞ par E = 0.", None, "PYQ favourite"),
F("KE, PE and total energy", "KE = −E = +13.6Z²/n² eV,   PE = 2E = −27.2Z²/n² eV", "Energy ke hisse.", "Sab mein PE = −2 KE."),
F("Time period, frequency, current", "T ∝ n³/Z²,   f ∝ Z²/n³,   current I = ef ∝ Z²/n³", "Orbit mein electron ka chakkar.", None),
F("Photon in a transition", "hν = E_{n₂} − E_{n₁};   1/λ = R Z² (1/n₁² − 1/n₂²),   R = 1.097 × 10⁷ m⁻¹", "Spectral line ki wavelength.", "n₂ > n₁ hamesha; R wala formula hydrogen-like atoms ke liye hi."),
F("Spectral series of hydrogen", "Lyman n₁ = 1 (UV) · Balmer n₁ = 2 (visible) · Paschen n₁ = 3 (IR) · Brackett 4 (IR) · Pfund 5 (IR)", "Line kaun si series mein.", None, None, "Ratta"),
F("Series limits", "Shortest λ (series limit): n₂ = ∞ ⇒ 1/λ = RZ²/n₁².  Longest λ: n₂ = n₁ + 1", "Kisi series ki sabse chhoti/badi wavelength.", "Lyman limit = 1/R ≈ 91.2 nm."),
F("Number of spectral lines", "n se neeche aane par total lines = n(n − 1)/2", "Kitni alag lines dikhengi.", "Ek hi atom ek baar mein max (n − 1) lines deta hai."),
F("Ionisation and excitation energy", "Ionisation (ground se): 13.6 Z² eV.  H ki first excitation (1 → 2): 10.2 eV,  1 → 3: 12.09 eV", "Electron nikaalna / upar bhejna.", "Ionisation potential volt mein (13.6 V), energy eV mein."),
F("de Broglie view of Bohr orbit", "2π rₙ = n λ", "Bohr ki shart ka wave wala matlab: orbit mein poori waves fit hon."),
],
"examples": [
X("Alpha kitna paas aayega?", "7.7 MeV ka alpha particle gold (Z = 79) nucleus ki taraf seedha aata hai. Closest approach?",
  f"r₀ = k(2e)(79e)/K. K = 7.7 × 10⁶ × 1.6 × 10⁻¹⁹ J. r₀ = 9 × 10⁹ × 158 × 1.6 × 10⁻¹⁹ / 7.7 × 10⁶ ≈ {sig(r1)} m (≈ 30 fm). Nucleus isse bhi chhota hai.",
  [(sig(r1), "3.0 × 10⁻¹⁴")]),
X("Hydrogen n = 2", "H atom ka electron n = 2 mein hai. Energy, radius, KE, PE?",
  f"E = −13.6/4 = {fx(E2)} eV. r = 0.529 × 4 = {fx(r2,3)} Å. KE = +3.4 eV, PE = 2E = −6.8 eV.",
  [(fx(E2), "−3.4"), (fx(r2,3), "2.116")]),
X("Balmer ki pehli line (Hα)", "Hydrogen mein n = 3 → 2. Wavelength?",
  f"1/λ = R(1/4 − 1/9) = 5R/36 ⇒ λ = 36/(5 × 1.097 × 10⁷) m ≈ {fx(l3,0)} nm — laal rang.",
  [(fx(l3,0), "656")]),
X("Lyman series limit", "Lyman series ki sabse chhoti wavelength?",
  f"n₂ = ∞, n₁ = 1 ⇒ 1/λ = R ⇒ λ = 1/R ≈ {fx(l4,1)} nm (UV).",
  [(fx(l4,1), "91.2")]),
X("Kitni lines?", "Hydrogen atoms ka ek sample n = 5 tak excite kiya gaya. Emission mein kitni alag lines?",
  f"n(n − 1)/2 = 5 × 4/2 = {n5} lines.", [(str(n5), "10")]),
X("He⁺ ki ionisation energy", "He⁺ (Z = 2) ground state se electron nikaalne ki energy?",
  f"13.6 Z² = 13.6 × 4 = {fx(IE6)} eV.", [(fx(IE6), "54.4")]),
X("Transition 3 → 1", "Hydrogen mein n = 3 se n = 1. Photon energy aur wavelength?",
  f"ΔE = 13.6(1 − 1/9) = {fx(dE7)} eV. λ = 1240/{fx(dE7)} ≈ {fx(l7,1)} nm (Lyman, UV).",
  [(fx(dE7), "12.09"), (fx(l7,1), "102.6")]),
X("Lyman vs Balmer pehli line", "Lyman ki pehli line aur Balmer ki pehli line ki wavelengths ka ratio λ_L/λ_B?",
  f"1/λ_L = R(1 − 1/4) = 3R/4;  1/λ_B = 5R/36. λ_L/λ_B = (5/36)/(3/4) = 5/27 ≈ {fx(rat8,3)}.",
  [(fx(rat8,3), "0.185")]),
],
"topics": [
T("Alpha-particle scattering (Geiger–Marsden)", "Patli gold foil par alpha particles maare. Zyaadatar seedhe nikal gaye (atom khaali hai); kuch bade angle par mude; bahut kam (lagbhag 8000 mein se 1) 90° se zyada mude, kuch seedhe wapas bhi aaye — matlab chhota, bhaari, positive nucleus. Gold isliye ki bahut patla (pitkar) banta hai."),
T("Rutherford model aur uski kamiyaan", "Nucleus beech mein, electrons ghoomte hain (planetary model). Kamiyaan: accelerating charge radiation karega to electron spiral karke gir jaayega (atom unstable), aur spectrum continuous hona chahiye — jo nahi hota."),
T("Bohr ke teen postulates", "(1) Electron kuch stationary orbits mein bina radiation ke ghoomta hai. (2) Wo orbits jinmein L = nh/2π. (3) Orbit badalne par photon: hν = E_i − E_f. Bohr model sirf ek-electron wale atoms (H, He⁺, Li²⁺) par sahi kaam karta hai."),
T("Energy level diagram", "Levels upar jaate-jaate paas aate jaate hain (E ∝ −1/n²). Ground state n = 1 (−13.6 eV), first excited n = 2 (−3.4 eV), n = 3 (−1.51 eV), … n = ∞ (0 eV)."),
T("Hydrogen spectrum", "Emission spectrum = upar se neeche koodne par bright lines; absorption = neeche se upar, dark lines. Lyman UV mein, Balmer visible mein (Hα laal 656 nm), Paschen aur aage IR mein."),
T("Bohr model ki limitations", "Multi-electron atoms ka spectrum nahi samjha sakta, lines ki intensity nahi bata sakta, aur fine structure nahi samjhaata. Ye semi-classical model hai."),
T("Scaling with Z aur n", "r ∝ n²/Z, v ∝ Z/n, E ∝ Z²/n², T ∝ n³/Z², f ∝ Z²/n³. Ratio wale sawal inhi se ek line mein."),
],
"ratta": [
"Eₙ = −13.6 Z²/n² eV;  rₙ = 0.529 n²/Z Å;  vₙ = 2.18 × 10⁶ Z/n m/s.",
"KE = −E,  PE = 2E.",
"R = 1.097 × 10⁷ m⁻¹;  Lyman limit 91.2 nm;  Hα 656 nm.",
"Series: Lyman 1 (UV), Balmer 2 (visible), Paschen 3, Brackett 4, Pfund 5 (IR).",
"Lines = n(n − 1)/2.",
"H: ionisation 13.6 eV, first excitation 10.2 eV.  He⁺: 54.4 eV.",
"Closest approach r₀ = k(2e)(Ze)/K;  N(θ) ∝ 1/sin⁴(θ/2).",
],
}

SYLLABUS = [
("Alpha-particle scattering experiment", ["Alpha-particle scattering", "closest approach"]),
("Rutherford's model of atom", ["Rutherford model"]),
("Bohr model", ["Bohr", "L = m v r = n h / 2π"]),
("Energy levels", ["Energy level", "Eₙ = −13.6"]),
("Hydrogen spectrum", ["Hydrogen spectrum", "Lyman", "Balmer", "Paschen"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
