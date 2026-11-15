from lib import F, X, T, sig, fx, build
import math

g = 10
# 1 Atwood
a1 = (5 - 3) * g / (5 + 3); T1 = 2 * 5 * 3 * g / (5 + 3)
# 2 friction
fs2 = 0.5 * 10 * g; a2 = (60 - 0.4 * 10 * g) / 10
# 3 incline
a3 = g * (math.sin(math.radians(30)) - 0.2 * math.cos(math.radians(30)))
# 4 impulse
J4 = 0.15 * (20 + 30); F4 = J4 / 0.01
# 5 recoil
V5 = 0.02 * 400 / 4
# 6 banking
th6 = math.degrees(math.atan(20 ** 2 / (100 * g)))
# 7 level road
v7 = math.sqrt(0.4 * 50 * g)
# 8 lift
N8 = 60 * (g + 2); N8d = 60 * (g - 2)
# 9 two strings 30° and 60° with horizontal, W = 100 N
c30, s30, c60, s60 = (math.cos(math.radians(30)), math.sin(math.radians(30)), math.cos(math.radians(60)), math.sin(math.radians(60)))
T9a = 100 / (s30 + s60 * c30 / c60); T9b = T9a * c30 / c60
# 10 blocks pushed: 2 kg and 3 kg, F = 20 N, smooth
a10 = 20 / 5; N10 = 3 * a10

