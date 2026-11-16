from lib import F, X, T, sig, fx, _check_and_write
from math import comb
from fractions import Fraction as Fr

# term independent of x in (x² + 1/x)^9 : general term C(9,r) x^(18-2r) x^(-r) → 18 − 3r = 0 → r = 6
r0 = 6; t_ind = comb(9, r0)
mid = comb(10, 5)
# coefficient of x^5 in (1 + x)^7
c5 = comb(7, 5)
sum_coeff = (3 - 2) ** 10      # (3x − 2y)^10 at x = y = 1
rem = pow(2, 100, 7)
num_terms = 15 + 1
# greatest coefficient check
assert max(comb(10, k) for k in range(11)) == mid

DOC = {
"slug": "binomial-theorem", "subject": "Mathematics",
"chapters": {"JEE": "Binomial Theorem"},
"title": "Binomial Theorem", "readMinutes": 12,
"summary": [
"For a positive integer n, (x + a)ⁿ = Σ C(n, r) xⁿ⁻ʳ aʳ, with n + 1 terms. The general term Tᵣ₊₁ = C(n, r) xⁿ⁻ʳ aʳ is the key to almost every question.",
"Typical questions: a specific term or coefficient, the term independent of x, the middle term(s), the greatest coefficient, and sums of binomial coefficients.",
"Binomial coefficients follow Pascal's triangle; their sum is 2ⁿ, and the sums of alternate coefficients are each 2ⁿ⁻¹. Remainders of large powers are found by writing the base near a multiple of the divisor.",
],
"formulas": [
F("Binomial theorem", "(x + a)ⁿ = C(n,0)xⁿ + C(n,1)xⁿ⁻¹a + … + C(n,n)aⁿ", "Expanding powers of a binomial.", None, tag="PYQ favourite"),
F("General term", "Tᵣ₊₁ = C(n, r) xⁿ⁻ʳ aʳ", "Any specific term.", "It is the (r + 1)th term, not the rth.", tag="PYQ favourite"),
F("Middle term", "n even: one middle term T(n/2 + 1);  n odd: two middle terms T((n + 1)/2) and T((n + 3)/2)", "Middle terms."),
F("Term independent of x", "set the power of x in Tᵣ₊₁ equal to 0 and solve for r", "Constant term."),
F("Sum of coefficients", "put x = 1 (and every other variable 1) in the expansion", "Sum of all coefficients."),
F("Binomial coefficient sums", "C₀ + C₁ + … + Cₙ = 2ⁿ;  C₀ + C₂ + … = C₁ + C₃ + … = 2ⁿ⁻¹;  C₀ − C₁ + C₂ − … = 0", "Identities of coefficients."),
F("Pascal's rule", "C(n, r) + C(n, r − 1) = C(n + 1, r);  C(n, r) = C(n, n − r)", "Building Pascal's triangle."),
F("Greatest coefficient", "n even: C(n, n/2);  n odd: C(n, (n − 1)/2) = C(n, (n + 1)/2)", "Largest binomial coefficient."),
F("Sum of squares of coefficients", "C₀² + C₁² + … + Cₙ² = C(2n, n)", "Vandermonde-type identity."),
F("Weighted sum", "Σ r C(n, r) = n 2ⁿ⁻¹", "Sums with r multiplied in (differentiate (1 + x)ⁿ)."),
F("Number of terms", "(x + a)ⁿ: n + 1 terms;  (x + y + z)ⁿ: C(n + 2, 2) terms", "Counting terms."),
],
"examples": [
X("Term independent of x", "Find the term independent of x in (x² + 1/x)⁹.",
  f"Tᵣ₊₁ = C(9, r) x^(18 − 2r) x^(−r) = C(9, r) x^(18 − 3r). 18 − 3r = 0 ⇒ r = {r0}; term = C(9, 6) = {t_ind}.", [(str(r0), "6"), (str(t_ind), "84")]),
X("Middle term", "Find the middle term of (1 + x)¹⁰.",
  f"n = 10 is even ⇒ T₆ = C(10, 5)x⁵ = {mid}x⁵.", [(str(mid), "252")]),
X("Coefficient", "Coefficient of x⁵ in (1 + x)⁷?",
  f"C(7, 5) = {c5}.", [(str(c5), "21")]),
X("Sum of coefficients", "Sum of coefficients in (3x − 2y)¹⁰?",
  f"Put x = y = 1: (3 − 2)¹⁰ = {sum_coeff}.", [(str(sum_coeff), "1")]),
X("Remainder", "Remainder when 2¹⁰⁰ is divided by 7?",
  f"2³ = 8 = 7 + 1, so 2¹⁰⁰ = 2 × (8)³³ = 2(7 + 1)³³ ≡ 2 × 1 = {rem} (mod 7).", [(str(rem), "2")]),
X("Number of terms", "How many terms are there in (2x − 3y)¹⁵?",
  f"n + 1 = {num_terms}.", [(str(num_terms), "16")]),
],
"topics": [
T("Pascal's triangle", "Each entry is the sum of the two above it; row n gives the coefficients of (x + a)ⁿ. The triangle is symmetric because C(n, r) = C(n, n − r)."),
T("Expansions with negative signs", "(x − a)ⁿ = Σ (−1)ʳ C(n, r) xⁿ⁻ʳ aʳ — signs alternate. (x + a)ⁿ + (x − a)ⁿ keeps only odd-numbered terms (even powers of a); the difference keeps the others."),
T("Divisibility and remainders", "To show 9ⁿ − 8n − 1 is divisible by 64, write 9ⁿ = (1 + 8)ⁿ and expand: the first two terms cancel and the rest contain 8². For remainders, express the base as (multiple of divisor ± 1)."),
T("Numerically greatest term", "Find the term whose ratio Tᵣ₊₁/Tᵣ = ((n − r + 1)/r)|a/x| first drops below 1 — that term is numerically greatest."),
T("Approximation", "For small x, (1 + x)ⁿ ≈ 1 + nx. E.g. (1.02)⁸ ≈ 1 + 8 × 0.02 = 1.16 (actual 1.1717)."),
T("Coefficient tricks", "For the coefficient of xᵏ in a product like (1 + x)ᵐ(1 + x)ⁿ, use C(m + n, k), or multiply general terms and sum over matching powers."),
],
"ratta": [
"Tᵣ₊₁ = C(n, r) xⁿ⁻ʳ aʳ.",
"n + 1 terms;  middle T(n/2 + 1) for even n.",
"ΣC = 2ⁿ;  odd sum = even sum = 2ⁿ⁻¹.",
"ΣC² = C(2n, n);  Σ rC(n, r) = n2ⁿ⁻¹.",
"Constant term: power of x = 0.",
"Sum of coefficients: put x = 1.",
],
}

