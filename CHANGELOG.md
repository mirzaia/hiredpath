# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-06

### Added
- **AI-Powered Roadmap Generator**: Integrated with Google Gemini API to analyze Job Descriptions and generate customized interview preparation roadmaps.
- **Dynamic Content Generation**: Implemented a lazy-loading pattern for generating deep technical theory, scenarios (hints/answers), and interview questions on-demand using AI.
- **Onboarding System**: Multi-stack selection (Java, Python, TypeScript, Kotlin) to tailor the initial dashboard and curriculum.
- **Dashboard Overview**: Centralized view of curriculum modules with circular progress tracking and visual status indicators.
- **Question Bank**: Global repository of interview questions with filtering and real-time search capabilities.
- **Progress Tracking & Analytics**: Dedicated page for overall completion stats, per-module breakdowns, and confidence distribution charts.
- **Resource Hub**: Curated collection of external study materials categorized by type (Courses, Docs, YouTube, Tools).
- **Global Search**: Header-based search functionality for instant access to topics and questions across the platform.
- **Local Persistence**: State management using `localStorage` to persist all progress, user choices, and AI-generated roadmaps.
- **Modern UI Architecture**: Fully implemented with Tailwind CSS featuring a slate-and-orange theme, glassy surfaces, and responsive layouts.
- **Static Content Architecture**: JSON-driven base curriculum covering the 5 technical pillars of Sr. SDET interviews.

### Changed
- Refactored project from Vanilla CSS to a utility-first Tailwind CSS design system for enhanced scalability and visual consistency.
