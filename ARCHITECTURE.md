# ADR Autoparts - Architecture & System Design

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend                          │
│  (React 19 + TypeScript + Tailwind CSS)                         │
│  ├─ AutoECU Module (Firmware Portal)                            │
│  ├─ PartsPro Module (E-commerce)                                │
│  ├─ Rapide Module (Service Booking)                             │
│  ├─ Admin Dashboard                                             │
│  └─ Mechanic UI (Tablet Optimized)                              │
└─────────────────────────────────────────────────────────────────┘
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js API Routes                            │
│  (Server-Side Functions, Server Actions)                        │
│  ├─ /api/auth/*        (Authentication)                         │
│  ├─ /api/orders/*      (Order Management)                       │
│  ├─ /api/payments/*    (Stripe, GCash, Maya)                    │
│  ├─ /api/inventory/*   (Parts Management)                       │
│  ├─ /api/appointments/*(Service Booking)                        │
│  └─ /api/webhooks/*    (Third-party events)                     │
└─────────────────────────────────────────────────────────────────┘
        ▼                    ▼                    ▼
  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐
  │ PostgreSQL  │    │  AWS S3      │    │  Stripe API  │
  │ (Prisma)    │    │ (Firmware)   │    │ (Payments)   │
  └─────────────┘    └──────────────┘    └──────────────┘
        ▼
  ┌──────────────────────────────────────────────────────┐
  │  Supabase/Neon (Managed PostgreSQL Hosting)          │
  └──────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend
- **Framework:** Next.js 15 with App Router (server-centric)
- **Language:** TypeScript with strict mode
- **UI/Styling:** Tailwind CSS with custom neo-industrial theme
- **State Management:** TanStack Query (React Query) for server state
- **Forms:** React Hook Form + Zod for validation
- **Animations:** Framer Motion (minimal)

### Backend
- **Runtime:** Node.js 20 LTS
- **Server Functions:** Next.js Server Actions and API Routes
- **Authentication:** NextAuth.js with JWT sessions
- **Database Client:** Prisma ORM

### Database
- **System:** PostgreSQL 14+
- **Schema:** Comprehensive automotive data model (see schema.prisma)
- **Relations:** Complex multi-table relationships (Users → Vehicles → ECUs → Firmware)
- **Connection Pool:** Managed by hosting provider (Supabase/Neon)

### Storage
- **Firmware Files:** AWS S3 with encryption and signed URLs
- **Service Photos:** AWS S3 with signed URLs (time-limited access)
- **Bucket Security:** CORS configured, no direct public access

### Payments
- **International:** Stripe SDK (USD, PHP conversion)
- **Philippine:** GCash & Maya APIs (Phase 3)
- **Webhook Handling:** Stripe webhook signature verification

## Directory Structure

```
src/
├── app/                         # Next.js 15 App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global Tailwind styles
│   │
│   ├── autoecu/                # Module: ECU Firmware
│   │   ├── page.tsx            # Main landing
│   │   ├── upload/             # File upload flow
│   │   ├── catalogue/          # Download existing files
│   │   └── requests/           # Order tracking
│   │
│   ├── parts/                  # Module: E-commerce
│   │   ├── page.tsx            # Browse products
│   │   ├── [partId]/           # Product detail
│   │   └── cart/               # Shopping cart
│   │
│   ├── rapide/                 # Module: Service Booking
│   │   ├── page.tsx            # Service selection
│   │   ├── book/               # Booking flow
│   │   └── appointments/       # My appointments
│   │
│   └── admin/                  # Admin Dashboard
│       ├── page.tsx            # Dashboard overview
│       ├── inventory/          # Stock management
│       ├── immo-requests/      # Immo-Off war room
│       ├── war-room/           # Appointment calendar
│       └── analytics/          # Revenue reports
│
├── server/                      # Backend logic
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Prisma client singleton
│   └── [server actions]        # Mutation functions
│
├── components/                  # Reusable React components
│   ├── ui/                     # Basic components (buttons, inputs)
│   ├── forms/                  # Complex form components
│   ├── layout/                 # Layout components (nav, sidebar)
│   └── [feature-specific]/     # Feature components
│
├── lib/                        # Utility functions
│   ├── auth-utils.ts           # Password hashing, token generation
│   ├── env.ts                  # Environment validation with Zod
│   ├── utils.ts                # Common helpers (formatting, dates)
│   └── validators.ts           # Zod schemas for all forms
│
├── types/                      # TypeScript definitions
│   └── index.ts                # All type exports
│
└── styles/                     # Additional styles if needed

prisma/
├── schema.prisma               # Complete database schema
└── seed.ts                     # Database seeding script
```

## Database Schema Overview

### Core Entity Relationships

```
User (CUSTOMER | MECHANIC | ADMIN)
  ├─ Vehicle
  │  └─ ECU
  │      └─ FirmwareFile
  │
  ├─ Order
  │  ├─ OrderItem (Part or FirmwareFile)
  │  └─ Payment
  │
  ├─ ImmoRequest
  │  └─ FirmwareFile (modification workflow)
  │
  └─ Appointment
      ├─ Service
      └─ Bay

Inventory
  ├─ Part
  │  ├─ PartVariant
  │  ├─ PartCompatibility
  │  └─ InventoryBatch

Service Management
  ├─ Service
  ├─ Bay
  └─ Appointment

Audit
  └─ AuditLog
```

### Key Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User profiles & auth | email, role, passwordHash |
| `vehicles` | Customer vehicles | year, make, model, vin |
| `ecus` | Vehicle ECUs | ecuType, manufacturer, partNumber |
| `firmware_files` | ECU firmware binaries | fileName, fileHash, fileUrl (S3), price |
| `immo_requests` | Custom ECU tuning workflow | status (pending→processing→ready→downloaded) |
| `parts` | Retail parts inventory | sku, name, retailPrice, totalStock |
| `part_variants` | Part variations | name (5W-30, Ceramic, etc.), priceAdjustment |
| `orders` | Customer orders | orderNumber, status, totalAmount |
| `payments` | Payment processing | method (Stripe/GCash/Maya), status, transactionId |
| `services` | Service offerings | name, type (Oil Change, etc.), basePrice |
| `appointments` | Booked services | status (scheduled→completed), scheduledStart/End |
| `audit_logs` | Action tracking | action, entityType, userId, changes |

## Authentication & Authorization Flow

### NextAuth Session Flow

```
1. User navigates to /auth/signin
2. Submits email + password
3. NextAuth CredentialsProvider:
   - Queries database for user by email
   - Compares password with bcrypt hash
   - Returns user object if valid
4. NextAuth creates JWT token
5. Token stored in httpOnly cookie
6. Subsequent requests include token in Authorization header
7. Server middleware decodes JWT and attaches user to context
```

### Role-Based Access Control (RBAC)

```
CUSTOMER
├─ Browse parts, firmware catalogue
├─ Place orders
├─ Book services
├─ View own orders & appointments
└─ Upload ECU files for Immo-Off

MECHANIC
├─ View daily appointments (War Room read)
├─ Mark services as complete
├─ Add notes, photos to appointments
└─ Access mechanic dashboard (tablet UI)

ADMIN
├─ Full access to all modules
├─ Manage inventory & stock levels
├─ Process Immo-Off requests
├─ Manage services & bays
├─ View analytics & reports
├─ Export data (orders, revenue)
└─ User management (future)
```

### Protected Routes

```ts
// In middleware or page level:
if (!session || !hasAnyRole(session.user.role, ["ADMIN", "MECHANIC"])) {
  return redirect("/auth/signin");
}
```

## Data Flow Examples

### Example 1: Customer Orders Firmware File

```
1. Customer browses /autoecu/catalogue
2. Clicks "Buy" on firmware file (₱8,500)
3. Stripe checkout modal opens
4. Customer enters card details
5. Stripe processes payment
6. Webhook received: /api/webhooks/stripe
7. Database updated: Payment.status = COMPLETED
8. Order.status = PAYMENT_CONFIRMED
9. Signed S3 URL generated (24-hour validity)
10. Customer redirected to /autoecu/orders
11. Download link appears
12. File downloaded from S3 (encrypted ECU binary)
```

### Example 2: Customer Submits Immo-Off Request

```
1. Customer logs in, selects vehicle
2. Navigates to /autoecu/upload
3. Uploads stock ECU file
4. File encrypted and stored in S3
5. ImmoRequest.status = PENDING_UPLOAD
6. Email notification to admin
7. Admin logs into War Room
8. Sees pending request with file details
9. Downloads file from S3
10. Opens in tuning software, modifies ECU
11. Exports modified file
12. Uploads via admin panel
13. ImmoRequest.status = READY_FOR_DOWNLOAD
14. Customer gets notification (email)
15. Customer downloads tuned file
16. ImmoRequest.status = DOWNLOADED
```

### Example 3: Mechanic Books Appointment

```
1. Customer logs in
2. Navigates to /rapide
3. Selects "Oil Change" service
4. Calendar shows available time slots
5. Selects date/time (bay availability checked in real-time)
6. Proceeds to checkout (₱1,500)
7. Stripe payment
8. Appointment created with status SCHEDULED
9. Admin sees in War Room calendar
10. Mechanic views tablet, sees "Oil Change - Bay 1 at 2:30 PM"
11. Marks as complete
12. Appointment status → COMPLETED
13. Customer receives notification
14. Can request invoice/receipt
```

## API Routes

### Authentication
- `POST /api/auth/signin` — User login
- `POST /api/auth/signup` — User registration
- `POST /api/auth/signout` — User logout
- `GET /api/auth/session` — Get current session

### Orders & Payments
- `GET /api/orders` — List user's orders
- `POST /api/orders` — Create new order
- `POST /api/payments/stripe/webhook` — Stripe webhook handler
- `POST /api/payments/gcash/webhook` — GCash webhook handler

### Inventory
- `GET /api/inventory/parts` — List parts (with filtering)
- `PUT /api/inventory/parts/:id` — Update part stock
- `GET /api/inventory/compatibility` — Part compatibility check

### Appointments
- `GET /api/appointments` — List appointments
- `POST /api/appointments` — Create appointment
- `PUT /api/appointments/:id` — Update appointment status
- `GET /api/appointments/availability` — Check bay availability

## Deployment Architecture

### Development
```
Local Machine
├─ Docker PostgreSQL (or local)
├─ Next.js dev server (localhost:3000)
└─ Stripe test keys
```

### Staging
```
Vercel (Next.js)
├─ Neon PostgreSQL (free tier)
├─ AWS S3 (staging bucket)
├─ Stripe test keys
└─ Environment: staging
```

### Production
```
Vercel (Next.js) + GitHub Actions
├─ Supabase PostgreSQL (paid tier)
├─ AWS S3 (production bucket, encrypted)
├─ Stripe live keys (international + PH gateways)
├─ CloudFront CDN for S3 files
├─ Monitoring: Vercel Analytics + Sentry
└─ Environment: production
```

## Performance Considerations

### Frontend Optimization
- **Server Components:** Default for data fetching, no JS sent to client
- **Client Components:** Only for interactivity (forms, dropdowns)
- **Image Optimization:** Next.js Image component with Tailwind
- **Code Splitting:** Automatic by Next.js per route
- **Lazy Loading:** React.lazy for heavy components (calendar)

### Database Optimization
- **Indexes:** On frequently queried fields (userId, status, createdAt)
- **Pagination:** Limit returned rows (25/50/100 per page)
- **Query Optimization:** Only select needed columns (Prisma select)
- **Caching:** TanStack Query for client-side caching (5-minute stale time)

### API Optimization
- **Rate Limiting:** Stripe, GCash, Maya APIs have built-in limits
- **Batch Operations:** Inventory updates batched where possible
- **Webhook Retries:** Exponential backoff for failed webhooks
- **Timeout Handling:** 30-second API call timeouts

## Security Practices

### Data Protection
- **Password Hashing:** bcryptjs with 10 salt rounds
- **Database Encryption:** SSL connection to PostgreSQL
- **S3 Encryption:** AES-256 for stored files
- **PII Handling:** Encrypted fields in database (future: full-disk encryption)

### Access Control
- **RBAC:** Role-based middleware on all protected routes
- **CORS:** API routes restricted to origin domains
- **CSRF Protection:** SameSite cookies, token validation
- **SQL Injection:** Prisma ORM prevents via parameterized queries

### API Security
- **Signed URLs:** S3 file downloads expire after 1 hour
- **Webhook Verification:** Stripe signature validation
- **Rate Limiting:** IP-based rate limiting (future: via middleware)
- **API Keys:** Stripe secret key never exposed to client

## Monitoring & Logging

### Application Logging
- **NextAuth:** Session events logged to stdout
- **Prisma:** Query logs in development (disabled in production)
- **API Errors:** Caught and logged to Sentry
- **Audit Trail:** All admin actions logged to `audit_logs` table

### Performance Monitoring
- **Vercel Analytics:** Page load times, Core Web Vitals
- **Sentry:** Error tracking, stack traces
- **Custom Metrics:** Conversion rates, payment success rates

### Health Checks
- **Database:** Scheduled health check (ping every 5 minutes)
- **S3:** Upload/download test files weekly
- **APIs:** Stripe heartbeat endpoint check daily

---

**Last Updated:** April 2026
**Version:** 1.0 (Phase 1 MVP Architecture)
