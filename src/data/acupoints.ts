export type Lang = 'en' | 'hi' | 'mr';
export type Region3D = 'body' | 'hand' | 'leg' | 'shoulder';

export interface Point3D {
  id: string;
  aliases?: string[];
  n: string;
  m: string;
  mCode: string;
  pin?: number;
  c: string;
  pregnancyCaution?: boolean;
  emergency?: boolean;
  regions: Region3D[];
  bodyPos: [number, number, number];
  bodyNormal: [number, number, number];
  handPos?: [number, number, number];
  handNormal?: [number, number, number];
  handSide?: 'palm' | 'back';
  legPos?: [number, number, number];
  legNormal?: [number, number, number];
  shoulderPos?: [number, number, number];
  shoulderNormal?: [number, number, number];
  keywords: string[];
  loc: Record<Lang, string>;
  use: Record<Lang, string>;
  how: Record<Lang, string>;
}

export const POINTS_3D: Point3D[] = [
  // === HAND & WRIST & EMERGENCY ===
  {
    id: 'LI4',
    n: 'He Gu (Union Valley)',
    m: 'Large Intestine',
    mCode: 'LI',
    pin: 2,
    c: '#5ac8fa',
    pregnancyCaution: true,
    regions: ['body', 'hand'],
    bodyPos: [1.02, -0.18, 0.08],
    bodyNormal: [0.3, 0, 0.95],
    handPos: [-0.46, 0.08, -0.15],
    handNormal: [0, 0, -1],
    handSide: 'back',
    keywords: ['headache', 'head', 'tooth', 'cold', 'fever', 'stress', 'pain', 'face', 'hand', 'sinus', 'migraine', 'सिरदर्द', 'डोकेदुखी', 'दात', 'सर्दी', 'ताप', 'बुखार', 'ताण', 'हात'],
    loc: {
      en: 'On the back of the hand, in the fleshy web between the thumb and index finger.',
      hi: 'हाथ के पीछे, अंगूठे और तर्जनी उंगली के बीच के नरम उभार पर।',
      mr: 'हाताच्या मागील बाजूस, अंगठा आणि तर्जनी (पहिले बोट) यांच्या मधल्या मांसल जागेवर.',
    },
    use: {
      en: 'Headache, migraine, toothache, cold, fever, stress, and general body pain.',
      hi: 'सिरदर्द, माइग्रेन, दांत दर्द, सर्दी, बुखार, तनाव और शरीर दर्द।',
      mr: 'डोकेदुखी, अर्धशिशी, दातदुखी, सर्दी, ताप, ताण आणि अंगदुखी.',
    },
    how: {
      en: 'Press firmly with the opposite thumb angled slightly toward the index finger bone for 1–2 minutes.',
      hi: 'दूसरे हाथ के अंगूठे से तर्जनी की हड्डी की ओर 1 से 2 मिनट तक हल्का गहरा दबाव दें।',
      mr: 'दुसऱ्या हाताच्या अंगठ्याने तर्जनीच्या हाडाकडे झुकवून १ ते २ मिनिटे हळुवार दाबा.',
    },
  },
  {
    id: 'PC6',
    n: 'Nei Guan (Inner Gate)',
    m: 'Pericardium',
    mCode: 'PC',
    pin: 3,
    c: '#ff6b9d',
    emergency: true,
    regions: ['body', 'hand'],
    bodyPos: [0.89, 0.08, 0.10],
    bodyNormal: [0.2, 0, 0.98],
    handPos: [0.0, -1.32, 0.22],
    handNormal: [0, 0, 1],
    handSide: 'palm',
    keywords: ['heart', 'heart attack', 'chest', 'bp', 'blood pressure', 'nausea', 'vomit', 'anxiety', 'palpitation', 'travel', 'stress', 'दिल', 'हृदय', 'हार्ट', 'छाती', 'मळमळ', 'उलटी', 'घबराहट', 'बीपी'],
    loc: {
      en: 'On the inner forearm, 3 finger-widths below the wrist crease, right between the two central tendons.',
      hi: 'कलाई की अंदरूनी रेखा से 3 उंगली नीचे, बीच की दो नसों के ठीक मध्य में।',
      mr: 'मनगटाच्या आतील रेषेपासून ३ बोटे खाली, मधल्या दोन शिरांच्या अगदी मध्यभागी.',
    },
    use: {
      en: 'Heart & chest tightness, palpitations, high BP calm, nausea, motion sickness, and panic/anxiety.',
      hi: 'दिल व छाती में जकड़न, घबराहट, हाई बीपी, मतली, उल्टी और बेचैनी।',
      mr: 'छातीत धडधड किंवा जडपणा, उच्च रक्तदाब, मळमळ, उलटी आणि घबराट.',
    },
    how: {
      en: 'Press gently but steadily with your thumb between the two tendons while breathing slowly.',
      hi: 'दोनों नसों के बीच अंगूठे से धीरे-धीरे स्थिर दबाव दें और लंबी सांस लें।',
      mr: 'दोन्ही शिरांच्या मध्ये अंगठ्याने हळुवार स्थिर दाब द्या आणि संथ श्वास घ्या.',
    },
  },
  {
    id: 'HT7',
    n: 'Shen Men (Spirit Gate)',
    m: 'Heart',
    mCode: 'HT',
    pin: 4,
    c: '#b794ff',
    emergency: true,
    regions: ['body', 'hand'],
    bodyPos: [0.97, -0.06, 0.08],
    bodyNormal: [0.3, 0, 0.95],
    handPos: [0.31, -0.82, 0.16],
    handNormal: [0.2, 0, 0.98],
    handSide: 'palm',
    keywords: ['heart', 'heart attack', 'sleep', 'insomnia', 'anxiety', 'palpitation', 'stress', 'chest', 'wrist', 'नींद', 'झोप', 'तनाव', 'ताण', 'हृदय', 'धडधड'],
    loc: {
      en: 'On the inner wrist crease, in the small hollow on the little-finger side.',
      hi: 'कलाई की अंदरूनी रेखा पर, छोटी उंगली की तरफ बने छोटे गड्ढे में।',
      mr: 'मनगटाच्या आतील रेषेवर, करंगळीच्या बाजूला असलेल्या लहान खळग्यात.',
    },
    use: {
      en: 'Calms heart rhythm, chest anxiety, insomnia, deep stress, and emotional panic.',
      hi: 'दिल की धड़कन शांत करने, अनिद्रा, घबराहट और मानसिक तनाव में राहत।',
      mr: 'हृदयाचे ठोके शांत करणे, निद्रानाश, अस्वस्थता आणि मानसिक ताण कमी करणे.',
    },
    how: {
      en: 'Use gentle circular thumb pressure in the wrist hollow for 2 minutes.',
      hi: 'अंगूठे से कलाई के गड्ढे में 2 मिनट तक हल्के गोल घुमाते हुए दबाएं।',
      mr: 'अंगठ्याने मनगटाच्या खळग्यात २ मिनिटे हळुवार गोल फिरवून दाबा.',
    },
  },
  {
    id: 'HT9',
    n: 'Shao Chong (Heart Emergency)',
    m: 'Heart',
    mCode: 'HT',
    c: '#ff4d6d',
    emergency: true,
    regions: ['hand'],
    bodyPos: [1.05, -0.34, 0.06],
    bodyNormal: [0.3, 0, 0.95],
    handPos: [0.40, 1.22, 0.05],
    handNormal: [-0.2, 0.2, 0.95],
    handSide: 'palm',
    keywords: ['heart attack', 'heart', 'emergency', 'chest pain', 'faint', 'unconscious', 'stroke', 'हार्ट अटैक', 'हार्ट अटॅक', 'हृदयविकार', 'बेहोश', 'बेशुद्ध'],
    loc: {
      en: 'On the little finger tip, just beside the inner (thumb-facing) corner of the fingernail.',
      hi: 'छोटी उंगली के सिरे पर, नाखून के अंदरूनी कोने के ठीक पास।',
      mr: 'करंगळीच्या टोकावर, नखाच्या आतील (अंगठ्याकडील) कोपऱ्याजवळ.',
    },
    use: {
      en: 'First-aid point for sudden chest crisis, heart palpitations, fainting, and shock while awaiting medical help.',
      hi: 'अचानक छाती में दर्द, दिल के दौरे की आपात स्थिति या बेहोशी में डॉक्टर के आने तक प्राथमिक सहायता।',
      mr: 'अचानक छातीत दुखणे, हृदयविकाराचा झटका किंवा चक्कर येऊन बेशुद्ध पडल्यास डॉक्टरी मदतीपूर्वी प्रथमोपचार बिंदू.',
    },
    how: {
      en: 'Pinch or press firmly with your opposite thumb and index fingernail for 30–60 seconds.',
      hi: 'दूसरे हाथ के अंगूठे और उंगली से 30–60 सेकंड तक मजबूत दबाव दें।',
      mr: 'दुसऱ्या हाताच्या अंगठा आणि बोटाने ३०–६० सेकंद घट्ट दाबा.',
    },
  },
  {
    id: 'PC9',
    n: 'Zhong Chong (Middle Finger Tip)',
    m: 'Pericardium',
    mCode: 'PC',
    c: '#ff5c8d',
    emergency: true,
    regions: ['hand'],
    bodyPos: [1.06, -0.37, 0.07],
    bodyNormal: [0, 0, 1],
    handPos: [-0.12, 1.65, 0.07],
    handNormal: [0, 0.3, 0.95],
    handSide: 'palm',
    keywords: ['heart attack', 'emergency', 'faint', 'heatstroke', 'unconscious', 'chest', 'बेशुद्ध', 'बेहोश', 'हार्ट अटॅक', 'लूह'],
    loc: {
      en: 'Right at the center tip of the middle finger.',
      hi: 'बीच की सबसे बड़ी उंगली (मध्यमा) के ठीक ऊपरी सिरे पर।',
      mr: 'मधल्या बोटाच्या अगदी मध्यभागी वरच्या टोकावर.',
    },
    use: {
      en: 'Emergency resuscitation, fainting, heatstroke, sudden heart tightness, and acute fever.',
      hi: 'बेहोशी, लू लगना, अचानक घबराहट और तेज बुखार में आपातकालीन राहत।',
      mr: 'बेशुद्धी, उष्माघात, अचानक छातीत अस्वस्थता आणि जास्त तापात प्रथमोपचार.',
    },
    how: {
      en: 'Press firmly on the tip of the middle finger for 30–60 seconds on both hands.',
      hi: 'दोनों हाथों की बीच वाली उंगली के सिरे को 30–60 सेकंड मजबूती से दबाएं।',
      mr: 'दोन्ही हातांच्या मधल्या बोटाच्या टोकाला ३०–६० सेकंद घट्ट दाबा.',
    },
  },
  {
    id: 'PC8',
    n: 'Lao Gong (Palace of Labor)',
    m: 'Pericardium',
    mCode: 'PC',
    pin: 12,
    c: '#ff9ad5',
    regions: ['hand'],
    bodyPos: [1.03, -0.22, 0.07],
    bodyNormal: [0, 0, 1],
    handPos: [-0.08, -0.06, 0.19],
    handNormal: [0, 0, 1],
    handSide: 'palm',
    keywords: ['palm', 'sweat', 'nervous', 'stress', 'anxiety', 'hand', 'heart', 'tired', 'पसीना', 'घाम', 'तळहात', 'हथेली', 'ताण'],
    loc: {
      en: 'Dead center of the palm, right where your middle fingertip touches when you close a gentle fist.',
      hi: 'हथेली के ठीक बीच में, जहां हल्की मुट्ठी बंद करने पर बीच की उंगली का सिरा छूता है।',
      mr: 'तळहाताच्या अगदी मध्यभागी, हलकी मूठ बंद केल्यावर मधल्या बोटाचे टोक जिथे लागते तिथे.',
    },
    use: {
      en: 'Calms nervousness, sweaty palms, mental exhaustion, anxiety, and hand fatigue.',
      hi: 'घबराहट, हथेली में पसीना, मानसिक थकान और हाथ की कमजोरी में आराम।',
      mr: 'घबराट, तळहाताला घाम येणे, मानसिक थकवा आणि हाताचा ताण कमी करते.',
    },
    how: {
      en: 'Press slowly into the center of the palm with the opposite thumb while exhaling.',
      hi: 'सांस छोड़ते हुए दूसरे अंगूठे से हथेली के बीच में धीरे-धीरे दबाएं।',
      mr: 'श्वास सोडताना दुसऱ्या अंगठ्याने तळहाताच्या मध्यावर हळुवार दाब द्या.',
    },
  },
  {
    id: 'LU10',
    n: 'Yu Ji (Fish Border)',
    m: 'Lung',
    mCode: 'LU',
    pin: 13,
    c: '#9be15d',
    regions: ['hand'],
    bodyPos: [0.99, -0.19, 0.09],
    bodyNormal: [0, 0, 1],
    handPos: [-0.45, -0.35, 0.21],
    handNormal: [-0.3, 0, 0.95],
    handSide: 'palm',
    keywords: ['cough', 'throat', 'voice', 'asthma', 'breathing', 'hand', 'thumb', 'खोकला', 'खांसी', 'घसा', 'गला', 'दमा'],
    loc: {
      en: 'On the palm, in the middle of the fleshy mound at the base of the thumb.',
      hi: 'हथेली पर अंगूठे के नीचे वाले मांसल उभार के ठीक बीच में।',
      mr: 'तळहातावर अंगठ्याच्या खालच्या मांसल भागाच्या मध्यभागी.',
    },
    use: {
      en: 'Sore throat, dry cough, hoarse voice, asthma, and thumb-base pain.',
      hi: 'गले में दर्द/खराश, सूखी खांसी, आवाज बैठना और सांस की तकलीफ।',
      mr: 'घसा दुखणे, कोरडा खोकला, आवाज बसणे आणि श्वास घेण्यास त्रास.',
    },
    how: {
      en: 'Massage the fleshy thumb pad toward the palm bone for 1–2 minutes.',
      hi: 'अंगूठे के मांसल हिस्से को 1–2 मिनट तक हल्के से दबाकर मालिश करें।',
      mr: 'अंगठ्याच्या खालच्या मांसल भागाला १–२ मिनिटे हळू दाबून मसाज करा.',
    },
  },
  {
    id: 'LU11',
    n: 'Shao Shang (Thumb Tip)',
    m: 'Lung',
    mCode: 'LU',
    c: '#a8e063',
    regions: ['hand'],
    bodyPos: [0.97, -0.26, 0.10],
    bodyNormal: [-0.4, 0, 0.9],
    handPos: [-0.95, 0.39, 0.14],
    handNormal: [-0.7, 0, 0.7],
    handSide: 'palm',
    keywords: ['throat', 'tonsils', 'cough', 'fever', 'sore throat', 'घसा', 'गला', 'खोकला', 'खांसी', 'ताप'],
    loc: {
      en: 'On the outer corner of the thumbnail.',
      hi: 'अंगूठे के नाखून के बाहरी कोने के ठीक पास।',
      mr: 'अंगठ्याच्या नखाच्या बाहेरील कोपऱ्याजवळ.',
    },
    use: {
      en: 'Sudden severe sore throat, tonsillitis, high fever, and dry cough.',
      hi: 'तेज गला दर्द, टॉन्सिल, तेज बुखार और खांसी में तुरंत राहत।',
      mr: 'तीव्र घसा दुखणे, टॉन्सिल्स, ताप आणि खोकल्यावर उपयुक्त.',
    },
    how: {
      en: 'Apply firm pinch pressure beside the thumbnail corner for 30–60 seconds.',
      hi: 'नाखून के कोने के पास 30–60 सेकंड हल्का तेज दबाव दें।',
      mr: 'नखाच्या कोपऱ्याजवळ ३०–६० सेकंद बोटांनी दाबा.',
    },
  },
  {
    id: 'LU7',
    n: 'Lie Que (Broken Sequence)',
    m: 'Lung',
    mCode: 'LU',
    c: '#86efac',
    regions: ['body', 'hand'],
    bodyPos: [0.86, 0.12, 0.10],
    bodyNormal: [-0.6, 0, 0.8],
    handPos: [-0.28, -1.24, 0.12],
    handNormal: [-0.85, 0, 0.5],
    handSide: 'palm',
    keywords: ['vertigo', 'dizziness', 'neck', 'cough', 'headache', 'asthma', 'wrist', 'वर्टिगो', 'चक्कर', 'मान', 'गर्दन', 'खोकला'],
    loc: {
      en: 'On the thumb side of the inner forearm, 2 finger-widths (1.5 cun) above the wrist crease in the small bony groove.',
      hi: 'कलाई की रेखा से 2 उंगली ऊपर अंगूठे की तरफ हड्डी के ठीक ऊपर बने हल्के गड्ढे में।',
      mr: 'मनगटाच्या रेषेपासून २ बोटे वर, अंगठ्याच्या बाजूच्या हाडावरील लहान खाचेत.',
    },
    use: {
      en: 'Vertigo & spinning dizziness (rotate Clockwise), stiff neck, migraine headache, and cough.',
      hi: 'वर्टिगो और चक्कर आना (क्लॉकवाइज दबाएं), गर्दन की जकड़न, सिरदर्द और खांसी में अत्यंत प्रभावी।',
      mr: 'व्हर्टिगो व चक्कर येणे (क्लॉकवाइज दाबा), मान ताठरणे, डोकेदुखी आणि खोकल्यावर प्रभावी.',
    },
    how: {
      en: 'Rotate Clockwise with gentle firm thumb pressure for 1–2 minutes (especially for vertigo).',
      hi: 'वर्टिगो और चक्कर के लिए अंगूठे से 1–2 मिनट क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाएं।',
      mr: 'व्हर्टिगोसाठी अंगठ्याने १–२ मिनिटे क्लॉकवाइज (घड्याळाच्या दिशेने) फिरवून दाबा.',
    },
  },
  {
    id: 'SI3',
    n: 'Hou Xi (Back Stream)',
    m: 'Small Intestine',
    mCode: 'SI',
    c: '#ff8a5c',
    regions: ['hand', 'body'],
    bodyPos: [1.07, -0.23, 0.04],
    bodyNormal: [0.8, 0, -0.5],
    handPos: [0.47, 0.25, 0.0],
    handNormal: [1, 0, 0],
    handSide: 'back',
    keywords: ['back', 'neck', 'stiff', 'hand', 'spine', 'shoulder', 'मान', 'गर्दन', 'पाठ', 'कमर', 'हात'],
    loc: {
      en: 'On the outer edge of the hand just below the little finger knuckle crease.',
      hi: 'हाथ के बाहरी किनारे पर, छोटी उंगली की गांठ के ठीक नीचे की रेखा पर।',
      mr: 'हाताच्या बाहेरील कडेवर, करंगळीच्या सांध्याखालील घडीवर.',
    },
    use: {
      en: 'Acute stiff neck, upper and lower back pain, spine stiffness, and hand cramps.',
      hi: 'गर्दन की अकड़न, पीठ और कमर दर्द, रीढ़ की जकड़न और हाथ का दर्द।',
      mr: 'मान ताठरणे, पाठ आणि कंबरदुखी, मणक्याचा त्रास आणि हात दुखणे.',
    },
    how: {
      en: 'Rest the edge of your hand and press inward toward the bone for 1–2 minutes.',
      hi: 'हाथ के बाहरी किनारे पर 1–2 मिनट अंदर की तरफ दबाएं।',
      mr: 'हाताच्या बाहेरील कडेवर आतल्या बाजूने १–२ मिनिटे दाबा.',
    },
  },
  {
    id: 'TW3',
    n: 'Zhong Zhu (Middle Islet)',
    m: 'Triple Warmer',
    mCode: 'TW',
    c: '#f472b6',
    regions: ['hand'],
    bodyPos: [1.04, -0.22, 0.02],
    bodyNormal: [0, 0, -1],
    handPos: [0.24, 0.22, -0.17],
    handNormal: [0, 0, -1],
    handSide: 'back',
    keywords: ['hand', 'finger', 'neck', 'ear', 'headache', 'shoulder', 'हात', 'हाथ', 'मान', 'कान'],
    loc: {
      en: 'On the back of the hand, in the groove just behind the ring and little finger knuckles.',
      hi: 'हाथ के पीछे, अनामिका और छोटी उंगली की गांठों के ठीक पीछे के गड्ढे में।',
      mr: 'हाताच्या मागील बाजूस, करंगळी आणि अनामिका बोटांच्या सांध्यांच्या मागील खळग्यात.',
    },
    use: {
      en: 'Finger stiffness, hand pain, neck/shoulder tension, ear ringing, and temporal headache.',
      hi: 'उंगलियों व हाथ में दर्द, गर्दन-कंधे का तनाव और सिर के किनारे का दर्द।',
      mr: 'बोटे व हात दुखणे, मान व खांदे जखडणे आणि डोकेदुखी.',
    },
    how: {
      en: 'Press gently into the groove between the two knuckle bones for 1–2 minutes.',
      hi: 'दोनों उंगलियों की हड्डियों के बीच की खांच में 1–2 मिनट दबाएं।',
      mr: 'दोन्ही बोटांच्या हाडांमधील खाचेत १–२ मिनिटे हळू दाबा.',
    },
  },
  {
    id: 'TW5',
    n: 'Wai Guan (Outer Gate)',
    m: 'Triple Warmer',
    mCode: 'TW',
    c: '#fb7185',
    regions: ['hand', 'body'],
    bodyPos: [0.91, 0.09, 0.01],
    bodyNormal: [0, 0, -1],
    handPos: [0.02, -1.32, -0.22],
    handNormal: [0, 0, -1],
    handSide: 'back',
    keywords: ['migraine', 'headache', 'neck', 'arm', 'wrist', 'hand', 'fever', 'cold', 'माइग्रेन', 'मान', 'हात', 'ताप'],
    loc: {
      en: 'On the outer (back) forearm, 3 finger-widths below the wrist crease between the two bones.',
      hi: 'कलाई के पीछे (बाहरी हिस्से) की रेखा से 3 उंगली ऊपर, दोनों हड्डियों के बीच।',
      mr: 'मनगटाच्या मागील रेषेपासून ३ बोटे वर, दोन्ही हाडांच्या मध्यभागी.',
    },
    use: {
      en: 'Migraine, side headache, stiff neck, wrist/forearm pain, fever, and immunity.',
      hi: 'माइग्रेन, कनपटी का दर्द, गर्दन अकड़न, कलाई व हाथ दर्द और बुखार।',
      mr: 'अर्धशिशी, कानशिलेचे दुखणे, मान ताठरणे, मनगट व हात दुखणे आणि ताप.',
    },
    how: {
      en: 'Pinch gently between PC6 (front) and TW5 (back) or press TW5 steadily for 2 minutes.',
      hi: 'अंगूठे से 2 मिनट तक मध्यम दबाव दें या कलाई के आगे-पीछे हल्का दबाएं।',
      mr: 'अंगठ्याने २ मिनिटे मध्यम दाब द्या.',
    },
  },
  {
    id: 'TW10',
    n: 'Tian Jing (Celestial Well)',
    m: 'Triple Warmer',
    mCode: 'TW',
    c: '#f0abfc',
    regions: ['body', 'shoulder'],
    bodyPos: [0.71, 0.54, -0.09],
    bodyNormal: [0.4, 0, -0.91],
    shoulderPos: [0.76, -0.78, -0.11],
    shoulderNormal: [0.4, 0, -0.91],
    keywords: ['vertigo', 'dizziness', 'elbow', 'neck', 'migraine', 'ear', 'shoulder', 'वर्टिगो', 'चक्कर', 'कोपर', 'मान'],
    loc: {
      en: 'With elbow bent, in the soft hollow 1 finger-width directly above the bony point of the back of the elbow.',
      hi: 'कोहनी मोड़ने पर, कोहनी की पीछे वाली नुकीली हड्डी से एक उंगली ऊपर बने गड्ढे में।',
      mr: 'कोपर दुमडल्यावर, कोपराच्या मागील हाडाच्या टोकापासून एक बोट वर असलेल्या खळग्यात.',
    },
    use: {
      en: 'Vertigo & balance dizziness (rotate Anticlockwise with LU7 & GB20), elbow pain, and neck stiffness.',
      hi: 'वर्टिगो और चक्कर (एंटीक्लॉकवाइज दबाएं), कोहनी व बांह दर्द तथा गर्दन की जकड़न में आराम।',
      mr: 'व्हर्टिगो व तोल जाणे (अँटीक्लॉकवाइज दाबा), कोपर दुखणे आणि मान ताठरण्यावर उपयुक्त.',
    },
    how: {
      en: 'Bend the elbow softly and rotate Anticlockwise with fingertip pressure for 1–2 minutes.',
      hi: 'कोहनी को हल्का मोड़कर इस गड्ढे को 1–2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'कोपर सैल दुमडून या खळग्यात १–२ मिनिटे अँटीक्लॉकवाइज (उलट्या दिशेने) दाबा.',
    },
  },

  // === HEAD, NECK, SHOULDER, CHEST, BACK, ABDOMEN ===
  {
    id: 'GV20',
    n: 'Bai Hui (Hundred Meetings)',
    m: 'Governing Vessel',
    mCode: 'GV',
    pin: 9,
    c: '#7cc4ff',
    regions: ['body'],
    bodyPos: [0, 1.78, 0.0],
    bodyNormal: [0, 1, 0],
    keywords: ['headache', 'head', 'bp', 'high bp', 'dizziness', 'focus', 'memory', 'stress', 'stroke', 'सिरदर्द', 'डोकेदुखी', 'चक्कर', 'बीपी'],
    loc: {
      en: 'Right on the crown (top center) of the head, aligned with the tips of both ears.',
      hi: 'सिर के ठीक सबसे ऊपरी मध्य भाग पर, दोनों कानों के ऊपरी सिरों की सीध में।',
      mr: 'डोक्याच्या अगदी मध्यभागी वरच्या बाजूला, दोन्ही कानांच्या वरच्या टोकांच्या रेषेत.',
    },
    use: {
      en: 'Headache, high BP dizziness, brain fog, poor focus, and calming the nervous system.',
      hi: 'सिरदर्द, हाई बीपी के चक्कर, थकान, याददाश्त और मानसिक शांति।',
      mr: 'डोकेदुखी, उच्च रक्तदाबाची चक्कर, एकाग्रता वाढवणे आणि मन शांत करणे.',
    },
    how: {
      en: 'Tap or press very gently with fingertips on top of the head for 1–2 minutes.',
      hi: 'उंगलियों के पोरों से सिर के ऊपरी हिस्से पर 1–2 मिनट हल्के से दबाएं या थपथपाएं।',
      mr: 'बोटांच्या टोकांनी डोक्याच्या वरच्या भागी १–२ मिनिटे अतिशय हळुवार दाबा.',
    },
  },
  {
    id: 'GB20',
    n: 'Feng Chi (Wind Pool)',
    m: 'Gall Bladder',
    mCode: 'GB',
    pin: 10,
    c: '#5ee6a8',
    regions: ['body', 'shoulder'],
    bodyPos: [-0.11, 1.41, -0.14],
    bodyNormal: [-0.4, 0, -0.9],
    shoulderPos: [-0.24, 1.18, -0.26],
    shoulderNormal: [0.4, 0, -0.9],
    keywords: ['neck', 'headache', 'migraine', 'bp', 'high bp', 'cold', 'eye', 'stiff', 'dizziness', 'vertigo', 'spondylitis', 'गर्दन', 'मान', 'सिरदर्द', 'डोकेदुखी', 'बीपी', 'जकड़न', 'स्पॉन्डिलाइटिस', 'वर्टिगो'],
    loc: {
      en: 'At the back base of the skull, in the two soft hollows beside the thick neck muscles.',
      hi: 'सिर के पीछे खोपड़ी के निचले किनारे पर, गर्दन की मांसपेशियों के दोनों तरफ बने गड्ढों में।',
      mr: 'डोक्याच्या मागील बाजूस कवटीच्या खाली, मानेच्या स्नायूंच्या दोन्ही कडेच्या खळग्यांमध्ये.',
    },
    use: {
      en: 'Tension headache, migraine, spondylitis, stiff neck, vertigo, and high BP (rotate Anticlockwise).',
      hi: 'स्पॉन्डिलाइटिस, गर्दन में जकड़न, वर्टिगो/चक्कर, सिरदर्द और हाई बीपी (एंटीक्लॉकवाइज दबाएं)।',
      mr: 'स्पॉन्डिलायटिस, मान जखडणे, व्हर्टिगो/चक्कर, डोकेदुखी आणि उच्च रक्तदाब (अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Place both thumbs in the hollows under the skull base and rotate Anticlockwise gently for 2 minutes.',
      hi: 'दोनों अंगूठों को खोपड़ी के नीचे के गड्ढों में रखकर 2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) हल्का दबाएं।',
      mr: 'दोन्ही अंगठे कवटीच्या खालच्या खळग्यात ठेवून २ मिनिटे अँटीक्लॉकवाइज हळू दाबा.',
    },
  },
  {
    id: 'BL10',
    aliases: ['UB10'],
    n: 'Tian Zhu / UB10 (Celestial Pillar)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#f97316',
    regions: ['body', 'shoulder'],
    bodyPos: [-0.055, 1.36, -0.14],
    bodyNormal: [-0.2, 0, -0.98],
    shoulderPos: [-0.32, 1.06, -0.26],
    shoulderNormal: [0.1, 0, -0.99],
    keywords: ['spondylosis', 'neck', 'stiff neck', 'ub10', 'bl10', 'cervical', 'headache', 'vertigo', 'गर्दन', 'स्पॉन्डिलोसिस', 'मान', 'जकड़न'],
    loc: {
      en: 'At the back nape of the neck, 1.3 cun beside the spine at the hairline on the thick neck muscle.',
      hi: 'गर्दन के पीछे बालों की रेखा के ठीक ऊपर, रीढ़ के दोनों तरफ मोटी मांसपेशी पर।',
      mr: 'मानेच्या मागील बाजूस केसांच्या रेषेजवळ, मणक्याच्या दोन्ही बाजूंच्या स्नायूवर.',
    },
    use: {
      en: 'Cervical spondylosis (Clockwise) and acute stiff neck (Anticlockwise with GB20 & SI3).',
      hi: 'स्पॉन्डिलोसिस (क्लॉकवाइज दबाएं) और गर्दन में जकड़न (GB20 व SI3 के साथ एंटीक्लॉकवाइज दबाएं)।',
      mr: 'स्पॉन्डिलोसिस (क्लॉकवाइज दाबा) आणि मान ताठरणे (GB20 व SI3 सोबत अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Press Clockwise for cervical spondylosis or Anticlockwise for sudden neck stiffness for 1–2 minutes.',
      hi: 'स्पॉन्डिलोसिस में क्लॉकवाइज और गर्दन की जकड़न में 1–2 मिनट एंटीक्लॉकवाइज घुमाकर दबाएं।',
      mr: 'स्पॉन्डिलोसिससाठी क्लॉकवाइज आणि मान जखडल्यास १–२ मिनिटे अँटीक्लॉकवाइज दाबा.',
    },
  },
  {
    id: 'GB14',
    n: 'Yang Bai (Yang White)',
    m: 'Gall Bladder',
    mCode: 'GB',
    c: '#6ee7b7',
    regions: ['body'],
    bodyPos: [0.06, 1.62, 0.16],
    bodyNormal: [0.25, 0.15, 0.95],
    keywords: ['spondylitis', 'forehead', 'headache', 'eye', 'sinus', 'dizziness', 'स्पॉन्डिलाइटिस', 'सिरदर्द', 'डोकेदुखी', 'माथा'],
    loc: {
      en: 'On the forehead directly above the pupil, 1 thumb-width above the center of the eyebrow.',
      hi: 'माथे पर आंख की पुतली की सीध में, भौंह के ठीक बीच से एक अंगूठे ऊपर।',
      mr: 'कपाळावर डोळ्याच्या बाहुलीच्या रेषेत, भुवईच्या मध्यापासून एक बोट वर.',
    },
    use: {
      en: 'Spondylitis support (rotate Clockwise with GB20 Anticlockwise), forehead tension, and eye strain.',
      hi: 'स्पॉन्डिलाइटिस (क्लॉकवाइज दबाएं), माथे का दर्द और आंखों के तनाव में लाभकारी।',
      mr: 'स्पॉन्डिलायटिस (क्लॉकवाइज दाबा), कपाळ दुखणे आणि डोळ्यांचा ताण कमी करणे.',
    },
    how: {
      en: 'Massage gently in Clockwise circles with your fingertip for 1–2 minutes.',
      hi: 'उंगली के पोर से 1–2 मिनट हल्के क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाएं।',
      mr: 'बोटाच्या टोकाने १–२ मिनिटे हळुवार क्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL2',
    n: 'Zan Zhu (Bamboo Gathering)',
    m: 'Bladder',
    mCode: 'BL',
    c: '#60a5fa',
    regions: ['body'],
    bodyPos: [-0.06, 1.56, 0.16],
    bodyNormal: [-0.2, 0, 0.98],
    keywords: ['headache', 'forehead', 'sinus', 'eye', 'migraine', 'cold', 'डोकेदुखी', 'सिरदर्द', 'साइनस', 'डोळे'],
    loc: {
      en: 'In the small notch at the inner start of each eyebrow, just above the inner corner of the eye.',
      hi: 'भौंहों (आइब्रो) के अंदरूनी सिरे पर, नाक के ऊपर के छोटे गड्ढे में।',
      mr: 'भुवयांच्या आतील टोकावर, डोळ्यांच्या आतील कोपऱ्याच्या वरच्या लहान खाचेत.',
    },
    use: {
      en: 'Forehead headache, sinus pressure, eye strain from screens, and blocked nose.',
      hi: 'माथे का सिरदर्द, साइनस, आंखों की थकान और बंद नाक में तुरंत आराम।',
      mr: 'कपाळाची डोकेदुखी, सायनसचा त्रास, डोळ्यांचा थकवा आणि नाक चोंदणे.',
    },
    how: {
      en: 'Press lightly upward with both index fingertips for 60–90 seconds.',
      hi: 'दोनों तर्जनी उंगलियों से हल्के से ऊपर की ओर 60–90 सेकंड दबाएं।',
      mr: 'दोन्ही तर्जनी बोटांनी वरच्या दिशेने ६०–९० सेकंद हलके दाबा.',
    },
  },
  {
    id: 'GV26',
    n: 'Ren Zhong (Emergency Revival)',
    m: 'Governing Vessel',
    mCode: 'GV',
    c: '#ef4444',
    emergency: true,
    regions: ['body'],
    bodyPos: [0, 1.44, 0.17],
    bodyNormal: [0, 0, 1],
    keywords: ['emergency', 'heart attack', 'faint', 'unconscious', 'shock', 'dizzy', 'low bp', 'stroke', 'बेशुद्ध', 'चक्कर', 'हार्ट अटॅक'],
    loc: {
      en: 'In the groove between the base of the nose and the upper lip (upper third of the philtrum).',
      hi: 'नाक के ठीक नीचे और ऊपरी होंठ के बीच की नाली के ऊपरी हिस्से में।',
      mr: 'नाकाच्या खाली आणि वरच्या ओठाच्या मधल्या खळग्याच्या वरच्या भागात.',
    },
    use: {
      en: 'Emergency first-aid for fainting, sudden shock, dizziness, low BP collapse, or unconsciousness.',
      hi: 'चक्कर आकर गिरने, बेहोशी, लो बीपी या अचानक सदमे में तुरंत होश लाने वाला बिंदु।',
      mr: 'चक्कर येऊन पडणे, बेशुद्धी, कमी रक्तदाब किंवा अचानक धक्का बसल्यास प्रथमोपचार बिंदू.',
    },
    how: {
      en: 'Press firmly upward toward the nose base with the tip of a finger or thumb knuckle.',
      hi: 'उंगली या अंगूठे से नाक की जड़ की ओर मजबूत लेकिन सुरक्षित दबाव दें।',
      mr: 'बोटाच्या किंवा अंगठ्याच्या टोकाने नाकाच्या दिशेने घट्ट दाबा.',
    },
  },
  {
    id: 'CV22',
    n: 'Tian Tu (Celestial Chimney)',
    m: 'Conception Vessel',
    mCode: 'CV',
    c: '#34d399',
    regions: ['body', 'shoulder'],
    bodyPos: [0, 1.10, 0.22],
    bodyNormal: [0, 0.2, 0.98],
    shoulderPos: [-0.45, 0.45, 0.30],
    shoulderNormal: [0, 0.2, 0.98],
    keywords: ['throat', 'cough', 'asthma', 'voice', 'thyroid', 'chest', 'phlegm', 'खोकला', 'खांसी', 'घसा', 'गला', 'दमा', 'थायरॉइड'],
    loc: {
      en: 'In the soft hollow right above the top of the breastbone at the base of the throat.',
      hi: 'गले के निचले हिस्से में, छाती की हड्डी के ठीक ऊपर बने गोल गड्ढे में।',
      mr: 'घशाच्या खाली, छातीच्या हाडाच्या अगदी वरच्या लहान खळग्यात.',
    },
    use: {
      en: 'Sore throat, dry or wet cough, asthma tightness, hoarse voice, and throat discomfort.',
      hi: 'गले में दर्द, खांसी, कफ, दमा और आवाज की समस्या में आराम।',
      mr: 'घसा दुखणे, खोकला, कफ, दमा आणि आवाजाचा त्रास कमी करते.',
    },
    how: {
      en: 'Press very gently downward behind the breastbone rim (never push straight back into the windpipe).',
      hi: 'सांस की नली पर सीधा न दबाएं, केवल हड्डी के किनारे नीचे की तरफ बेहद हल्का दबाएं।',
      mr: 'श्वासनलिकेवर सरळ न दाबता फक्त हाडाच्या कडेने खालील बाजूस अतिशय हळुवार दाबा.',
    },
  },
  {
    id: 'CV17',
    n: 'Shan Zhong (Chest Center)',
    m: 'Conception Vessel',
    mCode: 'CV',
    c: '#f43f5e',
    emergency: true,
    regions: ['body', 'shoulder'],
    bodyPos: [0, 0.72, 0.31],
    bodyNormal: [0, 0, 1],
    shoulderPos: [-0.45, 0.05, 0.38],
    shoulderNormal: [0, 0, 1],
    keywords: ['heart', 'heart attack', 'chest', 'breathing', 'anxiety', 'asthma', 'cough', 'stress', 'हृदय', 'छाती', 'हार्ट', 'श्वास'],
    loc: {
      en: 'In the exact center of the breastbone (sternum), level with the 4th rib space.',
      hi: 'छाती के ठीक बीच की हड्डी (स्टर्नम) के मध्य बिंदु पर।',
      mr: 'छातीच्या मधल्या हाडाच्या (उरोस्थी) अगदी मध्यभागी.',
    },
    use: {
      en: 'Chest tightness, breathing ease, heart calmness, anxiety relief, and cough/asthma support.',
      hi: 'छाती की जकड़न, सांस लेने में आसानी, दिल की घबराहट और तनाव से राहत।',
      mr: 'छातीतील जडपणा, श्वास मोकळा होणे, ह्रदयाची अस्वस्थता आणि ताण कमी करणे.',
    },
    how: {
      en: 'Rub gently up and down or press softly with fingertips while taking slow deep breaths.',
      hi: 'उंगलियों से छाती के मध्य में हल्की मालिश करें और गहरी सांस लें।',
      mr: 'बोटांनी छातीच्या मध्यभागी हळुवार चोळा आणि संथ दीर्घ श्वास घ्या.',
    },
  },
  {
    id: 'CV12',
    n: 'Zhong Wan (Middle Stomach)',
    m: 'Conception Vessel',
    mCode: 'CV',
    pin: 5,
    c: '#ffb340',
    regions: ['body'],
    bodyPos: [0, 0.34, 0.29],
    bodyNormal: [0, 0, 1],
    keywords: ['stomach', 'acidity', 'gas', 'bloat', 'indigestion', 'diabetes', 'ulcer', 'पोट', 'पेट', 'गैस', 'अॅसिडिटी', 'अपच', 'मधुमेह'],
    loc: {
      en: 'On the center line of the upper belly, halfway between the navel and the bottom of the breastbone.',
      hi: 'पेट की मध्य रेखा पर, नाभि और छाती की हड्डी के निचले सिरे के ठीक बीच में।',
      mr: 'पोटाच्या मध्यरेषेवर, बेंबी आणि छातीच्या हाडाच्या खालच्या टोकाच्या मध्यभागी.',
    },
    use: {
      en: 'Acidity, gas, bloating, stomach ache, indigestion, and metabolic/diabetes digestion support.',
      hi: 'एसिडिटी, गैस, पेट फूलना, पेट दर्द, अपच और पाचन सुधारने के लिए।',
      mr: 'अॅसिडिटी, गॅस, पोट फुगणे, पोटदुखी, अपचन आणि पचन सुधारण्यासाठी.',
    },
    how: {
      en: 'Use soft circular pressure with 3 fingertips for 2 minutes (avoid right after a heavy meal).',
      hi: 'तीनों उंगलियों से 2 मिनट हल्के गोल घुमाकर दबाएं (भोजन के तुरंत बाद न दबाएं)।',
      mr: 'तीन बोटांनी २ मिनिटे हळुवार गोल फिरवून दाबा (जेवल्याबरोबर करू नका).',
    },
  },
  {
    id: 'ST25',
    n: 'Tian Shu (Celestial Pivot)',
    m: 'Stomach',
    mCode: 'ST',
    c: '#fbbf24',
    regions: ['body'],
    bodyPos: [0.16, 0.16, 0.27],
    bodyNormal: [0.25, 0, 0.96],
    keywords: ['constipation', 'stomach', 'gas', 'ibs', 'diarrhea', 'belly', 'diabetes', 'पोट', 'पेट', 'बद्धकोष्ठता', 'कब्ज'],
    loc: {
      en: 'Two thumb-widths (3 fingers) to the left and right of the navel.',
      hi: 'नाभि के ठीक बाएं और दाएं तीन उंगली (2 इंच) की दूरी पर।',
      mr: 'बेंबीच्या डाव्या आणि उजव्या बाजूला तीन बोटे अंतरावर.',
    },
    use: {
      en: 'Constipation, belly cramps, gas, bloating, and bowel regularity.',
      hi: 'कब्ज, पेट दर्द, गैस और पाचन क्रिया को नियमित करने के लिए।',
      mr: 'बद्धकोष्ठता, पोटात मुरडा, गॅस आणि पचन सुधारण्यासाठी.',
    },
    how: {
      en: 'Press gently on both sides of the navel simultaneously while breathing out.',
      hi: 'सांस छोड़ते हुए नाभि के दोनों तरफ एक साथ हल्का दबाव दें।',
      mr: 'श्वास सोडताना बेंबीच्या दोन्ही बाजूंना एकाच वेळी हळू दाबा.',
    },
  },
  {
    id: 'GV14',
    n: 'Da Zhui (Great Hammer)',
    m: 'Governing Vessel',
    mCode: 'GV',
    c: '#38bdf8',
    regions: ['body', 'shoulder'],
    bodyPos: [0, 1.15, -0.20],
    bodyNormal: [0, 0.2, -0.98],
    shoulderPos: [-0.45, 0.72, -0.30],
    shoulderNormal: [0, 0.2, -0.98],
    keywords: ['fever', 'neck', 'bone', 'spine', 'immunity', 'cold', 'cough', 'shoulder', 'nerve', 'pinched', 'ताप', 'बुखार', 'मान', 'गर्दन', 'हाडे', 'नस', 'सिकुड़ना'],
    loc: {
      en: 'At the back base of the neck, directly below the largest bony bump (C7) when you tilt your head forward.',
      hi: 'गर्दन के पीछे, सिर झुकाने पर उभरने वाली सबसे बड़ी हड्डी (C7) के ठीक नीचे।',
      mr: 'मानेच्या मागील बाजूस, डोके पुढे झुकवल्यावर जाणवणाऱ्या सर्वात मोठ्या हाडाच्या (C7) अगदी खाली.',
    },
    use: {
      en: 'Nerve compression/shrinkage (rotate Anticlockwise with BL23 CW), high fever, cervical stiffness, and immunity.',
      hi: 'नस का दबना या सिकुड़ना (एंटीक्लॉकवाइज दबाएं), तेज बुखार, गर्दन व रीढ़ की जकड़न और रोग प्रतिरोधक क्षमता।',
      mr: 'नस दबणे (अँटीक्लॉकवाइज दाबा), जास्त ताप, मान व मणक्याची ताठरता आणि प्रतिकारशक्तीसाठी.',
    },
    how: {
      en: 'Rotate Anticlockwise with steady fingertip pressure for 1–2 minutes to release compressed neck/spine nerves.',
      hi: 'दबी हुई नस खोलने के लिए 1–2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'दबलेली नस मोकळी करण्यासाठी १–२ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL11',
    aliases: ['UB11'],
    n: 'Da Zhu / UB11 (Master of Bones)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fb923c',
    regions: ['body', 'shoulder'],
    bodyPos: [-0.14, 1.05, -0.22],
    bodyNormal: [-0.2, 0, -0.98],
    shoulderPos: [-0.20, 0.55, -0.34],
    shoulderNormal: [0.2, 0, -0.98],
    keywords: ['bone', 'bones', 'ub11', 'bl11', 'arthritis', 'joint', 'neck', 'back', 'shoulder', 'spine', 'हाडे', 'हड्डी', 'सांधेदुखी', 'जोड़ों', 'मान'],
    loc: {
      en: 'Upper back, 2 finger-widths beside the spine just below the base of the neck (T1 level).',
      hi: 'पीठ के ऊपरी भाग में, गर्दन के नीचे रीढ़ की हड्डी से दो उंगली बाजू में (T1 के स्तर पर)।',
      mr: 'पाठीच्या वरच्या भागात, मानेच्या खाली मणक्यापासून दोन बोटे बाजूला (T1 पातळीवर).',
    },
    use: {
      en: 'Influential Master Point for all BONES — bone aches, arthritis, joint stiffness, neck & upper back pain.',
      hi: 'हड्डियों का मुख्य बिंदु (UB11) — हड्डियों के दर्द, गठिया, जोड़ों की जकड़न और गर्दन/पीठ दर्द में अत्यंत लाभकारी।',
      mr: 'हाडांचा मुख्य बिंदू (UB11) — हाडे दुखणे, संधिवात, सांध्यांची जखडण, मान आणि पाठीच्या वरच्या भागातील दुखणे.',
    },
    how: {
      en: 'Press gently on both sides of the upper spine with fingertips or a soft massage ball against a wall.',
      hi: 'रीढ़ के दोनों तरफ उंगलियों से या दीवार के सहारे सॉफ्ट बॉल से 2 मिनट दबाव दें।',
      mr: 'मणक्याच्या दोन्ही बाजूंना बोटांनी किंवा भिंतीच्या आधारे मऊ बॉलने २ मिनिटे दाब द्या.',
    },
  },
  {
    id: 'BL12',
    aliases: ['UB12'],
    n: 'Feng Men / UB12 (Wind Gate)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fca5a5',
    regions: ['body', 'shoulder'],
    bodyPos: [-0.14, 0.94, -0.23],
    bodyNormal: [-0.2, 0, -0.98],
    shoulderPos: [-0.20, 0.36, -0.35],
    shoulderNormal: [0.2, 0, -0.98],
    keywords: ['ub12', 'bl12', 'bone', 'upper back', 'cold', 'cough', 'fever', 'shoulder', 'immunity', 'हाडे', 'हड्डी', 'पाठ', 'सर्दी', 'खोकला'],
    loc: {
      en: 'Upper back, 2 finger-widths lateral to the spine at the level of the 2nd thoracic vertebra (just below UB11).',
      hi: 'पीठ के ऊपरी भाग में, UB11 से एक उंगली नीचे, रीढ़ से दो उंगली बाजू में (T2 के स्तर पर)।',
      mr: 'पाठीच्या वरच्या भागात, UB11 च्या एका बोटाखाली, मणक्यापासून दोन बोटे बाजूला (T2 पातळीवर).',
    },
    use: {
      en: 'Upper back & bone ache, shoulder stiffness, preventing colds, cough, fever, and strengthening lungs.',
      hi: 'ऊपरी पीठ व हड्डी का दर्द, कंधे की जकड़न, सर्दी-खांसी और बुखार से बचाव।',
      mr: 'पाठीचा वरचा भाग व हाडे दुखणे, खांदे जखडणे, सर्दी-खोकला आणि ताप कमी करणे.',
    },
    how: {
      en: 'Apply firm circular thumb pressure or gentle warm rubbing for 1–2 minutes.',
      hi: '1–2 मिनट तक हल्के गोल घुमाते हुए दबाव दें या पीठ को गर्म रखने के लिए सहलाएं।',
      mr: '१–२ मिनिटे गोलाकार दाब द्या किंवा पाठीला हलकी उष्णता मिळेल असा मसाज करा.',
    },
  },
  {
    id: 'GB21',
    n: 'Jian Jing (Shoulder Well)',
    m: 'Gall Bladder',
    mCode: 'GB',
    c: '#2dd4bf',
    pregnancyCaution: true,
    regions: ['body', 'shoulder'],
    bodyPos: [0.27, 1.13, -0.02],
    bodyNormal: [0, 0.95, -0.3],
    shoulderPos: [0.06, 0.64, -0.02],
    shoulderNormal: [0, 0.95, -0.3],
    keywords: ['shoulder', 'neck', 'muscle', 'tension', 'stress', 'headache', 'back', 'खांदा', 'कंधा', 'मान', 'गर्दन', 'स्नायू'],
    loc: {
      en: 'On top of the shoulder muscle (trapezius), halfway between the base of the neck and the outer shoulder tip.',
      hi: 'कंधे के सबसे ऊपरी मांसल हिस्से पर, गर्दन की जड़ और कंधे के बाहरी किनारे के ठीक बीच में।',
      mr: 'खांद्याच्या वरच्या स्नायूवर, मानेची बाजू आणि खांद्याचे बाहेरील टोक यांच्या मध्यभागी.',
    },
    use: {
      en: 'Shoulder & neck muscle knots, heavy tension, stress headaches, and upper back tightness.',
      hi: 'कंधे और गर्दन की मांसपेशियों का दर्द, अकड़न और तनाव से होने वाला सिरदर्द।',
      mr: 'खांदे आणि मानेच्या स्नायूंची गाठ/दुखणे, जखडणे आणि ताणामुळे होणारी डोकेदुखी.',
    },
    how: {
      en: 'Hook your opposite middle/index fingers over the top of the shoulder and press downward gently.',
      hi: 'दूसरे हाथ की उंगलियों से कंधे के ऊपरी हिस्से को पकड़कर नीचे की ओर 1–2 मिनट दबाएं।',
      mr: 'दुसऱ्या हाताच्या बोटांनी खांद्याच्या वरच्या भागावर पकड घेऊन खालील दिशेने १–२ मिनिटे दाबा.',
    },
  },
  {
    id: 'LI15',
    n: 'Jian Yu (Shoulder Bone)',
    m: 'Large Intestine',
    mCode: 'LI',
    c: '#38bdf8',
    regions: ['body', 'shoulder'],
    bodyPos: [0.50, 1.03, 0.08],
    bodyNormal: [0.8, 0.2, 0.55],
    shoulderPos: [0.62, 0.36, 0.14],
    shoulderNormal: [0.85, 0.2, 0.48],
    keywords: ['shoulder', 'frozen shoulder', 'arm', 'muscle', 'deltoid', 'joint', 'खांदा', 'कंधा', 'हात', 'स्नायू'],
    loc: {
      en: 'On the front-outer top of the shoulder, in the dimple that forms when you lift your arm out to the side.',
      hi: 'कंधे के बाहरी-सामने वाले जोड़ पर, हाथ को बगल में उठाने पर बनने वाले गड्ढे में।',
      mr: 'खांद्याच्या बाहेरील-पुढील सांध्यावर, हात बाजूला वर केल्यावर पडणाऱ्या खळग्यात.',
    },
    use: {
      en: 'Frozen shoulder, deltoid muscle pain, difficulty lifting the arm, and shoulder joint arthritis.',
      hi: 'फ्रोजन शोल्डर, कंधे की मांसपेशी में दर्द, हाथ उठाने में कठिनाई और जोड़ों का दर्द।',
      mr: 'फ्रोझन शोल्डर, खांद्याचे स्नायू दुखणे, हात वर उचलताना त्रास होणे.',
    },
    how: {
      en: 'Press gently into the shoulder dimple with the opposite thumb while rotating the shoulder slowly.',
      hi: 'अंगूठे से गड्ढे में हल्का दबाकर कंधे को धीरे-धीरे गोल घुमाएं।',
      mr: 'अंगठ्याने खळग्यात हळुवार दाबून खांदा हळुवार गोल फिरवा.',
    },
  },
  {
    id: 'TW14',
    n: 'Jian Liao (Shoulder Crevice)',
    m: 'Triple Warmer',
    mCode: 'TW',
    c: '#e879f9',
    regions: ['body', 'shoulder'],
    bodyPos: [0.49, 1.01, -0.10],
    bodyNormal: [0.8, 0.15, -0.58],
    shoulderPos: [0.60, 0.34, -0.18],
    shoulderNormal: [0.85, 0.15, -0.5],
    keywords: ['shoulder', 'arm', 'muscle', 'back shoulder', 'खांदा', 'कंधा'],
    loc: {
      en: 'In the hollow on the back-outer edge of the shoulder joint, just behind LI15.',
      hi: 'कंधे के पीछे-बाहरी हिस्से में बने गड्ढे में (LI15 के ठीक पीछे)।',
      mr: 'खांद्याच्या मागील-बाहेरील कडेवरील खळग्यात (LI15 च्या अगदी मागे).',
    },
    use: {
      en: 'Rear shoulder pain, rotator cuff muscle strain, and arm stiffness.',
      hi: 'कंधे के पिछले हिस्से का दर्द, मांसपेशियों का खिंचाव और बांह की जकड़न।',
      mr: 'खांद्याच्या मागील भागाचे दुखणे, स्नायूंचा ताण आणि हात जखडणे.',
    },
    how: {
      en: 'Press into the rear shoulder dimple for 1–2 minutes while relaxing the arm.',
      hi: 'हाथ को ढीला छोड़कर कंधे के पिछले गड्ढे में 1–2 मिनट दबाएं।',
      mr: 'हात सैल सोडून खांद्याच्या मागील खळग्यात १–२ मिनिटे दाबा.',
    },
  },
  {
    id: 'SI11',
    n: 'Tian Zong (Celestial Gathering)',
    m: 'Small Intestine',
    mCode: 'SI',
    c: '#fb923c',
    regions: ['body', 'shoulder'],
    bodyPos: [0.27, 0.84, -0.25],
    bodyNormal: [0.25, 0, -0.97],
    shoulderPos: [0.18, 0.08, -0.36],
    shoulderNormal: [0.25, 0, -0.97],
    keywords: ['shoulder', 'scapula', 'upper back', 'muscle', 'arm', 'खांदा', 'पाठ', 'कंधा', 'पीठ'],
    loc: {
      en: 'Right in the center of the shoulder blade (scapula) on the upper back.',
      hi: 'पीठ के ऊपरी हिस्से में, कंधे की चपटी हड्डी (स्कैपुला) के ठीक बीच में।',
      mr: 'पाठीच्या वरच्या बाजूला, खांद्याच्या चपट्या हाडाच्या (स्कॅपुला) अगदी मध्यभागी.',
    },
    use: {
      en: 'Shoulder blade pain, upper back muscle knots, chest tightness, and radiating arm ache.',
      hi: 'कंधे की हड्डी (स्कैपुला) के बीच का दर्द, ऊपरी पीठ की जकड़न और बांह दर्द।',
      mr: 'खांद्याच्या हाडाजवळचे दुखणे, पाठीच्या वरच्या भागातील गाठ आणि हातातील वेदना.',
    },
    how: {
      en: 'Lean gently with a tennis ball between your shoulder blade and a wall for 60–90 seconds.',
      hi: 'दीवार और कंधे की हड्डी के बीच टेनिस बॉल रखकर 60–90 सेकंड हल्का दबाव दें।',
      mr: 'भिंत आणि पाठीच्या खांद्याच्या हाडात टेनिस बॉल ठेवून ६०–९० सेकंद हलका दाब द्या.',
    },
  },
  {
    id: 'LU1',
    n: 'Zhong Fu (Central Treasury)',
    m: 'Lung',
    mCode: 'LU',
    c: '#4ade80',
    regions: ['body', 'shoulder'],
    bodyPos: [0.30, 0.94, 0.25],
    bodyNormal: [0.3, 0, 0.95],
    shoulderPos: [0.16, 0.34, 0.36],
    shoulderNormal: [0.3, 0, 0.95],
    keywords: ['cough', 'asthma', 'breathing', 'chest', 'shoulder', 'throat', 'खोकला', 'खांसी', 'दमा', 'छाती', 'खांदा'],
    loc: {
      en: 'On the upper outer chest, one finger-width below the outer end of the collarbone near the shoulder.',
      hi: 'ऊपरी छाती के बाहरी हिस्से में, कॉलरबोन के बाहरी सिरे के ठीक नीचे।',
      mr: 'छातीच्या वरच्या बाहेरील बाजूला, कॉलरबोनच्या (गळ्याजवळील हाड) बाहेरील टोकाखाली.',
    },
    use: {
      en: 'Deep cough, asthma, shortness of breath, chest congestion, and front shoulder pain.',
      hi: 'गहरी खांसी, दमा, सांस फूलना, छाती में कफ और सामने के कंधे का दर्द।',
      mr: 'खोकला, दमा, श्वास लागणे, छातीत कफ आणि पुढील खांद्याचे दुखणे.',
    },
    how: {
      en: 'Press gently with fingertips in small circles while taking slow deep breaths.',
      hi: 'उंगलियों से हल्के गोलाकार दबाते हुए गहरी और धीमी सांस लें।',
      mr: 'बोटांनी हळुवार गोल दाब देत दीर्घ आणि संथ श्वास घ्या.',
    },
  },
  {
    id: 'LI11',
    n: 'Qu Chi (Pool at the Crook)',
    m: 'Large Intestine',
    mCode: 'LI',
    c: '#0ea5e9',
    regions: ['body', 'shoulder'],
    bodyPos: [0.76, 0.46, 0.08],
    bodyNormal: [0.85, 0, 0.5],
    shoulderPos: [0.78, -0.92, 0.08],
    shoulderNormal: [0.9, 0, 0.4],
    keywords: ['bp', 'high bp', 'fever', 'elbow', 'arm', 'muscle', 'joint', 'immunity', 'skin', 'बीपी', 'ताप', 'बुखार', 'कोपर', 'हात'],
    loc: {
      en: 'When you bend your elbow, right at the outer end of the elbow crease.',
      hi: 'कोहनी मोड़ने पर बनने वाली रेखा के बाहरी सिरे के ठीक गड्ढे में।',
      mr: 'कोपर दुमडल्यावर पडणाऱ्या घडीच्या अगदी बाहेरील टोकावर.',
    },
    use: {
      en: 'Lowers high blood pressure (BP), cools high fever, relieves tennis elbow/arm pain, and boosts immunity.',
      hi: 'हाई बीपी (रक्तचाप) कम करने, तेज बुखार उतारने, कोहनी व हाथ दर्द और त्वचा रोगों में अत्यंत उपयोगी।',
      mr: 'उच्च रक्तदाब (BP) कमी करणे, जास्त ताप उतरवणे, कोपर व हात दुखणे आणि प्रतिकारशक्तीसाठी.',
    },
    how: {
      en: 'Bend your arm comfortably and press into the outer elbow dimple for 2 minutes on each arm.',
      hi: 'कोहनी मोड़कर बाहरी सिरे पर दोनों हाथों में 2-2 मिनट दबाएं।',
      mr: 'कोपर सैल दुमडून बाहेरील खळग्यात दोन्ही हातांवर २-२ मिनिटे दाबा.',
    },
  },
  {
    id: 'BL21',
    aliases: ['UB21'],
    n: 'Wei Shu / UB21 (Stomach Shu)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fb923c',
    regions: ['body'],
    bodyPos: [-0.14, 0.44, -0.22],
    bodyNormal: [-0.2, 0, -0.98],
    keywords: ['spondylosis', 'ub21', 'bl21', 'spine', 'mid back', 'stomach', 'disc', 'स्पॉन्डिलोसिस', 'कमर', 'पीठ', 'रीढ़'],
    loc: {
      en: 'On the middle back, 2 finger-widths beside the spine at the T12 vertebra level (below rib cage base).',
      hi: 'पीठ के मध्य भाग में, रीढ़ की हड्डी से दो उंगली बाजू में (T12 कशेरुका के स्तर पर)।',
      mr: 'पाठीच्या मधल्या भागात, मणक्यापासून दोन बोटे बाजूला (T12 मणक्याच्या पातळीवर).',
    },
    use: {
      en: 'Spondylosis (rotate Anticlockwise with BL10 CW), mid-back stiffness, and upper spine comfort.',
      hi: 'स्पॉन्डिलोसिस (एंटीक्लॉकवाइज दबाएं), मध्य पीठ दर्द और रीढ़ की जकड़न में राहत।',
      mr: 'स्पॉन्डिलोसिस (अँटीक्लॉकवाइज दाबा), पाठीचा मधला भाग दुखणे आणि मणक्याचा ताण कमी करणे.',
    },
    how: {
      en: 'Rotate Anticlockwise with thumb or fingertips along the mid-back beside the spine for 1–2 minutes.',
      hi: 'पीठ पर रीढ़ के पास 1–2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'पाठीवर मणक्याशेजारी १–२ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL23',
    aliases: ['UB23'],
    n: 'Shen Shu / UB23 (Kidney Shu)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    pin: 11,
    c: '#ff7a7a',
    regions: ['body'],
    bodyPos: [-0.14, 0.25, -0.22],
    bodyNormal: [-0.2, 0, -0.98],
    keywords: ['back', 'waist', 'lumbar', 'bone', 'diabetes', 'fatigue', 'kidney', 'ub23', 'l5', 's1', 'slip disc', 'nerve', 'gap', 'कंबर', 'पाठ', 'कमर', 'पीठ', 'हाडे', 'मधुमेह', 'स्लिप डिस्क', 'नस'],
    loc: {
      en: 'On the lower back at waist level (opposite the navel), 2 finger-widths on either side of the spine.',
      hi: 'कमर के निचले हिस्से में (नाभि के ठीक पीछे), रीढ़ की हड्डी के दोनों ओर दो उंगली की दूरी पर।',
      mr: 'कंबरेवर (बेंबीच्या अगदी मागील पातळीवर), मणक्याच्या दोन्ही बाजूंना दोन बोटे अंतरावर.',
    },
    use: {
      en: 'Spinal L5-S1 gap, slip disc, nerve compression, lower back pain (rotate Clockwise), and adult vitality.',
      hi: 'स्पाइनल L5-S1 गैप, स्लिप डिस्क, नस दबना और कमर दर्द (क्लॉकवाइज घुमाकर दबाएं)।',
      mr: 'मणक्याचा L5-S1 गॅप, स्लिप डिस्क, नस दबणे आणि कंबरदुखी (क्लॉकवाइज फिरवून दाबा).',
    },
    how: {
      en: 'Rotate Clockwise gently with thumbs on both sides of the waist spine for 2 minutes.',
      hi: 'कमर के पीछे दोनों तरफ अंगूठों से 2 मिनट क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाएं।',
      mr: 'कंबरेच्या मागे दोन्ही बाजूंना अंगठ्यांनी २ मिनिटे क्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'GV3',
    n: 'Yao Yang Guan (Lumbar Gate)',
    m: 'Governing Vessel',
    mCode: 'GV',
    c: '#fb7185',
    regions: ['body'],
    bodyPos: [0, 0.10, -0.21],
    bodyNormal: [0, 0, -1],
    keywords: ['l5', 's1', 'gap', 'spinal', 'lumbar', 'slip disc', 'back', 'sciatica', 'स्पाइनल', 'गैप', 'कमर', 'कंबर', 'रीढ़'],
    loc: {
      en: 'Right on the lower back midline between the L4 and L5 vertebrae (level with the top of the hip bones).',
      hi: 'कमर के निचले हिस्से की मध्य रेखा पर, कूल्हे की हड्डियों के ऊपरी किनारे की सीध में (L4-L5 के बीच)।',
      mr: 'कंबरेच्या मध्यभागी मणक्यावर, कंबरेच्या हाडांच्या वरच्या रेषेत (L4-L5 दरम्यान).',
    },
    use: {
      en: 'Spinal L5–S1 disc gap & lumbar compression (rotate Anticlockwise with BL23 Clockwise).',
      hi: 'स्पाइनल प्रॉब्लम L5-S1 गैप और कमर के निचले दर्द में (UB23 क्लॉकवाइज के साथ एंटीक्लॉकवाइज दबाएं)।',
      mr: 'स्पायनल L5-S1 गॅप आणि कंबरेच्या खालच्या दुखण्यासाठी (UB23 क्लॉकवाइजसह अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Rotate Anticlockwise smoothly with fingertip pressure in the lower spine hollow for 1–2 minutes.',
      hi: 'कमर की रीढ़ के मध्य बिंदु पर 1–2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'कंबरेच्या मणक्याच्या मध्यावर १–२ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'GB30',
    n: 'Huan Tiao (Jumping Round)',
    m: 'Gall Bladder',
    mCode: 'GB',
    c: '#2dd4bf',
    regions: ['body'],
    bodyPos: [-0.27, -0.10, -0.23],
    bodyNormal: [-0.55, 0, -0.83],
    keywords: ['sciatica', 'hip', 'buttock', 'leg', 'nerve', 'slip disc', 'back', 'सियाटिका', 'सायटिका', 'कूल्हा', 'पाय', 'नस'],
    loc: {
      en: 'On the side-back of the buttock, 1/3 of the way inward from the outer hip bone toward the lower sacrum.',
      hi: 'कूल्हे के बाहरी-पिछले हिस्से के गहरे गड्ढे में (कमर की साइड वाली हड्डी और रीढ़ के निचले सिरे के बीच)।',
      mr: 'नितंबाच्या बाहेरील-मागील खळग्यात (कंबरेचे बाहेरील हाड आणि मणक्याचे खालचे टोक यांच्या १/३ अंतरावर).',
    },
    use: {
      en: 'Key point for Sciatica nerve pain radiating down the leg, hip ache, and piriformis tightness.',
      hi: 'सियाटिका (सायटिका) नस के दर्द, कूल्हे व पैर में खिंचाव के लिए मुख्य बिंदु।',
      mr: 'सायटिकाच्या नसेतील वेदना, नितंब आणि पायात उतरणारे दुखणे कमी करणारा मुख्य बिंदू.',
    },
    how: {
      en: 'Press firmly into the deep hip hollow rotating Anticlockwise (finish with gentle Clockwise) for 1–2 minutes.',
      hi: 'कूल्हे के गड्ढे में 1–2 मिनट एंटीक्लॉकवाइज और फिर हल्का क्लॉकवाइज घुमाकर गहरा दबाएं।',
      mr: 'नितंबाच्या खळग्यात १–२ मिनिटे अँटीक्लॉकवाइज आणि नंतर हलका क्लॉकवाइज दाब द्या.',
    },
  },
  {
    id: 'BL54',
    aliases: ['BL40', 'UB40', 'UB54', 'AB54'],
    n: 'Wei Zhong / UB54 (Bend Middle)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#f87171',
    regions: ['body', 'leg'],
    bodyPos: [-0.24, -0.92, -0.14],
    bodyNormal: [0, 0, -1],
    legPos: [0.0, 0.22, -0.24],
    legNormal: [0, 0, -1],
    keywords: ['back', 'knee', 'leg', 'sciatica', 'lumbar', 'slip disc', 'ligament', 'posterior', 'पाठ', 'कंबर', 'गुडघा', 'पाय', 'घुटना', 'कमर', 'सियाटिका', 'स्लिप डिस्क', 'लिगामेंट'],
    loc: {
      en: 'Right in the center of the crease at the back of the knee.',
      hi: 'घुटने के ठीक पीछे वाली मोड़ की रेखा के मध्य बिंदु पर।',
      mr: 'गुडघ्याच्या मागील बाजूच्या घडीच्या अगदी मध्यभागी.',
    },
    use: {
      en: 'Back-of-knee & posterior ligament pain, slip disc, sciatica, and lumbar pain (rotate Anticlockwise).',
      hi: 'घुटने के पीछे का दर्द, पीछे वाली लिगामेंट, स्लिप डिस्क, सियाटिका और कमर दर्द (एंटीक्लॉकवाइज दबाएं)।',
      mr: 'गुडघ्याच्या मागील दुखणे, मागील लिगामेंट, स्लिप डिस्क, सायटिका व कंबरदुखी (अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Sit comfortably with knee slightly bent and rotate Anticlockwise gently behind the knee for 1 minute.',
      hi: 'बैठकर घुटने को हल्का मोड़ें और पीछे बीच में उंगलियों से 1 मिनट एंटीक्लॉकवाइज दबाएं।',
      mr: 'बसून गुडघा थोडा सैल दुमडा आणि मागे मध्यभागी बोटांनी १ मिनिट अँटीक्लॉकवाइज दाबा.',
    },
  },

  // === KNEE, LEG, DIABETES & FOOT POINTS ===
  {
    id: 'ST36',
    n: 'Zu San Li (Leg Three Miles)',
    m: 'Stomach',
    mCode: 'ST',
    pin: 6,
    c: '#ffd84d',
    regions: ['body', 'leg'],
    bodyPos: [0.29, -1.07, 0.14],
    bodyNormal: [0.55, 0, 0.83],
    legPos: [0.16, -0.26, 0.26],
    legNormal: [0.55, 0, 0.83],
    keywords: ['knee', 'leg', 'st36', 'patella', 'tendon', 'thigh', 'water', 'effusion', 'fatigue', 'diabetes', 'bp', 'digestion', 'immunity', 'गुडघा', 'पाय', 'थकवा', 'मधुमेह', 'घुटना', 'पैर', 'पटेला', 'पानी', 'जांघ'],
    loc: {
      en: 'Four finger-widths below the bottom edge of the kneecap, one finger-width to the outer side of the shin bone.',
      hi: 'घुटने की कटोरी के नीचे से 4 उंगली नीचे और पिंडली की हड्डी से 1 उंगली बाहर की तरफ।',
      mr: 'गुडघ्याच्या वाटीच्या खालच्या टोकापासून ४ बोटे खाली आणि नडगीच्या हाडापासून १ बोट बाहेरील बाजूस.',
    },
    use: {
      en: 'Front/outer knee pain, patellar tendon pain, thigh tendon pain, knee effusion (water in knee) — rotate Clockwise.',
      hi: 'घुटने के सामने व बाहर का दर्द, पटेला के नीचे टेंडन दर्द, जांघ दर्द और घुटने में पानी भरना (क्लॉकवाइज घुमाकर दबाएं)।',
      mr: 'गुडघ्याच्या पुढील व बाहेरील दुखणे, पटेलाखालील टेंडन वेदना आणि गुडघ्यात पाणी भरणे (क्लॉकवाइज फिरवून दाबा).',
    },
    how: {
      en: 'Rotate Clockwise firmly with thumb for 2 minutes on both legs (also supports blood sugar & immunity).',
      hi: 'दोनों पैरों में 2-2 मिनट तक अंगूठे से क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाएं।',
      mr: 'दोन्ही पायांवर २-२ मिनिटे अंगठ्याने क्लॉकवाइज (घड्याळाच्या दिशेने) फिरवून दाबा.',
    },
  },
  {
    id: 'SP10',
    n: 'Xue Hai (Sea of Blood)',
    m: 'Spleen',
    mCode: 'SP',
    c: '#c084fc',
    regions: ['body', 'leg'],
    bodyPos: [0.18, -0.78, 0.14],
    bodyNormal: [-0.5, 0, 0.86],
    legPos: [-0.20, 0.56, 0.26],
    legNormal: [-0.5, 0, 0.86],
    keywords: ['knee', 'sp10', 'patella', 'ligament', 'posterior', 'diabetes', 'sugar', 'leg', 'blood', 'गुडघा', 'मधुमेह', 'शुगर', 'घुटना', 'डायबिटीज', 'लिगामेंट', 'पटेला'],
    loc: {
      en: 'With knee bent, 3 finger-widths above the inner-upper corner of the kneecap on the fleshy thigh bulge.',
      hi: 'घुटने को मोड़ने पर, घुटने की कटोरी के ऊपरी अंदरूनी कोने से 3 उंगली ऊपर जांघ की मांसपेशी के उभार पर।',
      mr: 'गुडघा दुमडल्यावर, गुडघ्याच्या वाटीच्या वरच्या आतील कोपऱ्यापासून ३ बोटे वर मांडीच्या मांसल उंचवट्यावर.',
    },
    use: {
      en: 'Front knee & patella pain, posterior knee ligament pain, blood sugar (diabetes) — rotate Anticlockwise.',
      hi: 'घुटने के सामने व पीछे वाली लिगामेंट का दर्द, पटेला दर्द और ब्लड शुगर/मधुमेह (एंटीक्लॉकवाइज दबाएं)।',
      mr: 'गुडघ्याच्या पुढील व मागील लिगामेंटचे दुखणे, पटेला वेदना आणि मधुमेह (अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Cup your kneecap — thumb lands on SP10; rotate Anticlockwise for 2 minutes.',
      hi: 'हथेली घुटने पर रखें और अंगूठे से जांघ के उभार पर 2 मिनट एंटीक्लॉकवाइज घुमाकर दबाएं।',
      mr: 'तळहात गुडघ्यावर ठेवून अंगठ्याने २ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'SP9',
    n: 'Yin Ling Quan (Yin Mound Spring)',
    m: 'Spleen',
    mCode: 'SP',
    c: '#a78bfa',
    regions: ['body', 'leg'],
    bodyPos: [0.18, -1.01, 0.08],
    bodyNormal: [-0.9, 0, 0.4],
    legPos: [-0.22, -0.05, 0.10],
    legNormal: [-0.9, 0, 0.4],
    keywords: ['knee', 'sp9', 'swelling', 'water', 'effusion', 'ligament', 'inner knee', 'leg', 'diabetes', 'गुडघा', 'सूज', 'पाय', 'घुटना', 'सूजन', 'पानी', 'लिगामेंट'],
    loc: {
      en: 'On the inner side of the leg just below the knee, in the tender hollow underneath the curved top of the shin bone.',
      hi: 'घुटने के ठीक नीचे अंदर की तरफ, पिंडली की हड्डी के घुमाव के नीचे वाले हल्के गड्ढे में।',
      mr: 'गुडघ्याच्या खाली आतील बाजूस, नडगीच्या हाडाच्या वळणाखाली असलेल्या मऊ खळग्यात.',
    },
    use: {
      en: 'Inner knee & medial ligament pain, water in knee (effusion/swelling) — rotate Anticlockwise with LV8/ST36 CW.',
      hi: 'घुटने के अंदर व लिगामेंट का दर्द तथा घुटने में पानी भरना/सूजन (एंटीक्लॉकवाइज दबाएं)।',
      mr: 'गुडघ्याच्या आतील व लिगामेंटचे दुखणे तसेच गुडघ्यात पाणी भरणे/सूज (अँटीक्लॉकवाइज दाबा).',
    },
    how: {
      en: 'Slide thumb under inner shin curve and rotate Anticlockwise gently for 2 minutes.',
      hi: 'अंदर की हड्डी के घुमाव के नीचे 2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) हल्का दबाएं।',
      mr: 'आतील हाडाच्या वळणाखाली २ मिनिटे अँटीक्लॉकवाइज हळू दाबा.',
    },
  },
  {
    id: 'LV8',
    aliases: ['LIV8'],
    n: 'Qu Quan / Liv8 (Spring at the Bend)',
    m: 'Liver',
    mCode: 'LV',
    c: '#34d399',
    regions: ['body', 'leg'],
    bodyPos: [0.17, -0.91, -0.04],
    bodyNormal: [-0.85, 0, -0.5],
    legPos: [-0.20, 0.20, -0.08],
    legNormal: [-0.85, 0, -0.5],
    keywords: ['knee', 'inner knee', 'ligament', 'liv8', 'lv8', 'medial', 'leg', 'गुडघा', 'घुटना', 'लिगामेंट', 'अंदर'],
    loc: {
      en: 'On the inner side of the knee, in the depression right above the inner end of the bent knee crease.',
      hi: 'घुटने के अंदर की तरफ, घुटना मोड़ने पर बनने वाली रेखा के अंदरूनी सिरे के ठीक ऊपर।',
      mr: 'गुडघ्याच्या आतील बाजूस, गुडघा दुमडल्यावर पडणाऱ्या घडीच्या आतील टोकाच्या अगदी वर.',
    },
    use: {
      en: 'Inner knee side & medial ligament pain — pair Clockwise with SP9 Anticlockwise.',
      hi: 'घुटने के अंदर की साइड और लिगामेंट के दर्द में SP9 (एंटीक्लॉकवाइज) के साथ क्लॉकवाइज दबाएं।',
      mr: 'गुडघ्याच्या आतील बाजू व लिगामेंटच्या दुखण्यात SP9 (अँटीक्लॉकवाइज) सोबत क्लॉकवाइज दाबा.',
    },
    how: {
      en: 'With knee slightly flexed, rotate Clockwise at the inner knee crease end for 1–2 minutes.',
      hi: 'घुटने को हल्का मोड़कर अंदरूनी सिरे पर 1–2 मिनट क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाएं।',
      mr: 'गुडघा थोडा दुमडून आतील टोकावर १–२ मिनिटे क्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'ST35',
    n: 'Du Bi (Eye of the Knee)',
    m: 'Stomach',
    mCode: 'ST',
    c: '#facc15',
    regions: ['body', 'leg'],
    bodyPos: [0.27, -0.94, 0.16],
    bodyNormal: [0.35, 0, 0.93],
    legPos: [0.13, 0.12, 0.30],
    legNormal: [0.35, 0, 0.93],
    keywords: ['knee', 'cartilage', 'tear', 'meniscus', 'acl', 'ligament', 'joint', 'arthritis', 'stiff', 'गुडघा', 'घुटना', 'कार्टिलेज', 'लिगामेंट', 'सांधे'],
    loc: {
      en: 'With knee bent, in both eye-dimples just below the kneecap (inner and outer sides of the patellar tendon).',
      hi: 'घुटने को मोड़ने पर घुटने की आंख (कटोरी के नीचे दोनों तरफ बने गड्ढों में)।',
      mr: 'गुडघा दुमडल्यावर गुडघ्याच्या वाटीखाली दोन्ही बाजूंच्या खळग्यांमध्ये (गुडघ्याचा डोळा).',
    },
    use: {
      en: 'Cartilage tear, anterior knee ligament (ACL) pain, and osteoarthritis — press both knee eyes Anticlockwise.',
      hi: 'कार्टिलेज का फटना और सामने वाली लिगामेंट दर्द में घुटने की आंख के दोनों गड्ढे एंटीक्लॉकवाइज दबाएं।',
      mr: 'कार्टिलेज फाटणे आणि पुढील लिगामेंटच्या दुखण्यात गुडघ्याच्या दोन्ही डोळ्यांवर अँटीक्लॉकवाइज दाबा.',
    },
    how: {
      en: 'Sit comfortably with knee bent and rotate both knee eyes gently Anticlockwise for 1–2 minutes.',
      hi: 'आराम से बैठकर घुटने के दोनों गड्ढों को उंगलियों से 1–2 मिनट एंटीक्लॉकवाइज दबाएं।',
      mr: 'आरामात बसून गुडघ्याच्या दोन्ही खळग्यांमध्ये बोटांनी १–२ मिनिटे अँटीक्लॉकवाइज दाबा.',
    },
  },
  {
    id: 'GB34',
    n: 'Yang Ling Quan (Master of Muscles)',
    m: 'Gall Bladder',
    mCode: 'GB',
    c: '#34d399',
    regions: ['body', 'leg'],
    bodyPos: [0.30, -1.01, 0.08],
    bodyNormal: [0.92, 0, 0.38],
    legPos: [0.27, -0.08, 0.10],
    legNormal: [0.92, 0, 0.38],
    keywords: ['muscle', 'tendon', 'ligament', 'knee', 'outer knee', 'thigh', 'slip disc', 'sciatica', 'cramp', 'sprain', 'स्नायू', 'मांसपेशी', 'गुडघा', 'पाय', 'घुटना', 'लिगामेंट', 'स्लिप डिस्क'],
    loc: {
      en: 'On the outer side of the lower leg, in the hollow just in front of and below the small bony bump near the outer knee.',
      hi: 'घुटने के बाहर की तरफ उभरी छोटी हड्डी (फिबुला) के ठीक आगे और नीचे बने गड्ढे में।',
      mr: 'गुडघ्याच्या बाहेरील बाजूस असलेल्या छोट्या हाडाच्या उंचवट्यापुढे आणि खाली असलेल्या खळग्यात.',
    },
    use: {
      en: 'Outer thigh & lateral knee pain, anterior/outer ligament pain, slip disc, and tendon/muscle strain (rotate Anticlockwise).',
      hi: 'जांघ व घुटने के बाहर दर्द, बाहर/सामने की लिगामेंट व टेंडन दर्द तथा स्लिप डिस्क में एंटीक्लॉकवाइज दबाएं।',
      mr: 'मांडी व गुडघ्याच्या बाहेरील दुखणे, लिगामेंट व टेंडन वेदना आणि स्लिप डिस्कसाठी अँटीक्लॉकवाइज दाबा.',
    },
    how: {
      en: 'Rotate Anticlockwise firmly into the outer hollow below the knee for 2 minutes on the painful leg.',
      hi: 'दर्द वाले पैर में घुटने के बाहर बने गड्ढे को 2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'दुखणाऱ्या पायावर गुडघ्याच्या बाहेरील खळग्यात २ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL57',
    n: 'Cheng Shan (Calf Support)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fb7185',
    regions: ['body', 'leg'],
    bodyPos: [-0.25, -1.26, -0.13],
    bodyNormal: [0, 0, -1],
    legPos: [0.0, -0.72, -0.23],
    legNormal: [0, 0, -1],
    keywords: ['leg', 'calf', 'cramp', 'muscle', 'heel', 'back', 'पाय', 'पैर', 'पिंडरी', 'स्नायू'],
    loc: {
      en: 'On the back of the lower leg, right in the V-shaped hollow below the calf muscle belly.',
      hi: 'पैर के पीछे, पिंडली की मांसपेशी के निचले हिस्से में बनने वाले V आकार के गड्ढे में।',
      mr: 'पायाच्या मागील बाजूस, पोटरीच्या स्नायूच्या खाली तयार होणाऱ्या V आकाराच्या खळग्यात.',
    },
    use: {
      en: 'Calf muscle cramps, leg pain after walking/standing, heel pain, and lower back tension.',
      hi: 'पिंडली की मांसपेशियों में ऐंठन, चलने-खड़े रहने से पैर दर्द और एड़ी का दर्द।',
      mr: 'पोटरीत गोळे येणे, चालून पाय दुखणे, टाचेचे दुखणे आणि कंबरेचा ताण.',
    },
    how: {
      en: 'Press upward into the calf hollow with your thumb for 1–2 minutes.',
      hi: 'अंगूठे से पिंडली के बीच के गड्ढे में ऊपर की ओर 1–2 मिनट दबाएं।',
      mr: 'अंगठ्याने पोटरीच्या खळग्यात वरच्या दिशेने १–२ मिनिटे दाबा.',
    },
  },
  {
    id: 'SP6',
    n: 'San Yin Jiao (Three Yin Crossing)',
    m: 'Spleen',
    mCode: 'SP',
    pin: 7,
    c: '#a77bff',
    pregnancyCaution: true,
    regions: ['body', 'leg'],
    bodyPos: [0.20, -1.35, 0.02],
    bodyNormal: [-0.95, 0, 0.3],
    legPos: [-0.17, -0.96, 0.02],
    legNormal: [-0.95, 0, 0.3],
    keywords: ['diabetes', 'period', 'cramp', 'sleep', 'leg', 'swelling', 'hormone', 'thyroid', 'मधुमेह', 'पाळी', 'पीरियड', 'झोप', 'नींद', 'पाय'],
    loc: {
      en: 'Four finger-widths directly above the inner ankle bone, just behind the edge of the shin bone.',
      hi: 'पैर के अंदरूनी टखने की हड्डी से 4 उंगली ऊपर, हड्डी के ठीक पीछे की तरफ।',
      mr: 'पायाच्या आतील घोट्याच्या हाडापासून ४ बोटे वर, हाडाच्या अगदी मागील बाजूस.',
    },
    use: {
      en: 'Diabetes & hormone balance, menstrual cramps, leg swelling/pain, insomnia, and digestion.',
      hi: 'मधुमेह, हार्मोन संतुलन, मासिक दर्द, पैरों की सूजन और अच्छी नींद के लिए।',
      mr: 'मधुमेह, हार्मोन संतुलन, मासिक पाळीचे दुखणे, पायांची सूज आणि शांत झोपेसाठी.',
    },
    how: {
      en: 'Press gently behind the inner shin bone for 2 minutes (avoid during pregnancy).',
      hi: 'अंदरूनी हड्डी के पीछे 2 मिनट हल्के से दबाएं (गर्भावस्था में इसका उपयोग न करें)।',
      mr: 'आतील हाडाच्या मागे २ मिनिटे हळुवार दाबा (गर्भावस्थेत टाळा).',
    },
  },
  {
    id: 'GB39',
    n: 'Xuan Zhong (Master of Bone Marrow)',
    m: 'Gall Bladder',
    mCode: 'GB',
    c: '#22d3ee',
    regions: ['leg'],
    bodyPos: [0.29, -1.35, 0.02],
    bodyNormal: [0.95, 0, 0.3],
    legPos: [0.19, -0.96, 0.04],
    legNormal: [0.95, 0, 0.3],
    keywords: ['bone', 'marrow', 'leg', 'ankle', 'neck', 'arthritis', 'weak', 'हाडे', 'हड्डी', 'पाय', 'घोटा'],
    loc: {
      en: 'Four finger-widths above the outer ankle bone, right in front of the outer lower-leg bone.',
      hi: 'बाहरी टखने की हड्डी से 4 उंगली ऊपर, बाहरी हड्डी के ठीक आगे की खांच में।',
      mr: 'बाहेरील घोट्याच्या हाडापासून ४ बोटे वर, बाहेरील हाडाच्या अगदी समोरील खाचेत.',
    },
    use: {
      en: 'Master point of bone marrow & strength — bone weakness, ankle/leg pain, and stiff neck.',
      hi: 'हड्डियों और मज्जा की मजबूती का मुख्य बिंदु — हड्डियों की कमजोरी, टखने व गर्दन का दर्द।',
      mr: 'हाडांची ताकद वाढवणारा मुख्य बिंदू — हाडांची कमजोरी, घोटा/पायदुखी आणि मान ताठरणे.',
    },
    how: {
      en: 'Massage gently with circular thumb pressure for 1–2 minutes.',
      hi: 'अंगूठे से 1–2 मिनट तक हल्के गोलाकार दबाव दें।',
      mr: 'अंगठ्याने १–२ मिनिटे हळुवार गोल दाब द्या.',
    },
  },
  {
    id: 'KI3',
    aliases: ['K3'],
    n: 'Tai Xi / K3 (Great Ravine)',
    m: 'Kidney',
    mCode: 'KI',
    c: '#38bdf8',
    regions: ['body', 'leg'],
    bodyPos: [0.21, -1.56, -0.05],
    bodyNormal: [-0.9, 0, -0.4],
    legPos: [-0.15, -1.36, -0.10],
    legNormal: [-0.9, 0, -0.4],
    keywords: ['diabetes', 'ankle', 'heel', 'knee', 'back of knee', 'k3', 'fatigue', 'back', 'bone', 'kidney', 'मधुमेह', 'पाय', 'थकवा', 'हाडे', 'घुटना'],
    loc: {
      en: 'In the hollow midway between the inner ankle bone and the Achilles tendon.',
      hi: 'अंदरूनी टखने की हड्डी और एड़ी के पीछे की मुख्य नस के ठीक बीच के गड्ढे में।',
      mr: 'आतील घोट्याचे हाड आणि टाचेच्या मागील मुख्य शिर यांच्या मधल्या खळग्यात.',
    },
    use: {
      en: 'Back-of-knee pain (rotate Clockwise with BL54 ACW), diabetes, ankle/heel pain, and lower back vitality.',
      hi: 'घुटने के पीछे के दर्द (UB54 के साथ क्लॉकवाइज दबाएं), मधुमेह, टखने व एड़ी दर्द और कमर की मजबूती में लाभदायक।',
      mr: 'गुडघ्याच्या मागील दुखणे (UB54 सोबत क्लॉकवाइज दाबा), मधुमेह, घोटा व टाच दुखणे आणि कंबरेसाठी उपयुक्त.',
    },
    how: {
      en: 'Rotate Clockwise gently with your thumb in the inner ankle hollow for 1–2 minutes.',
      hi: 'अंगूठे से टखने के गड्ढे में 1–2 मिनट क्लॉकवाइज (घड़ी की दिशा में) घुमाकर दबाव दें।',
      mr: 'अंगठ्याने घोट्याच्या खळग्यात १–२ मिनिटे क्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL62',
    aliases: ['UB62'],
    n: 'Shen Mai / UB62 (Extending Vessel)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fb7185',
    regions: ['body', 'leg'],
    bodyPos: [0.30, -1.62, 0.02],
    bodyNormal: [0.95, -0.15, 0.25],
    legPos: [0.20, -1.48, 0.02],
    legNormal: [0.95, -0.15, 0.25],
    keywords: ['sciatica', 'ub62', 'bl62', 'ankle', 'leg', 'back', 'nerve', 'सियाटिका', 'सायटिका', 'घोटा', 'कमर', 'नस'],
    loc: {
      en: 'In the small hollow directly below the outer ankle bone (lateral malleolus).',
      hi: 'बाहरी टखने की उभरी हुई हड्डी के ठीक नीचे बने छोटे गड्ढे में।',
      mr: 'बाहेरील घोट्याच्या हाडाच्या अगदी खाली असलेल्या लहान खळग्यात.',
    },
    use: {
      en: 'Sciatica nerve pain (rotate Anticlockwise with GB30 & BL54), outer ankle sprain, and lumbar stiffness.',
      hi: 'सियाटिका दर्द (GB30 व UB54 के साथ एंटीक्लॉकवाइज दबाएं), बाहरी टखने व कमर की जकड़न में आराम।',
      mr: 'सायटिका वेदना (GB30 व UB54 सोबत अँटीक्लॉकवाइज दाबा), बाहेरील घोटा आणि कंबरेच्या जखडणीवर उपयुक्त.',
    },
    how: {
      en: 'Rotate Anticlockwise with steady fingertip pressure directly under the outer ankle bone for 1–2 minutes.',
      hi: 'बाहरी टखने के ठीक नीचे के गड्ढे में 1–2 मिनट एंटीक्लॉकवाइज (उल्टी दिशा में) घुमाकर दबाएं।',
      mr: 'बाहेरील घोट्याच्या खालील खळग्यात १–२ मिनिटे अँटीक्लॉकवाइज फिरवून दाबा.',
    },
  },
  {
    id: 'BL60',
    aliases: ['UB60'],
    n: 'Kun Lun / UB60 (Aspirin Point)',
    m: 'Bladder (UB)',
    mCode: 'BL',
    c: '#fb7185',
    pregnancyCaution: true,
    regions: ['body', 'leg'],
    bodyPos: [0.29, -1.56, -0.05],
    bodyNormal: [0.9, 0, -0.4],
    legPos: [0.16, -1.36, -0.10],
    legNormal: [0.9, 0, -0.4],
    keywords: ['back', 'sciatica', 'ankle', 'heel', 'neck', 'headache', 'bone', 'pain', 'पाय', 'पाठ', 'कंबर', 'टाच'],
    loc: {
      en: 'In the hollow midway between the outer ankle bone and the Achilles tendon.',
      hi: 'बाहरी टखने की हड्डी और एड़ी की नस के बीच बने गड्ढे में।',
      mr: 'बाहेरील घोट्याचे हाड आणि टाचेच्या मागील शिर यांच्या मधल्या खळग्यात.',
    },
    use: {
      en: 'Natural pain reliever for back pain, sciatica, ankle/heel pain, and neck stiffness.',
      hi: 'पीठ व कमर दर्द, साइटिका, एड़ी और गर्दन दर्द में प्राकृतिक दर्द निवारक बिंदु।',
      mr: 'पाठ व कंबरदुखी, सायटिका, टाच दुखणे आणि मान ताठरण्यावर नैसर्गिक वेदनाशामक बिंदू.',
    },
    how: {
      en: 'Pinch gently between KI3 (inner) and BL60 (outer) hollows for 1–2 minutes (avoid in pregnancy).',
      hi: 'अंगूठे और उंगली से टखने के दोनों तरफ के गड्ढों को 1–2 मिनट हल्का दबाएं।',
      mr: 'अंगठा आणि बोटाने घोट्याच्या दोन्ही बाजूंच्या खळग्यांमध्ये १–२ मिनिटे हळू दाबा.',
    },
  },
  {
    id: 'LV3',
    n: 'Tai Chong (Great Surge)',
    m: 'Liver',
    mCode: 'LV',
    pin: 8,
    c: '#4de8b2',
    regions: ['body', 'leg'],
    bodyPos: [0.24, -1.68, 0.12],
    bodyNormal: [0, 0.85, 0.52],
    legPos: [-0.08, -1.52, 0.46],
    legNormal: [0, 0.85, 0.52],
    keywords: ['bp', 'high bp', 'stress', 'anger', 'headache', 'migraine', 'eye', 'cramps', 'बीपी', 'ताण', 'डोकेदुखी', 'राग', 'सिरदर्द', 'तनाव'],
    loc: {
      en: 'On top of the foot, in the soft groove between the big toe and second toe bones (about 2 fingers back from the web).',
      hi: 'पैर के ऊपरी हिस्से में, अंगूठे और दूसरी उंगली की हड्डियों के बीच की खांच में।',
      mr: 'पायाच्या वरच्या बाजूस, मोठ्या अंगठ्याचे आणि दुसऱ्या बोटाचे हाड जिथे मिळते त्या खाचेत.',
    },
    use: {
      en: 'Key point for High BP, stress, irritability, tension headaches, and foot/toe cramps.',
      hi: 'हाई बीपी कम करने, तनाव, गुस्सा, सिरदर्द और पैरों की ऐंठन के लिए मुख्य बिंदु।',
      mr: 'उच्च रक्तदाब (BP), ताण, चिडचिड, डोकेदुखी आणि पायातील गोळ्यांवर मुख्य बिंदू.',
    },
    how: {
      en: 'Press firmly with your thumb toward the ankle for 2 minutes while taking slow breaths.',
      hi: 'अंगूठे से खांच में 2 मिनट गहरा दबाव दें और धीरे-धीरे सांस छोड़ें।',
      mr: 'अंगठ्याने खाचेत २ मिनिटे स्थिर दाब द्या आणि संथ श्वास घ्या.',
    },
  },
  {
    id: 'KI1',
    n: 'Yong Quan (Bubbling Spring)',
    m: 'Kidney',
    mCode: 'KI',
    c: '#22d3ee',
    emergency: true,
    regions: ['leg'],
    bodyPos: [0.26, -1.75, 0.05],
    bodyNormal: [0, -1, 0],
    legPos: [0.0, -1.72, 0.34],
    legNormal: [0, -1, 0],
    keywords: ['bp', 'high bp', 'emergency', 'faint', 'sleep', 'insomnia', 'dizzy', 'heart', 'बीपी', 'झोप', 'चक्कर', 'बेशुद्ध'],
    loc: {
      en: 'On the sole of the foot, in the natural hollow in the upper-middle third just below the ball of the foot.',
      hi: 'पैर के तलवे के ऊपरी-मध्य भाग में, उंगलियों के नीचे बने प्राकृतिक गड्ढे में।',
      mr: 'पायाच्या तळव्यावर, बोटांच्या गादीच्या खाली असलेल्या नैसर्गिक खळग्यात.',
    },
    use: {
      en: 'Brings down high BP energy, emergency revival/fainting, deep sleep, and calming panic.',
      hi: 'हाई बीपी शांत करने, बेहोशी में होश लाने, गहरी नींद और घबराहट कम करने के लिए।',
      mr: 'उच्च रक्तदाब खाली आणणे, बेशुद्धीवर प्रथमोपचार, शांत झोप आणि घबराट कमी करणे.',
    },
    how: {
      en: 'Press firmly into the sole hollow with your thumb for 1–2 minutes before bed or when stressed.',
      hi: 'सोने से पहले या तनाव में पैर के तलवे के इस गड्ढे को अंगूठे से 1–2 मिनट दबाएं।',
      mr: 'झोपण्यापूर्वी किंवा अस्वस्थ वाटल्यास तळव्याच्या या खळग्यात अंगठ्याने १–२ मिनिटे दाबा.',
    },
  },
];

export interface ConditionPreset {
  id: string;
  label: Record<Lang, string>;
  sampleQuery: Record<Lang, string>;
  pointIds: string[];
  primaryRegion: Region3D;
  isEmergency?: boolean;
  yogaIds: string[];
  summary: Record<Lang, string>;
  spokenScript: Record<Lang, string>;
  pressGuide: Record<Lang, string>;
}

export const CONDITION_PRESETS: ConditionPreset[] = [
  {
    id: 'heart_emergency',
    label: { en: 'Heart Attack / Chest Crisis', hi: 'हार्ट अटैक / सीने में दर्द', mr: 'हार्ट अटॅक / छातीत दुखणे' },
    sampleQuery: {
      en: 'Sudden chest pain and heart attack emergency points',
      hi: 'अचानक सीने में दर्द और हार्ट अटैक के आपातकालीन बिंदु',
      mr: 'अचानक छातीत दुखत आहे हार्ट अटॅक इमर्जन्सी बिंदू सांगा',
    },
    pointIds: ['PC6', 'HT7', 'CV17', 'HT9', 'GV26'],
    primaryRegion: 'hand',
    isEmergency: true,
    yogaIds: ['shavasana', 'deep_belly'],
    summary: {
      en: 'EMERGENCY ALERT: Call 108 / 112 or rush to the nearest hospital immediately! While waiting for medical help, sit the person upright, loosen tight clothes, and press PC6 (inner wrist), HT9 (little finger tip), and CV17 (center of chest) gently to calm heart stress.',
      hi: 'आपातकालीन चेतावनी: तुरंत 108 / 112 पर कॉल करें या नजदीकी अस्पताल ले जाएं! एम्बुलेंस आने तक व्यक्ति को आराम से बैठाएं, कपड़े ढीले करें और कलाई पर PC6, छोटी उंगली के सिरे HT9 और छाती के बीच CV17 पर हल्का दबाव दें।',
      mr: 'तात्काळ धोक्याची सूचना: कृपया लगेच १०८ / ११२ वर कॉल करा किंवा जवळच्या रुग्णालयात न्या! डॉक्टर मिळेपर्यंत रुग्णाला शांत बसवा, कपडे सैल करा आणि मनगटावर PC6, करंगळीच्या टोकावर HT9 व छातीच्या मध्यभागी CV17 हळुवार दाबा.',
    },
    spokenScript: {
      en: 'Emergency alert. If someone has chest pain or signs of a heart attack, call ambulance 108 or 112 right away. While waiting for the doctor, keep them seated calmly and press point PC6 three fingers below the inner wrist crease, and pinch point HT9 at the tip of the little finger.',
      hi: 'सावधान! यदि सीने में तेज दर्द या हार्ट अटैक के लक्षण हैं, तो तुरंत 108 या 112 पर एम्बुलेंस बुलाएं। डॉक्टर के आने तक मरीज को आराम से बैठाकर शांत रखें और कलाई की रेखा से तीन उंगली नीचे PC6 और छोटी उंगली के सिरे HT9 पर दबाव दें।',
      mr: 'सावधान! छातीत दुखत असल्यास किंवा हार्ट अटॅकची लक्षणे दिसल्यास लगेच १०८ किंवा ११२ वर रुग्णवाहिका बोलवा. डॉक्टर येईपर्यंत रुग्णाला शांत बसवून मनगटाच्या रेषेपासून तीन बोटे खाली PC6 आणि करंगळीच्या टोकावरील HT9 बिंदूवर दाब द्या.',
    },
    pressGuide: {
      en: 'Keep calm. Press PC6 firmly with thumb and pinch HT9 on the little finger tip for 60 seconds while awaiting emergency care.',
      hi: 'घबराएं नहीं। अस्पताल पहुंचने तक PC6 और छोटी उंगली के सिरे HT9 पर 60 सेकंड दबाव दें।',
      mr: 'घाबरू नका. रुग्णालयात पोहोचेपर्यंत PC6 आणि करंगळीच्या टोकावरील HT9 बिंदूवर ६० सेकंद दाब द्या.',
    },
  },
  {
    id: 'high_bp',
    label: { en: 'High Blood Pressure (BP)', hi: 'हाई बीपी (उच्च रक्तचाप)', mr: 'उच्च रक्तदाब (हाय BP)' },
    sampleQuery: {
      en: 'I have high BP and feel dizzy',
      hi: 'मेरा बीपी बढ़ गया है और चक्कर आ रहे हैं',
      mr: 'माझा बीपी वाढला आहे आणि चक्कर येत आहे',
    },
    pointIds: ['LV3', 'LI11', 'PC6', 'GB20', 'KI1'],
    primaryRegion: 'body',
    yogaIds: ['bhramari', 'anulom_vilom', 'shavasana'],
    summary: {
      en: 'To help calm elevated blood pressure, sit down comfortably and take slow breaths. Press LV3 on top of the foot, LI11 at the outer elbow crease, and PC6 on the inner wrist. Continue prescribed BP medicines and see a doctor if BP stays very high.',
      hi: 'बढ़े हुए बीपी को शांत करने के लिए आराम से बैठकर गहरी सांस लें। पैर के ऊपर LV3, कोहनी के बाहरी किनारे LI11 और कलाई पर PC6 दबाएं। अपनी डॉक्टर की दवाई बंद न करें।',
      mr: 'वाढलेला रक्तदाब शांत करण्यासाठी शांत बसून संथ श्वास घ्या. पायाच्या वरच्या बाजूचा LV3, कोपराचा LI11 आणि मनगटाचा PC6 बिंदू दाबा. डॉक्टरांची गोळी नियमित सुरू ठेवा.',
    },
    spokenScript: {
      en: 'Sit calmly and breathe out slowly. For high blood pressure support, press point LI11 at the outer bend of your elbow for two minutes, and point LV3 between your big toe and second toe. Also practice slow Bhramari or Anulom Vilom breathing.',
      hi: 'आराम से बैठ जाएं और धीरे-धीरे सांस छोड़ें। हाई बीपी को शांत करने के लिए कोहनी के बाहरी सिरे पर LI11 बिंदु को दो मिनट दबाएं और पैर के अंगूठे व दूसरी उंगली के बीच LV3 बिंदु दबाएं। साथ ही धीमा अनुलोम-विलोम करें।',
      mr: 'शांत बसा आणि हळुवार श्वास सोडा. उच्च रक्तदाब कमी करण्यासाठी कोपराच्या बाहेरील बाजूचा LI11 बिंदू दोन मिनिटे दाबा आणि पायाच्या अंगठ्याजवळील LV3 बिंदूवर दाब द्या. सोबत शांत अनुलोम-विलोम करा.',
    },
    pressGuide: {
      en: 'Press LI11 and LV3 gently for 2 minutes on both sides with slow exhalation.',
      hi: 'दोनों तरफ LI11 और LV3 को धीरे-धीरे 2 मिनट दबाएं और लंबी सांस छोड़ें।',
      mr: 'दोन्ही बाजूंना LI11 आणि LV3 दोन मिनिटे हळुवार दाबा आणि श्वास सोडा.',
    },
  },
  {
    id: 'diabetes',
    label: { en: 'Diabetes (Blood Sugar)', hi: 'मधुमेह (डायबिटीज / शुगर)', mr: 'मधुमेह (शुगर / डायबिटीज)' },
    sampleQuery: {
      en: 'Points for diabetes and blood sugar control',
      hi: 'डायबिटीज और शुगर कंट्रोल करने के बिंदु बताएं',
      mr: 'मधुमेह आणि शुगर नियंत्रणासाठी कोणते बिंदू दाबावेत',
    },
    pointIds: ['SP10', 'ST36', 'SP6', 'CV12', 'KI3'],
    primaryRegion: 'leg',
    yogaIds: ['mandukasana', 'vajrasana', 'anulom_vilom'],
    summary: {
      en: 'Diabetes is very common in adults. Alongside balanced meals, daily walking, and regular medicines, acupressure on SP10 (above inner knee), ST36 (below knee), SP6 (above inner ankle), and CV12 (upper belly) supports pancreas function and blood sugar balance.',
      hi: 'डायबिटीज (मधुमेह) में नियमित पैदल चलने और दवाई के साथ घुटने के ऊपर SP10, घुटने के नीचे ST36 और टखने के ऊपर SP6 बिंदुओं को रोजाना दबाने से पाचन और ब्लड शुगर संतुलन में मदद मिलती है।',
      mr: 'मधुमेह (शुगर) नियंत्रणासाठी दररोज चालणे आणि औषधांसोबत गुडघ्यावरील SP10, गुडघ्याखालील ST36 आणि घोट्यावरील SP6 बिंदू दाबल्याने रक्तातील साखर संतुलित राहण्यास मदत होते.',
    },
    spokenScript: {
      en: 'For diabetes and blood sugar support, press point SP10 three fingers above the inner kneecap, and point ST36 four fingers below the kneecap every morning for two minutes. Pair this with Mandukasana yoga and a 20-minute daily walk.',
      hi: 'मधुमेह और शुगर को संतुलित रखने के लिए रोज सुबह घुटने के ऊपर अंदर की तरफ SP10 और घुटने के नीचे ST36 बिंदु को दो-दो मिनट दबाएं। इसके साथ मंडूकासन योग और रोज पैदल चलना बहुत फायदेमंद है।',
      mr: 'मधुमेह नियंत्रणासाठी दररोज सकाळी गुडघ्याच्या वर आतील बाजूचा SP10 आणि गुडघ्याखालील ST36 बिंदू दोन मिनिटे दाबा. सोबतच मंडुकासन योगासन आणि दररोज चालणे खूप फायदेशीर आहे.',
    },
    pressGuide: {
      en: 'Press SP10, ST36, and SP6 daily for 2 minutes before meals.',
      hi: 'भोजन से पहले SP10, ST36 और SP6 को रोज 2 मिनट दबाएं।',
      mr: 'जेवणापूर्वी SP10, ST36 आणि SP6 दररोज २ मिनिटे दाबा.',
    },
  },
  {
    id: 'knee_pain',
    label: { en: 'Knee, Ligament, Cartilage & Fluid', hi: 'घुटने, लिगामेंट, कार्टिलेज व पानी', mr: 'गुडघे, लिगामेंट, कार्टिलेज व पाणी' },
    sampleQuery: {
      en: 'Knee ligament, patella tendon, cartilage tear, or water in knee pain',
      hi: 'घुटने में दर्द, पटेला टेंडन, लिगामेंट, कार्टिलेज या घुटने में पानी भरना',
      mr: 'गुडघेदुखी, पटेला टेंडन, लिगामेंट, कार्टिलेज किंवा गुडघ्यात पाणी भरणे',
    },
    pointIds: ['ST36', 'SP10', 'SP9', 'LV8', 'ST35', 'GB34', 'BL54', 'KI3'],
    primaryRegion: 'leg',
    yogaIds: ['quad_stretch', 'ankle_pumps'],
    summary: {
      en: 'Knee Protocol: Front/patella tendon or fluid -> ST36 (Clockwise) + SP10/SP9 (Anticlockwise). Inner knee ligament -> SP9 (Anticlockwise) + LV8 (Clockwise). Outer knee/thigh tendon -> ST36 (Clockwise) + GB34 (Anticlockwise). Cartilage tear / ACL -> ST35 both knee eyes (Anticlockwise). Back of knee -> BL54 (Anticlockwise) + KI3 (Clockwise).',
      hi: 'घुटने का पूरा उपचार: सामने/पटेला व घुटने में पानी -> ST36 (क्लॉकवाइज) + SP10/SP9 (एंटीक्लॉकवाइज)। अंदरूनी लिगामेंट -> SP9 (एंटीक्लॉकवाइज) + LV8/Liv8 (क्लॉकवाइज)। बाहरी घुटना व जांघ -> ST36 (क्लॉकवाइज) + GB34 (एंटीक्लॉकवाइज)। कार्टिलेज फटना/ACL -> ST35 दोनों आंखों के बिंदु (एंटीक्लॉकवाइज)। पीछे से दर्द -> UB54 (एंटीक्लॉकवाइज) + K3 (क्लॉकवाइज)।',
      mr: 'गुडघ्याचा संपूर्ण उपचार: पुढील पटेला/पाणी -> ST36 (क्लॉकवाइज) + SP10/SP9 (अँटीक्लॉकवाइज). आतील लिगामेंट -> SP9 (अँटीक्लॉकवाइज) + LV8 (क्लॉकवाइज). बाहेरील बाजू -> ST36 (क्लॉकवाइज) + GB34 (अँटीक्लॉकवाइज). कार्टिलेज/ACL -> ST35 दोन्ही डोळे (अँटीक्लॉकवाइज). मागील दुखणे -> UB54 (अँटीक्लॉकवाइज) + K3 (क्लॉकवाइज).',
    },
    spokenScript: {
      en: 'For knee, ligament, or water accumulation, rotate ST36 clockwise and SP10 and SP9 anticlockwise for two minutes. For inner knee pain add LV8 clockwise, for outer knee add GB34 anticlockwise, and for cartilage tear press ST35 knee eyes anticlockwise.',
      hi: 'घुटने, लिगामेंट या पानी भरने की समस्या के लिए ST36 को क्लॉकवाइज और SP10 व SP9 को एंटीक्लॉकवाइज दो-दो मिनट घुमाकर दबाएं। अंदरूनी दर्द में LV8 क्लॉकवाइज, बाहरी दर्द में GB34 एंटीक्लॉकवाइज और कार्टिलेज में ST35 दोनों बिंदु एंटीक्लॉकवाइज दबाएं।',
      mr: 'गुडघेदुखी, लिगामेंट किंवा गुडघ्यात पाणी भरल्यास ST36 क्लॉकवाइज आणि SP10 व SP9 अँटीक्लॉकवाइज दोन मिनिटे दाबा. आतील दुखण्यासाठी LV8 क्लॉकवाइज, बाहेरील दुखण्यासाठी GB34 अँटीक्लॉकवाइज आणि कार्टिलेजसाठी ST35 दोन्ही बिंदू अँटीक्लॉकवाइज दाबा.',
    },
    pressGuide: {
      en: 'Follow Clockwise (ST36, LV8, KI3) vs Anticlockwise (SP10, SP9, ST35, GB34, BL54) gently for 2 min per point.',
      hi: 'क्लॉकवाइज (ST36, Liv8, K3) और एंटीक्लॉकवाइज (SP10, SP9, ST35, GB34, UB54) दिशा में 2 मिनट दबाएं।',
      mr: 'क्लॉकवाइज (ST36, Liv8, K3) आणि अँटीक्लॉकवाइज (SP10, SP9, ST35, GB34, UB54) दिशेने २ मिनिटे दाबा.',
    },
  },
  {
    id: 'bone_pain',
    label: { en: 'Bone & Joint Pain (UB11, UB12)', hi: 'हड्डियों व जोड़ों का दर्द', mr: 'हाडे व सांधेदुखी (UB11, UB12)' },
    sampleQuery: {
      en: 'Bone pain and joint stiffness UB11 UB12',
      hi: 'मेरी हड्डियों और जोड़ों में दर्द रहता है',
      mr: 'माझी हाडे आणि सांधे खूप दुखतात',
    },
    pointIds: ['BL11', 'BL12', 'GB39', 'BL23'],
    primaryRegion: 'shoulder',
    yogaIds: ['cobra_pose', 'cat_cow'],
    summary: {
      en: 'BL11 (UB11) is the Master Point of Bones, located on the upper back beside the T1 vertebra. Pair it with BL12 (UB12) just below it, GB39 (above outer ankle — Master of Bone Marrow), and BL23 on the lower back.',
      hi: 'UB11 (BL11) हड्डियों का मुख्य एक्यूप्रेशर बिंदु है जो गर्दन के ठीक नीचे रीढ़ के पास होता है। इसके साथ UB12 (BL12), टखने के ऊपर GB39 और कमर पर BL23 दबाने से हड्डियों को मजबूती मिलती है।',
      mr: 'UB11 (BL11) हा सर्व हाडांचा मुख्य बिंदू असून तो मानेखाली पाठीच्या वरच्या भागात असतो. सोबत UB12 (BL12), घोट्यावरील GB39 आणि कंबरेवरील BL23 दाबल्याने हाडांचे दुखणे कमी होते.',
    },
    spokenScript: {
      en: 'For bone and joint aches, press UB11 and UB12 on the upper back right beside the spine below the neck, and point GB39 four fingers above your outer ankle bone. These master points strengthen bone vitality.',
      hi: 'हड्डियों और जोड़ों के दर्द में आराम के लिए गर्दन के नीचे पीठ के ऊपरी हिस्से में UB11 और UB12 बिंदुओं को दबाएं, और बाहरी टखने से चार उंगली ऊपर GB39 बिंदु पर दो मिनट दबाव दें।',
      mr: 'हाडे आणि सांधेदुखीसाठी मानेखाली पाठीच्या वरच्या भागात UB11 आणि UB12 हे बिंदू दाबा, तसेच बाहेरील घोट्यापासून चार बोटे वर GB39 या बिंदूवर दोन मिनिटे दाब द्या.',
    },
    pressGuide: {
      en: 'Use fingertips or lean gently against a tennis ball on a wall to press UB11 & UB12 for 90 seconds.',
      hi: 'उंगलियों से या दीवार पर टेनिस बॉल की मदद से UB11 और UB12 को 90 सेकंड दबाएं।',
      mr: 'बोटांनी किंवा भिंतीवर टेनिस बॉलच्या मदतीने UB11 आणि UB12 वर ९० सेकंद दाब द्या.',
    },
  },
  {
    id: 'muscle_pain',
    label: { en: 'Muscle Pain & Cramps', hi: 'मांसपेशियों में दर्द व ऐंठन', mr: 'स्नायू दुखणे व गोळे येणे' },
    sampleQuery: {
      en: 'I have muscle pain and cramps in my body and legs',
      hi: 'मेरी मांसपेशियों में बहुत दर्द और खिंचाव है',
      mr: 'माझे स्नायू खूप दुखतात आणि गोळे येतात',
    },
    pointIds: ['GB34', 'BL57', 'GB21', 'LI4'],
    primaryRegion: 'leg',
    yogaIds: ['quad_stretch', 'cat_cow'],
    summary: {
      en: 'GB34 (outer leg just below the knee) is the Master Point of all muscles and tendons. Combine with BL57 (middle of calf) for leg cramps, GB21 for shoulder muscle knots, and LI4 for overall pain relief.',
      hi: 'GB34 सभी मांसपेशियों का मुख्य बिंदु है जो घुटने के बाहर नीचे की तरफ होता है। पैरों की ऐंठन के लिए पिंडली का BL57 और कंधे के लिए GB21 बहुत लाभदायक है।',
      mr: 'GB34 हा सर्व स्नायूंचा मुख्य बिंदू असून तो गुडघ्याखाली बाहेरील बाजूला असतो. पोटरीतील गोळ्यांसाठी BL57 आणि खांद्यांच्या स्नायूंसाठी GB21 दाबा.',
    },
    spokenScript: {
      en: 'For muscle pain and cramps, press GB34 on the outer side of your leg just below the knee — it is the master point for all muscles. For calf cramps, gently press BL57 on the back of your calf.',
      hi: 'मांसपेशियों के दर्द और खिंचाव के लिए घुटने के ठीक नीचे बाहर की ओर GB34 बिंदु दबाएं, यह सभी मांसपेशियों का मुख्य बिंदु है। पिंडली के दर्द में BL57 दबाएं।',
      mr: 'स्नायूंच्या वेदना आणि गोळ्यांसाठी गुडघ्याखाली बाहेरील बाजूला असलेला GB34 हा मुख्य बिंदू दोन मिनिटे दाबा. पोटरी दुखत असल्यास BL57 बिंदूवर हळू दाब द्या.',
    },
    pressGuide: {
      en: 'Press GB34 firmly for 2 minutes while keeping the painful muscle warm and relaxed.',
      hi: 'मांसपेशी को आराम देकर GB34 पर 2 मिनट तक मध्यम दबाव दें।',
      mr: 'स्नायू सैल सोडून GB34 वर २ मिनिटे मध्यम दाब द्या.',
    },
  },
  {
    id: 'headache',
    label: { en: 'Headache & Migraine', hi: 'सिरदर्द व माइग्रेन', mr: 'डोकेदुखी व अर्धशिशी' },
    sampleQuery: {
      en: 'I have a severe headache and stress',
      hi: 'मुझे बहुत तेज सिरदर्द और तनाव हो रहा है',
      mr: 'माझे डोके खूप दुखत आहे आणि ताण आला आहे',
    },
    pointIds: ['LI4', 'GB20', 'GV20', 'BL2', 'LV3'],
    primaryRegion: 'hand',
    yogaIds: ['bhramari', 'anulom_vilom'],
    summary: {
      en: 'For fast headache and migraine relief, press LI4 in the web between thumb and index finger, GB20 at the back base of the skull, BL2 at the inner eyebrows, and GV20 on top of the head.',
      hi: 'सिरदर्द और माइग्रेन में तुरंत राहत के लिए हाथ के अंगूठे व उंगली के बीच LI4, सिर के पीछे GB20, भौंहों के पास BL2 और सिर के ऊपर GV20 दबाएं।',
      mr: 'डोकेदुखी आणि अर्धशिशीवर त्वरित आरामासाठी हातावरील LI4, डोक्याच्या मागील बाजूचा GB20, भुवयांजवळील BL2 आणि डोक्याच्या वरचा GV20 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'To ease your headache, press point LI4 in the soft web between your thumb and index finger for two minutes on each hand. Next, gently press GB20 in the hollows at the back base of your skull.',
      hi: 'सिरदर्द से आराम के लिए अपने हाथ के अंगूठे और तर्जनी उंगली के बीच LI4 बिंदु को दोनों हाथों में दो-दो मिनट दबाएं। फिर सिर के पीछे दोनों गड्ढों में GB20 बिंदु दबाएं।',
      mr: 'डोकेदुखी कमी करण्यासाठी हाताचा अंगठा आणि पहिले बोट यांच्या मधला LI4 बिंदू दोन्ही हातांवर दोन-दोन मिनिटे दाबा. त्यानंतर डोक्याच्या मागील खळग्यातील GB20 बिंदू हळुवार दाबा.',
    },
    pressGuide: {
      en: 'Avoid LI4 during pregnancy. Press in slow circles while exhaling deeply.',
      hi: 'गर्भावस्था में LI4 न दबाएं। बाकी बिंदुओं को गहरी सांस छोड़ते हुए 2 मिनट दबाएं।',
      mr: 'गर्भावस्थेत LI4 दाबू नका. संथ श्वास घेत २ मिनिटे गोलाकार दाब द्या.',
    },
  },
  {
    id: 'cough_fever_throat',
    label: { en: 'Cough, Fever & Throat Pain', hi: 'खांसी, बुखार व गले में दर्द', mr: 'खोकला, ताप व घसादुखी' },
    sampleQuery: {
      en: 'I have cough, fever, and sore throat pain',
      hi: 'मुझे खांसी, बुखार और गले में बहुत दर्द है',
      mr: 'मला खोकला, ताप आणि घसा खूप दुखत आहे',
    },
    pointIds: ['LU10', 'LU11', 'LI11', 'GV14', 'CV22', 'LI4'],
    primaryRegion: 'hand',
    yogaIds: ['anulom_vilom', 'deep_belly'],
    summary: {
      en: 'For cough, sore throat, and fever: press LU10 on the fleshy thumb pad and LU11 at the thumbnail corner for throat/cough; press LI11 (outer elbow) and GV14 (base of neck) to help bring down fever.',
      hi: 'खांसी, गले में दर्द और बुखार के लिए हथेली पर अंगूठे के नीचे LU10 और नाखून के पास LU11 दबाएं। बुखार उतारने के लिए कोहनी पर LI11 और गर्दन के नीचे GV14 दबाएं।',
      mr: 'खोकला, घसादुखी आणि तापासाठी तळहातावर अंगठ्याखालील LU10 व नखाजवळील LU11 दाबा. ताप कमी करण्यासाठी कोपरावरील LI11 आणि मानेखालील GV14 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'For cough, sore throat, and fever, press LU10 on the fleshy thumb pad of your palm and LU11 beside your thumbnail for throat relief. To help cool fever, press LI11 at the outer elbow crease for two minutes.',
      hi: 'खांसी और गले के दर्द के लिए हथेली में अंगूठे के नीचे LU10 और अंगूठे के नाखून के पास LU11 बिंदु दबाएं। बुखार कम करने के लिए कोहनी के बाहरी सिरे पर LI11 बिंदु को दो मिनट दबाएं।',
      mr: 'खोकला आणि घसादुखीसाठी तळहातावरील अंगठ्याखालचा LU10 आणि नखाजवळील LU11 बिंदू दाबा. ताप कमी करण्यासाठी कोपराच्या बाहेरील बाजूचा LI11 बिंदू दोन मिनिटे दाबा.',
    },
    pressGuide: {
      en: 'Sip warm water, press LU10 for 2 minutes, and apply gentle pressure on CV22 at the throat hollow.',
      hi: 'गुनगुना पानी पिएं और LU10 तथा गले के नीचे CV22 पर बेहद हल्का दबाव दें।',
      mr: 'कोमट पाणी प्या आणि LU10 तसेच घशाखालील CV22 बिंदूवर अतिशय हळुवार दाब द्या.',
    },
  },
  {
    id: 'back_pain',
    label: { en: 'Back & Lumbar Pain', hi: 'पीठ व कमर दर्द', mr: 'पाठ व कंबरदुखी' },
    sampleQuery: {
      en: 'I have severe lower back and waist pain',
      hi: 'मेरी पीठ और कमर में बहुत दर्द है',
      mr: 'माझी पाठ आणि कंबर खूप दुखत आहे',
    },
    pointIds: ['BL23', 'BL54', 'BL60', 'SI3'],
    primaryRegion: 'body',
    yogaIds: ['cat_cow', 'cobra_pose'],
    summary: {
      en: 'For lower back and waist pain, warm and press BL23 on both sides of the waist spine, BL54 directly behind the knee, BL60 at the outer ankle hollow, and SI3 on the outer edge of the hand.',
      hi: 'कमर और पीठ दर्द के लिए कमर के पीछे BL23, घुटने के ठीक पीछे BL54, बाहरी टखने पर BL60 और हाथ के बाहरी किनारे SI3 बिंदु दबाने से तुरंत आराम मिलता है।',
      mr: 'कंबर आणि पाठदुखीसाठी कंबरेच्या मागे BL23, गुडघ्याच्या मागील बाजूस BL54, बाहेरील घोट्यावर BL60 आणि हाताच्या बाहेरील कडेवरील SI3 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'To relieve back pain, press point BL23 on your lower back two fingers on either side of the spine, and press BL54 in the center crease behind your knee for one minute.',
      hi: 'पीठ और कमर दर्द से राहत के लिए कमर पर रीढ़ की हड्डी के दोनों तरफ BL23 बिंदु दबाएं, और घुटने के ठीक पीछे बीच में BL54 बिंदु को एक मिनट दबाएं।',
      mr: 'पाठ आणि कंबरदुखी कमी करण्यासाठी कंबरेवर मणक्याच्या दोन्ही बाजूंना असलेला BL23 बिंदू आणि गुडघ्याच्या मागील घडीतील BL54 बिंदू एक मिनिट दाबा.',
    },
    pressGuide: {
      en: 'Massage BL23 gently with warm palms and press SI3 on the outer hand edge.',
      hi: 'गर्म हथेलियों से BL23 को सहलाएं और हाथ के बाहरी किनारे SI3 दबाएं।',
      mr: 'उबदार तळहातांनी BL23 वर मसाज करा आणि हाताच्या कडेवरील SI3 दाबा.',
    },
  },
  {
    id: 'neck_shoulder',
    label: { en: 'Neck & Shoulder Pain', hi: 'गर्दन व कंधे का दर्द', mr: 'मान व खांदेदुखी' },
    sampleQuery: {
      en: 'I have stiff neck and shoulder pain',
      hi: 'मेरी गर्दन अकड़ गई है और कंधे में दर्द है',
      mr: 'माझी मान आणि खांदा खूप दुखत आहे',
    },
    pointIds: ['GB21', 'LI15', 'GB20', 'SI11', 'TW14'],
    primaryRegion: 'shoulder',
    yogaIds: ['neck_rolls', 'shoulder_shrugs'],
    summary: {
      en: 'For neck and shoulder stiffness or frozen shoulder, press GB21 on top of the shoulder muscle, LI15 on the front shoulder dimple, TW14 on the rear shoulder, and GB20 under the skull base.',
      hi: 'गर्दन की अकड़न और कंधे के दर्द में कंधे के ऊपर GB21, सामने के गड्ढे में LI15, पीछे TW14 और सिर के पीछे GB20 दबाने से तुरंत राहत मिलती है।',
      mr: 'मान ताठरणे आणि खांदेदुखी (फ्रोझन शोल्डर) साठी खांद्यावरील GB21, पुढील बाजूचा LI15, मागील बाजूचा TW14 आणि डोक्यामागील GB20 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'For neck and shoulder pain, gently press GB21 on the highest muscle on top of your shoulder, and LI15 in the dimple at the front outer shoulder for two minutes while relaxing your arms.',
      hi: 'गर्दन और कंधे के दर्द के लिए कंधे की ऊपरी मांसपेशी पर GB21 और कंधे के बाहरी गड्ढे में LI15 बिंदु को दो मिनट हल्के से दबाएं।',
      mr: 'मान आणि खांदेदुखीसाठी खांद्याच्या वरच्या स्नायूवरील GB21 आणि खांद्याच्या बाहेरील खळग्यातील LI15 बिंदू हात सैल सोडून दोन मिनिटे दाबा.',
    },
    pressGuide: {
      en: 'Avoid GB21 in pregnancy. Move shoulders slowly in circles after pressing.',
      hi: 'गर्भावस्था में GB21 न दबाएं। दबाने के बाद कंधों को धीरे-धीरे गोल घुमाएं।',
      mr: 'गर्भावस्थेत GB21 दाबू नका. दाबल्यानंतर खांदे हळुवार गोल फिरवा.',
    },
  },
  {
    id: 'hand_pain',
    label: { en: 'Hand & Wrist Pain', hi: 'हाथ व कलाई का दर्द', mr: 'हात व मनगट दुखणे' },
    sampleQuery: {
      en: 'My hand, wrist, and fingers are aching',
      hi: 'मेरे हाथ, कलाई और उंगलियों में दर्द है',
      mr: 'माझा हात, मनगट आणि बोटे खूप दुखत आहेत',
    },
    pointIds: ['LI4', 'PC6', 'PC8', 'TW3', 'SI3'],
    primaryRegion: 'hand',
    yogaIds: ['wrist_stretch', 'deep_belly'],
    summary: {
      en: 'For hand, wrist, and finger pain, gently press LI4 in the thumb-index web, PC8 in the center of the palm, PC6 below the inner wrist, and TW3 between the 4th and 5th knuckles on the back of the hand.',
      hi: 'हाथ, कलाई और उंगलियों के दर्द के लिए LI4, हथेली के बीच PC8, कलाई पर PC6 और हाथ के पीछे TW3 बिंदु दबाएं।',
      mr: 'हात, मनगट आणि बोटांच्या दुखण्यासाठी LI4, तळहाताच्या मध्यभागी PC8, मनगटावर PC6 आणि हातामागील TW3 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'For hand and wrist pain, press PC8 in the center of your palm, LI4 between your thumb and index finger, and TW3 on the back of your hand behind the ring finger knuckle.',
      hi: 'हाथ और कलाई के दर्द के लिए हथेली के बीच PC8, अंगूठे के पास LI4 और हाथ के पीछे TW3 बिंदु को हल्के से दबाएं।',
      mr: 'हात आणि मनगट दुखत असल्यास तळहाताच्या मधला PC8, अंगठ्याजवळील LI4 आणि हाताच्या मागील बाजूचा TW3 बिंदू हळुवार दाबा.',
    },
    pressGuide: {
      en: 'Open and stretch fingers gently after pressing each point for 60 seconds.',
      hi: 'हर बिंदु को 60 सेकंड दबाने के बाद उंगलियों को धीरे-धीरे खोलें और स्ट्रेच करें।',
      mr: 'प्रत्येक बिंदू ६० सेकंद दाबल्यानंतर बोटे हळुवार उघडून स्ट्रेच करा.',
    },
  },
  {
    id: 'leg_pain',
    label: { en: 'Leg Pain & Fatigue', hi: 'पैरों में दर्द व थकान', mr: 'पायदुखी व थकवा' },
    sampleQuery: {
      en: 'My legs are aching and feel very tired',
      hi: 'मेरे पैरों में बहुत दर्द और थकान है',
      mr: 'माझे पाय खूप दुखत आहेत आणि थकवा जाणवतो',
    },
    pointIds: ['ST36', 'BL57', 'GB34', 'SP6', 'BL60'],
    primaryRegion: 'leg',
    yogaIds: ['ankle_pumps', 'quad_stretch'],
    summary: {
      en: 'For tired, aching legs, press ST36 below the outer knee, GB34 for muscle tightness, BL57 in the back calf hollow, and BL60 behind the outer ankle.',
      hi: 'पैरों की थकान और दर्द के लिए घुटने के नीचे ST36, बाहर की तरफ GB34, पिंडली पर BL57 और टखने के पास BL60 दबाएं।',
      mr: 'पायांचे दुखणे आणि थकव्यासाठी गुडघ्याखालील ST36, बाहेरील बाजूचा GB34, पोटरीवरील BL57 आणि घोट्याजवळील BL60 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'For tired and aching legs, elevate your feet slightly and press ST36 below the outer knee and BL57 at the center back of your calf for two minutes each.',
      hi: 'पैरों के दर्द और थकान के लिए घुटने के नीचे ST36 और पिंडली के बीच BL57 बिंदु को दो-दो मिनट दबाएं।',
      mr: 'पायदुखी आणि थकव्यासाठी पाय थोडे उंच ठेवून गुडघ्याखालील ST36 आणि पोटरीच्या मध्यावरील BL57 बिंदू दोन-दोन मिनिटे दाबा.',
    },
    pressGuide: {
      en: 'Massage upward from ankle to knee and press ST36 & BL57 for 2 minutes.',
      hi: 'टखने से घुटने की तरफ हल्की मालिश करें और ST36 व BL57 दबाएं।',
      mr: 'घोट्यापासून गुडघ्याकडे हलका मसाज करा आणि ST36 व BL57 दाबा.',
    },
  },
  {
    id: 'stomach_acidity',
    label: { en: 'Stomach, Gas & Acidity', hi: 'पेट दर्द, गैस व एसिडिटी', mr: 'पोटदुखी, गॅस व अॅसिडिटी' },
    sampleQuery: {
      en: 'I have stomach pain, gas, and acidity',
      hi: 'मुझे पेट में गैस, एसिडिटी और अपच है',
      mr: 'मला पोटात गॅस, अॅसिडिटी आणि पोटदुखी होत आहे',
    },
    pointIds: ['CV12', 'ST36', 'PC6', 'ST25'],
    primaryRegion: 'body',
    yogaIds: ['vajrasana', 'deep_belly'],
    summary: {
      en: 'For stomach pain, acidity, and gas, gently press CV12 halfway between navel and breastbone, ST25 beside the navel, ST36 below the knee, and PC6 on the inner wrist for nausea.',
      hi: 'पेट दर्द, गैस और एसिडिटी के लिए नाभि के ऊपर CV12, नाभि के दोनों तरफ ST25, घुटने के नीचे ST36 और मतली के लिए PC6 दबाएं।',
      mr: 'पोटदुखी, गॅस आणि अॅसिडिटीसाठी बेंबीच्या वरचा CV12, बेंबीच्या बाजूचा ST25, गुडघ्याखालील ST36 आणि मळमळीसाठी PC6 बिंदू दाबा.',
    },
    spokenScript: {
      en: 'For gas, acidity, and stomach ache, gently massage CV12 halfway between your navel and breastbone in slow circles, and press ST36 below the knee. Sitting in Vajrasana after meals also helps digestion.',
      hi: 'पेट की गैस और एसिडिटी में आराम के लिए नाभि से चार उंगली ऊपर CV12 पर हल्के गोल घुमाकर दबाएं और घुटने के नीचे ST36 दबाएं। खाने के बाद वज्रासन में बैठना बहुत फायदेमंद है।',
      mr: 'गॅस, अॅसिडिटी आणि पोटदुखीवर आरामासाठी बेंबीच्या वरच्या CV12 बिंदूवर हळुवार गोल दाब द्या आणि गुडघ्याखालील ST36 दाबा. जेवणानंतर वज्रासनात बसणे पचनासाठी उत्तम आहे.',
    },
    pressGuide: {
      en: 'Press CV12 softly for 2 minutes (at least 1 hour after eating).',
      hi: 'खाना खाने के 1 घंटे बाद ही CV12 पर 2 मिनट हल्का दबाव दें।',
      mr: 'जेवणानंतर किमान १ तासाने CV12 वर २ मिनिटे हळुवार दाब द्या.',
    },
  },
  {
    id: 'slip_disc_spine_gap',
    label: { en: 'Slip Disc, L5-S1 Gap & Pinched Nerve', hi: 'स्लिप डिस्क, L5-S1 गैप व नस दबना', mr: 'स्लिप डिस्क, L5-S1 गॅप व नस दबणे' },
    sampleQuery: {
      en: 'Slip disc, L5 S1 spinal gap, and pinched nerve compression',
      hi: 'स्पाइनल प्रॉब्लम L5 S1 गैप, स्लिप डिस्क और नस का दबना',
      mr: 'मणक्यातील L5 S1 गॅप, स्लिप डिस्क आणि नस दबली आहे',
    },
    pointIds: ['BL23', 'GV3', 'BL54', 'GB34', 'GV14'],
    primaryRegion: 'body',
    yogaIds: ['cobra_pose', 'cat_cow'],
    summary: {
      en: 'For L5–S1 spinal gap, slip disc, and pinched nerve: press BL23/UB23 (Clockwise) on the lower waist, GV3 (Anticlockwise) at L4–L5 midline, plus BL54/UB54 & GB34 (Anticlockwise). For pinched nerve shrinkage also press GV14 (Anticlockwise).',
      hi: 'L5-S1 गैप के लिए UB23 (क्लॉकवाइज) और GV3 (एंटीक्लॉकवाइज) दबाएं। स्लिप डिस्क में UB54 और GB34 (एंटीक्लॉकवाइज) तथा UB23 (क्लॉकवाइज) दबाएं। नस दबने/सिकुड़ने पर UB23 (क्लॉकवाइज) व GV14 (एंटीक्लॉकवाइज) दबाएं।',
      mr: 'L5-S1 गॅपसाठी UB23 (क्लॉकवाइज) आणि GV3 (अँटीक्लॉकवाइज) दाबा. स्लिप डिस्कसाठी UB54 व GB34 (अँटीक्लॉकवाइज) आणि UB23 (क्लॉकवाइज) दाबा. नस दबल्यास UB23 (क्लॉकवाइज) व GV14 (अँटीक्लॉकवाइज) दाबा.',
    },
    spokenScript: {
      en: 'For slip disc, L5-S1 gap, and compressed nerves, press UB23 clockwise on your lower back, GV3 anticlockwise along the lower spine, and UB54 behind the knee and GB34 outer leg anticlockwise gently.',
      hi: 'स्लिप डिस्क, एल5 एस1 गैप और नस दबने के लिए कमर पर UB23 को क्लॉकवाइज, रीढ़ पर GV3 को एंटीक्लॉकवाइज और घुटने के पीछे UB54 व पैर पर GB34 को एंटीक्लॉकवाइज धीरे-धीरे दबाएं।',
      mr: 'स्लिप डिस्क, L5-S1 गॅप आणि नस दबली असल्यास कंबरेवर UB23 क्लॉकवाइज, मणक्यावर GV3 अँटीक्लॉकवाइज आणि गुडघ्यामागील UB54 व पायावरील GB34 अँटीक्लॉकवाइज हळुवार दाबा.',
    },
    pressGuide: {
      en: 'Rotate BL23 Clockwise; rotate GV3, BL54, GB34, and GV14 Anticlockwise for 90 seconds each.',
      hi: 'UB23 को क्लॉकवाइज तथा GV3, UB54, GB34 और GV14 को 90 सेकंड एंटीक्लॉकवाइज दबाएं।',
      mr: 'UB23 क्लॉकवाइज आणि GV3, UB54, GB34 व GV14 ९० सेकंद अँटीक्लॉकवाइज दाबा.',
    },
  },
  {
    id: 'sciatica',
    label: { en: 'Sciatica Nerve Pain', hi: 'सियाटिका (नस का दर्द)', mr: 'सायटिका (नसेचे दुखणे)' },
    sampleQuery: {
      en: 'Sciatica nerve pain from hip down the leg',
      hi: 'सियाटिका की नस में कमर से पैर तक दर्द है',
      mr: 'सायटिका मुळे कंबरेपासून पायापर्यंत दुखत आहे',
    },
    pointIds: ['BL62', 'GB30', 'BL54', 'GB34', 'BL23'],
    primaryRegion: 'body',
    yogaIds: ['cat_cow', 'ankle_pumps'],
    summary: {
      en: 'For Sciatica nerve relief: press BL62/UB62 (below outer ankle), GB30 (buttock hollow), and BL54/UB54 (back of knee) Anticlockwise; finish GB30 gently Clockwise.',
      hi: 'सियाटिका के लिए UB62, GB30 और UB54 तीनों बिंदुओं को एंटीक्लॉकवाइज घुमाकर दबाएं, और GB30 पर हल्का क्लॉकवाइज दबाव दें।',
      mr: 'सायटिकासाठी UB62, GB30 आणि UB54 हे तिन्ही बिंदू अँटीक्लॉकवाइज फिरवून दाबा, आणि GB30 वर हलका क्लॉकवाइज दाब द्या.',
    },
    spokenScript: {
      en: 'For sciatica pain, rotate UB62 below the outer ankle, GB30 in the hip hollow, and UB54 behind the knee anticlockwise for one to two minutes each, finishing GB30 with gentle clockwise pressure.',
      hi: 'सियाटिका के दर्द के लिए बाहरी टखने के नीचे UB62, कूल्हे के गड्ढे में GB30 और घुटने के पीछे UB54 को एक से दो मिनट एंटीक्लॉकवाइज दबाएं।',
      mr: 'सायटिकाच्या दुखण्यासाठी बाहेरील घोट्याखालील UB62, नितंबातील GB30 आणि गुडघ्यामागील UB54 एक ते दोन मिनिटे अँटीक्लॉकवाइज दाबा.',
    },
    pressGuide: {
      en: 'BL62 + BL54 Anticlockwise; GB30 Anticlockwise then gentle Clockwise for 90 seconds.',
      hi: 'UB62 और UB54 एंटीक्लॉकवाइज, तथा GB30 एंटीक्लॉकवाइज फिर क्लॉकवाइज दबाएं।',
      mr: 'UB62 व UB54 अँटीक्लॉकवाइज आणि GB30 अँटीक्लॉकवाइज नंतर क्लॉकवाइज दाबा.',
    },
  },
  {
    id: 'spondylitis_spondylosis',
    label: { en: 'Spondylitis, Spondylosis & Stiff Neck', hi: 'स्पॉन्डिलाइटिस, स्पॉन्डिलोसिस व गर्दन जकड़न', mr: 'स्पॉन्डिलायटिस, स्पॉन्डिलोसिस व मान जखडणे' },
    sampleQuery: {
      en: 'Spondylitis, cervical spondylosis, and stiff neck pain',
      hi: 'स्पॉन्डिलाइटिस, स्पॉन्डिलोसिस और गर्दन में जकड़न',
      mr: 'स्पॉन्डिलायटिस, स्पॉन्डिलोसिस आणि मान जखडली आहे',
    },
    pointIds: ['GB20', 'GB14', 'BL21', 'BL10', 'SI3'],
    primaryRegion: 'body',
    yogaIds: ['neck_rolls', 'shoulder_shrugs'],
    summary: {
      en: 'Spondylitis -> GB20 (Anticlockwise) + GB14 (Clockwise). Spondylosis -> BL21/UB21 (Anticlockwise) + BL10/UB10 (Clockwise). Stiff Neck -> GB20, BL10/UB10, and SI3 (Anticlockwise).',
      hi: 'स्पॉन्डिलाइटिस: GB20 (एंटीक्लॉकवाइज) + GB14 (क्लॉकवाइज)। स्पॉन्डिलोसिस: UB21 (एंटीक्लॉकवाइज) + UB10 (क्लॉकवाइज)। गर्दन में जकड़न: GB20, UB10 और SI3 (एंटीक्लॉकवाइज दबाएं)।',
      mr: 'स्पॉन्डिलायटिस: GB20 (अँटीक्लॉकवाइज) + GB14 (क्लॉकवाइज). स्पॉन्डिलोसिस: UB21 (अँटीक्लॉकवाइज) + UB10 (क्लॉकवाइज). मान जखडणे: GB20, UB10 आणि SI3 (अँटीक्लॉकवाइज दाबा).',
    },
    spokenScript: {
      en: 'For spondylitis, press GB20 at the skull base anticlockwise and GB14 on the forehead clockwise. For spondylosis, pair UB21 anticlockwise with UB10 clockwise. For stiff neck, press GB20, UB10, and SI3 on the hand anticlockwise.',
      hi: 'स्पॉन्डिलाइटिस के लिए सिर के पीछे GB20 को एंटीक्लॉकवाइज और माथे पर GB14 को क्लॉकवाइज दबाएं। स्पॉन्डिलोसिस में UB21 एंटीक्लॉकवाइज व UB10 क्लॉकवाइज दबाएं। गर्दन की जकड़न में GB20, UB10 और SI3 एंटीक्लॉकवाइज दबाएं।',
      mr: 'स्पॉन्डिलायटिससाठी डोक्यामागील GB20 अँटीक्लॉकवाइज आणि कपाळावरील GB14 क्लॉकवाइज दाबा. स्पॉन्डिलोसिसमध्ये UB21 अँटीक्लॉकवाइज व UB10 क्लॉकवाइज दाबा. मान जखडल्यास GB20, UB10 आणि हातावरील SI3 अँटीक्लॉकवाइज दाबा.',
    },
    pressGuide: {
      en: 'Apply gentle circular pressure for 1–2 minutes per point following CW/ACW directions.',
      hi: 'प्रत्येक बिंदु पर बताई गई क्लॉकवाइज/एंटीक्लॉकवाइज दिशा में 1–2 मिनट हल्का दबाव दें।',
      mr: 'प्रत्येक बिंदूवर दिलेल्या क्लॉकवाइज/अँटीक्लॉकवाइज दिशेने १–२ मिनिटे हळू दाब द्या.',
    },
  },
  {
    id: 'vertigo_dizziness',
    label: { en: 'Vertigo & Spinning Dizziness', hi: 'वर्टिगो व चक्कर आना', mr: 'व्हर्टिगो व चक्कर येणे' },
    sampleQuery: {
      en: 'Vertigo and spinning head dizziness points',
      hi: 'वर्टिगो और सिर घूमने (चक्कर) के एक्यूप्रेशर बिंदु',
      mr: 'व्हर्टिगो आणि डोके गरगरणे / चक्कर येण्यासाठी बिंदू सांगा',
    },
    pointIds: ['LU7', 'GB20', 'TW10'],
    primaryRegion: 'body',
    yogaIds: ['shavasana', 'deep_belly'],
    summary: {
      en: 'For Vertigo & spinning dizziness: sit safely and rotate LU7 (inner forearm above wrist) Clockwise, then press GB20 (skull base) and TW10 (above back elbow tip) Anticlockwise for 1–2 minutes.',
      hi: 'वर्टिगो (सिर घूमना/चक्कर) के लिए शांत बैठकर हाथ पर LU7 को क्लॉकवाइज घुमाकर दबाएं, और सिर के पीछे GB20 व कोहनी के ऊपर TW10 को एंटीक्लॉकवाइज दबाएं।',
      mr: 'व्हर्टिगो (चक्कर येणे) साठी शांत बसून मनगटावरील LU7 क्लॉकवाइज फिरवून दाबा, आणि डोक्यामागील GB20 व कोपरावरील TW10 अँटीक्लॉकवाइज दाबा.',
    },
    spokenScript: {
      en: 'For vertigo and dizziness, sit upright safely and rotate LU7 just above the thumb-side wrist crease clockwise. Then press GB20 under the back skull base and TW10 above the elbow anticlockwise gently.',
      hi: 'वर्टिगो और चक्कर में आराम के लिए बैठ जाएं और कलाई के ऊपर LU7 को क्लॉकवाइज घुमाकर दबाएं। इसके बाद सिर के पीछे GB20 और कोहनी के ऊपर TW10 को एंटीक्लॉकवाइज हल्के से दबाएं।',
      mr: 'व्हर्टिगो आणि चक्कर येत असल्यास शांत बसून मनगटाच्या वर LU7 बिंदू क्लॉकवाइज दाबा. त्यानंतर डोक्यामागील GB20 आणि कोपरावरील TW10 अँटीक्लॉकवाइज हळुवार दाबा.',
    },
    pressGuide: {
      en: 'LU7 Clockwise (1–2 min); GB20 & TW10 Anticlockwise gently (1–2 min). Keep eyes steady.',
      hi: 'LU7 क्लॉकवाइज और GB20 व TW10 एंटीक्लॉकवाइज 1–2 मिनट दबाएं।',
      mr: 'LU7 क्लॉकवाइज आणि GB20 व TW10 अँटीक्लॉकवाइज १–२ मिनिटे दाबा.',
    },
  },
];

function normalizePointAliases(text: string): string {
  return text
    .toLowerCase()
    .replace(/\bub\s*(\d+)\b/g, 'bl$1')
    .replace(/(?:^|\s)(?:अ\s*ब|ab)\s*54\b/gi, ' bl54')
    .replace(/\bliv\s*8\b/g, 'lv8')
    .replace(/\bk\s*3\b/g, 'ki3')
    .replace(/\bst\s*(\d+)\b/g, 'st$1')
    .replace(/\bsp\s*(\d+)\b/g, 'sp$1')
    .replace(/\bgb\s*(\d+)\b/g, 'gb$1')
    .replace(/\bgv\s*(\d+)\b/g, 'gv$1')
    .replace(/\bsi\s*(\d+)\b/g, 'si$1')
    .replace(/\blu\s*(\d+)\b/g, 'lu$1')
    .replace(/\btw\s*(\d+)\b/g, 'tw$1');
}

export function matchConditionLocal(query: string): ConditionPreset | null {
  const q = normalizePointAliases(query);
  if (/(heart\s*attack|cardiac|chest\s*pain|angina|हार्ट\s*अटै|हृदयविकार|सीने\s*में\s*दर्द|छातीत\s*दुख)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'heart_emergency')!;
  }
  if (/(vertigo|spinning|वर्टिगो|व्हर्टिगो|गरगर)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'vertigo_dizziness')!;
  }
  if (/(sciatica|bl62|gb30|सियाटिका|सायटिका)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'sciatica')!;
  }
  if (/(slip\s*disc|l5|s1|gap|pinched\s*nerve|nerve\s*compress|स्लिप\s*डिस्क|नस\s*का\s*दबना|नस\s*दब|सिकुड़|गैप|गॅप)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'slip_disc_spine_gap')!;
  }
  if (/(spondylitis|spondylosis|stiff\s*neck|bl10|bl21|gb14|स्पॉन्डिलाइट|स्पॉन्डिलोसिस|स्पॉन्डिलायटिस|जकड़न|ताठर|जखड)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'spondylitis_spondylosis')!;
  }
  if (/(high\s*bp|blood\s*pressure|hypertension|बीपी|रक्तदाब|रक्तचाप)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'high_bp')!;
  }
  if (/(diabet|dinat|sugar|insulin|मधुमेह|शुगर|डायबिटीज)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'diabetes')!;
  }
  if (/(knee|patella|ligament|cartilage|meniscus|acl|pcl|lv8|sp10|sp9|st35|पानी\s*भर|लिगामेंट|कार्टिलेज|पटेला|गुडघ|घुटने|घुटना)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'knee_pain')!;
  }
  if (/(bone|bl11|bl12|gb39|arthritis|joint|हाड|हड्ड|सांधे|जोड़)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'bone_pain')!;
  }
  if (/(muscle|cramp|spasm|tendon|sprain|स्नायू|मांसपेश|गोळे|ऐंठन|टेंडन)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'muscle_pain')!;
  }
  if (/(cough|fever|throat|cold|tonsil|खोकला|खांसी|ताप|बुखार|घसा|गला|सर्दी)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'cough_fever_throat')!;
  }
  if (/(neck|shoulder|frozen|trapez|मान|गर्दन|खांद|कंध)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'neck_shoulder')!;
  }
  if (/(back|waist|lumbar|spine|पाठ|कंबर|कमर|पीठ|रीढ़)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'back_pain')!;
  }
  if (/(head|migraine|stress|sleep|insomnia|anxiety|डोके|सिरदर्द|माइग्रेन|ताण|तनाव|झोप|नींद)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'headache')!;
  }
  if (/(hand|wrist|palm|finger|हात|हाथ|मनगट|कलाई)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'hand_pain')!;
  }
  if (/(leg|lag|calf|ankle|foot|heel|पाय|पैर|पिंडरी)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'leg_pain')!;
  }
  if (/(stomach|acid|gas|bloat|digest|constip|ulcer|पोट|पेट|गैस|अॅसिडिटी|एसिडिटी|अपच)/.test(q)) {
    return CONDITION_PRESETS.find((c) => c.id === 'stomach_acidity')!;
  }
  return null;
}

