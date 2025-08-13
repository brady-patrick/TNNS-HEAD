import React, { createContext, useContext, useState } from "react";
import { X, BarChart2 } from "lucide-react";
import { Button, Card } from "../App";

// Stats Drawer Context
const StatsDrawerCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

// Stats Drawer Components
export function StatsDrawer({ children, open, onOpenChange }: any) { 
  const [localOpen, setLocalOpen] = useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : localOpen;
  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setLocalOpen(value);
    }
  };
  return <StatsDrawerCtx.Provider value={{ open: currentOpen, setOpen }}>{children}</StatsDrawerCtx.Provider>; 
}

export function StatsDrawerTrigger({ asChild, children }: any) { 
  const ctx = useContext(StatsDrawerCtx)!; 
  return React.cloneElement(children, { onClick: () => ctx.setOpen(true) }); 
}

export function StatsDrawerContent({ className, children }: any) {
  const ctx = useContext(StatsDrawerCtx)!; 
  if (!ctx?.open) return null; 
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className={`fixed right-0 top-0 h-full w-[500px] max-w-[90vw] border-l bg-background overflow-hidden transform transition-transform duration-300 ease-in-out pointer-events-auto ${className || ''}`}>
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function StatsDrawerHeader({ className, ...props }: any) { 
  return <div className={`border-b p-6 ${className || ''}`} {...props} />; 
}

export function StatsDrawerTitle({ className, ...props }: any) { 
  return <h3 className={`text-xl font-semibold ${className || ''}`} {...props} />; 
}

export function StatsDrawerBody({ className, ...props }: any) { 
  return <div className={`p-6 ${className || ''}`} {...props} />; 
}

export function StatsDrawerCloseButton({ className, ...props }: any) {
  const ctx = useContext(StatsDrawerCtx)!;
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`h-8 w-8 p-0 ${className || ''}`}
      onClick={() => ctx.setOpen(false)}
      {...props}
    >
      <span className="sr-only">Close</span>
      <X className="h-4 w-4" />
    </Button>
  );
}

// Tennis Stats Data Interface
interface TennisStats {
  utr: {
    current: number;
    trend: string;
    trendDirection: "positive" | "negative";
    history: Array<{ date: string; rating: number }>;
    matches: {
      total: number;
      wins: number;
      losses: number;
      winRate: string;
      lastMatch: string;
      lastResult: string;
      lastOpponent: string;
      lastUtrChange: string;
    };
    tournaments: {
      total: number;
      titles: number;
      finals: number;
      semifinals: number;
      quarterfinals: number;
    };
    surfaces: {
      hard: { matches: number; winRate: string };
      clay: { matches: number; winRate: string };
      grass: { matches: number; winRate: string };
    };
    styles: {
      aggressive: { matches: number; winRate: string };
      defensive: { matches: number; winRate: string };
      allCourt: { matches: number; winRate: string };
    };
  };
  usta: {
    current: number;
    trend: string;
    trendDirection: "positive" | "negative";
    ranking: string;
    history: Array<{ date: string; points: number }>;
    events: {
      total: number;
      wins: number;
      losses: number;
      winRate: string;
      lastEvent: string;
      lastFinish: string;
      lastDate: string;
    };
    ageGroups: {
      "16U": { ranking: string; points: number };
      "18U": { ranking: string; points: number };
    };
  };
  nsl: {
    current: number;
    trend: string;
    trendDirection: "positive" | "negative";
    ranking: string;
    history: Array<{ date: string; ranking: number }>;
    ladder: {
      total: number;
      wins: number;
      losses: number;
      winRate: string;
      currentStreak: number;
      bestStreak: number;
    };
  };
  performance: {
    serve: {
      firstServe: string;
      firstServeWon: string;
      secondServeWon: string;
      aces: number;
      doubleFaults: number;
      aceRate: string;
    };
    return: {
      firstServeReturnWon: string;
      secondServeReturnWon: string;
      breakPointsConverted: string;
      returnGamesWon: string;
    };
    overall: {
      gamesWon: string;
      setsWon: string;
      matchesWon: string;
      tiebreaks: string;
    };
  };
  fitness: {
    endurance: string;
    speed: string;
    agility: string;
    strength: string;
    flexibility: string;
  };
  goals: {
    shortTerm: string;
    mediumTerm: string;
    longTerm: string;
    progress: {
      utr: { current: number; target: number; percentage: number };
      usta: { current: number; target: number; percentage: number };
      nsl: { current: number; target: number; percentage: number };
    };
  };
}

// Main Stats Drawer Component
interface StatsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tennisStats: TennisStats;
}

