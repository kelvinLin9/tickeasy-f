import { DateRange, RangeKeyDict, Range } from "react-date-range";
import "react-date-range/dist/styles.css"; // 主樣式
import "react-date-range/dist/theme/default.css"; // 主題樣式

export default function DateRangePicker({ onChange, ranges }: { onChange: (ranges: RangeKeyDict) => void; ranges: Range[] }) {
  return (
    <div>
      <DateRange editableDateInputs={false} onChange={onChange} moveRangeOnFirstSelection={false} ranges={ranges} />
    </div>
  );
}
