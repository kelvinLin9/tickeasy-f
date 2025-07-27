import Header from "@/core/components/global/header";
import Footer from "@/core/components/global/footer";
import ScrollTopBtn from "@/core/components/global/ScrollTopBtn";
import { useLocation } from "react-router-dom";
export default function Page() {
  const location = useLocation();
  const searchText = location.state?.searchText;
  return (
    <div className="mt-24 flex h-[calc(100vh-6rem)] flex-col pb-[400px]">
      <Header />
      <main className="flex-grow">
        我是演唱會收尋 ， 首頁的參數: {searchText}
        <Footer />
      </main>
      <ScrollTopBtn />
    </div>
  );
}
