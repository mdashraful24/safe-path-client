import { ShieldCheck } from "lucide-react";
import Logo from "@/components/brand/logo";

export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <Logo className="text-primary-foreground" />
        <div className="flex flex-col gap-4">
          <ShieldCheck className="size-10" />
          <h2 className="max-w-sm text-3xl font-bold tracking-tight text-balance">
            Safety awareness starts with a report.
          </h2>
          <p className="max-w-sm text-primary-foreground/80">
            Join SafePath to report incidents and follow verified safety updates
            around you.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">&copy; SafePath</p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
