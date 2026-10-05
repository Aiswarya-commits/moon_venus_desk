import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ onOpenTrack, onOpenAuth }) {
  return (
    <footer style={{ backgroundColor: '#0F172A', color: '#F8FAFC', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        {/* Value Proposition Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          paddingBottom: '48px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={28} color="#60A5FA" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>10-Year Guarantee</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Aerospace steel frame warranty</div>
            </div>
          </div>

          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RotateCcw size={28} color="#10B981" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>100 Nights Trial</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Zero risk in-home evaluation</div>
            </div>
          </div> */}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Truck size={28} color="#F59E0B" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Free Doorstep Setup</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Insured freight & technician assembly</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={28} color="#A78BFA" />
            <div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>BIFMA X5.5 Certified</div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Tested to 250kg static payload</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1.5fr) repeat(auto-fit, minmax(160px, 1fr))',
          gap: '40px',
          padding: '48px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem'
              }}>
                MV
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                MOON VENUS
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: '1.6', maxWidth: '340px', marginBottom: '20px' }}>
              Dedicated to designing pure, architectural furniture that elevates modern human productivity. Handcrafted in India with aerospace-grade steel.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem', color: '#94A3B8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#60A5FA" />
                <span>moonvenus@gmail.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#10B981" />
                <span>+91 8848876551 (Mon–Sat 9AM–8PM)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="#F59E0B" />
                <span>Kakkanad, Kochi, Kerala, 602030</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94A3B8' }}>
              <a href="#overview">Horizon Desk Overview</a>
              <a href="#engineering">Welds & Architecture</a>
              <a href="#comparison">Compare With Others</a>
              <a href="#specs">Technical Blueprint</a>
              <a href="#reviews">Verified Reviews</a>
              <a href="#faq">Frequently Asked Questions</a>
            </div>
          </div>

          {/* Customer Portal */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Services & Portals
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#94A3B8' }}>
              <button
                onClick={onOpenTrack}
                style={{ textAlign: 'left', color: '#60A5FA', fontWeight: '600' }}
              >
                Track Your Shipment
              </button>
              <button
                onClick={onOpenAuth}
                style={{ textAlign: 'left', color: '#CBD5E1', fontWeight: '600' }}
              >
                Customer Sign In / Register
              </button>
              <span>100-Night Trial Claim</span>
              <span>10-Year Warranty Registration</span>
              <span>Bulk Studio & Corporate Inquiries</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          paddingTop: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748B',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            © {new Date().getFullYear()} Moon Venus Innovations Pvt. Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>BIFMA Certified Specification</span>
            <span>ISO 9001:2015</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
