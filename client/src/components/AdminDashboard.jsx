import React, { useState, useEffect } from 'react';
import {
  X, LayoutDashboard, DollarSign, Package, Truck, CheckCircle2,
  Search, RefreshCw, Filter, ArrowUpRight, Eye, User, Phone, MapPin, Tag,
  Download, Printer, MessageCircle, Lock, KeyRound, AlertCircle, ShieldAlert,
  Send, Settings, HelpCircle
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Nav Tab State
  const [adminTab, setAdminTab] = useState('orders'); // 'orders' | 'enquiries' | 'settings'

  // Dashboard Data State
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [settings, setSettings] = useState({ whatsappNumber: '919123456789', businessEmail: 'concierge@moonvenus.in', supportPhone: '+91 (080) 4918-0000' });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filters & Selected State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [invoiceModalOrder, setInvoiceModalOrder] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'moon2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Hint: Use default passcode admin123');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Orders
      let url = '/api/orders?';
      if (statusFilter !== 'All') url += `status=${encodeURIComponent(statusFilter)}&`;
      if (search) url += `search=${encodeURIComponent(search)}&`;

      const ordersRes = await fetch(url);
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
        if (selectedOrder) {
          const updated = ordersData.find(o => o.orderId === selectedOrder.orderId);
          if (updated) setSelectedOrder(updated);
        }
      }

      // 3. Fetch Enquiries
      const enqRes = await fetch('/api/enquiries');
      if (enqRes.ok) {
        setEnquiries(await enqRes.json());
      }

      // 4. Fetch Settings
      const setRes = await fetch('/api/settings');
      if (setRes.ok) {
        setSettings(await setRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminData();
    }
  }, [isOpen, isAuthenticated, statusFilter]);

  const handleUpdateStatus = async (orderId) => {
    if (!newStatus) return;
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: statusNote })
      });
      if (res.ok) {
        fetchAdminData();
        setStatusNote('');
        setNewStatus('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateEnquiryStatus = async (enqId, status) => {
    try {
      await fetch(`/api/enquiries/${enqId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSettings(false);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) return;
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'Email', 'City', 'State', 'Pincode', 'Size', 'Finish', 'Total (INR)', 'Payment Method', 'Payment Status', 'Fulfillment Status', 'Carrier', 'Tracking Number'];
    const rows = orders.map(o => [
      o.orderId,
      new Date(o.createdAt).toLocaleDateString('en-IN'),
      `"${o.customer?.name || ''}"`,
      `"${o.customer?.phone || ''}"`,
      `"${o.customer?.email || ''}"`,
      `"${o.customer?.city || ''}"`,
      `"${o.customer?.state || ''}"`,
      `"${o.customer?.pincode || ''}"`,
      `"${o.items?.[0]?.size || ''}"`,
      `"${o.items?.[0]?.finish || ''}"`,
      o.totalAmount,
      o.payment?.method,
      o.payment?.status,
      o.status,
      o.tracking?.courier,
      o.tracking?.trackingNumber
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `moon_venus_orders_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send WhatsApp delivery notification
  const handleSendWhatsApp = (order) => {
    const cleanPhone = (order.customer?.phone || '').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${order.customer?.name}! 🌟 Update regarding your Moon Venus Horizon Desk (Order #${order.orderId}):\n\n` +
      `📦 Status: ${order.status}\n` +
      `🚚 Carrier: ${order.tracking?.courier} (AWB: ${order.tracking?.trackingNumber})\n` +
      `📅 Estimated Delivery: ${order.tracking?.estimatedDelivery}\n\n` +
      `Track your desk anytime on our website using Order ID #${order.orderId}. Thank you for choosing Moon Venus!`
    );
    window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`, '_blank');
  };

  // Reply to Enquiry on WhatsApp
  const handleReplyEnquiry = (enq) => {
    const cleanPhone = (enq.phone || '').replace(/\D/g, '');
    const text = encodeURIComponent(
      `Hello ${enq.name}! 👋 Thank you for contacting Moon Venus regarding the Horizon Desk (${enq.deskSize} - ${enq.finish}).\n\n` +
      `In response to your enquiry (#${enq.id}):\n"${enq.message}"\n\n` +
      `I am happy to assist you directly with custom specifications, delivery timelines, or orders. How can I help you today?`
    );
    window.open(`https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${text}`, '_blank');
    handleUpdateEnquiryStatus(enq.id, 'Responded');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ padding: '20px' }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1240px',
          width: '95vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0
        }}
      >
        {/* Top Header */}
        <div style={{
          padding: '20px 28px',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800'
            }}>
              MV
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Moon Venus — Merchant Administration</h3>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Track orders, WhatsApp enquiries, fulfillment, and revenue</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isAuthenticated && (
              <>
                <button
                  onClick={handleExportCSV}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}
                  title="Download all orders as CSV Excel file"
                >
                  <Download size={14} />
                  Export CSV
                </button>
                <button
                  onClick={fetchAdminData}
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  <RefreshCw size={14} className={loading ? 'spin' : ''} />
                  Refresh
                </button>
              </>
            )}
            <button
              onClick={onClose}
              style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Auth Gate (PIN Screen) */}
        {!isAuthenticated ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#0F172A'
            }}>
              <Lock size={28} />
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Merchant Portal Security
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
              Enter the administrator passcode to access customer order history, live fulfillment tracking, and financial analytics.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                <input
                  type="password"
                  placeholder="Enter Passcode (default: admin123)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {authError && (
                <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: '500' }}>
                  {authError}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ padding: '12px', fontSize: '0.95rem' }}
              >
                Access Admin Dashboard
              </button>

              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '8px' }}>
                Default demo passcode is <strong>admin123</strong>
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: '#F8FAFC' }}>
            {/* Key Metrics Cards */}
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                    <span>TOTAL SALES (PAID)</span>
                    <DollarSign size={16} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
                    ₹{stats.totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px' }}>
                    Avg. Order: ₹{stats.avgOrderValue.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                    <span>TOTAL ORDERS</span>
                    <Package size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
                    {stats.totalOrders}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                    Across All Indian PIN Codes
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                    <span>WHATSAPP ENQUIRIES</span>
                    <MessageCircle size={16} color="#25D366" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
                    {enquiries.length}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '4px' }}>
                    {enquiries.filter(e => e.status === 'New').length} pending response
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748B', fontSize: '0.8rem', fontWeight: '600', marginBottom: '8px' }}>
                    <span>ACTIVE IN TRANSIT</span>
                    <Truck size={16} color="#F59E0B" />
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0F172A' }}>
                    {stats.inTransitOrders}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '4px' }}>
                    Dispatched or Hub sorting
                  </div>
                </div>
              </div>
            )}

            {/* Admin Section Tabs */}
            <div style={{
              display: 'flex',
              gap: '10px',
              borderBottom: '2px solid #E2E8F0',
              paddingBottom: '12px',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setAdminTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  backgroundColor: adminTab === 'orders' ? '#0F172A' : '#FFFFFF',
                  color: adminTab === 'orders' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1'
                }}
              >
                <Package size={16} />
                <span>Orders Ledger ({orders.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('enquiries')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  backgroundColor: adminTab === 'enquiries' ? '#0F172A' : '#FFFFFF',
                  color: adminTab === 'enquiries' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1'
                }}
              >
                <MessageCircle size={16} color="#25D366" />
                <span>WhatsApp Enquiries ({enquiries.length})</span>
                {enquiries.filter(e => e.status === 'New').length > 0 && (
                  <span style={{
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    borderRadius: '999px',
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    fontWeight: '800'
                  }}>
                    {enquiries.filter(e => e.status === 'New').length} NEW
                  </span>
                )}
              </button>

              <button
                onClick={() => setAdminTab('settings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  backgroundColor: adminTab === 'settings' ? '#0F172A' : '#FFFFFF',
                  color: adminTab === 'settings' ? '#FFFFFF' : '#475569',
                  border: '1px solid #CBD5E1'
                }}
              >
                <Settings size={16} />
                <span>WhatsApp & Store Settings</span>
              </button>
            </div>

            {/* TAB 1: ORDERS LEDGER */}
            {adminTab === 'orders' && (
              <div>
                {/* Filters & Search Toolbar */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  {/* Search Box */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '280px', flex: 1 }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                      <input
                        type="text"
                        placeholder="Search by Order ID, Name, Phone, or City..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchAdminData()}
                        style={{
                          width: '100%',
                          padding: '8px 12px 8px 36px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <button
                      onClick={fetchAdminData}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      Search
                    </button>
                  </div>

                  {/* Status Filter Tabs */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {['All', 'Confirmed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setStatusFilter(st)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          border: statusFilter === st ? '1px solid #0F172A' : '1px solid #E2E8F0',
                          backgroundColor: statusFilter === st ? '#0F172A' : '#FFFFFF',
                          color: statusFilter === st ? '#FFFFFF' : '#475569'
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Orders Table & Details Split View */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: selectedOrder ? '1.35fr 1.05fr' : '1fr',
                  gap: '20px',
                  alignItems: 'start'
                }}>
                  {/* Orders Table */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>
                        Orders Ledger ({orders.length})
                      </h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Click any order row to view & manage</span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem' }}>
                            <th style={{ padding: '12px 16px' }}>ORDER ID</th>
                            <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                            <th style={{ padding: '12px 16px' }}>ITEM & SIZE</th>
                            <th style={{ padding: '12px 16px' }}>AMOUNT</th>
                            <th style={{ padding: '12px 16px' }}>PAYMENT</th>
                            <th style={{ padding: '12px 16px' }}>STATUS</th>
                            <th style={{ padding: '12px 16px' }}>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                                No orders found matching criteria.
                              </td>
                            </tr>
                          ) : (
                            orders.map((o) => {
                              const isSelected = selectedOrder?.orderId === o.orderId;
                              return (
                                <tr
                                  key={o.orderId}
                                  onClick={() => setSelectedOrder(o)}
                                  style={{
                                    borderBottom: '1px solid #F1F5F9',
                                    backgroundColor: isSelected ? '#EFF6FF' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                >
                                  <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A' }}>
                                    {o.orderId}
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontWeight: '600', color: '#0F172A' }}>{o.customer?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{o.customer?.city}</div>
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                                      {o.items?.[0]?.size}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                      {o.items?.[0]?.finish}
                                    </div>
                                  </td>
                                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#0F172A' }}>
                                    ₹{o.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                      padding: '3px 8px',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      backgroundColor: o.payment?.status === 'PAID' ? '#DCFCE7' : '#FEF3C7',
                                      color: o.payment?.status === 'PAID' ? '#15803D' : '#B45309'
                                    }}>
                                      {o.payment?.method} ({o.payment?.status})
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <span style={{
                                      padding: '4px 10px',
                                      borderRadius: '6px',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      backgroundColor: o.status === 'Delivered' ? '#ECFDF5' : (o.status === 'In Transit' ? '#EFF6FF' : '#F1F5F9'),
                                      color: o.status === 'Delivered' ? '#047857' : (o.status === 'In Transit' ? '#1D4ED8' : '#334155')
                                    }}>
                                      {o.status}
                                    </span>
                                  </td>
                                  <td style={{ padding: '12px 16px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedOrder(o);
                                        }}
                                        style={{
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          backgroundColor: '#F1F5F9',
                                          fontSize: '0.75rem',
                                          fontWeight: '600'
                                        }}
                                      >
                                        Manage
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Selected Order Detail & Status Changer Side Panel */}
                  {selectedOrder && (
                    <div style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      padding: '24px',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Order Management</span>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A' }}>{selectedOrder.orderId}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setInvoiceModalOrder(selectedOrder)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              fontSize: '0.75rem',
                              fontWeight: '600'
                            }}
                            title="Print GST Tax Invoice & Packing Slip"
                          >
                            <Printer size={14} />
                            Invoice
                          </button>
                          <button
                            onClick={() => setSelectedOrder(null)}
                            style={{ color: '#94A3B8', padding: '4px' }}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Customer Information */}
                      <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Customer & Shipping Details
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={14} color="#64748B" />
                            <strong>{selectedOrder.customer?.name}</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Phone size={14} color="#64748B" />
                              <span>{selectedOrder.customer?.phone}</span>
                            </div>
                            <button
                              onClick={() => handleSendWhatsApp(selectedOrder)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                fontSize: '0.7rem',
                                fontWeight: '700'
                              }}
                            >
                              <MessageCircle size={12} />
                              WhatsApp Notify
                            </button>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                            <MapPin size={14} color="#64748B" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span>
                              {selectedOrder.customer?.address}, {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Purchased Items */}
                      <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Configured Product
                        </div>
                        {selectedOrder.items?.map((item, i) => (
                          <div key={i} style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                            <div style={{ fontWeight: '700', color: '#0F172A' }}>{item.name} × {item.quantity}</div>
                            <div style={{ color: '#64748B', fontSize: '0.8rem' }}>Size: {item.size} | Finish: {item.finish}</div>
                            {item.addons && item.addons.length > 0 && (
                              <div style={{ color: '#2563EB', fontSize: '0.75rem' }}>Addons: {item.addons.join(', ')}</div>
                            )}
                          </div>
                        ))}
                        <div style={{ marginTop: '8px', fontSize: '0.9rem', fontWeight: '800', color: '#0F172A' }}>
                          Total Amount: ₹{selectedOrder.totalAmount.toLocaleString('en-IN')} ({selectedOrder.payment?.method})
                        </div>
                      </div>

                      {/* Logistics Carrier Info */}
                      <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid #E2E8F0', fontSize: '0.825rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                          Carrier & Logistics
                        </div>
                        <div><strong>Courier:</strong> {selectedOrder.tracking?.courier}</div>
                        <div><strong>AWB Tracking:</strong> <code>{selectedOrder.tracking?.trackingNumber}</code></div>
                        <div><strong>Est. Arrival:</strong> {selectedOrder.tracking?.estimatedDelivery}</div>
                      </div>

                      {/* Status Update Form (Real-time tracking synchronization) */}
                      <div style={{
                        padding: '16px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#0F172A', marginBottom: '10px' }}>
                          Update Fulfillment Status (Customer Sees Live)
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <select
                            value={newStatus || selectedOrder.status}
                            onChange={(e) => setNewStatus(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              fontSize: '0.85rem',
                              fontWeight: '600'
                            }}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing / Quality Check</option>
                            <option value="Dispatched">Dispatched from Factory</option>
                            <option value="In Transit">In Transit to Destination Hub</option>
                            <option value="Out for Delivery">Out for Delivery & Installation</option>
                            <option value="Delivered">Delivered & Assembled</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Milestone note (e.g. Cleared Indiranagar Hub, loaded on van)"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              fontSize: '0.8rem'
                            }}
                          />

                          <button
                            onClick={() => handleUpdateStatus(selectedOrder.orderId)}
                            disabled={updatingId === selectedOrder.orderId}
                            className="btn-primary"
                            style={{
                              padding: '10px',
                              fontSize: '0.85rem',
                              justifyContent: 'center'
                            }}
                          >
                            {updatingId === selectedOrder.orderId ? 'Updating...' : 'Save & Sync Live Tracking'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: WHATSAPP ENQUIRIES */}
            {adminTab === 'enquiries' && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                      Customer WhatsApp Enquiries ({enquiries.length})
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Direct messages submitted from the website with customer details
                    </p>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '0.75rem' }}>
                        <th style={{ padding: '12px 16px' }}>ENQUIRY ID</th>
                        <th style={{ padding: '12px 16px' }}>DATE</th>
                        <th style={{ padding: '12px 16px' }}>CUSTOMER</th>
                        <th style={{ padding: '12px 16px' }}>DESK VARIANT</th>
                        <th style={{ padding: '12px 16px' }}>MESSAGE / REQUIREMENT</th>
                        <th style={{ padding: '12px 16px' }}>STATUS</th>
                        <th style={{ padding: '12px 16px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>
                            No customer enquiries received yet.
                          </td>
                        </tr>
                      ) : (
                        enquiries.map((enq) => (
                          <tr key={enq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 16px', fontWeight: '800', color: '#0F172A' }}>
                              {enq.id}
                            </td>
                            <td style={{ padding: '12px 16px', fontSize: '0.75rem', color: '#64748B' }}>
                              {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: '700', color: '#0F172A' }}>{enq.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#2563EB' }}>{enq.phone}</div>
                              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{enq.city}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <div style={{ fontWeight: '600' }}>{enq.deskSize}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{enq.finish}</div>
                            </td>
                            <td style={{ padding: '12px 16px', maxWidth: '320px', color: '#334155' }}>
                              <div style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
                                "{enq.message}"
                              </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                backgroundColor: enq.status === 'Responded' ? '#DCFCE7' : '#FEF3C7',
                                color: enq.status === 'Responded' ? '#15803D' : '#B45309'
                              }}>
                                {enq.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                              <button
                                onClick={() => handleReplyEnquiry(enq)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  backgroundColor: '#25D366',
                                  color: '#FFFFFF',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  border: 'none',
                                  cursor: 'pointer'
                                }}
                                title="Reply directly to customer's WhatsApp"
                              >
                                <MessageCircle size={14} />
                                <span>Reply on WhatsApp</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS (WHATSAPP NUMBER CONFIGURATION) */}
            {adminTab === 'settings' && (
              <div style={{
                maxWidth: '680px',
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '28px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A' }}>
                      Business WhatsApp Configuration
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Configure the exact mobile phone number where you receive customer enquiries
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Your WhatsApp Mobile Number (With Country Code) *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 919876543210 (without + or spaces)"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                      Include country code without '+' or spaces. For India, prepend <code>91</code> (e.g. <code>919876543210</code>).
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Store Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.businessEmail}
                      onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                      Customer Hotline Display
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>

                  {settingsSaved && (
                    <div style={{
                      padding: '10px 14px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <CheckCircle2 size={16} />
                      <span>WhatsApp settings saved successfully! Enquiries will now open directly to your number.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="btn-primary"
                    style={{ alignSelf: 'flex-start', padding: '12px 28px' }}
                  >
                    {savingSettings ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tax Invoice & Packing Slip Modal */}
      {invoiceModalOrder && (
        <div className="modal-overlay" onClick={() => setInvoiceModalOrder(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '680px', padding: '36px', backgroundColor: '#FFFFFF' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#0F172A' }}>MOON VENUS</h2>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Moon Venus Innovations Private Limited</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>GSTIN: 29AABCM9481Q1ZX | HSN: 9403</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Indiranagar, Bengaluru, Karnataka 560038</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A' }}>TAX INVOICE / PACKING SLIP</h3>
                <div style={{ fontSize: '0.8rem', fontWeight: '700' }}>Invoice #: INV-{invoiceModalOrder.orderId}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Date: {new Date(invoiceModalOrder.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            {/* Billed To */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', color: '#475569', fontSize: '0.75rem' }}>Billed & Shipped To:</strong>
                <div><strong>{invoiceModalOrder.customer?.name}</strong></div>
                <div>{invoiceModalOrder.customer?.address}</div>
                <div>{invoiceModalOrder.customer?.city}, {invoiceModalOrder.customer?.state} - {invoiceModalOrder.customer?.pincode}</div>
                <div>Phone: {invoiceModalOrder.customer?.phone}</div>
                <div>Email: {invoiceModalOrder.customer?.email}</div>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', textTransform: 'uppercase', color: '#475569', fontSize: '0.75rem' }}>Logistics Details:</strong>
                <div>Carrier: {invoiceModalOrder.tracking?.courier}</div>
                <div>AWB Number: <code>{invoiceModalOrder.tracking?.trackingNumber}</code></div>
                <div>Fulfillment: {invoiceModalOrder.assembly}</div>
                <div>Payment Method: {invoiceModalOrder.payment?.method} ({invoiceModalOrder.payment?.status})</div>
              </div>
            </div>

            {/* Item Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #CBD5E1', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Item Description</th>
                  <th style={{ padding: '8px' }}>HSN</th>
                  <th style={{ padding: '8px' }}>Qty</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                {invoiceModalOrder.items?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '8px' }}>
                      <strong>{item.name}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Size: {item.size} | Finish: {item.finish}</div>
                    </td>
                    <td style={{ padding: '8px' }}>9403</td>
                    <td style={{ padding: '8px' }}>{item.quantity}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
              <div style={{ width: '240px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Subtotal:</span>
                  <span>₹{invoiceModalOrder.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {invoiceModalOrder.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', marginBottom: '4px' }}>
                    <span>Discount ({invoiceModalOrder.couponCode}):</span>
                    <span>-₹{invoiceModalOrder.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Shipping & Handling:</span>
                  <span style={{ color: '#16A34A' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #0F172A', paddingTop: '6px', fontWeight: '800', fontSize: '1rem' }}>
                  <span>Total Amount:</span>
                  <span>₹{invoiceModalOrder.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Print & Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setInvoiceModalOrder(null)}
                style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: '600' }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                <Printer size={15} />
                Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
