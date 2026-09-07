import LoginHero from "@/components/auth/LoginHero";
import LoginForm from "@/components/auth/LoginForm";
import StatCards from "@/components/dashboard/StatCards";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        
        {/* Left Side */}
        <LoginHero />

        {/* Right Side */}
        <LoginForm />

      </div>
    </main>
  );
}