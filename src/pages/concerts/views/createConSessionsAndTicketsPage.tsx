import { useState, useEffect, useRef } from "react";
import Footer from "@/core/components/global/footer";
import ScrollTopBtn from "@/core/components/global/ScrollTopBtn";
import Header from "@/core/components/global/header";
import LoadingSpin from "@/core/components/global/loadingSpin";
import { Button } from "@/core/components/ui/button";
import { Pencil, Trash2, Save, Calendar } from "lucide-react";
import { useConcertStore } from "../store/useConcertStore";
import { useNavigate, useSearchParams, useLocation, useParams } from "react-router-dom";
import { useSeattableUpload } from "../hook/useSeattableUpload";
import { Session, TicketType } from "@/pages/comm/types/Concert";
import dayjs from "dayjs";
import { TicketTypeTable, TicketTypeTableRef } from "../components/TicketTypeTable";
import { BackToListButton } from "../components/BackToListButton";
import { useToast } from "@/core/hooks/useToast";
import { SingleDatePicker } from "@/core/components/ui/singleDatePicker";
import { TimeOnlyPicker } from "@/core/components/ui/timeOnlyPicker";

export default function CreateConSessionsAndTicketsPage() {
  const { sessions, info, setInfo, updateSession, addSession, deleteSession, addTicket, deleteTicket, saveDraft } = useConcertStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { concertId: urlConcertId } = useParams();
  const isEditMode = location.pathname.includes("/edit/");
  const concertId = isEditMode ? urlConcertId : searchParams.get("concertId");
  const companyId = searchParams.get("companyId");

  // UI 狀態
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState<{ sessionTitle: string; sessionDate: string; sessionStart: string; sessionEnd: string }>({
    sessionTitle: "",
    sessionDate: "",
    sessionStart: "",
    sessionEnd: "",
  });
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { handleUploadSeattable } = useSeattableUpload();
  const { toast } = useToast();

  // 用於儲存所有 TicketTypeTable 的 ref
  const ticketTableRefs = useRef<{ [sessionId: string]: TicketTypeTableRef | null }>({});

  useEffect(() => {
    if (!concertId) {
      toast({
        title: "錯誤",
        description: "請先儲存草稿再設定場次",
        variant: "destructive",
      });
      const backPath = isEditMode ? `/concert/edit/${urlConcertId}/info` : `/concert/create/info?companyId=${companyId}`;
      navigate(backPath);
      return;
    }

    if (concertId !== info.concertId) {
      setInfo({ concertId });
    }
  }, [concertId, companyId, info.concertId, navigate, setInfo, toast, isEditMode, urlConcertId]);

  useEffect(() => {
    if (concertId) {
      useConcertStore.getState().getConcert(concertId);
    }
  }, [concertId]);

  // UI 處理函數
  const handleEdit = (s: Session) => {
    setEditingSessionId(s.sessionId);
    setEditBuffer({
      sessionTitle: s.sessionTitle,
      sessionDate: s.sessionDate,
      sessionStart: s.sessionStart,
      sessionEnd: s.sessionEnd,
    });
  };

  const handleSave = (id: string) => {
    // 驗證新增的場次資料完整性
    const session = sessions.find((s) => s.sessionId === id);
    if (session && id.startsWith("tmp-")) {
      const validationErrors: string[] = [];
      const sessionIndex = sessions.findIndex((s) => s.sessionId === id) + 1;

      if (!editBuffer.sessionTitle?.trim()) {
        validationErrors.push(`場次${sessionIndex}名稱`);
      }
      if (!editBuffer.sessionDate?.trim()) {
        validationErrors.push(`場次${sessionIndex}日期`);
      }
      if (!editBuffer.sessionStart?.trim()) {
        validationErrors.push(`場次${sessionIndex}開始時間`);
      }
      if (!editBuffer.sessionEnd?.trim()) {
        validationErrors.push(`場次${sessionIndex}結束時間`);
      }

      // 如果有驗證錯誤，顯示 toast 並停止儲存
      if (validationErrors.length > 0) {
        toast({
          title: "場次資料未完整",
          description: `請填寫以下欄位：${validationErrors.join("、")}`,
          variant: "destructive",
        });
        return;
      }
    }

    // 確保時間格式為 HH:mm
    const formatTime = (time: string) => {
      if (!time) return "";
      // 如果已經是 HH:mm 格式就直接返回
      if (/^\d{2}:\d{2}$/.test(time)) return time;
      // 否則嘗試轉換
      try {
        const [hours, minutes] = time.split(":");
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
      } catch {
        return "";
      }
    };

    updateSession({
      sessionId: id,
      sessionDate: editBuffer.sessionDate,
      sessionStart: formatTime(editBuffer.sessionStart),
      sessionEnd: formatTime(editBuffer.sessionEnd),
      sessionTitle: editBuffer.sessionTitle,
    });
    setEditingSessionId(null);
  };

  const handleAddSessionWrapper = () => {
    const newSession: Session = {
      sessionId: `tmp-${Date.now()}`,
      concertId: info.concertId,
      sessionTitle: "",
      sessionDate: "",
      sessionStart: "",
      sessionEnd: "",
      imgSeattable: "",
      createdAt: new Date().toISOString(),
      ticketTypes: [],
    };
    addSession(newSession);
    setEditingSessionId(newSession.sessionId);
  };

  const handleAddTicketTypeWrapper = (sessionId: string) => {
    const newTicketId = `tmp-${Date.now()}`;
    const newTicket: TicketType = {
      ticketTypeId: newTicketId,
      concertSessionId: sessionId,
      ticketTypeName: "",
      sellBeginDate: "",
      sellEndDate: "",
      ticketTypePrice: 0,
      totalQuantity: 0,
      entranceType: "",
      ticketBenefits: "",
      ticketRefundPolicy: "",
      remainingQuantity: 0,
      createdAt: new Date().toISOString(),
    };
    addTicket(sessionId, newTicket);
    setExpandedTicketId(newTicketId);
  };

  const handleSaveDraftWrapper = async () => {
    if (isLoading) return;

    // 驗證新增的場次資料完整性
    const sessionErrors: string[] = [];
    sessions.forEach((session, index) => {
      // 檢查是否為新增的場次（使用臨時 ID 判斷）
      const isNewSession = session.sessionId.startsWith("tmp-");

      if (isNewSession) {
        if (!session.sessionTitle?.trim()) {
          sessionErrors.push(`場次${index + 1}名稱`);
        }
        if (!session.sessionDate?.trim()) {
          sessionErrors.push(`場次${index + 1}日期`);
        }
        if (!session.sessionStart?.trim()) {
          sessionErrors.push(`場次${index + 1}開始時間`);
        }
        if (!session.sessionEnd?.trim()) {
          sessionErrors.push(`場次${index + 1}結束時間`);
        }
      }
    });

    // 驗證新增的票種資料完整性
    const ticketErrors: string[] = [];
    sessions.forEach((session, sessionIndex) => {
      session.ticketTypes.forEach((ticket, ticketIndex) => {
        // 檢查是否為新增的票種（使用臨時 ID 判斷）
        const isNewTicket = ticket.ticketTypeId.startsWith("tmp-");

        if (isNewTicket) {
          if (!ticket.ticketTypeName?.trim()) {
            ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}名稱`);
          }
          if (!ticket.sellBeginDate?.trim()) {
            ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}販售開始時間`);
          }
          if (!ticket.sellEndDate?.trim()) {
            ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}販售結束時間`);
          }
          if (!ticket.ticketTypePrice || ticket.ticketTypePrice <= 0) {
            ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}價格`);
          }
          if (!ticket.totalQuantity || ticket.totalQuantity <= 0) {
            ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}數量`);
          }
        }
      });
    });

    // 如果有錯誤，顯示 toast 並停止儲存
    if (sessionErrors.length > 0 || ticketErrors.length > 0) {
      const allErrors = [...sessionErrors, ...ticketErrors];
      toast({
        title: "資料未完整",
        description: `請填寫以下欄位：${allErrors.join("、")}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 強制儲存所有正在編輯的 session 資料
      if (editingSessionId) {
        const formatTime = (time: string) => {
          if (!time) return "";
          if (/^\d{2}:\d{2}$/.test(time)) return time;
          try {
            const [hours, minutes] = time.split(":");
            return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
          } catch {
            return "";
          }
        };

        updateSession({
          sessionId: editingSessionId,
          sessionDate: editBuffer.sessionDate || "",
          sessionStart: formatTime(editBuffer.sessionStart),
          sessionEnd: formatTime(editBuffer.sessionEnd),
          sessionTitle: editBuffer.sessionTitle || "",
        });
        setEditingSessionId(null);
      }

      // 強制儲存所有正在編輯的 ticket 資料
      try {
        Object.values(ticketTableRefs.current).forEach((ref) => {
          if (ref) {
            ref.saveAllEditingTickets();
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "票種資料未完整",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      const result = await saveDraft();
      if (result?.concertId) {
        const queryParams = new URLSearchParams(window.location.search);
        const companyId = queryParams.get("companyId");
        const newQueryParams = new URLSearchParams();

        if (companyId) {
          newQueryParams.set("companyId", companyId);
        }
        newQueryParams.set("concertId", result.concertId);

        window.history.replaceState({}, "", `?${newQueryParams.toString()}`);
      }
      toast({
        title: "成功",
        description: isEditMode ? "變更儲存成功" : "草稿儲存成功",
        variant: "default",
      });
    } catch {
      // console.error("儲存草稿失敗:", error);
      toast({
        title: "錯誤",
        description: "儲存失敗，請重試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const backPath = isEditMode
      ? `/concert/edit/${concertId}/info?${new URLSearchParams({ companyId: companyId || "", tab: "concertList" }).toString()}`
      : `/concert/create/info?${new URLSearchParams({ concertId: info.concertId || "", companyId: companyId || "", tab: "concertList" }).toString()}`;
    navigate(backPath);
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // 檢查是否有正在編輯的場次
    if (editingSessionId) {
      toast({
        title: "請先儲存場次資料",
        description: "請先完成場次編輯並儲存，再進行送審",
        variant: "destructive",
      });
      return;
    }

    // 檢查 sessions 中是否有正在編輯的票種（使用臨時 ID 判斷）
    const hasEditingTicketsInSessions = sessions.some((session) => session.ticketTypes.some((ticket) => ticket.ticketTypeId.startsWith("tmp-")));

    if (hasEditingTicketsInSessions) {
      toast({
        title: "請先儲存票種資料",
        description: "請先完成票種編輯並儲存，再進行送審",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // 驗證基本資料
    const basicInfoErrors: string[] = [];

    if (!info.conTitle?.trim()) {
      basicInfoErrors.push("演唱會名稱");
    }
    if (!info.conIntroduction?.trim()) {
      basicInfoErrors.push("演唱會簡介");
    }
    if (!info.conLocation?.trim()) {
      basicInfoErrors.push("演唱會地點");
    }
    if (!info.conAddress?.trim()) {
      basicInfoErrors.push("演唱會地址");
    }
    if (!info.eventStartDate?.trim()) {
      basicInfoErrors.push("活動開始日期");
    }
    if (!info.eventEndDate?.trim()) {
      basicInfoErrors.push("活動結束日期");
    }
    if (!info.venueId?.trim()) {
      basicInfoErrors.push("場館");
    }
    if (!info.locationTagId?.trim()) {
      basicInfoErrors.push("地點標籤");
    }
    if (!info.musicTagId?.trim()) {
      basicInfoErrors.push("音樂標籤");
    }
    if (!info.ticketPurchaseMethod?.trim()) {
      basicInfoErrors.push("購票方式");
    }
    if (!info.precautions?.trim()) {
      basicInfoErrors.push("注意事項");
    }
    if (!info.refundPolicy?.trim()) {
      basicInfoErrors.push("退票政策");
    }
    if (!info.imgBanner?.trim()) {
      basicInfoErrors.push("演唱會橫幅圖片");
    }

    if (basicInfoErrors.length > 0) {
      // console.log("basicInfoErrors:", basicInfoErrors);
      toast({
        title: "基本資料未完整",
        description: `請填寫以下欄位：${basicInfoErrors.join("、")}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // 驗證場次資料 - 只驗證新增的場次
    if (sessions.length === 0) {
      toast({
        title: "場次資料未完整",
        description: "請至少新增一個場次",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const sessionErrors: string[] = [];
    sessions.forEach((session, index) => {
      // 檢查是否為新增的場次（使用臨時 ID 判斷）
      const isNewSession = session.sessionId.startsWith("tmp-");

      if (isNewSession) {
        if (!session.sessionTitle?.trim()) {
          sessionErrors.push(`場次${index + 1}名稱`);
        }
        if (!session.sessionDate?.trim()) {
          sessionErrors.push(`場次${index + 1}日期`);
        }
        if (!session.sessionStart?.trim()) {
          sessionErrors.push(`場次${index + 1}開始時間`);
        }
        if (!session.sessionEnd?.trim()) {
          sessionErrors.push(`場次${index + 1}結束時間`);
        }
        if (!session.imgSeattable?.trim()) {
          sessionErrors.push(`場次${index + 1}座位圖`);
        }
      }
    });

    if (sessionErrors.length > 0) {
      toast({
        title: "場次資料未完整",
        description: `請填寫以下欄位：${sessionErrors.join("、")}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // 驗證票種資料 - 只驗證新增的票種
    const ticketErrors: string[] = [];
    sessions.forEach((session, sessionIndex) => {
      if (session.ticketTypes.length === 0) {
        // 檢查是否為新增的場次，如果是新增場次但沒有票種，則需要驗證
        const isNewSession = session.sessionId.startsWith("tmp-");
        if (isNewSession) {
          ticketErrors.push(`場次${sessionIndex + 1}票種`);
        }
      } else {
        session.ticketTypes.forEach((ticket, ticketIndex) => {
          // 檢查是否為新增的票種（使用臨時 ID 判斷）
          const isNewTicket = ticket.ticketTypeId.startsWith("tmp-");

          if (isNewTicket) {
            if (!ticket.ticketTypeName?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}名稱`);
            }
            if (!ticket.sellBeginDate?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}販售開始時間`);
            }
            if (!ticket.sellEndDate?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}販售結束時間`);
            }
            if (!ticket.ticketTypePrice || ticket.ticketTypePrice <= 0) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}價格`);
            }
            if (!ticket.totalQuantity || ticket.totalQuantity <= 0) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}數量`);
            }
            if (!ticket.entranceType?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}入場方式`);
            }
            if (!ticket.ticketBenefits?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}票種福利`);
            }
            if (!ticket.ticketRefundPolicy?.trim()) {
              ticketErrors.push(`場次${sessionIndex + 1}票種${ticketIndex + 1}退票政策`);
            }
          }
        });
      }
    });

    if (ticketErrors.length > 0) {
      toast({
        title: "票種資料未完整",
        description: `請填寫以下欄位：${ticketErrors.join("、")}`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { info, saveDraft, submitConcert } = useConcertStore.getState();

      let concertId = info.concertId;

      // 強制儲存所有正在編輯的 session 資料
      if (editingSessionId) {
        const formatTime = (time: string) => {
          if (!time) return "";
          if (/^\d{2}:\d{2}$/.test(time)) return time;
          try {
            const [hours, minutes] = time.split(":");
            return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
          } catch {
            return "";
          }
        };

        updateSession({
          sessionId: editingSessionId,
          sessionDate: editBuffer.sessionDate || "",
          sessionStart: formatTime(editBuffer.sessionStart),
          sessionEnd: formatTime(editBuffer.sessionEnd),
          sessionTitle: editBuffer.sessionTitle || "",
        });
        setEditingSessionId(null);
      }

      // 強制儲存所有正在編輯的 ticket 資料
      try {
        Object.values(ticketTableRefs.current).forEach((ref) => {
          if (ref) {
            ref.saveAllEditingTickets();
          }
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "票種資料未完整",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      // 無論是否有 concertId，都先儲存草稿確保資料同步
      const result = await saveDraft();
      if (!result?.concertId) {
        throw new Error("儲存草稿失敗");
      }
      concertId = result.concertId; // 使用 saveDraft 回傳的 concertId

      // 使用確定的 concertId 來送審
      await submitConcert(concertId);
      toast({
        title: "成功",
        description: "送審成功",
      });

      // 送審成功後自動導航到演唱會列表頁面
      const orgId = companyId || searchParams.get("companyId") || (isEditMode ? info.organizationId : null);
      if (orgId) {
        navigate(`/companyDetail?companyId=${orgId}&tab=concertList`);
      }
    } catch (error) {
      // console.error("送審失敗:", error);
      toast({
        title: "錯誤",
        description: error instanceof Error ? error.message : "送審失敗",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpin fullPage={true} />}
      <Header />
      {/* Breadcrumb */}
      <div className="mt-24 w-full bg-[#f3f3f3] px-2 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-2 sm:gap-6">
            <BackToListButton companyId={companyId} isEditMode={isEditMode} />
            <div className="hidden h-6 border-l border-gray-300 sm:block" />
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{isEditMode ? "編輯演唱會" : "舉辦演唱會"}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-2 pt-4 pb-2 sm:px-4 sm:pt-6 sm:pb-4">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm">
          <span className="font-medium text-blue-600">設定演唱會資料</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">設定場次及票種</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-2 pb-8 sm:px-4 sm:pb-12 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-white shadow-lg">
          {/* 新增場次 */}
          <div className="absolute top-4 right-2 sm:top-8 sm:right-8">
            <Button
              variant="outline"
              className="rounded border border-[#2986cc] px-2 py-1 text-xs font-bold text-[#2986cc] sm:px-3 sm:py-2 sm:text-sm"
              onClick={handleAddSessionWrapper}
            >
              新增場次
            </Button>
          </div>
          <div className="space-y-4 p-4 sm:space-y-8 sm:p-8">
            {/* 場次表格 */}
            <div className="overflow-x-auto">
              <div className="w-full">
                {/* Header */}
                <div className="hidden grid-cols-[60px_120px_1fr_180px] gap-4 border-b px-4 py-2 md:grid">
                  <div className="text-xs font-bold sm:text-sm">序號</div>
                  <div className="text-xs font-bold sm:text-sm">
                    場次名稱<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  <div className="text-xs font-bold sm:text-sm">
                    舉辦時間<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  <div className="text-xs font-bold sm:text-sm"></div>
                </div>
                {/* Body */}
                <div className="divide-y">
                  {sessions.map((s, idx) => (
                    <div key={s.sessionId}>
                      {/* Main Row */}
                      <div className="flex flex-col gap-2 p-2 md:grid md:grid-cols-[60px_120px_1fr_180px] md:gap-4 md:px-4 md:py-2">
                        <div className="flex items-center text-xs sm:text-sm md:block">
                          <span className="mr-2 shrink-0 font-bold md:hidden">序號：</span>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <div className="flex flex-col md:block">
                          <span className="mb-1 shrink-0 font-bold md:hidden">場次名稱：</span>
                          {editingSessionId === s.sessionId ? (
                            <input
                              className="w-full rounded border px-2 py-1 text-center text-xs placeholder:text-gray-400 sm:text-sm"
                              value={editBuffer.sessionTitle}
                              onChange={(e) => setEditBuffer((buf) => ({ ...buf, sessionTitle: e.target.value }))}
                              placeholder="請輸入場次名稱(必填)"
                            />
                          ) : (
                            <span className="inline-block w-full rounded border px-2 py-1 text-center text-xs sm:text-sm">
                              {s.sessionTitle || <span className="text-gray-400">請輸入場次名稱</span>}
                            </span>
                          )}
                        </div>
                        <div className="relative flex flex-col md:block">
                          <span className="mb-1 shrink-0 font-bold md:hidden">舉辦時間：</span>
                          {editingSessionId === s.sessionId ? (
                            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                              <div className="relative w-full md:flex-1">
                                <SingleDatePicker
                                  date={editBuffer.sessionDate ? dayjs(editBuffer.sessionDate).toDate() : null}
                                  setDate={(date) =>
                                    setEditBuffer((buf) => ({
                                      ...buf,
                                      sessionDate: date ? dayjs(date).format("YYYY-MM-DD") : "",
                                    }))
                                  }
                                  placeholder="請輸入場次日期(必填)"
                                  inputClassName="w-full text-xs sm:text-sm placeholder:text-gray-400"
                                />
                              </div>
                              <div className="relative w-full md:flex-1">
                                <TimeOnlyPicker
                                  value={editBuffer.sessionStart}
                                  onChange={(time: string) => setEditBuffer((buf) => ({ ...buf, sessionStart: time }))}
                                  placeholder="請選擇開始時間(必填)"
                                  inputClassName="w-full text-xs sm:text-sm placeholder:text-gray-400"
                                />
                              </div>
                              <div className="relative w-full md:flex-1">
                                <TimeOnlyPicker
                                  value={editBuffer.sessionEnd}
                                  onChange={(time: string) => setEditBuffer((buf) => ({ ...buf, sessionEnd: time }))}
                                  placeholder="請選擇結束時間(必填)"
                                  inputClassName="w-full text-xs sm:text-sm placeholder:text-gray-400"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                              <div className="relative w-full md:flex-1">
                                <span className="inline-block w-full rounded border px-2 py-1 text-xs sm:text-sm">
                                  <Calendar className="mr-1 inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-3.5 lg:w-3.5" />
                                  {s.sessionDate ? dayjs(s.sessionDate).format("YYYY-MM-DD") : <span className="text-gray-400">請輸入場次日期</span>}
                                </span>
                              </div>
                              <div className="relative w-full md:flex-1">
                                <span className="inline-block w-full rounded border px-2 py-1 text-xs sm:text-sm">
                                  開始：{s.sessionStart || <span className="text-gray-400">請選擇開始時間</span>}
                                </span>
                              </div>
                              <div className="relative w-full md:flex-1">
                                <span className="inline-block w-full rounded border px-2 py-1 text-xs sm:text-sm">
                                  結束：{s.sessionEnd || <span className="text-gray-400">請選擇結束時間</span>}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end md:mt-0 md:block">
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              variant="outline"
                              className="border-black px-2 py-1 text-xs whitespace-nowrap text-black sm:px-3 sm:text-sm"
                              onClick={() => setExpandedSessionId(expandedSessionId === s.sessionId ? null : s.sessionId)}
                            >
                              票種設定 <span className="ml-0.5">{expandedSessionId === s.sessionId ? "⌃" : "⌄"}</span>
                            </Button>
                            <div className="flex items-center gap-1">
                              {editingSessionId === s.sessionId ? (
                                <Button variant="ghost" className="h-7 w-7 p-1 sm:h-8 sm:w-8 sm:p-2" onClick={() => handleSave(s.sessionId)}>
                                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" className="h-7 w-7 p-1 sm:h-8 sm:w-8 sm:p-2" onClick={() => handleEdit(s)}>
                                  <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" className="h-7 w-7 p-1 sm:h-8 sm:w-8 sm:p-2" onClick={() => deleteSession(s.sessionId)}>
                                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Expanded Content */}
                      {expandedSessionId === s.sessionId && (
                        <div className="px-4 py-2">
                          <div className="mb-4 flex flex-col items-center">
                            {s.imgSeattable ? (
                              <img src={s.imgSeattable} alt="座位圖" className="mb-2 h-24 w-auto rounded border object-contain sm:h-32" />
                            ) : (
                              <div className="my-2 text-xs text-gray-500 sm:my-4 sm:text-sm">尚未上傳座位圖</div>
                            )}
                            <Button
                              variant="outline"
                              className="border-black px-2 py-1 text-xs text-black sm:px-3 sm:py-2 sm:text-sm"
                              onClick={() => handleUploadSeattable(s.sessionId)}
                            >
                              上傳座位圖<span className="ml-1 text-lg text-red-500">*</span>
                            </Button>
                          </div>
                          <TicketTypeTable
                            session={s}
                            expandedTicketId={expandedTicketId}
                            handleDeleteTicket={deleteTicket}
                            handleAddTicketType={handleAddTicketTypeWrapper}
                            setExpandedTicketId={setExpandedTicketId}
                            onValidationError={(error) => {
                              toast({
                                title: "票種資料未完整",
                                description: error,
                                variant: "destructive",
                              });
                            }}
                            ref={(el) => {
                              ticketTableRefs.current[s.sessionId] = el;
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 按鈕 */}
            <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <Button
                variant="outline"
                className="w-full rounded border border-black px-2 py-1 text-xs text-black sm:w-auto sm:px-3 sm:py-2 sm:text-sm"
                onClick={handleBack}
                disabled={isLoading}
              >
                上一步
              </Button>
              <div className="flex gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded border-[#2986cc] bg-[#2986cc] px-2 py-1 text-xs text-white sm:flex-none sm:px-3 sm:py-2 sm:text-sm"
                  onClick={handleSaveDraftWrapper}
                  disabled={isLoading}
                >
                  {isEditMode ? "儲存變更" : "儲存草稿"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded border-[#2986cc] bg-[#2986cc] px-2 py-1 text-xs text-white sm:flex-none sm:px-3 sm:py-2 sm:text-sm"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  送審
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollTopBtn />
    </>
  );
}
