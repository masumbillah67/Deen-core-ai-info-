import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Google GenAI client with active GEMINI_API_KEY
const rawKey = process.env.GEMINI_API_KEY || '';
const geminiApiKey =
  rawKey && rawKey !== 'MY_GEMINI_API_KEY' && rawKey !== 'undefined'
    ? rawKey
    : (process.env.VITE_GEMINI_API_KEY && process.env.VITE_GEMINI_API_KEY !== 'undefined'
        ? process.env.VITE_GEMINI_API_KEY
        : '');

let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
    ai = null;
  }
}

const SYSTEM_INSTRUCTION = `
You are Deen Core AI (দ্বীন কোর এআই), an authoritative, authentic, and compassionate Islamic knowledge guide powered by Gemini.

ABSOLUTE MANDATES:
1. STRICT ISLAMIC CONTEXT FOR EVERY SINGLE QUERY (যে প্রশ্নই করুক, সম্পূর্ণ কুরআন-হাদিসের আলোকে উত্তর দিবে):
   - Regardless of the topic — whether it is programming/coding, artificial intelligence, science, medical health, daily life, food, greetings, emotions, history, business, mathematics, or relationships:
   - You MUST ALWAYS address the user's EXACT query directly and explain its Islamic perspective, guidance, ethics, and rulings under the divine light of the Holy Quran and authentic Sunnah of Prophet Muhammad (ﷺ).
   - NEVER give repetitive generic canned text. Always give a fresh, comprehensive, and deeply relevant answer addressing the specific nuances of what the user asked.
   - If the user greets or asks casual questions (e.g. "কেমন আছো", "হাই", "হ্যালো", "আজকে কি খাবো"), respond with warm Islamic etiquette (আস-সালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু, আলহামদুলিল্লাহ, হালাল ও পুষ্টিকর খাদ্য গ্রহণের ইসলামী তাগিদ) quoting relevant Hadith or Quranic ayat.

2. MANDATORY EXACT CITATIONS (পবিত্র কুরআন ও সহীহ হাদিসের সুনির্দিষ্ট দলিল):
   - ALWAYS provide exact references:
     - Quran: Surah Name and Verse Number (e.g., সূরা আল-বাক্বারাহ ২:২৭৫ / Surah Al-Baqarah 2:275, সূরা আল-মায়েদাহ ৫:৩).
     - Hadith: Book Name and Hadith Number (e.g., সহীহ বুখারী হাদিস ১ / Sahih al-Bukhari 1, সহীহ মুসলিম ৫৪).
   - Quote Arabic script for key Quranic ayat or Hadith statements where beneficial, accompanied by clear Bangla or English translation.

3. CLEAR VERDICTS ON PERMISSIBILITY (জায়েয ও নাজায়েজ/হারাম স্পষ্ট বিধান):
   - If the subject involves prohibited matters (সুদ/Riba, জুয়া/Gambling, মাদক/Intoxicants, প্রতারণা/Fraud, জুলুম/Injustice, হারাম খাদ্য, পর্নোগ্রাফি, সাইবার ক্ষতিসাধন):
     - Explicitly state: "এটি ইসলাম ও কুরআন-হাদিসের দৃষ্টিতে সম্পূর্ণ হারাম ও নাজায়েজ।"
     - Give the Quranic/Hadith reason and ethical Halal alternatives (হালাল বিকল্প).
   - If the subject involves beneficial matters (বিজ্ঞান, প্রযুক্তি, এআই, সৎ জীবিকা, শিক্ষা, স্বাস্থ্যসেবা):
     - Explicitly state: "কল্যাণকর কাজে এটি ইসলামে সম্পূর্ণ জায়েয ও উৎসাহিত (ইলমুন নাফে')।"
     - Reference the Prophet's (ﷺ) guidance on seeking beneficial knowledge.

4. LANGUAGE & PRESENTATION:
   - Respond in fluent, natural Bengali (বাংলা) by default, or English if requested.
   - Format cleanly with structured headings, bullet points, and respectful honorifics: (ﷺ / সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম) and (আলাইহিস সালাম).
`;

