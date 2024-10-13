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

const asnSchema = z.object({
  asn_number: z.string().min(1, "ASN number is required"),
});

type ASNRecord = z.infer<typeof asnSchema>;

const fetchASNData = async (asn_number: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_DOMAIN_URL}/asn_lookup/${asn_number}`,
  );
  return response.data;
};

const ASNLookup = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<ASNRecord>({
    resolver: zodResolver(asnSchema),
    defaultValues: {
      asn_number: "",
    },
  });

  const { data, isLoading, isError, error, refetch, isSuccess } = useQuery({
    queryKey: ["asnLookup", form.getValues("asn_number")],
    queryFn: async () => fetchASNData(form.getValues("asn_number")),
    enabled: false,
  });

  const onSubmit = (formData: ASNRecord) => {
    console.log({ formData });
    refetch();
  };

  useEffect(() => {
    if (data) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, isLoading, isError, error, isSuccess]);

  return (
    <>
      <div className="container mx-auto pb-8 md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">ASN Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="asn_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ASN Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter ASN number"
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
              {isLoading ? "Checking..." : "Check ASN"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="container mx-auto pb-10" ref={resultRef}>
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-6 w-2/3" />
            ) : isError ? (
              <Alert title="Error" description={error.message} type="error" />
            ) : data ? (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">ASN Data</h3>

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

export default ASNLookup;
