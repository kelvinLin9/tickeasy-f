import { useContext } from "react";
import { BuyTicketContext } from "@/context/buyTicketContext";

export const useBuyTicketContext = () => {
  const ctx = useContext(BuyTicketContext);
  if (!ctx) throw new Error("useBuyTicketContext must be used within BuyTicketProvider");
  return ctx;
};
