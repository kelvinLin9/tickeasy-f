import { ImageSection } from "./components/imageSection";
import { NotFoundSection } from "./components/notFoundSection";
import notFound from "@/assets/images/undraw_page-not-found_6wni.svg";
import { Layout } from "./layout";
export default function NotFound() {
  return (
    <Layout>
      <div className="flex grid h-[calc(70vh-3rem)] w-full grid-cols-1 items-center md:h-[calc(90vh-4rem)] md:grid-cols-2">
        <NotFoundSection />
        <ImageSection imageUrl={notFound} alt="page not found" />
      </div>
    </Layout>
  );
}
