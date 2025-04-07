import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {wallet} = data;

    const createUser = await prisma.user.create({
        data: {
            wallet: wallet,
        }
    });

    console.log("User created successfully:", createUser);

    return Response.json({ message: "user created", receivedData: createUser });
  } catch (error) {
    console.error("error creating user:", error);
    return NextResponse.json(
      { error: "failed to create user" },
      { status: 500 }
    );
  }
}
