from lib import F, X, T, sig, fx, build
import sympy as sp

# ── every example verified with sympy ──
d1 = sp.Matrix([[1, 2, 3], [0, 4, 5], [1, 0, 6]]).det()
A2 = sp.Matrix([[2, 3], [1, 4]]); inv2 = A2.inv(); assert inv2 == sp.Rational(1, 5) * sp.Matrix([[4, -3], [-1, 2]])
# |adj A| = |A|^(n-1) etc. checked on a random 3×3 with det 4
M = sp.Matrix([[2, 0, 0], [0, 1, 0], [0, 0, 2]]); assert M.det() == 4
assert M.adjugate().det() == 16 and M.adjugate().adjugate().det() == 256 and (2 * M).det() == 32
area4 = abs(sp.Matrix([[1, 2, 1], [4, 6, 1], [7, 2, 1]]).det()) / 2
A5 = sp.Matrix([[1, 1, 1], [1, -1, 1], [2, 1, -1]]); b5 = sp.Matrix([6, 2, 1]); sol5 = A5.LUsolve(b5); D5 = A5.det()
k = sp.symbols("k")
D6 = sp.expand(sp.Matrix([[1, 1, 1], [1, 2, 3], [1, 3, k]]).det())
# k = 5: rank(A) = rank([A|b]) = 2 < 3 ⇒ infinitely many
A6 = sp.Matrix([[1, 1, 1], [1, 2, 3], [1, 3, 5]]); Ab6 = A6.row_join(sp.Matrix([1, 2, 3]))
assert A6.rank() == 2 and Ab6.rank() == 2
D7 = sp.factor(sp.Matrix([[k, 1, 1], [1, k, 1], [1, 1, k]]).det())
A8 = sp.Matrix([[1, 2], [3, 4]]); assert A8**2 - 5 * A8 - 2 * sp.eye(2) == sp.zeros(2); assert A8.inv() == (A8 - 5 * sp.eye(2)) / 2

