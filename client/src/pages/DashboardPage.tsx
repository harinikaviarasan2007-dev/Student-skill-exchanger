import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  ArrowLeftRight,
  Star,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MatchResult, User, Exchange } from '../types';
import { MatchCard } from '../components/MatchCard';
import { SkillTag } from '../components/SkillTag';
import { ExchangeModal } from '../components/ExchangeModal';

export const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [activeExchanges, setActiveExchanges] = useState<Exchange[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [selectedRecipient, setSelectedRecipient] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoadingMatches(true);
    try {
      const [matchRes, exRes] = await Promise.all([
        api.matches.getRecommended(),
        api.exchanges.list(),
      ]);
      setMatches(matchRes.matches);
      setActiveExchanges(exRes.exchanges.filter((e) => e.status === 'ACTIVE'));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const handleOpenExchangeModal = (candidate: User) => {
    setSelectedRecipient(candidate);
    setIsModalOpen(true);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SkillSwap Active Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit']">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl">
              {user.department} • {user.college} ({user.year})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/explore"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 shadow transition flex items-center gap-1.5"
            >
              <span>Explore All Students</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/skills"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Manage Skills</span>
            </Link>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-0 pointer-events-none" />
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Skill Matches
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">
              {matches.length}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Active Exchanges
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">
              {activeExchanges.length}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Completed Swaps
            </span>
            <span className="text-xl sm:text-2xl font-bold text-slate-800">
              {user.completedExchangesCount}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Peer Rating
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-bold text-slate-800">
                {user.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
        </div>
      </div>

      {/* My Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Skills I Offer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Skills I Can Teach ({user.offeredSkills.length})
              </h3>
            </div>
            <Link
              to="/skills"
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Edit</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[44px]">
            {user.offeredSkills.length > 0 ? (
              user.offeredSkills.map((s) => (
                <SkillTag key={s.id} name={s.name} variant="offered" size="md" />
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                You haven't added any skills to teach yet. Add some to get matched!
              </p>
            )}
          </div>
        </div>

        {/* Skills I Want to Learn */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Skills I Want to Learn ({user.requiredSkills.length})
              </h3>
            </div>
            <Link
              to="/skills"
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              <span>Edit</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[44px]">
            {user.requiredSkills.length > 0 ? (
              user.requiredSkills.map((s) => (
                <SkillTag key={s.id} name={s.name} variant="required" size="md" />
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                You haven't added skills you want to learn yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Partners (Matching System Demonstration) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                Recommended Partners
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700">
                AI Match Score
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Peers intelligently calculated based on mutual skills, availability, and reputation
            </p>
          </div>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingMatches ? 'animate-spin' : ''}`} />
            <span>Refresh Matches</span>
          </button>
        </div>

        {loadingMatches ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4 h-64"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <div className="w-24 h-4 bg-slate-200 rounded" />
                    <div className="w-36 h-3 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="w-full h-16 bg-slate-100 rounded-xl" />
                <div className="w-full h-8 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">
              We couldn't find a strong match yet.
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adding more skills you can teach or skills you want to learn so our matching algorithm can find the best peers for you!
            </p>
            <Link
              to="/skills"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white brand-gradient shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Update My Skills</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m) => (
              <MatchCard
                key={m.candidate.id}
                match={m}
                onRequestExchange={handleOpenExchangeModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Exchange Request Modal */}
      <ExchangeModal
        recipient={selectedRecipient}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecipient(null);
        }}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </div>
  );
};
