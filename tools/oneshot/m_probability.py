from lib import F, X, T, sig, fx, _check_and_write
from fractions import Fraction as Fr
from math import comb

p_sum7 = Fr(6, 36)
p_union = Fr(1, 2) + Fr(1, 3) - Fr(1, 6)
# Bayes: bag I (3R, 2B), bag II (2R, 3B); choose bag at random; red drawn → P(bag I)
pr = Fr(1, 2) * Fr(3, 5) + Fr(1, 2) * Fr(2, 5)
bayes = (Fr(1, 2) * Fr(3, 5)) / pr
# binomial: P(exactly 2 heads in 4 tosses)
b2 = Fr(comb(4, 2), 16)
mean_bin, var_bin = 10 * Fr(1, 2), 10 * Fr(1, 2) * Fr(1, 2)
# at least one six in 3 throws
atl = 1 - Fr(5, 6) ** 3
# expectation of a fair die
ex_die = Fr(sum(range(1, 7)), 6)

DOC = {
"slug": "probability", "subject": "Mathematics",
"chapters": {"JEE": "Probability"},
"title": "Probability", "readMinutes": 15,
"summary": [
"Probability of an event = favourable outcomes / total equally likely outcomes. The addition rule handles 'or', the multiplication rule handles 'and'.",
"Conditional probability P(A|B) = P(A ∩ B)/P(B) leads to the total probability theorem and Bayes' theorem — a JEE favourite.",
"A random variable assigns numbers to outcomes; its distribution has a mean (expectation) and variance. The binomial distribution models n independent trials with success probability p.",
],
"formulas": [
F("Classical probability", "P(A) = n(A)/n(S);  0 ≤ P(A) ≤ 1;  P(A′) = 1 − P(A)", "Equally likely outcomes."),
F("Addition rule", "P(A ∪ B) = P(A) + P(B) − P(A ∩ B);  mutually exclusive: P(A ∪ B) = P(A) + P(B)", "'Or' events.", None, tag="PYQ favourite"),
F("Conditional probability", "P(A|B) = P(A ∩ B)/P(B)", "Probability given that B happened."),
F("Multiplication rule and independence", "P(A ∩ B) = P(A)P(B|A);  independent ⇔ P(A ∩ B) = P(A)P(B)", "'And' events.", "Mutually exclusive events (with non-zero probabilities) are never independent."),
F("Total probability", "P(A) = Σ P(Eᵢ)P(A|Eᵢ)  for a partition E₁, …, Eₙ", "Probability through cases."),
F("Bayes' theorem", "P(Eᵢ|A) = P(Eᵢ)P(A|Eᵢ) / Σ P(Eⱼ)P(A|Eⱼ)", "Reverse probability — which cause produced the result.", None, tag="PYQ favourite"),
F("Random variable", "mean μ = E(X) = Σ xᵢpᵢ;  variance σ² = Σ xᵢ²pᵢ − μ²", "Probability distributions."),
F("Binomial distribution", "P(X = r) = C(n, r) pʳ qⁿ⁻ʳ (q = 1 − p);  mean np;  variance npq", "n independent Bernoulli trials.", None, tag="PYQ favourite"),
F("At least one", "P(at least one) = 1 − P(none)", "Avoiding long case work."),
F("Common sample spaces", "two dice: 36 outcomes;  three coins: 8;  a pack: 52 cards (4 suits × 13)", "Counting outcomes."),
F("Odds", "odds in favour of A = P(A) : P(A′)", "Converting odds to probability."),
],
"examples": [
X("Sum of 7", "Two dice are thrown. P(sum = 7)?",
  f"6 favourable of 36 ⇒ 1/6 ≈ {fx(float(p_sum7), 3)}.", [(fx(float(p_sum7), 3), "0.167")]),
X("Addition rule", "P(A) = 1/2, P(B) = 1/3, P(A ∩ B) = 1/6. P(A ∪ B)?",
  f"1/2 + 1/3 − 1/6 = 2/3 ≈ {fx(float(p_union), 3)}.", [(fx(float(p_union), 3), "0.667")]),
X("Bayes", "Bag I has 3 red, 2 black; bag II has 2 red, 3 black. A bag is picked at random and a red ball drawn. P(it came from bag I)?",
  f"(1/2 × 3/5)/(1/2 × 3/5 + 1/2 × 2/5) = 3/5 = {fx(float(bayes), 1)}.", [(fx(float(bayes), 1), "0.6")]),
X("Binomial", "A coin is tossed 4 times. P(exactly 2 heads)?",
  f"C(4, 2)/16 = 6/16 = {fx(float(b2), 3)}.", [(fx(float(b2), 3), "0.375")]),
X("Mean and variance", "X ~ Binomial(10, 1/2). Mean and variance?",
  f"np = {fx(float(mean_bin))}, npq = {fx(float(var_bin), 1)}.", [(fx(float(mean_bin)), "5"), (fx(float(var_bin), 1), "2.5")]),
X("At least one six", "P(at least one six in 3 throws of a die)?",
  f"1 − (5/6)³ = 91/216 ≈ {fx(float(atl), 3)}.", [(fx(float(atl), 3), "0.421")]),
X("Expectation", "Expected value of a fair die roll?",
  f"(1 + 2 + … + 6)/6 = {fx(float(ex_die), 1)}.", [(fx(float(ex_die), 1), "3.5")]),
],
"topics": [
T("Events", "Sample space S, events as subsets; mutually exclusive (no common outcome), exhaustive (union = S), independent (one doesn't affect the other), complementary."),
T("Using P&C", "For cards, committees or arrangements, count favourable and total cases with combinations. E.g. P(2 aces in 2 cards) = ⁴C₂/⁵²C₂ = 1/221."),
T("Independent vs mutually exclusive", "Independent: P(A ∩ B) = P(A)P(B). Mutually exclusive: P(A ∩ B) = 0. If A and B are independent, so are A′ and B, A and B′, A′ and B′."),
T("Geometric probability", "When outcomes are points in a region, probability = favourable length/area/volume ÷ total."),
T("Problems on 'without replacement'", "Probabilities change after each draw; use conditional probabilities or combinations directly."),
T("Bayes' strategy", "List causes (bags, machines, persons) with prior probabilities, find P(result | cause) for each, compute total probability of the result, then divide the required term by the total."),
],
"ratta": [
"P(A ∪ B) = P(A) + P(B) − P(A ∩ B).",
"P(A|B) = P(A ∩ B)/P(B).",
"Independent: P(A ∩ B) = P(A)P(B).",
"Bayes = one path ÷ total of all paths.",
"Binomial: C(n, r)pʳqⁿ⁻ʳ;  mean np, variance npq.",
"At least one = 1 − none.",
],
}

SYLLABUS = [
("Probability of an event, addition and multiplication theorems of probability", ["addition", "multiplication"]),
("Bayes' theorem, probability distribution of a random variate", ["Bayes", "random variable", "distribution"]),
("Binomial distribution (mean and variance)", ["binomial", "mean", "variance"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
