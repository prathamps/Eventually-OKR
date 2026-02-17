##  Overview

This is a modern web application built with React and TypeScript that provides the user interface for the OKR management system. It communicates with the NestJS backend API to manage objectives and key results.

##  Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS
- **State Management**: React Context
- **Package Manager**: pnpm

##  Setup Instructions

### Navigate to Frontend Directory

```bash
cd eventually-okr
```

### 1. Install Dependencies

```bash
pnpm i
```

### 2. Start the Development Server

```bash
pnpm run dev
```

The client will run on **`http://localhost:5173`**

##  Available Commands

- `pnpm i` - Install dependencies
- `pnpm run dev` - Start development server

##  Backend Integration

Ensure the backend API is running on `http://localhost:3001` before starting the frontend. The application will connect to the backend endpoints for data operations.

if not done yet, follow the backend setup instructions in the [Backend Documentation](../eventually-backend/README.md) to get the API up and running.

