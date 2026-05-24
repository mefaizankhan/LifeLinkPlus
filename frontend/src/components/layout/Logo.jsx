import React from "react";

const Logo = ({ size = 60 }) => {
  const textSize = size * 0.5; // adjust ratio if needed
  const plusSize = size * 0.35;

  return (
    <div className="flex items-center gap-3">
      {/* SVG ICON */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blood Drop */}
        <path
          d="M50 5 C35 30, 15 45, 15 65 A35 35 0 0 0 85 65 C85 45, 65 30, 50 5 Z"
          fill="#E53935"
        />

        {/* Medical Cross */}
        <rect x="45" y="31" width="10" height="28" fill="white" />
        <rect x="36" y="40" width="28" height="10" fill="white" />

        <style>
          {`
            @keyframes drawEcg {
              0% { stroke-dashoffset: 100; }
              50% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -100; }
            }
          `}
        </style>

        {/* Static Background Line */}
        <polyline
          points="15,76 30,76 38,66 45,86 55,62 65,76 85,76"
          fill="none"
          stroke="black"
          strokeWidth="2.5"
          opacity="0.5"
        />

        {/* Animated Moving Line */}
        <polyline
          points="15,76 30,76 38,66 45,86 55,62 65,76 85,76"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          pathLength="100"
          strokeDasharray="40 60"
          style={{ animation: "drawEcg 2s infinite linear" }}
        />
      </svg>

      {/* TEXT (Responsive to size) */}
      <h1
        className="font-bold flex items-baseline select-none"
        style={{ fontSize: `${textSize}px`, cursor: "pointer" }}
      >
        <span className="text-blue-600">Life</span>
        <span className="text-green-600">Link</span>
        <span
          className="text-red-600 relative ml-1"
          style={{
            fontSize: `${plusSize}px`,
            top: `${-size * 0.15}px`,
            position: "relative",
          }}
        >
          +
        </span>
      </h1>
    </div>
  );
};

export default Logo;
