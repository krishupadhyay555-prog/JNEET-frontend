from lib import F, X, T, sig, fx, _check_and_write
import math

mu0_4pi = 1e-7
B1 = mu0_4pi * 2 * 0.5 / 0.1 ** 3                  # axial, m = 0.5 A m², d = 10 cm
B2 = mu0_4pi * 0.5 / 0.1 ** 3                       # equatorial
tau3 = 0.5 * 0.2 * math.sin(math.radians(30))       # m = 0.5, B = 0.2, 30°
W4 = 0.5 * 0.2 * (1 - math.cos(math.radians(60)))   # rotate 0→60
m5 = 2000 * 1.5 * 2e-4                              # solenoid N=2000, I=1.5, A=2 cm²
chi6 = 2.8e-4 * 300 / 400                           # Curie law χ ∝ 1/T
T7 = 2 * math.pi * math.sqrt(1e-4 / (0.5 * 0.4))    # I = 1e-4, m = 0.5, B = 0.4

DOC = {
"slug": "magnetism-and-matter", "subject": "Physics",
"chapters": {"NEET": "Magnetism and Matter", "JEE": "Magnetism and Matter"},
"title": "Magnetism and Matter", "readMinutes": 11,
"summary": [
"A bar magnet behaves exactly like a current-carrying solenoid: both are magnetic dipoles with a magnetic moment m pointing from S to N.",
"The field of a magnetic dipole falls as 1/r³: on the axis it is twice as strong as on the equatorial line at the same distance, and the two fields point in opposite directions.",
"In a uniform field a dipole feels a torque τ = m × B (no net force) and has potential energy U = −m·B; it oscillates about the field direction like a compass needle.",
"Materials are diamagnetic (weakly repelled), paramagnetic (weakly attracted) or ferromagnetic (strongly attracted). Paramagnetism weakens with temperature (Curie's law); above the Curie temperature a ferromagnet becomes paramagnetic.",
],
"formulas": [
F("Magnetic moment", "bar magnet: m = q_m × 2l;  current loop/solenoid: m = N I A", "Strength of a magnetic dipole.", "Direction: S → N inside the magnet; for a loop use the right-hand rule."),
F("Field on the axis of a dipole", "B_axial = (μ₀/4π) 2m/r³", "Field along the magnet's axis (r ≫ length).", None, tag="PYQ favourite"),
F("Field on the equatorial line", "B_equatorial = (μ₀/4π) m/r³  (opposite to m)", "Field on the perpendicular bisector.", "B_axial = 2 × B_equatorial at the same r — don't swap the factor 2."),
F("Torque on a dipole", "τ = m × B;  |τ| = mB sin θ", "Compass needles, coils in fields.", "Net force is zero in a uniform field — only torque acts."),
F("Potential energy of a dipole", "U = −m · B = −mB cos θ", "Stable (θ = 0) and unstable (θ = 180°) positions."),
F("Work to rotate a dipole", "W = mB (cos θ₁ − cos θ₂)", "Turning a magnet in a field.", None),
F("Oscillation of a magnet", "T = 2π √(I/(mB))", "Small oscillations of a magnet or compass needle in a uniform field."),
F("Magnetisation and intensity", "M = m_net/V;  H = B₀/μ₀;  B = μ₀(H + M)", "Describing magnetic materials."),
F("Susceptibility and permeability", "χ = M/H;  μ = μ₀(1 + χ);  μᵣ = 1 + χ", "Classifying materials.", "Diamagnets: χ small and negative; paramagnets: small positive; ferromagnets: very large positive."),
F("Curie's law", "χ = C/T  (paramagnets)", "Temperature dependence of paramagnetism.", "Applies only to paramagnets; diamagnetism hardly depends on temperature."),
F("Curie–Weiss law", "χ = C/(T − T_C) for T > T_C", "Ferromagnets above the Curie temperature."),
],
"examples": [
X("Axial field of a magnet", "m = 0.5 A m². Field on the axis at 10 cm (μ₀/4π = 10⁻⁷)?",
  f"B = 10⁻⁷ × 2 × 0.5/(0.1)³ = {sig(B1,1)} T.", [(sig(B1,1), "1 × 10⁻⁴")]),
X("Equatorial field", "Same magnet, 10 cm on the equatorial line?",
  f"B = 10⁻⁷ × 0.5/(0.1)³ = {sig(B2,1)} T — half the axial value.", [(sig(B2,1), "5 × 10⁻⁵")]),
X("Torque on a magnet", "m = 0.5 A m² at 30° to a 0.2 T field. Torque?",
  f"τ = mB sin30° = 0.5 × 0.2 × 0.5 = {fx(tau3,2)} N m.", [(fx(tau3,2), "0.05")]),
X("Work to rotate", "The same magnet is turned from 0° to 60°. Work needed?",
  f"W = mB(1 − cos60°) = 0.1 × 0.5 = {fx(W4,2)} J.", [(fx(W4,2), "0.05")]),
X("Solenoid as a magnet", "A solenoid has 2000 turns, area 2 cm², current 1.5 A. Magnetic moment?",
  f"m = NIA = 2000 × 1.5 × 2 × 10⁻⁴ = {fx(m5,1)} A m².", [(fx(m5,1), "0.6")]),
X("Curie's law", "A paramagnet has χ = 2.8 × 10⁻⁴ at 300 K. χ at 400 K?",
  f"χ ∝ 1/T: 2.8 × 10⁻⁴ × 300/400 = {sig(chi6,2)}.", [(sig(chi6,2), "2.1 × 10⁻⁴")]),
X("Oscillating magnet", "I = 10⁻⁴ kg m², m = 0.5 A m², B = 0.4 T. Period of small oscillations?",
  f"T = 2π√(10⁻⁴/(0.5 × 0.4)) ≈ {fx(T7,3)} s.", [(fx(T7,3), "0.14")]),
],
"topics": [
T("Bar magnet as an equivalent solenoid", "Field lines of a bar magnet and of a solenoid look identical outside. Cutting a magnet in half gives two smaller magnets — isolated magnetic poles (monopoles) do not exist, unlike electric charges."),
T("Magnetic field lines", "They form closed loops (outside N → S, inside S → N), never intersect, and are crowded where the field is strong. Gauss's law for magnetism: net flux through any closed surface is zero."),
T("Dipole in a uniform field", "Stable equilibrium when m is along B (minimum energy), unstable when opposite. The torque tries to align m with B — this is how a compass works."),
T("Diamagnetic substances", "Weakly repelled, move from stronger to weaker field; χ small negative (≈ −10⁻⁵). Examples: bismuth, copper, lead, water, nitrogen gas. Superconductors are perfect diamagnets (Meissner effect)."),
T("Paramagnetic substances", "Weakly attracted, move from weaker to stronger field; atoms have permanent moments that partly align. Examples: aluminium, sodium, calcium, oxygen gas, copper chloride. χ decreases as temperature rises."),
T("Ferromagnetic substances", "Strongly attracted; domains align easily. Examples: iron, cobalt, nickel, gadolinium. Above the Curie temperature (Fe ≈ 1043 K) they become paramagnetic. Soft iron (easy to magnetise and demagnetise) is used in electromagnets and transformer cores; steel for permanent magnets."),
T("Syllabus note", "Earth's magnetism (dip, declination, horizontal component) has been removed from the current NTA syllabus. Focus on dipole fields, torque and energy, and the three classes of materials with the effect of temperature."),
],
"ratta": [
"m = NIA;  direction S → N.",
"B_axial = μ₀2m/4πr³;  B_eq = μ₀m/4πr³ (half).",
"τ = mB sinθ;  U = −mB cosθ;  W = mB(cosθ₁ − cosθ₂).",
"T = 2π√(I/mB).",
"Dia: χ < 0;  para: small χ > 0;  ferro: huge χ.",
"Curie: χ = C/T (para);  ferro → para above T_C.",
"No magnetic monopoles; net flux through closed surface = 0.",
],
}

