import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/AuthForms";
import { getCurrentProfile } from "@/lib/auth/session";

export default async function Page() {
  const profile = await getCurrentProfile();
  if (profile) {
    redirect(profile.role === "developer" ? "/developer" : "/dashboard");
  }

  return <RegisterForm />;
}
