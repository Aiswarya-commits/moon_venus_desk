import React, { useState } from 'react';
import { Layers, ShieldCheck, Cpu, Sliders, CheckCircle2 } from 'lucide-react';

export default function EngineeringHotspots({ hotspots }) {
  const [activeTab, setActiveTab] = useState(0);

  if (!hotspots || hotspots.length === 0) return null;
  const current = hotspots[activeTab];

  return (
    <section id="engineering" style={{
      padding: '80px 0',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid #E2E8F0',
      borderBottom: '1px solid #E2E8F0'
    }}>
      <div className="container">
        {/* Section Heading */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <div className="title-badge" style={{ marginBottom: '12px' }}>
            <Cpu size={14} color="#0F172A" />
            <span>Industrial Craftsmanship</span>
          </div>
          <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '16px' }}>
            Engineered Under The Surface
          </h2>
          <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.6' }}>
            While other desks hide flimsy joints behind plastic caps, Moon Venus exposes uncompromising architectural aerospace steel. Built with triangulated reinforcements and robotic precision welds.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '36px',
          flexWrap: 'wrap'
        }}>
          {hotspots.map((item, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(index)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  border: isActive ? '2px solid #0F172A' : '1px solid #CBD5E1',
                  backgroundColor: isActive ? '#0F172A' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isActive ? '0 4px 12px rgba(15,23,42,0.15)' : 'none'
                }}
              >
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#FFFFFF' : '#F1F5F9',
                  color: isActive ? '#0F172A' : '#64748B',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800'
                }}>
                  0{index + 1}
                </span>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          alignItems: 'center'
        }} className="hero-grid">
          {/* Photo Preview with Macro Zoom Look */}
          <div style={{
            position: 'relative',
            backgroundColor: '#F1F5F9',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '440px'
          }}>
            <div style={{
              width: '100%',
              maxHeight: '420px',
              borderRadius: '14px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF'
            }}>
              <img
                src={current.image}
                alt={current.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>
            {/* Architectural Tag */}
            <div style={{
              position: 'absolute',
              top: '36px',
              right: '36px',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '0.04em'
            }}>
              {current.tag}
            </div>
          </div>

          {/* Technical Narrative */}
          <div style={{ padding: '40px 48px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: '#2563EB',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '12px'
            }}>
              <ShieldCheck size={16} />
              <span>Tested to BIFMA X5.5 Standards</span>
            </div>

            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: '16px',
              lineHeight: 1.2
            }}>
              {current.title}
            </h3>

            <p style={{
              color: '#475569',
              fontSize: '1.05rem',
              lineHeight: '1.65',
              marginBottom: '28px'
            }}>
              {current.desc}
            </p>

            {/* Checklist of engineering specifics */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Dual Cold-Rolled Carbon Box Frame</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>50mm x 25mm structural cross-section with 2.0mm high-tensile wall gauge.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Robotic Continuous TIG Welds</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>No spot-welding or brittle screws. Every critical load joint is argon-shielded welded.</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>Multi-Stage Baked White Powder Coating</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Electrostatically sprayed at 200°C for zero-chipping, UV-stability, and velvety texture.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
