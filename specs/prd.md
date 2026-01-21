# Implementation Plan: Table Architecture Refactor

**Source:** `specs/01-table-architecture.md`
**Goal:** Decouple table components from Y.js, create unified `TableDataSource` interface, enable playground feature.

---

## Global Verification Requirement

**Every task MUST pass the following command before being marked as complete:**

```bash
bun tsc && bun unit && bun e2e
```

This ensures:
- TypeScript compilation passes (`bun tsc`)
- All unit tests pass (`bun unit`)
- All E2E tests pass (`bun e2e`)

A task is NOT complete until this verification passes. No exceptions.

---

## Phase 1: Foundation - Types & Interfaces

### [x] 1.1 Create TableMutations and TableDataSource interfaces

**Description:** Create the core type definitions that will unify all data providers. These interfaces are the contract between feature-level data providers and the reusable table components.

**Steps:**
1. Create file `src/lib/table/types.ts`
2. Define `TableMutations` interface with all optional mutation functions:
   - `updateCell?: (rowIndex: number, columnId: string, value: string) => void`
   - `rows?: { add?, remove?, duplicate? }` 
   - `columns?: { add?, remove? }`
3. Define `TableSourceMetadata` interface with `filename` and `firstRowValues`
4. Define `CollaborationInfo` interface with `isReconnecting` and `users` structure
5. Define `TableDataSource` discriminated union type with statuses: `loading`, `error`, `empty`, `ready`
6. Add proper imports from `@/lib/imports/types/table` and `@/lib/imports/types/import`

---

## Phase 2: Refactor Y.js Hooks - Remove UI Coupling

### [x] 2.1 Create useYjsMutations hook with pure function signatures

**Description:** Refactor `useTableContextMenu` into `useYjsMutations`. The new hook returns `TableMutations` interface - pure functions accepting primitive values (rowIndex, columnId) instead of `ExtendedContextMenuPosition`.

**Steps:**
1. Create file `src/components/virtualized-table/hooks/useYjsMutations.ts`
2. Copy logic from `useTableContextMenu.ts` but refactor each function:
   - `addRow(position)` -> `add(atIndex: number)`
   - `removeRow(position)` -> `remove(index: number)` 
   - `duplicateRow(position)` -> `duplicate(index: number)`
   - `addColumn(position)` -> `add(afterColumnId: string)`
   - `removeColumn(position)` -> `remove(columnId: string)`
3. Accept `Y.Doc` as parameter (same as original)
4. Return object matching `TableMutations` interface shape
5. Import `TableMutations` type from `@/lib/table/types`

---

### [x] 2.2 Create useYjsTableDocument hook

**Description:** Refactor `useTableDocument` to accept `Y.Doc` as a parameter instead of accessing `documentStore` internally. This removes the Y.js coupling from the component layer.

**Steps:**
1. Create file `src/components/virtualized-table/hooks/useYjsTableDocument.ts`
2. Copy core observer logic from `useTableDocument.ts` (lines 65-99)
3. Change function signature: `useYjsTableDocument(yjsDoc: Y.Doc)`
4. Remove `documentStore` import and `roomId` parameter
5. Remove draft resolution logic (move to data provider layer)
6. Remove `useTableContextMenu` call (mutations handled separately)
7. Return only `{ data: TableData, metadata: TableSourceMetadata, isLoading: boolean }`
8. Import types from `@/lib/table/types`

---

### [ ] 2.3 Create useYjsPopulateData hook

**Description:** Extract the `populateData` function from `useTableDocument` into a separate hook. This handles writing `FileImportResult` data to Y.js document.

**Steps:**
1. Create file `src/components/virtualized-table/hooks/useYjsPopulateData.ts`
2. Accept `yjsDoc: Y.Doc` as parameter
3. Implement `populateData(importResult: FileImportResult)` function (copy from useTableDocument lines 102-119)
4. Return `{ populateData }`

---

## Phase 3: Refactor TableContextMenu - Accept TableMutations

### [ ] 3.1 Update TableContextMenu to accept TableMutations prop

**Description:** Modify `TableContextMenu` component to receive `mutations: TableMutations` as a prop instead of reading from `table.options.meta.contextMenu`. Extract row/column indices from position internally.

**Steps:**
1. Open `src/components/virtualized-table/table-context-menu.tsx`
2. Add `mutations: TableMutations` to props interface
3. Import `TableMutations` from `@/lib/table/types`
4. Replace `table.options.meta.contextMenu` access with `mutations` prop
5. Create helper to extract `rowIndex` from position:
   ```typescript
   const rowIndex = position.activeCell.type === "cell" 
     ? position.activeCell.row.index 
     : 0;
   ```
