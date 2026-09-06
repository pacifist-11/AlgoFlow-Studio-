import React, { useState, useEffect, useRef } from 'react';
import { 
  getSavedAccounts,
  saveAccountToList,
  quickConnectUser, 
  continueAsGuest, 
  setOnboardingSeen,
  decodeGoogleJwt,
  setActiveUser
} from './userAuthService.js';

export default function GoogleConnectModal({ isOpen, onClose, onUserConnected }) {
  const [accounts, setAccounts] = useState(() => getSavedAccounts());
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const googleBtnRef = useRef(null);

  // Initialize official Google Identity Services (GIS) if Client ID is configured
  useEffect(() => {
    if (!isOpen) return;

    const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

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
          auto_select: false,
          prompt_parent_id: 'g-one-tap-container'
        });

        // Trigger Google native one tap prompt if active
        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn('Google GIS notice:', err);
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
      saveAccountToList({
        name: profile.name,
        email: profile.email,
        initial: profile.initial,
        color: '#0284c7'
      });
      setActiveUser(profile);
      setOnboardingSeen();
      if (onUserConnected) onUserConnected(profile);
      if (onClose) onClose();
    }
  };

  const handleSelectAccount = (acc) => {
    const profile = quickConnectUser(acc.email, acc.name);
    if (profile) {
      saveAccountToList(acc);
      if (onUserConnected) onUserConnected(profile);
      if (onClose) onClose();
    }
  };

  const handleAddNewAccount = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (!newEmail || !newEmail.includes('@') || !newEmail.includes('.')) {
      setErrorMsg('Please enter a valid Google/Gmail address');
      return;
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanName = newName.trim() || cleanEmail
      .split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    const newAcc = {
      name: cleanName,
      email: cleanEmail,
      initial: (cleanName[0] || 'U').toUpperCase(),
      color: '#0284c7'
    };

    saveAccountToList(newAcc);
    setAccounts(getSavedAccounts());
    handleSelectAccount(newAcc);
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
        background: 'rgba(5, 11, 24, 0.86)',
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
          maxWidth: '460px',
          width: '100%',
          background: '#18181b',
          border: '1px solid #27272a',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(56, 189, 248, 0.12)',
          borderRadius: '24px',
          padding: '2rem 1.8rem 1.6rem 1.8rem',
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
            background: 'transparent',
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

        {/* Top Header: Logo, Title & Mascot (Matching Google / Figma Layout) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.6rem' }}>
          <div>
            {/* AlgoFlow Colorful Logo Icon */}
            <div style={{ marginBottom: '14px' }}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="10" fill="#0f172a" />
                <path d="M12 12C12 9.79086 13.7909 8 16 8H20V16H16C13.7909 16 12 14.2091 12 12Z" fill="#F24E1E"/>
                <path d="M20 8H24C26.2091 8 28 9.79086 28 12C28 14.2091 26.2091 16 24 16H20V8Z" fill="#FF7262"/>
                <path d="M12 20C12 17.7909 13.7909 16 16 16H20V24H16C13.7909 24 12 22.2091 12 20Z" fill="#A259FF"/>
                <path d="M12 28C12 25.7909 13.7909 24 16 24H20V32H16C13.7909 32 12 30.2091 12 28Z" fill="#0ACF83"/>
                <circle cx="24" cy="20" r="4" fill="#1ABCFE"/>
              </svg>
            </div>

            <h2 style={{
              fontSize: '1.65rem',
              fontWeight: '700',
              margin: '0 0 4px 0',
              color: '#ffffff',
              letterSpacing: '-0.4px'
            }}>
              Choose an account
            </h2>
            <div style={{
              fontSize: '0.95rem',
              color: '#94a3b8'
            }}>
              to continue to <strong style={{ color: '#38bdf8' }}>AlgoFlow Studio</strong>
            </div>
          </div>

          {/* Cool Robot AI Mascot (like the mascot in Figma's Google dialog) */}
          <div style={{
            flexShrink: 0,
            animation: 'floatSlow 4s ease-in-out infinite',
            marginTop: '-5px'
          }}>
            <svg width="68" height="68" viewBox="0 0 64 64" fill="none">
              {/* Ears */}
              <circle cx="16" cy="18" r="8" fill="#475569" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="16" cy="18" r="5" fill="#e11d48" />
              <circle cx="48" cy="18" r="8" fill="#475569" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="48" cy="18" r="5" fill="#e11d48" />
              {/* Head / Helmet */}
              <rect x="14" y="16" width="36" height="28" rx="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
              {/* Face Visor */}
              <rect x="18" y="20" width="28" height="18" rx="9" fill="#090d16" />
              {/* Glowing Ninja Eyes */}
              <path d="M22 28L28 27L22 30Z" fill="#38bdf8" />
              <path d="M42 28L36 27L42 30Z" fill="#38bdf8" />
              {/* Cyber Mouth Line */}
              <path d="M28 34H36" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
              {/* Body */}
              <path d="M22 44L20 58H44L42 44H22Z" fill="#e11d48" />
              {/* Collar & Tech Badge */}
              <rect x="27" y="47" width="10" height="4" rx="2" fill="#38bdf8" />
            </svg>
          </div>
        </div>

        {/* ── Google Account Chooser List ── */}
        <div style={{
          borderTop: '1px solid #27272a',
          marginBottom: '1rem'
        }}>
          {accounts.map((acc, index) => {
            const isHovered = hoveredIdx === index;
            const bgLetterColor = acc.color || (index % 3 === 0 ? '#8b5cf6' : index % 3 === 1 ? '#3b82f6' : '#16a34a');

            return (
              <div
                key={acc.email}
                onClick={() => handleSelectAccount(acc)}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 10px',
                  borderBottom: '1px solid #27272a',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  transition: 'background 0.15s ease'
                }}
              >
                {/* Account Avatar Circle */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: bgLetterColor,
                  color: '#ffffff',
                  fontSize: '17px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                }}>
                  {acc.initial || acc.name?.[0] || 'U'}
                </div>

                {/* Account Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.94rem',
                    fontWeight: '600',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {acc.name}
                  </div>
                  <div style={{
                    fontSize: '0.84rem',
                    color: '#a1a1aa',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginTop: '1px'
                  }}>
                    {acc.email}
                  </div>
                </div>

                {/* Right Arrow on Hover */}
                {isHovered && (
                  <span style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 'bold' }}>
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Use Another Account Option ── */}
        {!isAddingNew ? (
          <div
            onClick={() => setIsAddingNew(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '10px',
              borderRadius: '12px',
              cursor: 'pointer',
              color: '#d4d4d8',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.color = '#38bdf8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#d4d4d8';
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              color: '#a1a1aa'
            }}>
              +
            </div>
            <span>Use another account</span>
          </div>
        ) : (
          <form onSubmit={handleAddNewAccount} style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid #334155',
            borderRadius: '14px',
            padding: '12px',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' }}>
              Add Another Google Account:
            </div>
            <input
              type="email"
              placeholder="Enter your Gmail address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                background: '#090d16',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
                marginBottom: '8px'
              }}
            />
            <input
              type="text"
              placeholder="Full Name (optional)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: '#090d16',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.88rem',
                outline: 'none',
                marginBottom: '8px'
              }}
            />
            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '8px' }}>
                ⚠️ {errorMsg}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid #475569',
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Benefits Note & Skip Option */}
        <div style={{
          marginTop: '1.2rem',
          paddingTop: '1rem',
          borderTop: '1px solid #27272a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem'
        }}>
          <span style={{ color: '#71717a' }}>
            ✓ Auto-fills feedback • Saves chats
          </span>
          <button
            type="button"
            onClick={handleGuest}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.78rem'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            Continue as Guest →
          </button>
        </div>

        {/* Google One Tap Anchor Container */}
        <div id="g-one-tap-container" style={{ position: 'absolute', top: '10px', right: '10px' }} />
      </div>
    </div>
  );
}
