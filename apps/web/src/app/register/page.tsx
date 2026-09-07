import LoginHero from "@/components/auth/LoginHero";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left Side */}
        <LoginHero />

        {/* Right Side */}
        <RegisterForm />

      </div>
    </main>
  );
}