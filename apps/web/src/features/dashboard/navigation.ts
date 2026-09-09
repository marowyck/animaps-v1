import {
  Building2,
  Compass,
  Gift,
  Heart,
  LayoutDashboard,
  MapPin,
  MessageCircle,
  PawPrint,
  Settings,
  Star,
  Stethoscope,
  User,
  Users,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PublicUserType } from "@/features/user-types";
import type { Permission } from "@/features/permissions";
import { hasPermission } from "@/features/permissions";

export type DashboardNavId =
  | "discover"
  | "dashboard"
  | "animals"
  | "matches"
  | "messages"
  | "reports"
  | "favorites"
  | "profile"
  | "settings"
  | "adoptionRequests"
  | "volunteers"
  | "donations"
  | "organization"
  | "services"
  | "location"
  | "reviews";

export type DashboardNavItem = {
  id: DashboardNavId;
  href: string;
  icon: LucideIcon;
  /** When true, link is shown but marked coming-soon / disabled. */
  placeholder?: boolean;
  /** Optional permission gate — item hidden when missing. */
  permission?: Permission;
};

export type SummaryId =
  | "nearby"
  | "matches"
  | "favorites"
  | "messages"
  | "region"
  | "requests"
  | "volunteers"
  | "donations"
  | "reviews";

export type DashboardConfig = {
  nav: DashboardNavItem[];
  mobileNavIds: DashboardNavId[];
  summaryOrder: SummaryId[];
};

const PERSON_NAV: DashboardNavItem[] = [
  { id: "discover", href: "/discover", icon: Compass },
  { id: "animals", href: "/animals", icon: PawPrint, placeholder: true, permission: "VIEW_ANIMALS" },
  { id: "matches", href: "/matches", icon: Heart, placeholder: true, permission: "ADOPT" },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "reports", href: "/reports", icon: AlertTriangle, placeholder: true, permission: "REPORT" },
  { id: "favorites", href: "/favorites", icon: Star, placeholder: true },
  { id: "profile", href: "/profile", icon: User, placeholder: true, permission: "CREATE_PROFILE" },
  { id: "settings", href: "/settings", icon: Settings, placeholder: true },
];

const ONG_NAV: DashboardNavItem[] = [
  { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "animals", href: "/animals", icon: PawPrint, placeholder: true, permission: "MANAGE_ANIMALS" },
  {
    id: "adoptionRequests",
    href: "/adoption-requests",
    icon: ClipboardList,
    placeholder: true,
    permission: "VIEW_ADOPTION_REQUESTS",
  },
  {
    id: "volunteers",
    href: "/volunteers",
    icon: Users,
    placeholder: true,
    permission: "MANAGE_VOLUNTEERS",
  },
  {
    id: "donations",
    href: "/donations",
    icon: Gift,
    placeholder: true,
  },
  { id: "reports", href: "/reports", icon: AlertTriangle, placeholder: true },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  {
    id: "organization",
    href: "/organization",
    icon: Building2,
    placeholder: true,
    permission: "MANAGE_ORGANIZATION",
  },
];

const CLINIC_NAV: DashboardNavItem[] = [
  { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    id: "services",
    href: "/services",
    icon: Stethoscope,
    placeholder: true,
    permission: "MANAGE_SERVICES",
  },
  {
    id: "location",
    href: "/location",
    icon: MapPin,
    placeholder: true,
    permission: "MANAGE_LOCATION",
  },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "animals", href: "/animals", icon: PawPrint, placeholder: true, permission: "VIEW_ANIMALS" },
  { id: "reviews", href: "/reviews", icon: Star, placeholder: true },
  {
    id: "profile",
    href: "/profile",
    icon: User,
    placeholder: true,
    permission: "MANAGE_PROFILE",
  },
];

const OTHER_NAV: DashboardNavItem[] = [
  { id: "discover", href: "/discover", icon: Compass },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "profile", href: "/profile", icon: User, placeholder: true, permission: "CREATE_PROFILE" },
  { id: "settings", href: "/settings", icon: Settings, placeholder: true },
];

export const DASHBOARD_CONFIGS: Record<PublicUserType, DashboardConfig> = {
  PERSON: {
    nav: PERSON_NAV,
    mobileNavIds: ["discover", "matches", "messages", "favorites", "profile"],
    summaryOrder: ["nearby", "matches", "favorites", "messages", "region"],
  },
  ONG: {
    nav: ONG_NAV,
    mobileNavIds: ["dashboard", "animals", "adoptionRequests", "messages", "organization"],
    summaryOrder: ["requests", "volunteers", "donations", "messages", "nearby"],
  },
  VETERINARY_CLINIC: {
    nav: CLINIC_NAV,
    mobileNavIds: ["dashboard", "services", "messages", "animals", "profile"],
    summaryOrder: ["messages", "reviews", "nearby", "region"],
  },
  OTHER: {
    nav: OTHER_NAV,
    mobileNavIds: ["discover", "messages", "profile"],
    summaryOrder: ["nearby", "messages", "region"],
  },
};

/** @deprecated Prefer getDashboardConfig(userType) */
export const DASHBOARD_NAV = PERSON_NAV;

/** @deprecated Prefer getDashboardConfig(userType).mobileNavIds */
export const MOBILE_NAV_IDS: DashboardNavId[] = DASHBOARD_CONFIGS.PERSON.mobileNavIds;

export const SUMMARY_MOCK: Partial<Record<SummaryId, { value: string; icon: LucideIcon }>> = {
  nearby: { value: "12", icon: PawPrint },
  matches: { value: "4", icon: Heart },
  favorites: { value: "7", icon: Star },
  messages: { value: "2", icon: MessageCircle },
  region: { value: "—", icon: MapPin },
  requests: { value: "5", icon: ClipboardList },
  volunteers: { value: "18", icon: Users },
  donations: { value: "3", icon: Gift },
  reviews: { value: "24", icon: Star },
};

export function getDashboardConfig(userType: PublicUserType): DashboardConfig {
  return DASHBOARD_CONFIGS[userType] ?? DASHBOARD_CONFIGS.PERSON;
}

export function filterNavByPermissions(
  nav: DashboardNavItem[],
  userType: PublicUserType,
): DashboardNavItem[] {
  return nav.filter((item) => {
    if (!item.permission) return true;
    return hasPermission(userType, item.permission);
  });
}
