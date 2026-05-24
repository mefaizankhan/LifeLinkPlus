// src/components/layout/Navbar/MobileMenu.jsx

import { motion, AnimatePresence } from "framer-motion";
import MobileProfileCard from "./MobileProfileCard";

const MobileMenu = ({
  isOpen,
  navItems,
  isActive,
  handleNavigate,
  user,
  handleLogout,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-slate-950 z-40 flex flex-col items-center pt-10 px-6 overflow-y-auto"
        >
          {/* NAV ITEMS */}
          <div className="flex flex-col w-full max-w-xs space-y-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.path)}
                className={`cursor-pointer block w-full text-left text-xl font-semibold pl-4 border-l-2 transition
                ${
                  isActive(item.path)
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-slate-300 hover:text-white hover:border-slate-500"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* LOGIN BUTTON (IF USER NOT LOGGED IN) */}
          {!user && (
            <button
              onClick={() => handleNavigate("/auth")}
              className="cursor-pointer w-full max-w-xs mt-10 bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-full font-bold text-lg"
            >
              Login / Create Account
            </button>
          )}

          {/* PROFILE CARD (IF USER LOGGED IN) */}
          {user && (
            <MobileProfileCard user={user} handleLogout={handleLogout} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
