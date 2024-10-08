
# Backend - Expense Tracker App

### Overview

The Expense Tracker App backend is built using Express.js. It provides APIs for user authentication, income management, and expense management, allowing the frontend to interact with the database securely.

## Features

- User authentication (sign up, sign in, sign out)
- Income management (add, lock income)
- Expense management (add, edit, delete expenses)
- Category management for expenses

## Technologies Used

- Backend Framework: Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Middleware: cors, cookie-parser

# Getting Started

### 1.Clone the repository

```
git clone https://github.com/Anilkokkul/Expense-Tracker-Server.git
cd Expense-Tracker-Server
```

### 2.Install dependencies:
```
npm install
```

### 3.Set up environment variables:
Create a ```.env``` file in the root directory and add your environment variables (e.g., database connection string, JWT secret).

### 4.Start the server:

```
npm run dev
```