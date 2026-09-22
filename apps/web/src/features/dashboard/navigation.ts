import {
  Building2,
  Compass,
  Gift,
  Heart,
  LayoutDashboard,
  Map,
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
  BarChart3,
  GitBranch,
  Plug,
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
  | "reviews"
  | "cases"
  | "map"
  | "analytics"
  | "team"
  | "institution"
  | "routing"
  | "integrations";

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
  | "reviews"
  | "newCases"
  | "inReview"
  | "priority";

export type DashboardConfig = {
  nav: DashboardNavItem[];
  mobileNavIds: DashboardNavId[];
  summaryOrder: SummaryId[];
};

const PERSON_NAV: DashboardNavItem[] = [
  { id: "discover", href: "/discover", icon: Compass },
  { id: "animals", href: "/animals", icon: PawPrint, placeholder: true, permission: "VIEW_ANIMALS" },
  { id: "matches", href: "/matches", icon: Heart, permission: "ADOPT" },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "reports", href: "/cases", icon: AlertTriangle, permission: "REPORT" },
  { id: "favorites", href: "/favorites", icon: Star },
  { id: "profile", href: "/profile", icon: User, permission: "CREATE_PROFILE" },
  { id: "settings", href: "/settings", icon: Settings },
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
  { id: "reports", href: "/cases", icon: AlertTriangle, permission: "REPORT" },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  {
    id: "organization",
    href: "/profile",
    icon: Building2,
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
    permission: "MANAGE_PROFILE",
  },
];

const OTHER_NAV: DashboardNavItem[] = [
  { id: "discover", href: "/discover", icon: Compass },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "profile", href: "/profile", icon: User, permission: "CREATE_PROFILE" },
  { id: "settings", href: "/settings", icon: Settings },
];

/** Government workspace — Fase 4 modules live; messages stay placeholder. */
const INSTITUTION_NAV: DashboardNavItem[] = [
  { id: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    id: "cases",
    href: "/cases",
    icon: ClipboardList,
    permission: "VIEW_INCOMING_REPORTS",
  },
  {
    id: "map",
    href: "/map",
    icon: Map,
    permission: "VIEW_MAP",
  },
  {
    id: "analytics",
    href: "/analytics",
    icon: BarChart3,
    permission: "VIEW_ANALYTICS",
  },
  {
    id: "team",
    href: "/team",
    icon: Users,
    permission: "MANAGE_TEAM",
  },
  {
    id: "routing",
    href: "/routing",
    icon: GitBranch,
    permission: "ROUTE_CASE",
  },
  {
    id: "integrations",
    href: "/integrations",
    icon: Plug,
    permission: "MANAGE_INTEGRATION",
  },
  {
    id: "institution",
    href: "/institution",
    icon: Building2,
    permission: "MANAGE_INSTITUTION",
  },
  { id: "messages", href: "/messages", icon: MessageCircle, placeholder: true, permission: "MESSAGE" },
  { id: "settings", href: "/settings", icon: Settings },
];

export const DASHBOARD_CONFIGS: Record<PublicUserType, DashboardConfig> = {
  PERSON: {
    nav: PERSON_NAV,
    mobileNavIds: ["discover", "matches", "reports", "favorites", "profile"],
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
  INSTITUTION: {
    nav: INSTITUTION_NAV,
    mobileNavIds: ["dashboard", "cases", "map", "team", "settings"],
    summaryOrder: ["newCases", "inReview", "priority", "requests", "region"],
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
  newCases: { value: "42", icon: ClipboardList },
  inReview: { value: "18", icon: AlertTriangle },
  priority: { value: "6", icon: Star },
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
