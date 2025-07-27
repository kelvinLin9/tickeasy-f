import LexicalEditor from "@/core/components/global/lexicalEditor";
import { Concert } from "@/pages/comm/types/Concert";

interface ConcertDetailsSectionProps {
  ticketPurchaseMethod: Concert["ticketPurchaseMethod"];
  precautions: Concert["precautions"];
  refundPolicy: Concert["refundPolicy"];
  onTicketPurchaseMethodChange: (value: Concert["ticketPurchaseMethod"]) => void;
  onPrecautionsChange: (value: Concert["precautions"]) => void;
  onRefundPolicyChange: (value: Concert["refundPolicy"]) => void;
}

export function ConcertDetailsSection({
  ticketPurchaseMethod,
  precautions,
  refundPolicy,
  onTicketPurchaseMethodChange,
  onPrecautionsChange,
  onRefundPolicyChange,
}: ConcertDetailsSectionProps) {
  return (
    <>
      {/* 購票方式 */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="flex items-start font-semibold text-gray-800">
            購票方式<span className="ml-1 text-lg text-red-500">*</span>
          </h3>
          <span className="text-sm text-gray-400">上限1,000字</span>
        </div>
        <LexicalEditor initialContent={ticketPurchaseMethod} onChange={onTicketPurchaseMethodChange} />
      </div>
      {/* 注意事項 */}
      <div>
        <div className="mt-8 mb-1 flex items-center justify-between">
          <h3 className="flex items-start font-semibold text-gray-800">
            注意事項<span className="ml-1 text-lg text-red-500">*</span>
          </h3>
          <span className="text-sm text-gray-400">上限2,000字</span>
        </div>
        <LexicalEditor initialContent={precautions} onChange={onPrecautionsChange} />
      </div>
      {/* 退票注意事項 */}
      <div>
        <div className="mt-8 mb-1 flex items-center justify-between">
          <h3 className="flex items-start font-semibold text-gray-800">
            退票注意事項<span className="ml-1 text-lg text-red-500">*</span>
          </h3>
          <span className="text-sm text-gray-400">上限1,000字</span>
        </div>
        <LexicalEditor initialContent={refundPolicy} onChange={onRefundPolicyChange} />
      </div>
    </>
  );
}
