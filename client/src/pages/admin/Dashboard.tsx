import { AdminLayout } from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Film, MonitorPlay, Activity, Smartphone, Tablet, Monitor } from "lucide-react";
import { useMovies } from "@/hooks/use-movies";
import { useSeries } from "@/hooks/use-series";
import { useQuery } from "@tanstack/react-query";

export default function AdminDashboard() {
  const { data: movies } = useMovies();
  const { data: series } = useSeries();
  
  const { data: activeUsersByDevice } = useQuery({
    queryKey: ["/api/analytics/active-users-by-device"],
  });
  
  const { data: totalActiveUsers } = useQuery({
    queryKey: ["/api/analytics/total-active-users"],
  });
  
  const { data: streamViewsData } = useQuery({
    queryKey: ["/api/analytics/total-stream-views"],
  });

  const deviceIconMap: Record<string, typeof Smartphone> = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
  };

  const stats = [
    { title: "Total Movies", value: movies?.length || 0, icon: Film, color: "text-blue-500" },
    { title: "Total Series", value: series?.length || 0, icon: MonitorPlay, color: "text-purple-500" },
    { title: "Active Users (24h)", value: totalActiveUsers?.total || 0, icon: Users, color: "text-green-500" },
    { title: "Stream Views", value: (streamViewsData?.total || 0).toLocaleString(), icon: Activity, color: "text-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="bg-card/50 border-white/5 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-card/50 border-white/5 backdrop-blur-sm col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Active Users by Device</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeUsersByDevice && activeUsersByDevice.length > 0 ? (
                  activeUsersByDevice.map((device: any) => {
                    const Icon = deviceIconMap[device.deviceType as keyof typeof deviceIconMap] || Monitor;
                    return (
                      <div key={device.deviceType} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-blue-500" />
                          <span className="text-white capitalize">{device.deviceType}</span>
                        </div>
                        <span className="text-lg font-semibold text-white">{device.count}</span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted-foreground text-sm">No active users in last 24 hours</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5 backdrop-blur-sm col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Stream Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <span className="text-muted-foreground">Total Views</span>
                  <span className="text-2xl font-bold text-orange-500">{(streamViewsData?.total || 0).toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-4">Stream view analytics help track content popularity and user engagement across your platform.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5 backdrop-blur-sm col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Recent Movies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movies?.slice(0, 5).map(movie => (
                  <div key={movie.id} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0">
                    <div className="w-12 h-16 rounded overflow-hidden bg-gray-800">
                      <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{movie.title}</p>
                      <p className="text-sm text-muted-foreground">{movie.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-white/5 backdrop-blur-sm col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Recent Series</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {series?.slice(0, 5).map(show => (
                  <div key={show.id} className="flex items-center gap-4 border-b border-white/5 pb-3 last:border-0">
                    <div className="w-12 h-16 rounded overflow-hidden bg-gray-800">
                      <img src={show.posterUrl} alt={show.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{show.title}</p>
                      <p className="text-sm text-muted-foreground">{show.genre}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
