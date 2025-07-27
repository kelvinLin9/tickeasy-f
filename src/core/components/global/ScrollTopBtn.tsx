import { Icon } from "@iconify-icon/react";
import { useState, useEffect } from "react";

export default function ScrollTopBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // 初始檢查

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`bg-primary fixed right-3 bottom-25 z-50 flex h-18 w-18 scale-80 cursor-pointer flex-col items-center justify-center gap-y-1 rounded-full text-white transition-all duration-100 select-none hover:bg-neutral-600 lg:right-5 lg:bottom-25 lg:scale-100 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={scrollToTop}
    >
      <Icon icon="my-chevron-up" className="text-sm" />
      <span>TOP</span>
    </div>
  );
}
