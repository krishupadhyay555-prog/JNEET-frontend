from lib import F, X, T, sig, fx

# ── worked numbers (every printed number is computed here) ─────────────
# 1 vernier with negative zero error (LC 0.01 cm)
lc1 = 0.1 / 10                       # cm
z1 = -(10 - 6) * lc1                 # zero error, cm
obs1 = 3.1 + 4 * lc1
cor1 = obs1 - z1
# 2 metre scale, principle of moments (uniform scale balanced at 50 cm)
m2 = 50 * (50 - 20) / (70 - 50)      # g
# 3 Searle's apparatus
M3, g3, L3, r3, dl3 = 5, 9.8, 2.0, 0.25e-3, 2.5e-3
Y3 = M3 * g3 * L3 / (3.141592653589793 * r3 ** 2 * dl3)
# 4 capillary rise (θ = 0)
h4, rr4, rho4 = 0.059, 0.25e-3, 1000
T4 = h4 * rr4 * rho4 * 9.8 / 2
# 5 terminal velocity
r5, rs5, rl5, v5 = 1e-3, 7800, 1260, 0.012
eta5 = 2 * r5 ** 2 * (rs5 - rl5) * 9.8 / (9 * v5)
# 6 resonance tube
f6, l1, l2 = 512, 16, 50             # Hz, cm, cm
v6 = 2 * f6 * (l2 - l1) / 100        # m/s
e6 = (l2 - 3 * l1) / 2               # cm
# 7 method of mixtures (calorimeter water equivalent 10 g)
s7 = (200 + 10) * 1 * (25 - 20) / (100 * (100 - 25))
# 8 metre bridge
X8 = 6 * 40 / (100 - 40)
rho8 = X8 * 3.141592653589793 * (0.2e-3) ** 2 / 1.0
# 9 half deflection
R9, S9, E9, th9 = 5000, 50, 2, 20
G9 = R9 * S9 / (R9 - S9)
k9 = E9 / ((R9 + G9) * th9)
# 10 travelling microscope
R1, R2, R3 = 2.100, 3.100, 5.100
mu10 = (R3 - R1) / (R3 - R2)
# 11 prism at minimum deviation (A = 60°, δm = 40°)
import math
mu11 = math.sin(math.radians(50)) / math.sin(math.radians(30))

