# Personal Expense Tracker

A modern, full-stack expense tracking application built with Next.js, TypeScript, Prisma, and Tailwind CSS.

## Features

- **User Authentication**: Sign in with Google OAuth
- **Expense Management**: Add, edit, and delete expenses
- **Categorization**: Organize expenses by category
- **Filtering**: Filter expenses by date range and category
- **Data Visualization**: View spending trends with charts
- **Dark Mode Support**: Toggle between light and dark themes
- **Multiple Currency Support**: Track expenses in different currencies
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Charts**: Recharts
- **TypeScript**: For type safety

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your database and OAuth credentials.

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # UI components
│   ├── common/             # Shared UI components
│   ├── expenses/           # Expense-specific components
│   ├── forms/              # Reusable form components
│   ├── layout/             # Layout components
│   └── ui/                 # Low-level UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Library code
│   ├── api/                # API client functions
│   ├── auth/               # Auth-related utilities
│   ├── utils/              # General utilities
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
└── styles/                 # Global styles
```

## Deployment

This application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Set up a project in Vercel
3. Configure environment variables in Vercel
4. Deploy!

## License

[MIT License](LICENSE)