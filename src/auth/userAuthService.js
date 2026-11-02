// ─── AlgoFlow User Authentication & Personalization Service ─────────────────
// Real Google Identity Services (GIS) & OAuth 2.0 Integration

const ACTIVE_USER_KEY = 'algoflow_active_user';
const ONBOARDING_SEEN_KEY = 'algoflow_onboarding_seen';
const GOOGLE_CLIENT_ID_KEY = 'algoflow_google_client_id';
const DEFAULT_GOOGLE_CLIENT_ID = '896580003359-5dlc9jesa3728bvv3mgi8q6mn364pqiq.apps.googleusercontent.com';
const DEPRECATED_CLIENT_IDS = [
  '896580003359-2sgpbjbjukcidci5u1pbv7744fimamda.apps.googleusercontent.com'
];

/**
 * Resolve the Google OAuth Client ID (from env, localStorage, or default)
 */
export function getGoogleClientId() {
  // Purge any deprecated/deleted client IDs from localStorage
  try {
    const saved = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
    if (saved && (DEPRECATED_CLIENT_IDS.includes(saved.trim()) || saved.includes('2sgp'))) {
      localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
    } else if (saved && saved.trim()) {
      return saved.trim();
    }
  } catch {}

  try {
    const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (envId && envId.trim() && !DEPRECATED_CLIENT_IDS.includes(envId.trim()) && !envId.includes('2sgp')) {
      return envId.trim();
    }
  } catch {}

  return DEFAULT_GOOGLE_CLIENT_ID;
}

/**
 * Save Google OAuth Client ID
 */
export function saveGoogleClientId(clientId) {
  if (!clientId) return;
  try {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
  } catch {}
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
 * Log out current user
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

const SAVED_ACCOUNTS_KEY = 'algoflow_saved_accounts';

/**
 * Get list of accounts previously logged in on THIS specific device.
 * Strictly local to this browser for 100% privacy.
 */
export function getSavedAccounts() {
  try {
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (err) {
    console.warn('Failed to read saved accounts:', err);
  }
  const active = getActiveUser();
  if (active && active.email && !active.isGuest) {
    return [active];
  }
  return [];
}

/**
 * Save an account to the local device account switcher list
 */
export function saveSavedAccount(account) {
  if (!account || !account.email || account.isGuest) return;
  try {
    const current = getSavedAccounts();
    const filtered = current.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
    const updated = [{
      ...account,
      lastActive: new Date().toISOString()
    }, ...filtered].slice(0, 10);
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('algoflow_saved_accounts_changed', { detail: updated }));
  } catch (e) {
    console.warn('Failed to save account:', e);
  }
}

/**
 * Remove an account from this device's account switcher
 */
export function removeSavedAccount(email) {
  if (!email) return;
  try {
    const current = getSavedAccounts();
    const updated = current.filter(a => a.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('algoflow_saved_accounts_changed', { detail: updated }));
    
    const active = getActiveUser();
    if (active && active.email?.toLowerCase() === email.toLowerCase()) {
      if (updated.length > 0) {
        switchActiveAccount(updated[0]);
      } else {
        continueAsGuest();
      }
    }
  } catch (e) {
    console.warn('Failed to remove account:', e);
  }
}

/**
 * Switch active session to a selected saved account
 */
export function switchActiveAccount(account) {
  if (!account) return;
  const updatedProfile = {
    ...account,
    lastActive: new Date().toISOString()
  };
  saveSavedAccount(updatedProfile);
  setActiveUser(updatedProfile);
  setOnboardingSeen();
  return updatedProfile;
}

/**
 * Direct Backend Authentication & Neon DB synchronization
 */
export async function authenticateWithBackend({ credential, access_token, profile }) {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential, access_token, profile })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend sync notice (proceeding with verified client session):', err.message);
  }
  return null;
}

