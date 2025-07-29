import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const MinerSchema = z.object({
  uid: z.number(),
  dir: z.string(),
  gap: z.string(),
  dirEth: z.string(),
  gapEth: z.string(),
  dirXAU: z.string(),
  gapXAU: z.string(),
  dirSOL: z.string(),
  gapSOL: z.string(),
  index: z.number(),
  owner: z.string()
});


export async function POST(req: Request) {
  try {
    const jsonData = await req.json();
    const parsedData = MinerSchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { uid, dir, gap, dirEth, gapEth, dirXAU, gapXAU, dirSOL, gapSOL, index, owner } = parsedData.data;

    const miner = await prisma.params.findFirst({
      where: {
        uid
      }
    })

    if (miner) {
      return NextResponse.json({ error: "Miner already exists" }, { status: 500 });
    }

    const createdMiner = await prisma.params.create({
      data: {
        uid,
        dir: JSON.parse(dir),
        gap: Number(gap),
        dirEth: JSON.parse(dirEth),
        gapEth: Number(gapEth),
        dirXAU: JSON.parse(dirXAU),
        gapXAU: Number(gapXAU),
        dirSOL: JSON.parse(dirSOL),
        gapSOL: Number(gapSOL),
        index,
        // @ts-ignore owner is ENUM from the frontend
        owner,
      },
    });

    return NextResponse.json({ success: true, data: createdMiner });
  } catch (error) {
    console.error("Error updating params:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
