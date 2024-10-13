import { Toaster } from "@/components/ui/toaster";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/global/loading";
import NavBar from "./components/global/nav-bar";
import Auth from "./pages/(auth)/auth";
import VerifyEmail from "./pages/(auth)/email-verify";
import GoogleCallback from "./pages/(auth)/google-callback";
import User from "./pages/(dashboard)/user";
import { GuestRoute, PrivateRoute } from "./pages/route-guard";
import Layout from "./components/global/layout";

const Home = lazy(() => import("./pages/home"));
const Monitor = lazy(() => import("./pages/(dashboard)/_sections/monitor"));
const SSLMonitoring = lazy(
  () => import("./pages/(dashboard)/_sections/ssl-monitoring"),
);
const ForgotPassword = lazy(() => import("./pages/(auth)/forgot-password"));

const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const AppContent = () => {
  const location = useLocation();

  return (
    <div className="font-poppins flex h-full min-h-screen w-full flex-col text-muted-foreground">
      {(location.pathname === "/" || location.pathname === "/auth") && (
        <NavBar />
      )}
      <main className="font-poppins w-full flex-1">
        {location.pathname !== "/" &&
        location.pathname !== "/auth" &&
        location.pathname !== "/auth/google/callback" &&
        location.pathname !== "/forgot-password" ? (
          <Layout>
            <Suspense fallback={<Loading />}>
              <AppRouter />
            </Suspense>
          </Layout>
        ) : (
          <Suspense fallback={<Loading />}>
            <AppRouter />
          </Suspense>
        )}
      </main>
      <Toaster />
    </div>
  );
};

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Home />} />

    <Route element={<GuestRoute />}>
      <Route path="/auth" element={<Auth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/confirm-email/:token" element={<VerifyEmail />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route path="/u" element={<User />} />{" "}
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
