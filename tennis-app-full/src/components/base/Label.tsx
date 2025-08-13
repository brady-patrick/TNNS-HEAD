import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Label({ className, ...props }: any) { 
  return <label className={cn("text-sm font-medium", className)} {...props} />; 
}
