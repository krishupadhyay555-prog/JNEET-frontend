"""Batch 3 — Physics (NEET + JEE). Every number below is computed, never typed."""
from math import sqrt, pi, sin, cos, tan, radians, log, atan, degrees, exp
from qlib import mcq, blank, sig, u, frac

S = "Physics"
def P(exam, chap, cat, diff, text, correct, wrongs, expl):
    mcq(exam, S, chap, cat, diff, text, correct, wrongs, expl)

g = 10

# ---------------- Units and Measurement ----------------
pitch, N, zero, msr, csr = 0.5, 50, 3, 4.0, 27
lc = pitch / N; r = msr + csr * lc - zero * lc
P("NEET", "Units and Measurement", "tough", "tough",
  f"A screw gauge has pitch {pitch} mm and {N} circular-scale divisions. With the jaws closed, the zero of the circular scale is {zero} divisions BELOW the reference line (positive zero error). Measuring a wire, the main scale reads {msr} mm and the circular scale reads {csr} divisions. The corrected diameter is",
  f"{r:.2f} mm", [f"{msr + csr*lc + zero*lc:.2f} mm", f"{msr + csr*lc:.2f} mm", f"{msr + csr*0.1 - zero*0.1:.2f} mm"],
  f"LC = {pitch}/{N} = {lc} mm. Observed = {msr} + {csr}×{lc} = {msr+csr*lc:.2f} mm. Positive zero error = +{zero}×{lc} = {zero*lc:.2f} mm is subtracted: {r:.2f} mm.")
pitch, N, zero, msr, csr = 1.0, 100, 4, 2.0, 63
lc = pitch / N; r = msr + csr * lc + zero * lc
P("JEE", "Units and Measurement", "tough", "tough",
  f"A screw gauge has pitch {pitch:g} mm and {N} circular divisions. With the jaws closed, the zero of the circular scale lies {zero} divisions ABOVE the reference line (negative zero error). A wire gives main-scale reading {msr:g} mm and circular-scale reading {csr}. The true diameter is",
  f"{r:.2f} mm", [f"{msr + csr*lc - zero*lc:.2f} mm", f"{msr + csr*lc:.2f} mm", f"{msr + (csr+zero)*0.1:.2f} mm"],
  f"LC = {lc} mm. Observed = {msr+csr*lc:.2f} mm. Negative zero error ({zero} divisions = −{zero*lc:.2f} mm) means we ADD {zero*lc:.2f} mm: {r:.2f} mm.")
P("NEET", "Units and Measurement", "tough", "tough",
  "The momentum of a body is measured with an error of 2% and its mass with an error of 1%. The maximum percentage error in its kinetic energy calculated from K = p²/2m is",
  "5%", ["3%", "4%", "1%"], "ΔK/K = 2(Δp/p) + Δm/m = 2(2%) + 1% = 5%.")
P("JEE", "Units and Measurement", "tough", "tough",
  "The Planck length is built only from G, h and c as L = G^a h^b c^d. The values of (a, b, d) are",
  "(1/2, 1/2, −3/2)", ["(1/2, −1/2, 3/2)", "(−1/2, 1/2, −3/2)", "(1/2, 1/2, −5/2)"],
  "[G] = M⁻¹L³T⁻², [h] = ML²T⁻¹, [c] = LT⁻¹. M: −a + b = 0; T: −2a − b − d = 0; L: 3a + 2b + d = 1. So a = b, d = −3a, and 3a + 2a − 3a = 1 gives a = 1/2. Hence (1/2, 1/2, −3/2).")
P("NEET", "Units and Measurement", "formula", "moderate",
  "If force F, velocity v and time T are taken as fundamental quantities, the dimensional formula of mass is",
  "F v⁻¹ T", ["F v T⁻¹", "F v⁻² T", "F⁻¹ v T"], "F = ma = m v/T, so m = F T/v = F v⁻¹ T.")
P("JEE", "Units and Measurement", "formula", "moderate",
  "If energy E, velocity v and time T are taken as fundamental quantities, the dimensional formula of surface tension is",
  "E v⁻² T⁻²", ["E v⁻¹ T⁻¹", "E v² T⁻²", "E v⁻² T²"],
  "Surface tension = energy/area. Area = (vT)². So S = E/(v²T²) = E v⁻² T⁻².")

# ---------------- Kinematics ----------------
P("NEET", "Kinematics", "tough", "tough",
  "A balloon is rising vertically with a constant speed of 10 m/s. When it is 40 m above the ground, a stone is released from it. Taking g = 10 m/s², the time taken by the stone to reach the ground is",
  "4 s", ["2 s", "2√2 s", "5 s"],
  "The stone starts with 10 m/s upward. Taking up as positive: −40 = 10t − 5t² → t² − 2t − 8 = 0 → t = 4 s.")
P("JEE", "Kinematics", "tough", "tough",
  "A balloon rises vertically with a constant speed of 15 m/s. A packet is dropped from it when it is 50 m above the ground. Taking g = 10 m/s², the speed of the packet just before it hits the ground is",
  "35 m/s", ["√1000 m/s", "25 m/s", "50 m/s"],
  "v² = u² + 2gh with u = 15 m/s (upward, but speed at the same level coming down is 15 m/s): v² = 225 + 2×10×50 = 1225, so v = 35 m/s.")
H, uu = 45, 20; t = sqrt(2 * H / g)
P("NEET", "Kinematics", "tough", "tough",
  f"A ball is thrown horizontally at {uu} m/s from the top of a tower {H} m high. Taking g = 10 m/s², the speed of the ball just before it hits the ground is",
  u(sqrt(uu**2 + 2*g*H), "m/s"),
  ["30 m/s", "50 m/s", "20 m/s"],
  f"Time of fall = √(2×{H}/10) = {t:g} s, vertical speed = {g*t:g} m/s. Speed = √({uu}² + {g*t:g}²) = √{uu**2 + (g*t)**2:g} ≈ {u(sqrt(uu**2+2*g*H), 'm/s')}.")
u0, th, h0 = 20, 30, 25
vy = u0 * sin(radians(th)); tt = (vy + sqrt(vy**2 + 2 * g * h0)) / g; R = u0 * cos(radians(th)) * tt
P("JEE", "Kinematics", "tough", "tough",
  f"A stone is projected from the top of a {h0} m high building with speed {u0} m/s at {th}° above the horizontal. Taking g = 10 m/s², how far from the foot of the building does it land?",
  u(R, "m"), [u(u0 * cos(radians(th)) * 2 * vy / g, "m"), u(u0 * cos(radians(th)) * sqrt(2*h0/g), "m"), u(u0**2 / g, "m")],
  f"Vertical: −{h0} = {vy:g}t − 5t² → t² − 2t − 5 = 0 → t = 1 + √6 ≈ {tt:.3f} s. Horizontal distance = {u0}cos30° × t = {u0*cos(radians(th)):.2f} × {tt:.3f} ≈ {R:.1f} m.")
P("NEET", "Kinematics", "tough", "tough",
  "For a projectile, the horizontal range is 4√3 times its maximum height. The angle of projection with the horizontal is",
  "30°", ["60°", "45°", "15°"],
  "R/H = (u² sin2θ/g)/(u² sin²θ/2g) = 4/tanθ. So 4/tanθ = 4√3 → tanθ = 1/√3 → θ = 30°.")
P("JEE", "Kinematics", "tough", "tough",
  "Two projectiles are thrown with the same speed at angles 30° and 60° with the horizontal. The ratio of their maximum heights (30° : 60°) and the ratio of their ranges are, respectively,",
  "1 : 3 and 1 : 1", ["1 : 3 and 1 : 2", "1 : √3 and 1 : 1", "3 : 1 and 1 : 1"],
  "H ∝ sin²θ: sin²30° : sin²60° = 1/4 : 3/4 = 1 : 3. R ∝ sin2θ: sin60° = sin120°, so ranges are equal.")
P("NEET", "Kinematics", "tough", "tough",
  "A river 200 m wide flows at 3 m/s. A boat can move at 5 m/s relative to water. If the boat must reach the point directly opposite on the other bank, the time taken is",
  "50 s", ["40 s", "25 s", "66.7 s"],
  "To go straight across, the boat heads upstream so that the resultant velocity is √(5² − 3²) = 4 m/s across the river. Time = 200/4 = 50 s.")
P("JEE", "Kinematics", "tough", "tough",
  "A river 400 m wide flows at 3 m/s. A swimmer whose speed in still water is 5 m/s wants to cross in the shortest possible time. How far downstream does he land?",
  "240 m", ["300 m", "160 m", "0 m"],
  "Shortest time: head straight across. t = 400/5 = 80 s. Drift = 3 × 80 = 240 m.")
P("NEET", "Kinematics", "formula", "moderate",
  "A car moving at speed v stops in a distance s under a constant braking force. If its speed is increased by 50% and the same braking force acts, the stopping distance becomes",
  "2.25 s", ["1.5 s", "3 s", "1.25 s"], "s = v²/2a. With 1.5v, s' = (1.5)² s = 2.25 s.")
P("JEE", "Kinematics", "formula", "moderate",
  "A particle starts from rest with a uniform acceleration. The ratio of distances covered by it in the 3rd and 5th seconds is",
  "5 : 9", ["3 : 5", "9 : 25", "1 : 2"], "Distance in nth second = a(2n − 1)/2. Ratio = (2×3 − 1) : (2×5 − 1) = 5 : 9.")

# ---------------- Laws of Motion ----------------
a = (6 - 4 * 0.5) * g / 10; T = 6 * (g - a)
P("NEET", "Laws of Motion", "tough", "tough",
  "A 4 kg block on a smooth incline of 30° is connected by a light string over a smooth pulley at the top to a hanging 6 kg block. Taking g = 10 m/s², the tension in the string is",
  f"{T:g} N", ["60 N", "24 N", "40 N"],
  f"a = (m₂g − m₁g sin30°)/(m₁ + m₂) = (60 − 20)/10 = {a:g} m/s². For the hanging block: T = m₂(g − a) = 6 × {g - a:g} = {T:g} N.")
m1, m2, mu = 5, 8, 0.25
a = (m2 - m1 * 0.6 - mu * m1 * 0.8) * g / (m1 + m2); T = m2 * (g - a)
P("JEE", "Laws of Motion", "tough", "tough",
  f"A {m1} kg block lies on a rough incline of 37° (μ = {mu}) and is tied by a light string over a smooth pulley at the top to a hanging {m2} kg block. Taking g = 10 m/s², sin37° = 0.6, the acceleration of the system is",
  u(a, "m/s²"), [u((m2 - m1 * 0.6) * g / (m1 + m2), "m/s²"), u((m2 - m1*0.6 + mu*m1*0.8) * g / (m1 + m2), "m/s²"), u(m2 * g / (m1 + m2), "m/s²")],
  f"Driving force = {m2}g − {m1}g sin37° − μ{m1}g cos37° = 80 − 30 − 10 = 40 N. a = 40/{m1+m2} ≈ {a:.2f} m/s² (tension T = {m2}(g − a) ≈ {T:.1f} N).")
P("NEET", "Laws of Motion", "tough", "tough",
  "A 2 kg block rests on an 8 kg plank lying on a smooth floor. The coefficient of static friction between the block and the plank is 0.3. The maximum horizontal force that can be applied to the PLANK so that the block and plank move together is (g = 10 m/s²)",
  "30 N", ["6 N", "24 N", "7.5 N"],
  "The block can be accelerated only by friction: a_max = μg = 3 m/s². For both together: F = (2 + 8) × 3 = 30 N.")
P("JEE", "Laws of Motion", "tough", "tough",
  "A 2 kg block rests on a 4 kg plank lying on a smooth floor. The coefficient of static friction between them is 0.5. A horizontal force F is applied to the BLOCK. The maximum F for which block and plank move together is (g = 10 m/s²)",
  "15 N", ["10 N", "30 N", "20 N"],
  "The plank is driven only by friction: a_max = μmg/M = 0.5×2×10/4 = 2.5 m/s². For the pair: F = (2 + 4) × 2.5 = 15 N.")
