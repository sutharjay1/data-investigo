import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Loading from "./components/global/loading";
import NavBar from "./components/global/nav-bar";
import Auth from "./pages/(auth)/auth";

import GoogleCallback from "./pages/(auth)/google-callback";

import { GuestRoute, PrivateRoute } from "./pages/route-guard";
import Layout from "./components/global/layout";
import { useAuth } from "./provider/google-provider";

const VerifyEmail = lazy(() => import("./pages/(auth)/email-verify"));
const ResetPassword = lazy(() => import("./pages/(auth)/reset-password"));

const Monitor = lazy(() => import("./pages/(dashboard)/_sections/monitor"));
const SSLMonitoring = lazy(
  () => import("./pages/(dashboard)/_sections/ssl-monitoring"),
);
const ForgotPassword = lazy(() => import("./pages/(auth)/forgot-password"));

const User = lazy(() => import("./pages/(dashboard)/user"));

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      navigate(`/auth?mode=login`);
    }
  }, [location]);

  const noLayoutRoutes = [
    "/",
    "/auth",
    "/auth/google/callback",
    "/forgot-password",
    "/reset-password",
    "/confirm-email",
  ];

  const isNoLayout = noLayoutRoutes.some((path) =>
    location.pathname.startsWith(path),
  );

  const { user } = useAuth();

  return (
    <div className="font-poppins flex h-full min-h-screen w-full flex-col text-muted-foreground">
      <main className="font-poppins w-full flex-1">
        {isNoLayout && !user ? (
          <Suspense fallback={<Loading />}>
            <AppRouter />
          </Suspense>
        ) : (
          <Layout>
            <Suspense fallback={<Loading />}>
              <AppRouter />
            </Suspense>
          </Layout>
        )}
      </main>
      <Toaster />
    </div>
  );
};

const AppRouter = () => (
  <Routes>
    <Route element={<GuestRoute />}>
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirm-email/:token" element={<VerifyEmail />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route path="/u" element={<User />} />
      <Route path="/u/monitor" element={<Monitor />} />
      <Route path="/u/ssl-monitoring" element={<SSLMonitoring />} />
      {/* <Route path="/u/domain" element={<Domain />} /> */}
      {/* <Route path="/u/sub-domain-discovery" element={<SubDomainDiscovery />} />
      <Route path="/u/what-is-my-ip" element={<WhatIsMyIP />} />


      <Route path="/u/dns-records" element={<DNSRECORDS />} />
      <Route path="/u/asn-lookup" element={<ASNLookup />} />
      <Route path="/u/reverse-ip-lookup" element={<ReverseIPLookup />} /> */}
    </Route>
  </Routes>
);

export default App;
