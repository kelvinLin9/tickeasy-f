// TODO: 能夠編輯頭像 上傳圖片給後端暫存
// import { Icon } from "@iconify/react";
export default function ProfileAvatar({ img }: { img: string }) {
  return (
    <div className="relative z-10 overflow-hidden lg:absolute lg:top-[10%] lg:right-[10%] lg:scale-180">
      <div className="h-full w-full overflow-hidden rounded-full">
        <img src={img} className="h-[96px] w-[96px] object-cover" />
      </div>
      {/* <Icon icon="ic:round-camera-alt" className="absolute -right-0 bottom-0 cursor-pointer text-[20px] text-[#222777] opacity-70" /> */}
    </div>
  );
}
