export const AUTH_SLIDES = [
  {
    id: "rescue" as const,
    src: "/images/auth/rescue.png",
  },
  {
    id: "adoption" as const,
    src: "/images/auth/adoption.png",
  },
  {
    id: "wildlife" as const,
    src: "/images/auth/wildlife.png",
  },
] as const;

export type AuthSlideId = (typeof AUTH_SLIDES)[number]["id"];
