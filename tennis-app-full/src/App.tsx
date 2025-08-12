import React, { useMemo, useState, useContext, createContext, cloneElement, useEffect, memo } from "react";
import {
  Home as HomeIcon,
  Search,
  Users,
  BarChart2,
  Settings as SettingsIcon,
  ChevronDown,
  Video,
  Upload,
  Paperclip,
  Sparkles,
  MessageSquare,
  MapPin,
  Calendar,
  Trophy,
  ArrowLeft,
  Home,
} from "lucide-react";

// ============================================================
// Minimal local UI primitives (anonymized) so the file runs
// ============================================================
const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Button({ variant = "default", size = "md", className, children, ...props }: any) {
  const variants: any = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-foreground",
    ghost: "bg-transparent",
    link: "bg-transparent underline",
    outline: "border",
  };
  const sizes: any = { sm: "h-8 px-3 text-sm", md: "h-9 px-4", lg: "h-10 px-5" };
  return (
    <button className={cn("inline-flex items-center justify-center rounded-xl shadow-sm transition gap-1", variants[variant] || "", sizes[size] || "", className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ className, ...props }: any) { return <div className={cn("rounded-2xl border bg-card", className)} {...props} />; }
export function CardHeader({ className, ...props }: any) { return <div className={cn("p-4", className)} {...props} />; }
export function CardTitle({ className, ...props }: any) { return <h3 className={cn("text-lg font-semibold", className)} {...props} />; }
export function CardDescription({ className, ...props }: any) { return <p className={cn("text-sm text-muted-foreground", className)} {...props} />; }
export function CardContent({ className, ...props }: any) { return <div className={cn("p-4 pt-0", className)} {...props} />; }

export function Input({ className, ...props }: any) { return <input className={cn("h-9 w-full rounded-xl border px-3 text-sm", className)} {...props} />; }
export function Textarea({ className, ...props }: any) { return <textarea className={cn("min-h-[44px] w-full rounded-xl border p-3 text-sm", className)} {...props} />; }
export function Badge({ className, ...props }: any) { return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", className)} {...props} />; }
export function Separator({ className, ...props }: any) { return <div className={cn("my-2 h-px w-full bg-border", className)} {...props} />; }
export function Label({ className, ...props }: any) { return <label className={cn("text-sm font-medium", className)} {...props} />; }
export function Switch({ defaultChecked, onChange }: any) { return <input type="checkbox" defaultChecked={defaultChecked} onChange={onChange} className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted outline-none transition checked:bg-primary" />; }

export function Avatar({ className, children }: any) { return <div className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted", className)}>{children}</div>; }
export function AvatarImage({ src, alt }: any) { return src ? <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" /> : null; }
export function AvatarFallback({ children }: any) { return <span className="text-xs text-muted-foreground">{children}</span>; }

// --- Simple Dialog ---
const DialogCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
export function Dialog({ open, onOpenChange, children }: any) {
  const [local, setLocal] = useState(!!open);
  const setOpen = (v: boolean) => { setLocal(v); onOpenChange && onOpenChange(v); };
  return <DialogCtx.Provider value={{ open: local, setOpen }}>{children}</DialogCtx.Provider>;
}
export function DialogTrigger({ asChild, children }: any) {
  const ctx = useContext(DialogCtx)!; if (!asChild) return null; return cloneElement(children, { onClick: () => ctx.setOpen(true) });
}
export function DialogContent({ className, children }: any) {
  const ctx = useContext(DialogCtx)!; if (!ctx?.open) return null; return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("relative z-10 w-full max-w-xl rounded-2xl border bg-background p-4", className)}>{children}</div>
    </div>
  );
}
export function DialogHeader({ className, ...props }: any) { return <div className={cn("mb-2", className)} {...props} />; }
export function DialogTitle({ className, ...props }: any) { return <h4 className={cn("text-base font-semibold", className)} {...props} />; }

// --- Simple Sheet ---
const SheetCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);
export function Sheet({ children }: any) { const [open, setOpen] = useState(false); return <SheetCtx.Provider value={{ open, setOpen }}>{children}</SheetCtx.Provider>; }
export function SheetTrigger({ asChild, children }: any) { const ctx = useContext(SheetCtx)!; return cloneElement(children, { onClick: () => ctx.setOpen(true) }); }
export function SheetContent({ className, children }: any) {
  const ctx = useContext(SheetCtx)!; if (!ctx?.open) return null; return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("absolute right-0 top-0 h-full w-[420px] max-w-full border-l bg-background p-4", className)}>{children}</div>
    </div>
  );
}
export function SheetHeader({ className, ...props }: any) { return <div className={cn("mb-2", className)} {...props} />; }
export function SheetTitle({ className, ...props }: any) { return <h4 className={cn("text-base font-semibold", className)} {...props} />; }

