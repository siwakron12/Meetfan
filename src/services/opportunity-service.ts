export interface ProfileInfo {
  occupation: string | null;
  interests: string[];
  goals: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  category: string;
  location: string;
  organizer: string;
  date: string;
  description: string;
  imageUrl: string;
  tags: string[];
  relatedEventId?: string;
}

export interface MatchBreakdownItem {
  label: string;
  reason: string;
  points: number;
}

export interface OpportunityScoreBreakdown {
  interests: number;
  goals: number;
  occupation: number;
  total: number;
}

interface ScoredOpportunity extends Opportunity {
  matchScore: number;
  interestScore: number;
  matchedTagCount: number;
}

export const EMPTY_OPPORTUNITY_PROFILE: ProfileInfo = {
  occupation: null,
  interests: [],
  goals: [],
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: "ev007",
    title: "ONE BANGKOK ONE PRIDE ONE RUN 2026",
    category: "Active & Health",
    location: "One Bangkok Park",
    organizer: "One Bangkok",
    date: "7/6/2026",
    description:
      "A city run for people who enjoy movement, wellness, and positive community energy.",
    imageUrl: "/ImgEvent/EV007.jpg",
    tags: ["Running", "Wellness", "Fitness Community"],
    relatedEventId: "active-health-1-one-bangkok-one-pride-one-run-2026",
  },
  {
    id: "ev008",
    title: "Disney Run Thailand 2026",
    category: "Active & Health",
    location: "Rama VIII Bridge",
    organizer: "Disney Thailand",
    date: "16/7/2026",
    description:
      "A themed running event for people who want a fun race-day experience with friends.",
    imageUrl: "/ImgEvent/EV008.jpg",
    tags: ["Running"],
    relatedEventId: "active-health-2-disney-run-thailand-2026",
  },
  {
    id: "ev009",
    title: "BYD HYROX Bangkok 2026",
    category: "Active & Health",
    location: "Queen Sirikit National Convention Center",
    organizer: "hyroxthailand",
    date: "13/8/2026-16/8/2026",
    description:
      "A fitness competition for people who enjoy gym training, endurance, and active communities.",
    imageUrl: "/ImgEvent/EV009.jpg",
    tags: ["Gym", "Fitness Community"],
    relatedEventId: "active-health-3-byd-hyrox-bangkok-2026",
  },
  {
    id: "ev010",
    title: "Together We Ride World Bicycle Day",
    category: "Active & Health",
    location: "Lan Khon Mueang",
    organizer: "Ride & Join",
    date: "6/6/2026",
    description:
      "A cycling community ride through Bangkok for people who enjoy active urban events.",
    imageUrl: "/ImgEvent/EV010.jpg",
    tags: ["Cycling"],
    relatedEventId: "active-health-4-together-we-ride-world-bicycle-day",
  },
  {
    id: "ev011",
    title: "Rajadamnern Muay Thai Night",
    category: "Active & Health",
    location: "Rajadamnern Stadium",
    organizer: "Rajadamnern Stadium",
    date: "everyday",
    description:
      "A live Muay Thai experience for people interested in wellness, sports culture, and local energy.",
    imageUrl: "/ImgEvent/EV011.jpg",
    tags: ["Wellness"],
    relatedEventId:
      "active-health-5-เข-าชมมวย-ณ-สนามเวท-มวยราชด-าเน-น-กร-งเทพ",
  },
  {
    id: "ev012",
    title: "Goat Games 2026",
    category: "Active & Health",
    location: "The PARQ",
    organizer: "Stonegoat Group Co., Ltd.",
    date: "26/6/2026-3/7/2026",
    description:
      "A climbing community event for people who like activities, challenges, and meeting active friends.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Activities", "Community"],
    relatedEventId: "active-health-6-goat-games-2026",
  },
  {
    id: "ev013",
    title: "Flow House Bangkok",
    category: "Active & Health",
    location: "Flow House Bangkok",
    organizer: "A-Square Sukhumvit 26",
    date: "everyday",
    description:
      "A surf-style activity spot for people who enjoy wellness, movement, and social communities.",
    imageUrl: "/ImgEvent/EV013.jpg",
    tags: ["Wellness", "Community"],
    relatedEventId: "active-health-7-flow-house-bangkok",
  },
  {
    id: "ev014",
    title: "Laser Game",
    category: "Active & Health",
    location: "Mansion 7",
    organizer: "Yok Pok Ying",
    date: "everyday",
    description:
      "A group activity for people who enjoy energetic games and fitness-minded communities.",
    imageUrl: "/ImgEvent/EV014.png",
    tags: ["Fitness Community", "Running"],
    relatedEventId: "active-health-8-laser-game",
  },
  {
    id: "ev015",
    title: "Icebath and Sauna",
    category: "Active & Health",
    location: "Secret Garden",
    organizer: "Shining Lotus Co., Ltd.",
    date: "everyday",
    description:
      "A recovery and relaxation experience for people who enjoy sports, entertainment, and wellness routines.",
    imageUrl: "/ImgEvent/EV015.jpg",
    tags: ["Sports", "Entertainment"],
    relatedEventId: "active-health-9-icebath-and-sauna",
  },
  {
    id: "ev016",
    title: "Lumphini Aerobics",
    category: "Active & Health",
    location: "Lumphini Park",
    organizer: "Bangkok",
    date: "everyday",
    description:
      "A casual public aerobics activity for people looking for movement and community.",
    imageUrl: "/ImgEvent/EV016.jpg",
    tags: ["Activities", "Community"],
    relatedEventId: "active-health-10-เต-นแอโรบ-กสวนล-ม",
  },
  {
    id: "ev017",
    title: "BDI Hackathon 2026",
    category: "Founder & Hackathon",
    location: "True Digital Park",
    organizer: "BDI Thailand",
    date: "September 5, 2026",
    description:
      "A builder-focused hackathon for people interested in AI, startups, software development, and product ideas.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Hackathon", "AI", "Startup", "Software Development"],
    relatedEventId: "founder-hackathon-7-bdi-hackathon-2026",
  },
  {
    id: "ev018",
    title: "KBTG Tech Meetup",
    category: "Founder & Hackathon",
    location: "KBTG Building",
    organizer: "KBTG",
    date: "September 12, 2026",
    description:
      "A tech meetup for engineers, students, and product builders exploring software and AI trends.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Software Development", "AI", "Machine Learning", "Hackathon"],
    relatedEventId: "founder-hackathon-8-kbtg-tech-meetup",
  },
  {
    id: "ev019",
    title: "AI Bangkok Meetup",
    category: "Founder & Hackathon",
    location: "Samyan Mitrtown",
    organizer: "Bangkok AI Community",
    date: "September 18, 2026",
    description:
      "A practical AI meetup for people who want to learn, network, and collaborate on machine learning projects.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Hackathon", "AI", "Machine Learning", "Software Development", "Startup"],
    relatedEventId: "founder-hackathon-9-ai-bangkok-meetup",
  },
  {
    id: "ev020",
    title: "Startup Thailand Meetup",
    category: "Founder & Hackathon",
    location: "Queen Sirikit National Convention Center",
    organizer: "Startup Thailand",
    date: "September 24, 2026",
    description:
      "A meetup for founders, marketers, designers, and students looking for startup collaborators.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Hackathon", "Startup", "Business", "Marketing", "Entrepreneurship"],
    relatedEventId: "founder-hackathon-10-startup-thailand-meetup",
  },
  {
    id: "ev021",
    title: "Founder Networking Night",
    category: "Founder & Hackathon",
    location: "True Digital Park",
    organizer: "MeetFan Founder Club",
    date: "October 1, 2026",
    description:
      "A networking night for founders and builders looking for co-founders, collaborators, and community.",
    imageUrl: "/ImgEvent/EV012.png",
    tags: ["Hackathon", "Startup", "Entrepreneurship", "Business", "Product Design"],
    relatedEventId: "founder-hackathon-11-founder-networking-night",
  },
];