P("NEET", "Laws of Motion", "formula", "moderate",
  "A 60 kg man stands on a weighing machine inside a lift that is accelerating upward at 2 m/s². Taking g = 10 m/s², the machine reads",
  "72 kg", ["48 kg", "60 kg", "62 kg"], "Normal force N = m(g + a) = 60 × 12 = 720 N, which the machine shows as 720/10 = 72 kg.")
P("JEE", "Laws of Motion", "formula", "moderate",
  "A 5 kg body hangs from a spring balance fixed to the roof of a lift. The lift moves downward and slows down at 2 m/s². Taking g = 10 m/s², the reading of the balance is",
  "60 N", ["40 N", "50 N", "70 N"],
  "Moving down and slowing down means the acceleration is upward (2 m/s²). T = m(g + a) = 5 × 12 = 60 N.")
v = sqrt(40 * g * 1)
P("NEET", "Laws of Motion", "tough", "tough",
  "A road is banked at 45° on a curve of radius 40 m. The speed at which a car can take the curve without relying on friction is (g = 10 m/s²)",
  "20 m/s", ["10 m/s", "20√2 m/s", "40 m/s"], "v = √(rg tanθ) = √(40 × 10 × 1) = 20 m/s.")
r, th, mu = 100, 37, 0.25; tn = 0.75
v = sqrt(r * g * (mu + tn) / (1 - mu * tn))
P("JEE", "Laws of Motion", "tough", "tough",
  f"A curve of radius {r} m is banked at 37° (tan37° = 0.75). The coefficient of friction between tyres and road is {mu}. The maximum safe speed is (g = 10 m/s²)",
  u(v, "m/s"), [u(sqrt(r * g * tn), "m/s"), u(sqrt(r * g * (mu + tn)), "m/s"), u(sqrt(r * g * mu), "m/s")],
  f"v_max = √[rg(μ + tanθ)/(1 − μ tanθ)] = √[1000 × 1/(1 − 0.1875)] = √{r*g*(mu+tn)/(1-mu*tn):.1f} ≈ {v:.1f} m/s.")

# ---------------- Work, Energy and Power ----------------
P("NEET", "Work, Energy and Power", "tough", "tough",
  "A uniform chain of mass 4 kg and length 2 m lies on a smooth table with one-fourth of its length hanging over the edge. The work needed to pull the hanging part back onto the table is (g = 10 m/s²)",
  "2.5 J", ["5 J", "10 J", "1.25 J"],
  "Hanging mass = 1 kg, its centre of mass is (0.5 m)/2 = 0.25 m below the edge. W = mgh = 1 × 10 × 0.25 = 2.5 J (formula MgL/2n² = 4×10×2/32).")
P("JEE", "Work, Energy and Power", "tough", "tough",
  "A uniform chain of mass 6 kg and length 1.5 m is held on a smooth table with one-third of it hanging. The work done to pull the whole chain onto the table is (g = 10 m/s²)",
  "5 J", ["10 J", "2.5 J", "15 J"],
  "Hanging mass = 2 kg, length 0.5 m, centre of mass 0.25 m below the edge. W = 2 × 10 × 0.25 = 5 J.")
V = 0.02 * 400 / 4.0
P("NEET", "Work, Energy and Power", "tough", "tough",
  "A 20 g bullet moving at 400 m/s gets embedded in a 3.98 kg wooden block suspended by a string. To what height does the block rise? (g = 10 m/s²)",
  "0.2 m", ["0.4 m", "8 m", "0.1 m"],
  f"Momentum: 0.02 × 400 = 4 × V → V = {V:g} m/s. Height h = V²/2g = 4/20 = 0.2 m.")
P("JEE", "Work, Energy and Power", "tough", "tough",
  "A ball is dropped from a height of 10 m onto a floor with coefficient of restitution 0.5. The total distance travelled by the ball before it comes to rest is",
  "16.7 m (approx.)", ["20 m", "13.3 m (approx.)", "12.5 m"],
  "Total distance = h(1 + e²)/(1 − e²) = 10 × 1.25/0.75 ≈ 16.7 m.")
P("NEET", "Work, Energy and Power", "tough", "tough",
  "A pump lifts 1000 litres of water to a height of 20 m in 5 minutes. Neglecting losses, its power is (g = 10 m/s², density of water 1000 kg/m³)",
  "667 W (approx.)", ["4000 W", "66.7 W (approx.)", "200 W"], "P = mgh/t = 1000 × 10 × 20/300 ≈ 667 W.")
P("JEE", "Work, Energy and Power", "tough", "tough",
  "A pump of efficiency 80% raises water at 20 kg per second through 15 m and delivers it with a speed of 10 m/s. The input power of the pump is (g = 10 m/s²)",
  "5 kW", ["4 kW", "3.75 kW", "3.2 kW"],
  "Useful power = ṁ(gh + v²/2) = 20 × (150 + 50) = 4000 W. Input = 4000/0.8 = 5000 W.")
P("NEET", "Work, Energy and Power", "formula", "moderate",
  "The kinetic energy of a body is increased by 300%. The percentage increase in its momentum is",
  "100%", ["300%", "50%", "200%"], "p = √(2mK). K becomes 4K, so p becomes 2p — an increase of 100%.")
P("JEE", "Work, Energy and Power", "formula", "moderate",
  "A force F = (3x²) N acts on a particle along the x-axis. The work done by this force as the particle moves from x = 1 m to x = 3 m is",
  "26 J", ["27 J", "24 J", "18 J"], "W = ∫F dx = [x³] from 1 to 3 = 27 − 1 = 26 J.")

# ---------------- Rotation ----------------
P("NEET", "System of Particles and Rotational Motion", "tough", "tough",
  "A constant torque of 20 N m acts on a wheel of moment of inertia 4 kg m², initially at rest. The angle turned through in the first 5 s and the angular speed at 5 s are",
  "62.5 rad and 25 rad/s", ["125 rad and 25 rad/s", "62.5 rad and 12.5 rad/s", "25 rad and 5 rad/s"],
  "α = τ/I = 5 rad/s². θ = ½αt² = ½ × 5 × 25 = 62.5 rad; ω = αt = 25 rad/s.")
P("JEE", "System of Particles and Rotational Motion", "tough", "tough",
  "A disc rotating freely with angular speed ω about its axis has a second identical disc, initially at rest, gently placed on it coaxially. They soon rotate together. The fraction of the initial kinetic energy lost is",
  "1/2", ["1/4", "3/4", "0"],
  "Iω = 2Iω' → ω' = ω/2. K_f = ½(2I)(ω/2)² = Iω²/4 = half of K_i = Iω²/2. So half is lost (as heat by friction).")
P("NEET", "System of Particles and Rotational Motion", "tough", "tough",
  "A horizontal disc of mass 100 kg rotates freely about its vertical axis with angular speed ω. A 25 kg child standing at the rim walks to the centre. The new angular speed is",
  "1.5ω", ["1.25ω", "2ω", "0.75ω"],
  "I₁ = MR²/2 + mR² = 50R² + 25R² = 75R²; I₂ = 50R². ω₂ = ω × 75/50 = 1.5ω.")
P("JEE", "System of Particles and Rotational Motion", "tough", "tough",
  "A horizontal disc of mass 100 kg rotates freely about its axis. A 25 kg child moves from its rim to its centre. The rotational kinetic energy of the system",
  "increases by 50%", ["decreases by 50%", "remains the same", "increases by 25%"],
  "L is conserved, K = L²/2I. I goes from 75R² to 50R², so K becomes 75/50 = 1.5 times — a 50% increase (the child does work).")
P("NEET", "System of Particles and Rotational Motion", "tough", "tough",
  "Four identical thin rods, each of mass m and length L, form a square. The moment of inertia about an axis through the centre of the square perpendicular to its plane is",
  "4mL²/3", ["mL²/3", "2mL²/3", "mL²"],
  "Each rod: I = mL²/12 + m(L/2)² = mL²/3. For four rods: 4mL²/3.")
P("JEE", "System of Particles and Rotational Motion", "tough", "tough",
  "Four identical thin rods, each of mass m and length L, form a square frame. Its moment of inertia about an axis along one side of the square is",
  "5mL²/3", ["4mL²/3", "2mL²/3", "mL²"],
  "Side on the axis: 0. Two sides perpendicular to the axis rotate about an end: 2 × mL²/3. Opposite side at distance L: mL². Total = 2mL²/3 + mL² = 5mL²/3.")
P("NEET", "System of Particles and Rotational Motion", "tough", "tough",
  "A uniform ladder rests against a smooth vertical wall, making 60° with the rough floor. The minimum coefficient of friction at the floor that keeps the ladder from slipping is",
  "1/(2√3)", ["√3/2", "1/√3", "1/2"],
  "Torque about the bottom: N_wall L sin60° = mg (L/2) cos60° → N_wall = mg/(2 tan60°). Friction = N_wall ≤ μmg → μ ≥ 1/(2√3).")
P("NEET", "System of Particles and Rotational Motion", "formula", "moderate",
  "The moment of inertia of a thin ring of mass M and radius R about a tangent in its own plane is",
  "3MR²/2", ["MR²/2", "2MR²", "5MR²/4"],
  "About a diameter: MR²/2. Parallel axis to the tangent: MR²/2 + MR² = 3MR²/2.")
P("JEE", "System of Particles and Rotational Motion", "formula", "moderate",
  "A flywheel accelerates uniformly from rest to 1200 rpm in 20 s. The number of revolutions it makes in this time is",
  "200", ["400", "100", "600"],
  "ω goes from 0 to 20 rev/s; average 10 rev/s for 20 s gives 200 revolutions.")

# ---------------- Gravitation ----------------
P("NEET", "Gravitation", "tough", "tough",
  "The acceleration due to gravity at a height R/2 above the Earth's surface equals that at a depth d below the surface (R = Earth's radius). Then d is",
  "5R/9", ["R/2", "4R/9", "R/4"],
  "At height R/2: g' = g/(1.5)² = 4g/9. At depth d: g(1 − d/R). So 1 − d/R = 4/9 → d = 5R/9.")
P("JEE", "Gravitation", "tough", "tough",
  "The energy needed to move a satellite of mass m from a circular orbit of radius 2R to one of radius 3R around the Earth (radius R, surface gravity g) is",
  "mgR/12", ["mgR/6", "mgR/3", "mgR/24"],
  "Orbital energy E = −GMm/2r. ΔE = GMm(1/4R − 1/6R) = GMm/12R = mgR/12 (using GM = gR²).")
P("NEET", "Gravitation", "tough", "tough",
  "A geostationary satellite has period 24 h at an orbital radius of about 42,000 km. A satellite at an orbital radius of 10,500 km has a period of",
  "3 h", ["6 h", "12 h", "1.5 h"], "T ∝ r^(3/2). r is one-fourth, so T = 24/8 = 3 h.")
P("JEE", "Gravitation", "tough", "tough",
  "A body is projected vertically upward from the Earth's surface with speed equal to half the escape speed. The maximum height it reaches (R = Earth's radius) is",
  "R/3", ["R/2", "R/4", "R"],
  "½m(vₑ/2)² = GMm(1/R − 1/(R+h)) with vₑ² = 2GM/R: GM/4R = GM h/[R(R+h)] → R + h = 4h → h = R/3.")
P("NEET", "Gravitation", "formula", "moderate",
  "A planet has twice the mass of the Earth and twice its radius. The escape speed from it compared with the Earth's escape speed of 11.2 km/s is",
  "11.2 km/s", ["22.4 km/s", "5.6 km/s", "15.8 km/s"], "vₑ = √(2GM/R). M and R both double, so vₑ is unchanged.")
P("JEE", "Gravitation", "formula", "moderate",
  "If the Earth shrank to half its radius with no change in mass, the acceleration due to gravity at its surface would become",
  "4g", ["2g", "g/4", "g/2"], "g = GM/R². Halving R makes g four times.")

