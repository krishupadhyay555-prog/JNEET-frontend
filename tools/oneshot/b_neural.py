from lib import F, X, T, sig, fx, _check_and_write

DOC = {
"slug": "neural-control-and-coordination", "subject": "Biology",
"chapters": {"NEET": "Neural Control and Coordination"},
"title": "Neural Control and Coordination", "readMinutes": 13,
"summary": [
"The nervous system is made of neurons that carry electrical impulses. The human system has the central nervous system (brain and spinal cord) and the peripheral nervous system (cranial and spinal nerves; somatic and autonomic).",
"A resting neuron is polarised (outside positive, inside negative, about −70 mV) because of the Na⁺/K⁺ pump. A stimulus opens Na⁺ channels, giving an action potential that travels along the axon.",
"Impulses pass to the next cell across synapses — electrical (fast) or chemical (neurotransmitters such as acetylcholine).",
"The brain has forebrain (cerebrum, thalamus, hypothalamus), midbrain and hindbrain (pons, cerebellum, medulla); the medulla and pons form part of the brain stem.",
],
"formulas": [
F("Neuron parts", "cell body (cyton, with Nissl's granules) + dendrites (carry impulses towards cell body) + axon (carries impulses away, ends in synaptic knobs)", "Neuron structure."),
F("Neuron types", "multipolar (cerebral cortex);  bipolar (retina);  unipolar (embryonic stage)", "Classification by processes.", None, tag="PYQ favourite"),
F("Myelinated vs non-myelinated", "myelinated: Schwann cells form myelin sheath, nodes of Ranvier — spinal and cranial nerves (saltatory, faster conduction);  non-myelinated: autonomous and somatic neural systems", "Nerve fibre types."),
F("Resting potential", "inside −ve, outside +ve;  high K⁺ and negative proteins inside, high Na⁺ outside;  Na⁺/K⁺ pump: 3 Na⁺ out, 2 K⁺ in per ATP", "Polarised membrane.", None, tag="PYQ favourite"),
F("Action potential", "stimulus → Na⁺ channels open → Na⁺ rushes in → depolarisation (inside +ve);  then K⁺ channels open → K⁺ moves out → repolarisation", "Conduction of nerve impulse."),
F("Synapse types", "electrical (gap junctions, very fast, rare);  chemical (synaptic cleft; neurotransmitter like acetylcholine released from vesicles binds receptors on post-synaptic membrane)", "Transmission between neurons."),
F("Forebrain", "cerebrum (two hemispheres joined by corpus callosum; cortex = grey matter, sensory, motor and association areas);  thalamus (relay centre);  hypothalamus (body temperature, hunger, thirst, neurosecretory cells → hormones)", "Parts and functions of the forebrain.", None, tag="PYQ favourite"),
F("Limbic system", "amygdala + hippocampus + inner parts of cerebral hemispheres + hypothalamus → sexual behaviour, emotional reactions (excitement, pleasure, rage, fear) and motivation", "Emotions."),
F("Midbrain", "corpora quadrigemina (four lobes) — visual and auditory reflexes; cerebral aqueduct passes through", "Midbrain functions."),
F("Hindbrain", "pons (connects brain regions, respiratory centre);  cerebellum (balance, posture, coordination; 'little brain' with many folds);  medulla oblongata (respiration, cardiovascular reflexes, gastric secretions)", "Hindbrain functions.", "Brain stem = midbrain + pons + medulla oblongata."),
F("Reflex arc", "receptor → afferent (sensory) neuron → spinal cord (inter-neuron) → efferent (motor) neuron → effector", "Involuntary quick responses (knee-jerk reflex).", None, tag="PYQ favourite"),
F("Eye layers", "sclera (outer, cornea in front) → choroid (middle, iris, ciliary body) → retina (inner: ganglion cells, bipolar cells, photoreceptors — rods and cones)", "Eye structure."),
F("Photoreceptors", "rods: rhodopsin (visual purple), dim light (scotopic) vision;  cones: photopsins, bright light (photopic) and colour vision (red, green, blue)", "Rods vs cones.", "Fovea has only cones (sharpest vision); blind spot has no photoreceptors."),
F("Ear parts and functions", "outer: pinna, auditory canal, tympanic membrane;  middle: malleus, incus, stapes (ossicles), Eustachian tube;  inner: cochlea (hearing — organ of Corti on basilar membrane), vestibular apparatus (balance — crista in ampullae, macula in saccule and utricle)", "Hearing and balance."),
],
"examples": [
X("Sensory or motor?", "Which neurons carry impulses from the spinal cord to muscles?",
  "Efferent (motor) neurons. Afferent (sensory) neurons carry impulses from receptors to the CNS.", []),
X("Depolarisation", "Which ion movement causes the rising phase of an action potential?",
  "Rapid influx of Na⁺ through voltage-gated sodium channels reverses the polarity (inside becomes positive).", []),
X("Function of hypothalamus", "Name three functions controlled by the hypothalamus.",
  "Body temperature, hunger and thirst (urge for eating and drinking); it also has neurosecretory cells making hypothalamic hormones.", []),
X("Blind spot", "Why can't we see an image falling on the blind spot?",
  "At the blind spot the optic nerve leaves the eye and retinal blood vessels enter; there are no photoreceptor cells.", []),
X("Saltatory conduction", "Why is conduction faster in myelinated fibres?",
  "Myelin insulates the axon; impulses jump from one node of Ranvier to the next (saltatory conduction).", []),
X("Hearing mechanism", "Trace the path of sound to the brain.",
  "Pinna → ear canal → tympanic membrane vibrates → ossicles (malleus, incus, stapes) → oval window → waves in cochlear lymph → basilar membrane moves → hair cells of organ of Corti bend → nerve impulses via auditory nerve → auditory cortex.", []),
],
"topics": [
T("Neural system in animals", "Lower invertebrates have a simple network of neurons (Hydra — nerve net). Insects have a brain and many ganglia. Vertebrates have a more developed system."),
T("Autonomic nervous system", "Part of the PNS controlling involuntary organs and smooth muscles; divided into sympathetic and parasympathetic systems, which usually have opposite effects."),
T("Human brain coverings", "The brain is protected by the skull and three meninges: outer dura mater, thin middle arachnoid and inner pia mater (in contact with brain tissue). Cerebrospinal fluid cushions it."),
T("Cerebral cortex", "Grey matter (cell bodies) on the outside with convolutions; white matter (myelinated tracts) inside. Association areas handle complex functions such as intersensory associations, memory and communication."),
T("Image formation", "Light passes through cornea and lens and forms an image on the retina. Light changes retinal (a vitamin A derivative) in rhodopsin, generating potentials in photoreceptors that pass via bipolar and ganglion cells to the optic nerve and visual cortex."),
T("Sensory organs other than eye and ear", "Nose has olfactory receptors (olfactory epithelium connects to the limbic system); tongue has taste buds; skin has touch, pressure, pain and temperature receptors."),
],
"ratta": [
"Resting potential: inside −ve; Na⁺/K⁺ pump 3 out, 2 in.",
"Depolarisation = Na⁺ in;  repolarisation = K⁺ out.",
"Multipolar cortex;  bipolar retina;  unipolar embryo.",
"Thalamus relay;  hypothalamus temperature, hunger, thirst.",
"Cerebellum balance;  medulla breathing & heart reflexes.",
"Rods dim light (rhodopsin);  cones colour.",
"Cochlea hearing;  vestibular apparatus balance.",
],
}

