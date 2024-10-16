import { z } from "zod";

export const authSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .extend({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type TAuthSchema = z.infer<typeof authSchema>;

export const dnsSchema = z.object({
  domain_name: z.string().min(3, "Domain name is required"),
  record_type: z
    .enum([
      "",
      "A",
      "AAAA",
      "CNAME",
      "MX",
      "NS",
      "TXT",
      "SOA",
      "SRV",
      "CAA",
      "PTR",
      "CERT",
    ])
    .optional(),
});

export type DNSRecord = z.infer<typeof dnsSchema>;

export type AuthMode = "LOGIN" | "SIGNUP";

export enum DashBoardMode {
  DOMAIN = "Domain",
  SERVER = "Server",
  TICKET = "Ticket",
  ASSET = "Asset",
}

export enum DomainMode {
  MONITOR = "Monitor",
  SUB_DOMAIN = "Sub Domain Find",
  SSL_MONITORING = "SSL Monitoring",
  WHAT_IS_MY_IP = "What is my IP",
}

export enum DNS {
  SUB_DOMAIN_DISCOVERY = "Sub Domain Discovery",
  DNS_RECORDS = "DNS Records",
  ASN_LOOKUP = "ASN Lookup",
  REVERSE_IP_LOOKUP = "Reverse IP Lookup",
}

export type DNS_RECORDS_QUERY = {
  record_type: string;
  address: string;
  ttl: number;
  error?: string;
};

export type SSL_Monitoring_Response = {
  Domain: string;
  "Common Name (CN)": string;
  "CNAME Record": string | null;
  "IP Address": string;
  "Organization (O) - Issued To": string | null;
  "Organization Unit (OU) - Issued To": string | null;
  "Organization (O) - Issued By": string;
  "Organization Unit (OU) - Issued By": string | null;
  "Valid from": string;
  "Valid to": string;
  "Days until expiry": number;
  "SSL Key Size": number;
  "Subject Alternative Names (SANs)": string[];
  "CN and Hostname Match": boolean;
  "Wildcard Domain": string | null;
  "CN is Wildcard and Matches with Subdomain": boolean;
  "Recipient Email": string | null;
};

// export enum Protocol {
//   HTTP = "http",
//   HTTPS = "https",
// }

export type Protocol = "http" | "https";

export type Interval =
  | "10 seconds"
  | "20 seconds"
  | "30 seconds"
  | "40 seconds"
  | "50 seconds"
  | "60 seconds"
  | "1 minute"
  | "2 minutes"
  | "3 minutes"
  | "4 minutes"
  | "5 minutes"
  | "6 minutes"
  | "7 minutes"
  | "8 minutes"
  | "9 minutes"
  | "10 minutes"
  | "11 minutes"
  | "12 minutes"
  | "13 minutes"
  | "14 minutes"
  | "15 minutes"
  | "16 minutes"
  | "17 minutes"
  | "18 minutes"
  | "19 minutes"
  | "20 minutes"
  | "21 minutes"
  | "22 minutes"
  | "23 minutes"
  | "24 minutes"
  | "25 minutes"
  | "26 minutes"
  | "27 minutes"
  | "28 minutes"
  | "29 minutes"
  | "30 minutes"
  | "31 minutes"
  | "32 minutes"
  | "33 minutes"
  | "34 minutes"
  | "35 minutes"
  | "36 minutes"
  | "37 minutes"
  | "38 minutes"
  | "39 minutes"
  | "40 minutes"
  | "41 minutes"
  | "42 minutes"
  | "43 minutes"
  | "44 minutes"
  | "45 minutes"
  | "46 minutes"
  | "47 minutes"
  | "48 minutes"
  | "49 minutes"
  | "50 minutes"
  | "51 minutes"
  | "52 minutes"
  | "53 minutes"
  | "54 minutes"
  | "55 minutes"
  | "56 minutes"
  | "57 minutes"
  | "58 minutes"
  | "59 minutes"
  | "1 hour"
  | "2 hours"
  | "3 hours"
  | "4 hours"
  | "5 hours"
  | "6 hours"
  | "7 hours"
  | "8 hours"
  | "9 hours"
  | "10 hours"
  | "11 hours"
  | "12 hours"
  | "13 hours"
  | "14 hours"
  | "15 hours"
  | "16 hours"
  | "17 hours"
  | "18 hours"
  | "19 hours"
  | "20 hours"
  | "21 hours"
  | "22 hours"
  | "23 hours"
  | "24 hours"
  | "7 days"
  | "30 days"
  | "365 days";