// ============================================================
// Optimized header with non-blocking avatar
// ============================================================
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;utf8,\n  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>\n    <rect width='100%' height='100%' fill='%23eee'/>\n    <text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>--</text>\n  </svg>";

const PageHeaderBannerAvatar = memo(function PageHeaderBannerAvatar({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string;
}) {
  const [src, setSrc] = useState<string>(PLACEHOLDER_AVATAR);
  useEffect(() => {
    const realSrc = avatarUrl;
    if (!realSrc) return;
    const load = () => setSrc(realSrc);
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(load, { timeout: 800 });
    } else {
      requestAnimationFrame(load);
    }
  }, [avatarUrl]);

  return (
    <div className="relative flex flex-col px-1 pt-1">
      {/* Gradient banner */}
      <div className="h-40 w-full rounded-xl bg-gradient-to-t from-[#FBC5EC] to-[#A5C0EE] lg:h-60" />

      {/* Content row */}
      <div className="m-auto -mt-12 w-full max-w-[1200px] px-3 lg:-mt-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:gap-5 lg:pb-6">
          {/* Avatar + back on mobile */}
          <div className="flex items-start justify-between">
            <Avatar className="h-16 w-16 lg:hidden">
              <AvatarImage src={src} alt={name} />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Avatar className="hidden h-24 w-24 lg:block">
              <AvatarImage src={src} alt={name} />
              <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <Button variant="link" size="sm" className="translate-y-2 self-end lg:hidden gap-1">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>

          {/* Title + actions */}
          <div className="flex w-full flex-col gap-x-4 gap-y-5 lg:pt-16">
            {/* Breadcrumbs (simple) */}
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-foreground">Home</span>
            </div>

            <div className="flex flex-1 flex-col flex-wrap gap-4 lg:flex-row">
              <div className="flex min-w-60 flex-1 flex-col gap-0.5 lg:gap-1">
                <h1 className="text-xl font-semibold lg:text-3xl">{name}</h1>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" className="hidden lg:inline-flex">Tertiary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button>Primary</Button>
              </div>
              <div className="relative max-w-80 min-w-48 flex-1">
                <Input className="pl-9" placeholder="Search" aria-label="Search" />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

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
};

const suggestedPlayers = [
  { id: 1, name: "Maya Patel", utr: 7.5, location: "Longmont, CO", handed: "Right", style: "Aggressive Baseliner" },
  { id: 2, name: "Dylan Park", utr: 8.1, location: "Loveland, CO", handed: "Left", style: "All Court" },
  { id: 3, name: "Leo Campos", utr: 7.9, location: "Greeley, CO", handed: "Right", style: "Counterpuncher" },
];

const upcomingEvents = [
  { id: 11, name: "USTA L5 Summer Slam", date: "Aug 24", city: "Denver", surface: "Hard" },
  { id: 12, name: "Northern CO UTR 8", date: "Sep 02", city: "Fort Collins", surface: "Hard" },
];

const journey = [
  { id: "j1", type: "match", title: "Won 6-4 6-4 vs J. Cruz", date: "Jul 28", meta: "UTR Verified" },
  { id: "j2", type: "event", title: "Quarterfinals at L6 Poudre Open", date: "Jul 21", meta: "3 matches" },
  { id: "j3", type: "training", title: "AI session: Serve toss drift", date: "Jul 18", meta: "Drill plan saved" },
];

// NEW: Define allPlayers used by <Players/>
interface Player { id: number; name: string; location: string; utr: number; usta: number; nsl: number; dominant?: "L"|"R" }
const allPlayers: Player[] = [
  { id: 101, name: "Maya Patel", location: "Longmont, CO", utr: 7.5, usta: 1660, nsl: 230, dominant: "R" },
  { id: 102, name: "Dylan Park", location: "Loveland, CO", utr: 8.1, usta: 1104, nsl: 180, dominant: "L" },
  { id: 103, name: "Leo Campos", location: "Greeley, CO", utr: 7.9, usta: 1322, nsl: 205, dominant: "R" },
  { id: 104, name: "Maddie Zhou", location: "Boulder, CO", utr: 8.3, usta: 990, nsl: 160, dominant: "R" },
  { id: 105, name: "J. Cruz", location: "Denver, CO", utr: 7.2, usta: 1820, nsl: 260, dominant: "R" },
];

// ---------- Helper UI ----------
const Metric = memo(function Metric({ label, value, sub }: { label: string; value: React.ReactNode; sub?: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        {sub && <p className="text-sm text-muted-foreground">{sub}</p>}
      </CardHeader>
    </Card>
  );
});

const JourneyItem = memo(function JourneyItem({ item }: { item: { id: string; type: string; title: string; date: string; meta?: string } }) {
  const icon = item.type === "match" ? <Trophy className="h-4 w-4" /> : item.type === "event" ? <Calendar className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />;
  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary" />
      <div className="ml-2 flex items-start gap-2">
        <div className="mt-0.5 text-muted-foreground">{icon}</div>
        <div>
          <div className="text-sm font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.date}{item.meta ? ` • ${item.meta}` : ""}</div>
        </div>
      </div>
    </div>
  );
});

