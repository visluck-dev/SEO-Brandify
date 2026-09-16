import {
  OPERATIONAL_PARTNER_COMPANIES_HOUSE,
  OPERATIONAL_PARTNER_COMPANY_NUMBER,
  OPERATIONAL_PARTNER_DISCLOSURE,
  OPERATIONAL_PARTNER_LEGAL_NAME,
  OPERATIONAL_PARTNER_REGISTERED_OFFICE,
} from "@/constants/legal";
import { cn } from "@/lib/utils";

interface OperationalPartnerDisclosureProps {
  compact?: boolean;
  className?: string;
}

export function OperationalPartnerDisclosure({ compact = false, className }: OperationalPartnerDisclosureProps) {
  if (compact) {
    return (
      <div className={cn("max-w-2xl space-y-1.5 leading-relaxed", className)}>
        <p className="font-semibold text-white/80">Operational partner (public disclosure)</p>
        <p>{OPERATIONAL_PARTNER_DISCLOSURE}</p>
        <p>
          {OPERATIONAL_PARTNER_LEGAL_NAME} · Company no. {OPERATIONAL_PARTNER_COMPANY_NUMBER} · {OPERATIONAL_PARTNER_REGISTERED_OFFICE} ·{" "}
          <a
            href={OPERATIONAL_PARTNER_COMPANIES_HOUSE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 transition-colors duration-200 hover:text-white"
          >
            Companies House record
          </a>
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="operational-partner" className={cn("rounded-3xl border border-hairline bg-white p-8 shadow-card md:p-10", className)}>
      <p className="eyebrow mb-3">Public disclosure</p>
      <h2 id="operational-partner" className="text-2xl font-bold">
        Operational partner
      </h2>
      <p className="mt-4 max-w-2xl leading-relaxed text-body">{OPERATIONAL_PARTNER_DISCLOSURE}</p>
      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-ink">Legal name</dt>
          <dd className="text-body">{OPERATIONAL_PARTNER_LEGAL_NAME}</dd>
        </div>
        <div>
          <dt className="font-semibold text-ink">Company number</dt>
          <dd className="text-body">{OPERATIONAL_PARTNER_COMPANY_NUMBER}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-ink">Registered office</dt>
          <dd className="text-body">{OPERATIONAL_PARTNER_REGISTERED_OFFICE}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-ink">Companies House</dt>
          <dd>
            <a
              href={OPERATIONAL_PARTNER_COMPANIES_HOUSE}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-teal-700 underline underline-offset-4 transition-colors duration-200 hover:text-teal-600"
            >
              View company {OPERATIONAL_PARTNER_COMPANY_NUMBER}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
