import { motion } from "framer-motion";

// Random animation
const generateAnimation = () => {
  const random = (min, max) => Math.random() * (max - min) + min;

  return {
    x: [0, random(-400, 400), random(-300, 300), 0],
    y: [0, random(-400, 400), random(-300, 300), 0],
    scale: [1, random(1.2, 1.5), random(0.8, 1.2), 1],
  };
};

function Blob({ className, duration }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[100px] opacity-70 mix-blend-overlay ${className}`}
      animate={generateAnimation()}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* 🔴 Red */}
      <Blob
        className="top-[10%] left-[15%] w-[500px] h-[500px] bg-gradient-to-r from-red-600 via-pink-500 to-rose-400"
        duration={10}
      />

      {/* 🔵 Cyan */}
      <Blob
        className="bottom-[10%] right-[10%] w-[420px] h-[420px] bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600"
        duration={12}
      />

      {/* 🟠 Orange */}
      <Blob
        className="top-[40%] left-[40%] w-[360px] h-[360px] bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400"
        duration={14}
      />

      {/* 🟣 Purple */}
      <Blob
        className="top-[70%] left-[20%] w-[320px] h-[320px] bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500"
        duration={11}
      />

      {/* 🟡 Yellow */}
      <Blob
        className="top-[20%] right-[25%] w-[450px] h-[450px] bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500"
        duration={13}
      />

      {/* 🔷 Teal */}
      <Blob
        className="bottom-[20%] left-[35%] w-[380px] h-[380px] bg-gradient-to-r from-teal-500 via-cyan-400 to-blue-500"
        duration={15}
      />
    </div>
  );
}

export default AnimatedBackground;