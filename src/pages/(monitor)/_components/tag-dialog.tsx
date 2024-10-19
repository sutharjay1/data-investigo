import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useModal } from "@/hooks/use-modal";
import { Search, Tag } from "lucide-react";
import React, { useEffect, useState } from "react";
import { SiteInfo } from "../monitor-id";

type Props = {
  label: string;
  site: SiteInfo;
};

const TagDialog: React.FC<Props> = ({ label, site }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(site?.tags || []);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useModal();

  const onTagsUpdate = (tags: string[]) => {
    const updatedSite = { ...site, tags };
    fetch(`${import.meta.env.VITE_SERVER_URL}/sites/${site.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSite),
    });
  };

  useEffect(() => {
    setAvailableTags([
      "production",
      "development",
      "testing",
      "critical",
      "non-critical",
    ]);
  }, []);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSelectAll = () => {
    setSelectedTags(availableTags);
  };

  const handleDeselectAll = () => {
    setSelectedTags([]);
  };

  const handleSave = () => {
    onTagsUpdate(selectedTags);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => (open ? onOpen() : onClose())}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full gap-2 px-0 hover:bg-primary/20"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen();
          }}
        >
          <Tag className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Manage Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                  Deselect All
                </Button>
              </div>
              <ScrollArea className="h-[200px]">
                {filteredTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => handleTagToggle(tag)}
                    />
                    <label
                      htmlFor={tag}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {tag}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TagDialog;
