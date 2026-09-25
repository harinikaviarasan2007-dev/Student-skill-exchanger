import React from 'react';
import { ArrowLeftRight, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200/80 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 text-lg font-['Outfit']">SkillSwap</span>
              <p className="text-xs text-slate-500 font-medium">Learn. Teach. Exchange Skills.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <Link to="/explore" className="hover:text-sky-600 transition">Explore Students</Link>
            <Link to="/skills" className="hover:text-sky-600 transition">Skill Catalog</Link>
            <Link to="/dashboard" className="hover:text-sky-600 transition">Matching Engine</Link>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Built for Student Innovation with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} SkillSwap Platform. College Hackathon Prototype.</p>
          <p className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Empowering students to share knowledge without financial barriers.
          </p>
        </div>
      </div>
    </footer>
  );
};
