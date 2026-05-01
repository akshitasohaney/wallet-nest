# Wallet Nest

**Track smarter. Save better. Grow faster.**

Wallet Nest is a full-stack personal finance platform designed for students to manage expenses, achieve savings goals, and make smarter financial decisions using real-time data and AI-powered insights. It combines a modern React frontend with a structured Node.js backend and secure Supabase database integration.

---

## Overview

Managing personal finances as a student can be overwhelming. Wallet Nest simplifies this by providing a centralized platform to track expenses, plan savings, and receive intelligent financial guidance.

With a clean interface, real-time updates, and AI-driven recommendations, Wallet Nest helps users build strong financial habits early and make informed decisions about their money.

---

## Key Highlights

- Full-stack application using React and Node.js/Express
- Layered backend architecture (routes → controllers → services)
- Secure authentication and real-time database using Supabase
- AI-powered financial mentor using Gemini API
- CSV export for downloadable financial reports
- Clean, responsive UI optimized for all devices

---

## Features

- **Expense Tracking**  
  Add, categorize, and monitor daily expenses with ease.

- **Savings Goals**  
  Set financial targets and track progress in real-time.

- **AI Financial Mentor**  
  Get personalized advice, spending insights, and actionable recommendations powered by Gemini AI.

- **Smart Analytics**  
  Understand spending patterns and optimize your budget effectively.

- **CSV Export**  
  Download financial reports for offline analysis or record-keeping.

- **Secure Authentication**  
  Supabase-powered authentication ensures safe and reliable data handling.

- **Responsive Design**  
  Fully optimized for both desktop and mobile experiences.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite  
- **Backend**: Node.js, Express  
- **Database & Auth**: Supabase (PostgreSQL)  
- **AI Integration**: Google Gemini API  

---

## Backend Architecture

The backend follows a clean layered architecture:

- **Routes** – Define API endpoints  
- **Controllers** – Handle request and response logic  
- **Services** – Manage database interactions (Supabase)  
- **Middleware** – Error handling and request processing  

This structure ensures scalability, maintainability, and clear separation of concerns.

---

## API Endpoints

- `POST /api/expenses` – Add a new expense  
- `GET /api/expenses` – Fetch all expenses  
- `POST /api/goals` – Create a new savings goal  
- `GET /api/goals` – Fetch all goals  
- `POST /api/finance-chat` – AI-powered financial advice  

---

## Live Demo

🔗 *Add your deployed link here*  

---

## Screenshots

*(Add screenshots of your dashboard, goals page, and AI mentor here)*

---

## Installation & Setup

1. Git Clone
```bash
git clone https://github.com/akshitasohaney/wallet-nest.git
cd wallet-nest
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
Touch .env

4. Start the development servers
   
   Start the Node.js REST API Backend:
   ```bash
   npm run server
   ```

   Start the React frontend (in a new terminal):
   ```bash
   npm run dev
   ```

5. **Access the application**
   Navigate to `http://localhost:5173` in your browser.

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL= `https://lqtcgaynzxqilrwytbmi.supabase.co`
VITE_SUPABASE_ANON_KEY= sb_publishable_26LeQ26BjdLMCXODgLWhQQ_RhkyWjMI

# Gemini AI Configuration (Backend)
GEMINI_API_KEY=AIzaSyAfHDVY1eWCZjwE3nqdjPghcER9rnHA9BQ
```

## Folder Structure

```text
wallet-nest/
├── public/                 # Static assets
├── server/                 # Node.js REST API Backend
│   ├── config/             # Supabase client configuration
│   ├── controllers/        # Request handling logic (expenses, goals, settings, chat)
│   ├── middleware/         # Express middleware (error handling)
│   ├── routes/             # API routing endpoints
│   ├── services/           # Supabase database abstraction layer
│   └── server.js           # Main Express server entry point
├── src/
│   ├── components/         # Reusable React UI components
│   ├── context/            # React Context for global state (Auth, Finance via API fetch)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Third-party service initializations (Supabase Auth)
│   ├── pages/              # Primary application views
│   ├── App.jsx             # Root application component
│   └── index.css           # Global Tailwind stylesheet
├── test_metrics.mjs        # Backend test file for metrics
├── test_openapi.mjs        # Backend test file for openapi
├── test_openapi2.mjs       # Backend test file for openapi v2
├── test_schema.mjs         # Backend test file for database schema
├── test_settings.mjs       # Backend test file for user settings
├── supabase-schema.sql     # SQL script for database schema definitions
├── migrator.cjs            # Database/schema migration script
├── .env.example            # Environment variable template
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Exact dependency versions lockfile
└── vite.config.js          # Vite build configuration
```

## Future Improvements
- Implementation of Plaid API for automated bank transaction syncing.
- Enhanced data visualization with comprehensive interactive reporting.
- Progressive Web App (PWA) support for offline accessibility.

## Built By:
**[Akshita Sohaney]**  
[GitHub Profile](#) | [LinkedIn Profile](#)
