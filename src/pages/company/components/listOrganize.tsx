import document from "@/assets/images/document.jpg";
import CompanyCard from "./companyCard";
import { CompanyData } from "../types/company";
export default function ListOrganize({ companyList }: { companyList: CompanyData[] }) {
  return (
    <div className="mx-auto h-full w-full lg:w-[40%]">
      <div className="border-grey-500 mt-8 flex min-h-[500px] flex-col items-center rounded-sm border-2 px-8 py-4 lg:relative lg:flex-row">
        <div className="lg:absolute lg:top-20 lg:-left-20">
          <img src={document} alt="Create Organizer" style={{ maxHeight: "200px" }} />
        </div>
        <div className="ga-4 w-full lg:mt-5 lg:ml-30">
          {companyList.map((company) => (
            <CompanyCard key={company.organizationId} title={company.orgName} companyId={company.organizationId} />
          ))}
        </div>
      </div>
    </div>
  );
}
