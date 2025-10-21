# Agora AI

**Simulate, Analyze, and Optimize Your Social Media Posts Before You Publish.**

Agora AI is a powerful simulation tool that helps content creators, social media managers, and marketers test their post ideas against a diverse set of AI-powered personas. By generating multiple variants and running them through hundreds of simulated social media feeds, Agora provides actionable insights to maximize engagement and ensure your message lands perfectly.

This project is built with Next.js and leverages modern async primitives to handle high-concurrency workloads efficiently on a Node.js server.

## Table of Contents

- [About The Project](#about-the-project)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Architectural Overview](#architectural-overview)
  - [Frontend](#frontend)
  - [Backend & Simulation Logic](#backend--simulation-logic)
- [API Endpoint](#api-endpoint)
- [Roadmap](#roadmap)
- [License](#license)

## About The Project

In the fast-paced world of social media, the difference between a viral post and a forgotten one can be subtle. Agora AI is inspired by platforms like [societies.io](https://www.societies.io/) but is hyper-focused on the X (formerly Twitter) ecosystem.

The core problem it solves is **uncertainty**. Instead of publishing a post and hoping for the best, users can:
1.  **Input a core idea**: "Announcing our new feature that helps users save time."
2.  **Agora generates variants**: It creates 10 distinct versions of the post with different tones, hooks, and calls-to-action.
3.  **Simulate with concurrency**: Each of the 10 variants is shown to 50 unique AI personas, resulting in 500 concurrent simulations managed by the Node.js server.
4.  **Analyze the results**: The application aggregates the reactions, calculates a Net Promoter Score (NPS) for each variant, and uses AI to extract the most insightful reply highlights.
5.  **Choose the winner**: The user can confidently select the post variant that is statistically most likely to receive positive engagement.

## Core Features

-   **Post Idea Input**: A simple interface to enter the initial concept for a social media post.
-   **Automatic Variant Generation**: Creates 10 unique post variants based on the user's input.
-   **Diverse Persona Simulation**: Tests each variant against 50 different AI-driven personas to gather a wide range of feedback.
-   **Concurrent Processing**: All 500 simulations (10 variants x 50 personas) are run concurrently for maximum speed.
-   **Performance Ranking**: The app automatically identifies the variant with the most positive reactions.
-   **NPS Scoring**: Each variant is given a Net Promoter Score (-100 to 100) to quantify its reception.
-   **Reply Highlights**: AI-powered summarization provides the most representative positive, neutral, and negative replies for each variant.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: React Context / Zustand (for client-side state)
-   **AI/LLM**: An external provider like OpenAI, Anthropic, or Google Gemini is required.
-   **Deployment**: Any Node.js hosting provider (e.g., Vercel, Railway, AWS EC2, DigitalOcean).

## Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

-   Node.js (v18.x or later)
-   pnpm, npm, or yarn
-   An API key from an AI provider (e.g., OpenAI).

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/agora-ai.git
    cd agora-ai
    ```

2.  **Install dependencies:**
    ```sh
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add your AI provider's API key.
    ```env
    # .env.local
    OPENAI_API_KEY="sk-..."
    ```

4.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

The project uses the Next.js App Router for a modern, component-centric structure.

```
/
├── app/
│   ├── api/
│   │   └── simulate/
│   │       └── route.ts      # Backend logic for handling simulations
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
│
├── components/
│   ├── ui/                   # Reusable UI elements (Buttons, Cards, etc.)
│   ├── post-input-form.tsx   # Form for user input
│   └── simulation-results.tsx# Component to display results
│
├── lib/
│   └── ai.ts                 # AI provider SDK configuration and helpers
│
├── core/
│   └── simulation.ts         # Core business logic for running simulations
│
└── public/                   # Static assets
```

## Architectural Overview

### Frontend

The frontend is built as a single-page application experience.
-   A user submits a post idea through the `PostInputForm` component.
-   On submission, a `POST` request is sent to the `/api/simulate` endpoint.
-   The UI enters a loading state while the simulations are running.
-   Once the API returns the results, the `SimulationResults` component displays the data, highlighting the winning variant and showing the detailed breakdown for all 10.

### Backend & Simulation Logic

The simulation process is designed to be highly concurrent, running directly on the application's Node.js server. It leverages modern asynchronous JavaScript primitives to handle hundreds of simulations simultaneously without blocking the main thread.

1.  **API Entrypoint**: The `app/api/simulate/route.ts` file receives the initial post idea.
2.  **Variant Generation**: The API first calls the configured LLM to generate 10 diverse post variants.
3.  **Fan-Out with Concurrency**: The core of the architecture. The application leverages `async`/`await` and `Promise.all()` to achieve high concurrency. Upon receiving a request, it "fans out" the work by making 500 independent, asynchronous calls to the LLM. Each call includes one post variant and one persona profile. These requests run concurrently within the Node.js event loop, maximizing throughput.
4.  **Aggregation**: Once all 500 simulation promises resolve, the backend aggregates the results.
5.  **Analysis**:
    -   It calculates the NPS for each of the 10 variants based on the sentiment of the 50 replies.
    -   It uses another LLM call to summarize the replies and extract key highlights.
6.  **Response**: The final, structured JSON object containing all variants, scores, and highlights is sent back to the client.

This highly concurrent approach ensures that the total simulation time is dictated by the slowest few API responses from the LLM, rather than the sum of all 500 requests executed sequentially.

## API Endpoint

### `POST /api/simulate`

This endpoint triggers the entire simulation process.

**Request Body:**
```json
{
  "idea": "A post about our new AI-powered analytics feature."
}
```

**Response Body (Success):**
```json
{
  "bestVariantIndex": 2,
  "variants": [
    {
      "text": "Variant 1: Discover insights faster than ever with our new AI analytics! 🚀 #AI #Data",
      "nps": 52,
      "highlights": {
        "positive": "Users are excited about the speed and innovation.",
        "neutral": "Some are curious about the pricing.",
        "negative": "A few express concern about data privacy."
      },
      "replies": [
        /* Full list of 50 simulated replies */
      ]
    },
    // ... 9 other variant objects
  ]
}
```

## Roadmap

This is the initial version of Agora AI. Future enhancements include:

-   **User Authentication**: Allow users to save their simulation history.
-   **Persona Customization**: Enable users to define or upload their own target audience personas.
-   **Platform Expansion**: Add support for other social media platforms like LinkedIn, Instagram, and Facebook, with platform-specific context.
-   **Advanced Analytics**: Track the performance of variants over time and provide deeper insights.
-   **Team Collaboration**: Allow multiple users within an organization to share and review simulations.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.