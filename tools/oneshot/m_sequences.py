from lib import F, X, T, sig, fx, _check_and_write
from fractions import Fraction as Fr

a, d, n = 3, 4, 20
t20 = a + (n - 1) * d
s20 = n * (2 * a + (n - 1) * d) // 2
gp_inf = Fr(1) / (1 - Fr(1, 3))
s_sq = sum(k * k for k in range(1, 11))
s_cu = sum(k ** 3 for k in range(1, 11))
am, gm = (4 + 16) / 2, (4 * 16) ** 0.5
hm = 2 * 4 * 16 / (4 + 16)
agp = sum((k) * Fr(1, 2) ** (k - 1) for k in range(1, 200))  # 1 + 2/2 + 3/4 + … = 4
assert abs(float(agp) - 4) < 1e-12

DOC = {
"slug": "sequences-and-series", "subject": "Mathematics",
"chapters": {"JEE": "Sequences and Series"},
"title": "Sequences and Series", "readMinutes": 15,
"summary": [
"An arithmetic progression (AP) adds a fixed common difference d; a geometric progression (GP) multiplies by a fixed ratio r. Harmonic progression (HP) is the reciprocal of an AP.",
"Know the nth term and sum formulas, the sum of an infinite GP (|r| < 1), and the means AM, GM, HM with AM ≥ GM ≥ HM for positive numbers.",
"Special series: Σn, Σn², Σn³, arithmetico-geometric progressions (AGP) and telescoping (method of differences) are frequent in JEE.",
],
"formulas": [
F("AP", "tₙ = a + (n − 1)d;  Sₙ = (n/2)[2a + (n − 1)d] = (n/2)(a + l)", "Arithmetic progressions.", None, tag="PYQ favourite"),
F("AP properties", "three terms in AP: a − d, a, a + d;  if a, b, c in AP then 2b = a + c;  tₙ = Sₙ − Sₙ₋₁", "Choosing terms smartly."),
F("GP", "tₙ = arⁿ⁻¹;  Sₙ = a(rⁿ − 1)/(r − 1) (r ≠ 1)", "Geometric progressions."),
F("Infinite GP", "S∞ = a/(1 − r),  |r| < 1", "Sum to infinity.", "Valid only for |r| < 1.", tag="PYQ favourite"),
F("HP", "a, b, c in HP ⇔ 1/a, 1/b, 1/c in AP;  b = 2ac/(a + c)", "Harmonic progressions.", "There is no formula for the sum of an HP."),
F("Means", "AM = (a + b)/2;  GM = √(ab);  HM = 2ab/(a + b);  GM² = AM × HM", "Means of two positive numbers."),
F("AM–GM–HM inequality", "AM ≥ GM ≥ HM (equality iff all numbers equal)", "Minimum/maximum problems.", None, tag="PYQ favourite"),
F("Inserting means", "n AMs between a and b: d = (b − a)/(n + 1);  n GMs: r = (b/a)^(1/(n + 1))", "Inserted means."),
F("Special sums", "Σn = n(n + 1)/2;  Σn² = n(n + 1)(2n + 1)/6;  Σn³ = [n(n + 1)/2]²", "Sums of powers.", None, tag="PYQ favourite"),
F("AGP sum to infinity", "a + (a + d)r + (a + 2d)r² + … = a/(1 − r) + dr/(1 − r)²  (|r| < 1)", "Arithmetico-geometric series."),
F("Method of differences", "if tₙ = f(n) − f(n − 1) then Sₙ = f(n) − f(0);  1/(n(n + 1)) = 1/n − 1/(n + 1)", "Telescoping sums."),
F("nth term from differences", "if successive differences of the terms form an AP, tₙ is quadratic in n; if they form a GP, tₙ = arⁿ + b", "Finding the general term of unusual series."),
],
"examples": [
X("AP term and sum", "AP 3, 7, 11, … Find t₂₀ and S₂₀.",
  f"t₂₀ = 3 + 19 × 4 = {t20}. S₂₀ = 10 × (6 + 76) = {s20}.", [(str(t20), "79"), (str(s20), "820")]),
X("Infinite GP", "Find 1 + 1/3 + 1/9 + …",
  f"a/(1 − r) = 1/(1 − 1/3) = 3/2 = {fx(float(gp_inf), 1)}.", [(fx(float(gp_inf), 1), "1.5")]),
X("Sum of squares and cubes", "Find 1² + 2² + … + 10² and 1³ + … + 10³.",
  f"10 × 11 × 21/6 = {s_sq};  (55)² = {s_cu}.", [(str(s_sq), "385"), (str(s_cu), "3025")]),
X("Means of 4 and 16", "Find AM, GM and HM of 4 and 16.",
  f"AM = {fx(am)}, GM = {fx(gm)}, HM = {fx(hm, 1)}; check GM² = AM × HM: 64 = 10 × 6.4.", [(fx(am), "10"), (fx(gm), "8"), (fx(hm, 1), "6.4")]),
X("AGP", "Find 1 + 2(1/2) + 3(1/2)² + … to infinity.",
  f"a = 1, d = 1, r = 1/2: 1/(1/2) + (1/2)/(1/4) = 2 + 2 = {fx(float(agp))}.", [(fx(float(agp)), "4")]),
X("Minimum using AM–GM", "Find the minimum of x + 9/x for x > 0.",
  "AM ≥ GM: (x + 9/x)/2 ≥ √9 = 3, so x + 9/x ≥ 6 (at x = 3).", []),
],
"topics": [
T("Choosing terms", "For AP with known sum use a − d, a, a + d (three terms) or a − 3d, a − d, a + d, a + 3d (four terms). For GP use a/r, a, ar."),
T("Properties of AP and GP", "Adding, subtracting, multiplying or dividing every term of an AP by a constant keeps it an AP (except division by 0). Multiplying terms of a GP by a constant keeps it a GP; reciprocals of a GP also form a GP; logs of a GP form an AP."),
T("Sum of n terms from Sₙ", "If Sₙ is given as a function of n, then tₙ = Sₙ − Sₙ₋₁ (n ≥ 2), t₁ = S₁. A quadratic Sₙ without constant term means AP."),
T("Relation between AM, GM, HM", "For positive a, b: A ≥ G ≥ H, G² = AH. The numbers a and b are roots of x² − 2Ax + G² = 0."),
T("Series to recognise", "1 + 11 + 111 + … — write 111…1 = (10ⁿ − 1)/9. 0.7 + 0.77 + 0.777 + … — similar trick. Sum of products like 1·2 + 2·3 + … = Σn² + Σn."),
T("Weighted AM–GM", "For positive numbers with weights, weighted AM ≥ weighted GM. Used for maximising products under a sum constraint, e.g. maximise x²y³ given x + y = 5."),
],
"ratta": [
"AP: tₙ = a + (n − 1)d;  Sₙ = n/2[2a + (n − 1)d].",
"GP: tₙ = arⁿ⁻¹;  S∞ = a/(1 − r).",
"HP: reciprocals in AP; b = 2ac/(a + c).",
"AM ≥ GM ≥ HM;  G² = AH.",
"Σn², Σn³ = [n(n + 1)/2]².",
"AGP: a/(1 − r) + dr/(1 − r)².",
],
}

SYLLABUS = [
("Arithmetic and geometric progressions, insertion of arithmetic and geometric means between two given numbers", ["arithmetic progression", "geometric progression", "insert"]),
("Relation between AM and GM", ["AM ≥ GM"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
