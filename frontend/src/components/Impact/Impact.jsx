import ImpactStats from "./ImpactStats";
import ImpactCharts from "./ImpactCharts";

const Impact = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-white via-red-50 to-white overflow-hidden">
      {/* Ambient Background Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] 
        bg-red-200/30 blur-3xl rounded-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
            Our <span className="text-red-600">Impact</span>
          </h2>

          <p className="mt-4 md:mt-6 text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            Measured results from real-time emergency response.
          </p>
        </div>

        <ImpactStats />
        <ImpactCharts />
      </div>
    </section>
  );
};

export default Impact;