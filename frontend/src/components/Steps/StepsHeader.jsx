import React from "react";

const StepsHeader = () => {
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">
        How <span className="text-red-600">LifeLink+</span> Works
      </h2>

      <p className="mt-4 md:mt-6 text-slate-600 text-base md:text-lg max-w-xl md:max-w-2xl mx-auto leading-relaxed">
        A structured, technology-driven emergency response flow designed to
        intelligently connect donors and patients in real time.
      </p>
    </div>
  );
};

export default StepsHeader;