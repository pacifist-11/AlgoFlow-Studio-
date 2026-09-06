import React, { useState, useEffect, useRef } from 'react';
import { 
  quickConnectUser, 
  continueAsGuest, 
  setOnboardingSeen,
  decodeGoogleJwt,
  setActiveUser
} from './userAuthService.js';

export default function GoogleConnectModal({ isOpen, onClose, onUserConnected }) {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialize official Google Identity Services (GIS) if Client ID is configured
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    // Load Google GIS script dynamically if not already loaded
    if (!window.google?.accounts?.id) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleGis(clientId);
      document.body.appendChild(script);
    } else {
      initGoogleGis(clientId);
    }

    function initGoogleGis(cId) {
      try {
        window.google.accounts.id.initialize({
          client_id: cId,
          callback: handleGoogleCredentialResponse,
          auto_select: false
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'filled_blue',
            size: 'large',
            shape: 'pill',
            text: 'continue_with',
            width: 320
          });
        }
      } catch (err) {
        console.warn('Google GIS initialization notice:', err);
      }
    }
  }, [isOpen]);

  const handleGoogleCredentialResponse = (response) => {
    if (!response?.credential) return;
    const decoded = decodeGoogleJwt(response.credential);
    if (decoded && decoded.email) {
      const profile = {
        email: decoded.email.toLowerCase(),
        name: decoded.name || decoded.given_name || 'AlgoFlow Student',
        picture: decoded.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(decoded.name || 'User')}&background=0284c7&color=fff&bold=true`,
        initial: (decoded.name?.[0] || 'U').toUpperCase(),
        sub: decoded.sub || `google_${decoded.email}`,
        isGuest: false,
        connectedAt: new Date().toISOString(),
        authProvider: 'google'
      };
      setActiveUser(profile);
      setOnboardingSeen();
      if (onUserConnected) onUserConnected(profile);
      if (onClose) onClose();
    }
  };

  const handleQuickConnect = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!emailInput || !emailInput.includes('@') || !emailInput.includes('.')) {
      setErrorMsg('Please enter a valid Google/Gmail address');
      return;
    }

    setIsSubmitting(true);
    try {
      const profile = quickConnectUser(emailInput, nameInput);
      if (profile) {
        if (onUserConnected) onUserConnected(profile);
        if (onClose) onClose();
      }
    } catch {
      setErrorMsg('Failed to connect. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        zIndex: 9999,
        background: 'rgba(5, 11, 24, 0.82)',
        backdropFilter: 'blur(12px)',
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
          maxWidth: '520px',
          width: '100%',
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(56, 189, 248, 0.15)',
          borderRadius: '24px',
          padding: '2.2rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#f8fafc'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={() => {
            setOnboardingSeen();
            onClose();
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#94a3b8',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
          }}
        >
          ✕
        </button>

        {/* Header Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.4rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 12px auto',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(129, 140, 248, 0.25))',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(56, 189, 248, 0.25)'
          }}>
            {/* Google G / Personalized Sparkle SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          </div>

          <h2 style={{
            fontSize: '1.65rem',
            fontWeight: '800',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #ffffff 40%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to AlgoFlow Studio
          </h2>
          <p style={{
            fontSize: '0.88rem',
            color: '#94a3b8',
            margin: 0,
            lineHeight: '1.4'
          }}>
            Connect with your existing Google account for seamless AI mentoring, saved chats, and instant feedback.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '8px',
          marginBottom: '1.4rem'
        }}>
          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.3rem' }}>⚡</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f1f5f9' }}>Zero-Typing Feedback &amp; Bug Reports</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Never re-type your name or email when submitting feedback.</div>
            </div>
          </div>

          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.3rem' }}>💾</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#38bdf8' }}>Saved AI Mentor Conversations</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Your DSA roadmaps, code debugs &amp; chats stay saved next time.</div>
            </div>
          </div>

          <div style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '1.3rem' }}>🧠</span>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#a78bfa' }}>Habituated AI Learning &amp; Topics</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>AlgoFlow AI remembers your frequent topics and favorite language.</div>
            </div>
          </div>
        </div>

        {/* Official Google Button (if GIS is configured) */}
        <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }} />

        {/* Smart Quick Connect Form */}
        <form onSubmit={handleQuickConnect} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Your Google / Gmail Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#0f172a',
              border: '1.5px solid #334155',
              borderRadius: '12px',
              padding: '0 12px',
              transition: 'border-color 0.2s'
            }}>
              <span style={{ marginRight: '8px', color: '#64748b' }}>✉</span>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
              Your Name <span style={{ fontWeight: '400', color: '#64748b' }}>(Optional)</span>
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#0f172a',
              border: '1.5px solid #334155',
              borderRadius: '12px',
              padding: '0 12px'
            }}>
              <span style={{ marginRight: '8px', color: '#64748b' }}>👤</span>
              <input
                type="text"
                placeholder="e.g. Yeswanth"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#f8fafc',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', marginTop: '2px' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '700',
              fontSize: '0.95rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
              transition: 'transform 0.15s, box-shadow 0.15s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>🔗 Connect with Google</span>
          </button>
        </form>

        {/* Skip / Guest Option */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={handleGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
          >
            Skip for now and continue as Guest →
          </button>
        </div>
      </div>
    </div>
  );
}
