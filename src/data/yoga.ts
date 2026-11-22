import { Lang } from './acupoints';

export interface BreathingPattern {
  id: string;
  name: Record<Lang, string>;
  subtitle: Record<Lang, string>;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  cycles: number;
  benefits: Record<Lang, string>;
  steps: Record<Lang, string[]>;
}

export interface YogaExercise {
  id: string;
  name: Record<Lang, string>;
  sanskrit: string;
  category: 'back' | 'neck' | 'knee' | 'bp' | 'diabetes' | 'stress';
  durationSec: number;
  benefits: Record<Lang, string>;
  instructions: Record<Lang, string[]>;
  caution: Record<Lang, string>;
}

export const BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'deep_belly',
    name: {
      en: 'Deep Diaphragmatic Breathing (4-2-6)',
      hi: 'गहरा उदर श्वास (4-2-6)',
      mr: 'सखोल श्वसन सराव (४-२-६)',
    },
    subtitle: {
      en: 'Gentle everyday breathing for heart, stress & acupressure',
      hi: 'दिल, तनाव और एक्यूप्रेशर के लिए आसान रोजमर्रा का श्वास',
      mr: 'हृदय, ताण आणि अ‍ॅक्युप्रेशरसाठी सोपा दैनंदिन श्वसन व्यायाम',
    },
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 0,
    cycles: 8,
    benefits: {
      en: 'Calms heart rate, relaxes tight muscles, and boosts oxygen during acupressure.',
      hi: 'दिल की धड़कन शांत करता है, मांसपेशियों को ढीला करता है और ऑक्सीजन बढ़ाता है।',
      mr: 'हृदयाचे ठोके शांत करते, स्नायू सैल करते आणि शरीरात ऑक्सिजन वाढवते.',
    },
    steps: {
      en: [
        'Sit upright with relaxed shoulders and one hand on your belly.',
        'Breathe in slowly through your nose for 4 seconds, feeling your belly rise.',
        'Hold softly for 2 seconds, then breathe out slowly through your nose for 6 seconds.',
      ],
      hi: [
        'कंधे ढीले रखकर सीधे बैठें और एक हाथ पेट पर रखें।',
        'नाक से 4 सेकंड धीरे-धीरे सांस अंदर लें, पेट को फूलने दें।',
        '2 सेकंड आराम से रोकें, फिर 6 सेकंड में धीरे-धीरे सांस बाहर छोड़ें।',
      ],
      mr: [
        'खांदे सैल सोडून ताठ बसा आणि एक हात पोटावर ठेवा.',
        'नाकातून ४ सेकंद हळूहळू श्वास आत घ्या, पोट वर येऊ द्या.',
        '२ सेकंद शांत थांबवा आणि नंतर ६ सेकंदात हळुवार श्वास बाहेर सोडा.',
      ],
    },
  },
  {
    id: 'anulom_vilom',
    name: {
      en: 'Anulom Vilom (Alternate Nostril)',
      hi: 'अनुलोम-विलोम प्राणायाम',
      mr: 'अनुलोम-विलोम प्राणायाम',
    },
    subtitle: {
      en: 'Balances blood pressure, lungs, diabetes & calm mind',
      hi: 'ब्लड प्रेशर, फेफड़े, मधुमेह और मन की शांति के लिए',
      mr: 'रक्तदाब, फुफ्फुस, मधुमेह आणि मनःशांतीसाठी उत्तम',
    },
    inhale: 4,
    holdIn: 2,
    exhale: 6,
    holdOut: 0,
    cycles: 10,
    benefits: {
      en: 'Balances high BP, clears sinuses, improves lung capacity, and reduces anxiety.',
      hi: 'हाई बीपी संतुलित करता है, साइनस साफ करता है और चिंता दूर करता है।',
      mr: 'उच्च रक्तदाब संतुलित राहतो, श्वसनमार्ग मोकळा होतो आणि चिंता कमी होते.',
    },
    steps: {
      en: [
        'Close your right nostril gently with your right thumb and inhale slowly from the left nostril.',
        'Close both nostrils lightly for 2 seconds.',
        'Release thumb and exhale slowly from the right nostril, then inhale from right and switch.',
      ],
      hi: [
        'दाएं अंगूठे से दायां नाक बंद करें और बाएं नाक से धीरे-धीरे सांस अंदर लें।',
        '2 सेकंड दोनों नाक हल्के से बंद रखें।',
        'अब दाएं नाक से सांस बाहर छोड़ें, फिर दाएं से लेकर बाएं से छोड़ें।',
      ],
      mr: [
        'उजव्या अंगठ्याने उजवी नाकपुडी बंद करून डाव्या नाकपुडीने संथ श्वास आत घ्या.',
        '२ सेकंद दोन्ही नाकपुड्या हळुवार बंद ठेवा.',
        'नंतर उजव्या नाकपुडीने श्वास बाहेर सोडा आणि पुन्हा उजवीकडून घेऊन डावीकडून सोडा.',
      ],
    },
  },
  {
    id: 'bhramari',
    name: {
      en: 'Bhramari (Humming Bee Pranayama)',
      hi: 'भ्रामरी प्राणायाम',
      mr: 'भ्रामरी प्राणायाम',
    },
    subtitle: {
      en: 'Instant calming for headache, migraine, high BP & sleep',
      hi: 'सिरदर्द, माइग्रेन, हाई बीपी और नींद के लिए तुरंत शांति',
      mr: 'डोकेदुखी, अर्धशिशी, उच्च रक्तदाब आणि झोपेसाठी त्वरित आराम',
    },
    inhale: 4,
    holdIn: 1,
    exhale: 7,
    holdOut: 0,
    cycles: 6,
    benefits: {
      en: 'Soothes brain nerves, lowers blood pressure spikes, and relieves headaches.',
      hi: 'दिमाग की नसों को शांत करता है, हाई बीपी कम करता है और सिरदर्द दूर करता है।',
      mr: 'मेंदूच्या शिरा शांत होतात, रक्तदाब कमी होतो आणि डोकेदुखी थांबते.',
    },
    steps: {
      en: [
        'Close your eyes softly and place fingertips lightly over closed eyelids and ears.',
        'Inhale slowly through the nose for 4 seconds.',
        'Exhale slowly while making a gentle humming “Mmm…” sound for 7 seconds.',
      ],
      hi: [
        'आंखें बंद करें और उंगलियों से हल्के से कान और पलकें ढक लें।',
        'नाक से 4 सेकंड गहरी सांस अंदर लें।',
        'सांस छोड़ते हुए 7 सेकंड तक भंवरे की तरह मधुर “म्म्म्…” गुंजन करें।',
      ],
      mr: [
        'डोळे हळुवार बंद करा आणि बोटांनी कान व डोळे हलके झाकून घ्या.',
        'नाकातून ४ सेकंद सखोल श्वास आत घ्या.',
        'श्वास सोडताना ७ सेकंद भुंग्यासारखा शांत “म्म्म्...” असा आवाज काढा.',
      ],
    },
  },
  {
    id: 'box_calm',
    name: {
      en: 'Box Breathing (4-4-4-4)',
      hi: 'बॉक्स ब्रीदिंग (4-4-4-4)',
      mr: 'बॉक्स ब्रीदिंग (४-४-४-४)',
    },
    subtitle: {
      en: 'Restores focus and steady heartbeat in 2 minutes',
      hi: '2 मिनट में एकाग्रता और दिल की धड़कन स्थिर करने के लिए',
      mr: '२ मिनिटांत एकाग्रता आणि हृदयाचे ठोके स्थिर करण्यासाठी',
    },
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    cycles: 6,
    benefits: {
      en: 'Quickly resets nervous tension, panic, and breathing rhythm.',
      hi: 'घबराहट, तनाव और तेज सांस को तुरंत सामान्य करता है।',
      mr: 'घबराट, ताण आणि वेगाने चालणारा श्वास त्वरित शांत करते.',
    },
    steps: {
      en: [
        'Inhale steadily for 4 seconds.',
        'Hold gently for 4 seconds.',
        'Exhale smoothly for 4 seconds, then pause softly for 4 seconds.',
      ],
      hi: [
        '4 सेकंड आराम से सांस अंदर लें।',
        '4 सेकंड सांस रोकें।',
        '4 सेकंड सांस बाहर छोड़ें और 4 सेकंड रुकें।',
      ],
      mr: [
        '४ सेकंद संथ श्वास आत घ्या.',
        '४ सेकंद श्वास रोखून धरा.',
        '४ सेकंदात श्वास बाहेर सोडा आणि ४ सेकंद थांबा.',
      ],
    },
  },
];