6. Create helper to extract `columnId` from position:
   ```typescript
   const columnId = position.activeCell.column.id;
   ```
7. Update each menu item onClick:
   - `mutations.rows?.add?.(rowIndex + 1)` for Add Row
   - `mutations.rows?.remove?.(rowIndex)` for Delete Row
   - `mutations.rows?.duplicate?.(rowIndex)` for Duplicate Row
   - `mutations.columns?.add?.(columnId)` for Add Column
   - `mutations.columns?.remove?.(columnId)` for Delete Column
8. Conditionally render menu items based on mutation availability (e.g., `mutations.rows?.add && <MenuItem...>`)

---

### [ ] 3.2 Update VirtualizedTable to pass mutations to TableContextMenu

**Description:** Modify `VirtualizedTable` to accept `mutations` prop and pass it to `TableContextMenu`. This prepares the component to receive mutations from data providers.

**Steps:**
1. Open `src/components/virtualized-table/virtualized-table.tsx`
2. Add `mutations?: TableMutations` to `VirtualizedTableProps` interface
3. Import `TableMutations` from `@/lib/table/types`
4. Pass `mutations` prop to `<TableContextMenu>` component
5. Keep `table` prop on TableContextMenu for now (needed for other logic)

---

## Phase 4: Create Room Data Provider

### [ ] 4.1 Create useRoomDataProvider hook

**Description:** Create the room-specific data provider that orchestrates Y.js document access, collaboration, data fetching, and mutations. Returns `TableDataSource` interface.

**Steps:**
1. Create directory `src/features/room/hooks/` if not exists
2. Create file `src/features/room/hooks/useRoomDataProvider.ts`
3. Import required dependencies:
   - `documentStore` from `@/lib/stores/documentStore`
   - `useCollaborationSession` from `../components/collaborative-provider`
   - `useYjsTableDocument` from `@/components/virtualized-table/hooks/useYjsTableDocument`
   - `useYjsMutations` from `@/components/virtualized-table/hooks/useYjsMutations`
   - `useYjsPopulateData` from `@/components/virtualized-table/hooks/useYjsPopulateData`
   - Types from `@/lib/table/types`
4. Implement `useRoomDataProvider(roomId: string | undefined)`:
   - Get yjsDoc from `documentStore.getActiveDoc(roomId)`
   - Call `useYjsTableDocument(yjsDoc)`
   - Call `useYjsMutations(yjsDoc)`
   - Call `useYjsPopulateData(yjsDoc)`
   - Get collaboration state from `useCollaborationSession()`
   - Handle draft resolution for local mode (move logic from useTableDocument)
   - Return `TableDataSource` based on state

---

### [ ] 4.2 Update useVirtualizedTable to accept TableMutations

**Description:** Modify `useVirtualizedTable` to accept `mutations: TableMutations` instead of the current `meta: TableMeta`. Bridge to TanStack Table's meta system internally.

**Steps:**
1. Open `src/components/virtualized-table/hooks/useVirtualizedTable.tsx`
2. Change `meta: TableMeta` to `mutations?: TableMutations` in props interface
3. Import `TableMutations` from `@/lib/table/types`
4. Create internal meta object that bridges to TanStack Table format:
   ```typescript
   const tableMeta = useMemo(() => ({
     updateData: mutations?.updateCell,
     contextMenu: {
       addRow: () => {}, // placeholder - context menu now uses mutations directly
       // ... other placeholders
     }
   }), [mutations]);
   ```
5. Pass constructed meta to `useReactTable`

---

### [ ] 4.3 Integrate useRoomDataProvider into useRoomViewState

**Description:** Refactor `useRoomViewState` to use `useRoomDataProvider` instead of directly calling `useTableDocument`. This completes the room integration.

**Steps:**
1. Open `src/features/room/hooks/useRoomViewState.ts`
2. Replace `useTableDocument` import with `useRoomDataProvider`
3. Call `useRoomDataProvider(roomId)` to get `TableDataSource`
4. Update `useVirtualizedTable` call to pass `mutations` from data source
5. Map `TableDataSource` states to existing `RoomViewState` return type
6. Add `mutations` to the ready state return for VirtualizedTable

---

### [ ] 4.4 Wire mutations through Room component

**Description:** Update the Room page component to pass mutations from `useRoomViewState` to `VirtualizedTable`.

**Steps:**
1. Open `src/features/room/room.tsx` (or wherever Room component lives)
2. Extract `mutations` from ready state of `useRoomViewState`
3. Pass `mutations` prop to `<VirtualizedTable>` component

---

## Phase 5: Create Playground Feature

### [ ] 5.1 Create usePlaygroundDataProvider hook

