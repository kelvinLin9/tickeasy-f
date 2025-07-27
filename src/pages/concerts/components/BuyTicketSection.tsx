import { useEffect, useState } from "react";
import BeforeBuyTicket from "./BeforeBuyTicket";
import ConcertSessionSection from "./ConcertSessionSection";
import PrecautionAndNeedtoKnow from "./PrecautionAndNeedtoKnow";
import InsertBuyerInfoSection from "./InsertBuyerInfoSection";
import ConfirmOrderSection from "./ConfirmOrderSection";
import { Button } from "@/core/components/ui/button";
import Separator from "@/core/components/ui/separator";
import { formatNumberToPrice } from "@/utils/formatToPrice";
import { useBuyTicketContext } from "../hook/useBuyTicketContext";
import { useToast } from "@/core/hooks/useToast";
import { useRequest } from "@/core/hooks/useRequest";
// import { ticketTypeItem } from "../types/ConcertData";
import { Concert } from "@/pages/comm/types/Concert";
import { CreateOrderData, PaymentResultResponse } from "../types/BuyTicket";
// import LoadingSpin from "@/core/components/global/loadingSpin";
import { AxiosResponse } from "axios";

export default function BuyTicketSection({ concertData }: { concertData: Concert }) {
  const { selectedSession, selectedTickets, buyerInfo, validateBuyerInfo, newOrderInfo, setNewOrderInfo } = useBuyTicketContext();
  // chooseSession+TicketType 選擇場次及票種 --> insertBuyerInfo 填寫購票人資訊
  const [buyTicketStep, setBuyTicketStep] = useState("chooseSession");
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setTotalPrice(selectedTickets.reduce((acc, ticket) => acc + ticket.ticketPrice * ticket.quantity, 0));
  }, [selectedSession, selectedTickets, buyerInfo]);

  //創建訂單
  const { useCreate: requestCreateOrder } = useRequest({
    queryKey: [],
    url: "/api/v1/orders ",
  });

  const { mutate: requestCreateOrderMutation, isPending: isCreateOrderLoading } = requestCreateOrder({
    onSuccess: (response) => {
      const res = response as unknown as CreateOrderData;
      toast({
        title: "訂單創建成功",
      });
      setNewOrderInfo({
        lockExpireTime: res.lockExpireTime,
        orderId: res.orderId,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error.message || "訂單創建失敗，請稍後再試",
      });
    },
  });

  //處理付款
  type MaybeHtmlResponse<T> = T | AxiosResponse<string>;
  const { useGet: requestPayment } = useRequest<MaybeHtmlResponse<PaymentResultResponse>>({
    queryKey: ["payment", newOrderInfo.orderId], // 絕對不要是空陣列！
    url: `/api/v1/payments`,
  });

  const paymentResponse = requestPayment(newOrderInfo.orderId, !!newOrderInfo.orderId && newOrderInfo.orderId !== "undefined") as unknown as {
    data: string;
    error: Error | null;
  };

  useEffect(() => {
    if (
      paymentResponse &&
      paymentResponse.data &&
      typeof paymentResponse.data === "object" &&
      "data" in paymentResponse.data &&
      newOrderInfo.orderId
    ) {
      const htmlString = (paymentResponse.data as { data: string }).data;
      document.open();
      document.write(htmlString);
      document.close();
    }
  }, [paymentResponse, newOrderInfo.orderId]);
  // 處理錯誤
  useEffect(() => {
    if (paymentResponse.error) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: paymentResponse.error.message || "發生錯誤，請稍後再試",
      });
    }
  }, [paymentResponse.error, toast]);

  const handleBuyTicketStep = (currentStep: string) => {
    // 驗證當前步驟的所有欄位
    let isValid = true;

    if (currentStep === "chooseSession") {
      // 驗證是否選擇場次和票券
      isValid = selectedSession !== null && selectedTickets.length > 0;
    } else if (currentStep === "insertBuyerInfo") {
      // 驗證購票人資訊
      const buyerValidation = validateBuyerInfo();
      isValid = buyerValidation.success;
    }
    const failedValidation = {
      chooseSession: "請選擇場次及票券",
      insertBuyerInfo: "請填寫完整購票人資訊",
      confirmOrder: "請確認訂單資訊",
    };
    if (!isValid) {
      // 可以加入錯誤提示
      alert(failedValidation[currentStep as keyof typeof failedValidation]);
      return;
    }
    if (currentStep === "chooseSession") {
      setBuyTicketStep("insertBuyerInfo");
    } else if (currentStep === "insertBuyerInfo") {
      setBuyTicketStep("confirmOrder");
    } else if (currentStep === "confirmOrder") {
      // 確認訂單
      const data = {
        ticketTypeId: selectedTickets[0].ticketTypeId,
        purchaserName: buyerInfo.name,
        purchaserEmail: buyerInfo.email,
        purchaserPhone: buyerInfo.mobilePhone,
      };
      requestCreateOrderMutation(data);
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-2 px-4 lg:gap-8 lg:px-12">
      <div className="mx-auto grid h-[70%] w-full grid-cols-1 lg:w-[90%] lg:grid-cols-2">
        {/* 演唱會資訊 */}
        <div className="col-span-1 h-[70%] space-y-2 lg:px-3">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">{concertData.conTitle}</div>
            <div>
              {concertData.eventStartDate} - {concertData.eventEndDate}
            </div>
          </div>
          <div className="relative h-[350px] w-full">
            <img src={concertData.imgBanner} alt={concertData.conTitle} className="h-full w-full object-cover" />
          </div>
          <div className="my-4">{buyTicketStep === "chooseSession" ? <BeforeBuyTicket /> : <PrecautionAndNeedtoKnow />}</div>
        </div>
        <div className="col-span-1 h-[30%] space-y-2 lg:px-3">
          <div className="flex justify-center gap-2">
            {/* 場次選擇 */}
            {buyTicketStep === "chooseSession" && (
              <ConcertSessionSection sessionData={concertData?.sessions || []} sessionTicketData={selectedSession?.ticketTypes || []} />
            )}
            {/* 購票人資訊 */}
            {buyTicketStep === "insertBuyerInfo" && <InsertBuyerInfoSection />}
            {buyTicketStep === "confirmOrder" && <ConfirmOrderSection concertData={concertData} totalPrice={totalPrice} />}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex w-[90%] justify-end">
        <div className="text-lg">
          Total
          <span className="ml-4 text-lg font-semibold">NT$ {formatNumberToPrice("zh-TW", totalPrice, 0)}</span>
        </div>
      </div>
      <div className="flex w-[90%] justify-center">
        <Button
          variant="outline"
          className="w-[80%] lg:w-[30%]"
          onClick={() => handleBuyTicketStep(buyTicketStep)}
          disabled={buyTicketStep === "confirmOrder" && isCreateOrderLoading}
        >
          {buyTicketStep === "confirmOrder" ? (isCreateOrderLoading ? "付款中..." : "立即付款") : "下一步"}
        </Button>
      </div>
    </div>
  );
}
