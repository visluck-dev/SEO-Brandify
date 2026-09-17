import { Link } from "wouter";
import { CircleAlert } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Container } from "@/components/layout/Container";
import { COOKIE_POLICY, DISCLAIMER } from "@/constants/legal-docs-b";
import { LEGAL_DRAFT_NOTICE, PRIVACY_POLICY, TERMS_AND_CONDITIONS, type LegalDoc } from "@/constants/legal-docs-a";
import { SEO_PAGES } from "@/constants/seo";
import { FOOTER_LINKS, ROUTES } from "@/constants/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";

const DOCS = {
  privacy: { doc: PRIVACY_POLICY, path: ROUTES.privacy, seo: SEO_PAGES.privacy },
  terms: { doc: TERMS_AND_CONDITIONS, path: ROUTES.terms, seo: SEO_PAGES.terms },
  cookies: { doc: COOKIE_POLICY, path: ROUTES.cookies, seo: SEO_PAGES.cookies },
  disclaimer: { doc: DISCLAIMER, path: ROUTES.disclaimer, seo: SEO_PAGES.disclaimer },
} as const;

export type LegalDocKey = keyof typeof DOCS;

export default function LegalPage({ doc: key }: { doc: LegalDocKey }) {
  const { doc, path, seo } = DOCS[key];
  return (
    <>
      <SEO {...seo} path={path} jsonLd={[breadcrumbJsonLd([{ name: doc.title, path }])]} />
      <section className="border-b border-hairline bg-mist">
        <Container className="py-12 md:py-16">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="h-section">{doc.title}</h1>
          <p className="lead mt-4 max-w-2xl">{doc.intro}</p>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: {doc.updated}</p>
        </Container>
      </section>

      <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <article>
          {LEGAL_DRAFT_NOTICE && (
            <p role="note" className="mb-8 flex items-start gap-2.5 rounded-xl border border-status-waiting/30 bg-status-waiting-tint px-4 py-3 text-sm text-status-waiting">
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {LEGAL_DRAFT_NOTICE}
            </p>
          )}
          <Sections doc={doc} />
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4">Other policies</p>
          <ul className="space-y-1">
            {FOOTER_LINKS.legal.filter((l) => l.href !== path).map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center font-display text-sm font-semibold text-ink transition-colors duration-200 hover:text-teal-700">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </Container>
    </>
  );
}

function Sections({ doc }: { doc: LegalDoc }) {
  return (
    <div className="prose-measure space-y-9">
      {doc.sections.map((s) => (
        <section key={s.heading}>
          <h2 className="text-xl font-bold text-ink">{s.heading}</h2>
          {s.bullets && (
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-body marker:text-teal-600">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {s.paragraphs?.map((p) => (
            <p key={p} className="mt-3 leading-relaxed text-body">
              {p}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