export const OPPORTUNITY_IMAGE_MAPPING = MOCK_OPPORTUNITIES.map(
  ({ title, imageUrl }) => ({ title, imageUrl })
);

if (process.env.NODE_ENV !== "production") {
  console.log("OPPORTUNITY_IMAGE_MAPPING", OPPORTUNITY_IMAGE_MAPPING);
}

export function hasRealOpportunityImage(
  opportunity: Pick<Opportunity, "category" | "id" | "imageUrl">
) {
  const imageUrl = opportunity.imageUrl?.trim();
  if (!imageUrl) return false;

  return !(
    opportunity.category === "Founder & Hackathon" &&
    /^ev0?(17|18|19|20|21)$/.test(opportunity.id)
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getMatchedTags(opportunity: Opportunity, profile: ProfileInfo) {
  const userInterests = new Set(profile.interests.map(normalize));
  return opportunity.tags.filter((tag) => userInterests.has(normalize(tag)));
}

function getInterestScore(opportunity: Opportunity, profile: ProfileInfo) {
  if (profile.interests.length === 0) return 0;

  const matchedTags = getMatchedTags(opportunity, profile).length;
  return Math.round((matchedTags / profile.interests.length) * 60);
}

function getMatchedGoals(opportunity: Opportunity, profile: ProfileInfo) {
  return profile.goals.filter((goal) => {
    const normalizedGoal = normalize(goal);

    return (
      (normalizedGoal.includes("hackathon") &&
        opportunity.tags.some((tag) => normalize(tag) === "hackathon")) ||
      (normalizedGoal.includes("startup") &&
        opportunity.tags.some((tag) => normalize(tag) === "startup")) ||
      (normalizedGoal.includes("networking") &&
        opportunity.category === "Founder & Hackathon") ||
      (normalizedGoal.includes("collaboration") &&
        opportunity.category === "Founder & Hackathon") ||
      (normalizedGoal.includes("learn") &&
        opportunity.tags.some((tag) =>
          ["AI", "Machine Learning", "Software Development"].includes(tag)
        )) ||
      (normalizedGoal.includes("career") &&
        opportunity.tags.some((tag) =>
          ["Business", "Marketing", "Software Development"].includes(tag)
        )) ||
      (normalizedGoal.includes("community") &&
        opportunity.tags.some((tag) => normalize(tag) === "community"))
    );
  });
}

function getOccupationField(occupation: string | null) {
  const normalized = normalize(occupation ?? "");
  if (!normalized) return null;

  if (
    normalized.includes("computer") ||
    normalized.includes("software") ||
    normalized.includes("data") ||
    normalized.includes("product") ||
    normalized.includes("ux")
  ) {
    return "Technology";
  }

  if (
    normalized.includes("marketing") ||
    normalized.includes("business") ||
    normalized.includes("founder") ||
    normalized.includes("entrepreneur")
  ) {
    return "Business";
  }

  if (
    normalized.includes("graphic") ||
    normalized.includes("photo") ||
    normalized.includes("content")
  ) {
    return "Creative";
  }

  return "General";
}

function getOccupationScore(opportunity: Opportunity, profile: ProfileInfo) {
  const field = getOccupationField(profile.occupation);
  if (!field) return 0;

  if (
    field === "Technology" &&
    opportunity.tags.some((tag) =>
      [
        "AI",
        "Machine Learning",
        "Software Development",
        "Hackathon",
        "Product Design",
        "UX/UI",
      ].includes(tag)
    )
  ) {
    return 15;
  }

  if (
    field === "Business" &&
    opportunity.tags.some((tag) =>
      ["Startup", "Business", "Marketing", "Entrepreneurship"].includes(tag)
    )
  ) {
    return 15;
  }

  if (
    field === "Creative" &&
    opportunity.tags.some((tag) =>
      ["Photography", "Product Design", "UX/UI", "Activities"].includes(tag)
    )
  ) {
    return 15;
  }

  return 0;
}

export function getScoreBreakdown(
  opportunity: Opportunity,
  profile: ProfileInfo
): OpportunityScoreBreakdown {
  const interests = getInterestScore(opportunity, profile);
  const goals =
    profile.goals.length > 0
      ? Math.round(
          (getMatchedGoals(opportunity, profile).length / profile.goals.length) *
            25
        )
      : 0;
  const occupation = getOccupationScore(opportunity, profile);
  const hasDirectInterestMatch = getMatchedTags(opportunity, profile).length > 0;
  const total = Math.min(
    100,
    Math.max(hasDirectInterestMatch ? 30 : 0, interests + goals + occupation)
  );

  return {
    interests,
    goals,
    occupation,
    total,
  };
}

function hasProfileSignals(profile: ProfileInfo) {
  return (
    profile.interests.length > 0 ||
    profile.goals.length > 0 ||
    Boolean(profile.occupation)
  );
}

export function getOpportunityById(id: string) {
  return MOCK_OPPORTUNITIES.find((opportunity) => opportunity.id === id) ?? null;
}

export function getMatchBreakdown(
  opportunity: Opportunity,
  profile: ProfileInfo
) {
  if (!hasProfileSignals(profile)) return [];

  const matchedTags = getMatchedTags(opportunity, profile);
  const matchedGoals = getMatchedGoals(opportunity, profile);
  const breakdown: MatchBreakdownItem[] = matchedTags.map((tag) => ({
    label: "Interest Match",
    reason: `You like ${tag}`,
    points: profile.interests.length > 0 ? 60 / profile.interests.length : 0,
  }));

  matchedGoals.forEach((goal) => {
    breakdown.push({
      label: "Goal Match",
      reason: `Matches your goal: ${goal}`,
      points: 25 / Math.max(profile.goals.length, 1),
    });
  });

  if (getOccupationScore(opportunity, profile) > 0) {
    breakdown.push({
      label: "Occupation Match",
      reason: "Matches your occupation field",
      points: 15,
    });
  }

  return breakdown;
}

export function calculateMatchScore(
  opportunity: Opportunity,
  profile: ProfileInfo
) {
  if (!hasProfileSignals(profile) || opportunity.tags.length === 0) return 0;

  return getScoreBreakdown(opportunity, profile).total;
}

export function getMatchDetails(
  opportunity: Opportunity,
  profile: ProfileInfo
) {
  const breakdown = getMatchBreakdown(opportunity, profile);
  const scoreBreakdown = getScoreBreakdown(opportunity, profile);
  const matchedTags = getMatchedTags(opportunity, profile);
  const matchedTagSet = new Set(matchedTags.map(normalize));
  const relatedInterestReasons = profile.interests
    .filter((interest) => !matchedTagSet.has(normalize(interest)))
    .filter((interest) =>
      opportunity.tags.some((tag) => {
        const normalizedTag = normalize(tag);
        const normalizedInterest = normalize(interest);
        return (
          normalizedTag.includes(normalizedInterest) ||
          normalizedInterest.includes(normalizedTag)
        );
      })
    )
    .map((interest) => `Matches your ${interest} interests`);
  const reasons = [
    ...breakdown
      .filter((item) => item.label !== "Occupation Match")
      .map((item) => item.reason),
    ...relatedInterestReasons,
    ...(matchedTags.length > 0 ? ["Similar community joined this event"] : []),
  ];

  return {
    matchScore: scoreBreakdown.total,
    breakdown,
    scoreBreakdown,
    reasons,
    matchedTags,
  };
}

export function getRecommendations(profile: ProfileInfo) {
  const scored = MOCK_OPPORTUNITIES.map((opportunity): ScoredOpportunity => ({
    ...opportunity,
    matchScore: calculateMatchScore(opportunity, profile),
    interestScore: getInterestScore(opportunity, profile),
    matchedTagCount: getMatchedTags(opportunity, profile).length,
  })).sort((first, second) => {
    if (second.interestScore !== first.interestScore) {
      return second.interestScore - first.interestScore;
    }

    if (second.matchScore !== first.matchScore) {
      return second.matchScore - first.matchScore;
    }

    return first.title.localeCompare(second.title);
  });
  const matched = scored.filter((opportunity) => opportunity.matchScore > 0);
  const fallback = scored.filter((opportunity) => opportunity.matchScore === 0);
  const recommendations = [...matched, ...fallback];

  return recommendations.slice(0, Math.max(3, Math.min(6, recommendations.length)));
}
