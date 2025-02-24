import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request,
  { params }: { params: { uid: string } }) {
  try {
    const { uid } = params;

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    const records = await prisma.params.findFirst({
      where: { uid: Number(uid) }, // Convert to number if uid is stored as INT
    });

    if (!records) {
      return NextResponse.json({ error: "No records found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error("Error fetching params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
