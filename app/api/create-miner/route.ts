import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { uid, dir, gap } = await req.json();

    if (!uid || dir === undefined || gap === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const miner = await prisma.params.findFirst({
      where: {
        uid
      }
    })

    if(miner) {
      return NextResponse.json({ error: "Miner already exists" }, { status: 500 });
    }

    const createdMiner = await prisma.params.create({
      data: {
        uid,
        dir: JSON.parse(dir),
        gap: Number(gap),
      },
    });

    return NextResponse.json({ success: true, data: createdMiner });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
