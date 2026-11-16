from lib import F, X, T, sig, fx, _check_and_write

# worked numbers
msd, n_v = 1.0, 10; lc1 = msd / n_v; r1 = 2.0 + 7 * lc1 / 10      # vernier (cm)
p, N, z = 0.5, 50, 4; lc2 = p / N; r2 = 3.0 + 36 * lc2 - z * lc2   # screw gauge (+ zero error)
e3 = 2 * 1 + 1 * 2                                                  # % error in g = 4π²L/T²  (L 2%, T 1%)
G_cgs = 6.67e-11 * 1e5 * 1e4 / 1e6                                  # N m² kg⁻² → dyn cm² g⁻²
area = 3.8 * 2.62; area_s = "10"                                    # 9.956 → 2 s.f.
mean6 = (2.63 + 2.56 + 2.42 + 2.71 + 2.80) / 5
mad6 = sum(abs(v - mean6) for v in (2.63, 2.56, 2.42, 2.71, 2.80)) / 5
pct6 = mad6 / mean6 * 100

DOC = {
"slug": "units-and-measurement", "subject": "Physics",
"chapters": {"NEET": "Units and Measurement", "JEE": "Units and Measurement"},
"title": "Units and Measurement", "readMinutes": 11,
"summary": [
"Every physical quantity = number × unit. The SI system has 7 base units (m, kg, s, A, K, mol, cd); every other unit is derived from them.",
"No measurement is perfect: least count limits precision, and errors (systematic, random, gross) limit accuracy. Errors combine by fixed rules — add absolute errors for sums, add relative errors for products, multiply by the power for powers.",
"Significant figures show how precise a number is. The answer of a calculation can never be more precise than the least precise input.",
"Dimensions express a quantity in terms of [M], [L], [T], [A], [K]… Dimensional analysis checks equations, converts units and derives relations — but it cannot find pure-number constants or handle sums of terms with different powers.",
],
"formulas": [
F("SI base quantities", "length m · mass kg · time s · current A · temperature K · amount mol · luminous intensity cd", "Writing any unit or dimension.", "Plane angle (rad) and solid angle (sr) are dimensionless, not base units."),
F("Least count of vernier callipers", "LC = 1 MSD − 1 VSD = (value of 1 MSD)/(number of vernier divisions)", "Reading a vernier.", None, tag="PYQ favourite"),
F("Vernier reading", "Reading = MSR + (coinciding VSD × LC) − (zero error)", "Measuring length with callipers.", "Subtract a positive zero error, add a negative one — don't flip the sign."),
F("Least count of screw gauge", "LC = pitch / (number of circular scale divisions)", "Screw gauge readings.", None, tag="PYQ favourite"),
F("Screw gauge reading", "Reading = MSR + (CSR × LC) − (zero error)", "Diameter of a wire, thickness of a sheet.", "Zero error is positive when the circular-scale zero lies below the reference line — check this before subtracting."),
F("Mean value and absolute error", "a_mean = Σaᵢ/n;  Δaᵢ = |a_mean − aᵢ|;  Δa_mean = Σ|Δaᵢ|/n", "Repeated readings.", "Use the modulus of each deviation — never let errors cancel."),
F("Relative and percentage error", "relative error = Δa/a;   percentage error = (Δa/a) × 100%", "Comparing precision of different measurements."),
F("Errors in sum and difference", "Z = A ± B  ⇒  ΔZ = ΔA + ΔB", "Adding or subtracting measured values.", "Errors always ADD, even when the quantities are subtracted."),
F("Errors in product, quotient and power", "Z = Aᵖ Bᵠ / Cʳ  ⇒  ΔZ/Z = p(ΔA/A) + q(ΔB/B) + r(ΔC/C)", "Formulas like g = 4π²L/T² or ρ = m/V.", "Relative errors add for division too, and each is multiplied by its power.", tag="PYQ favourite"),
F("Significant figure rules", "× and ÷: keep the least number of significant figures;  + and −: keep the least number of decimal places", "Rounding a final answer.", "Trailing zeros after a decimal point count; leading zeros never count."),
F("Dimensional formula", "[Q] = [Mᵃ Lᵇ Tᶜ Aᵈ Kᵉ]; e.g. force [MLT⁻²], energy [ML²T⁻²], pressure [ML⁻¹T⁻²]", "Checking and deriving equations.", None),
F("Principle of homogeneity", "Every term on both sides of a correct equation has the same dimensions", "Checking whether an equation can be right.", "A dimensionally correct equation can still be wrong by a pure number like ½ or 2π."),
F("Unit conversion", "n₁[M₁ᵃ L₁ᵇ T₁ᶜ] = n₂[M₂ᵃ L₂ᵇ T₂ᶜ]  ⇒  n₂ = n₁ (M₁/M₂)ᵃ (L₁/L₂)ᵇ (T₁/T₂)ᶜ", "Changing a value from SI to CGS (or any system)."),
],
"examples": [
X("Vernier reading", "A vernier has 10 divisions equal to 9 main-scale divisions of 1 mm. The main scale reads 2.0 cm and the 7th vernier division coincides. Reading? (no zero error)",
  f"LC = 1 mm/10 = {fx(lc1,1)} mm = 0.01 cm. Reading = 2.0 cm + 7 × 0.01 cm = {fx(r1,2)} cm.", [(fx(r1,2), "2.07")]),
X("Screw gauge with zero error", "Pitch 0.5 mm, 50 circular divisions. With jaws closed the zero is 4 divisions below the line. A wire gives MSR = 3.0 mm, CSR = 36. Diameter?",
  f"LC = 0.5/50 = {fx(lc2,2)} mm. Zero error = +4 × 0.01 = +0.04 mm. Reading = 3.0 + 36 × 0.01 − 0.04 = {fx(r2,2)} mm.", [(fx(r2,2), "3.32")]),
X("Error in g from a pendulum", "g = 4π²L/T². L has 2% error and T has 1% error. Maximum % error in g?",
  f"Δg/g = ΔL/L + 2 ΔT/T = 2% + 2 × 1% = {e3}%.", [(str(e3), "4")]),
X("Mean absolute error", "Readings of a period: 2.63, 2.56, 2.42, 2.71, 2.80 s. Mean, mean absolute error and % error?",
  f"Mean = {fx(mean6,2)} s. Deviations: 0.01, 0.06, 0.20, 0.09, 0.18 → mean abs error = {fx(mad6,2)} s. % error = {fx(pct6,1)}%.",
  [(fx(mean6,2), "2.62"), (fx(mad6,2), "0.11"), (fx(pct6,1), "4.1")]),
X("Converting G to CGS", "G = 6.67 × 10⁻¹¹ N m² kg⁻². Value in dyne cm² g⁻²? ([G] = M⁻¹L³T⁻²)",
  f"n₂ = 6.67 × 10⁻¹¹ × (1 kg/1 g)⁻¹ (1 m/1 cm)³ = 6.67 × 10⁻¹¹ × 10⁻³ × 10⁶ = {sig(G_cgs,3)} dyne cm² g⁻².", [(sig(G_cgs,3), "6.67 × 10⁻⁸")]),
X("Significant figures in a product", "Area of a rectangle 3.8 cm × 2.62 cm?",
  f"3.8 × 2.62 = {fx(area,3)}; 3.8 has 2 significant figures, so the answer is {area_s} cm² (written 1.0 × 10¹ cm²).", [(area_s, "10")]),
X("Deriving the pendulum formula", "Assume T depends on mass m, length l and g as T ∝ mᵃ lᵇ gᶜ. Find a, b, c.",
  "[T] = [M]ᵃ[L]ᵇ[LT⁻²]ᶜ → M: a = 0; T: −2c = 1 → c = −½; L: b + c = 0 → b = ½. So T ∝ √(l/g) (the 2π comes from experiment).", []),
],
"topics": [
T("Base and derived units", "Derived units come from base units: newton = kg m s⁻², joule = kg m² s⁻², pascal = kg m⁻¹ s⁻². Prefixes: nano 10⁻⁹, micro 10⁻⁶, milli 10⁻³, kilo 10³, mega 10⁶, giga 10⁹. Practical length units: 1 Å = 10⁻¹⁰ m, 1 fermi = 10⁻¹⁵ m, 1 light year ≈ 9.46 × 10¹⁵ m, 1 AU ≈ 1.5 × 10¹¹ m, 1 parsec ≈ 3.08 × 10¹⁶ m."),
T("Accuracy vs precision", "Accuracy = how close to the true value. Precision = how close repeated readings are to each other (set by least count). A precise instrument can still be inaccurate if it has a zero error."),
T("Types of errors", "Systematic errors (instrument zero error, imperfect method, personal bias) push all readings one way — reduce by better method and correction. Random errors vary unpredictably — reduce by taking more readings and averaging. Gross errors come from carelessness."),
T("Rounding off", "Drop digits after the last significant one: if the next digit > 5 raise by one; < 5 leave it; = 5 make the last digit even (2.745 → 2.74, 2.735 → 2.74). Do the rounding only at the end of a calculation."),
T("Counting significant figures", "All non-zero digits count. Zeros between non-zero digits count (2.005 → 4). Leading zeros never count (0.0024 → 2). Trailing zeros count only with a decimal point (2.400 → 4; 2400 is ambiguous — write 2.4 × 10³ for 2). Exact numbers (like 2 in 2πr) have infinite significant figures."),
T("Uses and limits of dimensional analysis", "Uses: check an equation, convert units, derive a relation when the quantity depends on a product of powers. Limits: cannot find constants like ½ or 2π, fails for trigonometric/exponential/log relations, cannot handle a quantity that depends on a sum of terms, and cannot tell scalars from vectors."),
T("Dimensionless and same-dimension quantities", "Strain, refractive index, angle, relative density are dimensionless. Same dimensions: work, energy, torque [ML²T⁻²]; impulse and momentum [MLT⁻¹]; stress, pressure, Young's modulus, energy density [ML⁻¹T⁻²]; frequency, angular velocity, velocity gradient [T⁻¹]; Planck's constant and angular momentum [ML²T⁻¹]."),
T("Experimental skills", "Vernier callipers measure internal and external diameters and depth; the screw gauge measures wire diameter and sheet thickness with LC 0.01 mm. Always note zero error with jaws closed before measuring, take readings at several places and average."),
],
"ratta": [
"7 SI base units: m, kg, s, A, K, mol, cd.",
"Vernier LC = MSD/N;  screw gauge LC = pitch/N.",
"Corrected reading = observed − zero error (sign included).",
"Sums: add absolute errors;  products/powers: add (power × relative error).",
"× ÷ → least significant figures;  + − → least decimal places.",
"Force MLT⁻², energy ML²T⁻², pressure ML⁻¹T⁻², h ML²T⁻¹, G M⁻¹L³T⁻².",
"Dimensional analysis can't give constants like 2π.",
],
}

