// src/components/layout/Navbar/Navbar.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Logo from "../Logo";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Request Blood", path: "/request-blood" },
    { name: "Emergency", path: "/emergency" },
    { name: "Community", path: "/community" },
    { name: "About", path: "/about" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/70 backdrop-blur-lg border-b border-slate-700">
        <div className="flex justify-between items-center h-16 px-4 sm:px-6">
          {/* LOGO */}
          <div className="cursor-pointer" onClick={() => handleNavigate("/")}>
            <Logo />
          </div>

          <DesktopNav
            navItems={navItems}
            isActive={isActive}
            handleNavigate={handleNavigate}
            user={user}
            handleLogout={handleLogout}
          />

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center text-white cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <X size={26} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute"
                >
                  <Menu size={26} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      <MobileMenu
        isOpen={isOpen}
        navItems={navItems}
        isActive={isActive}
        handleNavigate={handleNavigate}
        user={user}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Navbar;
