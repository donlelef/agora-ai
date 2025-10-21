# Agora AI

**Simulate, Analyze, and Optimize Your Social Media Posts Before You Publish.**

Agora AI is a powerful simulation tool that helps content creators, social media managers, and marketers test their post ideas against custom-built audiences. By creating unique AI personas, grouping them into "Agoras," and running targeted simulations, Agora provides actionable insights to maximize engagement and ensure your message lands perfectly with your specific audience.

This project is built with Next.js and includes a secure authentication layer powered by [Clerk](https://clerk.com/) to protect user data and manage sessions.

## Table of Contents

- [About The Project](#about-the-project)
- [Core Features](#core-features)
- [User Interface (UI) Overview](#user-interface-ui-overview)
  - [1. Persona & Agora Management](#1-persona--agora-management)
  - [2. Input & Simulation](#2-input--simulation)
  - [3. Results View](#3-results-view)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Authentication](#authentication)
- [Project Structure](#project-structure)
- [Architectural Overview](#architectural-overview)
  - [Frontend](#frontend)
  - [Backend & Simulation Logic](#backend--simulation-logic)
- [API Endpoint](#api-endpoint)
- [Roadmap](#roadmap)
- [License](#license)

## About The Project

In the fast-paced world of social media, targeting the right audience is everything. Agora AI is inspired by platforms like [societies.io](https://www.societies.io/) but gives users direct control over the simulation environment. Instead of testing against a generic crowd, you build your own.

The core problem it solves is **audience uncertainty**. Agora lets you:
1.  **Build Your Audience**: Create detailed AI **Personas** with unique backgrounds, interests, and biases.
2.  **Define an Agora**: Group your Personas into a target audience, or an **"Agora"**.
3.  **Input a Post Idea**: Write the core message you want to test.
4.  **Run a Targeted Simulation**: Select an Agora and the number of reactions you want to generate. The system samples from your chosen personas to simulate a realistic social media feed.
5.  **Analyze the Results**: The app aggregates reactions, calculates an NPS score, and picks the best-performing post variant for *that specific Agora*.

## Core Features

-   **Secure Authentication**: User sign-up, sign-in, and session management handled by Clerk.
-   **Persona Management**: Create, edit, and delete individual AI personas with specific traits, interests, and biases.
-   **Agora Builder**: Group personas into custom audiences called "Agoras" to represent different target segments.
-   **Customizable Simulations**: Before running a simulation, users select an Agora and the number of reactions to generate (up to 50).
-   **Automatic Variant Generation**: Creates 10 unique post variants from a single idea.
-   **Concurrent Processing**: All simulations run concurrently for maximum speed.
-   **Performance Ranking**: Automatically identifies and highlights the best-performing variant for the selected Agora.
-   **NPS Scoring & Sentiment Analysis**: Quantifies post reception with an NPS score and a visual breakdown of reactions.

## User Interface (UI) Overview

The application is divided into distinct sections for management, simulation, and analysis.

### 1. Persona & Agora Management

A dedicated dashboard allows users to manage their simulation building blocks:
-   **Personas Page**: Users can view a list of all their created personas. A simple form allows them to add new ones by defining attributes like a name, a short bio, and key characteristics (e.g., "Tech enthusiast, skeptical of AI, values privacy").
-   **Agoras Page**: Here, users create and manage their audiences. When creating an Agora, they give it a name (e.g., "Early Adopters," "Skeptical Enterprise Buyers") and select from their list of existing personas to include in that group.

### 2. Input & Simulation

The main simulation page features a form with three key inputs:
1.  **Post Idea**: A text area for the core message.
2.  **Select Agora**: A dropdown menu to choose which custom audience to simulate against.
3.  **Number of Reactions**: A slider or input field (1-50) to define how many personas from the Agora will be randomly sampled for the simulation.

After filling out the form, the user clicks "Simulate," and the app enters a loading state.

### 3. Results View

The results page is designed to present complex data in an intuitive format, tailored to the selected Agora.

-   **The Best Performing Post**: The winning post variant for that audience is featured prominently in a highlighted card. This section includes:
    -   A "Best Result" Badge.
    -   The full post text.
    -   A large, easy-to-read NPS Score.
    -   Curated sample replies categorized as Positive, Neutral, and Negative.

-   **Other Variants**: Below the winner, a list of all other variants provides a comparative overview. Each card shows:
    -   Truncated post text.
    -   The variant's NPS score.
    -   A visual sentiment distribution bar (green for positive, gray for neutral, red for negative).

-   **Interactivity**: The list is fully interactive. Clicking on any variant card updates the main view to display its detailed results, allowing for seamless exploration of all generated posts.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Authentication**: [Clerk](https://clerk.com/docs/nextjs/getting-started/quickstart)
-   **Database**: PostgreSQL (via Supabase, Vercel Postgres) or a NoSQL alternative (MongoDB Atlas) to store user-specific personas and agoras.
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: React Context / Zustand.
-   **AI/LLM**: An external provider like OpenAI, Anthropic, or Google Gemini is required.
-   **Deployment**: Any Node.js hosting provider (e.g., Vercel, Railway).

## Getting Started

### Prerequisites

-   Node.js (v18.x or later)
-   pnpm, npm, or yarn
-   A [Clerk](https://clerk.com/) account.
-   An API key from an AI provider (e.g., OpenAI).
-   A database connection string (e.g., from Supabase).

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
    Create a file named `.env.local` in the root of the project.
    ```env
    # .env.local

    # Clerk Keys
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
    CLERK_SECRET_KEY="sk_..."

    # AI Provider Key
    OPENAI_API_KEY="sk-..."

    # Database
    DATABASE_URL="..."
    ```

4.  **Push the database schema:**
    If using Prisma, run:
    ```sh
    npx prisma db push
    ```

5.  **Run the development server:**
    ```sh
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

Authentication is handled by Clerk, providing a robust and easy-to-use solution for managing users. A `middleware.ts` file in the root of the project protects all routes by default. Unauthenticated users are redirected to the sign-in page.

```ts
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [], // No public routes, all require sign-in
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Project Structure

The structure now includes routes for managing personas and agoras.

```
/
├── app/
│   ├── (auth)/             # Auth pages (sign-in, sign-up)
│   ├── (app)/              # Main protected application routes
│   │   ├── agoras/         # Agora management UI
│   │   ├── personas/       # Persona management UI
│   │   ├── layout.tsx      # Layout for the main app
│   │   └── page.tsx        # The main simulation page
│   ├── api/
│   │   └── simulate/
│   │       └── route.ts
│   └── layout.tsx            # Root layout with ClerkProvider
│
├── prisma/                 # Or other ORM folder
│   └── schema.prisma
└── middleware.ts           # Clerk authentication middleware
```

## Architectural Overview

### Frontend

The frontend now includes state management for personas and agoras, fetching them from the database to populate the UI. The core simulation flow remains the same, but the request payload is now more detailed.

### Backend & Simulation Logic

The simulation logic is enhanced to incorporate user-defined audiences.

1.  **Authentication & Authorization**: The Clerk middleware verifies the user's session on every API call.
2.  **API Entrypoint**: The `POST /api/simulate` route receives `idea`, `agoraId`, and `reactionCount`.
3.  **Fetch & Sample**: The backend queries the database for the Agora linked to the `agoraId` and the authenticated `userId`. It then randomly samples the specified `reactionCount` from the list of personas associated with that Agora.
4.  **Variant Generation & Fan-Out**: The system generates 10 post variants and "fans out" the work, running concurrent simulations using the *sampled* personas.
5.  **Aggregation & Analysis**: The results are aggregated, NPS scores are calculated, and highlights are generated.
6.  **Response**: The final, structured JSON object is sent back to the client.

## API Endpoint

### `POST /api/simulate`

This endpoint is **protected**.

**Request Body:**
```json
{
  "idea": "A post about our new AI-powered analytics feature.",
  "agoraId": "clx...",
  "reactionCount": 40
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
      "sentiment": { "positive": 30, "neutral": 15, "negative": 5 },
      "highlights": {
        "positive": "Users are excited about the speed and innovation.",
        "neutral": "Some are curious about the pricing.",
        "negative": "A few express concern about data privacy."
      },
      "replies": [
        /* Full list of simulated replies */
      ]
    },
    // ... 9 other variant objects
  ]
}
```

## Roadmap

-   **Share Agoras**: Allow users to share their custom-built Agoras with team members.
-   **Community Personas**: Create a public library where users can share and use personas created by the community.
-   **Save Simulation History**: Store user simulation results in the database, linked to their `userId`.
-   **API Rate Limiting**: Prevent abuse by limiting the number of simulations a user can run.
-   **Platform Expansion**: Add support for other social media platforms like LinkedIn and Instagram.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.