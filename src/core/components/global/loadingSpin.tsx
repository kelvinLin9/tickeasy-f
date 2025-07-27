interface LoadingSpinProps {
  fullPage?: boolean;
}

export default function LoadingSpin({ fullPage = false }: LoadingSpinProps) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-[#2986cc]"></div>
          <p className="text-lg font-medium text-gray-700">處理中...</p>
        </div>
      </div>
    );
  }

  return (
    // <div className="flex h-40 items-center justify-center">
    //   <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
    // </div>
    <div className="flex min-h-[200px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
    </div>
  );
}
