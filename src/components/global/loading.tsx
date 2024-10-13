import { RiLoader2Fill } from "react-icons/ri";
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
      <RiLoader2Fill className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
