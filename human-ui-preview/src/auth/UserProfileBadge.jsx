import React, { useState, useEffect, useRef } from 'react';
import { getActiveUser, logoutUser, getTopUserHabits, requestAccountDeactivation } from './userAuthService.js';

export default function UserProfileBadge({ onOpenConnectModal, onOpenSettings }) {
  const [user, setUser] = useState(() => getActiveUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('Name is not right / want to reset account');
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState('');
  const badgeRef = useRef(null);

  const handleConfirmDeactivate = async () => {
    if (!user || !user.email) return;
    setIsDeactivating(true);
    setDeactivateError('');
    try {
      await requestAccountDeactivation({
        email: user.email,
        name: user.name,
        reason: deactivateReason
      });
      setIsDeactivating(false);
      setShowDeactivateModal(false);
      setDropdownOpen(false);
    } catch (err) {
      setIsDeactivating(false);
      setDeactivateError(err.message || 'Failed to deactivate account.');
    }
  };

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
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
          title="Sign in with your 4-Digit PIN or Email"
        >
          <span style={{ fontSize: '13px' }}>⚡</span>
          <span>Sign In (4-Pin)</span>
        </button>

        <button
          onClick={onOpenSettings}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '5px 11px',
            color: '#cbd5e1',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = '#cbd5e1';
          }}
          title="Open Settings"
        >
          <span>⚙️</span>
          <span>Settings</span>
        </button>
      </div>
    );
  }

  const topHabits = getTopUserHabits(user.email, 3);
  const scheduledSevenDaysDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div ref={badgeRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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

      <button
        onClick={onOpenSettings}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '5px 11px',
          color: '#cbd5e1',
          fontSize: '0.82rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.color = '#cbd5e1';
        }}
        title="Open Settings"
      >
        <span>⚙️</span>
        <span>Settings</span>
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

            {/* Account Actions: Logout & Deactivate surrounding each other */}
            <div style={{
              marginTop: '4px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <button
                onClick={() => {
                  logoutUser();
                  setDropdownOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
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

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setShowDeactivateModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#ef4444',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🗑️</span>
                <span>Deactivate / Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Account Deactivation / Delete Confirmation Modal (7-Day Grace Period) */}
      {showDeactivateModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowDeactivateModal(false)}
        >
          <div 
            style={{
              background: '#0f172a',
              border: '1.5px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(239,68,68,0.2)',
              color: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>🗑️</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ef4444' }}>
                  Deactivate &amp; Delete Account
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  7-Day Deletion Grace Period
                </span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Deactivating gives you a <strong>7-day grace period</strong> (similar to Instagram's 30-day policy). Your account data is scheduled for permanent deletion in 7 days.
            </p>

            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.8rem',
              color: '#fca5a5',
              lineHeight: '1.4'
            }}>
              📅 <strong>Scheduled Permanent Deletion:</strong> {scheduledSevenDaysDate}
              <div style={{ marginTop: '6px', color: '#cbd5e1' }}>
                💡 <strong>Restore anytime:</strong> If you change your mind, simply sign in with your email within 7 days to cancel deactivation and restore your account immediately.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                Reason for deactivating:
              </label>
              <select
                value={deactivateReason}
                onChange={e => setDeactivateReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  outline: 'none'
                }}
              >
                <option value="Name is not right / want to reset account">Name is not right / want to reset account</option>
                <option value="Created with improper email">Created with improper email</option>
                <option value="Taking a break">Taking a break</option>
                <option value="Want to start completely fresh">Want to start completely fresh</option>
                <option value="Privacy / account deletion request">Privacy / account deletion request</option>
              </select>
            </div>

            {deactivateError && (
              <div style={{ color: '#ef4444', fontSize: '0.82rem' }}>
                ⚠️ {deactivateError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#e2e8f0',
                  fontWeight: '600',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeactivate}
                disabled={isDeactivating}
                style={{
                  flex: 1.5,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.86rem',
                  cursor: isDeactivating ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                }}
              >
                {isDeactivating ? 'Deactivating...' : 'Schedule Deactivation (7 Days) →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
