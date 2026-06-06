import { Suspense } from "react";
import { LoginForm } from "@/components/auth/AuthForms";

export default function Page() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
