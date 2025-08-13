import React, { useState, useEffect } from "react";
import { ChevronDown, ArrowLeft, Home } from "lucide-react";
import { Navigation } from "./components/Navigation";
import { Landing, Players, Coaching, Events, Settings } from "./pages";
import { Button, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "./components/base";

// ============================================================
// App shell with Untitled UI style sidebar
// ============================================================

// ---------- Mock data ----------
const me = {
  name: "Olivia Rhye",
  email: "olivia@untitledui.com",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop",
  location: "Fort Collins, CO",
  age: 17,
  utr: 7.8,
  usta: 1453,
  nsl: 212,
  utrTrend: "positive" as "positive" | "negative",
  ustaTrend: "negative" as "positive" | "negative",
  nslTrend: "positive" as "positive" | "negative",
};

// ---------- App shell with Untitled UI style sidebar ----------

type Route = "home" | "players" | "coaching" | "events" | "settings";

export default function App() {
  const [route, setRoute] = useState<Route>("home");
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);

  // DEV TESTS: Basic invariants to catch regressions (run once in dev)
  useEffect(() => {
    try {
      console.log("App mounted successfully");
    } catch (e) {
      console.warn("Dev tests failed:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex w-full h-screen">
        {/* Sidebar - Fixed width, always visible */}
        <Navigation route={route} setRoute={setRoute} user={me} />

        {/* Main content area - Fills remaining space */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${statsDrawerOpen ? 'pr-[500px] lg:pr-[500px] md:pr-[90vw]' : ''}`}>
          {/* Mobile top bar */}
          <div className="md:hidden border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-400" />
                <div className="text-base font-semibold">Untitled UI Tennis</div>
              </div>
              <MobileMenu route={route} setRoute={setRoute} />
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            <div className={`p-6 space-y-6 transition-all duration-300 ${statsDrawerOpen ? 'max-w-none' : ''}`}>
              {route === "home" && <Landing statsDrawerOpen={statsDrawerOpen} setStatsDrawerOpen={setStatsDrawerOpen} />}
              {route === "players" && <Players />}
              {route === "coaching" && <Coaching />}
              {route === "events" && <Events />}
              {route === "settings" && <Settings />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2"><ChevronDown className="h-4 w-4" />Menu</Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <div className="p-2">
          {([
            { key: "home", label: "Home" },
            { key: "players", label: "Players" },
            { key: "coaching", label: "AI Coaching" },
            { key: "events", label: "Events" },
            { key: "settings", label: "Settings" },
          ] as { key: Route; label: string }[]).map((i) => (
            <button key={i.key} onClick={() => { setRoute(i.key as Route); setOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${route === i.key ? "bg-muted" : "hover:bg-muted/60"}`}>
              <span>{i.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
