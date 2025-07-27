import { FilterType } from "@/context/concertFilterContext";

import { useState } from "react";
import { ConcertFilterContext } from "@/context/concertFilterContext";

export const ConcertFilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filterType, setFilterType] = useState<FilterType>({});
  const [clearFilter, setClearFilter] = useState(false);
  return <ConcertFilterContext.Provider value={{ filterType, setFilterType, clearFilter, setClearFilter }}>{children}</ConcertFilterContext.Provider>;
};
