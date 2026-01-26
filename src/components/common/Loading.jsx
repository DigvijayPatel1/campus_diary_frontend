import { Loader2 } from "lucide-react";

const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
    <p className="text-slate-500 font-medium animate-pulse">Loading NIT Connect...</p>
  </div>
);

export default Loading;