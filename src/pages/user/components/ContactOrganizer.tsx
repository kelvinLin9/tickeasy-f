import { Phone, LayoutTemplate, Link, Building2 } from "lucide-react";
import Separator from "@/core/components/ui/separator";
import { organization } from "../types/ticketHistory";

export const ContactOrganizer = ({ organization }: { organization: organization }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="border-primary flex w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-1 p-4 text-center">
          <Building2 className="hidden h-6 w-6 lg:block" />
          公司資訊
          <Separator className="my-2" />
          <p className="">{organization.name}</p>
          <p className="text-sm">{organization.address}</p>
          <p className="text-sm">{organization.phone}</p>
        </div>
        <div className="border-primary flex w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-1 p-4 text-center break-all">
          <LayoutTemplate className="hidden h-6 w-6 lg:block" />
          官方網站
          <Separator className="my-2" />
          <p>{organization.website}</p>
          <a href={organization.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">
            <Link className="hidden h-6 w-6 lg:block" />
          </a>
        </div>
        <div className="border-primary flex w-[200px] flex-col items-center justify-center gap-2 rounded-xl border-1 p-4 text-center break-all">
          <Phone className="hidden h-6 w-6 lg:block" />
          聯絡人
          <Separator className="my-2" />
          <div className="break-all">
            <p>{organization.contact}</p>
            <p className="text-sm">{organization.mobile}</p>
            <a href={`mailto:${organization.mail}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">
              {organization.mail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
