import Alert from "@/components/global/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/provider/google-provider";
import { Interval, Protocol } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface RequestBody {
  recipient_email: string;
  protocol: Protocol;
  domain: string | null;
  tags?: string;
  interval: Interval;
  friendly_name?: string;
}

export interface ResponseBody {
  status: string;
  id: number;
  url: string;
  tags: string[];
  maintenance: boolean;
  paused: boolean;
  interval: Interval;
  friendly_name: string;
  email_status: string;
}

const schema = z.object({
  recipient_email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  protocol: z.enum(["http", "https"], {
    errorMap: () => ({ message: "Protocol is required" }),
  }),
  domain: z.string().min(1, "Domain is required"),
  tags: z.string().optional(),
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
  friendly_name: z.string().optional(),
});

type MonitorSiteFormValues = z.infer<typeof schema>;

const MonitorNewHttp = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();

  const form = useForm<MonitorSiteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      recipient_email: user?.email!,
      protocol: "https",
      domain: "",
      tags: "",
      interval: "30 minutes",
      friendly_name: "",
    },
  });

  const addSite = async (data: MonitorSiteFormValues) => {
    const response = await axios.post(
      `${import.meta.env.VITE_DOMAIN_URL}/add_site?recipient_email=${data.recipient_email}`,
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  };

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["monitor_site"],
    queryFn: () => addSite(form.getValues()),
    enabled: false,
  });

  const onSubmit = async (values: MonitorSiteFormValues) => {
    refetch();
  };

  useEffect(() => {
    if (data) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <InnerLayout label="Add Site Monitor" className="pt-8">
      <div className="container mx-auto pb-6" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Add Site Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="recipient_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter recipient email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a protocol" />
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
                        <Input placeholder="Enter domain" {...field} />
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
                      <FormLabel>Tags (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tags" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate multiple tags with commas
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
                      <FormLabel>Interval</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="10 seconds">10 seconds</SelectItem>
                          <SelectItem value="30 seconds">30 seconds</SelectItem>
                          <SelectItem value="1 minute">1 minute</SelectItem>
                          <SelectItem value="5 minutes">5 minutes</SelectItem>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="24 hours">24 hours</SelectItem>
                          {/* Add more intervals as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="friendly_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friendly Name (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter friendly name" {...field} />
                      </FormControl>
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
              className="flex w-fit justify-self-start"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Site"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="container mx-auto pb-10" ref={resultRef}>
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {isLoading && (
              <CardContent>
                <div className="mt-8 space-y-4">
                  <Skeleton className="h-6 w-2/3" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-2 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <div className="flex space-x-4">
                    <Skeleton className="h-5 w-5" />

                    <Skeleton className="h-5 w-5" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />

                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            )}

            {data && data.length > 0 ? (
              data.status === "Site already exists with the same protocol" ? (
                <Alert
                  title="Site already exists with the same protocol"
                  description="Please try again with a different URL."
                  type="warning"
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <Alert
                    title="Success!"
                    description="Site added successfully."
                    type="success"
                  />
                  <p>Status: {data.status}</p>
                  <p>Site ID: {data.id}</p>
                  <p>URL: {data.url}</p>
                  <p>Email Status: {data.email_status}</p>
                </div>
              )
            ) : isError ? (
              <Alert
                title="Error adding site"
                description={error.message}
                type="error"
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </InnerLayout>
  );
};

export default MonitorNewHttp;
