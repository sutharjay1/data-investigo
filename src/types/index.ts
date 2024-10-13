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