export const YOGA_EXERCISES: YogaExercise[] = [
  {
    id: 'mandukasana',
    name: { en: 'Frog Pose (Diabetes Care)', hi: 'मंडूकासन (मधुमेह के लिए)', mr: 'मंडुकासन (मधुमेहासाठी)' },
    sanskrit: 'Mandukasana',
    category: 'diabetes',
    durationSec: 45,
    benefits: {
      en: 'Gently compresses the abdomen to stimulate the pancreas, digestion, and blood sugar regulation.',
      hi: 'पेट और पैंक्रियाज पर हल्का दबाव डालकर शुगर (मधुमेह) और पाचन को बेहतर बनाता है।',
      mr: 'पोटावर हलका दाब देऊन स्वादुपिंड (पॅन्क्रियाज) सक्रिय करते व मधुमेह नियंत्रणात मदत करते.',
    },
    instructions: {
      en: [
        'Sit in Vajrasana (kneeling comfortably) or sit on a chair.',
        'Make soft fists with thumbs tucked inside and place them beside your navel.',
        'Exhale slowly and bend forward gently while looking ahead; breathe normally for 30 seconds.',
      ],
      hi: [
        'वज्रासन में बैठें (या कुर्सी पर आराम से बैठें)।',
        'दोनों हाथों के अंगूठे अंदर रखकर मुट्ठी बनाएं और नाभि के दोनों तरफ रखें।',
        'सांस छोड़ते हुए आगे झुकें और सामने देखें; 30 सेकंड सामान्य सांस लें।',
      ],
      mr: [
        'वज्रासनात (किंवा खुर्चीवर ताठ) आरामात बसा.',
        'अंगठे आत दुमडून दोन्ही हातांच्या मुठी करा आणि बेंबीच्या दोन्ही बाजूंना ठेवा.',
        'श्वास सोडत हळुवार पुढे झुका आणि समोर पहा; ३० सेकंद संथ श्वास घ्या.',
      ],
    },
    caution: {
      en: 'Avoid deep bending if you have severe knee pain, hernia, or recent abdominal surgery.',
      hi: 'घुटनों में तेज दर्द या पेट की सर्जरी होने पर ज्यादा आगे न झुकें।',
      mr: 'तीव्र गुडघेदुखी किंवा पोटाचे ऑपरेशन झाले असल्यास पुढे वाकणे टाळा.',
    },
  },
  {
    id: 'vajrasana',
    name: { en: 'Thunderbolt Pose (After Meals)', hi: 'वज्रासन (पाचन व शुगर)', mr: 'वज्रासन (पचन व मधुमेहासाठी)' },
    sanskrit: 'Vajrasana',
    category: 'diabetes',
    durationSec: 120,
    benefits: {
      en: 'The only yoga pose safe right after eating — relieves gas, acidity, and aids blood sugar control.',
      hi: 'भोजन के बाद किया जाने वाला एकमात्र आसन — गैस, एसिडिटी और शुगर में बेहद लाभदायक।',
      mr: 'जेवणानंतर करता येणारे एकमेव आसन — गॅस, अॅसिडिटी आणि मधुमेहावर अत्यंत उपयुक्त.',
    },
    instructions: {
      en: [
        'Kneel on a mat with knees together and sit back gently onto your heels.',
        'Keep your spine straight and palms resting on your thighs.',
        'Breathe calmly for 2–5 minutes after meals.',
      ],
      hi: [
        'चटाई पर घुटने मोड़कर एड़ियों के बीच आराम से बैठ जाएं।',
        'रीढ़ की हड्डी सीधी रखें और हथेलियां जांघों पर रखें।',
        'खाने के बाद 2 से 5 मिनट शांत सांस लें।',
      ],
      mr: [
        'सतरंजीवर गुडघे दुमडून टाचांवर आरामात बसा.',
        'पाठ ताठ ठेवा आणि तळहात मांड्यांवर ठेवा.',
        'जेवणानंतर २ ते ५ मिनिटे शांत श्वास घ्या.',
      ],
    },
    caution: {
      en: 'Place a soft cushion under your ankles or knees if you have knee stiffness.',
      hi: 'घुटनों में दर्द हो तो पैरों के नीचे नरम तकिया रख लें।',
      mr: 'गुडघे दुखत असल्यास घोट्याखाली मऊ उशी ठेवा.',
    },
  },
  {
    id: 'quad_stretch',
    name: { en: 'Seated Knee & Quad Strengthener', hi: 'घुटने मजबूत करने का व्यायाम', mr: 'गुडघे व पाय बळकटी व्यायाम' },
    sanskrit: 'Seated Dandasana Extension',
    category: 'knee',
    durationSec: 60,
    benefits: {
      en: 'Strengthens thigh muscles around ST36 and SP10 to reduce pressure on the knee joint.',
      hi: 'जांघ और घुटने के आसपास की मांसपेशियों को मजबूत कर घुटने का दर्द कम करता है।',
      mr: 'मांडीचे स्नायू मजबूत करून गुडघ्याच्या सांध्यावरील ताण आणि वेदना कमी करते.',
    },
    instructions: {
      en: [
        'Sit upright on a chair with back supported.',
        'Slowly straighten one leg forward, tighten your thigh muscle, and pull toes gently toward you.',
        'Hold for 5 seconds while breathing out, lower slowly, and repeat 8 times per leg.',
      ],
      hi: [
        'कुर्सी पर पीठ टिकाकर सीधे बैठें।',
        'एक पैर को धीरे से सीधा ऊपर उठाएं और पंजों को अपनी ओर खींचें।',
        '5 सेकंड रोकें, फिर धीरे नीचे लाएं। दोनों पैरों से 8-8 बार करें।',
      ],
      mr: [
        'खुर्चीवर पाठ टेकून सरळ बसा.',
        'एक पाय हळुवार समोर सरळ करा आणि पायाची बोटे आपल्याकडे खेचा.',
        '५ सेकंद धरून ठेवा आणि हळू खाली आणा; दोन्ही पायांनी ८ वेळा करा.',
      ],
    },
    caution: {
      en: 'Move slowly without jerking the knee joint.',
      hi: 'घुटने को झटके से न मोड़ें, बिल्कुल आराम से करें।',
      mr: 'गुडघ्याला झटका देऊ नका, हळुवार व्यायाम करा.',
    },
  },
  {
    id: 'ankle_pumps',
    name: { en: 'Ankle Pumps & Toe Circles', hi: 'टखने और पैर का व्यायाम', mr: 'घोटे व पावलांचा व्यायाम' },
    sanskrit: 'Goolf Naman / Chakra',
    category: 'knee',
    durationSec: 60,
    benefits: {
      en: 'Improves blood circulation in legs, reduces ankle/knee swelling, and prevents cramps.',
      hi: 'पैरों में रक्त संचार बढ़ाता है, सूजन कम करता है और पिंडली की ऐंठन रोकता है।',
      mr: 'पायांमधील रक्ताभिसरण वाढते, सूज कमी होते आणि गोळे येणे थांबते.',
    },
    instructions: {
      en: [
        'Sit with legs extended or on a chair.',
        'Point toes away from you as you inhale, then flex toes back toward you as you exhale.',
        'Make 10 slow ankle circles in each direction.',
      ],
      hi: [
        'पैर सीधे फैलाकर बैठें।',
        'सांस लेते हुए पंजों को आगे दबाएं और सांस छोड़ते हुए अपनी ओर खींचें।',
        'दोनों दिशाओं में टखनों को 10 बार धीरे-धीरे गोल घुमाएं।',
      ],
      mr: [
        'पाय समोर सरळ ठेवून बसा.',
        'श्वास घेत पावले पुढे झुकवा आणि श्वास सोडत आपल्याकडे खेचा.',
        'दोन्ही दिशांनी घोटे १० वेळा हळुवार गोल फिरवा.',
      ],
    },
    caution: {
      en: 'Keep movements smooth and pain-free.',
      hi: 'दर्द होने पर गति धीमी रखें।',
      mr: 'वेदना होत असल्यास हळुवार हालचाल करा.',
    },
  },
  {
    id: 'cat_cow',
    name: { en: 'Cat-Cow Spine Mobility', hi: 'मार्जरीआसन (कमर दर्द)', mr: 'मार्जरासन (पाठ व कंबरदुखी)' },
    sanskrit: 'Marjaryasana-Bitilasana',
    category: 'back',
    durationSec: 60,
    benefits: {
      en: 'Gently releases lower back tension, lubricates spinal bones (UB11–BL23), and eases stiffness.',
      hi: 'रीढ़ की हड्डी और कमर की जकड़न को कोमलता से खोलता है।',
      mr: 'पाठीचा मणका लवचिक होतो आणि कंबरदुखी व ताठरपणा कमी होतो.',
    },
    instructions: {
      en: [
        'Come onto hands and knees (or seated with hands on knees).',
        'Inhale: gently arch your back downward and lift your chest/chin.',
        'Exhale: round your spine upward softly like a cat and tuck chin. Repeat 8 times.',
      ],
      hi: [
        'हाथों और घुटनों के बल आएं (या कुर्सी पर बैठकर घुटनों पर हाथ रखें)।',
        'सांस लेते हुए कमर को हल्का नीचे झुकाएं और सामने देखें।',
        'सांस छोड़ते हुए पीठ को ऊपर की ओर गोल करें। 8 बार दोहराएं।',
      ],
      mr: [
        'हात आणि गुडघ्यांवर टेकून स्थिती घ्या (किंवा खुर्चीवर बसून गुडघ्यांवर हात ठेवा).',
        'श्वास आत घेत पाठ हळुवार खाली वाकवून वर पहा.',
        'श्वास सोडत पाठ वरच्या बाजूला गोल करा. असे ८ वेळा करा.',
      ],
    },
    caution: {
      en: 'Skip kneeling if knees hurt; perform the seated chair version instead.',
      hi: 'घुटनों में दर्द हो तो कुर्सी पर बैठकर ही कमर को आगे-पीछे झुकाएं।',
      mr: 'गुडघे दुखत असल्यास खुर्चीवर बसूनच हा व्यायाम करा.',
    },
  },
  {
    id: 'cobra_pose',
    name: { en: 'Gentle Cobra Lift', hi: 'सरल भुजंगासन', mr: 'सरळ भुजंगासन' },
    sanskrit: 'Bhujangasana',
    category: 'back',
    durationSec: 45,
    benefits: {
      en: 'Strengthens lower back muscles, opens chest/lungs, and supports bone posture.',
      hi: 'कमर की मांसपेशियों को मजबूत करता है और छाती व फेफड़ों को खोलता है।',
      mr: 'पाठीचे स्नायू बळकट होतात आणि छाती व फुफ्फुसांची क्षमता वाढते.',
    },
    instructions: {
      en: [
        'Lie comfortably on your stomach with palms under your shoulders.',
        'Inhale and gently lift only your head and upper chest a few inches — keep elbows soft.',
        'Hold for 3 calm breaths and lower gently.',
      ],
      hi: [
        'पेट के बल लेट जाएं और हथेलियां कंधों के नीचे रखें।',
        'सांस लेते हुए सिर और ऊपरी छाती को कुछ इंच आराम से ऊपर उठाएं।',
        '3 धीमी सांसों तक रुकें और धीरे नीचे आएं।',
      ],
      mr: [
        'पोटावर आरामात झोपा आणि तळहात खांद्यांखाली ठेवा.',
        'श्वास आत घेत डोके आणि छातीचा वरचा भाग थोडासा वर उचला.',
        '३ संथ श्वासांपर्यंत थांबा आणि हळू खाली या.',
      ],
    },
    caution: {
      en: 'Do not force your lower back; avoid if pregnant.',
      hi: 'कमर पर जोर न डालें; गर्भावस्था में न करें।',
      mr: 'कंबरेवर जास्त ताण देऊ नका; गर्भावस्थेत टाळा.',
    },
  },
  {
    id: 'neck_rolls',
    name: { en: 'Gentle Neck & Shoulder Release', hi: 'गर्दन और कंधे का सरल व्यायाम', mr: 'मान व खांद्यांचा आरामदायी व्यायाम' },
    sanskrit: 'Greeva Sanchalana',
    category: 'neck',
    durationSec: 60,
    benefits: {
      en: 'Melts away stiffness around GB20 and GB21 caused by phones, study, or desk work.',
      hi: 'पढ़ाई, मोबाइल या काम से गर्दन और कंधों में आने वाली जकड़न को दूर करता है।',
      mr: 'अभ्यास, मोबाईल किंवा कामामुळे मान व खांद्यांमध्ये येणारी ताठरता दूर होते.',
    },
    instructions: {
      en: [
        'Sit tall with shoulders dropped down away from ears.',
        'Exhale as you gently tilt your right ear toward your right shoulder; hold 10 seconds.',
        'Inhale back to center, then gently tilt to the left. Roll shoulders backward 5 times.',
      ],
      hi: [
        'कंधे नीचे ढीले रखकर सीधे बैठें।',
        'सांस छोड़ते हुए दायां कान दाएं कंधे की ओर हल्का झुकाएं और 10 सेकंड रुकें।',
        'बीच में आकर बाईं ओर दोहराएं। कंधों को पीछे की ओर 5 बार गोल घुमाएं।',
      ],
      mr: [
        'खांदे सैल सोडून ताठ बसा.',
        'श्वास सोडत उजवा कान उजव्या खांद्याकडे हळू झुकवा आणि १० सेकंद थांबा.',
        'मध्यभागी येऊन डावीकडे करा. नंतर खांदे मागील बाजूस ५ वेळा गोल फिरवा.',
      ],
    },
    caution: {
      en: 'Avoid tilting the head sharply backward if you feel dizzy.',
      hi: 'चक्कर आते हों तो गर्दन को पीछे की ओर ज्यादा न झुकाएं।',
      mr: 'चक्कर येत असल्यास मान मागे जास्त झुकवू नका.',
    },
  },
  {
    id: 'wrist_stretch',
    name: { en: 'Finger & Wrist Mobility Flow', hi: 'हाथ व कलाई लचीलापन व्यायाम', mr: 'हात व मनगट मोकळे करण्याचा व्यायाम' },
    sanskrit: 'Manibandha Chakra',
    category: 'neck',
    durationSec: 45,
    benefits: {
      en: 'Relieves hand, wrist, and finger stiffness after writing or computer work.',
      hi: 'लिखने या काम करने से हाथ, कलाई और उंगलियों की थकान दूर करता है।',
      mr: 'लिहून किंवा कामामुळे हात, मनगट आणि बोटांमधील थकवा दूर होतो.',
    },
    instructions: {
      en: [
        'Extend both arms forward and spread your fingers wide as you inhale.',
        'Close into a gentle fist as you exhale; repeat 6 times.',
        'Rotate both wrists slowly in circles 5 times each way.',
      ],
      hi: [
        'दोनों हाथ सामने फैलाएं और सांस लेते हुए उंगलियां पूरी खोलें।',
        'सांस छोड़ते हुए हल्की मुट्ठी बंद करें; ऐसा 6 बार करें।',
        'दोनों कलाइयों को धीरे-धीरे 5-5 बार गोल घुमाएं।',
      ],
      mr: [
        'दोन्ही हात समोर पसरवा आणि श्वास घेत बोटे पूर्ण उघडा.',
        'श्वास सोडत हलकी मूठ बंद करा; असे ६ वेळा करा.',
        'दोन्ही मनगटे हळुवार ५-५ वेळा गोल फिरवा.',
      ],
    },
    caution: {
      en: 'Stop if sharp wrist pain occurs.',
      hi: 'तेज दर्द होने पर रुक जाएं।',
      mr: 'तीव्र वेदना झाल्यास थांबा.',
    },
  },
  {
    id: 'shavasana',
    name: { en: 'Guided Rest & Heart Calm (Shavasana)', hi: 'शवासन (बीपी व हृदय शांति)', mr: 'शवासन (रक्तदाब व हृदय शांततेसाठी)' },
    sanskrit: 'Shavasana',
    category: 'bp',
    durationSec: 120,
    benefits: {
      en: 'Lowers stress hormones, relaxes every muscle, and calms elevated blood pressure.',
      hi: 'तनाव कम करता है, हर मांसपेशी को आराम देता है और बढ़े हुए बीपी को शांत करता है।',
      mr: 'ताणतणाव कमी होतो, सर्व स्नायू शिथिल होतात आणि वाढलेला रक्तदाब शांत होतो.',
    },
    instructions: {
      en: [
        'Lie flat on your back (or recline comfortably in a chair) with palms facing upward.',
        'Close your eyes and consciously relax your feet, legs, stomach, shoulders, and face.',
        'Follow slow breathing for 2 minutes without rushing.',
      ],
      hi: [
        'पीठ के बल लेट जाएं (या आरामदायक कुर्सी पर टिक जाएं), हथेलियां ऊपर की ओर रखें।',
        'आंखें बंद करें और पैरों से लेकर कंधे और चेहरे तक पूरे शरीर को ढीला छोड़ दें।',
        '2 मिनट तक केवल अपनी शांत सांस पर ध्यान दें।',
      ],
      mr: [
        'पाठीवर सरळ झोपा (किंवा आरामखुर्चीवर रेलून बसा), तळहात आकाशाकडे ठेवा.',
        'डोळे बंद करून पायापासून ते खांदे आणि चेहऱ्यापर्यंत संपूर्ण शरीर सैल सोडा.',
        '२ मिनिटे केवळ आपल्या संथ श्वासावर लक्ष केंद्रित करा.',
      ],
    },
    caution: {
      en: 'In emergency chest pain, sit upright rather than lying flat.',
      hi: 'आपातकालीन सीने के दर्द में लेटने के बजाय आराम से बैठें।',
      mr: 'छातीत दुखत असल्यास झोपण्याऐवजी बसून रहा.',
    },
  },
  {
    id: 'suryanamaskar',
    name: {
      en: 'Suryanamaskar (12-Step Sun Salutation)',
      hi: 'सूर्य नमस्कार (12 आसन श्रृंखला)',
      mr: 'सूर्यनमस्कार (१२ आसनांची मालिका)',
    },
    sanskrit: 'Surya Namaskara',
    category: 'diabetes',
    durationSec: 120,
    benefits: {
      en: 'Complete full-body metabolic warm-up: strengthens spine, joints, heart, digestion, and blood-sugar balance.',
      hi: 'पूरे शरीर का संपूर्ण व्यायाम: रीढ़, जोड़ों, दिल, पाचन और शुगर नियंत्रण को मजबूत करता है।',
      mr: 'संपूर्ण शरीराचा व्यायाम: पाठीचा कणा, सांधे, हृदय, पचन आणि मधुमेह नियंत्रणास अत्यंत उपयुक्त.',
    },
    instructions: {
      en: [
        'Follow the 12-pose 3D model cycle slowly, coordinating Inhale with upward arches and Exhale with forward bends.',
        'Keep knees softly bent during forward folds if hamstrings feel tight.',
        'Perform 2 to 6 calm rounds at your own comfortable pace.',
      ],
      hi: [
        'ऊपर 3D मॉडल के साथ 12 आसनों को सांस के तालमेल से धीरे-धीरे करें।',
        'आगे झुकते समय कमर या घुटनों पर जोर न डालें।',
        'अपनी क्षमता के अनुसार 2 से 6 शांत चक्र करें।',
      ],
      mr: [
        'वरील 3D मॉडेलप्रमाणे श्वासाच्या लयीत १२ आसने हळुवार करा.',
        'पुढे वाकताना कंबर किंवा गुडघ्यांवर अनावश्यक ताण देऊ नका.',
        'आपल्या क्षमतेनुसार २ ते ६ आवर्तने शांतपणे पूर्ण करा.',
      ],
    },
    caution: {
      en: 'Avoid fast rounds if you have high BP, fever, slip disc, or severe knee injury.',
      hi: 'तेज बीपी, बुखार या स्लिप डिस्क होने पर तेज गति से न करें।',
      mr: 'उच्च रक्तदाब, ताप किंवा स्लिप डिस्क असल्यास वेगाने करू नका.',
    },
  },
  {
    id: 'utkatasana',
    name: {
      en: 'Chair Pose Flow (Knee & Thigh Strength)',
      hi: 'उत्कटासन (जांघ व घुटने की मजबूती)',
      mr: 'उत्कटासन (गुडघे व मांड्यांची ताकद)',
    },
    sanskrit: 'Utkatasana',
    category: 'knee',
    durationSec: 45,
    benefits: {
      en: 'Builds quadriceps and glute support around the knee joint (ST36/SP10) and improves balance.',
      hi: 'जांघ और घुटने के आसपास की मांसपेशियों को मजबूत कर संतुलन बढ़ाता है।',
      mr: 'मांड्या व नितंबांचे स्नायू मजबूत करून गुडघ्याचे संरक्षण करते आणि तोल सुधारते.',
    },
    instructions: {
      en: [
        'Stand tall with feet hip-width apart and inhale arms overhead.',
        'Exhale and bend knees gently backward as if sitting into an imaginary chair.',
        'Keep weight in heels and chest lifted for 3 calm breaths, then stand back up.',
      ],
      hi: [
        'पैर कंधे की चौड़ाई पर रखकर सीधे खड़े हों और हाथ ऊपर उठाएं।',
        'सांस छोड़ते हुए कुर्सी पर बैठने की तरह घुटने हल्के मोड़ें।',
        'एड़ियों पर संतुलन रखते हुए 3 सांसें रुकें और धीरे ऊपर आएं।',
      ],
      mr: [
        'पायांमध्ये खांद्यांएवढे अंतर ठेवून सरळ उभे रहा आणि हात वर करा.',
        'श्वास सोडत काल्पनिक खुर्चीवर बसल्याप्रमाणे गुडघे थोडे वाकवा.',
        'टाचांवर वजन ठेवून ३ संथ श्वासांपर्यंत थांबा आणि हळू उभे रहा.',
      ],
    },
    caution: {
      en: 'Do not let knees push past your toes; stop before any sharp knee ache.',
      hi: 'घुटनों को पंजों से आगे न जाने दें; दर्द होने पर गहरा न बैठें।',
      mr: 'गुडघे पायाच्या बोटांपुढे जाऊ देऊ नका; दुखत असल्यास कमी खाली बसा.',
    },
  },
  {
    id: 'virabhadrasana_2',
    name: {
      en: 'Warrior II Flow (Stamina & Shoulder Tone)',
      hi: 'वीरभद्रासन II (स्टैमिना व कंधे)',
      mr: 'वीरभद्रासन २ (दमशक्ती व खांदे बळकटी)',
    },
    sanskrit: 'Virabhadrasana II',
    category: 'diabetes',
    durationSec: 60,
    benefits: {
      en: 'Opens hips, chest, and shoulders while strengthening legs and boosting metabolic circulation.',
      hi: 'कूल्हों, छाती और पैरों को मजबूत कर शरीर में ऊर्जा और रक्त संचार बढ़ाता है।',
      mr: 'कंबर, छाती व खांदे मोकळे होतात आणि पायांमधील ताकद व रक्ताभिसरण वाढते.',
    },
    instructions: {
      en: [
        'Step feet wide apart and turn your front foot outward 90 degrees.',
        'Bend the front knee over the ankle while keeping your back leg straight.',
        'Stretch both arms out at shoulder height and gaze steadily over the front hand.',
      ],
      hi: [
        'पैरों को चौड़ा फैलाएं और आगे वाला पैर 90 डिग्री बाहर मोड़ें।',
        'आगे के घुटने को टखने के ऊपर मोड़ें और पिछला पैर सीधा रखें।',
        'दोनों हाथ कंधों की सीध में फैलाएं और आगे के हाथ की ओर देखें।',
      ],
      mr: [
        'दोन्ही पायांमध्ये मोठे अंतर घ्या आणि पुढचे पाऊल ९० अंश बाहेर फिरवा.',
        'पुढचा गुडघा घोट्याच्या वर येईल असा वाकवा आणि मागचा पाय सरळ ठेवा.',
        'दोन्ही हात खांद्यांच्या रेषेत पसरवून पुढच्या हाताकडे पहा.',
      ],
    },
    caution: {
      en: 'Keep shoulders relaxed down away from ears; reduce stance width if hips feel tight.',
      hi: 'कंधे ढीले रखें; कूल्हों में खिंचाव हो तो पैरों की दूरी कम करें।',
      mr: 'खांदे सैल ठेवा; ताण जाणवल्यास पायांमधील अंतर थोडे कमी ठेवा.',
    },
  },
  {
    id: 'setu_bandhasana',
    name: {
      en: 'Bridge Pose Flow (Spine & BP Calm)',
      hi: 'सेतुबंधासन (कमर व बीपी शांति)',
      mr: 'सेतुबंधासन (पाठ व रक्तदाब शांततेसाठी)',
    },
    sanskrit: 'Setu Bandhasana',
    category: 'bp',
    durationSec: 60,
    benefits: {
      en: 'Gently opens chest lungs, strengthens glutes/lower back, and calms nervous tension.',
      hi: 'फेफड़ों व छाती को खोलता है, कमर मजबूत करता है और बीपी व तनाव शांत करता है।',
      mr: 'छाती व फुफ्फुसे मोकळी होतात, कंबर मजबूत होते आणि मन व रक्तदाब शांत राहतो.',
    },
    instructions: {
      en: [
        'Lie on your back with knees bent and feet flat hip-width apart near your hips.',
        'Inhale and press through your heels to lift hips softly toward the ceiling.',
        'Hold for 3 slow breaths, then exhale to roll spine slowly down.',
      ],
      hi: [
        'पीठ के बल लेटकर घुटने मोड़ें और पैर हिप्स के पास जमीन पर रखें।',
        'सांस लेते हुए एड़ियों के सहारे कमर को धीरे से ऊपर उठाएं।',
        '3 धीमी सांसें रुकें, फिर सांस छोड़ते हुए कमर नीचे लाएं।',
      ],
      mr: [
        'पाठीवर झोपून गुडघे दुमडा आणि पावले जमिनीवर टेकवा.',
        'श्वास घेत टाचांवर दाब देऊन कंबर हळुवार वर उचला.',
        '३ संथ श्वासांपर्यंत थांबा आणि श्वास सोडत पाठ हळू खाली टेकवा.',
      ],
    },
    caution: {
      en: 'Keep neck centered and still while hips are lifted; avoid sharp lower-back arching.',
      hi: 'कमर ऊपर उठाते समय गर्दन न घुमाएं और झटका न दें।',
      mr: 'कंबर वर असताना मान बाजूला फिरवू नका आणि कंबरेला झटका देऊ नका.',
    },
  },
  {
    id: 'tadasana_flow',
    name: {
      en: 'Mountain & Overhead Reach (Posture & Neck)',
      hi: 'ताड़ासन (रीढ़ व गर्दन सुधार)',
      mr: 'ताडासन (पाठ व मान ताठ ठेवण्यासाठी)',
    },
    sanskrit: 'Tadasana',
    category: 'neck',
    durationSec: 45,
    benefits: {
      en: 'Decompresses the spine, aligns shoulders over hips, and opens breathing posture.',
      hi: 'रीढ़ की हड्डी को सीधा कर कंधों और गर्दन का झुकाव ठीक करता है।',
      mr: 'पाठीचा मणका सरळ होतो, खांदे व मानेची ठेवण सुधारते आणि श्वसन मोकळे होते.',
    },
    instructions: {
      en: [
        'Stand evenly on both feet with shoulders relaxed and chest open.',
        'Inhale and sweep both arms wide and overhead, lengthening gently through the spine.',
        'Exhale and lower arms slowly down alongside your body.',
      ],
      hi: [
        'दोनों पैरों पर बराबर वजन रखकर सीधे खड़े हों।',
        'सांस लेते हुए दोनों हाथ ऊपर ले जाकर रीढ़ को ऊपर की ओर खींचें।',
        'सांस छोड़ते हुए हाथ धीरे-धीरे नीचे लाएं।',
      ],
      mr: [
        'दोन्ही पायांवर समान भार देऊन सरळ उभे रहा.',
        'श्वास आत घेत दोन्ही हात वर नेऊन पाठ वरच्या दिशेने ताणा.',
        'श्वास सोडत हात हळुवार बाजूने खाली आणा.',
      ],
    },
    caution: {
      en: 'Lift onto toes only if balance feels steady.',
      hi: 'संतुलन ठीक होने पर ही एड़ियां ऊपर उठाएं।',
      mr: 'तोल व्यवस्थित राहिल्यासच टाचा वर उचला.',
    },
  },
];

