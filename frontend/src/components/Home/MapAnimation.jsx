import { motion } from "framer-motion";
import { MapPin, Hospital, Ambulance, User, HeartPulse } from "lucide-react";

const MapAnimation = () => {
  return (
    <div className="relative w-[360px] h-[360px] flex items-center justify-center">
      {/* Soft Glow */}
      <div className="absolute w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-30" />

      {/* SVG Lines */}
      <svg
        className="absolute w-full h-full z-10"
        viewBox="0 0 360 360"
        fill="none"
      >
        {[
          { x: 180, y: 40 },
          { x: 320, y: 180 },
          { x: 180, y: 320 },
          { x: 40, y: 180 },
        ].map((point, i) => (
          <motion.path
            key={i}
            d={`M180 180 L${point.x} ${point.y}`}
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </svg>

      {/* Center */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative z-20 flex items-center justify-center
                   w-20 h-20 bg-red-600 rounded-full shadow-2xl"
      >
        <MapPin size={36} className="text-white" />
      </motion.div>

      {/* Nodes - Perfectly Balanced */}

      {/* Top */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-4 left-1/2 -translate-x-1/2 text-red-500"
      >
        <Hospital size={30} />
      </motion.div>

      {/* Right */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
      >
        <Ambulance size={30} />
      </motion.div>

      {/* Bottom */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-red-500"
      >
        <HeartPulse size={30} />
      </motion.div>

      {/* Left */}
      <motion.div
        animate={{ x: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500"
      >
        <User size={30} />
      </motion.div>
    </div>
  );
};

export default MapAnimation;
