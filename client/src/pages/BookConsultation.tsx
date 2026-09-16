import { Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Container } from "@/components/layout/Container";
import { ConsultationForm } from "@/components/forms/ConsultationForm";
import { OPERATIONAL_PARTNER_LEGAL_NAME, OPERATIONAL_PARTNER_REGISTERED_OFFICE } from "@/constants/legal";
import { SEO_PAGES } from "@/constants/seo";
import { CONTACT_INFO, ROUTES, SOCIAL_LINKS } from "@/constants/site";
import { STEPS } from "@/constants/steps";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const linkedin = SOCIAL_LINKS.find((s) => s.platform === "linkedin");

export default function BookConsultation() {
  return (
    <>
      <SEO {...SEO_PAGES.book} path={ROUTES.book} jsonLd={[breadcrumbJsonLd([{ name: "Book a Free Consultation", path: ROUTES.book }])]} />

      <section className="relative overflow-hidden border-b border-hairline bg-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 dot-grid" />
          <div className="absolute -right-24 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgb(20_163_165_/_0.14),transparent)]" />
        </div>
        <Container className="relative py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4">Book a free consultation</p>
            <h1 className="h-display">Let's Talk About Your UK Career Goals</h1>
            <p className="lead mt-6 max-w-2xl">
              Complete the form and our team will get in touch to understand your profile and discuss how VisLuck can support your job search.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-mist section-y" aria-label="Consultation form">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
          <ConsultationForm />

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-hairline bg-white p-7 shadow-card">
              <h2 className="text-lg font-bold text-ink">Prefer to reach out directly?</h2>
              <ul className="mt-5 space-y-1">
                <ContactRow icon={Mail} label="Email" value={CONTACT_INFO.email} href={CONTACT_INFO.emailHref} />
                <ContactRow icon={MessageCircle} label="WhatsApp" value={CONTACT_INFO.phone} href={CONTACT_INFO.whatsappHref} external />
                <ContactRow icon={Phone} label="Call" value={CONTACT_INFO.phone} href={CONTACT_INFO.phoneHref} />
                {linkedin && <ContactRow icon={Linkedin} label="LinkedIn" value="VisLuck on LinkedIn" href={linkedin.url} external />}
              </ul>
            </div>

            <div className="rounded-3xl border border-hairline bg-white p-7 shadow-card">
              <h2 className="text-lg font-bold text-ink">What happens next</h2>
              <ol className="mt-5 space-y-4">
                {STEPS.slice(0, 3).map((s) => (
                  <li key={s.number} className="flex gap-3.5">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-50 font-display text-xs font-bold text-teal-700">{s.number}</span>
                    <span>
                      <span className="block font-display font-bold text-ink">{s.title}</span>
                      <span className="text-sm text-body">{s.description}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-start gap-3 px-2 text-xs leading-relaxed text-muted-foreground">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-600" aria-hidden="true" />
              <p>
                Registered office ({OPERATIONAL_PARTNER_LEGAL_NAME}, operational partner): {OPERATIONAL_PARTNER_REGISTERED_OFFICE}
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}

function ContactRow({ icon: Icon, label, value, href, external }: { icon: typeof Mail; label: string; value: string; href: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group flex min-h-12 items-center gap-3.5 rounded-xl px-2 transition-colors duration-200 hover:bg-mist"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
          <span className="block truncate font-display text-sm font-bold text-ink group-hover:text-teal-700">{value}</span>
        </span>
      </a>
    </li>
  );
}