export interface SuryanamaskarStep {
  step: number;
  poseKey:
    | 'pranamasana'
    | 'hasta_uttanasana'
    | 'hastapadasana'
    | 'ashwa_right'
    | 'dandasana'
    | 'ashtanga'
    | 'bhujangasana'
    | 'parvatasana'
    | 'ashwa_left';
  sanskrit: string;
  breath: 'Inhale' | 'Exhale' | 'Hold';
  name: Record<Lang, string>;
  cue: Record<Lang, string>;
}

export const SURYANAMASKAR_STEPS: SuryanamaskarStep[] = [
  {
    step: 1,
    poseKey: 'pranamasana',
    sanskrit: 'Pranamasana',
    breath: 'Exhale',
    name: { en: 'Prayer Pose', hi: 'प्रणामासन', mr: 'प्रणामासन' },
    cue: {
      en: 'Stand upright at the front of the mat and bring palms together in Namaste at your chest.',
      hi: 'चटाई के आगे सीधे खड़े होकर छाती के सामने दोनों हथेलियां नमस्कार मुद्रा में जोड़ें।',
      mr: 'चटईच्या पुढच्या टोकाशी सरळ उभे राहून छातीसमोर दोन्ही हात नमस्कार मुद्रेत जोडा.',
    },
  },
  {
    step: 2,
    poseKey: 'hasta_uttanasana',
    sanskrit: 'Hasta Uttanasana',
    breath: 'Inhale',
    name: { en: 'Raised Arms Pose', hi: 'हस्त उत्तानासन', mr: 'हस्त उत्तानासन' },
    cue: {
      en: 'Inhale deeply, sweep arms overhead alongside ears, and arch your upper back gently.',
      hi: 'गहरी सांस लेते हुए दोनों हाथ कानों के पास ऊपर उठाएं और कमर को हल्का पीछे झुकाएं।',
      mr: 'दीर्घ श्वास घेत दोन्ही हात कानांलगत वर न्या आणि पाठ हळुवार मागे झुकवा.',
    },
  },
  {
    step: 3,
    poseKey: 'hastapadasana',
    sanskrit: 'Hastapadasana',
    breath: 'Exhale',
    name: { en: 'Standing Forward Bend', hi: 'हस्तपादासन', mr: 'हस्तपादासन' },
    cue: {
      en: 'Exhale slowly and fold forward from the hips, bringing hands down beside your feet.',
      hi: 'सांस छोड़ते हुए कमर से आगे झुकें और हथेलियां पैरों के पास जमीन पर ले जाएं।',
      mr: 'श्वास सोडत कंबरेतून पुढे वाकून दोन्ही हात पावलांजवळ जमिनीकडे न्या.',
    },
  },
  {
    step: 4,
    poseKey: 'ashwa_right',
    sanskrit: 'Ashwa Sanchalanasana (R)',
    breath: 'Inhale',
    name: { en: 'Equestrian Pose (Right Back)', hi: 'अश्व संचालनासन (दायां पैर पीछे)', mr: 'अश्वसंचालनासन (उजवा पाय मागे)' },
    cue: {
      en: 'Inhale, step the right leg far back with knee down, bend left knee, and lift chest forward.',
      hi: 'सांस लेकर दायां पैर पीछे ले जाएं, बायां घुटना मोड़ें और छाती व नजर सामने उठाएं।',
      mr: 'श्वास घेत उजवा पाय मागे न्या, डावा गुडघा वाकवून छाती आणि मान समोर उचला.',
    },
  },
  {
    step: 5,
    poseKey: 'dandasana',
    sanskrit: 'Dandasana',
    breath: 'Hold',
    name: { en: 'Stick / Plank Pose', hi: 'दंडासन (प्लैंक)', mr: 'दंडासन (प्लँक स्थिती)' },
    cue: {
      en: 'Step left leg back to join right in a straight plank line, wrists directly under shoulders.',
      hi: 'बायां पैर भी पीछे ले जाकर पूरे शरीर को सीधी रेखा (प्लैंक) में रखें।',
      mr: 'डावा पायही मागे नेऊन खांदे ते टाचांपर्यंत शरीर एका सरळ रेषेत ठेवा.',
    },
  },
  {
    step: 6,
    poseKey: 'ashtanga',
    sanskrit: 'Ashtanga Namaskara',
    breath: 'Exhale',
    name: { en: 'Eight-Limbed Salute', hi: 'अष्टांग नमस्कार', mr: 'अष्टांग नमस्कार' },
    cue: {
      en: 'Exhale and lower knees, chest, and chin lightly onto the mat while keeping hips softly lifted.',
      hi: 'सांस छोड़ते हुए घुटने, छाती और ठुड्डी जमीन पर टिकाएं और कमर थोड़ी ऊपर रखें।',
      mr: 'श्वास सोडत गुडघे, छाती आणि हनुवटी जमिनीवर टेकवा व कंबर थोडी वर ठेवा.',
    },
  },
  {
    step: 7,
    poseKey: 'bhujangasana',
    sanskrit: 'Bhujangasana',
    breath: 'Inhale',
    name: { en: 'Cobra Pose', hi: 'भुजंगासन', mr: 'भुजंगासन' },
    cue: {
      en: 'Inhale and glide chest forward and up into Cobra, keeping shoulders relaxed away from ears.',
      hi: 'सांस लेते हुए आगे से छाती और सिर को ऊपर उठाएं और कोहनियां हल्की मुड़ी रखें।',
      mr: 'श्वास आत घेत छाती आणि डोके वर उचला; खांदे कानांपासून दूर सैल ठेवा.',
    },
  },
  {
    step: 8,
    poseKey: 'parvatasana',
    sanskrit: 'Parvatasana',
    breath: 'Exhale',
    name: { en: 'Mountain / Downward Dog', hi: 'पर्वतासन', mr: 'पर्वतासन' },
    cue: {
      en: 'Exhale, lift hips high into an inverted V shape, pressing palms and heels softly toward the mat.',
      hi: 'सांस छोड़ते हुए कमर को ऊपर उठाकर पर्वत (उल्टा V) आकार बनाएं।',
      mr: 'श्वास सोडत कंबर वर उचला आणि हात व टाचा चटईकडे दाबून उलटा V आकार करा.',
    },
  },
  {
    step: 9,
    poseKey: 'ashwa_left',
    sanskrit: 'Ashwa Sanchalanasana (L)',
    breath: 'Inhale',
    name: { en: 'Equestrian Pose (Left Back)', hi: 'अश्व संचालनासन (बायां पैर पीछे)', mr: 'अश्वसंचालनासन (डावा पाय मागे)' },
    cue: {
      en: 'Inhale, step the right foot forward between your hands while lowering left knee, chest open.',
      hi: 'सांस लेकर दायां पैर दोनों हाथों के बीच आगे लाएं और सामने देखें।',
      mr: 'श्वास घेत उजवा पाय दोन्ही हातांच्या मधोमध पुढे आणा आणि समोर पहा.',
    },
  },
  {
    step: 10,
    poseKey: 'hastapadasana',
    sanskrit: 'Hastapadasana',
    breath: 'Exhale',
    name: { en: 'Standing Forward Bend', hi: 'हस्तपादासन', mr: 'हस्तपादासन' },
    cue: {
      en: 'Exhale and step left foot forward beside right, folding softly from the hips.',
      hi: 'सांस छोड़ते हुए बायां पैर आगे लाएं और कमर से आगे झुकें।',
      mr: 'श्वास सोडत डावा पाय पुढे आणा आणि पुन्हा पुढे वाका.',
    },
  },
  {
    step: 11,
    poseKey: 'hasta_uttanasana',
    sanskrit: 'Hasta Uttanasana',
    breath: 'Inhale',
    name: { en: 'Raised Arms Pose', hi: 'हस्त उत्तानासन', mr: 'हस्त उत्तानासन' },
    cue: {
      en: 'Inhale deeply as you rise upright, reaching arms high overhead into a gentle backbend.',
      hi: 'गहरी सांस लेते हुए दोनों हाथ ऊपर उठाकर हल्का पीछे झुकें।',
      mr: 'दीर्घ श्वास घेत वर उभे राहून दोन्ही हात आकाशाकडे उचला.',
    },
  },
  {
    step: 12,
    poseKey: 'pranamasana',
    sanskrit: 'Pranamasana',
    breath: 'Exhale',
    name: { en: 'Prayer Pose (Complete)', hi: 'प्रणामासन (चक्र पूर्ण)', mr: 'प्रणामासन (आवर्तन पूर्ण)' },
    cue: {
      en: 'Exhale and return palms gently to heart center, completing one full round of Suryanamaskar.',
      hi: 'सांस छोड़ते हुए हाथ छाती के सामने जोड़ें — सूर्य नमस्कार का एक चक्र पूर्ण हुआ।',
      mr: 'श्वास सोडत दोन्ही हात छातीसमोर नमस्कार मुद्रेत आणा — एक सूर्यनमस्कार पूर्ण झाला.',
    },
  },
];

