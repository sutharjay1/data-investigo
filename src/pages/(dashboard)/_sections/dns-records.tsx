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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { P } from "@/components/ui/typography";
import { DNS_RECORDS_QUERY } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const dnsSchema = z.object({
  domain_name: z.string().min(3, "Domain name is required"),
  record_type: z.enum([
    "",
    "A",
    "AAAA",
    "CNAME",
    "MX",
    "NS",
    "TXT",
    "SOA",
    "SRV",
    "CAA",
    "PTR",
    "CERT",
  ]),
});

type DNSRecord = z.infer<typeof dnsSchema>;

const fetchDNSRecords = async ({ domain_name, record_type }: DNSRecord) => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/dns_records/${domain_name}`,
    { params: { record_type: record_type.toString() } },
  );
  return response.data;
};

const DNSRecordItem = ({ records }: { records: DNS_RECORDS_QUERY[] }) => {
  if (records.length === 0) {
    return (
      <Alert
        title="No Records"
        description="No DNS records found."
        type="error"
      />
    );
  }

  if (records[0].error) {
    return <Alert title="Error" description={records[0].error} type="error" />;
  }

  console.log({ records });

  return (
    <div className="space-y-4">
      <h3 className="mb-4 text-lg font-semibold text-text">DNS Records</h3>
      <Table className="w-full table-auto text-left">
        <TableHeader className="">
          <TableRow>
            <TableHead className="rounded-tl-lg font-medium text-textSecondary">
              <P className="text-base font-semibold [&:not(:first-child)]:mt-0">
                Record Type
              </P>
            </TableHead>
            <TableHead className="font-medium text-textSecondary">
              <P className="text-base font-semibold [&:not(:first-child)]:mt-0">
                Address
              </P>
            </TableHead>
            <TableHead className="rounded-tl-lg font-medium text-textSecondary">
              <P className="text-base font-semibold [&:not(:first-child)]:mt-0">
                TTL
              </P>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.record_type}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.ttl} </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
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

const DNSRECORDS = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<DNSRecord>({
    resolver: zodResolver(dnsSchema),
    defaultValues: {
      domain_name: "",
      record_type: "A",
    },
  });

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: [
      "dnsRecords",
      form.getValues("domain_name"),
      form.getValues("record_type"),
    ],
    queryFn: async () =>
      fetchDNSRecords({
        domain_name: form.getValues("domain_name"),
        record_type: form.getValues("record_type"),
      }),
    enabled: false,
  });

  const onSubmit = (formData: DNSRecord) => {
    console.log({ formData });
    refetch();
  };

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, isSuccess, isError, isLoading, error]);

  return (
    <>
      <div className="container mx-auto pb-8 md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">DNS Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => onSubmit(values))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="domain_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Domain Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter domain name"
                          className="mt-1.5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="record_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Record Type (optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a record type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="AAAA">AAAA</SelectItem>
                          <SelectItem value="CNAME">CNAME</SelectItem>
                          <SelectItem value="MX">MX</SelectItem>
                          <SelectItem value="NS">NS</SelectItem>
                          <SelectItem value="TXT">TXT</SelectItem>
                          <SelectItem value="SOA">SOA</SelectItem>
                          <SelectItem value="SRV">SRV</SelectItem>
                          <SelectItem value="CAA">CAA</SelectItem>
                          <SelectItem value="PTR">PTR</SelectItem>
                          <SelectItem value="CERT">CERT</SelectItem>
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
              onClick={form.handleSubmit((values) => onSubmit(values))}
              className="flex w-fit justify-self-start"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Check Domain"}
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
              <Alert title="Error" description={error.message} type={"error"} />
            ) : data ? (
              <div className="space-y-6">
                {Array.isArray(data) ? (
                  <DNSRecordItem records={data} />
                ) : (
                  <Alert
                    title="Error"
                    description={data.error}
                    type={"success"}
                  />
                )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DNSRECORDS;
