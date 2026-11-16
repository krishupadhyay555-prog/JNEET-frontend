from lib import F, X, T, sig, fx, _check_and_write
import math

G = 6.67e-11; Me = 6e24; Re = 6.4e6; g = 9.8
F1 = G * 50 * 50 / 1 ** 2                       # two 50 kg masses 1 m apart
g2 = g / (1 + 0.5) ** 2                         # height R/2 (exact)
g3 = g * (1 - 1600 / 6400)                      # depth 1600 km
ve4 = math.sqrt(2 * G * Me / Re) / 1000         # km/s
v5 = math.sqrt(G * Me / (Re + 3.6e5)); T5 = 2 * math.pi * (Re + 3.6e5) / v5 / 60   # 360 km orbit
T6 = 24 / 8                                      # r/4 → T/8
ve7 = 11.2 * math.sqrt(2 / 2)                    # planet: 2M, 2R
h8 = Re / 3 / 1000                               # thrown at ve/2 → R/3 (km)

DOC = {
"slug": "gravitation", "subject": "Physics",
"chapters": {"NEET": "Gravitation", "JEE": "Gravitation"},
"title": "Gravitation", "readMinutes": 12,
"summary": [
"Every mass attracts every other mass with F = Gm₁m₂/r². This one law explains falling apples, planetary orbits (Kepler's laws) and satellites.",
"g = GM/R² at the surface. It decreases with height (1/r²), decreases linearly with depth, and is zero at the centre of the Earth.",
"Gravitational potential V = −GM/r and potential energy U = −GMm/r are negative: you must supply energy to pull a mass away to infinity.",
"Orbital speed √(GM/r), escape speed √(2GM/R) and satellite energy E = −GMm/2r are the core results; a satellite's kinetic energy = −(total energy) = −U/2.",
],
"formulas": [
F("Newton's law of gravitation", "F = G m₁ m₂ / r²,   G = 6.67 × 10⁻¹¹ N m² kg⁻²", "Force between two point masses (or spheres, centre to centre).", "r is centre-to-centre distance, not surface-to-surface."),
F("Acceleration due to gravity", "g = GM/R² ≈ 9.8 m/s²", "Relating g to the planet's mass and radius.", None, tag="PYQ favourite"),
F("g at height h", "g_h = g R²/(R + h)²   ≈ g(1 − 2h/R) for h ≪ R", "Gravity above the surface.", "Use the exact form when h is comparable to R — the approximation fails."),
F("g at depth d", "g_d = g(1 − d/R)", "Gravity inside the Earth (mines, centre).", "g is zero at the centre and maximum at the surface."),
F("Effect of rotation (latitude λ)", "g' = g − ω²R cos²λ", "Weight at the equator vs the poles.", note="g is least at the equator and greatest at the poles."),
F("Gravitational potential energy", "U = −G M m / r", "Energy of a mass in a planet's field.", "U is negative; near the surface ΔU ≈ mgh only when h ≪ R."),
F("Gravitational potential", "V = −GM/r (outside);  inside a solid sphere V = −GM(3R² − r²)/(2R³)", "Work per unit mass to bring a mass from infinity.", None),
F("Escape speed", "vₑ = √(2GM/R) = √(2gR) ≈ 11.2 km/s for Earth", "Minimum speed to leave the planet for ever.", "It does not depend on the mass of the body or the direction of throw.", tag="PYQ favourite"),
F("Orbital speed", "v₀ = √(GM/r) = √(gR²/r);  near the surface v₀ = √(gR) ≈ 7.9 km/s", "Speed of a satellite in a circular orbit of radius r = R + h."),
F("Time period of a satellite", "T = 2π r/v₀ = 2π √(r³/GM)", "Orbit time; geostationary T = 24 h at h ≈ 36,000 km."),
F("Energy of a satellite", "K = GMm/2r,   U = −GMm/r,   E = −GMm/2r", "Energy to launch or move a satellite.", "Total energy is negative for a bound orbit; binding energy = +GMm/2r."),
F("Kepler's laws", "1) orbits are ellipses with the Sun at one focus;  2) equal areas in equal times (dA/dt = L/2m = constant);  3) T² ∝ a³", "Planet and satellite timing problems.", "The second law is conservation of angular momentum — speed is highest at perihelion."),
F("Relation vₑ and v₀", "vₑ = √2 × v₀ (for an orbit at the surface)", "Quick comparisons.", note="A satellite needs ≈41% extra speed to escape."),
],
"examples": [
X("Force between two people", "Two 50 kg masses are 1 m apart. Gravitational force?",
  f"F = 6.67 × 10⁻¹¹ × 50 × 50 / 1² ≈ {sig(F1,3)} N — far too small to feel.", [(sig(F1,3), "1.67 × 10⁻⁷")]),
X("g at height R/2", "Find g at a height R/2 above the Earth (g = 9.8 m/s²).",
  f"g_h = g/(1 + 1/2)² = (4/9) × 9.8 ≈ {fx(g2,2)} m/s². (The approximation g(1 − 2h/R) = 0 would be badly wrong here.)", [(fx(g2,2), "4.36")]),
X("g in a deep mine", "g at a depth of 1600 km (R = 6400 km)?",
  f"g_d = 9.8 × (1 − 1600/6400) = 9.8 × 0.75 = {fx(g3,2)} m/s².", [(fx(g3,2), "7.35")]),
X("Escape speed of Earth", "M = 6 × 10²⁴ kg, R = 6.4 × 10⁶ m. Escape speed?",
  f"vₑ = √(2 × 6.67 × 10⁻¹¹ × 6 × 10²⁴ / 6.4 × 10⁶) ≈ {fx(ve4,1)} km/s.", [(fx(ve4,1), "11.2")]),
X("Satellite at 360 km", "Orbital speed and period at h = 360 km (same M, R)?",
  f"r = 6.76 × 10⁶ m. v = √(GM/r) ≈ {fx(v5/1000,2)} km/s. T = 2πr/v ≈ {fx(T5,0)} min.", [(fx(v5/1000,2), "7.69"), (fx(T5,0), "92")]),
X("Kepler's third law", "A geostationary satellite (T = 24 h) has orbital radius r. Period at radius r/4?",
  f"T ∝ r^(3/2): (1/4)^(3/2) = 1/8 → T = 24/8 = {fx(T6)} h.", [(fx(T6), "3")]),
X("Escape speed of another planet", "A planet has twice the Earth's mass and twice its radius. Escape speed? (Earth 11.2 km/s)",
  f"vₑ ∝ √(M/R) = √(2/2) = 1 → {fx(ve7,1)} km/s, the same as Earth.", [(fx(ve7,1), "11.2")]),
X("Thrown at half the escape speed", "A body is thrown up with vₑ/2. Maximum height (R = 6400 km)?",
  f"½m(vₑ/2)² = GMm(1/R − 1/(R+h)) with vₑ² = 2GM/R: GM/4R = GM/R − GM/(R + h) → 1/(R + h) = 3/(4R) → R + h = 4R/3, so h = R/3 ≈ {fx(h8,0)} km.", [(fx(h8,0), "2133")]),
],
"topics": [
T("Universal gravitation", "Gravity is always attractive, acts along the line joining the masses, follows Newton's third law and works through any medium. It is the weakest fundamental force but dominates at large scales because masses don't cancel like charges."),
T("Shell theorem", "A uniform spherical shell attracts an outside mass as if all its mass were at the centre, and exerts zero force on a mass inside it. That is why g falls linearly inside a solid sphere."),
T("Variation of g", "Height: g ∝ 1/r². Depth: g ∝ r (inside). Rotation and the Earth's shape make g smallest at the equator and largest at the poles. A body weighs nothing at the centre of the Earth."),
T("Potential and potential energy", "Potential is zero at infinity and negative everywhere else. Work done by an external agent = m(V_final − V_initial). For a mass moved from the surface to a height h: ΔU = GMmh/[R(R + h)] = mgh/(1 + h/R)."),
T("Satellites", "A satellite is in free fall around the planet — gravity provides the centripetal force. Orbital speed, period and energy depend only on r, not on the satellite's mass. Astronauts feel weightless because they and the craft fall together."),
T("Geostationary and polar satellites", "Geostationary: period 24 h, above the equator, moving west to east, height ≈ 36,000 km — used for communication. Polar satellites: low height (~500–800 km), pass over the poles — used for weather and remote sensing."),
T("Escape and binding energy", "To escape, total energy must be ≥ 0. Energy needed to take a satellite from orbit r to infinity = GMm/2r. Energy to raise a satellite from orbit r₁ to r₂ = GMm/2 (1/r₁ − 1/r₂)."),
T("Kepler's laws in exams", "Areal velocity is constant, so a planet moves fastest at perihelion: v_p r_p = v_a r_a. For ellipses use the semi-major axis a in T² ∝ a³."),
],
"ratta": [
"F = Gm₁m₂/r²;  G = 6.67 × 10⁻¹¹ N m² kg⁻².",
"g_h = g(R/(R+h))²;  g_d = g(1 − d/R);  g = 0 at centre.",
"vₑ = √(2gR) ≈ 11.2 km/s;  v₀ = √(gR) ≈ 7.9 km/s;  vₑ = √2 v₀.",
"T = 2π√(r³/GM);  T² ∝ r³.",
"Satellite: K = GMm/2r, U = −GMm/r, E = −GMm/2r.",
"Geostationary: 24 h, h ≈ 36,000 km, equatorial.",
"Kepler 2nd law = angular momentum conserved.",
],
}

