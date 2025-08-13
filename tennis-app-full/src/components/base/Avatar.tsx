import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Avatar({ className, children }: any) { 
  return <div className={cn("relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted", className)}>{children}</div>; 
}

export function AvatarImage({ src, alt }: any) { 
  return src ? <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" /> : null; 
}

export function AvatarFallback({ children }: any) { 
  return <span className="text-xs text-muted-foreground">{children}</span>; 
}
