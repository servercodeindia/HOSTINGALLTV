import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Film, 
  MonitorPlay, 
  ArrowLeft 
} from "lucide-react";
import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  const links = [
    { href: "/server/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/server/admin/movies", label: "Movies", icon: Film },
    { href: "/server/admin/series", label: "Series", icon: MonitorPlay },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col fixed inset-y-0 z-20">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-4 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Site
          </Link>
          <h1 className="text-xl font-display font-bold text-white tracking-wide uppercase">
            HOSTINGALL<span className="text-blue-500">TV</span>.com
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}>
                  <Icon className="w-5 h-5" />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 animate-in fade-in duration-500">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
