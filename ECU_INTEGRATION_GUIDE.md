# ECU Services - Integration Guide

## System Overview

This document explains how all the ECU services components work together.

```
┌─────────────────────────────────────────────────────────┐
│               ADR Autoparts - ECU Services              │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
    ┌─────────┐         ┌─────────┐       ┌──────────┐
    │ AutoECU │         │ Upload  │       │  Admin   │
    │ Catalog │         │ Tuning  │       │Dashboard │
    └────┬────┘         └────┬────┘       └────┬─────┘
         │                   │                 │
         └───────────────────┼─────────────────┘
                    Downloads│Uploads│Management
                             │
                    ┌────────▼────────┐
                    │  User/Session   │
                    │  JWT Auth Token │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────┐
                    │   API Routes      │
                    │ (Auth Validation) │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │    Database       │
                    │  (FirmwareFile)   │
                    └───────────────────┘
```

---

## Component Interactions

### 1. User Download Flow

```
User Visit: /autoecu
      │
      ▼
┌─────────────────────┐
│ AutoECU Client      │
│ (autoecu-client.tsx)│ ← Displays firmware catalog
└──────────┬──────────┘
           │
        [Click Download]
           │
           ▼
    ┌──────────────────────┐
    │ handleDownload()      │ ← Checks session.user.id
    └──────────┬───────────┘
               │
        ┌──────┴──────┐
    No ▼              ▼ Yes
   Login?         Paid?
    ▲              │
    │         ┌────┴─────┐
    │      No ▼          ▼ Yes
    │    Payment      Download
    │    Required       File
    │         │          │
    └─────────┼──────────┘
```

**Code Path:**
```typescript
// src/app/autoecu/autoecu-client.tsx
async function handleDownload(fileId, fileName, price) {
  if (!session?.user?.id) {
    router.push("/auth/signin");
    return;
  }
  
  const result = await initiateFirmwareDownload(fileId, userId);
  
  if (result.success) {
    // User already paid - download immediately
    downloadFile(result.data.downloadUrl);
  } else if (result.error === "PAYMENT_REQUIRED") {
    // Not paid - redirect to checkout
    sessionStorage.setItem("firmwareCheckout", {...});
    router.push(`/checkout?type=firmware&fileId=${fileId}`);
  }
}
```

---

### 2. User Upload Flow

```
User Visit: /autoecu/upload
      │
      ▼
┌─────────────────────────┐
│ Upload Form Component   │
│ (autoecu-upload-form)   │
└──────────┬──────────────┘
           │
    [Select Vehicle ECU File]
           │
           ▼
    ┌──────────────────┐
    │ POST /api/upload │ ← API Route
    │     /firmware    │
    └──────────┬───────┘
               │
         ┌─────▼──────┐
    JWT │  Auth Check │ ← Extract userId from cookie
    ▲   └─────┬──────┘
    │         │
    │    ┌────▼─────┐
    │    │  Store   │
    │    │ In DB    │
    │    └────┬─────┘
    │         │
    │         ▼
    │    Create
    │    ImmoRequest
    └─────────┘
```

**Code Path:**
```typescript
// src/app/api/upload/firmware/route.ts
export async function POST(request: NextRequest) {
  // 1. Extract JWT from authToken cookie
  const token = request.cookies.get("authToken")?.value;
  const verified = await jwtVerify(token, JWT_SECRET);
  const userId = verified.payload.id;
  
  // 2. Verify user exists
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  
  // 3. Process file
  const formData = await request.formData();
  const file = formData.get("file");
  
  // 4. Create ImmoRequest
  await db.immoRequest.create({
    data: {
      userId,
      vehicleId,
      status: "PENDING_UPLOAD",
      basePrice: 2500,
    }
  });
}
```

---

### 3. Admin Firmware Management Flow

