import { Card as RadixCard, Text, Box } from "@radix-ui/themes";
import { Link } from "react-router-dom";
import building from "@/assets/images/building.svg";

export default function CompanyCard({ title, companyId }: { title: string; companyId: string }) {
  return (
    <Link to={`/companyDetail?companyId=${companyId}`} style={{ display: "block" }}>
      <RadixCard size="2" className="border-primary my-4 border shadow-lg transition-shadow duration-300 hover:shadow-xs">
        <Box style={{ position: "relative" }}>
          <img src={building} alt="building" style={{ height: "50px" }} className="inline-block" />
          <Text
            as="p"
            size="5"
            weight="bold"
            mb="2"
            className="z-index-10 gap-2 pl-2 text-center"
            style={{
              position: "absolute",
              top: "50%",
              left: "10%",
              transform: "translate(0%, -50%)",
              cursor: "pointer",
              zIndex: 999,
              color: "primary",
            }}
          >
            {title}
          </Text>
        </Box>
      </RadixCard>
    </Link>
  );
}
