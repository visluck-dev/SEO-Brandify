# VisLuck Workspace API — contract for the backend

The candidate workspace (`client/src/workspace/`) renders only from the shapes in
[`client/src/workspace/data/types.ts`](../client/src/workspace/data/types.ts) and talks to data only
through the `WorkspaceData` interface in
[`provider.ts`](../client/src/workspace/data/provider.ts). Phase A ships `MockDataProvider`;
Phase B adds `ApiDataProvider`, which implements the same methods with `fetch` against the
endpoints below. Nothing in the screens changes.

This document is the contract the backend implements. Field names, enums and date formats
are those in `types.ts` — that file wins if the two ever disagree.

## Conventions

- **Base URL:** `https://api.visluck.com/v1` (to confirm). JSON over HTTPS; UTF-8.
- **Dates:** ISO-8601 UTC strings, e.g. `"2026-10-14T09:30:00.000Z"`. Calendar dates as `"2026-10-13"`. The UI formats in `Europe/London`.
- **IDs:** opaque strings. The UI never parses them.
- **Auth:** `Authorization: Bearer <token>`. Tokens come from a magic-link sign-in (`POST /auth/magic-link` → email → `POST /auth/exchange`); email + password is an acceptable fallback. Tokens carry the role (`candidate | consultant | admin`) and, for candidates, their candidate id.
- **Errors:** `{ "error": { "code": "not_found", "message": "…" } }` with the right HTTP status. Validation errors: `422` with `fields: { name: "message" }`.
- **Freshness:** the workspace polls `GET /me/workspace` every 60 s while visible and on tab focus, sending `If-None-Match` with the last `ETag`; return `304` when nothing changed. (Server-sent events can replace this later without UI changes.)
- **Pagination:** the candidate workspace loads everything for one candidate in one call — a search rarely exceeds a few hundred events. Consultant lists are paginated with `?cursor=`.
- **Sample data:** the demo at `/demo` never calls the API.

## Authorisation rules

| Role | Reads | Writes |
|---|---|---|
| candidate | Own rows only (every table filtered by `candidate_id`) | Own tasks (complete), interview confirm/STAR answers/debrief, opportunity decisions, document approvals and comments, messages, preferences, notification settings, data export / deletion requests |
| consultant | Assigned candidates | Everything for assigned candidates: applications, events, tasks, interviews, documents, opportunities, messages, reports |
| admin | All | All, plus assignments |

Events are **append-only**: no endpoint updates or deletes an event. Corrections are new events.

## Resources

All shapes are defined in `types.ts`; summary:

| Resource | Type | Notes |
|---|---|---|
| `candidate` | `Candidate` | `status` is derived server-side from onboarding + placement; `lastSeenAt` drives "since your last visit" |
| `consultant` | `Consultant` | `replySla` is a display string; `lastActiveAt` updates on any consultant write |
| `search_plan` | `SearchPlanWeek[]` | Set at kick-off; edits are logged as `note.added` |
| `application` | `Application` | `history` is append-only stage changes; the current stage is the last entry |
| `event` | `ActivityEvent` | See taxonomy below |
| `task` | `Task` | `owner` is `candidate` or `consultant`; consultant tasks surface as the application's "next action" |
| `interview` | `Interview` | Carries its own `prep`, `starAnswers`, `debrief`, `feedback` |
| `document` | `CandidateDocument` | Versions are immutable once created; `downloadUrl` is a signed URL valid ≤ 10 minutes |
| `opportunity` | `Opportunity` | `decision` is written once by the candidate; `applicationId` links the resulting application |
| `message` | `Message` | Single thread per candidate; optional `applicationId` tag |
| `weekly_report` | `WeeklyReport` | Published by the consultant; the Monday job drafts it |
| `notification_settings` | `NotificationSettings` | Per candidate |

## Endpoints — candidate workspace

Every method on `WorkspaceData` maps to one call.

