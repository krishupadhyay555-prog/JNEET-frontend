"""Builders + checks for hand-made question batches (tools/bank/b3_*.py).

Every numerical question is built from a function that COMPUTES the answer, so the key
can't drift from the working. Wrong options come from the classic mistakes. On top:
  * 4 distinct options, exactly one keyed, key position spread deterministically
  * chapter must be a real chapter of that exam + subject
  * no duplicate of any question already in the bank (normalised text) or in the batch
  * no "all of the above" / "none of these" / "both A and B" options
"""
import hashlib, json, math, os, re, sys, glob, collections
from fractions import Fraction

sys.path.insert(0, os.path.dirname(__file__))
from audit_bank import mn, ROOT  # same normaliser as the duplicate audit

CHAPTERS = {
    ("NEET", "Physics"): """Units and Measurement|Kinematics|Laws of Motion|Work, Energy and Power|System of Particles and Rotational Motion|Gravitation|Mechanical Properties of Solids and Fluids|Thermal Properties of Matter|Thermodynamics|Kinetic Theory|Oscillations|Waves|Electrostatics|Current Electricity|Moving Charges and Magnetism|Magnetism and Matter|Electromagnetic Induction|Alternating Current|Electromagnetic Waves|Ray Optics and Optical Instruments|Wave Optics|Dual Nature of Radiation and Matter|Atoms|Nuclei|Semiconductor Electronics""",
    ("NEET", "Chemistry"): """Some Basic Concepts of Chemistry|Atomic Structure|Classification of Elements and Periodicity|Chemical Bonding and Molecular Structure|Thermodynamics|Equilibrium|Redox Reactions and Electrochemistry|Solutions|Chemical Kinetics|p-Block Elements|d- and f-Block Elements|Coordination Compounds|Organic Chemistry Basic Principles|Hydrocarbons|Haloalkanes and Haloarenes|Alcohols, Phenols and Ethers|Aldehydes, Ketones and Carboxylic Acids|Amines|Biomolecules|Practical Chemistry""",
    ("NEET", "Biology"): """The Living World|Biological Classification|Plant Kingdom|Animal Kingdom|Morphology of Flowering Plants|Anatomy of Flowering Plants|Structural Organisation in Animals|Cell: The Unit of Life|Biomolecules|Cell Cycle and Cell Division|Transport in Plants|Mineral Nutrition|Photosynthesis in Plants|Respiration in Plants|Plant Growth and Development|Digestion and Absorption|Breathing and Exchange of Gases|Body Fluids and Circulation|Excretory Products and Their Elimination|Locomotion and Movement|Neural Control and Coordination|Chemical Coordination and Integration|Sexual Reproduction in Flowering Plants|Human Reproduction|Reproductive Health|Principles of Inheritance and Variation|Molecular Basis of Inheritance|Evolution|Human Health and Disease|Strategies for Enhancement in Food Production|Microbes in Human Welfare|Biotechnology: Principles and Processes|Biotechnology and its Applications|Organisms and Populations|Ecosystem|Biodiversity and Conservation|Environmental Issues""",
    ("JEE", "Mathematics"): """Sets, Relations and Functions|Complex Numbers and Quadratic Equations|Matrices and Determinants|Permutations and Combinations|Binomial Theorem|Sequences and Series|Limits, Continuity and Differentiability|Differentiation|Application of Derivatives|Indefinite Integrals|Definite Integrals|Application of Integrals|Differential Equations|Straight Lines|Circles|Conic Sections|Vector Algebra|Three Dimensional Geometry|Statistics|Probability|Trigonometric Functions and Equations|Inverse Trigonometric Functions""",
}
CHAPTERS[("JEE", "Physics")] = CHAPTERS[("NEET", "Physics")]
CHAPTERS[("JEE", "Chemistry")] = CHAPTERS[("NEET", "Chemistry")].replace("|Practical Chemistry", "")
CHAPTERS = {k: set(v.split("|")) for k, v in CHAPTERS.items()}

CATS = ("tough", "formula", "ncert", "concept", "discovery")
BANNED = re.compile(r"\b(all of the above|none of (?:the|these)(?: above)?|both (?:a|b|\(a\)) and)\b", re.I)

