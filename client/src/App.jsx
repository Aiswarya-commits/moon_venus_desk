import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EngineeringHotspots from './components/EngineeringHotspots';
import FeatureGrid from './components/FeatureGrid';
import ComparisonTable from './components/ComparisonTable';
import TechSpecs from './components/TechSpecs';
import CustomerReviews from './components/CustomerReviews';
import FAQSection from './components/FAQSection';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import WhatsAppEnquiryModal from './components/WhatsAppEnquiryModal';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import EnquirySection from './components/EnquirySection';
import Footer from './components/Footer';
import { ShoppingBag, Check } from 'lucide-react';

export default function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('moonvenus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [couponCode, setCouponCode] = useState('MOON3000');
  const [discount, setDiscount] = useState(3000);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch product from backend API
  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading product:', err);
        setLoading(false);
      });
  }, []);

  // Listen to custom event to open tracking directly from order success screen
  useEffect(() => {
    const handleOpenTrack = (e) => {
      setTrackOrderId(e.detail);
      setIsTrackOpen(true);
    };
    window.addEventListener('open-track-order', handleOpenTrack);
    return () => window.removeEventListener('open-track-order', handleOpenTrack);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Auth operations
  const handleLoginSuccess = (user, isAdmin) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('moonvenus_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    if (isAdmin) {
      showToast('👑 Welcome Administrator! Accessing Merchant Portal...');
      setIsAdminOpen(true);
    } else {
      showToast(`Welcome back, ${user.name}!`);
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('moonvenus_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
    setIsAdminOpen(false);
    showToast('Signed out successfully.');
  };

  // Cart operations
  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(i => i.id === item.id && i.size === item.size && i.finish === item.finish);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        return updated;
      }
      return [...prev, item];
    });
    showToast(`Added ${item.name} (${item.size}) to your bag`);
    setIsCartOpen(true);
  };

  const handleBuyNow = (item) => {
    handleAddToCart(item);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (idx, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(idx);
      return;
    }
    setCartItems(prev => {
      const updated = [...prev];
      updated[idx].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (idx) => {
    setCartItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleApplyCoupon = (code, amount) => {
    setCouponCode(code);
    setDiscount(amount);
    showToast(`Coupon ${code} applied: -₹${amount}`);
  };

  const handleRemoveCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = Math.max(0, subtotal - discount);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'var(--font-sans)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '1.25rem',
          animation: 'pulse 1.5s infinite ease-in-out'
        }}>
          MV
        </div>
        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#0F172A' }}>
          Loading Moon Venus Horizon Desk...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.875rem',
          fontWeight: '600',
          animation: 'slideUp 0.2s ease-out'
        }}>
          <Check size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Navbar with Cart, Tracking, and Sign In / User account (No public Admin button) */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTrack={() => {
          setTrackOrderId('');
          setIsTrackOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* Flagship Product Hero Showcase */}
        <HeroSection
          product={product}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

        {/* Engineering Hotspots using the user's authentic photos */}
        <EngineeringHotspots hotspots={product?.hotspots} />

        {/* 6 Key Architectural Value Pillars */}
        <FeatureGrid features={product?.features} />

        {/* The Sleep Company Style Comparison Sheet */}
        <ComparisonTable />

        {/* Technical Blueprint Specifications */}
        <TechSpecs specs={product?.specs} />

        {/* Customer Reviews & Submit Review Modal */}
        <CustomerReviews />

        {/* Custom Dimensions & Corporate WhatsApp Enquiry Section */}
        <div id="enquiry">
          <EnquirySection onOpenEnquiry={() => setIsEnquiryOpen(true)} />
        </div>

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Brand Footer */}
      <Footer
        onOpenTrack={() => {
          setTrackOrderId('');
          setIsTrackOpen(true);
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Floating WhatsApp Action Button (Accessible across entire site) */}
      <FloatingWhatsAppButton onClick={() => setIsEnquiryOpen(true)} />

      {/* WhatsApp Enquiry Modal */}
      <WhatsAppEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        couponCode={couponCode}
        discount={discount}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Multi-Step Checkout Modal with UPI, Cards, Netbanking, COD */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={subtotal}
        discount={discount}
        couponCode={couponCode}
        totalAmount={totalAmount}
        currentUser={currentUser}
        onOrderSuccess={(newOrder) => {
          setCartItems([]);
          setTrackOrderId(newOrder.orderId);
        }}
      />

      {/* Customer Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        initialOrderId={trackOrderId}
      />

      {/* User Sign In & Sign Up Modal (with secret admin credential detection) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onAdminDetected={() => setIsAdminOpen(true)}
      />

      {/* Merchant Admin Dashboard to Track and Update Orders */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
