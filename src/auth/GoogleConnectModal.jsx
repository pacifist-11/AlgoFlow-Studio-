import React, { useState } from 'react';
import { 
  getGoogleClientId,
  saveGoogleClientId,
  launchRealGoogleOAuth,
  continueAsGuest, 
  setOnboardingSeen
} from './userAuthService.js';

export default function GoogleConnectModal({ isOpen, onClose, onUserConnected }) {
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [inputClientId, setInputClientId] = useState('');

  const handleLaunchGoogleSignIn = (explicitClientId) => {
    setErrorMsg('');
    const clientId = (explicitClientId && typeof explicitClientId === 'string' ? explicitClientId : getGoogleClientId())?.trim();

    if (!clientId) {
      setShowSetup(true);
      setErrorMsg('To show your real Google accounts popup, a Google OAuth Client ID is required.');
      return;
    }

    setIsLoading(true);

    launchRealGoogleOAuth({
      clientId,
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

  const handleSaveAndConnect = () => {
    if (!inputClientId.trim()) {
      setErrorMsg('Please paste your Google Client ID first.');
      return;
    }
    const cleanId = inputClientId.trim();
    saveGoogleClientId(cleanId);
    setShowSetup(false);
    handleLaunchGoogleSignIn(cleanId);
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
          maxWidth: '440px',
          width: '100%',
          background: 'linear-gradient(145deg, #18181b, #0f172a)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.15)',
          borderRadius: '24px',
          padding: '2.4rem 2rem 2rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8fafc',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: 'center'
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

        {/* Google G Logo */}
        <div style={{
          width: '68px',
          height: '68px',
          margin: '0 auto 16px auto',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1.5px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        </div>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: '800',
          margin: '0 0 6px 0',
          color: '#ffffff',
          letterSpacing: '-0.4px'
        }}>
          Sign in with Google
        </h2>
        <p style={{
          fontSize: '0.92rem',
          color: '#94a3b8',
          margin: '0 0 1.8rem 0',
          lineHeight: '1.4'
        }}>
          Connect your Google account to auto-fill feedback and save your AI learning chat history.
        </p>

        {/* Benefits Cards */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '1.8rem',
          textAlign: 'left'
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
              <strong>Zero-Typing Feedback:</strong> Auto-fills your verified name &amp; email.
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
              <strong>Saved AI Chats:</strong> Persists your conversation across reloads.
            </div>
          </div>
        </div>

        {/* ── 1-Click Google Sign-In Button ── */}
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
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            borderRadius: '10px',
            padding: '10px 12px',
            fontSize: '0.82rem',
            marginTop: '12px',
            lineHeight: '1.4'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* ── 1-Time Google OAuth Configuration Helper ── */}
        {showSetup && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '14px',
            padding: '14px 16px',
            marginTop: '14px',
            textAlign: 'left',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>
                🔑 One-Time Google Setup
              </span>
              <a
                href="https://console.cloud.google.com/apis/credentials/oauthclient?project=gen-lang-client-0109695940"
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.78rem',
                  color: '#60a5fa',
                  textDecoration: 'underline',
                  fontWeight: '600'
                }}
              >
                Get Client ID from Google Cloud ↗
              </a>
            </div>

            <p style={{
              fontSize: '0.78rem',
              color: '#94a3b8',
              margin: '0 0 10px 0',
              lineHeight: '1.4'
            }}>
              Google requires a <strong>Web Client ID</strong> to show your accounts popup. In Google Console: select <em>Web application</em>, add <code>http://localhost:5173</code> under <em>Authorized JavaScript origins</em>, and paste the Client ID below:
            </p>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Paste Client ID (...apps.googleusercontent.com)"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveAndConnect();
                }}
                style={{
                  flex: 1,
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={handleSaveAndConnect}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 14px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#0369a1'}
                onMouseLeave={e => e.currentTarget.style.background = '#0284c7'}
              >
                Save &amp; Open
              </button>
            </div>
          </div>
        )}

        {/* Skip / Continue as Guest */}
        <div style={{
          marginTop: '1.6rem',
          paddingTop: '1rem',
          borderTop: '1px solid #27272a'
        }}>
          <button
            type="button"
            onClick={handleGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.82rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            Skip for now and continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