**Description:** Create the playground-specific data provider. Uses hardcoded room ID "playground", auto-seeds demo data when empty, never returns error status.

**Steps:**
1. Create directory `src/features/playground/hooks/`
2. Create file `src/features/playground/hooks/usePlaygroundDataProvider.ts`
3. Define constant `PLAYGROUND_ROOM_ID = "playground"`
4. Implement `usePlaygroundDataProvider()`:
   - Get yjsDoc from `documentStore.getActiveDoc(PLAYGROUND_ROOM_ID)`
   - Call same hooks as room provider: `useYjsTableDocument`, `useYjsMutations`, `useYjsPopulateData`
   - Implement auto-seed logic:
     - Check if data is empty after initial sync
     - If empty, fetch `/customers-1000.csv` (existing demo file)
     - Parse and populate using `populateData`
   - Never return `status: "error"` - keep retrying on connection issues
   - Return `TableDataSource`
5. Handle collaboration via `useCollaboration` hook (not session provider)

---

### [ ] 5.2 Create Playground component

**Description:** Create the standalone playground component that renders a collaborative table on the home page.

**Steps:**
1. Create file `src/features/playground/playground.tsx`
2. Import `usePlaygroundDataProvider` from `./hooks/usePlaygroundDataProvider`
3. Import `useVirtualizedTable` from `@/components/virtualized-table/hooks/useVirtualizedTable`
4. Import `VirtualizedTable` from `@/components/virtualized-table/virtualized-table`
5. Implement `Playground` component:
   - Call `usePlaygroundDataProvider()`
   - Handle loading state (show skeleton or spinner)
   - On ready: call `useVirtualizedTable` with data and mutations
   - Render `<VirtualizedTable>` with table, metadata, and mutations
6. Add appropriate container styling for home page embedding

---

### [ ] 5.3 Add demo data file

**Description:** Ensure demo CSV file exists in public directory for playground auto-seeding.

**Steps:**
1. Verify `/public/customers-1000.csv` exists (it's referenced in home.tsx)
2. If not, create a simple demo CSV with sample data (5-10 rows, 4-5 columns)
3. Ensure file is valid CSV format

---

### [ ] 5.4 Integrate Playground into Home page

**Description:** Add the Playground component to the home page, providing a live collaborative table demo.

**Steps:**
1. Open `src/features/home/home.tsx`
2. Import `Playground` from `@/features/playground/playground`
3. Add playground section below current content or as a new layout section
4. Consider layout: could be a split view, a section below hero, or a toggleable panel
5. Wrap Playground in appropriate container with sizing constraints

---

## Phase 6: Cleanup - Remove Deprecated Code

### [ ] 6.1 Delete old useTableContextMenu hook

**Description:** Remove the original `useTableContextMenu.ts` file that has been replaced by `useYjsMutations.ts`.

**Steps:**
1. Search codebase for imports of `useTableContextMenu`
2. Verify no remaining imports (should all use `useYjsMutations` now)
3. Delete file `src/components/virtualized-table/hooks/useTableContextMenu.ts`

---

### [ ] 6.2 Delete old useTableDocument hook  

**Description:** Remove the original `useTableDocument.ts` file that has been replaced by the new Y.js hooks.

**Steps:**
1. Search codebase for imports of `useTableDocument`
2. Verify no remaining imports (should use `useYjsTableDocument` + `useYjsMutations` + `useYjsPopulateData`)
3. Delete file `src/components/virtualized-table/hooks/useTableDocument.ts`

---

### [ ] 6.3 Remove deprecated types from TanStack Table module augmentation

**Description:** Clean up `tanstack-react-table.d.ts` by removing deprecated types that have been replaced by `TableMutations`.

**Steps:**
1. Open `src/lib/types/tanstack-react-table.d.ts`
2. Remove `ContextMenuAction` type
3. Remove `UpdateData` type
4. Simplify or remove `TableMeta` interface if no longer needed
5. Remove import of `ExtendedContextMenuPosition` if no longer used
6. Keep `ColumnMeta` interface (still needed for className)

---

## Summary

| Phase | Tasks | Purpose |
|-------|-------|---------|
| 1 | 1.1 | Create type foundations |
| 2 | 2.1-2.3 | Refactor Y.js hooks to pure interfaces |
| 3 | 3.1-3.2 | Update TableContextMenu to use TableMutations |
| 4 | 4.1-4.4 | Create and integrate Room data provider |
| 5 | 5.1-5.4 | Create Playground feature |
| 6 | 6.1-6.4 | Remove deprecated code |

**Total Tasks:** 15

**Dependencies:**
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 1
- Phase 4 depends on Phases 1, 2, 3
- Phase 5 depends on Phases 1, 2, 3
- Phase 6 depends on Phases 4, 5
