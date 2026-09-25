import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  ArrowRight,
  ArrowLeftRight,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Inbox,
  Send,
  AlertCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ExchangeRequest } from '../types';
import { SkillTag } from '../components/SkillTag';

export const RequestsPage: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [receivedRequests, setReceivedRequests] = useState<ExchangeRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.requests.getReceived(),
        api.requests.getSent(),
      ]);
      setReceivedRequests(recRes.requests);
      setSentRequests(sentRes.requests);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const handleAccept = async (id: string) => {
    setActionLoadingId(id);
    try {
      await api.requests.accept(id);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      await api.requests.reject(id);
      await fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: ExchangeRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Accepted</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Declined</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Skill Exchange Requests
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review incoming invitations to collaborate and track the status of requests you've sent.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'received'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Received Invitations ({receivedRequests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition -mb-[1px] ${
            activeTab === 'sent'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Sent Proposals ({sentRequests.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse h-32"
            />
          ))}
        </div>
      ) : activeTab === 'received' ? (
        /* Received Requests Tab */
        receivedRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No pending requests yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When fellow students want to exchange skills with you, their requests will appear right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => {
              const sender = req.sender;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Sender profile */}
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          sender?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender?.name || 'Student'}`
                        }
                        alt={sender?.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/students/${req.senderId}`}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-sky-600 transition"
                        >
                          {sender?.name || 'Fellow Student'}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {sender?.department} • {sender?.college}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Sent on{' '}
                          {new Date(req.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  {/* Skills Pairing */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">They Teach:</span>
                      <SkillTag name={req.offeredSkillName} variant="offered" size="sm" />
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-violet-800">You Teach:</span>
                      <SkillTag name={req.requiredSkillName} variant="required" size="sm" />
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <p className="text-xs text-slate-600 italic bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                      "{req.message}"
                    </p>
                  )}

                  {/* Actions for Pending */}
                  {req.status === 'PENDING' && (
                    <div className="pt-2 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleReject(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="px-5 py-2 text-xs font-bold text-white brand-gradient rounded-xl shadow-md shadow-sky-500/20 hover:opacity-95 transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{actionLoadingId === req.id ? 'Accepting...' : 'Accept Exchange'}</span>
                      </button>
                    </div>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex items-center justify-between text-xs text-emerald-700">
                      <span className="font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Exchange active! Ready for collaboration.
                      </span>
                      <Link
                        to="/exchanges"
                        className="font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                      >
                        <span>View in My Exchanges</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Sent Requests Tab */
        sentRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Send className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No sent requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Explore student profiles and propose skill exchanges to begin learning together!
            </p>
            <Link
              to="/explore"
              className="inline-block px-4 py-2 text-xs font-semibold text-white brand-gradient rounded-xl shadow-sm"
            >
              Explore Students
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((req) => {
              const receiver = req.receiver;
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          receiver?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver?.name || 'Recipient'}`
                        }
                        alt={receiver?.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/students/${req.receiverId}`}
                          className="font-bold text-sm sm:text-base text-slate-900 hover:text-sky-600 transition"
                        >
                          {receiver?.name || 'Fellow Student'}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {receiver?.department} • {receiver?.college}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Sent on{' '}
                          {new Date(req.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  {/* Skills Pairing */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-800">You Teach:</span>
                      <SkillTag name={req.offeredSkillName} variant="offered" size="sm" />
                    </div>
                    <ArrowLeftRight className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-violet-800">You Learn:</span>
                      <SkillTag name={req.requiredSkillName} variant="required" size="sm" />
                    </div>
                  </div>

                  {req.message && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{req.message}"
                    </p>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <div className="pt-2 flex items-center justify-between text-xs text-emerald-700">
                      <span className="font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {receiver?.name} accepted your request!
                      </span>
                      <Link
                        to="/exchanges"
                        className="font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                      >
                        <span>Go to My Exchanges</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};
