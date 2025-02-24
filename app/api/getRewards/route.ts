import {  NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://taomarketcap.com/api/subnets/50/metagraph", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache"
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
  }
}
