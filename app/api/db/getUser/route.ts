import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {wallet} = data;

    const searchDB = await prisma.user.findFirst({
        where: {
            wallet: wallet
        }
    });
    console.log("User found:", searchDB);

    return Response.json({ message: "searched address", receivedData: searchDB });
  } catch (error) {
    console.error("RPC proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    );
  }
}
