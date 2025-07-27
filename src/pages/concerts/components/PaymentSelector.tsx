import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { cn } from "@/core/lib/utils";
export default function PaymentSelector({
  options,
  label,
  placeholder,
  className,
  disabled,
  value,
  onChange,
}: {
  options: { label: string; value: string; disabled?: boolean }[];
  label: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn(className)} disabled={disabled}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
