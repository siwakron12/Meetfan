import mockCommunity from "@/data/mock-community.json";

type MockCommunityMember = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export const MOCK_COMMUNITY = mockCommunity as MockCommunityMember[];

export function mockEmailForName(firstName: string) {
  return `${firstName.toLowerCase()}@meetfan.mock`;
}

export function getMockAvatar(input: { email?: string | null; name?: string | null; id: string }) {
  const member = MOCK_COMMUNITY.find((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    return (
      input.email === mockEmailForName(user.firstName) ||
      input.name === fullName
    );
  });

  return member?.avatar ?? `https://i.pravatar.cc/150?u=${input.id}`;
}
