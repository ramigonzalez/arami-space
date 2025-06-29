# 📋 **Product Requirements Document (PRD) - Arami Voice AI Companion**

**Version**: 1.0  
**Target Release**: MVP Sprint  
**Platform**: Web (Mobile-First PWA) - iPhone 16/16 Pro Optimized  
**Tech Stack**: Vite + React + TypeScript + Tailwind CSS

---

## 1. Executive Summary

Arami is a voice-first emotional AI companion that provides personalized daily rituals through conversational AI. Users complete a 3-5 minute voice onboarding with Genesis (our onboarding agent), receive personalized daily sessions, and track emotional growth through AI-generated insights. The application is designed as a Progressive Web App (PWA) optimized for iPhone 16/16 Pro with native mobile app appearance and functionality.

---

## 2. Technical Architecture

### **2.1 Frontend Stack**
- **Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS with mobile-first approach
- **Target Device**: iPhone 16/16 Pro (393×852px @ 3x density)
- **PWA Features**: Offline capability, app-like navigation, home screen installation
- **State Management**: Zustand for client state
- **Voice Integration**: ElevenLabs React SDK

### **2.2 Mobile-First Design Principles**
- **Viewport**: `width=device-width, initial-scale=1, viewport-fit=cover`
- **Safe Areas**: iOS safe area handling with `env(safe-area-inset-*)`
- **Navigation**: Bottom tab navigation for thumb-friendly access
- **Interactions**: Touch-optimized with 44px minimum touch targets
- **Performance**: Lazy loading, code splitting for fast mobile loading

---

## 3. Voice Onboarding System (Genesis Agent) - Implementation Required

### **3.1 Genesis Functionality**

**Purpose**: Collect personality, emotional, and ritual preferences through natural conversation

**Process Flow**:
1. **Welcome** (60s): Introduction + timeline explanation + first personality question
2. **Emotional Discovery** (90s): Explore goals, motivations, emotional categories  
3. **Ritual Design** (90s): Co-create daily ritual preferences
4. **Voice Selection** (60s): Choose personalized voice + completion
5. **Congratulations Page**: Show the data collected on the onboarding

**Required Client Tools**:
```typescript
// Client tools for Genesis agent
const genesisClientTools = {
  set_ui_step: ({ step }: { step: string }) => setCurrentStep(step),
  set_personality_profile: ({ disc, enneagram, confidence }: PersonalityProfile) => setPersonality({ disc, enneagram, confidence }),
  tag_knowledge_category: ({ categories }: { categories: string[] }) => setEmotionalCategories(categories),
  set_primary_goals: ({ goals }: { goals: string[] }) => setPrimaryGoals(goals),
  set_ritual_preferences: ({ timing, duration, style, voice_id, focus_area }: RitualPreferences) => setRitualPreferences({ timing, duration, style, voice_id, focus_area }),
  complete_onboarding: () => callCompleteOnboardingAPI(),
  end_call: () => endConversationSession()
};
```

**Genesis Outputs**:
```typescript
interface OnboardingResult {
  user_id: string;
  personality_profile: {
    disc: 'D' | 'I' | 'S' | 'C';
    enneagram?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    confidence: number; // 0.7-1.0
  };
  emotional_categories: Array<'stress_management' | 'goal_achievement' | 'relationships' | 'self_worth' | 'emotional_regulation'>;
  primary_goals: string[];
  ritual_preferences: {
    timing: 'morning_person' | 'evening_person';
    duration: 'quick_focused' | 'deeper_dive';
    style: 'guided_structure' | 'open_conversation';
    voice_id: 'confident_coach' | 'warm_friend' | 'gentle_guide' | 'wise_mentor';
    focus_area: string;
  };
  completed_at: string;
}
```

### **3.2 Genesis Mobile UI Implementation**

**Onboarding Page Layout** (iPhone 16 Pro Optimized):
```typescript
// OnboardingPage.tsx - Mobile-first design
const OnboardingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900 safe-area-inset">
      {/* Header with progress */}
      <header className="px-4 pt-safe-top pb-4">
        <ProgressBar currentStep={currentStep} totalSteps={4} />
        <h1 className="text-2xl font-bold text-white mt-4">Meet Genesis</h1>
        <p className="text-indigo-200 mt-2">Your onboarding companion</p>
      </header>

      {/* Main conversation area */}
      <main className="flex-1 px-4 pb-safe-bottom">
        <ConversationInterface 
          isListening={isListening}
          transcript={transcript}
          agentResponse={agentResponse}
        />
      </main>

      {/* Bottom controls */}
      <footer className="px-4 pb-safe-bottom">
        <VoiceControls 
          onStartTalking={startConversation}
          onStopTalking={stopConversation}
          isActive={isListening}
        />
      </footer>
    </div>
  );
};
```

