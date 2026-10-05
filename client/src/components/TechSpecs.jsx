import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function TechSpecs({ specs }) {
  if (!specs) return null;

  return (
    <section id="specs" style={{ padding: '80px 0', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <div className="title-badge" style={{ marginBottom: '12px' }}>
            <FileText size={14} color="#0F172A" />
            <span>Dimensions & Build</span>
          </div>
          <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '12px' }}>
            Technical Blueprint
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Precision engineering specifications for architects, creators, and professionals.
          </p>
        </div>

        <div style={{
          maxWidth: '880px',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {Object.entries(specs).map(([key, value], idx) => (
            <div
              key={key}
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(180px, 1fr) minmax(240px, 1.8fr)',
                padding: '16px 24px',
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                borderBottom: idx === Object.keys(specs).length - 1 ? 'none' : '1px solid #E2E8F0',
                alignItems: 'center'
              }}
            >
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '700',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#2563EB" />
                <span>{key}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: '500' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
