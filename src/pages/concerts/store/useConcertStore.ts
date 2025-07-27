import { create } from "zustand";
import axios, { AxiosResponse } from "axios";
import { ConcertResponse, ConcertCreateResponse, Session, TicketType, Venue } from "@/pages/comm/types/Concert";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";
import type { ConcertSessionsData, CheckInData } from "@/pages/company/types/concertStatus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ========== 型別定義 ==========
type UploadContext = "USER_AVATAR" | "VENUE_PHOTO" | "CONCERT_SEATING_TABLE" | "CONCERT_BANNER";

export type ConInfoStatus = "draft" | "reviewing" | "published" | "rejected" | "finished";

interface VenueListItem {
  venueId: string;
  venueName: string;
  venueAddress: string;
  googleMapUrl: string;
}

interface VenuesResponse {
  status: string;
  data: VenueListItem[];
}

interface OrganizationConcert {
  concertId: string;
  organizationId: string;
  venueId: string | null;
  locationTagId: string | null;
  musicTagId: string | null;
  conTitle: string;
  conIntroduction: string;
  conLocation: string;
  conAddress: string;
  imgBanner: string;
  ticketPurchaseMethod: string | null;
  precautions: string | null;
  refundPolicy: string | null;
  conInfoStatus: string;
  reviewStatus: string;
  visitCount: number;
  promotion: number;
  createdAt: string;
  updatedAt: string;
  sessions: Session[];
}

