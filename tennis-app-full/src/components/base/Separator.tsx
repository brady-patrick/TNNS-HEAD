import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Separator({ className, ...props }: any) { 
  return <div className={cn("my-2 h-px w-full bg-border", className)} {...props} />; 
}
