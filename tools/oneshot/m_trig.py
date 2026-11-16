from lib import F, X, T, sig, fx, _check_and_write
import math

v1 = math.sin(math.radians(75))
v1s = (math.sqrt(6) + math.sqrt(2)) / 4
assert abs(v1 - v1s) < 1e-12
v2 = math.cos(math.radians(20)) * math.cos(math.radians(40)) * math.cos(math.radians(80))
assert abs(v2 - 0.125) < 1e-12
v3 = math.tan(math.radians(20)) * math.tan(math.radians(40)) * math.tan(math.radians(80))
assert abs(v3 - math.sqrt(3)) < 1e-12
mx = math.sqrt(3 ** 2 + 4 ** 2)
v5 = math.sin(math.radians(10)) * math.sin(math.radians(50)) * math.sin(math.radians(70))
assert abs(v5 - 0.125) < 1e-12

DOC = {
"slug": "trigonometric-functions-and-equations", "subject": "Mathematics",
"chapters": {"JEE": "Trigonometric Functions and Equations"},
"title": "Trigonometric Functions and Equations", "readMinutes": 17,
"summary": [
"Angles are measured in degrees or radians (π rad = 180°). The six trigonometric functions are defined on the unit circle; their signs follow ASTC (All, Sin, Tan, Cos positive in quadrants I–IV).",
"Identities — compound angle, multiple and sub-multiple angle, sum-to-product and product-to-sum — let you simplify any expression.",
"Trigonometric equations have general solutions: sin θ = sin α ⇒ θ = nπ + (−1)ⁿα; cos θ = cos α ⇒ θ = 2nπ ± α; tan θ = tan α ⇒ θ = nπ + α.",
"The range of a sin θ + b cos θ is [−√(a² + b²), √(a² + b²)] — a JEE favourite for maximum/minimum questions.",
],
"formulas": [
F("Basic identities", "sin²θ + cos²θ = 1;  1 + tan²θ = sec²θ;  1 + cot²θ = cosec²θ", "Converting between functions."),
F("Compound angles", "sin(A ± B) = sin A cos B ± cos A sin B;  cos(A ± B) = cos A cos B ∓ sin A sin B;  tan(A ± B) = (tan A ± tan B)/(1 ∓ tan A tan B)", "Sum and difference of angles.", None, tag="PYQ favourite"),
F("Useful products", "sin(A + B) sin(A − B) = sin²A − sin²B;  cos(A + B) cos(A − B) = cos²A − sin²B", "Shortcuts for simplification."),
F("Double angle", "sin 2θ = 2 sin θ cos θ = 2 tan θ/(1 + tan²θ);  cos 2θ = cos²θ − sin²θ = 1 − 2sin²θ = 2cos²θ − 1 = (1 − tan²θ)/(1 + tan²θ);  tan 2θ = 2 tan θ/(1 − tan²θ)", "Multiple-angle simplification."),
F("Triple angle", "sin 3θ = 3 sin θ − 4 sin³θ;  cos 3θ = 4cos³θ − 3 cos θ;  tan 3θ = (3 tan θ − tan³θ)/(1 − 3tan²θ)", "Cubic expressions in sin, cos."),
F("Sum to product", "sin C + sin D = 2 sin((C + D)/2) cos((C − D)/2);  cos C + cos D = 2 cos((C + D)/2) cos((C − D)/2);  cos C − cos D = −2 sin((C + D)/2) sin((C − D)/2)", "Adding trig functions."),
F("Product of three", "sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ;  cos θ cos(60° − θ) cos(60° + θ) = ¼ cos 3θ;  tan θ tan(60° − θ) tan(60° + θ) = tan 3θ", "Standard product values.", None, tag="PYQ favourite"),
F("Range of a sin θ + b cos θ", "−√(a² + b²) ≤ a sin θ + b cos θ ≤ √(a² + b²)", "Maximum and minimum values.", None, tag="PYQ favourite"),
F("General solutions", "sin θ = 0 ⇒ θ = nπ;  cos θ = 0 ⇒ θ = (2n + 1)π/2;  sin θ = sin α ⇒ θ = nπ + (−1)ⁿα;  cos θ = cos α ⇒ θ = 2nπ ± α;  tan θ = tan α ⇒ θ = nπ + α;  sin²θ = sin²α ⇒ θ = nπ ± α", "Solving trigonometric equations (n ∈ ℤ).", "Squaring both sides can introduce extra roots — always check."),
F("Standard values", "sin 15° = (√6 − √2)/4;  sin 18° = (√5 − 1)/4;  cos 36° = (√5 + 1)/4;  tan 15° = 2 − √3;  tan 22.5° = √2 − 1", "Non-standard angles."),
F("Sine and cosine rules", "a/sin A = b/sin B = c/sin C = 2R;  cos A = (b² + c² − a²)/(2bc)", "Properties of triangles."),
F("Conditional identities (A + B + C = π)", "tan A + tan B + tan C = tan A tan B tan C;  sin 2A + sin 2B + sin 2C = 4 sin A sin B sin C", "Triangle identities."),
],
"examples": [
X("sin 75°", "Find sin 75°.",
  f"sin(45° + 30°) = (√3 + 1)/(2√2) = (√6 + √2)/4 ≈ {fx(v1, 4)}.", [(fx(v1, 4), "0.9659")]),
X("Product of cosines", "Evaluate cos 20° cos 40° cos 80°.",
  f"Using cos θ cos(60° − θ) cos(60° + θ) = ¼ cos 3θ with θ = 20°: ¼ cos 60° = 1/8 = {fx(v2, 3)}.", [(fx(v2, 3), "0.125")]),
X("Product of tangents", "Evaluate tan 20° tan 40° tan 80°.",
  f"tan θ tan(60° − θ) tan(60° + θ) = tan 3θ ⇒ tan 60° = √3 ≈ {fx(v3, 3)}.", [(fx(v3, 3), "1.732")]),
X("Maximum value", "Find the maximum value of 3 sin x + 4 cos x.",
  f"√(3² + 4²) = {fx(mx)}.", [(fx(mx), "5")]),
X("Product of sines", "Evaluate sin 10° sin 50° sin 70°.",
  f"sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ with θ = 10°: ¼ sin 30° = {fx(v5, 3)}.", [(fx(v5, 3), "0.125")]),
X("General solution", "Solve 2cos²x + 3 sin x = 0.",
  "2(1 − sin²x) + 3 sin x = 0 ⇒ 2sin²x − 3 sin x − 2 = 0 ⇒ (2 sin x + 1)(sin x − 2) = 0. sin x = 2 is impossible, so sin x = −1/2 = sin(−π/6) ⇒ x = nπ + (−1)ⁿ(−π/6), n ∈ ℤ.", []),
],
"topics": [
T("Radian measure", "One radian is the angle subtended at the centre by an arc equal to the radius. Arc length l = rθ (θ in radians). 1 radian ≈ 57°16′."),
T("Signs and allied angles", "Angles (90° ± θ), (270° ± θ) change sin ↔ cos, tan ↔ cot; angles (180° ± θ), (360° ± θ) keep the function. The sign is taken from the quadrant of the original angle (ASTC)."),
T("Graphs and periods", "sin x and cos x have period 2π and range [−1, 1]; tan x has period π and range ℝ (undefined at odd multiples of π/2). Period of sinⁿx and cosⁿx is π for even n and 2π for odd n."),
T("Strategy for equations", "Reduce to one function (using identities), factorise, then apply general-solution formulas. For a cos x + b sin x = c, divide by √(a² + b²); a solution exists only if |c| ≤ √(a² + b²)."),
T("Sum of sines/cosines in AP", "sin α + sin(α + β) + … n terms = sin(nβ/2)/sin(β/2) × sin(α + (n − 1)β/2); a similar formula holds for cosines. Useful for cos(2π/7) + cos(4π/7) + cos(6π/7) = −1/2."),
T("Maximum/minimum tricks", "For a sin²x + b cos²x the range is between a and b. For expressions like sin x cos x use sin 2x/2. AM ≥ GM helps for sums like tan²x + cot²x ≥ 2."),
],
"ratta": [
"ASTC: All, Sin, Tan, Cos positive in quadrants I–IV.",
"cos 2θ = 1 − 2sin²θ = 2cos²θ − 1.",
"sin 3θ = 3 sin θ − 4 sin³θ;  cos 3θ = 4cos³θ − 3 cos θ.",
"sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ.",
"a sin θ + b cos θ ∈ [−√(a² + b²), √(a² + b²)].",
"sin θ = sin α ⇒ nπ + (−1)ⁿα;  cos ⇒ 2nπ ± α;  tan ⇒ nπ + α.",
"sin 18° = (√5 − 1)/4;  tan 15° = 2 − √3.",
],
}

