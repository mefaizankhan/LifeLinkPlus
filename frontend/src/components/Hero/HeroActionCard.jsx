import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HeroActionCard = ({
  icon,
  title,
  description,
  buttonText,
  buttonColor,
  hoverBorderColor,
  count,
  onClick,
}) => {
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8 }}
      className={`group bg-white rounded-3xl p-6 md:p-8
                  shadow-lg hover:shadow-2xl
                  border border-slate-200
                  transition-all duration-300
                  ${hoverBorderColor}`}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 md:w-16 md:h-16 mx-auto flex items-center justify-center
                   rounded-2xl bg-slate-100
                   group-hover:scale-110 transition-transform duration-300"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-5 text-lg md:text-xl font-semibold text-slate-900">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 text-slate-600 text-sm">
        {description}
      </p>

      {/* Animated Counter */}
      <div className="mt-5">
        <AnimatedCounter target={count} />
      </div>

      {/* Button */}
      <button
        onClick={onClick}
        className={`mt-6 px-6 md:px-7 py-2.5 md:py-3 rounded-xl text-sm font-semibold
                    text-white transition-all duration-300 cursor-pointer
                    ${buttonColor}`}
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export default HeroActionCard;