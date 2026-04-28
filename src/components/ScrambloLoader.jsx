import { useEffect, useState } from "react";

const text = "Scramblo".split("");

function ScrambloLoader({ size = "md", fullScreen = false }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % text.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "text-sm gap-1",
    md: "text-xl gap-1.5",
    lg: "text-4xl gap-2",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-white z-[999]" : ""
      }`}
    >
      <div className={`flex font-bold tracking-wide ${sizeClasses[size]}`}>
        {text.map((char, index) => (
          <span
            key={index}
            className={`transition-all duration-300
              ${
                index === activeIndex
                  ? "scale-125 text-black"
                  : "scale-100 text-gray-400"
              }`}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ScrambloLoader;