import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/google-provider";
import { AuthMode, TAuthSchema } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { H2, P } from "../ui/typography";
import { RiLoader2Fill } from "react-icons/ri";
import { Separator } from "../ui/separator";

const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  // username: z
  //   .string()
  //   .min(3, { message: "Username must be at least 3 characters" }),
  // confirmPassword: z.string().min(8, {
  //   message: "Password must be at least 8 characters",
  // }),
});
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

const registerUser = async (values: TAuthSchema) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/register`,
    {
      email: values.email,
      password: values.password,
      username: values.username,
    },
  );
  return response.data;
};

const loginUser = async (values: TAuthSchema) => {
  const response = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/login`,

    {
      email: values.email,
      password: values.password,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
  return response.data;
};

const AuthForm = () => {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("LOGIN");

  const [cookies, setCookie] = useCookies(["token", "isLoggedIn"]);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const modeParam = params.get("mode")?.toUpperCase();
    if (modeParam === "LOGIN" || modeParam === "SIGNUP") {
      setMode(modeParam as AuthMode);
    }
  }, [params]);

  const form = useForm<TAuthSchema>({
    mode: "onChange",
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "SIGNUP" ? { username: "", confirmPassword: "" } : {}),
    },
  });

  const { mutate: signup, isPending: isSignupLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.success(data.message, {
        duration: 2000,
        richColors: true,
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.15)",
          border: "0.1px solid rgba(0, 255, 0, 0.2)",
        },
      });
      setCookie("isLoggedIn", "true", { path: "/" });
      navigate("/auth?mode=login", { replace: true });
    },
    onError: (error: any) => {
      console.error(`Failed to sign up: ${error}`);
      toast.error(`Failed to sign up: ${error}`, {
        duration: 2000,
        richColors: true,
        className: " border ",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const { mutate: loginMutation, isPending: isLoginLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(`data: ${JSON.stringify(data)}`);

      if (data.is_verified || true) {
        login({
          accessToken: data.access_token,
          email: data.email,
          username: data.username,
          userId: data.user_id,
          tokenType: "Bearer",
          image: "",
        });
        setCookie("token", data.access_token, { path: "/" });
        setCookie("isLoggedIn", "true", { path: "/" });

        toast.success("Successfully signed in!", {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        });
        navigate("/u", { replace: true });
      } else {
        toast.error("Please verify your email", {
          duration: 2000,
          richColors: true,
          className: " border ",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.35)",
            borderColor: "rgba(255, 0, 0, 0.5)",
          },
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error.detail || "An unexpected error occurred";
      toast.error(`Failed to sign in: ${errorMessage}`, {
        duration: 2000,
        richColors: true,
        className: " border ",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    },
  });

  const onSubmit = (values: TAuthSchema) => {
    console.log(values);

    if (mode === "LOGIN") {
      loginMutation(values);
    } else if (mode === "SIGNUP") {
      signup(values);
    }
  };

  // const onSubmit = async (values: TAuthSchema) => {
  //   const loadingMessage = mode === "LOGIN" ? "Signing in..." : "Signing up...";
  //   const successMessage =
  //     mode === "LOGIN" ? "Successfully signed in!" : "Successfully signed up!";
  //   const errorMessage =
  //     mode === "LOGIN" ? "Failed to sign in." : "Failed to sign up.";

  //   const loadId = toast.loading(loadingMessage, { duration: 3000 });

  //   try {
  //     console.log(values);

  //     if (mode === "LOGIN") {
  //       const response = await axios.post(
  //         `${import.meta.env.SERVER_URL}/auth/login`,
  //         {
  //           email: values.email,
  //           password: values.password,
  //         },
  //       );

  //       const data = response.data;

  //       if (data.success) {
  //         toast.success(successMessage, { duration: 3000 });

  //         navigate("/", { replace: true });
  //       }
  //     } else if (mode === "SIGNUP") {
  //       const response = await axios.post(
  //         `${import.meta.env.SERVER_URL}/auth/register`,
  //         {
  //           email: values.email,
  //           password: values.password,
  //           username: values.username,
  //         },
  //       );

  //       const data = response.data;

  //       if (data.success) {
  //         console.log({ data });

  //         toast.success(data.message, { duration: 3000 });

  //         navigate("/", { replace: true });
  //       }
  //     }
  //   } catch (error) {
  //     console.error(`Error: ${error}`);

  //     toast.error(`${errorMessage} Please try again.`, { duration: 3000 });
  //   } finally {
  //     toast.dismiss(loadId);
  //   }
  // };

  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    const loadId = toast.loading("Signing in with Google...", {
      duration: 3000,
    });

    try {
      setGoogleAuthLoading(true);
      // await signInWithGoogle()
      //   .then(() => {
      //     navigate("/u", { replace: true });
      //     toast.success("Successfully signed in with Google!", {
      //       duration: 3000,
      //     });

      //     setGoogleAuthLoading(false);
      //   })
      //   .catch(() => {
      //     toast.error("Failed to sign in with Google. Please try again.", {
      //       duration: 3000,
      //     });
      //   })
      //   .finally(() => {
      //     setGoogleAuthLoading(false);
      //   });

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/auth/google`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
            "Access-Control-Allow-Origin": "*",
          },
        },
      );

      const data = res.data;

      console.log(`data: ${JSON.stringify(data)}`);

      if (res.status === 200) {
        toast.success(data.message, {
          duration: 2000,
          richColors: true,
          style: {
            backgroundColor: "rgba(0, 255, 0, 0.15)",
            border: "0.1px solid rgba(0, 255, 0, 0.2)",
          },
        });

        window.location.href = data?.auth_url;

        // navigate(data?.auth_url, { replace: true });
      }
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`);

      toast.error("Failed to sign in with Google. Please try again.", {
        duration: 2000,
        richColors: true,
        className: " border ",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.35)",
          borderColor: "rgba(255, 0, 0, 0.5)",
        },
      });
    } finally {
      toast.dismiss(loadId);

      setGoogleAuthLoading(false);
    }
  };

  const desktopFormVariants = {
    login: { x: 0 },
    signup: { x: "100%" },
  };

  const desktopWelcomeVariants = {
    login: { x: 0 },
    signup: { x: "-100%" },
  };

  return (
    <>
      <div className="relative hidden h-screen w-full overflow-hidden rounded-lg bg-background md:block md:h-[34rem]">
        <motion.div
          className={cn(
            "absolute bottom-0 top-0 order-2 flex h-full w-full flex-col justify-center p-2 md:left-0 md:order-1 md:w-1/2 md:p-8",
            mode === "LOGIN"
              ? "bg-cyan-950/15 md:order-1 md:rounded-l-lg md:rounded-br-none"
              : "bg-purple-950/15 md:order-2 md:rounded-r-lg md:rounded-bl-none",
          )}
          variants={desktopFormVariants}
          initial={false}
          animate={mode.toLowerCase()}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="mx-auto w-full max-w-md text-text">
            <CardContent className="px-0">
              <CardTitle>
                <P className="text-left md:mb-4">
                  {mode === "LOGIN"
                    ? "Login to your account"
                    : "Sign up for an account"}
                </P>
              </CardTitle>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  {mode === "SIGNUP" && (
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Username"
                              className="w-full md:w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="w-full md:w-full"
                            placeholder="Email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="w-full md:w-full"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {mode === "LOGIN" && (
                    <div className="flex flex-1 flex-col items-end justify-end">
                      <Button
                        type="button"
                        variant="link"
                        className="w-fit"
                        asChild
                      >
                        <Link to="/forgot-password">Forgot Password</Link>
                      </Button>
                    </div>
                  )}

                  {mode === "SIGNUP" && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="w-full md:w-full"
                              placeholder="Confirm Password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? (
                        <>
                          <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                          {mode === "LOGIN" ? "Signing in..." : "Signing up..."}
                        </>
                      ) : mode === "LOGIN" ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    <div className="relative py-2">
                      <Separator className="w-full" />
                      <div
                        className={cn(
                          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                        )}
                      >
                        <P className="px-2 text-text">OR</P>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={googleAuthLoading}
                    >
                      {googleAuthLoading ? (
                        <>
                          <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                          Signing in with Google...
                        </>
                      ) : (
                        <>
                          <FcGoogle className="mr-2 h-4 w-4" />
                          Sign In with Google
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <div className="flex w-full items-center justify-center pt-2">
              <P className="flex gap-2 text-base text-text md:hidden">
                {mode === "LOGIN"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  to={
                    mode === "LOGIN" ? "/auth?mode=signup" : "/auth?mode=login"
                  }
                  className="text-text hover:underline"
                >
                  {mode === "LOGIN" ? "Sign Up" : "Login"}
                </Link>
              </P>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={cn(
            "absolute right-0 top-0 order-1 hidden h-full w-full flex-col items-center justify-center p-8 text-text md:order-2 md:flex md:h-full md:w-1/2",

            mode === "LOGIN"
              ? "bg-gradient-to-b from-cyan-700/75 via-cyan-600/35 to-background md:order-2 md:rounded-r-lg md:rounded-tl-none"
              : "bg-gradient-to-b from-purple-700/75 via-purple-600/35 to-background md:order-1 md:rounded-l-lg md:rounded-tr-none",
          )}
          variants={desktopWelcomeVariants}
          initial={false}
          animate={mode.toLowerCase()}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <H2 className="text-left text-3xl font-bold">
            {mode === "LOGIN" ? "Welcome back!" : "Welcome!"}
          </H2>
          <P className="text-center md:mb-8">
            {mode === "LOGIN"
              ? "Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away."
              : "Welcome! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away."}
          </P>
          <P className="hidden gap-2 text-base text-text md:flex">
            {mode === "LOGIN"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={mode === "LOGIN" ? "/auth?mode=signup" : "/auth?mode=login"}
              className="text-text hover:underline"
            >
              {mode === "LOGIN" ? "Sign Up" : "Login"}
            </Link>
          </P>
        </motion.div>
      </div>

      <Card
        className={cn(
          "relative block h-[calc(100vh-24rem)] w-full overflow-hidden rounded-lg bg-background md:hidden md:h-[32rem]",

          mode === "LOGIN" ? "h-[calc(100vh-18rem)]" : "h-[calc(100vh-14rem)]",
        )}
      >
        <motion.div
          className={cn(
            "order-2 flex h-full w-full flex-col justify-center bg-background p-2 md:left-0 md:order-1 md:w-1/2 md:p-8",
            mode === "LOGIN"
              ? "bg-gradient-to-b from-cyan-700/75 via-cyan-600/35 to-background md:order-1 md:rounded-l-lg md:rounded-br-none"
              : "bg-gradient-to-b from-purple-700/75 via-purple-600/35 to-background md:order-2 md:rounded-r-lg md:rounded-bl-none",
          )}
          initial={false}
          variants={{
            LOGIN: {
              y: -5,
              opacity: 1,
            },
            SIGNUP: {
              y: -10,
              opacity: 1,
            },
            HIDDEN: {
              y: 100,
              opacity: 0,
            },
          }}
          animate={mode.toUpperCase()}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <div className="mx-auto w-full max-w-md text-text">
            <CardContent>
              <CardTitle>
                <P className="text-left md:mb-4">
                  {mode === "LOGIN"
                    ? "Login to your account"
                    : "Sign up for an account"}
                </P>
              </CardTitle>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2"
                >
                  {mode === "SIGNUP" && (
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Username"
                              className="w-full md:w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="w-full md:w-full"
                            placeholder="Email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            className="w-full md:w-full"
                            placeholder="Password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {mode === "LOGIN" && (
                    <div className="flex flex-1 flex-col items-end justify-end">
                      <Button
                        type="button"
                        variant="link"
                        className="w-fit"
                        asChild
                      >
                        <Link to="/forgot-password">Forgot Password</Link>
                      </Button>
                    </div>
                  )}

                  {mode === "SIGNUP" && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              className="w-full md:w-full"
                              placeholder="Confirm Password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex flex-col space-y-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                      disabled={isLoginLoading || isSignupLoading}
                    >
                      {isLoginLoading || isSignupLoading ? (
                        <>
                          <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                          {mode === "LOGIN" ? "Signing in..." : "Signing up..."}
                        </>
                      ) : mode === "LOGIN" ? (
                        "Sign In"
                      ) : (
                        "Sign Up"
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleGoogleSignIn}
                      disabled={googleAuthLoading}
                    >
                      {googleAuthLoading ? (
                        <>
                          <RiLoader2Fill className="mr-2 h-4 w-4 animate-spin" />
                          Signing in with Google...
                        </>
                      ) : (
                        <>
                          <FcGoogle className="mr-2 h-4 w-4" />
                          Sign In with Google
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <div className="flex w-full items-center justify-center pt-2">
              <P className="flex gap-2 text-base text-text md:hidden">
                {mode === "LOGIN"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <Link
                  to={
                    mode === "LOGIN" ? "/auth?mode=signup" : "/auth?mode=login"
                  }
                  className="text-text hover:underline"
                >
                  {mode === "LOGIN" ? "Sign Up" : "Login"}
                </Link>
              </P>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={cn(
            "order-1 hidden h-fit w-full flex-col items-center justify-center bg-teal-500/45 p-8 text-text md:order-2 md:flex md:h-full md:w-1/2",

            mode === "LOGIN"
              ? "md:order-2 md:rounded-r-lg md:rounded-tl-none"
              : "md:order-1 md:rounded-l-lg md:rounded-tr-none",
          )}
          initial={false}
          animate={mode.toLowerCase()}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <H2 className="text-left text-3xl font-bold">
            {mode === "LOGIN" ? "Welcome back!" : "Welcome!"}
          </H2>
          <P className="text-center md:mb-8">
            {mode === "LOGIN"
              ? "Welcome back! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away."
              : "Welcome! We are so happy to have you here. It's great to see you again. We hope you had a safe and enjoyable time away."}
          </P>
          <P className="hidden gap-2 text-base text-text md:flex">
            {mode === "LOGIN"
              ? "Don't have an account? "
              : "Already have an account? "}
            <Link
              to={mode === "LOGIN" ? "/auth?mode=signup" : "/auth?mode=login"}
              className="text-text hover:underline"
            >
              {mode === "LOGIN" ? "Sign Up" : "Login"}
            </Link>
          </P>
        </motion.div>
      </Card>
    </>
  );
};

export default AuthForm;
