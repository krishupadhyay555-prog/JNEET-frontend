"""Batch 5 — Physics B (NEET + JEE): Units, Oscillations, Thermal Properties, AC, EMI, Waves,
Thermodynamics, Solids and Fluids, Kinetic Theory, Rotation, Laws of Motion, Kinematics.
Original questions; every number is computed below. 28 Nov 2026."""
from math import pi, sqrt, log, exp, sin, cos, tan, radians, degrees, atan, asin
from qlib import mcq, sig, u

def P(chap, cat, diff, text, correct, wrongs, expl):
    mcq("BOTH", "Physics", chap, cat, diff, text, correct, wrongs, expl)
g = 9.8

# ═════════════════════════ Units and Measurement ═════════════════════════
U = "Units and Measurement"
P(U, "tough", "tough", "In the van der Waals equation (P + a/V²)(V − b) = RT, the dimensions of a/b are",
  "[ML²T⁻²]", ["[ML⁵T⁻²]", "[L³]", "[ML⁻¹T⁻²]"], "a/V² is a pressure, so [a] = [ML⁻¹T⁻²][L⁶] = [ML⁵T⁻²]; [b] = [L³]. a/b = [ML²T⁻²] (energy).")
P(U, "tough", "moderate", "The momentum of a body is measured with 2% error and its mass with 1% error. The maximum error in its kinetic energy K = p²/2m is",
  "5%", ["3%", "4%", "1%"], "ΔK/K = 2(Δp/p) + Δm/m = 4% + 1% = 5%.")
P(U, "formula", "easy", "The radius of a sphere is measured with 2% error. The maximum error in its volume is",
  "6%", ["2%", "4%", "8%"], "V ∝ r³ ⇒ ΔV/V = 3 × 2%.")
P(U, "concept", "moderate", "Which pair has the same dimensions?",
  "Planck's constant and angular momentum", ["torque and power", "impulse and force", "stress and strain"], "Both are [ML²T⁻¹]. Torque = energy, impulse = momentum, strain is dimensionless.")
P(U, "concept", "moderate", "The quantity 1/√(μ₀ε₀) has the dimensions of",
  "velocity", ["acceleration", "force", "energy"], "1/√(μ₀ε₀) = c, the speed of light.")
P(U, "formula", "easy", "The number of significant figures in 0.005070 is",
  "4", ["3", "6", "7"], "Leading zeros don't count; the zero between 5 and 7 and the trailing zero after the decimal do: 5, 0, 7, 0.")
Fu = 2 * 3 / 2 ** 2
P(U, "tough", "tough", "In a new system the unit of mass is 2 kg, of length 3 m and of time 2 s. One unit of force in this system equals",
  f"{Fu:g} N", ["6 N", "3 N", "12 N"], f"[F] = MLT⁻²: 2 × 3/2² = {Fu:g} N.")
P(U, "concept", "moderate", "Which of these does NOT have the dimensions of time? (R resistance, L inductance, C capacitance)",
  "L/C", ["RC", "L/R", "√(LC)"], "RC, L/R and √(LC) are all times; L/C has dimensions of R².")
P(U, "tough", "tough", "Using a pendulum, L = 100.0 cm is measured to ±0.1 cm and T = 2.00 s to ±0.01 s. The maximum percentage error in g = 4π²L/T² is",
  "1.1%", ["0.6%", "1.0%", "0.2%"], "Δg/g = ΔL/L + 2ΔT/T = 0.1% + 2 × 0.5% = 1.1%.")
P(U, "concept", "moderate", "The dimensional formula of the Stefan–Boltzmann constant σ (P = σAT⁴) is",
  "[MT⁻³K⁻⁴]", ["[ML²T⁻³K⁻⁴]", "[MLT⁻²K⁻⁴]", "[ML⁻¹T⁻²K⁻⁴]"], "σ = P/(AT⁴) = [ML²T⁻³]/([L²][K⁴]).")
P(U, "formula", "easy", "1 joule expressed in ergs is",
  "10⁷ erg", ["10⁵ erg", "10³ erg", "10⁻⁷ erg"], "1 J = 1 kg m² s⁻² = 10³ g × 10⁴ cm² s⁻² = 10⁷ erg.")

# ═════════════════════════ Oscillations ═════════════════════════
O = "Oscillations"
P(O, "formula", "moderate", "A particle in SHM has amplitude A and angular frequency ω. Its speed when the displacement is A/2 is",
  "(√3/2)Aω", ["Aω/2", "Aω", "Aω/√2"], "v = ω√(A² − x²) = ω√(3A²/4).")
P(O, "formula", "moderate", "In SHM of amplitude A, the kinetic energy equals the potential energy at a displacement of",
  "A/√2", ["A/2", "A/4", "A√3/2"], "½k(A² − x²) = ½kx² ⇒ x = A/√2.")
P(O, "tough", "moderate", "A mass on a spring has period T. The spring is replaced by two identical springs in series. The new period is",
  "√2 T", ["T/√2", "2T", "T"], "Series: k_eff = k/2, so T ∝ 1/√k becomes √2 T (parallel: 2k, T/√2).")
To = 2 * pi * sqrt(0.5 / 200)
P(O, "formula", "easy", "A 0.5 kg block on a spring of constant 200 N/m oscillates. Its period is about",
  f"{To:.3f} s", [f"{To/(2*pi):.3f} s", f"{2*pi*sqrt(200/0.5):.0f} s", f"{To*2:.3f} s"], f"T = 2π√(m/k) = 2π√(0.0025) = 2π × 0.05 ≈ {To:.3f} s.")
P(O, "tough", "tough", "A simple pendulum has period T in a stationary lift. When the lift accelerates UPWARD at g/2, the period becomes",
  "T√(2/3)", ["T√(3/2)", "T√2", "T/2"], "g_eff = g + g/2 = 3g/2, and T ∝ 1/√g_eff.")
