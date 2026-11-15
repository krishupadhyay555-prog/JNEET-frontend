from lib import F, X, T, sig, fx, _check_and_write

human_bp = 6.6e9
dna_len = human_bp * 0.34e-9
A_pct = 20
G_pct = (100 - 2 * A_pct) / 2
ecoli_bp = 1.36e-3 / 0.34e-9 / 1e6  # million bp
codons = 3 * 100

DOC = {
"slug": "molecular-basis-of-inheritance", "subject": "Biology",
"chapters": {"NEET": "Molecular Basis of Inheritance"},
"title": "Molecular Basis of Inheritance", "readMinutes": 17,
"summary": [
"DNA is the genetic material in most organisms (RNA in some viruses). Watson and Crick (1953) proposed the double helix: two antiparallel polynucleotide strands with A=T and G≡C pairing (Chargaff's rule).",
"Griffith (transformation), Avery–MacLeod–McCarty (transforming principle is DNA) and Hershey–Chase (bacteriophage, ³²P vs ³⁵S) proved DNA is the genetic material. Meselson and Stahl proved semi-conservative replication.",
"The central dogma: DNA → (transcription) → RNA → (translation) → protein. The genetic code is triplet, degenerate, universal (nearly) and non-overlapping.",
"Gene expression is regulated — the lac operon of E. coli is the classic example. The Human Genome Project and DNA fingerprinting apply this knowledge.",
],
"formulas": [
F("Chargaff's rule", "A = T, G = C;  (A + G) = (T + C);  purines = pyrimidines", "Base composition of dsDNA.", "Does not apply to single-stranded DNA or RNA.", tag="PYQ favourite"),
F("B-DNA dimensions", "diameter 2 nm;  pitch 3.4 nm;  10 bp per turn;  0.34 nm between bp;  right-handed, antiparallel (5′→3′ and 3′→5′)", "Watson–Crick model."),
F("Length of DNA", "length = number of bp × 0.34 nm;  human diploid ≈ 6.6 × 10⁹ bp → ≈ 2.2 m", "DNA length calculations.", None, tag="PYQ favourite"),
F("Genome sizes", "φ × 174: 5386 nucleotides;  λ phage: 48,502 bp;  E. coli: 4.6 × 10⁶ bp;  human haploid: 3.3 × 10⁹ bp", "Standard genome sizes.", "Exam questions often use an E. coli DNA length of 1.36 mm, which works out to 4 × 10⁶ bp."),
F("Packaging", "nucleosome = histone octamer (positively charged, rich in lysine and arginine) + ~200 bp DNA;  beads-on-string → chromatin fibre;  euchromatin (loose, active) vs heterochromatin (dense, inactive)", "DNA packaging in eukaryotes."),
F("Key experiments", "Griffith 1928: S and R strains of Streptococcus pneumoniae — transformation;  Avery, MacLeod, McCarty 1944: DNA is the transforming principle;  Hershey–Chase 1952: ³²P (DNA) entered bacteria, ³⁵S (protein) did not", "Proving DNA is genetic material.", None, tag="PYQ favourite"),
F("Replication", "semi-conservative (Meselson–Stahl 1958, ¹⁵N in E. coli; Taylor in Vicia faba);  DNA polymerase works 5′→3′;  leading strand continuous, lagging strand discontinuous (Okazaki fragments joined by DNA ligase);  starts at origin of replication", "DNA replication."),
F("Transcription unit", "promoter (upstream) — structural gene — terminator;  template strand 3′→5′; coding strand 5′→3′ (same sequence as RNA, with T instead of U)", "Parts of a transcription unit."),
F("RNA polymerases (eukaryotes)", "RNA pol I → rRNAs (28S, 18S, 5.8S);  RNA pol II → hnRNA (precursor of mRNA);  RNA pol III → tRNA, 5S rRNA, snRNA", "Which polymerase makes which RNA.", None, tag="PYQ favourite"),
F("Processing of hnRNA", "splicing (introns removed, exons joined);  capping (methyl guanosine triphosphate at 5′ end);  tailing (poly-A tail at 3′ end)", "Making mature mRNA in eukaryotes."),
F("Genetic code", "triplet (64 codons, 61 code for amino acids);  start AUG (methionine);  stop UAA, UAG, UGA;  unambiguous, degenerate, universal (some exceptions), commaless", "Properties of the code.", None, tag="PYQ favourite"),
F("Translation", "ribosome (small subunit binds mRNA); tRNA (adapter, clover-leaf; anticodon) carries amino acids (charging/aminoacylation);  peptide bond formed by 23S rRNA (ribozyme) in bacteria;  UTRs at both ends", "Protein synthesis."),
F("Lac operon", "i (repressor gene) — p (promoter) — o (operator) — z (β-galactosidase), y (permease), a (transacetylase);  lactose (inducer) inactivates repressor → genes transcribed", "Inducible gene regulation (Jacob and Monod).", "Negative regulation: the repressor turns the operon off."),
F("Human Genome Project facts", "3164.7 million bp;  about 30,000 genes (far fewer than the earlier estimates of 80,000–1,40,000);  average gene 3000 bases (dystrophin largest, 2.4 million bases);  less than 2% codes for proteins;  chromosome 1 most genes (2968), Y fewest (231);  SNPs ~1.4 million locations", "HGP results."),
F("DNA fingerprinting", "uses VNTRs (minisatellites, repetitive DNA) — Southern blotting with labelled VNTR probe (Alec Jeffreys);  applications: forensics, paternity, population diversity", "Identifying individuals."),
],
"examples": [
X("Length of human DNA", "Human diploid DNA has 6.6 × 10⁹ bp. Length?",
  f"6.6 × 10⁹ × 0.34 × 10⁻⁹ m = {fx(dna_len, 2)} m.", [(fx(dna_len, 2), "2.24")]),
X("Chargaff", "A dsDNA has 20% adenine. Percentage of guanine?",
  f"A = T = 20%, so G + C = 60% and G = {fx(G_pct)}%.", [(fx(G_pct), "30")]),
X("E. coli base pairs", "E. coli DNA is 1.36 mm long. How many base pairs?",
  f"1.36 × 10⁻³ m / 0.34 × 10⁻⁹ m = {fx(ecoli_bp)} × 10⁶ bp.", [(fx(ecoli_bp), "4")]),
X("Bases for a protein", "How many nucleotides (excluding stop codon) code for a protein of 100 amino acids?",
  f"3 × 100 = {codons} nucleotides.", [(str(codons), "300")]),
X("Hershey–Chase", "Bacteria infected by phage with ³⁵S-labelled protein: where is the radioactivity after centrifugation?",
  "In the supernatant (with the phage coats), not in the bacteria — showing that protein does not enter the bacteria; DNA (³²P) does.", []),
X("mRNA from coding strand", "Coding strand: 5′-ATGCAT-3′. mRNA?",
  "5′-AUGCAU-3′ — same as the coding strand with U in place of T.", []),
],
"topics": [
T("RNA world", "RNA was the first genetic material; it can act as a catalyst (ribozyme) and is reactive and unstable. DNA evolved from RNA with chemical changes (2′-OH absent, thymine instead of uracil) that make it more stable."),
T("Properties of genetic material", "It must replicate, be chemically and structurally stable, allow slow changes (mutation) for evolution and express itself as Mendelian characters."),
T("Transcription in bacteria", "One RNA polymerase makes all RNAs. Initiation needs the σ (sigma) factor; termination needs the ρ (rho) factor. Transcription and translation can happen together because there is no nuclear membrane."),
T("Split genes", "Eukaryotic genes have coding exons interrupted by non-coding introns; introns are removed by splicing. Monocistronic genes are mostly eukaryotic; polycistronic genes are mostly bacterial."),
T("Mutations and the code", "Point mutations change a single base (e.g. sickle-cell). Insertion or deletion of one or two bases shifts the reading frame (frameshift); three bases add or remove one amino acid without shifting the frame."),
T("Methodology of HGP", "Expressed sequence tags (identifying expressed genes) and sequence annotation (sequencing the whole genome). DNA was cloned into BAC and YAC vectors, sequenced with automated sequencers (Sanger method) and assembled by computer."),
],
"ratta": [
"A = T, G = C;  0.34 nm per bp;  10 bp per turn.",
"Human DNA 2.2 m;  E. coli DNA 1.36 mm → 4 × 10⁶ bp.",
"Griffith → Avery → Hershey–Chase (³²P DNA, ³⁵S protein).",
"Meselson–Stahl: ¹⁵N, semi-conservative.",
"Pol I rRNA, Pol II hnRNA, Pol III tRNA/5S/snRNA.",
"AUG start;  UAA, UAG, UGA stop;  61 sense codons.",
"Lac operon: i, p, o, z, y, a;  lactose = inducer.",
"Chromosome 1 most genes, Y fewest.",
],
}

SYLLABUS = [
("Search for genetic material and DNA as genetic material; structure of DNA and RNA; DNA packaging", ["genetic material", "double helix", "nucleosome"]),
("DNA replication", ["replication", "Okazaki"]),
("Central dogma; transcription, genetic code, translation", ["central dogma", "transcription", "genetic code", "translation"]),
("Gene expression and regulation — lac operon", ["lac operon"]),
("Genome, Human and rice genome projects; DNA fingerprinting", ["Human Genome Project", "fingerprinting"]),
]

if __name__ == "__main__":
    _check_and_write(DOC, SYLLABUS, DOC["slug"] + ".json", "english")