| `WorkspaceData` method | HTTP | Notes |
|---|---|---|
| `load()` | `GET /me/workspace` | Returns `{ snapshot: WorkspaceSnapshot, now: ISODateTime }` — everything for the signed-in candidate in one document. Supports `If-None-Match` |
| `completeTask(taskId)` | `POST /me/tasks/{id}/complete` | Only tasks with `owner: "candidate"`. Appends `task.completed` |
| `confirmInterview(interviewId)` | `POST /me/interviews/{id}/confirm` | Sets `confirmedAt`, completes the matching `confirm-interview` task, appends `task.completed`, notifies the consultant |
| `saveStarAnswer(interviewId, index, answer)` | `PUT /me/interviews/{id}/star/{index}` | Body `{ answer }`. No event |
| `submitDebrief(interviewId, debrief)` | `POST /me/interviews/{id}/debrief` | Body `Omit<InterviewDebrief, "submittedAt">`. Completes the `debrief` task, appends `task.completed`, notifies the consultant |
| `decideOpportunity(id, decision, reason?)` | `POST /me/opportunities/{id}/decision` | Body `{ decision, reason? }`. Appends `opportunity.decided`; when no undecided opportunities remain, completes the open `review-opportunities` task |
| `approveDocumentVersion(documentId, versionId)` | `POST /me/documents/{docId}/versions/{verId}/approve` | Sets `approvedAt`, completes the matching `approve-cv` task, appends `document.approved` |
| `commentOnDocument(documentId, versionId, comment)` | `POST /me/documents/{docId}/versions/{verId}/comments` | Body `{ comment }`. Creates a message tagged with the document and appends `message.sent` |
| `sendMessage(body, applicationId?)` | `POST /me/messages` | Body `{ body, applicationId? }`. Appends `message.sent`; notifies the consultant |
| `updatePreferences(preferences)` | `PUT /me/preferences` | Body `Preferences`. Appends `preferences.updated`; notifies the consultant |
| `updateNotifications(settings)` | `PUT /me/notifications` | Body `NotificationSettings`. No event |
| `markSeen()` | `POST /me/seen` | Sets `candidate.lastSeenAt = now`. The UI calls it when the candidate leaves the Today screen or after 30 s on it |
| `requestDataExport()` | `POST /me/data-export` | Emails a JSON + PDF export within 24 h. Appends a system `note.added` |
| `requestAccountDeletion()` | `POST /me/deletion-request` | Consultant confirms within one business day; erasure 30 days after the search closes. Appends a system `note.added` |

Also needed by the marketing site: `POST /leads` (the Book-a-Call form, dual-written with EmailJS until proven) with the fields in `consultation-schema.ts`, and `POST /leads/{id}/cv` for the file.

## Endpoints — consultant console

Mirrors the ops wireframe (`client/src/workspace/ops/`). All under `/candidates/{candidateId}/…`, consultant or admin only.

| Flow | HTTP | Side effects |
|---|---|---|
| Board | `GET /candidates?assigned=me&sort=staleness` | Returns rows with `lastEventAt`, `lastSeenAt`, open counts; the staleness flag is `now - lastEventAt > 48 h` |
| Quick-log | `POST /candidates/{id}/applications` | Body: company, role, location, jobUrl?, source, stage, note?. Appends `application.sent` (+ `stage.changed` if not `applied`) and **auto-creates a consultant `followup` task due in 7 days** |
| OG fetch | `POST /tools/fetch-job` | Body `{ url }` → `{ company, role, location? }` from Open Graph / JSON-LD; used to prefill quick-log |
| Stage update | `POST /candidates/{id}/applications/{appId}/stage` | Body `{ stage, note?, reason? }` (reason required when `closed`). Appends `stage.changed` |
| Follow-up | `POST /candidates/{id}/applications/{appId}/followup` | Appends `followup.sent`, completes the open follow-up task, schedules the next one (+7 days) |
| Employer reply | `POST /candidates/{id}/applications/{appId}/reply` | Body `{ note }`. Appends `employer.replied` |
| Schedule interview | `POST /candidates/{id}/interviews` | Creates the interview, moves the stage to `interview`, appends `interview.scheduled`, creates candidate tasks `confirm-interview` (due +24 h) and `prep` (due the day before) |
| Assign task | `POST /candidates/{id}/tasks` | Appends `task.assigned` |
| Draft report | `GET /candidates/{id}/reports/draft` | Server builds `did / happened / next / numbers` from the last 7 days of events (see `OpsStore.draftReport` for the rule) |
| Publish report | `POST /candidates/{id}/reports` | Appends `report.published`; email goes at the next 09:00 London or immediately if later |
| Documents | `POST /candidates/{id}/documents/{docId}/versions` (multipart) | Appends `document.versioned` and, when approval is needed, creates an `approve-cv` task |
| Opportunities | `POST /candidates/{id}/opportunities` | Appends `opportunity.added` and creates/extends a `review-opportunities` task |
| Invite | `POST /candidates` then `POST /candidates/{id}/invite` | Creates the candidate from a lead, sends the magic link, appends `kickoff.completed` when the consultant marks the call done |

