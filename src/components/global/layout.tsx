import UserDropdownMenu from "@/components/global/user-avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DomainMode } from "@/types";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  ChevronRight,
  Globe,
  Home,
  Menu,
  MonitorIcon,
  Network,
  ShieldCheck,
  Wifi,
} from "lucide-react";

const menuItems = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Dashboard",
    href: "/u",
  },
  {
    icon: <MonitorIcon className="h-5 w-5" />,
    label: "Domain",
    subItems: [
      { icon: <Globe className="h-5 w-5" />, mode: DomainMode.MONITOR },
      {
        icon: <ShieldCheck className="h-5 w-5" />,
        mode: DomainMode.SSL_MONITORING,
      },
      { icon: <Network className="h-5 w-5" />, mode: DomainMode.SUB_DOMAIN },
      { icon: <Wifi className="h-5 w-5" />, mode: DomainMode.WHAT_IS_MY_IP },
    ],
  },
];

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(-1);
  const [expandedItems, setExpandedItems] = useState<{
    [key: number]: boolean;
  }>({});
  const [showNav, setShowNav] = useState(false);

  const handleItemClick = (index: number) => {
    setActiveItem(activeItem === index ? -1 : index);
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavClick = () => {
    setShowNav(!showNav);
  };

  const handleSubItemClick = (subItem: {
    icon: React.ReactNode;
    mode: string;
  }) => {
    navigate({
      pathname: `/u/${subItem.mode.toLowerCase().replace(/ /g, "-")}`,
    });
  };

  const NAV_LINKS = [
    { name: "Domains", href: "/domains" },
    { name: "Monitor", href: "/monitor" },
    { name: "SSL", href: "/ssl" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="border-slate-4 bg-slate-1 dark:border-slate-6 hidden h-screen w-[250px] flex-shrink-0 flex-col justify-between border-r dark:bg-background md:flex">
        <div className="flex h-full flex-col px-4">
          <div className="flex h-[60px] items-center justify-start px-2 pt-2">
            <img src="/src/assets/logo.svg" className="h-8 w-auto" alt="logo" />
          </div>
          {/* <nav className="mt-6 flex-1">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <li>
 

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-slate-11 hover:text-slate-12 flex h-9 items-center gap-2 rounded-md px-2 text-sm",
                        activeItem === index
                          ? "text-secondary-foreground"
                          : "hover:text-accent-foreground",
                      )}
                      onClick={() => handleItemClick(index)}
                    >
                      <div className="text-slate-11 opacity-80 invert dark:invert-0">
                        {item.icon}
                      </div>
                      {item.label}
                    </Button>

                    <div className="w-56 p-2">
                      {item.subItems.map((subItem, subIndex) => (
                        <Button
                          key={subIndex}
                          className={cn(
                            "text-slate-11 hover:text-slate-12 flex h-9 w-full items-center justify-start gap-2 rounded-md px-2 text-sm",
                          )}
                          onClick={() =>
                            navigate({
                              pathname: `/u/${subItem.mode
                                .toLowerCase()
                                .replace(/ /g, "-")}`,
                            })
                          }
                        >
                          {subItem.icon}
                          {subItem.mode}
                        </Button>
                      ))}
                    </div>
                  </div>
            
                </li>
              ))}
            </ul>
          </nav> */}

          <nav className="mt-6 flex-1">
            <ul className="flex flex-col gap-2">
              {menuItems.map((item, index) => (
                <li key={index} className="relative">
                  {item.href ? (
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex h-9 items-center justify-between gap-2 rounded-md px-2 text-sm text-text/90 hover:text-text",
                        // activeItem === index
                        //   ? "text-secondary-foreground"
                        //   : "hover:text-accent-foreground",
                      )}
                      asChild
                    >
                      <Link to={item.href}>
                        <span className="flex items-center gap-2">
                          <span className="text-text/90 hover:text-text">
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex h-9 items-center justify-between gap-2 rounded-md px-2 text-sm text-text/90 hover:text-text",
                        // activeItem === index
                        //   ? "text-secondary-foreground"
                        //   : "hover:text-accent-foreground",
                      )}
                      onClick={() => handleItemClick(index)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-text/90 hover:text-text">
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      {item.subItems &&
                        (expandedItems[index] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        ))}
                    </Button>
                  )}

                  {expandedItems[index] && item.subItems && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "flex h-9 items-center gap-2 rounded-md px-2 text-sm",
                              // activeItem === index ? "text-text" : "text-text",
                            )}
                            onClick={() => handleSubItemClick(subItem)}
                          >
                            <span className="text-text/90 hover:text-text">
                              {subItem.icon}
                            </span>
                            {subItem.mode}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="p-4">
          <UserDropdownMenu />
        </div>
      </aside>

      {/* Desktop Info Bar  */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-slate-6 hidden h-[60px] items-center justify-end border-b px-6 md:flex">
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserDropdownMenu />
          </div>
        </header>

        <header className="flex w-full items-center justify-between px-6 py-4 md:hidden">
          <div className="flex items-center">
            <img
              src="/src/assets/logo.svg"
              className="h-auto w-20"
              alt="logo"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center"
            onClick={handleNavClick}
          >
            <div className="flex items-center gap-4">
              <Menu className="" />
            </div>
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-lg pt-0 md:p-6">{children}</div>
          </div>
        </main>
      </div>

      {showNav && (
        <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur-sm md:hidden">
          <nav className="flex justify-around border-t border-border">
            {NAV_LINKS.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-1 flex-col items-center justify-center px-1 py-2",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground",
                )}
                onClick={() => navigate(link.href)}
              >
                {/* <div className="mb-1 h-6 w-6">{link.icon}</div> */}
                <span className="text-xs">{link.name}</span>
              </Button>
            ))}
          </nav>
        </div>
      )}

      {/* Mobile Bottom Menu */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t bg-background shadow-md md:hidden">
        {menuItems.map((item, index) => (
          <div key={index} className="relative">
            {item.href ? (
              <Button
                variant="ghost"
                className={cn(
                  "flex h-9 items-center justify-between gap-2 rounded-md px-2 text-sm text-text/90 hover:text-text",
                  // activeItem === index
                  //   ? "text-secondary-foreground"
                  //   : "hover:text-accent-foreground",
                )}
                asChild
              >
                <Link to={item.href}>
                  <span className="flex items-center gap-2 text-text/90 hover:text-text">
                    {item.icon}
                  </span>
                </Link>
              </Button>
            ) : (
              <Sheet key={index}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex h-9 items-center justify-between gap-2 rounded-md px-2 text-sm text-text/90 hover:text-text",
                    )}
                  >
                    {item.icon}
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
                    {item?.subItems?.map((subItem, subIndex) => (
                      <Button
                        key={subIndex}
                        variant="ghost"
                        className={cn(
                          "text-slate-11 hover:text-slate-12 flex h-9 w-full items-center justify-start gap-2 rounded-md px-2 text-sm",
                        )}
                        onClick={() =>
                          navigate({
                            pathname: `/u/${subItem.mode
                              .toLowerCase()
                              .replace(/ /g, "-")}`,
                          })
                        }
                      >
                        {subItem.icon}
                        {subItem.mode}
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;
