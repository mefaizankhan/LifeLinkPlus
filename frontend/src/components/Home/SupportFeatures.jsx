import { GroupAnimation, motion } from "framer-motion";
import {
  Hospital,
  Droplet,
  Wind,
  Bed,
  Ambulance,
  HouseHeart,
} from "lucide-react";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 120 }, // comes from far right
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const Feature = ({ icon, text }) => (
  <motion.div
    variants={itemVariants}
    className="group flex items-center gap-4
               p-3 rounded-xl
               hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100
               hover:shadow-md
               transition-all duration-300"
  >
    {/* Glow Icon */}
    <div className="relative flex items-center justify-center w-8 h-8">
      <div className="absolute w-8 h-8 bg-red-400 rounded-full blur-md opacity-20 group-hover:opacity-50 transition-all duration-300" />
      <div className="relative text-red-500">{icon}</div>
    </div>

    <span className="font-medium text-slate-700">{text}</span>
  </motion.div>
);

const SupportFeatures = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className="space-y-4"
    >
      <Feature icon={<Droplet size={20} />} text="Blood Banks" />
      <Feature icon={<Hospital size={20} />} text="Nearby Hospitals" />
      <Feature icon={<Wind size={20} />} text="Oxygen Support" />
      <Feature icon={<Bed size={20} />} text="ICU Beds" />
      <Feature icon={<Ambulance size={20} />} text="Ambulance Services" />
      <Feature icon={<HouseHeart size={20} />} text="Community Support" />
    </motion.div>
  );
};

export default SupportFeatures;
