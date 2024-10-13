"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";

import Alert from "@/components/global/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const scope = searchParams.get("scope");
  const authuser = searchParams.get("authuser");
  const prompt = searchParams.get("prompt");

  const mutation = useMutation<AuthResponse, AxiosError, string>({
    mutationFn: async (code: string) => {
      const res = await axios.get<AuthResponse>(
        `${import.meta.env.VITE_SERVER_URL}/auth/google/callback?code=${code}&scope=${scope}&authuser=${authuser}&prompt=${prompt}`,
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Successfully authenticated", data);
      // Here you might want to store the token in localStorage or a state management solution
      // and redirect the user to the main application page
    },
    onError: (error) => {
      console.error("Authentication failed", error);
    },
  });

  useEffect(() => {
    if (code) {
      mutation.mutate(code);
    }
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Google Authentication</CardTitle>
          <CardDescription>Processing your login request</CardDescription>
        </CardHeader>
        <CardContent>
          {!code && (
            <Alert
              title="Authentication Failed"
              description="No OAuth code found."
              type="error"
            />
          )}
          {mutation.isPending && (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p>Processing OAuth code...</p>
            </div>
          )}
          {mutation.isSuccess && (
            <Alert
              title="Authentication Successful"
              description="You're now logged in."
              type="success"
            />
          )}
          {mutation.isError && (
            <Alert
              title="Authentication Failed"
              description={mutation.error.message}
              type="error"
            />
          )}
          <div className="mt-6 text-center">
            <Button onClick={() => (window.location.href = "/")}>
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
