# Setup Guide for Agora AI

This guide will help you get Agora AI up and running on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18.x or later) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) - Install with: `npm install -g pnpm`
  - Alternatively, you can use npm or yarn
- **PostgreSQL** database (for production) or use a cloud provider:
  - [Supabase](https://supabase.com/) (recommended for beginners)
  - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
  - [Railway](https://railway.app/)
  - Or run PostgreSQL locally

## Step 1: Install Dependencies

From the project root directory, run:

```bash
pnpm install
```

Or if using npm:

```bash
npm install
```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenAI API Key
OPENAI_API_KEY=sk-...

# Database URL (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:port/database
```

### 2.1 Get Clerk Authentication Keys

1. Go to [https://clerk.com/](https://clerk.com/) and sign up for a free account
2. Create a new application
3. In the dashboard, go to "API Keys"
4. Copy the **Publishable Key** and **Secret Key**
5. Paste them into your `.env.local` file

### 2.2 Get an OpenAI API Key

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in your account settings
4. Create a new API key
5. Copy the key and paste it into your `.env.local` file

### 2.3 Set Up PostgreSQL Database

**Option A: Using Supabase (Recommended for beginners)**

1. Go to [https://supabase.com/](https://supabase.com/) and sign up
2. Create a new project
3. Go to "Project Settings" → "Database"
4. Copy the "Connection string" (with `[YOUR-PASSWORD]` replaced)
5. Paste it as the `DATABASE_URL` in your `.env.local` file

**Option B: Using Vercel Postgres**

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the connection string
4. Add it to your `.env.local` file

**Option C: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create a new database: `createdb agora_ai`
3. Set `DATABASE_URL=postgresql://localhost:5432/agora_ai`

**Note:** Keep your keys secure and never commit `.env.local` to version control.

## Step 3: Set Up the Database Schema

Run Prisma migrations to create the database tables:

```bash
npx prisma db push
```

This will create the `Persona`, `Agora`, and `AgoraPersona` tables in your database.

**Optional:** View your database with Prisma Studio:

```bash
npx prisma studio
```

## Step 4: Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Use the Application

1. **Sign Up**: Open [http://localhost:3000](http://localhost:3000) and you'll be redirected to the Clerk sign-up page
2. **Create Personas**: Navigate to the "Personas" page and create AI personas with unique characteristics
   - Example: "Tech Enthusiast - Early adopter, loves innovation, excited about AI"
   - Create at least 5-10 personas for meaningful simulations
3. **Create an Agora**: Go to "Agoras" and group your personas into a target audience
   - Example: "Early Adopters" with tech-savvy personas
   - Example: "Enterprise Buyers" with cautious, ROI-focused personas
4. **Run a Simulation**:
   - Go to the main "Simulate" page
   - Enter a post idea
   - Select your Agora
   - Choose how many reactions to simulate (1-50)
   - Click "Run Simulation"
   - Wait for results (1-2 minutes depending on reaction count)
5. **Analyze Results**: Review the NPS scores, sentiment distribution, and sample replies for each variant

## Architecture Overview

The application consists of:

- **Frontend**:
  - `app/(app)/page.tsx`: Main simulation interface
  - `app/(app)/personas/page.tsx`: Persona management
  - `app/(app)/agoras/page.tsx`: Agora (audience) management
  - `app/(auth)/`: Sign-in and sign-up pages
- **API Routes**:
  - `app/api/simulate/route.ts`: Handles simulation requests
  - `app/api/personas/`: CRUD operations for personas
  - `app/api/agoras/`: CRUD operations for agoras
- **Core Logic**:
  - `core/simulation.ts`: Orchestrates variant generation and persona simulations
  - `core/types.ts`: TypeScript type definitions
- **Infrastructure**:
  - `lib/ai.ts`: OpenAI client configuration
  - `lib/db.ts`: Prisma database client
  - `middleware.ts`: Clerk authentication middleware
  - `prisma/schema.prisma`: Database schema

## Cost Considerations

Each simulation makes API calls proportional to the number of reactions:
- 1 call to generate 10 variants
- N × 10 calls for persona reactions (N reactions × 10 variants)
- 10 calls to generate highlights

**Examples:**
- 10 reactions: ~110 API calls ≈ $0.02-0.05
- 25 reactions: ~260 API calls ≈ $0.05-0.15
- 50 reactions: ~510 API calls ≈ $0.10-0.30

With GPT-4o-mini, costs are minimal. Monitor your API usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Set up your production database (Supabase or Vercel Postgres)
3. Import the repository in [Vercel](https://vercel.com)
4. Add all environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
5. In build settings, add the build command: `prisma generate && next build`
6. Deploy
7. After deployment, configure Clerk:
   - Go to your Clerk dashboard
   - Add your Vercel production URL to allowed origins
   - Update redirect URLs

### Other Platforms

The app can be deployed to any Node.js hosting provider:
- Railway
- Render
- AWS EC2
- DigitalOcean

Make sure to:
1. Set up a production PostgreSQL database
2. Set all environment variables
3. Run `npx prisma db push` or `npx prisma migrate deploy` on first deploy
4. Run `pnpm build` to create a production build
5. Run `pnpm start` to start the production server

## Troubleshooting

### Authentication Issues

**"Clerk is not configured"**
- Verify you've added both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to `.env.local`
- Restart the development server

**Redirect loop on sign-in**
- Check that your Clerk dashboard has the correct URLs configured
- For local development: `http://localhost:3000`

### Database Issues

**"Can't reach database server"**
- Verify your `DATABASE_URL` is correct
- Check that your database is running and accessible
- For cloud databases, check firewall/IP allowlist settings

**Prisma Client errors**
- Run `npx prisma generate` to regenerate the Prisma client
- Run `npx prisma db push` to sync the schema

### API Issues

**"OPENAI_API_KEY environment variable is not set"**
- Ensure `.env.local` contains `OPENAI_API_KEY=sk-...`
- Restart the development server

**Simulation takes too long or times out**
- Reduce the number of reactions (try 10-15 instead of 50)
- Check your internet connection
- Verify your OpenAI API key has sufficient credits
- Check OpenAI's status page: [https://status.openai.com/](https://status.openai.com/)

**"Agora not found" error**
- Make sure you've created at least one Agora with personas
- Verify you're signed in with the correct account

### Development Issues

**TypeScript errors**
```bash
pnpm tsc --noEmit
```

**ESLint errors**
```bash
pnpm lint
```

**Clear Next.js cache**
```bash
rm -rf .next
pnpm dev
```

## Support

For issues or questions, please open an issue on the GitHub repository.

