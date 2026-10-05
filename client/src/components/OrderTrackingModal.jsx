import React, { useState, useEffect } from 'react';
import { X, Search, PackageCheck, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

export default function OrderTrackingModal({ isOpen, onClose, initialOrderId }) {
  const [searchTerm, setSearchTerm] = useState(initialOrderId || 'MV-94812');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id.trim())}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
      } else {
        setError(data.error || 'No shipment found for this Order ID.');
        setOrder(null);
      }
    } catch {
      setError('Could not connect to tracking server.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchTerm(initialOrderId);
      fetchOrder(initialOrderId);
    } else if (isOpen) {
      fetchOrder(searchTerm || 'MV-94812');
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', padding: 0 }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0F172A',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PackageCheck size={22} color="#60A5FA" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Live Order Tracking</h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Real-time shipment & assembly status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '20px 24px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(searchTerm);
            }}
            style={{ display: 'flex', gap: '10px' }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. MV-94812) or Email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.875rem' }}
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {/* Quick Click Demo Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '0.75rem' }}>
            <span style={{ color: '#64748B' }}>Quick demo orders:</span>
            <button
              type="button"
              onClick={() => { setSearchTerm('MV-94812'); fetchOrder('MV-94812'); }}
              style={{ textDecoration: 'underline', color: '#2563EB', fontWeight: '600' }}
            >
              MV-94812 (In Transit)
            </button>
            <span style={{ color: '#CBD5E1' }}>•</span>
            <button
              type="button"
              onClick={() => { setSearchTerm('MV-89103'); fetchOrder('MV-89103'); }}
              style={{ textDecoration: 'underline', color: '#2563EB', fontWeight: '600' }}
            >
              MV-89103 (Delivered)
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', maxHeight: '60vh', overflowY: 'auto' }}>
          {error && (
            <div style={{
              padding: '14px 18px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              color: '#991B1B',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {order && (
            <div>
              {/* Order Meta Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#F1F5F9',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Order ID</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>{order.orderId}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Status</div>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: order.status === 'Delivered' ? '#15803D' : '#2563EB'
                  }}>
                    {order.status}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>Logistics Partner</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A' }}>
                    {order.tracking?.courier || 'Bluedart Express'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', textTransform: 'uppercase' }}>AWB Tracking No.</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0F172A', fontFamily: 'monospace' }}>
                    {order.tracking?.trackingNumber}
                  </div>
                </div>
              </div>

              {/* Destination & Product Summary */}
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="#2563EB" />
                  <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                    <strong>Delivery To:</strong> {order.customer?.name} ({order.customer?.city}, {order.customer?.pincode})
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  {order.items?.map(i => `${i.name} (${i.size})`).join(', ')}
                </div>
              </div>

              {/* Visual Timeline Stepper */}
              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Vertical Line */}
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  backgroundColor: '#E2E8F0'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {order.tracking?.checkpoints?.map((cp, idx) => {
                    const isDone = cp.done;
                    return (
                      <div key={idx} style={{ position: 'relative' }}>
                        {/* Dot indicator */}
                        <div style={{
                          position: 'absolute',
                          left: '-32px',
                          top: '2px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#10B981' : '#FFFFFF',
                          border: isDone ? '2px solid #10B981' : '2px solid #CBD5E1',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                          {isDone ? <CheckCircle2 size={14} /> : <Clock size={12} color="#94A3B8" />}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                            <div style={{
                              fontSize: '0.925rem',
                              fontWeight: isDone ? '700' : '600',
                              color: isDone ? '#0F172A' : '#94A3B8'
                            }}>
                              {cp.status}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: isDone ? '#475569' : '#CBD5E1' }}>
                              {cp.time}
                            </div>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: isDone ? '#64748B' : '#94A3B8', marginTop: '2px' }}>
                            {cp.note}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
