import React from "react";
import { Button } from "@/core/components/ui/button";
import { X } from "lucide-react";

interface ModalVerifyEmailProps {
  children: React.ReactElement;
  active: boolean;
  setIsInertVerifyCode: (isInertVerifyCode: boolean) => void;
}

export function ModalVerifyEmail({ children, setIsInertVerifyCode }: ModalVerifyEmailProps) {
  return (
    <div className="fixed inset-0 z-50 my-5 block flex items-center justify-center bg-black/50 lg:hidden">
      <div className="max-h-[90vh] w-[80%] overflow-y-auto rounded-lg bg-white px-5 py-4 md:w-[30%] md:p-5">
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            className="p-0 transition-transform duration-500 hover:rotate-[360deg] [&_svg]:size-6"
            onClick={() => setIsInertVerifyCode(false)}
          >
            <X />
          </Button>
        </div>
        <div className="mx-auto flex w-[60%] flex-col items-center justify-center md:w-[80%]">{React.cloneElement(children)}</div>
      </div>
    </div>
  );
}
