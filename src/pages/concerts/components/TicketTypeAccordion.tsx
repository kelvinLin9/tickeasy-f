import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/core/components/ui/accordion";
import { ticketTypeItem } from "../types/ConcertData";
import { formatNumberToPrice } from "@/utils/formatToPrice";
import { TicketStepper } from "./TicketStepper";
import { formatLocalTime } from "@/utils/formatTime";
export default function TicketTypeAccordion({ ticketTypes }: { ticketTypes: ticketTypeItem[] }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {ticketTypes.map((ticketType) => (
        <AccordionItem key={ticketType.ticketTypeId} value={ticketType.ticketTypeId}>
          <div className="flex w-full items-center justify-between px-4 py-2">
            <div className="flex flex-col gap-2 text-start">
              <p className="text-2xl font-bold">{ticketType.ticketTypeName}</p>
              <p className="text-lg font-semibold">NT $ {formatNumberToPrice("zh-TW", Number(ticketType.ticketTypePrice), 0)}</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-xl whitespace-nowrap">(餘{ticketType.remainingQuantity}張)</p>
              <TicketStepper
                initial={0}
                min={0}
                max={1}
                ticketTypeId={ticketType.ticketTypeId}
                ticketPrice={Number(ticketType.ticketTypePrice)}
                ticketTypeName={ticketType.ticketTypeName}
              />
            </div>
          </div>
          <AccordionTrigger>
            <p className="text-lg">詳細資訊</p>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex w-full items-center justify-between px-4 py-2">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">售票時間</p>
                  <p>
                    {formatLocalTime(ticketType.sellBeginDate)} - {formatLocalTime(ticketType.sellEndDate)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">票券說明</p>
                  <ul className="list-disc pl-6">
                    <li className="font-semibold">入場方式: {ticketType.entranceType}</li>
                    <li className="font-semibold">票券權益: {ticketType.ticketBenefits}</li>
                    <li className="font-semibold">退換票政策: {ticketType.ticketRefundPolicy}</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
