import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const mockUsers = JSON.parse(
  await readFile(path.join(rootDir, "src", "data", "mock-community.json"), "utf8")
);
const legacyEmails = [1, 2, 3].map((number) => `user${number}@gmail.com`);
legacyEmails.push("arm@arm.arm");

const events = [
  {
    id: "evt-001",
    title: "One Piece Pop-up Cafe in Thailand",
    description:
      "A fan meetup event around One Piece at ICONSIAM with exhibition, cafe, and photo spots.",
    category: "Exhibition / Art / Fan Event",
    imageUrl: "/ImgEvent/one_piece.jpg",
    location: "Attraction Hall Floor 6, ICONSIAM",
    latitude: 13.726694,
    longitude: 100.510498,
    eventDate: new Date("2026-10-31T12:00:00.000Z"),
  },
  {
    id: "evt-003",
    title: "Street Food Night Market",
    description: "Meet people who enjoy local street food and night markets.",
    category: "Food / Market",
    imageUrl: "/ImgEvent/one_piece.jpg",
    location: "The Commons Thonglor",
    latitude: 13.7309,
    longitude: 100.5825,
    eventDate: new Date("2026-07-04T12:00:00.000Z"),
  },
  {
    id: "evt-004",
    title: "Startup Pitch Night Bangkok",
    description: "A meetup for startup builders, designers, and product people.",
    category: "Business / Technology",
    imageUrl: "/ImgEvent/one_piece.jpg",
    location: "True Digital Park",
    latitude: 13.6856,
    longitude: 100.6112,
    eventDate: new Date("2026-06-28T12:00:00.000Z"),
  },
];

const CATEGORY_BY_FILE = {
  "active-health.csv": "Active & Health",
  "art-exhibition.csv": "Art & Exhibition",
  "founder-hackathon.csv": "Founder & Hackathon",
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim().length > 0)) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    if (row.some((value) => value.trim().length > 0)) rows.push(row);
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => header.trim()).filter(Boolean);
  return rows.slice(1).map((values) =>
    headers.reduce((record, header, index) => {
      record[header] = (values[index] ?? "").trim();
      return record;
    }, {})
  );
}

function slugify(value) {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "event";
}

async function loadCsvEventIds() {
  const eventDir = path.join(rootDir, "src", "data", "events");
  const fileNames = (await readdir(eventDir))
    .filter((fileName) => fileName.toLowerCase().endsWith(".csv"))
    .sort();
  const eventIds = [];

  for (const fileName of fileNames) {
    const text = await readFile(path.join(eventDir, fileName), "utf8");
    const rows = parseCsv(text);
    rows.forEach((row, index) => {
      const title = row.title?.trim();
      if (!title) return;

      const category =
        row.category?.trim() || CATEGORY_BY_FILE[fileName] || "Event";
      eventIds.push(`${slugify(category)}-${index + 1}-${slugify(title)}`);
    });
  }

  return eventIds;
}

async function main() {
  const seedPasswordHash = await bcrypt.hash("password123", 12);
  const csvEventIds = await loadCsvEventIds();
  const existingParticipantEventIds = await prisma.eventParticipant.findMany({
    distinct: ["eventId"],
    select: { eventId: true },
  });
  const eventIds = Array.from(
    new Set([
      ...csvEventIds,
      ...existingParticipantEventIds.map((participant) => participant.eventId),
    ])
  );

  await prisma.user.upsert({
    where: { email: "host@meetfan.local" },
    update: {
      age: 24,
      district: "Pathum Wan",
      occupation: "Computer Science Student",
      interests: JSON.stringify(["AI", "Hackathon", "Product Design"]),
      goals: JSON.stringify(["Find Hackathon Team", "Networking"]),
    },
    create: {
      name: "MeetFan Host",
      email: "host@meetfan.local",
      passwordHash: seedPasswordHash,
      age: 24,
      district: "Pathum Wan",
      occupation: "Computer Science Student",
      interests: JSON.stringify(["AI", "Hackathon", "Product Design"]),
      goals: JSON.stringify(["Find Hackathon Team", "Networking"]),
    },
  });

  const savedUsers = [];

  for (const [index, mockUser] of mockUsers.entries()) {
    const profile = {
      name: `${mockUser.firstName} ${mockUser.lastName}`,
      email: `${mockUser.firstName.toLowerCase()}@meetfan.mock`,
      passwordHash: seedPasswordHash,
      age: mockUser.age,
      district: mockUser.district,
      occupation: mockUser.occupation,
      interests: JSON.stringify(mockUser.interests),
      goals: JSON.stringify(mockUser.goals),
    };
    const legacyEmail = legacyEmails[index];
    const legacyUser = legacyEmail
      ? await prisma.user.findUnique({ where: { email: legacyEmail } })
      : null;
    const user = legacyUser
      ? await prisma.user.update({
          where: { id: legacyUser.id },
          data: profile,
        })
      : await prisma.user.upsert({
          where: { email: profile.email },
          update: profile,
          create: { id: mockUser.id, ...profile },
        });

    savedUsers.push(user);
  }

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: event,
      create: event,
    });
  }

  await prisma.$executeRawUnsafe("PRAGMA foreign_keys = OFF");
  for (const eventId of eventIds) {
    for (const user of savedUsers) {
      await prisma.eventParticipant.upsert({
        where: { userId_eventId: { userId: user.id, eventId } },
        update: {},
        create: { userId: user.id, eventId },
      });
    }
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