SYLLABUS = [
("Universal law of gravitation", ["universal", "G m₁ m₂"]),
("Acceleration due to gravity and its variation with altitude and depth", ["height", "depth", "g_h", "g_d"]),
("Kepler's laws of planetary motion", ["Kepler", "equal areas", "T² ∝"]),
("Gravitational potential energy; gravitational potential", ["potential energy", "potential"]),
("Escape velocity", ["escape speed"]),
("Motion of a satellite: orbital velocity, time period and energy", ["orbital speed", "satellite", "period"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Har mass har doosre mass ko F = Gm₁m₂/r² se kheenchta hai. Yahi ek universal law girte seb, planets ki orbits (Kepler's laws) aur satellites ko samjhata hai.",
"Surface par g = GM/R². Height badhne par g ghatta hai (1/r²), depth mein linearly ghatta hai, aur Earth ke centre par zero hai.",
"Gravitational potential V = −GM/r aur potential energy U = −GMm/r negative hain: kisi mass ko infinity tak le jaane ke liye energy deni padti hai.",
"Orbital speed √(GM/r), escape speed √(2GM/R) aur satellite energy E = −GMm/2r core results hain; satellite ki kinetic energy = −(total energy) = −U/2.",
],
when=[
("Do point masses (ya spheres, centre se centre) ke beech force.", "r centre-to-centre doori hai, surface-to-surface nahi."),
("g ko planet ke mass aur radius se jodna.", None),
("Surface ke upar gravity.", "h agar R ke comparable ho to exact form lagao — approximation fail ho jaata hai."),
("Earth ke andar gravity (mines, centre).", "Centre par g zero aur surface par maximum hai — dhyan rakho."),
("Equator vs poles par weight.", None),
("Planet ke field mein mass ki energy.", "U negative hai; surface ke paas ΔU ≈ mgh sirf tab jab h ≪ R."),
("Infinity se mass laane ka work per unit mass.", None),
("Planet ko hamesha ke liye chhodne ki minimum speed.", "Ye body ke mass ya phenkne ki direction par depend nahi karti."),
("Circular orbit (r = R + h) mein satellite ki speed.", None),
("Orbit ka time; geostationary T = 24 h, h ≈ 36,000 km par.", None),
("Satellite launch karne ya orbit badalne ki energy.", "Bound orbit ki total energy negative hai; binding energy = +GMm/2r — sign mat bhoolo."),
("Planet aur satellite ke timing problems.", "Doosra law angular momentum conservation hai — speed perihelion par sabse zyada, ulta mat samjho."),
("Quick comparisons.", None),
],
examples=[
("Do logon ke beech force", "Do 50 kg masses 1 m door. Gravitational force?",
 "F = 6.67 × 10⁻¹¹ × 50 × 50 / 1² ≈ ⟨0⟩ N — mehsoos karne ke liye bahut chhota."),
("R/2 height par g", "Earth se R/2 upar g? (g = 9.8 m/s²)",
 "g_h = g/(1 + 1/2)² = (4/9) × 9.8 ≈ ⟨0⟩ m/s². (Approximation g(1 − 2h/R) = 0 yahan bilkul galat hota.)"),
("Gehri mine mein g", "1600 km depth par g (R = 6400 km)?",
 "g_d = 9.8 × (1 − 1600/6400) = 9.8 × 0.75 = ⟨0⟩ m/s²."),
("Earth ki escape speed", "M = 6 × 10²⁴ kg, R = 6.4 × 10⁶ m. Escape speed?",
 "vₑ = √(2 × 6.67 × 10⁻¹¹ × 6 × 10²⁴ / 6.4 × 10⁶) ≈ ⟨0⟩ km/s."),
("360 km par satellite", "h = 360 km par orbital speed aur period (same M, R)?",
 "r = 6.76 × 10⁶ m. v = √(GM/r) ≈ ⟨0⟩ km/s. T = 2πr/v ≈ ⟨1⟩ min."),
("Kepler ka third law", "Geostationary satellite (T = 24 h) ka orbital radius r. Radius r/4 par period?",
 "T ∝ r^(3/2): (1/4)^(3/2) = 1/8 → T = 24/8 = ⟨0⟩ h."),
("Doosre planet ki escape speed", "Planet ka mass Earth ka double aur radius bhi double. Escape speed? (Earth 11.2 km/s)",
 "vₑ ∝ √(M/R) = √(2/2) = 1 → ⟨0⟩ km/s, Earth jitni hi."),
("Aadhi escape speed se phenka", "Body ko vₑ/2 se upar phenka. Maximum height (R = 6400 km)?",
 "½m(vₑ/2)² = GMm(1/R − 1/(R+h)) aur vₑ² = 2GM/R: GM/4R = GM/R − GM/(R + h) → 1/(R + h) = 3/(4R) → R + h = 4R/3, yaani h = R/3 ≈ ⟨0⟩ km."),
],
topics=[
("Universal gravitation", "Gravity hamesha attractive hai, masses ko jodne wali line par lagti hai, Newton ka third law follow karti hai aur kisi bhi medium se kaam karti hai. Ye sabse kamzor fundamental force hai, par bade scale par haavi hai kyunki masses charges ki tarah cancel nahi hote."),
("Shell theorem", "Uniform spherical shell bahar ke mass ko aise kheenchta hai jaise poora mass centre par ho, aur andar ke mass par zero force lagata hai. Isi wajah se solid sphere ke andar g linearly ghatta hai."),
("Variation of g", "Height: g ∝ 1/r². Depth: g ∝ r (andar). Rotation aur Earth ki shape ki wajah se g equator par sabse kam aur poles par sabse zyada. Earth ke centre par body ka weight zero."),
("Potential and potential energy", "Potential infinity par zero aur baaki har jagah negative. External agent ka work = m(V_final − V_initial). Surface se height h tak: ΔU = GMmh/[R(R + h)] = mgh/(1 + h/R)."),
("Satellites", "Satellite planet ke chaaron taraf free fall mein hai — gravity hi centripetal force deti hai. Orbital speed, period aur energy sirf r par depend karte hain, satellite ke mass par nahi. Astronauts weightless mehsoos karte hain kyunki woh aur craft saath gir rahe hain."),
("Geostationary and polar satellites", "Geostationary: period 24 h, equator ke upar, west se east, height ≈ 36,000 km — communication ke liye. Polar satellites: kam height (~500–800 km), poles ke upar se — weather aur remote sensing ke liye."),
("Escape and binding energy", "Escape ke liye total energy ≥ 0 honi chahiye. Orbit r se infinity tak le jaane ki energy = GMm/2r. Orbit r₁ se r₂ tak uthaane ki energy = GMm/2 (1/r₁ − 1/r₂)."),
("Kepler's laws in exams", "Areal velocity constant hai, isliye planet perihelion par sabse tez: v_p r_p = v_a r_a. Ellipse ke liye T² ∝ a³ mein semi-major axis a lo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
