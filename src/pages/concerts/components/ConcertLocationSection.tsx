import { useConcertStore } from "../store/useConcertStore";
import { useEffect, useCallback } from "react";
import { GoogleMap } from "@/core/components/global/googleMap";
import Select, { StylesConfig, SingleValue, CSSObjectWithLabel, OptionProps } from "react-select";

interface VenueOption {
  value: string;
  label: string;
  address: string;
}

interface TagOption {
  value: string;
  label: string;
  subLabel: string;
  locationTagName?: string;
  musicTagName?: string;
}

const baseStyles = {
  control: (base: CSSObjectWithLabel) => ({
    ...base,
    minHeight: "42px",
    borderColor: "#d1d5db",
    "&:hover": {
      borderColor: "#9ca3af",
    },
  }),
  option: (base: CSSObjectWithLabel, state: OptionProps<VenueOption | TagOption, false>) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#1f2937",
    "&:active": {
      backgroundColor: "#e5e7eb",
    },
  }),
};

const venueStyles: StylesConfig<VenueOption, false> = {
  control: baseStyles.control,
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#1f2937",
    "&:active": {
      backgroundColor: "#e5e7eb",
    },
  }),
};

export function ConcertLocationSection({
  venueId,
  onVenueChange,
}: {
  venueId: string;
  onVenueChange: (venueId: string, venueName: string, venueAddress: string) => void;
}) {
  const { venues, getVenues } = useConcertStore();

  const fetchData = useCallback(async () => {
    try {
      await getVenues();
    } catch {
      // console.error("Failed to fetch data:", error);
    }
  }, [getVenues]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 場館選項
  const venueOptions: VenueOption[] = venues.map((venue) => ({
    value: venue.venueId,
    label: venue.venueName,
    address: venue.venueAddress,
  }));

  const selectedVenueOption = venueOptions.find((option) => option.value === venueId);

  const handleVenueChange = (newValue: SingleValue<VenueOption>) => {
    if (newValue) {
      onVenueChange(newValue.value, newValue.label, newValue.address);
    }
  };

  // 取得當前選中場館的地址
  const selectedVenue = venues.find((v) => v.venueId === venueId);
  const venueAddress = selectedVenue?.venueAddress || "";

  return (
    <div className="space-y-4">
      {/* 地點名稱 */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">
          地點名稱<span className="ml-1 text-lg text-red-500">*</span>
        </label>
        <Select<VenueOption>
          value={selectedVenueOption}
          onChange={handleVenueChange}
          options={venueOptions}
          placeholder="請選擇場地"
          isSearchable
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "找不到符合的場地"}
          loadingMessage={() => "載入中..."}
          styles={venueStyles}
        />
      </div>

      {/* 地址 */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">
          地址<span className="ml-1 text-lg text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input className="flex-1 rounded border border-gray-300 bg-gray-50 p-2" value={venueAddress} readOnly />
          {venueAddress && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 inline-flex items-center rounded px-4 py-2 text-white"
            >
              開啟地圖
            </a>
          )}
        </div>
      </div>

      {/* Google Maps 預覽 */}
      {venueAddress && (
        <div className="mt-8">
          <GoogleMap address={venueAddress} className="h-[300px] w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
