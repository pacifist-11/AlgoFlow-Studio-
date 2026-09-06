// ─── AlgoFlow User Authentication & Personalization Service ─────────────────
// Real Google Identity Services (GIS) & OAuth 2.0 Integration

const ACTIVE_USER_KEY = 'algoflow_active_user';
const ONBOARDING_SEEN_KEY = 'algoflow_onboarding_seen';
const GOOGLE_CLIENT_ID_KEY = 'algoflow_google_client_id';

/**
 * Resolve the Google OAuth Client ID (from localStorage or Vite env)
 */
export function getGoogleClientId() {
  try {
    const saved = localStorage.getItem(GOOGLE_CLIENT_ID_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  try {
    const envId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (envId && envId.trim()) return envId.trim();
  } catch {}
  return '';
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

/**
 * REAL GOOGLE OAUTH 2.0 AUTHENTICATION
 * Launches Google's official popup with prompt="select_account"
 * Google's own servers at accounts.google.com display the "Choose an account" screen.
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
                authProvider: 'google'
              };

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
