// ─── AlgoFlow User Authentication & Personalization Service ─────────────────
// Handles Google Identity Services (GIS), Smart Quick Connect, and Habituation

const ACTIVE_USER_KEY = 'algoflow_active_user';
const ONBOARDING_SEEN_KEY = 'algoflow_onboarding_seen';
const SAVED_ACCOUNTS_KEY = 'algoflow_saved_accounts_list';

export const DEFAULT_SAVED_ACCOUNTS = [
  {
    name: 'Yeswanth Pothala',
    email: 'pothalayeswanth11@gmail.com',
    initial: 'Y',
    color: '#8b5cf6'
  },
  {
    name: 'Yeswanth Pothala',
    email: 'pothalayeswanth29@gmail.com',
    initial: 'Y',
    color: '#8b5cf6'
  },
  {
    name: 'kannamnaidu kolli',
    email: 'kannamnaidukolli54@gmail.com',
    initial: 'k',
    color: '#3b82f6'
  },
  {
    name: 'Pothala Yegnashe',
    email: 'piggu3275@gmail.com',
    initial: 'P',
    color: '#16a34a'
  }
];

export function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading saved accounts list:', err);
  }
  return DEFAULT_SAVED_ACCOUNTS;
}

export function saveAccountToList(account) {
  if (!account || !account.email) return;
  try {
    const existing = getSavedAccounts();
    const filtered = existing.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
    const updated = [account, ...filtered];
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error saving account to list:', err);
  }
}

/**
 * Decode JWT token returned by Google Identity Services
 */
export function decodeGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to decode Google JWT:', err);
    return null;
  }
}

/**
 * Get the currently logged-in user profile
 */
export function getActiveUser() {
  try {
    const raw = localStorage.getItem(ACTIVE_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.email || parsed.name)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading active user:', err);
  }
  return null;
}

/**
 * Save user profile and dispatch update event
 */
export function setActiveUser(userProfile) {
  try {
    if (!userProfile) {
      localStorage.removeItem(ACTIVE_USER_KEY);
    } else {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify({
        ...userProfile,
        lastActive: new Date().toISOString()
      }));
    }
    // Notify all active React components
    window.dispatchEvent(new CustomEvent('algoflow_auth_changed', { detail: userProfile }));
  } catch (err) {
    console.error('Failed to save active user:', err);
  }
}

/**
 * Log out current user (preserves their stored chat and habits in localStorage)
 */
export function logoutUser() {
  try {
    localStorage.removeItem(ACTIVE_USER_KEY);
    window.dispatchEvent(new CustomEvent('algoflow_auth_changed', { detail: null }));
  } catch (err) {
    console.error('Failed to logout user:', err);
  }
}

/**
 * Check if the user has completed or dismissed first-time onboarding
 */
export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Mark onboarding as seen
 */
export function setOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, 'true');
  } catch {}
}

/**
 * Quick-connect an existing email address
 */
export function quickConnectUser(email, name = '') {
  if (!email || !email.includes('@')) return null;
  const cleanEmail = email.trim().toLowerCase();
  
  // Format default name from email if not provided (e.g. yeswanth.pothala -> Yeswanth Pothala)
  const inferredName = name.trim() || cleanEmail
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());

  // Generate deterministic avatar initials or dicebear image
  const initial = (inferredName[0] || 'A').toUpperCase();
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(inferredName)}&background=0284c7&color=fff&bold=true&rounded=true`;

  const profile = {
    email: cleanEmail,
    name: inferredName,
    picture: avatarUrl,
    initial,
    sub: `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
    isGuest: false,
    connectedAt: new Date().toISOString(),
    authProvider: 'google'
  };

  setActiveUser(profile);
  setOnboardingSeen();
  return profile;
}

/**
 * Continue as Guest
 */
export function continueAsGuest() {
  const guestProfile = {
    email: '',
    name: 'Guest Explorer',
    picture: '',
    initial: 'G',
    sub: 'guest_' + Date.now(),
    isGuest: true,
    connectedAt: new Date().toISOString(),
    authProvider: 'guest'
  };
  setActiveUser(guestProfile);
  setOnboardingSeen();
  return guestProfile;
}

// ─── User-Keyed Chat History Storage ─────────────────────────────────────────

export function getUserChatStorageKey(email) {
  if (email && email.includes('@')) {
    return `algoflow_chat_${email.trim().toLowerCase()}`;
  }
  return 'algoflow_chat_guest';
}

/**
 * Load chat messages for the given user email
 */
export function loadUserChatMessages(email) {
  try {
    const key = getUserChatStorageKey(email);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load user chat history:', err);
  }
  return null;
}

/**
 * Save chat messages for the given user email (max 60 messages)
 */
export function saveUserChatMessages(email, messages) {
  try {
    if (!Array.isArray(messages)) return;
    const key = getUserChatStorageKey(email);
    const toSave = messages.slice(-60);
    localStorage.setItem(key, JSON.stringify(toSave));
  } catch (err) {
    console.warn('Failed to save user chat history:', err);
  }
}

/**
 * Clear chat messages for the given user email
 */
export function clearUserChatMessages(email) {
  try {
    const key = getUserChatStorageKey(email);
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to clear user chat history:', err);
  }
}

// ─── Habituation & Learning Topics Tracker ───────────────────────────────────

export function getUserHabitsStorageKey(email) {
  if (email && email.includes('@')) {
    return `algoflow_habits_${email.trim().toLowerCase()}`;
  }
  return 'algoflow_habits_guest';
}

/**
 * Track when a user interacts with a specific topic or visualizer
 */
export function trackUserHabit(email, topic) {
  if (!topic || typeof topic !== 'string') return;
  try {
    const key = getUserHabitsStorageKey(email);
    const raw = localStorage.getItem(key);
    let habits = raw ? JSON.parse(raw) : {};

    const cleanTopic = topic.trim();
    habits[cleanTopic] = (habits[cleanTopic] || 0) + 1;

    localStorage.setItem(key, JSON.stringify(habits));
  } catch (e) {
    console.warn('Failed to record user habit:', e);
  }
}

/**
 * Get top habituated topics for the user
 */
export function getTopUserHabits(email, limit = 5) {
  try {
    const key = getUserHabitsStorageKey(email);
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const habits = JSON.parse(raw);
    return Object.entries(habits)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([t]) => t);
  } catch {
    return [];
  }
}
