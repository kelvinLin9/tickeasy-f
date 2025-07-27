// 客服組件統一導出
export { default as CustomerServiceWidget } from './CustomerServiceWidget';
export { default as CustomerServiceChat } from './CustomerServiceChat';

// 如果需要，也可以導出類型
export type { 
  CustomerServiceWidgetProps,
  CustomerServiceChatProps 
} from '@/core/types/customer-service';
