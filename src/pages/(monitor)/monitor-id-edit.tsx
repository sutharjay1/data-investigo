import InnerLayout from "@/components/global/inner-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { SiteInfo } from "./monitor-id";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  protocol: z.enum(["http", "https"]),
  domain: z.string().min(1, "Domain is required"),
  tags: z.string(),
  interval: z.enum(
    [
      "10 seconds",
      "20 seconds",
      "30 seconds",
      "40 seconds",
      "50 seconds",
      "60 seconds",
      "1 minute",
      "2 minutes",
      "3 minutes",
      "4 minutes",
      "5 minutes",
      "6 minutes",
      "7 minutes",
      "8 minutes",
      "9 minutes",
      "10 minutes",
      "11 minutes",
      "12 minutes",
      "13 minutes",
      "14 minutes",
      "15 minutes",
      "16 minutes",
      "17 minutes",
      "18 minutes",
      "19 minutes",
      "20 minutes",
      "21 minutes",
      "22 minutes",
      "23 minutes",
      "24 minutes",
      "25 minutes",
      "26 minutes",
      "27 minutes",
      "28 minutes",
      "29 minutes",
      "30 minutes",
      "31 minutes",
      "32 minutes",
      "33 minutes",
      "34 minutes",
      "35 minutes",
      "36 minutes",
      "37 minutes",
      "38 minutes",
      "39 minutes",
      "40 minutes",
      "41 minutes",
      "42 minutes",
      "43 minutes",
      "44 minutes",
      "45 minutes",
      "46 minutes",
      "47 minutes",
      "48 minutes",
      "49 minutes",
      "50 minutes",
      "51 minutes",
      "52 minutes",
      "53 minutes",
      "54 minutes",
      "55 minutes",
      "56 minutes",
      "57 minutes",
      "58 minutes",
      "59 minutes",
      "1 hour",
      "2 hours",
      "3 hours",
      "4 hours",
      "5 hours",
      "6 hours",
      "7 hours",
      "8 hours",
      "9 hours",
      "10 hours",
      "11 hours",
      "12 hours",
      "13 hours",
      "14 hours",
      "15 hours",
      "16 hours",
      "17 hours",
      "18 hours",
      "19 hours",
      "20 hours",
      "21 hours",
      "22 hours",
      "23 hours",
      "24 hours",
      "7 days",
      "30 days",
      "365 days",
    ],
    {
      errorMap: () => ({ message: "Interval is required" }),
    },
  ),
  friendly_name: z.string().min(1, "Friendly name is required"),
});

type FormValues = z.infer<typeof formSchema>;

const intervalOptions = [
  "10 seconds",
  "20 seconds",
  "30 seconds",
  "40 seconds",
  "50 seconds",
  "60 seconds",
  "1 minute",
  "2 minutes",
  "3 minutes",
  "4 minutes",
  "5 minutes",
  "6 minutes",
  "7 minutes",
  "8 minutes",
  "9 minutes",
  "10 minutes",
  "11 minutes",
  "12 minutes",
  "13 minutes",
  "14 minutes",
  "15 minutes",
  "16 minutes",
  "17 minutes",
  "18 minutes",
  "19 minutes",
  "20 minutes",
  "21 minutes",
  "22 minutes",
  "23 minutes",
  "24 minutes",
  "25 minutes",
  "26 minutes",
  "27 minutes",
  "28 minutes",
  "29 minutes",
  "30 minutes",
  "31 minutes",
  "32 minutes",
  "33 minutes",
  "34 minutes",
  "35 minutes",
  "36 minutes",
  "37 minutes",
  "38 minutes",
  "39 minutes",
  "40 minutes",
  "41 minutes",
  "42 minutes",
  "43 minutes",
  "44 minutes",
  "45 minutes",
  "46 minutes",
  "47 minutes",
  "48 minutes",
  "49 minutes",
  "50 minutes",
  "51 minutes",
  "52 minutes",
  "53 minutes",
  "54 minutes",
  "55 minutes",
  "56 minutes",
  "57 minutes",
  "58 minutes",
  "59 minutes",
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "5 hours",
  "6 hours",
  "7 hours",
  "8 hours",
  "9 hours",
  "10 hours",
  "11 hours",
  "12 hours",
  "13 hours",
  "14 hours",
  "15 hours",
  "16 hours",
  "17 hours",
  "18 hours",
  "19 hours",
  "20 hours",
  "21 hours",
  "22 hours",
  "23 hours",
  "24 hours",
  "7 days",
  "30 days",
  "365 days",
];

const fetchMonitorData = async ({
  protocol,
  domain,
}: {
  protocol: string;
  domain: string;
}): Promise<SiteInfo> => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/site_info?protocol=${protocol}&domain=${domain}`,
  );
  return response.data.site_info;
};

const editMonitor = async (data: {
  protocol: string;
  domain: string;
  new_protocol: string;
  new_domain: string;
  tags: string;
  interval: string;
  friendly_name: string;
}): Promise<any> => {
  console.log({
    ...data,
  });
  const formData = new URLSearchParams();
  formData.append("protocol", data.protocol);
  formData.append("domain", data.domain);
  formData.append("new_protocol", data.new_protocol);
  formData.append("new_domain", data.new_domain);
  formData.append("tags", data.tags);
  formData.append("interval", data.interval);
  formData.append("friendly_name", data.friendly_name);

  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/edit_site`,
    formData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );
  return response.data;
};

