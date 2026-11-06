"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { getErrorMessage } from "@/lib/utils";

export default function GoogleLoginComponent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(380);
  const { mutate: googleLogin } = useGoogleOAuth();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        if (clientWidth > 0) {
          // Google button width is strictly bounded between 200px and 400px
          setButtonWidth(Math.max(200, Math.min(clientWidth, 400)));
        }
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      setIsPending(false);
      toast.add({
        title: "Google Login Failed",
        description:
          "Something went wrong with Google login. Please try again.",
        type: "error",
      });
      return;
    }

    setIsPending(true);
    googleLogin(
      { idToken },
      {
        onSuccess: () => {
          toast.add({
            title: "Google Login Successful",
            description: "You have been successfully logged in.",
            type: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["USER"] });
          router.push("/dashboard");
        },
        onError: (err) => {
          toast.add({
            title: "Google Login Failed",
            description: getErrorMessage(err),
            type: "error",
          });
        },
        onSettled: () => setIsPending(false),
      },
    );
  };

  const handleError = () => {
    setIsPending(false);
    toast.add({
      title: "Google Login Failed",
      description: "Something went wrong. Please try again.",
      type: "error",
    });
  };

  return (
    <div ref={containerRef} className="relative flex w-full justify-center">
      <div
        style={{
          opacity: isPending ? 0 : 1,
          pointerEvents: isPending ? "none" : "auto",
        }}
        className="flex w-full justify-center mx-auto"
      >
        <GoogleLogin
          key={buttonWidth}
          onSuccess={handleSuccess}
          onError={handleError}
          theme="outline"
          shape="pill"
          size="large"
          text="continue_with"
          logo_alignment="center"
          width={buttonWidth.toString()}
        />
      </div>

      {/* Custom loading overlay shown while pending */}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-4 h-11 text-sm font-medium text-slate-700 shadow-sm">
          <Spinner />
          <span>Connecting...</span>
        </div>
      )}
    </div>
  );
}
