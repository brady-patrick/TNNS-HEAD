import React from "react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Separator, Switch } from "../components/base";

// ---------- Mock data ----------
const me = {
  name: "Olivia Rhye",
  email: "olivia@untitledui.com",
  location: "Fort Collins, CO",
  age: 17,
};

export function Settings() {
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
