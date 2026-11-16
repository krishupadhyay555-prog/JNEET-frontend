from lib import F, X, T, sig, fx, _check_and_write
import math

eps0 = 8.85e-12; mu0 = 4 * math.pi * 1e-7; c = 3e8
c1 = 1 / math.sqrt(mu0 * eps0)
B2 = 48 / c
I3 = 0.5 * c * eps0 * 100 ** 2
Id4 = eps0 * 1e-2 * 1e12
lam5 = c / 1e8                                  # 100 MHz FM
f6 = c / 5e-7                                   # 500 nm light
u7 = 0.5 * eps0 * 100 ** 2

DOC = {
"slug": "electromagnetic-waves", "subject": "Physics",
"chapters": {"NEET": "Electromagnetic Waves", "JEE": "Electromagnetic Waves"},
"title": "Electromagnetic Waves", "readMinutes": 9,
"summary": [
"Maxwell added the displacement current ε₀ dΦ_E/dt to Ampère's law: a changing electric field makes a magnetic field, just as a changing magnetic field makes an electric field. Together they let fields travel as waves.",
"Electromagnetic waves are transverse: E, B and the direction of travel are mutually perpendicular. In vacuum they travel at c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s, and E₀ = cB₀.",
"They carry energy and momentum; intensity I = ½cε₀E₀². Electric and magnetic fields share the energy equally.",
"The spectrum, from long to short wavelength: radio, microwave, infrared, visible, ultraviolet, X-rays, gamma rays — each with typical sources and uses.",
],
"formulas": [
F("Displacement current", "I_d = ε₀ dΦ_E/dt", "Current 'between' capacitor plates while charging.", "Inside a charging capacitor I_d equals the conduction current in the wires.", tag="PYQ favourite"),
F("Ampère–Maxwell law", "∮ B · dl = μ₀ (I_c + I_d)", "Why a changing E field produces B."),
F("Speed of light", "c = 1/√(μ₀ ε₀) = 3 × 10⁸ m/s;  in a medium v = 1/√(μ ε) = c/n", "EM wave speed in vacuum and media."),
F("Field amplitudes", "E₀ = c B₀  (E = cB at every instant)", "Finding B from E or vice versa.", "B₀ is tiny (E₀/3 × 10⁸) — that doesn't mean the magnetic energy is small.", tag="PYQ favourite"),
F("Wave equations", "E = E₀ sin(kx − ωt) ĵ,  B = B₀ sin(kx − ωt) k̂;  c = ω/k", "Writing or reading an EM wave."),
F("Direction of propagation", "along E × B", "Finding which way the wave moves."),
F("Energy density", "u = ½ε₀E² + B²/2μ₀ (equal shares);  average u = ½ε₀E₀²", "Energy stored in the wave."),
F("Intensity", "I = u_avg × c = ½ c ε₀ E₀²", "Power per unit area carried by the wave."),
F("Momentum and radiation pressure", "p = U/c;  pressure = I/c (absorbed),  2I/c (reflected)", "Force of light on surfaces.", "A perfect reflector feels twice the pressure of a perfect absorber."),
F("Spectrum order", "radio > microwave > infrared > visible (700–400 nm) > ultraviolet > X-rays > γ-rays  (wavelength decreasing)", "Ordering and identifying EM waves."),
],
"examples": [
X("Speed from μ₀ and ε₀", "Compute 1/√(μ₀ε₀) with μ₀ = 4π × 10⁻⁷ and ε₀ = 8.85 × 10⁻¹².",
  f"c = 1/√(4π × 10⁻⁷ × 8.85 × 10⁻¹²) ≈ {sig(c1,3)} m/s.", [(sig(c1,3), "3.00 × 10⁸")]),
X("Magnetic field amplitude", "An EM wave in vacuum has E₀ = 48 V/m. B₀?",
  f"B₀ = E₀/c = 48/(3 × 10⁸) = {sig(B2,2)} T.", [(sig(B2,2), "1.6 × 10⁻⁷")]),
X("Intensity", "E₀ = 100 V/m. Intensity?",
  f"I = ½cε₀E₀² = 0.5 × 3 × 10⁸ × 8.85 × 10⁻¹² × 10⁴ ≈ {fx(I3,1)} W/m².", [(fx(I3,1), "13.3")]),
X("Displacement current", "A capacitor plate area is 10⁻² m² and the field between the plates changes at 10¹² V m⁻¹ s⁻¹. Displacement current?",
  f"I_d = ε₀ A dE/dt = 8.85 × 10⁻¹² × 10⁻² × 10¹² = {fx(Id4,4)} A.", [(fx(Id4,4), "0.0885")]),
X("FM radio wavelength", "Wavelength of a 100 MHz FM signal?",
  f"λ = c/ν = 3 × 10⁸/10⁸ = {fx(lam5)} m.", [(fx(lam5), "3")]),
X("Frequency of green light", "Frequency of 500 nm light?",
  f"ν = c/λ = 3 × 10⁸/(5 × 10⁻⁷) = {sig(f6,1)} Hz.", [(sig(f6,1), "6 × 10¹⁴")]),
X("Average energy density", "E₀ = 100 V/m. Average energy density?",
  f"u = ½ε₀E₀² = 0.5 × 8.85 × 10⁻¹² × 10⁴ ≈ {sig(u7,3)} J/m³.", [(sig(u7,3), "4.42 × 10⁻⁸")]),
],
"topics": [
T("Why displacement current was needed", "Ampère's law gave different answers for surfaces through a wire and through the gap of a charging capacitor. Maxwell's displacement current fixed this and predicted EM waves; Hertz produced them in 1887."),
T("Characteristics of EM waves", "Transverse, need no medium, travel at c in vacuum, are produced by accelerated charges, obey superposition, can be reflected, refracted, diffracted and polarised, and carry energy and momentum. Frequency does not change from medium to medium."),
T("Radio waves and microwaves", "Radio (> 0.1 m): produced by oscillating charges in antennas — AM, FM, TV, mobile communication. Microwaves (1 mm–0.1 m): klystrons and magnetrons — radar, satellite links, microwave ovens (they make water molecules vibrate)."),
T("Infrared and visible", "Infrared (700 nm–1 mm): emitted by hot bodies — heat lamps, remote controls, night vision, physiotherapy; keeps Earth warm through the greenhouse effect. Visible (400–700 nm): the only band our eyes detect."),
T("Ultraviolet", "Produced by very hot bodies like the Sun and by special lamps. Kills germs (water purifiers), used in LASIK eye surgery; mostly absorbed by the ozone layer. Excess UV is harmful to skin and eyes; ordinary glass absorbs much of it."),
T("X-rays and gamma rays", "X-rays (0.01–10 nm): made by fast electrons hitting a metal target — medical imaging, cancer therapy, crystal structure. Gamma rays (< 0.01 nm): from nuclear reactions — destroying cancer cells, sterilising equipment."),
],
"ratta": [
"I_d = ε₀ dΦ_E/dt.",
"c = 1/√(μ₀ε₀);  E₀ = cB₀;  travel along E × B.",
"I = ½cε₀E₀²;  energy shared equally by E and B.",
"Pressure: I/c absorbed, 2I/c reflected.",
"Order (λ ↓): radio, micro, IR, visible, UV, X, γ.",
"Microwave → radar/ovens;  UV → sterilise;  X → imaging;  γ → cancer therapy.",
"EM waves are transverse and need no medium.",
],
}

