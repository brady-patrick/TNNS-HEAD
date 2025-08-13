import React, { useMemo, useState } from "react";
import { BarChart2, MapPin } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Avatar, AvatarFallback, Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../components/base";

// ---------- Mock data ----------
interface Player { id: number; name: string; location: string; utr: number; usta: number; nsl: number; dominant?: "L"|"R" }
const allPlayers: Player[] = [
  { id: 101, name: "Maya Patel", location: "Longmont, CO", utr: 7.5, usta: 1660, nsl: 230, dominant: "R" },
  { id: 102, name: "Dylan Park", location: "Loveland, CO", utr: 8.1, usta: 1104, nsl: 180, dominant: "L" },
  { id: 103, name: "Leo Campos", location: "Greeley, CO", utr: 7.9, usta: 1322, nsl: 205, dominant: "R" },
  { id: 104, name: "Maddie Zhou", location: "Boulder, CO", utr: 8.3, usta: 990, nsl: 160, dominant: "R" },
  { id: 105, name: "J. Cruz", location: "Denver, CO", utr: 7.2, usta: 1820, nsl: 260, dominant: "R" },
];

// ---------- Helper UI ----------
const Metric = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="text-center">
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="text-lg font-semibold">{value}</div>
  </div>
);

export function Players() {
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
            <Input value={q} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)} placeholder="Search players" className="w-56" />
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
