import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.warehouse.deleteMany();

  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: "Mumbai Warehouse",
      location: "Mumbai",
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: "Bangalore Warehouse",
      location: "Bangalore",
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "Wireless Headphones",
      description: "Noise cancelling headphones",
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Gaming Mouse",
      description: "RGB gaming mouse",
    },
  });

  await prisma.inventory.createMany({
    data: [
      {
        productId: product1.id,
        warehouseId: warehouse1.id,
        totalUnits: 20,
      },
      {
        productId: product1.id,
        warehouseId: warehouse2.id,
        totalUnits: 15,
      },
      {
        productId: product2.id,
        warehouseId: warehouse1.id,
        totalUnits: 10,
      },
      {
        productId: product2.id,
        warehouseId: warehouse2.id,
        totalUnits: 8,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });