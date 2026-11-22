import type { Lang, Point3D } from './acupoints';

export type RemedyCategory = 'drink' | 'compress' | 'steam' | 'balm' | 'diet' | 'emergency';

export interface PointHomeRemedy {
  category: RemedyCategory;
  title: Record<Lang, string>;
  prepTime: Record<Lang, string>;
  ingredients: Record<Lang, string[]>;
  steps: Record<Lang, string>;
  caution: Record<Lang, string>;
}

export const REMEDY_CATEGORY_LABELS: Record<RemedyCategory, Record<Lang, string>> = {
  drink: { en: 'Herbal Drink', hi: 'काढ़ा / पेय', mr: 'घरगुती पेय' },
  compress: { en: 'Warm / Cool Pack', hi: 'सिकाई / पट्टी', mr: 'शेकाचा उपाय' },
  steam: { en: 'Steam & Gargle', hi: 'भाप व गरारे', mr: 'वाफ व गुळण्या' },
  balm: { en: 'Oil & Balm Rub', hi: 'तेल मालिश', mr: 'तेल / लेप मालिश' },
  diet: { en: 'Diet & Tonic', hi: 'आहार व टॉनिक', mr: 'आहार व टॉनिक' },
  emergency: { en: 'Immediate First-Aid', hi: 'प्राथमिक सहायता', mr: 'तात्काळ प्रथमोपचार' },
};

export const HOME_REMEDIES_BY_ID: Record<string, PointHomeRemedy> = {
  LI4: {
    category: 'drink',
    title: {
      en: 'Ginger-Mint Soothing Tea + Temple Cool Cloth',
      hi: 'अदरक-पुदीना चाय व माथे पर ठंडी पट्टी',
      mr: 'आले-पुदिना चहा आणि कपाळावर थंड पट्टी',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Fresh crushed ginger (½ tsp)', 'Mint leaves (5–6)', 'Warm water (1 cup)'],
      hi: ['ताजा कुटा अदरक (½ चम्मच)', 'पुदीना पत्ते (5-6)', 'गुनगुना पानी (1 कप)'],
      mr: ['ताजे ठेचलेले आले (½ चमचा)', 'पुदिन्याची पाने (५-६)', 'कोमट पाणी (१ कप)'],
    },
    steps: {
      en: 'Steep crushed ginger and mint in hot water for 3 minutes, strain and sip slowly while resting in a quiet room after pressing LI4.',
      hi: 'गर्म पानी में कुटा अदरक और पुदीना 3 मिनट भिगोकर छान लें और LI4 दबाने के बाद शांत कमरे में धीरे-धीरे पिएं।',
      mr: 'गरम पाण्यात आले व पुदिना ३ मिनिटे उकळून गाळा आणि LI4 दाबल्यानंतर शांत खोलीत हळुवार प्या.',
    },
    caution: {
      en: 'Avoid LI4 and strong ginger tea during pregnancy.',
      hi: 'गर्भावस्था में LI4 बिंदु व तेज अदरक चाय से बचें।',
      mr: 'गर्भावस्थेत LI4 दाबू नका व अति उष्ण आले टाळा.',
    },
  },
  PC6: {
    category: 'drink',
    title: {
      en: 'Cardamom-Fennel Calm Water + Fresh Air',
      hi: 'इलायची-सौंफ का शांत पेय व खुली हवा',
      mr: 'वेलची-बडीशेप पाणी आणि मोकळी हवा',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Green cardamom (1 crushed)', 'Fennel seeds (½ tsp)', 'Cool or lukewarm water (1 glass)'],
      hi: ['हरी इलायची (1 कुटी)', 'सौंफ (½ चम्मच)', 'ताजा पानी (1 गिलास)'],
      mr: ['हिरवी वेलची (१ ठेचलेली)', 'बडीशेप (½ चमचा)', 'साधे पाणी (१ ग्लास)'],
    },
    steps: {
      en: 'Sip cardamom-infused water slowly, sniff a fresh lemon peel to settle nausea or motion sickness, and breathe deeply while holding PC6.',
      hi: 'इलायची-सौंफ वाला पानी घूंट-घूंट पिएं, मतली शांत करने के लिए नींबू के छिलके की खुशबू लें और PC6 दबाएं।',
      mr: 'वेलची-बडीशेपचे पाणी हळूहळू प्या, मळमळ थांबवण्यासाठी लिंबाच्या सालीचा वास घ्या आणि PC6 दाबा.',
    },
    caution: {
      en: 'If chest tightness or sweating worsens, call 108/112 immediately.',
      hi: 'सीने में जकड़न या पसीना बढ़े तो तुरंत 108/112 पर कॉल करें।',
      mr: 'छातीत घट्टपणा किंवा घाम वाढल्यास तात्काळ १०८/११२ वर कॉल करा.',
    },
  },
  HT7: {
    category: 'drink',
    title: {
      en: 'Warm Nutmeg-Cardamom Milk / Chamomile Cup',
      hi: 'गुनगुना जायफल-इलायची दूध या कैमोमाइल चाय',
      mr: 'कोमट जायफळ-वेलची दूध किंवा शांत हर्बल पेय',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm milk or almond water (1 cup)', 'Pinch of nutmeg', 'Crushed cardamom (1 pod)'],
      hi: ['गुनगुना दूध या बादाम पानी (1 कप)', 'चुटकी भर जायफल', 'कुटी इलायची (1)'],
      mr: ['कोमट दूध किंवा पाणी (१ कप)', 'चिमूटभर जायफळ', 'ठेचलेली वेलची (१)'],
    },
    steps: {
      en: 'Stir a tiny pinch of nutmeg and cardamom into warm milk 30 minutes before sleep; dim screens and press HT7 gently.',
      hi: 'सोने से 30 मिनट पहले गुनगुने दूध में चुटकी भर जायफल व इलायची मिलाकर पिएं और HT7 हल्के से दबाएं।',
      mr: 'झोपेपूर्वी ३० मिनिटे आधी कोमट दुधात चिमूटभर जायफळ-वेलची घालून प्या आणि HT7 हळुवार दाबा.',
    },
    caution: {
      en: 'Keep nutmeg to a tiny pinch only; seek urgent care for chest distress.',
      hi: 'जायफल केवल चुटकी भर लें; सीने में तेज दर्द हो तो डॉक्टर को दिखाएं।',
      mr: 'जायफळ फक्त चिमूटभर घ्या; छातीत त्रास असल्यास डॉक्टरांचा सल्ला घ्या.',
    },
  },
  HT9: {
    category: 'emergency',
    title: {
      en: 'Seated Airflow, Collar Loosen & Ambulance Call',
      hi: 'कॉलर ढीला कर खुली हवा व 108/112 एम्बुलेंस कॉल',
      mr: 'कॉलर सैल करून मोकळी हवा आणि १०८/११२ कॉल',
    },
    prepTime: { en: 'Instant', hi: 'तुरंत', mr: 'तात्काळ' },
    ingredients: {
      en: ['Semi-sitting upright posture', 'Loosened shirt/collar', 'Fresh cross-ventilation'],
      hi: ['आरामदायक सीधी बैठने की स्थिति', 'ढीले कपड़े/कॉलर', 'ताजी हवा'],
      mr: ['टेकून बसण्याची स्थिती', 'सैल कपडे/कॉलर', 'ताजी खेळती हवा'],
    },
    steps: {
      en: 'Dial 108/112 first, help the person sit resting against a wall with knees bent, loosen tight clothing, and lightly fan fresh air while pinching HT9.',
      hi: 'सबसे पहले 108/112 डायल करें, व्यक्ति को सहारे से बैठाएं, कपड़े ढीले करें और ताजी हवा देते हुए HT9 दबाएं।',
      mr: 'प्रथम १०८/११२ वर फोन करा, व्यक्तीला भिंतीचा आधार देऊन बसवा, कपडे सैल करा आणि HT9 दाबा.',
    },
    caution: {
      en: 'Never give food or large drinks to a fainting or chest-crisis patient.',
      hi: 'बेहोशी या सीने में दर्द के समय कुछ भी खाने-पीने को न दें।',
      mr: 'बेशुद्धी किंवा छातीत दुखताना खायला-प्यायला देऊ नका.',
    },
  },
  PC9: {
    category: 'emergency',
    title: {
      en: 'Cool Wet Neck Cloth & Shade Cooling',
      hi: 'गर्दन पर ठंडी गीली पट्टी व छाया में आराम',
      mr: 'मानेवर थंड ओले कापड आणि सावलीत विश्रांती',
    },
    prepTime: { en: 'Instant', hi: 'तुरंत', mr: 'तात्काळ' },
    ingredients: {
      en: ['Clean cotton cloth', 'Cool water', 'Shaded ventilated space'],
      hi: ['साफ सूती कपड़ा', 'ठंडा पानी', 'हवादार छायादार स्थान'],
      mr: ['स्वच्छ सुती कापड', 'थंड पाणी', 'हवेशीर सावलीची जागा'],
    },
    steps: {
      en: 'Move to shade immediately, place cool damp cloths on forehead, neck, and armpits for heat exhaustion/dizziness, and press PC9 firmly.',
      hi: 'तुरंत छाया में ले जाकर माथे व गर्दन पर ठंडे पानी की पट्टी रखें और उंगली के सिरे PC9 को दबाएं।',
      mr: 'तात्काळ सावलीत घेऊन कपाळावर व मानेवर थंड ओले कापड ठेवा आणि PC9 बोटाचे टोक दाबा.',
    },
    caution: {
      en: 'Call emergency 108/112 immediately if the person remains unresponsive.',
      hi: 'होश न आने पर तुरंत 108/112 आपातकालीन सेवा बुलाएं।',
      mr: 'व्यक्ती शुद्धीवर न आल्यास लगेच १०८/११२ वर संपर्क साधा.',
    },
  },
  PC8: {
    category: 'compress',
    title: {
      en: 'Cool Rose-Water / Vetiver Palm Mist & Slow Breathing',
      hi: 'ठंडे गुलाबजल से हथेली की ठंडक व धीमी सांस',
      mr: 'थंड गुलाबपाण्याने तळहाताला थंडावा व संथ श्वास',
    },
    prepTime: { en: '1 min', hi: '1 मिनट', mr: '१ मिनिट' },
    ingredients: {
      en: ['Cool water or rose water', 'Soft cotton towel'],
      hi: ['ठंडा पानी या गुलाबजल', 'मुलायम सूती तौलिया'],
      mr: ['थंड पाणी किंवा गुलाबजल', 'मऊ सुती टॉवेल'],
    },
    steps: {
      en: 'Wash hands and wrists in cool water, dab lightly with rose water, rub palms briskly for 10 seconds, then press PC8 center while exhaling.',
      hi: 'हाथ व कलाई ठंडे पानी से धोकर हल्का गुलाबजल लगाएं, फिर सांस छोड़ते हुए हथेली के बीच PC8 दबाएं।',
      mr: 'हात थंड पाण्याने धुऊन थोडे गुलाबपाणी लावा आणि श्वास सोडताना तळहाताच्या मध्यावर PC8 दाबा.',
    },
    caution: {
      en: 'Avoid icy cold water if you have cold-triggered joint pain.',
      hi: 'ठंड से जोड़ों में दर्द बढ़ता हो तो बहुत बर्फ वाला पानी न लें।',
      mr: 'थंडीमुळे सांधे दुखत असल्यास बर्फाचे पाणी टाळा.',
    },
  },
  LU10: {
    category: 'drink',
    title: {
      en: 'Warm Licorice (Mulethi) & Honey-Ginger Throat Sip',
      hi: 'मुलेठी-शहद-अदरक का गुनगुना घूंट',
      mr: 'जेष्ठमध-मध-आले कोमट पाणी',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Mulethi stick or powder (½ tsp)', 'Ginger slices (3)', 'Warm water (1 cup)', 'Honey (½ tsp, optional)'],
      hi: ['मुलेठी चूर्ण (½ चम्मच)', 'अदरक (3 टुकड़े)', 'गर्म पानी (1 कप)', 'शहद (½ चम्मच)'],
      mr: ['जेष्ठमध पावडर (½ चमचा)', 'आल्याचे तुकडे (३)', 'कोमट पाणी (१ कप)', 'मध (½ चमचा)'],
    },
    steps: {
      en: 'Simmer mulethi and ginger in water for 4 minutes, cool slightly before adding honey (optional), and sip slowly after massaging LU10.',
      hi: 'मुलेठी और अदरक को 4 मिनट उबालकर हल्का गुनगुना होने पर शहद मिलाएं और LU10 दबाने के बाद पिएं।',
      mr: 'जेष्ठमध व आले ४ मिनिटे उकळून कोमट झाल्यावर मध मिसळा आणि LU10 मसाज केल्यावर हळुवार प्या.',
    },
    caution: {
      en: 'Skip honey for children under 1 year or diabetic users; limit mulethi in high BP.',
      hi: 'डायबिटीज में शहद न लें और हाई बीपी में मुलेठी कम मात्रा में लें।',
      mr: 'मधुमेह असल्यास मध टाळा आणि उच्च रक्तदाबात जेष्ठमध कमी वापरा.',
    },
  },
  LU11: {
    category: 'steam',
    title: {
      en: 'Warm Salt-Turmeric Throat Gargle',
      hi: 'गुनगुने हल्दी-नमक के पानी से गरारे',
      mr: 'कोमट हळद-मिठाच्या पाण्याच्या गुळण्या',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Warm water (1 glass)', 'Rock salt (½ tsp)', 'Turmeric powder (¼ tsp)'],
      hi: ['गुनगुना पानी (1 गिलास)', 'सेंधा नमक (½ चम्मच)', 'हल्दी (¼ चम्मच)'],
      mr: ['कोमट पाणी (१ ग्लास)', 'सैंधव मीठ (½ चमचा)', 'हळद (¼ चमचा)'],
    },
    steps: {
      en: 'Stir salt and turmeric into tolerably warm water, gargle deeply for 30 seconds 3 times, then pinch-press LU11 beside the thumbnail.',
      hi: 'गुनगुने पानी में हल्दी और नमक मिलाकर 3 बार अच्छे से गरारे करें, फिर अंगूठे के कोने LU11 को दबाएं।',
      mr: 'कोमट पाण्यात हळद-मीठ विरघळवून ३ वेळा खोल गुळण्या करा आणि नंतर LU11 दाबा.',
    },
    caution: {
      en: 'Do not swallow gargle water; keep temperature comfortably warm.',
      hi: 'गरारे का पानी निगलें नहीं और पानी ज्यादा गर्म न रखें।',
      mr: 'गुळण्यांचे पाणी पिऊ नका आणि पाणी जास्त गरम नसावे.',
    },
  },
  LU7: {
    category: 'steam',
    title: {
      en: 'Ajwain-Eucalyptus Steam Inhalation + Steady Seated Hydration',
      hi: 'अजवाइन की भाप व शांत बैठकर गुनगुना पानी',
      mr: 'ओवा-निलगिरीची वाफ आणि बसून कोमट पाणी',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Hot water bowl', 'Ajwain/carom seeds (1 tsp)', '1 drop eucalyptus oil (optional)'],
      hi: ['गर्म पानी का कटोरा', 'अजवाइन (1 चम्मच)', 'नीलगिरी तेल (1 बूंद)'],
      mr: ['गरम पाण्याचे भांडे', 'ओवा (१ चमचा)', 'निलगिरी तेल (१ थेंब)'],
    },
    steps: {
      en: 'Inhale warm ajwain steam gently for 3–5 minutes to clear head & ear pressure (especially for vertigo/sinus), then rotate LU7 Clockwise.',
      hi: '3–5 मिनट हल्की अजवाइन की भाप लें जिससे सिर व कान का भारीपन खुले, फिर LU7 को क्लॉकवाइज दबाएं।',
      mr: '३–५ मिनिटे ओव्याची वाफ घ्या ज्यामुळे डोके व कानाचा जडपणा कमी होतो, नंतर LU7 क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Keep face 25–30 cm away from hot water; sit firmly if experiencing vertigo.',
      hi: 'चेहरे को भाप से सुरक्षित दूरी पर रखें और चक्कर आने पर बैठकर ही करें।',
      mr: 'चेहरा वाफेपासून सुरक्षित अंतरावर ठेवा आणि चक्कर येत असल्यास बसूनच करा.',
    },
  },
  SI3: {
    category: 'compress',
    title: {
      en: 'Warm Salt-Pouch Neck & Lower Back Compress',
      hi: 'गर्म नमक की पोटली से गर्दन व कमर की सिकाई',
      mr: 'गरम मिठाच्या पुरचुंडीने मान व पाठीचा शेक',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Coarse rock salt (1 cup)', 'Thick cotton cloth', 'Pan for dry heating'],
      hi: ['मोटा सेंधा नमक (1 कप)', 'मोटा सूती कपड़ा', 'तवा/कढ़ाई'],
      mr: ['जाड सैंधव मीठ (१ कप)', 'जाड सुती कापड', 'तवा'],
    },
    steps: {
      en: 'Dry-roast salt on a pan for 2 minutes, tie in cloth, and apply gentle warmth along stiff neck/back muscles before pressing SI3.',
      hi: 'नमक को तवे पर हल्का गर्म करके कपड़े में बांधें और अकड़ी हुई गर्दन-कमर पर सिकाई के बाद SI3 दबाएं।',
      mr: 'मीठ तव्यावर गरम करून पुरचुंडीत बांधा आणि आखडलेल्या मानेवर/पाठीवर शेक देऊन SI3 दाबा.',
    },
    caution: {
      en: 'Always test pouch warmth on your wrist before placing on skin.',
      hi: 'त्वचा पर लगाने से पहले पोटली की गर्माहट कलाई पर जांच लें।',
      mr: 'शेक देण्यापूर्वी पुरचुंडीची उष्णता मनगटावर तपासून पहा.',
    },
  },
  TW3: {
    category: 'balm',
    title: {
      en: 'Warm Sesame Oil Neck & Ear-Side Massage',
      hi: 'गुनगुने तिल के तेल से कान के पीछे व गर्दन की मालिश',
      mr: 'कोमट तीळ तेलाने कानामागे व मानेची मालिश',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Warm sesame or mustard oil (1 tsp)', '1 garlic clove (warmed in oil, strained)'],
      hi: ['गुनगुना तिल या सरसों का तेल (1 चम्मच)', 'लहसुन कली (1, तेल में गुनगुनी)'],
      mr: ['कोमट तीळ किंवा मोहरीचे तेल (१ चमचा)', 'लसूण पाकळी (१)'],
    },
    steps: {
      en: 'Warm sesame oil gently (never hot) and massage softly *around the outside* of the ear and behind the neck before pressing TW3.',
      hi: 'तेल हल्का गुनगुना करके कान के बाहरी हिस्से के चारों ओर और गर्दन पर मालिश करें, फिर TW3 दबाएं।',
      mr: 'तेल कोमट करून कानाच्या बाहेरील बाजूला व मानेवर हलकी मालिश करा आणि नंतर TW3 दाबा.',
    },
    caution: {
      en: 'Never pour oil inside the ear canal if pain, discharge, or perforation is suspected.',
      hi: 'कान के अंदर तेल न डालें, केवल बाहरी त्वचा पर हल्की मालिश करें।',
      mr: 'कानाच्या आत तेल टाकू नका; फक्त बाहेरील भागावरच मालिश करा.',
    },
  },
  TW5: {
    category: 'drink',
    title: {
      en: 'Tulsi-Black Pepper-Ginger Immunity Kadha',
      hi: 'तुलसी-कालीमिर्च-अदरक का इम्युनिटी काढ़ा',
      mr: 'तुळस-मिरी-आले रोगप्रतिकारक काढा',
    },
    prepTime: { en: '5 min', hi: '5 मिनट', mr: '५ मिनिटे' },
    ingredients: {
      en: ['Tulsi leaves (8–10)', 'Black pepper (3 crushed)', 'Fresh ginger (½ tsp)', 'Water (1.5 cups)'],
      hi: ['तुलसी पत्ते (8-10)', 'काली मिर्च (3 कुटी)', 'अदरक (½ चम्मच)', 'पानी (1.5 कप)'],
      mr: ['तुळशीची पाने (८-१०)', 'काळी मिरी (३ ठेचलेल्या)', 'आले (½ चमचा)', 'पाणी (१.५ कप)'],
    },
    steps: {
      en: 'Boil tulsi, crushed black pepper, and ginger down to 1 cup, strain and drink warm to relieve fever chills and stiffness alongside TW5.',
      hi: 'तुलसी, काली मिर्च और अदरक को 1 कप रहने तक उबालें और छानकर गुनगुना पिएं, साथ में TW5 दबाएं।',
      mr: 'तुळस, मिरी व आले १ कप शिल्लक राहेपर्यंत उकळून गाळा आणि कोमट प्या; सोबत TW5 दाबा.',
    },
    caution: {
      en: 'Drink in small portions if you suffer from acid reflux or stomach ulcers.',
      hi: 'एसिडिटी या पेट में जलन हो तो काढ़ा बहुत हल्का और कम मात्रा में लें।',
      mr: 'अ‍ॅसिडिटी किंवा जळजळ होत असल्यास काढा सौम्य व कमी प्रमाणात घ्या.',
    },
  },
  TW10: {
    category: 'compress',
    title: {
      en: 'Lukewarm Forehead & Neck Towel + Hydrating Coconut/Electrolyte Sip',
      hi: 'माथे-गर्दन पर ठंडी पट्टी व नारियल पानी से हाइड्रेशन',
      mr: 'कपाळावर थंड पट्टी आणि नारळपाणी / जलसंतुलन',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Tender coconut water or lemon-salt water (1 glass)', 'Damp cotton towel'],
      hi: ['नारियल पानी या नींबू-नमक पानी (1 गिलास)', 'गीला सूती तौलिया'],
      mr: ['नारळपाणी किंवा लिंबू-मीठ पाणी (१ ग्लास)', 'ओला सुती टॉवेल'],
    },
    steps: {
      en: 'Rehydrate slowly sitting down with coconut water and rest a cool damp cloth across the back of the neck while rotating TW10 anticlockwise.',
      hi: 'आराम से बैठकर नारियल पानी पिएं और गर्दन के पीछे ठंडी गीली पट्टी रखकर TW10 एंटीक्लॉकवाइज दबाएं।',
      mr: 'शांत बसून नारळपाणी प्या आणि मानेमागे थंड ओले कापड ठेवून TW10 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Rise slowly from sitting if feeling spinning vertigo.',
      hi: 'चक्कर या वर्टिगो में अचानक खड़े न हों, धीरे उठें।',
      mr: 'चक्कर किंवा व्हर्टिगो असल्यास अचानक उभे राहू नका.',
    },
  },
  GV20: {
    category: 'balm',
    title: {
      en: 'Cooling Brahmi / Coconut Scalp Oil Tap & Rest',
      hi: 'ब्राह्मी या नारियल तेल से सिर की हल्की मालिश व विश्राम',
      mr: 'ब्राह्मी किंवा खोबरेल तेलाने डोक्याची हलकी मालिश',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Coconut or Brahmi oil (1 tsp)'],
      hi: ['नारियल या ब्राह्मी तेल (1 चम्मच)'],
      mr: ['खोबरेल किंवा ब्राह्मी तेल (१ चमचा)'],
    },
    steps: {
      en: 'Apply a few drops of cool coconut/brahmi oil gently at the crown of the head and perform rhythmic fingertip tapping before holding GV20.',
      hi: 'सिर के ऊपरी भाग पर कुछ बूंदें ठंडा नारियल/ब्राह्मी तेल लगाकर उंगलियों से हल्की थपकी दें और GV20 दबाएं।',
      mr: 'डोक्याच्या मध्यभागी थोडे खोबरेल किंवा ब्राह्मी तेल लावून बोटांनी हलकी थाप द्या आणि GV20 दाबा.',
    },
    caution: {
      en: 'Never use strong force on the crown of the head; keep pressure feather-light.',
      hi: 'सिर के शीर्ष पर कभी तेज दबाव न डालें, हमेशा कोमल स्पर्श रखें।',
      mr: 'डोक्याच्या मध्यभागी कधीही जोर लावून दाबू नका; हलकाच स्पर्श ठेवा.',
    },
  },
  GB20: {
    category: 'compress',
    title: {
      en: 'Warm Towel Suboccipital Neck Release',
      hi: 'गर्म तौलिये से सिर के पिछले आधार की सिकाई',
      mr: 'गरम टॉवेलने डोक्याच्या मागील भागाचा शेक',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Clean hand towel', 'Hot water for wringing'],
      hi: ['साफ तौलिया', 'गर्म पानी'],
      mr: ['स्वच्छ हात टॉवेल', 'गरम पाणी'],
    },
    steps: {
      en: 'Wring a towel dipped in hot water, drape it under the skull base for 3 minutes to melt neck tension, then gently rotate GB20 anticlockwise.',
      hi: 'गर्म पानी में भिगोकर निचोड़ा तौलिया सिर के पिछले हिस्से के नीचे 3 मिनट रखें और फिर GB20 एंटीक्लॉकवाइज दबाएं।',
      mr: 'गरम पाण्यात भिजवून पिळलेला टॉवेल डोक्यामागे ३ मिनिटे ठेवा आणि नंतर GB20 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Check towel temperature so it is soothing, never scalding.',
      hi: 'तौलिया इतना गर्म न हो कि त्वचा जले।',
      mr: 'टॉवेल जास्त गरम नसावा याची काळजी घ्या.',
    },
  },
  BL10: {
    category: 'compress',
    title: {
      en: 'Warm Mustard-Garlic / Sesame Neck Balm + Slow Chin Tucks',
      hi: 'गुनगुने तेल से गर्दन की मालिश व धीमा व्यायाम',
      mr: 'कोमट तेलाने मान मालिश व हळुवार स्ट्रेच',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm sesame or mustard oil (1 tsp)', 'Pinch of ajwain/camphor (external)'],
      hi: ['गुनगुना तिल या सरसों का तेल (1 चम्मच)', 'हल्का कपूर/अजवाइन'],
      mr: ['कोमट तीळ किंवा मोहरीचे तेल (१ चमचा)', 'थोडा कापूर (बाह्य वापरासाठी)'],
    },
    steps: {
      en: 'Rub warm oil smoothly along both sides of the neck cords without cracking the neck, then apply Clockwise/Anticlockwise pressure at BL10.',
      hi: 'गर्दन को चटकाए बिना दोनों तरफ की नसों पर गुनगुना तेल लगाएं और BL10 पर गोल दबाव दें।',
      mr: 'मान न मोडता दोन्ही बाजूंच्या स्नायूंवर कोमट तेल लावा आणि BL10 वर गोल दाब द्या.',
    },
    caution: {
      en: 'Never jerk or forcefully twist a stiff cervical spine.',
      hi: 'अकड़ी हुई गर्दन को झटके से बिल्कुल न घुमाएं।',
      mr: 'आखडलेली मान कधीही झटक्याने फिरवू नका.',
    },
  },
  GB14: {
    category: 'compress',
    title: {
      en: 'Cool Forehead Compress + Dark Quiet Rest',
      hi: 'माथे पर ठंडी पट्टी व कम रोशनी में विश्राम',
      mr: 'कपाळावर थंड पट्टी व शांत खोलीत विश्रांती',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Soft washcloth soaked in cool water', '1 drop rose water'],
      hi: ['ठंडे पानी में भीगा नरम कपड़ा', '1 बूंद गुलाबजल'],
      mr: ['थंड पाण्यात भिजवलेले मऊ कापड', '१ थेंब गुलाबजल'],
    },
    steps: {
      en: 'Place a cool rose-water cloth over eyebrows and forehead for 5 minutes away from screens, then circle GB14 lightly clockwise.',
      hi: 'स्क्रीन से दूर रहकर 5 मिनट माथे व भौंहों पर ठंडी पट्टी रखें और GB14 पर हल्का क्लॉकवाइज दबाव दें।',
      mr: 'मोबाईल-टीव्हीपासून दूर ५ मिनिटे कपाळावर थंड पट्टी ठेवा आणि GB14 हलके क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Seek medical check if severe headache comes with blurred vision or fever.',
      hi: 'तेज सिरदर्द के साथ बुखार या धुंधला दिखे तो डॉक्टर से जांच कराएं।',
      mr: 'तीव्र डोकेदुखीसोबत ताप किंवा धूसर दृष्टी असल्यास डॉक्टरांना भेटा.',
    },
  },
  BL2: {
    category: 'compress',
    title: {
      en: 'Warm Steam Facial Towel + Cucumber / Rose-Water Eye Rest',
      hi: 'आंखों के पास भाप सेंक व गुलाबजल/खीरा पट्टी',
      mr: 'गुलाबपाणी / काकडीची थंड पट्टी व डोळ्यांना विश्रांती',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Rose water on cotton pads (or fresh cucumber slices)', 'Plain lukewarm nasal rinse water'],
      hi: ['कॉटन पैड पर गुलाबजल (या खीरे के टुकड़े)'],
      mr: ['कापसावर गुलाबपाणी (किंवा काकडीचे काप)'],
    },
    steps: {
      en: 'Rest cool rose-water pads over closed eyelids for 3 minutes (use warm moist towel over cheekbones if sinus-blocked), then press BL2 gently.',
      hi: 'साइनस होने पर हल्का गर्म तौलिया या आंखों की थकान में गुलाबजल पैड 3 मिनट रखकर BL2 हल्के से दबाएं।',
      mr: 'डोळ्यांच्या थकव्यावर गुलाबपाणी पट्टी ३ मिनिटे ठेवा (सायन्स असल्यास कोमट शेक) आणि BL2 हळुवार दाबा.',
    },
    caution: {
      en: 'Never press directly on the eyeballs; press only the inner brow bone notch.',
      hi: 'आंखों के गोलों पर बिल्कुल न दबाएं, केवल भौंह के अंदरूनी किनारे की हड्डी पर दबाएं।',
      mr: 'डोळ्यांवर थेट दाबू नका; फक्त भुवईच्या आतील हाडाच्या खळग्यात दाबा.',
    },
  },
  GV26: {
    category: 'emergency',
    title: {
      en: 'Recovery Airflow, Supine Foot-Raise & Immediate Medical Call',
      hi: 'ताजी हवा, पैर थोड़े ऊपर व तुरंत मेडिकल सहायता',
      mr: 'मोकळी हवा, पाय थोडे वर ठेवणे व तात्काळ वैद्यकीय मदत',
    },
    prepTime: { en: 'Instant', hi: 'तुरंत', mr: 'तात्काळ' },
    ingredients: {
      en: ['Flat safe floor surface', 'Cool face-mist cloth'],
      hi: ['समतल सुरक्षित जगह', 'माथे पर ठंडे पानी का स्पर्श'],
      mr: ['सपाट सुरक्षित जागा', 'चेहऱ्यावर थंड पाण्याचा शिडकाव'],
    },
    steps: {
      en: 'For sudden fainting/dizzy collapse, lay the person flat with legs slightly elevated (15–20 cm), assure open airway, call 108/112 if prolonged, and press GV26.',
      hi: 'चक्कर खाकर गिरने पर व्यक्ति को लिटाकर पैर हल्के ऊपर उठाएं, खुली हवा दें, 108/112 कॉल करें और नाक के नीचे GV26 दबाएं।',
      mr: 'भोवळ येऊन पडल्यास व्यक्तीला झोपवून पाय थोडे वर ठेवा, मोकळी हवा द्या, १०८/११२ ला कळवा आणि GV26 दाबा.',
    },
    caution: {
      en: 'Do not splash heavy water on an unconscious face or force liquids.',
      hi: 'बेहोश व्यक्ति के मुंह में पानी न डालें।',
      mr: 'बेशुद्ध व्यक्तीच्या तोंडात पाणी ओतू नका.',
    },
  },
  CV22: {
    category: 'steam',
    title: {
      en: 'Warm Clove-Honey Throat Soother + Humid Steam',
      hi: 'गुनगुना लौंग-शहद व भाप से गले को राहत',
      mr: 'कोमट लवंग-मध आणि वाफेने घशाला आराम',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm water (1 cup)', 'Honey (1 tsp) + Pinch of roasted turmeric', '1 clove or tulsi leaf'],
      hi: ['गुनगुना पानी (1 कप)', 'शहद (1 चम्मच)', 'चुटकी भुनी हल्दी'],
      mr: ['कोमट पाणी (१ कप)', 'मध (१ चमचा)', 'चिमूटभर भाजलेली हळद'],
    },
    steps: {
      en: 'Lick honey with a pinch of turmeric slowly or sip warm tulsi water to soothe dry throat tickle before gently touching CV22 downward.',
      hi: 'सूखी खांसी व गले की खराश के लिए चुटकी हल्दी-शहद धीरे से चाटें या तुलसी का गुनगुना पानी पिएं और CV22 पर बहुत हल्का स्पर्श करें।',
      mr: 'कोरडा खोकला व खवखव थांबवण्यासाठी चिमूटभर हळद-मध घ्या किंवा कोमट पाणी पिऊन CV22 वर अतिशय हलका स्पर्श करा.',
    },
    caution: {
      en: 'Never press inward toward the windpipe at CV22; skip honey for infants under 1.',
      hi: 'गले के गड्ढे CV22 को श्वासनली की ओर अंदर बिल्कुल न दबाएं।',
      mr: 'CV22 श्वासनलिकेकडे आत अजिबात दाबू नका; १ वर्षाखालील बाळाला मध देऊ नका.',
    },
  },
  CV17: {
    category: 'drink',
    title: {
      en: 'Warm Saffron/Tulsi Breath Drink + Pursed-Lip Deep Breathing',
      hi: 'तुलसी-इलायची गुनगुना पेय व गहरी धीमी सांस',
      mr: 'तुळस-वेलची कोमट पेय आणि दीर्घ श्वसन',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Warm water (1 cup)', 'Tulsi leaves (4–5)', 'Crushed cardamom (1)'],
      hi: ['गुनगुना पानी (1 कप)', 'तुलसी पत्ते (4-5)', 'कुटी इलायची (1)'],
      mr: ['कोमट पाणी (१ कप)', 'तुळशीची पाने (४-५)', 'वेलची (१)'],
    },
    steps: {
      en: 'Sip warm tulsi-cardamom water calmly, drop your shoulders, and rub CV17 softly up and down along the sternum while exhaling twice as long as inhaling.',
      hi: 'तुलसी-इलायची का गुनगुना पानी पीकर कंधे ढीले छोड़ें और लंबी सांस छोड़ते हुए छाती के मध्य CV17 पर हल्के से हाथ फेरें।',
      mr: 'तुळस-वेलचीचे कोमट पाणी पिऊन खांदे सैल सोडा आणि श्वास सोडताना छातीच्या मध्यावर CV17 हळुवार चोळा.',
    },
    caution: {
      en: 'For sudden severe chest pressure radiating to arm/jaw, call 108/112 immediately.',
      hi: 'यदि सीने का दर्द बांह या जबड़े तक जाए तो तुरंत 108/112 पर कॉल करें।',
      mr: 'छातीतील दुखणे हात किंवा जबड्याकडे जात असल्यास लगेच १०८/११२ वर कॉल करा.',
    },
  },
  CV12: {
    category: 'drink',
    title: {
      en: 'Jeera-Ajwain-Fennel Digestive Tea',
      hi: 'जीरा-अजवाइन-सौंफ पाचक पानी',
      mr: 'जिरे-ओवा-बडीशेप पाचक काढा',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Cumin seeds (½ tsp)', 'Fennel seeds (½ tsp)', 'Pinch of ajwain & black salt', 'Water (1.5 cups)'],
      hi: ['जीरा (½ चम्मच)', 'सौंफ (½ चम्मच)', 'चुटकी अजवाइन व काला नमक', 'पानी (1.5 कप)'],
      mr: ['जिरे (½ चमचा)', 'बडीशेप (½ चमचा)', 'चिमूटभर ओवा व काळे मीठ', 'पाणी (१.५ कप)'],
    },
    steps: {
      en: 'Boil jeera, fennel, and ajwain for 4 minutes, strain into a cup, add a pinch of black salt, and sip warm 30 minutes before or after pressing CV12.',
      hi: 'जीरा, सौंफ और अजवाइन 4 मिनट उबालकर छान लें, चुटकी काला नमक मिलाकर गुनगुना पिएं और CV12 पर हल्की गोल मालिश करें।',
      mr: 'जिरे, बडीशेप व ओवा ४ मिनिटे उकळून गाळा, थोडे काळे मीठ घालून कोमट प्या आणि CV12 वर हलका मसाज करा.',
    },
    caution: {
      en: 'Do not press CV12 deeply right after a heavy meal or during active stomach ulcer pain.',
      hi: 'भरपेट भोजन के तुरंत बाद या अल्सर दर्द में पेट पर गहरा दबाव न दें।',
      mr: 'भरपूर जेवणानंतर लगेच पोटावर दाब देऊ नका.',
    },
  },
  ST25: {
    category: 'diet',
    title: {
      en: 'Warm Water + Soaked Raisins / Buttermilk with Roasted Cumin',
      hi: 'गुनगुना पानी या भुना जीरा-छाछ (पेट व मल संतुलन)',
      mr: 'कोमट पाणी / भिजवलेले मनुके किंवा जिरे-ताक',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['1 glass lukewarm water (constipation) OR spiced buttermilk with roasted jeera (bloating/loose stool)'],
      hi: ['कब्ज में गुनगुना पानी व भीगे मुनक्के, या गैस में भुना जीरा छाछ'],
      mr: ['बद्धकोष्ठतेसाठी कोमट पाणी-मनुके, किंवा गॅससाठी जिरे घातलेले ताक'],
    },
    steps: {
      en: 'Drink 1 glass lukewarm water in the morning (or roasted-cumin buttermilk after lunch), then circle gently clockwise around navel points ST25.',
      hi: 'सुबह 1 गिलास गुनगुना पानी (या दोपहर में भुना जीरा छाछ) पिएं और नाभि के दोनों तरफ ST25 पर हल्का क्लॉकवाइज दबाव दें।',
      mr: 'सकाळी १ ग्लास कोमट पाणी (किंवा जेवणानंतर जिरे-ताक) घ्या आणि नाभीच्या दोन्ही बाजूस ST25 हलके दाबा.',
    },
    caution: {
      en: 'Avoid abdominal pressure during pregnancy or sharp appendicitis-like pain.',
      hi: 'गर्भावस्था या पेट के तेज दर्द में पेट के बिंदुओं को न दबाएं।',
      mr: 'गर्भावस्थेत किंवा पोटाच्या तीव्र वेदनेत पोटाचे बिंदू दाबू नका.',
    },
  },
  GV14: {
    category: 'compress',
    title: {
      en: 'Lukewarm Sponge Wipe (Fever) OR Warm Neck Bag (Spondylitis)',
      hi: 'बुखार में गुनगुने पानी की पट्टी / जकड़न में हल्की सिकाई',
      mr: 'तापात कोमट पाण्याची पट्टी / मान जखडल्यास सौम्य शेक',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Soft cotton cloth', 'Lukewarm tap water (fever) or warm dry towel (stiffness)', 'Turmeric-ginger milk at night'],
      hi: ['साफ सूती कपड़ा', 'गुनगुना पानी (बुखार में)', 'हल्दी दूध (अकड़न में)'],
      mr: ['स्वच्छ कापड', 'कोमट पाणी (तापात)', 'हळद दूध (मान दुखीमध्ये)'],
    },
    steps: {
      en: 'Sponge arms/forehead gently with lukewarm water for fever relief, or drape a warm towel over the upper neck before rotating GV14 anticlockwise.',
      hi: 'बुखार में गुनगुने पानी से स्पंज करें या गर्दन की जकड़न में हल्की सिकाई कर GV14 को एंटीक्लॉकवाइज दबाएं।',
      mr: 'ताप असल्यास कोमट पाण्याने पुसून काढा, मान जखडल्यास सौम्य शेक देऊन GV14 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'For neck fever with severe stiffness or confusion, seek prompt medical care.',
      hi: 'तेज बुखार के साथ गर्दन बहुत अकड़ जाए तो तुरंत डॉक्टर को दिखाएं।',
      mr: 'तापासोबत मान खूप आखडल्यास तात्काळ डॉक्टरांना दाखवा.',
    },
  },
  BL11: {
    category: 'diet',
    title: {
      en: 'Golden Turmeric Milk (Haldi Doodh) + Sesame Seeds for Bone Strength',
      hi: 'हल्दी दूध व भुने सफेद तिल (हड्डियों की मजबूती के लिए)',
      mr: 'हळद दूध आणि भाजलेले तीळ (हाडांच्या बळकटीसाठी)',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Warm milk or fortified soy milk (1 cup)', 'Turmeric (¼ tsp) + Pinch black pepper', 'Roasted sesame seeds (1 tsp)'],
      hi: ['गुनगुना दूध (1 कप)', 'हल्दी (¼ चम्मच) + चुटकी काली मिर्च', 'भुने सफेद तिल (1 चम्मच)'],
      mr: ['कोमट दूध (१ कप)', 'हळद (¼ चमचा) + चिमूटभर मिरी', 'भाजलेले पांढरे तीळ (१ चमचा)'],
    },
    steps: {
      en: 'Simmer turmeric and a pinch of black pepper in milk for 3 minutes, chew 1 tsp roasted sesame seeds daily, and gently press BL11 beside upper spine.',
      hi: 'दूध में हल्दी व चुटकी काली मिर्च 3 मिनट उबालकर पिएं, साथ में 1 चम्मच भुने तिल चबाएं और ऊपरी रीढ़ के पास BL11 हल्के दबाएं।',
      mr: 'दुधात हळद व चिमूटभर मिरी ३ मिनिटे उकळून प्या, १ चमचा तीळ चावून खा आणि पाठीच्या वर BL11 हळुवार दाबा.',
    },
    caution: {
      en: 'Pair with morning sunlight (15 min) for Vitamin D absorption.',
      hi: 'हड्डियों के बेहतर लाभ के लिए रोज सुबह 15 मिनट हल्की धूप लें।',
      mr: 'हाडांच्या आरोग्यासाठी रोज सकाळी १५ मिनिटे कोवळे ऊन घ्या.',
    },
  },
  BL12: {
    category: 'drink',
    title: {
      en: 'Warm Ginger-Black Pepper Rasam / Decoction + Chest Warmth',
      hi: 'अदरक-काली मिर्च का गरम काढ़ा व पीठ को गर्म रखना',
      mr: 'आले-मिरी-लसूण उष्ण सूप किंवा काढा + पाठीला उबदारपणा',
    },
    prepTime: { en: '5 min', hi: '5 मिनट', mr: '५ मिनिटे' },
    ingredients: {
      en: ['Fresh ginger (½ tsp)', 'Crushed garlic/pepper (2 cloves)', 'Tulsi & warm water (1 cup)'],
      hi: ['अदरक (½ चम्मच)', 'काली मिर्च (3)', 'तुलसी व गरम पानी (1 कप)'],
      mr: ['आले (½ चमचा)', 'काळी मिरी (३)', 'तुळस व गरम पाणी (१ कप)'],
    },
    steps: {
      en: 'Keep upper back covered from cold drafts, drink warm ginger-pepper broth or tea, and rub BL12 in warm circular motions.',
      hi: 'ऊपरी पीठ को ठंडी हवा से बचाकर गरम अदरक-काली मिर्च सूप या चाय पिएं और BL12 पर गोल गर्माहट मालिश करें।',
      mr: 'पाठीचा वरचा भाग उबदार ठेवून गरम आले-मिरी पेय घ्या आणि BL12 वर गोलाकार मालिश करा.',
    },
    caution: {
      en: 'Consult a physician if cough persists beyond 2 weeks or with high fever.',
      hi: '2 सप्ताह से अधिक खांसी या तेज बुखार रहने पर डॉक्टर से सलाह लें।',
      mr: '२ आठवड्यांहून अधिक खोकला किंवा जास्त ताप असल्यास डॉक्टरांचा सल्ला घ्या.',
    },
  },
  GB21: {
    category: 'balm',
    title: {
      en: 'Warm Til/Nilgiri Oil Shoulder Roll & Heat Pack',
      hi: 'तिल के तेल की कंधे पर मालिश व गर्म सिकाई',
      mr: 'कोमट तीळ तेलाची खांद्यावर मालिश व शेक',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm sesame oil (1 tbsp)', 'Heating pad or hot water bottle wrapped in towel'],
      hi: ['गुनगुना तिल का तेल (1 बड़ा चम्मच)', 'सिकाई की बोतल / तौलिया'],
      mr: ['कोमट तीळ तेल (१ मोठा चमचा)', 'गरम पाण्याची पिशवी / टॉवेल'],
    },
    steps: {
      en: 'Rub warm sesame oil across the upper trapezius muscle ridge, rest a warm water bottle for 5 minutes, roll shoulders slowly, and press GB21.',
      hi: 'कंधे की ऊपरी नसों पर गुनगुना तिल तेल लगाकर 5 मिनट सिकाई करें, कंधे गोल घुमाएं और GB21 दबाएं।',
      mr: 'खांद्याच्या वरच्या स्नायूंवर कोमट तीळ तेल लावून ५ मिनिटे शेक घ्या, खांदे गोल फिरवा आणि GB21 दाबा.',
    },
    caution: {
      en: 'Avoid GB21 stimulation during pregnancy.',
      hi: 'गर्भावस्था में GB21 बिंदु बिल्कुल न दबाएं।',
      mr: 'गर्भावस्थेत GB21 बिंदू अजिबात दाबू नका.',
    },
  },
  LI15: {
    category: 'compress',
    title: {
      en: 'Alternating Warm Sesame Massage & Shoulder Pendulum Swing',
      hi: 'गुनगुने तेल की मालिश व हल्का कंधा झुलाना',
      mr: 'कोमट तेलाची मालिश आणि हात हलका झुलवणे',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm sesame/castor oil (1 tbsp)', 'Warm moist compress'],
      hi: ['गुनगुना तिल या अरंडी तेल (1 चम्मच)', 'गर्म पट्टी'],
      mr: ['कोमट तीळ किंवा एरंडेल तेल (१ चमचा)', 'गरम ओला टॉवेल'],
    },
    steps: {
      en: 'Warm the shoulder capsule with a moist hot towel for 4 minutes, coat with warm oil, swing the arm softly like a pendulum, and press LI15.',
      hi: 'कंधे के जोड़ पर 4 मिनट गर्म गीला तौलिया रखकर तेल लगाएं, हाथ को हल्के झुलाएं और कंधे के गड्ढे LI15 को दबाएं।',
      mr: 'खांद्यावर ४ मिनिटे गरम ओला टॉवेल ठेवून तेल लावा, हात पेंडुलमसारखा झुलवा आणि LI15 दाबा.',
    },
    caution: {
      en: 'Stop arm swings if you feel sharp stabbing pain inside the shoulder joint.',
      hi: 'कंधे के भीतर चुभने वाला तेज दर्द हो तो घुमाना रोक दें।',
      mr: 'खांद्यात तीव्र वेदना जाणवल्यास हात फिरवणे थांबवा.',
    },
  },
  TW14: {
    category: 'balm',
    title: {
      en: 'Methi-Garlic Infused Warm Oil Posterior Shoulder Rub',
      hi: 'मेथी-लहसुन पके गुनगुने तेल से कंधे के पीछे मालिश',
      mr: 'मेथी-लसूण उकळलेल्या कोमट तेलाने खांद्यामागे मालिश',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Mustard or sesame oil (2 tbsp)', 'Fenugreek/methi seeds (½ tsp)', '2 garlic cloves (warmed & strained)'],
      hi: ['सरसों या तिल तेल (2 चम्मच)', 'मेथी दाना (½ चम्मच)', '2 लहसुन कलियां'],
      mr: ['मोहरी किंवा तीळ तेल (२ चमचे)', 'मेथी दाणे (½ चमचा)', 'लसणाच्या २ पाकळ्या'],
    },
    steps: {
      en: 'Warm methi and garlic in oil until fragrant, let cool to comfortably lukewarm, rub into back of shoulder, and press TW14 for 1–2 minutes.',
      hi: 'तेल में मेथी-लहसुन हल्का गर्म कर गुनगुना होने पर छान लें और कंधे के पीछे लगाकर TW14 दबाएं।',
      mr: 'तेलात मेथी-लसूण गरम करून कोमट झाल्यावर गाळा आणि खांद्यामागे मालिश करून TW14 दाबा.',
    },
    caution: {
      en: 'Always cool herbal oils to skin-safe lukewarm temperature before applying.',
      hi: 'हमेशा गुनगुना तेल ही लगाएं, अधिक गर्म तेल से जलन हो सकती है।',
      mr: 'तेल नेहमी कोमट झाल्यावरच लावा, जास्त गरम लावू नका.',
    },
  },
  SI11: {
    category: 'compress',
    title: {
      en: 'Warm Castor-Oil Compress & Wall Tennis-Ball Release',
      hi: 'अरंडी तेल की सिकाई व दीवार के सहारे बॉल रिलैक्सेशन',
      mr: 'एरंडेल तेल शेक आणि भिंतीजवळ बॉल प्रेशर',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Castor or sesame oil (1 tsp)', 'Warm cloth pad', 'Soft tennis ball'],
      hi: ['अरंडी या तिल तेल (1 चम्मच)', 'गर्म कपड़ा', 'नरम टेनिस बॉल'],
      mr: ['एरंडेल किंवा तीळ तेल (१ चमचा)', 'गरम कापड', 'मऊ टेनिस बॉल'],
    },
    steps: {
      en: 'Massage a few drops of warm oil over the shoulder blade, apply a warm cloth for 3 minutes, then lean gently against a tennis ball on SI11.',
      hi: 'कंधे की हड्डी पर हल्का तेल व गर्म पट्टी रखकर 3 मिनट सिकाई करें, फिर दीवार के सहारे टेनिस बॉल से SI11 दबाएं।',
      mr: 'खांद्याच्या पाठीमागे तेल व गरम पट्टी लावून ३ मिनिटे शेक द्या, नंतर टेनिस बॉलने SI11 दाबा.',
    },
    caution: {
      en: 'Do not roll over spinal vertebrae directly; stay on shoulder blade muscle.',
      hi: 'रीढ़ की हड्डी के बीच में बॉल न चलाएं, केवल कंधे की मांसपेशी पर रखें।',
      mr: 'बॉल थेट पाठीच्या मणक्यांवर ठेवू नका; फक्त खांद्याच्या स्नायूवर ठेवा.',
    },
  },
  LU1: {
    category: 'steam',
    title: {
      en: 'Warm Ginger-Honey Vapor + Chest Expansion Breath',
      hi: 'गरम पानी की भाप व गहरी श्वास (फेफड़ों के लिए)',
      mr: 'गरम पाण्याची वाफ व छाती फुलवणारा दीर्घ श्वास',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm steam bowl (plain or 2 tulsi leaves)', 'Warm water to sip (1 glass)'],
      hi: ['गरम पानी का कटोरा (तुलसी पत्तों के साथ)', 'पीने के लिए गुनगुना पानी'],
      mr: ['वाफेसाठी गरम पाणी (तुळशीच्या पानांसह)', 'पिण्यासाठी कोमट पाणी'],
    },
    steps: {
      en: 'Breathe moist steam deeply for 3 minutes, drink a glass of warm water to thin mucus, then press LU1 lightly under the outer collarbone.',
      hi: '3 मिनट गहरी भाप लेकर 1 गिलास गुनगुना पानी पिएं ताकि कफ ढीला हो, फिर कॉलरबोन के नीचे LU1 हल्के से दबाएं।',
      mr: '३ मिनिटे वाफ घेऊन १ ग्लास कोमट पाणी प्या म्हणजे कफ मोकळा होईल, नंतर LU1 हळुवार दाबा.',
    },
    caution: {
      en: 'Seek emergency care immediately if experiencing severe wheezing or blue lips.',
      hi: 'तेज सांस फूलने या होंठ नीले पड़ने पर तुरंत अस्पताल जाएं।',
      mr: 'खूप दम लागल्यास किंवा ओठ निळे पडल्यास तात्काळ रुग्णालयात जा.',
    },
  },
  LI11: {
    category: 'compress',
    title: {
      en: 'Cooling Coriander-Fennel Infusion + Elbow Cool-Down Wipe',
      hi: 'धनिया-सौंफ का ठंडा पेय व कोहनी पर ठंडा स्पंज',
      mr: 'धणे-बडीशेप थंड पेय आणि कोपरावर थंड पट्टी',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Crushed coriander seeds (1 tsp)', 'Fennel (½ tsp)', 'Cool water (1 glass)'],
      hi: ['कुटा साबुत धनिया (1 चम्मच)', 'सौंफ (½ चम्मच)', 'ताजा पानी (1 गिलास)'],
      mr: ['ठेचलेले धणे (१ चमचा)', 'बडीशेप (½ चमचा)', 'ताजे पाणी (१ ग्लास)'],
    },
    steps: {
      en: 'Drink strained coriander-fennel soaked water to cool internal heat, skin itching, and high BP spikes while pressing LI11 at the elbow crease.',
      hi: 'शरीर की गर्मी, खुजली व हाई बीपी शांत करने के लिए धनिया-सौंफ का पानी पिएं और कोहनी के बाहर LI11 दबाएं।',
      mr: 'शरीरातील उष्णता, खाज व रक्तदाब शांत ठेवण्यासाठी धणे-बडीशेपचे पाणी प्या आणि कोपरावर LI11 दाबा.',
    },
    caution: {
      en: 'Keep cooling herbs mild if recovering from chills or low blood pressure.',
      hi: 'ठंड लगने या लो बीपी की स्थिति में ठंडे पेय कम लें।',
      mr: 'कमी रक्तदाब किंवा थंडी वाजत असल्यास थंड पेये टाळा.',
    },
  },
  BL21: {
    category: 'drink',
    title: {
      en: 'Fennel-Ginger Warm Infusion + Upright Posture After Meals',
      hi: 'सौंफ-अदरक पानी व भोजन के बाद सीधा बैठना',
      mr: 'बडीशेप-आले कोमट पेय आणि जेवणानंतर ताठ बसणे',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Fennel seeds (1 tsp)', 'Thin ginger slice (2)', 'Warm water (1 cup)'],
      hi: ['सौंफ (1 चम्मच)', 'अदरक (2 पतले टुकड़े)', 'गर्म पानी (1 कप)'],
      mr: ['बडीशेप (१ चमचा)', 'आल्याचे पातळ काप (२)', 'कोमट पाणी (१ कप)'],
    },
    steps: {
      en: 'Sip warm fennel-ginger tea after light meals and avoid slouching at desks to calm mid-back stomach tension alongside BL21 rotation.',
      hi: 'हल्के भोजन के बाद सौंफ-अदरक का गुनगुना पानी पिएं और कमर सीधी रखकर पीठ पर BL21 को एंटीक्लॉकवाइज दबाएं।',
      mr: 'हलक्या जेवणानंतर बडीशेप-आले पाणी प्या आणि पाठ ताठ ठेवून BL21 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Avoid lying flat immediately after meals if suffering from reflux.',
      hi: 'एसिडिटी होने पर खाने के तुरंत बाद लेटें नहीं।',
      mr: 'अ‍ॅसिडिटीचा त्रास असल्यास जेवणानंतर लगेच झोपू नका.',
    },
  },
  BL23: {
    category: 'compress',
    title: {
      en: 'Warm Castor-Sesame Lumbar Pack + Warm Hydration',
      hi: 'गुनगुने तेल से कमर पर सिकाई व गुनगुना पानी',
      mr: 'कोमट एरंडेल-तीळ तेलाने कंबरेचा शेक व पाणी',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm sesame oil (1 tbsp)', 'Hot water bag / warm dry towel', 'Warm water (1 glass)'],
      hi: ['गुनगुना तिल का तेल (1 चम्मच)', 'गर्म पानी की बोतल / तौलिया', 'गुनगुना पानी'],
      mr: ['कोमट तीळ तेल (१ चमचा)', 'गरम पाण्याची पिशवी', 'कोमट पाणी'],
    },
    steps: {
      en: 'Apply warm sesame oil across the lower back waist, warm gently with a towel-wrapped hot bottle for 5 minutes, then rotate BL23 Clockwise.',
      hi: 'कमर के दोनों तरफ गुनगुना तिल तेल लगाकर 5 मिनट सिकाई करें, फिर रीढ़ के पास BL23 को क्लॉकवाइज दबाएं।',
      mr: 'कंबरेवर कोमट तीळ तेल लावून ५ मिनिटे गरम शेक घ्या आणि नंतर पाठीच्या बाजूला BL23 क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Seek prompt evaluation for slip disc weakness, numbness, or kidney fever.',
      hi: 'पैरों में सुन्नता या बुखार के साथ कमर दर्द हो तो तुरंत डॉक्टर को दिखाएं।',
      mr: 'पायात मुंग्या/बधिरपणा किंवा तापासोबत कंबर दुखल्यास डॉक्टरांना भेटा.',
    },
  },
  GV3: {
    category: 'compress',
    title: {
      en: 'Warm Epsom Salt Back Soak / Moist Towel + Anti-Inflammatory Turmeric Tea',
      hi: 'कमर पर गर्म सेंक व हल्दी-अदरक चाय',
      mr: 'कंबरेला उबदार शेक आणि हळद-आले काढा',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Turmeric (¼ tsp) + Crushed ginger in warm water', 'Warm damp towel or heating pad'],
      hi: ['हल्दी (¼ चम्मच) + अदरक का गर्म पानी', 'गर्म गीला तौलिया'],
      mr: ['हळद (¼ चमचा) + आल्याचे कोमट पाणी', 'गरम ओला टॉवेल'],
    },
    steps: {
      en: 'Drink warm turmeric-ginger water to ease lower spinal stiffness, apply a moist warm towel across L4-L5, and press GV3 anticlockwise.',
      hi: 'कमर के निचले हिस्से L4-L5 की जकड़न में हल्दी-अदरक पानी पीकर गर्म गीले तौलिये से सिकाई करें और GV3 दबाएं।',
      mr: 'कंबरेतील ताठरपणा कमी करण्यासाठी हळद-आले पाणी प्या, L4-L5 वर गरम शेक देऊन GV3 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Avoid deep twisting stretches if L4–L5 / L5–S1 disc bulge is acute.',
      hi: 'स्लिप डिस्क दर्द तेज हो तो कमर को झटके से न मोड़ें।',
      mr: 'तीव्र स्लिप डिस्क असल्यास कंबर जोरात वळवू नका.',
    },
  },
  GB30: {
    category: 'balm',
    title: {
      en: 'Warm Mahanarayan / Sesame Oil Hip Massage + Piriformis Stretch',
      hi: 'कूल्हे पर गुनगुने तेल की मालिश व हल्का स्ट्रेच',
      mr: 'खुब्यावर कोमट तेलाची मालिश व सौम्य स्ट्रेच',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm sesame oil (1 tbsp)', 'Warm heating pad'],
      hi: ['गुनगुना तिल या महानारायण तेल (1 चम्मच)', 'सिकाई पैड'],
      mr: ['कोमट तीळ किंवा महानारायण तेल (१ चमचा)', 'गरम शेक पिशवी'],
    },
    steps: {
      en: 'Massage warm sesame oil deeply around the outer hip dimple, warm with a heating pad for 5 minutes to relax the sciatic nerve path, then press GB30.',
      hi: 'कूल्हे के बाहरी गड्ढे पर गुनगुना तेल लगाकर 5 मिनट सिकाई करें ताकि सियाटिक नस शांत हो, फिर GB30 दबाएं।',
      mr: 'खुब्याच्या बाहेरील बाजूला कोमट तेल लावून ५ मिनिटे शेक द्या, ज्यामुळे सायटिका नस मोकळी होईल, नंतर GB30 दाबा.',
    },
    caution: {
      en: 'Avoid sitting long hours on a hard wallet or hard bench.',
      hi: 'कठोर सतह पर या जेब में भारी पर्स रखकर लंबे समय तक न बैठें।',
      mr: 'कठीण जागेवर किंवा खिशात जड पाकीट ठेवून जास्त वेळ बसू नका.',
    },
  },
  BL54: {
    category: 'compress',
    title: {
      en: 'Warm Knee-Back Wrap & Overnight Methi Seed Water',
      hi: 'घुटने के पीछे हल्की सिकाई व रात भर भीगी मेथी का पानी',
      mr: 'गुडघ्यामागे हलका शेक व रात्री भिजवलेल्या मेथीचे पाणी',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Fenugreek/methi seeds (1 tsp, soaked overnight)', 'Warm moist cloth'],
      hi: ['मेथी दाना (1 चम्मच, रात का भीगा)', 'गुनगुना गीला कपड़ा'],
      mr: ['मेथी दाणे (१ चमचा, रात्रभर भिजवलेले)', 'कोमट ओले कापड'],
    },
    steps: {
      en: 'Drink soaked methi water on an empty stomach for joint/fluid balance, drape a warm cloth behind the knee briefly, and rotate BL54 gently.',
      hi: 'जोड़ों की सूजन व पानी भरने में भीगी मेथी का पानी पिएं, घुटने के पीछे हल्की सिकाई कर BL54 को हल्के से दबाएं।',
      mr: 'सांध्यांच्या सुजेसाठी भिजवलेल्या मेथीचे पाणी प्या, गुडघ्यामागे कोमट कापड ठेवून BL54 हळुवार दाबा.',
    },
    caution: {
      en: 'Never press aggressively behind the knee crease; keep pressure gentle (2/5).',
      hi: 'घुटने के पीछे के गड्ढे में कभी जोर से न दबाएं, हमेशा हल्का दबाव रखें।',
      mr: 'गुडघ्यामागील खळग्यात कधीही जोरात दाबू नका; नेहमी सौम्य दाब ठेवा.',
    },
  },
  ST36: {
    category: 'diet',
    title: {
      en: 'Warm Ginger-Cinnamon Tonic + Overnight Soaked Fenugreek Water',
      hi: 'गुनगुना अदरक-दालचीनी व भीगी मेथी का टॉनिक',
      mr: 'आले-दालचिनी पेय व भिजवलेल्या मेथीचे टॉनिक',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Pinch of cinnamon or crushed ginger', 'Soaked fenugreek/methi seeds (1 tsp)', 'Warm water (1 cup)'],
      hi: ['चुटकी दालचीनी या अदरक', 'भीगी मेथी (1 चम्मच)', 'गुनगुना पानी (1 कप)'],
      mr: ['चिमूटभर दालचिनी किंवा आले', 'भिजवलेली मेथी (१ चमचा)', 'कोमट पाणी (१ कप)'],
    },
    steps: {
      en: 'Drink warm cinnamon-fenugreek water to support blood sugar, digestion, and energy while rotating ST36 Clockwise on both shins.',
      hi: 'पाचन, शुगर संतुलन व ऊर्जा के लिए मेथी-दालचीनी का गुनगुना पानी पिएं और दोनों पैरों में ST36 क्लॉकवाइज दबाएं।',
      mr: 'पचन, साखर नियंत्रण व ताकदीसाठी मेथी-दालचिनी कोमट पाणी प्या आणि दोन्ही पायांवर ST36 क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Monitor blood glucose regularly if pairing diet remedies with diabetes medication.',
      hi: 'डायबिटीज की दवा के साथ शुगर स्तर की नियमित जांच करते रहें।',
      mr: 'मधुमेहाच्या औषधांसोबत साखरेची पातळी नियमित तपासत रहा.',
    },
  },
  SP10: {
    category: 'diet',
    title: {
      en: 'Soaked Methi & Amla Juice + Warm Olive/Sesame Knee Rub',
      hi: 'आंवला-मेथी टॉनिक व घुटने के ऊपर गुनगुने तेल की मालिश',
      mr: 'आवळा-मेथी टॉनिक आणि गुडघ्यावरील स्नायूंची तेल मालिश',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Amla juice (1–2 tbsp in water) OR turmeric milk', 'Warm sesame oil for thigh/knee rub'],
      hi: ['आंवला रस (1-2 चम्मच पानी में)', 'गुनगुना तिल का तेल'],
      mr: ['आवळा रस (१-२ चमचे पाण्यात)', 'कोमट तीळ तेल'],
    },
    steps: {
      en: 'Take diluted amla or turmeric milk for healthy circulation and blood sugar support, massage warm sesame oil above the inner kneecap, and rotate SP10 anticlockwise.',
      hi: 'रक्त संचार और शुगर नियंत्रण हेतु आंवला या हल्दी दूध लें, घुटने के ऊपर तिल का तेल लगाकर SP10 एंटीक्लॉकवाइज दबाएं।',
      mr: 'रक्ताभिसरण व साखरेसाठी आवळा पाणी किंवा हळद दूध घ्या, गुडघ्यावर कोमट तेल लावून SP10 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Do not knead directly over an acutely swollen warm knee joint.',
      hi: 'यदि घुटने में तेज गर्म सूजन हो तो सीधे जोड़ पर रगड़ें नहीं।',
      mr: 'गुडघ्यावर तीव्र गरम सूज असल्यास थेट जोराने चोळू नका.',
    },
  },
  SP9: {
    category: 'drink',
    title: {
      en: 'Barley (Jau) or Coriander Water for Knee & Leg Swelling',
      hi: 'जौ या धनिये का पानी (घुटने व पैर की सूजन के लिए)',
      mr: 'सातू (जव) किंवा धण्याचे पाणी (गुडघा व पायांवरील सूज)',
    },
    prepTime: { en: '5 min', hi: '5 मिनट', mr: '५ मिनिटे' },
    ingredients: {
      en: ['Crushed coriander seeds or barley (1 tbsp)', 'Water (2 cups)', 'Pinch of dry ginger'],
      hi: ['कुटा धनिया या जौ (1 चम्मच)', 'पानी (2 कप)', 'चुटकी सोंठ'],
      mr: ['ठेचलेले धणे किंवा जव (१ चमचा)', 'पाणी (२ कप)', 'चिमूटभर सुंठ'],
    },
    steps: {
      en: 'Simmer coriander or barley in water for 5 minutes, strain and sip across the morning to drain damp knee water retention, then rotate SP9 gently.',
      hi: 'धनिया या जौ उबालकर छान लें और सुबह पिएं ताकि घुटने व पैरों की सूजन (पानी) कम हो, फिर SP9 को हल्के से दबाएं।',
      mr: 'धणे किंवा जव उकळून गाळलेले पाणी सकाळी प्या म्हणजे गुडघ्याची सूज/पाणी कमी होईल, नंतर SP9 हळुवार दाबा.',
    },
    caution: {
      en: 'Keep legs slightly elevated on a pillow if ankle/knee swelling is visible.',
      hi: 'पैरों में सूजन दिखने पर आराम करते समय पैरों के नीचे तकिया रखें।',
      mr: 'पायावर सूज असल्यास झोपताना पायाखाली उशी ठेवा.',
    },
  },
  LV8: {
    category: 'balm',
    title: {
      en: 'Flaxseed/Sesame Joint Lubrication + Inner-Knee Warm Oil',
      hi: 'अलसी-तिल बीज सेवन व घुटने के अंदर हल्के तेल की मालिश',
      mr: 'जवस (अळशी) पावडर व गुडघ्याच्या आतील बाजूला तेल मालिश',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['Roasted flaxseed/alsi powder (1 tsp)', 'Warm sesame oil (1 tsp)'],
      hi: ['भुना अलसी चूर्ण (1 चम्मच)', 'गुनगुना तिल का तेल'],
      mr: ['भाजलेली जवस (अळशी) पूड (१ चमचा)', 'कोमट तीळ तेल'],
    },
    steps: {
      en: 'Take 1 tsp roasted flaxseed powder with water for cartilage & ligament nourishment, massage warm sesame oil gently around the inner knee crease, and rotate LV8 Clockwise.',
      hi: 'कार्टिलेज व लिगामेंट पोषण के लिए 1 चम्मच भुनी अलसी खाएं, घुटने के अंदर तेल लगाकर LV8 क्लॉकवाइज दबाएं।',
      mr: 'कार्टिलेज व लिगामेंट बळकटीसाठी १ चमचा जवस खा, गुडघ्याच्या आतील बाजूला तेल लावून LV8 क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Drink plenty of water when eating flaxseed powder.',
      hi: 'अलसी लेने पर दिन भर पर्याप्त पानी पिएं।',
      mr: 'जवस खाल्ल्यावर दिवसभरात भरपूर पाणी प्या.',
    },
  },
  ST35: {
    category: 'compress',
    title: {
      en: 'Warm Turmeric-Besan / Mustard Poultice Around Kneecap + Straight-Leg Raises',
      hi: 'कटोरी के चारों ओर गुनगुनी हल्दी-सरसों पट्टी व सीधे पैर उठाना',
      mr: 'वाटीभोवती कोमट हळद-तेल पट्टी व सरळ पाय उचलणे',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Turmeric (½ tsp) mixed in warm sesame oil (1 tbsp)', 'Warm cotton wrap'],
      hi: ['हल्दी (½ चम्मच) + गुनगुना तिल तेल (1 चम्मच)', 'सूती पट्टी'],
      mr: ['हळद (½ चमचा) + कोमट तीळ तेल (१ चमचा)', 'सुती पट्टी'],
    },
    steps: {
      en: 'Spread a warm turmeric-oil paste gently around (not grinding) the kneecap for 5 minutes, wipe clean, and rotate both ST35 knee eyes anticlockwise.',
      hi: 'हल्दी व गुनगुने तेल का लेप घुटने की कटोरी के चारों ओर लगाकर 5 मिनट आराम करें, फिर दोनों ST35 बिंदु एंटीक्लॉकवाइज दबाएं।',
      mr: 'हळद-कोमट तेलाचा लेप गुडघ्याच्या वाटीभोवती लावून ५ मिनिटे विश्रांती घ्या आणि ST35 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Avoid deep squats or sitting cross-legged if kneecap grating hurts.',
      hi: 'घुटने में आवाज या तेज दर्द होने पर उकड़ूं या पालथी मारकर न बैठें।',
      mr: 'गुडघ्यात कटकट किंवा दुखणे असल्यास मांडी घालून बसणे टाळा.',
    },
  },
  GB34: {
    category: 'balm',
    title: {
      en: 'Warm Epsom Salt Soak + Nutmeg-Sesame Tendon Rub',
      hi: 'सेंधा/एप्सम नमक सेंक व नसों पर गुनगुने तेल की मालिश',
      mr: 'कोमट मीठ पाण्याचा शेक आणि स्नायू-नसांवर तेल मालिश',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Epsom salt or rock salt (2 tbsp) in warm water', 'Warm sesame oil with a pinch of ginger powder'],
      hi: ['एप्सम या सेंधा नमक (2 चम्मच) गर्म पानी में', 'गुनगुना तिल तेल'],
      mr: ['एप्सम किंवा सैंधव मीठ (२ चमचे) गरम पाण्यात', 'कोमट तीळ तेल'],
    },
    steps: {
      en: 'Soak or sponge the lower leg with warm salted water to melt tendon/ligament tightness, dry well, and press GB34 deep-firmly anticlockwise.',
      hi: 'पिंडली व लिगामेंट के खिंचाव में गर्म नमक पानी से सेंक या स्पंज करें और फिर घुटने के नीचे बाहर GB34 को गहरा दबाएं।',
      mr: 'स्नायू व लिगामेंटच्या ताणासाठी गरम मीठ पाण्याने शेक द्या आणि नंतर गुडघ्याखाली बाहेरील बाजूला GB34 अँटीक्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Keep water pleasantly warm if diabetic neuropathy reduces foot sensation.',
      hi: 'डायबिटीज में पैरों की संवेदना कम हो तो पानी का तापमान ध्यान से जांचें।',
      mr: 'मधुमेह असल्यास पायाला भाजणार नाही इतकेच कोमट पाणी वापरा.',
    },
  },
  BL57: {
    category: 'diet',
    title: {
      en: 'Warm Magnesium-Rich Banana/Almond Snack + Warm Calf Oil Stretch',
      hi: 'केला/भीगे बादाम (क्रैम्प्स के लिए) व पिंडली की ऊपर की ओर मालिश',
      mr: 'केळे / भिजवलेले बदाम आणि पोटरीवर खालून वर तेल मालिश',
    },
    prepTime: { en: '2 min', hi: '2 मिनट', mr: '२ मिनिटे' },
    ingredients: {
      en: ['1 ripe banana or 5 soaked almonds', 'Glass of water', 'Warm mustard/sesame oil'],
      hi: ['1 पका केला या 5 भीगे बादाम', '1 गिलास पानी', 'गुनगुना सरसों/तिल तेल'],
      mr: ['१ केळे किंवा ५ भिजवलेले बदाम', '१ ग्लास पाणी', 'कोमट मोहरी/तीळ तेल'],
    },
    steps: {
      en: 'Replenish potassium/magnesium with water and soaked almonds or banana, stroke warm oil upward from ankle toward calf, and press BL57.',
      hi: 'पानी के साथ भीगे बादाम या केला लें, एड़ी से पिंडली की तरफ ऊपर की ओर तेल लगाएं और बीच में BL57 दबाएं।',
      mr: 'पाण्यासोबत भिजवलेले बदाम किंवा केळे खा, टाचेकडून पोटरीकडे वरच्या दिशेने तेल लावा आणि BL57 दाबा.',
    },
    caution: {
      en: 'Seek medical check urgently if one calf becomes acutely red, hot, and swollen.',
      hi: 'यदि एक पिंडली अचानक लाल, गर्म और सूजी हुई दिखे तो तुरंत डॉक्टर को दिखाएं।',
      mr: 'एका पायाची पोटरी अचानक लाल, गरम आणि सुजलेली दिसल्यास त्वरित डॉक्टरांना दाखवा.',
    },
  },
  SP6: {
    category: 'drink',
    title: {
      en: 'Warm Jeera-Shatavari / Soaked Methi & Chamomile Evening Cup',
      hi: 'गुनगुना जीरा-सौंफ या कैमोमाइल पानी (हार्मोन व नींद संतुलन)',
      mr: 'कोमट जिरे-बडीशेप किंवा सुंठ-गुळ पाणी (संतुलन व शांत झोप)',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Roasted cumin & fennel (½ tsp each)', 'Warm water (1 cup)', '4–5 soaked almonds'],
      hi: ['जीरा व सौंफ (½ चम्मच प्रत्येक)', 'गुनगुना पानी (1 कप)', '4-5 भीगे बादाम'],
      mr: ['जिरे व बडीशेप (अर्धा चमचा)', 'कोमट पाणी (१ कप)', '४-५ भिजवलेले बदाम'],
    },
    steps: {
      en: 'Sip warm fennel-cumin tea in the evening to ease pelvic cramps, blood sugar, and insomnia while holding SP6 gently above the inner ankle.',
      hi: 'शाम को जीरा-सौंफ का गुनगुना पानी पिएं और टखने से 4 उंगली ऊपर अंदर की तरफ SP6 हल्के से दबाएं।',
      mr: 'संध्याकाळी जिरे-बडीशेपचे कोमट पाणी प्या आणि घोट्याच्या वर आतल्या बाजूला SP6 हळुवार दाबा.',
    },
    caution: {
      en: 'Strictly avoid pressing SP6 during pregnancy.',
      hi: 'गर्भावस्था में SP6 बिंदु दबाना पूरी तरह वर्जित है।',
      mr: 'गर्भावस्थेत SP6 बिंदू दाबणे पूर्णपणे टाळा.',
    },
  },
  GB39: {
    category: 'diet',
    title: {
      en: 'Ragi (Nachni) / Sesame Calcium Porridge + Warm Ankle Massage',
      hi: 'रागी (मडुआ) या तिल दूध व टखने पर गुनगुने तेल की मालिश',
      mr: 'नाचणी (रागी) सत्व किंवा दूध + घोट्यावर तेल मालिश',
    },
    prepTime: { en: '5 min', hi: '5 मिनट', mr: '५ मिनिटे' },
    ingredients: {
      en: ['Ragi/Nachni flour (1 tbsp) or sesame seeds', 'Warm water/milk', 'Pinch of cardamom'],
      hi: ['रागी (नाचनी) आटा (1 चम्मच)', 'गर्म दूध/पानी', 'चुटकी इलायची'],
      mr: ['नाचणी पीठ (१ चमचा)', 'कोमट दूध/पाणी', 'चिमूटभर वेलची'],
    },
    steps: {
      en: 'Prepare a light warm ragi drink with cardamom to nourish bone marrow and strengthen fragile ankles/knees, then massage GB39 gently.',
      hi: 'हड्डियों व टखनों की मजबूती के लिए हल्की रागी पेय लें और बाहरी टखने के ऊपर GB39 पर गोलाकार मालिश करें।',
      mr: 'हाडांच्या बळकटीसाठी कोमट नाचणी सत्व घ्या आणि बाहेरील घोट्याच्या वर GB39 वर हळुवार मालिश करा.',
    },
    caution: {
      en: 'Wear supportive footwear on uneven surfaces.',
      hi: 'असमान जमीन पर चलते समय मजबूत सहारे वाले जूते पहनें।',
      mr: 'खडबडीत जागेवर चालताना चांगली पकड असलेली पादत्राणे वापरा.',
    },
  },
  KI3: {
    category: 'compress',
    title: {
      en: 'Warm Saltwater Foot Soak + Warm Black-Sesame Nourishing Water',
      hi: 'गुनगुने नमक पानी में पैर डुबोना व हल्का गुनगुना पानी पीना',
      mr: 'कोमट मीठ पाण्यात पाय ठेवणे व कोमट पाणी पिणे',
    },
    prepTime: { en: '5 min', hi: '5 मिनट', mr: '५ मिनिटे' },
    ingredients: {
      en: ['Bucket of warm water', 'Rock salt (2 tbsp)', '2–3 soaked dates/raisins or black sesame'],
      hi: ['बाल्टी में गुनगुना पानी', 'सेंधा नमक (2 चम्मच)', 'भीगे मुनक्के/तिल'],
      mr: ['बादलीत कोमट पाणी', 'सैंधव मीठ (२ चमचे)', 'भिजवलेले मनुके / काळे तीळ'],
    },
    steps: {
      en: 'Soak both ankles and feet in warm salt water for 10 minutes before bedtime, towel dry, rub a drop of sesame oil on KI3, and rotate Clockwise.',
      hi: 'सोने से पहले 10 मिनट गुनगुने नमक पानी में पैर डुबोकर पोंछ लें, फिर अंदरूनी टखने के गड्ढे KI3 को क्लॉकवाइज दबाएं।',
      mr: 'झोपेपूर्वी १० मिनिटे कोमट मीठ पाण्यात पाय बुडवून पुसा, नंतर आतील घोट्याजवळ KI3 क्लॉकवाइज दाबा.',
    },
    caution: {
      en: 'Test foot-soak warmth with your elbow/hand if diabetic.',
      hi: 'मधुमेह रोगी पानी की गर्माहट पहले हाथ से जांचें।',
      mr: 'मधुमेह असल्यास पाण्याची उष्णता हाताने तपासून घ्या.',
    },
  },
  BL62: {
    category: 'compress',
    title: {
      en: 'Ice Wrap (Fresh Sprain) / Warm Oil Massage (Sciatica & Insomnia)',
      hi: 'मोच में ठंडी पट्टी / सियाटिका व नींद में गुनगुने तेल से टखने की मालिश',
      mr: 'मुरगळल्यास बर्फ पट्टी / सायटिका व झोपेसाठी कोमट तेल मालिश',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Cloth-wrapped ice (for recent ankle twist) OR warm sesame oil (for chronic nerve tension)'],
      hi: ['ताजा मोच में सूती कपड़े में बर्फ, या सियाटिका में गुनगुना तिल तेल'],
      mr: ['ताज्या मुचकासाठी कपड्यात बर्फ, किंवा सायटिकामध्ये कोमट तीळ तेल'],
    },
    steps: {
      en: 'For chronic sciatica or restless sleep, massage warm oil below the outer ankle bone and rotate BL62 anticlockwise; use cloth-wrapped ice for an acute ankle twist.',
      hi: 'सियाटिका या अनिद्रा में बाहरी टखने के नीचे गुनगुना तेल लगाकर BL62 एंटीक्लॉकवाइज दबाएं; ताजा मोच में बर्फ की पट्टी रखें।',
      mr: 'सायटिका किंवा झोपेसाठी बाहेरील घोट्याखाली कोमट तेल लावून BL62 अँटीक्लॉकवाइज दाबा; ताज्या दुखापतीवर बर्फ लावा.',
    },
    caution: {
      en: 'Never apply bare ice directly to skin or press directly onto a fractured bone.',
      hi: 'सीधे त्वचा पर बर्फ न रखें और टूटी हड्डी पर दबाव न दें।',
      mr: 'त्वचेवर थेट बर्फ लावू नका आणि फ्रॅक्चरवर दाब देऊ नका.',
    },
  },
  BL60: {
    category: 'compress',
    title: {
      en: 'Warm Saltwater Ankle Bath + Gentle Achilles Stretch',
      hi: 'गुनगुने नमक पानी से एड़ी की सिकाई व हल्का स्ट्रेच',
      mr: 'कोमट मीठ पाण्याने घोटा-टाचेचा शेक व सौम्य स्ट्रेच',
    },
    prepTime: { en: '4 min', hi: '4 मिनट', mr: '४ मिनिटे' },
    ingredients: {
      en: ['Warm water basin', 'Rock salt (2 tbsp)', 'Warm coconut/sesame oil'],
      hi: ['गर्म पानी का टब', 'सेंधा नमक (2 चम्मच)', 'गुनगुना तेल'],
      mr: ['कोमट पाण्याचा टब', 'सैंधव मीठ (२ चमचे)', 'कोमट तेल'],
    },
    steps: {
      en: 'Bathe heels in warm salted water for 8 minutes, gently flex toes toward your shin, dry thoroughly, and pinch-hold BL60 lightly.',
      hi: '8 मिनट एड़ियों को गर्म नमक पानी में डुबोकर पंजों को हल्का मोड़ें, फिर BL60 पर संतुलित दबाव दें।',
      mr: '८ मिनिटे टाचा कोमट मीठ पाण्यात ठेवून बोटे हलकी आत वाकवा आणि नंतर BL60 वर संतुलित दाब द्या.',
    },
    caution: {
      en: 'Avoid BL60 during pregnancy.',
      hi: 'गर्भावस्था में BL60 बिंदु को न दबाएं।',
      mr: 'गर्भावस्थेत BL60 बिंदू दाबू नका.',
    },
  },
  LV3: {
    category: 'drink',
    title: {
      en: 'Mint-Lemon-Coriander Cooler + Quiet Sunset Walk',
      hi: 'पुदीना-नींबू-धनिया पेय व शांत टहलना (बीपी व तनाव के लिए)',
      mr: 'पुदिना-लिंबू-धणे थंड पेय व शांत चालणे (रक्तदाब व तणावासाठी)',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Cool water (1 glass)', 'Fresh lemon juice (½ lemon)', 'Crushed mint leaves (5) + Coriander pinch'],
      hi: ['ताजा पानी (1 गिलास)', 'नींबू रस (½)', 'पुदीना पत्ते (5) + हल्का धनिया'],
      mr: ['ताजे पाणी (१ ग्लास)', 'लिंबाचा रस (½)', 'पुदिन्याची पाने (५)'],
    },
    steps: {
      en: 'Drink unsalted lemon-mint water calmly to soothe anger, tension headaches, and BP surges, then press LV3 firmly between toes 1 & 2.',
      hi: 'गुस्सा, सिरदर्द व हाई बीपी शांत करने के लिए बिना नमक वाला नींबू-पुदीना पानी पिएं और पैर में LV3 दबाएं।',
      mr: 'रागीटपणा, डोकेदुखी व उच्च रक्तदाब कमी करण्यासाठी बिन-मिठाचे लिंबू-पुदिना पाणी प्या आणि पायावर LV3 दाबा.',
    },
    caution: {
      en: 'Avoid added salt if managing hypertension.',
      hi: 'हाई बीपी में नींबू पानी में नमक न डालें।',
      mr: 'उच्च रक्तदाब असल्यास लिंबू पाण्यात मीठ टाळा.',
    },
  },
  KI1: {
    category: 'balm',
    title: {
      en: 'Padabhyanga (Warm Cow-Ghee / Sesame Foot-Sole Rub Before Sleep)',
      hi: 'पादाभ्यंग (सोने से पहले तलवों पर देसी घी या तिल तेल मालिश)',
      mr: 'पादाभ्यंग (झोपेपूर्वी तळपायांना कोमट तूप किंवा तीळ तेल मालिश)',
    },
    prepTime: { en: '3 min', hi: '3 मिनट', mr: '३ मिनिटे' },
    ingredients: {
      en: ['Warm cow ghee or sesame oil (1 tsp)', 'Clean warm cotton socks'],
      hi: ['गुनगुना देसी घी या तिल तेल (1 चम्मच)', 'साफ सूती मोज़े'],
      mr: ['कोमट साजूक तूप किंवा तीळ तेल (१ चमचा)', 'स्वच्छ सुती मोजे'],
    },
    steps: {
      en: 'Massage warm ghee or sesame oil firmly into the center sole hollow for 2 minutes before bed to ground racing thoughts and deep fatigue while pressing KI1.',
      hi: 'गहरी नींद, थकान व उच्च बीपी शांति के लिए सोने से पहले तलवों के बीच देसी घी/तिल तेल से KI1 पर मालिश व दबाव दें।',
      mr: 'शांत झोप, थकवा व अस्वस्थता घालवण्यासाठी झोपेपूर्वी तळपायाच्या मध्यावर तूप/तीळ तेलाने मसाज करून KI1 दाबा.',
    },
    caution: {
      en: 'Wipe excess oil or wear socks before walking so you do not slip on smooth floors.',
      hi: 'तेल लगाने के बाद फिसलने से बचने के लिए मोजे पहनें या तलवे पोंछ लें।',
      mr: 'पायाला तूप/तेल लावल्यानंतर घसरू नये म्हणून मोजे घाला किंवा पाय पुसून घ्या.',
    },
  },
};

export function getPointHomeRemedy(pointOrId: Point3D | string): PointHomeRemedy {
  const id = typeof pointOrId === 'string' ? pointOrId : pointOrId.id;
  return HOME_REMEDIES_BY_ID[id] ?? HOME_REMEDIES_BY_ID.ST36;
}
