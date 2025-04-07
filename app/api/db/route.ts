import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json(); // Parse JSON body
    console.log(data); // Logs { name: 'John Doe', age: 30 }

    return Response.json({ message: "Data received", receivedData: data });
  } catch (error) {
    console.error("RPC proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request" },
      { status: 500 }
    );
  }
}
