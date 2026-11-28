"""Batch 5 — Physics A (NEET + JEE): Nuclei, Atoms, Dual Nature, EM Waves, Magnetism and Matter,
Ray Optics, Wave Optics. Original questions; every number is computed below. 28 Nov 2026."""
from math import pi, sqrt, log, log2, exp, sin, cos, tan, asin, atan, radians, degrees
from qlib import mcq, sig, u

def P(chap, cat, diff, text, correct, wrongs, expl):
    mcq("BOTH", "Physics", chap, cat, diff, text, correct, wrongs, expl)

h, c, e, me, k = 6.626e-34, 3e8, 1.6e-19, 9.1e-31, 9e9

# ═════════════════════════ Nuclei ═════════════════════════
N = "Nuclei"
mp, mn_, mHe = 1.007276, 1.008665, 4.001506
dm = 2 * mp + 2 * mn_ - mHe; BE = dm * 931.5
P(N, "tough", "tough", "Using m(proton) = 1.007276 u, m(neutron) = 1.008665 u and m(⁴He nucleus) = 4.001506 u (1 u = 931.5 MeV), the binding energy per nucleon of ⁴He is about",
  u(BE / 4, "MeV"), [u(BE, "MeV"), u(BE / 2, "MeV"), u(dm * 931.5 / 4 * 0.5, "MeV")],
  f"Δm = 2(1.007276) + 2(1.008665) − 4.001506 = {dm:.6f} u. BE = {dm:.6f} × 931.5 ≈ {BE:.1f} MeV; per nucleon ≈ {BE/4:.2f} MeV.")
for T, t in ((5, 20), (2, 6), (2, 10)):
    left = 0.5 ** (t / T)
    P(N, "formula", "moderate", f"The half-life of a radioactive sample is {T} days. The percentage of the sample that has DECAYED after {t} days is",
      f"{100*(1-left):g}%", [f"{100*left:g}%", f"{100*(1-1/(t/T)):.1f}%" if t / T != 2 else "50%", f"{100*(1-0.5**(t/T-1)):g}%"],
      f"t/T = {t/T:g} half-lives, so the fraction left is (1/2)^{t/T:g} = {left:g}; decayed = {100*(1-left):g}%.")
lam = log(2) / (1600 * 3.156e7); Nn = 1e-3 / 226 * 6.022e23; A = lam * Nn
P(N, "tough", "tough", "The activity of 1 mg of ²²⁶Ra (half-life 1600 years, 1 year ≈ 3.156 × 10⁷ s, Nₐ = 6.022 × 10²³) is about",
  u(A, "Bq", 2), [u(A * 1000, "Bq", 2), u(A / log(2), "Bq", 2), u(A * 1600, "Bq", 2)],
  f"N = (10⁻³/226) × 6.022 × 10²³ ≈ {sig(Nn)}; λ = 0.693/(1600 × 3.156 × 10⁷) ≈ {sig(lam)} s⁻¹. A = λN ≈ {sig(A, 2)} Bq (about 1 mCi).")
for T1, T2, t in ((10, 20, 60), (2, 3, 12)):
    r = 0.5 ** (t / T1) / 0.5 ** (t / T2)
    from fractions import Fraction as Fr
    fr = Fr(r).limit_denominator(1000)
    P(N, "tough", "tough", f"Two radioactive samples X and Y start with equal numbers of nuclei. Their half-lives are {T1} min and {T2} min. After {t} min, the ratio N_X/N_Y is",
      f"{fr.numerator}/{fr.denominator}", [f"{fr.denominator}/{fr.numerator}", f"{Fr(T1, T2)}", f"{Fr(0.5**(t/T1)).limit_denominator(1000)}"],
      f"N_X/N₀ = (1/2)^{t//T1}, N_Y/N₀ = (1/2)^{t//T2}. Ratio = 2^({t//T2} − {t//T1}) = {fr.numerator}/{fr.denominator}.")
P(N, "formula", "moderate", "The half-life of a nucleus is 6.93 hours. Its mean life is",
  "10 hours", ["4.8 hours", "6.93 hours", "13.86 hours"], "τ = T½/ln 2 = 6.93/0.693 = 10 h.")
P(N, "tough", "moderate", "The count rate from a radioactive source falls from 1600 counts/min to 100 counts/min in 8 hours. Its half-life is",
  "2 hours", ["4 hours", "0.5 hours", "1 hour"], "1600 → 100 is a factor of 16 = 2⁴, i.e. 4 half-lives in 8 h, so T½ = 2 h.")
P(N, "formula", "moderate", "The ratio of the nuclear radii of ²⁷Al and ¹²⁵Te is",
  "3 : 5", ["27 : 125", "9 : 25", "1 : 1"], "R = R₀A^{1/3}: 27^{1/3} : 125^{1/3} = 3 : 5.")
P(N, "concept", "moderate", "The ratio of the nuclear densities of ²⁷Al and ¹²⁵Te is about",
  "1 : 1", ["3 : 5", "27 : 125", "125 : 27"], "Since R³ ∝ A, density = mass/volume ∝ A/A is the same for all nuclei (≈ 2.3 × 10¹⁷ kg/m³).")