P(O, "tough", "tough", "A particle in SHM starts from the mean position. The minimum time it takes to reach half the amplitude is",
  "T/12", ["T/6", "T/8", "T/4"], "x = A sin ωt = A/2 ⇒ ωt = π/6 ⇒ t = T/12.")
amax = (2 * pi * 2) ** 2 * 0.05
P(O, "formula", "moderate", "A particle oscillates in SHM with amplitude 5 cm and frequency 2 Hz. Its maximum acceleration is about",
  f"{amax:.1f} m/s²", [f"{2*pi*2*0.05:.2f} m/s²", f"{4*0.05:.1f} m/s²", f"{amax*2:.1f} m/s²"], f"a_max = ω²A = (4π)² × 0.05 ≈ {amax:.1f} m/s².")
P(O, "tough", "moderate", "If both the amplitude and the frequency of a harmonic oscillator are doubled, its total energy becomes",
  "16 times", ["4 times", "8 times", "2 times"], "E = ½mω²A² ∝ f²A² → 4 × 4.")
Tm = 2 * sqrt(6)
P(O, "formula", "moderate", "A 'seconds pendulum' (period 2 s on Earth) is taken to the Moon where g is one-sixth. Its period there is about",
  f"{Tm:.1f} s", ["12 s", f"{2/sqrt(6):.2f} s", "2 s"], f"T ∝ 1/√g ⇒ T = 2√6 ≈ {Tm:.1f} s.")
P(O, "concept", "moderate", "In SHM, the phase difference between displacement and acceleration is",
  "π", ["π/2", "0", "π/4"], "a = −ω²x: always opposite to the displacement.")
P(O, "concept", "moderate", "In forced oscillations, resonance occurs when",
  "the driving frequency equals the natural frequency", ["damping is zero", "the driving force is maximum", "the driving frequency is twice the natural frequency"], "At resonance the amplitude is largest; its sharpness depends on damping.")
P(O, "formula", "moderate", "The displacement of a particle is x = 3 sin(2t) + 4 cos(2t) (in cm). Its amplitude is",
  "5 cm", ["7 cm", "1 cm", "3.5 cm"], "Two SHMs in quadrature combine as A = √(3² + 4²).")
P(O, "concept", "moderate", "The time period of a simple pendulum increases when",
  "the bob is a hollow sphere slowly losing water through a hole at the bottom (at first)", ["the mass of the bob is doubled", "the amplitude is halved (small angles)", "it is taken to the poles"], "As water drains, the centre of mass first goes down, so the effective length increases (later it comes back up). Mass and small amplitude don't matter; g is larger at the poles.")

# ═════════════════════════ Thermal Properties of Matter ═════════════════════════
TH = "Thermal Properties of Matter"
dl = 2 * 1.2e-5 * 50 * 1000
P(TH, "formula", "easy", "A steel rod 2 m long (α = 1.2 × 10⁻⁵ K⁻¹) is heated through 50 K. Its increase in length is",
  f"{dl:.1f} mm", [f"{dl/10:.2f} mm", f"{dl*10:.0f} mm", f"{dl/2:.1f} mm"], f"ΔL = LαΔT = 2 × 1.2 × 10⁻⁵ × 50 = {dl/1000:.4f} m = {dl:.1f} mm.")
P(TH, "tough", "tough", "10 g of ice at 0 °C is added to 50 g of water at 40 °C. Taking L_f = 80 cal/g and ignoring the container, the final temperature is",
  "20 °C", ["0 °C", "33.3 °C", "26.7 °C"], "Heat to melt the ice = 800 cal; water can give 50 × 40 = 2000 cal. Then 2000 − 800 = 1200 = 60 × T ⇒ T = 20 °C.")
Ts = (10 * 540 + 10 * 100 + 100 * 20) / 110
P(TH, "tough", "tough", "10 g of steam at 100 °C is passed into 100 g of water at 20 °C. Taking L_v = 540 cal/g, the final temperature is about",
  f"{Ts:.1f} °C", ["100 °C", f"{(10*100+100*20)/110:.1f} °C", f"{(10*540+100*20)/110:.1f} °C"],
  f"10 × 540 + 10(100 − T) = 100(T − 20) ⇒ 8400 = 110T ⇒ T ≈ {Ts:.1f} °C.")
T2 = 56 / 1.2
P(TH, "tough", "tough", "A body cools from 80 °C to 60 °C in 5 minutes in a room at 20 °C. Using Newton's law (average-temperature form), its temperature after the next 5 minutes is about",
  f"{T2:.1f} °C", ["40.0 °C", "50.0 °C", "53.3 °C"], f"(80 − 60)/5 = k(70 − 20) ⇒ k = 0.08. Next: (60 − T)/5 = 0.08((60 + T)/2 − 20) ⇒ 56 = 1.2T ⇒ T ≈ {T2:.1f} °C.")
P(TH, "formula", "easy", "The wavelength of maximum emission from a star is 500 nm. Its surface temperature is about (b = 2.9 × 10⁻³ m K)",
  "5800 K", ["1450 K", "580 K", "58 000 K"], "λ_m T = b ⇒ T = 2.9 × 10⁻³/5 × 10⁻⁷ = 5800 K.")
P(TH, "formula", "easy", "The absolute temperature of a black body is doubled. The power it radiates becomes",
  "16 times", ["4 times", "2 times", "8 times"], "P ∝ T⁴.")
P(TH, "concept", "moderate", "For an isotropic solid, the coefficients of linear (α), area (β) and volume (γ) expansion are related as",
  "α : β : γ = 1 : 2 : 3", ["α : β : γ = 3 : 2 : 1", "α : β : γ = 1 : 4 : 9", "α = β = γ"], "β = 2α and γ = 3α for small expansions.")
