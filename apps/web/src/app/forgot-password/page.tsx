import LoginHero from "@/components/auth/LoginHero";
import ForgotPassword from "@/components/auth/ForgotPassword";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LoginHero />
        <ForgotPassword />
      </div>
    </main>
  );
}