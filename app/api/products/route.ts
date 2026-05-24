import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    // Release expired reservations automatically
    const expiredReservations =
      await prisma.reservation.findMany({
        where: {
          status: "PENDING",
          expiresAt: {
            lt: new Date(),
          },
        },
      });

    for (const reservation of expiredReservations) {
      await prisma.$transaction(async (tx) => {

        // Restore stock
        await tx.inventory.update({
          where: {
            id: reservation.inventoryId,
          },
          data: {
            reservedUnits: {
              decrement:
                reservation.quantity,
            },
          },
        });

        // Mark reservation as released
        await tx.reservation.update({
          where: {
            id: reservation.id,
          },
          data: {
            status: "RELEASED",
          },
        });
      });
    }

    // Fetch products
    const products =
      await prisma.product.findMany({
        include: {
          inventories: {
            include: {
              warehouse: true,
            },
          },
        },
      });

    const formattedProducts =
      products.map((product) => ({
        id: product.id,
        name: product.name,
        description:
          product.description,
        stock:
          product.inventories.map(
            (inventory) => ({
              warehouseId:
                inventory.warehouse.id,
              warehouseName:
                inventory.warehouse
                  .name,
              availableStock:
                inventory.totalUnits -
                inventory.reservedUnits,
            })
          ),
      }));

    return NextResponse.json(
      formattedProducts
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}