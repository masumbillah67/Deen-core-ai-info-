import React, { useState, useMemo } from 'react';
import { ChatSession, UserProfile } from '../types';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Sliders, 
  Database,
  Cpu, 
  Scale, 
  Sparkles,
  ChevronLeft,
  LogIn,
  PenSquare,
  Search,
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onSelectTopic: (topicPrompt: string) => void;
  user: UserProfile;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  language: 'bn' | 'en' | 'bilingual';
  isOpen: boolean;
  onToggleSidebar: () => void;
  onToggleReadingMode?: () => void;
  isReadingMode?: boolean;
  onToggle3D?: () => void;
  show3D?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSelectTopic,
  user,
  onOpenProfile,
  onOpenSettings,
  onOpenAuth,
  language,
  isOpen,
  onToggleSidebar,
  onToggleReadingMode,
  isReadingMode = false,
  onToggle3D,
  show3D = true,
}) => {
  const isBn = language !== 'en';
  const [searchQuery, setSearchQuery] = useState('');

  const handleMobileClick = (action: () => void) => {
    action();
    if (window.innerWidth < 768) {
      onToggleSidebar();
    }
  };

  // Filter sessions based on search query
  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(session => {
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchMessage = session.messages.some(m => m.text.toLowerCase().includes(q));
      return matchTitle || matchMessage;
    });
  }, [sessions, searchQuery]);

  const topicPresets = [
    {
      icon: <Cpu className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'AI ও আধুনিক প্রযুক্তি',
      labelEn: 'AI & Modern Tech',
      prompt: isBn
        ? 'ইসলামের দৃষ্টিতে কৃত্রিম বুদ্ধিমত্তা (AI) এবং আধুনিক প্রযুক্তির ব্যবহার কি জায়েয?'
        : 'Is using Artificial Intelligence (AI) and modern technology permissible in Islam?',
    },
    {
      icon: <Scale className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'সুদ ও জুয়ার ইসলামী হুকুম',
      labelEn: 'Riba & Gambling Rulings',
      prompt: isBn
        ? 'ইসলামে ব্যাংক সুদ (Riba) এবং অনলাইন জুয়া/বেটিং কেন সম্পূর্ণ নাজায়েজ ও হারাম?'
        : 'Why are Interest (Riba) and online betting strictly prohibited in Islam?',
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-zinc-400" />,
      labelBn: 'কুরআন ও মহাবিশ্বের বিজ্ঞান',
      labelEn: 'Quran & Science',
      prompt: isBn
        ? 'পবিত্র কুরআনে মহাবিশ্ব সৃষ্টি, নক্ষত্র ও বিজ্ঞানের কী কী স্পষ্ট নিদর্শন রয়েছে?'
        : 'How does the Holy Quran speak about science, astronomy, and the universe?',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#171717] border-r border-zinc-800/80 flex flex-col transition-all duration-200 select-none ${
          isOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'
        }`}
      >
        {/* Top: Brand & New Chat */}
        <div className="p-3 border-b border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => handleMobileClick(onNewChat)}
            >
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-xs">
                د
              </div>
              <div>
                <span className="font-semibold text-xs text-zinc-100 tracking-tight flex items-center gap-1">
                  DeenCore <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] text-zinc-400 block">
                  কুরআন ও হাদিস মডেল
                </span>
              </div>
            </div>

            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1 text-zinc-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button (ChatGPT Style) */}
          <button
            onClick={() => handleMobileClick(onNewChat)}
            className="w-full flex items-center justify-between bg-zinc-800/70 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 font-medium py-2 px-3 rounded-lg text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>{isBn ? 'নতুন চ্যাট' : 'New chat'}</span>
            </span>
            <PenSquare className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* Search Bar for Past Chat Sessions */}
        <div className="px-3 pt-2.5 pb-1.5 border-b border-zinc-800/60">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'চ্যাট খুঁজুন...' : 'Search past chats...'}
              className="w-full bg-zinc-900/90 text-xs text-zinc-200 placeholder-zinc-500 rounded-lg pl-8 pr-7 py-1.5 border border-zinc-800 focus:outline-none focus:border-zinc-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-zinc-500 hover:text-zinc-300 p-0.5"
                title={isBn ? 'মুছুন' : 'Clear search'}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-zinc-400">
              <span>{isBn ? 'ফলাফল:' : 'Found:'} {filteredSessions.length}</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-emerald-400 hover:underline"
              >
                {isBn ? 'সব দেখান' : 'Show all'}
              </button>
            </div>
          )}
        </div>

        {/* Quick Islamic Topics */}
        <div className="p-2 border-b border-zinc-800/60">
          <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 px-2 block mb-1">
            {isBn ? 'প্রস্তাবিত বিষয়' : 'Topics'}
          </span>
          <div className="space-y-0.5">
            {topicPresets.map((tp, idx) => (
              <button
                key={idx}
                onClick={() => handleMobileClick(() => onSelectTopic(tp.prompt))}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors cursor-pointer text-left"
              >
                {tp.icon}
                <span className="truncate">{isBn ? tp.labelBn : tp.labelEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Previous Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
              {isBn ? 'পূর্ববর্তী কথোপকথন' : 'Chats'}
            </span>
            <span className="text-[10px] text-zinc-500">
              {filteredSessions.length}
            </span>
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs px-2">
              {searchQuery ? (
                <div>
                  <p>{isBn ? 'কোনো চ্যাট খুঁজে পাওয়া যায়নি' : 'No matching chats found'}</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-[11px] text-emerald-400 hover:underline"
                  >
                    {isBn ? 'সার্চ ক্লিয়ার করুন' : 'Clear search'}
                  </button>
                </div>
              ) : (
                isBn ? 'কোনো পূর্ববর্তী চ্যাট নেই' : 'No chats yet'
              )}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => handleMobileClick(() => onSelectSession(session.id))}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3 h-3 text-zinc-500 shrink-0" />
                    <span className="truncate">{session.title}</span>
                  </div>

                  <button
                    onClick={(e) => onDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 transition-opacity"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Mode Toggles (Compact) */}
        {(onToggleReadingMode || onToggle3D) && (
          <div className="px-3 py-1.5 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            {onToggleReadingMode && (
              <button
                onClick={() => handleMobileClick(onToggleReadingMode)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  isReadingMode
                    ? 'bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800/80'
                    : 'hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
                title={isBn ? 'রিডিং মোড' : 'Reading Mode'}
              >
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>{isBn ? 'রিডিং মোড' : 'Reading'}</span>
              </button>
            )}

            {onToggle3D && (
              <button
                onClick={onToggle3D}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  show3D
                    ? 'text-amber-300 font-semibold bg-amber-950/60 border border-amber-800/60'
                    : 'hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
                title={isBn ? '৩D ভিউ' : '3D View'}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isBn ? '৩D' : '3D'}</span>
              </button>
            )}
          </div>
        )}

        {/* Bottom User Area - Compact & User Friendly */}
        <div className="p-2 border-t border-zinc-800/80 bg-[#171717] flex items-center justify-between gap-1">
          {user.userId ? (
            /* Logged In User Profile */
            <button
              onClick={onOpenProfile}
              className="flex-1 flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors text-left cursor-pointer min-w-0"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 aspect-square border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`}
                  alt={user.name}
                  className="w-full h-full object-cover aspect-square block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-zinc-200 block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-zinc-400 block truncate font-mono">
                  @{user.username || 'user'}
                </span>
              </div>
            </button>
          ) : (
            /* Guest User Profile */
            <button
              onClick={onOpenProfile}
              className="flex-1 flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors text-left cursor-pointer min-w-0"
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden shrink-0 aspect-square border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Guest')}&backgroundColor=059669`}
                  alt={user.name}
                  className="w-full h-full object-cover aspect-square block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Guest')}&backgroundColor=059669`;
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-zinc-200 block truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-400 block truncate">
                  {isBn ? 'লগইন / প্রোফাইল' : 'Sign in / Profile'}
                </span>
              </div>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer shrink-0"
            title={isBn ? 'সেটিংস' : 'Settings'}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
};
