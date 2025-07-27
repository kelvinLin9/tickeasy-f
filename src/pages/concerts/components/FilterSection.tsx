import { Button } from "@/core/components/ui/button";
import { useState } from "react";
import FilterDialog from "./FilterDialog";
import { CurrentFilterItem } from "../types/FilterItem";

const filerItems = [
  {
    label: "地區篩選",
    value: "area",
    multiSelect: true,
  },
  {
    label: "類別篩選",
    value: "category",
    multiSelect: true,
  },
  {
    label: "日期篩選",
    value: "date",
    multiSelect: false,
  },
  {
    label: "日期排序",
    value: "dateSort",
    multiSelect: false,
  },
];

export default function FilterSection() {
  const [open, setOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<CurrentFilterItem | null>(null);

  const handleFilterClick = (filterType: string, label: string, multiSelect: boolean) => {
    setCurrentFilter({ type: filterType, label: label, multiSelect: multiSelect });
    setOpen(true);
  };
  return (
    <div className="relative h-full w-full">
      <div className="relative h-full w-full lg:absolute lg:-top-10 lg:left-0">
        <div className="mx-auto flex h-full w-full justify-between rounded bg-white px-3 py-5 lg:h-[40px] lg:w-[1296px] lg:px-8">
          <div className="flex h-full w-full flex-wrap justify-between gap-2">
            {filerItems.map((item) => (
              <Button
                key={item.value}
                variant="outline"
                className="w-[171px] rounded-full lg:w-[279px]"
                onClick={() => handleFilterClick(item.value, item.label, item.multiSelect)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {currentFilter && <FilterDialog open={open} onOpenChange={setOpen} currentFilter={currentFilter} onConfirm={() => setOpen(false)} />}
    </div>
  );
}
