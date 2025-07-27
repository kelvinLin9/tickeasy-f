import { Button } from "@/core/components/ui/button";
import { sessionData, sessionItem, ticketTypeItem } from "@/pages/concerts/types/ConcertData";
import Separator from "@/core/components/ui/separator";
import TicketTypeAccordion from "./TicketTypeAccordion";
import { useBuyTicketContext } from "../hook/useBuyTicketContext";
export default function ConcertSessionSection({ sessionData, sessionTicketData }: { sessionData: sessionData; sessionTicketData: ticketTypeItem[] }) {
  const { selectedSession, setSelectedSession, setSelectedTickets } = useBuyTicketContext();
  return (
    <>
      <div className="flex w-full flex-col">
        <div className="relative rounded-lg border border-gray-300 p-8">
          <div className="absolute top-0 left-0 translate-x-1/4 -translate-y-1/2 bg-white px-2 text-2xl font-bold">請選擇場次與票券</div>

          <div className="flex gap-4">
            {sessionData.map((session: sessionItem) => (
              <Button
                key={session.sessionId}
                variant="outline"
                className={`flex h-full w-[120px] flex-col ${selectedSession?.sessionId === session.sessionId ? "text-secondary bg-blue-500" : ""}`}
                onClick={() => {
                  setSelectedTickets([]);
                  setSelectedSession(session);
                }}
              >
                {session.sessionDate}
                <span>{session.sessionStart}</span>
              </Button>
            ))}
          </div>
          <Separator />
          {selectedSession ? (
            <TicketTypeAccordion ticketTypes={sessionTicketData} />
          ) : (
            <div className="text-center text-sm text-gray-500">請先選擇場次</div>
          )}
        </div>
      </div>
    </>
  );
}
