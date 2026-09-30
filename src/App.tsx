import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Search, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  AlertTriangle, 
  Phone, 
  ExternalLink,
  Sparkles,
  User,
  Users,
  Code,
  Check,
  Building,
  School
} from 'lucide-react';

// Preset local Bakersfield environment & ZIP data
interface EnvData {
  zipCode: string;
  neighborhood: string;
  airQualityAQI: number;
  tempFahrenheit: number;
  fogWarning: boolean;
  healthResourceContact: string;
  localCenter: string;
}

const BAKERSFIELD_ZIPS: Record<string, EnvData> = {
  '93301': {
    zipCode: '93301',
    neighborhood: 'Downtown Bakersfield / Oleander',
    airQualityAQI: 68,
    tempFahrenheit: 82,
    fogWarning: false,
    healthResourceContact: 'Kern Behavioral Health (Downtown): (661) 868-8000',
    localCenter: 'Downtown Youth & Family Community Center'
  },
  '93309': {
    zipCode: '93309',
    neighborhood: 'Southwest Bakersfield / Stockdale',
    airQualityAQI: 74,
    tempFahrenheit: 84,
    fogWarning: false,
    healthResourceContact: 'Southwest Kern Community Wellness: (661) 868-8100',
    localCenter: 'Stockdale Student & Family Support Hub'
  },
  '93311': {
    zipCode: '93311',
    neighborhood: 'Seven Oaks / West Bakersfield',
    airQualityAQI: 55,
    tempFahrenheit: 83,
    fogWarning: false,
    healthResourceContact: 'West Kern Family Resource Center: (661) 868-8200',
    localCenter: 'Seven Oaks Community & Youth Learning Center'
  },
  '93306': {
    zipCode: '93306',
    neighborhood: 'Northeast / East Bakersfield',
    airQualityAQI: 82,
    tempFahrenheit: 85,
    fogWarning: true,
    healthResourceContact: 'East Bakersfield Health Clinic: (661) 868-8300',
    localCenter: 'Northeast Regional Family Center'
  }
};

// Local STEM Events
interface STEMEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  zipCode: string;
  category: 'Science Fair' | 'Robotics' | 'Coding Hackathon' | 'Mentoring';
  description: string;
}

const LOCAL_STEM_EVENTS: STEMEvent[] = [
  {
    id: 'e1',
    title: 'Kern County Regional Science & Engineering Fair Prep',
    date: '2026-10-15',
    location: 'Mechanics Bank Convention Center, Bakersfield',
    zipCode: '93301',
    category: 'Science Fair',
    description: 'Workshops for students and teacher advisors to finalize research abstracts and safety compliance.'
  },
  {
    id: 'e2',
    title: 'CSUB Robotics & Coding Mentor Showcase',
    date: '2026-10-22',
    location: 'CSU Bakersfield Science III Building',
    zipCode: '93311',
    category: 'Robotics',
    description: 'Connect high school and middle school coding teams with university mentors and local tech engineers.'
  },
  {
    id: 'e3',
    title: 'Bakersfield Student Hackathon for Environmental Health',
    date: '2026-11-05',
    location: 'Southwest Library Tech Hub',
    zipCode: '93309',
    category: 'Coding Hackathon',
    description: 'Build apps using real air quality and Valley weather datasets. Mentors and teachers available on-site.'
  }
];

// Student & Mentor Arcade Submissions
interface ArcadeProject {
  id: string;
  title: string;
  author: string;
  role: 'Student' | 'Teacher' | 'Mentor';
  platform: 'Scratch' | 'Web Code' | 'Robotics' | 'UEFN/Creative';
  zipCode: string;
  verifiedByTeacher: boolean;
  description: string;
  feedbackScore: number; // 1-6 scale
  commentsCount: number;
}

