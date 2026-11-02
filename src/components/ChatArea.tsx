import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile, AppSettings } from '../types';
import { Islamic3DScene } from './Islamic3DScene';
import { OnboardingBanner } from './OnboardingBanner';
import { 
  ArrowUp,
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  CheckCircle2, 
  Menu, 
  BookOpen, 
  ShieldCheck,
  Trash2,
  LogIn,
  Sparkles,
  Minimize2,
  Maximize2,
  Type,
  Sun,
  Moon,
  Coffee
} from 'lucide-react';

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
  user: UserProfile;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onToggleSidebar: () => void;
  onClearCurrentChat: () => void;
  onOpenAuth: () => void;
  onGoogleSignIn: () => void;
  isReadingMode: boolean;
  onToggleReadingMode: () => void;
  show3D: boolean;
  onToggle3D: () => void;
  onOpenProfile?: () => void;
}

// Minimalist Markdown and formatting parser for crisp ChatGPT-style typography
const FormattedMessage: React.FC<{ 
  text: string; 
  fontSize?: number;
  readingTheme?: 'dark' | 'sepia' | 'book';
  isReadingMode?: boolean;
}> = ({ 
  text, 
  fontSize = 15,
  readingTheme = 'dark',
  isReadingMode = false 
}) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const isSepia = isReadingMode && readingTheme === 'sepia';

  const flushList = (key: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key} className="space-y-1.5 my-2.5 pl-5 list-disc marker:text-emerald-500/80">
          {currentList.map((item, idx) => (
            <li key={idx} className={`leading-relaxed ${isSepia ? 'text-stone-800' : 'text-zinc-200'}`} style={{ fontSize: `${fontSize}px` }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  function renderInline(str: string): React.ReactNode {
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className={`font-semibold ${isSepia ? 'text-stone-900 font-bold' : 'text-white'}`}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code key={i} className={`px-1.5 py-0.5 rounded font-mono text-[12px] border ${
            isSepia 
              ? 'bg-amber-100/80 text-amber-900 border-amber-300' 
              : 'bg-zinc-800 text-emerald-400 border-zinc-700/60'
          }`}>
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed === '---' || trimmed === '***') {
      flushList(`list-${index}`);
      elements.push(
        <hr key={`hr-${index}`} className={`my-4 ${isSepia ? 'border-stone-300' : 'border-zinc-800'}`} />
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`list-${index}`);
      elements.push(
        <h4 
          key={`h3-${index}`} 
          className={`font-semibold mt-4 mb-1.5 tracking-tight ${isSepia ? 'text-emerald-900 font-bold' : 'text-zinc-100'}`}
          style={{ fontSize: `${fontSize + 1}px` }}
        >
          {renderInline(trimmed.replace(/^###\s+/, ''))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`list-${index}`);
      elements.push(
        <h3 
          key={`h2-${index}`} 
          className={`font-bold mt-5 mb-2 tracking-tight ${isSepia ? 'text-emerald-950' : 'text-white'}`}
          style={{ fontSize: `${fontSize + 3}px` }}
        >
          {renderInline(trimmed.replace(/^##\s+/, ''))}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      flushList(`list-${index}`);
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className={`my-3 pl-3.5 border-l-2 py-1.5 rounded-r ${
            isSepia 
              ? 'border-emerald-600 bg-amber-100/60 text-stone-800 italic' 
              : 'border-emerald-500/70 bg-zinc-800/40 text-zinc-300 italic'
          }`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {renderInline(trimmed.replace(/^>\s+/, ''))}
        </blockquote>
      );
      return;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^\d+\.\s/.test(trimmed)) {
      const cleanItem = trimmed.replace(/^(\*|-|\d+\.)\s+/, '');
      currentList.push(cleanItem);
      return;
    }

    flushList(`list-${index}`);
    if (trimmed === '') {
      elements.push(<div key={`empty-${index}`} className="h-2" />);
    } else {
      elements.push(
        <p 
          key={`p-${index}`} 
          className={`leading-relaxed my-1 ${isSepia ? 'text-stone-800' : 'text-zinc-200'}`}
          style={{ fontSize: `${fontSize}px` }}
        >
          {renderInline(line)}
        </p>
      );
    }
  });

  flushList('final-list');

  return <div className="space-y-0.5 font-sans">{elements}</div>;
};

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  onSendMessage,
  isProcessing,
  user,
  settings,
  onUpdateSettings,
  onToggleSidebar,
  onClearCurrentChat,
  onOpenAuth,
  onGoogleSignIn,
  isReadingMode,
  onToggleReadingMode,
  show3D,
  onToggle3D,
  onOpenProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  
  // Reading mode customization state
  const [readingFontSize, setReadingFontSize] = useState<number>(16);
  const [readingTheme, setReadingTheme] = useState<'dark' | 'sepia' | 'book'>('dark');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const isBn = settings.defaultLanguage !== 'en';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSend = () => {
    if (!inputText.trim() || isProcessing) return;
    const textToSend = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSpeak = (msg: ChatMessage) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg.text.replace(/[*#>_-]/g, ''));
    utterance.lang = settings.defaultLanguage === 'en' ? 'en-US' : 'bn-BD';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    window.speechSynthesis.speak(utterance);
  };

  const samplePrompts = [
    {
      titleBn: 'AI ও প্রযুক্তি ইসলামে কি জায়েজ?',
      titleEn: 'Is AI & technology permissible in Islam?',
    },
    {
      titleBn: 'সুদ ও অনলাইন জুয়া কেন সম্পূর্ণ হারাম?',
      titleEn: 'Why are interest & betting forbidden?',
    },
    {
      titleBn: 'কুরআনে মহাবিশ্ব সৃষ্টির বৈজ্ঞানিক নিদর্শন',
      titleEn: 'Scientific signs in Quran & cosmology',
    },
    {
      titleBn: 'খাঁটি তওবা কবুল হওয়ার প্রধান শর্তগুলো কী?',
      titleEn: 'What are the core conditions of repentance?',
    },
  ];

  // Theme-based background and text classes
  const getContainerClasses = () => {
    if (!isReadingMode) {
      return 'bg-[#212121] text-zinc-100';
    }
    if (readingTheme === 'sepia') {
      return 'bg-[#fbf0d9] text-[#292524] font-serif';
    }
    if (readingTheme === 'book') {
      return 'bg-[#141416] text-[#e4e4e7]';
    }
    return 'bg-[#1a1a1c] text-[#e4e4e7]';
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-hidden relative transition-colors duration-200 ${getContainerClasses()}`}>
      {/* Top Header Bar */}
      <header className={`h-12 border-b px-3.5 flex items-center justify-between shrink-0 select-none ${
        isReadingMode 
          ? readingTheme === 'sepia'
            ? 'bg-[#f4e8cc] border-[#e7d8b5]'
            : 'bg-[#18181a] border-zinc-800'
          : 'bg-[#1e1e1e] border-zinc-800/80'
      }`}>
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 shrink">
          {!isReadingMode && (
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          {/* Model indicator */}
          <div className="flex items-center gap-1.5 px-1 py-1 rounded-lg truncate">
            <span className={`text-sm font-semibold tracking-tight whitespace-nowrap flex items-center gap-1 ${
              isReadingMode && readingTheme === 'sepia' ? 'text-stone-900' : 'text-zinc-100'
            }`}>
              DeenCore <span className="text-emerald-500 font-bold">AI</span>
            </span>
            <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium">
              3.1
            </span>
          </div>

          {/* Reading Mode indicator in header */}
          {isReadingMode && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full font-medium shrink-0">
              <BookOpen className="w-3 h-3" /> {isBn ? 'রিডিং মোড' : 'Reading Mode'}
            </span>
          )}
        </div>

        {/* Right Controls - Responsive & Guaranteed strictly within display */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 ml-auto">
          {/* Reading Mode Toolbar Controls (Active when in Reading Mode) */}
          {isReadingMode ? (
            <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/10 shrink-0">
              {/* Theme Switcher: Dark / Sepia / Book */}
              <button
                onClick={() => setReadingTheme('dark')}
                className={`p-1 rounded text-xs transition-colors ${readingTheme === 'dark' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('sepia')}
                className={`p-1 rounded text-xs transition-colors ${readingTheme === 'sepia' ? 'bg-amber-700 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Sepia Parchment Theme"
              >
                <Coffee className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReadingTheme('book')}
                className={`p-1 rounded text-xs transition-colors ${readingTheme === 'book' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
                title="Onyx Book Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              <div className="w-px h-3.5 bg-white/20 mx-0.5" />

              {/* Font Size Adjuster */}
              <button
                onClick={() => setReadingFontSize(prev => Math.max(13, prev - 1))}
                className="px-1 py-0.5 text-[11px] font-bold text-zinc-400 hover:text-white rounded hover:bg-white/10"
                title="Decrease font size"
              >
                A-
              </button>
              <span className="text-[10px] text-zinc-400 font-mono w-4 text-center">
                {readingFontSize}
              </span>
              <button
                onClick={() => setReadingFontSize(prev => Math.min(22, prev + 1))}
                className="px-1 py-0.5 text-[11px] font-bold text-zinc-400 hover:text-white rounded hover:bg-white/10"
                title="Increase font size"
              >
                A+
              </button>
            </div>
          ) : null}

          {/* Reading Mode Toggle Button */}
          <button
            onClick={onToggleReadingMode}
            className={`relative flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-medium transition-all duration-200 cursor-pointer shrink-0 ${
              isReadingMode
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-400'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700/60'
            }`}
            title={isReadingMode ? 'Exit Reading Mode' : 'Enter Book Reading Mode'}
          >
            {isReadingMode ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">{isBn ? 'প্রস্থান' : 'Exit'}</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{isBn ? 'রিডিং মোড' : 'Reading Mode'}</span>
              </>
            )}
          </button>

          {/* 3D Scene Toggle Button */}
          {!isReadingMode && (
            <button
              onClick={onToggle3D}
              className={`relative flex items-center gap-1 text-xs px-2 sm:px-2.5 py-1 rounded-lg border font-medium transition-all duration-200 cursor-pointer shrink-0 ${
                show3D
                  ? 'bg-amber-950/80 text-amber-200 border-amber-600/70 shadow-sm shadow-amber-900/30 ring-1 ring-amber-500/40'
                  : 'bg-zinc-800/60 text-zinc-500 border-zinc-700/40 hover:text-zinc-300'
              }`}
              title={show3D ? (isBn ? '৩D অন আছে' : '3D is ON') : (isBn ? '৩D অফ আছে' : '3D is OFF')}
            >
              {show3D ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="font-semibold text-amber-300 text-[11px] sm:text-xs">3D</span>
                  <span className="text-[9px] bg-amber-900/80 text-amber-300 px-1 py-0.2 rounded font-bold hidden sm:inline">ON</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-zinc-500" />
                  <span className="text-[11px] sm:text-xs">3D</span>
                </>
              )}
            </button>
          )}

          {/* Language Switcher - Compact on mobile */}
          <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-lg p-0.5 flex items-center text-xs shrink-0">
            <button
              onClick={() => onUpdateSettings({ ...settings, defaultLanguage: settings.defaultLanguage === 'bn' ? 'en' : 'bn' })}
              className="px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-medium bg-zinc-700 text-white transition-colors"
              title={isBn ? 'ভাষা পরিবর্তন করুন (Switch language)' : 'Change language (বাংলা/EN)'}
            >
              {settings.defaultLanguage === 'bn' ? 'বাং' : 'EN'}
            </button>
          </div>

          {/* Clear Current Chat */}
          {messages.length > 0 && !isReadingMode && (
            <button
              onClick={onClearCurrentChat}
              className="p-1 sm:p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              title={isBn ? 'চ্যাট পরিষ্কার করুন' : 'Clear chat'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* User Sign In pill if guest (Desktop only, mobile accesses via avatar) */}
          {!user.userId && (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-700/90 hover:bg-emerald-600 text-white border border-emerald-600/80 px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0"
              title={isBn ? 'গুগল বা ইমেইল দিয়ে সাইন ইন করুন' : 'Sign in with Google or Email'}
            >
              <LogIn className="w-3 h-3" />
              <span>{isBn ? 'লগইন' : 'Sign in'}</span>
            </button>
          )}

          {/* User Profile Avatar Button - Perfectly Scaled for Mobile (28px) and PC (32px), guaranteed within display */}
          <button
            onClick={onOpenProfile}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1.5 ring-emerald-500/70 hover:ring-emerald-400 transition-all cursor-pointer overflow-hidden shrink-0 aspect-square flex items-center justify-center bg-zinc-800 shadow-sm"
            title={isBn ? `${user.name} - প্রোফাইল দেখুন ও এডিট করুন` : `${user.name} - View & Edit Profile`}
          >
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`}
              alt={user.name}
              className="w-full h-full rounded-full object-cover aspect-square block"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`;
              }}
            />
          </button>
        </div>
      </header>

      {/* Messages Canvas */}
      <div className={`flex-1 overflow-y-auto px-4 py-6 ${isReadingMode ? 'max-w-4xl mx-auto w-full' : ''}`}>
        {/* Onboarding Banner when Guest */}
        {!user.userId && !isReadingMode && (
          <OnboardingBanner
            onOpenAuth={onOpenAuth}
            onGoogleSignIn={onGoogleSignIn}
            language={settings.defaultLanguage}
          />
        )}

        {messages.length === 0 ? (
          /* Empty State - With 3D Islamic Sanctum & Welcome Text */
          <div className="max-w-2xl mx-auto py-6 sm:py-10 text-center space-y-6">
            {/* 3D Islamic Scene Hero */}
            {show3D && (
              <div className="w-full max-w-sm h-56 sm:h-64 mx-auto rounded-3xl bg-gradient-to-b from-zinc-900/60 to-zinc-950/80 border border-zinc-800/80 shadow-2xl overflow-hidden relative group">
                <Islamic3DScene className="w-full h-full" />
                <div className="absolute top-2 left-3 text-[10px] text-zinc-500 font-mono pointer-events-none">
                  INTERACTIVE 3D SANCTUM
                </div>
              </div>
            )}

            {!show3D && (
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 mx-auto flex items-center justify-center text-emerald-400 font-bold text-sm">
                د
              </div>
            )}

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {isBn ? 'দ্বীন কোর এআই-তে স্বাগতম' : 'Welcome to Deen Core AI'}
              </h2>
              <p className="font-arabic text-lg text-emerald-400">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
                {isBn
                  ? 'পবিত্র কুরআন ও সহীহ হাদিস দ্বারা পরিচালিত নির্ভরযোগ্য এআই সহযোগী। প্রতিটি প্রশ্নের সঠিক ইসলামিক সমাধান।'
                  : 'Authentic Islamic AI companion strictly grounded in the Holy Quran & authentic Sunnah.'}
              </p>
            </div>

            {/* Quick Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left max-w-xl mx-auto pt-2">
              {samplePrompts.map((p, idx) => {
                const label = isBn ? p.titleBn : p.titleEn;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(label)}
                    className="p-3.5 rounded-xl bg-zinc-800/40 border border-zinc-700/60 hover:bg-zinc-800/90 hover:border-zinc-600 transition-colors text-left text-xs text-zinc-300 hover:text-white cursor-pointer"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className={`${isReadingMode ? 'max-w-3xl mx-auto space-y-8' : 'max-w-3xl mx-auto space-y-6'}`}>
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              const isSpeaking = speakingId === m.id;
              const isCopied = copiedId === m.id;
              const isSepia = isReadingMode && readingTheme === 'sepia';

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full`}
                >
                  {isUser ? (
                    /* User Bubble */
                    <div className={`max-w-[84%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      isSepia
                        ? 'bg-[#edd9b4] text-stone-900 border border-amber-300'
                        : 'bg-[#2f2f2f] text-zinc-100'
                    }`}>
                      {m.text}
                    </div>
                  ) : (
                    /* Assistant Message */
                    <div className="flex gap-3.5 max-w-full w-full">
                      {!isReadingMode && (
                        <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          د
                        </div>
                      )}

                      <div className="flex-1 space-y-3 min-w-0">
                        {/* Status Verdict Pill */}
                        {m.verdict && (
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            isSepia
                              ? 'bg-amber-100 text-stone-800 border-amber-300'
                              : 'bg-zinc-800/70 border-zinc-700/60 text-zinc-300'
                          }`}>
                            {m.isProhibited ? (
                              <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            )}
                            <span>{m.verdict}</span>
                          </div>
                        )}

                        {/* Parsed Clean Markdown Content */}
                        <div>
                          <FormattedMessage 
                            text={m.text} 
                            fontSize={readingFontSize} 
                            readingTheme={readingTheme}
                            isReadingMode={isReadingMode}
                          />
                        </div>

                        {/* Scripture Reference Quote */}
                        {m.scriptureRef && (
                          <div className={`p-3.5 rounded-xl border text-xs font-medium ${
                            isSepia
                              ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                              : 'bg-zinc-800/40 border-zinc-700/60 text-amber-200/90'
                          }`}>
                            <span className="font-semibold flex items-center gap-1.5 mb-1 text-emerald-600">
                              <BookOpen className="w-3.5 h-3.5" />
                              {isBn ? 'মূল সনদ ও দলিল:' : 'Scriptural Citation:'}
                            </span>
                            {m.scriptureRef}
                          </div>
                        )}

                        {/* Sources Badges */}
                        {m.sources && m.sources.length > 0 && (
                          <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              {isBn ? 'সূত্র:' : 'Sources:'}
                            </span>
                            {m.sources.map((src, idx) => (
                              <span
                                key={idx}
                                className={`text-[11px] px-2 py-0.5 rounded-md border ${
                                  isSepia 
                                    ? 'bg-amber-100/90 text-stone-800 border-amber-300'
                                    : 'bg-zinc-800 text-zinc-300 border-zinc-700/60'
                                }`}
                              >
                                {src}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons (Copy, Read aloud) */}
                        <div className="pt-1 flex items-center gap-1 text-zinc-500">
                          <button
                            onClick={() => handleCopy(m)}
                            className="p-1 hover:text-zinc-200 rounded hover:bg-zinc-800/60 transition-colors"
                            title={isCopied ? 'Copied' : 'Copy response'}
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleSpeak(m)}
                            className="p-1 hover:text-zinc-200 rounded hover:bg-zinc-800/60 transition-colors"
                            title={isSpeaking ? 'Stop audio' : 'Listen'}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Processing / Generating Indicator */}
            {isProcessing && (
              <div className="flex gap-3.5 items-center justify-start">
                <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700/80 text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                  د
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isBn
                      ? 'কুরআন ও হাদিসের আলোকে উত্তর তৈরি হচ্ছে...'
                      : 'Preparing verified Islamic response...'}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Bottom Input Area */}
      <div className={`p-3 shrink-0 ${
        isReadingMode 
          ? readingTheme === 'sepia' 
            ? 'bg-[#f4e8cc] border-t border-[#e7d8b5]' 
            : 'bg-[#18181a] border-t border-zinc-800'
          : 'bg-[#212121]'
      }`}>
        <div className="max-w-3xl mx-auto space-y-2">
          <div className={`border rounded-3xl flex items-end p-2 transition-colors shadow-sm ${
            isReadingMode && readingTheme === 'sepia'
              ? 'bg-[#faebd0] border-amber-300 focus-within:border-emerald-600'
              : 'bg-[#2f2f2f] border-zinc-700/60 focus-within:border-zinc-500'
          }`}>
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
              }}
              onKeyDown={handleKeyDown}
              placeholder={
                isBn
                  ? 'যেকোনো প্রশ্ন লিখুন (কুরআন ও হাদিসের আলোকে উত্তর পাবেন)...'
                  : 'Ask anything (grounded in Quran & authentic Hadith)...'
              }
              className={`flex-1 bg-transparent border-0 text-sm placeholder-zinc-400 focus:outline-none resize-none px-3 py-1.5 max-h-36 leading-relaxed ${
                isReadingMode && readingTheme === 'sepia' ? 'text-stone-900' : 'text-zinc-100'
              }`}
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 mb-0.5 mr-0.5 ${
                inputText.trim() && !isProcessing
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200 cursor-pointer shadow'
                  : 'bg-zinc-700/60 text-zinc-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-500 text-center">
            {isBn
              ? 'দ্বীন কোর এআই সম্পূর্ণ পবিত্র কুরআন ও সহীহ সুন্নাহ দ্বারা পরিচালিত।'
              : 'Deen Core AI responses are strictly grounded in the Holy Quran & authentic Sunnah.'}
          </p>
        </div>
      </div>
    </div>
  );
};
