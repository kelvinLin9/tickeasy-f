import { RawConertDataResponse } from "./RawConertData";

export type SelectedTicket = {
  ticketTypeId: string;
  quantity: number;
  ticketPrice: number;
  ticketTypeName: string;
};
export interface BuyerInfo {
  name: string;
  email: string;
  mobilePhone: string;
  paymentMethod: string;
}
export interface CreateOrderData {
  lockExpireTime: string;
  orderId: string;
}

export interface HandlePaymentData {
  method: string;
  provider: string;
}
export interface PaymentResultResponse {
  status: string;
  message: string;
  data: {
    paymentId: string;
    amount: number;
    currency: string;
    method: string;
    provider: string;
    status: string;
    rawPayload: Record<string, unknown>; // 平台回傳資料
  };
}
export type orderItem = {
  orderId: string;
  ticketTypeId: string;
  userId: string;
  orderStatus: string;
  isLocked: boolean;
  lockToken: string;
  lockExpireTime: string;
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone: string;
  invoicePlatform: string | null;
  invoiceType: string | null;
  invoiceCarrier: string | null;
  invoiceStatus: string | null;
  invoiceNumber: string | null;
  invoiceUrl: string | null;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
};
export interface orderDataResponse {
  status: string;
  message: string;
  data: {
    order: orderItem;
    concert: RawConertDataResponse;
  };
}
