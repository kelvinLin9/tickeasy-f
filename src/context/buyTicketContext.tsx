import { sessionItem } from "@/pages/concerts/types/ConcertData";
import { createContext } from "react";
import { SelectedTicket, BuyerInfo, CreateOrderData } from "@/pages/concerts/types/BuyTicket";

export type BuyTicketContextType = {
  selectedSession: sessionItem | null;
  setSelectedSession: (v: sessionItem | null) => void;
  selectedTickets: SelectedTicket[];
  setSelectedTickets: (v: SelectedTicket[]) => void;
  buyerInfo: BuyerInfo;
  newOrderInfo: CreateOrderData;
  setNewOrderInfo: (v: CreateOrderData) => void;
  setBuyerInfo: (v: BuyerInfo) => void;
  validateBuyerInfo: (field?: keyof BuyerInfo) => { success: boolean; errors?: Record<string, string> };
};

export const BuyTicketContext = createContext<BuyTicketContextType>({
  selectedSession: null,
  setSelectedSession: () => {},
  selectedTickets: [],
  setSelectedTickets: () => [],
  buyerInfo: {
    name: "",
    email: "",
    mobilePhone: "",
    paymentMethod: "",
  },
  newOrderInfo: {
    lockExpireTime: "",
    orderId: "",
  },
  setNewOrderInfo: () => {},
  setBuyerInfo: () => {},
  validateBuyerInfo: () => ({ success: false, errors: {} }),
});
