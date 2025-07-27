import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Message, Session, QuickReplyOption, CustomerServiceState } from "@/core/types/customer-service";

interface CustomerServiceActions {
  // UI 控制
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;

  // 訊息管理
  addMessage: (message: Partial<Message>) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  markAllAsRead: () => void;

  // 會話管理
  setSession: (session: Session | null) => void;
  updateSession: (updates: Partial<Session>) => void;

  // 狀態控制
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;

  // 快速回覆
  setQuickReplies: (replies: QuickReplyOption[]) => void;
  addQuickReply: (reply: QuickReplyOption) => void;

  // 重置所有狀態
  reset: () => void;
}

interface CustomerServiceStore extends CustomerServiceState, CustomerServiceActions {}

// 預設快速回覆選項
const DEFAULT_QUICK_REPLIES: QuickReplyOption[] = [
  { text: "如何購買門票？", category: "購票" },
  { text: "退票政策說明", category: "退票" },
  { text: "如何舉辦演唱會？", category: "演唱會" },
  { text: "付款方式查詢", category: "付款" },
  { text: "演唱會時間地點", category: "活動資訊" },
];

// 初始狀態
const initialState: CustomerServiceState = {
  isOpen: false,
  messages: [],
  session: null,
  isLoading: false,
  isConnected: true,
  unreadCount: 0,
  quickReplies: DEFAULT_QUICK_REPLIES,
};

export const useCustomerServiceStore = create<CustomerServiceStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // UI 控制
      toggleChat: () => {
        const { isOpen } = get();
        set({ isOpen: !isOpen });

        // 打開聊天時重置未讀計數
        if (!isOpen) {
          set({ unreadCount: 0 });
        }
      },

      openChat: () => {
        set({ isOpen: true, unreadCount: 0 });
      },

      closeChat: () => {
        set({ isOpen: false });
      },

      // 訊息管理
      addMessage: (messageData: Partial<Message>) => {
        const newMessage: Message = {
          id: messageData.id || `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sessionId: messageData.sessionId,
          senderType: messageData.senderType || "user",
          senderId: messageData.senderId,
          messageText: messageData.messageText || "",
          messageType: messageData.messageType || "text",
          metadata: messageData.metadata,
          isRead: messageData.isRead ?? false,
          createdAt: messageData.createdAt || new Date().toISOString(),
          updatedAt: messageData.updatedAt || new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // 如果是機器人或客服的訊息且聊天視窗未開啟，增加未讀計數
        const { isOpen } = get();
        if (!isOpen && newMessage.senderType !== "user") {
          set((state) => ({
            unreadCount: state.unreadCount + 1,
          }));
        }
      },

      updateMessage: (messageId: string, updates: Partial<Message>) => {
        set((state) => ({
          messages: state.messages.map((msg) => (msg.id === messageId ? { ...msg, ...updates, updatedAt: new Date().toISOString() } : msg)),
        }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      markAllAsRead: () => {
        set((state) => ({
          messages: state.messages.map((msg) => ({ ...msg, isRead: true })),
          unreadCount: 0,
        }));
      },

      // 會話管理
      setSession: (session: Session | null) => {
        set({ session });
      },

      updateSession: (updates: Partial<Session>) => {
        set((state) => ({
          session: state.session ? { ...state.session, ...updates } : null,
        }));
      },

      // 狀態控制
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setConnected: (connected: boolean) => {
        // const prevConnected = get().isConnected;
        // console.log('🔌 [Store] setConnected 呼叫:', {
        //   from: prevConnected,
        //   to: connected,
        //   timestamp: new Date().toISOString(),
        //   stack: new Error().stack?.split('\n').slice(1, 4).join('\n') // 只顯示前几層呼叫堆栈
        // });
        set({ isConnected: connected });
      },

      incrementUnreadCount: () => {
        set((state) => ({
          unreadCount: state.unreadCount + 1,
        }));
      },

      resetUnreadCount: () => {
        set({ unreadCount: 0 });
      },

      // 快速回覆
      setQuickReplies: (replies: QuickReplyOption[]) => {
        set({ quickReplies: replies });
      },

      addQuickReply: (reply: QuickReplyOption) => {
        set((state) => ({
          quickReplies: [...state.quickReplies, reply],
        }));
      },

      // 重置所有狀態
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "customer-service-store",
      // 只在開發環境啟用 devtools
      enabled: import.meta.env.DEV,
    }
  )
);

// 安全的 selector hooks - 使用個別屬性選擇器避免無限循環
export const useCustomerServiceIsOpen = () => useCustomerServiceStore((state) => state.isOpen);
export const useCustomerServiceUnreadCount = () => useCustomerServiceStore((state) => state.unreadCount);
export const useCustomerServiceIsLoading = () => useCustomerServiceStore((state) => state.isLoading);
export const useCustomerServiceIsConnected = () => useCustomerServiceStore((state) => state.isConnected);
export const useCustomerServiceToggleChat = () => useCustomerServiceStore((state) => state.toggleChat);
export const useCustomerServiceOpenChat = () => useCustomerServiceStore((state) => state.openChat);
export const useCustomerServiceCloseChat = () => useCustomerServiceStore((state) => state.closeChat);

export const useCustomerServiceMessages = () => useCustomerServiceStore((state) => state.messages);
export const useCustomerServiceAddMessage = () => useCustomerServiceStore((state) => state.addMessage);
export const useCustomerServiceUpdateMessage = () => useCustomerServiceStore((state) => state.updateMessage);
export const useCustomerServiceClearMessages = () => useCustomerServiceStore((state) => state.clearMessages);
export const useCustomerServiceMarkAllAsRead = () => useCustomerServiceStore((state) => state.markAllAsRead);

export const useCustomerServiceSession = () => useCustomerServiceStore((state) => state.session);
export const useCustomerServiceSetSession = () => useCustomerServiceStore((state) => state.setSession);
export const useCustomerServiceUpdateSession = () => useCustomerServiceStore((state) => state.updateSession);

export const useCustomerServiceQuickReplies = () => useCustomerServiceStore((state) => state.quickReplies);
export const useCustomerServiceSetQuickReplies = () => useCustomerServiceStore((state) => state.setQuickReplies);
export const useCustomerServiceAddQuickReply = () => useCustomerServiceStore((state) => state.addQuickReply);

// 組合 hooks 為了方便使用（但這些可能不安全，建議使用上面的個別 hooks）
export const useCustomerServiceUI = () => {
  const isOpen = useCustomerServiceIsOpen();
  const unreadCount = useCustomerServiceUnreadCount();
  const isLoading = useCustomerServiceIsLoading();
  const isConnected = useCustomerServiceIsConnected();
  const toggleChat = useCustomerServiceToggleChat();
  const openChat = useCustomerServiceOpenChat();
  const closeChat = useCustomerServiceCloseChat();

  return {
    isOpen,
    unreadCount,
    isLoading,
    isConnected,
    toggleChat,
    openChat,
    closeChat,
  };
};

// 匯出預設 store，方便直接使用
export default useCustomerServiceStore;
