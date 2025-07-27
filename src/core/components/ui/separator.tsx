import { cn } from "@/core/lib/utils";

export default function Separator({ className }: { className?: string }) {
  return <div className={cn("my-4 h-[1px] w-full bg-gray-400", className)}></div>;
}