SYLLABUS = [
("Binomial theorem for a positive integral index; general term and middle term", ["general term", "middle term"]),
("Simple applications", ["coefficient", "remainder"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Positive integer n ke liye (x + a)ⁿ = Σ C(n, r) xⁿ⁻ʳ aʳ, n + 1 terms ke saath. General term Tᵣ₊₁ = C(n, r) xⁿ⁻ʳ aʳ lagbhag har sawal ki chaabi hai.",
"Typical sawal: koi khaas term ya coefficient, x se independent term, middle term(s), greatest coefficient, aur binomial coefficients ke sums.",
"Binomial coefficients Pascal's triangle follow karte hain; unka sum 2ⁿ hai, aur alternate coefficients ka sum har ek 2ⁿ⁻¹. Badi powers ka remainder base ko divisor ke multiple ke paas likh kar nikaalte hain.",
],
when=[
("Binomial ki powers expand karna.", None),
("Koi bhi khaas term.", "Ye (r + 1)th term hai, rth nahi — galat mat lena."),
("Middle terms.", None),
("Constant term.", None),
("Saare coefficients ka sum.", None),
("Coefficients ki identities.", None),
("Pascal's triangle banana.", None),
("Sabse bada binomial coefficient.", None),
("Vandermonde-type identity.", None),
("r se multiply wale sums ((1 + x)ⁿ ko differentiate karo).", None),
("Terms ginna.", None),
],
examples=[
("x se independent term", "(x² + 1/x)⁹ mein x se independent term nikalo.",
 "Tᵣ₊₁ = C(9, r) x^(18 − 2r) x^(−r) = C(9, r) x^(18 − 3r). 18 − 3r = 0 ⇒ r = ⟨0⟩; term = C(9, 6) = ⟨1⟩."),
("Middle term", "(1 + x)¹⁰ ka middle term nikalo.",
 "n = 10 even hai ⇒ T₆ = C(10, 5)x⁵ = ⟨0⟩x⁵."),
("Coefficient", "(1 + x)⁷ mein x⁵ ka coefficient?",
 "C(7, 5) = ⟨0⟩."),
("Coefficients ka sum", "(3x − 2y)¹⁰ mein coefficients ka sum?",
 "x = y = 1 rakho: (3 − 2)¹⁰ = ⟨0⟩."),
("Remainder", "2¹⁰⁰ ko 7 se divide karne par remainder?",
 "2³ = 8 = 7 + 1, isliye 2¹⁰⁰ = 2 × (8)³³ = 2(7 + 1)³³ ≡ 2 × 1 = ⟨0⟩ (mod 7)."),
("Terms ki sankhya", "(2x − 3y)¹⁵ mein kitne terms?",
 "n + 1 = ⟨0⟩."),
],
topics=[
("Pascal's triangle", "Har entry upar ki do entries ka sum hai; row n, (x + a)ⁿ ke coefficients deti hai. Triangle symmetric hai kyunki C(n, r) = C(n, n − r)."),
("Expansions with negative signs", "(x − a)ⁿ = Σ (−1)ʳ C(n, r) xⁿ⁻ʳ aʳ — signs baari-baari badalte hain. (x + a)ⁿ + (x − a)ⁿ mein sirf odd-numbered terms bachte hain (a ki even powers); difference mein baaki."),
("Divisibility and remainders", "9ⁿ − 8n − 1 ko 64 se divisible dikhaane ke liye 9ⁿ = (1 + 8)ⁿ likh kar expand karo: pehle do terms cancel hote hain aur baaki sab mein 8² hai. Remainders ke liye base ko (divisor ka multiple ± 1) likho."),
("Numerically greatest term", "Wo term dhoondho jahan ratio Tᵣ₊₁/Tᵣ = ((n − r + 1)/r)|a/x| pehli baar 1 se neeche jaata hai — wahi numerically greatest hai."),
("Approximation", "Chhote x ke liye (1 + x)ⁿ ≈ 1 + nx. Jaise (1.02)⁸ ≈ 1 + 8 × 0.02 = 1.16 (asli 1.1717)."),
("Coefficient tricks", "(1 + x)ᵐ(1 + x)ⁿ jaise product mein xᵏ ke coefficient ke liye C(m + n, k) use karo, ya general terms multiply karke matching powers par sum karo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
