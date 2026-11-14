from lib import F, X, T, sig, fx, build
import math
from fractions import Fraction as Fr

# 1 concave mirror f = -15, u = -20
v1 = 1 / (Fr(1, -15) - Fr(1, -20)); m1 = -v1 / -20
# 2 convex lens f = 20, u = -30
v2 = 1 / (Fr(1, 20) + Fr(1, -30)); m2 = v2 / -30
# 3 lens maker
f3 = 1 / (Fr(1, 2) * (Fr(1, 20) - Fr(1, -20))); f3w = 1 / ((Fr(3, 2) / Fr(4, 3) - 1) * (Fr(1, 20) + Fr(1, 20)))
# 4 critical angle
C4 = math.degrees(math.asin(1 / 1.5))
# 5 apparent depth
d5 = 2 / (4 / 3); sh5 = 2 - d5
# 6 prism
mu6 = math.sin(math.radians(45)) / math.sin(math.radians(30))
# 7 combination
P7 = 100 / 20 + 100 / -40; f7 = 100 / P7
# 8 microscope
m8 = (20 / 1) * (25 / 5)
# 9 telescope
m9 = 100 / 5; L9 = 100 + 5
# 10 spherical surface
v10 = float(Fr(3, 2) / (Fr(1, 2) / 10 + Fr(1, -30)))
# 11 thin prism deviation
d11 = (1.5 - 1) * 4

