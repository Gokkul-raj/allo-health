import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const warehouses =
      await prisma.warehouse.findMany();

    return NextResponse.json(
      warehouses
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch warehouses",
      },
      { status: 500 }
    );
  }
}