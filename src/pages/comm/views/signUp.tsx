import { Layout } from "./layout";
import { ImageSection } from "./components/imageSection";
import { SignupSection } from "./components/signupSection";
import signup from "@/assets/images/undraw_sign-up_z2ku.svg";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/core/hooks/useToast";
export default function Signup() {
  const navigate = useNavigate();
  const isLogin = useAuthStore((state) => state.isLogin);
  useEffect(() => {
    if (isLogin) {
      toast({
        title: "你已登入",
        description: "將回到首頁",
      });
      navigate("/");
    }
  }, []);
  return (
    <Layout>
      <div className="flex grid w-full grid-cols-1 items-center md:h-[calc(100vh-2rem)] md:grid-cols-2">
        <SignupSection />
        <ImageSection imageUrl={signup} alt="signUp" />
      </div>
    </Layout>
  );
}
