import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { wallet } = data;

    const bridge = await prisma.bridges.findMany({
      where: {
        user: {
          wallet: wallet,
        },
      },
    });

    console.log("bridge data", bridge);

    const serialized = bridge.map((b) => ({
      ...b,
      amountInWei: b.amountInWei.toString(),
    }));

    return Response.json({
      message: "bridge data sent",
      receivedData: serialized,
    });
  } catch (error) {
    console.error("error getting bridge:", error);
    return NextResponse.json(
      { error: "failed to get bridge" },
      { status: 500 }
    );
  }
}
