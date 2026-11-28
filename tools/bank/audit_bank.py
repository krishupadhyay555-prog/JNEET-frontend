"""Audit + clean the question bank (backend/seed/questions/*.json).

  python3 tools/bank/audit_bank.py          -> report only
  python3 tools/bank/audit_bank.py --apply  -> apply FIXES + remove duplicates

Duplicates removed (one copy of each group is kept):
  * exact   - same question after normalising symbols/spacing, same answer
  * para    - reworded copy: same numbers, same answer, only filler words differ
  * clone   - same template with different numbers that leads to the same answer
Wrong keys: FIXES below (applied 14 Nov 2026; skipped automatically once applied) were found by the explanation-vs-key scan (see scan_keys)
and every one was re-solved by hand before being listed.
"""
import json, re, glob, sys, difflib, itertools, collections, os, hashlib

ROOT = os.path.join(os.path.dirname(__file__), "..", "..", "backend", "seed", "questions")
SUP = str.maketrans({'⁰':'^0','¹':'^1','²':'^2','³':'^3','⁴':'^4','⁵':'^5','⁶':'^6','⁷':'^7','⁸':'^8','⁹':'^9','⁻':'^-','⁺':'^+',
                     '₀':'_0','₁':'_1','₂':'_2','₃':'_3','₄':'_4','₅':'_5','₆':'_6','₇':'_7','₈':'_8','₉':'_9'})

def mn(s):
    s = s.translate(SUP).lower()
    for a, b in (('−','-'),('–','-'),('’',"'"),('‘',"'"),('“','"'),('”','"'),('^-^','^-'),('^(','^'),('_(','_')):
        s = s.replace(a, b)
    s = re.sub(r'[{}()*\[\]]', '', s)
    s = re.sub(r'\b(from|of|the|a|an)\b', '', s)
    return re.sub(r'[\s:?.,;\'"]', '', s)

STOP = set("a an the of is are be by to in on at for from with and or as which what that this these those its it following among given will would can does do has have under into".split())
FILLER = set("""value remains if expected while evaluate undergoes undergo remaining readily compound then through formed reaction sample number contains when treated
one substance reacts obtained conditions rest produced assuming used fits so how find primarily during original initial unchanged until heated gives produces present required indicated
having show taking supplied involved process ordinary forms becomes performs observation consistent characteristics material exactly occurs exhibit suitable each reached matches corresponding
comparable possesses shows such strongly involving participate where description criteria satisfies satisfy take represents directly important after both because equal equals
polymerization polymerisation ionisation ionization alpha-hydrogen α-hydrogen alpha tollens tollens' neutralize neutralise stabilised stabilized remain undecayed nuclei isotope
simultaneously approximately approximate nearly about final resulting resultant respectively respective state states known called termed described identify identifies correctly correct best
typically generally usually mainly predominantly chiefly major main principal standard normal type kind form""".split())

def toks(s): return set(w for w in re.findall(r"[a-zα-ω0-9'+\-]+", s.lower().replace('−','-')) if w not in STOP)
def seq(s): return [w for w in re.findall(r"[a-zα-ω0-9'+\-^⁻¹²³]+", s.lower().replace('−','-')) if w not in STOP and w not in FILLER]
def nums(s): return re.findall(r'\d+(?:\.\d+)?', s.translate(SUP).replace('−','-'))
def ans(q): return mn(q['options'][q['correctIndex']]) if q.get('options') else '|'.join(sorted(mn(a) for a in q['answers']))
def opts(q): return set(mn(o) for o in q.get('options') or [])

