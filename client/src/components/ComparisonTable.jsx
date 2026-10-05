import React from 'react';
import { Check, X, Shield } from 'lucide-react';

export default function ComparisonTable() {
  const rows = [
    {
      metric: 'Frame Construction',
      moonVenus: 'Architectural Dual-Pillar 2.0mm Cold-Rolled Carbon Steel',
      others: 'Flimsy 0.8mm single sheet metal or hollow pipe'
    },
    {
      metric: 'Under-Desk Joint Support',
      moonVenus: 'Triangulated Cantilever Welded Struts (Zero Wobble)',
      others: 'Plastic corner brackets or simple sheet screws'
    },
    {
      metric: 'Certified Dynamic Load',
      moonVenus: '130 kg True Load (Static tested to 250 kg)',
      others: '40–50 kg (Flexes & sags under dual monitor arms)'
    },
    {
      metric: 'Surface Coating Quality',
      moonVenus: '80µm Baked Satin Powder Coat (Anti-Fingerprint & UV Safe)',
      others: 'Thin spray paint or paper veneer prone to chipping'
    },
    {
      metric: 'Floor Leveling & Glide',
      moonVenus: 'Threaded M8 Precision Levelers with Elastomer Anti-Scratch Pads',
      others: 'Fixed plastic plugs that scratch hardwood and marble'
    },
    {
      metric: 'Assembly Experience',
      moonVenus: '12–15 Minutes with Pre-Aligned Magnetic Hardware',
      others: 'Complex 2-hour assembly with 50+ confusing screws'
    },
    {
      metric: 'In-Home Risk-Free Trial',
      moonVenus: '100 Nights In-Home Trial (100% Refund Pick-Up)',
      others: 'No trial. Final sale or store credit only'
    },
    {
      metric: 'Manufacturer Warranty',
      moonVenus: '10-Year Structural Steel Frame Warranty',
      others: '6 Months to 1 Year limited warranty'
    }
  ];

  return (
    <section id="comparison" style={{
      padding: '80px 0',
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
          <div className="title-badge" style={{ marginBottom: '12px' }}>
            <Shield size={14} color="#0F172A" />
            <span>Why Moon Venus</span>
          </div>
          <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '12px' }}>
            The Moon Venus Distinction
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            See how the Moon Venus Horizon Desk compares against conventional commercial office desks.
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(260px, 1.4fr) minmax(220px, 1.2fr)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '20px 24px',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            <div>Architecture & Feature</div>
            <div style={{ color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>MOON VENUS HORIZON</span>
              <span style={{
                fontSize: '0.65rem',
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                SUPERIOR
              </span>
            </div>
            <div style={{ color: '#94A3B8' }}>Conventional Office Tables</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {rows.map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(200px, 1.2fr) minmax(260px, 1.4fr) minmax(220px, 1.2fr)',
                  padding: '18px 24px',
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                  borderTop: '1px solid #E2E8F0',
                  alignItems: 'center',
                  fontSize: '0.875rem'
                }}
              >
                <div style={{ fontWeight: '700', color: '#0F172A' }}>{row.metric}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0F172A', fontWeight: '600' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span>{row.moonVenus}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#FEE2E2',
                    color: '#B91C1C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <X size={14} strokeWidth={3} />
                  </div>
                  <span>{row.others}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
