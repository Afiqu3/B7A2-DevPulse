# DevPulse

DevPulse is a lightweight issue-tracking backend for reporting and managing bugs and feature requests.

## Live URL

https://devpulse-lovat.vercel.app

## Features

- User registration and login with secure password hashing
- JWT-based authentication for protected routes
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- PostgreSQL-backed persistence
- Clean API responses and centralized error handling

## Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT + bcryptjs
- **Build/Runtime:** tsup, tsx
- **Deployment:** Vercel

## Setup Steps

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd B7A2
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and add:

```env
PORT=5000
CONNECTION_STRING=postgres://username:password@host:5432/database_name
JWT_SECRET=your_super_secret_key
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Start the production server

```bash
npm start
```

## API Endpoint List

### Authentication

- `POST /api/auth/signup` — Create a new user account
- `POST /api/auth/login` — Log in and receive a JWT token

### Issues

- `POST /api/issues` — Create a new issue (requires authentication)
- `GET /api/issues` — Fetch all issues, with optional filters:
  - `type=bug`
  - `type=feature_request`
  - `status=open`
  - `status=in_progress`
  - `status=resolved`
  - `sort=newest`
  - `sort=oldest`
- `GET /api/issues/:id` — Fetch a single issue by ID
- `PATCH /api/issues/:id` — Update an issue (requires authentication and permission checks)
- `DELETE /api/issues/:id` — Delete an issue (requires authentication)

## Database Schema Summary

### users

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique user ID |
| `name` | `VARCHAR(200)` | `NOT NULL` | User full name |
| `email` | `VARCHAR(200)` | `UNIQUE`, `NOT NULL` | User email address |
| `password` | `TEXT` | `NOT NULL` | Hashed password |
| `role` | `TEXT` | `DEFAULT 'contributor'` | User role: `maintainer` or `contributor` |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Last update time |

### issues

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique issue ID |
| `title` | `VARCHAR(150)` | `NOT NULL` | Issue title |
| `description` | `TEXT` | `NOT NULL`, `CHECK (char_length(description) >= 20)` | Details of the issue |
| `type` | `VARCHAR(50)` | `NOT NULL`, `CHECK IN ('bug', 'feature_request')` | Issue type |
| `status` | `VARCHAR(50)` | `DEFAULT 'open'`, `CHECK IN ('open', 'in_progress', 'resolved')` | Current issue status |
| `reporter_id` | `INTEGER` | `NOT NULL` | ID of the user who reported the issue |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Issue creation time |
| `updated_at` | `TIMESTAMP` | `DEFAULT NOW()` | Last update time |

## Notes

- The application initializes the database tables on startup using the `initDB()` function.
- Protected routes rely on JWT authentication and middleware-based permission checks for maintenance workflows.
- The API is designed to be simple, reliable, and easy to extend for additional reporting features.
