// src/pages/About/AboutPage.jsx

import Navbar from "../../components/layout/Navbar/Navbar";
import Footer from "../../components/layout/Footer";
import AboutHero from "./AboutHero";
import AboutProblemSolution from "./AboutProblemSolution";
import AboutValuesTeam from "./AboutValuesTeam";

const AboutPage = () => {
  return (
    <>
      <Navbar />

      <div className="relative min-h-screen overflow-hidden">

        {/* Base Gradient (MATCH HERO) */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-100" />

        {/* Glow Elements */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-200 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-200 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">
          <AboutHero />
          <AboutProblemSolution />
          <AboutValuesTeam />
        </div>

      </div>

      <Footer />
    </>
  );
};

export default AboutPage;