"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  EMPTY_OPPORTUNITY_PROFILE,
  Opportunity,
  ProfileInfo,
  getMatchDetails,
  getRecommendations,
  hasRealOpportunityImage,
} from "@/services/opportunity-service";

const TEXT = {
  title: "\u0e41\u0e19\u0e30\u0e19\u0e33\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e04\u0e38\u0e13",
  subtitle: "\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21\u0e41\u0e25\u0e30\u0e04\u0e2d\u0e21\u0e21\u0e39\u0e19\u0e34\u0e15\u0e35\u0e49\u0e17\u0e35\u0e48\u0e04\u0e31\u0e14\u0e21\u0e32\u0e43\u0e2b\u0e49\u0e15\u0e23\u0e07\u0e01\u0e31\u0e1a\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e19\u0e43\u0e08\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13",
  badge: "\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e19\u0e43\u0e08\u0e17\u0e35\u0e48\u0e15\u0e23\u0e07\u0e01\u0e31\u0e19",
  noRecommendations: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e33\u0e41\u0e19\u0e30\u0e19\u0e33\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e04\u0e38\u0e13",
  noRecommendationsDescription: "\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e19\u0e43\u0e08\u0e41\u0e25\u0e30\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e44\u0e1f\u0e25\u0e4c \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e43\u0e2b\u0e49 MeetFan \u0e41\u0e19\u0e30\u0e19\u0e33\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21\u0e17\u0e35\u0e48\u0e15\u0e23\u0e07\u0e01\u0e31\u0e1a\u0e04\u0e38\u0e13\u0e21\u0e32\u0e01\u0e02\u0e36\u0e49\u0e19",
  profileButton: "\u0e44\u0e1b\u0e15\u0e31\u0e49\u0e07\u0e04\u0e48\u0e32\u0e42\u0e1b\u0e23\u0e44\u0e1f\u0e25\u0e4c",
  noMatchingEvents: "\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e1e\u0e1a\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21\u0e17\u0e35\u0e48\u0e15\u0e23\u0e07\u0e01\u0e31\u0e1a\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e19\u0e43\u0e08\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13",
  noMatchingEventsDescription: "\u0e25\u0e2d\u0e07\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e19\u0e43\u0e08\u0e2b\u0e23\u0e37\u0e2d\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22\u0e43\u0e19\u0e42\u0e1b\u0e23\u0e44\u0e1f\u0e25\u0e4c\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e31\u0e1a\u0e04\u0e33\u0e41\u0e19\u0e30\u0e19\u0e33\u0e17\u0e35\u0e48\u0e41\u0e21\u0e48\u0e19\u0e22\u0e33\u0e02\u0e36\u0e49\u0e19",
  similarCommunity: "\u0e04\u0e2d\u0e21\u0e21\u0e39\u0e19\u0e34\u0e15\u0e35\u0e49\u0e17\u0e35\u0e48\u0e04\u0e25\u0e49\u0e32\u0e22\u0e01\u0e31\u0e19",
  joinDescription: "\u0e04\u0e38\u0e13\u0e15\u0e49\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e40\u0e02\u0e49\u0e32\u0e23\u0e48\u0e27\u0e21\u0e01\u0e34\u0e08\u0e01\u0e23\u0e23\u0e21\u0e19\u0e35\u0e49\u0e2b\u0e23\u0e37\u0e2d\u0e44\u0e21\u0e48?",
};

function OpportunityImage({ opportunity, sizes }: { opportunity: Opportunity; sizes: string }) {
  if (!hasRealOpportunityImage(opportunity)) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-rose-50 text-center">
        <div>
          <CalendarDays size={24} className="mx-auto text-rose-300" />
          <p className="mt-1 text-[10px] font-medium leading-tight text-gray-500">No Event Image</p>
        </div>
      </div>
    );
  }

  return <Image src={opportunity.imageUrl} alt={opportunity.title} fill sizes={sizes} className="object-cover" />;
}

