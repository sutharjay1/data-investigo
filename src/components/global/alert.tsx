import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error";

type AlertProps = {
  title: string;
  description: string;
  type?: AlertType;
};

const Alert = ({ title, description, type = "success" }: AlertProps) => {
  const isSuccess = type === "success";

  return (
    <div
      className={cn(
        "flex items-start rounded-lg p-4",
        isSuccess
          ? "border border-green-900 bg-gradient-to-r from-green-900/60 to-transparent"
          : "border border-red-900 bg-gradient-to-r from-red-900/60 to-transparent",
      )}
    >
      <div className="mr-3 flex flex-shrink-0 items-center justify-center">
        {isSuccess ? (
          <CheckCircle2 className="h-6 w-6 text-green-300" />
        ) : (
          <XCircle className="h-6 w-6 text-red-300" />
        )}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="mt-1 text-sm text-white/90">{description}</div>
      </div>
    </div>
  );
};

export default Alert;
