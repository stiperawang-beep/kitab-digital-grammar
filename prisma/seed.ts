import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_TENSES = [
  {
    name: "Simple Present",
    purpose: "Menyatakan kebiasaan, fakta umum, atau tindakan berulang di masa sekarang.",
    formulaParts: ["S", "V1 (s/es)"],
    notes: "She reads every morning.\nWater boils at 100°C.\nHe walks to school.",
    order: 1,
  },
  {
    name: "Present Continuous",
    purpose: "Menyatakan aksi yang sedang berlangsung sekarang atau di sekitar periode saat ini.",
    formulaParts: ["S", "am/is/are", "V-ing"],
    notes: "She is reading a book right now.\nThey are working on a project this week.",
    order: 2,
  },
  {
    name: "Present Perfect",
    purpose: "Menyatakan aksi yang telah selesai pada waktu yang tidak ditentukan sebelum sekarang.",
    formulaParts: ["S", "have/has", "V3"],
    notes: "I have visited Paris.\nShe has already eaten.\nWe have just finished the task.",
    order: 3,
  },
  {
    name: "Present Perfect Continuous",
    purpose: "Menyatakan aksi yang dimulai di masa lalu dan masih berlangsung atau baru saja selesai.",
    formulaParts: ["S", "have/has been", "V-ing"],
    notes: "I have been studying for three hours.\nShe has been waiting since noon.",
    order: 4,
  },
  {
    name: "Simple Past",
    purpose: "Menyatakan aksi yang telah selesai pada waktu tertentu di masa lalu.",
    formulaParts: ["S", "V2"],
    notes: "He walked to school yesterday.\nThey visited London last summer.",
    order: 5,
  },
  {
    name: "Past Continuous",
    purpose: "Menyatakan aksi yang sedang berlangsung pada momen tertentu di masa lalu.",
    formulaParts: ["S", "was/were", "V-ing"],
    notes: "She was reading when I called.\nThey were playing football at 5 PM.",
    order: 6,
  },
  {
    name: "Past Perfect",
    purpose: "Menyatakan aksi yang selesai sebelum aksi lain di masa lalu.",
    formulaParts: ["S", "had", "V3"],
    notes: "He had left before I arrived.\nShe had finished her work by midnight.",
    order: 7,
  },
  {
    name: "Past Perfect Continuous",
    purpose: "Menyatakan aksi berkelanjutan yang berlangsung sebelum aksi lain di masa lalu.",
    formulaParts: ["S", "had been", "V-ing"],
    notes: "She had been working for five hours before she took a break.",
    order: 8,
  },
  {
    name: "Simple Future",
    purpose: "Menyatakan aksi yang akan terjadi di masa depan.",
    formulaParts: ["S", "will", "V1"],
    notes: "I will travel to Japan next year.\nShe will call you tomorrow.",
    order: 9,
  },
  {
    name: "Future Continuous",
    purpose: "Menyatakan aksi yang akan sedang berlangsung pada waktu tertentu di masa depan.",
    formulaParts: ["S", "will be", "V-ing"],
    notes: "This time tomorrow, I will be flying to London.\nShe will be presenting at noon.",
    order: 10,
  },
  {
    name: "Future Perfect",
    purpose: "Menyatakan aksi yang akan selesai sebelum waktu tertentu di masa depan.",
    formulaParts: ["S", "will have", "V3"],
    notes: "By next year, I will have graduated.\nShe will have finished by 6 PM.",
    order: 11,
  },
  {
    name: "Future Perfect Continuous",
    purpose: "Menyatakan aksi berkelanjutan yang akan selesai pada waktu tertentu di masa depan.",
    formulaParts: ["S", "will have been", "V-ing"],
    notes: "By June, I will have been studying English for ten years.",
    order: 12,
  },
];

async function main() {
  console.log("🌱 Seeding the Kitab database...");

  // Clear existing
  await prisma.tense.deleteMany();

  for (const t of SEED_TENSES) {
    await prisma.tense.create({
      data: {
        name: t.name,
        purpose: t.purpose,
        formulaParts: JSON.stringify(t.formulaParts),
        notes: t.notes,
        order: t.order,
      },
    });
  }

  const count = await prisma.tense.count();
  console.log(`✦ ${count} tenses inscribed in the Kitab.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
