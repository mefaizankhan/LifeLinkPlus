import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { monthlyData, growthData } from "./data";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const chartCardStyle =
  "group relative bg-white/90 backdrop-blur-sm rounded-3xl border border-white/60 p-6 md:p-10 shadow-[0_25px_70px_rgba(239,68,68,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_90px_rgba(239,68,68,0.15)] overflow-hidden";

const ImpactCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      {/* Monthly Activity */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={chartCardStyle}
      >
        <div
          className="absolute -top-12 -right-12 w-44 h-44 
          bg-red-200/40 rounded-full blur-3xl 
          opacity-0 group-hover:opacity-100 
          transition duration-500"
        />

        <h3 className="relative z-10 text-lg md:text-xl font-semibold mb-6 md:mb-8 text-slate-900">
          Monthly Donor & Request Activity
        </h3>

        <div className="h-64 md:h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="donors" fill="#ef4444" radius={[6, 6, 0, 0]} />
              <Bar dataKey="requests" fill="#1f2937" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Growth Trend */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={chartCardStyle}
      >
        <div
          className="absolute -top-12 -right-12 w-44 h-44 
          bg-red-200/40 rounded-full blur-3xl 
          opacity-0 group-hover:opacity-100 
          transition duration-500"
        />

        <h3 className="relative z-10 text-lg md:text-xl font-semibold mb-6 md:mb-8 text-slate-900">
          Platform Growth Trend
        </h3>

        <div className="h-64 md:h-72 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactCharts;
