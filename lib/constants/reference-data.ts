export interface ReferenceSection {
  heading: string;
  content: string;
  type: 'prose' | 'list' | 'table';
}

export interface ReferenceStepContent {
  stepNumber: number;
  stepLabel: string;
  title: string;
  sections: ReferenceSection[];
}

export const REFERENCE_DATA: ReferenceStepContent[] = [
  {
    stepNumber: 1,
    stepLabel: 'Scope',
    title: 'AI Help Desk — Scope',
    sections: [
      {
        heading: 'Problem',
        content:
          'A small SaaS company receives 200+ customer support emails daily. Every email is manually read, categorized, and routed to the correct support agent by a team lead. This process takes 2–3 hours each morning, delays first responses by an average of 4 hours, and frequently results in tickets being sent to the wrong agent.',
        type: 'prose',
      },
      {
        heading: 'Solution',
        content:
          'Build an AI-powered Help Desk that automatically:\n• Converts incoming emails into structured support tickets.\n• Categorizes each ticket by topic (billing, technical, account, feature request).\n• Assigns tickets to the most appropriate agent based on category and current workload.\n• Provides a dashboard for agents and admins to view, manage, and resolve tickets.',
        type: 'prose',
      },
      {
        heading: 'Out of Scope',
        content:
          '• Live chat or real-time messaging.\n• Customer-facing self-service portal.\n• Integration with third-party tools (Slack, Jira, Salesforce).\n• Multi-language support.\n• SLA tracking and escalation automation.',
        type: 'list',
      },
    ],
  },
  {
    stepNumber: 2,
    stepLabel: 'Requirements',
    title: 'AI Help Desk — Requirements',
    sections: [
      {
        heading: 'Functional Requirements',
        content:
          '1. Ticket Ingestion: The system receives emails via a webhook or polling mechanism and creates a ticket record for each.\n2. AI Categorization: Each incoming ticket is analyzed by an AI model and assigned a category (billing, technical, account, feature request) and a priority level (low, medium, high, urgent).\n3. Auto-Assignment: Tickets are assigned to agents based on their specialization and current open ticket count.\n4. Agent Dashboard: Agents see their assigned tickets, can update status, add internal notes, and mark tickets as resolved.\n5. Admin Dashboard: Admins can view all tickets, reassign tickets, manage agent profiles, and see summary metrics.\n6. Ticket Lifecycle: Tickets move through statuses: open → in_progress → waiting_on_customer → resolved → closed.\n7. Search and Filter: Both dashboards support filtering by status, category, priority, and date range.',
        type: 'list',
      },
      {
        heading: 'Non-Functional Requirements',
        content:
          '• Response time for dashboard loads: under 500ms.\n• AI categorization accuracy target: >85% on initial deployment.\n• System handles up to 1,000 tickets/day without performance degradation.\n• All data encrypted at rest. HTTPS required for all connections.',
        type: 'list',
      },
      {
        heading: 'User Roles',
        content:
          'Admin — Full access: view all tickets, reassign, manage agents, view analytics, configure categories.\nAgent — View assigned tickets, update ticket status, add notes, view own performance metrics.\nSystem — Automated actor: ingests emails, runs AI categorization, performs auto-assignment.',
        type: 'table',
      },
      {
        heading: 'AI Prompt Used to Refine Requirements',
        content:
          '"I\'m building an AI-powered Help Desk that converts customer emails into tickets and auto-routes them. Here is my scope: [pasted scope above]. What requirements am I missing? What edge cases should I consider? What clarifying questions should I answer?"\n\nKey gaps the AI identified:\n• What happens when the AI is unsure about a category? → Added a "needs review" flag and manual override.\n• How are duplicate emails handled? → Added deduplication by email message ID.\n• What if an agent is out of office? → Added availability status per agent.\n• How does the customer know their ticket was received? → Added auto-reply email confirmation.',
        type: 'prose',
      },
    ],
  },
  {
    stepNumber: 3,
    stepLabel: 'MVP',
    title: 'AI Help Desk — MVP',
    sections: [
      {
        heading: 'Must-Have Features (Version 1)',
        content:
          '1. Manual ticket creation via a web form (email ingestion deferred).\n2. AI categorization of ticket text into 4 categories.\n3. Auto-assignment to agents based on category match.\n4. Agent dashboard: view assigned tickets, change status, add notes.\n5. Admin dashboard: view all tickets, basic metrics (open/resolved counts).\n6. Ticket statuses: open, in_progress, resolved, closed.',
        type: 'list',
      },
      {
        heading: 'Deferred to Version 2+',
        content:
          '• Email webhook ingestion (V2).\n• Customer auto-reply confirmations (V2).\n• SLA tracking and escalation rules (V2).\n• Advanced analytics and reporting (V2).\n• Agent availability/out-of-office management (V3).\n• Bulk ticket operations (V3).',
        type: 'list',
      },
      {
        heading: 'MVP Rationale',
        content:
          'The core value proposition is AI-powered categorization and assignment. Email ingestion is a delivery mechanism, not the intelligence. By starting with manual ticket creation, we can validate the AI routing logic without building email infrastructure. If the categorization and assignment work well on manual input, adding email ingestion is a straightforward layer on top.',
        type: 'prose',
      },
    ],
  },
  {
    stepNumber: 4,
    stepLabel: 'Tech Stack',
    title: 'AI Help Desk — Tech Stack',
    sections: [
      {
        heading: 'Technology Choices',
        content:
          'Frontend — Next.js (React): Server-side rendering for fast dashboards. App Router for clean layouts per role.\nStyling — Tailwind CSS: Rapid prototyping of dashboard layouts without custom CSS files.\nBackend — Next.js Server Actions + Route Handlers: Keep the backend in the same repo. Server Actions for mutations, route handlers for the email webhook (V2).\nDatabase — PostgreSQL: Relational model fits tickets, agents, and assignments. Full-text search for ticket content.\nAI Model — Claude API (Anthropic): Structured output for category + priority. Tool use for extracting ticket metadata.\nAuth — NextAuth.js with database sessions: Role-based access (admin vs. agent). Sessions stored in PostgreSQL, not JWT.\nHosting — Vercel + Supabase (PostgreSQL): Zero-config deployment for Next.js. Supabase provides managed PostgreSQL.',
        type: 'table',
      },
    ],
  },
  {
    stepNumber: 5,
    stepLabel: 'Implementation',
    title: 'AI Help Desk — Implementation Plan',
    sections: [
      {
        heading: 'Phase 1: Foundation (Week 1)',
        content:
          '• Initialize Next.js project with TypeScript and Tailwind.\n• Set up PostgreSQL database and create tables: tickets, agents, categories.\n• Implement basic CRUD for tickets: create, read, update, delete.\n• Seed database with sample tickets and 3 test agent accounts.',
        type: 'list',
      },
      {
        heading: 'Phase 2: AI Integration (Week 2)',
        content:
          '• Integrate Claude API for ticket categorization.\n• Build prompt that takes ticket subject + body and returns: category, priority, and confidence score.\n• Add "needs review" flag when confidence is below 70%.\n• Create auto-assignment logic: match category to agent specialization, prefer agents with fewer open tickets.',
        type: 'list',
      },
      {
        heading: 'Phase 3: Agent Dashboard (Week 3)',
        content:
          '• Build agent-specific ticket list view with filters (status, priority).\n• Ticket detail view: full content, status controls, internal notes thread.\n• Implement status transitions with validation (e.g., can\'t go from "closed" back to "open").',
        type: 'list',
      },
      {
        heading: 'Phase 4: Admin Dashboard (Week 4)',
        content:
          '• Build admin overview: all tickets, all agents, summary metrics.\n• Ticket reassignment interface.\n• Agent management: add/edit agent profiles, set specializations.\n• Metrics cards: open ticket count, average resolution time, tickets by category pie chart.',
        type: 'list',
      },
      {
        heading: 'Phase 5: Polish and Deploy (Week 5)',
        content:
          '• Add authentication with NextAuth (admin and agent roles).\n• Error handling, loading states, and empty states throughout.\n• Mobile responsiveness for agent dashboard.\n• Deploy to Vercel, connect Supabase PostgreSQL.\n• Write setup documentation and seed script.',
        type: 'list',
      },
    ],
  },
];
