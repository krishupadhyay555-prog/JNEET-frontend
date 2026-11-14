from lib import F, X, T, sig, fx, build
import math

u = 1.66e-27; R0 = 1.2e-15; c = 3e8; NA = 6.022e23

r1 = 1.2 * 27 ** (1/3); r1b = r1 * (125/27) ** (1/3)
rho2 = 3 * u / (4 * math.pi * R0 ** 3)
dm3 = 2 * 1.007825 + 2 * 1.008665 - 4.002603; be3 = dm3 * 931.5; bea3 = be3 / 4
E4 = 1e-3 * c ** 2
N5 = 1000 / 235 * NA; E5 = N5 * 200 * 1.6e-13
dm6 = 2 * 2.014102 - (3.016029 + 1.008665); Q6 = dm6 * 931.5
Q7 = 240 * (8.5 - 7.6)

DOC = {
"slug": "nuclei", "subject": "Physics",
"chapters": {"NEET": "Nuclei", "JEE": "Nuclei"},
"title": "Nuclei", "readMinutes": 12,
"summary": [
"Nucleus protons (Z) aur neutrons (N) se bana hai; A = Z + N mass number. Iska size A^{1/3} ke saath badhta hai, isliye har nucleus ki density lagbhag same (~2.3 × 10¹⁷ kg/m³) hoti hai.",
"Nucleus ka mass uske protons + neutrons ke alag-alag mass se KAM hota hai. Ye kami (mass defect) E = mc² se binding energy ban jaati hai — nucleus ko todne ke liye itni energy chahiye.",
"Binding energy per nucleon (BE/A) stability ka naap hai. Ye A ≈ 56 (iron) ke paas sabse zyada (~8.8 MeV) hai. Isliye bhaari nucleus tootne (fission) aur halke nuclei judne (fusion) — dono mein energy nikalti hai.",
"Nuclear force bahut strong, short-range (~2–3 fm), charge-independent aur attractive hai (bahut paas jaane par repulsive)."
],
"formulas": [
F("Notation and composition", "ᴬ_Z X:  Z = protons,  N = A − Z = neutrons", "Kisi nucleus mein kya-kya hai."),
F("Nuclear radius", "R = R₀ A^{1/3},   R₀ ≈ 1.2 fm (1 fm = 10⁻¹⁵ m)", "Nucleus ka size.", "R ∝ A^{1/3}, volume ∝ A.", None, "PYQ favourite"),
F("Nuclear density", "ρ = 3 m_u / (4π R₀³) ≈ 2.3 × 10¹⁷ kg/m³  (A se independent)", "Density wale sawal.", "Har nucleus ki density same — A badhne se nahi badalti."),
F("Atomic mass unit", "1 u = 1/12 × (¹²C atom ka mass) = 1.66 × 10⁻²⁷ kg ≡ 931.5 MeV/c²", "Mass ko energy mein badalna.", "1 u × c² = 931.5 MeV seedha use karo."),
F("Mass–energy relation", "E = m c²", "Mass ka energy mein badalna (aur ulta).", "c = 3 × 10⁸ m/s; mass kg mein."),
F("Mass defect", "Δm = [Z m_p + (A − Z) m_n] − M_nucleus   (atomic masses ho to m_p ki jagah m_H lo)", "Nucleus banne mein kitna mass 'gaya'.", "Atomic mass mein electrons bhi hote hain — dono taraf same rakho."),
F("Binding energy", "BE = Δm c² = Δm (u) × 931.5 MeV", "Nucleus ko poori tarah todne ki energy.", None, "MeV", "PYQ favourite"),
F("Binding energy per nucleon", "BE/A;   peak ≈ 8.8 MeV near A ≈ 56;   ≈ 8 MeV for 30 < A < 170", "Kaun sa nucleus zyada stable.", "Zyada BE/A = zyada stable (total BE nahi)."),
F("Q-value of a reaction", "Q = (Σ m_reactants − Σ m_products) c² = Σ BE_products − Σ BE_reactants", "Reaction mein energy nikli ya lagi.", "Q > 0 exothermic (energy release), Q < 0 endothermic."),
F("Nuclear fission", "²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n + ≈ 200 MeV", "Bhaari nucleus ka toot-na.", "Ek fission mein ~200 MeV, yaani ~0.9 MeV per nucleon."),
F("Nuclear fusion", "Sun: 4 ¹H → ⁴He + 2e⁺ + 2ν + 26.7 MeV;   ²H + ²H → ³He + n + 3.27 MeV", "Halke nuclei ka judna.", "Bahut zyada temperature (~10⁷ K) chahiye taaki Coulomb repulsion paar ho."),
],
"examples": [
X("Nucleus ka size", "²⁷Al ka radius? ¹²⁵Te ka radius kitna guna?",
  f"R = 1.2 × 27^{{1/3}} = 1.2 × 3 = {fx(r1)} fm. Te: (125/27)^{{1/3}} = 5/3 guna ⇒ {fx(r1b)} fm.",
  [(fx(r1), "3.6"), (fx(r1b), "6")]),
X("Nuclear density", "Nuclear matter ki density nikaalo (m_u = 1.66 × 10⁻²⁷ kg, R₀ = 1.2 fm).",
  f"ρ = A m_u / (4/3 π R₀³ A) = 3 m_u/(4πR₀³) ≈ {sig(rho2)} kg/m³ — paani se ~10¹⁴ guna zyada, aur A par depend nahi.",
  [(sig(rho2), "2.3 × 10¹⁷")]),
X("Helium-4 ki binding energy", "m(¹H) = 1.007825 u, m_n = 1.008665 u, m(⁴He atom) = 4.002603 u. BE aur BE/A?",
  f"Δm = 2(1.007825) + 2(1.008665) − 4.002603 = {fx(dm3,6)} u. BE = {fx(dm3,6)} × 931.5 ≈ {fx(be3,1)} MeV. BE/A ≈ {fx(bea3,2)} MeV — He-4 bahut stable hai.",
  [(fx(dm3,6), "0.030377"), (fx(be3,1), "28.3"), (fx(bea3,2), "7.07")]),
X("1 g mass ki energy", "1 g mass poora energy mein badal jaaye to?",
  f"E = mc² = 10⁻³ × (3 × 10⁸)² = {sig(E4)} J — ek bade sheher ki kai dino ki bijli.",
  [(sig(E4), "9.0 × 10¹³")]),
X("1 kg U-235 ka fission", "Har fission 200 MeV de. 1 kg ²³⁵U se kitni energy?",
  f"Nuclei = (1000/235) × 6.022 × 10²³ ≈ {sig(N5,3)}. E = {sig(N5,3)} × 200 × 1.6 × 10⁻¹³ J ≈ {sig(E5)} J.",
  [(sig(N5,3), "2.56 × 10²⁴"), (sig(E5), "8.2 × 10¹³")]),
X("D–D fusion ka Q-value", "²H = 2.014102 u, ³He = 3.016029 u, n = 1.008665 u. ²H + ²H → ³He + n ka Q?",
  f"Δm = 2(2.014102) − (3.016029 + 1.008665) = {fx(dm6,5)} u. Q = {fx(dm6,5)} × 931.5 ≈ {fx(Q6,2)} MeV (energy nikli).",
  [(fx(dm6,5), "0.00351"), (fx(Q6,2), "3.27")]),
X("BE/A se fission energy", "A = 240 (BE/A = 7.6 MeV) wala nucleus do A = 120 (BE/A = 8.5 MeV) nuclei mein toot-ta hai. Energy?",
  f"Q = BE_products − BE_reactant = 240 × 8.5 − 240 × 7.6 = 240 × 0.9 = {fx(Q7)} MeV.",
  [(fx(Q7), "216")]),
],
"topics": [
T("Nucleus ki banawat", "Protons + neutrons = nucleons. Same Z, alag A wale atoms (jaise ¹H, ²H, ³H) chemically same hote hain. Nucleus ka size ~fm (10⁻¹⁵ m), atom ka ~Å (10⁻¹⁰ m) — atom nucleus se ~10⁵ guna bada."),
T("Atomic masses aur mass spectrometer", "Atomic masses u mein naapi jaati hain (¹²C = exactly 12 u). Ye masses whole numbers nahi hote — yahi chhota farak mass defect ka raaz hai."),
T("Mass defect se binding energy", "Nucleons ko jodne par kuch mass energy ban kar nikal jaata hai. Wahi energy wapas do to nucleus toot-ta hai. Isliye BE = Δm c²."),
T("BE/A curve", "A chhota: BE/A tezi se badhta hai (He-4 ek peak). A ≈ 56 (Fe) par maximum ~8.8 MeV. A bada: dheere ghat-ta hai (U ~7.6 MeV). Curve ka matlab: beech ke nuclei sabse stable; bhaari ke liye fission, halke ke liye fusion energy deta hai."),
T("Nuclear force ke gun", "Sabse strong force (Coulomb se ~100 guna), bahut short range (~2–3 fm), p-p, n-n, p-n mein barabar (charge-independent), saturate hoti hai (har nucleon sirf paas wale padosiyon se judta hai) — isliye BE/A lagbhag constant hai."),
T("Fission aur chain reaction", "Slow neutron ²³⁵U ko todta hai, 2–3 naye neutrons nikalte hain jo aur fission karte hain. Controlled chain reaction = nuclear reactor (moderator neutrons dheeme karta hai, control rods (Cd/B) neutrons sokhte hain). Uncontrolled = atom bomb."),
T("Fusion aur taare", "Halke nuclei judkar bhaari nucleus — per unit mass fission se zyada energy. Positive nuclei ko paas laane ke liye bahut garmi chahiye (thermonuclear). Sooraj ki energy hydrogen ke helium mein fusion se aati hai."),
T("Syllabus note", "Radioactivity (alpha, beta, gamma ke gun aur decay law, half-life) aur isotopes/isobars/isotones ki definitions JEE Main aur NEET dono ke current (2024 se revised) syllabus se hata di gayi hain. Is chapter ka focus: size, density, mass defect, binding energy, BE/A curve, fission, fusion."),
],
"ratta": [
"R = 1.2 A^{1/3} fm;  ρ ≈ 2.3 × 10¹⁷ kg/m³ (sabka same).",
"1 u = 1.66 × 10⁻²⁷ kg = 931.5 MeV/c².",
"BE = Δm × 931.5 MeV;  zyada BE/A = zyada stable.",
"BE/A max ≈ 8.8 MeV at A ≈ 56 (Fe).",
"Fission ≈ 200 MeV per ²³⁵U;  sun fusion 26.7 MeV per He-4.",
"Q = BE(products) − BE(reactants).",
"Nuclear force: strong, short-range, charge-independent, saturating.",
],
}

SYLLABUS = [
("Composition and size of nucleus", ["protons", "neutrons", "R = R₀ A^{1/3}"]),
("Atomic masses", ["Atomic masses", "Atomic mass unit"]),
("Mass-energy relation", ["E = m c²"]),
("Mass defect", ["Mass defect"]),
("Binding energy per nucleon and its variation with mass number", ["Binding energy per nucleon", "BE/A curve"]),
("Nuclear fission", ["fission"]),
("Nuclear fusion", ["fusion"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
