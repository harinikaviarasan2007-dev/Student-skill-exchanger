import React, { useState } from 'react';
import { X, Star, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Exchange } from '../types';
import { api } from '../services/api';

interface ReviewModalProps {
  exchange: Exchange | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  exchange,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !exchange) return null;

  const partnerName = exchange.partner?.name || 'Partner';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!feedback.trim()) {
      setError('Please provide feedback describing your learning experience.');
      return;
    }

    setLoading(true);
    try {
      await api.reviews.create({
        exchangeId: exchange.id,
        rating,
        feedback: feedback.trim(),
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Rate & Review Partner</h3>
            <p className="text-xs text-slate-500">
              Share your feedback for your completed exchange with {partnerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Review Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your rating has been recorded and will immediately reflect on {partnerName}'s public profile.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="text-center py-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                How was your experience learning from {partnerName}?
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          filled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-amber-600 mt-2 block">
                {rating === 5 && 'Outstanding! 5 out of 5'}
                {rating === 4 && 'Very Good! 4 out of 5'}
                {rating === 3 && 'Good! 3 out of 5'}
                {rating === 2 && 'Fair. 2 out of 5'}
                {rating === 1 && 'Poor. 1 out of 5'}
              </span>
            </div>

            {/* Feedback text */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Feedback & Testimonial:
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Describe how they helped you learn, their communication, and what made the exchange enjoyable..."
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-xs font-semibold text-white brand-gradient rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
