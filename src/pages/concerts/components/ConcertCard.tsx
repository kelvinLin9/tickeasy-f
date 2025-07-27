import { ConcertCardProps } from "../types/ConcertCard";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";
export default function ConcertCard(data: ConcertCardProps) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto">
      <div
        onClick={() => navigate(`/concert/${data.id}`)}
        className="relative flex h-[365px] w-[351px] cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-md transition-shadow hover:shadow-lg lg:w-[416px]"
      >
        <div className="relative h-[60%] w-full">
          <img src={data.image} alt={data.title} className="h-full w-full object-cover" />
        </div>
        <div className="h-[40%] w-full space-y-1 px-4 py-4">
          <p className="text-base text-neutral-600">
            {data.startDate} - {data.endDate}
          </p>
          <p className="text-lg font-bold">{data.title}</p>
          <div className="text-primary align-center absolute bottom-2 left-4 flex justify-baseline text-sm">
            <Icon icon="my-map-pin" className="mt-1 mr-1" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 hover:underline"
            >
              {data.location}
            </a>
          </div>
          <div className="border-primary absolute right-4 bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-1">
            <Icon icon="my-arrow-right" className="text-primary text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
