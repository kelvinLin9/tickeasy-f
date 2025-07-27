import React, { createContext } from "react";

export type FilterType = {
  area?: string;
  category?: string;
  date?: string;
  dateSort?: "asc" | "desc";
};

type FilterContextType = {
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  clearFilter: boolean;
  setClearFilter: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ConcertFilterContext = createContext<FilterContextType | undefined>(undefined);
