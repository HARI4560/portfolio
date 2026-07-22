import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/api';

const ReviewPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | valid | expired | used | error | submitted
  const [tokenData, setTokenData] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [company, setCompany] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const validate = async () => {
      try {
        const { data } = await api.get(`/reviews/validate/${token}`);
        if (data.valid) {
          setTokenData(data);
          setStatus('valid');
        }
      } catch (err) {
        const res = err.response?.data;
        if (res?.expired) setStatus('expired');
        else if (res?.used) setStatus('used');
        else setStatus('error');
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (!review.trim()) { toast.error('Please write a review'); return; }

    setSubmitting(true);
    try {
      await api.post(`/reviews/submit/${token}`, { rating, review, clientCompany: company });
      setStatus('submitted');
      toast.success('Thank you for your review!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center" style={{ gap: 16 }}>
            <div style={{ width: 48, height: 48, border: '3px solid var(--color-border-subtle)', borderTopColor: 'var(--color-accent-cyan)', borderRadius: '50%', animation: 'spin-slow 1s linear infinite' }} />
            <p style={{ color: 'var(--color-text-muted)' }}>Validating your review link...</p>
          </div>
        );

      case 'expired':
        return (
          <div className="flex flex-col items-center" style={{ gap: 16, textAlign: 'center' }}>
            <FaClock style={{ fontSize: '3rem', color: '#fbbf24' }} />
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Link Expired</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400 }}>
              This review link has expired after 2 days. Please contact the project owner for a new link.
            </p>
          </div>
        );

      case 'used':
        return (
          <div className="flex flex-col items-center" style={{ gap: 16, textAlign: 'center' }}>
            <FaCheckCircle style={{ fontSize: '3rem', color: 'var(--color-accent-emerald)' }} />
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Already Reviewed</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400 }}>
              You&apos;ve already submitted a review using this link. Thank you for your feedback!
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center" style={{ gap: 16, textAlign: 'center' }}>
            <FaTimesCircle style={{ fontSize: '3rem', color: '#ef4444' }} />
            <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Invalid Link</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400 }}>
              This review link is invalid or doesn&apos;t exist.
            </p>
          </div>
        );

      case 'submitted':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center" style={{ gap: 16, textAlign: 'center' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <FaCheckCircle style={{ fontSize: '4rem', color: 'var(--color-accent-emerald)' }} />
            </motion.div>
            <h2 className="gradient-text" style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)' }}>Thank You!</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: 400 }}>
              Your review has been submitted successfully. It will now appear on the portfolio.
            </p>
          </motion.div>
        );

      case 'valid':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Project Info */}
            <div style={{ marginBottom: 32, textAlign: 'center' }}>
              {tokenData.project?.thumbnail?.url && (
                <img
                  src={tokenData.project.thumbnail.url}
                  alt={tokenData.project.title}
                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }}
                />
              )}
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>Review for</p>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: 4 }}>
                {tokenData.project?.title}
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Hi {tokenData.clientName}! We&apos;d love to hear your feedback.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Star Rating */}
              <div style={{ textAlign: 'center' }}>
                <label className="form-label" style={{ textAlign: 'center', marginBottom: 12, display: 'block' }}>Your Rating *</label>
                <div className="flex justify-center" style={{ gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        fontSize: '2rem', color: star <= (hoverRating || rating) ? '#fbbf24' : 'var(--color-text-muted)',
                        transition: 'color 0.2s',
                        filter: star <= (hoverRating || rating) ? 'drop-shadow(0 0 6px rgba(251,191,36,0.5))' : 'none',
                      }}
                    >
                      <FaStar />
                    </motion.button>
                  ))}
                </div>
                {rating > 0 && (
                  <p style={{ color: 'var(--color-accent-cyan)', fontSize: '0.85rem', marginTop: 8 }}>
                    {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                  </p>
                )}
              </div>

              {/* Company */}
              <div>
                <label className="form-label">Company (optional)</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input"
                  placeholder="Your company name"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="form-label">Your Review *</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="form-input"
                  placeholder="Share your experience working together..."
                  rows={5}
                  required
                  style={{ resize: 'vertical' }}
                  maxLength={1000}
                />
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', textAlign: 'right', marginTop: 4 }}>
                  {review.length}/1000
                </p>
              </div>

              <button type="submit" className="btn-primary" disabled={submitting} style={{ alignSelf: 'center', opacity: submitting ? 0.7 : 1 }}>
                <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Toaster position="top-center" />
      <div className="glass-strong" style={{ maxWidth: 540, width: '100%', borderRadius: 20, padding: 40 }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ReviewPage;
