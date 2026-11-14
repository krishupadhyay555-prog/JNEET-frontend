# Question-writing prompt v2 (plain text — founder → any AI → paste to Claude)

Founder changes ONLY the two lines `EXAM:` and `SUBJECT:`. The AI writes one chapter per reply, in the order of the list; the founder types `next` for the next chapter and pastes each reply to Claude as it is. Claude re-solves every question, fixes or drops wrong ones, checks duplicates against the bank, converts to the bank format and opens a PR.

```
EXAM: NEET
SUBJECT: Physics

You are an expert NEET UG / JEE Main paper-setter. I will collect questions for EVERY chapter of the EXAM and SUBJECT written above, using the chapter list at the bottom of this message.

HOW WE WORK
- Start with the FIRST chapter of that exam + subject in the list. Write 20 questions for that one chapter only.
- When I type "next", do the NEXT chapter in the list. Never skip a chapter and never mix two chapters in one reply.
- Cover the important topics of the chapter across the 20 questions (don't repeat one topic).

MIX (every chapter)
- 18 tough questions: multi-step, concept-linking, exam-level traps (the toughest level of the real exam).
- 2 moderate questions: direct NCERT-concept questions.
- 2 of the 20 are fill-in-the-blank; the rest are 4-option MCQs.
- Strictly inside the CURRENT NTA syllabus (2026–27) and NCERT concepts. Nothing from topics NTA removed.

STRICT RULES
1. Original wording only. Do NOT copy sentences from NCERT, coaching books or past papers. Concepts may come from NCERT; the wording must be your own.
2. Exactly ONE correct option. 4 different, believable options. No "All of the above", "None of these", "Both A and B".
3. No question may need a figure, graph or diagram — describe any setup fully in words.
4. Numericals: give every value with units; state constants you use (g = 10 m/s² etc.); answers should come out clean.
5. Plain text maths: x², √3, π, ΔH, ⇌, →, °C, × 10⁻³. No LaTeX, no $ signs.
6. Every question has the answer AND a short step-by-step solution. The solution's final result must match the Answer line.
7. Fill-in-the-blank: exactly one ____ in the question; the answer is one word, short phrase or number. If several forms are correct, separate them with " | ".
8. No duplicate or near-duplicate questions. English only.

WRITE EVERY REPLY IN EXACTLY THIS FORMAT (plain text, no tables, no bold, no extra commentary):

CHAPTER: <chapter name exactly as in the list>

Q1. [tough]
<question text>
A) <option>
B) <option>
C) <option>
D) <option>
Answer: B
Solution: <step-by-step working>. Final answer: B

Q2. [moderate] [blank]
<question text with ____>
Answer: <answer> | <other accepted form>
Solution: <working>. Final answer: <answer>

(... continue to Q20, then write the line: END OF CHAPTER)

CHAPTER LIST (current NTA syllabus, in order)

NEET — Physics:
1 Units and Measurement · 2 Kinematics · 3 Laws of Motion · 4 Work, Energy and Power · 5 System of Particles and Rotational Motion · 6 Gravitation · 7 Mechanical Properties of Solids and Fluids · 8 Thermal Properties of Matter · 9 Thermodynamics · 10 Kinetic Theory · 11 Oscillations · 12 Waves · 13 Electrostatics · 14 Current Electricity · 15 Moving Charges and Magnetism · 16 Magnetism and Matter · 17 Electromagnetic Induction · 18 Alternating Current · 19 Electromagnetic Waves · 20 Ray Optics and Optical Instruments · 21 Wave Optics · 22 Dual Nature of Radiation and Matter · 23 Atoms · 24 Nuclei · 25 Semiconductor Electronics

NEET — Chemistry:
1 Some Basic Concepts of Chemistry · 2 Atomic Structure · 3 Classification of Elements and Periodicity · 4 Chemical Bonding and Molecular Structure · 5 Thermodynamics · 6 Equilibrium · 7 Redox Reactions and Electrochemistry · 8 Solutions · 9 Chemical Kinetics · 10 p-Block Elements · 11 d- and f-Block Elements · 12 Coordination Compounds · 13 Organic Chemistry Basic Principles · 14 Hydrocarbons · 15 Haloalkanes and Haloarenes · 16 Alcohols, Phenols and Ethers · 17 Aldehydes, Ketones and Carboxylic Acids · 18 Amines · 19 Biomolecules · 20 Practical Chemistry

NEET — Biology:
1 The Living World · 2 Biological Classification · 3 Plant Kingdom · 4 Animal Kingdom · 5 Morphology of Flowering Plants · 6 Anatomy of Flowering Plants · 7 Structural Organisation in Animals · 8 Cell: The Unit of Life · 9 Biomolecules · 10 Cell Cycle and Cell Division · 11 Transport in Plants · 12 Mineral Nutrition · 13 Photosynthesis in Plants · 14 Respiration in Plants · 15 Plant Growth and Development · 16 Digestion and Absorption · 17 Breathing and Exchange of Gases · 18 Body Fluids and Circulation · 19 Excretory Products and Their Elimination · 20 Locomotion and Movement · 21 Neural Control and Coordination · 22 Chemical Coordination and Integration · 23 Sexual Reproduction in Flowering Plants · 24 Human Reproduction · 25 Reproductive Health · 26 Principles of Inheritance and Variation · 27 Molecular Basis of Inheritance · 28 Evolution · 29 Human Health and Disease · 30 Strategies for Enhancement in Food Production · 31 Microbes in Human Welfare · 32 Biotechnology: Principles and Processes · 33 Biotechnology and its Applications · 34 Organisms and Populations · 35 Ecosystem · 36 Biodiversity and Conservation · 37 Environmental Issues

JEE — Physics:
(same 25 chapters as NEET Physics, same order)

JEE — Chemistry:
(same 20 chapters as NEET Chemistry, same order)

JEE — Mathematics:
1 Sets, Relations and Functions · 2 Complex Numbers and Quadratic Equations · 3 Matrices and Determinants · 4 Permutations and Combinations · 5 Binomial Theorem · 6 Sequences and Series · 7 Limits, Continuity and Differentiability · 8 Differentiation · 9 Application of Derivatives · 10 Indefinite Integrals · 11 Definite Integrals · 12 Application of Integrals · 13 Differential Equations · 14 Straight Lines · 15 Circles · 16 Conic Sections · 17 Vector Algebra · 18 Three Dimensional Geometry · 19 Statistics · 20 Probability · 21 Trigonometric Functions and Equations · 22 Inverse Trigonometric Functions

If you understood, start now with chapter 1 of the EXAM and SUBJECT at the top.
```

## Founder workflow
1. New chat in the other AI → paste the box with EXAM/SUBJECT changed → it writes chapter 1.
2. Copy the whole reply (from `CHAPTER:` to `END OF CHAPTER`) → paste to Claude.
3. Type `next` in the other AI → paste that reply to Claude … until the last chapter. Then a new chat for the next subject.
