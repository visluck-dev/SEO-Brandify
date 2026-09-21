import { useEffect, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import { MessageCircle, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { dayHeading, dayKey, fmtTime } from "../data/format";
import { useWorkspace } from "../data/WorkspaceContext";
import { WS } from "../routes";
import { ConsultantCard } from "../shell/ConsultantCard";
import { PageHeader } from "../shell/PageHeader";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const { state, data } = useWorkspace();
  const search = useSearch();
  const aboutId = new URLSearchParams(search).get("about") ?? undefined;
  const about = aboutId ? state.applications.find((a) => a.id === aboutId) : undefined;
  const [context, setContext] = useState(about?.id);
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const first = state.consultant.name.split(" ")[0];

  useEffect(() => setContext(about?.id), [about?.id]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [state.messages.length]);

  const days = new Map<string, typeof state.messages>();
  for (const m of state.messages) days.set(dayKey(m.at), [...(days.get(dayKey(m.at)) ?? []), m]);
  const ctxApp = context ? state.applications.find((a) => a.id === context) : undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    data.sendMessage(body.trim(), context);
    setBody("");
  };

  return (
    <div>
      <PageHeader title="Messages" description={`One thread with ${first}. ${state.consultant.replySla}; anything urgent, use WhatsApp.`} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <section className="flex min-h-[28rem] flex-col rounded-2xl border border-hairline bg-white shadow-card" aria-label="Conversation">
          <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
            {Array.from(days.entries()).map(([k, items]) => (
              <div key={k}>
                <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
                  {(() => {
                    const h = dayHeading(items[0].at, state.now);
                    return h.relative ? `${h.relative} · ${h.long}` : h.long;
                  })()}
                </p>
                <ul className="space-y-3">
                  {items.map((m) => {
                    const mine = m.from === "candidate";
                    const app = m.applicationId ? state.applications.find((a) => a.id === m.applicationId) : undefined;
                    return (
                      <li key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%]", mine ? "rounded-br-md bg-ink text-white" : "rounded-bl-md bg-mist text-ink")}>
                          {app && (
                            <Link href={WS.application(app.id)} className={cn("mb-1 block text-[0.6875rem] font-bold uppercase tracking-wide", mine ? "text-teal-100" : "text-teal-700")}>
                              {app.company}
                            </Link>
                          )}
                          <p>{m.body}</p>
                          <p className={cn("mt-1 text-[0.6875rem]", mine ? "text-white/60" : "text-muted-foreground")}>
                            {mine ? "You" : first} · {fmtTime(m.at)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="border-t border-hairline p-3 sm:p-4">
            {ctxApp && (
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-teal-50 py-1 pl-3 pr-1 text-xs font-semibold text-teal-700">
                About {ctxApp.company}
                <button type="button" onClick={() => setContext(undefined)} className="flex size-5 items-center justify-center rounded-full hover:bg-teal-100" aria-label="Remove the application context">
                  <X className="size-3" />
                </button>
              </p>
            )}
            <div className="flex items-end gap-2">
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={`Message ${first}…`} aria-label="Message" className="min-h-[2.75rem] flex-1 resize-none bg-mist focus:bg-white" rows={2} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e); }} />
              <Button type="submit" size="icon" aria-label="Send" disabled={!body.trim()}>
                <Send />
              </Button>
            </div>
          </form>
        </section>
        <div className="space-y-5">
          <ConsultantCard />
          {state.consultant.whatsappHref && (
            <Button asChild variant="outline" className="w-full">
              <a href={state.consultant.whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" /> WhatsApp for anything urgent
              </a>
            </Button>
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">Messages about a specific application are tagged with it, so the full story of every role stays in one place.</p>
        </div>
      </div>
    </div>
  );
}
