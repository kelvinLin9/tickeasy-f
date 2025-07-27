import { Button } from "@/core/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { CircleCheck, MapPin, CalendarDays } from "lucide-react";
import Separator from "@/core/components/ui/separator";
import { GoogleMap } from "@/core/components/global/googleMap";
import { useEffect, useState } from "react";
import LoadingSpin from "@/core/components/global/loadingSpin";
import { useToast } from "@/core/hooks/useToast";
import { useRequest } from "@/core/hooks/useRequest";
import { orderDataResponse, orderItem } from "../types/BuyTicket";
import { RawConertDataResponse } from "../types/RawConertData";
import { formatLocalTime } from "@/utils/formatTime";
export default function PaymentResultSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const oid = searchParams.get("oId");

  // 取得訂單資料
  const { useGet: useGetOrderData } = useRequest<orderDataResponse>({
    queryKey: ["order", oid ?? ""],
    url: `/api/v1/orders`,
  });

  const {
    data: rawOrderData,
    error: getOrderDataError,
    isLoading: isLoadingOrderData,
  } = useGetOrderData(oid ?? undefined, !!oid && oid !== "undefined");
  const [orderData, setOrderData] = useState<{ order: orderItem; concert: RawConertDataResponse }>({
    order: {} as orderItem,
    concert: {} as RawConertDataResponse,
  });
  useEffect(() => {
    if (rawOrderData) {
      const maybeData = rawOrderData;

      if ("order" in maybeData && "concert" in maybeData) {
        setOrderData(maybeData as { order: orderItem; concert: RawConertDataResponse });
      } else if ("data" in maybeData && "order" in maybeData.data && "concert" in maybeData.data) {
        setOrderData(maybeData.data as { order: orderItem; concert: RawConertDataResponse });
      }
    }
  }, [rawOrderData]);

  useEffect(() => {
    if (getOrderDataError) {
      toast({
        variant: "destructive",
        title: "錯誤",
        description: getOrderDataError.message || "發生錯誤，請稍後再試",
      });
    }
  }, [getOrderDataError, toast]);
  return (
    <div className="flex h-full flex-col items-center gap-2 px-4 lg:gap-8 lg:px-12">
      <div className="mx-auto w-full lg:w-[70%]">
        <div className="my-10 flex items-center justify-center">
          <CircleCheck className="mr-2 h-8 w-8 text-green-500" />
          <h2 className="text-center font-semibold">交易成功</h2>
        </div>
        {isLoadingOrderData ? (
          <LoadingSpin />
        ) : (
          <>
            <div className="my-4 flex flex-col gap-2">
              <p>
                訂單編號：<span className="ml-2">{orderData.order.orderNumber}</span>
              </p>
              {orderData.order.createdAt && <p>購票時間： {formatLocalTime(orderData.order.createdAt)}</p>}
              <p>
                購票人：<span className="ml-2">{orderData.order.purchaserName}</span>
              </p>
              <p>
                購票人Email：<span className="ml-2">{orderData.order.purchaserEmail}</span>
              </p>
              <p>
                購票人電話：<span className="ml-2">{orderData.order.purchaserPhone}</span>
              </p>
              <p>
                支付方式：<span className="ml-2">信用卡</span> {orderData.order.orderStatus === "paid" ? "(已付款)" : ""}
              </p>
              <p className="text-lg font-semibold text-red-500">退票需於開演前 7 日（含）以前申請，逾期恕不受理。</p>
              <Separator />
              <div className="flex flex-col items-center">
                <div className="w-[70%]">
                  <img src={orderData.concert.imgBanner} alt={orderData.concert.conTitle} className="h-full w-full object-cover" />
                </div>
                <p className="my-4 text-center text-xl font-semibold">{orderData.concert.conTitle}</p>
                <p className="my-4 text-center text-lg">{orderData.concert.conIntroduction}</p>
              </div>
              <div className="flex items-center justify-baseline">
                <MapPin className="mr-2 h-4 w-4" />
                {orderData.concert.conLocation} ({orderData.concert.conAddress})
              </div>
              <div className="flex items-center justify-baseline">
                <CalendarDays className="mr-2 h-4 w-4" />
                {orderData.concert.eventStartDate}
              </div>
            </div>
            <div className="mx-auto my-6 h-[400px] w-full lg:w-[70%]">
              <GoogleMap address={orderData.concert.conAddress} />
            </div>
            <div className="mx-auto flex w-full justify-between gap-4 lg:w-[70%]">
              <Button variant="outline" className="lg:w-1/3 lg:text-lg" onClick={() => navigate("/concerts")}>
                查看其他活動
              </Button>
              <Button variant="outline" className="lgw-1/3 lg:text-lg" onClick={() => navigate("/user/about/history")}>
                查看購買紀錄
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
