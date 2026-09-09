import type { DiscoverItem } from "./types";

export const MOCK_DISCOVER_ITEMS: DiscoverItem[] = [
  {
    id: "a1",
    kind: "animal",
    title: "Luna",
    subtitle: "Friendly mixed-breed looking for a calm home",
    tags: ["dog", "medium", "vaccinated"],
    distanceKm: 3.2,
  },
  {
    id: "p1",
    kind: "person",
    title: "Marina",
    subtitle: "Volunteer & foster · loves cats",
    tags: ["cats", "foster"],
    distanceKm: 5.1,
  },
  {
    id: "o1",
    kind: "organization",
    title: "Patas Unidas",
    subtitle: "NGO focused on responsible adoption",
    tags: ["ngo", "verified"],
    distanceKm: 8.4,
  },
  {
    id: "pr1",
    kind: "protector",
    title: "Carlos",
    subtitle: "Independent protector · small dogs",
    tags: ["rescuer", "dogs"],
    distanceKm: 2.0,
  },
  {
    id: "a2",
    kind: "animal",
    title: "Mimi",
    subtitle: "Curious cat, apartment-ready",
    tags: ["cat", "small"],
    distanceKm: 1.4,
  },
];
