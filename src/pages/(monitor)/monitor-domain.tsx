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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { P } from "@/components/ui/typography";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MoreVertical, PlusIcon, TrashIcon } from "lucide-react";
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

import Alert from "@/components/global/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Copy, Edit2, Pause, RotateCcw, Rss, Tag, Trash2 } from "lucide-react";
import { RiToolsFill } from "react-icons/ri";

export const siteDropdownItems = [
  {
    label: "Edit monitor",
    icon: Edit2,
    action: "edit",
    variant: "default",
  },

  {
    label: "Maintenance",
    icon: RiToolsFill,
    action: "maintenance",
    variant: "default",
  },
  {
    label: "Add tags",
    icon: Tag,
    action: "addTags",
    variant: "default",
  },
  {
    label: "Add to status page",
    icon: Rss,
    action: "addToStatusPage",
    variant: "default",
  },
  {
    label: "Clone monitor",
    icon: Copy,
    action: "clone",
    variant: "default",
  },
  {
    label: "Pause monitor",
    icon: Pause,
    action: "pause",
    variant: "default",
  },
  {
    label: "Reset stats",
    icon: RotateCcw,
    action: "resetStats",
    variant: "default",
  },
  {
    label: "Delete monitor",
    icon: Trash2,
    action: "delete",
    variant: "destructive",
  },
] as const;

export default function MonitorDomain() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("down");
  const navigate = useNavigate();
  const [selectedSites, setSelectedSites] = useState<ResponseBody[]>([]);

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

  const { mutate: deleteMutate } = useMutation({
    mutationFn: removeSite,
    onSuccess: () => {
      refetch();
      toast.success("Site removed successfully", {
        duration: 2000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
    },
  });

  const filteredSites = sites?.filter(
    (site) =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.some((url) =>
        url.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const handleDelete = (site: ResponseBody) => {
    const [protocol, domain] = site.url[0].split("://");
    deleteMutate({ protocol, domain });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredSites) {
      setSelectedSites(filteredSites);
    } else {
      setSelectedSites([]);
    }
  };

  const handleSelectSite = (site: ResponseBody, checked: boolean) => {
    if (checked) {
      setSelectedSites((prev) => [...prev, site]);
    } else {
      setSelectedSites((prev) => prev.filter((s) => s.id !== site.id));
    }
  };

  useEffect(() => {
    console.log("Selected Sites:", selectedSites);
  }, [selectedSites]);

  const isAllSelected =
    filteredSites?.length === selectedSites.length && filteredSites?.length > 0;

  return (
    <InnerLayout
      label="Monitor Domain"
      className="container mx-auto space-y-3 pb-10 pt-0"
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
      <P className="max-w-prose pb-4 text-base text-text/90">
        DNS Tools lets you perform various DNS lookups, domain checks, and other
        utilities. Select a tool to get started.
      </P>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="flex flex-col items-start justify-between md:flex-row md:items-center">
            <div className="flex items-center gap-x-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <P className="text-2xl font-bold text-text [&:not(:first-child)]:mt-0">
                Site Monitors
              </P>
            </div>
            <div className="flex items-center justify-between gap-x-2 pt-4 md:pt-0">
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-fit gap-x-2">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="down">Down</SelectItem>
                  <SelectItem value="up">Up</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-[75%]" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <Alert description={error.message} title="Error" type="error" />
          ) : filteredSites && filteredSites.length > 0 ? (
            <div className="space-y-4">
              {filteredSites.map((site) => (
                <Card
                  key={site.id}
                  className="group cursor-pointer shadow-transparent md:shadow-transparent"
                >
                  <CardHeader
                    className="p-0"
                    badgeClassName={cn(
                      site.status === "Status Up"
                        ? "border-green-600 bg-green-600 animate-pulse  "
                        : site.status === "Status Down"
                          ? "bg-destructive/40"
                          : "bg-secondary/40",
                    )}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <Checkbox
                          checked={selectedSites.some((s) => s.id === site.id)}
                          onCheckedChange={(checked) => {
                            handleSelectSite(site, checked as boolean);
                            // Prevent card click when checking/unchecking
                            // event?.stopPropagation();
                          }}
                          className={cn(
                            "mr-2 hidden transition-all duration-100 ease-in-out group-hover:block",
                            isAllSelected ? "block" : "hidden",
                          )}
                        />

                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/monitor/${site.url[0].replace("https://", "").replace("http://", "")}?protocol=${site.url[0].split("://")[0]}`,
                            );
                          }}
                        >
                          <P className="text-2xl font-semibold">{site.name}</P>
                          <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                            {site.url[0]}
                          </P>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <P className="hidden text-sm text-muted-foreground md:flex">
                          Last Checked:{" "}
                          {site.last_checked
                            ? new Date(site.last_checked).toLocaleString()
                            : "N/A"}
                        </P>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex h-8 w-8 justify-center p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {siteDropdownItems.map((item) => (
                              <DropdownMenuItem
                                key={item.label}
                                className={cn(
                                  "flex h-9 items-center justify-start gap-2 rounded-md px-2 text-sm text-text/90",
                                  item?.variant === "destructive"
                                    ? "px-0 text-red-600 hover:text-red-600"
                                    : "hover:text-text",
                                )}
                              >
                                {item.label === "Delete monitor" ? (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="flex h-9 w-full items-center justify-start gap-4 rounded-md p-2 text-sm text-text/90"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                        Delete
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This action cannot be undone. This
                                          will permanently delete the monitor
                                          for {site.url[0]}.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            if (
                                              item.variant === "destructive"
                                            ) {
                                              handleDelete(site);
                                            }
                                          }}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                ) : (
                                  <>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                  </>
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              No monitored sites found. Add a new monitor to get started.
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          <P className="text-sm text-muted-foreground">
            Total sites: {filteredSites?.length || 0}
          </P>
          <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
            Selected sites: {selectedSites.length} /{" "}
            {filteredSites?.length || 0}
          </P>
        </CardFooter>
      </Card>
    </InnerLayout>
  );
}
