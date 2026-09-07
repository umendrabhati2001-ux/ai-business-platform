import FeatureCard from "@/components/ui/FeatureCard";
import {
  Bot,
  Cloud,
  BarChart3,
  Smartphone,
  Zap,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: <Bot size={42} />,
    title: "AI Assistant",
    description:
      "Smart AI chatbot, prompt engineering and business automation.",
  },
  {
    icon: <Cloud size={42} />,
    title: "Salesforce CRM",
    description:
      "Manage Leads, Contacts, Accounts and Opportunities from one place.",
  },
  {
    icon: <BarChart3 size={42} />,
    title: "Analytics Dashboard",
    description:
      "Beautiful charts, KPIs and real-time business insights.",
  },
  {
    icon: <Smartphone size={42} />,
    title: "Mobile Apps",
    description:
      "Build Android and iOS apps using the same platform.",
  },
  {
    icon: <Zap size={42} />,
    title: "Automation",
    description:
      "Automate workflows, emails and repetitive business tasks.",
  },
  {
    icon: <ShieldCheck size={42} />,
    title: "Enterprise Security",
    description:
      "Secure authentication, encrypted data and role-based access.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            FEATURES
          </p>

          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Everything You Need
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Powerful tools to manage your business, automate work,
            integrate Salesforce and leverage AI — all from one platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}