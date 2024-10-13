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
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Please enter an email address." })
    .email({ message: "Please enter a valid email address." }),
});

type TForgotPassword = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [cookies] = useCookies(["token"]);

  const form = useForm<TForgotPassword>({
    mode: "onChange",
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/forgot-password`,
        { email },
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
      if (data.status_code === 200) {
        toast.success(data.message, {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        });
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || "Failed to send password reset email.",
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

  const handleForgotPassword = form.handleSubmit((values) => {
    if (!values.email) {
      return toast.error("Please enter an email address.", {
        duration: 2000,
        richColors: true,
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    }
    mutation.mutate(values.email);
  });

  return (
    <>
      <div className="absolute inset-0 z-10">
        <video className="h-full w-full object-cover" autoPlay loop muted>
          <source src="https://res.cloudinary.com/sutharjay/video/upload/v1728813623/freelance_assets/qcufoiqytxoybsz7vpdw.mp4" type="video/mp4" />
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
                Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="email"
                            placeholder="Enter your email address"
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
                onClick={handleForgotPassword}
                className="flex w-fit justify-self-start"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
