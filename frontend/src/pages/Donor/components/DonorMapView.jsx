import { motion } from "framer-motion";
import RequestMapView from "../../../components/Request/RequestMapView";

const DonorMapView = ({ bloodGroup }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="h-full"
    >
      <RequestMapView selectedBloodGroup={bloodGroup} radius={10} />
    </motion.div>
  );
};

export default DonorMapView;
