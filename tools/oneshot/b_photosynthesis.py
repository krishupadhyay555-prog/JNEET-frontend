from lib import F, X, T, sig, fx, _check_and_write

turns = 6
atp = 3 * turns
nadph = 2 * turns
c4_atp = 5 * turns

DOC = {
"slug": "photosynthesis-in-higher-plants", "subject": "Biology",
"chapters": {"NEET": "Photosynthesis in Plants"},
"title": "Photosynthesis in Higher Plants", "readMinutes": 15,
"summary": [
"Photosynthesis is the basis of autotrophic nutrition: it converts light energy into chemical energy: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂. It happens in chloroplasts — light reactions in the grana (thylakoids), dark (biosynthetic) reactions in the stroma.",
"Light reactions split water, release O₂ and make ATP and NADPH through the Z-scheme (non-cyclic photophosphorylation). ATP is made by chemiosmosis.",
"The Calvin cycle (C₃ pathway) fixes CO₂ with RuBisCO onto RuBP; C₄ plants (maize, sugarcane) first fix CO₂ with PEP carboxylase in mesophyll cells and have Kranz anatomy, avoiding photorespiration.",
"The rate of photosynthesis depends on light, CO₂, temperature and water — Blackman's law of limiting factors.",
],
"formulas": [
F("Overall equation", "6CO₂ + 12H₂O → (light, chlorophyll) C₆H₁₂O₆ + 6H₂O + 6O₂", "Summary of photosynthesis.", "The O₂ released comes from water, not CO₂ (Cornelius van Niel; confirmed with ¹⁸O)."),
F("Early experiments", "Priestley (1770): plants restore air (mouse and candle);  Ingenhousz: needs sunlight, only green parts;  Sachs (1854): glucose made, stored as starch;  Engelmann: action spectrum with Cladophora and aerobic bacteria (blue and red light)", "History of discoveries.", None, tag="PYQ favourite"),
F("Pigments", "chlorophyll a (bright/blue-green, main pigment, reaction centre);  chlorophyll b (yellow-green);  xanthophylls (yellow);  carotenoids (yellow-orange) — accessory pigments that also protect chlorophyll from photo-oxidation", "Chromatography of leaf pigments."),
F("Photosystems", "PS I reaction centre P700;  PS II reaction centre P680;  LHC (antenna) of hundreds of pigment molecules", "Light-harvesting complexes.", None, tag="PYQ favourite"),
F("Photolysis of water", "2H₂O → 4H⁺ + O₂ + 4e⁻ (on the inner side of thylakoid membrane, linked to PS II; Mn, Cl⁻ needed)", "Source of electrons and O₂."),
F("Non-cyclic vs cyclic photophosphorylation", "non-cyclic: PS II + PS I, gives ATP + NADPH + O₂ (Z-scheme);  cyclic: only PS I, gives only ATP, in stroma lamellae (no NADP reductase there)", "Comparing photophosphorylation.", None, tag="PYQ favourite"),
F("Chemiosmosis", "proton gradient across thylakoid membrane (high H⁺ in lumen) → H⁺ flow through CF₀ to CF₁ of ATP synthase → ATP", "ATP synthesis mechanism."),
F("Calvin cycle", "carboxylation: RuBP + CO₂ → 2 × 3-PGA (RuBisCO);  reduction: uses ATP + NADPH;  regeneration of RuBP", "C₃ pathway (Melvin Calvin, ¹⁴C)."),
F("Energy for one glucose (C₃)", "6 turns: 18 ATP + 12 NADPH", "Counting ATP/NADPH.", None, tag="PYQ favourite"),
F("C₄ (Hatch–Slack) pathway", "PEP (3C) + CO₂ → OAA (4C) by PEP carboxylase in mesophyll → malate/aspartate → bundle sheath → releases CO₂ for Calvin cycle → pyruvate back to mesophyll", "C₄ plants: maize, sugarcane, sorghum, Amaranthus."),
F("Kranz anatomy", "large bundle sheath cells around vascular bundles, many chloroplasts, thick walls impervious to gas, no intercellular spaces", "Identifying C₄ leaves."),
F("Photorespiration", "RuBisCO binds O₂: RuBP + O₂ → phosphoglycerate + phosphoglycolate; no sugar, no ATP — wasteful; in chloroplast, peroxisome and mitochondria", "Why C₄ plants are more efficient.", "C₄ plants have no photorespiration because CO₂ concentration around RuBisCO is high."),
F("Blackman's law of limiting factors (1905)", "if a process depends on several factors, its rate is set by the factor nearest its minimal value", "Factors affecting photosynthesis."),
],
"examples": [
X("ATP and NADPH count", "How many ATP and NADPH are needed to make one glucose in the Calvin cycle?",
  f"One CO₂ per turn needs 3 ATP + 2 NADPH, and glucose needs 6 turns: {atp} ATP and {nadph} NADPH.", [(str(atp), "18"), (str(nadph), "12")]),
X("ATP in C₄ plants", "C₄ plants need 2 extra ATP per CO₂ (to regenerate PEP). ATP for one glucose?",
  f"(3 + 2) × 6 = {c4_atp} ATP per glucose.", [(str(c4_atp), "30")]),
X("Source of O₂", "How was it shown that the O₂ released comes from water?",
  "Van Niel's work on purple and green sulphur bacteria suggested H₂O is the hydrogen donor (like H₂S); later experiments with ¹⁸O-labelled water showed the O₂ came from water.", []),
X("First stable product", "What is the first stable product in C₃ and C₄ plants?",
  "C₃: 3-phosphoglyceric acid (3-PGA, 3-carbon). C₄: oxaloacetic acid (OAA, 4-carbon).", []),
X("Limiting factor in a greenhouse", "Why are tomatoes and bell peppers grown in CO₂-enriched greenhouses?",
  "CO₂ is often the main limiting factor; raising it (up to about 0.05%) increases the rate of photosynthesis and the yield of C₃ plants.", []),
X("Cyclic photophosphorylation location", "Where does cyclic photophosphorylation take place, and why?",
  "In the stroma lamellae, which have PS I but lack PS II and NADP reductase — so electrons cycle back and only ATP is made.", []),
],
"topics": [
T("Site of photosynthesis", "Chloroplasts in mesophyll cells line up along walls to get optimum light. Membranes (grana) trap light and make ATP and NADPH; the stroma has enzymes that reduce CO₂ to sugars (light-independent or dark reactions)."),
T("Action and absorption spectra", "Chlorophyll a absorbs most in blue and red regions; the action spectrum of photosynthesis closely matches the absorption spectrum of chlorophyll a, but other pigments also contribute."),
T("Electron transport", "PS II absorbs 680 nm light; excited electrons pass via plastoquinone, cytochromes b6f and plastocyanin to PS I; PS I re-excites them at 700 nm and passes them to ferredoxin and NADP⁺ reductase to make NADPH. Electrons lost by PS II are replaced by water splitting."),
T("Proton gradient", "The gradient forms because protons from water splitting accumulate in the lumen, protons are moved into the lumen as electrons pass through the cytochrome complex, and NADP reductase removes protons from the stroma when making NADPH."),
T("Factors affecting photosynthesis", "Light: rate rises with intensity at low light, saturates at about 10% of full sunlight. CO₂: C₃ plants respond to higher CO₂ more than C₄ (C₄ saturate at ~360 ppm). Temperature: C₄ plants have a higher optimum. Water stress closes stomata and reduces leaf surface."),
T("C₃ vs C₄ comparison", "C₄ plants tolerate higher temperatures, show greater productivity, have lower CO₂ compensation points and no photorespiration. In C₄ plants RuBisCO is only in bundle sheath cells; PEP carboxylase only in mesophyll."),
],
"ratta": [
"O₂ from water (van Niel).",
"PS I = P700;  PS II = P680.",
"Non-cyclic: ATP + NADPH + O₂;  cyclic: only ATP (stroma lamellae).",
"Glucose (C₃): 18 ATP + 12 NADPH;  C₄: 30 ATP.",
"C₃ first product 3-PGA;  C₄ first product OAA.",
"Kranz anatomy → C₄ (maize, sugarcane).",
"Photorespiration: RuBisCO + O₂, wasteful, absent in C₄.",
"Engelmann — Cladophora action spectrum.",
],
}

