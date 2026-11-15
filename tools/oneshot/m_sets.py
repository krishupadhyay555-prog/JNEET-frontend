from lib import F, X, T, sig, fx, _check_and_write
from math import comb, factorial

# A has 3 elements, B has 4
rel = 2 ** (3 * 4)
func = 4 ** 3
inj = factorial(4) // factorial(1)       # 4P3
onto = sum((-1) ** k * comb(3, k) * (3 - k) ** 4 for k in range(4))  # onto from 4-set to 3-set
refl = 2 ** (3 * 3 - 3)
sym = 2 ** (3 * (3 + 1) // 2)
union = 40 + 30 - 15

DOC = {
"slug": "sets-relations-and-functions", "subject": "Mathematics",
"chapters": {"JEE": "Sets, Relations and Functions"},
"title": "Sets, Relations and Functions", "readMinutes": 16,
"summary": [
"A set is a well-defined collection. Operations — union, intersection, difference, complement — follow De Morgan's laws, and the inclusion–exclusion principle counts elements of unions.",
"A relation from A to B is any subset of A × B. Relations on a set can be reflexive, symmetric, transitive (all three = equivalence relation, which splits the set into equivalence classes).",
"A function assigns each element of the domain exactly one image. Functions can be one-one (injective), onto (surjective) or both (bijective); only bijections have inverses.",
"JEE loves counting questions: number of relations, functions, one-one and onto maps, and reflexive or symmetric relations.",
],
"formulas": [
F("Inclusion–exclusion (2 sets)", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B)", "Counting elements of a union.", None, tag="PYQ favourite"),
F("Inclusion–exclusion (3 sets)", "n(A ∪ B ∪ C) = Σn(A) − Σn(A ∩ B) + n(A ∩ B ∩ C)", "Three overlapping sets."),
F("De Morgan's laws", "(A ∪ B)′ = A′ ∩ B′;  (A ∩ B)′ = A′ ∪ B′", "Simplifying complements."),
F("Power set", "n(P(A)) = 2ⁿ for n(A) = n;  proper subsets = 2ⁿ − 1", "Counting subsets."),
F("Cartesian product and relations", "n(A × B) = mn;  number of relations from A to B = 2^(mn)", "Counting relations.", None, tag="PYQ favourite"),
F("Relations on a set with n elements", "total 2^(n²);  reflexive 2^(n² − n);  symmetric 2^(n(n+1)/2);  reflexive and symmetric 2^(n(n−1)/2)", "Counting special relations."),
F("Equivalence relation", "reflexive (a R a) + symmetric (a R b ⇒ b R a) + transitive (a R b, b R c ⇒ a R c)", "Checking relation types.", "The empty relation on a non-empty set is symmetric and transitive but not reflexive."),
F("Counting functions (m-set → n-set)", "all functions nᵐ;  one-one nPm (m ≤ n);  onto Σ (−1)ᵏ C(n, k)(n − k)ᵐ (m ≥ n);  bijections n! (m = n)", "Counting maps.", None, tag="PYQ favourite"),
F("Domain of common functions", "√f(x): f(x) ≥ 0;  1/f(x): f(x) ≠ 0;  log f(x): f(x) > 0;  sin⁻¹ f(x): −1 ≤ f(x) ≤ 1", "Finding domains."),
F("Even and odd functions", "even f(−x) = f(x) (symmetric about y-axis);  odd f(−x) = −f(x) (symmetric about origin);  every f = even part + odd part", "Symmetry of functions."),
F("Composition and inverse", "(g∘f)(x) = g(f(x));  (g∘f)⁻¹ = f⁻¹∘g⁻¹;  f⁻¹ exists ⇔ f bijective;  graphs of f and f⁻¹ are mirror images in y = x", "Combining functions."),
F("Greatest integer and fractional part", "[x] ≤ x < [x] + 1;  {x} = x − [x] ∈ [0, 1);  [x + n] = [x] + n for integer n", "Step functions.", "[−2.3] = −3, not −2."),
F("Periodic functions", "period of sin, cos = 2π;  tan, cot = π;  {x} = 1;  |sin x| = π;  period of f(ax + b) = T/|a|", "Finding periods."),
],
"examples": [
X("Union count", "In a class 40 students like cricket, 30 like football and 15 like both. How many like at least one?",
  f"n(C ∪ F) = 40 + 30 − 15 = {union}.", [(str(union), "55")]),
X("Number of relations", "A has 3 elements and B has 4. How many relations from A to B?",
  f"2^(3 × 4) = 2¹² = {rel}.", [(str(rel), "4096")]),
X("Functions and one-one functions", "A has 3 elements, B has 4. Number of functions and one-one functions from A to B?",
  f"Functions: 4³ = {func}. One-one: ⁴P₃ = 4 × 3 × 2 = {inj}.", [(str(func), "64"), (str(inj), "24")]),
X("Onto functions", "How many onto functions are there from a 4-element set to a 3-element set?",
  f"3⁴ − C(3,1)2⁴ + C(3,2)1⁴ = 81 − 48 + 3 = {onto}.", [(str(onto), "36")]),
X("Reflexive and symmetric relations", "On a set with 3 elements, how many reflexive relations and how many symmetric relations?",
  f"Reflexive: 2^(9 − 3) = {refl}. Symmetric: 2^(3 × 4/2) = {sym}.", [(str(refl), "64"), (str(sym), "64")]),
X("Domain", "Find the domain of f(x) = 1/√(x² − 5x + 6).",
  "Need x² − 5x + 6 > 0 ⇒ (x − 2)(x − 3) > 0 ⇒ x < 2 or x > 3. Domain: (−∞, 2) ∪ (3, ∞).", []),
],
"topics": [
T("Types of sets", "Empty (∅), singleton, finite, infinite, equal sets, equivalent sets (same cardinality), subsets, universal set. Intervals: open (a, b), closed [a, b], half-open."),
T("Symmetric difference", "A Δ B = (A − B) ∪ (B − A) = (A ∪ B) − (A ∩ B). Useful in Venn-diagram questions."),
T("Equivalence classes", "An equivalence relation on A partitions A into disjoint classes. Example: R = {(a, b): a − b divisible by 3} on integers has three classes — remainders 0, 1, 2."),
T("Checking one-one and onto", "One-one: f(x₁) = f(x₂) ⇒ x₁ = x₂, or f strictly monotonic; horizontal line test. Onto: range = codomain. A function from a finite set to itself is one-one if and only if it is onto."),
T("Range-finding techniques", "Write y = f(x) and solve for x, then find conditions on y; use monotonicity, completing the square, or the AM–GM inequality; for rational functions in x² use discriminant ≥ 0."),
T("Special functions", "Modulus |x|, signum sgn x (1, 0, −1), greatest integer [x], fractional part {x}, exponential and logarithmic functions. Know their graphs, domains and ranges."),
],
"ratta": [
"n(A ∪ B) = n(A) + n(B) − n(A ∩ B).",
"Relations A → B: 2^(mn);  on n-set: 2^(n²).",
"Reflexive 2^(n² − n);  symmetric 2^(n(n+1)/2).",
"Functions nᵐ;  one-one nPm;  bijections n!.",
"Onto m → n: Σ(−1)ᵏ C(n,k)(n − k)ᵐ.",
"Equivalence = reflexive + symmetric + transitive.",
"[−2.3] = −3;  {x} ∈ [0, 1).",
],
}

SYLLABUS = [
("Sets and their representation; union, intersection and complement; power set", ["union", "intersection", "complement", "power set"]),
("Relations — types of relations, equivalence relations", ["relation", "reflexive", "symmetric", "transitive", "equivalence"]),
("Functions — one-one, into and onto functions, composition of functions", ["one-one", "onto", "composition", "bijective"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
