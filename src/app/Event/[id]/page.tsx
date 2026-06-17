"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { calculateInterestMatch } from "@/services/interest-match";

interface ApiEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  posterPng?: string;
  poster_png?: string;
  location: string;
  eventDate: string;
  date?: string;
  time?: string;
  attendeeCount: number;
  joined: boolean;
}

interface Attendee {
  id: string;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  isMe?: boolean;
}

interface ProfilePayload {
  interests: string[];
}

const ATTENDEES: Attendee[] = [
  {
    id: "me",
    name: "Me",
    age: 24,
    avatar: "https://i.pravatar.cc/150?img=47",
    bio: "Ready to meet people with the same interests.",
    isMe: true,
  },
  {
    id: "u1",
    name: "Napasorn",
    age: 23,
    avatar: "https://i.pravatar.cc/150?img=44",
    bio: "Looking for a friendly event buddy.",
  },
  {
    id: "u2",
    name: "Piya",
    age: 26,
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Here for interesting conversations and new communities.",
  },
  {
    id: "u3",
    name: "Mintra",
    age: 22,
    avatar: "https://i.pravatar.cc/150?img=48",
    bio: "Enjoys creative events, cafes, and city walks.",
  },
  {
    id: "u4",
    name: "Teerapat",
    age: 25,
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Always up for learning something new.",
  },
];

function formatDate(event: ApiEvent) {
  const label = [event.date, event.time].filter(Boolean).join(" · ");
  return label || new Date(event.eventDate).toLocaleDateString("th-TH");
}

function getEventPoster(event: ApiEvent) {
  return event.poster_png || event.posterPng || event.imageUrl;
}

