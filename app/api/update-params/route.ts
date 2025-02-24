import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { uid, dir, gap, id } = await req.json();

    if (!uid || !id || dir === undefined || gap === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedRecord = await prisma.params.update({
      where: { uid, id },
      data: {
        dir: Number(dir),
        gap: Number(gap),
      },
    });

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
