import { formatNumberToPrice } from "@/utils/formatToPrice";
import { Concert } from "@/pages/comm/types/Concert";
import { useBuyTicketContext } from "../hook/useBuyTicketContext";
export default function ConfirmOrderSection({ concertData, totalPrice }: { concertData: Concert; totalPrice: number }) {
  const { selectedTickets } = useBuyTicketContext();
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative flex h-[400px] flex-col justify-between rounded-lg border border-gray-300 p-8">
          <div className="absolute top-0 left-0 translate-x-1/4 -translate-y-1/2 bg-white px-2 text-2xl font-bold">請確認訂單內容</div>

          <div className="flex flex-col gap-3 text-start">
            <p>
              演唱會名稱: <span className="ml-4">{concertData.conTitle}</span>
            </p>
            <p>
              票券類型: <span className="ml-4">{selectedTickets[0].ticketTypeName}</span>
            </p>
            <p>
              總金額: <span className="ml-4">NT$ {formatNumberToPrice("zh-TW", totalPrice, 0)}</span>
            </p>
            <p>
              開始時間: <span className="ml-4">{concertData.eventStartDate}</span>
            </p>
            <p>
              結束時間: <span className="ml-4">{concertData.eventEndDate}</span>
            </p>
          </div>
          <div className="text-destructive flex gap-4">點擊「立即付款」後，將由綠界金流透過信用卡付款</div>
        </div>
      </div>
    </>
  );
}
