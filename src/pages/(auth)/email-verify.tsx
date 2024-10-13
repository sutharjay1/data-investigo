import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { P } from "@/components/ui/typography";
import { RiLoader2Fill } from "react-icons/ri";
import Alert from "@/components/global/alert";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tokenSchema = z.object({
  token: z.string().nonempty("Token is required"),
});

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [emailExists, setEmailExists] = useState(false);

  const mutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/confirm-email/${token}/`,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Email verification successful");

      console.log(data);
      console.log(JSON.stringify(data, null, 2));
    },
    onError: (error: any) => {
      if (error?.response?.data?.detail === "Email already verified.") {
        setEmailExists(true);
        return;
      }

      toast.error(error?.response?.data?.detail, {
        duration: 10000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
      console.error("Error during email verification:", error);
    },
  });

  useEffect(() => {
    if (token) {
      const parsedToken = tokenSchema.safeParse({ token });
      if (parsedToken.success) {
        mutation.mutate(token);
      }
    }
  }, []);

  const handleNavigateToAuth = () => navigate("/auth");

  return (
    <>
      <div className="absolute inset-0 z-10">
        <video className="h-full w-full object-cover" autoPlay loop muted>
          <source
            src="https://res.cloudinary.com/sutharjay/video/upload/v1728813623/freelance_assets/qcufoiqytxoybsz7vpdw.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div
        className={cn(
          "relative z-20 mx-auto flex h-screen w-full max-w-2xl items-center justify-center px-2 md:px-6",
        )}
      >
        <div className="container mx-auto md:pb-0">
          <Card className="mx-auto w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Confirm Your Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mutation.isIdle && (
                <P className="text-text">Initializing verification...</P>
              )}
              {mutation.isPending && (
                <div className="flex flex-col items-center space-y-2">
                  <RiLoader2Fill className="h-8 w-8 animate-spin text-blue-500" />
                  <P className="text-text">Verifying email... </P>
                </div>
              )}
              {mutation.isError && !emailExists && (
                <div className="">
                  <Alert
                    title="Error"
                    description={mutation.error.message}
                    type="error"
                  />
                </div>
              )}
              {emailExists && !mutation.isPending && (
                <Alert
                  title="Success"
                  description="Email already verified. You can now login."
                  type="success"
                />
              )}
              {mutation.isSuccess && (
                <Alert
                  title="Success"
                  description={"Email verified."}
                  type="success"
                />
              )}
            </CardContent>
            <CardFooter className="flex">
              <Button
                onClick={handleNavigateToAuth}
                className="flex w-fit justify-self-start"
                disabled={mutation.isPending}
              >
                {mutation.isSuccess ? "Go to Login" : "Back to Login"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
