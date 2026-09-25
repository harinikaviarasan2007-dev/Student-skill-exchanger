import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Users,
  Star,
  ShieldCheck,
  Zap,
  BookOpen,
  Code2,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/20 via-indigo-400/20 to-pink-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/80 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Smart College Peer-to-Peer Learning</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] max-w-4xl mx-auto leading-tight sm:leading-none">
            Learn. Teach.{' '}
            <span className="brand-text-gradient block sm:inline">Exchange Skills.</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with students who have the skills you want to learn — and share the skills you already know. No money involved, just pure peer-to-peer knowledge exchange.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white brand-gradient rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>{user ? 'Go to Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <span>Explore Skills & Peers</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free for College Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Intelligent Skill Matching Engine
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Verified Student Reviews
            </span>
          </div>
        </div>
      </section>

      {/* Visual Exchange Flow Showcase */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Outfit']">
              How Skill Swapping Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              The matching algorithm automatically finds complementary skill pairs between students.
            </p>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Student A */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  alt="Student A"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-sky-400"
                />
                <div>
                  <h4 className="font-bold text-slate-800">Student A (Arun)</h4>
                  <p className="text-xs text-slate-500">Computer Science • 3rd Year</p>
                </div>
                <div className="space-y-1.5 text-xs text-left">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg font-medium flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teaches: Python & SQL</span>
                  </div>
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-lg font-medium flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-violet-600" />
                    <span>Wants: UI/UX Design</span>
                  </div>
                </div>
              </div>

              {/* Middle Match Flow Arrow */}
              <div className="text-center py-4 md:py-0 space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl brand-gradient text-white shadow-md mx-auto">
                  <ArrowLeftRight className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    95% Perfect Match!
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Mutual Complementary Skills
                  </p>
                </div>
              </div>

              {/* Student B */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                  alt="Student B"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-violet-400"
                />
                <div>
                  <h4 className="font-bold text-slate-800">Student B (Priya)</h4>
                  <p className="text-xs text-slate-500">Interaction Design • 3rd Year</p>
                </div>
                <div className="space-y-1.5 text-xs text-left">
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg font-medium flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Teaches: UI/UX & Figma</span>
                  </div>
                  <div className="p-2 bg-violet-50 text-violet-800 rounded-lg font-medium flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-violet-600" />
                    <span>Wants: Python</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 font-['Outfit']">
              Why Students Love SkillSwap
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Everything built for real, accountable collaborative peer learning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Smart Matching */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Smart Matching</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Calculates match percentages based on complementary skills, compatible schedules, and reputation scores.
              </p>
            </div>

            {/* Card 2: Skill Exchange */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Skill Exchange</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Transparent request proposals. Set what you will teach, what you want to learn, and agree on learning sessions.
              </p>
            </div>

            {/* Card 3: Student Community */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Student Community</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Discover peers across engineering, design, arts, and business departments. Learn together with real campus accountability.
              </p>
            </div>

            {/* Card 4: Ratings & Feedback */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Ratings & Feedback</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Build your peer mentor reputation. After each completed exchange, students exchange 1–5 star reviews and written testimonials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-14 bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit']">
            Ready to exchange skills with fellow students?
          </h2>
          <p className="text-sky-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join students from top institutions already learning coding, UI design, video editing, public speaking, and mathematics.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-2xl shadow-lg transition"
            >
              <span>Create Your Student Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
