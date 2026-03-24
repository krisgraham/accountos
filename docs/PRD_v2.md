# AccountOS — Product Requirements Document v2.0

**Account Intelligence & Relationship Management Platform**
Version 2.0 | March 2026 | Status: Draft for Internal Review | CONFIDENTIAL

---

## 1. Executive Summary

AccountOS is an account intelligence and relationship management platform purpose-built for software services account teams of 3–10 people managing customer organizations of 20–100 contacts. It provides a unified workspace where account managers can visually map customer org charts, track stakeholder relationships with rich metadata, manage project lifecycles from presales through delivery, log communications, capture meeting notes with per-person intelligence, map customer technology stacks, and receive AI-powered recommendations for next steps.

The platform addresses a critical gap in the current tool landscape. Enterprise customer success platforms like Gainsight and ChurnZero cost $50K+ per year, require months to implement, and overwhelm small teams. Relationship intelligence tools like People.ai and Gong focus on pre-sale deal execution and cost $200+/user/month. Standalone org chart tools like Prolifiq and OrgChartHub provide visualization without broader account intelligence. No existing tool combines interactive org charting, automatic relationship scoring, AI-powered recommendations, and lightweight deployment at a price point accessible to small account teams.

AccountOS will initially deploy as a locally running web application suitable for demonstration and immediate team use, with a clear migration path to Microsoft Teams/SharePoint integration. The AI engine leverages commodity LLM APIs for meeting note analysis, next-step suggestions, and conversational querying of account data at an estimated cost of $30–80/month for the entire team.

**Rollout Strategy:** Prove the tool on 1–2 accounts with a willing AM, populate enough data for AI to generate useful suggestions, then use the live instance — not a pitch deck — to demonstrate value and extend to the broader portfolio.

---

## 2. Problem Statement & Market Opportunity

### 2.1 The Problem

Account teams at software services companies face a fragmented workflow. Customer relationship knowledge lives across disconnected tools: org charts in PowerPoint, stakeholder notes in OneNote or scattered emails, project tracking in spreadsheets, meeting notes in Word documents, and communication history buried in inboxes. This fragmentation creates three critical failures:

- **Knowledge loss:** When an account manager transitions off an account or leaves the company, months of relationship context — stakeholder motivations, political dynamics, informal commitments — disappears. The presales-to-delivery handover is the worst offender: delivery teams routinely start from scratch despite months of presales intelligence.
- **Coverage blind spots:** Without a unified view, teams cannot see which stakeholders have gone cold, which departments lack engagement, or where deals are dangerously single-threaded (reliant on a single champion with no breadth).
- **Reactive account management:** Without data-driven signals, teams react to churn indicators rather than proactively nurturing relationships and identifying expansion opportunities.

### 2.2 Market Opportunity

The competitive landscape analysis identified 18+ tools across customer success, relationship intelligence, and stakeholder mapping categories. The market is fragmented along two axes: feature depth versus deployment complexity, and pre-sale focus versus post-sale focus.

| Tool Category | Examples | Strengths | Gaps AccountOS Fills |
|---|---|---|---|
| Customer Success Platforms | Gainsight, ChurnZero, Vitally, Planhat | Health scoring, playbooks, automation | No interactive org charts, expensive ($50K+/yr), months to deploy |
| Relationship Intelligence | People.ai, Gong, Affinity CRM | Auto-capture, conversation analysis, scoring | Pre-sale focused, no org visualization, $200+/user/mo |
| Stakeholder Mapping | Prolifiq, OrgChartHub, DemandFarm | Visual org charts, role tagging | CRM-dependent, no AI, no project tracking, no comms logging |
| Revenue Intelligence | Clari, Aviso | Forecasting, pipeline analytics | No relationship depth, enterprise-only pricing |

AccountOS occupies the convergence point: interactive org charts at scale, relationship scoring without enterprise complexity, AI-driven next-step recommendations, and deployment in days rather than months.

---

## 3. Product Vision & Positioning

### 3.1 Vision Statement

> *AccountOS makes every account team member as knowledgeable about a customer as the person who has worked with them the longest — and smarter about what to do next than any individual could be alone.*

### 3.2 Core Design Principles

1. **Org chart as home base.** The interactive org chart is the primary navigation paradigm. Every insight, note, project, and recommendation is accessible from its human context.
2. **Capture at the speed of thought.** Adding a contact, logging a call, or capturing a meeting note must take fewer than 30 seconds via keyboard shortcuts and smart defaults. If it feels like data entry, adoption dies.
3. **AI as copilot, not autopilot.** Every AI suggestion is transparent (confidence badge), explainable ("Why?" link citing specific notes), and requires human confirmation. Suggestions live in a collapsible side panel, never auto-executing.
4. **Progressive disclosure.** Show the minimum needed at each level. Compact org chart nodes show only name, title, role badge, sentiment, and last-contact date. All deeper intelligence lives in the slide-over panel. Complexity is available but never forced.
5. **Zero-friction adoption.** The tool must deliver value on day one with manual data entry alone, without requiring any integrations or imports.

### 3.3 Deployment Model

**Phase 1** deploys as a locally running web application (Node.js backend, React frontend, SQLite database) that can run on a single laptop for demonstration or on an internal server for team access. Dark mode by default with light mode toggle, built from day one with CSS variables and Tailwind's `dark:` prefix. This removes all procurement, security review, and IT approval barriers.

**Phase 2** migrates document storage to SharePoint, syncs calendar data via Microsoft Graph API, and ingests Copilot meeting notes.

**Phase 3** explores broader portfolio rollout and potential hosted deployment if internal validation succeeds.

---

## 4. Target Users & Personas

| Persona | Role | Primary Needs | Key Pain Points |
|---|---|---|---|
| Alex the Account Manager | Primary daily user (3–10 per team) | Log interactions, update stakeholder intel, track project stages, prepare for meetings | Spends 30+ min/week updating scattered docs; forgets who said what; no visibility into colleague's relationships |
| Morgan the Account Director | Team leader, reviews portfolio | Dashboard of account health, coverage gaps, pipeline value, team allocation | Cannot see team-wide engagement patterns; surprised by churn; manually aggregates status from AMs |
| Sam the Sales Engineer | Technical counterpart on deals | Track technical stakeholders, map customer tech stack, log technical discovery notes | Tech context lost between pre-sale and post-sale; no record of customer's tech preferences or affinities |
| Jordan the Executive Sponsor | Senior leader, occasional user | Glanceable account health, relationship strength with C-suite, risk alerts | Needs 60-second account briefing before executive meetings; currently gets verbal download from AM |

