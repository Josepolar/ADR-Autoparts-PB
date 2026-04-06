# Local Development Setup Guide

## Prerequisites Check

Before proceeding, ensure you have:

- **Node.js 20+** — [Download](https://nodejs.org)
  ```bash
  node --version    # Should be v20.x.x or higher
  npm --version     # Should be 10.x.x or higher
  ```

- **PostgreSQL 14+** — [Download](https://www.postgresql.org/download/)
  ```bash
  psql --version    # Should be postgres (PostgreSQL) 14+
  ```

  **Or use Docker:**
  ```bash
  docker --version  # Should be 20+
  docker-compose --version
  ```

- **Git** — [Download](https://git-scm.com/)

## Step 1: Environment Setup

### 1.1 Copy environment template
```bash
cp .env.local.example .env.local
```

### 1.2 [OPTION A] Using Docker for PostgreSQL (Recommended)

```bash
# Start PostgreSQL and pgAdmin in background
docker-compose up -d

# Verify PostgreSQL is running
docker-compose exec postgres pg_isready
```

This creates:
- PostgreSQL on `localhost:5432`
- pgAdmin on `http://localhost:5050` (optional)
- Database: `adr_autoparts`
- User: `adr_user`
- Password: `adr_dev_password_123`

Update your `.env.local`:
```env
DATABASE_URL="postgresql://adr_user:adr_dev_password_123@localhost:5432/adr_autoparts"
```

### 1.2 [OPTION B] Using Local PostgreSQL Installation

```bash
# Create database and user (using psql)
createdb adr_autoparts -U postgres
psql -U postgres adr_autoparts

# Inside psql shell:
CREATE USER adr_user WITH PASSWORD 'adr_dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE adr_autoparts TO adr_user;
\q
```

Update your `.env.local`:
```env
DATABASE_URL="postgresql://adr_user:adr_dev_password_123@localhost:5432/adr_autoparts"
```

### 1.3 Fill in remaining `.env.local` values

**NextAuth (required for auth to work):**
```env
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars-replace-this-with-random"
NEXTAUTH_URL="http://localhost:3000"
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Stripe (for payments, use test keys):**

1. Create a free Stripe account: https://dashboard.stripe.com
2. Go to Developers → API Keys
3. Copy the **Publishable Key** and **Secret Key** (note: keys start with `pk_test_` and `sk_test_`)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_KEY_HERE"
STRIPE_SECRET_KEY="sk_test_YOUR_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_test_YOUR_WEBHOOK_SECRET"  # Can be blank for now
```

**AWS S3 (for file storage):**

1. Create AWS account: https://aws.amazon.com
2. Go to IAM → Create User with S3 full access
3. Create S3 bucket named: `adr-autoparts-files-dev`
4. Enable CORS on the bucket

```env
AWS_REGION="us-east-1"
AWS_S3_BUCKET="adr-autoparts-files-dev"
AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_KEY"
```

**Uploadthing (for file uploads, optional for Phase 1):**

1. Sign up: https://uploadthing.com
2. Create an app in the dashboard

```env
UPLOADTHING_SECRET="YOUR_SECRET_HERE"
UPLOADTHING_APP_ID="YOUR_APP_ID"
```

**Leave Philippine gateways blank for Phase 1:**
```env
GCASH_API_KEY="test-gcash-key"
GCASH_SECRET="test-gcash-secret"
MAYA_API_KEY="test-maya-key"
MAYA_SECRET="test-maya-secret"
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs:
- Next.js, React, TypeScript
- Tailwind CSS for styling
- Prisma for database ORM
- NextAuth for authentication
- Stripe SDK for payments
- Testing libraries (Jest, React Testing Library)

**Installation should take 2-3 minutes.**

## Step 3: Database Setup

### 3.1 Create database schema
```bash
npm run db:migrate
```

This runs Prisma migrations and creates all tables.

**Expected output:**
```
Environment variables loaded from .env.local
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "adr_autoparts" at "localhost:5432"

✔ Enter a name for the new migration: Create initial schema
... creating migrations
✔ Your database is now in sync with your Prisma schema.

✨ Done in 2.34s
```

### 3.2 (Optional) Populate sample data
```bash
npm run db:seed
```

This creates:
- 4 sample users (1 admin, 1 mechanic, 2 customers)
- 2 sample vehicles
- Sample ECUs, firmware files, parts, services, appointments

**Test login credentials:**
- Admin: `admin@adr-autoparts.com` / `admin123`
- Mechanic: `mechanic@adr-autoparts.com` / `mechanic123`
- Customer: `customer1@example.com` / `customer123`

### 3.3 (Optional) Browse database in UI
```bash
npm run db:studio
```

Opens Prisma Studio on `http://localhost:5555` for visual database editing.

## Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
> next dev

▲ Next.js 15.0.0
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 3.2s
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see:
- ADR Autoparts landing page
- Navigation to AutoECU, Parts, Rapide modules
- Sign In / Sign Up buttons

## Step 5: Verify Installation

### 5.1 Check all systems are working

```bash
# Terminal 1: Keep dev server running
npm run dev

# Terminal 2 (new): Run verification commands
npm run type-check    # TypeScript type checking
npm run lint          # ESLint code quality
```

Both should complete without errors.

### 5.2 Test authentication flow

1. Navigate to http://localhost:3000/auth/signup
2. Create an account with:
   - Email: `test@example.com`
   - Password: `test123456`
3. After signup, you should be redirected to sign-in page
4. Sign in with `test@example.com` / `test123456`
5. You should see the dashboard

### 5.3 Test database connectivity

In your code editor terminal:
```bash
npm run db:studio
```

This opens Prisma Studio. Under the `User` model, you should see your test account.

## Troubleshooting

### "Cannot find module 'next'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "PostgreSQL connection failed"
```bash
# Check if Docker container is running
docker ps

# If not running:
docker-compose up -d

# Verify connection
psql -U adr_user -d adr_autoparts -h localhost
```

### "NEXTAUTH_SECRET is missing"
Update `.env.local` with a valid secret:
```bash
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### "Prisma client not generated"
```bash
npx prisma generate
npm run db:migrate
```

### "Port 3000 is already in use"
```bash
# Find and kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm test -- --coverage
```

## Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code (uses Prettier settings)
npx prettier --write src/
```

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm test` | Run Jest tests |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking |
| `npm run db:migrate` | Create/update database schema |
| `npm run db:push` | Apply schema without migration |
| `npm run db:seed` | Populate sample data |
| `npm run db:studio` | Open Prisma Studio UI |

## Next Steps

1. ✅ Development server running locally
2. ✅ Database connected with tables created
3. ✅ Sample data populated (if you ran `db:seed`)
4. 📖 Read [README.md](README.md) for project overview
5. 🏗️ Check [ARCHITECTURE.md](ARCHITECTURE.md) for system design (coming soon)
6. 💻 Start building features according to the implementation plan

## Getting Help

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs/
- **NextAuth.js Docs:** https://next-auth.js.org/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Stripe API:** https://stripe.com/docs/api

---

**Estimated setup time: 15-20 minutes**

Once you see "Ready in 3.2s", your development environment is ready! 🚀
