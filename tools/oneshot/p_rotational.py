from lib import F, X, T, sig, fx, build
import math

g = 10
xcm1 = (2 * 0 + 3 * 5) / (2 + 3)
Id2 = 0.5 * 2 * 0.5 ** 2; Ie2 = Id2 + 2 * 0.5 ** 2
Ir3 = 3 * 2 ** 2 / 3
t4 = 10 * 0.5 * math.sin(math.radians(30))
w5 = 4 * 3 / 2; K5a = 0.5 * 4 * 9; K5b = 0.5 * 2 * w5 ** 2
a6 = g * 0.5 / (1 + 2 / 5); v6 = math.sqrt(2 * g * 7 / (1 + 2 / 5))
K7 = 0.5 * 2 * 4 ** 2 * (1 + 0.5)
w8 = 2 * 5; th8 = 0.5 * 2 * 25
k9 = 1 / math.sqrt(2)
P10 = 20 * 50
x11 = 30 * 2 / 40

DOC = {
"slug": "rotational-motion", "subject": "Physics", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "System of Particles and Rotational Motion", "JEE": "System of Particles and Rotational Motion"},
"title": "System of Particles and Rotational Motion", "readMinutes": 22,
"summary": [
"Kai particles ya rigid body ki translation ko ek point — centre of mass (COM) — se samjhte hain: poora external force COM par laga maan lo, Ma_cm = F_ext. Internal forces COM ki motion nahi badalte.",
"Rotation mein har linear cheez ka ek jodidaar hai: displacement → θ, velocity → ω, acceleration → α, mass → moment of inertia I, force → torque τ, momentum → angular momentum L. Formula bhi same shape ke: τ = Iα, L = Iω, KE = ½Iω².",
"Moment of inertia mass ke saath-saath mass ke axis se door hone par depend karta hai (I = Σmr²). Standard bodies ke I ratta maaro; doosre axis ke liye parallel axis (I = I_cm + Md²) aur perpendicular axis (I_z = I_x + I_y, sirf planar body) theorem.",
"External torque zero ho to angular momentum conserve hota hai (Iω constant) — skater haath sikodta hai to tez ghoomta hai. Rolling without slipping mein v = ωR, aur KE = ½mv²(1 + k²/R²); incline par jiska k²/R² kam woh pehle neeche pahunchta hai.",
],
"formulas": [
F("Centre of mass", "x_cm = Σmᵢxᵢ / Σmᵢ;   continuous: x_cm = ∫x dm / ∫dm;   r_cm = Σmᵢrᵢ / M", "Particles ya body ka COM.", "COM body ke bahar bhi ho sakta hai (ring, L-shape)."),
F("Standard centres of mass", "semicircular ring 2R/π;  semicircular disc 4R/3π;  solid hemisphere 3R/8;  hollow hemisphere R/2;  solid cone h/4 (base se)", "Shapes ke COM ratta.", "Saari doori flat side / centre se naapi gayi hain.", None, "PYQ favourite"),
F("Motion of centre of mass", "M v_cm = Σ mᵢvᵢ (total momentum);   M a_cm = F_ext;   F_ext = 0 ⇒ v_cm constant", "Explosion, internal forces wale sawal.", "Explosion ke baad bhi COM wahi parabola follow karta hai."),
F("Rotational kinematics", "ω = ω₀ + αt;   θ = ω₀t + ½αt²;   ω² = ω₀² + 2αθ;   v = ωr, a_t = αr", "Constant α par ghoomna.", "θ radian mein; rev ko 2π se multiply karo."),
F("Torque", "τ = r × F;   |τ| = rF sinθ = F × (perpendicular distance)", "Ghumaane wala asar.", "Axis se guzarne wala force torque nahi deta."),
F("Newton's second law for rotation", "τ_net = Iα", "Pulley, ghoomti disc.", "I usi axis ke baare mein lo jiske baare mein τ liya."),
F("Angular momentum", "L = r × p;   rigid body: L = Iω;   τ = dL/dt", "Ghoomti body ka momentum.", "Seedhi line mein chalti particle ka bhi kisi point ke baare mein L hota hai (= mvr⊥)."),
F("Conservation of angular momentum", "τ_ext = 0 ⇒ I₁ω₁ = I₂ω₂", "Skater, ghoomti stool, planet orbit.", "L conserve hota hai, rotational KE nahi (haath sikodne par KE badhti hai).", None, "PYQ favourite"),
F("Moment of inertia and radius of gyration", "I = Σmr² = ∫r² dm;   I = Mk²  (k = radius of gyration)", "Rotational inertia.", "I axis par depend karta hai — 'disc ka I' tab tak adhoora jab tak axis na bataya ho."),
F("Standard moments of inertia", "ring (centre ⊥) MR²;  disc ½MR²;  hollow sphere ⅔MR²;  solid sphere ⅖MR²;  rod (centre ⊥) ML²/12;  rod (end) ML²/3;  ring (diameter) ½MR²;  disc (diameter) ¼MR²;  solid cylinder (axis) ½MR²", "Ratta list.", None, None, "PYQ favourite"),
F("Parallel axis theorem", "I = I_cm + Md²", "COM se d door parallel axis.", "Sirf COM wale axis se shuru karo, kisi aur se nahi."),
F("Perpendicular axis theorem", "I_z = I_x + I_y", "Planar (flat) body — ring, disc, plate.", "3-D body (sphere, cylinder) par mat lagao."),
F("Rotational KE, work and power", "K = ½Iω²;   W = ∫τ dθ;   P = τω", "Flywheel, motor.", "W = τθ sirf constant torque par."),
F("Rolling without slipping", "v_cm = ωR;   K = ½mv²(1 + k²/R²);   incline: a = g sinθ/(1 + k²/R²);   v = √[2gh/(1 + k²/R²)]", "Ball, cylinder, ring ludhak rahe hain.", "Rolling mein contact point ki velocity zero; friction kaam nahi karta (energy conserve).", None, "PYQ favourite"),
F("Which rolls down first", "k²/R²: solid sphere 2/5 < disc/solid cylinder 1/2 < hollow sphere 2/3 < ring 1 ⇒ solid sphere pehle, ring aakhir mein", "Race on an incline.", "Mass aur radius se farak nahi padta — sirf shape (k²/R²)."),
F("Equilibrium of a rigid body", "ΣF = 0 (translational) aur Στ = 0 kisi bhi point ke baare mein (rotational);   couple: net force 0, torque F × d", "Seesaw, ladder, beam.", "Torque ka point aisa chuno jahan unknown forces lag rahe hon — equations chhoti ho jaati hain."),
],
"examples": [
X("Do particles ka COM", "2 kg x = 0 par aur 3 kg x = 5 m par. COM?",
  f"x_cm = (0 + 15)/5 = {fx(xcm1)} m — bhaari mass ki taraf.", [(fx(xcm1), "3")]),
X("Disc: centre aur rim", "2 kg, R = 0.5 m disc. Centre ke perpendicular axis aur rim par parallel axis ke baare mein I?",
  f"I_cm = ½MR² = {fx(Id2)} kg·m². Rim par: I = I_cm + MR² = {fx(Ie2)} kg·m² (= 3/2 MR²).",
  [(fx(Id2), "0.25"), (fx(Ie2), "0.75")]),
X("Rod ke end par I", "3 kg, 2 m rod, ek end se perpendicular axis. I?",
  f"I = ML²/3 = 3 × 4/3 = {fx(Ir3)} kg·m².", [(fx(Ir3), "4")]),
X("Torque", "Spanner par 10 N force 0.5 m door, spanner se 30° angle par. Torque?",
  f"τ = rF sinθ = 0.5 × 10 × 0.5 = {fx(t4)} N·m.", [(fx(t4), "2.5")]),
X("Skater", "Skater I = 4 kg·m², ω = 3 rad/s. Haath sikodkar I = 2 kg·m². Naya ω aur KE?",
  f"I₁ω₁ = I₂ω₂ ⇒ ω₂ = 12/2 = {fx(w5)} rad/s. KE: {fx(K5a)} J se {fx(K5b)} J — badhi (muscles ne kaam kiya).",
  [(fx(w5), "6"), (fx(K5a), "18"), (fx(K5b), "36")]),
X("Incline par solid sphere", "Solid sphere 30° incline par bina slip ludhakta hai, height 7 m (g = 10). Acceleration aur neeche speed?",
  f"a = g sinθ/(1 + 2/5) = 5/1.4 ≈ {fx(a6)} m/s². v = √(2gh/1.4) = √100 = {fx(v6)} m/s.",
  [(fx(a6), "3.57"), (fx(v6), "10")]),
X("Rolling disc ki KE", "2 kg disc 4 m/s se roll kar rahi hai. Total KE?",
  f"K = ½mv²(1 + ½) = ½ × 2 × 16 × 1.5 = {fx(K7)} J (iska 1/3 rotational).", [(fx(K7), "24")]),
X("Flywheel", "Flywheel rest se α = 2 rad/s² se 5 s ghoomta hai. ω aur θ?",
  f"ω = αt = {fx(w8)} rad/s. θ = ½αt² = {fx(th8)} rad.", [(fx(w8), "10"), (fx(th8), "25")]),
X("Radius of gyration", "1 m radius ring ka diameter ke baare mein k?",
  f"I = ½MR² = Mk² ⇒ k = R/√2 ≈ {fx(k9)} m.", [(fx(k9), "0.71")]),
X("Motor ki power", "Motor 20 N·m torque se 50 rad/s par ghumaata hai. Power?",
  f"P = τω = 20 × 50 = {fx(P10)} W.", [(fx(P10), "1000")]),
X("Seesaw", "30 kg bachcha pivot se 2 m door. 40 kg bachcha kahan baithe ki balance ho?",
  f"30 × 2 = 40 × x ⇒ x = {fx(x11)} m.", [(fx(x11), "1.5")]),
],
"topics": [
T("Rigid body aur motion ke prakaar", "Rigid body mein particles ki doori nahi badalti. Motion: pure translation (sab points same velocity), pure rotation (fixed axis ke chaaron taraf), ya dono (rolling)."),
T("Centre of mass vs centre of gravity", "COM mass distribution se tay hota hai; uniform g mein centre of gravity wahi point. Symmetric uniform body ka COM geometric centre par. COM par lagaaya force sirf translation deta hai."),
T("Torque aur angular momentum ka matlab", "Torque ghumaane ki koshish hai — darwaze ka handle hinge se door isliye lagta hai. Angular momentum ghoomne ka 'momentum' hai. Particle ka L = mvr⊥ kisi bhi point ke baare mein."),
T("Moment of inertia kis par depend", "Mass, mass ka distribution aur axis ki position. Same mass ki ring ka I disc se zyada (saara mass rim par). Flywheel ka zyada mass rim par rakhte hain taaki rotation smooth rahe."),
T("Linear vs rotational analogy", "x ↔ θ, v ↔ ω, a ↔ α, m ↔ I, F ↔ τ, p ↔ L, F = ma ↔ τ = Iα, KE ½mv² ↔ ½Iω², P = Fv ↔ τω. Ek yaad to doosra apne aap."),
T("Rolling motion", "Rolling = translation + rotation. Top point ki speed 2v, contact point zero. Static friction rolling banaata hai par kaam nahi karta. Smooth incline par body sirf slide karegi, roll nahi."),
T("Conservation of angular momentum ke examples", "Skater/dancer haath sikodta hai — I ghata, ω badha. Diver hawa mein body mod kar zyada somersault karta hai. Ghoomte stool par aadmi dumbbells andar kheenchta hai. Planets suraj ke paas tez chalte hain (Kepler ka doosra niyam)."),
],
"ratta": [
"Ma_cm = F_ext;  internal forces COM nahi hilaate.",
"τ = Iα;  L = Iω;  K = ½Iω²;  P = τω.",
"Ring MR², disc ½MR², solid sphere ⅖MR², hollow sphere ⅔MR², rod ML²/12 (centre), ML²/3 (end).",
"I = I_cm + Md²;  I_z = I_x + I_y (planar).",
"τ = 0 ⇒ I₁ω₁ = I₂ω₂.",
"Rolling: v = ωR;  a = g sinθ/(1 + k²/R²).",
"Race: solid sphere > disc > hollow sphere > ring.",
"COM: semicircular ring 2R/π, disc 4R/3π, solid hemisphere 3R/8.",
],
}

