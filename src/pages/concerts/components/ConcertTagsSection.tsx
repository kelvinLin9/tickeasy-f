import { Concert } from "@/pages/comm/types/Concert";
import Select, { StylesConfig, SingleValue } from "react-select";

interface LocationTag {
  locationTagId: string;
  locationTagName: string;
}

interface MusicTag {
  musicTagId: string;
  musicTagName: string;
}

interface TagOption {
  value: string;
  label: string;
  locationTagName?: string;
  musicTagName?: string;
}

interface ConcertTagsSectionProps {
  locationTags: LocationTag[];
  musicTags: MusicTag[];
  locationTagId: Concert["locationTagId"];
  musicTagId: Concert["musicTagId"];
  locationLoading: boolean;
  musicLoading: boolean;
  locationError: boolean;
  musicError: boolean;
  onLocationTagChange: (value: Concert["locationTagId"]) => void;
  onMusicTagChange: (value: Concert["musicTagId"]) => void;
}

const tagStyles: StylesConfig<TagOption, false> = {
  control: (base) => ({
    ...base,
    minHeight: "42px",
    borderColor: "#d1d5db",
    "&:hover": { borderColor: "#9ca3af" },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#f3f4f6" : "white",
    color: "#1f2937",
    "&:active": { backgroundColor: "#e5e7eb" },
  }),
};

export function ConcertTagsSection({
  locationTags,
  musicTags,
  locationTagId,
  musicTagId,
  locationLoading,
  musicLoading,
  locationError,
  musicError,
  onLocationTagChange,
  onMusicTagChange,
}: ConcertTagsSectionProps) {
  // options
  const locationTagOptions: TagOption[] = locationTags.map((tag) => ({
    value: tag.locationTagId,
    label: tag.locationTagName,
    locationTagName: tag.locationTagName,
  }));
  const musicTagOptions: TagOption[] = musicTags.map((tag) => ({
    value: tag.musicTagId,
    label: tag.musicTagName,
    musicTagName: tag.musicTagName,
  }));
  // selected
  const selectedLocationTagOption = locationTagOptions.find((option) => option.value === locationTagId) || null;
  const selectedMusicTagOption = musicTagOptions.find((option) => option.value === musicTagId) || null;
  // handlers
  const handleLocationTagChange = (newValue: SingleValue<TagOption>) => {
    if (newValue) onLocationTagChange(newValue.value);
  };
  const handleMusicTagChange = (newValue: SingleValue<TagOption>) => {
    if (newValue) onMusicTagChange(newValue.value);
  };

  return (
    <div className="mb-4 rounded-lg bg-gray-100 p-6">
      <h5 className="mb-4 font-medium text-gray-800">演唱會標籤</h5>
      {/* 地區 */}
      <div>
        <label className="mb-1 block font-medium text-gray-700">
          地區<span className="ml-1 text-lg text-red-500">*</span>
        </label>
        <Select<TagOption>
          value={selectedLocationTagOption}
          onChange={handleLocationTagChange}
          options={locationTagOptions}
          placeholder="請選擇地區"
          isSearchable
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "找不到符合的地區"}
          loadingMessage={() => "載入中..."}
          styles={tagStyles}
          isDisabled={locationLoading}
          formatOptionLabel={(option: TagOption) => (
            <div>
              <div>{option.locationTagName}</div>
            </div>
          )}
        />
        {locationError && <p className="mt-1 text-sm text-red-500">載入地區標籤失敗</p>}
      </div>
      {/* 音樂 */}
      <div className="mt-4">
        <label className="mb-1 block font-medium text-gray-700">
          音樂類型<span className="ml-1 text-lg text-red-500">*</span>
        </label>
        <Select<TagOption>
          value={selectedMusicTagOption}
          onChange={handleMusicTagChange}
          options={musicTagOptions}
          placeholder="請選擇音樂類型"
          isSearchable
          className="react-select-container"
          classNamePrefix="react-select"
          noOptionsMessage={() => "找不到符合的音樂類型"}
          loadingMessage={() => "載入中..."}
          styles={tagStyles}
          isDisabled={musicLoading}
          formatOptionLabel={(option: TagOption) => (
            <div>
              <div>{option.musicTagName}</div>
            </div>
          )}
        />
        {musicError && <p className="mt-1 text-sm text-red-500">載入音樂類型失敗</p>}
      </div>
    </div>
  );
}
