import Alert from "@/components/global/alert";
import Hint from "@/components/global/hint";
import InnerLayout from "@/components/global/inner-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardBody,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Ripple from "@/components/ui/ripple";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Edit,
  MoreVertical,
  PauseIcon,
  PlayIcon,
  RefreshCcw,
  TrashIcon,
  WavesIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RiLoader2Fill } from "react-icons/ri";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import TagDialog from "./_components/tag-dialog";
import { ResponseBody, siteDropdownItems } from "./monitor-domain";

export interface SiteInfo {
  id: number;
  maintenance: boolean;
  paused: boolean;
  last_checked: string | null;
  interval: number;
  status: string;
  created_at: string;
  name: string;
  url: string[];
  friendly_name: string;
  tags: string[];
  response_time: {
    min: string;
    max: string;
    avg: string;
  };
  status_records_last_24_hours: Array<{
    status: string;
    response_time: string;
    timestamp: string;
  }>;
  next_check_time: string;
}

const fetchSiteInfo = async (
  protocol: string,
  domain: string,
): Promise<SiteInfo> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/site_info?protocol=${protocol}&domain=${domain}`,
  );
  return response.data.site_info;
};

const pauseResumeSite = async ({
  protocol,
  domain,
  action,
}: {
  protocol: string;
  domain: string;
  action: "pause" | "resume";
}): Promise<SiteInfo> => {
  const endpoint = action === "pause" ? "/pause_site" : "/resume_site";

  // Use URLSearchParams to format the request body
  const formData = new URLSearchParams();
  formData.append("protocol", protocol);
  formData.append("domain", domain);

  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}${endpoint}`,
    formData, // Send form data instead of JSON
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  return response.data.site_info;
};

const removeSite = async ({
  protocol,
  domain,
}: {
  protocol: string;
  domain: string;
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/remove_site`,
    { protocol, domain },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    },
  );
  return response.data;
};

const resetSite = async ({
  protocol,
  domain,
}: {
  protocol: string;
  domain: string;
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/reset_site_stats`,
    { protocol, domain },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    },
  );
  return response.data;
};

