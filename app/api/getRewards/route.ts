import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.dev.taomarketcap.com/internal/v1/subnets/neurons/50", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-cache"
    });
    // const response = await fetch("https://taoxnet.io/api/v1/netuid/metagraph?network=mainnet", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   cache: "no-cache",
    //   body: JSON.stringify({
    //     netuid: 50,
    //   }),
    // });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message || "Internal Server Error" });
  }
}
