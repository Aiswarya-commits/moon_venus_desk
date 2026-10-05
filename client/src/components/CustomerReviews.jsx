import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, Check } from 'lucide-react';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    location: '',
    rating: 5,
    title: '',
    comment: '',
    sizeBought: '140 × 70 cm',
    finishBought: 'Pristine Matte White'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.author || !formData.comment) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowModal(false);
          fetchReviews();
          setFormData({
            author: '',
            location: '',
            rating: 5,
            title: '',
            comment: '',
            sizeBought: '140 × 70 cm',
            finishBought: 'Pristine Matte White'
          });
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" style={{ padding: '80px 0', backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="title-badge" style={{ marginBottom: '12px' }}>
              <span>Verified Customer Feedback</span>
            </div>
            <h2 className="heading-lg" style={{ color: '#0F172A', marginBottom: '8px' }}>
              Loved by Architects & Creators
            </h2>
            <p style={{ color: '#64748B', fontSize: '1rem' }}>
              Real reviews from workspaces across India.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.875rem' }}
          >
            <MessageSquarePlus size={16} />
            Write a Review
          </button>
        </div>

        {/* Rating Overview Box */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '32px',
          marginBottom: '36px',
          display: 'grid',
          gridTemplateColumns: 'minmax(200px, 1fr) minmax(280px, 2fr)',
          gap: '32px',
          alignItems: 'center'
        }} className="hero-grid">
          <div style={{ textAlign: 'center', borderRight: '1px solid #E2E8F0', paddingRight: '24px' }}>
            <div style={{ fontSize: '3.75rem', fontWeight: '800', color: '#0F172A', lineHeight: 1 }}>
              4.9
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', margin: '12px 0 8px' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill="#F59E0B" color="#F59E0B" />
              ))}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#64748B' }}>
              Based on 384 verified purchases
            </div>
          </div>

          {/* Rating Breakdown bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { stars: 5, pct: 92 },
              { stars: 4, pct: 6 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 }
            ].map((bar) => (
              <div key={bar.stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8125rem' }}>
                <span style={{ width: '50px', color: '#475569', fontWeight: '600' }}>{bar.stars} Star</span>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${bar.pct}%`, height: '100%', backgroundColor: '#0F172A', borderRadius: '4px' }} />
                </div>
                <span style={{ width: '40px', textAlign: 'right', color: '#64748B' }}>{bar.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{rev.date}</span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>
                  "{rev.title}"
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: '1.6', marginBottom: '16px' }}>
                  {rev.comment}
                </p>
              </div>

              <div style={{ paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A' }}>{rev.author}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{rev.location}</div>
                  </div>
                  {rev.verified && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#ECFDF5',
                      color: '#047857',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px'
                    }}>
                      <ShieldCheck size={13} />
                      Verified Owner
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '8px', fontSize: '0.7rem', color: '#94A3B8' }}>
                  Purchased: {rev.sizeBought} • {rev.finishBought}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>Share Your Moon Venus Experience</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Your feedback helps other professionals build their dream workspace.
            </p>

            {submitSuccess ? (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                backgroundColor: '#ECFDF5',
                borderRadius: '12px',
                color: '#065F46'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  margin: '0 auto 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={24} strokeWidth={3} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Review Submitted!</h4>
                <p style={{ fontSize: '0.85rem' }}>Thank you for reviewing the Moon Venus Horizon Desk.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Your Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Vikramaditya Rao"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad, Telangana"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Overall Rating *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        style={{ padding: '6px' }}
                      >
                        <Star
                          size={24}
                          fill={star <= formData.rating ? '#F59E0B' : '#E2E8F0'}
                          color={star <= formData.rating ? '#F59E0B' : '#CBD5E1'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Unbelievable stability and spotless white finish"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '4px' }}>Your Review *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about the build quality, welding, stability, and aesthetics..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    {submitting ? 'Submitting...' : 'Post Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