export function TennisStatsDrawer({ open, onOpenChange, tennisStats }: StatsDrawerProps) {
  return (
    <StatsDrawer open={open} onOpenChange={onOpenChange}>
      <StatsDrawerContent>
        <StatsDrawerHeader>
          <div className="flex items-center justify-between">
            <StatsDrawerTitle>Complete Tennis Statistics</StatsDrawerTitle>
            <StatsDrawerCloseButton />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Comprehensive UTR, USTA, and performance data</p>
        </StatsDrawerHeader>
        <StatsDrawerBody>
          <div className="space-y-6">
            {/* UTR Section */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                UTR Rating
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3">
                  <div className="text-2xl font-bold text-blue-600">{tennisStats.utr.current}</div>
                  <div className="text-xs text-muted-foreground">Current Rating</div>
                </Card>
                <Card className="p-3">
                  <div className={`text-lg font-semibold ${tennisStats.utr.trendDirection === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {tennisStats.utr.trend}
                  </div>
                  <div className="text-xs text-muted-foreground">Last Change</div>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Matches</span>
                  <span className="font-medium">{tennisStats.utr.matches.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Win Rate</span>
                  <span className="font-medium text-green-600">{tennisStats.utr.matches.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tournaments</span>
                  <span className="font-medium">{tennisStats.utr.tournaments.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Titles</span>
                  <span className="font-medium text-yellow-600">{tennisStats.utr.tournaments.titles}</span>
                </div>
              </div>
            </div>

            {/* USTA Section */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                USTA Rankings
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3">
                  <div className="text-2xl font-bold text-green-600">{tennisStats.usta.current}</div>
                  <div className="text-xs text-muted-foreground">Points</div>
                </Card>
                <Card className="p-3">
                  <div className={`text-lg font-semibold ${tennisStats.usta.trendDirection === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {tennisStats.usta.trend}
                  </div>
                  <div className="text-xs text-muted-foreground">Point Change</div>
                </Card>
              </div>
              <div className="text-sm text-muted-foreground mb-3">{tennisStats.usta.ranking}</div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Events</span>
                  <span className="font-medium">{tennisStats.usta.events.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Event Win Rate</span>
                  <span className="font-medium text-green-600">{tennisStats.usta.events.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>16U Ranking</span>
                  <span className="font-medium">{tennisStats.usta.ageGroups["16U"].ranking}</span>
                </div>
              </div>
            </div>

            {/* NSL Section */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                NSL Ladder
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Card className="p-3">
                  <div className="text-2xl font-bold text-purple-600">#{tennisStats.nsl.current}</div>
                  <div className="text-xs text-muted-foreground">National Rank</div>
                </Card>
                <Card className="p-3">
                  <div className={`text-lg font-semibold ${tennisStats.nsl.trendDirection === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {tennisStats.nsl.trend}
                  </div>
                  <div className="text-xs text-muted-foreground">Rank Change</div>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Ladder Matches</span>
                  <span className="font-medium">{tennisStats.nsl.ladder.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Ladder Win Rate</span>
                  <span className="font-medium text-green-600">{tennisStats.nsl.ladder.winRate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Streak</span>
                  <span className="font-medium text-blue-600">{tennisStats.nsl.ladder.currentStreak}</span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                Performance Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Serve</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>1st Serve</span>
                      <span className="font-medium">{tennisStats.performance.serve.firstServe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>1st Won</span>
                      <span className="font-medium">{tennisStats.performance.serve.firstServeWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aces</span>
                      <span className="font-medium">{tennisStats.performance.serve.aces}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Return</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Break Points</span>
                      <span className="font-medium">{tennisStats.performance.return.breakPointsConverted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Return Games</span>
                      <span className="font-medium">{tennisStats.performance.return.returnGamesWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overall Games</span>
                      <span className="font-medium">{tennisStats.performance.overall.gamesWon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fitness & Goals */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                Fitness & Goals
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Fitness Scores</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Endurance</span>
                      <span className="font-medium">{tennisStats.fitness.endurance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Speed</span>
                      <span className="font-medium">{tennisStats.fitness.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Agility</span>
                      <span className="font-medium">{tennisStats.fitness.agility}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Goal Progress</div>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>UTR 8.0</span>
                      <span className="font-medium">{tennisStats.goals.progress.utr.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>USTA 1500</span>
                      <span className="font-medium">{tennisStats.goals.progress.usta.percentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NSL Top 200</span>
                      <span className="font-medium">{tennisStats.goals.progress.nsl.percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                Recent Activity
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">Last Match</div>
                    <div className="text-xs text-muted-foreground">{tennisStats.utr.matches.lastMatch}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{tennisStats.utr.matches.lastResult}</div>
                    <div className="text-xs text-muted-foreground">{tennisStats.utr.matches.lastUtrChange}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm p-2 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Last Tournament</div>
                    <div className="text-xs text-muted-foreground">{tennisStats.usta.events.lastDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-orange-600">{tennisStats.usta.events.lastFinish}</div>
                    <div className="text-xs text-muted-foreground">{tennisStats.usta.events.lastEvent}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StatsDrawerBody>
      </StatsDrawerContent>
    </StatsDrawer>
  );
}
