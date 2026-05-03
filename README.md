# 🧮 হিসাব (Hisab) — Personal Money Manager

> **হিসাব** is a premium, minimal personal finance application designed for Bangladeshi users to track their debts (**দেনা**) and receivables (**পাওনা**) with ease and security.

![Hisab Dashboard Preview](https://via.placeholder.com/1200x600?text=Hisab+Personal+Finance+Dashboard)

## ✨ Features

- 🔐 **Secure Google Login**: Seamless authentication using Google OAuth (powered by Auth.js).
- 📊 **Insightful Dashboard**: Real-time summary of your total **দেনা** (Owed), **পাওনা** (Receivable), and Net Balance.
- 👥 **Contact Management**: Keep a organized list of friends, family, or business associates.
- 💸 **Transaction Tracking**: Log every transaction with descriptions, dates, and amounts.
- 📈 **Running Balance**: View full transaction history for each contact with an automated running balance.
- 📱 **Mobile Responsive**: Optimzed for both desktop and mobile use with a sleek bottom navigation bar.
- 🇧🇩 **Native Support**: Full Bengali UI and date formatting for a localized experience.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://sqlite.org/) with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Auth.js (NextAuth.js v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Components**: [Base UI](https://base-ui.com/) (Nova style)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed.
- A Google Cloud Console project for OAuth credentials.

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/hisab.git
cd hisab

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following:

```env
# Auth.js
AUTH_SECRET="your_auth_secret" # Generate with `openssl rand -base64 32`
AUTH_GOOGLE_ID="your_google_client_id"
AUTH_GOOGLE_SECRET="your_google_client_secret"

# Database
DATABASE_URL="file:./prisma/dev.db"
```

### 4. Database Initialization
```bash
# Run migrations to create the SQLite database
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### 5. Start the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

- `/src/app`: Next.js routes and API endpoints.
- `/src/components`: Reusable UI components (Shadcn + Custom).
- `/src/hooks`: Custom React hooks for data fetching and state logic.
- `/src/lib`: Utility functions, constants, and shared configurations.
- `/prisma`: Database schema and migration files.

## 📝 License
This project is licensed under the MIT License.

---
Built with ❤️ for better money management.
