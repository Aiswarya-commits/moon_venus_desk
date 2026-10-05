import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'Does the Moon Venus desk wobble during heavy typing or monitor arm use?',
      a: 'Absolutely zero wobble. Unlike conventional desks built with single hollow sheet metal tubes or loose screw fittings, the Moon Venus Horizon Desk features dual 2.0mm thick cold-rolled carbon steel columns, triangulated diagonal cantilever underframe struts, and robotic continuous TIG welds. Even with dual 34-inch ultra-wide monitors mounted on a heavy arm clamp, it remains rock steady.'
    },
    {
      q: 'What is the white surface technology? Will it stain or turn yellow over time?',
      a: 'We use an aerospace-grade multi-stage 80µm electrostatically baked powder coat at 200°C for the steel frame, and a high-pressure thermally fused anti-scratch matte core for the tabletop. It features UV-inhibitors that prevent sun-yellowing and a velvety anti-fingerprint surface that cleans easily with a damp microfiber cloth.'
    },
    {
      q: 'How long does assembly take? Can I assemble it alone?',
      a: 'Assembly takes just 12 to 15 minutes! All structural frame inserts are pre-aligned and pre-threaded. Every desk comes packed with a magnetic high-torque hex wrench and precision machine bolts. 96% of our customers assemble it easily by themselves in one quick session.'
    },
    {
      q: 'How does the 100-Night In-Home Trial work?',
      a: 'We want you to experience the ergonomic perfection in your daily work routine. From the day your Moon Venus desk is delivered, you have 100 calendar days to test it. If you are not 100% in love, contact our support team and we will arrange a free doorstep pickup and initiate an immediate full refund to your original payment method.'
    },
    {
      q: 'Is shipping free across India? What packaging is used?',
      a: 'Yes, insured delivery is 100% free to all serviceable pin codes across India via Bluedart and Delhivery. Your desk is packaged in a heavy-duty reinforced carton with high-density EPE foam corner armor and edge guards to ensure 100% transit damage-free arrival.'
    },
    {
      q: 'Can I clamp dual monitor arms and audio monitor stands?',
      a: 'Yes! The solid core tabletop and recessed steel subframe allow standard C-clamps, grommet mounts, and heavy-duty monitor brackets up to 130 kg without cracking or deflection.'
    }
  ];

  return (
    <section id="faq" style={{ padding: '80px 0', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="title-badge" style={{ marginBottom: '12px' }}>
            <HelpCircle size={14} color="#0F172A" />
            <span>Common Questions</span>
          </div>
          <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '12px' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: '#64748B', fontSize: '1rem' }}>
            Everything you need to know about the Moon Venus Horizon Desk, shipping, and warranty.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: '12px',
                  border: isOpen ? '1px solid #0F172A' : '1px solid #E2E8F0',
                  backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    gap: '16px'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A' }}>
                    {faq.q}
                  </span>
                  <div style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    color: isOpen ? '#0F172A' : '#94A3B8'
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 24px',
                    color: '#475569',
                    fontSize: '0.925rem',
                    lineHeight: '1.65'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
