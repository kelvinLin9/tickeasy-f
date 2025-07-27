import { UseFormRegisterReturn } from "react-hook-form";
import { MusicTypeOption } from "../types/musicType";

interface ProfilePreferEventTypesProps {
  eventTypes: UseFormRegisterReturn;
  MusicOptions: MusicTypeOption[];
  disabled?: boolean;
}

export default function ProfilePreferEventTypes({ eventTypes, MusicOptions, disabled }: ProfilePreferEventTypesProps) {
  return (
    <div className="ml-4 grid grid-cols-1 gap-4">
      {MusicOptions.map((eventType) => (
        <label key={eventType.value} className="flex cursor-pointer items-center gap-1">
          <input type="checkbox" value={eventType.value} {...eventTypes} className="rounded border-gray-300" disabled={disabled} />
          <span className="text-sm">
            {eventType.label} ({eventType.subLabel})
          </span>
        </label>
      ))}
    </div>
  );
}