SYLLABUS = [
("Trigonometric identities and trigonometric functions", ["identities", "compound", "double angle"]),
("Trigonometric equations — general solutions", ["general solution", "equation"]),
("Radian measure, signs and graphs", ["radian", "period"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Angles degrees ya radian mein naape jaate hain (π rad = 180°). Chhe trigonometric functions unit circle par define hote hain; unke signs ASTC follow karte hain (quadrants I–IV mein All, Sin, Tan, Cos positive). sin, cos ka period 2π, tan ka π.",
"Identities — compound angle, double angle aur multiple/sub-multiple angle, sum-to-product aur product-to-sum — kisi bhi expression ko simplify karne deti hain.",
"Trigonometric equation ke general solution: sin θ = sin α ⇒ θ = nπ + (−1)ⁿα; cos θ = cos α ⇒ θ = 2nπ ± α; tan θ = tan α ⇒ θ = nπ + α.",
"a sin θ + b cos θ ki range [−√(a² + b²), √(a² + b²)] hai — maximum/minimum sawalon ka JEE favourite.",
],
when=[
("Ek function se doosre mein badalna.", None),
("Angles ka sum aur difference.", None),
("Simplification ke shortcuts.", None),
("Multiple-angle simplification.", None),
("sin, cos ke cubic expressions.", None),
("Trig functions jodna.", None),
("Standard product values.", None),
("Maximum aur minimum values.", None),
("Trigonometric equations solve karna (n ∈ ℤ).", "Dono taraf square karne se extra roots aa sakte hain — hamesha check karo."),
("Non-standard angles.", None),
("Triangles ki properties.", None),
("Triangle identities.", None),
],
examples=[
("sin 75°", "sin 75° nikalo.",
 "sin(45° + 30°) = (√3 + 1)/(2√2) = (√6 + √2)/4 ≈ ⟨0⟩."),
("Cosines ka product", "cos 20° cos 40° cos 80° nikalo.",
 "cos θ cos(60° − θ) cos(60° + θ) = ¼ cos 3θ, θ = 20° lekar: ¼ cos 60° = 1/8 = ⟨0⟩."),
("Tangents ka product", "tan 20° tan 40° tan 80° nikalo.",
 "tan θ tan(60° − θ) tan(60° + θ) = tan 3θ ⇒ tan 60° = √3 ≈ ⟨0⟩."),
("Maximum value", "3 sin x + 4 cos x ki maximum value nikalo.",
 "√(3² + 4²) = ⟨0⟩."),
("Sines ka product", "sin 10° sin 50° sin 70° nikalo.",
 "sin θ sin(60° − θ) sin(60° + θ) = ¼ sin 3θ, θ = 10° lekar: ¼ sin 30° = ⟨0⟩."),
("General solution", "2cos²x + 3 sin x = 0 solve karo.",
 "2(1 − sin²x) + 3 sin x = 0 ⇒ 2sin²x − 3 sin x − 2 = 0 ⇒ (2 sin x + 1)(sin x − 2) = 0. sin x = 2 sambhav nahi, isliye sin x = −1/2 = sin(−π/6) ⇒ x = nπ + (−1)ⁿ(−π/6), n ∈ ℤ."),
],
topics=[
("Radian measure", "Ek radian wo angle hai jo radius ke barabar arc centre par banata hai. Arc length l = rθ (θ radians mein). 1 radian ≈ 57°16′."),
("Signs and allied angles", "Angles (90° ± θ), (270° ± θ) mein sin ↔ cos, tan ↔ cot badalte hain; (180° ± θ), (360° ± θ) mein function wahi rehta hai. Sign original angle ke quadrant se lo (ASTC)."),
("Graphs and periods", "sin x aur cos x ka period 2π aur range [−1, 1]; tan x ka period π aur range ℝ (π/2 ke odd multiples par undefined). sinⁿx aur cosⁿx ka period even n ke liye π aur odd n ke liye 2π."),
("Strategy for equations", "Identities se ek hi function mein laao, factorise karo, phir general-solution formulas lagao. a cos x + b sin x = c ke liye √(a² + b²) se divide karo; solution tabhi hai jab |c| ≤ √(a² + b²)."),
("Sum of sines/cosines in AP", "sin α + sin(α + β) + … n terms = sin(nβ/2)/sin(β/2) × sin(α + (n − 1)β/2); cosines ke liye bhi aisa hi formula. cos(2π/7) + cos(4π/7) + cos(6π/7) = −1/2 ke liye kaam aata hai."),
("Maximum/minimum tricks", "a sin²x + b cos²x ki range a aur b ke beech. sin x cos x jaise expressions ke liye sin 2x/2 use karo. tan²x + cot²x ≥ 2 jaise sums ke liye AM ≥ GM."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
