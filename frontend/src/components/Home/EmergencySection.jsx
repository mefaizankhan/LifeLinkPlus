import MapAnimation from "./MapAnimation";
import EmergencyCard from "./EmergencyCard";
import SupportFeatures from "./SupportFeatures";

const EmergencySection = () => {
  return (
    <section className="relative py-16 md:py-32 overflow-hidden">

      <div className="w-full px-4 md:px-6 lg:px-16 xl:px-24">

        {/* Section Heading */}
        <div className="text-center mb-12 md:mb-24">

          <h2
            className="font-[var(--font-heading)]
                       text-2xl md:text-4xl lg:text-5xl
                       font-extrabold tracking-tight
                       text-slate-900
                       whitespace-nowrap"
          >
            Emergency Assistance
          </h2>

          <p
            className="mt-4 md:mt-6
                       text-base md:text-lg
                       text-slate-500
                       max-w-[300px] md:max-w-2xl
                       mx-auto leading-relaxed"
          >
            Instantly connect to nearby hospitals,
            blood banks and life-saving support.
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-6 md:mt-8 rounded-full" />

        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">

          {/* Map */}
          <div className="hidden lg:flex justify-center col-span-1">
            <MapAnimation />
          </div>

          {/* Card */}
          <div className="col-span-3">
            <EmergencyCard />
          </div>

          {/* Features */}
          <div className="hidden lg:block col-span-1">
            <SupportFeatures />
          </div>

        </div>

      </div>
    </section>
  );
};

export default EmergencySection;