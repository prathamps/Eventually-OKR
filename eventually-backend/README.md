# Eventually Backend API

NestJS-based backend API for the Eventually OKR application.

## Overview

This is a RESTful API built with NestJS that handles all backend operations for the OKR management system. It uses Prisma as the ORM and PostgreSQL as the database.

##  Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Containerization**: Podman
- **Package Manager**: pnpm

##  Setup Instructions

### 1. Navigate to Backend Directory

```bash
cd eventually-backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start the Database

> Start Podman (ensure Docker Engine is not running):

```bash
podman machine start
```

Start the PostgreSQL database in a container:

```bash
podman compose up -d
```

> **Note**: The `-d` flag runs the container in detached mode. PostgreSQL will be exposed on port `5433` (mapped from container port `5432`).

### 4. Configure Environment Variables

Copy the environment template to create your `.env` file:

```bash
cp .env.example .env
```

> Verify the `.env` file was created and contains the necessary database connection details.

### 5. Setup Database Schema

Run Prisma migrations to set up the database schema:

```bash
pnpx prisma migrate deploy
```

### 6. Generate Prisma Client

Generate the Prisma client for database queries:

```bash
pnpx prisma generate
```

### 7. Start the Development Server

Run the NestJS development server:

```bash
pnpm start:dev
```

The server will start on **`http://localhost:3001`**


### Good to go for Frontend Setup

Navigate to the frontend directory for frontend configuration details.

[ Frontend Documentation](../eventually-okr/README.md)

### Good to go for testing environment as well

Navigate to the testing directory for testing environment configuration details.

[ Testing Documentation](./Testing.md)