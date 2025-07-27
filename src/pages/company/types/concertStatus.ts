// /api/v1/concerts/{concertId}/sessions
export interface ConcertSessionsData {
  organization: {
    organizationId: string;
    orgName: string;
  };
  concert: {
    concertId: string;
    conTitle: string;
    sessions: Session[];
  };
}

export interface Session {
  sessionId: string;
  sessionDate: string;
  sessionTitle?: string; // 線框圖有場次名稱如 "8/15場次"，API 有日期。標題可能在那裡。
  ticketTypes: TicketType[];
}

export interface TicketType {
  ticketTypeId: string;
  ticketTypeName: string;
  ticketTypePrice: string;
  remainingQuantity: number;
  totalQuantity: number;
}

export interface ConcertSessionsResponse {
  status: string;
  message: string;
  data: ConcertSessionsData;
}

export interface CheckInRecord {
  ticketId: string;
  orderId: string;
  purchaserName: string;
  purchaseTime: string;
  status: "purchased" | "refunded" | "used";
  ticketTypeName: string;
}

export interface MappedCheckInRecord {
  orderId: string;
  purchaserName: string;
  ticketTypeName: string;
  purchaseTime: string;
  status: string;
}

export interface CheckInData {
  checkInRecords: CheckInRecord[];
  pagination: {
    count: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}

export interface CheckInResponse {
  status: string;
  message: string;
  data: CheckInData;
}
