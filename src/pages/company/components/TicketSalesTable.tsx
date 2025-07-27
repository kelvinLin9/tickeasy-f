import type { TicketType } from "../types/concertStatus";

interface TicketSalesTableProps {
  ticketTypes: TicketType[];
}

export default function TicketSalesTable({ ticketTypes }: TicketSalesTableProps) {
  return (
    <div className="mb-10">
      <h2 className="mb-4 border-b pb-2 text-xl font-bold text-gray-800">售票情形</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500">
              <th className="py-2 pr-4 font-normal">票種</th>
              <th className="px-4 py-2 font-normal">價格</th>
              <th className="py-2 pl-4 font-normal">剩餘數量/總數量</th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket) => (
              <tr key={ticket.ticketTypeId} className="border-t">
                <td className="py-3 pr-4">{ticket.ticketTypeName}</td>
                <td className="px-4 py-3">{parseInt(ticket.ticketTypePrice, 10)}</td>
                <td className="py-3 pl-4">
                  {ticket.remainingQuantity}/{ticket.totalQuantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
