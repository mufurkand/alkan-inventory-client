import { LoaderCircle } from "lucide-react";

export default function LoadingBanner({ message }: { message: string }) {
  return (
    <div className="h-64 flex justify-center items-center gap-5">
      <LoaderCircle className="animate-spin" size={32} />
      <p>{message}</p>
    </div>
  );
}
