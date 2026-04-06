# ADR Autoparts - Custom Automotive Super-App

A full-stack Next.js application featuring three integrated modules: **AutoECU** (firmware portal), **PartsPro** (e-commerce), and **Rapide** (service booking).

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, NextAuth.js, Server Actions
- **Database:** PostgreSQL with Prisma ORM
- **Storage:** AWS S3 (encrypted firmware files)
- **Payments:** Stripe (international), GCash/Maya (Philippine gateways)
- **Analytics:** Real-time dashboards with role-based access control

## 🗂️ Project Structure

```
src/
├── app/                  # Next.js 15 App Router
│   ├── autoecu/         # Firmware upload & catalogue
│   ├── parts/           # E-commerce shop
│   ├── rapide/          # Service booking
│   ├── admin/           # Admin dashboard
│   ├── mechanic/        # Mechanic tablet UI
│   └── auth/            # Authentication pages
├── server/              # Backend logic
│   ├── auth.ts          # NextAuth configuration
│   ├── db.ts            # Prisma client
│   └── [db queries]
├── components/          # Reusable React components
├── lib/                 # Utilities & helpers
├── types/               # TypeScript definitions
└── styles/              # Global CSS & Tailwind

prisma/
├── schema.prisma        # Database schema
└── seed.ts              # Database seeding script
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (we recommend 20 LTS)
- PostgreSQL 14+
- Git

### Installation

1. **Clone & Setup**
   ```bash
   cd c:\xampp\htdocs\ADR-Autoparts-PB
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual credentials (database URL, Stripe keys, etc.)
   ```

3. **Database Setup**
   ```bash
   npm run db:migrate         # Create tables from schema
   npm run db:seed            # Populate sample data
   npm run db:studio          # Browse DB in UI (optional)
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Run production server
- `npm run lint` — Run ESLint
- `npm test` — Run Jest test suite
- `npm run db:migrate` — Create/update database
- `npm run db:push` — Apply schema changes (no new migration)
- `npm run db:seed` — Populate sample data
- `npm run db:studio` — Open Prisma Studio (visual DB editor)
- `npm run type-check` — TypeScript static check

## 🏛️ Architecture

### Phase 1: Core Infrastructure & AutoECU MVP (3-4 weeks)

**Deliverables:**
- ✅ Project scaffolding complete
- ⏳ Database schema (PostgreSQL + Prisma)
- ⏳ NextAuth.js authentication with role-based access
- ⏳ AutoECU portal (upload + pay-to-download)
- ⏳ Basic admin dashboard skeleton
- ⏳ Stripe payment integration

**Verification:**
- [ ] Next.js dev server starts without errors
- [ ] Prisma migrations run successfully
- [ ] User signup/login workflow functional
- [ ] File upload to S3 working
- [ ] Stripe payments in test mode (no real charges)

### Phase 2: PartsPro E-Commerce (3-4 weeks)

**Deliverables:**
- Parts catalogue with Year-Make-Model filtering
- Inventory management system
- Shopping cart & checkout
- Order tracking & shipping integration

### Phase 3: Rapide Booking + Polish (3-4 weeks)

**Deliverables:**
- Service booking engine with real-time calendar
- Admin "War Room" (drag-drop appointment management)
- Mechanic tablet interface
- Philippine payment gateways (GCash/Maya)
- Analytics dashboard
- PWA enablement
- Production deployment

## 🎨 Design System

### Neo-Industrial Dark Mode Colors

- **Cyber Blue** (#00D4FF) — Digital, tech, interactive elements
- **Nardo Gray** (#6D6E71) — Professional surfaces, borders, text
- **Vivid Amber** (#FFB400) — Critical CTAs, warnings, highlights

### Responsive Breakpoints

- **Mobile** (< 640px) — Consumer app view
- **Tablet** (640px - 1024px) — Mechanic shop floor UI
- **Desktop** (> 1024px) — Admin & analysis view

## 🔐 Security

- Passwords hashed with bcryptjs (production-ready)
- JWT-based session management (NextAuth.js)
- Signed S3 URLs for firmware file delivery (no direct access)
- HTTPS enforced on all routes
- CORS headers configured for API routes
- Role-based access control (RBAC) for routes & database queries

## 📊 Database Schema Highlights

**Core Entities:**
- `User` (CUSTOMER, MECHANIC, ADMIN roles)
- `Vehicle` (Year-Make-Model with VIN)
- `ECU` & `FirmwareFile` (Firmware management)
- `ImmoRequest` (Custom ECU workflow)
- `Part` & `PartVariant` (E-commerce inventory)
- `Order` & `Payment` (Order management)
- `Service` & `Appointment` (Booking)
- `AuditLog` (Compliance & debugging)

See [prisma/schema.prisma](prisma/schema.prisma) for full schema.

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Hosting Recommendations
- **Next.js App:** Vercel (native support, serverless)
- **Database:** Supabase or Neon (managed PostgreSQL)
- **File Storage:** AWS S3 (firmware files)
- **Monitoring:** Vercel Analytics + Sentry

## 🛠️ Development Workflow

1. Create a feature branch: `git checkout -b feature/xyz`
2. Make changes and test locally: `npm run dev`
3. Run type checks: `npm run type-check`
4. Run linter: `npm run lint`
5. Commit with semantic message: `git commit -m "feat: add xyz"`
6. Push and create PR

## 📚 Documentation

- **API Routes:** See `/src/app/api/**` for endpoint documentation
- **Components:** See `/src/components/` for reusable UI components
- **Database:** Prisma schema at `/prisma/schema.prisma`
- **Types:** TypeScript definitions at `/src/types/index.ts`

## 🤝 Contributing

This is a custom-coded project managed by your development team. Follow the architecture and coding standards outlined above.

## 📝 License

Proprietary. ADR Autoparts © 2026.

---

**Built with ❤️ using the T3 Stack (Next.js + TypeScript + Tailwind CSS)**
