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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Wave energy aur momentum ko ek jagah se doosri jagah le jaati hai, matter ko nahi. Transverse waves mein particles wave ke perpendicular chalte hain; longitudinal waves (sound) mein uske saath.",
"Progressive wave y = A sin(kx − ωt + φ), speed v = ω/k = νλ. String par v = √(T/μ); gas mein sound v = √(γP/ρ).",
"Waves milti hain to displacements judte hain (superposition). Ulti directions mein chalti do barabar waves fixed nodes aur antinodes wali standing wave banati hain.",
"Strings aur organ pipes sirf kuch frequencies (harmonics) support karte hain. Do paas ki frequencies difference frequency par beats deti hain.",
],
when=[
("Speed, frequency aur wavelength convert karna.", None),
("Wave equation padhna.", "kx aur ωt ke beech ka sign direction batata hai — ulte signs matlab +x direction, confuse mat karo."),
("Particle vs wave speed ke sawal.", "Particle speed aur wave speed alag cheezein hain — barabar mat karo."),
("Sonometer, khinchi wires.", None),
("Sound speed aur temperature par dependence.", "v ∝ √T (kelvin); constant T par sirf pressure se v nahi badalta."),
("Interference aur phase ke sawal.", None),
("Strings aur pipes mein standing waves.", None),
("Sonometer, guitar strings.", "Fundamental mein dono ends par nodes aur beech mein ek antinode — dhyan rakho."),
("Ek end band pipes, resonance tube.", "Closed pipe mein 2nd harmonic nahi hota — f₁ ke baad agla note 3f₁ hai, 2f₁ nahi."),
("Flute, dono taraf khule pipes.", None),
("Accurate resonance-tube calculations.", None),
("Tuning forks, instruments tune karna.", "Fork par wax lagaane se frequency GHAT-ti hai; file karne se badhti hai — ulta mat lo."),
("Pulse reflection ke sawal.", None),
],
examples=[
("Wave equation padhna", "y = 0.02 sin(100πt − 2πx) (SI). Frequency, wavelength aur speed?",
 "ω = 100π → ν = ⟨0⟩ Hz; k = 2π → λ = ⟨1⟩ m; v = ω/k = ⟨2⟩ m/s."),
("String par wave", "String ka tension 100 N, mass per unit length 0.01 kg/m. Wave speed?",
 "v = √(100/0.01) = ⟨0⟩ m/s."),
("String ka fundamental", "Wahi string 0.5 m lambi, dono ends fixed. Fundamental frequency?",
 "f₁ = v/2L = 100/1 = ⟨0⟩ Hz."),
("Closed pipe", "50 cm pipe ek end band (v = 340 m/s). Fundamental aur agle do notes?",
 "f₁ = v/4L = ⟨0⟩ Hz; phir 3f₁ = 510 Hz aur 5f₁ = 850 Hz (sirf odd harmonics)."),
("Open pipe", "Same length, dono ends khule. Fundamental?",
 "f₁ = v/2L = ⟨0⟩ Hz — closed pipe ka double."),
("Hawa mein sound ki speed", "γ = 1.4, P = 1.013 × 10⁵ Pa, ρ = 1.29 kg/m³. Laplace ki speed?",
 "v = √(1.4 × 1.013 × 10⁵/1.29) ≈ ⟨0⟩ m/s."),
("Phase difference", "2 m wavelength wali wave par 0.5 m door do points. Phase difference?",
 "Δφ = (2π/λ)Δx = (2π/2) × 0.5 = π/2 ≈ ⟨0⟩ rad."),
("Wax ke saath beats", "Fork A (256 Hz) B ke saath 4 beats/s deta hai. A par wax lagaane se beats 6/s. B ki frequency?",
 "B = 252 ya 260 Hz. Wax A ko ghataata hai; beats tabhi badhenge jab B, A se neeche ho, isliye B = ⟨0⟩ Hz."),
("Tension aur length badalna", "Wire ka fundamental 300 Hz. Tension 44% aur length 20% badhaayi. Naya fundamental?",
 "f ∝ √T/L: 300 × √1.44/1.2 = 300 × 1.2/1.2 = ⟨0⟩ Hz."),
],
topics=[
("Transverse and longitudinal waves", "Transverse waves (strings, light) mein crests aur troughs; sirf wahan chalti hain jahan rigidity ho — isliye mechanical transverse waves fluids mein nahi chalti. Longitudinal waves (sound) mein compressions aur rarefactions; solids, liquids, gases sab mein chalti hain."),
("What a medium needs", "Mechanical waves ko elasticity (wapas laane ke liye) aur inertia (disturbance aage le jaane ke liye) chahiye. Speed medium par depend karti hai, source par nahi; frequency source par depend karti hai aur naye medium mein nahi badalti."),
("Factors affecting the speed of sound", "Temperature ke saath badhti hai (hawa mein ≈ 0.6 m/s per °C) aur humidity ke saath (nam hawa kam dense). Constant temperature par pressure se farak nahi. Sound solids mein sabse tez aur gases mein sabse dheema."),
("Principle of superposition", "Net displacement individual displacements ka vector sum hai. Isse interference (Δφ = 2nπ par constructive, (2n + 1)π par destructive), standing waves aur beats samajh aate hain."),
("Standing waves", "Energy transport nahi hoti. Nodes kabhi nahi hilte; antinodes 2A amplitude se vibrate karte hain. Do nodes ke beech saare particles same phase mein; node ke dono taraf ke particles π se out of phase."),
("Harmonics and overtones", "Fundamental hi 1st harmonic hai. Open pipes aur strings mein 1st overtone = 2nd harmonic. Closed pipes mein 1st overtone = 3rd harmonic. Zyada harmonics har instrument ko apni quality (timbre) dete hain."),
("Resonance tube", "Resonance-tube experiment mein lagataar resonance lengths λ/2 se alag hoti hain: λ = 2(l₂ − l₁), jo end correction hata deta hai; e = (l₂ − 3l₁)/2."),
("Syllabus note", "Doppler effect current NTA syllabus se NEET aur JEE Main dono ke liye hata diya gaya hai. Wave equations, speeds, superposition, strings aur pipes mein standing waves aur beats par focus karo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
