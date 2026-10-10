import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-32 w-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-7 h-7 text-[#377EE9] animate-spin-slow" />
        <span className="text-xs text-slate-400 font-medium">Loading...</span>
      </div>
    </div>
  );
}
