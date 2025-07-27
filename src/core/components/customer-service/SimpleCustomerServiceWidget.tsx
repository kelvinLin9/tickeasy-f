import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface SimpleCustomerServiceWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
}

const SimpleCustomerServiceWidget: React.FC<SimpleCustomerServiceWidgetProps> = ({
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount] = useState(0);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
  };

  return (
    <>
      {/* 簡化版聊天視窗 */}
      {isOpen && (
        <div className={`fixed ${positionClasses[position]} z-50`} style={{ bottom: '5rem' }}>
          <div className="w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
              <h3 className="font-semibold text-gray-800">Tickeasy 客服</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <p className="text-gray-600">客服系統初始化中...</p>
            </div>
          </div>
        </div>
      )}

      {/* 浮動客服按鈕 */}
      <div className={`fixed ${positionClasses[position]} z-40`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:scale-110 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="開啟客服聊天"
        >
          {/* 未讀訊息徽章 */}
          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}

          {/* 圖標 */}
          <MessageCircle className="w-7 h-7 mx-auto" />

          {/* 在線狀態指示器 */}
          <div className="absolute -top-1 -right-1">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        </button>
      </div>
    </>
  );
};

export default SimpleCustomerServiceWidget;
