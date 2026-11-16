from lib import F, X, T, sig, fx, _check_and_write
import math

e1 = math.asin(math.sin(math.radians(150)))   # = π/6 → 30°
e2 = math.atan(1/2) + math.atan(1/3)
assert abs(e2 - math.pi/4) < 1e-12
e3 = math.cos(math.atan(3/4))
e4 = math.asin(math.sin(2 * math.pi / 3 * 2))  # sin⁻¹(sin 4π/3) = −π/3
assert abs(e4 + math.pi/3) < 1e-12
e5 = math.atan(1) + math.atan(2) + math.atan(3)
assert abs(e5 - math.pi) < 1e-12

DOC = {
"slug": "inverse-trigonometric-functions", "subject": "Mathematics",
"chapters": {"JEE": "Inverse Trigonometric Functions"},
"title": "Inverse Trigonometric Functions", "readMinutes": 12,
"summary": [
"Trigonometric functions are not one-one, so their inverses are defined on restricted intervals called principal value branches.",
"sin⁻¹x and tan⁻¹x take values in [−π/2, π/2] (tan⁻¹ open); cos⁻¹x and cot⁻¹x in [0, π]. Know each domain and range exactly.",
"Key identities: sin⁻¹x + cos⁻¹x = π/2, tan⁻¹x + tan⁻¹y = tan⁻¹((x + y)/(1 − xy)) when xy < 1, and the 2tan⁻¹x conversions.",
"Most JEE questions test sin⁻¹(sin x)-type expressions outside the principal branch — draw the graph or shift by π.",
],
"formulas": [
F("Domains and ranges", "sin⁻¹: [−1, 1] → [−π/2, π/2];  cos⁻¹: [−1, 1] → [0, π];  tan⁻¹: ℝ → (−π/2, π/2);  cot⁻¹: ℝ → (0, π);  sec⁻¹: |x| ≥ 1 → [0, π] − {π/2};  cosec⁻¹: |x| ≥ 1 → [−π/2, π/2] − {0}", "Principal value branches.", None, tag="PYQ favourite"),
F("Negative arguments", "sin⁻¹(−x) = −sin⁻¹x;  tan⁻¹(−x) = −tan⁻¹x;  cosec⁻¹(−x) = −cosec⁻¹x;  cos⁻¹(−x) = π − cos⁻¹x;  cot⁻¹(−x) = π − cot⁻¹x;  sec⁻¹(−x) = π − sec⁻¹x", "Odd vs 'π minus' functions."),
F("Complementary pairs", "sin⁻¹x + cos⁻¹x = π/2;  tan⁻¹x + cot⁻¹x = π/2;  sec⁻¹x + cosec⁻¹x = π/2", "Sum to π/2.", None, tag="PYQ favourite"),
F("Reciprocal relations", "sin⁻¹(1/x) = cosec⁻¹x;  cos⁻¹(1/x) = sec⁻¹x;  tan⁻¹(1/x) = cot⁻¹x (x > 0), = cot⁻¹x − π (x < 0)", "Switching between functions."),
F("Sum of tan⁻¹", "tan⁻¹x + tan⁻¹y = tan⁻¹((x + y)/(1 − xy)) if xy < 1;  = π + tan⁻¹((x + y)/(1 − xy)) if x, y > 0 and xy > 1", "Adding inverse tangents.", "Check xy < 1 before using the plain formula.", tag="PYQ favourite"),
F("Difference of tan⁻¹", "tan⁻¹x − tan⁻¹y = tan⁻¹((x − y)/(1 + xy))  (xy > −1)", "Telescoping series."),
F("Double formulas", "2tan⁻¹x = sin⁻¹(2x/(1 + x²)) (|x| ≤ 1) = cos⁻¹((1 − x²)/(1 + x²)) (x ≥ 0) = tan⁻¹(2x/(1 − x²)) (|x| < 1)", "Substitution x = tan θ."),
F("sin⁻¹(sin x) outside branch", "sin⁻¹(sin x) = x on [−π/2, π/2];  = π − x on [π/2, 3π/2];  = x − 2π on [3π/2, 5π/2]", "Graph is a zig-zag (triangular wave)."),
F("cos⁻¹(cos x) outside branch", "cos⁻¹(cos x) = x on [0, π];  = 2π − x on [π, 2π]", "Graph is a zig-zag starting at the origin."),
F("Converting one function to another", "sin⁻¹x = cos⁻¹√(1 − x²) = tan⁻¹(x/√(1 − x²)) for 0 ≤ x < 1", "Draw a right triangle with opposite x, hypotenuse 1."),
F("Telescoping trick", "tan⁻¹(1/(1 + r(r + 1))) = tan⁻¹(r + 1) − tan⁻¹r", "Sums of inverse tangents.", None, tag="PYQ favourite"),
],
"examples": [
X("Principal value", "Find sin⁻¹(sin 150°).",
  f"150° is outside [−90°, 90°]; sin 150° = sin 30°, so the answer is 30° = π/6 (computed {fx(math.degrees(e1))}°).", [(fx(math.degrees(e1)), "30")]),
X("Sum of tan⁻¹", "Evaluate tan⁻¹(1/2) + tan⁻¹(1/3).",
  "xy = 1/6 < 1 ⇒ tan⁻¹((1/2 + 1/3)/(1 − 1/6)) = tan⁻¹(1) = π/4.", []),
X("cos(tan⁻¹ ¾)", "Find cos(tan⁻¹(3/4)).",
  f"Triangle with opposite 3, adjacent 4, hypotenuse 5 ⇒ cos = 4/5 = {fx(e3, 1)}.", [(fx(e3, 1), "0.8")]),
X("Outside the branch", "Find sin⁻¹(sin(4π/3)).",
  "4π/3 lies in [π/2, 3π/2], so sin⁻¹(sin x) = π − x = π − 4π/3 = −π/3.", []),
X("Sum equals π", "Show tan⁻¹1 + tan⁻¹2 + tan⁻¹3 = π.",
  "tan⁻¹2 + tan⁻¹3 = π + tan⁻¹((2 + 3)/(1 − 6)) = π + tan⁻¹(−1) = π − π/4 (since xy > 1). Adding tan⁻¹1 = π/4 gives π.", []),
X("Telescoping sum", "Find Σ (r = 1 to n) tan⁻¹(1/(1 + r + r²)).",
  "Each term = tan⁻¹(r + 1) − tan⁻¹r, so the sum telescopes to tan⁻¹(n + 1) − tan⁻¹1 = tan⁻¹(n + 1) − π/4.", []),
],
"topics": [
T("Why branches are needed", "A function has an inverse only if it is one-one and onto. Restricting sin x to [−π/2, π/2] makes it a bijection onto [−1, 1]; other branches like [π/2, 3π/2] are possible but the principal branch is standard."),
T("Graphs", "y = sin⁻¹x rises from (−1, −π/2) to (1, π/2); y = cos⁻¹x falls from (−1, π) to (1, 0); y = tan⁻¹x has horizontal asymptotes y = ±π/2. Graph of f⁻¹ is the reflection of f in y = x."),
T("sin(sin⁻¹x) vs sin⁻¹(sin x)", "sin(sin⁻¹x) = x for all x in [−1, 1] (always true in its domain). sin⁻¹(sin x) = x only when x is in the principal branch."),
T("Substitution technique", "Expressions like √(1 − x²), (1 − x²)/(1 + x²), 2x/(1 − x²) suggest x = sin θ, cos θ or tan θ; then simplify and convert back, keeping track of the branch."),
T("Solving equations", "Convert everything to one inverse function, use identities, then take sin, cos or tan of both sides. Always check that the final answers lie in the domains."),
T("Common traps", "tan⁻¹x + tan⁻¹(1/x) = π/2 only for x > 0 (it is −π/2 for x < 0). cos⁻¹x is never negative. sec⁻¹ and cosec⁻¹ are undefined for |x| < 1. Writing sin⁻¹x as 1/sin x is wrong — it is an inverse, not a reciprocal."),
],
"ratta": [
"sin⁻¹, tan⁻¹ → [−π/2, π/2];  cos⁻¹, cot⁻¹ → [0, π].",
"sin⁻¹x + cos⁻¹x = π/2.",
"cos⁻¹(−x) = π − cos⁻¹x;  sin⁻¹(−x) = −sin⁻¹x.",
"tan⁻¹x + tan⁻¹y = tan⁻¹((x + y)/(1 − xy)), xy < 1.",
"tan⁻¹1 + tan⁻¹2 + tan⁻¹3 = π.",
"2tan⁻¹x = sin⁻¹(2x/(1 + x²)).",
],
}

