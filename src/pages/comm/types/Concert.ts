export interface Concert {
  concertId: string;
  organizationId: string;
  venueId: string;
  locationTagId: string;
  musicTagId: string;
  conTitle: string;
  conIntroduction: string;
  conLocation: string;
  conAddress: string;
  eventStartDate: string;
  eventEndDate: string;
  imgBanner: string;
  ticketPurchaseMethod: string;
  precautions: string;
  refundPolicy: string;
  conInfoStatus: string;
  reviewStatus: string;
  reviewNote: string | null;
  visitCount: number;
  promotion: string | null;
  cancelledAt: string | null;
  updatedAt: string;
  createdAt: string;
  sessions: Session[];
  venue: Venue;
}

export interface Session {
  sessionId: string;
  concertId: string;
  sessionDate: string;
  sessionStart: string;
  sessionEnd: string;
  sessionTitle: string;
  imgSeattable: string;
  createdAt: string;
  ticketTypes: TicketType[];
}

export interface TicketType {
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
}

export interface Venue {
  venueId: string;
  venueName: string;
  venueDescription: string;
  venueAddress: string;
  venueCapacity: number;
  venueImageUrl: string;
  googleMapUrl: string;
  isAccessible: boolean;
  hasParking: boolean;
  hasTransit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConcertResponse {
  status: string;
  data: Concert;
}

export interface ConcertCreateResponse {
  status: string;
  message: string;
  data: {
    concert: Concert;
  };
}
