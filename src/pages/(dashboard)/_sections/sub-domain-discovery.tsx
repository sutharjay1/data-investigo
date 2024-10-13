import Alert from "@/components/global/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { H3 } from "@/components/ui/typography";
import { copyToClipboard } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Copy, Globe, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SubDomainResponse {
  domain: string;
  subdomains: string[];
  dns_records: string[];
  cloudflare_tunneling: Record<string, boolean>;
  ip_count: Record<string, number>;
  subdomain_categories: Record<string, string[]>;
  start_time: string;
  end_time: string;
  elapsed_time: string;
}

const subdomainsSchema = z.object({
  domain_name: z.string().min(3, "Domain name is required"),
  recordType: z.string().optional(),
  ipRange: z.string().optional(),
  cloudflareStatus: z.boolean().default(false),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof subdomainsSchema>;

const fetchSubdomains = async (
  domain: string,
  recordType?: string,
  ipRange?: string,
  cloudflareStatus?: boolean,
  category?: string,
): Promise<SubDomainResponse> => {
  const params = new URLSearchParams();
  if (recordType) params.append("record_type", recordType);
  if (ipRange) params.append("ip_range", ipRange);
  if (cloudflareStatus)
    params.append("cloudflare_status", cloudflareStatus.toString());
  if (category) params.append("category", category);

  console.log({ params: params.toString() });

  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/subdomain_discovery/${domain}?${params.toString()}`,
  );

  return response.data;
};

const DNSRecordsSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-2/3" />
    <div className="grid gap-4 sm:grid-cols-2">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

const SubDomainDiscovery = () => {
  const ref = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(subdomainsSchema),
    defaultValues: {
      domain_name: "",
      recordType: "",
      ipRange: "",
      cloudflareStatus: false,
      category: "",
    },
  });

  const { handleSubmit, control, setValue, formState } = form;
  const { errors, isSubmitting } = formState;

  const { data, error, isLoading, refetch, isError } = useQuery({
    queryKey: [
      "subdomainDiscovery",
      form.getValues("domain_name"),
      form.getValues("recordType"),
      form.getValues("ipRange"),
      form.getValues("cloudflareStatus"),
      form.getValues("category"),
    ],
    queryFn: () =>
      fetchSubdomains(
        form.getValues("domain_name"),
        form.getValues("recordType"),
        form.getValues("ipRange"),
        form.getValues("cloudflareStatus"),
        form.getValues("category"),
      ),
    enabled: false,
  });

  const onSubmit = async () => {
    await refetch();
  };

  useEffect(() => {
    if (
      data?.dns_records.length! > 0 &&
      data?.subdomains.length! > 0 &&
      resultRef
    ) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.dns_records, data?.subdomains, data]);

  return (
    <>
      <div className="container mx-auto md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              SubDomain Discovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="domain_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="domain_name"
                          placeholder="Enter domain name"
                          className="mt-1.5"
                        />
                      </FormControl>
                      <FormMessage>{errors.domain_name?.message}</FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="recordType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => setValue("recordType", value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "A",
                            "AAAA",
                            "CNAME",
                            "MX",
                            "TXT",
                            "NS",
                            "PTR",
                            "SOA",
                            "SRV",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="ipRange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Range</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Optional IP range"
                          className="mt-1.5"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="cloudflareStatus"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Cloudflare Status</FormLabel>
                        <FormDescription>
                          Check this if you want to include Cloudflare status in
                          the results.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => setValue("category", value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="web_server">Web Server</SelectItem>
                          <SelectItem value="mail_server">
                            Mail Server
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isLoading}
              className="flex w-fit justify-self-start"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Globe className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Fetching..." : "Fetch Subdomains"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="container mx-auto pb-10" ref={resultRef}>
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {isLoading ? (
              <DNSRecordsSkeleton />
            ) : isError ? (
              <Alert title="Error" description={error.message} type="error" />
            ) : data ? (
              <div className="space-y-6 md:p-4">
                <H3 className="text-2xl font-semibold">
                  Subdomain Discovery for {form.getValues("domain_name")}
                </H3>

                {data.subdomains.length > 0 && (
                  <Card className="rounded-lg border shadow-sm">
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <h3 className="mb-4 text-xl font-semibold">
                          Subdomains
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                          onClick={() => copyToClipboard(data.subdomains[0])}
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <ul className="space-y-2">
                        {data.subdomains.map((subdomain, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between border-b p-2 last:border-b-0"
                          >
                            <span>{subdomain}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {data.dns_records.length > 0 && (
                  <Card className="rounded-lg border shadow-sm">
                    <CardContent>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">DNS Records</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(data.dns_records, null, 2),
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <pre className="max-h-60 overflow-y-auto rounded-md p-2 text-sm">
                        {JSON.stringify(data.dns_records, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
                {data.subdomain_categories && (
                  <Card className="rounded-lg border shadow-sm">
                    <CardContent>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">
                          Subdomain Categories
                        </h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(data.dns_records, null, 2),
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <pre className="max-h-60 overflow-y-auto rounded-md p-2 text-sm">
                        {JSON.stringify(data.subdomain_categories, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}
                {data.ip_count && (
                  <Card className="rounded-lg border shadow-sm">
                    <CardContent>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xl font-semibold">IP Count</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                          onClick={() =>
                            copyToClipboard(
                              JSON.stringify(data.dns_records, null, 2),
                            )
                          }
                        >
                          <Copy className="h-4 w-4" />
                          Copy
                        </Button>
                      </div>
                      <pre className="max-h-60 overflow-y-auto rounded-md p-2 text-sm">
                        {JSON.stringify(data.ip_count, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                <Card className="rounded-lg border shadow-sm">
                  <CardContent>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xl font-semibold">
                        Cloudflare Tunneling
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(data.cloudflare_tunneling, null, 2),
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <pre className="max-h-60 overflow-y-auto rounded-md p-2 text-sm">
                      {JSON.stringify(data.cloudflare_tunneling, null, 2)}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="rounded-lg border shadow-sm">
                  <CardContent>
                    <h3 className="text-xl font-semibold">Elapsed Time</h3>
                    <p className="rounded-md p-2">{data.elapsed_time}</p>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SubDomainDiscovery;
