import { MapPin, ShieldCheck, Siren } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/public/header";
import { buttonVariants } from "@/components/ui/button";

const features = [
  {
    icon: Siren,
    title: "Report incidents",
    description:
      "Share safety incidents with the details that matter, right when they happen.",
  },
  {
    icon: MapPin,
    title: "Follow your area",
    description:
      "See verified reports around you and stay aware of what is happening nearby.",
  },
  {
    icon: ShieldCheck,
    title: "Safer together",
    description:
      "Community reports help everyone make better, faster safety decisions.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <span className="rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">
            Community safety, made simple
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Know what is happening around you with SafePath
          </h1>
          <p className="max-w-xl text-lg text-balance text-muted-foreground">
            Report incidents, follow updates from your community, and make safer
            decisions together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className={buttonVariants({ size: "lg" })}>
              Get started
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Login
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-20 grid w-full max-w-5xl gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border p-6">
              <feature.icon className="mb-3 size-6 text-primary" />
              <h2 className="mb-1 font-semibold">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
