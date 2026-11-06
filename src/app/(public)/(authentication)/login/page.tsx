import type { Metadata } from "next";
import LoginForm from "@/components/form/login-form";
import type { DemoAccount } from "@/components/form/quick-login";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  const demoAccounts: DemoAccount[] = [
    {
      label: "User",
      email: process.env.SEED_USER_EMAIL ?? "",
      password: process.env.SEED_USER_PASSWORD ?? "",
    },
    {
      label: "Admin",
      email: process.env.SEED_ADMIN_EMAIL ?? "",
      password: process.env.SEED_ADMIN_PASSWORD ?? "",
    },
    {
      label: "Super Admin",
      email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "",
      password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? "",
    },
  ].filter((account) => account.email && account.password);

  return <LoginForm demoAccounts={demoAccounts} />;
}