export default function MonitorID() {
  const { id: monitorDomain } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const searchParams = new URLSearchParams(location.search);
  const protocol = searchParams.get("protocol");
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!searchParams.get("protocol")) {
      searchParams.set("protocol", "https");
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, []);

  const fetchSiteInfo = async (): Promise<SiteInfo> => {
    const response = await axios.get(
      `${import.meta.env.VITE_DOMAIN_URL}/site_info?protocol=${protocol}&domain=${monitorDomain}`,
    );
    return response.data.site_info;
  };

  const {
    data: siteInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SiteInfo, Error>({
    queryKey: ["site_info", monitorDomain, protocol],
    queryFn: fetchSiteInfo,
    enabled: !!protocol,
  });

  const pauseSite = async (variables: {
    protocol: string;
    domain: string;
  }): Promise<SiteInfo> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DOMAIN_URL}/pause_site`,
        {
          protocol: variables.protocol,
          domain: variables.domain,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      return response.data.site_info;
    } catch (error: any) {
      console.error(
        "Error pausing site:",
        error.response?.data || error.message,
      );
      throw error;
    }
  };

  const {
    mutate: pauseSiteMutate,
    isPending: isLoadingPause,
    isError: isErrorPause,
    error: pauseError,
  } = useMutation({
    mutationFn: pauseSite,
  });

  const handlePauseSite = () => {
    const action = siteInfo?.paused ? "resume" : "pause";

    const formData = new URLSearchParams();
    formData.append("protocol", protocol!);
    formData.append("domain", monitorDomain!);

    pauseSiteMutate({
      domain: monitorDomain!,
      protocol: protocol!,
    });
  };

  const pauseResumeMutation = useMutation({
    mutationFn: pauseResumeSite,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["site_info", monitorDomain, protocol],
      });
      toast.success(
        `Site ${siteInfo?.paused ? "resumed" : "paused"} successfully!`,
        {
          duration: 3000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        },
      );
    },
    onError: () => {
      toast.error("An error occurred while updating the site status.", {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const handlePauseResume = () => {
    if (!siteInfo) return;

    pauseResumeMutation.mutate({
      protocol: protocol!,
      domain: monitorDomain!,
      action: siteInfo.paused ? "resume" : "pause",
    });
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: removeSite,
    onSuccess: () => {
      refetch();
      toast.success("Site removed successfully", {
        duration: 2000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
      navigate("/monitor");
    },
    onError: () => {
      toast.error("An error occurred while removing the site.", {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const handleDelete = (site: ResponseBody) => {
    const [url] = site.url;
    const [protocol, domain] = url.split("://");
    deleteMutate({ protocol, domain });
  };

  const { mutate: resetSiteMutate, isPending: isLoadingResetSite } =
    useMutation({
      mutationFn: resetSite,
      onSuccess: (data) => {
        refetch();
        toast.success(data.status, {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        });
      },
      onError: () => {
        toast.error("An error occurred while resetting the site.", {
          duration: 3000,
          richColors: true,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.35)",
            borderColor: "rgba(255, 0, 0, 0.5)",
          },
        });
      },
    });

  const handleResetSite = () => {
    if (!siteInfo) return;

    resetSiteMutate({
      protocol: protocol!,
      domain: monitorDomain!,
    });
  };

  const chartData = siteInfo?.status_records_last_24_hours.map((record) => ({
    timestamp: new Date(record.timestamp).getTime(),
    responseTime: parseFloat(record.response_time.split(" ")[0]),
  }));

  const [selectedChart, setSelectedChart] = useState<
    "line" | "gradient" | "area" | "bar"
  >("gradient");
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const renderChart = () => {
    switch (selectedChart) {
      case "line":
        return (
          <LineChart data={chartData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="var(--color-responseTime)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );

      case "gradient":
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient
                id="colorResponseTime"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-responseTime)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-responseTime)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              className="bg-rose-600"
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="var(--color-responseTime)"
              fillOpacity={1}
              fill="url(#colorResponseTime)"
            />
          </AreaChart>
        );
      case "area":
        return (
          <AreaChart data={chartData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="var(--color-responseTime)"
              fill="var(--color-responseTime)"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case "bar":
        return (
          <BarChart data={chartData}>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(unixTime) =>
                new Date(unixTime).toLocaleTimeString()
              }
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="responseTime" fill="var(--color-responseTime)" />
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <InnerLayout
        label="Monitor Details"
        className="container mx-auto w-full max-w-7xl space-y-3 pb-10 pt-0"
        button={
          <div className="flex items-center gap-2">
            <Button
              className="h-9 w-fit py-0"
              variant="default"
              onClick={handlePauseResume}
              disabled={pauseResumeMutation.isPending}
            >
              {pauseResumeMutation.isPending ? (
                <>
                  <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                  <P className="text-sm font-medium text-zinc-100 dark:text-zinc-900 [&:not(:first-child)]:mt-0">
                    {siteInfo?.paused ? "Resuming..." : "Pausing..."}
                  </P>
                </>
              ) : (
                <>
                  {siteInfo?.paused ? (
                    <PlayIcon className="mr-2 h-4 w-4" />
                  ) : (
                    <PauseIcon className="mr-2 h-4 w-4" />
                  )}
                  <P className="text-sm font-medium text-zinc-100 dark:text-zinc-900 [&:not(:first-child)]:mt-0">
                    {siteInfo?.paused ? "Resume" : "Pause"}
                  </P>
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              onClick={handleResetSite}
              disabled={isLoadingResetSite}
            >
              {isLoadingResetSite ? (
                <>
                  <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Resetting...</span>
                </>
              ) : (
                <span className="text-sm font-medium">Reset</span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="mx-auto flex justify-center pr-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {siteDropdownItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    className={cn(
                      "flex h-9 items-center justify-start gap-2 rounded-md px-2 text-sm text-text/90",
                      item.variant === "destructive"
                        ? "px-0 text-red-600 hover:text-red-600"
                        : "hover:text-text",
                    )}
                  >
                    {item.label === "Delete monitor" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex h-9 w-full items-center justify-start gap-4 rounded-md p-2 text-sm text-text/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the monitor for {siteInfo?.url}
                              .
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                if (item.variant === "destructive") {
                                  handleDelete({
                                    created_at: siteInfo!.created_at,
                                    id: siteInfo!.id,
                                    friendly_name: siteInfo!.friendly_name,
                                    url: siteInfo!.url,
                                    interval: siteInfo!.interval,
                                    paused: siteInfo!.paused,
                                    last_checked: siteInfo!.last_checked,
                                    maintenance: siteInfo!.maintenance,
                                    name: siteInfo!.name,
                                    status: siteInfo!.status,
                                    tags: siteInfo!.tags,
                                  });
                                }
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : item.label === "Add tags" ? (
                      <TagDialog
                        label={siteDropdownItems[2].label}
                        site={siteInfo!}
                      />
                    ) : (
                      <>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        parentClassName="max-w-7xl"
      >
        <P className="max-w-prose pb-4 text-base text-text/90">
          Detailed information about the monitored domain.
        </P>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="col-span-2 flex flex-col gap-6">
            <Card className="w-full shadow-md">
              <CardHeader
                badgeClassName={cn(
                  siteInfo?.paused === false
                    ? "border-green-600 bg-green-600 animate-pulse  "
                    : siteInfo?.paused === true
                      ? "bg-destructive"
                      : "bg-secondary",
                )}
                className="px-4 md:px-6"
              >
                <CardTitle className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* <div className="relative flex h-10 w-10 flex-col items-center justify-center">
                <Ripple
                  className="absolute left-0 overflow-hidden rounded-full"
                  mainCircleSize={16}
                  numCircles={2}
                />
              </div> */}

                    <div className="relative mr-2 h-10 w-10">
                      <Ripple
                        numCircles={4}
                        mainCircleSize={10}
                        className="pointer-events-none"
                        circleColor={
                          siteInfo?.status === "Status Up"
                            ? "rgba(0, 255, 0, 0.9)"
                            : "rgba(255, 0, 0, 0.9)"
                        }
                      />
                    </div>
                    <P className="text-xl font-bold text-text md:text-2xl [&:not(:first-child)]:mt-0">
                      Site Monitor Details
                    </P>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Hint
                      label="Refresh"
                      side="bottom"
                      align="start"
                      alignOffset={-10}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => refetch()}
                        title="Refresh"
                        className="flex w-full items-center justify-center gap-4 rounded-md p-2 text-sm text-text/90"
                      >
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </Hint>
                    <Hint
                      label="Edit"
                      side="bottom"
                      align="center"
                      alignOffset={5}
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          navigate(`/monitor/${monitorDomain}/edit`)
                        }
                        title="Edit"
                        className="flex w-full items-center justify-center gap-4 rounded-md p-2 text-sm text-text/90"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Hint>

                    <AlertDialog>
                      <Hint
                        label="Delete"
                        side="bottom"
                        align="end"
                        alignOffset={10}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="flex w-full items-center justify-center gap-4 rounded-md p-2 text-sm text-text/90"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <TrashIcon className="h-4 w-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                      </Hint>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the monitor for {siteInfo?.url}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleDelete(siteInfo!);
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-[75%]" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : isError ? (
                  <Alert
                    description={error.message}
                    title="Error"
                    type="error"
                  />
                ) : siteInfo ? (
                  <div className="space-y-4">
                    <div>
                      <P className="text-xl font-semibold">{siteInfo.name}</P>
                      <P className="text-sm text-muted-foreground">
                        {siteInfo.url[0]}
                      </P>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <P className="font-semibold">Status</P>
                        <Badge
                          variant={
                            siteInfo.status === "Status Up"
                              ? "success"
                              : siteInfo.status === "Status Down"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {siteInfo.status}
                        </Badge>
                      </div>
                      <div>
                        <P className="font-semibold">Last Checked</P>
                        <P className="[&:not(:first-child)]:mt-0">
                          {siteInfo.last_checked
                            ? new Date(siteInfo.last_checked).toLocaleString()
                            : "N/A"}
                        </P>
                      </div>
                      <div>
                        <P className="font-semibold">Check Interval</P>
                        <P className="[&:not(:first-child)]:mt-0">
                          {siteInfo.interval} seconds
                        </P>
                      </div>
                      <div>
                        <P className="font-semibold">Next Check</P>
                        <P className="[&:not(:first-child)]:mt-0">
                          {siteInfo.next_check_time}
                        </P>
                      </div>
                      <div>
                        <P className="font-semibold">Response Time</P>
                        <P className="[&:not(:first-child)]:mt-0">
                          Min: {siteInfo.response_time.min}, Max:{" "}
                          {siteInfo.response_time.max}, Avg:{" "}
                          {siteInfo.response_time.avg}
                        </P>
                      </div>
                      <div>
                        <P className="font-semibold">Tags</P>
                        <P className="[&:not(:first-child)]:mt-0">
                          {siteInfo.tags.length > 0
                            ? siteInfo.tags.join(", ")
                            : "No tags"}
                        </P>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    No information available for this monitor.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <P className="text-sm text-muted-foreground">
                  Monitor created on:{" "}
                  {siteInfo
                    ? new Date(siteInfo.created_at).toLocaleString()
                    : "N/A"}
                </P>
              </CardFooter>
            </Card>

            {/* {!siteInfo?.paused && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      Response Time Chart
                    </span>
                    <Select
                      value={selectedChart}
                      onValueChange={(value) =>
                        setSelectedChart(value as typeof selectedChart)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="gradient">
                          Gradient Area Chart
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : isError ? (
                    <Alert
                      description={error.message}
                      title="Error"
                      type="error"
                    />
                  ) : siteInfo ? (
                    <ChartContainer
                      config={{
                        responseTime: {
                          label: "Response Time",
                          color: "hsl(var(--chart-1))",
                        },
                        baseline: {
                          label: "Baseline",
                          color: "hsl(var(--chart-2))",
                        },
                        average: {
                          label: "Average",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        className="-ml-4 w-full"
                      >
                        {renderChart() || <div>No chart data available</div>}
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : null}
                </CardContent>
                {siteInfo && (
                  <CardFooter>
                    <ResponseTimeStats
                      min={siteInfo.response_time.min}
                      max={siteInfo.response_time.max}
                      avg={siteInfo.response_time.avg}
                    />
                  </CardFooter>
                )}

              </Card>
            )} */}

            {!siteInfo?.paused && (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      Response Time Chart
                    </span>
                    <Select
                      value={selectedChart}
                      onValueChange={(value) =>
                        setSelectedChart(value as typeof selectedChart)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select chart type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="area">Area Chart</SelectItem>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="gradient">
                          Gradient Area Chart
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : isError ? (
                    <Alert
                      description={error.message || "An error occurred"}
                      title="Error"
                      type="error"
                    />
                  ) : siteInfo ? (
                    <ChartContainer
                      config={{
                        responseTime: {
                          label: "Response Time",
                          color: "hsl(var(--chart-1))",
                        },
                        baseline: {
                          label: "Baseline",
                          color: "hsl(var(--chart-2))",
                        },
                        average: {
                          label: "Average",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                    >
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        className="-ml-4 w-full"
                      >
                        {renderChart() || <div>No chart data available</div>}
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div>No site information available</div>
                  )}
                </CardContent>
                <CardFooter>
                  {siteInfo?.response_time.max &&
                    siteInfo?.response_time.avg &&
                    siteInfo?.response_time.min && (
                      <ResponseTimeStats
                        min={siteInfo.response_time.min}
                        max={siteInfo.response_time.max}
                        avg={siteInfo.response_time.avg}
                      />
                    )}
                </CardFooter>
              </Card>
            )}
          </div>
          <div className="col-span-1">
            <Card className="">
              <CardHeader>
                <CardTitle>Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="h-fit">
                <div className="flex items-center justify-between">
                  <P className="font-semibold">Status:</P>
                  <Badge
                    variant={siteInfo?.maintenance ? "warning" : "success"}
                  >
                    {siteInfo?.maintenance ? "In Maintenance" : "Operational"}
                  </Badge>
                </div>
                {siteInfo?.maintenance && (
                  <div className="mt-4">
                    <P className="font-semibold">Maintenance Details:</P>
                    <P className="mt-2 text-sm text-muted-foreground">
                      The site is currently undergoing scheduled maintenance. We
                      apologize for any inconvenience.
                    </P>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={siteInfo?.maintenance ? "destructive" : "default"}
                  onClick={() => {
                    const param = new URLSearchParams();
                    param.append("tab", "maintenance");
                    navigate(
                      `/monitor/${monitorDomain}/edit?${param.toString()}`,
                    );
                  }}
                >
                  {siteInfo?.maintenance
                    ? "End Maintenance"
                    : "Start Maintenance"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </InnerLayout>
    </>
  );
}

interface ResponseTimeStatsProps {
  min: string;
  max: string;
  avg: string;
}

const ResponseTimeStats: React.FC<ResponseTimeStatsProps> = ({
  min,
  max,
  avg,
}) => {
  return (
    <CardBody className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-y-0 px-2 md:flex-row md:justify-between">
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
