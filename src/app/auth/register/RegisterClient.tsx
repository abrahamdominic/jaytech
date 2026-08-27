"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
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
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: data.fullName,
          email: data.email,
          role: "customer",
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      toast.success("Account created! Check your email for verification.");
      router.push("/dashboard");
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
          <h1 className="text-2xl font-bold text-secondary">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted">
            Join J Tech Solar, Starlink & CCTV Hub for reliable solar and tech services
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full name"
              placeholder="John Doe"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

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
                placeholder="Min 6 characters"
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

            <div className="relative">
              <Input
                label="Confirm password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-muted hover:text-secondary transition-colors cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                {...register("terms")}
              />
              <span className="text-sm text-muted">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-primary-dark hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-medium text-primary-dark hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-danger font-medium">
                {errors.terms.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-primary-dark hover:text-primary transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
