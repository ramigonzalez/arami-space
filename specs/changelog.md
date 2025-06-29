# Arami Changelog

All notable changes to the Arami project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-25

### Added
- **Mobile-First Design System**: Comprehensive design system documentation with iPhone 14 Pro optimization
- **Fixed-Box Layout Architecture**: Implementation of containers with internal scrolling to prevent layout shifts
- **Enhanced Conversation Interface**: Improved message bubble layout and alignment for better user experience
- **Responsive Message Layout**: User and AI messages now have proper alignment and spacing
- **Safe Area Support**: Added support for iPhone notch, dynamic island, and home indicator considerations

### Changed
- **ConversationInterface Component**: 
  - Switched from fixed height (h-96) to flexible height (flex-1) for better container utilization
  - Improved message bubble alignment with proper flex layouts
  - Enhanced user message alignment (right-aligned) vs AI messages (left-aligned)
  - Added proper text wrapping with `break-words` for long messages
  - Reduced maximum message width from 80% to 75% for better readability
- **Design System Documentation**: Updated with mobile-first principles and fixed-box layout guidelines
- **Project Plan**: Updated to reflect completed design system work and current UI/UX improvements

### Improved
- **Mobile User Experience**: Better touch targets and spacing for mobile devices
- **Visual Hierarchy**: Clearer distinction between user and AI messages
- **Scrolling Behavior**: Smoother internal scrolling within fixed containers
- **Typography**: Enhanced readability with proper line heights and text wrapping

### Technical
- **Layout Architecture**: Implemented fixed-box principle across conversation interface
- **CSS Optimization**: Better use of Flexbox for responsive message layouts
- **Component Structure**: Improved component organization and prop handling

## [0.1.0] - 2025-01-20

### Added
- **Project Foundation**: Initial Vite + React + TypeScript setup
- **Authentication System**: Supabase integration with email/password authentication
- **Database Schema**: Comprehensive schema for user profiles, onboarding, and wellness tracking
- **Landing Page**: Complete landing page with hero, features, testimonials, and CTA sections
- **Core UI Components**: Button, Card, Input, Modal, Badge components with Arami styling
- **Onboarding Flow**: Multi-step onboarding with ElevenLabs voice integration
- **Voice Interaction**: AI-driven personality discovery through voice conversations
- **Protected Routes**: Authentication-based route protection
- **Dashboard Structure**: Basic dashboard layout and navigation

### Technical
- **Supabase Setup**: Database, authentication, and edge functions configuration
- **ElevenLabs Integration**: Voice conversation API integration
- **Row Level Security**: Comprehensive RLS policies for data protection
- **TypeScript Configuration**: Strict typing and best practices implementation
- **Tailwind CSS**: Custom design system with Arami branding
- **Mobile Optimization**: Responsive design with mobile-first approach

### Database
- **User Management**: Profiles, onboarding data, and preferences tables
- **Wellness Tracking**: Goals, sessions, virtues, and streaks tables
- **Communication**: Contacts, calls, and messaging infrastructure
- **AI Integration**: Conversation history and mentor avatar management

---

## Version Numbering

- **Major (X.0.0)**: Breaking changes, major feature releases
- **Minor (0.X.0)**: New features, significant improvements
- **Patch (0.0.X)**: Bug fixes, minor improvements

## Categories

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements
- **Technical**: Technical improvements, refactoring
- **Database**: Database schema changes
- **Improved**: Performance or UX improvements