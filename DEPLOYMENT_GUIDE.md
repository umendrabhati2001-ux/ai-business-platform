# 🚀 Vercel Live Deployment Guide (100% Ready)

This Next.js 16 monorepo is completely configured, audited, and ready for live production deployment on **Vercel** with a free HTTPS domain (e.g. `https://ai-business-platform.vercel.app`).

---

## 🌟 Method 1: Deploy via GitHub (Recommended & Simplest)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `ai-business-platform`).
3. Keep it **Private** or **Public**, then click **Create repository**.

### Step 2: Push your code to GitHub
Run these commands in your project terminal (`C:\AI-Business-Platform\AI-Business-Platform`):

```bash
git add .
git commit -m "feat: Autonomous AI Business Platform with Payments & Workflows"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ai-business-platform.git
git push -u origin main
```

---

### Step 3: Import into Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Under **Import Git Repository**, find your `ai-business-platform` repository and click **Import**.

---

### Step 4: Configure Monorepo Settings in Vercel (CRITICAL ⚠️)
Because this is a Turborepo monorepo, configure the **Root Directory**:

1. In the **Configure Project** screen, find **Root Directory**.
2. Click **Edit** and select:
   ```text
   apps/web
   ```
3. Leave **Framework Preset** as:
   ```text
   Next.js
   ```
4. Leave **Build Command** and **Output Directory** at their default settings.

---

### Step 5: Add Environment Variables
In the **Environment Variables** section on Vercel, copy the variables from your local `apps/web/.env`:

| Key | Example / Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `OPENAI_API_KEY` | Your OpenAI API Key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | *(Optional)* Stripe Publishable Key |
| `STRIPE_SECRET_KEY` | *(Optional)* Stripe Secret Key |
| `RAZORPAY_KEY_ID` | *(Optional)* Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | *(Optional)* Razorpay Key Secret |

---

### Step 6: Click Deploy! 🎉
1. Click **Deploy**.
2. Vercel will build the project in ~60 seconds.
3. Your live production URL (e.g. `https://ai-business-platform-iota.vercel.app`) will be generated with full SSL!

---

## 💻 Method 2: Deploy via Vercel CLI (Direct Terminal)

If you prefer to deploy directly from your command line:

```bash
# Navigate to the web app directory
cd apps/web

# Run Vercel CLI
npx vercel
```

1. Log in to Vercel when prompted.
2. Select **Link to existing project?** ➔ `No`
3. Set **Project Name** ➔ `ai-business-platform`
4. Set **In which directory is your code located?** ➔ `./`
5. Vercel will upload and give you an instant Preview URL!
6. For production:
   ```bash
   npx vercel --prod
   ```