# ---------------- Solids and Fluids ----------------
P("NEET", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "A steel wire (Y = 2 × 10¹¹ N/m²) is under a stress of 2 × 10⁸ N/m². The elastic energy stored per unit volume is",
  "1 × 10⁵ J/m³", ["2 × 10⁵ J/m³", "1 × 10⁻³ J/m³", "4 × 10⁵ J/m³"],
  "u = stress²/2Y = (4 × 10¹⁶)/(4 × 10¹¹) = 1 × 10⁵ J/m³.")
P("JEE", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "A steel rod of cross-section 2 cm² is clamped between two rigid walls and heated by 50 °C. For steel, Y = 2 × 10¹¹ N/m² and α = 1.2 × 10⁻⁵ /°C. The force exerted on the walls is",
  "2.4 × 10⁴ N", ["1.2 × 10⁸ N", "1.2 × 10⁴ N", "4.8 × 10⁴ N"],
  "Thermal stress = YαΔT = 2 × 10¹¹ × 1.2 × 10⁻⁵ × 50 = 1.2 × 10⁸ N/m². Force = 1.2 × 10⁸ × 2 × 10⁻⁴ = 2.4 × 10⁴ N.")
P("NEET", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "Eight identical rain drops, each falling with terminal speed 2 cm/s, merge into one drop. The terminal speed of the big drop is",
  "8 cm/s", ["16 cm/s", "4 cm/s", "2 cm/s"],
  "Volume ×8 → radius ×2. Terminal speed ∝ r², so it becomes 4 × 2 = 8 cm/s.")
P("JEE", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "Twenty-seven identical mercury drops, each with terminal speed 1.5 cm/s in air, combine into one drop. Its terminal speed is",
  "13.5 cm/s", ["4.5 cm/s", "40.5 cm/s", "9 cm/s"],
  "Radius becomes 27^(1/3) = 3 times; v ∝ r² → 9 × 1.5 = 13.5 cm/s.")
R1 = 2 * sqrt(5 * 15)
P("NEET", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "Water stands 20 m high in a tank. A small hole is made 5 m below the water surface. The water strikes the ground at a horizontal distance of",
  f"10√3 m ≈ {R1:.1f} m", ["10 m", "20 m", "5√3 m ≈ 8.7 m"],
  "Efflux speed v = √(2gh) with h = 5 m; fall height = 15 m. Range = 2√[h(H − h)] = 2√(5 × 15) = 10√3 m.")
P("JEE", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "Water fills a tall tank to a height of 12 m. A hole at depth 3 m below the surface throws a jet. At what other depth below the surface must a second hole be made so that its jet lands at the same spot?",
  "9 m", ["6 m", "4 m", "8 m"],
  "Range = 2√[h(H − h)] is the same for h and H − h. With H = 12 m and h = 3 m, the other depth is 9 m.")
W = 8 * pi * (1e-2) ** 2 * 0.03
P("NEET", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "The work done in blowing a soap bubble of radius 1 cm (surface tension 0.03 N/m) is",
  f"{sig(W)} J", [f"{sig(W/2)} J", f"{sig(W*2)} J", f"{sig(4*pi*1e-4*0.03/4)} J"],
  f"A soap bubble has two surfaces: W = T × 2 × 4πr² = 8π × 10⁻⁴ × 0.03 ≈ {sig(W)} J.")
P("JEE", "Mechanical Properties of Solids and Fluids", "tough", "tough",
  "Two soap bubbles of radii 3 cm and 4 cm coalesce under isothermal conditions in vacuum. The radius of the new bubble is",
  "5 cm", ["7 cm", "4.5 cm", "√7 cm"],
  "In vacuum PV = (4T/r)(4πr³/3) ∝ r². Conserving PV: r² = 3² + 4² → r = 5 cm.")
P("NEET", "Mechanical Properties of Solids and Fluids", "formula", "moderate",
  "Water (surface tension 0.07 N/m, angle of contact 0°) rises in a capillary tube of radius 0.5 mm to a height of (g = 10 m/s²)",
  "2.8 cm", ["1.4 cm", "5.6 cm", "0.28 cm"], "h = 2T/(rρg) = 2 × 0.07/(5 × 10⁻⁴ × 1000 × 10) = 0.028 m = 2.8 cm.")
P("JEE", "Mechanical Properties of Solids and Fluids", "formula", "moderate",
  "Water rises to 6 cm in a capillary tube on the ground. If the experiment is done in a lift accelerating upward at g/2, the rise will be",
  "4 cm", ["6 cm", "9 cm", "12 cm"], "h ∝ 1/g_eff. g_eff = 1.5g, so h = 6/1.5 = 4 cm.")

# ---------------- Thermal Properties ----------------
P("NEET", "Thermal Properties of Matter", "tough", "tough",
  "20 g of steam at 100 °C is passed into 100 g of ice at 0 °C. Latent heat of steam = 540 cal/g, of ice = 80 cal/g, specific heat of water = 1 cal/g°C. The final temperature is",
  "40 °C", ["0 °C", "60 °C", "20 °C"],
  "Steam giving heat down to 0 °C: 20(540 + 100) = 12800 cal. Melting ice needs 8000 cal. Remaining 4800 cal warms 120 g water: ΔT = 4800/120 = 40 °C.")
P("JEE", "Thermal Properties of Matter", "tough", "tough",
  "50 g of ice at −10 °C is put into 100 g of water at 40 °C. Specific heat of ice = 0.5 cal/g°C, latent heat of ice = 80 cal/g. At equilibrium, the mass of ice left is about",
  "3.1 g", ["0 g", "6.3 g", "12.5 g"],
  "Water cooling to 0 °C gives 4000 cal. Warming the ice to 0 °C uses 50 × 0.5 × 10 = 250 cal; 3750 cal remain → melts 3750/80 = 46.9 g. Ice left ≈ 3.1 g at 0 °C.")
loss = 0.5 * 1.2e-5 * 20 * 86400
P("NEET", "Thermal Properties of Matter", "tough", "tough",
  "A pendulum clock with a steel rod (α = 1.2 × 10⁻⁵ /°C) keeps correct time at 20 °C. At 40 °C, it will",
  f"lose about {loss:.1f} s per day", [f"gain about {loss:.1f} s per day", f"lose about {2*loss:.1f} s per day", "keep correct time"],
  f"T ∝ √L, so ΔT/T = ½αΔθ. Time lost per day = ½ × 1.2 × 10⁻⁵ × 20 × 86400 ≈ {loss:.1f} s (longer rod, slower clock).")
P("NEET", "Thermal Properties of Matter", "tough", "tough",
  "Two slabs of equal thickness and area are joined face to face. Conductivity of the first is twice that of the second. The outer faces are at 100 °C (first slab) and 0 °C. The temperature of the junction is",
  "66.7 °C (approx.)", ["50 °C", "33.3 °C (approx.)", "75 °C"],
  "Equal heat current: 2K(100 − T) = K(T − 0) → 3T = 200 → T ≈ 66.7 °C.")
P("JEE", "Thermal Properties of Matter", "tough", "tough",
  "Slab A (thickness 2 cm, conductivity 3K) and slab B (thickness 1 cm, conductivity K) of equal area are in contact. The free face of A is at 100 °C and that of B at 0 °C. The interface temperature is",
  "60 °C", ["75 °C", "40 °C", "50 °C"],
  "(3K/2)(100 − T) = (K/1)(T − 0) → 150 − 1.5T = T → T = 60 °C.")
P("JEE", "Thermal Properties of Matter", "tough", "tough",
  "Two rods of the same length and cross-section, with thermal conductivities K and 3K, are placed side by side (in parallel) between the same two heat reservoirs. They can be replaced by a single rod of the same length and twice the cross-section having conductivity",
  "2K", ["4K", "3K/4", "1.5K/2"],
  "Parallel heat currents add: (K + 3K)A ΔT/L = K_eq(2A)ΔT/L → K_eq = 2K.")
P("NEET", "Thermal Properties of Matter", "formula", "moderate",
  "Steel rails 10 m long are laid at 20 °C. If the temperature can rise to 70 °C, the gap needed between rails is (α = 1.2 × 10⁻⁵ /°C)",
  "6 mm", ["12 mm", "0.6 mm", "3 mm"], "ΔL = LαΔT = 10 × 1.2 × 10⁻⁵ × 50 = 6 × 10⁻³ m = 6 mm.")
P("JEE", "Thermal Properties of Matter", "formula", "moderate",
  "A metal cube has linear expansion coefficient 2 × 10⁻⁵ /°C. When heated through 100 °C, its volume increases by about",
  "0.6%", ["0.2%", "0.4%", "6%"], "γ = 3α = 6 × 10⁻⁵ /°C. ΔV/V = γΔT = 6 × 10⁻³ = 0.6%.")

# ---------------- Thermodynamics + KTG ----------------
P("NEET", "Thermodynamics", "tough", "tough",
  "An ideal gas is taken through a cycle: from A (P₀, V₀) it is heated at constant volume to B (2P₀, V₀), then expanded at constant pressure to C (2P₀, 2V₀), and finally brought back to A along a straight line on the P–V diagram. The net work done by the gas in the cycle is",
  "P₀V₀/2", ["P₀V₀", "2P₀V₀", "3P₀V₀/2"],
  "Net work = area enclosed by the triangle ABC on the P–V diagram = ½ × (2V₀ − V₀) × (2P₀ − P₀) = P₀V₀/2 (clockwise, so positive).")
P("JEE", "Thermodynamics", "tough", "tough",
  "One mole of a monoatomic ideal gas at pressure P expands at constant pressure from volume V to 2V. The heat supplied to the gas is",
  "5PV/2", ["3PV/2", "PV", "7PV/2"],
  "Q = nCₚΔT = (5/2)nRΔT = (5/2)P(2V − V) = 5PV/2 (of which PV is work and 3PV/2 raises internal energy).")
P("NEET", "Thermodynamics", "tough", "tough",
  "A monoatomic ideal gas at 300 K is compressed adiabatically to one-eighth of its volume. Its final temperature is",
  "1200 K", ["2400 K", "600 K", "300 K"], "TV^(γ−1) = constant with γ − 1 = 2/3: T₂ = 300 × 8^(2/3) = 300 × 4 = 1200 K.")
P("JEE", "Thermodynamics", "tough", "tough",
  "One mole of a monoatomic gas is mixed with one mole of a diatomic gas (rigid molecules). The ratio of specific heats γ of the mixture is",
  "1.5", ["1.4", "1.53", "1.67"],
  "Cᵥ(mix) = (3R/2 + 5R/2)/2 = 2R, Cₚ = Cᵥ + R = 3R. γ = 3R/2R = 1.5.")
P("NEET", "Thermodynamics", "tough", "tough",
  "When a diatomic ideal gas is heated at constant pressure, the fraction of the supplied heat that is converted into work is",
  "2/7", ["5/7", "2/5", "3/5"], "W/Q = nRΔT/(nCₚΔT) = R/(7R/2) = 2/7.")
P("JEE", "Thermodynamics", "tough", "tough",
  "Two moles of an ideal gas expand isothermally at 300 K from 10 L to 20 L. The heat absorbed by the gas is (R = 8.3 J/mol K, ln2 = 0.693)",
  f"{2*8.3*300*0.693:.0f} J (approx.)", [f"{8.3*300*0.693:.0f} J (approx.)", "0 J", f"{2*8.3*300:.0f} J"],
  f"Isothermal: ΔU = 0, Q = W = nRT ln(V₂/V₁) = 2 × 8.3 × 300 × 0.693 ≈ {2*8.3*300*0.693:.0f} J.")
P("NEET", "Kinetic Theory", "tough", "tough",
  "At what temperature will the rms speed of oxygen molecules equal the rms speed of hydrogen molecules at 300 K?",
  "4800 K", ["2400 K", "1200 K", "300 K"], "v_rms ∝ √(T/M): T/32 = 300/2 → T = 4800 K.")
