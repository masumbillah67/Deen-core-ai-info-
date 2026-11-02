import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../types';
import { logOut, updateUserProfileInDb, DEFAULT_PRIVACY } from '../lib/firebase';
import { 
  X, 
  CheckCircle2, 
  LogOut, 
  Database, 
  Save, 
  Camera, 
  Globe, 
  Lock, 
  Copy, 
  Check, 
  Upload, 
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  language: 'bn' | 'en' | 'bilingual';
}

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/initials/svg?seed=Mumin&backgroundColor=059669',
  'https://api.dicebear.com/7.x/initials/svg?seed=Bilal&backgroundColor=047857',
  'https://api.dicebear.com/7.x/initials/svg?seed=Tariq&backgroundColor=0d9488',
  'https://api.dicebear.com/7.x/initials/svg?seed=Zubair&backgroundColor=0f766e',
  'https://api.dicebear.com/7.x/initials/svg?seed=Ahmad&backgroundColor=065f46',
  'https://api.dicebear.com/7.x/initials/svg?seed=Nur&backgroundColor=0284c7',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onOpenAuth,
  onSignOut,
  language,
}) => {
  const isBn = language !== 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [nameInput, setNameInput] = useState(user.name);
  const [usernameInput, setUsernameInput] = useState(
    user.username || (user.email ? user.email.split('@')[0] : 'user')
  );
  const [avatarInput, setAvatarInput] = useState(user.avatar);
  const [bioInput, setBioInput] = useState(user.bio || '');
  const [genderInput, setGenderInput] = useState<'brother' | 'sister' | 'unspecified'>(
    user.gender || 'brother'
  );
  const [isPublic, setIsPublic] = useState(
    user.privacy?.profileVisibility !== 'private'
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setNameInput(user.name);
    setUsernameInput(user.username || (user.email ? user.email.split('@')[0] : 'user'));
    setAvatarInput(user.avatar);
    setBioInput(user.bio || '');
    setGenderInput(user.gender || 'brother');
    setIsPublic(user.privacy?.profileVisibility !== 'private');
  }, [user]);

  if (!isOpen) return null;

  // Upload image from user's gallery / device
  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError(isBn ? 'একটি ছবি ফাইল নির্বাচন করুন' : 'Please select an image');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setAvatarInput(compressed);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyProfileLink = () => {
    const cleanUsername = (usernameInput || user.username || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '');
    const profileUrl = `https://deencore.ai/u/${cleanUsername}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(profileUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = profileUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsSaving(true);
    const cleanUsername = (usernameInput.trim() || user.username || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');

    const updated: UserProfile = {
      ...user,
      name: nameInput.trim(),
      username: cleanUsername,
      avatar: avatarInput.trim() || user.avatar,
      bio: bioInput.trim(),
      gender: genderInput,
      privacy: {
        ...(user.privacy || DEFAULT_PRIVACY),
        profileVisibility: isPublic ? 'public' : 'private',
        bioVisibility: isPublic ? 'public' : 'private',
      },
    };

    if (user.userId) {
      await updateUserProfileInDb(user.userId, {
        name: updated.name,
        username: updated.username,
        avatar: updated.avatar,
        bio: updated.bio,
        gender: updated.gender,
        privacy: updated.privacy,
      });
    }

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const cleanHandle = (usernameInput || user.username || 'user').toLowerCase().replace(/[^a-z0-9_]/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/75 backdrop-blur-xs select-none">
      {/* Normal, natural compact modal (330px max width) */}
      <div className="bg-[#1e1e1e] border border-zinc-800 rounded-2xl w-full max-w-[340px] shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Hidden gallery file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          className="hidden" 
          onChange={handleGalleryImageUpload} 
        />

        {/* Modal Top Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-[#191919]">
          <div className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-semibold text-white">
              {isBn ? 'ব্যবহারকারী প্রোফাইল' : 'User Profile'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="m-3 p-2 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isBn ? 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Profile saved successfully!'}</span>
          </div>
        )}

        {/* Form Body - Single Compact Natural Flow */}
        <form onSubmit={handleSaveProfile} className="p-4 space-y-3">
          
          {/* Avatar and Gallery Upload */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full overflow-hidden aspect-square border-2 border-emerald-500 bg-zinc-800 shadow flex items-center justify-center">
                <img
                  src={avatarInput || user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`}
                  alt="Avatar"
                  className="w-full h-full object-cover aspect-square block"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}&backgroundColor=059669`;
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 hover:bg-emerald-500 border border-[#1e1e1e] rounded-full text-white shadow cursor-pointer transition-transform hover:scale-110"
                title={isBn ? 'গ্যালারি থেকে ছবি আপলোড' : 'Upload from gallery'}
              >
                <Camera className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium py-1 px-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-950/70 transition-colors cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{isBn ? 'গ্যালারি থেকে ছবি দিন' : 'Upload photo'}</span>
              </button>
              
              {/* Preset Avatar Dots */}
              <div className="flex items-center gap-1.5 mt-1.5">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setAvatarInput(av)}
                    className={`w-4 h-4 rounded-full overflow-hidden border transition-transform hover:scale-115 cursor-pointer ${
                      avatarInput === av ? 'border-emerald-400 ring-1 ring-emerald-400' : 'border-zinc-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {uploadError && (
            <p className="text-[10px] text-red-400">{uploadError}</p>
          )}

          {/* Name & Handle */}
          <div className="space-y-2">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-0.5">
                {isBn ? 'নাম' : 'Display Name'}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="আপনার নাম"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <label className="text-[11px] font-medium text-zinc-400 block mb-0.5">
                  {isBn ? 'ইউজারনেম' : 'Username'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-zinc-500 font-mono text-xs">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-zinc-900 border border-zinc-750 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleCopyProfileLink}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] transition-colors cursor-pointer border border-zinc-700/60"
                  title={isBn ? 'প্রোফাইল লিঙ্ক কপি করুন' : 'Copy link'}
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">কপি!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>লিঙ্ক</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bio Input */}
          <div>
            <label className="text-[11px] font-medium text-zinc-400 block mb-0.5">
              {isBn ? 'বায়ো (Bio)' : 'Bio'}
            </label>
            <textarea
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              maxLength={120}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-750 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none transition-colors"
              placeholder={isBn ? 'যেমন: কুরআন ও হাদিসের শিক্ষার্থী...' : 'Brief bio...'}
            />
          </div>

          {/* Gender & Privacy Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Gender */}
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setGenderInput('brother')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  genderInput === 'brother'
                    ? 'bg-zinc-800 text-emerald-400 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🧔 ভাই
              </button>
              <button
                type="button"
                onClick={() => setGenderInput('sister')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                  genderInput === 'sister'
                    ? 'bg-zinc-800 text-emerald-400 font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🧕 বোন
              </button>
            </div>

            {/* Public/Private Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                isPublic
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800'
              }`}
              title={isPublic ? 'প্রোফাইল পাবলিক আছে' : 'প্রোফাইল প্রাইভেট আছে'}
            >
              {isPublic ? (
                <>
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>পাবলিক</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>প্রাইভেট</span>
                </>
              )}
            </button>
          </div>

          {/* 100% Private Chat Assurance Note */}
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>চ্যাট হিস্ট্রি সম্পূর্ণ প্রাইভেট</span>
            </span>
            <span className="text-emerald-400 font-medium">১০০% সুরক্ষিত</span>
          </div>

          {/* Save Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes')}</span>
            </button>
          </div>
        </form>

        {/* Modal Bottom: Sign Out or Sign In */}
        <div className="px-4 py-2.5 border-t border-zinc-800 bg-[#171717] flex items-center justify-between text-xs">
          {user.userId ? (
            <button
              onClick={async () => {
                await logOut();
                onSignOut();
                onClose();
              }}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>{isBn ? 'লগইন / ক্লাউড একাউন্ট' : 'Sign In / Cloud Account'}</span>
            </button>
          )}

          <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
            <Database className="w-2.5 h-2.5 text-emerald-400" />
            {user.userId ? 'DB Synced' : 'Guest'}
          </span>
        </div>

      </div>
    </div>
  );
};
