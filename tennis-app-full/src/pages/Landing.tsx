import React, { useState, useEffect, memo } from "react";
import { BarChart2, Video, Upload, Paperclip, Trophy, Calendar, Sparkles } from "lucide-react";
import { TennisStatsDrawer } from "../components/StatsDrawer";
import { FullScreenModal } from "../components/FullScreenModal";
import TennisJourneyMap from "../components/TennisJourneyMap";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Badge } from "../components/base";
import { Avatar } from "../components/Avatar";
import { useUser } from "../contexts/UserContext";

// ============================================================
// Minimal local UI primitives (anonymized) so the file runs
// ============================================================
const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

// ============================================================
// Event Details Modal Component
// ============================================================
interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  playerName: string;
}

const EventDetailsModal = ({ isOpen, onClose, event, playerName }: EventDetailsModalProps) => {
  if (!isOpen || !event) return null;

  const style = TYPE_STYLES[event.type as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
  
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 w-[400px] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex w-10 h-10 items-center justify-center rounded-lg ring-1 ${style.ring} ${style.bg}`}>
            <span className="text-2xl">{style.icon}</span>
          </span>
          <div>
            <div className="font-medium text-lg">{event.title}</div>
            <div className="text-sm text-slate-500">{event.date}</div>
          </div>
        </div>

        {/* Event details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500 text-sm">Date</div>
            <div className="font-medium">{event.date}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="text-slate-500 text-sm">Type</div>
            <div className="font-medium capitalize">{event.type}</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-3 col-span-2">
            <div className="text-slate-500 text-sm">Player</div>
            <div className="font-medium">{playerName}</div>
          </div>
        </div>

        {/* Event-specific details */}
        {event.type === "match" && (
          <div className="mb-4">
            <div className="text-slate-500 text-sm mb-2">Match Details</div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Score</span>
                <span className="font-medium">{event.score}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Result</span>
                <span className={`font-medium ${event.result === "W" ? "text-green-600" : "text-red-600"}`}>
                  {event.result === "W" ? "Win" : "Loss"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">UTR Change</span>
                <span className={`font-medium ${event.utrChange?.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {event.utrChange}
                </span>
              </div>
              {event.location && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {event.type === "event" && (
          <div className="mb-4">
            <div className="text-slate-500 text-sm mb-2">Tournament Details</div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Finish</span>
                <span className="font-medium">{event.finish}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Matches</span>
                <span className="font-medium">{event.matches}</span>
              </div>
              {event.draw && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Draw</span>
                  <span className="font-medium">{event.draw}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {event.type === "coaching" && (
          <div className="mb-4">
            <div className="text-slate-500 text-sm mb-2">Session Details</div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Duration</span>
                <span className="font-medium">{event.duration}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Coach</span>
                <span className="font-medium">{event.coach}</span>
              </div>
              {event.saved && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Saved</span>
                  <span className="font-medium">{event.saved}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meta information */}
        {event.meta && (
          <div className="mb-4">
            <div className="text-slate-500 text-sm mb-2">Additional Info</div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white">
              <div className="text-sm">{event.meta}</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm hover:bg-slate-800 transition-colors">
            Add to schedule
          </button>
          <button 
            className="rounded-lg px-4 py-2 border border-slate-300 text-slate-600 text-sm hover:bg-slate-50 transition-colors" 
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Optimized header with non-blocking avatar
// ============================================================
const PLACEHOLDER_AVATAR =
  "data:image/svg+xml;utf8,\n  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>\n    <rect width='100%' height='100%' fill='%23eee'/>\n    <text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>--</text>\n  </svg>";

const PageHeaderBannerAvatar = memo(function PageHeaderBannerAvatar({
  name,
  location,
  age,
  avatarUrl,
  coverImageUrl,
}: {
  name: string;
  location: string;
  age: number;
  avatarUrl?: string;
  coverImageUrl?: string;
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
      {/* Cover image or gradient banner */}
      {coverImageUrl ? (
        <div className="h-40 w-full rounded-xl lg:h-60 overflow-hidden">
          <img 
            src={coverImageUrl} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 w-full rounded-xl bg-gradient-to-t from-[#FBC5EC] to-[#A5C0EE] lg:h-60" />
      )}

      {/* Content row */}
      <div className="m-auto -mt-12 w-full px-3 lg:-mt-10 lg:px-8">
        <div className="flex flex-col gap-4 border-b pb-4 lg:flex-row lg:gap-5 lg:pb-6">
          {/* Avatar + back on mobile */}
          <div className="flex items-start justify-between">
            <Avatar 
              src={src} 
              alt={name} 
              size="lg" 
              fallbackText={name}
              className="h-16 w-16 lg:hidden"
            />
            <Avatar 
              src={src} 
              alt={name} 
              size="xl" 
              fallbackText={name}
              className="hidden h-24 w-24 lg:block"
            />
          </div>

          {/* Title + actions */}
          <div className="flex w-full flex-col gap-x-4 gap-y-5 lg:pt-16">
            <div className="flex flex-1 flex-col flex-wrap gap-4 lg:flex-row">
              <div className="flex min-w-60 flex-1 flex-col gap-0.5 lg:gap-1">
                <h1 className="text-xl font-semibold lg:text-3xl">{name}</h1>
                <p className="text-sm text-muted-foreground">{location} • Age {age}</p>
              </div>
              {/* Buttons hidden for now */}
              {/* <div className="flex gap-3">
                <Button variant="secondary" className="hidden lg:inline-flex">Tertiary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button>Primary</Button>
              </div> */}
              <div className="relative max-w-80 min-w-48 flex-1">
                <Input className="pl-9" placeholder="Search" aria-label="Search" />
                <div className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground">🔍</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});



// Comprehensive tennis stats data
const tennisStats = {
  utr: {
    current: 7.8,
    trend: "+0.2",
    trendDirection: "positive" as "positive" | "negative",
    history: [
      { date: "2024-01", rating: 7.2 },
      { date: "2024-02", rating: 7.3 },
      { date: "2024-03", rating: 7.4 },
      { date: "2024-04", rating: 7.5 },
      { date: "2024-05", rating: 7.6 },
      { date: "2024-06", rating: 7.7 },
      { date: "2024-07", rating: 7.8 },
    ],
    matches: {
      total: 47,
      wins: 32,
      losses: 15,
      winRate: "68%",
      lastMatch: "2024-07-28",
      lastResult: "W 6-4, 6-4",
      lastOpponent: "J. Cruz (UTR 7.2)",
      lastUtrChange: "+0.2"
    },
    tournaments: {
      total: 12,
      titles: 3,
      finals: 5,
      semifinals: 2,
      quarterfinals: 2
    },
    surfaces: {
      hard: { matches: 28, winRate: "71%" },
      clay: { matches: 12, winRate: "67%" },
      grass: { matches: 7, winRate: "57%" }
    },
    styles: {
      aggressive: { matches: 25, winRate: "72%" },
      defensive: { matches: 15, winRate: "60%" },
      allCourt: { matches: 7, winRate: "71%" }
    }
  },
  usta: {
    current: 1453,
    trend: "-12",
    trendDirection: "negative" as "positive" | "negative",
    ranking: "State: #23 | Section: #156 | National: #1,247",
    history: [
      { date: "2024-01", points: 1480 },
      { date: "2024-02", points: 1475 },
      { date: "2024-03", points: 1470 },
      { date: "2024-04", points: 1465 },
      { date: "2024-05", points: 1460 },
      { date: "2024-06", points: 1455 },
      { date: "2024-07", points: 1453 },
    ],
    events: {
      total: 18,
      wins: 12,
      losses: 6,
      winRate: "67%",
      lastEvent: "USTA L6 Poudre Open",
      lastFinish: "Quarterfinals",
      lastDate: "2024-07-21"
    },
    ageGroups: {
      "16U": { ranking: "#15", points: 1453 },
      "18U": { ranking: "#23", points: 1453 }
    }
  },
  nsl: {
    current: 212,
    trend: "+8",
    trendDirection: "positive" as "positive" | "negative",
    ranking: "National: #212 | Regional: #18 | State: #3",
    history: [
      { date: "2024-01", ranking: 245 },
      { date: "2024-02", ranking: 238 },
      { date: "2024-03", ranking: 230 },
      { date: "2024-04", ranking: 225 },
      { date: "2024-05", ranking: 220 },
      { date: "2024-06", ranking: 215 },
      { date: "2024-07", ranking: 212 },
    ],
    ladder: {
      total: 24,
      wins: 18,
      losses: 6,
      winRate: "75%",
      currentStreak: 4,
      bestStreak: 7
    }
  },
  performance: {
    serve: {
      firstServe: "68%",
      firstServeWon: "72%",
      secondServeWon: "54%",
      aces: 47,
      doubleFaults: 23,
      aceRate: "12%"
    },
    return: {
      firstServeReturnWon: "28%",
      secondServeReturnWon: "52%",
      breakPointsConverted: "41%",
      returnGamesWon: "35%"
    },
    overall: {
      gamesWon: "58%",
      setsWon: "62%",
      matchesWon: "68%",
      tiebreaks: "55%"
    }
  },
  fitness: {
    endurance: "8.2/10",
    speed: "7.8/10",
    agility: "8.0/10",
    strength: "7.5/10",
    flexibility: "8.5/10"
  },
  goals: {
    shortTerm: "Reach UTR 8.0 by end of 2024",
    mediumTerm: "Win USTA L5 tournament",
    longTerm: "College tennis scholarship",
    progress: {
      utr: { current: 7.8, target: 8.0, percentage: 75 },
      usta: { current: 1453, target: 1500, percentage: 65 },
      nsl: { current: 212, target: 200, percentage: 80 }
    }
  }
};

// Journey data aligned with TennisJourneyMap component styles
const journey = [
  { 
    id: "j1", 
    type: "match", 
    title: "USTA L4 vs. J. Cruz", 
    date: "Jul 28", 
    meta: "UTR Verified", 
    result: "W", 
    utrChange: "+0.2",
    score: "6-4 6-4",
    location: "Fort Collins, CO"
  },
  { 
    id: "j2", 
    type: "event", 
    title: "USTA L6 Poudre Open", 
    date: "Jul 21", 
    meta: "3 matches", 
    finish: "QF", 
    matches: 3,
    draw: "Girls 18s"
  },
  { 
    id: "j3", 
    type: "coaching", 
    title: "AI session: Serve toss drift", 
    date: "Jul 18", 
    meta: "Drill plan saved", 
    duration: "45m", 
    saved: "Drill Plan",
    coach: "AI Coach"
  },
  { 
    id: "j4", 
    type: "match", 
    title: "USTA L4 vs. M. Zhou", 
    date: "Jul 15", 
    meta: "UTR Verified", 
    result: "L", 
    utrChange: "-0.1",
    score: "7-6(5) 6-3",
    location: "Boulder, CO"
  },
  { 
    id: "j5", 
    type: "event", 
    title: "UTR 7.5+ Challenge", 
    date: "Jul 10", 
    meta: "4 matches", 
    finish: "SF", 
    matches: 4,
    draw: "Girls 18s"
  },
  { 
    id: "j6", 
    type: "coaching", 
    title: "AI session: Backhand consistency", 
    date: "Jul 08", 
    meta: "Progress tracked", 
    duration: "60m", 
    saved: "Progress",
    coach: "AI Coach"
  },
];

const suggestedPlayers = [
  { id: 1, name: "Maya Patel", utr: 7.5, location: "Longmont, CO", handed: "Right", style: "Aggressive Baseliner" },
  { id: 2, name: "Dylan Park", utr: 8.1, location: "Loveland, CO", handed: "Left", style: "All Court" },
  { id: 3, name: "Leo Campos", utr: 7.9, location: "Greeley, CO", handed: "Right", style: "Counterpuncher" },
];

const upcomingEvents = [
  { id: 11, name: "USTA L5 Summer Slam", date: "Aug 24", city: "Denver", surface: "Hard" },
  { id: 12, name: "Northern CO UTR 8", date: "Sep 02", city: "Fort Collins", surface: "Hard" },
];



// Type styles aligned with TennisJourneyMap component
const TYPE_STYLES = {
  match: {
    bg: "bg-emerald-50",
    ring: "ring-emerald-300",
    text: "text-emerald-900",
    chip: "bg-emerald-100 text-emerald-700",
    status: "completed",
    icon: "🏆"
  },
  coaching: {
    bg: "bg-sky-50",
    ring: "ring-sky-300",
    text: "text-sky-900",
    chip: "bg-sky-100 text-sky-700",
    status: "completed",
    icon: "📚"
  },
  event: {
    bg: "bg-violet-50",
    ring: "ring-violet-300",
    text: "text-violet-900",
    chip: "bg-violet-100 text-violet-700",
    status: "completed",
    icon: "🎯"
  },
  suggested: {
    bg: "bg-amber-50",
    ring: "ring-amber-300",
    text: "text-amber-900",
    chip: "bg-amber-100 text-amber-700",
    status: "pending",
    icon: "⏳"
  },
};

// Status styles aligned with TennisJourneyMap component
const STATUS_STYLES = {
  completed: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: "✓",
    ring: "ring-green-300"
  },
  pending: {
    bg: "bg-yellow-100", 
    text: "text-yellow-800",
    icon: "⏳",
    ring: "ring-yellow-300"
  },
  inProgress: {
    bg: "bg-blue-100",
    text: "text-blue-800", 
    icon: "🔄",
    ring: "ring-blue-300"
  }
};

// ---------- Helper UI ----------
const Metric = memo(function Metric({ label, value, sub, trend }: { label: string; value: React.ReactNode; sub?: string; trend?: "positive" | "negative" }) {
  const TrendIcon = trend === "positive" ? "↗" : trend === "negative" ? "↘" : null;
  const trendColor = trend === "positive" ? "text-green-600" : trend === "negative" ? "text-red-600" : "";
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="py-4">
        <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">{label}</CardDescription>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl">{value}</CardTitle>
          {TrendIcon && <span className={`text-lg ${trendColor}`}>{TrendIcon}</span>}
        </div>
        {sub && !trend && <p className="text-sm text-muted-foreground">{sub}</p>}
      </CardHeader>
    </Card>
  );
});

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

export function Landing({ statsDrawerOpen, setStatsDrawerOpen }: { statsDrawerOpen: boolean; setStatsDrawerOpen: (open: boolean) => void }) {
  const { user } = useUser();
  // Defer heavy lists until after first paint
  const [mounted, setMounted] = useState(false);
  const [journeyModalOpen, setJourneyModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Handle event click to open details modal
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };
  
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
      <PageHeaderBannerAvatar name={user.name} location={user.location} age={user.age} avatarUrl={user.avatar} coverImageUrl={user.coverImage} />

      {/* View All Stats Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your ratings</h2>
        <Button 
          variant="outline" 
          className="gap-2 border-2 px-6 py-2"
          onClick={() => setStatsDrawerOpen(!statsDrawerOpen)}
        >
          <BarChart2 className="h-4 w-4" />
          {statsDrawerOpen ? "Close stats" : "View all"}
        </Button>
      </div>

      {/* Player Rankings Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Metric label="UTR Rating" value={user.utr} sub="Universal Tennis Rating" trend={user.utrTrend} />
        <Metric label="USTA Ranking" value={user.usta} sub="United States Tennis Association" trend={user.utrTrend} />
        <Metric label="NSL Ranking" value={user.nsl} sub="National Singles Ladder" trend={user.nslTrend} />
      </div>

      {/* Journey timeline - Full width */}
      <Card className="col-span-1 lg:col-span-3 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-sky-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Your Tennis Journey</CardTitle>
              <CardDescription className="text-sm text-gray-600">Track your progress, achievements, and growth as a player • Click any event for details</CardDescription>
            </div>
            <Button 
              variant="outline" 
              className="gap-2 border-2 px-4 py-2"
              onClick={() => setJourneyModalOpen(true)}
            >
              <BarChart2 className="h-4 w-4" />
              View Full Journey
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {/* Vertical Timeline (default) */}
            <div className="block xl:1800:hidden">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-sky-200 to-violet-200 animate-pulse"></div>
              
              <div className="space-y-0">
                {mounted ? (
                  journey.map((j, index) => {
                    const style = TYPE_STYLES[j.type as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
                    const statusStyle = STATUS_STYLES[style.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.completed;
                    
                    return (
                      <div key={j.id} className="relative group hover:bg-gray-50 transition-colors cursor-pointer hover:shadow-md" onClick={() => handleEventClick(j)}>
                        {/* Timeline dot */}
                        <div className={`absolute left-6 top-6 w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 ${style.bg}`}></div>
                        
                        <div className="pl-20 pr-6 py-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${style.bg} ${style.ring}`}>
                                  <span className="text-lg">{style.icon}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{j.title}</h4>
                                  <p className="text-sm text-gray-500">{j.date}</p>
                                </div>
                              </div>
                              {j.meta && (
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className={`text-xs px-2 py-1 ${style.chip} border-0`}>
                                    {j.meta}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            
                            {/* Journey stats preview */}
                            <div className="hidden lg:flex items-center gap-4 text-sm text-gray-500">
                              {j.type === "match" && (
                                <>
                                  <div className="text-center">
                                    <div className={`font-semibold ${j.result === "W" ? "text-green-600" : "text-red-600"}`}>
                                      {j.result}
                                    </div>
                                    <div className="text-xs">Result</div>
                                  </div>
                                  <div className="text-center">
                                    <div className={`font-semibold ${j.utrChange?.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                                      {j.utrChange}
                                    </div>
                                    <div className="text-xs">UTR</div>
                                  </div>
                                </>
                              )}
                              {j.type === "event" && (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-orange-600">{j.finish}</div>
                                    <div className="text-xs">Finish</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">{j.matches}</div>
                                    <div className="text-xs">Matches</div>
                                  </div>
                                </>
                              )}
                              {j.type === "coaching" && (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-purple-600">{j.duration}</div>
                                    <div className="text-xs">Duration</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">{j.saved}</div>
                                    <div className="text-xs">Saved</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover effect line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-transparent group-hover:bg-gradient-to-b group-hover:from-emerald-400 group-hover:to-sky-400 transition-all duration-300"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6">
                    <SkeletonLines count={3} />
                  </div>
                )}
              </div>
            </div>

            {/* Horizontal Timeline (1800px and above) */}
            <div className="hidden xl:1800:block">
              {/* Horizontal timeline line */}
              <div className="absolute xl:1800:top-8 left-0 right-0 xl:1800:h-0.5 bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200 animate-pulse"></div>
              
              <div className="grid xl:1800:grid-cols-6 xl:1800:gap-4 xl:1800:p-6">
                {mounted ? (
                  journey.map((j, index) => {
                    const style = TYPE_STYLES[j.type as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
                    const statusStyle = STATUS_STYLES[style.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.completed;
                    
                    return (
                      <div key={j.id} className="relative group hover:bg-gray-50 transition-colors rounded-lg p-4 cursor-pointer hover:shadow-md" onClick={() => handleEventClick(j)}>
                        {/* Timeline dot */}
                        <div className={`absolute xl:1800:-top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 ${style.bg}`}></div>
                        
                        <div className="xl:1800:pt-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center xl:1800:mb-3">
                              <div className={`flex items-center justify-center xl:1800:w-10 xl:1800:h-10 rounded-lg ${style.bg} ${style.ring}`}>
                                <span className="text-xl">{style.icon}</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 xl:1800:text-sm xl:1800:mb-1 line-clamp-2">{j.title}</h4>
                              <p className="xl:1800:text-xs text-gray-500 xl:1800:mb-2">{j.date}</p>
                            </div>
                            {j.meta && (
                              <div className="flex justify-center xl:1800:mb-3">
                                <Badge variant="secondary" className={`text-xs px-2 py-1 ${style.chip} border-0`}>
                                  {j.meta}
                                </Badge>
                              </div>
                            )}
                            
                            {/* Journey stats preview */}
                            <div className="xl:1800:space-y-2 xl:1800:text-xs text-gray-500">
                              {j.type === "match" && (
                                <>
                                  <div className="text-center">
                                    <div className={`font-semibold ${j.result === "W" ? "text-green-600" : "text-red-600"}`}>
                                      {j.result}
                                    </div>
                                    <div className="xl:1800:text-xs">Result</div>
                                  </div>
                                  <div className="text-center">
                                    <div className={`font-semibold ${j.utrChange?.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                                      {j.utrChange}
                                    </div>
                                    <div className="xl:1800:text-xs">UTR</div>
                                  </div>
                                </>
                              )}
                              {j.type === "event" && (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-orange-600">{j.finish}</div>
                                    <div className="text-xs">Finish</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-blue-600">{j.matches}</div>
                                    <div className="text-xs">Matches</div>
                                  </div>
                                </>
                              )}
                              {j.type === "coaching" && (
                                <>
                                  <div className="text-center">
                                    <div className="font-semibold text-purple-600">{j.duration}</div>
                                    <div className="text-xs">Duration</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-semibold text-green-600">{j.saved}</div>
                                    <div className="text-xs">Saved</div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Hover effect line */}
                        <div className="absolute xl:1800:top-8 left-0 right-0 xl:1800:h-0.5 bg-transparent group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-sky-400 transition-all duration-300"></div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-6 p-6">
                    <SkeletonLines count={3} />
                  </div>
                )}
              </div>
            </div>
            
            {/* Journey progress indicator */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-sky-50 border-t">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-emerald-700">Journey in progress</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sky-600">Next milestone: UTR 8.0</span>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full" style={{width: '75%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Coaching CTA */}
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
                  <Avatar 
                    size="sm" 
                    fallbackText={p.name}
                    className="h-8 w-8"
                  />
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

      {/* Tennis Stats Drawer */}
      <TennisStatsDrawer 
        open={statsDrawerOpen} 
        onOpenChange={setStatsDrawerOpen} 
        tennisStats={tennisStats} 
      />

      {/* Full Screen Journey Modal */}
      <FullScreenModal
        isOpen={journeyModalOpen}
        onClose={() => setJourneyModalOpen(false)}
        title="Your Journey"
      >
        <TennisJourneyMap />
      </FullScreenModal>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          playerName={user.name}
        />
      )}
    </div>
  );
}
