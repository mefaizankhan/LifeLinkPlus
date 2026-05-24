import HeroContent from "./HeroContent";

const Hero = () => {
  return (
    <section className="relative pt-10 md:pt-28 pb-24 md:pb-32 overflow-hidden">
      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100"></div>

      {/* Soft Glow Elements */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative px-6 lg:px-20">
        <HeroContent />
      </div>
    </section>
  );
};

export default Hero;
