import { Button } from "@/core/components/ui/button";

export default function FilterGroupButton({
  buttonList,
  selectedValues,
  onSelect,
}: {
  buttonList: { label: string; value: string }[];
  selectedValues: string[];
  onSelect: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {buttonList.map((button) => (
        <Button
          variant="outline"
          className={`rounded-full lg:min-w-[80px] ${selectedValues.includes(button.value) ? "bg-primary text-white" : ""}`}
          key={button.value}
          onClick={() => onSelect(button.value)}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}
