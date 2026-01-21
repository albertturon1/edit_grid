# AGENTS.md - Coding Agent Guidelines

This document provides essential information for AI coding agents working in this repository.

This codebase will outlive you. Every shortcut you take becomes
someone else's burden. Every hack compounds into technical debt
that slows the whole team down.

You are not just writing code. You are shaping the future of this
project. The patterns you establish will be copied. The corners
you cut will be cut again.

Fight entropy. Leave the codebase better than you found it.

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.

## Project Overview

A collaborative spreadsheet/grid editor built with React, TanStack Table, and PartyKit for real-time collaboration using Yjs.

**Tech Stack:** TypeScript, React 18, Vite, TanStack Router/Table/Virtual, Tailwind CSS, shadcn/ui, PartyKit, Yjs, Zod

**Package Manager:** Bun (v1.3.5)

---

## Build, Lint, and Test Commands

### Installation

```bash
bun install
```

### Development

```bash
bun dev          # Start dev server on port 3001
bun party:dev    # Start PartyKit server for collaboration features
```

### Build

```bash
bun build        # Production build
bun serve        # Preview production build
```

### Linting & Formatting

```bash
bun lint         # Run oxlint
bun lint:fix     # Fix lint issues automatically
bun fmt          # Format code with oxfmt
bun fmt:check    # Check formatting without changes
bun tsc          # TypeScript type checking
```

### Testing

**Unit Tests (Vitest):**

```bash
bun unit                                    # Run all unit tests
bun unit:watch                              # Run in watch mode
bun unit src/path/to/file.test.ts           # Run single test file
bun unit --grep "test name pattern"         # Run tests matching pattern
```

**E2E Tests (Playwright):**

```bash
bun e2e                                     # Run all E2E tests
bun e2e tests/import-flow.spec.ts           # Run single E2E test file
bun e2e --project=chromium                  # Run in specific browser
bun e2e --headed                            # Run with browser visible
```

---

## Architecture

### Directory Structure

```
src/
├── components/          # Reusable UI components (NO Y.js imports)
│   ├── ui/              # shadcn/ui primitives
│   └── virtualized-table/
├── features/            # Feature-specific code with data providers
│   ├── room/            # Room feature (Y.js-backed collaborative editing)
│   ├── home/            # Home page
│   └── playground/      # Playground feature (shared demo table)
├── hooks/               # Shared hooks (non-feature-specific)
├── lib/                 # Pure utilities and types
│   ├── table/           # Table interfaces (TableMutations, TableDataSource)
│   ├── imports/         # File parsing (CSV)
│   ├── collaboration/   # Collaboration types
│   └── stores/          # Document stores
├── providers/           # Context providers
├── routes/              # TanStack Router routes (auto-generated)
└── party/               # PartyKit server
tests/                   # E2E tests only (unit tests are co-located)
```

### Key Architectural Rules

1. **Table components have NO Y.js dependencies** - `VirtualizedTable` and all components in `src/components/virtualized-table/` receive data and mutations as props. They never import Y.js or access document stores directly.

2. **Data providers live in features** - Each feature (`room`, `playground`) has a data provider hook that:
   - Accesses Y.js/document stores
   - Returns a `TableDataSource` (standardized interface)
   - Provides `TableMutations` for editing operations

3. **Mutations are optional** - The `TableMutations` interface has all optional fields, enabling read-only tables, cell-edit-only mode, or full editing.

### Data Flow

```
Feature Layer (Y.js knowledge)          Component Layer (Pure React)
─────────────────────────────           ────────────────────────────
useRoomDataProvider(roomId)      →      useVirtualizedTable({ data, mutations })
  ├── documentStore.getActiveDoc         └── Returns: Table<TableRow>
  ├── useYjsTableDocument(yjsDoc)                    │
  ├── useYjsMutations(yjsDoc)                        ▼
  └── Returns: TableDataSource          <VirtualizedTable table={...} />
```

### Core Interfaces

**TableMutations** (`src/lib/table/types.ts`) - Pure mutation functions, no UI concepts:

```typescript
interface TableMutations {
  updateCell?: (rowIndex: number, columnId: string, value: string) => void;
  rows?: {
    add?: (atIndex: number) => void;
    remove?: (index: number) => void;
    duplicate?: (index: number) => void;
  };
  columns?: {
    add?: (afterColumnId: string) => void;
    remove?: (columnId: string) => void;
  };
}
```

