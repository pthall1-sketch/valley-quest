import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Award, Scroll, ArrowRight, CheckCircle, User, Shield, Wand2, Sword } from 'lucide-react';

const AVATARS = [
  { id: 'warrior', name: 'Warrior', icon: Shield, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'mage', name: 'Mage', icon: Wand2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'rogue', name: 'Rogue', icon: Sword, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' }
];

const INITIAL_QUESTS = [
  {
    id: 1,
    title: "Whispers of the Whispering Woods",
    difficulty: "Easy",
    location: "Emerald Grove",
    rewardText: "150 Gold & Forest Charm",
    goldReward: 150,
    xpReward: 100,
    description: "Investigate strange glowing mushrooms appearing along the riverbank.",
    steps: [
      "Gather 3 Nightshade Blossoms",
      "Speak to Elder Thorne near the ancient oak",
      "Purify the corrupted spring"
    ]
  },
  {
    id: 2,
    title: "The Sunken Relic of Sun Valley",
    difficulty: "Medium",
    location: "Golden Basin",
    rewardText: "300 Gold & Sunstone Ring",
    goldReward: 300,
    xpReward: 250,
    description: "Retrieve the ancient ceremonial crest buried beneath the dry riverbed.",
    steps: [
      "Locate the marked monolith",
      "Solve the shadow sundial puzzle",
      "Defeat the Stone Sentinel"
    ]
  },
  {
    id: 3,
    title: "Shadows Over Frost Peak",
    difficulty: "Hard",
    location: "Highland Pass",
    rewardText: "600 Gold & Crest of Valor",
    goldReward: 600,
    xpReward: 500,
    description: "A mysterious chill has frozen the valley pass. Track down the source of the frost magic.",
    steps: [
      "Ascend to the Overlook Ruins",
      "Light the 3 Eternal Torches",
      "Banish the Frost Remnant"
    ]
  }
];

export default function ValleyQuest() {
  // Saved Profile State
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('valley_quest_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Profile Form State
  const [username, setUsername] = useState('');
  const [selectedClass, setSelectedClass] = useState('warrior');

  // Game States
  const [activeQuest, setActiveQuest] = useState(INITIAL_QUESTS[0]);
  const [completedSteps, setCompletedSteps] = useState({});
  const [claimedQuests, setClaimedQuests] = useState({});
  const [characterStats, setCharacterStats] = useState({ level: 1, xp: 0, gold: 100 });

  // Save Profile to LocalStorage
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const newProfile = {
      name: username,
      avatarClass: selectedClass,
      createdAt: new Date().toLocaleDateString()
    };

    setProfile(newProfile);
    localStorage.setItem('valley_quest_profile', JSON.stringify(newProfile));
  };

  const toggleStep = (questId: number, stepIndex: number) => {
    if (claimedQuests[questId]) return;
    const key = `${questId}-${stepIndex}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isQuestComplete = (quest: typeof INITIAL_QUESTS[0]) => {
    return quest.steps.every((_, idx) => completedSteps[`${quest.id}-${idx}`]);
  };

  const claimReward = (quest: typeof INITIAL_QUESTS[0]) => {
    if (!isQuestComplete(quest) || claimedQuests[quest.id]) return;

    setCharacterStats(prev => {
      const newXp = prev.xp + quest.xpReward;
      const newGold = prev.gold + quest.goldReward;
      const leveledUp = newXp >= 500;

      return {
        level: leveledUp ? prev.level + 1 : prev.level,
        xp: leveledUp ? newXp - 500 : newXp,
        gold: newGold
      };
    });

    setClaimedQuests(prev => ({ ...prev, [quest.id]: true }));
  };

  // --- Profile Creation View ---
  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-3">
              <Compass className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create Your Adventurer</h1>
            <p className="text-sm text-slate-400 mt-1">Enter the realm of Valley Quest</p>
          </div>

          <form onSubmit={handleCreateProfile} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Adventurer Name
              </label>
              <input
                type="text"
                required
                placeholder="Enter hero name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Choose Class
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AVATARS.map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedClass === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setSelectedClass(item.id)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-medium">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Begin Adventure
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Class Icon
  const ActiveClassIcon = AVATARS.find(a => a.id === profile.avatarClass)?.icon || User;

  // --- Main Dashboard View ---
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center pb-6 mb-8 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <ActiveClassIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              {profile.name} <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-xs text-slate-400 capitalize">
              {profile.avatarClass} Class • Joined {profile.createdAt}
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-6 bg-slate-800/80 px-5 py-3 rounded-xl border border-slate-700/50">
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Level</span>
            <span className="text-lg font-bold text-amber-400">{characterStats.level}</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">XP</span>
            <span className="text-lg font-bold text-emerald-400">{characterStats.xp}/500</span>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div className="text-center">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Gold</span>
            <span className="text-lg font-bold text-yellow-400">{characterStats.gold}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quest List */}
        <section className="md:col-span-1 space-y-3">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-4">
            <Scroll className="w-4 h-4 text-amber-400" /> Available Quests
          </h2>

          {INITIAL_QUESTS.map(quest => {
            const active = activeQuest.id === quest.id;
            const isClaimed = claimedQuests[quest.id];

            return (
              <button
                key={quest.id}
                onClick={() => setActiveQuest(quest)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                  active
                    ? 'bg-slate-800 border-amber-500/50 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    quest.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    quest.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {quest.difficulty}
                  </span>
                  {isClaimed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="font-semibold text-slate-200 mb-1">{quest.title}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {quest.location}
                </div>
              </button>
            );
          })}
        </section>

        {/* Quest Details */}
        <section className="md:col-span-2 bg-slate-800/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold tracking-wide uppercase">Active Objective</span>
                <h2 className="text-2xl font-bold text-white mt-1">{activeQuest.title}</h2>
              </div>
              <div className="flex items-center gap-1 text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {activeQuest.location}
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">{activeQuest.description}</p>

            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Objectives</h4>
              {activeQuest.steps.map((step, idx) => {
                const isDone = completedSteps[`${activeQuest.id}-${idx}`];

                return (
                  <label
                    key={idx}
                    onClick={() => toggleStep(activeQuest.id, idx)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      claimedQuests[activeQuest.id] ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                    } ${
                      isDone
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-400 line-through'
                        : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!isDone}
                      readOnly
                      className="rounded border-slate-700 bg-slate-800 text-amber-500"
                    />
                    <span className="text-sm">{step}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs text-slate-400 block">Reward</span>
                <span className="text-sm font-semibold text-slate-200">{activeQuest.rewardText}</span>
              </div>
            </div>

            <button
              onClick={() => claimReward(activeQuest)}
              disabled={!isQuestComplete(activeQuest) || claimedQuests[activeQuest.id]}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                claimedQuests[activeQuest.id]
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                  : isQuestComplete(activeQuest)
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              {claimedQuests[activeQuest.id] ? (
                <>Reward Claimed <CheckCircle className="w-4 h-4 text-emerald-400" /></>
              ) : (
                <>Claim Reward <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}