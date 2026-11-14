from lib import F, X, T, sig, fx, build
import math

g = 10
# 1 uniformly accelerated
v1 = 10 + 2 * 5; s1 = 10 * 5 + 0.5 * 2 * 25
# 2 vertical throw
H2 = 20 ** 2 / (2 * g); T2 = 2 * 20 / g
# 3 nth second
sn3 = 0 + 4 * (2 * 3 - 1) / 2
# 4 projectile
th = math.radians(30)
T4 = 2 * 20 * math.sin(th) / g; H4 = 20 ** 2 * math.sin(th) ** 2 / (2 * g); R4 = 20 ** 2 * math.sin(2 * th) / g
# 5 river
t5a = 100 / 5; d5 = 3 * t5a; v5 = math.sqrt(5 ** 2 - 3 ** 2); t5b = 100 / v5; a5 = math.degrees(math.asin(3 / 5))
# 6 vectors A = 3i+4j, B = i-2j+2k
A = (3, 4, 0); B = (1, -2, 2)
dot6 = sum(a * b for a, b in zip(A, B))
cr6 = (A[1] * B[2] - A[2] * B[1], A[2] * B[0] - A[0] * B[2], A[0] * B[1] - A[1] * B[0])
mag6 = math.sqrt(sum(c * c for c in cr6))
# 7 circular motion 120 rpm, r = 0.5
w7 = 120 * 2 * math.pi / 60; vv7 = w7 * 0.5; a7 = w7 ** 2 * 0.5
# 8 rain
vr8 = math.hypot(6, 8); ang8 = math.degrees(math.atan(8 / 6))
# 9 v-t graph
d9 = 0.5 * 4 * 20 + 6 * 20 + 0.5 * 2 * 20; avg9 = d9 / 12

