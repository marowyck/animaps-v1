import {
  PERSON_INTENTION_TO_DB,
  type PersonIntention,
} from "@/features/account-types";
import type { PublicUserType } from "@/features/user-types";
import type { Messages } from "./types";

const USER_TYPE_KEYS: readonly PublicUserType[] = [
  "PERSON",
  "ONG",
  "VETERINARY_CLINIC",
  "OTHER",
  "INSTITUTION",
];

export function labelUserType(messages: Messages, userType: string): string {
  if ((USER_TYPE_KEYS as readonly string[]).includes(userType)) {
    return messages.userTypes[userType as PublicUserType];
  }
  return messages.userTypes.unknown;
}

export function labelIntention(messages: Messages, id: string): string {
  const items = messages.onboarding.intention.items as Record<
    string,
    { title: string } | undefined
  >;
  const direct = items[id]?.title;
  if (direct) return direct;
  const mapped = PERSON_INTENTION_TO_DB[id as PersonIntention];
  const via = mapped ? items[mapped]?.title : undefined;
  if (via) return via;
  return messages.userTypes.unknown;
}
