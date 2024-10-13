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
import { copyToClipboard } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Copy } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const reverseIPSchema = z.object({
  ip_or_domain: z.string().min(1, "IP or Domain is required"),
});

type ReverseIPRecord = z.infer<typeof reverseIPSchema>;

const fetchReverseIPData = async (ip_or_domain: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/reverse_ip_lookup/${ip_or_domain}`,
  );
  return response.data;
};

const ReverseIPLookup = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const form = useForm<ReverseIPRecord>({
    resolver: zodResolver(reverseIPSchema),
    defaultValues: {
      ip_or_domain: "",
    },
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reverseIPLookup", form.getValues("ip_or_domain")],
    queryFn: async () => fetchReverseIPData(form.getValues("ip_or_domain")),
    enabled: false,
  });

  const onSubmit = (formData: ReverseIPRecord) => {
    console.log({ formData });
    refetch();
  };

  return (
    <>
      <div className="container mx-auto md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Reverse IP Lookup
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
                  name="ip_or_domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Address or Domain</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter IP address or domain"
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
              onClick={form.handleSubmit(onSubmit)}
              className="flex w-fit justify-self-start"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Check IP/Domain"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="container mx-auto pb-10">
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-2/3" />
            ) : isError ? (
              <Alert title="Error" description={error.message} type="error" />
            ) : data ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Reverse IPs </h3>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-11 hover:text-slate-12 flex w-fit items-center gap-2"
                    onClick={() =>
                      copyToClipboard(JSON.stringify(data, null, 2))
                    }
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                </div>
                <pre className="max-h-70 overflow-y-auto rounded-md p-2 text-sm">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ReverseIPLookup;
