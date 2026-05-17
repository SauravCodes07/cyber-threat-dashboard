# Cross-Platform Cybersecurity Threat Intelligence Dashboard

Enterprise-grade SOC platform with real-time Firebase threat intelligence, Google authentication, correlation engine, and AI security assistant.

## Tech Stack

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, Framer Motion, Recharts, React Router, Lucide Icons
- **Backend:** Firebase Auth, Firestore (real-time listeners)
- **Deploy:** Vercel-ready SPA with `vercel.json` rewrites

## Quick Start

```bash
npm install
npm run dev
```

Create `.env` in the project root (never commit this file):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Optional — enables OpenAI responses; falls back to local engine if missing
VITE_OPENAI_API_KEY=
```

Enable **Google Sign-In** in Firebase Console → Authentication → Sign-in method.

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add the same `VITE_*` environment variables
4. Deploy — SPA routing is handled by `vercel.json`

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Google OAuth with animated cyber UI |
| `/dashboard` | Threat severity, heatmap, timeline, risk meter, alerts |
| `/threats` | Threat intelligence & correlation engine |
| `/attack-surface` | Asset exposure mapping |
| `/vulnerabilities` | CVE analysis & CVSS charts |
| `/ai-assistant` | AI security Q&A with graceful fallback |
| `/profile` | User settings & session |

## Firestore Collections

`users`, `threats`, `alerts`, `assets`, `vulnerabilities`, `activity_logs`

Data is auto-seeded on first login when collections are empty.

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```
