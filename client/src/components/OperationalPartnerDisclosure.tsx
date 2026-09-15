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

export function OperationalPartnerDisclosure({
  compact = false,
  className,
}: OperationalPartnerDisclosureProps) {
  if (compact) {
    return (
      <div className={cn("space-y-2 text-left", className)}>
        <p className="font-medium text-primary-foreground/80">
          Operational partner (public disclosure)
        </p>
        <p>{OPERATIONAL_PARTNER_DISCLOSURE}</p>
        <p>
          {OPERATIONAL_PARTNER_LEGAL_NAME} · Company no. {OPERATIONAL_PARTNER_COMPANY_NUMBER}
        </p>
        <p>{OPERATIONAL_PARTNER_REGISTERED_OFFICE}</p>
        <p>
          <a
            href={OPERATIONAL_PARTNER_COMPANIES_HOUSE}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white"
          >
            Companies House record
          </a>
        </p>
      </div>
    );
  }

  return (
    <section className={cn("rounded-2xl border border-border bg-white p-8 md:p-10", className)}>
      <h2 className="text-2xl font-display font-bold text-primary mb-4">
        Operational partner (public disclosure)
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        {OPERATIONAL_PARTNER_DISCLOSURE}
      </p>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-semibold text-foreground">Legal name</dt>
          <dd className="text-muted-foreground">{OPERATIONAL_PARTNER_LEGAL_NAME}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Company number</dt>
          <dd className="text-muted-foreground">{OPERATIONAL_PARTNER_COMPANY_NUMBER}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Registered office</dt>
          <dd className="text-muted-foreground">{OPERATIONAL_PARTNER_REGISTERED_OFFICE}</dd>
        </div>
        <div>
          <dt className="font-semibold text-foreground">Companies House</dt>
          <dd>
            <a
              href={OPERATIONAL_PARTNER_COMPANIES_HOUSE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-secondary"
            >
              View company {OPERATIONAL_PARTNER_COMPANY_NUMBER}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
