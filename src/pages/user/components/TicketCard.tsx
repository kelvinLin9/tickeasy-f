import Separator from "@/core/components/ui/separator";
import { formatNumberToPrice } from "@/utils/formatToPrice";
import { formatLocalTimeToDate } from "@/utils/formatTime";
import { CircleCheck, MapPin, CalendarDays, Ticket, CircleDollarSign } from "lucide-react";
import QRCode from "react-qr-code";
import { ticketHistoryItem } from "../types/ticketHistory";
import LoadingSpin from "@/core/components/global/loadingSpin";
interface TicketCardProps {
  ticketData: ticketHistoryItem;
  setPageStep?: (step: "allTicket" | "eTicket") => void;
}
export default function TicketCard({ ticketData, setPageStep }: TicketCardProps) {
  return (
    <div className="border-primary mx-auto my-6 flex h-full min-h-[250px] w-full border-1 lg:w-[90%] lg:rounded-xl">
      {ticketData ? (
        <>
          {ticketData.orderStatus === "paid" ? (
            <div className="row-span-3 grid w-full lg:h-full lg:grid-cols-12">
              <div
                className="bg-primary hover:bg-primary/80 text-secondary row-span-2 flex cursor-pointer items-center justify-center px-4 text-lg lg:rounded-l-xl lg:[writing-mode:vertical-lr]"
                onClick={() => setPageStep && setPageStep("eTicket")}
              >
                查看票券
              </div>

              <div className="row-span-2 flex items-center justify-center border-r-2 bg-gray-100 lg:col-span-3">
                <QRCode value={ticketData.qrCode || ""} style={{ height: "auto", width: "80%" }} />
              </div>
              <div className="row-span-2 bg-gray-100 lg:col-span-8 lg:rounded-r-xl">
                <div className="flex flex-col gap-2 px-4 py-4 lg:px-8">
                  <div className="flex flex-col justify-between lg:flex-row">
                    <p className="text-2xl font-bold">{ticketData.concertName}</p>
                    <p>
                      訂單編號 <span className="font-bold">{ticketData.orderNumber}</span>
                    </p>
                  </div>
                  <p className="text-md text-gray-500">{ticketData.concertDescription}</p>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 px-2 py-4 lg:px-8">
                  <p className="flex items-center">
                    <CalendarDays className="mr-2 hidden h-5 w-5 lg:block" />
                    開始時間{" "}
                    <span className="ml-2 text-lg">
                      {formatLocalTimeToDate(ticketData.sessionDate)} {ticketData.sessionStart}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <MapPin className="mr-2 hidden h-5 w-5 lg:block" />
                    活動地點 <span className="ml-2 text-lg">{ticketData.concertAddress}</span>
                  </p>
                  <p className="flex items-center">
                    <CircleCheck className="mr-2 hidden h-5 w-5 lg:block" />
                    訂購狀態 <span className="ml-2 text-lg">{ticketData.orderStatus === "paid" ? "(已付款)" : "(尚未付款)"}</span>
                  </p>
                  <p className="flex items-center">
                    <Ticket className="mr-2 hidden h-5 w-5 lg:block" />
                    票券數量 <span className="ml-2 text-lg">1 ({ticketData.ticketTypeName})</span>
                  </p>
                  <p className="flex items-center">
                    <CircleDollarSign className="mr-2 hidden h-5 w-5 lg:block" />
                    總價 <span className="ml-2 text-lg">NT$ {formatNumberToPrice("zh-TW", Number(ticketData.price), 0)}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="row-span-3 grid w-full lg:h-full lg:grid-cols-12">
              <div className="row-span-1 flex items-center justify-center border-r-2 bg-gray-100 lg:col-span-3 lg:h-full lg:rounded-l-xl">
                <QRCode value={ticketData.orderNumber || ""} style={{ height: "auto", width: "80%" }} />
              </div>
              <div className="bg-gray-100 lg:col-span-9 lg:h-full lg:rounded-r-xl">
                <div className="flex flex-col gap-2 px-4 py-4 lg:px-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between">
                    <p className="text-2xl font-bold">{ticketData.concertName}</p>
                    <p>
                      訂單編號 <span className="font-bold">{ticketData.orderNumber}</span>
                    </p>
                  </div>
                  {/* <p className="text-md text-gray-500">{ticketData.concertIntroduction}</p> */}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 px-2 py-4 lg:flex-row lg:items-end lg:justify-between lg:px-8">
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center">
                      <CalendarDays className="mr-2 hidden h-5 w-5 lg:block" />
                      開始時間{" "}
                      <span className="ml-2 text-lg">
                        {formatLocalTimeToDate(ticketData.sessionDate)} {ticketData.sessionStart}
                      </span>
                    </p>
                    <p className="flex items-center">
                      <MapPin className="mr-2 hidden h-5 w-5 lg:block" />
                      活動地點 <span className="ml-2 text-lg">{ticketData.concertAddress}</span>
                    </p>
                    <p className="flex items-center">
                      <CircleCheck className="mr-2 hidden h-5 w-5 lg:block" />
                      訂購狀態 <span className="ml-2 text-lg">{ticketData.orderStatus === "paid" ? "(已付款)" : "(尚未付款)"}</span>
                    </p>
                    <p className="flex items-center">
                      <Ticket className="mr-2 hidden h-5 w-5 lg:block" />
                      票券數量 <span className="ml-2 text-lg">1 ({ticketData.ticketTypeName})</span>
                    </p>
                    <p className="flex items-center">
                      <CircleDollarSign className="mr-2 hidden h-5 w-5 lg:block" />
                      總價 <span className="ml-2 text-lg">NT$ {formatNumberToPrice("zh-TW", Number(ticketData.price), 0)}</span>
                    </p>
                  </div>
                  <div className="hidden lg:block">
                    <div className="outline-destructive border-destructive bg-destructive/20 flex h-[120px] w-[120px] -rotate-30 items-center justify-center rounded-full border-2 p-2 px-4 py-2 text-center text-xl outline-2 outline-offset-4">
                      {ticketData.orderStatus === "expired" ? "已結束" : "已退票"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <LoadingSpin />
      )}
    </div>
  );
}
