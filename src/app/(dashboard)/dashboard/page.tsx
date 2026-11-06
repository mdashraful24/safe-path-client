"use client";

import { BadgeCheck, Calendar, Mail, Shield, UserIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMe } from "@/hooks";

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { data } = useGetMe();
  const user = data?.data;

  if (!user) return null;

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is an overview of your SafePath account.
          </p>
        </div>
        {isAdmin && (
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Admin panel
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your profile information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4 text-muted-foreground" />
              <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground" />
              <span>Joined {formatDate(user.createdAt)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Account access and verification</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium">{user.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Role</span>
              <span className="flex items-center gap-1 font-medium">
                <Shield className="size-4" />
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Email verified</span>
              <span className="flex items-center gap-1 font-medium">
                <BadgeCheck className="size-4" />
                {user.emailVerified ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sign-in method</span>
              <span className="font-medium">{user.authProvider}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