st = 2e11 * 1.2e-5 * 50
P(TH, "tough", "tough", "A steel rod (Y = 2 × 10¹¹ N/m², α = 1.2 × 10⁻⁵ K⁻¹) is clamped between rigid walls and heated by 50 K. The thermal stress developed is",
  u(st, "N/m²"), [u(st / 2, "N/m²"), u(st * 50, "N/m²"), u(2e11 * 1.2e-5, "N/m²")], f"Stress = YαΔT = 2 × 10¹¹ × 1.2 × 10⁻⁵ × 50 = {sig(st)} N/m².")
P(TH, "formula", "easy", "The temperature at which the Celsius and Fahrenheit scales read the same number is",
  "−40°", ["0°", "40°", "−32°"], "F = 9C/5 + 32 with F = C ⇒ C = −40.")
loss = 0.5 * 1.2e-5 * 10 * 86400
P(TH, "tough", "tough", "A pendulum clock with a steel rod (α = 1.2 × 10⁻⁵ K⁻¹) keeps correct time at 20 °C. At 30 °C it",
  f"loses about {loss:.1f} s per day", [f"gains about {loss:.1f} s per day", f"loses about {2*loss:.1f} s per day", f"loses about {loss/2:.1f} s per day"],
  f"T ∝ √L, so ΔT/T = ½αΔθ. Time lost per day = ½ × 1.2 × 10⁻⁵ × 10 × 86400 ≈ {loss:.1f} s (it runs slow).")
P(TH, "concept", "moderate", "Water has its maximum density at",
  "4 °C", ["0 °C", "100 °C", "−4 °C"], "Between 0 °C and 4 °C water contracts on heating (anomalous expansion), which is why lakes freeze from the top.")
H = 200 * 1e-4 * 100 / 0.5
P(TH, "formula", "moderate", "A copper rod (k = 200 W m⁻¹ K⁻¹) of length 0.5 m and cross-section 1 cm² has its ends at 100 °C and 0 °C. The rate of heat flow is",
  f"{H:.0f} W", [f"{H*100:.0f} W", f"{H/2:.0f} W", f"{H*2:.0f} W"], f"H = kAΔT/L = 200 × 10⁻⁴ × 100/0.5 = {H:.0f} W.")
P(TH, "tough", "tough", "Two rods of equal length and area, conductivities k and 2k, are joined end to end. The equivalent conductivity of the combination is",
  "4k/3", ["3k/2", "3k", "2k/3"], "Series: L/k_eq·2 = L/k + L/2k ⇒ 2/k_eq = 3/(2k) ⇒ k_eq = 4k/3.")

# ═════════════════════════ Alternating Current ═════════════════════════
AC = "Alternating Current"
P(AC, "formula", "easy", "The peak value of the 220 V (rms) mains voltage is about",
  "311 V", ["220 V", "156 V", "440 V"], "V₀ = √2 × 220 ≈ 311 V.")
XL = 2 * pi * 50 * 0.5; XC = 1 / (2 * pi * 50 * 10e-6)
P(AC, "formula", "easy", "The reactance of a 0.5 H inductor at 50 Hz is about",
  f"{XL:.0f} Ω", [f"{0.5*50:.0f} Ω", f"{1/XL*1e3:.1f} Ω", f"{XL*2:.0f} Ω"], f"X_L = 2πfL = 2π × 50 × 0.5 ≈ {XL:.0f} Ω.")
P(AC, "formula", "easy", "The reactance of a 10 µF capacitor at 50 Hz is about",
  f"{XC:.0f} Ω", [f"{2*pi*50*10e-6*1e6:.0f} Ω", f"{XC/2:.0f} Ω", f"{XC*2*pi:.0f} Ω"], f"X_C = 1/(2πfC) = 1/(2π × 50 × 10⁻⁵) ≈ {XC:.0f} Ω.")
for R_, XL_, XC_, V in ((30, 80, 40, 200), (40, 50, 80, 100)):
    Z = sqrt(R_ ** 2 + (XL_ - XC_) ** 2); I = V / Z; pf = R_ / Z
    P(AC, "tough", "tough", f"A series LCR circuit has R = {R_} Ω, X_L = {XL_} Ω and X_C = {XC_} Ω across {V} V (rms). The current and power factor are",
      f"{I:g} A, {pf:g}", [f"{V/(R_+XL_+XC_):.2f} A, {pf:g}", f"{V/R_:.2f} A, 1", f"{I:g} A, {sqrt(1-pf*pf):.1f}"],
      f"Z = √({R_}² + {abs(XL_-XC_)}²) = {Z:g} Ω; I = {V}/{Z:g} = {I:g} A; cos φ = R/Z = {pf:g}.")
f0 = 1 / (2 * pi * sqrt(0.1 * 10e-6))
P(AC, "formula", "moderate", "The resonant frequency of a series circuit with L = 0.1 H and C = 10 µF is about",
  f"{f0:.0f} Hz", [f"{f0*2*pi:.0f} Hz", f"{1/sqrt(0.1*10e-6)/1000:.1f} Hz", f"{f0/2:.0f} Hz"], f"f₀ = 1/(2π√(LC)) = 1/(2π × 10⁻³) ≈ {f0:.0f} Hz (ω₀ = 1000 rad/s).")
Qf = (1 / 10) * sqrt(0.1 / 10e-6)
P(AC, "formula", "moderate", "The quality factor of a series LCR circuit with R = 10 Ω, L = 0.1 H and C = 10 µF is",
  f"{Qf:.0f}", [f"{Qf*10:.0f}", f"{Qf/10:.0f}", f"{0.1/10:.2f}"], f"Q = (1/R)√(L/C) = 0.1 × √(10⁴) = {Qf:.0f}.")
