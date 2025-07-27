import { Layout } from "@/pages/comm/views/layout";
// import { useLocation } from "react-router-dom";
import BannerSection from "../components/bannerSection";
import ConcertListSection from "../components/ConcertListSection";
import { ConcertFilterProvider } from "../hook/ConcertFilterContext";

export default function Page() {
  // const location = useLocation();
  return (
    <Layout>
      <ConcertFilterProvider>
        <div className="flex min-h-[calc(100vh-6rem)] flex-col">
          <BannerSection />
          <ConcertListSection />
        </div>
      </ConcertFilterProvider>
    </Layout>
  );
}
