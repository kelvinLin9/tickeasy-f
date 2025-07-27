import { useState, useEffect } from "react";
import { Button } from "@/core/components/ui/button";
import { ConfirmDialog } from "@/core/components/global/confirmDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog";

export default function RefundSection({ handleConfirmRefund, isPending }: { handleConfirmRefund: () => Promise<unknown>; isPending: boolean }) {
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);

  // const onRefund = async () => {
  //   await handleConfirmRefund();
  // };
  useEffect(() => {
    if (isPending) {
      setOpenSecond(true);
    } else {
      setOpenFirst(false);
    }
  }, [isPending]);
  return (
    <>
      {/* 第一層 Dialog */}
      <Dialog open={openFirst} onOpenChange={setOpenFirst}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            退票
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>退票注意事項</DialogTitle>
          </DialogHeader>
          <div style={{ whiteSpace: "pre-line" }}>
            {`請詳閱以下退票注意事項：
退票後將不得再使用原先票券，若欲參與需重新購買。
退票申請需於活動開始前完成，逾期恕不受理。
退票將依原付款方式退款，退款作業時間約需 7–14 個工作天。
每筆訂單僅限退票一次，請確認後再行申請。`}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenFirst(false)}>
              取消
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                setOpenSecond(true);
                setOpenFirst(false);
              }}
            >
              {isPending ? "處理中" : "確認退票"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 第二層 Dialog（巢狀） */}
      <ConfirmDialog
        open={openSecond}
        onOpenChange={setOpenSecond}
        isLoading={isPending}
        title="是否確認退票"
        description="退票後將不得再使用原先票券，若欲參與需重新購買。"
        confirmText={isPending ? "處理中" : "確認退票"}
        cancelText="取消"
        onConfirm={() => {
          handleConfirmRefund();
        }}
      />
    </>
  );
}
