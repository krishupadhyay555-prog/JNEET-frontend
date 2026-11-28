"""Experimental Skills (Physics) for NEET + JEE Main, and Practical Chemistry for JEE Main.

  python3 tools/bank/b4_experimental.py

Writes backend/seed/questions/physics-experimental-skills.json (NEET + JEE) and
backend/seed/questions/chemistry-jee-practical.json (JEE copies of the NEET Practical
Chemistry questions; both exams list the same practical-chemistry unit since 2024).
Numericals are computed below; options must be distinct; anything already in the bank
for that exam is dropped. 28 Nov 2026.
"""
import json, os, sys
from math import pi, sin, radians, sqrt
sys.path.insert(0, os.path.dirname(__file__))
import qlib
from qlib import mcq, sig
from audit_bank import mn, ROOT

P, CH = "Physics", "Experimental Skills"
def Q(cat, diff, text, correct, wrongs, expl):
    mcq("BOTH", P, CH, cat, diff, text, correct, wrongs, expl)

def f2(x, d=2):
    s = f"{x:.{d}f}"
    return s.rstrip("0").rstrip(".") if "." in s else s

# ── length instruments ────────────────────────────────────────────────
Q("formula", "easy", "In a vernier callipers, 20 vernier divisions coincide with 19 main-scale divisions of 1 mm each. The least count is",
  "0.05 mm", ["0.1 mm", "0.5 mm", "0.95 mm"], "LC = 1 MSD − 1 VSD = 1 − 19/20 = 1/20 mm = 0.05 mm.")
Q("tough", "moderate", "A vernier callipers (LC 0.01 cm) has a positive zero error of 0.03 cm. While measuring a rod, the main-scale reading is 2.5 cm and the 7th vernier division coincides. The correct length is",
  "2.54 cm", ["2.57 cm", "2.60 cm", "2.50 cm"], "Observed = 2.5 + 7 × 0.01 = 2.57 cm. Correct = observed − zero error = 2.57 − 0.03 = 2.54 cm.")
Q("tough", "tough", "A screw gauge has pitch 1 mm and 100 circular divisions. With the studs touching, the zero of the circular scale is 3 divisions ABOVE the reference line. For a wire, the main-scale reading is 4 mm and the circular-scale reading is 52. The diameter of the wire is",
  "4.55 mm", ["4.49 mm", "4.52 mm", "4.58 mm"], "LC = 1/100 = 0.01 mm. Zero above the line means a negative zero error of −0.03 mm. Observed = 4 + 52 × 0.01 = 4.52 mm. Correct = 4.52 − (−0.03) = 4.55 mm.")
Q("concept", "easy", "The depth of a beaker is measured with a vernier callipers using its",
  "thin strip (depth rod) at the end of the main scale", ["outer jaws", "inner jaws", "ratchet"], "Outer jaws give the external diameter, inner jaws the internal diameter, and the sliding strip at the end gives depth. A ratchet belongs to a screw gauge.")
Q("concept", "moderate", "In a screw gauge the screw is always turned in one direction near the final reading. This avoids",
  "backlash error", ["parallax error", "zero error", "end error"], "Wear in the threads lets the screw turn a little without moving the spindle when the direction is reversed — the backlash error.")

# ── simple pendulum, moments ──────────────────────────────────────────
Q("concept", "moderate", "To study the dissipation of energy of a simple pendulum, a student plots the square of the amplitude (A²) against time t. The graph obtained is",
  "a curve that decreases with time (energy ∝ A² dies out)", ["a straight line rising with time", "a horizontal line", "a curve that increases with time"],
  "Damping makes A fall with time and energy ∝ A², so A² keeps decreasing (exponentially for linear damping). ln A against t would be the straight line.")
Q("concept", "easy", "For small oscillations, the time period of a simple pendulum",
  "does not depend on the amplitude", ["increases with amplitude", "decreases as the amplitude dies out", "depends on the mass of the bob"],
  "T = 2π√(l/g) for small amplitudes, independent of amplitude and mass. So T stays the same while the amplitude decays.")
m6 = 200 * (80 - 50) / (50 - 10)
Q("formula", "easy", "A uniform metre scale balances at its 50 cm mark. A 200 g mass hangs at the 80 cm mark. To keep it balanced, the mass that must hang at the 10 cm mark is",
  f"{f2(m6)} g", ["200 g", "100 g", f"{f2(200 * 30 / 10)} g"], f"Moments about 50 cm: m × 40 = 200 × 30 ⇒ m = {f2(m6)} g.")
