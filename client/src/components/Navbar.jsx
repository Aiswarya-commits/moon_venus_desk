import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, PackageCheck, User, LogOut, ChevronDown,
  LayoutDashboard, Menu, X, ShieldAlert
} from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  onOpenTrack,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenAdmin
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Engineering & Welds', href: '#engineering' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'Specifications', href: '#specs' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Custom Enquiry', href: '#enquiry' },
    { label: 'FAQ', href: '#faq' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 900,
      backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#FFFFFF',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #E2E8F0',
      transition: 'all 0.25s ease'
    }}>
      <div className="container" style={{
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '800',
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}>
            MV
          </div>
          <div>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: '800',
              letterSpacing: '-0.03em',
              color: '#0F172A',
              lineHeight: 1.1
            }}>
              MOON VENUS
            </div>
            <div style={{
              fontSize: '0.6875rem',
              letterSpacing: '0.12em',
              fontWeight: '600',
              color: '#64748B',
              textTransform: 'uppercase'
            }}>
              Architectural Desks
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '28px'
        }} className="hide-mobile">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                color: '#475569',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.target.style.color = '#0F172A')}
              onMouseLeave={(e) => (e.target.style.color = '#475569')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Track Order Button */}
          <button
            onClick={onOpenTrack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
              fontWeight: '600',
              color: '#334155'
            }}
            title="Track your shipment"
          >
            <PackageCheck size={16} color="#2563EB" />
            <span className="hide-mobile">Track Order</span>
          </button>

          {/* User Sign In / Account Dropdown (No public Admin button) */}
          <div style={{ position: 'relative' }}>
            {currentUser ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: currentUser.role === 'admin' ? '#0F172A' : '#F1F5F9',
                    color: currentUser.role === 'admin' ? '#FFFFFF' : '#0F172A',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8125rem',
                    fontWeight: '700'
                  }}
                >
                  <User size={15} color={currentUser.role === 'admin' ? '#60A5FA' : '#0F172A'} />
                  <span>{currentUser.name ? currentUser.name.split(' ')[0] : 'Account'}</span>
                  <ChevronDown size={14} />
                </button>

                {/* Account Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '230px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-xl)',
                      border: '1px solid #E2E8F0',
                      padding: '12px',
                      zIndex: 1000,
                      animation: 'fadeIn 0.15s ease'
                    }}
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div style={{ padding: '4px 8px 10px', borderBottom: '1px solid #F1F5F9', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A' }}>
                        {currentUser.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', wordBreak: 'break-all' }}>
                        {currentUser.email}
                      </div>
                    </div>

                    {/* If Admin, show Merchant Admin Portal option here */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={onOpenAdmin}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          fontSize: '0.8125rem',
                          fontWeight: '700',
                          marginBottom: '6px',
                          textAlign: 'left'
                        }}
                      >
                        <LayoutDashboard size={15} />
                        Merchant Admin Portal
                      </button>
                    )}

                    <button
                      onClick={onOpenTrack}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        color: '#334155',
                        textAlign: 'left',
                        fontWeight: '500'
                      }}
                    >
                      <PackageCheck size={15} color="#2563EB" />
                      Track My Orders
                    </button>

                    <button
                      onClick={onSignOut}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        color: '#DC2626',
                        textAlign: 'left',
                        fontWeight: '600',
                        marginTop: '4px',
                        borderTop: '1px solid #F1F5F9'
                      }}
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Public Sign In Button */
              <button
                onClick={onOpenAuth}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8125rem',
                  fontWeight: '700',
                  color: '#0F172A',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            aria-label="View Shopping Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: '700',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              padding: '6px'
            }}
            className="show-mobile"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#1E293B',
                padding: '8px 0',
                borderBottom: '1px solid #F1F5F9'
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', gap: '10px', paddingTop: '10px' }}>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTrack(); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <PackageCheck size={16} color="#2563EB" />
              Track Order
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentUser) {
                  if (currentUser.role === 'admin') onOpenAdmin();
                  else onSignOut();
                } else {
                  onOpenAuth();
                }
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <User size={16} />
              {currentUser ? (currentUser.role === 'admin' ? 'Admin Portal' : 'Sign Out') : 'Sign In / Up'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
