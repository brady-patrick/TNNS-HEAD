import React from "react";

export function Switch({ defaultChecked, onChange }: any) { 
  return <input type="checkbox" defaultChecked={defaultChecked} onChange={onChange} className="h-5 w-9 cursor-pointer appearance-none rounded-full bg-muted outline-none transition checked:bg-primary" />; 
}