m7 = 100 * (50 - 40) / (40 - 10)
Q("tough", "tough", "A uniform metre scale of mass 100 g is balanced on a knife edge at the 40 cm mark by hanging a mass m at the 10 cm mark. The value of m is about",
  f"{m7:.1f} g", ["100 g", "50 g", "25 g"], f"The scale's weight acts at 50 cm, 10 cm from the pivot; m acts 30 cm from it. m × 30 = 100 × 10 ⇒ m ≈ {m7:.1f} g.")

# ── Young's modulus, surface tension, viscosity ───────────────────────
Y9 = 4 * 9.8 * 1.5 / (pi * (0.3e-3) ** 2 * 1.0e-3)
Q("formula", "moderate", "In Searle's experiment a wire 1.5 m long and 0.6 mm in diameter stretches by 1.0 mm under a 4 kg load (g = 9.8 m/s²). Young's modulus of the wire is about",
  f"{sig(Y9, 2)} N/m²", [f"{sig(Y9 / 4, 2)} N/m²", f"{sig(Y9 * 4, 2)} N/m²", f"{sig(Y9 / 10, 2)} N/m²"],
  f"r = 0.3 mm. Y = MgL/(πr²Δl) = 4 × 9.8 × 1.5/(π × (0.3 × 10⁻³)² × 10⁻³) ≈ {sig(Y9, 2)} N/m². Using the diameter as radius gives a value 4 times too small.")
Q("concept", "moderate", "In Searle's apparatus a second (reference) wire hangs from the same support. Its purpose is to",
  "cancel the effect of temperature change and sagging of the support", ["double the load on the experimental wire", "measure the diameter of the wire", "reduce the extension to half"],
  "Both wires change equally with temperature and yielding of the support, so the spirit level/micrometer reads only the extra stretch due to the load.")
Q("formula", "moderate", "In Searle's experiment the graph of extension Δl (y-axis) against load M (x-axis) has slope s. For a wire of length L and radius r, Young's modulus is",
  "gL/(πr²s)", ["gLs/(πr²)", "πr²s/(gL)", "gL/(2πrs)"], "Y = MgL/(πr²Δl) and Δl/M = s, so Y = gL/(πr² s).")
Q("concept", "easy", "If the radius of a capillary tube is halved, the height to which water rises in it becomes",
  "double", ["half", "four times", "unchanged"], "h = 2T cos θ/(rρg), so h ∝ 1/r.")
Q("concept", "easy", "A little detergent is added to water in the capillary-rise experiment. The height of water in the capillary",
  "decreases, because detergent lowers surface tension", ["increases, because detergent raises surface tension", "stays the same", "becomes negative (depression)"],
  "Detergent molecules collect at the surface and reduce surface tension; since h ∝ T, the rise is smaller.")
h13 = 2 * 0.07 / (0.2e-3 * 1000 * 9.8) * 100
Q("formula", "moderate", "Water (surface tension 0.07 N/m, angle of contact 0) rises in a glass capillary of radius 0.2 mm. The capillary rise is about (g = 9.8 m/s²)",
  f"{h13:.1f} cm", [f"{h13 / 2:.1f} cm", f"{h13 * 2:.1f} cm", f"{h13 / 10:.2f} cm"], f"h = 2T/(rρg) = 0.14/(0.2 × 10⁻³ × 1000 × 9.8) ≈ {h13 / 100:.4f} m ≈ {h13:.1f} cm.")
Q("concept", "easy", "In the falling-ball experiment, if the radius of the steel ball is doubled, its terminal velocity in the same liquid becomes",
  "four times", ["two times", "half", "eight times"], "v_t = 2r²(ρ − σ)g/(9η), so v_t ∝ r².")
v15 = 2 * (2e-3) ** 2 * (7800 - 1260) * 9.8 / (9 * 1.5) * 100
Q("formula", "tough", "A steel ball of radius 2 mm (density 7800 kg/m³) falls through glycerine (density 1260 kg/m³, η = 1.5 Pa s). Its terminal velocity is about (g = 9.8 m/s²)",
  f"{v15:.1f} cm/s", [f"{v15 / 2:.1f} cm/s", f"{v15 * 2:.1f} cm/s", f"{2 * (2e-3) ** 2 * 7800 * 9.8 / (9 * 1.5) * 100:.1f} cm/s"],
  f"v = 2r²(ρ − σ)g/(9η) = 2 × 4 × 10⁻⁶ × 6540 × 9.8/(9 × 1.5) ≈ {v15 / 100:.3f} m/s ≈ {v15:.1f} cm/s. Forgetting the buoyancy term (σ) gives the last option.")
