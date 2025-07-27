import { CategoryCardProps } from "../types/CategoryCard";
import { Link } from "react-router-dom";

export default function CategoryCard(data: CategoryCardProps) {
  return (
    <Link to={data.link} className="block h-full">
      <div className="hover:border-primary relative h-full min-h-[280px] overflow-hidden rounded-lg border-2 border-neutral-200 transition-transform select-none hover:scale-[1.02]">
        <div className="relative h-[60%] w-full lg:h-[70%]">
          <img className="h-full w-full object-cover" src={data.image} alt={data.title} />
        </div>
        <div className="h-[40%]lg:h-[30%] w-full space-y-2 px-1 py-2 lg:p-4">
          <div className="chips flex flex-wrap items-center gap-1 lg:gap-2">
            {data.chips.map((chip, index) => (
              <p key={index} className="bg-primary rounded-full px-3 py-1 text-xs text-white">
                {chip}
              </p>
            ))}
          </div>
          <p className="line-clamp-1 text-xs md:text-sm lg:text-base">{data.title}</p>
        </div>
      </div>
    </Link>
  );
}