SYLLABUS = [
("Bar magnet, bar magnet as an equivalent solenoid, magnetic field lines", ["bar magnet", "solenoid", "field lines"]),
("Magnetic field due to a magnetic dipole along its axis and perpendicular to its axis", ["axis", "equatorial"]),
("Torque on a magnetic dipole in a uniform magnetic field", ["torque"]),
("Para-, dia- and ferromagnetic substances with examples", ["paramagnetic", "diamagnetic", "ferromagnetic"]),
("Effect of temperature on magnetic properties", ["temperature", "Curie"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Bar magnet bilkul current-carrying solenoid jaisa behave karta hai: dono magnetic dipoles hain jinka magnetic moment m S se N ki taraf hota hai.",
"Magnetic dipole ka field 1/r³ se girta hai: axis par same doori par equatorial line se double, aur dono fields ulti direction mein.",
"Uniform field mein dipole par torque τ = m × B (net force nahi) aur potential energy U = −m·B; compass needle ki tarah field direction ke around oscillate karta hai.",
"Materials diamagnetic (halka repel), paramagnetic (halka attract) ya ferromagnetic (zor se attract) hote hain. Paramagnetism temperature se kamzor hota hai (Curie's law); Curie temperature ke upar ferromagnet paramagnetic ban jaata hai.",
],
when=[
("Magnetic dipole ki strength.", "Direction: magnet ke andar S → N; loop ke liye right-hand rule — ulta mat lo."),
("Magnet ke axis par field (r ≫ length).", None),
("Perpendicular bisector par field.", "Same r par B_axial = 2 × B_equatorial — factor 2 ulta mat karo."),
("Compass needle, field mein coil.", "Uniform field mein net force zero — sirf torque lagta hai, force mat lo."),
("Stable (θ = 0) aur unstable (θ = 180°) positions.", None),
("Field mein magnet ghumaana.", None),
("Uniform field mein magnet ya compass needle ke chhote oscillations.", None),
("Magnetic materials describe karna.", None),
("Materials classify karna.", "Diamagnets: χ chhota aur negative; paramagnets: chhota positive; ferromagnets: bahut bada positive — mix mat karo."),
("Paramagnetism ki temperature dependence.", "Sirf paramagnets par lagta hai; diamagnetism temperature par lagbhag depend nahi karta."),
("Curie temperature ke upar ferromagnets.", None),
],
examples=[
("Magnet ka axial field", "m = 0.5 A m². Axis par 10 cm par field (μ₀/4π = 10⁻⁷)?",
 "B = 10⁻⁷ × 2 × 0.5/(0.1)³ = ⟨0⟩ T."),
("Equatorial field", "Wahi magnet, equatorial line par 10 cm?",
 "B = 10⁻⁷ × 0.5/(0.1)³ = ⟨0⟩ T — axial ka aadha."),
("Magnet par torque", "m = 0.5 A m², 0.2 T field se 30° par. Torque?",
 "τ = mB sin30° = 0.5 × 0.2 × 0.5 = ⟨0⟩ N m."),
("Ghumaane ka work", "Wahi magnet 0° se 60° tak. Work?",
 "W = mB(1 − cos60°) = 0.1 × 0.5 = ⟨0⟩ J."),
("Magnet jaisa solenoid", "Solenoid: 2000 turns, area 2 cm², current 1.5 A. Magnetic moment?",
 "m = NIA = 2000 × 1.5 × 2 × 10⁻⁴ = ⟨0⟩ A m²."),
("Curie's law", "Paramagnet ka χ = 2.8 × 10⁻⁴ 300 K par. 400 K par χ?",
 "χ ∝ 1/T: 2.8 × 10⁻⁴ × 300/400 = ⟨0⟩."),
("Oscillating magnet", "I = 10⁻⁴ kg m², m = 0.5 A m², B = 0.4 T. Chhote oscillations ka period?",
 "T = 2π√(10⁻⁴/(0.5 × 0.4)) ≈ ⟨0⟩ s."),
],
topics=[
("Bar magnet as an equivalent solenoid", "Bar magnet aur solenoid ki field lines bahar se bilkul ek jaisi dikhti hain. Magnet ko aadha kaato to do chhote magnets bante hain — isolated magnetic poles (monopoles) exist nahi karte, electric charges ki tarah nahi."),
("Magnetic field lines", "Closed loops banati hain (bahar N → S, andar S → N), kabhi nahi kaat-ti, aur strong field mein ghani hoti hain. Gauss's law for magnetism: kisi bhi closed surface se net flux zero."),
("Dipole in a uniform field", "m B ke saath ho to stable equilibrium (minimum energy), ulta ho to unstable. Torque m ko B ke saath align karne ki koshish karta hai — compass isi se kaam karta hai."),
("Diamagnetic substances", "Halka repel hote hain, strong se weak field ki taraf jaate hain; χ chhota negative (≈ −10⁻⁵). Examples: bismuth, copper, lead, paani, nitrogen gas. Superconductors perfect diamagnets hain (Meissner effect)."),
("Paramagnetic substances", "Halka attract hote hain, weak se strong field ki taraf; atoms ke permanent moments thode align hote hain. Examples: aluminium, sodium, calcium, oxygen gas, copper chloride. Temperature badhne par χ ghatta hai."),
("Ferromagnetic substances", "Zor se attract; domains aasaani se align hote hain. Examples: iron, cobalt, nickel, gadolinium. Curie temperature (Fe ≈ 1043 K) ke upar paramagnetic ban jaate hain. Soft iron (aasaani se magnetise/demagnetise) electromagnets aur transformer cores mein; steel permanent magnets ke liye."),
("Syllabus note", "Earth's magnetism (dip, declination, horizontal component) current NTA syllabus se hata diya gaya hai. Dipole fields, torque aur energy, aur teen tarah ke materials aur temperature ka effect padho."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
