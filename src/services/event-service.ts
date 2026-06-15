import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const eventSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  imageUrl: true,
  location: true,
  latitude: true,
  longitude: true,
  eventDate: true,
  createdAt: true,
  participants: {
    select: { userId: true },
  },
} satisfies Prisma.EventSelect;

function serializeEvent(
  event: Prisma.EventGetPayload<{ select: typeof eventSelect }>,
  userId?: string
) {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    category: event.category,
    imageUrl: event.imageUrl,
    location: event.location,
    latitude: event.latitude,
    longitude: event.longitude,
    eventDate: event.eventDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    attendeeCount: event.participants.length,
    joined: userId
      ? event.participants.some((participant) => participant.userId === userId)
      : false,
  };
}

export async function listEvents(userId?: string) {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    select: eventSelect,
  });

  return events.map((event) => serializeEvent(event, userId));
}

export async function getEvent(eventId: string, userId?: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: eventSelect,
  });

  return event ? serializeEvent(event, userId) : null;
}

export async function joinEvent(userId: string, eventId: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  await prisma.eventParticipant.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: {},
    create: { userId, eventId },
  });

  return { joined: true };
}

export async function leaveEvent(userId: string, eventId: string) {
  await prisma.eventParticipant.deleteMany({
    where: { userId, eventId },
  });

  return { joined: false };
}

export async function listJoinedEvents(userId: string) {
  const participants = await prisma.eventParticipant.findMany({
    where: { userId },
    orderBy: { joinedAt: "desc" },
    include: {
      event: {
        select: eventSelect,
      },
    },
  });

  return participants.map((participant) => ({
    ...serializeEvent(participant.event, userId),
    joinedAt: participant.joinedAt.toISOString(),
  }));
}