---

## 5. Functional Requirements

Requirements are organized by capability area and prioritized using MoSCoW (Must/Should/Could/Won't for v1).

### 5.1 Interactive Org Chart

The org chart is AccountOS's signature feature and primary navigation paradigm. It renders customer organization hierarchies as interactive, metadata-rich node graphs.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| OC-01 | Display contacts as interactive node cards showing: name, title, stakeholder role badge, sentiment dot, last-contact date. Department indicated via left-border accent bar color. | Must | This is the compact view — all other metadata (desires, tech affinities, background) lives in the slide-over panel only |
| OC-02 | Drag-and-drop to reposition contacts within hierarchy (change reporting lines) | Must | Move single node or entire subtree; animated transitions (300–500ms); undo via Cmd+Z |
| OC-03 | Add new contact directly on org chart via click-to-add on any node | Must | Quick-add modal: name, title, department, reports-to (auto-set to clicked node) |
| OC-04 | Department grouping with color-coded accent bars on node cards | Must | Each department gets a distinct color; legend visible on chart |
| OC-05 | Department containers (optional rounded-rectangle groups) for visual clustering | Should | Collapsible; show aggregate contact count when collapsed |
| OC-06 | Multiple edge types: solid (direct report), dashed (dotted-line), blue dotted (influence), red dashed (friction/blocking) | Must | Toggle edge types on/off via filter controls |
| OC-07 | Zoom, pan, and minimap for navigating large (50–100 contact) charts | Must | Keyboard shortcuts: Cmd+/- for zoom, arrow keys for pan, Cmd+0 to fit |
| OC-08 | Collapse/expand subtrees with subordinate count badges (+N reports) | Must | Essential once orgs exceed 50 contacts |
| OC-09 | Search within org chart to locate and zoom to a specific contact | Should | Typeahead search; matching node highlighted and centered |
| OC-10 | Placeholder "ghost nodes" for undiscovered stakeholders | Should | Dashed-border nodes labeled by expected role; convertible to real contacts |
| OC-11 | Export org chart as PNG or PDF | Could | For inclusion in account plans and executive briefings |

### 5.2 Stakeholder Intelligence

Each contact carries rich, structured metadata that goes far beyond a traditional CRM. The goal is to capture the qualitative intelligence that currently lives only in account managers' heads.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| SI-01 | Contact profile with structured fields: name, title, department, email, phone, LinkedIn URL, background summary, photo | Must | LinkedIn URL stored for future enrichment; background is free-text |
| SI-02 | LinkedIn profile capture: structured form mirroring LinkedIn fields (current role, previous roles, education, skills) populated manually by AM during initial research | Must | Semi-manual workflow for v1: AM pastes LinkedIn URL, fills structured form during research (2–3 min per contact). Phase 2: Proxycurl API enrichment at ~$0.01–0.03/profile |
| SI-03 | Stakeholder role classification (MEDDPICC-aligned): Champion, Economic Buyer, Decision Maker, Technical Evaluator, Influencer, Executive Sponsor, Coach, End User, Blocker, Gatekeeper | Must | Contacts can hold multiple roles across different projects |
| SI-04 | Sentiment tracking: Advocate, Supportive, Neutral, Resistant, Blocker | Must | Displayed as color-coded dot on org chart nodes |
| SI-05 | Influence level: High, Medium, Low | Must | Affects AI weighting when recommending engagement priorities |
| SI-06 | Desires/motivations log: structured notes on each contact's goals (technical, strategic, career, personal) | Must | Categorized by type with free-text description; timestamped entries |
| SI-07 | Relationship strength score: 0–100 composite based on recency, frequency, breadth, sentiment, and responsiveness | Should | Rule-based scoring engine; displayed as gauge on profile |
| SI-08 | Technology affinity tags: tag contacts with technologies they advocate, evaluate, or decide on | Should | Enables queries like "Who at Acme knows Kubernetes?" |
| SI-09 | Affinity scoring for internal team members: track each customer contact's comfort/preference for specific people on your team | Should | Scale: Strong Positive / Positive / Neutral / Negative; informs team assignment |

### 5.3 Department Intelligence

Departments are first-class entities with their own strategic context, not just grouping labels.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| DI-01 | Department entity with: name, color code, organization | Must | Minimum viable entity for org chart grouping |
| DI-02 | Department Brief: mission/focus field (rich text) describing what this department does and why it matters | Must | e.g., "The Cloud Center of Excellence is focused on cost-cutting this year" |
| DI-03 | Current strategic priorities (structured list with descriptions) | Must | e.g., "Migrate 80% of workloads to AWS by Q4" — explains why contacts in this dept behave the way they do |
| DI-04 | Budget cycle timing: fiscal year, budget approval window, renewal dates | Should | Helps time proposals and expansion conversations |
| DI-05 | Key initiatives: named initiatives with status and description | Should | Cross-referenced with projects; helps AMs understand internal client priorities |
| DI-06 | Department-level coverage score: what percentage of known contacts have been engaged in the last 30/60/90 days | Should | Surfaces on dashboard and account overview |

### 5.4 Project & Engagement Management

Projects represent any defined engagement: active delivery, ongoing managed services, presales pursuits, or strategic initiatives. Each links to an organization, contacts with defined roles, and a lifecycle stage.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| PM-01 | Create projects with: name, description, organization, department, type (Presales / Active / Ongoing / Strategic), estimated value | Must | Types reflect the software services lifecycle |
| PM-02 | Stage tracking with customizable pipeline: Identified → Qualifying → Proposing → Negotiating → Won → Delivering → Complete (presales) or Active → At Risk → Expanding → Stable (delivery) | Must | Drag cards between stages on Kanban board |
| PM-03 | Tag contacts to projects with roles: Technical Owner, Business Owner, Executive Sponsor, User, Evaluator, Approver, Influencer, Blocker | Must | Many-to-many: contacts on multiple projects with different roles |
| PM-04 | Assign internal team members to projects with roles: Lead, Technical, Commercial, Support | Must | Links to internal team roster |
| PM-05 | Project health status: Green (On Track), Amber (Monitor), Red (At Risk) with manual override and AI-suggested status | Must | RAG uses color + shape + text for accessibility (● Green, ◆ Amber, ▲ Red) |
| PM-06 | Contract status field: Proposed, Verbal Commit, Contracted, Invoicing | Must | Distinct from stage; a project can be in "Delivering" stage with "Contracted" status. Dashboard shows pipeline value broken down by contract confidence level |
| PM-07 | Project notes: rich-text notes associated with a project, timestamped, attributed to author | Must | Supports AI scanning for action items and sentiment |
| PM-08 | Multi-threading / Coverage Score: display how many of the recommended stakeholder roles are engaged on this project (e.g., "3 of 6 recommended roles") with missing roles called out explicitly | Must | Flags single-threaded deals; research shows 25%+ higher win rates with multi-threaded engagement |
| PM-09 | Potential future value tracking: estimated contract value for pipeline projects | Should | Feeds dashboard revenue projections; broken out by contract status |
| PM-10 | Project timeline/milestone tracking | Could | Lightweight milestone list; not a full PM tool |

### 5.5 Handoff Brief (Living Document)

A primary pain point for software services is the information black hole during presales-to-delivery handover. The Handoff Brief is an AI-generated, living compilation that starts accumulating from the first presales conversation and evolves as intelligence is added.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| HB-01 | Auto-generated Handoff Brief for any project, compilable at any point, containing: all tagged contacts with roles/desires/sentiment, all meeting notes in chronological order, all action items (open and completed), tech stack context, linked documents, and AI-synthesized summary of customer objectives and concerns | Must (Phase 2) | This is the single most impactful feature for presales-to-delivery handoff. "Never do a handoff from memory again." |
| HB-02 | Brief evolves over time: re-generate at any point to include newly added notes, contacts, and project updates | Must (Phase 2) | Not a one-time snapshot; a living document that gets richer with every interaction |
| HB-03 | Exportable as PDF or shareable link | Should (Phase 2) | For delivery team members who may not have AccountOS access initially |
| HB-04 | AI-synthesized executive summary at the top: 3–5 paragraphs covering what the customer wants, who the key players are, what risks exist, and what's been promised | Should (Phase 2) | Generated from all accumulated notes and communications |
| HB-05 | Manual annotation: delivery team can add notes and questions directly on the brief | Could (Phase 2) | Creates a feedback loop between presales and delivery |

### 5.6 Communication Logging

Every interaction with a customer contact is captured in a unified activity timeline. The system prioritizes near-zero friction logging.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| CL-01 | Log communication entries with: type (In-Person Meeting, Video Call, Phone Call, Email, Coffee/Meal, Message/Chat, Conference), participants, date/time, summary, detail notes | Must | Quick-add via Cmd+L from any page; must genuinely take <30 seconds |
| CL-02 | Tag communications with associated projects or initiatives | Must | Multi-select tagging; untagged comms still appear on contact timeline |
| CL-03 | Unified reverse-chronological activity timeline on each contact profile | Must | Shows all interaction types with icon differentiation and expandable detail |
| CL-04 | Filter timeline by communication type, project, date range, and participant | Must | Persistent filters with clear-all button |
| CL-05 | Communication entries stored on each participating contact's record automatically | Must | Log once, appears on all tagged contacts and projects |
| CL-06 | Next steps / planned actions: schedule future interactions with contacts, with type, date, notes, and reminder | Must | Upcoming items surface on dashboard and contact profile |
| CL-07 | Quick sentiment tag on each communication: Positive, Neutral, Negative | Should | Feeds relationship scoring and AI analysis |
| CL-08 | Attach links to communication entries | Should | Paste a URL to a deck, proposal, or recording — no file uploads in v1 |

### 5.7 Meeting Notes

Meeting notes are first-class objects that bridge communication logging and stakeholder intelligence. The capture experience must be fast enough to use during a live meeting.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| MN-01 | Create meeting note with: date, attendees (auto-suggested from calendar if available), associated project, location/medium | Must | Pre-populated from calendar data when integration is available |
| MN-02 | Structured capture template: Agenda, Discussion, Per-Person Notes, Action Items, Next Steps | Must | Per-Person Notes is the key differentiator |
| MN-03 | Per-person quick-note: click attendee's name to add tagged notes about their specific wants, reactions, and commitments | Must | Notes auto-link to that contact's profile and desires log |
| MN-04 | Action items with assignee, due date, and status (Open/In Progress/Done) | Must | Surface in dashboard and contact next-steps |
| MN-05 | AI auto-extraction of action items, sentiment per attendee, key topics, and risk signals from free-text notes | Should | Runs on save; user confirms/edits extracted items |
| MN-06 | Link meeting notes to one or more projects | Must | Cross-referenced on project detail page |
| MN-07 | Template library for common meeting types: Discovery, QBR, Technical Review, Executive Briefing, Presales Demo | Could | Pre-populate agenda sections and suggested discussion points |

### 5.8 Document Linking (Simplified for v1)

For Phase 1, document management is intentionally minimal: just bookmarks attached to the things they're about. No file uploads, no internal storage, no search across documents. A full document hub is deferred to Phase 3+.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| DM-01 | Attach links (URLs) to any entity: organizations, contacts, projects, communications, departments | Must | Paste a SharePoint/Google Drive/any URL with a label and type tag |
| DM-02 | Link type tags: Proposal, SOW, Contract, Presentation, Technical Doc, Meeting Recording, Other | Should | Filterable on entity pages |
| DM-03 | Links visible on the entity they're attached to (in a "Links" section on each profile/detail page) | Must | No centralized document hub in v1 |
| DM-04 | Centralized document/link hub with search and filtering | Could (Phase 3) | Defer until there's enough linked content to justify a dedicated view |

### 5.9 Technology Stack Mapping

A lower-priority but strategically differentiating feature. No competing tool connects technology intelligence to individual contacts.

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| TS-01 | Add technologies to an organization with: name, category (CRM, Cloud, Analytics, Engineering, Security, etc.), status (Active, Recently Added, Removed), confidence level | Should | Categorized grid display with logos/icons |
| TS-02 | Tag contacts with technology affinities: Expert, Advocate, Evaluator, Decision Maker for that tech | Should | Enables team matching and targeted conversations |
| TS-03 | Stack overlap analysis: compare your company's tech capabilities with the customer's stack | Could | Side-by-side comparison highlighting integration, displacement, and gap opportunities |
| TS-04 | Enrichment via BuiltWith or similar API for auto-detecting web-facing technologies | Could | Future integration; manual entry for v1 |

### 5.10 Internal Team Management

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| IT-01 | Internal team roster with: name, role, expertise areas, current project assignments | Must | Team members are distinct from customer contacts |
| IT-02 | Assign team members to projects with roles: Lead, Technical, Commercial, Support | Must | Visible on project detail page |
| IT-03 | Assign team members as primary contacts for specific customer stakeholders | Should | Creates explicit relationship ownership |
| IT-04 | Track stakeholder affinity for internal team members | Should | Feeds AI recommendations for team assignment |
| IT-05 | AI-recommended team assignments based on relationship history, expertise match, and stakeholder affinity | Could | Scoring matrix across multiple dimensions |

### 5.11 Executive Dashboard

| ID | Requirement | Priority | Notes |
|---|---|---|---|
| DB-01 | Portfolio overview: all accounts with health status (RAG), total contacts, active projects, pipeline value (broken down by contract status), last engagement date | Must | Card-based responsive layout; click to drill into account |
| DB-02 | Project pipeline by stage with aggregate values, filterable by contract status (Proposed vs. Verbal Commit vs. Contracted) | Must | Kanban or funnel view; directors can see how "real" the pipeline is |
| DB-03 | Engagement alerts: contacts not contacted in 30+ days, declining sentiment, single-threaded projects (low coverage score) | Must | Prioritized list with one-click action |
| DB-04 | Department coverage map: which departments within each account have active engagement | Should | Heatmap or matrix showing coverage depth |
| DB-05 | My upcoming actions: next-steps due this week across all accounts | Must | Personal task list with context links |
| DB-06 | AI insights panel: top 5 recommended actions with confidence badges (e.g., "85% confident") and "Why?" links citing specific notes/data points | Should | Collapsible panel; every suggestion must be explainable |
| DB-07 | Revenue at risk: projects with Red/Amber status and their values, broken out by contract status | Should | Sorted by value descending |
| DB-08 | Account health export: one-page PDF/slide per account summarizing health score, key contacts, engagement gaps, active projects, and coverage scores | Should | The artifact that gets passed around in leadership reviews and creates pull from people who haven't seen the tool |
| DB-09 | Team activity summary: interactions logged per team member per week | Could | For directors monitoring engagement levels |

---

## 6. Information Architecture & Navigation

### 6.1 Navigation Structure

AccountOS uses a collapsible left sidebar (Linear/Notion style) as primary navigation. Dark mode by default with light mode toggle.

| Nav Item | Icon | Description |
|---|---|---|
| Dashboard | Home | Personalized portfolio overview with alerts, tasks, and AI suggestions |
| Accounts | Building | Master list of customer organizations with health indicators → click enters Account 360° |
| Contacts | Users | Cross-account people database with search and filtering |
| Projects | Briefcase | All engagements across accounts with stage and coverage score tracking |
| Communications | MessageSquare | Unified activity log across all accounts and contacts |
| Tech Stacks | Layers | Cross-account technology intelligence (Phase 2+) |
| My Team | UserCheck | Internal team roster and assignments |
| AI Assistant | Sparkles | Conversational interface for querying account data (persistent side panel) |

### 6.2 Account 360° Detail Page

The Account 360° page is the hub for all information about a single customer. Horizontal tab navigation:

- **Overview Tab:** Key metrics (health score, total contacts, active projects, pipeline value by contract status, days since last contact), recent activity feed, risk alerts, AI-suggested next steps with confidence badges and citations.
- **Org Chart Tab:** Full interactive org chart. Default landing for relationship-focused users. Clicking a node opens the contact's slide-over profile panel without leaving the chart.
- **Projects Tab:** All projects in Kanban (by stage) or list view. Coverage scores visible on each project card. Create new project, update stages, view team assignments.
- **Communications Tab:** Unified timeline of all interactions with anyone at this account.
- **Departments Tab:** Department briefs showing mission, strategic priorities, budget cycle, key initiatives, and department-level coverage scores.
- **Tech Stack Tab:** Categorized grid of technologies in use, with contact affinity tags. (Phase 2+)
- **Health Tab:** Trend charts for engagement frequency, sentiment, and relationship scores over time.

### 6.3 Global Shortcuts & Quick Actions

| Shortcut | Action | Details |
|---|---|---|
| Cmd+K | Global search | Typeahead across accounts, contacts, projects, notes, links |
| Cmd+N | Quick-add contact | Modal with name, title, account, reports-to fields |
| Cmd+L | Log communication | Modal with type, contacts, project tags, notes |
| Cmd+M | New meeting note | Opens meeting note editor with today's date |
| Cmd+P | New project | Modal with name, account, type, stage, value, contract status |
| Cmd+/ | Open AI Assistant | Opens side panel for conversational queries |
| Cmd+0 | Fit org chart | (Org chart context) Fit chart to viewport |
| Cmd+Z | Undo | (Org chart context) Undo last org chart action |
| J/K | Navigate lists | Move up/down in any list view |
| Escape | Close | Close any modal, panel, or search overlay |

---

## 7. Page-by-Page UX Specifications

### 7.1 Dashboard

Follows the inverted-pyramid principle: portfolio-level health at a glance, then drill-down. Responsive card grid. Dark mode default.

**Top Row (KPI Cards):** Total Accounts, Contacts Managed, Active Projects, Pipeline Value (with contract status breakdown on hover), Average Health Score (0–100 with trend arrow), Overdue Actions (red if >0).

**Second Row (Two-Column Split):** Left: "My Actions This Week" — prioritized list of upcoming meetings, follow-ups, and overdue tasks with one-click complete/reschedule. Right: "AI Insights" — top 5 AI-generated recommendations. Each shows: recommendation text, confidence badge (e.g., "85%"), accept/dismiss/snooze controls, and "Why?" link that expands to show the specific meeting notes, data points, or rules that drove the suggestion.

**Third Row:** Account Health Matrix — table showing account name, health RAG status (color + shape + text), contact count, last engagement, pipeline value (by contract status), active projects, coverage score, and trend indicator. Sortable by any column. Click row to navigate to Account 360°.

**Fourth Row:** Project Pipeline mini-Kanban (counts and values by stage). Engagement Heatmap (accounts × departments, showing coverage density).

### 7.2 Org Chart Page

AccountOS's signature page. Must feel as polished as Figma or Miro.

**Canvas:** Full-viewport interactive canvas via React Flow. Dark background (matching app theme) with subtle grid dots. Infinite canvas with zoom (mouse wheel, pinch, Cmd+/–), pan (click-drag, arrow keys), and fit-to-view (Cmd+0).

**Node Cards (Compact — 5 data points only):**
- 120px × 80px rounded rectangles with dark surface background
- Left edge: 4px accent bar in department color
- Content: avatar circle (36px, initials if no photo), name (bold, 13px), title (regular, 11px, muted)
- Bottom strip: role badge pill (e.g., green "Champion"), sentiment dot, last-contact text (green <7d, yellow 7–30d, red >30d)
- Everything else (desires, tech affinities, background, relationship score) appears only in the slide-over panel
- Hover: subtle elevation + "View Profile" overlay
- Click: opens slide-over contact panel

**Slide-Over Panel (400px, from right):** Full contact profile without navigating away. Profile header, tabbed content (Overview, Activity, Notes, Projects, Links), quick-action buttons (Log Call, Schedule Meeting, Add Note).

**Toolbar (Top):** Department filter pills (color-coded, toggleable), edge type toggles, search bar, zoom controls, add-contact button, export button.

**Drag-and-Drop:** Click-hold 200ms to initiate. During drag, valid parent nodes highlight with blue drop-target. Release to reparent. Undo via Cmd+Z (50-action stack).

**Context Menu (Right-Click):** On node: Add Subordinate, Add Peer, Edit Contact, Change Department, Remove from Chart, View Full Profile. On edge: Change Relationship Type, Remove Connection. On empty space: Add New Contact Here.

### 7.3 Contact Profile Page

Accessible via org chart slide-over or full page from Contacts list. Header + tabbed layout.

**Header:** Large avatar (80px), name (24px bold), title, department badge, organization (clickable), stakeholder role pills, sentiment indicator, relationship strength gauge (0–100). Action bar: Email, Call, Schedule Meeting, Add Note, Edit.

**Tabs:**
- **Overview:** Desires/motivations log (categorized: Technical, Strategic, Career, Personal), LinkedIn profile data (structured fields), background summary, technology affinities, affinity scores for internal team members.
- **Activity:** Unified timeline of all communications, meeting notes, and status changes. Filterable by type, project, date range.
- **Projects:** All projects this contact is tagged on with their role, project status, and coverage score.
- **Notes:** All notes mentioning or tagged to this contact, including per-person meeting notes.
- **Links:** URLs attached to this contact with type labels.
- **Next Steps:** Planned actions with dates and status.

### 7.4 Project Detail Page

**Header:** Project name, type badge (Presales/Active/Ongoing/Strategic), stage badge, health RAG status, contract status badge (Proposed/Verbal Commit/Contracted/Invoicing), estimated value, organization link, coverage score (e.g., "3 of 6 roles engaged — missing: Executive Sponsor, Technical Evaluator, Economic Buyer"). Action bar: Edit, Add Note, Add Team Member, Change Stage, Generate Handoff Brief.

**Content:** Left column (60%): project description, notes timeline, communication log filtered to this project. Right column (40%): tagged contacts grouped by role, internal team assignments, missing role indicators (ghost slots for unengaged roles), milestones (if tracked), links.

### 7.5 Department Detail Page

**Header:** Department name (with color accent), organization link, contact count, coverage score (% engaged in last 30/60/90 days).

**Department Brief section:** Mission/focus (rich text), strategic priorities (structured list), budget cycle timing, key initiatives with status. This section answers: "What is this department trying to accomplish and why does that matter for us?"

**Contacts list:** All contacts in this department with compact cards showing role, sentiment, last contact. Link to view these contacts on the org chart (filtered view).

### 7.6 Meeting Notes Editor

Designed for speed — must support real-time capture during a meeting.

**Header:** Date (auto-set to today), meeting type dropdown, associated project (typeahead), attendees (multi-select from contacts with typeahead and quick-add for new contacts).

**Sections (collapsible):**
- **Agenda:** Bullet list
- **Discussion:** Rich text free-form
- **Per-Person Notes:** One collapsible sub-section per attendee with their photo/name, containing: free-text area + structured fields for wants, commitments, and reactions. These notes auto-flow to the contact's desires log.
- **Action Items:** Structured rows: description, assignee (dropdown), due date, status
- **Next Steps:** Follow-up meetings/calls to schedule

**AI Assist Bar:** On save, a bar appears: "AI has extracted 3 action items and 2 follow-ups. Review?" Each extracted item shows a confidence badge and can be accepted, edited, or dismissed individually. Accepted items auto-create entries in the action items and next-steps systems.

---

## 8. AI Features & Intelligence Engine

### 8.1 Architecture

| Tier | Mechanism | Scope | Estimated Cost |
|---|---|---|---|
| Rule-Based Scoring | Configurable threshold rules evaluated nightly | Relationship scores, engagement gap alerts, health scores, coverage scores | $0 (runs locally) |
| LLM Analysis | API calls to GPT-4o-mini or Claude Haiku | Meeting note extraction, sentiment analysis, action item identification, handoff brief synthesis | ~$0.01 per meeting; ~$10–20/month for active team |
| RAG Chat | Vector embeddings (Chroma) + LLM generation | Conversational queries about accounts, contacts, projects, history | ~$20–60/month depending on query volume |

### 8.2 Relationship Scoring Engine

Rule-based composite score normalized to 0–100, computed nightly:

- **Recency (25%):** Days since last interaction, exponential decay. Score = 100 × e^(-0.03 × days). Full marks at 0 days, ~50 at 23 days, ~20 at 53 days.
- **Frequency (25%):** Interactions per month versus configurable baseline (default: 2/month). Score = min(100, (actual/baseline) × 100).
- **Breadth (20%):** Number of distinct internal team members who have engaged with this contact in the last 90 days. Score = min(100, (count/target) × 100) where target defaults to 3.
- **Sentiment (20%):** Average sentiment from the 5 most recent communications/notes. Advocate = 100, Supportive = 75, Neutral = 50, Resistant = 25, Blocker = 0.
- **Responsiveness (10%):** Average days to respond to outreach (where measurable). Score = max(0, 100 − (avg_days × 10)).

### 8.3 Coverage Score (Multi-Threading)

Computed per project. Measures how many of the recommended stakeholder roles are actively engaged:

- **Recommended roles per project type:** Presales requires 6 roles (Champion, Economic Buyer, Technical Evaluator, Decision Maker, Influencer, End User). Delivery requires 4 (Technical Owner, Business Owner, Executive Sponsor, User). Configurable per organization.
- **Score:** (Engaged roles / Recommended roles) × 100. Displayed as "3 of 6 roles engaged" with missing roles explicitly named.
- **Threshold alerts:** Below 50% triggers an amber warning. Below 33% triggers a red alert. Single-threaded projects (only 1 role engaged) get a dedicated "Single-Threaded Risk" flag.

### 8.4 AI-Powered Recommendations

Five categories of suggestions, each with a confidence badge and "Why?" citation:

- **Engagement Gaps:** "No one has contacted [Jane Smith, VP Engineering] in 32 days. She was previously engaged bi-weekly. Schedule a touchpoint." *Why: Based on 90-day interaction average of 2.1 contacts/month, now at 0 for current month.*
- **Coverage Risks:** "The infrastructure project at Acme is single-threaded through [Tom Lee]. 4 of 6 recommended roles are unengaged. Consider reaching out to the Economic Buyer and Technical Evaluator." *Why: Coverage score is 33%. Missing roles: Economic Buyer, Technical Evaluator, Influencer, End User.*
- **Sentiment Shifts:** "[Tom Lee] moved from Supportive to Neutral over the last 3 interactions. Investigate potential concerns." *Why: Sentiment tagged as Neutral in March 10 meeting note and March 5 call log, down from Supportive in February.*
- **Follow-Up Reminders:** "3 action items from the March 5th QBR with Acme Corp are overdue. Follow up with [Sarah Chen] on the migration timeline." *Why: Action items created in meeting note dated March 5, due dates of March 10, 11, and 12 all passed.*
- **Team Assignment:** "[Mike on your team] has the strongest relationship with [Acme's CTO] (score: 85) and expertise in cloud architecture. Recommend as technical lead for the infrastructure project." *Why: 12 interactions in Q1, expertise tag match on AWS and Kubernetes, CTO's affinity for Mike rated "Strong Positive."*

### 8.5 Handoff Brief Generation

On demand for any project, the AI compiles all accumulated intelligence into a structured document:

1. **Executive Summary** (AI-synthesized): 3–5 paragraphs covering customer objectives, key players, risks, and commitments made.
2. **Key Contacts:** All tagged contacts with roles, sentiment, desires, and relationship scores.
3. **Chronological Intelligence:** All meeting notes and communications in order, with AI-highlighted key decisions, commitments, and turning points.
4. **Open Items:** All action items (open and completed) with owners and dates.
5. **Tech Context:** Relevant technology stack items and contact affinities.
6. **Linked Documents:** All URLs attached to the project, contacts, or communications.

Regenerable at any point — each generation includes all intelligence added since the last version. Exportable as PDF.

### 8.6 Conversational AI (Chat with Your Data)

Persistent, collapsible side panel accessible via Cmd+/ from any page. Context-aware: queries default to the currently viewed account/project. Example queries:

- "What's the status of all projects at Acme Corp?"
- "When was the last time we met with their VP of Engineering?"
- "Which contacts at Acme haven't been contacted in 30 days?"
- "Summarize what we discussed in our last QBR."
- "Who on our team should lead the conversation with their new CTO?"
- "Generate a handoff brief for the infrastructure project."

Implementation: RAG pipeline with Chroma vector storage, OpenAI/Anthropic embeddings, LangChain orchestration. Every response includes source citations. Estimated latency: 2–5 seconds per query.

---

## 9. Data Model

Hub-and-spoke pattern with Organizations as the primary hub. All entities support soft-delete, audit timestamps (created_at, updated_at, created_by), and optimistic locking.

| Entity | Key Fields | Relationships |
|---|---|---|
| Organization | name, industry, website, description, health_score, health_status (RAG) | Has many: Contacts, Projects, Departments, TechStackItems |
| Department | name, description, color_code, org_id, mission_focus (rich text), strategic_priorities (JSON), budget_cycle_start, budget_cycle_end, key_initiatives (JSON) | Belongs to: Organization. Has many: Contacts |
| Contact | name, title, email, phone, linkedin_url, linkedin_profile (JSON: roles, education, skills), background, photo_url, department_id, org_id, reports_to_id (self-ref), stakeholder_role, sentiment, influence_level, relationship_score | Belongs to: Org, Dept. Reports to: Contact. Has many: Comms, ProjectMembers, Desires, TechAffinities, NextSteps, Links |
| Desire | contact_id, category (Technical/Strategic/Career/Personal), description, date | Belongs to: Contact |
| Project | name, description, type, stage, health_status, contract_status (Proposed/Verbal Commit/Contracted/Invoicing), estimated_value, coverage_score, org_id, department_id | Belongs to: Org. Has many: ProjectMembers, Comms, Notes, Links |
| ProjectMember | project_id, contact_id, role | Junction: Project ↔ Contact with role |
| Communication | type, date, summary, detail, sentiment, created_by | Has many: CommunicationParticipants, CommunicationProjects, Links |
| MeetingNote | date, type, summary, raw_text, project_id, created_by | Has many: MeetingAttendees, ActionItems, PersonNotes |
| PersonNote | meeting_note_id, contact_id, wants, reactions, commitments, notes | Belongs to: MeetingNote, Contact |
| ActionItem | description, assignee_id, due_date, status, source_meeting_id, project_id | Belongs to: MeetingNote (optional), Project (optional), Contact (assignee) |
| TeamMember | name, role, expertise_areas (JSON), email | Has many: ProjectAssignments, StakeholderAssignments |
| TeamAffinity | contact_id, team_member_id, affinity_level (Strong Positive / Positive / Neutral / Negative) | Junction: Contact ↔ TeamMember |
| TechStackItem | org_id, name, category, status, confidence, first_detected, source | Belongs to: Org. Has many: TechAffinities |
| TechAffinity | contact_id, tech_item_id, affinity_type (Expert/Advocate/Evaluator/DecisionMaker) | Junction: Contact ↔ TechStackItem |
| Link | name, url, type_tag, entity_type (polymorphic), entity_id | Polymorphic: attachable to any entity |
| NextStep | contact_id, type (Meeting/Call/Email/Other), date, notes, status, project_id | Belongs to: Contact, optionally Project |

---

## 10. Technical Architecture

### 10.1 Stack Selection

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 18 + TypeScript + TailwindCSS | Industry standard; dark mode via CSS variables + `dark:` prefix from day one |
| Org Chart | React Flow + dagre (auto-layout) | MIT, 28K GitHub stars, React component nodes, custom edges, zoom/pan/minimap |
| State Management | Zustand with undo/redo middleware | Lightweight; 50-action undo stack for org chart operations |
| Backend | Node.js + Express (or Fastify) | Same language as frontend; easy local deployment |
| Database | SQLite (local demo) / PostgreSQL (team deploy) | SQLite for zero-config demo; PostgreSQL for multi-user |
| ORM | Prisma | Type-safe; schema-driven migrations; supports SQLite and PostgreSQL |
| Vector Storage | Chroma (embedded mode) | Lightweight local vector DB for RAG |
| AI/LLM | OpenAI API (GPT-4o-mini for extraction, GPT-4o for chat) or Anthropic Claude | Best price/performance for text analysis |
| RAG Orchestration | LangChain.js | Embedding, retrieval, and generation pipeline |
| Search | Fuse.js (client-side) + pg_trgm (server-side) | Instant typeahead + full-text search at scale |

### 10.2 Local Deployment

Entire application runs on a single machine. Node.js serves API and built React frontend. SQLite stores all data in a single file. Chroma runs embedded. Only external dependency: OpenAI/Anthropic API key for AI features (which gracefully degrade if unavailable). For team deployment, same codebase on an internal server with PostgreSQL. No client installation — browser access only.

### 10.3 Future Integration (Phase 2+)

Microsoft Graph API: calendar sync (auto-populate meeting attendees), email metadata capture (log sent/received without storing content), SharePoint document linking. Copilot meeting notes via Graph transcript endpoint. LinkedIn enrichment via Proxycurl API (~$0.01–0.03/profile). All integrations use OAuth 2.0 with delegated permissions.

---

## 11. Competitive Differentiation

| Differentiator | AccountOS | Gainsight | People.ai | Gong | Affinity | Prolifiq |
|---|---|---|---|---|---|---|
| Interactive org chart (20–100 contacts) | ✓ Core feature | Limited | ✓ (SFDC only) | ✗ | ✗ | ✓ (SFDC only) |
| Relationship scoring | ✓ Rule-based, transparent | ✓ (Staircase AI) | ✓ (ML) | Partial | ✓ (ML, 1–10) | ✗ |
| Coverage / multi-threading score | ✓ Per-project | Partial | ✓ | ✗ | ✗ | ✗ |
| AI next-step with confidence + citations | ✓ | Partial | ✓ | ✓ | ✗ | ✗ |
| Per-person meeting note capture | ✓ | ✗ | ✗ | Partial | ✗ | ✗ |
| Handoff brief generation | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Tech stack + person-tech affinity | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Department strategic context | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Deploy in <1 day | ✓ | ✗ (3–6 months) | ✗ (weeks) | ✗ (weeks) | ✓ | ✗ (requires SFDC) |
| Cost for 5-person team | ~$50–100/mo | ~$50K+/year | ~$50–100K+/year | ~$12–15K+/year | ~$18K+/year | ~$5K+/year |
| Chat with your account data | ✓ RAG-powered | Partial | ✗ | Partial | ✗ | ✗ |
| Dark mode | ✓ Default | ✗ | ✗ | ✓ | ✗ | ✗ |

---

## 12. Phased Delivery Roadmap

### Phase 1: Foundation (Weeks 1–4)

**Goal:** A working demo on 1–2 real accounts that shows core value — visual org charts with stakeholder intelligence.

- Interactive org chart (React Flow): compact node cards (name, title, role, sentiment, last-contact), department color-coding, zoom/pan/minimap, click-to-view slide-over profile
- Contact profiles with MEDDPICC roles, sentiment, influence, desires log, structured LinkedIn fields
- Department entities with brief (mission/focus, strategic priorities)
- Account 360° page with tabbed navigation
- Communication logging with unified timeline and quick-add (Cmd+L)
- Meeting notes editor with per-person capture
- Project management with stage tracking, contract status, and coverage score
- Basic dashboard with account health table, action list, and pipeline by stage/contract status
- Global search (Cmd+K), all keyboard shortcuts
- Link attachment on all entities (polymorphic URLs)
- Dark mode default with light mode toggle
- SQLite database with Prisma ORM

### Phase 2: Intelligence (Weeks 5–8)

**Goal:** Add the AI layer that transforms AccountOS from a data store into an intelligence platform.

- Rule-based relationship scoring engine (nightly computation)
- Coverage score computation and single-threaded deal flagging
- LLM-powered meeting note analysis: action item extraction, sentiment detection, topic identification
- AI recommendation engine with confidence badges and "Why?" citations: engagement gaps, coverage risks, sentiment shifts, follow-up reminders
- Handoff Brief generation (living document, exportable as PDF)
- AI Assistant side panel with RAG-powered conversational queries
- Enhanced dashboard with AI insights panel, engagement heatmap, and account health export (one-page PDF)
- LinkedIn enrichment via Proxycurl API

### Phase 3: Advanced Features (Weeks 9–12)

**Goal:** Deepen org chart interactivity, add team intelligence, and introduce tech stack mapping.

- Drag-and-drop org chart reorganization with undo/redo (50-action stack)
- Multiple edge types: reporting, influence, friction, dotted-line
- Ghost nodes for undiscovered stakeholders
- Internal team roster with project assignments and stakeholder ownership
- Stakeholder affinity scoring for internal team members
- AI-recommended team assignments
- Technology stack mapping with categorized grid, contact tech affinities, and overlap analysis
- Centralized document/link hub (if warranted by usage)

### Phase 4: Integration (Weeks 13–20)

**Goal:** Connect to the enterprise ecosystem for automated data capture.

- Microsoft Graph API: calendar sync, email metadata capture, SharePoint linking
- Copilot meeting note ingestion
- PostgreSQL migration for multi-user team deployment
- Role-based access control (AM vs. Director vs. Executive views)
- Exportable account plans and executive briefings (PDF/PPTX)
- Portfolio rollout: onboard additional accounts

---

## 13. Success Metrics

### 13.1 Adoption (Phase 1–2 targets)

| Metric | Target | Measurement |
|---|---|---|
| Weekly active users | 80%+ of account team | Login and action tracking |
| Contacts entered per account | 50+ within 2 weeks | Database query |
| Communications logged per AM per week | 5+ (up from 0–1) | Activity log count |
| Meeting notes within 24h of meeting | 75%+ of customer meetings | Note timestamp vs. calendar |
| Time to log a communication | <30 seconds average | Client-side timing |
| Time to add a new contact | <45 seconds average | Client-side timing |
| Department briefs completed | 80%+ of active departments | Field completion check |

### 13.2 Intelligence Quality (Phase 2–3 targets)

| Metric | Target | Measurement |
|---|---|---|
| AI action item extraction accuracy | 85%+ accepted without edit | Accept/edit/reject tracking |
| AI recommendation acceptance rate | 40%+ acted upon | Accept/dismiss/snooze tracking |
| Coverage score improvement | 20%+ increase in avg roles engaged per project | Quarterly comparison |
| AI Assistant satisfaction | 70%+ thumbs up | Per-response feedback |
| Handoff Brief usefulness | 80%+ rated "useful" or "very useful" by delivery teams | Survey after each handoff |

### 13.3 Business Impact (6–12 month targets)

| Metric | Target | Measurement |
|---|---|---|
| Account transition time | 50% reduction | Survey + meeting-readiness assessment |
| Stakeholder coverage breadth | 30%+ increase in engaged contacts per account | Unique contacts with 2+ interactions/quarter |
| Expansion pipeline identified | 20%+ increase in qualified opportunities | Pipeline value tracking |
| Churn risk detection lead time | 30+ days earlier identification | Retrospective analysis |
| Single-threaded deal reduction | 50% fewer projects at <33% coverage score | Coverage score tracking |

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Low adoption: AMs don't enter data | High | Critical | <30-second interactions (genuinely measured); start with one enthusiastic AM as champion on a complex account; AI suggestions require data, creating a virtuous cycle |
| Data quality issues | Medium | High | Validation on entry; AI flags inconsistencies; relationship/coverage scores surface gaps visually; weekly team review cadence |
| AI hallucination | Medium | Medium | Every AI output includes confidence badge + source citations; never auto-execute; human confirmation required; thumbs down feedback loop |
| Security concerns with LLM API | Medium | High | AI features optional and disableable; data sent to APIs limited to non-PII summaries; future: local LLM (Ollama) for sensitive environments |
| IT blocks deployment | Medium | Medium | SQLite + local Node.js requires no elevated permissions; fallback: Electron desktop app |
| Org chart performance at 100+ nodes | Low | Medium | React Flow handles 1000+ nodes; dagre in web worker; collapse subtrees to reduce visible count |
| Scope creep | High | Medium | Strict MoSCoW; Phase 1 delivers standalone value; user feedback drives priority; this PRD is the contract |

---

## 15. Appendices

### 15.1 MEDDPICC Role Reference

| Role | Definition | Badge Color | Org Chart Display |
|---|---|---|---|
| Champion | Internal advocate who sells on your behalf | Green | 🏆 |
| Economic Buyer | Person with budget authority | Purple | 💰 |
| Decision Maker | Final yes/no authority | Dark Purple | 🎯 |
| Technical Evaluator | Assesses technical fit | Blue | 🔧 |
| Influencer | Sways opinions without formal authority | Teal | 💡 |
| Executive Sponsor | Senior leader backing the initiative | Gold | ⭐ |
| Coach | Provides internal guidance and political intel | Amber | 🧭 |
| End User | Day-to-day user of delivered solution | Gray | 👤 |
| Blocker | Actively opposing or obstructing | Red | 🚫 |
| Gatekeeper | Controls access to key stakeholders | Dark Gray | 🚪 |

### 15.2 RAG Status System (Accessible)

All health indicators use three redundant channels for accessibility (~8% of male users are color-blind):

| Status | Color | Shape | Text | Hex |
|---|---|---|---|---|
| Healthy / On Track | Green | ● Circle | Healthy | #27AE60 |
| Monitor / Caution | Amber | ◆ Diamond | Monitor | #F39C12 |
| At Risk | Red | ▲ Triangle | At Risk | #E74C3C |

### 15.3 Contract Status Definitions

| Status | Definition | Dashboard Treatment |
|---|---|---|
| Proposed | Value is estimated; no formal agreement | Shown as "Pipeline" — lowest confidence |
| Verbal Commit | Customer has verbally agreed but nothing signed | Shown as "Probable" — medium confidence |
| Contracted | SOW/contract signed; work may or may not have started | Shown as "Committed" — high confidence |
| Invoicing | Work in progress or complete; invoices being sent | Shown as "Revenue" — realized value |

### 15.4 Full Keyboard Shortcuts

| Context | Shortcut | Action |
|---|---|---|
| Global | Cmd+K | Open global search |
| Global | Cmd+N | Quick-add new contact |
| Global | Cmd+L | Log communication |
| Global | Cmd+M | New meeting note |
| Global | Cmd+P | New project |
| Global | Cmd+/ | Toggle AI Assistant panel |
| Org Chart | Cmd+0 | Fit chart to viewport |
| Org Chart | Cmd+Plus/Minus | Zoom in/out |
| Org Chart | Cmd+Z / Cmd+Shift+Z | Undo / Redo |
| Org Chart | Delete/Backspace | Remove selected node (with confirmation) |
| Org Chart | Enter | Open selected node's profile |
| Lists | J/K | Navigate up/down |
| Lists | Enter | Open selected item |
| Anywhere | Escape | Close modal/panel/search |
