from lib import F, X, T, sig, fx, _check_and_write
import math

g = 9.8
# 1 elongation of a steel wire
L1, A1, F1_, Y1 = 2.0, 1e-6, 100, 2e11; dL1 = F1_ * L1 / (A1 * Y1) * 1000        # mm
# 2 elastic energy density
u2 = (2e8) ** 2 / (2 * 2e11)
# 3 hydraulic lift
F3 = 100 * (0.5 / 0.01)                                                           # areas 0.5 m², 0.01 m²
# 4 pressure at depth
P4 = 1.013e5 + 1000 * g * 10
# 5 terminal velocity of a drop
r5, rho5, eta5 = 1e-3, 1000, 1.8e-5; vt5 = 2 * r5 ** 2 * rho5 * g / (9 * eta5)
# 6 Torricelli + continuity
v6 = math.sqrt(2 * g * 5)
# 7 capillary rise
h7 = 2 * 0.072 / (5e-4 * 1000 * g) * 100                                           # cm
# 8 excess pressure in a soap bubble
dP8 = 4 * 0.03 / 0.01

DOC = {
"slug": "mechanical-properties-of-solids-and-fluids", "subject": "Physics",
"chapters": {"NEET": "Mechanical Properties of Solids and Fluids", "JEE": "Mechanical Properties of Solids and Fluids"},
"title": "Mechanical Properties of Solids and Fluids", "readMinutes": 15,
"summary": [
"Solids resist deformation: within the elastic limit stress ∝ strain (Hooke's law). Young's, bulk and shear moduli measure stiffness for stretching, squeezing and twisting.",
"In a fluid at rest, pressure grows with depth (P = P₀ + ρgh) and is transmitted equally in all directions (Pascal's law) — the idea behind hydraulic lifts and brakes.",
"Moving fluids obey continuity (Av = constant) and Bernoulli's principle (P + ½ρv² + ρgh = constant). Viscosity opposes flow; a falling sphere reaches a terminal velocity (Stokes' law).",
"Surface tension makes liquid surfaces behave like stretched films: it causes excess pressure inside drops and bubbles and capillary rise.",
],
"formulas": [
F("Stress and strain", "stress = F/A (N/m²);  longitudinal strain = ΔL/L;  volume strain = ΔV/V;  shear strain = θ", "Describing deformation.", "Strain has no unit; stress has the unit of pressure."),
F("Hooke's law and Young's modulus", "Y = (F/A)/(ΔL/L) = FL/(AΔL)", "Stretching wires and rods.", "ΔL ∝ L/A — a thinner or longer wire stretches more for the same load.", tag="PYQ favourite"),
F("Bulk modulus and compressibility", "B = −P/(ΔV/V);  compressibility k = 1/B", "Squeezing a body from all sides.", "The minus sign makes B positive because volume decreases."),
F("Shear modulus (modulus of rigidity)", "G = (F/A)/θ", "Twisting or sliding layers.", None),
F("Poisson's ratio", "σ = (lateral strain)/(longitudinal strain) = −(Δd/d)/(ΔL/L);  theoretical range −1 to 0.5", "Change in thickness when a wire is stretched."),
F("Elastic potential energy", "U = ½ × stress × strain × volume = ½ F ΔL;  energy density u = stress²/2Y", "Energy stored in a stretched wire."),
F("Pressure in a fluid at rest", "P = P₀ + ρ g h", "Pressure at a depth h.", "Gauge pressure = ρgh (without P₀) — check which one the question asks for.", tag="PYQ favourite"),
F("Pascal's law: hydraulic lift", "F₁/A₁ = F₂/A₂  ⇒  F₂ = F₁ (A₂/A₁)", "Hydraulic lifts, brakes, presses.", "Force is multiplied but work is not — the small piston moves farther."),
F("Equation of continuity", "A₁ v₁ = A₂ v₂", "Speed of an incompressible fluid in a pipe of changing area."),
F("Bernoulli's principle", "P + ½ρv² + ρgh = constant along a streamline", "Venturi meter, aerofoil lift, blowing roofs, atomisers.", "Valid for steady, non-viscous, incompressible, streamline flow only."),
F("Torricelli's law (speed of efflux)", "v = √(2gh)  (h = depth of the hole below the free surface)", "Water from a hole in a tank."),
F("Viscous force and Stokes' law", "F = η A (dv/dx);  on a sphere F = 6πηrv", "Drag on spheres, oil drops.", None),
F("Terminal velocity", "v_t = 2r²(ρ − σ)g / (9η)   (σ = fluid density)", "Rain drops, ball bearings in glycerine.", "v_t ∝ r² — a drop twice the radius falls four times faster.", tag="PYQ favourite"),
F("Reynolds number and critical velocity", "Rₑ = ρ v D/η;  streamline below ~1000, turbulent above ~2000", "Predicting whether flow is smooth or turbulent."),
F("Surface tension and surface energy", "S = F/L = (surface energy)/(area);  work to increase area W = S ΔA", "Films, drops, blowing bubbles.", "A soap bubble has TWO surfaces — double the area."),
F("Excess pressure", "liquid drop / air bubble in a liquid: ΔP = 2S/r;  soap bubble in air: ΔP = 4S/r", "Pressure inside curved surfaces.", "Use 4S/r only for a soap bubble (two surfaces)."),
F("Capillary rise", "h = 2S cos θ / (r ρ g)", "Liquid rising or falling in a narrow tube.", "If θ > 90° (mercury in glass), h is negative — the liquid falls."),
],
"examples": [
X("Stretching a steel wire", "A 2 m steel wire of area 1 mm² carries 100 N. Y = 2 × 10¹¹ N/m². Elongation?",
  f"ΔL = FL/(AY) = 100 × 2/(10⁻⁶ × 2 × 10¹¹) = 10⁻³ m = {fx(dL1,1)} mm.", [(fx(dL1,1), "1")]),
X("Energy stored per unit volume", "A wire has stress 2 × 10⁸ N/m² and Y = 2 × 10¹¹ N/m². Energy density?",
  f"u = stress²/2Y = (4 × 10¹⁶)/(4 × 10¹¹) = {sig(u2,1)} J/m³.", [(sig(u2,1), "1 × 10⁵")]),
X("Hydraulic lift", "Pistons of area 0.01 m² and 0.5 m². A 100 N force on the small piston lifts what load?",
  f"F₂ = 100 × 0.5/0.01 = {fx(F3)} N.", [(fx(F3), "5000")]),
X("Pressure 10 m under water", "Absolute pressure at 10 m depth in water (P₀ = 1.013 × 10⁵ Pa)?",
  f"P = 1.013 × 10⁵ + 1000 × 9.8 × 10 = {sig(P4,3)} Pa — about 2 atmospheres.", [(sig(P4,3), "1.99 × 10⁵")]),
X("Terminal velocity of a drop", "A water drop of radius 1 mm falls in air (η = 1.8 × 10⁻⁵ Pa s; ignore air density). Terminal velocity?",
  f"v_t = 2r²ρg/(9η) = 2 × 10⁻⁶ × 1000 × 9.8/(9 × 1.8 × 10⁻⁵) ≈ {fx(vt5,0)} m/s (real drops are slower because the flow is no longer streamline).", [(fx(vt5,0), "121")]),
X("Water from a tank", "A hole is 5 m below the water surface of a large tank. Speed of efflux?",
  f"v = √(2gh) = √(2 × 9.8 × 5) ≈ {fx(v6,1)} m/s.", [(fx(v6,1), "9.9")]),
X("Capillary rise of water", "Water (S = 0.072 N/m, θ = 0°) in a tube of radius 0.5 mm. Height?",
  f"h = 2S/(rρg) = 0.144/(5 × 10⁻⁴ × 1000 × 9.8) ≈ {fx(h7,2)} cm.", [(fx(h7,2), "2.94")]),
X("Pressure inside a soap bubble", "Soap bubble of radius 1 cm, S = 0.03 N/m. Excess pressure?",
  f"ΔP = 4S/r = 4 × 0.03/0.01 = {fx(dP8)} Pa.", [(fx(dP8), "12")]),
],
"topics": [
T("Stress–strain curve", "Up to the proportional limit the graph is a straight line (Hooke's law). Beyond the elastic limit the body does not regain its shape; at the yield point it flows plastically, and at the breaking point it fractures. Ductile materials (copper) have a long plastic region; brittle ones (glass) break soon after the elastic limit."),
T("Applications of elasticity", "Steel is more elastic than rubber (larger Y). Beams are made with an I-section to resist bending with less material. Crane ropes are made of many thin strands, and the maximum height of a mountain is limited by the elastic limit of rocks."),
T("Pressure facts", "Pressure at a depth depends only on depth, not on the shape of the vessel (hydrostatic paradox). Atmospheric pressure ≈ 1.013 × 10⁵ Pa = 76 cm of mercury. A barometer measures it; an open-tube manometer measures gauge pressure."),
T("Buoyancy and floating", "Upthrust = weight of fluid displaced (Archimedes). A body floats when its density is less than the fluid's; the fraction submerged = ρ_body/ρ_fluid."),
T("Streamline and turbulent flow", "In streamline flow the velocity at a point does not change with time and streamlines never cross. Above the critical velocity flow becomes turbulent and Bernoulli's equation no longer applies."),
T("Applications of Bernoulli", "Aerofoil: faster air above the wing → lower pressure → lift. Roofs blow off in storms. Two boats moving side by side are pulled together. Atomisers and Bunsen burners suck in fluid where speed is high."),
T("Viscosity", "Viscosity of liquids decreases with temperature; viscosity of gases increases with temperature. Unit: Pa s (poiseuille); 1 poise = 0.1 Pa s."),
T("Surface tension effects", "Drops are spherical (minimum area). Surface tension falls with temperature and with detergents. Angle of contact < 90° → liquid wets the surface and rises in a capillary (water–glass); > 90° → does not wet and falls (mercury–glass)."),
],
"ratta": [
"Y = FL/(AΔL);  B = −PV/ΔV;  G = F/(Aθ).",
"u = stress²/2Y = ½ × stress × strain.",
"P = P₀ + ρgh;  F₂ = F₁A₂/A₁.",
"A₁v₁ = A₂v₂;  P + ½ρv² + ρgh = constant;  v = √(2gh).",
"F = 6πηrv;  v_t = 2r²(ρ − σ)g/9η  (∝ r²).",
"Drop: 2S/r;  soap bubble: 4S/r;  h = 2S cosθ/(rρg).",
"Liquids: viscosity ↓ with T;  gases: viscosity ↑ with T.",
],
}

SYLLABUS = [
("Elastic behaviour, stress-strain relationship, Hooke's law", ["stress", "strain", "Hooke"]),
("Young's modulus, bulk modulus, shear modulus of rigidity, Poisson's ratio, elastic energy", ["Young", "bulk modulus", "shear modulus", "Poisson", "elastic potential energy"]),
("Pressure due to a fluid column; Pascal's law and applications (hydraulic lift and brakes)", ["ρ g h", "Pascal", "hydraulic"]),
("Viscosity, Stokes' law, terminal velocity, streamline and turbulent flow, critical velocity", ["viscosity", "Stokes", "terminal velocity", "turbulent", "critical velocity"]),
("Bernoulli's principle and its applications", ["Bernoulli"]),
("Surface energy and surface tension, angle of contact, excess pressure, drops, bubbles, capillary rise", ["surface tension", "surface energy", "angle of contact", "excess pressure", "capillary"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