P("JEE", "Kinetic Theory", "tough", "tough",
  "For a non-linear triatomic gas with no vibrational modes, the average energy per molecule at temperature T is (k = Boltzmann constant)",
  "3kT", ["5kT/2", "3kT/2", "7kT/2"], "A non-linear molecule has 3 translational + 3 rotational degrees of freedom; each contributes kT/2: 6 × kT/2 = 3kT.")
P("NEET", "Kinetic Theory", "formula", "moderate",
  "The pressure of an ideal gas is doubled and its absolute temperature is halved. Its mean free path becomes",
  "one-fourth", ["four times", "unchanged", "half"], "λ ∝ T/P (λ = kT/√2πd²P). T/2 and 2P → λ/4.")

# ---------------- Oscillations + Waves ----------------
P("NEET", "Oscillations", "tough", "tough",
  "A spring of force constant k is cut into two pieces whose lengths are in the ratio 1 : 2. A mass m attached to the shorter piece oscillates with period (T = 2π√(m/k))",
  "T/√3", ["T√3", "T/√(3/2)", "T/3"], "k ∝ 1/length; the shorter piece is 1/3 of the length, so k' = 3k and T' = T/√3.")
P("JEE", "Oscillations", "tough", "tough",
  "A mass on two springs of constants k and 4k oscillates with period Tₚ when the springs are in parallel and Tₛ when in series. Tₛ/Tₚ is",
  "5/2", ["2/5", "√5/2", "5/4"],
  "kₚ = 5k, kₛ = (k × 4k)/5k = 4k/5. Tₛ/Tₚ = √(kₚ/kₛ) = √(25/4) = 5/2.")
P("NEET", "Oscillations", "tough", "tough",
  "A particle in SHM has amplitude 10 cm and period π s. Its speed when the displacement is 6 cm is",
  "16 cm/s", ["8 cm/s", "20 cm/s", "12 cm/s"], "ω = 2π/T = 2 rad/s. v = ω√(A² − x²) = 2√(100 − 36) = 16 cm/s.")
P("JEE", "Oscillations", "tough", "tough",
  "A particle executes SHM of period T. The minimum time it takes to go from x = A/2 to x = A is",
  "T/6", ["T/12", "T/4", "T/8"],
  "x = A sin ωt: x = A/2 at ωt = π/6, x = A at ωt = π/2. Δt = (π/3)/ω = T/6.")
P("NEET", "Oscillations", "tough", "tough",
  "A simple pendulum has period T in a stationary lift. If the lift accelerates upward at g, the period becomes",
  "T/√2", ["T√2", "T/2", "T"], "g_eff = 2g, T ∝ 1/√g → T/√2.")
P("JEE", "Oscillations", "tough", "tough",
  "A simple pendulum hangs in a car accelerating horizontally at 7.5 m/s² (g = 10 m/s²). If its period at rest is T, its period now is",
  "0.89T (approx.)", ["0.8T", "1.12T (approx.)", "0.63T (approx.)"],
  "g_eff = √(10² + 7.5²) = 12.5 m/s². T' = T√(10/12.5) = T√0.8 ≈ 0.89T.")
P("NEET", "Waves", "tough", "tough",
  "A pipe 50 cm long is closed at one end. Speed of sound is 340 m/s. How many natural frequencies of this pipe lie below 1000 Hz?",
  "3", ["5", "2", "6"],
  "f₁ = v/4L = 340/2 = 170 Hz; only odd harmonics: 170, 510, 850, 1190… Three lie below 1000 Hz.")
P("JEE", "Waves", "tough", "tough",
  "The fundamental frequency of a closed organ pipe equals the second harmonic of an open pipe. The ratio of their lengths (closed : open) is",
  "1 : 4", ["1 : 2", "2 : 1", "4 : 1"],
  "Closed: v/4L_c. Open second harmonic: 2v/2L_o = v/L_o. Equal → L_o = 4L_c, so L_c : L_o = 1 : 4.")
P("NEET", "Waves", "tough", "tough",
  "Tuning fork A (256 Hz) gives 4 beats per second with fork B. When A is loaded with a little wax, the beats increase to 6 per second. The frequency of B is",
  "252 Hz", ["260 Hz", "250 Hz", "262 Hz"],
  "B is 252 or 260 Hz. Wax lowers A's frequency; beats increase only if B is lower than A, so B = 252 Hz.")
P("JEE", "Waves", "tough", "tough",
  "A stretched wire has fundamental frequency 300 Hz. If the tension is increased by 44% and the length is increased by 20%, the new fundamental frequency is",
  "300 Hz", ["360 Hz", "250 Hz", "432 Hz"], "f ∝ √T/L: √1.44/1.2 = 1.2/1.2 = 1 → still 300 Hz.")
P("NEET", "Waves", "formula", "moderate",
  "The equation of a wave is y = 0.02 sin(100πt − 2πx) in SI units. Its speed is",
  "50 m/s", ["100 m/s", "25 m/s", "200 m/s"], "v = ω/k = 100π/2π = 50 m/s.")

# ---------------- Electrostatics ----------------
P("NEET", "Electrostatics", "tough", "tough",
  "An electric dipole of moment 4 × 10⁻⁹ C m is aligned with a uniform field of 5 × 10⁴ N/C. The work needed to rotate it through 60° is",
  "1 × 10⁻⁴ J", ["2 × 10⁻⁴ J", "1.73 × 10⁻⁴ J", "0.5 × 10⁻⁴ J"], "W = pE(1 − cos60°) = 4 × 10⁻⁹ × 5 × 10⁴ × 0.5 = 1 × 10⁻⁴ J.")
P("JEE", "Electrostatics", "tough", "tough",
  "A capacitor of 3 μF charged to 60 V is connected to a 6 μF capacitor charged to 30 V, positive plate to positive plate. The energy lost in the redistribution is",
  "0.9 mJ", ["1.8 mJ", "0.45 mJ", "0 mJ"],
  "Common V = (180 + 180)/9 = 40 V. Loss = C₁C₂(V₁ − V₂)²/2(C₁ + C₂) = (18/9) × 900/2 μJ = 900 μJ = 0.9 mJ.")
P("NEET", "Electrostatics", "tough", "tough",
  "A 2 μF capacitor charged to 100 V is connected across an identical uncharged capacitor. The energy lost as heat is",
  "5 mJ", ["10 mJ", "2.5 mJ", "0 mJ"],
  "Initial energy = ½ × 2 × 10⁻⁶ × 10⁴ = 10 mJ. Final V = 50 V, energy = 2 × ½ × 2 × 10⁻⁶ × 2500 = 5 mJ. Loss = 5 mJ.")
P("NEET", "Electrostatics", "tough", "tough",
  "A dielectric slab of constant 4 and thickness half the plate separation is inserted in a parallel-plate capacitor of capacitance C₀. The new capacitance is",
  "1.6C₀", ["2C₀", "2.5C₀", "1.25C₀"], "C = ε₀A/(d − t + t/K) = ε₀A/(d/2 + d/8) = 8C₀/5 = 1.6C₀.")
P("JEE", "Electrostatics", "tough", "tough",
  "The space between the plates of a parallel-plate capacitor is filled with two slabs side by side, each covering half the plate area, of dielectric constants 2 and 4. If the empty capacitance was C₀, the new capacitance is",
  "3C₀", ["6C₀", "8C₀/3", "4C₀/3"], "Side by side = parallel: C = (K₁ + K₂)C₀/2 = 3C₀.")
P("JEE", "Electrostatics", "tough", "tough",
  "The same two dielectric slabs (constants 2 and 4) are instead placed one over the other, each filling half the gap of a capacitor of empty capacitance C₀. The capacitance becomes",
  "8C₀/3", ["3C₀", "6C₀", "3C₀/2"], "Stacked = series of 2K₁C₀ and 2K₂C₀ = 4C₀ and 8C₀: C = 32C₀/12 = 8C₀/3.")
P("NEET", "Electrostatics", "tough", "tough",
  "Four charges of +2 μC each sit at the corners of a square whose centre is 1 m from each corner. The electric potential and field at the centre are (1/4πε₀ = 9 × 10⁹)",
  "7.2 × 10⁴ V and zero", ["7.2 × 10⁴ V and 7.2 × 10⁴ N/C", "zero and zero", "1.8 × 10⁴ V and zero"],
  "Potential adds as scalars: 4 × 9 × 10⁹ × 2 × 10⁻⁶/1 = 7.2 × 10⁴ V. Fields cancel in opposite pairs, so E = 0.")
P("NEET", "Electrostatics", "formula", "moderate",
  "Two point charges repel with force F. If each charge is doubled and the distance between them is also doubled, the force becomes",
  "F", ["4F", "F/4", "2F"], "F ∝ q₁q₂/r²: (2 × 2)/2² = 1.")
P("JEE", "Electrostatics", "formula", "moderate",
  "A point charge q sits at one corner of a cube. The electric flux through the whole cube is",
  "q/8ε₀", ["q/ε₀", "q/6ε₀", "q/24ε₀"], "Eight such cubes enclose the charge symmetrically, so one cube gets q/8ε₀.")

# ---------------- Current Electricity ----------------
P("NEET", "Current Electricity", "tough", "tough",
  "In a Wheatstone bridge the four arms are P = 10 Ω, Q = 20 Ω, R = 15 Ω and S = 40 Ω (balance needs P/Q = R/S). What resistance must be connected in parallel with S to balance the bridge?",
  "120 Ω", ["30 Ω", "10 Ω", "60 Ω"],
  "Balance needs S' = QR/P = 20 × 15/10 = 30 Ω. 40X/(40 + X) = 30 → 10X = 1200 → X = 120 Ω.")
P("JEE", "Current Electricity", "tough", "tough",
  "A 10 V cell (internal resistance 1 Ω) and a 4 V cell (internal resistance 1 Ω) are connected in series opposing each other with an external 4 Ω resistor. The potential difference across the terminals of the 4 V cell is",
  "5 V", ["3 V", "4 V", "6 V"],
  "I = (10 − 4)/(1 + 1 + 4) = 1 A. The 4 V cell is being charged, so V = E + Ir = 4 + 1 × 1 = 5 V.")
P("NEET", "Current Electricity", "tough", "tough",
  "Ten cells, each of emf 1.5 V and internal resistance 0.5 Ω, are joined in series, but one cell is connected the wrong way round. With an external resistance of 7 Ω, the current is",
  "1 A", ["1.25 A", "1.5 A", "0.75 A"],
  "Net emf = (9 − 1) × 1.5 = 12 V (the reversed cell cancels one good cell). Total r = 10 × 0.5 = 5 Ω. I = 12/12 = 1 A.")
V = (6 / 1 + 3 / 2) / (1 + 1 / 2 + 1 / 4)
P("JEE", "Current Electricity", "tough", "tough",
  "Two cells (6 V, 1 Ω) and (3 V, 2 Ω) are connected in parallel, positive to positive, across a 4 Ω resistor. The current through the resistor is",
  f"{V/4:.2f} A", [f"{9/7:.2f} A", f"{6/5:.2f} A", f"{V/7:.2f} A"],
  f"Voltage across R: V = (6/1 + 3/2)/(1/1 + 1/2 + 1/4) = 7.5/1.75 ≈ {V:.2f} V. Current = V/4 ≈ {V/4:.2f} A.")
vd = 1.5 / (8.5e28 * 1.6e-19 * 2.5e-6)
P("NEET", "Current Electricity", "tough", "tough",
  "A copper wire of cross-section 2.5 mm² carries 1.5 A. Free-electron density is 8.5 × 10²⁸ per m³. The drift speed is about",
  f"{sig(vd)} m/s", [f"{sig(vd*10)} m/s", f"{sig(vd/10)} m/s", "3 × 10⁸ m/s"],
  f"v_d = I/(neA) = 1.5/(8.5 × 10²⁸ × 1.6 × 10⁻¹⁹ × 2.5 × 10⁻⁶) ≈ {sig(vd)} m/s.")
