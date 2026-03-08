

## HealthGuard – AI-Driven Public Health Chatbot

### Overview
A responsive web-based public health assistant that provides AI-powered health guidance, symptom checking, hospital finding, and vaccination tracking. Clean medical design with blues and greens.

---

### Pages & Features

#### 1. Landing Page
- Hero section with app description and "Start Chat" CTA
- Feature highlights (Symptom Checker, Hospital Finder, Vaccination Tracker, Health Alerts)
- Trust indicators (disclaimers about not replacing medical advice)

#### 2. AI Health Chatbot (Core Feature)
- Chat interface with streaming AI responses powered by Lovable AI
- Pre-built health-focused system prompt for safe, responsible responses
- Suggested quick-action buttons: "Check symptoms", "Find hospital", "Vaccination info"
- Markdown-rendered responses for structured health information
- Chat history stored locally

#### 3. Symptom Checker
- Step-by-step guided form: select body area → choose symptoms → severity level
- AI analyzes symptoms and provides possible conditions with urgency levels (low/medium/high)
- Always includes disclaimer and "Seek medical help" recommendations for serious symptoms

#### 4. Hospital / Clinic Finder
- Search by location (text input for city/area)
- Mock database of hospitals with name, address, phone, specialties, hours
- Card-based results with filters (specialty, distance, emergency services)
- Click to view details or get directions (opens Google Maps link)

#### 5. Vaccination Tracker
- Personal vaccination log: add vaccines with date, type, provider
- Recommended vaccination schedule by age group
- Upcoming dose reminders displayed on dashboard
- Stored in local storage (or database if backend enabled)

#### 6. Health Alerts Dashboard
- Display mock public health alerts (disease outbreaks, vaccination drives, health tips)
- Filterable by region and severity
- Alert cards with date, description, and recommended actions

#### 7. User Dashboard
- Overview of recent chat history
- Vaccination status summary
- Active health alerts in your area
- Quick access to all features

---

### Design & UX
- **Color scheme**: Medical blue (#2563EB) and green (#10B981) with white backgrounds
- **Typography**: Clean, readable fonts with good hierarchy
- **Mobile-first** responsive layout
- **Bottom navigation** on mobile, sidebar on desktop
- Health disclaimer banner persistent across the app
- Accessible design with proper contrast and ARIA labels

---

### Backend (Lovable Cloud)
- Edge function for AI chat using Lovable AI Gateway
- Health-specific system prompt ensuring safe, responsible responses
- Streaming responses for real-time chat experience

---

### What's Mocked (can be upgraded later)
- Hospital database (sample data, replaceable with real API)
- Health alerts (sample data, replaceable with government feeds)
- WhatsApp/SMS integration (UI prepared, integration ready)
- Voice input/output (can add later)
- Multi-language support (architecture ready, English first)

