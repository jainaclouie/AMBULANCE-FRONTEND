import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorText } from "@/components/common/error-text";
import { homePathFor, useAuth } from "@/context/auth-state";
import { errorMessage } from "@/lib/axios";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already signed in
  if (user) {
    return <Navigate to={homePathFor(user.role)} replace />;
  }

  const handleLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh bg-white">
      {/* Brand panel */}
      <div className="hidden flex-1 flex-col justify-between bg-surface-dark p-16 text-white lg:flex">
        <div className="flex items-center gap-3 text-xl font-bold">
          <div className="grid size-8 place-items-center rounded-[9px] bg-brand-primary">+</div>
          Cordova Dispatch
        </div>
        <div>
          <h1 className="max-w-xl text-5xl leading-[56px] font-bold">One live view of every ambulance in Cordova.</h1>
          <p className="mt-5 max-w-lg text-lg text-on-dark-muted">Find the nearest available unit across all 13 barangays and send help faster.</p>
        </div>
        <p className="text-[11px] text-muted">Student prototype. Sample data only.</p>
      </div>

      {/* Sign in form */}
      <div className="grid flex-1 place-items-center p-6">
        <form onSubmit={handleLogin} className="grid w-full max-w-[400px] gap-5">
          <div>
            <h2 className="text-[28px] font-bold">Sign in</h2>
            <p className="text-muted">Use your dispatcher, crew, or admin account.</p>
          </div>
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
          <ErrorText message={error} />
          <Button type="submit" size="l" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>

          <p className="rounded-[10px] bg-surface-subtle p-3 text-xs leading-[18px] text-muted">
            Test accounts (password: <b>password</b>): admin@cordova.test, dispatcher@cordova.test, crew.gabi@cordova.test
          </p>
        </form>
      </div>
    </div>
  )
}