SYLLABUS = [
("Displacement current", ["displacement current"]),
("Electromagnetic waves and their characteristics (qualitative ideas only), transverse nature", ["transverse", "characteristics"]),
("Electromagnetic spectrum (radio, microwaves, infrared, visible, ultraviolet, X-rays, gamma rays) including elementary facts about their uses", ["radio", "microwave", "infrared", "visible", "ultraviolet", "X-rays", "gamma"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Maxwell ne Ampère's law mein displacement current ε₀ dΦ_E/dt joda: badalta electric field magnetic field banata hai, jaise badalta magnetic field electric field banata hai. Dono milkar fields ko wave ki tarah chalne dete hain.",
"Electromagnetic waves transverse hain: E, B aur chalne ki direction aapas mein perpendicular. Vacuum mein speed c = 1/√(μ₀ε₀) = 3 × 10⁸ m/s, aur E₀ = cB₀.",
"Ye energy aur momentum le jaati hain; intensity I = ½cε₀E₀². Electric aur magnetic fields energy barabar baant-te hain.",
"Spectrum, lambi se chhoti wavelength: radio, microwave, infrared, visible, ultraviolet, X-rays, gamma rays — har ek ke apne sources aur uses.",
],
when=[
("Charging capacitor ki plates ke 'beech' current.", "Charging capacitor ke andar I_d wires ke conduction current ke barabar hota hai — alag mat samjho."),
("Badalta E field B kyun banata hai.", None),
("Vacuum aur media mein EM wave ki speed.", None),
("E se B ya B se E nikaalna.", "B₀ bahut chhota hai (E₀/3 × 10⁸) — iska matlab magnetic energy kam nahi, galat mat maano."),
("EM wave likhna ya padhna.", None),
("Wave kis taraf ja rahi hai.", None),
("Wave mein stored energy.", None),
("Wave dwara per unit area power.", None),
("Surfaces par light ka force.", "Perfect reflector par perfect absorber se double pressure — dhyan rakho."),
("EM waves ko order aur identify karna.", None),
],
examples=[
("μ₀ aur ε₀ se speed", "μ₀ = 4π × 10⁻⁷ aur ε₀ = 8.85 × 10⁻¹² se 1/√(μ₀ε₀)?",
 "c = 1/√(4π × 10⁻⁷ × 8.85 × 10⁻¹²) ≈ ⟨0⟩ m/s."),
("Magnetic field amplitude", "Vacuum mein EM wave ka E₀ = 48 V/m. B₀?",
 "B₀ = E₀/c = 48/(3 × 10⁸) = ⟨0⟩ T."),
("Intensity", "E₀ = 100 V/m. Intensity?",
 "I = ½cε₀E₀² = 0.5 × 3 × 10⁸ × 8.85 × 10⁻¹² × 10⁴ ≈ ⟨0⟩ W/m²."),
("Displacement current", "Capacitor plate ka area 10⁻² m², plates ke beech field 10¹² V m⁻¹ s⁻¹ se badal raha. Displacement current?",
 "I_d = ε₀ A dE/dt = 8.85 × 10⁻¹² × 10⁻² × 10¹² = ⟨0⟩ A."),
("FM radio wavelength", "100 MHz FM signal ki wavelength?",
 "λ = c/ν = 3 × 10⁸/10⁸ = ⟨0⟩ m."),
("Green light ki frequency", "500 nm light ki frequency?",
 "ν = c/λ = 3 × 10⁸/(5 × 10⁻⁷) = ⟨0⟩ Hz."),
("Average energy density", "E₀ = 100 V/m. Average energy density?",
 "u = ½ε₀E₀² = 0.5 × 8.85 × 10⁻¹² × 10⁴ ≈ ⟨0⟩ J/m³."),
],
topics=[
("Why displacement current was needed", "Ampère's law wire se guzarne wali surface aur charging capacitor ke gap se guzarne wali surface ke liye alag answer deta tha. Maxwell ke displacement current ne ise theek kiya aur EM waves predict kiye; Hertz ne 1887 mein unhe banaya."),
("Characteristics of EM waves", "Transverse, medium nahi chahiye, vacuum mein speed c, accelerated charges se bante hain, superposition follow karte hain, reflect, refract, diffract aur polarise ho sakte hain, energy aur momentum le jaate hain. Medium badalne par frequency nahi badalti."),
("Radio waves and microwaves", "Radio (> 0.1 m): antennas mein oscillating charges se — AM, FM, TV, mobile communication. Microwaves (1 mm–0.1 m): klystron aur magnetron — radar, satellite links, microwave ovens (paani ke molecules ko vibrate karte hain)."),
("Infrared and visible", "Infrared (700 nm–1 mm): garam bodies se — heat lamps, remote controls, night vision, physiotherapy; greenhouse effect se Earth ko garam rakhta hai. Visible (400–700 nm): sirf yahi band hamari aankhein dekhti hain."),
("Ultraviolet", "Bahut garam bodies jaise Suraj aur special lamps se. Germs maarta hai (water purifiers), LASIK eye surgery mein; zyadatar ozone layer absorb kar leti hai. Zyada UV skin aur aankhon ke liye nuksaandeh; normal glass iska bahut hissa absorb karta hai."),
("X-rays and gamma rays", "X-rays (0.01–10 nm): tez electrons metal target se takraate hain — medical imaging, cancer therapy, crystal structure. Gamma rays (< 0.01 nm): nuclear reactions se — cancer cells nasht karna, equipment sterilise karna."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
