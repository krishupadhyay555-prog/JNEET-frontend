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

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