Q("concept", "moderate", "In the viscosity experiment, the time of fall is measured between two marks well below the liquid surface because",
  "the ball must first reach terminal velocity", ["the liquid is hotter near the surface", "surface tension stops the ball at the top", "the ball speeds up near the bottom"],
  "Near the surface the ball is still accelerating; only after viscous drag + buoyancy balance its weight does it move at constant (terminal) speed.")

# ── resonance tube, method of mixtures ────────────────────────────────
v16 = 2 * 340 * (0.74 - 0.24)
Q("formula", "moderate", "In a resonance-tube experiment with a 340 Hz tuning fork, the first and second resonances occur at 24 cm and 74 cm. The speed of sound is",
  f"{f2(v16)} m/s", [f"{f2(4 * 340 * 0.24)} m/s", f"{f2(340 * 0.5)} m/s", f"{f2(4 * 340 * 0.74)} m/s"], f"v = 2f(l₂ − l₁) = 2 × 340 × 0.50 = {f2(v16)} m/s.")
e16 = (74 - 3 * 24) / 2
Q("formula", "tough", "In a resonance tube the first and second resonance lengths are 24 cm and 74 cm. The end correction is",
  f"{f2(e16)} cm", ["2 cm", "0.5 cm", "3 cm"], f"l₁ + e = λ/4 and l₂ + e = 3λ/4 ⇒ e = (l₂ − 3l₁)/2 = (74 − 72)/2 = {f2(e16)} cm.")
Q("concept", "moderate", "The end correction of a resonance tube of internal diameter d is about",
  "0.3d", ["0.6d", "d", "3d"], "e ≈ 0.6 × radius = 0.3 × diameter.")
v18 = 4 * 500 * 0.17
Q("formula", "easy", "Neglecting end correction, a 500 Hz fork gives its first resonance in a resonance tube at 17 cm. The speed of sound is",
  f"{f2(v18)} m/s", [f"{f2(2 * 500 * 0.17)} m/s", f"{f2(500 * 0.17)} m/s", f"{f2(4 * 500 * 0.17 * 2)} m/s"], f"First resonance: l = λ/4 ⇒ λ = 68 cm, v = fλ = 500 × 0.68 = {f2(v18)} m/s.")
s19 = 100 * 1 * (30 - 25) / (50 * (150 - 30))
Q("formula", "moderate", "50 g of a metal at 150 °C is dropped into 100 g of water at 25 °C. The final temperature is 30 °C. Ignoring the calorimeter, the specific heat of the metal is about",
  f"{s19:.3f} cal g⁻¹ °C⁻¹", [f"{100 * 5 / (50 * 150):.3f} cal g⁻¹ °C⁻¹", f"{50 * 120 / (100 * 5) / 100:.2f} cal g⁻¹ °C⁻¹", f"{100 * 5 / (50 * 125):.2f} cal g⁻¹ °C⁻¹"],
  f"Heat lost = heat gained: 50 × s × (150 − 30) = 100 × 1 × (30 − 25) ⇒ s = 500/6000 ≈ {s19:.3f} cal g⁻¹ °C⁻¹.")
Q("concept", "moderate", "In the method-of-mixtures experiment the calorimeter is polished and kept in a lagged (insulated) jacket mainly to",
  "reduce heat lost to the surroundings by radiation and conduction", ["increase the specific heat of water", "make the solid cool faster", "remove the need to stir"],
  "Any heat lost to the surroundings is not counted as 'heat gained', making the measured specific heat wrong; polishing cuts radiation, lagging cuts conduction/convection.")

# ── metre bridge, Ohm's law, galvanometer ─────────────────────────────
X21 = 10 * 60 / 40
Q("formula", "moderate", "In a metre bridge the unknown resistance X is in the left gap and 10 Ω in the right gap. The null point is 60 cm from the left end. X is",
  f"{f2(X21)} Ω", [f"{f2(10 * 40 / 60)} Ω", "10 Ω", "6 Ω"], f"X/R = l/(100 − l) ⇒ X = 10 × 60/40 = {f2(X21)} Ω.")
rho23 = 2 * pi * (0.25e-3) ** 2 / 0.5
Q("formula", "tough", "A metre bridge gives the resistance of a 0.5 m wire of diameter 0.5 mm as 2 Ω. The resistivity of its material is about",
  f"{sig(rho23, 2)} Ω m", [f"{sig(rho23 * 4, 2)} Ω m", f"{sig(rho23 / 2, 2)} Ω m", f"{sig(rho23 * 0.5 * 0.5, 2)} Ω m"],
  f"ρ = RA/L = 2 × π × (0.25 × 10⁻³)²/0.5 ≈ {sig(rho23, 2)} Ω m. Using the diameter as radius gives 4 times the value.")
