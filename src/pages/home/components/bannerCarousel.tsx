import { Carousel, CarouselContent, CarouselItem } from "@/core/components/ui/Carousel";
import CustomCarouselItem from "./bannerCarouselItem";
import { Button } from "@/core/components/ui/button";
import React from "react";
import { CarouselApi } from "@/core/components/ui/Carousel";
import { useNavigate } from "react-router-dom";
import { BannerItem } from "../types/bannerSection";

interface HomeCarouselProps {
  bannerList: BannerItem[];
}

export default function HomeCarousel({ bannerList }: HomeCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = React.useState(bannerList[0].id);
  const [activeConcertId, setActiveConcertId] = React.useState(bannerList[0].concertId);
  const navigate = useNavigate();
  // 監聽滑動變化
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setActiveIndex(index);
      setActiveConcertId(bannerList[index].concertId);
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, bannerList]);

  // 添加自動輪播功能
  React.useEffect(() => {
    if (!api) return;

    // 設置5秒自動切換
    const autoplayInterval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // 清理定時器
    return () => clearInterval(autoplayInterval);
  }, [api]);

  // 處理分頁點擊事件
  const handlePaginationClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
    setActiveIndex(index);
  };

  return (
    <div className="relative w-full">
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
        <CarouselContent>
          {bannerList.map((banner) => (
            <CarouselItem key={banner.id} className="w-full">
              <CustomCarouselItem imageUrl={banner.image} title={banner.title} description={banner.description} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="left-10" /> */}
        {/* <CarouselNext className="right-10" /> */}
      </Carousel>

      {/* 遮罩內容 - 固定位置，不隨輪播移動 */}
      <div className="absolute right-0 bottom-0 left-0 z-10">
        {/* 凹槽主體，內凹中央 */}
        <div className="absolute -bottom-1 left-1/2 z-10 block h-[80px] w-[calc(75%-118px)] min-w-[270px] translate-x-[-50%] rounded-t-[40px] bg-white lg:left-[77%] lg:max-w-[300px] lg:translate-x-[-77%]"></div>
        {/* 左下凹槽 */}
        <div
          className="left-[12.6%] block lg:hidden"
          style={{
            position: "absolute",
            bottom: "-4px",
            width: "60px",
            height: "60px",
            backgroundColor: "white",
            transform: "rotate(180deg)",
            maskImage: "radial-gradient(circle at 100% 110%, transparent 70%, black 72%)",
            WebkitMaskImage: "radial-gradient(circle at 100% 100%, transparent 70%, black 72%)",
            filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
          }}
        />
        {/* 右下凹槽 */}
        <div
          className="right-[12.6%] block lg:hidden"
          style={{
            position: "absolute",
            bottom: "-4px",
            width: "60px",
            height: "60px",
            backgroundColor: "white",
            transform: "rotate(270deg)",
            maskImage: "radial-gradient(circle at 100% 90%, transparent 70%, black 72%)",
            WebkitMaskImage: "radial-gradient(circle at 100% 100%, transparent 70%, black 72%)",
            filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.3))",
          }}
        />
        <Button
          variant={"gradientVertical"}
          className="absolute -bottom-6 left-[calc(50%-5px)] z-10 mx-2 flex h-[80px] w-[calc(75%-160px)] min-w-[200px] translate-x-[-50%] items-center text-center text-4xl text-white select-none sm:text-left lg:left-[calc(77%-20px)] lg:max-w-[250px] lg:translate-x-[-77%]"
          onClick={() => navigate(`/concert/${activeConcertId}`)}
        >
          <h4>報名!</h4>
        </Button>
      </div>
      {/* banner pagination */}
      <div className="absolute right-0 -bottom-16 left-0 z-10 flex justify-center gap-2 lg:-bottom-6 lg:translate-x-[-20%]">
        {bannerList.map((banner, index) => (
          <button
            disabled={true}
            key={banner.id}
            className={`h-2 w-[40px] rounded-full bg-gray-300 transition-all lg:w-[80px] ${
              index === activeIndex ? "bg-[image:var(--primary-gradient-horizontal)]" : ""
            }`}
            onClick={() => handlePaginationClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
