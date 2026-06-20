export const INTEREST_GROUPS = [
  {
    label: "Art & Exhibition",
    options: [
      "Exhibition",
      "Photography",
      "Illustration",
      "Digital Art",
      "Museum",
      "Fashion",
      "Street Art",
      "Creative Workshop",
    ],
  },
  {
    label: "Music & Performance",
    options: [
      "K-Pop",
      "Indie Music",
      "Jazz",
      "Rock",
      "EDM",
      "Live Concert",
      "Acoustic",
      "Music Festival",
    ],
  },
  {
    label: "Active & Health",
    options: [
      "Running",
      "Cycling",
      "Gym",
      "Yoga",
      "Hiking",
      "Badminton",
      "Wellness",
      "Fitness Community",
    ],
  },
  {
    label: "Founder & Hackathon",
    options: [
      "Startup",
      "AI",
      "Machine Learning",
      "Product Design",
      "UX/UI",
      "Business",
      "Marketing",
      "Software Development",
      "Hackathon",
      "Entrepreneurship",
    ],
  },
] as const;

export const INTEREST_OPTIONS = INTEREST_GROUPS.flatMap(
  (group) => group.options
);

export const GOAL_OPTIONS = [
  "Find New Friends",
  "Networking",
  "Find Event Buddy",
  "Find Hackathon Team",
  "Find Startup Co-Founder",
  "Learn New Skills",
  "Join Community",
  "Career Opportunities",
  "Collaboration",
] as const;

export const OCCUPATION_GROUPS = [
  {
    label: "Technology",
    options: [
      "Computer Science Student",
      "Software Engineer",
      "Data Analyst",
      "Product Manager",
      "UX/UI Designer",
    ],
  },
  {
    label: "Business",
    options: [
      "Marketing",
      "Business Development",
      "Startup Founder",
      "Entrepreneur",
    ],
  },
  {
    label: "Creative",
    options: ["Graphic Designer", "Photographer", "Content Creator"],
  },
  {
    label: "General",
    options: ["Student", "Freelancer", "Other"],
  },
] as const;

export const OCCUPATION_OPTIONS = OCCUPATION_GROUPS.flatMap(
  (group) => group.options
);