const SidebarItem = memo(function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={cn("flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition", active ? "bg-muted font-medium" : "hover:bg-muted/60") }>
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </button>
  );
});

// ---------- Pages ----------
function Landing() {
  // Defer heavy lists until after first paint
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let raf1: number | null = null;
    let raf2: number | null = null;
    const delay = 220; // ms shimmer delay for smoother perception
    const id = setTimeout(() => {
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setMounted(true));
      });
    }, delay);
    return () => {
      clearTimeout(id);
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeaderBannerAvatar name={me.name} email={me.email} avatarUrl={me.avatar} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader className="flex-row items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={PLACEHOLDER_AVATAR} alt={me.name} />
              <AvatarFallback>OR</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{me.name}</CardTitle>
              <CardDescription className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{me.location} • Age {me.age}</CardDescription>
            </div>
            <Button className="gap-2"><Sparkles className="h-4 w-4" />AI Coaching</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric label="UTR" value={me.utr} />
            <Metric label="USTA Rank" value={me.usta} />
            <Metric label="NSL Rank" value={me.nsl} />
            <Metric label="Sessions" value={12} sub="AI coaching history" />
          </CardContent>
        </Card>

        {/* Upload CTA */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upload a video for AI coaching</CardTitle>
            <CardDescription>Drag and drop or choose a file. We analyze form, footwork, and tactics.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-dashed p-6 text-center">
              <Video className="mx-auto mb-2 h-6 w-6" />
              <p className="text-sm mb-3 text-muted-foreground">.mp4, .mov up to 1 GB</p>
              <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" className="gap-2"><Upload className="h-4 w-4" />Upload</Button>
                <Button variant="ghost" className="gap-2"><Paperclip className="h-4 w-4" />Attach URL</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey timeline */}
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Latest activity</CardTitle>
            <CardDescription>Your recent matches, events, and coaching sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mounted ? (
              journey.map((j) => <JourneyItem key={j.id} item={j} />)
            ) : (
              <SkeletonLines count={3} />
            )}
          </CardContent>
        </Card>

        {/* Suggested matches */}
        <Card className="shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Suggested matches</CardTitle>
              <CardDescription>Players near your UTR and location</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {mounted ? (
              suggestedPlayers.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{p.name.slice(0,2)}</AvatarFallback></Avatar>
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">UTR {p.utr} • {p.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>Invite</Badge>
                    <Button size="sm" className="gap-1">Request match</Button>
                  </div>
                </div>
              ))
            ) : (
              <SkeletonCards count={3} />
            )}
          </CardContent>
        </Card>

        {/* Suggested events */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Suggested events</CardTitle>
            <CardDescription>Based on your UTR, rankings, and distance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mounted ? (
              upcomingEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.date} • {e.city} • {e.surface}</div>
                  </div>
                  <Button size="sm" variant="secondary" className="gap-1"><Calendar className="h-4 w-4" />View</Button>
                </div>
              ))
            ) : (
              <SkeletonCards count={2} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Players() {
  const [q, setQ] = useState("");
  const list = useMemo(() => allPlayers.filter(p => p.name.toLowerCase().includes(q.toLowerCase())), [q]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const compare = allPlayers.filter(p => compareIds.includes(p.id));

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Player search</CardTitle>
            <CardDescription>Browse, filter, and request matches</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search players" className="w-56" />
            <Button variant="secondary" className="gap-2">Filters</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map(p => (
          <Card key={p.id} className="shadow-sm">
            <CardHeader className="flex-row items-center gap-3">
              <Avatar className="h-10 w-10"><AvatarFallback>{p.name.slice(0,2)}</AvatarFallback></Avatar>
              <div className="flex-1">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs"><MapPin className="h-3 w-3" />{p.location}</CardDescription>
              </div>
              <Button variant={compareIds.includes(p.id) ? "default" : "secondary"} size="sm" onClick={() => setCompareIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}>{compareIds.includes(p.id) ? "Selected" : "Compare"}</Button>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <div className="grid grid-cols-3 gap-3">
                <Metric label="UTR" value={p.utr} />
                <Metric label="USTA" value={p.usta} />
                <Metric label="NSL" value={p.nsl} />
              </div>
              <Button className="gap-2">Request match</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button disabled={compare.length < 2} className="gap-2"><BarChart2 className="h-4 w-4" />Compare {compare.length} players</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Head to head</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {compare.map(p => (
              <Card key={p.id} className="shadow-sm">
                <CardHeader className="items-center">
                  <Avatar className="h-12 w-12"><AvatarFallback>{p.name.slice(0,2)}</AvatarFallback></Avatar>
                  <CardTitle className="text-base mt-2">{p.name}</CardTitle>
                  <CardDescription>UTR {p.utr} • USTA {p.usta} • NSL {p.nsl}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Coaching() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome back, Olivia. Upload a clip or ask a question to continue." },
    { role: "user", content: "Can you analyze my slice serve toss from last match?" },
    { role: "assistant", content: "Your toss is landing a foot right of ideal. Try this drill: knee bend pause, 10 reps, focus on contact in front." },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle>AI coaching</CardTitle>
          <CardDescription>Chat UX with video understanding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[440px] overflow-y-auto rounded-lg border p-4 space-y-4 bg-muted/30">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start") }>
                <div className={cn("max-w-[75%] rounded-2xl px-3 py-2 text-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border") }>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-end gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="gap-2"><Upload className="h-4 w-4" />Upload video</Button>
              </SheetTrigger>
              <SheetContent className="w-[420px]">
                <SheetHeader>
                  <SheetTitle>Upload a clip</SheetTitle>
                </SheetHeader>
                <div className="mt-4 rounded-xl border border-dashed p-6 text-center">
                  <Video className="mx-auto mb-2 h-6 w-6" />
                  <p className="text-sm mb-3 text-muted-foreground">Drag and drop .mp4 or .mov up to 1 GB</p>
                  <Button className="gap-2"><Upload className="h-4 w-4" />Choose file</Button>
                </div>
              </SheetContent>
            </Sheet>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about technique, tactics, or fitness" className="resize-none" />
            <Button onClick={send} className="gap-1"><Sparkles className="h-4 w-4" />Send</Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent sessions</CardTitle>
            <CardDescription>Your clips and AI summaries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Serve mechanics • Clip {i}</div>
                  <Badge>Saved</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Key notes: shoulder over shoulder, earlier contact, recover to center</div>
                <div className="mt-2 flex gap-2">
                  <Button variant="secondary" size="sm" className="gap-1"><MessageSquare className="h-4 w-4" />Open chat</Button>
                  <Button variant="ghost" size="sm">Download report</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Events() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Events</CardTitle>
        <CardDescription>Coming soon</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">Tournament calendar and registrations are in progress.</div>
      </CardContent>
    </Card>
  );
}

function Settings() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 shadow-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage how others see you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input defaultValue={me.name} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={me.email} />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input defaultValue={me.location} />
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input defaultValue={me.age} type="number" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Show profile in search</div>
              <div className="text-xs text-muted-foreground">Let others request matches</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Notifications</div>
              <div className="text-xs text-muted-foreground">Match requests and event reminders</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="pt-2">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Connected accounts</CardTitle>
          <CardDescription>Link ranking providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "UTR", status: "Connected" },
            { name: "USTA", status: "Connect" },
            { name: "NSL", status: "Connect" },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border p-3">
              <div className="text-sm font-medium">{s.name}</div>
              <Button size="sm" variant={s.status === "Connected" ? "secondary" : "default"}>{s.status}</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- App shell with Untitled UI style sidebar ----------

type Route = "home" | "players" | "coaching" | "events" | "settings";

export default function App() {
  const [route, setRoute] = useState<Route>("home");

  // DEV TESTS: Basic invariants to catch regressions (run once in dev)
  useEffect(() => {
    try {
      console.assert(Array.isArray(allPlayers) && allPlayers.length >= 4, "allPlayers should be a non-empty array");
      const maya = allPlayers.find(p => p.name.toLowerCase().includes("maya"));
      console.assert(!!maya && typeof maya!.utr === "number", "Players should have numeric UTR");
      const filtered = allPlayers.filter(p => p.name.toLowerCase().includes("a"));
      console.assert(filtered.length <= allPlayers.length, "Filter should not increase length");
    } catch (e) {
      console.warn("Dev tests failed:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1200px] gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 rounded-2xl border bg-card p-4 md:block">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-400" />
            <div>
              <div className="text-lg font-semibold">Untitled UI</div>
              <div className="text-xs text-muted-foreground">Tennis</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="relative">
              <Input placeholder="Search" className="pl-9" />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <nav className="mt-4 space-y-1">
            <SidebarItem icon={<HomeIcon className="h-4 w-4" />} active={route === "home"} onClick={() => setRoute("home")} label="Home" />
            <SidebarItem icon={<Users className="h-4 w-4" />} active={route === "players"} onClick={() => setRoute("players")} label="Players" />
            <SidebarItem icon={<Sparkles className="h-4 w-4" />} active={route === "coaching"} onClick={() => setRoute("coaching")} label="AI Coaching" />
            <SidebarItem icon={<Calendar className="h-4 w-4" />} active={route === "events"} onClick={() => setRoute("events")} label="Events" />
            <SidebarItem icon={<SettingsIcon className="h-4 w-4" />} active={route === "settings"} onClick={() => setRoute("settings")} label="Settings" />
          </nav>
          <Separator className="my-4" />
          <div className="space-y-2 rounded-xl bg-muted/50 p-3">
            <div className="text-xs font-medium">Support</div>
            <div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />Online</span><Button size="sm" variant="secondary">Open chat</Button></div>
          </div>

          <div className="mt-20 rounded-xl border p-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8"><AvatarImage src={PLACEHOLDER_AVATAR} alt={me.name} /><AvatarFallback>OR</AvatarFallback></Avatar>
              <div className="text-sm">
                <div className="font-medium">{me.name}</div>
                <div className="text-xs text-muted-foreground">{me.email}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden fixed inset-x-0 top-0 z-10 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-400" />
              <div className="text-base font-semibold">Untitled UI Tennis</div>
            </div>
            <MobileMenu route={route} setRoute={setRoute} />
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 md:pt-0 pt-16">
          <div className="space-y-6">
            {route === "home" && <Landing />}
            {route === "players" && <Players />}
            {route === "coaching" && <Coaching />}
            {route === "events" && <Events />}
            {route === "settings" && <Settings />}
          </div>
        </main>
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
            <button key={i.key} onClick={() => { setRoute(i.key as Route); setOpen(false); }} className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm", route === i.key ? "bg-muted" : "hover:bg-muted/60")}>
              <span>{i.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Skeleton helpers ----------
function SkeletonLines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-3 w-48 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted" />
              </div>
            </div>
            <div className="h-8 w-20 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
