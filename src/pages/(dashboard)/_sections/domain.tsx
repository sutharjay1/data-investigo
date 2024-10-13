import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

import DomainResult from "../_components/domain-result";

const schema = z.object({
  domain_name: z.string().min(1, "Domain name is required"),
  recipient_email: z
    .string()
    .email("Invalid email format")
    .optional()
    .or(z.literal("")),
  reminder_days: z.number().min(1, "Must be at least 1 day").optional(),
});

type DomainFormValues = z.infer<typeof schema>;

// type DomainCheckResult = {
//   domain_name: string;
//   status: string;
//   creation_date: string;
//   updated_date: string;
//   expiry_date: string;
//   registrar: string;
//   days_left: number;
//   privacy_protection: boolean;
//   registrar_lock: boolean;
//   dnssec_status: string;
// };

const Domain: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      domain_name: "",
      recipient_email: "",
      reminder_days: 30,
    },
  });

  const fetchDomain = async ({
    domain_name,
    recipient_email,
    reminder_days,
  }: DomainFormValues) => {
    const params = new URLSearchParams();
    if (recipient_email) {
      params.append("recipient_email", recipient_email);
    }
    if (reminder_days) {
      params.append("reminder_days", reminder_days.toString());
    }

    const response = await axios.post(
      `${import.meta.env.VITE_DOMAIN_URL}/check_domain/${domain_name}?${params.toString()}`,
    );
    return response.data;
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["domain"],
    queryFn: () => fetchDomain(form.getValues()),
    enabled: false,
  });

  const onSubmit = async () => {
    refetch();
  };

  useEffect(() => {
    if (data) {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  return (
    <>
      <div className="container mx-auto md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Check Domain Details
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recipient_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient Email(optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="recipient_email"
                          placeholder="Enter recipient email"
                          className="mt-1.5"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reminder_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reminder Days</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="reminder_days"
                          value={Number(field.value)}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                          }}
                          type="number"
                          placeholder="Reminder days (default 30)"
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
              disabled={
                form.formState.isLoading ||
                form.formState.isSubmitting ||
                isLoading
              }
            >
              {form.formState.isLoading ||
              form.formState.isSubmitting ||
              isLoading
                ? "Checking..."
                : "Check Domain"}
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="container mx-auto pb-10" ref={resultRef}>
        <Card className="mx-auto w-full shadow-md">
          <CardContent>
            {form.formState.isLoading ||
              form.formState.isSubmitting ||
              (isLoading && (
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
              ))}

            {data && (
              <DomainResult
                isLoading={form.formState.isSubmitting}
                result={data}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Domain;