export default function RecommendedOpportunities() {
  const { user } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo>(EMPTY_OPPORTUNITY_PROFILE);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinResult, setJoinResult] = useState<{ title: string; message: string; eventId?: string } | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProfile() {
      if (!user) {
        setProfile(EMPTY_OPPORTUNITY_PROFILE);
        setIsProfileLoading(false);
        return;
      }

      setIsProfileLoading(true);
      try {
        const response = await fetch("/api/users/me/profile", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));

        if (isActive && data.profile) {
          setProfile({
            occupation: data.profile.occupation ?? null,
            interests: Array.isArray(data.profile.interests) ? data.profile.interests : [],
            goals: Array.isArray(data.profile.goals) ? data.profile.goals : [],
          });
        }
      } finally {
        if (isActive) setIsProfileLoading(false);
      }
    }

    void loadProfile();

    return () => {
      isActive = false;
    };
  }, [user]);

  const recommendations = useMemo(() => getRecommendations(profile), [profile]);
  const hasPersonalization = profile.interests.length > 0 || profile.goals.length > 0;
  const isProfileIncomplete = profile.interests.length === 0;
  const visibleRecommendations = useMemo(
    () => recommendations.filter((opportunity) => {
      const matchDetails = getMatchDetails(opportunity, profile);
      return opportunity.matchScore > 0 && matchDetails.reasons.length > 0;
    }),
    [profile, recommendations]
  );

  const handleJoinClick = (opportunity: Opportunity) => {
    setJoinResult(null);
    setSelectedOpportunity(opportunity);
  };

  const handleConfirmJoin = async () => {
    if (!selectedOpportunity) return;

    if (!selectedOpportunity.relatedEventId) {
      setJoinResult({ title: "Join Event", message: "This opportunity is not ready for direct joining yet." });
      setSelectedOpportunity(null);
      return;
    }

    if (!user) {
      router.push("/login?eventId=" + encodeURIComponent(selectedOpportunity.relatedEventId));
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch("/api/events/" + selectedOpportunity.relatedEventId + "/join", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?eventId=" + encodeURIComponent(selectedOpportunity.relatedEventId));
          return;
        }
        throw new Error(data.message || "Could not join this event");
      }

      setJoinResult({ title: "Joined Successfully", message: "You are now part of this event community.", eventId: selectedOpportunity.relatedEventId });
      setSelectedOpportunity(null);
    } catch (error) {
      setSelectedOpportunity(null);
      setJoinResult({ title: "Join Event", message: error instanceof Error ? error.message : "Could not join this event. Please try again." });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{TEXT.title}</h1>
          <p className="mt-1 text-sm text-gray-500">{TEXT.subtitle}</p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">{TEXT.badge}</span>
      </div>

      {!isProfileLoading && !hasPersonalization ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <BriefcaseBusiness size={24} className="text-rose-400" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">{TEXT.noRecommendations}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{TEXT.noRecommendationsDescription}</p>
          <Link href="/profile" className="mt-5 inline-flex rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-600">{TEXT.profileButton}</Link>
        </div>
      ) : null}

      {!isProfileLoading && isProfileIncomplete ? (
        <div className="mb-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">Add goals and occupation to improve match accuracy.</div>
      ) : null}

      {!isProfileLoading && hasPersonalization && visibleRecommendations.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <BriefcaseBusiness size={24} className="text-rose-400" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-gray-900">{TEXT.noMatchingEvents}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">{TEXT.noMatchingEventsDescription}</p>
          <Link href="/profile" className="mt-5 inline-flex rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-600">{TEXT.profileButton}</Link>
        </div>
      ) : null}

      <div className="grid gap-3">
        {hasPersonalization && visibleRecommendations.map((opportunity) => {
          const matchDetails = getMatchDetails(opportunity, profile);
          return (
            <article key={opportunity.id} className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-rose-100 hover:shadow-md">
              <div className="flex gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-rose-50 sm:h-20 sm:w-20">
                  <OpportunityImage opportunity={opportunity} sizes="80px" />
                  <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">{opportunity.matchScore}%</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold leading-snug text-gray-900 group-hover:text-rose-600">{opportunity.title}</h2>
                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">{opportunity.category}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{opportunity.location}</span>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-600">{opportunity.description}</p>

              <div className="mt-3 rounded-lg bg-rose-50 p-3">
                <p className="text-xs font-bold text-rose-500">Why we recommend this?</p>
                <div className="mt-2 grid gap-1">
                  {matchDetails.reasons.slice(0, 3).map((reason) => (
                    <p key={reason} className="text-xs font-medium text-gray-600">
                      <span className="font-bold text-emerald-500">?</span>{" "}{reason}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400">
                <BriefcaseBusiness size={13} className="shrink-0" />
                <span>{TEXT.similarCommunity}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={"/opportunities/" + opportunity.id} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50">View Detail</Link>
                <button type="button" onClick={() => handleJoinClick(opportunity)} className="flex-1 rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">Join Event</button>
              </div>
            </article>
          );
        })}
      </div>

      {selectedOpportunity ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Join Event</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{TEXT.joinDescription}</p>
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600">{selectedOpportunity.title}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => setSelectedOpportunity(null)} disabled={isJoining} className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
              <button type="button" onClick={handleConfirmJoin} disabled={isJoining} className="flex-1 rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300">{isJoining ? "Joining..." : "Join Event"}</button>
            </div>
          </div>
        </div>
      ) : null}

      {joinResult ? (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">{joinResult.eventId ? "?" : "!"}</div>
            <h2 className="mt-4 text-lg font-bold text-gray-900">{joinResult.eventId ? "Joined Successfully" : joinResult.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{joinResult.message}</p>
            <div className="mt-5 grid gap-2">
              {joinResult.eventId ? (
                <button type="button" onClick={() => router.push("/Event/" + joinResult.eventId)} className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">Start Matching</button>
              ) : null}
              <button type="button" onClick={() => setJoinResult(null)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
