import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const vehicleId = formData.get("vehicleId") as string;
    const ecuName = formData.get("ecuName") as string;

    if (!file || !vehicleId || !ecuName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // For now, use a test user ID (in production, get from session)
    const userId = "test-user-1";

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }

    // Read file to compute hash (for duplicate detection)
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const fileHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Check if this file already exists
    const existingRequest = await db.immoRequest.findFirst({
      where: {
        userId: userId,
        status: "PENDING_UPLOAD",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, message: "You already have a pending upload. Please wait for processing." },
        { status: 400 }
      );
    }

    // Create ImmoRequest record (admin will process and create modified file)
    const immoRequest = await db.immoRequest.create({
      data: {
        userId: userId,
        vehicleId: vehicleId,
        status: "PENDING_UPLOAD",
        basePrice: 2500,
        discount: 0,
        totalPrice: 2500,
      },
    });

    console.log(`File uploaded: ${file.name} (Hash: ${fileHash}, Size: ${file.size})`);
    console.log(`ImmoRequest created: ${immoRequest.id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Firmware uploaded successfully. Admin will process within 24 hours.",
        uploadId: immoRequest.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
