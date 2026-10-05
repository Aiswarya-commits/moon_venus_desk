import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div style={{
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      fontSize: '0.8125rem',
      fontWeight: '500',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      letterSpacing: '0.02em',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={14} color="#F59E0B" />
        <span>Festive Architectural Launch: <strong>FLAT ₹3,000 OFF</strong> with code <strong>MOON3000</strong></span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hide-mobile">
        <Truck size={14} color="#10B981" />
        <span>Free Insured Delivery & White-Glove Setup across India</span>
      </div>
      {/* <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hide-mobile">
        <ShieldCheck size={14} color="#60A5FA" />
        <span>100 Nights Risk-Free Trial | 10-Year Frame Warranty</span>
      </div> */}
    </div>
  );
}
