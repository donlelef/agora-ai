# Quick Start Guide

Get Agora AI running in 3 minutes.

## Prerequisites

- Node.js v18+ installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

## Installation

```bash
# 1. Install dependencies
pnpm install
# or: npm install

# 2. Create environment file
cat > .env.local << EOF
OPENAI_API_KEY=sk-your-actual-key-here
EOF

# 3. Start the dev server
pnpm dev
# or: npm run dev
```

## Usage

1. Open http://localhost:3000
2. Enter a post idea (e.g., "Announcing our new AI feature")
3. Click "Run Simulation"
4. Wait ~1-2 minutes
5. Review results and pick the best variant!

## What Happens During Simulation?

1. **Variant Generation**: AI creates 10 different versions of your post
2. **Persona Simulation**: 50 diverse AI personas react to each variant (500 total reactions)
3. **Analysis**: System calculates NPS scores and extracts key insights
4. **Results**: You see which variant performs best and why

## Cost

Each simulation costs approximately **$0.10-0.30** using GPT-4o-mini.

## Need Help?

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting.

