import type { LabFact, Ritual } from "@/lib/content/types";
import { CHECKED, S } from "./sources";

const src = (sourceName: string, sourceUrl: string) => ({
  status: "verified" as const,
  sourceName,
  sourceUrl,
  lastVerified: CHECKED,
});

/**
 * The prologue: India's relationship with computing, then today.
 * Every entry is dated and sourced. Keep it short — atmosphere, not a lecture.
 */
export const labFacts: LabFact[] = [
  {
    kind: "timeline",
    when: "1984",
    label: "Computers enter the classroom",
    detail: "The CLASS pilot puts BBC Micro computers into secondary schools across India.",
    verification: src("Higher Education Policy — The CLASS Project", "https://link.springer.com/article/10.1057/hep.1989.76"),
  },
  {
    kind: "timeline",
    when: "15 AUG 1995",
    label: "The internet opens to the public",
    detail: "VSNL launches India's first public internet service: 9.6 kbit/s, ₹5,200 for 250 hours.",
    verification: src("Internet in India — Wikipedia", "https://en.wikipedia.org/wiki/Internet_in_India"),
  },
  {
    kind: "timeline",
    when: "2015",
    label: "TechnoJam begins",
    detail: "A technical community forms inside SCSE at Galgotias University.",
    ours: true,
    verification: S.linkedin,
  },
  {
    kind: "timeline",
    when: "MAR 2026",
    label: "A billion connections",
    detail: "India crosses 1.09 billion internet subscribers.",
    verification: src(
      "TRAI — Indian Telecom Services Performance Indicators, Jan–Mar 2026",
      "https://www.trai.gov.in/sites/default/files/2026-06/QPIR_22062026.pdf",
    ),
  },
  {
    kind: "stat",
    when: "31 MAR 2026",
    label: "internet subscribers in India",
    value: "1.09 B",
    detail: "1,092.79 million — up from 969.1 million a year earlier.",
    verification: src(
      "TRAI — Indian Telecom Services Performance Indicators, Jan–Mar 2026",
      "https://www.trai.gov.in/sites/default/files/2026-06/QPIR_22062026.pdf",
    ),
  },
  {
    kind: "stat",
    when: "AUG 2026",
    label: "UPI payments in a single month",
    value: "24.51 B",
    detail: "A record month for the Unified Payments Interface, per NPCI data.",
    verification: src(
      "Business Standard, citing NPCI — 1 Sep 2026",
      "https://www.business-standard.com/finance/news/upi-transactions-august-2026-record-volume-npci-126090100506_1.html",
    ),
  },
];

/**
 * Jam Night — the recurring build night. The format comes from the
 * homepage brief; the schedule does NOT exist in any public record yet,
 * so day/time/venue stay empty and render as [ REAL DATA REQUIRED ].
 */
export const jamNight: Ritual = {
  name: "Jam Night",
  bring: ["an unfinished project", "a question", "a strange idea", "a friend"],
  experience: "none",
};
