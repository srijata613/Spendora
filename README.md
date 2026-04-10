# Spendora

## AI-Powered Personal Finance & Expense Automation Platform

Spendora is a modern **AI-assisted personal finance platform** that helps users manage accounts, track transactions, monitor budgets, and analyze spending behavior through an interactive dashboard.

Built using **Next.js App Router, Prisma ORM, and a modular component architecture**, the system automates financial tracking while providing clear insights into financial health.

The goal of Spendora is simple:
help users **understand their money, control spending, and make smarter financial decisions.**

<p align="center"> <img src="public/banner.png" width="100%" alt="Spendora Banner"/> </p> <p align="center"> Smart expense tracking • Budget monitoring • Receipt scanning • Financial insights </p>

---

# Live Demo

**Application**

[https://spendora-omega.vercel.app](https://spendora-omega.vercel.app)

**Repository**

[https://github.com/srijata613/Spendora](https://github.com/srijata613/Spendora)

---

# Key Features

## Account Management

Users can create and manage financial accounts such as:

* Bank accounts
* Wallets
* Digital payment accounts

Each account tracks balances and transaction history.

---

## Transaction Tracking

Users can add and monitor financial transactions including:

* Income
* Expenses
* Transfers

Transactions are stored and visualized in the dashboard.

---

## Budget Monitoring

Spendora allows users to define monthly budgets and track their progress using dynamic progress indicators.

Features include:

* Budget progress visualization
* Spending alerts
* Category-wise tracking

---

## Dashboard Analytics

The dashboard provides a real-time overview of financial activity.

It includes:

* Account summaries
* Transaction overviews
* Budget progress indicators
* Spending charts

---

## Receipt Scanner

The platform includes a **receipt scanning feature** that allows users to extract transaction information from uploaded receipts.

This reduces manual data entry and speeds up expense logging.

---

## Email Notifications

Spendora supports automated email notifications for financial updates and alerts.

Email templates are managed centrally for consistent messaging.

---

## Secure Authentication

The system includes a dedicated authentication module with:

* Sign-in
* Sign-up
* Protected routes
* Middleware-based access control

---

# Technology Stack

## Frontend

* **Next.js (App Router)**
* **React**
* **Tailwind CSS**
* **Component-based UI architecture**

## Backend

* **Next.js Server Actions**
* **Node.js runtime**

## Database

* **Prisma ORM**
* **SQL database**

## Background Jobs

* **Inngest** for background workflows and async jobs

## Email Service

* Custom email templates and automated notifications

## Deployment

* **Vercel**

---

# System Architecture

```
Client Interface (Next.js UI)
        │
        ▼
Application Layer (Next.js App Router)
        │
        ├── Server Actions
        ├── API Routes
        │
        ▼
Business Logic Layer
        │
        ├── Account management
        ├── Transaction processing
        ├── Budget calculations
        ├── Receipt scanning
        │
        ▼
Database Layer
        │
        └── Prisma ORM
```

---

# Project Structure

```
Spendora
│
├── actions
│   ├── account.js
│   ├── budget.js
│   ├── dashboard.js
│   ├── transaction.js
│   ├── seed.js
│   └── send-email.js
│
├── app
│   ├── (auth)
│   │   ├── sign-in
│   │   └── sign-up
│   │
│   ├── (main)
│   │   ├── account
│   │   ├── dashboard
│   │   └── transaction
│   │
│   └── api
│       ├── inngest
│       ├── seed
│       └── transactions
│
├── components
│   ├── ui
│   ├── header
│   ├── hero
│   └── create-account-drawer
│
├── data
│   ├── categories.js
│   └── landing.js
│
├── emails
│   └── templates.jsx
│
├── hooks
│   └── use-fetch.js
│
├── lib
│   ├── prisma.js
│   ├── utils.js
│   ├── security
│   └── inngest
│
├── prisma
│   ├── schema.prisma
│   └── migrations
│
├── public
│   ├── logo.png
│   └── banner.png
│
├── middleware.js
├── next.config.mjs
└── package.json
```

---

# Installation

Clone the repository

```bash
git clone https://github.com/srijata613/Spendora.git
```

Move into the project directory

```bash
cd Spendora
```

Install dependencies

```bash
npm install
```

Start development server

```bash
npm run dev
```

Open the app in your browser

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file in the root directory.

Example configuration:

```
DATABASE_URL=
NEXTAUTH_SECRET=
EMAIL_SERVER=
EMAIL_FROM=
INNGEST_EVENT_KEY=
```

These variables configure database connectivity, authentication, email services, and background jobs.

---

# Database Setup

Generate Prisma client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Seed database

```bash
npm run seed
```

---

# Use Cases

Spendora can be used for:

* Personal finance management
* Student expense tracking
* Budget monitoring
* Monthly spending analysis
* Financial habit tracking

---

# Future Improvements

Planned improvements include:

* Bank API integration
* Automated transaction import
* AI financial assistant
* Subscription tracking
* Mobile application
* Predictive financial analytics

---

# Author

**Srijata Moitra**

GitHub
[https://github.com/srijata613](https://github.com/srijata613)

---

# License

This project is licensed under the **MIT License**.

---
