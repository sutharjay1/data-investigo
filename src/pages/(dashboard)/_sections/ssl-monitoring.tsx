// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import { SSL_Monitoring_Response } from "@/types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import { format } from "date-fns";
// import { useEffect, useRef } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// const sslMonitorSchema = z.object({
//   hostname: z.string().min(1, "Hostname is required"),
// });

// type SSLMonitorFormValues = z.infer<typeof sslMonitorSchema>;

// const fetchSSLStatus = async ({
//   hostname,
// }: SSLMonitorFormValues): Promise<SSL_Monitoring_Response> => {
//   const params = new URLSearchParams({
//     hostname,
//   });
//   const response = await axios.post(
//     `${import.meta.env.VITE_DOMAIN_URL}/ssl_monitor?${params.toString()}`,
//   );
//   return response.data;
// };

// const fetchSSLCertificates = async ({ hostname }: SSLMonitorFormValues) => {
//   const response = await axios.get(
//     `${import.meta.env.VITE_DOMAIN_URL}/ssl_certificate_chain/${hostname}`,
//   );
//   return response.data;
// };

// const SSLMonitoringComponent = () => {
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     ref.current?.scrollIntoView({ behavior: "smooth" });
//   }, []);

//   const resultRef = useRef<HTMLDivElement | null>(null);

//   const form = useForm<SSLMonitorFormValues>({
//     resolver: zodResolver(sslMonitorSchema),
//     defaultValues: {
//       hostname: "",
//     },
//   });

//   // const {
//   //   data: sslStatus,
//   //   isLoading: isPendingSSLStatus,
//   //   refetch: refetchSSLStatus,
//   // } = useQuery({
//   //   queryKey: ["sslStatus", form.getValues("hostname")],
//   //   queryFn: () => fetchSSLStatus(form.getValues()),
//   //   enabled: false,
//   // });

//   const {
//     mutate: sslStatusMutate,
//     isPending: isPendingSSLStatus,
//     data: sslStatus,
//   } = useMutation({
//     mutationKey: ["sslStatus", form.getValues("hostname")],
//     mutationFn: () => fetchSSLStatus({ hostname: form.getValues("hostname") }),
//   });

//   // const {
//   //   data: sslCertificates,
//   //   isLoading: isLoadingSSLCertificates,
//   //   refetch: refetchSSLCertificates,
//   // } = useQuery({
//   //   queryKey: ["sslCertificates", form.watch("hostname")],
//   //   queryFn: () => fetchSSLCertificates(form.getValues()),
//   //   enabled: false,
//   // });

//   const {
//     mutate: sslCertificatesMutate,
//     isPending: isPendingSSLCertificates,
//     data: sslCertificates,
//   } = useMutation({
//     mutationKey: ["sslCertificates", form.getValues("hostname")],
//     mutationFn: () =>
//       fetchSSLCertificates({ hostname: form.getValues("hostname") }),
//   });

//   const onSubmit = () => {};

//   useEffect(() => {
//     if (sslStatus) {
//       resultRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [sslStatus]);

