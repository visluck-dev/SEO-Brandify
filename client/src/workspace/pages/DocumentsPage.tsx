import { useState } from "react";
import { Check, Download, FileText, Linkedin, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CandidateDocument, DocumentVersion } from "../data/types";
import { fmtDate, fmtDateTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { PageHeader } from "../shell/PageHeader";
import { Panel } from "../shell/Panel";

const ICON = { cv: FileText, "cover-letter": FileText, linkedin: Linkedin } as const;

const STATUS: Record<DocumentVersion["status"], { label: string; variant: "progressing" | "waiting" | "neutral" | "outline" }> = {
  approved: { label: "Approved", variant: "progressing" },
  "awaiting-approval": { label: "Awaiting your approval", variant: "waiting" },
  draft: { label: "Draft", variant: "neutral" },
  superseded: { label: "Superseded", variant: "outline" },
};

function DownloadButton({ v }: { v: DocumentVersion }) {
  const { mode } = useWorkspace();
  if (mode === "demo" || !v.downloadUrl) {
    return (
      <Button size="sm" variant="ghost" disabled title="Downloads are switched off in the sample workspace">
        <Download aria-hidden="true" /> Download
      </Button>
    );
  }
  return (
    <Button asChild size="sm" variant="ghost">
      <a href={v.downloadUrl}>
        <Download aria-hidden="true" /> Download
      </a>
    </Button>
  );
}

function VersionRow({ doc, v }: { doc: CandidateDocument; v: DocumentVersion }) {
  const { data } = useWorkspace();
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState("");
  const awaiting = v.status === "awaiting-approval";

  return (
    <li className="py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-display text-sm font-bold text-ink">
            Version {v.version}
            <Badge variant={STATUS[v.status].variant} className="px-2 py-0 text-[0.6875rem]">
              {STATUS[v.status].label}
            </Badge>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-body">{v.changeNote}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {fmtDateTime(v.createdAt)} · {v.fileName}
            {v.approvedAt ? ` · approved ${fmtDate(v.approvedAt)}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <DownloadButton v={v} />
          {awaiting && (
            <>
              <Button size="sm" variant="outline" onClick={() => setCommenting((c) => !c)}>
                <MessageSquareText aria-hidden="true" /> Comment
              </Button>
              <Button size="sm" variant="accent" onClick={() => data.approveDocumentVersion(doc.id, v.id)}>
                <Check aria-hidden="true" /> Approve
              </Button>
            </>
          )}
        </div>
      </div>
      {commenting && awaiting && (
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!comment.trim()) return;
            data.commentOnDocument(doc.id, v.id, comment.trim());
            setComment("");
            setCommenting(false);
          }}
        >
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What does not sound like you, or what is missing?" className="min-h-[4rem] flex-1 bg-mist focus:bg-white" aria-label="Comment for Daniel" />
          <Button type="submit" size="sm">
            Send to Daniel
          </Button>
        </form>
      )}
    </li>
  );
}

export default function DocumentsPage() {
  const { state } = useWorkspace();
  const order: CandidateDocument["kind"][] = ["cv", "cover-letter", "linkedin"];
  const docs = order.map((k) => state.documents.find((d) => d.kind === k)).filter((d): d is CandidateDocument => !!d);
  const missing = order.filter((k) => !docs.some((d) => d.kind === k));

  return (
    <div>
      <PageHeader title="Documents" description="Every version, with the reason it changed. Nothing goes to an employer until you have approved it, and each application records which version went with it." />
      <div className="space-y-5">
        {docs.map((d) => {
          const Icon = ICON[d.kind];
          const versions = d.versions.slice().reverse();
          return (
            <Panel key={d.id} title={d.title} count={versions.length} bodyClassName="py-1 sm:py-1" action={<Icon className="size-4 text-muted-foreground" aria-hidden="true" />}>
              <ul className="divide-y divide-hairline">
                {versions.map((v) => (
                  <VersionRow key={v.id} doc={d} v={v} />
                ))}
              </ul>
            </Panel>
          );
        })}
        {missing.length > 0 && (
          <p className="rounded-xl border border-dashed border-hairline-strong bg-mist/60 px-4 py-3 text-sm text-body">
            {missing.includes("linkedin") && "LinkedIn copy arrives in week 2, once the CV positioning is approved. "}
            {missing.includes("cover-letter") && "Supporting-statement templates are built alongside the first applications."}
          </p>
        )}
      </div>
    </div>
  );
}
