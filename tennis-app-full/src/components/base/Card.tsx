import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Card({ className, ...props }: any) { 
  return <div className={cn("rounded-2xl border bg-card", className)} {...props} />; 
}

export function CardHeader({ className, ...props }: any) { 
  return <div className={cn("p-4", className)} {...props} />; 
}

export function CardTitle({ className, ...props }: any) { 
  return <h3 className={cn("text-lg font-semibold", className)} {...props} />; 
}

export function CardDescription({ className, ...props }: any) { 
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />; 
}

export function CardContent({ className, ...props }: any) { 
  return <div className={cn("p-4 pt-0", className)} {...props} />; 
}
