import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

// Schema with `newPassword` and `confirmPassword`
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type TResetPassword = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [cookies] = useCookies(["token"]);
  const { token } = useParams();

  const navigate = useNavigate();

  console.log({
    token,
  });

  const form = useForm<TResetPassword>({
    mode: "onChange",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Mutation for resetting the password
  const mutation = useMutation({
    mutationFn: async (data: TResetPassword) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/reset-password?token=${token}`,
        {
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.message) {
        toast.success(data.message, {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        });

        navigate(`/auth?mode=login`);
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || "Failed to reset password.",
        {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.35)",
            borderColor: "rgba(255, 0, 0, 0.5)",
          },
        },
      );
    },
  });

  const handleResetPassword = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

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
                Reset Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Enter your new password"
                            className="mt-1.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Confirm your new password"
                            className="mt-1.5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleResetPassword()}
                className="flex w-fit justify-self-start"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