P("JEE", "Current Electricity", "tough", "tough",
  "A 12 V battery of internal resistance 0.5 Ω is being charged by a current of 4 A. The potential difference across its terminals is",
  "14 V", ["10 V", "12 V", "16 V"], "While charging, V = E + Ir = 12 + 4 × 0.5 = 14 V.")
P("NEET", "Current Electricity", "formula", "moderate",
  "A wire is stretched so that its radius becomes half while its volume stays the same. Its resistance becomes",
  "16 times", ["4 times", "8 times", "2 times"], "Area → 1/4, length → 4 times. R ∝ L/A → 4 × 4 = 16 times.")
P("JEE", "Current Electricity", "formula", "moderate",
  "A wire is stretched uniformly to increase its length by 20%. The percentage increase in its resistance is",
  "44%", ["20%", "40%", "21%"], "R ∝ L² at constant volume: 1.2² = 1.44 → 44% increase.")

# ---------------- Magnetism ----------------
P("NEET", "Moving Charges and Magnetism", "tough", "tough",
  "A wire forms a single circular loop carrying current I. The same wire is rewound into a circular coil of two turns carrying the same current. The field at the centre becomes",
  "4 times", ["2 times", "half", "unchanged"], "Radius halves and turns double: B = μ₀NI/2R → 2/(1/2) = 4 times.")
P("JEE", "Moving Charges and Magnetism", "tough", "tough",
  "A wire of fixed length is bent first into a square and then into a circle, carrying the same current. The ratio of magnetic fields at the centre (square : circle) is",
  "8√2/π²", ["π²/8√2", "√2/π", "1"],
  "Square side a: B = 4 × μ₀I/(4π(a/2)) × 2 sin45° = 2√2μ₀I/(πa). Circle: R = 2a/π, B = μ₀I/2R = πμ₀I/4a. Ratio = 8√2/π² ≈ 1.15.")
r = sqrt(2 * 200 * 9.1e-31 / 1.6e-19) / 1e-3
P("NEET", "Moving Charges and Magnetism", "tough", "tough",
  "An electron accelerated through 200 V enters a magnetic field of 1 × 10⁻³ T perpendicular to its velocity. The radius of its path is about (mₑ = 9.1 × 10⁻³¹ kg, e = 1.6 × 10⁻¹⁹ C)",
  f"{r*100:.1f} cm", [f"{r*100/2:.1f} cm", f"{r*100*sqrt(2):.1f} cm", f"{r*1000:.1f} cm"],
  f"r = √(2mV/e)/B = √(2 × 9.1 × 10⁻³¹ × 200/1.6 × 10⁻¹⁹)/10⁻³ ≈ {r:.4f} m ≈ {r*100:.1f} cm.")
P("JEE", "Moving Charges and Magnetism", "tough", "tough",
  "A charged particle enters a uniform magnetic field with its velocity at 60° to the field. The ratio of the pitch of its helix to the radius of the helix is",
  "2π/√3", ["2π√3", "π/√3", "√3π"],
  "Pitch = v cos60° × 2πm/qB; radius = m v sin60°/qB. Ratio = 2π cos60°/sin60° = 2π/√3.")
P("NEET", "Moving Charges and Magnetism", "tough", "tough",
  "A galvanometer of resistance 50 Ω gives full-scale deflection at 2 mA. To convert it into a voltmeter of range 0–10 V, we must connect",
  "4950 Ω in series", ["5000 Ω in series", "4950 Ω in parallel", "0.1 Ω in parallel"], "R = V/I_g − G = 10/0.002 − 50 = 4950 Ω, in series.")
P("JEE", "Moving Charges and Magnetism", "tough", "tough",
  "A galvanometer of resistance 50 Ω gives full-scale deflection at 2 mA. The shunt needed to convert it into an ammeter of range 0–1 A is about",
  "0.1 Ω", ["0.01 Ω", "1 Ω", "4950 Ω"], "S = I_gG/(I − I_g) = 0.002 × 50/0.998 ≈ 0.1 Ω (in parallel).")
P("NEET", "Moving Charges and Magnetism", "formula", "moderate",
  "Two long parallel wires 10 cm apart carry 5 A each in the same direction. The force per metre between them is (μ₀ = 4π × 10⁻⁷ T m/A)",
  "5 × 10⁻⁵ N, attractive", ["5 × 10⁻⁵ N, repulsive", "1 × 10⁻⁴ N, attractive", "2.5 × 10⁻⁵ N, attractive"],
  "F/L = μ₀I₁I₂/2πd = 2 × 10⁻⁷ × 25/0.1 = 5 × 10⁻⁵ N/m; like currents attract.")

# ---------------- EMI + AC + EM waves ----------------
P("NEET", "Electromagnetic Induction", "tough", "tough",
  "A 0.4 m rod slides at 5 m/s on frictionless rails in a field of 0.5 T perpendicular to the rails. The circuit resistance is 2 Ω. The force needed to keep it moving at constant speed is",
  "0.1 N", ["0.2 N", "0.5 N", "1 N"], "ε = Blv = 1 V, I = 0.5 A. F = BIl = 0.5 × 0.5 × 0.4 = 0.1 N.")
P("JEE", "Electromagnetic Induction", "tough", "tough",
  "A metal rod 1 m long rotates at 50 rad/s about one end in a plane perpendicular to a uniform field of 0.2 T. The emf between its ends is",
  "5 V", ["10 V", "2.5 V", "50 V"], "ε = ½BωL² = ½ × 0.2 × 50 × 1 = 5 V.")
P("JEE", "Electromagnetic Induction", "tough", "tough",
  "A coil of inductance 2 H and resistance 4 Ω is connected to an 8 V battery. The energy stored in its magnetic field once the current is steady is",
  "4 J", ["8 J", "16 J", "2 J"], "I = 8/4 = 2 A. U = ½LI² = ½ × 2 × 4 = 4 J.")
P("NEET", "Electromagnetic Induction", "formula", "moderate",
  "The current in a 50 mH coil falls from 5 A to 0 in 0.1 s. The average induced emf is",
  "2.5 V", ["25 V", "0.25 V", "250 V"], "ε = L ΔI/Δt = 0.05 × 5/0.1 = 2.5 V.")
P("NEET", "Alternating Current", "tough", "tough",
  "A series LCR circuit has L = 0.1 H, C = 10 μF and R = 10 Ω across a 100 V (rms) variable-frequency source. At resonance, the rms voltage across the inductor is",
  "1000 V", ["100 V", "10 V", "500 V"], "ω₀ = 1/√(LC) = 1000 rad/s. I = V/R = 10 A. V_L = I ω₀L = 10 × 100 = 1000 V.")
P("JEE", "Alternating Current", "tough", "tough",
  "A series circuit has R = 40 Ω, X_L = 40 Ω and X_C = 10 Ω across a 200 V (rms) source. The average power consumed is",
  "640 W", ["1000 W", "800 W", "512 W"], "Z = √(40² + 30²) = 50 Ω, I = 4 A. P = I²R = 16 × 40 = 640 W (power factor 0.8).")
P("NEET", "Alternating Current", "tough", "tough",
  "A step-down transformer converts 2200 V to 220 V and delivers 4.4 kW. If its efficiency is 80%, the current in the primary is",
  "2.5 A", ["2 A", "20 A", "25 A"], "Input = 4400/0.8 = 5500 W. I_p = 5500/2200 = 2.5 A.")
P("JEE", "Alternating Current", "formula", "moderate",
  "An AC voltage V = 220√2 sin(100πt) volt is applied across a 110 Ω resistor. The rms current and the frequency are",
  "2 A and 50 Hz", ["2√2 A and 50 Hz", "2 A and 100 Hz", "√2 A and 50 Hz"], "V_rms = 220 V → I = 2 A. ω = 100π → f = 50 Hz.")
P("NEET", "Electromagnetic Waves", "formula", "moderate",
  "In a plane electromagnetic wave in vacuum, the peak electric field is 48 V/m. The peak magnetic field is",
  "1.6 × 10⁻⁷ T", ["1.6 × 10⁻⁸ T", "4.8 × 10⁻⁷ T", "1.44 × 10¹⁰ T"], "B₀ = E₀/c = 48/(3 × 10⁸) = 1.6 × 10⁻⁷ T.")
I = 0.5 * 3e8 * 8.85e-12 * 100 ** 2
P("JEE", "Electromagnetic Waves", "tough", "tough",
  "A plane electromagnetic wave in vacuum has peak electric field 100 V/m. Its intensity is about (ε₀ = 8.85 × 10⁻¹² F/m)",
  f"{I:.1f} W/m²", [f"{2*I:.1f} W/m²", f"{I/2:.2f} W/m²", f"{sig(I*4)} W/m²"],
  f"I = ½cε₀E₀² = 0.5 × 3 × 10⁸ × 8.85 × 10⁻¹² × 10⁴ ≈ {I:.1f} W/m².")

# ---------------- Optics ----------------
P("NEET", "Ray Optics and Optical Instruments", "tough", "tough",
  "A glass lens (n = 1.5) has focal length 20 cm in air. Its focal length when immersed in a liquid of refractive index 1.25 is",
  "50 cm", ["25 cm", "16 cm", "100 cm"], "f ∝ 1/(n_rel − 1): f' = 20 × 0.5/(1.5/1.25 − 1) = 10/0.2 = 50 cm.")
P("JEE", "Ray Optics and Optical Instruments", "tough", "tough",
  "A glass lens (n = 1.5) with focal length +20 cm in air is placed in a liquid of refractive index 1.6. Its focal length becomes",
  "−160 cm", ["+160 cm", "−80 cm", "+32 cm"], "f' = 20 × 0.5/(1.5/1.6 − 1) = 10/(−0.0625) = −160 cm — it now diverges.")
P("NEET", "Ray Optics and Optical Instruments", "tough", "tough",
  "An equilateral glass prism gives a minimum deviation of 30°. The refractive index of the glass is",
  "√2", ["√3", "1.5", "2/√3"], "n = sin[(A + δ)/2]/sin(A/2) = sin45°/sin30° = √2.")
P("NEET", "Ray Optics and Optical Instruments", "tough", "tough",
  "An object is 20 cm in front of a concave mirror of focal length 15 cm. The image is",
  "real, inverted, 3 times larger, at 60 cm", ["virtual, erect, 3 times larger, at 60 cm", "real, inverted, same size, at 30 cm", "real, inverted, 0.75 times, at 8.6 cm"],
  "1/v = 1/f − 1/u = −1/15 + 1/20 = −1/60 → v = −60 cm (real). m = −v/u = −3 (inverted, 3× larger).")
P("JEE", "Ray Optics and Optical Instruments", "tough", "tough",
  "An astronomical telescope has objective focal length 100 cm and eyepiece focal length 5 cm. With the final image at the near point (25 cm), the magnifying power is",
  "24", ["20", "25", "21"], "M = (f_o/f_e)(1 + f_e/D) = 20 × 1.2 = 24.")
P("NEET", "Ray Optics and Optical Instruments", "tough", "tough",
  "A coin lies at the bottom of a beaker filled with water (n = 4/3) to a depth of 12 cm. Seen from above, it appears raised by",
  "3 cm", ["9 cm", "4 cm", "1 cm"], "Apparent depth = 12/(4/3) = 9 cm, so it appears raised by 3 cm.")
P("JEE", "Ray Optics and Optical Instruments", "tough", "tough",
  "A mark at the bottom of a vessel is covered by 6 cm of glass (n = 1.5) and above it 8 cm of water (n = 4/3). Viewed from above, the mark appears raised by",
  "4 cm", ["2 cm", "3 cm", "5 cm"], "Shift = t(1 − 1/n) for each layer: 6(1/3) + 8(1/4) = 2 + 2 = 4 cm.")
