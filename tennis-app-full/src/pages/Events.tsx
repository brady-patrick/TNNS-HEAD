import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/base";

export function Events() {
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
