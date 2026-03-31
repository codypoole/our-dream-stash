import { NavLink } from "react-router-dom";
import { Heart, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Heart, label: "Wishes" },
  { to: "/categories", icon: Grid3X3, label: "Categories" },
];

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex justify-center"
      style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/90 backdrop-blur-2xl p-1.5 shadow-2xl shadow-black/50">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  className={cn(
                    "h-[15px] w-[15px] transition-all duration-300",
                    isActive && "fill-primary-foreground/30"
                  )}
                />
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
