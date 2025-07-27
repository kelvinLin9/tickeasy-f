import footerBlock from "@/assets/images/footerBlock.jpg";
import DeaktopLogo from "@/assets/images/logo-bg.png";
import MobileLogo from "@/assets/images/logo.png";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";
import { TermsDialog } from "./termsDialog";
import { Button } from "@/core/components/ui/button";
export default function Footer() {
  const navigate = useNavigate();
  return (
    <>
      {/* 電腦版 */}
      <footer
        style={{
          backgroundImage: `url(${footerBlock})`,
        }}
        className="mx-auto mt-20 hidden min-h-[570px] bg-cover bg-bottom bg-no-repeat pt-[170px] lg:block"
      >
        <div className="container mx-auto flex h-[240px]">
          {/* 左半區 */}
          <div className="w-[50%]">
            <div className="ml-auto grid h-full w-[70%] grid-cols-2 grid-rows-3 gap-y-3">
              <img className="col-span-2 ml-8 max-w-[320px]" src={DeaktopLogo} alt="Logo" />
              <p className="mt-4">tickeasy@email.com</p>
              <p className="mt-4">週一至週五 10:00~17:00</p>
              <div className="col-span-2 mx-4 border-t border-neutral-200 pt-4">樂票網股份有限公司 © Tickeasy. All Rights Reserved.</div>
            </div>
          </div>
          {/* 右半區 */}
          <div className="w-[50%]">
            <div className="ml-40 grid h-full w-[70%] grid-cols-3">
              <div className="col-span-3 mt-8 flex justify-center gap-x-8">
                <div className="group flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-[var(--line-green)]">
                  <a href="https://www.line.me/tw/" target="_blank" rel="noopener noreferrer">
                    <Icon icon="my-line" className="text-[38px] group-hover:text-white" />
                  </a>
                </div>
                <div className="group hover:bg-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white">
                  <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                    <Icon icon="my-facebook" className="inline-block text-[36px] group-hover:text-white" />
                  </a>
                </div>
                <div className="group flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-red-500">
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    <Icon icon="my-youtube" className="text-[28px] group-hover:text-white" />
                  </a>
                </div>
              </div>
              <p className="empty"></p>
              <p className="cursor-pointer hover:font-bold hover:underline" onClick={() => navigate("/question")}>
                常見問題
              </p>
              <div>
                <TermsDialog
                  title="隱私政策"
                  trigger={
                    <Button variant="link" className="text-md text-foreground h-auto p-0 hover:font-bold hover:underline">
                      隱私政策
                    </Button>
                  }
                  type="privacy"
                ></TermsDialog>
              </div>

              <div className="col-span-3"></div>
            </div>
          </div>
        </div>
      </footer>

      {/* 手機版 */}
      <footer className="mx-auto mt-10 block bg-neutral-100 lg:hidden">
        <div className="grid grid-cols-6 gap-y-4 py-10">
          <div className="col-span-6">
            <img className="mx-auto" src={MobileLogo} alt="Logo" />
          </div>
          <div className="col-span-6 space-y-1 text-center">
            <p>tickeasy@email.com</p>
            <p>週一至週五 10:00~17:00</p>
          </div>
          <div className="col-span-6 flex justify-center gap-x-8">
            <div className="group flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-[var(--line-green)]">
              <a href="https://www.line.me/tw/" target="_blank" rel="noopener noreferrer">
                <Icon icon="my-line" className="text-[38px] group-hover:text-white" />
              </a>
            </div>
            <div className="group hover:bg-primary flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <Icon icon="my-facebook" className="inline-block text-[36px] group-hover:text-white" />
              </a>
            </div>
            <div className="group flex h-16 w-16 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-red-500">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <Icon icon="my-youtube" className="text-[28px] group-hover:text-white" />
              </a>
            </div>
          </div>
          <div className="col-span-3 mx-4 cursor-pointer text-right" onClick={() => navigate("/question")}>
            常見問題
          </div>
          <div className="col-span-3 mx-4 cursor-pointer text-left">
            <TermsDialog
              title="隱私政策"
              trigger={
                <Button variant="link" className="text-md text-foreground h-auto p-0 hover:font-bold hover:underline">
                  隱私政策
                </Button>
              }
              type="privacy"
            ></TermsDialog>
          </div>
          <div className="col-span-6 mx-4 border-t border-neutral-200 pt-4 text-center">樂票網股份有限公司 © Tickeasy. All Rights Reserved.</div>
        </div>
      </footer>
    </>
  );
}
