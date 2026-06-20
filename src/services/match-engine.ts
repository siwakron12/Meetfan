import { OCCUPATION_GROUPS } from "@/services/profile-options";

type MatchProfile = {
  occupation?: string | null;
  interests?: string[];
  goals?: string[];
};

const OCCUPATION_FIELDS = [
  {
    label: "Technology",
    keywords: [
      "technology",
      "software",
      "developer",
      "engineer",
      "programmer",
      "computer science",
      "data",
      "ai",
      "machine learning",
      "cyber",
      "it",
    ],
  },
  {
    label: "Business",
    keywords: [
      "business",
      "founder",
      "startup",
      "product",
      "marketing",
      "sales",
      "venture",
      "entrepreneur",
      "manager",
    ],
  },
  {
    label: "Creative",
    keywords: [
      "design",
      "designer",
      "creative",
      "content",
      "photography",
      "video",
      "motion",
      "artist",
    ],
  },
  {
    label: "Community",
    keywords: [
      "community",
      "teacher",
      "educator",
      "mentor",
      "speaker",
      "volunteer",
      "nonprofit",
    ],
  },
  {
    label: "Health & Lifestyle",
    keywords: ["health", "fitness", "wellness", "coach", "trainer", "yoga"],
  },
] as const;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueValues(values: string[] | undefined) {
  return Array.from(
    new Map(
      (values ?? [])
        .filter((value): value is string => typeof value === "string")
        .map((value): [string, string] => [normalize(value), value.trim()])
        .filter(([key, value]) => key.length > 0 && value.length > 0)
    ).values()
  );
}

function sharedValues(left: string[] | undefined, right: string[] | undefined) {
  const leftValues = uniqueValues(left);
  const rightByKey = new Map(
    uniqueValues(right).map((value) => [normalize(value), value])
  );

  return leftValues.filter((value) => rightByKey.has(normalize(value)));
}

function similarity(left: string[] | undefined, right: string[] | undefined) {
  const leftCount = uniqueValues(left).length;
  const rightCount = uniqueValues(right).length;

  if (leftCount === 0 || rightCount === 0) return 0;

  return Math.round(
    (sharedValues(left, right).length / Math.min(leftCount, rightCount)) * 100
  );
}

function occupationField(occupation?: string | null) {
  const normalized = normalize(occupation ?? "");
  if (!normalized) return null;
  const occupationGroup = OCCUPATION_GROUPS.find((group) =>
    group.options.some((option) => normalize(option) === normalized)
  );

  if (occupationGroup) return occupationGroup.label;

  return (
    OCCUPATION_FIELDS.find((field) =>
      field.keywords.some((keyword) => normalized.includes(keyword))
    )?.label ?? null
  );
}

function occupationSimilarity(current?: string | null, candidate?: string | null) {
  const currentValue = normalize(current ?? "");
  const candidateValue = normalize(candidate ?? "");

  if (!currentValue || !candidateValue) return 0;
  if (currentValue === candidateValue) return 100;

  const currentField = occupationField(current);
  const candidateField = occupationField(candidate);
  return currentField && currentField === candidateField ? 70 : 0;
}

function goalReason(goal: string) {
  if (goal.startsWith("Find ")) {
    return `Both looking for ${goal.replace(/^Find /, "")}`;
  }

  if (goal === "Networking") {
    return "Both want to network";
  }

  if (goal === "Learn New Skills") {
    return "Both want to learn new skills";
  }

  if (goal === "Join Community") {
    return "Both want to join a community";
  }

  if (goal === "Career Opportunities") {
    return "Both exploring career opportunities";
  }

  if (goal === "Collaboration") {
    return "Both open to collaboration";
  }

  return `Both want ${goal}`;
}

export function calculateProfileMatch(
  currentUser: MatchProfile,
  candidate: MatchProfile,
  sharedEventTitle?: string
) {
  const matchedInterests = sharedValues(
    currentUser.interests,
    candidate.interests
  );
  const matchedGoals = sharedValues(currentUser.goals, candidate.goals);
  const interestScore = similarity(currentUser.interests, candidate.interests);
  const goalScore = similarity(currentUser.goals, candidate.goals);
  const occupationScore = occupationSimilarity(
    currentUser.occupation,
    candidate.occupation
  );
  const currentField = occupationField(currentUser.occupation);
  const candidateField = occupationField(candidate.occupation);

  const score = Math.round(
    interestScore * 0.5 + goalScore * 0.3 + occupationScore * 0.2
  );
  const interestReasons = matchedInterests.map(
    (interest) => `Both interested in ${interest}`
  );
  const goalReasons = matchedGoals.map((goal) => goalReason(goal));
  const occupationReason =
    currentField && currentField === candidateField
      ? `Both in ${currentField} field`
      : null;
  const eventReason =
    sharedEventTitle ? `Joined ${sharedEventTitle}` : "Joined the same event"
  const reasons = [
    ...interestReasons.slice(0, 2),
    ...goalReasons.slice(0, 1),
    ...(occupationReason ? [occupationReason] : []),
    eventReason,
  ];
  const remainingReasons = [
    ...interestReasons.slice(2),
    ...goalReasons.slice(1),
  ];

  while (reasons.length < 5 && remainingReasons.length > 0) {
    reasons.splice(reasons.length - 1, 0, remainingReasons.shift()!);
  }

  return {
    score,
    reasons,
    sharedInterests: matchedInterests,
    sharedGoals: matchedGoals,
    breakdown: {
      interests: interestScore,
      goals: goalScore,
      occupation: occupationScore,
    },
  };
}
