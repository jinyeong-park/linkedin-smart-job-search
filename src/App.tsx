/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Bell, 
  Search, 
  ChevronLeft, 
  Bookmark, 
  ExternalLink,
  CheckCircle2,
  MoreHorizontal,
  ArrowRight,
  Filter,
  Check,
  ChevronDown,
  Share2,
  Sparkles,
  Info
} from 'lucide-react';
import { Application, DailyStats, GlobalState, Screen, Job } from './types';

// --- DATA ---

const INITIAL_JOBS: Job[] = [
  {
    id: 'rippling-pm',
    company: 'Rippling',
    logo: 'R',
    role: 'Group PM, Growth',
    location: 'Remote',
    salary: '$160k–$200k',
    applicants: 8,
    posted: '5 hours ago',
    tags: ['Easy Apply'],
    isEasyApply: true,
    matchScore: 94
  },
  {
    id: 'notion-pm',
    company: 'Notion',
    logo: 'N',
    role: 'Senior Product Manager',
    location: 'San Francisco (Hybrid)',
    salary: '$130k–$170k',
    applicants: 47,
    posted: '2 days ago',
    tags: [],
    isEasyApply: false,
    matchScore: 87,
    highlights: {
      focus: 'Productivity / Enterprise SaaS',
      team: 'Design-led, cross-functional',
      challenge: 'Reimagining collaborative docs for scale'
    }
  },
  {
    id: 'stripe-pm',
    company: 'Stripe',
    logo: 'S',
    role: 'Product Manager',
    location: 'Remote',
    salary: '$140k–$180k',
    applicants: 23,
    posted: '1 day ago',
    tags: ['Easy Apply'],
    isEasyApply: true,
    matchScore: 82
  },
  {
    id: 'linear-pl',
    company: 'Linear',
    logo: 'L',
    role: 'Product Lead',
    location: 'Remote',
    salary: '$125k–$155k',
    applicants: 31,
    posted: '3 days ago',
    tags: [],
    isEasyApply: false,
    matchScore: 71
  },
  {
    id: 'figma-pm',
    company: 'Figma',
    logo: 'F',
    role: 'Senior PM, Platform',
    location: 'New York (Remote OK)',
    salary: '$145k–$185k',
    applicants: 12,
    posted: '4 days ago',
    tags: [],
    isEasyApply: false,
    matchScore: 58
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-stripe',
    company: 'Stripe',
    role: 'Product Manager',
    location: 'Remote',
    appliedDate: '14 days ago',
    isExternal: false,
    isEasyApply: true,
    status: 'No response',
    daysSinceApplied: 14
  },
  {
    id: 'app-linear',
    company: 'Linear',
    role: 'Product Lead',
    location: 'Remote',
    appliedDate: '8 days ago',
    isExternal: true,
    isEasyApply: false,
    status: 'No response',
    daysSinceApplied: 8
  },
  {
    id: 'app-figma',
    company: 'Figma',
    role: 'Senior PM, Platform',
    location: 'New York',
    appliedDate: '3 days ago',
    isExternal: false,
    isEasyApply: true,
    status: 'Applied',
    daysSinceApplied: 3
  }
];

// --- CONTEXT ---

interface AppContextType {
  state: GlobalState;
  screen: Screen;
  navigate: (s: Screen) => void;
  addApplication: (a: Application) => void;
  updateStatus: (id: string, s: Application['status']) => void;
  showToast: (msg: string) => void;
  setDailyGoal: (goal: number) => void;
  setSearchQuery: (q: string) => void;
  setSelectedJobId: (id: string | null) => void;
  setPremiumModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

// --- COMPONENTS ---

const PremiumModal = ({ show, onClose }: { show: boolean, onClose: () => void }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10"
      >
        <div className="bg-gradient-to-br from-[#F8F1E4] to-[#FFF] p-8 text-center border-b border-[#C37B16]/20">
           <div className="w-16 h-16 bg-[#F1E4CE] rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
             <Sparkles size={32} className="text-[#C37B16] fill-[#C37B16]" />
           </div>
           <h2 className="text-2xl font-black text-[#915907] mb-2 leading-tight">Unlock Your Competitive Edge</h2>
           <p className="text-sm text-[#915907]/80 font-medium max-w-[300px] mx-auto">
             Stop guessing. See exactly how you match against the market and get hired faster.
           </p>
        </div>
        
        <div className="p-8 space-y-6">
           <div className="grid grid-cols-1 gap-5">
              <PremiumFeatureItem 
                icon={<Sparkles className="text-[#C37B16]" />} 
                title="AI-Powered Matching Scores" 
                desc="See which jobs are worth your time. Instant % match based on your skills and the complete JD."
              />
              <PremiumFeatureItem 
                icon={<Search className="text-[#C37B16]" />} 
                title="AI JD Highlights" 
                desc="Quickly scan focus, team culture, and business challenges without reading the whole text."
              />
              <PremiumFeatureItem 
                icon={<Filter className="text-[#C37B16]" />} 
                title="Advanced Priority Sorting" 
                desc="Sort search results by match score to focus on high-impact opportunities first."
              />
              <PremiumFeatureItem 
                icon={<Users className="text-[#C37B16]" />} 
                title="Who's Hired You Insights" 
                desc="See which companies and recruiters are showing interest in your profile."
              />
              <PremiumFeatureItem 
                icon={<MessageSquare className="text-[#C37B16]" />} 
                title="5 InMail Messages / Month" 
                desc="Reach out directly to any recruiter or hiring manager, even if you are not connected."
              />
           </div>

           <div className="pt-4 space-y-3">
              <button className="w-full py-4 bg-[#0A66C2] text-white font-black rounded-full hover:bg-[#004182] transition-all shadow-lg shadow-blue-500/20 text-lg">
                Start My Free Trial
              </button>
              <button 
                onClick={onClose}
                className="w-full py-2 text-linkedin-text-secondary font-bold text-sm hover:text-linkedin-text bg-gray-50 rounded-lg"
              >
                Maybe later
              </button>
           </div>
           <p className="text-[10px] text-gray-400 text-center px-4">
             3-day free trial, then $39.99/month. Cancel anytime.
           </p>
        </div>
      </motion.div>
    </div>
  );
};