```
Admin Visit: /admin
      │
      ▼
┌─────────────────────┐
│ Admin Dashboard     │
│ (admin/page.tsx)    │
└──────────┬──────────┘
           │
      [Navigate: Firmware]
           │
           ▼
    ┌──────────────────────┐
    │ Firmware Tab Content │ ← Shows firmware list
    └──────────┬───────────┘
               │
        [Click: + Upload]
               │
               ▼
      ┌────────────────────┐
      │  Modal Opens       │
      │ (firmware-upload-  │
      │  modal.tsx)        │
      └────────┬───────────┘
               │
        [Fill Form]
        - fileName
        - fileUrl (S3)
        - fileHash
        - price
        - version
        - status
               │
         [Submit]
               │
               ▼
      ┌────────────────────┐
      │ createFirmwareFile()│ ← Server Action
      └────────┬───────────┘
               │
      ┌────────▼──────────┐
      │ Store in Database │
      │ (FirmwareFile)    │
      └────────┬──────────┘
               │
               ▼
      File appears in catalog
```

**Code Path:**
```typescript
// src/components/admin/firmware-upload-modal.tsx
async function handleSubmit(e) {
  const formData = {
    fileName: "Stage1_Tuned.bin",
    fileUrl: "https://s3.amazonaws.com/...",
    fileHash: "sha256hash...",
    price: 2500,
    version: "v1.0",
    status: "TUNED",
    fileSizeBytes: 262144,
    description: "Performance tuned"
  };
  
  const result = await createFirmwareFile(formData);
  if (result.success) {
    onSuccess(); // Modal closes
  }
}
```

---

### 4. Admin Tuning Request Management

```
Admin Dashboard: Tuning Requests Tab
      │
      ▼
┌──────────────────────────┐
│ List of User Requests    │
│ (ImmoRequest records)    │
└──────────┬───────────────┘
           │
   ┌───────┴────────┐
   │                │
   ▼                ▼
[PENDING_UPLOAD]  [READY_FOR_DOWNLOAD]
   │                │
   │           [Download completed
   │            by customer]
   │
   ▼
Admin processes request:
1. Reviews stock ECU
2. Uploads tuned version to S3
3. Updates status to READY_FOR_DOWNLOAD
   │
   ▼
Customer sees in /autoecu/requests:
- Request status changed
- Download button appears
- Can now download tuned file
```

---

## Database Schema (Relevant)

```sql
-- Firmware Catalog
FirmwareFile {
  id           String      @id @default(cuid())
  fileName     String      -- e.g., "Stage1_Tuned_BMW.bin"
  fileUrl      String      -- S3 URL
  fileHash     String      -- SHA256 for verification
  price        Decimal     -- Cost in PHP
  version      String      -- e.g., "v1.0"
  status       String      -- STOCK | TUNED | CUSTOM
  fileSizeBytes Int        -- For display
  description  String      -- What the firmware does
  createdAt    DateTime
  updatedAt    DateTime
}

-- User Tuning Requests
ImmoRequest {
  id             String      @id
  userId         String      @relation(User)
  vehicleId      String      @relation(Vehicle)
  stockFileId    String?     @relation(FirmwareFile) -- Original
  modifiedFileId String?     @relation(FirmwareFile) -- After tuning
  status         String      -- PENDING_UPLOAD | PROCESSING | READY_FOR_DOWNLOAD
  basePrice      Decimal     -- Admin-set price
  createdAt      DateTime
  updatedAt      DateTime
}
```

---

## Authentication Flow

### Session Management

```
1. User Signs In: /auth/signin
   - Email + Password
   - CredentialsProvider authenticates
   - JWT Token created
   - Token stored in authToken cookie

2. Client-Side Session (React)
   - SessionProvider at root (app/layout.tsx)
   - useSession() hook accesses session
   - session.user.id available in components

3. Server-Side Session (API Routes)
   - Extract JWT from authToken cookie
   - Verify with jwtVerify()
   - Extract userId from JWT payload
   - Use for database operations
```

### Cookie Details

```typescript
// Set on signin (signin/route.ts or similar)
response.cookies.set({
  name: "authToken",
  value: jwt_token,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60  // 30 days
});

// Read in API route (/api/upload/firmware/route.ts)
const token = request.cookies.get("authToken")?.value;
const verified = await jwtVerify(token, JWT_SECRET);
const userId = verified.payload.id;
```

