import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  couponCode,
  discount,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout
}) {
  const [promoInput, setPromoInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'MOON3000') {
      onApplyCoupon(code, 3000);
      setPromoInput('');
    } else if (code === 'WELCOME10') {
      const disc = Math.round(subtotal * 0.1);
      onApplyCoupon(code, disc);
      setPromoInput('');
    } else {
      setCouponError('Invalid promo code. Try MOON3000');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#0F172A" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>
              Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#475569'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#ECFDF5',
          borderBottom: '1px solid #D1FAE5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8125rem',
          color: '#065F46',
          fontWeight: '600'
        }}>
          <Check size={16} color="#059669" />
          <span>🎉 You have unlocked <strong>FREE Express Insured Delivery</strong>!</span>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <ShoppingBag size={28} color="#94A3B8" />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Your Bag is Empty</h4>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '20px' }}>
                Explore the Moon Venus Horizon Desk and experience zero-wobble architecture.
              </p>
              <button
                onClick={onClose}
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.875rem' }}
              >
                Configure Desk
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {items.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid #F1F5F9'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '84px',
                      height: '84px',
                      objectFit: 'contain',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      padding: '4px'
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>{item.name}</h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        style={{ color: '#94A3B8', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0' }}>
                      Size: <strong>{item.size}</strong> • Finish: <strong>{item.finish}</strong>
                    </div>

                    {item.addons && item.addons.length > 0 && (
                      <div style={{ fontSize: '0.7rem', color: '#2563EB', marginBottom: '6px' }}>
                        + {item.addons.join(', ')}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity buttons */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          style={{ padding: '2px 8px', fontSize: '0.9rem', color: '#64748B' }}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.8125rem', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          style={{ padding: '2px 8px', fontSize: '0.9rem', color: '#64748B' }}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals & checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC'
          }}>
            {/* Promo Code Input */}
            <div style={{ marginBottom: '16px' }}>
              {couponCode ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: '#ECFDF5',
                  borderRadius: '6px',
                  border: '1px dashed #059669',
                  fontSize: '0.8125rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065F46', fontWeight: '700' }}>
                    <Tag size={14} />
                    <span>'{couponCode}' Applied (-₹{discount.toLocaleString('en-IN')})</span>
                  </div>
                  <button
                    onClick={onRemoveCoupon}
                    style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: '600' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. MOON3000)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: '600'
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px' }}>
                  {couponError}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.875rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: '600' }}>
                  <span>Special Launch Discount</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                <span>Insured Freight & Handling</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>FREE</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #E2E8F0',
                fontSize: '1.15rem',
                fontWeight: '800',
                color: '#0F172A'
              }}>
                <span>Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="btn-primary"
              style={{ width: '100%', height: '50px', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#94A3B8',
              marginTop: '10px'
            }}>
              <ShieldCheck size={14} />
              <span>Encrypted Checkout • 100-Night Trial Included</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
