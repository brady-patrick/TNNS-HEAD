import React from "react";

const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

export function Button({ variant = "default", size = "md", className, children, ...props }: any) {
  const variants: any = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-foreground",
    ghost: "bg-transparent",
    link: "bg-transparent underline",
    outline: "border",
  };
  const sizes: any = { sm: "h-8 px-3 text-sm", md: "h-9 px-4", lg: "h-10 px-5" };
  return (
    <button className={cn("inline-flex items-center justify-center rounded-xl shadow-sm transition gap-1", variants[variant] || "", sizes[size] || "", className)} {...props}>
      {children}
    </button>
  );
}