DOC_EN = {
"slug": "rotational-motion", "subject": "Physics", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "System of Particles and Rotational Motion", "JEE": "System of Particles and Rotational Motion"},
"title": "System of Particles and Rotational Motion", "readMinutes": 22,
"summary": [
"The translation of a system of particles or a rigid body is described by one point — the centre of mass (COM): treat all external force as acting at the COM, Ma_cm = F_ext. Internal forces don't change the motion of the COM.",
"Every linear quantity has a rotational partner: displacement → θ, velocity → ω, acceleration → α, mass → moment of inertia I, force → torque τ, momentum → angular momentum L. The formulas have the same shape: τ = Iα, L = Iω, KE = ½Iω².",
"Moment of inertia depends on mass and on how far it is from the axis (I = Σmr²). Learn I for standard bodies; for other axes use the parallel axis theorem (I = I_cm + Md²) and the perpendicular axis theorem (I_z = I_x + I_y, planar bodies only).",
"With zero external torque angular momentum is conserved (Iω constant) — a skater spins faster by pulling in her arms. In rolling without slipping v = ωR and KE = ½mv²(1 + k²/R²); on an incline the body with smaller k²/R² reaches the bottom first.",
],
"formulas": [
F("Centre of mass", "x_cm = Σmᵢxᵢ / Σmᵢ;   continuous: x_cm = ∫x dm / ∫dm;   r_cm = Σmᵢrᵢ / M", "COM of particles or a body.", "The COM can lie outside the body (ring, L-shape)."),
F("Standard centres of mass", "semicircular ring 2R/π;  semicircular disc 4R/3π;  solid hemisphere 3R/8;  hollow hemisphere R/2;  solid cone h/4 (from the base)", "COM of standard shapes.", "All distances are measured from the flat side / centre.", None, "PYQ favourite"),
F("Motion of centre of mass", "M v_cm = Σ mᵢvᵢ (total momentum);   M a_cm = F_ext;   F_ext = 0 ⇒ v_cm constant", "Explosions, problems with internal forces.", "After an explosion the COM continues on the same parabola."),
F("Rotational kinematics", "ω = ω₀ + αt;   θ = ω₀t + ½αt²;   ω² = ω₀² + 2αθ;   v = ωr, a_t = αr", "Rotation with constant α.", "θ in radians; multiply revolutions by 2π."),
F("Torque", "τ = r × F;   |τ| = rF sin θ = F × (perpendicular distance)", "Turning effect of a force.", "A force through the axis gives no torque."),
F("Newton's second law for rotation", "τ_net = Iα", "Pulleys, rotating discs.", "Take I about the same axis as τ."),
F("Angular momentum", "L = r × p;   rigid body: L = Iω;   τ = dL/dt", "Momentum of a rotating body.", "Even a particle moving in a straight line has L about a point (= mvr⊥)."),
F("Conservation of angular momentum", "τ_ext = 0 ⇒ I₁ω₁ = I₂ω₂", "Skaters, rotating stools, planetary orbits.", "L is conserved but rotational KE is not (KE increases when arms are pulled in).", None, "PYQ favourite"),
F("Moment of inertia and radius of gyration", "I = Σmr² = ∫r² dm;   I = Mk²  (k = radius of gyration)", "Rotational inertia.", "I depends on the axis — 'I of a disc' is incomplete without the axis."),
F("Standard moments of inertia", "ring (centre ⊥) MR²;  disc ½MR²;  hollow sphere ⅔MR²;  solid sphere ⅖MR²;  rod (centre ⊥) ML²/12;  rod (end) ML²/3;  ring (diameter) ½MR²;  disc (diameter) ¼MR²;  solid cylinder (axis) ½MR²", "List to memorise.", None, None, "PYQ favourite"),
F("Parallel axis theorem", "I = I_cm + Md²", "Parallel axis at distance d from the COM.", "Always start from the axis through the COM, not any other axis."),
F("Perpendicular axis theorem", "I_z = I_x + I_y", "Planar (flat) bodies — ring, disc, plate.", "Don't use it for 3-D bodies (sphere, cylinder)."),
F("Rotational KE, work and power", "K = ½Iω²;   W = ∫τ dθ;   P = τω", "Flywheels, motors.", "W = τθ only for constant torque."),
F("Rolling without slipping", "v_cm = ωR;   K = ½mv²(1 + k²/R²);   incline: a = g sin θ/(1 + k²/R²);   v = √[2gh/(1 + k²/R²)]", "Balls, cylinders, rings rolling.", "The contact point has zero velocity; friction does no work (energy is conserved).", None, "PYQ favourite"),
F("Which rolls down first", "k²/R²: solid sphere 2/5 < disc/solid cylinder 1/2 < hollow sphere 2/3 < ring 1 ⇒ solid sphere first, ring last", "Race down an incline.", "Mass and radius don't matter — only shape (k²/R²)."),
F("Equilibrium of a rigid body", "ΣF = 0 (translational) and Στ = 0 about any point (rotational);   couple: zero net force, torque F × d", "Seesaws, ladders, beams.", "Take torques about the point where unknown forces act — the equations get shorter."),
],
"examples": [
X("COM of two particles", "2 kg at x = 0 and 3 kg at x = 5 m. COM?",
  f"x_cm = (0 + 15)/5 = {fx(xcm1)} m — closer to the heavier mass.", [(fx(xcm1), "3")]),
X("Disc: centre and rim", "Disc 2 kg, R = 0.5 m. I about the perpendicular axis through the centre and a parallel axis through the rim?",
  f"I_cm = ½MR² = {fx(Id2)} kg·m². At the rim: I = I_cm + MR² = {fx(Ie2)} kg·m² (= 3/2 MR²).",
  [(fx(Id2), "0.25"), (fx(Ie2), "0.75")]),
X("I of a rod about its end", "3 kg, 2 m rod, perpendicular axis through one end. I?",
  f"I = ML²/3 = 3 × 4/3 = {fx(Ir3)} kg·m².", [(fx(Ir3), "4")]),
X("Torque", "A 10 N force acts 0.5 m from the nut on a spanner, at 30° to the spanner. Torque?",
  f"τ = rF sin θ = 0.5 × 10 × 0.5 = {fx(t4)} N·m.", [(fx(t4), "2.5")]),
X("Skater", "A skater with I = 4 kg·m² spins at 3 rad/s and pulls in her arms to I = 2 kg·m². New ω and KE?",
  f"I₁ω₁ = I₂ω₂ ⇒ ω₂ = 12/2 = {fx(w5)} rad/s. KE goes from {fx(K5a)} J to {fx(K5b)} J — it increases (her muscles did work).",
  [(fx(w5), "6"), (fx(K5a), "18"), (fx(K5b), "36")]),
X("Solid sphere on an incline", "A solid sphere rolls without slipping down a 30° incline of height 7 m (g = 10). Acceleration and speed at the bottom?",
  f"a = g sin θ/(1 + 2/5) = 5/1.4 ≈ {fx(a6)} m/s². v = √(2gh/1.4) = √100 = {fx(v6)} m/s.",
  [(fx(a6), "3.57"), (fx(v6), "10")]),
X("KE of a rolling disc", "A 2 kg disc rolls at 4 m/s. Total KE?",
  f"K = ½mv²(1 + ½) = ½ × 2 × 16 × 1.5 = {fx(K7)} J (one-third of it rotational).", [(fx(K7), "24")]),
X("Flywheel", "A flywheel starts from rest with α = 2 rad/s² for 5 s. ω and θ?",
  f"ω = αt = {fx(w8)} rad/s. θ = ½αt² = {fx(th8)} rad.", [(fx(w8), "10"), (fx(th8), "25")]),
X("Radius of gyration", "k of a ring of radius 1 m about a diameter?",
  f"I = ½MR² = Mk² ⇒ k = R/√2 ≈ {fx(k9)} m.", [(fx(k9), "0.71")]),
X("Power of a motor", "A motor delivers 20 N·m of torque at 50 rad/s. Power?",
  f"P = τω = 20 × 50 = {fx(P10)} W.", [(fx(P10), "1000")]),
X("Seesaw", "A 30 kg child sits 2 m from the pivot. Where should a 40 kg child sit to balance?",
  f"30 × 2 = 40 × x ⇒ x = {fx(x11)} m.", [(fx(x11), "1.5")]),
],
"topics": [
T("Rigid bodies and types of motion", "In a rigid body distances between particles don't change. Motion can be pure translation (all points have the same velocity), pure rotation (about a fixed axis), or both (rolling)."),
T("Centre of mass vs centre of gravity", "The COM is set by mass distribution; in uniform g the centre of gravity is the same point. A symmetric uniform body has its COM at the geometric centre. A force applied at the COM causes only translation."),
T("Meaning of torque and angular momentum", "Torque is the tendency to rotate — a door handle is far from the hinges for this reason. Angular momentum is the 'momentum' of rotation. For a particle, L = mvr⊥ about any point."),
T("What moment of inertia depends on", "Mass, how the mass is distributed and the position of the axis. A ring has larger I than a disc of the same mass (all its mass is at the rim). Flywheels keep most mass at the rim for smooth rotation."),
T("Linear vs rotational analogy", "x ↔ θ, v ↔ ω, a ↔ α, m ↔ I, F ↔ τ, p ↔ L, F = ma ↔ τ = Iα, KE ½mv² ↔ ½Iω², P = Fv ↔ τω. Remember one set and the other follows."),
T("Rolling motion", "Rolling = translation + rotation. The top point moves at 2v, the contact point at zero. Static friction makes rolling possible but does no work. On a smooth incline a body only slides, it cannot roll."),
T("Examples of angular momentum conservation", "A skater or dancer pulls in her arms — I decreases, ω increases. A diver curls up in the air to do more somersaults. A man on a rotating stool pulls dumbbells inward. Planets move faster near the Sun (Kepler's second law)."),
],
"ratta": [
"Ma_cm = F_ext;  internal forces don't move the COM.",
"τ = Iα;  L = Iω;  K = ½Iω²;  P = τω.",
"Ring MR², disc ½MR², solid sphere ⅖MR², hollow sphere ⅔MR², rod ML²/12 (centre), ML²/3 (end).",
"I = I_cm + Md²;  I_z = I_x + I_y (planar).",
"τ = 0 ⇒ I₁ω₁ = I₂ω₂.",
"Rolling: v = ωR;  a = g sin θ/(1 + k²/R²).",
"Race: solid sphere > disc > hollow sphere > ring.",
"COM: semicircular ring 2R/π, disc 4R/3π, solid hemisphere 3R/8.",
],
}

SYLLABUS = [
("Centre of mass of a two-particle system and of a rigid body; motion of centre of mass", ["Centre of mass", "Motion of centre of mass"]),
("Basic concepts of rotational motion; moment of a force (torque); angular momentum and its conservation with examples", ["Torque", "Angular momentum", "Conservation of angular momentum"]),
("Equilibrium of rigid bodies; rigid body rotation and equations of rotational motion", ["Equilibrium of a rigid body", "Rotational kinematics"]),
("Moment of inertia, radius of gyration; values for simple geometrical objects", ["Moment of inertia", "radius of gyration", "Standard moments of inertia"]),
("Parallel and perpendicular axes theorems and their applications", ["Parallel axis theorem", "Perpendicular axis theorem"]),
("Rolling motion; comparison of linear and rotational motions", ["Rolling", "analogy"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
