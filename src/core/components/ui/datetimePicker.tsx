"use client";

import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/core/components/ui/button";
import { Calendar } from "@/core/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/core/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";

interface DateTimePickerProps {
  date: Date | null;
  setDate: (date: Date | null) => void;
  placeholder: string;
  inputClassName?: string;
  format?: string;
  defaultMonth?: Date;
  disabled?: boolean;
}

export function DateTimePicker({
  date,
  setDate,
  placeholder,
  inputClassName,
  format = "YYYY/MM/DD HH:mm",
  defaultMonth,
  disabled,
}: DateTimePickerProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"inputStyle"} className={cn(`${inputClassName} justify-around`, !date && "text-muted-foreground")} disabled={disabled}>
          <CalendarIcon className="h-4 w-4" />
          {date ? dayjs(date).format(format) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[9999] w-auto p-0" align="start" side="bottom">
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={(newDate) => {
              if (newDate) {
                const currentDate = date || new Date();
                setDate(dayjs(newDate).hour(currentDate.getHours()).minute(currentDate.getMinutes()).toDate());
              }
            }}
            defaultMonth={date || (defaultMonth ? dayjs(defaultMonth).toDate() : undefined)}
            required
          />
          <div className="mt-2 flex gap-2">
            <Select
              value={date ? dayjs(date).format("HH") : "00"}
              onValueChange={(value) => {
                if (date) {
                  setDate(dayjs(date).hour(parseInt(value)).toDate());
                }
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="時" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[200px] overflow-y-auto" position="popper" side="top" sideOffset={5}>
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={date ? dayjs(date).format("mm") : "00"}
              onValueChange={(value) => {
                if (date) {
                  setDate(dayjs(date).minute(parseInt(value)).toDate());
                }
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="分" />
              </SelectTrigger>
              <SelectContent className="z-[9999] max-h-[200px] overflow-y-auto" position="popper" side="top" sideOffset={5}>
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute}>
                    {minute}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