P("NEET", "Ray Optics and Optical Instruments", "formula", "moderate",
  "Two thin lenses of powers +5 D and −3 D are placed in contact. The focal length of the combination is",
  "+50 cm", ["+12.5 cm", "−50 cm", "+20 cm"], "P = +2 D → f = 1/2 m = +50 cm.")
P("NEET", "Wave Optics", "tough", "tough",
  "In Young's experiment with light of 600 nm, slit separation 0.5 mm and screen distance 1 m, the fringe width when the whole set-up is immersed in water (n = 4/3) is",
  "0.9 mm", ["1.2 mm", "1.6 mm", "0.6 mm"], "In air β = λD/d = 1.2 mm. In water λ → λ/n, so β = 1.2/(4/3) = 0.9 mm.")
P("JEE", "Wave Optics", "tough", "tough",
  "In Young's experiment (λ = 600 nm), a thin transparent sheet of refractive index 1.5 over one slit shifts the central bright fringe by 5 fringe widths. The sheet's thickness is",
  "6 μm", ["3 μm", "1.2 μm", "12 μm"], "(n − 1)t = 5λ → t = 5 × 600 nm/0.5 = 6000 nm = 6 μm.")
P("NEET", "Wave Optics", "tough", "tough",
  "Light of wavelength 500 nm falls on a slit 0.2 mm wide. On a screen 2 m away, the width of the central maximum is",
  "10 mm", ["5 mm", "2.5 mm", "20 mm"], "Width = 2λD/a = 2 × 500 × 10⁻⁹ × 2/(0.2 × 10⁻³) = 0.01 m = 10 mm.")
P("JEE", "Wave Optics", "tough", "tough",
  "Unpolarised light of intensity I₀ passes through three polaroids. The first and last are crossed, and the middle one makes 45° with the first. The emerging intensity is",
  "I₀/8", ["I₀/4", "0", "I₀/2"], "After 1st: I₀/2. After middle: (I₀/2)cos²45° = I₀/4. After last: (I₀/4)cos²45° = I₀/8.")

# ---------------- Modern Physics ----------------
P("NEET", "Dual Nature of Radiation and Matter", "tough", "tough",
  "Light of wavelength 310 nm falls on a metal of work function 2 eV. The stopping potential is (hc = 1240 eV nm)",
  "2 V", ["4 V", "6 V", "1 V"], "E = 1240/310 = 4 eV. K_max = 4 − 2 = 2 eV → V₀ = 2 V.")
P("JEE", "Dual Nature of Radiation and Matter", "tough", "tough",
  "A proton and an α-particle are accelerated through the same potential difference. The ratio of their de Broglie wavelengths (proton : α) is",
  "2√2 : 1", ["2 : 1", "1 : 2√2", "√2 : 1"], "λ = h/√(2mqV). m_α = 4m_p, q_α = 2e: λ_p/λ_α = √(4 × 2) = 2√2.")
P("NEET", "Dual Nature of Radiation and Matter", "formula", "moderate",
  "The de Broglie wavelength of an electron accelerated through 150 V is about",
  "0.1 nm", ["1 nm", "0.01 nm", "0.15 nm"], "λ = 1.227/√V nm = 1.227/12.25 ≈ 0.1 nm.")
P("JEE", "Dual Nature of Radiation and Matter", "tough", "tough",
  "Light of frequency 1.5 times the threshold frequency falls on a metal. If the frequency is halved and the intensity doubled, the photoelectric current becomes",
  "zero", ["doubled", "halved", "unchanged"], "New frequency = 0.75 × threshold < threshold, so no photoelectrons are emitted regardless of intensity.")
P("NEET", "Atoms", "tough", "tough",
  "The ratio of the longest wavelength of the Lyman series to the longest wavelength of the Balmer series of hydrogen is",
  "5/27", ["27/5", "4/9", "5/36"], "1/λ_L = R(3/4), 1/λ_B = R(5/36). λ_L/λ_B = (5/36)/(3/4) = 5/27.")
P("JEE", "Atoms", "tough", "tough",
  "The ionisation energy of hydrogen is 13.6 eV. The energy needed to remove the electron from the first excited state of Li²⁺ is",
  "30.6 eV", ["122.4 eV", "13.6 eV", "40.8 eV"], "E = 13.6Z²/n² = 13.6 × 9/4 = 30.6 eV.")
P("NEET", "Atoms", "formula", "moderate",
  "Electrons in a sample of hydrogen are in the n = 5 state. The maximum number of different spectral lines they can emit while returning to the ground state is",
  "10", ["4", "5", "15"], "n(n − 1)/2 = 5 × 4/2 = 10.")
BE = (2 * 1.007825 + 2 * 1.008665 - 4.002603) * 931.5
P("NEET", "Nuclei", "tough", "tough",
  "Using m(¹H) = 1.007825 u, mₙ = 1.008665 u and m(⁴He) = 4.002603 u (1 u = 931.5 MeV), the binding energy per nucleon of ⁴He is about",
  f"{BE/4:.2f} MeV", [f"{BE:.2f} MeV", f"{BE/2:.2f} MeV", f"{BE/4*0.5:.2f} MeV"],
  f"Δm = 2(1.007825) + 2(1.008665) − 4.002603 = 0.030377 u → BE = {BE:.2f} MeV; per nucleon = {BE/4:.2f} MeV.")
P("JEE", "Nuclei", "tough", "tough",
  "A nucleus of mass number 240 (binding energy 7.6 MeV per nucleon) splits into two nuclei of mass number 120 each (binding energy 8.5 MeV per nucleon). The energy released is about",
  "216 MeV", ["108 MeV", "2040 MeV", "0.9 MeV"],
  "Q = (BE of products) − (BE of parent) = 240 × 8.5 − 240 × 7.6 = 240 × 0.9 = 216 MeV.")
P("JEE", "Nuclei", "formula", "moderate",
  "The radius of a nucleus varies with mass number A as R = R₀A^(1/3). The ratio of the radii of ²⁷Al and ¹²⁵Te nuclei is",
  "3 : 5", ["27 : 125", "9 : 25", "1 : 1"], "R ∝ A^(1/3): 27^(1/3) : 125^(1/3) = 3 : 5 (nuclear density is the same for all nuclei).")
P("NEET", "Semiconductor Electronics", "tough", "tough",
  "A 6 V Zener diode is connected with a series resistance of 500 Ω to a 12 V supply. A load of 2 kΩ is across the Zener. The current through the Zener is",
  "9 mA", ["12 mA", "3 mA", "6 mA"], "I(series) = (12 − 6)/500 = 12 mA. I(load) = 6/2000 = 3 mA. I_Z = 12 − 3 = 9 mA.")
P("JEE", "Semiconductor Electronics", "tough", "tough",
  "A 9 V Zener diode with a 300 Ω series resistor is fed from 15 V. The load across the Zener is 1.5 kΩ. The Zener current is",
  "14 mA", ["20 mA", "6 mA", "10 mA"], "I(series) = (15 − 9)/300 = 20 mA, I(load) = 9/1500 = 6 mA, so I_Z = 14 mA.")

