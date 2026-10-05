import React, { useState } from 'react';
import { X, Send, MessageSquare, Phone, User, Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export default function WhatsAppEnquiryModal({ isOpen, onClose, defaultSize, defaultFinish }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    pincode: '',
    deskSize: defaultSize || '140 × 70 cm',
    finish: defaultFinish || 'Pristine Matte White',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Please provide your name and mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        // Automatically open WhatsApp in a new tab with the pre-filled message
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, '_blank');
        }
      } else {
        setError(data.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch {
      setError('Could not connect to server. Opening direct WhatsApp chat instead...');
      // Fallback direct WhatsApp open
      const waText = encodeURIComponent(
        `Hello Moon Venus! I am ${formData.name} (${formData.phone}). I would like to enquire about the Moon Venus Horizon Desk (${formData.deskSize} - ${formData.finish}). ${formData.message}`
      );
      window.open(`https://wa.me/919123456789?text=${waText}`, '_blank');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '16px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '520px',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25D366'
            }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>WhatsApp Instant Enquiry</h3>
              <p style={{ fontSize: '0.75rem', color: '#E8F5E9' }}>
                Your enquiry will be sent directly to our team's WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: '#FFFFFF'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle size={32} />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Enquiry Sent to WhatsApp!
            </h4>
            <p style={{ color: '#64748B', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '24px' }}>
              We have launched your WhatsApp chat with all the details pre-filled. Our desk architect will reply to your message in minutes!
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Back to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Your Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    WhatsApp Mobile Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Email Address (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    City / Pincode
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru 560038"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px 9px 32px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Preferred Dimensions
                  </label>
                  <select
                    value={formData.deskSize}
                    onChange={(e) => setFormData({ ...formData, deskSize: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <option value="120 × 60 cm">120 × 60 cm (Studio / WFH)</option>
                    <option value="140 × 70 cm">140 × 70 cm (Executive Signature)</option>
                    <option value="160 × 80 cm">160 × 80 cm (Master Dual Display)</option>
                    <option value="Custom Size">Custom Dimension Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                    Tabletop Finish
                  </label>
                  <select
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    <option value="Pristine Matte White">Pristine Matte White</option>
                    <option value="Nordic Cloud Ash">Nordic Cloud Ash</option>
                    <option value="Bianco Marble Touch">Bianco Marble Touch</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '4px' }}>
                  Your Message / Custom Requirement
                </label>
                <textarea
                  rows={3}
                  placeholder="Ask about bulk studio discounts, custom dimensions, shipping timelines, or setup..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {error && (
                <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: '600' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: '48px',
                  borderRadius: '10px',
                  backgroundColor: '#25D366',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37,211,102,0.35)',
                  marginTop: '6px'
                }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Send Enquiry to WhatsApp Directly'}</span>
              </button>

              <div style={{ fontSize: '0.725rem', color: '#64748B', textAlign: 'center' }}>
                🔒 Your details will be sent directly to our business WhatsApp & saved securely.
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
