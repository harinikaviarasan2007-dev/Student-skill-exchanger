import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Sparkles, Clock, Globe, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { MatchResult } from '../types';
import { SkillTag } from './SkillTag';

interface MatchCardProps {
  match: MatchResult;
  onRequestExchange?: (candidate: MatchResult['candidate']) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onRequestExchange }) => {
  const { candidate, score, reasons, theyCanTeachYou, youCanTeachThem } = match;
  const [showReasons, setShowReasons] = useState(false);

  // Score color styling
  const getScoreBadge = () => {
    if (score >= 85) {
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20';
    }
    if (score >= 60) {
      return 'bg-sky-500/10 text-sky-700 border-sky-300 ring-1 ring-sky-500/20';
    }
    return 'bg-amber-500/10 text-amber-700 border-amber-300';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      {/* Top Banner / Match Score */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={candidate.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`}
              alt={candidate.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm group-hover:scale-105 transition-transform duration-200"
            />
            {candidate.averageRating >= 4.5 && (
              <span className="absolute -bottom-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm" title="Top Rated Student">
                <Star className="w-3 h-3 fill-white" />
              </span>
            )}
          </div>
          <div>
            <Link
              to={`/students/${candidate.id}`}
              className="font-bold text-base text-slate-800 hover:text-sky-600 transition flex items-center gap-1.5"
            >
              {candidate.name}
            </Link>
            <p className="text-xs text-slate-500 font-medium">{candidate.department}</p>
            <p className="text-[11px] text-slate-400">{candidate.college} • {candidate.year}</p>
          </div>
        </div>

        {/* Match Percentage Badge */}
        <div className="text-right">
          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadge()}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{score}% Match</span>
          </div>
          <div className="flex items-center justify-end gap-1 mt-1 text-xs text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{candidate.averageRating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({candidate.reviewCount || 0})</span>
          </div>
        </div>
      </div>

      {/* Skills Comparison Section */}
      <div className="p-5 space-y-3.5 flex-1">
        {/* Offers */}
        <div>
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1.5">
            Teaches / Offers
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.offeredSkills.map((s) => {
              const isDesiredByMe = theyCanTeachYou.includes(s.name);
              return (
                <SkillTag
                  key={s.id}
                  name={s.name}
                  variant={isDesiredByMe ? 'offered' : 'neutral'}
                  size="sm"
                />
              );
            })}
          </div>
        </div>

        {/* Wants */}
        <div>
          <span className="text-[11px] font-semibold text-violet-800 uppercase tracking-wider block mb-1.5">
            Wants to Learn
          </span>
          <div className="flex flex-wrap gap-1.5">
            {candidate.requiredSkills.map((s) => {
              const canBeTaughtByMe = youCanTeachThem.includes(s.name);
              return (
                <SkillTag
                  key={s.id}
                  name={s.name}
                  variant={canBeTaughtByMe ? 'required' : 'neutral'}
                  size="sm"
                />
              );
            })}
          </div>
        </div>

        {/* Badges: Availability & Mode */}
        <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {candidate.availability}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {candidate.learningMode}
          </span>
        </div>

        {/* "Why this match?" Accordion */}
        {reasons.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowReasons(!showReasons)}
              className="w-full flex items-center justify-between text-xs text-sky-700 font-semibold py-1 hover:text-sky-900 transition"
            >
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-600" /> Why this match?
              </span>
              {showReasons ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showReasons && (
              <div className="mt-2 p-2.5 rounded-xl bg-sky-50/70 border border-sky-100 space-y-1 text-xs text-sky-900 animate-in fade-in duration-150">
                {reasons.map((r, i) => (
                  <p key={i} className="flex items-start gap-1.5 font-medium leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{r.replace(/^✓\s*/, '')}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-3 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/students/${candidate.id}`}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition text-center shadow-sm"
        >
          View Profile
        </Link>
        <button
          type="button"
          onClick={() => onRequestExchange && onRequestExchange(candidate)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-white brand-gradient hover:opacity-95 rounded-xl transition text-center shadow-sm flex items-center justify-center gap-1"
        >
          <span>Swap Skills</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
