// API 響應類型
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 訊息相關類型
export interface Message {
  id: string;
  sessionId?: string;
  senderType: "user" | "bot" | "agent";
  senderId?: string;
  messageText: string;
  messageType: "text" | "image" | "file" | "quick_reply";
  metadata?: MessageMetadata;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MessageMetadata {
  confidence?: number;
  faqId?: number;
  intentType?: string;
  sentiment?: "positive" | "neutral" | "negative";
  transferReason?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  quickReplies?: string[];
  suggestions?: FaqSuggestion[];
  processingTime?: number;
  model?: string;
  tokens?: number;
  responseId?: string;
  strategy?: string;
}

export interface FaqSuggestion {
  faqId: number;
  question: string;
  confidence: number;
}

// 會話相關類型
export interface Session {
  sessionId: string;
  userId?: string;
  sessionType: "bot" | "human" | "mixed";
  status: "active" | "waiting" | "closed" | "transferred";
  agentId?: string;
  priority: "low" | "normal" | "high" | "urgent";
  category: string;
  firstResponseAt?: string;
  createdAt: string;
  closedAt?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  messages?: Message[];
  messageCount?: number;
}

// 智能回覆相關類型
export interface SmartReplyResponse {
  type: "tutorial" | "faq" | "neutral" | "ai_fallback";
  message: string;
  tutorial?: {
    title: string;
    url: string;
    description?: string;
  };
  faq?: {
    answer: string;
    faqId?: string;
    relatedQuestions?: string[];
  };
  data?: {
    confidence?: number;
    customerServiceEmail?: string;
  };
  metadata: {
    matchedKeywords?: string[];
    processingTime: number;
    strategy: string;
    ruleId?: string;
  };
}

// 知識庫相關類型
export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags: string[];
  isActive: boolean;
  hasEmbedding: boolean;
  similarity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  similarity: number;
  type: "knowledge_base" | "faq";
  category?: string;
  keywords?: string[];
}

// 客服組件 Props 類型
export interface CustomerServiceWidgetProps {
  position?: "bottom-right" | "bottom-left";
  theme?: "light" | "dark";
  primaryColor?: string;
  userId?: string;
  userInfo?: Record<string, unknown>;
}

export interface CustomerServiceChatProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  initialCategory?: string;
  initialMessage?: string;
}

// 快速回覆選項
export interface QuickReplyOption {
  text: string;
  category: string;
  action?: () => void;
}

// 客服狀態類型
export interface CustomerServiceState {
  isOpen: boolean;
  messages: Message[];
  session: Session | null;
  isLoading: boolean;
  isConnected: boolean;
  unreadCount: number;
  quickReplies: QuickReplyOption[];
}