SYLLABUS = [
("Neuron and nerves; nervous system in humans — central, peripheral and visceral", ["neuron", "central nervous system", "peripheral", "autonomic"]),
("Generation and conduction of nerve impulse", ["action potential", "depolarisation", "resting potential"]),
("Synapse", ["synapse"]),
("Human brain — forebrain, midbrain, hindbrain; reflex action", ["forebrain", "midbrain", "hindbrain", "reflex"]),
("Sensory organs — eye and ear", ["retina", "cochlea"]),
]

from lib import hinglish, write_pair

DOC_HI = hinglish(DOC,
summary=[
"Nervous system neuron se bana hai jo electrical impulses le jaate hain. Human system mein central nervous system (brain aur spinal cord) aur peripheral nervous system (cranial aur spinal nerves; somatic aur autonomic) hain.",
"Resting neuron polarised hota hai (bahar positive, andar negative, lagbhag −70 mV — resting potential) Na⁺/K⁺ pump ki wajah se. Stimulus Na⁺ channels kholta hai (depolarisation), aur action potential axon par aage badhta hai.",
"Impulse agle cell tak synapse se jaata hai — electrical (tez) ya chemical (acetylcholine jaise neurotransmitters).",
"Brain mein forebrain (cerebrum, thalamus, hypothalamus), midbrain aur hindbrain (pons, cerebellum, medulla); medulla aur pons brain stem ka hissa hain. Reflex, retina aur cochlea bhi isi chapter mein.",
],
when=[
("Neuron ki structure.", None),
("Processes ke hisaab se classification.", None),
("Nerve fibre ke types.", None),
("Polarised membrane.", None),
("Nerve impulse ka conduction.", None),
("Neurons ke beech transmission.", None),
("Forebrain ke parts aur kaam.", None),
("Emotions.", None),
("Midbrain ke kaam.", None),
("Hindbrain ke kaam.", "Brain stem = midbrain + pons + medulla oblongata (cerebellum isme nahi)."),
("Involuntary tez responses (knee-jerk reflex).", None),
("Eye ki structure.", None),
("Rods vs cones.", "Fovea mein sirf cones (sabse saaf vision); blind spot mein koi photoreceptor nahi — ulta mat likhna."),
("Hearing aur balance.", None),
],
examples=[
("Sensory ya motor?", "Kaunse neurons spinal cord se muscles tak impulse le jaate hain?",
 "Efferent (motor) neurons. Afferent (sensory) neurons receptors se CNS tak impulse le jaate hain."),
("Depolarisation", "Action potential ka rising phase kis ion ki movement se hota hai?",
 "Voltage-gated sodium channels se Na⁺ ka tezi se andar aana polarity ulat deta hai (andar positive ho jaata hai)."),
("Hypothalamus ka kaam", "Hypothalamus ke control wale teen kaam batao.",
 "Body temperature, bhookh aur pyaas (khaane-peene ki ichchha); isme neurosecretory cells bhi hain jo hypothalamic hormones banate hain."),
("Blind spot", "Blind spot par padne wali image kyun nahi dikhti?",
 "Blind spot par optic nerve aankh se nikalti hai aur retinal blood vessels andar aati hain; wahan photoreceptor cells nahi hote."),
("Saltatory conduction", "Myelinated fibres mein conduction tez kyun hota hai?",
 "Myelin axon ko insulate karta hai; impulse ek node of Ranvier se agle par koodta hai (saltatory conduction)."),
("Hearing mechanism", "Sound ka brain tak raasta batao.",
 "Pinna → ear canal → tympanic membrane kaanpti hai → ossicles (malleus, incus, stapes) → oval window → cochlear lymph mein waves → basilar membrane hilti hai → organ of Corti ke hair cells mudte hain → auditory nerve se nerve impulses → auditory cortex."),
],
topics=[
("Neural system in animals", "Neeche ke invertebrates mein neurons ka simple network (Hydra — nerve net). Insects mein brain aur kai ganglia. Vertebrates mein zyada developed system."),
("Autonomic nervous system", "PNS ka hissa jo involuntary organs aur smooth muscles control karta hai; sympathetic aur parasympathetic systems mein bata, jinka asar aam taur par ulta hota hai."),
("Human brain coverings", "Brain skull aur teen meninges se surakshit: bahar dura mater, beech mein patli arachnoid aur andar pia mater (brain tissue se chipki). Cerebrospinal fluid gaddi ka kaam karta hai."),
("Cerebral cortex", "Bahar grey matter (cell bodies) convolutions ke saath; andar white matter (myelinated tracts). Association areas complex kaam sambhaalte hain jaise intersensory associations, memory aur communication."),
("Image formation", "Light cornea aur lens se guzarkar retina par image banati hai. Light rhodopsin mein retinal (vitamin A derivative) ko badalti hai, photoreceptors mein potentials bante hain jo bipolar aur ganglion cells se optic nerve aur visual cortex tak jaate hain."),
("Sensory organs other than eye and ear", "Naak mein olfactory receptors (olfactory epithelium limbic system se juda); jeebh par taste buds; skin mein touch, pressure, pain aur temperature receptors."),
])

if __name__ == "__main__":
    write_pair(DOC, SYLLABUS, DOC_HI)
