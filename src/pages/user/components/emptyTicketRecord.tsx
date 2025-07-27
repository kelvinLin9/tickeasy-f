import emptyTicketRecord from "@/assets/images/noOrganizer.jpg";
export default function EmptyTicketRecord({ text }: { text: string }) {
  return (
    <div className="mt-10 w-full">
      <p className="text-center text-gray-500">{text}</p>
      <img src={emptyTicketRecord} alt="empty-ticket-record" className="mx-auto my-8" style={{ maxHeight: "300px" }} />
    </div>
  );
}
