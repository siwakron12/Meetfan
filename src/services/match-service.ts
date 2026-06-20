// services/match-service.ts
import { prisma } from "@/lib/prisma";
import { findCsvEvent } from "@/services/event-data";
import { calculateProfileMatch } from "@/services/match-engine";
import { getMockAvatar } from "@/services/mock-community";

function orderPair(idOne: string, idTwo: string): [string, string] {
  return idOne < idTwo ? [idOne, idTwo] : [idTwo, idOne];
}

function parseList(value: string | null | undefined) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export async function getSwipeCandidates(eventId: string, userId: string) {
  const myParticipation = await prisma.eventParticipant.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (!myParticipation) {
    throw new Error("NOT_JOINED");
  }

  const [currentUser, alreadySwiped, csvEvent] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        occupation: true,
        interests: true,
        goals: true,
      },
    }),
    prisma.swipe.findMany({
      where: { eventId, fromUserId: userId },
      select: { toUserId: true },
    }),
    findCsvEvent(eventId),
  ]);

  if (!currentUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const swipedIds = alreadySwiped.map((s) => s.toUserId);
  const currentProfile = {
    occupation: currentUser.occupation,
    interests: parseList(currentUser.interests),
    goals: parseList(currentUser.goals),
  };

  const participants = await prisma.eventParticipant.findMany({
    where: {
      eventId,
      userId: { notIn: [userId, ...swipedIds] },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          age: true,
          district: true,
          occupation: true,
          interests: true,
          goals: true,
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return participants.map((p) => {
    const profile = {
      occupation: p.user.occupation,
      interests: parseList(p.user.interests),
      goals: parseList(p.user.goals),
    };
    const match = calculateProfileMatch(
      currentProfile,
      profile,
      csvEvent?.title
    );

    return {
      id: p.user.id,
      name: p.user.name,
      age: p.user.age,
      district: p.user.district,
      occupation: p.user.occupation,
      interests: profile.interests,
      goals: profile.goals,
      avatar: getMockAvatar({
        id: p.user.id,
        email: p.user.email,
        name: p.user.name,
      }),
      joinedAt: p.joinedAt,
      matchScore: match.score,
      matchReasons: match.reasons,
      matchBreakdown: match.breakdown,
    };
  }).sort((first, second) => second.matchScore - first.matchScore);
}

export async function swipeUser(params: {
  eventId: string;
  fromUserId: string;
  toUserId: string;
  liked: boolean;
}) {
  const { eventId, fromUserId, toUserId, liked } = params;

  if (fromUserId === toUserId) {
    throw new Error("CANNOT_SWIPE_SELF");
  }

  const [fromJoined, toJoined] = await Promise.all([
    prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId: fromUserId, eventId } },
    }),
    prisma.eventParticipant.findUnique({
      where: { userId_eventId: { userId: toUserId, eventId } },
    }),
  ]);

  if (!fromJoined || !toJoined) {
    throw new Error("NOT_JOINED");
  }

  await prisma.swipe.upsert({
    where: {
      eventId_fromUserId_toUserId: { eventId, fromUserId, toUserId },
    },
    update: { liked },
    create: { eventId, fromUserId, toUserId, liked },
  });

  if (!liked) {
    return { liked: false, matched: false };
  }

  const reciprocal = await prisma.swipe.findUnique({
    where: {
      eventId_fromUserId_toUserId: {
        eventId,
        fromUserId: toUserId,
        toUserId: fromUserId,
      },
    },
  });

  if (!reciprocal?.liked) {
    return { liked: true, matched: false };
  }

  // mutual like -> สร้าง Match
  const [userAId, userBId] = orderPair(fromUserId, toUserId);

  const [upserted, csvEvent] = await Promise.all([
    prisma.match.upsert({
      where: { eventId_userAId_userBId: { eventId, userAId, userBId } },
      update: {},
      create: { eventId, userAId, userBId },
      include: {
        userA: { select: { id: true, name: true } },
        userB: { select: { id: true, name: true } },
      },
    }),
    findCsvEvent(eventId), // ดึง event จาก CSV แทน DB relation
  ]);

  const match = {
    id: upserted.id,
    event: csvEvent
      ? { id: csvEvent.id, title: csvEvent.title, imageUrl: csvEvent.imageUrl }
      : { id: eventId, title: "", imageUrl: "" },
    userA: upserted.userA,
    userB: upserted.userB,
  };

  return { liked: true, matched: true, match };
}

export async function listMyMatches(userId: string) {
  const [currentUser, matches] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        occupation: true,
        interests: true,
        goals: true,
      },
    }),
    prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true,
            occupation: true,
            district: true,
            interests: true,
            goals: true,
          },
        },
        userB: {
          select: {
            id: true,
            name: true,
            email: true,
            age: true,
            occupation: true,
            district: true,
            interests: true,
            goals: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!currentUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const currentProfile = {
    occupation: currentUser.occupation,
    interests: parseList(currentUser.interests),
    goals: parseList(currentUser.goals),
  };

  // ดึง event ทั้งหมดที่ match อ้างถึงจาก CSV
  const { loadCsvEvents } = await import("@/services/event-data");
  const csvEvents = await loadCsvEvents();
  const eventById = new Map(csvEvents.map((e) => [e.id, e]));

  return matches.map((m) => {
    const otherUser = m.userAId === userId ? m.userB : m.userA;
    const csvEvent = eventById.get(m.eventId);
    const otherProfile = {
      occupation: otherUser.occupation,
      interests: parseList(otherUser.interests),
      goals: parseList(otherUser.goals),
    };
    const matchDetails = calculateProfileMatch(
      currentProfile,
      otherProfile,
      csvEvent?.title
    );

    return {
      id: m.id,
      event: csvEvent
        ? { id: csvEvent.id, title: csvEvent.title, imageUrl: csvEvent.imageUrl }
        : { id: m.eventId, title: "", imageUrl: "" },
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        age: otherUser.age,
        occupation: otherUser.occupation,
        district: otherUser.district,
        avatar: getMockAvatar({
          id: otherUser.id,
          email: otherUser.email,
          name: otherUser.name,
        }),
      },
      matchScore: matchDetails.score,
      matchBreakdown: matchDetails.breakdown,
      matchReasons: matchDetails.reasons,
      sharedInterests: matchDetails.sharedInterests,
      sharedGoals: matchDetails.sharedGoals,
      createdAt: m.createdAt,
    };
  });
}
