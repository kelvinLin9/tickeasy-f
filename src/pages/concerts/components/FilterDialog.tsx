import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/core/components/ui/dialog";
import { useState, useReducer } from "react";
import DateRangePicker from "@/core/components/ui/dateRangPicker";
import FilterGroupButton from "@/pages/concerts/components/FilterGroupButton";
import { CurrentFilterItem } from "../types/FilterItem";
import { Button } from "@/core/components/ui/button";
import { useFilterContext } from "../hook/useFilterContext";

// 定義 FilterType
type FilterType = "area" | "category" | "date";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilter: CurrentFilterItem;
  onConfirm: () => void;
}

const filterOptions = {
  area: [
    { label: "北部", value: "北部" },
    { label: "中部", value: "中部" },
    { label: "南部", value: "南部" },
    { label: "東部", value: "東部" },
    { label: "離島", value: "離島" },
    { label: "海外", value: "海外" },
  ],
  category: [
    { label: "流行音樂Pop", value: "pop" },
    { label: "搖滾音樂Rock", value: "rock" },
    { label: "電子音樂Electronic", value: "electronic" },
    { label: "嘻哈/饒舌Hip-Hop/Rap", value: "hip-hop/rap" },
    { label: "爵士/藍調Jazz/Blues", value: "jazz/blues" },
    { label: "古典/交響樂Classical/Symphony", value: "classical/symphony" },
  ],
  dateSort: [
    { label: "近期優先", value: "asc" },
    { label: "遠期優先", value: "desc" },
  ],
};

// 定義 FilterState
type FilterState = {
  area: string[];
  category: string[];
  date: string[];
  dateSort: string[];
};

// 定義 action 類型
type FilterAction =
  | { type: "SELECT_AREA"; payload: string }
  | { type: "SELECT_CATEGORY"; payload: string }
  | { type: "SELECT_DATE"; payload: string[] }
  | { type: "SELECT_DATE_SORT"; payload: string }
  | { type: "CLEAR_FILTER"; payload: FilterType };

// 定義 reducer
const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case "SELECT_AREA":
      return {
        ...state,
        area: state.area.includes(action.payload) ? state.area.filter((v) => v !== action.payload) : [...state.area, action.payload],
      };

    case "SELECT_CATEGORY":
      return {
        ...state,
        category: state.category.includes(action.payload) ? state.category.filter((v) => v !== action.payload) : [...state.category, action.payload],
      };

    case "SELECT_DATE":
      return {
        ...state,
        date: action.payload,
      };

    case "SELECT_DATE_SORT":
      return {
        ...state,
        dateSort: state.dateSort.includes(action.payload) ? state.dateSort.filter((v) => v !== action.payload) : [...state.dateSort, action.payload],
      };

    case "CLEAR_FILTER":
      return {
        ...state,
        [action.payload]: [],
      };

    default:
      return state;
  }
};

export default function FilterDialog({ open, onOpenChange, currentFilter, onConfirm }: FilterDialogProps) {
  const [dateRange, setDateRange] = useState<[string, string]>(["", ""]);
  const { setFilterType, setClearFilter } = useFilterContext();
  const [selectedValues, dispatch] = useReducer(filterReducer, {
    area: [],
    category: [],
    date: [],
    dateSort: [],
  });

  const handleButtonSelect = (value: string) => {
    if (!currentFilter) return;
    switch (currentFilter.type) {
      case "area":
        dispatch({ type: "SELECT_AREA", payload: value });
        break;
      case "category":
        dispatch({ type: "SELECT_CATEGORY", payload: value });
        break;
      case "date":
        dispatch({ type: "SELECT_DATE", payload: [value] });
        break;
      case "dateSort":
        dispatch({ type: "SELECT_DATE_SORT", payload: value });
        break;
    }
  };

  const handleClear = () => {
    if (!currentFilter) return;

    dispatch({
      type: "CLEAR_FILTER",
      payload: currentFilter.type as FilterType,
    });
    setClearFilter(true);
  };

  const handleConfirm = () => {
    if (selectedValues[currentFilter.type as keyof FilterState].length === 0) {
      // 如果當前類型的選中值為空，則清除該類型的篩選
      setFilterType((prev) => {
        const newFilterType = { ...prev };
        delete newFilterType[currentFilter.type as keyof typeof newFilterType];
        return newFilterType;
      });
    } else {
      // 否則更新篩選值
      setFilterType((prev) => ({
        ...prev,
        [currentFilter.type]: selectedValues[currentFilter.type as keyof FilterState],
      }));
    }
    onConfirm();
  };

  // 在渲染時使用對應的 selectedValues
  const currentSelectedValues = currentFilter ? selectedValues[currentFilter.type as keyof FilterState] : [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-center justify-center lg:h-[70vh]">
        <DialogHeader className="mx-auto max-w-[60%]">
          <DialogTitle className="my-10 text-center text-2xl">{currentFilter?.label}</DialogTitle>
        </DialogHeader>

        <div className="mx-auto max-w-[60%]">
          {currentFilter?.type === "area" && (
            <FilterGroupButton buttonList={filterOptions.area} selectedValues={currentSelectedValues} onSelect={handleButtonSelect} />
          )}
          {currentFilter?.type === "category" && (
            <FilterGroupButton buttonList={filterOptions.category} selectedValues={currentSelectedValues} onSelect={handleButtonSelect} />
          )}
          {currentFilter?.type === "date" && (
            <DateRangePicker
              ranges={[
                {
                  startDate: dateRange[0] ? new Date(dateRange[0]) : new Date(),
                  endDate: dateRange[1] ? new Date(dateRange[1]) : new Date(),
                  key: "selection",
                },
              ]}
              onChange={(item) => {
                function formatDateLocal(date: Date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, "0");
                  const d = String(date.getDate()).padStart(2, "0");
                  return `${y}-${m}-${d}`;
                }

                const start = item.selection.startDate ? formatDateLocal(item.selection.startDate) : "";
                const end = item.selection.endDate ? formatDateLocal(item.selection.endDate) : "";
                setDateRange([start, end]);
                dispatch({ type: "SELECT_DATE", payload: [start, end] }); // payload 應該是陣列
              }}
            />
          )}
          {currentFilter?.type === "dateSort" && (
            <FilterGroupButton buttonList={filterOptions.dateSort} selectedValues={currentSelectedValues} onSelect={handleButtonSelect} />
          )}
        </div>

        <DialogFooter className="mt-8 flex w-[20%] flex-col gap-4">
          <Button variant="ghost" className="hover:text-sidebar-primary text-sidebar-ring w-full rounded-full" onClick={handleClear}>
            清除設定
          </Button>
          <Button className="w-full rounded-full" onClick={handleConfirm}>
            確認
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