const setMaintenance = async ({
  protocol,
  domain,
  maintenance,
}: {
  protocol: string;
  domain: string;
  maintenance: boolean;
}): Promise<any> => {
  const formData = new URLSearchParams();
  formData.append("protocol", protocol);
  formData.append("domain", domain);
  formData.append("maintenance", maintenance.toString());

  const response = await axios.post(
    "https://domain-api.datainvestigo.com/set_maintenance",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accept: "application/json",
      },
    },
  );

  return response.data;
};

const MonitorIDEdit: React.FC = () => {
  const { id: monitorDomain } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const protocol = searchParams.get("protocol") || "https";
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!searchParams.get("protocol")) {
      searchParams.set("protocol", "https");
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
  }, [location, navigate, searchParams]);

  const {
    data: siteInfo,
    isLoading,
    isError,
  } = useQuery<SiteInfo, Error>({
    queryKey: ["site_info", monitorDomain, protocol],
    queryFn: () => fetchMonitorData({ protocol, domain: monitorDomain! }),
    enabled: !!protocol && !!monitorDomain,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      protocol: protocol as "https" | "http",
      domain: siteInfo?.url ? siteInfo.url[0].split("://")[1] : "",
      tags: siteInfo?.tags ? siteInfo.tags.join(", ") : "",
      interval: siteInfo?.interval.toString() as FormValues["interval"],
      friendly_name: siteInfo?.friendly_name || "",
    },
  });

  const mutation = useMutation({
    mutationFn: editMonitor,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["monitor", monitorDomain] });
      toast.success(data?.status, {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
      navigate(`/monitor/${monitorDomain}?protocol=${protocol}`, {
        replace: true,
      });
    },
    onError: (error) => {
      console.error("Error updating monitor:", error);
      toast.error("Failed to update monitor", {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const setMaintenanceMutation = useMutation({
    mutationFn: setMaintenance,
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["monitor", monitorDomain] });
      toast.success(data?.status, {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
    },
    onError: (error) => {
      console.error("Error updating monitor:", error);
      toast.error("Failed to update monitor", {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!monitorDomain) return;

    mutation.mutate({
      protocol,
      domain: monitorDomain,
      new_protocol: data.protocol,
      new_domain: data.domain,
      tags: data.tags,
      interval: data.interval,
      friendly_name: data.friendly_name,
    });
  };

  const setMaintenanceSubmit = ({
    maintenance,
    protocol,
    domain,
  }: {
    maintenance: boolean;
    protocol: string;
    domain: string;
  }) => {
    if (!monitorDomain) return;

    const toastLoading = toast.loading(
      siteInfo?.maintenance
        ? "Disabling maintenance mode..."
        : "Enabling maintenance mode...",
      {
        style: {
          backgroundColor: "rgba(0, 120, 255, 0.15)",
          border: "0.1px solid rgba(0, 120, 255, 0.2)",
        },
      },
    );

    // setMaintenanceMutation.mutate({
    //   protocol,
    //   domain,
    //   maintenance,
    // });

    setMaintenanceMutation.mutate(
      {
        protocol,
        domain,
        maintenance,
      },
      {
        onSuccess: () => {
          toast.dismiss(toastLoading);
        },
        onError: (error: any) => {
          toast.dismiss(toastLoading);
          toast.error(
            `Failed to ${
              siteInfo?.maintenance ? "disable" : "enable"
            } maintenance mode: ${error.message || "Unknown error"}`,
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">Error loading monitor data</div>
    );
  }

  return (
    <>
      {tab !== "maintenance" ? (
        <InnerLayout
          label={`Edit ${monitorDomain}`}
          className="container mx-auto space-y-3 pb-10 pt-0"
        >
          <div className="flex flex-col gap-6">
            <Card className="mt-2 w-full shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Edit Monitor: {form.watch("friendly_name")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="protocol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Protocol</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select protocol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="http">HTTP</SelectItem>
                                <SelectItem value="https">HTTPS</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="domain"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                id="domain"
                                className="mt-1.5"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="friendly_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Friendly Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <Input {...field} className="mt-1.5" />
                          </FormControl>
                          <FormDescription>
                            Enter tags separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="interval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Check Interval</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {intervalOptions.map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                  {interval}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </InnerLayout>
      ) : (
        <InnerLayout
          label={`Edit ${monitorDomain}`}
          className="container mx-auto w-full space-y-3 pb-10 pt-0"
          button={
            <Button className="h-9 w-fit py-0" variant="default">
              Set Maintenance
            </Button>
          }
        >
          <div className="mt-1 flex flex-col gap-6">
            <Card className="mt-2 w-full shadow-md">
              <CardHeader
                badgeClassName={cn(
                  siteInfo?.maintenance
                    ? "border-green-600 bg-green-600 animate-pulse  "
                    : !siteInfo?.maintenance
                      ? "bg-destructive"
                      : "bg-secondary",
                )}
              >
                <CardTitle className="text-2xl font-bold">
                  <span className="relative">
                    Setup Maintenance windows
                    <span
                      className="absolute -right-3 bottom-1 h-1.5 w-1.5 rounded-full bg-green-600"
                      aria-hidden="true"
                    />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Switch
                    checked={siteInfo?.maintenance}
                    onCheckedChange={() => {
                      setMaintenanceSubmit({
                        domain: monitorDomain!,
                        maintenance: !siteInfo?.maintenance,
                        protocol,
                      });
                    }}
                  />
                  <P className="text-sm [&:not(:first-child)]:mt-0">
                    You can set a maintenance window to prevent the monitor from
                    running in the background.
                  </P>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="h-9 w-fit py-0" variant="default">
                  Set Maintenance
                </Button>
              </CardFooter>
            </Card>
          </div>
        </InnerLayout>
      )}
    </>
  );
};

export default MonitorIDEdit;
