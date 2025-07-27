import { Icon } from "@iconify-icon/react";
export default function DesktopSearchBar({
  handleSearch,
  searchText,
  setSearchText,
}: {
  handleSearch: (text: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}) {
  return (
    <div className="block h-16 w-full lg:hidden">
      <div className="mx-4 flex max-w-screen-sm items-center gap-x-2 rounded-md bg-white px-4 py-2 sm:mx-auto">
        <div className="flex-1">
          <input
            className="w-full text-xl focus:outline-none"
            placeholder="搜尋活動"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchText);
              }
            }}
          />
        </div>
        <div onClick={() => handleSearch(searchText)} className="bg-primary flex h-10 w-10 items-center justify-center rounded-md">
          <Icon icon="my-search" className="text-2xl text-white" />
        </div>
      </div>
    </div>
  );
}