P(AC, "formula", "easy", "A step-up transformer has 100 primary and 500 secondary turns. With 220 V on the primary, the secondary voltage is (ideal)",
  "1100 V", ["44 V", "220 V", "5500 V"], "V_s/V_p = N_s/N_p = 5.")
P(AC, "tough", "moderate", "An ideal transformer steps 220 V down to 11 V and supplies 5 A to a lamp. The primary current is",
  "0.25 A", ["100 A", "5 A", "2.5 A"], "V_pI_p = V_sI_s ⇒ I_p = 11 × 5/220 = 0.25 A.")
P(AC, "concept", "moderate", "The average power consumed in an AC circuit containing only an ideal inductor is",
  "zero, since current and voltage differ in phase by 90°", ["V_rms I_rms", "V₀I₀/2", "maximum at resonance"], "P = V_rms I_rms cos 90° = 0 — the current is 'wattless'.")
P(AC, "concept", "moderate", "In a purely capacitive AC circuit, the current",
  "leads the voltage by π/2", ["lags the voltage by π/2", "is in phase with the voltage", "leads the voltage by π"], "i = C dv/dt: for v = V₀ sin ωt, i = ωCV₀ cos ωt.")
P(AC, "formula", "moderate", "At resonance in a series LCR circuit with R = 50 Ω across 200 V (rms), the power dissipated is",
  "800 W", ["400 W", "200 W", "4 W"], "At resonance Z = R, I = 4 A, P = I²R = 800 W.")
P(AC, "concept", "moderate", "In an LC circuit oscillating freely, when the energy is shared equally between the capacitor and the inductor, the charge on the capacitor is",
  "Q₀/√2", ["Q₀/2", "Q₀", "zero"], "q²/2C = ½ × Q₀²/2C ⇒ q = Q₀/√2.")

# ═════════════════════════ Electromagnetic Induction ═════════════════════════
EMI = "Electromagnetic Induction"
P(EMI, "formula", "easy", "A 100-turn coil of area 0.01 m² is in a field that falls uniformly from 0.5 T to zero in 0.1 s (field normal to the coil). The induced emf is",
  "5 V", ["0.05 V", "50 V", "0.5 V"], "ε = NA ΔB/Δt = 100 × 0.01 × 0.5/0.1 = 5 V.")
P(EMI, "formula", "easy", "A 0.5 m rod moves at 4 m/s perpendicular to a 0.2 T field (rod, velocity and field mutually perpendicular). The emf across its ends is",
  "0.4 V", ["2 V", "0.1 V", "1.6 V"], "ε = Bvl = 0.2 × 4 × 0.5.")
P(EMI, "tough", "moderate", "A 1 m metal rod rotates at 20 rad/s about one end in a plane perpendicular to a 0.5 T field. The emf between its ends is",
  "5 V", ["10 V", "2.5 V", "20 V"], "ε = ½Bωl² = 0.5 × 0.5 × 20 × 1.")
P(EMI, "formula", "easy", "The energy stored in a 2 H inductor carrying 3 A is",
  "9 J", ["6 J", "18 J", "3 J"], "U = ½LI² = ½ × 2 × 9.")
Ls = 4 * pi * 1e-7 * 1000 ** 2 * 1e-3 / 0.5
P(EMI, "formula", "moderate", "A solenoid 50 cm long with 1000 turns has cross-section 10 cm². Its self-inductance is about",
  u(Ls * 1e3, "mH"), [u(Ls * 1e3 / 1000, "mH"), u(Ls * 1e3 * 2, "mH"), u(Ls * 1e3 * 100, "mH")], f"L = μ₀N²A/l = 4π × 10⁻⁷ × 10⁶ × 10⁻³/0.5 ≈ {Ls*1e3:.2f} mH.")
P(EMI, "formula", "easy", "Two coils have mutual inductance 0.2 H. The current in one changes at 50 A/s. The emf induced in the other is",
  "10 V", ["250 V", "0.004 V", "5 V"], "ε = M dI/dt.")
P(EMI, "concept", "moderate", "In an LR circuit switched on at t = 0, the time constant τ = L/R is the time in which the current rises to about",
  "63% of its final value", ["37% of its final value", "50% of its final value", "100% of its final value"], "I = I₀(1 − e^{−t/τ}); at t = τ, I = 0.63I₀.")
e0 = 100 * 0.1 * 0.02 * 2 * pi * 50
P(EMI, "formula", "moderate", "A 100-turn coil of area 200 cm² rotates at 50 rev/s in a 0.1 T field. The peak emf is about",
  f"{e0:.0f} V", [f"{100*0.1*0.02*50:.0f} V", f"{e0/sqrt(2):.0f} V", f"{e0*2:.0f} V"], f"ε₀ = NBAω = 100 × 0.1 × 0.02 × 2π × 50 ≈ {e0:.0f} V.")
P(EMI, "concept", "moderate", "A bar magnet is dropped through a long vertical copper tube. It falls",
  "with an acceleration less than g, because eddy currents oppose its motion", ["freely with acceleration g", "faster than g", "and stops inside the tube permanently"], "Lenz's law: induced currents in the tube oppose the change in flux, slowing the magnet.")
P(EMI, "concept", "easy", "Lenz's law is a consequence of the law of conservation of",
  "energy", ["charge", "momentum", "mass"], "If the induced current aided the change, energy would be created from nothing.")
P(EMI, "concept", "moderate", "Eddy currents are put to USE in",
  "electromagnetic braking, induction furnaces and damping of galvanometers", ["making transformer cores hot on purpose", "increasing the efficiency of motors", "storing electrical energy"], "In transformers they are unwanted, so cores are laminated.")
