from lib import F, X, T, sig, fx, _check_and_write

total = 16
tall_round = 9
gametes_tri = 2 ** 3
geno_di = 3 ** 2
prob_colour_blind_son = 0.5 * 100

DOC = {
"slug": "principles-of-inheritance-and-variation", "subject": "Biology",
"chapters": {"NEET": "Principles of Inheritance and Variation"},
"title": "Principles of Inheritance and Variation", "readMinutes": 16,
"summary": [
"Mendel (1856–1863, garden pea) proposed the laws of inheritance: dominance, segregation and independent assortment. Monohybrid F₂ ratio 3:1 (phenotype), 1:2:1 (genotype); dihybrid F₂ 9:3:3:1.",
"Deviations from Mendel: incomplete dominance (snapdragon 1:2:1), co-dominance (ABO blood groups), multiple alleles, pleiotropy and polygenic inheritance (skin colour).",
"The chromosomal theory of inheritance (Sutton and Boveri) placed genes on chromosomes; Morgan's Drosophila work showed linkage and recombination. Sex is determined by chromosomes (XX–XY, XX–XO, ZW–ZZ) or haplodiploidy.",
"Mutations and chromosomal changes cause disorders: Mendelian (haemophilia, colour blindness, sickle-cell anaemia, phenylketonuria, thalassemia) and chromosomal (Down's, Klinefelter's, Turner's syndromes). Pedigree analysis traces traits in families.",
],
"formulas": [
F("Monohybrid cross", "TT × tt → F₁ Tt (all tall);  F₁ selfed → F₂ phenotype 3:1, genotype 1:2:1 (TT : Tt : tt)", "One character.", None, tag="PYQ favourite"),
F("Test cross", "F₁ (Tt) × recessive parent (tt) → 1:1 (monohybrid);  dihybrid test cross → 1:1:1:1", "Finding the unknown genotype of a dominant phenotype."),
F("Dihybrid cross", "RRYY × rryy → F₁ RrYy;  F₂ phenotype 9:3:3:1;  9 genotypes;  4 gamete types from F₁", "Two characters — law of independent assortment.", None, tag="PYQ favourite"),
F("General counts", "gametes = 2ⁿ;  F₂ genotypes = 3ⁿ;  F₂ phenotypes (complete dominance) = 2ⁿ  (n = heterozygous gene pairs)", "Quick counting."),
F("Incomplete dominance", "snapdragon (Antirrhinum): RR red × rr white → Rr pink;  F₂ phenotype = genotype = 1:2:1", "Neither allele fully dominant."),
F("Co-dominance and multiple alleles", "ABO: alleles Iᴬ, Iᴮ, i;  Iᴬ and Iᴮ co-dominant, both dominant over i;  6 genotypes, 4 phenotypes (A, B, AB, O)", "Blood group genetics.", None, tag="PYQ favourite"),
F("Pleiotropy and polygenic traits", "pleiotropy: one gene, many effects (phenylketonuria);  polygenic: several genes add up (human skin colour, height)", "Beyond simple dominance."),
F("Linkage and recombination", "genes close together on a chromosome are inherited together (linkage);  recombination frequency ∝ distance (Sturtevant used it to map genes);  Morgan: white-eye/yellow-body ~1.3% recombination, white-eye/miniature wing ~37.2%", "Morgan's Drosophila work.", None, tag="PYQ favourite"),
F("Sex determination types", "XX–XY: humans, Drosophila (male heterogametic);  XX–XO: grasshopper;  ZW–ZZ: birds (female heterogametic);  haplodiploid: honey bee (males from unfertilised eggs, n = 16; females 2n = 32)", "Chromosomal sex determination."),
F("X-linked recessive", "haemophilia, colour blindness;  carrier mother (XᴴXʰ) × normal father → 50% sons affected, 50% daughters carriers", "Criss-cross inheritance.", "Affected females are rare — they need two copies of the recessive allele."),
F("Autosomal recessive disorders", "sickle-cell anaemia (GAG → GUG, glutamic acid → valine at 6th position of β-globin);  phenylketonuria (no phenylalanine hydroxylase);  thalassemia (α: chromosome 16, β: chromosome 11 — reduced globin synthesis)", "Mendelian disorders.", "Thalassemia is a quantitative problem (too little globin); sickle-cell is qualitative (wrong globin)."),
F("Chromosomal disorders", "Down's syndrome: trisomy 21 (47);  Klinefelter's: 47, XXY (male, gynaecomastia, sterile);  Turner's: 45, X0 (female, sterile, rudimentary ovaries)", "Aneuploidy.", None, tag="PYQ favourite"),
F("Pedigree symbols", "square = male, circle = female, shaded = affected, double line = consanguineous mating", "Reading family trees."),
],
"examples": [
X("Dihybrid fraction", "In a dihybrid F₂, what fraction shows both dominant traits?",
  f"{tall_round}/{total} (the 9 of 9:3:3:1).", [(str(tall_round), "9"), (str(total), "16")]),
X("Gametes from AaBbCc", "How many types of gametes does AaBbCc form?",
  f"2³ = {gametes_tri}.", [(str(gametes_tri), "8")]),
X("Genotypes in dihybrid F₂", "How many genotypes appear in a dihybrid F₂?",
  f"3² = {geno_di}.", [(str(geno_di), "9")]),
X("Colour-blind son", "A carrier woman marries a normal man. Chance that a son is colour blind?",
  f"Sons get X from mother: half get Xᶜ → {fx(prob_colour_blind_son)}% of sons.", [(fx(prob_colour_blind_son), "50")]),
X("Blood group of children", "Parents are Iᴬi and Iᴮi. Possible blood groups of children?",
  "IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B) and ii (O) — all four, each with probability 1/4.", []),
X("Why Drosophila?", "Why did Morgan choose Drosophila?",
  "Grows on simple synthetic medium, completes its life cycle in about two weeks, a single mating gives many offspring, males and females are easy to tell apart, and it has many hereditary variations visible under low-power microscopes.", []),
],
"topics": [
T("Mendel's experimental design", "Mendel used 14 true-breeding pea varieties with seven pairs of contrasting traits; pea is self-pollinating, short-lived and easy to cross. He used large samples and statistics. His work was rediscovered in 1900 by de Vries, Correns and von Tschermak."),
T("Law of dominance and segregation", "Characters are controlled by discrete factors (genes) occurring in pairs; in a dissimilar pair one dominates (dominance). Alleles separate during gamete formation so each gamete gets only one (segregation) — the law of purity of gametes."),
T("Punnett square", "A graphical grid developed by Reginald C. Punnett to calculate the probability of all possible genotypes of offspring in a genetic cross."),
T("Mutation", "A change in DNA sequence that alters genotype and phenotype. Point mutation: change in a single base pair (sickle-cell anaemia). Frameshift mutations: insertion or deletion of bases. Mutagens include UV radiation and chemicals."),
T("Chromosomal theory of inheritance", "Sutton and Boveri noted that chromosomes, like Mendel's factors, occur in pairs, segregate at gamete formation and assort independently. Sutton united chromosomal segregation with Mendelian principles."),
T("Aneuploidy and polyploidy", "Failure of chromatid segregation in cell division gives gain or loss of a chromosome (aneuploidy). Failure of cytokinesis after telophase gives a whole extra set (polyploidy), common in plants."),
],
"ratta": [
"Monohybrid 3:1 / 1:2:1;  dihybrid 9:3:3:1;  test cross 1:1.",
"Gametes 2ⁿ, genotypes 3ⁿ.",
"Snapdragon 1:2:1 = incomplete dominance;  ABO = co-dominance + multiple alleles.",
"Morgan: linkage;  Sturtevant: gene mapping.",
"Grasshopper XO;  birds ZW female;  honey bee haplodiploid.",
"Sickle-cell: GAG → GUG, Glu → Val.",
"Down 21 trisomy;  Klinefelter XXY;  Turner XO.",
],
}

