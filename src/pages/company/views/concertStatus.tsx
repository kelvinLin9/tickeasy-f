import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useConcertStore } from "@/pages/concerts/store/useConcertStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/core/components/ui/pagination";
import Footer from "@/core/components/global/footer";
import Header from "@/core/components/global/header";
import ConcertStatsHeader from "../components/ConcertStatusHeader";
import TicketSalesTable from "../components/TicketSalesTable";
import CheckInStatusTable from "../components/CheckInStatusTable";
import { BackToListButton } from "@/pages/concerts/components/BackToListButton";
import type { Session } from "../types/concertStatus";
import { useToast } from "@/core/hooks/useToast";
import LoadingSpin from "@/core/components/global/loadingSpin";
import dayjs from "dayjs";

export default function ConcertStats() {
  const { concertId } = useParams<{ concertId: string }>();
  const { toast } = useToast();

  const { concertStatsData, checkInData, getConcertSessions, getSessionCheckIns } = useConcertStore();

  const [selectedSession, setSelectedSession] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!concertId) return;
      setIsLoading(true);
      try {
        await getConcertSessions(concertId);
      } catch {
        toast({ variant: "destructive", title: "錯誤", description: "無法取得演唱會資訊" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [concertId, getConcertSessions, toast]);

  useEffect(() => {
    if (concertStatsData && concertStatsData.concert.sessions.length > 0 && !selectedSession) {
      setSelectedSession(concertStatsData.concert.sessions[0].sessionId);
    }
  }, [concertStatsData, selectedSession]);

  useEffect(() => {
    const fetchCheckIns = async () => {
      if (!selectedSession) return;
      setIsTableLoading(true);
      try {
        await getSessionCheckIns(selectedSession, currentPage);
      } catch {
        toast({ variant: "destructive", title: "錯誤", description: "無法取得報到資訊" });
      } finally {
        setIsTableLoading(false);
      }
    };
    fetchCheckIns();
  }, [selectedSession, currentPage, getSessionCheckIns, toast]);

  const handlePageChange = (page: number) => {
    if (page < 1 || (checkInData && page > checkInData.pagination.pages)) return;
    setCurrentPage(page);
  };

  const currentTicketTypes = concertStatsData?.concert.sessions.find((s) => s.sessionId === selectedSession)?.ticketTypes || [];

  const mappedCheckInRecords =
    checkInData?.checkInRecords.map((r) => ({
      orderId: r.orderId,
      purchaserName: r.purchaserName,
      ticketTypeName: r.ticketTypeName,
      purchaseTime: dayjs(r.purchaseTime).format("YYYY-MM-DD"),
      status: r.status,
    })) || [];

  const totalPages = checkInData?.pagination.pages || 0;

  if (isLoading) {
    return <LoadingSpin />;
  }

  if (!concertStatsData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>找不到演唱會資訊</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-12">
            <BackToListButton />
          </div>
          <ConcertStatsHeader concertName={concertStatsData.concert.conTitle} organizerName={concertStatsData.organization.orgName} />

          <div className="mb-8 flex items-center gap-4">
            <h2 className="text-lg font-semibold whitespace-nowrap">場次名稱</h2>
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="選擇場次" />
              </SelectTrigger>
              <SelectContent>
                {concertStatsData.concert.sessions.map((session: Session) => (
                  <SelectItem key={session.sessionId} value={session.sessionId}>
                    {session.sessionTitle || dayjs(session.sessionDate).format("YYYY/MM/DD")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TicketSalesTable ticketTypes={currentTicketTypes} />

          <CheckInStatusTable orders={mappedCheckInRecords} isLoading={isTableLoading} concertId={concertId} />

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
