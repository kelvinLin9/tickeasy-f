import { formatNumberToPrice } from "@/utils/formatToPrice";
import { formatLocalTime, formatLocalTimeToDate } from "@/utils/formatTime";
import Separator from "@/core/components/ui/separator";
import QRCode from "react-qr-code";
import { ticketHistoryItem, orderTicket } from "../types/ticketHistory";
import LoadingSpin from "@/core/components/global/loadingSpin";

interface TicketDetailProps {
  ticketData?: ticketHistoryItem; // 允許 undefined
  orderTicket?: orderTicket;
}

export const TicketDetail = ({ ticketData, orderTicket }: TicketDetailProps) => {
  return (
    <div className="grid grid-rows-2 gap-4 lg:grid-cols-2 lg:grid-rows-none">
      {!ticketData ? (
        <LoadingSpin />
      ) : (
        <>
          <div className="row-span-1 lg:col-span-1">
            <p className="text-2xl font-bold">{ticketData.concertName}</p>
            <p>
              地址: <span className="ml-4 font-bold">{ticketData.concertAddress}</span>
            </p>
            <p>
              日期: <span className="ml-4 font-bold">{formatLocalTime(ticketData.sessionDate)}</span>
            </p>
            <div className="mt-4 flex items-center">
              <QRCode value={ticketData.qrCode || ""} style={{ height: "auto", width: "60%" }} />
            </div>
          </div>
          <div className="row-span-1 lg:col-span-1">
            <p>
              訂單編號<span className="ml-4 font-bold">{ticketData.orderNumber}</span>
            </p>
            <p>
              購票日期<span className="ml-4 font-bold">{formatLocalTime(ticketData.orderCreatedAt)}</span>
            </p>
            <p>
              支付方式<span className="ml-4 font-bold">信用卡</span>
            </p>
            <p>
              票券數量<span className="ml-4 font-bold">1 張</span>
            </p>
            <p>
              票券總價<span className="ml-4 font-bold">NT$ {formatNumberToPrice("zh-TW", Number(ticketData.price), 0)}</span>
            </p>
            <Separator className="my-4" />
            <p>
              場次／票券
              <span className="ml-4 font-bold">
                {formatLocalTimeToDate(formatLocalTime(ticketData.sessionDate))} {ticketData.sessionStart} / {ticketData.ticketTypeName}
              </span>
            </p>
            <p>
              購票人姓名<span className="ml-4 font-bold">{orderTicket?.purchaserName}</span>
            </p>
            <p>
              電子信箱<span className="ml-4 font-bold">{orderTicket?.purchaserEmail}</span>
            </p>
            <p>
              行動電話<span className="ml-4 font-bold">{orderTicket?.purchaserPhone}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};