**TableDataSource** (`src/lib/table/types.ts`) - Unified provider return type:

```typescript
type TableDataSource =
  | { status: "loading" }
  | { status: "error"; error: { type: string; message: string } }
  | { status: "empty"; onImport: (data: FileImportResult) => void }
  | {
      status: "ready";
      data: TableData;
      metadata: TableSourceMetadata;
      mutations: TableMutations;
      collaboration?: CollaborationInfo;
    };
```

### Hook Naming Convention

| Pattern            | Usage                                              | Example                                            |
| ------------------ | -------------------------------------------------- | -------------------------------------------------- |
| `useYjs*`          | Hooks that receive `Y.Doc` as parameter            | `useYjsTableDocument`, `useYjsMutations`           |
| `use*DataProvider` | Feature data providers returning `TableDataSource` | `useRoomDataProvider`, `usePlaygroundDataProvider` |

---

## Code Style Guidelines

### File Naming Conventions

| Type       | Convention                  | Example                 |
| ---------- | --------------------------- | ----------------------- |
| Components | kebab-case                  | `virtualized-table.tsx` |
| Hooks      | camelCase with `use` prefix | `useCollaboration.ts`   |
| Types      | kebab-case                  | `types.ts`              |
| Unit tests | `*.test.ts`                 | `getBoxes.test.ts`      |
| E2E tests  | `*.spec.ts`                 | `import-flow.spec.ts`   |

### Import Conventions

```typescript
// 1. External libraries first
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

// 2. Type-only imports use `import type`
import type { Table } from "@tanstack/react-table";

// 3. Internal imports use @/ alias
import type { TableRow } from "@/lib/imports/types/table";
import { cn } from "@/lib/utils";

// 4. Relative imports last
import type { HandleOnContextMenuProps } from "./virtualized-table";
```

### TypeScript Guidelines

- **Strict mode is enabled** with `noUncheckedIndexedAccess: true`
- Always handle potentially undefined array/object access
- Use Zod for runtime validation of external data
- Prefer explicit return types for exported functions
- Use `verbatimModuleSyntax` - must use `import type` for type-only imports

### React Patterns

**Context Pattern:**

```typescript
const Context = createContext<ContextValue | null>(null);

export function Provider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ /* ... */ }), [deps]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useContextName() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useContextName must be used within Provider");
  return ctx;
}
```

### Styling

- Use **Tailwind CSS** for all styling
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns for component styling

```typescript
<div className={cn("base-class", isActive && "active-class")} />
```

### Naming Conventions

| Item             | Convention                  | Example                                            |
| ---------------- | --------------------------- | -------------------------------------------------- |
| Components       | PascalCase                  | `VirtualizedTable`                                 |
| Props interfaces | PascalCase + Props          | `VirtualizedTableProps`                            |
| Hooks            | camelCase with `use` prefix | `useCollaboration`                                 |
| Event handlers   | `handle` + event            | `handleOnContextMenu`                              |
| Booleans         | `is`/`has`/`should` prefix  | `isLoading`, `hasError`                            |
| Types from Zod   | `z.infer<typeof schema>`    | `type UserState = z.infer<typeof userStateSchema>` |

---

## Testing Guidelines

### Unit Tests (co-located with source)

```typescript
import { describe, expect, it, vi, afterEach } from "vitest";

describe("functionName", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should do something", () => {
    expect(result).toEqual(expected);
  });
});
```

### E2E Tests (in tests/ directory)

```typescript
import { expect, test } from "@playwright/test";

test("should perform action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("element")).toBeVisible();
});
```

---

## CI Pipeline

The CI runs on PRs and pushes to main/master:

1. **lint** - `bun lint` + `bun fmt:check`
2. **typecheck** - `bun tsc`
3. **unit** - `bun unit`
4. **e2e** - `bun e2e`

Always run these locally before submitting PRs:

```bash
bun lint && bun fmt:check && bun tsc && bun unit
```

---

## Key Files

| File                   | Purpose                         |
| ---------------------- | ------------------------------- |
| `tsconfig.json`        | TypeScript config (strict mode) |
| `.oxlintrc.json`       | Oxlint rules configuration      |
| `.oxfmtrc.json`        | Oxfmt formatter config          |
| `vitest.config.ts`     | Unit test configuration         |
| `playwright.config.ts` | E2E test configuration          |
| `src/routeTree.gen.ts` | Auto-generated (do not edit)    |
