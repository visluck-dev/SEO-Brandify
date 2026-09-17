/**
 * Testimonials are hidden on the live site until genuine, attributable reviews exist.
 * Flip SHOW_TESTIMONIALS to true and replace the bracketed placeholders.
 */
export const SHOW_TESTIMONIALS = false;

export const TESTIMONIALS_SECTION = {
  eyebrow: "Success stories",
  title: "What Our Clients Say",
  ctaLead: "Want to start your own journey?",
} as const;

export const TESTIMONIALS = [
  {
    quote: "[Real client testimonial about their experience with VisLuck.]",
    name: "[Client Name]",
    role: "[Role / Location]",
  },
  {
    quote: "[Real client testimonial describing the value of the structured job-search support.]",
    name: "[Client Name]",
    role: "[Role / Location]",
  },
  {
    quote: "[Real client testimonial about the dashboard, communication or interview preparation.]",
    name: "[Client Name]",
    role: "[Role / Location]",
  },
] as const;
