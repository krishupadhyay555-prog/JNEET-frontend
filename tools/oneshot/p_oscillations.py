from lib import F, X, T, sig, fx, _check_and_write
import math

# 1 x = 5 sin(πt + π/3) cm
A1, w1 = 5, math.pi; T1 = 2 * math.pi / w1; vmax1 = A1 * w1; amax1 = A1 * w1 ** 2
v2 = 2 * math.sqrt(10 ** 2 - 6 ** 2)                    # A = 10 cm, ω = 2, x = 6
T3 = 2 * math.pi * math.sqrt(0.5 / 200)                 # m = 0.5 kg, k = 200 N/m
T4 = 2 * math.pi * math.sqrt(1 / 9.8)                   # 1 m pendulum
L5 = 9.8 * 4 / (4 * math.pi ** 2)                       # seconds pendulum length
E6 = 0.5 * 200 * 0.1 ** 2                               # energy, k = 200, A = 0.1
ratio7 = (1 + 4) / 2                                    # Ts/Tp for k and 4k
x8 = 10 / math.sqrt(2)                                  # KE = PE, A = 10 cm

DOC = {
"slug": "oscillations", "subject": "Physics",
"chapters": {"NEET": "Oscillations", "JEE": "Oscillations"},
"title": "Oscillations", "readMinutes": 12,
"summary": [
"A motion that repeats after equal intervals is periodic; back-and-forth periodic motion about a mean position is oscillation.",
"Simple harmonic motion (SHM) happens when the restoring force is proportional to displacement and opposite to it: F = −kx. Then x = A sin(ωt + φ) with ω = √(k/m).",
"In SHM, speed is maximum at the mean position and zero at the extremes; acceleration is the opposite. Total energy ½kA² stays constant, shared between KE and PE.",
"Spring–mass: T = 2π√(m/k). Simple pendulum (small angle): T = 2π√(l/g), independent of mass and amplitude.",
],
"formulas": [
F("Periodic motion", "T = 1/ν;  ω = 2πν = 2π/T", "Converting time period, frequency and angular frequency."),
F("SHM condition", "F = −kx  ⇔  a = −ω² x", "Testing whether a motion is SHM.", "A uniform circular motion projected on a diameter is SHM, but a bouncing ball is periodic, not SHM."),
F("Displacement in SHM", "x = A sin(ωt + φ)  (or A cos(ωt + φ))", "Position at any time; φ is the initial phase.", None, tag="PYQ favourite"),
F("Velocity in SHM", "v = Aω cos(ωt + φ) = ±ω√(A² − x²);   v_max = Aω (at x = 0)", "Speed at a given displacement."),
F("Acceleration in SHM", "a = −ω² x;   a_max = ω² A (at x = ±A)", "Force and acceleration at the extremes.", "Acceleration is always towards the mean position — opposite to x."),
F("Energy in SHM", "KE = ½ k(A² − x²);  PE = ½ k x²;  E = ½ k A² = ½ m ω² A²", "Energy at a position.", "KE = PE at x = A/√2, not at A/2."),
F("Spring–mass system", "T = 2π √(m/k)", "Mass on a spring (horizontal or vertical).", "For a vertical spring the same formula holds — gravity only shifts the mean position.", tag="PYQ favourite"),
F("Springs in series and parallel", "series: 1/k = 1/k₁ + 1/k₂;  parallel: k = k₁ + k₂", "Combinations of springs."),
F("Cut spring", "k ∝ 1/length: cutting a spring into n equal parts gives each part nk", "Spring pieces."),
F("Simple pendulum", "T = 2π √(l/g)  (small angles, θ < ~10°)", "Pendulum clocks, measuring g.", "T does not depend on the mass of the bob or the amplitude (for small swings).", tag="PYQ favourite"),
F("Pendulum with effective g", "T = 2π√(l/g_eff);  lift accelerating up: g + a;  down: g − a;  car with horizontal a: √(g² + a²)", "Pendulums in lifts and accelerating vehicles."),
F("Phase relations", "velocity leads displacement by π/2;  acceleration leads displacement by π", "Phase questions."),
],
"examples": [
X("Reading an SHM equation", "x = 5 sin(πt + π/3) cm. Find amplitude, period, maximum speed and maximum acceleration.",
  f"A = 5 cm, ω = π rad/s → T = 2π/ω = {fx(T1)} s. v_max = Aω ≈ {fx(vmax1,1)} cm/s, a_max = Aω² ≈ {fx(amax1,1)} cm/s².",
  [(fx(T1), "2"), (fx(vmax1,1), "15.7"), (fx(amax1,1), "49.3")]),
X("Speed at a displacement", "A = 10 cm, T = π s. Speed at x = 6 cm?",
  f"ω = 2 rad/s. v = ω√(A² − x²) = 2 × √(100 − 36) = {fx(v2)} cm/s.", [(fx(v2), "16")]),
X("Mass on a spring", "0.5 kg on a spring of k = 200 N/m. Period?",
  f"T = 2π√(0.5/200) = 2π × 0.05 ≈ {fx(T3,3)} s.", [(fx(T3,3), "0.314")]),
X("1 m pendulum", "Period of a 1 m simple pendulum (g = 9.8 m/s²)?",
  f"T = 2π√(1/9.8) ≈ {fx(T4,2)} s.", [(fx(T4,2), "2.01")]),
X("Seconds pendulum", "A seconds pendulum has T = 2 s. Its length (g = 9.8)?",
  f"l = gT²/4π² = 9.8 × 4/39.48 ≈ {fx(L5,3)} m (about 1 m).", [(fx(L5,3), "0.993")]),
X("Energy of oscillation", "k = 200 N/m, amplitude 10 cm. Total energy?",
  f"E = ½kA² = ½ × 200 × 0.01 = {fx(E6)} J.", [(fx(E6), "1")]),
X("Series vs parallel springs", "A mass oscillates with springs k and 4k, first in parallel (Tₚ), then in series (Tₛ). Tₛ/Tₚ?",
  f"kₚ = 5k, kₛ = 4k/5. Tₛ/Tₚ = √(kₚ/kₛ) = √(25/4) = {fx(ratio7,1)}.", [(fx(ratio7,1), "2.5")]),
X("Where KE equals PE", "Amplitude 10 cm. At what displacement are KE and PE equal?",
  f"½k(A² − x²) = ½kx² → x = A/√2 ≈ {fx(x8,2)} cm.", [(fx(x8,2), "7.07")]),
],
"topics": [
T("Periodic functions", "sin ωt and cos ωt repeat every 2π/ω, so any periodic motion can be described with them. Functions like sin ωt + cos ωt are still SHM (amplitude √2, phase shifted); sin² ωt is periodic with period π/ω."),
T("SHM and circular motion", "The projection of a particle moving uniformly on a circle onto any diameter performs SHM. The radius is the amplitude and the angular speed is ω — handy for finding time between two positions."),
T("Graphs of SHM", "x, v and a are all sinusoidal with the same ω. v is π/2 ahead of x, a is π ahead of x. The v–x graph is an ellipse; the a–x graph is a straight line with negative slope."),
T("Energy graphs", "Potential energy (PE) is a parabola with minimum at x = 0; kinetic energy (KE) is an inverted parabola; their sum is a horizontal line. KE and PE each oscillate with frequency 2ν (double the SHM frequency)."),
T("Restoring force and force constant", "The spring constant k tells how stiff the system is. For any SHM, ω² = (restoring force per unit displacement)/(mass). For the pendulum, the restoring force mg sinθ ≈ mgθ gives ω² = g/l."),
T("Deriving the pendulum period", "Torque about the pivot −mgl sinθ ≈ −mglθ; with I = ml², α = −(g/l)θ. Comparing with α = −ω²θ gives T = 2π√(l/g)."),
T("Time between positions", "From the mean to an extreme takes T/4. From the mean to A/2 takes T/12; from A/2 to A takes T/6. From the mean to A/√2 takes T/8."),
],
"ratta": [
"F = −kx;  ω = √(k/m);  T = 2π√(m/k).",
"x = A sin(ωt + φ);  v = ω√(A² − x²);  a = −ω²x.",
"v_max = Aω;  a_max = Aω².",
"E = ½kA²;  KE = PE at A/√2.",
"Pendulum T = 2π√(l/g);  seconds pendulum ≈ 1 m.",
"Series springs: 1/k adds;  parallel: k adds.",
"Mean → A/2: T/12;  A/2 → A: T/6.",
],
}

