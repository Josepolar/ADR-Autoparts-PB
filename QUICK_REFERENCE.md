# ADR Autoparts - Developer Quick Reference

## 🚀 Getting Started (5 minutes)

```bash
# 1. Clone the repo (already at): c:\xampp\htdocs\ADR-Autoparts-PB
cd c:\xampp\htdocs\ADR-Autoparts-PB

# 2. Copy environment file and fill in your credentials
cp .env.local.example .env.local
# Edit .env.local with Stripe keys, database URL, etc.

# 3. Install dependencies
npm install

# 4. Setup database
npm run db:migrate
npm run db:seed     # Optional: Load sample data

# 5. Start development
npm run dev         # Open http://localhost:3000
```

---

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server (watches for changes)
npm run build            # Build for production
npm run start            # Run production build locally

# Database
npm run db:migrate       # Create/update database schema
npm run db:push          # Apply schema changes (direct)
npm run db:seed          # Load sample data
npm run db:studio        # Open visual database editor

# Code Quality
npm run lint             # Check code style
npm run type-check       # TypeScript type checking
npm test                 # Run tests

# Other
npm list                 # Show installed packages
npm update               # Update dependencies
npm audit                # Check for security vulnerabilities
```

---

## 🗂️ Where to Find Things

### Creating a New Feature
1. **Create pages:** `src/app/feature-name/`
2. **Create components:** `src/components/feature-name/`
3. **Add schemas:** Update `src/lib/validators.ts`
4. **Add types:** Update `src/types/index.ts`
5. **Database:** Update `prisma/schema.prisma` → `npm run db:migrate`

### Adding a New Database Model
```prisma
// 1. Add to prisma/schema.prisma
model MyModel {
  id    String  @id @default(cuid())
  name  String
  createdAt DateTime @default(now())
}

// 2. Create migration
npm run db:migrate

// 3. Add TypeScript type to src/types/index.ts
export interface MyModelRecord { ... }

// 4. Create server action in src/server/
export async function createMyModel(data: MyModelInput) { ... }
```

### Adding Form Validation
```tsx
// 1. Add schema to src/lib/validators.ts
export const myFormSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
});

// 2. Use in component
import { myFormSchema, type MyFormInput } from "@/lib/validators";

async function handleSubmit(data: MyFormInput) {
  // Zod automatically validates
}
```

---

## 🔐 Authentication & Authorization

### Check User Role in Component
```tsx
"use client";
import { useSession } from "next-auth/react";
import { hasAnyRole } from "@/lib/auth-utils";

export function AdminOnly() {
  const { data: session } = useSession();
  
  if (!hasAnyRole(session?.user?.role, ["ADMIN"])) {
    return <div>Access denied</div>;
  }
  
  return <AdminPanel />;
}
```

### Protect API Route
```ts
// src/app/api/admin/route.ts
import { auth } from "@/server/auth";

export async function POST(req: Request) {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }
  
  // Admin-only logic
}
```

### Protect Page Route
```tsx
// src/app/admin/page.tsx
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";

export default async function AdminPage() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }
  
  return <AdminDashboard />;
}
```

---

## 🎨 Styling with Tailwind

### Using Custom Colors
```tsx
// Neo-Industrial colors available:
// - cyber-blue-50 to cyber-blue-900 (#00D4FF primary)
// - nardo-gray-50 to nardo-gray-900 (#6D6E71 primary)
// - vivid-amber-50 to vivid-amber-900 (#FFB400 primary)

<button className="bg-cyber-blue text-nardo-gray-900">Click Me</button>
<div className="border border-nardo-gray-700 bg-nardo-gray-800">Card</div>
<div className="shadow-glow-blue">Glowing element</div>
```

### Pre-built Component Classes
```tsx
// Use these custom classes defined in globals.css:
<button className="btn-primary">Primary Button</button>
<button className="btn-secondary">Secondary Button</button>
<button className="btn-amber">Amber CTA</button>

<div className="card">Card component</div>
<input className="input" placeholder="Input field" />
<span className="badge badge-success">Success</span>
<h2 className="section-heading">Heading</h2>
```

---

## 🔑 Environment Variables (.env.local)

### Required Fields
```env
# Database (required)
DATABASE_URL="postgresql://user:pass@localhost:5432/adr_autoparts"