SYLLABUS = [
("Photosynthesis as a means of autotrophic nutrition; site of photosynthesis; pigments involved", ["autotroph", "chloroplast", "pigment"]),
("Photochemical and biosynthetic phases; cyclic and non-cyclic photophosphorylation; chemiosmotic hypothesis", ["photophosphorylation", "chemiosmosis"]),
("Photorespiration; C₃ and C₄ pathways", ["photorespiration", "Calvin", "C₄"]),
("Factors affecting photosynthesis", ["limiting factor"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Photosynthesis autotroph nutrition ka base hai: light energy ko chemical energy mein badalta hai: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂. Ye chloroplast mein hota hai — light reactions grana (thylakoids) mein, dark (biosynthetic) reactions stroma mein.",
"Light reactions paani todti hain, O₂ chhodti hain aur Z-scheme (non-cyclic photophosphorylation) se ATP aur NADPH banati hain. ATP chemiosmosis se banta hai.",
"Calvin cycle (C₃ pathway) RuBisCO se CO₂ ko RuBP par fix karta hai; C₄ plants (maize, sugarcane) pehle mesophyll cells mein PEP carboxylase se CO₂ fix karte hain aur Kranz anatomy rakhte hain, jisse photorespiration nahi hota.",
"Photosynthesis ki rate light, CO₂, temperature aur paani par depend karti hai — Blackman ka law of limiting factor.",
],
when=[
("Photosynthesis ka summary.", "Nikli O₂ paani se aati hai, CO₂ se nahi (Cornelius van Niel; ¹⁸O se confirm) — galat mat likhna."),
("Discoveries ka itihaas.", None),
("Leaf pigment ki chromatography.", None),
("Light-harvesting complexes.", None),
("Electrons aur O₂ ka source.", None),
("Photophosphorylation compare karna.", None),
("ATP banne ka mechanism.", None),
("C₃ pathway (Melvin Calvin, ¹⁴C).", None),
("ATP/NADPH ginna.", None),
("C₄ plants: maize, sugarcane, sorghum, Amaranthus.", None),
("C₄ leaves pehchaanna.", None),
("C₄ plants zyada efficient kyun.", "C₄ plants mein photorespiration nahi hota kyunki RuBisCO ke aas-paas CO₂ concentration zyada hota hai."),
("Photosynthesis ko affect karne wale factors.", None),
],
examples=[
("ATP aur NADPH ki ginti", "Calvin cycle mein ek glucose banane ke liye kitne ATP aur NADPH chahiye?",
 "Har turn mein ek CO₂ ke liye 3 ATP + 2 NADPH, aur glucose ke liye 6 turns: ⟨0⟩ ATP aur ⟨1⟩ NADPH."),
("C₄ plants mein ATP", "C₄ plants ko har CO₂ par 2 extra ATP chahiye (PEP regenerate karne ke liye). Ek glucose ke liye ATP?",
 "(3 + 2) × 6 = ⟨0⟩ ATP per glucose."),
("O₂ ka source", "Kaise dikhaya gaya ki nikli O₂ paani se aati hai?",
 "Van Niel ke purple aur green sulphur bacteria par kaam se pata chala ki H₂O hydrogen donor hai (H₂S ki tarah); baad mein ¹⁸O-labelled paani ke experiments ne dikhaya ki O₂ paani se aayi."),
("Pehla stable product", "C₃ aur C₄ plants mein pehla stable product kya hai?",
 "C₃: 3-phosphoglyceric acid (3-PGA, 3-carbon). C₄: oxaloacetic acid (OAA, 4-carbon)."),
("Greenhouse mein limiting factor", "Tomatoes aur bell peppers CO₂ bhare greenhouses mein kyun ugaate hain?",
 "CO₂ aksar main limiting factor hota hai; ise badhaane (lagbhag 0.05% tak) se C₃ plants mein photosynthesis ki rate aur yield badhti hai."),
("Cyclic photophosphorylation kahan", "Cyclic photophosphorylation kahan hota hai, aur kyun?",
 "Stroma lamellae mein, jinmein PS I hai par PS II aur NADP reductase nahi — isliye electrons ghoom kar waapas aate hain aur sirf ATP banta hai."),
],
topics=[
("Site of photosynthesis", "Mesophyll cells mein chloroplasts walls ke saath line mein lagte hain taaki sahi light mile. Membranes (grana) light pakad kar ATP aur NADPH banati hain; stroma ke enzymes CO₂ ko sugars mein reduce karte hain (light-independent ya dark reactions)."),
("Action and absorption spectra", "Chlorophyll a sabse zyada blue aur red regions mein absorb karta hai; photosynthesis ka action spectrum chlorophyll a ke absorption spectrum se kaafi milta hai, par doosre pigments bhi yogdaan dete hain."),
("Electron transport", "PS II 680 nm light absorb karta hai; excited electrons plastoquinone, cytochromes b6f aur plastocyanin se PS I tak jaate hain; PS I unhe 700 nm par phir excite karke ferredoxin aur NADP⁺ reductase ko deta hai, NADPH banta hai. PS II ke khoye electrons water splitting se poore hote hain."),
("Proton gradient", "Gradient isliye banta hai kyunki water splitting ke protons lumen mein jama hote hain, cytochrome complex se electrons guzarte waqt protons lumen mein jaate hain, aur NADPH banate waqt NADP reductase stroma se protons hataata hai."),
("Factors affecting photosynthesis", "Light: kam light par intensity ke saath rate badhti hai, full sunlight ke lagbhag 10% par saturate. CO₂: C₃ plants zyada CO₂ par C₄ se zyada respond karte hain (C₄ ~360 ppm par saturate). Temperature: C₄ plants ka optimum zyada. Water stress stomata band karta aur leaf surface ghataata hai."),
("C₃ vs C₄ comparison", "C₄ plants zyada temperature sehte hain, productivity zyada, CO₂ compensation point kam aur photorespiration nahi. C₄ plants mein RuBisCO sirf bundle sheath cells mein; PEP carboxylase sirf mesophyll mein."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
