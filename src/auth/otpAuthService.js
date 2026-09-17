// ─── AlgoFlow 4-Digit PIN OTP Authentication Service ─────────────────────────
import { setActiveUser, saveSavedAccount, setOnboardingSeen } from './userAuthService.js';

/**
 * Check if the email or phone already has an account / real name in the database
 */
export async function lookupAccount(target) {
  if (!target || typeof target !== 'string' || !target.trim()) {
    return { exists: false };
  }
  try {
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'lookup', target: target.trim() })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Lookup account network notice:', err.message);
  }
  return { exists: false };
}

/**
 * Request a 4-digit PIN OTP sent to email
 */
export async function sendOtpPin(target) {
  if (!target || typeof target !== 'string' || !target.trim()) {
    throw new Error('Please enter a valid email address.');
  }

  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'send', target: target.trim() })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send 4-digit verification code.');
  }
  return data;
}

/**
 * Verify submitted 4-digit PIN and establish persistent user session
 */
export async function verifyOtpPin({ target, pin, name = '' }) {
  if (!pin || pin.length !== 4) {
    throw new Error('Please enter a valid 4-digit PIN.');
  }

  try {
    const res = await fetch('/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'verify',
        target: target.trim(),
        pin: pin.trim(),
        name: name.trim()
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Verification failed. Please check your PIN.');
    }

    if (data.user) {
      // Save user session permanently to local device
      setActiveUser(data.user);
      saveSavedAccount(data.user);
      return {
        ...data.user,
        isNewUser: !!data.isNewUser,
        wasRestored: !!data.wasRestored,
        serverMessage: data.message
      };
    }
    throw new Error('User profile missing from response.');
  } catch (err) {
    throw err;
  }
}
