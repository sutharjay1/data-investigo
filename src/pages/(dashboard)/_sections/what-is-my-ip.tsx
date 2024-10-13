import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { H2, P, TypographyLead } from "@/components/ui/typography";
import { copyToClipboard } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Copy, MapPin, RefreshCw } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type IPInfo = {
  ip: string;
  error: boolean;
  reason: string;
  reserved: boolean;
  version: "IPv4" | "IPv6";
};

const WhatIsMyIP: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const [copied, setCopied] = useState(false);

  const {
    data: ipInfo,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<IPInfo, Error>({
    queryKey: ["ipInfo"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_DOMAIN_URL}/ip_info`,
      );
      return response.data;
    },
    enabled: false,
  });

  return (
    <>
      <div className="container mx-auto pb-8 md:pb-0" ref={ref}>
        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>IP Information</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                <span className="ml-2">Refresh</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ) : isError ? (
              <div className="rounded-md bg-destructive/10 p-4 text-destructive">
                <P>Error: {error.message}</P>
                <P>
                  Please try again later or contact support if the problem
                  persists.
                </P>
              </div>
            ) : ipInfo ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <H2 className="text-2xl font-semibold">
                    <TypographyLead className="text-2xl">
                      {ipInfo.ip}
                    </TypographyLead>
                  </H2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      copyToClipboard(ipInfo.ip);
                      setCopied(true);
                      toast.success("IP copied to clipboard!");
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy IP"}
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Version</p>
                    <Badge variant="outline">{ipInfo.version}</Badge>
                  </div>
                  {/* <Separator orientation="vertical"  /> */}
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Reserved</p>
                    <Badge
                      variant="outline"
                      className={
                        ipInfo.reserved ? "text-red-500" : "text-green-500"
                      }
                    >
                      {ipInfo.reserved ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 aspect-video w-full rounded-md bg-accent">
                  <div className="flex h-full items-center justify-center">
                    <MapPin className="h-8 w-8 text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      Map placeholder
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <P className="text-center text-muted-foreground">
                  Click the refresh button to fetch your IP information.
                </P>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default WhatIsMyIP;
