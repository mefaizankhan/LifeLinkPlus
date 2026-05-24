// src/pages/About/AboutHero.jsx

const AboutHero = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 text-center">

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight max-w-5xl mx-auto">
        Building a Faster, Smarter{" "}
        
        {/* Line break only on small screens */}
        <br className="block lg:hidden" />

        <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          Emergency Response Network
        </span>
      </h1>

      {/* Description */}
      <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
        LifeLink+ connects blood donors, hospitals, and patients in real-time,
        reducing delays and ensuring that help reaches exactly when it’s needed
        most.
      </p>

      {/* Divider */}
      <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-8 rounded-full" />
    </section>
  );
};

export default AboutHero;