import ProfileAvatar from "./ProfileAvatar";
import DefaultImg from "@/assets/images/bg-user.png";
import { T_Profile } from "../types/porfile";
import { useForm } from "react-hook-form";
import { Input } from "@/core/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select";
import { Button } from "@/core/components/ui/button";
import { SingleDatePicker } from "@/core/components/ui/singleDatePicker";
import { useEffect } from "react";
import ProfilePreferRegions from "./ProfilePreferRegions";
import ProfilePreferEventTypes from "./ProfilePreferEventTypes";
import { formatPreferredRegions } from "../utils/preferredRegions";
import { formatPreferredEventTypes } from "../utils/preferredEventTypes";
import dayjs from "dayjs";
import { useRequest } from "@/core/hooks/useRequest";
import { MusicTypeOption } from "../types/musicType";
import { RegionOption } from "../types/region";
import { CircleCheck, Send } from "lucide-react";
import { ModalVerifyEmail } from "./modalVerifyEmail";

interface ProfileInfoProps {
  isEdit: boolean;
  data: T_Profile;
  onSubmit: (data: T_Profile) => void;
  onCancel: () => void;
  isPending: boolean;
  handleSendVerifyCode: () => void;
  isSendingVerifyCode: boolean;
  isVerifyingEmailCode: boolean;
  setInsertCode: (code: string) => void;
  handleVerifyEmailCode: () => void;
  insertCode: string;
  isInertVerifyCode: boolean;
  setIsInertVerifyCode: (isInertVerifyCode: boolean) => void;
}

