"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Shield, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = (await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      })) as any;
      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Shield className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
            Aegis
          </h1>
          <p className="text-sm font-medium text-slate-500">
            AI Agent Governance & Security Platform
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to manage your AI agents and audit logs</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-100 mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">Password</label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-850 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-100 transition hover:bg-blue-700 hover:shadow-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
