import { useState } from "react";
import { Playground } from "./playground";

export function TablePreview() {
  const [cursorUsers] = useState([
    { name: "Anna", color: "#10b981", row: 1, col: 2 },
    { name: "Mark", color: "#3b82f6", row: 3, col: 4 },
  ]);

  return (
    <section className="px-4 py-20 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">See it in action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive spreadsheet with real-time collaboration indicators
          </p>
        </div>

        {/* Editor toolbar */}
        <div className="flex items-center justify-end p-4 border border-border border-b-0 rounded-t-xl bg-secondary/30">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {cursorUsers.map((user) => (
                <div
                  key={user.name}
                  className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-foreground"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name[0]}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">2 editors online</span>
          </div>
        </div>

        {/* Table container */}
        <div className="border border-border rounded-b-xl overflow-hidden bg-background h-100">
          <Playground />
        </div>

        {/* Status bar */}
        {/* <div className="flex items-center justify-between px-4 py-2 border border-t-0 border-border rounded-b-xl bg-secondary/30 -mt-[1px]">
          <div className="text-xs text-muted-foreground">
            {sampleData.length} rows • {columns.length} columns
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Auto-saving...
            </span>
          </div>
        </div> */}
      </div>
    </section>
  );
}
