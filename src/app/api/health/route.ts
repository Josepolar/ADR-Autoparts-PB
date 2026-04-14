import { NextResponse } from "next/server";
import { db } from "@/server/db";

/**
 * Health-check endpoint — tests database connectivity.
 * Returns no sensitive data, only connection status.
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + "...",
  };

  try {
    const result = await db.$queryRaw`SELECT 1 as ok`;
    checks.database = "connected";
    checks.queryResult = result;
  } catch (error) {
    checks.database = "failed";
    checks.error = error instanceof Error ? error.message : String(error);
  }

  try {
    const userCount = await db.user.count();
    checks.userCount = userCount;
  } catch (error) {
    checks.userCountError = error instanceof Error ? error.message : String(error);
  }

  return NextResponse.json(checks);
}
