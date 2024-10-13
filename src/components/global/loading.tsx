import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const Loading = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-screen w-full items-center justify-center",
        className,
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