Q = 236 * (8.5 - 7.6)
P(N, "tough", "tough", "In the fission of ²³⁶U (binding energy 7.6 MeV per nucleon) into two fragments each of binding energy about 8.5 MeV per nucleon, the energy released per fission is about",
  u(Q, "MeV"), [u(8.5 - 7.6, "MeV"), u(236 * 8.5, "MeV"), u(Q / 2, "MeV")],
  f"Energy released = gain in total binding energy ≈ 236 × (8.5 − 7.6) ≈ {Q:.0f} MeV.")
mH, mHe4 = 1.007825, 4.002603
Qf = (4 * mH - mHe4) * 931.5
P(N, "tough", "tough", "In the Sun, effectively four ¹H atoms (1.007825 u each) become one ⁴He atom (4.002603 u). Ignoring neutrinos and positron annihilation details, the energy released is about (1 u = 931.5 MeV)",
  u(Qf, "MeV"), [u(Qf / 4, "MeV"), u(4 * mH * 931.5, "MeV", 4), u(Qf * 2, "MeV")],
  f"Δm = 4(1.007825) − 4.002603 = {4*mH-mHe4:.6f} u → Q ≈ {Qf:.1f} MeV.")
P(N, "tough", "tough", "²³²₉₀Th decays to ²⁰⁸₈₂Pb through a series of α and β⁻ decays. The numbers of α and β⁻ particles emitted are",
  "6 α and 4 β⁻", ["4 α and 6 β⁻", "6 α and 2 β⁻", "8 α and 4 β⁻"], "ΔA = 24 → 6 α (Z falls by 12 to 78). To reach Z = 82, 4 β⁻ decays (each raises Z by 1).")
for Qa, A_ in ((5.0, 226), (6.0, 212)):
    Ka = Qa * (A_ - 4) / A_
    P(N, "tough", "tough", f"A nucleus of mass number {A_} at rest undergoes α-decay with Q-value {Qa:g} MeV. The kinetic energy of the α-particle is about",
      u(Ka, "MeV"), [f"{Qa:g} MeV", u(Qa * 4 / A_, "MeV"), u(Qa * (A_ - 4) / (A_ + 4), "MeV", 4)],
      f"Momentum is conserved, so K_α = Q(A − 4)/A = {Qa:g} × {A_-4}/{A_} ≈ {Ka:.3g} MeV (the daughter takes the rest).")
P(N, "formula", "moderate", "If 1 g of matter were converted completely into energy, the energy released would be",
  "9 × 10¹³ J", ["9 × 10¹⁶ J", "3 × 10⁵ J", "9 × 10¹⁰ J"], "E = mc² = 10⁻³ × (3 × 10⁸)² = 9 × 10¹³ J.")
P(N, "concept", "moderate", "Which statement about nuclear forces is NOT correct?",
  "They depend on the charge of the nucleons", ["They are short-ranged (a few fm)", "They are much stronger than electrostatic forces at nuclear distances", "They saturate — each nucleon interacts only with its neighbours"],
  "Nuclear forces are charge-independent: n–n, p–p and n–p forces are nearly equal.")
P(N, "concept", "easy", "The binding energy per nucleon is maximum (about 8.8 MeV) for nuclei near",
  "⁵⁶Fe", ["⁴He", "²³⁸U", "¹²C"], "The BE/A curve peaks near A ≈ 56–62; such nuclei are the most stable, so lighter ones release energy by fusion and heavier ones by fission.")
P(N, "concept", "moderate", "In a nuclear reactor, the role of heavy water or graphite is to",
  "slow down fast neutrons so they can cause fission of ²³⁵U", ["absorb extra neutrons to stop the chain", "cool the core directly", "convert ²³⁸U into ²³⁵U"],
  "A moderator slows neutrons by collisions; control rods (cadmium/boron) absorb neutrons to control the chain reaction.")
P(N, "formula", "moderate", "The fraction of radioactive nuclei that decay in a time equal to one mean life is about",
  "63%", ["37%", "50%", "69%"], "After τ, N = N₀/e ≈ 0.37N₀, so about 63% have decayed.")
f_ = 0.5 ** 1 - 0.5 ** 3
P(N, "tough", "tough", "A radioactive sample has half-life T. The fraction of the ORIGINAL nuclei that decay between t = T and t = 3T is",
  "3/8", ["1/4", "1/2", "7/8"], f"Left at T: 1/2; left at 3T: 1/8. Decayed in between = 1/2 − 1/8 = 3/8 = {f_}.")

# ═════════════════════════ Atoms ═════════════════════════
A_ = "Atoms"
P(A_, "formula", "moderate", "The energy of the electron in the first excited state of He⁺ is",
  "−13.6 eV", ["−3.4 eV", "−54.4 eV", "−27.2 eV"], "E = −13.6 Z²/n² = −13.6 × 4/4 = −13.6 eV.")
P(A_, "formula", "moderate", "The ionisation energy of Li²⁺ from its ground state is",
  "122.4 eV", ["13.6 eV", "40.8 eV", "30.6 eV"], "13.6 × Z² = 13.6 × 9 = 122.4 eV.")