export function findPointsLocal(query: string): Point3D[] {
  const q = normalizePointAliases(query);
  const directMatches = POINTS_3D.filter((p) => {
    const ids = [p.id, ...(p.aliases || [])];
    return ids.some((id) => new RegExp(`\\b${id.toLowerCase()}\\b`).test(q));
  });
  if (directMatches.length > 0) return directMatches;

  const preset = matchConditionLocal(query);
  if (preset) {
    return preset.pointIds
      .map((id) => POINTS_3D.find((p) => p.id === id))
      .filter((p): p is Point3D => Boolean(p));
  }

  const scored = POINTS_3D.map((p) => ({
    p,
    score: p.keywords.filter((kw) => q.includes(kw.toLowerCase())).length,
  }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 6).map((x) => x.p);
}

export function findAllPointsForRequest(query: string): Point3D[] {
  const raw = query.trim();
  if (!raw) return [];
  const q = normalizePointAliases(raw);

  if (/(^|\s)(all\s*(body|points|acupoints|42|51)|full\s*body|every\s*point|show\s*all|सर्व\s*बिंदू|सभी\s*बिंदु)(\s|$)/i.test(q)) {
    return [...POINTS_3D];
  }

  const picked = new Map<string, Point3D>();
  const addPt = (p?: Point3D) => {
    if (p && !picked.has(p.id)) picked.set(p.id, p);
  };

  // 1. All explicitly mentioned point IDs / aliases (e.g. LI4, ST36, UB11, LIV8, K3, UB62...)
  POINTS_3D.forEach((p) => {
    const ids = [p.id, ...(p.aliases || [])];
    if (ids.some((id) => new RegExp(`\\b${id.toLowerCase()}\\b`).test(q))) {
      addPt(p);
    }
  });

  // 2. All matching condition presets (handles compound queries like "knee and headache" or "sciatica + slip disc")
  const presetMatchers: [RegExp, string][] = [
    [/(heart\s*attack|cardiac|chest\s*pain|angina|हार्ट|हृदय|छाती)/, 'heart_emergency'],
    [/(vertigo|spinning|वर्टिगो|व्हर्टिगो|गरगर)/, 'vertigo_dizziness'],
    [/(sciatica|bl62|gb30|सियाटिका|सायटिका)/, 'sciatica'],
    [/(slip\s*disc|l5|s1|gap|pinched\s*nerve|nerve\s*compress|स्लिप\s*डिस्क|नस\s*का\s*दबना|नस\s*दब|सिकुड़|गैप|गॅप)/, 'slip_disc_spine_gap'],
    [/(spondylitis|spondylosis|stiff\s*neck|bl10|bl21|gb14|स्पॉन्डिलाइट|स्पॉन्डिलोसिस|स्पॉन्डिलायटिस|जकड़न|ताठर|जखड)/, 'spondylitis_spondylosis'],
    [/(high\s*bp|blood\s*pressure|hypertension|बीपी|रक्तदाब)/, 'high_bp'],
    [/(diabet|dinat|sugar|insulin|मधुमेह|शुगर|डायबिटीज)/, 'diabetes'],
    [/(knee|patella|ligament|cartilage|meniscus|acl|pcl|lv8|sp10|sp9|st35|पानी\s*भर|लिगामेंट|कार्टिलेज|पटेला|गुडघ|घुटने|घुटना)/, 'knee_pain'],
    [/(bone|bl11|bl12|gb39|arthritis|joint|हाड|हड्ड|सांधे|जोड़)/, 'bone_pain'],
    [/(muscle|cramp|spasm|tendon|sprain|स्नायू|मांसपेश|ऐंठन|टेंडन)/, 'muscle_pain'],
    [/(cough|fever|throat|cold|tonsil|खोकला|खांसी|ताप|बुखार|घसा|गला|सर्दी)/, 'cough_fever_throat'],
    [/(neck|shoulder|frozen|trapez|मान|गर्दन|खांद|कंध)/, 'neck_shoulder'],
    [/(back|waist|lumbar|spine|पाठ|कंबर|कमर|पीठ|रीढ़)/, 'back_pain'],
    [/(head|migraine|stress|sleep|insomnia|anxiety|डोके|सिरदर्द|माइग्रेन|ताण|तनाव|झोप|नींद)/, 'headache'],
    [/(hand|wrist|palm|finger|हात|हाथ|मनगट|कलाई)/, 'hand_pain'],
    [/(leg|lag|calf|ankle|foot|heel|पाय|पैर|पिंडरी)/, 'leg_pain'],
    [/(stomach|acid|gas|bloat|digest|constip|ulcer|पोट|पेट|गैस|अॅसिडिटी|एसिडिटी|अपच)/, 'stomach_acidity'],
  ];
  presetMatchers.forEach(([re, presetId]) => {
    if (re.test(q)) {
      const preset = CONDITION_PRESETS.find((c) => c.id === presetId);
      preset?.pointIds.forEach((id) => addPt(POINTS_3D.find((p) => p.id === id)));
    }
  });

  // 3. Any matching meridian names/codes or keywords/indications
  POINTS_3D.forEach((p) => {
    const kwHit = p.keywords.some((kw) => q.includes(kw.toLowerCase()));
    const meridianHit =
      q.includes(p.m.toLowerCase()) ||
      new RegExp(`\\b${p.mCode.toLowerCase()}\\b`).test(q);
    const regionHit =
      (q.includes('hand') && p.regions.includes('hand')) ||
      (q.includes('leg') && p.regions.includes('leg')) ||
      (q.includes('shoulder') && p.regions.includes('shoulder'));
    if (kwHit || meridianHit || regionHit) {
      addPt(p);
    }
  });

  return Array.from(picked.values());
}

// 3D Meridian path waypoints per region so meridian lines flow smoothly over the 3D muscles
export interface MeridianPath3D {
  code: string;
  name: string;
  color: string;
  body?: [number, number, number][];
  hand?: [number, number, number][];
  leg?: [number, number, number][];
  shoulder?: [number, number, number][];
}

export const MERIDIAN_PATHS_3D: MeridianPath3D[] = [
  {
    code: 'LU',
    name: 'Lung Meridian',
    color: '#9be15d',
    body: [
      [0.30, 0.94, 0.25],
      [0.52, 0.88, 0.16],
      [0.70, 0.48, 0.14],
      [0.86, 0.08, 0.13],
      [0.98, -0.18, 0.10],
    ],
    hand: [
      [-0.30, -2.0, 0.18],
      [-0.33, -0.82, 0.16],
      [-0.45, -0.35, 0.21],
      [-0.72, -0.10, 0.16],
      [-0.95, 0.39, 0.14],
    ],
    shoulder: [
      [0.16, 0.34, 0.36],
      [0.48, 0.22, 0.24],
      [0.64, -0.35, 0.20],
      [0.72, -0.92, 0.18],
    ],
  },
  {
    code: 'LI',
    name: 'Large Intestine Meridian',
    color: '#5ac8fa',
    body: [
      [1.04, -0.30, 0.08],
      [1.02, -0.18, 0.08],
      [0.86, 0.12, 0.08],
      [0.76, 0.46, 0.08],
      [0.50, 1.03, 0.08],
      [0.24, 1.24, 0.08],
      [0.06, 1.44, 0.16],
    ],
    hand: [
      [-0.47, 1.44, 0.02],
      [-0.46, 0.08, -0.15],
      [-0.42, -0.78, -0.12],
      [-0.36, -1.95, -0.08],
    ],
    shoulder: [
      [0.78, -0.92, 0.08],
      [0.72, -0.28, 0.12],
      [0.62, 0.36, 0.14],
      [0.24, 0.72, 0.08],
      [-0.18, 1.05, 0.05],
    ],
  },
  {
    code: 'PC',
    name: 'Pericardium Meridian',
    color: '#ff6b9d',
    body: [
      [0.24, 0.74, 0.27],
      [0.54, 0.76, 0.18],
      [0.72, 0.44, 0.14],
      [0.89, 0.08, 0.10],
      [1.03, -0.22, 0.07],
    ],
    hand: [
      [-0.02, -2.05, 0.22],
      [0.0, -1.32, 0.22],
      [0.0, -0.82, 0.18],
      [-0.08, -0.06, 0.19],
      [-0.12, 1.65, 0.07],
    ],
  },
  {
    code: 'HT',
    name: 'Heart Meridian',
    color: '#b794ff',
    body: [
      [0.34, 0.85, 0.02],
      [0.62, 0.46, 0.08],
      [0.84, 0.08, 0.08],
      [0.97, -0.06, 0.08],
      [1.05, -0.34, 0.06],
    ],
    hand: [
      [0.28, -2.0, 0.18],
      [0.31, -0.82, 0.16],
      [0.34, 0.28, 0.12],
      [0.40, 1.22, 0.05],
    ],
  },
  {
    code: 'ST',
    name: 'Stomach Meridian',
    color: '#ffd84d',
    body: [
      [0.08, 1.50, 0.17],
      [0.18, 0.90, 0.28],
      [0.16, 0.16, 0.27],
      [0.24, -0.45, 0.20],
      [0.27, -0.94, 0.16],
      [0.29, -1.07, 0.14],
      [0.26, -1.68, 0.18],
    ],
    leg: [
      [0.18, 1.65, 0.28],
      [0.22, 0.56, 0.24],
      [0.13, 0.12, 0.30],
      [0.16, -0.26, 0.26],
      [0.10, -1.30, 0.22],
      [0.06, -1.56, 0.58],
    ],
  },
  {
    code: 'SP',
    name: 'Spleen Meridian',
    color: '#a77bff',
    body: [
      [0.18, -1.70, 0.10],
      [0.20, -1.35, 0.02],
      [0.18, -1.01, 0.08],
      [0.18, -0.78, 0.14],
      [0.22, 0.22, 0.23],
      [0.28, 0.85, 0.24],
    ],
    leg: [
      [-0.14, -1.62, 0.42],
      [-0.16, -1.35, 0.05],
      [-0.17, -0.96, 0.02],
      [-0.22, -0.05, 0.10],
      [-0.20, 0.56, 0.26],
      [-0.18, 1.55, 0.18],
    ],
  },
  {
    code: 'GB',
    name: 'Gall Bladder Meridian',
    color: '#5ee6a8',
    body: [
      [0.11, 1.41, -0.14],
      [0.27, 1.13, -0.02],
      [0.32, 0.40, 0.02],
      [0.32, -0.35, 0.05],
      [0.30, -1.01, 0.08],
      [0.29, -1.35, 0.02],
    ],
    leg: [
      [0.30, 1.60, 0.05],
      [0.29, 0.65, 0.06],
      [0.27, -0.08, 0.10],
      [0.22, -0.60, 0.06],
      [0.19, -0.96, 0.04],
      [0.14, -1.55, 0.48],
    ],
    shoulder: [
      [-0.24, 1.18, -0.26],
      [0.06, 0.64, -0.02],
      [0.25, 0.28, 0.05],
    ],
  },
  {
    code: 'BL',
    name: 'Bladder (UB) Meridian',
    color: '#ff7a7a',
    body: [
      [-0.06, 1.56, 0.16],
      [-0.10, 1.38, -0.15],
      [-0.14, 1.05, -0.22],
      [-0.14, 0.25, -0.22],
      [-0.22, -0.45, -0.18],
      [-0.24, -0.92, -0.14],
      [-0.25, -1.26, -0.13],
      [-0.29, -1.56, -0.05],
    ],
    leg: [
      [0.0, 1.60, -0.28],
      [0.0, 0.22, -0.24],
      [0.0, -0.72, -0.23],
      [0.16, -1.36, -0.10],
      [0.16, -1.62, 0.20],
    ],
    shoulder: [
      [-0.20, 1.10, -0.24],
      [-0.20, 0.55, -0.34],
      [-0.20, 0.36, -0.35],
      [-0.20, -0.15, -0.34],
    ],
  },
  {
    code: 'KI',
    name: 'Kidney Meridian',
    color: '#38bdf8',
    leg: [
      [0.0, -1.72, 0.34],
      [-0.15, -1.36, -0.10],
      [-0.14, -0.60, -0.04],
      [-0.14, 0.20, -0.06],
      [-0.12, 1.50, 0.02],
    ],
  },
  {
    code: 'CV',
    name: 'Conception Vessel',
    color: '#ffb340',
    body: [
      [0, -0.05, 0.24],
      [0, 0.34, 0.29],
      [0, 0.72, 0.31],
      [0, 1.10, 0.22],
      [0, 1.32, 0.16],
    ],
  },
  {
    code: 'GV',
    name: 'Governing Vessel',
    color: '#7cc4ff',
    body: [
      [0, -0.05, -0.24],
      [0, 0.45, -0.22],
      [0, 1.15, -0.20],
      [0, 1.55, -0.15],
      [0, 1.78, 0.0],
      [0, 1.44, 0.17],
    ],
  },
];

export type PressureTier = 'light' | 'gentle' | 'moderate' | 'firm' | 'deep';

export interface PointPressSpec {
  durationSec: number;
  duration: Record<Lang, string>;
  pressureTier: PressureTier;
  pressureLevel: 1 | 2 | 3 | 4 | 5;
  pressureLabel: Record<Lang, string>;
  pressureDetail: Record<Lang, string>;
}

const DUR_45S: Pick<PointPressSpec, 'durationSec' | 'duration'> = {
  durationSec: 45,
  duration: {
    en: '30–60 seconds (both sides)',
    hi: '30–60 सेकंड (दोनों तरफ)',
    mr: '३०–६० सेकंद (दोन्ही बाजूंना)',
  },
};

const DUR_60S: Pick<PointPressSpec, 'durationSec' | 'duration'> = {
  durationSec: 60,
  duration: {
    en: '1 minute per side',
    hi: 'प्रत्येक तरफ 1 मिनट',
    mr: 'प्रत्येक बाजूला १ मिनिट',
  },
};

const DUR_75S: Pick<PointPressSpec, 'durationSec' | 'duration'> = {
  durationSec: 75,
  duration: {
    en: '60–90 seconds per side',
    hi: 'प्रत्येक तरफ 60–90 सेकंड',
    mr: 'प्रत्येक बाजूला ६०–९० सेकंद',
  },
};

const DUR_90S: Pick<PointPressSpec, 'durationSec' | 'duration'> = {
  durationSec: 90,
  duration: {
    en: '1–2 minutes per side',
    hi: 'प्रत्येक तरफ 1–2 मिनट',
    mr: 'प्रत्येक बाजूला १–२ मिनिटे',
  },
};

const DUR_120S: Pick<PointPressSpec, 'durationSec' | 'duration'> = {
  durationSec: 120,
  duration: {
    en: '2 minutes per side',
    hi: 'प्रत्येक तरफ 2 मिनट',
    mr: 'प्रत्येक बाजूला २ मिनिटे',
  },
};

const PRES_LIGHT: Omit<PointPressSpec, 'durationSec' | 'duration'> = {
  pressureTier: 'light',
  pressureLevel: 1,
  pressureLabel: {
    en: 'Very Light (Level 1/5)',
    hi: 'अत्यंत हल्का (स्तर 1/5)',
    mr: 'अतिशय हलका (पातळी १/५)',
  },
  pressureDetail: {
    en: 'Soft fingertip touch only — delicate throat, skull crown, or eye hollow zone.',
    hi: 'केवल उंगली के पोरों से बहुत हल्का स्पर्श/दबाव — यह संवेदनशील हिस्सा है।',
    mr: 'केवळ बोटांच्या टोकांनी अतिशय हलका दाब — हा नाजूक आणि संवेदनशील भाग आहे.',
  },
};

const PRES_GENTLE: Omit<PointPressSpec, 'durationSec' | 'duration'> = {
  pressureTier: 'gentle',
  pressureLevel: 2,
  pressureLabel: {
    en: 'Gentle & Steady (Level 2/5)',
    hi: 'सौम्य व स्थिर (स्तर 2/5)',
    mr: 'सौम्य आणि स्थिर (पातळी २/५)',
  },
  pressureDetail: {
    en: 'Gentle sustained thumb or fingertip pressure while breathing slowly (no sharp pain).',
    hi: 'धीमी सांस के साथ अंगूठे या उंगली से कोमल और स्थिर दबाव दें (तेज दर्द न हो)।',
    mr: 'संथ श्वासासोबत अंगठ्याने किंवा बोटाने कोमल, स्थिर दाब द्या (तीव्र वेदना होऊ देऊ नका).',
  },
};

const PRES_MODERATE: Omit<PointPressSpec, 'durationSec' | 'duration'> = {
  pressureTier: 'moderate',
  pressureLevel: 3,
  pressureLabel: {
    en: 'Moderate–Firm (Level 3/5)',
    hi: 'मध्यम–मजबूत (स्तर 3/5)',
    mr: 'मध्यम–ठाम (पातळी ३/५)',
  },
  pressureDetail: {
    en: 'Steady circular thumb pressure with mild comforting ache — not bruising.',
    hi: 'अंगूठे से गोल घुमाते हुए मध्यम गहरा दबाव, जिससे हल्का आरामदायक अहसास हो।',
    mr: 'अंगठ्याने गोल फिरवत मध्यम पण ठाम दाब द्या, जेणेकरून आरामदायी संवेदना जाणवेल.',
  },
};

const PRES_FIRM: Omit<PointPressSpec, 'durationSec' | 'duration'> = {
  pressureTier: 'firm',
  pressureLevel: 4,
  pressureLabel: {
    en: 'Firm & Crisp (Level 4/5)',
    hi: 'मजबूत व स्पष्ट (स्तर 4/5)',
    mr: 'ठाम आणि स्पष्ट (पातळी ४/५)',
  },
  pressureDetail: {
    en: 'Firm, confident thumb or pinch pressure reaching deep belly/tendon tone.',
    hi: 'मांसपेशी या नाखून-कोने तक पहुंचने वाला स्पष्ट और मजबूत दबाव।',
    mr: 'स्नायू किंवा बोटाच्या टोकापर्यंत पोहोचणारा ठाम आणि स्पष्ट दाब.',
  },
};

const PRES_DEEP: Omit<PointPressSpec, 'durationSec' | 'duration'> = {
  pressureTier: 'deep',
  pressureLevel: 5,
  pressureLabel: {
    en: 'Deep–Firm (Level 5/5)',
    hi: 'गहरा व मजबूत (स्तर 5/5)',
    mr: 'खोल आणि ठाम (पातळी ५/५)',
  },
  pressureDetail: {
    en: 'Slow, deep thumb or braced-knuckle pressure suited for thick leg or hip muscles.',
    hi: 'पैर या कूल्हे की मोटी मांसपेशियों के लिए अंगूठे से गहरा और स्थिर दबाव।',
    mr: 'पाय किंवा खुब्याच्या जाड स्नायूंसाठी अंगठ्याने खोल आणि स्थिर दाब द्या.',
  },
};

export const POINT_PRESS_SPEC_BY_ID: Record<string, PointPressSpec> = {
  LI4: { ...DUR_90S, ...PRES_FIRM },
  PC6: { ...DUR_120S, ...PRES_GENTLE },
  HT7: { ...DUR_120S, ...PRES_GENTLE },
  HT9: { ...DUR_45S, ...PRES_FIRM },
  PC9: { ...DUR_45S, ...PRES_FIRM },
  PC8: { ...DUR_90S, ...PRES_MODERATE },
  LU10: { ...DUR_90S, ...PRES_MODERATE },
  LU11: { ...DUR_45S, ...PRES_FIRM },
  LU7: { ...DUR_90S, ...PRES_MODERATE },
  SI3: { ...DUR_90S, ...PRES_MODERATE },
  TW3: { ...DUR_90S, ...PRES_MODERATE },
  TW5: { ...DUR_120S, ...PRES_GENTLE },
  TW10: { ...DUR_90S, ...PRES_MODERATE },
  GV20: { ...DUR_90S, ...PRES_LIGHT },
  GB20: { ...DUR_120S, ...PRES_GENTLE },
  BL10: { ...DUR_90S, ...PRES_MODERATE },
  GB14: { ...DUR_90S, ...PRES_GENTLE },
  BL2: { ...DUR_75S, ...PRES_LIGHT },
  GV26: { ...DUR_45S, ...PRES_FIRM },
  CV22: { ...DUR_60S, ...PRES_LIGHT },
  CV17: { ...DUR_90S, ...PRES_GENTLE },
  CV12: { ...DUR_120S, ...PRES_GENTLE },
  ST25: { ...DUR_120S, ...PRES_GENTLE },
  GV14: { ...DUR_90S, ...PRES_MODERATE },
  BL11: { ...DUR_90S, ...PRES_GENTLE },
  BL12: { ...DUR_90S, ...PRES_MODERATE },
  GB21: { ...DUR_120S, ...PRES_MODERATE },
  LI15: { ...DUR_90S, ...PRES_GENTLE },
  TW14: { ...DUR_90S, ...PRES_MODERATE },
  SI11: { ...DUR_75S, ...PRES_MODERATE },
  LU1: { ...DUR_90S, ...PRES_GENTLE },
  LI11: { ...DUR_120S, ...PRES_MODERATE },
  BL21: { ...DUR_90S, ...PRES_MODERATE },
  BL23: { ...DUR_120S, ...PRES_MODERATE },
  GV3: { ...DUR_90S, ...PRES_MODERATE },
  GB30: { ...DUR_90S, ...PRES_DEEP },
  BL54: { ...DUR_60S, ...PRES_GENTLE },
  ST36: { ...DUR_120S, ...PRES_DEEP },
  SP10: { ...DUR_120S, ...PRES_MODERATE },
  SP9: { ...DUR_120S, ...PRES_GENTLE },
  LV8: { ...DUR_90S, ...PRES_MODERATE },
  ST35: { ...DUR_90S, ...PRES_MODERATE },
  GB34: { ...DUR_120S, ...PRES_DEEP },
  BL57: { ...DUR_90S, ...PRES_MODERATE },
  SP6: { ...DUR_120S, ...PRES_GENTLE },
  GB39: { ...DUR_90S, ...PRES_GENTLE },
  KI3: { ...DUR_90S, ...PRES_GENTLE },
  BL62: { ...DUR_90S, ...PRES_MODERATE },
  BL60: { ...DUR_90S, ...PRES_MODERATE },
  LV3: { ...DUR_120S, ...PRES_FIRM },
  KI1: { ...DUR_90S, ...PRES_FIRM },
};

export function getPointPressSpec(pointOrId: Point3D | string): PointPressSpec {
  const id = typeof pointOrId === 'string' ? pointOrId : pointOrId.id;
  return POINT_PRESS_SPEC_BY_ID[id] ?? { ...DUR_90S, ...PRES_MODERATE };
}
