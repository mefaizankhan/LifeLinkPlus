import React, { useEffect, useState } from "react";
import StepsHeader from "./StepsHeader";
import StepCard from "./StepCard";
import { UserPlus, AlertTriangle, Radar, PhoneCall } from "lucide-react";

const Steps = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Register",
      description:
        "Create your profile as a blood donor or request emergency medical support.",
      icon: UserPlus,
    },
    {
      number: "02",
      title: "Raise Emergency Request",
      description:
        "Submit your blood requirement instantly with location details.",
      icon: AlertTriangle,
    },
    {
      number: "03",
      title: "Smart Matching",
      description:
        "Nearby eligible donors receive real-time notifications using location intelligence.",
      icon: Radar,
    },
    {
      number: "04",
      title: "Connect & Respond",
      description:
        "Donors and patients connect instantly to minimize response time.",
      icon: PhoneCall,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 1250);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-red-50 via-white to-red-50 px-4 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <StepsHeader />

        <div className="relative mt-16 md:mt-28">
          {/* ECG Line */}
          <div className="hidden lg:block absolute -top-12 left-0 w-full pointer-events-none z-20">
            <svg viewBox="0 0 1200 100" className="w-full h-20" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ecgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>

              <path
                d="M0 60 L200 60 L250 20 L280 100 L310 60 
                   L500 60 L550 20 L580 100 L610 60 
                   L800 60 L850 20 L880 100 L910 60 L1200 60"
                fill="none"
                stroke="url(#ecgGradient)"
                strokeWidth="2.5"
              />

              <circle r="7" fill="#3b82f6">
                <animateMotion
                  dur="5s"
                  repeatCount="indefinite"
                  path="M0 60 L200 60 L250 20 L280 100 L310 60 
                        L500 60 L550 20 L580 100 L610 60 
                        L800 60 L850 20 L880 100 L910 60 L1200 60"
                />
              </circle>
            </svg>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 relative z-10">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
                Icon={step.icon}
                isActive={activeIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;