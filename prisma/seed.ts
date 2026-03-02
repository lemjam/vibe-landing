import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const lead1 = await prisma.lead.create({
    data: {
      name: "Алексей Иванов",
      contact: "aleksey@example.com",
      consent: true,
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Мария Петрова",
      contact: "+7 900 123-45-67",
      consent: true,
    },
  });

  await prisma.conversionEvent.createMany({
    data: [
      { type: "landing_view", metadata: { source: "seed" } },
      { type: "cta_click", metadata: { section: "hero" } },
      { type: "lead_created", metadata: { leadId: lead1.id } },
    ],
  });

  console.log("Seed completed: 2 leads, 3 conversion events.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
