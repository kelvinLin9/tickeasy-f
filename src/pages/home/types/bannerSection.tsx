interface SessionData {
  sessionId: string;
  concertId: string;
  sessionDate: string;
  sessionStart: string;
  sessionEnd: string;
  sessionTitle: string;
}
export interface BannerData {
  concertId: string;
  conTitle: string;
  conIntroduction: string;
  imgBanner: string;
  visitCount: number;
  promotion: null;
  sessions: SessionData[];
}

export interface BannerItem {
  id: number;
  concertId: string;
  image: string;
  title: string;
  description: string;
}
