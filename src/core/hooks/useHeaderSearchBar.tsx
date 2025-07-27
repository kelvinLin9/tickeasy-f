import { useNavigate } from "react-router-dom";

export const useHeaderSearchBar = (onSearchComplete?: () => void) => {
  const navigate = useNavigate();

  const handleSearch = (text: string) => {
    if (text.trim() !== "") {
      // 用 URLSearchParams 組 query string
      const params = new URLSearchParams({ search: text }).toString();
      // 如果已经在 concerts 页面，只需要更新 state
      if (location.pathname === "/concerts") {
        // navigate(".", {
        //   state: { searchText: text },
        //   replace: true,
        // });
        // 用 replace: true 讓網址參數更新（不新增歷史紀錄）
        navigate(`?${params}`, { replace: true });
      } else {
        // navigate(`/concerts`, {
        //   state: { searchText: text },
        // });
        navigate(`/concerts?${params}`);
      }
      // 搜索完成后执行回调函数
      onSearchComplete?.();
    }
  };

  return { handleSearch };
};
