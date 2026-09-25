import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { SkillTag } from './SkillTag';

interface StudentCardProps {
  student: User;
  onRequestExchange?: (student: User) => void;
  isSelf?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onRequestExchange,
  isSelf,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group">
      <div className="p-5">
        {/* Header: Avatar, Name, Rating */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
              alt={student.name}
              className="w-13 h-13 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
            />
            <div>
              <Link
                to={`/students/${student.id}`}
                className="font-bold text-slate-900 hover:text-sky-600 transition text-sm sm:text-base flex items-center gap-1.5"
              >
                {student.name}
                {isSelf && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    You
                  </span>
                )}
              </Link>
              <p className="text-xs text-slate-500 font-medium">{student.department}</p>
              <p className="text-[11px] text-slate-400">{student.college} • {student.year}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{student.averageRating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400 font-normal">({student.reviewCount})</span>
          </div>
        </div>

        {/* Bio */}
        {student.bio && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {student.bio}
          </p>
        )}

        {/* Skills Offered */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1.5">
            Can Teach:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.offeredSkills.slice(0, 4).map((s) => (
              <SkillTag key={s.id} name={s.name} variant="offered" size="sm" />
            ))}
            {student.offeredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{student.offeredSkills.length - 4} more
              </span>
            )}
            {student.offeredSkills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mt-3">
          <span className="text-[11px] font-semibold text-violet-800 uppercase tracking-wider block mb-1.5">
            Wants to Learn:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {student.requiredSkills.slice(0, 4).map((s) => (
              <SkillTag key={s.id} name={s.name} variant="required" size="sm" />
            ))}
            {student.requiredSkills.length > 4 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{student.requiredSkills.length - 4} more
              </span>
            )}
            {student.requiredSkills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {student.availability}
          </span>
          <span className="inline-flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            {student.learningMode}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {student.completedExchangesCount} swaps
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
        <Link
          to={`/students/${student.id}`}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition text-center shadow-sm"
        >
          View Profile
        </Link>
        {!isSelf && onRequestExchange && (
          <button
            type="button"
            onClick={() => onRequestExchange(student)}
            className="flex-1 py-2 px-3 text-xs font-semibold text-white brand-gradient hover:opacity-95 rounded-xl transition text-center shadow-sm flex items-center justify-center gap-1"
          >
            <span>Request Swap</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
