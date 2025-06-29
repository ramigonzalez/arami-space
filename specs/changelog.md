# Arami Space - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete 5-step onboarding process with conversational AI integration
- Genesis AI agent integration using ElevenLabs useConversation hook
- Voice-driven personality assessment and preference collection
- Multi-language and voice preference support in onboarding
- Data collection and storage for personality profiles, ritual preferences, emotional categories, and goals
- Progress indicator and step-by-step UI for onboarding flow
- Conversation interface with real-time voice interaction
- Voice controls for user speech input and AI response
- Comprehensive data summary and completion flow

### Changed
- Onboarding.tsx completely rewritten for 5-step conversational flow
- DatabaseService enhanced with createEmotionalCategory method
- Supabase types extended with UserEmotionalCategory interface
- Project plan updated to reflect completed onboarding implementation

### Technical
- ElevenLabs conversation integration with client tools for data collection
- Voice ID mapping for different languages and genders
- Real-time conversation state management with React hooks
- Comprehensive error handling for voice permissions and API calls
- Database operations for storing onboarding results across multiple tables
- Profile completion tracking and automatic navigation to dashboard

## [0.2.0] - 2025-01-29

### Added
- Complete authentication system with Supabase integration
- Landing page with hero, features, testimonials, and CTA sections
- Database service layer with comprehensive CRUD operations
- Protected route component for authenticated access
- User profile management system
- Onboarding tracking infrastructure

### Changed
- Project structure organized with proper component separation
- UI components enhanced with Tailwind CSS styling
- Database schema implemented with proper RLS policies

### Technical
- React + TypeScript + Vite setup completed
- Supabase authentication and database integration
- Tailwind CSS configuration with custom design system
- Component library with Button, Input, Card, Modal, Badge

## [0.1.0] - 2025-01-28

### Added
- Initial project setup with React + TypeScript + Vite
- Basic project structure and configuration
- Tailwind CSS integration
- Lucide React icons setup
- Initial component structure

### Technical
- Development environment configuration
- Build system setup with Vite
- TypeScript configuration for type safety
- ESLint and development tooling