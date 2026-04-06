# Database Setup Guide

## Quick Start: Supabase (Recommended)

Supabase is the easiest option - free PostgreSQL database with no Docker setup:

### Steps:
1. **Create Supabase Account** → https://supabase.com
   - Click "New Project"
   - Name it "ADR-Autoparts"
   - Save your password (you'll need it)

2. **Get Connection String**
   - Go to Project Settings (bottom left)
   - Click Database → Connection pooling
   - Copy the connection string that looks like:
     ```
     postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
     ```

3. **Update .env.local**
   - Replace the DATABASE_URL with your Supabase connection string
   - Make sure to replace `[PASSWORD]` with the actual password

4. **Run Setup**
   ```bash
   npm run db:push
   npm run db:seed
   ```

## Alternative: PostgreSQL on Windows

If you prefer local PostgreSQL without Docker:

1. Download PostgreSQL Installer: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Create a new database named `adr_autoparts`
4. Update .env.local:
   ```
   DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/adr_autoparts"
   ```
5. Run: `npm run db:push && npm run db:seed`

## Troubleshooting

If connection fails:
- Check your connection string for typos
- Ensure password doesn't have special characters (URL encode if needed)
- Test connection: `npm run db:push` will show the exact error

## Next Steps After DB Setup

Once database is connected:
```bash
npm run db:seed          # Populate with sample data
npm run dev             # Start development server
```

Then visit: http://localhost:3000
