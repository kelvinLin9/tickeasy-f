import HomeCarousel from "./bannerCarousel";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useState, useEffect } from "react";
import { BannerData, BannerItem } from "../types/bannerSection";
import LoadingSpin from "@/core/components/global/loadingSpin";
export default function BannerSection() {
  const { toast } = useToast();
  const [bannerList, setBannerList] = useState<BannerItem[]>([]);

  // 取得 Banner 列表
  const { data, error, refetch } = useRequest<BannerData[]>({
    queryKey: ["concerts", "banners"],
    url: "/api/v1/concerts/banners",
  }).useGet();

  useEffect(() => {
    if (Array.isArray(data)) {
      // 前端要自己加上圖片索引 確保頁嵌更新一致，Key值要轉換(與CarouselItem的id一致)
      const covertData = data.map((item, index) => {
        return {
          id: index,
          concertId: item.concertId,
          image: item.imgBanner,
          title: item.conTitle,
          description: item.conIntroduction,
        };
      });
      setBannerList(covertData);
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
    <section className="relative mx-0 w-full">
      <div className="relative mx-1 sm:mx-8">{bannerList.length > 0 ? <HomeCarousel bannerList={bannerList} /> : <LoadingSpin />}</div>
    </section>
  );
}