SYLLABUS = [
("SI units, fundamental and derived units", ["SI", "base", "derived"]),
("Least count, significant figures", ["least count", "significant figures"]),
("Errors in measurements", ["error", "systematic", "random", "percentage error"]),
("Dimensions and dimensional analysis", ["dimension", "homogeneity", "convert"]),
("Experimental skills: vernier callipers, screw gauge", ["vernier", "screw gauge", "zero error"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Har physical quantity = number × unit. SI system mein 7 base units hain (m, kg, s, A, K, mol, cd); baaki saare units inhi se derived hain.",
"Koi measurement perfect nahi hota: least count precision ko limit karta hai, aur errors (systematic, random, gross) accuracy ko. Errors fixed rules se judte hain — sum/difference mein absolute errors jodo, product/quotient mein relative errors jodo, power ho to power se multiply karo.",
"Significant figures batate hain number kitna precise hai. Calculation ka answer sabse kam precise input se zyada precise nahi ho sakta.",
"Dimensions quantity ko [M], [L], [T], [A], [K]… mein likhte hain. Dimensional analysis equation check karta hai, units convert karta hai aur relations derive karta hai — par ½, 2π jaise pure-number constants nahi nikaal sakta.",
],
when=[
("Koi bhi unit ya dimension likhte waqt.", "Plane angle (rad) aur solid angle (sr) dimensionless hain, base units nahi."),
("Vernier padhte waqt.", None),
("Callipers se length naapna.", "Positive zero error ghatao, negative wala jodo — sign ulta mat karo."),
("Screw gauge readings.", None),
("Wire ka diameter, sheet ki motai.", "Circular scale ka zero reference line ke neeche ho to zero error positive hai — ghataane se pehle check karo."),
("Baar-baar li gayi readings.", "Har deviation ka modulus lo — errors ko aapas mein cancel mat hone do."),
("Alag measurements ki precision compare karna.", None),
("Measured values jodna ya ghataana.", "Errors hamesha JUDTE hain, chaahe quantities ghataayi ja rahi hon."),
("g = 4π²L/T², ρ = m/V jaise formulas.", "Division mein bhi relative errors judte hain, aur har ek apni power se multiply hota hai."),
("Final answer round karna.", "Decimal ke baad trailing zeros gine jaate hain; leading zeros kabhi nahi."),
("Equations check aur derive karna.", None),
("Equation sahi ho sakti hai ya nahi, check karna.", "Dimensionally sahi equation bhi ½ ya 2π jaise number se galat ho sakti hai."),
("SI se CGS (ya kisi system) mein value badalna.", None),
],
examples=[
("Vernier reading", "Vernier ke 10 divisions = main scale ke 9 divisions (1 mm each). Main scale 2.0 cm padhta hai aur 7th vernier division milta hai. Reading? (zero error nahi)",
 "LC = 1 mm/10 = 0.1 mm = 0.01 cm. Reading = 2.0 cm + 7 × 0.01 cm = ⟨0⟩ cm."),
("Zero error wala screw gauge", "Pitch 0.5 mm, 50 circular divisions. Jaws band karne par zero line se 4 divisions neeche. Wire par MSR = 3.0 mm, CSR = 36. Diameter?",
 "LC = 0.5/50 = 0.01 mm. Zero error = +4 × 0.01 = +0.04 mm. Reading = 3.0 + 36 × 0.01 − 0.04 = ⟨0⟩ mm."),
("Pendulum se g mein error", "g = 4π²L/T². L mein 2% aur T mein 1% error. g mein maximum % error?",
 "Δg/g = ΔL/L + 2 ΔT/T = 2% + 2 × 1% = ⟨0⟩%."),
("Mean absolute error", "Time period ki readings: 2.63, 2.56, 2.42, 2.71, 2.80 s. Mean, mean absolute error aur % error?",
 "Mean = ⟨0⟩ s. Deviations: 0.01, 0.06, 0.20, 0.09, 0.18 → mean abs error = ⟨1⟩ s. % error = ⟨2⟩%."),
("G ko CGS mein", "G = 6.67 × 10⁻¹¹ N m² kg⁻². dyne cm² g⁻² mein value? ([G] = M⁻¹L³T⁻²)",
 "n₂ = 6.67 × 10⁻¹¹ × (1 kg/1 g)⁻¹ (1 m/1 cm)³ = 6.67 × 10⁻¹¹ × 10⁻³ × 10⁶ = ⟨0⟩ dyne cm² g⁻²."),
("Product mein significant figures", "Rectangle 3.8 cm × 2.62 cm ka area?",
 "3.8 × 2.62 = 9.956; 3.8 mein 2 significant figures hain, isliye answer ⟨0⟩ cm² (1.0 × 10¹ cm² likho)."),
("Pendulum formula derive karo", "Maano T mass m, length l aur g par T ∝ mᵃ lᵇ gᶜ ki tarah depend karta hai. a, b, c?",
 "[T] = [M]ᵃ[L]ᵇ[LT⁻²]ᶜ → M: a = 0; T: −2c = 1 → c = −½; L: b + c = 0 → b = ½. Isliye T ∝ √(l/g) (2π experiment se aata hai)."),
],
topics=[
("Base and derived units", "Derived units base units se bante hain: newton = kg m s⁻², joule = kg m² s⁻², pascal = kg m⁻¹ s⁻². Prefixes: nano 10⁻⁹, micro 10⁻⁶, milli 10⁻³, kilo 10³, mega 10⁶, giga 10⁹. Practical length units: 1 Å = 10⁻¹⁰ m, 1 fermi = 10⁻¹⁵ m, 1 light year ≈ 9.46 × 10¹⁵ m, 1 AU ≈ 1.5 × 10¹¹ m, 1 parsec ≈ 3.08 × 10¹⁶ m."),
("Accuracy vs precision", "Accuracy = true value ke kitna paas. Precision = baar-baar ki readings aapas mein kitni paas (least count se tay). Precise instrument bhi zero error ho to inaccurate ho sakta hai."),
("Types of errors", "Systematic errors (instrument ka zero error, kharab method, personal bias) saari readings ek taraf dhakelte hain — behtar method aur correction se kam karo. Random errors anpredictable hote hain — zyada readings lekar average karo. Gross errors laparwahi se aate hain."),
("Rounding off", "Last significant digit ke baad ke digits hatao: agla digit > 5 ho to ek badhao; < 5 ho to waisa hi; = 5 ho to last digit even banao (2.745 → 2.74, 2.735 → 2.74). Rounding sirf calculation ke end mein karo."),
("Counting significant figures", "Saare non-zero digits gine jaate hain. Non-zero digits ke beech ke zeros bhi (2.005 → 4). Leading zeros kabhi nahi (0.0024 → 2). Trailing zeros sirf decimal point ke saath (2.400 → 4; 2400 ambiguous — 2 ke liye 2.4 × 10³ likho). Exact numbers (2πr ka 2) ke infinite significant figures."),
("Uses and limits of dimensional analysis", "Uses: equation check karna, units convert karna, product of powers wala relation derive karna. Limits: ½ ya 2π jaise constants nahi milte, trigonometric/exponential/log relations par fail, sum of terms wali quantity handle nahi hoti, scalar aur vector mein farak nahi batata."),
("Dimensionless and same-dimension quantities", "Strain, refractive index, angle, relative density dimensionless hain. Same dimensions: work, energy, torque [ML²T⁻²]; impulse aur momentum [MLT⁻¹]; stress, pressure, Young's modulus, energy density [ML⁻¹T⁻²]; frequency, angular velocity, velocity gradient [T⁻¹]; Planck's constant aur angular momentum [ML²T⁻¹]."),
("Experimental skills", "Vernier callipers internal aur external diameter aur depth naapte hain; screw gauge wire ka diameter aur sheet ki motai LC 0.01 mm se. Naapne se pehle jaws band karke zero error note karo, kai jagah reading lo aur average karo."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
