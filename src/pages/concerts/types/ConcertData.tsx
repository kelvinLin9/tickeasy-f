export type ticketTypeItem = {
  ticketTypeId: string;
  concertSessionId: string;
  ticketTypeName: string;
  entranceType: string;
  ticketBenefits: string;
  ticketRefundPolicy: string;
  ticketTypePrice: number;
  totalQuantity: number;
  remainingQuantity: number;
  sellBeginDate: string;
  sellEndDate: string;
  createdAt: string;
};
export type sessionItem = {
  sessionId: string;
  concertId: string;
  sessionDate: string;
  sessionStart: string;
  sessionEnd: string;
  sessionTitle: string;
  imgSeattable: string;
  createdAt: string;
  ticketTypes: ticketTypeItem[];
};

export type sessionData = sessionItem[];