Q("concept", "moderate", "In a metre bridge experiment the null point is obtained near the middle of the wire and the resistances are then interchanged. This is done to",
  "increase sensitivity and cancel the end error", ["increase the current in the galvanometer", "heat the wire evenly", "remove the need for a jockey"],
  "Near the middle the percentage error in l and 100 − l is smallest; interchanging X and R and averaging removes the end resistance at the metal strips.")
Q("concept", "easy", "In the Ohm's law experiment, current I is plotted on the y-axis and potential difference V on the x-axis. The slope of the straight line equals",
  "1/R", ["R", "R²", "V·I"], "I = V/R, so the slope of I against V is 1/R (slope of V against I would be R).")
G25 = 4000 * 40 / (4000 - 40)
Q("formula", "moderate", "In the half-deflection method, with a series resistance of 4000 Ω, a shunt of 40 Ω across the galvanometer halves the deflection. The galvanometer resistance is about",
  f"{G25:.1f} Ω", ["40 Ω", "80 Ω", f"{4000 * 40 / 4040:.1f} Ω"], f"G = RS/(R − S) = 4000 × 40/3960 ≈ {G25:.1f} Ω (close to S because R ≫ G).")
k26 = 3 / ((9950 + 50) * 30)
Q("formula", "tough", "A galvanometer of resistance 50 Ω in series with 9950 Ω and a 3 V cell (negligible internal resistance) shows 30 divisions. Its figure of merit is",
  f"{sig(k26, 1)} A/div", [f"{sig(k26 * 10, 1)} A/div", f"{sig(1 / k26, 1)} div/A", f"{sig(k26 / 10, 1)} A/div"],
  f"I = 3/10000 = 3 × 10⁻⁴ A. Figure of merit = I/θ = 3 × 10⁻⁴/30 = {sig(k26, 1)} A per division.")

# ── optics ────────────────────────────────────────────────────────────
Q("concept", "moderate", "To find the focal length of a convex mirror by the parallax method, an extra convex lens is used because",
  "a convex mirror alone forms only virtual images, which cannot be located on a needle directly", ["a convex mirror has no focal length", "the lens increases the brightness of the image", "the mirror must be placed at the focus of the lens"],
  "The lens first forms a real image; the convex mirror is placed so that this image acts as its (virtual) object, and the rays retrace their path.")
Q("formula", "moderate", "In a concave-mirror experiment the object needle is at 30 cm and the image needle at 60 cm in front of the mirror (no parallax). The focal length is",
  "20 cm", ["45 cm", "90 cm", "30 cm"], "With sign convention u = −30 cm, v = −60 cm: 1/f = 1/v + 1/u = −1/60 − 1/30 = −1/20, so f = −20 cm (focal length 20 cm).")
Q("concept", "moderate", "For a convex lens, a graph of 1/v (y-axis) against 1/u (x-axis, with sign convention) is",
  "a straight line of slope +1 with y-intercept 1/f", ["a rectangular hyperbola", "a parabola through the origin", "a straight line of slope −1 through the origin"],
  "1/v = 1/u + 1/f is a straight line of slope 1; its y-intercept is 1/f (and its x-intercept is −1/f).")
Q("concept", "easy", "The graph of angle of deviation δ against angle of incidence i for a prism is",
  "U-shaped, with a minimum at δm", ["a straight line through the origin", "a straight line parallel to the i-axis", "an increasing curve with no minimum"],
  "δ first decreases as i increases, reaches the minimum deviation δm (when i = e) and then increases again.")
mu31 = sin(radians(45)) / sin(radians(30))
Q("formula", "moderate", "For a 60° prism the minimum deviation from the i–δ graph is 30°. The refractive index of the prism is",
  f"{mu31:.3f}", [f"{sin(radians(30)) / sin(radians(60)):.3f}", "1.5", f"{sqrt(3):.3f}"], f"μ = sin((A + δm)/2)/sin(A/2) = sin 45°/sin 30° = √2 ≈ {mu31:.3f}.")
