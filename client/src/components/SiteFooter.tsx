import { Link } from "wouter";
import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Container } from "@/components/layout/Container";
import { OperationalPartnerDisclosure } from "@/components/OperationalPartnerDisclosure";
import { CONTACT_INFO, FOOTER_BLURB, FOOTER_LINKS, SOCIAL_LINKS, TAGLINE } from "@/constants/site";
import { COPYRIGHT_ENTITY } from "@/constants/legal";

const socialIcons = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook } as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] lg:gap-10 lg:py-20">
        <div className="max-w-sm space-y-5">
          <Logo tone="white" withTagline />
          <p className="font-display text-lg font-bold text-white">{TAGLINE}</p>
          <p className="text-sm leading-relaxed text-white/70">{FOOTER_BLURB}</p>
          <ul className="space-y-2 pt-2 text-sm">
            <li>
              <a href={CONTACT_INFO.emailHref} className="inline-flex min-h-11 items-center gap-2.5 text-white/80 transition-colors duration-200 hover:text-white">
                <Mail className="size-4 text-teal-500" aria-hidden="true" />
                {CONTACT_INFO.email}
              </a>
            </li>
            <li>
              <a href={CONTACT_INFO.phoneHref} className="inline-flex min-h-11 items-center gap-2.5 text-white/80 transition-colors duration-200 hover:text-white">
                <Phone className="size-4 text-teal-500" aria-hidden="true" />
                {CONTACT_INFO.phone}
              </a>
            </li>
          </ul>
        </div>

        <FooterColumn title="Quick Links" links={FOOTER_LINKS.quick} />
        <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />

        <div>
          <h2 className="eyebrow-on-navy mb-5">Connect</h2>
          <ul className="space-y-1">
            {SOCIAL_LINKS.map((s) => {
              const Icon = socialIcons[s.platform];
              return (
                <li key={s.platform}>
                  <a
                    href={s.url}
                    target={s.url.startsWith("http") ? "_blank" : undefined}
                    rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex min-h-11 items-center gap-2.5 text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    <Icon className="size-4 text-teal-500" aria-hidden="true" />
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="grid gap-8 py-8 text-xs text-white/60 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <OperationalPartnerDisclosure compact />
          <p className="lg:text-right">
            © {new Date().getFullYear()} {COPYRIGHT_ENTITY}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow-on-navy mb-5">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors duration-200 hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
