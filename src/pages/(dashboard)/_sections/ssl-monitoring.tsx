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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SSL_Monitoring_Response } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sslMonitorSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
});

type SSLMonitorFormValues = z.infer<typeof sslMonitorSchema>;

const fetchSSLStatus = async ({
  hostname,
}: SSLMonitorFormValues): Promise<SSL_Monitoring_Response> => {
  const params = new URLSearchParams({
    hostname,
  });
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/ssl_monitor?${params.toString()}`,
  );
  return response.data;
};

const fetchSSLCertificates = async ({ hostname }: SSLMonitorFormValues) => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/ssl_certificates/${hostname}`,
  );
  return response.data;
};

const SSLMonitoringComponent = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<SSLMonitorFormValues>({
    resolver: zodResolver(sslMonitorSchema),
    defaultValues: {
      hostname: "",
    },
  });

  const {
    data: sslStatus,
    isLoading: isLoadingSSLStatus,
    refetch: refetchSSLStatus,
  } = useQuery({
    queryKey: ["sslStatus", form.getValues("hostname")],
    queryFn: () => fetchSSLStatus(form.getValues()),
    enabled: false,
  });

  // const {
  //   data: sslCertificates,
  //   isLoading: isLoadingSSLCertificates,
  //   refetch: refetchSSLCertificates,
  // } = useQuery({
  //   queryKey: ["sslCertificates", form.watch("hostname")],
  //   queryFn: () => fetchSSLCertificates(form.getValues()),
  //   enabled: false,
  // });

  const {
    mutate: sslCertificatesMutate,
    isPending,
    data: sslCertificates,
  } = useMutation({
    mutationKey: ["sslCertificates", form.getValues("hostname")],
    mutationFn: () =>
      fetchSSLCertificates({ hostname: form.getValues("hostname") }),
  });

  const onSubmit = () => {
    refetchSSLStatus();
  };

  useEffect(() => {
    if (sslStatus) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sslStatus]);

  return (
    // <InnerLayout
    //   label="SSL Monitoring"
    //   className="pt-8"
    //   button={
    //     <div className="flex w-fit items-center justify-center">
    //       <Button className="h-9 w-fit py-0" variant="default">
    //         <PlusIcon className="mr-2 h-4 w-4" strokeWidth={3} />
    //         <P className="text-sm font-medium text-zinc-200 dark:text-zinc-900 [&:not(:first-child)]:mt-0">
    //           New Monitor
    //         </P>
    //       </Button>
    //     </div>
    //   }
    // >
    <>
      <div className="container mx-auto pb-8 md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle>SSL Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="hostname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hostname</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="example.com" />
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
              className="flex w-fit justify-self-start"
              onClick={() => onSubmit()}
            >
              {isLoadingSSLStatus ? "Checking..." : "Check SSL Status"}
            </Button>
            <Button
              className="flex w-fit justify-self-start"
              onClick={() => sslCertificatesMutate()}
            >
              {isPending ? "Checking..." : "Check SSL Certificates"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="container mx-auto pb-10 pt-8" ref={resultRef}>
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {isLoadingSSLStatus || isPending ? (
              <div className="mt-8 space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array(6)
                    .fill(null)
                    .map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
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
            ) : sslStatus ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Domain</TableCell>
                    <TableCell>Issuer</TableCell>
                    <TableCell>Expiry Date</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{sslStatus.Domain}</TableCell>
                    <TableCell>
                      {sslStatus["Organization (O) - Issued By"]}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(sslStatus["Valid to"]),
                        "yyyy-MM-dd HH:mm",
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : null}

            {sslCertificates && (
              <div>{/* Additional rendering logic for sslCertificates */}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
    // </InnerLayout>
  );
};

export default SSLMonitoringComponent;