P(EMI, "tough", "tough", "The flux through a coil varies as Φ = (5t² + 2t) mWb. The emf induced at t = 2 s is",
  "22 mV", ["24 mV", "20 mV", "12 mV"], "ε = dΦ/dt = 10t + 2 = 22 mV.")

# ═════════════════════════ Waves ═════════════════════════
WV = "Waves"
P(WV, "formula", "easy", "A string of linear mass density 0.01 kg/m is under 100 N tension. The speed of a transverse wave on it is",
  "100 m/s", ["10 m/s", "1000 m/s", "1 m/s"], "v = √(T/μ) = √10⁴.")
P(WV, "formula", "moderate", "A 0.5 m string fixed at both ends carries waves at 100 m/s. The frequency of its third harmonic is",
  "300 Hz", ["100 Hz", "150 Hz", "600 Hz"], "f_n = nv/2L = 3 × 100/1.")
P(WV, "formula", "moderate", "A pipe 85 cm long closed at one end (v = 340 m/s). The first two frequencies it can produce are",
  "100 Hz and 300 Hz", ["200 Hz and 400 Hz", "100 Hz and 200 Hz", "50 Hz and 150 Hz"], "Closed pipe: f = (2n − 1)v/4L; v/4L = 100 Hz, only odd harmonics.")
P(WV, "formula", "moderate", "The fundamental frequency of an open pipe is 200 Hz. Its second overtone is",
  "600 Hz", ["400 Hz", "1000 Hz", "300 Hz"], "Open pipe has all harmonics; the second overtone is the third harmonic.")
P(WV, "tough", "tough", "A tuning fork of 256 Hz gives 4 beats/s with fork X. When X is loaded with a little wax, the beats become 6/s. The original frequency of X was",
  "252 Hz", ["260 Hz", "250 Hz", "262 Hz"], "X is 252 or 260 Hz. Wax LOWERS X's frequency. From 260 it would move towards 256 and beats would fall; from 252 it moves away (to 250) and beats rise to 6. So X = 252 Hz.")
P(WV, "formula", "moderate", "A wave is y = 0.05 sin(2πx − 100πt) in SI units. Its speed is",
  "50 m/s", ["100 m/s", "2 m/s", "314 m/s"], "v = ω/k = 100π/2π.")
P(WV, "formula", "moderate", "Two points on a wave of wavelength 1.2 m are 0.4 m apart along the direction of travel. Their phase difference is",
  "2π/3", ["π/3", "π", "π/2"], "Δφ = 2πΔx/λ = 2π × 0.4/1.2.")
P(WV, "formula", "moderate", "The speed of sound in a gas at 27 °C is 340 m/s. At 127 °C it is about",
  f"{340*sqrt(400/300):.0f} m/s", [f"{340*400/300:.0f} m/s", "340 m/s", f"{340*sqrt(127/27):.0f} m/s"], "v ∝ √T (in kelvin): 340 × √(400/300).")
P(WV, "concept", "easy", "In a standing wave, the distance between two consecutive nodes is",
  "λ/2", ["λ", "λ/4", "2λ"], "Node to adjacent antinode is λ/4.")
P(WV, "concept", "moderate", "If the amplitude of a sound wave is doubled at the same frequency, its intensity becomes",
  "4 times", ["2 times", "8 times", "unchanged"], "I ∝ A²ω².")
P(WV, "concept", "moderate", "Sound waves cannot be polarised because they are",
  "longitudinal", ["transverse", "too slow", "of low frequency"], "Only transverse waves have a direction of oscillation across the propagation that can be selected.")
P(WV, "tough", "tough", "The tension in a sonometer wire is increased by 44%. Its fundamental frequency increases by",
  "20%", ["44%", "12%", "22%"], "f ∝ √T: √1.44 = 1.2.")

# ═════════════════════════ Thermodynamics ═════════════════════════
TD = "Thermodynamics"
W1 = 2 * 8.314 * 300 * log(2)
P(TD, "formula", "moderate", "Two moles of an ideal gas expand isothermally at 300 K to twice their volume. The work done by the gas is about (R = 8.314 J/mol K)",
  f"{W1:.0f} J", [f"{2*8.314*300:.0f} J", f"{W1/2:.0f} J", f"{2*8.314*300*2:.0f} J"], f"W = nRT ln(V₂/V₁) = 2 × 8.314 × 300 × 0.693 ≈ {W1:.0f} J.")
P(TD, "tough", "tough", "A monoatomic ideal gas (γ = 5/3) is compressed adiabatically to 1/8 of its volume. Its absolute temperature becomes",
  "4 times", ["8 times", "2 times", "32 times"], "TV^{γ−1} = constant: T₂ = T₁ × 8^{2/3} = 4T₁.")
P(TD, "formula", "easy", "A Carnot engine works between 500 K and 300 K. Its efficiency is",
  "40%", ["60%", "66.7%", "20%"], "η = 1 − 300/500.")
cop = 273 / (300 - 273)
P(TD, "formula", "moderate", "A Carnot refrigerator keeps its inside at 0 °C in a 27 °C room. Its coefficient of performance is about",
  f"{cop:.1f}", [f"{300/27:.1f}", f"{27/273:.2f}", f"{1-273/300:.2f}"], f"COP = T₂/(T₁ − T₂) = 273/27 ≈ {cop:.1f}.")
P(TD, "formula", "easy", "A gas absorbs 500 J of heat and does 200 J of work. The change in its internal energy is",
  "+300 J", ["+700 J", "−300 J", "+200 J"], "ΔU = Q − W.")
P(TD, "tough", "tough", "Heat Q is supplied to a diatomic ideal gas at constant pressure. The fraction of Q converted into work is",
  "2/7", ["5/7", "2/5", "3/5"], "W/Q = nRΔT/(nC_pΔT) = R/(7R/2).")
