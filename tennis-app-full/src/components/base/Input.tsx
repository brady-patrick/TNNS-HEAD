import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Input({ className, ...props }: any) { 
  return <input className={cn("h-9 w-full rounded-xl border px-3 text-sm", className)} {...props} />; 
}
