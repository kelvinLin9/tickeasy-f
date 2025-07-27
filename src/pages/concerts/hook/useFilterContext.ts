import { useContext } from "react";
import { ConcertFilterContext } from "@/context/concertFilterContext";

export const useFilterContext = () => {
  const ctx = useContext(ConcertFilterContext);
  if (!ctx) throw new Error("useFilterContext must be used within FilterProvider");
  return ctx;
};
