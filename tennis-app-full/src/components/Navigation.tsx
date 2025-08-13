import React from "react";
import {
  Home as HomeIcon,
  Search,
  Users,
  Sparkles,
  Calendar,
  Settings as SettingsIcon,
} from "lucide-react";
import { Input, Separator, Avatar, AvatarImage, AvatarFallback, Button } from "../App";

// Utility function for class names
const cn = (...c: Array<string | undefined | false>) => c.filter(Boolean).join(" ");

// Sidebar item component
const SidebarItem = React.memo(function SidebarItem({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick?: () => void; 
}) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition", 
        active ? "bg-muted font-medium" : "hover:bg-muted/60"
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </button>
  );
});

// Navigation component props
interface NavigationProps {
  route: string;
  setRoute: (route: any) => void;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function Navigation({ route, setRoute, user }: NavigationProps) {
  const PLACEHOLDER_AVATAR = "data:image/svg+xml;utf8,\n  <svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>\n    <rect width='100%' height='100%' fill='%23eee'/>\n    <text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='24'>--</text>\n  </svg>";

  return (
    <aside className="hidden w-[280px] shrink-0 border-r bg-card p-4 md:flex md:flex-col md:h-screen">
      {/* Logo and brand */}
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-200 to-purple-400" />
        <div>
          <div className="text-lg font-semibold">Untitled UI</div>
          <div className="text-xs text-muted-foreground">Tennis</div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-3">
        <div className="relative">
          <Input placeholder="Search" className="pl-9" />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="mt-4 space-y-1">
        <SidebarItem 
          icon={<HomeIcon className="h-4 w-4" />} 
          active={route === "home"} 
          onClick={() => setRoute("home")} 
          label="Home" 
        />
        <SidebarItem 
          icon={<Users className="h-4 w-4" />} 
          active={route === "players"} 
          onClick={() => setRoute("players")} 
          label="Players" 
        />
        <SidebarItem 
          icon={<Sparkles className="h-4 w-4" />} 
          active={route === "coaching"} 
          onClick={() => setRoute("coaching")} 
          label="AI Coaching" 
        />
        <SidebarItem 
          icon={<Calendar className="h-4 w-4" />} 
          active={route === "events"} 
          onClick={() => setRoute("events")} 
          label="Events" 
        />
        <SidebarItem 
          icon={<SettingsIcon className="h-4 w-4" />} 
          active={route === "settings"} 
          onClick={() => setRoute("settings")} 
          label="Settings" 
        />
      </nav>

      <Separator className="my-4" />

      {/* Support section */}
      <div className="space-y-2 rounded-xl bg-muted/50 p-3">
        <div className="text-xs font-medium">Support</div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Online
          </span>
          <Button size="sm" variant="secondary">Open chat</Button>
        </div>
      </div>

      {/* Spacer to push user profile to bottom */}
      <div className="flex-1" />

      {/* User profile - now pinned to bottom */}
      <div className="rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || PLACEHOLDER_AVATAR} alt={user.name} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