const TrialExpiredModal = ({ show, onUpgrade }: { show: boolean, onUpgrade: () => void }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-[#FFF3CD] rounded-2xl mx-auto flex items-center justify-center text-4xl mb-6 shadow-inner">🔓</div>
          <h2 className="text-3xl font-black text-linkedin-text mb-4">Trial Ended!</h2>
          <p className="text-linkedin-text-secondary mb-8 leading-relaxed">
            Your 3-day Match Score trial has expired. Upgrade to LinkedIn Premium to continue seeing how your resume matches every job.
          </p>
          <div className="space-y-4">
             <button 
               onClick={onUpgrade}
               className="w-full py-4 bg-[#FFD700] text-black font-black rounded-full hover:bg-[#F0C800] transition-all transform active:scale-95 shadow-lg"
             >
               Unlock Match Scores
             </button>
             <button className="text-linkedin-text-secondary font-bold hover:underline">Maybe later</button>
          </div>
        </div>
        <div className="bg-gray-50 p-6 flex items-center justify-center gap-6">
           <div className="flex flex-col items-center">
             <span className="text-xs font-bold text-gray-400 uppercase">Recruiters</span>
             <span className="text-sm font-black">5+ Messaged</span>
           </div>
           <div className="w-px h-8 bg-gray-200" />
           <div className="flex flex-col items-center">
             <span className="text-xs font-bold text-gray-400 uppercase">Interviews</span>
             <span className="text-sm font-black">3x More</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
const PremiumFeatureItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex gap-4 items-start group">
    <div className="w-10 h-10 rounded-xl bg-[#F8F1E4] border border-[#C37B16]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-linkedin-text text-sm mb-1">{title}</h4>
      <p className="text-xs text-linkedin-text-secondary leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Navbar = () => {
  const { screen, navigate, state, setSearchQuery } = useApp();
  
  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] bg-white border-b border-[#EBEBEB] z-[70] flex justify-center px-4 shadow-sm">
      <div className="w-full max-w-[1128px] h-full flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div 
            onClick={() => navigate('SEARCH')}
            className="w-8 h-8 bg-[#0A66C2] rounded flex items-center justify-center text-white font-bold text-xl cursor-pointer hover:bg-[#004182] transition-colors"
          >
            in
          </div>
          <div className="relative max-w-[280px] w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search jobs, companies..."
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#EDF3F8] py-1.5 pl-10 pr-4 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0A66C2]" 
            />
          </div>
        </div>

        <nav className="flex items-center h-full">
           <NavIconButton icon={<Home size={22} />} label="Home" />
           <NavIconButton 
             icon={<Briefcase size={22} />} 
             label="Jobs" 
             active={screen === 'SEARCH' || screen === 'DETAIL'} 
             onClick={() => navigate('SEARCH')} 
           />
           <NavIconButton 
             icon={<CheckCircle2 size={22} />} 
             label="My Apps" 
             active={screen === 'DASHBOARD' || screen === 'FOLLOW_UP'} 
             onClick={() => navigate('DASHBOARD')} 
             badge={state.dailyStats.applied + state.dailyStats.external} 
           />
           <NavIconButton icon={<Bell size={22} />} label="Notifications" />
           <div className="px-3 flex flex-col items-center cursor-pointer text-linkedin-text-secondary hover:text-black transition-colors self-stretch justify-center">
              <div className="w-5 h-5 rounded-full overflow-hidden mb-0.5">
                <img src="https://picsum.photos/seed/jenny/100/100" alt="Me" referrerPolicy="no-referrer" />
              </div>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">Me</span>
                <ChevronDown size={10} />
              </div>
           </div>
        </nav>
      </div>
    </header>
  );
};

const NavIconButton = ({ icon, label, active, onClick, badge }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, badge?: number }) => (
  <button 
    onClick={onClick}
    className={`px-3 flex flex-col items-center relative h-full justify-center transition-colors border-b-2 ${active ? 'text-black border-black' : 'text-linkedin-text-secondary hover:text-black border-transparent'}`}
  >
    <div className="relative">
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-[#CC1016] text-white text-[10px] font-bold min-w-[14px] h-[14px] rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </div>
    <span className="text-[10px] mt-0.5 hidden md:block">{label}</span>
  </button>
);

const TrialBanner = () => {
  const { state } = useApp();
  const [visible, setVisible] = useState(true);

  if (!visible || !state.trialActive) return null;

  return (
    <div className="fixed top-[52px] left-0 right-0 bg-[#FFF3CD] border-b border-[#FFE69C] z-50 flex flex-col items-center shadow-sm">
      <div className="w-full max-w-[1128px] px-4 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs md:text-sm text-[#856404] font-medium min-w-0">
          <span className="flex-shrink-0">✨</span>
          <p className="truncate">
            Match Score Trial — <strong>{state.trialDaysLeft} days left</strong>. Jobs are sorted by how well they match your resume and profile.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="text-xs md:text-sm font-bold text-linkedin-blue hover:underline whitespace-nowrap">
            Upgrade to keep it →
          </button>
          <button 
            onClick={() => setVisible(false)}
            className="text-[#856404]/60 hover:text-[#856404] p-1"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
      </div>
      <div className="w-full h-[3px] bg-[#FFE69C]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(state.trialDaysLeft / 3) * 100}%` }}
          className="h-full bg-[#856404]"
        />
      </div>
    </div>
  );
};

const MobileNav = () => {
  const { screen, navigate, state } = useApp();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-linkedin-border flex items-center justify-around z-[60]">
      <NavIconButton icon={<Home size={22} />} label="Home" onClick={() => navigate('SEARCH')} active={screen === 'SEARCH'} />
      <NavIconButton 
        icon={<Briefcase size={22} />} 
        label="Jobs" 
        onClick={() => navigate('SEARCH')} 
        active={screen === 'SEARCH'} 
      />
      <NavIconButton 
        icon={<CheckCircle2 size={22} />} 
        label="My Apps" 
        onClick={() => navigate('DASHBOARD')} 
        active={screen === 'DASHBOARD' || screen === 'FOLLOW_UP'} 
        badge={state.dailyStats.applied + state.dailyStats.external}
      />
      <NavIconButton icon={<Bell size={22} />} label="Notifications" />
      <div className="flex flex-col items-center px-3">
        <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden border border-white">
          <img src="https://picsum.photos/seed/jenny/100/100" alt="Me" referrerPolicy="no-referrer" />
        </div>
        <span className="text-[10px] text-linkedin-text-secondary">Me</span>
      </div>
    </nav>
  );
};

