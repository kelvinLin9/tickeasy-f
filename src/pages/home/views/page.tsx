import Header from "@/core/components/global/header";
import BannerSection from "../components/bannerSection";
import TrendSection from "../components/TrendSection";
import LastestSection from "../components/LastestSection";
import CategorySection from "../components/CategorySection";
import VenueSection from "../components/VenueSection";
import Footer from "@/core/components/global/footer";
import ScrollTopBtn from "@/core/components/global/ScrollTopBtn";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
import { useState, useEffect } from "react";
import { RawConertData } from "../types/RawConertData";
export default function Page() {
  const { toast } = useToast();
  const [rawConcertList, setRawConcertList] = useState<RawConertData[]>([]);

  // 取得 原始Convert 列表
  const { data, error, refetch } = useRequest<RawConertData[]>({
    queryKey: [],
    url: "/api/v1/concerts/search",
  }).useGet();

  useEffect(() => {
    if (Array.isArray(data)) {
      setRawConcertList(data);
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
    <div className="mt-24 flex flex-col overflow-x-hidden overflow-y-scroll pb-[400px]">
      <Header />
      <main>
        <BannerSection />
        <TrendSection />
        <LastestSection rawConcertList={rawConcertList} />
        <CategorySection rawConcertList={rawConcertList} />
        <VenueSection />
        <Footer />
      </main>
      <ScrollTopBtn />
    </div>
  );
}
