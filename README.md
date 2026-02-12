# AI Fitness Coach

A personalized AI-powered fitness coaching app that generates workout and meal plans using Claude AI, with progressive overload tracking and daily check-ins.

## Features

- **AI-Generated Workout Plans** — Claude creates tailored workout plans based on your profile, training split (PPL / Upper-Lower / Full Body), and experience level
- **AI-Generated Meal Plans** — Daily nutrition plans hitting your calorie and macro targets, respecting dietary preferences and allergies
- **Progressive Overload Tracking** — Log actual weights and reps during check-in; the AI uses your real performance to adjust next session's weights
- **Daily Check-ins** — Track workout completion, nutrition, sleep quality, energy, soreness, and body weight
- **Grocery List** — Auto-generated ingredient list from tomorrow's meal plan
- **User Authentication** — JWT-based login with MongoDB-backed user accounts

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router
- Recharts (charts)
- Lucide React (icons)

### Backend
- Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- bcrypt password hashing

### AI
- Anthropic Claude API (claude-sonnet-4-20250514)

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Anthropic API key

### 1. Clone the repo
```bash
git clone https://github.com/nitinthomas20/personal_trainer.git
cd personal_trainer/ai-fitness-coach
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fitness-coach
JWT_SECRET=your-secret-key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd ai-fitness-coach
npm install
```

Create `ai-fitness-coach/.env`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Start the dev server:
```bash
npm run dev
```

### 4. Open the app
Visit `http://localhost:5173` — sign in, complete onboarding, and generate your first plans.

## Project Structure

```
ai-fitness-coach/
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Auth context provider
│   ├── pages/            # Dashboard, Onboarding, CheckIn, Login
│   ├── services/
│   │   ├── ai/           # Plan generation logic & prompts
│   │   ├── api/          # Claude API client & backend API client
│   │   └── database/     # Database operations (API-backed)
│   └── types/            # TypeScript interfaces
├── server/
│   ├── src/
│   │   ├── config/       # MongoDB connection
│   │   ├── middleware/    # JWT auth middleware
│   │   ├── models/       # Mongoose schemas
│   │   └── routes/       # Express route handlers
│   └── package.json
└── package.json
```

## How It Works

1. **Onboarding** — Enter your stats, goals, equipment, and dietary preferences
2. **Generate Plans** — AI creates workout + meal plans for today or tomorrow
3. **Work Out** — Follow the planned exercises with suggested weights
4. **Check In** — Log actual weights used, reps completed, sleep, energy, soreness
5. **Progressive Overload** — Next plan uses your actual performance as baseline — if you hit all reps, weight goes up; if you fell short, it holds steady

## License

MIT