P(A_, "tough", "tough", "The ratio of the wavelength of the first Lyman line to that of the first Balmer line of hydrogen is",
  "5/27", ["27/5", "4/9", "1/4"], "1/λ_L = R(1 − 1/4) = 3R/4; 1/λ_B = R(1/4 − 1/9) = 5R/36. λ_L/λ_B = (5/36)/(3/4) = 5/27.")
P(A_, "tough", "tough", "The ratio of the longest to the shortest wavelength in the Balmer series of hydrogen is",
  "9/5", ["5/9", "4/3", "36/5"], "Longest (3→2): 36/(5R); shortest (∞→2): 4/R. Ratio = (36/5)/4 = 9/5.")
for hi, lo in ((5, 1), (6, 2), (4, 1)):
    nl = (hi - lo) * (hi - lo + 1) // 2
    P(A_, "formula", "moderate", f"Hydrogen atoms in the state n = {hi} return to n = {lo} by all possible transitions. The maximum number of different spectral lines is",
      str(nl), [str(hi - lo), str(nl + hi - lo), str(hi * (hi - 1) // 2 if nl != hi * (hi - 1) // 2 else nl - 1)],
      f"Lines among levels {lo}…{hi}: N = Δn(Δn + 1)/2 with Δn = {hi-lo} → {nl}.")
P(A_, "tough", "moderate", "Ground-state hydrogen atoms absorb photons of 12.09 eV. The number of spectral lines they can then emit is",
  "3", ["1", "6", "2"], "−13.6 + 12.09 = −1.51 eV = level n = 3. From n = 3: 3→2, 3→1, 2→1 → 3 lines.")
r0 = k * 2 * 79 * e * e / (5e6 * e)
P(A_, "tough", "tough", "A 5 MeV α-particle is fired head-on at a gold nucleus (Z = 79). The distance of closest approach is about (1/4πε₀ = 9 × 10⁹ N m² C⁻²)",
  u(r0, "m", 2), [u(r0 / 2, "m", 2), u(r0 * 2, "m", 2), u(r0 * 100, "m", 2)],
  f"½mv² = k(2e)(79e)/r₀ ⇒ r₀ = 9 × 10⁹ × 158 × 1.6 × 10⁻¹⁹/(5 × 10⁶) ≈ {sig(r0, 2)} m.")
P(A_, "formula", "moderate", "In the Bohr model, the total energy of an electron is −3.4 eV. Its potential energy is",
  "−6.8 eV", ["+3.4 eV", "−3.4 eV", "+6.8 eV"], "PE = 2E and KE = −E, so PE = −6.8 eV and KE = +3.4 eV.")
P(A_, "formula", "moderate", "The ratio of the speed of the electron in the n = 2 orbit of He⁺ to that in the n = 1 orbit of H is",
  "1 : 1", ["2 : 1", "1 : 2", "4 : 1"], "v ∝ Z/n: He⁺ n = 2 gives 2/2 = 1, H n = 1 gives 1/1 = 1.")
P(A_, "formula", "moderate", "In a Bohr orbit, the period of revolution of the electron varies as",
  "n³/Z²", ["n²/Z", "n/Z²", "Z²/n³"], "T = 2πr/v with r ∝ n²/Z and v ∝ Z/n gives T ∝ n³/Z².")
P(A_, "concept", "moderate", "In the n = 4 orbit of hydrogen, the circumference of the orbit equals",
  "4 de Broglie wavelengths of the electron", ["one de Broglie wavelength", "half a de Broglie wavelength", "16 de Broglie wavelengths"], "Bohr's condition mvr = nh/2π is the same as 2πr = nλ.")
P(A_, "formula", "moderate", "The angular momentum of the electron in the third orbit of hydrogen is",
  "3h/2π", ["h/2π", "9h/2π", "3h/π"], "L = nh/2π with n = 3.")
P(A_, "concept", "moderate", "In the α-scattering experiment, most α-particles passed straight through the gold foil. This showed that",
  "most of the atom is empty space", ["the nucleus is negatively charged", "electrons are bound in fixed shells", "the atom has uniformly spread positive charge"],
  "Only a very few were deflected through large angles, so the positive charge and mass are concentrated in a tiny nucleus.")
lmin = 1 / (1.097e7) * 1e9
P(A_, "formula", "moderate", "The shortest wavelength in the Lyman series of hydrogen is about (R = 1.097 × 10⁷ m⁻¹)",
  f"{lmin:.1f} nm", [f"{lmin*4/3:.1f} nm", f"{lmin*4:.1f} nm", f"{lmin*9:.1f} nm"], f"Series limit: 1/λ = R(1/1² − 0) ⇒ λ = 1/R ≈ {lmin:.1f} nm (ultraviolet).")

# ═════════════════════════ Dual Nature ═════════════════════════
D = "Dual Nature of Radiation and Matter"
for lam_nm, phi in ((300, 2.3), (250, 4.2), (400, 1.9)):
    Kmax = 1240 / lam_nm - phi
    P(D, "formula", "moderate", f"Light of wavelength {lam_nm} nm falls on a metal of work function {phi} eV. The stopping potential is about (hc = 1240 eV nm)",
      f"{Kmax:.2f} V", [f"{1240/lam_nm:.2f} V", f"{1240/lam_nm+phi:.2f} V", f"{Kmax/2:.2f} V"],
      f"Photon energy = 1240/{lam_nm} = {1240/lam_nm:.2f} eV. K_max = {1240/lam_nm:.2f} − {phi} = {Kmax:.2f} eV, so V₀ = {Kmax:.2f} V.")
for phi in (2.5, 4.0):
    P(D, "formula", "easy", f"The threshold wavelength of a metal of work function {phi} eV is about (hc = 1240 eV nm)",
      f"{1240/phi:.0f} nm", [f"{1240/phi/2:.0f} nm", f"{1240*phi:.0f} nm", f"{1240/phi*2:.0f} nm"], f"λ₀ = hc/φ = 1240/{phi} ≈ {1240/phi:.0f} nm.")
P(D, "tough", "tough", "When light of wavelength λ falls on a metal, the stopping potential is 3V₀; for wavelength 2λ it is V₀. The threshold wavelength of the metal is",
  "4λ", ["3λ", "6λ", "2λ"], "hc/λ − φ = 3eV₀ and hc/2λ − φ = eV₀. Subtracting: hc/2λ = 2eV₀ → φ = hc/λ − 3(hc/4λ) = hc/4λ, so λ₀ = 4λ.")
for V in (100, 400, 2500):
    lam_e = 1.227 / sqrt(V)
    P(D, "formula", "moderate", f"An electron is accelerated from rest through {V} V. Its de Broglie wavelength is about",
      f"{lam_e:.3g} nm", [f"{1.227/V:.3g} nm", f"{lam_e*10:.3g} nm", f"{lam_e*2:.3g} nm"],
      f"λ = 1.227/√V nm = 1.227/√{V} ≈ {lam_e:.3g} nm.")
P(D, "tough", "tough", "A proton and an α-particle are accelerated from rest through the same potential difference. The ratio of their de Broglie wavelengths λ_p/λ_α is",
  "2√2", ["√2", "2", "1/(2√2)"], "λ = h/√(2mqV). λ_p/λ_α = √(m_α q_α/(m_p q_p)) = √(4 × 2) = 2√2.")
p_ph = h / 500e-9
P(D, "formula", "moderate", "The momentum of a photon of wavelength 500 nm is about",
  u(p_ph, "kg m/s"), [u(p_ph * c, "kg m/s"), u(h * 500e-9, "kg m/s"), u(p_ph / c, "kg m/s")], f"p = h/λ = 6.626 × 10⁻³⁴/(5 × 10⁻⁷) ≈ {sig(p_ph)} kg m/s.")
nph = 10 * 600e-9 / (h * c)
P(D, "formula", "moderate", "A 10 W source emits light of wavelength 600 nm. The number of photons emitted per second is about",
  u(nph, "", 2).strip(), [sig(nph / 10, 2), sig(nph * 1e3, 2), sig(10 / (h * 600e-9), 2)], f"n = Pλ/(hc) = 10 × 6 × 10⁻⁷/(6.626 × 10⁻³⁴ × 3 × 10⁸) ≈ {sig(nph, 2)} per second.")
P(D, "concept", "moderate", "In a photoelectric experiment the intensity of light is doubled, keeping the frequency fixed. Then",
  "the saturation current doubles and the stopping potential stays the same", ["the stopping potential doubles", "both the saturation current and stopping potential double", "the maximum kinetic energy doubles"],
  "Intensity changes the number of photons (and so of photoelectrons), not the energy of each photon.")
P(D, "concept", "moderate", "The slope of the graph of stopping potential V₀ against frequency ν of incident light is",
  "h/e, the same for all metals", ["h, different for each metal", "φ/e", "e/h, depends on intensity"], "eV₀ = hν − φ ⇒ V₀ = (h/e)ν − φ/e; only the intercept depends on the metal.")
Ke = h ** 2 / (2 * me * (1e-10) ** 2) / e
P(D, "tough", "tough", "The kinetic energy of an electron whose de Broglie wavelength is 1 Å is about",
  f"{Ke:.0f} eV", [f"{Ke/2:.0f} eV", f"{Ke*2:.0f} eV", f"{12400:.0f} eV"], f"K = h²/(2mλ²) = (6.626 × 10⁻³⁴)²/(2 × 9.1 × 10⁻³¹ × 10⁻²⁰) J ≈ {Ke:.0f} eV. (12400 eV is the energy of a 1 Å PHOTON.)")
P(D, "concept", "moderate", "The Davisson–Germer experiment established",
  "the wave nature of electrons", ["the particle nature of light", "the quantisation of charge", "the existence of the nucleus"], "Electrons diffracted from a nickel crystal with λ matching h/p.")

# ═════════════════════════ Electromagnetic Waves ═════════════════════════
W = "Electromagnetic Waves"
P(W, "formula", "moderate", "The speed of electromagnetic waves in a non-magnetic medium of relative permittivity 4 is",
  "1.5 × 10⁸ m/s", ["3 × 10⁸ m/s", "7.5 × 10⁷ m/s", "6 × 10⁸ m/s"], "v = c/√(μᵣεᵣ) = 3 × 10⁸/2 = 1.5 × 10⁸ m/s.")
for B0 in (2e-8, 5e-7):
    P(W, "formula", "easy", f"In a plane electromagnetic wave in vacuum, the magnetic field amplitude is {sig(B0)} T. The electric field amplitude is",
      u(B0 * c, "V/m"), [u(B0 / c, "V/m"), u(B0 * c * c, "V/m"), u(B0 * c / 2, "V/m")], f"E₀ = cB₀ = 3 × 10⁸ × {sig(B0)} = {sig(B0*c)} V/m.")
I = 0.5 * c * 8.85e-12 * 100 ** 2
P(W, "tough", "tough", "The electric field amplitude of an EM wave is 100 V/m. Its intensity is about (ε₀ = 8.85 × 10⁻¹² C² N⁻¹ m⁻²)",
  u(I, "W/m²"), [u(2 * I, "W/m²"), u(I / c, "W/m²"), u(8.85e-12 * 100 ** 2, "W/m²")], f"I = ½cε₀E₀² = 0.5 × 3 × 10⁸ × 8.85 × 10⁻¹² × 10⁴ ≈ {I:.1f} W/m².")
P(W, "tough", "tough", "Light of intensity 1000 W/m² falls normally on a perfectly REFLECTING surface. The radiation pressure is about",
  "6.7 × 10⁻⁶ Pa", ["3.3 × 10⁻⁶ Pa", "3.3 × 10⁻³ Pa", "1.3 × 10⁻⁵ Pa"], "For total reflection p = 2I/c = 2000/(3 × 10⁸) ≈ 6.7 × 10⁻⁶ Pa (half of this for total absorption).")
P(W, "concept", "easy", "Which is the correct order of increasing wavelength?",
  "γ-rays < X-rays < ultraviolet < visible < infrared < microwaves", ["X-rays < γ-rays < ultraviolet < visible < microwaves < infrared", "ultraviolet < X-rays < visible < infrared < γ-rays", "microwaves < infrared < visible < ultraviolet < X-rays"],
  "γ-rays have the shortest wavelength and radio waves the longest.")
P(W, "tough", "moderate", "A 2 µF parallel-plate capacitor is being charged so that the voltage across it rises at 5000 V/s. The displacement current between its plates is",
  "10 mA", ["2.5 mA", "10 A", "0.4 mA"], "I_d = ε₀A dE/dt = C dV/dt = 2 × 10⁻⁶ × 5000 = 10⁻² A.")
P(W, "concept", "easy", "The waves used for sterilising surgical instruments and in LASIK eye surgery are",
  "ultraviolet rays", ["infrared rays", "microwaves", "radio waves"], "UV kills microbes and its absorption by the cornea allows precise reshaping.")
P(W, "concept", "easy", "Infrared radiation is used in",
  "physiotherapy (heat treatment) and TV remote controls", ["radar and microwave ovens", "radiotherapy of cancer", "seeing bone fractures"], "IR is 'heat radiation'; radar uses microwaves, radiotherapy uses γ-rays, fractures use X-rays.")
P(W, "formula", "easy", "An electromagnetic wave has frequency 3 GHz. Its wavelength and type are",
  "10 cm, microwave", ["1 m, radio wave", "1 mm, infrared", "10 cm, radio wave"], "λ = c/f = 3 × 10⁸/3 × 10⁹ = 0.1 m; 1 mm–30 cm is the microwave band.")
P(W, "concept", "moderate", "In an EM wave, the electric field points along +x and the magnetic field along +y. The wave travels along",
  "+z", ["−z", "+x", "+y"], "The direction of propagation is along E × B = x̂ × ŷ = ẑ.")
P(W, "concept", "moderate", "In a plane electromagnetic wave, the average energy density is",
  "shared equally between the electric and magnetic fields", ["carried mostly by the electric field", "carried mostly by the magnetic field", "zero, since E and B oscillate"], "½ε₀E² = B²/(2μ₀) when E = cB.")
lam_w = 2 * pi * c / 6e8
P(W, "formula", "moderate", "An EM wave in vacuum has E = E₀ sin(kz − ωt) with ω = 6 × 10⁸ rad/s. Its wavelength is about",
  f"{lam_w:.2f} m", [f"{c/6e8:.2f} m", f"{lam_w*2:.2f} m", f"{6e8/c:.2f} m"], f"λ = 2πc/ω = 2π × 3 × 10⁸/(6 × 10⁸) = π ≈ {lam_w:.2f} m.")
P(W, "concept", "moderate", "Electromagnetic waves are produced by",
  "accelerated charges", ["charges at rest", "charges moving with constant velocity", "neutral particles only"], "A static charge gives only an E field and a steady current only a steady B field; oscillating (accelerated) charges radiate.")

# ═════════════════════════ Magnetism and Matter ═════════════════════════
MM = "Magnetism and Matter"
P(MM, "formula", "moderate", "At the same large distance from a short bar magnet, the field on its axis is how many times the field on its equatorial line?",
  "2", ["1/2", "1", "4"], "B_axial = μ₀2m/4πr³, B_equatorial = μ₀m/4πr³.")
for m_, B_, th in ((2, 0.3, 30), (0.5, 0.2, 90), (4, 0.05, 60)):
    tau = m_ * B_ * sin(radians(th))
    P(MM, "formula", "easy", f"A magnet of dipole moment {m_} A m² makes an angle of {th}° with a uniform field of {B_} T. The torque on it is",
      u(tau, "N m"), [u(m_ * B_ * cos(radians(th)) if th != 90 else 0, "N m"), u(2 * tau, "N m"), u(tau / 2, "N m")],
      f"τ = mB sin θ = {m_} × {B_} × sin {th}° = {sig(tau)} N m.")
P(MM, "tough", "moderate", "The work done in rotating a magnetic dipole of moment m from θ = 0° (parallel to B) to θ = 180° in a uniform field B is",
  "2mB", ["mB", "zero", "−2mB"], "W = U_f − U_i = (−mB cos 180°) − (−mB cos 0°) = 2mB.")
P(MM, "tough", "tough", "A magnetic needle oscillates in a uniform field with period T. If the field is made 4 times stronger, the period becomes",
  "T/2", ["2T", "T/4", "4T"], "T = 2π√(I/mB) ∝ 1/√B.")
P(MM, "formula", "moderate", "The magnetic susceptibility of a paramagnetic salt is 1.2 × 10⁻⁵ at 300 K. At 200 K it is",
  "1.8 × 10⁻⁵", ["0.8 × 10⁻⁵", "1.2 × 10⁻⁵", "2.7 × 10⁻⁵"], "Curie's law χ ∝ 1/T: χ = 1.2 × 10⁻⁵ × 300/200.")
P(MM, "concept", "moderate", "Which set correctly gives the magnetic susceptibility χ?",
  "diamagnetic: small negative; paramagnetic: small positive; ferromagnetic: large positive", ["diamagnetic: large positive; paramagnetic: small negative; ferromagnetic: zero", "all three: small positive", "diamagnetic: zero; paramagnetic: large positive; ferromagnetic: negative"],
  "Diamagnets are weakly repelled, paramagnets weakly attracted, ferromagnets strongly attracted.")
P(MM, "concept", "moderate", "A superconductor below its critical temperature expels magnetic field completely. Its susceptibility is",
  "−1", ["0", "+1", "very large and positive"], "Perfect diamagnetism (Meissner effect): B = μ₀(H + M) = 0 so M = −H, χ = −1.")
P(MM, "concept", "tough", "A bar magnet of moment m is cut into two equal parts along its length (parallel to its axis). Each part has dipole moment",
  "m/2, with pole strength halved", ["m/2, with the same pole strength", "m, with pole strength halved", "m/4"], "Cut along the length: length stays the same, pole strength halves, so m halves. Cut across the axis: pole strength stays, length halves, m also halves.")
P(MM, "formula", "moderate", "A circular coil of 50 turns and radius 10 cm carries 2 A. Its magnetic dipole moment is about",
  "3.14 A m²", ["0.0628 A m²", "100 A m²", "31.4 A m²"], "m = NIA = 50 × 2 × π(0.1)² = π ≈ 3.14 A m².")
P(MM, "formula", "easy", "A material has magnetic susceptibility 599. Its relative permeability is",
  "600", ["598", "599", "1/600"], "μᵣ = 1 + χ.")
P(MM, "concept", "moderate", "When a ferromagnet is heated above its Curie temperature, it",
  "becomes paramagnetic", ["becomes diamagnetic", "becomes a superconductor", "keeps its magnetisation"], "Thermal agitation destroys domain alignment.")
P(MM, "concept", "moderate", "A bar magnet behaves like",
  "a current-carrying solenoid with the same magnetic moment", ["a single moving charge", "a straight current-carrying wire", "an electric dipole in a magnetic field"], "Outside it, the field lines of a bar magnet and a solenoid are identical.")
P(MM, "formula", "moderate", "The magnetic field due to a short magnet of moment 1 A m² at a point 10 cm away on its axis is (μ₀/4π = 10⁻⁷)",
  "2 × 10⁻⁴ T", ["1 × 10⁻⁴ T", "2 × 10⁻⁷ T", "2 × 10⁻² T"], "B = (μ₀/4π)(2m/r³) = 10⁻⁷ × 2/10⁻³ = 2 × 10⁻⁴ T.")

# ═════════════════════════ Ray Optics ═════════════════════════
R = "Ray Optics and Optical Instruments"
for uo, f in ((15, 10), (30, 20), (5, 10)):
    v = 1 / (1 / -f - 1 / -uo)   # mirror: 1/v + 1/u = 1/f with f, u negative
    m = -v / -uo
    P(R, "formula", "moderate", f"An object is placed {uo} cm in front of a concave mirror of focal length {f} cm. The image is formed at",
      *[(o, [w.replace("-", "−") for w in ws]) for o, ws in [(f"{abs(v):.0f} cm {'in front of' if v < 0 else 'behind'} the mirror, magnification {m:+.0f}".replace("-", "−"), [f"{abs(v):.0f} cm {'behind' if v < 0 else 'in front of'} the mirror, magnification {-m:+.0f}", f"{abs(v)/2:.0f} cm in front of the mirror, magnification {m/2:+.0f}", f"{uo+f:.0f} cm in front of the mirror, magnification −1"])]][0],
      f"1/v = 1/f − 1/u = −1/{f} + 1/{uo} ⇒ v = {v:.0f} cm; m = −v/u = {m:+.0f}.".replace("= -", "= −").replace("+-", "−"))
for uo, f in ((30, 20), (10, 20)):
    v = 1 / (1 / f + 1 / -uo)
    m = v / -uo
    P(R, "formula", "moderate", f"An object is {uo} cm from a convex lens of focal length {f} cm. The image distance and magnification are",
      f"v = {v:+.0f} cm, m = {m:+.0f}".replace("-", "−"), [w.replace("-", "−") for w in (f"v = {-v:+.0f} cm, m = {-m:+.0f}", f"v = {v/2:+.0f} cm, m = {m/2:+.0f}", f"v = {f*uo/(uo+f):+.0f} cm, m = {f/(uo+f):+.2f}")],
      f"1/v − 1/u = 1/f with u = −{uo}: 1/v = 1/{f} − 1/{uo} ⇒ v = {v:+.0f} cm; m = v/u = {m:+.0f}{' (virtual, erect)' if v < 0 else ' (real, inverted)'}.")
fw = 20 * (1.5 - 1) / (1.5 / 1.33 - 1)
P(R, "tough", "tough", "A thin biconvex glass lens (μ = 1.5) has focal length 20 cm in air. Its focal length in water (μ = 1.33) is about",
  f"{fw:.0f} cm", ["20 cm", f"{20*1.33:.0f} cm", f"{20/1.33:.0f} cm"], f"1/f ∝ (μ_rel − 1): f_w = 20 × (0.5)/(1.5/1.33 − 1) ≈ {fw:.0f} cm.")
P(R, "formula", "easy", "Two thin lenses of power +5 D and −3 D are in contact. The focal length of the combination is",
  "+50 cm", ["+12.5 cm", "−50 cm", "+20 cm"], "P = 5 − 3 = +2 D; f = 1/P = 0.5 m.")
P(R, "formula", "easy", "A coin lies at the bottom of a 12 cm deep beaker of water (μ = 4/3). Seen from directly above, it appears raised by",
  "3 cm", ["9 cm", "4 cm", "16 cm"], "Apparent depth = 12/(4/3) = 9 cm, so it appears raised by 12 − 9 = 3 cm.")
for mu_s, ang in (("√2", 45), ("2", 30), ("2/√3", 60)):
    P(R, "formula", "easy", f"The critical angle for light going from a medium of refractive index {mu_s} into air is",
      f"{ang}°", [f"{a}°" for a in (30, 45, 60, 90) if a != ang], f"sin C = 1/μ = 1/{mu_s} ⇒ C = {ang}°.")
P(R, "formula", "easy", "A thin prism of angle 4° and refractive index 1.5 deviates a ray by",
  "2°", ["6°", "4°", "1.5°"], "δ = (μ − 1)A = 0.5 × 4°.")
P(R, "formula", "moderate", "A simple microscope of focal length 5 cm forms the image at the near point (25 cm). Its magnifying power is",
  "6", ["5", "4", "25"], "m = 1 + D/f = 1 + 25/5 = 6 (5 when the image is at infinity).")
P(R, "formula", "moderate", "An astronomical telescope in normal adjustment has objective focal length 100 cm and eyepiece focal length 5 cm. Its magnifying power and length are",
  "20 and 105 cm", ["20 and 95 cm", "500 and 105 cm", "0.05 and 105 cm"], "m = f_o/f_e = 20; L = f_o + f_e = 105 cm.")
P(R, "formula", "moderate", "A convex lens of focal length 20 cm is in contact with a concave lens of focal length 30 cm. The combination is",
  "converging, f = 60 cm", ["diverging, f = 60 cm", "converging, f = 12 cm", "diverging, f = 12 cm"], "1/F = 1/20 − 1/30 = 1/60.")
P(R, "tough", "tough", "A point object in air is 30 cm from the convex spherical surface (R = 10 cm) of a long glass rod (μ = 1.5). The image forms inside the glass at",
  "90 cm from the surface", ["30 cm from the surface", "60 cm from the surface", "15 cm from the surface"], "μ₂/v − μ₁/u = (μ₂ − μ₁)/R: 1.5/v + 1/30 = 0.5/10 ⇒ 1.5/v = 1/60 ⇒ v = 90 cm.")
P(R, "concept", "moderate", "A plane mirror is turned through 15° while the incident ray is fixed. The reflected ray turns through",
  "30°", ["15°", "7.5°", "45°"], "The reflected ray turns through twice the angle of rotation of the mirror.")
P(R, "concept", "moderate", "Dispersive power of a prism material is defined as",
  "(μ_v − μ_r)/(μ_y − 1)", ["(μ_v + μ_r)/2", "(μ_v − μ_r)/μ_y", "δ_v − δ_r"], "ω = angular dispersion/mean deviation = (μ_v − μ_r)/(μ_y − 1).")
P(R, "concept", "moderate", "The sparkle of a diamond is mainly due to",
  "total internal reflection, because its critical angle is small (about 24°)", ["dispersion alone", "diffraction at its edges", "polarisation by reflection"], "μ ≈ 2.42 gives C ≈ 24°; facets are cut so light suffers repeated total internal reflection.")
P(R, "formula", "moderate", "A compound microscope has objective focal length 1 cm and eyepiece focal length 5 cm. With tube length L = 20 cm (between the facing focal points) and final image at infinity, its magnifying power is about",
  "100", ["25", "500", "20"], "m = (L/f_o)(D/f_e) = (20/1)(25/5) = 100.")

# ═════════════════════════ Wave Optics ═════════════════════════
WO = "Wave Optics"
for lam_nm, D_, d_mm in ((600, 1.2, 0.3), (500, 1.0, 0.25), (450, 1.5, 0.5)):
    beta = lam_nm * 1e-9 * D_ / (d_mm * 1e-3) * 1e3
    P(WO, "formula", "easy", f"In Young's double-slit experiment, λ = {lam_nm} nm, the slit separation is {d_mm} mm and the screen is {D_} m away. The fringe width is",
      f"{beta:.2g} mm", [f"{beta/2:.2g} mm", f"{beta*2:.2g} mm", f"{beta*10:.2g} mm"], f"β = λD/d = {lam_nm} × 10⁻⁹ × {D_}/({d_mm} × 10⁻³) = {beta:.2g} mm.")
P(WO, "formula", "moderate", "A YDSE set-up gives fringe width 2.4 mm in air. If the whole apparatus is immersed in water (μ = 4/3), the fringe width becomes",
  "1.8 mm", ["3.2 mm", "2.4 mm", "1.2 mm"], "λ in water = λ/μ, so β = 2.4 × 3/4 = 1.8 mm.")
P(WO, "tough", "moderate", "In YDSE with two equal sources, the intensity at a point where the phase difference is π/3, as a fraction of the maximum intensity, is",
  "3/4", ["1/2", "1/4", "1"], "I = I_max cos²(φ/2) = I_max cos²(30°) = 3I_max/4.")
P(WO, "tough", "tough", "Two coherent sources have intensities in the ratio 9 : 1. The ratio of maximum to minimum intensity in their interference pattern is",
  "4 : 1", ["9 : 1", "10 : 8", "16 : 1"], "Amplitudes are in ratio 3 : 1. I_max/I_min = (3 + 1)²/(3 − 1)² = 16/4 = 4.")
w_c = 2 * 500e-9 * 1 / 0.2e-3 * 1e3
P(WO, "formula", "moderate", "Light of wavelength 500 nm falls on a single slit 0.2 mm wide. The width of the central maximum on a screen 1 m away is",
  f"{w_c:.0f} mm", [f"{w_c/2:.1f} mm", f"{w_c*2:.0f} mm", f"{w_c/4:.2f} mm"], f"Width = 2λD/a = 2 × 5 × 10⁻⁷ × 1/(2 × 10⁻⁴) = {w_c/1e3:.3f} m = {w_c:.0f} mm.")
P(WO, "formula", "moderate", "Unpolarised light of intensity I₀ passes through two polaroids whose axes are at 60° to each other. The transmitted intensity is",
  "I₀/8", ["I₀/4", "I₀/2", "3I₀/8"], "First polaroid: I₀/2. Malus' law: (I₀/2)cos² 60° = I₀/8.")
P(WO, "formula", "moderate", "Light is reflected from glass of refractive index √3. The reflected light is completely polarised when the angle of incidence is",
  "60°", ["30°", "45°", "90°"], "Brewster's law: tan i_B = μ = √3 ⇒ i_B = 60° (reflected and refracted rays are then perpendicular).")
P(WO, "tough", "tough", "In YDSE (λ = 600 nm), a thin glass sheet (μ = 1.5) of thickness 6 µm is placed over one slit. The central fringe shifts by",
  "5 fringes", ["10 fringes", "2.5 fringes", "1 fringe"], "Extra path = (μ − 1)t = 0.5 × 6 µm = 3 µm = 5λ, so the pattern shifts by 5 fringe widths.")
th_r = 1.22 * 600e-9 / 1.0
P(WO, "formula", "moderate", "The angular limit of resolution of a telescope with a 1 m objective for light of wavelength 600 nm is about",
  u(th_r, "rad", 2), [u(th_r / 1.22, "rad", 2), u(th_r * 10, "rad", 2), u(1 / th_r, "rad", 2)], f"Δθ = 1.22λ/D = 1.22 × 6 × 10⁻⁷/1 ≈ {sig(th_r, 2)} rad.")
P(WO, "concept", "easy", "The wavefront from a distant star reaching the Earth is",
  "plane", ["spherical", "cylindrical", "elliptical"], "A spherical wavefront of very large radius is plane over a small region.")
P(WO, "concept", "moderate", "Two independent sodium lamps placed side by side do not show a steady interference pattern because",
  "their phase difference changes randomly — they are not coherent", ["their wavelengths are very different", "their intensities are unequal", "light from them is polarised"], "A sustained pattern needs a constant phase difference, as from two slits lit by one source.")
P(WO, "formula", "moderate", "In YDSE, the path difference at the third dark fringe from the centre is",
  "5λ/2", ["3λ/2", "3λ", "7λ/2"], "nth dark fringe: (2n − 1)λ/2 = 5λ/2 for n = 3.")
P(WO, "concept", "moderate", "Interference fringes in YDSE are made wider when",
  "the slit separation is reduced", ["the screen is moved closer", "light of shorter wavelength is used", "the slits are made narrower without changing their separation"], "β = λD/d increases as d decreases.")