SYLLABUS = [
("Mendelian inheritance; deviations from Mendelism — incomplete dominance, co-dominance, multiple alleles and inheritance of blood groups, pleiotropy; elementary idea of polygenic inheritance", ["Mendel", "incomplete dominance", "co-dominance", "multiple alleles", "pleiotropy", "polygenic"]),
("Chromosome theory of inheritance; chromosomes and genes; linkage and crossing over", ["chromosomal theory", "linkage", "recombination"]),
("Sex determination — in humans, birds and honey bee", ["sex determination", "honey bee", "birds"]),
("Sex-linked inheritance — haemophilia, colour blindness", ["haemophilia", "colour blindness"]),
("Mendelian disorders in humans — thalassemia; chromosomal disorders — Down's syndrome, Turner's and Klinefelter's syndromes", ["thalassemia", "Down", "Turner", "Klinefelter"]),
("Mutation; pedigree analysis", ["mutation", "pedigree"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Mendel (1856–1863, garden pea) ne inheritance ke laws diye: dominance, segregation aur independent assortment. Monohybrid F₂ ratio 3:1 (phenotype), 1:2:1 (genotype); dihybrid F₂ 9:3:3:1.",
"Mendel se hatke: incomplete dominance (snapdragon 1:2:1), co-dominance (ABO blood groups), multiple alleles, pleiotropy aur polygenic inheritance (skin colour).",
"Chromosomal theory of inheritance (Sutton aur Boveri) ne genes ko chromosomes par rakha; Morgan ke Drosophila kaam ne linkage aur recombination dikhaya. Sex determination chromosomes se (XX–XY, XX–XO, ZW–ZZ jaise birds mein) ya haplodiploidy (honey bee) se.",
"Mutation aur chromosomal badlaav disorders karte hain: Mendelian (haemophilia, colour blindness, sickle-cell anaemia, phenylketonuria, thalassemia) aur chromosomal (Down's, Klinefelter's, Turner's syndromes). Pedigree analysis parivaar mein traits trace karta hai.",
],
when=[
("Ek character.", None),
("Dominant phenotype ka anjaan genotype dhoondhna.", None),
("Do characters — law of independent assortment.", None),
("Jaldi ginti.", None),
("Koi allele poora dominant nahi.", None),
("Blood group genetics.", None),
("Simple dominance se aage.", None),
("Morgan ka Drosophila kaam.", None),
("Chromosomal sex determination.", None),
("Criss-cross inheritance.", "Affected females kam hoti hain — unhe recessive allele ki do copies chahiye."),
("Mendelian disorders.", "Thalassemia quantitative problem hai (globin kam banta hai); sickle-cell qualitative (galat globin) — dono ko mix mat karo."),
("Aneuploidy.", None),
("Family trees padhna.", None),
],
examples=[
("Dihybrid fraction", "Dihybrid F₂ mein kitna fraction dono dominant traits dikhata hai?",
 "⟨0⟩/⟨1⟩ (9:3:3:1 ka 9)."),
("AaBbCc se gametes", "AaBbCc kitne type ke gametes banata hai?",
 "2³ = ⟨0⟩."),
("Dihybrid F₂ mein genotypes", "Dihybrid F₂ mein kitne genotypes aate hain?",
 "3² = ⟨0⟩."),
("Colour-blind beta", "Carrier mahila normal aadmi se shaadi karti hai. Bete ke colour blind hone ka chance?",
 "Bete X maa se lete hain: aadhe ko Xᶜ milta hai → ⟨0⟩% bete."),
("Bachchon ka blood group", "Maa-baap Iᴬi aur Iᴮi hain. Bachchon ke sambhavit blood groups?",
 "IᴬIᴮ (AB), Iᴬi (A), Iᴮi (B) aur ii (O) — chaaron, har ek ki probability 1/4."),
("Drosophila kyun?", "Morgan ne Drosophila kyun chuna?",
 "Simple synthetic medium par palta hai, lagbhag do hafte mein life cycle poora, ek mating se bahut offspring, male aur female aasaani se pehchaane jaate hain, aur low-power microscope mein dikhne wale kai hereditary variations."),
],
topics=[
("Mendel's experimental design", "Mendel ne saat jodi contrasting traits wali 14 true-breeding pea varieties use ki; pea self-pollinating, kam umar wala aur cross karne mein aasaan hai. Bade samples aur statistics use kiye. Unka kaam 1900 mein de Vries, Correns aur von Tschermak ne dobara khoja."),
("Law of dominance and segregation", "Characters discrete factors (genes) control karte hain jo jodi mein hote hain; alag jodi mein ek dominate karta hai (dominance). Gamete bante waqt alleles alag hote hain, har gamete ko ek hi milta hai (segregation) — law of purity of gametes."),
("Punnett square", "Reginald C. Punnett ka banaya graphical grid jo genetic cross mein offspring ke saare sambhavit genotypes ki probability nikaalta hai."),
("Mutation", "DNA sequence mein badlaav jo genotype aur phenotype badalta hai. Point mutation: ek base pair mein badlaav (sickle-cell anaemia). Frameshift mutations: bases ka insertion ya deletion. Mutagens: UV radiation aur chemicals."),
("Chromosomal theory of inheritance", "Sutton aur Boveri ne dekha ki chromosomes bhi Mendel ke factors ki tarah jodi mein hote hain, gamete bante waqt alag hote hain aur independently assort hote hain. Sutton ne chromosomal segregation ko Mendelian principles se joda."),
("Aneuploidy and polyploidy", "Cell division mein chromatids alag na hone se ek chromosome badhta ya ghatta hai (aneuploidy). Telophase ke baad cytokinesis na hone se poora extra set (polyploidy), plants mein aam."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
