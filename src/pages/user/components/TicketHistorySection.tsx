import { useState } from "react";
import TicketCard from "./TicketCard";
import { Button } from "@/core/components/ui/button";
import EticketCard from "./EticketCard";
import { useToast } from "@/core/hooks/useToast";
import { useRequest } from "@/core/hooks/useRequest";
import { useEffect } from "react";
import { ticketHistoryItem } from "../types/ticketHistory";
import LoadingSpin from "@/core/components/global/loadingSpin";
import EmptyTicketRecord from "./emptyTicketRecord";
import { useNavigate } from "react-router-dom";
interface ticketHistoryResponse {
  data: [ticketHistoryItem[]];
}
export default function TicketHistorySection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pageStep, setPageStep] = useState<"allTicket" | "eTicket">("allTicket");
  const [ticketHistory, setTicketHistory] = useState<ticketHistoryItem[]>([]);
  // 取得購票紀錄
  const { useGet } = useRequest<ticketHistoryResponse>({
    queryKey: ["orders"],
    url: "/api/v1/users/orders",
  });
  const { data, error, isLoading, refetch } = useGet();
  useEffect(() => {
    if (data && Array.isArray(data) && data[0].length > 0) {
      const sortedData = data[0].sort((a: ticketHistoryItem, b: ticketHistoryItem) => {
        return new Date(b.orderCreatedAt).getTime() - new Date(a.orderCreatedAt).getTime();
      });
      setTicketHistory(sortedData);
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
  }, [pageStep, refetch]);
  return (
    <div className="mx-auto my-6 w-[90%]">
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <>
          {ticketHistory.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-2">
              <EmptyTicketRecord text="尚未參與任一演唱會" />
              <Button variant="outline" className="mx-auto w-[70%]" onClick={() => navigate("/concerts")}>
                前往查看所有演唱會
              </Button>
            </div>
          ) : (
            <>
              <>
                <div>
                  <p className="text-2xl font-bold">參與演唱會</p>
                  {ticketHistory.filter((item) => item.orderStatus === "paid").length === 0 ? (
                    <EmptyTicketRecord text="尚未參與演唱會" />
                  ) : (
                    <div>
                      {ticketHistory
                        .filter((item) => item.orderStatus === "paid")
                        .map((item) =>
                          pageStep === "allTicket" ? (
                            <TicketCard key={item.ticketId} ticketData={item} setPageStep={setPageStep} />
                          ) : (
                            <EticketCard key={item.ticketId} ticketData={item} ticketId={item.ticketId} setPageStep={setPageStep} />
                          )
                        )}
                    </div>
                  )}
                </div>
                {pageStep === "allTicket" && (
                  <>
                    <div>
                      <p className="text-2xl font-bold">已結束</p>
                      {ticketHistory.filter((item) => item.orderStatus === "expired").length === 0 ? (
                        <EmptyTicketRecord text="尚未有已結束的演唱會" />
                      ) : (
                        <div>
                          {ticketHistory
                            .filter((item) => item.orderStatus === "expired")
                            .map((item) => (
                              <TicketCard key={item.ticketId} ticketData={item} setPageStep={setPageStep} />
                            ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">退票</p>
                      {ticketHistory.filter((item) => item.orderStatus === "refunded").length === 0 ? (
                        <EmptyTicketRecord text="尚未有退票紀錄" />
                      ) : (
                        <div>
                          {ticketHistory
                            .filter((item) => item.orderStatus === "refunded")
                            .map((item) => (
                              <TicketCard key={item.ticketId} ticketData={item} />
                            ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                {pageStep === "eTicket" && (
                  <div className="mt-12 flex justify-center">
                    <Button variant="outline" className="mx-auto w-[70%]" onClick={() => setPageStep("allTicket")}>
                      查看所有購票紀錄
                    </Button>
                  </div>
                )}
              </>
            </>
          )}
        </>
      )}
    </div>
  );
}
