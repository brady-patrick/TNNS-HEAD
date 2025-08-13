import React, { createContext, useContext, useState, cloneElement } from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

// --- Simple Dialog ---
const DialogCtx = createContext<{ open: boolean; setOpen: (v: boolean) => void } | null>(null);

export function Dialog({ open, onOpenChange, children }: any) {
  const [local, setLocal] = useState(!!open);
  const setOpen = (v: boolean) => { setLocal(v); onOpenChange && onOpenChange(v); };
  return <DialogCtx.Provider value={{ open: local, setOpen }}>{children}</DialogCtx.Provider>;
}

export function DialogTrigger({ asChild, children }: any) {
  const ctx = useContext(DialogCtx)!; 
  if (!asChild) return null; 
  return cloneElement(children, { onClick: () => ctx.setOpen(true) });
}

export function DialogContent({ className, children }: any) {
  const ctx = useContext(DialogCtx)!; 
  if (!ctx?.open) return null; 
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn("relative z-10 w-full max-w-xl rounded-2xl border bg-background p-4", className)}>{children}</div>
    </div>
  );
}

export function DialogHeader({ className, ...props }: any) { 
  return <div className={cn("mb-2", className)} {...props} />; 
}

export function DialogTitle({ className, ...props }: any) { 
  return <h4 className={cn("text-base font-semibold", className)} {...props} />; 
}
