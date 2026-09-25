import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface ExchangeModalProps {
  recipient: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  recipient,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [offeredSkillName, setOfferedSkillName] = useState('');
  const [requiredSkillName, setRequiredSkillName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (recipient && user) {
      // Find mutual matches if possible, else default to first available
      const myOffers = user.offeredSkills.map((s) => s.name);
      const recipientWants = recipient.requiredSkills.map((s) => s.name);
      const mutualTeach = myOffers.find((s) => recipientWants.includes(s)) || myOffers[0] || '';
      setOfferedSkillName(mutualTeach);

      const recipientOffers = recipient.offeredSkills.map((s) => s.name);
      const myWants = user.requiredSkills.map((s) => s.name);
      const mutualLearn = recipientOffers.find((s) => myWants.includes(s)) || recipientOffers[0] || '';
      setRequiredSkillName(mutualLearn);

      setMessage(
        `Hi ${recipient.name.split(' ')[0]}, I can help you learn ${mutualTeach || 'this skill'} and I'd love to learn ${mutualLearn || 'from you'}!`
      );
      setError(null);
      setSuccess(false);
    }
  }, [recipient, user, isOpen]);

  if (!isOpen || !recipient || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!offeredSkillName) {
      setError('Please choose a skill you can teach.');
      return;
    }
    if (!requiredSkillName) {
      setError('Please choose a skill you want to learn.');
      return;
    }

    setLoading(true);
    try {
      await api.requests.create({
        receiverId: recipient.id,
        offeredSkillName,
        requiredSkillName,
        message: message.trim(),
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to send exchange request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-sm">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Request Skill Exchange</h3>
              <p className="text-xs text-slate-500">
                Propose a two-way learning partnership with {recipient.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">Exchange Request Sent!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We notified {recipient.name}. You'll be alerted as soon as they accept!
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

            {/* Recipient summary */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <img
                src={recipient.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient.name}`}
                alt={recipient.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <p className="text-sm font-bold text-slate-800">{recipient.name}</p>
                <p className="text-xs text-slate-500">{recipient.department} • {recipient.college}</p>
              </div>
            </div>

            {/* Skill Exchange Pairing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* You Teach */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  You Teach (From your skills):
                </label>
                {user.offeredSkills.length > 0 ? (
                  <select
                    value={offeredSkillName}
                    onChange={(e) => setOfferedSkillName(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {user.offeredSkills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    You haven't added any offered skills yet.
                  </p>
                )}
              </div>

              {/* You Want to Learn */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  You Learn (From their skills):
                </label>
                {recipient.offeredSkills.length > 0 ? (
                  <select
                    value={requiredSkillName}
                    onChange={(e) => setRequiredSkillName(e.target.value)}
                    className="w-full text-xs font-medium bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  >
                    {recipient.offeredSkills.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-xs text-slate-400 italic">No skills listed</p>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Personal Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write a friendly note explaining how you can help each other..."
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || user.offeredSkills.length === 0 || recipient.offeredSkills.length === 0}
                className="px-5 py-2.5 text-xs font-semibold text-white brand-gradient rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? 'Sending...' : 'Send Request'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
