import React, { useMemo, useRef, useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./base/Avatar";

/**
 * Interactive Tennis Journey Workflow
 * Single-file React component styled with Tailwind
 * - Workflow-style progression with clear steps and status
 * - Past nodes: matches, coaching, events with completion status
 * - Future steps: suggested matches, coaching, events with action buttons
 * - Click any node to open a details panel
 * - Add players and toggle visibility
 * - See intersections where players share an event or match
 * - Pan and zoom the canvas
 * - Current user's workflow is emphasized and highlighted
 *
 * Notes
 * - No external UI libraries required
 * - Icons are simple SVGs inline for reliability
 * - Workflow design inspired by Active Pieces
 */

// Utility: id
const uid = () => Math.random().toString(36).slice(2, 9);

// Node type design tokens with workflow status
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

// Workflow status indicators
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

// Current user data (Olivia Rhye from the app)
const CURRENT_USER = {
  id: "current-user",
  name: "Olivia Rhye",
  utr: 7.8,
  color: "#8b5cf6", // Purple to distinguish from other players
  avatar: "/avatars/olivia-rhye.png",
  isCurrentUser: true,
  events: [
    { id: "cu1", kind: "match", label: "USTA L4 vs. Chen", date: "2025-05-10", laneIndex: 0, meta: { score: "6-2 6-1", location: "Fort Collins, CO" } },
    { id: "cu2", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 0, meta: { coach: "Coach Martinez", duration: "60 min" } },
    { id: "cu3", kind: "event", label: "Colorado State Open", date: "2025-06-15", laneIndex: 0, meta: { draw: "Girls 18s" } },
    { id: "cu4", kind: "match", label: "Quarter vs. Thompson", date: "2025-06-17", laneIndex: 0, meta: { score: "7-5 6-3" }, parent: "cu3" },
    { id: "cu5", kind: "match", label: "Semi vs. Rodriguez", date: "2025-06-18", laneIndex: 0, meta: { score: "6-4 6-2" }, parent: "cu4" },
    { id: "cu6", kind: "match", label: "Final vs. Ava Kim", date: "2025-06-19", laneIndex: 0, meta: { score: "6-3 6-1" }, parent: "cu5" },
    { id: "cu7", kind: "suggested", label: "Suggested match vs. Zoe R.", date: "2025-07-15", laneIndex: 0, meta: { reason: "Similar UTR, local" }, parent: "cu6" },
    { id: "cu8", kind: "suggested", label: "Suggested coaching: Mental game", date: "2025-07-22", laneIndex: 0, meta: { coach: "Coach Williams" }, parent: "cu6" },
    { id: "cu9", kind: "match", label: "USTA L3 vs. Luca Rivera", date: "2025-08-05", laneIndex: 0, meta: { score: "6-4 6-2", location: "Denver, CO" } },
    { id: "cu10", kind: "coaching", label: "Volley clinic", date: "2025-08-12", laneIndex: 0, meta: { coach: "Coach Davis", duration: "90 min" } },
    { id: "cu11", kind: "event", label: "Rocky Mountain Open", date: "2025-09-10", laneIndex: 0, meta: { draw: "Girls 18s" } },
    { id: "cu12", kind: "match", label: "Round 1 vs. Sarah M.", date: "2025-09-12", laneIndex: 0, meta: { score: "6-1 6-0" }, parent: "cu11" },
    { id: "cu13", kind: "match", label: "Round 2 vs. Emma L.", date: "2025-09-13", laneIndex: 0, meta: { score: "6-3 6-2" }, parent: "cu12" },
  ],
};

// Starter sample data - empty by default, only current user shows
const SAMPLE_PLAYERS: any[] = [
  {
    id: "player-1",
    name: "Ava Kim",
    utr: 8.2,
    color: "#ef4444", // Red
    avatar: "/avatars/ava-kim.png",
    isCurrentUser: false,
    events: [
      { id: "p1-1", kind: "match", label: "USTA L4 vs. Chen", date: "2025-05-10", laneIndex: 1, meta: { score: "6-4 6-2", location: "Fort Collins, CO" } },
      { id: "p1-2", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 1, meta: { coach: "Coach Martinez", duration: "60 min" } },
    ]
  },
  {
    id: "player-2", 
    name: "Zoe Rodriguez",
    utr: 7.5,
    color: "#3b82f6", // Blue
    avatar: "/avatars/zoe-rodriguez.png",
    isCurrentUser: false,
    events: [
      { id: "p2-1", kind: "match", label: "USTA L4 vs. Thompson", date: "2025-05-12", laneIndex: 2, meta: { score: "7-5 6-3", location: "Denver, CO" } },
      { id: "p2-2", kind: "event", label: "Colorado State Open", date: "2025-06-15", laneIndex: 2, meta: { draw: "Girls 18s" } },
    ]
  },
  {
    id: "player-3",
    name: "Emma Thompson",
    utr: 7.9,
    color: "#10b981", // Green
    avatar: "/avatars/emma-thompson.png",
    isCurrentUser: false,
    events: [
      { id: "p3-1", kind: "coaching", label: "Volley clinic", date: "2025-05-20", laneIndex: 3, meta: { coach: "Coach Davis", duration: "90 min" } },
      { id: "p3-2", kind: "match", label: "USTA L3 vs. Rivera", date: "2025-06-01", laneIndex: 3, meta: { score: "6-2 6-1", location: "Boulder, CO" } },
    ]
  },
  {
    id: "player-4",
    name: "Luca Rivera",
    utr: 8.1,
    color: "#f59e0b", // Amber/Orange
    avatar: "/avatars/luca-rivera.png",
    isCurrentUser: false,
    events: [
      { id: "p4-1", kind: "match", label: "USTA L3 vs. Thompson", date: "2025-06-01", laneIndex: 4, meta: { score: "2-6 1-6", location: "Boulder, CO" } },
      { id: "p4-2", kind: "coaching", label: "Backhand improvement", date: "2025-06-08", laneIndex: 4, meta: { coach: "Coach Wilson", duration: "75 min" } },
    ]
  },
  {
    id: "player-5",
    name: "Sarah Martinez",
    utr: 7.3,
    color: "#8b5cf6", // Purple
    avatar: "/avatars/sarah-martinez.png",
    isCurrentUser: false,
    events: [
      { id: "p5-1", kind: "event", label: "Rocky Mountain Open", date: "2025-07-20", laneIndex: 5, meta: { draw: "Girls 18s" } },
      { id: "p5-2", kind: "match", label: "Round 1 vs. Chen", date: "2025-07-22", laneIndex: 5, meta: { score: "6-3 6-4", location: "Vail, CO" } },
    ]
  },
  {
    id: "player-6",
    name: "Chen Wei",
    utr: 7.7,
    color: "#06b6d4", // Cyan
    avatar: "/avatars/chen-wei.png",
    isCurrentUser: false,
    events: [
      { id: "p6-1", kind: "match", label: "USTA L4 vs. Kim", date: "2025-05-10", laneIndex: 6, meta: { score: "2-6 2-6", location: "Fort Collins, CO" } },
      { id: "p6-2", kind: "coaching", label: "Footwork drills", date: "2025-05-18", laneIndex: 6, meta: { coach: "Coach Johnson", duration: "45 min" } },
    ]
  },
  {
    id: "player-7",
    name: "Coach Martinez",
    utr: 9.2,
    color: "#dc2626", // Dark Red
    avatar: "/avatars/coach-martinez.png",
    isCurrentUser: false,
    events: [
      { id: "p7-1", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 7, meta: { student: "Olivia Rhye", duration: "60 min" } },
      { id: "p7-2", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 7, meta: { student: "Ava Kim", duration: "60 min" } },
    ]
  },
  {
    id: "player-8",
    name: "Coach Davis",
    utr: 8.8,
    color: "#059669", // Dark Green
    avatar: "/avatars/coach-davis.png",
    isCurrentUser: false,
    events: [
      { id: "p8-1", kind: "coaching", label: "Volley clinic", date: "2025-05-20", laneIndex: 8, meta: { student: "Emma Thompson", duration: "90 min" } },
      { id: "p8-2", kind: "coaching", label: "Volley clinic", date: "2025-08-12", laneIndex: 8, meta: { student: "Olivia Rhye", duration: "90 min" } },
    ]
  }
];

// Types
type EventItem = {
  id: string;
  kind: string;
  label: string;
  date: string;
  laneIndex: number;
  meta?: Record<string, any>;
  parent?: string;
};

type PlayerType = {
  id: string;
  name: string;
  utr: number;
  color: string;
  avatar?: string;
  isCurrentUser: boolean;
  events: EventItem[];
};

type SelectedEvent = EventItem & {
  playerId: string;
  playerName: string;
  isCurrentUser: boolean;
  x: number;
  y: number;
};

// Date helpers
const parseDate = (d: string) => new Date(d + "T00:00:00");
const minDate = (players: any[]) => new Date(Math.min(...players.flatMap((p: any) => p.events.map((e: any) => parseDate(e.date).getTime()))));
const maxDate = (players: any[]) => new Date(Math.max(...players.flatMap((p: any) => p.events.map((e: any) => parseDate(e.date).getTime()))));

// Simple icon set
const Icon = ({ name, className = "w-4 h-4", size = 16 }: { name: string; className?: string; size?: number }) => {
  switch (name) {
    case "match":
      return (
        <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 4v16" />
          <path d="M4 12h16" />
        </svg>
      );
    case "coaching":
      return (
        <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 20v-8a8 8 0 0116 0v8" />
          <path d="M8 20v-6m8 6v-6" />
        </svg>
      );
    case "event":
      return (
        <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="3" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "suggested":
      return (
        <svg viewBox="0 0 24 24" className={className} width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    default:
      return null;
  }
};

// Linear scale for dates to x positions
function useDateScale(players: any[], viewportWidth: number, paddingLeft = 200, paddingRight = 200) {
  return useMemo(() => {
    if (!players.length) return (dateStr: string) => 0;
    const min = minDate(players).getTime();
    const max = maxDate(players).getTime();
    const span = Math.max(1, max - min);
    const inner = Math.max(600, viewportWidth - paddingLeft - paddingRight);
    return (dateStr: string) => {
      const t = parseDate(dateStr).getTime();
      const ratio = (t - min) / span;
      return paddingLeft + ratio * inner;
    };
  }, [players, viewportWidth, paddingLeft, paddingRight]);
}

function NodeCard({ node, x, y, onClick, isCurrentUser = false }: { 
  node: any; 
  x: number; 
  y: number; 
  onClick: (node: any) => void; 
  isCurrentUser?: boolean; 
}) {
  const style = TYPE_STYLES[node.kind as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
  const statusStyle = STATUS_STYLES[style.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.completed;
  
  // Extract key data for display
  const getKeyData = () => {
    switch (node.kind) {
      case 'match':
        return node.meta?.score || 'Match';
      case 'coaching':
        return `${node.meta?.coach || 'Coach'} • ${node.meta?.duration || 'Session'}`;
      case 'event':
        return node.meta?.draw || node.meta?.team || 'Event';
      case 'suggested':
        return node.meta?.reason || 'Suggested';
      default:
        return '';
    }
  };

  const keyData = getKeyData();
  const location = node.meta?.location || '';
  const isSuggested = node.kind === "suggested";

  return (
    <div
      className={[
        "group text-left shadow-sm ring-1 rounded-xl px-4 py-3 max-w-[320px] transition-all duration-200",
        style.bg,
        style.ring,
        style.text,
        isSuggested ? "border-2 border-dashed" : "",
        isCurrentUser ? "ring-2 ring-purple-500 shadow-lg hover:shadow-xl" : "hover:shadow-md",
        "hover:-translate-y-1 hover:scale-[1.02]",
      ].join(" ")}
      style={{ 
        position: "absolute", 
        left: x - 160, 
        top: y - 60,
        transform: isCurrentUser ? "scale(1.05)" : "scale(1)",
        zIndex: isCurrentUser ? 10 : 1,
      }}
    >
      {/* Simplified header */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`shrink-0 inline-flex items-center justify-center rounded-md bg-white/80 ring-1 ring-black/10 ${isCurrentUser ? "w-8 h-8" : "w-7 h-7"}`}>
          <span className="text-sm">{style.icon}</span>
        </span>
        <div className="min-w-0 flex-1">
          <div className={`font-medium truncate ${isCurrentUser ? "text-sm" : "text-xs"}`}>
            {node.label}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${style.chip}`}>
              {node.kind}
            </span>
            <span className="text-[10px] text-black/60">{node.date}</span>
          </div>
        </div>
        {isCurrentUser && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">ME</span>
          </div>
        )}
      </div>

      {/* Simple key data */}
      {keyData && (
        <div className="mb-2">
          <div className="text-xs text-black/70 leading-tight">
            {keyData}
          </div>
        </div>
      )}

      {/* Simple action for suggested items */}
      {isSuggested && node.meta?.reason && (
        <div className="mt-3 pt-3 border-t border-black/10">
          <div className="text-[10px] text-black/70 leading-tight mb-3">
            💡 {node.meta.reason}
          </div>
          
          {/* Action buttons for suggested items */}
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle accept action
              }}
              className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-medium px-3 py-2 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle schedule action
              }}
              className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium px-3 py-2 transition-colors"
            >
              Schedule
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick(node);
              }}
              className="rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-medium px-3 py-2 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* Click handler for non-suggested items */}
      {!isSuggested && (
        <button 
          onClick={() => onClick(node)}
          className="w-full mt-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium px-3 py-2 transition-colors"
        >
          View Details
        </button>
      )}
    </div>
  );
}

function Edge({ x1, y1, x2, y2, kind, isCurrentUser = false }: { 
  x1: number; 
  y1: number; 
  x2: number; 
  y2: number; 
  kind: string; 
  isCurrentUser?: boolean; 
}) {
  // Create curved path for workflow flow
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  
  // Add slight curve for visual appeal
  const curveOffset = Math.abs(x2 - x1) * 0.1;
  const path = `M ${x1} ${y1} Q ${midX} ${midY - curveOffset} ${x2} ${y2}`;
  
  const dashed = kind === "suggested";
  const strokeColor = isCurrentUser ? "#8b5cf6" : (dashed ? "#f59e0b" : "#94a3b8");
  const strokeWidth = isCurrentUser ? 3 : 2;
  
  // Add arrowhead for workflow direction
  const arrowSize = 8;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const arrowX = x2 - arrowSize * Math.cos(angle);
  const arrowY = y2 - arrowSize * Math.sin(angle);
  
  return (
    <g>
      {/* Main path */}
      <path 
        d={path} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth={strokeWidth} 
        strokeDasharray={dashed ? "6 6" : "0"} 
        markerEnd={dashed ? "url(#arrowhead-dashed)" : "url(#arrowhead-solid)"}
      />
      
      {/* Arrowhead definitions */}
      <defs>
        <marker
          id="arrowhead-solid"
          markerWidth={arrowSize}
          markerHeight={arrowSize}
          refX={arrowSize}
          refY={arrowSize / 2}
          orient="auto"
        >
          <polygon
            points={`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`}
            fill={strokeColor}
          />
        </marker>
        <marker
          id="arrowhead-dashed"
          markerWidth={arrowSize}
          markerHeight={arrowSize}
          refX={arrowSize}
          refY={arrowSize / 2}
          orient="auto"
        >
          <polygon
            points={`0 0, ${arrowSize} ${arrowSize / 2}, 0 ${arrowSize}`}
            fill={strokeColor}
          />
        </marker>
      </defs>
    </g>
  );
}

function usePanZoom() {
  const [state, setState] = useState({ x: 0, y: 0, k: 1 });
  const last = useRef<{ x: number; y: number } | null>(null);

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Don't call preventDefault() on passive wheel events
    const delta = -e.deltaY;
    const factor = Math.exp(delta * 0.001);
    setState((s) => {
      const k = Math.min(2.5, Math.max(0.5, s.k * factor));
      return { ...s, k };
    });
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setState((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
  };
  const onMouseUp = () => (last.current = null);

  return { state, onWheel, onMouseDown, onMouseMove, onMouseUp };
}

export default function TennisJourneyMap({ currentUser = CURRENT_USER as PlayerType }: { currentUser?: PlayerType }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [players, setPlayers] = useState<PlayerType[]>([currentUser as PlayerType]); // Only current user by default
  const [visible, setVisible] = useState<Record<string, boolean>>(() => {
    const initial = Object.fromEntries(players.map((p) => [p.id, true]));
    // Ensure current user is always visible
    initial[currentUser.id] = true;
    return initial;
  });
  const [selected, setSelected] = useState<SelectedEvent | null>(null);
  const [selectedSharedEvent, setSelectedSharedEvent] = useState<{
    player1: PlayerType;
    player2: PlayerType;
    event1: EventItem;
    event2: EventItem;
    x: number;
    y: number;
  } | null>(null);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [searchResults, setSearchResults] = useState<PlayerType[]>([
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      utr: 7.2,
      color: "#3b82f6",
      isCurrentUser: false,
      events: [
        { id: "shared-match-1", kind: "match", label: "USTA L4 vs. Chen", date: "2025-05-10", laneIndex: 0, meta: { score: "6-2 6-1", location: "Fort Collins, CO", surface: "hard" } },
        { id: "shared-coaching-1", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 0, meta: { coach: "Coach Martinez", duration: "60 min", location: "Denver, CO", surface: "indoor" } },
        { id: "shared-event-1", kind: "event", label: "Colorado State Open", date: "2025-06-15", laneIndex: 0, meta: { draw: "Girls 18s", location: "Boulder, CO", surface: "hard" } },
      ]
    },
    {
      id: "mike-chen",
      name: "Mike Chen",
      utr: 6.8,
      color: "#10b981",
      isCurrentUser: false,
      events: [
        { id: "mc1", kind: "match", label: "Club championship", date: "2025-05-18", laneIndex: 0, meta: { score: "7-5 6-3", location: "Boulder, CO", surface: "hard" } },
        { id: "shared-coaching-1", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 0, meta: { coach: "Coach Martinez", duration: "60 min", location: "Denver, CO", surface: "indoor" } },
        { id: "shared-event-2", kind: "event", label: "Rocky Mountain Open", date: "2025-07-15", laneIndex: 0, meta: { draw: "Men's Open", location: "Vail, CO", surface: "clay" } },
      ]
    },
    {
      id: "emma-rodriguez",
      name: "Emma Rodriguez",
      utr: 8.1,
      color: "#f59e0b",
      isCurrentUser: false,
      events: [
        { id: "er1", kind: "match", label: "State championship", date: "2025-05-12", laneIndex: 0, meta: { score: "6-2 6-0", location: "Aspen, CO", surface: "clay" } },
        { id: "shared-coaching-1", kind: "coaching", label: "Serve technique", date: "2025-05-15", laneIndex: 0, meta: { coach: "Coach Martinez", duration: "60 min", location: "Denver, CO", surface: "indoor" } },
        { id: "shared-event-1", kind: "event", label: "Colorado State Open", date: "2025-06-15", laneIndex: 0, meta: { draw: "Girls 18s", location: "Boulder, CO", surface: "hard" } },
      ]
    },
    {
      id: "alex-kumar",
      name: "Alex Kumar",
      utr: 6.5,
      color: "#ef4444",
      isCurrentUser: false,
      events: [
        { id: "ak1", kind: "match", label: "Club ladder", date: "2025-05-15", laneIndex: 0, meta: { score: "6-3 7-5", location: "Vail, CO", surface: "clay" } },
        { id: "ak2", kind: "coaching", label: "Backhand technique", date: "2025-05-30", laneIndex: 0, meta: { coach: "Coach Martinez", duration: "60 min", location: "Denver, CO", surface: "indoor" } },
        { id: "shared-event-2", kind: "event", label: "Rocky Mountain Open", date: "2025-07-15", laneIndex: 0, meta: { draw: "Boys 16s", location: "Vail, CO", surface: "clay" } },
      ]
    },
    {
      id: "sophia-williams",
      name: "Sophia Williams",
      utr: 7.9,
      color: "#8b5cf6",
      isCurrentUser: false,
      events: [
        { id: "sw1", kind: "match", label: "Regional final", date: "2025-05-08", laneIndex: 0, meta: { score: "7-6 6-4", location: "Steamboat, CO", surface: "hard" } },
        { id: "shared-match-1", kind: "match", label: "USTA L4 vs. Chen", date: "2025-05-10", laneIndex: 0, meta: { score: "6-2 6-1", location: "Fort Collins, CO", surface: "hard" } },
        { id: "shared-event-1", kind: "event", label: "Colorado State Open", date: "2025-06-15", laneIndex: 0, meta: { draw: "Girls 18s", location: "Boulder, CO", surface: "hard" } },
      ]
    },
    {
      id: "jake-miller",
      name: "Jake Miller",
      utr: 9.2,
      color: "#dc2626",
      isCurrentUser: false,
      events: [
        { id: "jm1", kind: "match", label: "National qualifier", date: "2025-05-20", laneIndex: 0, meta: { score: "6-1 6-0", location: "New York, NY", surface: "hard" } },
        { id: "jm2", kind: "event", label: "US Open Junior", date: "2025-06-10", laneIndex: 0, meta: { draw: "Boys 18s", location: "New York, NY", surface: "hard" } },
      ]
    },
    {
      id: "maria-garcia",
      name: "Maria Garcia",
      utr: 8.5,
      color: "#059669",
      isCurrentUser: false,
      events: [
        { id: "mg1", kind: "match", label: "Florida Open", date: "2025-05-25", laneIndex: 0, meta: { score: "6-4 7-5", location: "Miami, FL", surface: "hard" } },
        { id: "mg2", kind: "coaching", label: "Clay court technique", date: "2025-06-01", laneIndex: 0, meta: { coach: "Coach Rodriguez", duration: "90 min", location: "Miami, FL", surface: "clay" } },
      ]
    },
    {
      id: "david-kim",
      name: "David Kim",
      utr: 7.8,
      color: "#0891b2",
      isCurrentUser: false,
      events: [
        { id: "dk1", kind: "match", label: "California State", date: "2025-05-22", laneIndex: 0, meta: { score: "6-3 6-2", location: "Los Angeles, CA", surface: "hard" } },
        { id: "dk2", kind: "event", label: "Pacific Coast Open", date: "2025-06-20", laneIndex: 0, meta: { draw: "Boys 16s", location: "San Francisco, CA", surface: "hard" } },
      ]
    },
    {
      id: "lisa-thompson",
      name: "Lisa Thompson",
      utr: 6.9,
      color: "#7c3aed",
      isCurrentUser: false,
      events: [
        { id: "lt1", kind: "match", label: "Texas Open", date: "2025-05-28", laneIndex: 0, meta: { score: "7-6 6-4", location: "Austin, TX", surface: "hard" } },
        { id: "lt2", kind: "coaching", label: "Serve and volley", date: "2025-06-05", laneIndex: 0, meta: { coach: "Coach Wilson", duration: "75 min", location: "Austin, TX", surface: "hard" } },
      ]
    },
    {
      id: "tommy-wilson",
      name: "Tommy Wilson",
      utr: 5.4,
      color: "#ea580c",
      isCurrentUser: false,
      events: [
        { id: "tw1", kind: "match", label: "Junior tournament", date: "2025-05-30", laneIndex: 0, meta: { score: "6-2 6-1", location: "Chicago, IL", surface: "indoor" } },
        { id: "tw2", kind: "event", label: "Midwest Championships", date: "2025-06-25", laneIndex: 0, meta: { draw: "Boys 14s", location: "Chicago, IL", surface: "indoor" } },
      ]
    }
  ]);
  const [filteredResults, setFilteredResults] = useState<PlayerType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add filter state variables
  const [filters, setFilters] = useState({
    region: "",
    ageGroup: "",
    utrRange: "",
    surface: ""
  });
  
  const [width, setWidth] = useState(1400);
  const [height, setHeight] = useState(720);
  const pan = usePanZoom();

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        setHeight(entry.contentRect.height);
      }
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const activePlayers = useMemo(() => players.filter((p) => visible[p.id]), [players, visible]);
  const xScale = useDateScale(activePlayers.length ? (activePlayers as any[]) : (players as any[]), width);

  // Layout: separate horizontal lanes for each player
  const laneHeight = 200; // Height of each player's lane
  const laneSpacing = 50; // Space between lanes
  const baseTimelineY = 200; // Starting Y position for first lane

  // Canvas size - adjust height based on number of players
  const graphWidth = Math.max(width, 1600);
  const graphHeight = Math.max(height, baseTimelineY + (activePlayers.length * (laneHeight + laneSpacing)) + 100);

  // Calculate the actual content bounds to prevent cropping
  const contentBounds = useMemo(() => {
    if (!activePlayers.length) return { minX: 0, maxX: graphWidth, minY: 0, maxY: graphHeight };
    
    let minX = Infinity, maxX = -Infinity;
    
    activePlayers.forEach((p) => {
      p.events.forEach((e) => {
        const x = xScale(e.date);
        minX = Math.min(minX, x - 400); // Account for massive foreignObject width
        maxX = Math.max(maxX, x + 400);
      });
    });
    
    return {
      minX: Math.max(0, minX - 50),
      maxX: Math.min(graphWidth, maxX + 50),
      minY: Math.max(0, baseTimelineY - 200),
      maxY: Math.min(graphHeight, baseTimelineY + (activePlayers.length * (laneHeight + laneSpacing)) + 300)
    };
  }, [activePlayers, xScale, graphWidth, graphHeight, baseTimelineY, laneHeight, laneSpacing]);

  // Update canvas size to accommodate content
  const adjustedGraphWidth = Math.max(graphWidth, contentBounds.maxX + 100);
  const adjustedGraphHeight = Math.max(graphHeight, contentBounds.maxY + 200);

  // Positioned nodes/edges are disabled to remove all timeline events
  const positioned = useMemo(() => {
    return { nodes: [], edges: [] };
  }, [activePlayers, xScale, currentUser.id, adjustedGraphWidth, adjustedGraphHeight]);

  // Intersections: same event id across players
  const intersections = useMemo(() => {
    const map = new Map();
    activePlayers.forEach((p) => p.events.forEach((e) => {
      const key = e.id; // shared id means shared event
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ playerId: p.id, event: e });
    }));
    const shared = [...map.entries()].filter(([, arr]) => arr.length > 1).map(([id, arr]) => id);
    return new Set(shared);
  }, [activePlayers]);

  // Function to add a player to the timeline
  const addPlayerToTimeline = (player: PlayerType) => {
    // Check if player already exists
    if (players.find(p => p.id === player.id)) {
      return; // Player already exists
    }
    
    // Add player to the players array
    setPlayers(ps => [...ps, player]);
    
    // Make the player visible by default
    setVisible(v => ({ ...v, [player.id]: true }));
    
    // Remove player from search results (keep modal open)
    setSearchResults(prev => prev.filter(p => p.id !== player.id));
  };

  // Function to remove a player from the timeline
  const removePlayer = (playerId: string) => {
    // Don't allow removing the current user
    if (playerId === currentUser.id) {
      return;
    }
    
    // Remove player from players array
    setPlayers(ps => ps.filter(p => p.id !== playerId));
    
    // Remove from visible state
    setVisible(v => {
      const newVisible = { ...v };
      delete newVisible[playerId];
      return newVisible;
    });
    
    // Add player back to search results if they were in the original list
    const originalPlayer = searchResults.find(p => p.id === playerId);
    if (!originalPlayer) {
      // If player wasn't in original search results, add them back
      const removedPlayer = players.find(p => p.id === playerId);
      if (removedPlayer) {
        setSearchResults(prev => [...prev, removedPlayer]);
      }
    }
  };

  // Filter search results based on search query and sort by relevance
  useEffect(() => {
    let filtered = searchResults;
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(player => {
        // Fuzzy search on player name
        const nameMatch = player.name.toLowerCase().includes(query);
        
        // Search in location
        const locationMatch = player.events.some(event => 
          event.meta?.location?.toLowerCase().includes(query)
        );
        
        // Search in UTR (exact match for numbers)
        const utrMatch = player.utr.toString().includes(query);
        
        // Search in age group/draw
        const ageMatch = player.events.some(event => 
          event.meta?.draw?.toLowerCase().includes(query)
        );
        
        return nameMatch || locationMatch || utrMatch || ageMatch;
      });
    }
    
    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter(player => {
        // Check if any event location matches the selected region
        return player.events.some(event => {
          const location = event.meta?.location || '';
          switch (filters.region) {
            case 'northeast':
              return location.includes('NY') || location.includes('MA') || location.includes('CT') || 
                     location.includes('RI') || location.includes('VT') || location.includes('NH') || 
                     location.includes('ME') || location.includes('NJ') || location.includes('PA') || 
                     location.includes('DE') || location.includes('MD') || location.includes('DC');
            case 'southeast':
              return location.includes('VA') || location.includes('NC') || location.includes('SC') || 
                     location.includes('GA') || location.includes('FL') || location.includes('AL') || 
                     location.includes('MS') || location.includes('TN') || location.includes('KY') || 
                     location.includes('WV') || location.includes('AR') || location.includes('LA');
            case 'midwest':
              return location.includes('OH') || location.includes('IN') || location.includes('IL') || 
                     location.includes('MI') || location.includes('WI') || location.includes('MN') || 
                     location.includes('IA') || location.includes('MO') || location.includes('ND') || 
                     location.includes('SD') || location.includes('NE') || location.includes('KS');
            case 'west':
              return location.includes('WA') || location.includes('OR') || location.includes('CA') || 
                     location.includes('NV') || location.includes('ID') || location.includes('UT') || 
                     location.includes('AZ') || location.includes('MT') || location.includes('WY') || 
                     location.includes('CO') || location.includes('NM') || location.includes('TX') || 
                     location.includes('OK') || location.includes('AK') || location.includes('HI');
            case 'international':
              return !location.includes('CO') && !location.includes('NY') && !location.includes('CA') && 
                     !location.includes('TX') && !location.includes('FL') && !location.includes('IL');
            default:
              return true;
          }
        });
      });
    }
    
    // Apply age group filter
    if (filters.ageGroup) {
      filtered = filtered.filter(player => {
        return player.events.some(event => {
          const draw = event.meta?.draw || '';
          switch (filters.ageGroup) {
            case '12u':
              return draw.includes('12') || draw.includes('12U') || draw.includes('12 & Under');
            case '14u':
              return draw.includes('14') || draw.includes('14U') || draw.includes('14 & Under');
            case '16u':
              return draw.includes('16') || draw.includes('16U') || draw.includes('16 & Under');
            case '18u':
              return draw.includes('18') || draw.includes('18U') || draw.includes('18 & Under');
            case 'adult':
              return !draw.includes('12') && !draw.includes('14') && !draw.includes('16') && 
                     !draw.includes('18') && !draw.includes('U') && !draw.includes('Under');
            default:
              return true;
          }
        });
      });
    }
    
    // Apply UTR range filter
    if (filters.utrRange) {
      filtered = filtered.filter(player => {
        const utr = player.utr;
        switch (filters.utrRange) {
          case '1-3':
            return utr >= 1 && utr <= 3;
          case '4-6':
            return utr >= 4 && utr <= 6;
          case '7-9':
            return utr >= 7 && utr <= 9;
          case '10-12':
            return utr >= 10 && utr <= 12;
          case '13-16':
            return utr >= 13 && utr <= 16;
          default:
            return true;
        }
      });
    }
    
    // Apply surface filter
    if (filters.surface) {
      filtered = filtered.filter(player => {
        // Check if any event has surface information or infer from location
        return player.events.some(event => {
          const location = event.meta?.location || '';
          const surface = event.meta?.surface || '';
          
          switch (filters.surface) {
            case 'hard':
              return surface.includes('hard') || surface.includes('Hard') || 
                     location.includes('indoor') || location.includes('Indoor') ||
                     location.includes('club') || location.includes('Club');
            case 'clay':
              return surface.includes('clay') || surface.includes('Clay') || 
                     location.includes('clay') || location.includes('Clay');
            case 'grass':
              return surface.includes('grass') || surface.includes('Grass') || 
                     location.includes('grass') || location.includes('Grass');
            case 'indoor':
              return surface.includes('indoor') || surface.includes('Indoor') || 
                     location.includes('indoor') || location.includes('Indoor') ||
                     location.includes('club') || location.includes('Club');
            default:
              return true;
          }
        });
      });
    }
    
    // Sort by relevance: players with overlapping events first
    filtered.sort((a, b) => {
      const aOverlaps = a.events.some(eventA => 
        currentUser.events.some(eventB => 
          eventA.id === eventB.id || 
          (eventA.meta?.location === eventB.meta?.location && 
           eventA.date === eventB.date && 
           eventA.kind === eventB.kind)
        )
      );
      
      const bOverlaps = b.events.some(eventA => 
        currentUser.events.some(eventB => 
          eventA.id === eventB.id || 
          (eventA.meta?.location === eventB.meta?.location && 
           eventA.date === eventB.date && 
           eventA.kind === eventB.kind)
        )
      );
      
      if (aOverlaps && !bOverlaps) return -1;
      if (!aOverlaps && bOverlaps) return 1;
      return 0;
    });
    
    setFilteredResults(filtered);
  }, [searchQuery, searchResults, currentUser.events, filters]);



  return (
    <div className="h-full w-full bg-slate-50 text-slate-900 flex flex-col" ref={containerRef}>


      {/* Player visibility controls - moved above the map */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-2">
            {players.map((p) => {
              // Generate color scheme based on player's assigned color
              const getPlayerColorScheme = (color: string) => {
                // Convert hex to RGB for better color matching
                const hex = color.replace('#', '');
                const r = parseInt(hex.substr(0, 2), 16);
                const g = parseInt(hex.substr(2, 2), 16);
                const b = parseInt(hex.substr(4, 2), 16);
                
                // Use the player's color for background with low opacity
                // Create a darker shade for the ring (multiply by 0.6 to darken)
                const darkerR = Math.round(r * 0.6);
                const darkerG = Math.round(g * 0.6);
                const darkerB = Math.round(b * 0.6);
                
                return {
                  bg: `rgba(${r}, ${g}, ${b}, 0.1)`,
                  ring: `rgb(${darkerR}, ${darkerG}, ${darkerB})`,
                  text: `rgb(${r}, ${g}, ${b})`
                };
              };
              
              const colorScheme = p.id === currentUser.id 
                ? { bg: "bg-purple-100", ring: "ring-purple-300", text: "text-purple-900" }
                : getPlayerColorScheme(p.color);
              
              return (
                <div 
                  key={p.id} 
                  className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ring-1 ${
                    p.id === currentUser.id ? "bg-purple-100 ring-purple-300 text-purple-900" : ""
                  }`}
                  style={p.id !== currentUser.id ? {
                    backgroundColor: colorScheme.bg,
                    borderColor: colorScheme.ring,
                    color: colorScheme.text
                  } : {}}
                >
                  <input
                    type="checkbox"
                    checked={!!visible[p.id]}
                    onChange={() => setVisible((v) => ({ ...v, [p.id]: !v[p.id] }))}
                    disabled={p.id === currentUser.id} // Current user can't be hidden
                  />
                  <span className="inline-flex items-center gap-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={p.avatar} alt={p.name} />
                      <AvatarFallback className="text-xs font-medium" style={{ color: p.color }}>
                        {p.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* Debug: Show avatar path */}
                    <div className="text-[8px] text-gray-400" title={`Avatar path: ${p.avatar}`}>
                      {p.avatar ? '✓' : '✗'}
                    </div>
                    {p.name}
                    {p.id === currentUser.id && <span className="text-purple-600 font-medium">(You)</span>}
                  </span>
                  {p.id !== currentUser.id && (
                    <button
                      onClick={() => removePlayer(p.id)}
                      className="ml-1 w-4 h-4 rounded-full bg-gray-300 hover:bg-red-400 text-gray-600 hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      title="Remove player"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
            <button
              onClick={() => setShowAddPlayer(true)}
              className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            >
              <span className="text-sm">+</span>
              Add Player
            </button>
          </div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="relative px-3 flex-1 min-h-0 w-full">
        <div
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white w-full h-full"
          style={{ minHeight: "500px" }}
          tabIndex={-1}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
            pan.onWheel(e);
          }}
          onMouseDown={pan.onMouseDown}
          onMouseMove={pan.onMouseMove}
          onMouseUp={pan.onMouseUp}
          onScroll={(e) => {
            e.stopPropagation();
          }}
        >
          {/* Ruler and lanes */}
          <div className="absolute inset-0" style={{ transform: `translate(${pan.state.x}px, ${pan.state.y}px) scale(${pan.state.k})`, transformOrigin: "0 0" }}>
            <svg width={adjustedGraphWidth} height={adjustedGraphHeight} className="block" onClick={() => { setSelected(null); setSelectedSharedEvent(null); }}>
              {/* Date ruler */}
              <g>
                <line x1={0} y1={60} x2={adjustedGraphWidth} y2={60} stroke="#e2e8f0" strokeWidth={1} />
                {/* Ticks for each 2 weeks across the span */}
                {(() => {
                  const playersForScale = activePlayers.length ? activePlayers : players;
                  const start = minDate(playersForScale);
                  const end = maxDate(playersForScale);
                  const ticks = [];
                  const step = 1000 * 60 * 60 * 24 * 14; // 2 weeks
                  for (let t = start.getTime(); t <= end.getTime(); t += step) {
                    const d = new Date(t);
                    const x = xScale(d.toISOString().slice(0, 10));
                    // Only show ticks within the content bounds
                    if (x >= contentBounds.minX && x <= contentBounds.maxX) {
                      ticks.push(
                        <g key={t}>
                          <line x1={x} y1={52} x2={x} y2={68} stroke="#cbd5e1" />
                          <text x={x} y={40} fontSize={10} textAnchor="middle" fill="#64748b">
                            {d.toISOString().slice(0, 10)}
                          </text>
                        </g>
                      );
                    }
                  }
                  return ticks;
                })()}
              </g>

              {/* Multiple timeline lanes - one per player */}
              <g>
                {/* Timeline lines - one per player */}
                {activePlayers.map((p, playerIndex) => {
                  const isCurrentUser = p.id === currentUser.id;
                  const y = baseTimelineY + (playerIndex * (laneHeight + laneSpacing));
                  
                  return (
                    <line 
                      key={p.id}
                      x1={0} 
                      y1={y} 
                      x2={adjustedGraphWidth} 
                      y2={y} 
                      stroke={isCurrentUser ? "#8b5cf6" : p.color} 
                      strokeWidth={isCurrentUser ? 3 : 2} 
                      strokeDasharray="0"
                    />
                  );
                })}
                
                {/* Player indicators above each timeline */}
                {activePlayers.map((p, playerIndex) => {
                  const isCurrentUser = p.id === currentUser.id;
                  const y = baseTimelineY + (playerIndex * (laneHeight + laneSpacing));
                  
                  // Generate color scheme based on player's assigned color
                  const getPlayerColorScheme = (color: string) => {
                    // Convert hex to RGB for better color matching
                    const hex = color.replace('#', '');
                    const r = parseInt(hex.substr(0, 2), 16);
                    const g = parseInt(hex.substr(2, 2), 16);
                    const b = parseInt(hex.substr(4, 2), 16);
                    
                    // Use the player's color for background with low opacity
                    // Create a darker shade for the ring (multiply by 0.6 to darken)
                    const darkerR = Math.round(r * 0.6);
                    const darkerG = Math.round(g * 0.6);
                    const darkerB = Math.round(b * 0.6);
                    
                    return {
                      bg: `rgba(${r}, ${g}, ${b}, 0.1)`,
                      ring: `rgb(${darkerR}, ${darkerG}, ${darkerB})`,
                      text: `rgb(${r}, ${g}, ${b})`
                    };
                  };
                  
                  const colorScheme = isCurrentUser 
                    ? { bg: "bg-purple-100", ring: "ring-purple-300", text: "text-purple-900" }
                    : getPlayerColorScheme(p.color);
                  
                  return (
                    <foreignObject key={p.id} x={8} y={y - 60} width={180} height={44}>
                      <div className="pointer-events-none select-none">
                        <div 
                          className={`inline-flex items-center gap-2 rounded-xl px-2 py-1 shadow-sm ring-1 ${
                            isCurrentUser ? "bg-purple-100 ring-purple-300 text-purple-900" : ""
                          }`}
                          style={!isCurrentUser ? {
                            backgroundColor: colorScheme.bg,
                            borderColor: colorScheme.ring,
                            color: colorScheme.text
                          } : {}}
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={p.avatar} alt={p.name} />
                            <AvatarFallback className="text-xs font-medium" style={{ color: p.color }}>
                              {p.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/* Debug: Show avatar path */}
                          <div className="text-[8px] text-gray-400" title={`Avatar path: ${p.avatar}`}>
                            {p.avatar ? '✓' : '✗'}
                          </div>
                          <div className="text-xs font-medium">{p.name}</div>
                          <div className={`text-[10px] ${isCurrentUser ? "text-purple-600" : ""}`} style={!isCurrentUser ? { color: colorScheme.text, opacity: 0.7 } : {}}>UTR {p.utr}</div>
                          {isCurrentUser && <div className="text-[10px] text-purple-600 font-medium">(You)</div>}
                        </div>
                      </div>
                    </foreignObject>
                  );
                })}
              </g>

              {/* Shared event connections - draw lines between shared events (rendered first so they appear behind icons) */}
              {(() => {
                const connections: Array<{
                  x1: number, 
                  y1: number, 
                  x2: number, 
                  y2: number, 
                  eventId: string, 
                  eventType: string,
                  player1: PlayerType,
                  player2: PlayerType,
                  event1: EventItem,
                  event2: EventItem
                }> = [];
                
                // Find all shared events between players
                activePlayers.forEach((player1, index1) => {
                  const y1 = baseTimelineY + (index1 * (laneHeight + laneSpacing));
                  
                  activePlayers.slice(index1 + 1).forEach((player2, index2) => {
                    const y2 = baseTimelineY + ((index1 + index2 + 1) * (laneHeight + laneSpacing));
                    
                    player1.events.forEach(event1 => {
                      player2.events.forEach(event2 => {
                        // Check if events are the same (same ID) or similar (same location, date, type)
                        if (event1.id === event2.id || 
                            (event1.meta?.location === event2.meta?.location && 
                             event1.date === event2.date && 
                             event1.kind === event2.kind)) {
                          
                          const x1 = xScale(event1.date);
                          const x2 = xScale(event2.date);
                          
                          connections.push({
                            x1, y1, x2, y2,
                            eventId: event1.id,
                            eventType: event1.kind,
                            player1,
                            player2,
                            event1,
                            event2
                          });
                        }
                      });
                    });
                  });
                });
                
                return connections.map((conn, index) => (
                  <g key={`connection-${index}`}>
                    {/* Clickable connection line */}
                    <line
                      x1={conn.x1}
                      y1={conn.y1}
                      x2={conn.x2}
                      y2={conn.y2}
                      stroke="#f59e0b"
                      strokeWidth={4}
                      strokeDasharray="5 5"
                      opacity={0.8}
                      className="cursor-pointer hover:stroke-orange-500 hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSharedEvent({
                          player1: conn.player1,
                          player2: conn.player2,
                          event1: conn.event1,
                          event2: conn.event2,
                          x: (conn.x1 + conn.x2) / 2,
                          y: (conn.y1 + conn.y2) / 2
                        });
                      }}
                    />
                    
                    {/* Connection indicator dots */}
                    <circle
                      cx={conn.x1}
                      cy={conn.y1}
                      r={4}
                      fill="#f59e0b"
                      opacity={0.9}
                      className="cursor-pointer hover:fill-orange-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSharedEvent({
                          player1: conn.player1,
                          player2: conn.player2,
                          event1: conn.event1,
                          event2: conn.event2,
                          x: conn.x1,
                          y: conn.y1
                        });
                      }}
                    />
                    <circle
                      cx={conn.x2}
                      cy={conn.y2}
                      r={4}
                      fill="#f59e0b"
                      opacity={0.9}
                      className="cursor-pointer hover:fill-orange-500 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSharedEvent({
                          player1: conn.player1,
                          player2: conn.player2,
                          event1: conn.event1,
                          event2: conn.event2,
                          x: conn.x2,
                          y: conn.y2
                        });
                      }}
                    />
                  </g>
                ));
              })()}

              {/* Event icons along each player's timeline */}
              {activePlayers.map((p, playerIndex) => {
                const y = baseTimelineY + (playerIndex * (laneHeight + laneSpacing));
                const isCurrentUser = p.id === currentUser.id;
                return (
                  <g key={p.id + "-events"}>
                    {p.events.map((e: any) => {
                      const x = xScale(e.date);
                      const style = TYPE_STYLES[e.kind as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
                      const size = 13; // outer dot radius (increased to accommodate larger icons)
                      
                      // Check if this event is shared with other players
                      const sharedWith = activePlayers.filter(otherPlayer => 
                        otherPlayer.id !== p.id && 
                        otherPlayer.events.some(otherEvent => 
                          otherEvent.id === e.id || 
                          (otherEvent.meta?.location === e.meta?.location && 
                           otherEvent.date === e.date && 
                           otherEvent.kind === e.kind)
                        )
                      );
                      
                      const isShared = sharedWith.length > 0;
                      
                      return (
                        <g
                          key={e.id}
                          transform={`translate(${x}, ${y})`}
                          className="cursor-pointer"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setSelected({ ...e, playerId: p.id, playerName: p.name, isCurrentUser, x, y });
                          }}
                        >
                          <circle r={size} fill="white" stroke={isCurrentUser ? "#8b5cf6" : "#94a3b8"} strokeWidth={isCurrentUser ? 3 : 2} />
                          <circle r={size - 3} className={style.bg} />
                          <g transform="translate(-8, -8)">
                            <Icon name={e.kind} size={16} className="text-white" />
                          </g>
                          
                          {/* Shared event indicator */}
                          {isShared && (
                            <circle 
                              r={size + 4} 
                              fill="none" 
                              stroke="#f59e0b" 
                              strokeWidth={2}
                              strokeDasharray="3 3"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Inline details popover anchored to selected icon */}
              {selected && (
                <foreignObject x={selected.x + 18} y={selected.y - 90} width={340} height={360}>
                  <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-4 w-[320px] text-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded-md ring-1 ${TYPE_STYLES[selected.kind as keyof typeof TYPE_STYLES].ring} ${TYPE_STYLES[selected.kind as keyof typeof TYPE_STYLES].bg}`}>
                          <Icon name={selected.kind} size={16} />
                        </span>
                        <div className="font-medium text-sm truncate">{selected.label}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg bg-slate-50 p-2">
                          <div className="text-slate-500">Date</div>
                          <div className="font-medium">{selected.date}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2">
                          <div className="text-slate-500">Type</div>
                          <div className="font-medium capitalize">{selected.kind}</div>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-2 col-span-2">
                          <div className="text-slate-500">Player</div>
                          <div className="font-medium">{selected.playerName}</div>
                        </div>
                      </div>
                      {selected.meta && (
                        <div className="mt-2">
                          <div className="text-slate-500 mb-1">Details</div>
                          <div className="rounded-lg border border-slate-200 p-2 bg-white">
                            {Object.entries(selected.meta).map(([k, v]) => (
                              <div key={k} className="flex justify-between py-1 border-b last:border-b-0 border-slate-100">
                                <span className="text-slate-500 capitalize">{k}</span>
                                <span className="font-medium">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <button className="rounded-lg bg-slate-900 px-3 py-1.5 text-white">Add to schedule</button>
                        <button className="rounded-lg px-3 py-1.5 border border-slate-300" onClick={(e) => { e.stopPropagation(); setSelected(null); }}>Close</button>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              )}

              {/* Shared event details popover */}
              {selectedSharedEvent && (
                <foreignObject x={selectedSharedEvent.x - 160} y={selectedSharedEvent.y - 120} width={400} height={400}>
                  <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl p-4 w-[360px] text-xs">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex w-8 h-8 items-center justify-center rounded-md bg-orange-100 ring-1 ring-orange-300">
                          <span className="text-lg">🏆</span>
                        </span>
                        <div>
                          <div className="font-medium text-sm">Shared Event</div>
                          <div className="text-xs text-slate-500">{selectedSharedEvent.event1.date}</div>
                        </div>
                      </div>
                      
                      {/* Event details */}
                      <div className="mb-3">
                        <div className="text-xs text-slate-500 mb-1">Event</div>
                        <div className="font-medium text-sm">{selectedSharedEvent.event1.label}</div>
                        <div className="text-xs text-slate-500">{selectedSharedEvent.event1.meta?.location}</div>
                      </div>

                      {/* Player comparison */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedSharedEvent.player1.color }}></div>
                            <span className="text-sm font-medium">{selectedSharedEvent.player1.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">UTR</div>
                            <div className="text-sm font-medium">{selectedSharedEvent.player1.utr}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: selectedSharedEvent.player2.color }}></div>
                            <span className="text-sm font-medium">{selectedSharedEvent.player2.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-slate-500">UTR</div>
                            <div className="text-sm font-medium">{selectedSharedEvent.player2.utr}</div>
                          </div>
                        </div>
                      </div>

                      {/* Match details if it's a match */}
                      {selectedSharedEvent.event1.kind === 'match' && (
                        <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-xs text-orange-700 font-medium mb-1">Match Results</div>
                          <div className="text-xs text-orange-600">
                            {selectedSharedEvent.event1.meta?.score && (
                              <div className="flex items-center gap-2">
                                <span>Score: {selectedSharedEvent.event1.meta.score}</span>
                                {(() => {
                                  // Determine winner based on score
                                  const score = selectedSharedEvent.event1.meta.score;
                                  if (score && typeof score === 'string') {
                                    const sets = score.split(' ');
                                    if (sets.length >= 2) {
                                      const set1 = sets[0].split('-');
                                      const set2 = sets[1].split('-');
                                      const player1Games = parseInt(set1[0]) + parseInt(set2[0]);
                                      const player2Games = parseInt(set1[1]) + parseInt(set2[1]);
                                      
                                      if (player1Games > player2Games) {
                                        return <span className="text-green-600 font-medium">• {selectedSharedEvent.player1.name} wins</span>;
                                      } else if (player2Games > player1Games) {
                                        return <span className="text-green-600 font-medium">• {selectedSharedEvent.player2.name} wins</span>;
                                      }
                                    }
                                  }
                                  return null;
                                })()}
                              </div>
                            )}
                            {selectedSharedEvent.event1.meta?.winner && (
                              <div>Winner: {selectedSharedEvent.event1.meta.winner}</div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <button 
                          className="rounded-lg px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-50" 
                          onClick={(e) => { e.stopPropagation(); setSelectedSharedEvent(null); }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>

          {/* Empty state overlay if no players visible */}
          {activePlayers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Select at least one player to view the journey
            </div>
          )}

          {/* Workflow Legend - positioned over timeline in bottom right */}
          <div className="absolute bottom-4 right-4 z-10">
            <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur p-3 text-sm shadow-lg">
              <div className="font-medium mb-2 text-slate-700">Legend</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(TYPE_STYLES).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5 rounded-lg px-2 py-1 ring-1 ring-slate-200 bg-white">
                    <Icon name={k} size={16} className="text-black" />
                    <span className="text-xs capitalize text-slate-700">{k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right-side details panel removed (using inline popover near icon) */}



      {/* Add Player Modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Add Player to Journey</h2>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <span className="text-gray-600 text-lg">×</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-4">
                {/* Search by Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search by Player Name</label>
                  <input
                    type="text"
                    placeholder="Enter player name, location, UTR, or age group..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <div className="mt-1 text-xs text-gray-500">
                      Found {filteredResults.length} player{filteredResults.length !== 1 ? 's' : ''}
                      {(filters.region || filters.ageGroup || filters.utrRange || filters.surface) && 
                        ` (filtered from ${searchResults.length} total)`
                      }
                    </div>
                  )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select 
                      value={filters.region}
                      onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Region</option>
                      <option value="northeast">Northeast</option>
                      <option value="southeast">Southeast</option>
                      <option value="midwest">Midwest</option>
                      <option value="west">West</option>
                      <option value="international">International</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
                    <select 
                      value={filters.ageGroup}
                      onChange={(e) => setFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Age</option>
                      <option value="12u">12 & Under</option>
                      <option value="14u">14 & Under</option>
                      <option value="16u">16 & Under</option>
                      <option value="18u">18 & Under</option>
                      <option value="adult">Adult</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">UTR Range</label>
                    <select 
                      value={filters.utrRange}
                      onChange={(e) => setFilters(prev => ({ ...prev, utrRange: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any UTR</option>
                      <option value="1-3">1-3 (Beginner)</option>
                      <option value="4-6">4-6 (Intermediate)</option>
                      <option value="7-9">7-9 (Advanced)</option>
                      <option value="10-12">10-12 (Elite)</option>
                      <option value="13-16">13-16 (Professional)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Surface</label>
                    <select 
                      value={filters.surface}
                      onChange={(e) => setFilters(prev => ({ ...prev, surface: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Any Surface</option>
                      <option value="hard">Hard Court</option>
                      <option value="clay">Clay</option>
                      <option value="grass">Grass</option>
                      <option value="indoor">Indoor</option>
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(filters.region || filters.ageGroup || filters.utrRange || filters.surface) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {filters.region && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Region: {filters.region}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, region: "" }))}
                          className="w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.ageGroup && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Age: {filters.ageGroup}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, ageGroup: "" }))}
                          className="w-4 h-4 rounded-full bg-green-200 hover:bg-green-300 flex items-center justify-center text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.utrRange && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        UTR: {filters.utrRange}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, utrRange: "" }))}
                          className="w-4 h-4 rounded-full bg-purple-200 hover:bg-purple-300 flex items-center justify-center text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.surface && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Surface: {filters.surface}
                        <button
                          onClick={() => setFilters(prev => ({ ...prev, surface: "" }))}
                          className="w-4 h-4 rounded-full bg-orange-200 hover:bg-orange-300 flex items-center justify-center text-orange-600 hover:text-orange-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    <button
                      onClick={() => setFilters({ region: "", ageGroup: "", utrRange: "", surface: "" })}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Search Results */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredResults.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        {searchQuery || filters.region || filters.ageGroup || filters.utrRange || filters.surface ? (
                          <>
                            <div className="text-sm">No players match your current search and filters</div>
                            <div className="text-xs mt-1">Try adjusting your search terms or clearing some filters</div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm">No more players to add</div>
                            <div className="text-xs mt-1">All available players have been added to your timeline</div>
                          </>
                        )}
                      </div>
                    ) : (
                      filteredResults.map((player) => {
                        // Check if player has overlapping events with current user
                        const overlappingEvents = player.events.filter(eventA => 
                          currentUser.events.some(eventB => 
                            eventA.id === eventB.id || 
                            (eventA.meta?.location === eventB.meta?.location && 
                             eventA.date === eventB.date && 
                             eventA.kind === eventB.kind)
                          )
                        );
                        
                        const hasOverlaps = overlappingEvents.length > 0;
                        
                        return (
                          <div key={player.id} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 ${
                            hasOverlaps ? 'border-purple-300 bg-purple-50' : 'border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={player.avatar} alt={player.name} />
                                <AvatarFallback className="text-sm font-medium" style={{ color: player.color }}>
                                  {player.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {/* Debug: Show avatar path */}
                              <div className="text-[8px] text-gray-400" title={`Avatar path: ${player.avatar}`}>
                                {player.avatar ? '✓' : '✗'}
                              </div>
                              <div>
                                <div className="text-sm font-medium">{player.name}</div>
                                <div className="text-xs text-gray-500">
                                  UTR {player.utr} • {player.events[0]?.meta?.location?.split(',')[0] || 'Location'} • {player.events[0]?.meta?.draw?.includes('16') ? '16U' : player.events[0]?.meta?.draw?.includes('18') ? '18U' : 'Adult'}
                                </div>
                                {/* Show surface preferences */}
                                {(() => {
                                  const surfaces = [...new Set(player.events.map(e => e.meta?.surface).filter(Boolean))];
                                  if (surfaces.length > 0) {
                                    return (
                                      <div className="text-xs text-gray-400 mt-1">
                                        Surfaces: {surfaces.join(', ')}
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                                {hasOverlaps && (
                                  <div className="text-xs text-purple-600 mt-1 font-medium">
                                    🎯 {overlappingEvents.length} overlapping event{overlappingEvents.length !== 1 ? 's' : ''} with you
                                  </div>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={() => addPlayerToTimeline(player)}
                              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                                hasOverlaps 
                                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              Add
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      )}
    </div>
  );
}
