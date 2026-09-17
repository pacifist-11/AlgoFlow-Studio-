import React, { useState, useEffect, useRef } from 'react';
import { 
  getGoogleClientId,
  continueAsGuest, 
  setOnboardingSeen,
  getActiveUser,
  getSavedAccounts
} from './userAuthService.js';
import { lookupAccount, sendOtpPin, verifyOtpPin } from './otpAuthService.js';

// Deterministic pastel/vibrant colors for account avatars
function getAvatarBgColor(str = '') {
  const colors = [
    '#7e57c2', '#3949ab', '#00897b', '#1e293b', 
    '#d97706', '#0284c7', '#e11d48'
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Auto-extract and clean human-readable name from email address
export function formatNameFromEmail(email = '') {
  if (!email || typeof email !== 'string' || !email.includes('@')) return '';
  const prefix = email.split('@')[0].trim();
  if (!prefix) return '';

  // 1. If it is purely numbered (e.g. 2500032027@kluniversity.in), keep the number directly as name
  if (/^\d+$/.test(prefix)) {
    return prefix;
  }

  // 2. If it is a college roll code (e.g. 21b91a05h2), keep the student roll code
  if (/\d+[a-zA-Z]+\d+/.test(prefix)) {
    return prefix.toUpperCase();
  }

  // 3. Strip trailing numbers and noise suffixes (e.g. "piggu3275" -> "piggu", "88ff", "123", "99x")
  let clean = prefix.replace(/[._\-+]?\d+[a-zA-Z0-9]*$/, '');
  if (!clean) clean = prefix.replace(/\d+/g, '');
  if (!clean) return prefix;

  // 4. Split on common delimiters
  let parts = clean
    .replace(/[._\-+]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // 3. If there is only one part, check for common compound name suffixes
  if (parts.length === 1 && parts[0].length >= 7) {
    const word = parts[0].toLowerCase();
    const commonSuffixes = [
      'harsha', 'kumar', 'reddy', 'sharma', 'singh', 'patel', 'verma', 'gupta',
      'raju', 'rao', 'prasad', 'teja', 'krishna', 'chandra', 'varma', 'babu',
      'murthy', 'swamy', 'shekhar', 'deep', 'jeet', 'preet', 'nath', 'das'
    ];
    for (const suffix of commonSuffixes) {
      if (word.endsWith(suffix) && word.length > suffix.length + 2) {
        const first = word.slice(0, word.length - suffix.length);
        parts = [first, suffix];
        break;
      }
    }
  }

  // 4. Also check for common compound name prefixes
  if (parts.length === 1 && parts[0].length >= 7) {
    const word = parts[0].toLowerCase();
    const commonPrefixes = ['sai', 'siva', 'ram', 'devi', 'vijay', 'venkat', 'satya'];
    for (const pfx of commonPrefixes) {
      if (word.startsWith(pfx) && word.length > pfx.length + 2) {
        const rest = word.slice(pfx.length);
        parts = [pfx, rest];
        break;
      }
    }
  }

  if (parts.length === 0) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }

  // 5. Capitalize words cleanly
  return parts
    .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

export default function GoogleConnectModal({ isOpen, onClose, onUserConnected, currentTheme, onSelectTheme }) {
  const [activeTab, setActiveTab] = useState('otp'); // 'otp' | 'google'
  const [activeUser, setActiveUserState] = useState(() => getActiveUser());
  const [savedAccounts, setSavedAccounts] = useState(() => getSavedAccounts());

  // OTP Form States
  const [targetInput, setTargetInput] = useState('');
  const [recognizedName, setRecognizedName] = useState('');
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [otpStep, setOtpStep] = useState('input'); // 'input' | 'verify' | 'theme_select'
  const [pendingUser, setPendingUser] = useState(null);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [customNameInput, setCustomNameInput] = useState('');
  const [googleNotice, setGoogleNotice] = useState(false);

  const digitInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const lookupTimeoutRef = useRef(null);

  // Sync state on modal open
  useEffect(() => {
    if (isOpen) {
      const user = getActiveUser();
      setActiveUserState(user);
      setOtpError('');
      setOtpSuccess('');
      setGoogleNotice(false);
      setOtpStep('input');
      setTargetInput('');
      setRecognizedName('');
      setCustomNameInput('');
      setPinDigits(['', '', '', '']);
      setPendingUser(null);
      setActiveTab('otp');
    }
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  // Live real name lookup as user types email
  const handleTargetChange = (e) => {
    const val = e.target.value;
    setTargetInput(val);
    setOtpError('');

    if (lookupTimeoutRef.current) clearTimeout(lookupTimeoutRef.current);

    if (val.includes('@') && val.length > 3) {
      const derived = formatNameFromEmail(val);
      setRecognizedName(derived);
      setCustomNameInput(derived);

      setIsLookingUp(true);
      lookupTimeoutRef.current = setTimeout(async () => {
        const info = await lookupAccount(val);
        setIsLookingUp(false);
        if (info.exists && info.name) {
          setRecognizedName(info.name);
          setCustomNameInput(info.name);
          setIsExistingUser(true);
        } else {
          setIsExistingUser(false);
        }
      }, 350);
    } else {
      setRecognizedName('');
      setCustomNameInput('');
      setIsExistingUser(false);
    }
  };

  // 1. Send 4-Digit PIN
  const handleSendPin = async (e) => {
    if (e) e.preventDefault();
    if (!targetInput.trim()) {
      setOtpError('Please enter your email address.');
      return;
    }

    setOtpError('');
    setIsSending(true);
    try {
      const data = await sendOtpPin(targetInput.trim());
      setIsSending(false);
      setOtpStep('verify');
      setResendCooldown(60);
      if (data.recipientName) {
        setRecognizedName(data.recipientName);
        setCustomNameInput(data.recipientName);
      } else {
        const derived = formatNameFromEmail(targetInput.trim());
        setRecognizedName(derived);
        setCustomNameInput(derived);
      }

      setOtpSuccess(data.message || '4-digit verification PIN sent to your email!');
      setPinDigits(['', '', '', '']);

      // Focus first digit box
      setTimeout(() => {
        if (digitInputRefs[0]?.current) {
          digitInputRefs[0].current.focus();
        }
      }, 100);
    } catch (err) {
      setIsSending(false);
      setOtpError(err.message || 'Failed to send PIN.');
    }
  };

  // 2. Handle 4-Digit Box Input & Auto-Advance
  const handleDigitChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    
    // Handle paste of 4 digits
    if (clean.length > 1) {
      const pasted = clean.slice(0, 4).split('');
      const updated = [...pinDigits];
      pasted.forEach((d, i) => { updated[i] = d; });
      setPinDigits(updated);
      if (pasted.length === 4) {
        handleTriggerVerify(updated.join(''));
      }
      return;
    }

    const updated = [...pinDigits];
    updated[index] = clean;
    setPinDigits(updated);
    setOtpError('');

    // Advance to next box
    if (clean && index < 3) {
      digitInputRefs[index + 1]?.current?.focus();
    }

    // Auto-verify if all 4 digits entered
    if (clean && index === 3) {
      const fullPin = updated.join('');
      if (fullPin.length === 4) {
        handleTriggerVerify(fullPin);
      }
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      digitInputRefs[index - 1]?.current?.focus();
    }
  };

  // 3. Verify PIN
  const handleTriggerVerify = async (pinString) => {
    const code = pinString || pinDigits.join('');
    if (code.length !== 4) {
      setOtpError('Please enter all 4 digits.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      const nameToSend = recognizedName || customNameInput || formatNameFromEmail(targetInput.trim());
      const result = await verifyOtpPin({
        target: targetInput.trim(),
        pin: code,
        name: nameToSend
      });

      setIsVerifying(false);
      setActiveUserState(result);

      // Fresh user check: show theme picker with 2 dark & 2 white themes!
      if (result.isNewUser || !isExistingUser) {
        setPendingUser(result);
        setOtpStep('theme_select');
      } else {
        setOnboardingSeen();
        if (onUserConnected) onUserConnected(result);
        if (onClose) onClose();
      }
    } catch (err) {
      setIsVerifying(false);
      setOtpError(err.message || 'Incorrect PIN.');
    }
  };

  const handleGuest = () => {
    const guest = continueAsGuest();
    if (onUserConnected) onUserConnected(guest);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={() => {
        setOnboardingSeen();
        onClose();
      }}
    >
      <div 
        className="modal-content algoflow-auth-modal"
        style={{
          maxWidth: '680px',
          width: '100%',
          background: '#111827',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 32px rgba(56, 189, 248, 0.15)',
          borderRadius: '24px',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)'
          }}>
            ⚡
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.3px' }}>
              AlgoFlow Studio Authentication
            </h2>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
              Sign in once — your account is remembered automatically on this device
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.7)',
          padding: '5px',
          borderRadius: '14px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            onClick={() => setActiveTab('otp')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'otp' ? 'linear-gradient(135deg, #0284c7, #2563eb)' : 'transparent',
              color: activeTab === 'otp' ? '#ffffff' : '#94a3b8',
              fontWeight: activeTab === 'otp' ? '700' : '500',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'otp' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none'
            }}
          >
            <span>🔑</span>
            <span>4-Digit PIN OTP (Instant)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('google');
              setGoogleNotice(true);
            }}
            style={{
              padding: '9px 14px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'google' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              color: activeTab === 'google' ? '#f59e0b' : '#64748b',
              fontWeight: '600',
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>⚠️</span>
            <span>Google Auth <small style={{ opacity: 0.8, fontSize: '0.75rem' }}>(Under Progress)</small></span>
          </button>
        </div>

        {/* ── TAB 1: 4-DIGIT PIN OTP FLOW ── */}
        {activeTab === 'otp' && (
          <div>
            {otpStep === 'input' && (
              <form onSubmit={handleSendPin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '8px' }}>
                    Enter your Email Address:
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={targetInput}
                      onChange={handleTargetChange}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '13px 16px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: recognizedName ? '1.5px solid #10b981' : '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#ffffff',
                        fontSize: '0.96rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border 0.2s'
                      }}
                    />
                    {isLookingUp && (
                      <span style={{ position: 'absolute', right: '14px', top: '14px', fontSize: '12px', color: '#38bdf8' }}>
                        Checking DB...
                      </span>
                    )}
                  </div>
                </div>

                {/* Instant Name Recognition Display (Clean, No Edit Button) */}
                {recognizedName && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#6ee7b7',
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '15px' }}>{isExistingUser ? '👋' : '👤'}</span>
                    <span>
                      {isExistingUser ? (
                        <>Recognized account: <strong>{recognizedName}</strong> (welcome back!)</>
                      ) : (
                        <>Name: <strong>{recognizedName}</strong></>
                      )}
                    </span>
                  </div>
                )}

                {otpError && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '0.84rem'
                  }}>
                    ⚠️ {otpError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending}
                  style={{
                    padding: '13px 20px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: '700',
                    fontSize: '0.98rem',
                    cursor: isSending ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.18s'
                  }}
                >
                  {isSending ? (
                    <>
                      <span style={{ animation: 'spin 1s infinite linear' }}>⚡</span>
                      <span>Generating & Sending 4-Digit PIN...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 4-Digit PIN →</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: 4-Digit PIN Entry */}
            {otpStep === 'verify' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                    Enter 4-Digit PIN
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
                    Sent to <strong style={{ color: '#38bdf8' }}>{targetInput}</strong>
                    {recognizedName && <span> for <strong>{recognizedName}</strong></span>}
                  </p>
                </div>

                {/* 4 Pin Boxes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', margin: '8px 0' }}>
                  {pinDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={digitInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={digit}
                      onChange={e => handleDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleDigitKeyDown(idx, e)}
                      style={{
                        width: '58px',
                        height: '64px',
                        borderRadius: '14px',
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: digit ? '2px solid #38bdf8' : '1.5px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        textAlign: 'center',
                        outline: 'none',
                        boxShadow: digit ? '0 0 16px rgba(56, 189, 248, 0.4)' : 'none',
                        transition: 'all 0.15s'
                      }}
                    />
                  ))}
                </div>

                {/* Email Delivery Notice */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  fontSize: '0.82rem',
                  color: '#94a3b8',
                  maxWidth: '380px',
                  lineHeight: '1.4'
                }}>
                  <span>📬 We sent a 4-digit code to <strong style={{ color: '#38bdf8' }}>{targetInput}</strong>. Please check your inbox.</span>
                </div>

                {/* Signing In As Auto-Derived Name Display (Clean, No Edit Button) */}
                {recognizedName && (
                  <div style={{
                    fontSize: '0.84rem',
                    color: '#94a3b8',
                    marginTop: '2px',
                    textAlign: 'center'
                  }}>
                    Signing in as: <strong style={{ color: '#38bdf8' }}>{recognizedName}</strong>
                  </div>
                )}

                {otpError && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    fontSize: '0.84rem'
                  }}>
                    ⚠️ {otpError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('input');
                      setOtpError('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#cbd5e1',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ← Change Email Address
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTriggerVerify()}
                    disabled={isVerifying || pinDigits.some(d => !d)}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '12px',
                      background: isVerifying || pinDigits.some(d => !d) 
                        ? 'rgba(2, 132, 199, 0.3)' 
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: '700',
                      cursor: isVerifying || pinDigits.some(d => !d) ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {isVerifying ? 'Verifying PIN...' : 'Verify & Sign In ✓'}
                  </button>
                </div>

                {/* Resend button */}
                <div style={{ marginTop: '6px' }}>
                  {resendCooldown > 0 ? (
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Resend PIN available in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendPin}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        fontSize: '0.84rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Didn't get it? Resend 4-Digit PIN
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── STEP 3: FRESH USER THEME PICKER (2 Dark & 2 White Themes) ── */}
            {otpStep === 'theme_select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '30px' }}>✨</span>
                  <h3 style={{ margin: '4px 0 2px 0', fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>
                    Welcome to AlgoFlow, {pendingUser?.name || 'Friend'}!
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
                    Choose your workspace appearance to get started:
                  </p>
                </div>

                {/* 2 Dark & 2 White Themes Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {/* Dark Theme 1: Neon Cyberpunk */}
                  <div
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('Neon Cyberpunk');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: currentTheme === 'Neon Cyberpunk' ? 'rgba(0, 229, 255, 0.12)' : 'rgba(15, 23, 42, 0.75)',
                      border: currentTheme === 'Neon Cyberpunk' ? '2px solid #00e5ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentTheme === 'Neon Cyberpunk' ? '0 0 16px rgba(0, 229, 255, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#00e5ff' }}>
                        🌙 Dark
                      </span>
                      {currentTheme === 'Neon Cyberpunk' && (
                        <span style={{ color: '#00e5ff', fontSize: '0.82rem', fontWeight: 'bold' }}>✓ Selected</span>
                      )}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#ffffff' }}>
                      Neon Cyberpunk
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 10px 0' }}>
                      High-contrast neon glow on dark
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 8px #00e5ff' }} />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#d946ef', boxShadow: '0 0 8px #d946ef' }} />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>Cyan &amp; Magenta</span>
                    </div>
                  </div>

                  {/* Dark Theme 2: Cosmic Dark */}
                  <div
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('Cosmic Dark');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: currentTheme === 'Cosmic Dark' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(15, 23, 42, 0.75)',
                      border: currentTheme === 'Cosmic Dark' ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentTheme === 'Cosmic Dark' ? '0 0 16px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#60a5fa' }}>
                        🌙 Dark
                      </span>
                      {currentTheme === 'Cosmic Dark' && (
                        <span style={{ color: '#3b82f6', fontSize: '0.82rem', fontWeight: 'bold' }}>✓ Selected</span>
                      )}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#ffffff' }}>
                      Cosmic Dark
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 10px 0' }}>
                      Deep space navy &amp; rose accents
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' }} />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px #f43f5e' }} />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>Blue &amp; Rose</span>
                    </div>
                  </div>

                  {/* White Theme 1: Arctic Frost */}
                  <div
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('Arctic Frost');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: currentTheme === 'Arctic Frost' ? 'rgba(2, 132, 199, 0.15)' : 'rgba(248, 250, 252, 0.08)',
                      border: currentTheme === 'Arctic Frost' ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentTheme === 'Arctic Frost' ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#38bdf8' }}>
                        ☀️ White
                      </span>
                      {currentTheme === 'Arctic Frost' && (
                        <span style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 'bold' }}>✓ Selected</span>
                      )}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#ffffff' }}>
                      Arctic Frost
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 10px 0' }}>
                      Frosted ice-white with sky blue
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#0284c7', boxShadow: '0 0 8px #0284c7' }} />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#2563eb', boxShadow: '0 0 8px #2563eb' }} />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>Sky &amp; Royal</span>
                    </div>
                  </div>

                  {/* White Theme 2: Pure White Canvas */}
                  <div
                    onClick={() => {
                      if (onSelectTheme) onSelectTheme('Pure White Canvas');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: currentTheme === 'Pure White Canvas' ? 'rgba(79, 70, 229, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                      border: currentTheme === 'Pure White Canvas' ? '2px solid #818cf8' : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: currentTheme === 'Pure White Canvas' ? '0 0 16px rgba(129, 140, 248, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.1)', color: '#a5b4fc' }}>
                        ☀️ White
                      </span>
                      {currentTheme === 'Pure White Canvas' && (
                        <span style={{ color: '#818cf8', fontSize: '0.82rem', fontWeight: 'bold' }}>✓ Selected</span>
                      )}
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.94rem', color: '#ffffff' }}>
                      Pure White Canvas
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '4px 0 10px 0' }}>
                      Crisp paper white &amp; vivid indigo
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#4f46e5', boxShadow: '0 0 8px #4f46e5' }} />
                      <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#7c3aed', boxShadow: '0 0 8px #7c3aed' }} />
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>Indigo &amp; Purple</span>
                    </div>
                  </div>
                </div>

                {/* Reminder Text requested by user */}
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.22)',
                  fontSize: '0.84rem',
                  color: '#bae6fd',
                  textAlign: 'center'
                }}>
                  💡 You can change themes anytime in Settings ⚙️
                </div>

                {/* Finish Button */}
                <button
                  type="button"
                  onClick={() => {
                    setOnboardingSeen();
                    if (onUserConnected) onUserConnected(pendingUser || activeUser);
                    if (onClose) onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '0.96rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  Get Started →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: GOOGLE AUTH UNDER PROGRESS NOTICE ── */}
        {activeTab === 'google' && (
          <div style={{
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1.5px solid rgba(245, 158, 11, 0.35)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#fbbf24', fontSize: '1.15rem' }}>
              Google OAuth 2.0 is Under Progress
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#e2e8f0', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Google Identity OAuth verification is currently in development and undergoing verification in Google Cloud Console.
            </p>
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              color: '#94a3b8',
              marginBottom: '16px'
            }}>
              💡 Please use our <strong>⚡ 4-Digit PIN OTP</strong> method. It gives you instant access to all features, AI mentoring, and automatically saves your session forever!
            </div>
            <button
              onClick={() => setActiveTab('otp')}
              style={{
                padding: '10px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                border: 'none',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Switch to 4-Digit PIN OTP (Recommended) →
            </button>
          </div>
        )}

        {/* Footer: Skip as Guest only shown if NOT already logged in and on initial email input */}
        {(!activeUser || activeUser.isGuest) && otpStep === 'input' && (
          <div style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <button
              type="button"
              onClick={handleGuest}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              Skip for now and continue as Guest →
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginLeft: 'auto' }}>
              <span style={{ color: '#64748b' }}>
                🔒 Secure Authentication
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