## Event taxonomy

`ActivityEvent.type` — every value, who writes it, and what it links to. The activity feed, "since your last visit" and every KPI derive from this list (`derive.ts`), so the backend must write these and only these.

| Type | Actor | Links | Written when |
|---|---|---|---|
| `kickoff.completed` | consultant | — | Consultant marks the kick-off call done |
| `candidate.onboarded` | candidate | — | Fifth onboarding step completed |
| `note.added` | consultant / system | application? | Free-text note; the system uses it for export and deletion confirmations |
| `opportunity.added` | consultant | opportunity, task? | One event per batch of opportunities |
| `opportunity.decided` | candidate | opportunity, task? | Candidate approves or declines |
| `application.sent` | consultant | application | Quick-log |
| `application.viewed` | employer | application | Recruiter viewed the profile or application (from an ATS or logged by hand) |
| `followup.sent` | consultant | application, task? | Follow-up or thank-you note sent |
| `employer.replied` | employer | application | Any employer response |
| `stage.changed` | consultant | application | Stage moved (the title carries the new stage) |
| `interview.scheduled` | consultant | application, interview, task? | Interview booked |
| `interview.completed` | system | application, interview, task? | Fires at `at + durationMinutes`; creates the debrief task |
| `interview.feedback` | employer | application, interview | Feedback received |
| `offer.received` | employer | application | Offer made |
| `offer.accepted` | candidate | application | Offer accepted; sets `candidate.placement` |
| `document.versioned` | consultant | document, task? | New version uploaded |
| `document.approved` | candidate | document, task? | Candidate approved a version |
| `task.assigned` | consultant | task, application? | Consultant created a candidate task |
| `task.completed` | candidate | task, application?, interview? | Candidate completed a task (including confirm and debrief) |
| `message.sent` | candidate | application?, document? | Candidate sent a message or a document comment |
| `report.published` | consultant | report | Weekly report published |
| `preferences.updated` | candidate | — | Preferences saved |
| `milestone` | system | — | First shortlist, first interview, offer received, offer accepted, week-N complete |

## Scheduled jobs (backend)

| Job | When | Does |
|---|---|---|
| Staleness check | hourly | For every active candidate with no consultant or employer event in 48 h: flag on the board, notify the consultant (and the admin at 72 h) |
| Weekly report draft | Monday 08:00 London | Creates a draft for each active candidate from the last 7 days; the consultant edits and publishes by 09:00 |
| Interview completion | every 5 min | Appends `interview.completed` and creates the `debrief` task once `at + durationMinutes` has passed |
| Notification sender | continuous | Instant (shortlist, interview, reply, offer), daily digest 18:00, weekly report 09:00 — per `NotificationSettings` |
| Retention | daily | 12 months after the search closes (or 30 days after a deletion request): erase documents, messages and PII; keep anonymised counts |
| Alumni check-ins | daily | Creates `check-in` tasks at start + 30 / 60 / 90 days for placed candidates |

## Compliance notes for the backend owner

UK/EU data residency · TLS everywhere · CVs and documents encrypted at rest and served only through short-lived signed URLs · the events table is the audit trail · self-service export and deletion endpoints above · data-processing agreements with the operational partner (Athena Infotech Limited) and the email provider · the privacy policy on the site must list the processors before go-live.
