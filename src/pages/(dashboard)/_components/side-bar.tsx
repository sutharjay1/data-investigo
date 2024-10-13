import UserDropdownMenu from "@/components/global/user-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashBoardMode, DNS, DomainMode } from "@/types";
import { ChevronRight, Home, MonitorIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type MenuItem = {
  icon: React.ReactNode;
  label: string;
  subItems: Array<DashBoardMode | DomainMode | DNS>;
};

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    subItems: [
      DashBoardMode.DOMAIN,
      DashBoardMode.ASSET,
      DashBoardMode.SERVER,
      DashBoardMode.TICKET,
    ],
  },
  {
    icon: <MonitorIcon className="h-5 w-5" />,
    label: "Domain",
    subItems: [
      DomainMode.MONITOR,
      DomainMode.SSL_MONITORING,
      DomainMode.SUB_DOMAIN,
      DomainMode.WHAT_IS_MY_IP,
    ],
  },
  {
    icon: <Home className="h-5 w-5" />,
    label: "DNS",
    subItems: [
      DNS.SUB_DOMAIN_DISCOVERY,
      DNS.DNS_RECORDS,
      DNS.ASN_LOOKUP,
      DNS.REVERSE_IP_LOOKUP,
    ],
  },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const navigate = useNavigate();

  const [openSheet, setOpenSheet] = useState(true);

  useEffect(() => {
    setOpenSheet(false);
  }, [activeItem, navigate]);

  const handleItemClick = (index: number) => {
    setActiveItem(activeItem === index ? null : index);
  };

  return (
    <nav className="flex h-screen flex-col items-center justify-between gap-10 overflow-scroll px-2 pb-2 pt-2 dark:bg-black">
      <div className="flex flex-col items-center justify-center gap-6">
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r bg-background text-foreground shadow-md transition-all duration-300 ease-in-out md:flex">
          <div className="flex items-center justify-center border-b p-4">
            <img src="/src/assets/logo.svg" className="h-8 w-8" alt="logo" />
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item, index) => (
              <DropdownMenu key={index}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start rounded-md px-3 py-2 transition-colors duration-200 ${
                      activeItem === index
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => handleItemClick(index)}
                  >
                    {item.icon}
                    <span className="ml-3 hidden md:inline-flex">
                      {item.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className={`ml-auto hidden transition-transform duration-200 md:flex ${
                        activeItem === index ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 p-2"
                  side="right"
                  align="start"
                  alignOffset={-5}
                  sideOffset={16}
                >
                  {item.subItems.map((subItem, subIndex) => (
                    <DropdownMenuItem
                      key={subIndex}
                      className="p-2"
                      onClick={() =>
                        navigate({
                          pathname: "/u",
                          search: `?mode=${subItem.toLowerCase().replace(/ /g, "-")}`,
                        })
                      }
                    >
                      {subItem}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
          <div className="border-t p-4">
            <UserDropdownMenu />
          </div>
        </aside>

        <div className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t bg-background shadow-md md:hidden">
          {menuItems.map((item, index) => (
            <Sheet key={index} open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-12 w-12">
                  {item.icon}
                  <span className="sr-only">{item.label}</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="flex h-auto flex-col justify-start rounded-t-xl p-4"
              >
                <div className="flex items-center justify-start pl-2 text-center text-lg font-semibold">
                  {item.label}
                </div>
                <nav className="flex flex-col justify-start space-y-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <Button
                      key={subIndex}
                      variant="ghost"
                      className="flex w-full items-center justify-start rounded-md"
                      onClick={() =>
                        navigate({
                          pathname: "/u",
                          search: `?mode=${subItem.toLowerCase().replace(/ /g, "-")}`,
                        })
                      }
                    >
                      {subItem}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          ))}
          <UserDropdownMenu />
        </div>
      </div>
    </nav>
  );
}
