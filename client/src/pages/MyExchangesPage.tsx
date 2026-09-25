import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Repeat,
  CheckCircle2,
  Clock,
  Star,
  ArrowLeftRight,
  Sparkles,
  Calendar,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Exchange } from '../types';
import { SkillTag } from '../components/SkillTag';
import { ReviewModal } from '../components/ReviewModal';

export const MyExchangesPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Review modal state
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState<Exchange | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchExchanges = async () => {
    setLoading(true);
    try {
      const res = await api.exchanges.list();
      setExchanges(res.exchanges);
    } catch (err) {
      console.error('Error fetching exchanges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchExchanges();
    }
  }, [user]);

  const handleCompleteExchange = async (id: string) => {
    setActionLoadingId(id);
    try {
      await api.exchanges.complete(id);
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
      });
      await fetchExchanges();
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenReview = (exchange: Exchange) => {
    setSelectedExchangeForReview(exchange);
    setIsReviewModalOpen(true);
  };

  const activeList = exchanges.filter((e) => e.status === 'ACTIVE');
  const completedList = exchanges.filter((e) => e.status === 'COMPLETED');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
          My Skill Exchanges
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your ongoing learning partnerships, mark sessions completed, and rate peers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'active'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Active Partnerships ({activeList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'completed'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed Swaps ({completedList.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-40"
            />
          ))}
        </div>
      ) : activeTab === 'active' ? (
        /* Active Tab */
        activeList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Repeat className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No active exchanges right now</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Once an exchange request is accepted by either student, it will appear here for you to collaborate.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-4 py-2 text-xs font-semibold text-white brand-gradient rounded-xl shadow-sm"
            >
              Browse Recommended Partners
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeList.map((ex) => {
              const partner = ex.partner;
              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Partner Header */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          partner?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.name || 'Partner'}`
                        }
                        alt={partner?.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/students/${partner?.id}`}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-sky-600 transition"
                        >
                          {partner?.name || 'Partner Student'}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {partner?.department} • {partner?.college}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Started on{' '}
                          {new Date(ex.startedAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Active Exchange</span>
                    </div>
                  </div>

                  {/* Skills Pairing */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">You Teach:</span>
                      <SkillTag name={ex.userTeaches} variant="offered" size="sm" />
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-violet-800">You Learn:</span>
                      <SkillTag name={ex.userLearns} variant="required" size="sm" />
                    </div>
                  </div>

                  {/* Bottom Action: Mark as Completed */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Ready to finish this swap? Mark it complete to give mutual ratings!
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCompleteExchange(ex.id)}
                      disabled={actionLoadingId === ex.id}
                      className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{actionLoadingId === ex.id ? 'Completing...' : 'Mark as Completed'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Completed Tab */
        completedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No completed exchanges yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you finish learning sessions with a peer and mark them as completed, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedList.map((ex) => {
              const partner = ex.partner;
              return (
                <div
                  key={ex.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          partner?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.name || 'Partner'}`
                        }
                        alt={partner?.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/students/${partner?.id}`}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-sky-600 transition"
                        >
                          {partner?.name || 'Partner Student'}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {partner?.department} • {partner?.college}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Completed on{' '}
                          {ex.completedAt
                            ? new Date(ex.completedAt).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Completed</span>
                    </div>
                  </div>

                  {/* Skills pairing */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 mr-1.5">You taught:</span>
                      <strong className="text-slate-800">{ex.userTeaches}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 mr-1.5">You learned:</span>
                      <strong className="text-slate-800">{ex.userLearns}</strong>
                    </div>
                  </div>

                  {/* Rating / Review Status */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
                    {ex.hasReviewed ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>You rated {partner?.name}</span>
                          <div className="flex items-center gap-0.5 ml-1">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star
                                key={st}
                                className={`w-3.5 h-3.5 ${
                                  st <= (ex.myReview?.rating || 5)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        {ex.myReview?.feedback && (
                          <p className="text-xs text-slate-600 italic">
                            "{ex.myReview.feedback}"
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-amber-700 font-medium">
                          ★ Share your feedback to help {partner?.name}'s student reputation!
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenReview(ex)}
                          className="px-4 py-2 text-xs font-bold text-white brand-gradient rounded-xl shadow-sm hover:opacity-95 transition flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Rate & Review Partner</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Review Modal */}
      <ReviewModal
        exchange={selectedExchangeForReview}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedExchangeForReview(null);
        }}
        onSuccess={() => {
          fetchExchanges();
          refreshUser();
        }}
      />
    </div>
  );
};
