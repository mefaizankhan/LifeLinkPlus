import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Users, HeartPulse, Building2, MapPin } from "lucide-react";

const stats = [
  {
    value: 2450,
    suffix: "+",
    label: "Registered Donors",
    icon: <Users size={18} className="text-red-500" />,
  },
  {
    value: 780,
    suffix: "+",
    label: "Emergency Requests",
    icon: <HeartPulse size={18} className="text-red-500" />,
  },
  {
    value: 52,
    suffix: "+",
    label: "Partner Hospitals",
    icon: <Building2 size={18} className="text-red-500" />,
  },
  {
    value: 32,
    suffix: "+",
    label: "Cities Covered",
    icon: <MapPin size={18} className="text-red-500" />,
  },
];

const ImpactStats = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8"
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative
            bg-white/90 backdrop-blur-sm
            rounded-3xl
            border border-white/60
            p-6 md:p-10
            text-center
            shadow-[0_25px_70px_rgba(239,68,68,0.08)]
            transition-all duration-500
            hover:-translate-y-2
            hover:shadow-[0_35px_90px_rgba(239,68,68,0.15)]
            overflow-hidden"
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-10 -right-10 w-40 h-40 
            bg-red-200/40 rounded-full blur-3xl 
            opacity-0 group-hover:opacity-100 
            transition duration-500"
          />

          <h3 className="relative z-10 text-3xl md:text-4xl font-bold text-red-600">
            {inView ? (
              <CountUp end={stat.value} duration={2.5} separator="," />
            ) : (
              0
            )}
            {stat.suffix}
          </h3>

          <p className="relative z-10 mt-3 text-slate-600 font-medium flex items-center justify-center gap-2">
            {stat.icon}
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ImpactStats;