//   return (
//     // <InnerLayout
//     //   label="SSL Monitoring"
//     //   className="pt-8"
//     //   button={
//     //     <div className="flex w-fit items-center justify-center">
//     //       <Button className="h-9 w-fit py-0" variant="default">
//     //         <PlusIcon className="mr-2 h-4 w-4" strokeWidth={3} />
//     //         <P className="text-sm font-medium text-zinc-200 dark:text-zinc-900 [&:not(:first-child)]:mt-0">
//     //           New Monitor
//     //         </P>
//     //       </Button>
//     //     </div>
//     //   }
//     // >
//     <>
//       <div className="container mx-auto pb-8 md:pb-0" ref={ref}>
//         <Card className="mx-auto w-full shadow-md">
//           <CardHeader>
//             <CardTitle>SSL Monitoring</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="hostname"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Hostname</FormLabel>
//                       <FormControl>
//                         <Input {...field} placeholder="example.com" />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </form>
//             </Form>
//           </CardContent>
//           <CardFooter>
//             <Button
//               className="flex w-fit justify-self-start"
//               onClick={() => onSubmit()}
//             >
//               {isPendingSSLStatus ? "Checking..." : "Check SSL Status"}
//             </Button>
//             <Button
//               className="flex w-fit justify-self-start"
//               onClick={() => sslCertificatesMutate()}
//             >
//               {isPendingSSLCertificates
//                 ? "Checking..."
//                 : "Check SSL Certificates"}
//             </Button>
//           </CardFooter>
//         </Card>
//       </div>
//       <div className="container mx-auto pb-10 pt-8" ref={resultRef}>
//         <SSLStatusComponent
//           isPendingSSLStatus={isPendingSSLStatus}
//           isPendingSSLCertificates={isPendingSSLCertificates}
//           sslStatus={sslStatus}
//           sslCertificates={sslCertificates}
//         />
//       </div>
//     </>
//     // </InnerLayout>
//   );
// };

// const SSLStatusComponent = ({
//   isPendingSSLStatus,
//   isPendingSSLCertificates,
//   sslStatus,
//   sslCertificates,
// }: {
//   isPendingSSLStatus: boolean;
//   isPendingSSLCertificates: boolean;
//   sslStatus: any;
//   sslCertificates: any;
// }) => {
//   return (
//     <>
//       {/* SSL Status Card */}

//       {/* {isPendingSSLStatus || sslStatus ? (
//         <Card className="mx-auto mb-4 w-full shadow-md">
//           <CardContent>
//             {isPendingSSLStatus ? (
//               <SSLStatusSkeleton />
//             ) : sslStatus ? (
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableCell>Domain</TableCell>
//                     <TableCell>Issuer</TableCell>
//                     <TableCell>Expiry Date</TableCell>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell>{sslStatus.Domain}</TableCell>
//                     <TableCell>
//                       {sslStatus["Organization (O) - Issued By"]}
//                     </TableCell>
//                     <TableCell>
//                       {format(
//                         new Date(sslStatus["Valid to"]),
//                         "yyyy-MM-dd HH:mm",
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             ) : (
//               <p>No SSL status available.</p>
//             )}
//           </CardContent>
//         </Card>
//       ) : null} */}

// {isLoading ? (
//               <SSLStatusSkeleton />
//             ) : isError ? (
//               <Alert title="Error" description={error.message} type={"error"} />
//             ) : data ? (
//               <div className="space-y-6">
//                 {Array.isArray(data) ? (
//                   <DNSRecordItem records={data} />
//                 ) : (
//                   <Alert
//                     title="Error"
//                     description={data.error}
//                     type={"success"}
//                   />
//                 )}
//               </div>
//             ) : null}

//       {isPendingSSLCertificates || sslCertificates ? (
//         <Card className="mx-auto w-full shadow-md">
//           <CardContent>
//             {isPendingSSLCertificates ? (
//               <SSLCertificatesSkeleton />
//             ) : sslCertificates ? (
//               <pre className="min-h-96 max-w-full overflow-y-auto rounded-md p-2 text-sm">
//                 {JSON.stringify(sslCertificates, null, 2)}
//               </pre>
//             ) : null}
//           </CardContent>
//         </Card>
//       ) : null}
//     </>
//   );
// };

// const SSLStatusSkeleton = () => {
//   return (
//     <div className="space-y-4">
//       <Skeleton className="h-6 w-2/3" />
//       <div className="grid gap-4 sm:grid-cols-3">
//         {Array(3)
//           .fill(null)
//           .map((_, idx) => (
//             <div key={idx} className="space-y-2">
//               <Skeleton className="h-4 w-1/3" />
//               <Skeleton className="h-4 w-full" />
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// };

// const SSLCertificatesSkeleton = () => {
//   return (
//     <div className="space-y-2">
//       <Skeleton className="h-4 w-1/3" />
//       <Skeleton className="h-4 w-full" />
//       <Skeleton className="h-4 w-full" />
//       <Skeleton className="h-4 w-3/4" />
//     </div>
//   );
// };

// export default SSLMonitoringComponent;

import Alert from "@/components/global/alert";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const sslMonitorSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
});

