import { Link, useLocation } from "wouter";
import { Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[calc(100%-3rem)] md:w-auto">
      <div className="bg-black/40 backdrop-blur-2xl px-4 md:px-6 py-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10 flex items-center justify-between gap-4 md:gap-12">
        <Link href="/" className="text-lg md:text-xl font-display font-bold text-white tracking-tighter hover:opacity-80 transition-opacity whitespace-nowrap">
          HOSTINGALL<span className="text-blue-500">TV</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="rounded-full text-white/60 hover:text-white hover:bg-white/20 active:bg-white/30 transition-all duration-300 h-10 w-10 ring-1 ring-white/10"
            onClick={() => {/* Future auth logic */}}
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
