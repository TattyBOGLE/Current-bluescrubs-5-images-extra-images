import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Stethoscope, Mail, Lock, ArrowRight, RefreshCw } from "lucide-react";
import doctorMain from "@/assets/login-doctor-main.png";
import doctorCivilian from "@/assets/login-doctor-civilian.png";

const BYPASS_KEY = "bluescrubs.bypassAuth";

export function setBypassAuth(enabled: boolean) {
  try {
    if (enabled) localStorage.setItem(BYPASS_KEY, "1");
    else localStorage.removeItem(BYPASS_KEY);
  } catch {}
}

export function getBypassAuth(): boolean {
  try {
    return localStorage.getItem(BYPASS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Hand off to Replit Auth — real session is created server-side.
    login();
  }

  function handleBypass() {
    setBypassAuth(true);
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      {/* Phone-sized frame on desktop; full-bleed on mobile */}
      <div className="relative w-full max-w-md min-h-screen sm:min-h-0 sm:h-[860px] sm:my-6 sm:rounded-[2.5rem] overflow-hidden bg-white sm:shadow-2xl">
        {/* Doctor photo background — top portion */}
        <div className="relative h-[55vh] sm:h-[470px] w-full overflow-hidden bg-gradient-to-b from-teal-200 to-teal-100">
          <img
            src={doctorMain}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Soft fade into white sheet below */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white/95" />

          {/* Top label — like the Dr name in the reference */}
          <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
            <div className="bg-black/25 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-white">
              <p className="text-xs font-semibold leading-tight">Dr Reina Rosa</p>
              <p className="text-[10px] opacity-90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Online
              </p>
            </div>
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white"
              aria-label="Switch"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Civilian picture-in-picture — bottom-right of photo */}
          <div className="absolute bottom-6 right-5 w-24 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-lg shadow-black/20 bg-slate-100">
            <img
              src={doctorCivilian}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* White sheet — login / register */}
        <div className="relative -mt-6 bg-white rounded-t-[2rem] px-6 pt-6 pb-8 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.08)]">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm shadow-teal-200/60">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">BlueScrubsPrep</h1>
              <p className="text-[11px] text-slate-500">PLAB exam preparation</p>
            </div>
          </div>

          {/* Login / Register toggle */}
          <div className="bg-slate-100 rounded-2xl p-1 flex gap-1 mb-5">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  mode === m
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {m === "login" ? "Log in" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
                  required
                />
                <Stethoscope className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            )}
            <div className="relative">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-2xl border-slate-200 bg-slate-50 pl-10"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs font-medium text-teal-700 hover:text-teal-900"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold shadow-md shadow-teal-200/50 border-none"
            >
              {mode === "login" ? "Log in" : "Create account"}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              For testing
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Bypass for testing */}
          <button
            type="button"
            onClick={handleBypass}
            className="w-full h-11 rounded-2xl border border-dashed border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-teal-300 hover:text-teal-700 transition-colors"
          >
            Skip login (continue as guest)
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-4">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
