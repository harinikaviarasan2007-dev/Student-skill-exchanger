import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  Star,
  Clock,
  Globe,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Layers,
  Sparkles,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { SkillTag } from '../components/SkillTag';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    department: user?.department || '',
    year: user?.year || '3rd Year',
    availability: user?.availability || 'Weekends',
    learningMode: user?.learningMode || 'Hybrid',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        name: user.name,
        college: user.college,
        department: user.department,
        year: user.year,
        availability: user.availability,
        learningMode: user.learningMode,
        bio: user.bio,
        avatar: user.avatar,
      });
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.users.update(user.id, formData);
      await refreshUser();
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Success alert */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Strip */}
        <div className="h-32 sm:h-36 brand-gradient relative" />

        <div className="px-6 pb-6 sm:px-8 sm:pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            <div className="flex items-end gap-4">
              <img
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md bg-white shrink-0"
              />
              <div className="pb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Outfit']">
                  {user.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {user.department} • {user.college}
                </p>
                <p className="text-xs text-slate-400">{user.year}</p>
              </div>
            </div>

            {/* Toggle Edit Button */}
            <button
              type="button"
              onClick={handleEditToggle}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 self-start sm:self-end ${
                isEditing
                  ? 'bg-slate-100 text-slate-700 border-slate-300'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300 shadow-sm'
              }`}
            >
              {isEditing ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Rating
              </span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-bold text-slate-800">
                  {user.averageRating.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  ({user.reviewCount})
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
                  {user.completedExchangesCount}
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
                  {user.availability}
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
                  {user.learningMode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing Form OR Details View */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Edit Profile Information</h3>
            <span className="text-xs text-slate-400">Update your public campus details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Avatar URL (Optional)
              </label>
              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                College / Institution
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course / Department
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Year of Study
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Availability
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Learning Mode
              </label>
              <select
                name="learningMode"
                value={formData.learningMode}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio & Goals
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold text-white brand-gradient rounded-xl shadow-md hover:opacity-95 transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {/* Bio Box */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">About Me</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {user.bio || 'You haven’t written a bio yet. Click "Edit Profile" to add one!'}
            </p>
          </div>

          {/* Skills Portfolio Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">My Active Skills</h3>
              <Link
                to="/skills"
                className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>Manage Skills</span>
                <Layers className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-2">
                Skills I Offer ({user.offeredSkills.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {user.offeredSkills.map((s) => (
                  <SkillTag key={s.id} name={s.name} variant="offered" size="md" />
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-violet-800 uppercase tracking-wider block mb-2">
                Skills I Want to Learn ({user.requiredSkills.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {user.requiredSkills.map((s) => (
                  <SkillTag key={s.id} name={s.name} variant="required" size="md" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
