from lib import F, X, T, sig, fx, _check_and_write
import math

v1 = 100 * math.pi / (2 * math.pi)                         # y = 0.02 sin(100πt − 2πx)
lam1 = 1.0; f1 = 50
v2 = math.sqrt(100 / 0.01)                                 # T = 100 N, μ = 0.01 kg/m
f3 = v2 / (2 * 0.5)                                        # L = 0.5 m fundamental
f4 = 340 / (4 * 0.5)                                       # closed pipe 50 cm
f5 = 340 / (2 * 0.5)                                       # open pipe 50 cm
v6 = math.sqrt(1.4 * 1.013e5 / 1.29)                       # Laplace speed in air
dphi7 = 2 * math.pi / 2 * 0.5                              # path diff 0.5 m, λ = 2 m → π/2
fb8 = 256 - 4                                              # beats with wax test
f9 = 300 * math.sqrt(1.44) / 1.2                           # T +44%, L +20%

DOC = {
"slug": "waves", "subject": "Physics",
"chapters": {"NEET": "Waves", "JEE": "Waves"},
"title": "Waves", "readMinutes": 13,
"summary": [
"A wave carries energy and momentum from place to place without carrying matter. In transverse waves particles move perpendicular to the wave; in longitudinal waves (sound) they move along it.",
"A progressive wave is y = A sin(kx − ωt + φ), with speed v = ω/k = νλ. On a string v = √(T/μ); sound in a gas v = √(γP/ρ).",
"When waves overlap, displacements add (superposition). Two equal waves travelling in opposite directions form a standing wave with fixed nodes and antinodes.",
"Strings and organ pipes support only certain frequencies (harmonics). Two close frequencies give beats at the difference frequency.",
],
"formulas": [
F("Wave speed relation", "v = ν λ = ω/k;  k = 2π/λ,  ω = 2πν", "Converting between speed, frequency and wavelength."),
F("Progressive wave", "y(x, t) = A sin(kx − ωt + φ)  (moving in +x);  kx + ωt → moving in −x", "Reading a wave equation.", "The sign between kx and ωt tells the direction — opposite signs mean +x direction.", tag="PYQ favourite"),
F("Particle velocity and wave speed", "v_particle = ∂y/∂t;  max = Aω;   wave speed v = ω/k", "Particle vs wave speed questions.", "Particle speed and wave speed are different things — don't equate them."),
F("Speed on a string", "v = √(T/μ)   (μ = mass per unit length)", "Sonometer, stretched wires.", None, tag="PYQ favourite"),
F("Speed of sound in a gas", "Newton: √(P/ρ) (wrong, ~280 m/s);  Laplace: v = √(γP/ρ) = √(γRT/M)", "Sound speed and its temperature dependence.", "v ∝ √T (kelvin); pressure alone does not change v at constant T."),
F("Phase and path difference", "Δφ = (2π/λ) Δx", "Interference and phase questions."),
F("Superposition and standing waves", "y = 2A sin kx cos ωt;  nodes at kx = nπ, antinodes midway;  node-to-node = λ/2", "Standing waves on strings and in pipes."),
F("Stretched string (both ends fixed)", "fₙ = n v/(2L),  n = 1, 2, 3 …  (all harmonics)", "Sonometer, guitar strings.", "Fundamental has nodes at both ends and one antinode in the middle."),
F("Closed organ pipe", "fₙ = (2n − 1) v/(4L):  only odd harmonics", "Pipes closed at one end, resonance tube.", "There is no 2nd harmonic in a closed pipe — the next note after f₁ is 3f₁.", tag="PYQ favourite"),
F("Open organ pipe", "fₙ = n v/(2L):  all harmonics", "Flutes, pipes open at both ends."),
F("End correction", "closed: L_eff = L + 0.6r;  open: L_eff = L + 1.2r", "Accurate resonance-tube calculations."),
F("Beats", "beat frequency = |ν₁ − ν₂|", "Tuning forks, tuning instruments.", "Loading a fork with wax LOWERS its frequency; filing raises it."),
F("Reflection of waves", "from a rigid end: phase change π (inverted);  from a free/open end: no phase change", "Pulse reflection questions."),
],
"examples": [
X("Reading a wave equation", "y = 0.02 sin(100πt − 2πx) (SI). Find frequency, wavelength and speed.",
  f"ω = 100π → ν = {fx(f1)} Hz; k = 2π → λ = {fx(lam1)} m; v = ω/k = {fx(v1)} m/s.", [(fx(f1), "50"), (fx(lam1), "1"), (fx(v1), "50")]),
X("Wave on a string", "A string has tension 100 N and mass per unit length 0.01 kg/m. Wave speed?",
  f"v = √(100/0.01) = {fx(v2)} m/s.", [(fx(v2), "100")]),
X("Fundamental of a string", "The same string is 0.5 m long and fixed at both ends. Fundamental frequency?",
  f"f₁ = v/2L = 100/1 = {fx(f3)} Hz.", [(fx(f3), "100")]),
X("Closed pipe", "A pipe 50 cm long is closed at one end (v = 340 m/s). Fundamental and next two notes?",
  f"f₁ = v/4L = {fx(f4)} Hz; then 3f₁ = 510 Hz and 5f₁ = 850 Hz (odd harmonics only).", [(fx(f4), "170")]),
X("Open pipe", "Same length but open at both ends. Fundamental?",
  f"f₁ = v/2L = {fx(f5)} Hz — double the closed pipe.", [(fx(f5), "340")]),
X("Speed of sound in air", "γ = 1.4, P = 1.013 × 10⁵ Pa, ρ = 1.29 kg/m³. Laplace's speed?",
  f"v = √(1.4 × 1.013 × 10⁵/1.29) ≈ {fx(v6,0)} m/s.", [(fx(v6,0), "332")]),
X("Phase difference", "Two points 0.5 m apart on a wave of wavelength 2 m. Phase difference?",
  f"Δφ = (2π/λ)Δx = (2π/2) × 0.5 = π/2 ≈ {fx(dphi7,2)} rad.", [(fx(dphi7,2), "1.57")]),
X("Beats with wax", "Fork A (256 Hz) gives 4 beats/s with B. Waxing A increases the beats to 6/s. Frequency of B?",
  f"B = 252 or 260 Hz. Wax lowers A; beats increase only if B is below A, so B = {fx(fb8)} Hz.", [(fx(fb8), "252")]),
X("Changing tension and length", "A wire's fundamental is 300 Hz. Tension is raised by 44% and length by 20%. New fundamental?",
  f"f ∝ √T/L: 300 × √1.44/1.2 = 300 × 1.2/1.2 = {fx(f9)} Hz.", [(fx(f9), "300")]),
],
"topics": [
T("Transverse and longitudinal waves", "Transverse waves (on strings, light) have crests and troughs and can travel only where there is rigidity — so mechanical transverse waves don't travel through fluids. Longitudinal waves (sound) have compressions and rarefactions and travel through solids, liquids and gases."),
T("What a medium needs", "Mechanical waves need elasticity (to restore) and inertia (to carry the disturbance forward). Speed depends on the medium, not on the source; frequency depends on the source and does not change when a wave enters a new medium."),
T("Factors affecting the speed of sound", "Increases with temperature (≈ 0.6 m/s per °C in air) and humidity (moist air is less dense). Not affected by pressure at constant temperature. Sound is fastest in solids and slowest in gases."),
T("Principle of superposition", "The net displacement is the vector sum of individual displacements. It explains interference (constructive when Δφ = 2nπ, destructive when Δφ = (2n + 1)π), standing waves and beats."),
T("Standing waves", "No energy is transported. Nodes never move; antinodes vibrate with amplitude 2A. All particles between two nodes move in phase; particles on either side of a node are out of phase by π."),
T("Harmonics and overtones", "The fundamental is the 1st harmonic. In open pipes and strings the 1st overtone is the 2nd harmonic. In closed pipes the 1st overtone is the 3rd harmonic. Richer harmonics give each instrument its own quality (timbre)."),
T("Resonance tube", "In a resonance-tube experiment, successive resonance lengths differ by λ/2: λ = 2(l₂ − l₁), which removes the end correction; e = (l₂ − 3l₁)/2."),
T("Syllabus note", "The Doppler effect has been removed from the current NTA syllabus for both NEET and JEE Main. Focus on wave equations, speeds, superposition, standing waves in strings and pipes, and beats."),
],
"ratta": [
"v = νλ = ω/k;  string v = √(T/μ);  sound v = √(γRT/M).",
"y = A sin(kx − ωt): moves +x.",
"String & open pipe: nv/2L (all);  closed pipe: (2n−1)v/4L (odd).",
"Node–node = λ/2;  node–antinode = λ/4.",
"Beats = |ν₁ − ν₂|;  wax lowers frequency.",
"Rigid end: phase change π;  free end: none.",
"Δφ = 2πΔx/λ.",
],
}

SYLLABUS = [
("Wave motion. Longitudinal and transverse waves, speed of travelling wave", ["longitudinal", "transverse", "speed"]),
("Displacement relation for a progressive wave", ["progressive", "y(x, t)"]),
("Principle of superposition of waves, reflection of waves", ["superposition", "reflection"]),
("Standing waves in strings and organ pipes, fundamental mode and harmonics", ["standing", "organ pipe", "fundamental", "harmonic"]),
("Beats", ["beats"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
