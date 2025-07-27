export interface ticketHistoryItem {
  orderId: string;
  orderStatus: string;
  orderCreatedAt: string;
  orderNumber: string | null;
  ticketTypeName: string;
  price: string;
  sessionDate: string;
  sessionStart: string;
  sessionEnd: string;
  sessionTitle: string;
  concertName: string;
  concertDescription: string;
  concertStatus: string;
  concertAddress: string;
  qrCode: string | null;
  tickerStatus: string;
  ticketId: string;
}
export interface organization {
  name: string;
  address: string;
  contact: string;
  mail: string;
  mobile: string;
  phone: string;
  website: string;
}
export interface orderTicket {
  concertName: string;
  concertAddress: string;
  concertDate: string;
  orderNumber: string | null;
  purchaseTime: string;
  paymentMethod: string;
  count: number;
  price: string;
  sessionDate: string;
  purchaserName: string;
  purchaserEmail: string;
  purchaserPhone: string;
  qrCode: string;
  organization: organization;
}
