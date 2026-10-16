# Albania Protest Tracker

A transparent, open-source platform for collecting and displaying citizen voices about the protests in Albania.

## Features

- Anonymous signup (nickname only, no email/password)
- Multi-step form collecting demographics and protest goals
- Real-time dashboard with aggregated data
- Top 10 goals visualization
- Comments section for community discussion
- Bilingual (Albanian/English)
- Open source and fully transparent

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, TailwindCSS
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (free tier)
- **Data collection:** Anonymous nickname-based

## Setup (Local Development)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to **SQL Editor** > **New Query**
3. Copy the contents of `supabase-schema.sql` and run it
4. This creates the tables: `users`, `user_profiles`, `protest_answers`, `comments`

### 2. Configure Environment Variables

Edit `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
```

Find these values in Supabase Dashboard > Settings > API

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

### Option 1: GitHub + Vercel (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up
3. Click **New Project** > Import your GitHub repo
4. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
5. Click **Deploy**

### Option 2: Direct Vercel Deploy

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select your repo
3. Add environment variables from Supabase
4. Deploy

## Privacy

- No names, emails, or personal identifiers collected
- All data is aggregated and anonymous
- Dashboard shows aggregated statistics only

## License

MIT