mu32 = (5.400 - 3.000) / (5.400 - 3.800)
Q("formula", "moderate", "Travelling-microscope readings: mark without the slab 3.000 cm, mark seen through the slab 3.800 cm, top surface of the slab 5.400 cm. The refractive index of the glass is",
  f"{f2(mu32)}", [f"{f2(1 / mu32, 3)}", f"{f2(5.4 / 3.8, 2)}", f"{f2(3.8 / 3.0, 2)}"],
  f"Real thickness = 5.400 − 3.000 = 2.400 cm; apparent = 5.400 − 3.800 = 1.600 cm. μ = 2.4/1.6 = {f2(mu32)}.")
Q("concept", "moderate", "In the travelling-microscope method for a glass slab, lycopodium powder is sprinkled on the top surface so that",
  "the top surface can be focused clearly", ["the slab does not slip", "light is reflected back into the slab", "the apparent depth increases"],
  "A clean glass surface is hard to focus on; the fine powder gives a sharp mark to read the top surface (R₃).")

# ── electronics ───────────────────────────────────────────────────────
Q("concept", "easy", "A Zener diode used as a voltage regulator works in",
  "reverse bias, in the breakdown region", ["forward bias, below the knee voltage", "forward bias, above the knee voltage", "reverse bias, below breakdown"],
  "After reverse breakdown the Zener voltage stays nearly constant over a wide range of current — that is what regulates the output.")
Q("concept", "easy", "The forward characteristic of a silicon p-n junction diode shows a sharp rise in current after about",
  "0.7 V", ["0.3 V", "7 V", "0.07 V"], "The knee (cut-in) voltage is about 0.7 V for Si and 0.3 V for Ge.")
r37 = 0.1 / 20e-3
Q("formula", "moderate", "On the forward characteristic of a diode, increasing the voltage from 0.70 V to 0.80 V raises the current from 10 mA to 30 mA. The dynamic resistance in this region is",
  f"{f2(r37)} Ω", ["20 Ω", "0.5 Ω", "40 Ω"], f"r_d = ΔV/ΔI = 0.10 V/0.020 A = {f2(r37)} Ω.")
Q("concept", "moderate", "When the two leads of an unknown component are touched to a multimeter (resistance range), the needle first deflects and then slowly returns to zero (infinite resistance). The component is a",
  "capacitor", ["resistor", "diode", "LED"], "The capacitor draws a charging current that dies out; once charged no steady current flows.")
Q("concept", "easy", "An unknown component conducts only when connected one way and also glows. It is a",
  "light emitting diode (LED)", ["resistor", "capacitor", "ordinary p-n junction diode"], "An LED is a diode: it conducts in forward bias only and emits light when it conducts.")
Q("concept", "easy", "A component shows the same steady resistance reading whichever way it is connected to a multimeter. It is a",
  "resistor", ["diode", "LED", "capacitor"], "A resistor has no polarity and allows a steady current in both directions.")

# ── JEE Practical Chemistry: same unit as NEET since 2024 ─────────────
NEET_PRAC = []
for fn in sorted(os.listdir(ROOT)):
    if not fn.endswith(".json"): continue
    for q in json.load(open(os.path.join(ROOT, fn))):
        if q.get("examMode") == "NEET" and q.get("subject") == "Chemistry" and q.get("chapter") == "Practical Chemistry" \
           and (q.get("type") or "mcq") == "mcq" and (q.get("level") or "main") == "main":
            NEET_PRAC.append(q)

def write():
    bank = {"NEET": set(), "JEE": set()}
    for fn in os.listdir(ROOT):
        if fn.endswith(".json") and fn not in ("physics-experimental-skills.json", "chemistry-jee-practical.json"):
            for q in json.load(open(os.path.join(ROOT, fn))):
                bank[q["examMode"]].add(mn(q["questionText"]))
    phys, seen = [], set()
    for q in qlib.OUT:
        q = dict(q); q.pop("_cat", None)
        k = (q["examMode"], mn(q["questionText"]))
        assert k not in seen, q["questionText"][:80]; seen.add(k)
        if k[1] in bank[q["examMode"]]: continue
        phys.append(q)
    jee = []
    for q in NEET_PRAC:
        k = mn(q["questionText"])
        if k in bank["JEE"] or ("JEE", k) in seen: continue
        seen.add(("JEE", k))
        jee.append({**{a: b for a, b in q.items() if a != "_id"}, "examMode": "JEE"})
    for fn, qs in (("physics-experimental-skills.json", phys), ("chemistry-jee-practical.json", jee)):
        with open(os.path.join(ROOT, fn), "w") as fh:
            fh.write(json.dumps(qs, indent=2, ensure_ascii=False) + "\n")
        print(f"✓ {fn}: {len(qs)} questions")

if __name__ == "__main__":
    write()
