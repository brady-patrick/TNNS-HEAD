import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Textarea({ className, ...props }: any) { 
  return <textarea className={cn("min-h-[44px] w-full rounded-xl border p-3 text-sm", className)} {...props} />; 
}
