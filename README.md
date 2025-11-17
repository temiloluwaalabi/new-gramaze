# Gramaze - Healthcare Management Platform

A comprehensive healthcare management system built with Next.js 15, providing seamless connections between patients, caregivers, and medical laboratories. The platform streamlines appointment scheduling, health tracking, and medical record management.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [API Architecture](#-api-architecture)
- [Authentication & Security](#-authentication--security)
- [Deployment](#-deployment)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🏥 Overview

Gramaze is a modern healthcare management platform designed to bridge the gap between patients, caregivers, and medical laboratories. As a medical lab platform, it provides comprehensive tools for managing appointments, tracking health vitals, maintaining medical records, and facilitating communication between all stakeholders in the healthcare journey.

### Mission Statement

To revolutionize healthcare accessibility by providing an intuitive, secure, and comprehensive platform that connects patients with quality care providers and medical services.

### Target Users

- **Patients**: Individuals seeking medical care and health management tools
- **Caregivers**: Healthcare professionals providing patient care
- **Medical Laboratories**: Facilities conducting medical tests and diagnostics
- **Healthcare Administrators**: Staff managing appointments and records

## ✨ Features

### Patient Features

- **Appointment Scheduling**: Book virtual assessments, at-home visits, or hospital appointments
- **Health Tracker**: Monitor vital signs including blood pressure, heart rate, and other health metrics
- **Medical Records**: Secure storage and management of medical history and test results
- **Caregiver History**: Track interactions and care received from different providers
- **Billing Management**: View billing history and manage payment methods
- **Messaging System**: Secure communication with caregivers
- **Notifications**: Real-time updates on appointments and health reminders

### Caregiver Features

- **Patient Management**: View and manage patient profiles and medical histories
- **Appointment Dashboard**: Manage scheduled appointments and availability
- **Messaging Hub**: Communicate with patients securely
- **Help Center**: Access resources and support documentation

### Core Platform Features

- **Multi-step Onboarding**: Comprehensive onboarding process including:
  - Bio-data collection
  - Medical history recording
  - Care plan selection
  - Initial appointment scheduling
- **Real-time Calendar**: Interactive scheduling with Big Calendar integration
- **Chart Visualization**: Health metrics visualization with Recharts
- **Responsive Design**: Mobile-first approach with dedicated mobile quick actions
- **Dark Mode Support**: Theme switching for better accessibility
- **Rich Text Editing**: Quill editor for detailed medical notes

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15.3.5**: React framework with App Router
- **React 19.1.0**: UI library
- **TypeScript 5**: Type-safe development

### UI & Styling

- **Tailwind CSS 4**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI components
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **React Big Calendar**: Event calendar component
- **Recharts**: Chart library for data visualization

### State Management & Data Fetching

- **TanStack Query 5**: Server state management
- **Zustand**: Client state management
- **Jotai**: Atomic state management
- **React Hook Form 7**: Form state management
- **Zod**: Schema validation

### Authentication & Security

- **Iron Session 8**: Secure, stateless session management
- **Session-based Auth**: Encrypted cookie-based authentication

### Development Tools

- **ESLint**: Code linting with custom configuration
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Husky**: Git hooks for code quality
- **Commitlint**: Enforce conventional commits
- **Lint-staged**: Run linters on staged files

### Additional Libraries

- **Axios**: HTTP client for API requests
- **Day.js & date-fns**: Date manipulation
- **React Dropzone**: File upload handling
- **React Phone Number Input**: International phone number formatting
- **Sonner**: Toast notifications
- **Pino**: Logging system

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17 or higher
- **npm**: Version 10.7.0 (specified as package manager)
- **Git**: For version control

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/temiloluwaalabi/new-gramaze.git
   cd new-gramaze
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your configuration

4. **Set up Git hooks**
   ```bash
   npm run prepare
   ```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Admin Configuration
NEXT_PUBLIC_ADMIN_API_URL="https://gramaze.diklota.ng/api"
NEXT_PUBLIC_ADMIN_URL="https://gramaze.diklota.ng"

# Client Configuration
NEXT_PUBLIC_CLIENT_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_CLIENT_URL="http://localhost:3000"

# Security
SESSION_PASSWORD="your-secure-32-byte-hex-string"

# Additional configurations (if needed)
# DATABASE_URL="your-database-connection-string"
# NEXT_PUBLIC_API_KEY="your-api-key"
```

### Environment Variables Description

| Variable                     | Description                               | Required |
| ---------------------------- | ----------------------------------------- | -------- |
| `NEXT_PUBLIC_ADMIN_API_URL`  | Admin API endpoint URL                    | Yes      |
| `NEXT_PUBLIC_ADMIN_URL`      | Admin dashboard URL                       | Yes      |
| `NEXT_PUBLIC_CLIENT_API_URL` | Client-side API URL                       | Yes      |
| `NEXT_PUBLIC_CLIENT_URL`     | Client application URL                    | Yes      |
| `SESSION_PASSWORD`           | 32-byte hex string for session encryption | Yes      |

**⚠️ Security Note**: Generate a secure `SESSION_PASSWORD` using:

```bash
openssl rand -hex 32
```

## 💻 Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Code Quality Commands

```bash
# Run linting
npm run lint

# Format code
npm run format

# Run tests (when implemented)
npm run test:unit
```

## 📁 Project Structure

```
gramaze/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (user)/                  # Patient dashboard
│   │   └── dashboard/
│   │       ├── appointment/
│   │       ├── billing/
│   │       ├── health-tracker/
│   │       ├── caregiver-history/
│   │       ├── message/
│   │       ├── notifications/
│   │       └── settings/
│   ├── (caregiver)/             # Caregiver dashboard
│   │   └── caregiver/
│   │       ├── appointments/
│   │       ├── patients/
│   │       ├── messages/
│   │       └── help-center/
│   ├── (onboard)/               # Onboarding flow
│   ├── actions/                 # Server actions
│   │   └── services/           # Service layer actions
│   └── api/                     # API routes
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   ├── forms/                   # Form components
│   ├── pages/                   # Page-level components
│   ├── sheets/                  # Sheet/drawer components
│   ├── dialogs/                 # Modal dialogs
│   ├── charts/                  # Chart components
│   ├── table/                   # Data table components
│   └── shared/                  # Shared components
│       ├── calendar/
│       ├── layout/
│       ├── onboarding/
│       └── widget/
├── lib/                          # Utility libraries
│   ├── api/                     # API client setup
│   ├── auth/                    # Authentication utilities
│   ├── queries/                 # React Query hooks
│   └── schemas/                 # Zod validation schemas
├── hooks/                        # Custom React hooks
├── providers/                    # Context providers
├── store/                        # Zustand stores
├── types/                        # TypeScript type definitions
├── config/                       # Application configuration
├── context/                      # React contexts
├── icons/                        # Custom icon components
├── public/                       # Static assets
└── utils/                        # Utility functions
```

## 🔧 Key Components

### Authentication Flow

- **Sign Up**: Multi-step registration with bio-data collection
- **Sign In**: Secure login with session management
- **Password Reset**: Email-based password recovery
- **Session Management**: Iron-session based authentication

### Dashboard Components

- **Patient Dashboard**: Comprehensive health management interface
- **Caregiver Dashboard**: Patient management and appointment tracking
- **Admin Dashboard**: System administration at `gramaze.diklota.ng`

### Form System

- **Bio-data Form**: Patient information collection
- **Medical History Form**: Health record documentation
- **Appointment Forms**: Various appointment types (virtual, at-home, hospital)
- **Payment Forms**: Payment method management

### Calendar & Scheduling

- **Big Calendar Integration**: Visual appointment scheduling
- **Day.js Calendar**: Alternative calendar implementation
- **Appointment Transformation**: Utilities for appointment data handling

## 🔌 API Architecture

### API Routes

```typescript
// Authentication
POST   /api/auth/deploy     - Deploy authentication
GET    /api/auth/session    - Get current session

// Server Actions (app/actions/)
- appointment.actions.ts     - Appointment management
- auth.actions.ts            - Authentication operations
- caregiver-patient.actions.ts - Caregiver-patient relationships
- payment.actions.ts         - Payment processing
- session.actions.ts         - Session management

// Service Layer (app/actions/services/)
- appointment.actions.ts     - Appointment services
- caregiver.actions.ts      - Caregiver services
- chats.actions.ts          - Messaging services
- health.tracker.actions.ts - Health tracking services
- hospital.actions.ts       - Hospital services
- users.actions.ts          - User management services
```

### API Client Setup

The application uses a centralized API client (`lib/api/api-client.ts`) with:

- Axios interceptors for request/response handling
- Automatic error handling
- Request configuration setup
- Token management (if applicable)

## 🔒 Authentication & Security

### Session Management

- **Iron Session**: Stateless, encrypted cookie-based sessions
- **Session Password**: 32-byte encryption key for session data
- **Secure Cookies**: HTTPOnly, Secure, SameSite attributes

### Protected Routes

- Middleware-based route protection (`middleware.ts`)
- Role-based access control (Patient vs Caregiver)
- Session validation on each request

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git push origin main
   ```

2. **Import on Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Import GitHub repository
   - Configure environment variables
   - Deploy

3. **Configure Domain**
   - Add custom domain `gramaze.diklota.ng`
   - Update DNS settings

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm --name "gramaze" -- start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## 👨‍💻 Development Guidelines

### Git Workflow

1. **Branch Naming**
   - Feature: `feature/feature-name`
   - Bugfix: `fix/bug-description`
   - Hotfix: `hotfix/critical-fix`

2. **Commit Convention** (Enforced by Commitlint)

   ```bash
   feat: add new appointment scheduling feature
   fix: resolve calendar display issue
   docs: update API documentation
   style: format code with prettier
   refactor: restructure appointment actions
   test: add unit tests for auth
   chore: update dependencies
   ```

3. **Pre-commit Hooks** (via Husky & Lint-staged)
   - ESLint fixes
   - Prettier formatting
   - Commit message validation

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Custom configuration with Next.js rules
- **Prettier**: Consistent formatting with Tailwind plugin
- **Component Structure**: Functional components with hooks

### Component Guidelines

```typescript
// Example component structure
import { FC } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  className?: string
  // other props
}

export const Component: FC<ComponentProps> = ({ className, ...props }) => {
  // hooks
  // state
  // handlers

  return (
    <div className={cn('default-classes', className)}>
      {/* content */}
    </div>
  )
}
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests (to be implemented)
npm run test:unit

# E2E tests (to be implemented)
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Testing Strategy

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and service layer testing
- **E2E Tests**: Critical user journeys
- **Performance Testing**: Lighthouse CI integration

## 🤝 Contributing

We welcome contributions to Gramaze! Please follow these guidelines:

1. **Fork the repository**

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**

   ```bash
   git commit -m "feat: description of your feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Ensure all checks pass

### Development Setup

1. Install recommended VS Code extensions
2. Configure ESLint and Prettier
3. Set up pre-commit hooks
4. Review coding standards

## 🆘 Support

For support and questions:

- **Documentation**: Review this README and code documentation
- **Issues**: [GitHub Issues](https://github.com/temiloluwaalabi/new-gramaze/issues)
- **Admin Dashboard**: [gramaze.diklota.ng](https://gramaze.diklota.ng)
- **Email**: support@gramaze.com

### Troubleshooting

**Common Issues:**

1. **Session errors**: Ensure `SESSION_PASSWORD` is properly set
2. **Build failures**: Clear `.next` folder and rebuild
3. **Dependency issues**: Delete `node_modules` and reinstall

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📊 Project Status

- **Version**: 0.1.0
- **Status**: Active Development
- **Last Updated**: November 2024
- **Maintained by**: Temiloluwa Alabi

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- UI Components from [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Calendar by [Big Calendar](https://github.com/jquense/react-big-calendar)
- Charts by [Recharts](https://recharts.org/)

---

**Gramaze** - Revolutionizing Healthcare Management 🏥

Made with ❤️ by the Gramaze Development Team
