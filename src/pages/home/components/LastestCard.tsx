import { LastestCardProps } from "../types/LastestCard";
import { Icon } from "@iconify-icon/react";
import { useNavigate } from "react-router-dom";
export default function LastestCard(data: LastestCardProps) {
  const navigate = useNavigate();
  return (
    <div className="mx-auto">
      <div className="relative flex h-[280px] w-[416px] flex-col overflow-hidden rounded-2xl border-2 border-neutral-200 bg-white shadow-md">
        <div className="relative h-[60%] w-full">
          <img src={data.image} alt={data.title} className="h-full w-full object-cover" />
        </div>
        <div className="flex h-[40%] w-full items-end justify-between px-4 py-2">
          <div>
            <p className="text-base text-neutral-600">{data.date}</p>
            <p className="text-lg font-bold">{data.title}</p>
            <p className="text-primary align-center flex items-center text-sm">
              <Icon icon="my-map-pin" className="mt-1 mr-1" />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-600 hover:underline"
              >
                {data.location}
              </a>
            </p>
          </div>
          <div
            onClick={() => navigate(`/concert/${data.id}`)}
            className="border-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-1"
          >
            <Icon icon="my-arrow-right" className="text-primary text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
