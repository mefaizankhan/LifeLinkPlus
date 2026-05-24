import React from "react";
import { motion } from "framer-motion";

const StepCard = ({ number, title, description, Icon, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Mobile timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-red-200 md:hidden"></div>

      {/* Card */}
      <div
        className={`relative ml-14 md:ml-0 p-6 md:p-8
        bg-white/90 backdrop-blur-sm
        rounded-3xl
        border border-white/60
        transition-all duration-500
        ${
          isActive
            ? "md:shadow-[0_0_40px_rgba(59,130,246,0.35)] md:-translate-y-1"
            : "shadow-[0_25px_70px_rgba(239,68,68,0.08)]"
        }`}
      >
        {/* Timeline Dot */}
        <div
          className="absolute -left-10 top-7 md:hidden
          w-8 h-8
          flex items-center justify-center
          rounded-full
          bg-red-500 text-white text-sm font-bold"
        >
          {number}
        </div>

        {/* Watermark Number (desktop only) */}
        <span
          className="hidden md:block absolute top-4 right-6 text-7xl font-bold 
          bg-gradient-to-br from-red-200 to-red-100 
          bg-clip-text text-transparent opacity-40"
        >
          {number}
        </span>

        {/* Icon */}
        <div
          className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center 
          rounded-full 
          bg-gradient-to-br from-red-50 to-red-100 
          text-red-600 
          mb-4 md:mb-6"
        >
          <Icon size={22} />
        </div>

        <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2 md:mb-4">
          {title}
        </h3>

        <p className="text-sm md:text-base text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default StepCard;