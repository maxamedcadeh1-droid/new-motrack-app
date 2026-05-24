# MoTrack

Track Your Momentum.

MoTrack is a student productivity app with projects, tasks, daily activities, weekly goals, notes, Pomodoro focus sessions, and analytics.

## Tech Stack

- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Recharts
- Supabase Auth and PostgreSQL

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Auth

Authentication is connected to real Supabase Auth.

Signup uses:

```ts
supabase.auth.signUp()
```

Login uses:

```ts
supabase.auth.signInWithPassword()
```

Logout uses:

```ts
supabase.auth.signOut()
```

The app reads these Vite environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Local development uses `.env.local`. The file is ignored by git.

## Database Setup

1. Open Supabase Dashboard.
2. Go to SQL Editor.
3. Run `supabase/schema.sql`.
4. Restart the dev server.

After signup, the new account should appear in Supabase Dashboard -> Authentication -> Users.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the GitHub repository in Vercel.
3. Use the Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add these Vercel environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` is optional. The app defaults to `gemini-2.5-flash` if it is not set.
