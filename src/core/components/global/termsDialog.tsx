import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";
import { TermService } from "./termService";
import { TermPrivacy } from "./termPrivacy";
interface TermsDialogProps {
  title?: string;
  trigger: React.ReactNode;
  type: "service" | "privacy";
}
const terms = {
  service: {
    title: "服務條款",
    content: <TermService />,
  },
  privacy: {
    title: "隱私政策",
    content: <TermPrivacy />,
  },
};
export const TermsDialog: React.FC<TermsDialogProps> = ({ title, trigger, type }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-hidden">
        <DialogHeader className="sticky top-0 bg-white">
          <DialogTitle>{title || terms[type].title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto py-4">{terms[type].content}</div>
      </DialogContent>
    </Dialog>
  );
};