# (file, sha1[:12] of the original questionText, snippet, change)
FIXES = [
 ("chemistry-jee.json", "48cfd0de8b53", "Na2CO3 and NaHCO3. A 4.00 g", {"key": 1}),
 ("chemistry-jee.json", "17f028872f79", "mole fraction of the solute is 0.020", {"key": 1}),
 ("chemistry-jee.json", "5e8e68382d76", "54.4 eV", {"key": 3}),
 ("chemistry-jee.json", "77533c801cdc", "2.31 × 10^-3 s^-1", {"key": 2}),
 ("chemistry-jee.json", "dee84e392711", "2.464 L", {"options": ["37.5%", "47.5%", "52.5%", "71.3%"], "key": 1,
   "explanation": "CO2 = 2.464/22.4 = 0.110 mol. Let x mol CaCO3 and (0.110 − x) mol MgCO3: 100x + 84(0.110 − x) = 10.0, so 16x = 0.76 and x = 0.0475 mol. Mass of CaCO3 = 4.75 g, i.e. 47.5%."}),
 ("chemistry-jee.json", "dac840cab75b", "2.24 L CO2", {"questionText": "A 10.0 g mixture of CaCO3 and MgCO3 on complete heating gives 2.45 L CO2 at STP. If the molar masses of CaCO3 and MgCO3 are 100 and 84 g mol−1 respectively, what is the approximate mass percentage of CaCO3?", "key": 1,
   "explanation": "CO2 = 2.45/22.4 = 0.1094 mol. With x mol CaCO3: 100x + 84(0.1094 − x) = 10.0, so 16x = 0.812 and x ≈ 0.0508 mol, i.e. about 5.08 g CaCO3 ≈ 50%."}),
 ("chemistry-jee.json", "fe55b5065011", "160 kg of the ore gives 112 kg", {"questionText": "An ore contains Fe2O3 and inert impurities. If 200 kg of the ore gives 112 kg of iron on complete reduction, what is the percentage by mass of Fe2O3 in the ore? (Fe = 56, O = 16)", "key": 2,
   "explanation": "160 g Fe2O3 contains 112 g Fe. So 112 kg Fe comes from 160 kg Fe2O3. Percentage of Fe2O3 in the ore = 160/200 × 100 = 80%."}),
 ("chemistry-jee.json", "4f36af918066", "residue weighs 1.38 g", {"options": ["42.0%", "63.0%", "84.0%", "91.0%"], "key": 2}),
 ("chemistry-jee.json", "ecc3ef0cba98", "0.80 V", {"options": ["1.3 × 10^12", "2.6 × 10^13", "1.2 × 10^27", "2.6 × 10^27"], "key": 2,
   "explanation": "log K = nE°/0.0591 = (2 × 0.80)/0.0591 ≈ 27.08, so K = 10^27.08 ≈ 1.2 × 10^27."}),
 ("chemistry-neet.json", "376255610dfe", "1.68 L CO2", {"key": 2}),
 ("chemistry-neet.json", "25b7c4ee1024", "87.5% completion", {"key": 1}),
 ("chemistry-neet.json", "bc8d4aff3be0", "0.80 mol CO2 and 0.60 mol H2O", {"key": 0,
   "explanation": "Per mole of hydrocarbon: 0.80/0.20 = 4 mol CO2 (4 C atoms) and 0.60/0.20 = 3 mol H2O (6 H atoms). Hence the formula is C4H6."}),
 ("chemistry-neet.json", "8af436b27034", "1.0 mol NaHCO3", {"key": 1}),
 ("chemistry-neet.json", "f52d5cd5adbb", "A(g) → 3B(g)", {"key": 0}),
 ("chemistry-neet.json", "d231c493e0a8", "1.76 g of CO2", {"key": 1}),
 ("chemistry-neet.json", "0f6397f0236e", "residue weighs 9.16 g", {"questionText": "A 12.0 g mixture of Na2CO3 and NaHCO3 is heated strongly until decomposition is complete. The residue weighs 8.90 g. What is the mass percentage of NaHCO3 in the original mixture? (Na2CO3 = 106 g mol−1, NaHCO3 = 84 g mol−1)",
   "options": ["50%", "60%", "70%", "80%"], "key": 2,
   "explanation": "Only NaHCO3 loses mass: 2NaHCO3 → Na2CO3 + CO2 + H2O, so 168 g NaHCO3 loses 62 g. Loss = 12.0 − 8.90 = 3.10 g, so NaHCO3 = 3.10 × 168/62 = 8.40 g = 70% of the mixture."}),
 ("chemistry-neet.json", "d1a1a4239c95", "residue weighs 8.45 g", {"options": ["21.0%", "42.0%", "58.0%", "84.0%"], "key": 1}),
 ("mathematics-jee.json", "e2ec8e5cef03", "(1,2,2) and (2,-1,2)", {"key": 1}),
 ("mathematics-jee.json", "f1b71394615d", "x^3−3x+a=0", {"key": 1}),
 ("mathematics-jee.json", "7e924cd32834", "skew lines", {"key": 3,
   "explanation": "Here b − a = (−1,1,1) and d1 × d2 = (1,1,0) × (1,0,1) = (1,−1,−1), with |d1 × d2| = √3. The scalar triple product (b − a)·(d1 × d2) = −3, so d = 3/√3 = √3."}),
 ("mathematics-jee.json", "a63c7df6f773", "centre (2,−3)", {"key": 1}),
 ("mathematics-jee.json", "09259c133f48", "λ^2+1=0", {"key": 2}),
 ("mathematics-jee.json", "c57cd236bc6a", "|z−1|=2|z+1|", {"options": ["3x^2+3y^2+10x+3=0", "3x^2+3y^2−10x+3=0", "x^2+y^2+10x+3=0", "3x^2+3y^2+10x−3=0"], "key": 0,
   "explanation": "With z = x + iy: (x−1)^2 + y^2 = 4[(x+1)^2 + y^2], i.e. x^2 − 2x + 1 + y^2 = 4x^2 + 8x + 4 + 4y^2. Hence 3x^2 + 3y^2 + 10x + 3 = 0 (a circle)."}),
 ("mathematics-jee.json", "b2418f2d5da7", "tan^(-1)(1/2)-tan^(-1)(1/3)", {"key": 0}),
 ("mathematics-jee.json", "38b5ad01ff63", "x^2-6x+13", {"options": ["tan^-1(x-3)+C", "(1/2)tan^-1((x-3)/2)+C", "2tan^-1(x-3)+C", "tan^-1((x-3)/2)+C"], "key": 1}),
 ("mathematics-jee.json", "40d896689cf3", "tan^-1(1/2)+tan^-1(1/5)", {"key": 0}),
 ("mathematics-jee.json", "75bec35544d1", "(1 + x)^8(1 − x)^5", {"options": ["−25", "−5", "25", "30"], "key": 2,
   "explanation": "(1+x)^8(1−x)^5 = (1+x)^3(1−x^2)^5. x^5 comes from x·x^4 → 3 × C(5,2) = 30 and from x^3·x^2 → 1 × (−5) = −5. Total = 25."}),
 ("physics-jee.json", "d8410f89acaf", "hanging block of mass 2m", {"key": 1}),
 ("physics-jee.json", "3d1e10032170", "T = 2.000 s", {"key": 1}),
 ("physics-jee.json", "cad9ddb788f9", "Q = x^2 y^(-1) z^3", {"key": 1}),
 ("physics-jee.json", "e83f5457420b", "fundamental frequency 120 Hz", {"key": 1}),
 ("physics-jee.json", "63c18fbcb2c0", "Q = A^2 B^3/C", {"key": 3}),
 ("physics-jee.json", "44ae3e1e62cc", "Q = A^2 B^3 / C", {"key": 2}),
 ("physics-jee.json", "3985b518cff0", "U(x)=ax^2-bx^3", {"key": 2}),
 ("physics-jee.json", "a6d71a384fbc", "9T", {"key": 0}),
 ("physics-jee.json", "61c7b58d586a", "X=(A^2B)/(C^3)", {"key": 3}),
 ("physics-jee.json", "c7a2bd0bc7e1", "uniform disc of mass M and radius R rolls", {"key": 1}),
 ("physics-jee.json", "3cbb7c9040f9", "isochoric heating from T to 3T", {"key": 3}),
 ("physics-jee.json", "3c4bb0a6e5b6", "F(x) = (12 - 4x)", {"key": 2}),
 ("physics-jee.json", "0c3524aa5869", "rotational kinetic energy is", {"key": 0}),
 ("physics-jee.json", "6f29803d1a51", "Q = A^3 B^2 / C^2", {"key": 3}),
 ("physics-jee.json", "52ef33996802", "distance 4R", {"key": 0}),
 ("physics-jee.json", "6390d3db6de2", "V to 8V", {"key": 0}),
 ("physics-jee.json", "c149a41beea4", "+q and +4q", {"key": 1}),
 ("physics-jee.json", "68abd0ef6bc5", "length 3L and area A/2", {"key": 1}),
 ("physics-jee.json", "7ad00cceae4d", "angle θ above the horizontal", {"key": 0}),
 ("physics-jee.json", "f8d86dfe755e", "(20.0 ± 0.2) cm", {"key": 1}),
 ("physics-jee.json", "43efe71a00b2", "T = (2.00 ± 0.02) s", {"key": 1}),
 ("physics-jee.json", "70430f1efd27", "v=(3t^2-12t+9)", {"options": ["4 m", "12 m", "16 m", "20 m"], "key": 3,
   "explanation": "x = t^3 − 6t^2 + 9t (x = 0 at t = 0). v = 3(t−1)(t−3): x(1) = 4 m (local max), x(3) = 0, and x(5) = 125 − 150 + 45 = 20 m. The largest value in 0 ≤ t ≤ 5 s is 20 m, at t = 5 s."}),
 ("physics-neet.json", "17b53758c7c6", "small mass m is gently placed at the rim", {"key": 3}),
 ("physics-neet.json", "b66d61ffdea3", "height equal to the Earth's radius", {"key": 0}),
 ("physics-neet.json", "a84f8d91ec90", "time period 2 s", {"key": 2}),
 ("physics-neet.json", "5f90f481f0f7", "X = A^2 B/C^3", {"key": 3}),
 ("physics-neet.json", "5e3202ae55f9", "n = 3 to n = 2", {"key": 1}),
 ("physics-neet.json", "00e50382c8a3", "Q = A^2B/C^3", {"key": 3}),
 ("physics-neet.json", "860a87a72de0", "Q = A^2B/C^3", {"key": 1}),
 ("physics-neet.json", "4a94e57d16dc", "6400 Bq", {"key": 0}),
 ("physics-neet.json", "ed1fe883b873", "2%, 1% and 2%", {"key": 3}),
 ("physics-neet.json", "8b61c1a623e6", "uniform rod of mass M", {"key": 0}),
 ("physics-neet.json", "f8b3f378bd54", "focal length 20 cm. An object is placed 30 cm", {"key": 3}),
 ("physics-neet.json", "6bd53ac9e1ad", "(20.0 ± 0.2) cm", {"key": 1}),
 ("physics-neet.json", "8854a31d1e81", "g/4", {"key": 0}),
 ("physics-neet.json", "f6f125a9a004", "(2.00 ± 0.02) s", {"key": 1}),
 ("physics-neet.json", "0c989053b8e8", "2.00 cm and 10.0 cm", {"key": 1}),
 ("physics-neet.json", "cf5feaaf2420", "rho = m/(lbh)", {"key": 1}),
 ("physics-neet.json", "c126b724b31a", "Q = a²b/c³", {"options": ["10%", "12%", "14%", "16%"], "key": 2}),
 ("physics-neet.json", "2be9eaf1a3d2", "horizontal force of 30 N", {"explanation": "Friction = 0.2 × 5 × 10 = 10 N, so net force = 20 N and a = 4 m/s². v² = 2as = 2 × 4 × 4 = 32, so v = √32 m/s ≈ 5.66 m/s."}),
 ("physics-neet.json", "96fcc0a6d33e", "X = A^2 B/(C sqrt(D))", {"options": ["M L^4 T^-4", "M L^3 T^-2", "M^2 L^3 T^-5", "M L^2 T^-3"], "key": 0,
   "explanation": "A^2 B = (MLT^-2)^2 (LT^-1) = M^2 L^3 T^-5. C√D = (ML^-2)(LT^-1) = M L^-1 T^-1. So X = M^2 L^3 T^-5 / (M L^-1 T^-1) = M L^4 T^-4."}),
]