DOC = {
"slug": "laws-of-motion", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Laws of Motion", "JEE": "Laws of Motion"},
"title": "Laws of Motion", "readMinutes": 20,
"summary": [
"Force motion ko BADALTA hai, chalaata nahi. Koi net force nahi to body apni state (rest ya uniform velocity) mein rehti hai — yeh inertia hai (Newton ka pehla niyam). Mass inertia ka naap hai.",
"Doosra niyam: net force = momentum badalne ki rate, F = dp/dt = ma (constant mass). Thode time ka bada force impulse deta hai: J = FΔt = Δp. Teesra niyam: har action ka barabar aur ulta reaction — dono alag bodies par lagte hain, isliye cancel nahi hote.",
"Har sawal ka ek hi tarika: body alag karo → free-body diagram (FBD) banao → har direction mein ΣF = ma likho → constraint (string, contact) jodo. Isi se pulley, lift, incline, connected blocks sab hal hote hain.",
"Friction motion ka VIRODH karta hai (relative sliding ka). Static friction zaroorat ke hisaab se 0 se μ_s N tak badalta hai; sliding shuru hote hi kinetic friction μ_k N (thoda kam). Rolling friction sabse kam.",
"Circular motion mein centre ki taraf net force chahiye (centripetal, mv²/r) — yeh koi naya force nahi; friction, tension, normal ya gravity hi yeh kaam karte hain. Level road par friction, banked road par normal ka component."
],
"formulas": [
F("Newton's second law", "F_net = dp/dt = ma  (constant mass);   F_net = 0 ⇒ v constant", "Har dynamics sawal ki shuruaat.", "F_net likho, sirf applied force nahi — friction, weight, normal sab jodo."),
F("Momentum and impulse", "p = mv;   J = ∫F dt = F_avg Δt = Δp", "Takkar, catch, bat–ball, bounce.", "Bounce mein Δp = m(v + u) hota hai (direction ulti), m(v − u) nahi.", None, "PYQ favourite"),
F("Conservation of linear momentum", "F_ext = 0 ⇒ m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂", "Gun–bullet recoil, explosion, collision, rocket.", "Sirf us direction mein lagao jahan external force zero ho."),
F("Recoil of gun", "V_gun = m_b v_b / M_gun   (ulti direction)", "Goli chalne par bandook ka peeche dhakka.", "Velocity ka sign ulta, magnitude chhota — energy bandook ki kam hoti hai."),
F("Apparent weight in a lift", "Upar accelerate: N = m(g + a);   neeche accelerate: N = m(g − a);   free fall: N = 0", "Lift, weighing machine.", "Lift ki velocity se nahi, ACCELERATION se apparent weight badalta hai."),
F("Atwood machine", "a = (m₁ − m₂)g / (m₁ + m₂);   T = 2m₁m₂g / (m₁ + m₂)", "Ek pulley par do latke blocks (halki string, smooth pulley).", "T kabhi m₁g ke barabar nahi (heavy block neeche accelerate karta hai)."),
F("Connected blocks (push/pull)", "a = F/(m₁ + m₂ + …);   contact force / tension = (joint ke us paar ke saare masses — jinhe ye force kheench/dhakel raha hai) × a", "Smooth surface par saath chalte blocks.", "Contact force us mass se nikalo jise woh dhakel raha hai, poore system se nahi."),
F("Equilibrium of concurrent forces", "ΣF_x = 0, ΣF_y = 0;   Lami: F₁/sinα = F₂/sinβ = F₃/sinγ", "Latki cheez, strings, balance.", "Lami mein har force ke saamne wala (baaki do ke beech ka) angle lo."),
F("Static friction", "0 ≤ f_s ≤ μ_s N;   limiting f = μ_s N", "Body abhi slide nahi kar rahi.", "Static friction hamesha μ_s N nahi hota — jitna applied force, utna hi (limit tak)."),
F("Kinetic friction", "f_k = μ_k N  (μ_k < μ_s), direction relative sliding ke ulta", "Body slide kar rahi hai.", "N hamesha mg nahi — incline par mg cosθ, upar khinchne par mg − F sinθ."),
F("Angle of repose / friction", "tanθ_repose = μ_s;   angle of friction: tanλ = μ_s", "Incline par body bas slide hone wali ho.", "Ye μ_s se aata hai, μ_k se nahi."),
F("Block on rough incline", "Neeche slide: a = g(sinθ − μ cosθ);   upar dhakelo: a = −g(sinθ + μ cosθ)", "Incline wale sawal.", "Upar jaate waqt friction bhi neeche lagta hai — dono ka sum."),
F("Centripetal force", "F_c = mv²/r = mω²r  (centre ki taraf)", "Kisi bhi circular motion mein.", "FBD mein 'centripetal force' alag force mat banao — yeh net inward force hai."),
F("Vehicle on level road", "v_max = √(μ_s r g)", "Mod par skid na ho.", "Mass cancel ho jaata hai — truck aur cycle ke liye same v_max."),
F("Banked road", "Bina friction: tanθ = v²/(rg).   Friction ke saath: v_max = √[rg(μ + tanθ)/(1 − μ tanθ)]", "Highway mod, race track.", "Ideal speed par friction ki zaroorat zero hoti hai; usse tez/dheere par direction badalti hai.", None, "PYQ favourite"),
F("Pseudo force", "Accelerating frame (a) mein har body par −ma lagao", "Lift ya accelerating car ke andar se sawal.", "Ground frame se hal kar rahe ho to pseudo force mat lagao."),
],
"examples": [
X("Atwood machine", "5 kg aur 3 kg ek smooth pulley se light string dwara latke hain (g = 10). Acceleration aur tension?",
  f"a = (5 − 3) × 10/8 = {fx(a1)} m/s².  T = 2 × 5 × 3 × 10/8 = {fx(T1)} N (30 N aur 50 N ke beech — sahi).",
  [(fx(a1), "2.5"), (fx(T1), "37.5")]),
X("Friction: chalega ya nahi", "10 kg block, μ_s = 0.5, μ_k = 0.4 (g = 10). (a) 40 N lagao (b) 60 N lagao — friction aur acceleration?",
  f"Limiting friction = 0.5 × 100 = {fx(fs2)} N. (a) 40 < 50 ⇒ block nahi hilega, friction = 40 N (applied ke barabar). (b) 60 > 50 ⇒ slide; kinetic friction 40 N, a = (60 − 40)/10 = {fx(a2)} m/s².",
  [(fx(fs2), "50"), (fx(a2), "2")]),
X("Rough incline", "30° incline par block slide kar raha hai, μ_k = 0.2 (g = 10). Acceleration?",
  f"a = g(sin30° − μ cos30°) = 10(0.5 − 0.2 × 0.866) = {fx(a3)} m/s².",
  [(fx(a3), "3.27")]),
X("Bat se impulse", "0.15 kg ball 20 m/s se aati hai, bat se 30 m/s se ulti laut jaati hai. Contact 0.01 s. Impulse aur average force?",
  f"Δp = m(v + u) = 0.15 × 50 = {fx(J4)} N·s. F = Δp/Δt = 7.5/0.01 = {fx(F4)} N.",
  [(fx(J4), "7.5"), (fx(F4), "750")]),
X("Bandook ka recoil", "4 kg ki bandook se 20 g goli 400 m/s se nikalti hai. Bandook ki recoil speed?",
  f"0 = m_b v_b + M V ⇒ V = 0.02 × 400/4 = {fx(V5)} m/s (goli ke ulta).",
  [(fx(V5), "2")]),
X("Banked road ka angle", "100 m radius ka mod 20 m/s ke liye bina friction design karna hai (g = 10). Banking angle?",
  f"tanθ = v²/(rg) = 400/1000 = 0.4 ⇒ θ ≈ {fx(th6,1)}°.",
  [(fx(th6,1), "21.8")]),
X("Level road par max speed", "50 m radius ka flat mod, μ_s = 0.4. Bina skid max speed?",
  f"v = √(μrg) = √(0.4 × 50 × 10) = √200 ≈ {fx(v7)} m/s (≈ 51 km/h).",
  [(fx(v7), "14.14")]),
X("Lift mein weight", "60 kg aadmi lift mein. Lift 2 m/s² se (a) upar accelerate (b) neeche accelerate. Machine kya padhegi (N mein)?",
  f"(a) N = m(g + a) = 60 × 12 = {fx(N8)} N.  (b) N = 60 × 8 = {fx(N8d)} N.  Free fall mein 0.",
  [(fx(N8), "720"), (fx(N8d), "480")]),
X("Do strings se latka weight", "100 N ka weight do strings se latka hai jo horizontal se 30° aur 60° banati hain. Dono tensions?",
  f"Horizontal: T₁ cos30° = T₂ cos60° ⇒ T₂ = √3 T₁. Vertical: T₁ sin30° + T₂ sin60° = 100 ⇒ T₁(0.5 + 1.5) = 100 ⇒ T₁ = {fx(T9a)} N, T₂ = {fx(T9b,1)} N. (Jo string zyada vertical, usme zyada tension.)",
  [(fx(T9a), "50"), (fx(T9b,1), "86.6")]),
X("Do blocks ko dhakelna", "Smooth floor par 2 kg aur 3 kg blocks saath rakhe; 2 kg wale ko 20 N se dhakela. Contact force?",
  f"a = 20/5 = {fx(a10)} m/s². 3 kg ko sirf contact force dhakelta hai ⇒ N = 3 × 4 = {fx(N10)} N.",
  [(fx(a10), "4"), (fx(N10), "12")]),
],
"topics": [
T("Force and inertia", "Force woh hai jo state of motion badalne ki koshish kare. Inertia = state na badalne ki aadat; zyada mass = zyada inertia. Bus achanak chale to hum peeche girte hain (inertia of rest), ruke to aage (inertia of motion)."),
T("Newton's first law", "Net force zero ho to body rest par rahegi ya same velocity se seedhi chalti rahegi. Yeh law inertial frame define karta hai. 'Body chal rahi hai to force lag raha hoga' — galat soch hai."),
T("Newton's second law and impulse", "Momentum p = mv. F = dp/dt. Chhota time = bada force; isliye catch karte waqt haath peeche khinchte hain (time badhao, force ghatao), aur gadde par girna kam chot deta hai."),
T("Newton's third law", "Action–reaction pair hamesha barabar, ulte, ek hi type ke (dono contact ya dono gravity) aur ALAG bodies par. Table par rakhi kitaab: weight aur normal force pair nahi hain (dono kitaab par hain)."),
T("Conservation of momentum ke applications", "Gun recoil, rocket (gas peeche, rocket aage), explosion (pehle total p zero to baad mein bhi zero), boat se kood kar boat ka peeche jaana. Internal forces kitne bhi bade hon, total momentum nahi badalte."),
T("Laws of friction", "(1) Friction normal reaction ke proportional. (2) Contact area par (lagbhag) depend nahi karta. (3) μ_k < μ_s. (4) Friction surfaces ki nature par depend karta hai. Friction motion ka virodh nahi, RELATIVE sliding ka virodh karta hai — chalne aur gaadi ko aage badhaane mein friction hi madad karta hai."),
T("Rolling friction", "Pahiya ludhakne par contact point ruka rehta hai, isliye sliding friction nahi lagta; deformation se chhota rolling friction lagta hai. Isliye ball bearings aur pahiye kaam aasaan karte hain. Lubricants friction aur ghiswat dono kam karte hain."),
T("Circular motion: kaun sa force centripetal?", "Gol ghumaata patthar: string ka tension. Level road par car: static friction. Banked road: normal force ka horizontal component (+ friction). Satellite: gravity. Vertical circle mein top par mg + T = mv²/r."),
],
"ratta": [
"F = dp/dt;  J = FΔt = Δp.",
"Lift: up a ⇒ m(g + a), down a ⇒ m(g − a), free fall ⇒ 0.",
"Atwood: a = (m₁ − m₂)g/(m₁ + m₂),  T = 2m₁m₂g/(m₁ + m₂).",
"f_s ≤ μ_s N;  f_k = μ_k N;  tanθ_repose = μ_s.",
"Incline: a = g(sinθ − μ cosθ) neeche.",
"Level road v_max = √(μrg);  banking tanθ = v²/rg.",
"Action–reaction alag bodies par — kabhi cancel nahi.",
"Rolling < kinetic < static (limiting) friction.",
],
}

