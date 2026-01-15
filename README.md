# EditGrid

A powerful and intuitive web application for viewing, editing, and managing tabular data, primarily CSV files. EditGrid provides a rich user
interface for importing, manipulating, and exporting data with features like virtualized tables, context menus for row/column operations, and
customizable export options.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-editgrid.vercel.app-blue)](https://editgrid.vercel.app/)

## Features

- **CSV Import:** Import CSV files with options for headers and starting rows.
- **Virtualized Table:** Efficiently display and interact with large datasets using a high-performance virtualized table.
- **Data Editing:** Directly edit cell values within the table.
- **Row/Column Management:** Add, remove, and duplicate rows and columns via a context menu.
- **Column Visibility:** Toggle the visibility of columns to focus on relevant data.
- **Data Export:** Export modified data back to CSV with options to include headers and export only selected rows.
- **Responsive Design:** Works across different screen sizes.
- **Modern UI:** Clean and accessible interface built with shadcn/ui components.

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Build Tool:** Vite
- **Routing:** TanStack Router
- **Table Library:** TanStack React Table, TanStack React Virtual
- **Styling:** Tailwind CSS, shadcn/ui
- **Form Management:** React Hook Form, Zod
- **CSV Parsing:** PapaParse
- **Code Quality:** Oxlint & Oxformat (linting & formatting)
- **Testing:** Vitest
- **Deployment:** Vercel (inferred)

## Getting Started

### Prerequisites

- Node.js 18+
- Bun

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd edit_grid
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
bun dev
```

4. Open [http://localhost:3001](http://localhost:3001) in your browser.

### Build for Production

```bash
bun build
```
