import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { H2, P } from "@/components/ui/typography";
import { Calendar, Globe, Lock, Shield, User } from "lucide-react";
import * as React from "react";

type DomainCheckResult = {
  domain_name: string;
  status: string;
  creation_date: string;
  updated_date: string;
  expiry_date: string;
  registrar: string;
  days_left: number;
  privacy_protection: boolean;
  registrar_lock: boolean;
  dnssec_status: string;
};

interface DomainResultProps {
  result: DomainCheckResult | null;
  isLoading: boolean;
}

const DomainResult: React.FC<DomainResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!result) {
    return null;
  }

  const expiryProgress = ((365 - result.days_left) / 3.65).toFixed(2);
  const expiryDate = new Date(result.expiry_date);
  const creationDate = new Date(result.creation_date);

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-900/60 to-transparent text-text">
        <CardTitle className="text-2xl font-bold">
          Domain Check Result
        </CardTitle>
        <CardDescription>
          <Button
            variant="link"
            className="justify--start flex text-left"
            onClick={() => window.open(`https://${result.domain_name}`)}
          >
            <P className="text-lg font-semibold">{result.domain_name}</P>
          </Button>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <StatusItem
            icon={<Globe className="h-5 w-5" />}
            label="Status"
            value={result.status}
          />
          <StatusItem
            icon={<User className="h-5 w-5" />}
            label="Registrar"
            value={result.registrar}
          />
          <StatusItem
            icon={<Calendar className="h-5 w-5" />}
            label="Creation Date"
            value={creationDate.toLocaleDateString()}
          />
          <StatusItem
            icon={<Calendar className="h-5 w-5" />}
            label="Expiry Date"
            value={expiryDate.toLocaleDateString()}
          />
        </div>

        <div className="mb-6 space-y-2">
          <H2 className="text-lg font-semibold">Expiry Progress</H2>
          <Progress value={parseFloat(expiryProgress)} className="h-2 w-full" />
          <P className="text-sm text-text">
            {result.days_left} days left until expiry
          </P>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <SecurityItem
            icon={<Shield className="h-5 w-5" />}
            label="Privacy Protection"
            enabled={result.privacy_protection}
          />
          <SecurityItem
            icon={<Lock className="h-5 w-5" />}
            label="Registrar Lock"
            enabled={result.registrar_lock}
          />
        </div>

        <div>
          <H2 className="mb-1 text-lg font-semibold text-text">
            DNSSEC Status
          </H2>
          <P className="text-textSecondary">{result.dnssec_status}</P>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-text">
      {icon}
    </div>
    <div>
      <P className="text-sm font-medium text-text">{label}</P>
      <P className="font-semibold text-textSecondary [&:not(:first-child)]:mt-0">
        {value}
      </P>
    </div>
  </div>
);

const SecurityItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
}> = ({ icon, label, enabled }) => (
  <Badge className="cursor-pointer" variant={"secondary"}>
    <div className={`flex items-center space-x-2 rounded-full px-1 py-1`}>
      {icon}
      <span className="text-sm font-medium text-text">{label}</span>
      <Badge
        variant={enabled ? "success" : "destructive"}
        className="text-xs font-bold text-text"
      >
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
  </Badge>
);

const LoadingSkeleton: React.FC = () => (
  <Card className="w-full">
    <CardHeader>
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="mb-6 grid gap-6 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
      <div className="mb-6 space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div>
        <Skeleton className="mb-2 h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
      </div>
    </CardContent>
  </Card>
);

export default DomainResult;
