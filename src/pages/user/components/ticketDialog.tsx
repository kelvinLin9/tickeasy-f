import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { ContactOrganizer } from "./ContactOrganizer";
import { ContactCustomerService } from "./ContactCustomerService";
import { TicketDetail } from "./TicketDetail";
import { orderTicket, organization, ticketHistoryItem } from "../types/ticketHistory";

interface TicketDialogProps {
  trigger: React.ReactNode;
  type: "contactOrganizer" | "contactCustomerService" | "ticketDetail";
  organization?: organization;
  ticketData?: ticketHistoryItem;
  orderTicket?: orderTicket;
}
const typesDialog = {
  contactOrganizer: (organization: organization) => ({
    title: "聯絡主辦單位",
    content: <ContactOrganizer organization={organization} />,
  }),
  contactCustomerService: () => ({
    title: "聯絡客服",
    content: <ContactCustomerService />,
  }),
  ticketDetail: (ticketData?: ticketHistoryItem, orderTicket?: orderTicket) => ({
    title: "票券詳細資訊",
    content: <TicketDetail ticketData={ticketData} orderTicket={orderTicket} />,
  }),
};
export const TicketDialog: React.FC<TicketDialogProps> = ({ trigger, type, organization, ticketData, orderTicket }) => {
  const dialogData =
    type === "contactOrganizer"
      ? typesDialog.contactOrganizer(organization!)
      : type === "ticketDetail"
        ? typesDialog.ticketDetail(ticketData, orderTicket)
        : typesDialog.contactCustomerService();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden">
        <DialogHeader className="sticky top-0 bg-white">
          <DialogTitle>{dialogData.title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto py-4">{dialogData.content}</div>
      </DialogContent>
    </Dialog>
  );
};
