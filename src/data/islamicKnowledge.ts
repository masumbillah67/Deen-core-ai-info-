export interface BilingualKnowledgeArticle {
  id: string;
  questionEn: string;
  questionBn: string;
  categoryEn: string;
  categoryBn: string;
  tags: string[];
  isProhibitedTopic?: boolean; // If asking about haram matters (সুদ, জুয়া, মদ ইত্যাদি)
  statusVerdictBn?: string; // e.g. "সম্পূর্ণ হারাম ও নাজায়েজ" or "জায়েজ ও উৎসাহিত"
  statusVerdictEn?: string; // e.g. "Strictly Prohibited (Haram)" or "Permissible & Encouraged (Halal)"
  answerBn: string;
  answerEn: string;
  sourcesBn: string[];
  sourcesEn: string[];
  scriptureRef: string;
}

export const BILINGUAL_KNOWLEDGE_BASE: BilingualKnowledgeArticle[] = [
  // 1. TECHNOLOGY & ARTIFICIAL INTELLIGENCE IN ISLAM
  {
    id: 'kb-ai-technology',
    questionEn: 'Is using Artificial Intelligence (AI) and modern technology permissible in Islam?',
    questionBn: 'ইসলামের দৃষ্টিতে কৃত্রিম বুদ্ধিমত্তা (AI) এবং আধুনিক প্রযুক্তির ব্যবহার কি জায়েয?',
    categoryEn: 'Technology & Science',
    categoryBn: 'প্রযুক্তি ও আধুনিক বিজ্ঞান',
    tags: ['ai', 'technology', 'artificial intelligence', 'programming', 'science', 'প্রযুক্তি', 'এআই', 'বিজ্ঞান', 'কম্পিউটার', 'সফটওয়্যার'],
    isProhibitedTopic: false,
    statusVerdictBn: 'কল্যাণকর কাজে জায়েয ও উৎসাহিত (শর্তসাপেক্ষে)',
    statusVerdictEn: 'Permissible & Encouraged for Beneficial Purposes (With Ethical Safeguards)',
    answerBn: `ইসলামে প্রযুক্তি বা কৃত্রিম বুদ্ধিমত্তা (AI) মূলত একটি মাধ্যম বা যন্ত্র (Tool)। শরিয়তের মূলনীতি হলো: "الأصل في الأشياء الإباحة" (দুনিয়াবী বিষয়সমূহে মূল বিধান হলো বৈধতা, যতক্ষণ না কোনো স্পষ্ট নিষেধাজ্ঞার প্রমাণ পাওয়া যায়)।

১. কল্যাণকর কাজে ব্যবহার (জায়েয ও সওয়াবের কাজ):
• স্বাস্থ্যসেবা, চিকিৎসা গবেষণা, বৈজ্ঞানিক আবিষ্কার ও সমাজকল্যাণ।
• কুরআন হিফজ, ইসলামিক শিক্ষা, তাফসীর ও হাদিস গবেষণা সহজীকরণ।
• ব্যবসা ও শিক্ষাক্ষেত্রে উৎপাদনশীলতা এবং মানুষের কষ্ট লাঘব করা।
রাসূলুল্লাহ (ﷺ) দোয়া করতেন: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا" — "হে আল্লাহ! আমি আপনার নিকট উপকারী জ্ঞান প্রার্থনা করছি।" (সুনান ইবনে মাজাহ ৯২৫)।

২. যেসকল ক্ষেত্রে সম্পূর্ণ নাজায়েজ ও হারাম:
• ডিপফেক (Deepfake) প্রযুক্তি দিয়ে মানুষের চেহারা বা কন্ঠ বিকৃত করে অপপ্রচার চালানো বা বানোয়াট ভিডিও তৈরি করা (এটি মিথ্যা ও কুৎসা রটানোর শামিল)।
• অবৈধ হ্যাকিং, ডিজিটাল চুরি ও সাইবার অপরাধ।
• হারাম ব্যবসা, জুয়া বা অশ্লীলতা বিস্তারে প্রযুক্তির ব্যবহার।

অতএব, যে প্রযুক্তি মানুষের কল্যাণ বয়ে আনে এবং আল্লাহর বিধান লঙ্ঘন করে না, তা গ্রহণ করা শুধু জায়েযই নয়, বরং উৎসাহিত।`,
    answerEn: `In Islamic jurisprudence, technology, software, and Artificial Intelligence (AI) are neutral tools. The overarching legal maxim states: "Al-aslu fil-ashya'i al-ibahah" (The original status of worldly matters is permissibility unless explicitly prohibited by divine revelation).

1. Permissible & Rewarded Uses:
• Healthcare, medical diagnosis, educational enrichment, and scientific advancements.
• Facilitating Quranic memorization, Hadith database research, and spreading authentic Islamic dawah.
• Enhancing productivity, logistics, and relieving human hardship.
The Prophet Muhammad (ﷺ) supplicated: "Allahumma inni as'aluka 'ilman nafi'a" (O Allah, I ask You for beneficial knowledge — Sunan Ibn Majah 925).

2. Strictly Impermissible (Haram) Misuses:
• Deepfakes and AI image/voice manipulation to slander, deceive, or fabricate lies against individuals.
• Malicious cyberattacks, privacy infringement, and digital theft.
• Automating or promoting gambling, interest (Riba), or vulgar content.

Conclusion: Technology that benefits humanity without violating Shariah ethics is lawful and commendable.`,
    sourcesBn: ['সুনান ইবনে মাজাহ (৯২৫)', 'জামে তিরমিজি (২৬৮৭)', 'ফিকহী মূলনীতি'],
    sourcesEn: ['Sunan Ibn Majah (925)', 'Jami` at-Tirmidhi (2687)', 'Usul al-Fiqh Principles'],
    scriptureRef: 'হাদিস: "হিকমত (প্রজ্ঞা ও জ্ঞান) মুমিনের হারানো সম্পদ, সে যেখানেই তা পায়, তার উপর তার অধিকার সবচেয়ে বেশি।" (তিরমিজি ২৬৮৭)'
  },

  // 2. RIBA / INTEREST / USURY (STRICTLY PROHIBITED)
  {
    id: 'kb-interest-riba',
    questionEn: 'What is the ruling on Interest (Riba) and bank interest in Islam?',
    questionBn: 'ইসলামে সুদ (Riba) এবং ব্যাংকিং সুদের হুকুম কি?',
    categoryEn: 'Prohibitions & Halal Earning',
    categoryBn: 'হারাম বিধান ও হালাল উপার্জন',
    tags: ['riba', 'interest', 'bank', 'loan', 'usury', 'সুদ', 'ব্যাংক', 'রিবা', 'ঋণ', 'হারাম'],
    isProhibitedTopic: true,
    statusVerdictBn: 'সম্পূর্ণরূপে হারাম ও নাজায়েজ (কবীরা গুনাহ)',
    statusVerdictEn: 'Strictly Prohibited (Haram - Major Sin)',
    answerBn: `ইসলাম ও পবিত্র কুরআনের স্পষ্ট বিধানে সুদ (রিবা) গ্রহণ করা, প্রদান করা এবং এর লেনদেনে অংশ নেওয়া সম্পূর্ণরূপে হারাম ও নাজায়েজ। আল্লাহ তা'আলা কুরআন মাজীদে সুদের বিরুদ্ধে অত্যন্ত কঠোর হুঁশিয়ারি উচ্চারণ করেছেন:

• পবিত্র কুরআনের ঘোষণা:
"আল্লাহ ব্যবসাকে হালাল করেছেন এবং সুদকে করেছেন হারাম।" (সূরা আল-বাক্বারাহ ২:২৭৫)।
আল্লাহ আরও বলেন: "হে মুমিনগণ! তোমরা আল্লাহকে ভয় কর এবং সুদের যা অবশিষ্ট আছে তা পরিত্যাগ কর... যদি তা না কর, তবে আল্লাহ ও তাঁর রাসূলের পক্ষ থেকে যুদ্ধের ঘোষণা জেনে নাও।" (সূরা আল-বাক্বারাহ ২:২৭৮-২৭৯)।

• সহীহ হাদিসের সতর্কতা:
জাবির (রা.) বর্ণনা করেন: "রাসূলুল্লাহ (ﷺ) সুদখোর, সুদদাতা, সুদের হিসাব লেখক এবং সুদের দুই সাক্ষীর ওপর লা'নত (অভিশাপ) করেছেন এবং বলেছেন: তারা সকলেই সমান অপরাধী।" (সহীহ মুসলিম ১৫৯৮)।

• হালাল বিকল্প:
ইসলাম সুদের বিকল্প হিসেবে মুদারাবা, মুশারাকা এবং অংশীদারিত্বভিত্তিক হালাল ব্যবসা ও কর্জে হাসানা (নিঃস্বার্থ ধার) উৎসাহিত করে।`,
    answerEn: `In Islam and the Holy Quran, engaging in Interest (Riba) — whether taking, giving, recording, or witnessing — is strictly prohibited (Haram) and is one of the gravest major sins.

• Quranic Injunction:
"Allah has permitted trade and has forbidden interest (Riba)." (Surah Al-Baqarah 2:275).
"O you who have believed, fear Allah and give up what remains [due to you] of interest, if you should be believers. And if you do not, then be informed of a war [against you] from Allah and His Messenger." (Surah Al-Baqarah 2:278-279).

• Prophetic Warning:
Jabir (may Allah be pleased with him) reported: "The Messenger of Allah (ﷺ) cursed the one who accepts interest, the one who pays it, the one who writes it down, and the two who witness it; and he said: They are all equal in guilt." (Sahih Muslim 1598).

• Halal Alternatives:
Islam promotes ethical profit-and-loss sharing partnerships (Mudarabah, Musharakah), equity investments, and benevolent interest-free loans (Qard Hasan).`,
    sourcesBn: ['সূরা আল-বাক্বারাহ (২:২৭৫, ২৭৮-২৭৯)', 'সহীহ মুসলিম (১৫৯৮)'],
    sourcesEn: ['Surah Al-Baqarah (2:275, 278-279)', 'Sahih Muslim (1598)'],
    scriptureRef: 'কুরআন: "আল্লাহ ব্যবসাকে হালাল করেছেন এবং সুদকে করেছেন হারাম।" (সূরা আল-বাক্বারাহ ২:২৭৫)'
  },

  // 3. GAMBLING, BETTING & LOTTERY (STRICTLY PROHIBITED)
  {
    id: 'kb-gambling-maysir',
    questionEn: 'What is the ruling on Gambling, Casino, and Online Betting in Islam?',
    questionBn: 'ইসলামে জুয়া, লটারি এবং অনলাইন বেটিং-এর হুকুম কি?',
    categoryEn: 'Prohibitions & Ethics',
    categoryBn: 'হারাম বিধান ও চারিত্রিক সুরক্ষা',
    tags: ['gambling', 'betting', 'casino', 'lottery', 'maysir', 'জুয়া', 'বেটিং', 'লটারি', 'হারাম', 'নাজায়েজ'],
    isProhibitedTopic: true,
    statusVerdictBn: 'সম্পূর্ণরূপে হারাম ও নাজায়েজ (শয়তানের অপকর্ম)',
    statusVerdictEn: 'Strictly Prohibited (Haram - Impure Abomination)',
    answerBn: `ইসলামী শরিয়তে জুয়া, লটারি, অনলাইন স্পোর্টস বেটিং বা ভাগ্যের ওপর টাকা বাজি ধরা সম্পূর্ণরূপে নাজায়েজ ও হারাম। 

• পবিত্র কুরআনের স্পষ্ট নির্দেশ:
"হে মুমিনগণ! নিশ্চয়ই মদ, জুয়া, পূজার বেদি ও ভাগ্য নির্ণায়ক তীর—এসবই ঘৃণ্য বস্তু, শয়তানের কাজ। সুতরাং তোমরা তা বর্জন কর, যাতে তোমরা সফলকাম হতে পার।" (সূরা আল-মায়েদাহ ৫:৯০)।

• জুয়ার ক্ষতিকর দিকসমূহ:
১. মানুষের কষ্টার্জিত সম্পদ অন্যায়ভাবে গ্রাস করা।
২. সমাজে শত্রুতা, হিংসা-বিদ্বেষ এবং পারিবারিক বিপর্যয় সৃষ্টি করা।
৩. ব্যক্তিকে অলস ও ভাগ্যনির্ভর করে সৎ পরিশ্রম থেকে দূরে সরিয়ে দেওয়া।

কুরআন মাজীদে আরও এসেছে: "শয়তান তো চায় মদ ও জুয়ার মাধ্যমে তোমাদের মধ্যে শত্রুতা ও বিদ্বেষ সঞ্চারিত করতে এবং আল্লাহর স্মরণ ও সালাত থেকে তোমাদের বিরত রাখতে। অতএব তোমরা কি নিবৃত্ত হবে?" (সূরা আল-মায়েদাহ ৫:৯১)।`,
    answerEn: `In Islamic Law, gambling (Maysir/Qimar), lottery, casinos, and modern online sports betting are strictly prohibited (Haram) and categorized as foul deeds of Satan.

• Explicit Quranic Decree:
"O you who have believed, indeed, intoxicants, gambling, [sacrificing on] stone alters [to other than Allah], and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful." (Surah Al-Ma'idah 5:90).

• Societal and Spiritual Destructions:
1. Wrongfully consuming the wealth of others without mutual exchange of goods or labor.
2. Fueling animosity, bitterness, debt entrapment, and household destruction.
3. Distracting the mind and soul from the remembrance of Allah and Salah.

Surah Al-Ma'idah (5:91) continues: "Satan only wants to cause between you animosity and hatred through intoxicants and gambling and to avert you from the remembrance of Allah and from prayer. So will you not desist?"`,
    sourcesBn: ['সূরা আল-মায়েদাহ (৫:৯০-৯১)', 'সহীহ বুখারী (৬১০৭)'],
    sourcesEn: ['Surah Al-Ma\'idah (5:90-91)', 'Sahih al-Bukhari (6107)'],
    scriptureRef: 'কুরআন: "নিশ্চয়ই মদ, জুয়া... শয়তানের কাজ; সুতরাং তোমরা তা বর্জন কর।" (সূরা আল-মায়েদাহ ৫:৯০)'
  },

  // 4. SCIENTIFIC EXPLORATION & ASTRONOMY
  {
    id: 'kb-science-quran',
    questionEn: 'How does the Quran encourage science, astronomy, and observation of the universe?',
    questionBn: 'পবিত্র কুরআন কীভাবে বিজ্ঞান, জ্যোতির্বিদ্যা ও বিশ্বজগত গবেষণায় উৎসাহিত করে?',
    categoryEn: 'Quran & Science',
    categoryBn: 'কুরআন ও আধুনিক বিজ্ঞান',
    tags: ['science', 'astronomy', 'universe', 'nature', 'quran', 'বিজ্ঞান', 'জ্যোতির্বিদ্যা', 'মহাবিশ্ব', 'গবেষণা'],
    isProhibitedTopic: false,
    statusVerdictBn: 'উচ্চ মর্যাদাপূর্ণ ও অত্যন্ত উৎসাহিত',
    statusVerdictEn: 'Highly Praised & Strongly Encouraged',
    answerBn: `পবিত্র কুরআন কোনো সাধারণ বিজ্ঞানের বই নয়, বরং এটি নিদর্শনসমূহের (Signs) কিতাব। কুরআন মানুষকে চোখ খুলে মহাবিশ্ব, নক্ষত্রমণ্ডল, সৃষ্টিজগতের সূক্ষ্ম ভারসাম্য ও প্রকৃতি নিয়ে গভীর চিন্তাভাবনা (তাফাক্কুর) করার নির্দেশ দেয়।

• কুরআনিক নির্দেশনা:
"নিশ্চয়ই আকাশমণ্ডল ও পৃথিবীর সৃষ্টিতে এবং রাত ও দিনের আবর্তনে জ্ঞানবানদের জন্য বহু নিদর্শন রয়েছে। যারা দাঁড়িয়ে, বসে ও শায়িত অবস্থায় আল্লাহকে স্মরণ করে এবং আকাশমণ্ডল ও পৃথিবীর সৃষ্টি নিয়ে গভীরভাবে চিন্তা করে..." (সূরা আলে ইমরান ৩:১৯০-১৯১)।

• জ্যোতির্বিদ্যা ও গ্রহ-নক্ষত্রের কক্ষপথ:
"তিনিই সৃষ্টি করেছেন রাত ও দিন এবং সূর্য ও চাঁদ। প্রত্যেকেই নিজ নিজ কক্ষপথে সাঁতার কাটছে।" (সূরা আল-আম্বিয়া ২১:৩৩)।

• মহাবিশ্বের সম্প্রসারণ:
"আমি নিজ ক্ষমতাবলে আকাশমণ্ডল নির্মাণ করেছি এবং নিশ্চয়ই আমি একে সম্প্রসারিত করছি।" (সূরা আয-যারিয়াত ৫১:৪৭)।

ইসলামের সোনালী যুগে মুসলিম বিজ্ঞানীগণ (ইবনে আল-হাইসাম, আল-বিরুনী, জাবির ইবনে হাইয়ান) কুরআনের এই নির্দেশনায় অনুপ্রাণিত হয়ে আধুনিক আলোকবিজ্ঞান, গণিত ও জ্যোতির্বিজ্ঞানের ভিত্তি স্থাপন করেছিলেন।`,
    answerEn: `The Quran is not a textbook of science, but a book of divine signs (Ayat). It constantly commands human intellect to observe, explore, and reflect upon natural phenomena with rigorous thought (Tafakkur).

• Divine Call to Ponder:
"Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding. Who remember Allah while standing or sitting or [lying] on their sides and give thought to the creation of the heavens and the earth..." (Surah Ali 'Imran 3:190-191).

• Celestial Mechanics & Orbits:
"And it is He who created the night and the day and the sun and the moon; all [heavenly bodies] in an orbit are swimming." (Surah Al-Anbiya 21:33).

• Expanding Universe:
"And the heaven We constructed with strength, and indeed, We are [its] expander." (Surah Adh-Dhariyat 51:47).

This divine encouragement inspired historical Muslim luminaries like Ibn al-Haytham (optics), Al-Biruni (geodesy), and Al-Khwarizmi (algebra) to advance modern civilization.`,
    sourcesBn: ['সূরা আলে ইমরান (৩:১৯০-১৯১)', 'সূরা আল-আম্বিয়া (২১:৩৩)', 'সূরা আয-যারিয়াত (৫১:৪৭)'],
    sourcesEn: ['Surah Ali \'Imran (3:190-191)', 'Surah Al-Anbiya (21:33)', 'Surah Adh-Dhariyat (51:47)'],
    scriptureRef: 'কুরআন: "তিনিই সৃষ্টি করেছেন রাত ও দিন এবং সূর্য ও চাঁদ; প্রত্যেকেই নিজ নিজ কক্ষপথে বিচরণ করছে।" (সূরা আল-আম্বিয়া ২১:৩৩)'
  },

  // 5. FIVE PILLARS OF ISLAM
  {
    id: 'kb-five-pillars-bilingual',
    questionEn: 'What are the Five Pillars of Islam with their scriptural proof?',
    questionBn: 'দলিলসহ ইসলামের পাঁচটি মূল স্তম্ভ কী কী?',
    categoryEn: 'Core Beliefs',
    categoryBn: 'মৌলিক আক্বীদা ও ইবাদত',
    tags: ['five pillars', 'pillars', 'shahada', 'salah', 'zakat', 'sawm', 'hajj', 'স্তম্ভ', 'ঈমান', 'নামাজ', 'রোজা', 'হজ্ব', 'যাকাত'],
    isProhibitedTopic: false,
    statusVerdictBn: 'ইসলামের ভিত্তিমূল (ফরজিয়্যাত)',
    statusVerdictEn: 'Foundational Obligation (Fardh)',
    answerBn: `রাসূলুল্লাহ (ﷺ) ইরশাদ করেছেন: "ইসলাম পাঁচটি ভিত্তির ওপর প্রতিষ্ঠিত:
১. শাহাদাত (সাক্ষ্য প্রদান): এই সাক্ষ্য দেওয়া যে, আল্লাহ ব্যতীত কোনো সত্য উপাস্য নেই এবং মুহাম্মদ (ﷺ) আল্লাহর বান্দা ও রাসূল।
২. সালাত কায়েম করা: দৈনিক পাঁচ ওয়াক্ত ফরজ নামাজ যথাযথভাবে আদায় করা।
৩. যাকাত প্রদান করা: নেসাব পরিমাণ সম্পদের ওপর বার্ষিক ২.৫% বাধ্যতামূলক দান।
৪. রমযানের রোজা রাখা: সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত পানাহার ও কামাচার থেকে বিরত থাকা।
৫. বাইতুল্লাহর হজ্ব পালন করা: শারীরিক ও আর্থিক সামর্থ্যবান ব্যক্তির জন্য জীবনে একবার ফরজ।"
(সহীহ বুখারী ৮, সহীহ মুসলিম ১৬)।`,
    answerEn: `The Messenger of Allah (ﷺ) said: "Islam is built upon five pillars:
1. Shahadah (Testimony of Faith): Bearing witness that there is none worthy of worship except Allah and that Muhammad (ﷺ) is His servant and messenger.
2. Establishing Salah: Performing the five prescribed daily prayers punctually.
3. Paying Zakat: Giving 2.5% of qualifying annual surplus wealth to the eight designated categories of needy recipients.
4. Fasting Ramadan (Sawm): Abstaining from food, drink, and intimacy from dawn to sunset during the blessed month.
5. Hajj (Pilgrimage to Makkah): Once in a lifetime for every Muslim who is physically and financially able."
(Sahih al-Bukhari 8, Sahih Muslim 16).`,
    sourcesBn: ['সহীহ বুখারী (৮)', 'সহীহ মুসলিম (১৬)'],
    sourcesEn: ['Sahih al-Bukhari (8)', 'Sahih Muslim (16)'],
    scriptureRef: 'হাদিস: "বুনিয়াল ইসলামু আলা খামসিন..." (সহীহ বুখারী ৮)'
  },

  // 6. WUDU STEPS & PURITY
  {
    id: 'kb-wudu-steps-bilingual',
    questionEn: 'What are the essential steps and obligations (Fara\'id) of Wudu?',
    questionBn: 'পবিত্র কুরআন ও হাদিস অনুযায়ী ওযুর ফরজ ও সঠিক নিয়ম কী?',
    categoryEn: 'Purification & Salah',
    categoryBn: 'তাহারাত ও পবিত্রতা',
    tags: ['wudu', 'cleanliness', 'taharah', 'salah', 'prayer', 'ওযু', 'পবিত্রতা', 'নামাজ', 'ফরজ'],
    isProhibitedTopic: false,
    statusVerdictBn: 'সালাতের জন্য অপরিহার্য পূর্বশর্ত',
    statusVerdictEn: 'Essential Prerequisite for Prayer',
    answerBn: `সূরা আল-মায়েদাহর ৬ নম্বর আয়াতে ওযুর ৪টি মূল ফরজ নির্দেশ করা হয়েছে:
১. মুখমণ্ডল ধৌত করা (কপালের ওপর থেকে থুতনি এবং এক কানের লতি থেকে অন্য কানের লতি পর্যন্ত)।
২. উভয় হাত কনুইসহ ধৌত করা।
৩. ভেজা হাত দিয়ে মাথা মাসেহ করা।
৪. উভয় পা টাখনু (গোড়ালি) সহ ধৌত করা।

সুন্নাতসম্মত পূর্ণাঙ্গ পদ্ধতি:
১. অন্তরে নিয়ত করে 'বিসমিল্লাহ' বলা।
২. দুই হাত কবজি পর্যন্ত ৩ বার ধোয়া।
৩. কুলি করা ও নাক পরিষ্কার করা ৩ বার।
৪. সম্পূর্ণ মুখ ৩ বার ধোয়া।
৫. ডান হাত এরপর বাম হাত কনুইসহ ৩ বার ধোয়া।
৬. সমস্ত মাথা একবার মাসেহ করা (কানসহ)।
৭. ডান পা ও বাম পা গোড়ালিসহ ৩ বার ধোয়া।
শেষে তাশাহহুদ পাঠ করলে জান্নাতের আটটি দরজাই উন্মুক্ত হয়ে যায়। (সহীহ মুসলিম ২৩৪)।`,
    answerEn: `Surah Al-Ma'idah (5:6) explicitly mandates the four essential obligations (Fara'id) of Wudu:
1. Washing the face thoroughly from hairline to chin and ear to ear.
2. Washing both arms up to and including the elbows.
3. Wiping over the head with wet hands (Masah).
4. Washing both feet up to and including the ankles.

Complete Sunnah Procedure:
1. Sincere intention (Niyyah) in the heart and reciting "Bismillah".
2. Washing hands to the wrists three times.
3. Rinsing the mouth and sniffing water into the nostrils three times.
4. Washing the entire face three times.
5. Washing arms to the elbows three times (starting right then left).
6. Wiping the head and ears once.
7. Washing both feet up to the ankles three times (starting right then left).
Concluding with the Shahadah dua opens the eight gates of Paradise. (Sahih Muslim 234).`,
    sourcesBn: ['সূরা আল-মায়েদাহ (৫:৬)', 'সহীহ মুসলিম (২৩৪)'],
    sourcesEn: ['Surah Al-Ma\'idah (5:6)', 'Sahih Muslim (234)'],
    scriptureRef: 'কুরআন: "হে মুমিনগণ! যখন তোমরা সালাতের জন্য দাঁড়াতে চাও, তখন তোমাদের মুখমণ্ডল ও কনুই পর্যন্ত হাত ধৌত কর..." (সূরা আল-মায়েদাহ ৫:৬)'
  },

  // 7. CONDITIONS OF REPENTANCE (TAWBAH)
  {
    id: 'kb-tawbah-bilingual',
    questionEn: 'What are the essential conditions for sincere repentance (Tawbah Nasuh) in Islam?',
    questionBn: 'ইসলামে খাঁটি তওবা (তওবাতুন নাসূহা) কবুল হওয়ার শর্তাবলী কী কী?',
    categoryEn: 'Repentance & Mercy',
    categoryBn: 'তওবা ও আল্লাহর ক্ষমা',
    tags: ['tawbah', 'repentance', 'forgiveness', 'istighfar', 'mercy', 'তওবা', 'ক্ষমা', 'ইস্তিগফার', 'গুনাহ মাফ'],
    isProhibitedTopic: false,
    statusVerdictBn: 'আত্মার পরিশুদ্ধির প্রধান মাধ্যম',
    statusVerdictEn: 'Primary Means of Spiritual Purification',
    answerBn: `ইসলামী ফুক্বাহায়ে কিরাম কুরআন ও সুন্নাহর আলোকে তওবা কবুল হওয়ার জন্য প্রধান চারটি শর্ত নির্ধারণ করেছেন:

১. গুনাহ অবিলম্বে বর্জন করা (ইস্তিগফার মুখে বলে গুনাহ চালু রাখা প্রতারণা)।
২. অতীতের কৃত পাপের জন্য অন্তরের অন্তস্তল থেকে গভীর অনুশোচনা (নাদামত) বোধ করা। রাসূলুল্লাহ (ﷺ) বলেছেন: "অনুশোচনাই হলো তওবা।" (ইবনে মাজাহ ৪২৫২)।
৩. ভবিষ্যতে আর কখনো সেই পাপে লিপ্ত না হওয়ার দৃঢ় সংকল্প গ্রহণ করা।
৪. যদি গুনাহটি কোনো মানুষের অধিকার (হক্বুল ইবাদ) খর্ব করে থাকে (যেমন: কারো টাকা আত্মসাৎ, গীবত বা শারীরিক কষ্ট দেওয়া)—তবে তার পাওনা ফিরিয়ে দেওয়া বা তার থেকে ক্ষমা চেয়ে নেওয়া।

আল্লাহর অফুরন্ত ক্ষমার ঘোষণা: "বলুন: হে আমার বান্দাগণ! যারা নিজেদের ওপর অবিচার করেছ, তোমরা আল্লাহর অনুগ্রহ থেকে নিরাশ হয়ো না। নিশ্চয়ই আল্লাহ সমস্ত গুনাহ ক্ষমা করে দেন। তিনি পরম ক্ষমাশীল, পরম দয়ালু।" (সূরা আয-যুমার ৩৯:৫৩)।`,
    answerEn: `Islamic scholars deduce four fundamental conditions for sincere repentance (Tawbah Nasuh) from the Quran and Sunnah:

1. Immediate cessation of the sin.
2. Deep, heartfelt remorse for having disobeyed Allah. The Prophet (ﷺ) said: "Remorse is repentance." (Sunan Ibn Majah 4252).
3. A firm, resolute determination never to repeat the transgression.
4. Restoration of rights if the sin violated the rights of a fellow human being (Haqq al-'Ibad), such as returning usurped property or seeking their forgiveness.

Allah declares in Surah Az-Zumar (39:53): "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'"`,
    sourcesBn: ['সূরা আয-যুমার (৩৯:৫৩)', 'সুনান ইবনে মাজাহ (৪২৫২)', 'রিয়াদুস সালেহীন'],
    sourcesEn: ['Surah Az-Zumar (39:53)', 'Sunan Ibn Majah (4252)', 'Riyad as-Salihin'],
    scriptureRef: 'কুরআন: "তোমরা আল্লাহর অনুগ্রহ থেকে নিরাশ হয়ো না; নিশ্চয়ই আল্লাহ সমস্ত গুনাহ ক্ষমা করে দেন।" (সূরা আয-যুমার ৩৯:৫৩)'
  }
];
