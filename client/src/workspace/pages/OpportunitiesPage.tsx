import { Link } from "wouter";
import { Compass, UserCog } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fmtWc } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { EmptyState } from "../shell/EmptyState";
import { OpportunityCard } from "../shell/OpportunityCard";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";

export default function OpportunitiesPage() {
  const { state } = useWorkspace();
  const { pending, decided } = state.opportunities;
  const approveFirst = state.candidate.preferences.approvalMode === "approve-first";
  const nextWeek = state.plan.find((w) => w.status === "upcoming");

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description={
          approveFirst
            ? "Roles Daniel is considering for you. Approve and the application goes out within two working days; decline with a reason and the targeting gets sharper."
            : "Roles Daniel is applying to within the targets you agreed. Switch to approve-first in your profile if you would rather OK each one."
        }
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={WS.profile}>
              <UserCog aria-hidden="true" /> {approveFirst ? "Approve-first" : "Trusted"} mode
            </Link>
          </Button>
        }
      />

      <div className="space-y-5">
        <Panel title="For your review" count={pending.length}>
          {pending.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {pending.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              icon={Compass}
              title="Nothing waiting for your approval"
              body="Daniel is researching roles against your targets — sector, level, location, hybrid days and salary floor. New opportunities usually appear within 48 hours and wait here until you decide."
              when={nextWeek ? `More expected ${fmtWc(nextWeek.startsOn)}` : undefined}
            />
          )}
        </Panel>

        {decided.length > 0 && (
          <Panel title="Decided" count={decided.length}>
            <div className="grid gap-4 md:grid-cols-2">
              {decided.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} />
              ))}
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