# ======= Concept / NCERT / discovery (same for NEET and JEE) =======
B = "BOTH"
concept = [
 ("Kinematics", "A particle moves with constant speed along a circle. Which statement is correct?",
  "Its velocity and acceleration both change in direction", ["Its acceleration is zero", "Its velocity is constant", "Its acceleration is along the velocity"],
  "Uniform circular motion: speed is constant but the direction of velocity keeps changing; the centripetal acceleration also keeps turning towards the centre."),
 ("Kinematics", "Which is an example of projectile motion (neglecting air resistance)?",
  "A ball thrown at an angle in a cricket field", ["A satellite orbiting the Earth", "A car on a circular track", "A stone tied to a string whirled in a circle"],
  "A projectile moves only under gravity after launch, like a thrown ball. Orbits and circular motion need a central force."),
 ("Kinematics", "At the highest point of a projectile's path (no air resistance), which statement is true?",
  "Velocity is horizontal and acceleration is g downward", ["Velocity and acceleration are both zero", "Velocity is zero, acceleration is g", "Acceleration is zero, velocity is horizontal"],
  "Only the vertical component of velocity becomes zero; the horizontal component remains. Acceleration is always g downward."),
 ("Laws of Motion", "A person in a bus is thrown forward when the bus stops suddenly. This is explained by",
  "inertia of motion", ["inertia of rest", "Newton's third law", "conservation of energy"], "The body tends to continue its state of motion (first law) when the bus stops."),
 ("Laws of Motion", "A rocket moves forward by pushing exhaust gases backward. The principle behind this is",
  "conservation of linear momentum / Newton's third law", ["Bernoulli's principle", "Pascal's law", "conservation of angular momentum"],
  "Gases pushed backward exert an equal and opposite force on the rocket; total momentum stays constant."),
 ("Laws of Motion", "Why does a cricketer move his hands backward while catching a fast ball?",
  "To increase the time of impact and reduce the force", ["To reduce the momentum change", "To increase the force", "To decrease the time of impact"],
  "F = Δp/Δt. The momentum change is fixed; a longer time means a smaller force on the hands."),
 ("Work, Energy and Power", "In a perfectly inelastic collision between two bodies,",
  "momentum is conserved but kinetic energy is not", ["both momentum and kinetic energy are conserved", "kinetic energy is conserved but momentum is not", "neither is conserved"],
  "Momentum is always conserved without external force; in an inelastic collision some kinetic energy turns into heat, sound, deformation."),
 ("Work, Energy and Power", "The work done by a conservative force on a body moving around a closed path is",
  "zero", ["always positive", "always negative", "equal to the change in kinetic energy only if friction acts"],
  "For a conservative force, work depends only on end points; on a closed path start and end coincide, so W = 0."),
 ("System of Particles and Rotational Motion", "An ice skater pulls her arms in during a spin. Her angular speed",
  "increases because angular momentum is conserved", ["decreases because moment of inertia decreases", "stays the same", "increases because torque acts on her"],
  "No external torque, so Iω is constant; smaller I gives larger ω."),
 ("System of Particles and Rotational Motion", "The centre of mass of a body",
  "may lie outside the body (e.g. a ring)", ["always lies inside the body", "always lies at its geometric centre", "moves only when external torque acts"],
  "For a ring or a boomerang the centre of mass lies in empty space."),
 ("Gravitation", "The weight of a body is maximum at",
  "the poles", ["the equator", "the centre of the Earth", "a height equal to the Earth's radius"],
  "At the poles there is no centrifugal reduction and the radius is smallest, so g is largest."),
 ("Gravitation", "An astronaut in an orbiting satellite feels weightless because",
  "both the astronaut and the satellite are in free fall with the same acceleration", ["gravity is zero at that height", "the satellite shields gravity", "the centrifugal force exceeds gravity"],
  "Gravity is still about 90% of its surface value at low orbits; everything falls together, so no normal force is felt."),
 ("Mechanical Properties of Solids and Fluids", "Hydraulic lifts and hydraulic brakes work on",
  "Pascal's law", ["Bernoulli's principle", "Archimedes' principle", "Hooke's law"], "Pressure applied to an enclosed fluid is transmitted equally in all directions."),
 ("Mechanical Properties of Solids and Fluids", "An aeroplane wing gets lift mainly because",
  "air moves faster over the upper surface, so pressure there is lower", ["air is denser above the wing", "the wing is lighter than air", "the engine pushes the wing upward"],
  "By Bernoulli's principle, higher speed over the curved top means lower pressure, giving a net upward force."),
 ("Mechanical Properties of Solids and Fluids", "Steel is said to be more elastic than rubber because",
  "it has a larger Young's modulus", ["it stretches more for the same force", "it is denser", "it has a smaller Young's modulus"],
  "Elasticity in physics means resistance to deformation; steel has a much larger Young's modulus."),
 ("Thermal Properties of Matter", "Water is used in car radiators mainly because",
  "it has a high specific heat capacity", ["it has a low specific heat capacity", "it is a good conductor of electricity", "it has a low boiling point"],
  "High specific heat lets water absorb a lot of heat with a small temperature rise."),
 ("Thermal Properties of Matter", "Water is densest at about",
  "4 °C", ["0 °C", "100 °C", "−4 °C"], "Anomalous expansion: water contracts from 0 to 4 °C and expands above it, so density is maximum near 4 °C."),
 ("Thermodynamics", "In an adiabatic process,",
  "no heat is exchanged with the surroundings", ["temperature stays constant", "pressure stays constant", "volume stays constant"],
  "Adiabatic means Q = 0; any work done changes the internal energy (and temperature)."),
 ("Thermodynamics", "Which statement is consistent with the second law of thermodynamics?",
  "No engine working between two temperatures can be 100% efficient", ["Energy can be created in a cycle", "Heat flows on its own from cold to hot bodies", "All heat can be converted into work in a cycle"],
  "Kelvin–Planck statement: some heat must always be rejected to a sink."),
 ("Kinetic Theory", "According to kinetic theory, the pressure of a gas arises from",
  "molecules colliding with the walls of the container", ["attraction between molecules", "the weight of the gas", "molecules colliding with each other only"],
  "Each wall collision transfers momentum; the rate of momentum transfer per unit area is the pressure."),
 ("Oscillations", "Which of these is an example of SHM (for small amplitude)?",
  "A simple pendulum swinging through a small angle", ["A ball bouncing on the floor", "The Earth going round the Sun", "A car moving round a circular track"],
  "Small-angle pendulum: restoring force ∝ −displacement, which is the condition for SHM. A bouncing ball is periodic but not SHM."),
 ("Waves", "Sound cannot travel through vacuum because it",
  "is a mechanical wave needing a medium", ["is a transverse wave", "travels too slowly", "is an electromagnetic wave"], "Sound needs particles of a medium to pass on the vibration."),
 ("Electrostatics", "Inside a charged hollow conducting sphere,",
  "the electric field is zero and the potential equals that on the surface", ["field and potential are both zero", "field is maximum at the centre", "potential is zero but field is not"],
  "All charge resides on the outer surface; E = 0 inside and V is constant (= kQ/R)."),
 ("Electrostatics", "Electric field lines",
  "never intersect each other", ["form closed loops around charges", "start from negative charges", "are always parallel"],
  "At an intersection the field would have two directions, which is impossible. Electrostatic lines start on + and end on − charges."),
 ("Current Electricity", "When the temperature of a metal conductor rises, its resistance",
  "increases because electrons collide more often with ions", ["decreases", "stays constant", "becomes zero"],
  "Relaxation time falls as the lattice vibrates more, so resistivity rises."),
 ("Moving Charges and Magnetism", "A charged particle moves parallel to a uniform magnetic field. The magnetic force on it is",
  "zero", ["maximum", "along the field", "perpendicular to the field and velocity, non-zero"], "F = qvB sinθ with θ = 0°, so F = 0."),
 ("Magnetism and Matter", "Diamagnetic substances",
  "are weakly repelled by a magnet", ["are strongly attracted by a magnet", "have large positive susceptibility", "become permanent magnets"],
  "Diamagnets (e.g. bismuth, copper, water) have small negative susceptibility and move from stronger to weaker field regions."),
 ("Magnetism and Matter", "Above its Curie temperature, a ferromagnetic material becomes",
  "paramagnetic", ["diamagnetic", "more strongly ferromagnetic", "superconducting"], "Thermal agitation destroys domain alignment, so it behaves as a paramagnet."),
 ("Electromagnetic Induction", "Lenz's law is a consequence of the law of conservation of",
  "energy", ["charge", "momentum", "mass"], "The induced current opposes the change that causes it; otherwise energy would be created from nothing."),
 ("Electromagnetic Induction", "The self-inductance of a long solenoid of fixed length and area, when the number of turns is doubled,",
  "becomes four times", ["doubles", "halves", "stays the same"], "L = μ₀N²A/l, so L ∝ N²."),
 ("Alternating Current", "In a pure inductor connected to an AC source, the average power consumed over a cycle is",
  "zero", ["maximum", "V_rms × I_rms", "half of V_rms × I_rms"], "Current lags voltage by 90°, so the power factor cos90° = 0."),
 ("Electromagnetic Waves", "Which electromagnetic waves are used in RADAR and microwave ovens?",
  "Microwaves", ["X-rays", "Ultraviolet rays", "Gamma rays"], "Microwaves have short wavelength suitable for RADAR and they excite water molecules in food."),
 ("Electromagnetic Waves", "Which radiation is used to kill bacteria in water purifiers?",
  "Ultraviolet", ["Infrared", "Radio waves", "Microwaves"], "UV rays damage microbial DNA."),
 ("Electromagnetic Waves", "The correct order of increasing wavelength is",
  "γ-rays < X-rays < visible < microwaves", ["microwaves < visible < X-rays < γ-rays", "X-rays < γ-rays < visible < microwaves", "visible < X-rays < γ-rays < microwaves"],
  "In the EM spectrum, γ-rays have the shortest wavelength and radio/microwaves the longest."),
 ("Ray Optics and Optical Instruments", "The sparkling of a diamond is mainly due to",
  "total internal reflection (very small critical angle)", ["dispersion only", "interference", "polarisation"],
  "Diamond's high refractive index (≈2.42) gives a critical angle of about 24°, so light reflects many times inside."),
 ("Ray Optics and Optical Instruments", "Optical fibres transmit light by",
  "repeated total internal reflection", ["refraction only", "diffraction", "scattering"], "The core has higher refractive index than the cladding; light hitting the boundary above the critical angle is totally reflected."),
 ("Wave Optics", "According to Huygens' principle, every point on a wavefront",
  "acts as a source of secondary wavelets", ["absorbs the wave", "moves with the speed of light in vacuum always", "reflects the wave backward"],
  "The new wavefront is the forward envelope of the secondary wavelets."),
 ("Wave Optics", "Polarisation of light proves that light is",
  "a transverse wave", ["a longitudinal wave", "made of particles only", "a mechanical wave"], "Only transverse waves can be polarised."),
 ("Dual Nature of Radiation and Matter", "In the photoelectric effect, the maximum kinetic energy of the emitted electrons depends on",
  "the frequency of the incident light", ["the intensity of the incident light", "the time of exposure", "the area of the metal plate"],
  "K_max = hν − φ; intensity changes only the number of electrons (current)."),
 ("Atoms", "In Rutherford's α-scattering experiment, most α-particles passed straight through the gold foil. This showed that",
  "most of the atom is empty space", ["the nucleus is negatively charged", "electrons are in fixed orbits", "the atom is a uniform sphere of positive charge"],
  "Only a few were deflected strongly, showing a tiny, dense, positive nucleus with mostly empty space around it."),
 ("Nuclei", "The energy of the Sun is produced mainly by",
  "nuclear fusion of hydrogen into helium", ["nuclear fission of uranium", "burning of hydrogen gas", "radioactive decay"], "In the core, hydrogen nuclei fuse into helium releasing energy (proton–proton cycle)."),
 ("Nuclei", "The binding energy per nucleon is highest for nuclei with mass number around",
  "56 (iron region)", ["4 (helium)", "238 (uranium)", "1 (hydrogen)"], "BE/A peaks near A ≈ 56 (about 8.8 MeV), so fission of heavy nuclei and fusion of light nuclei both release energy."),
 ("Semiconductor Electronics", "In an n-type semiconductor,",
  "electrons are the majority carriers and it remains electrically neutral", ["holes are the majority carriers", "it is negatively charged", "there are no holes at all"],
  "Pentavalent donors add free electrons, but the crystal as a whole stays neutral; holes are minority carriers."),
 ("Semiconductor Electronics", "A p-n junction diode is used as a rectifier because it",
  "conducts mainly in one direction", ["amplifies the signal", "stores charge", "conducts equally in both directions"], "It allows current in forward bias and blocks it in reverse bias, converting AC to pulsating DC."),
]
for chap, q, c, w, e in concept:
    P(B, chap, "concept", "moderate", q, c, w, e)

discovery = [
 ("Gravitation", "The value of the universal gravitational constant G was first measured in the laboratory by",
  "Henry Cavendish", ["Isaac Newton", "Johannes Kepler", "Galileo Galilei"], "Cavendish (1798) used a torsion balance to measure G."),
 ("Gravitation", "The laws describing planetary motion (elliptical orbits, equal areas, T² ∝ a³) were given by",
  "Johannes Kepler", ["Tycho Brahe", "Isaac Newton", "Nicolaus Copernicus"], "Kepler formulated them using Tycho Brahe's observations."),
 ("Moving Charges and Magnetism", "In 1820 it was discovered that a current-carrying wire deflects a nearby compass needle. This was observed by",
  "Hans Christian Oersted", ["Michael Faraday", "André-Marie Ampère", "James Clerk Maxwell"], "Oersted's observation linked electricity and magnetism."),
 ("Electromagnetic Induction", "Electromagnetic induction was discovered through experiments by",
  "Michael Faraday and Joseph Henry", ["Oersted and Ampère", "Coulomb and Gauss", "Hertz and Marconi"], "Faraday (England) and Henry (USA) independently showed that a changing magnetic flux induces an emf (1830s)."),
 ("Electromagnetic Waves", "The idea of displacement current was introduced by",
  "James Clerk Maxwell", ["Heinrich Hertz", "Michael Faraday", "J.C. Bose"], "Maxwell added displacement current to Ampère's law and predicted EM waves."),
 ("Electromagnetic Waves", "Electromagnetic waves were first produced and detected in the laboratory (1887) by",
  "Heinrich Hertz", ["J.C. Bose", "G. Marconi", "J.C. Maxwell"], "Hertz demonstrated EM waves experimentally, confirming Maxwell's theory."),
 ("Electromagnetic Waves", "The Indian physicist who produced electromagnetic waves of wavelength 5 mm to 25 mm in the 1890s was",
  "Jagadish Chandra Bose", ["C.V. Raman", "S.N. Bose", "Meghnad Saha"], "J.C. Bose worked on millimetre waves, as NCERT mentions."),
 ("Wave Optics", "The wave theory of light, with the idea of secondary wavelets, was put forward by",
  "Christiaan Huygens", ["Isaac Newton", "Thomas Young", "Augustin Fresnel"], "Huygens proposed the wave theory in 1678."),
 ("Wave Optics", "The double-slit experiment that showed interference of light (1801) was performed by",
  "Thomas Young", ["Christiaan Huygens", "Isaac Newton", "Albert Einstein"], "Young's experiment gave strong support to the wave nature of light."),
 ("Dual Nature of Radiation and Matter", "The photoelectric effect was explained using the photon (quantum) idea by",
  "Albert Einstein (1905)", ["Max Planck (1900)", "Heinrich Hertz (1887)", "Louis de Broglie (1924)"], "Einstein's photoelectric equation earned him the 1921 Nobel Prize."),
 ("Dual Nature of Radiation and Matter", "The idea that moving particles have a wavelength λ = h/p was proposed by",
  "Louis de Broglie", ["Erwin Schrödinger", "Werner Heisenberg", "Niels Bohr"], "de Broglie proposed matter waves in 1924."),
  ("Atoms", "The α-particle scattering experiment on gold foil, analysed by Rutherford, was performed by",
  "Geiger and Marsden", ["Davisson and Germer", "Hallwachs and Lenard", "Thomson and Millikan"], "Geiger and Marsden did the experiment in 1911 at Rutherford's suggestion."),
 ("Atoms", "The model in which electrons revolve in fixed orbits with quantised angular momentum mvr = nh/2π was proposed by",
  "Niels Bohr", ["Ernest Rutherford", "J.J. Thomson", "Arnold Sommerfeld"], "Bohr's model (1913) explained the hydrogen spectrum."),
 ("Nuclei", "The neutron was discovered in 1932 by",
  "James Chadwick", ["Ernest Rutherford", "Enrico Fermi", "Henri Becquerel"], "Chadwick identified neutral particles emitted when beryllium was bombarded with α-particles."),
  ("Electrostatics", "The force between two point charges varying as 1/r² was established experimentally by",
  "Charles-Augustin de Coulomb", ["Carl Friedrich Gauss", "Michael Faraday", "Benjamin Franklin"], "Coulomb used a torsion balance (1785)."),
 ("Current Electricity", "The rules for current at a junction and for voltages around a loop were given by",
  "Gustav Kirchhoff", ["Georg Ohm", "Charles Wheatstone", "Alessandro Volta"], "Kirchhoff's junction rule (charge conservation) and loop rule (energy conservation)."),
  ("Laws of Motion", "The idea of inertia — that a body keeps moving unless a force acts — was first developed from inclined-plane experiments by",
  "Galileo Galilei", ["Isaac Newton", "Aristotle", "Johannes Kepler"], "Galileo's inclined-plane experiments led to the law of inertia, later stated by Newton."),
]
for chap, q, c, w, e in discovery:
    P(B, chap, "discovery", "moderate", q, c, w, e)

