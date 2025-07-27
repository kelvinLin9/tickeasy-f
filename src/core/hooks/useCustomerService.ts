import { useCallback, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { customerServiceAPI } from "@/core/lib/customer-service-api";
import { useCustomerServiceStore } from "@/store/customer-service";
import { Session } from "@/core/types/customer-service";

export const useCustomerService = () => {
  const {
    messages,
    session,
    // isLoading,
    isConnected,
    addMessage,
    setSession,
    setLoading,
    setConnected,
    updateSession,
    markAllAsRead,
  } = useCustomerServiceStore();

  const retryCount = useRef(0);
  const maxRetries = 3;

  // 錯誤處理函數
  const handleError = useCallback(
    async (retryFn?: () => void) => {
      // console.error('Customer service error:', error);

      // 如果還有重試次數且有重試函數，進行重試
      if (retryCount.current < maxRetries && retryFn) {
        retryCount.current++;
        setTimeout(retryFn, 1000 * retryCount.current); // 遞增延遲
        return;
      }

      // 重試次數用完或沒有重試函數，設定為離線狀態
      setConnected(false);
      addMessage({
        senderType: "bot",
        messageText: "抱歉，連接出現問題。請檢查網路連接或稍後再試。",
        messageType: "text",
      });
    },
    [addMessage, setConnected]
  );

  // 重置重試計數
  const resetRetryCount = useCallback(() => {
    retryCount.current = 0;
    setConnected(true);
  }, [setConnected]);

  // 快速回覆 mutation
  const quickReplyMutation = useMutation({
    mutationFn: ({ message, enableAI = true }: { message: string; enableAI?: boolean }) => customerServiceAPI.quickReply(message, enableAI),
    onSuccess: (response) => {
      if (response.success && response.data) {
        addMessage({
          senderType: "bot",
          messageText: response.data.message,
          messageType: "text",
          metadata: {
            confidence: response.data.data?.confidence,
            strategy: response.data.metadata?.strategy,
            processingTime: response.data.metadata?.processingTime,
          },
        });
        resetRetryCount();
      } else {
        throw new Error(response.message || "回覆失敗");
      }
    },
    onError: () => {
      handleError(() => quickReplyMutation.mutate({ message: quickReplyMutation.variables?.message || "" }));
    },
  });

  // 開始會話 mutation
  const startSessionMutation = useMutation({
    mutationFn: ({
      initialMessage,
      category = "一般諮詢",
      userId,
      skipUserMessage = false,
    }: {
      initialMessage?: string;
      category?: string;
      userId?: string;
      skipUserMessage?: boolean;
    }) => {
      // 如果不跳過用戶訊息且有初始訊息，則添加用戶訊息
      if (!skipUserMessage && initialMessage) {
        addMessage({
          senderType: "user",
          messageText: initialMessage,
          sessionId: undefined, // 會話還未建立
        });
      }
      return customerServiceAPI.startSession({ initialMessage, category, userId });
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        const newSession: Session = {
          sessionId: response.data.sessionId,
          status: response.data.status as "active" | "waiting" | "closed",
          sessionType: response.data.sessionType as "bot" | "human",
          category: response.data.category,
          priority: "normal",
          createdAt: new Date().toISOString(),
          userId: variables.userId,
        };

        setSession(newSession);

        // 如果有機器人回覆，添加機器人訊息
        if (response.data.botMessage) {
          addMessage({
            senderType: "bot",
            messageText: response.data.botMessage.text,
            sessionId: newSession.sessionId,
            metadata: {
              confidence: response.data.botMessage.confidence,
              strategy: response.data.botMessage.strategy,
            },
          });
        }

        resetRetryCount();
      } else {
        throw new Error(response.message || "啟動會話失敗");
      }
    },
    onError: () => {
      handleError(() => startSessionMutation.mutate(startSessionMutation.variables || {}));
    },
  });

  // 發送訊息 mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, message, skipUserMessage = false }: { sessionId: string; message: string; skipUserMessage?: boolean }) => {
      // 如果不跳過用戶訊息，則添加用戶訊息
      if (!skipUserMessage) {
        addMessage({
          senderType: "user",
          messageText: message,
          sessionId: sessionId,
        });
      }
      return customerServiceAPI.sendMessage(sessionId, message);
    },
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        addMessage({
          senderType: "bot",
          messageText: response.data.message,
          sessionId: variables.sessionId,
          metadata: {
            confidence: response.data.confidence,
            strategy: response.data.strategy,
          },
        });

        // 更新會話狀態
        updateSession({
          status: response.data.sessionStatus as "active" | "waiting" | "closed",
        });

        resetRetryCount();
      } else {
        throw new Error(response.message || "發送訊息失敗");
      }
    },
    onError: () => {
      handleError(() => sendMessageMutation.mutate(sendMessageMutation.variables || { sessionId: "", message: "" }));
    },
  });

  // 申請轉接 mutation
  const requestTransferMutation = useMutation({
    mutationFn: ({ sessionId, reason }: { sessionId: string; reason?: string }) => customerServiceAPI.requestTransfer(sessionId, reason),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        addMessage({
          senderType: "bot",
          messageText: `已為您申請人工客服轉接，預計等待時間：${response.data.estimatedWaitTime}`,
          sessionId: variables.sessionId,
        });

        updateSession({
          status: "waiting",
          priority: "high",
        });
      }
    },
    onError: () => {
      // console.error('Transfer request failed:', error);
      addMessage({
        senderType: "bot",
        messageText: "轉接申請失敗，請稍後再試。",
      });
    },
  });

  // 結束會話 mutation
  const closeSessionMutation = useMutation({
    mutationFn: ({ sessionId, rating, comment }: { sessionId: string; rating?: number; comment?: string }) =>
      customerServiceAPI.closeSession(sessionId, rating, comment),
    onSuccess: (response, variables) => {
      if (response.success) {
        addMessage({
          senderType: "bot",
          messageText: "感謝您的評分！會話已結束。如有其他問題歡迎再次聯繫。",
          sessionId: variables.sessionId,
        });

        setSession(null);
      }
    },
    onError: () => {
      // console.error('Close session failed:', error);
    },
  });

  // 健康檢查 query
  const {
    data: healthStatus,
    isError: healthError,
    error: healthErrorDetail,
  } = useQuery({
    queryKey: ["customer-service-health"],
    queryFn: async () => {
      // console.log('🔍 [健康檢查] 開始檢查...', new Date().toLocaleTimeString());
      const result = await customerServiceAPI.healthCheck();
      // console.log('✅ [健康檢查] 成功:', result, new Date().toLocaleTimeString());
      return result;
    },
    refetchInterval: 300000, // 每5分鐘檢查一次
    retry: (failureCount) => {
      // console.log(`🔄 [健康檢查] 重試 ${failureCount}/3:`, error, new Date().toLocaleTimeString());
      return failureCount < 3;
    },
  });

  // Handle health check results with useEffect
  useEffect(() => {
    if (healthError) {
      // console.error('🚨 [健康檢查] 最終失敗，設為斷線:', healthErrorDetail, new Date().toLocaleTimeString());
      setConnected(false);
    } else if (healthStatus) {
      // console.log('🟢 [健康檢查] 最終成功，設為連線:', healthStatus, new Date().toLocaleTimeString());
      setConnected(true);
    }
  }, [healthError, healthErrorDetail, healthStatus, setConnected]);

  // 便捷方法
  const quickReply = useCallback(
    async (message: string, enableAI = true) => {
      if (!message.trim()) return;

      // 添加用戶訊息
      addMessage({
        senderType: "user",
        messageText: message,
        sessionId: session?.sessionId,
      });

      // 發送到後端
      quickReplyMutation.mutate({ message, enableAI });
    },
    [addMessage, session?.sessionId, quickReplyMutation]
  );

  const startSession = useCallback(
    async (initialMessage?: string, category = "一般諮詢", userId?: string) => {
      startSessionMutation.mutate({ initialMessage, category, userId, skipUserMessage: false });
    },
    [startSessionMutation]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!session || !message.trim()) return;

      // 發送到後端（會自動添加用戶訊息）
      sendMessageMutation.mutate({ sessionId: session.sessionId, message, skipUserMessage: false });
    },
    [session, sendMessageMutation]
  );

  const requestTransfer = useCallback(
    async (reason?: string) => {
      if (!session) return;
      requestTransferMutation.mutate({ sessionId: session.sessionId, reason });
    },
    [session, requestTransferMutation]
  );

  const closeSession = useCallback(
    async (rating?: number, comment?: string) => {
      if (!session) return;
      closeSessionMutation.mutate({ sessionId: session.sessionId, rating, comment });
    },
    [session, closeSessionMutation]
  );

  // 標記所有訊息為已讀
  const markAsRead = useCallback(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // 檢查是否正在載入
  const isProcessing =
    quickReplyMutation.isPending ||
    startSessionMutation.isPending ||
    sendMessageMutation.isPending ||
    requestTransferMutation.isPending ||
    closeSessionMutation.isPending;

  // 更新載入狀態
  useEffect(() => {
    setLoading(isProcessing);
  }, [isProcessing, setLoading]);

  // 監控連線狀態變化
  const finalIsConnected = isConnected && !healthError;
  useEffect(() => {
    // console.log('🔌 [連線狀態] 狀態變化:', {
    //   storeIsConnected: isConnected,
    //   healthError: healthError,
    //   healthErrorDetail: healthErrorDetail,
    //   finalIsConnected: finalIsConnected,
    //   timestamp: new Date().toISOString()
    // });
  }, [isConnected, healthError, healthErrorDetail, finalIsConnected]);

  return {
    // 狀態
    messages,
    session,
    isLoading: isProcessing,
    isConnected: finalIsConnected,

    // 操作方法
    quickReply,
    startSession,
    sendMessage,
    requestTransfer,
    closeSession,
    markAsRead,

    // mutation 狀態
    mutations: {
      quickReply: quickReplyMutation,
      startSession: startSessionMutation,
      sendMessage: sendMessageMutation,
      requestTransfer: requestTransferMutation,
      closeSession: closeSessionMutation,
    },

    // 健康狀態
    healthStatus: healthStatus?.data,
  };
};

// 專門用於知識庫搜尋的 hook
export const useKnowledgeSearch = () => {
  const searchMutation = useMutation({
    mutationFn: ({
      query,
      options = {},
    }: {
      query: string;
      options?: {
        limit?: number;
        threshold?: number;
        categories?: string[];
      };
    }) => customerServiceAPI.searchKnowledgeBase(query, options),
  });

  const suggestionsMutation = useMutation({
    mutationFn: ({ query, limit = 5 }: { query: string; limit?: number }) => customerServiceAPI.getQuerySuggestions(query, limit),
  });

  const search = useCallback(
    (query: string, options = {}) => {
      searchMutation.mutate({ query, options });
    },
    [searchMutation]
  );

  const getSuggestions = useCallback(
    (query: string, limit = 5) => {
      suggestionsMutation.mutate({ query, limit });
    },
    [suggestionsMutation]
  );

  return {
    search,
    getSuggestions,
    searchResults: searchMutation.data?.data || [],
    suggestions: suggestionsMutation.data?.data || [],
    isSearching: searchMutation.isPending,
    isLoadingSuggestions: suggestionsMutation.isPending,
    searchError: searchMutation.error,
    suggestionsError: suggestionsMutation.error,
  };
};

export default useCustomerService;