DOC = {
"slug": "ray-optics-and-optical-instruments", "subject": "Physics", "verifiedOn": "2026-11-14",
"chapters": {"NEET": "Ray Optics and Optical Instruments", "JEE": "Ray Optics and Optical Instruments"},
"title": "Ray Optics and Optical Instruments", "readMinutes": 24,
"summary": [
"Ray optics mein light seedhi rekha (ray) mein chalti hai. Reflection mein angle of incidence = angle of reflection; refraction mein Snell's law n₁ sin i = n₂ sin r. Ghane (zyada n) medium mein light dheemi aur normal ki taraf mudti hai.",
"Mirror aur lens ke saare sawal ek sign convention (Cartesian: optical centre/pole origin, light ki direction +ve) aur do formulas se hal hote hain: mirror 1/v + 1/u = 1/f, lens 1/v − 1/u = 1/f. Magnification se image ka size aur real/virtual pata chalta hai.",
"Ghane se halke medium mein critical angle se zyada par light poori wapas laut aati hai — total internal reflection (optical fibre, heera ki chamak, mirage). Prism light ko modta (deviation) hai aur white light ko colours mein todta hai (dispersion).",
"Lens ki power P = 1/f (dioptre, f metre mein); paas rakhe lenses ki power seedhi judti hai. Microscope chhoti paas ki cheez ko bada dikhata hai, telescope door ki cheez ka angle badhaata hai — dono do lenses (objective + eyepiece) se."
],
"formulas": [
F("Mirror formula and magnification", "1/v + 1/u = 1/f;   f = R/2;   m = −v/u = h_i/h_o", "Concave/convex mirror.", "Sign convention: u hamesha negative (object saamne). Concave f negative, convex f positive.", None, "PYQ favourite"),
F("Snell's law and refractive index", "n₁ sin i = n₂ sin r;   n = c/v;   ₁n₂ = n₂/n₁ = v₁/v₂ = λ₁/λ₂", "Do media ke beech refraction.", "Frequency medium badalne par NAHI badalti — speed aur wavelength badalte hain."),
F("Apparent depth (normal view)", "apparent depth = real depth / n;   shift = t(1 − 1/n)", "Paani ke andar cheez upar dikhti hai.", "Upar se (halke medium se) dekhne par divide; andar se bahar dekhne par multiply."),
F("Critical angle and TIR", "sin C = 1/n  (n = denser/rarer);   TIR jab light dense → rare aur i > C", "Optical fibre, prism, heera.", "TIR sirf ghane se halke medium jaate waqt hota hai — ulta kabhi nahi."),
F("Refraction at a spherical surface", "n₂/v − n₁/u = (n₂ − n₁)/R", "Glass sphere, curved surface, bubble.", "R ka sign: centre light ke aage (refracted side) ho to +ve."),
F("Thin lens formula and magnification", "1/v − 1/u = 1/f;   m = v/u", "Convex/concave lens.", "Lens ka minus sign mirror se alag hai — mirror formula yahan mat lagao."),
F("Lens maker's formula", "1/f = (n_lens/n_medium − 1)(1/R₁ − 1/R₂)", "Lens ka f banaavat se; medium badalne par.", "Lens ko apne se ghane medium mein daalo to convex lens diverging ban jaata hai."),
F("Power of a lens and combination", "P = 1/f (f metre mein, unit dioptre D);   contact mein P = P₁ + P₂, 1/F = 1/f₁ + 1/f₂;   distance d par 1/F = 1/f₁ + 1/f₂ − d/(f₁f₂)", "Spectacles, lens jodna.", "f cm mein ho to P = 100/f."),
F("Prism (angle A)", "r₁ + r₂ = A;   δ = i + e − A;   minimum deviation: i = e, r = A/2, n = sin[(A + δ_m)/2] / sin(A/2)", "Prism se deviation, n nikalna.", "Min deviation par ray prism ke andar base ke parallel hoti hai — r = A/2 yaad rakho.", None, "PYQ favourite"),
F("Thin prism", "δ = (n − 1)A", "Chhota angle wala prism (A < 10°).", "Bade angle wale prism par yeh formula mat lagao."),
F("Dispersion", "Angular dispersion = (n_v − n_r)A;   dispersive power ω = (n_v − n_r)/(n − 1)", "White light ke colours.", "Violet sabse zyada mudta hai, red sabse kam — kyunki n_violet > n_red."),
F("Simple microscope (magnifying glass)", "Image near point par: m = 1 + D/f;   infinity par: m = D/f   (D = 25 cm)", "Lens se padhna, ghadi saaz.", "Chhota f = zyada magnification."),
F("Compound microscope", "m = m_o × m_e;   infinity par (normal adjustment): m ≈ (L/f_o)(D/f_e);   near point par: (L/f_o)(1 + D/f_e)", "Microscope ka magnifying power.", "Objective aur eyepiece DONO ka f chhota hona chahiye."),
F("Astronomical telescope", "Normal adjustment: m = f_o/f_e, length = f_o + f_e;   near point par: m = (f_o/f_e)(1 + f_e/D)", "Refracting telescope.", "Objective ka f BADA (zyada light, zyada m), eyepiece ka chhota."),
F("Mirror/lens image rules", "Convex mirror aur concave lens: hamesha virtual, seedhi, chhoti image.  Real image hamesha ulti (m negative)", "Jaldi image type batana.", "Virtual image screen par nahi aati — aankh se dikhti hai."),
],
"examples": [
X("Concave mirror", "f = 15 cm ka concave mirror, object 20 cm door. Image kahan aur kaisi?",
  f"1/v = 1/f − 1/u = −1/15 + 1/20 = −1/60 ⇒ v = {str(v1).replace('-', '−')} cm (mirror ke saamne, real). m = −v/u = {str(m1).replace('-', '−')} ⇒ 3 guna badi, ulti.",
  [(str(v1).replace("-", "−"), "−60"), (str(m1).replace("-", "−"), "−3")]),
X("Convex lens", "f = 20 cm convex lens, object 30 cm door. Image?",
  f"1/v = 1/f + 1/u = 1/20 − 1/30 = 1/60 ⇒ v = +{v2} cm (doosri taraf, real). m = v/u = {str(m2).replace('-', '−')} (2 guna, ulti).",
  [(str(v2), "60"), (str(m2).replace("-", "−"), "−2")]),
X("Lens maker: hawa aur paani", "Biconvex lens, |R₁| = |R₂| = 20 cm, n = 1.5. Hawa mein f? Paani (n = 4/3) mein f?",
  f"Hawa: 1/f = 0.5 × (1/20 + 1/20) ⇒ f = {f3} cm. Paani: 1/f = (1.5/1.333 − 1)(1/10) = 0.125 × 0.1 ⇒ f = {f3w} cm (chaar guna lamba).",
  [(str(f3), "20"), (str(f3w), "80")]),
X("Critical angle", "Glass (n = 1.5) ka hawa ke saath critical angle?",
  f"sin C = 1/1.5 ⇒ C ≈ {fx(C4,1)}°. Isse bade angle par light glass ke andar hi laut aayegi.",
  [(fx(C4,1), "41.8")]),
X("Tank ki gehraai", "2 m gehra paani (n = 4/3) upar se dekhne par kitna gehra dikhega?",
  f"Apparent depth = 2/(4/3) = {fx(d5)} m. Talaa {fx(sh5)} m upar utha dikhta hai.",
  [(fx(d5), "1.5"), (fx(sh5), "0.5")]),
X("Prism se n", "Equilateral prism (A = 60°) ka minimum deviation 30°. n?",
  f"n = sin[(60 + 30)/2]/sin 30° = sin45°/0.5 = √2 ≈ {fx(mu6,3)}.",
  [(fx(mu6,3), "1.414")]),
X("Lenses ka combination", "f₁ = +20 cm aur f₂ = −40 cm contact mein. Total power aur f?",
  f"P = 100/20 + 100/(−40) = 5 − 2.5 = {fx(P7)} D. F = 100/2.5 = {fx(f7)} cm (converging).",
  [(fx(P7), "2.5"), (fx(f7), "40")]),
X("Compound microscope", "f_o = 1 cm, f_e = 5 cm, tube length L = 20 cm, normal adjustment (D = 25 cm). Magnifying power?",
  f"m ≈ (L/f_o)(D/f_e) = 20 × 5 = {fx(m8)}.",
  [(fx(m8), "100")]),
X("Telescope", "f_o = 100 cm, f_e = 5 cm, normal adjustment. Magnifying power aur tube length?",
  f"m = f_o/f_e = {fx(m9)}. Length = f_o + f_e = {fx(L9)} cm.",
  [(fx(m9), "20"), (fx(L9), "105")]),
X("Curved surface par refraction", "Hawa mein point object glass (n = 1.5) ki convex surface (R = 10 cm) se 30 cm door hai. Image kahan?",
  f"n₂/v − n₁/u = (n₂ − n₁)/R ⇒ 1.5/v + 1/30 = 0.5/10 ⇒ 1.5/v = 1/60 ⇒ v = {fx(v10)} cm (glass ke andar, real).",
  [(fx(v10), "90")]),
X("Thin prism", "A = 4°, n = 1.5 ka patla prism kitna deviation dega?",
  f"δ = (n − 1)A = 0.5 × 4 = {fx(d11)}°.", [(fx(d11), "2")]),
],
"topics": [
T("Reflection by spherical mirrors", "Concave mirror (converging) — real/virtual dono images; object F ke andar ho to virtual, seedhi, badi (shaving mirror). Convex mirror (diverging) — hamesha chhoti virtual image, wide view (gaadi ka side mirror). Parallel rays focus F se guzarti hain; f = R/2."),
T("Refraction at plane surface", "Light ghane medium mein normal ki taraf mudti hai. Paani mein pencil tuti dikhti hai, swimming pool kam gehra dikhta hai, taare timtimaate hain (atmosphere ka badalta n)."),
T("Total internal reflection ke applications", "Optical fibre (light core ke andar baar-baar TIR se chalti hai — internet, endoscopy), heera ki chamak (C ≈ 24°), mirage (garam sadak par hawa ki layers), totally reflecting prism (periscope, binocular)."),
T("Lenses: image formation", "Convex lens: object 2F se door — chhoti real; 2F par — same size; F aur 2F ke beech — badi real; F ke andar — virtual seedhi badi (magnifier). Concave lens hamesha chhoti virtual image."),
T("Refraction through a prism", "Deviation i ke saath pehle ghatta hai, min (δ_m) par i = e, phir badhta hai. Min deviation se n naapte hain. Rainbow aur prism ka spectrum dispersion se — VIBGYOR, violet sabse zyada mudta hai."),
T("Optical instruments", "Simple microscope ek convex lens. Compound microscope: chhota f_o objective real badi image banata hai, eyepiece use aur bada karta hai. Refracting telescope: bada f_o objective. Reflecting telescope (concave mirror objective, Newtonian/Cassegrain): chromatic aberration nahi, bada aperture sasta, image zyada bright."),
T("Human eye ki baat (connected)", "Near point D = 25 cm, far point anant. Myopia (paas ka dikhe): concave lens. Hypermetropia (door ka dikhe): convex lens. Presbyopia: bifocal. Astigmatism: cylindrical lens."),
],
"ratta": [
"Mirror 1/v + 1/u = 1/f;  lens 1/v − 1/u = 1/f.",
"m_mirror = −v/u;  m_lens = v/u.",
"sin C = 1/n;  glass C ≈ 42°, paani ≈ 49°, heera ≈ 24°.",
"n = sin[(A + δ_m)/2]/sin(A/2);  thin prism δ = (n − 1)A.",
"P = 1/f (m);  contact P = P₁ + P₂.",
"Microscope m ≈ (L/f_o)(D/f_e);  telescope m = f_o/f_e, L = f_o + f_e.",
"Apparent depth = real/n.",
"Frequency nahi badalti; v aur λ badalte hain.",
],
}

SYLLABUS = [
("Reflection of light, spherical mirrors, mirror formula", ["Reflection", "spherical mirrors", "Mirror formula"]),
("Refraction of light at plane and spherical surfaces", ["Refraction", "plane surface", "spherical surface"]),
("Thin lens formula and lens maker formula", ["Thin lens formula", "Lens maker's formula"]),
("Total internal reflection and its applications", ["TIR", "Total internal reflection"]),
("Magnification", ["magnification"]),
("Power of a lens, combination of thin lenses in contact", ["Power of a lens", "contact"]),
("Refraction of light through a prism", ["prism"]),
("Microscope and astronomical telescope (reflecting and refracting) and their magnifying powers", ["Compound microscope", "Astronomical telescope", "Reflecting telescope", "magnifying power"]),
]

if __name__ == "__main__":
    build(DOC, SYLLABUS)
