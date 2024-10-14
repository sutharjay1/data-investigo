import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { P } from "../ui/typography";

export interface HintProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
}

const Hint = ({
  label,
  children,
  className,
  side = "right",
  align = "center",
  sideOffset = 10,
  alignOffset = 10,
}: HintProps) => {
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        align={align}
        className={cn("z-[500] border-zinc-900 px-2 py-1 text-text", className)}
        alignOffset={alignOffset}
      >
        <P className={cn("font-semibold capitalize")}>{label}</P>
      </TooltipContent>
    </Tooltip>
  );
};

export default Hint;