/**
 * REAL GOOGLE OAUTH 2.0 AUTHENTICATION
 * Launches Google's official popup with prompt="select_account"
 * Google's own servers at accounts.google.com display the "Choose an account" screen.
 * Verifies with Neon PostgreSQL backend and saves profile.
 */
export function launchRealGoogleOAuth({ clientId, onUserSuccess, onError }) {
  const resolvedClientId = clientId || getGoogleClientId();

  if (!resolvedClientId) {
    if (onError) onError('Google Client ID is missing. Please provide your Google OAuth Client ID.');
    return;
  }

  // Ensure Google Identity Services SDK is loaded
  function executeOAuth() {
    if (!window.google?.accounts?.oauth2) {
      if (onError) onError('Google Identity Services SDK is still loading. Please try again in 1 second.');
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: resolvedClientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (tokenResponse?.error) {
            if (onError) onError(tokenResponse.error_description || tokenResponse.error);
            return;
          }

          if (tokenResponse?.access_token) {
            try {
              // Real Google API call directly to Google's UserInfo endpoint
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });

              if (!res.ok) {
                throw new Error('Google UserInfo API returned error ' + res.status);
              }

              const userInfo = await res.json();
              if (!userInfo || !userInfo.email) {
                throw new Error('No email returned by Google account.');
              }

              const profile = {
                email: userInfo.email.toLowerCase().trim(),
                name: userInfo.name || userInfo.given_name || 'Google User',
                picture: userInfo.picture || '',
                initial: (userInfo.name?.[0] || userInfo.email?.[0] || 'U').toUpperCase(),
                sub: userInfo.sub,
                isGuest: false,
                connectedAt: new Date().toISOString(),
                authProvider: 'google',
                role: 'user'
              };

              // Real backend verification & Neon PostgreSQL DB sync
              const backendResult = await authenticateWithBackend({
                access_token: tokenResponse.access_token,
                profile
              });

              if (backendResult?.user) {
                profile.role = backendResult.user.role || profile.role;
                profile.dbId = backendResult.user.id;
              }

              saveSavedAccount(profile);
              setActiveUser(profile);
              setOnboardingSeen();
              if (onUserSuccess) onUserSuccess(profile);
            } catch (err) {
              console.error('Failed to fetch verified Google user profile:', err);
              if (onError) onError('Google verified token error: ' + err.message);
            }
          }
        }
      });

      // Triggers Google's real "Choose an account" popup
      client.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      console.error('Failed to trigger Google OAuth:', err);
      if (onError) onError('Google OAuth error: ' + err.message);
    }
  }

  if (!window.google?.accounts?.oauth2) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = executeOAuth;
    script.onerror = () => {
      if (onError) onError('Failed to load Google GIS SDK from accounts.google.com');
    };
    document.body.appendChild(script);
  } else {
    executeOAuth();
  }
}

/**
 * Decode JWT ID Token returned by Google Identity Services (GIS)
 */
