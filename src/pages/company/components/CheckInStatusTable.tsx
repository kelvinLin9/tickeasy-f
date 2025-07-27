import { Input } from "@/core/components/ui/input";
import { Button } from "@/core/components/ui/button";
import { QrCode, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MappedCheckInRecord } from "../types/concertStatus";

interface CheckInStatusTableProps {
  orders: MappedCheckInRecord[];
  isLoading: boolean;
  concertId?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "purchased":
      return "text-green-600";
    case "used":
      return "text-orange-600";
    case "refunded":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "purchased":
      return "已付款";
    case "used":
      return "已使用";
    case "refunded":
      return "已退款";
    default:
      return status;
  }
};

export default function CheckInStatusTable({ orders, isLoading, concertId }: CheckInStatusTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return orders.filter((order) => {
      return (
        order.orderId.toLowerCase().includes(lowerSearchTerm) ||
        order.purchaserName.toLowerCase().includes(lowerSearchTerm) ||
        order.purchaseTime.toLowerCase().includes(lowerSearchTerm) ||
        order.status.toLowerCase().includes(lowerSearchTerm) ||
        order.ticketTypeName.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [orders, searchTerm]);

  const handleQrCodeClick = () => {
    navigate(`/concert/verify-qrcode${concertId ? `/${concertId}` : ""}`);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col items-start justify-between border-b pb-2 md:flex-row md:items-center">
        <h2 className="mb-2 text-xl font-bold text-gray-800 md:mb-0">報到狀況</h2>
        <Button variant="outline" onClick={handleQrCodeClick}>
          <QrCode className="mr-2 h-4 w-4" />
          掃碼功能
        </Button>
      </div>
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="搜尋訂單編號、購買人、購買時間、狀態、票種"
          className="pl-9"
          height={40}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-lg border bg-white md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500">
              <th className="px-4 py-3 font-medium">訂單編號</th>
              <th className="px-4 py-3 font-medium">購買人</th>
              <th className="px-4 py-3 font-medium">票種</th>
              <th className="px-4 py-3 font-medium">購買時間</th>
              <th className="px-4 py-3 font-medium">狀態</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  讀取中...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center">
                  {searchTerm ? "沒有符合搜尋條件的資料" : "無資料"}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-t">
                  <td className="px-4 py-3 break-all">{order.orderId}</td>
                  <td className="px-4 py-3 break-words">{order.purchaserName}</td>
                  <td className="px-4 py-3 break-words">{order.ticketTypeName}</td>
                  <td className="px-4 py-3 break-words">{order.purchaseTime}</td>
                  <td className={`px-4 py-3 font-semibold break-words ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card */}
      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">讀取中...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-gray-500">{searchTerm ? "沒有符合搜尋條件的資料" : "無資料"}</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.orderId} className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="mr-2 flex-shrink-0 text-sm font-medium text-gray-500">訂單編號</span>
                  <span className="text-right text-sm font-semibold break-all text-gray-900">{order.orderId}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="mr-2 flex-shrink-0 text-sm font-medium text-gray-500">購買人</span>
                  <span className="text-right text-sm break-words text-gray-900">{order.purchaserName}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="mr-2 flex-shrink-0 text-sm font-medium text-gray-500">票種</span>
                  <span className="text-right text-sm break-words text-gray-900">{order.ticketTypeName}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="mr-2 flex-shrink-0 text-sm font-medium text-gray-500">購買時間</span>
                  <span className="text-right text-sm break-words text-gray-900">{order.purchaseTime}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="mr-2 flex-shrink-0 text-sm font-medium text-gray-500">狀態</span>
                  <span className={`text-right text-sm font-semibold break-words ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