const INITIAL_PROJECTS: ArcadeProject[] = [
  {
    id: 'p1',
    title: 'San Joaquin Valley AQI Tracker & Air Simulator',
    author: 'Alex M. (Student Grade 10)',
    role: 'Student',
    platform: 'Web Code',
    zipCode: '93309',
    verifiedByTeacher: true,
    description: 'Interactive web dashboard visualizing local air quality indexes using public sensor APIs.',
    feedbackScore: 5.8,
    commentsCount: 4
  },
  {
    id: 'p2',
    title: 'Tule Fog Highway Safety Simulation',
    author: 'Mr. Pradeep T. (Physics Teacher)',
    role: 'Teacher',
    platform: 'Scratch',
    zipCode: '93301',
    verifiedByTeacher: true,
    description: 'Physics simulation demonstrating reaction times and vehicle stopping distances during Valley fog.',
    feedbackScore: 6.0,
    commentsCount: 8
  },
  {
    id: 'p3',
    title: 'Solar Powered Automated Water Purification Model',
    author: 'Elena R. (STEM Mentor)',
    role: 'Mentor',
    platform: 'Robotics',
    zipCode: '93311',
    verifiedByTeacher: true,
    description: 'Microcontroller setup measuring water turbidity and operating solar filtration pumps.',
    feedbackScore: 5.9,
    commentsCount: 6
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'env' | 'health' | 'stem' | 'arcade'>('env');
  
  // Zip & Location State
  const [zipInput, setZipInput] = useState('93309');
  const [currentEnv, setCurrentEnv] = useState<EnvData>(BAKERSFIELD_ZIPS['93309']);
  const [selectedDate, setSelectedDate] = useState('2026-10-15');

  // Mood Tracker State
  const [userMood, setUserMood] = useState<string | null>(null);

  // STEM Events Filter
  const [stemFilter, setStemFilter] = useState('');

  // Creator Arcade State
  const [projects, setProjects] = useState<ArcadeProject[]>(INITIAL_PROJECTS);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectPlatform, setNewProjectPlatform] = useState<'Scratch' | 'Web Code' | 'Robotics' | 'UEFN/Creative'>('Web Code');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [userRole, setUserRole] = useState<'Student' | 'Teacher' | 'Mentor'>('Student');

  // Feedback System
  const [selectedProject, setSelectedProject] = useState<ArcadeProject | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(6);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleZipSearch = () => {
    const found = BAKERSFIELD_ZIPS[zipInput.trim()];
    if (found) {
      setCurrentEnv(found);
    } else {
      // Default fallback for unknown zips
      setCurrentEnv({
        zipCode: zipInput,
        neighborhood: `Region around ZIP ${zipInput}`,
        airQualityAQI: 65,
        tempFahrenheit: 80,
        fogWarning: false,
        healthResourceContact: 'Kern County Behavioral Health & Recovery: (661) 868-8000',
        localCenter: 'Central Kern Community Health Center'
      });
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const created: ArcadeProject = {
      id: `p_${Date.now()}`,
      title: newProjectTitle,
      author: userRole === 'Student' ? 'You (Student)' : userRole === 'Teacher' ? 'You (Teacher)' : 'You (Mentor)',
      role: userRole,
      platform: newProjectPlatform,
      zipCode: currentEnv.zipCode,
      verifiedByTeacher: userRole === 'Teacher',
      description: newProjectDesc || 'Student / Mentor showcase project.',
      feedbackScore: 6.0,
      commentsCount: 0
    };

    setProjects([created, ...projects]);
    setNewProjectTitle('');
    setNewProjectDesc('');
  };

  const handleSubmitFeedback = () => {
    if (!selectedProject) return;
    
    setProjects(projects.map(p => {
      if (p.id === selectedProject.id) {
        const newCount = p.commentsCount + 1;
        const newAvg = Number(((p.feedbackScore * p.commentsCount + feedbackRating) / newCount).toFixed(1));
        return { ...p, feedbackScore: newAvg, commentsCount: newCount };
      }
      return p;
    }));

    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setSelectedProject(null);
      setFeedbackNote('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">ValleyQuest Hub</h1>
              <p className="text-xs text-slate-400">STEM, Health & Teacher-Student Arcade</p>
            </div>
          </div>

          {/* Quick ZIP & Date Toolbar */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center space-x-1 px-2 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>ZIP:</span>
            </div>
            <input 
              type="text" 
              value={zipInput} 
              onChange={(e) => setZipInput(e.target.value)}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-500"
              maxLength={5}
            />
            <button 
              onClick={handleZipSearch}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-1 rounded text-xs font-semibold transition"
            >
              Go
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 flex space-x-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('env')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'env' 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Environment & Local Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'health' 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Mental Health & Wellness</span>
          </button>

          <button
            onClick={() => setActiveTab('stem')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'stem' 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>STEM Events & Science Fair</span>
          </button>

          <button
            onClick={() => setActiveTab('arcade')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'arcade' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Creator Arcade & Mentors</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        
        {/* TAB 1: ENVIRONMENT & ZIP DASHBOARD */}
        {activeTab === 'env' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    ZIP {currentEnv.zipCode}
                  </span>
                  <h2 className="text-2xl font-bold mt-2">{currentEnv.neighborhood}</h2>
                  <p className="text-sm text-slate-400">Localized environmental telemetry & community metrics</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Target Date:</span>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Air Quality (AQI)</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-extrabold text-amber-400">{currentEnv.airQualityAQI}</span>
                    <span className="text-xs text-amber-400/80">Moderate Air Quality</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Suitable for outdoor school sports and science field activities.</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Temperature</span>
                  <div className="flex items-baseline space-x-2 mt-2">
                    <span className="text-3xl font-extrabold text-cyan-400">{currentEnv.tempFahrenheit}°F</span>
                    <span className="text-xs text-slate-400">San Joaquin Valley</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Clear visibility with light winds.</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 uppercase font-semibold">Valley Fog Alert</span>
                  <div className="mt-2">
                    {currentEnv.fogWarning ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/30">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Tule Fog Advisory Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Normal Roadway Visibility</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Updated station data from Kern County monitors.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Building className="w-5 h-5 text-amber-400" />
                  <span>Local Community Center</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{currentEnv.localCenter}</p>
                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>• After-school STEM tutoring & robotics access.</p>
                  <p>• Teacher & mentor office hours every Tuesday & Thursday.</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-rose-400" />
                  <span>Local Mental Health & Support Hotline</span>
                </h3>
                <p className="text-sm text-slate-400 mt-1">{currentEnv.healthResourceContact}</p>
                <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p>• 24/7 confidential crisis line and family counseling connection.</p>
                  <p>• Student peer support network & school counselor referral.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENTAL HEALTH & WELLNESS */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-rose-400" />
                <span>Student & Educator Wellbeing Hub</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Private, local check-in and direct connections to mental health resources connected to ZIP {currentEnv.zipCode}.
              </p>

              {/* Private Check-in */}
              <div className="mt-6 bg-slate-950 p-5 rounded-xl border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-200">How are you feeling today? (Private check-in)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  {[
                    { label: 'Great 😃', val: 'great' },
                    { label: 'Okay 🙂', val: 'okay' },
                    { label: 'Tired 🥱', val: 'tired' },
                    { label: 'Stressed 😟', val: 'stressed' }
                  ].map(m => (
                    <button
                      key={m.val}
                      onClick={() => setUserMood(m.val)}
                      className={`p-3 rounded-lg border text-xs font-semibold transition ${
                        userMood === m.val 
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                {userMood && (
                  <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300">
                    {userMood === 'stressed' || userMood === 'tired' ? (
                      <p>Remember to take short breaks during study sessions. Reach out to your school counselor or use the confidential hotline below whenever you need someone to talk to.</p>
                    ) : (
                      <p>Thanks for checking in! Keep up the great energy in your STEM projects and collaborative learning.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Resource Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-200 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>988 Suicide & Crisis Lifeline</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Free, confidential support available 24/7 call or text.</p>
                  <a 
                    href="tel:988" 
                    className="inline-flex items-center space-x-2 mt-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call or Text 988</span>
                  </a>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-slate-200 flex items-center space-x-2">
                    <Building className="w-5 h-5 text-amber-400" />
                    <span>Kern Behavioral Health - ZIP {currentEnv.zipCode}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">{currentEnv.healthResourceContact}</p>
                  <a 
                    href="tel:6618688000" 
                    className="inline-flex items-center space-x-2 mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Local Center</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEM EVENTS & SCIENCE FAIR */}
        {activeTab === 'stem' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                    <Award className="w-6 h-6 text-cyan-400" />
                    <span>STEM Events & Science Fair Coach</span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Connect with regional events, science fairs, and mentor workshops.</p>
                </div>

                {/* Event Category Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Filter events..." 
                    value={stemFilter}
                    onChange={(e) => setStemFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {LOCAL_STEM_EVENTS
                  .filter(e => e.title.toLowerCase().includes(stemFilter.toLowerCase()) || e.category.toLowerCase().includes(stemFilter.toLowerCase()))
                  .map(evt => (
                    <div key={evt.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {evt.category}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">ZIP {evt.zipCode}</span>
                        </div>
                        <h3 className="font-bold text-slate-200 text-sm mt-3">{evt.title}</h3>
                        <p className="text-xs text-slate-400 mt-2">{evt.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-900 space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{evt.date}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Science Fair Step-by-Step Coach */}
              <div className="mt-8 bg-slate-950 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Step-by-Step Science Fair Assistant</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { step: '1. Topic & Hypothesis', desc: 'Isolate local Valley environment or robotics variables.' },
                    { step: '2. Teacher Verification', desc: 'Ensure lab safety & mentor compliance approval.' },
                    { step: '3. Data Collection', desc: 'Record daily sensor or coding trial results.' },
                    { step: '4. Abstract & Showcase', desc: 'Submit to Creator Arcade for peer & mentor review.' }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                      <p className="font-bold text-amber-400">{s.step}</p>
                      <p className="text-slate-400 mt-1">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CREATOR ARCADE & MENTOR CONNECT */}
        {activeTab === 'arcade' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                    <Code className="w-6 h-6 text-emerald-400" />
                    <span>Teacher, Student & Mentor Arcade</span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Safe, moderated project sharing (COPPA/FERPA compliant). Peer & mentor feedback rated on a 6-point scale.
                  </p>
                </div>

                {/* Role Selector */}
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  {(['Student', 'Teacher', 'Mentor'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRole(r)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition ${
                        userRole === r 
                          ? 'bg-emerald-500 text-slate-950' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Project Form */}
              <form onSubmit={handleAddProject} className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
                <h3 className="text-xs uppercase font-bold text-slate-400 mb-3">Share Project to Arcade ({userRole} Mode)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input 
                    type="text" 
                    placeholder="Project Title..."
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newProjectPlatform}
                    onChange={(e) => setNewProjectPlatform(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Web Code">Web Code (React/JS)</option>
                    <option value="Scratch">Scratch / Block Coding</option>
                    <option value="Robotics">Robotics / Microcontroller</option>
                    <option value="UEFN/Creative">Fortnite Creative / UEFN</option>
                  </select>
                  <button 
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                  >
                    Publish to Arcade
                  </button>
                </div>
                <textarea 
                  placeholder="Short description of research, code, or simulation mechanics..."
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full mt-3 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  rows={2}
                />
              </form>

              {/* Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {p.platform}
                        </span>
                        {p.verifiedByTeacher && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                            <Check className="w-3 h-3" />
                            <span>Teacher Verified</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-200 text-sm mt-3">{p.title}</h3>
                      <p className="text-xs text-slate-400 mt-2">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">{p.author}</span>
                        <div className="flex items-center space-x-1 text-amber-400 font-bold">
                          <span>★ {p.feedbackScore}</span>
                          <span className="text-slate-600">({p.commentsCount})</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedProject(p)}
                        className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Give Mentor Feedback</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Moderated Feedback Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Constructive Feedback & Rating</h3>
            <p className="text-xs text-slate-400">
              Providing safe feedback for <span className="text-amber-400 font-semibold">{selectedProject.title}</span>.
            </p>

            {/* 6-Point Scale Selector */}
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-2">6-Point Rubric Rating:</label>
              <div className="grid grid-cols-6 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    onClick={() => setFeedbackRating(num)}
                    className={`py-2 rounded text-xs font-bold transition ${
                      feedbackRating === num 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Encouraging Note / Question:</label>
              <textarea 
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="Great use of variables! How did you test the sensor calibrations?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                rows={3}
              />
            </div>

            {feedbackSuccess ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-semibold text-center">
                Feedback submitted successfully!
              </div>
            ) : (
              <div className="flex space-x-2 pt-2">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 bg-slate-950 hover:bg-slate-800 text-slate-400 py-2 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmitFeedback}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-2 rounded-lg text-xs"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}