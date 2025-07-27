import { Layout } from "@/pages/comm/views/layout";
import PaymentResultSection from "../components/PaymentResultSection";
import { BuyTicketProvider } from "../hook/BuyTicketContext";

export default function Page() {
  return (
    <Layout>
      <BuyTicketProvider>
        <div className="min-h-[calc(100vh-6rem)]">
          <PaymentResultSection />
        </div>
      </BuyTicketProvider>
    </Layout>
  );
}