interface OrganizationConcertsResponse {
  status: string;
  message: string;
  data: {
    concerts: OrganizationConcert[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

interface LocationTag {
  locationTagId: string;
  locationTagName: string;
  subLabel: string;
}

interface MusicTag {
  musicTagId: string;
  musicTagName: string;
  subLabel: string;
}

interface LocationTagsResponse {
  status: string;
  message: string;
  data: LocationTag[];
}

interface MusicTagsResponse {
  status: string;
  message: string;
  data: MusicTag[];
}

// 新增審核記錄相關型別
interface AiResponse {
  reasons: string[];
  summary: string;
  approved: boolean;
  confidence: number;
  rawResponse: {
    reasons: string[];
    summary: string;
    approved: boolean;
    confidence: number;
    suggestions: string[];
    flaggedContent: string[];
    requiresManualReview: boolean;
  };
  suggestions: string[];
  flaggedContent: string[];
  requiresManualReview: boolean;
}

interface Review {
  reviewId: string;
  concertId: string;
  reviewType: "manual_admin" | "ai_auto";
  reviewStatus: "pending" | "approved" | "rejected";
  reviewNote: string;
  aiResponse: AiResponse | null;
  reviewerId: string | null;
  reviewerNote: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ConcertReviewsResponse {
  status: string;
  message: string;
  data: {
    concertId: string;
    conInfoStatus: string;
    reviews: Review[];
  };
}

type ConcertState = {
  // 狀態
  info: {
    [key: string]: unknown;
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
    ticketPurchaseMethod: string;
    precautions: string;
    refundPolicy: string;
    conInfoStatus: string;
    imgBanner: string;
    reviewStatus: string;
    reviewNote: string | null;
    visitCount: number;
    promotion: string | null;
    cancelledAt: string | null;
    updatedAt: string;
    createdAt: string;
    sessions: (Omit<Session, "ticketTypes"> & { ticketTypes: TicketType[] })[];
  };
  sessions: Session[];
  venue: Venue | null;
  venues: VenueListItem[];
  organizationConcerts: OrganizationConcert[];
  organizationConcertsPagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null;
  locationTags: LocationTag[];
  musicTags: MusicTag[];
  concertReviews: Review[] | null;
  concertStatsData: ConcertSessionsData | null;
  checkInData: CheckInData | null;

  // 基本操作
  setInfo: (info: Partial<ConcertState["info"]>) => void;
  clearConcertId: () => void;

  // 場次管理
  setSessions: (sessions: Session[]) => void;
  updateSession: (session: Partial<Session> & { sessionId: string }) => void;
  addSession: (session: Session) => void;
  deleteSession: (sessionId: string) => void;

  // 票券管理
  addTicket: (sessionId: string, ticket: TicketType) => void;
  deleteTicket: (sessionId: string, ticketId: string) => void;

  // API 操作
  saveDraft: () => Promise<{ concertId: string } | undefined>;
  uploadImage: (file: File, uploadContext: UploadContext) => Promise<string>;
  getConcert: (concertId: string) => Promise<void>;
  getVenues: () => Promise<void>;
  getOrganizationConcerts: (organizationId: string, page?: number, status?: ConInfoStatus) => Promise<OrganizationConcert[]>;
  getAllOrganizationConcerts: (organizationId: string) => Promise<OrganizationConcert[]>;
  cancelConcert: (concertId: string) => Promise<void>;
  deleteConcert: (concertId: string) => Promise<void>;
  getConcertStatus: (concertId: string) => ConInfoStatus | null;
  getConcertStatusCounts: () => Record<ConInfoStatus, number>;
  getLocationTags: () => Promise<void>;
  getMusicTags: () => Promise<void>;
  submitConcert: (concertId: string) => Promise<void>;
  cloneConcert: (concertId: string) => Promise<void>;
  incrementVisitCount: (concertId: string) => Promise<void>;
  getConcertReviews: (concertId: string) => Promise<Review[]>;
  getConcertSessions: (concertId: string) => Promise<void>;
  getSessionCheckIns: (sessionId: string, page: number) => Promise<void>;
};

// ========== 工具函數 ==========
// 從 localStorage 取得儲存的 concertId
const getStoredConcertId = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("concertId") || "";
};

// ========== 初始資料 ==========
const sessionData: Session[] = [];

// ========== Store 實現 ==========
export const useConcertStore = create<ConcertState>((set, get) => ({
  // ========== 初始狀態 ==========
  info: {
    concertId: getStoredConcertId(),
    organizationId: "",
    venueId: "",
    locationTagId: "",
    musicTagId: "",
    conTitle: "",
    conIntroduction: "",
    conLocation: "",
    conAddress: "",
    eventStartDate: "",
    eventEndDate: "",
    ticketPurchaseMethod: "",
    precautions: "",
    refundPolicy: "",
    conInfoStatus: "draft",
    imgBanner: "",
    reviewStatus: "",
    reviewNote: null,
    visitCount: 0,
    promotion: null,
    cancelledAt: null,
    updatedAt: "",
    createdAt: "",
    sessions: [],
  },
  sessions: sessionData,
  venue: null,
  venues: [],
  organizationConcerts: [],
  organizationConcertsPagination: null,
  locationTags: [],
  musicTags: [],
  concertReviews: null,
  concertStatsData: null,
  checkInData: null,

  // ========== 基本操作 ==========
  setInfo: (info) =>
    set((state) => {
      const newInfo = { ...state.info, ...info };
      // 當 concertId 變更時，更新 localStorage
      if (info.concertId) {
        localStorage.setItem("concertId", info.concertId);
      }
      return { info: newInfo };
    }),

  clearConcertId: () => {
    localStorage.removeItem("concertId");
    set((state) => ({
      info: {
        ...state.info,
        concertId: "",
      },
    }));
  },

  // ========== 場次管理 ==========
  setSessions: (sessions) => set({ sessions }),

  updateSession: (session) => {
    // console.log("updateSession called with", session);
    set((state) => {
      const newSessions = state.sessions.map((s) => (s.sessionId === session.sessionId ? { ...s, ...session } : s));
      return {
        sessions: newSessions,
        info: {
          ...state.info,
          sessions: newSessions,
        },
      };
    });
  },

  addSession: (session) =>
    set((state) => {
      const newSessions = [...state.sessions, session];
      return {
        sessions: newSessions,
        info: {
          ...state.info,
          sessions: newSessions,
        },
      };
    }),

  deleteSession: (sessionId) =>
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.sessionId !== sessionId);
      return {
        sessions: newSessions,
        info: {
          ...state.info,
          sessions: newSessions,
        },
      };
    }),

  // ========== 票券管理 ==========
  addTicket: (sessionId, ticket) =>
    set((state) => {
      const newSessions = state.sessions.map((s) => (s.sessionId === sessionId ? { ...s, ticketTypes: [...s.ticketTypes, ticket] } : s));
      return {
        sessions: newSessions,
        info: {
          ...state.info,
          sessions: newSessions,
        },
      };
    }),

  deleteTicket: (sessionId, ticketId) =>
    set((state) => {
      const newSessions = state.sessions.map((s) =>
        s.sessionId === sessionId ? { ...s, ticketTypes: s.ticketTypes.filter((t) => t.ticketTypeId !== ticketId) } : s
      );
      return {
        sessions: newSessions,
        info: {
          ...state.info,
          sessions: newSessions,
        },
      };
    }),

  // ========== API 操作 ==========
  saveDraft: async (): Promise<{ concertId: string } | undefined> => {
    try {
      // 先同步 info.sessions
      set((state) => ({
        info: {
          ...state.info,
          sessions: state.sessions,
        },
      }));

      const token = useAuthStore.getState().getAuthToken();
      if (!token) {
        // console.error("[saveDraft] 未登入");
        return Promise.reject(new Error("未登入"));
      }

      const { info, sessions } = get();
      // console.log("[saveDraft] 當前 store 狀態:", { info, sessions });

      // 只檢查 conTitle
      if (!info.conTitle?.trim()) {
        // console.error("[saveDraft] 演唱會名稱為空");
        return Promise.reject(new Error("演唱會名稱為必填"));
      }

      // 嘗試從多個來源取得 organizationId
      let organizationId = info.organizationId; // 先從 store 中取得

      if (!organizationId) {
        // 如果 store 中沒有，再從網址取得 companyId
        const params = new URLSearchParams(window.location.search);
        const companyId = params.get("companyId");
        if (companyId) {
          organizationId = companyId;
        }
      }

      if (!organizationId) {
        // console.error("[saveDraft] 無法取得組織ID");
        return Promise.reject(new Error("無法取得組織ID"));
      }

      // 動態組 payload
      const payload: Record<string, unknown> = {
        conTitle: info.conTitle.trim(),
        conInfoStatus: info.conInfoStatus || "draft",
        organizationId,
        imgBanner: info.imgBanner,
      };

      // 這三個欄位要 stringify
      ["ticketPurchaseMethod", "precautions", "refundPolicy"].forEach((key) => {
        if (info[key]) {
          try {
            payload[key] = typeof info[key] === "string" ? info[key] : JSON.stringify(info[key]);
          } catch {
            // console.error(`[saveDraft] ${key} 轉換失敗:`, e);
            payload[key] = info[key];
          }
        }
      });

      // 其他欄位直接丟
      ["conIntroduction", "conLocation", "conAddress", "eventStartDate", "eventEndDate", "locationTagId", "musicTagId", "venueId"].forEach((key) => {
        if (info[key]) {
          try {
            payload[key] = info[key];
          } catch {
            // console.error(`[saveDraft] ${key} 處理失敗:`, e);
          }
        }
      });

      // sessions 處理
      payload.sessions = sessions.map((s) => {
        // 確保 sessionDate 只有日期部分
        const sessionDate = s.sessionDate ? s.sessionDate.split("T")[0] : "";

        const sessionData = {
          sessionTitle: s.sessionTitle || "",
          sessionDate: sessionDate || "",
          sessionStart: s.sessionStart || "",
          sessionEnd: s.sessionEnd || "",
          imgSeattable: s.imgSeattable || "",
          ticketTypes: s.ticketTypes.map((t) => ({
            ticketTypeName: t.ticketTypeName || "",
            entranceType: t.entranceType || "",
            ticketBenefits: t.ticketBenefits || "",
            ticketRefundPolicy: t.ticketRefundPolicy || "",
            ticketTypePrice: t.ticketTypePrice ? Number(t.ticketTypePrice) : 0,
            totalQuantity: t.totalQuantity || 0,
            sellBeginDate: t.sellBeginDate || "",
            sellEndDate: t.sellEndDate || "",
          })),
        };
        // console.log("[saveDraft] 處理後的 session 資料:", sessionData);
        return sessionData;
      });

      // console.log("[saveDraft] 準備發送的 payload:", JSON.stringify(payload, null, 2));

      let response: AxiosResponse<ConcertCreateResponse>;
      try {
        if (info.concertId) {
          // 如果已有 concertId，使用 PUT 更新
          response = await axios.put<ConcertCreateResponse>(`${API_BASE_URL}/api/v1/concerts/${info.concertId}`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          // 如果沒有 concertId，使用 POST 新增
          response = await axios.post<ConcertCreateResponse>(`${API_BASE_URL}/api/v1/concerts/`, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      } catch (e) {
        if (axios.isAxiosError(e)) {
          // console.error("[saveDraft] API 錯誤:", {
          //   status: e.response?.status,
          //   data: e.response?.data,
          //   message: e.message,
          // });
        } else {
          // console.error("[saveDraft] 未知錯誤:", e);
        }
        throw e;
      }

      // console.log("[saveDraft] API 回傳資料:", response.data);

      const concertData = response.data.data.concert;
      if (concertData.concertId) {
        // 確保使用 API 回傳的新 imgBanner
        const updatedInfo = {
          ...concertData,
          imgBanner: concertData.imgBanner || "",
        };

        // console.log("[saveDraft] 更新前的 store info:", get().info);
        // console.log("[saveDraft] 準備更新的 info:", updatedInfo);

        set((state) => ({
          info: {
            ...state.info,
            ...updatedInfo,
          },
          sessions: concertData.sessions,
          venue: concertData.venue,
        }));

        // console.log("[saveDraft] 更新後的 store info:", get().info);
        localStorage.setItem("concertId", concertData.concertId);
        return { concertId: concertData.concertId };
      }
      return undefined;
    } catch (error) {
      // console.error("[saveDraft] 完整錯誤:", error);
      return Promise.reject(error);
    }
  },

  uploadImage: async (file: File, uploadContext: UploadContext): Promise<string> => {
    const token = useAuthStore.getState().getAuthToken();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadContext", uploadContext);

    const response = await axios.post<{ status: string; message: string; data: string }>(`${API_BASE_URL}/api/v1/upload/image`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.status === "success") {
      return response.data.data;
    }
    throw new Error(response.data.message || "上傳失敗");
  },

  getConcert: async (concertId: string) => {
    try {
      const response = await axios.get<ConcertResponse>(`${API_BASE_URL}/api/v1/concerts/${concertId}`);

      if (response.data.status === "success" && response.data.data) {
        const concertData = response.data.data;

        // 處理 ticketTypePrice 從字串轉數字，並確保 sessionDate 只有日期部分
        const processedSessions = concertData.sessions.map((session) => ({
          ...session,
          sessionDate: session.sessionDate ? dayjs(session.sessionDate).format("YYYY-MM-DD") : "",
          ticketTypes: session.ticketTypes.map((ticket) => ({
            ...ticket,
            ticketTypePrice: Number(ticket.ticketTypePrice),
          })),
        }));

        // 處理 eventStartDate 和 eventEndDate
        const processedInfo = {
          ...concertData,
          eventStartDate: concertData.eventStartDate ? dayjs(concertData.eventStartDate).format("YYYY-MM-DD") : "",
          eventEndDate: concertData.eventEndDate ? dayjs(concertData.eventEndDate).format("YYYY-MM-DD") : "",
        };

        set((state) => ({
          info: {
            ...state.info,
            concertId: processedInfo.concertId,
            organizationId: processedInfo.organizationId,
            venueId: processedInfo.venueId,
            locationTagId: processedInfo.locationTagId,
            musicTagId: processedInfo.musicTagId,
            conTitle: processedInfo.conTitle,
            conIntroduction: processedInfo.conIntroduction,
            conLocation: processedInfo.conLocation,
            conAddress: processedInfo.conAddress,
            eventStartDate: processedInfo.eventStartDate,
            eventEndDate: processedInfo.eventEndDate,
            ticketPurchaseMethod: processedInfo.ticketPurchaseMethod,
            precautions: processedInfo.precautions,
            refundPolicy: processedInfo.refundPolicy,
            conInfoStatus: processedInfo.conInfoStatus,
            imgBanner: processedInfo.imgBanner,
            reviewStatus: processedInfo.reviewStatus,
            reviewNote: processedInfo.reviewNote,
            visitCount: processedInfo.visitCount,
            promotion: processedInfo.promotion,
            cancelledAt: processedInfo.cancelledAt,
            updatedAt: processedInfo.updatedAt,
            createdAt: processedInfo.createdAt,
          },
          sessions: processedSessions,
          venue: concertData.venue,
        }));

        localStorage.setItem("concertId", concertData.concertId);
      } else {
        return Promise.reject(new Error("取得演唱會資料失敗"));
      }
    } catch (error) {
      // console.error("getConcert error", error);
      return Promise.reject(error);
    }
  },

  getVenues: async () => {
    try {
      const response = await axios.get<VenuesResponse>(`${API_BASE_URL}/api/v1/concerts/venues`);

      if (response.data.status === "success") {
        set({ venues: response.data.data });
      } else {
        return Promise.reject(new Error("取得場館列表失敗"));
      }
    } catch (error) {
      // console.error("getVenues error", error);
      return Promise.reject(error);
    }
  },

  getOrganizationConcerts: async (organizationId: string, page = 1, status?: ConInfoStatus) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const statusQuery = status ? `&status=${status}` : "";
      const response = await axios.get<OrganizationConcertsResponse>(
        `${API_BASE_URL}/api/v1/organizations/${organizationId}/concerts?page=${page}${statusQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        const concerts = response.data.data.concerts;
        set({
          organizationConcerts: concerts,
          organizationConcertsPagination: response.data.data.pagination,
        });
        return concerts;
      } else {
        return Promise.reject(new Error("取得組織演唱會列表失敗"));
      }
    } catch (error) {
      // console.error("getOrganizationConcerts error", error);
      return Promise.reject(error);
    }
  },

  getAllOrganizationConcerts: async (organizationId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      // 先取得第一頁來知道總頁數
      const firstPageResponse = await axios.get<OrganizationConcertsResponse>(
        `${API_BASE_URL}/api/v1/organizations/${organizationId}/concerts?page=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (firstPageResponse.data.status !== "success") {
        return Promise.reject(new Error("取得組織演唱會列表失敗"));
      }

      const totalPages = firstPageResponse.data.data.pagination.totalPages;
      let allConcerts = [...firstPageResponse.data.data.concerts];

      // 如果有多頁，則取得其他頁的資料
      if (totalPages > 1) {
        const otherPagesPromises = Array.from({ length: totalPages - 1 }, (_, i) => {
          const page = i + 2; // 從第二頁開始
          return axios.get<OrganizationConcertsResponse>(`${API_BASE_URL}/api/v1/organizations/${organizationId}/concerts?page=${page}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        });

        const otherPagesResponses = await Promise.all(otherPagesPromises);
        otherPagesResponses.forEach((response) => {
          if (response.data.status === "success") {
            allConcerts = [...allConcerts, ...response.data.data.concerts];
          }
        });
      }

      // 更新 store
      set({
        organizationConcerts: allConcerts,
        organizationConcertsPagination: {
          ...firstPageResponse.data.data.pagination,
          currentPage: 1,
        },
      });

      return allConcerts;
    } catch (error) {
      // console.error("getAllOrganizationConcerts error", error);
      return Promise.reject(error);
    }
  },

  cancelConcert: async (concertId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/concerts/${concertId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("刪除失敗");
      }

      // 重新取得組織的演唱會列表
      const info = get().info;
      if (info.organizationId) {
        await get().getOrganizationConcerts(info.organizationId);
      }
    } catch (error) {
      // console.error("cancelConcert error", error);
      return Promise.reject(error);
    }
  },

  deleteConcert: async (concertId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const response = await axios.patch(
        `${API_BASE_URL}/api/v1/concerts/${concertId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("刪除失敗");
      }

      // 重新取得組織的演唱會列表
      const info = get().info;
      if (info.organizationId) {
        await get().getOrganizationConcerts(info.organizationId);
      }
    } catch (error) {
      // console.error("deleteConcert error", error);
      return Promise.reject(error);
    }
  },

  getConcertStatus: (concertId: string) => {
    const concert = get().organizationConcerts.find((c) => c.concertId === concertId);
    return concert ? (concert.conInfoStatus as ConInfoStatus) : null;
  },

  getConcertStatusCounts: () => {
    const counts: Record<ConInfoStatus, number> = {
      draft: 0,
      reviewing: 0,
      rejected: 0,
      published: 0,
      finished: 0,
    };

    // 只計算當前頁面的實際數量
    get().organizationConcerts.forEach((concert) => {
      const status = concert.conInfoStatus as ConInfoStatus;
      if (status in counts) {
        counts[status]++;
      }
    });

    return counts;
  },

  getLocationTags: async () => {
    try {
      const response = await axios.get<LocationTagsResponse>(`${API_BASE_URL}/api/v1/concerts/location-tags`);
      if (response.data.status === "success") {
        set({ locationTags: response.data.data });
      } else {
        return Promise.reject(new Error("取得地點標籤失敗"));
      }
    } catch (error) {
      // console.error("getLocationTags error", error);
      return Promise.reject(error);
    }
  },

  getMusicTags: async () => {
    try {
      const response = await axios.get<MusicTagsResponse>(`${API_BASE_URL}/api/v1/concerts/music-tags`);
      if (response.data.status === "success") {
        set({ musicTags: response.data.data });
      } else {
        return Promise.reject(new Error("取得音樂標籤失敗"));
      }
    } catch (error) {
      // console.error("getMusicTags error", error);
      return Promise.reject(error);
    }
  },
  // 送審演唱會
  submitConcert: async (concertId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const response = await axios.put(
        `${API_BASE_URL}/api/v1/concerts/${concertId}/submit`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status !== 200) {
        throw new Error("送審失敗");
      }

      // 重新取得組織的演唱會列表
      const info = get().info;
      if (info.organizationId) {
        await get().getOrganizationConcerts(info.organizationId);
      }
    } catch (error) {
      // console.error("submitConcert error", error);
      return Promise.reject(error);
    }
  },
  // 複製演唱會
  cloneConcert: async (concertId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/concerts/${concertId}/duplicate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status !== 201 || response.data.status !== "success") {
        throw new Error("複製失敗");
      }

      // 重新取得組織的演唱會列表
      const info = get().info;
      if (info.organizationId) {
        await get().getOrganizationConcerts(info.organizationId);
      }
    } catch (error) {
      // console.error("cloneConcert error", error);
      return Promise.reject(error);
    }
  },
  // 增加瀏覽次數
  incrementVisitCount: async (concertId: string) => {
    await axios.patch(`${API_BASE_URL}/api/v1/concerts/${concertId}/visit`);
    // try {
    //   await axios.patch(`${API_BASE_URL}/api/v1/concerts/${concertId}/visit`);
    // } catch (error) {
    //   console.error("incrementVisitCount error", error);
    // }
  },
  getConcertReviews: async (concertId: string) => {
    try {
      const token = useAuthStore.getState().getAuthToken();
      if (!token) throw new Error("未登入");

      const response = await axios.get<ConcertReviewsResponse>(`${API_BASE_URL}/api/v1/concerts/${concertId}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.status === "success") {
        set({ concertReviews: response.data.data.reviews });
        return response.data.data.reviews;
      } else {
        return Promise.reject(new Error("取得演唱會審核記錄失敗"));
      }
    } catch (error) {
      // console.error("getConcertReviews error", error);
      return Promise.reject(error);
    }
  },
  getConcertSessions: async (concertId: string) => {
    const token = useAuthStore.getState().getAuthToken();
    if (!token) throw new Error("未登入");
    const response = await axios.get(`${API_BASE_URL}/api/v1/concerts/${concertId}/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.status === "success") {
      set({ concertStatsData: response.data.data });
    }
  },

  getSessionCheckIns: async (sessionId: string, page: number) => {
    const token = useAuthStore.getState().getAuthToken();
    if (!token) throw new Error("未登入");
    const response = await axios.get(`${API_BASE_URL}/api/v1/sessions/${sessionId}/check-inused?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.status === "success") {
      set({ checkInData: response.data.data });
    }
  },
}));
