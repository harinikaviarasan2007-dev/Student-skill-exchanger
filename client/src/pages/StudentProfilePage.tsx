import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Globe,
  ArrowLeftRight,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
  AlertCircle,
} from 'lucide-react';
import { User, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SkillTag } from '../components/SkillTag';
import { ExchangeModal } from '../components/ExchangeModal';

export const StudentProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [student, setStudent] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [userRes, reviewRes] = await Promise.all([
        api.users.getById(id),
        api.reviews.getForUser(id),
      ]);
      setStudent(userRes.user);
      setReviews(reviewRes.reviews || []);
    } catch (err) {
      console.error('Error fetching student profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-48 bg-slate-200 rounded-3xl" />
        <div className="h-64 bg-slate-100 rounded-3xl" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="max-w-md mx-auto my-16 text-center bg-white p-8 rounded-3xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">Student Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          The requested profile does not exist or may have been removed.
        </p>
        <Link
          to="/explore"
          className="inline-block px-4 py-2 text-xs font-semibold text-white brand-gradient rounded-xl shadow-sm"
        >
          Return to Explore
        </Link>
      </div>
    );
  }

  const isSelf = currentUser?.id === student.id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Gradient Strip */}
        <div className="h-32 sm:h-40 brand-gradient relative" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <img
                src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                alt={student.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  {student.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {student.department}
                </p>
                <p className="text-xs text-slate-400">
                  {student.college} • {student.year}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="self-start sm:self-end pt-2 sm:pt-0">
              {isSelf ? (
                <Link
                  to="/profile"
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Edit My Profile
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 text-xs font-bold text-white brand-gradient rounded-xl shadow-lg shadow-sky-500/20 hover:opacity-95 transition flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>Request Skill Exchange</span>
                </button>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Rating
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-bold text-slate-800">
                  {student.averageRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({student.reviewCount})
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Completed Swaps
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-base font-bold text-slate-800">
                  {student.completedExchangesCount}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Availability
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-slate-800">
                  {student.availability}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Learning Mode
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Globe className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-bold text-slate-800">
                  {student.learningMode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Bio & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bio & Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">About Student</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {student.bio || 'No bio written yet.'}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 text-sm">Academic Details</h3>
            <div className="space-y-2">
              <p>
                <strong className="text-slate-800 font-medium">College:</strong> {student.college}
              </p>
              <p>
                <strong className="text-slate-800 font-medium">Department:</strong> {student.department}
              </p>
              <p>
                <strong className="text-slate-800 font-medium">Year of Study:</strong> {student.year}
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Skills & Reviews */}
        <div className="md:col-span-2 space-y-6">
          {/* Skills Breakdown Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-slate-900 text-sm">Skills Offered (Can Teach)</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.offeredSkills.length > 0 ? (
                  student.offeredSkills.map((s) => (
                    <SkillTag key={s.id} name={s.name} variant="offered" size="lg" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                <h3 className="font-bold text-slate-900 text-sm">Skills Required (Wants to Learn)</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.requiredSkills.length > 0 ? (
                  student.requiredSkills.map((s) => (
                    <SkillTag key={s.id} name={s.name} variant="required" size="lg" />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Feedback & Reviews Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Peer Reviews & Feedback ({reviews.length})
                </h3>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{student.averageRating.toFixed(1)} Average</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs italic">
                No feedback yet. Complete an exchange to receive verified student testimonials!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3 pt-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.reviewerName || 'Reviewer'}`}
                          alt={rev.reviewerName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          {rev.reviewerName || 'Student Peer'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`w-3.5 h-3.5 ${
                              st <= rev.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{rev.feedback}"
                    </p>
                    <span className="text-[10px] text-slate-400 block text-right">
                      {new Date(rev.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Exchange Modal */}
      <ExchangeModal
        recipient={student}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchProfile()}
      />
    </div>
  );
};
