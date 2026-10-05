import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X, Check, ShieldCheck, CreditCard, QrCode, Smartphone,
  Building, Truck, Wrench, ArrowRight, Printer, PackageCheck
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  couponCode,
  totalAmount,
  currentUser,
  onOrderSuccess
}) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Assembly & Payment, 3: Success
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Karnataka',
    pincode: '560038'
  });
  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (currentUser) {
      setCustomer(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        state: currentUser.state || prev.state,
        pincode: currentUser.pincode || prev.pincode
      }));
      if (currentUser.name) {
        setCardData(prev => ({ ...prev, name: currentUser.name }));
      }
    }
  }, [currentUser, isOpen]);
  const [assembly, setAssembly] = useState('White Glove Express Assembly (Complimentary)');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8921',
    expiry: '08/29',
    cvv: '821',
    name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  const handlePincodeChange = (pin) => {
    setCustomer(prev => ({ ...prev, pincode: pin }));
    if (pin.startsWith('560')) setCustomer(prev => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }));
    else if (pin.startsWith('400')) setCustomer(prev => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }));
    else if (pin.startsWith('110')) setCustomer(prev => ({ ...prev, city: 'New Delhi', state: 'Delhi' }));
    else if (pin.startsWith('600')) setCustomer(prev => ({ ...prev, city: 'Chennai', state: 'Tamil Nadu' }));
    else if (pin.startsWith('500')) setCustomer(prev => ({ ...prev, city: 'Hyderabad', state: 'Telangana' }));
    else if (pin.startsWith('682')) setCustomer(prev => ({ ...prev, city: 'Kochi', state: 'Kerala' }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        customer,
        items,
        subtotal,
        discount,
        couponCode,
        totalAmount,
        assembly,
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
          transactionId: `${paymentMethod}_${Math.floor(10000000 + Math.random() * 90000000)}`
        }
      };

      const res = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCreatedOrder(data.order);
        setStep(3);
        // Confetti celebration
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        if (onOrderSuccess) onOrderSuccess(data.order);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while placing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={step === 3 ? undefined : onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: step === 3 ? '620px' : '760px',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
              {step === 3 ? 'Order Confirmed!' : 'Moon Venus Secure Checkout'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>
              {step === 1 && 'Step 1 of 2: Shipping & Delivery Details'}
              {step === 2 && 'Step 2 of 2: Delivery Option & Payment Method'}
              {step === 3 && `Order ID: ${createdOrder?.orderId}`}
            </p>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              style={{ padding: '6px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#475569' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* STEP 1: Shipping Details */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(2);
            }}
            style={{ padding: '28px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aiswarya K. J."
                    value={customer.name}
                    onChange={(e) => {
                      setCustomer({ ...customer, name: e.target.value });
                      setCardData(prev => ({ ...prev, name: e.target.value }));
                    }}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                  Email Address * (for tracking & invoice receipt)
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                  Delivery Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Apartment/Building Name, Street, Landmark"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                    PIN Code *
                  </label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 560038"
                    value={customer.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    required
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '6px' }}>
                    State *
                  </label>
                  <input
                    required
                    type="text"
                    value={customer.state}
                    onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #E2E8F0'
            }}>
              <div>
                <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>Total Payable</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>
                  ₹{totalAmount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px 28px' }}
              >
                <span>Continue to Payment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Assembly & Payment Method */}
        {step === 2 && (
          <form onSubmit={handlePlaceOrder} style={{ padding: '28px' }}>
            {/* Delivery & Assembly Options */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '10px', color: '#0F172A' }}>
                Select Delivery & Setup Preference
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div
                  onClick={() => setAssembly('White Glove Express Assembly (Complimentary)')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: assembly.includes('White Glove') ? '2px solid #0F172A' : '1px solid #CBD5E1',
                    backgroundColor: assembly.includes('White Glove') ? '#F8FAFC' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Wrench size={20} color="#2563EB" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>
                        White-Glove Express Assembly
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Certified technician delivers, unboxes, assembles desk, and clears carton packaging.
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#10B981' }}>FREE (Special Offer)</span>
                </div>

                <div
                  onClick={() => setAssembly('Standard Doorstep Delivery (DIY Kit)')}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: assembly.includes('DIY') ? '2px solid #0F172A' : '1px solid #CBD5E1',
                    backgroundColor: assembly.includes('DIY') ? '#F8FAFC' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Truck size={20} color="#475569" />
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>
                        Standard Doorstep Delivery
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Delivered in reinforced wood-edge carton with included magnetic tool kit (12 min assembly).
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#10B981' }}>FREE</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '10px', color: '#0F172A' }}>
                Payment Method (Instant Confirmation)
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: <QrCode size={18} /> },
                  { id: 'Card', label: 'Cards', icon: <CreditCard size={18} /> },
                  { id: 'NetBanking', label: 'NetBanking', icon: <Building size={18} /> },
                  { id: 'COD', label: 'Cash on Del.', icon: <Truck size={18} /> }
                ].map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #0F172A' : '1px solid #CBD5E1',
                        backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}
                    >
                      {m.icon}
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* UPI Tab */}
              {paymentMethod === 'UPI' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  {/* Dynamic Mock QR Code */}
                  <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <QrCode size={70} color="#0F172A" />
                    <span style={{ fontSize: '0.625rem', fontWeight: '700', color: '#2563EB', marginTop: '2px' }}>
                      SCAN & PAY
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>
                      Pay via Google Pay, PhonePe, Paytm, BHIM, Cred
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 8px' }}>
                      Scan the QR code or enter your UPI Virtual Private Address (VPA):
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. mobile@okaxis or yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.8125rem'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {paymentMethod === 'Card' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4532 8901 2345 8921"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {paymentMethod === 'NetBanking' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '8px' }}>Select Bank</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Others'].map((b) => (
                      <div
                        key={b}
                        style={{
                          padding: '8px 10px',
                          border: '1px solid #CBD5E1',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF',
                          fontSize: '0.8rem',
                          textAlign: 'center',
                          fontWeight: '600'
                        }}
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COD Tab */}
              {paymentMethod === 'COD' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#FFFBEB',
                  borderRadius: '10px',
                  border: '1px solid #FDE68A',
                  fontSize: '0.85rem',
                  color: '#92400E'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '4px' }}>Cash On Delivery</div>
                  <div>You can pay via Cash or UPI QR to the delivery executive upon desk assembly at your doorstep.</div>
                </div>
              )}
            </div>

            {/* Back & Submit Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #E2E8F0'
            }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: '600' }}
              >
                Back to Address
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ padding: '12px 32px' }}
              >
                {isSubmitting ? (
                  <span>Authorizing Order...</span>
                ) : (
                  <span>Pay & Place Order (₹{totalAmount.toLocaleString('en-IN')})</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Order Success & Confirmation */}
        {step === 3 && createdOrder && (
          <div style={{ padding: '36px 32px', textAlign: 'center' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(22,101,52,0.15)'
            }}>
              <Check size={36} strokeWidth={3} />
            </div>

            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Thank You for Your Order!
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '24px' }}>
              Your order has been registered and sent to the Moon Venus assembly hub.
            </p>

            {/* Order Card details */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Order Number</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>{createdOrder.orderId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Estimated Delivery</div>
                  <div style={{ fontSize: '1rem', fontWeight: '700', color: '#2563EB' }}>
                    {createdOrder.tracking.estimatedDelivery}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                <strong>Deliver To:</strong> {createdOrder.customer.name}, {createdOrder.customer.address}, {createdOrder.customer.city} - {createdOrder.customer.pincode}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '6px' }}>
                <strong>Carrier:</strong> {createdOrder.tracking.courier} (Tracking: <code>{createdOrder.tracking.trackingNumber}</code>)
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                <strong>Setup:</strong> {createdOrder.assembly}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn-secondary"
                style={{ padding: '10px 18px', fontSize: '0.875rem' }}
              >
                <Printer size={16} />
                Print Receipt
              </button>

              <button
                onClick={() => {
                  onClose();
                  // Trigger open track
                  const event = new CustomEvent('open-track-order', { detail: createdOrder.orderId });
                  window.dispatchEvent(event);
                }}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.875rem' }}
              >
                <PackageCheck size={16} />
                Track Live Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
