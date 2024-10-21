import { Badge } from "@/components/ui/badge";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/hooks/use-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Save, Search, X } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { RiLoader2Fill } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import { SiteInfo } from "../monitor-id";

type Props = {
  ref: React.RefObject<HTMLDivElement>;
  site: SiteInfo;
  protocol: string;
  refetchSiteInfo: any;
};

const formSchema = z.object({
  tags: z.array(z.string().min(1, "Tag is required")),
  protocol: z.enum(["http", "https"], {
    errorMap: () => ({ message: "Protocol is required" }),
  }),
});

const updateSiteTags = async ({
  protocol,
  domain,
  tag,
}: {
  protocol: string;
  domain: string;
  tag: string;
}): Promise<SiteInfo> => {
  const response = await axios.post(
    `${import.meta.env.VITE_DOMAIN_URL}/add_tag_to_site`,
    { protocol, domain, tag },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );
  return response.data;
};

export default function TagDialog({
  ref,
  site,
  protocol,
  refetchSiteInfo,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTags, setAvailableTags] = useState<string[]>(
    site?.tags || [],
  );
  const queryClient = useQueryClient();
  const { onClose } = useModal();

  console.log({
    site,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: site?.tags || [],
      protocol: protocol as "http" | "https",
    },
  });

  const updateTagsMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const results = await Promise.all(
        formData.tags.map((tag) =>
          updateSiteTags({
            protocol: formData.protocol,
            domain: site.url[0].replace(/(^\w+:|^)\/\//, ""),
            tag,
          }),
        ),
      );
      return results[results.length - 1];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["sites", site.id], data);
      setIsOpen(false);

      toast.success(data.status, {
        duration: 3000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
      refetchSiteInfo();
      onClose();
      form.resetField("tags");
    },
    onError: (error) => {
      console.error("Error updating tags:", error);
      // Handle error (e.g., show an error message to the user)
    },
  });

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = (values: z.infer<typeof formSchema>) => {
    updateTagsMutation.mutate(values);
  };

  const handleSelectAll = () => {
    form.setValue("tags", availableTags);
  };

  const handleDeselectAll = () => {
    form.setValue("tags", []);
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = form.getValues("tags");
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    form.setValue("tags", updatedTags);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      ref={ref}
    >
      <div className="container mx-auto max-w-2xl pb-8 md:pb-0">
        <Button
          className="absolute right-4 top-4"
          variant="ghost"
          onClick={() => {
            setIsOpen(false);
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>

        <Card className="mx-auto w-full shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Manage Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-4"
              >
                <div className="relative flex items-center">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                </div>
                <ScrollArea className="h-[200px] p-2">
                  <div className="space-y-2">
                    {filteredTags.map((tag) => (
                      <FormItem
                        key={tag}
                        className="flex items-center space-x-2"
                      >
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={form.getValues("tags").includes(tag)}
                            onChange={() => handleTagToggle(tag)}
                          />
                        </FormControl>
                        <FormLabel className="m-0">
                          <Badge variant="outline">{tag}</Badge>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </div>
                  {searchQuery && !filteredTags.includes(searchQuery) && (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={form.getValues("tags").includes(searchQuery)}
                        />
                      </FormControl>
                      <FormLabel className="m-0 font-normal text-green-500">
                        Create "{searchQuery}"
                      </FormLabel>
                    </FormItem>
                  )}
                </ScrollArea>
                <FormField
                  control={form.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocol</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a protocol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="http">HTTP</SelectItem>
                          <SelectItem value="https">HTTPS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              onClick={form.handleSubmit(handleSave)}
              className="flex w-fit justify-self-start"
              disabled={updateTagsMutation.isPending}
            >
              {updateTagsMutation.isPending ? (
                <>
                  <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
