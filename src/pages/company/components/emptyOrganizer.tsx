import emptyOrganizer from "@/assets/images/noOrganizer.jpg";
export default function EmptyOrganizer() {
  return (
    <div className="mt-10 w-full">
      <div className="text-center text-xl">您尚未擁有舉辦方，請先建立</div>
      <img src={emptyOrganizer} alt="empty-organizer" className="mx-auto my-8" style={{ maxHeight: "500px" }} />
    </div>
  );
}
