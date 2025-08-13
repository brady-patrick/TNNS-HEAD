import React, { useState } from "react";
import { Video, Upload, Sparkles, MessageSquare } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Textarea, Badge, Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "../components/base";

export function Coaching() {
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
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
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
            <Textarea value={input} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} placeholder="Ask about technique, tactics, or fitness" className="resize-none" />
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
