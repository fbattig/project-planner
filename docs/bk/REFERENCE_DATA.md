# Reference Data: AI Help Desk Prototype

This document contains the full content for the "AI Help Desk" example that populates the reference panel. This data should be stored as typed constants in `lib/constants/reference-data.ts` and rendered by the `ReferencePanel` component.

---

## Step 1 — Scope

### Problem Statement
A small SaaS company receives 200+ customer support emails daily. Every email is manually read, categorized, and routed to the correct support agent by a team lead. This process takes 2–3 hours each morning, delays first responses by an average of 4 hours, and frequently results in tickets being sent to the wrong agent.

### Proposed Solution
Build an **AI-powered Help Desk** that automatically:
- Converts incoming emails into structured support tickets.
- Categorizes each ticket by topic (billing, technical, account, feature request).
- Assigns tickets to the most appropriate agent based on category and current workload.
- Provides a dashboard for agents and admins to view, manage, and resolve tickets.

### Boundaries (Out of Scope for V1)
- Live chat or real-time messaging.
- Customer-facing self-service portal.
- Integration with third-party tools (Slack, Jira, Salesforce).
- Multi-language support.
- SLA tracking and escalation automation.

---

## Step 2 — Requirements

### Functional Requirements
1. **Ticket Ingestion:** The system receives emails via a webhook or polling mechanism and creates a ticket record for each.
2. **AI Categorization:** Each incoming ticket is analyzed by an AI model and assigned a category (billing, technical, account, feature request) and a priority level (low, medium, high, urgent).
3. **Auto-Assignment:** Tickets are assigned to agents based on their specialization and current open ticket count.
4. **Agent Dashboard:** Agents see their assigned tickets, can update status, add internal notes, and mark tickets as resolved.
5. **Admin Dashboard:** Admins can view all tickets, reassign tickets, manage agent profiles, and see summary metrics (open count, average resolution time, category breakdown).
6. **Ticket Lifecycle:** Tickets move through statuses: `open` → `in_progress` → `waiting_on_customer` → `resolved` → `closed`.
7. **Search and Filter:** Both dashboards support filtering by status, category, priority, and date range.

### Non-Functional Requirements
- Response time for dashboard loads: under 500ms.
- AI categorization accuracy target: >85% on initial deployment.
- System handles up to 1,000 tickets/day without performance degradation.
- All data encrypted at rest. HTTPS required for all connections.

### User Roles
| Role | Permissions |
|------|-------------|
| **Admin** | Full access: view all tickets, reassign, manage agents, view analytics, configure categories. |
| **Agent** | View assigned tickets, update ticket status, add notes, view own performance metrics. |
| **System** | Automated actor: ingests emails, runs AI categorization, performs auto-assignment. |

### AI Prompt Used to Refine These Requirements
> "I'm building an AI-powered Help Desk that converts customer emails into tickets and auto-routes them. Here is my scope: [pasted scope above]. What requirements am I missing? What edge cases should I consider? What clarifying questions should I answer?"

**Key gaps the AI identified:**
- What happens when the AI is unsure about a category? → Added a "needs review" flag and manual override.
- How are duplicate emails handled? → Added deduplication by email message ID.
- What if an agent is out of office? → Added availability status per agent.
- How does the customer know their ticket was received? → Added auto-reply email confirmation.

---

## Step 3 — MVP

### Must-Have Features (Version 1)
1. Manual ticket creation via a web form (email ingestion deferred).
2. AI categorization of ticket text into 4 categories.
3. Auto-assignment to agents based on category match.
4. Agent dashboard: view assigned tickets, change status, add notes.
5. Admin dashboard: view all tickets, basic metrics (open/resolved counts).
6. Ticket statuses: open, in_progress, resolved, closed.

### Deferred to Version 2+
- Email webhook ingestion (V2).
- Customer auto-reply confirmations (V2).
- SLA tracking and escalation rules (V2).
- Advanced analytics and reporting (V2).
- Agent availability/out-of-office management (V3).
- Bulk ticket operations (V3).

### MVP Rationale
The core value proposition is AI-powered categorization and assignment. Email ingestion is a delivery mechanism, not the intelligence. By starting with manual ticket creation, we can validate the AI routing logic without building email infrastructure. If the categorization and assignment work well on manual input, adding email ingestion is a straightforward layer on top.

---

## Step 4 — Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Frontend** | Next.js (React) | Server-side rendering for fast dashboards. App Router for clean layouts per role. |
| **Styling** | Tailwind CSS | Rapid prototyping of dashboard layouts without custom CSS files. |
| **Backend** | Next.js Server Actions + Route Handlers | Keep the backend in the same repo. Server Actions for mutations, route handlers for the email webhook (V2). |
| **Database** | PostgreSQL | Relational model fits tickets, agents, and assignments. Full-text search for ticket content. |
| **AI Model** | Claude API (Anthropic) | Structured output for category + priority. Tool use for extracting ticket metadata. |
| **Auth** | NextAuth.js with database sessions | Role-based access (admin vs. agent). Sessions stored in PostgreSQL, not JWT. |
| **Hosting** | Vercel + Supabase (PostgreSQL) | Zero-config deployment for Next.js. Supabase provides managed PostgreSQL. |

---

## Step 5 — Implementation Plan

### Phase 1: Foundation (Week 1)
- Initialize Next.js project with TypeScript and Tailwind.
- Set up PostgreSQL database and create tables: `tickets`, `agents`, `categories`.
- Implement basic CRUD for tickets: create, read, update, delete.
- Seed database with sample tickets and 3 test agent accounts.

### Phase 2: AI Integration (Week 2)
- Integrate Claude API for ticket categorization.
- Build prompt that takes ticket subject + body and returns: category, priority, and confidence score.
- Add "needs review" flag when confidence is below 70%.
- Create auto-assignment logic: match category to agent specialization, prefer agents with fewer open tickets.

### Phase 3: Agent Dashboard (Week 3)
- Build agent-specific ticket list view with filters (status, priority).
- Ticket detail view: full content, status controls, internal notes thread.
- Implement status transitions with validation (e.g., can't go from "closed" back to "open").

### Phase 4: Admin Dashboard (Week 4)
- Build admin overview: all tickets, all agents, summary metrics.
- Ticket reassignment interface.
- Agent management: add/edit agent profiles, set specializations.
- Metrics cards: open ticket count, average resolution time, tickets by category pie chart.

### Phase 5: Polish and Deploy (Week 5)
- Add authentication with NextAuth (admin and agent roles).
- Error handling, loading states, and empty states throughout.
- Mobile responsiveness for agent dashboard.
- Deploy to Vercel, connect Supabase PostgreSQL.
- Write setup documentation and seed script.

---

## TypeScript Constant Structure

```typescript
// lib/constants/reference-data.ts

export interface ReferenceStepContent {
  stepNumber: number;
  stepLabel: string;
  title: string;
  sections: {
    heading: string;
    content: string;      // Markdown-formatted content
    type: 'prose' | 'list' | 'table';
  }[];
}

export const REFERENCE_DATA: ReferenceStepContent[] = [
  {
    stepNumber: 1,
    stepLabel: 'Scope',
    title: 'AI Help Desk — Scope',
    sections: [
      { heading: 'Problem', content: '...', type: 'prose' },
      { heading: 'Solution', content: '...', type: 'prose' },
      { heading: 'Out of Scope', content: '...', type: 'list' },
    ],
  },
  // ... steps 2–5
];
```

Populate this constant with the exact content from the sections above. The `ReferencePanel` component reads from this constant and renders the matching step.
