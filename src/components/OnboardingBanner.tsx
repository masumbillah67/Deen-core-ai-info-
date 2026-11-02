import React, { useState } from 'react';
import { Database, ShieldCheck, LogIn, X, Sparkles } from 'lucide-react';

interface OnboardingBannerProps {
  onOpenAuth: () => void;
  onGoogleSignIn: () => void;
  language: 'bn' | 'en' | 'bilingual';
}

export const OnboardingBanner: React.FC<OnboardingBannerProps> = ({
  onOpenAuth,
  onGoogleSignIn,
  language,
}) => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('deen_auth_banner_dismissed') === 'true';
  });

  if (dismissed) return null;

  const isBn = language !== 'en';

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('deen_auth_banner_dismissed', 'true');
  };

  return (
    <div className="relative mx-auto max-w-3xl mb-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#1b2520] to-zinc-900 border border-emerald-800/40 shadow-lg text-zinc-200">
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 p-1 text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-800/60 transition-colors"
        title={isBn ? 'বাতিল করুন' : 'Dismiss'}
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 pr-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                {isBn ? 'ফায়ারবেস ক্লাউড ডাটাবেজ সংযুক্ত' : 'Firebase Cloud Database Active'}
              </h4>
              <span className="text-[10px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 px-1.5 py-0.2 rounded-full font-medium">
                Live
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-relaxed">
              {isBn
                ? 'গুগল বা জিমেইল অ্যাকাউন্ট দিয়ে সাইন ইন করুন—যাতে আপনার সকল ইসলামিক প্রশ্ন, দলিল ও চ্যাট হিস্ট্রি আজীবন ক্লাউডে সংরক্ষিত থাকে এবং পুনরায় লগইন করলেও সব ফেরত পাওয়া যায়।'
                : 'Sign in with Google or Email/Password to automatically backup and sync your verified Islamic Q&A and chat history permanently to the cloud.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
          <button
            onClick={onGoogleSignIn}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            onClick={onOpenAuth}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isBn ? 'ইমেইল লগইন' : 'Email Login'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
