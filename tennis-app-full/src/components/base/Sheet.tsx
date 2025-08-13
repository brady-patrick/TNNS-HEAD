import React, { createContext, useContext, useState, cloneElement } from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

// --- Simple Sheet ---
const SheetCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Sheet({ children }: any) { 
  const [open, setOpen] = useState(false); 
  return <SheetCtx.Provider value={{ open, setOpen }}>{children}</SheetCtx.Provider>; 
}

export function SheetTrigger({ asChild, children }: any) { 
  const ctx = useContext(SheetCtx)!; 
  return cloneElement(children, { onClick: () => ctx.setOpen(true) }); 
}

export function SheetContent({ className, children }: any) {
  const ctx = useContext(SheetCtx)!; 
  if (!ctx?.open) return null; 
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("absolute right-0 top-0 h-full w-[420px] max-w-full border-l bg-background p-4", className)}>{children}</div>
    </div>
  );
}

export function SheetHeader({ className, ...props }: any) { 
  return <div className={cn("mb-2", className)} {...props} />; 
}

export function SheetTitle({ className, ...props }: any) { 
  return <h4 className={cn("text-base font-semibold", className)} {...props} />; 
}
