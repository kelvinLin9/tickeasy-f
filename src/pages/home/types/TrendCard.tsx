export interface TrendCardProps {
  title: string;
  image: string;
  bgImage: string;
  description: string;
  link: string;
}
interface SessionData {
  sessionId: string;
  concertId: string;
  sessionDate: string;
  sessionStart: string;
  sessionEnd: string;
  sessionTitle: string;
}
export interface TrendData {
  concertId: string;
  conTitle: string;
  conIntroduction: string;
  imgBanner: string;
  visitCount: number;
  promotion: string | null;
  sessions: SessionData[];
}
