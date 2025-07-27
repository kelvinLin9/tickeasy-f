import React, { useState } from "react";
import { MessageCircle, X, Bot } from "lucide-react";
import {
  useCustomerServiceIsOpen,
  useCustomerServiceUnreadCount,
  useCustomerServiceToggleChat,
  useCustomerServiceCloseChat,
} from "@/store/customer-service";
import CustomerServiceChat from "./CustomerServiceChat";

interface CustomerServiceWidgetProps {
  position?: "bottom-right" | "bottom-left";
  theme?: "light" | "dark";
  primaryColor?: string;
  userId?: string;
  userInfo?: Record<string, unknown>;
}

const CustomerServiceWidget: React.FC<CustomerServiceWidgetProps> = ({
  position = "bottom-right",
  theme = "light",
  primaryColor = "#3b82f6",
  userId,
  userInfo,
}) => {
  const isOpen = useCustomerServiceIsOpen();
  const unreadCount = useCustomerServiceUnreadCount();
  const toggleChat = useCustomerServiceToggleChat();
  const closeChat = useCustomerServiceCloseChat();
  const [isHovered, setIsHovered] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
  };

  const themeClasses = {
    light: {
      bg: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
      shadow: "shadow-lg",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-white",
      border: "border-gray-700",
      shadow: "shadow-2xl",
    },
  };

  const currentTheme = themeClasses[theme];

  return (
    <>
      {/* 客服聊天視窗 */}
      {isOpen && (
        <div
          className={`fixed ${positionClasses[position]} z-50`}
          style={{ bottom: "5rem" }} // 避免與按鈕重疊
        >
          <CustomerServiceChat isOpen={isOpen} onClose={closeChat} userId={userId} userInfo={userInfo} />
        </div>
      )}

      {/* 浮動客服按鈕 */}
      <div className={`fixed ${positionClasses[position]} z-40`}>
        {!isOpen ? (
          // 客服按鈕
          <button
            onClick={toggleChat}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative h-14 w-14 rounded-full ${currentTheme.bg} ${currentTheme.border} border ${currentTheme.shadow} group transition-all duration-300 ease-in-out hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:outline-none`}
            style={{
              backgroundColor: isHovered ? primaryColor : undefined,
              // focusRingColor: primaryColor,
            }}
            aria-label="開啟客服聊天"
          >
            {/* 未讀訊息徽章 */}
            {unreadCount > 0 && (
              <div
                className="absolute -top-2 -right-2 flex h-6 w-6 animate-pulse items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
                aria-label={`${unreadCount} 則未讀訊息`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </div>
            )}

            {/* 圖標 */}
            <div className="flex h-full w-full items-center justify-center">
              <MessageCircle className={`h-7 w-7 ${isHovered ? "text-white" : currentTheme.text} transition-colors duration-200`} />
            </div>

            {/* 懸停提示 */}
            {isHovered && (
              <div
                className={`absolute ${position === "bottom-right" ? "right-full mr-3" : "left-full ml-3"} bottom-0 px-3 py-2 ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border} animate-fadeIn rounded-lg border text-sm whitespace-nowrap shadow-lg`}
              >
                需要幫助嗎？
                <div
                  className={`absolute top-1/2 -translate-y-1/2 transform ${position === "bottom-right" ? "left-full" : "right-full"} h-0 w-0 border-4 ${
                    position === "bottom-right" ? "border-r-transparent border-l-gray-200" : "border-r-gray-200 border-l-transparent"
                  } border-t-transparent border-b-transparent`}
                />
              </div>
            )}
          </button>
        ) : (
          // 關閉按鈕（當聊天開啟時）
          <button
            onClick={closeChat}
            className={`h-14 w-14 rounded-full bg-gray-600 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none`}
            aria-label="關閉客服聊天"
          >
            <X className="mx-auto h-7 w-7" />
          </button>
        )}

        {/* 在線狀態指示器 */}
        <div className="absolute -top-1 -right-1">
          <div className="relative">
            <div className="h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500" />
            <div className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-green-500 opacity-75" />
          </div>
        </div>
      </div>

      {/* 客服狀態信息（可選顯示） */}
      {isHovered && !isOpen && (
        <div
          className={`fixed ${position === "bottom-right" ? "right-6 bottom-24" : "bottom-24 left-6"} z-30 px-4 py-3 ${currentTheme.bg} ${currentTheme.border} animate-slideUp max-w-xs rounded-lg border shadow-lg`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Bot className={`h-5 w-5 ${currentTheme.text}`} />
            </div>
            <div>
              <h4 className={`text-sm font-medium ${currentTheme.text}`}>智能客服</h4>
              <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"} mt-1`}>24小時線上為您服務</p>
            </div>
          </div>

          {/* 移除了 "現在有客服人員在線" 的文字 */}
        </div>
      )}
    </>
  );
};

// CSS 動畫類（添加到全局樣式中）
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.3s ease-out forwards;
  }
`;

// 如果需要，可以將樣式注入到頁面中
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

export default CustomerServiceWidget;
