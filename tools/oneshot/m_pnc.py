from lib import F, X, T, sig, fx, _check_and_write
from math import comb, perm, factorial as fa

banana = fa(6) // (fa(3) * fa(2))
circ = fa(5)
neck = fa(5) // 2
committee = comb(5, 3) * comb(4, 2)
derange4 = sum((-1) ** k * fa(4) // fa(k) for k in range(5))
digits = 5 * perm(5, 3)   # 4-digit numbers from 0–5 without repetition: first digit 5 choices, rest P(5,3)
assert digits == 300
dist = comb(10 + 3 - 1, 3 - 1)
diag = comb(10, 2) - 10

DOC = {
"slug": "permutations-and-combinations", "subject": "Mathematics",
"chapters": {"JEE": "Permutations and Combinations"},
"title": "Permutations and Combinations", "readMinutes": 15,
"summary": [
"Counting starts with the fundamental principle: if one job can be done in m ways and another in n ways, both together can be done in m × n ways (and either one in m + n ways).",
"Permutations count arrangements (order matters): ⁿPᵣ = n!/(n − r)!. Combinations count selections (order doesn't matter): ⁿCᵣ = n!/(r!(n − r)!).",
"Special cases: identical objects, circular arrangements, restrictions (together / never together), distribution of identical objects (stars and bars) and derangements.",
],
"formulas": [
F("Fundamental principle", "AND → multiply;  OR → add", "Breaking a counting problem into stages."),
F("Permutations", "ⁿPᵣ = n!/(n − r)!;  with repetition allowed: nʳ", "Ordered arrangements.", None, tag="PYQ favourite"),
F("Combinations", "ⁿCᵣ = n!/(r!(n − r)!);  ⁿCᵣ = ⁿCₙ₋ᵣ;  ⁿCᵣ + ⁿCᵣ₋₁ = ⁿ⁺¹Cᵣ", "Selections.", "If ⁿCₓ = ⁿCᵧ then x = y or x + y = n."),
F("Identical objects", "n!/(p! q! r! …) for p alike of one kind, q of another, …", "Arranging letters of words.", None, tag="PYQ favourite"),
F("Circular arrangements", "(n − 1)! (clockwise ≠ anticlockwise);  (n − 1)!/2 (necklaces, garlands — clockwise = anticlockwise)", "Round tables and necklaces."),
F("Together / never together", "k particular objects together: treat as one block → (n − k + 1)! × k!;  never together = total − together", "Restriction problems."),
F("Gap method", "to keep k objects apart, arrange the others first, then choose gaps: (n − k)! × ⁿ⁻ᵏ⁺¹Pₖ", "No two together.", None, tag="PYQ favourite"),
F("Distributing identical objects", "n identical objects into r groups: ⁿ⁺ʳ⁻¹Cᵣ₋₁ (empty allowed);  ⁿ⁻¹Cᵣ₋₁ (each group ≥ 1)", "Stars and bars / non-negative integer solutions of x₁ + … + xᵣ = n."),
F("Derangements", "Dₙ = n![1 − 1/1! + 1/2! − … + (−1)ⁿ/n!];  D₁ = 0, D₂ = 1, D₃ = 2, D₄ = 9", "No object in its own place."),
F("Selections from identical objects", "from p alike, q alike, r alike: (p + 1)(q + 1)(r + 1) − 1 non-empty selections;  from n distinct: 2ⁿ − 1", "Number of selections."),
F("Geometry counting", "lines through n points (no 3 collinear) = ⁿC₂;  triangles = ⁿC₃;  diagonals of n-gon = ⁿC₂ − n;  with m collinear: subtract ᵐC₂ − 1 lines, ᵐC₃ triangles", "Points, lines, triangles."),
F("Number of divisors", "if N = p^a q^b r^c then divisors = (a + 1)(b + 1)(c + 1);  sum of divisors = Π (p^(a+1) − 1)/(p − 1)", "Divisor counting."),
],
"examples": [
X("Letters of BANANA", "How many arrangements of BANANA?",
  f"6 letters: A×3, N×2, B×1 ⇒ 6!/(3! 2!) = {banana}.", [(str(banana), "60")]),
X("Round table", "In how many ways can 6 people sit at a round table? And 6 beads on a necklace?",
  f"(6 − 1)! = {circ};  necklace (6 − 1)!/2 = {neck}.", [(str(circ), "120"), (str(neck), "60")]),
X("Committee", "Choose 3 men from 5 and 2 women from 4.",
  f"⁵C₃ × ⁴C₂ = 10 × 6 = {committee}.", [(str(committee), "60")]),
X("Derangements of 4 letters", "In how many ways can 4 letters go into 4 addressed envelopes with none in the right one?",
  f"D₄ = 4!(1 − 1 + 1/2 − 1/6 + 1/24) = {derange4}.", [(str(derange4), "9")]),
X("4-digit numbers", "How many 4-digit numbers can be formed from 0, 1, 2, 3, 4, 5 without repetition?",
  f"First digit: 5 choices (not 0); remaining 3 places from 5 digits: ⁵P₃ = 60. Total = 5 × 60 = {digits}.", [(str(digits), "300")]),
X("Identical balls", "In how many ways can 10 identical balls go into 3 different boxes (empty allowed)?",
  f"¹⁰⁺³⁻¹C₃₋₁ = ¹²C₂ = {dist}.", [(str(dist), "66")]),
X("Diagonals", "How many diagonals does a decagon have?",
  f"¹⁰C₂ − 10 = 45 − 10 = {diag}.", [(str(diag), "35")]),
],
"topics": [
T("Factorial basics", "n! = n(n − 1)…1; 0! = 1. ⁿPᵣ = r! × ⁿCᵣ. The exponent of a prime p in n! is [n/p] + [n/p²] + [n/p³] + … (e.g. number of trailing zeros in 100! is 24)."),
T("Words with restrictions", "Vowels together: treat vowels as one block. Vowels at odd places: choose places for vowels first. Dictionary (rank) problems: count words starting with each smaller letter in turn."),
T("Grouping and division", "Dividing m + n distinct objects into two groups of m and n: (m + n)!/(m! n!). Into groups of equal size (unlabelled), divide also by the factorial of the number of equal groups."),
T("Circular with restrictions", "Two particular people together at a round table: (n − 2)! × 2!. Men and women alternating (n each): (n − 1)! × n!."),
T("Integer solutions", "Number of positive integral solutions of x + y + z = 10 is ⁹C₂ = 36; non-negative solutions are ¹²C₂ = 66. For upper limits, use inclusion–exclusion or coefficients of polynomial expansions."),
T("When order matters", "Ask 'does swapping two chosen items give a new outcome?' — if yes, permutation; if no, combination. Most errors come from counting a selection as an arrangement."),
],
"ratta": [
"ⁿPᵣ = n!/(n − r)!;  ⁿCᵣ = n!/(r!(n − r)!).",
"Identical: n!/(p! q! …).",
"Circular (n − 1)!;  necklace (n − 1)!/2.",
"Stars and bars: ⁿ⁺ʳ⁻¹Cᵣ₋₁.",
"D₄ = 9;  D₃ = 2.",
"Diagonals = ⁿC₂ − n.",
"Divisors of p^a q^b: (a + 1)(b + 1).",
],
}

SYLLABUS = [
("Fundamental principle of counting; permutation as an arrangement and combination as selection", ["fundamental principle", "permutation", "combination"]),
("Meaning of P(n, r) and C(n, r); simple applications", ["ⁿPᵣ", "ⁿCᵣ"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Counting fundamental principle se shuru hoti hai: agar ek kaam m tareekon se aur doosra n tareekon se ho sakta hai, to dono saath m × n tareekon se (aur koi ek m + n tareekon se).",
"Permutation arrangements ginte hain (order maayne rakhta hai): ⁿPᵣ = n!/(n − r)!. Combination selections ginte hain (order maayne nahi rakhta): ⁿCᵣ = n!/(r!(n − r)!).",
"Special cases: identical objects, circular arrangements, restrictions (saath / kabhi saath nahi), identical objects ka distribution (stars and bars) aur derangements.",
],
when=[
("Counting problem ko stages mein todna.", None),
("Ordered arrangements.", None),
("Selections.", "Agar ⁿCₓ = ⁿCᵧ to x = y ya x + y = n — doosra case mat bhoolna."),
("Words ke letters arrange karna.", None),
("Round tables aur necklaces.", None),
("Restriction problems.", None),
("Koi do saath nahi.", None),
("Stars and bars / x₁ + … + xᵣ = n ke non-negative integer solutions.", None),
("Koi object apni jagah nahi.", None),
("Selections ki sankhya.", None),
("Points, lines, triangles.", None),
("Divisors ginna.", None),
],
examples=[
("BANANA ke letters", "BANANA ke kitne arrangements?",
 "6 letters: A×3, N×2, B×1 ⇒ 6!/(3! 2!) = ⟨0⟩."),
("Round table", "6 log round table par kitne tareekon se baith sakte hain? Aur necklace par 6 beads?",
 "(6 − 1)! = ⟨0⟩;  necklace (6 − 1)!/2 = ⟨1⟩."),
("Committee", "5 mein se 3 men aur 4 mein se 2 women chuno.",
 "⁵C₃ × ⁴C₂ = 10 × 6 = ⟨0⟩."),
("4 letters ke derangements", "4 letters ko 4 addressed envelopes mein kitne tareekon se daal sakte hain ki koi bhi sahi envelope mein na jaaye?",
 "D₄ = 4!(1 − 1 + 1/2 − 1/6 + 1/24) = ⟨0⟩."),
("4-digit numbers", "0, 1, 2, 3, 4, 5 se bina repetition kitne 4-digit numbers ban sakte hain?",
 "Pehla digit: 5 choices (0 nahi); baaki 3 jagah 5 digits se: ⁵P₃ = 60. Total = 5 × 60 = ⟨0⟩."),
("Identical balls", "10 identical balls ko 3 alag boxes mein kitne tareekon se daal sakte hain (khaali box allowed)?",
 "¹⁰⁺³⁻¹C₃₋₁ = ¹²C₂ = ⟨0⟩."),
("Diagonals", "Decagon mein kitne diagonals hote hain?",
 "¹⁰C₂ − 10 = 45 − 10 = ⟨0⟩."),
],
topics=[
("Factorial basics", "n! = n(n − 1)…1; 0! = 1. ⁿPᵣ = r! × ⁿCᵣ. n! mein prime p ka exponent [n/p] + [n/p²] + [n/p³] + … hai (jaise 100! mein trailing zeros 24)."),
("Words with restrictions", "Vowels saath: vowels ko ek block maano. Vowels odd places par: pehle vowels ki jagah chuno. Dictionary (rank) problems: har chhote letter se shuru hone wale words baari-baari gino."),
("Grouping and division", "m + n distinct objects ko m aur n ke do groups mein baantna: (m + n)!/(m! n!). Barabar size ke (unlabelled) groups mein, barabar groups ki sankhya ke factorial se bhi divide karo."),
("Circular with restrictions", "Round table par do khaas log saath: (n − 2)! × 2!. Men aur women baari-baari (n-n): (n − 1)! × n!."),
("Integer solutions", "x + y + z = 10 ke positive integral solutions ⁹C₂ = 36; non-negative solutions ¹²C₂ = 66. Upper limits ke liye inclusion–exclusion ya polynomial expansions ke coefficients use karo."),
("When order matters", "Poocho 'kya do chune items ko swap karne se naya outcome milta hai?' — haan to permutation; nahi to combination. Zyadatar galtiyan selection ko arrangement ki tarah ginne se hoti hain."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
