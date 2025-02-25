import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const MinerSchema = z.object({
  uid: z.number(),
  dir: z.string().min(1, "Direction is required").transform((val) => JSON.parse(val)),
  gap: z.string(),
  index: z.number() // Assuming index is optional
});


export async function POST(req: Request) {
  try {
    const jsonData = await req.json();
    const parsedData = MinerSchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { uid, dir, gap, index } = parsedData.data;

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
        index,
      },
    });

    return NextResponse.json({ success: true, data: createdMiner });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