---

## 4. Authentication System

### **4.1 Magic Link + Phone 2FA**

**Auth Flow**:
1. User enters email + phone on mobile-optimized form
2. Magic link sent to email + SMS code to phone
3. User clicks magic link → redirected to verify SMS (mobile-friendly)
4. SMS verified → account created/signed in
5. Redirect to onboarding (new users) or dashboard (existing users)

**Mobile Auth UI**:
```typescript
// AuthPage.tsx - iPhone optimized
const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 px-4 py-safe">
      <div className="max-w-sm mx-auto pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Welcome to Arami</h1>
          <p className="text-slate-300 mt-2">Your emotional AI companion</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder="Email"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-lg"
          />
          <input 
            type="tel" 
            placeholder="Phone"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 text-lg"
          />
          <button 
            type="submit"
            className="w-full p-4 bg-indigo-600 rounded-xl text-white font-semibold text-lg active:bg-indigo-700 transition-colors"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};
```

---

## 5. Post-Onboarding User Experience (Mobile-First)

### **5.1 Dashboard Layout for iPhone 16 Pro**

```typescript
// Dashboard.tsx - Mobile-optimized
const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 pb-safe-bottom">
      {/* Header */}
      <header className="px-4 pt-safe-top pb-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Good morning, {user.name}</h1>
            <p className="text-indigo-200 text-sm">Ready for today's ritual?</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">{streak}</span>
          </div>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Daily ritual card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Session</h2>
          <button 
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-semibold text-lg active:bg-indigo-700"
            onClick={startSession}
          >
            Start Your Ritual
          </button>
        </div>

        {/* Progress section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">Streak</h3>
            <p className="text-2xl font-bold text-indigo-600">{streak} days</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <h3 className="font-semibold text-gray-900">Virtues</h3>
            <p className="text-2xl font-bold text-purple-600">{virtues.length}</p>
          </div>
        </div>

        {/* Recent insights */}
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Insights</h3>
          <div className="space-y-2">
            {recentInsights.map((insight, i) => (
              <p key={i} className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                {insight}
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="px-4 py-2 bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <TabButton icon="home" label="Home" active />
          <TabButton icon="calendar" label="History" />
          <TabButton icon="target" label="Goals" />
          <TabButton icon="settings" label="Settings" />
        </div>
      </nav>
    </div>
  );
};
```

---

## 6. Daily Ritual System Implementation

### **6.1 Session Output Processing**

**Session Results Interface**:
```typescript
interface SessionOutput {
  virtue_earned: {
    name: string; // "Clarity", "Courage", "Compassion"
    description: string;
    icon: string;
  };
  emotional_snapshot: Array<{
    emotion: string; // "Reflective", "Hopeful", "Determined"
    intensity: number; // 1-5
    color: string; // UI color for pill
  }>;
  key_insights: string[]; // 3 bullet points
  suggested_goals: Array<{
    category: 'emotional_wellness' | 'personal_growth';
    description: string;
    smart_goal: string; // SMART format conversion
    timeframe: string; // "21 days", "1 week"
  }>;
}
```

---

## 7. Technical Implementation Priority

### **Phase 1: Landing Page & Foundation (2 weeks)**
1. 🔄 Landing page with Arami design system
2. 🔄 Mobile-first responsive design
3. 🔄 PWA configuration
4. 🔄 Basic routing structure
5. 🔄 Design system components

### **Phase 2: Authentication & Onboarding (2 weeks)**
1. 🔄 Supabase database setup + edge functions
2. 🔄 Authentication system (magic link + SMS)
3. 🔄 Genesis onboarding system implementation
4. 🔄 Mobile-optimized onboarding flow

### **Phase 3: Core Features (2 weeks)**
1. 🔄 Dashboard implementation
2. 🔄 Basic voice session (ElevenLabs only)
3. 🔄 Session analysis and insights
4. 🔄 Results UI with virtue system

### **Phase 4: Advanced Features (1 week)**
1. 🔄 Tavus video sessions
2. 🔄 Enneagram test agent
3. 🔄 Multi-language support
4. 🔄 Advanced analytics

---

## 8. Mobile-First Design System

### **8.1 Tailwind Configuration for iPhone 16 Pro**

```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      maxWidth: {
        'mobile': '393px', // iPhone 16 Pro width
      }
    },
  },
  plugins: [],
}
```

This PRD provides a comprehensive implementation roadmap for Arami optimized for iPhone 16/16 Pro with native mobile app experience using Vite + Tailwind CSS! 🚀