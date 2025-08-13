import React, { useMemo, useRef, useState, useEffect } from "react";

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
const SAMPLE_PLAYERS: any[] = [];

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
          <circle cx="9" cy="9" r="5" />
          <path d="M14 14l7 7" />
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
          <path d="M12 19l-7-7 7-7" />
          <path d="M5 12h14" />
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

  // Add player form state
  const [newPlayer, setNewPlayer] = useState({ name: "", utr: "", color: "#0ea5e9" });

  const addPlayer = () => {
    const id = uid();
    const today = new Date();
    const d = today.toISOString().slice(0, 10);
    const sample = {
      id,
      name: newPlayer.name || `Player ${players.length + 1}`,
      utr: Number(newPlayer.utr || 5.0),
      color: newPlayer.color,
      isCurrentUser: false,
      events: [
        { id: uid(), kind: "match", label: "Local ladder match", date: d, laneIndex: 0, meta: { score: "6-4 6-4", location: "Fort Collins" } },
        { id: uid(), kind: "coaching", label: "Suggested coaching: Topspin", date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10), laneIndex: 0, meta: { coach: "Coach Mia" }, parent: undefined },
      ],
    };
    setPlayers((ps) => [...ps, sample]);
    setVisible((v) => ({ ...v, [id]: true }));
    setNewPlayer({ name: "", utr: "", color: "#0ea5e9" });
  };

  return (
    <div className="h-full w-full bg-slate-50 text-slate-900" ref={containerRef}>
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-screen-2xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-slate-900 to-slate-600" />
            <div>
              <div className="text-sm font-semibold">Tennis Journey Workflow</div>
              <div className="text-xs text-slate-500">Track your progress and plan next steps</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              {players.map((p) => (
                <label key={p.id} className={`inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full ring-1 ${
                  p.id === currentUser.id 
                    ? "bg-purple-100 ring-purple-300 text-purple-900" 
                    : "bg-slate-100 ring-slate-200"
                }`}>
                  <input
                    type="checkbox"
                    checked={!!visible[p.id]}
                    onChange={() => setVisible((v) => ({ ...v, [p.id]: !v[p.id] }))}
                    disabled={p.id === currentUser.id} // Current user can't be hidden
                  />
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    {p.name}
                    {p.id === currentUser.id && <span className="text-purple-600 font-medium">(You)</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-screen-2xl px-6 py-4 grid gap-3 md:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-3">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="text-xs text-slate-600">Name</label>
              <input
                className="mt-1 block w-44 rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer((s) => ({ ...s, name: e.target.value }))}
                placeholder="Player name"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">UTR</label>
              <input
                className="mt-1 block w-24 rounded-lg border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={newPlayer.utr}
                onChange={(e) => setNewPlayer((s) => ({ ...s, utr: e.target.value }))}
                placeholder="6.5"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600">Color</label>
              <input
                type="color"
                className="mt-1 block h-10 w-16 rounded-lg border border-slate-200 bg-white"
                value={newPlayer.color}
                onChange={(e) => setNewPlayer((s) => ({ ...s, color: e.target.value }))}
              />
            </div>
            <button
              onClick={addPlayer}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-md active:scale-[.99]"
            >
              Add player
            </button>
          </div>
          <div className="mt-3 text-xs text-slate-500">Add other players to compare workflows. Your journey is always visible and highlighted.</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="font-medium mb-2">Workflow Legend</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(TYPE_STYLES).map(([k, v]) => (
              <div key={k} className={`flex items-center gap-2 rounded-xl px-2 py-1 ring-1 ${v.ring} ${v.bg}`}>
                <span className="text-sm">{v.icon}</span>
                <span className="text-xs capitalize">{k}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">Click suggested items to accept or schedule them. View details for completed events.</div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="relative mx-auto max-w-screen-2xl px-3 pb-8">
        <div
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
          style={{ height: "70vh" }}
          onWheel={pan.onWheel}
          onMouseDown={pan.onMouseDown}
          onMouseMove={pan.onMouseMove}
          onMouseUp={pan.onMouseUp}
        >
          {/* Ruler and lanes */}
          <div className="absolute inset-0" style={{ transform: `translate(${pan.state.x}px, ${pan.state.y}px) scale(${pan.state.k})`, transformOrigin: "0 0" }}>
            <svg width={adjustedGraphWidth} height={adjustedGraphHeight} className="block">
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
                      stroke={isCurrentUser ? "#8b5cf6" : "#94a3b8"} 
                      strokeWidth={isCurrentUser ? 3 : 2} 
                      strokeDasharray={isCurrentUser ? "0" : "5 5"}
                    />
                  );
                })}
                
                {/* Player indicators above each timeline */}
                {activePlayers.map((p, playerIndex) => {
                  const isCurrentUser = p.id === currentUser.id;
                  const y = baseTimelineY + (playerIndex * (laneHeight + laneSpacing));
                  
                  return (
                    <foreignObject key={p.id} x={8} y={y - 60} width={180} height={44}>
                      <div className="pointer-events-none select-none">
                        <div className={`inline-flex items-center gap-2 rounded-xl px-2 py-1 shadow-sm ring-1 ${
                          isCurrentUser 
                            ? "bg-purple-100 ring-purple-300 text-purple-900" 
                            : "bg-white ring-slate-200"
                        }`}>
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                          <div className="text-xs font-medium">{p.name}</div>
                          <div className="text-[10px] text-slate-500">UTR {p.utr}</div>
                          {isCurrentUser && <div className="text-[10px] text-purple-600 font-medium">(You)</div>}
                        </div>
                      </div>
                    </foreignObject>
                  );
                })}
              </g>

              {/* Event icons along each player's timeline */}
              {activePlayers.map((p, playerIndex) => {
                const y = baseTimelineY + (playerIndex * (laneHeight + laneSpacing));
                const isCurrentUser = p.id === currentUser.id;
                return (
                  <g key={p.id + "-events"}>
                    {p.events.map((e: any) => {
                      const x = xScale(e.date);
                      const style = TYPE_STYLES[e.kind as keyof typeof TYPE_STYLES] ?? TYPE_STYLES.event;
                      const size = 11; // outer dot radius (slightly larger to prevent glyph cropping)
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
                          <g transform="translate(-6, -6)">
                            <Icon name={e.kind} size={12} className="text-slate-700" />
                          </g>
                        </g>
                      );
                    })}
                  </g>
                );
              })}

              {/* Inline details popover anchored to selected icon */}
              {selected && (
                <foreignObject x={selected.x + 18} y={selected.y - 90} width={340} height={360}>
                  <div className="pointer-events-auto">
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
            </svg>
          </div>

          {/* Empty state overlay if no players visible */}
          {activePlayers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Select at least one player to view the journey
            </div>
          )}
        </div>
      </div>

      {/* Right-side details panel removed (using inline popover near icon) */}

      {/* Footer helper */}
      <div className="mx-auto max-w-screen-2xl px-6 pb-8 text-xs text-slate-500">
        All players share one workflow timeline. Your journey is highlighted in purple. Add other players to compare workflows. Click any event card to see more details. Use action buttons on suggested items to plan your next steps.
      </div>
    </div>
  );
}
