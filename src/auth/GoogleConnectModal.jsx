import React, { useState, useEffect } from 'react';
import { 
  getGoogleClientId,
  saveGoogleClientId,
  launchRealGoogleOAuth,
  continueAsGuest, 
  setOnboardingSeen
} from './userAuthService.js';

export default function GoogleConnectModal({ isOpen, onClose, onUserConnected }) {
  const [clientId, setClientId] = useState(() => getGoogleClientId());
  const [clientIdInput, setClientIdInput] = useState(() => getGoogleClientId());
  const [isConfiguringKey, setIsConfiguringKey] = useState(() => !getGoogleClientId());
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const current = getGoogleClientId();
    setClientId(current);
    setClientIdInput(current);
    setIsConfiguringKey(!current);
  }, [isOpen]);

  const handleLaunchGoogleSignIn = () => {
    setErrorMsg('');
    const activeClientId = clientId || clientIdInput.trim();

    if (!activeClientId) {
      setIsConfiguringKey(true);
      setErrorMsg('Please enter your Google OAuth 2.0 Client ID to connect directly to Google.');
      return;
    }

    // Save client ID for future use
    saveGoogleClientId(activeClientId);
    setClientId(activeClientId);
    setIsLoading(true);

    launchRealGoogleOAuth({
      clientId: activeClientId,
      onUserSuccess: (profile) => {
        setIsLoading(false);
        if (onUserConnected) onUserConnected(profile);
        if (onClose) onClose();
      },
      onError: (err) => {
        setIsLoading(false);
        setErrorMsg(typeof err === 'string' ? err : 'Google Sign-In was cancelled or encountered an error.');
      }
    });
  };

  const handleSaveAndSignIn = (e) => {
    e.preventDefault();
    if (!clientIdInput.trim()) {
      setErrorMsg('Please enter a valid Google OAuth Client ID');
      return;
    }
    saveGoogleClientId(clientIdInput.trim());
    setClientId(clientIdInput.trim());
    setIsConfiguringKey(false);
    handleLaunchGoogleSignIn();
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
        zIndex: 9999,
        background: 'rgba(5, 11, 24, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => {
        setOnboardingSeen();
        onClose();
      }}
    >
      <div 
        className="modal-content"
        style={{
          maxWidth: '480px',
          width: '100%',
          background: 'linear-gradient(145deg, #18181b, #0f172a)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.15)',
          borderRadius: '24px',
          padding: '2.2rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setOnboardingSeen();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            color: '#71717a',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
          onMouseLeave={e => e.currentTarget.style.color = '#71717a'}
        >
          ✕
        </button>

        {/* Top Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            margin: '0 auto 12px auto',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(56,189,248,0.15))',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.2)'
          }}>
            {/* Official Google G Logo */}
            <svg width="34" height="34" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>

          <h2 style={{
            fontSize: '1.7rem',
            fontWeight: '800',
            margin: '0 0 6px 0',
            color: '#ffffff'
          }}>
            Connect with Google
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#94a3b8',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Sign in with your real Google account to auto-fill feedback and securely save your AI learning chats.
          </p>
        </div>

        {/* Benefits Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '1.6rem'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <div style={{ fontSize: '0.84rem', color: '#e2e8f0' }}>
              <strong>Zero-Typing Feedback:</strong> Auto-links your verified name &amp; email.
            </div>
          </div>

          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>💾</span>
            <div style={{ fontSize: '0.84rem', color: '#e2e8f0' }}>
              <strong>Saved AI Chats:</strong> Persists your conversations &amp; solutions per account.
            </div>
          </div>
        </div>

        {/* ── Main Google Sign-In Action ── */}
        {!isConfiguringKey ? (
          <div>
            <button
              onClick={handleLaunchGoogleSignIn}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                borderRadius: '14px',
                background: '#ffffff',
                color: '#1f2937',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>{isLoading ? 'Opening Google Account Chooser...' : 'Continue with Google'}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsConfiguringKey(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.76rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Change or inspect Google OAuth Client ID ⚙
              </button>
            </div>
          </div>
        ) : (
          /* ── Client ID Configuration Form ── */
          <form onSubmit={handleSaveAndSignIn} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1.5px solid #334155',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>
                🔑 Google OAuth 2.0 Client ID
              </label>
              {clientId && (
                <button
                  type="button"
                  onClick={() => setIsConfiguringKey(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              )}
            </div>

            <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: '0 0 10px 0', lineHeight: '1.4' }}>
              To open Google's real <strong>"Choose an account"</strong> popup from <code>accounts.google.com</code>, provide your Google Cloud OAuth Client ID:
            </p>

            <input
              type="text"
              placeholder="e.g. 123456789-xxxx.apps.googleusercontent.com"
              value={clientIdInput}
              onChange={e => setClientIdInput(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                background: '#090d16',
                border: '1.5px solid #334155',
                color: '#fff',
                fontSize: '0.84rem',
                outline: 'none',
                marginBottom: '10px',
                fontFamily: 'monospace'
              }}
            />

            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Save &amp; Open Google Sign-In
              </button>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#64748b', textAlign: 'center' }}>
              Don't have one? Create a free Web Client ID in{' '}
              <a 
                href="https://console.cloud.google.com/apis/credentials" 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: '#38bdf8', textDecoration: 'underline' }}
              >
                Google Cloud Console →
              </a>
            </div>
          </form>
        )}

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '0.8rem',
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Skip / Continue as Guest */}
        <div style={{
          marginTop: '1.4rem',
          paddingTop: '1rem',
          borderTop: '1px solid #27272a',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={handleGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.82rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#cbd5e1'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            Skip for now and continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
