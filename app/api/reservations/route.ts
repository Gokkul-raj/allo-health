import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { productId, warehouseId, quantity } = body;

    const result = await prisma.$transaction(
      async (tx) => {
        const inventory = await tx.inventory.findFirst({
          where: {
            productId,
            warehouseId,
          },
        });

        if (!inventory) {
          throw new Error("Inventory not found");
        }

        const availableStock =
          inventory.totalUnits -
          inventory.reservedUnits;

        if (availableStock < quantity) {
          return NextResponse.json(
            {
              error:
                "Not enough stock available",
            },
            { status: 409 }
          );
        }

        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            reservedUnits: {
              increment: quantity,
            },
          },
        });

        const reservation =
          await tx.reservation.create({
            data: {
              inventoryId:
                inventory.id,
              quantity,
              expiresAt: new Date(
                Date.now() +
                  10 * 60 * 1000
              ),
            },
          });

        return reservation;
      },
      {
        isolationLevel:
          "Serializable",
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Reservation failed" },
      { status: 500 }
    );
  }
}