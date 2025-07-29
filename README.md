# MedAi Navigator

MedAi Navigator is an AI-powered medical assistant web application built with Next.js, Genkit, and modern UI libraries. It provides users with comprehensive healthcare guidance, tracking, and support in a seamless experience. The platform leverages advanced AI to analyze symptoms, recommend treatments, track medications, manage appointments, and more—all in one place.

## Features

- **Symptom Analysis**: AI-powered analysis of your symptoms for quick health insights. Uses advanced algorithms to identify potential health conditions and provide personalized recommendations.
- **Treatment Recommendations**: Personalized, evidence-based treatment suggestions based on your medical profile, symptoms, and history.
- **Medication Tracking**: Smart medication reminders, adherence monitoring, refill alerts, and progress reports.
- **Appointment Management**: Schedule, manage, and track medical appointments. Sync with your calendar and receive reminders.
- **Find Medical Help**: Locate nearby hospitals, clinics, urgent care centers, and pharmacies using real-time location data.
- **Medical Q&A**: Get instant, AI-powered answers to your medical questions, referencing trusted sources.
- **Health Metrics**: Track vital signs and health measurements (e.g., blood pressure, heart rate, glucose, weight, sleep patterns) and visualize trends.
- **Medical Records**: Securely store and access your medical history, lab results, diagnoses, medications, allergies, immunizations, and more.
- **Emergency Contacts**: Quick access to emergency contacts and services, including one-touch calling and location sharing.
- **Health Reports**: Generate comprehensive health summaries and export them for doctor visits or personal tracking.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React, App Router)
- **AI/ML**: [Genkit](https://github.com/genkit-dev/genkit), Google AI, custom flows
- **UI**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/)
- **State & Forms**: React Hooks, [React Hook Form](https://react-hook-form.com/)
- **Maps**: [Leaflet](https://leafletjs.com/), [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Export**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js), [jsPDF](https://github.com/parallax/jsPDF)
- **Type Checking**: TypeScript, [Zod](https://zod.dev/)

## Project Structure

```
├── src/
│   ├── app/                # Main application pages and routing
│   ├── components/         # Reusable UI components (modals, trackers, analyzers, etc.)
│   ├── services/           # Service modules for data (medical records, Q&A, etc.)
│   ├── ai/                 # AI flows and Genkit integration
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions and helpers
├── public/                 # Static assets
├── docs/                   # Documentation (if any)
├── package.json            # Project metadata and dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
├── next.config.ts          # Next.js configuration
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd MedAi-navigator-2
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and fill in any required values (e.g., API keys for Genkit, Google Maps, etc.).

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:9002](http://localhost:9002) by default.

### Build for Production

```bash
npm run build
npm start
```

## Usage

- Visit the home page to explore all features.
- Use the navigation or feature cards to access:
  - Symptom analysis, treatment recommendations, medication tracking, appointment management, and more.
- Profile and settings modals are accessible from the top navigation bar.
- Most features currently use mock/demo data and AI flows. To connect real APIs, update the corresponding service files in `src/services/` and AI flows in `src/ai/flows/`.

## AI & Data Privacy

- **AI Flows**: All medical analysis, Q&A, and recommendations are powered by Genkit and Google AI models, orchestrated via custom flows in `src/ai/flows/`.
- **Data Storage**: By default, the app does **not** persist user data or require authentication. All data is handled in-memory or via mock/demo APIs. If you wish to enable persistent storage or authentication (e.g., with Firebase), you can extend the service modules and integrate authentication providers.
- **Disclaimer**: AI-generated advice is not a substitute for professional medical care. Always consult a healthcare provider for medical decisions.

## Customization & Extending

- **Add new features**: Create new pages in `src/app/` and corresponding components/services.
- **Connect real APIs**: Replace the mock implementations in `src/services/` with real API calls.
- **Enable authentication**: Integrate Firebase or another auth provider as needed.
- **UI Customization**: Modify Tailwind config, themes, and components for branding.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
