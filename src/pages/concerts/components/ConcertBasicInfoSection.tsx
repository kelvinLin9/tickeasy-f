import { SingleDatePicker } from "@/core/components/ui/singleDatePicker";
import { Concert } from "@/pages/comm/types/Concert";

interface ConcertBasicInfoSectionProps {
  conTitle: Concert["conTitle"];
  eventStartDate: Concert["eventStartDate"];
  eventEndDate: Concert["eventEndDate"];
  onTitleChange: (value: Concert["conTitle"]) => void;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

export function ConcertBasicInfoSection({
  conTitle,
  eventStartDate,
  eventEndDate,
  onTitleChange,
  onStartDateChange,
  onEndDateChange,
}: ConcertBasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      {/* 演唱會名稱 */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8">
        <div className="mb-5 flex-1 md:mb-0">
          <label className="mb-4 block font-medium text-gray-700">
            演唱會名稱<span className="ml-1 text-red-500">*</span>
          </label>
          <input
            className="w-full rounded border border-gray-300 p-2"
            placeholder="請輸入演唱會名稱"
            value={conTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        {/* 演唱會時間 */}
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <label className="mb-4 block font-medium text-gray-700">
              演唱會時間<span className="ml-1 text-lg text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <SingleDatePicker
                date={eventStartDate ? new Date(eventStartDate) : null}
                setDate={onStartDateChange}
                placeholder="請選擇開始日期"
                inputClassName="w-full"
                format="YYYY/MM/DD"
              />
              <span className="text-gray-400 md:mx-2">~</span>
              <SingleDatePicker
                date={eventEndDate ? new Date(eventEndDate) : null}
                setDate={onEndDateChange}
                placeholder="請選擇結束日期"
                inputClassName="w-full"
                format="YYYY/MM/DD"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
