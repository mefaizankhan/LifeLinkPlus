import { Droplet, UserPlus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import HeroActionCard from "./HeroActionCard";

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const HeroContent = () => {
  const navigate = useNavigate();

  // 🔥 Get user from context (NOT localStorage)
  const { user } = useContext(AuthContext);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-16 text-center pt-20 md:pt-20 lg:pt-16">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[3.3rem]
                   font-bold tracking-tight
                   text-slate-900 leading-[1.2]
                   max-w-md sm:max-w-xl lg:max-w-none mx-auto"
      >
        Instantly Connect with{" "}
        <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
          Nearby Blood Donors
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-5 md:mt-8 text-sm md:text-lg text-slate-600 max-w-2xl mx-auto leading-snug md:leading-relaxed"
      >
        A real-time, location-based emergency support platform designed to
        intelligently match donors and patients when every second matters.
      </motion.p>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-20 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto mt-8 md:mt-10 rounded-full"
      />

      {/* Action Cards */}
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {/* Request Blood */}
        <HeroActionCard
          icon={<Droplet size={30} className="text-red-600" />}
          title="Request Blood"
          description="Raise an emergency request and instantly notify nearby eligible donors."
          buttonText="Start Request"
          buttonColor="bg-red-600 hover:bg-red-700"
          hoverBorderColor="hover:border-red-400"
          count={780}
          onClick={() => navigate("/request-blood")}
        />

        {/* Become / Donate */}
        <HeroActionCard
          icon={<UserPlus size={30} className="text-green-600" />}
          title="Become a Donor"
          description="Register as a donor and help save lives in your local community."
          buttonText={
            user
              ? user.isDonor
                ? "Donate Now"
                : "Become Donor"
              : "Register Now"
          }
          buttonColor="bg-green-600 hover:bg-green-700"
          hoverBorderColor="hover:border-green-400"
          count={2450}
          onClick={() => {
            if (!user) {
              navigate("/auth");
            } else if (!user.isDonor) {
              navigate("/become-donor");
            } else {
              navigate("/donate");
            }
          }}
        />

        {/* Community */}
        <HeroActionCard
          icon={<MessageSquare size={30} className="text-blue-600" />}
          title="Community"
          description="Share updates, spread awareness, and connect with others in our social space."
          buttonText="Explore Community"
          buttonColor="bg-blue-600 hover:bg-blue-700"
          hoverBorderColor="hover:border-blue-400"
          count={520}
          onClick={() => navigate("/community")}
        />
      </motion.div>
    </div>
  );
};

export default HeroContent;
