import MobileTitle from "./mobileTitle";
import { TrendCardProps } from "../types/TrendCard";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useState, useEffect } from "react";
import { TrendData } from "../types/TrendCard";
import TrendCard from "./TrendCard";
import LoadingSpin from "@/core/components/global/loadingSpin";

export default function TrendSection() {
  const { toast } = useToast();
  const [trendCardData, setTrendCardData] = useState<TrendCardProps[]>([]);
  // 取得 Trend 列表
  const { data, error, refetch } = useRequest<TrendData[]>({
    queryKey: ["take=3"],
    url: "/api/v1/concerts/popular",
  }).useGet();

  useEffect(() => {
    if (Array.isArray(data)) {
      const covertData = data.map((item) => {
        return {
          title: item.conTitle,
          image: item.imgBanner ?? "",
          bgImage: item.imgBanner ?? "",
          description: item.conIntroduction ?? "",
          link: item.concertId,
        };
      });
      setTrendCardData(covertData);
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
  return (
    <section className="relative mt-24 min-h-[100px]">
      {trendCardData.length > 0 ? (
        <>
          {/* 手機板 */}
          <div className="lg:hidden">
            <MobileTitle title="熱門活動" subtitle="Trending Now" />
            <div className="mt-5 space-y-4">
              {trendCardData.map((card) => (
                <TrendCard key={card.title} {...card} />
              ))}
            </div>
          </div>
          {/* 電腦板 */}
          <div className="hidden min-h-[100vh] lg:block">
            <div className="relative mx-auto w-fit text-center text-4xl font-bold select-none">
              <h2 className="relative z-20 bg-gradient-to-r from-[#2D6ED0] to-[#2BC6CC] bg-clip-text text-[48px] text-transparent">熱門活動</h2>
              <span className={`absolute top-[20%] left-[calc(100%+2rem)] text-[40px] text-nowrap text-neutral-200`}>Trending Now</span>
            </div>
            <div className="mt-20 space-y-6">
              {trendCardData.map((card) => (
                <TrendCard key={card.title} {...card} />
              ))}
            </div>
            <div className="absolute top-20 left-[20%] -z-10 hidden h-[1350px] w-[90%] rounded-2xl border-4 2xl:block"></div>
          </div>
        </>
      ) : (
        <LoadingSpin />
      )}
    </section>
  );
}