function InterestMatchPanel({
  eventTags,
  userInterests,
}: {
  eventTags: string[];
  userInterests: string[];
}) {
  if (userInterests.length === 0) {
    return (
      <div className="mx-4 mt-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">
          Complete your profile to get better matches.
        </p>
      </div>
    );
  }

  const match = calculateInterestMatch(userInterests, eventTags);
  const reasons = [...match.reasons, "People with similar interests joined"];

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
        Interest Match
      </p>
      <h2 className="mt-1 text-xl font-bold text-gray-900">
        {match.score}% Interest Match
      </h2>

      {match.matchedTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {match.matchedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-900">Why?</p>
        <div className="mt-2 space-y-1.5">
          {reasons.map((reason) => (
            <p key={reason} className="flex items-start gap-2 text-sm text-gray-600">
              <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" />
              <span>{reason}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function MatchModal({
  attendees,
  onClose,
}: {
  attendees: Attendee[];
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const candidates = attendees.filter((attendee) => !attendee.isMe);
  const current = candidates[index];
  const isDone = index >= candidates.length;

  const next = () => setIndex((currentIndex) => currentIndex + 1);

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-end justify-center bg-black/40 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[88vh] w-full max-w-sm flex-col overflow-hidden rounded-t-3xl bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Match at this event</h3>
          <button type="button" onClick={onClose} className="text-gray-400">
            <X size={20} />
          </button>
        </div>

        {isDone ? (
          <div className="flex flex-col items-center py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <Heart size={28} className="fill-rose-400 text-rose-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-gray-900">All caught up</p>
            <p className="mt-1 text-sm text-gray-400">
              Liked {liked.length} of {candidates.length} people
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-rose-500 py-3 text-sm font-semibold text-white"
            >
              Back
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={current.avatar}
              alt={current.name}
              className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {current.name}, {current.age}
            </h2>
            <p className="mt-1 px-4 text-center text-sm leading-relaxed text-gray-500">
              {current.bio}
            </p>

            <div className="mt-8 flex gap-6">
              <button
                type="button"
                onClick={next}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md transition-transform active:scale-95"
                aria-label="Pass"
              >
                <X size={28} className="text-gray-400" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setLiked((currentLiked) => [...currentLiked, current.id]);
                  next();
                }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 shadow-md shadow-rose-200 transition-transform active:scale-95"
                aria-label="Like"
              >
                <Heart size={28} className="fill-white text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventAttendees() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [profileInterests, setProfileInterests] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadEvent() {
      const response = await fetch(`/api/events/${eventId}`, { cache: "no-store" });
      const data = await response.json().catch(() => ({}));

      if (isActive) {
        setEvent(data.event ?? null);
      }
    }

    void loadEvent();

    return () => {
      isActive = false;
    };
  }, [eventId]);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      const response = await fetch("/api/users/me/profile", { cache: "no-store" });

      if (!response.ok) {
        if (isActive) setProfileInterests([]);
        return;
      }

      const data = await response.json().catch(() => ({}));
      const profile = data.profile as ProfilePayload | undefined;

      if (isActive) {
        setProfileInterests(Array.isArray(profile?.interests) ? profile.interests : []);
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, []);

  const me = ATTENDEES.find((attendee) => attendee.isMe)!;
  const others = ATTENDEES.filter((attendee) => !attendee.isMe);

  const handleJoinEvent = async () => {
    setIsJoining(true);

    try {
      const response = await fetch(`/api/events/${eventId}/join`, { method: "POST" });

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?eventId=${encodeURIComponent(eventId)}`);
        }
        return;
      }

      setEvent((current) =>
        current
          ? { ...current, joined: true, attendeeCount: current.attendeeCount + 1 }
          : current
      );
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    setIsLeaving(true);

    try {
      const response = await fetch(`/api/events/${eventId}/join`, { method: "DELETE" });

      if (!response.ok) {
        if (response.status === 401) {
          router.push(`/login?eventId=${encodeURIComponent(eventId)}`);
        }
        return;
      }

      setEvent((current) =>
        current
          ? {
              ...current,
              joined: false,
              attendeeCount: Math.max(0, current.attendeeCount - 1),
            }
          : current
      );
      setShowLeaveConfirm(false);
    } finally {
      setIsLeaving(false);
    }
  };

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading event...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="relative mx-auto h-122 w-fit lg:w-full">
        <img src={getEventPoster(event)} alt={event.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <button
          type="button"
          onClick={() => router.back()}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>

        {event.joined && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 shadow">
            <Check size={13} className="text-white" />
            <span className="text-xs font-semibold text-white">Joined</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
            {event.category}
          </span>
          <h1 className="mt-1.5 text-lg font-bold leading-snug drop-shadow">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="bg-white px-5 py-4 shadow-sm">
        <div className="flex flex-col gap-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gray-400" />
            <span>{formatDate(event)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-gray-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={15} className="text-gray-400" />
            <span>{event.attendeeCount} attendees</span>
          </div>
        </div>
      </div>

      <InterestMatchPanel
        eventTags={event.tags ?? []}
        userInterests={profileInterests}
      />

      <div className="mx-4 mt-4">
        {event.joined ? (
          <button
            type="button"
            onClick={() => setShowLeaveConfirm(true)}
            disabled={isLeaving}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-white py-4 text-sm font-bold text-rose-500 shadow-sm transition-transform active:scale-[0.98]"
          >
            <Check size={18} />
            {isLeaving ? "Leaving..." : "Leave Event"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleJoinEvent}
            disabled={isJoining}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 text-sm font-bold text-white shadow-md shadow-rose-200 transition-transform active:scale-[0.98]"
          >
            <Check size={18} />
            {isJoining ? "Joining..." : "Join Event"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowMatch(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 py-4 shadow-md shadow-rose-200 transition-transform active:scale-[0.98]"
        >
          <Heart size={18} className="fill-white text-white" />
          <span className="text-sm font-bold text-white">Match with attendees</span>
          <span className="ml-1 rounded-full bg-white/25 px-2 py-0.5 text-xs font-semibold text-white">
            {others.length}
          </span>
        </button>
      </div>

      <div className="mx-4 mt-5">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Attendees</h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <img
                src={me.avatar}
                alt={me.name}
                className="h-16 w-16 rounded-full border-2 border-rose-400 object-cover"
              />
              <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-white">
                <Check size={10} className="text-white" />
              </div>
            </div>
            <span className="text-[11px] font-semibold text-rose-500">{me.name}</span>
          </div>

          {others.map((attendee) => (
            <div key={attendee.id} className="flex flex-col items-center gap-1.5">
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="h-16 w-16 rounded-full border-2 border-gray-100 object-cover"
              />
              <span className="text-[11px] text-gray-600">{attendee.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-10" />

      {showMatch && (
        <MatchModal attendees={ATTENDEES} onClose={() => setShowMatch(false)} />
      )}

      {showLeaveConfirm && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/40 px-6"
          onClick={() => {
            if (!isLeaving) setShowLeaveConfirm(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <h3 className="text-base font-bold text-gray-900">Leave this event?</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              You will be removed from this event and attendees list.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLeaveConfirm(false)}
                disabled={isLeaving}
                className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLeaveEvent}
                disabled={isLeaving}
                className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {isLeaving ? "Leaving..." : "Leave Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
