from lib import F, X, T, sig, fx, _check_and_write
import math

h = 6.626e-34; c = 3e8; me = 9.1e-31
E1 = h * c / 500e-9                                  # photon of 500 nm
E2 = 13.6 * 4 * (1 - 1 / 4)                          # He+ 2→1
r3 = 52.9 * 4 / 3                                    # Li2+ n=2 radius pm
lam4 = 1 / (1.097e7 * (1 / 4 - 1 / 9)) * 1e9         # Balmer first line nm
lam5 = h / (me * 1e6) * 1e9                          # de Broglie e⁻ at 1e6 m/s nm
dv6 = h / (4 * math.pi * me * 1e-10)                 # uncertainty Δx = 0.1 nm
K7 = 1240 / 310 - 2                                  # photoelectric 310 nm, φ = 2 eV
lines8 = 5 * 4 // 2

DOC = {
"slug": "atomic-structure", "subject": "Chemistry",
"chapters": {"NEET": "Atomic Structure", "JEE": "Atomic Structure"},
"title": "Atomic Structure", "readMinutes": 14,
"summary": [
"Atoms contain electrons (Thomson), a tiny dense positive nucleus (Rutherford) with protons and neutrons (Chadwick). Rutherford's model could not explain atomic stability or line spectra.",
"Light behaves as waves and as photons of energy E = hν. The photoelectric effect and the line spectrum of hydrogen proved that energy is quantised.",
"Bohr's model of hydrogen-like atoms quantises angular momentum (mvr = nh/2π) and gives energies Eₙ = −13.6 Z²/n² eV, explaining the hydrogen spectrum.",
"Quantum mechanics replaced orbits with orbitals. Four quantum numbers (n, l, m_l, m_s) describe each electron; orbitals fill by the Aufbau principle, Pauli exclusion principle and Hund's rule.",
],
"formulas": [
F("Photon energy", "E = hν = hc/λ;  E (eV) ≈ 1240/λ (nm)", "Energy of light, spectral lines.", None, tag="PYQ favourite"),
F("Photoelectric effect", "hν = φ + K_max;  K_max = eV₀;  φ = hν₀", "Electrons emitted by light.", "Intensity changes the number of electrons, not their maximum energy."),
F("Bohr's quantisation", "m v r = n h/2π", "Bohr model derivations."),
F("Radius of Bohr orbit", "rₙ = 0.529 n²/Z Å = 52.9 n²/Z pm", "Size of orbits in H-like species (H, He⁺, Li²⁺).", "r grows as n² but shrinks as 1/Z."),
F("Energy of Bohr orbit", "Eₙ = −13.6 Z²/n² eV = −2.18 × 10⁻¹⁸ Z²/n² J", "Energy levels, ionisation energy.", None, tag="PYQ favourite"),
F("Velocity in Bohr orbit", "vₙ = 2.18 × 10⁶ Z/n m/s", "Speed of the electron."),
F("Rydberg formula", "1/λ = R Z² (1/n₁² − 1/n₂²);  R = 1.097 × 10⁷ m⁻¹", "Wavelengths of spectral lines.", "Lyman n₁ = 1 (UV), Balmer n₁ = 2 (visible), Paschen 3, Brackett 4, Pfund 5 (IR)."),
F("Number of spectral lines", "from level n down to 1: n(n − 1)/2", "Lines emitted by a sample of excited atoms."),
F("de Broglie wavelength", "λ = h/p = h/mv = h/√(2mK)", "Wave nature of electrons."),
F("Heisenberg's uncertainty principle", "Δx · Δp ≥ h/4π", "Limits on knowing position and momentum together.", "It is a fundamental limit, not a measuring-instrument problem."),
F("Quantum numbers", "n = 1, 2, 3 …;  l = 0 … n − 1;  m_l = −l … +l;  m_s = ±½", "Describing an orbital and an electron.", "l can never equal n."),
F("Nodes", "radial nodes = n − l − 1;  angular nodes = l;  total = n − 1", "Shape and node questions."),
F("Orbital capacity", "subshell: 2(2l + 1) electrons;  shell: 2n² electrons", "Maximum electrons in s, p, d, f and in a shell."),
F("(n + l) rule", "lower (n + l) fills first; if equal, lower n fills first", "Order of filling: 1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p…"),
],
"examples": [
X("Energy of a photon", "Energy of a 500 nm photon?",
  f"E = hc/λ = 6.626 × 10⁻³⁴ × 3 × 10⁸/(5 × 10⁻⁷) ≈ {sig(E1,3)} J (≈ 2.48 eV).", [(sig(E1,3), "3.98 × 10⁻¹⁹")]),
X("He⁺ transition", "Energy emitted when the electron of He⁺ falls from n = 2 to n = 1?",
  f"ΔE = 13.6 × 2² × (1 − 1/4) = {fx(E2,1)} eV.", [(fx(E2,1), "40.8")]),
X("Radius in Li²⁺", "Radius of the second orbit of Li²⁺?",
  f"r = 52.9 × 2²/3 ≈ {fx(r3,1)} pm.", [(fx(r3,1), "70.5")]),
X("First Balmer line", "Wavelength of the first line of the Balmer series of hydrogen?",
  f"1/λ = R(1/4 − 1/9) = 5R/36 → λ ≈ {fx(lam4,0)} nm (red H-α line).", [(fx(lam4,0), "656")]),
X("de Broglie wavelength of an electron", "Electron moving at 10⁶ m/s. λ?",
  f"λ = h/mv = 6.626 × 10⁻³⁴/(9.1 × 10⁻³¹ × 10⁶) ≈ {fx(lam5,3)} nm.", [(fx(lam5,3), "0.728")]),
X("Uncertainty in velocity", "Δx of an electron = 0.1 nm. Minimum Δv?",
  f"Δv = h/(4πmΔx) ≈ {sig(dv6,3)} m/s.", [(sig(dv6,3), "5.79 × 10⁵")]),
X("Photoelectric effect", "Light of 310 nm falls on a metal of work function 2 eV. K_max?",
  f"E = 1240/310 = 4 eV → K_max = 4 − 2 = {fx(K7)} eV (stopping potential 2 V).", [(fx(K7), "2")]),
X("Spectral lines", "Hydrogen atoms are excited to n = 5. Maximum number of lines?",
  f"5 × 4/2 = {lines8} lines.", [(str(lines8), "10")]),
],
"topics": [
T("Discovery of subatomic particles", "Electron: cathode rays, e/m measured by J.J. Thomson; charge by Millikan's oil-drop experiment. Proton: canal (anode) rays. Neutron: Chadwick (1932). Atomic number Z = protons; mass number A = protons + neutrons. Isotopes: same Z (¹H, ²H); isobars: same A (⁴⁰Ar, ⁴⁰Ca)."),
T("Atomic models", "Thomson: plum pudding. Rutherford (α-scattering on gold foil): most of the atom is empty, with a tiny dense positive nucleus; failed because an orbiting electron should radiate and spiral in. Bohr fixed this for hydrogen-like atoms only."),
T("Electromagnetic radiation", "c = νλ. Black-body radiation and the photoelectric effect needed Planck's quantum idea: energy comes in packets hν. Line (atomic) spectra are like fingerprints of elements."),
T("Limitations of Bohr's model", "Works only for one-electron species, cannot explain fine structure, the Zeeman (magnetic) and Stark (electric) effects, or chemical bonding, and contradicts the uncertainty principle by giving exact orbits."),
T("Quantum mechanical model", "Schrödinger's equation gives wave functions ψ; |ψ|² is the probability density. An orbital is the region where finding the electron is most probable. Shapes: s orbitals are spherical, p dumb-bell shaped (px, py, pz), d mostly clover-leaf (dz² is special)."),
T("Filling rules", "Aufbau: lowest energy first. Pauli: no two electrons have the same four quantum numbers. Hund: in degenerate orbitals, electrons occupy singly with parallel spins before pairing. Half-filled and fully filled subshells are extra stable: Cr = [Ar]3d⁵4s¹, Cu = [Ar]3d¹⁰4s¹."),
T("Energy of orbitals", "In hydrogen, energy depends only on n (2s = 2p). In many-electron atoms it depends on n and l, because inner electrons shield outer ones differently (s penetrates most)."),
],
"ratta": [
"E = hc/λ;  E(eV) = 1240/λ(nm).",
"rₙ = 52.9n²/Z pm;  Eₙ = −13.6Z²/n² eV.",
"1/λ = RZ²(1/n₁² − 1/n₂²);  lines = n(n − 1)/2.",
"λ = h/mv;  ΔxΔp ≥ h/4π.",
"Radial nodes n − l − 1;  angular nodes l.",
"Cr 3d⁵4s¹, Cu 3d¹⁰4s¹.",
"Lyman UV, Balmer visible, Paschen/Brackett/Pfund IR.",
],
}

SYLLABUS = [
("Nature of electromagnetic radiation, photoelectric effect", ["radiation", "photoelectric"]),
("Spectrum of the hydrogen atom", ["spectrum", "Balmer", "Lyman"]),
("Bohr model of the hydrogen atom — postulates, radii, energies, limitations", ["Bohr", "radius", "limitations"]),
("Dual nature of matter, de Broglie's relationship, Heisenberg uncertainty principle", ["de Broglie", "uncertainty"]),
("Elementary ideas of quantum mechanics, orbitals, quantum numbers, shapes of s, p and d orbitals", ["orbital", "quantum numbers", "shapes"]),
("Aufbau principle, Pauli's exclusion principle, Hund's rule, electronic configuration, stability of half-filled and completely filled orbitals", ["Aufbau", "Pauli", "Hund", "half-filled"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
