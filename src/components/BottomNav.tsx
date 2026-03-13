import { NavLink } from "react-router-dom";
import { Heart, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Heart, label: "Wishes" },
  { to: "/categories", icon: Grid3X3, label: "Categories" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-card/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-xl">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <tab.icon className="h-5 w-5" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