SYLLABUS = [
("Force and inertia, Newton's first law", ["inertia", "Newton's first law"]),
("Momentum, Newton's second law, impulse", ["Momentum", "second law", "impulse"]),
("Newton's third law", ["third law"]),
("Law of conservation of linear momentum and its applications", ["Conservation of linear momentum", "recoil"]),
("Equilibrium of concurrent forces", ["Equilibrium of concurrent forces"]),
("Static and kinetic friction, laws of friction, rolling friction", ["Static friction", "Kinetic friction", "Laws of friction", "Rolling friction"]),
("Dynamics of uniform circular motion, centripetal force", ["Centripetal force"]),
("Vehicle on a level circular road, vehicle on a banked road", ["level road", "Banked road"]),
]

DOC_EN = {
"slug": "laws-of-motion", "subject": "Physics", "verifiedOn": "2026-11-15",
"chapters": {"NEET": "Laws of Motion", "JEE": "Laws of Motion"},
"title": "Laws of Motion", "readMinutes": 20,
"summary": [
"Force CHANGES motion; it is not needed to keep motion going. With no net force a body stays in its state (rest or uniform velocity) — this is inertia (Newton's first law). Mass measures inertia.",
"Second law: net force = rate of change of momentum, F = dp/dt = ma (constant mass). A large force for a short time gives an impulse: J = FΔt = Δp. Third law: every action has an equal and opposite reaction — on different bodies, so they never cancel.",
"One method for every problem: isolate the body → draw its free-body diagram (FBD) → write ΣF = ma in each direction → add constraints (strings, contact). This solves pulleys, lifts, inclines and connected blocks.",
"Friction OPPOSES relative sliding. Static friction adjusts from 0 up to μ_s N as needed; once sliding starts, kinetic friction μ_k N acts (a little smaller). Rolling friction is the smallest.",
"Circular motion needs a net force towards the centre (centripetal, mv²/r) — not a new force; friction, tension, normal force or gravity provide it. On a level road it is friction; on a banked road a component of the normal force.",
],
"formulas": [
F("Newton's second law", "F_net = dp/dt = ma  (constant mass);   F_net = 0 ⇒ v constant", "Start of every dynamics problem.", "Write F_net, not just the applied force — include friction, weight, normal and every other force."),
F("Momentum and impulse", "p = mv;   J = ∫F dt = F_avg Δt = Δp", "Collisions, catching, bat and ball, bouncing.", "For a bounce Δp = m(v + u) (direction reverses), not m(v − u).", None, "PYQ favourite"),
F("Conservation of linear momentum", "F_ext = 0 ⇒ m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂", "Gun recoil, explosions, collisions, rockets.", "Apply it only in a direction where the external force is zero."),
F("Recoil of gun", "V_gun = m_b v_b / M_gun   (opposite direction)", "Backward kick of a gun on firing.", "Opposite sign, smaller magnitude — the gun gets less kinetic energy."),
F("Apparent weight in a lift", "Accelerating up: N = m(g + a);   accelerating down: N = m(g − a);   free fall: N = 0", "Lifts, weighing machines.", "Apparent weight changes with the lift's ACCELERATION, not its velocity."),
F("Atwood machine", "a = (m₁ − m₂)g / (m₁ + m₂);   T = 2m₁m₂g / (m₁ + m₂)", "Two blocks hanging over one pulley (light string, smooth pulley).", "T is never equal to m₁g (the heavier block accelerates downward)."),
F("Connected blocks (push/pull)", "a = F/(m₁ + m₂ + …);   contact force / tension = (total mass beyond the joint that this force pulls or pushes) × a", "Blocks moving together on a smooth surface.", "Find a contact force from the mass it pushes, not from the whole system."),
F("Equilibrium of concurrent forces", "ΣF_x = 0, ΣF_y = 0;   Lami: F₁/sin α = F₂/sin β = F₃/sin γ", "Hanging objects, strings, balance.", "In Lami's theorem use the angle opposite each force (between the other two)."),
F("Static friction", "0 ≤ f_s ≤ μ_s N;   limiting f = μ_s N", "Body not sliding yet.", "Static friction is not always μ_s N — it equals the applied force (up to the limit)."),
F("Kinetic friction", "f_k = μ_k N  (μ_k < μ_s), opposite to relative sliding", "Body sliding.", "N is not always mg — on an incline it is mg cos θ; when pulled upward at an angle it is mg − F sin θ."),
F("Angle of repose / friction", "tan θ_repose = μ_s;   angle of friction: tan λ = μ_s", "Body just about to slide on an incline.", "This comes from μ_s, not μ_k."),
F("Block on rough incline", "Sliding down: a = g(sin θ − μ cos θ);   pushed up: a = −g(sin θ + μ cos θ)", "Incline problems.", "Going up, friction also acts down the slope — the two add."),
F("Centripetal force", "F_c = mv²/r = mω²r  (towards the centre)", "Any circular motion.", "Don't draw a separate 'centripetal force' in the FBD — it is the net inward force."),
F("Vehicle on level road", "v_max = √(μ_s r g)", "No skidding on a curve.", "Mass cancels — the same v_max for a truck and a bicycle."),
F("Banked road", "Without friction: tan θ = v²/(rg).   With friction: v_max = √[rg(μ + tan θ)/(1 − μ tan θ)]", "Highway curves, race tracks.", "At the ideal speed no friction is needed; faster or slower, friction acts in different directions.", None, "PYQ favourite"),
F("Pseudo force", "In a frame with acceleration a, apply −ma to every body", "Problems seen from inside a lift or accelerating car.", "Don't add a pseudo force when solving from the ground frame."),
],
"examples": [
X("Atwood machine", "5 kg and 3 kg hang from a light string over a smooth pulley (g = 10). Acceleration and tension?",
  f"a = (5 − 3) × 10/8 = {fx(a1)} m/s².  T = 2 × 5 × 3 × 10/8 = {fx(T1)} N (between 30 N and 50 N — sensible).",
  [(fx(a1), "2.5"), (fx(T1), "37.5")]),
X("Friction: will it move?", "10 kg block, μ_s = 0.5, μ_k = 0.4 (g = 10). Apply (a) 40 N (b) 60 N — friction and acceleration?",
  f"Limiting friction = 0.5 × 100 = {fx(fs2)} N. (a) 40 < 50 ⇒ no motion, friction = 40 N (equal to the applied force). (b) 60 > 50 ⇒ slides; kinetic friction 40 N, a = (60 − 40)/10 = {fx(a2)} m/s².",
  [(fx(fs2), "50"), (fx(a2), "2")]),
X("Rough incline", "A block slides down a 30° incline with μ_k = 0.2 (g = 10). Acceleration?",
  f"a = g(sin 30° − μ cos 30°) = 10(0.5 − 0.2 × 0.866) = {fx(a3)} m/s².",
  [(fx(a3), "3.27")]),
X("Impulse from a bat", "A 0.15 kg ball arrives at 20 m/s and goes back at 30 m/s after hitting the bat. Contact 0.01 s. Impulse and average force?",
  f"Δp = m(v + u) = 0.15 × 50 = {fx(J4)} N·s. F = Δp/Δt = 7.5/0.01 = {fx(F4)} N.",
  [(fx(J4), "7.5"), (fx(F4), "750")]),
X("Recoil of a gun", "A 4 kg gun fires a 20 g bullet at 400 m/s. Recoil speed of the gun?",
  f"0 = m_b v_b + M V ⇒ V = 0.02 × 400/4 = {fx(V5)} m/s (opposite to the bullet).",
  [(fx(V5), "2")]),
X("Angle of a banked road", "A 100 m radius curve is designed for 20 m/s without friction (g = 10). Banking angle?",
  f"tan θ = v²/(rg) = 400/1000 = 0.4 ⇒ θ ≈ {fx(th6,1)}°.",
  [(fx(th6,1), "21.8")]),
X("Maximum speed on a level road", "Flat curve of radius 50 m, μ_s = 0.4. Maximum speed without skidding?",
  f"v = √(μrg) = √(0.4 × 50 × 10) = √200 ≈ {fx(v7)} m/s (≈ 51 km/h).",
  [(fx(v7), "14.14")]),
X("Weight in a lift", "A 60 kg man stands in a lift accelerating at 2 m/s² (a) upward (b) downward. Machine reading (in N)?",
  f"(a) N = m(g + a) = 60 × 12 = {fx(N8)} N.  (b) N = 60 × 8 = {fx(N8d)} N.  In free fall, 0.",
  [(fx(N8), "720"), (fx(N8d), "480")]),
X("Weight hung by two strings", "A 100 N weight hangs from two strings making 30° and 60° with the horizontal. Both tensions?",
  f"Horizontal: T₁ cos 30° = T₂ cos 60° ⇒ T₂ = √3 T₁. Vertical: T₁ sin 30° + T₂ sin 60° = 100 ⇒ T₁(0.5 + 1.5) = 100 ⇒ T₁ = {fx(T9a)} N, T₂ = {fx(T9b,1)} N. (The more vertical string carries more tension.)",
  [(fx(T9a), "50"), (fx(T9b,1), "86.6")]),
X("Pushing two blocks", "2 kg and 3 kg blocks touch on a smooth floor; the 2 kg block is pushed with 20 N. Contact force?",
  f"a = 20/5 = {fx(a10)} m/s². Only the contact force pushes the 3 kg block ⇒ N = 3 × 4 = {fx(N10)} N.",
  [(fx(a10), "4"), (fx(N10), "12")]),
],
"topics": [
T("Force and inertia", "Force tries to change the state of motion. Inertia is the tendency not to change it; more mass = more inertia. When a bus starts suddenly we fall back (inertia of rest); when it stops we fall forward (inertia of motion)."),
T("Newton's first law", "With zero net force a body stays at rest or moves in a straight line at constant velocity. This law defines inertial frames. 'If it is moving, a force must be acting' is a wrong idea."),
T("Newton's second law and impulse", "Momentum p = mv. F = dp/dt. Shorter time = larger force; that's why we pull our hands back while catching (increase time, reduce force) and why falling on a mattress hurts less."),
T("Newton's third law", "An action–reaction pair is always equal, opposite, of the same type (both contact or both gravity) and acts on DIFFERENT bodies. For a book on a table, weight and normal force are not a pair (both act on the book)."),
T("Applications of momentum conservation", "Gun recoil, rockets (gas backward, rocket forward), explosions (zero total momentum before ⇒ zero after), a boat moving back when you jump off. Internal forces, however large, don't change total momentum."),
T("Laws of friction", "(1) Friction is proportional to the normal reaction. (2) It is (nearly) independent of contact area. (3) μ_k < μ_s. (4) It depends on the nature of the surfaces. Friction opposes RELATIVE sliding, not motion — walking and driving forward rely on friction."),
T("Rolling friction", "When a wheel rolls, the contact point is momentarily at rest, so there is no sliding friction; a small rolling friction arises from deformation. Hence ball bearings and wheels make work easier. Lubricants reduce both friction and wear."),
T("Circular motion: which force is centripetal?", "Stone whirled on a string: tension. Car on a level road: static friction. Banked road: horizontal component of the normal force (+ friction). Satellite: gravity. In a vertical circle at the top: mg + T = mv²/r."),
],
"ratta": [
"F = dp/dt;  J = FΔt = Δp.",
"Lift: up a ⇒ m(g + a), down a ⇒ m(g − a), free fall ⇒ 0.",
"Atwood: a = (m₁ − m₂)g/(m₁ + m₂),  T = 2m₁m₂g/(m₁ + m₂).",
"f_s ≤ μ_s N;  f_k = μ_k N;  tan θ_repose = μ_s.",
"Incline down: a = g(sin θ − μ cos θ).",
"Level road v_max = √(μrg);  banking tan θ = v²/rg.",
"Action–reaction act on different bodies — never cancel.",
"Rolling < kinetic < static (limiting) friction.",
],
}

if __name__ == "__main__":
    build(DOC, SYLLABUS, DOC_EN)
