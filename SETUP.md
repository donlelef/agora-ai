# Setup Guide for Agora AI

This guide will help you get Agora AI up and running on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18.x or later) - [Download here](https://nodejs.org/)
- **pnpm** (recommended) - Install with: `npm install -g pnpm`
  - Alternatively, you can use npm or yarn

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

1. Copy the example environment file:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Getting an OpenAI API Key

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in your account settings
4. Create a new API key
5. Copy the key and paste it into your `.env.local` file

**Note:** Keep your API key secure and never commit it to version control.

## Step 3: Run the Development Server

Start the Next.js development server:

```bash
pnpm dev
```

Or with npm:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 4: Test the Application

1. Open your browser to `http://localhost:3000`
2. Enter a post idea in the text area (e.g., "Announcing our new AI-powered analytics feature")
3. Click "Run Simulation"
4. Wait 1-2 minutes for the simulation to complete (it's making ~500+ API calls)
5. Review the results and insights

## Architecture Overview

The application consists of:

- **Frontend** (`app/page.tsx`): React components for user interaction
- **API Route** (`app/api/simulate/route.ts`): Handles simulation requests
- **Core Logic** (`core/simulation.ts`): Orchestrates variant generation and persona simulations
- **AI Integration** (`lib/ai.ts`): OpenAI client configuration

## Cost Considerations

Each simulation makes approximately 500+ API calls to OpenAI:
- 1 call to generate variants
- 500 calls for persona reactions (10 variants × 50 personas)
- 10 calls to generate highlights

With GPT-4o-mini, this typically costs **$0.10-0.30 per simulation**. Monitor your API usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)

## Production Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add your `OPENAI_API_KEY` as an environment variable
4. Deploy

### Other Platforms

The app can be deployed to any Node.js hosting provider:
- Railway
- AWS EC2
- DigitalOcean
- Heroku

Make sure to:
1. Set the `OPENAI_API_KEY` environment variable
2. Run `pnpm build` to create a production build
3. Run `pnpm start` to start the production server

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"

Make sure:
1. You created a `.env.local` file in the project root
2. The file contains `OPENAI_API_KEY=sk-...`
3. You restarted the development server after creating the file

### Simulation takes too long or times out

- Check your internet connection
- Verify your OpenAI API key has sufficient credits
- Check OpenAI's status page: [https://status.openai.com/](https://status.openai.com/)

### TypeScript errors

Run the type checker:
```bash
pnpm tsc --noEmit
```

### ESLint errors

Run the linter:
```bash
pnpm lint
```

## Support

For issues or questions, please open an issue on the GitHub repository.