# NCERT one-liners as fill-in-the-blanks (both exams)
blanks = [
 ("Units and Measurement", "The SI unit of luminous intensity is the ____.", ["candela", "cd"], "The seven SI base units include the candela for luminous intensity."),
 ("Kinematics", "The area under a velocity–time graph gives the ____ of the body.", ["displacement"], "∫v dt = displacement."),
 ("Laws of Motion", "The product of force and the time for which it acts is called ____.", ["impulse"], "Impulse = FΔt = change in momentum."),
 ("Work, Energy and Power", "One kilowatt hour is equal to ____ joules.", ["3.6 × 10^6", "3.6×10^6", "3600000", "3.6e6"], "1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J."),
 ("Gravitation", "The escape speed from the Earth's surface is about ____ km/s.", ["11.2"], "vₑ = √(2gR) ≈ 11.2 km/s."),
 ("Mechanical Properties of Solids and Fluids", "The ratio of lateral strain to longitudinal strain is called ____ ratio.", ["Poisson's", "Poisson", "Poissons"], "Poisson's ratio σ = lateral strain/longitudinal strain."),
 ("Thermodynamics", "A process in which the temperature of the system stays constant is called an ____ process.", ["isothermal"], "Isothermal: T constant, so ΔU = 0 for an ideal gas."),
 ("Electrostatics", "The SI unit of electric dipole moment is ____.", ["C m", "coulomb metre", "Cm", "coulomb-metre"], "p = q × 2a, so the unit is coulomb metre."),
 ("Current Electricity", "The reciprocal of resistivity is called ____.", ["conductivity", "electrical conductivity"], "σ = 1/ρ, unit S/m."),
  ("Alternating Current", "In an AC circuit, the ratio of true power to apparent power is called the power ____.", ["factor"], "Power factor = cosφ = R/Z."),
 ("Semiconductor Electronics", "Pure silicon doped with a trivalent impurity such as boron becomes a ____-type semiconductor.", ["p", "p type", "p-type"], "Trivalent acceptors create holes, the majority carriers in p-type material."),
]
for chap, q, a, e in blanks:
    blank(B, S, chap, "ncert", "easy", q, a, e)

# ======= Tough multi-concept statements (NEET + JEE) =======
hard = [
 ("Kinematics", "A ball is thrown vertically upward. Neglecting air resistance, which statement is correct?",
  "Time of ascent equals time of descent and it returns with the same speed", ["Its acceleration is zero at the top", "Its acceleration changes direction at the top", "It takes longer to come down than to go up"],
  "With only gravity acting, motion is symmetric; acceleration is g downward throughout."),
 ("Kinematics", "For a body in uniformly accelerated motion starting from rest, the distances covered in successive equal time intervals are in the ratio",
  "1 : 3 : 5 : 7 …", ["1 : 2 : 3 : 4 …", "1 : 4 : 9 : 16 …", "1 : 1 : 1 : 1 …"], "Galileo's law of odd numbers: sₙ ∝ (2n − 1)."),
 ("Laws of Motion", "A block rests on a rough inclined plane without sliding. As the angle of the incline is slowly increased (block still at rest), the friction force on it",
  "increases", ["decreases", "stays the same", "becomes zero"], "Static friction balances mg sin θ, which grows with θ until it reaches μₛmg cos θ."),
 ("Laws of Motion", "A horse pulls a cart forward. The cart moves forward because",
  "the ground's forward friction on the horse exceeds the backward forces on the horse–cart system", ["the horse pulls harder on the cart than the cart pulls on the horse", "action and reaction act on the same body and cancel", "Newton's third law does not apply here"],
  "Action–reaction pairs act on different bodies; external friction from the ground accelerates the system."),
 ("Work, Energy and Power", "A body moves in a vertical circle on a string. Which quantity remains constant (neglecting air resistance)?",
  "Total mechanical energy", ["Speed", "Kinetic energy", "Tension in the string"], "Tension does no work (perpendicular to velocity); gravity is conservative, so total energy is conserved."),
 ("Work, Energy and Power", "Two bodies of masses m and 4m have equal kinetic energies. The ratio of their momenta (m : 4m) is",
  "1 : 2", ["1 : 4", "4 : 1", "2 : 1"], "p = √(2mK): ratio √m : √(4m) = 1 : 2."),
 ("System of Particles and Rotational Motion", "If no external force acts on a system of particles, then",
  "the velocity of its centre of mass stays constant", ["every particle moves with constant velocity", "the centre of mass must be at rest", "the total kinetic energy must be constant"],
  "Internal forces cancel in pairs, so total momentum (M v_cm) is conserved; kinetic energy can still change."),
 ("System of Particles and Rotational Motion", "The radius of gyration of a uniform disc about its central axis perpendicular to its plane is",
  "R/√2", ["R/2", "R", "√(2/5) R"], "I = MR²/2 = Mk² → k = R/√2."),
 ("Gravitation", "If the radius of the Earth's orbit around the Sun were doubled, the length of a year would become",
  "2√2 times", ["2 times", "4 times", "half"], "Kepler's third law: T ∝ r^(3/2)."),
 ("Gravitation", "The gravitational potential energy of a satellite in a circular orbit is U. Its kinetic energy and total energy are",
  "−U/2 and U/2", ["U/2 and −U/2", "−U and 0", "U and 2U"], "K = GMm/2r = −U/2; E = K + U = U/2 (negative, since U < 0)."),
 ("Mechanical Properties of Solids and Fluids", "A wire is stretched within the elastic limit. If its length and radius are both doubled, Young's modulus",
  "remains the same", ["becomes four times", "becomes half", "doubles"], "Young's modulus is a property of the material, not of dimensions."),
 ("Mechanical Properties of Solids and Fluids", "Water flows steadily through a horizontal pipe of varying cross-section. Where the pipe is narrower,",
  "speed is higher and pressure is lower", ["speed is lower and pressure is higher", "speed and pressure are both higher", "speed and pressure are both lower"],
  "Continuity: Av = constant. Bernoulli: higher speed → lower pressure."),
 ("Thermodynamics", "For an ideal gas in a cyclic process, which is always true?",
  "The net change in internal energy is zero", ["The net work done is zero", "The net heat absorbed is zero", "The temperature stays constant throughout"], "U is a state function; Q and W depend on the path."),
 ("Thermodynamics", "In an isothermal expansion of an ideal gas,",
  "all the heat absorbed is converted into work", ["the internal energy increases", "no heat is exchanged", "the temperature rises"], "ΔU = 0 at constant T for an ideal gas, so Q = W."),
 ("Kinetic Theory", "At the same temperature, the average kinetic energy per molecule of H₂ and O₂ (treating translational motion only) is",
  "the same", ["16 times larger for H₂", "4 times larger for H₂", "larger for O₂"], "Average translational KE = (3/2)kT, independent of mass."),
 ("Oscillations", "In SHM, the phase difference between displacement and acceleration is",
  "π", ["π/2", "0", "π/4"], "a = −ω²x: acceleration is always opposite to displacement."),
 ("Oscillations", "In SHM, kinetic energy equals potential energy at a displacement of",
  "A/√2", ["A/2", "A", "A/4"], "½k(A² − x²) = ½kx² → x = A/√2."),
 ("Waves", "In a stationary wave on a string, the distance between two consecutive nodes is",
  "λ/2", ["λ", "λ/4", "2λ"], "Nodes (and antinodes) are spaced λ/2 apart; a node and the next antinode are λ/4 apart."),
 ("Electrostatics", "A parallel-plate capacitor is charged and then disconnected from the battery. A dielectric slab is inserted. Which statement is correct?",
  "Charge stays the same and the energy stored decreases", ["Voltage stays the same and charge increases", "Energy stored increases", "Capacitance decreases"],
  "Isolated: Q constant, C increases by K, V = Q/C falls, U = Q²/2C falls."),
 ("Electrostatics", "The work done in moving a charge between two points on an equipotential surface is",
  "zero", ["maximum", "equal to q times the field", "positive"], "W = qΔV and ΔV = 0 on an equipotential surface."),
 ("Current Electricity", "Two bulbs rated 100 W and 60 W (both for 220 V) are connected in series across 220 V. Which glows brighter?",
  "The 60 W bulb", ["The 100 W bulb", "Both equally", "Neither glows"], "The 60 W bulb has higher resistance (R = V²/P); in series the same current flows, so P = I²R is larger for it."),
 ("Current Electricity", "When identical cells are joined in parallel, the combination gives",
  "the same emf but lower internal resistance", ["higher emf and higher internal resistance", "higher emf and the same internal resistance", "lower emf and lower internal resistance"], "n cells in parallel: emf E, internal resistance r/n."),
 ("Moving Charges and Magnetism", "The magnetic force on a charged particle moving in a magnetic field",
  "does no work, so its speed stays constant", ["always increases its kinetic energy", "acts along its velocity", "is independent of its charge"], "F = qv × B is perpendicular to v."),
 ("Moving Charges and Magnetism", "The time period of a charged particle moving in a circle in a uniform magnetic field",
  "is independent of its speed", ["is proportional to its speed", "is inversely proportional to its speed", "depends on the radius only"], "T = 2πm/qB."),
 ("Electromagnetic Induction", "A bar magnet falls through a vertical copper tube. Compared with free fall, it",
  "falls more slowly because induced currents oppose its motion", ["falls faster", "falls at exactly g", "stops completely in the tube"], "Lenz's law: induced currents in the tube produce a field that opposes the falling magnet."),
 ("Alternating Current", "At resonance in a series LCR circuit,",
  "the impedance equals R and current is maximum", ["the impedance is maximum", "the current is zero", "the power factor is zero"], "X_L = X_C, so Z = R and cos φ = 1."),
 ("Ray Optics and Optical Instruments", "When light passes from air into glass,",
  "its frequency stays the same while speed and wavelength decrease", ["its frequency decreases", "its speed increases", "its wavelength increases"], "Frequency is set by the source; v = c/n and λ = λ₀/n."),
 ("Wave Optics", "In Young's double-slit experiment, if the slit separation is doubled and the screen distance is halved, the fringe width becomes",
  "one-fourth", ["four times", "the same", "half"], "β = λD/d: (1/2)/2 = 1/4."),
 ("Dual Nature of Radiation and Matter", "If the intensity of incident light (above threshold frequency) is doubled, then in the photoelectric effect",
  "the photocurrent doubles but the stopping potential stays the same", ["the stopping potential doubles", "the maximum kinetic energy doubles", "the work function halves"], "Intensity changes the number of photons, not their energy."),
 ("Semiconductor Electronics", "In a reverse-biased p-n junction,",
  "the depletion layer widens and only a tiny current flows", ["the depletion layer narrows", "a large current flows", "the barrier potential decreases"], "Reverse bias adds to the barrier; only minority carriers give a small current."),
]
for chap, q, c, w, e in hard:
    P(B, chap, "tough", "tough", q, c, w, e)
