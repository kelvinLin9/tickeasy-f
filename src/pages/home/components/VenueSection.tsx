import MobileTitle from "./mobileTitle";
import VenueCard from "./VenueCard";
import VenueCarousel from "./VenueCarousel";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useState, useEffect } from "react";
import { VenueData, VenueCardProps } from "../types/VenueCard";
import { Button } from "@/core/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function VenueSection() {
  const { toast } = useToast();
  const [venueCardData, setVenueCardData] = useState<VenueCardProps[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 3;

  // 取得 Venue 列表
  const { data, error, refetch } = useRequest<VenueData[]>({
    queryKey: ["concerts", "venues"],
    url: "/api/v1/concerts/venues",
  }).useGet();

  useEffect(() => {
    if (Array.isArray(data)) {
      // 前端要自己加上圖片索引 確保頁嵌更新一致，Key值要轉換(與CarouselItem的id一致)
      const covertData = data.map((item, index) => {
        return {
          idx: index,
          title: item.venueName,
          image: item.venueImageUrl ?? "",
          description: item.venueDescription ?? "",
          address: item.venueAddress,
          capacity: item.venueCapacity?.toString() ?? "",
          CanBus: item.hasTransit,
          CanParking: item.hasParking,
        };
      });
      setVenueCardData(covertData);
    }
  }, [data]);

  // 處理錯誤
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "發生錯誤，請稍後再試",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? venueCardData.length - cardsPerPage : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev >= venueCardData.length - cardsPerPage ? 0 : prev + 1));
  };

  return (
    <section className="mt-10 min-h-[100px]">
      {/* 手機板 */}
      <div className="lg:hidden">
        <MobileTitle title="場館資訊" subtitle="Spotlight Venues" />
        <div className="mt-10">
          <VenueCarousel cardList={venueCardData} />
        </div>
      </div>
      {/* 電腦板 */}
      <div className="mt-20 hidden h-[60vh] min-h-[700px] lg:block">
        <div className="h-[360px] bg-neutral-100 pt-[100px]">
          <div className="mx-auto flex max-w-[1600px] gap-4">
            <div className="relative mx-4 h-fit w-fit min-w-[200px] text-center text-4xl font-bold select-none xl:min-w-[300px]">
              <h2 className="relative z-20 bg-gradient-to-r from-[#2D6ED0] to-[#2BC6CC] bg-clip-text text-[48px] text-transparent">場館資訊</h2>
              <span className={`text-primary/20 absolute top-full -left-[0px] hidden text-[40px] text-wrap text-neutral-200 xl:block`}>
                Spotlight Venues
              </span>
              <span className="absolute top-80 left-50 flex h-[100px] w-[200px] -translate-x-1/2 gap-4">
                <Button
                  size="icon"
                  disabled={currentIndex === 0}
                  className="bg-sidebar-accent-foreground hover:bg-sidebar-accent-foreground/90 rounded-full p-6"
                  onClick={handlePrevClick}
                >
                  <ChevronLeftIcon className="h-[14px] text-neutral-800" />
                </Button>
                <Button
                  size="icon"
                  disabled={currentIndex >= venueCardData.length - cardsPerPage}
                  className="bg-sidebar-accent-foreground hover:bg-sidebar-accent-foreground/90 rounded-full p-6"
                  onClick={handleNextClick}
                >
                  <ChevronRightIcon className="h-[14px] text-neutral-800" />
                </Button>
              </span>
            </div>
            <div className="overflow-hidden">
              <div
                className="flex gap-4 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
              >
                {venueCardData.map((card) => (
                  <div key={card.idx} className="w-[calc(33.333%-1rem)] flex-shrink-0">
                    <VenueCard {...card} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
