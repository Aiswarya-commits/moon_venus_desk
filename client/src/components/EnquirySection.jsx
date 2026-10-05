import React from 'react';
import { MessageSquare, PhoneCall, Sparkles, Building2, Ruler, ShieldCheck, ArrowRight } from 'lucide-react';

export default function EnquirySection({ onOpenEnquiry }) {
  const handleDirectChat = () => {
    const text = encodeURIComponent("Hello Moon Venus! I would like to enquire about your Horizon Desk and available customization options.");
    window.open(`https://wa.me/919123456789?text=${text}`, '_blank');
  };

  return (
    <section style={{
      padding: '72px 0',
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
          gap: '40px',
          alignItems: 'center'
        }} className="hero-grid">
          {/* Left Column: Brand Statement & Offer */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(37, 211, 102, 0.15)',
              color: '#4ADE80',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              <MessageSquare size={14} />
              <span>Instant WhatsApp Concierge</span>
            </div>

            <h2 className="heading-lg" style={{ color: '#FFFFFF', marginBottom: '14px' }}>
              Need a Custom Desk Size or Corporate Bulk Order?
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6', marginBottom: '28px' }}>
              Speak directly with our engineering team on WhatsApp. Whether you need custom table dimensions, cable cutout configurations, or corporate studio discounts — we build to your exact workspace requirements.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenEnquiry}
                style={{
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  padding: '14px 26px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.35)'
                }}
              >
                <MessageSquare size={18} />
                <span>Submit Enquiry Form</span>
              </button>

              <button
                onClick={handleDirectChat}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '14px 22px',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>Direct 1-Click WhatsApp</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: Key Perks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '14px'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(37,211,102,0.15)',
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Ruler size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  Custom Sizing & Cable Grommets
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: '1.5' }}>
                  Need 180cm, 200cm, or custom L-desk layouts? We precision laser-cut cold-rolled frames to your specifications.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(96,165,250,0.15)',
                color: '#60A5FA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  Architectural & Corporate Bulk Pricing
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: '1.5' }}>
                  Furnishing a design agency, software studio, or executive suite? Enjoy tier-based B2B discounts and turnkey assembly.
                </p>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'rgba(245,158,11,0.15)',
                color: '#FBBF24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                  Direct Founder & Architect Response
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#94A3B8', lineHeight: '1.5' }}>
                  Chat directly with our product design team on WhatsApp for technical blueprints and material samples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