# NextAuth (required)
NEXTAUTH_SECRET="<random-32-char-string>"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# AWS S3 (required for file storage)
AWS_S3_BUCKET="adr-autoparts-files"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
```

### Optional Fields (Phase 2/3)
```env
# Philippine Gateways (Phase 3)
GCASH_API_KEY="test-key"
MAYA_API_KEY="test-key"

# Email (future)
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PASSWORD="..."
```

---

## 🧪 Testing

### Unit Test Example
```ts
// src/__tests__/utils.test.ts
import { calculateDiscount } from "@/lib/utils";

describe("calculateDiscount", () => {
  it("should calculate 10% discount correctly", () => {
    const result = calculateDiscount(1000, 10);
    expect(result).toBe(100);
  });
});
```

### Run Tests
```bash
npm test                # Run once
npm run test:watch      # Run in watch mode
npm test -- --coverage  # With coverage report
```

---

## 📊 Database Schema Diagram (Simplified)

```
User
├─ id, email, role (CUSTOMER|MECHANIC|ADMIN)
│
├─ Vehicle (many)
│  ├─ id, year, make, model, vin
│  └─ ECU (many)
│     ├─ id, ecuType, manufacturer
│     └─ FirmwareFile (many)
│        ├─ id, fileName, fileUrl (S3)
│        └─ price, status (STOCK|TUNED|CUSTOM)
│
├─ Order (many)
│  ├─ id, orderNumber, totalAmount
│  ├─ OrderItem (1-n)
│  │  └─ partId | firmwareFileId
│  └─ Payment
│     └─ method (STRIPE|GCASH|MAYA)
│
└─ Appointment (many)
   ├─ id, status, scheduledStart/End
   ├─ Service → name, basePrice
   └─ Bay → location, capacity
```

---

## 🚨 Debugging Tips

### Check TypeScript Errors
```bash
npm run type-check
# Review errors and fix type mismatches
```

### Check Database Connection
```bash
npm run db:studio
# Opens Prisma Studio - visual DB editor
# If it connects, DB is working
```

### Check Authentication
Open DevTools → Application → Cookies → `next-auth.session-token`  
Should contain a JWT token

### Debug Prisma Queries
In `.env.local`:
```env
# Add to see SQL queries
SQL_LOG=true
```

Then check console when running `npm run dev`

---

## 🔗 Linking to Pages/Resources

### Client-Side Navigation
```tsx
import Link from "next/link";

<Link href="/parts">Browse Parts</Link>
<Link href="/admin/inventory">Inventory</Link>
```

### Programmatic Navigation
```tsx
import { useRouter } from "next/navigation";

export function MyComponent() {
  const router = useRouter();
  return (
    <button onClick={() => router.push("/checkout")}>
      Continue to Checkout
    </button>
  );
}
```

---

## 💾 Saving & Committing Code

```bash
# Stage changes
git add src/

# Commit with semantic message
git commit -m "feat: add user authentication"
git commit -m "fix: resolve checkout button issue"
git commit -m "refactor: simplify payment logic"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Semantic Commit Types
- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code cleanup (no new features)
- `style:` — Formatting only
- `docs:` — Documentation only
- `test:` — Tests only
- `chore:` — Dependencies, config

---

## 📖 Key Documentation Files

| File | Read When |
|------|-----------|
| README.md | You want project overview |
| SETUP.md | Setting up local environment |
| ARCHITECTURE.md | Understanding system design |
| HANDOFF.md | Starting Phase 1 development |
| This file | You need quick reference |

---

## ⚡ Performance Tips

- Use `next/image` for images (auto-optimization)
- Lazy load heavy components: `React.lazy()`
- Use Server Components by default (no JS)
- Use Client Components only for interactivity
- Keep API routes fast (<100ms ideally)
- Page cache with `revalidate` in Server Components

---

## 💬 Getting Help

1. **Installation issue?** → Check SETUP.md
2. **Architecture question?** → Check ARCHITECTURE.md
3. **Can't find something?** → Check this quick reference
4. **TypeScript error?** → Run `npm run type-check`
5. **Database issue?** → Run `npm run db:studio`
6. **Keep debugging?** → Check browser DevTools & error messages

---

**Last Updated:** April 6, 2026  
**For more info, see:** README.md, SETUP.md, ARCHITECTURE.md
