import React from 'react';
import { Shield, Sparkles, Weight, Sliders, Clock, RotateCcw, Check } from 'lucide-react';

export default function FeatureGrid({ features }) {
  const icons = [
    <Shield size={28} color="#0F172A" />,
    <Sparkles size={28} color="#0F172A" />,
    <Weight size={28} color="#0F172A" />,
    <Sliders size={28} color="#0F172A" />,
    <Clock size={28} color="#0F172A" />,
    <RotateCcw size={28} color="#0F172A" />
  ];

  return (
    <section style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
          <div className="title-badge" style={{ marginBottom: '12px' }}>
            <span>Uncompromising Standard</span>
          </div>
          <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '12px' }}>
            Built Like an Architectural Monument
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Every curve, joint, and fastener was obsessively prototyped to bring you the cleanest, sturdiest white workstation ever created.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {features?.map((f, i) => (
            <div
              key={i}
              style={{
                padding: '32px 28px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E2E8F0'
              }}>
                {icons[i % icons.length]}
              </div>

              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.925rem', lineHeight: '1.6' }}>
                  {f.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
