import InnerLayout from "@/components/global/inner-layout";
import Loading from "@/components/global/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { lazy, Suspense, useEffect, useRef, useState } from "react";

const Domain = lazy(() => import("./domain"));
const SubDomainDiscovery = lazy(() => import("./sub-domain-discovery"));
const WhatIsMyIP = lazy(() => import("./what-is-my-ip"));
const DNSRECORDS = lazy(() => import("./dns-records"));
const ASNLookup = lazy(() => import("./asn-lookup"));

const ReverseIPLookup = lazy(() => import("./reverse-ip-lookup"));

const tools = [
  {
    value: "DOMAIN_CHECKER",
    title: "Domain Checker",
    description: "Check the availability of a domain name.",
  },
  {
    value: "DNS_SUBDOMAIN_FINDER",
    title: "DNS Subdomain Finder",
    description: "Find subdomains associated with a domain.",
  },
  {
    value: "DNS_RECORD",
    title: "DNS Record",
    description: "Lookup DNS records for a specific domain.",
  },
  {
    value: "ASN_LOOKUP",
    title: "ASN Lookup",
    description: "Find the Autonomous System Number (ASN) for a domain or IP.",
  },
  {
    value: "IP_INFO",
    title: "IP Info",
    description: "Get detailed information about an IP address.",
  },
  {
    value: "REVERSE_LOOKUP",
    title: "Reverse Lookup",
    description: "Find the domain name associated with an IP address.",
  },
];

const Monitor = () => {
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [showTools, setShowTools] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const handleViewAllTools = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setShowTools(true);
  };

  useEffect(() => {
    if (showTools) {
      setTimeout(() => {
        setShowTools(false);
      }, 3000);
    }
  }, [showTools]);

  const handleToolChange = (value: string) => {
    setSelectedTool(value);
  };

  const renderModel = () => {
    switch (selectedTool) {
      case "DOMAIN_CHECKER":
        return <Domain />;
      case "DNS_SUBDOMAIN_FINDER":
        return <SubDomainDiscovery />;
      case "DNS_RECORD":
        return <DNSRECORDS />;
      case "ASN_LOOKUP":
        return <ASNLookup />;
      case "REVERSE_LOOKUP":
        return <ReverseIPLookup />;
      case "IP_INFO":
        return <WhatIsMyIP />;
      default:
        return null;
    }
  };

  return (
    <InnerLayout label="Monitor">
      <div className="container mx-auto space-y-6 pb-10" ref={ref}>
        <P className="text-lg text-text/90">
          DNS Tools lets you perform various DNS lookups, domain checks, and
          other utilities. Select a tool to get started.
        </P>
        <RadioGroup onValueChange={handleToolChange} value={selectedTool}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <Card
                key={tool.value}
                // className={`cursor-pointer transition-all duration-200 ${
                //   selectedTool === tool.value ? "ring-2 ring-primary" : ""
                // }`}

                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedTool === tool.value ? "ring-2 ring-primary" : "",
                  showTools && index === 0
                    ? "border border-primary ease-in-out"
                    : "",
                )}
                onClick={() => handleToolChange(tool.value)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <RadioGroupItem value={tool.value} id={tool.value} />
                    <Label htmlFor={tool.value} className="font-semibold">
                      {tool.title}
                    </Label>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text/90 hover:text-textSecondary">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>

        <Separator />

        <Suspense fallback={<Loading className="h-64 w-full" />}>
          {renderModel()}
        </Suspense>
      </div>
    </InnerLayout>
  );
};

export default Monitor;
