from lib import F, X, T, sig, fx, _check_and_write
import math

r = 0.1; t = 10; W0 = 5
Wt = W0 * math.exp(r * t)
L0, Lt = 10, 15
rel = (Lt - L0) / L0 * 100

DOC = {
"slug": "plant-growth-and-development", "subject": "Biology",
"chapters": {"NEET": "Plant Growth and Development"},
"title": "Plant Growth and Development", "readMinutes": 13,
"summary": [
"Growth is an irreversible permanent increase in size. In plants it is indeterminate (open) because meristems keep dividing. It has three phases — meristematic, elongation and maturation — and follows a sigmoid curve.",
"Growth rate can be arithmetic (one daughter cell keeps dividing) or geometric (both daughter cells divide); differentiation, dedifferentiation and redifferentiation shape the plant.",
"Five plant growth regulators control growth: auxins, gibberellins, cytokinins (promoters), abscisic acid and ethylene (mainly inhibitors).",
"Development is also controlled by photoperiodism (day length) and vernalisation (low temperature) for flowering, and by seed dormancy.",
],
"formulas": [
F("Arithmetic growth", "Lₜ = L₀ + rt", "Linear growth — root elongating at a constant rate.", "Gives a straight line when length is plotted against time."),
F("Geometric growth", "Wₜ = W₀ eʳᵗ  (r = relative growth rate, e = 2.718)", "Exponential phase of growth (Wₜ final size, W₀ initial size).", None, tag="PYQ favourite"),
F("Absolute vs relative growth", "absolute = growth per unit time;  relative = growth per unit time per unit initial size", "Comparing growth of different leaves."),
F("Sigmoid growth curve", "lag phase → log (exponential) phase → stationary phase", "Growth of cells, organs or organisms in a limited environment."),
F("Auxins", "IAA, IBA (natural); NAA, 2,4-D (synthetic);  apical dominance, rooting of cuttings, parthenocarpy (tomato), prevent premature leaf and fruit drop, xylem differentiation;  2,4-D kills dicot weeds", "Auxin functions (F.W. Went, from Avena coleoptile tips).", None, tag="PYQ favourite"),
F("Gibberellins", "GA₃ most common (from Gibberella fujikuroi — bakanae disease of rice);  stem elongation (sugarcane yield up by ~20 t/acre), bolting in cabbage/beet, fruit size (grapes), malting (brewing), seed germination, delayed senescence", "Gibberellin functions.", None, tag="PYQ favourite"),
F("Cytokinins", "kinetin (from autoclaved herring sperm DNA), zeatin (corn kernels, coconut milk);  cell division, new leaves and chloroplasts, lateral shoot growth (overcomes apical dominance), delay leaf senescence (Richmond–Lang effect)", "Cytokinin functions."),
F("Ethylene", "gaseous; ripening of fruits (climacteric rise in respiration), triple response in seedlings, horizontal growth, abscission, flowering in pineapple, breaks dormancy;  ethephon releases ethylene", "Ethylene functions.", "Ethylene is the most widely used PGR in agriculture."),
F("Abscisic acid (ABA)", "stress hormone;  closes stomata, induces dormancy in seeds and buds, promotes abscission;  antagonist of GA", "ABA functions.", None, tag="PYQ favourite"),
F("Photoperiodism", "short-day plants flower when days are shorter than a critical length (actually need a long uninterrupted dark period);  long-day plants flower when days are longer;  day-neutral plants are unaffected;  leaves perceive the light", "Day-length control of flowering (Garner and Allard)."),
F("Vernalisation", "cold treatment needed to promote flowering in some plants — winter wheat, biennials (carrot, sugarbeet, cabbage)", "Low-temperature control of flowering."),
F("Seed dormancy", "caused by hard seed coat, chemical inhibitors (ABA, phenolics) or immature embryo;  broken by scarification, GA₃, nitrates, chilling", "Dormancy and germination."),
],
"examples": [
X("Geometric growth", "A seedling of 5 g grows with relative growth rate r = 0.1 per day. Mass after 10 days (Wₜ = W₀eʳᵗ)?",
  f"Wₜ = 5 × e^(0.1 × 10) = 5 × 2.718 = {fx(Wt, 1)} g.", [(fx(Wt, 1), "13.6")]),
X("Relative growth", "A leaf grows from 10 cm² to 15 cm². Relative growth (%)?",
  f"(15 − 10)/10 × 100 = {fx(rel)}%.", [(fx(rel), "50")]),
X("Bolting", "Which hormone promotes bolting in cabbage, and what is bolting?",
  "Gibberellin. Bolting is rapid internode elongation just before flowering in rosette plants like cabbage and beet.", []),
X("Apical dominance", "Removing the shoot tip makes a plant bushy. Why?",
  "The apical bud makes auxin that suppresses lateral buds (apical dominance). Removing it (decapitation) lets the lateral buds grow — used in tea plantations and hedge-making.", []),
X("Stress hormone", "Why is ABA called a stress hormone?",
  "It increases plant tolerance to stresses — it closes stomata during water shortage, induces dormancy to survive bad seasons and inhibits growth.", []),
X("Fruit ripening", "Which hormone hastens fruit ripening, and how is it supplied commercially?",
  "Ethylene; it is supplied as ethephon, which releases ethylene in plant tissues. It also promotes female flowers in cucumbers.", []),
],
"topics": [
T("Plasticity", "Plants follow different pathways in response to environment or phases of life to form different structures — e.g. heterophylly in cotton, coriander and larkspur (different leaves in juvenile and mature plants) and in buttercup (different leaves in air and water)."),
T("Differentiation, dedifferentiation, redifferentiation", "Cells from meristems mature to perform specific functions (differentiation). Living differentiated cells can regain the ability to divide (dedifferentiation — e.g. interfascicular cambium, cork cambium) and then form cells that again lose the ability to divide (redifferentiation)."),
T("Conditions for growth", "Water (for cell enlargement and enzymatic activity), oxygen (for metabolic energy), nutrients, and optimum temperature and light."),
T("Discovery of PGRs", "Charles and Francis Darwin observed coleoptiles bending towards light (phototropism); F.W. Went isolated auxin from Avena coleoptile tips; E. Kurosawa found gibberellins from a fungus causing bakanae disease; Skoog and Miller found kinetin; ABA was discovered as inhibitor-B, abscisin II and dormin; Cousins confirmed ethylene from ripened oranges."),
T("PGR interactions", "Hormones act together, sometimes synergistically and sometimes antagonistically — e.g. auxin–cytokinin ratio decides root vs shoot formation in tissue culture; GA and ABA have opposite effects on seed dormancy."),
T("Seed germination", "When conditions are favourable, seeds absorb water, enzymes are activated and the embryo grows into a seedling. Dormancy prevents germination even under favourable conditions."),
],
"ratta": [
"Arithmetic Lₜ = L₀ + rt;  geometric Wₜ = W₀eʳᵗ.",
"Sigmoid: lag → log → stationary.",
"Auxin: apical dominance, 2,4-D weedicide.",
"GA: bolting, grapes, sugarcane, malting.",
"Cytokinin: delays senescence, lateral buds.",
"Ethylene: ripening, pineapple flowering, ethephon.",
"ABA: stomata close, dormancy, stress hormone.",
"Vernalisation = cold;  photoperiodism = day length.",
],
}

SYLLABUS = [
("Growth regulators — auxin, gibberellin, cytokinin, ethylene, ABA", ["auxin", "gibberellin", "cytokinin", "ethylene", "abscisic acid"]),
("Seed germination; phases of plant growth and plant growth rate; conditions of growth", ["germination", "phases", "growth rate"]),
("Differentiation, dedifferentiation and redifferentiation; sequence of developmental process in a plant cell", ["differentiation", "dedifferentiation", "redifferentiation"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