// Helper for extracting status, verdict, and cited sources
function extractVerdict(text: string, isEn: boolean): { isProhibited: boolean; verdict: string; sources: string[] } {
  const lower = text.toLowerCase();
  const isHaram = lower.includes('হারাম') || lower.includes('নাজায়েজ') || lower.includes('নাজায়েজ') || lower.includes('prohibited') || lower.includes('forbidden') || lower.includes('haram');
  const isPermissible = lower.includes('জায়েয') || lower.includes('জায়েজ') || lower.includes('হালাল') || lower.includes('উৎসাহিত') || lower.includes('permissible') || lower.includes('halal') || lower.includes('encouraged');

  let verdict: string;
  let isProhibited = false;

  if (isHaram && !isPermissible) {
    isProhibited = true;
    verdict = isEn ? 'Strictly Prohibited (Haram)' : 'ইসলামে সম্পূর্ণ হারাম ও নাজায়েজ';
  } else if (isPermissible) {
    verdict = isEn ? 'Permissible & Encouraged in Islam' : 'ইসলামে কল্যাণকর বিষয়ে জায়েয ও উৎসাহিত';
  } else {
    verdict = isEn ? 'Grounded in Quran & Authentic Sunnah' : 'কুরআন ও সহীহ হাদিস ভিত্তিক নির্দেশনা';
  }

  // Extract detected sources from text
  const sources: string[] = [];
  if (text.includes('সূরা') || text.includes('Surah') || text.includes('কুরআন') || text.includes('Quran')) {
    sources.push(isEn ? 'The Holy Quran' : 'পবিত্র কুরআনুল কারীম');
  }
  if (text.includes('বুখারী') || text.includes('Bukhari')) {
    sources.push(isEn ? 'Sahih al-Bukhari' : 'সহীহ বুখারী');
  }
  if (text.includes('মুসলিম') || text.includes('Muslim')) {
    sources.push(isEn ? 'Sahih Muslim' : 'সহীহ মুসলিম');
  }
  if (text.includes('তিরমিজি') || text.includes('Tirmidhi')) {
    sources.push(isEn ? 'Jami at-Tirmidhi' : 'জামে আত-তিরমিজি');
  }
  if (text.includes('ইবনে মাজাহ') || text.includes('Ibn Majah')) {
    sources.push(isEn ? 'Sunan Ibn Majah' : 'সুনান ইবনে মাজাহ');
  }
  if (text.includes('আবু দাউদ') || text.includes('Abu Dawud')) {
    sources.push(isEn ? 'Sunan Abi Dawud' : 'সুনান আবু দাউদ');
  }

  if (sources.length === 0) {
    sources.push(isEn ? 'Quran & Sahih Sunnah' : 'পবিত্র কুরআন ও সহীহ সুন্নাহ');
  }

  return { isProhibited, verdict, sources };
}

