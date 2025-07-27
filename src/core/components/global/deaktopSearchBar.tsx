import { Icon } from "@iconify-icon/react";
export default function DesktopSearchBar({
  desktopSearchBlock,
  setDesktopSearchBlock,
  searchText,
  setSearchText,
  handleSearch,
}: {
  desktopSearchBlock: boolean;
  setDesktopSearchBlock: (block: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (text: string) => void;
}) {
  return (
    <>
      {desktopSearchBlock && (
        <div className="fixed top-20 left-1/2 z-99 h-[128px] w-full max-w-[1075px] -translate-x-1/2 transform rounded-[24px] bg-white p-6 shadow-sm lg:block">
          <div className="flex h-full items-center justify-between gap-x-2 p-2">
            <div onClick={() => setDesktopSearchBlock(false)} className="flex w-[40px] cursor-pointer items-center justify-center">
              <Icon icon="my-close" className="text-2xl" />
            </div>
            <div className="flex h-[66px] w-full flex-1 items-center justify-between gap-x-2 rounded-[100px] border-2 border-neutral-600 px-4">
              <input
                placeholder="搜尋演唱會"
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
              <div
                onClick={() => handleSearch(searchText)}
                className="bg-primary flex h-[56px] w-[56px] cursor-pointer items-center justify-center rounded-[100px] transition-colors hover:bg-neutral-600"
              >
                <Icon icon="my-search" className="text-2xl text-white" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
