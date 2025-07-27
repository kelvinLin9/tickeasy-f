import { UseFormRegisterReturn } from "react-hook-form";
import { RegionOption } from "../types/region";
interface ProfilePreferRegionsProps {
  regions: UseFormRegisterReturn;
  regionOptions: RegionOption[];
  disabled?: boolean;
}

export default function ProfilePreferRegions({ regions, regionOptions, disabled }: ProfilePreferRegionsProps) {
  const allRegions = regionOptions;

  return (
    <div className="ml-4 grid grid-cols-3 gap-4">
      {allRegions.map((region) => (
        <label key={region.value} className="flex cursor-pointer items-center gap-1">
          <input type="checkbox" value={region.value} {...regions} className="rounded border-gray-300" disabled={disabled} />
          <span className="text-sm">{region.label}</span>
        </label>
      ))}
    </div>
  );
}
