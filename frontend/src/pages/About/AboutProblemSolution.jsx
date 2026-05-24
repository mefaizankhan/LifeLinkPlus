// src/pages/About/AboutProblemSolution.jsx

import {
  HeartPulse,
  Clock,
  AlertTriangle,
  Globe,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

const problems = [
  {
    icon: HeartPulse,
    title: "Disconnected Systems",
    desc: "Emergency stakeholders operate in silos.",
    solution:
      "LifeLink+ unifies donors, hospitals, and patients into one real-time ecosystem.",
  },
  {
    icon: Clock,
    title: "Critical Delays",
    desc: "Manual communication causes delays.",
    solution: "Instant notifications and smart matching reduce response time.",
  },
  {
    icon: AlertTriangle,
    title: "No Unified Platform",
    desc: "No centralized emergency coordination.",
    solution: "LifeLink+ acts as a centralized emergency bridge.",
  },
];

const AboutProblemSolution = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-10 items-center">

        {/* LEFT */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">The Problem</h2>

          {problems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                onClick={() => setActive(index)}
                className={`cursor-pointer backdrop-blur-xl bg-white/40 border rounded-2xl p-5 shadow-md transition-all duration-300 ${
                  active === index
                    ? "border-rose-400 ring-2 ring-rose-300 shadow-lg scale-[1.02]"
                    : "border-white/60 hover:shadow-lg"
                }`}
              >
                <div className="flex gap-4 items-start">
                  <Icon
                    size={22}
                    className={
                      active === index ? "text-rose-600" : "text-slate-500"
                    }
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MIDDLE */}
        <div className="hidden lg:block w-28 h-[350px] relative">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 16 C 50 16, 50 50, 100 50"
              fill="none"
              strokeWidth={active === 0 ? "3" : "1.5"}
              className={`${
                active === 0 ? "stroke-rose-500" : "stroke-slate-200"
              }`}
            />
            <path
              d="M 0 50 L 100 50"
              fill="none"
              strokeWidth={active === 1 ? "3" : "1.5"}
              className={`${
                active === 1 ? "stroke-rose-500" : "stroke-slate-200"
              }`}
            />
            <path
              d="M 0 84 C 50 84, 50 50, 100 50"
              fill="none"
              strokeWidth={active === 2 ? "3" : "1.5"}
              className={`${
                active === 2 ? "stroke-rose-500" : "stroke-slate-200"
              }`}
            />
          </svg>

          <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500" />
          <div className="absolute right-[-25px] top-1/2 -translate-y-1/2 text-rose-500">
            <ArrowRight size={20} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="backdrop-blur-xl bg-white/50 border border-white/60 rounded-3xl p-8 shadow-lg">
          <Globe className="text-rose-600 mb-4" size={28} />
          <h2 className="text-xl font-semibold mb-3">Our Solution</h2>

          <p className="text-sm text-slate-700 leading-relaxed">
            {problems[active].solution}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutProblemSolution;