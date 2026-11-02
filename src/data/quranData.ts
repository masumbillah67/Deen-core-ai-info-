import { SurahDetail, SurahMeta } from '../types';

export const ALL_SURAHS: SurahMeta[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", englishTranslation: "The Opening", numberOfAyahs: 7, revelationType: "Meccan" },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", englishTranslation: "The Cow", numberOfAyahs: 286, revelationType: "Medinan" },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", englishTranslation: "Family of Imran", numberOfAyahs: 200, revelationType: "Medinan" },
  { number: 4, name: "النساء", englishName: "An-Nisa", englishTranslation: "The Women", numberOfAyahs: 176, revelationType: "Medinan" },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", englishTranslation: "The Table Spread", numberOfAyahs: 120, revelationType: "Medinan" },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", englishTranslation: "The Cattle", numberOfAyahs: 165, revelationType: "Meccan" },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", englishTranslation: "The Heights", numberOfAyahs: 206, revelationType: "Meccan" },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", englishTranslation: "The Spoils of War", numberOfAyahs: 75, revelationType: "Medinan" },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", englishTranslation: "The Repentance", numberOfAyahs: 129, revelationType: "Medinan" },
  { number: 10, name: "يونس", englishName: "Yunus", englishTranslation: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", englishTranslation: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 36, name: "يس", englishName: "Ya-Sin", englishTranslation: "Yasin", numberOfAyahs: 83, revelationType: "Meccan" },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", englishTranslation: "The Beneficent", numberOfAyahs: 78, revelationType: "Medinan" },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", englishTranslation: "The Inevitable", numberOfAyahs: 96, revelationType: "Meccan" },
  { number: 67, name: "الملك", englishName: "Al-Mulk", englishTranslation: "The Sovereignty", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 78, name: "النبأ", englishName: "An-Naba", englishTranslation: "The Tidings", numberOfAyahs: 40, revelationType: "Meccan" },
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", englishTranslation: "The Morning Hours", numberOfAyahs: 11, revelationType: "Meccan" },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", englishTranslation: "The Relief", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 97, name: "القدر", englishName: "Al-Qadr", englishTranslation: "The Night of Decree", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", englishTranslation: "Abundance", numberOfAyahs: 3, revelationType: "Meccan" },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", englishTranslation: "Sincerity / Purity", numberOfAyahs: 4, revelationType: "Meccan" },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", englishTranslation: "The Daybreak", numberOfAyahs: 5, revelationType: "Meccan" },
  { number: 114, name: "الناس", englishName: "An-Nas", englishTranslation: "Mankind", numberOfAyahs: 6, revelationType: "Meccan" },
];

export const FEATURED_SURAHS: Record<number, SurahDetail> = {
  1: {
    number: 1,
    name: "الفاتحة",
    englishName: "Al-Fatihah",
    englishTranslation: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/001.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        transliteration: "Bismillahi-r-Rahmani-r-Rahim"
      },
      {
        numberInSurah: 2,
        textArabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        translation: "[All] praise is [due] to Allah, Lord of the worlds -",
        transliteration: "Al-hamdu lillahi Rabbi-l-'alamin"
      },
      {
        numberInSurah: 3,
        textArabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        translation: "The Entirely Merciful, the Especially Merciful,",
        transliteration: "Ar-Rahmani-r-Rahim"
      },
      {
        numberInSurah: 4,
        textArabic: "مَالِكِ يَوْمِ الدِّينِ",
        translation: "Sovereign of the Day of Recompense.",
        transliteration: "Maliki Yawmi-d-Din"
      },
      {
        numberInSurah: 5,
        textArabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        translation: "It is You we worship and You we ask for help.",
        transliteration: "Iyyaka na'budu wa iyyaka nasta'in"
      },
      {
        numberInSurah: 6,
        textArabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        translation: "Guide us to the straight path -",
        transliteration: "Ihdina-s-sirata-l-mustaqim"
      },
      {
        numberInSurah: 7,
        textArabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
        transliteration: "Sirata-lladhina an'amta 'alayhim ghayri-l-maghdubi 'alayhim wa la-d-dallin"
      }
    ]
  },
  67: {
    number: 67,
    name: "الملك",
    englishName: "Al-Mulk",
    englishTranslation: "The Sovereignty",
    numberOfAyahs: 30,
    revelationType: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/067.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
        translation: "Blessed is He in whose hand is dominion, and He is over all things competent -",
        transliteration: "Tabaraka alladhee biyadihi almulku wahuwa 'ala kulli shay'in qadeer"
      },
      {
        numberInSurah: 2,
        textArabic: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ",
        translation: "[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -",
        transliteration: "Alladhee khalaqa almawta walhayata liyabluwakum ayyukum ahsanu 'amalan"
      },
      {
        numberInSurah: 3,
        textArabic: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
        translation: "[And] who created seven heavens in layers. You see no flaw in the creation of the Most Merciful. So turn your vision again; can you see any breaks?",
        transliteration: "Alladhee khalaqa sab'a samawatin tibaqan ma tara fee khalqi alrrahmani min tafawut"
      },
      {
        numberInSurah: 4,
        textArabic: "ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ",
        translation: "Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.",
        transliteration: "Thumma irji'i albasara karratayni yanqalib ilayka albasaru khasi-an wahuwa haseer"
      }
    ]
  },
  112: {
    number: 112,
    name: "الإخلاص",
    englishName: "Al-Ikhlas",
    englishTranslation: "The Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/112.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        translation: "Say, \"He is Allah, [who is] One,",
        transliteration: "Qul huwa Allahu ahad"
      },
      {
        numberInSurah: 2,
        textArabic: "اللَّهُ الصَّمَدُ",
        translation: "Allah, the Eternal Refuge.",
        transliteration: "Allahu as-samad"
      },
      {
        numberInSurah: 3,
        textArabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        translation: "He neither begets nor is born,",
        transliteration: "Lam yalid wa lam yoolad"
      },
      {
        numberInSurah: 4,
        textArabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        translation: "Nor is there to Him any equivalent.\"",
        transliteration: "Wa lam yakun lahu kufuwan ahad"
      }
    ]
  },
  113: {
    number: 113,
    name: "الفلق",
    englishName: "Al-Falaq",
    englishTranslation: "The Daybreak",
    numberOfAyahs: 5,
    revelationType: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/113.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        translation: "Say, \"I seek refuge in the Lord of daybreak",
        transliteration: "Qul a'oodhu birabbi al-falaq"
      },
      {
        numberInSurah: 2,
        textArabic: "مِن شَرِّ مَا خَلَقَ",
        translation: "From the evil of that which He created",
        transliteration: "Min sharri ma khalaq"
      },
      {
        numberInSurah: 3,
        textArabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        translation: "And from the evil of darkness when it settles",
        transliteration: "Wa min sharri ghasiqin idha waqab"
      },
      {
        numberInSurah: 4,
        textArabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        translation: "And from the evil of the blowers in knots",
        transliteration: "Wa min sharri an-naffathati fee al-'uqad"
      },
      {
        numberInSurah: 5,
        textArabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        translation: "And from the evil of an envier when he envies.\"",
        transliteration: "Wa min sharri hasidin idha hasad"
      }
    ]
  },
  114: {
    number: 114,
    name: "الناس",
    englishName: "An-Nas",
    englishTranslation: "Mankind",
    numberOfAyahs: 6,
    revelationType: "Meccan",
    audioUrl: "https://server8.mp3quran.net/afs/114.mp3",
    ayahs: [
      {
        numberInSurah: 1,
        textArabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translation: "Say, \"I seek refuge in the Lord of mankind,",
        transliteration: "Qul a'oodhu birabbi an-nas"
      },
      {
        numberInSurah: 2,
        textArabic: "مَلِكِ النَّاسِ",
        translation: "The Sovereign of mankind,",
        transliteration: "Maliki an-nas"
      },
      {
        numberInSurah: 3,
        textArabic: "إِلَٰهِ النَّاسِ",
        translation: "The God of mankind,",
        transliteration: "Ilahi an-nas"
      },
      {
        numberInSurah: 4,
        textArabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        translation: "From the evil of the retreating whisperer -",
        transliteration: "Min sharri al-waswasi al-khannas"
      },
      {
        numberInSurah: 5,
        textArabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        translation: "Who whispers [evil] into the breasts of mankind -",
        transliteration: "Alladhee yuwaswisu fee sudoori an-nas"
      },
      {
        numberInSurah: 6,
        textArabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        translation: "From among the jinn and mankind.\"",
        transliteration: "Mina al-jinnati wa an-nas"
      }
    ]
  }
};
