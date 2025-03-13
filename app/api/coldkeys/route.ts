import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const ColdkeySchema = z.object({
  coldkey: z.string()
});


export async function POST(req: Request) {
  try {
    const jsonData = await req.json();
    const parsedData = ColdkeySchema.safeParse(jsonData);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.format() }, { status: 400 });
    }

    const { coldkey } = parsedData.data;


    const foundColdkey = await prisma.coldkeys.findFirst({
      where: {
        coldkey: coldkey?.toLowerCase()
      }
    })

    if (foundColdkey) {
      return NextResponse.json({ error: "Coldkey already exists" }, { status: 500 });
    }

    const createdColdkey = await prisma.coldkeys.create({
      data: {
        coldkey: coldkey?.toLowerCase(),
      },
    });

    return NextResponse.json({ success: true, data: createdColdkey });
  } catch (error) {
    console.error("Error creating coldkeys:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
