# Question-writing prompt (founder → any AI → paste output to Claude for verification)

Use: copy everything inside the box, change only the first 3 lines (EXAM / SUBJECT / CHAPTER), send it to the AI, copy its reply **exactly** (the whole ```json block) and paste it to Claude. One chapter per message, 25 questions per message. Claude re-solves every question, fixes or drops wrong ones, checks duplicates against the bank, and only then adds them.

```
EXAM: NEET            (or JEE)
SUBJECT: Physics      (NEET: Physics / Chemistry / Biology · JEE: Physics / Chemistry / Mathematics)
CHAPTER: Electrostatics   (copy the name EXACTLY from the list at the bottom)

You are an expert NEET UG / JEE Main paper-setter. Write 25 ORIGINAL questions for the exam, subject and chapter above.

MIX
- 22–23 questions "tough": multi-step, concept-linking, exam-level traps (JEE Main / NEET toughest-section level).
- 2–3 questions "moderate": direct NCERT-concept questions.
- Include 2 fill-in-the-blank questions (type "fill_blank"); all others are 4-option MCQs (type "mcq").
- Stay strictly inside the CURRENT NTA syllabus (2026–27) for this chapter and inside NCERT concepts. Nothing from topics NTA removed.

STRICT RULES
1. Original wording only. Do NOT copy text from NCERT, coaching books (Allen, Aakash, PW, Resonance, etc.) or past papers. Concepts may come from NCERT; sentences must be your own.
2. Exactly ONE correct option. All 4 options different, same type/units, believable. No "All of the above", "None of these", "Both A and B".
3. No question may need a figure, graph, table image or diagram. If a setup is needed, describe it fully in words.
4. Numericals: give every value needed, with units. Use standard values (g = 10 m/s² unless stated, h = 6.63 × 10⁻³⁴ J s, etc.) and state them in the question. Make the answer come out clean.
5. Write maths in plain Unicode: x², √3, π, ΔH, ⇌, →, °C, ×10⁻³. NO LaTeX, no $ signs.
6. Every solution: full step-by-step working, then the line "Final answer: X" where X is the option letter (or the blank's word/number). The final answer MUST match the "answer" field.
7. Fill-in-the-blank: the question contains exactly one "____". "answers" lists every acceptable form (e.g. ["mitochondria", "mitochondrion"], ["2.5", "2.50"]). Answer is a single word, short phrase or number — never a sentence.
8. No duplicate or near-duplicate questions within the 25.
9. English only.

OUTPUT FORMAT — reply with ONLY one JSON block, nothing before or after it:

```json
[
  {
    "exam": "NEET",
    "subject": "Physics",
    "chapter": "Electrostatics",
    "difficulty": "tough",
    "type": "mcq",
    "question": "Two point charges ... ?",
    "options": ["A text", "B text", "C text", "D text"],
    "answer": "C",
    "solution": "Step 1: ... Step 2: ... Final answer: C"
  },
  {
    "exam": "NEET",
    "subject": "Physics",
    "chapter": "Electrostatics",
    "difficulty": "moderate",
    "type": "fill_blank",
    "question": "The SI unit of electric flux is ____.",
    "answers": ["N m²/C", "N·m²/C", "V m", "V·m"],
    "solution": "Flux = E × A ... Final answer: N m²/C"
  }
]
```
(options are given WITHOUT "A)" / "B)" prefixes; "answer" is the letter A/B/C/D.)

CHAPTER NAMES (use exactly as written)
NEET Physics / JEE Physics: Units and Measurement; Kinematics; Laws of Motion; Work, Energy and Power; System of Particles and Rotational Motion; Gravitation; Mechanical Properties of Solids and Fluids; Thermal Properties of Matter; Thermodynamics; Kinetic Theory; Oscillations; Waves; Electrostatics; Current Electricity; Moving Charges and Magnetism; Magnetism and Matter; Electromagnetic Induction; Alternating Current; Electromagnetic Waves; Ray Optics and Optical Instruments; Wave Optics; Dual Nature of Radiation and Matter; Atoms; Nuclei; Semiconductor Electronics
NEET Chemistry / JEE Chemistry: Some Basic Concepts of Chemistry; Atomic Structure; Classification of Elements and Periodicity; Chemical Bonding and Molecular Structure; Thermodynamics; Equilibrium; Redox Reactions and Electrochemistry; Solutions; Chemical Kinetics; p-Block Elements; d- and f-Block Elements; Coordination Compounds; Organic Chemistry Basic Principles; Hydrocarbons; Haloalkanes and Haloarenes; Alcohols, Phenols and Ethers; Aldehydes, Ketones and Carboxylic Acids; Amines; Biomolecules; Practical Chemistry
NEET Biology: The Living World; Biological Classification; Plant Kingdom; Animal Kingdom; Morphology of Flowering Plants; Anatomy of Flowering Plants; Structural Organisation in Animals; Cell: The Unit of Life; Biomolecules; Cell Cycle and Cell Division; Transport in Plants; Mineral Nutrition; Photosynthesis in Plants; Respiration in Plants; Plant Growth and Development; Digestion and Absorption; Breathing and Exchange of Gases; Body Fluids and Circulation; Excretory Products and Their Elimination; Locomotion and Movement; Neural Control and Coordination; Chemical Coordination and Integration; Sexual Reproduction in Flowering Plants; Human Reproduction; Reproductive Health; Principles of Inheritance and Variation; Molecular Basis of Inheritance; Evolution; Human Health and Disease; Strategies for Enhancement in Food Production; Microbes in Human Welfare; Biotechnology: Principles and Processes; Biotechnology and its Applications; Organisms and Populations; Ecosystem; Biodiversity and Conservation; Environmental Issues
JEE Mathematics: Sets, Relations and Functions; Complex Numbers and Quadratic Equations; Matrices and Determinants; Permutations and Combinations; Binomial Theorem; Sequences and Series; Limits, Continuity and Differentiability; Differentiation; Application of Derivatives; Indefinite Integrals; Definite Integrals; Application of Integrals; Differential Equations; Straight Lines; Circles; Conic Sections; Vector Algebra; Three Dimensional Geometry; Statistics; Probability; Trigonometric Functions and Equations; Inverse Trigonometric Functions
```

## What Claude does with each pasted batch
1. Parse the JSON; reject a batch that isn't valid JSON (ask for a re-paste).
2. Re-solve every question (code/sympy for numericals, careful reading for theory); a wrong key is fixed only if the correct answer is certain, otherwise the question is dropped.
3. Check: 4 distinct options, one correct, no figure needed, syllabus, chapter name, duplicates against the 13,095-question bank.
4. Convert to the bank format, run the bank tests, open a PR with counts (added / fixed / dropped and why). The founder runs the seed after merge.
