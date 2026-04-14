import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcryptjs from "bcryptjs";

/**
 * One-time setup endpoint to create initial admin and staff users on production.
 * Protected by SETUP_SECRET environment variable.
 *
 * Usage: POST /api/setup with header "x-setup-secret: <your-secret>"
 *
 * After running successfully, remove SETUP_SECRET from your environment variables
 * to disable this endpoint.
 */
export async function POST(request: NextRequest) {
  try {
    // Require SETUP_SECRET to be configured
    const setupSecret = process.env.SETUP_SECRET;
    if (!setupSecret) {
      return NextResponse.json(
        { success: false, message: "Setup endpoint is disabled. Set SETUP_SECRET env var to enable." },
        { status: 404 }
      );
    }

    // Validate the secret from request header
    const providedSecret = request.headers.get("x-setup-secret");
    if (!providedSecret || providedSecret !== setupSecret) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const adminEmail = (body.adminEmail || "admin@adrautoparts.com").toLowerCase().trim();
    const adminPassword = body.adminPassword || "admin123";
    const staffEmail = (body.staffEmail || "mechanic@adrautoparts.com").toLowerCase().trim();
    const staffPassword = body.staffPassword || "mechanic123";

    const results: Record<string, string> = {};

    // Create admin user
    const existingAdmin = await db.user.findUnique({ where: { email: adminEmail } });
    if (existingAdmin) {
      // Update password hash if it's plain text
      if (!existingAdmin.passwordHash?.startsWith("$2")) {
        const hash = await bcryptjs.hash(adminPassword, 12);
        await db.user.update({
          where: { email: adminEmail },
          data: { passwordHash: hash, role: "ADMIN" },
        });
        results.admin = `Updated ${adminEmail} with hashed password`;
      } else {
        results.admin = `${adminEmail} already exists with hashed password`;
      }
    } else {
      const hash = await bcryptjs.hash(adminPassword, 12);
      await db.user.create({
        data: {
          email: adminEmail,
          name: "Admin",
          passwordHash: hash,
          role: "ADMIN",
        },
      });
      results.admin = `Created admin: ${adminEmail}`;
    }

    // Create staff user
    const existingStaff = await db.user.findUnique({ where: { email: staffEmail } });
    if (existingStaff) {
      // Fix: ensure hashed password + verified
      const updates: Record<string, unknown> = {};
      if (!existingStaff.passwordHash?.startsWith("$2")) {
        updates.passwordHash = await bcryptjs.hash(staffPassword, 12);
      }
      if (!existingStaff.isVerified) {
        updates.isVerified = true;
        updates.verifiedAt = new Date();
        updates.verifiedBy = adminEmail;
      }
      if (Object.keys(updates).length > 0) {
        await db.user.update({
          where: { email: staffEmail },
          data: updates,
        });
        results.staff = `Updated ${staffEmail}: ${Object.keys(updates).join(", ")}`;
      } else {
        results.staff = `${staffEmail} already exists and is verified`;
      }
    } else {
      const hash = await bcryptjs.hash(staffPassword, 12);
      await db.user.create({
        data: {
          email: staffEmail,
          name: "Staff Member",
          passwordHash: hash,
          role: "MECHANIC",
          isVerified: true,
          verifiedAt: new Date(),
          verifiedBy: adminEmail,
        },
      });
      results.staff = `Created staff: ${staffEmail} (verified)`;
    }

    return NextResponse.json({
      success: true,
      message: "Setup complete. Remove SETUP_SECRET from env vars to disable this endpoint.",
      results,
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, message: "Setup failed", error: String(error) },
      { status: 500 }
    );
  }
}
