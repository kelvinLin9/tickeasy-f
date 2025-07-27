import { Button } from "@/core/components/ui/button";
import { TicketDialog } from "./ticketDialog";
import QRCode from "react-qr-code";
import { orderTicket } from "../types/ticketHistory";
import { useEffect, useState } from "react";
import { useToast } from "@/core/hooks/useToast";
import { useRequest } from "@/core/hooks/useRequest";
import LoadingSpin from "@/core/components/global/loadingSpin";
import { ticketHistoryItem } from "../types/ticketHistory";
import RefundSection from "./RefundSection";
const useTicketMethod = [
  {
    id: 0,
    content: "活動當天請打開 Email 或 APP，準備好 QR Code 供現場掃描。",
  },
  {
    id: 1,
    content: "到達會場後，出示 QR Code 給工作人員掃描，完成驗票即可入場。",
  },
  {
    id: 2,
    content: "若活動中需再次驗證，請保留 QR Code 直到活動結束。",
  },
];

const caution = [
  {
    id: 0,
    content: "每張票券限一人使用，QR Code 驗票後即失效，無法重複進場。",
  },
  {
    id: 1,
    content: "禁止任何形式的票券轉售、轉讓或偽造行為，違者主辦單位有權取消資格。",
  },
  {
    id: 2,
    content: "活動將準時開始，請依入場時間前往會場，遲到可能影響入場權益。",
  },
  {
    id: 3,
    content: "無論電子或紙本票券，如遺失、損毀或遭竄改，將無法補發或退款。",
  },
];

function canRefund(sessionDateStr?: string) {
  if (!sessionDateStr) return false;
  const sessionDate = new Date(sessionDateStr);
  const today = new Date();
  // 計算兩個日期的差距（毫秒）
  const diffTime = sessionDate.getTime() - today.getTime();
  // 7天的毫秒數
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  // sessionDate 距今大於 7 天才可退票
  return diffTime >= sevenDays;
}

export default function EticketCard({
  ticketData,
  ticketId,
  setPageStep,
}: {
  ticketData: ticketHistoryItem;
  ticketId: string;
  setPageStep: React.Dispatch<React.SetStateAction<"allTicket" | "eTicket">>;
}) {
  const { toast } = useToast();
  const [orderTicket, setOrderTicket] = useState<orderTicket | null>(null);
  // 查看訂單
  const { useGet } = useRequest<orderTicket>({
    queryKey: ["orderTicket"],
    url: "/api/v1/users/ticket",
  });
  const { data, error, isLoading } = useGet(ticketId, !!ticketId && ticketId !== "undefined");
  useEffect(() => {
    if (!data) return;
    // If data is the ticket itself
    if ("concertName" in data && "concertAddress" in data) {
      setOrderTicket(data);
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
  // //處理退票
  const { useCreate: requestRefund } = useRequest({
    queryKey: ["refund"],
    url: `/api/v1/orders/${ticketData?.orderId}/refund`,
  });
  const requestRefundMutation = requestRefund({
    onSuccess: (response) => {
      const res = response;
      if (res) {
        toast({
          title: "成功",
          description: "退票成功",
        });
        setPageStep("allTicket");
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "退票失敗，請稍後再試",
      });
    },
  });
  const isRefundLoading = requestRefundMutation.isPending;
  const handleConfirmRefund = () => {
    return new Promise<void>((resolve, reject) => {
      if (!ticketData?.orderId) {
        reject();
        return;
      }
      requestRefundMutation.mutate(
        { orderId: ticketData.orderId },
        {
          onSuccess: () => resolve(),
          onError: () => reject(),
        }
      );
    });
  };
  return (
    <>
      {isLoading ? (
        <LoadingSpin></LoadingSpin>
      ) : (
        <>
          <div className="border-primary mx-auto my-6 flex h-full min-h-[250px] w-full border-1 lg:w-[90%] lg:rounded-xl">
            <div className="row-span-3 grid w-full lg:grid-cols-12">
              <TicketDialog
                trigger={
                  <div className="bg-primary hover:bg-primary/80 text-secondary flex cursor-pointer items-center justify-center px-4 py-4 text-lg lg:col-span-1 lg:rounded-l-xl lg:[writing-mode:vertical-lr]">
                    查看詳情
                  </div>
                }
                ticketData={ticketData}
                orderTicket={orderTicket ?? undefined}
                type="ticketDetail"
              ></TicketDialog>

              <div className="flex items-center justify-center border-r-2 bg-gray-100 lg:col-span-3">
                <QRCode value={orderTicket?.qrCode || ""} style={{ height: "auto", width: "80%" }} />
              </div>
              <div className="bg-gray-100 lg:col-span-8 lg:rounded-r-xl">
                <div className="grid justify-between lg:grid-cols-5">
                  <div className="flex flex-col px-2 py-4 lg:col-span-4 lg:px-8">
                    <p className="text-2xl font-bold">{orderTicket?.concertName || ""}</p>
                    <div className="mt-4 ml-2 flex flex-col">
                      <p className="text-lg font-bold">使用方式</p>
                      <ul>
                        {useTicketMethod.map((item) => (
                          <li key={item.id}>
                            {item.id + 1}. {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 ml-2 flex flex-col">
                      <p className="text-lg font-bold">注意事項</p>
                      <ul>
                        {caution.map((item) => (
                          <li key={item.id}>
                            {item.id + 1}. {item.content}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 p-4 lg:col-span-1">
                    <TicketDialog
                      trigger={
                        <Button variant="outline" className="w-full">
                          聯絡主辦單位
                        </Button>
                      }
                      organization={orderTicket?.organization}
                      type="contactOrganizer"
                    ></TicketDialog>
                    <TicketDialog
                      trigger={
                        <Button variant="outline" className="w-full">
                          聯繫客服
                        </Button>
                      }
                      type="contactCustomerService"
                    ></TicketDialog>
                    {canRefund(orderTicket?.sessionDate) && <RefundSection handleConfirmRefund={handleConfirmRefund} isPending={isRefundLoading} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
