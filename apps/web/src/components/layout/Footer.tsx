"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* Top */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500 text-xl font-bold text-white">
                AI
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  AI Business Platform
                </h2>

                <p className="text-sm text-slate-400">
                  Enterprise SaaS
                </p>
              </div>
            </div>

            <p className="leading-8 text-slate-400">
              Build modern AI-powered applications with Salesforce,
              Automation, Analytics and Mobile Apps — all in one platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-slate-400">
              <li className="cursor-pointer transition hover:text-cyan-400">
                Home
              </li>

              <li className="cursor-pointer transition hover:text-cyan-400">
                Features
              </li>

              <li className="cursor-pointer transition hover:text-cyan-400">
                Pricing
              </li>

              <li className="cursor-pointer transition hover:text-cyan-400">
                Dashboard
              </li>

              <li className="cursor-pointer transition hover:text-cyan-400">
                Contact
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">
              Services
            </h3>

            <ul className="space-y-4 text-slate-400">
              <li>AI Assistant</li>
              <li>Salesforce CRM</li>
              <li>Analytics</li>
              <li>Automation</li>
              <li>Android & iOS Apps</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-xl font-bold text-white">
              Contact
            </h3>

            <div className="space-y-5 text-slate-400">

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@aibusinessplatform.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} />
                <span>Jaipur, Rajasthan, India</span>
              </div>

            </div>

            {/* Social Icons */}

            <div className="mt-8 flex gap-4">

              <a
                href="#"
                className="rounded-xl bg-white/5 p-3 text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-110"
              >
                <FaFacebook size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl bg-white/5 p-3 text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-110"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl bg-white/5 p-3 text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-110"
              >
                <FaLinkedin size={20} />
              </a>

              <a
                href="#"
                className="rounded-xl bg-white/5 p-3 text-white transition-all duration-300 hover:bg-cyan-500 hover:scale-110"
              >
                <FaGithub size={20} />
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="mt-16 border-t border-white/10 pt-8">

          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">

            <p>
              © 2026 AI Business Platform. All Rights Reserved.
            </p>

            <div className="flex gap-6">

              <a href="#" className="hover:text-cyan-400">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-cyan-400">
                Terms
              </a>

              <a href="#" className="hover:text-cyan-400">
                Cookies
              </a>

            </div>

          </div>

        </div>

      </div>
    </footer>
  );
}