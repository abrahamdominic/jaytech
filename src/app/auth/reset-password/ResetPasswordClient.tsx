"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft, CheckCircle, Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
        toast.error(
          "Authentication is not configured yet. Please set up Supabase in your environment variables."
        );
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        toast.error(error.message || "Failed to send reset email");
        return;
      }

      setIsSubmitted(true);
    } catch {
      toast.error(
        "Authentication service is not configured. Please contact the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-dim px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-secondary font-black text-xl shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
              J
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-secondary">Reset password</h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-lg font-semibold text-secondary mb-2">
                Check your email
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                We&apos;ve sent a password reset link to your email address.
                Please check your inbox and follow the instructions.
              </p>
              <p className="mt-4 text-xs text-muted">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-4">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <p className="text-sm text-muted">
                  Enter the email address associated with your account and
                  we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register("email")}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-1 font-semibold text-primary-dark hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
