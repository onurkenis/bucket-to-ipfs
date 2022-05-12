import { PrismaClient } from "../src/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data");
  // Now we can use prisma to create our initial entities.
  await prisma.personEntity.create({
    data: {
      first_name: "Onur",
      last_name: "Kenis",
    },
  });

  console.log("Seeded data");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Complete!");
    process.exit(0);
  });
