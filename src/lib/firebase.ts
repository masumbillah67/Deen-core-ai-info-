import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';

export { onAuthStateChanged };
export type { User };
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocFromServer,
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ChatMessage, ChatSession, UserProfile, UserPrivacySettings } from '../types';

export const DEFAULT_PRIVACY: UserPrivacySettings = {
  profileVisibility: 'public',
  bioVisibility: 'public',
  emailVisibility: 'private',
  genderVisibility: 'public',
  socialVisibility: 'public',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Safe Error logger
export function logFirebaseError(error: unknown, context: string) {
  console.warn(`[Firebase] ${context}:`, error instanceof Error ? error.message : error);
}

// Proactively sanitize broken or disabled auth tokens from previous sessions to prevent token-service-api errors
if (typeof window !== 'undefined') {
  auth.onAuthStateChanged(async (currentUser) => {
    if (currentUser) {
      try {
        await currentUser.getIdToken();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('token-service-api') || msg.includes('securetoken.googleapis.com') || msg.includes('invalid-credential')) {
          console.warn('[Firebase] Stored token requires reset. Clearing to prevent backend connection errors.');
          await signOut(auth).catch(() => {});
        }
      }
    }
  });
}

// Validate connection to Firestore on boot (mandated by firebase skill)
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is operating in offline mode.');
    }
  }
}

if (typeof window !== 'undefined') {
  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1200);
}

// ----------------- AUTH SERVICES -----------------

// Google Sign-In (Primary configured provider)
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error) {
    logFirebaseError(error, 'Google Sign-In');
    throw error;
  }
}

// Email/Password Sign Up
export async function registerWithEmail(email: string, pass: string, displayName: string): Promise<User | null> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await syncUserProfile(result.user, displayName);
    }
    return result.user;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('token-service-api') || msg.includes('operation-not-allowed')) {
      throw new Error('EMAIL_AUTH_DISABLED_USE_GOOGLE');
    }
    logFirebaseError(error, 'Email Register');
    throw error;
  }
}

// Email/Password Sign In
export async function loginWithEmail(email: string, pass: string): Promise<User | null> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await syncUserProfile(result.user);
    }
    return result.user;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('token-service-api') || msg.includes('operation-not-allowed')) {
      throw new Error('EMAIL_AUTH_DISABLED_USE_GOOGLE');
    }
    logFirebaseError(error, 'Email Login');
    throw error;
  }
}

// Sign Out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    logFirebaseError(error, 'Sign Out');
  }
}

// Sync user profile to Firestore
export async function syncUserProfile(user: User, customName?: string): Promise<UserProfile> {
  const defaultUsername = (user.displayName || user.email?.split('@')[0] || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');

  const profile: UserProfile = {
    userId: user.uid,
    name: customName || user.displayName || user.email?.split('@')[0] || 'User',
    username: defaultUsername,
    email: user.email || 'guest@deen.ai',
    avatar: user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}&backgroundColor=059669`,
    bio: '',
    gender: 'brother',
    facebookUrl: '',
    privacy: { ...DEFAULT_PRIVACY },
    isConnectedWithGoogle: !!user.providerData.some(p => p.providerId === 'google.com'),
    joinedAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : new Date().toLocaleDateString(),
    totalQuestionsAsked: 0,
  };

  try {
    const userRef = doc(db, 'users', user.uid);
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      const data = existing.data();
      profile.totalQuestionsAsked = data.totalQuestionsAsked || 0;
      // Preserve and restore user's customized name, avatar, bio, gender, privacy, and socials!
      if (data.name) profile.name = data.name;
      if (data.username) profile.username = data.username;
      if (data.avatar) profile.avatar = data.avatar;
      if (data.bio !== undefined) profile.bio = data.bio;
      if (data.gender) profile.gender = data.gender;
      if (data.facebookUrl !== undefined) profile.facebookUrl = data.facebookUrl;
      if (data.privacy) profile.privacy = { ...DEFAULT_PRIVACY, ...data.privacy };
    }
  } catch (error) {
    logFirebaseError(error, 'Sync Profile to Firestore');
  }

  // Backup in localStorage
  localStorage.setItem(`deen_user_${user.uid}`, JSON.stringify(profile));
  return profile;
}

// Update Custom Profile (Name, Avatar) in Firestore
export async function updateUserProfileInDb(userId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    logFirebaseError(error, 'Update Profile in Firestore');
  }

  // Backup in localStorage
  try {
    const current = localStorage.getItem(`deen_user_${userId}`);
    if (current) {
      const parsed = JSON.parse(current);
      localStorage.setItem(`deen_user_${userId}`, JSON.stringify({ ...parsed, ...updates }));
    }
  } catch {
    // ignore
  }
}

// ----------------- FIRESTORE CHAT SERVICES -----------------

// Save or Update a Chat Session
export async function saveChatSessionToDb(userId: string, session: ChatSession): Promise<void> {
  try {
    const chatRef = doc(db, 'chats', session.id);
    await setDoc(chatRef, {
      id: session.id,
      userId,
      title: session.title,
      createdAt: session.createdAt,
      updatedAt: new Date().toISOString(),
      messagesCount: session.messages.length,
      messages: session.messages,
    }, { merge: true });

    // Store messages in subcollection as well
    const messagesCollection = collection(db, 'chats', session.id, 'messages');
    for (const msg of session.messages) {
      const msgRef = doc(messagesCollection, msg.id);
      await setDoc(msgRef, {
        id: msg.id,
        chatId: session.id,
        userId,
        sender: msg.sender,
        text: msg.text,
        verdict: msg.verdict || '',
        isProhibited: !!msg.isProhibited,
        sources: msg.sources || [],
        scriptureRef: msg.scriptureRef || '',
        timestamp: msg.timestamp,
        createdAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (error) {
    logFirebaseError(error, 'Save Chat to Firestore');
  }

  // Local cache backup
  try {
    const existing = localStorage.getItem(`deen_chats_${userId}`);
    const list: ChatSession[] = existing ? JSON.parse(existing) : [];
    const filtered = list.filter(s => s.id !== session.id);
    localStorage.setItem(`deen_chats_${userId}`, JSON.stringify([session, ...filtered]));
  } catch {
    // ignore
  }
}

// Load User Chat Sessions from Firestore
export async function loadUserChatsFromDb(userId: string): Promise<ChatSession[]> {
  try {
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);

    const loadedSessions: ChatSession[] = [];
    for (const docSnap of snapshot.docs) {
      const chatData = docSnap.data();
      let messages: ChatMessage[] = [];

      if (Array.isArray(chatData.messages) && chatData.messages.length > 0) {
        messages = chatData.messages;
      } else {
        // Fallback to subcollection query
        const msgsRef = collection(db, 'chats', docSnap.id, 'messages');
        const msgsSnap = await getDocs(msgsRef);
        messages = msgsSnap.docs.map(m => {
          const md = m.data();
          return {
            id: md.id || m.id,
            sender: md.sender,
            text: md.text,
            timestamp: md.timestamp || new Date().toLocaleTimeString(),
            verdict: md.verdict,
            isProhibited: md.isProhibited,
            sources: md.sources,
            scriptureRef: md.scriptureRef,
          };
        });
      }

      loadedSessions.push({
        id: chatData.id || docSnap.id,
        title: chatData.title || 'ইসলামিক চ্যাট',
        createdAt: chatData.createdAt || new Date().toLocaleDateString(),
        messages,
      });
    }

    if (loadedSessions.length > 0) {
      return loadedSessions;
    }
  } catch (error) {
    logFirebaseError(error, 'Load Chats from Firestore');
  }

  // Fallback to local storage
  const local = localStorage.getItem(`deen_chats_${userId}`);
  return local ? JSON.parse(local) : [];
}

// Delete Chat Session from Firestore
export async function deleteChatFromDb(chatId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'chats', chatId));
  } catch (error) {
    logFirebaseError(error, 'Delete Chat');
  }
}
