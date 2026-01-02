import { useLocation } from "wouter";
import { Home, Apple, Film, MonitorPlay, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FooterTab {
  id: string;
  label: string;
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const tabs: FooterTab[] = [
  { id: "home", label: "Home", number: 1, icon: Home, href: "/" },
  { id: "movies", label: "Movies", number: 2, icon: Film, href: "/movies" },
  { id: "series", label: "Series", number: 3, icon: MonitorPlay, href: "/series" },
  { id: "search", label: "Search", number: 4, icon: Search, href: "/search" },
];

export function IOS26Footer() {
  const [location, setLocation] = useLocation();

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] md:w-auto px-4">
      <div className="bg-black/50 backdrop-blur-3xl px-3 md:px-4 py-2.5 md:py-3 rounded-full shadow-[0_25px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 flex items-center justify-center gap-3 md:gap-4 relative overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location === tab.href;
          
          return (
            <div key={tab.id} className="relative group">
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-white/15 shadow-[0_8px_25px_rgba(255,255,255,0.1)] rounded-full"
                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                />
              )}
              <motion.button
                onClick={() => setLocation(tab.href)}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  "relative px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-center gap-2 transition-all duration-300 z-10 rounded-full",
                  isActive 
                    ? "text-white" 
                    : "text-white/50 hover:text-white/70"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 md:w-5 md:h-5 transition-all duration-300",
                    isActive ? "text-white" : "text-white/50"
                  )}
                />
                <span className={cn(
                  "text-xs md:text-sm font-medium transition-all duration-300 hidden md:inline",
                  isActive ? "text-white" : "text-white/50"
                )}>
                  {tab.label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
