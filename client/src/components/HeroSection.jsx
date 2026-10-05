import React, { useState } from 'react';
import {
  Star, Shield, Truck, RotateCcw, Check, Sparkles, MapPin, Eye,
  ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Heart, Share2
} from 'lucide-react';

export default function HeroSection({ product, onAddToCart, onBuyNow }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[1] || product?.sizes?.[0]);
  const [selectedFinish, setSelectedFinish] = useState(product?.finishes?.[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) return null;

  // Toggle addons
  const handleToggleAddon = (addon) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Next / Previous Image in Banner
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Calculate dynamic prices
  const basePrice = (selectedSize?.price || 17999) + (selectedFinish?.priceDelta || 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleUnitPrice = basePrice + addonsTotal;
  const totalPrice = singleUnitPrice * quantity;
  const totalMrp = ((selectedSize?.mrp || 24999) + (selectedFinish?.priceDelta || 0) + addonsTotal) * quantity;
  const discountAmount = totalMrp - totalPrice;

  // Check pincode
  const handleCheckPincode = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeResult({ valid: false, message: 'Please enter a 6-digit Indian PIN code' });
      return;
    }
    setIsCheckingPin(true);
    try {
      const res = await fetch('/api/check-pincode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode })
      });
      const data = await res.json();
      setPincodeResult(data);
    } catch {
      setPincodeResult({
        valid: true,
        available: true,
        message: 'Delivery available in 2–3 days with Free White-Glove Setup'
      });
    } finally {
      setIsCheckingPin(false);
    }
  };

  // Build item payload
  const currentItem = {
    id: product.id,
    name: product.name,
    size: selectedSize?.label,
    finish: selectedFinish?.name,
    addons: selectedAddons.map(a => a.name),
    quantity,
    price: singleUnitPrice,
    image: product.images[selectedImageIndex]?.url || product.images[0]?.url
  };

  return (
    <section id="overview" style={{ padding: '24px 0 60px', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8125rem',
          color: '#64748B',
          marginBottom: '20px'
        }}>
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Architectural Desks</span>
          <ChevronRight size={14} />
          <span style={{ color: '#0F172A', fontWeight: '700' }}>Moon Venus Horizon Desk</span>
        </div>

        {/* 1. FULL-SIZE TABLE BANNER SHOWCASE */}
        <div style={{ marginBottom: '24px' }}>
          <div className="table-banner-frame">
            <img
              src={product.images[selectedImageIndex]?.url}
              alt={product.images[selectedImageIndex]?.title}
              className="table-banner-img"
              onClick={() => setLightboxOpen(true)}
              style={{ cursor: 'zoom-in' }}
            />

            {/* Badges on Banner */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 10
            }}>
              <span style={{
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '0.8rem',
                fontWeight: '800',
                padding: '6px 14px',
                borderRadius: '8px',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                {product.badge}
              </span>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(6px)',
                color: '#0F172A',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '5px 12px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}>
                Aviation-Grade Steel Frame
              </span>
            </div>

            {/* Banner Left / Right Arrows */}
            <button
              onClick={handlePrevImage}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                border: '1px solid #E2E8F0',
                zIndex: 10
              }}
              aria-label="Previous Image"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNextImage}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                border: '1px solid #E2E8F0',
                zIndex: 10
              }}
              aria-label="Next Image"
            >
              <ChevronRight size={22} />
            </button>

            {/* Click to Zoom Prompt */}
            <button
              onClick={() => setLightboxOpen(true)}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                border: '1px solid #E2E8F0',
                zIndex: 10
              }}
            >
              <Eye size={16} />
              <span>Zoom & Macro Details</span>
            </button>

            {/* Current Image Indicator Dots */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '6px 12px',
              borderRadius: '20px',
              backdropFilter: 'blur(4px)'
            }}>
              {product.images.map((_, i) => (
                <span
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  style={{
                    width: selectedImageIndex === i ? '20px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: selectedImageIndex === i ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail Strip Below Full-Size Banner */}
          <div className="thumb-scroll" style={{ marginTop: '14px' }}>
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  minWidth: '96px',
                  width: '96px',
                  height: '72px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: selectedImageIndex === idx ? '2px solid #0F172A' : '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  padding: '3px',
                  boxShadow: selectedImageIndex === idx ? '0 0 0 1px #0F172A' : 'none',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                title={img.title}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                />
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748B', textAlign: 'center', marginTop: '6px', fontStyle: 'italic' }}>
            {product.images[selectedImageIndex]?.title} — {product.images[selectedImageIndex]?.caption}
          </div>
        </div>

        {/* 2. CONTENTS & DETAILS DIRECTLY UNDER THE TABLE BANNER */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {/* Product Title Bar & Ratings */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '24px',
            borderBottom: '1px solid #E2E8F0',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: '700'
                }}>
                  <Star size={14} fill="#10B981" color="#10B981" />
                  <span>{product.rating}</span>
                  <span style={{ color: '#047857', fontWeight: '400' }}>({product.reviewCount} verified reviews)</span>
                </div>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: '600' }}>100% Genuine Dual-Pillar Steel</span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: '700' }}>● In Stock Ready to Ship</span>
              </div>

              <h1 className="heading-xl" style={{ color: '#0F172A', marginBottom: '8px' }}>
                {product.name}
              </h1>
              <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: '1.5' }}>
                {product.tagline}
              </p>
            </div>

            {/* Quick Price Block in Header */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.02em' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '1.25rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{totalMrp.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{
                display: 'inline-block',
                marginTop: '4px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                fontSize: '0.8125rem',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '6px'
              }}>
                SAVE ₹{discountAmount.toLocaleString('en-IN')} ({Math.round((discountAmount / totalMrp) * 100)}% OFF)
              </div>
            </div>
          </div>

          {/* Responsive Split Layout: Configurator on Left, Sticky Purchase Card on Right */}
          <div className="config-layout">
            {/* Left: Customization Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* STEP 1: Select Desk Size */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    1. Select Desk Dimensions
                  </label>
                  <span style={{ fontSize: '0.8125rem', color: '#10B981', fontWeight: '600' }}>
                    ● In Stock ({selectedSize?.stock} left)
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {product.sizes.map((sz) => {
                    const isSelected = selectedSize.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => setSelectedSize(sz)}
                        style={{
                          padding: '16px 14px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #0F172A' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                          textAlign: 'left',
                          position: 'relative',
                          boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {sz.isPopular && (
                          <span style={{
                            position: 'absolute',
                            top: '-9px',
                            right: '10px',
                            backgroundColor: '#0F172A',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            letterSpacing: '0.04em'
                          }}>
                            MOST POPULAR
                          </span>
                        )}
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>{sz.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', margin: '4px 0 8px' }}>{sz.sublabel}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0F172A' }}>
                          ₹{sz.price.toLocaleString('en-IN')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 2: Select Tabletop Finish */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '800',
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '12px'
                }}>
                  2. Tabletop Finish: <span style={{ fontWeight: '600', color: '#475569' }}>{selectedFinish.name}</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {product.finishes.map((fin) => {
                    const isSelected = selectedFinish.id === fin.id;
                    return (
                      <button
                        key={fin.id}
                        onClick={() => setSelectedFinish(fin)}
                        style={{
                          padding: '14px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #0F172A' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          textAlign: 'left',
                          boxShadow: isSelected ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: fin.hex,
                            border: `1.5px solid ${fin.border}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>{fin.name}</span>
                        </div>
                        <div style={{ fontSize: '0.725rem', color: '#64748B', lineHeight: '1.4' }}>
                          {fin.description}
                        </div>
                        {fin.priceDelta > 0 ? (
                          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#2563EB' }}>
                            +₹{fin.priceDelta.toLocaleString('en-IN')}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: '600' }}>Included</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP 3: Modular Precision Add-ons */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '800',
                  color: '#0F172A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '12px'
                }}>
                  3. Modular Precision Accessories (Optional)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {product.addons.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          border: isChecked ? '1.5px solid #0F172A' : '1px solid #E2E8F0',
                          backgroundColor: isChecked ? '#F8FAFC' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '5px',
                            border: isChecked ? 'none' : '1.5px solid #CBD5E1',
                            backgroundColor: isChecked ? '#0F172A' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF'
                          }}>
                            {isChecked && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0F172A' }}>{addon.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{addon.description}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A', whiteSpace: 'nowrap', marginLeft: '14px' }}>
                          +₹{addon.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery PIN Code Checker */}
              <div style={{
                padding: '16px 20px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#2563EB" />
                  <span>Check Delivery & Free White-Glove Setup to Your Pincode</span>
                </div>
                <form onSubmit={handleCheckPincode} style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Enter 6-digit PIN code (e.g. 560038)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isCheckingPin}
                    style={{
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '700'
                    }}
                  >
                    {isCheckingPin ? 'Checking...' : 'Check'}
                  </button>
                </form>
                {pincodeResult && (
                  <div style={{
                    marginTop: '10px',
                    fontSize: '0.85rem',
                    color: pincodeResult.valid ? '#166534' : '#991B1B',
                    fontWeight: '600'
                  }}>
                    {pincodeResult.message}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Sticky Order Summary & Direct Actions Card */}
            <div style={{
              position: 'sticky',
              top: '90px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #CBD5E1',
              padding: '28px',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Your Configuration Summary
              </div>

              {/* Configuration pill list */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid #E2E8F0',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Dimensions:</span>
                  <strong>{selectedSize.label}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Finish:</span>
                  <strong>{selectedFinish.name}</strong>
                </div>
                {selectedAddons.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Accessories:</span>
                    <strong style={{ color: '#2563EB', textAlign: 'right' }}>
                      {selectedAddons.length} item(s) selected
                    </strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E8F0', paddingTop: '6px', marginTop: '4px' }}>
                  <span style={{ color: '#64748B' }}>Assembly:</span>
                  <strong style={{ color: '#16A34A' }}>Free White-Glove Setup</strong>
                </div>
              </div>

              {/* Price Breakdown */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Payable:</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#15803D', fontWeight: '600' }}>
                  <span>Launch Discount Applied:</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
                  No-cost EMI from <strong>₹{Math.round(totalPrice / 12).toLocaleString('en-IN')}/month</strong>
                </div>
              </div>

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>Quantity:</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ padding: '4px 14px', fontSize: '1.1rem', color: '#475569' }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '700', fontSize: '0.95rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ padding: '4px 14px', fontSize: '1.1rem', color: '#475569' }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => onAddToCart(currentItem)}
                  className="btn-secondary"
                  style={{ width: '100%', height: '50px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700' }}
                >
                  Add to Cart
                </button>

                <button
                  onClick={() => onBuyNow(currentItem)}
                  className="btn-primary"
                  style={{ width: '100%', height: '50px', borderRadius: '10px', fontSize: '1rem', fontWeight: '800' }}
                >
                  <span>Buy Now — ₹{totalPrice.toLocaleString('en-IN')}</span>
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Trust Assurances */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #E2E8F0',
                fontSize: '0.8rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} color="#2563EB" />
                  <div>
                    <strong>10-Year Frame Warranty</strong>
                    <div style={{ color: '#64748B', fontSize: '0.725rem' }}>High-tensile cold-rolled steel</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <RotateCcw size={18} color="#10B981" />
                  <div>
                    <strong>100 Nights Risk-Free Trial</strong>
                    <div style={{ color: '#64748B', fontSize: '0.725rem' }}>Full money-back doorstep pickup</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Truck size={18} color="#F59E0B" />
                  <div>
                    <strong>Free Insured Express Delivery</strong>
                    <div style={{ color: '#64748B', fontSize: '0.725rem' }}>Reinforced corner-protected carton</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {lightboxOpen && (
        <div className="modal-overlay" onClick={() => setLightboxOpen(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '940px', backgroundColor: '#FFFFFF', padding: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{product.images[selectedImageIndex]?.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{product.images[selectedImageIndex]?.caption}</p>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: '#F1F5F9', fontWeight: '700' }}
              >
                Close ✕
              </button>
            </div>
            <div style={{
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              maxHeight: '68vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={product.images[selectedImageIndex]?.url}
                alt={product.images[selectedImageIndex]?.title}
                style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain' }}
              />
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '16px',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  style={{
                    width: '76px',
                    height: '76px',
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: selectedImageIndex === i ? '2px solid #0F172A' : '1px solid #E2E8F0'
                  }}
                >
                  <img src={img.url} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
