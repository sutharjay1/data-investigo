import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error" | "warning" | "info";

type AlertProps = {
  title: string;
  description: string;
  type?: AlertType;
};

const Alert = ({ title, description, type = "success" }: AlertProps) => {
  const getAlertStyles = (type: AlertType) => {
    switch (type) {
      case "success":
        return "border-green-900 bg-gradient-to-r from-green-900/60 to-transparent";
      case "error":
        return "border-red-900 bg-gradient-to-r from-red-900/60 to-transparent";
      case "warning":
        return "border-yellow-900 bg-gradient-to-r from-yellow-900/60 to-transparent";
      case "info":
        return "border-blue-900 bg-gradient-to-r from-blue-900/60 to-transparent";
    }
  };

  const getIcon = (type: AlertType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-6 w-6 text-green-300" />;
      case "error":
        return <XCircle className="h-6 w-6 text-red-300" />;
      case "warning":
        return <AlertCircle className="h-6 w-6 text-yellow-300" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-300" />;
    }
  };

  return (
    <div
      className={cn(
        "flex items-start rounded-lg border p-4",
        getAlertStyles(type),
      )}
    >
      <div className="mr-3 flex flex-shrink-0 items-center justify-center">
        {getIcon(type)}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <div className="mt-1 text-sm text-white/90">{description}</div>
      </div>
    </div>
  );
};

export default Alert;
