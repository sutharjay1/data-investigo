import InnerLayout from "@/components/global/inner-layout";
import { H1, P } from "@/components/ui/typography";
import { useAuth } from "@/provider/google-provider";

const ProfessionalDashboard = () => {
  const { user } = useAuth();

  return (
    <InnerLayout label={user?.username!}>
      <div className="flex flex-col gap-4">
        <div className=" ">
          <H1 className="mb-2">Welcome, {user?.username}</H1>
          <P className="text-text">
            Here you can manage your domains and subdomains.
          </P>
        </div>
      </div>
    </InnerLayout>
  );
};

export default ProfessionalDashboard;
