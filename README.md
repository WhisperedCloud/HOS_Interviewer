# Interview & Quiz Application

A full-stack platform built with Next.js, allowing administrators to create technical quizzes and users to take them. The platform features an integrated code editor and a secure execution environment to evaluate coding problems against test cases.

## Features

- **Admin Dashboard**: Create, manage, and monitor quizzes and coding questions.
- **Interactive Quiz Player**: A user-friendly interface for candidates to take quizzes and submit answers.
- **In-Browser Code Editor**: Powered by `@monaco-editor/react`, providing a VS Code-like coding experience directly in the browser.
- **Remote Code Execution**: Securely runs code submissions (Python, JavaScript, C) against test cases using the Judge0 CE API via RapidAPI.
- **Backend & Authentication**: Powered by Supabase for fast, real-time database capabilities and authentication.

## Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Code Editor**: Monaco Editor (`@monaco-editor/react`)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Code Execution Engine**: Judge0 CE (via RapidAPI)

## Prerequisites

Before you begin, ensure you have the following installed and set up:
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- A **Supabase** project
- A **RapidAPI** account with a subscription to the [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)

## Getting Started

### 1. Install Dependencies

Navigate to the project directory and install the required packages:

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example` as a starting point) and add your keys:

```bash
cp .env.example .env
```

Populate the following variables in your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL (useful for absolute routing or callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# RapidAPI Key for Code Execution (Judge0)
RAPIDAPI_KEY=your_rapidapi_judge0_key
```

*Note: Without the `RAPIDAPI_KEY`, the remote code execution features will be disabled or return a 503 Service Unavailable error.*

### 3. Run the Development Server

Start the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `src/app/` - Contains the Next.js App Router pages and layouts.
  - `admin/` - Protected routes for administrators to manage quizzes.
  - `quiz/` - Public or user-facing routes for participating in quizzes.
  - `api/` - Next.js Route Handlers (e.g., `/api/execute` for handling code execution requests).
- `src/components/` - Reusable React components (UI elements, layout wrappers).
- `src/lib/` - Utility functions, type definitions, and backend service initializers (e.g., Supabase client, execution logic).

## Scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application for production.
- `npm run start` - Starts the production server.
- `npm run lint` - Runs ESLint to catch formatting and code quality issues.