DOC = {
"slug": "experimental-skills", "subject": "Physics",
"chapters": {"NEET": "Experimental Skills", "JEE": "Experimental Skills"},
"title": "Experimental Skills", "readMinutes": 16, "verifiedOn": "2026-11-28",
"summary": [
"Both NEET and JEE Main list 18 lab experiments as a separate unit. Questions ask what is measured, the formula used, how to read the instrument, which graph is drawn, and which error or precaution matters.",
"Length instruments: vernier callipers (LC 0.01 cm) for external and internal diameter and depth; screw gauge (LC 0.001 cm) for wire diameter and sheet thickness. Always correct for zero error first.",
"Mechanics and properties of matter: simple pendulum (energy loss from A² vs t), metre scale (principle of moments), Searle's apparatus (Young's modulus), capillary rise (surface tension), falling ball (viscosity), resonance tube (speed of sound), method of mixtures (specific heat).",
"Electricity, optics and electronics: metre bridge (resistivity), Ohm's law (V–I graph), half-deflection method (galvanometer resistance and figure of merit), u–v method with parallax (focal length), i–δ curve of a prism, travelling microscope (refractive index of a glass slab), diode and Zener characteristics, and identifying a diode, LED, resistor and capacitor.",
],
"formulas": [
F("Vernier callipers", "LC = 1 MSD − 1 VSD = MSD/N;  reading = MSR + (VSD × LC) − zero error", "External and internal diameter and depth of a vessel.", "A negative zero error is ADDED back (subtracting a negative number) — don't drop the sign.", tag="PYQ favourite"),
F("Screw gauge", "LC = pitch/N;  reading = PSR + (CSR × LC) − zero error", "Diameter of a wire, thickness of a sheet.", "Turn only with the ratchet and always in one direction — backlash error comes from reversing the screw."),
F("Simple pendulum and damping", "T = 2π√(l/g);  energy E ∝ A²;  A = A₀e^{−bt/2m}", "Energy dissipation: plot A² (energy) against t.", "The A²–t graph is a falling curve, not a straight line; ln A against t is the straight line."),
F("Metre scale — principle of moments", "m₁d₁ = m₂d₂ (moments about the balance point)", "Mass of an object with a known mass on a balanced metre scale.", "Measure each distance from the balance point (knife edge), not from the 0 cm end."),
F("Young's modulus (Searle's apparatus)", "Y = MgL/(πr²Δl) = gL/(πr² × slope),  slope = Δl/M", "Young's modulus of a metallic wire.", "r is half the screw-gauge diameter — using the diameter makes Y four times too small.", tag="PYQ favourite"),
F("Surface tension by capillary rise", "T = hrρg/(2 cos θ);  for water on clean glass θ ≈ 0", "Surface tension of water; effect of detergent.", "Detergent LOWERS surface tension, so the water rises less."),
F("Viscosity from terminal velocity", "v_t = 2r²(ρ − σ)g/(9η)  ⇒  η = 2r²(ρ − σ)g/(9v_t)", "Coefficient of viscosity of a liquid (glycerine, castor oil).", "Time the ball only after it has reached terminal velocity — start the marks a few cm below the surface."),
F("Resonance tube", "l₁ + e = λ/4;  l₂ + e = 3λ/4  ⇒  v = 2f(l₂ − l₁);  e = (l₂ − 3l₁)/2 ≈ 0.3d", "Speed of sound in air at room temperature.", "Using v = 4fl₁ ignores end correction; the two-length method cancels it.", tag="PYQ favourite"),
F("Method of mixtures", "heat lost = heat gained:  m_s s_s (T_s − T_f) = (m_w s_w + W) (T_f − T_w)", "Specific heat of a solid or a liquid.", "Include the calorimeter (water equivalent W) — leaving it out gives a wrong specific heat."),
F("Metre bridge", "X/R = l/(100 − l);  ρ = XA/L = Xπr²/L", "Unknown resistance and resistivity of a wire.", "Get the balance point near the middle (40–60 cm) and interchange X and R to cancel end error."),
F("Ohm's law", "V = IR;  R = slope of V–I graph (V on y-axis)", "Resistance of a wire.", "Ammeter goes in series and voltmeter in parallel — swapping them breaks the circuit reading."),
F("Half-deflection method", "G = RS/(R − S)  (≈ S when R ≫ G);  figure of merit k = I/θ = E/((R + G)θ)", "Resistance and figure of merit of a galvanometer.", "k is current per division (A/div), not divisions per ampere.", tag="PYQ favourite"),
F("Focal length by u–v method", "mirror: 1/f = 1/v + 1/u;  lens: 1/f = 1/v − 1/u (sign convention)", "Focal length of a concave mirror, convex mirror (with a convex lens) and convex lens.", "No parallax means the needle tip and image tip move together — remove it tip to tip."),
F("Prism i–δ curve", "δ = i + e − A;  at minimum deviation i = e, r = A/2,  μ = sin((A + δm)/2)/sin(A/2)", "Angle of deviation against angle of incidence.", "The curve is U-shaped: δ falls, reaches δm, then rises — it is not a straight line."),
F("Travelling microscope", "μ = real thickness/apparent thickness = (R₃ − R₁)/(R₃ − R₂)", "Refractive index of a glass slab.", "R₁ = mark without slab, R₂ = mark through slab, R₃ = top of slab (lycopodium powder) — mixing them up inverts μ."),
F("p-n junction and Zener", "diode: forward knee ≈ 0.7 V (Si), reverse µA current;  r_d = ΔV/ΔI;  Zener: reverse bias, V stays ≈ V_Z after breakdown", "Characteristic curves; reverse breakdown voltage of a Zener.", "A Zener is used in REVERSE bias as a regulator — forward bias makes it an ordinary diode."),
F("Identifying components (multimeter)", "resistor: same steady reading both ways;  diode: conducts one way only;  LED: one way and glows;  capacitor: reading jumps then falls to zero (no steady current)", "Picking out a diode, LED, resistor and capacitor from a mixed set."),
],
"examples": [
X("Vernier with negative zero error", "A vernier (LC 0.01 cm) shows its zero to the LEFT of the main-scale zero when the jaws are closed, with the 6th vernier division coinciding. Measuring a cylinder, MSR = 3.1 cm and the 4th vernier division coincides. Correct diameter?",
  f"Negative zero error = −(10 − 6) × 0.01 = {fx(z1,2)} cm. Observed = 3.1 + 4 × 0.01 = {fx(obs1,2)} cm. Correct = 3.14 − (−0.04) = {fx(cor1,2)} cm.", [(fx(z1,2), "−0.04"), (fx(obs1,2), "3.14"), (fx(cor1,2), "3.18")]),
X("Mass by principle of moments", "A uniform metre scale balances at the 50 cm mark. A 50 g mass hangs at 20 cm and an unknown mass at 70 cm keeps it balanced. Unknown mass?",
  f"Moments about 50 cm: 50 × (50 − 20) = m × (70 − 50) ⇒ m = 1500/20 = {fx(m2)} g.", [(fx(m2), "75")]),
X("Young's modulus of a wire", "In Searle's apparatus a 2.0 m wire of radius 0.25 mm stretches by 2.5 mm under a 5 kg load (g = 9.8 m/s²). Y?",
  f"Y = MgL/(πr²Δl) = 5 × 9.8 × 2/(π × (0.25 × 10⁻³)² × 2.5 × 10⁻³) ≈ {sig(Y3)} N/m² (steel).", [(sig(Y3), "2.0 × 10¹¹")]),
X("Surface tension by capillary rise", "Water rises 5.9 cm in a clean glass capillary of radius 0.25 mm (θ = 0, ρ = 1000 kg/m³, g = 9.8 m/s²). Surface tension?",
  f"T = hrρg/2 = 0.059 × 0.25 × 10⁻³ × 1000 × 9.8/2 ≈ {fx(T4,3)} N/m.", [(fx(T4,3), "0.072")]),
X("Viscosity of glycerine", "A steel ball (r = 1 mm, ρ = 7800 kg/m³) falls through glycerine (σ = 1260 kg/m³) at a terminal speed of 1.2 cm/s. η? (g = 9.8 m/s²)",
  f"η = 2r²(ρ − σ)g/(9v) = 2 × 10⁻⁶ × 6540 × 9.8/(9 × 0.012) ≈ {fx(eta5,2)} Pa s.", [(fx(eta5,2), "1.19")]),
X("Speed of sound with a resonance tube", "With a 512 Hz fork, resonance occurs at 16 cm and 50 cm. Speed of sound and end correction?",
  f"v = 2f(l₂ − l₁) = 2 × 512 × 0.34 ≈ {fx(v6,0)} m/s. e = (l₂ − 3l₁)/2 = (50 − 48)/2 = {fx(e6)} cm.", [(fx(v6,0), "348"), (fx(e6), "1")]),
X("Specific heat by method of mixtures", "100 g of a solid at 100 °C is dropped into 200 g of water at 20 °C in a calorimeter of water equivalent 10 g. Final temperature 25 °C. Specific heat of the solid?",
  f"Heat lost = heat gained: 100 × s × 75 = 210 × 1 × 5 ⇒ s = 1050/7500 = {fx(s7,2)} cal g⁻¹ °C⁻¹.", [(fx(s7,2), "0.14")]),
X("Resistivity with a metre bridge", "With 6 Ω in the right gap, the null point is at 40 cm from the left end. The unknown wire is 1 m long with diameter 0.4 mm. X and ρ?",
  f"X = R l/(100 − l) = 6 × 40/60 = {fx(X8)} Ω. ρ = Xπr²/L = 4 × π × (0.2 × 10⁻³)² ≈ {sig(rho8)} Ω m.", [(fx(X8), "4"), (sig(rho8), "5.0 × 10⁻⁷")]),
X("Galvanometer by half deflection", "With R = 5000 Ω a cell of 2 V gives 20 divisions. A shunt S = 50 Ω halves the deflection. G and the figure of merit?",
  f"G = RS/(R − S) = 5000 × 50/4950 ≈ {fx(G9,1)} Ω. k = E/((R + G)θ) = 2/(5050.5 × 20) ≈ {sig(k9)} A/div.", [(fx(G9,1), "50.5"), (sig(k9), "2.0 × 10⁻⁵")]),
X("Refractive index with a travelling microscope", "Readings: mark without slab R₁ = 2.100 cm, mark through slab R₂ = 3.100 cm, top of slab R₃ = 5.100 cm. μ of the glass?",
  f"Real thickness = R₃ − R₁ = 3.000 cm; apparent = R₃ − R₂ = 2.000 cm. μ = 3/2 = {fx(mu10,2)}.", [(fx(mu10,2), "1.5")]),
X("Prism from the i–δ curve", "For a 60° prism the i–δ curve has its lowest point at δm = 40°. μ?",
  f"μ = sin((60° + 40°)/2)/sin(30°) = sin 50°/0.5 ≈ {fx(mu11,2)}.", [(fx(mu11,2), "1.53")]),
],
"topics": [
T("Reading length instruments", "Vernier callipers: outer jaws for external diameter, inner jaws for internal diameter, the thin strip for depth. Zero error is positive when the vernier zero is to the right of the main-scale zero. Screw gauge: pitch = distance moved in one full turn; LC = pitch/N (typically 0.5 mm/50 = 0.01 mm). Take readings at several places at right angles and average."),
T("Simple pendulum — energy dissipation", "Air drag and friction make the amplitude fall with time. Energy ∝ A², so plotting A² against t shows energy dying out (a decaying curve). For small amplitudes T = 2π√(l/g) does not depend on amplitude; l is measured to the centre of the bob. Count many oscillations to reduce timing error."),
T("Searle's apparatus", "Two identical wires hang from the same support: a reference wire and an experimental wire. The spirit level joins the two wires and the micrometer measures only their DIFFERENCE in length, so sagging of the support and temperature change cancel. Load and unload in steps, take the mean extension, plot load–extension; the graph must be a straight line (stay within the elastic limit)."),
T("Surface tension and detergents", "Capillary rise h ∝ 1/r and h ∝ T. Clean the tube first (grease changes the angle of contact). Adding detergent lowers surface tension, so h decreases. Read the bottom of the meniscus with a travelling microscope."),
T("Viscosity by a falling ball", "Drop small steel balls gently along the axis of a tall jar of glycerine; time them between two marks once speed is steady. Terminal velocity ∝ r². Viscosity of liquids falls as temperature rises, so note the room temperature."),
T("Resonance tube details", "The air column above the water is a closed pipe: first resonance at λ/4, second at 3λ/4 (both plus end correction e ≈ 0.3 × diameter). Loudest sound marks resonance. Speed of sound rises with temperature (about 0.61 m/s per °C)."),
T("Method of mixtures — precautions", "Use a polished, lagged calorimeter to reduce radiation loss; transfer the hot solid quickly; stir and note the highest steady temperature. The same idea gives the specific heat of a liquid using a solid of known specific heat."),
T("Metre bridge and Ohm's law", "Metre bridge is a Wheatstone bridge with a 100 cm wire; at null point no current flows in the galvanometer. Keep the jockey pressed only briefly (heating changes resistance). Ohm's law experiment: rheostat varies current, V–I graph through the origin; slope (V/I) = R."),
T("Galvanometer: half deflection", "First set a large resistance R so the deflection θ is within range, then add shunt S across the galvanometer and adjust it until deflection is θ/2. Then G = RS/(R − S); if R is very large, G ≈ S. Figure of merit = current for one division."),
T("Focal length and parallax", "Concave mirror and convex lens: place the object needle, find the real image needle position with no parallax, record u and v; plot 1/v against 1/u — a straight line of slope 1 whose y-intercept is 1/f. Convex mirror gives a virtual image, so a convex lens first forms a real image that acts as the object for the mirror."),
T("Prism and glass slab", "i–δ curve: vary i, measure δ; minimum deviation δm occurs when the ray passes symmetrically (i = e). Travelling microscope: focus on a mark, then on the mark through the slab, then on lycopodium powder on top; real/apparent thickness gives μ."),
T("Diode, Zener and identification", "Forward characteristic: almost no current up to the knee voltage, then a sharp rise. Reverse characteristic: tiny saturation current. Zener (heavily doped) in reverse bias breaks down at V_Z and holds the voltage nearly constant — a voltage regulator. With a multimeter: resistor reads the same both ways, diode one way, LED one way and lights up, capacitor shows a reading that falls to zero."),
],
"ratta": [
"Vernier LC = MSD/N (0.01 cm); screw gauge LC = pitch/N (0.001 cm).",
"Corrected reading = observed − zero error (sign included).",
"Energy ∝ A² → plot A² vs t for damping.",
"Y = MgL/(πr²Δl); T = hrρg/(2 cos θ); η = 2r²(ρ − σ)g/(9v).",
"Resonance tube: v = 2f(l₂ − l₁), e = (l₂ − 3l₁)/2 ≈ 0.3d.",
"Metre bridge: X = R l/(100 − l); balance near the middle.",
"Half deflection: G = RS/(R − S); figure of merit = current per division.",
"Prism: μ = sin((A + δm)/2)/sin(A/2); i–δ curve is U-shaped.",
"Glass slab: μ = (R₃ − R₁)/(R₃ − R₂).",
"Zener works in reverse bias; detergent lowers surface tension.",
],
}

