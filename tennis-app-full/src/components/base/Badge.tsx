import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Badge({ variant = "default", className, ...props }: any) { 
  const variants: any = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-foreground",
  };
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", variants[variant] || "", className)} {...props} />; 
}
