from lib import F, X, T, sig, fx, _check_and_write
import statistics as st, math

data = [2, 4, 4, 4, 5, 5, 7, 9]
mean = st.mean(data); var = st.pvariance(data); sd = math.sqrt(var)
med = st.median([3, 7, 1, 9, 5])
# mean deviation about mean of 2, 4, 6, 8, 10
d2 = [2, 4, 6, 8, 10]; m2 = st.mean(d2); md = sum(abs(v - m2) for v in d2) / len(d2)
# new variance after multiplying by 3 and adding 5
var_new = 9 * var
cv = sd / mean * 100
# combined mean: 30 students mean 60, 20 students mean 70
comb_mean = (30 * 60 + 20 * 70) / 50

DOC = {
"slug": "statistics", "subject": "Mathematics",
"chapters": {"JEE": "Statistics"},
"title": "Statistics", "readMinutes": 11,
"summary": [
"Measures of central tendency — mean, median and mode — describe the centre of data. Measures of dispersion — range, mean deviation, variance and standard deviation — describe the spread.",
"Know formulas for ungrouped, discrete and grouped (continuous) data, and the shortcut (step-deviation) method.",
"JEE questions often test how mean and variance change when every observation is shifted or scaled, and combined mean/variance of two groups.",
],
"formulas": [
F("Mean", "x̄ = Σxᵢ/n;  for frequencies x̄ = Σfᵢxᵢ/Σfᵢ;  step deviation x̄ = A + (Σfᵢuᵢ/Σfᵢ)h, uᵢ = (xᵢ − A)/h", "Average of data."),
F("Median", "ungrouped: middle value of sorted data;  grouped: l + ((N/2 − C)/f) × h", "Middle value."),
F("Mode", "grouped: l + ((f₁ − f₀)/(2f₁ − f₀ − f₂)) × h;  empirical: mode ≈ 3 median − 2 mean", "Most frequent value."),
F("Mean deviation", "MD about a = Σ|xᵢ − a|/n;  minimum when a = median", "Average absolute deviation.", None, tag="PYQ favourite"),
F("Variance and SD", "σ² = Σ(xᵢ − x̄)²/n = Σxᵢ²/n − x̄²;  σ = √σ²", "Spread of data.", None, tag="PYQ favourite"),
F("Effect of change of origin and scale", "yᵢ = axᵢ + b ⇒ ȳ = a x̄ + b;  σᵧ² = a²σₓ²;  σᵧ = |a|σₓ", "Shifting/scaling data.", "Adding a constant doesn't change variance.", tag="PYQ favourite"),
F("Coefficient of variation", "CV = (σ/x̄) × 100", "Comparing variability of two series — lower CV is more consistent."),
F("Combined mean", "x̄ = (n₁x̄₁ + n₂x̄₂)/(n₁ + n₂)", "Merging two groups."),
F("Combined variance", "σ² = [n₁(σ₁² + d₁²) + n₂(σ₂² + d₂²)]/(n₁ + n₂),  dᵢ = x̄ᵢ − x̄", "Variance of merged groups."),
F("Variance of first n natural numbers", "σ² = (n² − 1)/12", "Standard result."),
],
"examples": [
X("Mean, variance, SD", "Data: 2, 4, 4, 4, 5, 5, 7, 9. Find mean, variance and SD.",
  f"Mean = 40/8 = {fx(mean)}; variance = Σ(x − 5)²/8 = 32/8 = {fx(var)}; SD = {fx(sd)}.", [(fx(mean), "5"), (fx(var), "4"), (fx(sd), "2")]),
X("Median", "Median of 3, 7, 1, 9, 5?",
  f"Sorted 1, 3, 5, 7, 9 ⇒ median = {med}.", [(str(med), "5")]),
X("Mean deviation", "Mean deviation about the mean of 2, 4, 6, 8, 10?",
  f"Mean 6; deviations 4, 2, 0, 2, 4 ⇒ MD = 12/5 = {fx(md, 1)}.", [(fx(md, 1), "2.4")]),
X("Scaling", "Variance of data is 4. Each value is multiplied by 3 and 5 is added. New variance?",
  f"3² × 4 = {fx(var_new)}.", [(fx(var_new), "36")]),
X("Coefficient of variation", "For the first data set (mean 5, SD 2), find CV.",
  f"2/5 × 100 = {fx(cv)}%.", [(fx(cv), "40")]),
X("Combined mean", "30 students average 60 and 20 students average 70. Combined mean?",
  f"(1800 + 1400)/50 = {fx(comb_mean)}.", [(fx(comb_mean), "64")]),
],
"topics": [
T("Choosing a measure", "Mean uses all values but is affected by outliers; median is robust to outliers; mode suits categorical data. For skewed distributions the median is often better."),
T("Range and quartile deviation", "Range = maximum − minimum. Quartile deviation = (Q₃ − Q₁)/2. Both are simple measures of spread."),
T("Variance shortcuts", "Use σ² = Σx²/n − x̄² to avoid computing each deviation. For grouped data use the step-deviation method σ² = h²[Σfu²/N − (Σfu/N)²]."),
T("Correcting wrong observations", "If a value was recorded wrongly, correct Σx and Σx² by removing the wrong value and adding the right one, then recompute mean and variance."),
T("Properties of SD", "SD is never negative; it is zero only if all values are equal. SD ≥ mean deviation about the mean."),
T("Missing data problems", "Given mean and variance with one or two unknown values, set up equations from Σx = n x̄ and Σx² = n(σ² + x̄²)."),
],
"ratta": [
"σ² = Σx²/n − x̄².",
"y = ax + b ⇒ σᵧ = |a|σₓ (b doesn't matter).",
"MD minimum about median.",
"CV = σ/x̄ × 100.",
"Mode ≈ 3 median − 2 mean.",
"Variance of 1…n = (n² − 1)/12.",
],
}

