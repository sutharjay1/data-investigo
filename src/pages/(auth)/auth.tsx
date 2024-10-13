import AuthForm from "@/components/form/auth-form";

import { AuthMode } from "@/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("LOGIN");

  console.log(mode);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "LOGIN") setMode("LOGIN");
    else if (modeParam === "REGISTER") setMode("SIGNUP");
  }, [searchParams]);

  return (
    <div className="relative flex h-screen items-center justify-center">
      <div className="absolute inset-0 z-10">
        <video className="h-full w-full object-cover" autoPlay loop muted>
          <source
            src="https://res.cloudinary.com/sutharjay/video/upload/v1728813623/freelance_assets/qcufoiqytxoybsz7vpdw.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="z-20 flex h-full w-full max-w-3xl items-center justify-center px-4 md:p-6">
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