SYLLABUS = [
("Vernier callipers — internal and external diameter and depth of a vessel", ["vernier", "internal", "external", "depth"]),
("Screw gauge — diameter of a wire, thickness of a sheet", ["screw gauge", "wire", "sheet"]),
("Simple pendulum — dissipation of energy (square of amplitude vs time)", ["simple pendulum", "A²", "energy"]),
("Metre scale — mass by principle of moments", ["metre scale", "moments"]),
("Young's modulus of a metallic wire", ["Young's modulus", "Searle"]),
("Surface tension by capillary rise, effect of detergents", ["capillary", "surface tension", "detergent"]),
("Viscosity by terminal velocity of a spherical body", ["viscosity", "terminal velocity"]),
("Speed of sound using a resonance tube", ["resonance tube", "speed of sound"]),
("Specific heat of a solid and a liquid by method of mixtures", ["method of mixtures", "specific heat", "liquid"]),
("Resistivity of a wire using a metre bridge", ["metre bridge", "resistivity"]),
("Resistance using Ohm's law", ["Ohm's law"]),
("Galvanometer resistance and figure of merit by half deflection", ["half", "figure of merit", "galvanometer"]),
("Focal length of convex mirror, concave mirror, convex lens (parallax method)", ["convex mirror", "concave mirror", "convex lens", "parallax"]),
("Angle of deviation vs angle of incidence for a prism", ["prism", "angle of deviation", "incidence"]),
("Refractive index of a glass slab using a travelling microscope", ["travelling microscope", "glass slab"]),
("Characteristic curves of a p-n junction diode (forward and reverse)", ["p-n junction", "forward", "reverse"]),
("Zener diode characteristics and reverse breakdown voltage", ["Zener", "breakdown"]),
("Identification of diode, LED, resistor, capacitor", ["LED", "resistor", "capacitor", "diode"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"NEET aur JEE Main dono mein 18 lab experiments ek alag unit hain. Sawaal poochte hain: kya naapa jaata hai, kaunsa formula lagta hai, instrument kaise padhte hain, kaunsa graph banta hai, aur kaunsi error ya precaution zaroori hai.",
"Length ke instruments: vernier callipers (LC 0.01 cm) external aur internal diameter aur depth ke liye; screw gauge (LC 0.001 cm) wire ke diameter aur sheet ki motai ke liye. Pehle zero error correct karo.",
"Mechanics aur properties of matter: simple pendulum (A² vs t se energy loss), metre scale (principle of moments), Searle's apparatus (Young's modulus), capillary rise (surface tension), girti ball (viscosity), resonance tube (speed of sound), method of mixtures (specific heat).",
"Electricity, optics aur electronics: metre bridge (resistivity), Ohm's law (V–I graph), half-deflection method (galvanometer resistance aur figure of merit), parallax ke saath u–v method (focal length), prism ka i–δ curve, travelling microscope (glass slab ka refractive index), diode aur Zener characteristics, aur diode, LED, resistor, capacitor ki pehchaan.",
],
when=[
("Vessel ka external aur internal diameter aur depth.", "Negative zero error ko wapas JODO (negative ko ghataana) — sign mat chhodo."),
("Wire ka diameter, sheet ki motai.", "Sirf ratchet se ghumao aur ek hi direction mein — screw ulta ghumane se backlash error aata hai."),
("Energy dissipation: A² (energy) ko t ke against plot karo.", "A²–t graph girta hua curve hai, straight line nahi; ln A vs t straight line hoti hai."),
("Balanced metre scale par known mass se kisi object ka mass.", "Har distance balance point (knife edge) se naapo, 0 cm wale end se nahi."),
("Metallic wire ka Young's modulus.", "r screw-gauge diameter ka aadha hai — diameter daal diya to Y chaar guna chhota aayega."),
("Paani ka surface tension; detergent ka effect.", "Detergent surface tension KAM karta hai, isliye paani kam chadhta hai."),
("Liquid (glycerine, castor oil) ka coefficient of viscosity.", "Ball ka time tabhi lo jab woh terminal velocity pakad le — marks surface se kuch cm neeche se shuru karo."),
("Room temperature par hawa mein speed of sound.", "v = 4fl₁ lene se end correction chhoot jaata hai; do-length method ise cancel karta hai."),
("Solid ya liquid ki specific heat.", "Calorimeter (water equivalent W) zaroor jodo — chhod diya to specific heat galat aayegi."),
("Unknown resistance aur wire ki resistivity.", "Balance point beech mein (40–60 cm) lao aur end error cancel karne ke liye X aur R ki jagah badlo."),
("Wire ka resistance.", "Ammeter series mein aur voltmeter parallel mein — ulta lagaya to reading galat."),
("Galvanometer ka resistance aur figure of merit.", "k current per division (A/div) hai, divisions per ampere nahi."),
("Concave mirror, convex mirror (convex lens ke saath) aur convex lens ki focal length.", "No parallax ka matlab needle tip aur image tip saath hilte hain — tip to tip parallax hatao."),
("Angle of deviation vs angle of incidence.", "Curve U-shape ka hai: δ girta hai, δm tak pahunchta hai, phir badhta hai — straight line nahi."),
("Glass slab ka refractive index.", "R₁ = bina slab mark, R₂ = slab ke through mark, R₃ = slab ka top (lycopodium powder) — mix kiya to μ ulta aa jaayega."),
("Characteristic curves; Zener ka reverse breakdown voltage.", "Zener REVERSE bias mein regulator ki tarah use hota hai — forward bias mein woh normal diode hai."),
("Mixed set se diode, LED, resistor aur capacitor alag karna.", None),
],
examples=[
("Negative zero error wala vernier", "Vernier (LC 0.01 cm) mein jaws band karne par vernier zero main-scale zero ke LEFT mein hai aur 6th vernier division milta hai. Cylinder naapne par MSR = 3.1 cm aur 4th vernier division milta hai. Sahi diameter?",
 "Negative zero error = −(10 − 6) × 0.01 = ⟨0⟩ cm. Observed = 3.1 + 4 × 0.01 = ⟨1⟩ cm. Sahi = 3.14 − (−0.04) = ⟨2⟩ cm."),
("Principle of moments se mass", "Uniform metre scale 50 cm par balance hota hai. 20 cm par 50 g mass aur 70 cm par unknown mass latakne par bhi balance rehta hai. Unknown mass?",
 "50 cm ke around moments: 50 × (50 − 20) = m × (70 − 50) ⇒ m = 1500/20 = ⟨0⟩ g."),
("Wire ka Young's modulus", "Searle's apparatus mein 2.0 m lambi, 0.25 mm radius wali wire 5 kg load se 2.5 mm khinchti hai (g = 9.8 m/s²). Y?",
 "Y = MgL/(πr²Δl) = 5 × 9.8 × 2/(π × (0.25 × 10⁻³)² × 2.5 × 10⁻³) ≈ ⟨0⟩ N/m² (steel)."),
("Capillary rise se surface tension", "Saaf glass capillary (radius 0.25 mm) mein paani 5.9 cm chadhta hai (θ = 0, ρ = 1000 kg/m³, g = 9.8 m/s²). Surface tension?",
 "T = hrρg/2 = 0.059 × 0.25 × 10⁻³ × 1000 × 9.8/2 ≈ ⟨0⟩ N/m."),
("Glycerine ki viscosity", "Steel ball (r = 1 mm, ρ = 7800 kg/m³) glycerine (σ = 1260 kg/m³) mein 1.2 cm/s ki terminal speed se girti hai. η? (g = 9.8 m/s²)",
 "η = 2r²(ρ − σ)g/(9v) = 2 × 10⁻⁶ × 6540 × 9.8/(9 × 0.012) ≈ ⟨0⟩ Pa s."),
("Resonance tube se speed of sound", "512 Hz fork se resonance 16 cm aur 50 cm par milti hai. Speed of sound aur end correction?",
 "v = 2f(l₂ − l₁) = 2 × 512 × 0.34 ≈ ⟨0⟩ m/s. e = (l₂ − 3l₁)/2 = (50 − 48)/2 = ⟨1⟩ cm."),
("Method of mixtures se specific heat", "100 °C par 100 g solid ko 20 °C ke 200 g paani mein daalte hain; calorimeter ka water equivalent 10 g. Final temperature 25 °C. Solid ki specific heat?",
 "Heat lost = heat gained: 100 × s × 75 = 210 × 1 × 5 ⇒ s = 1050/7500 = ⟨0⟩ cal g⁻¹ °C⁻¹."),
("Metre bridge se resistivity", "Right gap mein 6 Ω ke saath null point left end se 40 cm par hai. Unknown wire 1 m lambi aur 0.4 mm diameter ki hai. X aur ρ?",
 "X = R l/(100 − l) = 6 × 40/60 = ⟨0⟩ Ω. ρ = Xπr²/L = 4 × π × (0.2 × 10⁻³)² ≈ ⟨1⟩ Ω m."),
("Half deflection se galvanometer", "R = 5000 Ω ke saath 2 V cell se 20 divisions deflection. Shunt S = 50 Ω lagane par deflection aadha. G aur figure of merit?",
 "G = RS/(R − S) = 5000 × 50/4950 ≈ ⟨0⟩ Ω. k = E/((R + G)θ) = 2/(5050.5 × 20) ≈ ⟨1⟩ A/div."),
("Travelling microscope se refractive index", "Readings: bina slab mark R₁ = 2.100 cm, slab ke through mark R₂ = 3.100 cm, slab ka top R₃ = 5.100 cm. Glass ka μ?",
 "Real thickness = R₃ − R₁ = 3.000 cm; apparent = R₃ − R₂ = 2.000 cm. μ = 3/2 = ⟨0⟩."),
("i–δ curve se prism", "60° prism ke i–δ curve ka sabse neeche ka point δm = 40° par hai. μ?",
 "μ = sin((60° + 40°)/2)/sin(30°) = sin 50°/0.5 ≈ ⟨0⟩."),
],
topics=[
("Reading length instruments", "Vernier callipers: bahar ke jaws external diameter, andar ke jaws internal diameter, patli strip depth ke liye. Vernier zero main-scale zero ke right mein ho to zero error positive. Screw gauge: pitch = ek poore chakkar mein screw kitna chala; LC = pitch/N (aam taur par 0.5 mm/50 = 0.01 mm). Kai jagah, ek-doosre ke right angle par reading lekar average karo."),
("Simple pendulum — energy dissipation", "Hawa ka drag aur friction amplitude ko time ke saath kam karte hain. Energy ∝ A², isliye A² vs t plot energy ka khatam hona dikhata hai (girta curve). Chhote amplitude par T = 2π√(l/g) amplitude par depend nahi karta; l bob ke centre tak naapo. Timing error kam karne ke liye bahut saare oscillations gino."),
("Searle's apparatus", "Ek hi support se do same wires latakti hain: reference wire aur experimental wire. Spirit level dono wires ko jodta hai aur micrometer sirf unki lambai ka FARAK naapta hai, isliye support ka jhukna aur temperature change cancel ho jaata hai. Load steps mein badhao aur ghatao, mean extension lo, load–extension plot karo; graph straight line honi chahiye (elastic limit ke andar raho)."),
("Surface tension and detergents", "Capillary rise h ∝ 1/r aur h ∝ T. Tube pehle saaf karo (grease angle of contact badal deta hai). Detergent daalne se surface tension kam hota hai, isliye h kam ho jaata hai. Meniscus ka bottom travelling microscope se padho."),
("Viscosity by a falling ball", "Chhoti steel balls ko glycerine ke lambe jar ke axis par dheere se chhodo; speed steady hone ke baad do marks ke beech time lo. Terminal velocity ∝ r². Liquids ki viscosity temperature badhne par kam hoti hai, isliye room temperature note karo."),
("Resonance tube details", "Paani ke upar ka air column closed pipe hai: pehli resonance λ/4 par, doosri 3λ/4 par (dono mein end correction e ≈ 0.3 × diameter juda hai). Sabse tez awaaz resonance batati hai. Speed of sound temperature ke saath badhti hai (lagbhag 0.61 m/s per °C)."),
("Method of mixtures — precautions", "Radiation loss kam karne ke liye polished, lagged calorimeter lo; garam solid jaldi transfer karo; hilao aur sabse zyada steady temperature note karo. Yahi tareeka known specific heat wale solid se liquid ki specific heat bhi deta hai."),
("Metre bridge and Ohm's law", "Metre bridge 100 cm wire wala Wheatstone bridge hai; null point par galvanometer mein current nahi behta. Jockey thodi der hi dabao (garam hone se resistance badalta hai). Ohm's law experiment: rheostat current badalta hai, V–I graph origin se guzarta hai; slope (V/I) = R."),
("Galvanometer: half deflection", "Pehle bada resistance R lagao taaki deflection θ range mein rahe, phir galvanometer ke across shunt S lagao aur use tab tak badlo jab tak deflection θ/2 na ho. Tab G = RS/(R − S); R bahut bada ho to G ≈ S. Figure of merit = ek division ke liye current."),
("Focal length and parallax", "Concave mirror aur convex lens: object needle rakho, real image needle ki jagah no parallax par dhoondo, u aur v likho; 1/v vs 1/u plot karo — slope 1 wali straight line, jiska y-intercept 1/f hai. Convex mirror virtual image banata hai, isliye pehle convex lens real image banata hai jo mirror ke liye object ka kaam karti hai."),
("Prism and glass slab", "i–δ curve: i badlo, δ naapo; minimum deviation δm tab aata hai jab ray symmetric guzarti hai (i = e). Travelling microscope: pehle mark par focus, phir slab ke through mark par, phir top par lycopodium powder par; real/apparent thickness se μ milta hai."),
("Diode, Zener and identification", "Forward characteristic: knee voltage tak lagbhag zero current, phir tez badhta hai. Reverse characteristic: bahut chhota saturation current. Zener (heavily doped) reverse bias mein V_Z par breakdown karke voltage lagbhag constant rakhta hai — voltage regulator. Multimeter se: resistor dono taraf same reading, diode ek taraf, LED ek taraf aur jalta hai, capacitor ki reading aakar zero ho jaati hai."),
],
ratta=[
"Vernier LC = MSD/N (0.01 cm); screw gauge LC = pitch/N (0.001 cm).",
"Sahi reading = observed − zero error (sign ke saath).",
"Energy ∝ A² → damping ke liye A² vs t plot.",
"Y = MgL/(πr²Δl); T = hrρg/(2 cos θ); η = 2r²(ρ − σ)g/(9v).",
"Resonance tube: v = 2f(l₂ − l₁), e = (l₂ − 3l₁)/2 ≈ 0.3d.",
"Metre bridge: X = R l/(100 − l); balance beech mein.",
"Half deflection: G = RS/(R − S); figure of merit = current per division.",
"Prism: μ = sin((A + δm)/2)/sin(A/2); i–δ curve U-shape.",
"Glass slab: μ = (R₃ − R₁)/(R₃ − R₂).",
"Zener reverse bias mein kaam karta hai; detergent surface tension kam karta hai.",
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