export default function ProfileInfo({
  isEdit,
  data,
  onSubmit,
  onCancel,
  isPending,
  handleSendVerifyCode,
  isSendingVerifyCode,
  isVerifyingEmailCode,
  setInsertCode,
  handleVerifyEmailCode,
  insertCode,
  isInertVerifyCode,
  setIsInertVerifyCode,
}: ProfileInfoProps) {
  const { register, watch, setValue, handleSubmit } = useForm<T_Profile>({
    defaultValues: data,
  });
  const { data: MusicOptions } = useRequest<MusicTypeOption>({
    url: "/api/v1/users/profile/event-types",
    queryKey: ["musicType"],
  }).useGet();
  const { data: regionOptions } = useRequest<RegionOption>({
    url: "/api/v1/users/profile/regions",
    queryKey: ["region"],
  }).useGet();

  useEffect(() => {
    // 手动更新所有字段
    Object.keys(data).forEach((key) => {
      setValue(key as keyof T_Profile, data[key as keyof T_Profile]);
    });
  }, [data, setValue]);

  const handleFormSubmit = (formData: T_Profile) => {
    onSubmit(formData); // 呼叫 props 傳進來的 onSubmit
  };

  const renderContent = () => (
    <div className="relative mx-auto mt-2 w-full lg:mt-0">
      {isEdit ? (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex w-full flex-col gap-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">帳號</p>
            <Input
              height={40}
              id="email"
              {...register("email")}
              value={watch("email")}
              onChange={(e) => setValue("email", e.target.value)}
              className="max-w-[300px] flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              inputClass="bg-neutral-300 border-none"
              disabled
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">姓名</p>
            <Input
              height={40}
              id="name"
              {...register("name")}
              value={watch("name") || ""}
              onChange={(e) => setValue("name", e.target.value)}
              className="max-w-[300px] flex-1"
              maxLength={20}
              disabled={isPending}
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">暱稱</p>
            <Input
              height={40}
              id="nickname"
              {...register("nickname")}
              value={watch("nickname") || ""}
              onChange={(e) => setValue("nickname", e.target.value)}
              className="max-w-[300px] flex-1"
              maxLength={20}
              disabled={isPending}
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">手機號碼</p>
            <Input
              height={40}
              id="phone"
              {...register("phone")}
              value={watch("phone") || ""}
              onChange={(e) => setValue("phone", e.target.value)}
              className="max-w-[300px] flex-1"
              maxLength={10}
              placeholder="格式：09xxxxxxxx"
              disabled={isPending}
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">出生年月日</p>
            <SingleDatePicker
              inputClassName=" max-w-[300px] flex-1"
              date={watch("birthday") ? new Date(watch("birthday") as string) : null}
              setDate={(date) =>
                setValue(
                  "birthday",
                  date
                    ? date
                        .toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                        .split("/")
                        .join("-")
                    : null
                )
              }
              defaultMonth={dayjs().subtract(20, "year").startOf("year").toDate()}
              placeholder="請選擇出生年月日"
              disabled={isPending}
              disableFuture
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">生理性別</p>
            <Select
              value={watch("gender") || ""}
              onValueChange={(value) => {
                setValue("gender", value);
              }}
              disabled={isPending}
            >
              <SelectTrigger className="ml-2 max-w-[300px] flex-1 text-base text-neutral-600 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="請選擇性別" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-base text-neutral-600 focus:bg-slate-100 focus:text-neutral-600" value="男">
                  男
                </SelectItem>
                <SelectItem className="text-base text-neutral-600 focus:bg-slate-100 focus:text-neutral-600" value="女">
                  女
                </SelectItem>
                <SelectItem className="text-base text-neutral-600 focus:bg-slate-100 focus:text-neutral-600" value="其他">
                  其他
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex h-[80px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">偏好活動區域</p>
            <ProfilePreferRegions
              disabled={isPending}
              regions={register("preferredRegions")}
              regionOptions={Array.isArray(regionOptions) ? regionOptions : []}
            />
          </div>
          <div
            className="flex items-center"
            style={{
              height: `${Math.max(200, (Array.isArray(MusicOptions) ? MusicOptions.length : 0) * 30 + 20)}px`,
            }}
          >
            <p className="w-[120px] pr-4 text-right font-bold">偏好活動類型</p>
            <ProfilePreferEventTypes
              disabled={isPending}
              eventTypes={register("preferredEventTypes")}
              MusicOptions={Array.isArray(MusicOptions) ? MusicOptions : []}
            />
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">國家／地區</p>
            <Select
              value={watch("country") || ""}
              onValueChange={(value) => {
                setValue("country", value);
              }}
              disabled={isPending}
            >
              <SelectTrigger className="max-w-[300px] flex-1 text-base text-neutral-600 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="請選擇國家／地區" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-base text-neutral-600 focus:bg-slate-100 focus:text-neutral-600" value="台灣">
                  台灣
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">詳細地址</p>
            <Input
              height={40}
              id="address"
              {...register("address")}
              value={watch("address") || ""}
              onChange={(e) => setValue("address", e.target.value)}
              className="max-w-[400px] flex-1"
              maxLength={50}
            />
          </div>
          <div className="flex justify-end gap-4 lg:mt-4 lg:justify-start lg:pl-28">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                // 重置表單數據到原始狀態
                Object.keys(data).forEach((key) => {
                  setValue(key as keyof T_Profile, data[key as keyof T_Profile]);
                });
                onCancel();
              }}
            >
              取消編輯
            </Button>
            <Button type="submit" variant="default" disabled={isPending} onClick={handleSubmit(onSubmit)}>
              {isPending ? "儲存中..." : "儲存會員資料"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mx-auto flex w-full flex-col gap-4 px-4">
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">帳號</p>
            <div className="flex items-center text-sm text-gray-500">
              <p>{data.email}</p>
              <div className="ml-2 flex gap-2 text-xs text-gray-500">
                {data.isEmailVerified ? (
                  <CircleCheck className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="relative flex flex-col gap-2 lg:flex-row">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-sidebar-primary border-sidebar-ring w-[100px] border-1 text-sm hover:shadow-sm"
                      onClick={() => handleSendVerifyCode()}
                      disabled={isSendingVerifyCode}
                    >
                      {isSendingVerifyCode ? "發送中..." : "發送驗證碼"}
                    </Button>
                    {isInertVerifyCode ? (
                      <>
                        <ModalVerifyEmail active={isInertVerifyCode} setIsInertVerifyCode={setIsInertVerifyCode}>
                          <div className="mb-2 flex flex-col items-center">
                            <Input
                              height={40}
                              type="text"
                              className="w-full"
                              placeholder="請輸入驗證碼"
                              value={insertCode}
                              onChange={(e) => setInsertCode(e.target.value)}
                            />
                            <Button className="mt-2 w-[80px] text-sm" onClick={() => handleVerifyEmailCode()} disabled={isVerifyingEmailCode}>
                              <Send className="h-4 w-4" />
                              驗證
                            </Button>
                          </div>
                        </ModalVerifyEmail>
                        <div className="relative flex hidden gap-2 lg:block">
                          <Input
                            height={20}
                            type="text"
                            placeholder="請輸入驗證碼"
                            value={insertCode}
                            onChange={(e) => setInsertCode(e.target.value)}
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="text-secondary absolute -top-1 -right-1 h-5 w-5"
                            onClick={() => setIsInertVerifyCode(false)}
                          >
                            X
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          className="hidden text-sm lg:block"
                          onClick={() => handleVerifyEmailCode()}
                          disabled={isVerifyingEmailCode}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsInertVerifyCode(true)}>
                        輸入驗證碼
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">姓名</p>
            <p className="flex-1 text-sm text-gray-500">{data?.name || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">暱稱</p>
            <p className="flex-1 text-sm text-gray-500">{data?.nickname || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">聯絡方式</p>
            <p className="flex-1 text-sm text-gray-500">{data?.phone || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">出生年月日</p>
            <p className="flex-1 text-sm text-gray-500">{data?.birthday || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">生理性別</p>
            <p className="flex-1 text-sm text-gray-500">{data?.gender || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">偏好活動區域</p>
            <p className="flex-1 text-sm text-gray-500">{formatPreferredRegions(data?.preferredRegions || [])}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">偏好活動類型</p>
            <p className="flex-1 text-sm text-gray-500">{formatPreferredEventTypes(data?.preferredEventTypes || [])}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">國家／地區</p>
            <p className="flex-1 text-sm text-gray-500">{data?.country || "-"}</p>
          </div>
          <div className="flex h-[40px] items-center">
            <p className="w-[120px] pr-4 text-right font-bold">詳細地址</p>
            <p className="flex-1 text-sm text-gray-500">{data?.address || "-"}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative py-4 lg:mx-auto lg:w-[80%] lg:p-4">
      {/* 會員頭像 */}
      <div className="flex justify-center lg:justify-start">
        <ProfileAvatar img={data?.avatar || DefaultImg} />
      </div>
      {/* 會員資訊 */}
      {renderContent()}
    </div>
  );
}
