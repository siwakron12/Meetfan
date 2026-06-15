"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  EMPTY_OPPORTUNITY_PROFILE,
  ProfileInfo,
  getMatchDetails,
  getRecommendations,
} from "@/services/opportunity-service";

export default function RecommendedOpportunities() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileInfo>(EMPTY_OPPORTUNITY_PROFILE);

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

  const recommendations = useMemo(() => getRecommendations(profile), [profile]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Recommended For You</h1>
          <p className="mt-1 text-sm text-gray-500">
            Events and communities picked from your interests.
          </p>
        </div>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500">
          Shared Interests
        </span>
      </div>

      <div className="grid gap-3">
        {recommendations.map((opportunity) => (
          <Link
            key={opportunity.id}
            href={`/opportunities/${opportunity.id}`}
            className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-rose-100 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                  {opportunity.matchScore}% Interest Match
                </span>
                <h2 className="mt-3 text-base font-semibold leading-snug text-gray-900">
                  {opportunity.title}
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                {opportunity.category}
              </span>
            </div>

            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{opportunity.location}</span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              {opportunity.description}
            </p>

            <div className="mt-3 rounded-lg bg-rose-50 p-3">
              <p className="text-xs font-bold text-rose-500">Why?</p>
              <div className="mt-2 grid gap-1">
                {getMatchDetails(opportunity, profile)
                  .reasons.slice(0, 3)
                  .map((reason) => (
                    <p key={reason} className="text-xs font-medium text-gray-600">
                      <span className="font-bold text-emerald-500">✓</span> {reason}
                    </p>
                  ))}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400">
              <BriefcaseBusiness size={13} className="shrink-0" />
              <span>Similar Community</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
