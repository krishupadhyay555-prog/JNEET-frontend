from lib import F, X, T, sig, fx, build
import math

h = 6.63e-34; c = 3e8; e = 1.6e-19; me = 9.11e-31; HC = 1240  # eV·nm

E1 = HC / 500
E2 = HC / 400; K2 = E2 - 2.0
l3 = HC / 2.48
Eph4 = h * c / 662e-9; N4 = 2 / Eph4
l5 = 1.227 / math.sqrt(100)
r6 = math.sqrt(4 * 2)
l7 = h / (0.1 * 10)
h8 = e * (1.33 - 0.5) / (8.0e14 - 6.0e14); nu0 = 6.0e14 - 0.5 * (8.0e14 - 6.0e14) / (1.33 - 0.5)
F9 = 2 * 3 / c

DOC = {
"slug": "dual-nature-of-radiation-and-matter", "subject": "Physics",
"chapters": {"NEET": "Dual Nature of Radiation and Matter", "JEE": "Dual Nature of Radiation and Matter"},
"title": "Dual Nature of Radiation and Matter", "readMinutes": 15,
"summary": [
"Light kabhi wave ki tarah behave karti hai (interference, diffraction) aur kabhi particle (photon) ki tarah. Photoelectric effect ne dikhaya ki light energy packets mein aati hai: har photon ki energy E = hν.",
"Metal se electron nikalne ke liye kam se kam work function φ jitni energy chahiye. Ek photon ek electron ko energy deta hai: bachi hui energy electron ki max KE banti hai — K_max = hν − φ (Einstein).",
"Frequency threshold ν₀ se kam ho to kitni bhi tez light ho, electron nahi niklega. Intensity badhane se sirf electrons ki GINTI (current) badhti hai, unki max KE nahi.",
"Ulta bhi sach hai: chalte hue particles (electron, proton) bhi wave ki tarah behave karte hain — de Broglie wavelength λ = h/p. Electron diffraction (Davisson–Germer) ne isse prove kiya."
],
"formulas": [
F("Photon energy", "E = hν = hc/λ;   E (eV) ≈ 1240 / λ (nm)", "Photon ki energy; eV mein jaldi calculation.", "λ ko nm mein daalo tabhi 1240 wala shortcut chalega.", "J ya eV"),
F("Photon momentum", "p = h/λ = E/c", "Photon ka momentum, radiation pressure.", "Photon ka rest mass zero, phir bhi momentum hota hai."),
F("Number of photons", "N (per second) = P / (hν) = P λ / (hc)", "Source ki power se photons per second.", None, "s⁻¹"),
F("Work function and threshold", "φ = hν₀ = hc/λ₀", "Metal ki threshold frequency / wavelength.", "ν > ν₀ (ya λ < λ₀) tabhi emission."),
F("Einstein's photoelectric equation", "K_max = ½mv²_max = hν − φ = h(ν − ν₀)", "Nikle electron ki maximum KE.", "Ye MAXIMUM KE hai; kai electrons ki KE isse kam hoti hai.", None, "PYQ favourite"),
F("Stopping potential", "eV₀ = K_max ⇒ V₀ = (h/e)ν − φ/e", "Photocurrent zero karne wala reverse voltage.", "V₀ intensity par depend nahi karta, sirf ν aur metal par."),
F("V₀ vs ν graph", "Seedhi line: slope = h/e (har metal ke liye same),  x-intercept = ν₀,  y-intercept = −φ/e", "Graph wale sawal, h nikalna.", None, None, "PYQ favourite"),
F("Radiation force on a surface", "Poori tarah absorb: F = P/c.   Poori tarah reflect (normal incidence): F = 2P/c", "Light se lagne wala force/pressure.", "Pressure = intensity/c (absorb), 2I/c (reflect)."),
F("de Broglie wavelength", "λ = h/p = h/(mv) = h/√(2mK)", "Kisi bhi moving particle ki wavelength.", "K non-relativistic maana gaya hai."),
F("Charged particle through potential V", "λ = h/√(2mqV);   electron: λ ≈ 1.227/√V nm = 12.27/√V Å", "Accelerated electron/proton/alpha.", None, None, "PYQ favourite"),
F("Thermal particles", "λ = h/√(3mk_BT)   (K = (3/2)k_BT)", "Gas molecules / thermal neutrons temperature T par."),
F("Ratios to remember", "Same K: λ ∝ 1/√m.   Same V: λ ∝ 1/√(mq).   Same speed: λ ∝ 1/m.   Same p: λ same", "Do particles ki wavelength compare karna."),
],
"examples": [
X("Green photon ki energy", "λ = 500 nm wale photon ki energy eV mein?",
  f"E = 1240/500 = {fx(E1)} eV (≈ 4.0 × 10⁻¹⁹ J).", [(fx(E1), "2.48")]),
X("Photoelectric: K_max aur V₀", "φ = 2.0 eV wale metal par λ = 400 nm ki light. K_max aur stopping potential?",
  f"hν = 1240/400 = {fx(E2)} eV. K_max = {fx(E2)} − 2.0 = {fx(K2)} eV. V₀ = K_max/e = {fx(K2)} V.",
  [(fx(E2), "3.1"), (fx(K2), "1.1")]),
X("Threshold wavelength", "Kisi metal ka φ = 2.48 eV. Threshold wavelength?",
  f"λ₀ = 1240/φ = 1240/2.48 = {fx(l3)} nm. Isse lambi wavelength (laal light) se emission nahi hoga.",
  [(fx(l3), "500")]),
X("Kitne photons per second?", "2 W ka source λ = 662 nm emit karta hai. Photons per second? (h = 6.63 × 10⁻³⁴ J·s)",
  f"Ek photon = hc/λ = 6.63 × 10⁻³⁴ × 3 × 10⁸ / 662 × 10⁻⁹ = {sig(Eph4)} J. N = 2/{sig(Eph4)} ≈ {sig(N4)} per second.",
  [(sig(Eph4), "3.0 × 10⁻¹⁹"), (sig(N4), "6.7 × 10¹⁸")]),
X("Graph se h aur ν₀", "Ek metal par ν = 6.0 × 10¹⁴ Hz se V₀ = 0.50 V aur ν = 8.0 × 10¹⁴ Hz se V₀ = 1.33 V. h aur threshold frequency?",
  f"Slope h/e = (1.33 − 0.50)/(2.0 × 10¹⁴) ⇒ h = 1.6 × 10⁻¹⁹ × 0.83 / 2.0 × 10¹⁴ = {sig(h8,3)} J·s. ν₀: V₀ = 0 wala point ⇒ ν₀ = 6.0 × 10¹⁴ − 0.50/(slope) = {sig(nu0)} Hz.",
  [(sig(h8,3), "6.64 × 10⁻³⁴"), (sig(nu0), "4.8 × 10¹⁴")]),
X("Electron ki de Broglie wavelength", "Electron rest se 100 V par accelerate hota hai. λ?",
  f"λ = 1.227/√100 nm = {fx(l5,3)} nm — X-ray jitni, isliye crystal se electron diffraction hota hai.",
  [(fx(l5,3), "0.123")]),
X("Proton vs alpha, same V", "Proton aur alpha particle same potential V se accelerate. λ_p : λ_α?",
  f"λ ∝ 1/√(mq). m_α = 4m_p, q_α = 2e ⇒ λ_p/λ_α = √(4 × 2) = 2√2 ≈ {fx(r6)}.",
  [(fx(r6), "2.83")]),
X("Cricket ball ki wavelength", "0.1 kg ki ball 10 m/s se. de Broglie λ?",
  f"λ = h/(mv) = 6.63 × 10⁻³⁴ / 1 = {sig(l7)} m — itni chhoti ki koi slit/atom isse diffract nahi kar sakta. Isliye bade objects mein wave nature dikhta nahi.",
  [(sig(l7), "6.6 × 10⁻³⁴")]),
X("Light ka dhakka", "3 W ki light ek perfectly reflecting mirror par seedhi (normal) padti hai. Force?",
  f"F = 2P/c = 2 × 3 / 3 × 10⁸ = {sig(F9)} N. Absorb karne wali surface par isse aadha.",
  [(sig(F9), "2.0 × 10⁻⁸")]),
],
"topics": [
T("Hertz aur Lenard ke observations", "Hertz ne dekha ki UV light padne par spark gap mein spark aasani se banta hai. Lenard ne dikhaya ki UV light metal plate se negatively charged particles (electrons) nikaalti hai aur circuit mein current chalta hai — yahi photoelectric effect hai."),
T("Photoelectric effect ke 4 niyam", "(1) Har metal ki threshold frequency ν₀; usse kam par emission zero, intensity kitni bhi ho. (2) Emission turant hota hai (~10⁻⁹ s), koi delay nahi. (3) K_max frequency ke saath linearly badhta hai, intensity se independent. (4) Photocurrent (saturation current) intensity ke proportional hai."),
T("Wave theory kyun fail hui", "Wave theory kehti thi ki tez (zyada intensity) light zyada energy degi aur kam frequency par bhi kuch der baad electron nikal aayega. Experiment mein na threshold samjha, na turant emission. Photon model (ek photon → ek electron) ne teeno baatein samjha di."),
T("Photon ke gun", "Energy hν, momentum h/λ, speed c, rest mass zero, charge zero. Intensity badhne ka matlab zyada photons, har photon ki energy wahi. Photon-electron collision mein energy aur momentum dono conserve."),
T("Graphs (current vs voltage)", "Same frequency, alag intensity: saturation current alag, stopping potential SAME. Same intensity, alag frequency: zyada ν par stopping potential zyada (zyada negative), saturation current lagbhag same. K_max vs ν: seedhi line, slope h, x-intercept ν₀."),
T("de Broglie hypothesis", "Agar light (wave) particle ki tarah behave kar sakti hai to particle bhi wave ki tarah. λ = h/p. Bade objects ki λ bahut chhoti, isliye sirf electron jaise halke particles mein wave nature dikhta hai."),
T("Davisson–Germer experiment", "Nickel crystal par 54 V ke electrons maare; 50° par strong peak mila — electron diffraction. Naapi gayi λ ≈ 0.165 nm, de Broglie formula ke 0.167 nm se match. Matter waves ka pehla proof. Experiment ki details ab syllabus mein nahi — sirf conclusion yaad rakho."),
T("Wave–particle duality", "Radiation aur matter dono dual hain. Ek hi experiment mein ek hi roop dikhta hai: interference/diffraction mein wave, photoelectric/Compton mein particle."),
],
"ratta": [
"hc = 1240 eV·nm  ⇒  E(eV) = 1240/λ(nm).",
"h = 6.63 × 10⁻³⁴ J·s,  h/e = 4.14 × 10⁻¹⁵ V·s.",
"K_max = hν − φ = eV₀.  Intensity → current; frequency → K_max.",
"V₀–ν graph slope = h/e (har metal same); intercept = ν₀.",
"Electron: λ = 12.27/√V Å.  λ = h/√(2mK) = h/√(2mqV).",
"Same V: λ_p : λ_α = 2√2 : 1.",
"Radiation force: absorb P/c,  reflect 2P/c.",
"Davisson–Germer: 54 V, 50°, Ni crystal, λ ≈ 0.165 nm.",
],
}