OUT = []          # finished question dicts (+ "_cat" for the report)
CAT = {}          # (examMode, questionText) -> category, for the report
_seen = set()


def _exams(exam):
    return ["NEET", "JEE"] if exam == "BOTH" else [exam]


def _place(text, correct, wrongs):
    """Deterministic, evenly spread key position (0-3) from the question text."""
    pos = int(hashlib.sha1(text.encode()).hexdigest(), 16) % 4
    opts = list(wrongs)
    opts.insert(pos, correct)
    return opts, pos


def mcq(exam, subject, chapter, cat, diff, text, correct, wrongs, expl):
    assert cat in CATS and diff in ("easy", "moderate", "tough"), (cat, diff)
    wrongs = [str(w) for w in wrongs]
    correct = str(correct)
    assert len(wrongs) == 3, (text, wrongs)
    allo = [correct] + wrongs
    assert len({re.sub(r"\s+", "", o.lower()).replace("−", "-") for o in allo}) == 4, f"options not distinct: {allo} | {text[:70]}"
    assert not any(BANNED.search(o) for o in allo), text
    assert expl.strip(), text
    for ex in _exams(exam):
        assert chapter in CHAPTERS[(ex, subject)], (ex, subject, chapter)
        opts, pos = _place(text, correct, wrongs)
        OUT.append({"examMode": ex, "subject": subject, "chapter": chapter, "difficulty": diff, "level": "main",
                    "type": "mcq", "questionText": text, "options": opts, "correctIndex": pos,
                    "explanation": expl, "_cat": cat})


def blank(exam, subject, chapter, cat, diff, text, answers, expl):
    assert text.count("____") == 1, text
    for ex in _exams(exam):
        assert chapter in CHAPTERS[(ex, subject)], (ex, subject, chapter)
        OUT.append({"examMode": ex, "subject": subject, "chapter": chapter, "type": "fill_blank", "difficulty": diff,
                    "questionText": text, "answers": list(answers), "explanation": expl, "level": "main", "_cat": cat})


# ---------- number formatting ----------
SUPMAP = str.maketrans("-0123456789", "⁻⁰¹²³⁴⁵⁶⁷⁸⁹")


def sig(x, n=3):
    """Plain-text number with n significant figures; scientific form for very big/small."""
    if x == 0:
        return "0"
    e = int(math.floor(math.log10(abs(x))))
    if -3 <= e < 5:
        d = max(n - 1 - e, 0)
        s = f"{x:.{d}f}"
        if "." in s:
            s = s.rstrip("0").rstrip(".")
        return s.replace("-", "−")
    m = x / 10 ** e
    ms = f"{m:.{n-1}f}".rstrip("0").rstrip(".")
    if ms in ("10",):
        ms, e = "1", e + 1
    return f"{ms} × 10{str(e).translate(SUPMAP)}".replace("-", "−")


def frac(fr):
    fr = Fraction(fr).limit_denominator(10000)
    s = str(fr.numerator) if fr.denominator == 1 else f"{fr.numerator}/{fr.denominator}"
    return s.replace("-", "−")


def u(x, unit, n=3):
    return f"{sig(x, n)} {unit}"


def near(a, b, tol=1e-6):
    return abs(a - b) <= tol * max(1, abs(a), abs(b))


# ---------- write + report ----------
def write_all():
    bank = collections.defaultdict(set)
    for f in glob.glob(os.path.join(ROOT, "*.json")):
        if "batch3" in f:
            continue
        for q in json.load(open(f)):
            bank[q["examMode"]].add(mn(q["questionText"]))
    files = collections.defaultdict(list)
    skipped = []
    for q in OUT:
        k = mn(q["questionText"])
        if k in bank[q["examMode"]]:
            skipped.append(q["questionText"]); continue
        assert (q["examMode"], k) not in _seen, f"duplicate in batch: {q['questionText'][:80]}"
        _seen.add((q["examMode"], k))
        CAT[(q["examMode"], q["questionText"])] = q.pop("_cat")
        files[f"{q['subject'].lower()}-{q['examMode'].lower()}-batch3.json"].append(q)
    for fn, qs in files.items():
        with open(os.path.join(ROOT, fn), "w") as fh:
            fh.write(json.dumps(qs, indent=2, ensure_ascii=False) + "\n")
    return files, skipped
