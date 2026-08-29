import type { ReactNode } from "react";
import { container } from "@/modules/shared/lib/constants";

const SHORTCUTS = [
  { keys: "⌘K", action: "Quick find" },
  { keys: "N", action: "New task" },
  { keys: "⌘↵", action: "Save from composer" },
  { keys: "E", action: "Edit selected" },
  { keys: "D", action: "Set due date" },
  { keys: "L", action: "Add label" },
  { keys: "1–5", action: "Switch views" },
  { keys: "?", action: "All shortcuts" },
];

const VIEWS = [
  { id: "today", label: "Today", count: 6, active: true },
  { id: "upcoming", label: "Upcoming", count: 12 },
  { id: "inbox", label: "Inbox", count: 3 },
  { id: "completed", label: "Completed", count: 28 },
  { id: "settings", label: "Settings" },
];

function ViewIcon({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 24 24",
    width: 12,
    height: 12,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (id) {
    case "today":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "upcoming":
      return (
        <svg {...common}>
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      );
    case "inbox":
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      );
    case "completed":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      );
  }
}

function FeatureText({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[22px] font-medium tracking-[-0.02em] text-lp-ink">{title}</h3>
      <p className="mt-3 max-w-[420px] text-[15px] leading-relaxed text-lp-ink-2">{children}</p>
    </div>
  );
}

function StaticTask({
  title,
  priority,
  time,
  labels,
}: {
  title: string;
  priority?: "high" | "med" | "low";
  time?: string;
  labels?: string[];
}) {
  return (
    <div className="task-row">
      <span className="checkbox" aria-hidden="true" />
      <div className="task-content">
        <div className="task-title">{title}</div>
        {(priority || time || labels) && (
          <div className="task-meta">
            {priority && <span className={`priority-dot ${priority}`} />}
            {time && <span className="task-time">{time}</span>}
            {labels?.map((label) => (
              <span key={label} className={`task-label ${label}`}>
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-t border-lp-rule">
      <div className={container}>
        <div className="pt-12 md:pt-16 pb-12 md:pb-16">
          <p className="mb-3.5 font-mono text-[11px] font-medium tracking-[0.08em] text-lp-accent">01 / Features</p>
          <h2 className="max-w-[720px] text-[clamp(30px,4vw,46px)] leading-[1.05] font-medium tracking-[-0.03em] text-lp-ink">
            Everything you need.
          </h2>
        </div>

        <div className="grid items-center gap-8 border-t border-lp-rule py-12 md:grid-cols-2 md:gap-12 md:py-16">
          <FeatureText title="Five views.">
            Today, Upcoming, Inbox, Completed, and Settings. Every place a task can
            live and nothing else — no boards, no dashboards, nothing to configure
            before you start.
          </FeatureText>
          <div className="tl-panel mx-auto w-full max-w-[250px]">
            <aside className="app-sidebar standalone">
              <div className="sidebar-brand">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M7 12 L10 15 L17 8"
                    className="stroke-lp-accent"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Tick
              </div>
              <div className="sidebar-section mt-3">
                <h5>Views</h5>
                {VIEWS.map((view) => (
                  <div key={view.id} className={`sidebar-item${view.active ? " active" : ""}`}>
                    <ViewIcon id={view.id} />
                    {view.label}
                    {"count" in view && typeof view.count === "number" && (
                      <span className="count">{view.count}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="sidebar-footer">
                <div>7 / 10 tasks</div>
                <div className="meter">
                  <span />
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="grid items-center gap-8 border-t border-lp-rule py-12 md:grid-cols-2 md:gap-12 md:py-16">
          <div className="tl-panel order-last p-4 md:order-first">
            <div className="grid gap-2 sm:grid-cols-2">
              {SHORTCUTS.map((shortcut) => (
                <div
                  key={shortcut.keys}
                  className="flex items-center justify-between rounded-lg border border-lp-rule bg-lp-paper px-3 py-2"
                >
                  <kbd>{shortcut.keys}</kbd>
                  <span className="text-[13px] text-lp-ink-2">{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>
          <FeatureText title="Keyboard-first.">
            Every action has a shortcut, and every shortcut is one or two keys.
            Capture, schedule, label, and jump between views without your hands
            leaving the home row.
          </FeatureText>
        </div>

        <div className="grid items-center gap-8 border-t border-lp-rule py-12 md:grid-cols-2 md:gap-12 md:py-16">
          <FeatureText title="Labels &amp; priorities.">
            Color-code tasks across four labels and three priority levels. The things
            that matter stay loud; everything else waits its turn.
          </FeatureText>
          <div className="tl-panel py-2">
            <StaticTask
              title="Draft Q3 OKRs"
              priority="high"
              time="14:00"
              labels={["work"]}
            />
            <StaticTask
              title="Reply to Maya about Q4 budget"
              priority="med"
              labels={["personal"]}
            />
            <StaticTask title="Book flights home" priority="low" labels={["personal"]} />
            <StaticTask title="Pick up dry cleaning" labels={["errand"]} />
            <StaticTask title="Renew tick.dev domain" priority="high" labels={["side"]} />
          </div>
        </div>
      </div>
    </section>
  );
}
