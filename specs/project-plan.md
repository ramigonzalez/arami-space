# Arami Space - Project Plan

## Project Overview
Arami Space is a personal wellness and emotional intelligence platform that provides AI-powered mentorship through conversational interfaces.

## Development Phases

### Phase 1: Foundation & Authentication ✅
- [x] Project setup with React + TypeScript + Vite
- [x] Supabase integration and authentication
- [x] Basic UI components and design system
- [x] Landing page with hero, features, and CTA
- [x] Authentication flow (sign up/sign in)

### Phase 2: User Flow & Onboarding Management 🔄
- [x] User identification and routing logic
- [x] Onboarding flow for new users
- [x] Profile management system
- [ ] Onboarding completion tracking
- [ ] Conditional routing based on user status

#### User Flow Requirements:
**New Users:**
1. Landing page (marketing content)
2. Authentication (sign up/sign in)
3. Onboarding process (personality assessment, preferences)
4. Home page (start ritual/dashboard)

**Returning Users:**
1. Direct to Home page (dashboard/ritual interface)
2. Skip onboarding if already completed

**Technical Implementation:**
- Check `profile.onboarding_completed` status
- Redirect logic in main App component
- Update onboarding completion flag after successful onboarding
- Separate landing page consideration for future scaling

### Phase 3: Core Ritual Experience
- [ ] Voice recording and playback
- [ ] AI conversation interface
- [ ] Session management and tracking
- [ ] Ritual preferences and customization

### Phase 4: Progress & Analytics
- [ ] User dashboard with progress tracking
- [ ] Streak management
- [ ] Virtue collection system
- [ ] Goal setting and tracking

### Phase 5: Advanced Features
- [ ] Video calling integration (Tavus)
- [ ] Advanced AI personas
- [ ] Social features (contacts, sharing)
- [ ] Premium features and subscription

### Phase 6: Production & Scaling
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment and CI/CD
- [ ] Monitoring and analytics

## Current Focus
- Implementing user flow routing logic
- Ensuring proper onboarding completion tracking
- Setting up conditional navigation based on user state

## Technical Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Backend: Supabase (Auth, Database, Edge Functions)
- AI Integration: ElevenLabs (TTS), Tavus (Video)
- Deployment: Netlify

## Database Schema
- Users managed through Supabase Auth
- Profiles table for user data
- Onboarding profiles for assessment results
- Session tracking and progress management