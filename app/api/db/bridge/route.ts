import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { hash, amountInWei, status, wallet } = data;

    const bridge = await prisma.bridges.create({
      data: {
        hash: hash,
        amountInWei: amountInWei,
        status: status,
        claimed: false,
        user: {
          connect: {
            wallet: wallet,
          },
        },
      },
    });

    console.log("User created successfully:", bridge);
    return Response.json({
      message: "bridge created",
      receivedData: {
        ...bridge,
        amountInWei: bridge.amountInWei.toString(),
      },
    });
  } catch (error) {
    console.error("error creating bridge:", error);
    return NextResponse.json(
      { error: "failed to create bridge" },
      { status: 500 }
    );
  }
}
