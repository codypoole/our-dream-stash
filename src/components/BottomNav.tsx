import { NavLink } from "react-router-dom";
import { Heart, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Heart, label: "Wishes" },
  { to: "/categories", icon: Grid3X3, label: "Categories" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/40 bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-xl">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-[11px] font-semibold uppercase tracking-wider transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200",
                  isActive && "bg-primary/10"
                )}>
                  <tab.icon className={cn("h-[18px] w-[18px]", isActive && "fill-primary/20")} />
                </div>
                {tab.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