type SSLMonitorFormValues = z.infer<typeof sslMonitorSchema>;

const fetchSSLStatus = async (
  hostname: string,
): Promise<SSL_Monitoring_Response> => {
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/ssl_monitor?hostname=${hostname}`,
  );
  return response.data;
};

const fetchSSLCertificates = async (hostname: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/ssl_certificate_chain/${hostname}`,
  );
  return response.data;
};

const SSLMonitoringComponent = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const form = useForm<SSLMonitorFormValues>({
    resolver: zodResolver(sslMonitorSchema),
    defaultValues: {
      hostname: "",
    },
  });

  const {
    data: sslStatus,
    isLoading: isLoadingSSLStatus,
    isError: isSslStatusError,
    error: sslStatusError,
    refetch: refetchSSLStatus,
  } = useQuery({
    queryKey: ["sslStatus"],
    queryFn: () => fetchSSLStatus(form.getValues("hostname")),
    enabled: false,
  });

  const {
    data: sslCertificates,
    isLoading: isLoadingSSLCertificates,
    isError: isSSLCertificatesError,
    error: sslCertificatesError,
    refetch: refetchSSLCertificates,
  } = useQuery({
    queryKey: ["sslCertificates"],
    queryFn: () => fetchSSLCertificates(form.getValues("hostname")),
    enabled: false,
  });

  const onSubmit = () => {
    if (form.formState.isValid) {
      refetchSSLStatus();
      refetchSSLCertificates();
    }
  };

  useEffect(() => {
    if (sslStatus) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [sslStatus]);

  return (
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
                {/* <FormField
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
                /> */}

                <FormField
                  control={form.control}
                  name="hostname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Hostname</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="example.com"
                          className="mt-1.5"
                        />
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
              onClick={() => refetchSSLStatus()}
              disabled={form.formState.isSubmitting}
            >
              Check SSL Status
            </Button>
            <Button
              className="flex w-fit justify-self-start"
              onClick={() => refetchSSLCertificates()}
              disabled={form.formState.isSubmitting}
            >
              Check SSL Certificates
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="container mx-auto pb-10 pt-8" ref={resultRef}>
        <>
          {isLoadingSSLStatus || isSslStatusError || sslStatus ? (
            <Card className="mx-auto mb-4 w-full shadow-md">
              <CardContent>
                {isLoadingSSLStatus ? (
                  <SSLStatusSkeleton />
                ) : isSslStatusError ? (
                  <Alert
                    title="Error"
                    description={sslStatusError.message}
                    type={"error"}
                  />
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
                ) : (
                  <p>No SSL status available.</p>
                )}
              </CardContent>
            </Card>
          ) : null}

          {isLoadingSSLCertificates || sslCertificates ? (
            <Card className="mx-auto w-full shadow-md">
              <CardContent>
                {isLoadingSSLCertificates ? (
                  <SSLCertificatesSkeleton />
                ) : isSSLCertificatesError ? (
                  <Alert
                    title="Error"
                    description={sslCertificatesError.message}
                    type={"error"}
                  />
                ) : sslCertificates ? (
                  <pre className="max-h-60 overflow-y-auto rounded-md p-2 text-sm">
                    {JSON.stringify(sslCertificates, null, 2)}
                  </pre>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </>
      </div>
    </>
  );
};

const SSLStatusSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-2/3" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array(3)
          .fill(null)
          .map((_, idx) => (
            <div key={idx} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
      </div>
    </div>
  );
};

const SSLCertificatesSkeleton = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
};

export default SSLMonitoringComponent;
