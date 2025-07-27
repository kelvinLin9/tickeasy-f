import { Button } from "@/core/components/ui/button";
import { Pencil, Copy, Trash2, BarChart } from "lucide-react";

interface ConcertCardProps {
  imageUrl: string;
  title: string;
  startDate: string;
  endDate: string;
  status: "draft" | "published" | "finished";
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  onCheckSales?: () => void;
}

export function ConcertCard({ imageUrl, title, startDate, endDate, status, onEdit, onCopy, onDelete, onCheckSales }: ConcertCardProps) {
  return (
    <div className="mx-auto flex w-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm md:flex-row">
      <div className="h-48 w-full md:h-auto md:w-48 md:shrink-0">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <h3 className="mb-1 text-base font-semibold sm:text-lg">{title}</h3>
          <p className="text-xs text-gray-500 sm:text-sm">{startDate === endDate ? startDate : `${startDate} - ${endDate}`}</p>
        </div>
        <div className="mt-3 flex justify-end gap-1 sm:gap-2 md:mt-0">
          {status === "draft" && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onEdit}>
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onCopy}>
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onDelete}>
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
          {status === "published" && (
            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onCheckSales}>
              <BarChart className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          )}
          {status === "finished" && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onCheckSales}>
                <BarChart className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={onCopy}>
                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