SYLLABUS = [
("Periodic motion — time period, frequency, displacement as a function of time, periodic functions", ["periodic", "frequency", "periodic functions"]),
("Simple harmonic motion and its equation; phase", ["SHM", "phase"]),
("Oscillations of a spring — restoring force and force constant", ["spring", "restoring force", "force constant"]),
("Energy in SHM — kinetic and potential energies", ["kinetic", "potential", "energy"]),
("Simple pendulum — derivation of expression for its time period", ["pendulum", "deriving"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Jo motion barabar intervals par dohraaye wo periodic hai; mean position ke aage-peeche wali periodic motion oscillation hai.",
"Simple harmonic motion (SHM) tab hota hai jab restoring force displacement ke proportional aur ulta ho: F = −kx. Tab x = A sin(ωt + φ), ω = √(k/m).",
"SHM mein speed mean position par maximum aur extremes par zero; acceleration ulta. Total energy ½kA² constant, KE aur PE mein bantti rehti hai.",
"Spring–mass: T = 2π√(m/k). Simple pendulum (chhota angle): T = 2π√(l/g), mass aur amplitude se independent.",
],
when=[
("Time period, frequency aur angular frequency convert karna.", None),
("Check karna ki motion SHM hai ya nahi.", "Diameter par project ki gayi uniform circular motion SHM hai, par uchhalti ball periodic hai, SHM nahi — confuse mat karo."),
("Kisi bhi time par position; φ initial phase.", None),
("Diye displacement par speed.", None),
("Extremes par force aur acceleration.", "Acceleration hamesha mean position ki taraf — x ke ulta, dhyan rakho."),
("Kisi position par energy.", "KE = PE x = A/√2 par, A/2 par nahi."),
("Spring par mass (horizontal ya vertical).", "Vertical spring mein bhi same formula — gravity sirf mean position shift karti hai, bhoolo mat."),
("Springs ke combinations.", None),
("Spring ke tukde.", None),
("Pendulum clocks, g naapna.", "T bob ke mass ya amplitude (chhote swings) par depend nahi karta — galat maat maano."),
("Lift aur accelerating vehicles mein pendulum.", None),
("Phase ke sawal.", None),
],
examples=[
("SHM equation padhna", "x = 5 sin(πt + π/3) cm. Amplitude, period, maximum speed aur maximum acceleration?",
 "A = 5 cm, ω = π rad/s → T = 2π/ω = ⟨0⟩ s. v_max = Aω ≈ ⟨1⟩ cm/s, a_max = Aω² ≈ ⟨2⟩ cm/s²."),
("Displacement par speed", "A = 10 cm, T = π s. x = 6 cm par speed?",
 "ω = 2 rad/s. v = ω√(A² − x²) = 2 × √(100 − 36) = ⟨0⟩ cm/s."),
("Spring par mass", "k = 200 N/m wali spring par 0.5 kg. Period?",
 "T = 2π√(0.5/200) = 2π × 0.05 ≈ ⟨0⟩ s."),
("1 m pendulum", "1 m simple pendulum ka period (g = 9.8 m/s²)?",
 "T = 2π√(1/9.8) ≈ ⟨0⟩ s."),
("Seconds pendulum", "Seconds pendulum ka T = 2 s. Length (g = 9.8)?",
 "l = gT²/4π² = 9.8 × 4/39.48 ≈ ⟨0⟩ m (lagbhag 1 m)."),
("Oscillation ki energy", "k = 200 N/m, amplitude 10 cm. Total energy?",
 "E = ½kA² = ½ × 200 × 0.01 = ⟨0⟩ J."),
("Series vs parallel springs", "Mass k aur 4k springs ke saath, pehle parallel (Tₚ), phir series (Tₛ). Tₛ/Tₚ?",
 "kₚ = 5k, kₛ = 4k/5. Tₛ/Tₚ = √(kₚ/kₛ) = √(25/4) = ⟨0⟩."),
("KE aur PE kahan barabar", "Amplitude 10 cm. Kis displacement par KE = PE?",
 "½k(A² − x²) = ½kx² → x = A/√2 ≈ ⟨0⟩ cm."),
],
topics=[
("Periodic functions", "sin ωt aur cos ωt har 2π/ω par dohraate hain, isliye koi bhi periodic motion inse likhi ja sakti hai. sin ωt + cos ωt bhi SHM hai (amplitude √2, phase shifted); sin² ωt periodic hai, period π/ω."),
("SHM and circular motion", "Circle par uniform chalte particle ka kisi diameter par projection SHM karta hai. Radius = amplitude aur angular speed = ω — do positions ke beech ka time nikaalne mein kaam aata hai."),
("Graphs of SHM", "x, v, a teeno sinusoidal, same ω. v x se π/2 aage, a x se π aage. v–x graph ellipse; a–x graph negative slope wali seedhi line."),
("Energy graphs", "Potential energy (PE) parabola, minimum x = 0 par; kinetic energy (KE) ulta parabola; dono ka sum horizontal line. KE aur PE dono 2ν frequency (SHM ki double) se oscillate karte hain."),
("Restoring force and force constant", "Spring constant k batata hai system kitna stiff hai. Har SHM mein ω² = (restoring force per unit displacement)/mass. Pendulum mein mg sinθ ≈ mgθ restoring force se ω² = g/l."),
("Deriving the pendulum period", "Pivot ke baare mein torque −mgl sinθ ≈ −mglθ; I = ml² se α = −(g/l)θ. α = −ω²θ se compare karke T = 2π√(l/g)."),
("Time between positions", "Mean se extreme tak T/4. Mean se A/2 tak T/12; A/2 se A tak T/6. Mean se A/√2 tak T/8."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
