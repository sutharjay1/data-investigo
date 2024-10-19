import { CardBody } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, WavesIcon } from "lucide-react";

interface ResponseTimeStatsProps {
  min: string;
  max: string;
  avg: string;
}

const ResponseTimeStats: React.FC<ResponseTimeStatsProps> = ({ min, max, avg }) => {
  return (
    <CardBody className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-y-0 px-2 md:flex-row md:justify-between md:px-4">
      <div className="flex w-full items-center gap-2 md:w-auto md:items-center">
        <WavesIcon className="h-8 w-12 text-blue-400" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-text">{avg}ms</span>
          <span className="text-sm text-gray-400">Average</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 md:w-auto md:items-center">
        <ArrowDownIcon className="h-8 w-12 text-green-400" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-text">{min}ms</span>
          <span className="text-sm text-gray-400">Minimum</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 md:w-auto md:items-center">
        <ArrowUpIcon className="h-8 w-8 text-red-400" />
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-text">{max}ms</span>
          <span className="text-sm text-gray-400">Maximum</span>
        </div>
      </div>
    </CardBody>
  );
};

export default ResponseTimeStats;