---

## Error Handling

### User Upload

```
Scenarios:
1. Not logged in
   → 401: "User not authenticated"
   
2. Token expired
   → 401: "Invalid or expired token"
   
3. File missing
   → 400: "Missing required fields"
   
4. Duplicate pending request
   → 400: "You already have a pending upload..."
   
5. Server error
   → 500: "Internal server error"
```

### Download

```
Scenarios:
1. Not logged in
   → Toast: "Please create an account or sign in"
   → Redirect: /auth/signin
   
2. Not paid
   → Toast: "Please complete payment"
   → Redirect: /checkout?type=firmware&fileId={id}
   
3. Already paid
   → Download immediately
   → Toast: "Download started successfully"
   
4. File not found
   → Toast: "File not available"
   → Show error badge
```

---

## Testing Strategy

### Unit Tests (Recommended)
```typescript
// Test JWT verification
test('extracts userId from valid JWT', () => {
  const token = generateTestJWT();
  const verified = jwtVerify(token, SECRET);
  expect(verified.payload.id).toBeDefined();
});

// Test download logic
test('redirects to signin when not authenticated', () => {
  // component without session
  // click download
  // expect navigation to /auth/signin
});
```

### Integration Tests
```typescript
// Test upload flow
test('complete upload workflow', async () => {
  // 1. Sign in
  // 2. Navigate to upload
  // 3. Select file
  // 4. Upload
  // 5. Verify ImmoRequest created
});

// Test download flow
test('download with payment check', async () => {
  // 1. Sign in
  // 2. Go to AutoECU
  // 3. Click download on unpaid file
  // 4. Verify checkout redirect
});
```

### Manual Testing
1. Test all scenarios from ECU_FIXES_FINAL_STATUS.md
2. Verify JWT cookie is set/cleared properly
3. Test with different user roles (user, admin)
4. Test with expired sessions
5. Verify error messages display correctly

---

## Deployment Checklist

- [ ] Verify NEXTAUTH_SECRET in production
- [ ] Confirm S3 bucket credentials configured
- [ ] Test JWT signing/verification with production secret
- [ ] Verify cookie settings for production domain
- [ ] Test payment flow end-to-end
- [ ] Monitor error logs for auth failures
- [ ] Backup database before going live
- [ ] Test firmware download with real files
- [ ] Verify email notifications working (if enabled)

---

## Troubleshooting

### Issue: "User not found" when uploading
**Solution:** Check authToken cookie is present
```bash
# In browser DevTools
document.cookie  // Look for authToken

# In server logs
console.log(request.cookies.getAll())
```

### Issue: Download redirects to signin even when logged in
**Solution:** Check session is hydrated
```typescript
// Ensure SessionProvider wraps component
// And useSession() is called after mount
useEffect(() => {
  if (session) { ... }
}, [session]);
```

### Issue: Payment redirect not working
**Solution:** Verify checkout page handles firmware params
```typescript
// Check /checkout page accepts type=firmware param
const type = searchParams.get('type');
const fileId = searchParams.get('fileId');
```

---

## Performance Considerations

1. **JWT Verification:** ~1-2ms per request
2. **Database Queries:** Indexed on userId, status
3. **File Download:** Stream from S3 to avoid memory issues
4. **Admin Modal:** Client-side form validation before submit
5. **Toast Notifications:** 3-second timeout to prevent spam

---

## Security Notes

✅ **What's Implemented:**
- JWT authentication on API routes
- User ID validation before operations
- No hardcoded user IDs
- Password hashing with bcryptjs
- HTTPS-only cookies in production

⚠️ **What's Recommended:**
- Rate limiting on upload endpoint
- File upload size limits
- S3 bucket policies restrict access
- Payment verification on download
- Audit logging for admin actions

---

## Quick Links

- **Admin Dashboard:** `/admin`
- **Firmware Catalog:** `/autoecu`
- **Upload Page:** `/autoecu/upload`
- **User Requests:** `/autoecu/requests`
- **Checkout:** `/checkout`
- **Sign In:** `/auth/signin`

