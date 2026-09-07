"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Salesforce Developer",
    company: "Tech Solutions",
    image: "👨🏻‍💻",
    review:
      "This AI Business Platform helped us automate Salesforce workflows and save hours every week.",
  },
  {
    name: "Priya Verma",
    role: "Business Owner",
    company: "Growth Hub",
    image: "👩🏻‍💼",
    review:
      "Beautiful dashboard, fast performance and an amazing AI Assistant. Highly recommended.",
  },
  {
    name: "John Smith",
    role: "CEO",
    company: "GlobalSoft",
    image: "👨🏼‍💼",
    review:
      "Everything from analytics to automation works beautifully. The UI feels premium.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-slate-900 py-28">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-20 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-cyan-400">
            TESTIMONIALS
          </p>

          <h2 className="text-5xl font-extrabold text-white">
            What Our Clients Say
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Thousands of developers and businesses trust our AI Business Platform.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">

          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.2,
              }}
              whileHover={{
                y: -10,
              }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
            >
              <div className="mb-6 text-5xl">
                {item.image}
              </div>

              <p className="mb-8 leading-8 text-slate-300">
                &ldquo;{item.review}&rdquo;
              </p>

              <h3 className="text-xl font-bold text-white">
                {item.name}
              </h3>

              <p className="mt-1 text-cyan-400">
                {item.role}
              </p>

              <p className="text-slate-500">
                {item.company}
              </p>

            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}