export function decodeGoogleCredential(credential) {
  try {
    if (!credential || typeof credential !== 'string') return null;
    const parts = credential.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const atobFn = typeof window !== 'undefined' ? window.atob : null;
    if (!atobFn) return null;
    const jsonPayload = decodeURIComponent(
      atobFn(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.warn('Failed to decode Google JWT credential:', err);
    return null;
  }
}

// ─── User-Keyed Chat History Storage ─────────────────────────────────────────

export function getUserChatStorageKey(email) {
  if (email && email.includes('@')) {
    return `algoflow_chat_${email.trim().toLowerCase()}`;
  }
  return 'algoflow_chat_guest';
}

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

export function clearUserChatMessages(email) {
  try {
    const key = getUserChatStorageKey(email);
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to clear user chat history:', err);
  }
}

// ─── Multi-Session Chat Management (like Gemini, ChatGPT, Copilot) ───────────

export function getUserSessionsStorageKey(email) {
  if (email && email.includes('@')) {
    return `algoflow_sessions_${email.trim().toLowerCase()}`;
  }
  return 'algoflow_sessions_guest';
}

export function generateSessionTitle(query) {
  if (!query || typeof query !== 'string') return 'New Chat';
  let t = query.trim();
  t = t.replace(/^(can you please|could you please|please|can you|could you|help me with|help me|tell me about|explain to me|explain|what is the difference between|what is|what are|how do i|how to|why did|why does|what happens when|how does|what about)\s+/i, '');
  t = t.replace(/[?!.:;]+$/, '').trim();
  if (!t) return 'New Chat';
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (t.length > 34) {
    t = t.slice(0, 32).trim() + '…';
  }
  return t;
}

export function loadUserChatSessions(email) {
  try {
    const key = getUserSessionsStorageKey(email);
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load chat sessions:', err);
  }

  // Migrate legacy single chat if present
  const legacy = loadUserChatMessages(email);
  if (legacy && legacy.length > 0) {
    const firstQ = legacy.find(m => m.role === 'user');
    const title = firstQ ? generateSessionTitle(firstQ.text) : 'Previous Chat';
    const searchedQueries = legacy.filter(m => m.role === 'user').map(m => m.text).slice(0, 20);
    const legacySession = {
      id: `session_${Date.now()}`,
      title,
      createdAt: Date.now() - 1800000,
      updatedAt: Date.now(),
      searchedQueries,
      messages: legacy
    };
    saveUserChatSessions(email, [legacySession]);
    return [legacySession];
  }

  return [];
}

export function saveUserChatSessions(email, sessions) {
  if (!Array.isArray(sessions)) return;
  const key = getUserSessionsStorageKey(email);
  
  // Adaptive quota-safe persistence: reduces retention and prunes heavy image payloads if browser storage limit is reached
  let maxSessions = 20;
  let maxMessages = 30;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const toSave = sessions.slice(0, maxSessions).map((s, sIdx) => ({
        ...s,
        messages: Array.isArray(s.messages) ? s.messages.slice(-maxMessages).map((m, mIdx) => {
          // If past session or old message and quota pressure, drop heavy base64 image data to retain full conversation text
          if (attempt > 0 && m.image && (sIdx > 0 || mIdx < s.messages.length - 2)) {
            const { image: _, ...rest } = m;
            return rest;
          }
          return m;
        }) : []
      }));
      localStorage.setItem(key, JSON.stringify(toSave));
      return;
    } catch (err) {
      maxSessions = Math.max(5, Math.floor(maxSessions / 2));
      maxMessages = Math.max(10, Math.floor(maxMessages / 2));
      console.warn(`localStorage quota pressure, trimming to ${maxSessions} sessions:`, err);
    }
  }
}

// ─── Habituation & Learning Topics Tracker ───────────────────────────────────

export function getUserHabitsStorageKey(email) {
  if (email && email.includes('@')) {
    return `algoflow_habits_${email.trim().toLowerCase()}`;
  }
  return 'algoflow_habits_guest';
}

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

/**
 * Request account deactivation & reset.
 * In the background, Neon PostgreSQL tracks the user's request in account_deactivations
 * and resets their account so they can start fresh.
 */
export async function requestAccountDeactivation({ email, name = '', reason = '' }) {
  if (!email || !email.includes('@')) {
    throw new Error('Valid email address is required to deactivate account.');
  }

  try {
    const res = await fetch('/api/auth/deactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        name: name || '',
        reason: reason.trim() || 'User requested account deactivation / name reset'
      })
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to deactivate account.');
    }

    // 1. Remove from local saved accounts on this device
    removeSavedAccount(email);

    // 2. Clear all chat history, sessions, and habits for this deactivated email
    clearUserChatMessages(email);
    try {
      localStorage.removeItem(getUserSessionsStorageKey(email));
      localStorage.removeItem(getUserHabitsStorageKey(email));
    } catch {}

    // 3. Immediately log out the user from active state completely
    logoutUser();

    return data;
  } catch (err) {
    console.error('Account deactivation error:', err);
    throw err;
  }
}

