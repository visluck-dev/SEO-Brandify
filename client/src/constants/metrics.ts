/**
 * Operational metrics (brief section 15). These must come from real, trackable data.
 * Keep SHOW_METRICS false until values are supplied; then fill `value` and `asOf`.
 */
export const SHOW_METRICS = false;

export const METRICS_SECTION = {
  eyebrow: "Results",
  title: "A More Measurable Job Search",
  asOf: "", // e.g. "Updated September 2026"
} as const;

export const METRICS = [
  { label: "Applications Managed", value: "" },
  { label: "Interviews Supported", value: "" },
  { label: "Profiles Optimised", value: "" },
  { label: "Candidates Supported", value: "" },
] as const;