def load():
    return {os.path.basename(f): json.load(open(f)) for f in sorted(glob.glob(os.path.join(ROOT, "*.json")))}

def qhash(text): return hashlib.sha1(text.encode()).hexdigest()[:12]

def apply_fixes(files, verbose=False):
    """Each fix is found by the sha1 of the question's ORIGINAL text, so re-running is safe:
    key/option fixes are idempotent, and a question whose text was fixed no longer matches."""
    n = 0
    for fn, h, snip, ch in FIXES:
        for q in files[fn]:
            if qhash(q["questionText"]) == h:
                assert snip in q["questionText"]
                for k, field in (("questionText", "questionText"), ("options", "options"), ("key", "correctIndex"), ("explanation", "explanation")):
                    if k in ch: q[field] = ch[k]
                n += 1
    return n

def find_duplicates(files):
    rows = [(fn, i, q) for fn, qs in files.items() for i, q in enumerate(qs)]
    groups = collections.defaultdict(list)
    for r in rows: groups[(r[2]['examMode'], r[2]['subject'], r[2].get('type', 'mcq'))].append(r)
    parent = {}
    def find(a):
        while parent.get(a, a) != a: a = parent[a]
        return a
    def union(a, b, why): parent[find(b)] = find(a); reasons[why] += 1
    reasons = collections.Counter()
    for lst in groups.values():
        by = collections.defaultdict(list)
        for r in lst: by[mn(r[2]['questionText'])].append(r)
        for rs in by.values():
            for r in rs[1:]:
                a, b = rs[0][2], r[2]
                if ans(a) == ans(b) or len(opts(a) & opts(b)) >= 3 or a.get('type') == 'fill_blank':
                    union((rs[0][0], rs[0][1]), (r[0], r[1]), 'exact')
        ch = collections.defaultdict(list)
        for r in lst: ch[r[2]['chapter']].append(r)
        for cl in ch.values():
            ns = [mn(r[2]['questionText']) for r in cl]
            for x, y in itertools.combinations(range(len(cl)), 2):
                if ns[x] == ns[y]: continue
                a, b = cl[x][2], cl[y][2]
                if ans(a) != ans(b): continue
                sm = difflib.SequenceMatcher(None, ns[x], ns[y], autojunk=False)
                if sm.real_quick_ratio() < 0.8 or sm.quick_ratio() < 0.8: continue
                rt = sm.ratio()
                if rt < 0.8: continue
                ka, kb = (cl[x][0], cl[x][1]), (cl[y][0], cl[y][1])
                if nums(a['questionText']) == nums(b['questionText']):
                    ov = len(opts(a) & opts(b)) if a.get('options') else 4
                    diff = toks(a['questionText']) ^ toks(b['questionText'])
                    if ov >= 2 and all(t in FILLER for t in diff) and \
                       difflib.SequenceMatcher(None, seq(a['questionText']), seq(b['questionText'])).ratio() >= 0.85:
                        union(ka, kb, 'para')
                else:
                    sa = [w for w in seq(a['questionText']) if not re.fullmatch(r'[\d.^\-⁻¹²³]+', w)]
                    sb = [w for w in seq(b['questionText']) if not re.fullmatch(r'[\d.^\-⁻¹²³]+', w)]
                    if rt >= 0.85 and difflib.SequenceMatcher(None, sa, sb).ratio() >= 0.9:
                        union(ka, kb, 'clone')
    clusters = collections.defaultdict(list)
    for k in list(parent): clusters[find(k)].append(k)
    remove = set()
    for root, members in clusters.items():
        allm = set(members) | {root}
        rank = lambda k: ('batch3' in k[0] or 'batch5' in k[0], files[k[0]][k[1]]['difficulty'] != 'tough', -len(files[k[0]][k[1]]['explanation']), k)
        keep = min(allm, key=rank)
        remove |= allm - {keep}
    return remove, reasons

def write(files, touched):
    for fn in touched:
        indent = 1 if fn.startswith('fill-blanks') else 2
        with open(os.path.join(ROOT, fn), 'w') as fh:
            fh.write(json.dumps(files[fn], indent=indent, ensure_ascii=False) + "\n")

if __name__ == "__main__":
    files = load()
    before = sum(len(v) for v in files.values())
    nfix = apply_fixes(files, verbose=True)
    remove, reasons = find_duplicates(files)
    print(f"bank: {before} questions | key/content fixes: {nfix} | duplicates to remove: {len(remove)} {dict(reasons)}")
    per = collections.Counter(fn for fn, _ in remove); print(dict(per))
    if "--apply" in sys.argv:
        touched = set(fn for fn, *_ in FIXES) | set(per)
        for fn in per:
            files[fn] = [q for i, q in enumerate(files[fn]) if (fn, i) not in remove]
        write(files, touched)
        print("after:", sum(len(v) for v in files.values()))