P(TD, "concept", "moderate", "In the free expansion of an ideal gas into vacuum (insulated container), which quantity stays the same?",
  "internal energy and temperature", ["pressure", "volume", "entropy"], "Q = 0 and W = 0 ⇒ ΔU = 0; for an ideal gas T is unchanged. Volume grows, pressure falls, entropy rises.")
Wad = (2e5 * 1e-3 - 1e5 * 1.5e-3) / (1.4 - 1)
P(TD, "tough", "tough", "An ideal gas (γ = 1.4) expands adiabatically from (2 × 10⁵ Pa, 1 L) to (1 × 10⁵ Pa, 1.5 L). The work done by the gas is",
  f"{Wad:.0f} J", [f"{Wad*0.4:.0f} J", f"{2e5*0.5e-3:.0f} J", f"{Wad*1.4:.0f} J"], f"W = (P₁V₁ − P₂V₂)/(γ − 1) = (200 − 150)/0.4 = {Wad:.0f} J.")
P(TD, "concept", "moderate", "In a cyclic process on a P–V diagram, the net work done by the gas equals",
  "the area enclosed by the loop (positive if traced clockwise)", ["zero always", "P × V at the starting point", "the change in internal energy"], "ΔU = 0 over a cycle, so Q_net = W_net = enclosed area.")
P(TD, "concept", "moderate", "The second law of thermodynamics implies that",
  "no heat engine working in a cycle can convert all the heat it takes into work", ["energy is always conserved", "the internal energy of an ideal gas depends only on T", "heat flows from cold to hot by itself"], "Kelvin–Planck statement; energy conservation is the first law.")
P(TD, "formula", "moderate", "In an isochoric process, 600 J of heat is supplied to 2 mol of a monoatomic ideal gas. Its temperature rises by about",
  f"{600/(2*1.5*8.314):.0f} K", [f"{600/(2*2.5*8.314):.0f} K", f"{600/(2*8.314):.0f} K", f"{600/(1.5*8.314):.0f} K"], "Q = nC_vΔT with C_v = 3R/2.")

# ═════════════════════════ Mechanical Properties of Solids and Fluids ═════════════════════════
SF = "Mechanical Properties of Solids and Fluids"
dl2 = 100 * 2 / (pi * (0.5e-3) ** 2 * 2e11) * 1000
P(SF, "formula", "moderate", "A steel wire 2 m long and 1 mm in diameter carries a 100 N load (Y = 2 × 10¹¹ N/m²). Its extension is about",
  f"{dl2:.2f} mm", [f"{dl2/4:.3f} mm", f"{dl2*4:.2f} mm", f"{dl2/2:.2f} mm"], f"Δl = FL/(AY) = 100 × 2/(π × (0.5 × 10⁻³)² × 2 × 10¹¹) ≈ {dl2:.2f} mm.")
P(SF, "formula", "moderate", "Water has bulk modulus 2.2 × 10⁹ Pa. The pressure needed to reduce its volume by 0.1% is",
  "2.2 × 10⁶ Pa", ["2.2 × 10⁸ Pa", "2.2 × 10⁷ Pa", "2.2 × 10⁵ Pa"], "P = BΔV/V = 2.2 × 10⁹ × 10⁻³.")
P(SF, "formula", "moderate", "The excess pressure inside a soap bubble of radius 2 cm (surface tension 0.03 N/m) is",
  "6 Pa", ["3 Pa", "1.5 Pa", "12 Pa"], "Two surfaces: ΔP = 4T/r = 0.12/0.02.")
Wb = 8 * pi * 0.05 ** 2 * 0.03
P(SF, "tough", "tough", "The work done in blowing a soap bubble of radius 5 cm (surface tension 0.03 N/m) from a very small size is about",
  u(Wb, "J"), [u(Wb / 2, "J"), u(Wb * 2, "J"), u(Wb / 8, "J")], f"Two surfaces: W = T × 2 × 4πr² = 8πr²T ≈ {sig(Wb)} J.")
vT = sqrt(2 * g * 5)
P(SF, "formula", "moderate", "Water flows out of a small hole 5 m below the free surface of a wide tank. The speed of efflux is about",
  f"{vT:.1f} m/s", [f"{g*5:.0f} m/s", f"{sqrt(g*5):.1f} m/s", f"{2*g*5:.0f} m/s"], f"v = √(2gh) = √(98) ≈ {vT:.1f} m/s.")
P(SF, "formula", "easy", "Water flows through a pipe at 2 m/s where its area is 10 cm². Where the area is 4 cm², the speed is",
  "5 m/s", ["0.8 m/s", "2 m/s", "10 m/s"], "A₁v₁ = A₂v₂.")
P(SF, "tough", "tough", "Eight identical rain drops, each falling at terminal speed v, merge into one drop. The terminal speed of the big drop is",
  "4v", ["2v", "8v", "16v"], "Radius becomes 2r; v_t ∝ r² ⇒ 4v.")
P(SF, "formula", "easy", "In a hydraulic lift, the small piston has area 10 cm² and the large one 500 cm². A 200 N force on the small piston can lift",
  "10 000 N", ["4 N", "2000 N", "200 N"], "Pascal's law: F₂ = F₁A₂/A₁ = 200 × 50.")
P(SF, "formula", "moderate", "A block of wood (density 600 kg/m³) floats in water. The fraction of its volume above the water is",
  "0.4", ["0.6", "0.5", "0.25"], "Fraction submerged = 600/1000 = 0.6.")
P(SF, "tough", "tough", "Energy stored per unit volume in a stretched wire equals",
  "½ × stress × strain", ["stress × strain", "Y × strain", "½ × stress/strain"], "u = ½σε = σ²/2Y.")
