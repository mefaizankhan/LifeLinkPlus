import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";
import Logo from "./Logo";
import ScrollToTopButton from "./ScrollToTopButton";

const Footer = () => {
  const socialIcons = [Facebook, Instagram, Linkedin, X];

  return (
    <>
      <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-gray-300 pt-12 md:pt-20 pb-6 md:pb-10 overflow-hidden">
        
        {/* Ambient Glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] 
          bg-red-600/10 blur-3xl rounded-full pointer-events-none"
        />

        <div className="relative max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14 lg:gap-16 items-start">

            {/* Brand */}
            <div>
              <div className="mb-4">
                <Logo />
              </div>

              <p className="text-gray-400 leading-relaxed max-w-sm text-sm">
                Connecting donors, patients, and hospitals in real-time to
                deliver faster emergency medical support when every second
                matters.
              </p>

              {/* Social Icons (Mobile only) */}
              <div className="flex lg:hidden gap-3 mt-5">
                {socialIcons.map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group p-2 bg-slate-800/80 rounded-lg border border-slate-700
                    hover:border-red-500 hover:bg-red-600/20 transition"
                  >
                    <Icon
                      size={16}
                      className="text-gray-400 group-hover:text-red-500 transition"
                    />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links (Hidden on Mobile) */}
            <div className="hidden md:block">
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>

              <ul className="space-y-3">
                {[
                  { label: "Home", path: "/" },
                  { label: "Emergency", path: "/emergency" },
                  { label: "About", path: "/about" },
                  { label: "Login", path: "/auth" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">
                Emergency Resources
              </h4>

              <ul className="space-y-3 text-gray-400 text-sm">
                {[
                  "Blood Banks",
                  "Hospitals",
                  "Ambulance Services",
                  "ICU Availability",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="hover:text-red-500 transition cursor-pointer"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact + Social */}
            <div className="flex items-start gap-8">
              
              {/* Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4">Contact</h4>

                <ul className="space-y-3 text-gray-400 text-sm">
                  <li>
                    <span className="text-gray-500">Email:</span> support@lifelink.com
                  </li>

                  <li>
                    <span className="text-gray-500">Phone:</span> +91 92349 44189
                  </li>

                  <li>
                    <span className="text-gray-500">Location:</span> Sultanpur, India
                  </li>
                </ul>
              </div>

              {/* Social Icons (Desktop only) */}
              <div className="hidden lg:flex flex-col gap-2">
                {socialIcons.map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="group p-3 bg-slate-800/80 rounded-xl border border-slate-700
                    hover:border-red-500 hover:bg-red-600/20
                    transition-all duration-300"
                  >
                    <Icon
                      size={18}
                      className="text-gray-400 group-hover:text-red-500 transition"
                    />
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div className="mt-12 md:mt-16 border-t border-slate-800/60"></div>

          {/* Bottom */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LifeLink+. All rights reserved.
          </div>

        </div>
      </footer>

      <ScrollToTopButton />
    </>
  );
};

export default Footer;