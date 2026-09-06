import React, { useState, useEffect, useRef } from 'react';
import { getActiveUser, logoutUser, getTopUserHabits } from './userAuthService.js';

export default function UserProfileBadge({ onOpenConnectModal, onOpenSettings }) {
  const [user, setUser] = useState(() => getActiveUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const badgeRef = useRef(null);

  useEffect(() => {
    const handleAuthChange = (e) => {
      setUser(e.detail);
    };
    window.addEventListener('algoflow_auth_changed', handleAuthChange);
    return () => window.removeEventListener('algoflow_auth_changed', handleAuthChange);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (badgeRef.current && !badgeRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || user.isGuest) {
    return (
      <button
        onClick={onOpenConnectModal}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '20px',
          padding: '5px 12px',
          color: '#38bdf8',
          fontSize: '0.82rem',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
          e.currentTarget.style.borderColor = '#38bdf8';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
        }}
        title="Connect your Google Account to save chats and auto-fill feedback"
      >
        <span style={{ fontSize: '13px' }}>🔗</span>
        <span>Connect Google</span>
      </button>
    );
  }

  const topHabits = getTopUserHabits(user.email, 3);

  return (
    <div ref={badgeRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: '20px',
          padding: '4px 10px 4px 5px',
          color: '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)'}
      >
        {user.picture ? (
          <img 
            src={user.picture} 
            alt={user.name} 
            style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} 
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold',
          display: user.picture ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {user.initial || user.name?.[0] || 'U'}
        </div>
        <span style={{ fontSize: '0.82rem', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name.split(' ')[0]}
        </span>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '260px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1.5px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '14px',
          boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
          zIndex: 9999,
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* User Info Header */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
            <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#f8fafc' }}>
              {user.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', wordBreak: 'break-all', marginTop: '2px' }}>
              {user.email}
            </div>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginTop: '6px', 
              fontSize: '0.7rem', 
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.12)',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              <span>✓ Google Verified</span>
            </div>
          </div>

          {/* Habituated Topics */}
          {topHabits.length > 0 && (
            <div style={{ fontSize: '0.75rem' }}>
              <div style={{ color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>
                🧠 Habituated Topics:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {topHabits.map((topic, i) => (
                  <span key={i} style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#e2e8f0',
                    fontSize: '0.7rem'
                  }}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px' }}>
            <button
              onClick={() => {
                setDropdownOpen(false);
                if (onOpenSettings) onOpenSettings();
              }}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e2e8f0',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>⚙️</span>
              <span>Account &amp; Settings</span>
            </button>

            <button
              onClick={() => {
                logoutUser();
                setDropdownOpen(false);
              }}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#f87171',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🚪</span>
              <span>Log out from this email</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
