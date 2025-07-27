export interface RawConertData {
  concertId: string;
  conTitle: string;
  conIntroduction: string;
  conLocation: string;
  eventStartDate: string;
  eventEndDate: string;
  imgBanner: string;
  venueName: string;
  locationTagName: string;
  musicTagName: string;
}
export interface RawConertDataResponse {
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
  reviewNote: string;
  visitCount: number;
  promotion: string | null;
  cancelledAt: string | null;
  updatedAt: string;
  createdAt: string;
}
