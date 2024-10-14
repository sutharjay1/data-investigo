import Alert from "@/components/global/alert";
import InnerLayout from "@/components/global/inner-layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/provider/google-provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon, RefreshCcw, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface ResponseBody {
  id: number;
  maintenance: boolean;
  paused: boolean;
  last_checked: string | null;
  interval: number;
  status: string;
  created_at: string;
  name: string;
  url: string[];
  friendly_name: string;
  tags: string[];
}

export default function MonitorDomain() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const fetchAllSites = async (): Promise<ResponseBody[]> => {
    const response = await axios.get(
      `${import.meta.env.VITE_DOMAIN_URL}/all_sites`,
    );
    return response.data.sites || [];
  };

  const {
    data: sites,
    isLoading,
    refetch,
    isError,
    error,
  } = useQuery({
    queryKey: ["monitor_site"],
    queryFn: fetchAllSites,
    enabled: true,
  });

  const removeSite = async ({
    protocol,
    domain,
  }: {
    protocol: string;
    domain: string;
  }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_DOMAIN_URL}/remove_site`,
      { protocol, domain },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      },
    );
    return response.data;
  };

  const filteredSites = sites?.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.some((url) =>
        url.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const { mutate: deleteMutate, data: mutationData } = useMutation({
    mutationKey: ["remove_site"],
    mutationFn: ({ protocol, domain }: { protocol: string; domain: string }) =>
      removeSite({ protocol, domain }),
  });

  const handleDelete = (site: ResponseBody) => {
    const [protocol, domain] = site.url[0].split("://");

    deleteMutate({ protocol, domain });
  };

  useEffect(() => {
    if (mutationData) {
      refetch();

      toast.success(mutationData.status, {
        description: `${mutationData.url} removed successfully`,
        duration: 2000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
    }
  }, [mutationData]);

  return (
    <InnerLayout
      label="SSL Monitoring"
      className="pt-8"
      button={
        <Button
          className="h-9 w-fit py-0"
          variant="default"
          onClick={() => navigate("/monitor/new/http")}
        >
          <PlusIcon className="mr-2 h-4 w-4" strokeWidth={3} />
          <P className="text-sm font-medium text-zinc-100 dark:text-zinc-900 [&:not(:first-child)]:mt-0">
            New Monitor
          </P>
        </Button>
      }
    >
      <Card className="mx-auto w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <P className="text-2xl font-bold text-muted-foreground">
              Site Monitors
            </P>

            <div className="jcustify-end flex w-fit items-center gap-2">
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-fit"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => refetch()}
                title="Refresh"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : isError ? (
            <Alert
              title="Error fetching sites"
              description={error.message}
              type="error"
            />
          ) : filteredSites && filteredSites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.url[0]}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          site.status === "up"
                            ? "success"
                            : site.status === "down"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {site.last_checked
                        ? new Date(site.last_checked).toLocaleString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the monitor for {site.url[0]}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(site)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Alert
              title="No sites found"
              description="No monitored sites found. Add a new monitor to get started."
              type="info"
            />
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <P className="text-sm text-muted-foreground">
            Total sites: {filteredSites?.length || 0}
          </P>
        </CardFooter>
      </Card>
    </InnerLayout>
  );
}
