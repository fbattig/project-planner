# Technology Stack

## Core Dependencies

| Technology | Version | Role | Rationale |
|------------|---------|------|-----------|
| **Next.js** | 16.x | Full-stack framework | App Router provides file-based routing, Server Components reduce client JS, Server Actions eliminate need for separate API layer. |
| **React** | 19.x | UI library | Ships with Next.js 16. Server Components and Actions are first-class. |
| **TypeScript** | 5.x | Language | Strict mode catches bugs at compile time. Essential for typed database results and form validation. |
| **Tailwind CSS** | 4.x | Styling | Utility-first approach keeps styles co-located with markup. No build-time CSS extraction issues. |
| **better-sqlite3** | 11.x | Database driver | Synchronous API is ideal for Server Components and Server Actions. No connection pool needed. Zero config. |
| **Zod** | 3.x | Validation | Schema-first validation for form inputs and Server Action arguments. TypeScript type inference built in. |

## Dev Dependencies

| Tool | Purpose |
|------|---------|
| `eslint` + `@next/eslint-plugin-next` | Linting with Next.js-specific rules |
| `prettier` + `prettier-plugin-tailwindcss` | Code formatting with automatic Tailwind class sorting |

## Explicitly NOT Using

| Technology | Reason |
|------------|--------|
| Prisma / Drizzle / any ORM | Adds abstraction over simple queries. `better-sqlite3` is faster and more transparent for this use case. |
| Redux / Zustand / Jotai | Wizard state is local to the form. URL search params + `useState` are sufficient. |
| NextAuth / Clerk / Auth.js | No authentication in MVP. If added later, use database sessions (not JWT). |
| Docker | MVP runs directly with `npm run dev`. Docker adds deployment complexity not needed for a local tool. |
| Shadcn/UI / Radix | The UI is simple enough to build with plain HTML + Tailwind. Keeps the dependency tree small. |

## Configuration Notes

### Next.js (`next.config.ts`)
```typescript
const config = {
  // better-sqlite3 is a native module, must be externalized
  serverExternalPackages: ['better-sqlite3'],
};
export default config;
```

### Tailwind (`tailwind.config.ts`)
```typescript
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // Custom design tokens defined in UI_SPEC.md
    },
  },
};
```

### TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### SQLite Database Location
- Development: `./data/planner.db` (git-ignored)
- The `data/` directory is created automatically by the migration script if it doesn't exist.