DOC = {
"slug": "kinematics", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Kinematics", "JEE": "Kinematics"},
"title": "Kinematics (Motion in a Straight Line and in a Plane)", "readMinutes": 22,
"summary": [
"Kinematics sirf yeh batata hai ki cheez KAISE chal rahi hai — position, velocity, acceleration — force ki baat nahi (woh Laws of Motion mein). Har sawal ek frame of reference se naapa jaata hai; ground frame default hai.",
"Distance scalar hai (path ki lambai), displacement vector hai (seedha start se end). Speed = distance/time, velocity = displacement/time. Instantaneous velocity = dx/dt, acceleration = dv/dt.",
"Constant acceleration par teen equations (v = u + at, s = ut + ½at², v² = u² + 2as) har jagah chalti hain — free fall mein a = g. Acceleration badal raha ho to calculus ya graph (area/slope) use karo.",
"Plane motion = do independent 1-D motions. Projectile mein horizontal velocity constant, vertical mein a = −g. Uniform circular motion mein speed constant par direction badalti hai, isliye centripetal acceleration v²/r centre ki taraf.",
"Vectors is chapter ki bhasha hai: addition (triangle/parallelogram), resolution (A cosθ, A sinθ), dot product (scalar, kaam/angle ke liye) aur cross product (vector, area/torque ke liye). Relative velocity v_AB = v_A − v_B se river, rain aur train ke sawal hal hote hain."
],
"formulas": [
F("Average speed and velocity", "v_avg = total displacement / total time;   average speed = total distance / total time", "Poori journey ka average.", "Average speed ko (v₁ + v₂)/2 mat lo — sirf equal TIME intervals mein aisa hota hai. Equal distance par 2v₁v₂/(v₁ + v₂)."),
F("Instantaneous velocity and acceleration", "v = dx/dt,   a = dv/dt = v dv/dx = d²x/dt²", "x(t) ya v(x) diya ho.", "a = v dv/dx tab use karo jab v position ke function mein diya ho — t ke bina."),
F("Equations of uniformly accelerated motion", "v = u + at;   s = ut + ½at²;   v² = u² + 2as;   s = (u + v)t/2", "Sirf CONSTANT acceleration par.", "Sign convention ek baar fix karo (upar +ve to g = −10) aur poore sawal mein wahi rakho.", None, "PYQ favourite"),
F("Distance in the nth second", "s_n = u + (a/2)(2n − 1)", "Sirf n-wen second mein chali doori.", "Ye nth second ki doori hai, n seconds ki total nahi."),
F("Free fall and vertical throw", "Max height H = u²/2g;  time to top = u/g;  total time = 2u/g;  wapas usi speed u se aata hai", "Upar phenki ya giraayi cheez (air resistance nahi).", "Top par v = 0 hota hai, lekin a = g tab bhi hai — acceleration zero nahi."),
F("Graphs", "x–t ka slope = velocity;  v–t ka slope = acceleration;  v–t ke neeche area = displacement;  a–t ke neeche area = Δv", "Graph wale sawal.", "v–t graph mein axis ke neeche wala area displacement mein minus, distance mein plus gino."),
F("Vector resolution and unit vector", "A = A_x î + A_y ĵ + A_z k̂;  |A| = √(A_x² + A_y² + A_z²);  Â = A/|A|;  A_x = A cosθ, A_y = A sinθ", "Vector todna / jodna.", "θ kis axis se naapa hai, check karo — y-axis se ho to cos/sin ulta ho jaate hain."),
F("Vector addition (resultant)", "R = √(A² + B² + 2AB cosθ);   tan α = B sinθ / (A + B cosθ)", "Do vectors jinke beech angle θ.", "θ dono vectors ke TAIL milaakar naapo, tail-to-head nahi."),
F("Dot (scalar) product", "A·B = AB cosθ = A_x B_x + A_y B_y + A_z B_z", "Angle nikalna, kaam, projection (A·B̂).", "Dot product scalar hai — iska answer kabhi î/ĵ mein nahi likhte."),
F("Cross (vector) product", "A×B = AB sinθ n̂ = |î ĵ k̂; A_x A_y A_z; B_x B_y B_z|;   A×B = −B×A", "Area of parallelogram = |A×B|, torque, perpendicular vector.", "Order badalne se sign badalta hai; î×ĵ = k̂, ĵ×î = −k̂."),
F("Relative velocity", "v_AB = v_A − v_B   (A ki velocity B ke frame se)", "Train, car, rain–umbrella, river.", "v_AB aur v_BA ulte hote hain; pehle decide karo kiska frame chahiye."),
F("River crossing", "Shortest time: boat seedha paar → t = d/v_b, drift = v_r·d/v_b.   Shortest path (v_b > v_r): sinθ = v_r/v_b upstream, t = d/√(v_b² − v_r²)", "Boat/swimmer aur behti nadi.", "Shortest time aur shortest path do alag cases hain — sawal dhyan se padho.", None, "PYQ favourite"),
F("Projectile on level ground", "T = 2u sinθ/g;  H = u² sin²θ/2g;  R = u² sin2θ/g;  R_max = u²/g at θ = 45°", "Zameen se zameen tak projectile.", "θ aur (90° − θ) par range same, lekin height aur time alag.", None, "PYQ favourite"),
F("Projectile path equation", "y = x tanθ − g x² / (2u² cos²θ);   v at any time: v_x = u cosθ, v_y = u sinθ − gt", "Kisi bhi point par position/velocity.", "Top par v_y = 0, lekin v_x = u cosθ bacha rehta hai — speed zero nahi."),
F("Horizontal projection from height h", "t = √(2h/g);  range = u√(2h/g);  ground par v = √(u² + 2gh)", "Table/building se horizontally phenka.", "Girne ka time horizontal speed par depend NAHI karta."),
F("Uniform circular motion", "ω = 2π/T = 2πf;  v = ωr;  a_c = v²/r = ω²r (centre ki taraf)", "Constant speed se gol ghoomna.", "Speed constant hai, velocity nahi — isliye acceleration zero nahi."),
F("Non-uniform circular motion", "a_t = dv/dt (tangent),  a_c = v²/r,   a_net = √(a_t² + a_c²)", "Speed bhi badal rahi ho.", "Sirf v²/r likh dena aadha answer hai jab speed badal rahi ho."),
],
"examples": [
X("Car accelerates", "Car u = 10 m/s se 2 m/s² acceleration ke saath 5 s chalti hai. Final velocity aur doori?",
  f"v = u + at = 10 + 2 × 5 = {fx(v1)} m/s.  s = ut + ½at² = 50 + ½ × 2 × 25 = {fx(s1)} m.",
  [(fx(v1), "20"), (fx(s1), "75")]),
X("Ball upar phenki", "Ball 20 m/s se seedhi upar phenki (g = 10 m/s²). Max height aur total time?",
  f"H = u²/2g = 400/20 = {fx(H2)} m.  Total time = 2u/g = {fx(T2)} s (2 s upar, 2 s neeche).",
  [(fx(H2), "20"), (fx(T2), "4")]),
X("Teesre second ki doori", "Rest se a = 4 m/s² se chalti body teesre second mein kitna chalti hai?",
  f"s_n = u + (a/2)(2n − 1) = 0 + 2 × 5 = {fx(sn3)} m. (3 s ki total doori 18 m hoti — alag cheez.)",
  [(fx(sn3), "10")]),
X("Projectile ke teeno numbers", "u = 20 m/s, θ = 30° (g = 10). Time of flight, max height, range?",
  f"T = 2u sinθ/g = 2 × 20 × 0.5/10 = {fx(T4)} s.  H = u² sin²θ/2g = 400 × 0.25/20 = {fx(H4)} m.  R = u² sin2θ/g = 400 × 0.866/10 = {fx(R4,1)} m.",
  [(fx(T4), "2"), (fx(H4), "5"), (fx(R4,1), "34.6")]),
X("Nadi paar karna", "Nadi 100 m chaudi, paani 3 m/s, boat (paani ke relative) 5 m/s. (a) Sabse kam time? drift? (b) Seedha saamne pahunchna ho to?",
  f"(a) Boat seedha paar: t = 100/5 = {fx(t5a)} s, drift = 3 × 20 = {fx(d5)} m.  (b) Upstream angle sinθ = 3/5 ⇒ θ ≈ {fx(a5,1)}° (normal se); resultant = √(25 − 9) = {fx(v5)} m/s, t = 100/4 = {fx(t5b)} s.",
  [(fx(t5a), "20"), (fx(d5), "60"), (fx(a5,1), "36.9"), (fx(v5), "4"), (fx(t5b), "25")]),
X("Dot aur cross product", "A = 3î + 4ĵ, B = î − 2ĵ + 2k̂. A·B, unke beech angle, aur |A×B|?",
  f"A·B = 3 − 8 + 0 = {fx(dot6)}. |A| = 5, |B| = 3 ⇒ cosθ = −5/15 = −1/3 (θ obtuse, ≈ 109.5°). A×B = (4·2 − 0)î − (3·2 − 0)ĵ + (3·(−2) − 4·1)k̂ = 8î − 6ĵ − 10k̂, |A×B| = √200 ≈ {fx(mag6)}.",
  [(fx(dot6), "−5"), (f"{cr6[0]}î − {-cr6[1]}ĵ − {-cr6[2]}k̂", "8î − 6ĵ − 10k̂"), (fx(mag6), "14.14")]),
X("Ghoomta pankha point", "Point 0.5 m radius par 120 rpm se ghoom raha hai. ω, speed, centripetal acceleration?",
  f"ω = 120 × 2π/60 = 4π ≈ {fx(w7)} rad/s.  v = ωr = {fx(vv7)} m/s.  a_c = ω²r = {fx(a7,1)} m/s² (centre ki taraf).",
  [(fx(w7), "12.57"), (fx(vv7), "6.28"), (fx(a7,1), "79")]),
X("Baarish aur chhata", "Baarish seedhi 6 m/s se gir rahi hai, aadmi 8 m/s se chal raha hai. Use baarish kis speed aur angle par dikhegi?",
  f"v_rain,man = v_rain − v_man ⇒ magnitude √(36 + 64) = {fx(vr8)} m/s, vertical se tan⁻¹(8/6) ≈ {fx(ang8,1)}° aage se aati dikhegi. Chhata itna hi aage jhukao.",
  [(fx(vr8), "10"), (fx(ang8,1), "53.1")]),
X("v–t graph se doori", "Body 4 s mein 0 se 20 m/s, phir 6 s tak 20 m/s, phir 2 s mein ruk jaati hai. Total doori aur average speed?",
  f"Area = ½ × 4 × 20 + 6 × 20 + ½ × 2 × 20 = 40 + 120 + 20 = {fx(d9)} m. Average speed = 180/12 = {fx(avg9)} m/s.",
  [(fx(d9), "180"), (fx(avg9), "15")]),
],
"topics": [
T("Frame of reference", "Motion hamesha kisi observer ke relative hoti hai. Train mein baitha aadmi apne liye rest par hai, platform ke liye moving. Jis frame mein Newton ke niyam seedhe chalte hain (no acceleration) woh inertial frame; sawal mein ground ko inertial maante hain."),
T("Uniform vs non-uniform motion", "Uniform motion: barabar time mein barabar displacement (a = 0, x–t seedhi line). Non-uniform: velocity badalti hai. Uniformly accelerated motion mein v–t seedhi line hoti hai aur x–t parabola."),
T("Graph padhna", "x–t graph ka slope velocity; curve upar mud raha hai to velocity badh rahi hai. v–t ka slope acceleration aur area displacement. Kabhi bhi x–t graph mein ek hi time par do x nahi ho sakte, aur speed negative nahi hoti."),
T("Scalars and vectors", "Scalar ka sirf magnitude (mass, speed, kaam, energy); vector ka magnitude + direction (displacement, velocity, force). Vectors ko triangle/parallelogram law se jodte hain; subtraction = ulta vector jodna. Do vectors ka resultant |A − B| se |A + B| ke beech hi hota hai."),
T("Motion in a plane", "x aur y motions ek doosre se independent hain — dono ka time common. Isliye projectile ko 'horizontal uniform + vertical free fall' maan kar hal karte hain. Position vector r = xî + yĵ, velocity v = dr/dt."),
T("Projectile ke important facts", "Top par speed minimum (u cosθ) aur velocity horizontal. Complementary angles (θ, 90° − θ) par range same. R = 4H cotθ. Range max 45° par. Air resistance nahi maante."),
T("Uniform circular motion", "Velocity har point par tangent par; acceleration centre ki taraf (centripetal) aur magnitude v²/r. Ek chakkar mein displacement zero, average velocity zero, lekin average speed 2πr/T."),
T("Relative motion ke sawal", "Do cheezon ke beech doori ka sawal: ek ko rest maan lo aur doosre ko relative velocity do — sawal 1-D ban jaata hai. Rain–man, boat–river, do trains — sab v_AB = v_A − v_B."),
],
"ratta": [
"v = u + at,  s = ut + ½at²,  v² = u² + 2as,  s_n = u + a(2n − 1)/2.",
"Free fall from rest: v = √(2gh), t = √(2h/g).",
"Projectile: T = 2u sinθ/g, H = u² sin²θ/2g, R = u² sin2θ/g, R_max = u²/g.",
"R = 4H cotθ;  θ aur 90° − θ par same range.",
"a_c = v²/r = ω²r;  ω = 2πf.",
"Equal distances par average speed = 2v₁v₂/(v₁ + v₂).",
"A·B = AB cosθ;  |A×B| = AB sinθ = parallelogram area.",
"River: shortest time t = d/v_b;  shortest path sinθ = v_r/v_b.",
],
}

SYLLABUS = [
("Frame of reference", ["frame of reference"]),
("Motion in a straight line, position-time graph, speed and velocity", ["x–t", "speed", "velocity"]),
("Uniform and non-uniform motion, average speed, instantaneous velocity", ["Uniform", "non-uniform", "average speed", "instantaneous velocity"]),
("Uniformly accelerated motion, velocity-time graph, relations", ["uniformly accelerated", "v–t", "v² = u² + 2as"]),
("Scalars and vectors, addition and subtraction", ["Scalar", "vector", "subtraction"]),
("Scalar and vector products", ["Dot (scalar) product", "Cross (vector) product"]),
("Unit vector, resolution of a vector", ["Unit vector", "resolution"]),
("Relative velocity", ["Relative velocity"]),
("Motion in a plane, projectile motion", ["Motion in a plane", "projectile"]),
("Uniform circular motion", ["Uniform circular motion"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