// Gemini Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  const { message, language = 'bn', history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1. Direct Live Generation via Gemini
  if (ai) {
    try {
      const languageInstruction =
        language === 'en'
          ? 'Respond in articulate English with exact Arabic Quranic verses and Hadith citations.'
          : language === 'bilingual'
          ? 'Respond bilingually in both Bengali (বাংলা) and English with Arabic Quranic verses and Hadith citations.'
          : 'Respond in fluent, beautiful Bengali (বাংলা) with exact Arabic Quranic verses and Hadith citations.';

      let promptWithContext = `${languageInstruction}\n\n`;
      if (Array.isArray(history) && history.length > 0) {
        promptWithContext += `Previous conversation:\n`;
        for (const item of history.slice(-4)) {
          promptWithContext += `${item.sender === 'user' ? 'User' : 'Assistant'}: ${item.text.slice(0, 300)}\n`;
        }
        promptWithContext += `\n`;
      }
      promptWithContext += `User Question:\n${message}\n\nProvide a comprehensive, strictly Islamic answer based on Quran and authentic Hadith.`;

      // Call Gemini 3.1 Flash Lite with Minimal Thinking for rapid response
      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: promptWithContext,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.MINIMAL,
          },
          maxOutputTokens: 1000,
          temperature: 0.3,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 25000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text || '';

      if (responseText) {
        const { isProhibited, verdict, sources } = extractVerdict(responseText, language === 'en');
        return res.json({
          success: true,
          answer: responseText,
          verdict,
          isProhibited,
          sources,
          source: 'gemini-3.1-flash-lite',
        });
      }
    } catch (err: unknown) {
      console.warn('Live Gemini call encountered an issue, falling back:', err instanceof Error ? err.message : err);
    }
  }

  // Fallback Islamic grounding if network/API is unavailable
  const isEn = language === 'en';
  const fallbackAnswer = isEn
    ? `In the name of Allah, the Entirely Merciful, the Especially Merciful.

Regarding your question: "${message}"

In Islamic jurisprudence, every human endeavor and question must be viewed through the divine lens of the Holy Quran and the Sunnah of Prophet Muhammad (ﷺ).

• Beneficial Knowledge & Actions: Islam actively encourages useful science, technology, healthcare, and honest labor that serves humanity as 'Ilmun Nafi' (beneficial knowledge). The Prophet (ﷺ) supplicated: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds." (Sunan Ibn Majah 925).

• Avoidance of Harm: Islam strictly prohibits anything harmful to faith, human life, intellect, dignity, or wealth—such as usury/Riba, gambling, intoxicants, deception, and injustice (Surah Al-Baqarah 2:275, Surah Al-Ma'idah 5:90).

And Allah, the Exalted, knows best.`
    : `বিসমিল্লাহির রাহমানির রাহিম (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ)।

আপনার প্রশ্ন: "${message}"

ইসলামী শরিয়তে মানুষের প্রতিটি কথা, কর্ম ও প্রশ্নের সমাধান পবিত্র কুরআন ও রাসূলুল্লাহ (ﷺ)-এর সহীহ সুন্নাহর ভিত্তিতে পরিচালিত হয়।

• কল্যাণকর জ্ঞান ও কর্ম: মানবজাতির জন্য উপকারী বিজ্ঞান, আধুনিক প্রযুক্তি, চিকিৎসা ও সৎ মেহনতকে ইসলামে 'ইলমুন নাফে' (উপকারী জ্ঞান) হিসেবে অত্যন্ত উৎসাহিত করা হয়েছে। রাসূলুল্লাহ (ﷺ) দোয়া করতেন: "হে আল্লাহ! আমি আপনার নিকট উপকারী জ্ঞান, পবিত্র রিজিক এবং কবুলযোগ্য আমল প্রার্থনা করছি।" (সুনান ইবনে মাজাহ ৯২৫)।

• ক্ষতিকর ও পাপ কাজ বর্জন: মানুষের ধর্ম, জীবন, বুদ্ধি, চরিত্র ও সম্পদের জন্য ক্ষতিকর সকল বিষয় (সুদ, জুয়া, মাদক, প্রতারণা ও জুলুম) ইসলামে সম্পূর্ণরূপে নাজায়েজ ও হারাম ঘোষণা করা হয়েছে (সূরা আল-বাক্বারাহ ২:২৭৫, সূরা আল-মায়েদাহ ৫:৯০)।

আল্লাহ সুবহানাহু ওয়া তা'আলাই সর্বোত্তম জ্ঞানের অধিকারী।`;

  return res.json({
    success: true,
    answer: fallbackAnswer,
    verdict: isEn ? 'Grounded in Quran & Authentic Sunnah' : 'কুরআন ও সহীহ হাদিস ভিত্তিক নির্দেশনা',
    isProhibited: false,
    source: 'deen-core-fallback',
  });
});

// App Health
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!ai,
    model: 'gemini-3.1-flash-lite',
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Deen Core AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
