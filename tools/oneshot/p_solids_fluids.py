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

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Solids deformation ka virodh karte hain: elastic limit ke andar stress ∝ strain (Hooke's law). Young's, bulk aur shear moduli stretching, squeezing aur twisting ki stiffness naapte hain.",
"Rukay hue fluid mein pressure depth ke saath badhta hai (P = P₀ + ρgh) aur har direction mein barabar transmit hota hai (Pascal's law) — hydraulic lift aur brakes isi par.",
"Behte fluid continuity (Av = constant) aur Bernoulli's principle (P + ½ρv² + ρgh = constant) follow karte hain. Viscosity flow ka virodh karti hai; girta sphere terminal velocity tak pahunchta hai (Stokes' law).",
"Surface tension liquid surface ko khinchi hui jhilli jaisa banata hai: drops aur bubbles ke andar excess pressure aur capillary rise isi se.",
],
when=[
("Deformation describe karna.", "Strain ki koi unit nahi; stress ki unit pressure wali — confuse mat karo."),
("Wires aur rods ko kheenchna.", "ΔL ∝ L/A — patli ya lambi wire same load par zyada khinchti hai, ulta mat socho."),
("Body ko har taraf se dabaana.", "Minus sign B ko positive banata hai kyunki volume ghatta hai — sign mat bhoolo."),
("Layers ko twist ya slide karna.", None),
("Wire kheenchne par motai mein badlav.", None),
("Khinchi wire mein stored energy.", None),
("Depth h par pressure.", "Gauge pressure = ρgh (P₀ ke bina) — check karo question kaunsa maang raha hai."),
("Hydraulic lift, brakes, press.", "Force multiply hota hai, work nahi — chhota piston zyada door chalta hai."),
("Badalte area wale pipe mein incompressible fluid ki speed.", None),
("Venturi meter, aerofoil lift, udti chhatein, atomisers.", "Sirf steady, non-viscous, incompressible, streamline flow ke liye valid."),
("Tank ke chhed se paani.", None),
("Spheres aur oil drops par drag.", None),
("Baarish ki boondein, glycerine mein ball bearings.", "v_t ∝ r² — double radius wali boond chaar guna tez girti hai, double nahi."),
("Flow smooth hoga ya turbulent, ye batana.", None),
("Films, drops, bubbles phoolana.", "Soap bubble ki DO surfaces hoti hain — area double lo, bhoolo mat."),
("Curved surfaces ke andar pressure.", "4S/r sirf soap bubble (do surfaces) ke liye; drop ke liye 2S/r — mix mat karo."),
("Patli tube mein liquid chadhna ya girna.", "θ > 90° (glass mein mercury) ho to h negative — liquid girta hai, chadhta nahi."),
],
examples=[
("Steel wire kheenchna", "2 m steel wire, area 1 mm², 100 N load. Y = 2 × 10¹¹ N/m². Elongation?",
 "ΔL = FL/(AY) = 100 × 2/(10⁻⁶ × 2 × 10¹¹) = 10⁻³ m = ⟨0⟩ mm."),
("Energy per unit volume", "Wire ka stress 2 × 10⁸ N/m², Y = 2 × 10¹¹ N/m². Energy density?",
 "u = stress²/2Y = (4 × 10¹⁶)/(4 × 10¹¹) = ⟨0⟩ J/m³."),
("Hydraulic lift", "Pistons ka area 0.01 m² aur 0.5 m². Chhote piston par 100 N kitna load uthayega?",
 "F₂ = 100 × 0.5/0.01 = ⟨0⟩ N."),
("Paani mein 10 m neeche pressure", "10 m depth par absolute pressure (P₀ = 1.013 × 10⁵ Pa)?",
 "P = 1.013 × 10⁵ + 1000 × 9.8 × 10 = ⟨0⟩ Pa — lagbhag 2 atmosphere."),
("Boond ki terminal velocity", "1 mm radius ki paani ki boond hawa mein girti hai (η = 1.8 × 10⁻⁵ Pa s; hawa ki density ignore). Terminal velocity?",
 "v_t = 2r²ρg/(9η) = 2 × 10⁻⁶ × 1000 × 9.8/(9 × 1.8 × 10⁻⁵) ≈ ⟨0⟩ m/s (asli boondein dheemi hoti hain kyunki flow streamline nahi rehta)."),
("Tank se paani", "Bade tank mein chhed paani ki surface se 5 m neeche. Efflux speed?",
 "v = √(2gh) = √(2 × 9.8 × 5) ≈ ⟨0⟩ m/s."),
("Paani ka capillary rise", "Paani (S = 0.072 N/m, θ = 0°), tube radius 0.5 mm. Height?",
 "h = 2S/(rρg) = 0.144/(5 × 10⁻⁴ × 1000 × 9.8) ≈ ⟨0⟩ cm."),
("Soap bubble ke andar pressure", "Soap bubble radius 1 cm, S = 0.03 N/m. Excess pressure?",
 "ΔP = 4S/r = 4 × 0.03/0.01 = ⟨0⟩ Pa."),
],
topics=[
("Stress–strain curve", "Proportional limit tak graph seedhi line (Hooke's law). Elastic limit ke baad body apni shape wapas nahi leti; yield point par plastic flow hota hai, breaking point par toot jaati hai. Ductile materials (copper) ka plastic region lamba; brittle (glass) elastic limit ke turant baad toot-te hain."),
("Applications of elasticity", "Steel rubber se zyada elastic hai (Y zyada). Beams I-section ke banate hain taaki kam material mein bending ka virodh ho. Crane ki rassi kai patle strands ki hoti hai, aur pahaad ki maximum height chattanon ki elastic limit se tay hoti hai."),
("Pressure facts", "Depth par pressure sirf depth par depend karta hai, bartan ki shape par nahi (hydrostatic paradox). Atmospheric pressure ≈ 1.013 × 10⁵ Pa = 76 cm mercury. Barometer ise naapta hai; open-tube manometer gauge pressure."),
("Buoyancy and floating", "Upthrust = displaced fluid ka weight (Archimedes). Body tab tairti hai jab uski density fluid se kam ho; dooba hua hissa = ρ_body/ρ_fluid."),
("Streamline and turbulent flow", "Streamline flow mein kisi point par velocity time ke saath nahi badalti aur streamlines kabhi nahi kaat-ti. Critical velocity se upar flow turbulent ho jaata hai aur Bernoulli lagu nahi hota."),
("Applications of Bernoulli", "Aerofoil: wing ke upar tez hawa → kam pressure → lift. Toofan mein chhatein ud jaati hain. Saath chalti do naavein ek-doosre ki taraf khinchti hain. Atomiser aur Bunsen burner tez speed wali jagah fluid kheenchte hain."),
("Viscosity", "Liquids ki viscosity temperature badhne par ghatti hai; gases ki badhti hai. Unit: Pa s (poiseuille); 1 poise = 0.1 Pa s."),
("Surface tension effects", "Boondein gol hoti hain (minimum area). Surface tension temperature aur detergent se ghatta hai. Angle of contact < 90° → liquid surface ko geela karta hai aur capillary mein chadhta hai (paani–glass); > 90° → geela nahi karta aur girta hai (mercury–glass)."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