SYLLABUS = [
("Dual nature of radiation", ["wave", "particle"]),
("Photoelectric effect", ["photoelectric effect", "threshold"]),
("Hertz and Lenard's observations", ["Hertz", "Lenard"]),
("Einstein's photoelectric equation", ["Einstein", "K_max = ½mv²_max = hν − φ"]),
("Particle nature of light", ["photon"]),
("Matter waves — wave nature of particle", ["Matter waves", "Davisson"]),
("de Broglie relation", ["de Broglie", "λ = h/p"]),
]

DOC_EN = {
"slug": "dual-nature-of-radiation-and-matter", "subject": "Physics",
"chapters": {"NEET": "Dual Nature of Radiation and Matter", "JEE": "Dual Nature of Radiation and Matter"},
"title": "Dual Nature of Radiation and Matter", "readMinutes": 15,
"summary": [
"Light sometimes behaves as a wave (interference, diffraction) and sometimes as a particle (photon). The photoelectric effect showed that light comes in energy packets: each photon has energy E = hν.",
"To eject an electron from a metal you need at least the work function φ. One photon gives its energy to one electron; what is left becomes the electron's maximum KE — K_max = hν − φ (Einstein).",
"If the frequency is below the threshold ν₀, no electron comes out however bright the light is. Increasing intensity increases only the NUMBER of electrons (the current), not their maximum KE.",
"The reverse is also true: moving particles (electrons, protons) behave like waves — de Broglie wavelength λ = h/p. Electron diffraction (Davisson–Germer) proved it.",
],
"formulas": [
F("Photon energy", "E = hν = hc/λ;   E (eV) ≈ 1240 / λ (nm)", "Photon energy; quick eV calculation.", "The 1240 shortcut works only with λ in nm.", "J or eV"),
F("Photon momentum", "p = h/λ = E/c", "Photon momentum, radiation pressure.", "A photon has zero rest mass but still has momentum."),
F("Number of photons", "N (per second) = P / (hν) = P λ / (hc)", "Photons per second from a source of power P.", None, "s⁻¹"),
F("Work function and threshold", "φ = hν₀ = hc/λ₀", "Threshold frequency / wavelength of a metal.", "Emission only if ν > ν₀ (or λ < λ₀)."),
F("Einstein's photoelectric equation", "K_max = ½mv²_max = hν − φ = h(ν − ν₀)", "Maximum KE of emitted electrons.", "This is the MAXIMUM KE; many electrons come out with less.", None, "PYQ favourite"),
F("Stopping potential", "eV₀ = K_max ⇒ V₀ = (h/e)ν − φ/e", "Reverse voltage that makes the photocurrent zero.", "V₀ does not depend on intensity, only on ν and the metal."),
F("V₀ vs ν graph", "Straight line: slope = h/e (same for every metal),  x-intercept = ν₀,  y-intercept = −φ/e", "Graph questions, finding h.", None, None, "PYQ favourite"),
F("Radiation force on a surface", "Fully absorbing: F = P/c.   Fully reflecting (normal incidence): F = 2P/c", "Force/pressure due to light.", "Pressure = intensity/c (absorbing), 2I/c (reflecting)."),
F("de Broglie wavelength", "λ = h/p = h/(mv) = h/√(2mK)", "Wavelength of any moving particle.", "K is taken as non-relativistic."),
F("Charged particle through potential V", "λ = h/√(2mqV);   electron: λ ≈ 1.227/√V nm = 12.27/√V Å", "Accelerated electron/proton/alpha.", None, None, "PYQ favourite"),
F("Thermal particles", "λ = h/√(3mk_BT)   (K = (3/2)k_BT)", "Gas molecules / thermal neutrons at temperature T."),
F("Ratios to remember", "Same K: λ ∝ 1/√m.   Same V: λ ∝ 1/√(mq).   Same speed: λ ∝ 1/m.   Same p: same λ", "Comparing wavelengths of two particles."),
],
"examples": [
X("Energy of a green photon", "Energy of a photon of λ = 500 nm in eV?",
  f"E = 1240/500 = {fx(E1)} eV (≈ 4.0 × 10⁻¹⁹ J).", [(fx(E1), "2.48")]),
X("Photoelectric: K_max and V₀", "Light of λ = 400 nm falls on a metal with φ = 2.0 eV. K_max and stopping potential?",
  f"hν = 1240/400 = {fx(E2)} eV. K_max = {fx(E2)} − 2.0 = {fx(K2)} eV. V₀ = K_max/e = {fx(K2)} V.",
  [(fx(E2), "3.1"), (fx(K2), "1.1")]),
X("Threshold wavelength", "A metal has φ = 2.48 eV. Threshold wavelength?",
  f"λ₀ = 1240/φ = 1240/2.48 = {fx(l3)} nm. Longer wavelengths (red light) cause no emission.",
  [(fx(l3), "500")]),
X("How many photons per second?", "A 2 W source emits λ = 662 nm. Photons per second? (h = 6.63 × 10⁻³⁴ J·s)",
  f"One photon = hc/λ = 6.63 × 10⁻³⁴ × 3 × 10⁸ / 662 × 10⁻⁹ = {sig(Eph4)} J. N = 2/{sig(Eph4)} ≈ {sig(N4)} per second.",
  [(sig(Eph4), "3.0 × 10⁻¹⁹"), (sig(N4), "6.7 × 10¹⁸")]),
X("h and ν₀ from the graph", "For a metal, ν = 6.0 × 10¹⁴ Hz gives V₀ = 0.50 V and ν = 8.0 × 10¹⁴ Hz gives V₀ = 1.33 V. Find h and the threshold frequency.",
  f"Slope h/e = (1.33 − 0.50)/(2.0 × 10¹⁴) ⇒ h = 1.6 × 10⁻¹⁹ × 0.83 / 2.0 × 10¹⁴ = {sig(h8,3)} J·s. ν₀ is where V₀ = 0 ⇒ ν₀ = 6.0 × 10¹⁴ − 0.50/(slope) = {sig(nu0)} Hz.",
  [(sig(h8,3), "6.64 × 10⁻³⁴"), (sig(nu0), "4.8 × 10¹⁴")]),
X("de Broglie wavelength of an electron", "An electron is accelerated from rest through 100 V. λ?",
  f"λ = 1.227/√100 nm = {fx(l5,3)} nm — similar to X-rays, which is why crystals diffract electrons.",
  [(fx(l5,3), "0.123")]),
X("Proton vs alpha, same V", "A proton and an alpha particle are accelerated through the same V. λ_p : λ_α?",
  f"λ ∝ 1/√(mq). m_α = 4m_p, q_α = 2e ⇒ λ_p/λ_α = √(4 × 2) = 2√2 ≈ {fx(r6)}.",
  [(fx(r6), "2.83")]),
X("Wavelength of a cricket ball", "A 0.1 kg ball moves at 10 m/s. de Broglie λ?",
  f"λ = h/(mv) = 6.63 × 10⁻³⁴ / 1 = {sig(l7)} m — so tiny that no slit or atom can diffract it. That is why wave nature is not seen for large objects.",
  [(sig(l7), "6.6 × 10⁻³⁴")]),
X("Push of light", "3 W of light falls normally on a perfectly reflecting mirror. Force?",
  f"F = 2P/c = 2 × 3 / 3 × 10⁸ = {sig(F9)} N. On an absorbing surface it would be half.",
  [(sig(F9), "2.0 × 10⁻⁸")]),
],
"topics": [
T("Hertz and Lenard's observations", "Hertz noticed that sparks jump more easily across a spark gap when UV light falls on it. Lenard showed that UV light ejects negatively charged particles (electrons) from a metal plate and a current flows in the circuit — the photoelectric effect."),
T("Four laws of the photoelectric effect", "(1) Each metal has a threshold frequency ν₀; below it no emission occurs, whatever the intensity. (2) Emission is instantaneous (~10⁻⁹ s), with no delay. (3) K_max increases linearly with frequency and is independent of intensity. (4) The photocurrent (saturation current) is proportional to intensity."),
T("Why the wave theory failed", "Wave theory predicted that brighter light would give more energy and that even low-frequency light would eject electrons after some delay. It could explain neither the threshold nor instantaneous emission. The photon model (one photon → one electron) explained all of these."),
T("Properties of photons", "Energy hν, momentum h/λ, speed c, zero rest mass, zero charge. Higher intensity means more photons, each with the same energy. In photon–electron collisions both energy and momentum are conserved."),
T("Graphs (current vs voltage)", "Same frequency, different intensity: different saturation current, SAME stopping potential. Same intensity, different frequency: higher ν gives a larger (more negative) stopping potential, saturation current roughly the same. K_max vs ν: straight line, slope h, x-intercept ν₀."),
T("de Broglie hypothesis", "If light (a wave) can behave like particles, particles can behave like waves: λ = h/p. Large objects have extremely small λ, so wave nature shows up only for light particles like electrons."),
T("Davisson–Germer experiment", "54 V electrons were fired at a nickel crystal; a strong peak appeared at 50° — electron diffraction. The measured λ ≈ 0.165 nm matched the de Broglie value of 0.167 nm. First proof of matter waves. Experimental details are no longer in the syllabus — remember the conclusion."),
T("Wave–particle duality", "Both radiation and matter are dual. A single experiment shows only one face: interference and diffraction show the wave; photoelectric and Compton effects show the particle."),
],
"ratta": [
"hc = 1240 eV·nm  ⇒  E(eV) = 1240/λ(nm).",
"h = 6.63 × 10⁻³⁴ J·s,  h/e = 4.14 × 10⁻¹⁵ V·s.",
"K_max = hν − φ = eV₀.  Intensity → current; frequency → K_max.",
"V₀–ν graph slope = h/e (same for all metals); intercept = ν₀.",
"Electron: λ = 12.27/√V Å.  λ = h/√(2mK) = h/√(2mqV).",
"Same V: λ_p : λ_α = 2√2 : 1.",
"Radiation force: absorb P/c,  reflect 2P/c.",
"Davisson–Germer: 54 V, 50°, Ni crystal, λ ≈ 0.165 nm.",
],
}

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
