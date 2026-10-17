export const AUDIENCE_KEYS = ["guardians", "ngos", "clinics", "agencies"] as const;
export type AudienceKey = (typeof AUDIENCE_KEYS)[number];

/** Fired on window when the audience tab changes, so the header can mirror it. */
export const AUDIENCE_EVENT = "animaps:audience";