const Sidebar = () => {
  const { navigate, setPremiumModalOpen } = useApp();
  
  return (
    <div className="hidden lg:flex flex-col gap-2 w-[225px] flex-shrink-0">
      <div className="bg-linkedin-card rounded-lg shadow-linkedin overflow-hidden">
        <div className="h-14 bg-gray-200"></div>
        <div className="px-3 pb-4 -mt-8 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden bg-white mb-2 shadow-sm">
             <img src="https://picsum.photos/seed/jenny/100/100" alt="Profile" referrerPolicy="no-referrer" />
          </div>
          <h3 className="font-semibold text-base hover:underline cursor-pointer">Jenny Park</h3>
          <p className="text-xs text-linkedin-text-secondary text-center">Product Manager at —</p>
          <div className="mt-2 bg-[#E7F3FF] text-linkedin-blue text-[10px] font-bold px-2 py-0.5 rounded inline-block">OPEN TO WORK</div>
        </div>
        <div className="py-3 px-3 hover:bg-gray-100 cursor-pointer border-t border-linkedin-border">
          <p className="text-[11px] text-linkedin-text hover:underline font-semibold flex items-center justify-between">
            Who's hired Jenny
            <span className="text-linkedin-blue">24</span>
          </p>
        </div>
      </div>

      <div className="bg-linkedin-card rounded-lg shadow-linkedin py-3 px-3">
        <h4 className="text-xs font-semibold mb-2">My details</h4>
        <div className="flex flex-col gap-2">
           <SidebarLink text="Preference" />
           <SidebarLink text="Job tracker" onClick={() => navigate('DASHBOARD')} />
           <SidebarLink text="My career Insights" />
        </div>
      </div>

      <div className="bg-linkedin-card rounded-lg shadow-linkedin p-3 flex flex-col items-center text-center">
        <div className="flex items-center gap-1 mb-1">
          <Sparkles size={12} className="text-[#C37B16] fill-[#C37B16]" />
          <p className="text-[10px] font-bold text-[#915907]">Premium trial active</p>
        </div>
        <p className="text-[10px] text-linkedin-text-secondary mb-3">
          Matching Score sorting is free for <b>3 days</b>. Keep it forever with Premium.
        </p>
        <button 
          onClick={() => setPremiumModalOpen(true)}
          className="w-full text-[#915907] font-bold text-xs border border-[#C37B16] bg-[#F8F1E4] rounded-full px-4 py-1.5 hover:bg-[#F1E4CE] transition-colors"
        >
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
};

const SidebarLink = ({ text, onClick }: { text: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="text-xs text-linkedin-blue font-semibold hover:underline cursor-pointer"
  >
    {text}
  </div>
);

const Toast = ({ message, onHide }: { message: string, onHide: () => void }) => {
  useEffect(() => {
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [onHide]);

  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 20, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="fixed top-20 right-4 left-4 md:left-auto md:w-80 bg-[#057642] text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 z-[60]"
    >
      <CheckCircle2 size={24} />
      <span className="text-sm font-medium">{message}</span>
    </motion.div>
  );
};

// --- SCREEN 1: SEARCH ---

const StatsPill = ({ label, count, active }: { label: string, count: number, active?: boolean }) => (
  <motion.div 
    className={`flex items-center gap-2 py-1 relative ${active ? 'text-black' : 'text-gray-500'}`}
    key={count}
    initial={{ scale: 1 }}
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 0.3 }}
  >
    <span className="font-bold text-sm md:text-base">{label}</span>
    <span className="bg-black text-white px-2 py-0.5 rounded-full text-[10px] md:text-[12px] font-bold min-w-[24px] text-center">
      {count}
    </span>
    {active && <div className="absolute -bottom-2 left-0 right-0 h-1 bg-black rounded-full" />}
  </motion.div>
);

