import React, { useState } from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function FloatingWhatsAppButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1500,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          padding: hovered ? '12px 20px' : '12px 16px',
          borderRadius: '999px',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          fontWeight: '700',
          fontSize: '0.875rem',
          border: '2px solid #FFFFFF',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer'
        }}
        title="Send an enquiry directly to our WhatsApp"
      >
        <div style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <MessageSquare size={22} fill="#FFFFFF" />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FFEB3B',
            boxShadow: '0 0 6px #FFEB3B'
          }} />
        </div>
        <span style={{ whiteSpace: 'nowrap' }}>
          {hovered ? 'Chat on WhatsApp' : 'WhatsApp Enquiry'}
        </span>
      </button>
    </div>
  );
}
