# Vercel + Supabase Production Setup Guide

## ✅ Step 1: Database Ready

Your Supabase database is fully configured and seeded with:
- **4 test users** (Admin, Mechanic, 2 Customers)
- **2 sample vehicles** with ECU data
- **2 firmware files** with pricing
- **3 parts** with inventory  
- **3 services** & **2 bays** for booking
- **Sample appointment** data

### Test Credentials
```
Admin:    admin@adr-autoparts.com / admin123
Mechanic: mechanic@adr-autoparts.com / mechanic123
Customer: customer1@example.com / customer123
```

## 🎯 Step 2: Add Environment Variables to Vercel

### Quick Method (Recommended)
1. Go to https://vercel.com/dashboard
2. Click your **adr-autoparts**... project
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** in left sidebar
5. Click **"Add New"** button

### Add Each Variable:

**1. DATABASE_URL**
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://postgres.xeimbdwswjcwvocbmgyn:Josefern_360~%21@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres`
- **Environments:** Select ✓ Production, Preview, Development
- Click **"Save"**

**2. NEXTAUTH_SECRET**
- **Name:** `NEXTAUTH_SECRET`
- **Value:** `vzRz95e3dyQpb4E22reuo8sqld+uq+CCo1DerFKs1vY=`
- **Environments:** Select ✓ Production, Preview, Development
- Click **"Save"**

**3. NEXTAUTH_URL**
- **Name:** `NEXTAUTH_URL`
- **Value:** Replace with your Vercel domain:
  - Find in Vercel Dashboard → Project Overview
  - Looks like: `https://adr-autoparts-pb.vercel.app`
  - Use: `https://adr-autoparts-pb.vercel.app`
- **Environments:** Select ✓ Production
- Click **"Save"**

**4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** (optional for now)
- **Name:** `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- **Value:** `pk_test_` (from your Stripe dashboard)
- **Environments:** Select all
- Click **"Save"**

**5. STRIPE_SECRET_KEY** (optional for now)
- **Name:** `STRIPE_SECRET_KEY`
- **Value:** `sk_test_` (from your Stripe dashboard)
- **Environments:** Select all
- Click **"Save"**

**6. STRIPE_WEBHOOK_SECRET** (optional for now)
- **Name:** `STRIPE_WEBHOOK_SECRET`
- **Value:** `whsec_` (from Stripe webhooks)
- **Environments:** Select all
- Click **"Save"**

## 🚀 Step 3: Redeploy Application

1. Go back to Vercel project
2. Click **"Deployments"** tab (next to Settings)
3. Find your latest deployment (top of list)
4. Click the **"..."** menu on the right
5. Select **"Redeploy"**
6. Click **"Yes, redeploy"** to confirm

Wait **2-3 minutes** for deployment to complete.

## ✅ Step 4: Verify Production App

1. Go to https://adr-autoparts-pb.vercel.app (or your domain)
2. Try navigating to `/auth/signin`
3. Attempt login with test credentials:
   ```
   Email: admin@adr-autoparts.com
   Password: admin123
   ```

### Success Indicators ✓
- ✓ Page loads without 500 errors
- ✓ Styling renders correctly
- ✓ Auth forms appear
- ✓ Login succeeds with test credentials
- ✓ Dashboard loads

### Troubleshooting ⚠️

**Issue: "Database connection failed"**
- ❌ Likely: Vercel env vars not saved correctly
- ✓ Fix: Double-check DATABASE_URL in Vercel settings (no typos)
- ✓ Redeploy again

**Issue: "NEXTAUTH_SECRET not provided"**
- ❌ Likely: NEXTAUTH_SECRET env var missing
- ✓ Fix: Add NEXTAUTH_SECRET to Vercel → Redeploy

**Issue: "Can't reach database server"**
- ❌ Likely: Wrong DATABASE_URL (using old pooler endpoint)
- ✓ Fix: Verify pooler is `aws-1-ap-northeast-2.pooler.supabase.com:5432`
- ✓ Double-check password encoding: `Josefern_360~%21`

**Issue: Auth page loads but login fails**
- ❌ Likely: Passwords in database are plain text (dev mode)
- ✓ Fix: Use test credentials as-is (will work in dev)
- ✓ Future: Implement password hashing in production

## 📊 Database Connection Details

**Supabase Project Reference:** `xeimbdwswjcwvocbmgyn`
**Region:** Northeast Asia (Seoul)
**Pooler Type:** Shared IPv4 Pooler
**Pooler Host:** `aws-1-ap-northeast-2.pooler.supabase.com:5432`
**User:** `postgres.xeimbdwswjcwvocbmgyn`

## 🔐 Environment Variable Reference

| Variable | Purpose | Required |
|----------|---------|----------|
| `DATABASE_URL` | Supabase PostgreSQL connection | ✓ Yes |
| `NEXTAUTH_SECRET` | JWT signing key | ✓ Yes |
| `NEXTAUTH_URL` | Auth callback domain | ✓ Yes (prod) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ○ No (for now) |
| `STRIPE_SECRET_KEY` | Stripe secret key | ○ No (for now) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature | ○ No (for now) |
| `AWS_*` | AWS S3 credentials | ○ No (for now) |

## 🎯 Next Steps

1. **✅ Complete:** Database setup
2. **➜ Next:** Verify Vercel deployment works
3. **After:** Configure Stripe for payment processing
4. **Then:** Set up AWS S3 for file uploads
5. **Later:** Implement remaining Phase 1 features

---

**Last Updated:** April 8, 2026
**Status:** Ready for Production Deployment
**Next Deployment:** After adding Vercel environment variables

