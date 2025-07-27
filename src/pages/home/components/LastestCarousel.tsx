import { Carousel, CarouselContent, CarouselItem } from "@/core/components/ui/Carousel";
import CustomCarouselItem from "./LastestCard";
import React from "react";
import { LastestCardProps } from "../types/LastestCard";
import { CarouselApi } from "@/core/components/ui/Carousel";

interface LastestCarouselProps {
  cardList: LastestCardProps[];
}

export default function LastestCarousel({ cardList }: LastestCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(cardList[0]?.idx);
  // 添加計時器的 ref
  const autoplayRef = React.useRef<NodeJS.Timeout | null>(null);

  // 創建重置計時器的函數
  const resetAutoplay = React.useCallback(() => {
    if (!api) return;

    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }

    autoplayRef.current = setInterval(() => {
      api.scrollNext();
    }, 5000);
  }, [api]);

  // 監聽滑動變化
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // 修改自動輪播功能
  React.useEffect(() => {
    if (!api) return;

    resetAutoplay();

    // 清理定時器
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [api, resetAutoplay]);

  // 修改分頁點擊事件
  const handlePaginationClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
      resetAutoplay(); // 點擊時重置計時器
    }
    setActiveIndex(index);
  };

  return (
    <div className="relative mb-16 lg:hidden">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
          align: "start",
          containScroll: false,
          watchDrag: false,
        }}
        setApi={setApi}
      >
        <CarouselContent className="">
          {cardList.map((banner) => (
            <CarouselItem key={banner.id} className="flex items-center justify-center">
              <CustomCarouselItem {...banner} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* banner pagination */}
      <div className="absolute right-0 -bottom-8 left-0 z-10 flex justify-center gap-0">
        {cardList.map((banner, index) => (
          <div key={banner.id} className="relative w-[40px]">
            <button
              disabled={false}
              className={`absolute left-1/2 h-3 -translate-x-1/2 cursor-pointer rounded-full bg-gray-300 transition-all duration-300 ${
                index === activeIndex ? "w-[40px] bg-[image:var(--primary-gradient-horizontal)]" : "w-3"
              }`}
              onClick={() => handlePaginationClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
