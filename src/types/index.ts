export type ActiveTab = 'overview' | 'prayers' | 'quran' | 'hadith' | 'duas' | 'tasbih' | 'zakat' | 'assistant';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  verdict?: string;
  isProhibited?: boolean;
  sources?: string[];
  scriptureRef?: string;
  languageUsed?: 'bn' | 'en' | 'bilingual';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
  pinned?: boolean;
}

export interface UserPrivacySettings {
  profileVisibility: 'public' | 'private';
  bioVisibility: 'public' | 'private';
  emailVisibility: 'public' | 'private';
  genderVisibility: 'public' | 'private';
  socialVisibility: 'public' | 'private';
}

export interface UserProfile {
  userId?: string;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  bio?: string;
  gender?: 'brother' | 'sister' | 'unspecified';
  facebookUrl?: string;
  privacy?: UserPrivacySettings;
  isConnectedWithGoogle: boolean;
  googleId?: string;
  joinedAt: string;
  totalQuestionsAsked: number;
}

export interface AppSettings {
  defaultLanguage: 'bn' | 'en' | 'bilingual';
  arabicFontSize: number;
  scholarlyDepth: 'detailed' | 'concise';
  soundEnabled: boolean;
  theme: 'dark';
  show3DScene?: boolean;
  readingMode?: boolean;
  readingTheme?: 'dark' | 'sepia' | 'book';
  readingFontSize?: number;
}

export interface PrayerTimeItem {
  name: string;
  arabicName: string;
  time: string;
  isPassed: boolean;
  isNext: boolean;
  completed: boolean;
}

export interface CityLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  timezoneOffset: number;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  numberInSurah: number;
  textArabic: string;
  translation: string;
  transliteration?: string;
}

export interface SurahDetail extends SurahMeta {
  ayahs: Ayah[];
  audioUrl?: string;
}

export interface HadithItem {
  id: string;
  book: string;
  hadithNumber: string;
  narrator: string;
  topic: string;
  arabic: string;
  english: string;
  grade?: string;
}

export interface DuaItem {
  id: string;
  title: string;
  category: 'Morning & Evening' | 'Prayer & Daily Life' | 'Protection & Anxiety' | 'Forgiveness' | 'Travel & Food' | 'Gratitude';
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  benefit?: string;
  recommendedRepeats?: number;
}

export interface TasbihItem {
  id: string;
  phraseArabic: string;
  phraseTransliteration: string;
  meaning: string;
  target: number;
  count: number;
}

export interface KnowledgeArticle {
  id: string;
  question: string;
  category: string;
  tags: string[];
  answer: string;
  sources: string[];
  hadithOrAyahRef?: string;
}
