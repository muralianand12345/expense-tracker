# Personal Expense Tracker

A full-stack Next.js application for tracking personal expenses with a clean, responsive UI and data visualization.

## Features

- **Add, View, Edit, and Delete Expenses**: Complete CRUD operations
- **Categorize Expenses**: Organize expenses by categories
- **Filter Expenses**: Filter by date range and category
- **Monthly Summary**: View total expenses, breakdown by category with charts
- **Export Data**: Export expense data to CSV
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on all device sizes

## Tech Stack

- **Frontend**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: Zustand
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (version 16.x or later)
- PostgreSQL database (You can use NeonDB for cloud hosting)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL="postgresql://username:password@your-neondb-host:5432/expense-tracker?schema=public"
```

Replace the placeholder values with your actual database credentials.

4. Initialize the database:

```bash
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Deployment

### Database Setup

1. Create a PostgreSQL database on NeonDB (or any other provider)
2. Update your `.env` file with the production database URL

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Create a new project on Vercel
3. Connect your GitHub repository to Vercel
4. Add your environment variables in the Vercel dashboard
5. Deploy!

## Project Structure

```
expense-tracker/
├── app/                   # Next.js app router
│   ├── api/               # API endpoints
│   │   └── expenses/      # Expense-related endpoints
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # UI components
├── lib/                   # Utility functions
├── prisma/                # Prisma schema and client
├── store/                 # Zustand store
└── types/                 # TypeScript types
```

## Future Enhancements

- User authentication
- Income tracking
- Budget planning
- Mobile app version
- Multiple currencies support
- Receipt image uploads

## License

This project is licensed under the MIT License - see the LICENSE file for details.