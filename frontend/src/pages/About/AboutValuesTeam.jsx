// src/pages/About/AboutValuesTeam.jsx

import { ShieldCheck, Users, Zap, Linkedin, Github } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    desc: "Secure systems ensure safe emergency connections.",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Helping people when it matters most.",
  },
  {
    icon: Zap,
    title: "Faster Response",
    desc: "Real-time technology saves lives.",
  },
];

const team = [
  {
    name: "Md Faizan Ali",
    image: "/team/faizan.png",
    linkedin: "https://www.linkedin.com/in/md-faizan-ali-801823322/",
    github: "https://github.com/mefaizankhan",
  },
  {
    name: "Vaishnavi Keshari",
    image: "/team/vaishnavi.png",
    linkedin: "https://www.linkedin.com/in/vaishnavi-keshari-667b4a26a/",
  },
  {
    name: "Mukesh Jaiswal",
    image: "/team/mukesh.png",
    linkedin: "https://www.linkedin.com/in/mukesh-jaiswal-21a01b255/",
    github: "https://github.com/mukesh417",
  },
];

const AboutValuesTeam = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16">
        {/* VALUES */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            Our Core Values
          </h2>

          <div className="space-y-5">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-white/70 border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  <Icon className="text-red-500 mb-3" size={26} />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">Visionaries</span>
          </h2>
          <p className="text-slate-500 mt-3 font-medium">The minds building the future of emergency response.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="group relative bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              
              {/* Hover Gradient Border Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-red-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-blue-400 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-28 h-28 mx-auto rounded-full object-cover border-4 border-white shadow-md z-10"
                />
              </div>

              <h4 className="text-xl font-bold text-slate-900">{member.name}</h4>
              <p className="text-sm font-semibold text-slate-500 mt-1">{member.role}</p>

              <div className="flex justify-center gap-4 mt-6">
                <a href={member.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-blue-50 hover:text-blue-600 text-slate-400 transition-colors">
                  <Linkedin size={20} />
                </a>
                {member.github && (
                  <a href={member.github} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 rounded-full hover:bg-slate-800 hover:text-white text-slate-400 transition-colors">
                    <Github size={20} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default AboutValuesTeam;