DOC = {
"slug": "matrices-and-determinants", "subject": "Mathematics",
"chapters": {"JEE": "Matrices and Determinants"},
"title": "Matrices and Determinants", "readMinutes": 20,
"summary": [
"Matrix = numbers ki rectangular table (m × n). Do matrices tabhi multiply hote hain jab pehle ke columns = doosre ke rows; aur AB aksar BA ke barabar nahi hota — order matter karta hai.",
"Determinant sirf square matrix ka ek number hai. Ye batata hai matrix 'ulta' ho sakta hai ya nahi: |A| ≠ 0 ⇒ inverse exist karta hai (non-singular).",
"Inverse adjoint se: A⁻¹ = adj A / |A|. adj A ke determinant, adj of adj, |kA| — in sab ke power wale formulas JEE ke favourite hain.",
"Linear equations AX = B: |A| ≠ 0 to unique solution X = A⁻¹B. |A| = 0 to ya to koi solution nahi ya infinite — (adj A)B (ya Cramer ke D₁, D₂, D₃) se check karo.",
"Determinant se triangle ka area aur collinearity bhi nikalti hai."
],
"formulas": [
F("Types of matrices", "Square, diagonal, scalar, identity I, zero O, upper/lower triangular, symmetric (Aᵀ = A), skew-symmetric (Aᵀ = −A, diagonal sab 0)", "Definitions aur pehchaan.", "Skew-symmetric ki diagonal entries hamesha zero."),
F("Special square matrices", "Orthogonal: AAᵀ = I.  Idempotent: A² = A.  Involutory: A² = I.  Nilpotent: Aᵏ = O (kisi k ke liye)", "Property-based sawal."),
F("Matrix multiplication", "(m × n)(n × p) = (m × p);   (AB)ᵢⱼ = Σₖ aᵢₖ bₖⱼ", "Do matrices ka product.", "AB = O hone par bhi A ya B zero ho, zaroori nahi; AB = AC se B = C nahi nikalta."),
F("Transpose rules", "(Aᵀ)ᵀ = A,  (A + B)ᵀ = Aᵀ + Bᵀ,  (kA)ᵀ = kAᵀ,  (AB)ᵀ = BᵀAᵀ", "Transpose wale simplification.", "(AB)ᵀ mein order ulta hota hai."),
F("Symmetric + skew-symmetric split", "A = ½(A + Aᵀ) + ½(A − Aᵀ)", "Kisi bhi square matrix ko todna (unique tareeka).", None, None, "PYQ favourite"),
F("Determinant of order 2 and 3", "|a b; c d| = ad − bc.   3 × 3: kisi bhi row/column ke along expand: |A| = a₁₁C₁₁ + a₁₂C₁₂ + a₁₃C₁₃", "Determinant nikaalna.", "Jis row/column mein zyada zero ho, usi ke along expand karo."),
F("Minor and cofactor", "Mᵢⱼ = row i, column j hata ke bacha determinant;   Cᵢⱼ = (−1)^{i+j} Mᵢⱼ", "Expansion aur adjoint ke liye.", "Sign pattern: + − + / − + − / + − +."),
F("Properties of determinants", "|Aᵀ| = |A|;  do rows swap → sign ulta;  do rows same/proportional → 0;  ek row × k → |A| × k;  Rᵢ → Rᵢ + kRⱼ → koi badlaav nahi;  triangular → diagonal ka product", "Bina poora expand kiye determinant simplify karna.", "Kisi ek row ki entries ko kisi doosri row ke cofactors se multiply karke jodo → 0."),
F("Determinant of products and scalars", "|AB| = |A||B|;   |kA| = kⁿ |A|  (n = order);   |Aⁿ| = |A|ⁿ;   skew-symmetric odd order: |A| = 0", "Powers wale sawal.", "|kA| mein k ki power = order, sirf k nahi.", None, "PYQ favourite"),
F("Adjoint", "adj A = (cofactor matrix)ᵀ;   A (adj A) = (adj A) A = |A| I", "Inverse ka raasta.", "2 × 2: adj [a b; c d] = [d −b; −c a]."),
F("Adjoint properties", "|adj A| = |A|^{n−1};   adj(adj A) = |A|^{n−2} A;   |adj(adj A)| = |A|^{(n−1)²};   adj(AB) = (adj B)(adj A);   adj(Aᵀ) = (adj A)ᵀ", "Power-tower wale sawal.", None, None, "PYQ favourite"),
F("Inverse", "A⁻¹ = adj A / |A|  (|A| ≠ 0);   (AB)⁻¹ = B⁻¹A⁻¹;   (Aᵀ)⁻¹ = (A⁻¹)ᵀ;   |A⁻¹| = 1/|A|", "Inverse nikaalna.", "|A| = 0 (singular) ⇒ inverse exist hi nahi karta."),
F("Area of triangle and collinearity", "Area = ½ |det [x₁ y₁ 1; x₂ y₂ 1; x₃ y₃ 1]|;   collinear ⇔ det = 0", "Teen points se area / ek line par hain ya nahi.", "Area hamesha positive — modulus lo."),
F("System AX = B (non-homogeneous)", "|A| ≠ 0: unique, X = A⁻¹B.   |A| = 0 aur (adj A)B ≠ O: koi solution nahi.   |A| = 0 aur (adj A)B = O: infinite ya koi nahi (aage check karo)", "Consistency test.", None, None, "PYQ favourite"),
F("Cramer's rule", "x = D₁/D, y = D₂/D, z = D₃/D  (D ≠ 0).   D = 0, koi Dᵢ ≠ 0: no solution.   D = 0 aur D₁ = D₂ = D₃ = 0: infinite ya none", "2–3 variables ke equations.", "Dᵢ = D mein i-th column ko B se badal ke."),
F("Homogeneous system AX = O", "Hamesha consistent (x = y = z = 0).   Non-trivial solution ⇔ |A| = 0", "'Non-zero solution ke liye k?' wale sawal.", None, None, "PYQ favourite"),
F("Characteristic equation (2 × 2)", "A² − (tr A) A + |A| I = O   (Cayley–Hamilton)", "Aⁿ ya A⁻¹ jaldi nikaalna.", "tr A = diagonal ka sum."),
F("Trace", "tr(A + B) = tr A + tr B,   tr(kA) = k tr A,   tr(AB) = tr(BA)", "Trace wale quick sawal."),
],
"examples": [
X("3 × 3 determinant", "|1 2 3; 0 4 5; 1 0 6| = ?",
  f"Row 1 ke along: 1(24 − 0) − 2(0 − 5) + 3(0 − 4) = 24 + 10 − 12 = {d1}.",
  [(str(d1), "22")]),
X("2 × 2 inverse", "A = [2 3; 1 4]. A⁻¹?",
  "|A| = 8 − 3 = 5. adj A = [4 −3; −1 2]. A⁻¹ = (1/5)[4 −3; −1 2]. Check: A·A⁻¹ = I.", []),
X("Power wale determinants", "A 3 × 3 matrix hai, |A| = 4. |adj A|, |adj(adj A)| aur |2A|?",
  "|adj A| = |A|² = 16.  |adj(adj A)| = |A|^{(3−1)²} = 4⁴ = 256.  |2A| = 2³ × 4 = 32.", []),
X("Triangle ka area", "(1, 2), (4, 6), (7, 2) se bane triangle ka area?",
  f"½|1(6 − 2) − 2(4 − 7) + 1(8 − 42)| = ½|4 + 6 − 34| = ½ × 24 = {area4}.",
  [(str(area4), "12")]),
X("Teen equations solve karo", "x + y + z = 6,  x − y + z = 2,  2x + y − z = 1.",
  f"D = |1 1 1; 1 −1 1; 2 1 −1| = {D5} ≠ 0 ⇒ unique solution. Cramer / A⁻¹B se: x = {sol5[0]}, y = {sol5[1]}, z = {sol5[2]}. (Pehli − doosri se 2y = 4 ⇒ y = 2 bhi turant.)",
  [(str(D5), "6")]),
X("Infinite solutions ke liye k", "x + y + z = 1,  x + 2y + 3z = 2,  x + 3y + kz = 3. Kis k par infinitely many solutions?",
  f"D = |1 1 1; 1 2 3; 1 3 k| = k − 5. Unique ke liye k ≠ 5. k = 5 par: (eq2 − eq1) aur (eq3 − eq2) dono y + 2z = 1 dete hain ⇒ consistent ⇒ infinitely many. Answer k = 5.",
  []),
X("Non-trivial solution", "kx + y + z = 0,  x + ky + z = 0,  x + y + kz = 0 — non-trivial solution kab?",
  f"|A| = (k + 2)(k − 1)² = 0 ⇒ k = 1 ya k = −2.",
  []),
X("Cayley–Hamilton se inverse", "A = [1 2; 3 4]. A⁻¹ ko A ke terms mein likho.",
  "tr A = 5, |A| = −2 ⇒ A² − 5A − 2I = O. A⁻¹ se multiply: A − 5I − 2A⁻¹ = O ⇒ A⁻¹ = (A − 5I)/2 = [−2 1; 3/2 −1/2].", []),
],
"topics": [
T("Matrix ka order aur equality", "Order m × n = m rows, n columns. Do matrices barabar tabhi jab order same aur har entry same. Addition sirf same order mein."),
T("Multiplication ke gun", "Associative (AB)C = A(BC), distributive A(B + C) = AB + AC, lekin commutative nahi (AB ≠ BA aam taur par). I identity: AI = IA = A. Isliye (A + B)² = A² + AB + BA + B², A² + 2AB + B² tabhi jab AB = BA."),
T("Symmetric aur skew-symmetric", "AAᵀ aur A + Aᵀ hamesha symmetric; A − Aᵀ skew-symmetric. Do symmetric ka product symmetric tabhi jab wo commute karein. Skew-symmetric ki diagonal zero, aur odd order mein determinant zero."),
T("Determinant evaluate karne ki strategy", "Pehle properties lagao: common factor bahar nikaalo, Rᵢ → Rᵢ − Rⱼ se zero banao, phir zero wali row/column ke along expand karo. Do rows proportional dikhen to turant 0."),
T("Adjoint aur inverse", "Cofactors nikaalo, transpose karo = adj A. Phir |A| se divide. Check hamesha karo: A × A⁻¹ = I. Singular matrix (|A| = 0) ka inverse nahi hota."),
T("Consistency ka poora flow", "Step 1: |A| nikaalo. ≠ 0 ⇒ unique. Step 2: = 0 ⇒ (adj A)B nikaalo. ≠ O ⇒ inconsistent (no solution). = O ⇒ equations ko compare/eliminate karke dekho: aapas mein consistent to infinite, warna none."),
T("Homogeneous system", "x = y = z = 0 hamesha ek solution (trivial). Agar |A| = 0 to infinite non-trivial bhi. 'k ki values jinke liye non-zero solution' = |A| = 0 solve karo."),
T("Determinant ka geometric matlab", "2D mein |det| = do vectors se bane parallelogram ka area; teen points ke liye ½|det| = triangle area. Area 0 ⇒ teeno points ek line par."),
],
"ratta": [
"|kA| = kⁿ|A|;  |adj A| = |A|^{n−1};  |adj adj A| = |A|^{(n−1)²};  adj adj A = |A|^{n−2} A.",
"A·adj A = |A| I;  A⁻¹ = adj A/|A|.",
"(AB)ᵀ = BᵀAᵀ;  (AB)⁻¹ = B⁻¹A⁻¹;  adj(AB) = adj B · adj A.",
"Skew-symmetric odd order: |A| = 0, diagonal 0.",
"Homogeneous non-trivial ⇔ |A| = 0.",
"D ≠ 0 unique;  D = 0 & koi Dᵢ ≠ 0 → no solution.",
"2 × 2: A² − (tr A)A + |A|I = O.",
"Area = ½|det| (1 wala column);  det = 0 ⇒ collinear.",
],
}

SYLLABUS = [
("Matrices, algebra of matrices", ["Matrix multiplication", "Transpose"]),
("Types of matrices", ["Types of matrices", "symmetric", "skew-symmetric"]),
("Determinants and matrices of order two and three", ["order 2 and 3"]),
("Evaluation of determinants", ["Properties of determinants", "evaluate"]),
("Area of triangles using determinants", ["Area of triangle"]),
("Adjoint", ["Adjoint", "adj A"]),
("Evaluation of inverse using determinants", ["Inverse", "A⁻¹ = adj A / |A|"]),
("Test of consistency and solution of simultaneous linear equations (2 or 3 variables) using matrices", ["Consistency", "Cramer", "Homogeneous"]),
]

if __name__ == "__main__":
    # plain asserts for the symbolic examples (not strings)
    assert d1 == 22 and area4 == 12 and D5 == 6 and list(sol5) == [1, 2, 3]
    assert D6 == k - 5
    assert D7 == (k - 1) ** 2 * (k + 2)
    build(DOC, SYLLABUS)
