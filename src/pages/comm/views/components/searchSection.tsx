import { Icon } from "@iconify-icon/react";
export default function SearchSection({
  searchText,
  setSearchText,
  handleSearch,
}: {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (text: string) => void;
}) {
  return (
    <>
      <div className="mx-auto hidden h-[128px] w-full max-w-[1075px] p-4 lg:block">
        <div className="flex h-full items-center justify-center gap-x-3">
          <div className="flex h-[50px] max-w-[600px] flex-1 items-center gap-x-2 rounded-[10px] border-2 border-neutral-600 px-4">
            <Icon icon="my-search" className="text-2xl text-neutral-600" />
            <input
              placeholder="請輸入關鍵字"
              className="h-full w-full text-xl focus:outline-none"
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
        </div>
      </div>
    </>
  );
}