SYLLABUS = [
("Inverse trigonometric functions and their properties", ["inverse", "principal value", "domain", "range"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Trigonometric functions one-one nahi hain, isliye unke inverse restricted intervals par define hote hain jinhe principal value branches kehte hain.",
"sin⁻¹x aur tan⁻¹x ki values [−π/2, π/2] mein (tan⁻¹ ke liye open); cos⁻¹x aur cot⁻¹x ki [0, π] mein. Har ek ka domain aur range bilkul theek yaad rakho.",
"Key identities: sin⁻¹x + cos⁻¹x = π/2, tan⁻¹x + tan⁻¹y = tan⁻¹((x + y)/(1 − xy)) jab xy < 1, aur 2tan⁻¹x wale conversions.",
"Zyadatar JEE sawal principal branch ke bahar sin⁻¹(sin x) type expressions test karte hain — graph banao ya π se shift karo.",
],
when=[
("Principal value branches.", None),
("Odd vs 'π minus' functions.", None),
("π/2 tak ka sum.", None),
("Functions badalna.", None),
("Inverse tangents jodna.", "Plain formula lagaane se pehle xy < 1 check karo."),
("Telescoping series.", None),
("Substitution x = tan θ.", None),
("Graph zig-zag (triangular wave) hai.", None),
("Graph origin se shuru hone wala zig-zag.", None),
("Right triangle banao: opposite x, hypotenuse 1.", None),
("Inverse tangents ke sums.", None),
],
examples=[
("Principal value", "sin⁻¹(sin 150°) nikalo.",
 "150°, [−90°, 90°] ke bahar hai; sin 150° = sin 30°, isliye answer 30° = π/6 (computed ⟨0⟩°)."),
("tan⁻¹ ka sum", "tan⁻¹(1/2) + tan⁻¹(1/3) nikalo.",
 "xy = 1/6 < 1 ⇒ tan⁻¹((1/2 + 1/3)/(1 − 1/6)) = tan⁻¹(1) = π/4."),
("cos(tan⁻¹ ¾)", "cos(tan⁻¹(3/4)) nikalo.",
 "Triangle: opposite 3, adjacent 4, hypotenuse 5 ⇒ cos = 4/5 = ⟨0⟩."),
("Branch ke bahar", "sin⁻¹(sin(4π/3)) nikalo.",
 "4π/3, [π/2, 3π/2] mein hai, isliye sin⁻¹(sin x) = π − x = π − 4π/3 = −π/3."),
("Sum π ke barabar", "Dikhao tan⁻¹1 + tan⁻¹2 + tan⁻¹3 = π.",
 "tan⁻¹2 + tan⁻¹3 = π + tan⁻¹((2 + 3)/(1 − 6)) = π + tan⁻¹(−1) = π − π/4 (kyunki xy > 1). tan⁻¹1 = π/4 jodne par π."),
("Telescoping sum", "Σ (r = 1 se n) tan⁻¹(1/(1 + r + r²)) nikalo.",
 "Har term = tan⁻¹(r + 1) − tan⁻¹r, isliye sum telescope hokar tan⁻¹(n + 1) − tan⁻¹1 = tan⁻¹(n + 1) − π/4."),
],
topics=[
("Why branches are needed", "Function ka inverse tabhi hota hai jab wo one-one aur onto ho. sin x ko [−π/2, π/2] tak restrict karne se wo [−1, 1] par bijection ban jaata hai; [π/2, 3π/2] jaisi doosri branches bhi sambhav hain par principal branch standard hai."),
("Graphs", "y = sin⁻¹x (−1, −π/2) se (1, π/2) tak badhta hai; y = cos⁻¹x (−1, π) se (1, 0) tak girta hai; y = tan⁻¹x ke horizontal asymptotes y = ±π/2. f⁻¹ ka graph y = x mein f ka reflection hai."),
("sin(sin⁻¹x) vs sin⁻¹(sin x)", "sin(sin⁻¹x) = x, [−1, 1] ke har x ke liye (domain mein hamesha sach). sin⁻¹(sin x) = x sirf tab jab x principal branch mein ho."),
("Substitution technique", "√(1 − x²), (1 − x²)/(1 + x²), 2x/(1 − x²) jaise expressions x = sin θ, cos θ ya tan θ ka ishaara dete hain; simplify karke waapas badlo, branch ka dhyan rakhte hue."),
("Solving equations", "Sab kuch ek inverse function mein badlo, identities use karo, phir dono taraf sin, cos ya tan lo. Aakhri answers domain mein hain ya nahi, hamesha check karo."),
("Common traps", "tan⁻¹x + tan⁻¹(1/x) = π/2 sirf x > 0 ke liye (x < 0 ke liye −π/2). cos⁻¹x kabhi negative nahi. |x| < 1 ke liye sec⁻¹ aur cosec⁻¹ undefined. sin⁻¹x ko 1/sin x likhna galat hai — ye inverse hai, reciprocal nahi."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
