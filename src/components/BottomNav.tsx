import { NavLink } from "react-router-dom";
import { Heart, Grid3X3, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Heart, label: "Wishes" },
  { to: "/gallery", icon: ImageIcon, label: "Gallery" },
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
                "flex items-center justify-center rounded-full h-10 w-10 transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
            title={tab.label}
          >
            {({ isActive }) => (
              <tab.icon
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-300",
                  isActive && "fill-primary-foreground/30"
                )}
              />
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
