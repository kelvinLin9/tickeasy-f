import { Layout } from "@/pages/comm/views/layout";
import BuyTicketSection from "../components/BuyTicketSection";
import { BuyTicketProvider } from "../hook/BuyTicketContext";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Concert } from "@/pages/comm/types/Concert";
import { useRequest } from "@/core/hooks/useRequest";
import { useToast } from "@/core/hooks/useToast";
export default function Page() {
  const { concertId } = useParams();
  const { toast } = useToast();
  // 取得 單一演唱會資訊
  // 使用 useMemo 來記憶請求配置
  const fetchConcertData = useMemo(
    () => ({
      queryKey: concertId ? [concertId] : [], // 確保 queryKey 只包含有效的字串
      url: `/api/v1/concerts/${concertId}`,
      enabled: !!concertId,
    }),
    [concertId]
  );
  const { data, error } = useRequest<Concert>(fetchConcertData).useGet();
  // 使用 useMemo 處理 sessionTicketData
  const concertData = useMemo(() => (data && "concertId" in data ? data : ({} as Concert)), [data]);

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

  return (
    <Layout>
      <BuyTicketProvider>
        <div className="min-h-[calc(100vh-6rem)]">
          <BuyTicketSection concertData={concertData} />
        </div>
      </BuyTicketProvider>
    </Layout>
  );
}