P(SF, "tough", "tough", "A wire stretched by a load breaks when its length is 1.02 times the original. If a wire of the same material but double the radius is used, the load at which it breaks is",
  "4 times", ["2 times", "the same", "half"], "Breaking stress is a material property; breaking load = stress × area ∝ r².")
P(SF, "concept", "moderate", "The angle of contact between pure water and clean glass is about 0°, and between mercury and glass it is about 140°. Hence in a glass capillary",
  "water rises and mercury is depressed", ["both rise", "both are depressed", "water is depressed and mercury rises"], "h ∝ cos θ: positive for θ < 90°, negative for θ > 90°.")
Re = 1000 * 2 * 0.02 / 1e-3
P(SF, "formula", "moderate", "Water (ρ = 1000 kg/m³, η = 10⁻³ Pa s) flows at 2 m/s through a 2 cm wide pipe. The Reynolds number is about",
  f"{Re:.0f}", [f"{Re/10:.0f}", f"{Re*10:.0f}", f"{Re/2:.0f}"], f"Re = ρvD/η = 1000 × 2 × 0.02/10⁻³ = {Re:.0f} — far above ~2000, so the flow is turbulent.")

# ═════════════════════════ Kinetic Theory ═════════════════════════
KT = "Kinetic Theory"
v_rms = sqrt(3 * 8.314 * 300 / 0.032)
P(KT, "formula", "moderate", "The rms speed of oxygen molecules (M = 32 g/mol) at 300 K is about",
  f"{v_rms:.0f} m/s", [f"{sqrt(3*8.314*300/32):.1f} m/s", f"{sqrt(2*8.314*300/0.032):.0f} m/s", f"{v_rms*2:.0f} m/s"], f"v_rms = √(3RT/M) = √(3 × 8.314 × 300/0.032) ≈ {v_rms:.0f} m/s (use M in kg/mol).")
P(KT, "formula", "moderate", "At what temperature is the rms speed of a gas double its value at 27 °C?",
  "927 °C", ["54 °C", "327 °C", "1200 °C"], "v ∝ √T ⇒ T = 4 × 300 = 1200 K = 927 °C.")
P(KT, "formula", "moderate", "The ratio C_p/C_v for a mixture of 1 mol of a monoatomic and 1 mol of a diatomic ideal gas is",
  "3/2", ["1.4", "5/3", "4/3"], "C_v = (3R/2 + 5R/2)/2 = 2R; C_p = 3R; γ = 3/2.")
P(KT, "concept", "moderate", "According to the law of equipartition, the average energy of a diatomic molecule (rigid, no vibration) at temperature T is",
  "(5/2)kT", ["(3/2)kT", "(7/2)kT", "kT"], "3 translational + 2 rotational degrees of freedom, ½kT each.")
P(KT, "tough", "tough", "The mean free path of gas molecules is λ at pressure P and temperature T. If the pressure is doubled and the temperature halved, the mean free path becomes",
  "λ/4", ["λ", "4λ", "λ/2"], "λ = kT/(√2 πd²P) ∝ T/P.")
P(KT, "formula", "moderate", "The pressure of an ideal gas is related to its density ρ and rms speed by",
  "P = ⅓ρv²_rms", ["P = ½ρv²_rms", "P = ρv²_rms", "P = ⅔ρv²_rms"], "From the kinetic theory derivation P = ⅓(N/V)m v̄².")
P(KT, "formula", "moderate", "The total translational kinetic energy of 1 mol of an ideal gas at 300 K is about",
  f"{1.5*8.314*300:.0f} J", [f"{8.314*300:.0f} J", f"{2.5*8.314*300:.0f} J", "6.2 × 10⁻²¹ J"], "E = (3/2)RT per mole (the last option is for ONE molecule).")
P(KT, "tough", "tough", "A vessel holds hydrogen and oxygen at the same temperature. The ratio of rms speeds v_H₂/v_O₂ is",
  "4", ["16", "1/4", "2"], "v ∝ 1/√M: √(32/2).")

# ═════════════════════════ Rotation ═════════════════════════
RT = "System of Particles and Rotational Motion"
P(RT, "tough", "tough", "A solid sphere rolls without slipping down an incline of height h. Its speed at the bottom is",
  "√(10gh/7)", ["√(2gh)", "√(4gh/3)", "√(gh)"], "mgh = ½mv²(1 + 2/5) ⇒ v² = 10gh/7. (A ring gives √(gh), a disc √(4gh/3).)")
P(RT, "formula", "moderate", "The moment of inertia of a uniform rod of mass M and length L about an axis through one end, perpendicular to it, is",
  "ML²/3", ["ML²/12", "ML²/2", "ML²"], "Parallel axis: ML²/12 + M(L/2)².")
P(RT, "tough", "moderate", "A skater spinning at 2 rev/s with arms stretched (I = 6 kg m²) pulls her arms in so that I = 2 kg m². Her new spin rate is",
  "6 rev/s", ["2 rev/s", "4 rev/s", "1/3 rev/s"], "Angular momentum is conserved: 6 × 2 = 2ω.")
P(RT, "formula", "moderate", "The fraction of the total kinetic energy that is rotational for a disc rolling without slipping is",
  "1/3", ["1/2", "2/5", "2/7"], "K_rot/K_tot = (½·½mr²ω²)/(¾mv²) = 1/3.")
P(RT, "formula", "moderate", "Masses 2 kg and 3 kg are at x = 0 and x = 5 m. The centre of mass is at",
  "x = 3 m", ["x = 2 m", "x = 2.5 m", "x = 3.5 m"], "x_cm = (0 + 15)/5.")
P(RT, "formula", "moderate", "A constant torque of 10 N m acts on a wheel of moment of inertia 2 kg m² from rest. Its angular speed after 4 s is",
  "20 rad/s", ["5 rad/s", "80 rad/s", "40 rad/s"], "α = τ/I = 5 rad/s²; ω = αt.")
