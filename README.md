# Books Library Frontend

A modern web application for managing and browsing books, built with React, TanStack Router, and TanStack Query.

---

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Application Overview](#application-overview)
- [User Roles & Permissions](#user-roles--permissions)
- [Application Flow](#application-flow)
- [Routes](#routes)
- [Environment Variables](#environment-variables)
- [Development Scripts](#development-scripts)
- [Code Quality](#code-quality)
- [Live Demo](#live-demo)

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd books-library-frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following:

   ```env
   VITE_BASE_API_URL=<your-backend-api-url>
   ```

   ⚠️ **Important:** The environment variable **must** start with `VITE_` prefix for Vite to expose it to the client-side code. If you want to use a different name, ensure it starts with `VITE_`.

4. **Start the development server**

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Alternative Scripts

- **Build for production:**

  ```bash
  pnpm build
  ```

- **Preview production build:**
  ```bash
  pnpm serve
  ```

### 🐳 Docker Setup

If you prefer using Docker, you can run the application in a containerized environment.

> **Note:** To use the Docker setup, you need to switch to the `feat-docker` branch:
>
> ```bash
> git checkout feat-docker
> ```

**Prerequisites:**

- **Docker** installed on your machine

**Steps:**

1. **Build the Docker image**

   ```bash
   docker-compose build
   ```

2. **Start the application**

   ```bash
   docker-compose up
   ```

3. **Access the application**

   The app will be running on `http://localhost:8080`

Happy Docker setup! 🎉

---

## 📖 Application Overview

The Books Library application is a full-featured content management system for books with the following capabilities:

- **Public book browsing** - Anyone can view and search books
- **User authentication** - Login/Signup functionality
- **Role-based access control** - Different permissions for admins and authors
- **Book management** - Create, edit, and delete books
- **User management** - Admin-only user administration
- **Advanced filtering** - Search and filter books by genre or by author (admin user)
- **Media uploads** - Support for book cover images

---

## 👥 User Roles & Permissions

The application supports **two user roles** with distinct permissions:

### 1. **ADMIN**

**Full system access**

- ✅ View all books
- ✅ Create new books
- ✅ Edit any book
- ✅ Delete any book
- ✅ View all users
- ✅ Create new users
- ✅ Edit users
- ✅ Delete users (except other admins)
- ✅ Access to `/users` and `/books` routes

### 2. **AUTHOR**

**Limited to book management**

- ✅ View all books
- ✅ Create new books
- ✅ Edit their own books
- ✅ Delete their own books
- ❌ Cannot access user management
- ✅ Access to `/books` route only

---

## 🔄 Application Flow

### Public Access

1. **Landing Page (`/`)**
   - Publicly accessible without authentication
   - Browse all available books
   - Search books by title/description
   - Filter books by genre
   - View book details
   - Access to Login/Signup

### Authentication Flow

2. **Login (`/login`)**
   - Users can authenticate with email and password
   - Redirects to appropriate dashboard based on role:
     - **ADMIN** → `/users`
     - **AUTHOR** → `/books`

3. **Signup (`/signup`)**
   - New users can create an account
   - Automatic role assignment based on registration

### Protected Routes

4. **Books Management (`/books`)**
   - Accessible by: **ADMIN** and **AUTHOR**
   - Features:
     - View all books in a table
     - Search and filter books
     - Sort by creation date
     - Click a row to edit the book
     - Create new books via `/book/create`
     - Edit books via `/book/:id`
     - Delete books (with confirmation)

5. **Users Management (`/users`)**
   - Accessible by: **ADMIN only**
   - Features:
     - View all users in a table
     - Search and filter users
     - Sort by creation date
     - Click a row to edit the user
     - Create new users via `/user/create`
     - Edit users via `/user/:id`
     - Delete users (except admins, with confirmation)

### Resource Management

Each user can perform **CRUD operations** on their accessible resources:

- **Create**: Add new books/users (where permitted)
- **Read**: View books/users in tables and detail pages
- **Update**: Edit existing books/users
- **Delete**: Remove books/users with confirmation dialog

---

## 🗺️ Routes

### Public Routes

- `/` - Landing page with book listings
- `/login` - User login
- `/signup` - User registration
- `/book-detail/:id` - Public book detail page

### Protected Routes (Requires Authentication)

- `/books` - Books management table (Admin & Author)
- `/book/create` - Create new book (Admin & Author)
- `/book/:id` - Edit book (Admin & Author)
- `/users` - Users management table (**Admin only**)
- `/user/create` - Create new user (**Admin only**)
- `/user/:id` - Edit user (**Admin only**)

### Special Routes

- `/unauthorized` - Shown when accessing restricted routes
- `/not-found` - 404 page for non-existent routes

---

## 🔐 Environment Variables

The application requires the following environment variable:

| Variable            | Required | Description          | Example                     |
| ------------------- | -------- | -------------------- | --------------------------- |
| `VITE_BASE_API_URL` | Yes      | Backend API base URL | `http://localhost:3001/api` |

⚠️ **Critical Notes:**

- The variable name **must** start with `VITE_` prefix
- Vite only exposes variables prefixed with `VITE_` to the client
- If you change the variable name, ensure it starts with `VITE_`
- Restart the dev server after modifying `.env`

---

## 🛠️ Development Scripts

| Command           | Description                                       |
| ----------------- | ------------------------------------------------- |
| `pnpm dev`        | Start development server on port 3000             |
| `pnpm build`      | Build for production (includes type checking)     |
| `pnpm serve`      | Preview production build                          |
| `pnpm test`       | Run tests with Vitest                             |
| `pnpm type:check` | Run TypeScript type checking                      |
| `pnpm lint`       | Lint and auto-fix code with ESLint                |
| `pnpm format`     | Format code with Prettier                         |
| `pnpm pre-commit` | Run all quality checks (type-check, lint, format) |

---

## ✨ Code Quality

This project maintains high code quality standards:

### Pre-commit Hook

The `pre-commit` script runs before every commit to ensure code quality:

```bash
pnpm pre-commit
```

This command:

1. **Type checks** all TypeScript files
2. **Lints** code with ESLint (auto-fixes issues)
3. **Formats** code with Prettier

All checks must pass before the commit is allowed.

### Code Quality Tools

- **TypeScript** - Static type checking
- **ESLint** - Code linting with:
  - TanStack configuration
  - React hooks rules
  - Unused imports detection
  - Import sorting
- **Prettier** - Code formatting
- **Vitest** - Unit testing

---

## 🌐 Live Demo

Visit the live application at:

**[Your Live Demo URL Here]**

> 💡 Replace this with the actual deployment URL when available

---

## 🏗️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - File-based routing
- **TanStack Query** - Data fetching and caching
- **TanStack Table** - Advanced table management
- **Tailwind CSS** - Utility-first styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Radix UI** - Accessible UI primitives
- **Framer Motion** - Animations
- **Ky** - HTTP client
- **Sonner** - Toast notifications

---

## 📁 Project Structure

```
src/
├── components/          # Shared components (Header, Logo)
├── features/           # Feature-based modules
│   ├── admin-books/   # Book management feature
│   ├── admin-users/   # User management feature
│   ├── landing/       # Public landing page
│   └── shared/        # Shared feature components
├── lib/               # Shared utilities and components
│   ├── api-hooks/    # API-related hooks
│   ├── components/   # Reusable UI components
│   ├── constants/    # App-wide constants
│   ├── hooks/        # Custom React hooks
│   ├── layouts/      # Layout components
│   ├── providers/    # Context providers
│   └── utils/        # Utility functions
├── routes/           # TanStack Router file-based routes
└── main.tsx          # Application entry point
```

---

## 🤝 Contributing

When contributing to this project:

1. Ensure all environment variables are properly configured
2. Run `pnpm pre-commit` before committing
3. Follow the existing code structure and patterns
4. Write tests for new features
5. Update documentation as needed

---

## 🐛 Troubleshooting

### Common Issues

**Issue: API calls failing**

- Ensure `VITE_BASE_API_URL` is set correctly in `.env`
- Verify the backend server is running
- Check that the environment variable starts with `VITE_`

**Issue: Changes not reflected after `.env` update**

- Restart the development server (`pnpm dev`)
- Clear browser cache

**Issue: Build errors**

- Run `pnpm type:check` to identify TypeScript errors
- Run `pnpm lint` to fix linting issues

---

**Built with ❤️ using modern React and TanStack tools by Raoul Baddawi**
