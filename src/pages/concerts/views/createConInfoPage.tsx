import { useConcertStore } from "../store/useConcertStore";
import { useLocationTags } from "../hook/useLocationTags";
import { useMusicTags } from "../hook/useMusicTags";
import { Layout } from "@/pages/comm/views/layout";
import { BannerUploadSection } from "../components/BannerUploadSection";
import { ConcertBasicInfoSection } from "../components/ConcertBasicInfoSection";
import { ConcertLocationSection } from "../components/ConcertLocationSection";
import { ConcertTagsSection } from "../components/ConcertTagsSection";
import { ConcertDetailsSection } from "../components/ConcertDetailsSection";
import { ConcertFormActions } from "../components/ConcertFormActions";
import { BackToListButton } from "../components/BackToListButton";
import dayjs from "dayjs";
import { useToast } from "@/core/hooks/useToast";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function CreateConInfoPage() {
  const { info, setInfo, saveDraft, getConcert } = useConcertStore();
  const { locationTags, loading: locationLoading, error: locationError } = useLocationTags();
  const { musicTags, loading: musicLoading, error: musicError } = useMusicTags();
  const { toast } = useToast();
  const { concertId } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("/edit/");
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  // 如果是編輯模式，就載入現有資料
  useEffect(() => {
    if (isEditMode && concertId && !info.concertId) {
      getConcert(concertId);
    }
  }, [isEditMode, concertId, getConcert, info.concertId]);

  const handleSaveAndNext = async () => {
    try {
      // 無論是否有 concertId，都先儲存草稿確保資料同步
      const result = await saveDraft();
      const concertId = result?.concertId;

      if (!concertId) {
        toast({
          title: "錯誤",
          description: "儲存草稿失敗，請重試。",
          variant: "destructive",
        });
        return;
      }

      // 確保 store 中有最新的 concertId
      if (concertId !== info.concertId) {
        setInfo({ concertId });
      }

      // 構建查詢參數
      const queryParams = new URLSearchParams();
      queryParams.set("concertId", concertId);
      if (companyId) {
        queryParams.set("companyId", companyId);
      }

      const nextPath = isEditMode
        ? `/concert/edit/${concertId}/sessions-and-tickets`
        : `/concert/create/sessions-and-tickets?${queryParams.toString()}`;
      window.location.href = nextPath;
    } catch {
      // console.error("下一步操作失敗:", error);
      toast({
        title: "錯誤",
        description: "操作失敗，請重試",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="mt-6 w-full bg-[#f3f3f3] px-4 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <BackToListButton companyId={companyId} isEditMode={isEditMode} />
            <h1 className="text-left text-2xl font-bold">{isEditMode ? "編輯演唱會" : "舉辦演唱會"}</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 pt-8 pb-4">
        <nav className="flex items-center space-x-2 text-sm">
          <span className="font-medium text-blue-600">設定演唱會資料</span>
          <span className="text-gray-400">/</span>
          <span className="text-black">基本資料</span>
        </nav>
      </div>

      <BannerUploadSection imgBanner={info.imgBanner} onBannerChange={(url) => setInfo({ imgBanner: url })} />

      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="space-y-8 p-8">
            {/* Event Info */}
            <div>
              <ConcertBasicInfoSection
                conTitle={info.conTitle}
                eventStartDate={info.eventStartDate}
                eventEndDate={info.eventEndDate}
                onTitleChange={(value) => setInfo({ conTitle: value })}
                onStartDateChange={(date) => setInfo({ eventStartDate: date ? dayjs(date).format("YYYY/MM/DD") : "" })}
                onEndDateChange={(date) => setInfo({ eventEndDate: date ? dayjs(date).format("YYYY/MM/DD") : "" })}
              />

              {/* 簡介 */}
              <div className="mt-4">
                <label className="mb-1 block font-medium text-gray-700">
                  簡介<span className="ml-1 text-lg text-red-500">*</span>
                  <span className="text-sm text-gray-400">上限3,000字</span>
                </label>
                <textarea
                  className="w-full rounded border border-gray-300 p-3"
                  rows={4}
                  maxLength={3000}
                  placeholder="請輸入演唱會簡介"
                  value={info.conIntroduction}
                  onChange={(e) => setInfo({ conIntroduction: e.target.value })}
                />
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <ConcertLocationSection
                  venueId={info.venueId}
                  onVenueChange={(venueId, venueName, venueAddress) => {
                    setInfo({
                      venueId,
                      conLocation: venueName,
                      conAddress: venueAddress,
                    });
                  }}
                />

                <ConcertTagsSection
                  locationTags={locationTags}
                  musicTags={musicTags}
                  locationTagId={info.locationTagId}
                  musicTagId={info.musicTagId}
                  locationLoading={locationLoading}
                  musicLoading={musicLoading}
                  locationError={!!locationError}
                  musicError={!!musicError}
                  onLocationTagChange={(value) => setInfo({ locationTagId: value })}
                  onMusicTagChange={(value) => setInfo({ musicTagId: value })}
                />
              </div>
            </div>

            <ConcertDetailsSection
              ticketPurchaseMethod={info.ticketPurchaseMethod}
              precautions={info.precautions}
              refundPolicy={info.refundPolicy}
              onTicketPurchaseMethodChange={(value) => setInfo({ ticketPurchaseMethod: value })}
              onPrecautionsChange={(value) => setInfo({ precautions: value })}
              onRefundPolicyChange={(value) => setInfo({ refundPolicy: value })}
            />

            <ConcertFormActions onSaveAndNext={handleSaveAndNext} isEditMode={isEditMode} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
