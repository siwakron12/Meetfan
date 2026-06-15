"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  MapPin,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  EMPTY_OPPORTUNITY_PROFILE,
  ProfileInfo,
  getMatchDetails,
  getOpportunityById,
} from "@/services/opportunity-service";

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileInfo>(EMPTY_OPPORTUNITY_PROFILE);
  const [isJoining, setIsJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  const opportunity = getOpportunityById(params.id);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!user) {
        setProfile(EMPTY_OPPORTUNITY_PROFILE);
        return;
      }

      const response = await fetch("/api/users/me/profile", { cache: "no-store" });
      const data = await response.json().catch(() => ({}));

      if (isActive && data.profile) {
        setProfile({
          occupation: data.profile.occupation ?? null,
          interests: Array.isArray(data.profile.interests) ? data.profile.interests : [],
          goals: Array.isArray(data.profile.goals) ? data.profile.goals : [],
        });
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  const match = useMemo(() => {
    return opportunity ? getMatchDetails(opportunity, profile) : null;
  }, [opportunity, profile]);

  async function handleJoinOpportunity() {
    if (!opportunity) return;

    if (!opportunity.relatedEventId) {
      router.push("/Event");
      return;
    }

    if (!user) {
      router.push(`/login?eventId=${encodeURIComponent(opportunity.relatedEventId)}`);
      return;
    }

    setIsJoining(true);
    setJoinMessage(null);

    const response = await fetch(`/api/events/${opportunity.relatedEventId}/join`, {
      method: "POST",
    });
    const data = await response.json().catch(() => ({}));

    setIsJoining(false);

    if (!response.ok) {
      setJoinMessage(data.message || "Could not join event");
      return;
    }

    router.push(`/Event/${opportunity.relatedEventId}`);
  }

  if (!opportunity || !match) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500"
        >
          <ArrowLeft size={16} />
          Back to Recommendations
        </Link>
        <div className="mt-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">Recommendation not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            This recommendation may no longer be available.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-5">
      <Link
        href="/opportunities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-500"
      >
        <ArrowLeft size={16} />
        Back to Recommendations
      </Link>

      <section className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white">
              {match.matchScore}% Interest Match
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900">
              {opportunity.title}
            </h1>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
            {opportunity.category}
          </span>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="shrink-0 text-rose-500" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} className="shrink-0 text-rose-500" />
            <span>{opportunity.organizer}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="shrink-0 text-rose-500" />
            <span>{opportunity.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={16} className="shrink-0 text-rose-500" />
            <span>{opportunity.category}</span>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-gray-600">
          {opportunity.description}
        </p>

        <button
          type="button"
          onClick={handleJoinOpportunity}
          disabled={isJoining}
          className="mt-5 w-full rounded-full bg-rose-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
        >
          {isJoining ? "Joining..." : "Join Event"}
        </button>

        {joinMessage && (
          <p className="mt-3 text-center text-sm font-medium text-rose-500">
            {joinMessage}
          </p>
        )}
      </section>

      <section className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Why This Matches You</h2>
        <p className="mt-1 text-sm text-gray-500">
          Shared interests and people like you also join.
        </p>
        <div className="mt-3 grid gap-2">
          {match.reasons.length > 0 ? (
            match.reasons.map((reason) => (
              <div key={reason} className="flex items-center gap-2 text-sm text-gray-700">
                <Check size={16} className="shrink-0 text-emerald-500" />
                <span>{reason}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Complete your profile to see more specific match reasons.
            </p>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Interest Breakdown</h2>
        <div className="mt-3 grid gap-2">
          {match.breakdown.map((item, index) => (
            <div
              key={`${item.label}-${item.points}-${index}`}
              className="flex items-center gap-3 text-sm text-gray-600"
            >
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="h-px flex-1 bg-gray-100" />
              <span className="font-bold text-gray-900">+{item.points}</span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
            <span className="font-bold text-gray-900">Total Interest Match</span>
            <span className="font-bold text-rose-500">{match.matchScore}%</span>
          </div>
        </div>
      </section>
    </main>
  );
}
