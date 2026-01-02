import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Play, Info, Star } from "lucide-react";
import { Movie } from "@shared/schema";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  items: Movie[];
  onPlay: (item: Movie) => void;
}

export function HeroCarousel({ items, onPlay }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 60 }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (!items.length) return null;

  return (
    <div className="relative w-full h-auto">
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden group">
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {items.map((item) => (
              <div key={item.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                  <img
                    src={item.backdropUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent hidden md:block" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex items-center z-20 overflow-visible">
                  <div className="container max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 pointer-events-none w-full h-full flex flex-col justify-center">
                    <div className="max-w-3xl space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-10 duration-700 pointer-events-auto">
                      <div className="flex items-center gap-3 text-xs md:text-sm font-semibold text-accent uppercase tracking-wider flex-wrap">
                        <span>{item.genre}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>{item.rating}</span>
                        <span className="w-1 h-1 rounded-full bg-white/50" />
                        <span>{item.duration} min</span>
                      </div>

                      <h1 className="text-3xl md:text-5xl font-display font-bold text-white text-shadow-lg leading-tight">
                        {item.title}
                      </h1>

                      <p className="text-sm md:text-lg text-white/80 line-clamp-2 text-shadow leading-relaxed max-w-xl">
                        {item.description}
                      </p>

                      <div className="flex items-center gap-3 pt-4 md:pt-6 relative z-30 pointer-events-auto flex-wrap">
                        <Button
                          size="lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlay(item);
                          }}
                          className="bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 active:bg-white/40 transition-all duration-200 rounded-full px-7 md:px-9 h-11 md:h-12 text-sm md:text-base font-semibold gap-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.5)] isolate cursor-pointer hover:shadow-[0_30px_70px_rgba(0,0,0,0.6)]"
                          data-testid="button-play-now"
                        >
                          <Play className="fill-white w-5 h-5 md:w-6 md:h-6" />
                          Play Now
                        </Button>
                        <div className="bg-red-600/20 border border-red-600/50 text-red-500 backdrop-blur-md rounded-full px-4 md:px-6 h-10 md:h-12 flex items-center gap-2 text-xs md:text-sm font-bold animate-pulse">
                          <Star className="w-4 h-4 md:w-5 md:h-5 fill-red-500" />
                          TRENDING
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-12 right-12 flex gap-3 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === selectedIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50"
              )}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