const JobSearchScreen = ({ onApply }: { onApply: () => void }) => {
  const { state, navigate, setDailyGoal, setSelectedJobId } = useApp();
  const [sortByMatch, setSortByMatch] = useState(true);
  
  const filteredJobs = INITIAL_JOBS
    .filter(job => 
      job.role.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(state.searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortByMatch) {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      return 0; // default order (initial jobs array order)
    });

  const selectedJob = INITIAL_JOBS.find(j => j.id === state.selectedJobId) || filteredJobs[0];

  return (
    <div className="flex flex-col gap-4">
      {/* progress banner */}
      <div className="bg-linkedin-card rounded-lg shadow-linkedin p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="font-semibold text-lg">Today's Progress</h2>
          <div className="flex gap-4 md:gap-8 items-center">
            <StatsPill label="Liked" count={state.dailyStats.saved} />
            <StatsPill label="Applied" count={state.dailyStats.applied} active={true} />
            <StatsPill label="External" count={state.dailyStats.external} />
          </div>
        </div>
        <div className="space-y-1">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-linkedin-blue"
              initial={{ width: `${(state.dailyStats.applied / state.dailyGoal) * 100}%` }}
              animate={{ width: `${(state.dailyStats.applied / state.dailyGoal) * 100}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-linkedin-text-secondary">
            <span className="font-semibold text-linkedin-blue">{state.dailyStats.applied} of</span>
            <input 
              type="number"
              value={state.dailyGoal}
              onChange={(e) => setDailyGoal(parseInt(e.target.value) || 1)}
              className="w-10 bg-transparent border-b border-linkedin-blue/30 text-linkedin-blue font-bold text-center outline-none focus:border-linkedin-blue"
            />
            <span>daily goal</span>
          </div>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_500px] gap-6">
        <div className="flex flex-col gap-2">
          <div className="px-1 mb-2">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="font-semibold text-lg">
                  {state.searchQuery ? `Search results for "${state.searchQuery}"` : "Top job picks for you"}
                </h2>
                <p className="text-xs text-linkedin-text-secondary">
                  Showing {filteredJobs.length} jobs · Sorted by {sortByMatch ? 'Match Score' : 'Most recent'}
                </p>
              </div>
              <div className="flex gap-2 mb-1">
                 <button 
                   onClick={() => setSortByMatch(true)}
                   className={`text-[11px] px-3 py-1 rounded-full font-bold transition-all border ${sortByMatch ? 'bg-[#057642] text-white border-[#057642]' : 'bg-white text-linkedin-text-secondary border-gray-300 hover:bg-gray-50'}`}
                 >
                   ✨ Match Score
                 </button>
                 <button 
                   onClick={() => setSortByMatch(false)}
                   className={`text-[11px] px-3 py-1 rounded-full font-bold transition-all border ${!sortByMatch ? 'bg-linkedin-text-secondary text-white border-linkedin-text-secondary' : 'bg-white text-linkedin-text-secondary border-gray-300 hover:bg-gray-50'}`}
                 >
                   Recent
                 </button>
              </div>
            </div>
          </div>
          
          {/* filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar mb-2">
            <FilterChip label="Remote" active />
            <FilterChip label="Product Manager" />
            <FilterChip label="< 50 applicants" />
            <FilterChip label="Startup" />
            <FilterChip label="Date posted" icon={<ChevronDown size={14} />} />
          </div>

          {/* job list */}
          <div className="flex flex-col gap-3">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  active={state.selectedJobId === job.id}
                  onClick={() => setSelectedJobId(job.id)} 
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-lg shadow-linkedin">
                 <div className="text-4xl mb-4">🔍</div>
                 <p className="text-linkedin-text font-semibold">No results found</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Split Pane Detail */}
        <div className="hidden lg:block pt-[115px]">
           {selectedJob ? (
             <JDPreview job={selectedJob} onApply={onApply} />
           ) : (
             <div className="bg-linkedin-card rounded-lg shadow-linkedin p-12 text-center sticky top-[130px]">
                <Briefcase size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-400 font-medium whitespace-pre-wrap">Select a job to see details and AI-generated insights</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const JDPreview = ({ job, onApply }: { job: Job, onApply: () => void }) => {
  const { navigate, showToast } = useApp();
  const [showLogic, setShowLogic] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPANY' | 'MATCH'>('OVERVIEW');
  const [isApplyingExternal, setIsApplyingExternal] = useState(false);

  const handleExternalApply = () => {
    setIsApplyingExternal(true);
    setTimeout(() => {
      setIsApplyingExternal(false);
      onApply();
    }, 1500);
  };
  
  return (
    <div className="bg-linkedin-card rounded-lg shadow-linkedin overflow-hidden sticky top-[130px] h-[calc(100vh-150px)] flex flex-col">
       <div className="p-6 border-b border-gray-100 flex-shrink-0 relative">
         <AnimatePresence>
           {showLogic && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 10 }}
               className="absolute top-16 right-6 w-64 bg-white border border-[#C37B16]/30 shadow-2xl rounded-xl z-50 p-4"
             >
               <h4 className="text-xs font-black text-[#915907] uppercase tracking-widest mb-3 border-b border-[#C37B16]/10 pb-2 flex items-center justify-between">
                 Matching Logic
                 <button onClick={() => setShowLogic(false)} className="text-gray-400 hover:text-gray-600">×</button>
               </h4>
               <div className="space-y-3">
                 <LogicItem label="Strategic Resume Fit" weight="50%" value="High" icon="📄" color="text-linkedin-blue" />
                 <LogicItem label="LinkedIn Experience" weight="30%" value="Direct" icon="💼" color="text-linkedin-blue" />
                 <LogicItem label="Search Behavior" weight="20%" value="Aligned" icon="🔥" color="text-linkedin-blue" />
               </div>
               <p className="text-[9px] text-linkedin-text-secondary mt-4 bg-gray-50 p-2 rounded leading-tight">
                 Calculated by analyzing your active resume against JD semantic vectors.
               </p>
             </motion.div>
           )}
         </AnimatePresence>

         <div className="flex justify-between items-start mb-4">
           <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-3xl font-bold text-gray-400">
             {job.logo}
           </div>
           <div className="flex flex-col items-end gap-2">
             {job.matchScore && (
               <button 
                 onClick={() => setShowLogic(!showLogic)}
                 className="group bg-gradient-to-r from-[#F8F1E4] to-[#FFF] border border-[#C37B16]/30 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm transition-all hover:border-[#C37B16]/60 cursor-pointer"
               >
                 <div className="flex flex-col items-end leading-none">
                   <div className="flex items-center gap-1">
                     <Sparkles size={12} className="text-[#C37B16] fill-[#C37B16]" />
                     <span className="text-sm font-black text-[#915907]">{job.matchScore}% Match</span>
                     <Info size={10} className="text-[#C37B16] opacity-60 group-hover:opacity-100" />
                   </div>
                   <span className="text-[8px] uppercase tracking-widest font-black text-[#C37B16] mt-0.5">How it's calculated</span>
                 </div>
               </button>
             )}
           </div>
         </div>
         <h2 className="text-xl font-bold text-linkedin-text mb-1 truncate">{job.role}</h2>
         <div className="flex items-center gap-1.5 text-sm mb-4">
           <span className="font-semibold hover:underline cursor-pointer">{job.company}</span>
           <span className="text-linkedin-text-secondary truncate">· {job.location} · {job.salary}</span>
         </div>
         
         <div className="flex gap-2">
           <button 
             onClick={handleExternalApply}
             disabled={isApplyingExternal}
             className="flex-1 py-2.5 bg-linkedin-blue text-white font-bold rounded-full hover:bg-linkedin-blue-hover transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-70"
           >
             {isApplyingExternal ? (
               <>
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                 <span>Opening {job.company} careers...</span>
               </>
             ) : (
               <>
                 <span>{job.isEasyApply ? 'Easy Apply' : 'Apply on company website'}</span>
                 <ExternalLink size={16} />
               </>
             )}
           </button>
           <button 
             onClick={() => showToast('Job saved!')}
             className="px-4 py-2.5 border border-linkedin-blue text-linkedin-blue font-bold rounded-full hover:bg-blue-50 transition-colors text-sm"
           >
             <Bookmark size={18} />
           </button>
         </div>

         <div className="flex gap-6 mt-6 border-b border-gray-100 -mb-6">
            <button 
              onClick={() => setActiveTab('OVERVIEW')}
              className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'OVERVIEW' ? 'text-black' : 'text-linkedin-text-secondary hover:text-black'}`}
            >
              Overview
              {activeTab === 'OVERVIEW' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button 
              onClick={() => setActiveTab('COMPANY')}
              className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'COMPANY' ? 'text-black' : 'text-linkedin-text-secondary hover:text-black'}`}
            >
              Company
              {activeTab === 'COMPANY' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
            <button 
              onClick={() => setActiveTab('MATCH')}
              className={`pb-3 text-sm font-semibold transition-all relative ${activeTab === 'MATCH' ? 'text-black' : 'text-linkedin-text-secondary hover:text-black'}`}
            >
              How you match ✨
              {activeTab === 'MATCH' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />}
            </button>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pt-10">
          {activeTab === 'OVERVIEW' && (
            <>
              {job.highlights && (
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <h3 className="text-sm font-bold text-linkedin-blue mb-3 flex items-center gap-2">
                    <Search size={16} /> AI-Generated JD Highlights
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                     <HighlightItem icon="🚀" label="Focus" val={job.highlights.focus} />
                     <HighlightItem icon="👥" label="Team" val={job.highlights.team} />
                     <HighlightItem icon="⚡" label="Challenge" val={job.highlights.challenge} />
                  </div>
                </div>
              )}
              <div>
                <h3 className="font-bold text-base mb-2">Job Description</h3>
                <p className="text-sm text-linkedin-text-secondary leading-relaxed space-y-4">
                  <span>At {job.company}, we are looking for a {job.role} who can help us {job.highlights?.challenge.toLowerCase() || 'scale our products'}.</span>
                  <br /><br />
                  <span>Our core mission is to empower developers and startups by providing world-class infrastructure and design tools. You will be joining an elite team.</span>
                </p>
              </div>
            </>
          )}

          {activeTab === 'MATCH' && (
            <div className="space-y-6">
               <div className="bg-[#EDF3F8] rounded-xl p-4 border border-[#D0E1F0] flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-black text-linkedin-blue border-4 border-linkedin-blue">
                    {job.matchScore || '??'}%
                  </div>
                  <div>
                    <h4 className="font-bold text-linkedin-text">{job.matchScore && job.matchScore > 80 ? 'Good Match' : 'Potentail Match'}</h4>
                    <p className="text-xs text-linkedin-text-secondary">Based on your resume + LinkedIn profile</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-bold text-linkedin-text-secondary uppercase mb-2">Matched skills</h5>
                    <div className="flex flex-wrap gap-2">
                       <SkillTag label="Product Strategy" type="match" />
                       <SkillTag label="Cross-functional Leadership" type="match" />
                       <SkillTag label="B2B SaaS" type="match" />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-linkedin-text-secondary uppercase mb-2">Missing skills</h5>
                    <div className="flex flex-wrap gap-2">
                       <SkillTag label="SQL / Data Analysis" type="missing" />
                    </div>
                  </div>
               </div>

               <p className="text-[10px] text-linkedin-blue font-bold hover:underline cursor-pointer">Update profile to improve score →</p>
            </div>
          )}

          {activeTab === 'COMPANY' && (
            <div className="space-y-4">
               <h3 className="font-bold text-base">About {job.company}</h3>
               <p className="text-sm text-linkedin-text-secondary leading-relaxed">
                  {job.company} is a leading technology company dedicated to improving the way people work and collaborate. 
                  With over 2,000 employees globally, we focus on building products that matter.
               </p>
               <button className="text-sm font-bold text-linkedin-blue hover:underline">See more on Company Page</button>
            </div>
          )}
       </div>
    </div>
  );
};

const HighlightItem = ({ icon, label, val }: { icon: string, label: string, val: string }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-blue-600 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-medium text-gray-700">{val}</p>
    </div>
  </div>
);

const SkillTag = ({ label, type }: { label: string, type: 'match' | 'missing' }) => (
  <div className={`px-2 py-1 rounded text-[11px] font-semibold border ${
    type === 'match' ? 'bg-green-50 text-[#057642] border-[#057642]/20' : 'bg-orange-50 text-[#C37B16] border-[#C37B16]/20'
  }`}>
    {label}
  </div>
);

const LogicItem = ({ label, weight, value, icon, color }: { label: string, weight: string, value: string, icon: string, color: string }) => (
  <div className="flex items-center justify-between gap-2">
     <div className="flex items-center gap-2 overflow-hidden">
       <span className="text-xs">{icon}</span>
       <div className="min-w-0">
         <p className="text-[10px] font-bold text-linkedin-text truncate leading-none mb-0.5">{label}</p>
         <p className="text-[8px] text-linkedin-text-secondary uppercase tracking-tighter">Weight: {weight}</p>
       </div>
     </div>
     <span className={`text-[10px] font-black ${color}`}>{value}</span>
  </div>
);

const FilterChip = ({ label, active, icon, onClick }: { label: string, active?: boolean, icon?: React.ReactNode, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`whitespace-nowrap px-3 py-1 rounded-full border text-sm font-semibold transition-colors flex items-center gap-1 ${active ? 'bg-[#057642] text-white border-[#057642]' : 'bg-transparent text-linkedin-text-secondary border-gray-400 hover:bg-gray-100 hover:text-linkedin-text'}`}
  >
    {label}
    {icon}
  </button>
);

const JobCard: React.FC<{ job: Job, onClick?: () => void, active?: boolean }> = ({ job, onClick, active }) => {
  const isBestShot = job.matchScore && job.matchScore >= 85 && job.applicants < 15;
  
  return (
    <div 
      className={`bg-linkedin-card rounded-lg shadow-linkedin p-4 flex flex-col gap-3 group transition-all cursor-pointer border-2 ${active ? 'border-linkedin-blue bg-blue-50/10' : 'border-transparent hover:border-gray-200'}`} 
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400 flex-shrink-0">
          {job.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 group-hover:underline">
            <h3 className="font-semibold text-linkedin-blue decoration-2 truncate text-base">{job.role}</h3>
            {job.isVerified && <CheckCircle2 size={14} className="text-gray-500 fill-gray-100" />}
          </div>
          <p className="text-sm text-linkedin-text truncate -mt-0.5">{job.company}</p>
          <p className="text-xs text-linkedin-text-secondary truncate">{job.location}</p>
          
          <div className="mt-1 flex flex-col gap-0.5">
            {job.benefits && (
              <p className="text-[11px] text-linkedin-text-secondary truncate">
                {job.benefits.join(', ')}
              </p>
            )}
            {(job.connectionsCount || job.alumniCount) && (
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex -space-x-1.5">
                  {[1, 2].map(i => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${job.id}-${i}/20/20`} alt="" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-linkedin-text-secondary ml-1">
                  {job.connectionsCount ? `${job.connectionsCount} connections work here` : `${job.alumniCount} school alumni work here`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-linkedin-text-secondary mt-1.5 font-medium">
             {job.salary && (
               <>
                 <span className="text-linkedin-text">{job.salary}</span>
                 <span>·</span>
               </>
             )}
             <span className={job.applicants < 15 ? 'text-[#057642]' : ''}>{job.applicants} applicants</span>
             <span>·</span>
             <span>{job.posted}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {job.isEarlyApplicant && (
              <span className="text-[11px] text-[#057642] font-semibold">Be an early applicant</span>
            )}
            {isBestShot && (
              <span className="text-[10px] font-black italic px-2 py-0.5 bg-orange-100 text-[#C37B16] rounded shadow-sm">🔥 Best Shot</span>
            )}
            {job.tags.map(tag => (
              <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded ${tag.includes('Easy') ? 'bg-green-50 text-[#057642]' : 'bg-[#FFF3E0] text-[#915907]'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 self-start flex flex-col items-end gap-2">
           {job.matchScore && (
             <div className="flex flex-col items-end">
               <div className="bg-[#F8F1E4] border border-[#C37B16]/20 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                 <Sparkles size={10} className="text-[#C37B16] fill-[#C37B16]" />
                 <span className="text-[10px] font-bold text-[#915907]">{job.matchScore}% Match</span>
                 <Info size={8} className="text-[#C37B16] opacity-50" />
               </div>
               <p className="text-[8px] uppercase tracking-tighter font-extrabold text-[#C37B16] mt-0.5 opacity-80">Premium</p>
             </div>
           )}
           <button 
             className="p-1 hover:bg-gray-100 rounded-full transition-colors text-linkedin-text-secondary hover:text-linkedin-text"
             onClick={(e) => { e.stopPropagation(); }}
           >
              <MoreHorizontal size={20} />
           </button>
        </div>
      </div>
      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button className="flex-1 py-1 btn-pill border border-linkedin-blue text-linkedin-blue text-xs font-bold hover:bg-blue-50 transition-colors">
          Save
        </button>
        <button className="flex-1 py-1 btn-pill bg-linkedin-blue text-white text-xs font-bold hover:bg-linkedin-blue-hover transition-colors">
          {job.isEasyApply ? 'Easy Apply' : 'Apply'}
        </button>
      </div>
    </div>
  );
};

// --- SCREEN 2: DETAIL ---

const DetailScreen = ({ onApply }: { onApply: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const handleApplyClick = () => {
    setLoading(true);
    setTimeout(onApply, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20">
      <div className="flex-1 flex flex-col gap-4">
        <div className="bg-linkedin-card rounded-lg shadow-linkedin overflow-hidden">
          <div className="h-24 bg-gray-100 relative">
             <div className="absolute -bottom-6 left-6 w-20 h-20 bg-white rounded shadow-sm flex items-center justify-center text-4xl font-bold text-gray-300">
               N
             </div>
          </div>
          <div className="pt-10 px-6 pb-6 border-b border-linkedin-border">
            <h1 className="text-2xl font-semibold mb-1">Senior Product Manager</h1>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-medium text-sm">Notion</span>
              <CheckCircle2 size={14} className="text-gray-500 fill-gray-100" />
            </div>
            
            <div className="text-sm text-linkedin-text-secondary flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
              <span>San Francisco, CA (Hybrid)</span>
              <span>·</span>
              <span>2 days ago</span>
              <span>·</span>
              <span className="text-[#057642] font-semibold">47 applicants</span>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-linkedin-text">
                <span className="font-bold">$130k/yr – $170k/yr</span>
                <span className="text-gray-300">|</span>
                <span className="flex items-center gap-1 text-gray-500">
                  Medical, 401(k)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/notion-${i}/24/24`} alt="" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-linkedin-text-secondary font-medium">
                  12 school alumni work here · Be an early applicant
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={handleApplyClick}
                disabled={loading}
                className="px-6 py-2 rounded-full bg-linkedin-blue text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-linkedin-blue-hover transition-colors disabled:opacity-70 min-w-[200px]"
              >
                {loading ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <span>Apply on company website</span>
                    <ExternalLink size={16} />
                  </>
                )}
              </button>
              <button className="px-6 py-2 rounded-full border border-linkedin-blue text-linkedin-blue font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors">
                <Bookmark size={16} />
                <span>Save</span>
              </button>
              <button 
                onClick={onApply}
                className="px-6 py-2 rounded-full border border-gray-400 text-linkedin-text-secondary font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <Check size={16} />
                <span>Mark as applied</span>
              </button>
            </div>

            <div className="flex gap-4 border-b border-linkedin-border">
               <button className="py-3 border-b-2 border-linkedin-blue text-linkedin-blue font-semibold text-sm">Overview</button>
               <button className="py-3 text-linkedin-text-secondary font-semibold text-sm hover:text-linkedin-text">Company</button>
               <button className="py-3 text-linkedin-text-secondary font-semibold text-sm hover:text-linkedin-text">How you match</button>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <section>
              <h3 className="font-semibold text-lg mb-3">About the role</h3>
              <p className="text-sm leading-relaxed text-linkedin-text">
                Notion is looking for a Senior Product Manager to help us redefine how teams collaborate. You will own core features that enable millions of people to organize their lives and work more effectively. You'll work closely with engineering and design to ship high-quality products that are both powerful and delightful.
              </p>
            </section>
            <section>
              <h3 className="font-semibold text-lg mb-3">Requirements</h3>
              <ul className="list-disc pl-5 text-sm space-y-2 text-linkedin-text">
                <li>5+ years of experience in product management at a high-growth SaaS company.</li>
                <li>Proven track record of leading cross-functional teams to deliver impactful products.</li>
                <li>Deeply data-driven mindset with strong analytical skills.</li>
                <li>Exceptional communication and storytelling abilities.</li>
                <li>Experience with B2B SaaS or productivity tools is a major plus.</li>
              </ul>
            </section>
            <section>
              <h3 className="font-semibold text-lg mb-3">About Notion</h3>
              <p className="text-sm leading-relaxed text-linkedin-text">
                Notion is more than just a doc. It's a workspace for every team. We're on a mission to build a universal tool for notes, tasks, and wikis that adapts to the way people think.
              </p>
            </section>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
        <div className="bg-linkedin-card rounded-lg shadow-linkedin p-6 sticky top-20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xl font-bold text-gray-300">N</div>
             <div className="min-w-0">
               <h4 className="font-semibold text-sm">Senior Product Manager</h4>
               <p className="text-xs text-linkedin-text-secondary">Notion</p>
             </div>
          </div>
          <div className="mt-6 space-y-4">
             <p className="text-xs text-linkedin-text-secondary flex items-center gap-2">
               <Users size={16} />
               <span>47 people have applied</span>
             </p>
             <button className="text-xs text-linkedin-blue font-semibold hover:underline border-t border-linkedin-border pt-4 w-full text-left">
               Report this listing
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SCREEN 3: MODAL ---

const Modal = ({ show, onClose, onConfirm }: { show: boolean, onClose: () => void, onConfirm: () => void }) => {
  const { state } = useApp();
  const [step, setStep] = useState<'INITIAL' | 'SUCCESS'>('INITIAL');
  
  if (!show) return null;

  const appliedCount = state.dailyStats.applied + state.dailyStats.external;
  const isPrimacyNudge = appliedCount >= 2;

  const handleApplyConfirm = () => {
    onConfirm();
    setStep('SUCCESS');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden"
      >
        {step === 'INITIAL' ? (
          <div>
            <div className="p-8">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-linkedin-text mb-2">Did you apply at Notion?</h2>
              <p className="text-sm text-linkedin-text-secondary leading-relaxed mb-6">
                We noticed you opened their career page. If you completed the application, we'll update your tracker and help you with the next step.
              </p>
              {isPrimacyNudge && (
                <div className="bg-[#F8F1E4] border border-[#C37B16]/20 rounded-lg p-4 mb-2">
                   <div className="flex items-center gap-2 mb-2">
                     <Sparkles size={16} className="text-[#C37B16] fill-[#C37B16]" />
                     <span className="text-sm font-bold text-[#915907]">Unlock Your Competitive Edge</span>
                   </div>
                   <p className="text-xs text-[#915907]/80 leading-relaxed">
                     You've applied to {appliedCount} jobs today! Premium users get **5 direct InMail messages** to recruiters per month. Stand out by messaging the hiring manager.
                   </p>
                </div>
              )}
            </div>
            <div className="px-8 py-6 bg-gray-50 flex flex-col md:flex-row gap-3">
              <button 
                onClick={handleApplyConfirm}
                className="flex-[2] py-2.5 bg-linkedin-blue text-white font-bold rounded-full hover:bg-linkedin-blue-hover transition-colors shadow-sm"
              >
                Yes, I applied
              </button>
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 text-linkedin-text font-bold rounded-full hover:bg-gray-100 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
               ✓
             </div>
             <h2 className="text-2xl font-bold text-linkedin-text mb-2">Application Tracked!</h2>
             <p className="text-sm text-linkedin-text-secondary mb-8 leading-relaxed px-4">
               Nice work, Jenny. We've added this to your dashboard. You're {state.dailyStats.applied + 1} steps closer to your goal.
             </p>
             <button 
               onClick={() => { setStep('INITIAL'); onClose(); }}
               className="w-full py-3 bg-linkedin-blue text-white font-bold rounded-full"
             >
               Keep going
             </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

// --- SCREEN 4: DASHBOARD ---

const DashboardScreen = () => {
  const { state, navigate, setDailyGoal } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'EASY' | 'EXTERNAL'>('ALL');

  const filteredApplications = state.applications.filter(app => {
    if (filter === 'EASY') return !app.isExternal;
    if (filter === 'EXTERNAL') return app.isExternal;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard label="Saved" count={state.dailyStats.saved} color="gray" />
        <SummaryCard label="Total Applied" count={state.totalApplications} color="blue" />
        <SummaryCard label="Easy Apply" count={state.applications.filter(a => !a.isExternal).length} color="green" />
        <SummaryCard label="External" count={state.applications.filter(a => a.isExternal).length} color="orange" />
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <div className="bg-linkedin-card rounded-lg shadow-linkedin overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
               <h1 className="text-xl font-bold text-linkedin-text">My Applications</h1>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${filter === 'ALL' ? 'bg-white text-linkedin-text shadow-sm' : 'text-linkedin-text-secondary hover:text-linkedin-text'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilter('EASY')}
                    className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${filter === 'EASY' ? 'bg-white text-linkedin-text shadow-sm' : 'text-linkedin-text-secondary hover:text-linkedin-text'}`}
                  >
                    Easy Apply
                  </button>
                  <button 
                    onClick={() => setFilter('EXTERNAL')}
                    className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${filter === 'EXTERNAL' ? 'bg-white text-linkedin-text shadow-sm' : 'text-linkedin-text-secondary hover:text-linkedin-text'}`}
                  >
                    External
                  </button>
               </div>
            </div>

            {state.dailyStats.saved > 0 && (
              <div className="bg-blue-50/50 p-4 border-b border-blue-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">⏳</div>
                  <div>
                    <p className="text-sm font-bold text-linkedin-blue">Your saved jobs are waiting</p>
                    <p className="text-xs text-linkedin-text-secondary">You have {state.dailyStats.saved} saved jobs you haven't applied to yet. Don't miss out!</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('SEARCH')}
                  className="px-4 py-1.5 bg-linkedin-blue text-white text-xs font-bold rounded-full hover:bg-linkedin-blue-hover transition-colors"
                >
                  Apply now
                </button>
              </div>
            )}

            <div className="divide-y divide-gray-100">
               {filteredApplications.map((app) => (
                 <ApplicationCard key={app.id} app={app} onFollowUp={() => navigate('FOLLOW_UP')} />
               ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
           <div className="bg-linkedin-card rounded-lg shadow-linkedin p-6">
              <h3 className="font-bold text-sm mb-4">Goal Progress</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">{state.dailyStats.applied} applied</span>
                <span className="text-xs text-linkedin-text-secondary">Goal: {state.dailyGoal}</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(state.dailyStats.applied / state.dailyGoal) * 100}%` }}
                   className="h-full bg-[#057642]" 
                 />
              </div>
              <p className="text-[11px] text-linkedin-text-secondary text-center">
                Average {Math.round(state.dailyStats.applied / 7)} apps/day this week.
              </p>
           </div>

           <div className="bg-linkedin-card rounded-lg shadow-linkedin p-6">
              <h3 className="font-bold text-sm mb-4">Weekly Applications</h3>
              <div className="flex items-end justify-between h-24 gap-1.5 pt-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                  const heights = [40, 70, 45, 90, 65, 30, 10];
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="w-full bg-gray-100 rounded-t-sm relative h-20">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${heights[i]}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className={`absolute bottom-0 w-full rounded-t-sm transition-all ${i === 3 ? 'bg-linkedin-blue' : 'bg-gray-300 group-hover:bg-gray-400'}`}
                        />
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-linkedin-text text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                          {Math.round(heights[i] / 10)} apps
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-linkedin-text-secondary">{day}</span>
                    </div>
                  );
                })}
              </div>
           </div>

           <div className="bg-gradient-to-br from-[#0A66C2] to-[#004182] rounded-lg shadow-lg p-6 text-white text-center">
              <Sparkles className="mx-auto mb-4 text-[#FFD700]" size={32} />
              <h3 className="font-bold text-lg mb-2">Get Noticed</h3>
              <p className="text-sm text-blue-100 mb-6">Users with 80%+ Match Score get 3x more interviews. Unlock yours.</p>
              <button 
                onClick={() => navigate('SEARCH')}
                className="w-full py-2 bg-[#FFD700] text-black font-bold rounded-full hover:bg-[#F0C800] transition-colors shadow-lg"
              >
                Try Premium for $0
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, count, color }: { label: string, count: number, color: 'gray' | 'blue' | 'green' | 'orange' }) => {
  const colors = {
    gray: 'text-gray-600 bg-gray-50 border-gray-200',
    blue: 'text-linkedin-blue bg-blue-50 border-blue-200',
    green: 'text-[#057642] bg-green-50 border-green-200',
    orange: 'text-[#C37B16] bg-orange-50 border-orange-200'
  };

  return (
    <div className={`p-4 rounded-xl border flex flex-col items-center bg-linkedin-card shadow-sm ${colors[color]}`}>
      <span className="text-2xl font-black mb-1">{count}</span>
      <span className="text-[10px] font-extrabold uppercase tracking-widest">{label}</span>
    </div>
  );
};

const TabFilter = ({ label, count, active, color }: { label: string, count: number, active?: boolean, color?: string }) => {
  const variants: any = {
    blue: 'text-linkedin-blue bg-[#E7F3FF]',
    orange: 'text-[#E67E22] bg-[#FFF3E0]',
    green: 'text-[#057642] bg-[#E7F3ED]',
    red: 'text-[#D11124] bg-[#FCE8E8]',
    default: 'text-linkedin-text-secondary bg-white border border-gray-300'
  };
  
  const currentClass = active ? 'bg-[#1D2226] text-white' : (variants[color || 'default'] || variants.default);
  
  return (
    <button className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 ${currentClass}`}>
      {label}
      <span className="opacity-70">{count}</span>
    </button>
  );
};

const ApplicationCard: React.FC<{ app: Application, onFollowUp: () => void }> = ({ app, onFollowUp }) => {
  const statusColors = {
    'Applied': 'bg-[#E7F3FF] text-linkedin-blue',
    'Interviewing': 'bg-[#E7F3ED] text-[#057642]',
    'No response': 'bg-[#FFF3E0] text-[#E67E22]',
    'Following up': 'bg-[#F2E7FF] text-[#6C2BD9]'
  };

  return (
    <div className="bg-linkedin-card rounded-lg shadow-linkedin p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group hover:shadow-linkedin-hover transition-all">
      {app.new && (
        <div className="absolute top-0 right-0 bg-[#E6FFFA] text-[#00695C] text-[10px] px-2 py-0.5 rounded-bl font-bold">NEW</div>
      )}
      <div className="flex gap-4">
        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xl font-bold text-gray-400">
          {app.company[0]}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold">{app.role}</h4>
          <p className="text-sm text-linkedin-text-secondary">{app.company} · {app.location}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${statusColors[app.status]}`}>
              {app.status === 'No response' ? '⏰ Pending' : app.status}
            </span>
            <span className="text-xs text-linkedin-text-secondary">
               Applied {app.appliedDate} · {app.isExternal ? 'External' : 'Easy Apply'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="w-full md:w-auto">
          {app.status === 'No response' || app.status === 'Applied' ? (
             <div className="space-y-1 mb-2">
                <div className="h-1.5 w-40 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${app.daysSinceApplied >= 7 ? 'bg-orange-400' : 'bg-linkedin-blue'}`} style={{ width: `${Math.min((app.daysSinceApplied / 14) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[10px] text-right font-medium">
                  {app.daysSinceApplied >= 14 ? (
                    <span className="text-red-600">⚠️ Day 14 — follow up recommended</span>
                  ) : app.daysSinceApplied >= 8 ? (
                    <span className="text-orange-600">⏰ Day {app.daysSinceApplied} — time to follow up</span>
                  ) : (
                    <span className="text-linkedin-text-secondary">Day {app.daysSinceApplied} of 14</span>
                  )}
                </p>
             </div>
          ) : null}
          <button 
            disabled={app.daysSinceApplied < 5 && !app.new && app.status !== 'No response'}
            onClick={onFollowUp}
            className={`w-full md:w-auto px-4 py-1.5 btn-pill text-xs border ${
              app.status === 'No response' 
              ? 'bg-transparent border-linkedin-blue text-linkedin-blue hover:bg-blue-50' 
              : 'bg-white border-gray-300 text-linkedin-text-secondary hover:bg-gray-50 disabled:opacity-50'
            }`}
          >
            Follow up
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SCREEN 5: FOLLOW-UP ---

const FollowUpScreen = () => {
  const { navigate, showToast, updateStatus } = useApp();
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      showToast('Message sent to Sarah Kim');
      updateStatus('2', 'Following up'); // update linear app status
      navigate('DASHBOARD');
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('DASHBOARD')} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Follow up with Linear</h1>
          <p className="text-sm text-linkedin-text-secondary">Applied 8 days ago · No response yet</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-linkedin-card rounded-lg shadow-linkedin p-4 flex gap-4 items-center border-l-4 border-orange-400">
             <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center font-bold text-gray-400">L</div>
             <div className="flex-1">
               <h4 className="font-semibold text-sm">Linear · Product Lead</h4>
               <p className="text-xs text-linkedin-text-secondary">Applied 8 days ago</p>
             </div>
          </div>

          <div className="bg-linkedin-card rounded-lg shadow-linkedin p-6">
             <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-linkedin-text-secondary">Message Draft</h3>
             <textarea 
               className="w-full h-80 p-4 rounded-lg bg-gray-50 border border-linkedin-border focus:border-linkedin-blue outline-none text-sm leading-relaxed"
               defaultValue={`Hi Sarah,

I wanted to follow up on my application for the Product Lead role at Linear, submitted 8 days ago.

I'm genuinely excited about Linear's mission to make software development faster and more enjoyable. I'd love to discuss how my experience in product-led growth could contribute to your team.

Please let me know if there's anything else I can provide. Looking forward to hearing from you!

Best,
Jenny Park`}
             />
             <div className="flex flex-col md:flex-row gap-3 mt-6">
                <button 
                  onClick={handleSend}
                  disabled={isSending}
                  className="flex-1 py-3 bg-linkedin-blue text-white font-bold rounded-full flex items-center justify-center gap-2 hover:bg-linkedin-blue-hover transition-all disabled:opacity-70"
                >
                  {isSending ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span>Send via LinkedIn Message</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
                <button className="flex-1 py-3 border border-linkedin-blue text-linkedin-blue font-bold rounded-full hover:bg-blue-50 transition-colors">
                  Copy message
                </button>
             </div>
             <p className="text-[11px] text-linkedin-text-secondary text-center mt-3">
               We'll update your status to 'Following Up' after sending.
             </p>
          </div>
        </div>

        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
           <div className="bg-linkedin-card rounded-lg shadow-linkedin p-6">
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-linkedin-text-secondary">Recipient</h3>
              <div className="flex flex-col items-center text-center">
                 <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-4">
                    <img src="https://picsum.photos/seed/sarah/200/200" alt="Sarah Kim" referrerPolicy="no-referrer" />
                 </div>
                 <h4 className="font-bold text-lg">Sarah Kim</h4>
                 <p className="text-sm text-linkedin-text-secondary mb-4">Recruiter at Linear</p>
                 <div className="flex items-center gap-1 text-xs text-linkedin-text-secondary mb-6">
                    <Users size={14} />
                    <span>2nd connection</span>
                 </div>
                 <button className="w-full py-2 border border-linkedin-blue text-linkedin-blue text-sm font-semibold rounded-full hover:bg-blue-50 transition-colors">
                    Find on LinkedIn
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('SEARCH');
  const [state, setState] = useState<GlobalState>({
    dailyStats: { saved: 3, applied: 2, external: 1 },
    applications: INITIAL_APPLICATIONS,
    totalApplications: INITIAL_APPLICATIONS.length,
    dailyGoal: 10,
    searchQuery: '',
    selectedJobId: 'notion-pm',
    trialDaysLeft: 3,
    trialActive: true,
    matchScoreVisible: true
  });
  const [showModal, setShowModal] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = (s: Screen) => {
    setScreen(s);
    window.scrollTo(0, 0);
  };

  const setDailyGoal = (goal: number) => {
    setState(prev => ({ ...prev, dailyGoal: goal }));
  };

  const setSearchQuery = (q: string) => {
    setState(prev => ({ ...prev, searchQuery: q }));
  };

  const addApplication = (app: Application) => {
    setState(prev => ({
      ...prev,
      dailyStats: {
        ...prev.dailyStats,
        applied: prev.dailyStats.applied + 1,
        external: app.isExternal ? prev.dailyStats.external + 1 : prev.dailyStats.external
      },
      applications: [app, ...prev.applications],
      totalApplications: prev.totalApplications + 1
    }));
  };

  const updateStatus = (id: string, status: Application['status']) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a => a.id === id ? { ...a, status } : a)
    }));
  };

  const handleConfirmApply = () => {
    const job = INITIAL_JOBS.find(j => j.id === state.selectedJobId) || INITIAL_JOBS[1];
    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      company: job.company,
      role: job.role,
      location: job.location,
      appliedDate: 'just now',
      isExternal: !job.isEasyApply,
      isEasyApply: job.isEasyApply,
      status: 'Applied',
      daysSinceApplied: 1,
      new: true
    };
    
    setShowModal(false);
    addApplication(newApp);
    setToastMessage(`${job.company} · ${job.role} logged!`);
    navigate('SEARCH');
  };

  const setSelectedJobId = (id: string | null) => {
    setState(prev => ({ ...prev, selectedJobId: id }));
  };

  return (
    <AppContext.Provider value={{ 
      state, screen, navigate, addApplication, updateStatus, 
      showToast: setToastMessage, setDailyGoal, setSearchQuery, 
      setSelectedJobId,
      setPremiumModalOpen: setIsPremiumModalOpen
    }}>
      <div className="min-h-screen bg-linkedin-bg pb-20 md:pb-0">
        <Navbar />
        <TrialBanner />
        
        <main className={`pt-20 px-4 flex justify-center ${state.trialActive ? 'mt-10' : ''}`}>
          <div className="w-full max-w-[1128px] flex gap-6">
            {/* sidebar only on search screen and desktop */}
            {screen === 'SEARCH' && <Sidebar />}
            
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={screen}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {screen === 'SEARCH' && <JobSearchScreen onApply={() => setShowModal(true)} />}
                  {screen === 'DETAIL' && <DetailScreen onApply={() => setShowModal(true)} />}
                  {screen === 'DASHBOARD' && <DashboardScreen />}
                  {screen === 'FOLLOW_UP' && <FollowUpScreen />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>

        <MobileNav />
        <Modal 
          show={showModal} 
          onClose={() => setShowModal(false)} 
          onConfirm={handleConfirmApply} 
        />
        <PremiumModal 
          show={isPremiumModalOpen} 
          onClose={() => setIsPremiumModalOpen(false)} 
        />
        <TrialExpiredModal 
          show={state.trialActive && state.trialDaysLeft === 0} 
          onUpgrade={() => {
            setState(prev => ({ ...prev, trialActive: false }));
            setIsPremiumModalOpen(true);
          }}
        />
        <AnimatePresence>
          {toastMessage && (
            <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
          )}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
}
