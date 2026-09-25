import React, { useState, useEffect } from 'react';
import { Plus, X, Layers, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Skill } from '../types';
import { SkillTag } from '../components/SkillTag';

export const MySkillsPage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [offeredInput, setOfferedInput] = useState('');
  const [requiredInput, setRequiredInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.skills.list();
        setAvailableSkills(res.skills);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCatalog();
  }, []);

  if (!user) return null;

  const currentOfferedNames = user.offeredSkills.map((s) => s.name);
  const currentRequiredNames = user.requiredSkills.map((s) => s.name);

  const handleAddOffered = async (skillName: string) => {
    if (!skillName.trim()) return;
    const name = skillName.trim();
    if (currentOfferedNames.some((n) => n.toLowerCase() === name.toLowerCase())) {
      return;
    }
    setLoading(true);
    try {
      await api.skills.addOffered(name);
      await refreshUser();
      setOfferedInput('');
      showSuccess(`Added "${name}" to skills you offer!`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOffered = async (skillId: string) => {
    setLoading(true);
    try {
      await api.skills.removeOffered(skillId);
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequired = async (skillName: string) => {
    if (!skillName.trim()) return;
    const name = skillName.trim();
    if (currentRequiredNames.some((n) => n.toLowerCase() === name.toLowerCase())) {
      return;
    }
    setLoading(true);
    try {
      await api.skills.addRequired(name);
      await refreshUser();
      setRequiredInput('');
      showSuccess(`Added "${name}" to skills you want to learn!`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRequired = async (skillId: string) => {
    setLoading(true);
    try {
      await api.skills.removeRequired(skillId);
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Preset suggestions
  const suggestedOffered = [
    'Python',
    'Java',
    'C++',
    'React',
    'SQL',
    'UI/UX Design',
    'Graphic Design',
    'Video Editing',
    'Machine Learning',
    'Public Speaking',
    'Mathematics',
  ].filter((s) => !currentOfferedNames.includes(s));

  const suggestedRequired = [
    'UI/UX Design',
    'Figma',
    'Python',
    'React',
    'JavaScript',
    'Data Science',
    'Video Editing',
    'Blender',
    'Spring Boot',
    'Public Speaking',
  ].filter((s) => !currentRequiredNames.includes(s));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>Knowledge Portfolio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
          Manage Your Skills
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify what you can teach and what you want to learn. Our intelligent matching engine pairs you with peers based on these skill sets.
        </p>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Skills Offered */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                <h3 className="font-bold text-slate-800 text-base">
                  Skills I Can Teach ({user.offeredSkills.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Offered
              </span>
            </div>

            {/* Input to add custom or typed skill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOffered(offeredInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={offeredInput}
                onChange={(e) => setOfferedInput(e.target.value)}
                placeholder="Type a skill (e.g. Python, SQL, Photography)..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
              <button
                type="submit"
                disabled={loading || !offeredInput.trim()}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Current Active Tags */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Active Offered Skills:
              </span>
              <div className="flex flex-wrap gap-2 min-h-[50px] p-3 rounded-2xl bg-slate-50 border border-slate-100">
                {user.offeredSkills.length > 0 ? (
                  user.offeredSkills.map((s) => (
                    <SkillTag
                      key={s.id}
                      name={s.name}
                      variant="offered"
                      size="md"
                      onRemove={() => handleRemoveOffered(s.id)}
                    />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic self-center">
                    No skills offered yet. Add at least one skill you can teach!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Click Suggestions */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Popular Quick Add:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedOffered.slice(0, 7).map((skillName) => (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => handleAddOffered(skillName)}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-600 font-medium transition"
                >
                  + {skillName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Skills Required */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full bg-violet-500 ring-4 ring-violet-100" />
                <h3 className="font-bold text-slate-800 text-base">
                  Skills I Want to Learn ({user.requiredSkills.length})
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-0.5 rounded-full">
                Required
              </span>
            </div>

            {/* Input to add custom or typed skill */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddRequired(requiredInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={requiredInput}
                onChange={(e) => setRequiredInput(e.target.value)}
                placeholder="Type a skill (e.g. UI/UX, React, Figma)..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition"
              />
              <button
                type="submit"
                disabled={loading || !requiredInput.trim()}
                className="px-4 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Current Active Tags */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Active Desired Skills:
              </span>
              <div className="flex flex-wrap gap-2 min-h-[50px] p-3 rounded-2xl bg-slate-50 border border-slate-100">
                {user.requiredSkills.length > 0 ? (
                  user.requiredSkills.map((s) => (
                    <SkillTag
                      key={s.id}
                      name={s.name}
                      variant="required"
                      size="md"
                      onRemove={() => handleRemoveRequired(s.id)}
                    />
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic self-center">
                    No skills requested yet. Add skills you wish to learn!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Click Suggestions */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">
              Popular Quick Add:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedRequired.slice(0, 7).map((skillName) => (
                <button
                  key={skillName}
                  type="button"
                  onClick={() => handleAddRequired(skillName)}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-slate-200 text-slate-600 font-medium transition"
                >
                  + {skillName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
