"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      router.push(redirect);
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
          <h1 className="text-2xl font-bold text-secondary">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to your J Tech Solar, Starlink & CCTV Hub account
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-muted hover:text-secondary transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                  {...register("remember")}
                />
                <span className="text-sm text-muted">Remember me</span>
              </label>
              <Link
                href="/auth/reset-password"
                className="text-sm font-medium text-primary-dark hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-primary-dark hover:text-primary transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
