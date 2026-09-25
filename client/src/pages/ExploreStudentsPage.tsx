import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Clock,
  Globe,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react';
import { User, Skill } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StudentCard } from '../components/StudentCard';
import { ExchangeModal } from '../components/ExchangeModal';

export const ExploreStudentsPage: React.FC = () => {
  const { user } = useAuth();

  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');
  const [availability, setAvailability] = useState('All');
  const [learningMode, setLearningMode] = useState('All');
  const [minRating, setMinRating] = useState('0');
  const [sort, setSort] = useState('rating');

  // Exchange modal state
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSkillsList = async () => {
    try {
      const res = await api.skills.list();
      setAvailableSkills(res.skills);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (search) params.search = search;
      if (offeredSkill) params.offeredSkill = offeredSkill;
      if (requiredSkill) params.requiredSkill = requiredSkill;
      if (department !== 'All') params.department = department;
      if (year !== 'All') params.year = year;
      if (availability !== 'All') params.availability = availability;
      if (learningMode !== 'All') params.learningMode = learningMode;
      if (minRating !== '0') params.minRating = minRating;
      if (sort) params.sort = sort;

      const res = await api.users.list(params);
      setStudents(res.users);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsList();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [
    search,
    offeredSkill,
    requiredSkill,
    department,
    year,
    availability,
    learningMode,
    minRating,
    sort,
  ]);

  const handleResetFilters = () => {
    setSearch('');
    setOfferedSkill('');
    setRequiredSkill('');
    setDepartment('All');
    setYear('All');
    setAvailability('All');
    setLearningMode('All');
    setMinRating('0');
    setSort('rating');
  };

  const handleRequestExchange = (student: User) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Derive unique departments
  const departments = ['All', 'Computer Science', 'Interaction Design', 'Information Technology', 'Visual Communication', 'Data Science', 'Electrical & Electronics', 'Business & Entrepreneurship'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit']">
            Discover Peer Partners
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse through student profiles, filter by offered or desired skills, and initiate a swap.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetFilters}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, college, department, or skill (e.g., Python, Figma, UI/UX)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Filter by Offered Skill */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Skills Offered
            </label>
            <select
              value={offeredSkill}
              onChange={(e) => setOfferedSkill(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Any Skill</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Required Skill */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Skills Wanted
            </label>
            <select
              value={requiredSkill}
              onChange={(e) => setRequiredSkill(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Any Skill</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Availability
            </label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Schedules</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          {/* Learning Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Learning Mode
            </label>
            <select
              value={learningMode}
              onChange={(e) => setLearningMode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="All">All Modes</option>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="recent">Recently Joined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong>{students.length}</strong> student{students.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Students Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-slate-200 animate-pulse space-y-4 h-72"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="w-28 h-4 bg-slate-200 rounded" />
                  <div className="w-40 h-3 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="w-full h-20 bg-slate-100 rounded-xl" />
              <div className="w-full h-8 bg-slate-200 rounded-xl" />
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">No students found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or clearing filters to discover more peers.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-sky-600 bg-sky-50 rounded-xl hover:bg-sky-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              isSelf={user?.id === s.id}
              onRequestExchange={handleRequestExchange}
            />
          ))}
        </div>
      )}

      {/* Exchange Modal */}
      <ExchangeModal
        recipient={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSuccess={() => {
          fetchStudents();
        }}
      />
    </div>
  );
};
