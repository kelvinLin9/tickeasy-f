import Header from "@/core/components/global/header";
import Footer from "@/core/components/global/footer";
import ScrollTopBtn from "@/core/components/global/ScrollTopBtn";
import { Outlet } from "react-router-dom";
import Tabs from "../components/Tabs";
export default function Page() {
  return (
    <div className="mt-24 flex h-[calc(100vh-6rem)] flex-col">
      <Header />
      <main className="flex-grow">
        <Tabs />
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
        <Footer />
      </main>
      <ScrollTopBtn />
    </div>
  );
}
