import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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

const tokenSchema = z.object({
  token: z.string().nonempty("Token is required"),
});

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/confirm-email/${token}/`,
        { token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      console.log("Email verification successful");
    },
    onError: (error) => {
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
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Confirm Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mutation.isIdle && (
            <P className="text-center text-text">
              Initializing verification...
            </P>
          )}
          {mutation.isPending && (
            <div className="flex flex-col items-center space-y-2">
              <RiLoader2Fill className="h-8 w-8 animate-spin text-blue-500" />
              <P className="text-text">Verifying email... </P>
            </div>
          )}
          {mutation.isError && (
            <div className="text-center">
              <P className="mb-4 text-red-500">
                Verification failed. Please try again.
              </P>
              <P className="text-sm text-text">{mutation.error.message} </P>
            </div>
          )}
          {mutation.isSuccess && (
            <P className="text-center text-green-500">
              Your email has been verified successfully!
            </P>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleNavigateToAuth}
            className="w-full max-w-xs"
            disabled={mutation.isPending}
          >
            {mutation.isSuccess ? "Go to Login" : "Back to Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
