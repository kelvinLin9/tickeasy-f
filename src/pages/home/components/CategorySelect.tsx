import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { CategoryOptions } from "../types/CategoryOptions";

interface CategorySelectProps {
  options: CategoryOptions[];
  selectedCategory: CategoryOptions | null;
  setSelectedCategory: (category: CategoryOptions | null) => void;
}

export default function CategorySelect({ options, selectedCategory, setSelectedCategory }: CategorySelectProps) {
  return (
    <div className="mx-2 flex w-full max-w-[400px] items-center justify-center rounded-lg bg-slate-100 py-2">
      <Select
        value={selectedCategory?.value || ""}
        onValueChange={(value) => {
          const selected = options.find((option) => option.value === value) || null;
          setSelectedCategory(selected);
        }}
      >
        <SelectTrigger className="mx-4 text-base text-neutral-600 focus:ring-0 focus:ring-offset-0">
          <SelectValue placeholder="活動分類" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem className="text-base text-neutral-600 focus:bg-slate-100 focus:text-neutral-600" key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