P(RT, "concept", "moderate", "A ring, a disc and a solid sphere of the same mass and radius roll down the same incline from rest. The one reaching the bottom first is",
  "the solid sphere", ["the ring", "the disc", "all reach together"], "Smallest I/mr² (2/5) gives the largest acceleration g sin θ/(1 + I/mr²).")
P(RT, "formula", "moderate", "The radius of gyration of a solid sphere of radius R about a diameter is",
  "R√(2/5)", ["R/√2", "R√(2/3)", "2R/5"], "I = (2/5)MR² = MK².")

# ═════════════════════════ Laws of Motion ═════════════════════════
LM = "Laws of Motion"
P(LM, "tough", "tough", "Blocks of 2 kg and 3 kg hang over a light frictionless pulley (Atwood machine). The acceleration of the blocks is (g = 9.8 m/s²)",
  "1.96 m/s²", ["9.8 m/s²", "3.92 m/s²", "0.98 m/s²"], "a = (3 − 2)g/(3 + 2) = g/5.")
P(LM, "formula", "moderate", "A 5 kg block on a rough floor (μ_k = 0.2) is pushed with 20 N horizontally. Its acceleration is (g = 10 m/s²)",
  "2 m/s²", ["4 m/s²", "1 m/s²", "0 m/s²"], "a = (20 − 0.2 × 50)/5.")
P(LM, "tough", "tough", "A road curve of radius 100 m is banked for 20 m/s with no friction needed. The banking angle θ satisfies (g = 10 m/s²)",
  "tan θ = 0.4", ["tan θ = 0.2", "sin θ = 0.4", "tan θ = 4"], "tan θ = v²/(rg) = 400/1000.")
P(LM, "formula", "moderate", "A 60 kg person stands in a lift accelerating DOWNWARD at 2 m/s². The scale reading is (g = 10 m/s²)",
  "480 N", ["720 N", "600 N", "120 N"], "N = m(g − a).")
P(LM, "tough", "moderate", "A block just begins to slide when an incline is raised to 30°. The coefficient of static friction is",
  "1/√3", ["√3", "1/2", "√3/2"], "μ_s = tan θ (angle of repose).")
P(LM, "formula", "moderate", "A 0.1 kg ball moving at 20 m/s is stopped by a bat in 0.01 s. The average force is",
  "200 N", ["20 N", "2 N", "2000 N"], "F = Δp/Δt = 2/0.01.")
P(LM, "tough", "tough", "A 2 kg block on a smooth table is tied over a pulley at the edge to a hanging 3 kg block. The tension in the string is (g = 10 m/s²)",
  "12 N", ["30 N", "18 N", "20 N"], "a = 3g/5 = 6 m/s²; T = 2a = 12 N.")
P(LM, "formula", "moderate", "The maximum speed with which a car can take a flat curve of radius 50 m when μ_s = 0.5 is (g = 10 m/s²)",
  f"{sqrt(0.5*10*50):.1f} m/s", [f"{0.5*10*50:.0f} m/s", f"{sqrt(10*50):.1f} m/s", f"{sqrt(0.5*50):.1f} m/s"], "v_max = √(μrg) = √250.")

# ═════════════════════════ Kinematics ═════════════════════════
KN = "Kinematics"
for v0, ang in ((20, 30), (30, 45)):
    R_ = v0 ** 2 * sin(radians(2 * ang)) / g; H_ = (v0 * sin(radians(ang))) ** 2 / (2 * g)
    P(KN, "formula", "moderate", f"A projectile is launched at {v0} m/s at {ang}° to the horizontal (g = 9.8 m/s²). Its range and maximum height are about",
      f"{R_:.1f} m and {H_:.1f} m", [f"{H_:.1f} m and {R_:.1f} m", f"{R_*2:.1f} m and {H_:.1f} m", f"{R_:.1f} m and {H_*2:.1f} m"],
      f"R = v²sin 2θ/g ≈ {R_:.1f} m; H = v²sin²θ/2g ≈ {H_:.1f} m.")
P(KN, "tough", "tough", "Two projectiles are thrown with the same speed at 30° and 60°. The ratio of their maximum heights is",
  "1 : 3", ["1 : 1", "1 : √3", "3 : 1"], "H ∝ sin²θ: (1/4) : (3/4). (Their ranges are equal.)")
P(KN, "formula", "moderate", "A ball dropped from rest falls 4.9 m in the first second. The distance it covers in the 3rd second alone is",
  "24.5 m", ["44.1 m", "14.7 m", "29.4 m"], "s_n = u + a(2n − 1)/2 = 4.9 × 5.")
P(KN, "tough", "tough", "A boat crosses a 100 m river (current 3 m/s) with speed 5 m/s relative to water, heading so that it reaches the point directly opposite. The time taken is",
  "25 s", ["20 s", "33.3 s", "12.5 s"], "Effective speed across = √(5² − 3²) = 4 m/s; t = 100/4.")
P(KN, "formula", "moderate", "A body moving at 20 m/s is brought to rest with a uniform retardation of 5 m/s². The distance covered is",
  "40 m", ["80 m", "20 m", "4 m"], "v² = u² − 2as ⇒ s = 400/10.")
P(KN, "formula", "moderate", "A particle moves in a circle of radius 2 m at a constant 4 m/s. Its centripetal acceleration is",
  "8 m/s²", ["2 m/s²", "16 m/s²", "0"], "a = v²/r.")
P(KN, "tough", "tough", "A car moves the first half of a distance at 40 km/h and the second half at 60 km/h. Its average speed is",
  "48 km/h", ["50 km/h", "45 km/h", "52 km/h"], "Harmonic mean: 2 × 40 × 60/(40 + 60).")
