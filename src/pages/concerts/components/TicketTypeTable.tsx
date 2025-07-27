import { Button } from "@/core/components/ui/button";
import { DateTimePicker } from "@/core/components/ui/datetimePicker";
import { Pencil, Save, Trash2 } from "lucide-react";
import { Session, TicketType } from "@/pages/comm/types/Concert";
import { useState, forwardRef, useImperativeHandle } from "react";
import { useConcertStore } from "@/pages/concerts/store/useConcertStore";
import dayjs from "dayjs";

interface TicketTypeTableProps {
  session: Session;
  expandedTicketId: string | null;
  handleDeleteTicket: (sessionId: string, ticketId: string) => void;
  handleAddTicketType: (sessionId: string) => void;
  setExpandedTicketId: (id: string | null) => void;
  onValidationError?: (error: string) => void;
}

export interface TicketTypeTableRef {
  saveAllEditingTickets: () => void;
}

export const TicketTypeTable = forwardRef<TicketTypeTableRef, TicketTypeTableProps>(
  ({ session, expandedTicketId, handleDeleteTicket, handleAddTicketType, setExpandedTicketId, onValidationError }, ref) => {
    // 多行同時編輯 buffer
    const [editBuffers, setEditBuffers] = useState<{ [id: string]: Partial<TicketType> }>({});

    // 編輯狀態
    const isEditing = (id: string) => !!editBuffers[id];

    // 進入編輯
    const handleEdit = (t: TicketType) => {
      setEditBuffers((prev) => ({ ...prev, [t.ticketTypeId]: { ...t } }));
    };

    // 取消編輯
    const handleCancel = (id: string) => {
      setEditBuffers((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    };

    // 單一欄位變動
    const handleBufferChange = (id: string, key: keyof TicketType, value: unknown) => {
      setEditBuffers((prev) => ({
        ...prev,
        [id]: { ...prev[id], [key]: value },
      }));
    };

    const updateSession = useConcertStore((s) => s.updateSession);

    // 儲存單一 ticket
    const handleSave = (sessionId: string, ticketId: string) => {
      const buffer = editBuffers[ticketId];
      if (!buffer) return;

      // 驗證新增的票種資料完整性
      const isNewTicket = ticketId.startsWith("tmp-");
      if (isNewTicket) {
        const validationErrors: string[] = [];
        const ticketIndex = session.ticketTypes.findIndex((t) => t.ticketTypeId === ticketId) + 1;

        if (!buffer.ticketTypeName?.trim()) {
          validationErrors.push(`票種${ticketIndex}名稱`);
        }
        if (!buffer.sellBeginDate?.trim()) {
          validationErrors.push(`票種${ticketIndex}販售開始時間`);
        }
        if (!buffer.sellEndDate?.trim()) {
          validationErrors.push(`票種${ticketIndex}販售結束時間`);
        }
        if (!buffer.ticketTypePrice || buffer.ticketTypePrice <= 0) {
          validationErrors.push(`票種${ticketIndex}價格`);
        }
        if (!buffer.totalQuantity || buffer.totalQuantity <= 0) {
          validationErrors.push(`票種${ticketIndex}數量`);
        }

        // 如果有驗證錯誤，拋出錯誤
        if (validationErrors.length > 0) {
          throw new Error(`請填寫以下欄位：${validationErrors.join("、")}`);
        }
      }

      // 處理空白值，確保字串欄位為空字串，數字欄位為 0
      const processedBuffer = {
        ...buffer,
        ticketTypeName: buffer.ticketTypeName || "",
        sellBeginDate: buffer.sellBeginDate || "",
        sellEndDate: buffer.sellEndDate || "",
        ticketTypePrice: typeof buffer.ticketTypePrice === "number" ? buffer.ticketTypePrice : Number(buffer.ticketTypePrice) || 0,
        totalQuantity: typeof buffer.totalQuantity === "number" ? buffer.totalQuantity : Number(buffer.totalQuantity) || 0,
        entranceType: buffer.entranceType || "",
        ticketBenefits: buffer.ticketBenefits || "",
        ticketRefundPolicy: buffer.ticketRefundPolicy || "",
      };

      const updatedTickets = session.ticketTypes.map((t) => (t.ticketTypeId === ticketId ? { ...t, ...processedBuffer } : t));
      updateSession({
        sessionId,
        ticketTypes: updatedTickets,
      });
      handleCancel(ticketId);
    };

    // 強制儲存所有正在編輯的 tickets
    const saveAllEditingTickets = () => {
      const editingTicketIds = Object.keys(editBuffers);
      if (editingTicketIds.length === 0) return;

      // 驗證新增的票種資料完整性
      const validationErrors: string[] = [];
      editingTicketIds.forEach((ticketId) => {
        const buffer = editBuffers[ticketId];
        const originalTicket = session.ticketTypes.find((t) => t.ticketTypeId === ticketId);

        if (buffer && originalTicket) {
          // 檢查是否為新增的票種（使用臨時 ID 判斷）
          const isNewTicket = ticketId.startsWith("tmp-");

          if (isNewTicket) {
            const ticketIndex = session.ticketTypes.findIndex((t) => t.ticketTypeId === ticketId) + 1;

            if (!buffer.ticketTypeName?.trim()) {
              validationErrors.push(`票種${ticketIndex}名稱`);
            }
            if (!buffer.sellBeginDate?.trim()) {
              validationErrors.push(`票種${ticketIndex}販售開始時間`);
            }
            if (!buffer.sellEndDate?.trim()) {
              validationErrors.push(`票種${ticketIndex}販售結束時間`);
            }
            if (!buffer.ticketTypePrice || buffer.ticketTypePrice <= 0) {
              validationErrors.push(`票種${ticketIndex}價格`);
            }
            if (!buffer.totalQuantity || buffer.totalQuantity <= 0) {
              validationErrors.push(`票種${ticketIndex}數量`);
            }
          }
        }
      });

      // 如果有驗證錯誤，拋出錯誤
      if (validationErrors.length > 0) {
        throw new Error(`請填寫以下欄位：${validationErrors.join("、")}`);
      }

      let updatedTickets = [...session.ticketTypes];

      editingTicketIds.forEach((ticketId) => {
        const buffer = editBuffers[ticketId];
        if (buffer) {
          // 處理空白值，確保字串欄位為空字串，數字欄位為 0
          const processedBuffer = {
            ...buffer,
            ticketTypeName: buffer.ticketTypeName || "",
            sellBeginDate: buffer.sellBeginDate || "",
            sellEndDate: buffer.sellEndDate || "",
            ticketTypePrice: typeof buffer.ticketTypePrice === "number" ? buffer.ticketTypePrice : Number(buffer.ticketTypePrice) || 0,
            totalQuantity: typeof buffer.totalQuantity === "number" ? buffer.totalQuantity : Number(buffer.totalQuantity) || 0,
            entranceType: buffer.entranceType || "",
            ticketBenefits: buffer.ticketBenefits || "",
            ticketRefundPolicy: buffer.ticketRefundPolicy || "",
          };

          updatedTickets = updatedTickets.map((t) => (t.ticketTypeId === ticketId ? { ...t, ...processedBuffer } : t));
        }
      });

      updateSession({
        sessionId: session.sessionId,
        ticketTypes: updatedTickets,
      });

      // 清除所有編輯狀態
      setEditBuffers({});
    };

    // 暴露方法給父組件
    useImperativeHandle(ref, () => ({
      saveAllEditingTickets,
    }));

    return (
      <div className="m-4 border border-black">
        {/* 桌面版表格 */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-left">
                  票種名稱<span className="ml-1 text-lg text-red-500">*</span>
                </th>
                <th className="border-b px-3 py-2 text-left">
                  販售時間<span className="ml-1 text-lg text-red-500">*</span>
                </th>
                <th className="border-b px-3 py-2 text-left">
                  價格<span className="ml-1 text-lg text-red-500">*</span>
                </th>
                <th className="border-b px-3 py-2 text-left">
                  數量<span className="ml-1 text-lg text-red-500">*</span>
                </th>
                <th className="border-b px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {session.ticketTypes.map((t) => (
                <>
                  <tr key={t.ticketTypeId}>
                    <td className="px-3 py-2 text-blue-700">
                      {isEditing(t.ticketTypeId) ? (
                        <input
                          placeholder="請輸入票種名稱(必填)"
                          type="text"
                          className="w-full rounded border px-3 py-2"
                          value={editBuffers[t.ticketTypeId]?.ticketTypeName ?? t.ticketTypeName}
                          onChange={(e) => handleBufferChange(t.ticketTypeId, "ticketTypeName", e.target.value)}
                        />
                      ) : (
                        t.ticketTypeName
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing(t.ticketTypeId) ? (
                        <div className="flex items-center gap-2">
                          <DateTimePicker
                            date={editBuffers[t.ticketTypeId]?.sellBeginDate ? new Date(editBuffers[t.ticketTypeId]?.sellBeginDate as string) : null}
                            setDate={(date) => handleBufferChange(t.ticketTypeId, "sellBeginDate", date ? date.toISOString() : "")}
                            placeholder="開始時間(必填)"
                            inputClassName="w-full px-3 py-2"
                            format="YYYY/MM/DD HH:mm"
                          />
                          <span>~</span>
                          <DateTimePicker
                            date={editBuffers[t.ticketTypeId]?.sellEndDate ? new Date(editBuffers[t.ticketTypeId]?.sellEndDate as string) : null}
                            setDate={(date) => handleBufferChange(t.ticketTypeId, "sellEndDate", date ? date.toISOString() : "")}
                            placeholder="結束時間(必填)"
                            inputClassName="w-full px-3 py-2"
                            format="YYYY/MM/DD HH:mm"
                          />
                        </div>
                      ) : (
                        `${dayjs(t.sellBeginDate).isValid() ? dayjs(t.sellBeginDate).format("YYYY/MM/DD HH:mm") : ""} ~ ${dayjs(t.sellEndDate).isValid() ? dayjs(t.sellEndDate).format("YYYY/MM/DD HH:mm") : ""}`
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing(t.ticketTypeId) ? (
                        <input
                          placeholder="請輸入價格(必填)"
                          type="text"
                          className="w-full rounded border px-3 py-2"
                          value={editBuffers[t.ticketTypeId]?.ticketTypePrice ?? t.ticketTypePrice}
                          onChange={(e) => handleBufferChange(t.ticketTypeId, "ticketTypePrice", Number(e.target.value) || 0)}
                        />
                      ) : (
                        <>NT$ {t.ticketTypePrice}</>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {isEditing(t.ticketTypeId) ? (
                        <input
                          placeholder="請輸入數量(必填)"
                          type="text"
                          className="w-full rounded border px-3 py-2"
                          value={editBuffers[t.ticketTypeId]?.totalQuantity ?? t.totalQuantity}
                          onChange={(e) => handleBufferChange(t.ticketTypeId, "totalQuantity", Number(e.target.value) || 0)}
                        />
                      ) : (
                        t.totalQuantity
                      )}
                    </td>
                    <td className="flex items-center gap-2 px-3 py-2">
                      {isEditing(t.ticketTypeId) ? (
                        <>
                          <Button
                            variant="ghost"
                            className="p-2"
                            onClick={() => {
                              try {
                                handleSave(session.sessionId, t.ticketTypeId);
                              } catch (error) {
                                if (error instanceof Error && onValidationError) {
                                  onValidationError(error.message);
                                }
                              }
                            }}
                          >
                            <Save className="h-5 w-5" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="ghost" className="p-2" onClick={() => handleEdit(t)}>
                          <Pencil className="h-5 w-5" />
                        </Button>
                      )}
                      <Button variant="ghost" className="p-2" onClick={() => handleDeleteTicket(session.sessionId, t.ticketTypeId)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border-t px-3 py-2">
                      <TicketInfo
                        ticket={t}
                        isEditing={isEditing(t.ticketTypeId)}
                        editBuffers={editBuffers}
                        handleBufferChange={handleBufferChange}
                        expandedTicketId={expandedTicketId}
                        setExpandedTicketId={setExpandedTicketId}
                      />
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* 手機版卡片式列表 */}
        <div className="md:hidden">
          {session.ticketTypes.map((t) => (
            <div key={t.ticketTypeId} className="border-b p-4 last:border-b-0">
              <div className="space-y-4">
                {/* 票種名稱 */}
                <div>
                  <div className="mb-1 font-bold">
                    票種名稱<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  {isEditing(t.ticketTypeId) ? (
                    <input
                      placeholder="請輸入票種名稱(必填)"
                      type="text"
                      className="w-full rounded border px-3 py-2"
                      value={editBuffers[t.ticketTypeId]?.ticketTypeName ?? t.ticketTypeName}
                      onChange={(e) => handleBufferChange(t.ticketTypeId, "ticketTypeName", e.target.value)}
                    />
                  ) : (
                    <div className="text-blue-700">{t.ticketTypeName}</div>
                  )}
                </div>

                {/* 販售時間 */}
                <div>
                  <div className="mb-1 font-bold">
                    販售時間<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  {isEditing(t.ticketTypeId) ? (
                    <div className="flex flex-col gap-2">
                      <DateTimePicker
                        date={editBuffers[t.ticketTypeId]?.sellBeginDate ? new Date(editBuffers[t.ticketTypeId]?.sellBeginDate as string) : null}
                        setDate={(date) => handleBufferChange(t.ticketTypeId, "sellBeginDate", date ? date.toISOString() : "")}
                        placeholder="開始時間(必填)"
                        inputClassName="w-full px-3 py-2"
                        format="YYYY/MM/DD HH:mm"
                      />
                      <DateTimePicker
                        date={editBuffers[t.ticketTypeId]?.sellEndDate ? new Date(editBuffers[t.ticketTypeId]?.sellEndDate as string) : null}
                        setDate={(date) => handleBufferChange(t.ticketTypeId, "sellEndDate", date ? date.toISOString() : "")}
                        placeholder="結束時間(必填)"
                        inputClassName="w-full px-3 py-2"
                        format="YYYY/MM/DD HH:mm"
                      />
                    </div>
                  ) : (
                    <div>
                      {dayjs(t.sellBeginDate).isValid() ? dayjs(t.sellBeginDate).format("YYYY/MM/DD HH:mm") : ""} ~{" "}
                      {dayjs(t.sellEndDate).isValid() ? dayjs(t.sellEndDate).format("YYYY/MM/DD HH:mm") : ""}
                    </div>
                  )}
                </div>

                {/* 價格 */}
                <div>
                  <div className="mb-1 font-bold">
                    價格<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  {isEditing(t.ticketTypeId) ? (
                    <input
                      placeholder="請輸入價格(必填)"
                      type="text"
                      className="w-full rounded border px-3 py-2"
                      value={editBuffers[t.ticketTypeId]?.ticketTypePrice ?? t.ticketTypePrice}
                      onChange={(e) => handleBufferChange(t.ticketTypeId, "ticketTypePrice", Number(e.target.value) || 0)}
                    />
                  ) : (
                    <div>NT$ {t.ticketTypePrice}</div>
                  )}
                </div>

                {/* 數量 */}
                <div>
                  <div className="mb-1 font-bold">
                    數量<span className="ml-1 text-lg text-red-500">*</span>
                  </div>
                  {isEditing(t.ticketTypeId) ? (
                    <input
                      placeholder="請輸入數量(必填)"
                      type="text"
                      className="w-full rounded border px-3 py-2"
                      value={editBuffers[t.ticketTypeId]?.totalQuantity ?? t.totalQuantity}
                      onChange={(e) => handleBufferChange(t.ticketTypeId, "totalQuantity", Number(e.target.value) || 0)}
                    />
                  ) : (
                    <div>{t.totalQuantity}</div>
                  )}
                </div>

                {/* 操作按鈕 */}
                <div className="flex justify-end gap-2">
                  {isEditing(t.ticketTypeId) ? (
                    <Button
                      variant="ghost"
                      className="p-2"
                      onClick={() => {
                        try {
                          handleSave(session.sessionId, t.ticketTypeId);
                        } catch (error) {
                          if (error instanceof Error && onValidationError) {
                            onValidationError(error.message);
                          }
                        }
                      }}
                    >
                      <Save className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" className="p-2" onClick={() => handleEdit(t)}>
                      <Pencil className="h-5 w-5" />
                    </Button>
                  )}
                  <Button variant="ghost" className="p-2" onClick={() => handleDeleteTicket(session.sessionId, t.ticketTypeId)}>
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* 票券資訊 */}
                <div className="border-t pt-4">
                  <TicketInfo
                    ticket={t}
                    isEditing={isEditing(t.ticketTypeId)}
                    editBuffers={editBuffers}
                    handleBufferChange={handleBufferChange}
                    expandedTicketId={expandedTicketId}
                    setExpandedTicketId={setExpandedTicketId}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 新增票種按鈕 */}
        <div className="flex justify-end p-2">
          <Button variant="outline" className="border-black text-black" onClick={() => handleAddTicketType(session.sessionId)}>
            新增票種
          </Button>
        </div>
      </div>
    );
  }
);

// 票券資訊元件
function TicketInfo({
  ticket,
  isEditing,
  editBuffers,
  handleBufferChange,
  expandedTicketId,
  setExpandedTicketId,
}: {
  ticket: TicketType;
  isEditing: boolean;
  editBuffers: { [id: string]: Partial<TicketType> };
  handleBufferChange: (id: string, key: keyof TicketType, value: unknown) => void;
  expandedTicketId: string | null;
  setExpandedTicketId: (id: string | null) => void;
}) {
  return (
    <>
      <div
        className="mb-1 cursor-pointer font-medium select-none"
        onClick={() => setExpandedTicketId(expandedTicketId === ticket.ticketTypeId ? null : ticket.ticketTypeId)}
      >
        票券資訊 <span className="ml-1">{expandedTicketId === ticket.ticketTypeId ? "⌃" : "⌄"}</span>
      </div>
      {expandedTicketId === ticket.ticketTypeId && (
        <div className="border p-2">
          {isEditing ? (
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium">
                  入場方式<span className="ml-1 text-lg text-red-500">*</span>：
                </label>
                <input
                  placeholder="請輸入入場方式(必填)"
                  className="w-full rounded border px-3 py-2"
                  value={editBuffers[ticket.ticketTypeId]?.entranceType ?? ticket.entranceType}
                  onChange={(e) => handleBufferChange(ticket.ticketTypeId, "entranceType", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  票種福利<span className="ml-1 text-lg text-red-500">*</span>：
                </label>
                <input
                  placeholder="請輸入票種福利(必填)"
                  className="w-full rounded border px-3 py-2"
                  value={editBuffers[ticket.ticketTypeId]?.ticketBenefits ?? ticket.ticketBenefits}
                  onChange={(e) => handleBufferChange(ticket.ticketTypeId, "ticketBenefits", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  票種退票政策<span className="ml-1 text-lg text-red-500">*</span>：
                </label>
                <input
                  placeholder="請輸入票種退票政策(必填)"
                  className="w-full rounded border px-3 py-2"
                  value={editBuffers[ticket.ticketTypeId]?.ticketRefundPolicy ?? ticket.ticketRefundPolicy}
                  onChange={(e) => handleBufferChange(ticket.ticketTypeId, "ticketRefundPolicy", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div>入場方式：{ticket.entranceType}</div>
              <div>票種福利：{ticket.ticketBenefits}</div>
              <div>票種退票政策：{ticket.ticketRefundPolicy}</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
