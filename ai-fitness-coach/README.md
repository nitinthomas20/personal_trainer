# AI Fitness Coach PWA

A Progressive Web App that acts as your personal AI trainer and nutritionist, powered by Claude AI.

## Features

- 🏋️ **Personalized Workout Plans** - AI-generated daily workout plans tailored to your goals
- 🍽️ **Custom Meal Plans** - Daily nutrition plans with accurate macro tracking
- 📊 **Progress Tracking** - Track your weight, workouts, and nutrition over time
- 🤖 **AI-Powered Adaptation** - Plans adapt based on your daily check-ins
- 📱 **Progressive Web App** - Works offline and can be installed on your device
- 💾 **Local Storage** - All data stored securely in your browser using IndexedDB

## Tech Stack

- **React 19** + **TypeScript** - Modern UI framework with type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Anthropic Claude API** - AI-powered plan generation
- **Dexie** - IndexedDB wrapper for local data storage
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Add your Anthropic API key to `.env.local`:**
   ```
   VITE_ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:5173](http://localhost:5173)

## Usage

### First Time Setup

1. Complete the onboarding flow to create your profile
2. Enter your personal information, training goals, and nutrition targets
3. Generate your first workout and meal plans

### Daily Workflow

1. **Morning**: Check your dashboard for today's workout and meal plan
2. **Throughout the day**: Follow your plans
3. **Evening**: Complete your daily check-in to help AI adapt future plans
4. **Generate tomorrow's plans**: Click the button to have AI create your next day's schedule

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── workout/         # Workout-specific components
│   ├── nutrition/       # Nutrition-specific components
│   └── checkin/         # Check-in components
├── services/
│   ├── api/            # Claude API integration
│   ├── database/       # IndexedDB operations
│   └── ai/             # AI prompt engineering
├── types/              # TypeScript type definitions
├── pages/              # Page components
└── hooks/              # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Important Notes

### API Key Security

⚠️ **For Personal Use Only**: This app uses `dangerouslyAllowBrowser: true` to call the Anthropic API directly from the browser. This is acceptable for personal use but **NOT recommended for production apps** with multiple users.

For production:
- Implement a backend proxy to hide your API key
- Never commit `.env.local` to version control
- Use environment-specific API keys

### Data Privacy

✅ All your personal data (profile, workouts, meals, check-ins) is stored locally in your browser's IndexedDB. Nothing is sent to any server except:
- Requests to the Anthropic API to generate plans (which include your profile data)

## Features Roadmap

- [ ] Progress charts and analytics
- [ ] Set tracking during workouts
- [ ] Recipe details for meals
- [ ] PWA installation and offline support
- [ ] Export data functionality
- [ ] Custom exercise library

## Contributing

This is a personal project but suggestions and feedback are welcome!

## License

MIT License - feel free to use this for your own fitness journey!

## Support

If you encounter issues:
1. Check that your API key is correctly set in `.env.local`
2. Ensure you're using Node.js 18 or higher
3. Clear browser cache and IndexedDB if you encounter data issues

---

Built with ❤️ using React, TypeScript, and Claude AI
