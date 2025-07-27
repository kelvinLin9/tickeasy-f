import { VenueCardProps } from "../types/VenueCard";
import { Icon } from "@iconify-icon/react";
import { Button } from "@/core/components/ui/button";
export default function VenueCard(data: VenueCardProps) {
  return (
    <div className="border-primary mx-4 flex h-[600px] max-w-[600px] flex-col rounded-lg border-1 bg-white p-4">
      <div className="relative overflow-hidden rounded-lg">
        {data.image ? (
          <img src={data.image} alt={data.title} className="max-h-[360px] min-h-[200px] w-full object-cover" />
        ) : (
          <div className="flex max-h-[360px] min-h-[200px] w-full items-center justify-center bg-neutral-100">
            <Icon icon="my-image" className="text-4xl text-neutral-400" />
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div className="space-y-4">
          <h5>{data.title}</h5>
          <p className="line-clamp-2 text-neutral-400 lg:line-clamp-none lg:h-[100px]">{data.description}</p>
          <p className="flex items-center gap-2 pt-2 text-neutral-800">
            <span className="flex h-6 w-6 items-center justify-center">
              <Icon icon="my-map-pin" className="text-primary" />
            </span>
            <span>{data.address}</span>
          </p>
          <p className="flex items-center gap-2 text-neutral-800">
            <span className="flex h-6 w-6 items-center justify-center">
              <Icon icon="my-users-alt" className="text-primary" />
            </span>
            <span>可容納人數 : {data.capacity}人</span>
          </p>
          <div className="flex items-center gap-6 text-3xl">
            <span className="flex h-10 w-10 items-center justify-center">
              <Icon icon="my-wheelchair" className="text-primary" />
            </span>
            <span className="flex h-10 w-10 items-center justify-center">
              <Icon icon="my-parking-square" className="text-primary" />
            </span>
            <span className="flex h-10 w-10 items-center justify-center">
              <Icon icon="my-bus" className="text-primary" />
            </span>
          </div>
        </div>
        <a
          className="mt-4 block w-full"
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.title)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="default" className="w-full rounded-full text-lg">
            查看google地圖
          </Button>
        </a>
      </div>
    </div>
  );
}
