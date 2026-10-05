import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Eye, EyeOff, ShieldCheck, ArrowRight, Check } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onAdminDetected
}) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Sign Up Form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdent, password: loginPass })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user, data.isAdmin);
        onClose();
        if (data.isAdmin && onAdminDetected) {
          onAdminDetected();
        }
      } else {
        setLoginError(data.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch {
      setLoginError('Server connection error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          phone: signupPhone,
          password: signupPass
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user, false);
        onClose();
      } else {
        setSignupError(data.error || 'Failed to create account.');
      }
    } catch {
      setSignupError('Server connection error. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '16px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                MV
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>
                Moon Venus Account
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              Access your orders, express checkout, and warranties
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#475569' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          borderBottom: '1px solid #E2E8F0',
          backgroundColor: '#F8FAFC'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('signin')}
            style={{
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: '700',
              borderBottom: activeTab === 'signin' ? '2px solid #0F172A' : 'none',
              backgroundColor: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'signin' ? '#0F172A' : '#64748B'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            style={{
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: '700',
              borderBottom: activeTab === 'signup' ? '2px solid #0F172A' : 'none',
              backgroundColor: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'signup' ? '#0F172A' : '#64748B'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Tab 1: Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Email or Username
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    required
                    type="text"
                    placeholder="name@example.com or admin"
                    value={loginIdent}
                    onChange={(e) => setLoginIdent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#334155' }}>
                    Password
                  </label>
                  <span style={{ fontSize: '0.75rem', color: '#2563EB', cursor: 'pointer' }}>
                    Forgot?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '12px', color: '#94A3B8' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: '600' }}>
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '0.925rem', marginTop: '6px' }}
              >
                {loginLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>

            {/* Discreet Admin Login Hint */}
            <div style={{
              marginTop: '20px',
              padding: '10px 12px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              fontSize: '0.725rem',
              color: '#64748B',
              lineHeight: '1.4'
            }}>
              💡 <strong>Merchant Owner:</strong> Entering admin username & password (<code>admin</code> / <code>admin123</code>) automatically unlocks the Admin Order Portal.
            </div>
          </form>
        )}

        {/* Tab 2: Create Account (Sign Up) */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aiswarya K. J."
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>
                  Set Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <input
                    required
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              </div>

              {signupError && (
                <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: '600' }}>
                  {signupError}
                </div>
              )}

              <button
                type="submit"
                disabled={signupLoading}
                className="btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '0.925rem', marginTop: '6px' }}
              >
                {signupLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