SYLLABUS = [
("Measures of dispersion: calculation of mean, median, mode of grouped and ungrouped data", ["mean", "median", "mode", "grouped"]),
("Calculation of standard deviation, variance and mean deviation for grouped and ungrouped data", ["standard deviation", "variance", "mean deviation"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Central tendency ke measures — mean, median aur mode — data ka centre batate hain. Dispersion ke measures — range, mean deviation, variance aur standard deviation — failaav batate hain.",
"Ungrouped, discrete aur grouped (continuous) data ke formulas, aur shortcut (step-deviation) method yaad rakho.",
"JEE sawal aksar test karte hain ki har observation shift ya scale karne par mean aur variance kaise badalte hain, aur do groups ka combined mean/variance.",
],
when=[
("Data ka average.", None),
("Beech wali value.", None),
("Sabse zyada baar aane wali value.", None),
("Average absolute deviation.", None),
("Data ka failaav.", None),
("Data shift/scale karna.", "Constant jodne se variance nahi badalta — dhyan rakho."),
("Do series ki variability compare karna — kam CV zyada consistent.", None),
("Do groups milaana.", None),
("Milaaye gaye groups ka variance.", None),
("Standard result.", None),
],
examples=[
("Mean, variance, SD", "Data: 2, 4, 4, 4, 5, 5, 7, 9. Mean, variance aur SD nikalo.",
 "Mean = 40/8 = ⟨0⟩; variance = Σ(x − 5)²/8 = 32/8 = ⟨1⟩; SD = ⟨2⟩."),
("Median", "3, 7, 1, 9, 5 ka median?",
 "Sorted 1, 3, 5, 7, 9 ⇒ median = ⟨0⟩."),
("Mean deviation", "2, 4, 6, 8, 10 ka mean ke about mean deviation?",
 "Mean 6; deviations 4, 2, 0, 2, 4 ⇒ MD = 12/5 = ⟨0⟩."),
("Scaling", "Data ka variance 4 hai. Har value ko 3 se multiply karke 5 joda. Naya variance?",
 "3² × 4 = ⟨0⟩."),
("Coefficient of variation", "Pehle data set (mean 5, SD 2) ka CV nikalo.",
 "2/5 × 100 = ⟨0⟩%."),
("Combined mean", "30 students ka average 60 aur 20 students ka average 70. Combined mean?",
 "(1800 + 1400)/50 = ⟨0⟩."),
],
topics=[
("Choosing a measure", "Mean saari values use karta hai par outliers se affect hota hai; median outliers se bacha rehta hai; mode categorical data ke liye. Skewed distributions mein median aksar behtar hai."),
("Range and quartile deviation", "Range = maximum − minimum. Quartile deviation = (Q₃ − Q₁)/2. Dono failaav ke simple measures hain."),
("Variance shortcuts", "Har deviation nikaalne se bachne ke liye σ² = Σx²/n − x̄² use karo. Grouped data ke liye step-deviation method σ² = h²[Σfu²/N − (Σfu/N)²]."),
("Correcting wrong observations", "Agar koi value galat likhi gayi, to Σx aur Σx² mein galat value hata kar sahi jodo, phir mean aur variance dobara nikalo."),
("Properties of SD", "SD kabhi negative nahi; zero sirf tab jab saari values barabar hon. SD ≥ mean ke about mean deviation."),
("Missing data problems", "Mean aur variance diye hon aur ek-do values anjaan, to Σx = n x̄ aur Σx² = n(σ² + x̄²) se equations banao."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
