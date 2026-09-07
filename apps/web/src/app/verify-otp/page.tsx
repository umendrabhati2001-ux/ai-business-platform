import LoginHero from "@/components/auth/LoginHero";
import OTPForm from "@/components/auth/OTPForm";

export default function VerifyOTPPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LoginHero />
        <OTPForm />
      </div>
    </main>
  );
}