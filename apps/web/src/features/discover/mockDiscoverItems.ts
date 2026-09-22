import type { Messages } from "@/i18n";
import type { DiscoverItem } from "./types";

const MOCK_DISCOVER_BASE: DiscoverItem[] = [
  {
    id: "a1",
    kind: "animal",
    title: "Luna",
    subtitle: "",
    tags: [],
    distanceKm: 3.2,
    reciprocates: true,
  },
  {
    id: "p1",
    kind: "person",
    title: "Marina",
    subtitle: "",
    tags: [],
    distanceKm: 5.1,
  },
  {
    id: "o1",
    kind: "organization",
    title: "Patas Unidas",
    subtitle: "",
    tags: [],
    distanceKm: 8.4,
  },
  {
    id: "pr1",
    kind: "protector",
    title: "Carlos",
    subtitle: "",
    tags: [],
    distanceKm: 2.0,
    reciprocates: true,
  },
  {
    id: "a2",
    kind: "animal",
    title: "Mimi",
    subtitle: "",
    tags: [],
    distanceKm: 1.4,
  },
];

export function getMockDiscoverItems(t: Messages): DiscoverItem[] {
  return MOCK_DISCOVER_BASE.map((item) => {
    const copy = t.discover.mocks[item.id as keyof typeof t.discover.mocks];
    return {
      ...item,
      subtitle: copy.subtitle,
      tags: copy.tags,
    };
  });
}
